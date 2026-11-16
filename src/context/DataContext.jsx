import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { API_BASE, api } from '../lib/api'
import { readStore, writeStore } from '../lib/format'
import { useNav } from './NavContext'

const Ctx = createContext(null)
export const useData = () => useContext(Ctx)

const BLANK = { mode: null, done: null }

export function DataProvider({ children }) {
  const { go, openProject } = useNav()
  const [data, setData] = useState(null)
  const [loadErr, setLoadErr] = useState(null)
  const [fstate, setFstate] = useState({})                       // flag id -> {open, mode, touched, pending, err, done, advice, adviceState}
  const [fdef, setFdef] = useState(() => readStore('dx-fdef', {})) // flag type -> default action mode
  const [cs, setCs] = useState({ cases: [], ladder: {}, mail: {}, clock: {} })
  const [brief, setBrief] = useState({ busy: false, data: null })
  const [links, setLinks] = useState(null)
  const scrollTo = useRef(null)

  const setCases = useCallback((p) => setCs((c) => ({ cases: p.cases ?? c.cases, ladder: p.ladder ?? c.ladder, mail: p.mail ?? c.mail, clock: p.clock ?? c.clock })), [])

  const loadBrief = useCallback(async (refresh) => {
    setBrief((b) => ({ ...b, busy: true }))
    try { const d = await api('/api/brief' + (refresh ? '?refresh=1' : '')); setBrief({ busy: false, data: d }) } catch { setBrief({ busy: false, data: null }) }
  }, [])
  const loadLinks = useCallback(async () => {
    try { setLinks((await api('/api/links')).links) } catch { setLinks([]) }
  }, [])

  const load = useCallback(async (reload) => {
    try {
      const d = await api('/api/dashboard' + (reload ? '?reload=1' : ''))
      setData(d); setLoadErr(null); setCases(d)
      setFstate((old) => {
        const st = {}
        for (const [id, s] of Object.entries(old)) if (s.open) st[id] = { ...s, done: null }
        for (const [id, s] of Object.entries(d.flag_states || {})) st[id] = { ...BLANK, ...st[id], done: s.done }
        return st
      })
      loadBrief(); loadLinks()
    } catch (e) { setLoadErr(e.message) }
  }, [setCases, loadBrief, loadLinks])

  useEffect(() => { load() }, [load])
  const reload = useCallback(() => { setData(null); setLoadErr(null); load(true) }, [load])

  /* ---- sources ---- */
  const loadedAt = data?.loaded_at || ''
  const fileUrl = (kind, name) => `${API_BASE}/files/${kind}/${encodeURIComponent(name)}`
  const sources = useMemo(() => {
    const s = {}
    if (data) {
      const S = data.sources
      for (const w of S.departments) s[w.ref] = { k: 'excel', name: w.name, when: `Edited ${w.modified} · loaded ${data.loaded_at}`, group: 'Department data', url: fileUrl('departments', w.name) }
      s.workbook = { k: 'excel', name: S.workbook.name, when: `Edited ${S.workbook.modified} · loaded ${S.workbook.loaded}`, group: 'Project data', url: API_BASE + '/files/workbook' }
      for (const a of S.agreements) s['doc:' + a.ref] = { k: 'word', name: a.name, when: 'Signed agreement', group: 'Project agreements', url: fileUrl('agreements', a.name) }
      s.calc = { k: 'calc', name: 'Executive 360 calculations', when: 'Calculated ' + data.loaded_at, group: 'Calculated' }
    }
    return s
  }, [data])

  /** API source -> citation {S, loc, used, pv} */
  const citeFrom = useCallback((s) => {
    const pv = s.excerpt ? { t: 'quote', text: s.excerpt } : (s.record && s.record.length ? { t: 'record', rows: s.record } : null)
    let S
    if (s.kind === 'word') S = sources['doc:' + s.ref] || { k: 'word', name: s.name, when: 'Signed agreement', group: 'Project agreements', url: fileUrl('agreements', s.name) }
    else if (s.kind === 'calc') S = sources.calc || { k: 'calc', name: 'Executive 360 calculations', when: 'Calculated', group: 'Calculated' }
    else S = sources[s.ref] || { k: 'excel', name: s.name, when: 'Loaded ' + loadedAt, group: 'Department data' }
    return { S, loc: s.locator, used: s.used_for || '', pv }
  }, [sources, loadedAt])

  const depts = useMemo(() => data?.departments || [], [data])
  const deptById = useCallback((id) => depts.find((d) => d.id === id), [depts])
  const projects = useMemo(() => data?.projects || [], [data])
  const projById = useCallback((id) => projects.find((p) => p.id === id), [projects])
  const flags = useMemo(() => (data ? depts.flatMap((d) => d.flags).concat(data.flags).map((f) => ({ ...f, cites: f.sources.map(citeFrom) })) : []), [data, depts, citeFrom])
  const isDone = useCallback((id) => !!(fstate[id] && fstate[id].done), [fstate])
  const openFlags = useMemo(() => flags.filter((f) => !(fstate[f.id] && fstate[f.id].done)), [flags, fstate])
  const caseOf = useCallback((flagId) => cs.cases.find((c) => c.flag_id === flagId && c.open), [cs.cases])
  const needsYou = useMemo(() => cs.cases.filter((c) => c.needs_ceo).length, [cs.cases])

  /* ---- flag actions ---- */
  const patchFlag = useCallback((id, patch) => setFstate((s) => ({ ...s, [id]: { ...BLANK, ...s[id], ...patch } })), [])
  const defaultFor = (f, def) => (def[f.type] && !(def[f.type] === 'auto' && !f.auto.allowed) ? def[f.type] : null)

  const needAdvice = useCallback((f) => {
    if (!data?.assistant) return
    let skip = false
    setFstate((s) => { if (s[f.id]?.adviceState) skip = true; return s })
    if (skip) return
    patchFlag(f.id, { adviceState: 'loading' })
    api(`/api/flags/${encodeURIComponent(f.id)}/advice`)
      .then((a) => patchFlag(f.id, { advice: { ...a, cites: (a.sources || []).map(citeFrom) }, adviceState: 'ok' }))
      .catch(() => patchFlag(f.id, { adviceState: 'err' }))
  }, [data, patchFlag, citeFrom])

  const flagApi = useMemo(() => ({
    open: (f) => {
      setFstate((s) => {
        const st = { ...BLANK, ...s[f.id], open: true }
        const d = defaultFor(f, fdef)
        if (st.mode === null && !st.touched && d) { st.mode = d; st.touched = true }
        return { ...s, [f.id]: st }
      })
      needAdvice(f)
    },
    close: (f) => patchFlag(f.id, { open: false, mode: null, err: null }),
    toggleMode: (f, m, disabled) => setFstate((s) => {
      const st = { ...BLANK, ...s[f.id], err: null }
      st.mode = disabled ? 'auto' : (st.mode === m ? null : m)
      return { ...s, [f.id]: st }
    }),
    cancel: (f) => patchFlag(f.id, { mode: null, open: true, err: null }),
    run: async (f, action, extra = {}) => {
      patchFlag(f.id, { pending: true, err: null })
      try {
        const r = await api(`/api/flags/${encodeURIComponent(f.id)}/action`, { action, ...extra })
        if (action === 'undo') patchFlag(f.id, { done: null, mode: null, open: true, pending: false })
        else patchFlag(f.id, { done: r.state.done, pending: false })
        try { setCases(await api('/api/cases')) } catch { /* ignore */ }
      } catch (err) { patchFlag(f.id, { err: err.message, pending: false }) }
    },
    setDefault: (f, checked) => {
      const mode = fstate[f.id]?.mode
      const next = { ...fdef }
      if (checked && mode) next[f.type] = mode; else delete next[f.type]
      setFdef(next); writeStore('dx-fdef', next)
      setFstate((s) => {
        const out = { ...s }
        for (const o of flags) {
          const st = s[o.id]
          const d = defaultFor(o, next)
          if (o.type === f.type && st && st.open && st.mode === null && !st.touched && d) out[o.id] = { ...st, mode: d, touched: true }
        }
        return out
      })
    },
  }), [fdef, fstate, flags, patchFlag, needAdvice, setCases])

  /** Go to a flag: open its card (and ask the agent for advice), show its page, scroll to it. */
  const openFlag = useCallback((id) => {
    const f = flags.find((x) => x.id === id)
    if (!f) return
    flagApi.open(f)
    scrollTo.current = f.id
    if (f.proj) openProject(f.proj); else go(f.dept)
    setTimeout(() => {
      const el = document.querySelector(`[data-flag="${CSS.escape(f.id)}"]`)
      if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, 80)
  }, [flags, flagApi, go, openProject])

  const value = useMemo(() => ({
    data, loadErr, loadedAt, reload, depts, deptById, projects, projById, flags, openFlags, sources, citeFrom,
    fstate, fdef, flagApi, isDone, openFlag, cs, setCases, caseOf, needsYou, brief, loadBrief, links,
  }), [data, loadErr, loadedAt, reload, depts, deptById, projects, projById, flags, openFlags, sources, citeFrom, fstate, fdef, flagApi, isDone, openFlag, cs, setCases, caseOf, needsYou, brief, loadBrief, links])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

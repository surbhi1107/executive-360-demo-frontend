import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { api } from '../lib/api'
import { prefersReducedMotion, readStore, writeStore } from '../lib/format'
import { decode, plain } from '../lib/rich'
import { ANSWERS, PROJECT_RE, QR_DEFAULT } from '../data/sample'
import { useData } from './DataContext'
import { useNav } from './NavContext'

const Ctx = createContext(null)
export const useAsk = () => useContext(Ctx)

export function AskProvider({ children }) {
  const { go } = useNav()
  const { projects, citeFrom, registerCalc } = useData()

  const [thread, setThread] = useState([])   // {id, q, rep, status: 'loading'|'answer'|'error', answer, err}
  const [busy, setBusy] = useState(false)
  const busyRef = useRef(false)
  const history = useRef([])                 // last few Q/A pairs sent to the assistant for follow-ups
  const seq = useRef(0)
  const inputRef = useRef(null)              // the Ask view's input, focused when an answer finishes
  const projectsRef = useRef(projects)
  projectsRef.current = projects

  const setBusyBoth = (v) => { busyRef.current = v; setBusy(v) }
  const isProjectQ = (q) => PROJECT_RE.test(q) || projectsRef.current.some((p) => q.toLowerCase().includes(p.name.toLowerCase().split(' ')[0]))

  const patch = (id, p) => setThread((t) => t.map((m) => (m.id === id ? { ...m, ...p } : m)))

  const ask = useCallback(async (q, rep) => {
    if (busyRef.current) return
    setBusyBoth(true)
    go('ask')
    const id = ++seq.current
    setThread((t) => [...t, { id, q, rep, status: 'loading' }])

    const canned = ANSWERS.find((x) => x.k.test(q))
    if (!isProjectQ(q) && canned) {
      setTimeout(() => patch(id, { status: 'answer', answer: { ...canned, live: false } }), prefersReducedMotion() ? 0 : 650)
      return
    }
    try {
      const r = await api('/api/ask', { question: q, history: history.current.slice(-3) })
      history.current.push({ q, a: (r.hero ? decode(r.hero) + '. ' : '') + plain(r.body) })
      if (r.sources.some((s) => s.kind === 'calc')) registerCalc()
      patch(id, { status: 'answer', answer: { hero: r.hero, body: r.body, list: r.list && r.list.length ? r.list : null, chart: r.chart || null, src: r.sources.map(citeFrom), f: r.followups || [], live: true } })
    } catch (err) {
      patch(id, { status: 'error', err: err.message })
      setBusyBoth(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [go, citeFrom, registerCalc])

  const finished = useCallback(() => {
    setBusyBoth(false)
    if (inputRef.current) inputRef.current.focus({ preventScroll: true })
  }, [])

  /* ---- quick reports (persisted) ---- */
  const [qr, setQrState] = useState(() => { const s = readStore('dx-qr', null); return Array.isArray(s) ? s : QR_DEFAULT.slice() })
  const setQr = useCallback((next) => { setQrState(next); writeStore('dx-qr', next) }, [])
  const isPinned = useCallback((q) => qr.some((r) => r.q.toLowerCase() === q.toLowerCase()), [qr])
  const addReport = useCallback((q, v) => {
    const name = q.replace(/\?$/, '').replace(/^(what is|what are|how is|how are|why is|why did|show me|give me)\s+/i, '')
    setQr([...qr, { id: 'p' + Date.now(), name: name.charAt(0).toUpperCase() + name.slice(1), cadence: 'Pinned', q, v }])
  }, [qr, setQr])

  const value = useMemo(() => ({
    thread, busy, ask, finished, inputRef, qr, setQr, isPinned, addReport, resetQr: () => setQr(QR_DEFAULT.slice()),
  }), [thread, busy, ask, finished, qr, setQr, isPinned, addReport])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

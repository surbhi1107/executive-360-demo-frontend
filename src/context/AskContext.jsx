import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { api } from '../lib/api'
import { readStore, writeStore } from '../lib/format'
import { QR_DEFAULT } from '../lib/kinds'
import { decode, plain } from '../lib/rich'
import { useData } from './DataContext'
import { useNav } from './NavContext'

const Ctx = createContext(null)
export const useAsk = () => useContext(Ctx)

/** One chat thread per agent: 'all' (the Ask page; the server picks the agent) and one per department. */
export function AskProvider({ children }) {
  const { go, view } = useNav()
  const { citeFrom } = useData()
  const [threads, setThreads] = useState({})   // agent -> [{id, q, rep, status: 'loading'|'answer'|'error', answer, err}]
  const [busy, setBusy] = useState(false)
  const busyRef = useRef(false)
  const histories = useRef({})
  const seq = useRef(0)
  const viewRef = useRef(view)
  viewRef.current = view

  const setBusyBoth = (v) => { busyRef.current = v; setBusy(v) }
  const patch = (agent, id, p) => setThreads((t) => ({ ...t, [agent]: (t[agent] || []).map((m) => (m.id === id ? { ...m, ...p } : m)) }))

  /** o.agent: 'all' or a department id. o.rep: a quick report. o.dept: force a department. */
  const ask = useCallback(async (q, o = {}) => {
    if (busyRef.current) return
    setBusyBoth(true)
    const agent = o.agent || 'all'
    if (agent === 'all') { if (viewRef.current !== 'ask') go('ask') } else if (viewRef.current !== agent) go(agent, true)
    const id = ++seq.current
    setThreads((t) => ({ ...t, [agent]: [...(t[agent] || []), { id, q, rep: o.rep, status: 'loading' }] }))
    const hist = (histories.current[agent] ||= [])
    try {
      const r = await api('/api/ask', { question: q, dept: o.dept || (agent === 'all' ? null : agent), history: hist.slice(-3) })
      hist.push({ q, a: (r.hero ? decode(r.hero) + '. ' : '') + plain(r.body) })
      patch(agent, id, { status: 'answer', answer: { ...r, src: (r.sources || []).map(citeFrom) } })
    } catch (err) {
      patch(agent, id, { status: 'error', err: err.message })
      setBusyBoth(false)
    }
  }, [go, citeFrom])

  const finished = useCallback(() => {
    setBusyBoth(false)
    const inputs = [...document.querySelectorAll('[data-ask-input]')].filter((el) => el.offsetParent !== null)
    if (inputs[0]) inputs[0].focus({ preventScroll: true })
  }, [])

  /* ---- quick reports (persisted) ---- */
  const [qr, setQrState] = useState(() => { const s = readStore('dx-qr2', null); return Array.isArray(s) ? s : QR_DEFAULT.slice() })
  const setQr = useCallback((next) => { setQrState(next); writeStore('dx-qr2', next) }, [])
  const isPinned = useCallback((q) => qr.some((r) => r.q.toLowerCase() === q.toLowerCase()), [qr])
  const addReport = useCallback((q, v, dept) => {
    const name = q.replace(/\?$/, '').replace(/^(what is|what are|how is|how are|why is|why did|show me|give me)\s+/i, '')
    setQr([...qr, { id: 'p' + Date.now(), name: name.charAt(0).toUpperCase() + name.slice(1), cadence: 'Pinned', q, v, dept }])
  }, [qr, setQr])

  const value = useMemo(() => ({
    threads, busy, ask, finished, qr, setQr, isPinned, addReport, resetQr: () => setQr(QR_DEFAULT.slice()),
  }), [threads, busy, ask, finished, qr, setQr, isPinned, addReport])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

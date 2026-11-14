import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const Ctx = createContext(null)
export const useSheet = () => useContext(Ctx)

/** Slide-over sheet with a back stack. Items: {type:'attn', a} | {type:'cite', c} | {type:'sources'} */
export function SheetProvider({ children }) {
  const [stack, setStack] = useState([])
  const lastFocus = useRef(null)
  const isOpen = stack.length > 0
  const openRef = useRef(false)
  openRef.current = isOpen

  const push = useCallback((item) => {
    if (!openRef.current) { lastFocus.current = document.activeElement; setStack([item]) }
    else setStack((s) => [...s, item])
  }, [])
  const back = useCallback(() => setStack((s) => s.slice(0, -1)), [])
  const close = useCallback(() => {
    setStack([])
    const el = lastFocus.current
    if (el) { try { el.focus() } catch { /* ignore */ } }
  }, [])

  const value = useMemo(() => ({
    stack, isOpen, push, back, close,
    openAttn: (a) => push({ type: 'attn', a }),
    openCite: (c) => push({ type: 'cite', c }),
    openAllSources: () => push({ type: 'sources' }),
  }), [stack, isOpen, push, back, close])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

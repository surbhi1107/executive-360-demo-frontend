import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { isDept } from '../lib/kinds'

const Ctx = createContext(null)
export const useNav = () => useContext(Ctx)

const valid = (v) => v === 'home' || v === 'ask' || v === 'followups' || isDept(v) // settings is not mirrored in the URL

export function NavProvider({ children }) {
  const [view, setView] = useState(() => {
    const start = (window.location.hash || '').slice(1)
    return valid(start) ? start : 'home'
  })
  const [curProject, setCurProject] = useState(null)
  const viewRef = useRef(view)
  viewRef.current = view

  const go = useCallback((v, keepProject = false) => {
    setView(v)
    if (v !== 'projects' && !keepProject) setCurProject(null)
    if (valid(v)) { try { window.history.replaceState(null, '', '#' + v) } catch { /* ignore */ } }
    window.scrollTo({ top: 0 })
  }, [])

  const openProject = useCallback((id) => { setCurProject(id); setView('projects'); try { window.history.replaceState(null, '', '#projects') } catch { /* ignore */ } window.scrollTo({ top: 0 }) }, [])

  useEffect(() => {
    try { window.history.replaceState(null, '', '#' + viewRef.current) } catch { /* ignore */ }
    const onHash = () => {
      const v = window.location.hash.slice(1)
      if (valid(v) && v !== viewRef.current) go(v)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [go])

  const value = useMemo(() => ({ view, go, curProject, setCurProject, openProject }), [view, go, curProject, openProject])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

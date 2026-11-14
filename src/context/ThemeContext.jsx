import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { writeStore } from '../lib/format'

const Ctx = createContext(null)
export const useTheme = () => useContext(Ctx)

/** 'light' | 'dark' | 'system'. System follows the OS via the CSS media query in index.css. */
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => { try { return localStorage.getItem('dx-theme') || 'system' } catch { return 'system' } })
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', theme)
  }, [theme])
  const setTheme = (t) => { setThemeState(t); writeStore('dx-theme', t) }
  const value = useMemo(() => ({ theme, setTheme }), [theme])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

import { createContext, useContext, useMemo, useState } from 'react'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

/** Demo login. The user name and password come from the build-time env (VITE_LOGIN_USER / VITE_LOGIN_PASSWORD).
 *  Vite copies VITE_ values into the public JavaScript bundle, so this only keeps casual visitors out of a demo.
 *  It is NOT real security: use a real identity provider for anything sensitive. */
const USER = (import.meta.env.VITE_LOGIN_USER || '').trim()
const PASS = import.meta.env.VITE_LOGIN_PASSWORD || ''
const KEY = 'dx-session'

const read = () => { try { return sessionStorage.getItem(KEY) === '1' } catch { return false } }
const write = (on) => { try { on ? sessionStorage.setItem(KEY, '1') : sessionStorage.removeItem(KEY) } catch { /* private mode */ } }

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(read)
  const configured = Boolean(USER && PASS)
  const value = useMemo(() => ({
    authed, configured, user: USER,
    login(u, p) {
      if (!configured) return false
      const ok = u.trim() === USER && p === PASS
      if (ok) { write(true); setAuthed(true) }
      return ok
    },
    logout() { write(false); setAuthed(false) },
  }), [authed, configured])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

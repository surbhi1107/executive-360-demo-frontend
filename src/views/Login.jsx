import { useState } from 'react'
import { ArrowRight, ChartColumn, Eye, EyeOff, FileText, LoaderCircle, LockKeyhole, ShieldCheck, TriangleAlert } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const POINTS = [
  [ChartColumn, 'One view of every project', 'Schedule, budget and risk in a single morning brief.'],
  [FileText, 'Answers with sources', 'Every figure points back to the workbook or agreement clause it came from.'],
  [ShieldCheck, 'Penalty exposure, early', 'Delay penalties are worked out from the contracts, not guessed.'],
]

const input = 'box-border h-11 w-full rounded-sm border border-ctl bg-surface px-3 text-16 text-ink placeholder:text-mute focus:border-accent'

export function Login() {
  const { login, configured } = useAuth()
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    // short pause so the button state is visible; the check itself is instant
    setTimeout(() => {
      if (!login(u, p)) { setErr('That user name and password do not match.'); setP(''); setBusy(false) }
    }, 350)
  }

  return (
    <div className="grid min-h-full grid-cols-[minmax(0,5fr)_minmax(0,6fr)] max-[900px]:grid-cols-[minmax(0,1fr)]">
      {/* brand side: quiet, one accent */}
      <aside className="flex flex-col justify-between bg-surface px-12 py-12 max-[900px]:hidden">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-sm bg-ink text-on-accent" style={{ color: 'var(--bg)' }}>
            <span className="text-15 font-semibold leading-none">E</span>
          </span>
          <div className="text-15 font-semibold leading-5">Executive 360°<small className="block text-12 font-medium leading-4 text-mute">deepvox.ai</small></div>
        </div>

        <div className="max-w-[400px]">
          <h2 className="text-34 font-semibold tracking-[-0.02em] [text-wrap:balance]">Your whole portfolio, in one calm view.</h2>
          <ul className="m-0 mt-10 flex list-none flex-col gap-6 p-0">
            {POINTS.map(([Icon, title, text]) => (
              <li key={title} className="flex gap-3.5">
                <span className="mt-0.5 grid size-8 flex-none place-items-center rounded-sm bg-accent-soft text-accent"><Icon size={16} strokeWidth={1.7} aria-hidden="true" /></span>
                <div><b className="text-15 font-semibold">{title}</b><p className="mt-0.5 text-14 text-mute">{text}</p></div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-12 text-mute">Demo environment · projects use live workbook data</p>
      </aside>

      {/* form side */}
      <main className="grid place-items-center px-6 py-12 max-[900px]:min-h-screen">
        <div className="w-full max-w-[380px]">
          <div className="mb-8 hidden items-center gap-2.5 max-[900px]:flex">
            <span className="grid size-8 place-items-center rounded-sm bg-ink"><span className="text-15 font-semibold leading-none" style={{ color: 'var(--bg)' }}>E</span></span>
            <span className="text-15 font-semibold">Executive 360°</span>
          </div>

          <h1 className="text-28 font-semibold tracking-[-0.015em]">Welcome back</h1>
          <p className="mt-1.5 text-14 text-mute">Sign in to open your morning brief.</p>

          <form onSubmit={submit} noValidate className="mt-8 flex flex-col gap-5">
            {!configured && (
              <p role="alert" className="m-0 flex gap-2 rounded-sm bg-fill px-3 py-2.5 text-13 text-caution">
                <TriangleAlert size={16} strokeWidth={1.7} className="mt-px flex-none" aria-hidden="true" />
                <span>Login is not set up. Add VITE_LOGIN_USER and VITE_LOGIN_PASSWORD to the environment, then rebuild.</span>
              </p>
            )}

            <label className="flex flex-col gap-1.5 text-13 font-medium">
              User name
              <input className={input} value={u} onChange={(e) => { setU(e.target.value); setErr('') }}
                autoComplete="username" autoFocus spellCheck="false" autoCapitalize="none" placeholder="Enter your user name"
                aria-invalid={err ? 'true' : undefined} />
            </label>

            <label className="flex flex-col gap-1.5 text-13 font-medium">
              Password
              <span className="relative block">
                <input className={input + ' pr-11'} type={show ? 'text' : 'password'} value={p}
                  onChange={(e) => { setP(e.target.value); setErr('') }} autoComplete="current-password" placeholder="Enter your password"
                  aria-invalid={err ? 'true' : undefined} />
                <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}
                  className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-sm border-0 bg-transparent text-mute hover:text-ink">
                  {show ? <EyeOff size={17} strokeWidth={1.6} aria-hidden="true" /> : <Eye size={17} strokeWidth={1.6} aria-hidden="true" />}
                </button>
              </span>
            </label>

            <div role="alert" aria-live="polite" className="-mt-1 min-h-[20px] text-13 text-critical">
              {err && <span className="flex items-center gap-1.5"><TriangleAlert size={14} strokeWidth={1.8} aria-hidden="true" />{err}</span>}
            </div>

            <button type="submit" disabled={!configured || !u || !p || busy}
              className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-sm border-0 bg-accent text-15 font-semibold text-on-accent transition-opacity active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-40">
              {busy ? <><LoaderCircle size={17} className="animate-spin" aria-hidden="true" />Signing in…</> : <>Sign in<ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" /></>}
            </button>
          </form>

          <p className="mt-8 flex items-center gap-1.5 text-12 text-mute"><LockKeyhole size={13} strokeWidth={1.6} aria-hidden="true" />Demo sign-in for this browser session only.</p>
        </div>
      </main>
    </div>
  )
}

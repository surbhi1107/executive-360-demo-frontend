import { useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useAsk } from '../context/AskContext'
import { cx } from './ui'

/** The rounded ask bar. agent = 'all' (server picks) or a department id; small = the compact one in agent panels. */
export function AskForm({ placeholder, agent = 'all', small, label = 'Ask Executive 360°' }) {
  const { ask, busy } = useAsk()
  const [v, setV] = useState('')
  const submit = (e) => {
    e.preventDefault()
    const q = v.trim()
    if (!q || busy) return
    setV('')
    ask(q, { agent })
  }
  return (
    <form onSubmit={submit} autoComplete="off"
      className={cx('flex items-center gap-3 bg-surface focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent',
        small ? 'rounded-md py-1.5 pl-4 pr-1.5 shadow-[inset_0_0_0_1px_var(--control-border)]'
          : 'rounded-lg py-3 pl-6 pr-3 shadow-card transition-shadow duration-200 ease-out focus-within:shadow-raised')}>
      <input data-ask-input value={v} onChange={(e) => setV(e.target.value)} aria-label={label} placeholder={placeholder}
        className={cx('min-w-0 flex-1 border-0 bg-transparent text-ink outline-none placeholder:text-mute', small ? 'text-15 leading-[22px]' : 'text-17 leading-6')} />
      <button type="submit" aria-label="Ask" className={cx('grid flex-none cursor-pointer place-items-center rounded-full border-0 bg-accent text-on-accent transition-transform duration-100 active:scale-[.94]', small ? 'size-8' : 'size-9')}>
        <ArrowUp size={16} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </form>
  )
}

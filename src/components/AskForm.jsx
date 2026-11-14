import { useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useAsk } from '../context/AskContext'

/** The rounded "Ask Executive 360°" bar (used on the Brief and at the bottom of Ask). */
export function AskForm({ placeholder, inputRef }) {
  const { ask, busy } = useAsk()
  const [v, setV] = useState('')
  const submit = (e) => {
    e.preventDefault()
    const q = v.trim()
    if (!q || busy) return
    setV('')
    ask(q)
  }
  return (
    <form onSubmit={submit} autoComplete="off"
      className="flex items-center gap-3 rounded-lg bg-surface py-3 pl-6 pr-3 shadow-card transition-shadow duration-200 ease-out focus-within:shadow-raised focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
      <input ref={inputRef} value={v} onChange={(e) => setV(e.target.value)} aria-label="Ask Executive 360°" placeholder={placeholder}
        className="min-w-0 flex-1 border-0 bg-transparent text-17 leading-6 text-ink outline-none placeholder:text-mute" />
      <button type="submit" aria-label="Ask" className="grid size-9 flex-none cursor-pointer place-items-center rounded-full border-0 bg-accent text-on-accent transition-transform duration-100 active:scale-[.94]">
        <ArrowUp size={16} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </form>
  )
}

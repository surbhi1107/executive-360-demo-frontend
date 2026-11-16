import { useEffect, useRef } from 'react'
import { MessageSquare } from 'lucide-react'
import { useAsk } from '../context/AskContext'
import { AskForm } from './AskForm'
import { Message } from './Answer'
import { Card, Chip, cx } from './ui'

/** The chat panel next to a department page: one thread per department agent. `about` = project name on a project page. */
export function AgentPanel({ d, asks, about }) {
  const { threads, ask } = useAsk()
  const msgs = threads[d.id] || []
  const body = useRef(null)
  useEffect(() => { if (body.current) body.current.scrollTop = body.current.scrollHeight }, [msgs])
  const source = d.id === 'projects' ? `${d.source.name} and the project agreements` : d.source.name
  return (
    <Card as="aside" aria-label={d.agent} className="sticky top-6 box-border flex max-h-[calc(100vh-48px)] flex-col gap-3 p-4 max-[1400px]:static max-[1400px]:order-first max-[1400px]:max-h-none max-[760px]:p-4">
      <div className="flex items-center gap-3">
        <span className="grid size-9 flex-none place-items-center rounded-full bg-accent-soft text-accent"><MessageSquare size={18} strokeWidth={1.6} aria-hidden="true" /></span>
        <div className="min-w-0">
          <b className="block text-16 leading-[21px]">{d.agent}</b>
          <span className="block text-12 text-mute [overflow-wrap:anywhere]">Answers only from {source}</span>
        </div>
      </div>
      {msgs.length > 0 && (
        <div ref={body} className="min-h-0 flex-1 overflow-y-auto max-[1400px]:max-h-[60vh]">
          <div className="flex flex-col gap-3 pb-1">{msgs.map((m) => <Message key={m.id} msg={m} agent={d.id} compact />)}</div>
        </div>
      )}
      {msgs.length === 0 && (
        <>
          <p className="text-13 text-mute">{about ? `Ask about ${about}, or any other project.` : `Ask about ${d.scope}.`}</p>
          <div className="flex flex-wrap gap-2">{asks.map((q) => <Chip key={q} onClick={() => ask(q, { agent: d.id })}>{q}</Chip>)}</div>
        </>
      )}
      <AskForm small agent={d.id} label={`Ask the ${d.agent}`} placeholder={`Ask the ${d.agent}`} />
    </Card>
  )
}

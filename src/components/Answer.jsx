import { useEffect, useMemo, useRef, useState } from 'react'
import { Pin } from 'lucide-react'
import { useAsk } from '../context/AskContext'
import { useData } from '../context/DataContext'
import { useNav } from '../context/NavContext'
import { prefersReducedMotion } from '../lib/format'
import { Rich, decode, plain } from '../lib/rich'
import { isDept } from '../lib/kinds'
import { AnyChart } from './charts/Charts'
import { SourceChips } from './SourceChips'
import { Card, Chip, LinkBtn, Status, Tag, Typing, cx } from './ui'

const scrollTo = (el) => el && el.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' })

function AnswerTable({ t }) {
  return (
    <div className="mb-4">
      {t.title && <div className="mb-1.5 text-12 font-semibold text-mute">{t.title}</div>}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-13">
          <thead><tr>{t.columns.map((c, i) => <th key={i} className="whitespace-nowrap pb-2 pr-3 text-left text-12 font-medium text-mute">{c}</th>)}</tr></thead>
          <tbody>{t.rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j} className={cx('border-t border-sep py-2 pr-3 tabular-nums', String(c).length > 34 ? 'min-w-[200px] whitespace-normal text-mute' : 'whitespace-nowrap')}>{c}</td>)}</tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}

/** Answer with a typewriter effect; the rest (list, table, chart, sources, follow-ups) appears when typing ends. */
function AnswerBody({ msg, agent, compact, cardRef }) {
  const { ask, finished, isPinned, addReport } = useAsk()
  const { loadedAt, deptById } = useData()
  const { go } = useNav()
  const { answer: a, rep, q } = msg
  const words = useMemo(() => plain(a.body).split(' '), [a.body])
  const [n, setN] = useState(0)
  const [done, setDone] = useState(prefersReducedMotion())
  const doneOnce = useRef(false)

  useEffect(() => {
    if (done) return undefined
    const iv = setInterval(() => setN((x) => x + 3), 30)
    return () => clearInterval(iv)
  }, [done])
  useEffect(() => { if (!done && n >= words.length) setDone(true) }, [n, words.length, done])
  useEffect(() => {
    if (done && !doneOnce.current) { doneOnce.current = true; finished(); scrollTo(cardRef.current) }
  }, [done, finished, cardRef])

  const pinned = isPinned(q)
  const hero = a.hero ? decode(a.hero) : null
  const dept = a.agent && isDept(a.agent.id) ? deptById(a.agent.id) : null
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center gap-2 text-12 font-medium text-mute">
        <Tag>{a.agent?.name}</Tag>
        {rep && <span>{rep.cadence}</span>}
        <span>data loaded {loadedAt}</span>
        {agent === 'all' && dept && <LinkBtn onClick={() => go(dept.id)}>Open {dept.name} ›</LinkBtn>}
      </div>
      {hero && <div className={cx('font-semibold tracking-[-0.03em] tabular-nums', compact ? 'text-30' : 'text-56 max-[760px]:text-40')}>{hero}</div>}
      <p className={cx('mb-4 mt-2 max-w-[62ch]', compact && 'text-14 leading-5')}>{done ? <Rich text={a.body} /> : words.slice(0, n).join(' ')}</p>
      {done && (
        <>
          {a.list && a.list.length > 0 && (
            <ul className={cx('mb-4 mt-2 max-w-[62ch] list-disc pl-[18px]', compact && 'text-14 leading-5')}>
              {a.list.map((l, i) => <li key={i} className={i ? 'mt-1' : ''}><Rich text={l} /></li>)}
            </ul>
          )}
          {a.table && <AnswerTable t={a.table} />}
          <AnyChart c={a.chart} />
          {a.src.length > 0 && <SourceChips cites={a.src} />}
          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">{(a.followups || []).map((s) => <Chip key={s} onClick={() => ask(s, { agent })}>{s}</Chip>)}</div>
            {agent === 'all' && hero && !rep && (
              <button type="button" aria-pressed={pinned} onClick={() => { if (!pinned) addReport(q, hero, dept ? dept.id : null) }}
                className={cx('inline-flex items-center gap-1.5 border-0 bg-transparent py-1.5 text-13 font-medium', pinned ? 'cursor-default text-mute' : 'cursor-pointer text-accent')}>
                <Pin size={14} strokeWidth={1.8} aria-hidden="true" />{pinned ? 'In quick reports' : 'Add to quick reports'}
              </button>
            )}
          </div>
        </>
      )}
    </>
  )
}

export function Message({ msg, agent = 'all', compact }) {
  const ref = useRef(null)
  useEffect(() => { if (!compact) scrollTo(ref.current) }, [compact])
  return (
    <>
      <div className={cx('max-w-[min(560px,90%)] self-end bg-fill', compact ? 'rounded-md px-3 py-2 text-14 leading-5' : 'rounded-lg px-4 py-3')}>
        {msg.rep ? <><Tag className="mr-2">Quick report</Tag>{msg.rep.name}</> : msg.q}
      </div>
      <div ref={ref}>
        <Card className={compact ? 'rounded-md bg-bg p-4 shadow-none max-[760px]:p-4' : ''}>
          {msg.status === 'loading' && <Typing />}
          {msg.status === 'error' && <><p className="mb-4 mt-2"><Status s="watch">Assistant unavailable</Status></p><p className="mb-4 mt-2 max-w-[62ch]">{msg.err}</p></>}
          {msg.status === 'answer' && <AnswerBody msg={msg} agent={agent} compact={compact} cardRef={ref} />}
        </Card>
      </div>
    </>
  )
}

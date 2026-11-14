import { useEffect, useMemo, useRef, useState } from 'react'
import { Pin } from 'lucide-react'
import { SUGGEST } from '../data/sample'
import { useAsk } from '../context/AskContext'
import { useData } from '../context/DataContext'
import { prefersReducedMotion } from '../lib/format'
import { Rich, decode, plain } from '../lib/rich'
import { AskForm } from '../components/AskForm'
import { AnswerChart } from '../components/charts/AnswerCharts'
import { QuickReports } from '../components/QuickReports'
import { SourceChips } from '../components/SourceChips'
import { Card, Chip, PageHead, Status, Title2, cx } from '../components/ui'

const scrollTo = (el) => el && el.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' })

function ListItem({ item }) {
  if (typeof item === 'string') return <Rich text={item} />
  return <><Status s={item.s}>{item.w}</Status>&nbsp; {item.t}</>
}

/** Answer with a typewriter effect; the rest (list, chart, sources, follow-ups) appears when typing ends. */
function Answer({ msg, cardRef }) {
  const { ask, finished, isPinned, addReport } = useAsk()
  const { loadedAt } = useData()
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
  return (
    <>
      {rep && <div className="mb-2 flex flex-wrap items-center gap-2 text-12 font-medium text-mute">{rep.cadence} · {a.live ? 'data loaded ' + loadedAt : 'sample data'}</div>}
      {hero && <div className="text-56 font-semibold tracking-[-0.03em] tabular-nums max-[760px]:text-40">{hero}</div>}
      <p className="mb-4 mt-2 max-w-[62ch]">{done ? <Rich text={a.body} /> : words.slice(0, n).join(' ')}</p>
      {done && (
        <>
          {a.list && (
            <ul className="mb-4 mt-2 max-w-[62ch] list-disc pl-[18px]">
              {a.list.map((l, i) => <li key={i} className={i ? 'mt-1' : ''}><ListItem item={l} /></li>)}
            </ul>
          )}
          <AnswerChart chart={a.chart} />
          {a.src.length > 0 && <SourceChips cites={a.src} />}
          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">{a.f.map((s) => <Chip key={s} onClick={() => ask(s)}>{s}</Chip>)}</div>
            {hero && !rep && (
              <button type="button" aria-pressed={pinned} onClick={() => { if (!pinned) addReport(q, hero) }}
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

function Message({ msg }) {
  const ref = useRef(null)
  useEffect(() => { scrollTo(ref.current) }, [])
  return (
    <>
      <div className="max-w-[min(560px,90%)] self-end rounded-lg bg-fill px-4 py-3">
        {msg.rep ? <><span className="mr-2 rounded-[5px] bg-accent-soft px-1.5 py-px text-12 font-semibold text-accent">Quick report</span>{msg.rep.name}</> : msg.q}
      </div>
      <div ref={ref}>
        <Card>
          {msg.status === 'loading' && <div className="inline-flex gap-1 py-3" aria-label="Thinking">{[0, 1, 2].map((i) => <i key={i} className="size-1.5 animate-blink rounded-full bg-mute" style={{ animationDelay: `${i * 0.15}s` }} />)}</div>}
          {msg.status === 'error' && <><p className="mb-4 mt-2"><Status s="watch">Assistant unavailable</Status></p><p className="mb-4 mt-2 max-w-[62ch]">{msg.err}</p></>}
          {msg.status === 'answer' && <Answer msg={msg} cardRef={ref} />}
        </Card>
      </div>
    </>
  )
}

export function AskView() {
  const { thread, ask, inputRef } = useAsk()
  return (
    <section className="mx-auto flex max-w-[1080px] flex-col gap-8 max-[760px]:gap-6">
      <PageHead title="Ask" sub="Ask anything, or run a quick report. Tap any source to see exactly what was used." />
      <div className="grid grid-cols-[minmax(0,1fr)_280px] items-start gap-8 max-[1000px]:grid-cols-1">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-col gap-6 pb-6">
            {thread.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <Title2>What would you like to know?</Title2>
                <p className="text-mute">Ask in your own words. Project answers come from the project workbook and agreements, and every answer shows its sources.</p>
                <div className="flex flex-wrap justify-center gap-2">{SUGGEST.map((s) => <Chip key={s} onClick={() => ask(s)}>{s}</Chip>)}</div>
              </div>
            ) : thread.map((m) => <Message key={m.id} msg={m} />)}
          </div>
          <div className="sticky bottom-6 z-[5] before:absolute before:-inset-x-2 before:-inset-y-6 before:-z-10 before:bg-bg before:content-[''] max-[760px]:bottom-[calc(84px+env(safe-area-inset-bottom,0px))]">
            <AskForm placeholder="Ask a follow-up" inputRef={inputRef} />
          </div>
        </div>
        <QuickReports />
      </div>
    </section>
  )
}

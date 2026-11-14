import { useMemo, useState } from 'react'
import { KPI, KPI_Q, ATTN, PERIODS, SUGGEST } from '../data/sample'
import { useAsk } from '../context/AskContext'
import { useData } from '../context/DataContext'
import { useNav } from '../context/NavContext'
import { useSheet } from '../context/SheetContext'
import { liveAttention, ontrackRows } from '../lib/derive'
import { AskForm } from '../components/AskForm'
import { Sparkline } from '../components/charts/Sparkline'
import { Card, Chip, LinkBtn, Segmented, Status, Title2, cx } from '../components/ui'

const ARROW = { up: '▲ ', down: '▼ ', flat: '' }
const DELTA = { up: 'text-positive', down: 'text-critical', flat: 'text-mute' }

export function Brief() {
  const { ask } = useAsk()
  const { go } = useNav()
  const { data, projects, projById, flags, sources, loadedAt, openFlagCount } = useData()
  const { openAttn, openAllSources } = useSheet()
  const [period, setPeriod] = useState('QTD')

  const now = useMemo(() => new Date(), [])
  const h = now.getHours()
  const greet = (h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening') + ', Anita.'
  const dateline = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  const attn = useMemo(() => [...liveAttention(flags, projById), ...ATTN], [flags, projById])
  const ontrack = ontrackRows(data, projects, openFlagCount)

  return (
    <section className="mx-auto flex max-w-[1080px] flex-col gap-8 max-[760px]:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-28 font-semibold tracking-[-0.015em] [text-wrap:balance]">{greet}</h1>
          <p className="mt-1 text-13 text-mute">{dateline} · <LinkBtn onClick={openAllSources}>{data ? `${Object.keys(sources).length} sources, checked ${loadedAt}` : 'Sources'}</LinkBtn></p>
        </div>
        <Segmented label="Period" options={PERIODS.map((p) => [p, p])} value={period} onChange={setPeriod} />
      </div>

      <div>
        <AskForm placeholder="Ask about the business" />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {SUGGEST.map((s) => <Chip key={s} onClick={() => ask(s)}>{s}</Chip>)}
          <LinkBtn onClick={() => go('ask')} className="px-1 py-1.5 text-13">Quick reports</LinkBtn>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 max-[1000px]:grid-cols-2">
        {KPI[period].map((k, i) => (
          <Card key={k[0]} as="button" type="button" onClick={() => ask(KPI_Q[i])}
            className="flex cursor-pointer flex-col gap-1 border-0 text-left transition-[transform,box-shadow] duration-200 ease-out hover:shadow-raised">
            <span className="text-13 text-mute">{k[0]}</span>
            <span className="whitespace-nowrap text-34 font-semibold tracking-[-0.02em] tabular-nums max-[760px]:text-26">{k[1]}</span>
            <span className="flex flex-wrap gap-2 text-13 text-mute">
              <span className={cx('font-semibold tabular-nums', DELTA[k[3]])}>{ARROW[k[3]]}{k[2]}</span>
              <span>{k[4]}</span>
            </span>
            <Sparkline pts={k[5]} />
          </Card>
        ))}
      </div>

      <Card>
        <Title2>Needs your attention</Title2>
        <ul className="m-0 mt-2 list-none p-0">
          {attn.map((a) => (
            <li key={a.id || a.t} tabIndex={0} onClick={() => openAttn(a)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAttn(a) } }}
              className="row-sep group relative -mx-3 grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-0.5 rounded-sm p-3 hover:bg-fill max-[760px]:grid-cols-1">
              <span className="font-semibold leading-5">{a.t}</span>
              <span className="row-span-2 col-start-2 self-center text-right max-[760px]:col-start-1 max-[760px]:row-auto max-[760px]:mt-1 max-[760px]:flex max-[760px]:items-center max-[760px]:gap-2 max-[760px]:text-left">
                <Status s={a.s}>{a.w}</Status>
                <span className="mt-0.5 block text-12 text-mute group-hover:text-ink max-[760px]:m-0">{a.o}</span>
              </span>
              <span className="col-start-1 text-13 text-mute group-hover:text-ink">{a.d}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div>
        <Title2 className="mb-3">On track</Title2>
        <div className="flex flex-col gap-2">
          {ontrack.map(([a, b]) => (
            <div key={a} className="flex flex-wrap items-baseline gap-3 text-13">
              <b className="min-w-24 font-semibold">{a}</b>
              <span className="text-mute">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

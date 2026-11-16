import { useEffect, useMemo, useState } from 'react'

import { useData } from '../context/DataContext'
import { useNav } from '../context/NavContext'
import { AgentPanel } from '../components/AgentPanel'
import { AnyChart } from '../components/charts/Charts'
import { Flag } from '../components/Flag'
import { SourceChips } from '../components/SourceChips'
import { Btn, Card, LinkBtn, SecHead, Status, Title1, Title2, cx } from '../components/ui'
import { KpiGrid, Portfolio, ProjectDetail } from './Projects'
import { DEPT_ORDER } from '../lib/kinds'

const DOT = { ok: 'bg-positive', watch: 'bg-caution', risk: 'bg-critical' }

function Cell({ c }) {
  if (c && typeof c === 'object') return c.s ? <Status s={c.s}>{c.v}</Status> : <span className={cx('font-semibold', c.tone === 'late' ? 'text-critical' : 'text-positive')}>{c.v}</span>
  return <>{c ?? ''}</>
}

function Section({ s }) {
  const { citeFrom } = useData()
  if (s.type === 'chart') return <Card><Title2 className="mb-3">{s.title}</Title2><AnyChart c={s.chart} /></Card>
  return (
    <Card>
      <Title2 className="mb-3">{s.title}</Title2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-14">
          <thead><tr>{s.columns.map((c, i) => <th key={i} className="whitespace-nowrap pb-2 pr-3 text-left text-12 font-medium text-mute">{c}</th>)}</tr></thead>
          <tbody>{s.rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j} className={cx('border-t border-sep py-2 pr-3 tabular-nums', typeof c === 'string' && c.length > 34 ? 'min-w-[200px] whitespace-normal text-mute' : 'whitespace-nowrap')}><Cell c={c} /></td>)}</tr>
          ))}</tbody>
        </table>
      </div>
      {s.source && <div className="mt-3"><SourceChips cites={[citeFrom(s.source)]} label="Source" /></div>}
    </Card>
  )
}

function FlagsBlock({ d, project }) {
  const { flags, isDone, openFlags } = useData()
  const mine = flags.filter((f) => f.dept === d.id)
  // handled flags drop to the bottom, but only when the page is (re)opened, so a card does not jump while you act on it
  const [epoch, setEpoch] = useState(0)
  const { view } = useNav()
  useEffect(() => { setEpoch((n) => n + 1) }, [view, project])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ordered = useMemo(() => [...mine.filter((f) => !isDone(f.id)), ...mine.filter((f) => isDone(f.id))], [flags, epoch])
  if (!mine.length) return null
  const n = openFlags.filter((f) => f.dept === d.id).length
  return (
    <div className="flex flex-col gap-3">
      <SecHead title="Flags" sub={`${n ? `${n} open` : 'All handled'} · each suggests how to act`} />
      <div className="flex flex-col gap-4">{ordered.map((f) => <Flag key={f.id} f={f} />)}</div>
    </div>
  )
}

export function Dept({ id }) {
  const { data, loadErr, deptById, projById, flags, reload, loadedAt, sources } = useData()
  const { go, curProject } = useNav()
  const label = (DEPT_ORDER.find(([i]) => i === id) || [])[1] || ''
  const d = deptById(id)
  const back = <LinkBtn className="hidden self-start max-[760px]:inline-block" onClick={() => go('home')}>‹ Home</LinkBtn>

  if (!data || !d) return (
    <section className="mx-auto flex max-w-[1400px] flex-col gap-8 max-[760px]:gap-6">
      {back}<Title1>{label}</Title1>
      <Card>{loadErr ? <div className="flex flex-col gap-3"><Status s="risk">Could not load data</Status><p>{loadErr}</p><Btn small onClick={reload}>Try again</Btn></div> : <p className="text-mute">Loading…</p>}</Card>
    </section>
  )
  const p = id === 'projects' && curProject ? projById(curProject) : null
  const wbSource = sources[d.source.ref]
  void flags
  return (
    <section className="mx-auto flex max-w-[1400px] flex-col gap-8 max-[760px]:gap-6">
      {back}
      {!p && (
        <div>
          <h1 className="text-28 font-semibold tracking-[-0.015em] [text-wrap:balance]">{d.name} &nbsp;<Status s={d.status} className="align-middle text-13">{d.status_word}</Status></h1>
          <p className="mt-2 max-w-[72ch] text-17 leading-6 max-[760px]:text-15 max-[760px]:leading-[22px] [text-wrap:pretty]">{d.headline}</p>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-13 text-mute">
            {d.owner} · {wbSource && <SourceChips cites={[{ S: wbSource, loc: 'Whole workbook', used: 'Every figure on this page', pv: null }]} label={false} />} · loaded {loadedAt} · <LinkBtn className="text-13" onClick={reload}>Reload</LinkBtn>
          </p>
        </div>
      )}
      <div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-6 max-[1400px]:grid-cols-1">
        <div className="flex min-w-0 flex-col gap-6">
          {p ? <ProjectDetail p={p} /> : (
            <>
              <KpiGrid>{d.kpis.map((k) => (
                <Card key={k.label} className="flex flex-col gap-1">
                  <span className="flex items-center text-13 text-mute"><i className={cx('mr-1.5 inline-block size-2 rounded-full', DOT[k.status || 'ok'])} />{k.label}</span>
                  <span className="text-30 font-semibold tracking-[-0.02em] tabular-nums max-[760px]:text-24">{k.value}</span>
                  <span className="text-13 text-mute">{k.foot}</span>
                </Card>
              ))}</KpiGrid>
              {d.id === 'projects' && <Portfolio />}
              <FlagsBlock d={d} project={curProject} />
              {d.sections.map((s, i) => <Section key={i} s={s} />)}
            </>
          )}
        </div>
        <AgentPanel d={d} asks={p ? p.asks : d.asks} about={p ? p.name : null} />
      </div>
    </section>
  )
}

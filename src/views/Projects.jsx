import { useEffect, useMemo } from 'react'
import { ChevronLeft } from 'lucide-react'
import { D, STAGE_NAME, STAGE_ORDER, STATUS_WORD, crore, fmtD, wkDiff } from '../lib/format'
import { useData } from '../context/DataContext'
import { useNav } from '../context/NavContext'
import { Flag } from '../components/Flag'
import { Gantt, GanttLegend } from '../components/projects/Gantt'
import { SourceChips } from '../components/SourceChips'
import { Card, SecHead, Status, Subhead, Title1, Title2, cx } from '../components/ui'

const Section = ({ title, sub, children }) => <div className="flex flex-col gap-3"><SecHead title={title} sub={sub} />{children}</div>
const Kpi = ({ label, value, foot }) => (
  <Card className="flex flex-col gap-1">
    <span className="text-13 text-mute">{label}</span>
    <span className="text-30 font-semibold tracking-[-0.02em] tabular-nums max-[760px]:text-24">{value}</span>
    <span className="text-13 text-mute">{foot}</span>
  </Card>
)
export const KpiGrid = ({ children }) => <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4">{children}</div>

/** "+3 wks" / "-1 wks" / "On time" for forecast vs a target date */
const VarTxt = ({ f, r }) => {
  const w = wkDiff(f, r)
  return w > 0 ? <span className="font-semibold text-critical">+{w} wks</span> : w < 0 ? <span className="font-semibold text-positive">{w} wks</span> : <span className="font-semibold text-positive">On time</span>
}
const Sub = ({ children }) => <span className="mt-0.5 block text-12 text-mute group-hover:text-ink">{children}</span>

function Th({ children }) { return <th className="whitespace-nowrap px-3 pb-2 text-left text-12 font-medium text-mute">{children}</th> }
function Td({ label, className, children }) {
  return (
    <td data-l={label} className={cx('border-t border-sep p-3 align-top first:rounded-l-sm last:rounded-r-sm group-hover:bg-fill',
      'max-[760px]:block max-[760px]:w-full max-[760px]:border-0 max-[760px]:px-0 max-[760px]:py-1 max-[760px]:first:rounded-none max-[760px]:last:rounded-none max-[760px]:group-hover:bg-transparent',
      label && 'max-[760px]:before:block max-[760px]:before:text-11 max-[760px]:before:leading-[14px] max-[760px]:before:text-mute max-[760px]:before:content-[attr(data-l)]', className)}>{children}</td>
  )
}
const PTh = ({ children }) => <th className="whitespace-nowrap pb-2 pr-3 text-left text-12 font-medium text-mute">{children}</th>
const PTd = ({ wrap, className, ...p }) => <td className={cx('border-t border-sep py-2 pr-3 tabular-nums', wrap ? 'min-w-[160px] whitespace-normal text-mute' : 'whitespace-nowrap', className)} {...p} />

/** The portfolio table on the Projects department page */
export function Portfolio() {
  const { projects, sources } = useData()
  const { openProject } = useNav()
  const wb = { S: sources.workbook, loc: 'Projects, Project Updates and Milestones tabs', used: 'Every figure in this table', pv: null }
  return (
    <Card>
      <SecHead title="Portfolio" sub="Tap a project for its timeline" className="mb-3" />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-14 max-[760px]:block">
          <thead className="max-[760px]:hidden"><tr>
            {['Project', 'Current stage', 'Next milestone', 'Forecast', 'Progress', 'Penalty exposure', 'Health', 'Schedule updated'].map((h) => <Th key={h}>{h}</Th>)}
          </tr></thead>
          <tbody className="max-[760px]:block">
            {projects.map((p) => (
              <tr key={p.id} tabIndex={0} onClick={() => openProject(p.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(p.id) } }}
                className="group cursor-pointer max-[760px]:block max-[760px]:w-full max-[760px]:border-t max-[760px]:border-sep max-[760px]:py-2">
                <Td><span className="font-semibold">{p.name}</span><Sub>{p.type} · {p.where}</Sub></Td>
                <Td label="Current stage">{STAGE_NAME[p.stage] || p.stage}</Td>
                <Td label="Next milestone">{p.next.label}<Sub>{fmtD(D(p.next.date))}</Sub></Td>
                <Td label="Forecast">{fmtD(D(p.next.forecast))}<Sub><VarTxt f={p.next.forecast} r={p.next.date} /></Sub></Td>
                <Td label="Progress">
                  <div className="flex min-w-[110px] flex-col gap-1">
                    <div className="relative h-1.5 rounded-full bg-fill">
                      <i className="absolute inset-y-0 left-0 rounded-full bg-chart-line" style={{ width: `${p.ac}%` }} />
                      <b className="absolute -top-[3px] h-3 w-0.5 rounded-[1px] bg-mute" style={{ left: `${p.pl}%` }} />
                    </div>
                    <span className="text-12 tabular-nums text-mute">{p.ac}% · plan {p.pl}%</span>
                  </div>
                </Td>
                <Td label="Penalty exposure">{p.penalty.exposure_cr ? <span className="font-semibold text-critical">{crore(p.penalty.exposure_cr)}</span> : <span className="text-mute group-hover:text-ink">None</span>}</Td>
                <Td label="Health"><Status s={p.health}>{STATUS_WORD[p.health]}</Status></Td>
                <Td label="Schedule updated">{p.updated.stale ? <Status s="watch">{p.updated.rel}</Status> : p.updated.rel}<Sub>by {p.updated.by}</Sub></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3"><SourceChips cites={[wb]} label="Source" /></div>
    </Card>
  )
}

function PenaltyCard({ p }) {
  const { sources } = useData()
  const pen = p.penalty
  if (!pen.agreement) return null
  const S = sources['doc:' + pen.agreement]
  const wi = pen.if_all_forecasts_slip_further
  return (
    <Card className="flex flex-col gap-3 overflow-x-auto">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <Title2>Estimated penalty exposure</Title2>
        <span className="text-22 font-semibold">{pen.exposure_cr ? crore(pen.exposure_cr) : 'None'}</span>
      </div>
      {pen.charging.length ? (
        <table className="w-full border-collapse text-14">
          <thead><tr>{['Rule', 'Applies to', 'Weeks late', 'Beyond grace', 'Amount'].map((h) => <PTh key={h}>{h}</PTh>)}</tr></thead>
          <tbody>{pen.charging.map((r) => (
            <tr key={r.id}><PTd><b>{r.id}</b></PTd><PTd wrap>{r.applies_to}</PTd><PTd>{r.weeks_late} wks</PTd><PTd>{r.chargeable_weeks} wks</PTd><PTd><span className="font-semibold text-critical">{crore(r.amount_cr)}</span></PTd></tr>
          ))}</tbody>
        </table>
      ) : <p className="text-mute">No delay-damage rule is charging at the current forecasts.</p>}
      {pen.near.length > 0 && (
        <p className="text-14"><Status s="watch">One week from charging</Status>&nbsp; {pen.near.map((r) => `${r.id} (${r.applies_to}, ${crore(r.rate_cr_per_week)} a week)`).join('; ')}</p>
      )}
      {wi && (
        <div className="flex flex-wrap gap-2">
          {[['If everything slips 2 more weeks', wi['2_weeks']], ['4 weeks', wi['4_weeks']], ['8 weeks', wi['8_weeks']]].map(([l, v]) => (
            <span key={l} className="rounded-sm bg-fill px-2.5 py-1 text-13 font-semibold tabular-nums"><small className="font-medium text-ink">{l}</small> {crore(v)}</span>
          ))}
        </div>
      )}
      <p className="text-12 text-mute">Calculated by code from the forecast dates and the rules in the agreement: weeks late, less the grace period, times the weekly rate, up to each cap{p.internal ? '' : ' and the overall 10% cap'}. An estimate, not an invoice.</p>
      {S && <SourceChips label="Source" cites={[{ S, loc: 'Article 9 · Delay damages', used: 'Rates, grace periods and caps', pv: null }]} />}
    </Card>
  )
}

/** One project: KPIs, stages, timeline, milestones, department confirmations, penalty, flags and reasons */
export function ProjectDetail({ p }) {
  const { data, flags, projects, sources } = useData()
  const { view, setCurProject } = useNav()
  const today = useMemo(() => D(data.as_of), [data])
  const w0 = useMemo(() => {
    const m = new Date(Math.min(...projects.flatMap((x) => x.phases.map((ph) => D(ph.start)))))
    return new Date(m.getFullYear(), m.getMonth(), 1)
  }, [projects])
  const sp = p.stage_progress
  const mine = flags.filter((f) => f.proj === p.id)
  const wb = (loc, used) => ({ S: sources.workbook, loc, used, pv: null })
  const CST = { confirmed: 'ok', gap: 'risk', stale: 'watch', none: 'watch' }

  useEffect(() => { // bring "today" into view when the timeline opens
    if (view !== 'projects') return undefined
    const id = requestAnimationFrame(() => {
      const w = document.querySelector('[data-gantt-wrap]'), t = document.querySelector('[data-gantt-today]')
      if (w && t) w.scrollLeft += t.getBoundingClientRect().left - w.getBoundingClientRect().left - w.clientWidth * 0.55
    })
    return () => cancelAnimationFrame(id)
  }, [view, p.id])

  return (
    <>
      <button type="button" onClick={() => { setCurProject(null); window.scrollTo({ top: 0 }) }}
        className="inline-flex cursor-pointer items-center gap-0.5 self-start border-0 bg-transparent p-0 text-accent hover:underline"><ChevronLeft size={16} aria-hidden="true" />All projects</button>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Title1>{p.name}</Title1>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2 text-13 text-mute"><span>{p.type} · {p.where}</span><span>{p.client}</span><span>{p.pm}</span></div>
        </div>
        <Status s={p.health} className="text-13">{STATUS_WORD[p.health]}</Status>
      </div>

      {p.updated.stale && (
        <Card className="flex flex-wrap items-center gap-3 px-4 py-3">
          <Status s="watch">Data not updated</Status>
          <span className="text-14">Schedule last updated {p.updated.when} by {p.updated.by}. Figures below may be {p.updated.days} days old.</span>
        </Card>
      )}

      <KpiGrid>{p.kpis.map((k) => <Kpi key={k[0]} label={k[0]} value={k[1]} foot={k[2]} />)}</KpiGrid>

      {Object.keys(sp).length > 0 && (
        <Section title="Stages" sub="Done · plan by today">
          <div className="grid grid-cols-8 gap-2 max-[1000px]:grid-cols-4 max-[760px]:grid-cols-2">
            {STAGE_ORDER.map((k, i) => sp[k] && (
              <div key={k} className={cx('flex min-w-0 flex-col gap-1.5 rounded-md bg-surface p-3 shadow-card', p.stage === k && 'ring-2 ring-inset ring-accent')}>
                <span className="text-12 font-semibold text-mute">{i + 1}</span>
                <span className="min-h-[34px] text-13 font-semibold leading-[17px]">{STAGE_NAME[k]}</span>
                <span className="text-20 font-semibold tabular-nums">{sp[k][0]}%</span>
                <span className="text-12 text-mute">plan {sp[k][1]}%</span>
                {p.stage === k && <span className="text-11 font-semibold text-accent">Main focus now</span>}
              </div>
            ))}
          </div>
        </Section>
      )}

      <Card className="flex flex-col gap-3">
        <Title2>Timeline</Title2>
        <GanttLegend />
        <Gantt p={p} today={today} w0={w0} />
        <SourceChips label="Source" cites={[wb('Milestones · ' + p.id, 'Phase dates and progress')]} />
      </Card>

      <Card className="overflow-x-auto">
        <Title2 className="mb-3">Milestones</Title2>
        <table className="w-full border-collapse text-14">
          <thead><tr>{['Phase', 'Scope', 'Contract', 'Internal target', 'Revised', 'Forecast', 'vs revised', 'Done', 'Status'].map((h) => <PTh key={h}>{h}</PTh>)}</tr></thead>
          <tbody>
            {p.phases.map((ph) => (
              <tr key={ph.n}>
                <PTd><b>{ph.name}</b></PTd><PTd wrap>{ph.scope}</PTd>
                <PTd>{fmtD(D(ph.contract))}</PTd><PTd>{fmtD(D(ph.internal))}</PTd><PTd>{fmtD(D(ph.revised))}</PTd><PTd>{fmtD(D(ph.forecast))}</PTd>
                <PTd><VarTxt f={ph.forecast} r={ph.revised} /></PTd><PTd>{ph.ac}%</PTd><PTd><Status s={ph.status}>{STATUS_WORD[ph.status]}</Status></PTd>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="overflow-x-auto">
        <SecHead title="Completion confirmed by departments" sub="Reported by the project team · confirmed by the responsible department" className="mb-3" />
        <table className="w-full border-collapse text-14">
          <thead><tr>{['Phase', 'Reported', 'Confirmed', 'Confirmed by', 'Confirmed on', 'Status'].map((h) => <PTh key={h}>{h}</PTh>)}</tr></thead>
          <tbody>
            {p.phases.map((ph) => { const c = ph.confirmed, st = CST[c.status]
              return (
                <tr key={ph.n}>
                  <PTd><b>{ph.name}</b></PTd><PTd>{ph.ac}%</PTd>
                  <PTd>{c.pct == null ? <span className="text-mute">None</span> : c.pct + '%'}</PTd>
                  <PTd wrap>{c.by || ''}</PTd><PTd>{c.on ? fmtD(D(c.on)) : ''}</PTd>
                  <PTd>{st ? <Status s={st}>{c.word}</Status> : <span className="text-mute">{c.word}</span>}</PTd>
                </tr>
              ) })}
          </tbody>
        </table>
        <div className="mt-3"><SourceChips label="Source" cites={[wb('Milestones · ' + p.id + ' · Confirmed columns', 'Confirmed progress, who confirmed and when')]} /></div>
      </Card>

      <PenaltyCard p={p} />

      {mine.length > 0 && <Section title="Flags on this project"><div className="flex flex-col gap-4">{mine.map((f) => <Flag key={f.id} f={f} showWhere={false} />)}</div></Section>}

      {p.reasons.length > 0 && (
        <Card>
          <Title2 className="mb-2">Reasons given for delay</Title2>
          <ul className="m-0 flex list-disc flex-col gap-1 pl-5">{p.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
        </Card>
      )}
    </>
  )
}
export { Subhead }

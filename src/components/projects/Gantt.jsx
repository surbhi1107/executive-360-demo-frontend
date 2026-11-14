import { useEffect, useState } from 'react'
import { DAY, D, STATUS_WORD, fmtD } from '../../lib/format'
import { StatusDot, cx } from '../ui'

const useNarrow = () => {
  const [narrow, setNarrow] = useState(() => window.innerWidth < 760)
  useEffect(() => {
    const on = () => setNarrow(window.innerWidth < 760)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return narrow
}

const MK_BG = { risk: 'bg-critical', watch: 'bg-caution', ok: 'bg-positive' }
const MARK = 'absolute top-1/2 -translate-x-1/2 -translate-y-1/2'

export function GanttLegend() {
  const item = 'inline-flex items-center gap-1.5'
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-12 text-mute">
      <span className={item}><i className="inline-block h-2 w-7 rounded bg-[linear-gradient(90deg,var(--chart-line)_60%,var(--fill)_60%)] shadow-[inset_0_0_0_1px_var(--separator)]" />Plan, dark part done</span>
      <span className={item}><i className="inline-block h-2 w-7 rounded bg-fill shadow-[inset_0_0_0_1.5px_var(--caution)]" />Past its plan end, not finished</span>
      <span className={item}><i className="box-border inline-block size-[9px] rotate-45 border-[1.5px] border-mute" />Contract date</span>
      <span className={item}><i className="inline-block size-[9px] rotate-45 bg-ink" />Revised target</span>
      <span className={item}><i className="inline-block size-2.5 rounded-full bg-critical" />Forecast</span>
      <span className={item}><i className="inline-block h-3 w-0.5 bg-accent" />Today</span>
    </div>
  )
}

/** Timeline: one bar per phase (plan start to plan end, dark part = progress) with contract / revised / forecast markers. */
export function Gantt({ p, today, w0 }) {
  const narrow = useNarrow()
  const PX = narrow ? 7 : 10, LW = narrow ? 150 : 230
  const wpos = (d) => (d - w0) / (7 * DAY)

  let s = Infinity, e = -Infinity
  for (const ph of p.phases) {
    s = Math.min(s, wpos(D(ph.start)))
    for (const d of [ph.end, ph.contract, ph.revised, ph.forecast]) e = Math.max(e, wpos(D(d)) + 1)
  }
  e = Math.max(e, wpos(today) + 2)
  s = Math.max(0, Math.floor(s) - 2); e = Math.ceil(e) + 3
  const W = (e - s) * PX
  const x = (w) => ((w - s) * PX).toFixed(1)
  const cols = { gridTemplateColumns: `${LW}px ${W}px` }

  // month grid lines + axis labels
  const grid = [], axis = []
  const m0 = new Date(w0.getTime() + s * 7 * DAY)
  for (let d = new Date(m0.getFullYear(), m0.getMonth() + 1, 1); wpos(d) < e; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    const wx = x(wpos(d))
    grid.push(<span key={wx} className="absolute bottom-0 top-0 w-px bg-sep" style={{ left: `${wx}px` }} />)
    if (!narrow || d.getMonth() % 3 === 0) {
      axis.push(<span key={wx} className="absolute top-1 translate-x-0.5 whitespace-nowrap text-11 text-mute" style={{ left: `${wx}px` }}>
        {d.toLocaleDateString('en-GB', { month: 'short' })}{d.getMonth() === 0 ? ' ' + String(d.getFullYear()).slice(2) : ''}</span>)
    }
  }

  return (
    <div className="overflow-x-auto rounded-md" data-gantt-wrap>
      <div className="relative text-12" style={{ width: LW + W }}>
        <div className="grid min-h-[30px] items-center" style={cols}>
          <div className="sticky left-0 z-[2] self-stretch bg-surface" />
          <div className="relative h-6">{axis}</div>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute bottom-0 top-0" style={{ left: LW, width: W }}>
            {grid}
            <span data-gantt-today className="absolute bottom-0 top-0 z-[1] w-0.5 bg-accent" style={{ left: `${x(wpos(today))}px` }}>
              <span className="absolute -top-px left-1 whitespace-nowrap rounded-[3px] bg-surface px-[3px] text-11 font-semibold text-accent">Today</span>
            </span>
          </div>
          {p.phases.map((ph) => {
            const a = wpos(D(ph.start)), b = wpos(D(ph.end)) + 1 / 7
            const span = Math.max(1, D(ph.end) - D(ph.start))
            const planPct = Math.round(Math.max(0, Math.min(1, (today - D(ph.start)) / span)) * 100)
            const od = D(ph.end) < today && ph.ac < 100
            return (
              <div key={ph.n} className="grid min-h-[36px] items-center border-t border-sep" style={cols}>
                <div className="sticky left-0 z-[2] flex min-w-0 items-center gap-1.5 self-stretch bg-surface py-1 pr-3">
                  <span className="flex min-w-0 flex-col">
                    <b className="text-13 leading-[17px]">{ph.name}</b>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap text-11 text-mute">{ph.scope}</span>
                  </span>
                  <StatusDot s={ph.status} title={STATUS_WORD[ph.status]} />
                  <span className="ml-auto text-12 font-medium tabular-nums text-mute">{ph.ac}%</span>
                </div>
                <div className="relative h-full min-h-[inherit]">
                  <span className={cx('absolute top-1/2 h-3.5 -translate-y-1/2 overflow-hidden rounded-[7px] bg-fill', od ? 'shadow-[inset_0_0_0_1.5px_var(--caution)]' : 'shadow-[inset_0_0_0_1px_var(--separator)]')}
                    style={{ left: `${x(a)}px`, width: `${((b - a) * PX).toFixed(1)}px` }}
                    title={`${ph.name}: plan ${fmtD(D(ph.start))} to ${fmtD(D(ph.end))} · ${ph.ac}% done, about ${planPct}% expected by today`}>
                    <i className="absolute inset-y-0 left-0 bg-chart-line" style={{ width: `${ph.ac}%` }} />
                  </span>
                  <span className={cx(MARK, 'z-[1] box-border size-2.5 rotate-45 border-[1.5px] border-mute bg-surface')} style={{ left: `${x(wpos(D(ph.contract)))}px` }} title={'Contract date ' + fmtD(D(ph.contract))} />
                  {ph.revised !== ph.contract && <span className={cx(MARK, 'z-[1] box-border size-2.5 rotate-45 bg-ink shadow-[0_0_0_2px_var(--surface)]')} style={{ left: `${x(wpos(D(ph.revised)))}px` }} title={'Revised target ' + fmtD(D(ph.revised))} />}
                  <span className={cx(MARK, 'z-[1] box-content size-3 rounded-full border-2 border-surface', MK_BG[ph.status])} style={{ left: `${x(wpos(D(ph.forecast)))}px` }} title={'Forecast ' + fmtD(D(ph.forecast))} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

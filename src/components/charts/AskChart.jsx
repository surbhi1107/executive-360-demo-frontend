/**
 * Charts under Ask answers. The server sends the data (calculated in code), this file only draws it.
 *   bars      ranked horizontal bars        bullet   bar + marker for the plan
 *   grouped   two bars per row              range    dates on a time axis
 *   segments  one whole split into parts
 * Built in HTML/CSS so labels wrap, text stays crisp and every mark is a real, focusable element.
 * Every chart has a table view of the same data, a tooltip on hover and keyboard focus, and a legend.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { CircleAlert, CircleCheck, TriangleAlert } from 'lucide-react'
import { D, fmtD, prefersReducedMotion } from '../../lib/format'
import { cx } from '../ui'

/* ------------------------------------------------------------------ helpers */
const nf = (v, dec = 2) => Number(v).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: dec })
/** Same number of decimals for every value in a chart: 1.8 and 2.0, never 1.8 and 2. */
const fracDigits = (v) => { const s = String(Math.round(v * 100) / 100); return s.includes('.') ? s.split('.')[1].length : 0 }
const fixedDecimals = (values, max = 2) => Math.min(max, Math.max(0, ...values.map(fracDigits)))
const fmtVal = (v, u = {}, fixed) => {
  const body = fixed == null ? nf(v, u.decimals ?? 2) : Number(v).toLocaleString('en-IN', { minimumFractionDigits: fixed, maximumFractionDigits: fixed })
  return `${u.prefix || ''}${body}${u.suffix || ''}`
}
const clean = (n) => Math.round(n * 1e6) / 1e6

/** A round maximum and clean tick values, with room past the longest bar for its label. */
function niceScale(max, fixedMax) {
  if (fixedMax) return { max: fixedMax, ticks: [0, 1, 2, 3, 4].map((i) => (fixedMax * i) / 4) }
  if (!(max > 0)) return { max: 1, ticks: [0, 1] }
  const e = 10 ** Math.floor(Math.log10(max / 4))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * e).find((s) => Math.ceil(max / s) <= 5)
  let top = step * Math.ceil(max / step)
  if (top < max * 1.12) top += step
  const ticks = []
  for (let t = 0; t <= top + step / 1000; t += step) ticks.push(clean(t))
  return { max: top, ticks, step }
}
const tickDecimals = (scale) => (scale.step === undefined || scale.step % 1 === 0 ? 0 : Math.round(scale.step * 10) / 10 === scale.step ? 1 : 2)

function useReady() {
  const [ready, setReady] = useState(prefersReducedMotion())
  useEffect(() => {
    if (ready) return undefined
    const id = setTimeout(() => setReady(true), 40)
    return () => clearTimeout(id)
  }, [ready])
  return ready
}

/** One tooltip for the whole chart. Hover and keyboard focus show the same thing. */
function useTip() {
  const wrap = useRef(null)
  const [tip, setTip] = useState(null)
  const show = (content, x, y) => setTip({ content, x, y })
  const bind = (content) => ({
    tabIndex: 0,
    'aria-label': `${content.title}. ${content.lines.map((l) => `${l.name} ${l.value}`).join('. ')}`,
    onPointerMove: (e) => {
      const r = wrap.current.getBoundingClientRect()
      show(content, e.clientX - r.left, e.clientY - r.top)
    },
    onPointerLeave: () => setTip(null),
    onFocus: (e) => {
      const r = wrap.current.getBoundingClientRect()
      const t = e.currentTarget.getBoundingClientRect()
      show(content, t.left - r.left + Math.min(t.width / 2, 160), t.bottom - r.top - 8)
    },
    onBlur: () => setTip(null),
  })
  const node = tip && (
    <div role="tooltip" className="pointer-events-none absolute z-10 w-[232px] rounded-sm bg-surface p-3 text-12 shadow-raised ring-1 ring-sep"
      style={{ left: Math.max(0, Math.min(tip.x + 14, (wrap.current?.clientWidth ?? 300) - 232)), top: tip.y + 16 }}>
      <div className="text-13 font-semibold leading-[17px] text-ink">{tip.content.title}</div>
      {tip.content.lines.map((l) => (
        <div key={l.name} className="mt-1.5 flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-1.5 text-mute">
            {l.color && <i className="inline-block h-[3px] w-3 shrink-0 rounded-full" style={{ background: l.color }} aria-hidden="true" />}
            {l.name}
          </span>
          <b className="whitespace-nowrap font-semibold text-ink">{l.value}</b>
        </div>
      ))}
      {tip.content.note && <div className="mt-2 leading-4 text-mute">{tip.content.note}</div>}
    </div>
  )
  return { wrap, bind, node }
}

/* ------------------------------------------------------------------ layout shared by the row charts */
const GRID = 'grid grid-cols-[var(--lw)_minmax(0,1fr)_var(--vw)]'

/** Gridlines + axis for a set of rows. Labels sit in the left column, or above the bar on narrow screens. */
function Plot({ ticks, pos, tickLabel, vw = 0, caption, over, children, headSpace }) {
  return (
    <div className="[--lw:192px] max-[560px]:[--lw:0px]" style={{ '--vw': `${vw}px` }}>
      <div className={cx('relative', headSpace && 'pt-5')}>
        <div className="pointer-events-none absolute inset-y-0 left-[var(--lw)] right-[var(--vw)]" aria-hidden="true">
          {ticks.map((t, i) => <i key={t} className={cx('absolute inset-y-0 w-px', i === 0 ? 'bg-viz-axis' : 'bg-sep')} style={{ left: `${pos(t)}%` }} />)}
          {over}
        </div>
        <div role="list" className="relative">{children}</div>
      </div>
      <div className={cx(GRID, 'mt-1')}>
        <div className="relative col-start-2 h-4">
          {ticks.map((t, i) => (
            <span key={t} className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-11 tabular-nums text-mute" style={{ left: `${pos(t)}%` }}>
              {tickLabel(t, i)}
            </span>
          ))}
        </div>
      </div>
      {caption && <div className={cx(GRID, 'mt-0.5')}><div className="col-start-2 text-right text-11 text-mute">{caption}</div></div>}
    </div>
  )
}

function Row({ label, plot, value, bind }) {
  return (
    <div role="listitem" {...bind}
      className={cx(GRID, 'group items-center rounded-sm outline-offset-0 hover:bg-[color-mix(in_srgb,var(--fill)_60%,transparent)] focus-visible:bg-[color-mix(in_srgb,var(--fill)_60%,transparent)]')}>
      <div className="col-start-1 row-start-1 py-1.5 pr-3 text-13 leading-[17px] text-ink max-[560px]:col-span-3 max-[560px]:pb-0">{label}</div>
      <div className="relative col-start-2 row-start-1 h-9 max-[560px]:row-start-2">{plot}</div>
      {value !== undefined && <div className="col-start-3 row-start-1 pl-3 max-[560px]:row-start-2">{value}</div>}
    </div>
  )
}

const grow = (ready, pct) => ({ width: ready ? `${pct}%` : '0%' })
const BAR = 'absolute left-0 not-italic rounded-r-[4px] transition-[width] duration-500 ease-out group-hover:brightness-110 group-focus-visible:brightness-110'
const TIP_LABEL = 'absolute whitespace-nowrap text-12 font-semibold text-ink transition-opacity duration-500'

/* ------------------------------------------------------------------ bars */
function BarsChart({ chart, ready, tip }) {
  const { rows, unit, axis_unit: au = {} } = chart
  const scale = useMemo(() => niceScale(Math.max(...rows.map((r) => r.value))), [rows])
  const pos = (v) => (v / scale.max) * 100
  const thick = rows.length > 8 ? 14 : 18
  const dec = fixedDecimals(rows.map((r) => r.value), unit.decimals ?? 2)
  const td = tickDecimals(scale)
  return (
    <Plot ticks={scale.ticks} pos={pos} tickLabel={(t) => fmtVal(t, au, td)} caption={chart.axis_caption}>
      {rows.map((r) => {
        const p = pos(r.value)
        const inside = p > 86
        const text = fmtVal(r.value, unit, dec)
        const content = { title: r.label, lines: [{ name: chart.value_name || 'Value', value: text, color: 'var(--viz-1)' }], note: r.detail }
        return (
          <Row key={r.id} label={r.label} bind={tip.bind(content)}
            plot={<>
              <i className={cx(BAR, 'top-1/2 -translate-y-1/2 bg-viz-1')} style={{ height: thick, ...grow(ready, p) }}>
                {inside && <span className="absolute inset-y-0 right-2 flex items-center text-12 font-semibold text-white">{text}</span>}
              </i>
              {!inside && <span className={cx(TIP_LABEL, 'top-1/2 -translate-y-1/2', ready ? 'opacity-100' : 'opacity-0')} style={{ left: `calc(${p}% + 8px)` }}>{text}</span>}
            </>} />
        )
      })}
    </Plot>
  )
}

/* ------------------------------------------------------------------ bullet: bar + plan marker */
function BulletChart({ chart, ready, tip }) {
  const { rows, unit, axis_unit: au = {} } = chart
  const scale = niceScale(0, chart.axis_max || 100)
  const pos = (v) => (v / scale.max) * 100
  return (
    <Plot ticks={scale.ticks} pos={pos} vw={128} tickLabel={(t) => fmtVal(t, { ...au, decimals: 0 })}>
      {rows.map((r) => {
        const content = {
          title: r.label,
          lines: [{ name: 'Progress', value: fmtVal(r.value, unit), color: 'var(--viz-1)' }, { name: 'Plan', value: fmtVal(r.target, unit) }],
          note: r.detail,
        }
        return (
          <Row key={r.id} label={r.label} bind={tip.bind(content)}
            plot={<>
              <i className={cx(BAR, 'top-1/2 -translate-y-1/2 bg-viz-1')} style={{ height: 14, ...grow(ready, pos(r.value)) }} />
              <i className="absolute top-1/2 h-[22px] w-[3px] -translate-y-1/2 rounded-full bg-ink ring-2 ring-surface" style={{ left: `calc(${pos(r.target)}% - 1.5px)` }} aria-hidden="true" />
            </>}
            value={<span className="whitespace-nowrap text-13"><b className="font-semibold">{fmtVal(r.value, unit)}</b><span className="text-12 text-mute"> of {fmtVal(r.target, unit)} plan</span></span>} />
        )
      })}
    </Plot>
  )
}

/* ------------------------------------------------------------------ grouped: two bars per row */
const SERIES_COLOR = ['var(--viz-1)', 'var(--viz-2)']
const SERIES_CLASS = ['bg-viz-1', 'bg-viz-2']

function GroupedChart({ chart, ready, tip }) {
  const { rows, series, unit, axis_unit: au = {} } = chart
  const scale = niceScale(0, chart.axis_max || 100)
  const pos = (v) => (v / scale.max) * 100
  return (
    <Plot ticks={scale.ticks} pos={pos} tickLabel={(t) => fmtVal(t, { ...au, decimals: 0 })}>
      {rows.map((r) => {
        const content = { title: r.label, lines: series.map((s, k) => ({ name: s.name, value: fmtVal(r.values[k], unit), color: SERIES_COLOR[k] })), note: r.detail }
        return (
          <Row key={r.id} label={r.label} bind={tip.bind(content)}
            plot={
              <div className="absolute inset-y-[5px] left-0 right-0">
                {series.map((s, k) => {
                  const p = pos(r.values[k])
                  const inside = p > 88
                  const text = fmtVal(r.values[k], unit)
                  return (
                    <div key={s.key} className="absolute left-0 right-0" style={{ top: k * 14, height: 11 }}>
                      <i className={cx(BAR, 'inset-y-0', SERIES_CLASS[k])} style={grow(ready, p)}>
                        {inside && <span className="absolute inset-y-0 right-1.5 flex items-center text-11 font-semibold leading-none text-white">{text}</span>}
                      </i>
                      {!inside && <span className={cx(TIP_LABEL, 'top-1/2 -translate-y-1/2 text-11', ready ? 'opacity-100' : 'opacity-0')} style={{ left: `calc(${p}% + 6px)` }}>{text}</span>}
                    </div>
                  )
                })}
              </div>
            } />
        )
      })}
    </Plot>
  )
}

/* ------------------------------------------------------------------ range: dates on a time axis */
function monthTicks(min, max) {
  const a = new Date(min), b = new Date(max)
  const months = (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth() + 1
  const step = [1, 2, 3, 6, 12].find((s) => months / s <= 6) || 12
  const out = []
  for (let m = new Date(a.getFullYear(), a.getMonth() + 1, 1); m <= b; m = new Date(m.getFullYear(), m.getMonth() + 1, 1)) {
    if (m.getMonth() % step === 0) out.push(m.getTime())
  }
  return out
}

function RangeChart({ chart, ready, tip }) {
  const { rows } = chart
  const today = chart.today ? D(chart.today).getTime() : null
  const times = rows.flatMap((r) => [D(r.from).getTime(), D(r.to).getTime()]).concat(today ?? [])
  const lo0 = Math.min(...times), hi0 = Math.max(...times), span = Math.max(hi0 - lo0, 864e5 * 30)
  const lo = lo0 - span * 0.05, hi = hi0 + span * 0.14
  const pos = (ms) => ((ms - lo) / (hi - lo)) * 100
  const ticks = useMemo(() => monthTicks(lo, hi), [lo, hi])
  const tickLabel = (ms, i) => {
    const d = new Date(ms)
    return d.toLocaleDateString('en-GB', i === 0 || d.getMonth() === 0 ? { month: 'short', year: 'numeric' } : { month: 'short' })
  }
  return (
    <Plot ticks={ticks} pos={pos} tickLabel={tickLabel} headSpace={today !== null}
      over={today !== null && (
        <>
          <i className="absolute inset-y-0 z-[1] w-px bg-ink" style={{ left: `${pos(today)}%` }} />
          <span className="absolute top-0 z-[1] -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-ink px-1.5 py-px text-11 font-semibold text-surface" style={{ left: `${pos(today)}%` }}>Today</span>
        </>
      )}>
      {rows.map((r) => {
        const a = D(r.from).getTime(), b = D(r.to).getTime()
        const late = r.slip_weeks > 0
        const early = r.slip_weeks < 0
        const slipText = late ? `+${r.slip_weeks} wks` : early ? `${-r.slip_weeks} wks early` : 'On plan'
        const content = {
          title: r.label,
          lines: [
            { name: 'Revised target', value: fmtD(D(r.from)) },
            { name: 'Forecast', value: fmtD(D(r.to)), color: 'var(--viz-1)' },
            { name: late ? 'Slip' : 'Against target', value: slipText.replace('wks', 'weeks') },
            { name: 'Progress', value: `${r.progress}%` },
          ],
          note: r.detail,
        }
        return (
          <Row key={r.id} label={r.label} bind={tip.bind(content)}
            plot={<>
              <i className="absolute top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-viz-1 transition-[width] duration-500 ease-out"
                style={{ left: `${pos(Math.min(a, b))}%`, width: ready ? `${Math.abs(pos(b) - pos(a))}%` : '0%' }} />
              <i className="absolute top-1/2 box-border size-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-surface" style={{ left: `${pos(a)}%` }} aria-hidden="true" />
              <i className="absolute top-1/2 size-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-viz-1 ring-2 ring-surface" style={{ left: `${pos(b)}%` }} aria-hidden="true" />
              <span className={cx(TIP_LABEL, 'top-1/2 -translate-y-1/2', late ? '' : 'font-medium text-mute', ready ? 'opacity-100' : 'opacity-0')}
                style={Math.max(pos(a), pos(b)) > 78 ? { right: `calc(${100 - Math.min(pos(a), pos(b))}% + 12px)` } : { left: `calc(${Math.max(pos(a), pos(b))}% + 12px)` }}>
                {slipText}
              </span>
            </>} />
        )
      })}
    </Plot>
  )
}

/* ------------------------------------------------------------------ segments: one whole split into parts */
const TONE = {
  risk: { bg: 'bg-viz-bad', text: 'text-white', icon: CircleAlert, color: 'var(--viz-bad)' },
  watch: { bg: 'bg-viz-warn', text: 'text-[#0b0b0b]', icon: TriangleAlert, color: 'var(--viz-warn)' },
  ok: { bg: 'bg-viz-good', text: 'text-white', icon: CircleCheck, color: 'var(--viz-good)' },
}

function SegmentsChart({ chart, tip }) {
  const parts = chart.parts
  const total = parts.reduce((s, p) => s + p.value, 0)
  return (
    <div>
      <div role="list" className="flex h-7 gap-0.5">
        {parts.map((p) => {
          const t = TONE[p.key]
          const content = { title: p.label, lines: [{ name: 'Projects', value: `${p.value} of ${total}` }], note: p.names.join(', ') }
          return (
            <div key={p.key} role="listitem" {...tip.bind(content)}
              className={cx('flex min-w-0 items-center rounded-[4px] px-2 text-12 font-semibold hover:brightness-110', t.bg, t.text)}
              style={{ flex: `${p.value} 1 0` }}>
              {p.value / total >= 0.08 && p.value}
            </div>
          )
        })}
      </div>
      <ul className="mt-4 flex flex-col gap-2.5">
        {parts.map((p) => {
          const t = TONE[p.key]
          return (
            <li key={p.key} className="flex items-start gap-2 text-13">
              <t.icon size={16} strokeWidth={2} className="mt-px shrink-0" style={{ color: t.color }} aria-hidden="true" />
              <span><b className="font-semibold">{p.label}</b><span className="text-mute"> · {p.names.join(', ')}</span></span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ legend, table view, frame */
function Legend({ chart }) {
  const item = 'inline-flex items-center gap-1.5'
  if (chart.type === 'bullet') {
    return (
      <>
        <span className={item}><i className="inline-block h-2.5 w-4 rounded-r-[3px] bg-viz-1" aria-hidden="true" />Progress today</span>
        <span className={item}><i className="inline-block h-3.5 w-[3px] rounded-full bg-ink" aria-hidden="true" />Planned by today</span>
      </>
    )
  }
  if (chart.type === 'grouped') {
    return chart.series.map((s, k) => <span key={s.key} className={item}><i className={cx('inline-block h-2.5 w-4 rounded-r-[3px]', SERIES_CLASS[k])} aria-hidden="true" />{s.name}</span>)
  }
  if (chart.type === 'range') {
    return (
      <>
        <span className={item}><i className="box-border inline-block size-[11px] rounded-full border-2 border-ink bg-surface" aria-hidden="true" />Revised target</span>
        <span className={item}><i className="inline-block size-[11px] rounded-full bg-viz-1" aria-hidden="true" />Forecast</span>
        <span className={item}><i className="inline-block h-3.5 w-px bg-ink" aria-hidden="true" />Today</span>
      </>
    )
  }
  return null
}

function DataTable({ table }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-13">
        <thead>
          <tr>{table.columns.map((c, i) => <th key={c} scope="col" className={cx('border-b border-sep py-2 pr-4 text-12 font-medium text-mute', typeof table.rows[0]?.[i] === 'number' ? 'text-right' : 'text-left')}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i}>{r.map((v, j) => <td key={j} className={cx('border-b border-sep py-2 pr-4 align-top', typeof v === 'number' ? 'text-right tabular-nums' : 'text-left')}>{typeof v === 'number' ? nf(v) : v}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const BODY = { bars: BarsChart, bullet: BulletChart, grouped: GroupedChart, range: RangeChart, segments: SegmentsChart }

export function AskChart({ chart }) {
  const [view, setView] = useState('chart')
  const ready = useReady()
  const tip = useTip()
  const Body = BODY[chart.type]
  if (!Body) return null
  const legend = chart.type !== 'bars' && chart.type !== 'segments'
  return (
    <figure aria-label={chart.title} className="m-0 mb-4 mt-2 max-w-[760px] rounded-md border border-sep p-4 max-[560px]:p-3">
      <figcaption className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <div className="text-15 font-semibold leading-5">{chart.title}</div>
          {chart.subtitle && <div className="mt-0.5 text-12 text-mute">{chart.subtitle}</div>}
        </div>
        <div role="group" aria-label="Chart or table" className="inline-flex shrink-0 gap-0.5 rounded-sm bg-fill p-0.5">
          {[['chart', 'Chart'], ['table', 'Table']].map(([v, l]) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}
              className={cx('cursor-pointer rounded-[6px] border-0 px-2.5 py-1 text-12 font-medium', view === v ? 'bg-surface font-semibold shadow-card' : 'bg-transparent text-mute')}>
              {l}
            </button>
          ))}
        </div>
      </figcaption>

      {view === 'chart' ? (
        <div ref={tip.wrap} className="relative">
          <Body chart={chart} ready={ready} tip={tip} />
          {tip.node}
        </div>
      ) : <DataTable table={chart.table} />}

      {(legend && view === 'chart') && <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-12 text-mute"><Legend chart={chart} /></div>}
      {chart.note && <p className="mt-3 text-11 text-mute">{chart.note}</p>}
    </figure>
  )
}

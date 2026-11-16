import { cx } from '../ui'

const unitFmt = (v, u) => u === '₹ Cr' ? '₹' + v + ' Cr' : u === '%' ? v + '%' : u === 'weeks' ? v + ' wks' : u === 'days' ? v + ' days' : u === 'tonnes' ? Number(v).toLocaleString('en-IN') + ' t' : String(v)
const TXT = 'fill-mute text-12'

/** Horizontal bars: {title, unit, rows:[{label, value, compare}], compare_label} */
export function HBar({ c }) {
  const rows = (c.rows || []).filter((r) => Number.isFinite(r.value)).slice(0, 12)
  if (!rows.length) return null
  const hasCmp = rows.some((r) => r.compare != null)
  const mx = Math.max(...rows.map((r) => Math.max(r.value, r.compare || 0)), 0.0001)
  const w = (v) => (Math.max(0, v) / mx * 100).toFixed(1) + '%'
  return (
    <div className="mb-4 flex flex-col gap-1.5" role="img" aria-label={c.title || 'Chart'}>
      {c.title && <div className="mb-1.5 text-12 font-semibold text-mute">{c.title}</div>}
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[minmax(80px,34%)_minmax(0,1fr)_auto] items-center gap-2 text-12">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-mute" title={r.label}>{r.label}</span>
          <span className="relative h-3">
            <i className="absolute inset-y-0 left-0 min-w-[2px] rounded-[4px] bg-chart-line" style={{ width: w(r.value) }} />
            {r.compare != null && <b className="absolute -inset-y-1 w-0 border-l-2 border-dashed border-mute" style={{ left: w(r.compare) }} />}
          </span>
          <span className="min-w-[52px] whitespace-nowrap font-semibold tabular-nums">{unitFmt(r.value, c.unit)}</span>
        </div>
      ))}
      {hasCmp && <div className="mt-1 text-12 text-mute">Marker = {c.compare_label || 'plan'}</div>}
    </div>
  )
}

/** Time series: {kind:'columns'|'line', unit, labels, values, compare, compare_label, min} */
export function SeriesChart({ c }) {
  const n = c.values.length, w = 680, H = 200, pl = 6, pr = 64, pt = 22, pb = 24
  const all = c.values.concat(c.compare || [])
  let mn = c.min != null ? c.min : (c.kind === 'line' ? Math.min(...all) : 0), mx = Math.max(...all)
  const pad = (mx - mn) * 0.12 || 1
  if (c.kind === 'line' && c.min == null) mn -= pad
  mx += pad
  const step = (w - pl - pr) / n
  const x = (i) => pl + (i + 0.5) * step
  const y = (v) => pt + (mx - v) / (mx - mn) * (H - pt - pb)
  const top = Math.max(...all)
  const tip = (i) => `${c.labels[i]}: ${unitFmt(c.values[i], c.unit)}${c.compare ? ` (${c.compare_label || 'plan'} ${unitFmt(c.compare[i], c.unit)})` : ''}`
  const grid = [top, (top + mn) / 2]
  const d = c.values.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ')
  const bw = step * 0.56
  return (
    <div className="mb-4 overflow-x-auto">
      <svg className="block h-auto w-full" style={{ maxWidth: w + 80 }} viewBox={`0 0 ${w} ${H}`} role="img" aria-label="Chart">
        {grid.map((g, i) => {
          const r = Math.abs(g) >= 100 ? Math.round(g) : Math.round(g * 10) / 10
          return <g key={i}><line className="stroke-sep" x1={pl} x2={w - pr} y1={y(g).toFixed(1)} y2={y(g).toFixed(1)} /><text className={TXT} x={w - pr + 6} y={(y(g) + 4).toFixed(1)}>{unitFmt(r, c.unit)}</text></g>
        })}
        <line className="stroke-sep" x1={pl} x2={w - pr} y1={H - pb} y2={H - pb} />
        {c.kind === 'line' ? (
          <>
            <path className="fill-chart-area" d={`${d} L${x(n - 1).toFixed(1)} ${H - pb} L${x(0).toFixed(1)} ${H - pb} Z`} />
            <path className="fill-none stroke-chart-line" strokeWidth="2" d={d} />
            {c.values.map((v, i) => <circle key={i} className="fill-chart-line" cx={x(i).toFixed(1)} cy={y(v).toFixed(1)} r={i === n - 1 ? 4 : 2.5}><title>{tip(i)}</title></circle>)}
          </>
        ) : c.values.map((v, i) => (
          <g key={i}>
            <rect className="fill-chart-line" x={(x(i) - bw / 2).toFixed(1)} y={y(v).toFixed(1)} width={bw.toFixed(1)} height={Math.max(1, H - pb - y(v)).toFixed(1)} rx="3"><title>{tip(i)}</title></rect>
            {c.compare && <line className="stroke-mute" strokeWidth="1.5" strokeDasharray="3 3" x1={(x(i) - step * 0.42).toFixed(1)} x2={(x(i) + step * 0.42).toFixed(1)} y1={y(c.compare[i]).toFixed(1)} y2={y(c.compare[i]).toFixed(1)} />}
          </g>
        ))}
        <text className="fill-ink text-12 font-semibold" x={x(n - 1).toFixed(1)} y={(Math.min(y(c.values[n - 1]), c.compare ? y(c.compare[n - 1]) : 999) - 7).toFixed(1)} textAnchor="middle">{unitFmt(c.values[n - 1], c.unit)}</text>
        {c.labels.map((l, i) => (n <= 12 || i % 2 === 0) && <text key={i} className={TXT} x={x(i).toFixed(1)} y={H - 7} textAnchor="middle">{l}</text>)}
      </svg>
      {c.compare && <div className="mt-1 text-12 text-mute">Dashed line = {c.compare_label || 'plan'}</div>}
    </div>
  )
}

/** Ask answers send {rows} (no kind: horizontal bars); department pages send {kind:'columns'|'line', values}. */
export const AnyChart = ({ c }) => {
  if (!c) return null
  if (Array.isArray(c.rows)) return <HBar c={c} />
  if (Array.isArray(c.values) && c.values.length) return <SeriesChart c={c} />
  return null
}

/* ---- small visuals on the Home tiles ---- */
export function Spark({ vals }) {
  const w = 200, h = 52, mn = Math.min(...vals), mx = Math.max(...vals), r = (mx - mn) || 1
  const pt = (v, i) => [(i / (vals.length - 1) * (w - 6) + 3).toFixed(1), (h - 6 - (v - mn) / r * (h - 14)).toFixed(1)]
  const d = vals.map((v, i) => (i ? 'L' : 'M') + pt(v, i).join(' ')).join(' ')
  return (
    <svg className="block h-[52px] w-full overflow-visible" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <path className="fill-chart-area" d={`${d} L${w - 3} ${h} L3 ${h} Z`} />
      <path className="fill-none stroke-chart-line" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" d={d} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
export function Rings({ list }) {
  const C = 2 * Math.PI * 22
  return (
    <span className="flex justify-around gap-2">
      {list.map((r) => (
        <span key={r.label} className="flex flex-col items-center gap-0.5 text-11 text-mute">
          <svg className="size-14" viewBox="0 0 56 56" role="img" aria-label={`${r.label} ${r.value}%, target ${r.target}%`}>
            <circle className="fill-none stroke-fill" strokeWidth="6" cx="28" cy="28" r="22" />
            <circle className={cx('fill-none', r.value < r.target ? 'stroke-caution' : 'stroke-chart-line')} strokeWidth="6" strokeLinecap="round" cx="28" cy="28" r="22" strokeDasharray={`${(C * r.value / 100).toFixed(1)} ${C.toFixed(1)}`} transform="rotate(-90 28 28)" />
            <text className="fill-ink text-14 font-semibold" x="28" y="33" textAnchor="middle">{r.value}</text>
          </svg>
          {r.label}
        </span>
      ))}
    </span>
  )
}
export function MiniBars({ t }) {
  const mn = t.min ?? 0, mx = t.max ?? Math.max(...t.values)
  return (
    <span className="flex h-[52px] items-end gap-[3px]" aria-hidden="true">
      {t.values.map((v, i) => <i key={i} className="min-h-[3px] flex-1 rounded-t-[2px] bg-chart-line" style={{ height: `${Math.max(6, (v - mn) / (mx - mn) * 100).toFixed(0)}%` }} title={String(v)} />)}
    </span>
  )
}

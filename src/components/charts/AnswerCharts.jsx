/** Charts shown under answers. Plain SVG, themed through Tailwind fill/stroke utilities. */
const TXT = 'fill-mute text-12'

export function BarsChart({ rows, unit }) {
  const w = 560, rowH = 36, lab = 70, H = rows.length * rowH + 8
  const mx = Math.max(...rows.map((r) => Math.max(r[1], r[2] || 0))) * 1.12
  const x = (v) => lab + v / mx * (w - lab - 80)
  return (
    <div className="mb-4 overflow-x-auto">
      <svg className="block max-w-full" viewBox={`0 0 ${w} ${H}`} width={w} role="img" aria-label="Bar chart">
        {rows.map((r, i) => {
          const y = i * rowH + 6
          return (
            <g key={r[0]}>
              <text className={TXT} x="0" y={y + 15}>{r[0]}</text>
              <rect className="fill-chart-line" x={lab} y={y + 4} width={(x(r[1]) - lab).toFixed(1)} height="14" rx="4" />
              {r[2] && <line className="stroke-mute" strokeWidth="1.5" strokeDasharray="3 3" x1={x(r[2]).toFixed(1)} x2={x(r[2]).toFixed(1)} y1={y} y2={y + 22} />}
              <text className="fill-ink text-12 font-semibold" x={(Math.max(x(r[1]), r[2] ? x(r[2]) : 0) + 8).toFixed(1)} y={y + 15}>{unit}{r[1]}</text>
            </g>
          )
        })}
      </svg>
      {rows.some((r) => r[2]) && <div className="mt-1 text-12 text-mute">Dashed line = plan</div>}
    </div>
  )
}

export function LineChart({ labels, vals, fmt }) {
  const w = 560, H = 150, pl = 8, pr = 48, pt = 14, pb = 24
  const mn = Math.min(...vals) - 0.5, mx = Math.max(...vals) + 0.5
  const x = (i) => pl + i * (w - pl - pr) / (vals.length - 1)
  const y = (v) => pt + (mx - v) / (mx - mn) * (H - pt - pb)
  const d = vals.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ')
  const li = vals.length - 1
  return (
    <div className="mb-4 overflow-x-auto">
      <svg className="block max-w-full" viewBox={`0 0 ${w} ${H}`} width={w} role="img" aria-label="Line chart">
        {[mn + 0.5, mx - 0.5].map((g) => (
          <g key={g}>
            <line className="stroke-sep" x1={pl} x2={w - pr} y1={y(g).toFixed(1)} y2={y(g).toFixed(1)} />
            <text className={TXT} x={w - pr + 6} y={(y(g) + 4).toFixed(1)}>{fmt(g)}</text>
          </g>
        ))}
        <path className="fill-chart-area" d={`${d} L${x(li)} ${H - pb} L${pl} ${H - pb} Z`} />
        <path className="fill-none stroke-chart-line" strokeWidth="2" d={d} />
        <circle className="fill-chart-line" cx={x(li)} cy={y(vals[li])} r="4" />
        {labels.map((l, i) => (
          <text key={i} className={TXT} x={x(i).toFixed(1)} y={H - 6} textAnchor={i === 0 ? 'start' : i === li ? 'end' : 'middle'}>{l}</text>
        ))}
      </svg>
    </div>
  )
}

export function AnswerChart({ chart }) {
  if (!chart) return null
  return chart.kind === 'bars' ? <BarsChart rows={chart.rows} unit={chart.unit} /> : <LineChart labels={chart.labels} vals={chart.vals} fmt={chart.fmt} />
}

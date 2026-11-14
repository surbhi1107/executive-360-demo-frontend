export function Sparkline({ pts }) {
  const w = 200, h = 36
  const mn = Math.min(...pts), mx = Math.max(...pts), r = (mx - mn) || 1
  const xy = pts.map((p, i) => [1 + i * (w - 6) / (pts.length - 1), h - 3 - (p - mn) / r * (h - 8)])
  const d = xy.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  const last = xy[xy.length - 1]
  return (
    <svg className="mt-2 block h-9 w-full overflow-visible" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <path className="fill-chart-area" d={`${d} L${last[0]} ${h} L1 ${h} Z`} />
      <path className="fill-none stroke-chart-line" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" d={d} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

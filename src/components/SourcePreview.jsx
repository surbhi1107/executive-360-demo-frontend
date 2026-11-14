import { CirclePlay, Image as ImageIcon, ImagePlay } from 'lucide-react'
import { Rich } from '../lib/rich'
import { cx } from './ui'

const MEDIA_ICON = { video: CirclePlay, image: ImageIcon, gif: ImagePlay }

/** The "what exactly was used" preview shown in the source sheet. */
export function SourcePreview({ pv }) {
  if (!pv) return null

  if (pv.t === 'cells') {
    const hi = new Set(pv.hi.map(([r, c]) => r + ':' + c))
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-12 tabular-nums">
          <thead><tr>{pv.head.map((h, i) => <th key={i} className="whitespace-nowrap border border-sep bg-fill px-2 py-[5px] text-right font-medium text-ink">{h}</th>)}</tr></thead>
          <tbody>
            {pv.rows.map((r, ri) => (
              <tr key={ri}>
                {r.map((v, ci) => (
                  <td key={ci} className={cx('whitespace-nowrap border border-sep px-2 py-[5px] text-right',
                    ci === 0 && 'w-7 bg-fill text-center', ci === 1 && 'text-left',
                    hi.has(ri + ':' + ci) && 'bg-accent-soft font-semibold shadow-[inset_0_0_0_1.5px_var(--accent)]')}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (pv.t === 'quote') {
    return (
      <div className="rounded-md bg-fill p-4 text-14 leading-[21px]">
        {pv.text != null ? <span className="whitespace-pre-line">{pv.text}</span> : <Rich text={pv.html} />}
      </div>
    )
  }

  if (pv.t === 'slide') {
    return (
      <div className="box-border flex aspect-video max-w-full flex-col gap-2 rounded-md bg-fill p-6 shadow-[inset_0_0_0_1px_var(--separator)]">
        <b className="text-16">{pv.title}</b>
        {pv.lines.map((l, i) => <span key={i} className="text-13 before:content-['•_']">{l}</span>)}
      </div>
    )
  }

  if (pv.t === 'record') {
    return (
      <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 rounded-md bg-fill p-4 text-13">
        {pv.rows.map(([k, v], i) => (
          <div key={i} className="contents"><dt className="m-0 font-semibold text-ink">{k}</dt><dd className="m-0">{v}</dd></div>
        ))}
      </dl>
    )
  }

  if (pv.t === 'media') {
    const Icon = MEDIA_ICON[pv.kind]
    return (
      <>
        <div role="img" aria-label={`${pv.kind} preview`}
          className={cx('relative grid max-w-full place-items-center overflow-hidden rounded-md bg-ink text-bg', pv.kind === 'image' ? 'aspect-[4/3]' : 'aspect-video')}>
          <Icon size={44} strokeWidth={1.6} className="opacity-85" />
          <span className="absolute bottom-3 left-3 rounded-[6px] bg-bg px-2 py-0.5 text-12 font-semibold tabular-nums text-ink">{pv.label}</span>
          {pv.kind === 'video' && <span className="absolute inset-x-0 bottom-0 h-[3px] bg-mute"><i className="block h-full bg-accent" style={{ width: `${pv.pct || 30}%` }} /></span>}
        </div>
        <p className="text-12 text-mute">{pv.caption}</p>
      </>
    )
  }
  return null
}

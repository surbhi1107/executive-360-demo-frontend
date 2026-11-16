/* Small UI kit used across the app (Tailwind classes only). */
import { KINDS } from '../../lib/kinds'

export const cx = (...a) => a.filter(Boolean).join(' ')

const STATUS_TEXT = { ok: 'text-positive', watch: 'text-caution', risk: 'text-critical' }

/** Coloured dot + label: On track / Watch / At risk */
export function Status({ s, children, className, weight = 'font-medium' }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 whitespace-nowrap text-12', weight, STATUS_TEXT[s], className)}>
      <span className="size-2 shrink-0 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  )
}
export const StatusDot = ({ s, title }) => (
  <span title={title} className={cx('inline-block size-2 shrink-0 rounded-full bg-current', STATUS_TEXT[s])} />
)

export function Card({ as: Tag = 'div', className, ...p }) {
  return <Tag className={cx('min-w-0 rounded-lg bg-surface p-6 shadow-card max-[760px]:p-4', className)} {...p} />
}

export const Title1 = ({ className, ...p }) => <h1 className={cx('text-28 font-semibold tracking-[-0.015em] [text-wrap:balance]', className)} {...p} />
export const Title2 = ({ className, ...p }) => <h2 className={cx('text-20 font-semibold tracking-[-0.01em]', className)} {...p} />
export const Subhead = ({ className, ...p }) => <p className={cx('mt-1 text-13 text-mute', className)} {...p} />

/** Page header: title + optional subhead on the left, optional actions on the right */
export function PageHead({ title, sub, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <Title1>{title}</Title1>
        {sub != null && <Subhead>{sub}</Subhead>}
      </div>
      {children}
    </div>
  )
}

export function Segmented({ options, value, onChange, label }) {
  return (
    <div role="group" aria-label={label} className="inline-flex gap-0.5 rounded-md bg-fill p-[3px]">
      {options.map(([v, l]) => (
        <button key={v} type="button" aria-pressed={v === value} onClick={() => onChange(v)}
          className={cx('cursor-pointer rounded-[11px] border-0 px-3.5 py-1.5 text-13 font-medium', v === value ? 'bg-surface font-semibold shadow-card' : 'bg-transparent')}>
          {l}
        </button>
      ))}
    </div>
  )
}

export const Chip = ({ className, ...p }) => (
  <button type="button" className={cx('cursor-pointer rounded-sm border-0 bg-accent-soft px-3 py-1.5 text-13 font-medium text-accent hover:brightness-[.97]', className)} {...p} />
)

export const LinkBtn = ({ className, ...p }) => (
  <button type="button" className={cx('cursor-pointer border-0 bg-transparent p-0 text-accent hover:underline', className)} {...p} />
)

export const Btn = ({ small, className, ...p }) => (
  <button type="button" className={cx('cursor-pointer self-start rounded-md border-0 bg-accent font-semibold text-on-accent active:scale-[.98] disabled:opacity-60', small ? 'px-4 py-2 text-14' : 'px-4 py-3', className)} {...p} />
)
export const BtnOutline = ({ className, ...p }) => (
  <button type="button" className={cx('cursor-pointer rounded-md border border-ctl bg-surface px-4 py-2 text-14 font-semibold text-ink', className)} {...p} />
)

/** File-type badge (XLS, DOC, PDF…) */
export function KindTag({ k, lg }) {
  return (
    <span aria-hidden="true" className={cx(
      'inline-grid flex-none place-items-center box-border rounded-[5px] bg-surface font-bold tracking-[.04em] text-ink shadow-[inset_0_0_0_1px_var(--separator)]',
      lg ? 'h-7 min-w-10 rounded-[7px] px-1 text-12' : 'h-5 min-w-[30px] px-1 text-10')}>
      {KINDS[k][0]}
    </span>
  )
}

/** Label + value pair used in sheets */
export function KV({ k, children }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-12 font-medium text-mute">{k}</span>
      {children}
    </div>
  )
}

/** The small typing indicator shown while an agent is writing */
export function Typing({ label = 'Thinking', className }) {
  return (
    <span className={cx('inline-flex gap-1 py-3', className)} aria-label={label}>
      {[0, 1, 2].map((i) => <i key={i} className="size-1.5 animate-blink rounded-full bg-mute" style={{ animationDelay: `${i * 0.15}s` }} />)}
    </span>
  )
}

/** Section heading with a right-hand sub line */
export function SecHead({ title, sub, className }) {
  return (
    <div className={cx('flex flex-wrap items-baseline justify-between gap-3', className)}>
      <Title2>{title}</Title2>
      {sub != null && <Subhead className="mt-0">{sub}</Subhead>}
    </div>
  )
}

/** Small coloured tag for "Quick report", agent names… */
export const Tag = ({ className, ...p }) => <span className={cx('rounded-[5px] bg-accent-soft px-1.5 py-px text-12 font-semibold text-accent', className)} {...p} />

export const Field = ({ className, ...p }) => <input className={cx('box-border rounded-sm border border-ctl bg-surface px-2.5 py-2 text-14 leading-5 text-ink', className)} {...p} />
export const TextArea = ({ className, ...p }) => <textarea className={cx('box-border w-full rounded-sm border border-ctl bg-surface px-2.5 py-2 text-14 leading-5 text-ink', className)} {...p} />

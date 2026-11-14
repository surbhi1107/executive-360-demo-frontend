import { ChartColumn, ChartGantt, MessageSquare, Newspaper, Settings } from 'lucide-react'
import { VIEWS, useNav } from '../context/NavContext'
import { cx } from './ui'

const ICONS = { brief: Newspaper, ask: MessageSquare, projects: ChartGantt, reports: ChartColumn, settings: Settings }

function NavButton({ id, label, tab }) {
  const { view, go } = useNav()
  const Icon = ICONS[id]
  const current = view === id
  return (
    <button type="button" onClick={() => go(id)} aria-current={current ? 'page' : undefined}
      className={cx(
        'flex w-full cursor-pointer items-center gap-3 rounded-sm border-0 px-3 py-2 text-left text-15 leading-5 hover:bg-fill',
        current ? 'bg-accent-soft font-semibold text-accent' : 'bg-transparent',
        tab && 'w-auto flex-col gap-0.5 px-3 py-1 text-11 hover:bg-transparent max-[760px]:aria-[current=page]:bg-transparent')}>
      <Icon size={17} strokeWidth={1.6} className={cx('flex-none', current ? 'text-accent' : 'text-mute')} aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}

/** 220px sidebar on desktop */
export function Sidebar() {
  return (
    <nav aria-label="Main" className="sticky top-0 box-border flex h-screen flex-col gap-0.5 bg-surface px-3 py-6 max-[760px]:hidden">
      <div className="px-3 pb-6 text-15 font-semibold leading-5">
        <small className="block text-12 font-medium leading-4 text-mute">deepvox.ai</small>
        Executive 360°
      </div>
      {VIEWS.map(([id, l]) => <NavButton key={id} id={id} label={l} />)}
      <div className="mt-auto flex flex-col gap-3 px-3">
        <div className="flex items-center gap-2 text-13">
          <span className="grid size-7 flex-none place-items-center rounded-full bg-accent text-13 font-semibold text-on-accent">A</span>
          <span>Anita Rao<br /><span className="text-mute">CEO</span></span>
        </div>
        <div className="text-12 text-mute">Projects: live data<br />Other modules: sample</div>
      </div>
    </nav>
  )
}

/** Bottom tab bar on phones */
export function TabBar() {
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-10 hidden justify-around bg-surface pb-[calc(8px+env(safe-area-inset-bottom,0px))] pl-[max(8px,env(safe-area-inset-left,0px))] pr-[max(8px,env(safe-area-inset-right,0px))] pt-2 shadow-[0_-1px_0_var(--separator)] max-[760px]:flex">
      {VIEWS.map(([id, l]) => <NavButton key={id} id={id} label={l} tab />)}
    </nav>
  )
}

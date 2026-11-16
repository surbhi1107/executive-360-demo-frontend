import { Home, LogOut, MessageSquare, Settings, ListChecks, CircleDollarSign, TrendingUp, Factory, Heart, Users, GanttChart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { useNav } from '../context/NavContext'
import { DEPT_ORDER } from '../lib/kinds'
import { cx } from './ui'

export const ICONS = { home: Home, finance: CircleDollarSign, sales: TrendingUp, operations: Factory, customers: Heart, people: Users, projects: GanttChart, ask: MessageSquare, followups: ListChecks, settings: Settings }
const DOT = { ok: 'bg-positive', watch: 'bg-caution', risk: 'bg-critical' }

function NavButton({ id, label, tab, dot, count }) {
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
      {!tab && dot && <span className={cx('ml-auto size-2 flex-none rounded-full', DOT[dot])} />}
      {count > 0 && <span className={cx('ml-auto h-[18px] min-w-[18px] rounded-full bg-critical px-[5px] text-center text-11 font-semibold leading-[18px] text-white', tab && 'absolute -right-1 -top-0.5 ml-0')}>{count}</span>}
    </button>
  )
}

const Label = ({ children }) => <div className="px-3 pb-1 pt-4 text-11 font-semibold uppercase tracking-[.05em] text-mute">{children}</div>

export function Sidebar() {
  const { logout } = useAuth()
  const { deptById, needsYou, data, loadedAt } = useData()
  return (
    <nav aria-label="Main" className="sticky top-0 box-border flex h-screen flex-col gap-0.5 overflow-y-auto bg-surface px-3 py-6 max-[760px]:hidden">
      <div className="px-3 pb-4 text-15 font-semibold leading-5">
        <small className="block text-12 font-medium leading-4 text-mute">deepvox.ai</small>
        Executive 360°
      </div>
      <NavButton id="home" label="Home" />
      <Label>Departments</Label>
      {DEPT_ORDER.map(([id, l]) => <NavButton key={id} id={id} label={l} dot={deptById(id)?.status} />)}
      <Label>Assistant</Label>
      <NavButton id="ask" label="Ask" />
      <NavButton id="followups" label="Follow-ups" count={needsYou} />
      <NavButton id="settings" label="Settings" />
      <div className="mt-auto flex flex-col gap-3 px-3 pt-4">
        <div className="flex items-center gap-2 text-13">
          <span className="grid size-7 flex-none place-items-center rounded-full bg-accent text-13 font-semibold text-on-accent">A</span>
          <span>Anita Rao<br /><span className="text-mute">CEO</span></span>
        </div>
        <button type="button" onClick={logout}
          className="flex cursor-pointer items-center gap-2 rounded-sm border-0 bg-transparent px-0 py-1 text-left text-13 text-mute hover:text-ink">
          <LogOut size={15} strokeWidth={1.6} aria-hidden="true" /> Sign out
        </button>
        <div className="text-12 text-mute">{data ? <>Live data · loaded {loadedAt}<br />As of {data.as_of}</> : 'Loading…'}</div>
      </div>
    </nav>
  )
}

/** Bottom tab bar on phones: the main places; the department pages are reached from Home */
export function TabBar() {
  const { needsYou } = useData()
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-10 hidden justify-around bg-surface pb-[calc(8px+env(safe-area-inset-bottom,0px))] pl-[max(8px,env(safe-area-inset-left,0px))] pr-[max(8px,env(safe-area-inset-right,0px))] pt-2 shadow-[0_-1px_0_var(--separator)] max-[760px]:flex">
      <NavButton id="home" label="Home" tab />
      <NavButton id="ask" label="Ask" tab />
      <div className="relative"><NavButton id="followups" label="Follow-ups" tab count={needsYou} /></div>
      <NavButton id="settings" label="Settings" tab />
    </nav>
  )
}

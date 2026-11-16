import { useState } from 'react'
import { X } from 'lucide-react'
import { useAsk } from '../context/AskContext'
import { useData } from '../context/DataContext'
import { LinkBtn, cx } from './ui'

export function QuickReports() {
  const { qr, setQr, resetQr, ask } = useAsk()
  const { deptById } = useData()
  const [editing, setEditing] = useState(false)
  const value = (r) => { const d = r.dept && deptById(r.dept); return d && r.kpi != null ? d.kpis[r.kpi]?.value : (r.v || (d ? d.status_word : '')) }
  const where = (r) => (r.dept && deptById(r.dept) ? deptById(r.dept).name : 'All departments')

  return (
    <aside aria-label="Quick reports"
      className="sticky top-12 flex flex-col gap-2 rounded-lg bg-surface p-4 shadow-card max-[1000px]:static max-[1000px]:order-first max-[1000px]:p-3">
      <div className="flex items-baseline justify-between gap-2 px-2 pb-2 pt-1">
        <b className="text-15 leading-5">Quick reports</b>
        <LinkBtn onClick={() => setEditing((e) => !e)}>{editing ? 'Done' : 'Edit'}</LinkBtn>
      </div>
      <div className="-mt-2 px-2 pb-2 text-12 text-mute">Your daily questions, one tap away. Always current.</div>
      {qr.length ? (
        <ul className="m-0 flex list-none flex-col p-0 max-[1000px]:flex-row max-[1000px]:gap-2 max-[1000px]:overflow-x-auto max-[1000px]:pb-1">
          {qr.map((r, i) => (
            <li key={r.id} className={cx('relative flex items-center gap-2 max-[1000px]:w-[200px] max-[1000px]:flex-none',
              i > 0 && "before:absolute before:inset-x-2 before:top-0 before:border-t before:border-sep before:content-[''] max-[1000px]:before:hidden")}>
              <button type="button" onClick={() => { if (!editing) ask(r.q, { rep: r, dept: r.dept }) }}
                className="group flex min-w-0 flex-1 cursor-pointer flex-col gap-0.5 rounded-sm border-0 bg-transparent px-2 py-2.5 text-left hover:bg-fill max-[1000px]:bg-fill">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-14 font-semibold leading-[19px]">{r.name}</span>
                <span className="flex justify-between gap-2 text-12 text-mute group-hover:text-ink max-[1000px]:text-ink">
                  <span>{where(r)} · {r.cadence}</span><span className="whitespace-nowrap font-semibold tabular-nums text-ink">{value(r)}</span>
                </span>
              </button>
              {editing && (
                <button type="button" aria-label={`Remove ${r.name}`} onClick={() => setQr(qr.filter((_, j) => j !== i))}
                  className="grid size-7 flex-none cursor-pointer place-items-center rounded-full border-0 bg-fill text-ink"><X size={15} aria-hidden="true" /></button>
              )}
            </li>
          ))}
        </ul>
      ) : <p className="p-2 text-13 text-mute">No quick reports yet. Tap “Add to quick reports” under any answer.</p>}
      {editing && <LinkBtn onClick={resetQr} className="p-2">Restore defaults</LinkBtn>}
    </aside>
  )
}

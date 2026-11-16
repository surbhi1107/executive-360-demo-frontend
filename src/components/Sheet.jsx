import { useEffect, useRef } from 'react'
import { ChevronLeft, X } from 'lucide-react'
import { KINDS } from '../lib/kinds'
import { useData } from '../context/DataContext'
import { useSheet } from '../context/SheetContext'
import { SourcePreview } from './SourcePreview'
import { Btn, KV, KindTag, cx } from './ui'

const H2 = 'text-22 font-semibold tracking-[-0.01em] [text-wrap:balance]'

function CiteSheet({ c }) {
  const { S } = c, K = KINDS[S.k]
  return (
    <>
      <div className="flex items-center gap-3">
        <KindTag k={S.k} lg />
        <div><div className="text-12 font-medium text-mute">{K[1]}</div><h2 id="sheetTitle" className="text-18 font-semibold tracking-[-0.01em] [text-wrap:balance]">{S.name}</h2></div>
      </div>
      <KV k="Where in the source"><span>{c.loc}</span></KV>
      {c.used && <KV k="Used for"><span>{c.used}</span></KV>}
      <SourcePreview pv={c.pv} />
      <KV k="Freshness"><span>{S.when}</span></KV>
      {S.url && <Btn onClick={() => window.open(S.url, '_blank')}>Download {K[1]} file</Btn>}
    </>
  )
}

function AllSourcesSheet() {
  const { sources } = useData()
  const groups = {}
  Object.values(sources).forEach((S) => (groups[S.group] ||= []).push(S))
  const total = Object.keys(sources).length
  return (
    <>
      <h2 id="sheetTitle" className={H2}>Sources</h2>
      <p className="-mt-3 text-mute">Every number on the dashboard and in every answer comes from one of these {total} files.</p>
      {Object.entries(groups).map(([g, list]) => (
        <div key={g} className="flex flex-col">
          <h3 className="mb-1 text-12 font-semibold text-mute">{g}</h3>
          {list.map((S, i) => (
            <div key={i} className={cx('grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3', i > 0 && 'border-t border-sep')}>
              <KindTag k={S.k} lg />
              <div className="min-w-0">
                <div className="text-14 font-semibold [overflow-wrap:anywhere]">{S.name}</div>
                <div className="text-12 text-mute">{KINDS[S.k][1]} · {S.when}</div>
              </div>
              {S.url && <a className="text-13 text-accent hover:underline" href={S.url}>Download</a>}
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

export function Sheet() {
  const { stack, isOpen, back, close } = useSheet()
  const ref = useRef(null)
  const closeBtn = useRef(null)
  const lastTop = useRef(null)
  const top = stack[stack.length - 1] || lastTop.current
  if (stack.length) lastTop.current = stack[stack.length - 1]

  useEffect(() => { if (ref.current) ref.current.scrollTop = 0 }, [stack])
  useEffect(() => {
    if (!isOpen) return undefined
    const t = setTimeout(() => closeBtn.current && closeBtn.current.focus(), 50)
    return () => clearTimeout(t)
  }, [isOpen])
  useEffect(() => {
    if (!isOpen) return undefined
    const onKey = (e) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  return (
    <>
      <div onClick={close} aria-hidden="true"
        className={cx('fixed inset-0 z-20 bg-scrim transition-opacity duration-[250ms] ease-out', isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0')} />
      <aside ref={ref} role="dialog" aria-modal="true" aria-labelledby="sheetTitle"
        className={cx(
          'fixed bottom-0 right-0 top-0 z-[21] box-border flex w-[min(440px,100%)] flex-col gap-6 overflow-y-auto bg-surface pb-[calc(2rem+env(safe-area-inset-bottom,0px))] pl-8 pr-[max(2rem,env(safe-area-inset-right,0px))] pt-[calc(2rem+env(safe-area-inset-top,0px))] shadow-raised transition-transform duration-[350ms] ease-[cubic-bezier(.2,.8,.2,1)]',
          isOpen ? 'visible translate-x-0' : 'invisible translate-x-full')}>
        <div className="flex items-center justify-between">
          {stack.length > 1
            ? <button type="button" onClick={back} className="inline-flex cursor-pointer items-center gap-0.5 border-0 bg-transparent p-0 font-medium text-accent"><ChevronLeft size={18} aria-hidden="true" />Back</button>
            : <span />}
          <button ref={closeBtn} type="button" onClick={close} aria-label="Close"
            className="grid size-8 cursor-pointer place-items-center rounded-full border-0 bg-fill"><X size={18} aria-hidden="true" /></button>
        </div>
        <div className="flex flex-col gap-6">
          {top?.type === 'cite' && <CiteSheet key={stack.length + top.c.loc} c={top.c} />}
          {top?.type === 'sources' && <AllSourcesSheet />}
        </div>
      </aside>
    </>
  )
}

import { KINDS } from '../lib/kinds'
import { useSheet } from '../context/SheetContext'
import { KindTag } from './ui'

/** Row of tappable source chips; each opens the source preview in the sheet. */
export function SourceChips({ cites, label = 'Sources' }) {
  const { openCite } = useSheet()
  const seen = new Set() // the first chip from a file shows its name; later ones show the place in it
  return (
    <div className="flex flex-wrap items-center gap-2 text-12 text-mute">
      {label && <span className="mr-1 text-12 font-medium text-mute">{label}</span>}
      {cites.map((c, i) => {
        const again = seen.has(c.S.name); seen.add(c.S.name)
        return (
        <button key={i} type="button" onClick={() => openCite(c)} aria-label={`${KINDS[c.S.k][1]}: ${c.S.name}, ${c.loc}`}
          className="inline-flex max-w-full cursor-pointer items-center gap-1.5 rounded-sm border-0 bg-fill py-1 pl-1 pr-2.5 text-left text-12 font-medium text-ink hover:brightness-[.96]">
          <KindTag k={c.S.k} />
          <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{again ? c.loc : c.S.name}</span>
        </button>
        )
      })}
    </div>
  )
}

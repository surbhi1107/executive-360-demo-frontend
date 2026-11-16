import { useMemo } from 'react'
import { useAsk } from '../context/AskContext'
import { useData } from '../context/DataContext'
import { useNav } from '../context/NavContext'
import { useSheet } from '../context/SheetContext'
import { D, fmtD } from '../lib/format'
import { DEPT_ORDER, HOME_ASKS } from '../lib/kinds'
import { Rich } from '../lib/rich'
import { whenShort } from '../lib/format'
import { AskForm } from '../components/AskForm'
import { Spark, Rings, MiniBars } from '../components/charts/Charts'
import { ICONS } from '../components/Nav'
import { SourceChips } from '../components/SourceChips'
import { Btn, Card, Chip, LinkBtn, SecHead, Status, StatusDot, Tag, Title1, Title2, Typing } from '../components/ui'

function LoadState() {
  const { loadErr, reload } = useData()
  return (
    <Card>
      {loadErr ? (
        <div className="flex flex-col gap-3">
          <Status s="risk">Could not load data</Status>
          <p>{loadErr}</p>
          <Btn small onClick={reload}>Try again</Btn>
        </div>
      ) : <p className="text-mute">Loading…</p>}
    </Card>
  )
}

function Tile({ d }) {
  const { go } = useNav()
  const { openFlags } = useData()
  const t = d.tile
  const open = openFlags.filter((f) => f.dept === d.id).length
  const Icon = ICONS[d.id]
  return (
    <Card as="button" type="button" onClick={() => go(d.id)} aria-label={`${d.name}: ${d.status_word}. ${d.headline}`}
      className="flex cursor-pointer flex-col gap-3 border-0 text-left transition duration-200 ease-out hover:-translate-y-px hover:shadow-raised">
      <span className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 text-17 font-semibold"><Icon size={18} strokeWidth={1.6} className="text-mute" aria-hidden="true" />{d.name}</span>
        <Status s={d.status}>{d.status_word}</Status>
      </span>
      <span className="block min-h-[60px] text-14 leading-5 max-[760px]:min-h-0 [text-wrap:pretty]">{d.headline}</span>
      <span className="flex h-[76px] flex-col justify-end gap-1">
        {t.kind === 'line' ? <Spark vals={t.values} /> : t.kind === 'rings' ? <Rings list={t.rings} /> : t.kind === 'bars' ? <MiniBars t={t} />
          : <span className="flex h-full flex-col justify-center gap-2">{t.pills.map((p) => <Status key={p.t} s={p.s} className="block overflow-hidden text-ellipsis whitespace-nowrap text-13 leading-[18px]">{p.t}</Status>)}</span>}
        {t.caption && <span className="text-11 text-mute">{t.caption}</span>}
      </span>
      <span className="grid grid-cols-2 gap-3 border-t border-sep pt-3">
        {t.nums.map(([l, v]) => <span key={l}><span className="block text-12 text-mute">{l}</span><b className="block text-20 font-semibold tracking-[-0.01em] tabular-nums">{v}</b></span>)}
      </span>
      <span className="mt-auto flex flex-wrap justify-between gap-2 text-12 text-mute">
        <span>{open ? `${open} open flag${open > 1 ? 's' : ''}` : 'No open flags'}</span>
        <span className="font-medium text-accent">Open · ask the {d.agent} ›</span>
      </span>
    </Card>
  )
}

function Brief() {
  const { brief, loadBrief, deptById, openFlag, citeFrom } = useData()
  const { busy, data: B } = brief
  if (!B && !busy) return null
  if (!B) return (
    <Card className="flex flex-col gap-3" aria-live="polite">
      <div className="flex items-center gap-2 text-12 font-medium text-mute"><Tag>Today’s brief</Tag><span>Executive 360° is writing your brief…</span></div>
      <Typing label="Writing" />
    </Card>
  )
  const b = B.brief, ch = B.changes
  const cites = (b.sources || []).map(citeFrom)
  return (
    <Card className="flex flex-col gap-3" aria-live="polite">
      <div className="flex flex-wrap items-center gap-2 text-12 font-medium text-mute">
        <Tag>Today’s brief</Tag>
        <span>{b.ai ? 'Written by Executive 360° from today’s data' : 'Standard summary. The AI brief is unavailable' + (B.note ? ': ' + B.note : '')}</span>
        <LinkBtn disabled={busy} onClick={() => loadBrief(true)}>{busy ? 'Rewriting…' : 'Rewrite'}</LinkBtn>
      </div>
      <h2 className="max-w-[40ch] text-24 font-semibold tracking-[-0.012em] [text-wrap:balance]"><Rich text={b.headline} /></h2>
      {b.summary && <p className="max-w-[80ch]"><Rich text={b.summary} /></p>}
      <ol className="m-0 grid list-none grid-cols-3 gap-3 p-0 max-[1000px]:grid-cols-1">
        {b.items.map((it, i) => {
          const d = deptById(it.dept)
          return (
            <li key={it.flag_id + i} className="flex flex-col gap-2 rounded-md bg-bg p-4 text-14 leading-5">
              <Status s={it.sev}>{d ? d.name : ''}</Status>
              <span className="text-15 font-semibold leading-5">{i + 1}. <Rich text={it.title} /></span>
              <span><Rich text={it.why} /></span>
              <span><b className="block text-12 font-semibold text-mute">Suggested</b><Rich text={it.suggestion} /></span>
              <LinkBtn className="mt-auto self-start text-14 font-medium" onClick={() => openFlag(it.flag_id)}>Review and act ›</LinkBtn>
            </li>
          )
        })}
      </ol>
      {b.links && <p className="max-w-[80ch]"><b>Connected:</b> <Rich text={b.links} /></p>}
      {ch.items.length > 0 && (
        <div className="text-13 text-mute">
          <b>What changed since {whenShort(ch.since)}</b>
          <ul className="mb-0 mt-1 pl-[18px]">
            {ch.items.slice(0, 6).map((c, i) => <li key={i}>{c.text}</li>)}
            {ch.items.length > 6 && <li>and {ch.items.length - 6} more</li>}
          </ul>
        </div>
      )}
      {cites.length > 0 && <SourceChips cites={cites} />}
    </Card>
  )
}

function Links() {
  const { links, flags, deptById, openFlag } = useData()
  const { ask } = useAsk()
  if (!links || !links.length) return null
  return (
    <div className="flex flex-col gap-3">
      <SecHead title="Connected issues" sub="Flags in different departments that point to the same site, customer or topic" />
      <div className="grid grid-cols-2 gap-4 max-[1000px]:grid-cols-1">
        {links.map((l) => (
          <Card key={l.key} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 text-12 text-mute">
              <Status s={l.sev}>{l.kind_word}: {l.entity}</Status><span>{l.dept_names.join(' + ')}</span>{l.ai && <span>· written by Executive 360°</span>}
            </div>
            <h3 className="text-17 font-semibold [text-wrap:balance]"><Rich text={l.headline} /></h3>
            <p className="text-14 leading-5"><Rich text={l.story} /></p>
            <ul className="m-0 flex list-none flex-col gap-1 p-0 text-13 leading-[18px]">
              {l.flag_ids.map((id) => {
                const f = flags.find((x) => x.id === id), d = f && deptById(f.dept)
                return f ? <li key={id} className="flex items-center gap-2"><StatusDot s={f.sev} /><LinkBtn className="text-left" onClick={() => openFlag(id)}>{d.name}: {f.short}</LinkBtn></li> : null
              })}
            </ul>
            <div className="text-14"><b>One owner:</b> {l.owner}</div>
            <p className="text-14 leading-5"><b>Suggested:</b> <Rich text={l.action} /></p>
            <div className="mt-auto pt-2 text-14">
              <LinkBtn onClick={() => ask(`How are the issues around ${l.entity} connected across departments, and what should I do first?`)}>Ask about this ›</LinkBtn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function Home() {
  const { data, depts, openFlags, deptById, openFlag, reload, sources } = useData()
  const { openAllSources } = useSheet()
  const { ask } = useAsk()
  const { go } = useNav()
  const now = useMemo(() => new Date(), [])
  const hr = now.getHours()
  const greet = (hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening') + ', Anita.'
  const dateTxt = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  const attention = useMemo(() => { // at most two risk flags per department, six in all
    const per = {}, out = []
    for (const f of openFlags) if (f.sev === 'risk') { per[f.dept] = (per[f.dept] || 0) + 1; if (per[f.dept] <= 2) out.push(f) }
    return out.slice(0, 6)
  }, [openFlags])

  const risk = depts.filter((d) => d.status === 'risk').length, watch = depts.filter((d) => d.status === 'watch').length
  const okN = depts.length - risk - watch
  const sub = [`${depts.length} departments`, risk && `${risk} at risk`, watch && `${watch} to watch`, okN && `${okN} on track`].filter(Boolean).join(' · ')
  const watching = DEPT_ORDER.map(([id]) => deptById(id)).filter(Boolean).map((d) => ({ d, w: openFlags.filter((f) => f.dept === d.id && f.sev === 'watch') })).filter((x) => x.w.length)

  return (
    <section className="mx-auto flex max-w-[1400px] flex-col gap-8 max-[760px]:gap-6">
      <div>
        <Title1>{greet}</Title1>
        <p className="mt-1 text-13 text-mute">
          {dateTxt}{data && <> · Data as of {fmtD(D(data.as_of))} · <LinkBtn className="text-13" onClick={openAllSources}>{Object.keys(sources).length} sources</LinkBtn> · <LinkBtn className="text-13" onClick={reload}>Reload</LinkBtn></>}
        </p>
      </div>
      <div>
        <AskForm placeholder="Ask anything. I will pass it to the right department agent." />
        <div className="mt-3 flex flex-wrap gap-2">{HOME_ASKS.map((s) => <Chip key={s} onClick={() => ask(s)}>{s}</Chip>)}</div>
      </div>
      {!data ? <LoadState /> : (
        <>
          <Brief />
          <Links />
          <div className="flex flex-col gap-3">
            <SecHead title="Command Dashboard" sub={sub} />
            <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
              {DEPT_ORDER.map(([id]) => deptById(id)).filter(Boolean).map((d) => <Tile key={d.id} d={d} />)}
            </div>
          </div>
          <Card>
            <SecHead title="Needs your attention" sub="The most serious open flags across all departments" />
            <ul className="m-0 mt-2 list-none p-0">
              {attention.length ? attention.map((f) => (
                <li key={f.id} role="button" tabIndex={0} onClick={() => openFlag(f.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFlag(f.id) } }}
                  className="row-sep group -mx-3 grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-0.5 rounded-sm p-3 hover:bg-fill max-[760px]:grid-cols-1">
                  <span className="font-semibold leading-5">{f.title}</span>
                  <span className="col-start-1 text-13 text-mute group-hover:text-ink">{f.impacts.join(' · ')}</span>
                  <span className="row-span-2 col-start-2 self-center text-right max-[760px]:col-start-1 max-[760px]:row-auto max-[760px]:mt-1 max-[760px]:text-left">
                    <Status s={f.sev}>{deptById(f.dept).name}</Status>
                    <span className="mt-0.5 block text-12 text-mute group-hover:text-ink max-[760px]:hidden">{f.call.who.split(' · ')[0]}</span>
                  </span>
                </li>
              )) : <li className="py-3 text-mute">Nothing needs your attention right now.</li>}
            </ul>
          </Card>
          {watching.length > 0 && (
            <div>
              <Title2 className="mb-3">Also watching</Title2>
              <div className="flex flex-col gap-2">
                {watching.map(({ d, w }) => (
                  <div key={d.id} className="flex flex-wrap items-baseline gap-3 text-13 leading-[18px]">
                    <b className="min-w-24 flex-none font-semibold"><LinkBtn className="font-semibold text-ink" onClick={() => go(d.id)}>{d.name}</LinkBtn></b>
                    <span className="text-mute">{w.length} to watch · {w.slice(0, 3).map((f) => f.short).join(' · ')}{w.length > 3 ? ' · …' : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

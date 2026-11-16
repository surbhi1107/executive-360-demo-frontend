import { useState } from 'react'
import { useData } from '../context/DataContext'
import { api } from '../lib/api'
import { whenShort } from '../lib/format'
import { Btn, BtnOutline, Card, LinkBtn, PageHead, Status, TextArea, Title2, cx } from '../components/ui'

const DOT = { needs_ceo: 'risk', waiting: 'watch', replied: 'ok', acted: 'ok', resolved: 'ok', withdrawn: 'watch' }
const EV_DOT = { reply: 'bg-positive', ceo: 'bg-critical', suggest: 'bg-critical' }

function CaseCard({ c, busy, post }) {
  const { deptById, flags, openFlag } = useData()
  const [reply, setReply] = useState(null) // null = closed, string = the text being typed
  const d = deptById(c.dept)
  const flag = flags.find((f) => f.id === c.flag_id)
  const dd = 'm-0'
  return (
    <Card className="flex flex-col gap-3" data-case={c.id}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Status s={DOT[c.status]}>{c.status_word}</Status>
        <span className="text-12 text-mute">{d ? d.name : c.dept} · {c.owner}{c.owner_role ? ` (${c.owner_role})` : ''}{c.auto ? ' · automatic follow-up on' : ''}</span>
      </div>
      <h3 className="text-16 font-semibold leading-[22px]">{flag ? <LinkBtn className="text-left text-ink hover:no-underline" onClick={() => openFlag(c.flag_id)}>{c.title}</LinkBtn> : c.title}</h3>
      <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-14 leading-5">
        <dt className="text-13 text-mute">Contacts</dt><dd className={dd}>{c.contacts}{c.last_contact_at ? ' · last on ' + whenShort(c.last_contact_at) : ''}</dd>
        <dt className="text-13 text-mute">Reply</dt><dd className={dd}>{c.reply ? <>{c.reply.summary} <span className="text-mute">({whenShort(c.reply.at)})</span></> : <span className="text-mute">None yet</span>}</dd>
        <dt className="text-13 text-mute">Acted on it?</dt><dd className={dd}>{c.data.state === 'changed' || c.data.state === 'cleared' ? <span className="font-semibold text-positive">{c.data.text}</span> : c.data.text}</dd>
        {c.next && <><dt className="text-13 text-mute">Next step</dt><dd className={dd}>{c.next}</dd></>}
      </dl>
      {c.open && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <BtnOutline disabled={busy} onClick={() => post(`/api/cases/${c.id}/action`, { action: 'remind' })}>Send reminder</BtnOutline>
            {c.manager && <BtnOutline disabled={busy} onClick={() => post(`/api/cases/${c.id}/action`, { action: 'escalate' })}>Escalate to {c.manager}</BtnOutline>}
            {c.auto_allowed && <BtnOutline disabled={busy} onClick={() => post(`/api/cases/${c.id}/action`, { action: c.auto ? 'auto_off' : 'auto_on' })}>{c.auto ? 'Turn automatic follow-up off' : 'Follow up automatically'}</BtnOutline>}
            <BtnOutline onClick={() => setReply(reply === null ? '' : null)}>Record a reply</BtnOutline>
            <LinkBtn className="text-13" onClick={() => post(`/api/cases/${c.id}/action`, { action: 'close' })}>Close case</LinkBtn>
          </div>
          {reply !== null && (
            <div className="flex flex-col gap-2">
              <TextArea aria-label={`Reply from ${c.owner}`} className="min-h-20" autoFocus value={reply} onChange={(e) => setReply(e.target.value)}
                placeholder={`Paste or type what ${c.owner} said, for example after a phone call. The AI will summarise it.`} />
              <div className="flex gap-2">
                <Btn small disabled={busy || !reply.trim()} onClick={async () => { await post(`/api/cases/${c.id}/reply`, { text: reply.trim() }); setReply(null) }}>Save reply</Btn>
                <BtnOutline onClick={() => setReply(null)}>Cancel</BtnOutline>
              </div>
            </div>
          )}
        </>
      )}
      <details open={c.needs_ceo}>
        <summary className="cursor-pointer text-13 font-medium text-accent">Timeline ({c.events.length})</summary>
        <ol className="m-0 mt-2 flex list-none flex-col gap-3 border-l-2 border-sep py-0 pl-4">
          {c.events.map((e, i) => (
            <li key={i} className="relative text-13 leading-[18px]">
              <span className={cx('absolute -left-[21px] top-[5px] size-2 rounded-full', e.actor === 'Executive 360°' ? 'bg-accent' : EV_DOT[e.kind] || 'bg-mute')} />
              <span className="block text-12 leading-4 text-mute">{whenShort(e.at)} · {e.actor}</span>{e.text}
            </li>
          ))}
        </ol>
      </details>
    </Card>
  )
}

export function Followups() {
  const { cs, setCases, data, loadErr, reload } = useData()
  const { cases, mail, ladder, clock } = cs
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(null)

  const post = async (path, body) => {
    setBusy(true)
    try { const p = await api(path, body); if (p.done) setDone(p.done); setCases(p) } catch (e) { setDone([e.message]) }
    setBusy(false)
  }
  const need = cases.filter((c) => c.needs_ceo), prog = cases.filter((c) => c.open && !c.needs_ceo), closed = cases.filter((c) => !c.open)
  const sec = (title, list) => list.length > 0 && (
    <div className="flex flex-col gap-3"><Title2>{title} <span className="font-normal text-mute">{list.length}</span></Title2>{list.map((c) => <CaseCard key={c.id} c={c} busy={busy} post={post} />)}</div>
  )
  return (
    <section className="mx-auto flex max-w-[1080px] flex-col gap-8 max-[760px]:gap-6">
      <PageHead title="Follow-ups" sub="Every issue you acted on: who was contacted and why, what they replied, whether the data moved, and what happens next." />
      {!data ? (
        <Card>{loadErr ? <div className="flex flex-col gap-3"><Status s="risk">Could not load data</Status><p>{loadErr}</p><Btn small onClick={reload}>Try again</Btn></div> : <p className="text-mute">Loading…</p>}</Card>
      ) : (
        <>
          <Card className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2 text-12 text-mute"><Status s={mail.ready ? 'ok' : 'watch'}>{mail.ready ? (mail.mode === 'live' ? 'Email live' : 'Email in test mode') : 'Email off'}</Status><span>{mail.note}</span></div>
            <div className="text-13 text-mute">Ladder: remind after {ladder.remind_days} days · escalate after {ladder.escalate_days} · back to you after {ladder.ceo_days}. Change it in Settings.</div>
            <div className="flex flex-wrap items-center gap-2">
              <Btn small disabled={busy} onClick={() => post('/api/followups/run', {})}>{busy ? 'Checking…' : 'Check replies and run follow-ups'}</Btn>
              <BtnOutline disabled={busy} onClick={() => post('/api/followups/run', { advance_days: 1 })}>Demo: move 1 day forward</BtnOutline>
              {clock.offset_days > 0 && <LinkBtn className="text-13" onClick={() => post('/api/followups/run', { reset_clock: true })}>Reset clock</LinkBtn>}
              <span className="text-13 text-mute">Log date: {whenShort(clock.now)}{clock.offset_days ? ` (demo clock +${clock.offset_days} days)` : ''}</span>
            </div>
            {done && <div className="text-12 text-mute">{done.length ? 'Just done: ' + done.join(' · ') : 'Checked: nothing was due.'}</div>}
          </Card>
          {cases.length ? <>{sec('Needs you', need)}{sec('In progress', prog)}{sec('Closed', closed)}</>
            : <Card><p className="text-mute">No follow-ups yet. Open a flag, choose Call, Email or Do it automatically, and it will appear here.</p></Card>}
        </>
      )}
    </section>
  )
}

import { useState } from 'react'
import { Check, Mail, Phone, Zap } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAsk } from '../context/AskContext'
import { useNav } from '../context/NavContext'
import { SourceChips } from './SourceChips'
import { Btn, BtnOutline, Card, Field, LinkBtn, Status, TextArea, Typing, cx } from './ui'

const ACT_ICON = { call: Phone, email: Mail, auto: Zap, approval: Check }
const ACT_LABEL = { call: 'Call', email: 'Email', auto: 'Do it automatically', approval: 'Ask for my approval' }
const MODES = ['call', 'email', 'auto', 'approval']

const H3 = 'm-0 font-semibold tracking-[-0.005em] [text-wrap:balance]'
const Draft = ({ children }) => <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-13">{children}</dl>
const Dt = (p) => <dt className="m-0 font-medium text-mute" {...p} />
const Dd = (p) => <dd className="m-0" {...p} />
const Note = ({ className, ...p }) => <p className={cx('text-12 text-mute', className)} {...p} />
const ImpactChips = ({ list }) => <div className="flex flex-wrap gap-2">{list.map((i) => <span key={i} className="rounded-sm bg-fill px-2.5 py-1 text-13 font-semibold tabular-nums">{i}</span>)}</div>

function DefaultCheck({ f, mode }) {
  const { fdef, flagApi } = useData()
  return (
    <label className="inline-flex cursor-pointer items-center gap-1.5 text-13">
      <input type="checkbox" checked={fdef[f.type] === mode} onChange={(e) => flagApi.setDefault(f, e.target.checked)} />
      Always use “{ACT_LABEL[mode]}” for “{f.label.toLowerCase()}” flags
    </label>
  )
}

function Panel({ f, mode, st, slot }) {
  const { flagApi } = useData()
  const adv = st.advice
  const mail = adv ? adv.email : f.email
  const [subject, setSubject] = useState(mail.subject)
  const [body, setBody] = useState(mail.body)
  const err = st.err ? <Note className="text-critical">{st.err}</Note> : null
  const go = (label, onClick) => <Btn small onClick={onClick} disabled={!!st.pending}>{st.pending ? 'Saving…' : label}</Btn>
  const cancel = (label) => <BtnOutline onClick={() => flagApi.cancel(f)}>{label}</BtnOutline>
  const row = (primary, secondary) => <div className="flex flex-wrap items-center gap-2">{primary}{secondary}</div>

  if (mode === 'call') return (
    <>
      <Draft><Dt>With</Dt><Dd>{f.call.who}</Dd><Dt>When</Dt><Dd>{slot || f.call.slot} · 15 min</Dd><Dt>Agenda</Dt><Dd>{adv ? adv.agenda : f.call.agenda}</Dd></Draft>
      {err}{row(go('Book call', () => flagApi.run(f, 'call')), cancel('Cancel'))}<DefaultCheck f={f} mode={mode} />
    </>
  )
  if (mode === 'email') return (
    <>
      <Draft>
        <Dt>To</Dt><Dd>{f.email.to}{f.email.external && <> <Status s="watch">Outside the company</Status></>}</Dd>
        <Dt><label htmlFor={`subj-${f.id}`}>Subject</label></Dt><Dd><Field id={`subj-${f.id}`} className="w-full" value={subject} onChange={(e) => setSubject(e.target.value)} /></Dd>
        <Dt><label htmlFor={`body-${f.id}`}>Message</label></Dt><Dd><TextArea id={`body-${f.id}`} className="min-h-[150px] resize-y" value={body} onChange={(e) => setBody(e.target.value)} /></Dd>
      </Draft>
      {adv && <Note>Drafted by the {adv.agent}. Edit anything before sending.</Note>}
      {err}{row(go('Send email', () => flagApi.run(f, 'send', { subject, body })), cancel('Discard'))}<DefaultCheck f={f} mode={mode} />
    </>
  )
  if (mode === 'auto') return f.auto.allowed ? (
    <>
      <p>{f.auto.text}</p>
      {err}{row(go('Turn on', () => flagApi.run(f, 'auto')), cancel('Cancel'))}<DefaultCheck f={f} mode={mode} />
    </>
  ) : <Note>{f.auto.reason}</Note>
  if (mode === 'approval') return (
    <>
      <p><b>I will prepare:</b> {f.approval}</p>
      <Note>Nothing happens until you approve.</Note>
      {err}{row(go('Approve', () => flagApi.run(f, 'approve')), cancel('Not now'))}<DefaultCheck f={f} mode={mode} />
    </>
  )
  return null
}

function CaseLine({ f }) {
  const { caseOf } = useData()
  const { go } = useNav()
  const c = caseOf(f.id)
  if (!c) return null
  const dot = { needs_ceo: 'risk', waiting: 'watch', replied: 'ok', acted: 'ok', resolved: 'ok', withdrawn: 'watch' }[c.status] || 'watch'
  return (
    <div className="flex flex-wrap items-center gap-2 text-12 text-mute">
      <Status s={dot}>{c.status_word}</Status>
      <span>{c.contacts} contact{c.contacts === 1 ? '' : 's'} · {c.data.text}{c.next ? ' · Next: ' + c.next : ''}</span>
      <LinkBtn onClick={() => { go('followups'); setTimeout(() => document.querySelector(`[data-case="${c.id}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 80) }}>View follow-up ›</LinkBtn>
    </div>
  )
}

/** One flag: compact -> open (choose how to act) -> handled. State lives in DataContext so it survives navigation. */
export function Flag({ f, showWhere = true }) {
  const { fstate, fdef, deptById, flagApi, data } = useData()
  const { openProject } = useNav()
  const { ask } = useAsk()
  const st = fstate[f.id] || { mode: null, done: null }
  const where = showWhere && (f.proj
    ? <LinkBtn className="text-12 leading-4 text-mute" onClick={() => openProject(f.proj)}>{f.where}</LinkBtn>
    : <span className="text-12 text-mute">{f.where}</span>)
  const top = <Status s={f.sev} weight="font-semibold">{f.label}</Status>
  const dept = deptById(f.dept)

  if (st.done) return (
    <Card className="flex flex-col gap-2" data-flag={f.id}>
      <div className="flex flex-wrap items-center justify-between gap-3">{top}{where}</div>
      <h3 className={cx(H3, 'text-15 leading-5')}>{f.title}</h3>
      <div className="flex items-center gap-2 text-14 leading-5"><Status s="ok">Handled</Status><span>{st.done}</span></div>
      <CaseLine f={f} />
      <p className="text-12 text-mute"><LinkBtn className="text-12" disabled={!!st.pending} onClick={() => flagApi.run(f, 'undo')}>{st.pending ? 'Saving…' : 'Undo'}</LinkBtn></p>
    </Card>
  )

  if (!st.open && !st.mode) return (
    <Card className="flex flex-col gap-2 py-4" data-flag={f.id}>
      <div className="flex flex-wrap items-center justify-between gap-3">{top}{where}</div>
      <h3 className={cx(H3, 'text-15 leading-5')}>{f.title}</h3>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ImpactChips list={f.impacts} />
        <LinkBtn aria-expanded="false" className="text-14 font-medium" onClick={() => flagApi.open(f)}>Review and act ›</LinkBtn>
      </div>
    </Card>
  )

  const adv = st.advice
  return (
    <Card className="flex flex-col gap-3" data-flag={f.id}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {top}
        <span className="flex items-center gap-3">{where}<LinkBtn className="text-13" onClick={() => flagApi.close(f)}>Close</LinkBtn></span>
      </div>
      <h3 className={cx(H3, 'text-17')}>{f.title}</h3>
      <p className="max-w-[72ch]">{adv ? adv.explanation || f.body : f.body}</p>
      <ImpactChips list={f.impacts} />
      <div className="flex flex-col gap-2 text-13 text-mute">
        {f.evidence && <span>{f.evidence}</span>}
        <SourceChips cites={adv && adv.cites.length ? adv.cites : f.cites} />
      </div>
      <div className="rounded-md bg-bg px-4 py-3">
        <b className="mb-1 block text-12 font-semibold text-mute">{adv ? `Suggested by the ${adv.agent}` : 'Suggested'}</b>
        <ul className="m-0 list-disc pl-[18px] text-14 leading-5">{(adv ? adv.suggestions : f.suggest).map((s, i) => <li key={i} className={i ? 'mt-1' : ''}>{s}</li>)}</ul>
        {st.adviceState === 'loading' && <div className="mt-2 flex items-center gap-2 text-12 text-mute"><Typing className="py-0" />The {dept?.agent || 'agent'} is writing advice for this exact situation…</div>}
        {st.adviceState === 'err' && <div className="mt-2 text-12 text-mute">Standard suggestions shown; the agent could not be reached.</div>}
      </div>
      <CaseLine f={f} />
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-12 font-medium text-mute">How should I act?</span>
        {MODES.map((m) => {
          const Icon = ACT_ICON[m], disabled = m === 'auto' && !f.auto.allowed, on = st.mode === m
          return (
            <button key={m} type="button" aria-pressed={on} aria-disabled={disabled || undefined} onClick={() => flagApi.toggleMode(f, m, disabled)}
              className={cx('inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-13 font-medium',
                on ? 'border-accent bg-accent text-on-accent' : 'border-ctl bg-surface text-ink hover:bg-fill',
                disabled && 'cursor-not-allowed opacity-[.45]')}>
              <Icon size={14} strokeWidth={1.8} aria-hidden="true" />{ACT_LABEL[m]}
              {fdef[f.type] === m && <span className={cx('rounded-[4px] px-1 text-11 font-semibold leading-[14px]', on ? 'bg-on-accent text-accent' : 'bg-accent-soft text-accent')}>Default</span>}
            </button>
          )
        })}
        <LinkBtn className="ml-2 text-13" onClick={() => ask(f.ask, { agent: f.dept })}>Ask the agent about this</LinkBtn>
      </div>
      {st.mode && <div className="flex flex-col gap-3 border-t border-sep pt-3"><Panel key={st.mode + (adv ? 'a' : '')} f={f} mode={st.mode} st={st} slot={data.call_slot} /></div>}
    </Card>
  )
}

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { useSheet } from '../context/SheetContext'
import { useTheme } from '../context/ThemeContext'
import { api } from '../lib/api'
import { Btn, BtnOutline, Card, Field, LinkBtn, PageHead, Segmented, Status, Subhead } from '../components/ui'

const Row = ({ children }) => <div className="flex flex-wrap items-center justify-between gap-4 py-3 [&+&]:border-t [&+&]:border-sep">{children}</div>

function LadderForm() {
  const { cs, setCases } = useData()
  const [v, setV] = useState({ remind_days: '', escalate_days: '', ceo_days: '' })
  const [msg, setMsg] = useState('')
  useEffect(() => { if (cs.ladder.remind_days != null) setV({ remind_days: cs.ladder.remind_days, escalate_days: cs.ladder.escalate_days, ceo_days: cs.ladder.ceo_days }) }, [cs.ladder])
  const save = async (e) => {
    e.preventDefault()
    try { const l = await api('/api/settings/ladder', { remind_days: +v.remind_days, escalate_days: +v.escalate_days, ceo_days: +v.ceo_days }); setCases({ ladder: l }); setMsg('Saved.') } catch (err) { setMsg(err.message) }
  }
  const input = (k, label, after = 'days') => (
    <label className="flex items-center gap-1.5">{label}<Field type="number" min="1" max="60" className="w-14 px-1.5 py-1" value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} />{after}</label>
  )
  return (
    <form onSubmit={save} className="flex flex-wrap items-center gap-3 text-13">
      {input('remind_days', 'Remind after')}{input('escalate_days', 'Escalate after')}{input('ceo_days', 'Back to me after')}
      <Btn small type="submit">Save</Btn><span className="text-mute" aria-live="polite">{msg}</span>
    </form>
  )
}

export function Settings() {
  const { theme, setTheme } = useTheme()
  const { openAllSources } = useSheet()
  const { logout } = useAuth()
  const { data, cs } = useData()
  const mail = cs.mail
  return (
    <section className="mx-auto flex max-w-[1080px] flex-col gap-8 max-[760px]:gap-6">
      <PageHead title="Settings" />
      <Card>
        <Row>
          <div><b>Appearance</b><Subhead>Light is recommended for daytime use.</Subhead></div>
          <Segmented label="Appearance" value={theme} onChange={setTheme} options={[['light', 'Light'], ['dark', 'Dark'], ['system', 'Automatic']]} />
        </Row>
        <Row>
          <div><b>AI agents</b><Subhead>One agent for each department, plus one for the whole company.</Subhead></div>
          {!data ? <span className="text-mute">Checking…</span> : data.assistant ? <Status s="ok">On</Status> : <Status s="watch">Off: add ANTHROPIC_API_KEY to backend/.env</Status>}
        </Row>
        <Row>
          <div><b>Email and calendar invites</b><Subhead>{mail.note || 'Checking…'}</Subhead></div>
          {mail.mode && <Status s={mail.ready ? 'ok' : 'watch'}>{mail.ready ? (mail.mode === 'live' ? `Live · ${mail.address}` : `Test mode · ${mail.address}`) : 'Off'}</Status>}
        </Row>
        <Row>
          <div><b>Follow-up ladder</b><Subhead>With no reply and no change in the data: remind the owner, then escalate to their manager, then bring it back to you.</Subhead></div>
          <LadderForm />
        </Row>
        <Row>
          <div><b>Data sources</b><Subhead>Department workbooks, the project workbook and the project agreements.</Subhead></div>
          <LinkBtn onClick={openAllSources}>View all</LinkBtn>
        </Row>
        <Row>
          <div><b>Account</b><Subhead>Signed in for this browser session.</Subhead></div>
          <BtnOutline onClick={logout}>Sign out</BtnOutline>
        </Row>
      </Card>
    </section>
  )
}

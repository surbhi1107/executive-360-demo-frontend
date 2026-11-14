import { useAuth } from '../context/AuthContext'
import { useSheet } from '../context/SheetContext'
import { useTheme } from '../context/ThemeContext'
import { BtnOutline, Card, LinkBtn, PageHead, Segmented, Subhead } from '../components/ui'

const Row = ({ children }) => <div className="flex flex-wrap items-center justify-between gap-4 py-3 [&+&]:border-t [&+&]:border-sep">{children}</div>

export function Settings() {
  const { theme, setTheme } = useTheme()
  const { openAllSources } = useSheet()
  const { logout } = useAuth()
  return (
    <section className="mx-auto flex max-w-[1080px] flex-col gap-8 max-[760px]:gap-6">
      <PageHead title="Settings" />
      <Card>
        <Row>
          <div><b>Appearance</b><Subhead>Light is recommended for daytime use.</Subhead></div>
          <Segmented label="Appearance" value={theme} onChange={setTheme} options={[['light', 'Light'], ['dark', 'Dark'], ['system', 'Automatic']]} />
        </Row>
        <Row>
          <div><b>Morning brief</b><Subhead>Delivered at 7:30 on weekdays.</Subhead></div>
          <span className="text-mute">On</span>
        </Row>
        <Row>
          <div><b>Connected sources</b><Subhead>HRMS, CRM, Notion, Google Sheets, Excel, Word, PDF, PowerPoint, text, images, video and GIFs</Subhead></div>
          <LinkBtn onClick={openAllSources}>View all 16</LinkBtn>
        </Row>
        <Row>
          <div><b>Account</b><Subhead>Signed in for this browser session.</Subhead></div>
          <BtnOutline onClick={logout}>Sign out</BtnOutline>
        </Row>
      </Card>
    </section>
  )
}

import { AuthProvider, useAuth } from './context/AuthContext'
import { AskProvider } from './context/AskContext'
import { DataProvider } from './context/DataContext'
import { NavProvider, useNav } from './context/NavContext'
import { SheetProvider } from './context/SheetContext'
import { ThemeProvider } from './context/ThemeContext'
import { Sidebar, TabBar } from './components/Nav'
import { Sheet } from './components/Sheet'
import { AskView } from './views/Ask'
import { Dept } from './views/Dept'
import { Followups } from './views/Followups'
import { Home } from './views/Home'
import { isDept } from './lib/kinds'
import { Login } from './views/Login'
import { Settings } from './views/Settings'

const VIEW = { home: Home, ask: AskView, followups: Followups, settings: Settings }

function Shell() {
  const { view } = useNav()
  return (
    <>
      <div className="grid min-h-full grid-cols-[220px_minmax(0,1fr)] max-[760px]:grid-cols-[minmax(0,1fr)]">
        <Sidebar />
        <main className="min-w-0 pb-24 pl-[max(3rem,env(safe-area-inset-left,0px))] pr-[max(3rem,env(safe-area-inset-right,0px))] pt-12 max-[760px]:pb-[120px] max-[760px]:pl-[max(16px,env(safe-area-inset-left,0px))] max-[760px]:pr-[max(16px,env(safe-area-inset-right,0px))] max-[760px]:pt-6">
          {/* every view stays mounted (hidden when inactive) so threads, typing and flag panels survive navigation */}
          {Object.entries(VIEW).map(([id, View]) => <div key={id} hidden={view !== id}><View /></div>)}
          {isDept(view) && <Dept key={view} id={view} />}
        </main>
      </div>
      <TabBar />
      <Sheet />
    </>
  )
}

/** Providers that fetch data mount only after sign-in, so nothing is requested from the API before that. */
function Gate() {
  const { authed } = useAuth()
  if (!authed) return <Login />
  return (
    <NavProvider>
      <DataProvider>
        <SheetProvider>
          <AskProvider>
            <Shell />
          </AskProvider>
        </SheetProvider>
      </DataProvider>
    </NavProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </ThemeProvider>
  )
}

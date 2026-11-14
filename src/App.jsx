import { AskProvider } from './context/AskContext'
import { DataProvider } from './context/DataContext'
import { NavProvider, useNav } from './context/NavContext'
import { SheetProvider } from './context/SheetContext'
import { ThemeProvider } from './context/ThemeContext'
import { Sidebar, TabBar } from './components/Nav'
import { Sheet } from './components/Sheet'
import { AskView } from './views/Ask'
import { Brief } from './views/Brief'
import { Projects } from './views/Projects'
import { Reports } from './views/Reports'
import { Settings } from './views/Settings'

const VIEW = { brief: Brief, ask: AskView, projects: Projects, reports: Reports, settings: Settings }

function Shell() {
  const { view } = useNav()
  return (
    <>
      <div className="grid min-h-full grid-cols-[220px_minmax(0,1fr)] max-[760px]:grid-cols-[minmax(0,1fr)]">
        <Sidebar />
        <main className="min-w-0 pb-24 pl-[max(3rem,env(safe-area-inset-left,0px))] pr-[max(3rem,env(safe-area-inset-right,0px))] pt-12 max-[760px]:pb-[120px] max-[760px]:pl-[max(16px,env(safe-area-inset-left,0px))] max-[760px]:pr-[max(16px,env(safe-area-inset-right,0px))] max-[760px]:pt-6">
          {/* every view stays mounted (hidden when inactive) so threads, typing and flag panels survive navigation */}
          {Object.entries(VIEW).map(([id, View]) => <div key={id} hidden={view !== id}><View /></div>)}
        </main>
      </div>
      <TabBar />
      <Sheet />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <NavProvider>
        <DataProvider>
          <SheetProvider>
            <AskProvider>
              <Shell />
            </AskProvider>
          </SheetProvider>
        </DataProvider>
      </NavProvider>
    </ThemeProvider>
  )
}

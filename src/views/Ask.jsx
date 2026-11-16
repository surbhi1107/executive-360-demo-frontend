import { useAsk } from '../context/AskContext'
import { HOME_ASKS } from '../lib/kinds'
import { AskForm } from '../components/AskForm'
import { Message } from '../components/Answer'
import { QuickReports } from '../components/QuickReports'
import { Chip, PageHead, Title2 } from '../components/ui'

export function AskView() {
  const { threads, ask } = useAsk()
  const thread = threads.all || []
  return (
    <section className="mx-auto flex max-w-[1080px] flex-col gap-8 max-[760px]:gap-6">
      <PageHead title="Ask" sub="Ask anything. The right department agent answers, and every answer shows its sources." />
      <div className="grid grid-cols-[minmax(0,1fr)_280px] items-start gap-8 max-[1000px]:grid-cols-1">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-col gap-6 pb-6">
            {thread.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <Title2>What would you like to know?</Title2>
                <p className="text-mute">Ask in your own words. The question goes to the right department agent, and every answer shows its sources.</p>
                <div className="flex flex-wrap justify-center gap-2">{HOME_ASKS.map((s) => <Chip key={s} onClick={() => ask(s)}>{s}</Chip>)}</div>
              </div>
            ) : thread.map((m) => <Message key={m.id} msg={m} agent="all" />)}
          </div>
          <div className="sticky bottom-6 z-[5] before:absolute before:-inset-x-2 before:-inset-y-6 before:-z-10 before:bg-bg before:content-[''] max-[760px]:bottom-[calc(84px+env(safe-area-inset-bottom,0px))]">
            <AskForm placeholder="Ask a question" />
          </div>
        </div>
        <QuickReports />
      </div>
    </section>
  )
}

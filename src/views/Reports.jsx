import { useAsk } from '../context/AskContext'
import { useData } from '../context/DataContext'
import { modRows } from '../lib/derive'
import { Card, PageHead, Status } from '../components/ui'

export function Reports() {
  const { ask } = useAsk()
  const { data } = useData()
  return (
    <section className="mx-auto flex max-w-[1080px] flex-col gap-8 max-[760px]:gap-6">
      <PageHead title="Reports" sub="Every module, one line each. Open a module or ask about it." />
      <div className="grid grid-cols-3 gap-4 max-[1000px]:grid-cols-2 max-[760px]:grid-cols-1">
        {modRows(data).map((m) => (
          <Card key={m[0]} as="button" type="button" onClick={() => ask(m[5])}
            className="flex cursor-pointer flex-col gap-1 border-0 text-left transition-[transform,box-shadow] duration-200 ease-out hover:shadow-raised">
            <h3 className="flex justify-between gap-2 text-15 font-semibold leading-5"><span>{m[0]}</span><Status s={m[1]}>{m[2]}</Status></h3>
            <div className="mt-3 text-28 font-semibold tracking-[-0.015em] tabular-nums">{m[3]}</div>
            <p className="mt-2 text-13 text-mute">{m[4]}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}

import { Fragment } from 'react'

const ENTITIES = [['&lt;', '<'], ['&gt;', '>'], ['&quot;', '"'], ['&#x27;', "'"], ['&#39;', "'"], ['&amp;', '&']]
/** The server HTML-escapes text (and lets <strong> through). Turn the entities back into characters. */
export const decode = (s) => ENTITIES.reduce((acc, [from, to]) => acc.split(from).join(to), String(s ?? ''))

/** Strip tags and entities: plain text of a snippet (used for the typewriter and the chat history). */
export const plain = (html) => decode(String(html ?? '').replace(/<[^>]+>/g, ''))

/**
 * Renders text containing only <strong>…</strong> and <mark>…</mark> as React nodes.
 * Everything else is treated as text, so no HTML is ever injected into the page.
 */
export function Rich({ text }) {
  const out = []
  let cur = null
  String(text ?? '').split(/(<\/?(?:strong|mark)>)/g).forEach((part, i) => {
    const tag = part.match(/^<(\/?)(strong|mark)>$/)
    if (tag) { cur = tag[1] ? null : tag[2]; return }
    if (!part) return
    const t = decode(part)
    if (cur === 'strong') out.push(<strong key={i} className="font-semibold">{t}</strong>)
    else if (cur === 'mark') out.push(<mark key={i} className="rounded-[3px] bg-accent-soft px-0.5 text-ink shadow-[inset_0_-2px_0_var(--accent)]">{t}</mark>)
    else out.push(<Fragment key={i}>{t}</Fragment>)
  })
  return <>{out}</>
}

/** Tiny fetch wrapper for the Node API. Throws Error(message) with the server's `error` text when there is one. */
export async function api(path, body) {
  const opt = body
    ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    : {}
  const r = await fetch(path, opt)
  let j = null
  try { j = await r.json() } catch { /* not JSON */ }
  if (!r.ok) throw new Error((j && j.error) || `The server replied ${r.status}.`)
  return j
}

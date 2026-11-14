/** Address of the Node API. Empty (the default) means the same address as the page, which is how `npm run dev`
 *  (proxy) and `npm start` (one server) work. Set VITE_API_BASE when the API is hosted elsewhere, e.g. on Vercel. */
export const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(
  /\/$/,
  '',
);
console.log('API_BASE', API_BASE);
/** Tiny fetch wrapper for the Node API. Throws Error(message) with the server's `error` text when there is one. */
export async function api(path, body) {
  const opt = body
    ? {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    : {};
  const r = await fetch(API_BASE + path, opt);
  let j = null;
  try {
    j = await r.json();
  } catch {
    /* not JSON */
  }
  if (!r.ok)
    throw new Error((j && j.error) || `The server replied ${r.status}.`);
  return j;
}

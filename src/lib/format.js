export const DAY = 864e5

/** 'YYYY-MM-DD' -> local Date (no timezone shift) */
export const D = (s) => {
  const [y, m, dd] = s.split('-').map(Number)
  return new Date(y, m - 1, dd)
}

export const fmtD = (d, yr = true) =>
  d.toLocaleDateString('en-GB', yr ? { day: 'numeric', month: 'short', year: 'numeric' } : { day: 'numeric', month: 'short' })

/** Whole weeks from b to a, rounded (matches the server's weeks_between) */
export const wkDiff = (a, b) => Math.round((D(a) - D(b)) / (7 * DAY))

export const crore = (v) =>
  '₹' + (Math.round(v * 100) / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 }) + ' Cr'

export const STATUS_WORD = { risk: 'At risk', watch: 'Watch', ok: 'On track' }

export const STAGE_ORDER = ['survey', 'design', 'approvals', 'procurement', 'civil', 'installation', 'testing', 'handover']
export const STAGE_NAME = {
  survey: 'Survey and feasibility', design: 'Design and engineering', approvals: 'Approvals and permits',
  procurement: 'Procurement and supply', civil: 'Civil and site works', installation: 'Installation',
  testing: 'Testing and commissioning', handover: 'Certification and handover',
}

/** "14 Nov, 10:30" from an ISO date-time such as 2026-11-14T10:30:00 */
export const whenShort = (iso) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso || ''
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Safe localStorage JSON helpers (storage can be blocked) */
export const readStore = (key, fallback) => {
  try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return v ?? fallback } catch { return fallback }
}
export const writeStore = (key, value) => {
  try { localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)) } catch { /* ignore */ }
}

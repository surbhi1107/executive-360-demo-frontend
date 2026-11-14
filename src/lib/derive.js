import { MODS_STATIC, ONTRACK_STATIC } from '../data/sample'
import { STATUS_WORD } from './format'

/** Top live project flags shown first under "Needs your attention" (same rule as before: risk + SLA/missed, max 2) */
export function liveAttention(flags, projById) {
  return flags
    .filter((f) => f.sev === 'risk' && ['sla', 'missed'].includes(f.type))
    .slice(0, 2)
    .map((f) => {
      const p = projById(f.proj)
      return { live: true, proj: f.proj, t: f.title, d: f.impacts.join(' · '), s: f.sev, w: STATUS_WORD[f.sev], o: p.pm, what: f.body, decision: f.suggest[0], q: p.asks[0], cites: f.cites }
    })
}

/** "On track" rows, with the Projects line filled from live data */
export function ontrackRows(data, projects, openFlagCount) {
  const rows = ONTRACK_STATIC.map((r) => [...r])
  if (data) {
    const s = data.summary, ok = projects.filter((p) => p.health === 'ok').length
    rows[1] = ['Projects', `${ok} of ${s.projects} on track; ${openFlagCount} flags on the Projects page`]
  }
  return rows
}

/** Report tiles, with the Projects tile filled from live data */
export function modRows(data) {
  const rows = MODS_STATIC.map((r) => [...r])
  if (data) {
    const s = data.summary, n = s.projects
    rows[4] = ['Projects', s.at_risk ? 'risk' : 'ok', s.at_risk ? 'At risk' : 'On track', `${s.at_risk} of ${n}`,
      s.at_risk ? 'At risk: ' + s.at_risk_names.join(', ') : 'All projects on track', 'Which projects will miss their next milestone?']
  }
  return rows
}

// Source kinds: [badge, label]
export const KINDS = { calc: ['fx', 'Calculated'], excel: ['XLS', 'Excel'], word: ['DOC', 'Word'] }

/** Dashboard order of the six departments: [id, label] */
export const DEPT_ORDER = [['finance', 'Finance'], ['sales', 'Sales'], ['operations', 'Operations'], ['customers', 'Customers'], ['people', 'People'], ['projects', 'Projects']]
export const isDept = (v) => DEPT_ORDER.some(([id]) => id === v)

export const HOME_ASKS = ['What needs my attention today?', 'Why did margin fall last month?', 'Which customers are at risk?', 'Which projects will miss their next milestone?']

/** Saved questions on the Ask page. kpi = index of the department KPI shown as the value. */
export const QR_DEFAULT = [
  { id: 'attn', name: 'What needs my attention', cadence: 'Daily', q: 'What needs my attention today?', dept: null },
  { id: 'fin', name: 'Margin and cash', cadence: 'Daily', q: 'How are margin and cash this month?', dept: 'finance', kpi: 1 },
  { id: 'sales', name: 'Quarter forecast', cadence: 'Daily', q: 'Will we hit the quarter target?', dept: 'sales', kpi: 1 },
  { id: 'ops', name: 'Plant utilisation', cadence: 'Daily', q: 'Which plants are below target?', dept: 'operations', kpi: 0 },
  { id: 'cust', name: 'Renewals coming up', cadence: 'Mondays', q: 'What renewals are coming up and are they safe?', dept: 'customers', kpi: 2 },
  { id: 'ppl', name: 'Attrition watch', cadence: 'Mondays', q: 'Where is attrition highest and why?', dept: 'people', kpi: 1 },
  { id: 'proj', name: 'Project health', cadence: 'Daily', q: 'Which projects will miss their next milestone?', dept: 'projects', kpi: 0 },
  { id: 'pen', name: 'Penalty exposure', cadence: 'Daily', q: 'What is our total penalty exposure?', dept: 'projects', kpi: 3 },
]

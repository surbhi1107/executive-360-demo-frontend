/* Sample data for the modules that are not connected yet (finance, sales, people…). Project data comes from the API. */

export const PERIODS = ['Today', 'QTD', 'YTD', 'TTM']

// [label, value, delta, direction, comparison, sparkline points]
export const KPI = {
  Today: [['Revenue · Today', '₹18.4 Cr', '2.2%', 'up', 'vs same day last week', [4, 5, 4.6, 5.2, 5.8, 5.1, 6.2, 6.6]],
    ['Operating margin', '18.9%', '0.2 pts', 'up', 'vs yesterday', [7, 7.1, 6.9, 7.2, 7.1, 7.3, 7.2, 7.4]],
    ['Cash runway', '26 mo', 'No change', 'flat', 'vs last month', [6, 6.1, 6, 6.2, 6.1, 6, 6.1, 6.1]],
    ['Retention · 30d', '94.2%', '1.3 pts', 'up', 'vs last month', [6, 6.2, 6.6, 6.5, 7, 7.3, 7.4, 7.9]]],
  QTD: [['Revenue · QTD', '₹1,284 Cr', '4.1%', 'up', 'vs plan', [5, 6, 5.5, 7, 7.4, 7.1, 8.2, 8.8, 8.5, 9.6]],
    ['Operating margin', '18.6%', '0.8 pts', 'down', 'vs last quarter', [9, 8.8, 9.1, 8.6, 8.4, 8.7, 8.1, 8, 7.9, 7.7]],
    ['Cash runway', '26 mo', 'No change', 'flat', 'vs last month', [6, 6.1, 6, 6.2, 6.1, 6, 6.1, 6.1, 6, 6.1]],
    ['Retention · 30d', '94.2%', '1.3 pts', 'up', 'vs last month', [6, 6.2, 6.6, 6.5, 7, 7.3, 7.4, 7.9, 8.1, 8.4]]],
  YTD: [['Revenue · YTD', '₹3,912 Cr', '6.3%', 'up', 'vs plan', [3, 3.6, 4.1, 4.4, 5.2, 5.6, 6.1, 6.9, 7.3, 8]],
    ['Operating margin', '19.1%', '0.4 pts', 'up', 'vs last year', [7.2, 7.4, 7.3, 7.6, 7.8, 7.7, 7.9, 8, 7.8, 7.9]],
    ['Cash runway', '26 mo', '2 mo', 'up', 'vs January', [5, 5.2, 5.3, 5.5, 5.6, 5.8, 5.9, 6, 6.1, 6.1]],
    ['Retention · 30d', '93.6%', '0.9 pts', 'up', 'vs last year', [6, 6.1, 6.3, 6.2, 6.5, 6.6, 6.8, 6.9, 7.1, 7.2]]],
  TTM: [['Revenue · TTM', '₹5,140 Cr', '11.8%', 'up', 'vs prior 12 months', [3, 3.4, 3.9, 4.2, 4.8, 5.1, 5.7, 6.2, 6.8, 7.6]],
    ['Operating margin', '18.9%', '0.6 pts', 'up', 'vs prior 12 months', [7, 7.2, 7.1, 7.4, 7.5, 7.6, 7.5, 7.8, 7.7, 7.9]],
    ['Cash runway', '26 mo', '3 mo', 'up', 'vs a year ago', [4.6, 4.8, 5, 5.2, 5.4, 5.6, 5.8, 5.9, 6, 6.1]],
    ['Retention · 30d', '93.1%', '1.6 pts', 'up', 'vs a year ago', [5.5, 5.8, 6, 6.1, 6.4, 6.6, 6.9, 7, 7.2, 7.4]]],
}
export const KPI_Q = ['How is revenue tracking against plan?', 'Why did margin dip?', 'What is our cash position?', 'How is customer retention trending?']

/* ---------- Source kinds and the sample sources ---------- */
// kind -> [badge, label]
export const KINDS = {
  calc: ['fx', 'Calculated'], hrms: ['HR', 'HRMS'], crm: ['CRM', 'CRM'], notion: ['N', 'Notion'], sheet: ['GS', 'Google Sheets'],
  excel: ['XLS', 'Excel'], word: ['DOC', 'Word'], pdf: ['PDF', 'PDF'], text: ['TXT', 'Text file'], ppt: ['PPT', 'PowerPoint'],
  image: ['IMG', 'Image'], video: ['VID', 'Video'], gif: ['GIF', 'GIF'],
}

export const SRC = {
  hrms: { k: 'hrms', name: 'Workday', when: 'Synced 9:40', group: 'Connected systems' },
  crm: { k: 'crm', name: 'Salesforce', when: 'Synced 9:42', group: 'Connected systems' },
  wiki: { k: 'notion', name: 'Leadership wiki', when: 'Synced 9:30', group: 'Connected systems' },
  freight: { k: 'sheet', name: 'Freight cost tracker FY26', when: 'Edited today 9:15', group: 'Documents' },
  mgmt: { k: 'excel', name: 'Q3 management accounts.xlsx', when: 'Edited yesterday 18:20', stale: 'Not updated today', group: 'Documents' },
  sow: { k: 'word', name: 'Migration vendor SOW v3.docx', when: 'Edited 28 Oct', group: 'Documents' },
  board: { k: 'pdf', name: 'Board pack, October.pdf', when: 'Added 3 Nov', group: 'Documents' },
  exits: { k: 'text', name: 'Exit interview notes.txt', when: 'Edited 10 Nov', group: 'Documents' },
  deck: { k: 'ppt', name: 'Q3 sales review.pptx', when: 'Edited 8 Nov', group: 'Documents' },
  photo: { k: 'image', name: 'Pune line 3 whiteboard.jpg', when: 'Added 12 Nov', group: 'Images and video' },
  townhall: { k: 'video', name: 'October town hall.mp4', when: 'Added 30 Oct', group: 'Images and video' },
  plantgif: { k: 'gif', name: 'Plant board capture.gif', when: 'Added today 8:55', group: 'Images and video' },
}

/** A citation carries its source object, so chips and previews need no global registry. */
export const cite = (srcId, loc, used, pv) => ({ S: SRC[srcId], loc, used, pv })

// Preview kinds: cells | quote ({html} may contain <mark>, {text} is plain) | slide | record | media
const C = {
  revByRegion: cite('mgmt', 'Sheet ‘Revenue by region’ · C4:D7', 'Actual and plan revenue for each region', { t: 'cells', head: ['', 'Region', 'Actual ₹ Cr', 'Plan ₹ Cr'], rows: [['4', 'West', '412', '350'], ['5', 'North', '338', '330'], ['6', 'South', '296', '305'], ['7', 'East', '238', '248']], hi: [[0, 2], [1, 2], [2, 2], [3, 2]] }),
  closedWon: cite('crm', 'Report ‘Closed won, Q3’ · 214 opportunities', 'Revenue closed so far this quarter', { t: 'record', rows: [['Report', 'Closed won, Q3'], ['Filter', 'Close date 1 Oct to today'], ['Records', '214 opportunities'], ['Total', '₹1,284 Cr']] }),
  southSlide: cite('deck', 'Slide 7 · South renewals', 'Why South is behind plan', { t: 'slide', title: 'South: two renewals moved to December', lines: ['Ganga Pharma renewal, ₹14 Cr, signature 9 Dec', 'Coastal Retail renewal, ₹9 Cr, in legal review'] }),
  pnl: cite('mgmt', 'Sheet ‘P&L’ · rows 18–24', 'Operating margin this quarter and last', { t: 'cells', head: ['', 'Line', 'Q2', 'Q3'], rows: [['18', 'Revenue ₹ Cr', '1,236', '1,284'], ['21', 'Freight ₹ Cr', '88', '98'], ['24', 'Operating margin', '19.4%', '18.6%']], hi: [[1, 3], [2, 3]] }),
  freight: cite('freight', 'Tab ‘Oct–Nov’ · D2:D40', 'The 11% rise in freight cost', { t: 'cells', head: ['', 'Lane', 'Sep ₹/t', 'Nov ₹/t'], rows: [['2', 'Pune–Delhi', '4,120', '4,610'], ['3', 'Chennai–Kolkata', '3,880', '4,290'], ['40', 'Average change', '', '+11%']], hi: [[2, 3]] }),
  discounts: cite('crm', 'Discount approvals · October', 'The two discounted renewals', { t: 'record', rows: [['Approvals', '2 renewals above 12% discount'], ['Approved by', 'Regional sales heads'], ['Margin effect', '−0.3 pts']] }),
  pipeline: cite('crm', 'View ‘Closing this month’ · 5 opportunities', 'Deal names, values and stages', { t: 'record', rows: [['View', 'Closing this month'], ['Stages', 'Contract (3), pricing approval (2)'], ['Total', '₹186 Cr']] }),
  commits: cite('deck', 'Slide 12 · November commits', 'Commit status by deal', { t: 'slide', title: 'November commits', lines: ['3 in contract, ₹130 Cr', '2 awaiting pricing approval, ₹56 Cr'] }),
  register: cite('wiki', 'Page ‘Risk register’', 'Current risk ratings', { t: 'quote', html: 'Vendor concentration: <mark>rated High</mark>. Cyber posture: rated Medium until the remediation plan is approved. Data-centre migration: rated Medium.' }),
  boardRisk: cite('board', 'Page 14 · Risk heat map', 'What the board asked for', { t: 'quote', html: 'The committee noted that <mark>supplier concentration has risen to 41%</mark> and asked management to present a mitigation plan in December.' }),
  supplierSpend: cite('mgmt', 'Sheet ‘Supplier spend’ · D3:D8', 'Top supplier share by quarter', { t: 'cells', head: ['', 'Quarter', '₹ Cr', 'Share'], rows: [['3', 'Q2 FY25', '118', '28%'], ['6', 'Q2 FY26', '176', '39%'], ['8', 'Q3 FY26', '192', '41%']], hi: [[2, 3]] }),
  vendorWiki: cite('wiki', 'Page ‘Vendor concentration’', 'Mitigation cost and stock cover', { t: 'quote', html: 'Qualifying a second supplier takes <mark>8–10 weeks and about ₹45 L</mark>. Current safety stock covers 19 days of production.' }),
  hrAttr: cite('hrms', 'Report ‘Attrition by department’', 'Attrition rates by team', { t: 'record', rows: [['Report', 'Attrition by department, annualised'], ['Logistics', '14.0%'], ['Company', '8.2%'], ['Leavers in Q3', '61']] }),
  exitNotes: cite('exits', 'Lines 12–19', 'Reasons people gave for leaving', { t: 'quote', html: '“The new <mark>rotating night shifts</mark> made it impossible with my kids.” … “<mark>The new hub at Bhiwandi</mark> pays ₹2,000 more and is closer.”' }),
  townhall: cite('townhall', '18:40 · Q&A section', 'Concerns staff raised in public', { t: 'media', kind: 'video', label: '18:40 / 52:10', pct: 36, caption: 'Transcript: “Will the shift pattern be reviewed before Diwali?” asked by a Logistics supervisor.' }),
  cashSheet: cite('mgmt', 'Sheet ‘Cash flow’ · H30:H35', 'Month-end cash balance', { t: 'cells', head: ['', 'Month', 'Cash ₹ Cr'], rows: [['30', 'Jun', '1,960'], ['34', 'Oct', '2,120'], ['35', 'Nov', '2,140']], hi: [[2, 2]] }),
  runway: cite('board', 'Page 4 · Liquidity', 'How runway is calculated', { t: 'quote', html: 'Runway is cash and equivalents divided by <mark>average net burn of the last six months</mark>, including committed plant capex.' }),
  retention: cite('crm', 'Report ‘30-day retention’ · November', 'Retention rate', { t: 'record', rows: [['Report', '30-day retention by cohort'], ['November', '94.2%'], ['October', '92.9%']] }),
  onboarding: cite('deck', 'Slide 4 · Onboarding', 'What changed in October', { t: 'slide', title: 'New onboarding, live 7 October', lines: ['Guided setup cut time-to-first-order from 9 to 4 days', 'Early churn down 1.3 pts'] }),
  sow: cite('sow', 'Section 4.2 · Delivery timeline', 'Contracted team size and dates', { t: 'quote', html: 'The Supplier shall provide <mark>five (5) engineers on site</mark> from 1 September until cut-over is complete.' }),
  projWiki: cite('wiki', 'Page ‘Data-centre migration’', 'Current status', { t: 'quote', html: 'Cut-over moved to <mark>1 December</mark>. 2 of 5 vendor engineers are on site.' }),
  lease: cite('mgmt', 'Sheet ‘Leases’ · F12', 'Cost of a 2-month extension', { t: 'cells', head: ['', 'Site', 'Monthly ₹ L', '2 months ₹ L'], rows: [['12', 'Mumbai DC', '55', '110']], hi: [[0, 3]] }),
  plantGif: cite('plantgif', 'Frame 3 of 18 · captured 8:55', 'Utilisation by plant', { t: 'media', kind: 'gif', label: 'GIF · 6 s loop', caption: 'Read from the plant board: Pune 98%, Nashik 94%, Hosur 91%, Chennai 86%.' }),
  photo: cite('photo', 'Top-right of the whiteboard', 'The Pune line 3 constraint', { t: 'media', kind: 'image', label: 'Photo · 12 Nov', caption: 'Text read from the photo: “Line 3 at 98%. No spare shift until December.”' }),
  audit: cite('board', 'Page 16 · Internal audit summary', 'Number and severity of findings', { t: 'quote', html: 'The external audit identified <mark>no critical and six medium findings</mark>, four relating to quarterly access reviews and two to patch timing on plant systems.' }),
  secPlan: cite('wiki', 'Page ‘Security remediation plan’', 'Due date of the fix plan', { t: 'quote', html: 'Remediation plan owner: CISO. <mark>Due 30 November</mark>; to the risk committee on 5 December.' }),
  ordersToday: cite('crm', 'Report ‘Orders booked today’ · 41 orders', 'Today’s bookings by region', { t: 'record', rows: [['Report', 'Orders booked today'], ['Orders', '41'], ['Value', '₹18.4 Cr'], ['Same day last week', '₹18.0 Cr']] }),
  creditHold: cite('crm', 'Queue ‘Credit approval’ · 1 order', 'The order waiting for credit approval', { t: 'record', rows: [['Customer', 'Meridian Logistics'], ['Value', '₹2.3 Cr'], ['Waiting since', '11:20 today'], ['Approver', 'Group CFO']] }),
}

/* ---------- "Needs your attention" (static items; live project items are added on top once data loads) ---------- */
export const ATTN = [
  { id: 'migration', t: 'Data-centre migration is 3 weeks late', d: 'Vendor needs a go / no-go decision by Tuesday.', s: 'risk', w: 'At risk', o: 'Rahul Mehta · CTO',
    what: 'Cut-over of the billing and ERP workloads slipped from 20 October to 10 November, then again to 1 December. The vendor has 2 of 5 planned engineers on site.',
    decision: 'Approve ₹3.2 Cr for a second vendor team to hold 1 December, or accept a January cut-over and extend the current lease by 2 months (₹1.1 Cr).',
    q: 'What happens if we delay the migration to January?', cites: [C.sow, C.projWiki, C.lease] },
  { id: 'vendor', t: '41% of supply depends on one partner', d: 'Contract renewal opens 1 December.', s: 'risk', w: 'At risk', o: 'Priya Nair · COO',
    what: 'One component supplier provides 41% of Plant inputs, up from 28% a year ago after two smaller vendors exited.',
    decision: 'Approve qualifying a second supplier before renewal talks (8–10 weeks, ₹45 L), which gives us negotiating leverage.',
    q: 'How exposed are we to our top supplier?', cites: [C.vendorWiki, C.supplierSpend] },
  { id: 'attrition', t: 'Logistics attrition up to 14%', d: 'Two site leads resigned this month.', s: 'watch', w: 'Watch', o: 'Sana Iqbal · CHRO',
    what: 'Annualised attrition in Logistics rose from 9% to 14% over two quarters. Exit interviews cite shift patterns and a competitor opening nearby.',
    decision: 'No decision yet. HR will bring a retention plan to the 24 November leadership meeting.',
    q: 'Why is attrition rising in Logistics?', cites: [C.hrAttr, C.exitNotes, C.townhall] },
  { id: 'cyber', t: 'Cyber audit: 6 medium findings', d: 'Remediation plan due 30 November.', s: 'watch', w: 'Watch', o: 'Arjun Rao · CISO',
    what: 'The external audit found no critical issues. Six medium findings relate to access reviews and patch timing on plant systems.',
    decision: 'None needed from you. Board risk committee will see the plan on 5 December.',
    q: 'Summarise our cyber audit findings', cites: [C.audit, C.secPlan] },
]

export const ONTRACK_STATIC = [
  ['Operations', 'Plants 92% · Logistics 88% · Support 95% utilisation'],
  ['Projects', 'Loading project data…'],
  ['Sales', '87% of quarter target closed, 6 weeks to go'],
  ['People', 'Headcount 4,812, on plan'],
]

// [name, status, status word, big number, caption, question]
export const MODS_STATIC = [
  ['Finance', 'ok', 'On track', '₹1,284 Cr', 'Revenue QTD, 4.1% ahead of plan', 'Give me a finance summary for this quarter'],
  ['Sales', 'ok', 'On track', '87%', 'Of quarter target closed', 'What are the top 5 deals closing this month?'],
  ['Operations', 'ok', 'On track', '92%', 'Plant utilisation, Logistics 88%', 'How are our plants performing?'],
  ['People', 'watch', 'Watch', '14%', 'Logistics attrition, company 8.2%', 'Why is attrition rising in Logistics?'],
  ['Projects', 'watch', 'Loading', '…', 'Loading project data', 'Which projects will miss their next milestone?'],
  ['Risk', 'risk', 'At risk', '1 high', 'Vendor exposure; cyber medium', 'Summarise board risks'],
]

/* ---------- Canned answers (sample modules) ---------- */
// body/list text may contain <strong>…</strong>; list items can also be {s, w, t} (status word + text)
export const ANSWERS = [
  { k: /flash|today|daily sales/i, hero: '₹18.4 Cr',
    body: 'Sales booked today are <strong>₹18.4 Cr</strong>, 2.2% above the same day last week, across 41 orders. West leads with ₹6.1 Cr. One ₹2.3 Cr order is waiting for credit approval.',
    chart: { kind: 'bars', rows: [['West', 6.1], ['North', 5.2], ['South', 4.0], ['East', 3.1]], unit: '₹' }, src: [C.ordersToday, C.creditHold], f: ['Top 5 deals closing this month'] },
  { k: /revenue|plan|closed|finance summary|quarter/i, hero: '₹1,284 Cr',
    body: 'Revenue this quarter is <strong>4.1% ahead of plan</strong>. West drove most of the gain (+₹62 Cr on two large renewals). South is 3% behind because two enterprise renewals slipped into December.',
    chart: { kind: 'bars', rows: [['West', 412, 350], ['North', 338, 330], ['South', 296, 305], ['East', 238, 248]], unit: '₹' }, src: [C.revByRegion, C.closedWon, C.southSlide], f: ['Why is South behind?', 'What will we close by year end?'] },
  { k: /margin/i, hero: '18.6%',
    body: 'Operating margin fell <strong>0.8 points</strong> from last quarter. Freight costs in Logistics rose 11% (−0.5 pts) and two enterprise renewals were signed at a deeper discount (−0.3 pts). Plant efficiency gains offset a little of this.',
    chart: { kind: 'line', labels: ['Q2 FY25', 'Q3', 'Q4', 'Q1 FY26', 'Q2', 'Q3'], vals: [18.1, 18.7, 19.2, 19.4, 19.4, 18.6], fmt: (v) => v.toFixed(1) + '%' }, src: [C.pnl, C.freight, C.discounts], f: ['How do we recover the freight cost?', 'Who approved the renewal discounts?'] },
  { k: /deal|pipeline|top 5|close this month|closing/i, hero: '₹186 Cr',
    body: 'Five deals worth <strong>₹186 Cr</strong> are due to close this month. Three are in contract; two still need pricing approval.',
    list: ['Northwind Retail · ₹58 Cr · in contract', 'Asteria Health · ₹44 Cr · in contract', 'Meridian Logistics · ₹36 Cr · pricing approval', 'Kestrel Foods · ₹28 Cr · in contract', 'Halcyon Bank · ₹20 Cr · pricing approval'],
    src: [C.pipeline, C.commits], f: ['Which deals are at risk of slipping?', 'What will we close by year end?'] },
  { k: /risk|board/i, hero: '1 high, 2 medium',
    body: 'Three risks are on the board register this quarter.',
    list: [{ s: 'risk', w: 'High', t: 'Vendor exposure: 41% of supply from one partner' }, { s: 'watch', w: 'Medium', t: 'Cyber posture: 6 medium audit findings, plan due 30 November' }, { s: 'watch', w: 'Medium', t: 'Data-centre migration: 3 weeks late' }],
    src: [C.register, C.boardRisk], f: ['How exposed are we to our top supplier?', 'What happens if we delay the migration to January?'] },
  { k: /supplier|vendor|exposed/i, hero: '41%',
    body: 'Our top supplier provides <strong>41% of Plant inputs</strong>, up from 28% a year ago. If it stopped supplying, we hold about 19 days of stock. A second supplier can be qualified in 8–10 weeks for about ₹45 L.',
    chart: { kind: 'line', labels: ['Q2 FY25', 'Q3', 'Q4', 'Q1 FY26', 'Q2', 'Q3'], vals: [28, 30, 33, 36, 39, 41], fmt: (v) => Math.round(v) + '%' }, src: [C.supplierSpend, C.vendorWiki, C.boardRisk], f: ['Summarise board risks'] },
  { k: /attrition|people|hiring|headcount/i, hero: '14%',
    body: 'Logistics attrition is <strong>14% annualised</strong>, against 8.2% for the company. Exit interviews point to new shift patterns and a competitor hub that opened 6 km from our Bhiwandi site.',
    chart: { kind: 'bars', rows: [['Logistics', 14], ['Plants', 9.1], ['Sales', 8.4], ['Corporate', 5.2]], unit: '' }, src: [C.hrAttr, C.exitNotes, C.townhall], f: ['What would a retention bonus cost?'] },
  { k: /cash|runway/i, hero: '26 months',
    body: 'We hold <strong>₹2,140 Cr</strong> in cash and equivalents. At the current burn on new plants, that is 26 months of runway, unchanged from last month.',
    chart: { kind: 'line', labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], vals: [1960, 2010, 2050, 2090, 2120, 2140], fmt: (v) => '₹' + Math.round(v) }, src: [C.cashSheet, C.runway], f: ['How is revenue tracking against plan?'] },
  { k: /retention|churn|customer/i, hero: '94.2%',
    body: '30-day customer retention is <strong>94.2%</strong>, up 1.3 points in a month, after the new onboarding flow launched in October.',
    chart: { kind: 'line', labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], vals: [92.1, 92.4, 92.6, 92.9, 93.6, 94.2], fmt: (v) => v.toFixed(1) + '%' }, src: [C.retention, C.onboarding], f: ['Which customers are most at risk?'] },
  { k: /migration|january|delay/i, hero: '₹1.1 Cr',
    body: 'Delaying the migration to January costs about <strong>₹1.1 Cr</strong> in a 2-month lease extension and pushes the billing upgrade into Q4. Holding 1 December needs a second vendor team at ₹3.2 Cr.',
    src: [C.sow, C.projWiki, C.lease], f: ['Summarise board risks'] },
  { k: /plant|operations|utilisation/i, hero: '92%',
    body: 'Plants ran at <strong>92% utilisation</strong> this quarter, 3 points higher than last. Pune is the constraint at 98%; Chennai has 14% spare capacity.',
    chart: { kind: 'bars', rows: [['Pune', 98], ['Nashik', 94], ['Hosur', 91], ['Chennai', 86]], unit: '' }, src: [C.plantGif, C.photo], f: ['Should we shift volume to Chennai?'] },
  { k: /cyber|audit|security/i, hero: '0 critical',
    body: 'The external audit found <strong>no critical issues</strong> and 6 medium findings: 4 on quarterly access reviews and 2 on patch timing for plant systems. The fix plan is due 30 November.',
    src: [C.audit, C.secPlan], f: ['Summarise board risks'] },
]

export const SUGGEST = ['Which projects will miss their next milestone?', 'What is our total penalty exposure?', 'Why did margin dip?']

// Project questions go to the assistant (Node API + Claude); everything else uses the canned answers above.
export const PROJECT_RE = /project|milestone|penalt|\bsla\b|\bphase|schedul|agreement|contract|delay|\blate\b|behind|handover|flag|exposure|slip|on track|budget|forecast|portfolio|\bp\d{1,2}\b/i

export const QR_DEFAULT = [
  { id: 'proj', name: 'Project health', cadence: 'Daily', q: 'Which projects will miss their next milestone?', v: '…' },
  { id: 'pen', name: 'Penalty exposure', cadence: 'Daily', q: 'What is our total penalty exposure?', v: 'Live' },
  { id: 'flash', name: 'Daily sales flash', cadence: 'Daily', q: 'Daily sales flash', v: '₹18.4 Cr' },
  { id: 'cash', name: 'Cash position', cadence: 'Daily', q: 'What is our cash position?', v: '26 mo' },
  { id: 'deals', name: 'Deals closing this month', cadence: 'Daily', q: 'Top 5 deals closing this month', v: '₹186 Cr' },
  { id: 'plants', name: 'Plant utilisation', cadence: 'Daily', q: 'How are our plants performing?', v: '92%' },
  { id: 'attr', name: 'Attrition watch', cadence: 'Mondays', q: 'Why is attrition rising in Logistics?', v: '14%' },
  { id: 'risks', name: 'Board risks', cadence: 'Mondays', q: 'Summarise board risks', v: '1 high' },
]

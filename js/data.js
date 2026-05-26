const roles = [
  { id:'newpm', emoji:'🙋', title:'New PM', desc:'Build a project workspace with guided prompts, starter RAID and coaching.' },
  { id:'pm', emoji:'👔', title:'Project Manager', desc:'Run delivery, risks, stakeholders, changes and sprint health.' },
  { id:'programme', emoji:'🧭', title:'Programme Manager', desc:'See timeline, dependencies, escalation flow and cross-project delivery health.' },
  { id:'portfolio', emoji:'📊', title:'Portfolio Lead', desc:'Track portfolio health, systemic risk, patterns and executive decisions.' },
  { id:'sponsor', emoji:'🏛️', title:'Sponsor / Stakeholder', desc:'Receive concise narratives, decisions needed and escalation summaries.' },
  { id:'team', emoji:'🛠️', title:'Team Member', desc:'Focus on work, blockers, dependencies, sprint commitments and actions.' }
];

const nav = [
  { label:'Home', items:[
    { id:'dashboard', icon:'ti-layout-dashboard', name:'Portfolio Dashboard' },
    { id:'project', icon:'ti-briefcase', name:'Project Workspace' }
  ]},
  { label:'Start', items:[
    { id:'setup', icon:'ti-sparkles', name:'Guided Setup' },
    { id:'library', icon:'ti-template', name:'Templates' }
  ]},
  { label:'Delivery', items:[
    { id:'delivery', icon:'ti-timeline', name:'Timeline · RAID · Sprint', badge:'1' }
  ]},
  { label:'Governance', items:[
    { id:'governance', icon:'ti-shield-check', name:'RAG · Change · Decisions', badge:'2', badgeClass:'amber' }
  ]},
  { label:'People', items:[
    { id:'people', icon:'ti-users', name:'Stakeholders · RACI · Capacity' }
  ]},
  { label:'Intelligence', items:[
    { id:'intelligence', icon:'ti-route', name:'Trace · Learning · Patterns' }
  ]},
  { label:'Reports', items:[
    { id:'reports', icon:'ti-report-analytics', name:'Narratives · Exports' }
  ]}
];

const projects = [
  { name:'Apex Mobile', rag:'amber', status:'Vendor dependency active', sprint:'S3', cpi:1.08, spi:.97, owner:'Sarah Chen' },
  { name:'Nexus Compliance', rag:'green', status:'On track', sprint:'S5', cpi:1.10, spi:1.02, owner:'Raj Patel' },
  { name:'Meridian Training', rag:'red', status:'Testing blocked', sprint:'S2', cpi:.88, spi:.67, owner:'Mia Torres' },
  { name:'Atlas Payroll', rag:'slate', status:'Closed', sprint:'Done', cpi:1.04, spi:1.00, owner:'Lena Gray' }
];

const features = [
  { group:'Delivery', icon:'ti-shield-exclamation', title:'RAID Log', desc:'Risks, assumptions, issues and dependencies with trigger-based escalation.', tags:['Risks','Assumptions','Issues','Dependencies'] },
  { group:'Delivery', icon:'ti-timeline-event', title:'Programme Timeline', desc:'Sprint and milestone view across projects with clickable delivery detail.', tags:['Sprints','Milestones','Blockers'] },
  { group:'Delivery', icon:'ti-layout-kanban', title:'Sprint Workspace', desc:'Backlog, board, burndown, velocity and retrospective in one guided view.', tags:['Backlog','Board','Retro'] },
  { group:'Governance', icon:'ti-traffic-lights', title:'RAG Dashboard', desc:'Auto-calculated RAG across scope, schedule, budget, quality and risk.', tags:['RAG','Commentary','Overrides'] },
  { group:'Governance', icon:'ti-git-pull-request', title:'Change Control', desc:'Integrated CR workflow with schedule, cost, quality and scope impact.', tags:['CR','CCB','Rebaseline'] },
  { group:'Governance', icon:'ti-scale', title:'Decision Rights', desc:'Approval thresholds and decision ownership for faster governance.', tags:['Thresholds','Audit','Routing'] },
  { group:'People', icon:'ti-users-group', title:'Stakeholders', desc:'Register, power-interest grid, engagement matrix and communications plan.', tags:['Stakeholders','Comms','Engagement'] },
  { group:'People', icon:'ti-table', title:'RACI & Capacity', desc:'Ownership clarity plus people capacity signals across delivery teams.', tags:['RACI','Capacity','Ownership'] },
  { group:'Intelligence', icon:'ti-route', title:'Impact Trace', desc:'Visual cause-and-effect chain from blocker to decision to learning.', tags:['Trace','Cause','Learning'] },
  { group:'Intelligence', icon:'ti-brain', title:'Learning Engine', desc:'Cross-project memory that detects patterns and reuses lessons.', tags:['Patterns','Memory','Insights'] },
  { group:'Reports', icon:'ti-file-analytics', title:'Executive Narratives', desc:'Plain-English delivery health, decisions needed and steering packs.', tags:['Narrative','Steering','Export'] },
  { group:'Start', icon:'ti-circle-plus', title:'Project Setup Intelligence', desc:'Generate phases, RAID starters, milestones, stakeholders and governance defaults.', tags:['Wizard','Templates','Coaching'] }
];

const traceSteps = [
  ['blocker','STEP 1 — BLOCKER','Third-party API vendor missed sprint 3 milestone.','15 Jan · Reported by Sarah Chen'],
  ['risk','STEP 2 — RISK TRIGGERED','Risk R001 activated: vendor dependency risk. Score 15 → active.','Auto-created from RAID trigger'],
  ['blocker','STEP 3 — ISSUE CREATED','Issue I001 opened and linked to integration testing delay.','Owner assigned · 48h clock started'],
  ['decision','STEP 4 — DECISION NEEDED','Sponsor must approve fallback vendor support or timeline rebaseline.','Decision due before Friday steering'],
  ['learning','STEP 5 — LEARNING CAPTURED','Future vendor integrations require fallback plan approval before Phase 3.','Added to cross-project library']
];

const insights = [
  { title:'Vendor dependency pattern', body:'4 of 6 delayed projects share late external API handoff. Average impact: +18 days.', badge:'Recurring pattern', type:'red' },
  { title:'Testing bottleneck emerging', body:'UAT defects increased across mobile projects after sprint 2. Add test readiness checkpoint.', badge:'Emerging risk', type:'amber' },
  { title:'Governance working', body:'Projects with weekly decision review close CRs 42% faster in this demo dataset.', badge:'Positive pattern', type:'green' }
];

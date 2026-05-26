const ROLES = [
  {id:'newpm', icon:'ti-compass', title:'I need help structuring and running a project', role:'New PM', sub:'Generate phases, risks, stakeholders, governance and a starter delivery rhythm automatically.', preview:'RAID · Timeline · Stakeholders · Governance'},
  {id:'pm', icon:'ti-shield-check', title:'I need visibility into delivery risk and execution', role:'Project Manager', sub:'Focus on RAID, blockers, sprint health, RAG and active mitigation actions.', preview:'Risks · Issues · Sprint · RAG'},
  {id:'programme', icon:'ti-timeline-event', title:'I need to coordinate dependencies across teams', role:'Programme Manager', sub:'See cross-team dependencies, milestones, sprint drift and escalation paths in one place.', preview:'Timeline · Dependencies · EVM · Escalations'},
  {id:'portfolio', icon:'ti-chart-grid-dots', title:'I need portfolio-level intelligence and trends', role:'Portfolio Lead', sub:'Prioritise portfolio health, systemic risk, patterns and cross-project learning.', preview:'Health · Patterns · Learning · Reports'},
  {id:'sponsor', icon:'ti-briefcase', title:'I need concise delivery insights and decisions', role:'Sponsor', sub:'Read executive-grade narratives, decisions required, escalations and commercial impact.', preview:'Narratives · Decisions · Steering'},
  {id:'team', icon:'ti-users-group', title:'I need visibility into sprint work and blockers', role:'Team Member', sub:'See current sprint work, ownership, blockers and dependencies without PMO noise.', preview:'Sprint · Blockers · Capacity · Dependencies'}
];

const NAV = [
  ['HOME',[['dashboard','Portfolio Dashboard','ti-layout-dashboard'],['executive','Executive Health','ti-presentation-analytics']]],
  ['START',[['guided-setup','Guided Setup','ti-sparkles'],['templates','Templates','ti-template'],['new-project','New Project','ti-circle-plus']]],
  ['DELIVERY',[['timeline','Programme Timeline','ti-timeline'],['raid','RAID','ti-shield-exclamation'],['sprint','Sprint Workspace','ti-layout-kanban'],['dependencies','Dependencies','ti-route']]],
  ['GOVERNANCE',[['rag','RAG','ti-traffic-lights'],['change','Change Control','ti-git-pull-request'],['escalations','Escalations','ti-urgent'],['decisions','Decisions','ti-scale']]],
  ['PEOPLE',[['stakeholders','Stakeholders','ti-users'],['engagement','Engagement','ti-chart-grid-dots'],['raci','RACI','ti-table'],['capacity','Capacity','ti-users-group']]],
  ['INTELLIGENCE',[['impact','Impact Trace','ti-route-alt-left'],['learning','Learning Engine','ti-books'],['insights','Cross-Project Insights','ti-brain'],['narratives','Delivery Narratives','ti-file-text-ai']]],
  ['REPORTS',[['steering','Steering Packs','ti-report'],['exec-summaries','Executive Summaries','ti-file-description'],['exports','Exports','ti-download']]]
];

const projects = [
  {name:'Apex Mobile Platform', rag:'amber', cpi:1.08, spi:.97, sprint:'S3', note:'Vendor API milestone slipped; fallback plan active.'},
  {name:'Nexus Compliance', rag:'green', cpi:1.10, spi:1.02, sprint:'S5', note:'Controls mapping completed ahead of steering review.'},
  {name:'Meridian Training', rag:'red', cpi:.88, spi:.67, sprint:'S2', note:'Capacity gap causing rollout delay; sponsor decision needed.'},
  {name:'Orion Data Migration', rag:'green', cpi:1.04, spi:1.00, sprint:'S4', note:'Cutover rehearsal passed with minor defects.'}
];

const risks = [
  ['R001','Vendor API delay','Critical','Trigger fired','Sarah Chen'],
  ['R002','Resource gap in integration team','High','Monitoring','Anil Kumar'],
  ['R003','Stakeholder sign-off delay','Medium','Mitigation active','Priya Menon']
];

const traceSteps = [
  ['red','Step 1 — Blocker','Third-party API vendor missed the sprint 3 milestone. Reported by Sarah Chen on 15 Jan.'],
  ['amber','Step 2 — Risk Triggered','Risk R001 activated automatically because the observable trigger condition was met.'],
  ['red','Step 3 — Issue Created','Issue I001 created and linked to the risk, dependency and affected sprint.'],
  ['amber','Step 4 — Escalation Routed','Sponsor notified because the issue crossed the 48-hour threshold without confirmed recovery.'],
  ['green','Step 5 — Decision Logged','Fallback internal integration approach approved by steering committee.'],
  ['green glow','Step 6 — Learning Captured','Future vendor integrations must have internal fallback owner approved before Phase 3.']
];

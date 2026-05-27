const intents=[
 {id:'newpm',icon:'ti ti-compass',title:'I need help structuring and running a project',desc:'Generate phases, risks, stakeholders, governance and a starter timeline.',role:'New PM'},
 {id:'pm',icon:'ti ti-radar',title:'I need visibility into delivery risk and execution',desc:'Start with RAID, progress signals, blockers and delivery health.',role:'Project Manager'},
 {id:'programme',icon:'ti ti-timeline-event',title:'I need to coordinate dependencies across teams',desc:'Build a programme view across milestones, vendors and cross-team blockers.',role:'Programme Manager'},
 {id:'portfolio',icon:'ti ti-chart-dots-3',title:'I need portfolio-level intelligence and trends',desc:'Focus on cross-project risk, trends, patterns and executive decisions.',role:'Portfolio Lead'},
 {id:'sponsor',icon:'ti ti-report-analytics',title:'I need concise delivery insights and decisions',desc:'Generate executive narratives, decisions needed and risk movement.',role:'Sponsor / Executive'},
 {id:'team',icon:'ti ti-layout-kanban',title:'I need visibility into sprint work and blockers',desc:'Create sprint workspace, blockers, actions and delivery commitments.',role:'Team Member'}
];
const navGroups=[
 {label:'Home',items:[['dashboard','Portfolio Dashboard'],['setup-output','Generated Setup']]},
 {label:'Delivery',items:[['delivery','Timeline & Dependencies'],['raid','RAID Workspace']]},
 {label:'Governance',items:[['governance','RAG · Change · Decisions']]},
 {label:'People',items:[['people','Stakeholders · RACI · Capacity']]},
 {label:'Intelligence',items:[['impact','Impact Trace'],['learning','Learning Engine']]},
 {label:'Reports',items:[['reports','Executive Narratives'],['integrations','Import / Connect']]}
];

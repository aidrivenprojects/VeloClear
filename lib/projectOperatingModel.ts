export const demoProjects = [
  { id: "facility-permit-system", name: "Facility Permit System", programme: "Operational Workflow Digitisation", health: "amber", summary: "Digitise permit request, approval, inspection, extension and closure." },
  { id: "tenant-billing-platform", name: "Tenant Billing Platform", programme: "Smart Building Operations", health: "green", summary: "Track tenant common-space and electricity use for billing." },
  { id: "compliance-portal", name: "AI Compliance Portal", programme: "Regulatory Transformation", health: "red", summary: "Manage compliance evidence, approvals, audit trail and exceptions." }
];

export const demoProject = demoProjects[0];

export const projectPhases = [
  { slug: "initiation", number: "1", title: "Initiation", tools: [
    { slug: "charter", title: "Charter" }, { slug: "business-case", title: "Business Case" }, { slug: "stakeholders", title: "Stakeholders" }, { slug: "scope", title: "Scope" }
  ]},
  { slug: "planning", number: "2", title: "Planning", tools: [
    { slug: "wbs", title: "WBS" }, { slug: "schedule", title: "Schedule" }, { slug: "resource-plan", title: "Resource Plan" }, { slug: "product-backlog", title: "Product Backlog" }, { slug: "sprint-backlog", title: "Sprint Backlog" }, { slug: "milestones", title: "Milestones" }
  ]},
  { slug: "mobilisation", number: "3", title: "Mobilisation", tools: [
    { slug: "kickoff-pack", title: "Kick-off Pack" }, { slug: "sprint-zero", title: "Sprint 0 Checklist" }, { slug: "team-onboarding", title: "Team Onboarding" }
  ]},
  { slug: "raid", number: "4", title: "RAID", tools: [
    { slug: "raid-log", title: "RAID Log" }, { slug: "risk-heat-map", title: "Risk Heat Map" }, { slug: "issue-log", title: "Issue Log" }
  ]},
  { slug: "stakeholders", number: "5", title: "Stakeholders", tools: [
    { slug: "stakeholder-register", title: "Stakeholder Register" }, { slug: "power-interest-grid", title: "Power-Interest Grid" }, { slug: "engagement-matrix", title: "Engagement Matrix" }, { slug: "raci-matrix", title: "RACI Matrix" }, { slug: "communications-plan", title: "Communications Plan" }
  ]},
  { slug: "governance", number: "6", title: "Governance", tools: [
    { slug: "rag-dashboard", title: "RAG Dashboard" }, { slug: "change-control", title: "Change Control" }, { slug: "escalation-tracker", title: "Escalation Tracker" }, { slug: "decision-rights", title: "Decision Rights" }, { slug: "audit-trail", title: "Audit Trail" }, { slug: "auto-reports", title: "Auto Reports" }, { slug: "import-export", title: "Import / Export" }
  ]},
  { slug: "agile-delivery", number: "7", title: "Agile Delivery", tools: [
    { slug: "product-backlog", title: "Product Backlog" }, { slug: "sprint-board", title: "Sprint Board" }, { slug: "burndown", title: "Burndown" }, { slug: "velocity", title: "Velocity" }, { slug: "retrospective", title: "Retrospective" }
  ]},
  { slug: "intelligence", number: "8", title: "Intelligence", tools: [
    { slug: "impact-trace", title: "Impact Trace" }, { slug: "sprint-intelligence", title: "Sprint Intelligence" }, { slug: "evm", title: "EVM" }, { slug: "people-capacity", title: "People & Capacity" }, { slug: "delivery-graph", title: "Delivery Graph" }
  ]}
];

export const traceChain = ["Business Case", "Charter", "WBS", "Product Backlog", "PBI", "Sprint Backlog", "Sprint Board", "Blocker", "Risk Trigger", "Issue", "Escalation", "Decision", "Resolution", "Retrospective", "Learning", "Future Recommendation"];

export function findProject(id: string) { return demoProjects.find(p => p.id === id) ?? demoProject; }
export function getPhase(slug: string) { return projectPhases.find(p => p.slug === slug) ?? projectPhases[0]; }
export function getTool(phaseSlug: string, toolSlug: string) {
  const phase = getPhase(phaseSlug);
  return phase.tools.find(t => t.slug === toolSlug) ?? phase.tools[0];
}
export function getSample(toolSlug: string) {
  const samples: Record<string, any> = {
    "product-backlog": { overview: "Epics, features, PBIs, priorities, points and acceptance criteria. Product Backlog comes before Sprint Backlog.", records: [{ title: "PBI-142: Approver can approve permit requests", status: "red", owner: "Product Owner", signal: "Blocked by approval matrix dependency." }] },
    "sprint-backlog": { overview: "Committed sprint work selected from the Product Backlog.", records: [{ title: "Sprint 2 approval workflow commitment", status: "amber", owner: "Scrum Master", signal: "Commitment risk due to unresolved approvers." }] },
    "retrospective": { overview: "Continuous sprint learning loop under Agile Delivery.", records: [{ title: "Confirm approval ownership before sprint commitment", status: "green", owner: "Scrum Master", signal: "Future prevention rule created." }] },
    "impact-trace": { overview: "Blocker → risk → issue → escalation → decision → resolution → learning.", records: [{ title: "Approval blocker impact trace", status: "red", owner: "VeloClear", signal: "Open full trace chain." }] }
  };
  return samples[toolSlug] ?? { overview: "This workspace is project-bound and connects into the VeloClear delivery graph.", records: [{ title: "Connected delivery record", status: "amber", owner: "Project Team", signal: "This record links to phase, tool and trace context." }] };
}

export type PhaseTemplate = {
  phase_slug: string;
  phase_number: number;
  title: string;
  purpose: string;
  tools: { tool_slug: string; title: string; description: string }[];
};

export const phaseTemplates: PhaseTemplate[] = [
  { phase_slug: "initiation", phase_number: 1, title: "Initiation", purpose: "Define the project before work begins.", tools: [
    { tool_slug: "charter", title: "Charter", description: "Objectives, scope, constraints, authority and sign-off." },
    { tool_slug: "business-case", title: "Business Case", description: "Why this project exists and what value it creates." },
    { tool_slug: "stakeholders", title: "Stakeholders", description: "Initial sponsor, users, approvers and impacted groups." },
    { tool_slug: "scope", title: "Scope", description: "In scope, out of scope, assumptions and boundaries." }
  ]},
  { phase_slug: "planning", phase_number: 2, title: "Planning", purpose: "Build the delivery plan before committing to execution.", tools: [
    { tool_slug: "wbs", title: "WBS", description: "Work breakdown structure." },
    { tool_slug: "schedule", title: "Schedule", description: "Timeline, activities and dependencies." },
    { tool_slug: "resource-plan", title: "Resource Plan", description: "People, roles and capacity." },
    { tool_slug: "product-backlog", title: "Product Backlog", description: "Epics, PBIs, user stories and acceptance criteria." },
    { tool_slug: "sprint-backlog", title: "Sprint Backlog", description: "Selected sprint work from the product backlog." },
    { tool_slug: "milestones", title: "Milestones", description: "Key delivery and governance checkpoints." }
  ]},
  { phase_slug: "mobilisation", phase_number: 3, title: "Mobilisation", purpose: "Prepare the team, access, kickoff and sprint zero readiness.", tools: [
    { tool_slug: "kickoff-pack", title: "Kick-off Pack", description: "Kickoff agenda and responsibilities." },
    { tool_slug: "sprint-zero", title: "Sprint 0 Checklist", description: "Environment and access readiness." },
    { tool_slug: "team-onboarding", title: "Team Onboarding", description: "Role onboarding and ways of working." }
  ]},
  { phase_slug: "raid", phase_number: 4, title: "RAID", purpose: "Manage risks, assumptions, issues and dependencies.", tools: [
    { tool_slug: "raid-log", title: "RAID Log", description: "Risks, assumptions, issues, dependencies and triggers." },
    { tool_slug: "risk-heat-map", title: "Risk Heat Map", description: "Probability versus impact." },
    { tool_slug: "issue-log", title: "Issue Log", description: "Active issues requiring action now." }
  ]},
  { phase_slug: "stakeholders", phase_number: 5, title: "Stakeholders", purpose: "Manage people, influence, engagement, RACI and communication.", tools: [
    { tool_slug: "stakeholder-register", title: "Stakeholder Register", description: "People, power, interest and sentiment." },
    { tool_slug: "power-interest-grid", title: "Power-Interest Grid", description: "Engagement quadrant." },
    { tool_slug: "engagement-matrix", title: "Engagement Matrix", description: "Current versus desired engagement." },
    { tool_slug: "raci-matrix", title: "RACI Matrix", description: "Responsible, accountable, consulted and informed." },
    { tool_slug: "communications-plan", title: "Communications Plan", description: "Audience, channel and cadence." }
  ]},
  { phase_slug: "governance", phase_number: 6, title: "Governance", purpose: "Run steering, decisions, approvals, change control and audit.", tools: [
    { tool_slug: "rag-dashboard", title: "RAG Dashboard", description: "Project health across delivery dimensions." },
    { tool_slug: "change-control", title: "Change Control", description: "Change requests and approvals." },
    { tool_slug: "escalation-tracker", title: "Escalation Tracker", description: "Escalations, decision owners and deadlines." },
    { tool_slug: "decision-rights", title: "Decision Rights", description: "Who can decide what." },
    { tool_slug: "audit-trail", title: "Audit Trail", description: "Evidence of decisions and changes." },
    { tool_slug: "auto-reports", title: "Auto Reports", description: "Sponsor, PMO, steering and audit reports." },
    { tool_slug: "import-export", title: "Import / Export", description: "Move data in and out." }
  ]},
  { phase_slug: "agile-delivery", phase_number: 7, title: "Agile Delivery", purpose: "Run backlog, sprints, delivery boards, velocity and retrospectives.", tools: [
    { tool_slug: "product-backlog", title: "Product Backlog", description: "Epics, PBIs and stories." },
    { tool_slug: "sprint-board", title: "Sprint Board", description: "To do, in progress, blocked and done." },
    { tool_slug: "burndown", title: "Burndown", description: "Remaining work." },
    { tool_slug: "velocity", title: "Velocity", description: "Completed points trend." },
    { tool_slug: "retrospective", title: "Retrospective", description: "Learning actions." }
  ]},
  { phase_slug: "intelligence", phase_number: 8, title: "Intelligence", purpose: "Trace impact, surface signals and turn learning into prevention.", tools: [
    { tool_slug: "impact-trace", title: "Impact Trace", description: "Blocker → risk → issue → escalation → decision → resolution → learning." },
    { tool_slug: "sprint-intelligence", title: "Sprint Intelligence", description: "Sprint patterns and risk signals." },
    { tool_slug: "evm", title: "EVM", description: "Earned value management." },
    { tool_slug: "people-capacity", title: "People & Capacity", description: "Utilisation and ownership." },
    { tool_slug: "delivery-graph", title: "Delivery Graph", description: "Graph-native relationships." }
  ]}
];

export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || `project-${Date.now()}`;
}

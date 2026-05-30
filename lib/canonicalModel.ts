export const lifecycle = [
  {
    slug: "initiation",
    title: "Initiation",
    purpose: "Define why the project exists and whether it should proceed.",
    tools: ["Business Case", "Charter", "Stakeholders", "Scope", "Constraints", "Assumptions", "Initial RAID", "Governance Setup"],
    outputs: ["Approved project mandate", "Initial delivery scope", "Initial governance model"]
  },
  {
    slug: "planning",
    title: "Planning",
    purpose: "Convert intent into executable delivery structure.",
    tools: ["Requirements", "Product Vision", "WBS", "Epics", "Features", "Product Backlog", "Release Plan", "Sprint Planning", "Sprint Backlog", "RACI", "Budget / EVM Baseline", "Dependencies", "Comms Plan"],
    outputs: ["Product backlog", "Sprint backlog", "Delivery roadmap", "Baseline plan"]
  },
  {
    slug: "execution",
    title: "Execution",
    purpose: "Deliver the work and capture operational delivery signals.",
    tools: ["Sprint Board", "Tasks", "Blockers", "Dependencies", "Defects", "RAID Tracking", "Velocity", "Burn-down", "Sprint Review", "Sprint Retrospective"],
    outputs: ["Delivered sprint items", "Blocker history", "Retro learning", "Delivery signals"]
  },
  {
    slug: "monitoring",
    title: "Monitoring & Controlling",
    purpose: "Explain delivery health and trigger governance action.",
    tools: ["RAG", "EVM", "Governance", "Escalations", "Decision Tracking", "Change Control", "Impact Trace", "Predictability", "Audit Trail"],
    outputs: ["Governance actions", "Executive insight", "Impact trace", "Control decisions"]
  },
  {
    slug: "closure",
    title: "Closure",
    purpose: "Close the project and preserve organisational learning.",
    tools: ["Final Signoffs", "Handover", "Transition to BAU", "Benefits Review", "Final Audit", "Final Lessons Learned", "Archive"],
    outputs: ["Closure report", "Handover evidence", "Institutional learning"]
  }
];

export const deliveryGraph = [
  { type: "Business Goal", value: "Digitise complex operational workflow" },
  { type: "Capability", value: "Approval and tracking platform" },
  { type: "Epic", value: "Workflow Management" },
  { type: "Feature", value: "Approval Routing" },
  { type: "PBI", value: "As an approver, I can review and approve submitted requests." },
  { type: "Sprint Backlog", value: "Sprint 2: Approval workflow" },
  { type: "Sprint", value: "Sprint 2 completion dropped to 72%" },
  { type: "Task", value: "Build conditional approval rules" },
  { type: "Blocker", value: "Security approval matrix not confirmed" },
  { type: "Risk", value: "Approval workflow delay may impact release scope" },
  { type: "Issue", value: "Approval configuration blocked QA testing" },
  { type: "Escalation", value: "Sponsor decision required within 48 hours" },
  { type: "Decision", value: "Use interim two-level approval rule" },
  { type: "Resolution", value: "QA resumed with reduced approval scope" },
  { type: "Retro Learning", value: "Confirm approval matrix before sprint planning" },
  { type: "Future Recommendation", value: "Gate future projects: approval ownership must be complete before Sprint 1" }
];

export const roleViews = [
  ["Freelancer / Beginner", "Guided discovery, project setup, backlog generation, risk prompts"],
  ["Project Manager", "Lifecycle, RAID, governance, stakeholder, reporting and traceability"],
  ["Scrum Master", "Sprint board, blockers, velocity, retrospectives, recurrence tracking"],
  ["Product Owner", "Product backlog, epics, features, PBIs, acceptance criteria and value trace"],
  ["Portfolio Manager", "Cross-project risk, capacity, dependency drift and governance pressure"],
  ["Sponsor", "RAG, escalations, decisions required and executive delivery answer"],
  ["Auditor", "Audit trail, decision logs, approvals, evidence and closure records"]
];

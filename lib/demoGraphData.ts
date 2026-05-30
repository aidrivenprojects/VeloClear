import type { GraphNode, GraphEdge, DeliverySignal } from "@/lib/graphTypes";

const rows = [
  ["demo-01", "business_goal", "Digitise operational permit workflow", "Replace manual permits with tracked request, approval, inspection and closure.", "active", "Sponsor", "Initiation", "medium"],
  ["demo-02", "capability", "Permit lifecycle management", "Request, review, approval, execution, inspection, extension and closure.", "active", "Product Owner", "Planning", "medium"],
  ["demo-03", "epic", "Approval Workflow Engine", "Configurable approvals for PM, Security, Safety and department heads.", "in_progress", "Product Owner", "Planning", "medium"],
  ["demo-04", "feature", "Conditional approval routing", "Route permits by type, location, risk and duration.", "in_progress", "Business Analyst", "Planning", "medium"],
  ["demo-05", "pbi", "PBI-142: Approver can approve permit requests", "Approver reviews a permit and approves or rejects it with comments.", "blocked", "Developer", "Execution", "high"],
  ["demo-06", "sprint_backlog", "Sprint Backlog: Sprint 2 approval workflow", "Committed approval routing, comments, notification and SLA timer stories.", "at_risk", "Scrum Master", "Execution", "high"],
  ["demo-07", "sprint", "Sprint 2 slipped to 72% completion", "Sprint commitment was affected by unresolved approval matrix dependency.", "slipped", "Scrum Master", "Execution", "high"],
  ["demo-08", "task", "Configure department approval matrix", "Task needed confirmed department approval rules before QA testing.", "blocked", "BA + PM", "Execution", "high"],
  ["demo-09", "blocker", "Security approval matrix not confirmed", "Security and PM teams have not confirmed category approval ownership.", "open", "PM", "Execution", "high"],
  ["demo-10", "risk", "Risk: approval workflow delay may impact release", "Trigger fired after matrix remained unresolved for more than two working days.", "materialised", "Project Manager", "Risk & RAID", "red"],
  ["demo-11", "issue", "Issue: QA testing blocked", "Testing cannot proceed without confirmed decision rules.", "open", "QA Lead", "Risk & RAID", "red"],
  ["demo-12", "escalation", "Escalation Stage 2: PM + Sponsor decision required", "Sponsor must confirm whether to use interim two-level approval.", "open", "Sponsor", "Governance", "red"],
  ["demo-13", "decision", "Decision: use interim two-level approval model", "Sponsor approved interim routing while detailed matrix is finalised.", "approved", "Sponsor", "Governance", "amber"],
  ["demo-14", "resolution", "Resolution: QA resumed with reduced approval scope", "Team resumed testing, accepting a 3-day slip.", "resolved", "Delivery Lead", "Monitoring & Controlling", "amber"],
  ["demo-15", "retrospective", "Retro action: confirm approval ownership before Sprint 1", "Decision ownership must be validated before sprint commitment.", "actioned", "Scrum Master", "Execution", "medium"],
  ["demo-16", "lesson", "Lesson: approval ambiguity causes delivery slip", "Future approval-heavy projects must validate decision rights during planning.", "captured", "PMO", "Closure", "medium"],
  ["demo-17", "future_recommendation", "Future recommendation: add approval ownership gate", "Planning cannot complete until each approval stage has one accountable owner.", "active", "VeloClear Intelligence", "Intelligence", "green"]
];

export const demoGraphNodes: GraphNode[] = rows.map(([id, node_type, title, description, status, owner, phase, severity]) => ({
  id, project_id: null, node_type, title, description, status, owner, phase, severity
}));

export const demoGraphEdges: GraphEdge[] = demoGraphNodes.slice(0, -1).map((node, index) => ({
  id: `edge-${index + 1}`,
  project_id: null,
  source_node_id: node.id,
  target_node_id: demoGraphNodes[index + 1].id,
  relationship: "causes"
}));

export const demoSignals: DeliverySignal[] = [
  {
    id: "signal-01",
    project_id: null,
    node_id: "demo-09",
    signal_type: "dependency_blocker",
    severity: "high",
    title: "Dependency blocker is impacting sprint commitment",
    explanation: "The approval matrix blocker moved from planning ambiguity into execution impact.",
    recommended_action: "Escalate to sponsor and confirm interim approval rules within 48 hours.",
    status: "open"
  },
  {
    id: "signal-02",
    project_id: null,
    node_id: "demo-10",
    signal_type: "risk_triggered",
    severity: "red",
    title: "Risk trigger fired",
    explanation: "Risk was configured with a two-day trigger and created an issue.",
    recommended_action: "Open impact trace and assign owner to the issue.",
    status: "open"
  },
  {
    id: "signal-03",
    project_id: null,
    node_id: "demo-15",
    signal_type: "learning_created",
    severity: "medium",
    title: "Retrospective learning captured",
    explanation: "The team created a preventive action for future approval-heavy projects.",
    recommended_action: "Surface this lesson when a similar workflow is created.",
    status: "captured"
  }
];

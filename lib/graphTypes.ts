export type GraphNode = {
  id: string;
  project_id: string | null;
  node_type: string;
  title: string;
  description: string | null;
  status: string;
  owner: string | null;
  phase: string | null;
  severity: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
};

export type GraphEdge = {
  id: string;
  project_id: string | null;
  source_node_id: string;
  target_node_id: string;
  relationship: string;
};

export type DeliverySignal = {
  id: string;
  project_id: string | null;
  node_id: string | null;
  signal_type: string;
  severity: string;
  title: string;
  explanation: string | null;
  recommended_action: string | null;
  status: string;
  created_at?: string;
};

export const graphTypeLabels: Record<string, string> = {
  business_goal: "Business Goal",
  capability: "Capability",
  epic: "Epic",
  feature: "Feature",
  pbi: "PBI / User Story",
  sprint_backlog: "Sprint Backlog",
  sprint: "Sprint",
  task: "Task",
  blocker: "Blocker",
  risk: "Risk",
  issue: "Issue",
  escalation: "Escalation",
  decision: "Decision",
  resolution: "Resolution",
  retrospective: "Retrospective",
  lesson: "Lesson",
  future_recommendation: "Future Recommendation"
};

export const graphOrder = [
  "business_goal", "capability", "epic", "feature", "pbi", "sprint_backlog", "sprint",
  "task", "blocker", "risk", "issue", "escalation", "decision", "resolution",
  "retrospective", "lesson", "future_recommendation"
];

export type PhaseSlug = "initiation" | "planning" | "execution" | "monitoring" | "closure";

export type PhaseWorkbench = {
  slug: PhaseSlug;
  title: string;
  purpose: string;
  capture: string[];
  track: string[];
  deliverables: string[];
  risks: string[];
  governance: string[];
  intelligence: string[];
  example: string;
};

export const phaseWorkbenches: PhaseWorkbench[] = [
  {
    slug: "initiation",
    title: "Initiation",
    purpose: "Clarify the business problem, expected outcome, sponsor, users and initial scope before delivery work starts.",
    capture: ["Business problem and expected value", "Primary users and stakeholders", "Current manual process or desired future process", "Initial scope boundaries", "Sponsor and decision owners"],
    track: ["Scope clarity", "Stakeholder alignment", "Initial approval readiness", "Missing discovery inputs"],
    deliverables: ["Project charter", "Problem statement", "Stakeholder map", "Initial scope note", "Success measures"],
    risks: ["Unclear sponsor", "Weak business case", "Hidden stakeholders", "Unclear operational workflow"],
    governance: ["Confirm sponsor", "Approve discovery scope", "Define decision cadence"],
    intelligence: ["Detects vague scope", "Flags missing stakeholders", "Suggests discovery questions", "Identifies business capability gaps"],
    example: "For a tenant billing app, initiation captures who is billed, what usage is chargeable, who approves rates and what success means."
  },
  {
    slug: "planning",
    title: "Planning",
    purpose: "Turn discovery into a delivery model: workflows, capabilities, epics, stories, dependencies, milestones and sprint plan.",
    capture: ["Workflow steps", "System modules", "Epics and user stories", "Integrations and dependencies", "Sprint roadmap", "Acceptance criteria"],
    track: ["Backlog completeness", "Dependency readiness", "Milestone confidence", "Architecture and integration assumptions"],
    deliverables: ["Product backlog", "Sprint backlog", "Workflow map", "Dependency register", "Delivery roadmap"],
    risks: ["Missing requirements", "Unclear integrations", "Overloaded sprint scope", "Dependency ambiguity"],
    governance: ["Approve backlog baseline", "Confirm sprint plan", "Validate dependency owners"],
    intelligence: ["Converts discovery into epics", "Identifies missing stories", "Flags dependency overload", "Suggests sprint sequencing"],
    example: "For a permit app, planning creates epics for permit submission, approval routing, inspections, extensions and closure."
  },
  {
    slug: "execution",
    title: "Execution",
    purpose: "Track delivery work as it happens: sprints, blockers, build progress, approvals, defects and team/vendor execution.",
    capture: ["Active sprint items", "Build progress", "Blockers", "Defects", "Approval delays", "Vendor or team updates"],
    track: ["Sprint health", "Blocked stories", "Delayed approvals", "Build progress", "Testing readiness"],
    deliverables: ["Sprint board", "Blocker log", "Build status", "Defect list", "Demo readiness note"],
    risks: ["Sprint slippage", "Blocked development", "Vendor delay", "Unresolved defects"],
    governance: ["Run delivery checkpoint", "Escalate blockers", "Confirm release readiness"],
    intelligence: ["Detects delivery drift", "Connects blockers to milestones", "Flags recurring delay causes", "Suggests escalation timing"],
    example: "For tenant billing, execution tracks meter integration, billing calculation, invoice generation, payment workflow and defects."
  },
  {
    slug: "monitoring",
    title: "Monitoring & Controlling",
    purpose: "Control delivery variance through governance signals, delivery health, KPI trends, RAID movement and escalation thresholds.",
    capture: ["RAG movement", "Milestone variance", "Open decisions", "Approval SLA breaches", "Risk trend changes"],
    track: ["Governance drift", "Decision latency", "High-impact RAID clusters", "Milestone slippage", "Escalation thresholds"],
    deliverables: ["Steering update", "Executive narrative", "RAID review", "Decision log", "Control action plan"],
    risks: ["Delayed decisions", "Escalation avoidance", "Uncontrolled scope", "Repeated governance breaches"],
    governance: ["Trigger steering escalation", "Assign decision owner", "Reset delivery controls"],
    intelligence: ["Explains why delivery is slipping", "Predicts likely impact", "Shows where risk is accumulating", "Recommends governance actions"],
    example: "For a permit app, monitoring identifies approval bottlenecks, inspection failures, expired permits and closure delays."
  },
  {
    slug: "closure",
    title: "Closure",
    purpose: "Close the project properly with UAT, release handover, benefits tracking, retrospective, lessons learned and operational readiness.",
    capture: ["UAT signoff", "Release evidence", "Open residual risks", "Handover checklist", "Retrospective notes", "Lessons learned"],
    track: ["Closure readiness", "Benefits handover", "Support transition", "Residual risks", "Learning capture"],
    deliverables: ["Closure report", "Release handover", "Retrospective", "Lessons learned register", "Benefits tracking note"],
    risks: ["Incomplete handover", "Unclosed defects", "No benefit ownership", "Lost learning"],
    governance: ["Approve closure gate", "Confirm operational owner", "Archive delivery evidence"],
    intelligence: ["Finds incomplete closure evidence", "Captures reusable learning", "Links lessons to future project patterns", "Scores transition readiness"],
    example: "For any software build, closure confirms production release, support handover, lessons learned and measurable business outcome."
  }
];

export function getPhaseWorkbench(slug: string) {
  return phaseWorkbenches.find((phase) => phase.slug === slug) ?? phaseWorkbenches[0];
}

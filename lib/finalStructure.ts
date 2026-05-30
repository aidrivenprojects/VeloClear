export type PhaseSlug =
  | "initiation"
  | "planning"
  | "mobilisation"
  | "raid"
  | "stakeholders"
  | "governance"
  | "agile-delivery"
  | "intelligence";

export type ToolSlug =
  | "project-charter"
  | "business-case"
  | "project-schedule"
  | "resource-plan"
  | "wbs"
  | "kickoff-pack"
  | "sprint-zero"
  | "team-onboarding"
  | "raid-log"
  | "risk-heat-map"
  | "issue-log"
  | "stakeholder-register"
  | "power-interest-grid"
  | "engagement-matrix"
  | "raci-matrix"
  | "communications-plan"
  | "rag-dashboard"
  | "change-control"
  | "escalation-tracker"
  | "decision-rights"
  | "audit-trail"
  | "auto-reports"
  | "import-export"
  | "product-backlog"
  | "sprint-board"
  | "burndown"
  | "velocity"
  | "retrospective"
  | "impact-trace"
  | "sprint-intelligence"
  | "evm-analysis"
  | "people-capacity"
  | "integrations"
  | "new-project";

export type ToolDefinition = {
  slug: ToolSlug;
  title: string;
  purpose: string;
  captures: string[];
  connectedTo: string[];
  intelligence: string;
  sampleRecords: Array<{
    title: string;
    status: string;
    owner: string;
    signal: string;
  }>;
};

export type PhaseDefinition = {
  slug: PhaseSlug;
  number: number;
  title: string;
  purpose: string;
  question: string;
  tools: ToolDefinition[];
  outputs: string[];
};

export const finalPhases: PhaseDefinition[] = [
  {
    slug: "initiation",
    number: 1,
    title: "Initiation",
    purpose: "Define the project before work begins.",
    question: "Should we do this, what exactly are we doing, and who has authority to proceed?",
    tools: [
      {
        slug: "project-charter",
        title: "Project Charter",
        purpose: "Scope, objectives, constraints, assumptions, sponsor authority and sign-off.",
        captures: ["Objectives", "Scope", "Constraints", "Sponsor", "High-level budget", "Success criteria"],
        connectedTo: ["Business Case", "Stakeholders", "Initial RAID", "Governance"],
        intelligence: "Flags missing sponsor, unclear scope, weak success criteria and unapproved authority.",
        sampleRecords: [
          { title: "Charter approval pending", status: "amber", owner: "Sponsor", signal: "Project cannot move to planning without approval." },
          { title: "Scope boundary defined", status: "green", owner: "Project Manager", signal: "Out-of-scope items captured." }
        ]
      },
      {
        slug: "business-case",
        title: "Business Case",
        purpose: "Why this project exists, expected value, options, costs and benefits.",
        captures: ["Problem", "Expected value", "Options", "Benefits", "ROI", "Risk of doing nothing"],
        connectedTo: ["Project Charter", "EVM", "Benefits Review", "Portfolio"],
        intelligence: "Connects delivery performance back to the value hypothesis.",
        sampleRecords: [
          { title: "Manual permit approval causes delay", status: "red", owner: "Operations Sponsor", signal: "Value case depends on approval cycle reduction." },
          { title: "Expected benefit: 40% faster approvals", status: "green", owner: "PMO", signal: "Closure must validate this outcome." }
        ]
      }
    ],
    outputs: ["Approved mandate", "Business value hypothesis", "Initial stakeholders", "Initial governance and RAID"]
  },
  {
    slug: "planning",
    number: 2,
    title: "Planning",
    purpose: "Build the plan before committing to delivery.",
    question: "How are we going to do this, who does what, and what could go wrong?",
    tools: [
      {
        slug: "project-schedule",
        title: "Project Schedule / Milestones",
        purpose: "Timeline, milestone dates, dependencies and critical path.",
        captures: ["Milestones", "Start/end dates", "Critical path", "Dependency dates"],
        connectedTo: ["WBS", "Sprint Backlog", "EVM", "Risk Heat Map"],
        intelligence: "Detects schedule drift and dependency concentration before execution impact.",
        sampleRecords: [
          { title: "Approval workflow milestone", status: "amber", owner: "Delivery Lead", signal: "Linked to Sprint 2 approval backlog." }
        ]
      },
      {
        slug: "resource-plan",
        title: "Resource Plan",
        purpose: "Team capacity, roles, allocation and over-utilisation risk.",
        captures: ["Team members", "Roles", "Capacity", "Allocation", "Rates"],
        connectedTo: ["Sprint Planning", "People & Capacity", "RACI"],
        intelligence: "Flags overloaded people before capacity becomes a blocker.",
        sampleRecords: [
          { title: "Security architect over-allocated", status: "red", owner: "PM", signal: "Approval matrix task may slip." }
        ]
      },
      {
        slug: "wbs",
        title: "Work Breakdown Structure",
        purpose: "Hierarchical decomposition of scope into deliverables and work packages.",
        captures: ["Deliverables", "Work packages", "% complete", "Owners", "Status"],
        connectedTo: ["Product Backlog", "Project Schedule", "EVM"],
        intelligence: "Ensures every backlog item traces back to a planned deliverable.",
        sampleRecords: [
          { title: "Approval workflow work package", status: "amber", owner: "BA", signal: "Feeds Epic: Approval Workflow Engine." }
        ]
      }
    ],
    outputs: ["Baseline schedule", "WBS", "Resource plan", "Delivery baseline"]
  },
  {
    slug: "mobilisation",
    number: 3,
    title: "Mobilisation",
    purpose: "Align the team and prepare the delivery environment.",
    question: "Does everyone know the plan, their role, and the rules of engagement?",
    tools: [
      {
        slug: "kickoff-pack",
        title: "Kick-off Pack",
        purpose: "Shared launch pack for scope, roles, governance cadence and ways of working.",
        captures: ["Agenda", "Scope summary", "Governance rhythm", "Team rules"],
        connectedTo: ["Charter", "RACI", "Comms Plan"],
        intelligence: "Flags missing launch artefacts before execution starts.",
        sampleRecords: [{ title: "Kick-off deck ready", status: "green", owner: "PM", signal: "Team can proceed to mobilisation review." }]
      },
      {
        slug: "sprint-zero",
        title: "Sprint 0 Checklist",
        purpose: "Environment, access, tooling, backlog readiness and technical setup.",
        captures: ["Access", "Repos", "Environments", "Definition of Ready", "Tooling"],
        connectedTo: ["Product Backlog", "Sprint Board", "Dependencies"],
        intelligence: "Prevents false starts caused by missing access or setup.",
        sampleRecords: [{ title: "Approval matrix dependency unresolved", status: "red", owner: "Security Lead", signal: "Do not commit PBI-142 until ownership is confirmed." }]
      },
      {
        slug: "team-onboarding",
        title: "Team Onboarding",
        purpose: "Role clarity, responsibilities, ceremonies and delivery expectations.",
        captures: ["Team members", "Roles", "Ceremonies", "RACI walkthrough"],
        connectedTo: ["RACI", "Sprint Board", "Stakeholder Register"],
        intelligence: "Detects ownership gaps and role ambiguity.",
        sampleRecords: [{ title: "QA approval route unknown", status: "amber", owner: "QA Lead", signal: "Testing workflow needs clarification." }]
      }
    ],
    outputs: ["Readiness index", "Team alignment", "Sprint 0 closure", "Execution readiness"]
  },
  {
    slug: "raid",
    number: 4,
    title: "Risk & RAID",
    purpose: "Track risks, assumptions, issues and dependencies with trigger logic.",
    question: "What might fail, what has already failed, and what needs action now?",
    tools: [
      {
        slug: "raid-log",
        title: "RAID Log",
        purpose: "Risks, assumptions, issues and dependencies with observable triggers.",
        captures: ["Risk", "Assumption", "Issue", "Dependency", "Trigger", "Mitigation"],
        connectedTo: ["Issue Log", "Impact Trace", "RAG Dashboard"],
        intelligence: "When a trigger fires, VeloClear creates an issue and opens an impact trace.",
        sampleRecords: [{ title: "Approval matrix unresolved > 2 days", status: "red", owner: "PM", signal: "Risk trigger fired; issue created." }]
      },
      {
        slug: "risk-heat-map",
        title: "Risk Heat Map",
        purpose: "5×5 probability and impact scoring.",
        captures: ["Probability", "Impact", "Score", "Heat zone"],
        connectedTo: ["RAID Log", "RAG Dashboard", "Governance"],
        intelligence: "Highlights extreme risk clusters and recurring sources.",
        sampleRecords: [{ title: "Vendor/API approval risk", status: "red", owner: "Programme Lead", signal: "Score 15: immediate action needed." }]
      },
      {
        slug: "issue-log",
        title: "Issue Log",
        purpose: "Present-tense problems requiring immediate action.",
        captures: ["Severity", "Owner", "Due date", "Resolution", "Status"],
        connectedTo: ["Escalation Tracker", "Impact Trace", "Decision Rights"],
        intelligence: "Unresolved issues keep RAG amber or red until closed.",
        sampleRecords: [{ title: "QA blocked by approval matrix", status: "red", owner: "QA Lead", signal: "Escalate if not resolved within 48 hours." }]
      }
    ],
    outputs: ["Live RAID", "Triggered issues", "Risk heat map", "RAG impact"]
  },
  {
    slug: "stakeholders",
    number: 5,
    title: "Stakeholders",
    purpose: "Map people, power, interest, engagement, RACI and communications.",
    question: "Who can affect the project, who is affected, and how should they be managed?",
    tools: [
      {
        slug: "stakeholder-register",
        title: "Stakeholder Register",
        purpose: "Everyone who affects or is affected by the project.",
        captures: ["Name", "Role", "Organisation", "Power", "Interest", "Sentiment"],
        connectedTo: ["Power-Interest Grid", "Engagement Matrix", "Comms Plan"],
        intelligence: "Sentiment and influence shifts create governance signals.",
        sampleRecords: [{ title: "Safety Head moved to resistant", status: "amber", owner: "PM", signal: "Comms action required before steering." }]
      },
      {
        slug: "power-interest-grid",
        title: "Power-Interest Grid",
        purpose: "Manage closely, keep satisfied, keep informed, or monitor.",
        captures: ["Power", "Interest", "Quadrant", "Strategy"],
        connectedTo: ["Stakeholder Register", "Comms Plan"],
        intelligence: "Auto-selects engagement strategy from stakeholder position.",
        sampleRecords: [{ title: "Sponsor: manage closely", status: "green", owner: "PM", signal: "Weekly decision briefing needed." }]
      },
      {
        slug: "engagement-matrix",
        title: "Engagement Matrix",
        purpose: "Track actual vs desired engagement over time.",
        captures: ["Current engagement", "Desired engagement", "Gap", "Action"],
        connectedTo: ["Comms Plan", "Governance"],
        intelligence: "Engagement gaps trigger communication actions.",
        sampleRecords: [{ title: "Security lead engagement gap", status: "amber", owner: "PM", signal: "Schedule stakeholder intervention." }]
      },
      {
        slug: "raci-matrix",
        title: "RACI Matrix",
        purpose: "Responsible, accountable, consulted and informed for key activities.",
        captures: ["Activity", "Responsible", "Accountable", "Consulted", "Informed"],
        connectedTo: ["Decision Rights", "Resource Plan", "Sprint 0"],
        intelligence: "Flags decisions with no accountable owner or too many owners.",
        sampleRecords: [{ title: "Approval matrix has no accountable owner", status: "red", owner: "PM", signal: "Decision-right risk created." }]
      },
      {
        slug: "communications-plan",
        title: "Communications Plan",
        purpose: "Audience, frequency, channel, owner and success measure.",
        captures: ["Audience", "Channel", "Frequency", "Owner", "Message"],
        connectedTo: ["Stakeholder Register", "Auto Reports"],
        intelligence: "Ensures sponsors receive decision summaries, not sprint details.",
        sampleRecords: [{ title: "Sponsor escalation email due", status: "amber", owner: "PM", signal: "Escalation SLA approaching." }]
      }
    ],
    outputs: ["Stakeholder strategy", "RACI clarity", "Communication plan", "Engagement actions"]
  },
  {
    slug: "governance",
    number: 6,
    title: "Governance",
    purpose: "Control RAG, change, escalation, decisions, audit and reporting.",
    question: "What decision is needed, who owns it, and what evidence proves control?",
    tools: [
      {
        slug: "rag-dashboard",
        title: "RAG Dashboard",
        purpose: "Traffic-light project and portfolio status.",
        captures: ["RAG", "CPI", "SPI", "Budget", "Sprint progress"],
        connectedTo: ["RAID", "EVM", "Auto Reports"],
        intelligence: "RAG changes are derived from issues, delivery signals and governance latency.",
        sampleRecords: [{ title: "Project RAG moved to red", status: "red", owner: "PMO", signal: "Approval blocker triggered release risk." }]
      },
      {
        slug: "change-control",
        title: "Change Control",
        purpose: "Formal control for scope, time and cost changes.",
        captures: ["CR title", "Impact", "Priority", "CCB decision", "Status"],
        connectedTo: ["Decision Rights", "Audit Trail", "EVM"],
        intelligence: "No verbal approvals; every material change becomes traceable.",
        sampleRecords: [{ title: "CR-004: interim approval scope", status: "amber", owner: "CCB", signal: "Decision needed before release plan update." }]
      },
      {
        slug: "escalation-tracker",
        title: "Escalation Tracker",
        purpose: "Open escalations, decision owner and required decision date.",
        captures: ["Escalation", "Owner", "Decision needed", "Due date"],
        connectedTo: ["Issue Log", "Decision Rights", "Impact Trace"],
        intelligence: "Escalation ageing becomes governance latency.",
        sampleRecords: [{ title: "Sponsor approval overdue", status: "red", owner: "Sponsor", signal: "Governance delay is now delivery risk." }]
      },
      {
        slug: "decision-rights",
        title: "Decision Rights",
        purpose: "Defines who can decide what without escalation.",
        captures: ["Decision type", "Authority", "Threshold", "Escalation path"],
        connectedTo: ["RACI", "Change Control", "Audit Trail"],
        intelligence: "Prevents waiting for approvals the PM already has authority to make.",
        sampleRecords: [{ title: "PM can approve minor workflow change", status: "green", owner: "PMO", signal: "No steering escalation required." }]
      },
      {
        slug: "audit-trail",
        title: "Audit Trail",
        purpose: "Timestamped evidence of changes, decisions and approvals.",
        captures: ["User", "Timestamp", "Object", "Change", "Reason"],
        connectedTo: ["Change Control", "RAG", "Reports"],
        intelligence: "Creates compliance evidence without manual reconstruction.",
        sampleRecords: [{ title: "Risk R001 converted to Issue I001", status: "green", owner: "System", signal: "Automatic trigger recorded." }]
      },
      {
        slug: "auto-reports",
        title: "Auto Reports",
        purpose: "Role-specific reports for PM, sponsor, steering and auditor.",
        captures: ["Audience", "Metrics", "Narrative", "Evidence"],
        connectedTo: ["RAG", "EVM", "Audit Trail"],
        intelligence: "Generates delivery answer from connected data instead of manual narrative.",
        sampleRecords: [{ title: "Sponsor one-pager generated", status: "green", owner: "VeloClear", signal: "Includes decision required." }]
      },
      {
        slug: "import-export",
        title: "Import / Export",
        purpose: "Move data in and out for adoption and stakeholder sharing.",
        captures: ["Source", "Mapping", "Export format", "Import status"],
        connectedTo: ["Integrations", "Reports"],
        intelligence: "Preserves traceability when importing from spreadsheets or external tools.",
        sampleRecords: [{ title: "Excel RAID import ready", status: "amber", owner: "PM", signal: "Mapping review required." }]
      }
    ],
    outputs: ["Governance control", "Decisions", "Escalations", "Reports", "Audit evidence"]
  },
  {
    slug: "agile-delivery",
    number: 7,
    title: "Agile Delivery",
    purpose: "Run product backlog, sprint execution, flow metrics and retrospectives.",
    question: "What are we delivering this sprint, what is blocked, and what did we learn?",
    tools: [
      {
        slug: "product-backlog",
        title: "Product Backlog",
        purpose: "Epics, features, user stories, priority, points and acceptance criteria.",
        captures: ["Epic", "Feature", "PBI", "Story points", "Priority", "Acceptance criteria"],
        connectedTo: ["WBS", "Sprint Board", "RAID"],
        intelligence: "Unready or dependency-heavy PBIs are blocked before sprint commitment.",
        sampleRecords: [{ title: "PBI-142 approval review", status: "blocked", owner: "PO", signal: "Depends on approval matrix." }]
      },
      {
        slug: "sprint-board",
        title: "Sprint Board",
        purpose: "To Do / In Progress / Done with blockers and owners.",
        captures: ["Sprint item", "Owner", "Status", "Blocker", "Points"],
        connectedTo: ["Product Backlog", "RAID", "Burndown"],
        intelligence: "Blocked cards update RAID and impact trace.",
        sampleRecords: [{ title: "Approval routing card blocked", status: "red", owner: "Developer", signal: "Blocker created." }]
      },
      {
        slug: "burndown",
        title: "Burndown",
        purpose: "Remaining story points vs ideal line.",
        captures: ["Remaining points", "Day", "Ideal line", "Actual line"],
        connectedTo: ["Sprint Board", "Sprint Intelligence"],
        intelligence: "Shows whether sprint is heading for slip before sprint close.",
        sampleRecords: [{ title: "Burndown above ideal line", status: "amber", owner: "Scrum Master", signal: "Sprint completion risk rising." }]
      },
      {
        slug: "velocity",
        title: "Velocity",
        purpose: "Sprint-by-sprint completed points and capacity trend.",
        captures: ["Completed points", "Committed points", "Trend", "Predictability"],
        connectedTo: ["Sprint Planning", "EVM", "People & Capacity"],
        intelligence: "Velocity decline becomes early delivery signal.",
        sampleRecords: [{ title: "Velocity dropped 18%", status: "amber", owner: "Scrum Master", signal: "Capacity or blocker pattern detected." }]
      },
      {
        slug: "retrospective",
        title: "Retrospective",
        purpose: "What went well, what to improve and action items.",
        captures: ["Went well", "Improve", "Actions", "Owner", "Due date"],
        connectedTo: ["Learning Library", "Impact Trace", "Future Recommendation"],
        intelligence: "Retro actions carry forward and are checked for recurrence.",
        sampleRecords: [{ title: "Confirm approval ownership before sprint commitment", status: "green", owner: "Scrum Master", signal: "Future prevention rule created." }]
      }
    ],
    outputs: ["Backlog clarity", "Sprint health", "Velocity trend", "Retro learning"]
  },
  {
    slug: "intelligence",
    number: 8,
    title: "Intelligence",
    purpose: "Explain what is happening, why, what happens next and what action is needed.",
    question: "Where is delivery risk accumulating and what should governance do now?",
    tools: [
      {
        slug: "impact-trace",
        title: "Impact Trace",
        purpose: "Blocker → risk → issue → escalation → decision → resolution → learning.",
        captures: ["Cause", "Propagation", "Decision", "Resolution", "Learning"],
        connectedTo: ["RAID", "Sprint Board", "Governance"],
        intelligence: "Single source of accountability and institutional memory.",
        sampleRecords: [{ title: "Approval blocker trace", status: "red", owner: "VeloClear", signal: "Open trace chain." }]
      },
      {
        slug: "sprint-intelligence",
        title: "Sprint Intelligence",
        purpose: "Velocity trends, blocker frequency and green-wash detection.",
        captures: ["Velocity", "Completion", "Blockers", "Carry-forward", "Sentiment"],
        connectedTo: ["Burndown", "Retrospective", "People & Capacity"],
        intelligence: "Shows which sprints were genuinely healthy and which were masked.",
        sampleRecords: [{ title: "Sprint 2 green-wash risk", status: "amber", owner: "Scrum Master", signal: "Completion low despite optimistic status." }]
      },
      {
        slug: "evm-analysis",
        title: "EVM Analysis",
        purpose: "PV, EV, AC, CPI, SPI, CV, SV and EAC.",
        captures: ["PV", "EV", "AC", "CPI", "SPI", "EAC"],
        connectedTo: ["RAG Dashboard", "Delivery Answer", "Portfolio"],
        intelligence: "Calculates whether project can still finish on time and budget.",
        sampleRecords: [{ title: "SPI below threshold", status: "red", owner: "PMO", signal: "Schedule efficiency is now a governance issue." }]
      },
      {
        slug: "people-capacity",
        title: "People & Capacity",
        purpose: "Utilisation, assignments, capacity and role risk.",
        captures: ["Person", "Capacity", "Assignment", "Utilisation", "Risk"],
        connectedTo: ["Resource Plan", "Sprint Board", "Risk Heat Map"],
        intelligence: "Over-allocation becomes a delivery risk before it becomes a blocker.",
        sampleRecords: [{ title: "Security lead at 140%", status: "red", owner: "PM", signal: "Approval workstream at risk." }]
      },
      {
        slug: "integrations",
        title: "Integrations",
        purpose: "Connect Jira, Azure DevOps, Slack, Teams and external tools.",
        captures: ["Tool", "Sync status", "Mapping", "Imported objects"],
        connectedTo: ["Import / Export", "Sprint Board", "Reports"],
        intelligence: "Keeps VeloClear as the intelligence layer without duplicate maintenance.",
        sampleRecords: [{ title: "Jira sync placeholder", status: "amber", owner: "Admin", signal: "Connector implementation pending." }]
      },
      {
        slug: "new-project",
        title: "New Project",
        purpose: "Guided wizard that creates lifecycle, RAID, stakeholders, governance and sprint structures.",
        captures: ["Project type", "Workflow", "Roles", "Approvals", "Risk drivers", "Methodology"],
        connectedTo: ["All phases", "Templates", "Delivery Graph"],
        intelligence: "Turns what is in the user's head into a structured project operating model.",
        sampleRecords: [{ title: "34-question discovery wizard", status: "green", owner: "VeloClear", signal: "Creates initial delivery graph." }]
      }
    ],
    outputs: ["Impact trace", "Delivery answer", "Learning memory", "Future recommendations"]
  }
];

export function getPhase(slug: string) {
  return finalPhases.find((phase) => phase.slug === slug) ?? finalPhases[0];
}

export function getTool(phaseSlug: string, toolSlug: string) {
  const phase = getPhase(phaseSlug);
  return phase.tools.find((tool) => tool.slug === toolSlug) ?? phase.tools[0];
}

export const canonicalTrace = [
  "Business Case",
  "Charter",
  "WBS",
  "Product Backlog",
  "PBI",
  "Sprint Backlog",
  "Sprint Board",
  "Blocker",
  "Risk Trigger",
  "Issue",
  "Escalation",
  "Decision",
  "Resolution",
  "Retrospective",
  "Learning",
  "Future Recommendation"
];

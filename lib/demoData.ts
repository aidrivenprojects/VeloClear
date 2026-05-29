import type { IntentRole } from "./types";

export const appNav = [
  ["Home", "/dashboard", "Dashboard"],
  ["Home", "/blueprint", "System Blueprint"],
  ["Home", "/delivery-graph", "Delivery Graph"],
  ["Start", "/discover", "Discovery"],
  ["Portfolio", "/projects", "Projects"],
  ["Lifecycle", "/lifecycle/initiation", "Initiation"],
  ["Lifecycle", "/lifecycle/planning", "Planning"],
  ["Lifecycle", "/lifecycle/execution", "Execution"],
  ["Lifecycle", "/lifecycle/monitoring", "Monitoring"],
  ["Lifecycle", "/lifecycle/closure", "Closure"],
  ["PM Toolkit", "/toolkit/charter", "Charter"],
  ["PM Toolkit", "/toolkit/wbs", "WBS"],
  ["PM Toolkit", "/toolkit/backlog", "Product Backlog"],
  ["PM Toolkit", "/toolkit/sprints", "Sprint Backlog"],
  ["PM Toolkit", "/toolkit/raid", "RAID"],
  ["PM Toolkit", "/toolkit/stakeholders", "Stakeholders"],
  ["PM Toolkit", "/toolkit/governance", "Governance"],
  ["PM Toolkit", "/toolkit/evm", "EVM"],
  ["PM Toolkit", "/toolkit/impact-trace", "Impact Trace"],
  ["PM Toolkit", "/toolkit/learning", "Learning"],
  ["PM Toolkit", "/toolkit/reports", "Reports"],
  ["PM Toolkit", "/toolkit/capacity", "Capacity"],
  ["Platform", "/integrations", "Integrations"]
] as const;

export const connectors = ["Microsoft Project", "Jira", "Azure DevOps", "Smartsheet", "Excel", "ServiceNow", "Power BI", "Asana"];

export const intentRoles: IntentRole[] = [
  {
    id: "newpm",
    role: "New PM",
    title: "I need help structuring and running a project",
    description: "Use discovery to turn an idea into workflows, backlog, sprints, risks and governance.",
    preview: "Discovery · Backlog · Sprints"
  },
  {
    id: "pm",
    role: "Project Manager",
    title: "I need visibility into delivery risk and execution",
    description: "Focus on lifecycle progress, blockers, RAID, governance and delivery confidence.",
    preview: "Lifecycle · RAID · Governance"
  },
  {
    id: "programme",
    role: "Programme Manager",
    title: "I need to coordinate dependencies across teams",
    description: "See cross-team dependencies, milestones, vendors and cross-team blockers.",
    preview: "Dependencies · Sprints"
  },
  {
    id: "portfolio",
    role: "Portfolio Lead",
    title: "I need portfolio-level intelligence and trends",
    description: "Prioritise portfolio health, systemic risk, patterns and executive decisions.",
    preview: "Health · Patterns · Reports"
  },
  {
    id: "sponsor",
    role: "Sponsor",
    title: "I need concise delivery insights and decisions",
    description: "Read executive-grade narratives, decisions required, escalations and commercial impact.",
    preview: "Narratives · Decisions"
  },
  {
    id: "team",
    role: "Delivery Team",
    title: "I need visibility into sprint work and blockers",
    description: "See current sprint work, ownership, blockers and dependencies without PMO noise.",
    preview: "Sprint · Blockers"
  }
];

export const demoProjects = [
  ["Apex Mobile Platform", "AMBER", "Vendor API milestone slipped; fallback plan active.", "amber"],
  ["Nexus Compliance", "GREEN", "Controls mapping completed ahead of steering review.", "green"],
  ["Meridian Training", "RED", "Capacity gap causing rollout delay; sponsor decision needed.", "red"],
  ["Orion Data Migration", "GREEN", "Cutover rehearsal passed with minor defects.", "green"]
] as const;

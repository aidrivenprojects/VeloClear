import type { IntentRole } from "./types";

export const appNav = [
  ["Home", "/dashboard", "Dashboard"],
  ["Portfolio", "/projects", "Projects"],
  ["Start", "/projects/new", "Guided Setup"],
  ["Delivery", "/raid", "RAID"],
  ["Intelligence", "/impact-trace", "Impact Trace"],
  ["Platform", "/integrations", "Integrations"]
] as const;

export const connectors = ["Microsoft Project", "Jira", "Azure DevOps", "Smartsheet", "Excel", "ServiceNow"];

export const intentRoles: IntentRole[] = [
  {
    id: "newpm",
    role: "New PM",
    title: "I need help structuring and running a project",
    description: "Generate phases, risks, stakeholders, governance and a starter delivery rhythm automatically.",
    preview: "RAID · Timeline · Stakeholders"
  },
  {
    id: "pm",
    role: "Project Manager",
    title: "I need visibility into delivery risk and execution",
    description: "Focus on RAID, blockers, sprint health, RAG and active mitigation actions.",
    preview: "Risks · Issues · Sprint"
  },
  {
    id: "programme",
    role: "Programme Manager",
    title: "I need to coordinate dependencies across teams",
    description: "See cross-team dependencies, milestones, vendors and cross-team blockers.",
    preview: "Timeline · Dependencies"
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
    id: "scrum",
    role: "Delivery Team",
    title: "I need visibility into sprint work and blockers",
    description: "See current sprint work, ownership, blockers and dependencies without PMO noise.",
    preview: "Sprint · Blockers"
  }
];

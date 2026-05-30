"use client";

export type Project = {
  id: string;
  name: string;
  programme: string;
  methodology: string;
  summary: string;
  health: "green" | "amber" | "red";
  createdAt: string;
};

export type RecordItem = {
  id: string;
  projectId: string;
  phaseSlug: string;
  toolSlug: string;
  type: string;
  title: string;
  description: string;
  status: string;
  severity: "green" | "amber" | "red";
  owner: string;
};

export type Relationship = {
  id: string;
  projectId: string;
  sourceId: string;
  targetId: string;
  type: string;
};

export type AuditEvent = {
  id: string;
  projectId: string;
  action: string;
  entity: string;
  entityTitle: string;
  timestamp: string;
  actor: string;
};

const KEYS = {
  projects: "vc.complete.projects",
  records: "vc.complete.records",
  relationships: "vc.complete.relationships",
  audit: "vc.complete.audit"
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value));
}

export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || `project-${Date.now()}`;
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function audit(projectId: string, action: string, entity: string, entityTitle: string) {
  const events = read<AuditEvent[]>(KEYS.audit, []);
  write(KEYS.audit, [
    {
      id: uid("audit"),
      projectId,
      action,
      entity,
      entityTitle,
      timestamp: new Date().toISOString(),
      actor: "Current User"
    },
    ...events
  ]);
}

export function ensureSeed() {
  const projects = read<Project[]>(KEYS.projects, []);
  if (projects.length) return;

  const project: Project = {
    id: "facility-permit-system",
    name: "Facility Permit System",
    programme: "Operational Workflow Digitisation",
    methodology: "Hybrid",
    summary: "Digitise permit request, approval, inspection, extension and closure.",
    health: "amber",
    createdAt: new Date().toISOString()
  };
  write(KEYS.projects, [project]);
  generateProjectRecords(project);
}

export function resetDemo() {
  if (typeof window === "undefined") return;
  Object.values(KEYS).forEach((key) => window.localStorage.removeItem(key));
  ensureSeed();
}

export function listProjects() {
  ensureSeed();
  return read<Project[]>(KEYS.projects, []);
}

export function getProject(projectId: string) {
  ensureSeed();
  return listProjects().find((project) => project.id === projectId) || listProjects()[0];
}

export function createProject(input: { name: string; programme: string; methodology: string; summary: string }) {
  const project: Project = {
    id: slugify(input.name),
    name: input.name,
    programme: input.programme,
    methodology: input.methodology,
    summary: input.summary,
    health: "amber",
    createdAt: new Date().toISOString()
  };

  const projects = listProjects().filter((item) => item.id !== project.id);
  write(KEYS.projects, [project, ...projects]);
  generateProjectRecords(project);
  audit(project.id, "created", "Project", project.name);
  return project;
}

export function generateProjectRecords(project: Project) {
  const existing = read<RecordItem[]>(KEYS.records, []).filter((item) => item.projectId !== project.id);
  const records: RecordItem[] = [
    rec(project, "initiation", "business-case", "Business Case", `Business value for ${project.name}`, project.summary, "approved", "green", "Sponsor"),
    rec(project, "initiation", "charter", "Charter", `${project.name} charter`, "Scope, authority, success criteria and sign-off.", "approved", "green", "Sponsor"),
    rec(project, "initiation", "scope", "Scope", "Initial project scope", "In scope, out of scope, assumptions and constraints.", "approved", "green", "Project Manager"),
    rec(project, "stakeholders", "stakeholder-register", "Stakeholder", "Sponsor and delivery stakeholders", "Initial stakeholder map and ownership model.", "open", "amber", "Project Manager"),
    rec(project, "planning", "wbs", "WBS", "Delivery work breakdown", "Core work packages decomposed from the charter.", "in progress", "amber", "Project Manager"),
    rec(project, "planning", "product-backlog", "PBI", "PBI-001: Define core workflow", "Primary user story generated from project discovery.", "ready", "green", "Product Owner"),
    rec(project, "planning", "sprint-backlog", "Sprint Backlog Item", "Sprint 1: workflow foundation", "Committed delivery work selected from product backlog.", "at risk", "amber", "Scrum Master"),
    rec(project, "mobilisation", "sprint-zero", "Sprint 0", "Environment and access readiness", "Access, tools and onboarding required before sprint execution.", "open", "amber", "Scrum Master"),
    rec(project, "agile-delivery", "sprint-board", "Sprint Card", "Build core workflow screen", "Execution card under delivery.", "in progress", "amber", "Developer"),
    rec(project, "raid", "raid-log", "Risk", "Decision ownership may delay delivery", "Risk trigger if decision owner is not confirmed.", "open", "amber", "Project Manager"),
    rec(project, "raid", "issue-log", "Issue", "Potential blocker needs monitoring", "Issue record generated from active delivery risk.", "watching", "amber", "Delivery Lead"),
    rec(project, "governance", "escalation-tracker", "Escalation", "Sponsor decision path", "Escalation path configured for blocked decisions.", "open", "amber", "Sponsor"),
    rec(project, "governance", "decision-rights", "Decision", "Decision rights matrix", "Defines who can approve scope, schedule and budget impact.", "draft", "amber", "PMO"),
    rec(project, "agile-delivery", "retrospective", "Retrospective Action", "Capture delivery learning", "Learning loop for future prevention.", "open", "green", "Scrum Master"),
    rec(project, "intelligence", "impact-trace", "Impact Trace", "Initial trace chain", "Business case to learning trace generated automatically.", "active", "green", "VeloClear"),
    rec(project, "intelligence", "delivery-graph", "Delivery Graph", "Connected delivery graph", "Graph view of record relationships, causes and effects.", "active", "green", "VeloClear")
  ];

  const relationships = records.slice(0, -1).map((record, index) => ({
    id: uid("rel"),
    projectId: project.id,
    sourceId: record.id,
    targetId: records[index + 1].id,
    type: [
      "AUTHORIZES",
      "DEFINES_SCOPE",
      "IDENTIFIES_STAKEHOLDER",
      "DECOMPOSES_TO",
      "GENERATES",
      "SELECTED_INTO",
      "MOBILISES",
      "EXECUTED_AS",
      "TRIGGERS",
      "CREATES",
      "ESCALATES_TO",
      "REQUIRES_DECISION",
      "FEEDS_RETRO",
      "CREATES_LEARNING",
      "VISUALISED_IN"
    ][index] || "RELATES_TO"
  }));

  write(KEYS.records, [...existing, ...records]);
  write(KEYS.relationships, [...read<Relationship[]>(KEYS.relationships, []).filter((item) => item.projectId !== project.id), ...relationships]);
}

function rec(project: Project, phaseSlug: string, toolSlug: string, type: string, title: string, description: string, status: string, severity: "green" | "amber" | "red", owner: string): RecordItem {
  return {
    id: uid("record"),
    projectId: project.id,
    phaseSlug,
    toolSlug,
    type,
    title,
    description,
    status,
    severity,
    owner
  };
}

export function recordsForProject(projectId: string) {
  ensureSeed();
  return read<RecordItem[]>(KEYS.records, []).filter((record) => record.projectId === projectId);
}

export function relationshipsForProject(projectId: string) {
  ensureSeed();
  return read<Relationship[]>(KEYS.relationships, []).filter((rel) => rel.projectId === projectId);
}

export function auditForProject(projectId: string) {
  ensureSeed();
  return read<AuditEvent[]>(KEYS.audit, []).filter((event) => event.projectId === projectId);
}

export function recordsForTool(projectId: string, phaseSlug: string, toolSlug: string) {
  return recordsForProject(projectId).filter((record) => record.phaseSlug === phaseSlug && record.toolSlug === toolSlug);
}

export function addRecord(projectId: string, phaseSlug: string, toolSlug: string, title: string, description: string) {
  const records = read<RecordItem[]>(KEYS.records, []);
  const record: RecordItem = {
    id: uid("record"),
    projectId,
    phaseSlug,
    toolSlug,
    type: toolSlug.replace(/-/g, " "),
    title,
    description,
    status: "open",
    severity: "amber",
    owner: "Project Team"
  };
  write(KEYS.records, [record, ...records]);
  audit(projectId, "created", record.type, record.title);
  recalculateHealth(projectId);
}

export function updateRecord(projectId: string, recordId: string, severity: "green" | "amber" | "red") {
  const records = read<RecordItem[]>(KEYS.records, []);
  let changed: RecordItem | undefined;
  const next = records.map((record) => {
    if (record.id !== recordId) return record;
    changed = {
      ...record,
      severity,
      status: severity === "green" ? "closed" : severity === "red" ? "blocked" : "open"
    };
    return changed;
  });
  write(KEYS.records, next);
  if (changed) audit(projectId, "status changed", changed.type, changed.title);
  recalculateHealth(projectId);
}

export function recalculateHealth(projectId: string) {
  const projects = listProjects();
  const records = recordsForProject(projectId);
  const health = records.some((record) => record.severity === "red") ? "red" : records.some((record) => record.severity === "amber") ? "amber" : "green";
  write(KEYS.projects, projects.map((project) => project.id === projectId ? { ...project, health } : project));
}

export function signals(projectId: string) {
  const records = recordsForProject(projectId);
  const red = records.filter((record) => record.severity === "red" || record.status === "blocked");
  const amber = records.filter((record) => record.severity === "amber");
  const output = red.map((record) => ({
    title: `${record.type} needs attention`,
    explanation: `${record.title} is ${record.status}.`,
    recommendation: `Review ${record.phaseSlug}/${record.toolSlug} and assign governance action.`,
    severity: "red" as const
  }));

  if (amber.length >= 3) {
    output.push({
      title: "Amber concentration detected",
      explanation: `${amber.length} amber records are accumulating.`,
      recommendation: "Run RAID and governance review before the next steering checkpoint.",
      severity: "amber" as const
    });
  }

  return output;
}

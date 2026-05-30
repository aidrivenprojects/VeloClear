"use client";

import { projectPhases } from "@/lib/projectOperatingModel";

export type FunctionalProject = {
  id: string;
  name: string;
  programme: string;
  methodology: string;
  summary: string;
  health: "green" | "amber" | "red";
  createdAt: string;
};

export type FunctionalObject = {
  id: string;
  projectId: string;
  phaseSlug: string;
  toolSlug: string;
  objectType: string;
  title: string;
  description: string;
  status: string;
  owner: string;
  severity: "green" | "amber" | "red";
};

export type FunctionalRelation = {
  id: string;
  projectId: string;
  sourceId: string;
  targetId: string;
  relationship: string;
};

export type FunctionalSignal = {
  id: string;
  projectId: string;
  sourceId: string;
  title: string;
  explanation: string;
  recommendation: string;
  severity: "green" | "amber" | "red";
};

export type FunctionalLearning = {
  id: string;
  projectId: string;
  title: string;
  lesson: string;
  recommendation: string;
};

const PROJECTS_KEY = "veloclear.functional.projects";
const OBJECTS_KEY = "veloclear.functional.objects";
const RELATIONS_KEY = "veloclear.functional.relations";
const SIGNALS_KEY = "veloclear.functional.signals";
const LEARNING_KEY = "veloclear.functional.learning";

function safeParse<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || `project-${Date.now()}`;
}

export function getProjects(): FunctionalProject[] {
  const existing = safeParse<FunctionalProject[]>(PROJECTS_KEY, []);
  if (existing.length) return existing;
  const seeded: FunctionalProject[] = [
    {
      id: "facility-permit-system",
      name: "Facility Permit System",
      programme: "Operational Workflow Digitisation",
      methodology: "Hybrid",
      summary: "Digitise permit request, approval, inspection, extension and closure.",
      health: "amber",
      createdAt: new Date().toISOString()
    },
    {
      id: "tenant-billing-platform",
      name: "Tenant Billing Platform",
      programme: "Smart Building Operations",
      methodology: "Hybrid",
      summary: "Track tenant common-space and electricity usage for billing.",
      health: "green",
      createdAt: new Date().toISOString()
    }
  ];
  save(PROJECTS_KEY, seeded);
  seeded.forEach((project) => ensureProjectOperatingData(project));
  return seeded;
}

export function getProject(projectId: string) {
  return getProjects().find((project) => project.id === projectId) ?? getProjects()[0];
}

export function upsertProject(project: FunctionalProject) {
  const projects = getProjects();
  const next = [project, ...projects.filter((item) => item.id !== project.id)];
  save(PROJECTS_KEY, next);
  ensureProjectOperatingData(project);
  return project;
}

export function getObjects(projectId: string): FunctionalObject[] {
  getProjects();
  return safeParse<FunctionalObject[]>(OBJECTS_KEY, []).filter((item) => item.projectId === projectId);
}

export function getRelations(projectId: string): FunctionalRelation[] {
  getProjects();
  return safeParse<FunctionalRelation[]>(RELATIONS_KEY, []).filter((item) => item.projectId === projectId);
}

export function getSignals(projectId: string): FunctionalSignal[] {
  getProjects();
  return safeParse<FunctionalSignal[]>(SIGNALS_KEY, []).filter((item) => item.projectId === projectId);
}

export function getLearning(projectId: string): FunctionalLearning[] {
  getProjects();
  return safeParse<FunctionalLearning[]>(LEARNING_KEY, []).filter((item) => item.projectId === projectId);
}

export function getObjectsForTool(projectId: string, phaseSlug: string, toolSlug: string) {
  return getObjects(projectId).filter((item) => item.phaseSlug === phaseSlug && item.toolSlug === toolSlug);
}

export function updateObjectStatus(projectId: string, objectId: string, status: string, severity: "green" | "amber" | "red") {
  const all = safeParse<FunctionalObject[]>(OBJECTS_KEY, []);
  const next = all.map((item) => item.id === objectId ? { ...item, status, severity } : item);
  save(OBJECTS_KEY, next);
  recalculateProjectHealth(projectId);
}

export function addObject(projectId: string, phaseSlug: string, toolSlug: string, title: string, description: string) {
  const all = safeParse<FunctionalObject[]>(OBJECTS_KEY, []);
  const obj: FunctionalObject = {
    id: `${projectId}-${phaseSlug}-${toolSlug}-${Date.now()}`,
    projectId,
    phaseSlug,
    toolSlug,
    objectType: toolSlug.replace(/-/g, " "),
    title,
    description,
    status: "open",
    owner: "Project Team",
    severity: "amber"
  };
  save(OBJECTS_KEY, [obj, ...all]);
  recalculateSignals(projectId);
  recalculateProjectHealth(projectId);
  return obj;
}

export function ensureProjectOperatingData(project: FunctionalProject) {
  const objects = safeParse<FunctionalObject[]>(OBJECTS_KEY, []);
  if (objects.some((item) => item.projectId === project.id)) return;

  const created: FunctionalObject[] = [
    obj(project, "initiation", "business-case", "Business Case", `Business value for ${project.name}`, project.summary, "approved", "Sponsor", "green"),
    obj(project, "initiation", "charter", "Charter", `${project.name} charter`, "Scope, authority and success criteria established.", "approved", "Project Sponsor", "green"),
    obj(project, "planning", "wbs", "WBS", "Delivery work breakdown", "Core deliverables decomposed into work packages.", "in_progress", "Project Manager", "amber"),
    obj(project, "planning", "product-backlog", "PBI", "PBI-001: Define core workflow", "Primary user story generated from discovery.", "ready", "Product Owner", "green"),
    obj(project, "planning", "sprint-backlog", "Sprint Backlog Item", "Sprint 1: workflow foundation", "Committed sprint work selected from Product Backlog.", "at_risk", "Scrum Master", "amber"),
    obj(project, "agile-delivery", "sprint-board", "Sprint Card", "Build approval/workflow screen", "Delivery card currently under execution.", "in_progress", "Developer", "amber"),
    obj(project, "raid", "raid-log", "Risk", "Decision ownership may delay delivery", "Risk trigger if approval owner is not confirmed within two days.", "open", "Project Manager", "amber"),
    obj(project, "raid", "issue-log", "Issue", "Unresolved decision blocks progress", "Issue created when risk trigger fires.", project.health === "red" ? "open" : "watching", "Delivery Lead", project.health === "red" ? "red" : "amber"),
    obj(project, "governance", "escalation-tracker", "Escalation", "Sponsor decision required", "Escalation path for blocked delivery decision.", "open", "Sponsor", project.health === "red" ? "red" : "amber"),
    obj(project, "governance", "decision-rights", "Decision", "Define decision rights", "Clarifies who can approve workflow changes.", "pending", "PMO", "amber"),
    obj(project, "agile-delivery", "retrospective", "Retrospective Action", "Capture delivery learning", "Learning loop created for future prevention.", "open", "Scrum Master", "green"),
    obj(project, "intelligence", "impact-trace", "Impact Trace", "Initial trace chain", "Business case to learning trace generated automatically.", "active", "VeloClear", "green")
  ];

  const relations: FunctionalRelation[] = created.slice(0, -1).map((item, index) => ({
    id: `${project.id}-rel-${index + 1}`,
    projectId: project.id,
    sourceId: item.id,
    targetId: created[index + 1].id,
    relationship: [
      "AUTHORIZES",
      "DECOMPOSES_TO",
      "GENERATES",
      "SELECTED_INTO",
      "EXECUTED_AS",
      "TRIGGERS",
      "CREATES",
      "ESCALATES_TO",
      "REQUIRES",
      "FEEDS_RETRO",
      "CREATES_LEARNING"
    ][index] ?? "RELATES_TO"
  }));

  save(OBJECTS_KEY, [...objects, ...created]);
  save(RELATIONS_KEY, [...safeParse<FunctionalRelation[]>(RELATIONS_KEY, []), ...relations]);
  recalculateSignals(project.id);
  recalculateProjectHealth(project.id);
}

function obj(project: FunctionalProject, phaseSlug: string, toolSlug: string, objectType: string, title: string, description: string, status: string, owner: string, severity: "green" | "amber" | "red"): FunctionalObject {
  return {
    id: `${project.id}-${phaseSlug}-${toolSlug}-${slugify(title)}`,
    projectId: project.id,
    phaseSlug,
    toolSlug,
    objectType,
    title,
    description,
    status,
    owner,
    severity
  };
}

export function recalculateSignals(projectId: string) {
  const allSignals = safeParse<FunctionalSignal[]>(SIGNALS_KEY, []).filter((item) => item.projectId !== projectId);
  const objects = safeParse<FunctionalObject[]>(OBJECTS_KEY, []).filter((item) => item.projectId === projectId);

  const generated: FunctionalSignal[] = [];

  objects.filter((item) => item.severity === "red" || item.status === "blocked").forEach((item, index) => {
    generated.push({
      id: `${projectId}-signal-${index + 1}`,
      projectId,
      sourceId: item.id,
      title: `${item.objectType} needs governance attention`,
      explanation: `${item.title} is ${item.status}. This can propagate into downstream delivery risk.`,
      recommendation: `Assign owner action and review linked downstream objects from ${item.phaseSlug}/${item.toolSlug}.`,
      severity: "red"
    });
  });

  const amberCount = objects.filter((item) => item.severity === "amber").length;
  if (amberCount >= 3) {
    generated.push({
      id: `${projectId}-signal-amber-cluster`,
      projectId,
      sourceId: objects.find((item) => item.severity === "amber")?.id ?? objects[0]?.id ?? "",
      title: "Amber concentration detected",
      explanation: `${amberCount} amber delivery objects are accumulating across the project.`,
      recommendation: "Run a focused RAID and governance review before the next steering checkpoint.",
      severity: "amber"
    });
  }

  const learning: FunctionalLearning[] = generated.map((signal, index) => ({
    id: `${projectId}-learning-${index + 1}`,
    projectId,
    title: `Learning from ${signal.title}`,
    lesson: signal.explanation,
    recommendation: signal.recommendation
  }));

  save(SIGNALS_KEY, [...allSignals, ...generated]);
  save(LEARNING_KEY, [...safeParse<FunctionalLearning[]>(LEARNING_KEY, []).filter((item) => item.projectId !== projectId), ...learning]);
}

export function recalculateProjectHealth(projectId: string) {
  const projects = getProjects();
  const objects = safeParse<FunctionalObject[]>(OBJECTS_KEY, []).filter((item) => item.projectId === projectId);
  const health: "green" | "amber" | "red" = objects.some((item) => item.severity === "red")
    ? "red"
    : objects.some((item) => item.severity === "amber")
      ? "amber"
      : "green";
  save(PROJECTS_KEY, projects.map((item) => item.id === projectId ? { ...item, health } : item));
}

export function resetFunctionalData() {
  if (typeof window === "undefined") return;
  [PROJECTS_KEY, OBJECTS_KEY, RELATIONS_KEY, SIGNALS_KEY, LEARNING_KEY].forEach((key) => window.localStorage.removeItem(key));
  getProjects();
}

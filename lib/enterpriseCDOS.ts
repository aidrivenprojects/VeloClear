"use client";
import { getData, templates } from "@/lib/cdosCore";

export type RoleName = "PMO Head" | "Project Manager" | "Scrum Master" | "Sponsor" | "Auditor" | "Team Member" | "Stakeholder";
export const roles: RoleName[] = ["PMO Head","Project Manager","Scrum Master","Sponsor","Auditor","Team Member","Stakeholder"];

export const rolePermissions: Record<RoleName, { view: string[]; edit: string[]; approve: string[]; export: string[] }> = {
  "PMO Head": { view: ["all"], edit: ["governance","raid","planning"], approve: ["change-control","decision-rights"], export: ["all"] },
  "Project Manager": { view: ["all"], edit: ["all"], approve: ["minor-change"], export: ["status-report"] },
  "Scrum Master": { view: ["agile-delivery","planning","raid","intelligence"], edit: ["sprint-board","retrospective","sprint-backlog"], approve: [], export: ["sprint-report"] },
  "Sponsor": { view: ["governance","intelligence","rag-dashboard","change-control"], edit: [], approve: ["change-control","escalation-tracker"], export: ["sponsor-pack"] },
  "Auditor": { view: ["audit-trail","governance","raid","intelligence"], edit: [], approve: [], export: ["audit-pack"] },
  "Team Member": { view: ["agile-delivery","sprint-board"], edit: ["assigned-cards"], approve: [], export: [] },
  "Stakeholder": { view: ["dashboard","rag-dashboard","milestones"], edit: [], approve: [], export: [] }
};

export const methodologyPacks = [
  { slug: "hybrid", name: "Hybrid", description: "PMBOK governance plus Agile delivery.", phases: templates.map(t=>t.title), tools: templates.flatMap(t=>t.tools.map(x=>x[1])) },
  { slug: "pmbok", name: "PMBOK", description: "Charter, WBS, RAID, stakeholders, governance, EVM and closure controls.", phases: ["Initiation","Planning","Execution","Monitoring & Controlling","Closure"], tools: ["Charter","Business Case","WBS","Schedule","Resource Plan","RAID","RACI","Comms Plan","Change Control","EVM","Lessons Learned"] },
  { slug: "agile", name: "Agile / Scrum", description: "Product backlog, sprint backlog, sprint board, burndown, velocity and retrospectives.", phases: ["Discovery","Backlog","Sprint Delivery","Review","Retrospective"], tools: ["Product Backlog","Sprint Backlog","Sprint Board","Burndown","Velocity","Retrospective"] },
  { slug: "safe", name: "SAFe", description: "ART, PI objectives, programme board, predictability and team delivery.", phases: ["Portfolio","ART Planning","PI Execution","Inspect & Adapt"], tools: ["ART","PI Objectives","Programme Board","Dependency Board","Predictability","RTE Dashboard"] }
];

export const integrations = [
  { provider: "Jira", status: "ready_to_configure", maps: "Epics, stories, sprint status, blockers" },
  { provider: "Azure DevOps", status: "ready_to_configure", maps: "Work items, sprints, velocity, defects" },
  { provider: "MS Teams", status: "ready_to_configure", maps: "Escalation alerts, steering reminders" },
  { provider: "Slack", status: "ready_to_configure", maps: "Blocker alerts, team nudges" },
  { provider: "ServiceNow", status: "ready_to_configure", maps: "Incidents, changes, approvals" },
  { provider: "SAP", status: "planned", maps: "Budget, cost actuals, procurement" }
];

export function generateReport(data:any, audience:string) {
  const red = data.objects.filter((o:any)=>o.severity==="red");
  const amber = data.objects.filter((o:any)=>o.severity==="amber");
  const signals = data.events || [];
  const learning = data.learning || [];
  return {
    audience,
    title: `${audience} Report — ${data.project.name}`,
    summary: `${data.project.name} is currently ${data.project.health}. ${red.length} red items, ${amber.length} amber items, ${signals.length} active signal(s).`,
    sections: [
      { title: "Delivery Health", value: data.project.health },
      { title: "Top Risks / Issues", value: red.map((o:any)=>o.title).join("; ") || "No red items." },
      { title: "Recommended Governance Action", value: signals.map((s:any)=>s.recommendation).join("; ") || "Continue monitoring." },
      { title: "Learning Memory", value: learning.map((l:any)=>l.title).join("; ") || "No learning captured yet." }
    ]
  };
}

export function inferWorkflow(text:string) {
  const lower = text.toLowerCase();
  const approval = lower.includes("approval") || lower.includes("approve");
  const inspection = lower.includes("inspection") || lower.includes("spot check") || lower.includes("audit");
  const billing = lower.includes("billing") || lower.includes("tenant") || lower.includes("electricity");
  const steps = billing
    ? ["Capture usage", "Validate allocation", "Calculate charges", "Generate invoice", "Resolve dispute", "Close billing cycle"]
    : approval
      ? ["Submit request", "Validate details", "Route approval", "Execute work", inspection ? "Inspect / spot check" : "Review completion", "Close request"]
      : ["Discover need", "Plan work", "Deliver increment", "Review outcome", "Capture learning"];
  const backlog = steps.map((step, i)=>({ id:`PBI-${String(i+1).padStart(3,"0")}`, title:`${step} capability`, priority:i<2?"High":"Medium" }));
  const risks = [
    approval ? "Approval owner unclear" : "Requirement ambiguity",
    inspection ? "Inspection delay may block closure" : "Late stakeholder feedback",
    billing ? "Usage data quality risk" : "Dependency owner unavailable"
  ];
  return { steps, backlog, risks, governance: approval ? "Approval SLA and escalation path required." : "Weekly governance checkpoint recommended." };
}

export async function getRoleView(projectId:string, role:RoleName) {
  const data = await getData(projectId);
  const perm = rolePermissions[role];
  const canSeeAll = perm.view.includes("all");
  const objects = canSeeAll ? data.objects : data.objects.filter((o:any)=>perm.view.includes(o.phase_slug) || perm.view.includes(o.tool_slug));
  return { ...data, role, permissions: perm, objects };
}

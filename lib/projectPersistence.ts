import { getSupabaseClient } from "@/lib/supabaseClient";
import type { GeneratedProject } from "@/lib/types";

export async function saveGeneratedProject(project: GeneratedProject) {
  const supabase = getSupabaseClient();

  const { data: savedProject, error: projectError } = await supabase
    .from("projects")
    .insert({
      name: project.name,
      delivery_method: project.deliveryMethod,
      complexity: project.complexity,
      risk_focus: project.riskFocus,
      health_status: "amber",
      narrative: project.narrative,
      current_phase: project.complexity === "small" ? "Planning" : "Execution",
      phase_status: "amber",
      phase_completion: project.complexity === "multi_vendor" ? 45 : 55
    })
    .select()
    .single();

  if (projectError) throw projectError;

  const raidRows = project.risks.map((risk) => ({
    project_id: savedProject.id,
    item_type: "risk",
    title: risk.title,
    trigger: risk.trigger,
    mitigation: risk.mitigation,
    owner: risk.owner,
    status: "open",
    probability: Math.min(5, Math.max(1, Math.ceil(risk.score / 5))),
    impact: risk.score
  }));

  const { error: raidError } = await supabase.from("raid_items").insert(raidRows);
  if (raidError) throw raidError;

  const { error: impactError } = await supabase.from("impact_events").insert({
    project_id: savedProject.id,
    event_type: "workspace_generated",
    title: "Workspace generated",
    description: "Guided Setup Intelligence created the initial project structure, RAID controls and delivery narrative."
  });

  if (impactError) throw impactError;

  return savedProject;
}

export async function fetchProjects() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchRaidItems() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("raid_items")
    .select("*, projects(name, health_status, risk_focus, current_phase)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchImpactEvents() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("impact_events")
    .select("*, projects(name, health_status, risk_focus, current_phase)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchProjectWithRaid(projectId: string) {
  const supabase = getSupabaseClient();

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (projectError) throw projectError;

  const { data: raidItems, error: raidError } = await supabase
    .from("raid_items")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (raidError) throw raidError;

  const { data: impactEvents, error: impactError } = await supabase
    .from("impact_events")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (impactError) throw impactError;

  return { project, raidItems: raidItems ?? [], impactEvents: impactEvents ?? [] };
}

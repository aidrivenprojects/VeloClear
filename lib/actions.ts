"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { phaseTemplates, slugify } from "@/lib/model";

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/dashboard");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect(next);
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  redirect("/login?message=Check email confirmation if enabled, then sign in.");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function ensureDefaultOrganisation() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) redirect("/login");

  const { data: memberships } = await supabase
    .from("organisation_members")
    .select("organisation_id, organisations(id, name, slug)")
    .eq("user_id", user.id)
    .limit(1);

  if (memberships && memberships.length) return memberships[0].organisation_id as string;

  const slug = `org-${user.id.slice(0, 8)}`;
  const { data: org, error: orgError } = await supabase
    .from("organisations")
    .insert({ name: "VeloClear Demo Organisation", slug, created_by: user.id })
    .select()
    .single();
  if (orgError) throw orgError;

  const { error: memberError } = await supabase
    .from("organisation_members")
    .insert({ organisation_id: org.id, user_id: user.id, role: "PMO Head" });
  if (memberError) throw memberError;

  const { data: portfolio, error: portfolioError } = await supabase
    .from("portfolios")
    .insert({ organisation_id: org.id, name: "Enterprise Transformation Portfolio" })
    .select()
    .single();
  if (portfolioError) throw portfolioError;

  const { error: programmeError } = await supabase
    .from("programmes")
    .insert({ portfolio_id: portfolio.id, name: "Connected Delivery Programme" });
  if (programmeError) throw programmeError;

  return org.id as string;
}

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) redirect("/login");

  const orgId = await ensureDefaultOrganisation();
  const name = String(formData.get("name") || "Untitled Project");
  const summary = String(formData.get("summary") || "Generated connected delivery workspace.");
  const methodology = String(formData.get("methodology") || "Hybrid");
  const slug = slugify(name);

  const { data: portfolio } = await supabase.from("portfolios").select("id").eq("organisation_id", orgId).limit(1).single();
  const { data: programme } = portfolio
    ? await supabase.from("programmes").select("id").eq("portfolio_id", portfolio.id).limit(1).single()
    : { data: null };

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      organisation_id: orgId,
      portfolio_id: portfolio?.id ?? null,
      programme_id: programme?.id ?? null,
      slug,
      name,
      methodology,
      summary,
      created_by: user.id
    })
    .select()
    .single();
  if (error) throw error;

  await supabase.from("project_members").insert({ project_id: project.id, user_id: user.id, role: "Project Manager" });

  await supabase.from("project_phases").insert(phaseTemplates.map((phase) => ({
    project_id: project.id,
    phase_slug: phase.phase_slug,
    phase_number: phase.phase_number,
    title: phase.title,
    purpose: phase.purpose,
    status: phase.phase_number <= 2 ? "active" : "not_started"
  })));

  await supabase.from("project_tools").insert(phaseTemplates.flatMap((phase) => phase.tools.map((tool) => ({
    project_id: project.id,
    phase_slug: phase.phase_slug,
    tool_slug: tool.tool_slug,
    title: tool.title,
    description: tool.description
  }))));

  const seedRecords = [
    ["initiation","business-case","Business Case",`Business value for ${name}`,summary,"approved","green","Sponsor"],
    ["initiation","charter","Charter",`${name} charter`,"Scope, authority and success criteria.","approved","green","Sponsor"],
    ["planning","wbs","WBS","Delivery work breakdown","Core work packages decomposed from charter.","in progress","amber","Project Manager"],
    ["planning","product-backlog","PBI","PBI-001: Define core workflow","Primary user story from discovery.","ready","green","Product Owner"],
    ["planning","sprint-backlog","Sprint Backlog Item","Sprint 1: workflow foundation","Committed sprint work.","at risk","amber","Scrum Master"],
    ["raid","raid-log","Risk","Decision ownership may delay delivery","Risk trigger if owner is not confirmed.","open","amber","Project Manager"],
    ["governance","escalation-tracker","Escalation","Sponsor decision path","Escalation path configured for blocked decisions.","open","amber","Sponsor"],
    ["agile-delivery","retrospective","Retrospective Action","Capture delivery learning","Learning loop for future prevention.","open","green","Scrum Master"],
    ["intelligence","impact-trace","Impact Trace","Initial trace chain","Business case to learning trace generated.","active","green","VeloClear"]
  ];

  const { data: records, error: recordError } = await supabase
    .from("delivery_records")
    .insert(seedRecords.map((r) => ({
      project_id: project.id,
      phase_slug: r[0],
      tool_slug: r[1],
      record_type: r[2],
      title: r[3],
      description: r[4],
      status: r[5],
      severity: r[6],
      owner_name: r[7],
      created_by: user.id
    })))
    .select();
  if (recordError) throw recordError;

  if (records && records.length > 1) {
    await supabase.from("delivery_relationships").insert(records.slice(0, -1).map((record, index) => ({
      project_id: project.id,
      source_record_id: record.id,
      target_record_id: records[index + 1].id,
      relationship_type: ["AUTHORIZES","DECOMPOSES_TO","GENERATES","SELECTED_INTO","TRIGGERS","ESCALATES_TO","FEEDS_RETRO","CREATES_LEARNING"][index] || "RELATES_TO"
    })));
  }

  redirect(`/projects/${project.id}`);
}

export async function addRecord(formData: FormData) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) redirect("/login");

  const projectId = String(formData.get("projectId") || "");
  const phaseSlug = String(formData.get("phaseSlug") || "");
  const toolSlug = String(formData.get("toolSlug") || "");
  const title = String(formData.get("title") || "");
  const description = String(formData.get("description") || "");

  const { error } = await supabase.from("delivery_records").insert({
    project_id: projectId,
    phase_slug: phaseSlug,
    tool_slug: toolSlug,
    record_type: toolSlug.replaceAll("-", " "),
    title,
    description,
    status: "open",
    severity: "amber",
    owner_name: "Project Team",
    created_by: user.id
  });
  if (error) throw error;
  redirect(`/projects/${projectId}/lifecycle/${phaseSlug}/${toolSlug}`);
}

export async function updateRecordSeverity(formData: FormData) {
  const supabase = await createClient();
  const projectId = String(formData.get("projectId") || "");
  const phaseSlug = String(formData.get("phaseSlug") || "");
  const toolSlug = String(formData.get("toolSlug") || "");
  const recordId = String(formData.get("recordId") || "");
  const severity = String(formData.get("severity") || "amber");
  const status = severity === "green" ? "closed" : severity === "red" ? "blocked" : "open";

  const { error } = await supabase
    .from("delivery_records")
    .update({ severity, status, updated_at: new Date().toISOString() })
    .eq("id", recordId);
  if (error) throw error;
  redirect(`/projects/${projectId}/lifecycle/${phaseSlug}/${toolSlug}`);
}

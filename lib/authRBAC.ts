"use client";

import { getSupabaseClient } from "@/lib/supabaseClient";

export type RoleName =
  | "PMO Head"
  | "Project Manager"
  | "Scrum Master"
  | "Sponsor"
  | "Auditor"
  | "Team Member"
  | "Stakeholder";

export type Permission = {
  role_name: RoleName | string;
  module: string;
  can_view: boolean;
  can_edit: boolean;
  can_approve: boolean;
  can_export: boolean;
};

export const roleOptions: RoleName[] = [
  "PMO Head",
  "Project Manager",
  "Scrum Master",
  "Sponsor",
  "Auditor",
  "Team Member",
  "Stakeholder"
];

export const fallbackPermissions: Permission[] = [
  { role_name: "PMO Head", module: "all", can_view: true, can_edit: true, can_approve: true, can_export: true },
  { role_name: "Project Manager", module: "all", can_view: true, can_edit: true, can_approve: false, can_export: true },
  { role_name: "Scrum Master", module: "agile-delivery", can_view: true, can_edit: true, can_approve: false, can_export: true },
  { role_name: "Scrum Master", module: "planning", can_view: true, can_edit: false, can_approve: false, can_export: false },
  { role_name: "Sponsor", module: "governance", can_view: true, can_edit: false, can_approve: true, can_export: true },
  { role_name: "Sponsor", module: "intelligence", can_view: true, can_edit: false, can_approve: true, can_export: true },
  { role_name: "Auditor", module: "audit-trail", can_view: true, can_edit: false, can_approve: false, can_export: true },
  { role_name: "Team Member", module: "agile-delivery", can_view: true, can_edit: true, can_approve: false, can_export: false },
  { role_name: "Stakeholder", module: "rag-dashboard", can_view: true, can_edit: false, can_approve: false, can_export: false }
];

const ROLE_KEY = "veloclear.demo.role";

export async function getCurrentUser() {
  try {
    const supabase = getSupabaseClient();
    const result = await supabase.auth.getUser();
    return result.data.user;
  } catch {
    return null;
  }
}

export async function getSession() {
  try {
    const supabase = getSupabaseClient();
    const result = await supabase.auth.getSession();
    return result.data.session;
  } catch {
    return null;
  }
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string, fullName: string, role: RoleName) {
  const supabase = getSupabaseClient();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        default_role: role
      }
    }
  });
}

export async function signOut() {
  const supabase = getSupabaseClient();
  await supabase.auth.signOut();
}

export function setDemoRole(role: RoleName) {
  if (typeof window !== "undefined") window.localStorage.setItem(ROLE_KEY, role);
}

export function getDemoRole(): RoleName {
  if (typeof window === "undefined") return "Project Manager";
  return (window.localStorage.getItem(ROLE_KEY) as RoleName) || "Project Manager";
}

export async function getUserRole(projectId?: string): Promise<RoleName> {
  try {
    const user = await getCurrentUser();
    if (!user) return getDemoRole();

    const supabase = getSupabaseClient();

    if (projectId) {
      const membership = await supabase
        .from("project_memberships")
        .select("role_name")
        .eq("project_id", projectId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (membership.data?.role_name) return membership.data.role_name as RoleName;
    }

    const profile = await supabase
      .from("user_profiles")
      .select("default_role")
      .eq("id", user.id)
      .maybeSingle();

    return (profile.data?.default_role as RoleName) || getDemoRole();
  } catch {
    return getDemoRole();
  }
}

export async function getPermissions(role: RoleName): Promise<Permission[]> {
  try {
    const supabase = getSupabaseClient();
    const result = await supabase.from("rbac_permissions").select("*").eq("role_name", role);
    if (result.error || !result.data?.length) throw new Error("fallback");
    return result.data as Permission[];
  } catch {
    return fallbackPermissions.filter((item) => item.role_name === role);
  }
}

export async function can(role: RoleName, module: string, action: "view" | "edit" | "approve" | "export") {
  const permissions = await getPermissions(role);
  const match = permissions.find((item) => item.module === "all" || item.module === module);
  if (!match) return false;
  if (action === "view") return match.can_view;
  if (action === "edit") return match.can_edit;
  if (action === "approve") return match.can_approve;
  return match.can_export;
}

export async function createMembership(projectId: string, userId: string, role: RoleName) {
  const supabase = getSupabaseClient();
  return supabase.from("project_memberships").upsert({
    project_id: projectId,
    user_id: userId,
    role_name: role
  });
}

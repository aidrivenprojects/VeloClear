"use client";

import { getSupabase } from "@/lib/supabase";

const KEY = "vc.clean.auth";

export async function isSignedInAsync() {
  const supabase = getSupabase();
  if (supabase) {
    const session = await supabase.auth.getSession();
    if (session.data.session) return true;
  }
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "true";
}

export function isSignedIn() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "true";
}

export async function signIn(email?: string, password?: string) {
  const supabase = getSupabase();
  if (supabase && email && password) {
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (!result.error) {
      window.localStorage.setItem(KEY, "true");
      return result;
    }
  }
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, "true");
  return { error: null };
}

export async function signUp(email: string, password: string) {
  const supabase = getSupabase();
  if (!supabase) {
    if (typeof window !== "undefined") window.localStorage.setItem(KEY, "true");
    return { error: null };
  }
  return supabase.auth.signUp({ email, password });
}

export async function signOut() {
  const supabase = getSupabase();
  if (supabase) await supabase.auth.signOut();
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { roleOptions, signIn, signUp, type RoleName } from "@/lib/authRBAC";
import { useAuth } from "@/components/auth/AuthProvider";

export function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<RoleName>("Project Manager");
  const [message, setMessage] = useState("");

  async function submit() {
    setMessage("");
    const result = mode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password, fullName, role);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setMessage(mode === "signup" ? "Account created. Check email confirmation if enabled." : "Signed in.");
    await refresh();
    router.push(searchParams.get("next") || "/projects");
  }

  return (
    <AppShell title="Auth" kicker="Supabase Auth + RBAC">
      <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <Card className="p-6">
          <div className="flex gap-3">
            <button onClick={() => setMode("signin")} className={mode === "signin" ? "rounded-xl bg-accent px-4 py-2 text-sm font-black text-white" : "rounded-xl border border-border bg-white px-4 py-2 text-sm font-black text-ink"}>Sign in</button>
            <button onClick={() => setMode("signup")} className={mode === "signup" ? "rounded-xl bg-accent px-4 py-2 text-sm font-black text-white" : "rounded-xl border border-border bg-white px-4 py-2 text-sm font-black text-ink"}>Sign up</button>
          </div>

          <div className="mt-6 grid gap-4">
            {mode === "signup" && (
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="rounded-2xl border border-border bg-surface p-4 text-sm font-bold text-ink outline-none" />
            )}
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-2xl border border-border bg-surface p-4 text-sm font-bold text-ink outline-none" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="rounded-2xl border border-border bg-surface p-4 text-sm font-bold text-ink outline-none" />
            {mode === "signup" && (
              <select value={role} onChange={(e) => setRole(e.target.value as RoleName)} className="rounded-2xl border border-border bg-surface p-4 text-sm font-bold text-ink outline-none">
                {roleOptions.map((item) => <option key={item}>{item}</option>)}
              </select>
            )}
            <button onClick={submit} className="rounded-xl bg-accent px-4 py-2 text-sm font-black text-white">
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
            {message && <div className="rounded-xl bg-accentBg px-4 py-3 text-sm font-bold text-accent">{message}</div>}
          </div>
        </Card>

        <Card className="p-6">
          <h1 className="text-3xl font-black tracking-[-0.04em] text-ink">RBAC model</h1>
          <div className="mt-5 grid gap-3">
            {roleOptions.map((item) => (
              <div key={item} className="rounded-2xl border border-border bg-surface p-4">
                <div className="text-sm font-black text-ink">{item}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

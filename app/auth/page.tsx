"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth";

function AuthInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const [email, setEmail] = useState("demo@veloclear.app");
  const [password, setPassword] = useState("password");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    await signIn(email, password);
    router.push(sp.get("next") || "/projects");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface p-8">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-[-0.04em] text-ink">Sign in</h1>
        <p className="mt-2 text-sm text-muted">Authorization gate for VeloClear workspace.</p>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mt-6 w-full rounded-2xl border border-border bg-surface p-4 text-sm font-bold outline-none" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="mt-3 w-full rounded-2xl border border-border bg-surface p-4 text-sm font-bold outline-none" />
        <button onClick={submit} disabled={busy} className="mt-5 w-full rounded-xl bg-accent px-4 py-3 text-sm font-black text-white disabled:opacity-60">{busy ? "Signing in..." : "Sign in"}</button>
        <p className="mt-3 text-xs leading-5 text-muted">Works immediately in local mode. Add Supabase env vars to use Supabase Auth.</p>
      </div>
    </main>
  );
}

export default function Page() {
  return <Suspense fallback={<div /> }><AuthInner /></Suspense>;
}

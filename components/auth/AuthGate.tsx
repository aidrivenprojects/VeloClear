"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card } from "@/components/ui/Card";

export function AuthGate({ children, module = "all" }: { children: React.ReactNode; module?: string }) {
  const { user, loading, role, permissions } = useAuth();

  if (loading) return <Card className="p-6">Checking access…</Card>;

  const hasAccess = permissions.some((permission) => permission.module === "all" || permission.module === module);

  if (!user && !hasAccess) {
    return (
      <Card className="p-6">
        <h1 className="text-2xl font-black text-ink">Sign in required</h1>
        <p className="mt-2 text-sm text-muted">Use Supabase Auth or demo role mode to access this module.</p>
        <Link href="/auth" className="mt-5 inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-black text-white">Go to sign in</Link>
      </Card>
    );
  }

  if (!hasAccess) {
    return (
      <Card className="p-6">
        <h1 className="text-2xl font-black text-ink">Access restricted</h1>
        <p className="mt-2 text-sm text-muted">Current role: {role}. This role does not have access to {module}.</p>
      </Card>
    );
  }

  return <>{children}</>;
}

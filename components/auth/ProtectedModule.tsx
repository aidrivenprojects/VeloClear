"use client";

import { AuthGate } from "@/components/auth/AuthGate";

export function ProtectedModule({ module, children }: { module: string; children: React.ReactNode }) {
  return <AuthGate module={module}>{children}</AuthGate>;
}

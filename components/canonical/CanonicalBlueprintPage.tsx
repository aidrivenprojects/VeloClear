import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { lifecycle, deliveryGraph, roleViews } from "@/lib/canonicalModel";

export function CanonicalBlueprintPage() {
  return (
    <AppShell title="VeloClear Blueprint" kicker="Canonical Architecture">
      <div className="space-y-5">
        <Card className="p-6">
          <div className="text-xs font-black uppercase tracking-wider text-accent">Delivery Intelligence OS</div>
          <h1 className="mt-2 max-w-4xl text-3xl font-black leading-tight tracking-[-0.04em] text-ink">
            VeloClear connects lifecycle, delivery work, governance signals and organisational learning.
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">
            The app should not behave like disconnected PM toolkit pages. It must behave like one connected delivery graph that moves from discovery to delivery to intelligence.
          </p>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">Lifecycle-first operating model</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-5">
            {lifecycle.map((phase) => (
              <Link
                key={phase.slug}
                href={`/lifecycle/${phase.slug}`}
                className="rounded-2xl border border-border bg-white p-4 transition hover:-translate-y-0.5 hover:border-accent/40"
              >
                <div className="text-sm font-black text-ink">{phase.title}</div>
                <p className="mt-2 text-xs leading-5 text-muted">{phase.purpose}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-ink">Connected delivery graph</h2>
              <p className="mt-1 text-xs text-muted">This is the actual product backbone.</p>
            </div>
            <Link href="/delivery-graph" className="rounded-xl bg-accent px-4 py-2 text-xs font-black text-white">
              Open graph
            </Link>
          </div>
          <div className="mt-4 grid gap-2">
            {deliveryGraph.slice(0, 8).map((item, index) => (
              <div key={`${item.type}-${index}`} className="grid gap-3 md:grid-cols-[180px_1fr]">
                <div className="rounded-xl bg-accentBg px-3 py-2 text-xs font-black text-accent">{item.type}</div>
                <div className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-muted">{item.value}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">Role value</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {roleViews.map(([role, value]) => (
              <div key={role} className="rounded-2xl border border-border bg-surface p-4">
                <div className="text-sm font-black text-ink">{role}</div>
                <p className="mt-1 text-xs leading-5 text-muted">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

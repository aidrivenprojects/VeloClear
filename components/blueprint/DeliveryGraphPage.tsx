import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { deliveryGraph, sampleTrace } from "@/lib/blueprintModel";

export function DeliveryGraphPage() {
  return (
    <AppShell title="Delivery Graph" kicker="Blueprint">
      <div className="space-y-5">
        <Card className="p-6">
          <div className="text-xs font-black uppercase tracking-wider text-accent">Connected delivery backbone</div>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">From project intent to learning.</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">Every delivery object connects upward to business intent and downward to impact trace, governance and learning.</p>
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">Operating chain</h2>
          <div className="mt-5 grid gap-3">
            {deliveryGraph.map((item, index) => (
              <div key={item} className="grid gap-3 md:grid-cols-[48px_1fr]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accentBg text-sm font-black text-accent">{index + 1}</div>
                <div className="rounded-2xl border border-border bg-white p-4 text-sm font-black text-ink">{item}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">Example trace: sprint slip to learning</h2>
          <div className="mt-5 grid gap-3">
            {sampleTrace.map((item, index) => (
              <div key={item.label} className="rounded-2xl border border-border bg-surface p-4">
                <div className="text-xs font-black uppercase tracking-wider text-accent">Step {index + 1}</div>
                <div className="mt-1 text-sm font-black text-ink">{item.label}</div>
                <p className="mt-1 text-xs leading-5 text-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </Card>
        <div className="flex flex-wrap gap-3">
          <Link href="/toolkit/backlog" className="rounded-xl bg-accent px-4 py-3 text-sm font-black text-white">Open Product Backlog</Link>
          <Link href="/toolkit/impact-trace" className="rounded-xl border border-border bg-white px-4 py-3 text-sm font-black text-ink">Open Impact Trace</Link>
        </div>
      </div>
    </AppShell>
  );
}

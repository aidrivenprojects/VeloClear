import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { finalPhases, canonicalTrace } from "@/lib/finalStructure";

export function FinalStructurePage() {
  return (
    <AppShell title="Final Structure" kicker="VeloClear Operating Model">
      <div className="space-y-5">
        <Card className="p-6">
          <div className="text-xs font-black uppercase tracking-wider text-accent">Lifecycle-first delivery intelligence</div>
          <h1 className="mt-2 max-w-5xl text-3xl font-black leading-tight tracking-[-0.04em] text-ink">
            The final VeloClear structure: phases contain tools, tools contain connected delivery entities, and every entity participates in the trace graph.
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">
            No standalone PM Toolkit menu. No static placeholders. The project lifecycle is the operating spine.
          </p>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">8-phase operating structure</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {finalPhases.map((phase) => (
              <Link
                key={phase.slug}
                href={`/lifecycle/${phase.slug}`}
                className="rounded-2xl border border-border bg-white p-4 transition hover:-translate-y-0.5 hover:border-accent/50"
              >
                <div className="text-xs font-black uppercase tracking-wider text-accent">Phase {phase.number}</div>
                <div className="mt-2 text-lg font-black text-ink">{phase.title}</div>
                <p className="mt-2 text-xs leading-5 text-muted">{phase.question}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">Seamless trace chain</h2>
          <div className="mt-4 grid gap-2">
            {canonicalTrace.map((item, index) => (
              <div key={item} className="grid gap-3 md:grid-cols-[52px_1fr]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accentBg text-xs font-black text-accent">{index + 1}</div>
                <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-black text-ink">{item}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

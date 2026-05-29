import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { getPhaseWorkbench, phaseWorkbenches } from "@/lib/phaseWorkbenchModel";

export function PhaseWorkbenchPage({ slug }: { slug: string }) {
  const phase = getPhaseWorkbench(slug);

  return (
    <AppShell title={phase.title} kicker="Lifecycle">
      <div className="space-y-5">
        <Card className="p-6">
          <div className="text-xs font-black uppercase tracking-wider text-accent">Lifecycle workbench</div>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">{phase.title}</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">{phase.purpose}</p>
        </Card>

        <div className="grid gap-4 md:grid-cols-5">
          {phaseWorkbenches.map((item) => (
            <Link
              href={`/lifecycle/${item.slug}`}
              key={item.slug}
              className={item.slug === phase.slug
                ? "rounded-2xl border border-accent bg-accentBg p-4 text-sm font-black text-accent"
                : "rounded-2xl border border-border bg-white p-4 text-sm font-black text-ink hover:border-accent/40"}
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <Section title="What to capture" items={phase.capture} />
          <Section title="What to track" items={phase.track} />
          <Section title="PM deliverables" items={phase.deliverables} />
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <Section title="Likely risks" items={phase.risks} />
          <Section title="Governance actions" items={phase.governance} />
          <Section title="Intelligence added" items={phase.intelligence} accent />
        </div>

        <Card className="p-6">
          <div className="text-xs font-black uppercase tracking-wider text-muted">Example</div>
          <p className="mt-3 text-sm font-bold leading-6 text-ink2">{phase.example}</p>
        </Card>
      </div>
    </AppShell>
  );
}

function Section({ title, items, accent = false }: { title: string; items: string[]; accent?: boolean }) {
  return (
    <Card className="p-5">
      <h2 className="text-sm font-black text-ink">{title}</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div
            key={item}
            className={accent
              ? "rounded-2xl bg-accentBg p-4 text-xs font-bold leading-5 text-[#312E81]"
              : "rounded-2xl border border-border bg-surface p-4 text-xs font-bold leading-5 text-muted"}
          >
            {accent ? "✦ " : "• "}{item}
          </div>
        ))}
      </div>
    </Card>
  );
}

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getPhase, finalPhases } from "@/lib/finalStructure";

export function PhaseWorkspacePage({ phaseSlug, projectId }: { phaseSlug: string; projectId?: string }) {
  const phase = getPhase(phaseSlug);
  const prefix = projectId ? `/projects/${projectId}` : "";

  return (
    <AppShell title={phase.title} kicker={`Phase ${phase.number}`}>
      <div className="space-y-5">
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-accent">Lifecycle phase</div>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">{phase.title}</h1>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">{phase.purpose}</p>
              <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-ink">{phase.question}</p>
            </div>
            <Badge tone="amber">{projectId ? "Project context" : "Demo context"}</Badge>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">Phase navigation</h2>
          <div className="mt-4 grid gap-2 md:grid-cols-4">
            {finalPhases.map((item) => (
              <Link
                key={item.slug}
                href={`${prefix}/lifecycle/${item.slug}`}
                className={
                  item.slug === phase.slug
                    ? "rounded-2xl border border-accent bg-accentBg p-4 text-sm font-black text-accent"
                    : "rounded-2xl border border-border bg-white p-4 text-sm font-black text-ink hover:border-accent/40"
                }
              >
                <div className="text-[10px] uppercase tracking-wider opacity-70">Phase {item.number}</div>
                {item.title}
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">Tools inside this phase</h2>
          <p className="mt-1 text-xs text-muted">These are not standalone toolkit pages. They are phase-owned workspaces connected to the delivery graph.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {phase.tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`${prefix}/lifecycle/${phase.slug}/${tool.slug}`}
                className="rounded-2xl border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:border-accent/50"
              >
                <div className="text-sm font-black text-ink">{tool.title}</div>
                <p className="mt-2 text-xs leading-5 text-muted">{tool.purpose}</p>
                <div className="mt-3 text-xs font-black text-accent">Open workspace →</div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">Phase outputs</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {phase.outputs.map((output) => (
              <div key={output} className="rounded-2xl bg-accentBg p-4 text-xs font-bold leading-5 text-[#312E81]">✦ {output}</div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

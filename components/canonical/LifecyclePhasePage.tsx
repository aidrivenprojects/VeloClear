import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { lifecycle } from "@/lib/canonicalModel";

export function LifecyclePhasePage({ slug }: { slug: string }) {
  const phase = lifecycle.find((item) => item.slug === slug) ?? lifecycle[0];

  return (
    <AppShell title={phase.title} kicker="Lifecycle">
      <div className="space-y-5">
        <Card className="p-6">
          <div className="text-xs font-black uppercase tracking-wider text-accent">Lifecycle phase</div>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">{phase.title}</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">{phase.purpose}</p>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[1fr_.9fr]">
          <Card className="p-5">
            <h2 className="text-sm font-black text-ink">Contextual tools in this phase</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {phase.tools.map((tool) => (
                <div key={tool} className="rounded-2xl border border-border bg-surface p-4">
                  <div className="text-sm font-black text-ink">{tool}</div>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    This belongs inside {phase.title}, not as a disconnected top-level menu.
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-black text-ink">Expected outputs</h2>
            <div className="mt-4 grid gap-3">
              {phase.outputs.map((output) => (
                <div key={output} className="rounded-2xl bg-accentBg p-4 text-xs font-bold leading-5 text-[#312E81]">
                  ✦ {output}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

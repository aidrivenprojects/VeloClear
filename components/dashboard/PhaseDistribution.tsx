import { portfolioPhaseDistribution, lifecyclePortfolioInsight } from "@/lib/lifecycleEngine";
import { Card } from "@/components/ui/Card";

export function PhaseDistribution({ projects, raidItems }: { projects: any[]; raidItems: any[] }) {
  const distribution = portfolioPhaseDistribution(projects);
  const insight = lifecyclePortfolioInsight(projects, raidItems);

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-accent">Portfolio delivery lifecycle</div>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-ink">Phase-based delivery intelligence</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-5">
        {distribution.map((item) => (
          <div key={item.phase} className="rounded-2xl border border-border bg-surface p-4">
            <div className="font-mono text-3xl font-bold text-accent">{item.count}</div>
            <div className="mt-2 text-[11px] font-black uppercase tracking-wider text-muted">{item.phase}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-accentBg p-4 text-sm font-bold leading-6 text-[#312E81]">
        {insight}
      </div>
    </Card>
  );
}

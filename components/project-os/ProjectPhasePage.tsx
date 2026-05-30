import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { findProject, getPhase, projectPhases } from "@/lib/projectOperatingModel";

export function ProjectPhasePage({ phaseSlug, projectId }: { phaseSlug: string; projectId: string }) {
  const project = findProject(projectId);
  const phase = getPhase(phaseSlug);
  return (
    <AppShell title={phase.title} kicker={`Project: ${project.name}`}>
      <div className="space-y-5">
        <Card className="p-6"><Link href={`/projects/${project.id}`} className="text-xs font-black uppercase tracking-wider text-accent">← Project workspace</Link><h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-ink">Phase {phase.number} — {phase.title}</h1></Card>
        <Card className="p-5"><h2 className="text-sm font-black text-ink">Tools inside this phase</h2><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{phase.tools.map(tool=><Link key={tool.slug} href={`/projects/${project.id}/lifecycle/${phase.slug}/${tool.slug}`} className="rounded-2xl border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:border-accent/50"><div className="text-sm font-black text-ink">{tool.title}</div><div className="mt-3 text-xs font-black text-accent">Open drilldown →</div></Link>)}</div></Card>
        <Card className="p-5"><h2 className="text-sm font-black text-ink">All project phases</h2><div className="mt-4 grid gap-2 md:grid-cols-4">{projectPhases.map(item=><Link key={item.slug} href={`/projects/${project.id}/lifecycle/${item.slug}`} className={item.slug===phase.slug?"rounded-2xl border border-accent bg-accentBg p-4 text-sm font-black text-accent":"rounded-2xl border border-border bg-white p-4 text-sm font-black text-ink"}>Phase {item.number} — {item.title}</Link>)}</div></Card>
      </div>
    </AppShell>
  );
}

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { findProject, projectPhases, traceChain } from "@/lib/projectOperatingModel";

function tone(health: string) { return health === "green" ? "green" : health === "red" ? "red" : "amber"; }

export function ProjectTreePage({ projectId }: { projectId: string }) {
  const project = findProject(projectId);
  return (
    <AppShell title={project.name} kicker="Project Workspace">
      <div className="space-y-5">
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link href="/projects" className="text-xs font-black uppercase tracking-wider text-accent">← Projects</Link>
              <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-ink">Project: {project.name}</h1>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">{project.summary}</p>
            </div>
            <Badge tone={tone(project.health)}>{project.health}</Badge>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">Lifecycle phases</h2>
          <div className="mt-5 grid gap-4">
            {projectPhases.map(phase => (
              <div key={phase.slug} className="rounded-3xl border border-border bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><div className="text-xs font-black uppercase tracking-wider text-accent">Phase {phase.number}</div><h3 className="mt-1 text-xl font-black text-ink">{phase.title}</h3></div>
                  <Link href={`/projects/${project.id}/lifecycle/${phase.slug}`} className="rounded-xl bg-accent px-4 py-2 text-xs font-black text-white">Open phase</Link>
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                  {phase.tools.map(tool => <Link key={tool.slug} href={`/projects/${project.id}/lifecycle/${phase.slug}/${tool.slug}`} className="rounded-2xl border border-border bg-surface p-3 text-sm font-black text-ink transition hover:border-accent/40">{tool.title}</Link>)}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-black text-ink">Trace chain</h2>
            <Link href={`/projects/${project.id}/trace`} className="rounded-xl bg-accent px-4 py-2 text-xs font-black text-white">Open project trace</Link>
          </div>
          <div className="mt-4 grid gap-2">{traceChain.map((item,index)=><div key={item} className="grid gap-3 md:grid-cols-[52px_1fr]"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accentBg text-xs font-black text-accent">{index+1}</div><div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-black text-ink">{item}</div></div>)}</div>
        </Card>
      </div>
    </AppShell>
  );
}

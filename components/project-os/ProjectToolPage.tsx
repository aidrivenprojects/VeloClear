import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { findProject, getPhase, getTool, getSample } from "@/lib/projectOperatingModel";

function tone(status: string) { return status === "red" ? "red" : status === "green" ? "green" : "amber"; }

export function ProjectToolPage({ phaseSlug, toolSlug, projectId }: { phaseSlug: string; toolSlug: string; projectId: string }) {
  const project = findProject(projectId);
  const phase = getPhase(phaseSlug);
  const tool = getTool(phaseSlug, toolSlug);
  const sample = getSample(tool.slug);
  return (
    <AppShell title={tool.title} kicker={`Project: ${project.name}`}>
      <div className="space-y-5">
        <Card className="p-6"><Link href={`/projects/${project.id}/lifecycle/${phase.slug}`} className="text-xs font-black uppercase tracking-wider text-accent">← Phase {phase.number} — {phase.title}</Link><h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-ink">{tool.title}</h1><p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">{sample.overview}</p></Card>
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-sm font-black text-ink">Connected records</h2><Link href={`/projects/${project.id}/trace`} className="rounded-xl bg-accent px-4 py-2 text-xs font-black text-white">Open trace</Link></div>
          <div className="mt-5 grid gap-3">{sample.records.map(record=><div key={record.title} className="rounded-2xl border border-border bg-white p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="text-sm font-black text-ink">{record.title}</div><div className="mt-1 text-xs text-muted">Owner: {record.owner}</div></div><Badge tone={tone(record.status)}>{record.status}</Badge></div><div className="mt-3 rounded-xl bg-surface p-3 text-xs font-bold leading-5 text-muted">Signal: {record.signal}</div></div>)}</div>
        </Card>
      </div>
    </AppShell>
  );
}

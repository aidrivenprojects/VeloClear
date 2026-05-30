"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getProject, getObjects, getRelations, getSignals, getLearning, projectPhasesFallback, type FunctionalProject, type FunctionalObject, type FunctionalSignal } from "./helpers";

function tone(health: string) {
  if (health === "green") return "green";
  if (health === "red") return "red";
  return "amber";
}

export function FunctionalProjectWorkspace({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<FunctionalProject | null>(null);
  const [objects, setObjects] = useState<FunctionalObject[]>([]);
  const [signals, setSignals] = useState<FunctionalSignal[]>([]);

  useEffect(() => {
    setProject(getProject(projectId));
    setObjects(getObjects(projectId));
    setSignals(getSignals(projectId));
  }, [projectId]);

  const phaseStats = useMemo(() => projectPhasesFallback.map((phase) => ({
    ...phase,
    count: objects.filter((item) => item.phaseSlug === phase.slug).length,
    red: objects.filter((item) => item.phaseSlug === phase.slug && item.severity === "red").length
  })), [objects]);

  if (!project) return <AppShell title="Project" kicker="Loading"><Card className="p-6">Loading project…</Card></AppShell>;

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

        <div className="grid gap-5 xl:grid-cols-4">
          <Metric label="Objects" value={objects.length.toString()} />
          <Metric label="Signals" value={signals.length.toString()} />
          <Metric label="Relationships" value={getRelations(projectId).length.toString()} />
          <Metric label="Learning" value={getLearning(projectId).length.toString()} />
        </div>

        {signals.length > 0 && (
          <Card className="p-5">
            <h2 className="text-sm font-black text-ink">Live intelligence signals</h2>
            <div className="mt-4 grid gap-3">
              {signals.map((signal) => (
                <div key={signal.id} className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-black text-ink">{signal.title}</div>
                      <p className="mt-1 text-xs leading-5 text-muted">{signal.explanation}</p>
                    </div>
                    <Badge tone={tone(signal.severity)}>{signal.severity}</Badge>
                  </div>
                  <div className="mt-3 rounded-xl bg-accentBg p-3 text-xs font-bold leading-5 text-[#312E81]">Action: {signal.recommendation}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">Lifecycle phases</h2>
          <div className="mt-5 grid gap-4">
            {phaseStats.map((phase) => (
              <div key={phase.slug} className="rounded-3xl border border-border bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-accent">Phase {phase.number}</div>
                    <h3 className="mt-1 text-xl font-black text-ink">{phase.title}</h3>
                    <div className="mt-2 text-xs font-bold text-muted">{phase.count} objects · {phase.red} red</div>
                  </div>
                  <Link href={`/projects/${project.id}/lifecycle/${phase.slug}`} className="rounded-xl bg-accent px-4 py-2 text-xs font-black text-white">Open phase</Link>
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                  {phase.tools.map((tool) => (
                    <Link key={tool.slug} href={`/projects/${project.id}/lifecycle/${phase.slug}/${tool.slug}`} className="rounded-2xl border border-border bg-surface p-3 text-sm font-black text-ink transition hover:border-accent/40">
                      {tool.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-ink">Connected Operating System</h2>
              <p className="mt-1 text-xs text-muted">Open the object, relationship, signal and learning view.</p>
            </div>
            <Link href={`/projects/${project.id}/operating-system`} className="rounded-xl bg-accent px-4 py-2 text-xs font-black text-white">Open operating system</Link>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <Card className="p-5"><div className="text-xs font-black uppercase tracking-wider text-muted">{label}</div><div className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">{value}</div></Card>;
}

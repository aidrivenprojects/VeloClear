"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getProjects, resetFunctionalData, type FunctionalProject } from "@/lib/functionalStore";

function tone(health: string) {
  if (health === "green") return "green";
  if (health === "red") return "red";
  return "amber";
}

export function FunctionalProjectsPage() {
  const [projects, setProjects] = useState<FunctionalProject[]>([]);

  useEffect(() => setProjects(getProjects()), []);

  function reset() {
    resetFunctionalData();
    setProjects(getProjects());
  }

  return (
    <AppShell title="Projects" kicker="Portfolio">
      <div className="space-y-5">
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-accent">Project registry</div>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">Select a project or create a new one.</h1>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">
                New projects are saved locally, then lifecycle workspaces, connected objects, signals and learning are generated automatically.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={reset} className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-black text-ink">Reset demo</button>
              <Link href="/new-project" className="rounded-xl bg-accent px-4 py-2 text-sm font-black text-white">+ New Project</Link>
            </div>
          </div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="block">
              <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-accent/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-muted">{project.programme}</div>
                    <h2 className="mt-2 text-xl font-black text-ink">{project.name}</h2>
                  </div>
                  <Badge tone={tone(project.health)}>{project.health}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink2">{project.summary}</p>
                <div className="mt-4 text-xs font-black text-accent">Open project workspace →</div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

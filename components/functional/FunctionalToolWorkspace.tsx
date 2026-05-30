"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { addObject, getObjectsForTool, getProject, getPhase, getTool, updateObjectStatus, type FunctionalObject, type FunctionalProject } from "./helpers";

function tone(status: string) {
  if (status === "red") return "red";
  if (status === "green") return "green";
  return "amber";
}

export function FunctionalToolWorkspace({ projectId, phaseSlug, toolSlug }: { projectId: string; phaseSlug: string; toolSlug: string }) {
  const [project, setProject] = useState<FunctionalProject | null>(null);
  const [objects, setObjects] = useState<FunctionalObject[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const phase = getPhase(phaseSlug);
  const tool = getTool(phaseSlug, toolSlug);

  function refresh() {
    setProject(getProject(projectId));
    setObjects(getObjectsForTool(projectId, phaseSlug, toolSlug));
  }

  useEffect(refresh, [projectId, phaseSlug, toolSlug]);

  function create() {
    if (!title.trim()) return;
    addObject(projectId, phaseSlug, toolSlug, title, description || "New connected delivery object.");
    setTitle("");
    setDescription("");
    refresh();
  }

  function mark(obj: FunctionalObject, severity: "green" | "amber" | "red") {
    updateObjectStatus(projectId, obj.id, severity === "green" ? "closed" : severity === "red" ? "blocked" : "open", severity);
    refresh();
  }

  if (!project) return <AppShell title="Tool" kicker="Loading"><Card className="p-6">Loading…</Card></AppShell>;

  return (
    <AppShell title={tool.title} kicker={`Project: ${project.name}`}>
      <div className="space-y-5">
        <Card className="p-6">
          <Link href={`/projects/${project.id}/lifecycle/${phase.slug}`} className="text-xs font-black uppercase tracking-wider text-accent">← Phase {phase.number} — {phase.title}</Link>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-ink">{tool.title}</h1>
          <p className="mt-3 text-sm leading-6 text-ink2">Create and update project-bound records. Changes recalculate health and intelligence signals.</p>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">Add connected record</h2>
          <div className="mt-4 grid gap-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Record title" className="rounded-2xl border border-border bg-surface p-4 text-sm font-bold text-ink outline-none" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="min-h-[100px] rounded-2xl border border-border bg-surface p-4 text-sm font-bold text-ink outline-none" />
            <button onClick={create} className="w-fit rounded-xl bg-accent px-4 py-2 text-sm font-black text-white">Add record</button>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-black text-ink">Connected records</h2>
            <Link href={`/projects/${project.id}/operating-system`} className="rounded-xl bg-accent px-4 py-2 text-xs font-black text-white">Open OS</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {objects.length ? objects.map((obj) => (
              <div key={obj.id} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-black text-ink">{obj.title}</div>
                    <div className="mt-1 text-xs text-muted">Owner: {obj.owner}</div>
                    <p className="mt-2 text-xs leading-5 text-muted">{obj.description}</p>
                  </div>
                  <Badge tone={tone(obj.severity)}>{obj.status}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => mark(obj, "green")} className="rounded-lg bg-greenBg px-3 py-1 text-xs font-black text-green">Mark green</button>
                  <button onClick={() => mark(obj, "amber")} className="rounded-lg bg-amberBg px-3 py-1 text-xs font-black text-amber">Mark amber</button>
                  <button onClick={() => mark(obj, "red")} className="rounded-lg bg-redBg px-3 py-1 text-xs font-black text-red">Mark red</button>
                </div>
              </div>
            )) : <div className="rounded-2xl border border-border bg-surface p-4 text-sm font-bold text-muted">No records yet.</div>}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

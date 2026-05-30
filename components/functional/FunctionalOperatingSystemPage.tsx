"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getLearning, getObjects, getProject, getRelations, getSignals, type FunctionalLearning, type FunctionalObject, type FunctionalProject, type FunctionalRelation, type FunctionalSignal } from "@/lib/functionalStore";

function tone(value?: string | null) {
  if (value === "red" || value === "blocked") return "red";
  if (value === "green" || value === "closed" || value === "approved" || value === "active") return "green";
  return "amber";
}

export function FunctionalOperatingSystemPage({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<FunctionalProject | null>(null);
  const [objects, setObjects] = useState<FunctionalObject[]>([]);
  const [relations, setRelations] = useState<FunctionalRelation[]>([]);
  const [signals, setSignals] = useState<FunctionalSignal[]>([]);
  const [learning, setLearning] = useState<FunctionalLearning[]>([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    const p = getProject(projectId);
    const o = getObjects(projectId);
    setProject(p);
    setObjects(o);
    setRelations(getRelations(projectId));
    setSignals(getSignals(projectId));
    setLearning(getLearning(projectId));
    setSelectedId(o.find((item) => item.severity === "red")?.id ?? o[0]?.id ?? "");
  }, [projectId]);

  const selected = objects.find((item) => item.id === selectedId) ?? objects[0];

  const upstream = useMemo(() => selected ? relations.filter((r) => r.targetId === selected.id).map((r) => objects.find((o) => o.id === r.sourceId)).filter(Boolean) as FunctionalObject[] : [], [selected, relations, objects]);
  const downstream = useMemo(() => selected ? relations.filter((r) => r.sourceId === selected.id).map((r) => objects.find((o) => o.id === r.targetId)).filter(Boolean) as FunctionalObject[] : [], [selected, relations, objects]);

  if (!project) return <AppShell title="Operating System" kicker="Loading"><Card className="p-6">Loading…</Card></AppShell>;

  return (
    <AppShell title="Connected Delivery OS" kicker={`Project: ${project.name}`}>
      <div className="space-y-5">
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-accent">Functional operating system</div>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">Objects, relationships, signals and learning.</h1>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">This view is generated from project records and updates as you add or change tool records.</p>
            </div>
            <Badge tone={tone(project.health)}>{project.health}</Badge>
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-4">
          <Metric label="Objects" value={objects.length.toString()} />
          <Metric label="Relationships" value={relations.length.toString()} />
          <Metric label="Signals" value={signals.length.toString()} />
          <Metric label="Learning" value={learning.length.toString()} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
          <Card className="p-5">
            <h2 className="text-sm font-black text-ink">Connected delivery objects</h2>
            <div className="mt-4 grid gap-3">
              {objects.map((obj) => (
                <button key={obj.id} onClick={() => setSelectedId(obj.id)} className={selected?.id === obj.id ? "rounded-2xl border border-accent bg-accentBg p-4 text-left" : "rounded-2xl border border-border bg-white p-4 text-left hover:border-accent/40"}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-muted">{obj.objectType} · {obj.phaseSlug} / {obj.toolSlug}</div>
                      <div className="mt-1 text-sm font-black text-ink">{obj.title}</div>
                      <p className="mt-1 text-xs leading-5 text-muted">{obj.description}</p>
                    </div>
                    <Badge tone={tone(obj.severity)}>{obj.status}</Badge>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <div className="space-y-5">
            {selected && <Card className="p-5"><div className="text-[10px] font-black uppercase tracking-wider text-accent">{selected.objectType}</div><h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-ink">{selected.title}</h2><p className="mt-3 text-sm leading-6 text-ink2">{selected.description}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><Mini label="Phase" value={selected.phaseSlug}/><Mini label="Tool" value={selected.toolSlug}/><Mini label="Owner" value={selected.owner}/><Mini label="Severity" value={selected.severity}/></div></Card>}

            <Card className="p-5"><h2 className="text-sm font-black text-ink">Cause and effect</h2><div className="mt-4 grid gap-3"><Relation title="Upstream causes" items={upstream}/><Relation title="Downstream impact" items={downstream}/></div></Card>

            <Card className="p-5"><h2 className="text-sm font-black text-ink">Signals</h2><div className="mt-4 grid gap-3">{signals.length ? signals.map((s) => <div key={s.id} className="rounded-2xl border border-border bg-surface p-4"><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-black text-ink">{s.title}</div><p className="mt-1 text-xs leading-5 text-muted">{s.explanation}</p></div><Badge tone={tone(s.severity)}>{s.severity}</Badge></div><div className="mt-3 rounded-xl bg-accentBg p-3 text-xs font-bold leading-5 text-[#312E81]">Action: {s.recommendation}</div></div>) : <div className="text-sm font-bold text-muted">No signals yet.</div>}</div></Card>

            <Card className="p-5"><h2 className="text-sm font-black text-ink">Learning memory</h2><div className="mt-4 grid gap-3">{learning.length ? learning.map((l) => <div key={l.id} className="rounded-2xl border border-border bg-white p-4"><div className="text-sm font-black text-ink">{l.title}</div><p className="mt-1 text-xs leading-5 text-muted">{l.lesson}</p><div className="mt-3 rounded-xl bg-surface p-3 text-xs font-bold leading-5 text-muted">Future: {l.recommendation}</div></div>) : <div className="text-sm font-bold text-muted">No learning yet.</div>}</div></Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <Card className="p-5"><div className="text-xs font-black uppercase tracking-wider text-muted">{label}</div><div className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">{value}</div></Card>;
}

function Mini({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-border bg-surface p-4"><div className="text-[10px] font-black uppercase tracking-wider text-muted">{label}</div><div className="mt-1 text-sm font-black text-ink">{value}</div></div>;
}

function Relation({ title, items }: { title: string; items: FunctionalObject[] }) {
  return <div className="rounded-2xl border border-border bg-surface p-4"><div className="text-xs font-black uppercase tracking-wider text-muted">{title}</div><div className="mt-3 grid gap-2">{items.length ? items.map((item) => <div key={item.id} className="rounded-xl bg-white px-3 py-2 text-xs font-black text-ink">{item.title}</div>) : <div className="text-xs font-bold text-muted">No linked objects.</div>}</div></div>;
}

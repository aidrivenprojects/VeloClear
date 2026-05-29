"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { fetchProjectWithRaid } from "@/lib/projectPersistence";

type ProjectDetailData = {
  project: any;
  raidItems: any[];
  impactEvents: any[];
};

export function ProjectDetail({ projectId }: { projectId: string }) {
  const [data, setData] = useState<ProjectDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjectWithRaid(projectId)
      .then((result) => setData(result))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load project."));
  }, [projectId]);

  return (
    <AppShell title="Project Workspace" kicker="Project">
      {error && (
        <Card className="p-6">
          <div className="text-sm font-black text-red">{error}</div>
          <Link href="/projects/new" className="mt-4 inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-black text-white">Create another workspace</Link>
        </Card>
      )}

      {!error && !data && <Card className="p-8"><div className="text-sm font-black text-muted">Loading project workspace…</div></Card>}

      {data && (
        <div className="space-y-5">
          <Card className="overflow-hidden">
            <div className="border-b border-border bg-[linear-gradient(135deg,#ffffff,#F8FAFC)] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-accent">Saved workspace</div>
                  <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-ink">{data.project.name}</h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-ink2">{data.project.narrative}</p>
                </div>
                <Badge tone="amber">{data.project.health_status}</Badge>
              </div>
            </div>

            <div className="grid gap-3 p-6 md:grid-cols-3">
              <Mini label="Delivery method" value={format(data.project.delivery_method)} />
              <Mini label="Risk focus" value={format(data.project.risk_focus)} />
              <Mini label="Complexity" value={format(data.project.complexity)} />
            </div>
          </Card>

          <Card>
            <div className="border-b border-border p-5">
              <h2 className="text-sm font-black">Persisted RAID Items</h2>
              <p className="text-xs text-muted">Saved to Supabase from Guided Setup Intelligence</p>
            </div>

            {data.raidItems.map((item) => (
              <div key={item.id} className="grid gap-4 border-b border-border p-5 text-sm last:border-0 lg:grid-cols-[1fr_1fr_120px]">
                <div>
                  <div className="font-black text-ink">{item.title}</div>
                  <div className="mt-1 text-xs text-muted">Owner: {item.owner || "Unassigned"}</div>
                </div>
                <div className="text-muted">{item.trigger}</div>
                <Badge tone={item.impact >= 15 ? "red" : "amber"}>Score {item.impact}</Badge>
              </div>
            ))}
          </Card>

          <Card>
            <div className="border-b border-border p-5"><h2 className="text-sm font-black">Impact Events</h2></div>
            {data.impactEvents.map((event) => (
              <div key={event.id} className="border-b border-border p-5 last:border-0">
                <div className="text-sm font-black">{event.title}</div>
                <p className="mt-1 text-xs leading-5 text-muted">{event.description}</p>
              </div>
            ))}
          </Card>
        </div>
      )}
    </AppShell>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="text-[10px] font-black uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-1 text-sm font-black text-accent">{value}</div>
    </div>
  );
}

function format(value: string) {
  return value.replaceAll("_", " ").replace("safe", "SAFe").replace(/\b\w/g, (char) => char.toUpperCase());
}

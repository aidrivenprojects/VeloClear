"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchProjects, fetchRaidItems } from "@/lib/projectPersistence";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type ProjectRow = {
  id: string;
  name: string;
  delivery_method: string;
  complexity: string;
  risk_focus: string;
  health_status: string;
  narrative: string | null;
  created_at: string;
};

type RaidRow = {
  id: string;
  project_id: string;
  title: string;
  trigger: string | null;
  mitigation: string | null;
  owner: string | null;
  status: string;
  probability: number | null;
  impact: number | null;
  projects?: { name?: string; health_status?: string; risk_focus?: string } | null;
};

export function LiveDashboard() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [raidItems, setRaidItems] = useState<RaidRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [projectData, raidData] = await Promise.all([fetchProjects(), fetchRaidItems()]);
      setProjects(projectData as ProjectRow[]);
      setRaidItems(raidData as RaidRow[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load portfolio intelligence.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const metrics = useMemo(() => {
    const highRisks = raidItems.filter((item) => Number(item.impact ?? 0) >= 15).length;
    const amberProjects = projects.filter((project) => project.health_status === "amber").length;
    const vendorProjects = projects.filter((project) => project.risk_focus === "vendor_dependency").length;

    return {
      activeProjects: projects.length,
      highRisks,
      amberProjects,
      vendorProjects
    };
  }, [projects, raidItems]);

  const pattern = useMemo(() => {
    if (metrics.vendorProjects >= 2) {
      return "Vendor dependency drift is recurring across saved workspaces. Recommended action: create a shared vendor milestone control.";
    }

    if (metrics.highRisks >= 3) {
      return "High-risk RAID items are accumulating. Recommended action: schedule a governance checkpoint before the next steering cycle.";
    }

    if (projects.length > 0) {
      return "Portfolio intelligence is active. Add more workspaces to detect cross-project delivery patterns.";
    }

    return "No saved workspaces yet. Generate a workspace to activate portfolio intelligence.";
  }, [metrics, projects.length]);

  if (loading) {
    return <Card className="p-8"><div className="text-sm font-black text-muted">Loading live portfolio intelligence…</div></Card>;
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-sm font-black text-red">{error}</div>
        <button onClick={loadData} className="mt-4 rounded-xl bg-accent px-4 py-2 text-sm font-black text-white">Retry</button>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-5 xl:grid-cols-[1.2fr_.9fr]">
        <Card className="p-7">
          <div className="text-xs font-black uppercase tracking-wider text-accent">Live delivery narrative</div>
          <h1 className="mt-4 max-w-4xl text-[46px] font-black leading-[0.98] tracking-[-0.06em] text-ink">
            Portfolio intelligence is now connected to saved delivery workspaces.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-ink2">
            VeloClear is reading live projects, RAID items and generated workspace narratives from Supabase.
          </p>
        </Card>

        <Card className="p-7">
          <div className="rounded-3xl bg-accentBg p-6 text-[#312E81]">
            <div className="text-sm font-black">Emerging pattern</div>
            <p className="mt-3 text-lg leading-8">{pattern}</p>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Saved Projects" value={metrics.activeProjects} />
        <MetricCard label="High Risks" value={metrics.highRisks} tone="red" />
        <MetricCard label="Amber Projects" value={metrics.amberProjects} tone="amber" />
        <MetricCard label="Vendor Focus" value={metrics.vendorProjects} tone="green" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <Card>
          <div className="border-b border-border p-5">
            <h2 className="text-sm font-black">Live Portfolio Summary</h2>
            <p className="text-xs text-muted">Pulled from Supabase projects</p>
          </div>

          {projects.length === 0 ? (
            <div className="p-5">
              <Link href="/projects/new" className="inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-black text-white">
                Generate first workspace
              </Link>
            </div>
          ) : (
            projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="block border-b border-border p-5 transition last:border-0 hover:bg-surface">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-black text-ink">{project.name}</div>
                    <p className="mt-1 max-w-3xl text-xs leading-5 text-muted">{project.narrative}</p>
                  </div>
                  <Badge tone={project.health_status === "green" ? "green" : "amber"}>{project.health_status}</Badge>
                </div>
              </Link>
            ))
          )}
        </Card>

        <Card>
          <div className="border-b border-border p-5">
            <h2 className="text-sm font-black">Top RAID Signals</h2>
            <p className="text-xs text-muted">Highest impact items across saved workspaces</p>
          </div>

          {raidItems.slice(0, 5).map((item) => (
            <div key={item.id} className="border-b border-border p-5 last:border-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-black">{item.title}</div>
                  <div className="mt-1 text-xs text-muted">{item.projects?.name ?? "Workspace"}</div>
                </div>
                <Badge tone={Number(item.impact ?? 0) >= 15 ? "red" : "amber"}>Score {item.impact ?? 0}</Badge>
              </div>
            </div>
          ))}

          {raidItems.length === 0 && (
            <div className="p-5 text-sm font-bold text-muted">No RAID items saved yet.</div>
          )}
        </Card>
      </section>
    </div>
  );
}

function MetricCard({ label, value, tone = "indigo" }: { label: string; value: number; tone?: "indigo" | "red" | "amber" | "green" }) {
  const colorClass =
    tone === "red" ? "text-red" :
    tone === "amber" ? "text-amber" :
    tone === "green" ? "text-green" :
    "text-accent";

  return (
    <Card className="p-5">
      <div className={`font-mono text-4xl font-bold ${colorClass}`}>{value}</div>
      <div className="mt-2 text-[10px] font-black uppercase tracking-wider text-muted">{label}</div>
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProjects } from "@/lib/projectPersistence";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
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

export function PersistedDashboard() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then((data) => setProjects(data as ProjectRow[]))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Card className="p-8"><div className="text-sm font-black text-muted">Loading saved delivery workspaces…</div></Card>;
  if (projects.length === 0) return <DashboardOverview />;

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Saved projects" value={String(projects.length)} />
        <SummaryCard label="Amber health" value={String(projects.filter((p) => p.health_status === "amber").length)} tone="amber" />
        <SummaryCard label="Vendor focus" value={String(projects.filter((p) => p.risk_focus === "vendor_dependency").length)} />
        <SummaryCard label="Enterprise" value={String(projects.filter((p) => p.complexity.includes("enterprise")).length)} tone="green" />
      </section>

      <Card>
        <div className="border-b border-border p-5">
          <h2 className="text-sm font-black">Saved VeloClear Workspaces</h2>
          <p className="text-xs text-muted">Generated from Guided Setup Intelligence</p>
        </div>

        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="block border-b border-border px-5 py-4 transition last:border-0 hover:bg-surface">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-black text-ink">{project.name}</div>
                <p className="mt-1 max-w-3xl text-xs leading-5 text-muted">{project.narrative}</p>
              </div>
              <Badge tone="amber">{project.health_status}</Badge>
            </div>
          </Link>
        ))}
      </Card>
    </div>
  );
}

function SummaryCard({ label, value, tone = "indigo" }: { label: string; value: string; tone?: "indigo" | "amber" | "green" }) {
  return (
    <Card className="p-5">
      <div className={tone === "green" ? "font-mono text-3xl font-bold text-green" : tone === "amber" ? "font-mono text-3xl font-bold text-amber" : "font-mono text-3xl font-bold text-accent"}>{value}</div>
      <div className="mt-2 text-[10px] font-black uppercase tracking-wider text-muted">{label}</div>
    </Card>
  );
}

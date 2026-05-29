"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchProjects, fetchRaidItems } from "@/lib/projectPersistence";
import { scoreProjectHealth, recommendedGovernanceAction } from "@/lib/intelligenceEngine";
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
  impact: number | null;
  status: string;
  title: string;
};

export function ProjectList() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [raidItems, setRaidItems] = useState<RaidRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchProjects(), fetchRaidItems()])
      .then(([projectData, raidData]) => {
        setProjects(projectData as ProjectRow[]);
        setRaidItems(raidData as RaidRow[]);
      })
      .finally(() => setLoading(false));
  }, []);

  const enriched = useMemo(() => {
    return projects.map((project) => {
      const projectRaid = raidItems.filter((item) => item.project_id === project.id);
      const health = scoreProjectHealth(project, projectRaid);
      return {
        ...project,
        health,
        raidCount: projectRaid.length,
        highRiskCount: projectRaid.filter((item) => Number(item.impact ?? 0) >= 15).length,
        action: recommendedGovernanceAction(project, projectRaid)
      };
    });
  }, [projects, raidItems]);

  if (loading) {
    return <Card className="p-8"><div className="text-sm font-black text-muted">Loading projects…</div></Card>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-black tracking-[-0.05em] text-ink">Projects</h1>
          <p className="mt-2 text-sm text-muted">Browse saved delivery workspaces and open individual project intelligence.</p>
        </div>
        <Link href="/projects/new" className="rounded-2xl bg-accent px-5 py-3 text-sm font-black text-white shadow-soft">
          + New Workspace
        </Link>
      </div>

      <div className="grid gap-4">
        {enriched.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="block">
            <Card className="p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-black text-ink">{project.name}</h2>
                    <Badge tone={project.health === "red" ? "red" : project.health === "green" ? "green" : "amber"}>{project.health}</Badge>
                  </div>
                  <p className="mt-2 max-w-4xl text-sm leading-6 text-ink2">{project.narrative}</p>
                  <p className="mt-3 text-xs font-bold text-accent">{project.action}</p>
                </div>
                <div className="grid min-w-[220px] gap-2 text-xs font-bold text-muted">
                  <span>RAID items: {project.raidCount}</span>
                  <span>High risks: {project.highRiskCount}</span>
                  <span>Focus: {format(project.risk_focus)}</span>
                  <span>Complexity: {format(project.complexity)}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {enriched.length === 0 && (
          <Card className="p-8">
            <p className="mb-4 text-sm text-muted">No saved projects yet.</p>
            <Link href="/projects/new" className="inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-black text-white">
              Generate first workspace
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}

function format(value: string) {
  return value.replaceAll("_", " ").replace("safe", "SAFe").replace(/\b\w/g, (char) => char.toUpperCase());
}

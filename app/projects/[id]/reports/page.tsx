"use client";
import { Shell } from "@/components/Shell";
import { Card, Badge } from "@/components/ui";
import { getProject, recordsForProject, signals } from "@/lib/store";

function tone(v: string) { return v === "red" ? "red" : v === "green" ? "green" : "amber"; }

export default function Page({ params }: { params: { id: string } }) {
  const project = getProject(params.id);
  const records = recordsForProject(project.id);
  const projectSignals = signals(project.id);
  const red = records.filter((r) => r.severity === "red");
  const amber = records.filter((r) => r.severity === "amber");

  return (
    <Shell title="Reports" kicker={`Project: ${project.name}`}>
      <div className="space-y-6">
        <Card className="p-8">
          <div className="flex justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-ink">Sponsor Report</h2>
              <p className="mt-3 text-sm text-ink2">{project.name} has {records.length} records, {red.length} red, {amber.length} amber, and {projectSignals.length} active signal(s).</p>
            </div>
            <Badge tone={tone(project.health)}>{project.health}</Badge>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-black text-ink">Recommended governance actions</h3>
          <div className="mt-4 grid gap-3">
            {projectSignals.map((signal) => (
              <div key={signal.title} className="rounded-2xl bg-surface p-4">
                <div className="text-sm font-black text-ink">{signal.title}</div>
                <p className="mt-1 text-xs text-muted">{signal.recommendation}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

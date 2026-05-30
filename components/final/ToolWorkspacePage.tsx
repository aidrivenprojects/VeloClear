import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getPhase, getTool } from "@/lib/finalStructure";

function tone(status: string) {
  if (status === "red") return "red";
  if (status === "green") return "green";
  return "amber";
}

export function ToolWorkspacePage({
  phaseSlug,
  toolSlug,
  projectId
}: {
  phaseSlug: string;
  toolSlug: string;
  projectId?: string;
}) {
  const phase = getPhase(phaseSlug);
  const tool = getTool(phaseSlug, toolSlug);
  const prefix = projectId ? `/projects/${projectId}` : "";

  return (
    <AppShell title={tool.title} kicker={`${phase.title} / Tool Workspace`}>
      <div className="space-y-5">
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link href={`${prefix}/lifecycle/${phase.slug}`} className="text-xs font-black uppercase tracking-wider text-accent">
                ← Phase {phase.number}: {phase.title}
              </Link>
              <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-ink">{tool.title}</h1>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">{tool.purpose}</p>
            </div>
            <Badge tone={projectId ? "green" : "amber"}>{projectId ? "Project-bound" : "Demo tool"}</Badge>
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[1fr_.9fr]">
          <Card className="p-5">
            <h2 className="text-sm font-black text-ink">What this captures</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {tool.captures.map((item) => (
                <div key={item} className="rounded-2xl border border-border bg-surface p-4 text-xs font-bold leading-5 text-muted">
                  • {item}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-black text-ink">Connected to</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {tool.connectedTo.map((item) => (
                <span key={item} className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-black text-muted">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-accentBg p-4 text-xs font-bold leading-5 text-[#312E81]">
              Intelligence: {tool.intelligence}
            </div>
          </Card>
        </div>

        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-ink">Connected records</h2>
              <p className="mt-1 text-xs text-muted">These sample records demonstrate the operational structure to be persisted into the graph engine.</p>
            </div>
            <Link href={projectId ? `/projects/${projectId}/trace` : "/trace"} className="rounded-xl bg-accent px-4 py-2 text-xs font-black text-white">
              Open impact trace
            </Link>
          </div>

          <div className="mt-5 grid gap-3">
            {tool.sampleRecords.map((record) => (
              <div key={record.title} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-black text-ink">{record.title}</div>
                    <div className="mt-1 text-xs text-muted">Owner: {record.owner}</div>
                  </div>
                  <Badge tone={tone(record.status)}>{record.status}</Badge>
                </div>
                <div className="mt-3 rounded-xl bg-surface p-3 text-xs font-bold leading-5 text-muted">
                  Signal: {record.signal}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

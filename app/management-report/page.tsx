import { Shell } from "@/components/Shell";
import { Card, Badge } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { ensureDefaultOrganisation } from "@/lib/actions";

function tone(v: string) { return v === "red" ? "red" : v === "green" ? "green" : "amber"; }

export default async function Page() {
  const orgId = await ensureDefaultOrganisation();
  const supabase = await createClient();
  const { data: projects } = await supabase.from("projects").select("*").eq("organisation_id", orgId);
  const ids = (projects ?? []).map((p) => p.id);
  const { data: records } = ids.length ? await supabase.from("delivery_records").select("*").in("project_id", ids) : { data: [] };
  const { data: signals } = ids.length ? await supabase.from("delivery_signals").select("*").in("project_id", ids) : { data: [] };
  const red = (records ?? []).filter((r) => r.severity === "red").length;
  const amber = (records ?? []).filter((r) => r.severity === "amber").length;

  return (
    <Shell title="Management Report" kicker="Executive View" pathname="/management-report">
      <div className="space-y-6">
        <Card className="overflow-hidden p-0">
          <div className="bg-sidebar p-8 text-white">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Enterprise Transformation Portfolio</div>
            <h2 className="mt-3 max-w-5xl text-4xl font-black tracking-[-0.05em]">VeloClear Delivery Governance Report</h2>
            <p className="mt-4 max-w-5xl text-sm leading-6 text-white/65">Supabase-backed evidence report generated from live project, record, signal and audit data.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Badge tone={red > 0 ? "red" : amber > 0 ? "amber" : "green"}>{red > 0 ? "Red" : amber > 0 ? "Amber" : "Green"}</Badge>
              <Badge tone="amber">{projects?.length ?? 0} Projects</Badge>
              <Badge tone="amber">{signals?.length ?? 0} Signals</Badge>
            </div>
          </div>
        </Card>
        <div className="grid gap-5 xl:grid-cols-4">
          <Metric label="Projects" value={projects?.length ?? 0} />
          <Metric label="Records" value={records?.length ?? 0} />
          <Metric label="Red Items" value={red} />
          <Metric label="Signals" value={signals?.length ?? 0} />
        </div>
        <Card className="p-6">
          <h3 className="text-xl font-black text-ink">Expandable Governance Dashboard</h3>
          <details open className="mt-4 rounded-2xl bg-surface p-4">
            <summary className="cursor-pointer text-sm font-black text-ink">Open governance evidence</summary>
            <div className="mt-4 grid gap-3">
              {(projects ?? []).map((project) => (
                <a key={project.id} href={`/projects/${project.id}`} className="rounded-2xl bg-white p-4">
                  <div className="flex justify-between gap-3">
                    <div>
                      <div className="text-sm font-black text-ink">{project.name}</div>
                      <p className="mt-1 text-xs text-muted">{project.summary}</p>
                    </div>
                    <Badge tone={tone(project.health)}>{project.health}</Badge>
                  </div>
                </a>
              ))}
            </div>
          </details>
        </Card>
      </div>
    </Shell>
  );
}
function Metric({ label, value }: { label: string; value: number }) {
  return <Card className="p-5"><div className="text-xs font-black uppercase tracking-wider text-muted">{label}</div><div className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">{value}</div></Card>;
}

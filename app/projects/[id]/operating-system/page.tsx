import { Shell } from "@/components/Shell";
import { Card, Badge } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

function tone(v: string) { return v === "red" ? "red" : v === "green" ? "green" : "amber"; }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  const { data: records } = await supabase.from("delivery_records").select("*").eq("project_id", id).order("created_at");
  const { data: rels } = await supabase.from("delivery_relationships").select("*").eq("project_id", id);
  const { data: signals } = await supabase.from("delivery_signals").select("*").eq("project_id", id).order("created_at", { ascending: false });
  if (!project) return <Shell title="Not found" pathname={`/projects/${id}/operating-system`} projectId={id}>Not found.</Shell>;
  return (
    <Shell title="Operating System" kicker={`Project: ${project.name}`} pathname={`/projects/${id}/operating-system`} projectId={id} projectName={project.name}>
      <div className="space-y-6">
        <div className="grid gap-5 xl:grid-cols-3">
          <Card className="p-5"><div className="text-xs font-black uppercase text-muted">Records</div><div className="mt-2 text-3xl font-black">{records?.length ?? 0}</div></Card>
          <Card className="p-5"><div className="text-xs font-black uppercase text-muted">Relationships</div><div className="mt-2 text-3xl font-black">{rels?.length ?? 0}</div></Card>
          <Card className="p-5"><div className="text-xs font-black uppercase text-muted">Signals</div><div className="mt-2 text-3xl font-black">{signals?.length ?? 0}</div></Card>
        </div>
        <Card className="p-6">
          <h3 className="text-sm font-black text-ink">Connected records</h3>
          <div className="mt-4 grid gap-3">
            {(records ?? []).map((record) => (
              <div key={record.id} className="rounded-2xl border border-border bg-surface p-4">
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase text-muted">{record.record_type} · {record.phase_slug}/{record.tool_slug}</div>
                    <div className="mt-1 text-sm font-black text-ink">{record.title}</div>
                  </div>
                  <Badge tone={tone(record.severity)}>{record.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-black text-ink">Signals</h3>
          <div className="mt-4 grid gap-3">
            {(signals ?? []).map((signal) => (
              <div key={signal.id} className="rounded-2xl bg-surface p-4">
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="text-sm font-black text-ink">{signal.title}</div>
                    <p className="mt-1 text-xs text-muted">{signal.explanation}</p>
                    <div className="mt-2 text-xs font-bold text-accent">{signal.recommendation}</div>
                  </div>
                  <Badge tone={tone(signal.severity)}>{signal.severity}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

import { Shell } from "@/components/Shell";
import { Card, Badge } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { addRecord, updateRecordSeverity } from "@/lib/actions";

function tone(v: string) { return v === "red" ? "red" : v === "green" ? "green" : "amber"; }

export default async function Page({ params }: { params: Promise<{ id: string; phase: string; tool: string }> }) {
  const { id, phase, tool } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  const { data: toolRow } = await supabase.from("project_tools").select("*").eq("project_id", id).eq("phase_slug", phase).eq("tool_slug", tool).single();
  const { data: records } = await supabase.from("delivery_records").select("*").eq("project_id", id).eq("phase_slug", phase).eq("tool_slug", tool).order("created_at", { ascending: false });
  if (!project || !toolRow) return <Shell title="Not found" pathname={`/projects/${id}/lifecycle/${phase}/${tool}`} projectId={id}>Not found.</Shell>;

  return (
    <Shell title={toolRow.title} kicker={`Project: ${project.name}`} pathname={`/projects/${id}/lifecycle/${phase}/${tool}`} projectId={id} projectName={project.name}>
      <div className="space-y-6">
        <Card className="p-8">
          <div className="text-xs font-black uppercase tracking-wider text-accent">{phase}</div>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">{toolRow.title}</h2>
          <p className="mt-3 text-sm text-ink2">{toolRow.description}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-black text-ink">Add record</h3>
          <form action={addRecord} className="mt-4 grid gap-3">
            <input type="hidden" name="projectId" value={id} />
            <input type="hidden" name="phaseSlug" value={phase} />
            <input type="hidden" name="toolSlug" value={tool} />
            <input name="title" required placeholder="Record title" className="rounded-2xl border border-border bg-surface p-4 text-sm font-bold outline-none" />
            <textarea name="description" placeholder="Description" className="min-h-[90px] rounded-2xl border border-border bg-surface p-4 text-sm font-bold outline-none" />
            <button className="w-fit rounded-xl bg-accent px-4 py-2 text-sm font-black text-white">Add record</button>
          </form>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-black text-ink">Records</h3>
          <div className="mt-4 grid gap-3">
            {(records ?? []).map((record) => (
              <div key={record.id} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <div className="text-sm font-black text-ink">{record.title}</div>
                    <p className="mt-1 text-xs leading-5 text-muted">{record.description}</p>
                    <div className="mt-2 text-xs text-muted">Owner: {record.owner_name}</div>
                  </div>
                  <Badge tone={tone(record.severity)}>{record.status}</Badge>
                </div>
                <div className="mt-4 flex gap-2">
                  {["green","amber","red"].map((sev) => (
                    <form action={updateRecordSeverity} key={sev}>
                      <input type="hidden" name="projectId" value={id} />
                      <input type="hidden" name="phaseSlug" value={phase} />
                      <input type="hidden" name="toolSlug" value={tool} />
                      <input type="hidden" name="recordId" value={record.id} />
                      <input type="hidden" name="severity" value={sev} />
                      <button className={`rounded-lg px-3 py-1 text-xs font-black ${sev === "green" ? "bg-greenBg text-green" : sev === "red" ? "bg-redBg text-red" : "bg-amberBg text-amber"}`}>{sev}</button>
                    </form>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

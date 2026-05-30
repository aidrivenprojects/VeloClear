import { Shell } from "@/components/Shell";
import { Card, Badge } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

function tone(v: string) { return v === "red" ? "red" : v === "green" ? "green" : "amber"; }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  const { data: phases } = await supabase.from("project_phases").select("*").eq("project_id", id).order("phase_number");
  const { data: records } = await supabase.from("delivery_records").select("*").eq("project_id", id);
  const { data: rels } = await supabase.from("delivery_relationships").select("*").eq("project_id", id);
  const { data: signals } = await supabase.from("delivery_signals").select("*").eq("project_id", id);
  if (!project) return <Shell title="Not found" pathname={`/projects/${id}`}>Project not found.</Shell>;

  return (
    <Shell title={project.name} kicker="Project Workspace" pathname={`/projects/${id}`} projectId={id} projectName={project.name}>
      <div className="space-y-6">
        <Card className="p-8">
          <div className="flex justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-accent">Project</div>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">{project.name}</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">{project.summary}</p>
            </div>
            <Badge tone={tone(project.health)}>{project.health}</Badge>
          </div>
        </Card>
        <div className="grid gap-5 xl:grid-cols-4">
          <Metric label="Records" value={records?.length ?? 0} />
          <Metric label="Relationships" value={rels?.length ?? 0} />
          <Metric label="Signals" value={signals?.length ?? 0} />
          <Metric label="Phases" value={phases?.length ?? 0} />
        </div>
        <Card className="p-6">
          <h3 className="text-sm font-black text-ink">Lifecycle phases</h3>
          <div className="mt-5 grid gap-4">
            {(phases ?? []).map((phase) => (
              <a key={phase.id} href={`/projects/${id}/lifecycle/${phase.phase_slug}`} className="rounded-3xl border border-border bg-white p-5">
                <div className="text-xs font-black uppercase tracking-wider text-accent">Phase {phase.phase_number}</div>
                <h4 className="mt-1 text-xl font-black text-ink">{phase.title}</h4>
                <p className="mt-2 text-sm text-muted">{phase.purpose}</p>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}
function Metric({ label, value }: { label: string; value: number }) {
  return <Card className="p-5"><div className="text-xs font-black uppercase tracking-wider text-muted">{label}</div><div className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">{value}</div></Card>;
}

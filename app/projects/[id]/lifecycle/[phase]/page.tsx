import { Shell } from "@/components/Shell";
import { Card } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

export default async function Page({ params }: { params: Promise<{ id: string; phase: string }> }) {
  const { id, phase } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  const { data: phaseRow } = await supabase.from("project_phases").select("*").eq("project_id", id).eq("phase_slug", phase).single();
  const { data: tools } = await supabase.from("project_tools").select("*").eq("project_id", id).eq("phase_slug", phase).order("title");
  const { data: records } = await supabase.from("delivery_records").select("*").eq("project_id", id).eq("phase_slug", phase);
  if (!project || !phaseRow) return <Shell title="Not found" pathname={`/projects/${id}/lifecycle/${phase}`} projectId={id}>Not found.</Shell>;
  return (
    <Shell title={phaseRow.title} kicker={`Project: ${project.name}`} pathname={`/projects/${id}/lifecycle/${phase}`} projectId={id} projectName={project.name}>
      <div className="space-y-6">
        <Card className="p-8">
          <div className="text-xs font-black uppercase tracking-wider text-accent">Phase {phaseRow.phase_number}</div>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">{phaseRow.title}</h2>
          <p className="mt-3 text-sm text-ink2">{phaseRow.purpose}</p>
          <p className="mt-3 text-xs font-bold text-muted">{records?.length ?? 0} record(s) in this phase.</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-black text-ink">Tools inside this phase</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(tools ?? []).map((tool) => (
              <a key={tool.id} href={`/projects/${id}/lifecycle/${phase}/${tool.tool_slug}`} className="rounded-2xl border border-border bg-surface p-4 transition hover:border-accent/50">
                <h4 className="text-sm font-black text-ink">{tool.title}</h4>
                <p className="mt-2 text-xs leading-5 text-muted">{tool.description}</p>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

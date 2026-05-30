import { Shell } from "@/components/Shell";
import { Card } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  const { data: audit } = await supabase.from("audit_events").select("*").eq("project_id", id).order("created_at", { ascending: false });
  if (!project) return <Shell title="Not found" pathname={`/projects/${id}/audit`} projectId={id}>Not found.</Shell>;
  return (
    <Shell title="Audit Trail" kicker={`Project: ${project.name}`} pathname={`/projects/${id}/audit`} projectId={id} projectName={project.name}>
      <Card className="p-6">
        <div className="grid gap-3">
          {(audit ?? []).map((event) => (
            <div key={event.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="text-sm font-black text-ink">{event.action}: {event.entity_title}</div>
              <div className="mt-1 text-xs text-muted">{event.entity_type} · {new Date(event.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </Card>
    </Shell>
  );
}

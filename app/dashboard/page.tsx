import { Shell } from "@/components/Shell";
import { Card, Badge } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { ensureDefaultOrganisation } from "@/lib/actions";

function tone(v: string) { return v === "red" ? "red" : v === "green" ? "green" : "amber"; }

export default async function Page() {
  const orgId = await ensureDefaultOrganisation();
  const supabase = await createClient();
  const { data: projects } = await supabase.from("projects").select("*").eq("organisation_id", orgId).order("created_at", { ascending: false });
  const ids = (projects ?? []).map((p) => p.id);
  const { data: records } = ids.length ? await supabase.from("delivery_records").select("*").in("project_id", ids) : { data: [] };
  const { data: signals } = ids.length ? await supabase.from("delivery_signals").select("*").in("project_id", ids) : { data: [] };

  return (
    <Shell title="Dashboard" kicker="Portfolio" pathname="/dashboard">
      <div className="space-y-6">
        <div className="grid gap-5 xl:grid-cols-3">
          <Card className="p-6"><div className="text-xs font-black uppercase text-muted">Projects</div><div className="mt-2 text-4xl font-black text-ink">{projects?.length ?? 0}</div></Card>
          <Card className="p-6"><div className="text-xs font-black uppercase text-muted">Records</div><div className="mt-2 text-4xl font-black text-ink">{records?.length ?? 0}</div></Card>
          <Card className="p-6"><div className="text-xs font-black uppercase text-muted">Signals</div><div className="mt-2 text-4xl font-black text-ink">{signals?.length ?? 0}</div></Card>
        </div>
        <Card className="p-6">
          <h2 className="text-sm font-black text-ink">Project health</h2>
          <div className="mt-4 grid gap-3">
            {(projects ?? []).map((p) => (
              <a key={p.id} href={`/projects/${p.id}`} className="rounded-2xl border border-border bg-surface p-4">
                <div className="flex justify-between gap-3">
                  <div className="text-sm font-black text-ink">{p.name}</div>
                  <Badge tone={tone(p.health)}>{p.health}</Badge>
                </div>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

import { Shell } from "@/components/Shell";
import { Card, Badge } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { ensureDefaultOrganisation } from "@/lib/actions";

function tone(v: string) { return v === "red" ? "red" : v === "green" ? "green" : "amber"; }

export default async function Page() {
  const orgId = await ensureDefaultOrganisation();
  const supabase = await createClient();
  const { data: projects } = await supabase.from("projects").select("*").eq("organisation_id", orgId).order("created_at", { ascending: false });
  return (
    <Shell title="Projects" kicker="Portfolio" pathname="/projects">
      <div className="space-y-6">
        <Card className="p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-accent">Project Registry</div>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">Select a project or create a new one.</h2>
            </div>
            <a href="/new-project" className="rounded-xl bg-accent px-5 py-3 text-sm font-black text-white">+ New Project</a>
          </div>
        </Card>
        <div className="grid gap-5 lg:grid-cols-3">
          {(projects ?? []).map((p) => (
            <a key={p.id} href={`/projects/${p.id}`}>
              <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-accent/50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-muted">{p.methodology}</div>
                    <h3 className="mt-2 text-xl font-black text-ink">{p.name}</h3>
                  </div>
                  <Badge tone={tone(p.health)}>{p.health}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink2">{p.summary}</p>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </Shell>
  );
}

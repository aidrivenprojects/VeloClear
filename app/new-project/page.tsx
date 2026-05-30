import { Shell } from "@/components/Shell";
import { Card } from "@/components/ui";
import { createProject } from "@/lib/actions";

export default function Page() {
  return (
    <Shell title="New Project" kicker="Create" pathname="/new-project">
      <div className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
        <Card className="p-8">
          <h2 className="text-3xl font-black tracking-[-0.04em] text-ink">Generate a connected project workspace.</h2>
          <form action={createProject} className="mt-6 grid gap-4">
            <input name="name" required placeholder="Project name" className="rounded-2xl border border-border bg-surface p-4 text-sm font-bold outline-none" />
            <select name="methodology" className="rounded-2xl border border-border bg-surface p-4 text-sm font-bold outline-none">
              <option>Hybrid</option><option>PMBOK</option><option>Agile / Scrum</option><option>SAFe</option>
            </select>
            <textarea name="summary" placeholder="Workflow, objective, users, governance needs..." className="min-h-[180px] rounded-2xl border border-border bg-surface p-4 text-sm font-bold outline-none" />
            <button className="w-fit rounded-xl bg-accent px-5 py-3 text-sm font-black text-white">Generate Project</button>
          </form>
        </Card>
        <Card className="p-8">
          <div className="text-xs font-black uppercase tracking-wider text-accent">Generated in Supabase</div>
          {["8 lifecycle phases", "Nested tools", "Starter records", "Relationships", "Audit events", "Signals", "RLS-protected membership"].map((item) => (
            <div key={item} className="mt-3 rounded-2xl border border-border bg-surface p-3 text-sm font-black text-ink">✓ {item}</div>
          ))}
        </Card>
      </div>
    </Shell>
  );
}

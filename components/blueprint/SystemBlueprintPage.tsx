import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { blueprintModules } from "@/lib/blueprintModel";

const layers = ["Enterprise Shell","Discovery Engine","Lifecycle Engine","Delivery Engine","Governance Engine","Intelligence Engine","Learning Engine","Reporting & Integration"];
const roles = ["Super Admin","Org Admin","Portfolio Manager","Programme Manager","Project Manager","Scrum Master","Product Owner","Team Member","Sponsor","Auditor"];

export function SystemBlueprintPage() {
  return (
    <AppShell title="System Blueprint" kicker="VeloClear">
      <div className="space-y-5">
        <Card className="p-6">
          <div className="text-xs font-black uppercase tracking-wider text-accent">Delivery Intelligence OS</div>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">VeloClear connects PM toolkit, agile delivery, governance and learning.</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">This build turns the original blueprint into a navigable product structure: discovery flows into lifecycle phases, product backlog, sprint tracking, RAID, governance, EVM, impact trace and institutional learning.</p>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">Platform layers</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {layers.map((layer) => <div key={layer} className="rounded-2xl border border-border bg-surface p-4 text-sm font-black text-ink">{layer}</div>)}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">PM toolkit modules</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {blueprintModules.map((module) => (
              <Link key={module.key} href={`/toolkit/${module.key}`} className="rounded-2xl border border-border bg-white p-4 transition hover:-translate-y-0.5 hover:border-accent/40">
                <div className="text-sm font-black text-ink">{module.title}</div>
                <p className="mt-2 text-xs leading-5 text-muted">{module.standard}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">Role-based views</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {roles.map((role) => <span key={role} className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-black text-muted">{role}</span>)}
          </div>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Link href="/delivery-graph" className="rounded-xl bg-accent px-4 py-3 text-sm font-black text-white">Open Delivery Graph</Link>
          <Link href="/discover" className="rounded-xl border border-border bg-white px-4 py-3 text-sm font-black text-ink">Start Discovery</Link>
        </div>
      </div>
    </AppShell>
  );
}

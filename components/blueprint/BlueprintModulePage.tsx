import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { getBlueprintModule, blueprintModules } from "@/lib/blueprintModel";

export function BlueprintModulePage({ moduleKey }: { moduleKey: string }) {
  const module = getBlueprintModule(moduleKey);
  return (
    <AppShell title={module.title} kicker="Delivery Toolkit">
      <div className="space-y-5">
        <Card className="p-6">
          <div className="text-xs font-black uppercase tracking-wider text-accent">{module.standard}</div>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">{module.title}</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">{module.strapline}</p>
          <div className="mt-4 inline-flex rounded-full bg-accentBg px-3 py-1 text-xs font-black text-accent">Lives in: {module.livesIn}</div>
        </Card>
        <div className="grid gap-4 lg:grid-cols-3">
          <Section title="Captures" items={module.captures} />
          <Section title="Tracks" items={module.tracks} />
          <Section title="Intelligence added" items={module.intelligence} accent />
        </div>
        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">Connected to</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {module.links.map((link) => <span key={link} className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-black text-muted">{link}</span>)}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">Toolkit modules</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {blueprintModules.map((item) => (
              <Link key={item.key} href={`/toolkit/${item.key}`} className={item.key === module.key ? "rounded-2xl border border-accent bg-accentBg p-4 text-sm font-black text-accent" : "rounded-2xl border border-border bg-white p-4 text-sm font-black text-ink hover:border-accent/40"}>{item.title}</Link>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function Section({ title, items, accent = false }: { title: string; items: string[]; accent?: boolean }) {
  return (
    <Card className="p-5">
      <h2 className="text-sm font-black text-ink">{title}</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item} className={accent ? "rounded-2xl bg-accentBg p-4 text-xs font-bold leading-5 text-[#312E81]" : "rounded-2xl border border-border bg-surface p-4 text-xs font-bold leading-5 text-muted"}>{accent ? "✦ " : "• "}{item}</div>
        ))}
      </div>
    </Card>
  );
}

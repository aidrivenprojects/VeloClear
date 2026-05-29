export const dynamic = "force-dynamic";

import Link from "next/link";
import { Brand } from "@/components/layout/Brand";
import { DeliveryPulse } from "@/components/demo/DeliveryPulse";
import { IntentCardLink } from "@/components/demo/IntentCardLink";
import { ImportConnectPanelLinks } from "@/components/demo/ImportConnectPanelLinks";
import { intentRoles } from "@/lib/demoData";

export default function DemoPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-page px-5 py-7 md:px-6 md:py-8">
      <div className="mx-auto max-w-[1540px]">
        <header className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Brand />
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/discover"
              className="rounded-full border border-border bg-white/85 px-4 py-2 text-xs font-black text-ink2 shadow-soft transition hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
            >
              Start Discovery
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-border bg-white/85 px-4 py-2 text-xs font-black text-ink2 shadow-soft transition hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
            >
              Portfolio Demo
            </Link>
          </div>
        </header>

        <section className="grid gap-8 xl:grid-cols-[.52fr_1fr]">
          <div className="pt-4 xl:pt-10">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-accent">
              Delivery Intelligence OS
            </div>
            <h1 className="mt-5 max-w-[680px] text-[clamp(48px,5.8vw,88px)] font-black leading-[0.92] tracking-[-0.075em]">
              What are you trying to achieve today?
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-8 text-ink2">
              VeloClear adapts the workspace to your role, delivery environment and current challenge — without making you configure a maze first.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                ["Trace causes", "/impact-trace"],
                ["Trigger governance", "/raid"],
                ["Learn patterns", "/dashboard"]
              ].map(([item, href]) => (
                <Link key={item} href={href} className="rounded-full border border-border bg-white px-4 py-2 text-sm font-black text-ink2 shadow-soft transition hover:text-accent">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <DeliveryPulse />
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {intentRoles.map((role) => (
                <IntentCardLink key={role.id} role={role} />
              ))}
            </div>
          </div>
        </section>

        <ImportConnectPanelLinks />

        <div className="mt-4 grid gap-3 rounded-2xl border border-border bg-white/60 px-5 py-4 text-center text-xs font-black text-muted md:grid-cols-3">
          <span>Enterprise-grade security</span>
          <span>Your data stays yours</span>
          <span>Built for delivery teams</span>
        </div>
      </div>
    </main>
  );
}

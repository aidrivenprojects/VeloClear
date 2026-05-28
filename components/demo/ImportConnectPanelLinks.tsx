import Link from "next/link";
import { connectors } from "@/lib/demoData";

export function ImportConnectPanelLinks() {
  return (
    <section className="mt-4 grid gap-4 lg:grid-cols-[.92fr_1.08fr]">
      <div className="rounded-[18px] border border-border bg-white/90 p-5 shadow-soft">
        <strong className="text-sm">Bring your projects in</strong>
        <p className="mt-1 text-xs text-muted">Upload files or connect tools to get started quickly</p>
        <Link
          href="/integrations"
          className="mt-4 grid min-h-[126px] w-full place-items-center rounded-2xl border-2 border-dashed border-accent/40 bg-accentBg/50 p-5 text-center"
        >
          <div>
            <div className="text-sm font-black text-accent">Drag & drop files here or click to browse</div>
            <div className="mt-1 text-xs text-muted">Excel, MS Project, CSV, PDF, Jira export, Smartsheet</div>
          </div>
        </Link>
        <div className="mt-4 grid gap-2 text-xs text-muted sm:grid-cols-2">
          <strong className="text-ink sm:col-span-2">What we extract</strong>
          <span>✓ Tasks, milestones & dependencies</span>
          <span>✓ Risks, issues & actions</span>
          <span>✓ Resources & assignments</span>
          <span>✓ Baselines & progress</span>
        </div>
      </div>
      <div className="rounded-[18px] border border-border bg-white/90 p-5 shadow-soft">
        <strong className="text-sm">Connect your tools</strong>
        <p className="mt-1 text-xs text-muted">Secure connections keep project data in sync</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {connectors.map((tool) => (
            <Link
              key={tool}
              href="/integrations"
              className="flex h-12 items-center justify-center rounded-xl border border-border bg-white px-3 text-center text-xs font-black text-ink2 shadow-soft transition hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
            >
              {tool}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

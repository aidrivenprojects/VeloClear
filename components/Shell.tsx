import Link from "next/link";
import { Brand } from "@/components/ui";
import { phaseTemplates } from "@/lib/model";
import { signOut } from "@/lib/actions";

function active(path: string, href: string) {
  return path === href || path.startsWith(`${href}/`);
}

export function Shell({
  children,
  title,
  kicker,
  pathname,
  projectId,
  projectName
}: {
  children: React.ReactNode;
  title?: string;
  kicker?: string;
  pathname: string;
  projectId?: string;
  projectName?: string;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 hidden w-[320px] overflow-y-auto bg-sidebar px-4 py-5 text-white lg:block">
        <Brand />
        <form action={signOut} className="my-6 rounded-2xl border border-white/10 bg-white/[0.055] p-3">
          <div className="text-xs font-black text-white/70">Production Workspace</div>
          <p className="mt-2 text-[11px] font-bold leading-5 text-white/45">Supabase Auth + RLS protected.</p>
          <button className="mt-3 w-full rounded-xl bg-white/10 px-3 py-2 text-xs font-black text-white">Sign out</button>
        </form>
        {projectId ? <ProjectSidebar pathname={pathname} projectId={projectId} projectName={projectName} /> : <GlobalSidebar pathname={pathname} />}
      </aside>
      <main className="lg:ml-[320px]">
        <header className="sticky top-0 z-10 border-b border-border bg-white px-8 py-4">
          {kicker && <div className="text-xs font-black uppercase tracking-wider text-ink2">{kicker}</div>}
          {title && <h1 className="text-2xl font-black text-ink">{title}</h1>}
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

function GlobalSidebar({ pathname }: { pathname: string }) {
  const items = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Projects", href: "/projects" },
    { label: "+ New Project", href: "/new-project" },
    { label: "Management Report", href: "/management-report" }
  ];
  return (
    <nav className="space-y-6 pb-10">
      <section className="rounded-2xl bg-white/[0.025] p-2">
        <div className="mb-2 px-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/30">Portfolio</div>
        <div className="grid gap-1">{items.map((item) => <NavItem key={item.href} item={item} pathname={pathname} />)}</div>
      </section>
    </nav>
  );
}

function ProjectSidebar({ pathname, projectId, projectName }: { pathname: string; projectId: string; projectName?: string }) {
  return (
    <nav className="space-y-5 pb-10">
      <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-3">
        <Link href="/projects" className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">← Projects</Link>
        <div className="mt-2 text-sm font-black text-white">Project Workspace</div>
        <div className="mt-1 text-[11px] font-bold text-white/45">{projectName ?? projectId}</div>
      </section>

      <section className="rounded-2xl bg-white/[0.025] p-2">
        <div className="mb-2 px-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/30">Project Controls</div>
        <NavItem pathname={pathname} item={{ label: "Workspace Home", href: `/projects/${projectId}` }} />
        <NavItem pathname={pathname} item={{ label: "Operating System", href: `/projects/${projectId}/operating-system` }} />
        <NavItem pathname={pathname} item={{ label: "Management Report", href: `/projects/${projectId}/management-report` }} />
        <NavItem pathname={pathname} item={{ label: "Audit Trail", href: `/projects/${projectId}/audit` }} />
      </section>

      <section className="rounded-2xl bg-white/[0.025] p-2">
        <div className="mb-3 px-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/30">Project Lifecycle</div>
        <div className="space-y-2">
          {phaseTemplates.map((phase) => {
            const href = `/projects/${projectId}/lifecycle/${phase.phase_slug}`;
            const on = active(pathname, href);
            return (
              <div key={phase.phase_slug} className={on ? "rounded-2xl bg-white/10 p-2" : "rounded-2xl p-2"}>
                <Link href={href} className={on ? "block text-sm font-black text-white" : "block text-sm font-black text-white/65 hover:text-white"}>
                  {phase.phase_number}. {phase.title}
                </Link>
                {on && (
                  <div className="mt-2 grid gap-1 border-l border-white/10 pl-3">
                    {phase.tools.map((tool) => <NavItem key={tool.tool_slug} pathname={pathname} item={{ label: tool.title, href: `/projects/${projectId}/lifecycle/${phase.phase_slug}/${tool.tool_slug}` }} small />)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </nav>
  );
}

function NavItem({ item, pathname, small = false }: { item: { label: string; href: string }; pathname: string; small?: boolean }) {
  return (
    <Link href={item.href} className={active(pathname, item.href) ? `block rounded-xl bg-white/10 px-3 py-2 ${small ? "text-xs" : "text-sm"} font-black text-white` : `block rounded-xl px-3 py-2 ${small ? "text-xs" : "text-sm"} font-bold text-white/55 hover:bg-white/5 hover:text-white`}>
      {item.label}
    </Link>
  );
}

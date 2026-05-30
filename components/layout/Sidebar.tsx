"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "./Brand";

const navGroups = [
  {
    label: "Portfolio",
    items: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Blueprint", href: "/blueprint" },
      { label: "Delivery Graph", href: "/delivery-graph" },
      { label: "Impact Trace", href: "/trace" }
    ]
  },
  {
    label: "Start",
    items: [
      { label: "Discovery", href: "/discover" },
      { label: "Projects", href: "/projects" }
    ]
  },
  {
    label: "Project Lifecycle",
    items: [
      { label: "Initiation", href: "/lifecycle/initiation" },
      { label: "Planning", href: "/lifecycle/planning" },
      { label: "Execution", href: "/lifecycle/execution" },
      { label: "Monitoring & Controlling", href: "/lifecycle/monitoring" },
      { label: "Closure", href: "/lifecycle/closure" }
    ]
  },
  {
    label: "Platform",
    items: [
      { label: "Integrations", href: "/integrations" }
    ]
  }
];

function isActive(pathname: string, href: string) {
  if (href === "/projects") return pathname === "/projects" || pathname.startsWith("/projects/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[280px] overflow-y-auto bg-sidebar px-4 py-5 text-white lg:block">
      <Brand dark />

      <div className="my-6 rounded-2xl border border-white/10 bg-white/[0.055] p-3">
        <div className="mb-3 flex items-center gap-2 text-xs font-black text-white/70">
          <span className="h-2 w-2 rounded-full bg-green shadow-[0_0_12px_#10B981]" />
          Delivery OS model
        </div>
        <div className="grid gap-2 text-[11px] font-bold text-white/45">
          <div className="flex items-center justify-between"><span>Graph</span><strong className="text-green">Connected</strong></div>
          <div className="flex items-center justify-between"><span>Lifecycle</span><strong className="text-amber">Active</strong></div>
          <div className="flex items-center justify-between"><span>Intelligence</span><strong className="text-red">Next</strong></div>
        </div>
      </div>

      <nav className="space-y-6 pb-10">
        {navGroups.map((group) => {
          const groupActive = group.items.some((item) => isActive(pathname, item.href));

          return (
            <section key={group.label} className={groupActive ? "rounded-2xl bg-white/[0.025] p-2" : "p-2"}>
              <div className="mb-2 flex items-center justify-between px-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                <span>{group.label}</span>
                {groupActive && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
              </div>

              <div className="grid gap-1">
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={
                        active
                          ? "flex min-h-9 items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-sm font-black text-white"
                          : "flex min-h-9 items-center justify-between rounded-xl px-3 py-2 text-sm font-bold text-white/55 transition hover:bg-white/5 hover:text-white"
                      }
                    >
                      <span>{item.label}</span>
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </nav>
    </aside>
  );
}

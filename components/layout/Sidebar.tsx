import Link from "next/link";
import { appNav } from "@/lib/demoData";
import { Brand } from "./Brand";

export function Sidebar() {
  const grouped = appNav.reduce<Record<string, typeof appNav>>((a, i) => {
    a[i[0]] ||= [];
    a[i[0]].push(i);
    return a;
  }, {});

  return (
    <aside className="fixed inset-y-0 left-0 w-[240px] overflow-y-auto bg-sidebar px-4 py-5 text-white">
      <Brand dark />

      <div className="my-6 rounded-2xl border border-white/10 bg-white/[0.055] p-3">
        <div className="mb-3 flex items-center gap-2 text-xs font-black text-white/70">
          <span className="h-2 w-2 rounded-full bg-green shadow-[0_0_12px_#10B981]" />
          Delivery workspace live
        </div>
        <div className="grid gap-2 text-[11px] font-bold text-white/45">
          <div className="flex items-center justify-between"><span>Portfolio health</span><strong className="text-green">Stable</strong></div>
          <div className="flex items-center justify-between"><span>Triggered risks</span><strong className="text-amber">2</strong></div>
          <div className="flex items-center justify-between"><span>Pending decisions</span><strong className="text-red">1</strong></div>
        </div>
      </div>

      <nav className="space-y-5">
        {Object.entries(grouped).map(([g, items]) => (
          <div key={g}>
            <div className="mb-2 px-2 text-[9px] font-black uppercase tracking-[0.14em] text-white/25">{g}</div>
            <div className="grid gap-1">
              {items.map((it) => (
                <Link key={it[1]} href={it[1]} className="group relative flex h-9 items-center justify-between rounded-xl px-3 text-sm font-bold text-white/50 transition hover:bg-white/5 hover:text-white">
                  <span>{it[2]}</span>
                  {it[2] === "Guided Setup" && <span className="h-1.5 w-1.5 rounded-full bg-accent opacity-80" />}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

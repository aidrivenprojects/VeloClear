import Link from "next/link";
import type { IntentRole } from "@/lib/types";

function hrefForRole(id: IntentRole["id"]) {
  if (id === "newpm") return "/projects/new";
  if (id === "pm") return "/raid";
  if (id === "programme") return "/projects/new";
  if (id === "portfolio") return "/dashboard";
  if (id === "sponsor") return "/dashboard";
  return "/dashboard";
}

export function IntentCardLink({ role }: { role: IntentRole }) {
  return (
    <Link
      href={hrefForRole(role.id)}
      className="group flex min-h-[218px] flex-col justify-between rounded-[22px] border border-border bg-white/90 p-6 text-left shadow-soft transition hover:-translate-y-1 hover:border-accent/30 hover:shadow-lift"
    >
      <div>
        <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-accentBg text-xl text-accent">✦</div>
        <h3 className="text-[21px] font-black leading-[1.12] tracking-[-0.04em] text-ink">{role.title}</h3>
        <p className="mt-3 text-sm leading-6 text-ink2">{role.description}</p>
      </div>
      <div className="mt-6 flex items-center justify-between text-xs font-black uppercase tracking-wider text-accent">
        {role.preview}
        <span className="transition group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}

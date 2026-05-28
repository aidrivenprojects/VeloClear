import Link from "next/link";

export function DeliveryPulse() {
  const metrics = [
    ["Overall Health", "72%", "↓ 8% vs last sprint", "text-amber"],
    ["At-risk Projects", "4", "↑ 1 vs last sprint", "text-red"],
    ["Overdue Milestones", "7", "↓ 2 vs last sprint", "text-red"],
    ["Active Risks", "23", "↑ 5 vs last sprint", "text-amber"]
  ];

  return (
    <div className="grid overflow-hidden rounded-[18px] border border-border bg-white/90 shadow-soft lg:grid-cols-[1.1fr_repeat(4,.8fr)_1fr]">
      <div className="flex items-center gap-3 border-b border-divider p-4 lg:border-b-0 lg:border-r">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-accentBg text-accent">⌁</div>
        <div>
          <strong className="text-sm">Delivery Pulse</strong>
          <div className="text-xs text-muted">Live portfolio preview</div>
        </div>
      </div>
      {metrics.map(([label, value, note, color]) => (
        <div key={label} className="border-b border-divider p-4 lg:border-b-0 lg:border-r">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted">{label}</div>
          <div className={`font-mono text-3xl font-medium ${color}`}>{value}</div>
          <div className="text-[11px] text-muted">{note}</div>
        </div>
      ))}
      <div className="flex flex-col justify-center gap-2 p-4">
        <div className="text-xs font-bold text-ink2">Embedded insights</div>
        <Link href="/dashboard" className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 text-sm font-black text-ink2 transition hover:border-accent/40 hover:text-accent">
          View workspace
        </Link>
      </div>
    </div>
  );
}

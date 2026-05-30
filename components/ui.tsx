import Link from "next/link";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-border bg-white shadow-sm ${className}`}>{children}</div>;
}

export function Badge({ children, tone = "amber" }: { children: React.ReactNode; tone?: string }) {
  const cls = tone === "green" ? "bg-greenBg text-green" : tone === "red" ? "bg-redBg text-red" : "bg-amberBg text-amber";
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase ${cls}`}>{children}</span>;
}

export function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-lg font-black text-white">VC</div>
      <div>
        <div className="text-2xl font-black text-white">Velo<span className="text-[#8EA2FF]">Clear</span></div>
        <div className="text-[10px] font-black uppercase tracking-[0.26em] text-white/40">Track · Trace · Learn</div>
      </div>
    </Link>
  );
}

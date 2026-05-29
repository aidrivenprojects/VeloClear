import Link from "next/link";
import { lifecyclePhases, normalizePhase, phaseIndex } from "@/lib/lifecycleEngine";

function phaseHref(phase: string) {
  if (phase === "Monitoring & Controlling") return "/lifecycle/monitoring";
  return `/lifecycle/${phase.toLowerCase()}`;
}

export function LifecycleTracker({
  currentPhase,
  completion,
  status
}: {
  currentPhase?: string | null;
  completion?: number | null;
  status?: string | null;
}) {
  const activeIndex = phaseIndex(currentPhase);

  return (
    <div className="rounded-3xl border border-border bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider text-muted">Delivery lifecycle</div>
          <div className="text-sm font-black text-ink">{normalizePhase(currentPhase)}</div>
        </div>
        <div className="rounded-full bg-accentBg px-3 py-1 text-xs font-black text-accent">
          {completion ?? 55}% complete · {status ?? "amber"}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        {lifecyclePhases.map((phase, index) => {
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <Link
              key={phase}
              href={phaseHref(phase)}
              className={
                isActive
                  ? "rounded-2xl border border-accent bg-accentBg p-4 transition hover:-translate-y-0.5"
                  : isDone
                    ? "rounded-2xl border border-green/20 bg-greenBg p-4 transition hover:-translate-y-0.5"
                    : "rounded-2xl border border-border bg-surface p-4 transition hover:-translate-y-0.5"
              }
            >
              <div className={isActive ? "text-lg font-black text-accent" : isDone ? "text-lg font-black text-green" : "text-lg font-black text-muted"}>
                {isDone ? "✓" : isActive ? "→" : "○"}
              </div>
              <div className="mt-2 text-xs font-black text-ink">{phase}</div>
              <div className="mt-2 text-[10px] font-bold text-muted">Open workbench</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

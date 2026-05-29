"use client";

import { useState } from "react";
import { lifecyclePhases, type LifecyclePhase } from "@/lib/lifecycleEngine";
import { getPhaseModel } from "@/lib/phaseModel";
import { Card } from "@/components/ui/Card";

export function ProjectPhaseMap({ currentPhase }: { currentPhase?: string | null }) {
  const [selected, setSelected] = useState<LifecyclePhase>((currentPhase as LifecyclePhase) || "Execution");
  const model = getPhaseModel(selected);

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-accent">Project lifecycle workspaces</div>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-ink">Click a phase to see what is tracked</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-2 md:grid-cols-5">
        {lifecyclePhases.map((phase) => (
          <button
            key={phase}
            type="button"
            onClick={() => setSelected(phase)}
            className={selected === phase ? "rounded-2xl border border-accent bg-accentBg p-4 text-left" : "rounded-2xl border border-border bg-surface p-4 text-left hover:border-accent/40"}
          >
            <div className={selected === phase ? "text-sm font-black text-accent" : "text-sm font-black text-ink"}>{phase}</div>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="text-xs font-black uppercase tracking-wider text-muted">What you view</div>
          <div className="mt-3 grid gap-3">
            {model.viewItems.map((item) => (
              <div key={item.label}>
                <div className="text-sm font-black text-ink">{item.label}</div>
                <p className="mt-1 text-xs leading-5 text-muted">{item.purpose}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="text-xs font-black uppercase tracking-wider text-muted">What you maintain</div>
          <div className="mt-3 grid gap-3">
            {model.editItems.map((item) => (
              <div key={item.label}>
                <div className="text-sm font-black text-ink">{item.label}</div>
                <p className="mt-1 text-xs leading-5 text-muted">{item.purpose}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-accentBg p-5 text-[#312E81]">
          <div className="text-xs font-black uppercase tracking-wider">Intelligence added</div>
          <div className="mt-3 grid gap-3">
            {model.intelligence.map((item) => (
              <div key={item} className="text-xs font-bold leading-5">✦ {item}</div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

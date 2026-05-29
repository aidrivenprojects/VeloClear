"use client";

import { useMemo, useState } from "react";
import { lifecyclePhases, normalizePhase, type LifecyclePhase } from "@/lib/lifecycleEngine";
import { getPhaseModel } from "@/lib/phaseModel";
import { updateProjectLifecycle } from "@/lib/projectPersistence";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function LifecycleWorkbench({
  project,
  raidItems,
  onUpdated
}: {
  project: any;
  raidItems: any[];
  onUpdated?: (updated: any) => void;
}) {
  const [phase, setPhase] = useState<LifecyclePhase>(normalizePhase(project.current_phase));
  const [status, setStatus] = useState(project.phase_status ?? "amber");
  const [completion, setCompletion] = useState(Number(project.phase_completion ?? 55));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const model = useMemo(() => getPhaseModel(phase), [phase]);
  const highRiskCount = raidItems.filter((item) => Number(item.impact ?? 0) >= 15).length;

  async function saveLifecycle() {
    setSaving(true);
    setMessage(null);

    try {
      const updated = await updateProjectLifecycle(project.id, {
        current_phase: phase,
        phase_status: status,
        phase_completion: completion
      });
      onUpdated?.(updated);
      setMessage("Lifecycle updated.");
    } catch (err) {
      setMessage(err instanceof Error ? `Update failed: ${err.message}` : "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-accent">Phase workbench</div>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-ink">{phase}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-ink2">{model.goal}</p>
          </div>
          <Badge tone={status === "red" ? "red" : status === "green" ? "green" : "amber"}>{status}</Badge>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_180px_160px_120px]">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-muted">Current phase</span>
            <select
              value={phase}
              onChange={(event) => setPhase(event.target.value as LifecyclePhase)}
              className="h-11 rounded-xl border border-border bg-white px-3 text-sm font-bold text-ink outline-none"
            >
              {lifecyclePhases.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-muted">Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-11 rounded-xl border border-border bg-white px-3 text-sm font-bold text-ink outline-none"
            >
              <option value="green">Green</option>
              <option value="amber">Amber</option>
              <option value="red">Red</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-muted">Completion</span>
            <input
              type="number"
              min={0}
              max={100}
              value={completion}
              onChange={(event) => setCompletion(Number(event.target.value))}
              className="h-11 rounded-xl border border-border bg-white px-3 text-sm font-bold text-ink outline-none"
            />
          </label>

          <button
            type="button"
            onClick={saveLifecycle}
            disabled={saving}
            className="self-end rounded-xl bg-accent px-4 py-3 text-sm font-black text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {message && <div className="mt-4 rounded-xl bg-accentBg px-4 py-3 text-sm font-bold text-accent">{message}</div>}
      </Card>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="p-5">
          <div className="text-xs font-black uppercase tracking-wider text-muted">View in this phase</div>
          <div className="mt-4 grid gap-3">
            {model.viewItems.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-surface p-4">
                <div className="text-sm font-black text-ink">{item.label}</div>
                <p className="mt-1 text-xs leading-5 text-muted">{item.purpose}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-xs font-black uppercase tracking-wider text-muted">Edit / maintain</div>
          <div className="mt-4 grid gap-3">
            {model.editItems.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-white p-4">
                <div className="text-sm font-black text-ink">{item.label}</div>
                <p className="mt-1 text-xs leading-5 text-muted">{item.purpose}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-xs font-black uppercase tracking-wider text-muted">Intelligence added</div>
          <div className="mt-4 grid gap-3">
            {model.intelligence.map((item) => (
              <div key={item} className="rounded-2xl bg-accentBg p-4 text-xs font-bold leading-5 text-[#312E81]">
                ✦ {item}
              </div>
            ))}
            <div className="rounded-2xl border border-border bg-surface p-4 text-xs font-bold leading-5 text-muted">
              Current high-impact RAID signals: {highRiskCount}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

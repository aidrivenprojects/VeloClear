"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { DeliveryMethod, ProjectComplexity, RiskFocus, GeneratedProject } from "@/lib/types";
import { generateProjectSetup } from "@/lib/setupGenerator";
import { saveGeneratedProject } from "@/lib/projectPersistence";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GeneratedWorkspace } from "./GeneratedWorkspace";

const riskOptions: { value: RiskFocus; label: string; note: string }[] = [
  { value: "vendor_dependency", label: "Vendor dependency", note: "Third-party handoffs, external blockers, API readiness" },
  { value: "scope_change", label: "Scope volatility", note: "Uncontrolled changes, unclear boundaries, rework" },
  { value: "capacity", label: "Capacity constraints", note: "Team bandwidth, shared resources, delivery overload" },
  { value: "stakeholder_alignment", label: "Executive alignment", note: "Decision delays, unclear ownership, sponsor drift" },
  { value: "compliance", label: "Compliance", note: "Controls, approvals, evidence, regulatory gates" }
];

const complexityOptions: { value: ProjectComplexity; label: string; note: string }[] = [
  { value: "small", label: "Single team", note: "One delivery team, limited dependencies" },
  { value: "multi_team", label: "Multi-team", note: "Several teams with shared milestones" },
  { value: "enterprise", label: "Enterprise programme", note: "Governance-heavy, senior stakeholders" },
  { value: "multi_vendor", label: "Multi-vendor transformation", note: "Multiple suppliers and contractual handoffs" }
];

export function GuidedSetupForm() {
  const router = useRouter();
  const [projectName, setProjectName] = useState("Global CRM transformation");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("hybrid");
  const [riskFocus, setRiskFocus] = useState<RiskFocus>("vendor_dependency");
  const [complexity, setComplexity] = useState<ProjectComplexity>("multi_team");
  const [generated, setGenerated] = useState<GeneratedProject | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cleanProjectName = projectName.trim() || "Untitled delivery workspace";

  const livePreview = useMemo(() => generateProjectSetup({
    name: cleanProjectName,
    deliveryMethod,
    riskFocus,
    complexity
  }), [cleanProjectName, deliveryMethod, riskFocus, complexity]);

  const detectedSignals = useMemo(() => {
    const signals = [];
    if (complexity === "multi_vendor") signals.push("Multi-vendor handoff exposure");
    if (complexity === "enterprise") signals.push("Governance-heavy rollout");
    if (complexity === "multi_team") signals.push("Cross-team dependency risk");
    if (riskFocus === "vendor_dependency") signals.push("Vendor dependency exposure");
    if (riskFocus === "stakeholder_alignment") signals.push("Decision latency risk");
    if (deliveryMethod === "hybrid") signals.push("Hybrid delivery controls required");
    if (deliveryMethod === "safe") signals.push("PI-level coordination required");
    return signals.slice(0, 4);
  }, [complexity, riskFocus, deliveryMethod]);

  async function onGenerate() {
    setIsGenerating(true);
    setGenerated(null);
    setError(null);
    setSaveStatus("Generating workspace structure…");

    try {
      const projectToSave = generateProjectSetup({
        name: cleanProjectName,
        deliveryMethod,
        riskFocus,
        complexity
      });

      setGenerated(projectToSave);
      setSaveStatus("Saving project to Supabase…");

      const saved = await saveGeneratedProject(projectToSave);

      if (!saved?.id) {
        throw new Error("Supabase saved the project but did not return an id.");
      }

      setSaveStatus("Saved. Opening project workspace…");
      router.push(`/projects/${saved.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save project.";
      setError(message);
      setSaveStatus(null);
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[28px] border border-border bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,.16),transparent_36%),linear-gradient(135deg,#ffffff,#f8fafc)] p-6 shadow-soft">
        <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-accent/20 bg-accentBg px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-accent">
              Guided Project Setup Intelligence
            </div>
            <h2 className="max-w-xl text-[42px] font-black leading-[0.98] tracking-[-0.055em] text-ink">
              Turn a project idea into a governed delivery workspace.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-ink2">
              Answer a few delivery questions. VeloClear generates phases, RAID starters, governance cadence, stakeholder pulse and executive narrative.
            </p>
          </div>

          <div className="grid gap-3 rounded-3xl border border-border bg-white/70 p-4 shadow-soft backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-muted">Live detection</div>
                <div className="text-sm font-black text-ink">Workspace intelligence preview</div>
              </div>
              <span className="rounded-full bg-greenBg px-3 py-1 text-[10px] font-black uppercase tracking-wider text-greenText">Updating live</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {detectedSignals.map((signal) => (
                <div key={signal} className="rounded-2xl border border-border bg-white px-4 py-3 text-xs font-bold text-ink2">✦ {signal}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[0.86fr_1.14fr]">
        <Card className="p-5">
          <div className="mb-5">
            <div className="text-xs font-black uppercase tracking-wider text-accent">Conversational setup</div>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-ink">What are you delivering?</h3>
          </div>

          <div className="space-y-5">
            <label className="grid gap-2" htmlFor="project-name">
              <span className="text-sm font-black text-ink">Project or programme name</span>
              <input
                id="project-name"
                name="projectName"
                autoComplete="off"
                className="h-12 rounded-2xl border border-border bg-surface px-4 text-sm font-bold text-ink outline-none transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="e.g. Vendor Management System"
              />
            </label>

            <div>
              <div className="mb-2 text-sm font-black text-ink">How does the team work?</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {(["agile", "hybrid", "waterfall", "safe"] as DeliveryMethod[]).map((method) => (
                  <button type="button" key={method} onClick={() => setDeliveryMethod(method)} className={deliveryMethod === method ? "rounded-2xl border border-accent bg-accentBg px-4 py-3 text-left text-sm font-black text-accent shadow-soft" : "rounded-2xl border border-border bg-white px-4 py-3 text-left text-sm font-bold text-ink2 transition hover:border-accent/40"}>
                    {method === "safe" ? "SAFe" : method[0].toUpperCase() + method.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-black text-ink">What is most likely to destabilise delivery?</div>
              <div className="grid gap-2">
                {riskOptions.map((option) => (
                  <button type="button" key={option.value} onClick={() => setRiskFocus(option.value)} className={riskFocus === option.value ? "rounded-2xl border border-accent bg-accentBg p-4 text-left shadow-soft" : "rounded-2xl border border-border bg-white p-4 text-left transition hover:border-accent/40"}>
                    <div className={riskFocus === option.value ? "text-sm font-black text-accent" : "text-sm font-black text-ink"}>{option.label}</div>
                    <div className="mt-1 text-xs leading-5 text-muted">{option.note}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-black text-ink">How many teams or vendors are involved?</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {complexityOptions.map((option) => (
                  <button type="button" key={option.value} onClick={() => setComplexity(option.value)} className={complexity === option.value ? "rounded-2xl border border-accent bg-accentBg p-4 text-left shadow-soft" : "rounded-2xl border border-border bg-white p-4 text-left transition hover:border-accent/40"}>
                    <div className={complexity === option.value ? "text-sm font-black text-accent" : "text-sm font-black text-ink"}>{option.label}</div>
                    <div className="mt-1 text-xs leading-5 text-muted">{option.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {saveStatus && <div className="rounded-2xl border border-accent/20 bg-accentBg p-4 text-sm font-bold text-accent">{saveStatus}</div>}
            {error && <div className="rounded-2xl border border-red/20 bg-redBg p-4 text-sm font-bold text-redText">Save failed: {error}</div>}

            <Button onClick={onGenerate} disabled={isGenerating} className="h-12 w-full rounded-2xl disabled:cursor-not-allowed disabled:opacity-60">
              {isGenerating ? "Saving workspace..." : "Generate governed workspace"}
            </Button>
          </div>
        </Card>

        <GeneratedWorkspace generated={generated} preview={livePreview} isGenerating={isGenerating} />
      </div>
    </div>
  );
}

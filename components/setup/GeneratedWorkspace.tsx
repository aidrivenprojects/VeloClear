import type { GeneratedProject } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const generationSteps = [
  "Analysing delivery complexity",
  "Mapping governance structure",
  "Generating RAID controls",
  "Building stakeholder model",
  "Preparing executive narrative"
];

export function GeneratedWorkspace({
  generated,
  preview,
  isGenerating
}: {
  generated: GeneratedProject | null;
  preview: GeneratedProject;
  isGenerating: boolean;
}) {
  if (isGenerating) {
    return (
      <Card className="relative min-h-[680px] overflow-hidden p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,.16),transparent_36%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,.10),transparent_34%)]" />
        <div className="relative">
          <div className="mb-3 text-xs font-black uppercase tracking-wider text-accent">Workspace orchestration</div>
          <h3 className="max-w-lg text-4xl font-black leading-none tracking-[-0.05em] text-ink">Building your delivery operating structure…</h3>
          <div className="mt-8 grid gap-3">
            {generationSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl border border-border bg-white/80 px-4 py-4 text-sm font-black text-ink2 shadow-soft">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-xs text-white">{index + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const model = generated ?? preview;
  const isPreview = !generated;

  return (
    <Card className="min-h-[680px] overflow-hidden">
      <div className="border-b border-border bg-[linear-gradient(135deg,#ffffff,#F8FAFC)] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-accent">{isPreview ? "Live intelligence preview" : "Generated workspace"}</div>
            <h3 className="mt-2 text-3xl font-black tracking-[-0.045em] text-ink">{model.name}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink2">{model.narrative}</p>
          </div>
          <Badge tone={isPreview ? "slate" : "green"}>{isPreview ? "Preview" : "Generated"}</Badge>
        </div>
      </div>

      <div className="grid gap-5 p-6">
        <section className="grid gap-3 sm:grid-cols-3">
          <MiniPulse label="Delivery Method" value={format(model.deliveryMethod)} />
          <MiniPulse label="Risk Focus" value={format(model.riskFocus)} tone="amber" />
          <MiniPulse label="Complexity" value={format(model.complexity)} tone="red" />
        </section>

        <PreviewBlock title="Phase timeline" items={model.phases} />
        <PreviewBlock title="Governance cadence" items={model.governance} />
        <PreviewBlock title="Stakeholder pulse" items={model.stakeholders} />

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-black">Starter RAID controls</h4>
            <span className="text-xs font-bold text-muted">Trigger-based</span>
          </div>
          <div className="space-y-3">
            {model.risks.map((risk) => (
              <div key={risk.id} className="rounded-2xl border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-black text-accent">{risk.id}</div>
                    <div className="font-black">{risk.title}</div>
                  </div>
                  <Badge tone={risk.score >= 15 ? "red" : "amber"}>Score {risk.score}</Badge>
                </div>
                <div className="mt-3 text-xs leading-5 text-muted">
                  <strong>Trigger:</strong> {risk.trigger}
                  <br />
                  <strong>Mitigation:</strong> {risk.mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-accent/20 bg-accentBg p-5 text-sm leading-6 text-[#3730A3]">
          <strong>Intelligence recommendation:</strong>
          <br />
          Define one named owner for each external dependency before the first governance checkpoint.
        </div>
      </div>
    </Card>
  );
}

function MiniPulse({ label, value, tone = "indigo" }: { label: string; value: string; tone?: "indigo" | "amber" | "red" }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-soft">
      <div className="text-[10px] font-black uppercase tracking-wider text-muted">{label}</div>
      <div className={tone === "red" ? "mt-1 text-sm font-black text-red" : tone === "amber" ? "mt-1 text-sm font-black text-amber" : "mt-1 text-sm font-black text-accent"}>
        {value}
      </div>
    </div>
  );
}

function PreviewBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-black">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-bold text-ink2 shadow-soft">{item}</span>
        ))}
      </div>
    </div>
  );
}

function format(value: string) {
  return value.replaceAll("_", " ").replace("safe", "SAFe").replace(/\b\w/g, (char) => char.toUpperCase());
}

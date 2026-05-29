"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { exampleBlueprintPrompts, generateDeliveryBlueprint, type DeliveryBlueprint } from "@/lib/deliveryFormationEngine";
import { saveGeneratedProject } from "@/lib/projectPersistence";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function DiscoveryIntake() {
  const router = useRouter();
  const [input, setInput] = useState(exampleBlueprintPrompts[0].prompt);
  const [blueprint, setBlueprint] = useState<DeliveryBlueprint | null>(generateDeliveryBlueprint(exampleBlueprintPrompts[0].prompt));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = input.trim().length > 20;

  const summary = useMemo(() => {
    if (!blueprint) return null;
    return [
      ["Workflows", blueprint.workflows.length],
      ["Capabilities", blueprint.capabilities.length],
      ["Epics", blueprint.epics.length],
      ["Stories", blueprint.userStories.length],
      ["Sprints", blueprint.sprintPlan.length]
    ];
  }, [blueprint]);

  function generate() {
    setBlueprint(generateDeliveryBlueprint(input));
    setError(null);
  }

  async function createWorkspace() {
    if (!blueprint) return;
    setSaving(true);
    setError(null);

    try {
      const project = {
        name: blueprint.projectName,
        deliveryMethod: "agile" as const,
        complexity: blueprint.workflows.length > 7 ? "enterprise" as const : "multi_team" as const,
        riskFocus: blueprint.risks.some((risk) => risk.title.toLowerCase().includes("approval")) ? "stakeholder_alignment" as const : "vendor_dependency" as const,
        narrative: `${blueprint.projectName} has been formed from discovery inputs. VeloClear identified ${blueprint.workflows.length} workflows, ${blueprint.capabilities.length} product capabilities, ${blueprint.epics.length} epics, ${blueprint.userStories.length} user stories and ${blueprint.sprintPlan.length} delivery sprints.`,
        phases: ["Discovery", "Backlog", "Sprint delivery", "Testing", "Release", "Hypercare"],
        governance: ["Discovery review", "Backlog refinement", "Sprint review", "Steering checkpoint", "Release readiness"],
        stakeholders: blueprint.roles.slice(0, 6),
        risks: blueprint.risks.map((risk, index) => ({
          id: `R00${index + 1}`,
          title: risk.title,
          trigger: risk.trigger,
          mitigation: risk.mitigation,
          owner: "Project Manager",
          score: risk.score
        }))
      };

      const saved = await saveGeneratedProject(project);
      router.push(`/projects/${saved.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create workspace.");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-border bg-[radial-gradient(circle_at_10%_10%,rgba(99,102,241,.16),transparent_38%),linear-gradient(135deg,#ffffff,#f8fafc)] p-6 shadow-soft">
        <div className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-accent/20 bg-accentBg px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-accent">
              Discovery to delivery
            </div>
            <h1 className="max-w-2xl text-[34px] font-black leading-[1.02] tracking-[-0.045em] text-ink md:text-[42px]">
              Turn an idea, workflow or undocumented process into a trackable delivery workspace.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink2">
              Start with documents or what is in your head. VeloClear forms workflows, capabilities, epics, stories, sprints, risks and governance before tracking delivery.
            </p>
          </div>

          <Card className="p-5">
            <div className="text-xs font-black uppercase tracking-wider text-muted">Example starters</div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {exampleBlueprintPrompts.map((example) => (
                <button
                  key={example.label}
                  type="button"
                  onClick={() => {
                    setInput(example.prompt);
                    setBlueprint(generateDeliveryBlueprint(example.prompt));
                  }}
                  className="rounded-2xl border border-border bg-white p-4 text-left text-sm font-black text-ink2 transition hover:border-accent/40 hover:text-accent"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
        <Card className="p-5">
          <div className="text-xs font-black uppercase tracking-wider text-accent">Capture from user</div>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-ink">Describe what needs to be built</h2>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="mt-4 min-h-[230px] w-full rounded-2xl border border-border bg-surface p-4 text-sm font-bold leading-6 text-ink outline-none focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10"
            placeholder="Example: Build an application where tenants are billed for electricity and common space usage..."
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!canGenerate}
              onClick={generate}
              className="rounded-2xl bg-accent px-5 py-3 text-sm font-black text-white shadow-soft disabled:opacity-50"
            >
              Generate delivery blueprint
            </button>
            {blueprint && (
              <button
                type="button"
                disabled={saving}
                onClick={createWorkspace}
                className="rounded-2xl border border-border bg-white px-5 py-3 text-sm font-black text-ink2 shadow-soft hover:text-accent disabled:opacity-50"
              >
                {saving ? "Creating workspace..." : "Create tracked workspace"}
              </button>
            )}
          </div>
          {error && <div className="mt-4 rounded-2xl bg-redBg p-4 text-sm font-bold text-redText">{error}</div>}
        </Card>

        {blueprint && (
          <Card className="overflow-hidden">
            <div className="border-b border-border bg-white p-5">
              <div className="text-xs font-black uppercase tracking-wider text-accent">Generated blueprint</div>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] text-ink">{blueprint.projectName}</h2>
              <p className="mt-2 text-sm leading-6 text-ink2">{blueprint.problem}</p>
            </div>

            <div className="grid gap-4 p-5">
              {summary && (
                <div className="grid gap-3 sm:grid-cols-5">
                  {summary.map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-border bg-surface p-4">
                      <div className="font-mono text-2xl font-bold text-accent">{value}</div>
                      <div className="mt-1 text-[10px] font-black uppercase tracking-wider text-muted">{label}</div>
                    </div>
                  ))}
                </div>
              )}

              <BlueprintBlock title="Workflows discovered" items={blueprint.workflows} />
              <BlueprintBlock title="Capabilities to build" items={blueprint.capabilities} />

              <div>
                <h3 className="mb-3 text-sm font-black text-ink">Generated product backlog</h3>
                <div className="grid gap-3">
                  {blueprint.epics.map((epic) => (
                    <div key={epic.title} className="rounded-2xl border border-border bg-surface p-4">
                      <div className="text-sm font-black text-ink">{epic.title}</div>
                      <p className="mt-1 text-xs leading-5 text-muted">{epic.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-black text-ink">Sprint roadmap</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {blueprint.sprintPlan.map((sprint) => (
                    <div key={sprint.sprint} className="rounded-2xl border border-border bg-white p-4 shadow-soft">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-black text-ink">{sprint.sprint}</div>
                        <Badge tone="indigo">{sprint.goal}</Badge>
                      </div>
                      <ul className="mt-3 grid gap-1 text-xs font-bold text-muted">
                        {sprint.backlog.map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}

function BlueprintBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-black text-ink">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-bold text-ink2 shadow-soft">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { slugify, upsertProject } from "@/lib/functionalStore";

const steps = [
  {
    title: "Project identity",
    fields: ["name", "programme", "methodology"]
  },
  {
    title: "Workflow discovery",
    fields: ["workflow"]
  },
  {
    title: "Users and governance",
    fields: ["roles", "governance"]
  },
  {
    title: "Delivery plan",
    fields: ["summary"]
  }
];

export function FunctionalNewProjectWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    programme: "Digital Transformation",
    methodology: "Hybrid",
    workflow: "",
    roles: "",
    governance: "",
    summary: ""
  });

  const active = steps[step];
  const canFinish = form.name.trim().length > 2;

  const preview = useMemo(() => {
    const name = form.name || "New Project";
    const summary = form.summary || form.workflow || "Generated project workspace with lifecycle, RAID, backlog, governance and intelligence.";
    return { name, summary };
  }, [form]);

  function update(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function createProject() {
    if (!canFinish) return;
    const id = slugify(form.name);
    const project = upsertProject({
      id,
      name: form.name.trim(),
      programme: form.programme || "Digital Transformation",
      methodology: form.methodology || "Hybrid",
      summary: form.summary || form.workflow || "Generated project workspace with lifecycle, RAID, backlog, governance and intelligence.",
      health: "amber",
      createdAt: new Date().toISOString()
    });
    router.push(`/projects/${project.id}`);
  }

  return (
    <AppShell title="New Project" kicker="Guided Discovery">
      <div className="space-y-5">
        <Card className="p-6">
          <div className="text-xs font-black uppercase tracking-wider text-accent">Step {step + 1} of {steps.length}</div>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">{active.title}</h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">
            Create a project. VeloClear will generate lifecycle phases, project workspaces, connected objects, signals and trace memory.
          </p>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[1fr_.8fr]">
          <Card className="p-6">
            <div className="grid gap-4">
              {active.fields.includes("name") && <Field label="Project name" value={form.name} onChange={(v) => update("name", v)} placeholder="e.g. Vendor Permit System" />}
              {active.fields.includes("programme") && <Field label="Programme" value={form.programme} onChange={(v) => update("programme", v)} placeholder="e.g. Operational Workflow Digitisation" />}
              {active.fields.includes("methodology") && (
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-muted">Methodology</span>
                  <select value={form.methodology} onChange={(e) => update("methodology", e.target.value)} className="rounded-2xl border border-border bg-surface p-4 text-sm font-bold text-ink outline-none">
                    <option>Hybrid</option>
                    <option>PMBOK</option>
                    <option>Agile / Scrum</option>
                    <option>SAFe</option>
                  </select>
                </label>
              )}
              {active.fields.includes("workflow") && <Area label="Workflow / current process" value={form.workflow} onChange={(v) => update("workflow", v)} placeholder="Request → approval → execution → inspection → extension/closure..." />}
              {active.fields.includes("roles") && <Area label="Users and roles" value={form.roles} onChange={(v) => update("roles", v)} placeholder="Vendor, PM, Security, Safety, Sponsor, Auditor..." />}
              {active.fields.includes("governance") && <Area label="Governance rules" value={form.governance} onChange={(v) => update("governance", v)} placeholder="Approval SLAs, escalation paths, decision rights..." />}
              {active.fields.includes("summary") && <Area label="Project summary" value={form.summary} onChange={(v) => update("summary", v)} placeholder="What should this project achieve?" />}
            </div>

            <div className="mt-6 flex justify-between gap-3">
              <button onClick={() => setStep(Math.max(0, step - 1))} className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-black text-ink">Back</button>
              {step < steps.length - 1 ? (
                <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} className="rounded-xl bg-accent px-4 py-2 text-sm font-black text-white">Continue</button>
              ) : (
                <button onClick={createProject} disabled={!canFinish} className="rounded-xl bg-accent px-4 py-2 text-sm font-black text-white disabled:opacity-40">Generate project</button>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-xs font-black uppercase tracking-wider text-accent">Generated preview</div>
            <h2 className="mt-2 text-2xl font-black text-ink">{preview.name}</h2>
            <p className="mt-3 text-sm leading-6 text-ink2">{preview.summary}</p>
            <div className="mt-5 grid gap-3">
              {["Lifecycle phases", "Tool workspaces", "Connected objects", "Signals", "Impact trace", "Learning memory"].map((item) => (
                <div key={item} className="rounded-2xl border border-border bg-surface p-3 text-xs font-black text-muted">✓ {item}</div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-wider text-muted">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="rounded-2xl border border-border bg-surface p-4 text-sm font-bold text-ink outline-none" />
    </label>
  );
}

function Area({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-wider text-muted">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="min-h-[140px] rounded-2xl border border-border bg-surface p-4 text-sm font-bold text-ink outline-none" />
    </label>
  );
}

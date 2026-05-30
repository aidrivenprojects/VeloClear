"use client";
import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
const steps = ["Project intent", "Workflow discovery", "Users and roles", "Delivery formation", "Governance and intelligence"];
export function NewProjectWizardPage() {
  const [step, setStep] = useState(0);
  return (
    <AppShell title="New Project" kicker="Guided Discovery">
      <Card className="p-6">
        <div className="text-xs font-black uppercase tracking-wider text-accent">Step {step + 1} of {steps.length}</div>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">{steps[step]}</h1>
        <p className="mt-3 text-sm leading-6 text-ink2">Capture what is in the user's head and convert it into lifecycle, backlog, RAID, governance and trace structure.</p>
        <textarea className="mt-5 min-h-[160px] w-full rounded-2xl border border-border bg-surface p-4 text-sm font-bold text-ink outline-none" placeholder="Describe the project..." />
        <div className="mt-5 flex justify-between gap-3">
          <button onClick={() => setStep(Math.max(0, step - 1))} className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-black text-ink">Back</button>
          {step < steps.length - 1 ? <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} className="rounded-xl bg-accent px-4 py-2 text-sm font-black text-white">Continue</button> : <Link href="/projects" className="rounded-xl bg-accent px-4 py-2 text-sm font-black text-white">Go to projects</Link>}
        </div>
      </Card>
    </AppShell>
  );
}

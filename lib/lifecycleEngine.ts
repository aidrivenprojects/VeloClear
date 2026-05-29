export const lifecyclePhases = [
  "Initiation",
  "Planning",
  "Execution",
  "Monitoring & Controlling",
  "Closure"
] as const;

export type LifecyclePhase = typeof lifecyclePhases[number];

export type LifecycleProject = {
  id: string;
  name: string;
  current_phase?: string | null;
  phase_status?: string | null;
  phase_completion?: number | null;
  risk_focus?: string | null;
  complexity?: string | null;
  narrative?: string | null;
};

export type LifecycleRaid = {
  project_id: string;
  title?: string | null;
  trigger?: string | null;
  impact?: number | null;
  status?: string | null;
};

export function normalizePhase(phase?: string | null): LifecyclePhase {
  if (phase && lifecyclePhases.includes(phase as LifecyclePhase)) {
    return phase as LifecyclePhase;
  }
  return "Execution";
}

export function inferPhase(project: LifecycleProject): LifecyclePhase {
  const stored = normalizePhase(project.current_phase);
  if (project.current_phase) return stored;

  if (project.complexity === "small") return "Planning";
  if (project.risk_focus === "vendor_dependency") return "Execution";
  return "Execution";
}

export function phaseIndex(phase?: string | null) {
  return lifecyclePhases.indexOf(normalizePhase(phase));
}

export function phaseCompletion(project: LifecycleProject, raidItems: LifecycleRaid[]) {
  if (typeof project.phase_completion === "number") return project.phase_completion;

  const projectRaid = raidItems.filter((item) => item.project_id === project.id);
  const highRisks = projectRaid.filter((item) => Number(item.impact ?? 0) >= 15).length;

  if (highRisks >= 2) return 45;
  if (highRisks === 1) return 60;
  return 72;
}

export function phaseStatus(project: LifecycleProject, raidItems: LifecycleRaid[]) {
  if (project.phase_status === "red" || project.phase_status === "green" || project.phase_status === "amber") {
    return project.phase_status;
  }

  const projectRaid = raidItems.filter((item) => item.project_id === project.id);
  const highRisks = projectRaid.filter((item) => Number(item.impact ?? 0) >= 15).length;

  if (highRisks >= 2) return "red";
  if (highRisks >= 1 || project.risk_focus === "vendor_dependency") return "amber";
  return "green";
}

export function lifecycleIntelligence(project: LifecycleProject, raidItems: LifecycleRaid[]) {
  const phase = inferPhase(project);
  const status = phaseStatus(project, raidItems);
  const completion = phaseCompletion(project, raidItems);
  const projectRaid = raidItems.filter((item) => item.project_id === project.id);
  const highRisks = projectRaid.filter((item) => Number(item.impact ?? 0) >= 15).length;

  const phaseNarratives: Record<LifecyclePhase, string> = {
    "Initiation": "Validate sponsor alignment, business case clarity and governance ownership before moving into planning.",
    "Planning": "Confirm RAID baseline, dependency model, milestone assumptions and delivery cadence before execution starts.",
    "Execution": "Monitor active delivery signals, vendor drift, sprint blockers and decision latency.",
    "Monitoring & Controlling": "Track governance breaches, KPI movement, escalation triggers and executive decision requirements.",
    "Closure": "Confirm transition readiness, unresolved risk closure, benefits handover and lessons learned capture."
  };

  const alert =
    status === "red"
      ? "Immediate governance attention required."
      : status === "amber"
        ? "Delivery sensitivity detected. Governance review recommended."
        : "Phase is operating within expected tolerance.";

  return {
    phase,
    status,
    completion,
    highRisks,
    narrative: phaseNarratives[phase],
    alert
  };
}

export function portfolioPhaseDistribution(projects: LifecycleProject[]) {
  return lifecyclePhases.map((phase) => ({
    phase,
    count: projects.filter((project) => inferPhase(project) === phase).length
  }));
}

export function lifecyclePortfolioInsight(projects: LifecycleProject[], raidItems: LifecycleRaid[]) {
  if (projects.length === 0) {
    return "No lifecycle data yet. Generate a workspace to activate delivery phase intelligence.";
  }

  const distribution = portfolioPhaseDistribution(projects);
  const executionCount = distribution.find((item) => item.phase === "Execution")?.count ?? 0;
  const monitoringCount = distribution.find((item) => item.phase === "Monitoring & Controlling")?.count ?? 0;
  const highRisks = raidItems.filter((item) => Number(item.impact ?? 0) >= 15).length;

  if (executionCount >= 2 && highRisks >= 2) {
    return "Execution phase risk concentration is rising. Review vendor handoffs and decision ownership across active workspaces.";
  }

  if (monitoringCount >= 1 && highRisks >= 1) {
    return "Monitoring phase governance pressure is visible. Validate escalation cadence and reporting thresholds.";
  }

  return "Lifecycle intelligence is active. Continue adding projects to strengthen phase-based pattern detection.";
}

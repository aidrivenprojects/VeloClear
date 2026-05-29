export type ProjectSignalInput = {
  id: string;
  name: string;
  health_status?: string | null;
  risk_focus?: string | null;
  complexity?: string | null;
  narrative?: string | null;
};

export type RaidSignalInput = {
  id: string;
  project_id: string;
  title: string;
  trigger?: string | null;
  mitigation?: string | null;
  owner?: string | null;
  status?: string | null;
  probability?: number | null;
  impact?: number | null;
};

export type HealthStatus = "green" | "amber" | "red";

export function scoreProjectHealth(project: ProjectSignalInput, raidItems: RaidSignalInput[]): HealthStatus {
  const projectRaid = raidItems.filter((item) => item.project_id === project.id);
  const highRisks = projectRaid.filter((item) => Number(item.impact ?? 0) >= 15).length;
  const mediumRisks = projectRaid.filter((item) => Number(item.impact ?? 0) >= 10).length;
  const openItems = projectRaid.filter((item) => item.status !== "closed").length;
  const vendorFocus = project.risk_focus === "vendor_dependency";
  const complex = project.complexity === "multi_vendor" || project.complexity === "enterprise";

  if (highRisks >= 2 || (vendorFocus && complex && highRisks >= 1)) return "red";
  if (highRisks >= 1 || mediumRisks >= 2 || openItems >= 4) return "amber";
  return "green";
}

export function scorePortfolioHealth(projects: ProjectSignalInput[], raidItems: RaidSignalInput[]) {
  const projectHealth = projects.map((project) => ({
    project,
    status: scoreProjectHealth(project, raidItems)
  }));

  const red = projectHealth.filter((item) => item.status === "red").length;
  const amber = projectHealth.filter((item) => item.status === "amber").length;
  const green = projectHealth.filter((item) => item.status === "green").length;
  const highRisks = raidItems.filter((item) => Number(item.impact ?? 0) >= 15).length;

  const overall: HealthStatus = red > 0 ? "red" : amber > 0 || highRisks > 0 ? "amber" : "green";

  return {
    overall,
    red,
    amber,
    green,
    highRisks,
    projectHealth
  };
}

export function detectPortfolioPatterns(projects: ProjectSignalInput[], raidItems: RaidSignalInput[]) {
  const vendorProjects = projects.filter((project) => project.risk_focus === "vendor_dependency");
  const multiVendorProjects = projects.filter((project) => project.complexity === "multi_vendor");
  const highRisks = raidItems.filter((item) => Number(item.impact ?? 0) >= 15);
  const decisionRisks = raidItems.filter((item) =>
    `${item.title} ${item.trigger}`.toLowerCase().includes("decision")
  );

  const patterns: string[] = [];

  if (vendorProjects.length >= 2) {
    patterns.push("Vendor dependency drift is recurring across saved workspaces.");
  }

  if (multiVendorProjects.length >= 2) {
    patterns.push("Multi-vendor complexity is becoming a portfolio-level delivery theme.");
  }

  if (highRisks.length >= 3) {
    patterns.push("High-impact RAID items are accumulating across the portfolio.");
  }

  if (decisionRisks.length >= 2) {
    patterns.push("Decision latency is emerging as a governance weakness.");
  }

  if (patterns.length === 0 && projects.length > 0) {
    patterns.push("Portfolio intelligence is active. Add more workspaces to strengthen pattern detection.");
  }

  if (patterns.length === 0) {
    patterns.push("No saved workspaces yet. Generate a workspace to activate portfolio learning.");
  }

  return patterns;
}

export function generateExecutiveNarrative(projects: ProjectSignalInput[], raidItems: RaidSignalInput[]) {
  const portfolio = scorePortfolioHealth(projects, raidItems);
  const patterns = detectPortfolioPatterns(projects, raidItems);
  const total = projects.length;

  if (total === 0) {
    return "No saved projects yet. Generate a workspace to activate live delivery intelligence.";
  }

  const statusPhrase =
    portfolio.overall === "red"
      ? "requires immediate governance attention"
      : portfolio.overall === "amber"
        ? "is stable but showing delivery sensitivity"
        : "is currently stable";

  return `Portfolio health ${statusPhrase}. ${total} saved workspace${total === 1 ? "" : "s"} are being monitored, with ${portfolio.highRisks} high-impact RAID signal${portfolio.highRisks === 1 ? "" : "s"}. ${patterns[0]} Recommended action: review shared controls before the next steering cycle.`;
}

export function recommendedGovernanceAction(project: ProjectSignalInput, raidItems: RaidSignalInput[]) {
  const status = scoreProjectHealth(project, raidItems);
  const projectRaid = raidItems.filter((item) => item.project_id === project.id);
  const highRiskCount = projectRaid.filter((item) => Number(item.impact ?? 0) >= 15).length;

  if (status === "red") {
    return "Escalate to steering. Confirm owner, mitigation path and decision deadline within 48 hours.";
  }

  if (status === "amber" && highRiskCount > 0) {
    return "Run a focused RAID review and validate mitigation ownership before the next governance checkpoint.";
  }

  if (project.risk_focus === "vendor_dependency") {
    return "Create a named vendor milestone control and review handoff risks weekly.";
  }

  return "Maintain current governance cadence and continue monitoring delivery signals.";
}

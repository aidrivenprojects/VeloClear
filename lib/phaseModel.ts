import type { LifecyclePhase } from "@/lib/lifecycleEngine";

export type PhaseChecklistItem = {
  label: string;
  purpose: string;
};

export type PhaseModel = {
  phase: LifecyclePhase;
  goal: string;
  viewItems: PhaseChecklistItem[];
  editItems: PhaseChecklistItem[];
  intelligence: string[];
};

export const phaseModels: PhaseModel[] = [
  {
    phase: "Initiation",
    goal: "Confirm the project is worth starting and has clear ownership.",
    viewItems: [
      { label: "Business case", purpose: "Why the work exists and what value it should create." },
      { label: "Sponsor alignment", purpose: "Who owns outcomes and decisions." },
      { label: "Initial risk shape", purpose: "Early uncertainty before detailed planning." }
    ],
    editItems: [
      { label: "Sponsor", purpose: "Named accountable leader." },
      { label: "Outcome statement", purpose: "Clear business outcome." },
      { label: "Start gate", purpose: "Approval needed before planning." }
    ],
    intelligence: [
      "Detect unclear ownership before planning starts.",
      "Highlight weak business case signals.",
      "Recommend governance setup."
    ]
  },
  {
    phase: "Planning",
    goal: "Build a controlled plan before delivery activity scales.",
    viewItems: [
      { label: "RAID baseline", purpose: "Initial risks, assumptions, issues and dependencies." },
      { label: "Milestone plan", purpose: "Phase gates and critical path." },
      { label: "Governance cadence", purpose: "How reviews and escalations happen." }
    ],
    editItems: [
      { label: "Milestones", purpose: "Key delivery checkpoints." },
      { label: "Dependencies", purpose: "Internal and external handoffs." },
      { label: "Governance rhythm", purpose: "Weekly, fortnightly, steering cadence." }
    ],
    intelligence: [
      "Detect dependency overload.",
      "Flag missing RAID ownership.",
      "Recommend planning controls."
    ]
  },
  {
    phase: "Execution",
    goal: "Monitor active delivery, blockers, vendors and team execution signals.",
    viewItems: [
      { label: "Active blockers", purpose: "Current risks affecting work." },
      { label: "Vendor drift", purpose: "External handoff slippage." },
      { label: "Delivery rhythm", purpose: "Sprint/project progress signals." }
    ],
    editItems: [
      { label: "Blocker owner", purpose: "Who removes the blocker." },
      { label: "Mitigation action", purpose: "What action reduces delivery risk." },
      { label: "Escalation trigger", purpose: "When governance must act." }
    ],
    intelligence: [
      "Detect vendor handoff slippage.",
      "Surface sprint or milestone instability.",
      "Recommend escalation timing."
    ]
  },
  {
    phase: "Monitoring & Controlling",
    goal: "Control delivery variance, governance breaches and executive decisions.",
    viewItems: [
      { label: "RAG trend", purpose: "Movement in project health." },
      { label: "Decision log", purpose: "Open decisions and governance blockers." },
      { label: "Control breaches", purpose: "Where governance thresholds were missed." }
    ],
    editItems: [
      { label: "Decision required", purpose: "Specific sponsor or steering decision." },
      { label: "Control owner", purpose: "Who restores governance control." },
      { label: "Reporting note", purpose: "Executive summary for steering." }
    ],
    intelligence: [
      "Detect governance drift.",
      "Flag overdue decisions.",
      "Generate executive steering narrative."
    ]
  },
  {
    phase: "Closure",
    goal: "Close delivery properly and turn experience into organisational learning.",
    viewItems: [
      { label: "Transition readiness", purpose: "Operational handover status." },
      { label: "Benefits check", purpose: "Whether intended value is ready to be tracked." },
      { label: "Lessons learned", purpose: "Reusable organisational memory." }
    ],
    editItems: [
      { label: "Closure gate", purpose: "Final acceptance checklist." },
      { label: "Open residual risk", purpose: "Risks transferred or closed." },
      { label: "Learning note", purpose: "Reusable pattern for future projects." }
    ],
    intelligence: [
      "Detect incomplete handover.",
      "Capture recurring lessons.",
      "Recommend closure evidence."
    ]
  }
];

export function getPhaseModel(phase: LifecyclePhase) {
  return phaseModels.find((item) => item.phase === phase) ?? phaseModels[2];
}

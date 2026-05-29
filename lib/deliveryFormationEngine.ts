export type DeliveryBlueprint = {
  projectName: string;
  domain: string;
  problem: string;
  workflows: string[];
  roles: string[];
  capabilities: string[];
  epics: { title: string; description: string }[];
  userStories: { role: string; want: string; benefit: string }[];
  sprintPlan: { sprint: string; goal: string; backlog: string[] }[];
  dependencies: string[];
  risks: { title: string; trigger: string; mitigation: string; score: number }[];
  governanceSignals: string[];
};

const commonRoles = ["Business Owner", "Product Owner", "Project Manager", "Scrum Master", "Solution Architect", "Delivery Team", "QA Lead"];

export const exampleBlueprintPrompts = [
  {
    label: "Digital Permit Management",
    prompt: "Build a permit management application where vendors submit work permits, departments approve, safety checks happen, work starts, spot inspections are recorded, permits can be extended or cancelled, and closure requires final verification."
  },
  {
    label: "Tenant Billing Platform",
    prompt: "Build a tenant billing platform for a building that calculates charges based on electricity usage, common area usage, parking, facilities and maintenance fees, then generates invoices, manages disputes and reconciles payments."
  },
  {
    label: "Vendor Onboarding Portal",
    prompt: "Build a vendor onboarding platform with document collection, compliance checks, approval routing, contract setup, renewal reminders, risk scoring and audit records."
  },
  {
    label: "Asset Maintenance System",
    prompt: "Build an asset maintenance system that tracks equipment, schedules preventive maintenance, assigns technicians, records inspections, manages breakdowns and reports downtime trends."
  }
];

function includesAny(text: string, words: string[]) {
  const lower = text.toLowerCase();
  return words.some((word) => lower.includes(word));
}

export function generateDeliveryBlueprint(input: string): DeliveryBlueprint {
  const text = input.trim() || exampleBlueprintPrompts[0].prompt;
  const isPermit = includesAny(text, ["permit", "inspection", "vendor", "safety", "closure"]);
  const isBilling = includesAny(text, ["billing", "tenant", "invoice", "electricity", "payment"]);
  const isVendor = includesAny(text, ["onboarding", "contract", "supplier", "compliance"]);
  const isMaintenance = includesAny(text, ["maintenance", "asset", "equipment", "technician", "breakdown"]);

  if (isBilling) return tenantBillingBlueprint(text);
  if (isVendor) return vendorOnboardingBlueprint(text);
  if (isMaintenance) return maintenanceBlueprint(text);
  if (isPermit) return permitBlueprint(text);
  return genericApplicationBlueprint(text);
}

function permitBlueprint(problem: string): DeliveryBlueprint {
  return {
    projectName: "Digital Permit Management System",
    domain: "Operational workflow digitisation",
    problem,
    workflows: ["Permit request", "Risk assessment", "Special permit attachment", "Department approvals", "Work execution", "Spot inspection", "Extension or cancellation", "Closure request", "Final verification"],
    roles: ["Vendor", "Person In Charge", "Property Management", "Security", "Safety Officer", "Inspector", ...commonRoles],
    capabilities: ["Permit submission", "Special permit selection", "Approval routing", "Risk checklist", "Validity tracking", "Inspection logging", "Extension workflow", "Closure workflow", "Audit trail"],
    epics: [
      { title: "Permit Intake", description: "Capture general and special permit requests with required data and attachments." },
      { title: "Approval Workflow", description: "Route permits to PM, Security and Safety approvers with SLA tracking." },
      { title: "Inspection & Control", description: "Record spot checks, observations, violations and work stoppages." },
      { title: "Closure & Audit", description: "Manage closure request, final inspection, evidence and audit history." }
    ],
    userStories: [
      { role: "Vendor", want: "submit a permit request", benefit: "work can be reviewed before execution" },
      { role: "Approver", want: "review risk controls and attachments", benefit: "unsafe work is prevented" },
      { role: "Inspector", want: "record spot checks", benefit: "site compliance is visible" },
      { role: "Project Manager", want: "track approval delays and permit status", benefit: "delivery risk is controlled" }
    ],
    sprintPlan: [
      { sprint: "Sprint 1", goal: "Permit request foundation", backlog: ["General permit form", "vendor role", "permit status model", "basic dashboard"] },
      { sprint: "Sprint 2", goal: "Approvals and risk controls", backlog: ["approval routing", "risk checklist", "special permit flags", "notifications"] },
      { sprint: "Sprint 3", goal: "Execution control", backlog: ["inspection logs", "validity tracking", "extension flow", "cancellation flow"] },
      { sprint: "Sprint 4", goal: "Closure and learning", backlog: ["closure request", "final verification", "audit trail", "retrospective insights"] }
    ],
    dependencies: ["approval matrix", "department roles", "notification channel", "document storage", "audit retention rules"],
    risks: [
      { title: "Approval bottleneck may delay permit activation", trigger: "Permit remains awaiting approval beyond SLA", mitigation: "Add escalation owner and approval reminders", score: 15 },
      { title: "Special permit requirements may be missed", trigger: "High-risk work submitted without special permit", mitigation: "Add mandatory special permit selection logic", score: 12 },
      { title: "Closure evidence may be incomplete", trigger: "Closure requested without final inspection", mitigation: "Require final verification before closure", score: 10 }
    ],
    governanceSignals: ["approval SLA breach", "permit expiry risk", "inspection failure", "repeat vendor violation", "closure delay"]
  };
}

function tenantBillingBlueprint(problem: string): DeliveryBlueprint {
  return {
    projectName: "Tenant Utility Billing Platform",
    domain: "Billing and facilities operations",
    problem,
    workflows: ["Tenant onboarding", "Meter reading intake", "Usage calculation", "Rate application", "Invoice generation", "Approval", "Tenant notification", "Payment reconciliation", "Dispute resolution"],
    roles: ["Tenant", "Facility Admin", "Finance Approver", "Property Manager", "Metering Vendor", ...commonRoles],
    capabilities: ["tenant master", "meter data import", "billing rules", "invoice engine", "payment tracking", "dispute workflow", "reports", "audit trail"],
    epics: [
      { title: "Tenant & Unit Master", description: "Maintain tenants, units, leases, spaces and charge categories." },
      { title: "Usage & Rate Engine", description: "Calculate electricity and common area charges from usage and rules." },
      { title: "Invoice & Payment Workflow", description: "Generate invoices, notify tenants and track payments." },
      { title: "Dispute & Reconciliation", description: "Handle billing disputes, adjustments and finance approvals." }
    ],
    userStories: [
      { role: "Facility Admin", want: "upload meter readings", benefit: "usage can be calculated accurately" },
      { role: "Tenant", want: "view invoice breakdown", benefit: "charges are transparent" },
      { role: "Finance Approver", want: "approve billing runs", benefit: "billing is controlled before release" },
      { role: "Property Manager", want: "see outstanding payments", benefit: "revenue leakage is visible" }
    ],
    sprintPlan: [
      { sprint: "Sprint 1", goal: "Tenant and space foundation", backlog: ["tenant master", "unit mapping", "charge categories", "admin dashboard"] },
      { sprint: "Sprint 2", goal: "Usage calculation", backlog: ["meter import", "rate setup", "usage rules", "calculation preview"] },
      { sprint: "Sprint 3", goal: "Invoice workflow", backlog: ["invoice generation", "approval workflow", "email notification", "tenant view"] },
      { sprint: "Sprint 4", goal: "Payments and disputes", backlog: ["payment tracking", "dispute form", "adjustment approval", "reconciliation report"] }
    ],
    dependencies: ["meter source data", "rate cards", "tenant master data", "finance approval process", "payment gateway or ERP"],
    risks: [
      { title: "Meter data quality may affect billing accuracy", trigger: "Missing or inconsistent readings", mitigation: "Add validation and exception queue", score: 15 },
      { title: "Rate rule ambiguity may create disputes", trigger: "Manual overrides exceed threshold", mitigation: "Create approved rate rule library", score: 12 },
      { title: "Finance approval delay may block invoicing", trigger: "Billing run pending approval beyond SLA", mitigation: "Escalate approval and enable reminders", score: 10 }
    ],
    governanceSignals: ["billing run delay", "data quality exception", "invoice dispute spike", "payment reconciliation gap", "approval SLA breach"]
  };
}

function vendorOnboardingBlueprint(problem: string): DeliveryBlueprint {
  return {
    projectName: "Vendor Onboarding Platform",
    domain: "Supplier governance",
    problem,
    workflows: ["Vendor registration", "Document upload", "Compliance review", "Risk assessment", "Approval", "Contract setup", "Renewal reminders"],
    roles: ["Vendor", "Procurement", "Compliance", "Legal", "Finance", ...commonRoles],
    capabilities: ["vendor profile", "document checklist", "approval routing", "risk scoring", "contract tracking", "renewal alerts"],
    epics: [
      { title: "Vendor Intake", description: "Capture vendor profile and onboarding documents." },
      { title: "Compliance Review", description: "Review mandatory documents and risk indicators." },
      { title: "Approval & Activation", description: "Approve vendors and activate them for business use." }
    ],
    userStories: [
      { role: "Vendor", want: "submit onboarding documents", benefit: "approval can start" },
      { role: "Compliance", want: "review missing documents", benefit: "risks are visible" },
      { role: "Procurement", want: "track onboarding status", benefit: "supplier readiness is clear" }
    ],
    sprintPlan: [
      { sprint: "Sprint 1", goal: "Vendor intake", backlog: ["registration", "profile", "document upload"] },
      { sprint: "Sprint 2", goal: "Compliance workflow", backlog: ["checklist", "review queue", "risk scoring"] },
      { sprint: "Sprint 3", goal: "Approval and renewals", backlog: ["approval workflow", "activation", "renewal reminders"] }
    ],
    dependencies: ["document checklist", "approval matrix", "legal templates", "vendor master"],
    risks: [
      { title: "Missing compliance documents may delay activation", trigger: "Mandatory document missing", mitigation: "Add checklist validation", score: 12 },
      { title: "Legal review may become a bottleneck", trigger: "Contract review pending beyond SLA", mitigation: "Escalate legal queue", score: 10 }
    ],
    governanceSignals: ["missing document", "approval delay", "renewal risk", "risk score increase"]
  };
}

function maintenanceBlueprint(problem: string): DeliveryBlueprint {
  return {
    projectName: "Asset Maintenance Management System",
    domain: "Facilities maintenance",
    problem,
    workflows: ["Asset registration", "Preventive schedule", "Work order", "Technician assignment", "Inspection", "Breakdown handling", "Closure", "Downtime reporting"],
    roles: ["Facility Manager", "Technician", "Supervisor", "Vendor", ...commonRoles],
    capabilities: ["asset master", "maintenance schedule", "work orders", "inspection checklist", "downtime tracking", "reports"],
    epics: [
      { title: "Asset Registry", description: "Track maintainable assets and locations." },
      { title: "Work Order Engine", description: "Create and assign maintenance jobs." },
      { title: "Inspection & Closure", description: "Capture completion evidence and downtime insights." }
    ],
    userStories: [
      { role: "Facility Manager", want: "schedule preventive maintenance", benefit: "asset downtime reduces" },
      { role: "Technician", want: "receive assigned work orders", benefit: "jobs are clear" },
      { role: "Supervisor", want: "verify closure", benefit: "quality is controlled" }
    ],
    sprintPlan: [
      { sprint: "Sprint 1", goal: "Asset and schedule foundation", backlog: ["asset master", "location mapping", "schedule setup"] },
      { sprint: "Sprint 2", goal: "Work order delivery", backlog: ["work order creation", "assignment", "status updates"] },
      { sprint: "Sprint 3", goal: "Closure and reporting", backlog: ["inspection checklist", "closure evidence", "downtime report"] }
    ],
    dependencies: ["asset data", "maintenance checklist", "technician roster", "notification workflow"],
    risks: [
      { title: "Poor asset data may weaken scheduling", trigger: "Missing asset criticality or location", mitigation: "Create mandatory asset data checks", score: 12 },
      { title: "Closure quality may be inconsistent", trigger: "Work order closed without inspection", mitigation: "Require supervisor verification", score: 10 }
    ],
    governanceSignals: ["overdue work order", "repeat breakdown", "missed preventive maintenance", "closure without evidence"]
  };
}

function genericApplicationBlueprint(problem: string): DeliveryBlueprint {
  return {
    projectName: "Custom Business Application",
    domain: "Application development",
    problem,
    workflows: ["Request intake", "Validation", "Approval", "Processing", "Notification", "Reporting", "Closure"],
    roles: ["Requester", "Approver", "Admin", "Operations User", ...commonRoles],
    capabilities: ["intake forms", "workflow routing", "role-based access", "status tracking", "notifications", "reports", "audit trail"],
    epics: [
      { title: "Intake & Data Capture", description: "Capture business requests and required fields." },
      { title: "Workflow & Approvals", description: "Move work through users, approvals and states." },
      { title: "Tracking & Reporting", description: "Provide dashboards, audit logs and operational reports." }
    ],
    userStories: [
      { role: "Requester", want: "submit a request", benefit: "the process starts digitally" },
      { role: "Approver", want: "review and approve requests", benefit: "governance is controlled" },
      { role: "Admin", want: "track all work statuses", benefit: "operations are visible" }
    ],
    sprintPlan: [
      { sprint: "Sprint 1", goal: "Intake foundation", backlog: ["request form", "status model", "user roles"] },
      { sprint: "Sprint 2", goal: "Workflow controls", backlog: ["approval routing", "notifications", "audit log"] },
      { sprint: "Sprint 3", goal: "Reporting", backlog: ["dashboard", "filters", "export"] }
    ],
    dependencies: ["business rules", "role matrix", "data fields", "notification channels"],
    risks: [
      { title: "Requirements may remain unclear", trigger: "Workflow steps not agreed", mitigation: "Run discovery review with stakeholders", score: 12 },
      { title: "Approval rules may delay build", trigger: "Approval matrix not confirmed", mitigation: "Define role and SLA matrix", score: 10 }
    ],
    governanceSignals: ["unclear requirements", "approval rule gap", "scope change", "data dependency"]
  };
}

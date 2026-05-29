export type ModuleKey =
  | "charter" | "wbs" | "backlog" | "sprints" | "raid" | "stakeholders"
  | "governance" | "evm" | "impact-trace" | "learning" | "reports" | "capacity";

export type BlueprintModule = {
  key: ModuleKey;
  title: string;
  strapline: string;
  standard: string;
  livesIn: string;
  captures: string[];
  tracks: string[];
  intelligence: string[];
  links: string[];
};

export const blueprintModules: BlueprintModule[] = [
  { key:"charter", title:"Project Charter", strapline:"Initiation control: objectives, scope, constraints and sign-off authority.", standard:"PMBOK Initiating / Project Charter", livesIn:"Initiation", captures:["Business objective","Scope and out-of-scope","Sponsor","Success criteria","Triple constraint"], tracks:["Charter completeness","Sponsor approval","Scope clarity","Decision authority"], intelligence:["Flags unclear objectives","Detects missing sponsor","Suggests scope questions"], links:["Stakeholders","WBS","Governance"] },
  { key:"wbs", title:"WBS & Schedule", strapline:"Turns scope into work packages, milestones, Gantt structure and delivery traceability.", standard:"WBS / Gantt / Scope baseline", livesIn:"Planning", captures:["Themes","Epics","Features","Work packages","Milestones"], tracks:["% complete","Critical path","Baseline vs actual","Schedule drift"], intelligence:["Detects missing deliverables","Highlights critical-path risk","Links WBS items to sprint work"], links:["Backlog","Sprints","EVM"] },
  { key:"backlog", title:"Product Backlog", strapline:"The operational delivery layer between project planning and execution.", standard:"Agile Product Backlog / PBI / User Stories", livesIn:"Planning + Execution", captures:["Epics","Features","PBIs","User stories","Acceptance criteria","Story points"], tracks:["Priority","Readiness","Sprint assignment","Dependencies","Linked risks"], intelligence:["Finds unready stories","Identifies dependency-heavy PBIs","Suggests sprint sequencing"], links:["WBS","Sprints","RAID"] },
  { key:"sprints", title:"Sprint Backlog & Sprint Intelligence", strapline:"Tracks committed work, blockers, velocity, burndown, throughput and sprint learning.", standard:"Scrum Sprint Backlog / Velocity / Burndown", livesIn:"Execution", captures:["Sprint goal","Committed PBIs","Tasks","Owners","Blockers"], tracks:["Velocity","Burndown","Carry-forward","Blocked stories","Throughput"], intelligence:["Explains sprint slippage","Detects recurring blockers","Creates retro actions"], links:["Backlog","Impact Trace","Learning"] },
  { key:"raid", title:"RAID Log", strapline:"Risks, assumptions, issues and dependencies with trigger-based escalation.", standard:"RAID / Risk Register / Issue Log", livesIn:"Risk & RAID", captures:["Risks","Assumptions","Issues","Dependencies","Triggers","Mitigations"], tracks:["Probability","Impact","Score","Owner","Status","Materialisation"], intelligence:["Converts triggered risk into issue","Detects accumulation","Links issue to sprint impact"], links:["Governance","Impact Trace","Reports"] },
  { key:"stakeholders", title:"Stakeholders, RACI & Comms", strapline:"Maps power, interest, sentiment, ownership, communication and accountability.", standard:"Stakeholder Register / Power-Interest / RACI / Comms Plan", livesIn:"Stakeholder Management", captures:["Stakeholders","Power","Interest","Sentiment","RACI roles","Communication cadence"], tracks:["Engagement gap","Next action","Decision owner","Comms status"], intelligence:["Flags missing accountable owner","Detects resistant stakeholders","Suggests comms actions"], links:["Charter","Governance","Reports"] },
  { key:"governance", title:"Governance & Change Control", strapline:"Controls decisions, change requests, escalations, RAG and audit evidence.", standard:"RAG / Change Control / Escalation / Decision Rights / Audit", livesIn:"Monitoring & Controlling", captures:["RAG status","Change requests","Escalations","Decisions","Audit trail"], tracks:["Decision latency","CR impact","Escalation age","RAG movement"], intelligence:["Recommends governance action","Detects decision bottlenecks","Explains RAG change"], links:["RAID","EVM","Impact Trace"] },
  { key:"evm", title:"Budget & EVM", strapline:"Live CPI, SPI, EAC, VAC and cost/schedule intelligence.", standard:"Earned Value Management", livesIn:"Monitoring & Controlling", captures:["BAC","PV","EV","AC","Forecast assumptions"], tracks:["CPI","SPI","EAC","VAC","Cost variance","Schedule variance"], intelligence:["Predicts budget pressure","Explains schedule efficiency","Feeds Delivery Answer"], links:["Dashboard","Reports","Governance"] },
  { key:"impact-trace", title:"Impact Trace", strapline:"The signature chain: blocker → risk → issue → escalation → decision → resolution → learning.", standard:"Root Cause / Post-mortem / Audit Trace", livesIn:"Intelligence", captures:["Blocker","Cause","Risk trigger","Issue","Escalation","Decision","Resolution"], tracks:["Delay cause","Owner","Cycle time","Recurrence","Learning effectiveness"], intelligence:["Explains why delivery slipped","Identifies recurring causes","Prevents future recurrence"], links:["Sprints","RAID","Learning"] },
  { key:"learning", title:"Learning Library", strapline:"Turns retrospectives, closures and delay traces into institutional memory.", standard:"Lessons Learned / Retrospective / Knowledge Base", livesIn:"Closure + Intelligence", captures:["Retro actions","Lessons","Recommendations","Future prevention rules"], tracks:["Action closure","Recurrence","Reuse in future projects"], intelligence:["Surfaces past lessons in similar projects","Detects repeated failures","Scores learning adoption"], links:["Impact Trace","Sprints","Closure"] },
  { key:"reports", title:"Reports & Exports", strapline:"Role-based reports for PM, Sponsor, PMO, Steering and Auditor.", standard:"Status Reports / Steering Packs / Audit Reports", livesIn:"Reports & Data", captures:["Report audience","Metrics","Narrative","Evidence","Export format"], tracks:["Report readiness","Missing commentary","Audit evidence gaps"], intelligence:["Drafts status narrative","Adapts report by role","Highlights missing inputs"], links:["Dashboard","Governance","EVM"] },
  { key:"capacity", title:"People & Capacity", strapline:"Shows utilisation, ownership, overload, sprint capacity and role risk.", standard:"Resource Plan / Capacity Plan", livesIn:"Portfolio + Execution", captures:["People","Roles","Assignments","Capacity","Utilisation"], tracks:["Over-allocation","Team capacity","Sprint load","Owner concentration"], intelligence:["Detects overload before blocker","Links person patterns to delay","Suggests redistribution"], links:["Sprints","Stakeholders","Portfolio"] }
];

export function getBlueprintModule(key: string) {
  return blueprintModules.find((module) => module.key === key) ?? blueprintModules[0];
}

export const deliveryGraph = ["Project Charter","WBS","Product Backlog","Epic","Feature","PBI / User Story","Sprint Backlog","Sprint","Task","Blocker","Risk","Issue","Escalation","Decision","Resolution","Learning"];

export const sampleTrace = [
  { label:"PBI-142", detail:"Approval workflow story blocked by vendor API dependency." },
  { label:"Sprint 3 Slip", detail:"Committed 42 pts, delivered 36 pts. 86% predictability." },
  { label:"Dependency D001", detail:"Vendor API wrapper unavailable by planned handoff date." },
  { label:"Risk R001", detail:"Vendor dependency trigger fired after two working days." },
  { label:"Issue I001", detail:"Testing delayed; release confidence reduced." },
  { label:"Escalation Stage 2", detail:"PM + Sponsor decision required." },
  { label:"Resolution", detail:"Wrapper activated, 3-day slip accepted." },
  { label:"Learning", detail:"Escalate vendor delays in 24h, not 48h. Future sprint recurrence prevented." }
];

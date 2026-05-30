export type DeliveryObject = {
  id: string; project_id: string; phase_slug: string; tool_slug: string; object_type: string;
  title: string; description: string | null; status: string; owner: string | null; severity: string | null;
};
export type DeliveryRelationship = { id: string; project_id: string; source_object_id: string; target_object_id: string; relationship_type: string; };
export type IntelligenceEvent = { id: string; project_id: string; source_object_id: string | null; event_type: string; title: string; explanation: string | null; recommendation: string | null; severity: string; status: string; };
export type LearningMemory = { id: string; project_id: string; source_event_id: string | null; lesson_type: string; title: string; lesson: string; future_recommendation: string | null; recurrence_status: string | null; };

const p = "facility-permit-system";
export const demoDeliveryObjects: DeliveryObject[] = [
  ["obj-001","initiation","business-case","Business Case","Reduce permit approval cycle time by 40%","Business value depends on reducing approval delay.","approved","Operations Sponsor","green"],
  ["obj-002","initiation","charter","Charter","Permit workflow digitisation charter","Mandate to digitise request, approval, inspection and closure.","approved","Sponsor","green"],
  ["obj-003","planning","wbs","WBS","Approval workflow engine work package","Build configurable routing for approval workflow.","in_progress","Business Analyst","amber"],
  ["obj-004","planning","product-backlog","PBI","PBI-142: Approver can approve permit requests","Backlog item blocked by unclear approval ownership.","blocked","Product Owner","red"],
  ["obj-005","planning","sprint-backlog","Sprint Backlog Item","Sprint 2: approval routing commitment","Approval routing selected into sprint backlog.","at_risk","Scrum Master","amber"],
  ["obj-006","agile-delivery","sprint-board","Sprint Card","Configure department approval matrix","Cannot complete without approval ownership.","blocked","Developer","red"],
  ["obj-007","raid","raid-log","Risk","Approval matrix unresolved for more than two days","Risk trigger fires after two working days unresolved.","triggered","Project Manager","red"],
  ["obj-008","raid","issue-log","Issue","QA testing blocked by missing approval rules","Testing cannot proceed until interim routing decision.","open","QA Lead","red"],
  ["obj-009","governance","escalation-tracker","Escalation","Sponsor decision needed on interim approval model","Decision needed within 48 hours.","open","Sponsor","red"],
  ["obj-010","governance","decision-rights","Decision","Use two-level interim approval routing","Sponsor approves temporary simplified routing.","approved","Sponsor","amber"],
  ["obj-011","agile-delivery","retrospective","Retrospective Action","Confirm approval ownership before sprint commitment","Do not commit approval stories until owners are known.","actioned","Scrum Master","green"],
  ["obj-012","intelligence","impact-trace","Future Recommendation","Add approval ownership gate to future projects","Future approval-heavy projects require ownership gate.","active","VeloClear Intelligence","green"]
].map(([id, phase_slug, tool_slug, object_type, title, description, status, owner, severity]) => ({ id, project_id:p, phase_slug, tool_slug, object_type, title, description, status, owner, severity }));

export const demoRelationships: DeliveryRelationship[] = [
  ["obj-001","obj-002","AUTHORIZES"],["obj-002","obj-003","DECOMPOSES_TO"],["obj-003","obj-004","GENERATES"],["obj-004","obj-005","SELECTED_INTO"],["obj-005","obj-006","EXECUTED_AS"],["obj-006","obj-007","TRIGGERS"],["obj-007","obj-008","CREATES"],["obj-008","obj-009","ESCALATES_TO"],["obj-009","obj-010","REQUIRES"],["obj-010","obj-011","FEEDS_RETRO"],["obj-011","obj-012","CREATES_LEARNING"]
].map(([s,t,r],i)=>({id:`rel-${i+1}`, project_id:p, source_object_id:s, target_object_id:t, relationship_type:r}));

export const demoEvents: IntelligenceEvent[] = [
  {id:"event-001", project_id:p, source_object_id:"obj-004", event_type:"blocked_pbi", title:"PBI blocked by unresolved approval ownership", explanation:"The PBI entered sprint planning before approval ownership was confirmed.", recommendation:"Move approval validation into Sprint 0 readiness.", severity:"red", status:"open"},
  {id:"event-002", project_id:p, source_object_id:"obj-007", event_type:"risk_triggered", title:"Risk trigger fired and issue was created", explanation:"Approval matrix risk exceeded trigger threshold.", recommendation:"Escalate to Sponsor and record decision rights.", severity:"red", status:"open"},
  {id:"event-003", project_id:p, source_object_id:"obj-011", event_type:"learning_created", title:"Retrospective action converted into future recommendation", explanation:"Sprint learning now prevents the same failure from recurring.", recommendation:"Apply as mandatory gate for future approval-heavy projects.", severity:"green", status:"captured"}
];

export const demoLearning: LearningMemory[] = [
  {id:"learn-001", project_id:p, source_event_id:"event-003", lesson_type:"approval_governance", title:"Approval ownership must be confirmed before delivery commitment", lesson:"Approval-heavy workflows slip when accountability is unclear before sprint planning.", future_recommendation:"Add an approval ownership gate to Sprint 0.", recurrence_status:"prevention_rule_created"}
];

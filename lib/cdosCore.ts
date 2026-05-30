"use client";

import { getSupabaseClient } from "@/lib/supabaseClient";

export type Project = { id:string; slug:string; name:string; methodology:string; summary:string; health:"green"|"amber"|"red" };
export type Phase = { phase_slug:string; phase_number:number; title:string; status:string };
export type Tool = { phase_slug:string; tool_slug:string; title:string; enabled:boolean };
export type Obj = { id:string; project_id:string; phase_slug:string; tool_slug:string; object_type:string; title:string; description:string|null; status:string; owner:string|null; severity:"green"|"amber"|"red" };
export type Rel = { id:string; project_id:string; source_object_id:string; target_object_id:string; relationship_type:string };
export type Event = { id:string; project_id:string; source_object_id:string|null; event_type:string; title:string; explanation:string|null; recommendation:string|null; severity:"green"|"amber"|"red"; status:string };
export type Learning = { id:string; project_id:string; title:string; lesson:string; future_recommendation:string|null };

const K={p:"cdos.p",ph:"cdos.ph",t:"cdos.t",o:"cdos.o",r:"cdos.r",e:"cdos.e",l:"cdos.l"};
function parse<T>(k:string,f:T):T{if(typeof window==="undefined")return f;try{return JSON.parse(localStorage.getItem(k)||"") as T}catch{return f}}
function save<T>(k:string,v:T){if(typeof window!=="undefined")localStorage.setItem(k,JSON.stringify(v))}
export function slugify(s:string){return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)+/g,"")||`project-${Date.now()}`}
function uid(x:string){return `${x}-${Date.now()}-${Math.random().toString(16).slice(2)}`}

export const templates=[
 {phase_slug:"initiation",phase_number:1,title:"Initiation",tools:[["charter","Charter"],["business-case","Business Case"],["stakeholders","Stakeholders"],["scope","Scope"]]},
 {phase_slug:"planning",phase_number:2,title:"Planning",tools:[["wbs","WBS"],["schedule","Schedule"],["resource-plan","Resource Plan"],["product-backlog","Product Backlog"],["sprint-backlog","Sprint Backlog"],["milestones","Milestones"]]},
 {phase_slug:"mobilisation",phase_number:3,title:"Mobilisation",tools:[["kickoff-pack","Kick-off Pack"],["sprint-zero","Sprint 0 Checklist"],["team-onboarding","Team Onboarding"]]},
 {phase_slug:"raid",phase_number:4,title:"RAID",tools:[["raid-log","RAID Log"],["risk-heat-map","Risk Heat Map"],["issue-log","Issue Log"]]},
 {phase_slug:"stakeholders",phase_number:5,title:"Stakeholders",tools:[["stakeholder-register","Stakeholder Register"],["power-interest-grid","Power-Interest Grid"],["engagement-matrix","Engagement Matrix"],["raci-matrix","RACI Matrix"],["communications-plan","Communications Plan"]]},
 {phase_slug:"governance",phase_number:6,title:"Governance",tools:[["rag-dashboard","RAG Dashboard"],["change-control","Change Control"],["escalation-tracker","Escalation Tracker"],["decision-rights","Decision Rights"],["audit-trail","Audit Trail"],["auto-reports","Auto Reports"],["import-export","Import / Export"]]},
 {phase_slug:"agile-delivery",phase_number:7,title:"Agile Delivery",tools:[["product-backlog","Product Backlog"],["sprint-board","Sprint Board"],["burndown","Burndown"],["velocity","Velocity"],["retrospective","Retrospective"]]},
 {phase_slug:"intelligence",phase_number:8,title:"Intelligence",tools:[["impact-trace","Impact Trace"],["sprint-intelligence","Sprint Intelligence"],["evm","EVM"],["people-capacity","People & Capacity"],["delivery-graph","Delivery Graph"]]}
];

function seedProject():Project{
 const p={id:"facility-permit-system",slug:"facility-permit-system",name:"Facility Permit System",methodology:"Hybrid",summary:"Digitise permit request, approval, inspection, extension and closure.",health:"amber" as const};
 save(K.p,[p]); generateLocal(p); return p;
}
export async function listProjects():Promise<Project[]>{
 try{const s=getSupabaseClient();const r=await s.from("projects").select("*").order("created_at",{ascending:false});if(r.error||!r.data?.length)throw 0;return r.data as Project[]}catch{const p=parse<Project[]>(K.p,[]);return p.length?p:[seedProject()]}
}
export async function getProject(id:string){const ps=await listProjects();return ps.find(p=>p.slug===id||p.id===id)||ps[0]}
export async function createProject(input:{name:string;methodology:string;summary:string}){
 const slug=slugify(input.name);
 try{const s=getSupabaseClient();const r=await s.from("projects").insert({slug,name:input.name,methodology:input.methodology,summary:input.summary,health:"amber"}).select().single();if(r.error)throw r.error;await generateSupabase(r.data as Project);return r.data as Project}
 catch{const p={id:slug,slug,name:input.name,methodology:input.methodology,summary:input.summary,health:"amber" as const};const ps=await listProjects();save(K.p,[p,...ps.filter(x=>x.slug!==slug)]);generateLocal(p);return p}
}
function baseObjects(p:Project):Obj[]{const mk=(phase_slug:string,tool_slug:string,object_type:string,title:string,desc:string,status:string,owner:string,severity:"green"|"amber"|"red"):Obj=>({id:uid("obj"),project_id:p.id,phase_slug,tool_slug,object_type,title,description:desc,status,owner,severity});return[
 mk("initiation","business-case","Business Case",`Business value for ${p.name}`,p.summary,"approved","Sponsor","green"),
 mk("initiation","charter","Charter",`${p.name} charter`,"Scope, authority and success criteria.","approved","Sponsor","green"),
 mk("planning","wbs","WBS","Delivery work breakdown","Core deliverables decomposed.","in_progress","PM","amber"),
 mk("planning","product-backlog","PBI","PBI-001: Define core workflow","Primary user story from discovery.","ready","PO","green"),
 mk("planning","sprint-backlog","Sprint Backlog Item","Sprint 1: workflow foundation","Committed sprint work.","at_risk","Scrum Master","amber"),
 mk("agile-delivery","sprint-board","Sprint Card","Build workflow screen","Card under execution.","in_progress","Developer","amber"),
 mk("raid","raid-log","Risk","Decision ownership may delay delivery","Risk if owner not confirmed.","open","PM","amber"),
 mk("governance","escalation-tracker","Escalation","Sponsor decision path","Escalation for blocked decisions.","open","Sponsor","amber"),
 mk("agile-delivery","retrospective","Retrospective Action","Capture delivery learning","Learning loop for prevention.","open","Scrum Master","green"),
 mk("intelligence","impact-trace","Impact Trace","Initial trace chain","Business case to learning trace.","active","VeloClear","green")
]}
function rels(p:Project,os:Obj[]):Rel[]{return os.slice(0,-1).map((o,i)=>({id:uid("rel"),project_id:p.id,source_object_id:o.id,target_object_id:os[i+1].id,relationship_type:["AUTHORIZES","DECOMPOSES_TO","GENERATES","SELECTED_INTO","EXECUTED_AS","TRIGGERS","ESCALATES_TO","FEEDS_RETRO","CREATES_LEARNING"][i]||"RELATES_TO"}))}
function signals(project_id:string,os:Obj[]):Event[]{const ev:Event[]=[];os.filter(o=>o.severity==="red"||o.status==="blocked").forEach(o=>ev.push({id:uid("event"),project_id,source_object_id:o.id,event_type:"signal",title:`${o.object_type} needs action`,explanation:`${o.title} is ${o.status}.`,recommendation:`Review ${o.phase_slug}/${o.tool_slug} and assign action.`,severity:"red",status:"open"}));const amber=os.filter(o=>o.severity==="amber").length;if(amber>=3)ev.push({id:uid("event"),project_id,source_object_id:null,event_type:"amber_cluster",title:"Amber concentration detected",explanation:`${amber} amber records are accumulating.`,recommendation:"Run RAID and governance review.",severity:"amber",status:"open"});return ev}
function learn(project_id:string,ev:Event[]):Learning[]{return ev.map(e=>({id:uid("learn"),project_id,title:`Learning from ${e.title}`,lesson:e.explanation||"",future_recommendation:e.recommendation||""}))}
function phaseRows(p:Project):Phase[]{return templates.map(t=>({project_id:p.id,phase_slug:t.phase_slug,phase_number:t.phase_number,title:t.title,status:t.phase_number<=2?"active":"not_started"} as any))}
function toolRows(p:Project):Tool[]{return templates.flatMap(t=>t.tools.map(([tool_slug,title])=>({project_id:p.id,phase_slug:t.phase_slug,tool_slug,title,enabled:true} as any)))}
function generateLocal(p:Project){const os=baseObjects(p), ev=signals(p.id,os);save(K.ph,[...parse<Phase[]>(K.ph,[]).filter(x=>(x as any).project_id!==p.id),...phaseRows(p)]);save(K.t,[...parse<Tool[]>(K.t,[]).filter(x=>(x as any).project_id!==p.id),...toolRows(p)]);save(K.o,[...parse<Obj[]>(K.o,[]).filter(x=>x.project_id!==p.id),...os]);save(K.r,[...parse<Rel[]>(K.r,[]).filter(x=>x.project_id!==p.id),...rels(p,os)]);save(K.e,[...parse<Event[]>(K.e,[]).filter(x=>x.project_id!==p.id),...ev]);save(K.l,[...parse<Learning[]>(K.l,[]).filter(x=>x.project_id!==p.id),...learn(p.id,ev)])}
async function generateSupabase(p:Project){const s=getSupabaseClient(), os=baseObjects(p), ev=signals(p.id,os);await s.from("project_phases").insert(phaseRows(p));await s.from("project_tools").insert(toolRows(p));const ins=await s.from("delivery_objects").insert(os.map(({id,...o})=>o)).select();const m=new Map<string,string>();ins.data?.forEach((r:any,i:number)=>m.set(os[i].id,r.id));await s.from("delivery_relationships").insert(rels(p,os).map(r=>({project_id:p.id,source_object_id:m.get(r.source_object_id),target_object_id:m.get(r.target_object_id),relationship_type:r.relationship_type})).filter(r=>r.source_object_id&&r.target_object_id));await s.from("intelligence_events").insert(ev.map(({id,...e})=>({...e,source_object_id:e.source_object_id?m.get(e.source_object_id):null})));await s.from("learning_memory").insert(learn(p.id,ev).map(({id,...l})=>l))}
export async function getData(id:string){const p=await getProject(id);try{const s=getSupabaseClient();const [ph,t,o,r,e,l]=await Promise.all([s.from("project_phases").select("*").eq("project_id",p.id).order("phase_number"),s.from("project_tools").select("*").eq("project_id",p.id),s.from("delivery_objects").select("*").eq("project_id",p.id).order("created_at"),s.from("delivery_relationships").select("*").eq("project_id",p.id),s.from("intelligence_events").select("*").eq("project_id",p.id),s.from("learning_memory").select("*").eq("project_id",p.id)]);if(o.error||!o.data?.length)throw 0;return{project:p,phases:ph.data as Phase[],tools:t.data as Tool[],objects:o.data as Obj[],rels:r.data as Rel[],events:e.data as Event[],learning:l.data as Learning[],source:"supabase"}}catch{return{project:p,phases:parse<any[]>(K.ph,[]).filter(x=>x.project_id===p.id),tools:parse<any[]>(K.t,[]).filter(x=>x.project_id===p.id),objects:parse<Obj[]>(K.o,[]).filter(x=>x.project_id===p.id),rels:parse<Rel[]>(K.r,[]).filter(x=>x.project_id===p.id),events:parse<Event[]>(K.e,[]).filter(x=>x.project_id===p.id),learning:parse<Learning[]>(K.l,[]).filter(x=>x.project_id===p.id),source:"local"}}}
export async function addObject(projectId:string,phase_slug:string,tool_slug:string,title:string,description:string){const d=await getData(projectId);const o:Obj={id:uid("obj"),project_id:d.project.id,phase_slug,tool_slug,object_type:tool_slug.replace(/-/g," "),title,description,status:"open",owner:"Project Team",severity:"amber"};if(d.source==="supabase"){const s=getSupabaseClient();await s.from("delivery_objects").insert({project_id:d.project.id,phase_slug,tool_slug,object_type:o.object_type,title,description,status:o.status,owner:o.owner,severity:o.severity})}else{save(K.o,[o,...parse<Obj[]>(K.o,[])])}}
export async function updateObject(projectId:string,objectId:string,status:string,severity:"green"|"amber"|"red"){const d=await getData(projectId);if(d.source==="supabase"){const s=getSupabaseClient();await s.from("delivery_objects").update({status,severity,updated_at:new Date().toISOString()}).eq("id",objectId)}else{const all=parse<Obj[]>(K.o,[]).map(o=>o.id===objectId?{...o,status,severity}:o);save(K.o,all);const os=all.filter(o=>o.project_id===d.project.id), ev=signals(d.project.id,os);save(K.e,[...parse<Event[]>(K.e,[]).filter(e=>e.project_id!==d.project.id),...ev]);save(K.l,[...parse<Learning[]>(K.l,[]).filter(l=>l.project_id!==d.project.id),...learn(d.project.id,ev)])}}

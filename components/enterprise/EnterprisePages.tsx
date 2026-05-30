"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {AppShell} from "@/components/layout/AppShell";
import {Card} from "@/components/ui/Card";
import {Badge} from "@/components/ui/Badge";
import {getData} from "@/lib/cdosCore";
import {generateReport,inferWorkflow,integrations,methodologyPacks,roles,getRoleView,type RoleName} from "@/lib/enterpriseCDOS";

function tone(v?:string|null){return v==="red"?"red":v==="green"?"green":"amber"}

export function MethodologyPage(){
 return <AppShell title="Methodology Packs" kicker="Configuration"><div className="space-y-5"><Card className="p-6"><h1 className="text-3xl font-black tracking-[-0.04em] text-ink">Configurable methodology packs.</h1><p className="mt-3 text-sm text-ink2">These define which phases and tools are activated for a project.</p></Card><div className="grid gap-5 lg:grid-cols-2">{methodologyPacks.map(p=><Card key={p.slug} className="p-5"><div className="text-xs font-black uppercase tracking-wider text-accent">{p.slug}</div><h2 className="mt-2 text-xl font-black text-ink">{p.name}</h2><p className="mt-2 text-sm text-ink2">{p.description}</p><div className="mt-4 flex flex-wrap gap-2">{p.phases.map(x=><span key={x} className="rounded-full bg-accentBg px-3 py-1 text-xs font-black text-accent">{x}</span>)}</div></Card>)}</div></div></AppShell>
}

export function RolesPage({projectId="facility-permit-system"}:{projectId?:string}){
 const [role,setRole]=useState<RoleName>("Project Manager"); const [data,setData]=useState<any>();
 useEffect(()=>{getRoleView(projectId,role).then(setData)},[projectId,role]);
 return <AppShell title="Role-Based Views" kicker="RBAC Simulation"><div className="space-y-5"><Card className="p-6"><h1 className="text-3xl font-black text-ink">Role-aware delivery workspace.</h1><select value={role} onChange={e=>setRole(e.target.value as RoleName)} className="mt-5 rounded-2xl border border-border bg-surface p-4 text-sm font-bold text-ink">{roles.map(r=><option key={r}>{r}</option>)}</select></Card>{data&&<><Card className="p-5"><h2 className="text-sm font-black text-ink">Permissions</h2><div className="mt-4 grid gap-3 md:grid-cols-4">{["view","edit","approve","export"].map(k=><div key={k} className="rounded-2xl bg-surface p-4"><div className="text-xs font-black uppercase text-muted">{k}</div><div className="mt-2 text-sm font-bold text-ink">{data.permissions[k].join(", ")||"None"}</div></div>)}</div></Card><Card className="p-5"><h2 className="text-sm font-black text-ink">Visible objects</h2><div className="mt-4 grid gap-3">{data.objects.map((o:any)=><div key={o.id} className="rounded-2xl border border-border bg-white p-4"><div className="flex justify-between gap-3"><div><div className="text-xs font-black uppercase text-muted">{o.phase_slug}/{o.tool_slug}</div><div className="text-sm font-black text-ink">{o.title}</div></div><Badge tone={tone(o.severity)}>{o.status}</Badge></div></div>)}</div></Card></>}</div></AppShell>
}

export function ReportsPage({projectId="facility-permit-system"}:{projectId?:string}){
 const [audience,setAudience]=useState("Sponsor"); const [data,setData]=useState<any>();
 useEffect(()=>{getData(projectId).then(setData)},[projectId]);
 const report=useMemo(()=>data?generateReport(data,audience):null,[data,audience]);
 return <AppShell title="Auto Reports" kicker="Reporting Engine"><div className="space-y-5"><Card className="p-6"><h1 className="text-3xl font-black text-ink">Role-specific delivery reports.</h1><select value={audience} onChange={e=>setAudience(e.target.value)} className="mt-5 rounded-2xl border border-border bg-surface p-4 text-sm font-bold text-ink"><option>Sponsor</option><option>PMO</option><option>Steering Committee</option><option>Auditor</option><option>Scrum Master</option></select></Card>{report&&<Card className="p-6"><h2 className="text-2xl font-black text-ink">{report.title}</h2><p className="mt-3 text-sm text-ink2">{report.summary}</p><div className="mt-5 grid gap-3">{report.sections.map((s:any)=><div key={s.title} className="rounded-2xl border border-border bg-surface p-4"><div className="text-xs font-black uppercase text-muted">{s.title}</div><div className="mt-2 text-sm font-bold text-ink">{s.value}</div></div>)}</div></Card>}</div></AppShell>
}

export function AuditPage({projectId="facility-permit-system"}:{projectId?:string}){
 const [data,setData]=useState<any>(); useEffect(()=>{getData(projectId).then(setData)},[projectId]);
 const audit=data?data.objects.map((o:any,i:number)=>({id:o.id,type:i<3?"generated":"updated",object:o.title,actor:i%2?"Project Manager":"System",time:"Current session"})):[];
 return <AppShell title="Audit Trail" kicker="Governance Evidence"><Card className="p-6"><h1 className="text-3xl font-black text-ink">Audit trail.</h1><p className="mt-3 text-sm text-ink2">Evidence log for generated and updated delivery records.</p></Card><Card className="mt-5 p-5"><div className="grid gap-3">{audit.map((a:any)=><div key={a.id} className="rounded-2xl border border-border bg-white p-4"><div className="text-sm font-black text-ink">{a.object}</div><div className="mt-1 text-xs text-muted">{a.type} · {a.actor} · {a.time}</div></div>)}</div></Card></AppShell>
}

export function IntegrationsPage(){
 return <AppShell title="Integrations" kicker="Connector Setup"><div className="grid gap-5 lg:grid-cols-3">{integrations.map(i=><Card key={i.provider} className="p-5"><div className="flex justify-between gap-3"><h2 className="text-xl font-black text-ink">{i.provider}</h2><Badge tone={i.status==="planned"?"amber":"green"}>{i.status}</Badge></div><p className="mt-3 text-sm text-ink2">{i.maps}</p><button className="mt-5 rounded-xl border border-border bg-white px-4 py-2 text-sm font-black text-ink">Configure</button></Card>)}</div></AppShell>
}

export function WorkflowIngestionPage(){
 const [text,setText]=useState(""); const result=useMemo(()=>text.trim()?inferWorkflow(text):null,[text]);
 return <AppShell title="Workflow Ingestion" kicker="AI Discovery Workspace"><div className="grid gap-5 xl:grid-cols-[1fr_.9fr]"><Card className="p-6"><h1 className="text-3xl font-black text-ink">Convert a workflow into delivery structure.</h1><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Paste a permit process, SOP, billing workflow, approval process..." className="mt-5 min-h-[280px] w-full rounded-2xl border border-border bg-surface p-4 text-sm font-bold text-ink outline-none"/></Card><Card className="p-6"><h2 className="text-xl font-black text-ink">Generated structure</h2>{result?<div className="mt-4 space-y-4"><Block title="Workflow steps" items={result.steps}/><Block title="Generated backlog" items={result.backlog.map((b:any)=>`${b.id}: ${b.title}`)}/><Block title="Generated risks" items={result.risks}/><div className="rounded-2xl bg-accentBg p-4 text-sm font-bold text-[#312E81]">{result.governance}</div></div>:<p className="mt-3 text-sm text-muted">Paste a workflow to generate backlog, risks and governance suggestions.</p>}</Card></div></AppShell>
}
function Block({title,items}:{title:string;items:string[]}){return <div><div className="text-xs font-black uppercase text-muted">{title}</div><div className="mt-2 grid gap-2">{items.map(x=><div key={x} className="rounded-xl bg-surface px-3 py-2 text-sm font-bold text-ink">{x}</div>)}</div></div>}

"use client";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { fetchConnectedOS, seedConnectedOS } from "@/lib/connectedOSService";
import type { DeliveryObject, DeliveryRelationship, IntelligenceEvent, LearningMemory } from "@/lib/connectedOSModel";

function tone(v?: string | null) { return v === "red" || v === "blocked" ? "red" : v === "green" || v === "approved" || v === "active" || v === "actioned" ? "green" : "amber"; }

export function ConnectedOSPage({ projectId }: { projectId: string }) {
  const [objects,setObjects]=useState<DeliveryObject[]>([]);
  const [relationships,setRelationships]=useState<DeliveryRelationship[]>([]);
  const [events,setEvents]=useState<IntelligenceEvent[]>([]);
  const [learning,setLearning]=useState<LearningMemory[]>([]);
  const [source,setSource]=useState<"supabase"|"demo">("demo");
  const [selectedId,setSelectedId]=useState("");
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);

  async function load(){
    const data = await fetchConnectedOS(projectId);
    setObjects(data.objects); setRelationships(data.relationships); setEvents(data.events); setLearning(data.learning); setSource(data.source);
    setSelectedId(data.objects.find(o=>o.status==="blocked")?.id ?? data.objects[0]?.id ?? "");
  }
  useEffect(()=>{ load(); },[projectId]);
  const selected = objects.find(o=>o.id===selectedId) ?? objects[0];
  const upstream = useMemo(()=> selected ? relationships.filter(r=>r.target_object_id===selected.id).map(r=>objects.find(o=>o.id===r.source_object_id)).filter(Boolean) as DeliveryObject[] : [],[selected,relationships,objects]);
  const downstream = useMemo(()=> selected ? relationships.filter(r=>r.source_object_id===selected.id).map(r=>objects.find(o=>o.id===r.target_object_id)).filter(Boolean) as DeliveryObject[] : [],[selected,relationships,objects]);

  async function seed(){
    setBusy(true); setMessage("");
    try { await seedConnectedOS(projectId); setMessage("Connected OS seeded into Supabase."); await load(); }
    catch(e){ setMessage(e instanceof Error ? e.message : "Seed failed."); }
    finally { setBusy(false); }
  }

  return (
    <AppShell title="Connected Delivery OS" kicker="Intelligence Platform MVP">
      <div className="space-y-5">
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-accent">Project: {projectId}</div>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">Connected delivery operating system.</h1>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">Phase objects, records, relationships, signals and learning memory in one traceable view.</p>
            </div>
            <Badge tone={source==="supabase"?"green":"amber"}>{source==="supabase"?"Supabase-backed":"Demo-backed"}</Badge>
          </div>
          {source==="demo" && <div className="mt-5 rounded-2xl border border-amber/20 bg-amberBg p-4"><div className="text-sm font-black text-amber">Demo mode</div><p className="mt-1 text-xs leading-5 text-ink2">Run connected_delivery_os_schema.sql, then seed this project.</p><button onClick={seed} disabled={busy} className="mt-3 rounded-xl bg-accent px-4 py-2 text-xs font-black text-white disabled:opacity-60">{busy?"Seeding...":"Seed connected OS"}</button></div>}
          {message && <div className="mt-4 rounded-xl bg-accentBg px-4 py-3 text-sm font-bold text-accent">{message}</div>}
        </Card>

        <div className="grid gap-5 xl:grid-cols-4">
          <Metric label="Objects" value={objects.length.toString()} />
          <Metric label="Relationships" value={relationships.length.toString()} />
          <Metric label="Signals" value={events.length.toString()} />
          <Metric label="Learning" value={learning.length.toString()} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
          <Card className="p-5">
            <h2 className="text-sm font-black text-ink">Connected delivery objects</h2>
            <div className="mt-4 grid gap-3">
              {objects.map(obj=> <button key={obj.id} onClick={()=>setSelectedId(obj.id)} className={selected?.id===obj.id ? "rounded-2xl border border-accent bg-accentBg p-4 text-left":"rounded-2xl border border-border bg-white p-4 text-left hover:border-accent/40"}>
                <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="text-[10px] font-black uppercase tracking-wider text-muted">{obj.object_type} · {obj.phase_slug} / {obj.tool_slug}</div><div className="mt-1 text-sm font-black text-ink">{obj.title}</div><p className="mt-1 text-xs leading-5 text-muted">{obj.description}</p></div><Badge tone={tone(obj.severity)}>{obj.status}</Badge></div>
              </button>)}
            </div>
          </Card>

          <div className="space-y-5">
            {selected && <Card className="p-5"><div className="text-[10px] font-black uppercase tracking-wider text-accent">{selected.object_type}</div><h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-ink">{selected.title}</h2><p className="mt-3 text-sm leading-6 text-ink2">{selected.description}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><Mini label="Phase" value={selected.phase_slug}/><Mini label="Tool" value={selected.tool_slug}/><Mini label="Owner" value={selected.owner ?? "Unassigned"}/><Mini label="Severity" value={selected.severity ?? "medium"}/></div></Card>}

            <Card className="p-5"><h2 className="text-sm font-black text-ink">Cause and effect</h2><div className="mt-4 grid gap-3"><Rel title="Upstream causes" items={upstream}/><Rel title="Downstream impact" items={downstream}/></div></Card>

            <Card className="p-5"><h2 className="text-sm font-black text-ink">Intelligence events</h2><div className="mt-4 grid gap-3">{events.map(e=><div key={e.id} className="rounded-2xl border border-border bg-surface p-4"><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-black text-ink">{e.title}</div><p className="mt-1 text-xs leading-5 text-muted">{e.explanation}</p></div><Badge tone={tone(e.severity)}>{e.severity}</Badge></div><div className="mt-3 rounded-xl bg-accentBg p-3 text-xs font-bold leading-5 text-[#312E81]">Action: {e.recommendation}</div></div>)}</div></Card>

            <Card className="p-5"><h2 className="text-sm font-black text-ink">Learning memory</h2><div className="mt-4 grid gap-3">{learning.map(l=><div key={l.id} className="rounded-2xl border border-border bg-white p-4"><div className="text-sm font-black text-ink">{l.title}</div><p className="mt-1 text-xs leading-5 text-muted">{l.lesson}</p><div className="mt-3 rounded-xl bg-surface p-3 text-xs font-bold leading-5 text-muted">Future recommendation: {l.future_recommendation}</div></div>)}</div></Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
function Metric({label,value}:{label:string;value:string}){return <Card className="p-5"><div className="text-xs font-black uppercase tracking-wider text-muted">{label}</div><div className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">{value}</div></Card>}
function Mini({label,value}:{label:string;value:string}){return <div className="rounded-2xl border border-border bg-surface p-4"><div className="text-[10px] font-black uppercase tracking-wider text-muted">{label}</div><div className="mt-1 text-sm font-black text-ink">{value}</div></div>}
function Rel({title,items}:{title:string;items:DeliveryObject[]}){return <div className="rounded-2xl border border-border bg-surface p-4"><div className="text-xs font-black uppercase tracking-wider text-muted">{title}</div><div className="mt-3 grid gap-2">{items.length ? items.map(i=><div key={i.id} className="rounded-xl bg-white px-3 py-2 text-xs font-black text-ink">{i.title}</div>) : <div className="text-xs font-bold text-muted">No linked objects.</div>}</div></div>}

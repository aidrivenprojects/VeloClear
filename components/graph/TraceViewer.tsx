"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchGraph, seedProjectGraph } from "@/lib/graphPersistence";
import { graphTypeLabels, graphOrder, type GraphNode, type DeliverySignal } from "@/lib/graphTypes";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

function badgeTone(severity?: string | null) {
  if (severity === "red" || severity === "high") return "red";
  if (severity === "green" || severity === "low") return "green";
  return "amber";
}

export function TraceViewer({ projectId }: { projectId?: string | null }) {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [signals, setSignals] = useState<DeliverySignal[]>([]);
  const [source, setSource] = useState<"supabase" | "demo">("demo");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const graph = await fetchGraph(projectId);
    setNodes(graph.nodes);
    setSignals(graph.signals);
    setSource(graph.source);
    setSelectedId(graph.nodes[0]?.id ?? null);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [projectId]);

  const sortedNodes = useMemo(() => [...nodes].sort((a, b) => graphOrder.indexOf(a.node_type) - graphOrder.indexOf(b.node_type)), [nodes]);
  const selected = sortedNodes.find((node) => node.id === selectedId) ?? sortedNodes[0];
  const relatedSignals = signals.filter((signal) => signal.node_id === selected?.id || !signal.node_id);

  async function onSeed() {
    if (!projectId) {
      setMessage("Open a saved project to seed this graph into Supabase.");
      return;
    }
    setSeeding(true);
    setMessage(null);
    try {
      await seedProjectGraph(projectId);
      setMessage("Demo graph seeded into this project.");
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not seed graph.");
    } finally {
      setSeeding(false);
    }
  }

  if (loading) return <Card className="p-8"><div className="text-sm font-black text-muted">Loading trace graph…</div></Card>;

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-accent">Canonical graph engine</div>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">Business goal → delivery work → governance → learning.</h1>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">Every node connects to what caused it and what it affects next.</p>
          </div>
          <Badge tone={source === "supabase" ? "green" : "amber"}>{source === "supabase" ? "Live project graph" : "Demo graph"}</Badge>
        </div>

        {source === "demo" && (
          <div className="mt-5 rounded-2xl border border-amber/20 bg-amberBg p-4">
            <div className="text-sm font-black text-amber">Demo graph active</div>
            <p className="mt-1 text-xs leading-5 text-ink2">Run the SQL migration, then open a saved project and seed this graph to persist it.</p>
            <button onClick={onSeed} disabled={seeding} className="mt-3 rounded-xl bg-accent px-4 py-2 text-xs font-black text-white disabled:opacity-60">
              {seeding ? "Seeding..." : "Seed graph into this project"}
            </button>
          </div>
        )}

        {message && <div className="mt-4 rounded-xl bg-accentBg px-4 py-3 text-sm font-bold text-accent">{message}</div>}
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_.85fr]">
        <Card className="p-5">
          <h2 className="text-sm font-black text-ink">Connected trace chain</h2>
          <div className="mt-5 grid gap-3">
            {sortedNodes.map((node, index) => (
              <button type="button" key={node.id} onClick={() => setSelectedId(node.id)}
                className={selected?.id === node.id ? "rounded-2xl border border-accent bg-accentBg p-4 text-left" : "rounded-2xl border border-border bg-white p-4 text-left transition hover:border-accent/40"}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-xs font-black text-accent">{index + 1}</span>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-muted">{graphTypeLabels[node.node_type] ?? node.node_type}</div>
                      <div className="text-sm font-black text-ink">{node.title}</div>
                    </div>
                  </div>
                  <Badge tone={badgeTone(node.severity)}>{node.status}</Badge>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          {selected && (
            <Card className="p-5">
              <div className="text-[10px] font-black uppercase tracking-wider text-accent">{graphTypeLabels[selected.node_type] ?? selected.node_type}</div>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-ink">{selected.title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink2">{selected.description}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Mini label="Phase" value={selected.phase ?? "Unassigned"} />
                <Mini label="Owner" value={selected.owner ?? "Unassigned"} />
                <Mini label="Status" value={selected.status} />
                <Mini label="Severity" value={selected.severity ?? "medium"} />
              </div>
            </Card>
          )}

          <Card className="p-5">
            <h2 className="text-sm font-black text-ink">Signals and recommendations</h2>
            <div className="mt-4 grid gap-3">
              {(relatedSignals.length ? relatedSignals : signals.slice(0, 3)).map((signal) => (
                <div key={signal.id} className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-black text-ink">{signal.title}</div>
                      <p className="mt-1 text-xs leading-5 text-muted">{signal.explanation}</p>
                    </div>
                    <Badge tone={badgeTone(signal.severity)}>{signal.severity}</Badge>
                  </div>
                  {signal.recommended_action && <div className="mt-3 rounded-xl bg-accentBg p-3 text-xs font-bold leading-5 text-[#312E81]">Action: {signal.recommended_action}</div>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="text-[10px] font-black uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-1 text-sm font-black text-ink">{value}</div>
    </div>
  );
}

import { getSupabaseClient } from "@/lib/supabaseClient";
import { demoGraphNodes, demoGraphEdges, demoSignals } from "@/lib/demoGraphData";
import type { GraphNode, GraphEdge, DeliverySignal } from "@/lib/graphTypes";

export async function fetchGraph(projectId?: string | null): Promise<{
  nodes: GraphNode[];
  edges: GraphEdge[];
  signals: DeliverySignal[];
  source: "supabase" | "demo";
}> {
  if (!projectId) return { nodes: demoGraphNodes, edges: demoGraphEdges, signals: demoSignals, source: "demo" };

  try {
    const supabase = getSupabaseClient();
    const [nodesResult, edgesResult, signalsResult] = await Promise.all([
      supabase.from("graph_nodes").select("*").eq("project_id", projectId).order("created_at", { ascending: true }),
      supabase.from("graph_edges").select("*").eq("project_id", projectId).order("created_at", { ascending: true }),
      supabase.from("delivery_signals").select("*").eq("project_id", projectId).order("created_at", { ascending: false })
    ]);

    if (nodesResult.error) throw nodesResult.error;
    if (edgesResult.error) throw edgesResult.error;
    if (signalsResult.error) throw signalsResult.error;

    const nodes = (nodesResult.data ?? []) as GraphNode[];
    if (!nodes.length) return { nodes: demoGraphNodes, edges: demoGraphEdges, signals: demoSignals, source: "demo" };

    return {
      nodes,
      edges: (edgesResult.data ?? []) as GraphEdge[],
      signals: (signalsResult.data ?? []) as DeliverySignal[],
      source: "supabase"
    };
  } catch {
    return { nodes: demoGraphNodes, edges: demoGraphEdges, signals: demoSignals, source: "demo" };
  }
}

export async function seedProjectGraph(projectId: string) {
  const supabase = getSupabaseClient();
  const nodeIdMap = new Map<string, string>();

  for (const node of demoGraphNodes) {
    const { data, error } = await supabase.from("graph_nodes").insert({
      project_id: projectId,
      node_type: node.node_type,
      title: node.title,
      description: node.description,
      status: node.status,
      owner: node.owner,
      phase: node.phase,
      severity: node.severity,
      metadata: node.metadata ?? {}
    }).select().single();

    if (error) throw error;
    nodeIdMap.set(node.id, data.id);
  }

  const edgeRows = demoGraphEdges.map((edge) => ({
    project_id: projectId,
    source_node_id: nodeIdMap.get(edge.source_node_id),
    target_node_id: nodeIdMap.get(edge.target_node_id),
    relationship: edge.relationship
  })).filter((edge) => edge.source_node_id && edge.target_node_id);

  if (edgeRows.length) {
    const { error } = await supabase.from("graph_edges").insert(edgeRows);
    if (error) throw error;
  }

  const signalRows = demoSignals.map((signal) => ({
    project_id: projectId,
    node_id: signal.node_id ? nodeIdMap.get(signal.node_id) : null,
    signal_type: signal.signal_type,
    severity: signal.severity,
    title: signal.title,
    explanation: signal.explanation,
    recommended_action: signal.recommended_action,
    status: signal.status
  }));

  const { error: signalError } = await supabase.from("delivery_signals").insert(signalRows);
  if (signalError) throw signalError;
  return true;
}

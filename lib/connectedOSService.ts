import { getSupabaseClient } from "@/lib/supabaseClient";
import { demoDeliveryObjects, demoRelationships, demoEvents, demoLearning, type DeliveryObject, type DeliveryRelationship, type IntelligenceEvent, type LearningMemory } from "@/lib/connectedOSModel";

export async function fetchConnectedOS(projectId: string): Promise<{objects: DeliveryObject[]; relationships: DeliveryRelationship[]; events: IntelligenceEvent[]; learning: LearningMemory[]; source: "supabase" | "demo"}> {
  try {
    const supabase = getSupabaseClient();
    const [objects, relationships, events, learning] = await Promise.all([
      supabase.from("delivery_objects").select("*").eq("project_id", projectId).order("created_at", { ascending: true }),
      supabase.from("delivery_relationships").select("*").eq("project_id", projectId).order("created_at", { ascending: true }),
      supabase.from("intelligence_events").select("*").eq("project_id", projectId).order("created_at", { ascending: false }),
      supabase.from("learning_memory").select("*").eq("project_id", projectId).order("created_at", { ascending: false })
    ]);
    if (objects.error || relationships.error || events.error || learning.error || !objects.data?.length) throw new Error("fallback");
    return { objects: objects.data as DeliveryObject[], relationships: relationships.data as DeliveryRelationship[], events: events.data as IntelligenceEvent[], learning: learning.data as LearningMemory[], source: "supabase" };
  } catch {
    return { objects: demoDeliveryObjects, relationships: demoRelationships, events: demoEvents, learning: demoLearning, source: "demo" };
  }
}

export async function seedConnectedOS(projectId: string) {
  const supabase = getSupabaseClient();
  const inserted = await supabase.from("delivery_objects").insert(demoDeliveryObjects.map(o => ({
    project_id: projectId, phase_slug: o.phase_slug, tool_slug: o.tool_slug, object_type: o.object_type,
    title: o.title, description: o.description, status: o.status, owner: o.owner, severity: o.severity
  }))).select();
  if (inserted.error) throw inserted.error;
  const idMap = new Map<string,string>();
  inserted.data?.forEach((row, i) => idMap.set(demoDeliveryObjects[i].id, row.id));
  const relRows = demoRelationships.map(r => ({ project_id: projectId, source_object_id: idMap.get(r.source_object_id), target_object_id: idMap.get(r.target_object_id), relationship_type: r.relationship_type })).filter(r => r.source_object_id && r.target_object_id);
  if (relRows.length) {
    const rel = await supabase.from("delivery_relationships").insert(relRows);
    if (rel.error) throw rel.error;
  }
  const ev = await supabase.from("intelligence_events").insert(demoEvents.map(e => ({ project_id: projectId, source_object_id: e.source_object_id ? idMap.get(e.source_object_id) : null, event_type: e.event_type, title: e.title, explanation: e.explanation, recommendation: e.recommendation, severity: e.severity, status: e.status })));
  if (ev.error) throw ev.error;
  const lm = await supabase.from("learning_memory").insert(demoLearning.map(l => ({ project_id: projectId, lesson_type: l.lesson_type, title: l.title, lesson: l.lesson, future_recommendation: l.future_recommendation, recurrence_status: l.recurrence_status })));
  if (lm.error) throw lm.error;
}

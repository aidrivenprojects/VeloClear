import { AppShell } from "@/components/layout/AppShell";
import { TraceViewer } from "@/components/graph/TraceViewer";

export function TracePage({ projectId }: { projectId?: string | null }) {
  return (
    <AppShell title="Impact Trace" kicker="Graph Engine">
      <TraceViewer projectId={projectId} />
    </AppShell>
  );
}

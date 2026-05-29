import { AppShell } from "@/components/layout/AppShell";
import { LiveRaidWorkspace } from "@/components/raid/LiveRaidWorkspace";

export default function Page() {
  return (
    <AppShell title="RAID Workspace" kicker="Delivery">
      <LiveRaidWorkspace />
    </AppShell>
  );
}

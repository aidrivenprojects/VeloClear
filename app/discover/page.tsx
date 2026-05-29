export const dynamic = "force-dynamic";

import { AppShell } from "@/components/layout/AppShell";
import { DiscoveryIntake } from "@/components/discovery/DiscoveryIntake";

export default function Page() {
  return (
    <AppShell title="Discovery" kicker="Start">
      <DiscoveryIntake />
    </AppShell>
  );
}

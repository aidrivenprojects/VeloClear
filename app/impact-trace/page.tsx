import { AppShell } from "@/components/layout/AppShell";
import { LiveImpactTrace } from "@/components/impact/LiveImpactTrace";

export default function Page() {
  return (
    <AppShell title="Impact Trace" kicker="Intelligence">
      <LiveImpactTrace />
    </AppShell>
  );
}

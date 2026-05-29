import { AppShell } from "@/components/layout/AppShell";
import { PersistedDashboard } from "@/components/dashboard/PersistedDashboard";

export default function Page() {
  return (
    <AppShell title="Portfolio Dashboard" kicker="Home">
      <PersistedDashboard />
    </AppShell>
  );
}

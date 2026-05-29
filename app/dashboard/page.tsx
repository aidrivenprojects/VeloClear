import { AppShell } from "@/components/layout/AppShell";
import { LiveDashboard } from "@/components/dashboard/LiveDashboard";

export default function Page() {
  return (
    <AppShell title="Portfolio Dashboard" kicker="Home">
      <LiveDashboard />
    </AppShell>
  );
}

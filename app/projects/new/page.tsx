export const dynamic = "force-dynamic";

import { AppShell } from "@/components/layout/AppShell";
import { GuidedSetupForm } from "@/components/setup/GuidedSetupForm";

export default function Page() {
  return (
    <AppShell title="Guided Setup Intelligence" kicker="Start">
      <GuidedSetupForm />
    </AppShell>
  );
}

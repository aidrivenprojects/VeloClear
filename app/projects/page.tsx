import { AppShell } from "@/components/layout/AppShell";
import { ProjectList } from "@/components/projects/ProjectList";

export default function Page() {
  return (
    <AppShell title="Projects" kicker="Portfolio">
      <ProjectList />
    </AppShell>
  );
}

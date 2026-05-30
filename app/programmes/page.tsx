import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
const programmes = ["Operational Workflow Digitisation", "Smart Building Operations", "Regulatory Transformation"];
export default function Page() {
  return (
    <AppShell title="Programmes" kicker="Portfolio">
      <div className="grid gap-5 lg:grid-cols-3">
        {programmes.map(title => (
          <Card key={title} className="p-5">
            <h2 className="text-xl font-black text-ink">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink2">Programme workspace. Select projects to enter lifecycle delivery structure.</p>
            <Link href="/projects" className="mt-5 inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-black text-white">View projects</Link>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

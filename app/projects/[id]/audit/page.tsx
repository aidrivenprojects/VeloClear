"use client";
import { Shell } from "@/components/Shell";
import { Card } from "@/components/ui";
import { auditForProject, getProject, recordsForProject } from "@/lib/store";

export default function Page({ params }: { params: { id: string } }) {
  const project = getProject(params.id);
  const audit = auditForProject(project.id);
  const records = recordsForProject(project.id);

  return (
    <Shell title="Audit Trail" kicker={`Project: ${project.name}`}>
      <div className="space-y-6">
        <Card className="p-8">
          <h2 className="text-3xl font-black text-ink">Audit Trail</h2>
          <p className="mt-3 text-sm text-ink2">{audit.length} audit event(s). {records.length} connected record(s).</p>
        </Card>
        <Card className="p-6">
          <div className="grid gap-3">
            {audit.length ? audit.map((event) => (
              <div key={event.id} className="rounded-2xl border border-border bg-surface p-4">
                <div className="text-sm font-black text-ink">{event.action}: {event.entityTitle}</div>
                <div className="mt-1 text-xs text-muted">{event.entity} · {event.actor} · {new Date(event.timestamp).toLocaleString()}</div>
              </div>
            )) : records.map((record) => (
              <div key={record.id} className="rounded-2xl border border-border bg-surface p-4 text-sm font-bold text-ink">Generated: {record.title}</div>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

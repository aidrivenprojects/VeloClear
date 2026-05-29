"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchImpactEvents } from "@/lib/projectPersistence";
import { Card } from "@/components/ui/Card";

type ImpactRow = {
  id: string;
  project_id: string;
  event_type: string;
  title: string;
  description: string | null;
  created_at: string;
  projects?: { name?: string; health_status?: string; risk_focus?: string } | null;
};

export function LiveImpactTrace() {
  const [events, setEvents] = useState<ImpactRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImpactEvents()
      .then((data) => setEvents(data as ImpactRow[]))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Card className="p-8"><div className="text-sm font-black text-muted">Loading impact trace…</div></Card>;
  }

  return (
    <Card className="p-7">
      <div className="text-xs font-black uppercase tracking-wider text-accent">Signature feature</div>
      <h1 className="mt-4 max-w-4xl text-[48px] font-black leading-[0.98] tracking-[-0.06em] text-ink">
        Trace how delivery events become organisational learning.
      </h1>

      <div className="mt-8 border-l-2 border-accent/15 pl-6">
        {events.length === 0 ? (
          <div>
            <p className="mb-4 text-sm text-muted">No impact events exist yet.</p>
            <Link href="/projects/new" className="inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-black text-white">Generate workspace</Link>
          </div>
        ) : (
          events.map((event, index) => (
            <Link key={event.id} href={`/projects/${event.project_id}`} className="relative mb-5 block rounded-2xl border border-border bg-surface p-5 transition hover:border-accent/30 hover:bg-white">
              <span className={index % 3 === 0 ? "absolute -left-[34px] top-6 h-4 w-4 rounded-full bg-red" : index % 3 === 1 ? "absolute -left-[34px] top-6 h-4 w-4 rounded-full bg-amber" : "absolute -left-[34px] top-6 h-4 w-4 rounded-full bg-green"} />
              <div className="text-sm font-black text-ink">{event.title}</div>
              <div className="mt-1 text-xs font-bold text-accent">{event.projects?.name ?? "Saved workspace"}</div>
              <p className="mt-3 text-sm leading-6 text-ink2">{event.description}</p>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
}

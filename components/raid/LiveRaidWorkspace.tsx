"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchRaidItems } from "@/lib/projectPersistence";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type RaidRow = {
  id: string;
  project_id: string;
  title: string;
  trigger: string | null;
  mitigation: string | null;
  owner: string | null;
  status: string;
  probability: number | null;
  impact: number | null;
  projects?: { name?: string; health_status?: string; risk_focus?: string } | null;
};

export function LiveRaidWorkspace() {
  const [items, setItems] = useState<RaidRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRaidItems()
      .then((data) => setItems(data as RaidRow[]))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Card className="p-8"><div className="text-sm font-black text-muted">Loading live RAID items…</div></Card>;
  }

  return (
    <Card>
      <div className="border-b border-border p-5">
        <h2 className="text-xl font-black">RAID with trigger logic</h2>
        <p className="mt-1 text-sm text-muted">Live RAID items saved from generated workspaces.</p>
      </div>

      {items.length === 0 ? (
        <div className="p-6">
          <p className="mb-4 text-sm text-muted">No RAID items exist yet.</p>
          <Link href="/projects/new" className="inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-black text-white">Generate workspace</Link>
        </div>
      ) : (
        items.map((item) => (
          <Link
            key={item.id}
            href={`/projects/${item.project_id}`}
            className="grid gap-4 border-b border-border p-5 text-sm transition last:border-0 hover:bg-surface lg:grid-cols-[1fr_1fr_160px]"
          >
            <div>
              <div className="font-black text-ink">{item.title}</div>
              <div className="mt-1 text-xs text-muted">{item.projects?.name ?? "Saved workspace"} · Owner: {item.owner ?? "Unassigned"}</div>
            </div>
            <div className="text-ink2">{item.trigger ?? "No trigger captured"}</div>
            <Badge tone={Number(item.impact ?? 0) >= 15 ? "red" : "amber"}>Score {item.impact ?? 0}</Badge>
          </Link>
        ))
      )}
    </Card>
  );
}

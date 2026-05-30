import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { deliveryGraph } from "@/lib/canonicalModel";

export function DeliveryGraphPage() {
  return (
    <AppShell title="Delivery Graph" kicker="Connected Intelligence">
      <div className="space-y-5">
        <Card className="p-6">
          <div className="text-xs font-black uppercase tracking-wider text-accent">Traceability backbone</div>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink">
            From business goal to future recommendation.
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-ink2">
            This is the core chain VeloClear must persist, track and explain. Every signal should connect to the objects before and after it.
          </p>
        </Card>

        <div className="grid gap-3">
          {deliveryGraph.map((item, index) => (
            <Card key={`${item.type}-${index}`} className="p-4">
              <div className="grid gap-3 md:grid-cols-[56px_220px_1fr] md:items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accentBg text-sm font-black text-accent">
                  {index + 1}
                </div>
                <div className="text-sm font-black text-ink">{item.type}</div>
                <div className="text-sm leading-6 text-ink2">{item.value}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

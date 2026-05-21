import type { ReactElement } from "react";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Card } from "@/components/ui/Card";
import type { DashboardSummary } from "@/modules/trip/types/dashboard.types";

type DamageGaugeProps = {
  summary: DashboardSummary;
};

const levelToneMap: Record<DashboardSummary["level"], string> = {
  warmup: "text-nitro",
  drifting: "text-podium",
  turbo: "text-overtake",
  meltdown: "text-turbo",
};

export function DamageGauge({ summary }: DamageGaugeProps): ReactElement {
  return (
    <Card tone="highlight" className="space-y-4 overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-muted">TOTAL DAMAGE</p>
          <AnimatedCounter value={summary.totalDamage} prefix="฿" className="font-display text-4xl font-bold leading-none text-text" />
        </div>
      </div>

      <div className="rounded-control border border-borderSoft bg-track/60 px-3 py-2">
        <p className="text-xs uppercase tracking-[0.12em] text-muted">Damage Level</p>
        <p className={`text-sm font-semibold ${levelToneMap[summary.level]}`}>{summary.levelMessage}</p>
      </div>
    </Card>
  );
}

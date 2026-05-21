export type DamageLevel = "warmup" | "drifting" | "turbo" | "meltdown";

export type DashboardSummary = {
  totalDamage: number;
  level: DamageLevel;
  levelMessage: string;
};

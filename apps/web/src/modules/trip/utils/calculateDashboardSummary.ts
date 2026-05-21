import { calculateTotalDamage } from "@/modules/expense/utils/calculateTotalDamage";
import type { Expense } from "@/modules/expense/types/expense.types";
import type { DashboardSummary } from "@/modules/trip/types/dashboard.types";
import { getDamageLevelMessage } from "@/modules/trip/utils/getDamageLevelMessage";

export function calculateDashboardSummary(expenses: Expense[]): DashboardSummary {
  const totalDamage = calculateTotalDamage(expenses);
  const levelInfo = getDamageLevelMessage(totalDamage);

  return {
    totalDamage,
    level: levelInfo.level,
    levelMessage: levelInfo.message,
  };
}

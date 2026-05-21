import type { ReactElement } from "react";

import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/utils/formatMoney";
import { formatTripTime } from "@/utils/formatTripTime";
import type { Expense, ExpenseCategory } from "@/modules/expense/types/expense.types";

type DamageLogItemProps = {
  expense: Expense;
  payerNickname: string;
  canDelete: boolean;
  onDeleteExpense: (expenseId: string) => void;
};

const categoryLabelMap: Record<ExpenseCategory, string> = {
  fuel_burn: "⛽ ค่าน้ำมัน / ค่าเดินทาง",
  food_rampage: "🍽️ ค่าอาหาร / เครื่องดื่ม",
  safe_house: "🏨 ค่าที่พัก",
  coffee_snacks: "☕ กาแฟ / ของว่าง",
  entry_tickets: "🎟️ ค่าเข้า / ค่าบัตร",
  ride_hailing: "🚕 ค่าเดินทางในเมือง",
  equipment_rental: "🧰 ค่าอุปกรณ์ / ค่าเช่า",
  chaos_activities: "🧾 ค่าใช้จ่ายจิปาถะ",
};

function buildExpenseLabel(expense: Expense): string {
  const categoryLabel = expense.category ? categoryLabelMap[expense.category] : "";
  const customLabel = expense.customLabel?.trim() ?? "";
  if (categoryLabel && customLabel) {
    return `${categoryLabel} • ${customLabel}`;
  }
  if (customLabel) {
    return customLabel;
  }
  if (categoryLabel) {
    return categoryLabel;
  }
  return "🧾 รายการค่าใช้จ่าย";
}

export function DamageLogItem({ expense, payerNickname, canDelete, onDeleteExpense }: DamageLogItemProps): ReactElement {
  return (
    <article className="rounded-control border border-borderSoft bg-track/55 px-3 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text">{buildExpenseLabel(expense)}</p>
          <p className="text-xs text-muted">
            {payerNickname} • {formatTripTime(expense.createdAtIso)}
          </p>
          {expense.note ? <p className="mt-1 text-xs text-muted">{expense.note}</p> : null}
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="font-display text-xl font-bold text-overtake">{formatMoney(expense.amount)}</p>
          {canDelete ? (
            <Button variant="ghost" size="md" className="h-10 px-3 text-xs" onClick={() => onDeleteExpense(expense.id)}>
              ลบรายการนี้
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

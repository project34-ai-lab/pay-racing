import type { ReactElement } from "react";

import { Card } from "@/components/ui/Card";
import type { Expense } from "@/modules/expense/types/expense.types";
import type { Member } from "@/modules/member/types/member.types";
import { DamageLogItem } from "@/modules/expense/components/DamageLogItem";

type DamageLogListProps = {
  expenses: Expense[];
  members: Member[];
  currentMemberToken: string;
  onDeleteExpense: (expenseId: string) => void;
};

export function DamageLogList({ expenses, members, currentMemberToken, onDeleteExpense }: DamageLogListProps): ReactElement {
  const nicknameByToken = new Map(members.map((member: Member) => [member.token, member.nickname]));

  if (expenses.length === 0) {
    return (
      <Card className="space-y-2">
        <h2 className="font-display text-lg font-semibold text-text">Damage Logs</h2>
        <p className="text-sm text-muted">ยังไม่มีรายการค่าใช้จ่าย ลองเพิ่มรายการแรกได้เลย 🐢</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-3">
      <h2 className="font-display text-lg font-semibold text-text">Damage Logs</h2>
      <div className="space-y-2">
        {expenses.map((expense: Expense) => (
          <DamageLogItem
            key={expense.id}
            expense={expense}
            payerNickname={nicknameByToken.get(expense.payerToken) ?? expense.payerNickname ?? "Unknown Racer"}
            canDelete={expense.payerToken === currentMemberToken}
            onDeleteExpense={onDeleteExpense}
          />
        ))}
      </div>
    </Card>
  );
}

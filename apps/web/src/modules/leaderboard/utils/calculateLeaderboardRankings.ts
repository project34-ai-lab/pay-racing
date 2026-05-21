import type { Expense } from "@/modules/expense/types/expense.types";
import type { Member } from "@/modules/member/types/member.types";
import type { MemberToken } from "@/modules/member/types/member.types";
import type { LeaderboardEntry } from "@/modules/leaderboard/types/leaderboard.types";

export function calculateLeaderboardRankings(
  members: Member[],
  expenses: Expense[],
  creatorToken: MemberToken | null,
): LeaderboardEntry[] {
  const totals = new Map<MemberToken, { totalPaid: number; paidStages: number }>();

  expenses.forEach((expense: Expense) => {
    const existing = totals.get(expense.payerToken) ?? {
      totalPaid: 0,
      paidStages: 0,
    };

    totals.set(expense.payerToken, {
      totalPaid: existing.totalPaid + expense.amount,
      paidStages: existing.paidStages + 1,
    });
  });

  const entries = members.map((member: Member) => {
    const memberTotals = totals.get(member.token) ?? { totalPaid: 0, paidStages: 0 };

    return {
      rank: 0,
      memberToken: member.token,
      nickname: member.nickname,
      totalPaid: memberTotals.totalPaid,
      paidStages: memberTotals.paidStages,
      isCreator: creatorToken !== null && member.token === creatorToken,
    } satisfies LeaderboardEntry;
  });

  const sorted = [...entries].sort((left: LeaderboardEntry, right: LeaderboardEntry) => {
    if (right.totalPaid !== left.totalPaid) {
      return right.totalPaid - left.totalPaid;
    }

    if (right.paidStages !== left.paidStages) {
      return right.paidStages - left.paidStages;
    }

    return left.nickname.localeCompare(right.nickname);
  });

  return sorted.map((entry: LeaderboardEntry, index: number) => ({
    ...entry,
    rank: index + 1,
  }));
}

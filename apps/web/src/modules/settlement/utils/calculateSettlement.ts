import type { Expense } from "@/modules/expense/types/expense.types";
import type { Member } from "@/modules/member/types/member.types";
import type { MemberToken } from "@/modules/member/types/member.types";
import type { MemberBalance, SettlementInstruction, SettlementResult } from "@/modules/settlement/types/settlement.types";

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateSettlement(members: Member[], expenses: Expense[]): SettlementResult {
  if (members.length === 0) {
    return {
      balances: [],
      instructions: [],
    };
  }

  const memberByToken = new Map<MemberToken, Member>(members.map((member: Member) => [member.token, member]));

  const totalPaidByMember = new Map<MemberToken, number>();
  members.forEach((member: Member) => {
    totalPaidByMember.set(member.token, 0);
  });

  expenses.forEach((expense: Expense) => {
    totalPaidByMember.set(expense.payerToken, (totalPaidByMember.get(expense.payerToken) ?? 0) + expense.amount);
  });

  const totalDamage = expenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
  const sharePerMember = totalDamage / members.length;

  const balances: MemberBalance[] = members.map((member: Member) => {
    const paid = roundMoney(totalPaidByMember.get(member.token) ?? 0);
    const share = roundMoney(sharePerMember);
    const balance = roundMoney(paid - share);

    return {
      memberToken: member.token,
      nickname: member.nickname,
      paid,
      share,
      balance,
    };
  });

  const creditors = balances
    .filter((balance: MemberBalance) => balance.balance > 0.01)
    .map((balance: MemberBalance) => ({ ...balance }))
    .sort((left: MemberBalance, right: MemberBalance) => right.balance - left.balance);

  const debtors = balances
    .filter((balance: MemberBalance) => balance.balance < -0.01)
    .map((balance: MemberBalance) => ({ ...balance, balance: Math.abs(balance.balance) }))
    .sort((left: MemberBalance, right: MemberBalance) => right.balance - left.balance);

  const instructions: SettlementInstruction[] = [];

  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    const transferAmount = roundMoney(Math.min(creditor.balance, debtor.balance));

    if (transferAmount > 0) {
      const receiver = memberByToken.get(creditor.memberToken);
      const payer = memberByToken.get(debtor.memberToken);

      if (receiver && payer) {
        instructions.push({
          id: `${debtor.memberToken}->${creditor.memberToken}`,
          payerToken: debtor.memberToken,
          payerNickname: payer.nickname,
          receiverToken: creditor.memberToken,
          receiverNickname: receiver.nickname,
          receiverPromptPay: receiver.promptPay,
          amount: transferAmount,
          status: "pending",
        });
      }
    }

    creditor.balance = roundMoney(creditor.balance - transferAmount);
    debtor.balance = roundMoney(debtor.balance - transferAmount);

    if (creditor.balance <= 0.01) {
      creditorIndex += 1;
    }

    if (debtor.balance <= 0.01) {
      debtorIndex += 1;
    }
  }

  return {
    balances,
    instructions,
  };
}

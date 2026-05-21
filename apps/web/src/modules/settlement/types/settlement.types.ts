import type { MemberToken } from "@/modules/member/types/member.types";

export type PaymentStatus = "pending" | "completed";

export type MemberBalance = {
  memberToken: MemberToken;
  nickname: string;
  paid: number;
  share: number;
  balance: number;
};

export type SettlementInstruction = {
  id: string;
  payerToken: MemberToken;
  payerNickname: string;
  receiverToken: MemberToken;
  receiverNickname: string;
  receiverPromptPay?: string;
  amount: number;
  status: PaymentStatus;
};

export type SettlementResult = {
  balances: MemberBalance[];
  instructions: SettlementInstruction[];
};

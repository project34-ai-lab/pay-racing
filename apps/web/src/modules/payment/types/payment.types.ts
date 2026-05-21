import type { MemberToken } from "@/modules/member/types/member.types";

export type PaymentConfirmationEvent = {
  paymentId: string;
  fromMemberToken: MemberToken;
  toMemberToken: MemberToken;
  amount: number;
};

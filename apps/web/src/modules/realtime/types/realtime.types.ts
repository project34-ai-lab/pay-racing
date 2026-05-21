import type { Expense } from "@/modules/expense/types/expense.types";
import type { MemberToken } from "@/modules/member/types/member.types";
import type { MemberRole } from "@/modules/member/types/member.types";
import type { TripId } from "@/modules/trip/types/trip.types";

export type RealtimeEventName =
  | "member_joined"
  | "expense_created"
  | "expense_deleted"
  | "trip_deleted"
  | "settlement_updated"
  | "payment_confirmed";

export type RealtimeConnectionStatus = "connected" | "reconnecting" | "offline";

export type RealtimeEnvelope<TName extends RealtimeEventName, TPayload> = {
  eventId: string;
  name: TName;
  tripId: TripId;
  emittedAtIso: string;
  payload: TPayload;
};

export type MemberJoinedPayload = {
  memberToken: MemberToken;
  nickname: string;
  promptPay?: string;
  role?: MemberRole;
  source: "join" | "presence";
};

export type ExpenseCreatedPayload = {
  expense: Expense;
};

export type ExpenseDeletedPayload = {
  expenseId: string;
  deletedByMemberToken: MemberToken;
};

export type TripDeletedPayload = {
  deletedByMemberToken: MemberToken;
};

export type ExpenseCreatedEvent = RealtimeEnvelope<"expense_created", ExpenseCreatedPayload>;
export type ExpenseDeletedEvent = RealtimeEnvelope<"expense_deleted", ExpenseDeletedPayload>;
export type MemberJoinedEvent = RealtimeEnvelope<"member_joined", MemberJoinedPayload>;

export type SettlementUpdatedPayload = {
  settlementVersion: number;
};

export type PaymentConfirmedPayload = {
  paymentId: string;
  fromMemberToken: MemberToken;
  toMemberToken: MemberToken;
  amount: number;
};

export type RealtimeEventMap = {
  member_joined: MemberJoinedPayload;
  expense_created: ExpenseCreatedPayload;
  expense_deleted: ExpenseDeletedPayload;
  trip_deleted: TripDeletedPayload;
  settlement_updated: SettlementUpdatedPayload;
  payment_confirmed: PaymentConfirmedPayload;
};

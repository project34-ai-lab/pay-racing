import { prepareTripRealtime, publishTripEvent, subscribeTripEvent } from "@/modules/realtime/services/realtime.service";
import type { TripId } from "@/modules/trip/types/trip.types";
import type { Expense } from "@/modules/expense/types/expense.types";
import type { ExpenseCreatedEvent, ExpenseDeletedEvent } from "@/modules/realtime/types/realtime.types";
import type { MemberToken } from "@/modules/member/types/member.types";

export function buildExpenseCreatedEvent(expense: Expense): { expense: Expense } {
  return {
    expense,
  };
}

export function buildExpenseDeletedEvent(expenseId: string, deletedByMemberToken: MemberToken): { expenseId: string; deletedByMemberToken: MemberToken } {
  return {
    expenseId,
    deletedByMemberToken,
  };
}

export async function publishExpenseCreated(tripId: TripId, expense: Expense): Promise<{ ok: true } | { ok: false; message: string }> {
  return publishTripEvent(tripId, "expense_created", buildExpenseCreatedEvent(expense));
}

export async function publishExpenseDeleted(
  tripId: TripId,
  expenseId: string,
  deletedByMemberToken: MemberToken,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const firstAttempt = await publishTripEvent(tripId, "expense_deleted", buildExpenseDeletedEvent(expenseId, deletedByMemberToken));
  if (firstAttempt.ok) {
    return firstAttempt;
  }

  const prepared = await prepareTripRealtime(tripId);
  if (!prepared.ok) {
    return firstAttempt;
  }

  return publishTripEvent(tripId, "expense_deleted", buildExpenseDeletedEvent(expenseId, deletedByMemberToken));
}

export function subscribeExpenseCreated(
  tripId: TripId,
  onEvent: (event: ExpenseCreatedEvent) => void,
): { unsubscribe: () => void } | null {
  return subscribeTripEvent(tripId, "expense_created", onEvent);
}

export function subscribeExpenseDeleted(
  tripId: TripId,
  onEvent: (event: ExpenseDeletedEvent) => void,
): { unsubscribe: () => void } | null {
  return subscribeTripEvent(tripId, "expense_deleted", onEvent);
}

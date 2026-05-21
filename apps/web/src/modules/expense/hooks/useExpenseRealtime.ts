import { useEffect, useRef } from "react";

import { subscribeMemberJoined } from "@/modules/member/services/memberRealtime.service";
import { subscribeExpenseCreated, subscribeExpenseDeleted } from "@/modules/expense/services/expenseRealtime.service";
import { publishExpenseCreated } from "@/modules/expense/services/expenseRealtime.service";
import { useExpenseStore } from "@/modules/expense/stores/expense.store";
import type { Expense } from "@/modules/expense/types/expense.types";
import type { MemberToken } from "@/modules/member/types/member.types";
import type { TripId } from "@/modules/trip/types/trip.types";

const expenseBackfillReplyKeys = new Set<string>();

export function useExpenseRealtime(tripId: TripId | null, currentMemberToken: MemberToken | null): void {
  const addExpense = useExpenseStore((state) => state.addExpense);
  const removeExpense = useExpenseStore((state) => state.removeExpense);
  const expenses = useExpenseStore((state) => state.expenses);
  const expensesRef = useRef<Expense[]>([]);

  useEffect(() => {
    expensesRef.current = expenses;
  }, [expenses]);

  useEffect(() => {
    if (!tripId) {
      return;
    }

    const subscription = subscribeExpenseCreated(tripId, (event) => {
      addExpense(event.payload.expense);
    });
    const deleteSubscription = subscribeExpenseDeleted(tripId, (event) => {
      removeExpense(event.payload.expenseId);
    });
    const memberJoinedSubscription = subscribeMemberJoined(tripId, (event) => {
      if (!currentMemberToken) {
        return;
      }
      if (event.payload.source !== "join") {
        return;
      }

      const joinedMemberToken = event.payload.memberToken;
      if (joinedMemberToken === currentMemberToken) {
        return;
      }

      const replyKey = `${tripId}:${currentMemberToken}:${event.eventId}`;
      if (expenseBackfillReplyKeys.has(replyKey)) {
        return;
      }

      expenseBackfillReplyKeys.add(replyKey);
      const snapshotExpenses = expensesRef.current;
      snapshotExpenses.forEach((expense: Expense) => {
        void publishExpenseCreated(tripId, expense);
      });
    });

    return () => {
      subscription?.unsubscribe();
      deleteSubscription?.unsubscribe();
      memberJoinedSubscription?.unsubscribe();
    };
  }, [addExpense, currentMemberToken, removeExpense, tripId]);
}

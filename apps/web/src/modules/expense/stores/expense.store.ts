import { create } from "zustand";

import type { Expense } from "@/modules/expense/types/expense.types";
import type { TripId } from "@/modules/trip/types/trip.types";

type ExpenseState = {
  expenses: Expense[];
  activeTripId: TripId | null;
  seedExpenses: (tripId: TripId, expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  removeExpense: (expenseId: string) => void;
  clearTripExpenses: (tripId: TripId) => void;
};

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  activeTripId: null,
  seedExpenses: (tripId: TripId, expenses: Expense[]) => {
    if (get().activeTripId === tripId && get().expenses.length > 0) {
      return;
    }

    set({ activeTripId: tripId, expenses });
  },
  addExpense: (expense: Expense) => {
    const hasDuplicate = get().expenses.some((item: Expense) => item.id === expense.id);

    if (hasDuplicate) {
      return;
    }

    set((state) => ({
      expenses: [expense, ...state.expenses],
    }));
  },
  removeExpense: (expenseId: string) => {
    set((state) => ({
      expenses: state.expenses.filter((item: Expense) => item.id !== expenseId),
    }));
  },
  clearTripExpenses: (tripId: TripId) => {
    if (get().activeTripId !== tripId) {
      return;
    }

    set({
      expenses: [],
      activeTripId: null,
    });
  },
}));

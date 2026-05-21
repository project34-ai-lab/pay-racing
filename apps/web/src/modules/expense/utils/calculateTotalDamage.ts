import type { Expense } from "@/modules/expense/types/expense.types";

export function calculateTotalDamage(expenses: Expense[]): number {
  return expenses.reduce((total: number, expense: Expense) => total + expense.amount, 0);
}

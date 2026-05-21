import type { MemberToken } from "@/modules/member/types/member.types";
import type { TripId } from "@/modules/trip/types/trip.types";

export type ExpenseCategory =
  | "fuel_burn"
  | "food_rampage"
  | "safe_house"
  | "chaos_activities"
  | "coffee_snacks"
  | "entry_tickets"
  | "ride_hailing"
  | "equipment_rental";

export type Expense = {
  id: string;
  tripId: TripId;
  amount: number;
  category?: ExpenseCategory;
  customLabel?: string;
  payerToken: MemberToken;
  payerNickname: string;
  createdAtIso: string;
  note?: string;
};

export type AddExpenseInput = {
  tripId: TripId;
  amount: number;
  category?: ExpenseCategory;
  customLabel?: string;
  payerToken: MemberToken;
  payerNickname: string;
};

export type AddExpenseDraftInput = {
  amount: number;
  category?: ExpenseCategory;
  customLabel?: string;
};

export type ExpenseValidationResult =
  | {
      ok: true;
      value: AddExpenseInput;
    }
  | {
      ok: false;
      message: string;
    };

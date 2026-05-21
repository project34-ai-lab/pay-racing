import { z } from "zod";

import type {
  AddExpenseInput,
  Expense,
  ExpenseCategory,
  ExpenseValidationResult,
} from "@/modules/expense/types/expense.types";

const amountSchema = z
  .number()
  .positive("ยอดต้องมากกว่า 0")
  .max(500000, "ยอดแรงเกินไปสำหรับ MVP");

const addExpenseInputSchema = z.object({
  tripId: z.string().min(1),
  amount: amountSchema,
  category: z
    .enum([
      "fuel_burn",
      "food_rampage",
      "safe_house",
      "chaos_activities",
      "coffee_snacks",
      "entry_tickets",
      "ride_hailing",
      "equipment_rental",
    ])
    .optional(),
  customLabel: z.string().trim().max(80, "รายละเอียดสั้นเกิน/ยาวเกินไป").optional(),
  payerToken: z.string().min(1),
  payerNickname: z.string().min(1),
}).superRefine((value, ctx) => {
  const hasCategory = typeof value.category === "string";
  const hasCustomLabel = typeof value.customLabel === "string" && value.customLabel.trim().length > 0;
  if (!hasCategory && !hasCustomLabel) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "เลือกหมวดหรือกรอกรายการอย่างน้อย 1 อย่าง",
      path: ["category"],
    });
  }
});

function buildCategoryNote(category: ExpenseCategory | undefined): string {
  if (!category) {
    return "";
  }
  if (category === "fuel_burn") {
    return "ค่าน้ำมันหรือค่าเดินทางของรอบนี้";
  }

  if (category === "food_rampage") {
    return "ค่าอาหารหรือเครื่องดื่มของกลุ่ม";
  }

  if (category === "safe_house") {
    return "ค่าที่พักของอีเวนต์นี้";
  }

  if (category === "coffee_snacks") {
    return "ค่ากาแฟหรือของว่างของกลุ่ม";
  }

  if (category === "entry_tickets") {
    return "ค่าเข้าอีเวนต์หรือค่าบัตรกิจกรรม";
  }

  if (category === "ride_hailing") {
    return "ค่าเดินทางในเมือง เช่น แท็กซี่หรือเรียกรถ";
  }

  if (category === "equipment_rental") {
    return "ค่าอุปกรณ์หรือค่าเช่าที่ใช้ร่วมกัน";
  }

  return "ค่าใช้จ่ายจิปาถะของอีเวนต์";
}

export function validateExpenseInput(input: AddExpenseInput): ExpenseValidationResult {
  const parsed = addExpenseInputSchema.safeParse(input);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "ข้อมูลค่าเสียหายยังไม่ครบ";

    return {
      ok: false,
      message,
    };
  }

  return {
    ok: true,
    value: parsed.data,
  };
}

export function createExpense(input: AddExpenseInput): Expense {
  const normalizedCustomLabel = input.customLabel?.trim();
  return {
    id:
      typeof window !== "undefined" && typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `exp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    tripId: input.tripId,
    amount: input.amount,
    category: input.category,
    customLabel: normalizedCustomLabel && normalizedCustomLabel.length > 0 ? normalizedCustomLabel : undefined,
    payerToken: input.payerToken,
    payerNickname: input.payerNickname,
    createdAtIso: new Date().toISOString(),
    note:
      normalizedCustomLabel && normalizedCustomLabel.length > 0
        ? normalizedCustomLabel
        : buildCategoryNote(input.category),
  };
}

import type { ReactElement } from "react";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { AmountInput } from "@/modules/expense/components/AmountInput";
import {
  ExpenseCategoryPicker,
  type ExpenseCategoryOption,
} from "@/modules/expense/components/ExpenseCategoryPicker";
import { ExpenseSubmitButton } from "@/modules/expense/components/ExpenseSubmitButton";
import type { AddExpenseDraftInput, ExpenseCategory } from "@/modules/expense/types/expense.types";

type AddExpenseFormValues = {
  amount: string;
  category?: ExpenseCategory;
  customLabel: string;
};

type AddExpenseModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmitExpense: (input: AddExpenseDraftInput) => Promise<{ ok: true } | { ok: false; message: string }>;
};

const categoryOptions: ExpenseCategoryOption[] = [
  { value: "fuel_burn", label: "⛽ ค่าน้ำมัน / ค่าเดินทาง" },
  { value: "food_rampage", label: "🍽️ ค่าอาหาร / เครื่องดื่ม" },
  { value: "safe_house", label: "🏨 ค่าที่พัก" },
  { value: "coffee_snacks", label: "☕ กาแฟ / ของว่าง" },
  { value: "entry_tickets", label: "🎟️ ค่าเข้า / ค่าบัตร" },
  { value: "ride_hailing", label: "🚕 ค่าเดินทางในเมือง" },
  { value: "equipment_rental", label: "🧰 ค่าอุปกรณ์ / ค่าเช่า" },
  { value: "chaos_activities", label: "🧾 ค่าใช้จ่ายจิปาถะ" },
];

export function AddExpenseModal({ open, onClose, onSubmitExpense }: AddExpenseModalProps): ReactElement {
  const form = useForm<AddExpenseFormValues>({
    defaultValues: {
      amount: "",
      category: undefined,
      customLabel: "",
    },
  });

  const amountValue = form.watch("amount");
  const amountPreview = useMemo(() => Number(amountValue || "0"), [amountValue]);

  const handleSubmit = form.handleSubmit(async (values: AddExpenseFormValues) => {
    const parsedAmount = Number(values.amount);

    if (!parsedAmount || parsedAmount <= 0) {
      form.setError("amount", { message: "ใส่ยอดให้มากกว่า 0 ก่อน" });
      return;
    }

    const trimmedCustomLabel = values.customLabel.trim();
    if (!values.category && trimmedCustomLabel.length === 0) {
      form.setError("category", { message: "เลือกหมวดหรือกรอกรายการอย่างน้อย 1 อย่าง" });
      return;
    }

    const submitResult = await onSubmitExpense({
      amount: parsedAmount,
      category: values.category,
      customLabel: trimmedCustomLabel.length > 0 ? trimmedCustomLabel : undefined,
    });

    if (!submitResult.ok) {
      form.setError("root", { message: submitResult.message });
      return;
    }

    form.reset();
    onClose();
  });

  return (
    <Modal open={open} onClose={onClose} title="เพิ่มรายการค่าใช้จ่าย">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Controller
          control={form.control}
          name="amount"
          render={({ field }) => (
            <AmountInput
              value={field.value}
              onChange={field.onChange}
              errorMessage={form.formState.errors.amount?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="category"
          render={({ field }) => (
            <ExpenseCategoryPicker
              value={field.value}
              onChange={field.onChange}
              options={categoryOptions}
              errorMessage={form.formState.errors.category?.message}
            />
          )}
        />

        <Input
          id="custom-expense-label"
          label="รายการเพิ่มเติม (ไม่บังคับ)"
          placeholder="เช่น ค่าดอกไม้, ค่าขนม, ค่าแฟ"
          value={form.watch("customLabel")}
          onChange={(event) => {
            form.setValue("customLabel", event.target.value, { shouldValidate: false, shouldDirty: true });
            if (form.formState.errors.category) {
              form.clearErrors("category");
            }
          }}
          maxLength={80}
        />

        <p className="text-xs text-muted">ยอดตอนนี้: {new Intl.NumberFormat("th-TH").format(amountPreview)} บาท</p>

        {form.formState.errors.root?.message ? (
          <p className="text-xs text-danger">สัญญาณสะดุดชั่วคราว ลองกดอีกทีได้เลย ({form.formState.errors.root.message})</p>
        ) : null}

        <ExpenseSubmitButton isSubmitting={form.formState.isSubmitting} />
      </form>
    </Modal>
  );
}

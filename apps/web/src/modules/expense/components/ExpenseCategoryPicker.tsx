import type { ReactElement } from "react";

import { cn } from "@/utils/cn";
import type { ExpenseCategory } from "@/modules/expense/types/expense.types";

export type ExpenseCategoryOption = {
  value: ExpenseCategory;
  label: string;
};

type ExpenseCategoryPickerProps = {
  value?: ExpenseCategory;
  onChange: (category: ExpenseCategory) => void;
  options: ExpenseCategoryOption[];
  errorMessage?: string;
};

export function ExpenseCategoryPicker({ value, onChange, options, errorMessage }: ExpenseCategoryPickerProps): ReactElement {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-text">เลือกหมวดค่าใช้จ่าย</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option: ExpenseCategoryOption) => {
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "min-h-16 rounded-control border px-2 py-2 text-sm font-semibold leading-snug transition duration-fast ease-race",
                isActive
                  ? "border-overtake/65 bg-overtake/20 text-overtake shadow-redGlow"
                  : "border-borderSoft bg-surfaceAlt/60 text-text",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {errorMessage ? <p className="text-xs text-danger">{errorMessage}</p> : null}
    </div>
  );
}

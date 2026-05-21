import type { ReactElement } from "react";

import { Button } from "@/components/ui/Button";

type ExpenseSubmitButtonProps = {
  isSubmitting: boolean;
};

export function ExpenseSubmitButton({ isSubmitting }: ExpenseSubmitButtonProps): ReactElement {
  return (
    <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
      {isSubmitting ? "กำลังบันทึกรายการ..." : "บันทึกรายการเลย 🚗✨"}
    </Button>
  );
}

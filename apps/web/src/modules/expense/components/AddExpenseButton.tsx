import type { ReactElement } from "react";

import { Button } from "@/components/ui/Button";

type AddExpenseButtonProps = {
  onClick: () => void;
};

export function AddExpenseButton({ onClick }: AddExpenseButtonProps): ReactElement {
  return (
    <Button onClick={onClick} size="lg" fullWidth>
      + เพิ่มค่าใช้จ่าย
    </Button>
  );
}

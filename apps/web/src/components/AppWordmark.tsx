import type { ReactElement } from "react";

import { Badge } from "@/components/ui/Badge";

export function AppWordmark(): ReactElement {
  return (
    <header className="space-y-2.5">
      <Badge tone="leader">Arcade Expense Race</Badge>
      <h1 className="font-display text-[2rem] font-bold leading-[1.05] text-text">Pay Racing</h1>
    </header>
  );
}

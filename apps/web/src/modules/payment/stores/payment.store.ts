import { create } from "zustand";

import type { PaymentStatus } from "@/modules/settlement/types/settlement.types";

type PaymentState = {
  statuses: Record<string, PaymentStatus>;
  markPaymentComplete: (paymentId: string) => void;
  setPaymentStatuses: (statuses: Record<string, PaymentStatus>) => void;
  resetPaymentStatuses: () => void;
};

export const usePaymentStore = create<PaymentState>((set, get) => ({
  statuses: {},
  markPaymentComplete: (paymentId: string) => {
    const currentStatus = get().statuses[paymentId];

    if (currentStatus === "completed") {
      return;
    }

    set((state) => ({
      statuses: {
        ...state.statuses,
        [paymentId]: "completed",
      },
    }));
  },
  setPaymentStatuses: (statuses: Record<string, PaymentStatus>) => {
    const current = get().statuses;
    const currentKeys = Object.keys(current);
    const nextKeys = Object.keys(statuses);

    if (
      currentKeys.length === nextKeys.length &&
      currentKeys.every((key) => current[key] === statuses[key])
    ) {
      return;
    }

    set({ statuses });
  },
  resetPaymentStatuses: () => {
    set({ statuses: {} });
  },
}));

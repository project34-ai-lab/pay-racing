import { useEffect } from "react";

import { subscribePaymentConfirmed } from "@/modules/payment/services/paymentRealtime.service";
import { usePaymentStore } from "@/modules/payment/stores/payment.store";
import type { TripId } from "@/modules/trip/types/trip.types";

export function usePaymentRealtime(tripId: TripId | null): void {
  const markPaymentComplete = usePaymentStore((state) => state.markPaymentComplete);

  useEffect(() => {
    if (!tripId) {
      return;
    }

    const subscription = subscribePaymentConfirmed(tripId, (event) => {
      markPaymentComplete(event.payload.paymentId);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [markPaymentComplete, tripId]);
}

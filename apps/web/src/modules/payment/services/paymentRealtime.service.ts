import { publishTripEvent, subscribeTripEvent } from "@/modules/realtime/services/realtime.service";
import type { TripId } from "@/modules/trip/types/trip.types";
import type { PaymentConfirmationEvent } from "@/modules/payment/types/payment.types";
import type { RealtimeEnvelope } from "@/modules/realtime/types/realtime.types";

export async function publishPaymentConfirmed(
  tripId: TripId,
  payload: PaymentConfirmationEvent,
): Promise<{ ok: true } | { ok: false; message: string }> {
  return publishTripEvent(tripId, "payment_confirmed", {
    paymentId: payload.paymentId,
    fromMemberToken: payload.fromMemberToken,
    toMemberToken: payload.toMemberToken,
    amount: payload.amount,
  });
}

export function subscribePaymentConfirmed(
  tripId: TripId,
  handler: (event: RealtimeEnvelope<"payment_confirmed", PaymentConfirmationEvent>) => void,
): { unsubscribe: () => void } | null {
  return subscribeTripEvent(tripId, "payment_confirmed", handler);
}

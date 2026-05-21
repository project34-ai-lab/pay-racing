import { publishTripEvent, subscribeTripEvent } from "@/modules/realtime/services/realtime.service";
import type { MemberToken } from "@/modules/member/types/member.types";
import type { TripId } from "@/modules/trip/types/trip.types";
import type { RealtimeEnvelope, TripDeletedPayload } from "@/modules/realtime/types/realtime.types";

export function buildTripDeletedEventPayload(deletedByMemberToken: MemberToken): TripDeletedPayload {
  return {
    deletedByMemberToken,
  };
}

export async function publishTripDeleted(
  tripId: TripId,
  deletedByMemberToken: MemberToken,
): Promise<{ ok: true } | { ok: false; message: string }> {
  return publishTripEvent(tripId, "trip_deleted", buildTripDeletedEventPayload(deletedByMemberToken));
}

export function subscribeTripDeleted(
  tripId: TripId,
  handler: (event: RealtimeEnvelope<"trip_deleted", TripDeletedPayload>) => void,
): { unsubscribe: () => void } | null {
  return subscribeTripEvent(tripId, "trip_deleted", handler);
}

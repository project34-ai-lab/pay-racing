import { publishTripEvent, subscribeTripEvent } from "@/modules/realtime/services/realtime.service";
import type { Member } from "@/modules/member/types/member.types";
import type { MemberJoinedEvent } from "@/modules/realtime/types/realtime.types";
import type { TripId } from "@/modules/trip/types/trip.types";

type MemberJoinedSource = "join" | "presence";

export async function publishMemberJoined(
  tripId: TripId,
  member: Member,
  source: MemberJoinedSource = "join",
): Promise<{ ok: true } | { ok: false; message: string }> {
  return publishTripEvent(tripId, "member_joined", {
    memberToken: member.token,
    nickname: member.nickname,
    promptPay: member.promptPay,
    role: member.role,
    source,
  });
}

export function subscribeMemberJoined(
  tripId: TripId,
  handler: (event: MemberJoinedEvent) => void,
): { unsubscribe: () => void } | null {
  return subscribeTripEvent(tripId, "member_joined", handler);
}

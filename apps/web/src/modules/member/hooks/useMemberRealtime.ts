import { useEffect } from "react";

import { publishMemberJoined, subscribeMemberJoined } from "@/modules/member/services/memberRealtime.service";
import { useMemberStore } from "@/modules/member/stores/member.store";
import type { Member } from "@/modules/member/types/member.types";
import type { TripId } from "@/modules/trip/types/trip.types";

const presenceReplyKeys = new Set<string>();

export function useMemberRealtime(tripId: TripId | null, currentMember: Member | null): void {
  const upsertMember = useMemberStore((state) => state.upsertMember);

  useEffect(() => {
    if (!tripId) {
      return;
    }

    const subscription = subscribeMemberJoined(tripId, (event) => {
      upsertMember({
        token: event.payload.memberToken,
        nickname: event.payload.nickname,
        promptPay: event.payload.promptPay,
        role: event.payload.role,
      });

      if (!currentMember || event.payload.memberToken === currentMember.token) {
        return;
      }
      if (event.payload.source !== "join") {
        return;
      }

      const replyKey = `${tripId}:${currentMember.token}:${event.eventId}`;
      if (presenceReplyKeys.has(replyKey)) {
        return;
      }

      presenceReplyKeys.add(replyKey);
      void publishMemberJoined(tripId, currentMember, "presence");
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [currentMember, tripId, upsertMember]);
}

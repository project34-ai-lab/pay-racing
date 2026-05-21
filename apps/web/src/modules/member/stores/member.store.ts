import { create } from "zustand";

import type { Member } from "@/modules/member/types/member.types";
import type { TripId } from "@/modules/trip/types/trip.types";

type MemberState = {
  activeTripId: TripId | null;
  members: Member[];
  seedMembers: (tripId: TripId, members: Member[]) => void;
  upsertMember: (member: Member) => void;
  clearTripMembers: (tripId: TripId) => void;
};

export const useMemberStore = create<MemberState>((set, get) => ({
  activeTripId: null,
  members: [],
  seedMembers: (tripId: TripId, members: Member[]) => {
    if (get().activeTripId === tripId) {
      return;
    }

    set({
      activeTripId: tripId,
      members,
    });
  },
  upsertMember: (member: Member) => {
    const current = get().members;
    const index = current.findIndex((item: Member) => item.token === member.token);

    if (index < 0) {
      set({ members: [member, ...current] });
      return;
    }

    const next = [...current];
    const previous = next[index];
    const merged: Member = {
      ...previous,
      ...member,
      role: member.role ?? previous.role,
    };

    if (
      previous.nickname === merged.nickname &&
      previous.promptPay === merged.promptPay &&
      previous.role === merged.role
    ) {
      return;
    }

    next[index] = merged;
    set({ members: next });
  },
  clearTripMembers: (tripId: TripId) => {
    if (get().activeTripId !== tripId) {
      return;
    }

    set({
      activeTripId: null,
      members: [],
    });
  },
}));

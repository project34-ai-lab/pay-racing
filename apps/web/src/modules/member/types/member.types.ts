import type { TripId } from "@/modules/trip/types/trip.types";

export type MemberToken = string;
export type MemberRole = "creator" | "member";

export type Member = {
  token: MemberToken;
  nickname: string;
  promptPay?: string;
  role?: MemberRole;
};

export type JoinTripInput = {
  tripId: TripId;
  nickname: string;
  promptPay?: string;
};

export type LocalIdentity = {
  member: Member;
  lastActiveTripId: TripId;
};

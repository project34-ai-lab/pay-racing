import type { MemberToken } from "@/modules/member/types/member.types";

export type LeaderboardEntry = {
  rank: number;
  memberToken: MemberToken;
  nickname: string;
  totalPaid: number;
  paidStages: number;
  isCreator: boolean;
};

export type OvertakeResult = {
  hasOvertake: boolean;
  memberToken?: MemberToken;
  nickname?: string;
  previousRank?: number;
  nextRank?: number;
  message?: string;
};

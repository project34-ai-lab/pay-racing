import type { MemberToken } from "@/modules/member/types/member.types";
import type { LeaderboardEntry, OvertakeResult } from "@/modules/leaderboard/types/leaderboard.types";

export function detectOvertake(
  previousEntries: LeaderboardEntry[],
  nextEntries: LeaderboardEntry[],
  memberToken: MemberToken,
): OvertakeResult {
  const previous = previousEntries.find((entry: LeaderboardEntry) => entry.memberToken === memberToken);
  const next = nextEntries.find((entry: LeaderboardEntry) => entry.memberToken === memberToken);

  if (!previous || !next) {
    return { hasOvertake: false };
  }

  if (next.rank >= previous.rank) {
    return { hasOvertake: false };
  }

  return {
    hasOvertake: true,
    memberToken,
    nickname: next.nickname,
    previousRank: previous.rank,
    nextRank: next.rank,
    message: `${next.nickname} แซงขึ้นอันดับ ${next.rank} แล้ว!`,
  };
}

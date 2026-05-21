import type { ReactElement } from "react";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { formatMoney } from "@/utils/formatMoney";
import type { LeaderboardEntry } from "@/modules/leaderboard/types/leaderboard.types";

type LeaderboardItemProps = {
  entry: LeaderboardEntry;
  highlight?: boolean;
};

const rankToneMap: Record<number, string> = {
  1: "border-podium/45 bg-podium/15",
  2: "border-nitro/35 bg-nitro/10",
  3: "border-overtake/35 bg-overtake/10",
};
const topSpenderBadgeByRank: Record<number, { label: string; className: string; trophyClassName: string }> = {
  1: {
    label: "Gold Cup",
    className: "border-podium/50 bg-podium/18 text-podium",
    trophyClassName: "text-podium",
  },
  2: {
    label: "Silver Cup",
    className: "border-slate-300/45 bg-slate-300/10 text-slate-200",
    trophyClassName: "text-slate-200",
  },
  3: {
    label: "Bronze Cup",
    className: "border-overtake/45 bg-overtake/16 text-overtake",
    trophyClassName: "text-overtake",
  },
};

function TrophyIcon({ className }: { className: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("h-3.5 w-3.5", className)} fill="currentColor">
      <path d="M7 3a1 1 0 0 0-1 1v1H4a1 1 0 0 0-1 1v1a5 5 0 0 0 5 5h.1A5.99 5.99 0 0 0 11 14.9V17H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-2.1A5.99 5.99 0 0 0 15.9 12H16a5 5 0 0 0 5-5V6a1 1 0 0 0-1-1h-2V4a1 1 0 0 0-1-1H7Zm1 2h8v2a4 4 0 1 1-8 0V5Zm-3 2h1.1c.14 1.12.58 2.15 1.27 3H8a3 3 0 0 1-3-3Zm13 0h1v0a3 3 0 0 1-3 3h.63c.69-.85 1.13-1.88 1.27-3Z" />
    </svg>
  );
}

export function LeaderboardItem({ entry, highlight = false }: LeaderboardItemProps): ReactElement {
  const shouldShowTopSpenderBadge = entry.totalPaid > 0 && Boolean(topSpenderBadgeByRank[entry.rank]);

  return (
    <article
      className={cn(
        `rounded-control border px-3 py-3 ${rankToneMap[entry.rank] ?? "border-borderSoft bg-surfaceAlt/65"}`,
        highlight && "shadow-redGlow ring-1 ring-overtake/40",
      )}
      aria-label={`อันดับ ${entry.rank} ${entry.nickname}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-text">P{entry.rank}</span>
          <div>
            <p className="text-sm font-semibold text-text">{entry.nickname}</p>
            <p className="text-xs text-muted">จ่ายไปแล้ว {entry.paidStages} ด่าน</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex flex-col items-end gap-1">
            {entry.isCreator ? <Badge tone="leader">🏁 ผู้สร้างอีเวนต์</Badge> : <Badge tone="neutral">🤝 สมาชิก</Badge>}
            {shouldShowTopSpenderBadge ? (
              <Badge tone="neutral" className={topSpenderBadgeByRank[entry.rank].className}>
                <span className="inline-flex items-center gap-1">
                  <TrophyIcon className={topSpenderBadgeByRank[entry.rank].trophyClassName} />
                  <span>{topSpenderBadgeByRank[entry.rank].label}</span>
                </span>
              </Badge>
            ) : null}
          </div>
          <p className="font-display text-lg font-bold text-text">{formatMoney(entry.totalPaid)}</p>
        </div>
      </div>
    </article>
  );
}

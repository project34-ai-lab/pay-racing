import type { ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Card } from "@/components/ui/Card";
import { listItemVariants, listMotionTransition } from "@/lib/motion";
import type { LeaderboardEntry } from "@/modules/leaderboard/types/leaderboard.types";
import { LeaderboardItem } from "@/modules/leaderboard/components/LeaderboardItem";

type LeaderboardProps = {
  entries: LeaderboardEntry[];
  highlightMemberToken?: string;
};

export function Leaderboard({ entries, highlightMemberToken }: LeaderboardProps): ReactElement {
  if (entries.length === 0) {
    return (
      <Card className="space-y-2">
        <h2 className="font-display text-lg font-semibold text-text">ใครเปย์หนักสุดตอนนี้?</h2>
        <p className="text-sm text-muted">ยังไม่มีใครขึ้นอันดับเลย ลองเพิ่มรายการแรกดู 🐢</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-3">
      <div className="space-y-1">
        <h2 className="font-display text-lg font-semibold text-text">ใครเปย์หนักสุดตอนนี้?</h2>
        <p className="text-xs text-muted">มีป้าย Top Spender สำหรับอันดับ 1-3 แบบขึ้นโพเดียม 🏆</p>
      </div>

      <motion.ul layout className="space-y-2">
        <AnimatePresence initial={false}>
          {entries.map((entry: LeaderboardEntry) => (
            <motion.li
              key={entry.memberToken}
              layout
              variants={listItemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={listMotionTransition}
            >
              <LeaderboardItem entry={entry} highlight={entry.memberToken === highlightMemberToken} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </Card>
  );
}

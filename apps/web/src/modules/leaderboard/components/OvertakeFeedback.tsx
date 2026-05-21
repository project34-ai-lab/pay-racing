import type { ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { OvertakeResult } from "@/modules/leaderboard/types/leaderboard.types";

type OvertakeFeedbackProps = {
  result: OvertakeResult | null;
};

export function OvertakeFeedback({ result }: OvertakeFeedbackProps): ReactElement {
  return (
    <AnimatePresence>
      {result?.hasOvertake ? (
        <motion.div
          key={`${result.memberToken}-${result.nextRank}`}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
          className="rounded-control border border-overtake/40 bg-overtake/15 px-3 py-2 text-sm font-semibold text-overtake shadow-redGlow"
        >
          {result.message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

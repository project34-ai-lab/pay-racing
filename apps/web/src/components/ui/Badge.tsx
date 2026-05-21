import type { HTMLAttributes, ReactElement } from "react";

import { cn } from "@/utils/cn";

type BadgeTone = "neutral" | "leader" | "live";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const toneClassMap: Record<BadgeTone, string> = {
  neutral: "border-borderSoft bg-surfaceAlt/70 text-muted",
  leader: "border-podium/45 bg-podium/20 text-podium",
  live: "border-win/45 bg-win/15 text-win",
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps): ReactElement {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-chip border px-3 text-xs font-semibold uppercase tracking-[0.08em]",
        toneClassMap[tone],
        className,
      )}
      {...props}
    />
  );
}

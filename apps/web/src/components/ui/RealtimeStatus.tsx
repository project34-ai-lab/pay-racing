import type { ReactElement } from "react";

import { cn } from "@/utils/cn";

type RealtimeStatusState = "connected" | "reconnecting" | "offline";

type RealtimeStatusProps = {
  status: RealtimeStatusState;
  copy?: string;
  className?: string;
};

const labelMap: Record<RealtimeStatusState, string> = {
  connected: "🟢 อยู่ในอีเวนต์เดียวกัน",
  reconnecting: "🟡 กำลังต่อสัญญาณใหม่",
  offline: "🔴 หลุดจากอีเวนต์ชั่วคราว",
};

const toneMap: Record<RealtimeStatusState, string> = {
  connected: "bg-win",
  reconnecting: "bg-overtake",
  offline: "bg-danger",
};

export function RealtimeStatus({ status, copy, className }: RealtimeStatusProps): ReactElement {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-chip border border-borderSoft bg-surfaceAlt/70 px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.04em] text-muted",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span className={cn("h-2.5 w-2.5 rounded-full", toneMap[status])} />
      <span>{copy ?? labelMap[status]}</span>
    </div>
  );
}

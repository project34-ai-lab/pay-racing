import { create } from "zustand";

import type { RealtimeConnectionStatus } from "@/modules/realtime/types/realtime.types";

type RealtimeState = {
  status: RealtimeConnectionStatus;
  statusCopy: string;
  developerNote?: string;
  setStatus: (status: RealtimeConnectionStatus, developerNote?: string) => void;
};

function toStatusCopy(status: RealtimeConnectionStatus): string {
  if (status === "connected") {
    return "🟢 อยู่ในอีเวนต์เดียวกัน";
  }

  if (status === "reconnecting") {
    return "🟡 กำลังต่อสัญญาณใหม่";
  }

  return "🔴 หลุดจากอีเวนต์ชั่วคราว";
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  status: "offline",
  statusCopy: "กำลังจูนเครื่องยนต์ realtime...",
  developerNote: undefined,
  setStatus: (status: RealtimeConnectionStatus, developerNote?: string) => {
    set({
      status,
      statusCopy: toStatusCopy(status),
      developerNote,
    });
  },
}));

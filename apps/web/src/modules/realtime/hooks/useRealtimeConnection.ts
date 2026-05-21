import { useEffect } from "react";

import { initRealtimeLifecycle } from "@/modules/realtime/services/realtime.service";
import { useRealtimeStore } from "@/modules/realtime/stores/realtime.store";

type UseRealtimeConnectionResult = {
  status: "connected" | "reconnecting" | "offline";
  statusCopy: string;
  developerNote?: string;
};

export function useRealtimeConnection(): UseRealtimeConnectionResult {
  const { status, statusCopy, developerNote, setStatus } = useRealtimeStore();

  useEffect(() => {
    const cleanup = initRealtimeLifecycle({
      onStatusChange: (nextStatus, note) => {
        setStatus(nextStatus, note);
      },
    });

    return cleanup;
  }, [setStatus]);

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    const detail = developerNote ? ` (${developerNote})` : "";
    console.info("[PRC][Realtime]", `UI status => ${status}${detail}`);
  }, [developerNote, status]);

  return {
    status,
    statusCopy,
    developerNote,
  };
}

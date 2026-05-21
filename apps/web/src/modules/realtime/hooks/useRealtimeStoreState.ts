import { useRealtimeStore } from "@/modules/realtime/stores/realtime.store";

export function useRealtimeStoreState(): {
  status: "connected" | "reconnecting" | "offline";
  statusCopy: string;
  developerNote?: string;
} {
  const { status, statusCopy, developerNote } = useRealtimeStore();

  return {
    status,
    statusCopy,
    developerNote,
  };
}

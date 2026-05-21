import type { PropsWithChildren, ReactElement } from "react";

import { useRealtimeConnection } from "@/modules/realtime/hooks/useRealtimeConnection";

export function AppProviders({ children }: PropsWithChildren): ReactElement {
  useRealtimeConnection();

  return <>{children}</>;
}

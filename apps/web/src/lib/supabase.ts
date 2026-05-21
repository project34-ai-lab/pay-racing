import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import { readSupabaseEnv } from "@/lib/env";

type SupabaseClientResult =
  | {
      ok: true;
      client: SupabaseClient;
    }
  | {
      ok: false;
      message: string;
    };

let cachedClient: SupabaseClient | null = null;
let hasLoggedCachedClient = false;

function logSupabaseDebug(level: "info" | "warn", message: string, context?: string): void {
  if (!import.meta.env.DEV) {
    return;
  }

  const prefix = "[PRC][Supabase]";
  if (level === "warn") {
    console.warn(prefix, message, context ?? "");
    return;
  }

  console.info(prefix, message, context ?? "");
}

export function getSupabaseClient(): SupabaseClientResult {
  if (cachedClient) {
    if (!hasLoggedCachedClient) {
      logSupabaseDebug("info", "Using cached Supabase client");
      hasLoggedCachedClient = true;
    }
    return {
      ok: true,
      client: cachedClient,
    };
  }

  const envResult = readSupabaseEnv();

  if (!envResult.ok) {
    logSupabaseDebug("warn", "Supabase env missing", envResult.message);
    return {
      ok: false,
      message: envResult.message,
    };
  }

  cachedClient = createClient(envResult.value.url, envResult.value.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
  const host = new URL(envResult.value.url).host;
  logSupabaseDebug("info", "Supabase client created", `project host: ${host}`);
  hasLoggedCachedClient = false;

  return {
    ok: true,
    client: cachedClient,
  };
}

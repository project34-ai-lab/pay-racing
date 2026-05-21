export type SupabaseEnv = {
  url: string;
  anonKey: string;
};

export type EnvResult =
  | {
      ok: true;
      value: SupabaseEnv;
    }
  | {
      ok: false;
      message: string;
      missing: Array<"VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY">;
    };

export function readSupabaseEnv(): EnvResult {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const missing: Array<"VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY"> = [];

  if (!url || typeof url !== "string") {
    missing.push("VITE_SUPABASE_URL");
  }

  if (!anonKey || typeof anonKey !== "string") {
    missing.push("VITE_SUPABASE_ANON_KEY");
  }

  if (missing.length > 0) {
    return {
      ok: false,
      message: `Realtime ยังไม่เปิด เพราะ env หาย: ${missing.join(", ")}`,
      missing,
    };
  }

  return {
    ok: true,
    value: {
      url: url as string,
      anonKey: anonKey as string,
    },
  };
}

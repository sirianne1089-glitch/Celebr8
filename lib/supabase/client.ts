"use client";

import { createBrowserClient } from "@supabase/ssr";

// Untyped client: validation is enforced via Zod schemas in lib/validators.ts.
// Strong DB typing can be re-introduced via `npm run db:types` post-launch.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

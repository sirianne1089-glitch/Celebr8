import { createClient } from "@supabase/supabase-js";

/**
 * Admin (service-role) Supabase client.
 * SERVER-ONLY. Never import from client components.
 * Use for: Stripe webhooks, RSVP submission (anon → write), audit logs.
 *
 * The client is intentionally untyped — Zod validates inputs at the API
 * boundary. Re-add Database typing via `npm run db:types` post-launch.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase service role credentials are not configured");
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

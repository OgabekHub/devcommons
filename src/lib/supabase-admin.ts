import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isAdminConfigured = Boolean(
  supabaseUrl &&
    serviceRoleKey &&
    serviceRoleKey !== "your_supabase_service_role_key"
);

/**
 * Service-role Supabase client — SERVER ONLY.
 *
 * Bypasses RLS, so it must NEVER be imported into a Client Component or
 * exposed to the browser. Used for privileged, trusted server-side work such
 * as atomic counter increments (view/used/fork counts, votes) and API-key
 * lookups, where the counter RPCs are REVOKE'd from `anon`/`authenticated`
 * and granted only to `service_role` (see migration_v17_security_fixes.sql).
 *
 * Returns null when the service-role key is not configured, so callers can
 * degrade gracefully instead of crashing.
 */
export function createSupabaseAdmin(): SupabaseClient | null {
  if (!isAdminConfigured) return null;
  return createClient(supabaseUrl, serviceRoleKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "your_supabase_project_url" &&
    supabaseAnonKey !== "your_supabase_anon_key"
);

// Fallback placeholder values so createBrowserClient never throws when the
// project's Supabase env vars are missing. The returned client is inert
// (network calls fail gracefully) but the app still renders.
const FALLBACK_SUPABASE_URL = "https://placeholder.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY = "public-anon-placeholder-key";

// Browser (Client Component) uchun — cookies import yo'q
export function createSupabaseBrowser() {
  if (!isSupabaseConfigured) {
    console.warn('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
  }
  return createBrowserClient(
    supabaseUrl || FALLBACK_SUPABASE_URL,
    supabaseAnonKey || FALLBACK_SUPABASE_ANON_KEY
  );
}

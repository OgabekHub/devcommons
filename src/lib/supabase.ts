import { createClient } from "@supabase/supabase-js";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || url === "your_supabase_project_url") {
    console.warn(
      "⚠️ NEXT_PUBLIC_SUPABASE_URL sozlanmagan. .env.local fayliga Supabase URL kiriting."
    );
    return { url: "", key: "" };
  }

  if (!key || key === "your_supabase_anon_key") {
    console.warn(
      "⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY sozlanmagan. .env.local fayliga Supabase Anon Key kiriting."
    );
    return { url: "", key: "" };
  }

  return { url, key };
}

const { url, key } = getSupabaseConfig();

// Supabase mavjudligini tekshirish uchun flag
export const isSupabaseConfigured = Boolean(url && key);

// Server komponentlar va API route'lar uchun
export function supabaseServer() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase sozlanmagan. .env.local fayliga NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY kiriting."
    );
  }
  return createClient(url, key);
}

// Client komponentlar uchun (browser) — faqat config mavjud bo'lsa yaratadi
export const supabaseBrowser = isSupabaseConfigured
  ? createClient(url, key)
  : null;

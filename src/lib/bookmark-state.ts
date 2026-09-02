"use client";

import { createSupabaseBrowser } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

/**
 * N+1 tuzatish: sahifadagi har bir BookmarkButton/FollowButton mount'da
 * alohida auth.getUser() + select qilardi (12 karta = 24 so'rov).
 * Bu modul so'rovlarni mikro-oyna (30ms) ichida bitta .in() so'rovga jamlaydi
 * va auth foydalanuvchini keshda saqlaydi.
 */

let userPromise: Promise<User | null> | null = null;
let authListenerAttached = false;

export function getCachedUser(): Promise<User | null> {
  const supabase = createSupabaseBrowser();
  if (!authListenerAttached) {
    authListenerAttached = true;
    // Login/logout bo'lganda kesh eskirmasin
    supabase.auth.onAuthStateChange(() => {
      userPromise = null;
    });
  }
  userPromise ??= supabase.auth.getUser().then(({ data }) => data.user);
  return userPromise;
}

type ItemType = "snippet" | "prompt";

interface PendingCheck {
  type: ItemType;
  id: string;
  resolve: (bookmarked: boolean) => void;
}

const pending: PendingCheck[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

export function checkBookmarked(type: ItemType, id: string): Promise<boolean> {
  return new Promise((resolve) => {
    pending.push({ type, id, resolve });
    flushTimer ??= setTimeout(() => void flush(), 30);
  });
}

async function flush() {
  const batch = pending.splice(0, pending.length);
  flushTimer = null;
  if (!batch.length) return;

  try {
    const user = await getCachedUser();
    if (!user) {
      batch.forEach((b) => b.resolve(false));
      return;
    }

    const supabase = createSupabaseBrowser();
    const snippetIds = [...new Set(batch.filter((b) => b.type === "snippet").map((b) => b.id))];
    const promptIds = [...new Set(batch.filter((b) => b.type === "prompt").map((b) => b.id))];

    const [sRes, pRes] = await Promise.all([
      snippetIds.length
        ? supabase.from("bookmarks").select("snippet_id").eq("user_id", user.id).in("snippet_id", snippetIds)
        : Promise.resolve({ data: [] as { snippet_id: string }[] }),
      promptIds.length
        ? supabase.from("bookmarks").select("prompt_id").eq("user_id", user.id).in("prompt_id", promptIds)
        : Promise.resolve({ data: [] as { prompt_id: string }[] }),
    ]);

    const snippetSet = new Set((sRes.data ?? []).map((r: any) => r.snippet_id));
    const promptSet = new Set((pRes.data ?? []).map((r: any) => r.prompt_id));

    batch.forEach((b) =>
      b.resolve(b.type === "snippet" ? snippetSet.has(b.id) : promptSet.has(b.id))
    );
  } catch {
    batch.forEach((b) => b.resolve(false));
  }
}

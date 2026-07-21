"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Props {
  snippetId?: string;
  promptId?: string;
  compact?: boolean; // kartochkalar uchun kichik ko'rinish
}

export default function BookmarkButton({ snippetId, promptId, compact = false }: Props) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const t = useTranslations("Components");
  const locale = useLocale();
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data.user;
      setUser(currentUser);

      if (currentUser) {
        // Haqiqiy bookmark holatini tekshirish
        const query = snippetId
          ? supabase.from("bookmarks").select("id").eq("user_id", currentUser.id).eq("snippet_id", snippetId).maybeSingle()
          : supabase.from("bookmarks").select("id").eq("user_id", currentUser.id).eq("prompt_id", promptId!).maybeSingle();

        const { data: bookmark } = await query;
        if (bookmark) setBookmarked(true);
      }
      setChecking(false);
    };
    init();
  }, [snippetId, promptId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Login sahifasiga yo'naltirish
      window.location.href = `/${locale}/auth`;
      return;
    }

    setLoading(true);

    try {
      if (bookmarked) {
        // Remove bookmark
        const query = snippetId
          ? supabase.from("bookmarks").delete().eq("snippet_id", snippetId).eq("user_id", user.id)
          : supabase.from("bookmarks").delete().eq("prompt_id", promptId!).eq("user_id", user.id);
        
        const { error } = await query;
        if (error) throw error;
        setBookmarked(false);
      } else {
        // Add bookmark
        const { error } = await supabase.from("bookmarks").insert({
          user_id: user.id,
          snippet_id: snippetId || null,
          prompt_id: promptId || null,
        });
        if (error) throw error;
        setBookmarked(true);
      }
    } catch (err) {
      console.error("Bookmark error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return compact ? null : (
      <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600">
        <Bookmark className="h-4 w-4 animate-pulse" />
      </span>
    );
  }

  // Compact mode — kartochkalar uchun kichik tugma
  if (compact) {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-all duration-200 ${
          bookmarked
            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
            : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-amber-400 hover:border-amber-500/30"
        } disabled:opacity-50`}
        title={bookmarked ? t("saved") : t("save")}
      >
        {bookmarked ? (
          <BookmarkCheck className={`h-3.5 w-3.5 ${loading ? "animate-pulse" : ""}`} />
        ) : (
          <Bookmark className={`h-3.5 w-3.5 ${loading ? "animate-pulse" : ""}`} />
        )}
      </button>
    );
  }

  // Full mode — detail sahifalar uchun
  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
        bookmarked
          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
          : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-amber-400 hover:border-amber-500/30"
      } disabled:opacity-50`}
    >
      {bookmarked ? (
        <BookmarkCheck className={`h-4 w-4 ${loading ? "animate-pulse" : ""}`} />
      ) : (
        <Bookmark className={`h-4 w-4 ${loading ? "animate-pulse" : ""}`} />
      )}
      {bookmarked ? t("saved") : t("save")}
    </button>
  );
}

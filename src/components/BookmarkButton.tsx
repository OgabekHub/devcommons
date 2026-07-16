"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useTranslations } from "next-intl";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Props {
  snippetId?: string;
  promptId?: string;
  initialBookmarked?: boolean;
}

export default function BookmarkButton({ snippetId, promptId, initialBookmarked = false }: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const t = useTranslations("Components");
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleToggle = async () => {
    if (!user) return;
    setLoading(true);

    try {
      if (bookmarked) {
        // Remove bookmark
        const query = snippetId
          ? supabase.from("bookmarks").delete().eq("snippet_id", snippetId).eq("user_id", user.id)
          : supabase.from("bookmarks").delete().eq("prompt_id", promptId).eq("user_id", user.id);
        
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

  if (!user) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
        bookmarked
          ? "bg-brand-50 text-brand hover:bg-brand-100"
          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
      } disabled:opacity-50`}
    >
      {bookmarked ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {bookmarked ? t("saved") : t("save")}
    </button>
  );
}

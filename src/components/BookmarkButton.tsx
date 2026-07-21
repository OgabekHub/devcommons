"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck, FolderPlus } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import AddToCollectionModal from "./AddToCollectionModal";

interface Props {
  snippetId?: string;
  promptId?: string;
  compact?: boolean; // kartochkalar uchun kichik ko'rinish
}

export default function BookmarkButton({ snippetId, promptId, compact = false }: Props) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
      window.location.href = `/${locale}/auth`;
      return;
    }

    setLoading(true);

    try {
      if (bookmarked) {
        const query = snippetId
          ? supabase.from("bookmarks").delete().eq("snippet_id", snippetId).eq("user_id", user.id)
          : supabase.from("bookmarks").delete().eq("prompt_id", promptId!).eq("user_id", user.id);
        
        const { error } = await query;
        if (error) throw error;
        setBookmarked(false);
      } else {
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

  const openCollectionModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = `/${locale}/auth`;
      return;
    }
    setShowModal(true);
  };

  if (checking) {
    return compact ? null : (
      <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600">
        <Bookmark className="h-4 w-4 animate-pulse" />
      </span>
    );
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`flex items-center justify-center rounded-lg transition-all duration-200 ${
            compact ? "h-7 px-2 text-xs gap-1" : "px-3 py-1.5 text-sm gap-1.5"
          } font-medium ${
            bookmarked
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
              : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-amber-400 hover:border-amber-500/30"
          } disabled:opacity-50`}
          title={bookmarked ? t("saved") : t("save")}
        >
          {bookmarked ? (
            <BookmarkCheck className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"} ${loading ? "animate-pulse" : ""}`} />
          ) : (
            <Bookmark className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"} ${loading ? "animate-pulse" : ""}`} />
          )}
          {!compact && (bookmarked ? t("saved") : t("save"))}
        </button>

        <button
          onClick={openCollectionModal}
          className={`flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition-all duration-200 hover:border-brand/30 hover:bg-white/10 hover:text-brand ${
            compact ? "h-7 w-7" : "h-[34px] w-[34px]"
          }`}
          title={t("save_to_collection_btn")}
        >
          <FolderPlus className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        </button>
      </div>

      {showModal && (
        <AddToCollectionModal
          itemId={snippetId || promptId || ""}
          itemType={snippetId ? "snippet" : "prompt"}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

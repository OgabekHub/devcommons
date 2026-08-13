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

        const { data: bookmark, error: bookmarkError } = await query;
        if (bookmarkError) console.error('Bookmark check failed:', bookmarkError);
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
          title={bookmarked ? t("saved") : t("save")}
          className={`icon-btn font-medium ${
            compact ? "h-7 px-2 gap-1 text-xs" : "px-3 py-1.5 gap-1.5 text-sm"
          } ${bookmarked ? "icon-btn--active-amber" : "icon-btn--amber"}`}
        >
          {bookmarked ? (
            <BookmarkCheck className={`shrink-0 ${compact ? "h-3.5 w-3.5" : "h-4 w-4"} ${loading ? "animate-pulse" : ""}`} />
          ) : (
            <Bookmark className={`shrink-0 ${compact ? "h-3.5 w-3.5" : "h-4 w-4"} ${loading ? "animate-pulse" : ""}`} />
          )}
          {!compact && <span>{bookmarked ? t("saved") : t("save")}</span>}
        </button>

        <button
          onClick={openCollectionModal}
          title={t("save_to_collection_btn")}
          className={`icon-btn icon-btn--brand ${compact ? "h-7 w-7" : "h-[34px] w-[34px]"}`}
        >
          <FolderPlus className={`shrink-0 ${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
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

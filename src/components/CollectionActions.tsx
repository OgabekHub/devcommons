"use client";

import { useState } from "react";
import { Trash2, X, Loader2 } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface DeleteCollectionProps {
  collectionId: string;
  locale: string;
}

export function DeleteCollectionButton({ collectionId, locale }: DeleteCollectionProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseBrowser();
  const router = useRouter();
  const t = useTranslations("Collections");

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.confirm(t("confirm_delete"))) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", collectionId);

      if (error) throw error;
      router.push(`/${locale}/profile`);
      router.refresh();
    } catch (err) {
      console.error("Error deleting collection:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:border-red-500/30 hover:bg-red-500/20"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      {t("delete_collection")}
    </button>
  );
}

interface RemoveItemProps {
  collectionItemId: string;
}

export function RemoveFromCollectionButton({ collectionItemId }: RemoveItemProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseBrowser();
  const router = useRouter();
  const t = useTranslations("Collections");

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      const { error } = await supabase
        .from("collection_items")
        .delete()
        .eq("id", collectionItemId);

      if (error) throw error;
      router.refresh();
    } catch (err) {
      console.error("Error removing item:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      title={t("remove_item")}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-ink/5 text-zinc-400 transition-all hover:border-red-500/30 hover:bg-red-500/20 hover:text-red-400"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
    </button>
  );
}

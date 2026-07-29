"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

interface Props {
  snippetId: string;
  locale: string;
}

export default function SnippetActions({ snippetId, locale }: Props) {
  const t = useTranslations("Actions");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase
      .from("snippets")
      .delete()
      .eq("id", snippetId);

    if (error) {
      console.error("Delete error:", error);
      setDeleting(false);
      alert(t("delete_error"));
      return;
    }

    router.push(`/${locale}/snippets`);
  };

  return (
    <div className="flex gap-2 ml-auto">
      <Link
        href={`/snippets/${snippetId}/edit`}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
      >
        <Edit className="h-4 w-4" />
        {t("edit")}
      </Link>

      {!showDeleteConfirm ? (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20"
        >
          <Trash2 className="h-4 w-4" />
          {t("delete")}
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white"
            disabled={deleting}
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-600 disabled:opacity-50"
          >
            {deleting ? t("deleting") : t("confirm_delete")}
          </button>
        </div>
      )}
    </div>
  );
}

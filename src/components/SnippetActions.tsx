"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase";

interface Props {
  snippetId: string;
  locale: string;
}

export default function SnippetActions({ snippetId, locale }: Props) {
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
      alert("O'chirishda xatolik yuz berdi");
      return;
    }

    router.push(`/${locale}/snippets`);
  };

  return (
    <div className="flex gap-2 ml-auto">
      <Link
        href={`/snippets/${snippetId}/edit`}
        className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-brand/30 hover:bg-brand-50"
      >
        <Edit className="h-4 w-4" />
        Tahrirlash
      </Link>

      {!showDeleteConfirm ? (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-2 rounded-xl border border-red-100 px-4 py-2 text-sm font-medium text-red-500 transition-all hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          O'chirish
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50"
            disabled={deleting}
          >
            Bekor qilish
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-600 disabled:opacity-50"
          >
            {deleting ? "O'chirilmoqda..." : "Ha, o'chirish"}
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { X, Plus, Folder, Loader2 } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useTranslations } from "next-intl";

interface Collection {
  id: string;
  title: string;
  description: string | null;
}

interface Props {
  itemId: string;
  itemType: "snippet" | "prompt";
  onClose: () => void;
}

export default function AddToCollectionModal({ itemId, itemType, onClose }: Props) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const supabase = createSupabaseBrowser();
  const t = useTranslations("Collections");

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("collections")
        .select("id, title, description")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCollections(data || []);
    } catch (err) {
      console.error(err);
      setError(t("error_loading"));
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    setCreating(true);
    setError("");
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("collections")
        .insert({
          title: newTitle.trim(),
          author_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      setCollections([data, ...collections]);
      setNewTitle("");
      
      // Yangi to'plamga darhol qo'shish
      await addToCollection(data.id);
    } catch (err: any) {
      setError(err.message || t("error_creating"));
    } finally {
      setCreating(false);
    }
  };

  const addToCollection = async (collectionId: string) => {
    setSaving(true);
    setError("");
    setSuccess("");
    
    try {
      // Avval tekshiramiz, balki oldin qo'shilgandir
      const { data: existing } = await supabase
        .from("collection_items")
        .select("id")
        .eq("collection_id", collectionId)
        .eq(itemType === "snippet" ? "snippet_id" : "prompt_id", itemId)
        .single();
        
      if (existing) {
        throw new Error(t("error_already_exists"));
      }

      const { error } = await supabase
        .from("collection_items")
        .insert({
          collection_id: collectionId,
          [itemType === "snippet" ? "snippet_id" : "prompt_id"]: itemId
        });

      if (error) throw error;
      
      setSuccess(t("success_added"));
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || t("error_saving"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0F0A1F] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 p-4">
          <h3 className="text-lg font-semibold">{t("save_to_collection")}</h3>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-500">
              {success}
            </div>
          )}

          {/* New Collection Form */}
          <form onSubmit={createCollection} className="mb-6 flex gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={t("new_collection_placeholder")}
              className="input flex-1"
              disabled={creating}
            />
            <button 
              type="submit" 
              className="btn-primary px-4"
              disabled={creating || !newTitle.trim()}
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </button>
          </form>

          {/* Collections List */}
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-brand" />
              </div>
            ) : collections.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                {t("no_collections")}
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {collections.map(collection => (
                  <button
                    key={collection.id}
                    onClick={() => addToCollection(collection.id)}
                    disabled={saving}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 text-left transition-colors hover:bg-white/10"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/20 text-brand">
                      <Folder className="h-5 w-5" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate font-medium text-white">{collection.title}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

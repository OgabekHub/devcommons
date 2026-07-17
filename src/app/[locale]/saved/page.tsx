"use client";

import { useState, useEffect } from "react";
import { Code2, Sparkles, Bookmark } from "lucide-react";
import { Link } from "@/i18n/routing";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import VoteButton from "@/components/VoteButton";

export default function SavedPage() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"snippets" | "prompts">("snippets");
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Saved");
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/${locale}/auth`);
        return;
      }

      // Load bookmarked snippets
      const { data: snippetBookmarks } = await supabase
        .from("bookmarks")
        .select("snippet_id, snippets(*)")
        .eq("user_id", user.id)
        .not("snippet_id", "is", null);

      const bookmarkedSnippets = snippetBookmarks
        ?.map((b: any) => b.snippets)
        .filter(Boolean) || [];

      // Load bookmarked prompts
      const { data: promptBookmarks } = await supabase
        .from("bookmarks")
        .select("prompt_id, prompts(*)")
        .eq("user_id", user.id)
        .not("prompt_id", "is", null);

      const bookmarkedPrompts = promptBookmarks
        ?.map((b: any) => b.prompts)
        .filter(Boolean) || [];

      setSnippets(bookmarkedSnippets);
      setPrompts(bookmarkedPrompts);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark shadow-sm">
          <Bookmark className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
          <p className="text-sm text-gray-400">{t("subtitle")}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 mb-6">
        <button
          onClick={() => setTab("snippets")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "snippets"
              ? "border-brand text-brand"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <Code2 className="h-4 w-4" />
          Snippets ({snippets.length})
        </button>
        <button
          onClick={() => setTab("prompts")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "prompts"
              ? "border-brand text-brand"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Prompts ({prompts.length})
        </button>
      </div>

      {/* Content */}
      {tab === "snippets" && (
        <div>
          {snippets.length === 0 ? (
            <div className="card border-dashed border-white/10 p-10 text-center">
              <Code2 className="mx-auto mb-3 h-8 w-8 text-gray-500" />
              <p className="text-gray-400">{t("empty")}</p>
              <Link href="/snippets" className="btn-primary mt-4 shadow-brand/20 shadow-lg">
                {t("discover")}
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {snippets.map((s) => (
                <Link
                  key={s.id}
                  href={`/snippets/${s.id}` as any}
                  className="card card-shine group block"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-semibold text-white transition-colors group-hover:text-brand">{s.title}</h3>
                    <span className="ml-2 rounded-lg bg-brand/10 border border-brand/20 px-2 py-0.5 text-xs font-semibold text-brand">{s.language}</span>
                  </div>
                  {s.description && <p className="text-sm text-gray-400 line-clamp-2">{s.description}</p>}
                  <p className="mt-2 text-xs text-gray-500">👍 {s.votes} · {new Date(s.created_at).toLocaleDateString(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US")}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "prompts" && (
        <div>
          {prompts.length === 0 ? (
            <div className="card border-dashed border-white/10 p-10 text-center">
              <Sparkles className="mx-auto mb-3 h-8 w-8 text-gray-500" />
              <p className="text-gray-400">{t("empty")}</p>
              <Link href="/prompts" className="btn-primary mt-4 shadow-brand/20 shadow-lg">
                {t("discover")}
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {prompts.map((p) => (
                <Link
                  key={p.id}
                  href={`/prompts/${p.id}` as any}
                  className="card card-shine group block"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-semibold text-white transition-colors group-hover:text-brand">{p.title}</h3>
                    <span className="ml-2 rounded-lg bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-400">{p.category}</span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">{p.content}</p>
                  <p className="mt-2 text-xs text-gray-500">👍 {p.votes} · {new Date(p.created_at).toLocaleDateString(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US")}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

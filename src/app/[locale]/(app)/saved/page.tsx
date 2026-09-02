"use client";

import { useState, useEffect } from "react";
import { Code2, Sparkles, Bookmark } from "lucide-react";
import { Link } from "@/i18n/routing";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import ListPageSkeleton from "@/components/ListPageSkeleton";

export default function SavedPage() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"snippets" | "prompts">("snippets");
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Saved");
  const supabase = createSupabaseBrowser();

  const [loadError, setLoadError] = useState(false);

  const load = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/${locale}/auth`);
        return;
      }

      // Load bookmarked snippets
      const { data: snippetBookmarks, error: sErr } = await supabase
        .from("bookmarks")
        .select("snippet_id, snippets(*)")
        .eq("user_id", user.id)
        .not("snippet_id", "is", null);
      if (sErr) throw sErr;

      const bookmarkedSnippets = snippetBookmarks
        ?.map((b: any) => b.snippets)
        .filter(Boolean) || [];

      // Load bookmarked prompts
      const { data: promptBookmarks, error: pErr } = await supabase
        .from("bookmarks")
        .select("prompt_id, prompts(*)")
        .eq("user_id", user.id)
        .not("prompt_id", "is", null);
      if (pErr) throw pErr;

      const bookmarkedPrompts = promptBookmarks
        ?.map((b: any) => b.prompts)
        .filter(Boolean) || [];

      setSnippets(bookmarkedSnippets);
      setPrompts(bookmarkedPrompts);
    } catch (err) {
      console.error("Saved load error:", err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <ListPageSkeleton cards={4} />;
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="card border-red-500/20 bg-red-500/5 p-10 text-center">
          <p className="mb-4 text-sm text-red-400">Saqlanganlarni yuklab bo&apos;lmadi.</p>
          <button onClick={load} className="btn-primary btn-primary--sm">Qayta urinish</button>
        </div>
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
          <h1 className="text-2xl font-bold text-fg">{t("title")}</h1>
          <p className="text-sm text-zinc-400">{t("subtitle")}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-line mb-6">
        <button
          onClick={() => setTab("snippets")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "snippets"
              ? "border-brand text-brand"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
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
              : "border-transparent text-zinc-400 hover:text-zinc-200"
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
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-line bg-ink/5 backdrop-blur-sm">
              <div className="h-16 w-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-4">
                <Code2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-fg mb-2">{t("empty_title") || "Hali hech narsa yo'q"}</h3>
              <p className="text-zinc-400 max-w-sm mb-6">{t("empty")}</p>
              <Link href="/snippets" className="btn-primary shadow-brand/20 shadow-lg px-6 py-2.5">
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
                    <h3 className="font-semibold text-fg transition-colors group-hover:text-brand">{s.title}</h3>
                    <span className="ml-2 rounded-lg bg-brand/10 border border-brand/20 px-2 py-0.5 text-xs font-semibold text-brand">{s.language}</span>
                  </div>
                  {s.description && <p className="text-sm text-zinc-400 line-clamp-2">{s.description}</p>}
                  <p className="mt-2 text-xs text-zinc-500">👍 {s.votes} · {new Date(s.created_at).toLocaleDateString(locale === "uz" ? "uz-UZ" : "en-US")}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "prompts" && (
        <div>
          {prompts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-line bg-ink/5 backdrop-blur-sm">
              <div className="h-16 w-16 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-fg mb-2">{t("empty_prompts_title") || "Hali hech narsa yo'q"}</h3>
              <p className="text-zinc-400 max-w-sm mb-6">{t("empty")}</p>
              <Link href="/prompts" className="btn-primary shadow-brand/20 shadow-lg px-6 py-2.5">
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
                    <h3 className="font-semibold text-fg transition-colors group-hover:text-brand">{p.title}</h3>
                    <span className="ml-2 rounded-lg bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-400">{p.category}</span>
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-2">{p.content}</p>
                  <p className="mt-2 text-xs text-zinc-500">👍 {p.votes} · {new Date(p.created_at).toLocaleDateString(locale === "uz" ? "uz-UZ" : "en-US")}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { BarChart3, Eye, Code2, Sparkles } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import ListPageSkeleton from "@/components/ListPageSkeleton";

interface AnalyticsData {
  total_snippet_views: number;
  total_prompt_views: number;
  top_snippets: { id: string; title: string; view_count: number; language: string }[];
  top_prompts: { id: string; title: string; view_count: number; category: string }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Analytics");
  const supabase = createSupabaseBrowser();

  const loadAnalytics = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/${locale}/auth`);
        return;
      }

      // Get total views
      const { data: snippets, error: e1 } = await supabase
        .from("snippets")
        .select("view_count")
        .eq("author_id", user.id);
      if (e1) throw e1;

      const { data: prompts, error: e2 } = await supabase
        .from("prompts")
        .select("view_count")
        .eq("author_id", user.id);
      if (e2) throw e2;

      // Get top snippets
      const { data: topSnippets } = await supabase
        .from("snippets")
        .select("id, title, view_count, language")
        .eq("author_id", user.id)
        .order("view_count", { ascending: false })
        .limit(5);

      // Get top prompts
      const { data: topPrompts } = await supabase
        .from("prompts")
        .select("id, title, view_count, category")
        .eq("author_id", user.id)
        .order("view_count", { ascending: false })
        .limit(5);

      setData({
        total_snippet_views: snippets?.reduce((sum, s) => sum + (s.view_count || 0), 0) || 0,
        total_prompt_views: prompts?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0,
        top_snippets: (topSnippets as any) || [],
        top_prompts: (topPrompts as any) || [],
      });
    } catch (err) {
      console.error("Analytics load error:", err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <ListPageSkeleton cards={4} />;
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="card border-red-500/20 bg-red-500/5 p-10 text-center">
          <p className="mb-4 text-sm text-red-400">Statistikani yuklab bo&apos;lmadi.</p>
          <button onClick={loadAnalytics} className="btn-primary btn-primary--sm">Qayta urinish</button>
        </div>
      </div>
    );
  }

  const totalViews = (data?.total_snippet_views || 0) + (data?.total_prompt_views || 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-sm">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-fg">{t("title")}</h1>
          <p className="text-sm text-zinc-400">{t("subtitle")}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="card p-6 border-line">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
              <Eye className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-2xl font-bold text-fg">{totalViews}</p>
              <p className="text-xs text-zinc-400">{t("views")}</p>
            </div>
          </div>
        </div>
        <div className="card p-6 border-line">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
              <Code2 className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-2xl font-bold text-fg">{data?.total_snippet_views || 0}</p>
              <p className="text-xs text-zinc-400">Snippet {t("views").toLowerCase()}</p>
            </div>
          </div>
        </div>
        <div className="card p-6 border-line">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
              <Sparkles className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-fg">{data?.total_prompt_views || 0}</p>
              <p className="text-xs text-zinc-400">Prompt {t("views").toLowerCase()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Snippets */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-fg">{t("top_snippets")}</h2>
        {data?.top_snippets?.length === 0 ? (
          <div className="card border-dashed border-line p-6 text-center text-zinc-400">
            {t("no_data")}
          </div>
        ) : (
          <div className="card overflow-x-auto border-line bg-surface-subtle">
            <table className="w-full min-w-[420px]">
              <thead className="bg-ink/5 border-b border-line">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-300">{t("title_col")}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-300">{t("language")}</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-zinc-300">{t("views")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.top_snippets?.map((snippet) => (
                  <tr key={snippet.id} className="border-b border-line last:border-0 hover:bg-ink/5 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/snippets/${snippet.id}` as any} className="font-medium text-brand hover:underline">
                        {snippet.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-400">{snippet.language}</td>
                    <td className="px-4 py-3 text-right font-medium text-fg">{snippet.view_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Prompts */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-fg">{t("top_prompts")}</h2>
        {data?.top_prompts?.length === 0 ? (
          <div className="card border-dashed border-line p-6 text-center text-zinc-400">
            {t("no_data")}
          </div>
        ) : (
          <div className="card overflow-x-auto border-line bg-surface-subtle">
            <table className="w-full min-w-[420px]">
              <thead className="bg-ink/5 border-b border-line">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-300">{t("title_col")}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-300">{t("category")}</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-zinc-300">{t("views")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.top_prompts?.map((prompt) => (
                  <tr key={prompt.id} className="border-b border-line last:border-0 hover:bg-ink/5 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/prompts/${prompt.id}` as any} className="font-medium text-violet-400 hover:underline">
                        {prompt.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-400">{prompt.category}</td>
                    <td className="px-4 py-3 text-right font-medium text-fg">{prompt.view_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

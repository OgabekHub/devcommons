"use client";

import { useState, useEffect } from "react";
import { BarChart3, Eye, Code2, Sparkles, Calendar } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

interface AnalyticsData {
  total_snippet_views: number;
  total_prompt_views: number;
  top_snippets: { id: string; title: string; view_count: number; language: string }[];
  top_prompts: { id: string; title: string; view_count: number; category: string }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Analytics");
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    const loadAnalytics = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/${locale}/auth`);
        return;
      }

      // Get total views
      const { data: snippets } = await supabase
        .from("snippets")
        .select("view_count")
        .eq("author_id", user.id);

      const { data: prompts } = await supabase
        .from("prompts")
        .select("view_count")
        .eq("author_id", user.id);

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
      setLoading(false);
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
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
          <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
          <p className="text-sm text-gray-400">{t("subtitle")}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="card p-6 border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
              <Eye className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalViews}</p>
              <p className="text-xs text-gray-400">{t("views")}</p>
            </div>
          </div>
        </div>
        <div className="card p-6 border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
              <Code2 className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{data?.total_snippet_views || 0}</p>
              <p className="text-xs text-gray-400">Snippet {t("views").toLowerCase()}</p>
            </div>
          </div>
        </div>
        <div className="card p-6 border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
              <Sparkles className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{data?.total_prompt_views || 0}</p>
              <p className="text-xs text-gray-400">Prompt {t("views").toLowerCase()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Snippets */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-white">{t("top_snippets")}</h2>
        {data?.top_snippets.length === 0 ? (
          <div className="card border-dashed border-white/10 p-6 text-center text-gray-400">
            {t("no_data")}
          </div>
        ) : (
          <div className="card overflow-hidden border-white/10 bg-[#111]">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">{t("title_col")}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">{t("language")}</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">{t("views")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.top_snippets.map((snippet) => (
                  <tr key={snippet.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <a href={`/snippets/${snippet.id}`} className="font-medium text-brand hover:underline">
                        {snippet.title}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{snippet.language}</td>
                    <td className="px-4 py-3 text-right font-medium text-white">{snippet.view_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Prompts */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">{t("top_prompts")}</h2>
        {data?.top_prompts.length === 0 ? (
          <div className="card border-dashed border-white/10 p-6 text-center text-gray-400">
            {t("no_data")}
          </div>
        ) : (
          <div className="card overflow-hidden border-white/10 bg-[#111]">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">{t("title_col")}</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">{t("category")}</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">{t("views")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.top_prompts.map((prompt) => (
                  <tr key={prompt.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <a href={`/prompts/${prompt.id}`} className="font-medium text-violet-400 hover:underline">
                        {prompt.title}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{prompt.category}</td>
                    <td className="px-4 py-3 text-right font-medium text-white">{prompt.view_count}</td>
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

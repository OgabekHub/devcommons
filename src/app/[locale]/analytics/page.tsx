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
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-gray-500">{t("subtitle")}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
              <Eye className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalViews}</p>
              <p className="text-xs text-gray-500">{t("views")}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
              <Code2 className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.total_snippet_views || 0}</p>
              <p className="text-xs text-gray-500">Snippet {t("views").toLowerCase()}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
              <Sparkles className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.total_prompt_views || 0}</p>
              <p className="text-xs text-gray-500">Prompt {t("views").toLowerCase()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Snippets */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">{t("top_snippets")}</h2>
        {data?.top_snippets.length === 0 ? (
          <div className="card border-dashed p-6 text-center text-gray-500">
            Hozircha ma'lumot yo'q
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Language</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Views</th>
                </tr>
              </thead>
              <tbody>
                {data?.top_snippets.map((snippet) => (
                  <tr key={snippet.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <a href={`/snippets/${snippet.id}`} className="font-medium text-brand hover:underline">
                        {snippet.title}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{snippet.language}</td>
                    <td className="px-4 py-3 text-right font-medium">{snippet.view_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Prompts */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">{t("top_prompts")}</h2>
        {data?.top_prompts.length === 0 ? (
          <div className="card border-dashed p-6 text-center text-gray-500">
            Hozircha ma'lumot yo'q
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Views</th>
                </tr>
              </thead>
              <tbody>
                {data?.top_prompts.map((prompt) => (
                  <tr key={prompt.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <a href={`/prompts/${prompt.id}`} className="font-medium text-violet-600 hover:underline">
                        {prompt.title}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{prompt.category}</td>
                    <td className="px-4 py-3 text-right font-medium">{prompt.view_count}</td>
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

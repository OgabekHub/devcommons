"use client";

import { useState, useEffect } from "react";
import { Hash, Code2, Sparkles } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

interface TagData {
  name: string;
  snippet_count: number;
  prompt_count: number;
  total_count: number;
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Tags");
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    const loadTags = async () => {
      // Get all tags with their usage counts
      const { data: snippetTags } = await supabase
        .from("snippet_tags")
        .select("tags(name)");

      const { data: promptTags } = await supabase
        .from("prompt_tags")
        .select("tags(name)");

      // Count tag usage
      const tagCounts = new Map<string, { snippet_count: number; prompt_count: number }>();

      snippetTags?.forEach((st: any) => {
        const name = st.tags?.name;
        if (name) {
          const current = tagCounts.get(name) || { snippet_count: 0, prompt_count: 0 };
          tagCounts.set(name, { ...current, snippet_count: current.snippet_count + 1 });
        }
      });

      promptTags?.forEach((pt: any) => {
        const name = pt.tags?.name;
        if (name) {
          const current = tagCounts.get(name) || { snippet_count: 0, prompt_count: 0 };
          tagCounts.set(name, { ...current, prompt_count: current.prompt_count + 1 });
        }
      });

      // Convert to array and sort by total count
      const sortedTags = Array.from(tagCounts.entries())
        .map(([name, counts]) => ({
          name,
          snippet_count: counts.snippet_count,
          prompt_count: counts.prompt_count,
          total_count: counts.snippet_count + counts.prompt_count,
        }))
        .sort((a, b) => b.total_count - a.total_count);

      setTags(sortedTags);
      setLoading(false);
    };

    loadTags();
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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-sm">
          <Hash className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-gray-500">{t("subtitle")}</p>
        </div>
      </div>

      {/* Tags Grid */}
      {tags.length === 0 ? (
        <div className="card border-dashed p-10 text-center">
          <Hash className="mx-auto mb-3 h-8 w-8 text-gray-300" />
          <p className="text-gray-500">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={`/snippets`}
              className="card card-shine group block"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold text-brand group-hover:text-brand-dark transition-colors">
                      #{tag.name}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-3 w-3" />
                      <span>{tag.snippet_count} {t("snippet")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3 text-violet-500" />
                      <span>{tag.prompt_count} {t("prompt")}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-700">{tag.total_count}</span>
                  <p className="text-xs text-gray-400">{t("total")}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

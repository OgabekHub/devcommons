"use client";

import { useState, useEffect } from "react";
import { Code2, Sparkles, Rss } from "lucide-react";
import { Link } from "@/i18n/routing";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import VoteButton from "@/components/VoteButton";

interface ActivityItem {
  type: "snippet" | "prompt";
  id: string;
  title: string;
  description?: string;
  content?: string;
  language?: string;
  category?: string;
  author_name: string;
  author_avatar: string | null;
  votes: number;
  created_at: string;
}

export default function FeedPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Feed");
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    const loadFeed = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/${locale}/auth`);
        return;
      }

      // Get users you follow
      const { data: follows } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);

      const followingIds = follows?.map(f => f.following_id) || [];

      if (followingIds.length === 0) {
        setLoading(false);
        return;
      }

      // Get their snippets
      const { data: snippets } = await supabase
        .from("snippets")
        .select("*")
        .in("author_id", followingIds)
        .order("created_at", { ascending: false })
        .limit(20);

      // Get their prompts
      const { data: prompts } = await supabase
        .from("prompts")
        .select("*")
        .in("author_id", followingIds)
        .order("created_at", { ascending: false })
        .limit(20);

      // Combine and sort by date
      const combined: ActivityItem[] = [
        ...(snippets || []).map((s: any) => ({ ...s, type: "snippet" as const })),
        ...(prompts || []).map((p: any) => ({ ...p, type: "prompt" as const })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setActivities(combined);
      setLoading(false);
    };

    loadFeed();
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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-sm">
          <Rss className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
          <p className="text-sm text-gray-400">{t("subtitle")}</p>
        </div>
      </div>

      {/* Content */}
      {activities.length === 0 ? (
        <div className="card border-dashed border-white/10 p-10 text-center">
          <Rss className="mx-auto mb-3 h-8 w-8 text-gray-500" />
          <p className="text-gray-400 mb-4">{t("empty")}</p>
          <Link href="/snippets" className="btn-primary shadow-[0_0_15px_rgba(124,92,252,0.3)]">
            {t("empty_desc")}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((item) => (
            <Link
              key={`${item.type}-${item.id}`}
              href={`/${item.type}s/${item.id}`}
              className="card card-shine group block"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  item.type === "snippet" ? "bg-brand/10" : "bg-violet-500/10"
                }`}>
                  {item.type === "snippet" ? (
                    <Code2 className={`h-5 w-5 ${item.type === "snippet" ? "text-brand" : "text-violet-400"}`} />
                  ) : (
                    <Sparkles className="h-5 w-5 text-violet-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-semibold text-white transition-colors group-hover:text-brand">{item.title}</h3>
                    {item.type === "snippet" && item.language && (
                      <span className="ml-2 rounded-lg bg-brand/10 border border-brand/20 px-2 py-0.5 text-xs font-semibold text-brand">{item.language}</span>
                    )}
                    {item.type === "prompt" && item.category && (
                      <span className="ml-2 rounded-lg bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-400">{item.category}</span>
                    )}
                  </div>
                  {(item.description || item.content) && (
                    <p className="text-sm text-gray-400 line-clamp-2">{item.description || item.content}</p>
                  )}
                  <div className="mt-2 flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      {item.author_avatar ? (
                        <img src={item.author_avatar} alt={item.author_name} className="h-4 w-4 rounded-full" />
                      ) : null}
                      {item.author_name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleDateString(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US")}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

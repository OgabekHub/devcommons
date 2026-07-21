"use client";

import { useState, useEffect } from "react";
import { Code2, Sparkles, Rss, TrendingUp, Clock, Users } from "lucide-react";
import { Link } from "@/i18n/routing";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useLocale, useTranslations } from "next-intl";
import VoteButton from "@/components/VoteButton";
import BookmarkButton from "@/components/BookmarkButton";
import SpotlightCard from "@/components/SpotlightCard";

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
  const [tab, setTab] = useState<"following" | "trending" | "newest">("following");
  const locale = useLocale();
  const t = useTranslations("Feed");
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    loadFeed();
  }, [tab]);

  const loadFeed = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (tab === "following") {
      if (!user) {
        setActivities([]);
        setLoading(false);
        return;
      }

      // Obuna bo'lingan userlar ID ro'yxati
      const { data: follows } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);

      const followingIds = follows?.map((f) => f.following_id) || [];

      if (followingIds.length === 0) {
        setActivities([]);
        setLoading(false);
        return;
      }

      // Snippetlar (author user ma'lumotlari bilan)
      const { data: snips } = await supabase
        .from("snippets")
        .select("*, users(github_username, avatar_url)")
        .in("author_id", followingIds)
        .order("created_at", { ascending: false })
        .limit(15);

      // Promptlar
      const { data: proms } = await supabase
        .from("prompts")
        .select("*, users(github_username, avatar_url)")
        .in("author_id", followingIds)
        .order("created_at", { ascending: false })
        .limit(15);

      mapAndSetActivities(snips, proms);
    } else if (tab === "trending") {
      // Platforma bo'yicha eng ko'p vote olganlar
      const [{ data: snips }, { data: proms }] = await Promise.all([
        supabase.from("snippets").select("*, users(github_username, avatar_url)").order("votes", { ascending: false }).limit(15),
        supabase.from("prompts").select("*, users(github_username, avatar_url)").order("votes", { ascending: false }).limit(15),
      ]);
      mapAndSetActivities(snips, proms);
    } else {
      // Yangilar
      const [{ data: snips }, { data: proms }] = await Promise.all([
        supabase.from("snippets").select("*, users(github_username, avatar_url)").order("created_at", { ascending: false }).limit(15),
        supabase.from("prompts").select("*, users(github_username, avatar_url)").order("created_at", { ascending: false }).limit(15),
      ]);
      mapAndSetActivities(snips, proms);
    }

    setLoading(false);
  };

  const mapAndSetActivities = (snips: any[] | null, proms: any[] | null) => {
    const combined: ActivityItem[] = [
      ...(snips || []).map((s: any) => ({
        ...s,
        type: "snippet" as const,
        author_name: s.users?.github_username || "Anonymous",
        author_avatar: s.users?.avatar_url || null,
      })),
      ...(proms || []).map((p: any) => ({
        ...p,
        type: "prompt" as const,
        author_name: p.users?.github_username || "Anonymous",
        author_avatar: p.users?.avatar_url || null,
      })),
    ].sort((a, b) => {
      if (tab === "trending") return (b.votes || 0) - (a.votes || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    setActivities(combined);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-violet-600 shadow-lg shadow-brand/20">
            <Rss className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
            <p className="text-sm text-gray-400">{t("subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 mb-6">
        <button
          onClick={() => setTab("following")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "following"
              ? "border-brand text-brand"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <Users className="h-4 w-4" />
          Obunalar
        </button>
        <button
          onClick={() => setTab("trending")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "trending"
              ? "border-brand text-brand"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Mashhur
        </button>
        <button
          onClick={() => setTab("newest")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "newest"
              ? "border-brand text-brand"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <Clock className="h-4 w-4" />
          Yangilar
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      ) : activities.length === 0 ? (
        <div className="card border-dashed border-white/10 p-12 text-center">
          <div className="mx-auto mb-4 inline-flex rounded-2xl bg-brand/10 p-4">
            <Rss className="h-8 w-8 text-brand" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {tab === "following" ? t("empty") : "Hozircha hech narsa yo'q"}
          </h2>
          <p className="mx-auto max-w-sm text-sm text-gray-400 mb-6">
            {tab === "following"
              ? "Boshqa dasturchilar profiliga o'tib, obuna bo'lsangiz ularning so'nggi kodingiz shu yerda chiqadi."
              : "Birinchi bo'lib kontent ulashing!"}
          </p>
          {tab === "following" && (
            <button
              onClick={() => setTab("trending")}
              className="btn-primary shadow-lg shadow-brand/20"
            >
              Mashhurlarni ko'rish
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((item, i) => (
            <Link
              key={`${item.type}-${item.id}`}
              href={`/${item.type}s/${item.id}`}
              className="group block"
            >
              <SpotlightCard delay={i * 0.04} className="card card-shine p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border ${
                    item.type === "snippet" 
                      ? "bg-brand/10 border-brand/20 text-brand" 
                      : "bg-violet-500/10 border-violet-500/20 text-violet-400"
                  }`}>
                    {item.type === "snippet" ? <Code2 className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <h3 className="font-bold text-white transition-colors group-hover:text-brand truncate">
                        {item.title}
                      </h3>
                      {item.type === "snippet" && item.language && (
                        <span className="flex-shrink-0 rounded-lg bg-brand/10 border border-brand/20 px-2 py-0.5 text-xs font-semibold text-brand">
                          {item.language}
                        </span>
                      )}
                      {item.type === "prompt" && item.category && (
                        <span className="flex-shrink-0 rounded-lg bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-400">
                          {item.category}
                        </span>
                      )}
                    </div>

                    {(item.description || item.content) && (
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                        {item.description || item.content}
                      </p>
                    )}

                    {/* Footer stats */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/users/${item.author_name}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 font-medium text-gray-300 hover:text-brand transition-colors"
                        >
                          {item.author_avatar ? (
                            <img src={item.author_avatar} alt={item.author_name} className="h-4 w-4 rounded-full" />
                          ) : null}
                          {item.author_name}
                        </Link>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">
                          {new Date(item.created_at).toLocaleDateString(
                            locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US"
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <VoteButton id={item.id} type={item.type} initialVotes={item.votes ?? 0} />
                        {item.type === "snippet" ? (
                          <BookmarkButton snippetId={item.id} compact />
                        ) : (
                          <BookmarkButton promptId={item.id} compact />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

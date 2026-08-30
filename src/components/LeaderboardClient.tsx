"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Trophy, Flame, GitFork, Heart, Sparkles, Code2, ShieldCheck, HelpCircle, Award, Zap } from "lucide-react";

interface ResourceItem {
  id: string;
  title: string;
  votes?: number;
  view_count?: number;
  forks_count?: number;
  used_count?: number;
  language?: string;
  category?: string;
  author?: {
    github_username?: string;
    avatar_url?: string;
  };
  type: "snippet" | "prompt";
  // Derived metrics
  computedForks?: number;
  computedUsed?: number;
  impactScore?: number;
}

interface LeaderboardClientProps {
  entries: any[];
}

// Impact score'ni FAQAT haqiqiy DB metrikalaridan hisoblaydi.
// (Ilgari metrikalar null bo'lsa UUID hash'idan soxta raqamlar to'qilardi —
//  bu foydalanuvchiga yolg'on statistika ko'rsatardi, olib tashlandi.)
function enrichItem(item: any, type: "snippet" | "prompt"): ResourceItem {
  const votes = item.votes || 0;
  const computedForks = item.forks_count || 0;
  const computedUsed = item.used_count || 0;
  const impactScore = (computedForks * 10) + (computedUsed * 3) + (votes * 2);

  return {
    ...item,
    type,
    computedForks,
    computedUsed,
    impactScore,
  };
}

type TabType = "impact" | "forks" | "used" | "votes";

export default function LeaderboardClient({ entries = [] }: LeaderboardClientProps) {
  const t = useTranslations("Leaderboard");
  const [activeTab, setActiveTab] = useState<TabType>("impact");
  const [showInfo, setShowInfo] = useState(false);

  // Enrich all items with calculated stats and impact scores
  const enrichedSnippets = useMemo(() => {
    return (entries || []).filter(e => e.item_type === "snippet").map((s) => enrichItem(s, "snippet"));
  }, [entries]);

  const enrichedPrompts = useMemo(() => {
    return (entries || []).filter(e => e.item_type === "prompt").map((p) => enrichItem(p, "prompt"));
  }, [entries]);

  // Combined top 3 creators across all categories for Hall of Fame Podium
  const topPodium = useMemo(() => {
    const combined = [...enrichedSnippets, ...enrichedPrompts];
    return combined.sort((a, b) => (b.impactScore || 0) - (a.impactScore || 0)).slice(0, 3);
  }, [enrichedSnippets, enrichedPrompts]);

  // Sorted lists based on selected tab
  const sortFn = (a: ResourceItem, b: ResourceItem) => {
    if (activeTab === "impact") return (b.impactScore || 0) - (a.impactScore || 0);
    if (activeTab === "forks") return (b.computedForks || 0) - (a.computedForks || 0);
    if (activeTab === "used") return (b.computedUsed || 0) - (a.computedUsed || 0);
    return (b.votes || 0) - (a.votes || 0);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sortedSnippets = useMemo(() => [...enrichedSnippets].sort(sortFn), [enrichedSnippets, activeTab]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sortedPrompts = useMemo(() => [...enrichedPrompts].sort(sortFn), [enrichedPrompts, activeTab]);

  return (
    <div className="space-y-12">
      {/* Gamification Explanation Box */}
      <div className="relative rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-[#111726] to-brand/10 p-5 shadow-xl md:p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-2 text-sm font-bold text-purple-300 hover:text-fg transition"
          >
            <HelpCircle className="h-5 w-5 text-purple-400" />
            <span>{t("how_it_works")}</span>
            <span className="text-xs text-zinc-500">({showInfo ? "Yopish" : "O'qish"})</span>
          </button>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-400">
            <Award className="h-4 w-4" />
            <span>Reputation Engine v2.0</span>
          </span>
        </div>

        {showInfo && (
          <p className="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed font-mono border-t border-line pt-3 animate-fadeIn">
            {t("how_it_works_desc")}
          </p>
        )}
      </div>

      {/* Hall of Fame Podium (Top 3 Overall) */}
      {topPodium.length >= 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-center text-lg font-black text-fg uppercase tracking-wider">
            <Trophy className="h-6 w-6 text-amber-500 animate-bounce" />
            <span>{t("top_creators_title")}</span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-end pt-4">
            {/* Silver (#2) */}
            <div className="order-2 md:order-1 relative rounded-2xl border border-zinc-400/30 bg-gradient-to-b from-zinc-500/10 to-[#0A0D15] p-6 text-center shadow-lg md:h-[230px] flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-zinc-400 px-3 py-0.5 text-xs font-extrabold text-black shadow">
                #2 SILVER
              </div>
              <div className="mt-4">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t("rank_2")}</p>
                <h4 className="mt-1 font-bold text-fg truncate text-base">{topPodium[1]?.title}</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  @{topPodium[1]?.author?.github_username || t("author_hidden")}
                </p>
              </div>
              <div className="mt-4 rounded-xl bg-ink/5 p-2.5 font-mono text-xs font-bold text-cyan-400 flex items-center justify-center gap-1.5 border border-line">
                <Zap className="h-4 w-4 fill-current" />
                <span>{topPodium[1]?.impactScore} Impact Score</span>
              </div>
            </div>

            {/* Gold (#1) */}
            <div className="order-1 md:order-2 relative rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-500/20 to-[#121622] p-6 text-center shadow-[0_0_40px_rgba(245,158,11,0.25)] md:h-[260px] flex flex-col justify-between scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-1 text-xs font-black text-black shadow-lg animate-pulse">
                <Trophy className="h-3.5 w-3.5 fill-current" />
                <span>#1 GOLD CHAMPION</span>
              </div>
              <div className="mt-4">
                <span className="inline-block rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-300 mb-1">
                  👑 {t("rank_1")}
                </span>
                <h4 className="font-extrabold text-fg truncate text-lg">{topPodium[0]?.title}</h4>
                <p className="text-xs text-amber-300/80 font-semibold mt-1">
                  @{topPodium[0]?.author?.github_username || t("author_hidden")}
                </p>
              </div>
              <div className="mt-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-3 font-mono text-sm font-black text-black flex items-center justify-center gap-1.5 shadow-md">
                <Zap className="h-4 w-4 fill-current" />
                <span>{topPodium[0]?.impactScore} TOTAL IMPACT</span>
              </div>
            </div>

            {/* Bronze (#3) */}
            <div className="order-3 relative rounded-2xl border border-amber-700/30 bg-gradient-to-b from-amber-800/10 to-[#0B0D14] p-6 text-center shadow-lg md:h-[210px] flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-700 px-3 py-0.5 text-xs font-extrabold text-white shadow">
                #3 BRONZE
              </div>
              <div className="mt-4">
                <p className="text-xs font-bold text-amber-500/80 uppercase tracking-widest">{t("rank_3")}</p>
                <h4 className="mt-1 font-bold text-fg truncate text-base">{topPodium[2]?.title}</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  @{topPodium[2]?.author?.github_username || t("author_hidden")}
                </p>
              </div>
              <div className="mt-4 rounded-xl bg-ink/5 p-2 font-mono text-xs font-bold text-orange-400 flex items-center justify-center gap-1.5 border border-line">
                <Zap className="h-4 w-4 fill-current" />
                <span>{topPodium[2]?.impactScore} Impact Score</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-line pb-4">
        {[
          { id: "impact", label: t("tab_impact"), icon: Zap, color: "text-amber-400 bg-amber-500/15 border-amber-500/30" },
          { id: "forks", label: t("tab_forks"), icon: GitFork, color: "text-blue-400 bg-blue-500/15 border-blue-500/30" },
          { id: "used", label: t("tab_used"), icon: Flame, color: "text-orange-400 bg-orange-500/15 border-orange-500/30" },
          { id: "votes", label: t("tab_votes"), icon: Heart, color: "text-rose-400 bg-rose-500/15 border-rose-500/30" },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                isSelected ? tab.color : "border-transparent bg-ink/5 text-zinc-400 hover:bg-ink/10 hover:text-fg"
              }`}
            >
              <Icon className={`h-4 w-4 ${isSelected ? "animate-pulse" : ""}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Side-by-Side Ranked Lists */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Top Snippets & Agent Rules */}
        <div className="rounded-3xl border border-line bg-[#0A0C13]/90 p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-32 bg-brand/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand border border-brand/20 shadow-inner">
                <Code2 className="h-6 w-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-fg">{t("snippets_section")}</h2>
            </div>
            <span className="text-xs font-mono text-zinc-400 bg-ink/5 px-2.5 py-1 rounded-lg">Top 10</span>
          </div>

          <div className="space-y-3.5 relative z-10">
            {sortedSnippets.map((snippet, i) => (
              <Link 
                href={`/snippets/${snippet.id}` as any}
                key={snippet.id} 
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-line bg-[#0D101A] p-4 transition-all duration-200 hover:bg-ink/5 hover:border-brand/40 hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black shadow ${
                    i === 0 ? "bg-gradient-to-br from-amber-400 to-amber-600 text-black" :
                    i === 1 ? "bg-gradient-to-br from-zinc-300 to-zinc-400 text-black" :
                    i === 2 ? "bg-gradient-to-br from-amber-700 to-amber-800 text-white" :
                    "bg-ink/5 text-zinc-400 border border-line"
                  }`}>
                    #{i + 1}
                  </div>
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-bold text-fg text-sm sm:text-base group-hover:text-brand transition-colors">{snippet.title}</h3>
                      {i < 3 && <span title="Verified Champion"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" /></span>}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                      <span className="truncate">@{snippet.author?.github_username || t("author_hidden")}</span>
                      <span>•</span>
                      <span className="text-brand font-semibold">{snippet.language || "TypeScript"}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="flex shrink-0 items-center gap-3 self-end sm:self-center">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="flex items-center gap-1 rounded bg-blue-500/10 px-2 py-1 text-blue-400 border border-blue-500/20" title="Fork Count">
                      <GitFork className="h-3 w-3" />
                      {snippet.computedForks}
                    </span>
                    <span className="flex items-center gap-1 rounded bg-orange-500/10 px-2 py-1 text-orange-400 border border-orange-500/20" title="Used in Projects">
                      <Flame className="h-3 w-3" />
                      {snippet.computedUsed}
                    </span>
                  </div>

                  <div className="flex flex-col items-end justify-center rounded-xl bg-brand/10 border border-brand/25 px-3 py-1 text-right min-w-[75px]">
                    <span className="text-xs font-black text-brand flex items-center gap-1">
                      <Zap className="h-3 w-3 fill-current" />
                      {snippet.impactScore}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">Impact</span>
                  </div>
                </div>
              </Link>
            ))}
            {sortedSnippets.length === 0 && (
              <p className="py-8 text-center text-xs text-zinc-500">Hech qaysi namuna topilmadi</p>
            )}
          </div>
        </div>

        {/* Top Prompts & Workflows */}
        <div className="rounded-3xl border border-line bg-[#0A0C13]/90 p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-32 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-fg">{t("prompts_section")}</h2>
            </div>
            <span className="text-xs font-mono text-zinc-400 bg-ink/5 px-2.5 py-1 rounded-lg">Top 10</span>
          </div>

          <div className="space-y-3.5 relative z-10">
            {sortedPrompts.map((prompt, i) => (
              <Link 
                href={`/prompts/${prompt.id}` as any}
                key={prompt.id} 
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-line bg-[#0D101A] p-4 transition-all duration-200 hover:bg-ink/5 hover:border-purple-500/40 hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black shadow ${
                    i === 0 ? "bg-gradient-to-br from-amber-400 to-amber-600 text-black" :
                    i === 1 ? "bg-gradient-to-br from-zinc-300 to-zinc-400 text-black" :
                    i === 2 ? "bg-gradient-to-br from-amber-700 to-amber-800 text-white" :
                    "bg-ink/5 text-zinc-400 border border-line"
                  }`}>
                    #{i + 1}
                  </div>
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-bold text-fg text-sm sm:text-base group-hover:text-purple-400 transition-colors">{prompt.title}</h3>
                      {i < 3 && <span title="Verified Champion"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" /></span>}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                      <span className="truncate">@{prompt.author?.github_username || t("author_hidden")}</span>
                      <span>•</span>
                      <span className="text-purple-400 font-semibold">{prompt.category || "AI Architecture"}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="flex shrink-0 items-center gap-3 self-end sm:self-center">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="flex items-center gap-1 rounded bg-blue-500/10 px-2 py-1 text-blue-400 border border-blue-500/20" title="Fork Count">
                      <GitFork className="h-3 w-3" />
                      {prompt.computedForks}
                    </span>
                    <span className="flex items-center gap-1 rounded bg-orange-500/10 px-2 py-1 text-orange-400 border border-orange-500/20" title="Used in Projects">
                      <Flame className="h-3 w-3" />
                      {prompt.computedUsed}
                    </span>
                  </div>

                  <div className="flex flex-col items-end justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-right min-w-[75px]">
                    <span className="text-xs font-black text-purple-300 flex items-center gap-1">
                      <Zap className="h-3 w-3 fill-current text-purple-400" />
                      {prompt.impactScore}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">Impact</span>
                  </div>
                </div>
              </Link>
            ))}
            {sortedPrompts.length === 0 && (
              <p className="py-8 text-center text-xs text-zinc-500">Hech qaysi namuna topilmadi</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { createSupabaseServer } from "@/lib/supabase-server";
import { Trophy } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import LeaderboardClient from "@/components/LeaderboardClient";
import type { Metadata } from "next";

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  setRequestLocale(locale);
  const title = "AI Impact Leaderboard & Hall of Fame | DevCommons";
  const description = "Ranked strictly by real engineering utility, Fork Counts, Used frequency in vibe-coding workflows, and Community Trust!";

  const ogUrl = new URL("https://devcommons.uz/api/og");
  ogUrl.searchParams.set("title", "AI Impact Leaderboard");
  ogUrl.searchParams.set("category", "Community Hall of Fame");
  ogUrl.searchParams.set("badge", "👑 Grand Vibe Masters");
  ogUrl.searchParams.set("author", "DevCommons");

  return {
    title,
    description,
    keywords: ["Leaderboard", "AI Impact", "Vibe Coding", "DevCommons", "Top Snippets", "Top Prompts", "Gamification"],
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://devcommons.uz/leaderboard",
      siteName: "DevCommons",
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function LeaderboardPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("Leaderboard");
  const supabase = createSupabaseServer();

  // Fetch top ranked items from the unified backend view
  const { data: leaderboardEntries } = await supabase
    .from("leaderboard_view")
    .select("*, author:users(github_username, avatar_url)")
    .order("impact_score", { ascending: false })
    .limit(30);

  return (
    <div className="container mx-auto max-w-[1380px] px-4 py-12 pb-24 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-6 border border-amber-500/20 shadow-[0_0_35px_rgba(245,158,11,0.25)] animate-pulse">
          <Trophy className="h-8 w-8 fill-current text-amber-400" />
        </div>
        <h1 className="text-3xl font-black text-fg sm:text-5xl lg:text-6xl tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* Interactive AI Impact Leaderboard Client */}
      <LeaderboardClient entries={leaderboardEntries || []} />
    </div>
  );
}

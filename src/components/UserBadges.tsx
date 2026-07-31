"use client";

import { Sparkles, Code2, Bot, Trophy, Flame, Lock, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  stats: {
    snippetCount: number;
    promptCount: number;
    totalVotes?: number;
    totalViews?: number;
    followersCount?: number;
  };
  showAll?: boolean;
}

export default function UserBadges({ stats, showAll = true }: Props) {
  const t = useTranslations("Badges");

  const badges = [
    {
      id: "early_bird",
      name: t("early_bird_name"),
      desc: t("early_bird_desc"),
      icon: Sparkles,
      unlocked: true,
      colors: {
        border: "border-amber-500/30 group-hover:border-amber-500/60",
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        glow: "shadow-[0_0_15px_rgba(245,158,11,0.1)]",
      },
    },
    {
      id: "star_coder",
      name: t("star_coder_name"),
      desc: t("star_coder_desc"),
      icon: Code2,
      unlocked: stats.snippetCount > 0,
      colors: {
        border: "border-blue-500/30 group-hover:border-blue-500/60",
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        glow: "shadow-[0_0_15px_rgba(59,130,246,0.1)]",
      },
    },
    {
      id: "prompt_master",
      name: t("prompt_master_name"),
      desc: t("prompt_master_desc"),
      icon: Bot,
      unlocked: stats.promptCount > 0,
      colors: {
        border: "border-violet-500/30 group-hover:border-violet-500/60",
        bg: "bg-violet-500/10",
        text: "text-violet-400",
        glow: "shadow-[0_0_15px_rgba(139,92,246,0.1)]",
      },
    },
    {
      id: "top_contributor",
      name: t("top_contributor_name"),
      desc: t("top_contributor_desc"),
      icon: Trophy,
      unlocked: (stats.totalVotes ?? 0) >= 3 || (stats.followersCount ?? 0) >= 1 || (stats.snippetCount + stats.promptCount) >= 3,
      colors: {
        border: "border-emerald-500/30 group-hover:border-emerald-500/60",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        glow: "shadow-[0_0_15px_rgba(16,185,129,0.1)]",
      },
    },
    {
      id: "trendsetter",
      name: t("trendsetter_name"),
      desc: t("trendsetter_desc"),
      icon: Flame,
      unlocked: (stats.totalViews ?? 0) >= 20 || (stats.totalVotes ?? 0) >= 5 || (stats.snippetCount + stats.promptCount) >= 5,
      colors: {
        border: "border-rose-500/30 group-hover:border-rose-500/60",
        bg: "bg-rose-500/10",
        text: "text-rose-400",
        glow: "shadow-[0_0_15px_rgba(244,63,94,0.1)]",
      },
    },
  ];

  const displayBadges = showAll ? badges : badges.filter((b) => b.unlocked);

  if (!showAll && displayBadges.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-400" />
        <h3 className="text-lg font-bold text-white">{t("title")}</h3>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-gray-300">
          {badges.filter((b) => b.unlocked).length} / {badges.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {displayBadges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`group relative flex items-start gap-3 rounded-xl border p-3.5 transition-colors duration-200 ${
                badge.unlocked
                  ? `${badge.colors.border} ${badge.colors.bg} ${badge.colors.glow}`
                  : "border-white/5 bg-white/[0.02] opacity-50 hover:border-white/10"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  badge.unlocked ? badge.colors.bg : "bg-white/5 text-gray-500"
                }`}
              >
                <Icon className={`h-5 w-5 ${badge.unlocked ? badge.colors.text : "text-gray-500"}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className={`text-sm font-bold truncate ${badge.unlocked ? "text-white" : "text-gray-400"}`}>
                    {badge.name}
                  </h4>
                  {badge.unlocked ? (
                    <span title={t("unlocked")} className="shrink-0 text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                  ) : (
                    <span title={t("locked")} className="shrink-0 text-gray-600">
                      <Lock className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-400 leading-normal">
                  {badge.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

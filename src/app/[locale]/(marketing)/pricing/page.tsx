"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Zap, Users, Sparkles } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function PricingPage() {
  const t = useTranslations("Pricing");
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="container mx-auto max-w-[1280px] px-4 py-16 pb-24 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
          {t("title")}
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="relative flex items-center p-1 rounded-full bg-white/5 border border-white/10 p-1">
          <button
            onClick={() => setIsYearly(false)}
            className={`relative w-32 py-2.5 text-sm font-bold rounded-full transition-all duration-300 ${
              !isYearly ? "text-white bg-white/10 shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            {t("monthly")}
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`relative w-40 py-2.5 text-sm font-bold rounded-full transition-all duration-300 ${
              isYearly ? "text-brand bg-brand/15 shadow-sm border border-brand/20" : "text-gray-400 hover:text-white"
            }`}
          >
            {t("yearly")}
            <span className="absolute -top-2 -right-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 to-teal-400 shadow-sm animate-pulse">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
        {/* Free Tier */}
        <div className="relative rounded-3xl border border-white/10 bg-[#0A0C13] p-8 shadow-xl flex flex-col hover:border-white/20 transition-all duration-300">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-gray-500/10 text-gray-300 text-xs font-black uppercase tracking-wider mb-4 border border-gray-500/20">
              {t("tier_free")}
            </span>
            <div className="flex items-baseline gap-1 text-white">
              <span className="text-5xl font-black">{t("tier_free_price")}</span>
              <span className="text-gray-500 font-semibold">/mo</span>
            </div>
            <p className="mt-4 text-sm text-gray-400 h-10">{t("tier_free_desc")}</p>
          </div>
          <Link href="/auth" className="mt-4 w-full py-3 px-4 rounded-xl font-bold text-center border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all mb-8">
            {t("btn_free")}
          </Link>
          <div className="flex flex-col gap-4 text-sm text-gray-300 mt-auto">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-gray-500 shrink-0" />
              <span>{t("feature_open_source")}</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-gray-500 shrink-0" />
              <span>{t("feature_public_pull")}</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-gray-500 shrink-0" />
              <span>{t("feature_community")}</span>
            </div>
          </div>
        </div>

        {/* Pro Tier */}
        <div className="relative rounded-3xl border-2 border-brand/50 bg-gradient-to-b from-[#131126] to-[#0A0C13] p-8 shadow-[0_0_40px_rgba(139,92,246,0.15)] flex flex-col transform md:-translate-y-4 hover:shadow-[0_0_50px_rgba(139,92,246,0.25)] transition-all duration-300">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand via-purple-400 to-brand rounded-t-3xl opacity-80" />
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/20 text-brand text-xs font-black uppercase tracking-wider mb-4 border border-brand/30">
              <Zap className="h-3.5 w-3.5 fill-current" />
              {t("tier_pro")}
            </span>
            <div className="flex items-baseline gap-1 text-white">
              <span className="text-5xl font-black">{isYearly ? "$9" : t("tier_pro_price")}</span>
              <span className="text-gray-500 font-semibold">/mo</span>
            </div>
            <p className="mt-4 text-sm text-brand-light/80 h-10">{t("tier_pro_desc")}</p>
          </div>
          <button className="mt-4 w-full py-3 px-4 rounded-xl font-bold text-center bg-gradient-to-r from-brand to-purple-600 hover:from-purple-500 hover:to-brand text-white shadow-lg shadow-brand/25 transition-all mb-8 relative overflow-hidden group">
            <span className="relative z-10">{t("btn_pro")}</span>
            <div className="absolute inset-0 h-full w-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          </button>
          <div className="flex flex-col gap-4 text-sm text-gray-200 mt-auto">
            <div className="flex items-start gap-3 font-semibold text-white">
              <Sparkles className="h-5 w-5 text-brand shrink-0" />
              <span>{t("feature_private_rules")}</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-brand shrink-0" />
              <span>{t("feature_verified_market")}</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-brand shrink-0" />
              <span>{t("feature_mcp_advanced")}</span>
            </div>
            <div className="flex items-start gap-3 opacity-60">
              <CheckCircle2 className="h-5 w-5 text-gray-500 shrink-0" />
              <span>{t("feature_public_pull")}</span>
            </div>
          </div>
        </div>

        {/* Team Tier */}
        <div className="relative rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-[#09151A] to-[#0A0C13] p-8 shadow-xl flex flex-col hover:border-cyan-500/40 transition-all duration-300">
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase tracking-wider mb-4 border border-cyan-500/20">
              <Users className="h-3.5 w-3.5" />
              {t("tier_team")}
            </span>
            <div className="flex items-baseline gap-1 text-white">
              <span className="text-5xl font-black">{isYearly ? "$39" : t("tier_team_price")}</span>
              <span className="text-gray-500 font-semibold">/mo/user</span>
            </div>
            <p className="mt-4 text-sm text-cyan-300/70 h-10">{t("tier_team_desc")}</p>
          </div>
          <Link href="/teams" className="mt-4 w-full py-3 px-4 rounded-xl font-bold text-center border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-all mb-8">
            {t("btn_team")}
          </Link>
          <div className="flex flex-col gap-4 text-sm text-gray-300 mt-auto">
            <div className="flex items-start gap-3 font-semibold text-white">
              <Sparkles className="h-5 w-5 text-cyan-400 shrink-0" />
              <span>{t("feature_team_space")}</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0" />
              <span>{t("feature_rbac")}</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0" />
              <span>{t("feature_priority_support")}</span>
            </div>
            <div className="flex items-start gap-3 opacity-60">
              <CheckCircle2 className="h-5 w-5 text-gray-500 shrink-0" />
              <span>{t("feature_private_rules")} (All Pro features)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

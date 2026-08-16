"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Zap, Users, Sparkles, ArrowRight, Shield, Star } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function PricingPage() {
  const t = useTranslations("Pricing");
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-[#070709]">
      {/* Subtle background texture */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative container mx-auto max-w-[1200px] px-4 py-20 pb-32 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 mb-6">
            <Star className="h-3.5 w-3.5 text-brand fill-brand" />
            <span className="text-xs font-semibold text-brand tracking-wide uppercase">Simple Pricing</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl mb-5 leading-[1.1]">
            {t("title")}
          </h1>
          <p className="text-base text-gray-400 leading-relaxed max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* ── Billing Toggle ── */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center p-1 rounded-full bg-white/5 border border-white/10 gap-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`relative px-6 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                !isYearly
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {t("monthly")}
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`relative px-6 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                isYearly
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {t("yearly")}
              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-400">
                −20%
              </span>
            </button>
          </div>
        </div>

        {/* ── Pricing Cards ── */}
        <div className="grid md:grid-cols-3 gap-5 items-start max-w-5xl mx-auto">

          {/* ── FREE ── */}
          <div className="group relative rounded-2xl bg-[#0D0D12] border border-white/8 p-7 flex flex-col hover:border-white/15 transition-all duration-300 hover:bg-[#0F0F15]">
            {/* tier label */}
            <div className="mb-6">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-white/5 text-gray-400 text-[11px] font-bold uppercase tracking-widest border border-white/8 mb-5">
                {t("tier_free")}
              </span>
              <div className="flex items-end gap-1.5">
                <span className="text-5xl font-black text-white leading-none">{t("tier_free_price")}</span>
                <span className="text-gray-600 text-sm font-medium mb-1">/mo</span>
              </div>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed min-h-[40px]">
                {t("tier_free_desc")}
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/auth"
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-center border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all mb-7 flex items-center justify-center gap-2 group/btn"
            >
              {t("btn_free")}
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
            </Link>

            {/* Divider */}
            <div className="border-t border-white/5 pt-6">
              <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-4">What&apos;s included</p>
              <div className="flex flex-col gap-3 text-sm text-gray-400">
                <FeatureRow icon="check">{t("feature_open_source")}</FeatureRow>
                <FeatureRow icon="check">{t("feature_public_pull")}</FeatureRow>
                <FeatureRow icon="check">{t("feature_community")}</FeatureRow>
              </div>
            </div>
          </div>

          {/* ── PRO (featured) ── */}
          <div className="group relative rounded-2xl bg-[#0E0B1A] border border-brand/25 p-7 flex flex-col hover:border-brand/40 transition-all duration-300 shadow-[0_0_60px_rgba(124,92,252,0.08)] hover:shadow-[0_0_80px_rgba(124,92,252,0.14)]">
            {/* Most popular badge — positioned INSIDE, not outside */}
            <div className="flex items-start justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand/15 text-brand text-[11px] font-bold uppercase tracking-widest border border-brand/20">
                <Zap className="h-3 w-3 fill-current" />
                {t("tier_pro")}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-brand/10 text-brand text-[10px] font-black uppercase tracking-wider border border-brand/15">
                Popular
              </span>
            </div>

            <div className="mb-6 -mt-2">
              <div className="flex items-end gap-1.5">
                <span className="text-5xl font-black text-white leading-none">
                  {isYearly ? "$9" : t("tier_pro_price")}
                </span>
                <span className="text-gray-600 text-sm font-medium mb-1">/mo</span>
              </div>
              {isYearly && (
                <p className="text-xs text-emerald-400 font-semibold mt-1">Billed $108/year · Save $36</p>
              )}
              <p className="mt-3 text-sm text-gray-400 leading-relaxed min-h-[40px]">
                {t("tier_pro_desc")}
              </p>
            </div>

            {/* CTA */}
            <button className="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-center bg-brand hover:bg-brand/90 text-white transition-all mb-7 flex items-center justify-center gap-2 group/btn shadow-[0_4px_20px_rgba(124,92,252,0.3)]">
              <span>{t("btn_pro")}</span>
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            {/* Features */}
            <div className="border-t border-white/8 pt-6">
              <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-4">Everything in Free, plus</p>
              <div className="flex flex-col gap-3 text-sm text-gray-300">
                <FeatureRow icon="sparkle" accent="brand">{t("feature_private_rules")}</FeatureRow>
                <FeatureRow icon="check" accent="brand">{t("feature_verified_market")}</FeatureRow>
                <FeatureRow icon="check" accent="brand">{t("feature_mcp_advanced")}</FeatureRow>
                <FeatureRow icon="check" accent="brand">{t("feature_public_pull")}</FeatureRow>
              </div>
            </div>
          </div>

          {/* ── TEAM ── */}
          <div className="group relative rounded-2xl bg-[#080F13] border border-cyan-500/15 p-7 flex flex-col hover:border-cyan-500/30 transition-all duration-300 hover:bg-[#091318]">
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-[11px] font-bold uppercase tracking-widest border border-cyan-500/15 mb-5">
                <Users className="h-3 w-3" />
                {t("tier_team")}
              </span>
              <div className="flex items-end gap-1.5">
                <span className="text-5xl font-black text-white leading-none">
                  {isYearly ? "$39" : t("tier_team_price")}
                </span>
                <span className="text-gray-600 text-sm font-medium mb-1">/mo/user</span>
              </div>
              {isYearly && (
                <p className="text-xs text-emerald-400 font-semibold mt-1">Billed annually · Save 20%</p>
              )}
              <p className="mt-3 text-sm text-gray-500 leading-relaxed min-h-[40px]">
                {t("tier_team_desc")}
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/teams"
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-center border border-cyan-500/20 bg-cyan-500/8 hover:bg-cyan-500/15 text-cyan-300 hover:text-cyan-200 transition-all mb-7 flex items-center justify-center gap-2 group/btn"
            >
              {t("btn_team")}
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
            </Link>

            {/* Features */}
            <div className="border-t border-white/5 pt-6">
              <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-4">Everything in Pro, plus</p>
              <div className="flex flex-col gap-3 text-sm text-gray-400">
                <FeatureRow icon="sparkle" accent="cyan">{t("feature_team_space")}</FeatureRow>
                <FeatureRow icon="check" accent="cyan">{t("feature_rbac")}</FeatureRow>
                <FeatureRow icon="check" accent="cyan">{t("feature_priority_support")}</FeatureRow>
                <FeatureRow icon="check" accent="cyan">{t("feature_private_rules")} (All Pro features)</FeatureRow>
              </div>
            </div>
          </div>
        </div>

        {/* ── Trust strip ── */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-600 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gray-700" />
            <span>No credit card required</span>
          </div>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-gray-700" />
            <span>Cancel anytime</span>
          </div>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-gray-700" />
            <span>Instant access after upgrade</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── helper ── */
function FeatureRow({
  children,
  icon = "check",
  accent,
}: {
  children: React.ReactNode;
  icon?: "check" | "sparkle";
  accent?: "brand" | "cyan";
}) {
  const colorMap = {
    brand: "text-brand",
    cyan: "text-cyan-400",
    default: "text-gray-600",
  };
  const color = accent ? colorMap[accent] : colorMap.default;

  return (
    <div className="flex items-start gap-2.5">
      {icon === "sparkle" ? (
        <Sparkles className={`h-4 w-4 shrink-0 mt-0.5 ${color}`} />
      ) : (
        <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${color}`} />
      )}
      <span className="leading-snug">{children}</span>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import PromptChainViewer, { StepItem } from "@/components/PromptChainViewer";
import SkillBundleCard from "@/components/SkillBundleCard";
import { Layers, Package, ShieldCheck, Filter } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface WorkflowsDashboardProps {
  advancedChainSteps: StepItem[];
  skillBundles?: any[];
}

export default function WorkflowsDashboard({
  advancedChainSteps,
  skillBundles = [],
}: WorkflowsDashboardProps) {
  const t = useTranslations("Workflows");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<"all" | "chains" | "bundles">("all");

  return (
    <div className="space-y-10">
      {/* Tab Selector & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0E121B] border border-line rounded-2xl p-2 sm:p-3 shadow-lg">
        <div className="flex items-center gap-1 overflow-x-auto p-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "all"
                ? "bg-gradient-to-r from-brand to-indigo-600 text-white shadow-lg shadow-brand/25"
                : "text-zinc-400 hover:text-fg hover:bg-ink/5"
            }`}
          >
            <span>✨ {locale === "uz" ? "Barcha Vositalar" : "All Architecture Hub"}</span>
          </button>
          <button
            onClick={() => setActiveTab("chains")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "chains"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                : "text-zinc-400 hover:text-fg hover:bg-ink/5"
            }`}
          >
            <Layers className="h-4 w-4 text-purple-400" />
            <span>{t("tab_chains")} (2)</span>
          </button>
          <button
            onClick={() => setActiveTab("bundles")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "bundles"
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                : "text-zinc-400 hover:text-fg hover:bg-ink/5"
            }`}
          >
            <Package className="h-4 w-4 text-cyan-400" />
            <span>{t("tab_bundles")} (2)</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 pr-2 text-xs text-zinc-400 font-mono">
          <Filter className="h-3.5 w-3.5 text-brand" />
          <span>Showing verified production bundles</span>
        </div>
      </div>

      {/* Section 1: Prompt Chains */}
      {(activeTab === "all" || activeTab === "chains") && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-l-4 border-purple-500 pl-4 py-1">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-fg flex items-center gap-2">
                <span>{t("tab_chains")}</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                {locale === "uz" ? "Kettening avtomatlashtirilgan AI proompt ketma-ketliklari" : "Multi-stage autonomous prompt sequences producing verified engineering outcomes."}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
              ⚡ Live Execution Ready
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <PromptChainViewer
              title="Clean Architecture & Security Refactoring Chain"
              description={t("chain_desc_1")}
            />
            
            <PromptChainViewer
              title="Supabase RLS & PostgreSQL Strict Migration Cascade"
              description="A specialized database modeling sequence that checks schema health, generates foolproof Row Level Security policies, and outputs strict TypeScript types."
              steps={advancedChainSteps}
            />
          </div>
        </div>
      )}

      {/* Section 2: Skill Bundles */}
      {(activeTab === "all" || activeTab === "bundles") && (
        <div className="space-y-6 animate-fadeIn pt-4">
          <div className="flex items-center justify-between border-l-4 border-cyan-500 pl-4 py-1">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-fg flex items-center gap-2">
                <span>{t("tab_bundles")}</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                {locale === "uz" ? "Agentlar uchun tayyor qoidalar (.cursorrules, CLAUDE.md) va kontekst paketlari" : "Pre-packaged agent context kits combining rules (.cursorrules, CLAUDE.md), prompts, and reference code."}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>{t("verified_badge")}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            {skillBundles.length > 0 ? (
              skillBundles.map((bundle) => (
                <SkillBundleCard
                  key={bundle.id}
                  title={bundle.title}
                  description={bundle.description || ""}
                  category="Bundle"
                  author={bundle.author?.github_username || "Unknown"}
                  items={bundle.items}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-zinc-500">
                Hali hech qanday bundle yaratilmagan (No bundles found).
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

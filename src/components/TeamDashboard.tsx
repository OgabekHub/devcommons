"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Shield, Users, Settings, Plus, Lock, MoreVertical, KeyRound } from "lucide-react";

export default function TeamDashboard() {
  const t = useTranslations("Teams");
  const [activeTab, setActiveTab] = useState<"rules" | "members" | "settings">("rules");

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 bg-black/40 border border-line rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Dashboard Header */}
      <div className="border-b border-line p-6 md:p-8 bg-gradient-to-r from-[#0F172A] to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg border border-ink/20">
              <span className="text-2xl font-black text-white">AC</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-fg flex items-center gap-2">
                {t("title")}
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PRO
                </span>
              </h2>
              <p className="text-sm text-zinc-400 mt-1">{t("subtitle")}</p>
            </div>
          </div>
          <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-ink/5 hover:bg-ink/10 border border-line rounded-lg text-sm font-medium text-fg transition-colors">
            <Plus className="h-4 w-4" />
            {t("invite_btn")}
          </button>
        </div>

        {/* Tabs */}
        <div role="tablist" className="flex gap-6 mt-8 border-b border-line">
          <button
            role="tab"
            aria-selected={activeTab === "rules"}
            onClick={() => setActiveTab("rules")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "rules" ? "text-indigo-400" : "text-zinc-400 hover:text-fg"
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t("tab_rules")}
            </div>
            {activeTab === "rules" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
            )}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "members"}
            onClick={() => setActiveTab("members")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "members" ? "text-indigo-400" : "text-zinc-400 hover:text-fg"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t("tab_members")}
            </div>
            {activeTab === "members" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
            )}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "settings" ? "text-indigo-400" : "text-zinc-400 hover:text-fg"
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {t("tab_settings")}
            </div>
            {activeTab === "settings" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
            )}
          </button>
        </div>
      </div>

      {/* Dashboard Body */}
      <div className="p-6 md:p-8 min-h-[400px]">
        {activeTab === "rules" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-fg">{t("rule_card_title")}</h3>
                <p className="text-sm text-zinc-400">{t("rule_card_desc")}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium text-white transition-colors shadow-lg shadow-indigo-500/20">
                <Plus className="h-4 w-4" />
                {t("create_rule_btn")}
              </button>
            </div>

            {/* Mock Private Rule 1 */}
            <div className="group flex items-center justify-between p-4 rounded-xl border border-line bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-fg">Enterprise React Architecture</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-500">Target: .cursorrules</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                    <span className="text-xs text-zinc-500">Last updated 2 days ago</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1 text-xs text-zinc-400 font-mono bg-black/50 px-2 py-1 rounded border border-line">
                  <span className="text-indigo-400">devcommons</span> pull acme-react
                </div>
                <button className="p-2 text-zinc-400 hover:text-fg rounded-lg hover:bg-ink/10 transition-colors" aria-label="More options">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Mock Private Rule 2 */}
            <div className="group flex items-center justify-between p-4 rounded-xl border border-line bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-fg">Acme AWS CDK Deploy Protocol</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-500">Target: CLAUDE.md</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                    <span className="text-xs text-zinc-500">Last updated 1 week ago</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1 text-xs text-zinc-400 font-mono bg-black/50 px-2 py-1 rounded border border-line">
                  <span className="text-indigo-400">devcommons</span> pull acme-cdk
                </div>
                <button className="p-2 text-zinc-400 hover:text-fg rounded-lg hover:bg-ink/10 transition-colors" aria-label="More options">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="pb-3 pl-4">User</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                <tr className="hover:bg-ink/5 transition-colors">
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full bg-ink/10"
                        alt="Avatar"
                        unoptimized
                      />
                      <div>
                        <p className="text-sm font-medium text-fg">Alice (You)</p>
                        <p className="text-xs text-zinc-500">alice@acmecorp.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                      <KeyRound className="h-3 w-3" />
                      {t("member_role_owner")}
                    </span>
                  </td>
                  <td className="py-4 text-right pr-4">
                    <button className="text-zinc-500 hover:text-fg transition-colors" aria-label="Member options"><MoreVertical className="h-4 w-4 inline" /></button>
                  </td>
                </tr>
                <tr className="hover:bg-ink/5 transition-colors">
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full bg-ink/10"
                        alt="Avatar"
                        unoptimized
                      />
                      <div>
                        <p className="text-sm font-medium text-fg">Bob Builder</p>
                        <p className="text-xs text-zinc-500">bob@acmecorp.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {t("member_role_editor")}
                    </span>
                  </td>
                  <td className="py-4 text-right pr-4">
                    <button className="text-zinc-500 hover:text-fg transition-colors" aria-label="Member options"><MoreVertical className="h-4 w-4 inline" /></button>
                  </td>
                </tr>
                <tr className="hover:bg-ink/5 transition-colors">
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full bg-ink/10"
                        alt="Avatar"
                        unoptimized
                      />
                      <div>
                        <p className="text-sm font-medium text-fg">Charlie</p>
                        <p className="text-xs text-zinc-500">charlie@acmecorp.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-300 border border-zinc-500/20">
                      {t("member_role_viewer")}
                    </span>
                  </td>
                  <td className="py-4 text-right pr-4">
                    <button className="text-zinc-500 hover:text-fg transition-colors" aria-label="Member options"><MoreVertical className="h-4 w-4 inline" /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-16">
            <Settings className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-300">Workspace Settings</h3>
            <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">Only workspace owners can configure billing, API limits, and GitHub sync integrations.</p>
          </div>
        )}
      </div>
    </div>
  );
}

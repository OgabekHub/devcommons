"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { 
  Code2, 
  MessageSquare, 
  Layers, 
  Sparkles, 
  Terminal, 
  Users, 
  Trophy, 
  Rss, 
  Bookmark, 
  BarChart2, 
  BookOpen,
  X,
  ChevronRight,
  ExternalLink
} from "lucide-react";

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname() || "";
  const locale = useLocale();

  const navigationGroups = [
    {
      title: locale === "uz" ? "ASOSIY KUTUBXONA" : "LIBRARY",
      items: [
        { name: locale === "uz" ? "Snippetlar" : "Snippets", href: "/snippets", icon: Code2 },
        { name: locale === "uz" ? "AI Promptlar" : "AI Prompts", href: "/prompts", icon: MessageSquare },
        { name: locale === "uz" ? "Workflow'lar" : "Workflows", href: "/workflows", icon: Layers },
      ],
    },
    {
      title: locale === "uz" ? "VOSITALAR" : "TOOLS",
      items: [
        { name: locale === "uz" ? "Playground" : "Playground", href: "/playground", icon: Sparkles, badge: "LAB", badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
        { name: locale === "uz" ? "CLI Integratsiya" : "CLI & MCP Server", href: "/cli" as any, icon: Terminal, badge: "IDE", badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
      ],
    },
    {
      title: locale === "uz" ? "HAMJAMIYAT" : "COMMUNITY",
      items: [
        { name: locale === "uz" ? "Jamoalar" : "Team Workspaces", href: "/teams", icon: Users, badge: "NEW", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
        { name: locale === "uz" ? "Reyting" : "Leaderboard", href: "/leaderboard", icon: Trophy },
        { name: locale === "uz" ? "Lenta (Feed)" : "Activity Feed", href: "/feed", icon: Rss },
      ],
    },
    {
      title: locale === "uz" ? "SHAXSIY" : "PERSONAL",
      items: [
        { name: locale === "uz" ? "Saqlanganlar" : "Saved Items", href: "/saved", icon: Bookmark },
        { name: locale === "uz" ? "Statistika" : "Analytics", href: "/analytics", icon: BarChart2 },
      ],
    },
    {
      title: locale === "uz" ? "REсурSLAR" : "RESOURCES",
      items: [
        { name: locale === "uz" ? "Qo'llanma (Docs)" : "Documentation", href: "/docs" as any, icon: BookOpen },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 text-gray-300 select-none">
      <div className="space-y-6">
        {/* Mobile Close Button & Header */}
        <div className="flex items-center justify-between lg:hidden mb-2 px-2">
          <span className="text-sm font-bold tracking-wider text-brand uppercase">Navigation</span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {navigationGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname.includes(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-brand/15 text-white font-semibold shadow-inner shadow-brand/10 border border-brand/20"
                        : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-brand" : "text-gray-500 group-hover:text-gray-300"
                      }`} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      {("badge" in item) && (
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border ${(item as any).badgeColor}`}>
                          {(item as any).badge}
                        </span>
                      )}
                      {isActive && (
                        <div className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom info cards */}
      <div className="mt-8 space-y-3 pt-4 border-t border-white/10 px-2">
        <Link
          href={"/pricing" as any}
          className="flex items-center justify-between rounded-xl p-3 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 hover:border-indigo-500/40 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base">💎</span>
            <div>
              <p className="text-xs font-semibold text-white group-hover:text-brand transition-colors">
                {locale === "uz" ? "Pro & B2B Tariflar" : "Pro & B2B Tiers"}
              </p>
              <p className="text-[10px] text-gray-400">
                {locale === "uz" ? "Jamoa uchun yuklash" : "Upgrade your workspace"}
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-500 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <a
          href="https://github.com/OgabekHub/devcommons"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between text-xs text-gray-500 hover:text-gray-300 transition-colors px-1"
        >
          <span>GitHub Open Source</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar - Fixed width */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0 border-r border-white/10 bg-[#0B0B0B]/80 backdrop-blur-2xl h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto custom-scrollbar">
        {sidebarContent}
      </aside>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* Mobile slide-over drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0C0C0C] border-r border-white/10 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto custom-scrollbar ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

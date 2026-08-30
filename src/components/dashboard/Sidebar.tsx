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
  ExternalLink,
  Gem,
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
      title: locale === "uz" ? "KUTUBXONA" : "LIBRARY",
      items: [
        { name: locale === "uz" ? "Snippetlar" : "Snippets",     href: "/snippets",  icon: Code2 },
        { name: locale === "uz" ? "AI Promptlar" : "AI Prompts", href: "/prompts",   icon: MessageSquare },
        { name: locale === "uz" ? "Workflowlar" : "Workflows",   href: "/workflows", icon: Layers },
      ],
    },
    {
      title: locale === "uz" ? "VOSITALAR" : "TOOLS",
      items: [
        { name: locale === "uz" ? "Playground" : "Playground",          href: "/playground", icon: Sparkles, badge: "LAB" },
        { name: locale === "uz" ? "CLI & MCP Server" : "CLI & MCP Server", href: "/cli" as any, icon: Terminal, badge: "IDE" },
      ],
    },
    {
      title: locale === "uz" ? "HAMJAMIYAT" : "COMMUNITY",
      items: [
        { name: locale === "uz" ? "Jamoalar" : "Team Workspaces", href: "/teams",       icon: Users,    badge: "NEW" },
        { name: locale === "uz" ? "Reyting" : "Leaderboard",      href: "/leaderboard", icon: Trophy },
        { name: locale === "uz" ? "Lenta" : "Activity Feed",       href: "/feed",        icon: Rss },
      ],
    },
    {
      title: locale === "uz" ? "SHAXSIY" : "PERSONAL",
      items: [
        { name: locale === "uz" ? "Saqlanganlar" : "Saved Items", href: "/saved",     icon: Bookmark },
        { name: locale === "uz" ? "Statistika" : "Analytics",     href: "/analytics", icon: BarChart2 },
      ],
    },
    {
      title: locale === "uz" ? "RESURSLAR" : "RESOURCES",
      items: [
        { name: locale === "uz" ? "Qollanma" : "Documentation", href: "/docs" as any, icon: BookOpen },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-3 text-zinc-400 select-none">
      <div className="space-y-5">
        {/* Mobile header */}
        <div className="flex items-center justify-between lg:hidden mb-1 px-2">
          <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">Menu</span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-ink/6 hover:text-fg transition-colors"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {navigationGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-0.5">
            <p className="px-3 pb-1.5 text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">
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
                    className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 border ${
                      isActive
                        ? "bg-ink/6 text-fg border-line"
                        : "border-transparent text-zinc-500 hover:bg-ink/4 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? "text-brand" : "text-zinc-600 group-hover:text-zinc-400"
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {"badge" in item && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-ink/6 text-zinc-500 border border-line">
                          {(item as any).badge}
                        </span>
                      )}
                      {isActive && (
                        <div className="h-1.5 w-1.5 rounded-full bg-brand" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom cards */}
      <div className="mt-6 space-y-2 pt-4 border-t border-line px-1">
        <Link
          href={"/pricing" as any}
          className="flex items-center justify-between rounded-lg p-3 bg-ink/3 border border-line hover:bg-ink/5 hover:border-line-strong transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Gem className="h-4 w-4 text-brand" />
            <div>
              <p className="text-xs font-semibold text-zinc-300 group-hover:text-fg transition-colors">
                {locale === "uz" ? "Pro & B2B Tariflar" : "Pro & B2B Tiers"}
              </p>
              <p className="text-[10px] text-zinc-600">
                {locale === "uz" ? "Jamoa uchun yuklash" : "Upgrade your workspace"}
              </p>
            </div>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <a
          href="https://github.com/OgabekHub/devcommons"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors px-1"
        >
          <span>GitHub Open Source</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 xl:w-64 shrink-0 border-r border-line bg-surface-subtle overflow-y-auto custom-scrollbar">
        {sidebarContent}
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-surface-subtle border-r border-line shadow-overlay transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto custom-scrollbar ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

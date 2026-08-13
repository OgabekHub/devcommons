"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, LogOut, User, BarChart2, Bookmark, Rss, Trophy, Tag } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { createSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Image from "next/image";

const LanguageSwitcher = dynamic(() => import("@/components/LanguageSwitcher"), { ssr: true });
const NotificationsBell = dynamic(() => import("@/components/NotificationsBell"), { ssr: false });
const Logo = dynamic(() => import("@/components/Logo"), { ssr: true });
const GlobalSearch = dynamic(() => import("@/components/GlobalSearch"), { ssr: true });

interface TopbarProps {
  onOpenMobileMenu?: () => void;
}

export default function Topbar({ onOpenMobileMenu }: TopbarProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const t = useTranslations("Header");
  const locale = useLocale();
  const supabase = isSupabaseConfigured ? createSupabaseBrowser() : null;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setDropdownOpen(false);
    window.location.href = `/${locale}`;
  };

  const avatarUrl = user?.user_metadata?.avatar_url;
  const username = user?.user_metadata?.user_name || user?.user_metadata?.name;

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-white/10 bg-[#0B0B0B]/90 backdrop-blur-2xl px-4 md:px-6 flex items-center justify-between shadow-sm">
      {/* Left side: Logo + Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-xl border border-white/10 p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Open Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/" className="group flex items-center gap-2 transition-all hover:opacity-90">
          <div className="relative h-10 w-10 shrink-0">
            <Logo className="h-10 w-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white hidden sm:inline-block">
            Dev<span className="text-brand">Commons</span>
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hidden md:inline-block font-mono">
            APP
          </span>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl mx-4 flex items-center justify-end md:justify-center">
        <div className="w-full max-w-md">
          <GlobalSearch />
        </div>
      </div>

      {/* Right side: Language, Notifications, User */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>

        {user ? (
          <div className="flex items-center gap-2">
            <NotificationsBell />
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-2.5 py-1.5 text-sm font-medium text-gray-300 transition-colors duration-200 hover:border-brand/40 hover:bg-white/5 focus:outline-none"
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={username ?? ""}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full ring-1 ring-white/10"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/20 text-brand font-semibold text-xs">
                    {username?.[0]?.toUpperCase() ?? <User className="h-3.5 w-3.5" />}
                  </div>
                )}
                <span className="max-w-[100px] truncate hidden xl:inline-block text-xs font-semibold">{username}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fadeIn">
                  <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={username ?? ""}
                        width={38}
                        height={38}
                        className="h-9 w-9 rounded-full ring-2 ring-brand/30"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white font-bold text-sm">
                        {username?.[0]?.toUpperCase() ?? "U"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{username}</p>
                      <p className="truncate text-xs text-gray-400">{user?.email}</p>
                    </div>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    {([
                      { href: "/profile", label: t("profile"), icon: User },
                      { href: "/saved", label: t("saved"), icon: Bookmark },
                      { href: "/feed", label: t("feed"), icon: Rss },
                      { href: "/analytics", label: t("analytics"), icon: BarChart2 },
                      { href: "/leaderboard", label: t("leaderboard", { fallback: "Leaderboard" }), icon: Trophy },
                      { href: "/tags", label: t("tags"), icon: Tag },
                    ] as const).map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href as any}
                        onClick={() => setDropdownOpen(false)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white group"
                      >
                        <span>{label}</span>
                        <Icon className="h-3.5 w-3.5 shrink-0 text-gray-500 group-hover:text-gray-300" />
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-white/10 p-1.5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 group"
                    >
                      <span>{t("logout")}</span>
                      <LogOut className="h-3.5 w-3.5 shrink-0 text-red-400/60 group-hover:text-red-300" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link
            href="/auth"
            className="rounded-xl bg-gradient-to-r from-brand to-indigo-600 px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-brand/20 transition-all hover:opacity-95"
          >
            {t("login")}
          </Link>
        )}
      </div>
    </header>
  );
}

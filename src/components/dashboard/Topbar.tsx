"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, LogOut, User, BarChart2, Bookmark, Rss, Trophy, Tag } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { createSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Image from "next/image";

const LanguageSwitcher = dynamic(() => import("@/components/LanguageSwitcher"), { ssr: true });
const NotificationsBell = dynamic(() => import("@/components/NotificationsBell"), { ssr: false });
const ThemeToggle = dynamic(() => import("@/components/ThemeToggle"), { ssr: false });
const Logo = dynamic(() => import("@/components/Logo"), { ssr: true });
const GlobalSearch = dynamic(() => import("@/components/GlobalSearch"), { ssr: true });

interface TopbarProps {
  onOpenMobileMenu?: () => void;
}

export default function Topbar({ onOpenMobileMenu }: TopbarProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const t = useTranslations("Header");
  const router = useRouter();
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
    router.push("/");
    router.refresh(); // server komponentlardagi sessiya holatini yangilash
  };

  const avatarUrl = user?.user_metadata?.avatar_url;
  const username = user?.user_metadata?.user_name || user?.user_metadata?.name;

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-line bg-surface/95 backdrop-blur-2xl px-4 md:px-6 flex items-center justify-between">
      {/* Left side: Logo + Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg border border-line p-2 text-zinc-500 transition-colors hover:bg-ink/6 hover:text-fg lg:hidden"
          aria-label="Open Sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Link href="/" className="group flex items-center gap-2 transition-opacity hover:opacity-85">
          <div className="relative h-9 w-9 shrink-0">
            <Logo className="h-9 w-9" />
          </div>
          <span className="text-base font-bold tracking-tight text-fg hidden sm:inline-block">
            Dev<span className="text-brand">Commons</span>
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-ink/5 border border-line text-zinc-500 hidden md:inline-block font-mono">
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
        <div className="hidden sm:flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        {user ? (
          <div className="flex items-center gap-2">
            <NotificationsBell />
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-line px-2 py-1.5 text-sm font-medium text-zinc-400 transition-colors duration-200 hover:border-line-strong hover:bg-ink/5 hover:text-fg focus:outline-none"
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={username ?? ""}
                    width={32}
                    height={32}
                    className="h-7 w-7 rounded-full ring-1 ring-ink/10"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/8 text-zinc-300 font-semibold text-xs">
                    {username?.[0]?.toUpperCase() ?? <User className="h-3.5 w-3.5" />}
                  </div>
                )}
                <span className="max-w-[100px] truncate hidden xl:inline-block text-xs font-medium">{username}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-line bg-surface-subtle shadow-overlay backdrop-blur-xl animate-fadeIn">
                  <div className="flex items-center gap-3 px-3 py-3 border-b border-line">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={username ?? ""}
                        width={34}
                        height={34}
                        className="h-8 w-8 rounded-full ring-1 ring-ink/10"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/8 text-fg font-bold text-sm">
                        {username?.[0]?.toUpperCase() ?? "U"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-fg">{username}</p>
                      <p className="truncate text-[11px] text-zinc-500">{user?.email}</p>
                    </div>
                  </div>

                  <div className="p-1 space-y-0.5">
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
                        className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-ink/5 hover:text-fg group"
                      >
                        <span>{label}</span>
                        <Icon className="h-3 w-3 shrink-0 text-zinc-600 group-hover:text-zinc-400" />
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-line p-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium text-red-400/80 transition-colors hover:bg-red-500/8 hover:text-red-400 group"
                    >
                      <span>{t("logout")}</span>
                      <LogOut className="h-3 w-3 shrink-0 text-red-400/40 group-hover:text-red-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link
            href="/auth"
            className="btn-primary btn-primary--sm"
          >
            {t("login")}
          </Link>
        )}
      </div>
    </header>
  );
}

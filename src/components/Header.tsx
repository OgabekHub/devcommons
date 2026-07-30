"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut, User, BarChart2, Bookmark, Rss, Trophy, Tag } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import dynamic from 'next/dynamic';
import { createSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Image from "next/image";

// Lazy load heavy components
const LanguageSwitcher = dynamic(() => import('@/components/LanguageSwitcher'), { ssr: true });
const NotificationsBell = dynamic(() => import('@/components/NotificationsBell'), { ssr: false });
const Logo = dynamic(() => import('@/components/Logo'), { ssr: true });
const GlobalSearch = dynamic(() => import('@/components/GlobalSearch'), { ssr: true });

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const t = useTranslations("Header");
  const locale = useLocale();
  const supabase = isSupabaseConfigured ? createSupabaseBrowser() : null;

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

    // Foydalanuvchi holatini olish
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Auth o'zgarganda yangilash
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
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0A]/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 md:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-1 transition-all hover:opacity-90">
          <div className="relative h-16 w-16 shrink-0">
            <Logo className="h-16 w-16 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Dev<span className="text-brand">Commons</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" role="navigation" aria-label="Main navigation">
          <GlobalSearch />
          <div className="mx-2 h-5 w-px bg-white/10" aria-hidden="true" />
          <Link
            id="tour-snippets"
            href="/snippets"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
            aria-label="View code snippets"
          >
            {t("snippets")}
          </Link>
          <Link
            id="tour-prompts"
            href="/prompts"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
            aria-label="View AI prompts"
          >
            {t("prompts")}
          </Link>
          <div className="mx-2 h-5 w-px bg-white/10" aria-hidden="true" />
          <LanguageSwitcher />

          {/* Auth section */}
          {user ? (
            <div className="flex items-center gap-2">
              <NotificationsBell />
              <div id="tour-profile" className="relative" ref={dropdownRef}>
                {/* Trigger button */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors duration-200 hover:border-brand/40 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={username ?? ""}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full ring-1 ring-white/10"
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/20 text-brand">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{username}</span>
                </button>

                {/* Dropdown — Vercel style */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                    role="menu"
                    aria-label="User menu"
                  >
                    {/* User info block */}
                    <div className="flex items-center gap-3 px-4 py-4 border-b border-white/8">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={username ?? ""}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full ring-2 ring-brand/30"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white font-bold text-sm">
                          {username?.[0]?.toUpperCase() ?? "U"}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">{username}</p>
                        <p className="truncate text-xs text-gray-400">{user?.email}</p>
                      </div>
                    </div>

                    {/* Nav links — icon on RIGHT (Vercel style) */}
                    <div className="p-1.5">
                      {([
                        { href: "/profile",    label: t("profile"),                      icon: User },
                        { href: "/saved",      label: t("saved"),                        icon: Bookmark },
                        { href: "/feed",       label: t("feed"),                         icon: Rss },
                        { href: "/analytics", label: t("analytics"),                    icon: BarChart2 },
                        { href: "/leaderboard",label: t("leaderboard", { fallback: "Leaderboard" }), icon: Trophy },
                        { href: "/tags",       label: t("tags"),                         icon: Tag },
                      ] as const).map(({ href, label, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href as any}
                          onClick={() => setDropdownOpen(false)}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/6 hover:text-white group"
                          role="menuitem"
                        >
                          <span>{label}</span>
                          <Icon className="h-4 w-4 shrink-0 text-gray-500 group-hover:text-gray-300 transition-colors" />
                        </Link>
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-white/8 p-1.5">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/8 hover:text-red-300 group"
                        role="menuitem"
                      >
                        <span>{t("logout")}</span>
                        <LogOut className="h-4 w-4 shrink-0 text-red-400/60 group-hover:text-red-300 transition-colors" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              id="tour-profile"
              href="/auth"
              className="ml-2 rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-brand-dark hover:shadow-brand "
            >
              {t("login")}
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/10"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      <div
        className={`overflow-hidden border-t border-white/5 bg-[#0A0A0A]/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 border-none"
        }`}
      >
        <div className="space-y-1 px-4 py-4">
          <Link
            href="/snippets"
            className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            {t("snippets")}
          </Link>
          <Link
            href="/prompts"
            className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            {t("prompts")}
          </Link>

          {user ? (
            <>
              <Link
                href="/saved"
                className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {t("saved")}
              </Link>
              <Link
                href="/feed"
                className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {t("feed")}
              </Link>
              <Link
                href="/analytics"
                className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {t("analytics")}
              </Link>
              <Link
                href="/tags"
                className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {t("tags")}
              </Link>

              <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={username}
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5 text-gray-500" />
                )}
                <span className="text-sm font-medium">{username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                {t("logout")}
              </button>
            </div>
            </>
          ) : (
            <Link
              href="/auth"
              className="mt-2 block rounded-xl bg-brand px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-brand-dark"
              onClick={() => setMobileOpen(false)}
            >
              {t("login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Code2, Menu, X, LogOut, User } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NotificationsBell from "@/components/NotificationsBell";
import { createSupabaseBrowser } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Logo from "@/components/Logo";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const t = useTranslations("Header");
  const locale = useLocale();
  const supabase = createSupabaseBrowser();

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
    // Foydalanuvchi holatini olish
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Auth o'zgarganda yangilash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
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
          <Logo className="h-16 w-16 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
          <span className="text-xl font-bold tracking-tight text-white">
            Dev<span className="text-brand">Commons</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            id="tour-snippets"
            href="/snippets"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white"
          >
            {t("snippets")}
          </Link>
          <Link
            id="tour-prompts"
            href="/prompts"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/5 hover:text-white"
          >
            {t("prompts")}
          </Link>
          <div className="mx-2 h-5 w-px bg-white/10" />
          <LanguageSwitcher />

          {/* Auth section */}
          {user ? (
            <div className="flex items-center gap-2">
              <NotificationsBell />
              <div id="tour-profile" className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-1.5 text-sm font-medium text-gray-300 transition-all hover:border-brand/30 hover:bg-white/5"
                >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={username} className="h-6 w-6 rounded-full" />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="max-w-[100px] truncate">{username}</span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-[#111111] p-1 shadow-lg">
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <User className="h-4 w-4" />
                    {t("profile")}
                  </Link>
                  <Link
                    href="/saved"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {t("saved")}
                  </Link>
                  <Link
                    href="/feed"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {t("feed")}
                  </Link>
                  <Link
                    href="/analytics"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {t("analytics")}
                  </Link>
                  <Link
                    href="/tags"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {t("tags")}
                  </Link>
                  <div className="my-1 border-t border-white/10" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("logout")}
                  </button>
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
        </div>

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
                  <img src={avatarUrl} alt={username} className="h-7 w-7 rounded-full" />
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

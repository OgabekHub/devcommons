"use client";

import { useState, useEffect } from "react";
import { Code2, Menu, X, LogOut, User } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { createSupabaseBrowser } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const t = useTranslations("Header");
  const locale = useLocale();
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
          ? "border-b border-gray-100/50 bg-white/80 shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 md:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5 transition-all">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-brand">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Dev<span className="text-brand">Commons</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="/snippets"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-brand-50 hover:text-brand"
          >
            {t("snippets")}
          </Link>
          <Link
            href="/prompts"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-brand-50 hover:text-brand"
          >
            {t("prompts")}
          </Link>
          <div className="mx-2 h-5 w-px bg-gray-200" />
          <LanguageSwitcher />

          {/* Auth section */}
          {user ? (
            <div className="relative ml-2">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-brand/30 hover:bg-brand-50"
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
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-gray-100 bg-white p-1 shadow-lg">
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <User className="h-4 w-4" />
                    {t("profile")}
                  </Link>
                  <Link
                    href="/saved"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Saved
                  </Link>
                  <Link
                    href="/feed"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Feed
                  </Link>
                  <Link
                    href="/analytics"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Analytics
                  </Link>
                  <Link
                    href="/tags"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Tags
                  </Link>
                  <div className="my-1 border-t border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="ml-2 rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-brand-dark hover:shadow-brand hover:-translate-y-0.5"
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
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      <div
        className={`overflow-hidden border-t border-gray-100/50 bg-white/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0 border-none"
        }`}
      >
        <div className="space-y-1 px-4 py-4">
          <Link
            href="/snippets"
            className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand"
            onClick={() => setMobileOpen(false)}
          >
            {t("snippets")}
          </Link>
          <Link
            href="/prompts"
            className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand"
            onClick={() => setMobileOpen(false)}
          >
            {t("prompts")}
          </Link>

          {user ? (
            <div className="mt-2 flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 hover:text-brand transition-colors"
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
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                {t("logout")}
              </button>
            </div>
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

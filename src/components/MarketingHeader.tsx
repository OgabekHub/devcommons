"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { createSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { ArrowRight, Menu, X, Terminal, CreditCard } from "lucide-react";

const LanguageSwitcher = dynamic(() => import("@/components/LanguageSwitcher"), { ssr: true });
const ThemeToggle = dynamic(() => import("@/components/ThemeToggle"), { ssr: false });
const Logo = dynamic(() => import("@/components/Logo"), { ssr: true });

export default function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const t = useTranslations("Header");
  const supabase = isSupabaseConfigured ? createSupabaseBrowser() : null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-surface/80 backdrop-blur-xl border-line"
          : "bg-transparent border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 md:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-1 transition-all hover:opacity-90">
          <div className="relative h-12 w-12 shrink-0 md:h-14 md:w-14">
            <Logo className="h-12 w-12 md:h-14 md:w-14 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight text-fg">
            Dev<span className="text-brand">Commons</span>
          </span>
        </Link>

        {/* Minimalist Desktop Nav */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/snippets"
            className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-300 transition-all duration-200 hover:bg-ink/5 hover:text-fg"
          >
            {t("library")}
          </Link>
          <Link
            href={"/cli" as any}
            className="group flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-sm font-medium text-cyan-400 transition-all duration-200 hover:border-cyan-400 hover:bg-cyan-500/20"
          >
            <Terminal className="h-4 w-4" />
            <span>{t("cli")}</span>
          </Link>
          <Link
            href={"/pricing" as any}
            className="group flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-sm font-medium text-emerald-400 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-500/20"
          >
            <CreditCard className="h-4 w-4" />
            <span>{t("pricing")}</span>
          </Link>
          <div className="mx-2 h-5 w-px bg-ink/10" aria-hidden="true" />
          <ThemeToggle />
          <LanguageSwitcher />

          {/* Action Button: Dashboard or Login */}
          {user ? (
            <Link
              href="/snippets"
              className="btn-primary btn-primary--sm group gap-2"
            >
              <span>{t("dashboard")}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 rounded-xl border border-line bg-ink/5 px-5 py-2 text-sm font-semibold text-fg backdrop-blur-lg transition-all hover:border-brand/50 hover:bg-ink/10"
            >
              <span>{t("login")}</span>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-xl border border-line p-2 text-zinc-300 hover:bg-ink/5 hover:text-fg focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav dropdown */}
      {mobileOpen && (
        <div className="border-t border-line bg-surface-subtle px-4 py-6 md:hidden shadow-2xl backdrop-blur-2xl animate-fadeIn">
          <div className="flex flex-col gap-3">
            <Link
              href="/snippets"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium text-zinc-200 hover:bg-ink/5"
            >
              {t("library")}
            </Link>
            <Link
              href={"/cli" as any}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-cyan-400 hover:bg-ink/5"
            >
              <Terminal className="h-4 w-4" />
              <span>{t("cli")}</span>
            </Link>
            <Link
              href={"/pricing" as any}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-emerald-400 hover:bg-ink/5"
            >
              <CreditCard className="h-4 w-4" />
              <span>{t("pricing")}</span>
            </Link>
            <div className="my-2 h-px w-full bg-ink/10" />
            {user ? (
              <Link
                href="/snippets"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full"
              >
                <span>{t("dashboard")}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-line bg-ink/5 px-5 py-3 text-base font-semibold text-fg"
              >
                <span>{t("login")}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

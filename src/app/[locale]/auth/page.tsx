"use client";

import { Github, ArrowLeft, Shield, Trash2, Mail } from "lucide-react";
import Logo from "@/components/Logo";
import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Auth");
  const locale = useLocale();
  const supabase = createSupabaseBrowser();

  const handleGitHubLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Login xatosi:", error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Back link */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4 transition-transform " />
          {t("back_home")}
        </Link>

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-8 flex justify-center animate-scale-in">
            <Logo className="h-24 w-24" />
          </div>
          <h1 className="animate-fade-in-up text-2xl font-bold sm:text-3xl">
            {t("title")}
          </h1>
          <p className="animate-fade-in-up mt-3 text-gray-500" style={{ animationDelay: "0.1s" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* Login Card */}
        <div className="animate-fade-in-up card p-8" style={{ animationDelay: "0.2s" }}>
          <button
            type="button"
            onClick={handleGitHubLogin}
            disabled={loading}
            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gray-900 px-6 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-gray-800 hover:shadow-xl   disabled:opacity-70 disabled:cursor-not-allowed "
          >
            {loading ? (
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Github className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            )}
            {loading ? "Yo'naltirilmoqda..." : t("login_github")}
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#111111] px-4 text-xs font-medium text-gray-400">
                {t("or")}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/5 p-4">
            <p className="text-center text-sm text-gray-500">
              {t("no_login_desc")}
            </p>
            <div className="mt-3 flex gap-2">
              <Link href="/snippets" className="btn-secondary flex-1 py-2.5 text-sm">
                {t("btn_snippets")}
              </Link>
              <Link href="/prompts" className="btn-secondary flex-1 py-2.5 text-sm">
                {t("btn_prompts")}
              </Link>
            </div>
          </div>
        </div>

        {/* Trust points */}
        <div className="animate-fade-in grid grid-cols-3 gap-3" style={{ animationDelay: "0.35s" }}>
          <div className="rounded-xl border border-white/5 bg-[#111111] p-3 text-center transition-all duration-200 hover:border-brand/20 hover:shadow-sm hover:bg-white/5">
            <Shield className="mx-auto mb-1.5 h-4 w-4 text-brand" />
            <span className="text-[11px] font-medium text-gray-500">
              {t("trust_oauth")}
            </span>
          </div>
          <div className="rounded-xl border border-white/5 bg-[#111111] p-3 text-center transition-all duration-200 hover:border-brand/20 hover:shadow-sm hover:bg-white/5">
            <Mail className="mx-auto mb-1.5 h-4 w-4 text-brand" />
            <span className="text-[11px] font-medium text-gray-500">
              {t("trust_no_email")}
            </span>
          </div>
          <div className="rounded-xl border border-white/5 bg-[#111111] p-3 text-center transition-all duration-200 hover:border-brand/20 hover:shadow-sm hover:bg-white/5">
            <Trash2 className="mx-auto mb-1.5 h-4 w-4 text-brand" />
            <span className="text-[11px] font-medium text-gray-500">
              {t("trust_delete")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

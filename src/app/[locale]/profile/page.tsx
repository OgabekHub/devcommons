"use client";

import { useState, useEffect } from "react";
import { User, Code2, Sparkles, LogOut, Github } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function ProfilePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [snippets, setSnippets] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"snippets" | "prompts">("snippets");
  const t = useTranslations("Profile");
  const locale = useLocale();
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = `/${locale}/auth`;
        return;
      }
      setUser(user);

      // Foydalanuvchi snippet va promptlarini olish
      const [{ data: snips }, { data: proms }] = await Promise.all([
        supabase.from("snippets").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("prompts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      setSnippets(snips ?? []);
      setPrompts(proms ?? []);
      setLoading(false);
    };

    load();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = `/${locale}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url;
  const username = user.user_metadata?.user_name || user.user_metadata?.name;
  const email = user.email;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Profile Card */}
      <div className="card flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left">
        <div className="relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="h-20 w-20 rounded-2xl shadow-md"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50">
              <User className="h-10 w-10 text-brand" />
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 rounded-lg bg-gray-900 p-1">
            <Github className="h-4 w-4 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{username}</h1>
          {email && <p className="text-sm text-gray-500">{email}</p>}
          <div className="mt-3 flex flex-wrap justify-center gap-3 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1 text-sm font-medium text-brand">
              <Code2 className="h-3.5 w-3.5" />
              {snippets.length} {t("snippets_count")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1 text-sm font-medium text-violet-600">
              <Sparkles className="h-3.5 w-3.5" />
              {prompts.length} {t("prompts_count")}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl border border-red-100 px-4 py-2 text-sm font-medium text-red-500 transition-all hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100">
        <button
          onClick={() => setTab("snippets")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "snippets"
              ? "border-brand text-brand"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Code2 className="h-4 w-4" />
          {t("tab_snippets")} ({snippets.length})
        </button>
        <button
          onClick={() => setTab("prompts")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "prompts"
              ? "border-brand text-brand"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          {t("tab_prompts")} ({prompts.length})
        </button>
      </div>

      {/* Content */}
      {tab === "snippets" && (
        <div>
          {snippets.length === 0 ? (
            <div className="card border-dashed p-10 text-center">
              <Code2 className="mx-auto mb-3 h-8 w-8 text-gray-300" />
              <p className="text-gray-500">{t("no_snippets")}</p>
              <Link href="/snippets/new" className="btn-primary mt-4">
                {t("btn_add_snippet")}
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {snippets.map((s) => (
                <Link
                  key={s.id}
                  href={`/snippets/${s.id}` as any}
                  className="card card-shine group block"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-semibold transition-colors group-hover:text-brand">{s.title}</h3>
                    <span className="ml-2 rounded-lg bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand">{s.language}</span>
                  </div>
                  {s.description && <p className="text-sm text-gray-500 line-clamp-2">{s.description}</p>}
                  <p className="mt-2 text-xs text-gray-400">👍 {s.votes} · {new Date(s.created_at).toLocaleDateString("uz-UZ")}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "prompts" && (
        <div>
          {prompts.length === 0 ? (
            <div className="card border-dashed p-10 text-center">
              <Sparkles className="mx-auto mb-3 h-8 w-8 text-gray-300" />
              <p className="text-gray-500">{t("no_prompts")}</p>
              <Link href="/prompts/new" className="btn-primary mt-4">
                {t("btn_add_prompt")}
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {prompts.map((p) => (
                <Link
                  key={p.id}
                  href={`/prompts/${p.id}` as any}
                  className="card card-shine group block"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-semibold transition-colors group-hover:text-brand">{p.title}</h3>
                    <span className="ml-2 rounded-lg bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-600">{p.category}</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{p.content}</p>
                  <p className="mt-2 text-xs text-gray-400">👍 {p.votes} · {new Date(p.created_at).toLocaleDateString("uz-UZ")}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

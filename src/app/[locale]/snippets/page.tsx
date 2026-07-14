import { Code2, Plus, Search, Filter } from "lucide-react";
import { isSupabaseConfigured, supabaseServer } from "@/lib/supabase";
import type { Snippet } from "@/types/database";
import Reveal from "@/components/Reveal";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "Snippets" });
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function SnippetsPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("Snippets");
  let snippets: Snippet[] = [];
  let error: string | null = null;

  if (isSupabaseConfigured) {
    try {
      const supabase = supabaseServer();
      const { data, error: dbError } = await supabase
        .from("snippets")
        .select("*")
        .order("created_at", { ascending: false })
        .returns<Snippet[]>();

      if (dbError) {
        error = dbError.message;
      } else {
        snippets = data ?? [];
      }
    } catch (e) {
      error = e instanceof Error ? e.message : "Noma'lum xato yuz berdi";
    }
  } else {
    error = "supabase_not_configured";
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Reveal>
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand">
              <Code2 className="h-3.5 w-3.5" />
              {t("badge")}
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-2 text-gray-500">
              {t("subtitle")}
            </p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <a
            href={`/${locale}/snippets/new`}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" />
            {t("btn_add")}
          </a>
        </Reveal>
      </div>

      {/* Search & Filters */}
      <Reveal delay={150}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t("search_placeholder")}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <button className="btn-ghost gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm">
            <Filter className="h-4 w-4" />
            {t("filter")}
          </button>
        </div>
      </Reveal>

      {/* Supabase sozlanmagan */}
      {error === "supabase_not_configured" && (
        <Reveal>
          <div className="card border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-10 text-center hover:border-amber-200">
            <div className="mx-auto mb-5 inline-flex rounded-2xl bg-amber-100 p-4">
              <Code2 className="h-7 w-7 text-amber-600" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-amber-800">
              {t("supabase_error_title")}
            </h2>
            <p className="mx-auto max-w-md text-sm text-amber-600">
              {t("supabase_error_desc1")}{" "}
              <code className="rounded-lg bg-amber-100 px-2 py-0.5 font-mono text-xs">
                .env.local
              </code>{" "}
              {t("supabase_error_desc2")}
            </p>
          </div>
        </Reveal>
      )}

      {/* DB xatosi */}
      {error && error !== "supabase_not_configured" && (
        <Reveal>
          <div className="card border-red-200 bg-gradient-to-br from-red-50 to-rose-50 p-10 text-center hover:border-red-200">
            <h2 className="mb-2 text-xl font-bold text-red-800">Xato</h2>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </Reveal>
      )}

      {/* Bo'sh holat */}
      {!error && snippets.length === 0 && (
        <Reveal>
          <div className="card border-dashed bg-gradient-to-br from-gray-50 to-white p-14 text-center">
            <div className="mx-auto mb-5 inline-flex rounded-2xl bg-brand-50 p-4 animate-float">
              <Code2 className="h-7 w-7 text-brand" />
            </div>
            <h2 className="mb-2 text-xl font-bold">
              Hozircha snippet yo&apos;q
            </h2>
            <p className="mx-auto max-w-sm text-sm text-gray-500">
              Birinchi bo&apos;lib snippet qo&apos;shing va community&apos;ga hissa qo&apos;shing!
            </p>
            <a
              href="#"
              className="btn-primary mt-6"
            >
              <Plus className="h-4 w-4" />
              Birinchi snippet qo&apos;shish
            </a>
          </div>
        </Reveal>
      )}

      {/* Snippet'lar ro'yxati */}
      {snippets.length > 0 && (
        <Reveal stagger>
          <div className="grid gap-4 sm:grid-cols-2">
            {snippets.map((snippet) => (
              <div
                key={snippet.id}
                className="card card-shine group cursor-pointer"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h2 className="font-bold leading-snug transition-colors group-hover:text-brand">
                    {snippet.title}
                  </h2>
                  <span className="ml-2 flex-shrink-0 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand">
                    {snippet.language}
                  </span>
                </div>
                {snippet.description && (
                  <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                    {snippet.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    👍 {snippet.votes}
                  </span>
                  <span>
                    {new Date(snippet.created_at).toLocaleDateString("uz-UZ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}

import { Sparkles, Plus, Search, Filter } from "lucide-react";
import { isSupabaseConfigured, supabaseServer } from "@/lib/supabase";
import type { Prompt } from "@/types/database";
import Reveal from "@/components/Reveal";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "Prompts" });
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function PromptsPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("Prompts");
  let prompts: Prompt[] = [];
  let error: string | null = null;

  if (isSupabaseConfigured) {
    try {
      const supabase = supabaseServer();
      const { data, error: dbError } = await supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending: false })
        .returns<Prompt[]>();

      if (dbError) {
        error = dbError.message;
      } else {
        prompts = data ?? [];
      }
    } catch (e) {
      error = e instanceof Error ? e.message : "Noma'lum xato yuz berdi";
    }
  } else {
    error = "supabase_not_configured";
  }

  const categoryStyles: Record<string, string> = {
    coding: "bg-blue-50 text-blue-600",
    writing: "bg-emerald-50 text-emerald-600",
    analysis: "bg-purple-50 text-purple-600",
    creative: "bg-pink-50 text-pink-600",
    default: "bg-gray-50 text-gray-600",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Reveal>
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
              <Sparkles className="h-3.5 w-3.5" />
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
            href={`/${locale}/prompts/new`}
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
          <div className="flex gap-2">
            {[t("cat_all"), "Coding", "Writing", "Creative"].map((cat) => (
              <button
                key={cat}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  cat === t("cat_all")
                    ? "bg-brand text-white shadow-sm"
                    : "border border-gray-200 text-gray-600 hover:border-brand/30 hover:text-brand"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Supabase sozlanmagan */}
      {error === "supabase_not_configured" && (
        <Reveal>
          <div className="card border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-10 text-center hover:border-amber-200">
            <div className="mx-auto mb-5 inline-flex rounded-2xl bg-amber-100 p-4">
              <Sparkles className="h-7 w-7 text-amber-600" />
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
      {!error && prompts.length === 0 && (
        <Reveal>
          <div className="card border-dashed bg-gradient-to-br from-purple-50/50 to-white p-14 text-center">
            <div className="mx-auto mb-5 inline-flex rounded-2xl bg-purple-50 p-4 animate-float">
              <Sparkles className="h-7 w-7 text-purple-500" />
            </div>
            <h2 className="mb-2 text-xl font-bold">
              Hozircha prompt yo&apos;q
            </h2>
            <p className="mx-auto max-w-sm text-sm text-gray-500">
              Birinchi bo&apos;lib AI prompt qo&apos;shing — community baholaydi!
            </p>
            <a
              href="#"
              className="btn-primary mt-6"
            >
              <Plus className="h-4 w-4" />
              Birinchi prompt qo&apos;shish
            </a>
          </div>
        </Reveal>
      )}

      {/* Prompt'lar ro'yxati */}
      {prompts.length > 0 && (
        <Reveal stagger>
          <div className="grid gap-4 sm:grid-cols-2">
            {prompts.map((prompt) => (
              <div
                key={prompt.id}
                className="card card-shine group cursor-pointer"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h2 className="font-bold leading-snug transition-colors group-hover:text-brand">
                    {prompt.title}
                  </h2>
                  <span
                    className={`ml-2 flex-shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                      categoryStyles[prompt.category] || categoryStyles.default
                    }`}
                  >
                    {prompt.category}
                  </span>
                </div>
                <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-500">
                  {prompt.content}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    👍 {prompt.votes}
                  </span>
                  <span>
                    {new Date(prompt.created_at).toLocaleDateString("uz-UZ")}
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

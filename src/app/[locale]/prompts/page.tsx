import { isSupabaseConfigured, createSupabaseServer } from "@/lib/supabase-server";
import type { Prompt } from "@/types/database";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PromptsClient from "@/components/PromptsClient";
import { Sparkles } from "lucide-react";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "Prompts" });
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function PromptsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations("Prompts");
  let prompts: Prompt[] = [];
  let error: string | null = null;

  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServer();
      const { data, error: dbError } = await supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending: false })
        .returns<Prompt[]>();

      if (dbError) error = dbError.message;
      else prompts = data ?? [];
    } catch (e) {
      error = e instanceof Error ? e.message : "Noma'lum xato yuz berdi";
    }
  } else {
    error = "supabase_not_configured";
  }

  if (error === "supabase_not_configured") {
    return (
      <div className="card border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-10 text-center">
        <div className="mx-auto mb-5 inline-flex rounded-2xl bg-amber-500/10 p-4">
          <Sparkles className="h-7 w-7 text-amber-500" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-amber-400">{t("supabase_error_title")}</h2>
        <p className="mx-auto max-w-md text-sm text-amber-300/80">
          {t("supabase_error_desc1")} <code className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-xs text-amber-200">.env.local</code> {t("supabase_error_desc2")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-red-500/20 bg-red-500/10 p-10 text-center">
        <h2 className="mb-2 text-xl font-bold text-red-400">Xato</h2>
        <p className="text-sm text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <PromptsClient
      prompts={prompts}
      labels={{
        search_placeholder: t("search_placeholder"),
        btn_add: t("btn_add"),
        badge: t("badge"),
        title: t("title"),
        subtitle: t("subtitle"),
      }}
    />
  );
}

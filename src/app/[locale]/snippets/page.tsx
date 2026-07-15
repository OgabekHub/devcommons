import { isSupabaseConfigured, createSupabaseServer } from "@/lib/supabase-server";
import type { Snippet } from "@/types/database";
import { getTranslations, setRequestLocale } from "next-intl/server";
import SnippetsClient from "@/components/SnippetsClient";
import { Code2 } from "lucide-react";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "Snippets" });
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function SnippetsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations("Snippets");
  let snippets: Snippet[] = [];
  let error: string | null = null;

  if (isSupabaseConfigured) {
    try {
      const supabase = createSupabaseServer();
      const { data, error: dbError } = await supabase
        .from("snippets")
        .select("*")
        .order("created_at", { ascending: false })
        .returns<Snippet[]>();

      if (dbError) error = dbError.message;
      else snippets = data ?? [];
    } catch (e) {
      error = e instanceof Error ? e.message : "Noma'lum xato yuz berdi";
    }
  } else {
    error = "supabase_not_configured";
  }

  if (error === "supabase_not_configured") {
    return (
      <div className="card border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-10 text-center">
        <div className="mx-auto mb-5 inline-flex rounded-2xl bg-amber-100 p-4">
          <Code2 className="h-7 w-7 text-amber-600" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-amber-800">{t("supabase_error_title")}</h2>
        <p className="mx-auto max-w-md text-sm text-amber-600">
          {t("supabase_error_desc1")} <code className="rounded bg-amber-100 px-2 py-0.5 font-mono text-xs">.env.local</code> {t("supabase_error_desc2")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-red-200 bg-red-50 p-10 text-center">
        <h2 className="mb-2 text-xl font-bold text-red-800">Xato</h2>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <SnippetsClient
      snippets={snippets}
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

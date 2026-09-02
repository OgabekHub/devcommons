import { createSupabasePublic, isSupabaseConfigured } from "@/lib/supabase-server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Folder, Globe, Layers } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";

export const revalidate = 60;

interface CollectionRow {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  author: { github_username: string | null; avatar_url: string | null } | null;
  collection_items: { count: number }[];
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "Collections" });
  return {
    title: t("index_meta_title"),
    description: t("index_meta_description"),
  };
}

// Ochiq to'plamlar ro'yxati — discovery sahifasi
export default async function CollectionsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations("Collections");

  let collections: CollectionRow[] = [];
  if (isSupabaseConfigured) {
    const supabase = createSupabasePublic();
    const { data } = await supabase
      .from("collections")
      .select(
        "id, title, description, created_at, author:users(github_username, avatar_url), collection_items(count)"
      )
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(60);
    collections = (data as unknown as CollectionRow[]) ?? [];
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 pb-20">
      <div className="mb-10">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
          <Layers className="h-3.5 w-3.5" />
          {t("index_badge")}
        </div>
        <h1 className="text-3xl font-bold text-fg sm:text-4xl">{t("index_title")}</h1>
        <p className="mt-2 text-zinc-400">{t("index_subtitle")}</p>
      </div>

      {collections.length === 0 ? (
        <div className="card border-dashed border-line p-14 text-center">
          <div className="mx-auto mb-5 inline-flex rounded-2xl bg-brand/10 p-4">
            <Folder className="h-7 w-7 text-brand" />
          </div>
          <p className="mx-auto max-w-sm text-sm text-zinc-400">{t("index_empty")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c, i) => {
            const itemCount = c.collection_items?.[0]?.count ?? 0;
            return (
              <SpotlightCard key={c.id} delay={i * 0.04} className="card card-shine group h-full flex flex-col">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Folder className="h-5 w-5" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-ink/5 border border-line px-2 py-0.5 text-xs text-zinc-400">
                    <Globe className="h-3 w-3" />
                    {itemCount} {t("items_count")}
                  </span>
                </div>
                <h2 className="font-bold text-fg leading-snug transition-colors group-hover:text-brand">
                  <Link
                    href={`/collections/${c.id}` as `/collections/${string}`}
                    className="focus:outline-none after:absolute after:inset-0 after:z-0 after:content-['']"
                  >
                    {c.title}
                  </Link>
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                  {c.description || t("no_description")}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 text-xs text-zinc-500">
                  <span>@{c.author?.github_username || "yashirin"}</span>
                  <span>{new Date(c.created_at).toLocaleDateString("uz-UZ")}</span>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

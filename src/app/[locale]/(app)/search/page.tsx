import { setRequestLocale, getTranslations } from "next-intl/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { Link } from "@/i18n/routing";
import SpotlightCard from "@/components/SpotlightCard";
import { Code2, Sparkles, Search as SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import VoteButton from "@/components/VoteButton";
import BookmarkButton from "@/components/BookmarkButton";

const PAGE_SIZE = 30;
type ContentFilter = "all" | "snippets" | "prompts";

interface SearchResult {
  item_type: "snippet" | "prompt";
  id: string;
  title: string;
  excerpt: string | null;
  snippet_language: string | null;
  prompt_category: string | null;
  votes: number;
  created_at: string;
  author_username: string | null;
  author_avatar: string | null;
  rank: number;
  total_count: number;
}

interface Props {
  searchParams: { q?: string; type?: string; page?: string };
  params: { locale: string };
}

export default async function SearchPage({ searchParams, params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("SearchPage");
  const query = (searchParams.q || "").slice(0, 100);
  const typeFilter: ContentFilter = ["snippets", "prompts"].includes(searchParams.type ?? "")
    ? (searchParams.type as ContentFilter)
    : "all";
  const page = Math.max(0, parseInt(searchParams.page ?? "0", 10) || 0);
  const supabase = createSupabaseServer();

  let results: SearchResult[] = [];
  let total = 0;

  if (query.trim()) {
    const safeQuery = query.replace(/[,()\\*]/g, "").trim();

    // FTS + ranking (migration_v18). RLS amal qiladi (SECURITY INVOKER).
    const { data, error } = await supabase.rpc("search_content", {
      q: safeQuery,
      content_filter: typeFilter,
      lim: PAGE_SIZE,
      off: page * PAGE_SIZE,
    });

    if (!error && data) {
      results = data as SearchResult[];
      total = results[0]?.total_count ?? 0;
    } else if (error) {
      // Fallback: migration v18 hali ishga tushirilmagan bo'lsa — eski ilike yo'li
      const term = `%${safeQuery}%`;
      const [snippetsRes, promptsRes] = await Promise.all([
        typeFilter !== "prompts"
          ? supabase
              .from("snippets")
              .select("id, title, description, code, language, votes, created_at, author:users(github_username, avatar_url)")
              .or(`title.ilike.${term},description.ilike.${term}`)
              .limit(20)
          : Promise.resolve({ data: [] as any[] }),
        typeFilter !== "snippets"
          ? supabase
              .from("prompts")
              .select("id, title, description, content, category, votes, created_at, author:users(github_username, avatar_url)")
              .or(`title.ilike.${term},description.ilike.${term}`)
              .limit(20)
          : Promise.resolve({ data: [] as any[] }),
      ]);
      const snip = (snippetsRes.data ?? []).map((s: any): SearchResult => ({
        item_type: "snippet",
        id: s.id,
        title: s.title,
        excerpt: (s.description || s.code || "").slice(0, 220),
        snippet_language: s.language,
        prompt_category: null,
        votes: s.votes ?? 0,
        created_at: s.created_at,
        author_username: s.author?.github_username ?? null,
        author_avatar: s.author?.avatar_url ?? null,
        rank: 0,
        total_count: 0,
      }));
      const prom = (promptsRes.data ?? []).map((p: any): SearchResult => ({
        item_type: "prompt",
        id: p.id,
        title: p.title,
        excerpt: (p.description || p.content || "").slice(0, 220),
        snippet_language: null,
        prompt_category: p.category,
        votes: p.votes ?? 0,
        created_at: p.created_at,
        author_username: p.author?.github_username ?? null,
        author_avatar: p.author?.avatar_url ?? null,
        rank: 0,
        total_count: 0,
      }));
      results = [...snip, ...prom];
      total = results.length;
    }
  }

  const hasPrev = page > 0;
  const hasNext = (page + 1) * PAGE_SIZE < total;

  const facetHref = (type: ContentFilter) =>
    ({ pathname: "/search", query: { q: query, ...(type !== "all" ? { type } : {}) } }) as any;
  const pageHref = (p: number) =>
    ({
      pathname: "/search",
      query: {
        q: query,
        ...(typeFilter !== "all" ? { type: typeFilter } : {}),
        ...(p > 0 ? { page: String(p) } : {}),
      },
    }) as any;

  const FACETS: { value: ContentFilter; label: string }[] = [
    { value: "all", label: t("filter_all") },
    { value: "snippets", label: "Snippets" },
    { value: "prompts", label: "Prompts" },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 pb-20">
      <div className="mb-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand mb-6">
          <SearchIcon className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-fg sm:text-4xl">
          {t("title")}
        </h1>
        {query ? (
          <p className="mt-4 text-zinc-400">
            <strong className="text-fg">&quot;{query}&quot;</strong> — {t("results_for")}
            {total > 0 && <span className="ml-1 text-zinc-500">({total})</span>}
          </p>
        ) : (
          <p className="mt-4 text-zinc-400">
            {t("empty_query")}
          </p>
        )}
      </div>

      {/* Facet: All / Snippets / Prompts */}
      {query && (
        <div className="mb-8 flex justify-center gap-2">
          {FACETS.map((f) => (
            <Link
              key={f.value}
              href={facetHref(f.value)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                typeFilter === f.value
                  ? "bg-brand text-white"
                  : "border border-line text-zinc-400 hover:border-brand/30 hover:text-brand"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      )}

      {query && results.length === 0 && (
        <div className="card border-dashed border-line p-12 text-center text-zinc-500">
          <p>{t("nothing_found")}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((item) => (
            <SpotlightCard key={`${item.item_type}-${item.id}`} className="flex h-full flex-col p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="overflow-hidden">
                  <Link
                    href={`/${item.item_type === "snippet" ? "snippets" : "prompts"}/${item.id}` as any}
                    className="truncate text-lg font-bold text-fg hover:text-brand block"
                  >
                    {item.title}
                  </Link>
                  <div className="truncate text-sm text-zinc-500 mt-1">
                    @{item.author_username || "yashirin"}
                  </div>
                </div>
                {item.item_type === "snippet" ? (
                  <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-lg bg-brand/10 border border-brand/20 px-2 py-0.5 text-xs font-semibold text-brand">
                    <Code2 className="h-3 w-3" />
                    {item.snippet_language}
                  </span>
                ) : (
                  <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-lg bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-400">
                    <Sparkles className="h-3 w-3" />
                    {item.prompt_category}
                  </span>
                )}
              </div>

              <p className="mb-6 line-clamp-3 text-sm text-zinc-400">
                {item.excerpt}
              </p>

              <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
                <span className="text-xs text-zinc-500">
                  {new Date(item.created_at).toLocaleDateString("uz-UZ")}
                </span>
                <div className="flex items-center gap-2">
                  <VoteButton
                    id={item.id}
                    type={item.item_type}
                    initialVotes={item.votes || 0}
                  />
                  {item.item_type === "snippet" ? (
                    <BookmarkButton snippetId={item.id} compact />
                  ) : (
                    <BookmarkButton promptId={item.id} compact />
                  )}
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* Sahifalash */}
      {(hasPrev || hasNext) && (
        <div className="mt-10 flex items-center justify-center gap-3">
          {hasPrev ? (
            <Link href={pageHref(page - 1)} className="btn-secondary">
              <ChevronLeft className="h-4 w-4" />
              {t("prev")}
            </Link>
          ) : (
            <span className="btn-secondary pointer-events-none opacity-40">
              <ChevronLeft className="h-4 w-4" />
              {t("prev")}
            </span>
          )}
          <span className="text-sm text-zinc-500">{page + 1}</span>
          {hasNext ? (
            <Link href={pageHref(page + 1)} className="btn-secondary">
              {t("next")}
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="btn-secondary pointer-events-none opacity-40">
              {t("next")}
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </div>
      )}
    </div>
  );
}

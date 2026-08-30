"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Sparkles, Plus, Search, X, ArrowUpDown, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Prompt } from "@/types/database";
import VoteButton from "@/components/VoteButton";
import BookmarkButton from "@/components/BookmarkButton";
import SpotlightCard from "@/components/SpotlightCard";
import UsageStatsBadge from "@/components/UsageStatsBadge";
import CopyButton from "@/components/CopyButton";
import VerifiedBadge from "@/components/VerifiedBadge";
import { useTranslations } from "next-intl";

const BASE_CATEGORIES = [
  "Coding", "Writing", "Analysis", "Marketing",
  "Education", "Business", "Creative", "Research", "Other"
];

const categoryStyles: Record<string, string> = {
  Coding: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Writing: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Analysis: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  Creative: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
  Marketing: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  Education: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
  default: "bg-ink/5 text-zinc-400 border border-line",
};

interface Props {
  prompts: Prompt[];
  labels: {
    search_placeholder: string;
    btn_add: string;
    badge: string;
    title: string;
    subtitle: string;
  };
}

export default function PromptsClient({ prompts, labels }: Props) {
  const t = useTranslations("Actions");
  const CATEGORIES = [
    { value: "ALL", label: t("filter_all") },
    ...BASE_CATEGORIES.map(c => ({ value: c, label: c }))
  ];
  const SORT_OPTIONS = [
    { value: "newest", label: t("sort_newest") },
    { value: "oldest", label: t("sort_oldest") },
    { value: "popular", label: t("sort_popular") },
  ];

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let result = prompts.filter((p) => {
      const matchQuery =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.content.toLowerCase().includes(query.toLowerCase()) ||
        (p as any).description?.toLowerCase().includes(query.toLowerCase());

      const matchCat = category === "ALL" || p.category === category;

      const matchTags = selectedTags.length === 0 ||
        selectedTags.some(tag => (p as any).tags?.includes(tag));

      return matchQuery && matchCat && matchTags;
    });

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === "popular") {
        return (b.votes || 0) - (a.votes || 0);
      }
      return 0;
    });

    return result;
  }, [prompts, query, category, selectedTags, sortBy]);

  const visiblePrompts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) {
          setLoading(true);
          timeoutRef.current = setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 12, filtered.length));
            setLoading(false);
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [hasMore, loading, filtered.length]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [query, category, selectedTags, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-400">
            <Sparkles className="h-3.5 w-3.5" />
            {labels.badge}
          </div>
          <h1 className="text-3xl font-bold text-fg sm:text-4xl">{labels.title}</h1>
          <p className="mt-2 text-zinc-400">{labels.subtitle}</p>
        </div>
        <Link href="/prompts/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          {labels.btn_add}
        </Link>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.search_placeholder}
            className="w-full rounded-xl border border-line bg-surface-subtle py-3 pl-11 pr-10 text-sm text-fg transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 placeholder:text-zinc-500"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Qidiruvni tozalash"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-3">
          {/* Category filter chips */}
          <div className="flex flex-wrap gap-2 flex-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  category === cat.value
                    ? "bg-brand text-white shadow-brand/20"
                    : "border border-line text-zinc-400 hover:border-brand/30 hover:text-brand"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
            aria-label="Saralash tartibi"
            aria-expanded={showSortMenu}
              className="input flex items-center gap-2 bg-surface-subtle text-zinc-300 cursor-pointer sm:w-40 border-line hover:border-brand/50"
            >
              <ArrowUpDown className="h-4 w-4" />
              {SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-xl border border-line bg-surface-overlay p-1 shadow-2xl">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      sortBy === opt.value ? "bg-brand/10 text-brand" : "text-zinc-300 hover:bg-ink/5 hover:text-fg"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tag filter */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-400 transition-colors hover:bg-violet-500/20 border border-violet-500/20"
            >
              #{tag}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            onClick={() => setSelectedTags([])}
            className="text-sm text-zinc-400 hover:text-zinc-300"
          >
            {t("clear_all")}
          </button>
        </div>
      )}

      {/* Natijalar soni */}
      {(query || category !== "ALL" || selectedTags.length > 0) && (
        <p className="text-sm text-zinc-400">
          {filtered.length} {t("results_found")}
          {query && <span> — &ldquo;<strong className="text-zinc-200">{query}</strong>&rdquo;</span>}
          {selectedTags.length > 0 && <span> — {selectedTags.length} {t("tags")}</span>}
        </p>
      )}

      {/* Bo'sh holat */}
      {filtered.length === 0 && (
        <div className="card border-dashed border-line bg-gradient-to-br from-surface-subtle to-surface p-14 text-center">
          <div className="mx-auto mb-5 inline-flex rounded-2xl bg-purple-500/10 border border-purple-500/20 p-4">
            <Sparkles className="h-7 w-7 text-purple-400" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-fg">
            {query ? t("nothing_found") : t("no_prompts_yet")}
          </h2>
          <p className="mx-auto max-w-sm text-sm text-zinc-400">
            {query
              ? t("search_again")
              : t("first_prompt")}
          </p>
          {!query && (
            <Link href="/prompts/new" className="btn-primary mt-6">
              <Plus className="h-4 w-4" />
              {labels.btn_add}
            </Link>
          )}
        </div>
      )}

      {/* Prompts Grid */}
      {visiblePrompts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {visiblePrompts.map((prompt, i) => (
            /* Stretched-link pattern — <a> ichida <button> yo'q (a11y) */
            <SpotlightCard key={prompt.id} delay={i * 0.05} className="card card-shine group h-full flex flex-col">
                <div className="mb-3 flex items-start justify-between">
                  <h2 className="font-bold text-fg leading-snug transition-colors group-hover:text-brand">
                    <Link
                      href={`/prompts/${prompt.id}` as `/prompts/${string}`}
                      className="focus:outline-none after:absolute after:inset-0 after:z-0 after:content-['']"
                    >
                      {prompt.title}
                    </Link>
                  </h2>
                  <span className={`ml-2 flex-shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${categoryStyles[prompt.category] || categoryStyles.default}`}>
                    {prompt.category}
                  </span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <VerifiedBadge isVerified={(prompt as any).is_verified} />
                  <UsageStatsBadge usedCount={(prompt as any).used_count} forksCount={(prompt as any).forks_count} />
                </div>
                {(prompt as any).description && (
                  <p className="mb-2 text-sm text-zinc-400 line-clamp-1">
                    {(prompt as any).description}
                  </p>
                )}
                <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                  {prompt.content}
                </p>
                {/* Tags */}
                {(prompt as any).tags?.length > 0 && (
                  <div className="relative z-10 mb-3 flex flex-wrap gap-1.5">
                    {((prompt as any).tags as string[]).slice(0, 3).map((tag) => (
                      <button
                        key={tag}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!selectedTags.includes(tag)) {
                            setSelectedTags([...selectedTags, tag]);
                          }
                        }}
                        className={`rounded-md px-2 py-0.5 text-xs transition-colors border ${
                          selectedTags.includes(tag)
                            ? "bg-violet-500/20 text-violet-400 border-violet-500/30"
                            : "bg-ink/5 text-zinc-400 border-line hover:bg-ink/10"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
                <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-line">
                  <div className="flex items-center gap-3">
                    <VoteButton id={prompt.id} type="prompt" initialVotes={prompt.votes ?? 0} />
                    <span className="text-xs text-zinc-400">{new Date(prompt.created_at).toLocaleDateString("uz-UZ")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookmarkButton promptId={prompt.id} compact />
                    <CopyButton text={prompt.content} label="" itemId={prompt.id} itemType="prompt" />
                  </div>
                </div>
            </SpotlightCard>
          ))}
        </div>
      ) : null}

      {/* Loading indicator for infinite scroll */}
      {hasMore && (
        <div ref={observerRef} className="flex justify-center py-8">
          {loading && (
            <div className="flex items-center gap-2 text-zinc-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{t("loading")}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

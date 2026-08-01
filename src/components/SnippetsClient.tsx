"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Code2, Plus, Search, X, ArrowUpDown, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Snippet } from "@/types/database";
import { useTranslations } from "next-intl";
import VoteButton from "@/components/VoteButton";
import CopyButton from "@/components/CopyButton";
import BookmarkButton from "@/components/BookmarkButton";
import SpotlightCard from "@/components/SpotlightCard";
import LanguageLogo from "@/components/LanguageLogo";
import AgentConfigBadge from "@/components/AgentConfigBadge";
import { ALL_SUPPORTED_LANGUAGES as ALL_LANGUAGES, LANGUAGE_CONFIGS_MAP as LANGUAGE_CONFIGS } from "@/lib/agent-config";

interface Props {
  snippets: Snippet[];
  labels: {
    search_placeholder: string;
    btn_add: string;
    badge: string;
    title: string;
    subtitle: string;
  };
}

export default function SnippetsClient({ snippets, labels }: Props) {
  const t = useTranslations("Actions");
  const SORT_OPTIONS = [
    { value: "newest", label: t("sort_newest") },
    { value: "oldest", label: t("sort_oldest") },
    { value: "popular", label: t("sort_popular") },
  ];

  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("ALL");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let result = snippets.filter((s) => {
      const matchQuery =
        !query ||
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.description?.toLowerCase().includes(query.toLowerCase()) ||
        s.language.toLowerCase().includes(query.toLowerCase());

      const matchLang = lang === "ALL" || s.language === lang;

      const matchTags = selectedTags.length === 0 ||
        selectedTags.some(tag => (s as any).tags?.includes(tag));

      return matchQuery && matchLang && matchTags;
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
  }, [snippets, query, lang, selectedTags, sortBy]);

  const visibleSnippets = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) {
          setLoading(true);
          setTimeout(() => {
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

    return () => observer.disconnect();
  }, [hasMore, loading, filtered.length]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [query, lang, selectedTags, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
            <Code2 className="h-3.5 w-3.5" />
            {labels.badge}
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{labels.title}</h1>
          <p className="mt-2 text-gray-400">{labels.subtitle}</p>
        </div>
        <Link href="/snippets/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          {labels.btn_add}
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.search_placeholder}
            className="w-full rounded-xl border border-white/10 bg-[#111] py-3 pl-11 pr-10 text-sm text-white transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 placeholder:text-gray-500"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="input flex items-center gap-2 bg-[#111] text-gray-300 cursor-pointer sm:w-40 border-white/10 hover:border-brand/50"
          >
            <ArrowUpDown className="h-4 w-4" />
            {SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}
          </button>
          {showSortMenu && (
            <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-xl border border-white/10 bg-[#1A1A1A] p-1 shadow-2xl">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    sortBy === opt.value ? "bg-brand/10 text-brand" : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Colorful Language Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setLang("ALL")}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
            lang === "ALL"
              ? "bg-brand/20 border-brand/60 text-brand shadow-sm"
              : "bg-[#111] border-white/10 text-gray-400 hover:border-white/25 hover:text-gray-200"
          }`}
        >
          <span>✨</span>
          <span>{t("filter_all")}</span>
        </button>
        {ALL_LANGUAGES.map((l) => {
          const cfg = LANGUAGE_CONFIGS[l] || { color: "text-gray-400", dot: "bg-gray-400", bgActive: "bg-gray-500/20 border-gray-500/60" };
          const isActive = lang === l;
          return (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm transition-colors whitespace-nowrap ${
                isActive
                  ? `${cfg.bgActive} ${cfg.color} font-semibold shadow-sm`
                  : "bg-[#111] border-white/10 text-gray-400 hover:border-white/25 hover:text-gray-200"
              }`}
            >
              <LanguageLogo language={l} className="h-4 w-4 shrink-0" />
              <span>{l}</span>
            </button>
          );
        })}
      </div>

      {/* Tag filter */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 px-3 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/20 border border-brand/20"
            >
              #{tag}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            onClick={() => setSelectedTags([])}
            className="text-sm text-gray-400 hover:text-gray-300"
          >
            {t("clear_all")}
          </button>
        </div>
      )}

      {/* Natijalar soni */}
      {(query || lang !== "ALL" || selectedTags.length > 0) && (
        <p className="text-sm text-gray-400">
          {filtered.length} {t("results_found")}
          {query && <span> — "<strong className="text-gray-200">{query}</strong>"</span>}
          {selectedTags.length > 0 && <span> — {selectedTags.length} {t("tags")}</span>}
        </p>
      )}

      {/* Bo'sh holat */}
      {filtered.length === 0 && (
        <div className="card border-dashed border-white/10 bg-gradient-to-br from-[#111] to-[#0A0A0A] p-14 text-center">
          <div className="mx-auto mb-5 inline-flex rounded-2xl bg-brand/10 p-4">
            <Code2 className="h-7 w-7 text-brand" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-white">
            {query ? t("nothing_found") : t("no_snippets_yet")}
          </h2>
          <p className="mx-auto max-w-sm text-sm text-gray-400">
            {query
              ? t("search_again")
              : t("first_snippet")}
          </p>
          {!query && (
            <Link href="/snippets/new" className="btn-primary mt-6">
              <Plus className="h-4 w-4" />
              {labels.btn_add}
            </Link>
          )}
        </div>
      )}

      {/* Snippets Grid */}
      {visibleSnippets.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {visibleSnippets.map((snippet, i) => (
            <Link
              key={snippet.id}
              href={`/snippets/${snippet.id}` as `/snippets/${string}`}
              className="group block"
            >
              <SpotlightCard delay={i * 0.05} className="card card-shine h-full flex flex-col cursor-pointer">
                <div className="mb-3 flex items-start justify-between">
                  <h2 className="font-bold text-white leading-snug transition-colors group-hover:text-brand">
                    {snippet.title}
                  </h2>
                  <span className="ml-2 flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-brand/10 border border-brand/20 px-2.5 py-1 text-xs font-semibold text-brand">
                    <LanguageLogo language={snippet.language} className="h-3.5 w-3.5 shrink-0" />
                    {snippet.language}
                  </span>
                </div>
                <div className="mb-2">
                  <AgentConfigBadge title={snippet.title} language={snippet.language} />
                </div>
                {snippet.description && (
                  <p className="mb-4 line-clamp-2 text-sm text-gray-400">
                    {snippet.description}
                  </p>
                )}
                {/* Tags */}
                {(snippet as any).tags?.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {((snippet as any).tags as string[]).slice(0, 3).map((tag) => (
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
                            ? "bg-brand/20 text-brand border-brand/30"
                            : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <VoteButton id={snippet.id} type="snippet" initialVotes={snippet.votes ?? 0} />
                    <span className="text-xs text-gray-400">{new Date(snippet.created_at).toLocaleDateString("uz-UZ")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookmarkButton snippetId={snippet.id} compact />
                    <CopyButton text={snippet.code} label="" />
                  </div>
                </div>
              </SpotlightCard>
            </Link>
          ))}
        </div>
      ) : null}

      {/* Loading indicator for infinite scroll */}
      {hasMore && (
        <div ref={observerRef} className="flex justify-center py-8">
          {loading && (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Yuklanmoqda...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Code2, Plus, Search, X, ArrowUpDown, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Snippet } from "@/types/database";
import { useLocale } from "next-intl";
import VoteButton from "@/components/VoteButton";
import CopyButton from "@/components/CopyButton";
import SkeletonCard from "@/components/SkeletonCard";
import SpotlightCard from "@/components/SpotlightCard";
import CustomSelect from "@/components/CustomSelect";

const LANGUAGES = [
  "Barchasi", "JavaScript", "TypeScript", "Python", "Rust",
  "Go", "Java", "C++", "C#", "PHP", "Ruby", "SQL", "Other"
];

const SORT_OPTIONS = [
  { value: "newest", label: "Eng yangi" },
  { value: "oldest", label: "Eng eski" },
  { value: "popular", label: "Mashhur" },
];

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
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("Barchasi");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  // Simulate initial loading
  useEffect(() => {
    setTimeout(() => setInitialLoading(false), 500);
  }, []);

  const filtered = useMemo(() => {
    let result = snippets.filter((s) => {
      const matchQuery =
        !query ||
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.description?.toLowerCase().includes(query.toLowerCase()) ||
        s.language.toLowerCase().includes(query.toLowerCase());

      const matchLang = lang === "Barchasi" || s.language === lang;

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
        if (entries[0].isIntersecting && hasMore && !loading) {
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
        <div className="w-full sm:w-48">
          <CustomSelect
            options={LANGUAGES}
            value={lang}
            onChange={(val) => setLang(val)}
          />
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
            Barchasini tozalash
          </button>
        </div>
      )}

      {/* Natijalar soni */}
      {(query || lang !== "Barchasi" || selectedTags.length > 0) && (
        <p className="text-sm text-gray-400">
          {filtered.length} ta natija topildi
          {query && <span> — "<strong className="text-gray-200">{query}</strong>"</span>}
          {selectedTags.length > 0 && <span> — {selectedTags.length} ta tag</span>}
        </p>
      )}

      {/* Bo'sh holat */}
      {filtered.length === 0 && (
        <div className="card border-dashed border-white/10 bg-gradient-to-br from-[#111] to-[#0A0A0A] p-14 text-center">
          <div className="mx-auto mb-5 inline-flex rounded-2xl bg-brand/10 p-4">
            <Code2 className="h-7 w-7 text-brand" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-white">
            {query ? "Hech narsa topilmadi" : "Hozircha snippet yo'q"}
          </h2>
          <p className="mx-auto max-w-sm text-sm text-gray-400">
            {query
              ? "Boshqa kalit so'z bilan qidiring yoki filterni o'zgartiring"
              : "Birinchi bo'lib snippet qo'shing!"}
          </p>
          {!query && (
            <Link href="/snippets/new" className="btn-primary mt-6">
              <Plus className="h-4 w-4" />
              Snippet qo'shish
            </Link>
          )}
        </div>
      )}

      {/* Snippets Grid */}
      {initialLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : visibleSnippets.length > 0 ? (
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
                  <span className="ml-2 flex-shrink-0 rounded-lg bg-brand/10 border border-brand/20 px-2.5 py-1 text-xs font-semibold text-brand">
                    {snippet.language}
                  </span>
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
                  <CopyButton text={snippet.code} label="" />
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

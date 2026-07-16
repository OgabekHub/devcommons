"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Sparkles, Plus, Search, X, ArrowUpDown, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Prompt } from "@/types/database";
import VoteButton from "@/components/VoteButton";
import SkeletonCard from "@/components/SkeletonCard";

const CATEGORIES = [
  "Barchasi", "Coding", "Writing", "Analysis", "Marketing",
  "Education", "Business", "Creative", "Research", "Other"
];

const SORT_OPTIONS = [
  { value: "newest", label: "Eng yangi" },
  { value: "oldest", label: "Eng eski" },
  { value: "popular", label: "Mashhur" },
];

const categoryStyles: Record<string, string> = {
  Coding: "bg-blue-50 text-blue-600",
  Writing: "bg-emerald-50 text-emerald-600",
  Analysis: "bg-purple-50 text-purple-600",
  Creative: "bg-pink-50 text-pink-600",
  Marketing: "bg-orange-50 text-orange-600",
  Education: "bg-teal-50 text-teal-600",
  default: "bg-gray-100 text-gray-600",
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
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Barchasi");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

  // Simulate initial loading
  useEffect(() => {
    setTimeout(() => setInitialLoading(false), 500);
  }, []);

  const filtered = useMemo(() => {
    let result = prompts.filter((p) => {
      const matchQuery =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.content.toLowerCase().includes(query.toLowerCase()) ||
        (p as any).description?.toLowerCase().includes(query.toLowerCase());

      const matchCat = category === "Barchasi" || p.category === category;

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
  }, [query, category, selectedTags, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
            <Sparkles className="h-3.5 w-3.5" />
            {labels.badge}
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">{labels.title}</h1>
          <p className="mt-2 text-gray-500">{labels.subtitle}</p>
        </div>
        <Link href="/prompts/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          {labels.btn_add}
        </Link>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.search_placeholder}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-10 text-sm transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  category === cat
                    ? "bg-brand text-white shadow-sm"
                    : "border border-gray-200 text-gray-600 hover:border-brand/30 hover:text-brand"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="input flex items-center gap-2 bg-white text-gray-700 cursor-pointer sm:w-40"
            >
              <ArrowUpDown className="h-4 w-4" />
              {SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      sortBy === opt.value ? "bg-brand-50 text-brand" : "text-gray-700 hover:bg-gray-50"
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
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1 text-sm font-medium text-violet-600 transition-colors hover:bg-violet-100"
            >
              #{tag}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            onClick={() => setSelectedTags([])}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Barchasini tozalash
          </button>
        </div>
      )}

      {/* Natijalar soni */}
      {(query || category !== "Barchasi" || selectedTags.length > 0) && (
        <p className="text-sm text-gray-500">
          {filtered.length} ta natija
          {query && <span> — "<strong>{query}</strong>"</span>}
          {selectedTags.length > 0 && <span> — {selectedTags.length} ta tag</span>}
        </p>
      )}

      {/* Bo'sh holat */}
      {filtered.length === 0 && (
        <div className="card border-dashed bg-gradient-to-br from-purple-50/50 to-white p-14 text-center">
          <div className="mx-auto mb-5 inline-flex rounded-2xl bg-purple-50 p-4">
            <Sparkles className="h-7 w-7 text-purple-500" />
          </div>
          <h2 className="mb-2 text-xl font-bold">
            {query ? "Hech narsa topilmadi" : "Hozircha prompt yo'q"}
          </h2>
          <p className="mx-auto max-w-sm text-sm text-gray-500">
            {query
              ? "Boshqa kalit so'z bilan qidiring"
              : "Birinchi bo'lib AI prompt qo'shing!"}
          </p>
          {!query && (
            <Link href="/prompts/new" className="btn-primary mt-6">
              <Plus className="h-4 w-4" />
              Prompt qo'shish
            </Link>
          )}
        </div>
      )}

      {/* Prompts Grid */}
      {initialLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : visiblePrompts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {visiblePrompts.map((prompt) => (
            <Link
              key={prompt.id}
              href={`/prompts/${prompt.id}` as `/prompts/${string}`}
              className="card card-shine group cursor-pointer block"
            >
              <div className="mb-3 flex items-start justify-between">
                <h2 className="font-bold leading-snug transition-colors group-hover:text-brand">
                  {prompt.title}
                </h2>
                <span className={`ml-2 flex-shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${categoryStyles[prompt.category] || categoryStyles.default}`}>
                  {prompt.category}
                </span>
              </div>
              {(prompt as any).description && (
                <p className="mb-2 text-sm text-gray-500 line-clamp-1">
                  {(prompt as any).description}
                </p>
              )}
              <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-500">
                {prompt.content}
              </p>
              {/* Tags */}
              {(prompt as any).tags?.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
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
                      className={`rounded-md px-2 py-0.5 text-xs transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-violet-100 text-violet-600"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3">
                  <VoteButton id={prompt.id} type="prompt" initialVotes={prompt.votes ?? 0} />
                  <span className="text-xs text-gray-400">{new Date(prompt.created_at).toLocaleDateString("uz-UZ")}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : null}

      {/* Loading indicator for infinite scroll */}
      {hasMore && (
        <div ref={observerRef} className="flex justify-center py-8">
          {loading && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Yuklanmoqda...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

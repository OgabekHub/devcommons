"use client";

import { useState, useMemo } from "react";
import { Sparkles, Plus, Search, X } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Prompt } from "@/types/database";

const CATEGORIES = [
  "Barchasi", "Coding", "Writing", "Analysis", "Marketing",
  "Education", "Business", "Creative", "Research", "Other"
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

  const filtered = useMemo(() => {
    return prompts.filter((p) => {
      const matchQuery =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.content.toLowerCase().includes(query.toLowerCase()) ||
        (p as any).description?.toLowerCase().includes(query.toLowerCase());

      const matchCat = category === "Barchasi" || p.category === category;

      return matchQuery && matchCat;
    });
  }, [prompts, query, category]);

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

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2">
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
      </div>

      {/* Natijalar soni */}
      {(query || category !== "Barchasi") && (
        <p className="text-sm text-gray-500">
          {filtered.length} ta natija
          {query && <span> — "<strong>{query}</strong>"</span>}
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
      {filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((prompt) => (
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
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>👍 {prompt.votes}</span>
                <span>{new Date(prompt.created_at).toLocaleDateString("uz-UZ")}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { Code2, Plus, Search, X } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { Snippet } from "@/types/database";
import { useLocale } from "next-intl";
import VoteButton from "@/components/VoteButton";
import CopyButton from "@/components/CopyButton";

const LANGUAGES = [
  "Barchasi", "JavaScript", "TypeScript", "Python", "Rust",
  "Go", "Java", "C++", "C#", "PHP", "Ruby", "SQL", "Other"
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
  const locale = useLocale();

  const filtered = useMemo(() => {
    return snippets.filter((s) => {
      const matchQuery =
        !query ||
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.description?.toLowerCase().includes(query.toLowerCase()) ||
        s.language.toLowerCase().includes(query.toLowerCase());

      const matchLang = lang === "Barchasi" || s.language === lang;

      return matchQuery && matchLang;
    });
  }, [snippets, query, lang]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand">
            <Code2 className="h-3.5 w-3.5" />
            {labels.badge}
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">{labels.title}</h1>
          <p className="mt-2 text-gray-500">{labels.subtitle}</p>
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
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-brand focus:outline-none"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Natijalar soni */}
      {(query || lang !== "Barchasi") && (
        <p className="text-sm text-gray-500">
          {filtered.length} ta natija topildi
          {query && <span> — "<strong>{query}</strong>"</span>}
        </p>
      )}

      {/* Bo'sh holat */}
      {filtered.length === 0 && (
        <div className="card border-dashed bg-gradient-to-br from-gray-50 to-white p-14 text-center">
          <div className="mx-auto mb-5 inline-flex rounded-2xl bg-brand-50 p-4">
            <Code2 className="h-7 w-7 text-brand" />
          </div>
          <h2 className="mb-2 text-xl font-bold">
            {query ? "Hech narsa topilmadi" : "Hozircha snippet yo'q"}
          </h2>
          <p className="mx-auto max-w-sm text-sm text-gray-500">
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
      {filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((snippet) => (
            <Link
              key={snippet.id}
              href={`/snippets/${snippet.id}` as `/snippets/${string}`}
              className="card card-shine group cursor-pointer block"
            >
              <div className="mb-3 flex items-start justify-between">
                <h2 className="font-bold leading-snug transition-colors group-hover:text-brand">
                  {snippet.title}
                </h2>
                <span className="ml-2 flex-shrink-0 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand">
                  {snippet.language}
                </span>
              </div>
              {snippet.description && (
                <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                  {snippet.description}
                </p>
              )}
              {/* Tags */}
              {(snippet as any).tags?.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {((snippet as any).tags as string[]).slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <VoteButton id={snippet.id} type="snippet" initialVotes={snippet.votes ?? 0} />
                  <span className="text-xs text-gray-400">{new Date(snippet.created_at).toLocaleDateString("uz-UZ")}</span>
                </div>
                <CopyButton text={snippet.code} label="" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

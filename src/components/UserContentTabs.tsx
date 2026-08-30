"use client";

import React, { useState } from "react";
import { Code2, Sparkles } from "lucide-react";
import { Link } from "@/i18n/routing";

interface Item {
  id: string;
  title: string;
  description?: string;
  content?: string;
  language?: string;
  category?: string;
  votes?: number;
  created_at: string;
}

interface Props {
  snippets: Item[];
  prompts: Item[];
  locale: string;
  emptyText?: string;
}

export default function UserContentTabs({ snippets, prompts, locale, emptyText = "Hozircha ma'lumot yo'q" }: Props) {
  const [tab, setTab] = useState<"snippets" | "prompts">("snippets");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US"
    );
  };

  return (
    <div className="space-y-6">
      {/* Tabs Switcher */}
      <div className="flex gap-2 border-b border-line">
        <button
          onClick={() => setTab("snippets")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "snippets"
              ? "border-brand text-brand font-semibold"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Code2 className="h-4 w-4" />
          <span>Snippets</span>
          <span className="ml-1 rounded-full bg-ink/10 px-2 py-0.5 text-xs text-zinc-300">{snippets.length}</span>
        </button>
        <button
          onClick={() => setTab("prompts")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "prompts"
              ? "border-violet-400 text-violet-400 font-semibold"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Prompts</span>
          <span className="ml-1 rounded-full bg-ink/10 px-2 py-0.5 text-xs text-zinc-300">{prompts.length}</span>
        </button>
      </div>

      {/* Tab Content */}
      {tab === "snippets" && (
        <div>
          {snippets.length === 0 ? (
            <div className="card border-dashed border-line p-12 text-center text-zinc-500">
              <Code2 className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
              <p>{emptyText}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {snippets.map((s) => (
                <Link
                  key={s.id}
                  href={`/snippets/${s.id}` as any}
                  className="card card-shine group block"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-semibold text-fg transition-colors group-hover:text-brand">{s.title}</h3>
                    {s.language && (
                      <span className="ml-2 rounded-lg bg-brand/10 border border-brand/20 px-2 py-0.5 text-xs font-semibold text-brand">
                        {s.language}
                      </span>
                    )}
                  </div>
                  {s.description && <p className="text-sm text-zinc-400 line-clamp-2">{s.description}</p>}
                  <p className="mt-3 text-xs text-zinc-500">👍 {s.votes ?? 0} · {formatDate(s.created_at)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "prompts" && (
        <div>
          {prompts.length === 0 ? (
            <div className="card border-dashed border-line p-12 text-center text-zinc-500">
              <Sparkles className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
              <p>{emptyText}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {prompts.map((p) => (
                <Link
                  key={p.id}
                  href={`/prompts/${p.id}` as any}
                  className="card card-shine group block"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-semibold text-fg transition-colors group-hover:text-brand">{p.title}</h3>
                    {p.category && (
                      <span className="ml-2 rounded-lg bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-400">
                        {p.category}
                      </span>
                    )}
                  </div>
                  {p.content && <p className="text-sm text-zinc-400 line-clamp-2">{p.content}</p>}
                  <p className="mt-3 text-xs text-zinc-400">👍 {p.votes ?? 0} · {formatDate(p.created_at)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, Copy, Calendar, Code2, User, Tag } from "lucide-react";
import { Link } from "@/i18n/routing";
import CopyButton from "@/components/CopyButton";

interface Props {
  params: { id: string; locale: string };
}

export default async function SnippetDetailPage({ params: { id, locale } }: Props) {
  setRequestLocale(locale);
  const supabase = createSupabaseServer();

  const { data: snippet, error } = await supabase
    .from("snippets")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !snippet) notFound();

  const createdAt = new Date(snippet.created_at).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Back */}
      <Link
        href="/snippets"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Snippets'ga qaytish
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1 text-sm font-semibold text-brand">
            <Code2 className="h-3.5 w-3.5" />
            {snippet.language}
          </span>
          {snippet.tags?.map((tag: string) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{snippet.title}</h1>

        {snippet.description && (
          <p className="mt-3 text-gray-500 leading-relaxed">{snippet.description}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            {snippet.author_avatar ? (
              <img src={snippet.author_avatar} alt={snippet.author_name} className="h-5 w-5 rounded-full" />
            ) : (
              <User className="h-4 w-4" />
            )}
            {snippet.author_name || "Anonymous"}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {createdAt}
          </span>
          <span className="flex items-center gap-1.5">
            👍 {snippet.votes || 0} ovoz
          </span>
        </div>
      </div>

      {/* Code Block */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
        {/* Code header */}
        <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs font-medium text-gray-400">{snippet.language}</span>
          </div>
          <CopyButton text={snippet.code} />
        </div>

        {/* Code content */}
        <div className="overflow-x-auto bg-gray-900">
          <pre className="p-6 text-sm leading-relaxed text-gray-100">
            <code>{snippet.code}</code>
          </pre>
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-6 flex gap-3">
        <Link href="/snippets" className="btn-secondary">
          ← Barchasi
        </Link>
        <Link href="/snippets/new" className="btn-primary">
          + Yangi snippet
        </Link>
      </div>
    </div>
  );
}

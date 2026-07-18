import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, Calendar, Sparkles, User, Tag, Bot } from "lucide-react";
import { Link } from "@/i18n/routing";
import CopyButton from "@/components/CopyButton";
import PromptActions from "@/components/PromptActions";
import BookmarkButton from "@/components/BookmarkButton";
import CommentsSection from "@/components/CommentsSection";
import ShareButton from "@/components/ShareButton";

interface Props {
  params: { id: string; locale: string };
}

export default async function PromptDetailPage({ params: { id, locale } }: Props) {
  setRequestLocale(locale);
  const supabase = createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: prompt, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !prompt) notFound();

  const isAuthor = user?.id === prompt.author_id;

  // Increment view count
  await supabase.rpc("increment_view_count", { table_name: "prompts", item_id: id });

  const createdAt = new Date(prompt.created_at).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Back */}
      <Link
        href="/prompts"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4 transition-transform " />
        Prompts'ga qaytish
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-sm font-semibold text-violet-400">
            <Sparkles className="h-3.5 w-3.5" />
            {prompt.category}
          </span>
          {prompt.ai_model && prompt.ai_model !== "Any" && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-sm font-medium text-blue-400">
              <Bot className="h-3.5 w-3.5" />
              {prompt.ai_model}
            </span>
          )}
          {prompt.tags?.map((tag: string) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-medium text-gray-400"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-2xl font-bold text-white sm:text-3xl">{prompt.title}</h1>

        {prompt.description && (
          <p className="mt-3 text-gray-400 leading-relaxed">{prompt.description}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            {prompt.author_avatar ? (
              <img src={prompt.author_avatar} alt={prompt.author_name} className="h-5 w-5 rounded-full" />
            ) : (
              <User className="h-4 w-4" />
            )}
            {prompt.author_name ? (
              <Link href={`/users/${prompt.author_name}`} className="hover:text-brand transition-colors">
                {prompt.author_name}
              </Link>
            ) : (
              "Anonymous"
            )}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {createdAt}
          </span>
          <span className="flex items-center gap-1.5">
            👍 {prompt.votes || 0} ovoz
          </span>
          <BookmarkButton promptId={prompt.id} />
        </div>
      </div>

      {/* Prompt content */}
      <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(124,92,252,0.1)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#111] px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Sparkles className="h-4 w-4 text-violet-500" />
            Prompt matni
          </span>
          <CopyButton text={prompt.content} label="Promptni nusxalash" />
        </div>

        {/* Content */}
        <div className="p-6 bg-[#0A0A0A]">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
            {prompt.content}
          </p>
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-6 flex gap-3">
        <Link href="/prompts" className="btn-secondary">
          ← Barchasi
        </Link>
        <Link href="/prompts/new" className="btn-primary">
          + Yangi prompt
        </Link>
        {isAuthor && (
          <PromptActions promptId={prompt.id} locale={locale} />
        )}
        <ShareButton title={prompt.title} url={`/prompts/${prompt.id}`} />
      </div>

      {/* Comments */}
      <CommentsSection promptId={prompt.id} />
    </div>
  );
}

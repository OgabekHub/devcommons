import { createSupabaseServer } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { ArrowLeft, Folder, Code2, TerminalSquare, Lock, Globe } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import SpotlightCard from "@/components/SpotlightCard";
import VoteButton from "@/components/VoteButton";
import BookmarkButton from "@/components/BookmarkButton";

interface Props {
  params: { id: string; locale: string };
}

export default async function CollectionPage({ params: { id, locale } }: Props) {
  const supabase = createSupabaseServer();
  const t = await getTranslations("Collections");

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch collection
  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select(`
      *,
      author:users (name, username, avatar_url)
    `)
    .eq("id", id)
    .single();

  if (collectionError || !collection) {
    notFound();
  }

  // Is it private and not mine?
  if (!collection.is_public && collection.author_id !== user?.id) {
    notFound();
  }

  // Fetch items
  const { data: items, error: itemsError } = await supabase
    .from("collection_items")
    .select(`
      id,
      added_at,
      snippet:snippets(*, author:users(name, username, avatar_url)),
      prompt:prompts(*, author:users(name, username, avatar_url))
    `)
    .eq("collection_id", id)
    .order("added_at", { ascending: false });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 pb-20">
      <Link
        href={`/${locale}/profile`}
        className="mb-8 flex w-fit items-center gap-2 rounded-xl border border-white/5 bg-[#111] px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:border-white/10 hover:bg-white/5 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back_to_profile")}
      </Link>

      {/* Header */}
      <div className="mb-10 rounded-2xl border border-white/10 bg-[#0F0A1F]/50 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <Folder className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white sm:text-3xl">{collection.title}</h1>
                {collection.is_public ? (
                  <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                    <Globe className="h-3 w-3" />
                    Public
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-gray-500/10 px-2 py-0.5 text-xs font-medium text-gray-400">
                    <Lock className="h-3 w-3" />
                    Private
                  </span>
                )}
              </div>
              <p className="mt-2 text-gray-400">
                {collection.description || t("no_description")}
              </p>
              
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <span>By @{collection.author?.username}</span>
                <span>•</span>
                <span>{items?.length || 0} {t("items_count")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item: any) => {
            const isSnippet = !!item.snippet;
            const content = isSnippet ? item.snippet : item.prompt;
            if (!content) return null;

            return (
              <SpotlightCard key={item.id} className="flex h-full flex-col p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#111]">
                      {isSnippet ? (
                        <Code2 className="h-5 w-5 text-gray-400" />
                      ) : (
                        <TerminalSquare className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <Link
                        href={`/${locale}/${isSnippet ? 'snippets' : 'prompts'}/${content.id}`}
                        className="truncate text-lg font-bold text-white hover:text-brand"
                      >
                        {content.title}
                      </Link>
                      <div className="truncate text-sm text-gray-500">
                        @{content.author?.username || "yashirin"}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mb-6 line-clamp-3 text-sm text-gray-400">
                  {content.description || content.code || content.content}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex gap-2">
                    {isSnippet && content.language && (
                      <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-gray-300">
                        {content.language}
                      </span>
                    )}
                    {content.model && (
                      <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-gray-300">
                        {content.model}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <VoteButton 
                      id={content.id} 
                      type={isSnippet ? "snippet" : "prompt"} 
                      initialVotes={content.votes || 0}
                    />
                    <BookmarkButton 
                      snippetId={isSnippet ? content.id : undefined}
                      promptId={!isSnippet ? content.id : undefined}
                      compact
                    />
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-gray-500">
          <Folder className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>{t("empty_collection")}</p>
        </div>
      )}
    </div>
  );
}

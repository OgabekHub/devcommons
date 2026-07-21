import { createSupabaseServer } from "@/lib/supabase-server";
import { Link } from "@/i18n/routing";
import SpotlightCard from "@/components/SpotlightCard";
import { Code2, Sparkles, Search as SearchIcon } from "lucide-react";
import VoteButton from "@/components/VoteButton";
import BookmarkButton from "@/components/BookmarkButton";

interface Props {
  searchParams: { q?: string };
  params: { locale: string };
}

export default async function SearchPage({ searchParams, params: { locale } }: Props) {
  const query = searchParams.q || "";
  const supabase = createSupabaseServer();

  let snippets: any[] = [];
  let prompts: any[] = [];

  if (query) {
    const term = `%${query}%`;
    const [snippetsRes, promptsRes] = await Promise.all([
      supabase.from("snippets").select("*, author:users(name, username, avatar_url)").or(`title.ilike.${term},description.ilike.${term},code.ilike.${term}`).limit(20),
      supabase.from("prompts").select("*, author:users(name, username, avatar_url)").or(`title.ilike.${term},description.ilike.${term},content.ilike.${term}`).limit(20)
    ]);
    snippets = snippetsRes.data || [];
    prompts = promptsRes.data || [];
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 pb-20">
      <div className="mb-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand mb-6">
          <SearchIcon className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Qidiruv natijalari
        </h1>
        {query ? (
          <p className="mt-4 text-gray-400">
            "<strong className="text-white">{query}</strong>" bo'yicha topilgan ma'lumotlar
          </p>
        ) : (
          <p className="mt-4 text-gray-400">
            Qidirish uchun yuqoridagi maydonga so'z kiriting
          </p>
        )}
      </div>

      {query && snippets.length === 0 && prompts.length === 0 && (
        <div className="card border-dashed border-white/10 p-12 text-center text-gray-500">
          <p>Hech narsa topilmadi. Boshqa so'z bilan urinib ko'ring.</p>
        </div>
      )}

      {query && (snippets.length > 0 || prompts.length > 0) && (
        <div className="space-y-12">
          {/* Snippets Section */}
          {snippets.length > 0 && (
            <div>
              <div className="mb-6 flex items-center gap-2">
                <Code2 className="h-5 w-5 text-brand" />
                <h2 className="text-xl font-bold text-white">Snippets ({snippets.length})</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {snippets.map((snippet) => (
                  <SpotlightCard key={snippet.id} className="flex h-full flex-col p-6">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="overflow-hidden">
                        <Link
                          href={`/${locale}/snippets/${snippet.id}`}
                          className="truncate text-lg font-bold text-white hover:text-brand block"
                        >
                          {snippet.title}
                        </Link>
                        <div className="truncate text-sm text-gray-500 mt-1">
                          @{snippet.author?.username || "yashirin"}
                        </div>
                      </div>
                      <span className="flex-shrink-0 rounded-lg bg-brand/10 border border-brand/20 px-2 py-0.5 text-xs font-semibold text-brand">
                        {snippet.language}
                      </span>
                    </div>

                    <p className="mb-6 line-clamp-3 text-sm text-gray-400">
                      {snippet.description || snippet.code}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                      <span className="text-xs text-gray-500">
                        {new Date(snippet.created_at).toLocaleDateString("uz-UZ")}
                      </span>
                      <div className="flex items-center gap-2">
                        <VoteButton 
                          id={snippet.id} 
                          type="snippet" 
                          initialVotes={snippet.votes || 0}
                        />
                        <BookmarkButton snippetId={snippet.id} compact />
                      </div>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          )}

          {/* Prompts Section */}
          {prompts.length > 0 && (
            <div>
              <div className="mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-400" />
                <h2 className="text-xl font-bold text-white">Prompts ({prompts.length})</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {prompts.map((prompt) => (
                  <SpotlightCard key={prompt.id} className="flex h-full flex-col p-6">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="overflow-hidden">
                        <Link
                          href={`/${locale}/prompts/${prompt.id}`}
                          className="truncate text-lg font-bold text-white hover:text-brand block"
                        >
                          {prompt.title}
                        </Link>
                        <div className="truncate text-sm text-gray-500 mt-1">
                          @{prompt.author?.username || "yashirin"}
                        </div>
                      </div>
                      <span className="flex-shrink-0 rounded-lg bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-400">
                        {prompt.category}
                      </span>
                    </div>

                    <p className="mb-6 line-clamp-3 text-sm text-gray-400">
                      {prompt.description || prompt.content}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                      <span className="text-xs text-gray-500">
                        {new Date(prompt.created_at).toLocaleDateString("uz-UZ")}
                      </span>
                      <div className="flex items-center gap-2">
                        <VoteButton 
                          id={prompt.id} 
                          type="prompt" 
                          initialVotes={prompt.votes || 0}
                        />
                        <BookmarkButton promptId={prompt.id} compact />
                      </div>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

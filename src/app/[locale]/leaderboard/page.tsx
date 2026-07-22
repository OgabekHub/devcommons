import { createSupabaseServer } from "@/lib/supabase-server";
import { Link } from "@/i18n/routing";
import { Trophy, Eye, Code2, Sparkles, Heart } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

export default async function LeaderboardPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const supabase = createSupabaseServer();

  // Fetch top 10 snippets by votes
  const { data: topSnippets } = await supabase
    .from("snippets")
    .select("*, author:users(github_username, avatar_url)")
    .order("votes", { ascending: false })
    .limit(10);

  // Fetch top 10 prompts by votes
  const { data: topPrompts } = await supabase
    .from("prompts")
    .select("*, author:users(github_username, avatar_url)")
    .order("votes", { ascending: false })
    .limit(10);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 pb-20">
      <div className="mb-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-6 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <Trophy className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Leaderboard
        </h1>
        <p className="mt-4 text-gray-400">
          Hamjamiyatimizning eng sara va foydali yechimlari reytingi
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Top Snippets */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0A0A]/80 p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-brand/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Code2 className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">Top Snippets</h2>
          </div>

          <div className="space-y-4 relative z-10">
            {topSnippets?.map((snippet, i) => (
              <Link 
                href={`/${locale}/snippets/${snippet.id}`}
                key={snippet.id} 
                className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/5 hover:border-brand/30"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold ${
                  i === 0 ? "bg-amber-500/20 text-amber-500" :
                  i === 1 ? "bg-gray-300/20 text-gray-300" :
                  i === 2 ? "bg-amber-700/20 text-amber-600" :
                  "bg-white/5 text-gray-500"
                }`}>
                  #{i + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="truncate font-semibold text-white group-hover:text-brand">{snippet.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span className="truncate">@{snippet.author?.github_username || "yashirin"}</span>
                    <span>•</span>
                    <span className="text-brand">{snippet.language}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">{snippet.view_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-brand bg-brand/10 px-2.5 py-1 rounded-lg">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm font-bold">{snippet.votes || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Prompts */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0A0A]/80 p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-violet-500/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">Top Prompts</h2>
          </div>

          <div className="space-y-4 relative z-10">
            {topPrompts?.map((prompt, i) => (
              <Link 
                href={`/${locale}/prompts/${prompt.id}`}
                key={prompt.id} 
                className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/5 hover:border-violet-500/30"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold ${
                  i === 0 ? "bg-amber-500/20 text-amber-500" :
                  i === 1 ? "bg-gray-300/20 text-gray-300" :
                  i === 2 ? "bg-amber-700/20 text-amber-600" :
                  "bg-white/5 text-gray-500"
                }`}>
                  #{i + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="truncate font-semibold text-white group-hover:text-violet-400">{prompt.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span className="truncate">@{prompt.author?.github_username || "yashirin"}</span>
                    <span>•</span>
                    <span className="text-violet-400">{prompt.category}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">{prompt.view_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-lg">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm font-bold">{prompt.votes || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Code2, Sparkles, Calendar, Github, ArrowLeft, Eye, Heart } from "lucide-react";
import { Link } from "@/i18n/routing";
import FollowButton from "@/components/FollowButton";

interface Props {
  params: { username: string; locale: string };
}

export default async function PublicProfilePage({ params: { username, locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("User");
  const supabase = createSupabaseServer();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("github_username", username)
    .single();

  if (error || !user) notFound();

  // Get user's snippets
  const { data: snippets } = await supabase
    .from("snippets")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  // Get user's prompts
  const { data: prompts } = await supabase
    .from("prompts")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  const totalViews = ((snippets || []).reduce((sum, s) => sum + (s.view_count || 0), 0)) +
                    ((prompts || []).reduce((sum, p) => sum + (p.view_count || 0), 0));
  const totalVotes = ((snippets || []).reduce((sum, s) => sum + (s.votes || 0), 0)) +
                    ((prompts || []).reduce((sum, p) => sum + (p.votes || 0), 0));

  const createdAt = new Date(user.created_at).toLocaleDateString(
    locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Back */}
      <Link
        href="/"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </Link>

      {/* Profile Card */}
      <div className="card mb-8 flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left">
        <div className="relative">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.github_username}
              width={96}
              height={96}
              className="h-24 w-24 rounded-2xl shadow-lg ring-2 ring-white/10"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20 text-3xl font-bold text-brand">
              {user.github_username[0].toUpperCase()}
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 rounded-lg bg-[#111] p-1.5 border border-white/10">
            <Github className="h-4 w-4 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{user.github_username}</h1>
              {user.bio && (
                <p className="mt-1 text-sm text-gray-300">{user.bio}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                <Calendar className="inline h-3 w-3 mr-1" />
                {createdAt} {t("member_since")}
              </p>
            </div>
            <FollowButton targetUserId={user.id} />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 border border-brand/20 px-3 py-1 text-sm font-medium text-brand">
              <Code2 className="h-3.5 w-3.5" />
              {snippets?.length || 0} snippet
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-sm font-medium text-violet-400">
              <Sparkles className="h-3.5 w-3.5" />
              {prompts?.length || 0} prompt
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-sm font-medium text-gray-400">
              <Eye className="h-3.5 w-3.5 text-brand" />
              {totalViews} {t("views") || "views"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-sm font-medium text-gray-400">
              <Heart className="h-3.5 w-3.5 text-red-500" />
              {totalVotes} {t("votes") || "votes"}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Snippets */}
      {snippets && snippets.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-white">{t("recent_snippets")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {snippets.map((snippet: any) => (
              <Link
                key={snippet.id}
                href={`/snippets/${snippet.id}`}
                className="card card-shine group block"
              >
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-semibold text-white transition-colors group-hover:text-brand">{snippet.title}</h3>
                  <span className="ml-2 rounded-lg bg-brand/10 border border-brand/20 px-2 py-0.5 text-xs font-semibold text-brand">{snippet.language}</span>
                </div>
                {snippet.description && <p className="text-sm text-gray-400 line-clamp-2">{snippet.description}</p>}
                <p className="mt-2 text-xs text-gray-500">👍 {snippet.votes} · {new Date(snippet.created_at).toLocaleDateString(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US")}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Prompts */}
      {prompts && prompts.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">{t("recent_prompts")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {prompts.map((prompt: any) => (
              <Link
                key={prompt.id}
                href={`/prompts/${prompt.id}`}
                className="card card-shine group block"
              >
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-semibold text-white transition-colors group-hover:text-brand">{prompt.title}</h3>
                  <span className="ml-2 rounded-lg bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-400">{prompt.category}</span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{prompt.content}</p>
                <p className="mt-2 text-xs text-gray-400">👍 {prompt.votes} · {new Date(prompt.created_at).toLocaleDateString(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US")}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!snippets || snippets.length === 0) && (!prompts || prompts.length === 0) && (
        <div className="card border-dashed border-white/10 p-10 text-center">
          <p className="text-gray-400">{t("empty")}</p>
        </div>
      )}
    </div>
  );
}

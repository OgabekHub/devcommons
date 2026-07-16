import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Code2, Sparkles, Calendar, Github } from "lucide-react";
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
    .order("created_at", { ascending: false })
    .limit(10);

  // Get user's prompts
  const { data: prompts } = await supabase
    .from("prompts")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

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
        {t("back")}
      </Link>

      {/* Profile Card */}
      <div className="card mb-8 flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left">
        <div className="relative">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.github_username}
              className="h-24 w-24 rounded-2xl shadow-md"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-brand-50 text-3xl font-bold text-brand">
              {user.github_username[0].toUpperCase()}
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 rounded-lg bg-gray-900 p-1.5">
            <Github className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{user.github_username}</h1>
              <p className="text-sm text-gray-500">
                <Calendar className="inline h-3 w-3 mr-1" />
                {createdAt} {t("member_since")}
              </p>
            </div>
            <FollowButton targetUserId={user.id} />
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-3 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1 text-sm font-medium text-brand">
              <Code2 className="h-3.5 w-3.5" />
              {snippets?.length || 0} snippet
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1 text-sm font-medium text-violet-600">
              <Sparkles className="h-3.5 w-3.5" />
              {prompts?.length || 0} prompt
            </span>
          </div>
        </div>
      </div>

      {/* Recent Snippets */}
      {snippets && snippets.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">{t("recent_snippets")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {snippets.map((snippet: any) => (
              <Link
                key={snippet.id}
                href={`/snippets/${snippet.id}`}
                className="card card-shine group block"
              >
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-semibold transition-colors group-hover:text-brand">{snippet.title}</h3>
                  <span className="ml-2 rounded-lg bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand">{snippet.language}</span>
                </div>
                {snippet.description && <p className="text-sm text-gray-500 line-clamp-2">{snippet.description}</p>}
                <p className="mt-2 text-xs text-gray-400">👍 {snippet.votes} · {new Date(snippet.created_at).toLocaleDateString(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US")}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Prompts */}
      {prompts && prompts.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">{t("recent_prompts")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {prompts.map((prompt: any) => (
              <Link
                key={prompt.id}
                href={`/prompts/${prompt.id}`}
                className="card card-shine group block"
              >
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-semibold transition-colors group-hover:text-brand">{prompt.title}</h3>
                  <span className="ml-2 rounded-lg bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-600">{prompt.category}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{prompt.content}</p>
                <p className="mt-2 text-xs text-gray-400">👍 {prompt.votes} · {new Date(prompt.created_at).toLocaleDateString(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US")}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!snippets || snippets.length === 0) && (!prompts || prompts.length === 0) && (
        <div className="card border-dashed p-10 text-center">
          <p className="text-gray-500">{t("empty")}</p>
        </div>
      )}
    </div>
  );
}

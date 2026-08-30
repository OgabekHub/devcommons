import { notFound } from "next/navigation";
import Image from "next/image";
import { createSupabaseServer } from "@/lib/supabase-server";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Calendar, Github, ArrowLeft, Eye, Heart, Users, UserPlus } from "lucide-react";
import { Link } from "@/i18n/routing";
import FollowButton from "@/components/FollowButton";
import UserContentTabs from "@/components/UserContentTabs";
import UserBadges from "@/components/UserBadges";

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

  const [
    { data: snippets },
    { data: prompts },
    { data: followers },
    { data: following }
  ] = await Promise.all([
    supabase.from("snippets").select("*").eq("author_id", user.id).order("created_at", { ascending: false }),
    supabase.from("prompts").select("*").eq("author_id", user.id).order("created_at", { ascending: false }),
    supabase.from("follows").select("id").eq("following_id", user.id),
    supabase.from("follows").select("id").eq("follower_id", user.id),
  ]);

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
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Back */}
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </Link>

      {/* Profile Card */}
      <div className="card flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left">
        <div className="relative shrink-0">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.github_username}
              width={96}
              height={96}
              className="h-24 w-24 rounded-2xl shadow-lg ring-2 ring-ink/10 object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20 text-3xl font-bold text-brand">
              {user.github_username?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 rounded-lg bg-surface-subtle p-1.5 border border-line">
            <Github className="h-4 w-4 text-fg" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-fg truncate">{user.github_username}</h1>
              {user.bio && (
                <p className="mt-1 text-sm text-zinc-300 max-w-xl">{user.bio}</p>
              )}
              <p className="mt-2 text-xs text-zinc-500">
                <Calendar className="inline h-3.5 w-3.5 mr-1 text-zinc-400" />
                {createdAt} {t("member_since")}
              </p>
            </div>
            <div className="shrink-0 flex justify-center sm:justify-end">
              <FollowButton targetUserId={user.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Vercel / GitHub Style */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card p-4 text-center">
          <Eye className="mx-auto h-5 w-5 text-brand mb-1.5" />
          <p className="text-2xl font-bold text-fg">{totalViews}</p>
          <p className="text-xs text-zinc-500">{t("views") || "Views"}</p>
        </div>
        <div className="card p-4 text-center">
          <Heart className="mx-auto h-5 w-5 text-red-500 mb-1.5" />
          <p className="text-2xl font-bold text-fg">{totalVotes}</p>
          <p className="text-xs text-zinc-500">{t("votes") || "Votes"}</p>
        </div>
        <div className="card p-4 text-center">
          <Users className="mx-auto h-5 w-5 text-blue-500 mb-1.5" />
          <p className="text-2xl font-bold text-fg">{followers?.length || 0}</p>
          <p className="text-xs text-zinc-500">Followers</p>
        </div>
        <div className="card p-4 text-center">
          <UserPlus className="mx-auto h-5 w-5 text-green-500 mb-1.5" />
          <p className="text-2xl font-bold text-fg">{following?.length || 0}</p>
          <p className="text-xs text-zinc-500">Following</p>
        </div>
      </div>

      {/* Gamification Achievements & Badges */}
      <UserBadges
        stats={{
          snippetCount: snippets?.length || 0,
          promptCount: prompts?.length || 0,
          totalVotes,
          totalViews,
          followersCount: followers?.length || 0,
        }}
        showAll={false}
      />

      {/* Content Tabs (Snippets & Prompts) */}
      <UserContentTabs
        snippets={snippets || []}
        prompts={prompts || []}
        locale={locale}
        emptyText={t("empty")}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { User, Code2, Sparkles, LogOut, Github, Eye, Heart, Users, UserPlus, Bookmark, MapPin, Edit3, Check, X, Folder, Key, Copy, Plus } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import VoteButton from "@/components/VoteButton";

export default function ProfilePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [snippets, setSnippets] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [bookmarkedSnippets, setBookmarkedSnippets] = useState<any[]>([]);
  const [bookmarkedPrompts, setBookmarkedPrompts] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalVotes: 0,
    followers: 0,
    following: 0,
  });
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"snippets" | "prompts" | "saved" | "collections" | "api">("snippets");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [generatingKey, setGeneratingKey] = useState(false);
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const t = useTranslations("Profile");
  const locale = useLocale();
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = `/${locale}/auth`;
        return;
      }
      setUser(user);

      const [
        { data: snips },
        { data: proms },
        { data: follows },
        { data: following },
        { data: snippetBookmarks },
        { data: promptBookmarks },
        { data: userProfile },
        { data: userCollections },
        { data: apiKeysData },
      ] = await Promise.all([
        supabase.from("snippets").select("*").eq("author_id", user.id).order("created_at", { ascending: false }),
        supabase.from("prompts").select("*").eq("author_id", user.id).order("created_at", { ascending: false }),
        supabase.from("follows").select("*").eq("following_id", user.id),
        supabase.from("follows").select("*").eq("follower_id", user.id),
        supabase.from("bookmarks").select("snippet_id, snippets(*)").eq("user_id", user.id).not("snippet_id", "is", null),
        supabase.from("bookmarks").select("prompt_id, prompts(*)").eq("user_id", user.id).not("prompt_id", "is", null),
        supabase.from("users").select("bio").eq("id", user.id).single(),
        supabase.from("collections").select("*").eq("author_id", user.id).order("created_at", { ascending: false }),
        supabase.from("api_keys").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      setSnippets(snips ?? []);
      setPrompts(proms ?? []);
      setBookmarkedSnippets(snippetBookmarks?.map((b: any) => b.snippets).filter(Boolean) ?? []);
      setBookmarkedPrompts(promptBookmarks?.map((b: any) => b.prompts).filter(Boolean) ?? []);
      setCollections(userCollections ?? []);
      setApiKeys(apiKeysData ?? []);

      if (userProfile?.bio) {
        setBio(userProfile.bio);
        setBioInput(userProfile.bio);
      }

      const totalViews = (snips?.reduce((sum: number, s: any) => sum + (s.view_count || 0), 0) || 0) +
                        (proms?.reduce((sum: number, p: any) => sum + (p.view_count || 0), 0) || 0);
      const totalVotes = (snips?.reduce((sum: number, s: any) => sum + (s.votes || 0), 0) || 0) +
                        (proms?.reduce((sum: number, p: any) => sum + (p.votes || 0), 0) || 0);

      setStats({
        totalViews,
        totalVotes,
        followers: follows?.length || 0,
        following: following?.length || 0,
      });

      setLoading(false);
    };

    load();
  }, []);

  const handleGenerateKey = async () => {
    if (!user) return;
    setGeneratingKey(true);
    const rawKey = "dc_" + crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").substring(0, 8);
    
    const { data, error } = await supabase.from("api_keys").insert({
      user_id: user.id,
      name: "Default Key",
      key_hash: rawKey
    }).select().single();

    if (data) {
      setApiKeys([data, ...apiKeys]);
      setNewKey(rawKey);
    }
    setGeneratingKey(false);
  };

  const handleDeleteKey = async (id: string) => {
    await supabase.from("api_keys").delete().eq("id", id);
    setApiKeys(apiKeys.filter((k) => k.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = `/${locale}`;
  };

  const handleSaveBio = async () => {
    if (!user) return;
    await supabase.from("users").update({ bio: bioInput.trim() }).eq("id", user.id);
    setBio(bioInput.trim());
    setEditingBio(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url;
  const username = user.user_metadata?.user_name || user.user_metadata?.name;
  const email = user.email;
  const savedCount = bookmarkedSnippets.length + bookmarkedPrompts.length;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Profile Card */}
      <div className="card flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left">
        <div className="relative">
          {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={username}
                width={96}
                height={96}
                className="h-24 w-24 rounded-2xl shadow-lg shadow-brand/10 ring-2 ring-white/10"
              />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20">
              <User className="h-12 w-12 text-brand" />
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 rounded-lg bg-[#111] p-1.5 border border-white/10">
            <Github className="h-4 w-4 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{username}</h1>
          {email && <p className="text-sm text-gray-500">{email}</p>}

          {/* Bio */}
          <div className="mt-2">
            {editingBio ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder={t("bio_placeholder")}
                  maxLength={160}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-gray-500 focus:border-brand focus:outline-none"
                  autoFocus
                />
                <button onClick={handleSaveBio} className="rounded-lg bg-brand/20 p-1.5 text-brand hover:bg-brand/30 transition-colors">
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={() => { setEditingBio(false); setBioInput(bio); }} className="rounded-lg bg-white/5 p-1.5 text-gray-400 hover:bg-white/10 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingBio(true)}
                className="group inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-brand"
              >
                {bio ? (
                  <span>{bio}</span>
                ) : (
                  <span className="italic">{t("add_bio")}</span>
                )}
                <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-3 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 border border-brand/20 px-3 py-1 text-sm font-medium text-brand">
              <Code2 className="h-3.5 w-3.5" />
              {snippets.length} {t("snippets_count")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-sm font-medium text-violet-400">
              <Sparkles className="h-3.5 w-3.5" />
              {prompts.length} {t("prompts_count")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-sm font-medium text-amber-400">
              <Bookmark className="h-3.5 w-3.5" />
              {savedCount} {t("saved_count")}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20"
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="card p-4 text-center">
          <Eye className="mx-auto h-5 w-5 text-brand mb-2" />
          <p className="text-2xl font-bold text-white">{stats.totalViews}</p>
          <p className="text-xs text-gray-500">{t("views")}</p>
        </div>
        <div className="card p-4 text-center">
          <Heart className="mx-auto h-5 w-5 text-red-500 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.totalVotes}</p>
          <p className="text-xs text-gray-500">{t("votes")}</p>
        </div>
        <div className="card p-4 text-center">
          <Users className="mx-auto h-5 w-5 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.followers}</p>
          <p className="text-xs text-gray-500">{t("followers")}</p>
        </div>
        <div className="card p-4 text-center">
          <UserPlus className="mx-auto h-5 w-5 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.following}</p>
          <p className="text-xs text-gray-500">{t("following")}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setTab("snippets")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "snippets"
              ? "border-brand text-brand"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <Code2 className="h-4 w-4" />
          {t("tab_snippets")} ({snippets.length})
        </button>
        <button
          onClick={() => setTab("prompts")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "prompts"
              ? "border-brand text-brand"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          {t("tab_prompts")} ({prompts.length})
        </button>
        <button
          onClick={() => setTab("saved")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "saved"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <Bookmark className="h-4 w-4" />
          {t("tab_saved")} ({savedCount})
        </button>
        <button
          onClick={() => setTab("collections")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "collections"
              ? "border-blue-400 text-blue-400"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <Folder className="h-4 w-4" />
          {t("tab_collections", { fallback: "To'plamlar" })} ({collections.length})
        </button>
        <button
          onClick={() => setTab("api")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === "api"
              ? "border-emerald-400 text-emerald-400"
              : "border-transparent text-gray-400 hover:text-gray-200"
          }`}
        >
          <Key className="h-4 w-4" />
          API Keys
        </button>
      </div>

      {/* Content — Snippets */}
      {tab === "snippets" && (
        <div>
          {snippets.length === 0 ? (
            <div className="card border-dashed border-white/10 p-10 text-center">
              <Code2 className="mx-auto mb-3 h-8 w-8 text-gray-500" />
              <p className="text-gray-400">{t("no_snippets")}</p>
              <Link href="/snippets/new" className="btn-primary mt-4">
                {t("btn_add_snippet")}
              </Link>
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
                    <h3 className="font-semibold text-white transition-colors group-hover:text-brand">{s.title}</h3>
                    <span className="ml-2 rounded-lg bg-brand/10 border border-brand/20 px-2 py-0.5 text-xs font-semibold text-brand">{s.language}</span>
                  </div>
                  {s.description && <p className="text-sm text-gray-400 line-clamp-2">{s.description}</p>}
                  <div className="mt-3 flex items-center gap-3">
                    <VoteButton id={s.id} type="snippet" initialVotes={s.votes ?? 0} />
                    <span className="text-xs text-gray-500">
                      {new Date(s.created_at).toLocaleDateString(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content — Prompts */}
      {tab === "prompts" && (
        <div>
          {prompts.length === 0 ? (
            <div className="card border-dashed border-white/10 p-10 text-center">
              <Sparkles className="mx-auto mb-3 h-8 w-8 text-gray-500" />
              <p className="text-gray-400">{t("no_prompts")}</p>
              <Link href="/prompts/new" className="btn-primary mt-4">
                {t("btn_add_prompt")}
              </Link>
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
                    <h3 className="font-semibold text-white transition-colors group-hover:text-brand">{p.title}</h3>
                    <span className="ml-2 rounded-lg bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-400">{p.category}</span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">{p.content}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <VoteButton id={p.id} type="prompt" initialVotes={p.votes ?? 0} />
                    <span className="text-xs text-gray-500">
                      {new Date(p.created_at).toLocaleDateString(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content — Saved (Bookmarks) */}
      {tab === "saved" && (
        <div>
          {savedCount === 0 ? (
            <div className="card border-dashed border-white/10 p-10 text-center">
              <Bookmark className="mx-auto mb-3 h-8 w-8 text-gray-500" />
              <p className="text-gray-400">{t("no_saved")}</p>
              <Link href="/snippets" className="btn-primary mt-4">
                {t("discover")}
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {bookmarkedSnippets.map((s: any) => (
                <Link
                  key={s.id}
                  href={`/snippets/${s.id}` as any}
                  className="card card-shine group block"
                >
                  <div className="mb-1 flex items-center gap-1.5">
                    <Code2 className="h-3 w-3 text-brand" />
                    <span className="text-[10px] font-medium text-brand uppercase tracking-wide">Snippet</span>
                  </div>
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-semibold text-white transition-colors group-hover:text-brand">{s.title}</h3>
                    <span className="ml-2 rounded-lg bg-brand/10 border border-brand/20 px-2 py-0.5 text-xs font-semibold text-brand">{s.language}</span>
                  </div>
                  {s.description && <p className="text-sm text-gray-400 line-clamp-2">{s.description}</p>}
                  <p className="mt-2 text-xs text-gray-500">👍 {s.votes} · {new Date(s.created_at).toLocaleDateString(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US")}</p>
                </Link>
              ))}
              {bookmarkedPrompts.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/prompts/${p.id}` as any}
                  className="card card-shine group block"
                >
                  <div className="mb-1 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-violet-400" />
                    <span className="text-[10px] font-medium text-violet-400 uppercase tracking-wide">Prompt</span>
                  </div>
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-semibold text-white transition-colors group-hover:text-brand">{p.title}</h3>
                    <span className="ml-2 rounded-lg bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-400">{p.category}</span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">{p.content}</p>
                  <p className="mt-2 text-xs text-gray-500">👍 {p.votes} · {new Date(p.created_at).toLocaleDateString(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US")}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content — Collections */}
      {tab === "collections" && (
        <div>
          {collections.length === 0 ? (
            <div className="card border-dashed border-white/10 p-10 text-center">
              <Folder className="mx-auto mb-3 h-8 w-8 text-gray-500" />
              <p className="text-gray-400">{t("no_collections", { fallback: "Hali to'plamlar yo'q" })}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((c: any) => (
                <Link
                  key={c.id}
                  href={`/collections/${c.id}` as any}
                  className="card card-shine group block flex flex-col h-full"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20">
                      <Folder className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white transition-colors group-hover:text-blue-400 line-clamp-1">{c.title}</h3>
                      <p className="text-xs text-gray-500">{c.is_public ? "Public" : "Private"}</p>
                    </div>
                  </div>
                  {c.description && <p className="mb-4 text-sm text-gray-400 line-clamp-2">{c.description}</p>}
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(c.created_at).toLocaleDateString(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Content — API Keys */}
      {tab === "api" && (
        <div className="space-y-6">
          <div className="card p-6 border-emerald-500/20 bg-emerald-500/5">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Developer API Keys</h3>
                <p className="text-sm text-gray-400">DevCommons ma'lumotlarini o'z loyihalaringizda ishlating (Faqat GET so'rovlar uchun).</p>
              </div>
              <button 
                onClick={handleGenerateKey}
                disabled={generatingKey}
                className="btn-primary shrink-0"
              >
                <Plus className="w-4 h-4" />
                {generatingKey ? "Yaratilmoqda..." : "Yangi kalit yaratish"}
              </button>
            </div>

            {newKey && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-emerald-400">Yangi API Kalit yaratildi!</span>
                </div>
                <p className="text-sm text-gray-300 mb-3">Bu kalitni faqat hozir ko'ra olasiz. Iltimos nusxalab oling.</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 block p-3 rounded-lg bg-black border border-white/10 text-emerald-400 font-mono text-sm break-all">
                    {newKey}
                  </code>
                  <button 
                    onClick={() => navigator.clipboard.writeText(newKey)}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {apiKeys.length === 0 ? (
                <div className="text-center p-8 border border-white/5 rounded-xl border-dashed">
                  <Key className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">Hozircha API kalitlar yo'q</p>
                </div>
              ) : (
                apiKeys.map((k) => (
                  <div key={k.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-black/40">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">{k.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-gray-400 uppercase tracking-wider">
                          O'qish huquqi
                        </span>
                      </div>
                      <code className="text-xs text-gray-500 font-mono">
                        {k.key_hash.substring(0, 10)}...{k.key_hash.substring(k.key_hash.length - 4)}
                      </code>
                      <p className="text-xs text-gray-600 mt-2">
                        Yaratilgan: {new Date(k.created_at).toLocaleDateString()}
                        {k.last_used_at && ` • So'nggi marta ishlatilgan: ${new Date(k.last_used_at).toLocaleDateString()}`}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDeleteKey(k.id)}
                      className="text-sm px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      O'chirish
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MessageSquare, Send, Trash2, ThumbsUp } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { sendNotification } from "@/lib/notifications";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "@/components/Toaster";

interface Comment {
  id: string;
  content: string;
  votes: number;
  created_at: string;
  user_id: string;
  author_name: string;
  author_avatar: string | null;
  parent_id: string | null;
}

interface Props {
  snippetId?: string;
  promptId?: string;
}

export default function CommentsSection({ snippetId, promptId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  // Bir sessiyada bir izohga faqat bir marta ovoz + parallel bosishdan himoya
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const locale = useLocale();
  const t = useTranslations("Components");
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    loadComments();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippetId, promptId]);

  const loadComments = async () => {
    const query = snippetId
      ? supabase.from("comments").select("*, users(github_username, avatar_url)").eq("snippet_id", snippetId).is("parent_id", null).order("created_at", { ascending: false })
      : supabase.from("comments").select("*, users(github_username, avatar_url)").eq("prompt_id", promptId).is("parent_id", null).order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) console.error('Failed to load comments:', error);
    if (!error && data) {
      const mappedComments = data.map((c: any) => ({
        ...c,
        author_name: c.users?.github_username || "Anonymous",
        author_avatar: c.users?.avatar_url || null,
      }));
      setComments(mappedComments as Comment[]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from("comments").insert({
      user_id: user.id,
      snippet_id: snippetId || null,
      prompt_id: promptId || null,
      content: newComment.trim(),
    });

    if (!error) {
      setNewComment("");
      loadComments();

      // Find author and send notification
      const table = snippetId ? "snippets" : "prompts";
      const id = snippetId || promptId;
      if (id) {
        supabase.from(table).select("author_id").eq("id", id).single().then(({ data }) => {
          if (data?.author_id) {
            sendNotification({
              userId: data.author_id,
              type: snippetId ? "comment_snippet" : "comment_prompt",
              snippetId: snippetId || undefined,
              promptId: promptId || undefined,
            });
          }
        });
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    if (!user || busyIds.has(commentId)) return;
    if (!window.confirm(t("comment_delete_confirm"))) return;
    setBusyIds((s) => new Set(s).add(commentId));
    const { error } = await supabase.from("comments").delete().eq("id", commentId).eq("user_id", user.id);
    if (!error) {
      setComments(comments.filter(c => c.id !== commentId));
    } else {
      toast.error("Izohni o'chirishda xatolik");
    }
    setBusyIds((s) => { const n = new Set(s); n.delete(commentId); return n; });
  };

  const handleVote = async (commentId: string) => {
    if (!user) return;
    // Cheksiz ovozni to'xtatish: sessiyada bir marta + parallel bosish guard
    if (votedIds.has(commentId) || busyIds.has(commentId)) return;
    setBusyIds((s) => new Set(s).add(commentId));
    const { error } = await supabase.rpc("increment_comment_votes", { comment_id: commentId });
    if (!error) {
      setVotedIds((s) => new Set(s).add(commentId));
      setComments(comments.map(c => c.id === commentId ? { ...c, votes: c.votes + 1 } : c));
    } else {
      toast.error("Ovoz berishda xatolik");
    }
    setBusyIds((s) => { const n = new Set(s); n.delete(commentId); return n; });
  };

  if (loading) {
    return <div className="text-center text-zinc-500 py-8">{t("loading")}</div>;
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-zinc-400" />
        <h3 className="text-lg font-semibold text-zinc-100">{t("comments")} ({comments.length})</h3>
      </div>

      {/* Add comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t("comment_placeholder")}
            rows={3}
            className="input w-full resize-none bg-surface-subtle border-line text-zinc-100 placeholder:text-zinc-500"
            maxLength={1000}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="btn-primary flex items-center gap-2 px-4 py-2 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {submitting ? "..." : t("send")}
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-xl border border-line bg-ink/5 p-4 text-center text-sm text-zinc-400">
          {t("comments_login")} <Link href="/auth" className="text-brand hover:underline">{t("login")}</Link>
        </div>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center text-zinc-500 py-8">
          {t("no_comments")}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="card p-4">
              <div className="flex items-start gap-3">
                {comment.author_avatar ? (
                  <Image
                    src={comment.author_avatar}
                    alt={comment.author_name || "Author avatar"}
                    width={32}
                    height={32}
                    unoptimized
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-brand font-medium">
                    {comment.author_name[0]?.toUpperCase() || 'A'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-200">{comment.author_name}</span>
                    <span className="text-xs text-zinc-500">
                      {new Date(comment.created_at).toLocaleDateString(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-300 break-words">{comment.content}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <button
                      onClick={() => handleVote(comment.id)}
                      disabled={busyIds.has(comment.id) || votedIds.has(comment.id)}
                      aria-label="Izohga ovoz berish"
                      className={`flex items-center gap-1 text-xs transition-colors disabled:cursor-not-allowed ${
                        votedIds.has(comment.id) ? "text-brand" : "text-zinc-500 hover:text-brand"
                      }`}
                    >
                      <ThumbsUp className={`h-3 w-3 ${votedIds.has(comment.id) ? "fill-current" : ""}`} />
                      {comment.votes}
                    </button>
                    {user?.id === comment.user_id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={busyIds.has(comment.id)}
                        aria-label="Izohni o'chirish"
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        O&apos;chirish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

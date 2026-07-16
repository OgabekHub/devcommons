"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Trash2, ThumbsUp } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useLocale, useTranslations } from "next-intl";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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
  const locale = useLocale();
  const t = useTranslations("Components");
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    loadComments();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [snippetId, promptId]);

  const loadComments = async () => {
    const query = snippetId
      ? supabase.from("comments").select("*").eq("snippet_id", snippetId).is("parent_id", null).order("created_at", { ascending: false })
      : supabase.from("comments").select("*").eq("prompt_id", promptId).is("parent_id", null).order("created_at", { ascending: false });

    const { data, error } = await query;
    if (!error && data) {
      setComments(data as Comment[]);
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
      author_name: user.user_metadata?.user_name || user.user_metadata?.name || "Anonymous",
      author_avatar: user.user_metadata?.avatar_url || null,
    });

    if (!error) {
      setNewComment("");
      loadComments();
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    if (!user) return;
    const { error } = await supabase.from("comments").delete().eq("id", commentId).eq("user_id", user.id);
    if (!error) {
      setComments(comments.filter(c => c.id !== commentId));
    }
  };

  const handleVote = async (commentId: string) => {
    if (!user) return;
    // Simple vote increment (in production, use separate votes table)
    const { error } = await supabase.rpc("increment_comment_votes", { comment_id: commentId });
    if (!error) {
      setComments(comments.map(c => c.id === commentId ? { ...c, votes: c.votes + 1 } : c));
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-8">Yuklanmoqda...</div>;
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold">{t("comments")} ({comments.length})</h3>
      </div>

      {/* Add comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t("comment_placeholder")}
            rows={3}
            className="input w-full resize-none bg-white"
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
        <div className="rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-500">
          {t("comments_login")} <a href="/auth" className="text-brand hover:underline">{t("login")}</a>
        </div>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {t("no_comments")}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="card p-4">
              <div className="flex items-start gap-3">
                {comment.author_avatar ? (
                  <img src={comment.author_avatar} alt={comment.author_name} className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand font-medium">
                    {comment.author_name[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{comment.author_name}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString(locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <button
                      onClick={() => handleVote(comment.id)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-brand transition-colors"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {comment.votes}
                    </button>
                    {user?.id === comment.user_id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        O'chirish
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

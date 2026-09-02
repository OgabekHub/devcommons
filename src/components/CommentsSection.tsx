"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { MessageSquare, Send, Trash2, ThumbsUp, Reply, Pencil } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "@/components/Toaster";

interface Comment {
  id: string;
  content: string;
  votes: number;
  created_at: string;
  updated_at?: string | null;
  user_id: string;
  author_name: string;
  author_avatar: string | null;
  parent_id: string | null;
}

interface Props {
  snippetId?: string;
  promptId?: string;
}

const PARENTS_PAGE = 20;

export default function CommentsSection({ snippetId, promptId }: Props) {
  const [parents, setParents] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Record<string, Comment[]>>({});
  const [totalParents, setTotalParents] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  // Serverdan yuklangan ovoz holati (comment_votes) + parallel bosish guard
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const locale = useLocale();
  const t = useTranslations("Components");
  const supabase = createSupabaseBrowser();

  const itemFilter = useCallback(
    (q: any) => (snippetId ? q.eq("snippet_id", snippetId) : q.eq("prompt_id", promptId)),
    [snippetId, promptId]
  );

  const mapRow = (c: any): Comment => ({
    ...c,
    author_name: c.users?.github_username || "Anonymous",
    author_avatar: c.users?.avatar_url || null,
  });

  // Foydalanuvchining mavjud ovozlarini yuklash (migration v19'gacha jadval
  // bo'lmasligi mumkin — xato jimgina e'tiborsiz qoldiriladi)
  const loadVotedState = useCallback(
    async (uid: string, ids: string[]) => {
      if (!ids.length) return;
      const { data } = await supabase
        .from("comment_votes")
        .select("comment_id")
        .eq("user_id", uid)
        .in("comment_id", ids);
      if (data?.length) {
        setVotedIds((s) => {
          const n = new Set(s);
          for (const row of data) n.add(row.comment_id);
          return n;
        });
      }
    },
    [supabase]
  );

  const loadReplies = useCallback(
    async (parentIds: string[]) => {
      if (!parentIds.length) return {} as Record<string, Comment[]>;
      const { data } = await supabase
        .from("comments")
        .select("*, users(github_username, avatar_url)")
        .in("parent_id", parentIds)
        .order("created_at", { ascending: true });
      const grouped: Record<string, Comment[]> = {};
      for (const row of data ?? []) {
        const c = mapRow(row);
        (grouped[c.parent_id!] ??= []).push(c);
      }
      return grouped;
    },
    [supabase]
  );

  const loadPage = useCallback(
    async (page: number, append: boolean) => {
      const from = page * PARENTS_PAGE;
      let query = supabase
        .from("comments")
        .select("*, users(github_username, avatar_url)", { count: "exact" })
        .is("parent_id", null)
        .order("created_at", { ascending: false })
        .range(from, from + PARENTS_PAGE - 1);
      query = itemFilter(query);

      const { data, count, error } = await query;
      if (error) {
        console.error("Failed to load comments:", error);
        setLoading(false);
        return;
      }
      const pageParents = (data ?? []).map(mapRow);
      const grouped = await loadReplies(pageParents.map((p) => p.id));

      setParents((prev) => (append ? [...prev, ...pageParents] : pageParents));
      setReplies((prev) => (append ? { ...prev, ...grouped } : grouped));
      setTotalParents(count ?? pageParents.length);
      setLoading(false);

      const { data: auth } = await supabase.auth.getUser();
      if (auth.user) {
        const allIds = [
          ...pageParents.map((p) => p.id),
          ...Object.values(grouped).flat().map((r) => r.id),
        ];
        void loadVotedState(auth.user.id, allIds);
      }
    },
    [supabase, itemFilter, loadReplies, loadVotedState]
  );

  useEffect(() => {
    setLoading(true);
    void loadPage(0, false);
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippetId, promptId]);

  const loadedPages = Math.ceil(parents.length / PARENTS_PAGE);
  const hasMoreParents = parents.length < totalParents;

  // Izoh yuborish — bildirishnomani DB trigger yozadi (migration v19)
  const submitComment = async (content: string, parentId: string | null) => {
    if (!user || !content.trim()) return false;
    const { data, error } = await supabase
      .from("comments")
      .insert({
        user_id: user.id,
        snippet_id: snippetId || null,
        prompt_id: promptId || null,
        parent_id: parentId,
        content: content.trim(),
      })
      .select("*, users(github_username, avatar_url)")
      .single();

    if (error || !data) return false;
    const created = mapRow(data);
    if (parentId) {
      setReplies((prev) => ({ ...prev, [parentId]: [...(prev[parentId] ?? []), created] }));
    } else {
      setParents((prev) => [created, ...prev]);
      setTotalParents((n) => n + 1);
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (await submitComment(newComment, null)) setNewComment("");
    setSubmitting(false);
  };

  const handleReplySubmit = async (parentId: string) => {
    setSubmitting(true);
    if (await submitComment(replyText, parentId)) {
      setReplyText("");
      setReplyTo(null);
    }
    setSubmitting(false);
  };

  const patchComment = (id: string, patch: Partial<Comment>) => {
    setParents((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    setReplies((prev) => {
      const next: Record<string, Comment[]> = {};
      for (const [pid, list] of Object.entries(prev)) {
        next[pid] = list.map((c) => (c.id === id ? { ...c, ...patch } : c));
      }
      return next;
    });
  };

  const handleEditSave = async (commentId: string) => {
    if (!user || !editText.trim()) return;
    const { error } = await supabase
      .from("comments")
      .update({ content: editText.trim() })
      .eq("id", commentId)
      .eq("user_id", user.id);
    if (error) {
      toast.error(t("comment_edit_error"));
      return;
    }
    patchComment(commentId, { content: editText.trim(), updated_at: new Date().toISOString() });
    setEditingId(null);
    setEditText("");
  };

  const handleDelete = async (commentId: string) => {
    if (!user || busyIds.has(commentId)) return;
    if (!window.confirm(t("comment_delete_confirm"))) return;
    setBusyIds((s) => new Set(s).add(commentId));
    const { error } = await supabase.from("comments").delete().eq("id", commentId).eq("user_id", user.id);
    if (!error) {
      setParents((prev) => prev.filter((c) => c.id !== commentId));
      setReplies((prev) => {
        const next: Record<string, Comment[]> = {};
        for (const [pid, list] of Object.entries(prev)) {
          if (pid === commentId) continue;
          next[pid] = list.filter((c) => c.id !== commentId);
        }
        return next;
      });
    } else {
      toast.error(t("comment_delete_error"));
    }
    setBusyIds((s) => { const n = new Set(s); n.delete(commentId); return n; });
  };

  // Toggle ovoz (v19 RPC, dedup server tomonda). Migration hali ishga
  // tushirilmagan bo'lsa eski increment'ga tushamiz.
  const handleVote = async (commentId: string) => {
    if (!user || busyIds.has(commentId)) return;
    setBusyIds((s) => new Set(s).add(commentId));

    const { data, error } = await supabase.rpc("toggle_comment_vote", {
      target_comment_id: commentId,
    });

    if (!error) {
      const row = Array.isArray(data) ? data[0] : data;
      if (row) {
        patchComment(commentId, { votes: row.votes });
        setVotedIds((s) => {
          const n = new Set(s);
          if (row.voted) n.add(commentId);
          else n.delete(commentId);
          return n;
        });
      }
    } else if (!votedIds.has(commentId)) {
      // Fallback (v19'gacha): eski increment — sessiyada bir marta
      const { error: e2 } = await supabase.rpc("increment_comment_votes", { comment_id: commentId });
      if (!e2) {
        setVotedIds((s) => new Set(s).add(commentId));
        const found = parents.find((c) => c.id === commentId) ??
          Object.values(replies).flat().find((c) => c.id === commentId);
        patchComment(commentId, { votes: (found?.votes ?? 0) + 1 });
      } else {
        toast.error(t("comment_vote_error"));
      }
    }

    setBusyIds((s) => { const n = new Set(s); n.delete(commentId); return n; });
  };

  const totalCount = totalParents + Object.values(replies).reduce((n, l) => n + l.length, 0);

  const renderComment = (comment: Comment, isReply: boolean) => (
    <div key={comment.id} className={isReply ? "border-l-2 border-line pl-4" : "card p-4"}>
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
            {comment.author_name[0]?.toUpperCase() || "A"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-zinc-200">{comment.author_name}</span>
            <span className="text-xs text-zinc-500">
              {new Date(comment.created_at).toLocaleDateString(locale === "uz" ? "uz-UZ" : "en-US")}
              {comment.updated_at && comment.updated_at !== comment.created_at && (
                <span className="ml-1 text-zinc-600">· {t("comment_edited")}</span>
              )}
            </span>
          </div>

          {editingId === comment.id ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
                maxLength={1000}
                className="input w-full resize-none bg-surface-subtle border-line text-zinc-100"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditSave(comment.id)}
                  className="btn-primary btn-primary--sm"
                  disabled={!editText.trim()}
                >
                  {t("comment_save")}
                </button>
                <button
                  onClick={() => { setEditingId(null); setEditText(""); }}
                  className="text-xs text-zinc-400 hover:text-zinc-200"
                >
                  {t("comment_cancel")}
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-zinc-300 break-words">{comment.content}</p>
          )}

          <div className="mt-2 flex items-center gap-4">
            <button
              onClick={() => handleVote(comment.id)}
              disabled={!user || busyIds.has(comment.id)}
              aria-label={t("comment_vote_aria")}
              aria-pressed={votedIds.has(comment.id)}
              className={`flex items-center gap-1 text-xs transition-colors disabled:cursor-not-allowed ${
                votedIds.has(comment.id) ? "text-brand" : "text-zinc-500 hover:text-brand"
              }`}
            >
              <ThumbsUp className={`h-3 w-3 ${votedIds.has(comment.id) ? "fill-current" : ""}`} />
              {comment.votes}
            </button>
            {!isReply && user && (
              <button
                onClick={() => { setReplyTo(replyTo === comment.id ? null : comment.id); setReplyText(""); }}
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-brand transition-colors"
              >
                <Reply className="h-3 w-3" />
                {t("comment_reply")}
              </button>
            )}
            {user?.id === comment.user_id && (
              <>
                <button
                  onClick={() => { setEditingId(comment.id); setEditText(comment.content); }}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                  {t("comment_edit")}
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  disabled={busyIds.has(comment.id)}
                  aria-label={t("comment_delete_aria")}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" />
                  {t("comment_delete")}
                </button>
              </>
            )}
          </div>

          {/* Reply form */}
          {replyTo === comment.id && (
            <div className="mt-3 space-y-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t("comment_reply_placeholder")}
                rows={2}
                maxLength={1000}
                className="input w-full resize-none bg-surface-subtle border-line text-zinc-100 placeholder:text-zinc-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleReplySubmit(comment.id)}
                  disabled={submitting || !replyText.trim()}
                  className="btn-primary btn-primary--sm disabled:opacity-50"
                >
                  <Send className="h-3 w-3" />
                  {t("send")}
                </button>
                <button
                  onClick={() => { setReplyTo(null); setReplyText(""); }}
                  className="text-xs text-zinc-400 hover:text-zinc-200"
                >
                  {t("comment_cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies (1 daraja) */}
      {!isReply && (replies[comment.id]?.length ?? 0) > 0 && (
        <div className="mt-4 space-y-4 pl-6">
          {replies[comment.id]!.map((r) => renderComment(r, true))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div className="text-center text-zinc-500 py-8">{t("loading")}</div>;
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-zinc-400" />
        <h3 className="text-lg font-semibold text-zinc-100">{t("comments")} ({totalCount})</h3>
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
      {parents.length === 0 ? (
        <div className="text-center text-zinc-500 py-8">
          {t("no_comments")}
        </div>
      ) : (
        <div className="space-y-4">
          {parents.map((comment) => renderComment(comment, false))}
          {hasMoreParents && (
            <div className="text-center">
              <button
                onClick={() => void loadPage(loadedPages, true)}
                className="btn-secondary"
              >
                {t("comment_load_more")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

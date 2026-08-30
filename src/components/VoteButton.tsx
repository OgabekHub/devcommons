"use client";

import { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";
import { toast } from "@/components/Toaster";

interface Props {
  id: string;
  type: "snippet" | "prompt";
  initialVotes: number;
  initialVoted?: boolean;
}

export default function VoteButton({ id, type, initialVotes, initialVoted = false }: Props) {
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState(initialVoted);
  const [loading, setLoading] = useState(false);

  // Boshlang'ich ovoz holatini serverdan olamiz (parent bermagan bo'lsa),
  // aks holda qayta yuklashda foydalanuvchi ovozini bilmasdan yo'qotardi.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/vote?id=${encodeURIComponent(id)}&type=${type}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d && typeof d.voted === "boolean") setVoted(d.voted);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [id, type]);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link ichida bo'lgani uchun
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    const action = voted ? "remove" : "add";

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, action }),
      });

      if (res.ok) {
        const data = await res.json();
        setVotes(data.votes);
        // Server holatiga ishonamiz: already_voted bo'lsa "voted" o'zgarmaydi.
        if (data.already_voted) {
          setVoted(true);
        } else {
          setVoted(action === "add");
        }
      } else if (res.status === 401) {
        toast.info("Ovoz berish uchun tizimga kiring");
      } else {
        toast.error("Ovoz berishda xatolik yuz berdi");
      }
    } catch {
      toast.error("Tarmoq xatosi — qayta urinib ko'ring");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      aria-label={voted ? "Ovozni olib tashlash" : "Ovoz berish"}
      aria-pressed={voted}
      className={`icon-btn gap-1.5 px-2.5 py-1 text-xs font-medium ${
        voted ? "icon-btn--active-brand" : "icon-btn--brand"
      }`}
    >
      <ThumbsUp className={`h-3.5 w-3.5 shrink-0 ${loading ? "animate-pulse" : ""} ${voted ? "fill-current" : ""}`} />
      <span>{votes}</span>
    </button>
  );
}

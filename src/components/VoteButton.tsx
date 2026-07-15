"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";

interface Props {
  id: string;
  type: "snippet" | "prompt";
  initialVotes: number;
}

export default function VoteButton({ id, type, initialVotes }: Props) {
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link ichida bo'lgani uchun
    e.stopPropagation();

    if (voted || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type }),
      });

      if (res.ok) {
        const data = await res.json();
        setVotes(data.votes ?? votes + 1);
        setVoted(true);
      }
    } catch {
      // Xato — UI'ni o'zgartirmaymiz
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={voted || loading}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
        voted
          ? "bg-brand text-white"
          : "bg-gray-100 text-gray-500 hover:bg-brand-50 hover:text-brand"
      } disabled:cursor-default`}
    >
      <ThumbsUp className={`h-3.5 w-3.5 ${loading ? "animate-pulse" : ""}`} />
      {votes}
    </button>
  );
}

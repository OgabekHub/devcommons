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
        setVoted(!voted);
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
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
        voted
          ? "bg-brand text-white shadow-sm"
          : "bg-white/5 text-gray-400 border border-white/10 hover:bg-brand/10 hover:text-brand hover:border-brand/30"
      } disabled:opacity-50`}
    >
      <ThumbsUp className={`h-3.5 w-3.5 ${loading ? "animate-pulse" : ""} ${voted ? "fill-current" : ""}`} />
      {votes}
    </button>
  );
}

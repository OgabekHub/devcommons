"use client";

import React, { useState } from "react";
import { GitFork } from "lucide-react";
import { useRouter } from "@/i18n/routing";

interface Props {
  itemId: string;
  itemType: "snippet" | "prompt";
  title: string;
  content: string;
  languageOrCategory: string;
}

export default function ForkButton({ itemId, itemType, title, content, languageOrCategory }: Props) {
  const router = useRouter();
  const [forking, setForking] = useState(false);

  const handleFork = async () => {
    setForking(true);
    // Record fork count increase in database
    fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: itemId, type: itemType, metric: "forks_count" }),
    }).catch(() => {});

    // Save initial fork data to session storage to prepopulate new creation page
    const forkData = {
      parent_id: itemId,
      title: title.startsWith("Fork of") ? title : `Fork of ${title}`,
      content,
      languageOrCategory,
    };
    if (typeof window !== "undefined") {
      sessionStorage.setItem("devcommons_fork_item", JSON.stringify(forkData));
    }

    const targetRoute = itemType === "snippet" ? "/snippets/new" : "/prompts/new";
    router.push(targetRoute as any);
  };

  return (
    <button
      onClick={handleFork}
      disabled={forking}
      className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:bg-white/10 bg-white/5 border border-white/10 disabled:opacity-50"
      title="Fork this resource into a new customized revision"
    >
      <GitFork className={`h-4 w-4 shrink-0 ${forking ? "animate-bounce" : ""}`} />
      <span>{forking ? "Forking..." : "Fork"}</span>
    </button>
  );
}

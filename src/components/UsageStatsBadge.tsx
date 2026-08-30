"use client";

import React from "react";
import { Flame, GitFork } from "lucide-react";

interface Props {
  usedCount?: number;
  forksCount?: number;
  className?: string;
}

export default function UsageStatsBadge({ usedCount = 0, forksCount = 0, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-2 text-xs font-medium ${className}`}>
      <span className="inline-flex items-center gap-1.5 rounded-md bg-ink/5 border border-line px-2 py-0.5 text-zinc-400 transition-colors hover:bg-ink/10 hover:text-zinc-300" title="Copy / Download usage frequency">
        <Flame className="h-3.5 w-3.5 text-zinc-500" />
        <span>{usedCount} used</span>
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-md bg-ink/5 border border-line px-2 py-0.5 text-zinc-400 transition-colors hover:bg-ink/10 hover:text-zinc-300" title="Derived forks count">
        <GitFork className="h-3.5 w-3.5 text-zinc-500" />
        <span>{forksCount} forks</span>
      </span>
    </div>
  );
}

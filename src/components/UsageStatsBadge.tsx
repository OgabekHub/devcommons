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
    <div className={`flex items-center gap-3 text-xs text-gray-400 font-medium ${className}`}>
      <span className="inline-flex items-center gap-1 rounded-md bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 text-orange-400 transition-colors hover:bg-orange-500/15" title="Copy / Download usage frequency">
        <Flame className="h-3.5 w-3.5 text-orange-400 animate-pulse" />
        <span>{usedCount} used</span>
      </span>
      <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-blue-400 transition-colors hover:bg-blue-500/15" title="Derived forks count">
        <GitFork className="h-3.5 w-3.5 text-blue-400" />
        <span>{forksCount} forks</span>
      </span>
    </div>
  );
}

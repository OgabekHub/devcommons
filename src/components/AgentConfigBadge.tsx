"use client";

import React from "react";
import { detectAgentConfig } from "@/lib/agent-config";

interface Props {
  title?: string | null;
  language?: string | null;
  className?: string;
}

export default function AgentConfigBadge({ title, language, className = "" }: Props) {
  const config = detectAgentConfig(title, language);
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-all duration-300 ${config.className} ${className}`}
      title={`Verified AI Agent Config: ${config.defaultFilename}`}
    >
      <span>{config.badgeText}</span>
    </span>
  );
}

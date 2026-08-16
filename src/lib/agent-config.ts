export interface AgentConfigInfo {
  isAgentConfig: true;
  type: "Cursor Rule" | "Claude Config" | "Agent Rules" | "Windsurf Rule";
  badgeText: string;
  className: string;
  defaultFilename: string;
}

export const ALL_SUPPORTED_LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Rust",
  "Go",
  "Java",
  "C++",
  "C#",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "HTML",
  "CSS",
  "SQL",
  "Bash",
  "YAML",
  "JSON",
  "Cursor Rule",
  "Claude Config",
  "Agent Rules",
  "Windsurf Rule",
  "Other",
];

export const LANGUAGE_CONFIGS_MAP: Record<string, { color: string; dot: string; bgActive: string }> = {
  JavaScript: { color: "text-yellow-400", dot: "bg-yellow-400", bgActive: "bg-yellow-500/20 border-yellow-500/60" },
  TypeScript: { color: "text-blue-400", dot: "bg-blue-400", bgActive: "bg-blue-500/20 border-blue-500/60" },
  Python: { color: "text-emerald-400", dot: "bg-emerald-400", bgActive: "bg-emerald-500/20 border-emerald-500/60" },
  Rust: { color: "text-orange-400", dot: "bg-orange-400", bgActive: "bg-orange-500/20 border-orange-500/60" },
  Go: { color: "text-cyan-400", dot: "bg-cyan-400", bgActive: "bg-cyan-500/20 border-cyan-500/60" },
  Java: { color: "text-red-400", dot: "bg-red-400", bgActive: "bg-red-500/20 border-red-500/60" },
  "C++": { color: "text-purple-400", dot: "bg-purple-400", bgActive: "bg-purple-500/20 border-purple-500/60" },
  "C#": { color: "text-fuchsia-400", dot: "bg-fuchsia-400", bgActive: "bg-fuchsia-500/20 border-fuchsia-500/60" },
  PHP: { color: "text-indigo-400", dot: "bg-indigo-400", bgActive: "bg-indigo-500/20 border-indigo-500/60" },
  Ruby: { color: "text-rose-400", dot: "bg-rose-500", bgActive: "bg-rose-500/20 border-rose-500/60" },
  Swift: { color: "text-orange-500", dot: "bg-orange-500", bgActive: "bg-orange-500/20 border-orange-500/60" },
  Kotlin: { color: "text-violet-400", dot: "bg-violet-400", bgActive: "bg-violet-500/20 border-violet-500/60" },
  HTML: { color: "text-orange-400", dot: "bg-orange-400", bgActive: "bg-orange-500/20 border-orange-500/60" },
  CSS: { color: "text-sky-400", dot: "bg-sky-400", bgActive: "bg-sky-500/20 border-sky-500/60" },
  SQL: { color: "text-amber-400", dot: "bg-amber-400", bgActive: "bg-amber-500/20 border-amber-500/60" },
  Bash: { color: "text-green-400", dot: "bg-green-400", bgActive: "bg-green-500/20 border-green-500/60" },
  YAML: { color: "text-teal-400", dot: "bg-teal-400", bgActive: "bg-teal-500/20 border-teal-500/60" },
  JSON: { color: "text-amber-300", dot: "bg-amber-300", bgActive: "bg-amber-400/20 border-amber-400/60" },
  "Cursor Rule": { color: "text-zinc-200 font-semibold", dot: "bg-white", bgActive: "bg-white/10 border-white/20" },
  "Claude Config": { color: "text-zinc-200 font-semibold", dot: "bg-white", bgActive: "bg-white/10 border-white/20" },
  "Agent Rules": { color: "text-zinc-200 font-semibold", dot: "bg-white", bgActive: "bg-white/10 border-white/20" },
  "Windsurf Rule": { color: "text-zinc-200 font-semibold", dot: "bg-white", bgActive: "bg-white/10 border-white/20" },
  Other: { color: "text-gray-400", dot: "bg-gray-400", bgActive: "bg-gray-500/20 border-gray-500/60" },
};

export function detectAgentConfig(title?: string | null, language?: string | null): AgentConfigInfo | null {
  const t = title?.toLowerCase() || "";
  const l = language?.trim() || "";

  if (l === "Cursor Rule" || t.includes(".cursorrules") || t.includes("cursor rule")) {
    return {
      isAgentConfig: true,
      type: "Cursor Rule",
      badgeText: "⚡ Cursor Rule",
      className: "bg-white/5 text-zinc-300 border border-white/10",
      defaultFilename: ".cursorrules",
    };
  }

  if (l === "Claude Config" || t.includes("claude.md") || t.includes("claude config")) {
    return {
      isAgentConfig: true,
      type: "Claude Config",
      badgeText: "🤖 Claude Config",
      className: "bg-white/5 text-zinc-300 border border-white/10",
      defaultFilename: "CLAUDE.md",
    };
  }

  if (l === "Windsurf Rule" || t.includes(".windsurfrules") || t.includes("windsurf")) {
    return {
      isAgentConfig: true,
      type: "Windsurf Rule",
      badgeText: "🏄‍♂️ Windsurf Rule",
      className: "bg-white/5 text-zinc-300 border border-white/10",
      defaultFilename: ".windsurfrules",
    };
  }

  if (l === "Agent Rules" || t.includes("agents.md") || t.includes("ai.md") || t.includes("agent rules")) {
    return {
      isAgentConfig: true,
      type: "Agent Rules",
      badgeText: "🧠 Agent Rules",
      className: "bg-white/5 text-zinc-300 border border-white/10",
      defaultFilename: "AGENTS.md",
    };
  }

  return null;
}

"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Terminal, Copy, Check, Play, Sparkles, Code2, Cpu, Laptop, Layers } from "lucide-react";

interface CLICommand {
  cmd: string;
  output: string[];
}

const PRESET_COMMANDS: CLICommand[] = [
  {
    cmd: "devcommons pull clean-architecture",
    output: [
      "🔍 Resolving 'clean-architecture' across DevCommons index...",
      "✔ Found verified bundle: [Next.js 14 + TS Enterprise Rules]",
      "📂 Downloading context artifact (.cursorrules)... [100%]",
      "✨ Successfully saved to ./.cursorrules in working project directory!",
      "⚡ AI Agent Context initialized. Your IDE is ready for vibe-coding."
    ]
  },
  {
    cmd: "devcommons search rls-security",
    output: [
      "📡 Searching repository for keyword: 'rls-security'...",
      "┌── Top Matching Verified AI Workflows ─────────────────────────────────┐",
      "│ [1] Supabase RLS & PostgreSQL Strict Migration Cascade (320 Forks)    │",
      "│ [2] OWASP Top 10 API Security & Zod Validation Kit (215 Forks)       │",
      "│ [3] Claude Code Backend Protocol & RLS Checker (180 Forks)            │",
      "└────────────────────────────────────────────────────────────────────────┘",
      "💡 Tip: Run 'devcommons pull <number_or_name>' to import directly!"
    ]
  },
  {
    cmd: "devcommons info mcp",
    output: [
      "🤖 Model Context Protocol (MCP) Server Diagnostics:",
      "• Server Manifest: https://devcommons.uz/api/v1/mcp",
      "• Claude Code Status: ACTIVATED & COMPATIBLE",
      "• Registered Tools: devcommons_search_rules, devcommons_pull_context",
      "✔ Ready to plug into ~/.config/claude/mcp_settings.json!"
    ]
  }
];

export default function CLIEmulator() {
  const t = useTranslations("CLI");
  const [history, setHistory] = useState<Array<{ cmd: string; output: string[] }>>([
    {
      cmd: "devcommons --version",
      output: ["DevCommons CLI Engine v2.4.0 (x64-windows/linux/macos)", "Connected to global AI workflow index at https://devcommons.uz"]
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [executing, setExecuting] = useState(false);
  const [activeConfigTab, setActiveConfigTab] = useState<"cli" | "cursor" | "claude" | "mcp">("cli");
  const [copiedConfig, setCopiedConfig] = useState(false);

  const handleRunCommand = (cmdStr: string) => {
    setExecuting(true);
    setInputVal("");

    const foundPreset = PRESET_COMMANDS.find((p) => p.cmd.toLowerCase() === cmdStr.toLowerCase().trim()) || {
      cmd: cmdStr,
      output: [
        `📡 Contacting DevCommons Gateway API for '${cmdStr}'...`,
        "✔ Context rules retrieved successfully from decentralized registry!",
        "✨ Written to ./devcommons_imported.rules without conflicts.",
      ]
    };

    // Simulate typing delay
    setTimeout(() => {
      setHistory((prev) => [...prev, foundPreset]);
      setExecuting(false);
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleRunCommand(inputVal);
  };

  const copyConfigSnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const configSnippets = {
    cli: `# Terminal quick installation and usage\nnpx -y @devcommons/cli@latest pull clean-architecture\n\n# Or add globally to path\nnpm install -g @devcommons/cli\ndevcommons search "system prompts"`,
    cursor: `# In Cursor / VS Code settings or .cursorrules file:\n# Automatically import standards via command palette or rule inclusion:\n@import "https://devcommons.uz/api/v1/cli/pull?slug=clean-architecture&format=raw"`,
    claude: `# Claude Code / Terminal Agent initialization:\n# Export environment pointer before running interactive agent sessions\nexport DEVCOMMONS_REGISTRY="https://devcommons.uz/api/v1"\nclaude-code --rules="$(curl -sSL https://devcommons.uz/api/v1/cli/pull?slug=backend-security&format=raw)"`,
    mcp: `// Add this to your Claude Desktop config (mcp_settings.json):\n{\n  "mcpServers": {\n    "devcommons-ai-mcp": {\n      "command": "npx",\n      "args": ["-y", "@devcommons/mcp-server@latest"],\n      "env": {\n        "DEVCOMMONS_API": "https://devcommons.uz/api/v1"\n      }\n    }\n  }\n}`
  };

  return (
    <div className="space-y-12">
      {/* Interactive Bash Terminal Section */}
      <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-[#0B0D16] to-[#07090F] shadow-[0_0_50px_rgba(30,58,138,0.25)] overflow-hidden">
        {/* MacOS style window bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#121622] px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-xs font-bold text-gray-400">bash — devcommons@interactive-lab: ~</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Terminal Simulator
          </span>
        </div>

        <div className="p-6 font-mono text-xs sm:text-sm md:p-8">
          {/* Preset trigger pills */}
          <div className="mb-6 flex flex-wrap items-center gap-2 pb-4 border-b border-white/10">
            <span className="text-gray-400 text-xs flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Try Instant Commands:</span>
            </span>
            {PRESET_COMMANDS.map((p) => (
              <button
                key={p.cmd}
                onClick={() => handleRunCommand(p.cmd)}
                className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-cyan-300 transition hover:bg-cyan-500/20 hover:text-white flex items-center gap-1.5 active:scale-95 text-xs"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>{p.cmd}</span>
              </button>
            ))}
          </div>

          {/* Terminal History Output */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 text-gray-300">
            {history.map((h, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-white">
                  <span className="text-emerald-400">user@devcommons:~$</span>
                  <span className="text-cyan-400">{h.cmd}</span>
                </div>
                {h.output.map((line, lIdx) => (
                  <div
                    key={lIdx}
                    className={`leading-relaxed ${
                      line.startsWith("✔") || line.startsWith("✨") ? "text-emerald-400 font-bold" :
                      line.startsWith("📡") || line.startsWith("🔍") ? "text-amber-300" :
                      line.startsWith("┌") || line.startsWith("│") || line.startsWith("└") ? "text-purple-300 font-semibold" :
                      "text-gray-400"
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            ))}

            {executing && (
              <div className="flex items-center gap-2 text-amber-400 animate-pulse">
                <span>📡 Synchronizing with DevCommons cloud gateways...</span>
              </div>
            )}
          </div>

          {/* Input Prompt */}
          <form onSubmit={handleFormSubmit} className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4">
            <span className="text-emerald-400 font-bold shrink-0">user@devcommons:~$</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type any command (e.g., devcommons pull clean-architecture)..."
              className="flex-1 bg-transparent text-white font-mono text-sm focus:outline-none placeholder-gray-600"
            />
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-1.5 text-xs font-bold text-white transition hover:scale-105"
            >
              Run
            </button>
          </form>
        </div>
      </div>

      {/* IDE & MCP Integration Configuration Center */}
      <div className="rounded-3xl border border-white/10 bg-[#0A0C13] p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Cpu className="h-4 w-4 animate-spin text-cyan-400" />
              <span>Seamless Autonomous Agent Integration</span>
            </div>
            <h3 className="mt-1 text-2xl font-black text-white">{t("config_title")}</h3>
            <p className="mt-1 text-sm text-gray-400 max-w-2xl">{t("config_subtitle")}</p>
          </div>

          <button
            onClick={() => copyConfigSnippet(configSnippets[activeConfigTab])}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-105 shrink-0"
          >
            {copiedConfig ? (
              <>
                <Check className="h-4 w-4 text-white" />
                <span>{t("copied_btn")}</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>{t("copy_config_btn")}</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Selection */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {[
            { id: "cli", label: "Terminal & CLI", icon: Terminal },
            { id: "cursor", label: "Cursor & VS Code", icon: Code2 },
            { id: "claude", label: "Claude Code", icon: Laptop },
            { id: "mcp", label: "MCP Server (Model Context Protocol)", icon: Layers },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeConfigTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveConfigTab(item.id as any)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-500/15 text-cyan-300 shadow"
                    : "border-transparent bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? "text-cyan-400 animate-pulse" : ""}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Code Viewport */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#06080E] p-5 font-mono text-xs sm:text-sm text-gray-200 overflow-x-auto">
          <pre className="leading-relaxed text-cyan-200">
            {configSnippets[activeConfigTab]}
          </pre>
        </div>
      </div>
    </div>
  );
}

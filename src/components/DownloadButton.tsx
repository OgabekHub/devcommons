"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { detectAgentConfig } from "@/lib/agent-config";

interface Props {
  code: string;
  language: string;
  filename?: string;
  itemId?: string;
  itemType?: "snippet" | "prompt";
}

export default function DownloadButton({ code, language, filename, itemId, itemType }: Props) {
  const t = useTranslations("Components");
  const handleDownload = () => {
    if (itemId && itemType) {
      fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId, type: itemType, metric: "used_count" }),
      }).catch((err) => {
        console.error("Download failed:", err);
      });
    }
    const agentConfig = detectAgentConfig(filename, language);
    const extensions: Record<string, string> = {
      JavaScript: ".js",
      TypeScript: ".ts",
      Python: ".py",
      Rust: ".rs",
      Go: ".go",
      Java: ".java",
      "C++": ".cpp",
      "C#": ".cs",
      PHP: ".php",
      Ruby: ".rb",
      Swift: ".swift",
      Kotlin: ".kt",
      HTML: ".html",
      CSS: ".css",
      SQL: ".sql",
      Bash: ".sh",
      YAML: ".yml",
      JSON: ".json",
    };

    const ext = extensions[language] || ".txt";
    const defaultFilename = filename || (agentConfig ? agentConfig.defaultFilename : `snippet${ext}`);

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = defaultFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors duration-200 hover:bg-ink/10 hover:text-fg bg-ink/5 border border-line"
      title={t("download")}
    >
      <Download className="h-4 w-4 shrink-0" />
      <span>{t("download")}</span>
    </button>
  );
}

"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  code: string;
  language: string;
  filename?: string;
}

export default function DownloadButton({ code, language, filename }: Props) {
  const t = useTranslations("Components");
  const handleDownload = () => {
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
    const defaultFilename = filename || `snippet${ext}`;

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
      className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-400 transition-all hover:bg-white/10 hover:text-white bg-white/5 border border-white/10"
      title={t("download")}
    >
      <Download className="h-4 w-4" />
      {t("download")}
    </button>
  );
}

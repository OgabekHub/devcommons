"use client";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackConsole,
} from "@codesandbox/sandpack-react";
import { Play, Terminal, Globe, LayoutGrid, X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  code: string;
  language: string;
}

type TabType = "console" | "preview" | "split";

export default function LivePreview({ code, language }: Props) {
  const t = useTranslations("Actions");
  const [showPreview, setShowPreview] = useState(false);

  const langLower = language.toLowerCase().trim();
  const isJsOrTs = ["javascript", "js", "typescript", "ts"].includes(langLower);
  
  // JS/TS snippetlar odatda console.log ishlatadi, shuning uchun default konsol turadi
  const [tab, setTab] = useState<TabType>(isJsOrTs ? "console" : "preview");

  let template: "vanilla" | "react" | "vanilla-ts" = "vanilla";
  let files: Record<string, string> = {};

  if (langLower === "react" || langLower === "jsx" || langLower === "tsx") {
    template = "react";
    files = {
      "/App.js": code,
    };
  } else if (langLower === "html") {
    template = "vanilla";
    files = {
      "/index.html": code,
    };
  } else if (langLower === "css") {
    template = "vanilla";
    files = {
      "/styles.css": code,
      "/index.html": `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="preview-container">
    <h1>CSS Preview</h1>
    <p>This is a live preview of your CSS styles.</p>
  </div>
</body>
</html>`,
    };
  } else if (isJsOrTs) {
    template = "vanilla";
    files = {
      "/index.js": code,
    };
  } else {
    // Other unsupported languages won't show Sandpack Live Preview
    return null;
  }

  if (!showPreview) {
    return (
      <button
        onClick={() => setShowPreview(true)}
        className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 py-4 px-4 flex items-center justify-center gap-2 text-gray-400 hover:text-brand hover:border-brand/30 transition-all shadow-[0_0_20px_rgba(124,92,252,0.05)]"
      >
        <Play className="w-5 h-5" />
        <span className="font-semibold">{t("live_preview")}</span>
      </button>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-white/10 shadow-[0_0_30px_rgba(124,92,252,0.1)] transition-all">
      {/* Header with tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#111] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Live Preview</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded-lg bg-black/40 p-1 border border-white/10 text-xs">
          <button
            onClick={() => setTab("console")}
            className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-colors ${
              tab === "console" ? "bg-brand text-white shadow-sm" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Konsol (Output)</span>
          </button>
          <button
            onClick={() => setTab("preview")}
            className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-colors ${
              tab === "preview" ? "bg-brand text-white shadow-sm" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Web (DOM)</span>
          </button>
          <button
            onClick={() => setTab("split")}
            className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-colors ${
              tab === "split" ? "bg-brand text-white shadow-sm" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Ikkalasini</span>
          </button>
        </div>

        <button
          onClick={() => setShowPreview(false)}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          title="Yopish"
        >
          <X className="h-3.5 w-3.5" />
          <span>Yopish</span>
        </button>
      </div>

      {/* Sandpack Workspace */}
      <div className="w-full bg-[#111]">
        <SandpackProvider template={template} files={files} theme="dark">
          <SandpackLayout style={{ height: "420px", border: "none", borderRadius: 0, margin: 0, width: "100%" }}>
            <SandpackPreview
              style={{
                height: "100%",
                flex: 1,
                display: tab === "console" ? "none" : "flex",
              }}
              showOpenInCodeSandbox={false}
            />
            <SandpackConsole
              style={{
                height: "100%",
                flex: 1,
                display: tab === "preview" ? "none" : "flex",
              }}
            />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
}

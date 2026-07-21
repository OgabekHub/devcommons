"use client";

import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";
import { Play } from "lucide-react";
import { useState } from "react";

interface Props {
  code: string;
  language: string;
}

export default function LivePreview({ code, language }: Props) {
  const [showPreview, setShowPreview] = useState(false);

  // Default to vanilla (HTML/JS/CSS)
  let template: any = "vanilla";
  let files: any = {};

  const langLower = language.toLowerCase();

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
    <p>This is a live preview of your CSS.</p>
  </div>
</body>
</html>`,
    };
  } else if (langLower === "javascript" || langLower === "js" || langLower === "typescript" || langLower === "ts") {
    template = "vanilla";
    files = {
      "/index.js": code,
    };
  } else {
    // If not a recognized runnable language for sandpack, don't show preview
    return null;
  }

  if (!showPreview) {
    return (
      <button 
        onClick={() => setShowPreview(true)}
        className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 py-4 px-4 flex items-center justify-center gap-2 text-gray-400 hover:text-brand hover:border-brand/30 transition-all shadow-[0_0_20px_rgba(124,92,252,0.05)]"
      >
        <Play className="w-5 h-5" />
        <span className="font-semibold">Live Previewni ishga tushirish (Sandpack)</span>
      </button>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-white/10 shadow-[0_0_30px_rgba(124,92,252,0.1)] fade-in">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#111] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Live Preview</span>
        </div>
        <button 
          onClick={() => setShowPreview(false)}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Yopish
        </button>
      </div>
      
      <div className="h-[500px] w-full bg-black">
        <SandpackProvider template={template} files={files} theme="dark">
          <SandpackPreview className="h-full w-full" showOpenInCodeSandbox={false} />
        </SandpackProvider>
      </div>
    </div>
  );
}

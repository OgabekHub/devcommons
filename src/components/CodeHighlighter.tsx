"use client";

import React from "react";
import Editor from "@monaco-editor/react";

interface Props {
  code: string;
  language: string;
}

function getMonacoLanguage(lang: string): string {
  const l = (lang || "").toLowerCase().trim();
  if (l === "c++") return "cpp";
  if (l === "c#") return "csharp";
  if (l === "shell" || l === "bash" || l === "sh") return "shell";
  if (l === "javascript" || l === "js") return "javascript";
  if (l === "typescript" || l === "ts") return "typescript";
  if (l === "python" || l === "py") return "python";
  if (l === "yaml" || l === "yml") return "yaml";
  return l;
}

export default function CodeHighlighter({ code = "", language = "javascript" }: Props) {
  const lines = code ? code.split("\n").length : 1;
  // Har bir qator ~22px. Top va bottom padding (32px) ni qo'shamiz.
  // Qisqa snippetlar ixcham bo'lishi uchun, uzoq snippetlar 650px da skrollanishi uchun hisoblaymiz.
  const computedHeight = Math.min(Math.max(lines * 22 + 36, 80), 650);

  return (
    <div className="w-full bg-surface-overlay">
      <Editor
        height={`${computedHeight}px`}
        language={getMonacoLanguage(language)}
        theme="vs-dark"
        value={code}
        loading={<div className="h-40 w-full animate-pulse bg-surface-overlay" />}
        options={{
          readOnly: true,
          domReadOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'var(--font-mono), "Fira Code", monospace',
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "solid",
          renderLineHighlight: "none",
          contextmenu: false,
          scrollbar: {
            vertical: lines * 22 + 36 > 650 ? "auto" : "hidden",
            horizontal: "auto",
          },
        }}
      />
    </div>
  );
}

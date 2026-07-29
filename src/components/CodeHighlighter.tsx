"use client";

import { useMemo } from "react";
import Prism from "prismjs";

// Prism dark theme — VS Code tomorrrow style
import "prismjs/themes/prism-tomorrow.css";

// All supported languages (loaded synchronously for reliability)
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-php";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markup"; // HTML
import "prismjs/components/prism-css";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-kotlin";

interface Props {
  code: string;
  language: string;
}

/** Til nomini Prism grammar key ga aylantiradi */
function toPrismLang(lang: string): string {
  const l = lang.toLowerCase().trim();
  const map: Record<string, string> = {
    "c++": "cpp",
    "c#": "csharp",
    "javascript": "javascript",
    "typescript": "typescript",
    "python": "python",
    "rust": "rust",
    "go": "go",
    "java": "java",
    "c": "c",
    "php": "php",
    "ruby": "ruby",
    "sql": "sql",
    "bash": "bash",
    "shell": "bash",
    "yaml": "yaml",
    "json": "json",
    "html": "markup",
    "css": "css",
    "swift": "swift",
    "kotlin": "kotlin",
  };
  return map[l] ?? l;
}

export default function CodeHighlighter({ code, language }: Props) {
  const prismLang = toPrismLang(language);

  // Prism.highlight() — to'g'ridan-to'g'ri HTML qaytaradi, highlightAll() emas
  const highlighted = useMemo(() => {
    const grammar = Prism.languages[prismLang];
    if (!grammar) {
      // Til topilmasa — oddiy matn, HTML escape
      return code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
    return Prism.highlight(code, grammar, prismLang);
  }, [code, prismLang]);

  return (
    <pre
      className={`language-${prismLang}`}
      style={{
        background: "#0F0A1F",
        margin: 0,
        padding: "24px",
        fontSize: "0.875rem",
        lineHeight: "1.7",
        borderRadius: "0 0 1rem 1rem",
        overflowX: "auto",
        tabSize: 2,
      }}
    >
      <code
        className={`language-${prismLang}`}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  );
}

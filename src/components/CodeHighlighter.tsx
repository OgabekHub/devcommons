"use client";

import React, { useEffect, useState } from "react";
import Prism from "prismjs";
// Til grammatikalari — tartib muhim (masalan cpp c'ga, tsx jsx+ts'ga tayanadi)
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-json";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-markdown";
// MUHIM: php markup-templating'siz global hook orqali BARCHA highlight'larni
// yiqitadi — undan OLDIN import qilinishi shart
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-php";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-swift";

interface Props {
  code: string;
  language: string;
}

function normalizeLanguage(lang: string): string {
  const l = (lang || "").toLowerCase().trim();
  const map: Record<string, string> = {
    "c++": "cpp",
    "c#": "csharp",
    shell: "bash",
    sh: "bash",
    js: "javascript",
    ts: "typescript",
    py: "python",
    yml: "yaml",
    golang: "go",
    html: "markup",
  };
  return map[l] || l;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Read-only kod ko'rsatkich — Prism bilan (avvalgi Monaco o'rniga).
 * Monaco faqat tahrirlash sahifalarida qoladi; bu ~200 kB bundle yutuq
 * va SSR'ga mos (dynamic ssr:false kerak emas).
 */
export default function CodeHighlighter({ code = "", language = "javascript" }: Props) {
  // SSR'da xavfsiz escape qilingan matn (SEO uchun kod baribir HTML'da bor);
  // mount'dan keyin Prism ranglarini state orqali qo'llaymiz — React
  // dangerouslySetInnerHTML'ni hydration'da solishtirmagani uchun server/client
  // farqiga tayanib bo'lmaydi.
  const [html, setHtml] = useState(() => escapeHtml(code));

  useEffect(() => {
    const lang = normalizeLanguage(language);
    const grammar = Prism.languages[lang];
    if (!grammar) {
      setHtml(escapeHtml(code));
      return;
    }
    try {
      setHtml(Prism.highlight(code, grammar, lang));
    } catch {
      setHtml(escapeHtml(code));
    }
  }, [code, language]);

  return (
    <div className="code-highlight w-full overflow-auto bg-surface-overlay" style={{ maxHeight: 650 }}>
      <pre className="m-0 whitespace-pre p-4 font-mono text-sm leading-[22px]">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}

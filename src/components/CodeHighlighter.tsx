"use client";

import { useEffect } from "react";
import Prism from "prismjs";

// VS Code ga o'xshash qorong'u (Dark) mavzu
import "prismjs/themes/prism-tomorrow.css";

interface Props {
  code: string;
  language: string;
}

export default function CodeHighlighter({ code, language }: Props) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadLanguages = async () => {
        // PrismJS componentlari global Prism o'zgaruvchisini talab qiladi
        (window as any).Prism = Prism;
        
        await import("prismjs/components/prism-javascript");
        await import("prismjs/components/prism-typescript");
        await import("prismjs/components/prism-python");
        await import("prismjs/components/prism-rust");
        await import("prismjs/components/prism-go");
        await import("prismjs/components/prism-java");
        await import("prismjs/components/prism-c");
        await import("prismjs/components/prism-cpp");
        await import("prismjs/components/prism-csharp");
        await import("prismjs/components/prism-php");
        await import("prismjs/components/prism-ruby");
        await import("prismjs/components/prism-sql");
        await import("prismjs/components/prism-bash");
        await import("prismjs/components/prism-yaml");
        await import("prismjs/components/prism-json");

        Prism.highlightAll();
      };
      
      loadLanguages();
    }
  }, [code, language]);

  // Dasturlash tillarini Prism classlariga moslashtirish
  const getLanguageClass = (lang: string) => {
    const l = lang.toLowerCase();
    if (l === "c++") return "language-cpp";
    if (l === "c#") return "language-csharp";
    return `language-${l}`;
  };

  return (
    <pre className={`${getLanguageClass(language)} !bg-[#0F0A1F] !m-0 !p-6 text-sm leading-relaxed text-gray-100 rounded-b-2xl`}>
      <code>{code}</code>
    </pre>
  );
}

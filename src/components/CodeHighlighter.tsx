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
      // PrismJS componentlari faqat brauzerda yuklanishi kerak (SSR da window xatoligini bermasligi uchun)
      require("prismjs/components/prism-javascript");
      require("prismjs/components/prism-typescript");
      require("prismjs/components/prism-python");
      require("prismjs/components/prism-rust");
      require("prismjs/components/prism-go");
      require("prismjs/components/prism-java");
      require("prismjs/components/prism-c");
      require("prismjs/components/prism-cpp");
      require("prismjs/components/prism-csharp");
      require("prismjs/components/prism-php");
      require("prismjs/components/prism-ruby");
      require("prismjs/components/prism-sql");
      require("prismjs/components/prism-bash");
      require("prismjs/components/prism-yaml");
      require("prismjs/components/prism-json");

      Prism.highlightAll();
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

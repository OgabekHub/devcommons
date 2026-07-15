"use client";

import { useEffect } from "react";
import Prism from "prismjs";

// VS Code ga o'xshash qorong'u (Dark) mavzu
import "prismjs/themes/prism-tomorrow.css";

// Kerakli tillar ro'yxatini yuklash (PrismJS uchun)
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

interface Props {
  code: string;
  language: string;
}

export default function CodeHighlighter({ code, language }: Props) {
  useEffect(() => {
    // PrismJS orqali kodlarni syntax highlight qilish
    Prism.highlightAll();
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

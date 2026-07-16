"use client";

import { useState } from "react";
import { Code, Share2, Check } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  snippetId: string;
}

export default function EmbedButton({ snippetId }: Props) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("Components");

  const embedCode = `<iframe 
  src="${window.location.origin}/embed/snippet/${snippetId}"
  width="100%"
  height="400"
  frameborder="0"
  style="border-radius: 12px; border: 1px solid #e5e7eb;"
></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowCode(!showCode)}
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100"
        title={t("embed")}
      >
        <Share2 className="h-4 w-4" />
        {t("embed")}
      </button>

      {showCode && (
        <div className="absolute right-0 top-full z-10 mt-2 w-96 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">{t("embed")} code</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-2 py-1 text-xs font-medium text-brand transition-colors hover:bg-brand-100"
            >
              {copied ? <Check className="h-3 w-3" /> : <Code className="h-3 w-3" />}
              {copied ? t("copied") : t("embed_copy")}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-100">
            <code>{embedCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

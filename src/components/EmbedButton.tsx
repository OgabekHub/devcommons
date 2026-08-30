"use client";

import { useState, useEffect } from "react";
import { Code, Share2, Check } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  snippetId: string;
}

export default function EmbedButton({ snippetId }: Props) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  const t = useTranslations("Components");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const embedCode = `<iframe 
  src="${origin}/embed/snippet/${snippetId}"
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
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:bg-ink/5 border border-transparent hover:border-line-strong"
        title={t("embed")}
      >
        <Share2 className="h-4 w-4 shrink-0" />
        <span>{t("embed")}</span>
      </button>

      {showCode && (
        <div className="absolute right-0 top-full z-10 mt-2 w-96 rounded-xl border border-line bg-surface-subtle p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-zinc-100">{t("embed")} code</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg bg-brand/10 px-2 py-1 text-xs font-medium text-brand transition-colors hover:bg-brand/20"
            >
              {copied ? <Check className="h-3 w-3" /> : <Code className="h-3 w-3" />}
              {copied ? t("copied") : t("embed_copy")}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-3 text-xs text-zinc-100">
            <code>{embedCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

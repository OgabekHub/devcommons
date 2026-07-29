"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label }: Props) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("Components");

  const displayLabel = label !== undefined ? label : t("copy");

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API ishlamasa fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={(e) => handleCopy(e)}
      className={`icon-btn gap-1.5 px-3 py-1.5 text-xs font-medium min-w-[90px] ${
        copied ? "icon-btn--active-brand" : ""
      }`}
    >
      <span className="shrink-0">
        {copied
          ? <Check className="h-3.5 w-3.5" />
          : <Copy className="h-3.5 w-3.5" />
        }
      </span>
      <span>{copied ? t("copied") : displayLabel}</span>
    </button>
  );
}

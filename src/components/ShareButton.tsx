"use client";

import { useState } from "react";
import { Share2, Twitter, Linkedin, Link as LinkIcon, Check } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  title: string;
  url: string;
}

export default function ShareButton({ title, url }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("Components");

  const shareUrl = typeof window !== "undefined" ? window.location.origin + url : url;
  const shareText = `${title} - DevCommons`;

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank");
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-400 transition-all hover:bg-white/10 hover:text-white bg-white/5 border border-white/10"
        title={t("share")}
      >
        <Share2 className="h-4 w-4" />
        {t("share")}
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-xl border border-white/10 bg-[#111111] p-2 shadow-xl">
          <button
            onClick={handleTwitterShare}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Twitter className="h-4 w-4 text-blue-400" />
            Twitter
          </button>
          <button
            onClick={handleLinkedInShare}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Linkedin className="h-4 w-4 text-blue-500" />
            LinkedIn
          </button>
          <button
            onClick={handleCopyLink}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <LinkIcon className="h-4 w-4 text-gray-400" />}
            {copied ? t("copied") : t("copy_link")}
          </button>
        </div>
      )}
    </div>
  );
}

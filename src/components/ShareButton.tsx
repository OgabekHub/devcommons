"use client";

import { useState, useEffect, useRef } from "react";
import { Share2, Twitter, Linkedin, Link as LinkIcon, Check, Send } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  title: string;
  url: string;
}

export default function ShareButton({ title, url }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Components");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shareUrl = origin ? origin + url : url;
  const shareText = `${title} - DevCommons`;

  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, "_blank");
    setShowMenu(false);
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank");
    setShowMenu(false);
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, "_blank");
    setShowMenu(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors duration-200 hover:bg-white/10 hover:text-white bg-white/5 border border-white/10"
        title={t("share")}
      >
        <Share2 className="h-4 w-4 shrink-0 text-brand" />
        <span>{t("share")}</span>
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-white/10 bg-[#111111] p-2 shadow-2xl backdrop-blur-xl">
          <button
            onClick={handleTelegramShare}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-[#0088cc]/15 hover:text-[#0088cc]"
          >
            <Send className="h-4 w-4 text-[#0088cc]" />
            Telegram
          </button>
          <button
            onClick={handleTwitterShare}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/15 hover:text-white"
          >
            <Twitter className="h-4 w-4 text-white" />
            X (Twitter)
          </button>
          <button
            onClick={handleLinkedInShare}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-[#0A66C2]/15 hover:text-[#0A66C2]"
          >
            <Linkedin className="h-4 w-4 text-[#0A66C2]" />
            LinkedIn
          </button>
          
          <div className="my-1 border-t border-white/10" />

          <button
            onClick={handleCopyLink}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-brand/10 hover:text-brand"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <LinkIcon className="h-4 w-4 text-gray-400" />}
            {copied ? t("copied") : t("copy_link")}
          </button>
        </div>
      )}
    </div>
  );
}

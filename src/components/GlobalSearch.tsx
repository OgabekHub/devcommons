"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const t = useTranslations("Header");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
      <Search className="absolute left-3 h-4 w-4 text-zinc-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("search")}
        className="h-9 w-48 rounded-full border border-line bg-surface-subtle pl-9 pr-4 text-sm text-fg placeholder-zinc-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all focus:w-64"
      />
    </form>
  );
}

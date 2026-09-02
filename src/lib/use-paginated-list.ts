"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ListSort } from "@/lib/list-shared";

export type { ListSort };

interface Options<T> {
  type: "snippets" | "prompts";
  initialItems: T[];
  initialTotal: number;
  query: string;
  /** Snippets uchun til, prompts uchun kategoriya; "ALL" = filtrsiz */
  facet: string;
  tags: string[];
  sort: ListSort;
}

/**
 * Server-side pagination hook: filtr/sort o'zgarganda /api/list dan 0-sahifani,
 * scroll'da keyingi sahifani oladi. Server bergan boshlang'ich sahifa default
 * filtrlarda qayta so'ralmaydi (tez birinchi render saqlanadi).
 */
export function usePaginatedList<T extends { id: string }>({
  type,
  initialItems,
  initialTotal,
  query,
  facet,
  tags,
  sort,
}: Options<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef(0);
  const requestIdRef = useRef(0);
  const firstRunRef = useRef(true);

  const isDefault =
    !query && facet === "ALL" && tags.length === 0 && sort === "newest";

  const buildUrl = useCallback(
    (page: number) => {
      const p = new URLSearchParams({ type, page: String(page), sort });
      if (query) p.set("q", query);
      if (facet !== "ALL") p.set("facet", facet);
      if (tags.length) p.set("tags", tags.join(","));
      return `/api/list?${p.toString()}`;
    },
    [type, query, facet, tags, sort]
  );

  const fetchPage = useCallback(
    async (page: number, append: boolean) => {
      const id = ++requestIdRef.current;
      setLoading(true);
      try {
        const res = await fetch(buildUrl(page));
        if (!res.ok) return;
        const data: { items: T[]; total: number } = await res.json();
        if (id !== requestIdRef.current) return; // eskirgan javob — tashlab yuboramiz
        pageRef.current = page;
        setTotal(data.total ?? 0);
        setItems((prev) => {
          if (!append) return data.items;
          // Offset pagination'da yangi insert'lar qatorlarni surishi mumkin — dedupe
          const seen = new Set(prev.map((it) => it.id));
          return [...prev, ...data.items.filter((it) => !seen.has(it.id))];
        });
      } catch {
        // Tarmoq xatosi — mavjud ro'yxat saqlanadi
      } finally {
        if (id === requestIdRef.current) setLoading(false);
      }
    },
    [buildUrl]
  );

  // Filtr/sort o'zgarganda 0-sahifadan qayta yuklash (matn uchun debounce)
  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      if (isDefault) return; // server bergan 1-sahifa yetarli
    }
    const t = setTimeout(() => void fetchPage(0, false), query ? 350 : 0);
    return () => clearTimeout(t);
    // fetchPage filtr qiymatlaridan hosil — deplar quyida yetarli
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, facet, tags, sort]);

  const hasMore = items.length < total;

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    void fetchPage(pageRef.current + 1, true);
  }, [loading, hasMore, fetchPage]);

  return { items, total, hasMore, loading, loadMore };
}

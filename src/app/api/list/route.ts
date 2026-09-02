import { NextRequest, NextResponse } from "next/server";
import { createSupabasePublic, isSupabaseConfigured } from "@/lib/supabase-server";
import { LIST_PAGE_SIZE } from "@/lib/list-shared";

export const dynamic = "force-dynamic";

/**
 * Ro'yxat sahifalari uchun server-side pagination + filtr API.
 * GET /api/list?type=snippets|prompts&page=0&q=...&facet=...&tags=a,b&sort=newest
 * Faqat public (RLS ko'rinadigan) kontent qaytadi — anon klient ishlatiladi.
 */
export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ items: [], total: 0 });
  }

  const sp = req.nextUrl.searchParams;
  const type = sp.get("type");
  if (type !== "snippets" && type !== "prompts") {
    return NextResponse.json({ error: "invalid type" }, { status: 400 });
  }

  const page = Math.max(0, Math.min(500, parseInt(sp.get("page") ?? "0", 10) || 0));
  // PostgREST filter grammatikasiga kiradigan belgilarni olib tashlaymiz
  const q = (sp.get("q") ?? "").slice(0, 100).replace(/[,()*%\\]/g, "").trim();
  const facet = (sp.get("facet") ?? "").slice(0, 50);
  const tags = (sp.get("tags") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 10);
  const sort = sp.get("sort") ?? "newest";

  const supabase = createSupabasePublic();
  let qb = supabase.from(type).select("*", { count: "exact" });

  if (q) qb = qb.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  if (facet) qb = qb.eq(type === "snippets" ? "language" : "category", facet);
  if (tags.length) qb = qb.overlaps("tags", tags);

  if (sort === "oldest") {
    qb = qb.order("created_at", { ascending: true });
  } else if (sort === "popular") {
    qb = qb.order("votes", { ascending: false }).order("created_at", { ascending: false });
  } else {
    qb = qb.order("created_at", { ascending: false });
  }

  const from = page * LIST_PAGE_SIZE;
  const { data, error, count } = await qb.range(from, from + LIST_PAGE_SIZE - 1);

  if (error) {
    // 416 (range oshib ketdi) — bo'sh sahifa sifatida qaytaramiz
    if (error.code === "PGRST103") {
      return NextResponse.json({ items: [], total: count ?? 0 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { items: data ?? [], total: count ?? 0 },
    { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } }
  );
}

-- =====================================================================
-- MIGRATION v18 — To'liq matnli qidiruv (FTS)
--
-- schema.sql'da allaqachon mavjud gin indekslardan foydalanadi:
--   idx_snippets_title/description  -> to_tsvector('english', ...)
--   idx_prompts_title/content       -> to_tsvector('english', ...)
--
-- SECURITY INVOKER — RLS visibility policy'lari amal qiladi
-- (private/team kontent qidiruvda ham ko'rinmaydi).
--
-- Supabase SQL Editor'da ishga tushiring. Xavfsiz: faqat funksiya
-- yaratadi/almashtiradi, jadval/ma'lumotga tegmaydi.
-- =====================================================================

-- Trigram indekslar — title ILIKE '%...%' ham indeks bilan ishlashi uchun
-- (aks holda OR'dagi ilike butun so'rovni seq-scan'ga tushirib yuborardi)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_snippets_title_trgm ON public.snippets USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_prompts_title_trgm ON public.prompts USING gin (title gin_trgm_ops);

DROP FUNCTION IF EXISTS public.search_content(text, text, int, int);

CREATE OR REPLACE FUNCTION public.search_content(
  q text,
  content_filter text DEFAULT 'all', -- 'all' | 'snippets' | 'prompts'
  lim int DEFAULT 30,
  off int DEFAULT 0
)
RETURNS TABLE (
  item_type text,
  id uuid,
  title text,
  excerpt text,
  snippet_language text,
  prompt_category text,
  votes int,
  created_at timestamptz,
  author_username text,
  author_avatar text,
  rank real,
  total_count bigint
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  WITH tsq AS (
    SELECT websearch_to_tsquery('english', q) AS query
  ),
  results AS (
    SELECT
      'snippet'::text AS item_type,
      s.id,
      s.title,
      left(coalesce(nullif(s.description, ''), s.code), 220) AS excerpt,
      s.language AS snippet_language,
      NULL::text AS prompt_category,
      s.votes,
      s.created_at,
      u.github_username AS author_username,
      u.avatar_url AS author_avatar,
      coalesce(
        ts_rank(
          setweight(to_tsvector('english', s.title), 'A') ||
          setweight(to_tsvector('english', coalesce(s.description, '')), 'B'),
          tsq.query
        ),
        0
      ) AS rank
    FROM snippets s
    CROSS JOIN tsq
    LEFT JOIN users u ON u.id = s.author_id
    WHERE content_filter IN ('all', 'snippets')
      AND (
        -- Indeks ifodalari bilan AYNAN mos (gin indekslar ishlashi uchun)
        to_tsvector('english', s.title) @@ tsq.query
        OR to_tsvector('english', s.description) @@ tsq.query
        -- Qisqa/qisman so'zlar uchun recall (title kichik ustun — arzon)
        OR s.title ILIKE '%' || q || '%'
      )

    UNION ALL

    SELECT
      'prompt'::text,
      p.id,
      p.title,
      left(coalesce(nullif(p.description, ''), p.content), 220),
      NULL::text,
      p.category,
      p.votes,
      p.created_at,
      u.github_username,
      u.avatar_url,
      coalesce(
        ts_rank(
          setweight(to_tsvector('english', p.title), 'A') ||
          setweight(to_tsvector('english', coalesce(p.content, '')), 'B'),
          tsq.query
        ),
        0
      )
    FROM prompts p
    CROSS JOIN tsq
    LEFT JOIN users u ON u.id = p.author_id
    WHERE content_filter IN ('all', 'prompts')
      AND (
        to_tsvector('english', p.title) @@ tsq.query
        OR to_tsvector('english', p.content) @@ tsq.query
        OR p.title ILIKE '%' || q || '%'
      )
  )
  SELECT
    r.*,
    count(*) OVER () AS total_count
  FROM results r
  ORDER BY r.rank DESC, r.created_at DESC
  LIMIT greatest(1, least(lim, 60))
  OFFSET greatest(0, off);
$$;

-- Read-only STABLE funksiya — hammaga ochiq qidiruv
GRANT EXECUTE ON FUNCTION public.search_content(text, text, int, int) TO anon, authenticated;

-- Tekshirish:
--   SELECT item_type, title, rank FROM search_content('react hook', 'all', 10, 0);

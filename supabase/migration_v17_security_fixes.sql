-- =====================================================================
-- Migration v17: Security fixes (ADAPTIVE / defensive)
-- =====================================================================
-- Jonli DB migratsiya fayllaridan orqada bo'lishi mumkin (M11): ba'zi
-- jadval/ustun/funksiyalar mavjud bo'lmasligi mumkin. Shu sabab bu skript
-- HAR bir obyekt mavjudligini tekshiradi va faqat mavjudlariga tegadi.
-- Idempotent — qayta ishga tushirilsa ham xavfsiz.
-- Supabase SQL Editor'ga to'liq paste qiling. "Destructive operations"
-- ogohlantirishi DROP POLICY uchun — xavfsiz, "Run query" bosing.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. snippets — SELECT (visibility) + INSERT (author_id) policy'lari
-- ---------------------------------------------------------------------
DO $$
DECLARE
  has_private boolean;
  has_teamcol boolean;
  has_teamtbl boolean;
BEGIN
  IF to_regclass('public.snippets') IS NULL THEN RETURN; END IF;

  -- Eski SELECT policy variantlarini olib tashlaymiz (USING(true) teshigi)
  EXECUTE 'DROP POLICY IF EXISTS "Public read snippets" ON public.snippets';
  EXECUTE 'DROP POLICY IF EXISTS "Snippets visibility" ON public.snippets';
  EXECUTE 'DROP POLICY IF EXISTS "Snippets are viewable by everyone" ON public.snippets';
  EXECUTE 'DROP POLICY IF EXISTS "Users can view private team snippets" ON public.snippets';

  has_private := EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='snippets' AND column_name='is_private');
  has_teamcol := EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='snippets' AND column_name='team_id');
  has_teamtbl := to_regclass('public.team_members') IS NOT NULL;

  IF has_private AND has_teamcol AND has_teamtbl THEN
    EXECUTE $sql$
      CREATE POLICY "Snippets visibility" ON public.snippets FOR SELECT USING (
        (COALESCE(is_private, false) = false AND team_id IS NULL)
        OR auth.uid() = author_id
        OR (team_id IS NOT NULL AND EXISTS (
          SELECT 1 FROM public.team_members
          WHERE team_members.team_id = snippets.team_id AND team_members.user_id = auth.uid()))
      )$sql$;
  ELSIF has_private THEN
    EXECUTE $sql$
      CREATE POLICY "Snippets visibility" ON public.snippets FOR SELECT USING (
        COALESCE(is_private, false) = false OR auth.uid() = author_id
      )$sql$;
  ELSE
    -- Private ustuni yo'q — yashiradigan narsa yo'q, ochiq o'qish qoladi
    EXECUTE 'CREATE POLICY "Snippets visibility" ON public.snippets FOR SELECT USING (true)';
  END IF;

  -- INSERT: author_id ni auth.uid() ga bog'lash (spoofing to'xtatish)
  EXECUTE 'DROP POLICY IF EXISTS "Anyone insert snippets" ON public.snippets';
  EXECUTE 'DROP POLICY IF EXISTS "Authenticated users insert snippets" ON public.snippets';
  EXECUTE 'DROP POLICY IF EXISTS "Authenticated insert snippets" ON public.snippets';
  EXECUTE 'CREATE POLICY "Authenticated insert snippets" ON public.snippets FOR INSERT WITH CHECK (auth.uid() = author_id)';
END $$;

-- ---------------------------------------------------------------------
-- 2. prompts — SELECT + INSERT
-- ---------------------------------------------------------------------
DO $$
DECLARE
  has_private boolean;
  has_teamcol boolean;
  has_teamtbl boolean;
BEGIN
  IF to_regclass('public.prompts') IS NULL THEN RETURN; END IF;

  EXECUTE 'DROP POLICY IF EXISTS "Public read prompts" ON public.prompts';
  EXECUTE 'DROP POLICY IF EXISTS "Prompts visibility" ON public.prompts';
  EXECUTE 'DROP POLICY IF EXISTS "Prompts are viewable by everyone" ON public.prompts';
  EXECUTE 'DROP POLICY IF EXISTS "Users can view private team prompts" ON public.prompts';

  has_private := EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='prompts' AND column_name='is_private');
  has_teamcol := EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='prompts' AND column_name='team_id');
  has_teamtbl := to_regclass('public.team_members') IS NOT NULL;

  IF has_private AND has_teamcol AND has_teamtbl THEN
    EXECUTE $sql$
      CREATE POLICY "Prompts visibility" ON public.prompts FOR SELECT USING (
        (COALESCE(is_private, false) = false AND team_id IS NULL)
        OR auth.uid() = author_id
        OR (team_id IS NOT NULL AND EXISTS (
          SELECT 1 FROM public.team_members
          WHERE team_members.team_id = prompts.team_id AND team_members.user_id = auth.uid()))
      )$sql$;
  ELSIF has_private THEN
    EXECUTE $sql$
      CREATE POLICY "Prompts visibility" ON public.prompts FOR SELECT USING (
        COALESCE(is_private, false) = false OR auth.uid() = author_id
      )$sql$;
  ELSE
    EXECUTE 'CREATE POLICY "Prompts visibility" ON public.prompts FOR SELECT USING (true)';
  END IF;

  EXECUTE 'DROP POLICY IF EXISTS "Anyone insert prompts" ON public.prompts';
  EXECUTE 'DROP POLICY IF EXISTS "Authenticated users insert prompts" ON public.prompts';
  EXECUTE 'DROP POLICY IF EXISTS "Authenticated insert prompts" ON public.prompts';
  EXECUTE 'CREATE POLICY "Authenticated insert prompts" ON public.prompts FOR INSERT WITH CHECK (auth.uid() = author_id)';
END $$;

-- ---------------------------------------------------------------------
-- 3. skill_bundles (agar mavjud bo'lsa)
-- ---------------------------------------------------------------------
DO $$
DECLARE
  has_author boolean;
  has_private boolean;
  has_teamcol boolean;
  has_teamtbl boolean;
BEGIN
  IF to_regclass('public.skill_bundles') IS NULL THEN RETURN; END IF;

  EXECUTE 'ALTER TABLE public.skill_bundles ENABLE ROW LEVEL SECURITY';
  EXECUTE 'DROP POLICY IF EXISTS "Public read skill_bundles" ON public.skill_bundles';
  EXECUTE 'DROP POLICY IF EXISTS "Skill bundles visibility" ON public.skill_bundles';
  EXECUTE 'DROP POLICY IF EXISTS "Skill bundles are viewable by everyone" ON public.skill_bundles';

  has_author := EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='skill_bundles' AND column_name='author_id');
  has_private := EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='skill_bundles' AND column_name='is_private');
  has_teamcol := EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='skill_bundles' AND column_name='team_id');
  has_teamtbl := to_regclass('public.team_members') IS NOT NULL;

  IF has_author AND has_private AND has_teamcol AND has_teamtbl THEN
    EXECUTE $sql$
      CREATE POLICY "Skill bundles visibility" ON public.skill_bundles FOR SELECT USING (
        (COALESCE(is_private, false) = false AND team_id IS NULL)
        OR auth.uid() = author_id
        OR (team_id IS NOT NULL AND EXISTS (
          SELECT 1 FROM public.team_members
          WHERE team_members.team_id = skill_bundles.team_id AND team_members.user_id = auth.uid()))
      )$sql$;
  ELSIF has_author AND has_private THEN
    EXECUTE $sql$
      CREATE POLICY "Skill bundles visibility" ON public.skill_bundles FOR SELECT USING (
        COALESCE(is_private, false) = false OR auth.uid() = author_id
      )$sql$;
  ELSE
    EXECUTE 'CREATE POLICY "Skill bundles visibility" ON public.skill_bundles FOR SELECT USING (true)';
  END IF;

  -- INSERT: author_id ga bog'lash (mavjud bo'lsa)
  EXECUTE 'DROP POLICY IF EXISTS "Auth insert skill_bundles" ON public.skill_bundles';
  EXECUTE 'DROP POLICY IF EXISTS "Users can insert their own skill bundles" ON public.skill_bundles';
  IF has_author THEN
    EXECUTE 'CREATE POLICY "Users can insert their own skill bundles" ON public.skill_bundles FOR INSERT WITH CHECK (auth.uid() = author_id)';
  END IF;
END $$;

-- ---------------------------------------------------------------------
-- 4. teams / team_members (agar mavjud bo'lsa) — Stripe ID'lari yashirin
--    Rekursiyani oldini olish uchun sodda, o'zaro-havolasiz policy'lar.
-- ---------------------------------------------------------------------
DO $$
DECLARE
  has_owner boolean;
BEGIN
  IF to_regclass('public.teams') IS NULL THEN RETURN; END IF;

  EXECUTE 'ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY';
  -- owner_id ustunini kafolatlaymiz (v11 sxemasida yo'q bo'lishi mumkin)
  EXECUTE 'ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS owner_id uuid';

  has_owner := EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='teams' AND column_name='owner_id');

  EXECUTE 'DROP POLICY IF EXISTS "Public read teams" ON public.teams';
  EXECUTE 'DROP POLICY IF EXISTS "Teams are viewable by everyone" ON public.teams';
  EXECUTE 'DROP POLICY IF EXISTS "Teams visibility" ON public.teams';

  IF has_owner THEN
    EXECUTE 'CREATE POLICY "Teams visibility" ON public.teams FOR SELECT USING (owner_id = auth.uid())';
  ELSE
    -- owner_id yo'q — hech bo'lmasa ochiq holatni saqlaymiz (jadval mock)
    EXECUTE 'CREATE POLICY "Teams visibility" ON public.teams FOR SELECT USING (true)';
  END IF;
END $$;

DO $$
DECLARE
  teams_has_owner boolean;
BEGIN
  IF to_regclass('public.team_members') IS NULL THEN RETURN; END IF;

  EXECUTE 'ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY';
  EXECUTE 'DROP POLICY IF EXISTS "Team members can read" ON public.team_members';
  EXECUTE 'DROP POLICY IF EXISTS "Users can view their team members" ON public.team_members';
  EXECUTE 'DROP POLICY IF EXISTS "Team members visibility" ON public.team_members';

  teams_has_owner := (to_regclass('public.teams') IS NOT NULL) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='teams' AND column_name='owner_id');

  IF teams_has_owner THEN
    -- teams (owner_id) ga havola — team_members o'ziga havola qilmaydi (rekursiya yo'q)
    EXECUTE $sql$
      CREATE POLICY "Team members visibility" ON public.team_members FOR SELECT USING (
        user_id = auth.uid()
        OR team_id IN (SELECT id FROM public.teams WHERE owner_id = auth.uid())
      )$sql$;
  ELSE
    EXECUTE 'CREATE POLICY "Team members visibility" ON public.team_members FOR SELECT USING (user_id = auth.uid())';
  END IF;
END $$;

-- ---------------------------------------------------------------------
-- 5. notifications — faqat o'z nomidan (actor) yuborish (agar mavjud bo'lsa)
-- ---------------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.notifications') IS NULL THEN RETURN; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='notifications' AND column_name='actor_id') THEN
    RETURN;
  END IF;
  EXECUTE 'DROP POLICY IF EXISTS "Authenticated insert notifications" ON public.notifications';
  EXECUTE 'CREATE POLICY "Authenticated insert notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = actor_id)';
END $$;

-- ---------------------------------------------------------------------
-- 6. item_versions — faqat o'z kontentiga versiya (agar mavjud bo'lsa)
-- ---------------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.item_versions') IS NULL THEN RETURN; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='item_versions' AND column_name='item_type') THEN
    RETURN;
  END IF;
  EXECUTE 'DROP POLICY IF EXISTS "Authenticated insert item_versions" ON public.item_versions';
  EXECUTE 'DROP POLICY IF EXISTS "Allow authenticated insert to item_versions" ON public.item_versions';
  EXECUTE $sql$
    CREATE POLICY "Authenticated insert item_versions" ON public.item_versions FOR INSERT WITH CHECK (
      (item_type = 'snippet' AND EXISTS (SELECT 1 FROM public.snippets WHERE snippets.id = item_versions.item_id AND snippets.author_id = auth.uid()))
      OR (item_type = 'prompt' AND EXISTS (SELECT 1 FROM public.prompts WHERE prompts.id = item_versions.item_id AND prompts.author_id = auth.uid()))
    )$sql$;
END $$;

-- ---------------------------------------------------------------------
-- 7. Hisoblagich RPC'lari: SET search_path + REVOKE anon/public
--    (Eski, mos kelmaydigan overload'larni ham tozalaymiz.)
-- ---------------------------------------------------------------------

-- Eski v3 overload'i (uuid, text) — noto'g'ri tartib, olib tashlaymiz
DROP FUNCTION IF EXISTS public.increment_votes(uuid, text);

CREATE OR REPLACE FUNCTION public.increment_votes(table_name text, item_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF table_name = 'snippets' THEN
    UPDATE snippets SET votes = COALESCE(votes, 0) + 1 WHERE id = item_id;
  ELSIF table_name = 'prompts' THEN
    UPDATE prompts SET votes = COALESCE(votes, 0) + 1 WHERE id = item_id;
  END IF;
END; $$;

CREATE OR REPLACE FUNCTION public.decrement_votes(table_name text, item_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF table_name = 'snippets' THEN
    UPDATE snippets SET votes = GREATEST(0, COALESCE(votes, 0) - 1) WHERE id = item_id;
  ELSIF table_name = 'prompts' THEN
    UPDATE prompts SET votes = GREATEST(0, COALESCE(votes, 0) - 1) WHERE id = item_id;
  END IF;
END; $$;

CREATE OR REPLACE FUNCTION public.increment_view_count(table_name text, item_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF table_name = 'snippets' THEN
    UPDATE snippets SET view_count = COALESCE(view_count, 0) + 1 WHERE id = item_id;
  ELSIF table_name = 'prompts' THEN
    UPDATE prompts SET view_count = COALESCE(view_count, 0) + 1 WHERE id = item_id;
  END IF;
END; $$;

CREATE OR REPLACE FUNCTION public.increment_metric(target_table text, target_column text, item_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF target_table IN ('snippets', 'prompts') AND target_column IN ('used_count', 'forks_count') THEN
    EXECUTE format('UPDATE %I SET %I = COALESCE(%I, 0) + 1 WHERE id = $1', target_table, target_column, target_column)
    USING item_id;
  END IF;
END; $$;

CREATE OR REPLACE FUNCTION public.increment_used_count(item_id uuid, item_type text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF item_type = 'snippet' THEN
    UPDATE snippets SET used_count = COALESCE(used_count, 0) + 1 WHERE id = item_id;
  ELSIF item_type = 'prompt' THEN
    UPDATE prompts SET used_count = COALESCE(used_count, 0) + 1 WHERE id = item_id;
  END IF;
END; $$;

-- increment_comment_votes — comments jadvali mavjud bo'lsagina
DO $$
BEGIN
  IF to_regclass('public.comments') IS NOT NULL THEN
    EXECUTE $fn$
      CREATE OR REPLACE FUNCTION public.increment_comment_votes(comment_id uuid)
      RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $body$
      BEGIN
        UPDATE comments SET votes = COALESCE(votes, 0) + 1 WHERE id = comment_id;
      END; $body$;
    $fn$;
  END IF;
END $$;

-- ---- GRANT / REVOKE (faqat mavjud funksiyalarga) ----
DO $$
BEGIN
  IF to_regprocedure('public.increment_votes(text, uuid)') IS NOT NULL THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.increment_votes(text, uuid) FROM anon, public';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.increment_votes(text, uuid) TO authenticated, service_role';
  END IF;
  IF to_regprocedure('public.decrement_votes(text, uuid)') IS NOT NULL THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.decrement_votes(text, uuid) FROM anon, public';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.decrement_votes(text, uuid) TO authenticated, service_role';
  END IF;
  IF to_regprocedure('public.increment_comment_votes(uuid)') IS NOT NULL THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.increment_comment_votes(uuid) FROM anon, public';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.increment_comment_votes(uuid) TO authenticated, service_role';
  END IF;
  IF to_regprocedure('public.increment_view_count(text, uuid)') IS NOT NULL THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.increment_view_count(text, uuid) FROM anon, public, authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.increment_view_count(text, uuid) TO service_role';
  END IF;
  IF to_regprocedure('public.increment_metric(text, text, uuid)') IS NOT NULL THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.increment_metric(text, text, uuid) FROM anon, public, authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.increment_metric(text, text, uuid) TO service_role';
  END IF;
  IF to_regprocedure('public.increment_used_count(uuid, text)') IS NOT NULL THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.increment_used_count(uuid, text) FROM anon, public, authenticated';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.increment_used_count(uuid, text) TO service_role';
  END IF;
END $$;

-- =====================================================================
-- Tekshirish:
--   SELECT tablename, policyname, cmd, qual FROM pg_policies
--     WHERE schemaname='public' AND cmd='SELECT' ORDER BY tablename;
--   -- snippets/prompts uchun qual 'true' bo'lmasligi kerak (is_private bor bo'lsa).
-- =====================================================================

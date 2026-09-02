-- =====================================================================
-- MIGRATION v19 — Bildirishnomalar v2 (DB trigger'lar) + komment
-- ovozlari dedup + Realtime
--
-- Nima o'zgaradi:
--   1) comment_votes jadvali — har user har kommentga 1 ovoz (toggle),
--      eski cheksiz increment_comment_votes olib tashlanadi.
--   2) Bildirishnomalar endi DB trigger'lardan tug'iladi (vote/comment/
--      follow) — client yozmaydi. Spoof qilinadigan
--      "Authenticated insert notifications" policy o'chiriladi.
--   3) notifications jadvali Realtime publication'ga qo'shiladi —
--      qo'ng'iroq real vaqtda yangilanadi.
--
-- Supabase SQL Editor'da ishga tushiring.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) COMMENT VOTES — dedup jadvali + toggle RPC
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comment_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  comment_id uuid NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, comment_id)
);

CREATE INDEX IF NOT EXISTS idx_comment_votes_comment ON public.comment_votes(comment_id);

ALTER TABLE public.comment_votes ENABLE ROW LEVEL SECURITY;

-- O'z ovozlarini ko'rish (UI boshlang'ich holat uchun); yozish faqat RPC orqali
DROP POLICY IF EXISTS "Read own comment votes" ON public.comment_votes;
CREATE POLICY "Read own comment votes" ON public.comment_votes
  FOR SELECT USING (auth.uid() = user_id);

-- Toggle: bor bo'lsa o'chiradi (-1), yo'q bo'lsa qo'shadi (+1)
CREATE OR REPLACE FUNCTION public.toggle_comment_vote(target_comment_id uuid)
RETURNS TABLE (votes int, voted boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  did_vote boolean;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'authentication required';
  END IF;

  IF EXISTS (
    SELECT 1 FROM comment_votes cv
    WHERE cv.user_id = uid AND cv.comment_id = target_comment_id
  ) THEN
    DELETE FROM comment_votes cv
    WHERE cv.user_id = uid AND cv.comment_id = target_comment_id;
    UPDATE comments c SET votes = greatest(coalesce(c.votes, 0) - 1, 0)
    WHERE c.id = target_comment_id;
    did_vote := false;
  ELSE
    INSERT INTO comment_votes (user_id, comment_id)
    VALUES (uid, target_comment_id);
    UPDATE comments c SET votes = coalesce(c.votes, 0) + 1
    WHERE c.id = target_comment_id;
    did_vote := true;
  END IF;

  RETURN QUERY
    SELECT coalesce(c.votes, 0), did_vote FROM comments c
    WHERE c.id = target_comment_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.toggle_comment_vote(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.toggle_comment_vote(uuid) TO authenticated, service_role;

-- Eski cheksiz hisoblagichni yopamiz (dedupsiz edi)
DROP FUNCTION IF EXISTS public.increment_comment_votes(uuid);

-- ---------------------------------------------------------------------
-- 2) BILDIRISHNOMA TRIGGER'LARI — server-authoritative
-- ---------------------------------------------------------------------

-- Snippet vote
CREATE OR REPLACE FUNCTION public.notify_snippet_vote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE author uuid;
BEGIN
  SELECT s.author_id INTO author FROM snippets s WHERE s.id = NEW.snippet_id;
  IF author IS NOT NULL AND author <> NEW.user_id THEN
    INSERT INTO notifications (user_id, actor_id, type, snippet_id)
    VALUES (author, NEW.user_id, 'vote_snippet', NEW.snippet_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_snippet_vote ON public.snippet_votes;
CREATE TRIGGER trg_notify_snippet_vote
  AFTER INSERT ON public.snippet_votes
  FOR EACH ROW EXECUTE FUNCTION public.notify_snippet_vote();

-- Prompt vote
CREATE OR REPLACE FUNCTION public.notify_prompt_vote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE author uuid;
BEGIN
  SELECT p.author_id INTO author FROM prompts p WHERE p.id = NEW.prompt_id;
  IF author IS NOT NULL AND author <> NEW.user_id THEN
    INSERT INTO notifications (user_id, actor_id, type, prompt_id)
    VALUES (author, NEW.user_id, 'vote_prompt', NEW.prompt_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_prompt_vote ON public.prompt_votes;
CREATE TRIGGER trg_notify_prompt_vote
  AFTER INSERT ON public.prompt_votes
  FOR EACH ROW EXECUTE FUNCTION public.notify_prompt_vote();

-- Komment (item muallifiga; reply bo'lsa parent muallifiga ham)
CREATE OR REPLACE FUNCTION public.notify_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item_author uuid;
  parent_author uuid;
  ntype text;
BEGIN
  IF NEW.snippet_id IS NOT NULL THEN
    SELECT s.author_id INTO item_author FROM snippets s WHERE s.id = NEW.snippet_id;
    ntype := 'comment_snippet';
  ELSIF NEW.prompt_id IS NOT NULL THEN
    SELECT p.author_id INTO item_author FROM prompts p WHERE p.id = NEW.prompt_id;
    ntype := 'comment_prompt';
  ELSE
    RETURN NEW;
  END IF;

  IF item_author IS NOT NULL AND item_author <> NEW.user_id THEN
    INSERT INTO notifications (user_id, actor_id, type, snippet_id, prompt_id)
    VALUES (item_author, NEW.user_id, ntype, NEW.snippet_id, NEW.prompt_id);
  END IF;

  -- Reply: parent komment muallifiga ham (item muallifi bilan takrorlanmasin)
  IF NEW.parent_id IS NOT NULL THEN
    SELECT c.user_id INTO parent_author FROM comments c WHERE c.id = NEW.parent_id;
    IF parent_author IS NOT NULL
       AND parent_author <> NEW.user_id
       AND (item_author IS NULL OR parent_author <> item_author) THEN
      INSERT INTO notifications (user_id, actor_id, type, snippet_id, prompt_id)
      VALUES (parent_author, NEW.user_id, ntype, NEW.snippet_id, NEW.prompt_id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_comment ON public.comments;
CREATE TRIGGER trg_notify_comment
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.notify_comment();

-- Follow
CREATE OR REPLACE FUNCTION public.notify_follow()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.following_id <> NEW.follower_id THEN
    INSERT INTO notifications (user_id, actor_id, type)
    VALUES (NEW.following_id, NEW.follower_id, 'follow');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_follow ON public.follows;
CREATE TRIGGER trg_notify_follow
  AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.notify_follow();

-- Spoof qilinadigan client-insert policy'ni yopamiz:
-- endi bildirishnomalarni faqat trigger'lar (SECURITY DEFINER) yozadi.
DROP POLICY IF EXISTS "Authenticated insert notifications" ON public.notifications;

-- ---------------------------------------------------------------------
-- 3) REALTIME — qo'ng'iroq jonli yangilanishi uchun
-- ---------------------------------------------------------------------
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION
  WHEN duplicate_object THEN NULL; -- allaqachon qo'shilgan
END $$;

-- Tekshirish:
--   SELECT tgname FROM pg_trigger WHERE tgname LIKE 'trg_notify%';
--   SELECT proname FROM pg_proc WHERE proname = 'toggle_comment_vote';

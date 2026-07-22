-- ============================================================
-- Migration: Vote Deduplication Tables
-- DevCommons — Faza 5 Audit Tuzatmasi
-- ============================================================
-- Supabase SQL editor ga ko'chirib joylashtiring va Run tugmasini bosing

-- 1. Snippet votes tracking
CREATE TABLE IF NOT EXISTS snippet_votes (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  snippet_id uuid NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, snippet_id)  -- Bir foydalanuvchi bir snippetga faqat 1 ovoz bera oladi
);

-- 2. Prompt votes tracking
CREATE TABLE IF NOT EXISTS prompt_votes (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id uuid NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, prompt_id)  -- Bir foydalanuvchi bir promptga faqat 1 ovoz bera oladi
);

-- 3. RLS policies
ALTER TABLE snippet_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_votes  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own snippet votes"
  ON snippet_votes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own prompt votes"
  ON prompt_votes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can read snippet votes"
  ON snippet_votes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read prompt votes"
  ON prompt_votes FOR SELECT
  USING (true);

-- 4. RPC: increment_votes (SECURITY DEFINER — RLS ni chetlab o'tadi)
CREATE OR REPLACE FUNCTION increment_votes(table_name text, item_id uuid)
RETURNS void AS $$
BEGIN
  IF table_name = 'snippets' THEN
    UPDATE snippets SET votes = COALESCE(votes, 0) + 1 WHERE id = item_id;
  ELSIF table_name = 'prompts' THEN
    UPDATE prompts SET votes = COALESCE(votes, 0) + 1 WHERE id = item_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RPC: decrement_votes (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION decrement_votes(table_name text, item_id uuid)
RETURNS void AS $$
BEGIN
  IF table_name = 'snippets' THEN
    UPDATE snippets SET votes = GREATEST(0, COALESCE(votes, 0) - 1) WHERE id = item_id;
  ELSIF table_name = 'prompts' THEN
    UPDATE prompts SET votes = GREATEST(0, COALESCE(votes, 0) - 1) WHERE id = item_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

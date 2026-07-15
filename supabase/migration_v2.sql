-- =============================================
-- DevCommons Migration: Add missing columns
-- =============================================

-- snippets jadvaliga qo'shimcha ustunlar
ALTER TABLE snippets 
  ADD COLUMN IF NOT EXISTS author_name text DEFAULT 'Anonymous',
  ADD COLUMN IF NOT EXISTS author_avatar text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS user_id uuid;

-- prompts jadvaliga qo'shimcha ustunlar  
ALTER TABLE prompts
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS author_name text DEFAULT 'Anonymous',
  ADD COLUMN IF NOT EXISTS author_avatar text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS ai_model text DEFAULT 'Any',
  ADD COLUMN IF NOT EXISTS user_id uuid;

-- author_id ni nullable qilamiz (anonymous foydalanuvchilar uchun)
ALTER TABLE snippets ALTER COLUMN author_id DROP NOT NULL;
ALTER TABLE prompts ALTER COLUMN author_id DROP NOT NULL;

-- RLS: Hamma insert qila olsin (login bo'lmagan ham)
DROP POLICY IF EXISTS "Authenticated insert snippets" ON snippets;
DROP POLICY IF EXISTS "Authenticated insert prompts" ON prompts;

CREATE POLICY "Anyone insert snippets" ON snippets
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone insert prompts" ON prompts
  FOR INSERT WITH CHECK (true);

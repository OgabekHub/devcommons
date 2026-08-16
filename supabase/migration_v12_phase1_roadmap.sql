-- =============================================
-- DevCommons Migration V12 — Roadmap Phase 1
-- Features: Forks, Used Counts, Item Versions
-- =============================================

-- 1. Snippets jadvaliga yangi ustunlar
ALTER TABLE snippets 
  ADD COLUMN IF NOT EXISTS used_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS forks_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES snippets(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS current_version text DEFAULT 'v1';

-- 2. Prompts jadvaliga yangi ustunlar
ALTER TABLE prompts 
  ADD COLUMN IF NOT EXISTS used_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS forks_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES prompts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS current_version text DEFAULT 'v1';

-- 3. Kontent versiyalari uchun yangi jadval
CREATE TABLE IF NOT EXISTS item_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('snippet', 'prompt')),
  version_label text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  changelog text,
  created_at timestamptz DEFAULT now()
);

-- Indexlar
CREATE INDEX IF NOT EXISTS idx_item_versions_item_id ON item_versions(item_id);

-- Row Level Security (RLS)
ALTER TABLE item_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read item_versions" ON item_versions FOR SELECT USING (true);
CREATE POLICY "Authenticated insert item_versions" ON item_versions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

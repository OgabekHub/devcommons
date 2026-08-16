-- =============================================
-- Migration V13: Phase 2 (Gamification, Workflows, Verified Badges)
-- =============================================

-- 1. Verified Badges (Tasdiqlanganlik)
ALTER TABLE snippets ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- 2. Skill Bundles (Qobiliyat paketlari / Workflows)
CREATE TABLE IF NOT EXISTS skill_bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  author_id uuid REFERENCES users(id) ON DELETE CASCADE,
  items jsonb NOT NULL DEFAULT '[]', -- Array of { type: "snippet"|"prompt", id: uuid }
  votes integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for skill bundles
CREATE INDEX IF NOT EXISTS idx_skill_bundles_author ON skill_bundles(author_id);
CREATE INDEX IF NOT EXISTS idx_skill_bundles_votes ON skill_bundles(votes desc);
CREATE INDEX IF NOT EXISTS idx_skill_bundles_created ON skill_bundles(created_at desc);

-- RLS for Skill Bundles
ALTER TABLE skill_bundles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skill bundles are viewable by everyone"
  ON skill_bundles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own skill bundles"
  ON skill_bundles FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own skill bundles"
  ON skill_bundles FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own skill bundles"
  ON skill_bundles FOR DELETE
  USING (auth.uid() = author_id);

-- 3. Leaderboard View (Gamification)
-- Calculates impact score on the fly for all resources combined
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT 
  'snippet' as item_type,
  id,
  title,
  author_id,
  votes,
  view_count,
  used_count,
  forks_count,
  created_at,
  (COALESCE(forks_count, 0) * 10 + COALESCE(used_count, 0) * 5 + COALESCE(votes, 0) * 2) as impact_score
FROM snippets
UNION ALL
SELECT 
  'prompt' as item_type,
  id,
  title,
  author_id,
  votes,
  view_count,
  used_count,
  forks_count,
  created_at,
  (COALESCE(forks_count, 0) * 10 + COALESCE(used_count, 0) * 5 + COALESCE(votes, 0) * 2) as impact_score
FROM prompts;

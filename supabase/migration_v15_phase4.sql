-- =============================================
-- Migration V15: Phase 4 (Teams & Monetization)
-- =============================================

-- 1. Moliyalashtirish
ALTER TABLE users ADD COLUMN IF NOT EXISTS sponsor_url text;

-- 2. Jamoalar (Teams)
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id text,
  created_at timestamptz DEFAULT now()
);

-- 3. Jamoa A'zolari (Team Members)
CREATE TABLE IF NOT EXISTS team_members (
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text DEFAULT 'member', -- owner, admin, member
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

-- 4. Barcha resurslarga jamoa cheklovi (team_id)
ALTER TABLE snippets ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES teams(id) ON DELETE SET NULL;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES teams(id) ON DELETE SET NULL;
ALTER TABLE skill_bundles ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES teams(id) ON DELETE SET NULL;

-- 5. RLS qoidalarini yangilash
-- Snippets
DROP POLICY IF EXISTS "Snippets are viewable by everyone" ON snippets;
CREATE POLICY "Snippets visibility"
  ON snippets FOR SELECT
  USING (
    team_id IS NULL 
    OR auth.uid() = author_id 
    OR EXISTS (SELECT 1 FROM team_members WHERE team_id = snippets.team_id AND user_id = auth.uid())
  );

-- Prompts
DROP POLICY IF EXISTS "Prompts are viewable by everyone" ON prompts;
CREATE POLICY "Prompts visibility"
  ON prompts FOR SELECT
  USING (
    team_id IS NULL 
    OR auth.uid() = author_id 
    OR EXISTS (SELECT 1 FROM team_members WHERE team_id = prompts.team_id AND user_id = auth.uid())
  );

-- Skill Bundles
DROP POLICY IF EXISTS "Skill bundles are viewable by everyone" ON skill_bundles;
CREATE POLICY "Skill bundles visibility"
  ON skill_bundles FOR SELECT
  USING (
    team_id IS NULL 
    OR auth.uid() = author_id 
    OR EXISTS (SELECT 1 FROM team_members WHERE team_id = skill_bundles.team_id AND user_id = auth.uid())
  );

-- Teams RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teams visibility"
  ON teams FOR SELECT
  USING (
    auth.uid() = owner_id 
    OR EXISTS (SELECT 1 FROM team_members WHERE team_id = teams.id AND user_id = auth.uid())
  );
  
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team members visibility"
  ON team_members FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM team_members AS tm WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid())
  );

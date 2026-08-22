-- Migration v16: Security hardening — restrict anonymous inserts
-- Previously anyone could insert snippets and prompts without authentication.
-- This migration requires authentication for all write operations.

-- ========================================
-- 1. Drop insecure policies that allow anonymous inserts
-- ========================================

DROP POLICY IF EXISTS "Anyone insert snippets" ON snippets;
DROP POLICY IF EXISTS "Anyone insert prompts" ON prompts;

-- ========================================
-- 2. Create authenticated-only insert policies
-- ========================================

-- Only authenticated users can insert snippets
CREATE POLICY "Authenticated users insert snippets" ON snippets
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only authenticated users can insert prompts
CREATE POLICY "Authenticated users insert prompts" ON prompts
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ========================================
-- 3. Ensure RLS is enabled on tables that may be missing it
-- ========================================

ALTER TABLE IF EXISTS teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS skill_bundles ENABLE ROW LEVEL SECURITY;

-- Teams: public read, only owner can modify
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'teams' AND policyname = 'Public read teams'
  ) THEN
    CREATE POLICY "Public read teams" ON teams FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'teams' AND policyname = 'Owner manages team'
  ) THEN
    CREATE POLICY "Owner manages team" ON teams
      FOR ALL
      USING (owner_id = auth.uid())
      WITH CHECK (owner_id = auth.uid());
  END IF;
END $$;

-- Team members: team members can read, owner can manage
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'team_members' AND policyname = 'Team members can read'
  ) THEN
    CREATE POLICY "Team members can read" ON team_members
      FOR SELECT
      USING (
        user_id = auth.uid() OR
        team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'team_members' AND policyname = 'Owner manages members'
  ) THEN
    CREATE POLICY "Owner manages members" ON team_members
      FOR ALL
      USING (team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid()))
      WITH CHECK (team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid()));
  END IF;
END $$;

-- Skill bundles: public read, authenticated create
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'skill_bundles' AND policyname = 'Public read skill_bundles'
  ) THEN
    CREATE POLICY "Public read skill_bundles" ON skill_bundles FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'skill_bundles' AND policyname = 'Auth insert skill_bundles'
  ) THEN
    CREATE POLICY "Auth insert skill_bundles" ON skill_bundles
      FOR INSERT
      WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- ========================================
-- 4. Add rate limiting hint for feedback table (comment for app-level enforcement)
-- ========================================
-- Note: feedback table allows unauthenticated inserts intentionally,
-- but app-level rate limiting should be enforced in the server action.
COMMENT ON TABLE feedback IS 'User feedback - allows unauthenticated inserts but requires app-level rate limiting';

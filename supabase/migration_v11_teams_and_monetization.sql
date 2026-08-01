-- DevCommons Migration v11 (Phase 4 - Teams & Monetization)
-- Adds schemas for B2B Team Workspaces, Private Rules, and Pro Subscriptions.

-- 1. Teams Table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free', -- 'free', 'pro', 'team', 'enterprise'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Team Members Table (RBAC)
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'viewer', -- 'owner', 'admin', 'editor', 'viewer'
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- 3. Modify Snippets to support Teams and Privacy
ALTER TABLE public.snippets
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;

-- 4. Modify Prompts to support Teams and Privacy
ALTER TABLE public.prompts
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;

-- 5. Modify Workflow/Collections (Skill Bundles) for Teams and Privacy
ALTER TABLE public.collections
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- TEAMS: Anyone can view public team profiles
CREATE POLICY "Teams are viewable by everyone"
  ON public.teams FOR SELECT
  USING (true);

-- TEAMS: Only team members with 'owner' or 'admin' role can update team
CREATE POLICY "Team admins can update team details"
  ON public.teams FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = id AND user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- TEAM MEMBERS: Users can view members of teams they belong to
CREATE POLICY "Users can view their team members"
  ON public.team_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_id AND tm.user_id = auth.uid()
    )
  );

-- PRIVATE SNIPPETS RLS: Users can only see private snippets if they created them, OR if they belong to the same team
CREATE POLICY "Users can view private team snippets"
  ON public.snippets FOR SELECT
  USING (
    is_private = false 
    OR author_id = auth.uid() 
    OR (
      team_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_id = public.snippets.team_id AND user_id = auth.uid()
      )
    )
  );

-- PRIVATE PROMPTS RLS:
CREATE POLICY "Users can view private team prompts"
  ON public.prompts FOR SELECT
  USING (
    is_private = false 
    OR author_id = auth.uid() 
    OR (
      team_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_id = public.prompts.team_id AND user_id = auth.uid()
      )
    )
  );

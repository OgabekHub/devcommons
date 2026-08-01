-- Migration v10: AI Workflow Infrastruture (Versioning, Fork Count, and Used Count)

-- 1. Add usage analytics and fork tracking columns to snippets and prompts
ALTER TABLE public.snippets 
ADD COLUMN IF NOT EXISTS used_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS forks_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.snippets(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS current_version VARCHAR(20) DEFAULT 'v1';

ALTER TABLE public.prompts 
ADD COLUMN IF NOT EXISTS used_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS forks_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.prompts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS current_version VARCHAR(20) DEFAULT 'v1';

-- 2. Create version history table for tracking prompt & rule revisions (v1, v2, v3...)
CREATE TABLE IF NOT EXISTS public.item_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL,
  item_type VARCHAR(20) NOT NULL, -- 'snippet' or 'prompt'
  version_label VARCHAR(20) NOT NULL, -- e.g., 'v1', 'v2', 'v3'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  changelog TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_item_versions_item_id ON public.item_versions(item_id, item_type);

-- 3. Row Level Security for item_versions
ALTER TABLE public.item_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to item_versions"
ON public.item_versions
FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated insert to item_versions"
ON public.item_versions
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- 4. Atomic Metric Incrementer (Used for copy count, download count, and fork count)
CREATE OR REPLACE FUNCTION increment_metric(target_table TEXT, target_column TEXT, item_id UUID)
RETURNS VOID AS $$
BEGIN
  IF target_table IN ('snippets', 'prompts') AND target_column IN ('used_count', 'forks_count') THEN
    EXECUTE format('UPDATE %I SET %I = COALESCE(%I, 0) + 1 WHERE id = $1', target_table, target_column, target_column)
    USING item_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

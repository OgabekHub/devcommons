-- =============================================
-- Migration V14: Phase 3 (GitHub Sync)
-- =============================================

ALTER TABLE snippets ADD COLUMN IF NOT EXISTS github_repo text;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS github_repo text;

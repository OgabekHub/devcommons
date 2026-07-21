-- =============================================
-- DevCommons Migration V6 — Faza 2 (Notifications & Feed)
-- =============================================

-- 1. Notifications jadvali
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  actor_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL, -- 'vote_snippet', 'vote_prompt', 'comment_snippet', 'comment_prompt', 'follow'
  snippet_id uuid REFERENCES snippets(id) ON DELETE CASCADE,
  prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Indexlar
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);

-- RLS Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User read own notifications" ON notifications
  for SELECT USING (auth.uid() = user_id);

CREATE POLICY "User update own notifications" ON notifications
  for UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated insert notifications" ON notifications
  for INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "User delete own notifications" ON notifications
  for DELETE USING (auth.uid() = user_id);

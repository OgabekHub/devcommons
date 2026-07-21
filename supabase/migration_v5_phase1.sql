-- =============================================
-- DevCommons Migration V5 — Faza 1
-- =============================================

-- 1. Comment votes uchun RPC funksiya
CREATE OR REPLACE FUNCTION increment_comment_votes(comment_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE comments SET votes = votes + 1 WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Users jadvaliga bio, display_name, location qo'shish
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS location text;

-- 3. Users jadvaliga o'z profilini yangilash huquqi
CREATE POLICY "User update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 4. Bookmarks ni hamma ko'ra olishi kerak (foydalanuvchi boshqalarni ham bookmark qilganini bilish uchun — ixtiyoriy)
-- Hozircha faqat o'zi ko'ra oladi (existing policy yetarli)

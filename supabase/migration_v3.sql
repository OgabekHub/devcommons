-- =============================================
-- DevCommons Migration V3: Functions and Triggers
-- =============================================

-- 1. Ovoz berish (Voting) uchun RPC funksiyasi (Security Definer - RLS dan o'tadi)
CREATE OR REPLACE FUNCTION increment_votes(row_id uuid, table_name text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER -- Postgres (super-user) huquqi bilan ishlaydi
AS $$
DECLARE
  new_votes integer;
BEGIN
  IF table_name = 'snippets' THEN
    UPDATE snippets
    SET votes = COALESCE(votes, 0) + 1
    WHERE id = row_id
    RETURNING votes INTO new_votes;
  ELSIF table_name = 'prompts' THEN
    UPDATE prompts
    SET votes = COALESCE(votes, 0) + 1
    WHERE id = row_id
    RETURNING votes INTO new_votes;
  ELSE
    RAISE EXCEPTION 'Noto''g''ri jadval nomi';
  END IF;
  RETURN new_votes;
END;
$$;

-- 2. Yangi foydalanuvchi ro'yxatdan o'tganda (GitHub OAuth)
-- avtomatik ravishda public.users jadvaliga yozadigan trigger funksiyasi
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, github_username, avatar_url)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'user_name', 
      new.raw_user_meta_data->>'preferred_username', 
      'user_' || substr(new.id::text, 1, 8)
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE
  SET github_username = EXCLUDED.github_username,
      avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$;

-- Triggerni bog'lash
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

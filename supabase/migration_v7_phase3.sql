-- =============================================
-- DevCommons Migration V7 — Faza 3 (Collections)
-- =============================================

-- 1. Collections jadvali
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  author_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 2. Collection_items jadvali
CREATE TABLE IF NOT EXISTS collection_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE NOT NULL,
  snippet_id uuid REFERENCES snippets(id) ON DELETE CASCADE,
  prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  -- Bitta to'plamda bir xil narsani ikki marta saqlamaslik uchun:
  UNIQUE (collection_id, snippet_id),
  UNIQUE (collection_id, prompt_id)
);

-- Indexlar
CREATE INDEX IF NOT EXISTS idx_collections_author ON collections(author_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON collection_items(collection_id);

-- RLS Policies - Collections
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public collections are visible to everyone" ON collections
  FOR SELECT USING (is_public = true OR auth.uid() = author_id);

CREATE POLICY "Users can insert their own collections" ON collections
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own collections" ON collections
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own collections" ON collections
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies - Collection Items
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view items in public collections" ON collection_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE id = collection_items.collection_id
      AND (is_public = true OR author_id = auth.uid())
    )
  );

CREATE POLICY "Users can add items to their own collections" ON collection_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM collections
      WHERE id = collection_items.collection_id
      AND author_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove items from their own collections" ON collection_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE id = collection_items.collection_id
      AND author_id = auth.uid()
    )
  );

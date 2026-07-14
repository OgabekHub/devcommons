-- =============================================
-- DevCommons Database Schema
-- =============================================

-- Foydalanuvchilar (Supabase Auth bilan bog'liq)
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  github_username text unique not null,
  avatar_url text,
  created_at timestamptz default now()
);

-- Kod snippet'lar
create table snippets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  code text not null,
  language text not null,
  author_id uuid references users(id) on delete cascade,
  votes integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- AI prompt'lar
create table prompts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text not null,
  author_id uuid references users(id) on delete cascade,
  votes integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tag'lar
create table tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

-- Many-to-many: Snippet ↔ Tag
create table snippet_tags (
  snippet_id uuid references snippets(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (snippet_id, tag_id)
);

-- Many-to-many: Prompt ↔ Tag
create table prompt_tags (
  prompt_id uuid references prompts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (prompt_id, tag_id)
);

-- =============================================
-- Indexlar (qidiruv tezligi uchun)
-- =============================================
create index idx_snippets_language on snippets(language);
create index idx_snippets_author on snippets(author_id);
create index idx_snippets_created on snippets(created_at desc);
create index idx_prompts_category on prompts(category);
create index idx_prompts_author on prompts(author_id);
create index idx_prompts_created on prompts(created_at desc);
create index idx_tags_name on tags(name);

-- =============================================
-- Row Level Security (RLS)
-- =============================================
alter table users enable row level security;
alter table snippets enable row level security;
alter table prompts enable row level security;
alter table tags enable row level security;
alter table snippet_tags enable row level security;
alter table prompt_tags enable row level security;

-- Hamma o'qiy oladi
create policy "Public read users" on users for select using (true);
create policy "Public read snippets" on snippets for select using (true);
create policy "Public read prompts" on prompts for select using (true);
create policy "Public read tags" on tags for select using (true);
create policy "Public read snippet_tags" on snippet_tags for select using (true);
create policy "Public read prompt_tags" on prompt_tags for select using (true);

-- Faqat autentifikatsiyadan o'tganlar qo'sha oladi
create policy "Authenticated insert snippets" on snippets
  for insert with check (auth.uid() = author_id);
create policy "Authenticated insert prompts" on prompts
  for insert with check (auth.uid() = author_id);

-- Foydalanuvchi faqat o'zining snippet/prompt'ini tahrirlay oladi
create policy "Owner update snippets" on snippets
  for update using (auth.uid() = author_id);
create policy "Owner update prompts" on prompts
  for update using (auth.uid() = author_id);

-- Foydalanuvchi faqat o'zining snippet/prompt'ini o'chira oladi
create policy "Owner delete snippets" on snippets
  for delete using (auth.uid() = author_id);
create policy "Owner delete prompts" on prompts
  for delete using (auth.uid() = author_id);

-- Tag qo'shish/o'chirish faqat auth foydalanuvchilarga
create policy "Authenticated insert tags" on tags
  for insert with check (auth.uid() is not null);
create policy "Authenticated insert snippet_tags" on snippet_tags
  for insert with check (auth.uid() is not null);
create policy "Authenticated insert prompt_tags" on prompt_tags
  for insert with check (auth.uid() is not null);

-- =============================================
-- Trigger: updated_at avtomatik yangilanishi
-- =============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger snippets_updated_at
  before update on snippets
  for each row execute function update_updated_at();

create trigger prompts_updated_at
  before update on prompts
  for each row execute function update_updated_at();

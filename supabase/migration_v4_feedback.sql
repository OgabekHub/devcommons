-- =============================================
-- Migration V4: Feedback System
-- =============================================

create table feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  type text not null check (type in ('bug', 'suggestion', 'other')),
  content text not null,
  created_at timestamptz default now()
);

-- Index for sorting
create index idx_feedback_created on feedback(created_at desc);

-- RLS
alter table feedback enable row level security;

-- Hamma fikr yubora oladi (Anonim yoki Auth)
create policy "Public insert feedback" on feedback
  for insert with check (true);

-- FAQAT admin (Supabase dashboard) o'qiy oladi, boshqalar o'qiy olmaydi.
-- Boshqa hech qanday SELECT policy yozmaymiz, shu sababli default deny bo'ladi.

-- Schema for the Poll App. Run this once in the Supabase SQL editor.

create table surveys (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  category    text,
  end_date    date,
  status      text not null default 'published',
  content     jsonb not null,
  created_at  timestamptz not null default now()
);

create table votes (
  id          uuid primary key default gen_random_uuid(),
  survey_id   uuid not null references surveys(id) on delete cascade,
  question_id text not null,
  option_id   text not null,
  created_at  timestamptz not null default now()
);

create index votes_survey_idx on votes (survey_id);

alter table surveys enable row level security;
alter table votes enable row level security;

-- The app has no login, so reading and creating is open to everyone.
-- No update or delete policies exist, which means row level security
-- blocks those operations for every client.

create policy "Anyone can read surveys"
  on surveys for select
  using (true);

create policy "Anyone can create surveys"
  on surveys for insert
  with check (true);

create policy "Anyone can read votes"
  on votes for select
  using (true);

create policy "Anyone can cast votes"
  on votes for insert
  with check (true);

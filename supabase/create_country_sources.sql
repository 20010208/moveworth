-- country_sources テーブル
-- 国別ビザ・移住情報の一次情報URLを管理する資産テーブル
-- Supabase SQL Editor で実行してください

create table if not exists country_sources (
  id               uuid primary key default gen_random_uuid(),
  country_code     text not null,
  purpose          text not null check (purpose in ('visa', 'study', 'general')),
  url              text not null,
  last_verified_at timestamptz,
  status           text not null default 'unknown' check (status in ('alive', 'dead', 'unknown')),
  source           text not null default 'ai_suggested' check (source in ('ai_suggested', 'manual')),
  created_at       timestamptz not null default now(),

  unique (country_code, url)
);

create index if not exists country_sources_country_code_idx on country_sources (country_code);
create index if not exists country_sources_status_idx on country_sources (status);

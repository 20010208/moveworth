-- country_sources テーブル
-- 国別ビザ・移住情報の一次情報URLを管理する資産テーブル
-- Supabase SQL Editor で実行してください

create table if not exists country_sources (
  id               uuid primary key default gen_random_uuid(),
  country_code     text not null,
  purpose          text not null check (purpose in ('visa', 'study', 'general')),
  url              text not null,
  last_verified_at timestamptz,
  -- alive: 正常  dead: URL消滅確定  unverified: bot遮断疑い/タイムアウト（要手動確認）  unknown: 未検証
  status           text not null default 'unknown' check (status in ('alive', 'dead', 'unverified', 'unknown')),
  source           text not null default 'ai_suggested' check (source in ('ai_suggested', 'manual')),
  created_at       timestamptz not null default now(),

  unique (country_code, url)
);

-- 既存テーブルへの適用（テーブルが既に存在する場合はこちらを実行）:
-- alter table country_sources drop constraint country_sources_status_check;
-- alter table country_sources add constraint country_sources_status_check
--   check (status in ('alive', 'dead', 'unverified', 'unknown'));

create index if not exists country_sources_country_code_idx on country_sources (country_code);
create index if not exists country_sources_status_idx on country_sources (status);

-- ===== ラベル改善第2弾: page_title カラム追加 =====
-- Supabase SQL Editor で実行してください
alter table country_sources
  add column if not exists page_title_original text,
  add column if not exists page_title_ja       text,
  add column if not exists page_title_en       text,
  add column if not exists page_title_zh       text,
  add column if not exists page_lang           text;

comment on column country_sources.page_title_original is 'ページ <title> からサイト名サフィックスを除いたテキスト（80字以内）';
comment on column country_sources.page_title_ja       is 'page_title_original の日本語訳（GPT翻訳）';
comment on column country_sources.page_title_en       is 'page_title_original の英語訳（GPT翻訳）';
comment on column country_sources.page_title_zh       is 'page_title_original の中国語訳（GPT翻訳）';
comment on column country_sources.page_lang           is 'ソースページの言語コード（BCP-47 第1セグメント, 例: en/ko/de/fr）';

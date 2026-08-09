-- country_sources.content_hash / content_hash_at
-- ソース本文の変化検知（scripts/check-source-content-hash.ts）用フィールド
-- Supabase SQL Editor で実行してください
--
-- 設計方針:
--   - 既存rowはcontent_hash / content_hash_atともNULLから開始する（backfillしない）。
--     NULLは「初回未記録」を表す正しい初期状態であり、
--     check-source-content-hash.tsの初回成功fetch時にbaseline hashとして記録される
--     （NULLはchanged判定に入らず、通知なしでDB保存のみ行われる設計。詳細は同ファイル参照）。
--   - content_hash / content_hash_atをWHERE/filter/sortに使用する処理は現状ないため、
--     indexは追加しない。
--   - PostgRESTのスキーマキャッシュ反映（NOTIFY pgrst, 'reload schema';）は
--     本ファイルに含めず、適用時の別手順として扱う（add_scheduled_publish_at.sqlと同じ方針）。

alter table country_sources
  add column if not exists content_hash text,
  add column if not exists content_hash_at timestamptz;

comment on column country_sources.content_hash is
  'ソース本文（先頭4000文字・HTML除去後）のSHA-256ハッシュ先頭16文字。NULLは未記録（初回未実行）。';
comment on column country_sources.content_hash_at is
  'content_hashを最後に記録した日時（UTC）。NULLは未記録（初回未実行）。';

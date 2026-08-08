-- study_blog_posts.scheduled_publish_at
-- Study記事（study-country-*/study-work-*）の公開予約フィールド
-- Supabase SQL Editor で実行してください
--
-- 設計方針:
--   - 既存の `date` 列は表示用metadataのまま維持し、予約判定には使用しない
--     （scheduled publisher / 通常publisherいずれの候補選定ロジックも
--      blog_posts.published_at または本カラムのみを参照する）。
--   - NULL: 通常publisher（publish-study-country-next.ts / publish-study-work-next.ts）の
--     管理下のまま。予約なし。
--   - timestamptz値あり: scripts/publish-scheduled-study.ts が管理する予約済み記事。
--     通常publisherの対象からは除外される（scripts/publish-study-country-next.ts,
--     scripts/publish-study-work-next.ts 側で `scheduled_publish_at IS NULL` を条件に追加済み）。
--   - is_published=true になった後もscheduled_publish_atは監査記録として残す（クリアしない）。

alter table study_blog_posts
  add column if not exists scheduled_publish_at timestamptz null;

comment on column study_blog_posts.scheduled_publish_at is
  '公開予約日時（UTC）。NULLなら通常publisher管理、値ありなら publish-scheduled-study.ts が到達判定して公開する。公開後もクリアせず監査記録として保持する。';

-- 予約publisherのcandidate query（is_published=false AND scheduled_publish_at <= now()）に対応する部分index。
-- 対象行数は少数想定のため、過度に複雑なindexは追加しない。
-- index名は本番へ手動適用済みの実際のindex名（idx_study_blog_posts_scheduled_publish_at）に
-- 合わせている。IF NOT EXISTSのため、将来このSQLを再実行しても既存indexを認識し、
-- 重複するindexを作成しない。
create index if not exists idx_study_blog_posts_scheduled_publish_at
  on study_blog_posts (scheduled_publish_at)
  where is_published = false and scheduled_publish_at is not null;

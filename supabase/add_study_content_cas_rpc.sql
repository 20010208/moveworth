-- study_blog_posts.content の安全な部分更新（compare-and-swap）用RPC
-- Supabase SQL Editor で実行してください
--
-- 目的:
--   scripts/patch-study-validator-debt-batch1.ts 等、公開済みstudy記事のcontent
--   （参考資料URL等のtarget patch）を安全に本番反映するための server-side CAS。
--   クライアント側の「SELECT→加工→無条件UPDATE」というread-modify-writeでは、
--   取得後に別経路（手動publish・並行run・別セッション）でcontentが変化していても
--   検知できず、意図せず古い前提で上書きするrace conditionが起き得る。
--   本RPCは「id・is_published=true・content(全体)が呼び出し時点で渡された
--   期待値と完全一致する場合にのみ」atomicにUPDATEし、それ以外は0行を返す
--   （更新しない）ことで、この race conditionを構造的に防ぐ。
--
-- 契約:
--   - p_expected_content が現在のDB上のcontentと一致しない場合、
--     0行のまま何も更新しない（stale content / 競合として呼び出し側が扱う）
--   - is_published=false の記事（下書き）は対象外（false→true等の公開状態変更や
--     scheduled_publish_at管理下の記事を誤って書き換えないため）
--   - content以外の列（title/description/slug/date/category/is_published/
--     scheduled_publish_at/published_at/thumbnail等）は一切変更しない
--   - id は study_blog_posts の主キーであるため、本RPCが2行以上を対象にすることは
--     スキーマ上構造的に起こり得ない。呼び出し側は返却行数を
--     0行=競合により未更新／1行=成功／2行以上=スキーマ不変条件違反（system error）
--     として扱うこと（0/1/2+の判定は呼び出し側スクリプトの責務）

create or replace function public.study_blog_posts_cas_update_content(
  p_id uuid,
  p_expected_content jsonb,
  p_new_content jsonb
)
returns table (id uuid)
language sql
security invoker
set search_path = public, pg_temp
as $$
  update public.study_blog_posts
  set content = p_new_content
  where study_blog_posts.id = p_id
    and study_blog_posts.is_published = true
    and study_blog_posts.content = p_expected_content
  returning study_blog_posts.id;
$$;

comment on function public.study_blog_posts_cas_update_content(uuid, jsonb, jsonb) is
  'study_blog_posts.content の compare-and-swap更新。id一致・is_published=true・content(全体)が
   p_expected_content と完全一致する場合にのみ p_new_content へatomic更新し、更新行のidを返す。
   一致しない場合は0行（更新しない）。SECURITY INVOKER（呼び出し元のservice_role権限で実行、
   権限昇格なし）。search_pathを固定しobject解決のすり替えを防止。';

-- 実行権限: service_role（バックエンドscript/Workflow）専用。
-- PostgREST経由でも anon/authenticated からは呼び出せないようにする。
revoke all on function public.study_blog_posts_cas_update_content(uuid, jsonb, jsonb) from public;
revoke all on function public.study_blog_posts_cas_update_content(uuid, jsonb, jsonb) from anon;
revoke all on function public.study_blog_posts_cas_update_content(uuid, jsonb, jsonb) from authenticated;
grant execute on function public.study_blog_posts_cas_update_content(uuid, jsonb, jsonb) to service_role;

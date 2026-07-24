/**
 * miricanvas-ai-presentation-guide-2026 の公開（--publish-only相当、再生成なし）
 * - blog_posts / study_blog_posts 両テーブルの is_published のみ true へ切り替える
 * - content・title等は一切変更しない
 * - 対象外レコードのスナップショットをbefore/afterで機械比較し、影響がないことを確認する
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const SLUG = "miricanvas-ai-presentation-guide-2026";

async function snapshotOthers(table: "blog_posts" | "study_blog_posts") {
  const { data, error } = await sb.from(table).select("slug, is_published, title, description, content").neq("slug", SLUG).order("slug");
  if (error) throw new Error(`${table} スナップショット取得失敗: ${error.message}`);
  return data;
}

async function publishTable(table: "blog_posts" | "study_blog_posts") {
  const { data: before, error: beforeErr } = await sb
    .from(table)
    .select("slug, is_published, content, title")
    .eq("slug", SLUG)
    .single();
  if (beforeErr || !before) throw new Error(`${table} 対象レコード取得失敗: ${beforeErr?.message}`);
  if (before.is_published !== false) {
    throw new Error(`${table}: is_publishedがfalseではありません（現在値: ${before.is_published}）`);
  }

  const othersBefore = await snapshotOthers(table);
  console.log(`[${table}] 対象外レコード件数: ${othersBefore.length}`);

  const { error: updateErr } = await sb.from(table).update({ is_published: true }).eq("slug", SLUG);
  if (updateErr) throw new Error(`${table} 公開処理失敗: ${updateErr.message}`);

  const { data: after, error: afterErr } = await sb
    .from(table)
    .select("slug, is_published, content, title")
    .eq("slug", SLUG)
    .single();
  if (afterErr || !after) throw new Error(`${table} 公開後レコード取得失敗: ${afterErr?.message}`);
  if (after.is_published !== true) throw new Error(`${table}: is_publishedがtrueになっていません`);
  if (JSON.stringify(after.content) !== JSON.stringify(before.content)) {
    throw new Error(`${table}: contentが公開処理中に変化しています`);
  }
  if (JSON.stringify(after.title) !== JSON.stringify(before.title)) {
    throw new Error(`${table}: titleが公開処理中に変化しています`);
  }
  console.log(`[${table}] ✅ is_published=true / content・title不変を確認`);

  const othersAfter = await snapshotOthers(table);
  if (othersAfter.length !== othersBefore.length) {
    throw new Error(`${table}: 対象外レコード件数が変化 before=${othersBefore.length} after=${othersAfter.length}`);
  }
  let mismatch = 0;
  for (let i = 0; i < othersBefore.length; i++) {
    if (JSON.stringify(othersBefore[i]) !== JSON.stringify(othersAfter[i])) {
      mismatch++;
      console.error(`  ❌ 変化検出: ${othersBefore[i].slug}`);
    }
  }
  if (mismatch > 0) throw new Error(`${table}: 対象外レコードに${mismatch}件の変化`);
  console.log(`[${table}] ✅ 対象外 ${othersAfter.length}件: 完全不変を確認`);
}

async function main() {
  await publishTable("blog_posts");
  await publishTable("study_blog_posts");
  console.log(`\n✅ 公開完了: ${SLUG}`);
  console.log(`URL (money): https://www.moveworthapp.com/blog/${SLUG}`);
  console.log(`URL (study): https://study.moveworthapp.com/blog/${SLUG}`);
}

main().catch((e) => {
  console.error("❌", e.message ?? e);
  process.exit(1);
});

/**
 * suika-vpn-overseas-japanese-streaming-guide-2026 の公開（--publish-only相当）
 * - is_published のみを true へ切り替える。content・title・description等は一切変更しない
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
const SLUG = "suika-vpn-overseas-japanese-streaming-guide-2026";

type Snapshot = { slug: string; is_published: boolean; title: unknown; description: unknown; content: unknown };

async function snapshotOthers(): Promise<Snapshot[]> {
  const { data, error } = await sb
    .from("blog_posts")
    .select("slug, is_published, title, description, content")
    .neq("slug", SLUG)
    .order("slug");
  if (error) throw new Error(`スナップショット取得失敗: ${error.message}`);
  return data as Snapshot[];
}

async function main() {
  // 1. 公開前確認
  const { data: before, error: beforeErr } = await sb
    .from("blog_posts")
    .select("slug, is_published, content, title")
    .eq("slug", SLUG)
    .single();
  if (beforeErr || !before) {
    console.error("❌ 対象レコード取得失敗:", beforeErr?.message);
    process.exit(1);
  }
  if (before.is_published !== false) {
    console.error(`❌ is_publishedがfalseではありません（現在値: ${before.is_published}）。処理を中断します。`);
    process.exit(1);
  }
  const c = before.content as Record<string, string>;
  console.log(`✅ 公開前確認: is_published=false / JA ${c.ja.length}字 / EN ${c.en.length}字 / ZH ${c.zh.length}字`);

  // 2. 対象外レコードのスナップショット（before）
  const othersBefore = await snapshotOthers();
  console.log(`対象外レコード件数: ${othersBefore.length}`);

  // 3. is_publishedのみターゲットパッチ
  const { error: updateErr } = await sb.from("blog_posts").update({ is_published: true }).eq("slug", SLUG);
  if (updateErr) {
    console.error("❌ 公開処理失敗:", updateErr.message);
    process.exit(1);
  }

  // 4. 対象レコードの再確認（content不変・is_published=true）
  const { data: after, error: afterErr } = await sb
    .from("blog_posts")
    .select("slug, is_published, content, title")
    .eq("slug", SLUG)
    .single();
  if (afterErr || !after) {
    console.error("❌ 公開後レコード取得失敗:", afterErr?.message);
    process.exit(1);
  }
  if (after.is_published !== true) {
    console.error("❌ is_publishedがtrueになっていません");
    process.exit(1);
  }
  if (JSON.stringify(after.content) !== JSON.stringify(before.content)) {
    console.error("❌ content が公開処理中に変化しています！再生成が発生した可能性があります");
    process.exit(1);
  }
  if (JSON.stringify(after.title) !== JSON.stringify(before.title)) {
    console.error("❌ title が公開処理中に変化しています");
    process.exit(1);
  }
  console.log("✅ 対象レコード: is_published=true / content・title 不変を確認");

  // 5. 対象外レコードのスナップショット（after）→ 完全一致確認
  const othersAfter = await snapshotOthers();
  if (othersAfter.length !== othersBefore.length) {
    console.error(`❌ 対象外レコード件数が変化: before=${othersBefore.length} after=${othersAfter.length}`);
    process.exit(1);
  }
  let mismatch = 0;
  for (let i = 0; i < othersBefore.length; i++) {
    if (JSON.stringify(othersBefore[i]) !== JSON.stringify(othersAfter[i])) {
      mismatch++;
      console.error(`❌ 変化検出: ${othersBefore[i].slug}`);
    }
  }
  if (mismatch > 0) {
    console.error(`❌ 対象外レコードに${mismatch}件の変化があります`);
    process.exit(1);
  }
  console.log(`✅ 対象外レコード ${othersAfter.length}件: 完全不変を確認`);

  console.log(`\n✅ 公開完了: ${SLUG}`);
  console.log(`URL: https://www.moveworthapp.com/blog/${SLUG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

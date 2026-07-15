/**
 * GR ゴールデンビザ: v2 を正式 slug にリネームして公開
 * 旧 slug（is_published=false）を削除してから v2 のスラグを書き換え
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const OFFICIAL_SLUG = "greece-residency-visa-cost-2026";
const V2_SLUG       = "greece-residency-visa-cost-2026-v2";

async function main() {
  // 旧 slug の状態確認
  const { data: old } = await sb
    .from("blog_posts")
    .select("slug, is_published")
    .eq("slug", OFFICIAL_SLUG)
    .single();

  if (old) {
    if (old.is_published) {
      console.error(`❌ ${OFFICIAL_SLUG} が is_published=true（削除中止）`);
      process.exit(1);
    }
    // 旧 draft を削除
    const { error: delErr } = await sb
      .from("blog_posts")
      .delete()
      .eq("slug", OFFICIAL_SLUG);
    if (delErr) { console.error("旧 slug 削除失敗:", delErr.message); process.exit(1); }
    console.log(`🗑  旧 draft 削除: ${OFFICIAL_SLUG}`);
  } else {
    console.log(`ℹ  旧 slug なし（スキップ）`);
  }

  // v2 の存在確認
  const { data: v2 } = await sb
    .from("blog_posts")
    .select("slug, is_published")
    .eq("slug", V2_SLUG)
    .single();
  if (!v2) { console.error(`❌ v2 が存在しない: ${V2_SLUG}`); process.exit(1); }
  if (v2.is_published) { console.error("❌ v2 が既に is_published=true（想定外）"); process.exit(1); }

  // slug を正式名に変更 + is_published=true
  const { error: updateErr } = await sb
    .from("blog_posts")
    .update({ slug: OFFICIAL_SLUG, is_published: true })
    .eq("slug", V2_SLUG);
  if (updateErr) { console.error("更新失敗:", updateErr.message); process.exit(1); }

  // 検証
  const { data: verify } = await sb
    .from("blog_posts")
    .select("slug, is_published, title")
    .eq("slug", OFFICIAL_SLUG)
    .single();

  console.log(`✅ GR 公開完了`);
  console.log(`   slug: ${verify?.slug}`);
  console.log(`   is_published: ${verify?.is_published}`);
  console.log(`   title(ja): ${(verify?.title as Record<string,string>)?.ja}`);
}

main().catch(e => { console.error(e); process.exit(1); });

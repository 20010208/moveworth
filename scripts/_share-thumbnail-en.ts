/**
 * moveworth-march-2026-update-en のthumbnailをja版と共用
 * 新規アップロード不要 — ja版のthumbnailURLをそのまま流用
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const SRC_SLUG = "moveworth-march-2026-update";
const DST_SLUG = "moveworth-march-2026-update-en";

async function main() {
  const { data: src } = await sb.from("blog_posts").select("thumbnail").eq("slug", SRC_SLUG).single();
  if (!src?.thumbnail) { console.error(`❌ ${SRC_SLUG} に thumbnail が設定されていません`); process.exit(1); }

  const { error } = await sb.from("blog_posts").update({ thumbnail: src.thumbnail })
    .eq("slug", DST_SLUG).is("thumbnail", null);
  if (error) { console.error("DB更新エラー:", error.message); process.exit(1); }

  console.log(`✅ ${DST_SLUG} → thumbnail 設定完了（${SRC_SLUG} と共用）`);
  console.log(`   URL: ${src.thumbnail}`);

  // 公開記事の thumbnail 未設定件数確認
  const { data: noThumb } = await sb.from("blog_posts")
    .select("slug").eq("is_published", true).is("thumbnail", null);
  if (!noThumb?.length) {
    console.log("\n✅ 公開記事 全件 thumbnail 設定済み");
  } else {
    console.log(`\n⚠️  thumbnail 未設定の公開記事: ${noThumb.map(p => p.slug).join(", ")}`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });

/**
 * MY MM2H: v2 の content/title/description で既存公開記事を上書き
 * is_published=true・slug は変更しない（ダウンタイムなし）
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

const OFFICIAL_SLUG = "malaysia-mm2h-visa-complete-guide-2026";
const V2_SLUG       = "malaysia-mm2h-visa-complete-guide-2026-v2";

async function main() {
  // v2 の内容を取得
  const { data: v2, error: e1 } = await sb
    .from("blog_posts")
    .select("title, description, content, is_published")
    .eq("slug", V2_SLUG)
    .single();
  if (e1 || !v2) { console.error("v2 取得失敗:", e1?.message); process.exit(1); }
  if (v2.is_published) { console.error("❌ v2 が is_published=true（想定外）"); process.exit(1); }

  // 公開中記事の現状確認
  const { data: official } = await sb
    .from("blog_posts")
    .select("slug, is_published")
    .eq("slug", OFFICIAL_SLUG)
    .single();
  if (!official?.is_published) {
    console.error(`❌ ${OFFICIAL_SLUG} が is_published=false（想定外、確認してください）`);
    process.exit(1);
  }

  // 上書き更新（title/description/content のみ、is_published は触らない）
  const { error: updateErr } = await sb
    .from("blog_posts")
    .update({
      title:       v2.title,
      description: v2.description,
      content:     v2.content,
    })
    .eq("slug", OFFICIAL_SLUG);

  if (updateErr) { console.error("更新失敗:", updateErr.message); process.exit(1); }

  // v2 を削除
  const { error: delErr } = await sb
    .from("blog_posts")
    .delete()
    .eq("slug", V2_SLUG);
  if (delErr) { console.error("v2 削除失敗:", delErr.message); process.exit(1); }

  // 検証
  const { data: verify } = await sb
    .from("blog_posts")
    .select("slug, is_published, title")
    .eq("slug", OFFICIAL_SLUG)
    .single();

  console.log(`✅ MY 差し替え完了`);
  console.log(`   slug: ${verify?.slug}`);
  console.log(`   is_published: ${verify?.is_published}`);
  console.log(`   title(ja): ${(verify?.title as Record<string,string>)?.ja}`);
}

main().catch(e => { console.error(e); process.exit(1); });

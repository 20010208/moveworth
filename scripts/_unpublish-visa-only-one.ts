/**
 * PRESET外 VISA専用国の visa-{code} 記事を1件ずつ非公開化する
 * 引数: --code=al  (例: アルバニア)
 *
 * 段階的に実行すること。一括実行しないこと。
 * Googleのクロール評価への影響を最小化するため、週1〜2件ペースが推奨。
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

const VISA_ONLY_21 = new Set([
  "al","cl","ec","gh","jo","ke","kh","la","lk","lt",
  "lv","ma","me","mk","mu","np","pe","rs","si","sk","uy",
]);

const codeArg = process.argv.find((a) => a.startsWith("--code="));
if (!codeArg) {
  console.error("使用方法: npx tsx scripts/_unpublish-visa-only-one.ts --code=<code>");
  process.exit(1);
}
const code = codeArg.split("=")[1].toLowerCase();

if (!VISA_ONLY_21.has(code)) {
  console.error(`❌ "${code}" はPRESET外21カ国リストに含まれていません。`);
  console.error("   対象: " + [...VISA_ONLY_21].sort().join(", "));
  process.exit(1);
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function main() {
  const slug = `visa-${code}`;

  const { data, error } = await sb
    .from("blog_posts")
    .select("slug, is_published, title")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error(`❌ 記事が見つかりません: ${slug}`);
    process.exit(1);
  }

  if (!data.is_published) {
    console.log(`⏭  既に非公開またはdraft: ${slug}`);
    return;
  }

  const title = (data.title as Record<string, string>).ja ?? slug;
  console.log(`非公開化: ${slug}`);
  console.log(`  タイトル: ${title}`);

  const { error: upErr } = await sb
    .from("blog_posts")
    .update({ is_published: false })
    .eq("slug", slug);

  if (upErr) {
    console.error(`❌ 更新失敗: ${upErr.message}`);
    process.exit(1);
  }

  console.log(`✅ 非公開化完了: ${slug}`);
  console.log("   次のステップ: git commit & push 後、Googleサーチコンソールで削除リクエストを送ることを検討してください。");
}

main().catch(e => { console.error(e); process.exit(1); });

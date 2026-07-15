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

const SLUG = "malaysia-mm2h-visa-complete-guide-2026";
const BAD  = "https://www.imi.gov.my/index.php/en/index.php/en/main-services/mm2h.html";
const GOOD = "https://www.imi.gov.my/index.php/en/main-services/mm2h.html";

async function main() {
  const { data, error } = await sb
    .from("blog_posts")
    .select("content")
    .eq("slug", SLUG)
    .single();

  if (error || !data) { console.error("取得失敗:", error?.message); process.exit(1); }

  const content = data.content as Record<string, string>;
  const ja = content.ja ?? "";
  const en = content.en ?? "";

  const jaCount = (ja.match(new RegExp(BAD.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length;
  const enCount = (en.match(new RegExp(BAD.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length;
  console.log(`修正対象: JA=${jaCount}件, EN=${enCount}件`);

  if (jaCount === 0 && enCount === 0) {
    console.log("対象URLが見つかりません（既に修正済みか確認してください）");
    process.exit(0);
  }

  const newJa = ja.replaceAll(BAD, GOOD);
  const newEn = en.replaceAll(BAD, GOOD);

  const { error: updateErr } = await sb
    .from("blog_posts")
    .update({ content: { ...content, ja: newJa, en: newEn } })
    .eq("slug", SLUG);

  if (updateErr) { console.error("更新失敗:", updateErr.message); process.exit(1); }

  // 検証
  const { data: verify } = await sb
    .from("blog_posts")
    .select("content")
    .eq("slug", SLUG)
    .single();
  const vContent = verify?.content as Record<string, string>;
  const stillBad = (vContent?.ja ?? "").includes(BAD) || (vContent?.en ?? "").includes(BAD);
  const nowGood  = (vContent?.ja ?? "").includes(GOOD) && (vContent?.en ?? "").includes(GOOD);

  console.log(`破損URL残存: ${stillBad ? "❌" : "✅ なし"}`);
  console.log(`正URLを確認: ${nowGood  ? "✅" : "❌"}`);

  if (stillBad || !nowGood) { console.error("検証NG"); process.exit(1); }
  console.log("✅ URLパッチ完了");
}

main().catch(e => { console.error(e); process.exit(1); });

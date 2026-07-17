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
import { MASTER_COUNTRIES } from "../src/data/master-countries";

async function main() {
  // 1. 横断記事の実体確認
  const { data: cross } = await sb
    .from("study_blog_posts")
    .select("slug, is_published, content")
    .eq("slug", "study-abroad-work-rules-all-countries-2026")
    .maybeSingle();

  if (cross) {
    const ja = (cross.content as Record<string, string>)?.ja ?? "";
    console.log(`\n=== study-abroad-work-rules-all-countries-2026 ===`);
    console.log(`is_published: ${cross.is_published} / JA文字数: ${ja.length}`);
    console.log(`\n--- 冒頭500字 ---\n${ja.slice(0, 500)}`);
    const refSection = ja.match(/###\s*参考資料[\s\S]*$/)?.[0] ?? "(なし)";
    console.log(`\n--- 参考資料 ---\n${refSection.slice(0, 400)}`);
    // 国ごとのセクション数を数える（###で始まる行）
    const h3s = ja.match(/^### .+/gm) ?? [];
    console.log(`\nH3見出し数: ${h3s.length}`);
    console.log(h3s.slice(0, 10).join("\n"));
  } else {
    console.log("横断記事なし");
  }

  // 2. visa sources 登録状況（50カ国）
  const { data: sources } = await sb
    .from("country_sources")
    .select("country_code")
    .eq("purpose", "visa")
    .eq("status", "alive");

  const registeredCodes = new Set((sources ?? []).map((r: { country_code: string }) => r.country_code));
  const masterCodes = MASTER_COUNTRIES.map(c => c.code);

  const withSources = masterCodes.filter(c => registeredCodes.has(c));
  const withoutSources = masterCodes.filter(c => !registeredCodes.has(c));

  console.log(`\n=== visa sources 登録状況（50カ国中）===`);
  console.log(`登録あり（→ grounded study refs）: ${withSources.length} カ国`);
  console.log(`  ${withSources.join(", ")}`);
  console.log(`未登録（→ fallback 静的文言）: ${withoutSources.length} カ国`);
  console.log(`  ${withoutSources.join(", ")}`);

  // 3. study-work-{code} の本文就労時間数を抽出してみる（パース試み）
  const { data: workPosts } = await sb
    .from("study_blog_posts")
    .select("slug, content")
    .like("slug", "study-work-%");

  console.log(`\n=== 就労時間パース試み（先頭5件）===`);
  let parsed = 0;
  for (const p of (workPosts ?? [])) {
    if (parsed >= 5) break;
    const ja = (p.content as Record<string, string>)?.ja ?? "";
    const workMatch = ja.match(/学期中[：:]\s*([^\n]+)/);
    const holidayMatch = ja.match(/休暇中[：:]\s*([^\n]+)/);
    if (workMatch || holidayMatch) {
      const code = p.slug.replace("study-work-", "");
      console.log(`[${code}] 学期中: ${workMatch?.[1]?.trim() ?? "?"} / 休暇中: ${holidayMatch?.[1]?.trim() ?? "?"}`);
      parsed++;
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });

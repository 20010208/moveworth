// title.zh / description.zh の品質検証
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const REFUSAL = ["申し訳", "I cannot", "我无法", "对不起", "很抱歉", "As an AI", "无法访问"];

async function main() {
  const { data: all } = await sb.from("study_blog_posts").select("slug,title,description").order("slug");
  let ok = 0, ng = 0;
  const issues: { slug: string; problems: string[] }[] = [];

  for (const r of all ?? []) {
    const t = r.title as Record<string, string>;
    const d = r.description as Record<string, string>;
    const titleZh = t?.zh ?? "";
    const descZh = d?.zh ?? "";
    const problems: string[] = [];

    if (!titleZh || titleZh.trim().length < 3) problems.push("title.zh 未設定/短すぎ");
    if (!descZh || descZh.trim().length < 20) problems.push("description.zh 未設定/短すぎ");
    if (titleZh.includes("example.com") || descZh.includes("example.com")) problems.push("example.com 混入");
    for (const p of REFUSAL) {
      if (titleZh.includes(p) || descZh.includes(p)) problems.push(`拒否パターン: "${p}"`);
    }
    // 中国語文字が含まれているか
    const hasChinese = (s: string) => /[一-鿿]/.test(s);
    if (titleZh && !hasChinese(titleZh)) problems.push("title.zh に漢字なし（非中国語の疑い）");
    if (descZh && !hasChinese(descZh)) problems.push("description.zh に漢字なし");

    if (problems.length > 0) {
      ng++; issues.push({ slug: r.slug, problems });
    } else { ok++; }
  }

  console.log(`\n=== title.zh / description.zh 機械検証 ===`);
  console.log(`✅ 通過: ${ok}件 / ❌ 問題あり: ${ng}件`);
  if (issues.length > 0) {
    console.log("\n問題あり:");
    for (const { slug, problems } of issues) console.log(`  ${slug}: ${problems.join(", ")}`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });

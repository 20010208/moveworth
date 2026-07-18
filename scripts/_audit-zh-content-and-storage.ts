// content.zh存在確認 + Storage en.png在庫数
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
const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

async function main() {
  // 1. content.zh確認
  const { data: posts, error } = await sb.from("study_blog_posts")
    .select("slug,content,title")
    .order("slug");
  if (error || !posts) { console.error("取得失敗:", error?.message); process.exit(1); }

  const withZh: string[] = [];
  const withoutZh: string[] = [];

  for (const p of posts) {
    const content = p.content as Record<string, string> | null;
    const zh = content?.zh;
    if (zh && zh.trim().length > 50) withZh.push(p.slug);
    else withoutZh.push(p.slug);
  }

  console.log("=== content.zh 存在確認 ===\n");
  console.log(`  content.zh あり: ${withZh.length}件`);
  console.log(`  content.zh なし: ${withoutZh.length}件\n`);

  if (withoutZh.length > 0) {
    console.log("--- content.zh が存在しない記事 ---");
    for (const s of withoutZh) console.log(`  ${s}`);
    console.log();
  }

  // 2. Storage en.png在庫確認
  const res = await fetch(`${BASE_URL}/storage/v1/object/list/blog-images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefix: "", limit: 500 }),
  });
  const files = (await res.json()) as { name: string }[];
  const enFiles = (files ?? [])
    .map((f) => f.name)
    .filter((n) => /^study-country-[a-z]+-en\.png$/i.test(n))
    .sort();

  console.log("=== Storage study-country-{code}-en.png 在庫 ===\n");
  console.log(`  合計: ${enFiles.length}件\n`);

  // thumbnail_enに登録済みのコードを確認
  const { data: dbEn } = await sb.from("study_blog_posts")
    .select("slug,thumbnail_en")
    .not("thumbnail_en", "is", null)
    .ilike("slug", "study-country-%")
    .order("slug");

  const registeredCodes = new Set((dbEn ?? []).map((r) => {
    return (r.slug as string).replace("study-country-", "");
  }));

  for (const f of enFiles) {
    const code = f.replace("study-country-", "").replace("-en.png", "");
    const inDb = registeredCodes.has(code);
    console.log(`  ${inDb ? "✅ DB登録済" : "⚠️  DB未登録"} | ${f}`);
  }
  console.log(`\n  DB登録済み: ${registeredCodes.size}件 / Storage: ${enFiles.length}件`);
}
main().catch(e => { console.error(e); process.exit(1); });

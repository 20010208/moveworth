// study_blog_posts の title.zh / description.zh 現状監査
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

function isChineseText(s: string): boolean {
  // CJK統合漢字が全体の20%以上あれば中国語とみなす
  const cjk = (s.match(/[一-鿿]/g) ?? []).length;
  return cjk / s.length >= 0.15;
}

function classifyZh(title: string, desc: string): "zh" | "en" | "ja" | "none" {
  if (!title && !desc) return "none";
  const sample = (title ?? "") + " " + (desc ?? "");
  // 日本語判定 (ひらがな・カタカナ)
  if (/[぀-ヿ]/.test(sample)) return "ja";
  // 中国語判定
  if (isChineseText(sample)) return "zh";
  // それ以外は英語とみなす
  return "en";
}

async function main() {
  const { data: posts, error } = await sb.from("study_blog_posts")
    .select("slug,title,description")
    .order("slug");
  if (error || !posts) { console.error("取得失敗:", error?.message); process.exit(1); }

  const stats = { zh: 0, en: 0, ja: 0, none: 0 };
  const problems: { slug: string; titleZh: string; descZh: string; state: string }[] = [];

  for (const p of posts) {
    const t = p.title as Record<string, string>;
    const d = p.description as Record<string, string>;
    const titleZh = t?.zh ?? "";
    const descZh = d?.zh ?? "";
    const state = classifyZh(titleZh, descZh);
    stats[state]++;
    if (state !== "zh") {
      problems.push({ slug: p.slug, titleZh, descZh, state });
    }
  }

  console.log("=== study_blog_posts title.zh / description.zh 現状 ===\n");
  console.log(`  中国語化済み  : ${stats.zh}件`);
  console.log(`  英語のまま    : ${stats.en}件  ← 要対応`);
  console.log(`  日本語のまま  : ${stats.ja}件  ← 要対応`);
  console.log(`  未設定(none)  : ${stats.none}件  ← 要対応`);
  console.log(`  合計          : ${posts.length}件\n`);

  if (problems.length > 0) {
    console.log("=== 要対応一覧 ===\n");
    for (const p of problems) {
      console.log(`[${p.state.padEnd(4)}] ${p.slug}`);
      if (p.titleZh) console.log(`       title.zh: "${p.titleZh.slice(0, 60)}"`);
      else           console.log(`       title.zh: (未設定)`);
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });

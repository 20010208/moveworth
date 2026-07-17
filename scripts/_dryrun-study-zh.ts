/**
 * study_blog_posts の zh 生成ドライラン
 * DB には書き込まず、品質チェック結果のみ報告する
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const REFUSAL_PATTERNS = ["申し訳ありません", "I cannot", "I'm sorry", "As an AI", "I'm unable", "cannot access the internet", "インターネットへのアクセス", "我无法", "对不起", "很抱歉"];

function cleanJaForTranslation(ja: string): string {
  // example.com を含む行を除去（TN 等の既知プレースホルダー問題対策）
  return ja
    .split("\n")
    .filter(line => !line.includes("example.com"))
    .join("\n");
}

function cleanZhOutput(zh: string): string {
  // GPT が付加する構造ヘッダー「## 文章标题 / ## 中文翻译 / ## 文章内容」を除去
  return zh
    .replace(/^[\s\S]*?##\s*(?:中文翻译|文章内容|翻译内容)\s*\n/, "")
    .replace(/^##\s*文章标题[^\n]*\n[^\n]*\n\n?/, "")
    .trim();
}

async function generateZh(slug: string, ja: string, jaTitle: string): Promise<string> {
  const jaClean = cleanJaForTranslation(ja);
  const prompt = `以下は日本語の留学情報記事です。同じ構成・見出し順序を維持しながら、中国語（简体字）に翻訳してください。

## 翻訳ルール
- 見出し（###）は構造を維持し、日本語→中国語に翻訳すること
- 数値・費用・固有名詞はそのまま（日本語名称は中国語読みや一般的な中国語表記に変換可）
- URLは変更しない（https://study.moveworthapp.com/simulate 等）
- 「MoveWorth.study」「MoveWorthシミュレーター」は「MoveWorth.study模拟器」等自然な中国語表記に
- 文体は丁寧体（正式な情報記事として）
- 参考資料セクションがある場合はそのまま維持
- 創作や追加情報は一切加えないこと

## 記事タイトル
${jaTitle}

## 日本語原文
${jaClean.slice(0, 6000)}

中国語本文のみ返すこと（タイトル・説明文・メタ情報・コードブロック不要）。見出し（###）から始めること。`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 3000,
  });
  const raw = res.choices[0].message.content ?? "";
  return cleanZhOutput(raw);
}

function qualityCheck(slug: string, zh: string, ja: string): { pass: boolean; issues: string[] } {
  const issues: string[] = [];
  if (zh.length < 300) issues.push(`短すぎ: ${zh.length}字`);
  if (zh.length < ja.length * 0.3) issues.push(`JA比率低すぎ: zh=${zh.length} vs ja=${ja.length}`);
  if (zh.includes("example.com")) issues.push("example.com 混入");
  for (const p of REFUSAL_PATTERNS) {
    if (zh.includes(p)) issues.push(`拒否パターン: "${p}"`);
  }
  // 見出し数の一致チェック（JA の ### 行数 ± 1 以内）
  const jaHeadings = (ja.match(/^###\s/gm) ?? []).length;
  const zhHeadings = (zh.match(/^###\s/gm) ?? []).length;
  if (Math.abs(jaHeadings - zhHeadings) > 1) {
    issues.push(`見出し数不一致: ja=${jaHeadings} zh=${zhHeadings}`);
  }
  return { pass: issues.length === 0, issues };
}

async function main() {
  // 前回と同じ5件を固定指定（再現性確保）
  const TARGET_SLUGS = [
    "study-country-tr",
    "study-country-tn",
    "study-country-hr",
    "study-prep-guide-2026",
    "study-abroad-scholarship-guide-2026",
  ];
  const { data: samples } = await sb
    .from("study_blog_posts")
    .select("slug, title, content, category")
    .in("slug", TARGET_SLUGS);
  console.log(`\n=== study zh 生成ドライラン（${samples.length}件） ===\n`);

  let passed = 0;
  for (const row of samples) {
    const slug: string = row.slug;
    const ja: string = (row.content as Record<string, string>).ja ?? "";
    const jaTitle: string = (row.title as Record<string, string>).ja ?? slug;
    console.log(`▶ [${row.category}] ${slug}`);
    console.log(`  JA: ${ja.length}字`);

    const zh = await generateZh(slug, ja, jaTitle);
    const { pass, issues } = qualityCheck(slug, zh, ja);

    if (pass) {
      console.log(`  ZH: ${zh.length}字  ✅ 品質チェック通過`);
      passed++;
    } else {
      console.log(`  ZH: ${zh.length}字  ❌ 品質チェック失敗`);
      issues.forEach(i => console.log(`    • ${i}`));
    }

    // 先頭300字を提出用に表示
    console.log(`  ZH先頭300字:\n${zh.slice(0, 300).split("\n").map(l => "  " + l).join("\n")}`);
    console.log();
  }

  console.log(`=== 結果: ${passed}/${samples.length} 通過 ===`);
}

main().catch(e => { console.error(e); process.exit(1); });

/**
 * TR（トルコ）study-work-tr / study-country-tr 生成スクリプト
 * 生成後に本文全文を標準出力に出力してレビューに使用する
 */
import { existsSync, readFileSync } from "fs";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { sanitizeMoveWorthLinks } from "./utils/sanitize-links";
import { assertBlogPayload } from "./utils/validate-blog-payload";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const country = { code: "tr", name: { ja: "トルコ", en: "Turkey" } };

async function callGPT(prompt: string): Promise<{ title: string; description: string; content: string }> {
  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });
  const parsed = JSON.parse(res.choices[0].message.content!);
  return parsed;
}

async function factCheck(content: string, label: string, lang: "ja" | "en"): Promise<string> {
  const instruction = lang === "ja"
    ? `以下の記事「${label}」を事実確認してください。誤情報や誇張を修正し、正確な情報のみ残してください。Markdown構造を維持し、修正後の本文のみ返してください。`
    : `Fact-check the following article "${label}". Correct any inaccurate or exaggerated claims. Preserve Markdown structure and return only the corrected body.`;
  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: instruction },
      { role: "user", content },
    ],
    temperature: 0.1,
  });
  return res.choices[0].message.content!;
}

async function generateStudyWork() {
  console.log("\n📝 study-work-tr 生成中...");

  const jaPrompt = `あなたはMoveWorth.studyというサービスのライターです。海外留学生向けの情報サービスです。

トルコへの留学に関する記事を日本語で書いてください。

## タイトル形式（必ず守ること）
【トルコ】留学中のアルバイト・就労ルール完全ガイド

## 本文の構成（見出しは必ず ### を使うこと）

[導入段落] ※見出しなし。トルコへの留学の概要を1〜2文で書く。

### 学生ビザの概要
**ビザ種別：** （ビザ名）
**申請費用：** （費用）
**処理期間：** （期間）
**主な要件：**
- （箇条書きで3〜4点）

### アルバイト・就労ルール
**学期中：** 週○時間まで
**休暇中：** 週○時間まで（または無制限など）
**条件：** （許可取得の必要性など）

### 注意事項
1. （重要な注意点）
2. （重要な注意点）
3. （重要な注意点）

### 費用の目安
| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約○〜○万円 |
| 生活費（月額） | 約○〜○万円 |
| 住居費（月額） | 約○〜○万円 |
| 学生ビザ申請費 | 約○円 |

MoveWorth.studyのシミュレーターでトルコ留学の総費用を計算してみましょう。必ずマークダウンリンク形式 [MoveWorth.studyシミュレーター](https://study.moveworthapp.com/simulate) で記載してください。

### 参考資料
本記事の情報は以下の公式資料をもとに作成しています。
（トルコの入国管理局・労働省・政府公式サイトなど公式機関を3〜5件。実在する正確なURLのみ。捏造不可）
- [機関名](https://実在するURL)

## JSON形式で返答（JSONのみ、コードブロック不要）
{
  "title": "【トルコ】留学中のアルバイト・就労ルール完全ガイド",
  "description": "週の就労時間上限・ビザ費用・生活費を含むメタディスクリプション（120〜150文字）",
  "content": "上記構成の記事本文（マークダウン、1500〜2500文字）"
}`;

  const enPrompt = `You are a writer for MoveWorth.study, a service providing study abroad information.

Write a detailed article about studying in Turkey in English.

## Title format (strictly follow):
Study & Work Rules in Turkey 2026 — Complete Guide

## Article structure (use ### for all headings):

[Intro paragraph] — no heading. 1–2 sentences on studying in Turkey.

### Student Visa
**Type:** (visa name)
**Fee:** (amount)
**Processing:** (timeframe)
**Main requirements:**
- (3–4 bullet points)

### Work Rules
**During term:** Up to X hrs/week
**During holidays:** Up to X hrs/week (or unrestricted)
**Conditions:** (permit requirements)

### Key Notes
1. (Important note)
2. (Important note)
3. (Important note)

### Cost Estimate
| Item | Cost |
|------|------|
| Language school (monthly) | approx. X–X USD |
| Living expenses (monthly) | approx. X–X USD |
| Accommodation (monthly) | approx. X–X USD |
| Student visa fee | approx. X USD |

Use the MoveWorth.study simulator to calculate total costs. Always use markdown link format: [MoveWorth.study Simulator](https://study.moveworthapp.com/simulate)

### References
List 3-5 official sources (immigration authority, labor ministry, government site of Turkey). Real URLs only — never fabricate.
- [Organization name](https://real-official-url)

## Return as JSON only (no code block):
{
  "title": "Study & Work Rules in Turkey 2026 — Complete Guide",
  "description": "Include weekly work hour limits, visa fees and living costs (120–150 chars)",
  "content": "Full article in the structure above (markdown, 1500–2500 chars)"
}`;

  const [jaRaw, enRaw] = await Promise.all([callGPT(jaPrompt), callGPT(enPrompt)]);

  console.log("  Fact-checking pass 1...");
  const [jaFC1, enFC1] = await Promise.all([
    factCheck(jaRaw.content, "トルコ就労ルール", "ja"),
    factCheck(enRaw.content, "Turkey work rules", "en"),
  ]);

  console.log("  Fact-checking pass 2...");
  const [jaFinal, enFinal] = await Promise.all([
    factCheck(jaFC1, "トルコ就労ルール", "ja"),
    factCheck(enFC1, "Turkey work rules", "en"),
  ]);

  const jaContent = sanitizeMoveWorthLinks(jaFinal);
  const enContent = sanitizeMoveWorthLinks(enFinal);

  const hasPlaceholder = [jaContent, enContent].some(c => c.includes("example.com"));
  if (hasPlaceholder) {
    console.error("❌ [PLACEHOLDER-URL] example.com が含まれています — 保存スキップ");
    process.exit(1);
  }

  assertBlogPayload(
    { title: { ja: jaRaw.title, en: enRaw.title },
      description: { ja: jaRaw.description, en: enRaw.description },
      content: { ja: jaContent, en: enContent },
      locales: ["ja", "en"] },
    "study-work-tr"
  );

  const today = new Date().toISOString().slice(0, 10);
  const { error } = await sb.from("study_blog_posts").upsert({
    slug: "study-work-tr",
    category: "work",
    date: today,
    reading_time: 8,
    title: { ja: jaRaw.title, en: enRaw.title },
    description: { ja: jaRaw.description, en: enRaw.description },
    content: { ja: jaContent, en: enContent },
    is_published: false,
  }, { onConflict: "slug" });

  if (error) throw new Error(`study-work-tr upsert failed: ${error.message}`);
  console.log("✅ study-work-tr saved as draft");

  return { jaTitle: jaRaw.title, enTitle: enRaw.title, jaContent, enContent, jaDesc: jaRaw.description, enDesc: enRaw.description };
}

async function generateStudyCountry() {
  console.log("\n📝 study-country-tr 生成中...");

  const jaPrompt = `あなたはMoveWorth.studyのSEOライターです。「トルコ留学」を検索する日本人に向けた、検索上位を狙える記事を書いてください。

## タイトル形式（必ず守ること）
【トルコ留学】費用・語学学校・ビザ・生活を徹底解説【2026年最新版】

## 本文構成（見出しは ### を使うこと）

[導入] ※見出しなし。トルコ留学の魅力を2〜3文で。

### トルコ留学のメリット
（箇条書き4〜5点。具体的な数字・事例を含める）

### 費用の目安【2026年版】
（月額費用の表：語学学校・生活費・住居費）

### おすすめ留学都市
（3〜4都市の特徴・生活費感）

### 語学学校・大学の種類
（選択肢と特徴の概要）

### 学生ビザの基本情報
（申請要件・費用・期間の概要のみ）

### トルコの生活・文化・治安
（日本人コミュニティ・治安・食事・気候）

### よくある質問（FAQ）
Q1: トルコ留学の費用はいくらかかりますか？
A: （具体的な数字を含む回答）
Q2: トルコ留学に向いているのはどんな人ですか？
A: （特徴・向き不向き）
Q3: トルコ留学の準備はいつから始めれば良いですか？
A: （目安期間）

MoveWorth.studyのシミュレーターでトルコ留学の総費用を計算できます。必ずマークダウンリンク形式 [MoveWorth.studyシミュレーター](https://study.moveworthapp.com/simulate) で記載してください。

### 参考資料
本記事の情報は以下の公式資料をもとに作成しています。
（トルコの入国管理局・大使館・観光局・教育省など公式機関を3〜5件。実在する正確なURLのみ。捏造不可）
- [機関名](https://実在するURL)

## JSON形式で返答（JSONのみ、コードブロック不要）
{
  "title": "【トルコ留学】費用・語学学校・ビザ・生活を徹底解説【2026年最新版】",
  "description": "キーワード「トルコ留学 費用」を含む130〜155文字のメタディスクリプション",
  "content": "上記構成の記事本文（マークダウン、1500〜2500文字）"
}`;

  const enPrompt = `You are an SEO writer for MoveWorth.study. Write a comprehensive, search-optimized article for Japanese students searching to study in Turkey.

## Title format (strictly follow):
Study in Turkey 2026 — Complete Guide to Costs, Schools, Visa & Life

## Article structure (use ### for headings):

[Intro] — no heading. 2-3 sentences on why Turkey is popular for study abroad.

### Why Study in Turkey?
(4-5 bullet points with specific facts/figures)

### Estimated Costs in 2026
(Monthly cost table: language school tuition, living expenses, housing)

### Top Cities to Study In
(3-4 cities with brief description)

### Types of Schools & Programs
(Language schools, universities, vocational schools)

### Student Visa Basics
(Key requirements, cost, processing time — brief overview)

### Life, Culture & Safety
(Japanese community, safety level, food, climate)

### FAQ
Q1: How much does it cost to study in Turkey?
A: (specific figures)
Q2: Who is Turkey best suited for?
A: (profile of ideal student)
Q3: How far in advance should I start preparing?
A: (timeline)

Include mention of MoveWorth.study simulator. Always use markdown link format: [MoveWorth.study Simulator](https://study.moveworthapp.com/simulate)

### References
List 3-5 official sources (immigration authority, embassy, tourism board, education ministry of Turkey). Real URLs only — never fabricate.
- [Organization name](https://real-official-url)

## Return as JSON only (no code block):
{
  "title": "Study in Turkey 2026 — Complete Guide to Costs, Schools, Visa & Life",
  "description": "SEO meta description 130-155 chars including keyword 'Turkey study abroad cost'",
  "content": "Full article (markdown, 1200-2000 chars)"
}`;

  const [jaRaw, enRaw] = await Promise.all([callGPT(jaPrompt), callGPT(enPrompt)]);

  const jaContent = sanitizeMoveWorthLinks(jaRaw.content, true);
  const enContent = sanitizeMoveWorthLinks(enRaw.content, true);

  const hasPlaceholder = [jaContent, enContent].some(c => c.includes("example.com"));
  if (hasPlaceholder) {
    console.error("❌ [PLACEHOLDER-URL] example.com が含まれています — 保存スキップ");
    process.exit(1);
  }

  assertBlogPayload(
    { title: { ja: jaRaw.title, en: enRaw.title },
      description: { ja: jaRaw.description, en: enRaw.description },
      content: { ja: jaContent, en: enContent },
      locales: ["ja", "en"] },
    "study-country-tr"
  );

  const today = new Date().toISOString().slice(0, 10);
  const { error } = await sb.from("study_blog_posts").upsert({
    slug: "study-country-tr",
    category: "country",
    date: today,
    reading_time: 7,
    title: { ja: jaRaw.title, en: enRaw.title },
    description: { ja: jaRaw.description, en: enRaw.description },
    content: { ja: jaContent, en: enContent },
    is_published: false,
  }, { onConflict: "slug" });

  if (error) throw new Error(`study-country-tr upsert failed: ${error.message}`);
  console.log("✅ study-country-tr saved as draft");

  return { jaTitle: jaRaw.title, enTitle: enRaw.title, jaContent, enContent, jaDesc: jaRaw.description, enDesc: enRaw.description };
}

async function main() {
  console.log("=== TR study記事生成（knowledge-baseモード） ===");
  console.log("country_sources: 未登録のためknowledge-baseフォールバック\n");

  const [work, guide] = await Promise.all([
    generateStudyWork(),
    generateStudyCountry(),
  ]);

  console.log("\n\n" + "=".repeat(80));
  console.log("【レビュー用 全文出力】");
  console.log("=".repeat(80));

  console.log("\n--- study-work-tr JA ---\n");
  console.log(`タイトル: ${work.jaTitle}`);
  console.log(`概要: ${work.jaDesc}\n`);
  console.log(work.jaContent);

  console.log("\n--- study-work-tr EN ---\n");
  console.log(`Title: ${work.enTitle}`);
  console.log(`Description: ${work.enDesc}\n`);
  console.log(work.enContent);

  console.log("\n--- study-country-tr JA ---\n");
  console.log(`タイトル: ${guide.jaTitle}`);
  console.log(`概要: ${guide.jaDesc}\n`);
  console.log(guide.jaContent);

  console.log("\n--- study-country-tr EN ---\n");
  console.log(`Title: ${guide.enTitle}`);
  console.log(`Description: ${guide.enDesc}\n`);
  console.log(guide.enContent);
}

main().catch(e => { console.error(e); process.exit(1); });

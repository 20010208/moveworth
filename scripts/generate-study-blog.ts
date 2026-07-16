/**
 * MoveWorth.study ブログ自動生成スクリプト
 * 優先順位:
 *   1. country カテゴリ：既存work記事がある国の留学先ガイド記事（study-country-{code}）
 *   2. guide カテゴリ：留学ガイド系トピック
 * 実行: npx tsx scripts/generate-study-blog.ts
 */
import { existsSync, readFileSync } from "fs";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { sanitizeMoveWorthLinks } from "./utils/sanitize-links";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    const val = t.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

import { MASTER_COUNTRIES } from "../src/data/master-countries";

// マスター国リスト（PRESET基準・50カ国）。src/data/master-countries.ts を唯一の真実の源とする。
const COUNTRY_GUIDE_QUEUE = [...MASTER_COUNTRIES];

// guide カテゴリのトピックリスト（SEO重視）
const GUIDE_TOPICS = [
  {
    slug: "study-abroad-scholarship-guide-2026",
    title: { ja: "海外留学の奨学金完全ガイド【2026年版】給付型・貸与型・民間奨学金まとめ", en: "Complete Guide to Study Abroad Scholarships 2026 — Grants, Loans & Private Funds" },
    keywords: "海外留学 奨学金 給付型 JASSO 民間",
  },
  {
    slug: "study-abroad-insurance-guide-2026",
    title: { ja: "留学中の海外保険完全ガイド【2026年】海外旅行保険・学生保険の選び方と費用", en: "Study Abroad Insurance Guide 2026 — How to Choose Travel & Student Health Insurance" },
    keywords: "留学 保険 海外旅行保険 学生保険 費用",
  },
  {
    slug: "study-abroad-phone-sim-guide-2026",
    title: { ja: "留学中のスマホ・SIM完全ガイド【2026年】海外SIM・eSIM・ポケットWi-Fi徹底比較", en: "Study Abroad Phone & SIM Guide 2026 — Overseas SIM, eSIM & Pocket Wi-Fi Compared" },
    keywords: "留学 SIM eSIM ポケットWiFi 海外スマホ",
  },
  {
    slug: "study-abroad-remittance-guide-2026",
    title: { ja: "留学中の海外送金完全ガイド【2026年】Wise・クレカ・銀行を徹底比較", en: "Overseas Remittance Guide for Students 2026 — Wise, Credit Cards & Bank Transfers Compared" },
    keywords: "留学 海外送金 Wise トランスファーワイズ 手数料",
  },
  {
    slug: "study-abroad-housing-guide-2026",
    title: { ja: "留学中の住居選び完全ガイド【2026年】ホームステイ・学生寮・シェアハウス比較", en: "Study Abroad Housing Guide 2026 — Homestay vs. Dorm vs. Share House" },
    keywords: "留学 住居 ホームステイ 学生寮 シェアハウス",
  },
  {
    slug: "study-abroad-language-school-guide-2026",
    title: { ja: "語学学校の選び方完全ガイド【2026年】失敗しない学校選び・直申 vs エージェント", en: "How to Choose a Language School 2026 — Direct vs. Agent & Avoiding Common Mistakes" },
    keywords: "語学学校 選び方 留学エージェント おすすめ",
  },
  {
    slug: "study-abroad-ielts-toefl-guide-2026",
    title: { ja: "留学に必要な英語スコアと対策【2026年】TOEFL・IELTS目安スコア国別まとめ", en: "English Score Requirements for Study Abroad 2026 — TOEFL & IELTS by Country" },
    keywords: "留学 英語 TOEFL IELTS スコア 目安",
  },
  {
    slug: "study-abroad-budget-saving-guide-2026",
    title: { ja: "留学費用を安くする10の方法【2026年】奨学金・格安都市・節約術まとめ", en: "10 Ways to Cut Study Abroad Costs 2026 — Scholarships, Budget Cities & Saving Tips" },
    keywords: "留学 費用 安い 節約 格安",
  },
  {
    slug: "study-abroad-job-hunting-guide-2026",
    title: { ja: "留学経験を就活でアピールする方法【2026年】外資・日系企業への伝え方", en: "How to Use Study Abroad in Job Hunting 2026 — Tips for Japanese & Foreign Companies" },
    keywords: "留学 就活 アピール 外資 転職",
  },
  {
    slug: "study-abroad-japanese-services-guide-2026",
    title: { ja: "留学前に解約・停止すべき日本サービス一覧【2026年】携帯・年金・住民票", en: "Japanese Services to Pause Before Studying Abroad 2026 — Phone, Pension & Residency" },
    keywords: "留学前 準備 解約 住民票 年金",
  },
  {
    slug: "study-abroad-culture-shock-guide-2026",
    title: { ja: "留学中のカルチャーショック対処法【2026年】ホームシックを乗り越えるコツ", en: "Dealing with Culture Shock While Studying Abroad 2026 — Overcoming Homesickness" },
    keywords: "留学 カルチャーショック ホームシック 対処",
  },
  {
    slug: "study-abroad-online-degree-guide-2026",
    title: { ja: "海外オンライン大学留学完全ガイド【2026年】費用・メリット・デメリット徹底解説", en: "Online University Study Abroad Guide 2026 — Costs, Benefits & Drawbacks Explained" },
    keywords: "海外大学 オンライン 留学 費用 学位",
  },
];

async function getExistingSlugs(): Promise<Set<string>> {
  const { data } = await supabase.from("study_blog_posts").select("slug");
  return new Set((data ?? []).map((p: { slug: string }) => p.slug));
}

async function getNextCountryGuide(existing: Set<string>) {
  for (const c of COUNTRY_GUIDE_QUEUE) {
    if (!existing.has(`study-country-${c.code}`)) return c;
  }
  return null;
}

async function getNextGuideTopic(existing: Set<string>) {
  for (const t of GUIDE_TOPICS) {
    if (!existing.has(t.slug)) return t;
  }
  return null;
}

async function callGPT(prompt: string, maxTokens = 3500): Promise<string> {
  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: maxTokens,
  });
  return sanitizeMoveWorthLinks(res.choices[0].message.content ?? "", true);
}

async function factCheck(content: string, topic: string, lang: "ja" | "en"): Promise<string> {
  const prompt =
    lang === "ja"
      ? `以下の「${topic}」に関する留学ブログ記事を事実確認し、不正確・古い情報があれば修正してください。修正後の記事本文のみを返してください（説明不要）。\n\n${content}`
      : `Fact-check the following study abroad article about "${topic}". Correct any inaccurate or outdated information. Return only the corrected article body.\n\n${content}`;
  return callGPT(prompt, 3500);
}

async function generateCountryGuideArticle(country: { code: string; name: { ja: string; en: string } }) {
  const slug = `study-country-${country.code}`;
  console.log(`\n📝 Generating country guide: ${slug}`);

  // SEO最適化：FAQ付き、検索意図を満たす構成
  const jaPrompt = `あなたはMoveWorth.studyのSEOライターです。「${country.name.ja}留学」を検索する日本人向けに、網羅的で検索上位を狙える記事を書いてください。

## タイトル
【${country.name.ja}留学】費用・語学学校・ビザ・生活を徹底解説【2026年最新版】

## 本文構成（Markdownで記述。### を見出しに使うこと）

[導入] ※見出しなし。${country.name.ja}留学の魅力を2〜3文で書く。留学先として人気の理由・特徴を含める。

### ${country.name.ja}留学のメリット
（箇条書き4〜5点。具体的な数字や事例を含める）

### 費用の目安【2026年版】
（語学学校・大学・生活費の月額目安を表形式で記載。為替レート目安も含める）

### おすすめ留学都市
（3〜4都市を紹介。それぞれ特徴・学校の多さ・生活費感を1〜2文で）

### 語学学校・大学の種類
（選択肢の種類と特徴。短期語学留学・大学・ワーホリとの違いなど）

### 学生ビザの基本情報
（申請に必要なもの・費用・期間の概要。詳細はアルバイト記事へ誘導）

### ${country.name.ja}の生活・文化・治安
（日本人コミュニティの有無・治安・食事・気候・文化的注意点）

### よくある質問（FAQ）
Q1: ${country.name.ja}留学の費用はいくらかかりますか？
A: （具体的な数字を含む回答）
Q2: ${country.name.ja}は英語（または現地語）でのコミュニケーションが必要ですか？
A: （現地語・英語環境について）
Q3: ${country.name.ja}留学に向いているのはどんな人ですか？
A: （特徴・向き不向き）
Q4: ${country.name.ja}留学の準備はいつから始めれば良いですか？
A: （目安期間）

MoveWorth.studyのシミュレーターで${country.name.ja}留学の総費用を計算できます。リンクは必ず https://study.moveworthapp.com/simulate を使用してください。

### 参考資料
本記事の情報は以下の公式資料をもとに作成しています。
（${country.name.ja}の入国管理局・大使館・観光局・教育省など公式機関のサイトを3〜5件。実在する正確なURLのみ記載。ルートドメインまたは安定したセクションURLを優先。捏造URLは絶対不可）
- [機関名](https://official-url.example.com)

## 条件
- 文字数: 1500〜2500文字（参考資料セクション含む）
- 事実に基づく正確な情報（2026年時点）
- SEOキーワード「${country.name.ja}留学 費用」「${country.name.ja}語学学校」を自然に含める
- 記事本文のみ返すこと（タイトル・説明文は不要）`;

  const enPrompt = `You are an SEO writer for MoveWorth.study targeting Japanese students searching for study abroad in ${country.name.en}.

Write a comprehensive, SEO-optimized article that covers everything Japanese students need to know about studying in ${country.name.en}.

## Article structure (use ### for headings):

[Intro] — no heading. 2-3 sentences on why ${country.name.en} is a popular study destination.

### Why Study in ${country.name.en}?
(4-5 bullet points with specific facts/figures)

### Estimated Costs in 2026
(Monthly cost table: language school tuition, living expenses, housing — with approximate figures)

### Top Cities to Study In
(3-4 cities with brief description of study environment and cost level)

### Types of Schools & Programs
(Language schools, universities, vocational schools — brief comparison)

### Student Visa Basics
(Key requirements, cost, processing time — brief overview, link to work rules article for details)

### Life, Culture & Safety
(Japanese community, safety level, food, climate, cultural notes)

### FAQ
Q1: How much does it cost to study in ${country.name.en}?
A: (specific figures)
Q2: Do I need to speak the local language to study in ${country.name.en}?
A: (language environment)
Q3: Who is ${country.name.en} best suited for?
A: (profile of ideal student)
Q4: How far in advance should I start preparing?
A: (timeline)

Include mention of MoveWorth.study cost simulator. Always use the exact URL: https://study.moveworthapp.com/simulate

### References
List 3-5 official sources (immigration authority, embassy, tourism board, education ministry of ${country.name.en}). Use only real, verifiable URLs. Prefer root or stable section URLs. Never fabricate URLs.
- [Organization name](https://official-url.example.com)

## Requirements
- Length: 1200-2000 words (including references)
- Accurate, fact-based (2026)
- Naturally include keywords: "${country.name.en} study abroad cost", "${country.name.en} language school"
- Return article body only`;

  const [jaRaw, enRaw] = await Promise.all([callGPT(jaPrompt), callGPT(enPrompt)]);

  console.log("  Fact-checking...");
  const [jaFinal, enFinal] = await Promise.all([
    factCheck(jaRaw, `${country.name.ja}留学ガイド`, "ja"),
    factCheck(enRaw, `Studying in ${country.name.en}`, "en"),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const wordCount = jaFinal.split(/\s+/).length;
  const readingTime = Math.max(5, Math.ceil(wordCount / 350));

  const descJa = await callGPT(
    `次の留学ガイド記事のSEO向けメタディスクリプションを130〜155文字の日本語で書いてください。キーワード「${country.name.ja}留学 費用」を含めること。記事タイトル：「【${country.name.ja}留学】費用・語学学校・ビザ・生活を徹底解説【2026年最新版】」\n説明文のみ返すこと。`,
    200
  );
  const descEn = await callGPT(
    `Write an SEO meta description (130-155 chars) for this study abroad guide: "Study in ${country.name.en} 2026 — Complete Guide". Include keyword "${country.name.en} study abroad cost". Return only the description.`,
    200
  );

  const hasPlaceholder = [jaFinal, enFinal].some(c => c.includes("example.com"));
  if (hasPlaceholder) {
    console.error(`❌ [PLACEHOLDER-URL] ${slug}: "example.com" が含まれています — 保存スキップ`);
    return;
  }

  const { error } = await supabase.from("study_blog_posts").upsert(
    {
      slug,
      category: "country",
      date: today,
      reading_time: readingTime,
      title: {
        ja: `【${country.name.ja}留学】費用・語学学校・ビザ・生活を徹底解説【2026年最新版】`,
        en: `Study in ${country.name.en} 2026 — Complete Guide to Costs, Schools, Visa & Life`,
      },
      description: { ja: descJa.trim(), en: descEn.trim() },
      content: { ja: jaFinal, en: enFinal },
      is_published: false,
    },
    { onConflict: "slug" }
  );

  if (error) throw new Error(`Upsert failed: ${error.message}`);
  console.log(`✅ ${slug} saved as draft`);
}

async function generateGuideArticle(topic: { slug: string; title: { ja: string; en: string }; keywords: string }) {
  console.log(`\n📝 Generating guide article: ${topic.slug}`);

  const jaPrompt = `あなたはMoveWorth.studyのSEOライターです。「${topic.title.ja}」について検索上位を狙える網羅的な記事を書いてください。

## 本文構成（Markdownで記述。### を見出しに使うこと）

[導入] ※見出しなし。記事の結論・要点を先に書く（SEOの逆三角形構成）

### （セクション1）
### （セクション2）
### （セクション3）
### （セクション4）
### よくある質問（FAQ）
（3〜4問：留学生がよく検索する疑問に回答）
### まとめ

## 条件
- 文字数: 1200〜2000文字
- 事実に基づく正確な情報（2026年時点）
- キーワード「${topic.keywords}」を自然に含める
- FAQ を含めることでスニペット獲得を狙う
- MoveWorth.studyシミュレーターへのCTAをマークダウンリンク形式で本文内に含める: [MoveWorth.studyシミュレーター](https://study.moveworthapp.com/simulate)（「リンクは〜してください」等の指示文を含まない自然な文章で）
- 記事末尾に「### 参考資料」セクションを追加し、テーマに関連する公式機関・政府・国際機関のURLを3〜5件リスト（実在する正確なURLのみ。捏造不可）
- 記事本文のみ返すこと`;

  const enPrompt = `You are an SEO writer for MoveWorth.study. Write a comprehensive, search-ranking article about "${topic.title.en}".

## Article structure (use ### for headings):

[Intro] — no heading. Lead with the conclusion/key takeaway (inverted pyramid for SEO).

### (Section 1)
### (Section 2)
### (Section 3)
### (Section 4)
### FAQ
(3-4 questions Japanese students commonly search)
### Summary

## Requirements
- Length: 1000-1800 words
- Accurate, fact-based (2026)
- Naturally include target keywords
- FAQ section to target featured snippets
- Include a MoveWorth.study simulator CTA using markdown link format: [MoveWorth.study Simulator](https://study.moveworthapp.com/simulate) — write it as a natural sentence, not as an instruction
- Add a "### References" section at the end with 3-5 official/government/international organization URLs relevant to the topic. Use only real, verifiable URLs. Never fabricate.
- Return article body only`;

  const [jaRaw, enRaw] = await Promise.all([callGPT(jaPrompt), callGPT(enPrompt)]);

  console.log("  Fact-checking...");
  const [jaFinal, enFinal] = await Promise.all([
    factCheck(jaRaw, topic.title.ja, "ja"),
    factCheck(enRaw, topic.title.en, "en"),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const wordCount = jaFinal.split(/\s+/).length;
  const readingTime = Math.max(4, Math.ceil(wordCount / 350));

  const descJa = await callGPT(
    `次の留学ガイド記事のSEO向けメタディスクリプションを130〜155文字の日本語で書いてください。キーワード「${topic.keywords}」を含めること。タイトル：「${topic.title.ja}」\n説明文のみ返すこと。`,
    200
  );
  const descEn = await callGPT(
    `Write an SEO meta description (130-155 chars) for: "${topic.title.en}". Return only the description.`,
    200
  );

  const hasPlaceholder = [jaFinal, enFinal].some(c => c.includes("example.com"));
  if (hasPlaceholder) {
    console.error(`❌ [PLACEHOLDER-URL] ${topic.slug}: "example.com" が含まれています — 保存スキップ`);
    return;
  }

  const { error } = await supabase.from("study_blog_posts").upsert(
    {
      slug: topic.slug,
      category: "guide",
      date: today,
      reading_time: readingTime,
      title: topic.title,
      description: { ja: descJa.trim(), en: descEn.trim() },
      content: { ja: jaFinal, en: enFinal },
      is_published: false,
    },
    { onConflict: "slug" }
  );

  if (error) throw new Error(`Upsert failed: ${error.message}`);
  console.log(`✅ ${topic.slug} saved as draft`);
}

async function run() {
  console.log("🔍 既存記事を確認中...");
  const existing = await getExistingSlugs();
  console.log(`  既存記事数: ${existing.size}`);

  // 曜日判定: 月(1)・木(4) → 国別ガイド優先、火(2)・金(5) → 留学ガイド優先
  // 国別ガイドが尽きた場合はどの曜日も留学ガイドにフォールバック
  // GENERATE_TYPE=country で強制的に国別ガイド、GENERATE_TYPE=guide で強制的に留学ガイド
  const dow = new Date().getDay(); // 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
  const forceType = process.env.GENERATE_TYPE; // "country" | "guide" | undefined
  const isCountryDay = forceType === "country" || (forceType !== "guide" && (dow === 1 || dow === 4));

  const country = await getNextCountryGuide(existing);
  const guide = await getNextGuideTopic(existing);

  if (isCountryDay && country) {
    await generateCountryGuideArticle(country);
  } else if (!isCountryDay && guide) {
    await generateGuideArticle(guide);
  } else if (country) {
    // 留学ガイドが尽きた場合は国別ガイドで埋める
    await generateCountryGuideArticle(country);
  } else if (guide) {
    // 国別ガイドが尽きた場合は留学ガイドで埋める
    await generateGuideArticle(guide);
  } else {
    console.log("✅ すべてのトピックが生成済みです");
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

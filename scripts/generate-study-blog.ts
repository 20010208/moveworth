/**
 * MoveWorth.study ブログ自動生成スクリプト
 * - work カテゴリ：未作成の国のアルバイト・就労ルール記事を優先
 * - guide カテゴリ：留学ガイド系トピックを生成
 * 実行: npx tsx scripts/generate-study-blog.ts
 */
import { existsSync, readFileSync } from "fs";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

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

// work カテゴリ対象国（優先順）
const WORK_COUNTRY_QUEUE = [
  { code: "be", name: { ja: "ベルギー", en: "Belgium" } },
  { code: "pl", name: { ja: "ポーランド", en: "Poland" } },
  { code: "tn", name: { ja: "チュニジア", en: "Tunisia" } },
  { code: "tr", name: { ja: "トルコ", en: "Turkey" } },
  { code: "za", name: { ja: "南アフリカ", en: "South Africa" } },
  { code: "ke", name: { ja: "ケニア", en: "Kenya" } },
  { code: "ma", name: { ja: "モロッコ", en: "Morocco" } },
  { code: "np", name: { ja: "ネパール", en: "Nepal" } },
  { code: "kh", name: { ja: "カンボジア", en: "Cambodia" } },
  { code: "cl", name: { ja: "チリ", en: "Chile" } },
  { code: "pe", name: { ja: "ペルー", en: "Peru" } },
];

// guide カテゴリのトピックリスト
const GUIDE_TOPICS = [
  { slug: "study-abroad-scholarship-guide-2026", title: { ja: "海外留学の奨学金完全ガイド【2026年版】給付型・貸与型・民間まとめ", en: "Complete Guide to Study Abroad Scholarships 2026 — Grants, Loans & Private Funds" }, theme: "scholarship" },
  { slug: "study-abroad-insurance-guide-2026", title: { ja: "留学中の保険完全ガイド【2026年】海外旅行保険・学生保険の選び方", en: "Study Abroad Insurance Guide 2026 — How to Choose Travel & Student Health Insurance" }, theme: "insurance" },
  { slug: "study-abroad-phone-sim-guide-2026", title: { ja: "留学中のスマホ・SIM完全ガイド【2026年】海外SIM・eSIM・ポケットWi-Fi比較", en: "Study Abroad Phone & SIM Guide 2026 — Overseas SIM, eSIM & Pocket Wi-Fi Comparison" }, theme: "sim" },
  { slug: "study-abroad-remittance-guide-2026", title: { ja: "留学中の海外送金完全ガイド【2026年】Wise・クレカ・銀行振込を徹底比較", en: "Overseas Remittance Guide for Students 2026 — Wise, Credit Cards & Bank Transfers Compared" }, theme: "remittance" },
  { slug: "study-abroad-housing-guide-2026", title: { ja: "留学中の住居選び完全ガイド【2026年】ホームステイ・学生寮・シェアハウス比較", en: "Study Abroad Housing Guide 2026 — Homestay vs. Dorm vs. Share House Compared" }, theme: "housing" },
  { slug: "study-abroad-language-school-guide-2026", title: { ja: "語学学校の選び方完全ガイド【2026年】直接申込 vs エージェント・失敗しない学校選び", en: "How to Choose a Language School 2026 — Direct vs. Agent, Tips to Avoid Common Mistakes" }, theme: "language-school" },
  { slug: "study-abroad-ielts-toefl-guide-2026", title: { ja: "留学に必要な英語力と試験対策【2026年】TOEFL・IELTS・必要スコア目安", en: "English Requirements for Study Abroad 2026 — TOEFL & IELTS Score Guide by Country" }, theme: "english-test" },
  { slug: "study-abroad-budget-saving-guide-2026", title: { ja: "留学費用を節約する10の方法【2026年】奨学金・アルバイト・格安都市活用術", en: "10 Ways to Cut Study Abroad Costs 2026 — Scholarships, Part-time Work & Budget Cities" }, theme: "budget" },
  { slug: "study-abroad-job-hunting-guide-2026", title: { ja: "留学経験を就活でアピールする方法【2026年】外資・日系企業への伝え方", en: "How to Leverage Study Abroad in Job Hunting 2026 — Tips for Foreign & Japanese Companies" }, theme: "career" },
  { slug: "study-abroad-japanese-services-guide-2026", title: { ja: "留学前に解約・停止すべき日本のサービス一覧【2026年】携帯・年金・住民票", en: "Japanese Services to Cancel Before Studying Abroad 2026 — Phone, Pension & Residence Registration" }, theme: "japan-services" },
  { slug: "study-abroad-culture-shock-guide-2026", title: { ja: "留学中のカルチャーショック対処法【2026年】ホームシック・現地適応のコツ", en: "How to Handle Culture Shock While Studying Abroad 2026 — Homesickness & Adapting to Local Life" }, theme: "culture-shock" },
  { slug: "study-abroad-online-university-guide-2026", title: { ja: "海外オンライン大学留学ガイド【2026年】費用・メリット・デメリットを徹底解説", en: "Online University Study Abroad Guide 2026 — Costs, Pros & Cons Explained" }, theme: "online-university" },
];

async function getExistingSlugs(): Promise<Set<string>> {
  const { data } = await supabase.from("study_blog_posts").select("slug");
  return new Set((data ?? []).map((p: { slug: string }) => p.slug));
}

async function getNextWorkCountry(existing: Set<string>) {
  for (const c of WORK_COUNTRY_QUEUE) {
    if (!existing.has(`study-work-${c.code}`)) return c;
  }
  return null;
}

async function getNextGuideTopic(existing: Set<string>) {
  for (const t of GUIDE_TOPICS) {
    if (!existing.has(t.slug)) return t;
  }
  return null;
}

async function generateContent(prompt: string): Promise<string> {
  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 3000,
  });
  return res.choices[0].message.content ?? "";
}

async function factCheck(content: string, topic: string, lang: "ja" | "en"): Promise<string> {
  const prompt = lang === "ja"
    ? `以下の「${topic}」に関する留学ブログ記事を事実確認し、不正確な情報があれば修正してください。修正後の記事本文のみを返してください。\n\n${content}`
    : `Fact-check the following study abroad article about "${topic}". Correct any inaccurate information and return only the corrected article body.\n\n${content}`;
  return generateContent(prompt);
}

async function generateWorkArticle(country: { code: string; name: { ja: string; en: string } }) {
  const slug = `study-work-${country.code}`;
  console.log(`\n📝 Generating work article: ${slug}`);

  const jaPrompt = `あなたはMoveWorth.studyのライターです。${country.name.ja}での留学中のアルバイト・就労ルールについての詳細記事を日本語で書いてください。

記事フォーマット（Markdownで記述）:
- 見出しなしの導入文（2〜3文）
- ## 学生ビザの就労許可
- ## 就労時間の制限（学期中・休暇中）
- ## 必要な手続き・申請
- ## 注意事項・違反した場合のリスク
- ## まとめ

条件:
- 事実に基づく正確な情報（2026年時点）
- 日本人留学生向け
- 文字数: 800〜1200文字
- MoveWorth.studyのシミュレーターへの言及を最後に含める
- 記事本文のみ返すこと（タイトル・説明文は不要）`;

  const enPrompt = `You are a writer for MoveWorth.study. Write a detailed article in English about part-time work and employment rules for international students in ${country.name.en}.

Format (Markdown):
- Intro paragraph (no heading, 2-3 sentences)
- ## Work Permission on Student Visa
- ## Working Hour Limits (During Term / During Holidays)
- ## Required Procedures & Applications
- ## Risks & Penalties for Violations
- ## Summary

Requirements:
- Accurate, fact-based information (as of 2026)
- Targeted at Japanese students studying abroad
- Length: 600-900 words
- Include a mention of MoveWorth.study simulator at the end
- Return article body only (no title or description)`;

  const [jaRaw, enRaw] = await Promise.all([
    generateContent(jaPrompt),
    generateContent(enPrompt),
  ]);

  console.log("  Fact-checking (pass 1)...");
  const [jaCheck1, enCheck1] = await Promise.all([
    factCheck(jaRaw, `${country.name.ja}のアルバイト・就労ルール`, "ja"),
    factCheck(enRaw, `Part-time work rules in ${country.name.en}`, "en"),
  ]);

  console.log("  Fact-checking (pass 2)...");
  const [jaFinal, enFinal] = await Promise.all([
    factCheck(jaCheck1, `${country.name.ja}のアルバイト・就労ルール`, "ja"),
    factCheck(enCheck1, `Part-time work rules in ${country.name.en}`, "en"),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const wordCount = jaFinal.split(/[\s\n]/).length;
  const readingTime = Math.max(3, Math.ceil(wordCount / 400));

  const { error } = await supabase.from("study_blog_posts").upsert({
    slug,
    category: "work",
    date: today,
    reading_time: readingTime,
    title: {
      ja: `【${country.name.ja}】留学中のアルバイト・就労ルール完全ガイド【2026年】`,
      en: `[${country.name.en}] Complete Guide to Part-time Work & Employment Rules While Studying Abroad 2026`,
    },
    description: {
      ja: `${country.name.ja}での留学中アルバイト・就労ルールを徹底解説。学生ビザの就労許可・就労時間の制限・必要手続き・注意事項まで留学前に確認すべき情報をまとめました。`,
      en: `A complete guide to part-time work and employment rules for international students in ${country.name.en}. Covers visa work permissions, hour limits, required procedures, and risks.`,
    },
    content: { ja: jaFinal, en: enFinal },
    is_published: true,
  }, { onConflict: "slug" });

  if (error) throw new Error(`Upsert failed: ${error.message}`);
  console.log(`✅ ${slug} published`);
}

async function generateGuideArticle(topic: { slug: string; title: { ja: string; en: string }; theme: string }) {
  console.log(`\n📝 Generating guide article: ${topic.slug}`);

  const jaPrompt = `あなたはMoveWorth.studyのライターです。「${topic.title.ja}」というタイトルの留学ガイド記事を日本語で書いてください。

記事フォーマット（Markdownで記述）:
- 見出しなしの導入文（2〜3文）
- ## セクション1
- ## セクション2
- ## セクション3
- ## セクション4（必要に応じて）
- ## まとめ

条件:
- 事実に基づく正確な情報（2026年時点）
- 日本人留学生向け
- 文字数: 1000〜1500文字
- MoveWorth.studyへの言及を最後に含める
- 記事本文のみ返すこと（タイトル・説明文は不要）`;

  const enPrompt = `You are a writer for MoveWorth.study. Write a study abroad guide article in English titled: "${topic.title.en}".

Format (Markdown):
- Intro paragraph (no heading, 2-3 sentences)
- ## Section 1
- ## Section 2
- ## Section 3
- ## Section 4 (if needed)
- ## Summary

Requirements:
- Accurate, fact-based information (as of 2026)
- Targeted at Japanese students studying abroad
- Length: 800-1200 words
- Include a mention of MoveWorth.study at the end
- Return article body only (no title or description)`;

  const [jaRaw, enRaw] = await Promise.all([
    generateContent(jaPrompt),
    generateContent(enPrompt),
  ]);

  console.log("  Fact-checking (pass 1)...");
  const [jaCheck1, enCheck1] = await Promise.all([
    factCheck(jaRaw, topic.title.ja, "ja"),
    factCheck(enRaw, topic.title.en, "en"),
  ]);

  console.log("  Fact-checking (pass 2)...");
  const [jaFinal, enFinal] = await Promise.all([
    factCheck(jaCheck1, topic.title.ja, "ja"),
    factCheck(enCheck1, topic.title.en, "en"),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const wordCount = jaFinal.split(/[\s\n]/).length;
  const readingTime = Math.max(4, Math.ceil(wordCount / 400));

  // GPTで説明文を生成
  const descJa = await generateContent(
    `次の留学ガイド記事の内容を要約した説明文を80文字以内の日本語で書いてください。記事タイトル：「${topic.title.ja}」\n説明文のみ返すこと。`
  );
  const descEn = await generateContent(
    `Write a 1-sentence description (under 120 chars) for this study abroad guide article: "${topic.title.en}". Return only the description.`
  );

  const { error } = await supabase.from("study_blog_posts").upsert({
    slug: topic.slug,
    category: "guide",
    date: new Date().toISOString().slice(0, 10),
    reading_time: readingTime,
    title: topic.title,
    description: { ja: descJa.trim(), en: descEn.trim() },
    content: { ja: jaFinal, en: enFinal },
    is_published: true,
  }, { onConflict: "slug" });

  if (error) throw new Error(`Upsert failed: ${error.message}`);
  console.log(`✅ ${topic.slug} published`);
}

async function run() {
  console.log("🔍 既存記事を確認中...");
  const existing = await getExistingSlugs();
  console.log(`  既存記事数: ${existing.size}`);

  // work カテゴリを優先
  const workCountry = await getNextWorkCountry(existing);
  if (workCountry) {
    await generateWorkArticle(workCountry);
    return;
  }

  // work が尽きたら guide
  const guideTopic = await getNextGuideTopic(existing);
  if (guideTopic) {
    await generateGuideArticle(guideTopic);
    return;
  }

  console.log("✅ すべてのトピックが生成済みです");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

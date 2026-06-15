import { existsSync, readFileSync, writeFileSync } from "fs";
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

// Countries in priority order: fixed first 2, then popular destinations
const COUNTRY_QUEUE = [
  { code: "be", name: { ja: "ベルギー", en: "Belgium" } },
  { code: "tn", name: { ja: "チュニジア", en: "Tunisia" } },
  { code: "pl", name: { ja: "ポーランド", en: "Poland" } },
  { code: "ee", name: { ja: "エストニア", en: "Estonia" } },
  { code: "cy", name: { ja: "キプロス", en: "Cyprus" } },
  { code: "hr", name: { ja: "クロアチア", en: "Croatia" } },
  { code: "hu", name: { ja: "ハンガリー", en: "Hungary" } },
  { code: "ro", name: { ja: "ルーマニア", en: "Romania" } },
  { code: "bg", name: { ja: "ブルガリア", en: "Bulgaria" } },
  { code: "rs", name: { ja: "セルビア", en: "Serbia" } },
  { code: "me", name: { ja: "モンテネグロ", en: "Montenegro" } },
  { code: "sk", name: { ja: "スロバキア", en: "Slovakia" } },
  { code: "si", name: { ja: "スロベニア", en: "Slovenia" } },
  { code: "lv", name: { ja: "ラトビア", en: "Latvia" } },
  { code: "lt", name: { ja: "リトアニア", en: "Lithuania" } },
  { code: "ma", name: { ja: "モロッコ", en: "Morocco" } },
  { code: "mu", name: { ja: "モーリシャス", en: "Mauritius" } },
  { code: "ke", name: { ja: "ケニア", en: "Kenya" } },
  { code: "cl", name: { ja: "チリ", en: "Chile" } },
  { code: "pe", name: { ja: "ペルー", en: "Peru" } },
  { code: "uy", name: { ja: "ウルグアイ", en: "Uruguay" } },
  { code: "ec", name: { ja: "エクアドル", en: "Ecuador" } },
  { code: "lk", name: { ja: "スリランカ", en: "Sri Lanka" } },
  { code: "kh", name: { ja: "カンボジア", en: "Cambodia" } },
  { code: "la", name: { ja: "ラオス", en: "Laos" } },
  { code: "np", name: { ja: "ネパール", en: "Nepal" } },
  { code: "jo", name: { ja: "ヨルダン", en: "Jordan" } },
  { code: "gh", name: { ja: "ガーナ", en: "Ghana" } },
  { code: "al", name: { ja: "アルバニア", en: "Albania" } },
  { code: "mk", name: { ja: "北マケドニア", en: "North Macedonia" } },
];

type Lang = "ja" | "en" | "zh";

async function getNextCountry(): Promise<{ code: string; name: { ja: string; en: string } }> {
  const { data: visaPosts } = await supabase
    .from("blog_posts")
    .select("slug")
    .like("slug", "visa-%");

  const covered = new Set(
    (visaPosts ?? []).map((p: { slug: string }) => p.slug.replace("visa-", ""))
  );

  for (const c of COUNTRY_QUEUE) {
    if (!covered.has(c.code)) return c;
  }
  throw new Error("All countries in queue already covered.");
}

async function generateVisaContent(
  countryName: { ja: string; en: string },
  lang: Lang
): Promise<{ title: string; description: string; content: string }> {
  const langInst = {
    ja: "日本語で書いてください。",
    en: "Write in English.",
    zh: "请用中文写。",
  };

  const prompt = `あなたはMoveWorthというサービスのビザ情報ライターです。MoveWorthは、海外移住を考えている人向けに、税金・生活費・ビザを一括シミュレーションできるサービスです。

${countryName.en}（${countryName.ja}）のビザ・移住条件について、事実に基づいた詳細な記事を書いてください。

${langInst[lang]}

## 必須セクション構成
- ## Main Visa Types（主要ビザの種類） — 各ビザごとに以下を記載：ビザ名、対象者、必要書類、費用（数字）、有効期間、申請先URL
- ## Tax & Living Notes（税金・生活費）— 所得税率、VAT率、主要都市の家賃目安（表形式）
- ## Cost Summary（費用サマリー）— Markdownテーブル（ビザ種別・申請費・処理期間の比較）
- ## Pre-Move Checklist（渡航前チェックリスト）— 番号付きリスト
- ## References（公式参考リンク）— 政府・大使館の公式URLを必ず含める

以下のJSON形式で回答してください（JSONのみ、コードブロック不要）：
{
  "title": "SEOタイトル（70文字以内）",
  "description": "メタディスクリプション（120〜160文字）",
  "content": "記事本文（マークダウン形式、2500〜4000文字）"
}`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });
  return JSON.parse(res.choices[0].message.content!);
}

async function factCheckContent(
  content: string,
  countryName: string,
  lang: string
): Promise<string> {
  const prompt = `以下は${countryName}のビザ・移住情報記事です。費用・期間・必要書類などの数字・事実を検証し、不正確な箇所を修正してください。正確な記事のみを返してください（説明不要）。言語: ${lang}

${content}`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    max_tokens: 4000,
  });
  return res.choices[0].message.content ?? content;
}

async function generateStudyContent(
  countryName: { ja: string; en: string },
  lang: "ja" | "en"
): Promise<{ title: string; description: string; content: string }> {
  const langInst = {
    ja: "日本語で書いてください。",
    en: "Write in English.",
  };

  const prompt = `あなたはMoveWorth.studyというサービスのライターです。海外留学生向けの情報サービスです。

${countryName.en}（${countryName.ja}）への留学について、事実に基づいた詳細な記事を書いてください。

${langInst[lang]}

## 必須セクション構成
- ## 学生ビザの概要 — ビザ種別・申請費用・処理期間・主な必要書類
- ## アルバイト・就労ルール — 学期中・休暇中の週労働時間上限
- ## 費用の目安 — Markdownテーブル（語学学校・生活費・住居費・その他の月額目安）
- ## 注意事項 — 重要な注意点を3〜5点
- ## 参考リンク — 公式ビザ申請サイト・教育機関URLを含める

以下のJSON形式で回答してください（JSONのみ）：
{
  "title": "SEOタイトル（60文字以内）",
  "description": "メタディスクリプション（120〜150文字）",
  "content": "記事本文（マークダウン形式、1500〜2500文字）"
}`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });
  return JSON.parse(res.choices[0].message.content!);
}

async function updateCountryCountText() {
  const { count } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .like("slug", "visa-%");

  if (!count) return;
  const displayCount = Math.floor(count / 10) * 10;

  const FILES_JA = [
    "src/messages/ja.json",
    "src/app/layout.tsx",
    "src/app/simulate/layout.tsx",
    "src/app/study-site/page.tsx",
    "src/app/study-site/[country]/page.tsx",
  ];
  const FILES_EN = ["src/messages/en.json"];
  const FILES_ZH = ["src/messages/zh.json"];

  // Determine the current and new text patterns
  const patterns: Array<{ files: string[]; oldPattern: RegExp; newText: string }> = [
    {
      files: FILES_JA,
      oldPattern: /\d+カ国以上/g,
      newText: `${displayCount}カ国以上`,
    },
    {
      files: FILES_EN,
      oldPattern: /\d+\+\s*Countries/gi,
      newText: `${displayCount}+ Countries`,
    },
    {
      files: FILES_EN,
      oldPattern: /\d+\+\s*countries/g,
      newText: `${displayCount}+ countries`,
    },
    {
      files: FILES_ZH,
      oldPattern: /\d+多个国家/g,
      newText: `${displayCount}多个国家`,
    },
  ];

  let updated = false;
  for (const { files, oldPattern, newText } of patterns) {
    for (const filePath of files) {
      if (!existsSync(filePath)) continue;
      const src = readFileSync(filePath, "utf-8");
      const replaced = src.replace(oldPattern, newText);
      if (replaced !== src) {
        writeFileSync(filePath, replaced, "utf-8");
        console.log(`Updated country count in ${filePath} → ${newText}`);
        updated = true;
      }
    }
  }

  if (!updated) {
    console.log(`Country count text already shows ${displayCount}カ国以上 — no changes.`);
  }
}

async function run() {
  const country = await getNextCountry();
  console.log(`Generating articles for: ${country.name.en} (${country.code})`);

  // --- Visa article (ja/en/zh) ---
  console.log("Generating visa article in 3 languages...");
  const [visaJa, visaEn, visaZh] = await Promise.all([
    generateVisaContent(country.name, "ja"),
    generateVisaContent(country.name, "en"),
    generateVisaContent(country.name, "zh"),
  ]);

  // Fact-check pass 1
  console.log("Fact-checking visa article (pass 1)...");
  const [checked1Ja, checked1En, checked1Zh] = await Promise.all([
    factCheckContent(visaJa.content, country.name.ja, "ja"),
    factCheckContent(visaEn.content, country.name.en, "en"),
    factCheckContent(visaZh.content, country.name.en, "zh"),
  ]);

  // Fact-check pass 2
  console.log("Fact-checking visa article (pass 2)...");
  const [finalJa, finalEn, finalZh] = await Promise.all([
    factCheckContent(checked1Ja, country.name.ja, "ja"),
    factCheckContent(checked1En, country.name.en, "en"),
    factCheckContent(checked1Zh, country.name.en, "zh"),
  ]);

  const visaSlug = `visa-${country.code}`;
  const today = new Date().toISOString().split("T")[0];

  const { error: visaError } = await supabase.from("blog_posts").upsert({
    slug: visaSlug,
    category: "visa",
    published_at: today,
    reading_minutes: 12,
    thumbnail: null,
    title: { ja: visaJa.title, en: visaEn.title, zh: visaZh.title },
    description: {
      ja: visaJa.description,
      en: visaEn.description,
      zh: visaZh.description,
    },
    content: { ja: finalJa, en: finalEn, zh: finalZh },
    locales: null,
    pinned: false,
    is_published: true,
  });

  if (visaError) {
    console.error("Visa article insert failed:", visaError.message);
    process.exit(1);
  }
  console.log(`✅ Visa article published: ${visaSlug}`);

  // --- Study article (ja/en) ---
  console.log("Generating study article...");
  const [studyJa, studyEn] = await Promise.all([
    generateStudyContent(country.name, "ja"),
    generateStudyContent(country.name, "en"),
  ]);

  // Fact-check study article (2 passes)
  console.log("Fact-checking study article (pass 1)...");
  const [studyChecked1Ja, studyChecked1En] = await Promise.all([
    factCheckContent(studyJa.content, country.name.ja, "ja"),
    factCheckContent(studyEn.content, country.name.en, "en"),
  ]);

  console.log("Fact-checking study article (pass 2)...");
  const [studyFinalJa, studyFinalEn] = await Promise.all([
    factCheckContent(studyChecked1Ja, country.name.ja, "ja"),
    factCheckContent(studyChecked1En, country.name.en, "en"),
  ]);

  const studySlug = `study-${country.code}`;

  const { error: studyError } = await supabase.from("study_blog_posts").upsert({
    slug: studySlug,
    category: "country",
    date: today,
    reading_time: 8,
    title: { ja: studyJa.title, en: studyEn.title },
    description: { ja: studyJa.description, en: studyEn.description },
    content: { ja: studyFinalJa, en: studyFinalEn },
    is_published: true,
  });

  if (studyError) {
    console.error("Study article insert failed:", studyError.message);
  } else {
    console.log(`✅ Study article published: ${studySlug}`);
  }

  // --- Update country count text ---
  await updateCountryCountText();
}

run();

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

// --country be で強制指定可能
const forceCountryCode = process.argv[2] ?? null;

async function getNextCountry(): Promise<{ code: string; name: { ja: string; en: string } }> {
  if (forceCountryCode) {
    const found = COUNTRY_QUEUE.find((c) => c.code === forceCountryCode);
    if (!found) throw new Error(`Country code "${forceCountryCode}" not found in queue.`);
    return found;
  }

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
  const prompts: Record<Lang, string> = {
    ja: `あなたはMoveWorthというサービスのビザ情報ライターです。MoveWorthは、海外移住を考えている人向けに、税金・生活費・ビザを一括シミュレーションできるサービスです。

${countryName.ja}のビザ・移住条件に関する記事を日本語で書いてください。

## タイトル形式（必ず守ること。絵文字・記号は一切使わないこと）
【2026年最新版】${countryName.ja}のビザ・就労許可完全ガイド｜{主要ビザ名1}・{主要ビザ名2}・{主要ビザ名3}

## 本文の構成（見出しは必ず ### を使うこと、## は使わないこと）

[導入段落] ※見出しなし。${countryName.ja}の移住先としての特徴・魅力を2〜3文で書く。

### 主なビザの種類
各ビザを以下の形式で記載：
**{ビザ名}**
説明文（1〜2文）
- 要件：...
- **最低条件や重要数値**
- 有効期間：...
- 申請費用：...

### 生活・税金について
**所得税**：税率を箇条書きで
**{その他の税・保険}**：説明
**住居費**：主要都市の家賃目安

### 費用の目安
| 項目 | 費用 |
|------|------|
（ビザ申請費・各種手数料を表で記載）

### 移住前のチェックポイント
1. **{重要事項}**：説明
（5点程度の番号付きリスト）

締め括りの文（1〜2文）

---

### 参考資料
本記事の情報は以下の公式資料をもとに作成しています。
- **{ビザ名}**: [{機関名} – {ページ名}]({公式URL})

## JSON形式で返答（JSONのみ、コードブロック不要）
{
  "title": "【2026年最新版】${countryName.ja}のビザ・就労許可完全ガイド｜主要ビザ名を含める",
  "description": "主要ビザと最低条件・費用を含むメタディスクリプション（120〜160文字）",
  "content": "上記構成の記事本文（マークダウン、2500〜4000文字）"
}`,

    en: `You are a visa information writer for MoveWorth, a service that helps people considering international relocation simulate taxes, living costs, and visa requirements.

Write a detailed, factual article about ${countryName.en} visa and immigration requirements in English.

## Title format (strictly follow. No emojis or special symbols):
${countryName.en} Visa & Work Permit Complete Guide 2026 | {Visa1}, {Visa2} & {Visa3}

## Article structure (use ### for all headings, never ##):

[Intro paragraph] — no heading. 2–3 sentences on ${countryName.en} as a relocation destination.

### Main Visa Types
For each visa type:
**{Visa Name}**
Brief description (1–2 sentences)
- Requirements: ...
- **Key threshold or figure**
- Validity: ...
- Application fee: ...

### Tax & Living Notes
**Income tax**: rates in bullet form
**{Other tax/insurance}**: description
**Housing**: rental price estimate for main city

### Cost Summary
| Item | Cost |
|------|------|
(table of visa fees and key costs)

### Pre-Move Checklist
1. **{Key point}**: explanation
(5 numbered items)

Closing sentence.

---

### References
Data sourced from:
- **{Visa name}**: [{Agency} – {Page}]({official URL})

## Return as JSON only (no code block):
{
  "title": "${countryName.en} Visa & Work Permit Complete Guide 2026 | include main visa names",
  "description": "Include key visa types and minimum requirements (120–160 chars)",
  "content": "Full article in the structure above (markdown, 2500–4000 chars)"
}`,

    zh: `您是MoveWorth服务的签证信息撰稿人。MoveWorth帮助考虑海外移居的人模拟税务、生活成本和签证要求。

请用中文撰写一篇关于${countryName.en}（${countryName.ja}）签证与移居条件的详细文章。

## 标题格式（必须遵守。不使用任何表情符号或特殊符号）：
【2026年最新版】{国名中文}签证与工作许可完全指南｜{签证1}·{签证2}·{签证3}

## 文章结构（所有标题必须使用 ###，不使用 ##）：

[导言段落] ※无标题。2～3句介绍${countryName.en}作为移居目的地的特点。

### 主要签证类型
每种签证格式：
**{签证名称}**
简要说明（1～2句）
- 要求：...
- **关键条件或数字**
- 有效期：...
- 申请费用：...

### 税务与生活概况
**所得税**：以列表形式列出税率
**住房费用**：主要城市租金参考

### 费用汇总
| 项目 | 费用 |
|------|------|
（签证申请费及主要费用表格）

### 移居前注意事项
1. **{重要事项}**：说明
（5条编号列表）

---

### 参考资料
- **{签证名称}**: [{机构} – {页面}]({官方URL})

## 仅返回JSON（无代码块）：
{
  "title": "【2026年最新版】${countryName.en}签证与工作许可完全指南｜含主要签证名称",
  "description": "包含主要签证类型和最低要求（120～160字）",
  "content": "按上述结构的完整文章（Markdown格式，2500～4000字）"
}`,
  };

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompts[lang] }],
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
  const prompt = `あなたは${countryName}の移住・ビザ情報に詳しい専門家です。以下の記事を、あなたの知識で精査してください。

ルール：
- あなたの学習データに基づいて、費用・期間・必要書類などの数字や事実を確認し、明らかに誤っている箇所のみ修正してください
- 「確認できない」「インターネットにアクセスできない」などのメタコメントは絶対に書かないでください
- 修正した記事本文のみを返してください。説明・コメント・注記は一切不要です
- 言語: ${lang}

${content}`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    max_tokens: 4000,
  });

  const result = res.choices[0].message.content ?? content;
  // フォールバック：メタコメントが混入した場合は元のコンテンツを使用
  const metaCommentPatterns = [
    "インターネットへのアクセス",
    "外部データベース",
    "確認することはできません",
    "I cannot verify",
    "I don't have access",
    "cannot access the internet",
  ];
  if (metaCommentPatterns.some((p) => result.includes(p))) {
    console.warn(`⚠️  Fact-check returned meta-comment for ${countryName} (${lang}), using original`);
    return content;
  }
  return result;
}

async function generateStudyContent(
  countryName: { ja: string; en: string },
  lang: "ja" | "en"
): Promise<{ title: string; description: string; content: string }> {
  const prompts: Record<"ja" | "en", string> = {
    ja: `あなたはMoveWorth.studyというサービスのライターです。海外留学生向けの情報サービスです。

${countryName.ja}への留学に関する記事を日本語で書いてください。

## タイトル形式（必ず守ること）
【${countryName.ja}】留学中のアルバイト・就労ルール完全ガイド

## 本文の構成（見出しは必ず ### を使うこと）

[導入段落] ※見出しなし。${countryName.ja}への留学の概要を1〜2文で書く。

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

MoveWorth.studyのシミュレーターで${countryName.ja}留学の総費用を計算してみましょう。

## JSON形式で返答（JSONのみ、コードブロック不要）
{
  "title": "【${countryName.ja}】留学中のアルバイト・就労ルール完全ガイド",
  "description": "週の就労時間上限・ビザ費用・生活費を含むメタディスクリプション（120〜150文字）",
  "content": "上記構成の記事本文（マークダウン、1500〜2500文字）"
}`,

    en: `You are a writer for MoveWorth.study, a service providing study abroad information.

Write a detailed article about studying in ${countryName.en} in English.

## Title format (strictly follow):
Study & Work Rules in ${countryName.en} 2026 — Complete Guide

## Article structure (use ### for all headings):

[Intro paragraph] — no heading. 1–2 sentences on studying in ${countryName.en}.

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

Use the MoveWorth.study simulator to calculate total costs for studying in ${countryName.en}.

## Return as JSON only (no code block):
{
  "title": "Study & Work Rules in ${countryName.en} 2026 — Complete Guide",
  "description": "Include weekly work hour limits, visa fees and living costs (120–150 chars)",
  "content": "Full article in the structure above (markdown, 1500–2500 chars)"
}`,
  };

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompts[lang] }],
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

  // public/images/blog/ に同名画像があれば自動設定
  const thumbExts = [".webp", ".png", ".jpg"];
  const thumbnail = thumbExts
    .map((ext) => `/images/blog/${visaSlug}${ext}`)
    .find((p) => existsSync(`public${p}`)) ?? null;

  const { error: visaError } = await supabase.from("blog_posts").upsert({
    slug: visaSlug,
    category: "visa",
    published_at: today,
    reading_minutes: 12,
    thumbnail,
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
  }, { onConflict: "slug" });

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
  }, { onConflict: "slug" });

  if (studyError) {
    console.error("Study article insert failed:", studyError.message);
  } else {
    console.log(`✅ Study article published: ${studySlug}`);
  }

  // --- Update country count text ---
  await updateCountryCountText();
}

run();

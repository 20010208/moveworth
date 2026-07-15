/**
 * visa-guide カテゴリの記事を生成するスクリプト
 *
 * 動作:
 *   (引数なし)  VISA_GUIDE_TOPICS から未生成の次のトピックを draft 保存
 *   全件生成済み → exit(0) でスキップ
 *
 * 安全設計（最初から搭載）:
 *   - assertBlogPayload() でペイロード検証
 *   - example.com チェック
 *   - GPT 拒否パターンチェック
 *   - is_published: false で draft 保存（--publish は generate-country-article.ts 参照）
 *   - country_sources grounding（purpose='visa'）
 */
import { existsSync, readFileSync } from "fs";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { sanitizeMoveWorthLinks } from "./utils/sanitize-links";
import { assertBlogPayload } from "./utils/validate-blog-payload";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type Lang = "ja" | "en" | "zh";

// ─── ソースフェッチユーティリティ ──────────────────────────────────────────

const SOURCE_FETCH_TIMEOUT = 10_000;
const MAX_CHARS_PER_SOURCE = 6_000; // 一般ビザより多め（プログラム詳細を拾うため）
const MAX_SOURCES = 6;

function stripHtml(html: string): string {
  const mainMatch = html.match(/<main[\s\S]*?>([\s\S]*?)<\/main>/i);
  const articleMatch = html.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/i);
  const content = mainMatch?.[1] ?? articleMatch?.[1] ?? html;
  return content
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function isSourceUseful(text: string): boolean {
  if (!text || text.length < 300) return false;
  let hits = 0;
  if (/(?:NZD|EUR|USD|GBP|AUD|CAD|SGD|CHF|AED|THB|MYR|NZD)\s?\$?[\d,]+|[\d,]+\s*(?:EUR|USD)|[$€£฿]\s?[\d,]+/i.test(text)) hits++;
  if (/\d+\.?\d*\s*%/.test(text)) hits++;
  if (/\d+\s*(days?|weeks?|months?|years?|hours?)/i.test(text)) hits++;
  if (/\d+\s*points?/i.test(text)) hits++;
  if (/(require|eligib|qualif|must have|criteria|condition|permit|residence|visa|employ|work permit|income|deposit|invest)/i.test(text)) hits++;
  return hits >= 2;
}

function sliceWithLog(text: string, url: string, maxChars: number): string {
  if (text.length > maxChars) {
    console.log(`  [truncated] ${url}: ${text.length.toLocaleString()} → ${maxChars.toLocaleString()} chars`);
    return text.slice(0, maxChars);
  }
  return text;
}

async function tryWaybackMachine(originalUrl: string): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6_000);
    const res = await fetch(
      `https://archive.org/wayback/available?url=${encodeURIComponent(originalUrl)}`,
      { signal: ctrl.signal },
    );
    clearTimeout(timer);
    if (!res.ok) return null;
    type WBResp = { archived_snapshots?: { closest?: { url?: string; available?: boolean } } };
    const data = await res.json() as WBResp;
    const snap = data.archived_snapshots?.closest;
    if (!snap?.available || !snap.url) return null;

    const wbCtrl = new AbortController();
    const wbTimer = setTimeout(() => wbCtrl.abort(), SOURCE_FETCH_TIMEOUT);
    try {
      const wbRes = await fetch(snap.url, {
        signal: wbCtrl.signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; MoveWorthBot/1.0)" },
      });
      clearTimeout(wbTimer);
      if (!wbRes.ok) return null;
      return sliceWithLog(stripHtml(await wbRes.text()), originalUrl + " [wayback]", MAX_CHARS_PER_SOURCE);
    } catch { clearTimeout(wbTimer); return null; }
  } catch { return null; }
}

async function fetchPageText(url: string): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), SOURCE_FETCH_TIMEOUT);
  let text: string | null = null;
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MoveWorthBot/1.0)" },
    });
    clearTimeout(timer);
    if (res.ok) {
      const ct = res.headers.get("content-type") ?? "";
      if (ct.includes("html") || ct.includes("text")) {
        text = sliceWithLog(stripHtml(await res.text()), url, MAX_CHARS_PER_SOURCE);
      }
    }
  } catch { clearTimeout(timer); }

  if (!isSourceUseful(text ?? "")) {
    console.log(`  [wayback] SPA/low-quality → trying Wayback for ${url}`);
    const wb = await tryWaybackMachine(url);
    if (wb && isSourceUseful(wb)) return wb;
  }
  return text;
}

// country_sources から purpose='visa' のURLを取得
async function getCountrySources(countryCode: string): Promise<string[]> {
  const { data } = await sb
    .from("country_sources")
    .select("url")
    .eq("country_code", countryCode)
    .eq("purpose", "visa")
    .eq("status", "alive")
    .limit(MAX_SOURCES);
  return (data ?? []).map((r: { url: string }) => r.url);
}

interface SourceContext {
  text: string;
  urlList: string[];
  isGrounded: boolean;
}

async function buildSourceContext(urls: string[]): Promise<SourceContext> {
  const unique = [...new Set(urls)];
  const fetched: { url: string; text: string }[] = [];

  await Promise.all(
    unique.map(async (url) => {
      const text = await fetchPageText(url);
      if (text && isSourceUseful(text)) fetched.push({ url, text });
    }),
  );

  const text = fetched
    .map((f, i) => `--- 参考資料 ${i + 1}: ${f.url} ---\n${f.text}`)
    .join("\n\n");

  return { text, urlList: unique, isGrounded: fetched.length > 0 };
}

// ─── VISA_GUIDE_TOPICS ───────────────────────────────────────────────────────

interface VisaGuideTopic {
  slug: string;
  programName: { ja: string; en: string; zh: string };
  countryCode: string;
  countryName: { ja: string; en: string; zh: string };
  sourceUrls: string[]; // プログラム固有 URL（country_sources に加えて常に試みる）
  promptNote?: string;  // プロンプトに追加する特記事項（ソース信頼性・時点情報など）
}

// 生成済みの既存2件も含む（slug が既に blog_posts に存在する場合はスキップ）
const VISA_GUIDE_TOPICS: VisaGuideTopic[] = [
  {
    slug: "malaysia-mm2h-visa-complete-guide-2026",
    programName: {
      ja: "MM2H（Malaysia My Second Home）",
      en: "MM2H (Malaysia My Second Home)",
      zh: "马来西亚第二家园（MM2H）",
    },
    countryCode: "my",
    countryName: { ja: "マレーシア", en: "Malaysia", zh: "马来西亚" },
    sourceUrls: ["https://www.imi.gov.my/index.php/en/main-services/mm2h.html"],
  },
  {
    slug: "greece-residency-visa-cost-2026",
    programName: {
      ja: "ゴールデンビザ・デジタルノマドビザ・D型長期滞在ビザ",
      en: "Golden Visa, Digital Nomad Visa & Type-D Long-Stay Visa",
      zh: "黄金签证、数字游牧签证与D型长期居留签证",
    },
    countryCode: "gr",
    countryName: { ja: "ギリシャ", en: "Greece", zh: "希腊" },
    sourceUrls: [
      "https://migration.gov.gr/en/",
      "https://newsletters.enterprisegreece.gov.gr/newsletter-articles/greece-adjusts-golden-visa-program-amid-rising-outlook-for-property-market/",
    ],
    promptNote: [
      "【重要】ゴールデンビザの投資最低額は2024年3月31日施行の改定により3段階に変更された。",
      "  ① €800,000: 高需要エリア（アテネ圏・テッサロニキ圏・ミコノス・サントリーニ・人口3,100人超の島）",
      "  ② €400,000: 上記以外のその他地域",
      "  ③ €250,000: 工業施設の住宅転換・歴史的建造物（特殊カテゴリのみ）",
      "「不動産購入額が250,000ユーロ以上」という単純化した記述は絶対にしないこと。",
      "記事本文に「2024年3月31日施行の改定に基づく」という時点情報を必ず含めること。",
      "主要参照ソース（Enterprise Greece）はギリシャ政府系投資促進機関のニュースレターであり法令原文ではない。",
      "投資額については「2024年3月31日施行時点の情報。最新の法令は公式機関でご確認ください」と注記すること。",
    ].join("\n"),
  },
  {
    slug: "thailand-ltr-visa-guide-2026",
    programName: {
      ja: "LTR（Long-Term Resident）ビザ",
      en: "Long-Term Resident (LTR) Visa",
      zh: "长期居留（LTR）签证",
    },
    countryCode: "th",
    countryName: { ja: "タイ", en: "Thailand", zh: "泰国" },
    sourceUrls: ["https://ltr.boi.go.th"],
  },
  {
    slug: "dubai-uae-golden-visa-guide-2026",
    programName: {
      ja: "UAEゴールデンビザ（10年居住許可）",
      en: "UAE Golden Visa (10-Year Residency)",
      zh: "阿联酋黄金签证（10年居留许可）",
    },
    countryCode: "ae",
    countryName: { ja: "UAE・ドバイ", en: "UAE / Dubai", zh: "阿联酋/迪拜" },
    sourceUrls: [
      "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/golden-visa",
    ],
  },
  {
    slug: "singapore-ep-employment-pass-guide-2026",
    programName: {
      ja: "EP（Employment Pass）就労ビザ",
      en: "Employment Pass (EP)",
      zh: "就业准证（EP）",
    },
    countryCode: "sg",
    countryName: { ja: "シンガポール", en: "Singapore", zh: "新加坡" },
    sourceUrls: ["https://www.mom.gov.sg/passes-and-permits/employment-pass"],
  },
  {
    slug: "new-zealand-skilled-migrant-visa-guide-2026",
    programName: {
      ja: "スキルドマイグラントビザ（永住権）",
      en: "Skilled Migrant Category Resident Visa",
      zh: "技术移民签证（永久居留权）",
    },
    countryCode: "nz",
    countryName: { ja: "ニュージーランド", en: "New Zealand", zh: "新西兰" },
    sourceUrls: [
      "https://www.immigration.govt.nz/new-zealand-visas/visas/visa/skilled-migrant-category-resident-visa",
    ],
  },
  {
    slug: "canada-express-entry-guide-2026",
    programName: {
      ja: "Express Entry（連邦熟練労働者プログラム）",
      en: "Express Entry (Federal Skilled Worker Program)",
      zh: "快速通道（Express Entry / 联邦技术移民）",
    },
    countryCode: "ca",
    countryName: { ja: "カナダ", en: "Canada", zh: "加拿大" },
    sourceUrls: [
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html",
      "https://www.ircc.canada.ca/english/information/fees/fees.asp",
    ],
  },
  {
    slug: "australia-skilled-independent-visa-189-guide-2026",
    programName: {
      ja: "Skilled Independent Visa（Subclass 189）永住ビザ",
      en: "Skilled Independent Visa (Subclass 189)",
      zh: "技术独立移民签证（189类永居签证）",
    },
    countryCode: "au",
    countryName: { ja: "オーストラリア", en: "Australia", zh: "澳大利亚" },
    sourceUrls: [
      "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189",
    ],
  },
];

// ─── CLI 引数 ─────────────────────────────────────────────────────────────────

// --regen=<countryCode|slug>: 既存 slug があっても強制再生成し、<slug>-v2 で保存
const regenArg = process.argv.find((a) => a.startsWith("--regen="));
const regenTarget = regenArg ? regenArg.split("=")[1] : null;

// ─── 次の未生成トピックを取得 ─────────────────────────────────────────────────

async function getNextTopic(): Promise<VisaGuideTopic | null> {
  const { data } = await sb
    .from("blog_posts")
    .select("slug")
    .in("slug", VISA_GUIDE_TOPICS.map((t) => t.slug));

  const existingSlugs = new Set((data ?? []).map((r: { slug: string }) => r.slug));

  for (const topic of VISA_GUIDE_TOPICS) {
    if (!existingSlugs.has(topic.slug)) return topic;
  }
  return null; // 全件生成済み
}

// ─── コンテンツ生成 ───────────────────────────────────────────────────────────

const REFUSAL = ["申し訳ありません", "I cannot", "I'm sorry", "As an AI", "I'm unable", "cannot access the internet", "インターネットへのアクセス"];

function buildPrompt(topic: VisaGuideTopic, lang: Lang, ctx: SourceContext): string {
  const hasSource = ctx.isGrounded && ctx.text.length > 0;
  const sourceBlock = hasSource
    ? `\n\n=== 参考資料原文（以下のソース内容のみを根拠にすること。原文にない数字・手続き・URLは書かないこと。CAのircc費用ページに"[Error loading fee]"の文言があれば無視し費用情報は別の根拠から記述すること）===\n${ctx.text}\n=== 参考資料ここまで ===\n`
    : "";

  const noteBlock = topic.promptNote
    ? `\n\n⚠️ 生成時の特記事項（必ず遵守すること）:\n${topic.promptNote}\n`
    : "";

  const refUrls = ctx.urlList.map((u) => `- ${u}`).join("\n");

  const grounding = hasSource
    ? {
        ja: "参考資料原文に記載のある要件・費用・手続きはその数値に従って記述すること。原文にない費用・要件は具体的な数字を書かず「公式サイトまたは大使館でご確認ください」と案内すること。",
        en: "For requirements, fees, and procedures found in the reference text: use ONLY those figures. For anything not covered: omit specific amounts and instead write 'Please check the official site or embassy for current details'.",
        zh: "参考资料中提及的要求、费用和流程，按原文数字填写。原文未提及的费用或要求，不得写具体数字，改为「请参阅官方网站或大使馆确认最新信息」。",
      }[lang]
    : {
        ja: "ソース文書が取得できなかったため、知識ベースで概要を記述すること。ただし具体的な申請費用は「公式サイトまたは大使館でご確認ください」と案内するにとどめること。",
        en: "Source documents could not be retrieved; write an overview based on general knowledge. For specific application fees, write 'Please check the official site or embassy for current details' instead of guessing.",
        zh: "来源文件未能获取，以通用知识撰写概述。具体申请费用，请写「请参阅官方网站或大使馆确认最新信息」，不得凭空填写。",
      }[lang];

  if (lang === "ja") {
    return `あなたはMoveWorthというサービスのビザ情報専門ライターです。MoveWorthは海外移住を考えている人向けに、税金・生活費・ビザを一括シミュレーションできるサービスです。
${sourceBlock}${noteBlock}
${topic.countryName.ja}の「${topic.programName.ja}」に特化した記事を日本語で書いてください。${grounding}生活費・家賃の目安は知識で補完してよい。

## タイトル形式（必ず守ること。絵文字・記号は一切使わないこと）
【2026年最新版】${topic.countryName.ja}${topic.programName.ja}完全ガイド｜申請条件・費用・手続きを徹底解説

## 本文の構成（見出しは必ず ### を使うこと）

[導入段落] ※見出しなし。${topic.programName.ja}の概要と人気の理由を2〜3文で書く。

### ${topic.programName.ja}とは
制度の目的・特徴・概要（150文字程度）

### 申請資格・取得条件
主要な資格要件（収入・資産・年齢・職業・ポイント等）を箇条書きで詳細に記載

### 申請費用の内訳
| 項目 | 費用 |
|------|------|
（全費用項目を表で記載）

### 申請の流れ（ステップ別）
1. **ステップ名**：説明
（5〜7ステップで手続きの全体像を記載）

### ビザ取得後の権利と制限
就労・不動産購入・家族帯同・更新条件等

### 生活費と税金の目安
主要都市の家賃・生活費・税制概要（簡潔に）

### 申請前に確認すべきポイント
1. **重要事項**：説明
（5点程度のチェックリスト）

締め括りの文（1〜2文）。MoveWorthシミュレーターへの誘導を含める（リンクは必ず https://moveworthapp.com/simulate を使用すること）。

---

### 参考資料
本記事の情報は以下の公式資料をもとに作成しています。
${refUrls}

## JSON形式で返答（JSONのみ、コードブロック不要）
{
  "title": "【2026年最新版】${topic.countryName.ja}${topic.programName.ja}完全ガイド｜申請条件・費用・手続きを徹底解説",
  "description": "${topic.programName.ja}の2026年最新申請条件・費用・手続きを徹底解説。120〜160文字で書く。",
  "content": "上記構成の記事本文（マークダウン、3000〜5000文字）"
}`;
  }

  if (lang === "en") {
    return `You are a visa information writer for MoveWorth, a service that helps people considering international relocation simulate taxes, living costs, and visa requirements.
${sourceBlock}${noteBlock}
Write a comprehensive, fact-based English article about the "${topic.programName.en}" in ${topic.countryName.en}. ${grounding} General living costs and rent estimates may use your knowledge.

## Title format (strictly follow. No emojis or special symbols):
${topic.countryName.en} ${topic.programName.en} 2026 Complete Guide | Requirements, Fees & Application Process

## Article structure (use ### for all headings):

[Intro paragraph] — no heading. 2–3 sentences on the program overview and why it's popular.

### What Is the ${topic.programName.en}?
Program purpose, background, key features (~100 words)

### Eligibility Requirements
Bullet list of all key requirements (income, assets, age, occupation, points system, etc.)

### Application Fees Breakdown
| Item | Cost |
|------|------|
(all fee items in a table)

### Step-by-Step Application Process
1. **Step name**: explanation
(5–7 steps covering the full process)

### Rights & Restrictions After Approval
Work rights, property purchase, family sponsorship, renewal conditions

### Living Costs & Tax Overview
Rent estimates for major cities, brief tax note

### Pre-Application Checklist
1. **Key point**: explanation
(5 items)

Closing sentence with MoveWorth simulator link. Always use exact URL: https://moveworthapp.com/simulate

---

### References
${refUrls}

## Return as JSON only (no code block):
{
  "title": "${topic.countryName.en} ${topic.programName.en} 2026 Complete Guide | Requirements, Fees & Application Process",
  "description": "2026 guide to the ${topic.programName.en}: eligibility, costs and step-by-step process. 120–160 chars.",
  "content": "Full article in the structure above (markdown, 3000–5000 chars)"
}`;
  }

  // zh
  return `您是MoveWorth服务的签证信息专业撰稿人。MoveWorth帮助考虑海外移居的人模拟税务、生活成本和签证要求。
${sourceBlock}${noteBlock}
请用中文撰写一篇关于${topic.countryName.zh}「${topic.programName.zh}」的详细文章。${grounding}生活费和房租参考可使用通用知识补充。

## 标题格式（必须严格遵守，不使用表情符号）：
【2026年最新】${topic.countryName.zh}${topic.programName.zh}完全指南｜申请条件·费用·办理流程详解

## 文章结构（所有标题使用 ###）：

[导言] ※无标题。2～3句介绍${topic.programName.zh}的概况及受欢迎的原因。

### 什么是${topic.programName.zh}？
计划目的、特点与概述（约150字）

### 申请资格与取得条件
详细列出所有主要资格条件（收入、资产、年龄、职业、积分制度等）

### 申请费用明细
| 项目 | 费用 |
|------|------|
（以表格列出所有费用项目）

### 申请流程（分步说明）
1. **步骤名称**：说明
（5～7个步骤，涵盖整体申请流程）

### 获批后的权利与限制
就业权、购房、家属随行、续签条件等

### 生活费与税务概况
主要城市房租参考、简要税务说明

### 申请前须知
1. **重要事项**：说明
（5条检查清单）

结语（1～2句）。引导至MoveWorth模拟器（链接必须使用 https://moveworthapp.com/simulate）。

---

### 参考资料
${refUrls}

## 仅返回JSON（无代码块）：
{
  "title": "【2026年最新】${topic.countryName.zh}${topic.programName.zh}完全指南｜申请条件·费用·办理流程详解",
  "description": "2026年${topic.programName.zh}最新申请条件、费用及办理流程详解。120～160字。",
  "content": "按上述结构的完整文章（Markdown，3000～5000字）"
}`;
}

async function generateContent(
  topic: VisaGuideTopic,
  lang: Lang,
  ctx: SourceContext,
): Promise<{ title: string; description: string; content: string }> {
  const prompt = buildPrompt(topic, lang, ctx);
  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });
  const parsed = JSON.parse(res.choices[0].message.content!);
  parsed.content = sanitizeMoveWorthLinks(parsed.content);
  return parsed;
}

// ─── 品質チェック ─────────────────────────────────────────────────────────────

function qualityCheck(
  ja: { content: string },
  en: { content: string },
  slug: string,
): void {
  const errors: string[] = [];

  if (ja.content.includes("example.com") || en.content.includes("example.com"))
    errors.push("example.com 混入");

  for (const p of REFUSAL) {
    if (ja.content.includes(p)) errors.push(`GPT拒否パターン(ja): "${p}"`);
    if (en.content.includes(p)) errors.push(`GPT拒否パターン(en): "${p}"`);
  }

  if (ja.content.length < 500) errors.push(`content.ja が短すぎ: ${ja.content.length}文字`);
  if (en.content.length < 500) errors.push(`content.en が短すぎ: ${en.content.length}文字`);

  if (errors.length > 0) {
    console.error(`\n❌ 品質チェック失敗: ${slug}`);
    for (const e of errors) console.error(`  • ${e}`);
    throw new Error(`品質チェック失敗: ${slug}`);
  }
}

// ─── メイン ───────────────────────────────────────────────────────────────────

async function run() {
  let topic: VisaGuideTopic;
  let slug: string;

  if (regenTarget) {
    // --regen モード: countryCode または正式 slug で対象を検索
    const matched = VISA_GUIDE_TOPICS.find(
      (t) => t.countryCode === regenTarget || t.slug === regenTarget,
    );
    if (!matched) {
      console.error(`❌ --regen 対象が見つかりません: "${regenTarget}"`);
      console.error(`   指定可能: ${VISA_GUIDE_TOPICS.map((t) => t.countryCode).join(", ")}`);
      process.exit(1);
    }
    topic = matched;
    slug = matched.slug + "-v2";
    console.log(`\n[--regen モード] ${matched.slug} → ${slug} で新規生成`);
  } else {
    const next = await getNextTopic();
    if (!next) {
      console.log("✅ VISA_GUIDE_TOPICS 全件生成済みのためスキップ");
      process.exit(0);
    }
    topic = next;
    slug = topic.slug;
  }

  console.log(`\n生成開始: ${slug}`);
  console.log(`  プログラム: ${topic.programName.ja}`);

  // ソース収集: topic 固有 URL + country_sources
  const csUrls = await getCountrySources(topic.countryCode);
  const allUrls = [...new Set([...topic.sourceUrls, ...csUrls])];
  console.log(`  ソースURL: ${allUrls.length}件`);
  allUrls.forEach((u) => console.log(`    - ${u}`));

  const ctx = await buildSourceContext(allUrls);
  console.log(`  grounded: ${ctx.isGrounded} (${ctx.isGrounded ? "有用コンテンツあり" : "ソース取得できず・知識ベースで生成"})`);

  // 3言語並列生成
  console.log("  生成中（ja/en/zh）...");
  const [ja, en, zh] = await Promise.all([
    generateContent(topic, "ja", ctx),
    generateContent(topic, "en", ctx),
    generateContent(topic, "zh", ctx),
  ]);

  // 品質チェック
  qualityCheck(ja, en, slug);
  console.log("  品質チェック: ✅");

  // バリデーション
  assertBlogPayload(
    {
      title:       { ja: ja.title,       en: en.title,       zh: zh.title },
      description: { ja: ja.description, en: en.description, zh: zh.description },
      content:     { ja: ja.content,     en: en.content,     zh: zh.content },
    },
    slug,
  );

  const today = new Date().toISOString().slice(0, 10);

  const { error } = await sb.from("blog_posts").insert({
    slug,
    category: "visa-guide",
    published_at: today,
    reading_minutes: 12,
    thumbnail: null,
    title:       { ja: ja.title,       en: en.title,       zh: zh.title },
    description: { ja: ja.description, en: en.description, zh: zh.description },
    content:     { ja: ja.content,     en: en.content,     zh: zh.content },
    locales: null,
    pinned: false,
    is_published: false,
  });

  if (error) {
    console.error("Insert 失敗:", error.message);
    process.exit(1);
  }

  console.log(`\n✅ draft 保存: ${slug}`);
  console.log(`  JA: ${ja.content.length}文字 / EN: ${en.content.length}文字 / ZH: ${zh.content.length}文字`);
}

run().catch((e) => { console.error(e); process.exit(1); });

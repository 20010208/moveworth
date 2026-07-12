import { existsSync, readFileSync, writeFileSync } from "fs";
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
    const val = t.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- Task 4: source-grounded generation ---

const SOURCE_FETCH_TIMEOUT = 8_000;
const MAX_CHARS_PER_SOURCE = 3_000;
const MAX_SOURCES = 5;

function stripHtml(html: string): string {
  return html
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

// SPA・ナビゲーション羅列のような低品質コンテンツを判定する。
// 金額/割合/期間/ポイント数などの具体的情報が 2 種類以上含まれていれば有用とみなす。
function isSourceUseful(text: string): boolean {
  if (!text || text.length < 300) return false;
  let hits = 0;
  if (/(?:NZD|EUR|USD|GBP|AUD|CAD|SGD|CHF|PLN|TND|SEK|NOK)\s?\$?[\d,]+|[\d,]+\s*(?:EUR|PLN|euros?)|[$€£]\s?[\d,]+/i.test(text)) hits++;
  if (/\d+\.?\d*\s*%/.test(text)) hits++;
  if (/\d+\s*(days?|weeks?|months?|years?|hours?)/i.test(text)) hits++;
  if (/\d+\s*points?/i.test(text)) hits++;
  if (/(require|eligib|qualif|must have|criteria|condition|permit|residence|visa|employ|work permit|foreign staff|national|labor|labour)[\s\S]{0,100}\d/i.test(text)) hits++;
  return hits >= 2;
}

// SPA 判定時のフォールバック: Wayback Machine から静的スナップショットを取得
async function tryWaybackMachine(originalUrl: string): Promise<string | null> {
  try {
    const apiController = new AbortController();
    const apiTimer = setTimeout(() => apiController.abort(), 6_000);
    const apiRes = await fetch(
      `https://archive.org/wayback/available?url=${encodeURIComponent(originalUrl)}`,
      { signal: apiController.signal }
    );
    clearTimeout(apiTimer);
    if (!apiRes.ok) return null;
    type WaybackResp = { archived_snapshots?: { closest?: { url?: string; available?: boolean } } };
    const data = await apiRes.json() as WaybackResp;
    const snapshot = data.archived_snapshots?.closest;
    if (!snapshot?.available || !snapshot.url) return null;

    const wbController = new AbortController();
    const wbTimer = setTimeout(() => wbController.abort(), SOURCE_FETCH_TIMEOUT);
    try {
      const wbRes = await fetch(snapshot.url, {
        signal: wbController.signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; MoveWorthBot/1.0)" },
      });
      clearTimeout(wbTimer);
      if (!wbRes.ok) return null;
      const html = await wbRes.text();
      return stripHtml(html).slice(0, MAX_CHARS_PER_SOURCE);
    } catch {
      clearTimeout(wbTimer);
      return null;
    }
  } catch {
    return null;
  }
}

async function fetchPageText(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SOURCE_FETCH_TIMEOUT);
  let text: string | null = null;
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MoveWorthBot/1.0)" },
    });
    clearTimeout(timer);
    if (res.ok) {
      const ct = res.headers.get("content-type") ?? "";
      if (ct.includes("html") || ct.includes("text")) {
        text = stripHtml(await res.text()).slice(0, MAX_CHARS_PER_SOURCE);
      }
    }
  } catch {
    clearTimeout(timer);
  }

  // SPA やナビゲーション羅列を検出した場合は Wayback Machine へフォールバック
  if (!isSourceUseful(text ?? "")) {
    console.log(`  [source] SPA/low-quality detected — trying Wayback Machine for ${url}`);
    const wb = await tryWaybackMachine(url);
    if (wb && isSourceUseful(wb)) {
      console.log(`  [source] Wayback Machine snapshot used for ${url}`);
      return wb;
    }
    // Wayback も取得できなければ元のテキストをそのまま返す（null も含む）
  }
  return text;
}

type SourceRow = { url: string; purpose: string };

async function getCountrySources(
  countryCode: string,
  purpose: "visa" | "study" | "tax"
): Promise<SourceRow[]> {
  try {
    const { data, error } = await supabase
      .from("country_sources")
      .select("url, purpose")
      .eq("country_code", countryCode)
      .eq("purpose", purpose)
      .eq("status", "alive")
      .limit(MAX_SOURCES);
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

interface SourceContext {
  text: string;
  refs: string;
  isGrounded: boolean; // true = 有用なコンテンツが 1 件以上取得できた
}

async function buildSourceContext(sources: SourceRow[]): Promise<SourceContext> {
  const fetched: { url: string; text: string }[] = [];
  await Promise.all(
    sources.map(async (s) => {
      const text = await fetchPageText(s.url);
      // isSourceUseful を通過したものだけを文脈に使用
      if (text && isSourceUseful(text)) fetched.push({ url: s.url, text });
    })
  );

  const refs = sources.map((s) => `- ${s.url}`).join("\n");

  if (fetched.length === 0) return { text: "", refs, isGrounded: false };

  const text = fetched
    .map((f, i) => `--- 参考資料 ${i + 1}: ${f.url} ---\n${f.text}`)
    .join("\n\n");

  return { text, refs, isGrounded: true };
}

// Countries in priority order: fixed first 2, then popular destinations
const COUNTRY_QUEUE = [
  { code: "nz", name: { ja: "ニュージーランド", en: "New Zealand" } },
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
  { code: "my", name: { ja: "マレーシア", en: "Malaysia" } },
  { code: "th", name: { ja: "タイ", en: "Thailand" } },
  { code: "au", name: { ja: "オーストラリア", en: "Australia" } },
  { code: "us", name: { ja: "アメリカ", en: "United States" } },
  { code: "sg", name: { ja: "シンガポール", en: "Singapore" } },
  { code: "gb", name: { ja: "イギリス", en: "United Kingdom" } },
];

type Lang = "ja" | "en" | "zh";

// CLI 引数:
//   npx tsx generate-country-article.ts [country_code]
//     → 生成して draft 保存（is_published=false）。既存公開記事は上書きしない。
//   npx tsx generate-country-article.ts [country_code] --publish-only
//     → 再生成なし。既存 draft の is_published を true に切り替えるだけ。
//   ※ --publish（再生成して公開）は廃止。レビューした内容と公開内容の同一性を保証するため。
const _args = process.argv.slice(2);
const forceCountryCode = _args.find((a) => !a.startsWith("--")) ?? null;
const publishOnly = _args.includes("--publish-only");

if (_args.includes("--publish")) {
  console.error("❌ --publish は廃止されました。");
  console.error("   生成: npx tsx generate-country-article.ts [code]");
  console.error("   公開: npx tsx generate-country-article.ts [code] --publish-only");
  process.exit(1);
}

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

// 国別 税制ソース使用時の追加制約（TH: 古い移行注記の無視等）
const COUNTRY_TAX_EXTRA_CONSTRAINTS: Partial<Record<string, Record<Lang, string>>> = {
  th: {
    ja: "【TH税制制約】税制情報ページには2013-14年実施の旧注記が本文に残っているが、現行の税率表（パーセンテージと所得区分の表）の数値のみを使用すること。旧制度の注記はソース根拠としては使わないこと。また、LTRビザ保有者・BOI優遇対象者向けの17%フラット税率はこの税制ソースには記載されていないため、絶対に記述しないこと。標準の累進税率のみをソース根拠として使用すること。",
    en: "【TH tax constraint】The source page contains historical notes from 2013-14 transition. Use ONLY the current progressive tax rate table (percentages and income brackets) from the source. Ignore transitional/historical notes. Do NOT mention the 17% flat tax rate for LTR visa holders or BOI-promoted companies — that rate is NOT in this source and must not be included.",
    zh: "【TH税制约束】税制信息页面中包含2013-14年旧制度的历史注记。仅使用当前有效的累进税率表（百分比和收入级距），忽略历史过渡说明。严禁提及LTR签证持有者或BOI优惠对象适用的17%固定税率——该税率不在本税制来源中，不得写入文章。",
  },
};

// 国別の追加制約（ソースの性質や構成上の注意点を補足）
const COUNTRY_VISA_EXTRA_CONSTRAINTS: Partial<Record<string, Record<Lang, string>>> = {
  tn: {
    ja: "【TN特別制約】参考資料は「外国人雇用・労働法」に関するもので、ビザ申請手続きの一次情報ではない。" +
        "参考資料に記載のある外国人雇用ルール（30%ルール、ANETIの事前許可等）はソースの数値に従って記述すること。" +
        "ビザ申請手続き・申請費用・学生ビザについては参考資料に一次情報がないため、具体的な金額や日数を書かず、" +
        "「詳細は在日チュニジア大使館または領事館にお問い合わせください」と誘導する構成にすること。" +
        "いかなるURLも捏造・推測で書かないこと（example.com / プレースホルダー禁止）。",
    en: "【TN special constraint】Sources cover foreign employment/labor law, NOT visa application procedures. " +
        "Write employment rules from source (30% rule, ANETI pre-approval etc.) with exact figures. " +
        "For visa procedures, fees, and student visas where no primary source exists: omit specific amounts/timelines " +
        "and instead write 'Please contact the Tunisian Embassy for current details'. " +
        "Never fabricate URLs or use placeholder domains (example.com etc.).",
    zh: "【TN特殊限制】参考资料涉及外国人雇佣/劳动法，而非签证申请手续。" +
        "雇佣规则（30%外籍员工上限、ANETI预先批准等）须按原文数字填写。" +
        "签证申请手续、费用、学生签证因无一手资料，不得填写具体金额或天数，" +
        "改为「请联系突尼斯驻当地大使馆确认最新信息」。禁止捏造URL或使用占位域名（example.com等）。",
  },
};

async function generateVisaContent(
  countryName: { ja: string; en: string },
  lang: Lang,
  sourceCtx?: SourceContext,
  countryCode?: string,
  taxSourceCtx?: SourceContext
): Promise<{ title: string; description: string; content: string }> {
  const hasSource = !!sourceCtx?.text;
  const sourceBlock = hasSource
    ? `\n\n=== 参考資料原文（以下の内容のみを根拠にすること。原文にない数字・手続き・URLは書かないこと）===\n${sourceCtx!.text}\n=== 参考資料原文ここまで ===\n`
    : "";
  // 参考資料セクションはソース有りの場合は自動生成するため GPT には不要
  const refSectionInstruction = hasSource
    ? "参考資料セクション（### 参考資料 / ### References / ### 参考资料）は書かないこと。自動追加される。"
    : "";
  const prebuiltRefs = sourceCtx?.refs ?? "";

  const extraConstraint = countryCode
    ? (COUNTRY_VISA_EXTRA_CONSTRAINTS[countryCode]?.[lang] ?? "")
    : "";

  // 税制ソース
  const hasTaxSource = !!taxSourceCtx?.text;
  const taxBlock = hasTaxSource
    ? `\n\n=== 税制参考資料（所得税率・控除額・税率区分は以下の数値のみを根拠にすること）===\n${taxSourceCtx!.text}\n=== 税制参考資料ここまで ===\n`
    : "";
  const taxExtraConstraint = (hasTaxSource && countryCode)
    ? (COUNTRY_TAX_EXTRA_CONSTRAINTS[countryCode]?.[lang] ?? "")
    : "";
  // ja/en/zh でそれぞれ税制指示を切り替え
  const taxInstruction: Record<Lang, string> = {
    ja: hasTaxSource
      ? `所得税率・税率閾値は税制参考資料の数値のみを使用すること。税制参考資料にない税項目は「最新の税制は${countryName.ja}の税務当局または公式情報でご確認ください」と誘導すること。${taxExtraConstraint ? `\n${taxExtraConstraint}` : ""}`
      : "ただし所得税率・税率閾値などの税制情報は参考資料に具体的な数字の記載がある場合のみ書くこと。参考資料にない場合は「最新の税制は移住先国の税務当局または公式情報でご確認ください」と案内するにとどめること。",
    en: hasTaxSource
      ? `Income tax rates and brackets: use ONLY the figures from the tax reference source. For any tax items not covered in the tax source, write 'For current tax rates, please refer to the official tax authority of ${countryName.en}'.${taxExtraConstraint ? `\n${taxExtraConstraint}` : ""}`
      : "For income tax rates and tax bracket thresholds: only write specific figures if they appear in the reference sources. If not sourced, write 'For current tax rates, please refer to the official tax authority of the destination country' instead of guessing figures.",
    zh: hasTaxSource
      ? `所得税率、税率区间：仅使用税制参考资料中的数字。税制参考资料未涉及的税务项目，请引导至「请参阅${countryName.en}税务机关的官方信息」。${taxExtraConstraint ? `\n${taxExtraConstraint}` : ""}`
      : "但所得税率、税率区间等税制信息，只有在参考资料中有明确数字时才可填写；若无来源，请改为「有关当前税率，请参阅目的国税务机关的官方信息」。",
  };

  const prompts: Record<Lang, string> = {
    ja: `あなたはMoveWorthというサービスのビザ情報ライターです。MoveWorthは、海外移住を考えている人向けに、税金・生活費・ビザを一括シミュレーションできるサービスです。
${sourceBlock}${taxBlock}
${countryName.ja}のビザ・移住条件に関する記事を日本語で書いてください。${hasSource ? "参考資料原文に記載のあるビザについては、要件・費用・手続きを必ず原文の数値に従って書くこと。参考資料原文に記載のないビザ種別（例：ワーキングホリデー等）は知識で補完してよいが、具体的な申請費用は書かず「公式サイトでご確認ください」と案内すること。" : ""}生活費・家賃の目安は知識で補完してよい。${taxInstruction.ja}${extraConstraint ? `\n${extraConstraint}` : ""}

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
${refSectionInstruction ? `\n${refSectionInstruction}` : `
---

### 参考資料
本記事の情報は以下の公式資料をもとに作成しています。
- **{ビザ名}**: [{機関名} – {ページ名}]({公式URL})`}

## JSON形式で返答（JSONのみ、コードブロック不要）
{
  "title": "【2026年最新版】${countryName.ja}のビザ・就労許可完全ガイド｜主要ビザ名を含める",
  "description": "主要ビザと最低条件・費用を含むメタディスクリプション（120〜160文字）",
  "content": "上記構成の記事本文（マークダウン、2500〜4000文字）"
}`,

    en: `You are a visa information writer for MoveWorth, a service that helps people considering international relocation simulate taxes, living costs, and visa requirements.
${sourceBlock}${taxBlock}
Write a detailed, factual article about ${countryName.en} visa and immigration requirements in English.${hasSource ? " For visa types covered in the reference texts: use ONLY those sources for requirements, fees, and procedures. For visa types NOT in the references (e.g. Working Holiday, partner visas): supplement from your knowledge but omit specific fee amounts and instead say 'check the official site for current fees'." : ""} General living costs and rent estimates may use your knowledge. ${taxInstruction.en}${extraConstraint ? `\n${extraConstraint}` : ""}

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
${refSectionInstruction ? `\n${refSectionInstruction}` : `
---

### References
Data sourced from:
- **{Visa name}**: [{Agency} – {Page}]({official URL})`}

## Return as JSON only (no code block):
{
  "title": "${countryName.en} Visa & Work Permit Complete Guide 2026 | include main visa names",
  "description": "Include key visa types and minimum requirements (120–160 chars)",
  "content": "Full article in the structure above (markdown, 2500–4000 chars)"
}`,

    zh: `您是MoveWorth服务的签证信息撰稿人。MoveWorth帮助考虑海外移居的人模拟税务、生活成本和签证要求。
${sourceBlock}${taxBlock}
请用中文撰写一篇关于${countryName.en}（${countryName.ja}）签证与移居条件的详细文章。${hasSource ? "参考资料中涉及的签证类型，其要求、费用和手续必须严格依照原文数字填写。参考资料未涉及的签证类型（如打工度假签证等）可以用您的知识补充，但不得写具体申请费用，请改为引导至官方网站确认。" : ""}生活费、房租等信息可用知识补充。${taxInstruction.zh}${extraConstraint ? `\n${extraConstraint}` : ""}

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
${refSectionInstruction ? `\n${refSectionInstruction}` : `
---

### 参考资料
- **{签证名称}**: [{机构} – {页面}]({官方URL})`}

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
  const parsed1 = JSON.parse(res.choices[0].message.content!);
  parsed1.content = sanitizeMoveWorthLinks(parsed1.content);

  // ソース有りの場合: 参考資料セクションを自動追加
  if (hasSource && prebuiltRefs) {
    const refHeadings: Record<Lang, string> = {
      ja: "### 参考資料\n本記事の情報は以下の公式資料をもとに作成しています。",
      en: "### References\nData sourced from official government and immigration authority pages.",
      zh: "### 参考资料\n本文信息来源于以下官方资料。",
    };
    parsed1.content = parsed1.content.trimEnd() + `\n\n---\n\n${refHeadings[lang]}\n${prebuiltRefs}`;
  }

  return parsed1;
}

async function factCheckContent(
  content: string,
  countryName: string,
  lang: string,
  sourceText?: string
): Promise<string> {
  // ソース有りの場合: 原文との整合チェック（知識ベース修正ではなく原文根拠チェック）
  const prompt = sourceText
    ? `あなたは${countryName}のビザ情報の校正者です。以下の「記事本文」を「参考資料原文」と照合してください。参考資料原文に記載のあるビザ種別については、そのビザの要件・費用・手続きの数値が原文と異なる場合は修正してください。参考資料原文に記載のないビザ種別の記述（ワーキングホリデー等）は照合対象外のためそのまま保持してください。税率・生活費・家賃などの一般情報も照合対象外として保持してください。

ルール：
- 「確認できない」「インターネットにアクセスできない」などのメタコメントは絶対に書かないでください
- 修正した記事本文のみを返してください。説明・コメント・注記は一切不要です
- 言語: ${lang}

=== 参考資料原文 ===
${sourceText.slice(0, 6000)}
=== 参考資料原文ここまで ===

=== 記事本文 ===
${content}`
    : `あなたは${countryName}の移住・ビザ情報に詳しい専門家です。以下の記事を、あなたの知識で精査してください。

ルール：
- あなたの学習データに基づいて、費用・期間・必要書類などの数字や事実を確認し、明らかに誤っている箇所のみ修正してください
- 【重要】所得税率・税率閾値などの税制情報は、記事内にすでに「公式情報でご確認ください」等の誘導がある場合はそのままにしてください。具体的な数字を新たに追加しないでください
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

MoveWorth.studyのシミュレーターで${countryName.ja}留学の総費用を計算してみましょう。リンクは必ず https://study.moveworthapp.com/simulate を使用してください。

### 参考資料
本記事の情報は以下の公式資料をもとに作成しています。
（${countryName.ja}の入国管理局・労働省・政府公式サイトなど公式機関を3〜5件。実在する正確なURLのみ。捏造不可）
- [機関名](https://official-url.example.com)

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

Use the MoveWorth.study simulator to calculate total costs for studying in ${countryName.en}. Always use exact URL: https://study.moveworthapp.com/simulate

### References
List 3-5 official sources (immigration authority, labor ministry, government site of ${countryName.en}). Real URLs only — never fabricate.
- [Organization name](https://official-url.example.com)

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
  const parsed2 = JSON.parse(res.choices[0].message.content!);
  parsed2.content = sanitizeMoveWorthLinks(parsed2.content);
  return parsed2;
}

async function generateCountryGuideContent(
  countryName: { ja: string; en: string },
  lang: "ja" | "en"
): Promise<{ title: string; description: string; content: string }> {
  const prompts: Record<"ja" | "en", string> = {
    ja: `あなたはMoveWorth.studyのSEOライターです。「${countryName.ja}留学」を検索する日本人に向けた、検索上位を狙える記事を書いてください。

## タイトル形式（必ず守ること）
【${countryName.ja}留学】費用・語学学校・ビザ・生活を徹底解説【2026年最新版】

## 本文構成（見出しは ### を使うこと）

[導入] ※見出しなし。${countryName.ja}留学の魅力を2〜3文で。

### ${countryName.ja}留学のメリット
（箇条書き4〜5点。具体的な数字・事例を含める）

### 費用の目安【2026年版】
（月額費用の表：語学学校・生活費・住居費）

### おすすめ留学都市
（3〜4都市の特徴・生活費感）

### 語学学校・大学の種類
（選択肢と特徴の概要）

### 学生ビザの基本情報
（申請要件・費用・期間の概要のみ）

### ${countryName.ja}の生活・文化・治安
（日本人コミュニティ・治安・食事・気候）

### よくある質問（FAQ）
Q1: ${countryName.ja}留学の費用はいくらかかりますか？
A: （具体的な数字を含む回答）
Q2: ${countryName.ja}留学に向いているのはどんな人ですか？
A: （特徴・向き不向き）
Q3: ${countryName.ja}留学の準備はいつから始めれば良いですか？
A: （目安期間）

MoveWorth.studyのシミュレーターで${countryName.ja}留学の総費用を計算できます。リンクは必ず https://study.moveworthapp.com/simulate を使用してください。

### 参考資料
本記事の情報は以下の公式資料をもとに作成しています。
（${countryName.ja}の入国管理局・大使館・観光局・教育省など公式機関を3〜5件。実在する正確なURLのみ。捏造不可）
- [機関名](https://official-url.example.com)

## JSON形式で返答（JSONのみ、コードブロック不要）
{
  "title": "【${countryName.ja}留学】費用・語学学校・ビザ・生活を徹底解説【2026年最新版】",
  "description": "キーワード「${countryName.ja}留学 費用」を含む130〜155文字のメタディスクリプション",
  "content": "上記構成の記事本文（マークダウン、1500〜2500文字）"
}`,

    en: `You are an SEO writer for MoveWorth.study. Write a comprehensive, search-optimized article for Japanese students searching to study in ${countryName.en}.

## Title format (strictly follow):
Study in ${countryName.en} 2026 — Complete Guide to Costs, Schools, Visa & Life

## Article structure (use ### for headings):

[Intro] — no heading. 2-3 sentences on why ${countryName.en} is popular for study abroad.

### Why Study in ${countryName.en}?
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
Q1: How much does it cost to study in ${countryName.en}?
A: (specific figures)
Q2: Who is ${countryName.en} best suited for?
A: (profile of ideal student)
Q3: How far in advance should I start preparing?
A: (timeline)

Include mention of MoveWorth.study simulator. Always use exact URL: https://study.moveworthapp.com/simulate

### References
List 3-5 official sources (immigration authority, embassy, tourism board, education ministry of ${countryName.en}). Real URLs only — never fabricate.
- [Organization name](https://official-url.example.com)

## Return as JSON only (no code block):
{
  "title": "Study in ${countryName.en} 2026 — Complete Guide to Costs, Schools, Visa & Life",
  "description": "SEO meta description 130-155 chars including keyword '${countryName.en} study abroad cost'",
  "content": "Full article (markdown, 1200-2000 chars)"
}`,
  };

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompts[lang] }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });
  const parsed3 = JSON.parse(res.choices[0].message.content!);
  parsed3.content = sanitizeMoveWorthLinks(parsed3.content, true);
  return parsed3;
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

async function fetchJpyRate(currency: string): Promise<number | null> {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/JPY`);
    if (!res.ok) return null;
    const data = await res.json();
    const ratePerJpy = data.rates?.[currency];
    if (!ratePerJpy) return null;
    return Math.round((1 / ratePerJpy) * 10000) / 10000;
  } catch {
    return null;
  }
}

// --- Task 2: persona auto-seed ---

async function seedPersonasForCountry(
  countryCode: string,
  preset: { referenceRent: number; referenceLivingCost: number; defaultTaxRate: number; defaultInflation: number; currency: string },
  jpPreset: { referenceRent: number; referenceLivingCost: number; defaultTaxRate: number; defaultInflation: number },
  salaries: Record<string, number>,
  jpSalaries: Record<string, number>,
): Promise<void> {
  const rate = await fetchJpyRate(preset.currency);
  if (!rate) {
    console.warn(`⚠️  [persona-seed] 為替レート取得失敗 (${preset.currency}) — スキップ`);
    return;
  }

  const jpItIncome    = jpSalaries["it"]      ?? 9_500_000;
  const jpFinIncome   = jpSalaries["finance"]  ?? 11_000_000;
  const jpEngIncome   = jpItIncome;
  const jpCoupleIncome = Math.round(jpItIncome * 1.5);
  const jpMgrIncome    = Math.round(jpFinIncome * 1.5);

  const engIncome    = salaries["it"]!;
  const coupleIncome = Math.round(salaries["it"]! * 1.5);
  const mgrIncome    = Math.round(salaries["finance"]! * 1.5);

  function makeInput(jpIncome: number, targetIncome: number, jpSavings: number, rentMult = 1, livingMult = 1) {
    return {
      countryFrom: "JP",
      countryTo: countryCode.toUpperCase(),
      incomeCurrent: jpIncome,
      incomeTarget: targetIncome,
      currencyCurrent: "JPY",
      currencyTarget: preset.currency,
      salaryGrowthRate: 0.02,
      currentSavings: jpSavings,
      savingsCurrency: "JPY",
      rentCurrent: jpPreset.referenceRent,
      livingCostCurrent: jpPreset.referenceLivingCost,
      rentTarget: Math.round(preset.referenceRent * rentMult),
      livingCostTarget: Math.round(preset.referenceLivingCost * livingMult),
      taxRateCurrent: jpPreset.defaultTaxRate,
      taxRateTarget: preset.defaultTaxRate,
      exchangeRate: rate,
      inflationCurrent: jpPreset.defaultInflation,
      inflationTarget: preset.defaultInflation,
      investmentReturn: 0.05,
      simulationYears: 10,
    };
  }

  const personas = [
    {
      country_code: countryCode.toUpperCase(),
      attribute: "30代エンジニア・単身",
      annual_income_jpy: jpEngIncome,
      family_type: "単身",
      goal: "資産形成",
      simulation_input: makeInput(jpEngIncome, engIncome, 3_000_000),
    },
    {
      country_code: countryCode.toUpperCase(),
      attribute: "30代夫婦・共働き",
      annual_income_jpy: jpCoupleIncome,
      family_type: "夫婦",
      goal: "資産形成",
      simulation_input: makeInput(jpCoupleIncome, coupleIncome, 5_000_000, 1.2),
    },
    {
      country_code: countryCode.toUpperCase(),
      attribute: "40代管理職・夫婦",
      annual_income_jpy: jpMgrIncome,
      family_type: "夫婦",
      goal: "FIRE",
      simulation_input: makeInput(jpMgrIncome, mgrIncome, 10_000_000, 1.2, 1.3),
    },
  ];

  const { error } = await supabase
    .from("simulator_personas")
    .insert(personas);

  if (error) {
    console.warn(`⚠️  [persona-seed] insert 失敗: ${error.message}`);
  } else {
    console.log(`✅ [persona-seed] ${countryCode.toUpperCase()} — 3件 insert 完了`);
  }
}

async function updateExchangeRate(currency: string, code: string): Promise<void> {
  const SIMULATE_PAGE = "src/app/study-site/simulate/page.tsx";
  if (!existsSync(SIMULATE_PAGE)) return;

  const src = readFileSync(SIMULATE_PAGE, "utf-8");

  // すでに登録済みならスキップ
  if (new RegExp(`\\b${currency}:\\s*[\\d.]+`).test(src)) {
    console.log(`Exchange rate for ${currency} already exists — skipping.`);
    return;
  }

  const rate = await fetchJpyRate(currency);
  if (!rate) {
    console.warn(`⚠️  Could not fetch rate for ${currency}`);
    return;
  }

  // toJPY の最後の行の前に挿入
  const updated = src.replace(
    /(\/\/ 新興国・インフレ国[^\n]*\n)([\s\S]*?)(^};)/m,
    (_, comment, existing, closing) => {
      const newLine = `  ${currency}: ${rate},    // ${code.toUpperCase()} (auto-fetched)\n`;
      return `${comment}${existing}${newLine}${closing}`;
    }
  );

  if (updated === src) {
    // フォールバック：toJPY ブロックの末尾に追記
    const fallback = src.replace(
      /(\bconst toJPY[^{]*\{[\s\S]*?)(^};)/m,
      (_, block, closing) => `${block}  ${currency}: ${rate},\n${closing}`
    );
    writeFileSync(SIMULATE_PAGE, fallback, "utf-8");
  } else {
    writeFileSync(SIMULATE_PAGE, updated, "utf-8");
  }

  console.log(`✅ Added exchange rate: ${currency} = ${rate} JPY`);
}

// factCheckContent はテキスト全体を返すため参考資料セクションが失われることがある。
// ソース有りの場合は country_sources の refs を factCheck 後に確実に再追加する。
function restoreRefs(content: string, refs: string | undefined, lang: Lang): string {
  if (!refs) return content;
  const stripped = content.replace(/\n\n---\n\n###\s*(参考資料|References|参考资料)[\s\S]*$/, "");
  const headings: Record<Lang, string> = {
    ja: "### 参考資料\n本記事の情報は以下の公式資料をもとに作成しています。",
    en: "### References\nData sourced from official government and immigration authority pages.",
    zh: "### 参考资料\n本文信息来源于以下官方资料。",
  };
  return stripped.trimEnd() + `\n\n---\n\n${headings[lang]}\n${refs}`;
}

async function run() {
  const country = await getNextCountry();
  const visaSlug = `visa-${country.code}`;

  // --publish-only: 再生成なし、フラグ切り替えのみ
  if (publishOnly) {
    const { data: existing, error: fetchErr } = await supabase
      .from("blog_posts").select("is_published").eq("slug", visaSlug).maybeSingle();
    if (fetchErr) { console.error("DB error:", fetchErr.message); process.exit(1); }
    if (!existing) {
      console.error(`❌ ${visaSlug} が見つかりません。先に generate を実行してください。`);
      process.exit(1);
    }
    if (existing.is_published) {
      console.log(`ℹ️  ${visaSlug} はすでに公開済みです。`);
      return;
    }
    const { error: updateErr } = await supabase
      .from("blog_posts").update({ is_published: true }).eq("slug", visaSlug);
    if (updateErr) { console.error("Update error:", updateErr.message); process.exit(1); }
    console.log(`✅ ${visaSlug} → is_published: true（フラグ切り替えのみ、再生成なし）`);
    return;
  }

  // 既存公開記事ガード: 公開中の visa 記事は上書きしない
  {
    const { data: existingVisa } = await supabase
      .from("blog_posts").select("is_published").eq("slug", visaSlug).maybeSingle();
    if (existingVisa?.is_published) {
      console.warn(`⚠️  ${visaSlug} は現在公開中のためスキップします。`);
      console.warn(`   再生成するには、先に Supabase で is_published=false にしてから実行してください。`);
      console.warn(`   公開のみ切り替える場合: npx tsx generate-country-article.ts ${country.code} --publish-only`);
      process.exit(0);
    }
  }

  console.log(`Generating articles for: ${country.name.en} (${country.code})`);

  // --- Task 4: source grounding ---
  console.log("Fetching country_sources for source-grounded generation...");
  const visaSources = await getCountrySources(country.code, "visa");
  let visaSourceCtx: SourceContext | undefined;
  // 正のフロー: sources 登録 → 検証 → 記事生成。未登録は異常系（is_published=false）
  let isVisaGrounded = false;

  if (visaSources.length > 0) {
    visaSourceCtx = await buildSourceContext(visaSources);
    if (visaSourceCtx.isGrounded) {
      isVisaGrounded = true;
      console.log(`✅ Source context built from ${visaSources.length} URLs`);
    } else {
      console.log(`⚠️  All ${visaSources.length} source URLs returned SPA/unusable content — fallback mode`);
    }
  } else {
    console.log(`⚠️  No alive sources in country_sources — knowledge-based fallback (should not occur in normal flow)`);
  }

  // --- Tax source grounding ---
  let taxSourceCtx: SourceContext | undefined;
  const taxSources = await getCountrySources(country.code, "tax");
  if (taxSources.length > 0) {
    const ctx = await buildSourceContext(taxSources);
    if (ctx.isGrounded) {
      taxSourceCtx = ctx;
      console.log(`✅ Tax source context built from ${taxSources.length} URLs`);
    } else {
      console.log(`⚠️  Tax sources present (${taxSources.length}) but all SPA/unusable — tax section uses fallback instruction`);
    }
  } else {
    console.log(`ℹ️  No tax sources registered for ${country.code} — tax section uses fallback instruction`);
  }

  // --- Visa article (ja/en/zh) ---
  console.log("Generating visa article in 3 languages...");
  const [visaJa, visaEn, visaZh] = await Promise.all([
    generateVisaContent(country.name, "ja", visaSourceCtx, country.code, taxSourceCtx),
    generateVisaContent(country.name, "en", visaSourceCtx, country.code, taxSourceCtx),
    generateVisaContent(country.name, "zh", visaSourceCtx, country.code, taxSourceCtx),
  ]);

  // Fact-check pass 1（ソース有りの場合は原文照合、なしの場合は知識ベース）
  console.log("Fact-checking visa article (pass 1)...");
  const sourceText = visaSourceCtx?.text;
  const [checked1Ja, checked1En, checked1Zh] = await Promise.all([
    factCheckContent(visaJa.content, country.name.ja, "ja", sourceText),
    factCheckContent(visaEn.content, country.name.en, "en", sourceText),
    factCheckContent(visaZh.content, country.name.en, "zh", sourceText),
  ]);

  // Fact-check pass 2:
  // source-grounded 成功時はスキップ（モデルの旧訓練データが原文照合結果を上書きするのを防ぐ）
  // 知識ベースモード時のみ pass 2 を実施
  let fcJa2: string, fcEn2: string, fcZh2: string;
  if (isVisaGrounded) {
    console.log("Skipping fact-check pass 2 (source-grounded — pass 1 is authoritative)");
    [fcJa2, fcEn2, fcZh2] = [checked1Ja, checked1En, checked1Zh];
  } else {
    console.log("Fact-checking visa article (pass 2)...");
    [fcJa2, fcEn2, fcZh2] = await Promise.all([
      factCheckContent(checked1Ja, country.name.ja, "ja"),
      factCheckContent(checked1En, country.name.en, "en"),
      factCheckContent(checked1Zh, country.name.en, "zh"),
    ]);
  }

  // factCheck 後に参考文献セクションを復元（factCheck でテキスト全体が返るため削除されることがある）
  const visaRefs = visaSourceCtx?.refs;
  const finalJa = restoreRefs(fcJa2, visaRefs, "ja");
  const finalEn = restoreRefs(fcEn2, visaRefs, "en");
  const finalZh = restoreRefs(fcZh2, visaRefs, "zh");

  const today = new Date().toISOString().split("T")[0];

  // public/images/blog/ に同名画像があれば自動設定
  const thumbExts = [".webp", ".png", ".jpg"];
  const thumbnail = thumbExts
    .map((ext) => `/images/blog/${visaSlug}${ext}`)
    .find((p) => existsSync(`public${p}`)) ?? null;

  // fallback 時の警告
  if (!isVisaGrounded) {
    console.warn(`⚠️  [FALLBACK] ${visaSlug}: source-grounded失敗 → is_published=false で保存`);
    console.log(`::warning file=scripts/generate-country-article.ts::${visaSlug} fallback使用 — source-groundedコンテンツ取得不可。is_published=false で保存。手動確認が必要です。`);
  }

  // プレースホルダー URL チェック（example.com が含まれていれば is_published を強制 false にして警告）
  const hasPlaceholderUrl = [finalJa, finalEn, finalZh].some((c) => c.includes("example.com"));
  if (hasPlaceholderUrl) {
    console.error(`❌ [PLACEHOLDER-URL] ${visaSlug}: "example.com" が生成コンテンツに含まれています — is_published=false に強制`);
    isVisaGrounded = false;
  }

  // 生成は常に draft 保存（is_published=false）。
  // 公開は --publish-only（フラグ切り替えのみ）で別途実行する。
  const shouldPublish = false;
  if (isVisaGrounded) {
    console.log(`📝 ${visaSlug}: source-grounded成功 → draft 保存`);
  }

  assertBlogPayload(
    { title: { ja: visaJa.title, en: visaEn.title, zh: visaZh.title },
      description: { ja: visaJa.description, en: visaEn.description, zh: visaZh.description },
      content: { ja: finalJa, en: finalEn, zh: finalZh } },
    visaSlug
  );

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
    is_published: shouldPublish,
  }, { onConflict: "slug" });

  if (visaError) {
    console.error("Visa article insert failed:", visaError.message);
    process.exit(1);
  }
  console.log(shouldPublish ? `✅ Visa article published: ${visaSlug}` : `📝 Visa article saved as draft: ${visaSlug}`);

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
    category: "work",
    date: today,
    reading_time: 8,
    title: { ja: studyJa.title, en: studyEn.title },
    description: { ja: studyJa.description, en: studyEn.description },
    content: { ja: studyFinalJa, en: studyFinalEn },
    is_published: true,
  }, { onConflict: "slug" });

  if (studyError) {
    console.error("Study work article insert failed:", studyError.message);
  } else {
    console.log(`✅ Study work article published: ${studySlug}`);
  }

  // --- Country guide article (study-country-{code}) ---
  console.log("Generating country guide article...");
  const [guideJa, guideEn] = await Promise.all([
    generateCountryGuideContent(country.name, "ja"),
    generateCountryGuideContent(country.name, "en"),
  ]);

  const countryGuideSlug = `study-country-${country.code}`;

  const { error: guideError } = await supabase.from("study_blog_posts").upsert({
    slug: countryGuideSlug,
    category: "country",
    date: today,
    reading_time: 7,
    title: { ja: guideJa.title, en: guideEn.title },
    description: { ja: guideJa.description, en: guideEn.description },
    content: { ja: guideJa.content, en: guideEn.content },
    is_published: true,
  }, { onConflict: "slug" });

  if (guideError) {
    console.error("Country guide article insert failed:", guideError.message);
  } else {
    console.log(`✅ Country guide article published: ${countryGuideSlug}`);
  }

  // --- Update country count text ---
  await updateCountryCountText();

  // --- Add exchange rate for new country's currency if not in toJPY ---
  const { countryPresets } = await import("../src/data/country-presets.js").catch(
    () => import("../src/data/country-presets")
  );
  const countryPresetsArr = countryPresets as Array<{
    code: string; currency: string;
    referenceRent: number; referenceLivingCost: number;
    defaultTaxRate: number; defaultInflation: number;
  }>;
  const preset = countryPresetsArr.find((p) => p.code.toLowerCase() === country.code.toLowerCase());
  if (preset?.currency) {
    await updateExchangeRate(preset.currency, country.code);
  }

  // --- Task 2: persona auto-seed ---
  const { INDUSTRY_SALARIES } = await import("../src/data/industry-salaries.js").catch(
    () => import("../src/data/industry-salaries")
  );
  const salariesTyped = INDUSTRY_SALARIES as Record<string, Record<string, number>>;
  const countrySalaries = salariesTyped[country.code.toUpperCase()];
  const jpPresetData = countryPresetsArr.find((p) => p.code === "JP");

  if (!countrySalaries) {
    console.warn(`⚠️  [persona-seed] ${country.code.toUpperCase()} が industry-salaries.ts に未登録 — ペルソナ seed をスキップ`);
  } else if (!preset) {
    console.warn(`⚠️  [persona-seed] ${country.code.toUpperCase()} が country-presets.ts に未登録 — ペルソナ seed をスキップ`);
  } else if (!jpPresetData) {
    console.warn(`⚠️  [persona-seed] JP preset が見つからない — ペルソナ seed をスキップ`);
  } else {
    await seedPersonasForCountry(
      country.code,
      preset,
      jpPresetData,
      countrySalaries,
      salariesTyped["JP"] ?? {},
    );
  }
}

run();

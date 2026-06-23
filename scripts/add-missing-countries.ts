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

const MISSING_COUNTRIES = [
  { code: "BE", name: "ベルギー", nameEn: "Belgium", nameZh: "比利时", currency: "EUR", symbol: "€" },
  { code: "PL", name: "ポーランド", nameEn: "Poland", nameZh: "波兰", currency: "PLN", symbol: "zł" },
  { code: "TN", name: "チュニジア", nameEn: "Tunisia", nameZh: "突尼斯", currency: "TND", symbol: "DT" },
  { code: "TR", name: "トルコ", nameEn: "Turkey", nameZh: "土耳其", currency: "TRY", symbol: "₺" },
];

interface CountryData {
  // country-presets.ts
  defaultTaxRate: number;
  defaultInflation: number;
  referenceRent: number;
  referenceLivingCost: number;
  notesJa: string;
  notesEn: string;
  notesZh: string;
  // housing-costs.ts (月額・現地通貨)
  singleRent: number;
  singleLiving: number;
  coupleRent: number;
  coupleLiving: number;
  familyRent: number;
  familyLiving: number;
  areaNote: string;
  // industry-salaries.ts (年収・現地通貨)
  salaryManufacturing: number;
  salaryIt: number;
  salaryFinance: number;
  salaryService: number;
  salaryRetail: number;
  salaryConstruction: number;
  salaryLogistics: number;
  salaryMedia: number;
  salaryInfrastructure: number;
}

async function fetchBlogContent(code: string): Promise<string> {
  const { data } = await supabase
    .from("blog_posts")
    .select("title, content")
    .eq("slug", `visa-${code.toLowerCase()}`)
    .single();

  if (!data) throw new Error(`Blog post visa-${code.toLowerCase()} not found`);
  const title = data.title?.ja ?? data.title?.en ?? "";
  const content = data.content?.ja ?? data.content?.en ?? "";
  return `【記事タイトル】${title}\n\n【記事本文】\n${content}`;
}

async function extractDataFromArticle(
  country: typeof MISSING_COUNTRIES[0],
  articleContent: string
): Promise<CountryData> {
  const prompt = `あなたは移住・ファイナンシャルデータの専門家です。以下の${country.name}のビザ・移住記事を読み、移住シミュレーターに必要なデータをJSON形式で返してください。

【重要ルール】
- 記事に明示されている数値は必ずそれを使用する
- 記事にない数値は、あなたの知識（2025-2026年時点）で補完する
- すべての金額は${country.currency}（現地通貨）で返す
- 月額ベースで返す（家賃・生活費）、年収は年額で返す
- 外国人プロフェッショナルが住む主要都市の相場を基準にする

${articleContent}

以下のJSON形式で回答してください（コードブロック不要）：
{
  "defaultTaxRate": 0.XX,
  "defaultInflation": 0.XX,
  "referenceRent": XXXXX,
  "referenceLivingCost": XXXXX,
  "notesJa": "税制の簡潔な説明（20文字以内）",
  "notesEn": "Brief tax note (under 20 chars)",
  "notesZh": "税制说明（20字以内）",
  "singleRent": XXXXX,
  "singleLiving": XXXXX,
  "coupleRent": XXXXX,
  "coupleLiving": XXXXX,
  "familyRent": XXXXX,
  "familyLiving": XXXXX,
  "areaNote": "主要都市・エリア名（例：ブリュッセル）",
  "salaryManufacturing": XXXXX,
  "salaryIt": XXXXX,
  "salaryFinance": XXXXX,
  "salaryService": XXXXX,
  "salaryRetail": XXXXX,
  "salaryConstruction": XXXXX,
  "salaryLogistics": XXXXX,
  "salaryMedia": XXXXX,
  "salaryInfrastructure": XXXXX
}`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  return JSON.parse(res.choices[0].message.content!) as CountryData;
}

async function factCheckData(
  country: typeof MISSING_COUNTRIES[0],
  articleContent: string,
  firstPassData: CountryData
): Promise<CountryData> {
  const prompt = `あなたは${country.name}の移住・生活費・税制に詳しい専門家です。以下の2つの情報を照合して、数値の正確性を検証してください。

【ブログ記事の内容】
${articleContent}

【シミュレーター用データ（第1次抽出）】
${JSON.stringify(firstPassData, null, 2)}

【ファクトチェックのルール】
- 記事の数値と一致しているか確認する
- あなたの知識（2025-2026年時点）と照らし合わせて明らかに誤りのある数値を修正する
- 税率・インフレ率は小数（例: 0.25 = 25%）
- 「確認できない」「インターネットにアクセスできない」などのメタコメントは絶対に書かないこと
- 修正済みのJSONのみを返してください

以下のJSON形式で回答してください（コードブロック不要）：
{
  "defaultTaxRate": 0.XX,
  "defaultInflation": 0.XX,
  "referenceRent": XXXXX,
  "referenceLivingCost": XXXXX,
  "notesJa": "税制の簡潔な説明（20文字以内）",
  "notesEn": "Brief tax note (under 20 chars)",
  "notesZh": "税制说明（20字以内）",
  "singleRent": XXXXX,
  "singleLiving": XXXXX,
  "coupleRent": XXXXX,
  "coupleLiving": XXXXX,
  "familyRent": XXXXX,
  "familyLiving": XXXXX,
  "areaNote": "主要都市・エリア名",
  "salaryManufacturing": XXXXX,
  "salaryIt": XXXXX,
  "salaryFinance": XXXXX,
  "salaryService": XXXXX,
  "salaryRetail": XXXXX,
  "salaryConstruction": XXXXX,
  "salaryLogistics": XXXXX,
  "salaryMedia": XXXXX,
  "salaryInfrastructure": XXXXX
}`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.1,
  });

  const result = JSON.parse(res.choices[0].message.content!) as CountryData;

  // メタコメント検出（念のため）
  const banned = ["確認できない", "アクセスできない", "申し訳"];
  const str = JSON.stringify(result);
  if (banned.some((p) => str.includes(p))) {
    console.warn(`  ⚠️ メタコメント検出 → 第1次データを使用`);
    return firstPassData;
  }

  return result;
}

function printTypeScript(
  country: typeof MISSING_COUNTRIES[0],
  d: CountryData
): void {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`【${country.name} (${country.code})】`);
  console.log(`${"=".repeat(60)}\n`);

  console.log(`// ── country-presets.ts に追加 ──`);
  console.log(`  {
    code: "${country.code}",
    name: { en: "${country.nameEn}", ja: "${country.name}", zh: "${country.nameZh}" },
    currency: "${country.currency}",
    currencySymbol: "${country.symbol}",
    defaultTaxRate: ${d.defaultTaxRate},
    defaultInflation: ${d.defaultInflation},
    referenceRent: ${d.referenceRent},
    referenceLivingCost: ${d.referenceLivingCost},
    notes: { en: "${d.notesEn}", ja: "${d.notesJa}", zh: "${d.notesZh}" },
  },`);

  console.log(`\n// ── housing-costs.ts に追加 ──`);
  console.log(`  ${country.code}: { // ${d.areaNote}
    single: { rent: ${d.singleRent.toLocaleString().replace(/,/g, "_").padStart(8)}, living: ${d.singleLiving.toLocaleString().replace(/,/g, "_").padStart(8)} },
    couple: { rent: ${d.coupleRent.toLocaleString().replace(/,/g, "_").padStart(8)}, living: ${d.coupleLiving.toLocaleString().replace(/,/g, "_").padStart(8)} },
    family: { rent: ${d.familyRent.toLocaleString().replace(/,/g, "_").padStart(8)}, living: ${d.familyLiving.toLocaleString().replace(/,/g, "_").padStart(8)} },
  },`);

  console.log(`\n// ── industry-salaries.ts に追加 ──`);
  console.log(`  ${country.code}: {
    manufacturing: ${d.salaryManufacturing},
    it:            ${d.salaryIt},
    finance:       ${d.salaryFinance},
    service:       ${d.salaryService},
    retail:        ${d.salaryRetail},
    construction:  ${d.salaryConstruction},
    logistics:     ${d.salaryLogistics},
    media:         ${d.salaryMedia},
    infrastructure:${d.salaryInfrastructure},
  },`);
}

async function run() {
  for (const country of MISSING_COUNTRIES) {
    console.log(`\n🔍 ${country.name} (${country.code}) を処理中...`);

    const article = await fetchBlogContent(country.code);
    console.log(`  ✅ 記事取得完了（${article.length}文字）`);

    console.log(`  🤖 第1次データ抽出...`);
    const firstPass = await extractDataFromArticle(country, article);

    console.log(`  🔍 第2次ファクトチェック...`);
    const verified = await factCheckData(country, article, firstPass);

    printTypeScript(country, verified);
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("✅ 全カ国のデータ生成完了。上記を各ファイルに追加してください。");
}

run().catch(console.error);

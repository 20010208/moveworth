import { existsSync, readFileSync } from "fs";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { runSimulation } from "../src/lib/simulation/basic-calculator";
import type { SimulationInput, SimulationResult } from "../src/lib/simulation/types";
import { sanitizeMoveWorthLinks } from "./utils/sanitize-links";

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
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// DRY_RUN=false を明示したときだけ公開、それ以外はすべてdraft
const DRY_RUN = process.env.DRY_RUN !== "false";

// ────────────────────────────────────────────────────
// 数値突合バリデーション
// ────────────────────────────────────────────────────

/**
 * SimulationResultから数値を再帰的に収集し、
 * 日本語記事で出現しうる丸め・表記バリエーションを事前展開する。
 */
function buildAllowedSet(result: SimulationResult): Set<number> {
  const expanded = new Set<number>();

  function addVariants(n: number) {
    if (!isFinite(n) || n === 0) return;
    // 原値 + 代表的な丸めティア
    const variants = [
      n,
      Math.round(n),
      Math.round(n / 10) * 10,
      Math.round(n / 100) * 100,
      Math.round(n / 1000) * 1000,
      Math.round(n / 10000) * 10000,         // 万単位
      Math.round(n / 100000) * 100000,
      Math.round(n / 1000000) * 1000000,     // 百万単位
      parseFloat(n.toFixed(1)),
      parseFloat(n.toFixed(2)),
    ];
    for (const v of variants) {
      if (v !== 0 && isFinite(v)) expanded.add(v);
    }
    // 小数（税率・利率など 0<n<1）→ %表示も追加（例: 0.15 → 15）
    const abs = Math.abs(n);
    if (abs > 0 && abs < 1) {
      addVariants(parseFloat((n * 100).toFixed(2)));
    }
    // 整数1〜100 → 小数率も追加（例: 15 → 0.15）
    if (abs >= 1 && abs <= 100 && Number.isInteger(n)) {
      expanded.add(parseFloat((n / 100).toFixed(4)));
    }
  }

  function walk(obj: unknown) {
    if (typeof obj === "number") {
      addVariants(obj);
    } else if (obj !== null && typeof obj === "object") {
      for (const v of Object.values(obj as Record<string, unknown>)) walk(v);
    }
  }

  walk(result);
  return expanded;
}

/**
 * 記事から数値を抽出し、allowedSetと照合する。
 * 違反（許容セットにない数値）があれば violations に積む。
 * ±1%のフォールバックを残しつつ、事前展開による完全一致を優先。
 */
function validateNumbers(
  content: string,
  result: SimulationResult,
): { valid: boolean; violations: string[] } {
  const allowed = buildAllowedSet(result);
  const violations: string[] = [];

  function check(value: number, context: string) {
    if (!isFinite(value) || value === 0) return;
    if (allowed.has(value)) return;
    // ±1% フォールバック
    for (const a of allowed) {
      if (a !== 0 && Math.abs(value - a) / Math.abs(a) <= 0.01) return;
    }
    violations.push(`「${context}」(${value}) がシミュレーション結果にありません`);
  }

  // 万単位（例: "523万" → 5,230,000）
  const manRe = /([\d,]+(?:\.\d+)?)万/g;
  let m;
  while ((m = manRe.exec(content)) !== null) {
    check(parseFloat(m[1].replace(/,/g, "")) * 10000, m[0]);
  }

  // 億単位（例: "1.2億" → 120,000,000）
  const okuRe = /([\d,]+(?:\.\d+)?)億/g;
  while ((m = okuRe.exec(content)) !== null) {
    check(parseFloat(m[1].replace(/,/g, "")) * 100000000, m[0]);
  }

  // %値（例: "42.5%" → 42.5）
  const pctRe = /(\d+(?:\.\d+)?)%/g;
  while ((m = pctRe.exec(content)) !== null) {
    check(parseFloat(m[1]), m[0]);
  }

  // 万/億/% を除去したあと残る大きな数値 (≥1000)
  const stripped = content
    .replace(/([\d,]+(?:\.\d+)?)万/g, "")
    .replace(/([\d,]+(?:\.\d+)?)億/g, "")
    .replace(/\d+(?:\.\d+)?%/g, "")
    .replace(/20\d{2}年/g, "")               // 西暦年を除外
    .replace(/第?\d+(?:章|節|段落|条|位|番)/g, ""); // 章番号等を除外

  const bareRe = /([\d]{1,3}(?:,[\d]{3})+(?:\.\d+)?|[\d]{4,}(?:\.\d+)?)/g;
  while ((m = bareRe.exec(stripped)) !== null) {
    const v = parseFloat(m[1].replace(/,/g, ""));
    if (v >= 1000) check(v, m[1]);
  }

  return { valid: violations.length === 0, violations };
}

// ────────────────────────────────────────────────────
// 記事生成
// ────────────────────────────────────────────────────

interface Persona {
  id: string;
  country_code: string;
  attribute: string;
  annual_income_jpy: number;
  family_type: string;
  goal: string;
  simulation_input: SimulationInput;
}

function buildPrompt(persona: Persona, result: SimulationResult): string {
  const sim = result;
  const input = sim.input;
  const yr5 = sim.yearlyResults[5];
  const yr10 = sim.yearlyResults[10];
  const mb = sim.monthlyBreakdown;

  const summaryJson = JSON.stringify({
    ペルソナ: {
      属性: persona.attribute,
      家族構成: persona.family_type,
      目標: persona.goal,
      移住先: persona.country_code,
      日本での年収_JPY: input.incomeCurrent,
      移住先での年収: `${input.incomeTarget} ${input.currencyTarget}`,
    },
    月間内訳_日本: {
      手取り月収_JPY: mb.current.income,
      家賃_JPY: mb.current.rent,
      生活費_JPY: mb.current.living,
      税社保_JPY: mb.current.tax,
      月間貯蓄_JPY: mb.current.savings,
    },
    月間内訳_移住後: {
      手取り月収: `${mb.target.income} ${input.currencyTarget}`,
      家賃: `${mb.target.rent} ${input.currencyTarget}`,
      生活費: `${mb.target.living} ${input.currencyTarget}`,
      税金: `${mb.target.tax} ${input.currencyTarget}`,
      月間貯蓄: `${mb.target.savings} ${input.currencyTarget}`,
    },
    資産推移_JPY換算: {
      初期貯蓄: input.currentSavings,
      "5年後_日本継続": Math.round(yr5.assetCurrent),
      "5年後_移住後": Math.round(yr5.assetTargetConverted),
      "10年後_日本継続": Math.round(yr10.assetCurrent),
      "10年後_移住後": Math.round(yr10.assetTargetConverted),
      "10年後差額_JPY": Math.round(sim.assetDifference),
    },
    年間貯蓄: {
      日本_JPY: Math.round(sim.annualSavingsCurrent),
      移住後_JPY換算: Math.round(sim.annualSavingsTarget * input.exchangeRate),
    },
    為替レート: `1 ${input.currencyTarget} = ${input.exchangeRate} JPY`,
    税率: { 日本: `${(input.taxRateCurrent * 100).toFixed(0)}%`, 移住先: `${(input.taxRateTarget * 100).toFixed(0)}%` },
    インフレ率: { 日本: `${(input.inflationCurrent * 100).toFixed(1)}%`, 移住先: `${(input.inflationTarget * 100).toFixed(1)}%` },
    運用利回り: `${(input.investmentReturn * 100).toFixed(0)}%`,
  }, null, 2);

  return `あなたはMoveWorthという海外移住シミュレーターサービスのブログライターです。

以下は、MoveWorthのシミュレーターに実際に入力した条件とその計算結果です。
この数値を使って、読者に有益なシミュレーション解説記事を書いてください。

【シミュレーション結果JSON】
${summaryJson}

【記事の絶対条件】
①記事の冒頭（タイトル直下・本文最初の段落）に必ず以下の文言を含めること：
  「この記事は架空のモデルケースに対するMoveWorthシミュレーション結果です。実在の人物・事例ではありません。」
②数値はJSONにあるものだけを使用すること。JSONにない数値を創作・推測・丸め(万単位は除く)することを禁止。
③「〇〇さん」「〇〇さんの場合」など実在人物を匂わせる表現を使わないこと。「このモデルケースでは」「シミュレーション上では」など客観的表現で統一すること。
④記事末尾に「あなたの条件で試す」CTAを設け、リンクを https://moveworthapp.com/simulate にすること。

【タイトル形式】
「シミュレーション：${persona.attribute}が${persona.country_code}に移住したら10年で資産はどうなるか」型を参考に、SEOを意識したタイトルにすること。「事例」「成功例」「体験談」「実体験」はタイトルから除外。

【記事構成の目安（1500〜2500文字）】
- ## 冒頭：免責・架空モデルケース明記
- ## ペルソナ設定（収入・家族構成・目標）
- ## 日本 vs ${persona.country_code}：月間キャッシュフロー比較
- ## 5年後・10年後の資産推移
- ## この結果から読み取れること（税・生活費・為替の影響）
- ## まとめ＋CTA

JSONのみ返してください（コードブロック不要）:
{
  "title": "SEO最適化タイトル（60文字以内）",
  "description": "メタディスクリプション（120〜160文字）",
  "content": "記事本文（マークダウン形式）"
}`;
}

function generateSlug(countryCode: string, attribute: string): string {
  const year = new Date().getFullYear();
  const attrSlug = attribute
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return `simulator-${countryCode.toLowerCase()}-${attrSlug}-${year}`.replace(/-{2,}/g, "-");
}

async function run() {
  console.log(`Mode: ${DRY_RUN ? "DRY-RUN (draft)" : "PUBLISH"}`);

  // 未使用ペルソナを1件取得
  const { data: personas, error: fetchErr } = await supabase
    .from("simulator_personas")
    .select("*")
    .is("used_at", null)
    .order("created_at", { ascending: true })
    .limit(1);

  if (fetchErr || !personas?.length) {
    console.error("未使用ペルソナが見つかりません:", fetchErr?.message ?? "空");
    process.exit(1);
  }
  const persona = personas[0] as Persona;
  console.log(`Persona: ${persona.country_code} / ${persona.attribute} / ${persona.goal}`);

  // シミュレーター実行（フロントエンドと同一ロジック）
  const result = runSimulation(persona.simulation_input);
  console.log(`Simulation done: 10yr asset diff = ${Math.round(result.assetDifference).toLocaleString()} JPY`);

  // GPT-4o で記事生成
  const prompt = buildPrompt(persona, result);
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.5,  // 創作抑制のため低め
  });

  const generated = JSON.parse(response.choices[0].message.content!);
  const { title, description } = generated;
  const content = sanitizeMoveWorthLinks(generated.content as string);

  // ────────────────────────────────────────────────────
  // 数値突合バリデーション（必須）
  // ────────────────────────────────────────────────────
  console.log("Validating numbers...");
  const { valid, violations } = validateNumbers(content, result);

  if (!valid) {
    console.error("❌ 数値突合失敗 — insertをスキップします");
    console.error(`  違反件数: ${violations.length}`);
    for (const v of violations) {
      console.error(`  • ${v}`);
    }
    console.error("\n生成記事に含まれていたシミュレーション外の数値を修正または再生成してください。");
    process.exit(1);
  }

  console.log("✅ 数値突合OK");

  // 冒頭の免責文言チェック
  if (!content.includes("架空のモデルケース")) {
    console.error("❌ 冒頭に「架空のモデルケース」の文言がありません。insertをスキップします。");
    process.exit(1);
  }

  // Supabase insert
  const slug = generateSlug(persona.country_code, persona.attribute);
  const today = new Date().toISOString().split("T")[0];

  const { error: insertErr } = await supabase.from("blog_posts").insert({
    slug,
    category: "simulator",
    published_at: today,
    reading_minutes: 8,
    thumbnail: null,
    title: { ja: title, en: title, zh: title },
    description: { ja: description, en: description, zh: description },
    content: { ja: content, en: content, zh: content },
    locales: ["ja"],
    pinned: false,
    is_published: !DRY_RUN,  // DRY_RUN=falseのときだけ公開
  });

  if (insertErr) {
    console.error("Insert failed:", insertErr.message);
    process.exit(1);
  }

  // ペルソナを使用済みにマーク
  await supabase
    .from("simulator_personas")
    .update({ used_at: new Date().toISOString(), blog_post_slug: slug })
    .eq("id", persona.id);

  const status = DRY_RUN ? "Draft saved" : "Published";
  console.log(`✅ ${status}: ${slug}`);
  if (DRY_RUN) {
    console.log("  → Supabaseダッシュボードで内容を確認後、is_published=trueに変更してください。");
  }
}

run();

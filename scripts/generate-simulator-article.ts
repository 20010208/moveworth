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
 * SimulationResult と summaryObj から数値を再帰的に収集し、
 * 日本語記事で出現しうる丸め・表記バリエーションを事前展開する。
 */
function buildAllowedSet(result: SimulationResult, summaryObj?: unknown): Set<number> {
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
  if (summaryObj !== undefined) walk(summaryObj);
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
  summaryObj?: unknown,
): { valid: boolean; violations: string[] } {
  const allowed = buildAllowedSet(result, summaryObj);
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

/**
 * プロンプト用 summaryObj を構築する。
 * ここに含まれるすべての数値が buildAllowedSet に渡され、記事の数値突合に使用される。
 * GPT が自力計算しなくて済むよう、月次・年次・JPY換算を全量事前展開する。
 */
function buildSummaryObj(persona: Persona, result: SimulationResult) {
  const input = result.input;
  const yr5 = result.yearlyResults[5];
  const yr10 = result.yearlyResults[10];
  const mb = result.monthlyBreakdown;
  const r = input.exchangeRate;

  const incomePreset =
    persona.attribute.includes("管理職")
      ? "金融業（外国人プロフェッショナル参考値）×1.5（管理職＋パートナー合算）"
      : persona.attribute.includes("夫婦")
      ? "IT・情報通信業（外国人プロフェッショナル参考値）×1.5（世帯合算）"
      : "IT・情報通信業（外国人プロフェッショナル参考値）";

  return {
    ペルソナ: {
      属性: persona.attribute,
      家族構成: persona.family_type,
      目標: persona.goal,
      移住先: persona.country_code,
      日本年収_JPY: input.incomeCurrent,
      移住先年収_現地: input.incomeTarget,
      移住先年収_JPY換算: Math.round(input.incomeTarget * r),
    },
    データソース: {
      現地年収: incomePreset,
      家賃_生活費: "MoveWorthシミュレーター国別プリセット値（referenceRent / referenceLivingCost）",
      税率_インフレ: "MoveWorthシミュレーター国別プリセット値（defaultTaxRate / defaultInflation）",
    },
    月間内訳_注記: "月収・税額は入力年収（昇給前）÷12の値。月間貯蓄は1年目時点の値（昇給2%・インフレ率を反映したシミュレーション値）",
    月間内訳_日本: {
      月収_税引前_JPY: Math.round(input.incomeCurrent / 12),
      税額_JPY: mb.current.tax,
      月収_税引後_JPY: Math.round(input.incomeCurrent * (1 - input.taxRateCurrent) / 12),
      家賃_JPY: mb.current.rent,
      生活費_JPY: mb.current.living,
      月間貯蓄_JPY_1年目: mb.current.savings,
    },
    月間内訳_移住後: {
      月収_税引前_現地: Math.round(input.incomeTarget / 12),
      月収_税引前_JPY換算: Math.round(input.incomeTarget / 12 * r),
      税額_現地: mb.target.tax,
      税額_JPY換算: Math.round(mb.target.tax * r),
      月収_税引後_現地: Math.round(input.incomeTarget * (1 - input.taxRateTarget) / 12),
      月収_税引後_JPY換算: Math.round(input.incomeTarget * (1 - input.taxRateTarget) / 12 * r),
      家賃_現地: mb.target.rent,
      家賃_JPY換算: Math.round(mb.target.rent * r),
      生活費_現地: mb.target.living,
      生活費_JPY換算: Math.round(mb.target.living * r),
      月間貯蓄_現地_1年目: mb.target.savings,
      月間貯蓄_JPY換算_1年目: Math.round(mb.target.savings * r),
    },
    資産推移_JPY換算: {
      初期貯蓄: input.currentSavings,
      "5年後_日本継続": Math.round(yr5.assetCurrent),
      "5年後_移住後": Math.round(yr5.assetTargetConverted),
      "5年後_差額": Math.round(yr5.assetTargetConverted - yr5.assetCurrent),
      "10年後_日本継続": Math.round(yr10.assetCurrent),
      "10年後_移住後": Math.round(yr10.assetTargetConverted),
      "10年後_差額_JPY": Math.round(result.assetDifference),
    },
    年間貯蓄: {
      日本_JPY: Math.round(result.annualSavingsCurrent),
      移住後_現地: Math.round(result.annualSavingsTarget),
      移住後_JPY換算: Math.round(result.annualSavingsTarget * r),
    },
    為替: {
      レート: r,
      単位: `1 ${input.currencyTarget} = ${r} JPY`,
    },
    税率: {
      日本_数値: input.taxRateCurrent,
      日本_パーセント: parseFloat((input.taxRateCurrent * 100).toFixed(1)),
      移住先_数値: input.taxRateTarget,
      移住先_パーセント: parseFloat((input.taxRateTarget * 100).toFixed(1)),
    },
    インフレ率: {
      日本_数値: input.inflationCurrent,
      日本_パーセント: parseFloat((input.inflationCurrent * 100).toFixed(1)),
      移住先_数値: input.inflationTarget,
      移住先_パーセント: parseFloat((input.inflationTarget * 100).toFixed(1)),
    },
    運用利回り_数値: input.investmentReturn,
    運用利回り_パーセント: parseFloat((input.investmentReturn * 100).toFixed(1)),
  } as const;
}

function buildPrompt(persona: Persona, summaryObj: ReturnType<typeof buildSummaryObj>): string {
  const summaryJson = JSON.stringify(summaryObj, null, 2);

  return `あなたはMoveWorthという海外移住シミュレーターサービスのブログライターです。

以下は、MoveWorthのシミュレーターに実際に入力した条件とその計算結果です。
この数値を使って、読者に有益なシミュレーション解説記事を書いてください。

【シミュレーション結果JSON】
${summaryJson}

【記事の絶対条件】
①記事の冒頭（タイトル直下・本文最初の段落）に必ず以下の文言を含めること：
  「この記事は架空のモデルケースに対するMoveWorthシミュレーション結果です。実在の人物・事例ではありません。」
②記事に登場するすべての数値はJSONにある値のみを使用すること。自分では一切計算しないこと（通貨換算・月割り・年割り・差し引き計算もすべて禁止）。万円表示は「JSONの値 ÷ 10000 万円」の形でのみ許容。
③「〇〇さん」「〇〇さんの場合」など実在人物を匂わせる表現を使わないこと。「このモデルケースでは」「シミュレーション上では」など客観的表現で統一すること。
④記事末尾に「あなたの条件で試す」CTAを設け、リンクを https://moveworthapp.com/simulate にすること。
⑤ペルソナ設定セクションに「現地年収は本シミュレーターの業種別参考値（外国人プロフェッショナル基準）、家賃・生活費・税率は本シミュレーターの国別プリセット値を使用」と一文明記すること（読者が自分の条件との差分を把握できるようにするため）。
⑥このシミュレーションに含まれない費用として「海外医療保険・民間医療保険料、私的年金・確定拠出年金の掛金、一時帰国費用、子女教育費（インターナショナルスクール等）、ビザ取得・更新費用」がある旨を記事中に1箇所明記すること。これらを考慮すると実際の手取り資産はシミュレーション値より少なくなる可能性がある旨も添えること。
⑦月間内訳の数値は「月収・税額 = 入力年収の単純月割り値、月間貯蓄 = シミュレーション1年目時点（昇給率2%・インフレ率を反映）の値」であることを記事内で一言明記すること。

【タイトル形式】
「シミュレーション：${persona.attribute}が${persona.country_code}に移住したら10年で資産はどうなるか」型を参考に、SEOを意識したタイトルにすること。「事例」「成功例」「体験談」「実体験」はタイトルから除外。

【記事構成の目安（1500〜2500文字）】
以下の内容を含む6セクションで構成すること。
見出し（##）は読者向けの自然な文言で書くこと（以下のトピックラベルをそのままセクション名に使用してはいけない）：
1. 免責・架空モデルケースの明示を含む冒頭（読者が状況をイメージできる書き出し）
2. ペルソナ設定（収入・家族構成・目標・前提条件）
3. 日本 vs ${persona.country_code}の月間キャッシュフロー比較
4. 5年後・10年後の資産推移
5. 税・生活費・為替がもたらす影響の分析
6. 締め括りと「あなたの条件で試す」CTAへの誘導

JSONのみ返してください（コードブロック不要）:
{
  "title": "SEO最適化タイトル（60文字以内）",
  "description": "メタディスクリプション（120〜160文字）",
  "content": "記事本文（マークダウン形式）"
}`;
}

async function translateArticle(
  ja: { title: string; description: string; content: string },
  lang: "en" | "zh",
): Promise<{ title: string; description: string; content: string }> {
  const target = lang === "en" ? "English" : "Chinese (Simplified)";
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: `Translate the following JSON from Japanese to ${target}.
Rules:
- Translate ALL Japanese text, including headings and the disclaimer heading on the first line
- The first heading (disclaimer) MUST be translated; it must NOT remain in Japanese
- Keep ALL numbers, digits, percentages, currency values exactly as-is
- Keep ALL URLs exactly as-is (do not translate or modify https://moveworthapp.com/simulate)
- Keep ALL markdown formatting (##, **, etc.) exactly as-is
- Return the same JSON structure with exactly these keys: title, description, content

${JSON.stringify({ title: ja.title, description: ja.description, content: ja.content }, null, 2)}

Return JSON only (no code blocks).`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });
  const result = JSON.parse(response.choices[0].message.content!);
  return {
    title: result.title ?? ja.title,
    description: result.description ?? ja.description,
    content: result.content ?? ja.content,
  };
}

function validateTranslation(
  content: string,
  lang: "en" | "zh",
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];

  // 免責文言チェック
  const hasDisclaimer =
    lang === "en"
      ? content.includes("fictional model case")
      : content.includes("虚构");
  if (!hasDisclaimer) {
    violations.push(
      lang === "en"
        ? 'EN: 免責文言 "fictional model case" が見つかりません'
        : 'ZH: 免責文言 "虚构" が見つかりません',
    );
  }

  // CTAリンクチェック
  if (!content.includes("https://moveworthapp.com/simulate")) {
    violations.push(`${lang.toUpperCase()}: CTAリンク https://moveworthapp.com/simulate が見つかりません`);
  }

  return { valid: violations.length === 0, violations };
}

function generateSlug(countryCode: string, attribute: string): string {
  const year = new Date().getFullYear();
  const attrMap: Record<string, string> = {
    "30代エンジニア・単身": "eng-single",
    "30代夫婦・共働き": "couple",
    "40代管理職・夫婦": "mgr-couple",
  };
  const attrSlug = attrMap[attribute] ?? attribute.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `simulator-${countryCode.toLowerCase()}-${attrSlug}-${year}`;
}

async function run() {
  console.log(`Mode: ${DRY_RUN ? "DRY-RUN (draft)" : "PUBLISH"}`);

  // 未使用ペルソナを1件取得（PERSONA_IDで特定ペルソナを指定可）
  const PERSONA_ID = process.env.PERSONA_ID;
  let personaQuery = supabase.from("simulator_personas").select("*").is("used_at", null);
  if (PERSONA_ID) {
    personaQuery = personaQuery.eq("id", PERSONA_ID);
  } else {
    personaQuery = personaQuery.order("created_at", { ascending: true }).limit(1);
  }
  const { data: personas, error: fetchErr } = await personaQuery.limit(1);

  if (fetchErr || !personas?.length) {
    console.error("未使用ペルソナが見つかりません:", fetchErr?.message ?? "空");
    process.exit(1);
  }
  const persona = personas[0] as Persona;
  console.log(`Persona: ${persona.country_code} / ${persona.attribute} / ${persona.goal}`);

  // シミュレーター実行（フロントエンドと同一ロジック）
  const result = runSimulation(persona.simulation_input);
  console.log(`Simulation done: 10yr asset diff = ${Math.round(result.assetDifference).toLocaleString()} JPY`);

  // summaryObj を一度だけ構築 → プロンプトと allowedSet の両方で共有
  const summaryObj = buildSummaryObj(persona, result);

  // GPT-4o で記事生成
  const prompt = buildPrompt(persona, summaryObj);
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.5,  // 創作抑制のため低め
  });

  const generated = JSON.parse(response.choices[0].message.content!);
  const { title: titleJa, description: descJa } = generated;
  const contentJa = sanitizeMoveWorthLinks(generated.content as string);

  // ────────────────────────────────────────────────────
  // 数値突合バリデーション（日本語版のみ、必須）
  // ────────────────────────────────────────────────────
  console.log("Validating numbers (JA)...");
  const { valid, violations } = validateNumbers(contentJa, result, summaryObj);

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
  if (!contentJa.includes("架空のモデルケース")) {
    console.error("❌ 冒頭に「架空のモデルケース」の文言がありません。insertをスキップします。");
    process.exit(1);
  }

  // ────────────────────────────────────────────────────
  // EN / ZH 翻訳（JA検証通過後に並列実行）
  // ────────────────────────────────────────────────────
  console.log("Translating to EN and ZH...");
  const jaArticle = { title: titleJa, description: descJa, content: contentJa };
  const [enArticle, zhArticle] = await Promise.all([
    translateArticle(jaArticle, "en"),
    translateArticle(jaArticle, "zh"),
  ]);
  const contentEn = sanitizeMoveWorthLinks(enArticle.content);
  const contentZh = sanitizeMoveWorthLinks(zhArticle.content);
  console.log("✅ 翻訳完了 (EN / ZH)");

  // 翻訳版の軽量バリデーション（免責文言・CTAリンク）
  const enCheck = validateTranslation(contentEn, "en");
  const zhCheck = validateTranslation(contentZh, "zh");
  const translationViolations = [...enCheck.violations, ...zhCheck.violations];
  if (translationViolations.length > 0) {
    console.error("❌ 翻訳バリデーション失敗 — insertをスキップします");
    for (const v of translationViolations) console.error(`  • ${v}`);
    process.exit(1);
  }
  console.log("✅ 翻訳バリデーションOK (EN / ZH)");

  // Supabase insert
  const slug = generateSlug(persona.country_code, persona.attribute);
  const today = new Date().toISOString().split("T")[0];

  const { error: insertErr } = await supabase.from("blog_posts").insert({
    slug,
    category: "simulator",
    published_at: today,
    reading_minutes: 8,
    thumbnail: null,
    title: { ja: titleJa, en: enArticle.title, zh: zhArticle.title },
    description: { ja: descJa, en: enArticle.description, zh: zhArticle.description },
    content: { ja: contentJa, en: contentEn, zh: contentZh },
    locales: ["ja", "en", "zh"],
    pinned: false,
    is_published: !DRY_RUN,
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

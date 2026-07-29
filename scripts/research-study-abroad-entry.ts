/**
 * study-abroad.ts（留学サイトシミュレーターの静的データ）へ追加する国エントリの
 * 調査支援スクリプト。
 *
 * 位置づけ:
 *   - study-abroad.ts はDBテーブルではなく静的TypeScriptソースファイルであり、
 *     simulator_personas（移住サイト側）のような自動DB追加はできない
 *   - 学費（tuition）データは country_sources に対応する一次情報カテゴリが無く、
 *     人気都市・大学・overview・tips・japaneseInfo も同様に執筆が必要なため、
 *     このスクリプトは「完全自動追加」ではなく「調査結果を人間が確認・完成させる
 *     ための下書き（TODOプレースホルダー付き）を作成する」ことのみを行う
 *   - study-abroad.ts への書き込み・git commitは一切行わない
 *
 * 処理内容:
 *   1. 直近の最新 draft visa-{code}（publish-visa-next.ts が次に公開する可能性が
 *      高いもの）を対象国として特定する
 *   2. study-abroad.ts に既に登録済みならスキップ
 *   3. country-presets.ts の referenceLivingCost から costs.livingMin/Max を算出
 *      （明記された係数による導出であり、独自の一次情報取得は行わない）
 *   4. country_sources（purpose IN visa,study かつ status=alive）に登録済みの
 *      公式ソースのみを取得し、student visa 要件・費用・期間等を
 *      「本文に明記されている内容のみ抽出、記載がなければTODO」という
 *      プロンプトでGPTに抽出させる（モデル知識による補完は禁止）
 *   5. tuition・popularCities・popularUniversities・overview・tips・japaneseInfo は
 *      対応する一次情報カテゴリが存在しないため常にTODOのまま出力する
 *   6. 結果レポート（study-abroad.tsへの追記コード案含む）をOS一時ディレクトリの
 *      ファイルへ書き出す（GHA側でIssue化する想定。DRY_RUN=trueならOpenAI呼び出しを
 *      スキップしソース取得状況のみ確認できる）
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? "" });

const DRY_RUN = process.env.DRY_RUN === "true";
// CLI引数で国コードを直接指定した場合はそちらを優先する（手動調査・動作確認用）
const forceCode = process.argv.slice(2).find((a) => !a.startsWith("--")) ?? null;
const REPORT_PATH = join(tmpdir(), "study-abroad-research-report.md");
const TARGET_CODE_PATH = join(tmpdir(), "study-abroad-research-target.txt");
const MAX_SOURCES = 5;
const FETCH_TIMEOUT_MS = 15_000;
const MAX_CHARS_PER_SOURCE = 4000;

const TODO = "TODO: 一次情報から未取得（要人手調査）";

// ─── HTML取得（簡易版・Waybackフォールバックなし） ────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchPageText(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MoveWorthBot/1.0)" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("html") && !ct.includes("text")) return null;
    const text = stripHtml(await res.text());
    return text.length < 200 ? null : text.slice(0, MAX_CHARS_PER_SOURCE);
  } catch {
    clearTimeout(timer);
    return null;
  }
}

// ─── 対象国の特定 ─────────────────────────────────────────────────────────────

async function getTargetCode(): Promise<string | null> {
  const { data, error } = await sb
    .from("blog_posts")
    .select("slug, created_at")
    .like("slug", "visa-%")
    .eq("is_published", false)
    .order("created_at", { ascending: false })
    .limit(1);
  if (error || !data || data.length === 0) return null;
  return data[0].slug.replace("visa-", "");
}

// ─── country-presets.ts / study-abroad.ts 参照 ────────────────────────────────

async function getCountryPreset(code: string) {
  const { countryPresets } = await import("../src/data/country-presets.js").catch(
    () => import("../src/data/country-presets")
  );
  const arr = countryPresets as Array<{
    code: string;
    name: { ja: string; en: string; zh?: string };
    currency: string;
    currencySymbol: string;
    referenceLivingCost: number;
  }>;
  return arr.find((p) => p.code.toLowerCase() === code.toLowerCase()) ?? null;
}

async function isAlreadyInStudyAbroad(code: string): Promise<boolean> {
  const { studyAbroadData } = await import("../src/data/study-abroad.js").catch(
    () => import("../src/data/study-abroad")
  );
  return Boolean((studyAbroadData as Record<string, unknown>)[code.toUpperCase()]);
}

// ─── country_sources 取得 ─────────────────────────────────────────────────────

type SourceRow = { url: string; purpose: string };

async function getAliveSources(code: string): Promise<SourceRow[]> {
  const { data, error } = await sb
    .from("country_sources")
    .select("url, purpose")
    .eq("country_code", code.toLowerCase())
    .in("purpose", ["visa", "study"])
    .eq("status", "alive")
    .limit(MAX_SOURCES);
  if (error || !data) return [];
  return data;
}

// ─── GPT抽出（本文明記のみ・TODO許容） ─────────────────────────────────────────

interface ExtractedVisa {
  name: { ja: string; en: string; zh: string };
  requirements: { ja: string; en: string; zh: string }; // 箇条書きを改行区切りの1文字列で保持
  duration: { ja: string; en: string; zh: string };
  cost: { ja: string; en: string; zh: string };
}

async function extractStudentVisaInfo(
  countryNameEn: string,
  sourcesText: string
): Promise<ExtractedVisa | null> {
  if (!sourcesText.trim()) return null;

  const prompt = `あなたは公式情報の抽出のみを行うアシスタントです。以下は${countryNameEn}の公式機関（移民局・大使館・教育省等）のWebページ本文です。

## 厳守事項
- 本文に明記されている内容のみを抽出すること
- モデルの一般知識で補完・推測してはならない
- 本文に記載がない項目は、値として正確に文字列 "${TODO}" を返すこと
- 創作・要約以上の内容追加は禁止

## 抽出したい項目（学生ビザに関するもの）
- name: ビザの正式名称
- requirements: 必要書類・要件（複数ある場合は改行区切りの1つの文字列）
- duration: 有効期間・滞在可能期間
- cost: 申請費用

## 出力形式（JSONのみ、他のテキスト不要）
{
  "name": "...",
  "requirements": "...",
  "duration": "...",
  "cost": "..."
}

## 公式ページ本文
${sourcesText.slice(0, 12000)}
`;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 800,
      response_format: { type: "json_object" },
    });
    const raw = res.choices[0].message.content ?? "{}";
    const parsed = JSON.parse(raw) as { name?: string; requirements?: string; duration?: string; cost?: string };
    const val = (v: string | undefined) => (v && v.trim() ? v.trim() : TODO);
    return {
      name: { ja: TODO, en: val(parsed.name), zh: TODO },
      requirements: { ja: TODO, en: val(parsed.requirements), zh: TODO },
      duration: { ja: TODO, en: val(parsed.duration), zh: TODO },
      cost: { ja: TODO, en: val(parsed.cost), zh: TODO },
    };
  } catch (e) {
    console.error("  ⚠️ GPT抽出失敗:", (e as Error).message);
    return null;
  }
}

// ─── study-abroad.ts 追記コード生成 ────────────────────────────────────────────

function toTsString(v: string): string {
  return JSON.stringify(v);
}

function generateEntryCode(
  code: string,
  livingMin: number,
  livingMax: number,
  currency: string,
  currencySymbol: string,
  visa: ExtractedVisa | null
): string {
  const v = visa ?? {
    name: { ja: TODO, en: TODO, zh: TODO },
    requirements: { ja: TODO, en: TODO, zh: TODO },
    duration: { ja: TODO, en: TODO, zh: TODO },
    cost: { ja: TODO, en: TODO, zh: TODO },
  };

  return `  ${code.toUpperCase()}: {
    code: ${toTsString(code.toUpperCase())},
    overview: { ja: ${toTsString(TODO)}, en: ${toTsString(TODO)}, zh: ${toTsString(TODO)} },
    studentVisa: {
      name: { ja: ${toTsString(v.name.ja)}, en: ${toTsString(v.name.en)}, zh: ${toTsString(v.name.zh)} },
      requirements: {
        ja: [${toTsString(v.requirements.ja)}],
        en: [${toTsString(v.requirements.en)}],
        zh: [${toTsString(v.requirements.zh)}],
      },
      duration: { ja: ${toTsString(v.duration.ja)}, en: ${toTsString(v.duration.en)}, zh: ${toTsString(v.duration.zh)} },
      cost: { ja: ${toTsString(v.cost.ja)}, en: ${toTsString(v.cost.en)}, zh: ${toTsString(v.cost.zh)} },
    },
    costs: {
      tuitionMin: 0, // ${TODO}（教育省・大学連盟等の公式統計が必要。country_sourcesに該当purposeカテゴリなし）
      tuitionMax: 0, // ${TODO}
      livingMin: ${livingMin}, // country-presets.ts referenceLivingCost(${currency}建て)から算出
      livingMax: ${livingMax}, // 同上
      currency: ${toTsString(currency)},
      currencySymbol: ${toTsString(currencySymbol)},
    },
    popularCities: { ja: [${toTsString(TODO)}], en: [${toTsString(TODO)}], zh: [${toTsString(TODO)}] },
    popularUniversities: { ja: [${toTsString(TODO)}], en: [${toTsString(TODO)}], zh: [${toTsString(TODO)}] },
    tips: { ja: [${toTsString(TODO)}], en: [${toTsString(TODO)}], zh: [${toTsString(TODO)}] },
    japaneseInfo: { ja: ${toTsString(TODO)}, en: ${toTsString(TODO)}, zh: ${toTsString(TODO)} },
  },`;
}

// ─── メイン処理 ───────────────────────────────────────────────────────────────

async function main() {
  console.log(`=== study-abroad.ts 調査支援スクリプト ${DRY_RUN ? "(DRY_RUN)" : ""} ===\n`);

  const code = forceCode ?? (await getTargetCode());
  if (!code) {
    console.log("⏭ draft visa-{code} が見つかりません → 対象なし、終了します");
    return;
  }
  if (forceCode) {
    console.log(`対象国コード（CLI引数で指定）: ${code}\n`);
  } else {
    console.log(`対象国コード（最新draft visa由来、次回月曜公開の可能性あり）: ${code}`);
    console.log("※ auto-country.ymlが翌日曜に新しいdraftを生成すると対象が変わる可能性があります\n");
  }

  if (await isAlreadyInStudyAbroad(code)) {
    console.log(`✅ study-abroad.ts に ${code.toUpperCase()} は既に登録済みです → 対象なし、終了します`);
    return;
  }

  const preset = await getCountryPreset(code);
  if (!preset) {
    console.log(`⚠️ country-presets.ts に ${code} が未登録のため、livingMin/Maxを算出できません`);
  }
  const livingMin = preset ? Math.round(preset.referenceLivingCost) : 0;
  const livingMax = preset ? Math.round(preset.referenceLivingCost * 1.5) : 0;
  const currency = preset?.currency ?? TODO;
  const currencySymbol = preset?.currencySymbol ?? TODO;
  const countryNameEn = preset?.name.en ?? code.toUpperCase();

  console.log(`livingMin/Max（referenceLivingCost基準の算出値）: ${livingMin} 〜 ${livingMax} ${currency}\n`);

  const sources = await getAliveSources(code);
  console.log(`country_sources（purpose=visa,study・status=alive）: ${sources.length}件`);
  for (const s of sources) console.log(`  - [${s.purpose}] ${s.url}`);

  let visa: ExtractedVisa | null = null;
  const fetchedTexts: string[] = [];

  if (sources.length === 0) {
    console.log("\n⚠️ 有効な一次情報ソースが未登録のため、studentVisa項目も全てTODOになります");
  } else if (DRY_RUN) {
    console.log("\n*** DRY_RUN: OpenAI抽出はスキップします（ソース存在確認のみ） ***");
  } else {
    console.log("\n公式ソースを取得中...");
    for (const s of sources) {
      const text = await fetchPageText(s.url);
      if (text) {
        console.log(`  ✅ 取得成功: ${s.url} (${text.length}字)`);
        fetchedTexts.push(text);
      } else {
        console.log(`  ❌ 取得失敗/低品質: ${s.url}`);
      }
    }
    if (fetchedTexts.length > 0) {
      console.log("\nGPTで抽出中（本文に明記された内容のみ）...");
      visa = await extractStudentVisaInfo(countryNameEn, fetchedTexts.join("\n\n---\n\n"));
    }
  }

  const entryCode = generateEntryCode(code, livingMin, livingMax, currency, currencySymbol, visa);

  const filledFields: string[] = ["code", "currency", "currencySymbol", "costs.livingMin", "costs.livingMax"];
  const todoFields: string[] = [
    "overview", "costs.tuitionMin", "costs.tuitionMax",
    "popularCities", "popularUniversities", "tips", "japaneseInfo",
  ];
  // visaオブジェクトの有無ではなく、各フィールドの値が実際にTODOセンチネルかどうかで判定する
  // （GPTが「本文に記載なし」と正しく判断してTODOを返した場合を「取得済み」と誤表示しないため）
  const visaFieldChecks: [string, string | undefined][] = visa
    ? [
        ["studentVisa.name(en)", visa.name.en],
        ["studentVisa.requirements(en)", visa.requirements.en],
        ["studentVisa.duration(en)", visa.duration.en],
        ["studentVisa.cost(en)", visa.cost.en],
      ]
    : [];
  for (const [label, value] of visaFieldChecks) {
    if (value && value !== TODO) {
      filledFields.push(label);
    } else {
      todoFields.push(label);
    }
  }
  const anyVisaFieldFilled = visaFieldChecks.some(([, value]) => value && value !== TODO);
  if (anyVisaFieldFilled) {
    todoFields.push("studentVisa.*(ja/zh — en取得済みの項目の翻訳が必要)");
  } else if (!visa) {
    todoFields.push("studentVisa.*");
  }

  const report = `# study-abroad.ts 調査レポート: ${code.toUpperCase()}

生成日時: ${new Date().toISOString()}

## 対象国
${countryNameEn}（${code.toUpperCase()}） — ${
    forceCode
      ? "CLI引数で手動指定"
      : "最新のdraft visa記事より特定（次回月曜公開の候補。auto-country.ymlの翌日曜実行により対象が変わる可能性あり）"
  }

## 取得できた項目
${filledFields.map((f) => `- ${f}`).join("\n")}

## TODOのまま残った項目
${todoFields.map((f) => `- ${f}`).join("\n")}

## 参照した一次情報ソース
${sources.length > 0 ? sources.map((s) => `- [${s.purpose}] ${s.url}`).join("\n") : "（登録済みソースなし）"}

## study-abroad.ts に追記するコード案（自動書き込みはしていません。人手で確認の上、TODOを埋めてから追加してください）

\`\`\`ts
${entryCode}
\`\`\`

---
※ 学費（tuitionMin/Max）・人気都市・大学・overview・tips・japaneseInfoは、country_sourcesに対応する一次情報カテゴリ（教育省統計・観光局等）が現状登録されていないため、このスクリプトでは取得できません。別途一次情報の登録・調査が必要です（BL-20260728-02参照）。
`;

  writeFileSync(REPORT_PATH, report, "utf-8");
  writeFileSync(TARGET_CODE_PATH, code.toUpperCase(), "utf-8");
  console.log(`\n✅ レポート出力完了: ${REPORT_PATH}`);
  console.log(report);
}

main().catch((e) => {
  console.error("❌", e.message ?? e);
  process.exit(1);
});

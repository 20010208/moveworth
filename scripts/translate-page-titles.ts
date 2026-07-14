/**
 * country_sources の page_title_original を GPT で ja/en/zh に翻訳し、
 * page_title_ja / page_title_en / page_title_zh を更新する。
 *
 * 使い方:
 *   npx tsx scripts/translate-page-titles.ts             # 未翻訳のみ処理
 *   npx tsx scripts/translate-page-titles.ts --re-translate # 全件再翻訳
 *   npx tsx scripts/translate-page-titles.ts --dry-run   # DB 更新なし（コスト確認）
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import OpenAI from "openai";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const DRY_RUN      = process.argv.includes("--dry-run");
const RE_TRANSLATE = process.argv.includes("--re-translate");
const MODEL        = "gpt-4o-mini";
const BATCH_SIZE   = 20;  // 1 API 呼び出しあたりの件数

const SYSTEM_PROMPT = `あなたは政府機関ページのタイトル翻訳の専門家です。
以下のルールに厳密に従ってください:
- タイトルを日本語・英語・中国語（簡体字）に翻訳する
- 意訳・要約・情報の追加は禁止。タイトルとして自然な直訳のみ
- 機関名の定訳があれば使う（例: IRAS → シンガポール内国歳入庁、IRCC → カナダ移民・難民・市民権省）
- 元が英語なら en はそのままコピー（翻訳不要）
- 出力は JSON 配列のみ。余分な説明や markdown コードブロックは不要

入力: JSON 配列 [{id, title, lang}]
出力: JSON 配列 [{id, ja, en, zh}]`;

interface TitleRow {
  id: string;
  page_title_original: string;
  page_lang: string | null;
}

interface TranslationResult {
  id: string;
  ja: string;
  en: string;
  zh: string;
}

async function translateBatch(rows: TitleRow[]): Promise<TranslationResult[]> {
  const input = rows.map(r => ({
    id: r.id,
    title: r.page_title_original,
    lang: r.page_lang ?? "en",
  }));

  const resp = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(input) },
    ],
    temperature: 0.1,
    response_format: { type: "json_object" },
  });

  const raw = resp.choices[0].message.content ?? "{}";
  // response_format: json_object なので { results: [...] } か [...] が返る
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.warn("JSON parse error:", raw.slice(0, 200));
    return [];
  }

  // 配列 or {results:[...]} or {translations:[...]} 等
  const arr: unknown = Array.isArray(parsed) ? parsed
    : (parsed as Record<string, unknown>)["results"]
    ?? (parsed as Record<string, unknown>)["translations"]
    ?? Object.values(parsed as object)[0];

  if (!Array.isArray(arr)) { console.warn("予期しない形式:", raw.slice(0, 200)); return []; }
  return arr as TranslationResult[];
}

async function main() {
  let query = sb.from("country_sources")
    .select("id, page_title_original, page_lang")
    .not("page_title_original", "is", null);

  if (!RE_TRANSLATE) {
    query = query.is("page_title_ja", null) as typeof query;
  }

  const { data, error } = await query;
  if (error) { console.error("DB error:", error.message); process.exit(1); }

  const rows = (data ?? []) as TitleRow[];
  console.log(`翻訳対象: ${rows.length} 件\n`);

  if (DRY_RUN) {
    // コスト推定
    const totalChars = rows.reduce((n, r) => n + r.page_title_original.length, 0);
    const estInputTokens  = Math.ceil(totalChars / 4) + rows.length * 20; // JSON overhead
    const estOutputTokens = rows.length * 60 * 3; // 3言語 × 60文字/言語
    console.log(`推定入力トークン: ${estInputTokens.toLocaleString()}`);
    console.log(`推定出力トークン: ${estOutputTokens.toLocaleString()}`);
    console.log(`推定コスト (gpt-4o-mini): $${((estInputTokens * 0.15 + estOutputTokens * 0.60) / 1_000_000).toFixed(4)}`);
    console.log("[DRY RUN] DB 更新スキップ");
    return;
  }

  if (rows.length === 0) { console.log("対象なし (fetch-page-titles.ts を先に実行してください)"); return; }

  let totalIn = 0, totalOut = 0, updated = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    process.stdout.write(`  バッチ ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(rows.length / BATCH_SIZE)} (${batch.length}件) ... `);

    const results = await translateBatch(batch);
    process.stdout.write(`${results.length}件翻訳\n`);

    for (const r of results) {
      const { error: upErr } = await sb
        .from("country_sources")
        .update({ page_title_ja: r.ja, page_title_en: r.en, page_title_zh: r.zh })
        .eq("id", r.id);
      if (upErr) console.warn(`  ⚠️ update 失敗 ${r.id}: ${upErr.message}`);
      else {
        updated++;
        const orig = batch.find(b => b.id === r.id)?.page_title_original ?? "";
        console.log(`    [ja] ${r.ja}`);
        console.log(`    [en] ${r.en}`);
        console.log(`    [zh] ${r.zh}`);
        console.log(`    ← ${orig}\n`);
      }
    }

    // レート制限対策
    if (i + BATCH_SIZE < rows.length) await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n✅ ${updated} 件を更新 (page_title_ja / en / zh)`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });

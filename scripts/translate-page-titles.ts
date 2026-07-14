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
const FIX_ERRORS   = process.argv.includes("--fix-errors");  // 既存翻訳の品質チェックと修正
const MODEL        = "gpt-4o-mini";
const BATCH_SIZE   = 20;

const SYSTEM_PROMPT = `あなたは政府機関ページのタイトル翻訳の専門家です。
以下のルールに厳密に従ってください:
- タイトルを日本語・英語・中国語（簡体字）に翻訳する
- 意訳・要約・情報の追加は禁止。タイトルとして自然な直訳のみ
- 機関名の定訳があれば使う（例: IRAS → シンガポール内国歳入庁、IRCC → カナダ移民・難民・市民権省）
- 元が英語なら en はそのままコピー（翻訳不要）
- 出力は必ず {"results": [{id, ja, en, zh}, ...]} 形式のJSONオブジェクト
- 入力の全件を results 配列に含めること（件数を減らさないこと）
- markdown コードブロックや余分な説明は不要

入力: JSON 配列 [{id, title, lang}]
出力: {"results": [{id, ja, en, zh}, ...]}`;

interface TitleRow {
  id: string;
  page_title_original: string;
  page_lang: string | null;
  page_title_ja?: string | null;
  page_title_en?: string | null;
  page_title_zh?: string | null;
}

interface TranslationResult {
  id: string;
  ja: string | null;
  en: string | null;
  zh: string | null;
}

// 非ラテン文字圏のスクリプト（EMダッシュ・アクセント付きアルファベットは除く）
const NON_LATIN_SCRIPT_RE = /[Ͱ-ӿ؀-ۿऀ-ൿႠ-ჿᄀ-ᇿ　-鿿가-힯豈-﫿]/;

// 翻訳品質チェック: 失敗していれば true
function isTranslationFailure(original: string, translated: string | null | undefined, targetLang: string): boolean {
  if (!translated || translated.trim().length === 0) return true;
  const t = translated.trim();
  // 元文が非ラテン文字圏で翻訳結果が原文と同一 → 翻訳されていない
  if (t === original && NON_LATIN_SCRIPT_RE.test(original)) return true;
  if (targetLang === "en") {
    // en 欄に非ラテン文字圏の文字が 40% 超 → 翻訳失敗
    const nonLatin = (t.match(NON_LATIN_SCRIPT_RE) ?? []).length;
    if (nonLatin > t.length * 0.4) return true;
  }
  if (targetLang === "ja") {
    // ja 欄にハングルが 30% 超 → 翻訳失敗（韓国語のまま）
    const hangul = (t.match(/[가-힯ᄀ-ᇿ㄰-㆏]/g) ?? []).length;
    if (hangul > t.length * 0.3) return true;
  }
  return false;
}

const RETRY_SYSTEM_PROMPT = `あなたは翻訳の専門家です。
1件のページタイトルをja/en/zhに翻訳し、必ず{"results":[{"id":"...","ja":"...","en":"...","zh":"..."}]}のjson形式で返してください。

厳守事項:
- ja: 必ず日本語（ひらがな・カタカナ・漢字）で
- en: 必ず英語（ラテン文字のみ）で。元が英語ならそのままコピー
- zh: 必ず簡体字中国語（漢字）で
- 機関名の定訳: IRAS→シンガポール内国歳入庁、IRCC→カナダ移民・難民・市民権省 等
- markdown・追加説明は不要`;

async function retryTranslateSingle(row: TitleRow): Promise<TranslationResult | null> {
  const input = [{ id: row.id, title: row.page_title_original, lang: row.page_lang ?? "en" }];
  const resp = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: RETRY_SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(input) },
    ],
    temperature: 0,
    response_format: { type: "json_object" },
  });
  const raw = resp.choices[0].message.content ?? "{}";
  try {
    const parsed = JSON.parse(raw);
    const arr = Array.isArray(parsed) ? parsed
      : (parsed as Record<string, unknown>)["results"]
      ?? Object.values(parsed as object)[0];
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return arr[0] as TranslationResult;
  } catch { return null; }
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

  // 翻訳品質チェック + リトライ
  const validated: TranslationResult[] = [];
  for (const r of arr as TranslationResult[]) {
    const orig = rows.find(row => row.id === r.id);
    if (!orig) { validated.push(r); continue; }
    const jaFail = isTranslationFailure(orig.page_title_original, r.ja, "ja");
    const enFail = isTranslationFailure(orig.page_title_original, r.en, "en");
    const zhFail = isTranslationFailure(orig.page_title_original, r.zh, "zh");
    if (jaFail || enFail || zhFail) {
      console.log(`  ⚠️  翻訳品質不足（${[jaFail?"ja":"",enFail?"en":"",zhFail?"zh":""].filter(Boolean).join("/")}）: ${orig.page_title_original.slice(0, 40)} → リトライ中...`);
      const retried = await retryTranslateSingle(orig);
      if (retried) {
        // リトライ結果で失敗したフィールドのみ null に
        validated.push({
          id: r.id,
          ja: isTranslationFailure(orig.page_title_original, retried.ja, "ja") ? null : retried.ja,
          en: isTranslationFailure(orig.page_title_original, retried.en, "en") ? null : retried.en,
          zh: isTranslationFailure(orig.page_title_original, retried.zh, "zh") ? null : retried.zh,
        });
      } else {
        validated.push({ id: r.id, ja: jaFail ? null : r.ja, en: enFail ? null : r.en, zh: zhFail ? null : r.zh });
      }
    } else {
      validated.push(r);
    }
  }
  return validated;
}

async function main() {
  // --fix-errors: 既存翻訳の品質チェックし、失敗フィールドを null 化して再翻訳対象にする
  if (FIX_ERRORS) {
    const { data: allTranslated, error: fErr } = await sb.from("country_sources")
      .select("id, page_title_original, page_lang, page_title_ja, page_title_en, page_title_zh")
      .not("page_title_original", "is", null)
      .not("page_title_ja", "is", null);
    if (fErr) { console.error(fErr.message); process.exit(1); }
    let fixed = 0;
    for (const row of allTranslated ?? []) {
      const jaFail = isTranslationFailure(row.page_title_original, row.page_title_ja, "ja");
      const enFail = isTranslationFailure(row.page_title_original, row.page_title_en, "en");
      const zhFail = isTranslationFailure(row.page_title_original, row.page_title_zh, "zh");
      if (!jaFail && !enFail && !zhFail) continue;
      const fields = [jaFail?"ja":"", enFail?"en":"", zhFail?"zh":""].filter(Boolean).join("/");
      console.log(`⚠️  [fix-errors] ${fields} 失敗 → null 化: ${row.page_title_original.slice(0, 50)}`);
      await sb.from("country_sources").update({
        ...(jaFail ? { page_title_ja: null } : {}),
        ...(enFail ? { page_title_en: null } : {}),
        ...(zhFail ? { page_title_zh: null } : {}),
      }).eq("id", row.id);
      fixed++;
    }
    console.log(`\n✅ ${fixed} 件のフィールドを null 化 → 通常実行で再翻訳されます`);
    if (fixed === 0) return;
  }

  let query = sb.from("country_sources")
    .select("id, page_title_original, page_lang")
    .not("page_title_original", "is", null);

  if (!RE_TRANSLATE && !FIX_ERRORS) {
    query = query.is("page_title_ja", null) as typeof query;
  } else if (FIX_ERRORS) {
    // null 化されたフィールドのある行のみ再翻訳
    query = query.is("page_title_ja", null) as typeof query;
  }

  const { data, error } = await query;
  if (error) { console.error("DB error:", error.message); process.exit(1); }

  const rows = (data ?? []) as TitleRow[];
  console.log(`翻訳対象: ${rows.length} 件\n`);

  if (DRY_RUN) {
    const totalChars = rows.reduce((n, r) => n + r.page_title_original.length, 0);
    const estInputTokens  = Math.ceil(totalChars / 4) + rows.length * 20;
    const estOutputTokens = rows.length * 60 * 3;
    console.log(`推定入力トークン: ${estInputTokens.toLocaleString()}`);
    console.log(`推定出力トークン: ${estOutputTokens.toLocaleString()}`);
    console.log(`推定コスト (gpt-4o-mini): $${((estInputTokens * 0.15 + estOutputTokens * 0.60) / 1_000_000).toFixed(4)}`);
    console.log("[DRY RUN] DB 更新スキップ");
    return;
  }

  if (rows.length === 0) { console.log("対象なし"); return; }

  let updated = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    process.stdout.write(`  バッチ ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(rows.length / BATCH_SIZE)} (${batch.length}件) ... `);

    const results = await translateBatch(batch);
    process.stdout.write(`${results.length}件翻訳\n`);

    for (const r of results) {
      // null フィールドは DB に保存しない（既存値を保持）
      const updatePayload: Record<string, string | null> = {};
      if (r.ja !== undefined) updatePayload.page_title_ja = r.ja;
      if (r.en !== undefined) updatePayload.page_title_en = r.en;
      if (r.zh !== undefined) updatePayload.page_title_zh = r.zh;
      const { error: upErr } = await sb
        .from("country_sources")
        .update(updatePayload)
        .eq("id", r.id);
      if (upErr) console.warn(`  ⚠️ update 失敗 ${r.id}: ${upErr.message}`);
      else {
        updated++;
        const orig = batch.find(b => b.id === r.id)?.page_title_original ?? "";
        console.log(`    [ja] ${r.ja ?? "(null)"}`);
        console.log(`    [en] ${r.en ?? "(null)"}`);
        console.log(`    [zh] ${r.zh ?? "(null)"}`);
        console.log(`    ← ${orig}\n`);
      }
    }

    if (i + BATCH_SIZE < rows.length) await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n✅ ${updated} 件を更新 (page_title_ja / en / zh)`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });

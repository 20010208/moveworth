/**
 * D-2 dry-run: study 記事参考資料注入ロジックを検証（DB 書き込みなし）
 * 使い方: npx tsx scripts/_dryrun-study-refs.ts [country_code]
 * 例: npx tsx scripts/_dryrun-study-refs.ts au   # visa ソースあり（grounded）
 *      npx tsx scripts/_dryrun-study-refs.ts hu   # visa ソースなし（fallback）
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const code = process.argv[2] ?? "au";

// --- 注入ロジック（generate-country-article.ts と同一）---
function simpleUrlLabel(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return url; }
}

function stripRefSection(content: string): string {
  const re = /\n(?:---\n\n)?###\s*(?:参考資料|References)/;
  const m = content.match(re);
  return m ? content.slice(0, m.index!) : content;
}

function restoreStudyRefs(content: string, refs: string, isGrounded: boolean, lang: "ja" | "en"): string {
  const stripped = stripRefSection(content);
  if (!isGrounded) {
    const fallbacks: Record<"ja" | "en", string> = {
      ja: "### 参考資料\n最新の情報は各国の入国管理局・大使館の公式サイトでご確認ください。",
      en: "### References\nFor the latest information, please refer to the official immigration authority or embassy website of your destination country.",
    };
    return stripped.trimEnd() + `\n\n${fallbacks[lang]}`;
  }
  const headings: Record<"ja" | "en", string> = {
    ja: "### 参考資料\n本記事の情報は以下の公式資料をもとに作成しています。",
    en: "### References\nData sourced from official government and immigration authority pages.",
  };
  return stripped.trimEnd() + `\n\n---\n\n${headings[lang]}\n${refs}`;
}

async function main() {
  console.log(`\n=== dry-run: study refs for [${code}] ===\n`);

  const { data: sources } = await sb
    .from("country_sources")
    .select("url")
    .eq("country_code", code)
    .eq("purpose", "visa")
    .eq("status", "alive");

  const urls = (sources ?? []).map((r: { url: string }) => r.url);
  const isGrounded = urls.length > 0;

  console.log(`visa sources 件数: ${urls.length}`);
  if (isGrounded) console.log(`URLs:\n  ${urls.join("\n  ")}`);

  const refs = isGrounded
    ? urls.map(u => `- [${simpleUrlLabel(u)}](${u})`).join("\n")
    : "";

  // 既存 study 記事があれば末尾の参考資料セクションを差し替えてシミュレート
  const dummy = `（記事本文省略）\n\n### 参考資料\n旧GPT生成URL（差し替え対象）\n- [example.com](https://example.com)`;

  for (const lang of ["ja", "en"] as const) {
    const result = restoreStudyRefs(dummy, refs, isGrounded, lang);
    const refSection = result.match(/(?:---\n\n)?###\s*(?:参考資料|References)[\s\S]*$/)?.[0] ?? "(参考資料セクション未検出)";
    console.log(`\n[${lang}] 注入後参考資料:\n${refSection}`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });

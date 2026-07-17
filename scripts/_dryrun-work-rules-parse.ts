/**
 * D-3 dry-run: study-work-{code} 全52件の就労時間パース成功率確認
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

// 就労時間を抽出するパーサー
// 対象パターン: 「学期中：**週N時間まで**」「学期中：週N時間まで」等
const TERM_RE = /\*{0,2}学期中[：:]\*{0,2}\s*([^\n*]+)/;
const HOLIDAY_RE = /\*{0,2}休暇中[：:]\*{0,2}\s*([^\n*]+)/;

function parseLine(text: string, re: RegExp): string | null {
  const m = text.match(re);
  if (!m) return null;
  return m[1].replace(/\*+/g, "").trim();
}

async function main() {
  const { data: posts } = await sb
    .from("study_blog_posts")
    .select("slug, content")
    .like("slug", "study-work-%")
    .order("slug");

  const all = posts ?? [];
  console.log(`\n対象: ${all.length} 件\n`);

  type Result = {
    code: string;
    term: string | null;
    holiday: string | null;
    status: "ok" | "partial" | "fail";
    note?: string;
  };

  const results: Result[] = [];

  for (const p of all) {
    const code = p.slug.replace("study-work-", "");
    const ja = (p.content as Record<string, string>)?.ja ?? "";

    // アルバイト・就労ルールセクションを抽出
    const section = ja.match(/###\s*(?:アルバイト・)?就労ルール([\s\S]*?)(?=\n###|$)/)?.[1] ?? ja;

    const term = parseLine(section, TERM_RE);
    const holiday = parseLine(section, HOLIDAY_RE);

    const status: Result["status"] =
      term && holiday ? "ok" :
      term || holiday ? "partial" :
      "fail";

    let note: string | undefined;
    if (status !== "ok") {
      // 失敗/部分的の場合、実際の就労ルールセクション冒頭を記録
      const snippet = section.replace(/\n+/g, " ").slice(0, 120);
      note = snippet;
    }

    results.push({ code, term, holiday, status, note });
  }

  const ok = results.filter(r => r.status === "ok");
  const partial = results.filter(r => r.status === "partial");
  const fail = results.filter(r => r.status === "fail");

  console.log(`=== パース結果サマリ ===`);
  console.log(`✅ 成功（term+holiday両方）: ${ok.length} 件`);
  console.log(`⚠️  部分成功（片方のみ）:     ${partial.length} 件`);
  console.log(`❌ 失敗（両方なし）:          ${fail.length} 件`);
  console.log(`合計: ${results.length} 件\n`);

  if (ok.length > 0) {
    console.log(`=== ✅ 成功件 (先頭10件) ===`);
    for (const r of ok.slice(0, 10)) {
      console.log(`[${r.code}] 学期中: ${r.term} / 休暇中: ${r.holiday}`);
    }
    if (ok.length > 10) console.log(`... 他 ${ok.length - 10} 件`);
  }

  if (partial.length > 0) {
    console.log(`\n=== ⚠️  部分成功件 ===`);
    for (const r of partial) {
      console.log(`[${r.code}] 学期中: ${r.term ?? "❌"} / 休暇中: ${r.holiday ?? "❌"}`);
      console.log(`  本文: ${r.note}`);
    }
  }

  if (fail.length > 0) {
    console.log(`\n=== ❌ 失敗件 ===`);
    for (const r of fail) {
      console.log(`[${r.code}]`);
      console.log(`  本文: ${r.note}`);
    }
  }

  // 表形式プレビュー（成功分のみ）
  console.log(`\n=== テーブルプレビュー（成功分抜粋）===`);
  console.log(`| 国コード | 学期中 | 休暇中 |`);
  console.log(`|---|---|---|`);
  for (const r of results.filter(r => r.status === "ok").slice(0, 15)) {
    console.log(`| ${r.code} | ${r.term} | ${r.holiday} |`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });

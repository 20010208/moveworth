/**
 * generate-cross-work-rules.ts
 * study-abroad-work-rules-all-countries-2026 を全カ国テーブルで再生成する
 * ソース: study-work-{code} 個別記事の本文パース（GPT 呼び出しなし）
 *
 * 使い方:
 *   npx tsx scripts/generate-cross-work-rules.ts              # draft 保存 (is_published=false)
 *   npx tsx scripts/generate-cross-work-rules.ts --publish-only  # フラグ切り替えのみ（再生成なし）
 *
 * GHA 週次バッチはドラフト保存のみ。公開は必ず人間が --publish-only を手動実行する。
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { MASTER_COUNTRIES } from "../src/data/master-countries";

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

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PUBLISH_ONLY = process.argv.includes("--publish-only");
const SLUG = "study-abroad-work-rules-all-countries-2026";

const EXTRA_COUNTRY_NAMES: Record<string, { ja: string; en: string }> = {
  me: { ja: "モンテネグロ", en: "Montenegro" },
  rs: { ja: "セルビア", en: "Serbia" },
};

function flagEmoji(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

function getCountryName(code: string): { ja: string; en: string } {
  const m = MASTER_COUNTRIES.find((c) => c.code === code);
  if (m) return { ja: m.name.ja, en: m.name.en };
  return EXTRA_COUNTRY_NAMES[code] ?? { ja: code.toUpperCase(), en: code.toUpperCase() };
}

// ─── Multi-layer parser ──────────────────────────────────────────────────────

function extractFirst(text: string, keyPattern: RegExp): string | null {
  const re = new RegExp(keyPattern.source + "\\s*([^\\n]+)");
  const m = text.match(re);
  if (!m) return null;
  return m[1].replace(/^\*+/, "").replace(/\*+$/, "").trim() || null;
}

function parseWorkRules(ja: string): { term: string | null; holiday: string | null } {
  // アルバイト・就労ルールセクションに絞る（なければ全文を使用）
  const section =
    ja.match(/###\s*(?:アルバイト・)?就労ルール([\s\S]*?)(?=\n###|$)/)?.[1] ?? ja;

  // L1: 「学期中：」 直接パターン
  const term1 = extractFirst(section, /\*{0,2}学期中[：:]\*{0,2}/);
  // L2: 「（任意プレフィクス）休暇中（任意サフィクス）：」 拡張パターン（夏季・長期・括弧付き等）
  const holiday2 = extractFirst(section, /\*{0,2}(?:[^\s（）]*?)?休暇中[^：:\n]*[：:]\*{0,2}/);
  // L3: 「学期中・休暇中：」 合算パターン（fi スタイル）
  const combined3 = extractFirst(section, /学期中[・\/]休暇中[：:]/);
  // L4: 「（学期中）：」 括弧内パターン（kr・cn スタイル）
  const term4 = extractFirst(section, /（学期中）\s*[：:]/);
  const holiday4 = extractFirst(section, /（休暇中）\s*[：:]/);

  return {
    term: term1 ?? term4 ?? combined3,
    holiday: holiday2 ?? holiday4 ?? combined3,
  };
}

// ─── Content builders ────────────────────────────────────────────────────────

type Row = {
  code: string;
  flag: string;
  jaName: string;
  enName: string;
  term: string;
  holiday: string;
  isFallback: boolean;
};

function buildJaTable(rows: Row[]): string {
  const sorted = [...rows].sort((a, b) => a.jaName.localeCompare(b.jaName, "ja"));
  const lines = sorted.map((r) =>
    `| ${r.flag} [${r.jaName}](/blog/study-work-${r.code}) | ${r.term} | ${r.holiday} |`
  );
  return [
    "| 国 | 学期中（週） | 休暇中 |",
    "|---|---|---|",
    ...lines,
  ].join("\n");
}

function buildEnTable(rows: Row[]): string {
  const sorted = [...rows].sort((a, b) => a.enName.localeCompare(b.enName, "en"));
  const lines = sorted.map((r) =>
    `| ${r.flag} [${r.enName}](/blog/study-work-${r.code}) | ${r.term} | ${r.holiday} |`
  );
  return [
    "| Country | During term (per week) | During vacation |",
    "|---|---|---|",
    ...lines,
  ].join("\n");
}

function buildJaLinks(rows: Row[]): string {
  return [...rows]
    .sort((a, b) => a.jaName.localeCompare(b.jaName, "ja"))
    .map((r) => `- [${r.flag} ${r.jaName}の就労ルール詳細](/blog/study-work-${r.code})`)
    .join("\n");
}

function buildEnLinks(rows: Row[]): string {
  return [...rows]
    .sort((a, b) => a.enName.localeCompare(b.enName, "en"))
    .map((r) => `- [${r.flag} Work rules in ${r.enName}](/blog/study-work-${r.code})`)
    .join("\n");
}

function articleJA(table: string, links: string, count: number): string {
  return `海外留学中のアルバイト・就労ルールは国によって大きく異なります。週の就労時間の上限、学期中と休暇中の違い、就労許可証の要否など、事前に確認しなければならないポイントが多くあります。本記事では${count}カ国の情報を一覧にまとめています。

> **重要**: 本表は参考情報です。就労ルールは随時改正されることがあります。出発前に各国の入国管理局または日本大使館の公式情報で必ずご確認ください。

### 就労ルール早見表

${table}

### 各国の詳細情報

各国の詳細（申請手続き・条件・罰則など）は以下の個別記事でご確認ください。

${links}

### 参考資料

本記事の情報は各国の個別就労ルール記事（上記リンク）をもとに作成しています。最新情報は各国の入国管理局・大使館の公式サイトでご確認ください。`;
}

function articleEN(table: string, links: string, count: number): string {
  return `Work rules for international students vary greatly by country. Hours per week, differences between term and vacation periods, and permit requirements all differ. This article summarises rules for ${count} countries in one place.

> **Important**: This table is for reference only. Work rules may change at any time. Always verify with the official immigration authority or Japanese embassy before departing.

### Work Rules at a Glance

${table}

### Country-Specific Details

For full details (application process, conditions, penalties, etc.), see the individual country articles below.

${links}

### References

Information in this article is drawn from the individual country work-rules articles linked above. For the latest updates, check each country's official immigration authority or embassy website.`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function run() {
  if (PUBLISH_ONLY) {
    const { error } = await sb
      .from("study_blog_posts")
      .update({ is_published: true })
      .eq("slug", SLUG);
    if (error) { console.error("❌ publish failed:", error.message); process.exit(1); }
    console.log(`✅ ${SLUG} を公開しました`);
    return;
  }

  // study-work-{code} 全件取得
  const { data: posts, error: fetchErr } = await sb
    .from("study_blog_posts")
    .select("slug, content")
    .like("slug", "study-work-%");
  if (fetchErr) { console.error("❌ fetch failed:", fetchErr.message); process.exit(1); }

  const rows: Row[] = [];
  const fallbackCodes: string[] = [];

  for (const p of posts ?? []) {
    const code = p.slug.replace("study-work-", "");
    const ja = (p.content as Record<string, string>)?.ja ?? "";
    const { term, holiday } = parseWorkRules(ja);
    const { ja: jaName, en: enName } = getCountryName(code);
    const isFallback = !term || !holiday;
    if (isFallback) fallbackCodes.push(code);

    rows.push({
      code,
      flag: flagEmoji(code),
      jaName,
      enName,
      term: term ?? "※個別記事参照",
      holiday: holiday ?? "※個別記事参照",
      isFallback,
    });
  }

  console.log(`パース完了: ${rows.length}件`);
  if (fallbackCodes.length > 0) {
    console.log(`⚠️  フォールバック (${fallbackCodes.length}件): ${fallbackCodes.join(", ")}`);
  } else {
    console.log(`✅ 全件パース成功`);
  }

  const jaTable = buildJaTable(rows);
  const enTable = buildEnTable(rows);
  const jaLinks = buildJaLinks(rows);
  const enLinks = buildEnLinks(rows);
  const jaContent = articleJA(jaTable, jaLinks, rows.length);
  const enContent = articleEN(enTable, enLinks, rows.length);

  if (jaContent.length < 500) throw new Error("JA content too short");

  const { error: upsertErr } = await sb
    .from("study_blog_posts")
    .update({
      content: { ja: jaContent, en: enContent },
      is_published: false,
    })
    .eq("slug", SLUG);

  if (upsertErr) { console.error("❌ upsert failed:", upsertErr.message); process.exit(1); }

  console.log(`✅ ${SLUG} を下書き保存しました (${rows.length}カ国, JA: ${jaContent.length}字)`);
  console.log(`   公開するには: npx tsx scripts/generate-cross-work-rules.ts --publish-only`);
}

run().catch(e => { console.error(e); process.exit(1); });

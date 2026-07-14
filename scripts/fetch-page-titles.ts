/**
 * country_sources (status=alive) の全 URL から <title> を抽出し、
 * page_title_original / page_lang を DB に保存する。
 *
 * 使い方:
 *   npx tsx scripts/fetch-page-titles.ts             # page_title_original が null の行のみ処理
 *   npx tsx scripts/fetch-page-titles.ts --re-fetch  # 全 alive URL を再取得
 *   npx tsx scripts/fetch-page-titles.ts --dry-run   # DB 更新なし
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";

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

const DRY_RUN   = process.argv.includes("--dry-run");
const RE_FETCH  = process.argv.includes("--re-fetch");
const CLEANUP   = process.argv.includes("--cleanup");  // 既存ゴミタイトルを null 化
const TIMEOUT   = 12_000;
const CONCURRENCY = 6;
const MAX_TITLE_LEN = 80;

// ゴミタイトル: ブロック/エラーページ
const GARBAGE_REGEX = [
  /\bradware\b/i,
  /\bcloudflare\b/i,
  /\bjust a moment\b/i,
  /\baccess denied\b/i,
  /\b403\b.*\bforbidden\b/i,
  /\b404\b/i,
  /\bpage not found\b/i,
  /\bnot found\b/i,
  /\bsecurity check\b/i,
  /\bcaptcha\b/i,
  /^startseite\b/i,   // German "home page" + 国コード等の組み合わせ
];
// ゴミタイトル: 無情報タイトル（タイトル全体がこれのみ）
const GARBAGE_EXACT = new Set([
  'home', 'startseite', 'willkommen', 'welcome', 'top', 'index',
  'トップ', 'ホーム', 'ホームページ', 'homepage', 'トップページ',
  'メインページ', '首页', '主页', '홈',
]);

function isGarbageTitle(title: string): boolean {
  const t = title.trim();
  if (t.length < 3) return true;
  if (GARBAGE_EXACT.has(t.toLowerCase())) return true;
  return GARBAGE_REGEX.some(p => p.test(t));
}

// サイト名サフィックス除去パターン（区切り記号 + サイト名）
// 例: "Express Entry Programs | Immigration, Refugees and Citizenship Canada"
// → "Express Entry Programs"
function stripSiteSuffix(raw: string): string {
  let t = raw.trim();
  // 長い区切り前の部分を取る（ | / :: / — / – で分割）
  // ただし区切り以降が 50 字未満の場合のみ除去（短い＝サイト名）
  const DELIMS = [" | ", " :: ", " — ", " – "];
  for (const d of DELIMS) {
    const idx = t.indexOf(d);
    if (idx > 0) {
      const suffix = t.slice(idx + d.length);
      if (suffix.length < 60 && idx > 3) {
        // 先頭にサイト名があるパターン: "Site | Page Title" → keep suffix
        const prefix = t.slice(0, idx);
        if (prefix.length < 60 && suffix.length > prefix.length) {
          t = suffix; break;
        }
        t = prefix; break;
      }
    }
  }
  // " - Site Name" パターン（末尾 50 字未満の " - xxx"）
  const dashIdx = t.lastIndexOf(" - ");
  if (dashIdx > 10) {
    const suffix = t.slice(dashIdx + 3);
    if (suffix.length < 50 && !suffix.includes(",") && !suffix.includes("(")) {
      t = t.slice(0, dashIdx);
    }
  }
  return t.slice(0, MAX_TITLE_LEN).trim();
}

// <html lang="xx"> から言語コード抽出
function detectLang(html: string, url: string): string {
  const m = html.match(/<html[^>]+\blang=["']([a-zA-Z]{2,8}(?:-[a-zA-Z]{2,8})?)/i);
  if (m) return m[1].slice(0, 2).toLowerCase();

  // TLD からの推定フォールバック
  try {
    const tld = new URL(url).hostname.split(".").at(-1)?.toLowerCase() ?? "";
    const TLD_MAP: Record<string, string> = {
      de:"de", fr:"fr", jp:"ja", kr:"ko", cn:"zh", tw:"zh", th:"th",
      pl:"pl", nl:"nl", se:"sv", dk:"da", no:"no", fi:"fi", at:"de",
      be:"nl", gr:"el", cz:"cs", hr:"hr", hu:"hu", ro:"ro", ee:"et",
      pt:"pt", es:"es", it:"it", br:"pt", ge:"ka", vn:"vi", id:"id",
      ph:"fil", in:"hi", ar:"es", co:"es", mx:"es", za:"en", sg:"en",
      ae:"ar", hk:"zh", my:"ms",
    };
    return TLD_MAP[tld] ?? "en";
  } catch {
    return "en";
  }
}

// <title> 抽出 + サフィックス除去
function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]{2,})<\/title>/i);
  if (!m) return null;
  const decoded = m[1]
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/\s+/g, " ").trim();
  if (decoded.length < 3) return null;
  const stripped = stripSiteSuffix(decoded);
  if (isGarbageTitle(stripped)) return null;
  return stripped;
}

async function fetchTitleAndLang(url: string): Promise<{ title: string | null; lang: string }> {
  const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { "User-Agent": UA, "Accept": "text/html", "Accept-Language": "en-US,en;q=0.9" },
    });
    clearTimeout(timer);
    if (!res.ok) return { title: null, lang: "en" };
    const text = await res.text();
    // <title> と <html lang> のみ必要なので先頭 8KB で十分
    const head = text.slice(0, 8192);
    return { title: extractTitle(head), lang: detectLang(head, url) };
  } catch {
    clearTimeout(timer);
    return { title: null, lang: "en" };
  }
}

async function pool<T, R>(items: T[], concurrency: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

async function main() {
  // --cleanup: 既存ゴミタイトルを null 化して終了
  if (CLEANUP) {
    const { data: titled, error: tErr } = await sb.from("country_sources")
      .select("id, country_code, page_title_original")
      .not("page_title_original", "is", null);
    if (tErr) { console.error(tErr.message); process.exit(1); }
    let cleaned = 0;
    for (const row of titled ?? []) {
      if (!isGarbageTitle(row.page_title_original)) continue;
      const { error: upErr } = await sb.from("country_sources")
        .update({ page_title_original: null, page_title_ja: null, page_title_en: null, page_title_zh: null })
        .eq("id", row.id);
      if (upErr) { console.warn(`⚠️ ${row.id}: ${upErr.message}`); continue; }
      console.log(`🗑️  [${row.country_code}] "${row.page_title_original}" → null`);
      cleaned++;
    }
    console.log(`\n✅ ${cleaned} 件のゴミタイトルを null 化`);
    return;
  }

  let query = sb.from("country_sources")
    .select("id, country_code, url")
    .eq("status", "alive")
    .order("country_code");

  if (!RE_FETCH) {
    query = query.is("page_title_original", null) as typeof query;
  }

  const { data, error } = await query;
  if (error) { console.error("DB error:", error.message); process.exit(1); }

  const rows = data ?? [];
  console.log(`対象: ${rows.length} 件 (alive${RE_FETCH ? ", 全件再取得" : ", title=null のみ"})\n`);
  if (rows.length === 0) { console.log("対象なし"); return; }

  let success = 0, failed = 0;

  const results = await pool(rows, CONCURRENCY, async (row) => {
    const { title, lang } = await fetchTitleAndLang(row.url);
    const icon = title ? "✅" : "⬜";
    console.log(`${icon} [${row.country_code.toUpperCase()}] ${title ?? "(取得不可)"} | lang=${lang} | ${row.url.slice(0, 70)}`);
    return { id: row.id, title, lang };
  });

  for (const r of results) {
    if (r.title) success++; else failed++;
  }

  console.log(`\n取得成功: ${success} / 取得不可: ${failed}`);

  if (!DRY_RUN) {
    // バッチ更新
    let updated = 0;
    for (const r of results) {
      if (r.title === null) continue;
      const { error: upErr } = await sb
        .from("country_sources")
        .update({ page_title_original: r.title, page_lang: r.lang })
        .eq("id", r.id);
      if (upErr) console.warn(`  ⚠️ update 失敗 ${r.id}: ${upErr.message}`);
      else updated++;
    }
    console.log(`✅ ${updated} 件を更新 (page_title_original / page_lang)`);
  } else {
    console.log("[DRY RUN] DB 更新スキップ");
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });

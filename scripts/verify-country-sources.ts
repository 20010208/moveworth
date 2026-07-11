/**
 * country_sources テーブルへの URL 検証・投入スクリプト
 *
 * モード:
 *   (default)           記事から URL を抽出して検証・upsert
 *   --dry-run           upsert をスキップ（抽出・検証のみ）
 *   --re-verify         alive 含め全件再検証
 *   --recheck-dead      DB の status='dead' を強化再検証（UA 回転 + リトライ）
 *   --recheck-unverified DB の status='unverified'|'unknown' を再検証
 *
 * 強化再検証のステータス分類:
 *   alive      - 任意の試行で 2xx/3xx を取得
 *   unverified - 403/429/5xx またはタイムアウト（bot 遮断疑い）
 *   dead       - 404/410/DNS失敗など（URL 消滅と確定）
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RE_VERIFY        = process.argv.includes("--re-verify");
const DRY_RUN          = process.argv.includes("--dry-run");
const RECHECK_DEAD     = process.argv.includes("--recheck-dead");
const RECHECK_UNVERIFIED = process.argv.includes("--recheck-unverified");
const TIMEOUT_MS       = 12_000;
const CONCURRENCY      = 5;

// --- User-Agent ローテーション ---
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0",
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// URL 抽出
function extractUrls(markdown: string): string[] {
  const urls = new Set<string>();
  for (const m of markdown.matchAll(/\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g)) {
    urls.add(m[2].replace(/\)$/, "").trim());
  }
  for (const m of markdown.matchAll(/(?<!\()https?:\/\/[^\s)\]"']+/g)) {
    const url = m[0].replace(/[.,;:!?]$/, "");
    if (!markdown.includes(`](${url})`)) urls.add(url);
  }
  return [...urls].filter(
    (u) => !u.includes("moveworthapp.com") && !u.includes("localhost")
  );
}

function extractRefSectionUrls(markdown: string): string[] {
  // ### 参考資料 / ## 参考資料 / ### References など
  const refIdx = markdown.search(/#{2,3}\s*(参考資料|References|参考文献|参考资料)/);
  const section = refIdx >= 0 ? markdown.slice(refIdx) : markdown;
  return extractUrls(section);
}

// --- シンプルチェック（初回 upsert 用）---
async function checkUrl(url: string): Promise<"alive" | "dead"> {
  const ua = USER_AGENTS[0];
  for (const method of ["HEAD", "GET"] as const) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method, redirect: "follow", signal: controller.signal,
        headers: { "User-Agent": ua },
      });
      clearTimeout(timer);
      if (res.status < 400) return "alive";
      if (method === "HEAD") continue;
      return "dead";
    } catch {
      clearTimeout(timer);
      if (method === "HEAD") continue;
      return "dead";
    }
  }
  return "dead";
}

// --- 強化チェック（recheck 用）---
type EnhancedStatus = "alive" | "unverified" | "dead";

async function checkUrlEnhanced(url: string): Promise<{ status: EnhancedStatus; detail: string }> {
  const MAX_ATTEMPTS = 3;
  const RETRY_DELAYS = [0, 2000, 5000];
  let lastStatus = 0;
  let lastError = "";

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) await sleep(RETRY_DELAYS[attempt]);
    const ua = USER_AGENTS[attempt % USER_AGENTS.length];

    for (const method of ["HEAD", "GET"] as const) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        const res = await fetch(url, {
          method, redirect: "follow", signal: controller.signal,
          headers: {
            "User-Agent": ua,
            "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
          },
        });
        clearTimeout(timer);
        lastStatus = res.status;

        if (res.status < 400) {
          return { status: "alive", detail: `${method} ${res.status}` };
        }
        // bot 遮断疑い → unverified
        if ([403, 429, 503, 401, 407].includes(res.status)) {
          lastError = `${method} ${res.status} (bot-block suspect)`;
          if (method === "HEAD") continue;
          // GET でも 403/429 → try next UA
          break;
        }
        // URL 消滅 → dead 確定
        if ([404, 410, 451].includes(res.status)) {
          if (method === "HEAD") continue;
          return { status: "dead", detail: `${method} ${res.status}` };
        }
        // その他 4xx/5xx
        if (method === "HEAD") continue;
        if (res.status >= 500) {
          lastError = `${method} ${res.status} (server error)`;
          break; // 5xx はリトライ
        }
        return { status: "dead", detail: `${method} ${res.status}` };
      } catch (e: unknown) {
        clearTimeout(timer);
        const msg = e instanceof Error ? e.message : String(e);
        lastError = `${method} error: ${msg.slice(0, 60)}`;
        if (method === "HEAD") continue;
        // timeout or connection error
        if (msg.includes("abort") || msg.includes("timeout") || msg.includes("ETIMEDOUT")) {
          break; // タイムアウト → リトライ
        }
        // DNS 失敗 → dead 確定
        if (msg.includes("ENOTFOUND") || msg.includes("EAI_AGAIN")) {
          return { status: "dead", detail: `DNS failure: ${msg.slice(0, 40)}` };
        }
        break;
      }
    }
  }

  // 全試行失敗 → ステータスコードで分類
  if ([403, 429, 503, 401, 407].includes(lastStatus)) {
    return { status: "unverified", detail: lastError };
  }
  if ([404, 410, 451].includes(lastStatus)) {
    return { status: "dead", detail: lastError };
  }
  // timeout / 5xx / unknown → unverified
  return { status: "unverified", detail: lastError || "all attempts failed" };
}

// 並列プール
async function pool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
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

type DbRow = {
  country_code: string;
  purpose: "visa" | "study" | "general";
  url: string;
  status: "alive" | "dead" | "unverified" | "unknown";
  last_verified_at: string;
  source: "ai_suggested" | "manual";
};

// ===== recheck モード =====
async function runRecheck(statuses: string[]) {
  console.log(`=== recheck モード: status in (${statuses.join(",")}) ===\n`);

  const { data, error } = await supabase
    .from("country_sources")
    .select("id, country_code, purpose, url")
    .in("status", statuses);
  if (error) throw new Error(`DB取得失敗: ${error.message}`);

  const rows = data ?? [];
  console.log(`対象: ${rows.length} 件\n`);
  if (rows.length === 0) { console.log("対象なし"); return; }

  const now = new Date().toISOString();
  const results: { id: string; url: string; status: EnhancedStatus; detail: string }[] = [];

  // recheck は順次実行（UA ローテーションで間隔を空けるため）
  for (const row of rows as Array<{ id: string; country_code: string; purpose: string; url: string }>) {
    process.stdout.write(`  [${row.country_code.toUpperCase()}] ${row.url} ... `);
    const { status, detail } = await checkUrlEnhanced(row.url);
    process.stdout.write(`${status} (${detail})\n`);
    results.push({ id: row.id, url: row.url, status, detail });
  }

  // サマリー
  const alive      = results.filter((r) => r.status === "alive");
  const unverified = results.filter((r) => r.status === "unverified");
  const confirmed  = results.filter((r) => r.status === "dead");

  console.log(`\n=== 結果 ===`);
  console.log(`alive:       ${alive.length} 件（復活）`);
  console.log(`unverified:  ${unverified.length} 件（bot遮断疑い・要手動確認）`);
  console.log(`dead:        ${confirmed.length} 件（確定）`);

  if (unverified.length > 0) {
    console.log(`\n=== ⚠️  UNVERIFIED（記事から削除しないこと） ===`);
    for (const r of unverified) console.log(`  ${r.url}\n    → ${r.detail}`);
  }
  if (confirmed.length > 0) {
    console.log(`\n=== ❌ DEAD（確定・差し替え候補） ===`);
    for (const r of confirmed) console.log(`  ${r.url}\n    → ${r.detail}`);
  }

  if (!DRY_RUN) {
    // upsert で status + last_verified_at を更新
    const upsertRows = results.map((r) => ({
      url: r.url,
      status: r.status,
      last_verified_at: now,
    }));
    // status フィールドのみ更新（country_code/purpose が必要なため DB から取得）
    for (const r of results) {
      const { error: upErr } = await supabase
        .from("country_sources")
        .update({ status: r.status, last_verified_at: now })
        .eq("url", r.url);
      if (upErr) console.warn(`  ⚠️  update 失敗: ${r.url}: ${upErr.message}`);
    }
    console.log(`\n✅ ${results.length} 件を更新しました`);
  } else {
    console.log("\n[DRY RUN] DB 更新をスキップ");
  }

  // GHA 通知用: dead が残っていれば exit 1
  if (confirmed.length > 0) {
    console.log(`\n⚠️  ${confirmed.length} 件の dead URL があります`);
    process.exit(1);
  }
}

// ===== 通常モード（記事から抽出 → 検証 → upsert） =====
async function runExtract() {
  console.log("=== country_sources URL 検証スクリプト ===\n");

  const { data: visaPosts, error: visaErr } = await supabase
    .from("blog_posts").select("slug, content->ja").like("slug", "visa-%");
  if (visaErr) throw new Error(`blog_posts取得失敗: ${visaErr.message}`);

  const { data: studyPosts, error: studyErr } = await supabase
    .from("study_blog_posts").select("slug, content->ja").like("slug", "study-country-%");
  if (studyErr) throw new Error(`study_blog_posts取得失敗: ${studyErr.message}`);

  console.log(`visa記事: ${visaPosts?.length ?? 0}件、study記事: ${studyPosts?.length ?? 0}件`);

  const candidates: { country_code: string; purpose: "visa" | "study"; url: string }[] = [];

  for (const post of visaPosts ?? []) {
    const code = (post.slug as string).replace("visa-", "");
    const content = (post as Record<string, unknown>)["ja"] as string ?? "";
    for (const url of extractRefSectionUrls(content)) {
      candidates.push({ country_code: code, purpose: "visa", url });
    }
  }
  for (const post of studyPosts ?? []) {
    const code = (post.slug as string).replace("study-country-", "");
    const content = (post as Record<string, unknown>)["ja"] as string ?? "";
    for (const url of extractRefSectionUrls(content)) {
      candidates.push({ country_code: code, purpose: "study", url });
    }
  }

  const seen = new Set<string>();
  const unique = candidates.filter(({ country_code, url }) => {
    const key = `${country_code}::${url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`\n抽出 URL 件数: ${unique.length}\n`);
  if (unique.length === 0) {
    console.log("URL が見つかりません（参考資料セクションを確認してください）");
    return;
  }

  let skipUrls = new Set<string>();
  if (!RE_VERIFY) {
    const { data: existing } = await supabase
      .from("country_sources").select("url").eq("status", "alive");
    skipUrls = new Set((existing ?? []).map((r: { url: string }) => r.url));
    if (skipUrls.size > 0)
      console.log(`既存 alive ${skipUrls.size} 件をスキップ（--re-verify で再検証）\n`);
  }

  const toCheck = unique.filter((c) => !skipUrls.has(c.url));
  console.log(`検証対象: ${toCheck.length} 件（並列: ${CONCURRENCY}）\n`);

  const now = new Date().toISOString();
  const rows: DbRow[] = [];

  await pool(toCheck, CONCURRENCY, async ({ country_code, purpose, url }) => {
    const status = await checkUrl(url);
    rows.push({ country_code, purpose, url, status, last_verified_at: now, source: "ai_suggested" });
    console.log(`  ${country_code} [${purpose}] ${status.padEnd(5)} ${url}`);
  });

  if (!DRY_RUN && rows.length > 0) {
    const { error: upsertErr } = await supabase
      .from("country_sources")
      .upsert(rows, { onConflict: "country_code,url" });
    if (upsertErr) throw new Error(`upsert 失敗: ${upsertErr.message}`);
    console.log(`\n✅ ${rows.length} 件を upsert しました\n`);
  } else if (DRY_RUN) {
    console.log(`\n[DRY RUN] upsert スキップ（${rows.length} 件）\n`);
  }

  const dead      = rows.filter((r) => r.status === "dead");
  const alive     = rows.filter((r) => r.status === "alive");
  console.log(`=== 結果サマリー ===\nalive: ${alive.length}  dead: ${dead.length}`);

  if (dead.length > 0) {
    console.log(`\n=== ❌ DEAD URL 一覧 ===`);
    dead.sort((a, b) => a.country_code.localeCompare(b.country_code));
    let last = "";
    for (const r of dead) {
      if (r.country_code !== last) { console.log(`\n[${r.country_code.toUpperCase()}] (${r.purpose})`); last = r.country_code; }
      console.log(`  ${r.url}`);
    }
    // GHA 通知用
    process.exit(1);
  }
}

// ===== エントリポイント =====
async function main() {
  if (RECHECK_DEAD && RECHECK_UNVERIFIED) {
    await runRecheck(["dead", "unverified", "unknown"]);
  } else if (RECHECK_DEAD) {
    await runRecheck(["dead"]);
  } else if (RECHECK_UNVERIFIED) {
    await runRecheck(["unverified", "unknown"]);
  } else {
    await runExtract();
  }
}

main().catch((e) => {
  console.error("❌ エラー:", e.message);
  process.exit(1);
});

/**
 * country_sources テーブルへの URL 検証・投入スクリプト
 *
 * 処理フロー:
 *   1. blog_posts (visa-*)・study_blog_posts (study-country-*) の参考資料 URL を抽出
 *   2. 各 URL に HTTP HEAD リクエストを送り alive/dead を判定
 *   3. country_sources テーブルに upsert
 *   4. dead URL をコンソールに一覧出力
 *
 * 実行: npx tsx scripts/verify-country-sources.ts
 * オプション: --re-verify  既存 alive レコードも再検証する
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

const RE_VERIFY = process.argv.includes("--re-verify");
const DRY_RUN = process.argv.includes("--dry-run");
const TIMEOUT_MS = 10_000;
const CONCURRENCY = 5;

// Markdown リンクと裸の URL を抽出
function extractUrls(markdown: string): string[] {
  const urls = new Set<string>();

  // [text](url) 形式
  for (const m of markdown.matchAll(/\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g)) {
    urls.add(m[2].replace(/\)$/, "").trim());
  }

  // 裸の https:// URL
  for (const m of markdown.matchAll(/(?<!\()https?:\/\/[^\s)\]"']+/g)) {
    const url = m[0].replace(/[.,;:!?]$/, "");
    // Markdown リンクの一部でないもの
    if (!markdown.includes(`](${url})`)) urls.add(url);
  }

  // moveworthapp.com は除外（自サイト）
  return [...urls].filter(
    (u) => !u.includes("moveworthapp.com") && !u.includes("localhost")
  );
}

// 参考資料セクション以降の URL のみ対象にする（任意フィルタ）
function extractRefSectionUrls(markdown: string): string[] {
  const refIdx = markdown.search(/##\s*(参考資料|References|参考文献)/);
  const section = refIdx >= 0 ? markdown.slice(refIdx) : markdown;
  return extractUrls(section);
}

async function checkUrl(url: string): Promise<"alive" | "dead"> {
  const ua = "Mozilla/5.0 (compatible; MoveWorthBot/1.0)";

  // HEAD → GET フォールバック（HEAD を拒否する政府系サイト対策）
  for (const method of ["HEAD", "GET"] as const) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": ua },
      });
      clearTimeout(timer);
      if (res.status < 400) return "alive";
      // HEAD が 4xx なら GET で再試行
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

// 並列数を制限して実行
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

type SourceRow = {
  country_code: string;
  purpose: "visa" | "study" | "general";
  url: string;
  status: "alive" | "dead" | "unknown";
  last_verified_at: string;
  source: "ai_suggested";
};

async function run() {
  console.log("=== country_sources URL 検証スクリプト ===\n");

  // 1. visa-* 記事を取得（ja テキストのみ抽出してメモリ節約）
  const { data: visaPosts, error: visaErr } = await supabase
    .from("blog_posts")
    .select("slug, content->ja")
    .like("slug", "visa-%");
  if (visaErr) throw new Error(`blog_posts取得失敗: ${visaErr.message}`);

  // 2. study-country-* 記事を取得
  const { data: studyPosts, error: studyErr } = await supabase
    .from("study_blog_posts")
    .select("slug, content->ja")
    .like("slug", "study-country-%");
  if (studyErr) throw new Error(`study_blog_posts取得失敗: ${studyErr.message}`);

  console.log(`visa記事: ${visaPosts?.length ?? 0}件、study記事: ${studyPosts?.length ?? 0}件`);

  // 3. URL 収集
  const candidates: { country_code: string; purpose: "visa" | "study"; url: string }[] = [];

  for (const post of visaPosts ?? []) {
    const code = (post.slug as string).replace("visa-", "");
    // PostgREST の JSONB 抽出: content->ja のキーは "ja" になる
    const content: string = (post as Record<string, unknown>)["ja"] as string ?? "";
    for (const url of extractRefSectionUrls(content)) {
      candidates.push({ country_code: code, purpose: "visa", url });
    }
  }

  for (const post of studyPosts ?? []) {
    const code = (post.slug as string).replace("study-country-", "");
    const content: string = (post as Record<string, unknown>)["ja"] as string ?? "";
    for (const url of extractRefSectionUrls(content)) {
      candidates.push({ country_code: code, purpose: "study", url });
    }
  }

  // 重複除去（同一 country_code + url）
  const seen = new Set<string>();
  const unique = candidates.filter(({ country_code, url }) => {
    const key = `${country_code}::${url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`\n抽出 URL 件数: ${unique.length}\n`);
  if (unique.length === 0) {
    console.log("URL が見つかりませんでした。記事に参考資料セクションが含まれているか確認してください。");
    return;
  }

  // 4. 既存レコードを取得（--re-verify でなければ alive はスキップ）
  let skipUrls = new Set<string>();
  if (!RE_VERIFY) {
    const { data: existing } = await supabase
      .from("country_sources")
      .select("url, status")
      .eq("status", "alive");
    skipUrls = new Set((existing ?? []).map((r: { url: string }) => r.url));
    if (skipUrls.size > 0) {
      console.log(`既存 alive レコード ${skipUrls.size} 件をスキップ（--re-verify で再検証）\n`);
    }
  }

  const toCheck = unique.filter((c) => !skipUrls.has(c.url));
  console.log(`検証対象: ${toCheck.length} 件（並列数: ${CONCURRENCY}）\n`);

  // 5. HTTP チェック
  const now = new Date().toISOString();
  const rows: SourceRow[] = [];

  await pool(toCheck, CONCURRENCY, async ({ country_code, purpose, url }) => {
    process.stdout.write(`  ${country_code} [${purpose}] ${url} ... `);
    const status = await checkUrl(url);
    process.stdout.write(`${status}\n`);
    rows.push({
      country_code,
      purpose,
      url,
      status,
      last_verified_at: now,
      source: "ai_suggested",
    });
  });

  // 6. upsert（--dry-run では省略）
  if (rows.length > 0 && !DRY_RUN) {
    const { error: upsertErr } = await supabase
      .from("country_sources")
      .upsert(rows, { onConflict: "country_code,url" });
    if (upsertErr) throw new Error(`upsert 失敗: ${upsertErr.message}`);
    console.log(`\n✅ ${rows.length} 件を country_sources に upsert しました\n`);
  } else if (DRY_RUN) {
    console.log(`\n[DRY RUN] upsert をスキップ（${rows.length} 件）\n`);
  }

  // 7. dead URL 一覧を出力
  const dead = rows.filter((r) => r.status === "dead");
  const alive = rows.filter((r) => r.status === "alive");

  console.log(`=== 結果サマリー ===`);
  console.log(`alive: ${alive.length} 件`);
  console.log(`dead:  ${dead.length} 件`);

  if (dead.length > 0) {
    console.log(`\n=== ❌ DEAD URL 一覧（要確認・差し替え候補） ===`);
    // 国コード順にソート
    dead.sort((a, b) => a.country_code.localeCompare(b.country_code));
    let lastCode = "";
    for (const r of dead) {
      if (r.country_code !== lastCode) {
        console.log(`\n[${r.country_code.toUpperCase()}] (${r.purpose})`);
        lastCode = r.country_code;
      }
      console.log(`  ${r.url}`);
    }
  } else {
    console.log("\n全 URL が alive でした。");
  }
}

run().catch((e) => {
  console.error("❌ エラー:", e.message);
  process.exit(1);
});

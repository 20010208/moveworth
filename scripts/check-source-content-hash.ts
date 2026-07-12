/**
 * ソース本文ハッシュの保存・比較スクリプト
 *
 * 用途:
 *   alive な country_sources の本文 SHA-256 ハッシュを計算し、
 *   前回チェック時のハッシュと比較する。
 *   変化があれば「ソース更新検知」として GitHub Issue を作成する。
 *
 * 使用前提:
 *   country_sources テーブルに以下カラムが必要（Supabase ダッシュボードで追加）:
 *     ALTER TABLE country_sources
 *       ADD COLUMN IF NOT EXISTS content_hash TEXT,
 *       ADD COLUMN IF NOT EXISTS content_hash_at TIMESTAMPTZ;
 *
 * GHA での実行:
 *   npx tsx scripts/check-source-content-hash.ts
 *   環境変数: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 *             GH_TOKEN (GitHub Issue 作成用), GH_REPO (owner/repo 形式)
 */
import { existsSync, readFileSync } from "fs";
import { createHash } from "crypto";
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

const GH_TOKEN = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? "";
const GH_REPO  = process.env.GH_REPO ?? process.env.GITHUB_REPOSITORY ?? "";

const FETCH_TIMEOUT = 14_000;
const MAX_CHARS = 4_000;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

async function fetchPageText(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(url, {
      signal: controller.signal, redirect: "follow",
      headers: { "User-Agent": UA, "Accept": "text/html,*/*;q=0.8", "Accept-Language": "en-US,en;q=0.9" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("html") && !ct.includes("text")) return null;
    const html = await res.text();
    return stripHtml(html).slice(0, MAX_CHARS);
  } catch {
    clearTimeout(timer);
    return null;
  }
}

async function tryWayback(url: string): Promise<string | null> {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 8_000);
    const ar = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`, { signal: ac.signal });
    clearTimeout(t);
    if (!ar.ok) return null;
    type WBResp = { archived_snapshots?: { closest?: { url?: string; available?: boolean } } };
    const d = await ar.json() as WBResp;
    const snap = d.archived_snapshots?.closest;
    if (!snap?.available || !snap.url) return null;
    return await fetchPageText(snap.url);
  } catch {
    return null;
  }
}

function sha256(text: string): string {
  return createHash("sha256").update(text, "utf-8").digest("hex").slice(0, 16); // 先頭16文字で十分
}

async function createGitHubIssue(title: string, body: string): Promise<void> {
  if (!GH_TOKEN || !GH_REPO) {
    console.warn("⚠️  GH_TOKEN / GH_REPO 未設定 — GitHub Issue 作成をスキップ");
    console.warn(`  タイトル: ${title}`);
    return;
  }
  const [owner, repo] = GH_REPO.split("/");
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GH_TOKEN}`,
      "Content-Type": "application/json",
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({ title, body, labels: ["content", "source-updated"] }),
  });
  if (res.ok) {
    const issue = await res.json() as { html_url: string };
    console.log(`  ✅ Issue 作成: ${issue.html_url}`);
  } else {
    console.error(`  ❌ Issue 作成失敗: ${res.status} ${await res.text()}`);
  }
}

async function main() {
  console.log("=== ソース本文ハッシュチェック ===\n");

  // alive な全ソースを取得
  const { data: sources, error } = await supabase
    .from("country_sources")
    .select("id, country_code, purpose, url, content_hash, content_hash_at")
    .eq("status", "alive")
    .order("country_code");

  if (error) {
    // content_hash カラムが存在しない場合は明示的なエラーを出して終了
    if (error.message.includes("content_hash")) {
      console.error("❌ country_sources に content_hash カラムが存在しません。");
      console.error("   Supabase ダッシュボードで以下のSQLを実行してください:");
      console.error("   ALTER TABLE country_sources");
      console.error("     ADD COLUMN IF NOT EXISTS content_hash TEXT,");
      console.error("     ADD COLUMN IF NOT EXISTS content_hash_at TIMESTAMPTZ;");
      process.exit(1);
    }
    console.error("取得エラー:", error.message);
    process.exit(1);
  }

  type SourceRow = { id: string; country_code: string; purpose: string; url: string; content_hash: string | null; content_hash_at: string | null };
  const rows = (sources ?? []) as SourceRow[];
  console.log(`対象: ${rows.length}件\n`);

  const changed: { country_code: string; purpose: string; url: string; oldHash: string; newHash: string }[] = [];
  const fetchFailed: string[] = [];

  for (const row of rows) {
    process.stdout.write(`  [${row.country_code}/${row.purpose}] ${row.url.slice(0, 60)}... `);

    // コンテンツ取得
    let text = await fetchPageText(row.url);
    if (!text) text = await tryWayback(row.url);

    if (!text) {
      process.stdout.write("fetch失敗\n");
      fetchFailed.push(`${row.country_code}: ${row.url}`);
      continue;
    }

    const newHash = sha256(text);
    const oldHash = row.content_hash;

    // ハッシュが変化し、かつ前回の記録がある場合のみ「変化」とみなす
    if (oldHash && oldHash !== newHash) {
      process.stdout.write(`変化検知 (${oldHash} → ${newHash})\n`);
      changed.push({ country_code: row.country_code, purpose: row.purpose, url: row.url, oldHash, newHash });
    } else {
      process.stdout.write(oldHash ? `変化なし (${newHash})\n` : `初回記録 (${newHash})\n`);
    }

    // DB にハッシュを保存
    await supabase
      .from("country_sources")
      .update({ content_hash: newHash, content_hash_at: new Date().toISOString() })
      .eq("id", row.id);
  }

  console.log(`\n変化: ${changed.length}件  fetch失敗: ${fetchFailed.length}件`);

  if (changed.length > 0) {
    const date = new Date().toISOString().split("T")[0];
    const title = `[country-sources] ソース更新検知 — ${date} (${changed.length}件)`;
    const body = [
      "## country_sources のソース本文に変化が検出されました",
      "",
      "ソースが更新された可能性があります。関連するビザ記事の内容を確認・再生成してください。",
      "",
      "## 変化したソース",
      "",
      ...changed.map((c) =>
        `- **${c.country_code.toUpperCase()}** (${c.purpose}): \`${c.url}\`\n  - ハッシュ: \`${c.oldHash}\` → \`${c.newHash}\``
      ),
      "",
      "## 推奨対応",
      "",
      ...changed.map((c) =>
        `1. \`${c.country_code}\`: \`npx tsx scripts/generate-country-article.ts ${c.country_code}\` → レビュー後 \`--publish\``
      ),
    ].join("\n");

    await createGitHubIssue(title, body);
  }

  if (fetchFailed.length > 0) {
    console.log("\nfetch失敗 URL:");
    fetchFailed.forEach((u) => console.log(`  ${u}`));
  }

  console.log("\n=== 完了 ===");
}

main().catch(console.error);

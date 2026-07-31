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
import {
  stableSourceKey,
  searchOpenIssueByExactTitle,
  createIssue,
  addIssueComment,
} from "./utils/github-issue-dedup";

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

type ChangedSource = {
  id: string;
  countryCode: string;
  purpose: string;
  url: string;
  oldHash: string;
  newHash: string;
};

// source単位の安定タイトル（country_sources.id優先、なければ正規化URLのハッシュ）。
// source Aのopen issueがsource Bの通知を抑止しないよう、対象を1件に固定するタイトルにする。
function buildTitle(entry: ChangedSource): string {
  return `[country-sources][${stableSourceKey(entry.id, entry.url)}] ソース更新検知`;
}

function buildBody(entry: ChangedSource, detectedAt: string): string {
  return [
    "## country_sources のソース本文に変化が検出されました",
    "",
    `- country: ${entry.countryCode.toUpperCase()}`,
    `- category: ${entry.purpose}`,
    `- URL: ${entry.url}`,
    `- old hash: \`${entry.oldHash}\``,
    `- new hash: \`${entry.newHash}\``,
    `- detected at: ${detectedAt}`,
    "",
    "## 推奨対応",
    "",
    `1. \`${entry.countryCode}\`: \`npx tsx scripts/generate-country-article.ts ${entry.countryCode}\` → レビュー後 \`--publish\``,
  ].join("\n");
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

  const changed: ChangedSource[] = [];
  const fetchFailed: string[] = [];
  // 変化なし・初回記録は通知不要なので即時保存してよい。
  // 「変化あり」はGitHub通知が成功するまでDB hashを更新しない（Task 8: 通知失敗時に処理済み扱いしない）。
  const immediateUpdates: { id: string; newHash: string }[] = [];

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

    if (oldHash && oldHash !== newHash) {
      process.stdout.write(`変化検知 (${oldHash} → ${newHash})\n`);
      changed.push({ id: row.id, countryCode: row.country_code, purpose: row.purpose, url: row.url, oldHash, newHash });
    } else {
      process.stdout.write(oldHash ? `変化なし (${newHash})\n` : `初回記録 (${newHash})\n`);
      immediateUpdates.push({ id: row.id, newHash });
    }
  }

  for (const u of immediateUpdates) {
    await supabase
      .from("country_sources")
      .update({ content_hash: u.newHash, content_hash_at: new Date().toISOString() })
      .eq("id", u.id);
  }

  console.log(`\n変化: ${changed.length}件  fetch失敗: ${fetchFailed.length}件`);

  let notifySucceeded = 0;
  const notifyFailed: string[] = [];

  if (changed.length > 0 && (!GH_TOKEN || !GH_REPO)) {
    console.warn("⚠️  GH_TOKEN / GH_REPO 未設定 — 通知をスキップします（DB hashも更新しないため、次回実行時に再検出されます）");
    changed.forEach((c) => notifyFailed.push(buildTitle(c)));
  } else {
    const cfg = { token: GH_TOKEN, repo: GH_REPO };
    for (const entry of changed) {
      const title = buildTitle(entry);
      const detectedAt = new Date().toISOString();
      try {
        const existing = await searchOpenIssueByExactTitle(title, cfg);
        if (existing) {
          await addIssueComment(existing.number, buildBody(entry, detectedAt), cfg);
          console.log(`  既存Issue #${existing.number} へコメント追加: ${title}`);
        } else {
          const created = await createIssue(title, buildBody(entry, detectedAt), ["content", "source-updated"], cfg);
          console.log(`  新規Issue作成 #${created.number}: ${title}`);
        }
        // 通知が成功した場合にのみDB hashを更新する（Task 8: 通知前に確定保存しない）
        await supabase
          .from("country_sources")
          .update({ content_hash: entry.newHash, content_hash_at: detectedAt })
          .eq("id", entry.id);
        notifySucceeded++;
      } catch (e) {
        console.error(`  ❌ 通知失敗（DB hashは更新しません・次回実行時に再検出されます）: ${title}: ${(e as Error).message}`);
        notifyFailed.push(title);
      }
    }
  }

  if (changed.length > 0) {
    console.log(`\n=== 通知結果 === 成功: ${notifySucceeded}件 / 失敗: ${notifyFailed.length}件`);
    if (notifyFailed.length > 0) {
      console.error("通知に失敗した対象（次回実行時に再検出されます）:");
      notifyFailed.forEach((t) => console.error(`  - ${t}`));
    }
  }

  if (fetchFailed.length > 0) {
    console.log("\nfetch失敗 URL:");
    fetchFailed.forEach((u) => console.log(`  ${u}`));
  }

  console.log("\n=== 完了 ===");

  if (notifyFailed.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error("❌", e instanceof Error ? e.message : e);
  process.exitCode = 1;
});

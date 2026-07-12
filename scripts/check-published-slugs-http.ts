/**
 * 全公開スラッグへの HTTP 200 確認スクリプト
 * Vercel 本番 URL に対してリクエストし、200 以外をリストアップする
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

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_URL = "https://www.moveworthapp.com";
const CONCURRENCY = 5;
const TIMEOUT_MS = 15_000;

async function checkSlug(slug: string): Promise<{ slug: string; status: number | "timeout" | "error"; ok: boolean }> {
  const url = `${BASE_URL}/blog/${slug}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "MoveWorth-Health-Check/1.0" },
    });
    clearTimeout(timer);
    return { slug, status: res.status, ok: res.status === 200 };
  } catch (e) {
    clearTimeout(timer);
    const isTimeout = e instanceof Error && e.message.includes("abort");
    return { slug, status: isTimeout ? "timeout" : "error", ok: false };
  }
}

async function main() {
  console.log("=== 公開スラッグ HTTP 200 確認 ===\n");

  const { data, error } = await sb
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) { console.error("取得エラー:", error.message); process.exit(1); }

  const slugs = (data ?? []).map((r: { slug: string }) => r.slug);
  console.log(`対象: ${slugs.length} 件\n`);

  const results: Array<{ slug: string; status: number | "timeout" | "error"; ok: boolean }> = [];

  // CONCURRENCY 件ずつ並列チェック
  for (let i = 0; i < slugs.length; i += CONCURRENCY) {
    const batch = slugs.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(checkSlug));
    for (const r of batchResults) {
      const mark = r.ok ? "✅" : "❌";
      process.stdout.write(`  ${mark} [${r.status}] /blog/${r.slug}\n`);
      results.push(r);
    }
  }

  const ok = results.filter(r => r.ok);
  const ng = results.filter(r => !r.ok);

  console.log(`\n=== 結果 ===`);
  console.log(`✅ 200 OK: ${ok.length} 件 / ${results.length} 件`);
  if (ng.length > 0) {
    console.log(`❌ 異常: ${ng.length} 件`);
    for (const r of ng) {
      console.log(`   [${r.status}] /blog/${r.slug}`);
    }
  } else {
    console.log(`❌ 異常: 0 件`);
  }

  process.exit(ng.length > 0 ? 1 : 0);
}

main().catch(console.error);

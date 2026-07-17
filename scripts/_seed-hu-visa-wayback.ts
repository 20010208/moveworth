/**
 * HU visa sources: oif.gov.hu（SPA/失敗）→ Wayback スナップショット URL に差し替え
 *
 * 問題: oif.gov.hu の全3ページが SPA 判定で isSourceUseful 失敗
 * 解決: Wayback Machine の静的スナップショット URL を直接登録し、
 *        fetchPageText が SPA 迂回なしに静的 HTML を取得できるようにする
 *
 * Wayback スナップショット（generate-country-article.ts ログより）:
 *   White Card (feher-kartya): 2026-05-15 スナップショット
 *   Guest Investor (vendegbefektetoi): 2026-05-12 スナップショット
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

async function main() {
  // 1. 既存の oif.gov.hu visa-purpose エントリを削除
  const { error: delErr, count } = await sb
    .from("country_sources")
    .delete({ count: "exact" })
    .eq("country_code", "hu")
    .eq("purpose", "visa")
    .ilike("url", "%oif.gov.hu%");
  if (delErr) { console.error("❌ 削除失敗:", delErr.message); process.exit(1); }
  console.log(`✅ 削除: oif.gov.hu visa エントリ ${count}件`);

  // 2. Wayback スナップショット URL を登録
  const { error: insErr } = await sb.from("country_sources").insert([
    {
      country_code: "hu",
      url: "http://web.archive.org/web/20260515142238/https://www.oif.gov.hu/tajekoztatok/feher-kartya-digitalis-nomad-tartozkodas",
      purpose: "visa",
      source: "manual",
      status: "alive",
    },
    {
      country_code: "hu",
      url: "http://web.archive.org/web/20260512035747/https://oif.gov.hu/tajekoztatok/vendegbefektetoi-vizum",
      purpose: "visa",
      source: "manual",
      status: "alive",
    },
  ]);
  if (insErr) { console.error("❌ 登録失敗:", insErr.message); process.exit(1); }
  console.log("✅ 登録: Wayback snapshots (White Card 2026-05-15 + Guest Investor 2026-05-12)");

  // 3. 最終状態確認
  console.log("\n=== HU country_sources 最終状態 ===");
  const { data } = await sb
    .from("country_sources")
    .select("url, purpose, source, status")
    .eq("country_code", "hu")
    .order("purpose");
  for (const r of data ?? []) console.log(`[${r.purpose}/${r.status}/${r.source}] ${r.url}`);
}
main().catch(e => { console.error(e); process.exit(1); });

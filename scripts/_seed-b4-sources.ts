/**
 * C-5 Batch 4（EE/GR/HU）— Eurostat salary & living_cost sources 登録
 * EARN_SES22_20: 全3カ国（GRはEurostat表記EL）
 * HBS_EXP_T135:  全3カ国
 * HBS_STR_T223:  全3カ国（2020データあり、CP041+CP042修正式適用）
 * country_code は app 側コード（gr / ee / hu）を使用
 */
import { existsSync, readFileSync } from "fs";
if (existsSync(".env.local")) {
  for (const l of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = l.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim();
    if (!(k in process.env)) process.env[k] = t.slice(eq + 1).trim();
  }
}
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const now = new Date().toISOString();
type Row = { country_code: string; url: string; purpose: string; status: string; last_verified_at: string; source: string };

const COUNTRIES_ALL = ["ee", "gr", "hu"];

const rows: Row[] = [];
for (const c of COUNTRIES_ALL) {
  for (const dataset of ["EARN_SES22_20", "HBS_EXP_T135", "HBS_STR_T223"]) {
    rows.push({
      country_code: c,
      url: `https://ec.europa.eu/eurostat/databrowser/view/${dataset}/default/table`,
      purpose: "general",
      status: "alive",
      last_verified_at: now,
      source: "manual",
    });
  }
}

async function main() {
  console.log(`登録予定: ${rows.length} 件`);
  for (const r of rows) console.log(`  ${r.country_code.toUpperCase()} ${r.url.split("/").slice(-3,-1).join("/")} purpose=${r.purpose}`);

  const { error } = await sb.from("country_sources").upsert(rows, { onConflict: "country_code,url" });
  if (error) { console.error("upsert error:", error.message); process.exit(1); }
  console.log("\n✅ upsert 完了");

  const { data } = await sb
    .from("country_sources")
    .select("country_code,url,status,purpose")
    .in("country_code", COUNTRIES_ALL)
    .in("url", [...new Set(rows.map(r => r.url))]);
  console.log(`\n登録確認: ${data?.length ?? 0} 件`);
  for (const r of data ?? []) {
    console.log(`  ${r.country_code.toUpperCase()} ${r.url.split("/").slice(-3,-1).join("/")} [${r.purpose}] ${r.status}`);
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });

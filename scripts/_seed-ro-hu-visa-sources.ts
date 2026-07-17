/**
 * RO・HU の visa 用 country_sources 登録
 *  - RO: igi.mai.gov.ro（長期滞在ビザ・居住許可）
 *  - HU: oif.gov.hu（外国人登録総局、旧bmbah.hu）+ White Card + Guest Investor ページ
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
  // ─── RO ───────────────────────────────────────────────────────────────────
  console.log("=== RO visa sources 登録 ===");

  const roSources = [
    {
      country_code: "ro",
      url: "https://igi.mai.gov.ro/en/long-stay-visa-for-employment/",
      purpose: "visa",
      source: "manual",
      status: "alive",
    },
    {
      country_code: "ro",
      url: "https://igi.mai.gov.ro/en/residence-permit/",
      purpose: "visa",
      source: "manual",
      status: "alive",
    },
  ];

  const { error: roErr } = await sb.from("country_sources").insert(roSources);
  if (roErr) { console.error("❌ RO 登録失敗:", roErr.message); process.exit(1); }
  console.log("✅ RO 登録: igi.mai.gov.ro (long-stay-visa + residence-permit)");

  // ─── HU ───────────────────────────────────────────────────────────────────
  console.log("\n=== HU visa sources 登録 ===");

  const huSources = [
    {
      country_code: "hu",
      url: "https://oif.gov.hu/en/",
      purpose: "visa",
      source: "manual",
      status: "alive",
    },
    {
      country_code: "hu",
      url: "https://oif.gov.hu/tajekoztatok/feher-kartya-digitalis-nomad-tartozkodas",
      purpose: "visa",
      source: "manual",
      status: "alive",
    },
    {
      country_code: "hu",
      url: "https://oif.gov.hu/tajekoztatok/vendegbefektetoi-vizum",
      purpose: "visa",
      source: "manual",
      status: "alive",
    },
  ];

  const { error: huErr } = await sb.from("country_sources").insert(huSources);
  if (huErr) { console.error("❌ HU 登録失敗:", huErr.message); process.exit(1); }
  console.log("✅ HU 登録: oif.gov.hu (top + White Card + Guest Investor)");

  // ─── 確認 ──────────────────────────────────────────────────────────────────
  console.log("\n=== RO country_sources 最終状態 ===");
  const { data: roAll } = await sb
    .from("country_sources")
    .select("url, purpose, source, status")
    .eq("country_code", "ro")
    .order("purpose");
  for (const r of roAll ?? []) console.log(`[${r.purpose}/${r.status}/${r.source}] ${r.url}`);

  console.log("\n=== HU country_sources 最終状態 ===");
  const { data: huAll } = await sb
    .from("country_sources")
    .select("url, purpose, source, status")
    .eq("country_code", "hu")
    .order("purpose");
  for (const r of huAll ?? []) console.log(`[${r.purpose}/${r.status}/${r.source}] ${r.url}`);
}
main().catch(e => { console.error(e); process.exit(1); });

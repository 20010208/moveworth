/**
 * ギリシャ ゴールデンビザ 2024年改定（€800K/€400K/€250K）の情報源として
 * Enterprise Greece ニュースレターを country_sources に登録する
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
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const ENTRY = {
  country_code: "gr",
  url: "https://newsletters.enterprisegreece.gov.gr/newsletter-articles/greece-adjusts-golden-visa-program-amid-rising-outlook-for-property-market/",
  purpose: "visa" as const,
  status: "alive" as const,
  source: "manual" as const,
};

async function main() {
  const { data: existing } = await sb
    .from("country_sources")
    .select("id")
    .eq("country_code", ENTRY.country_code)
    .eq("url", ENTRY.url)
    .limit(1);

  if (existing && existing.length > 0) {
    console.log("⏭ 既存: Enterprise Greece GR ニュースレター（スキップ）");
    return;
  }

  const { error } = await sb.from("country_sources").insert(ENTRY);
  if (error) {
    console.error("❌ 登録失敗:", error.message);
    process.exit(1);
  }
  console.log("✅ 登録: Enterprise Greece GR — Greece Golden Visa 2024 thresholds (€800K/€400K/€250K)");
}

main().catch(e => { console.error(e); process.exit(1); });

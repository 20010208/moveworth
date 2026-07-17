/**
 * ES（スペイン）デジタルノマドビザ country_sources 登録
 * URL: one.gob.es/en/procedures/application-digital-nomad-visa
 * 確認: HTTP 200・コンテンツ取得済み（2026-07-17）
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

const SOURCES = [
  {
    country_code: "es",
    url: "https://one.gob.es/en/procedures/application-digital-nomad-visa",
    purpose: "visa",
    source: "manual",
    status: "alive",
  },
];

async function main() {
  for (const s of SOURCES) {
    const { error } = await sb.from("country_sources").upsert(s, { onConflict: "country_code,url" });
    if (error) {
      console.error(`❌ ${s.country_code} ${s.url}: ${error.message}`);
    } else {
      console.log(`✅ ${s.country_code} [${s.purpose}] ${s.url}`);
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });

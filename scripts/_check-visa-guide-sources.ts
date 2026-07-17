/**
 * PT/ES/DE/IT の country_sources(visa) 登録状況確認
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
  const codes = ["pt", "es", "de", "it"];
  for (const code of codes) {
    const { data } = await sb.from("country_sources").select("url, title, purpose, status").eq("country_code", code);
    console.log(`\n[${code.toUpperCase()}] ${data?.length ?? 0}件`);
    for (const r of (data ?? [])) {
      console.log(`  [${r.purpose}/${r.status}] ${r.url}`);
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });

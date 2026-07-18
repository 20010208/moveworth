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

const ROWS = [
  { country_code: "de", url: "https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Einkommen-Konsum-Lebensbedingungen/Konsumausgaben-Lebenshaltungskosten/Tabellen/privater-konsum-haushaltsgroesse-evs.html", purpose: "living_cost", source: "manual", status: "alive" },
  { country_code: "at", url: "https://www.statistik.at/statistiken/bevoelkerung-und-soziales/ausgaben-und-ausstattung-privater-haushalte/ausgaben", purpose: "living_cost", source: "manual", status: "alive" },
  { country_code: "es", url: "https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736176806&menu=ultiDatos&idp=1254735976608", purpose: "living_cost", source: "manual", status: "alive" },
  { country_code: "nl", url: "https://www.cbs.nl/en-gb/figures/detail/85873ENG", purpose: "living_cost", source: "manual", status: "alive" },
  { country_code: "fi", url: "https://stat.fi/en/statistics/ktutk", purpose: "living_cost", source: "manual", status: "alive" },
];

async function main() {
  for (const r of ROWS) {
    const { error } = await sb.from("country_sources").insert(r);
    console.log(error ? `❌ ${r.country_code}: ${error.message}` : `✅ ${r.country_code} living_cost`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });

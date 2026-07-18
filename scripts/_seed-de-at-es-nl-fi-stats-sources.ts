/**
 * DE/AT/ES/NL/FI の salary・living_cost 用 country_sources 登録
 * 各国統計局の業種別給与・家計消費支出ページ
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
  // DE — Destatis
  {
    country_code: "de",
    url: "https://www.destatis.de/DE/Themen/Arbeit/Verdienste/Verdienste-Branche-Berufe/Tabellen/_tabellen-innen-verdienste-nach-branchen.html",
    purpose: "salary",
    source: "manual",
    status: "alive",
  },
  {
    country_code: "de",
    url: "https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Einkommen-Konsum-Lebensbedingungen/Konsumausgaben-Lebenshaltungskosten/Tabellen/privater-konsum-haushaltsgroesse-evs.html",
    purpose: "living_cost",
    source: "manual",
    status: "alive",
  },
  // AT — Statistik Austria
  {
    country_code: "at",
    url: "https://www.statistik.at/statistiken/bevoelkerung-und-soziales/einkommen-und-soziale-lage/verdienststruktur",
    purpose: "salary",
    source: "manual",
    status: "alive",
  },
  {
    country_code: "at",
    url: "https://www.statistik.at/statistiken/bevoelkerung-und-soziales/ausgaben-und-ausstattung-privater-haushalte/ausgaben",
    purpose: "living_cost",
    source: "manual",
    status: "alive",
  },
  // ES — INE
  {
    country_code: "es",
    url: "https://ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177025&menu=ultiDatos&idp=1254735976596",
    purpose: "salary",
    source: "manual",
    status: "alive",
  },
  {
    country_code: "es",
    url: "https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736176806&menu=ultiDatos&idp=1254735976608",
    purpose: "living_cost",
    source: "manual",
    status: "alive",
  },
  // NL — CBS Statistics Netherlands
  {
    country_code: "nl",
    url: "https://www.cbs.nl/en-gb/figures/detail/85919ENG",
    purpose: "salary",
    source: "manual",
    status: "alive",
  },
  {
    country_code: "nl",
    url: "https://www.cbs.nl/en-gb/figures/detail/85873ENG",
    purpose: "living_cost",
    source: "manual",
    status: "alive",
  },
  // FI — Statistics Finland
  {
    country_code: "fi",
    url: "https://stat.fi/en/statistics/pra",
    purpose: "salary",
    source: "manual",
    status: "alive",
  },
  {
    country_code: "fi",
    url: "https://stat.fi/en/statistics/ktutk",
    purpose: "living_cost",
    source: "manual",
    status: "alive",
  },
];

async function main() {
  console.log(`=== DE/AT/ES/NL/FI stats sources 登録 (${SOURCES.length}件) ===\n`);
  for (const s of SOURCES) {
    const { error } = await sb.from("country_sources").insert(s);
    if (error) {
      console.error(`❌ ${s.country_code} ${s.purpose}: ${error.message}`);
    } else {
      console.log(`✅ ${s.country_code} [${s.purpose}]: ${s.url.slice(0, 70)}...`);
    }
  }
  console.log("\n完了");
}
main().catch(e => { console.error(e); process.exit(1); });

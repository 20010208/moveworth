/**
 * GB/JP salary・living_cost 用 country_sources 登録
 * GB: ONS ASHE 2023 Table 16（業種別年収）+ ONS LCF FYE2023（家計消費支出）
 * JP: MHLW 賃金構造基本統計 令和5年（業種別月額賃金、賞与除く）
 *
 * JP living_cost: 家計調査はPDF専用・e-Stat APIキー未設定のため取得不可→登録なし
 * GB referenceRent: ONS PRMS未調査→登録なし（BACKLOG）
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
  // GB — ONS ASHE Table 16 (2023 Provisional): SIC 2007 Section別 中央値年収
  {
    country_code: "gb",
    url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/datasets/industry4digitsic2007ashetable16",
    purpose: "salary",
    source: "manual",
    status: "alive",
  },
  // GB — ONS LCF Workbook 1 FYE2023: 家計消費支出・実家賃シェア（Table A1）
  {
    country_code: "gb",
    url: "https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/expenditure/datasets/familyspendingworkbook1detailedexpenditureandtrends",
    purpose: "living_cost",
    source: "manual",
    status: "alive",
  },
  // JP — MHLW 賃金構造基本統計 令和5年: 産業別月額賃金（第５－１表、賞与除く）
  {
    country_code: "jp",
    url: "https://www.mhlw.go.jp/toukei/itiran/roudou/chingin/kouzou/z2023/",
    purpose: "salary",
    source: "manual",
    status: "alive",
  },
];

async function main() {
  console.log(`=== GB/JP stats sources 登録 (${SOURCES.length}件) ===\n`);
  for (const s of SOURCES) {
    const { error } = await sb.from("country_sources").insert(s);
    if (error) {
      console.error(`❌ ${s.country_code} [${s.purpose}]: ${error.message}`);
    } else {
      console.log(`✅ ${s.country_code} [${s.purpose}]: ${s.url.slice(0, 80)}`);
    }
  }
  console.log("\n完了");
}
main().catch(e => { console.error(e); process.exit(1); });

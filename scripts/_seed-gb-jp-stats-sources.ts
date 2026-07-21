/**
 * GB/JP salary・living_cost 用 country_sources 登録
 * GB: ONS ASHE 2023 Table 16（業種別年収）+ ONS LCF FYE2023（家計消費支出）
 *     + ONS PRMS 2022年10月～2023年9月（England全域・全物件タイプ家賃中央値）
 * JP: MHLW 賃金構造基本統計 令和5年（業種別月額賃金、賞与除く）
 *
 * JP living_cost: 家計調査はPDF専用・e-Stat APIキー未設定のため取得不可→登録なし
 *
 * Usage:
 *   npx tsx scripts/_seed-gb-jp-stats-sources.ts
 *   npx tsx scripts/_seed-gb-jp-stats-sources.ts gb-prms
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

const verifiedAt = new Date().toISOString();
const SOURCES = [
  // GB — ONS ASHE Table 16 (2023 Provisional): SIC 2007 Section別 中央値年収
  {
    key: "gb-ashe",
    country_code: "gb",
    url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/datasets/industry4digitsic2007ashetable16",
    purpose: "salary",
    source: "manual",
    status: "alive",
  },
  // GB — ONS LCF Workbook 1 FYE2023: 家計消費支出・実家賃シェア（Table A1）
  {
    key: "gb-lcf",
    country_code: "gb",
    url: "https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/expenditure/datasets/familyspendingworkbook1detailedexpenditureandtrends",
    purpose: "living_cost",
    source: "manual",
    status: "alive",
  },
  // GB — ONS PRMS最終公表: England全域・全物件タイプ月額家賃中央値
  {
    key: "gb-prms",
    country_code: "gb",
    url: "https://www.ons.gov.uk/peoplepopulationandcommunity/housing/bulletins/privaterentalmarketsummarystatisticsinengland/october2022toseptember2023",
    purpose: "living_cost",
    source: "manual",
    status: "alive",
  },
  // JP — MHLW 賃金構造基本統計 令和5年: 産業別月額賃金（第５－１表、賞与除く）
  {
    key: "jp-wages",
    country_code: "jp",
    url: "https://www.mhlw.go.jp/toukei/itiran/roudou/chingin/kouzou/z2023/",
    purpose: "salary",
    source: "manual",
    status: "alive",
  },
] as const;

async function main() {
  const requestedKey = process.argv[2];
  const targetSources = requestedKey
    ? SOURCES.filter((row) => row.key === requestedKey)
    : [...SOURCES];
  if (targetSources.length === 0) {
    throw new Error(`対象ソースキーが不正です: ${requestedKey}`);
  }

  const rows = targetSources.map((row) => ({
    country_code: row.country_code,
    url: row.url,
    purpose: row.purpose,
    source: row.source,
    status: row.status,
    last_verified_at: verifiedAt,
  }));

  console.log(`=== GB/JP stats sources 登録 (${rows.length}件) ===\n`);
  const { error: upsertError } = await sb
    .from("country_sources")
    .upsert(rows, { onConflict: "country_code,url" });
  if (upsertError) throw new Error(`country_sources upsert失敗: ${upsertError.message}`);

  const { data, error: readError } = await sb
    .from("country_sources")
    .select("country_code,url,purpose,status,source,last_verified_at")
    .in("country_code", rows.map((row) => row.country_code))
    .in("url", rows.map((row) => row.url));
  if (readError) throw new Error(`country_sources再読込失敗: ${readError.message}`);
  if (data?.length !== rows.length) {
    throw new Error(`country_sources件数不一致: expected=${rows.length}, actual=${data?.length ?? 0}`);
  }

  for (const expected of rows) {
    const actual = data.find(
      (row) => row.country_code === expected.country_code && row.url === expected.url
    );
    if (
      !actual ||
      actual.purpose !== expected.purpose ||
      actual.status !== expected.status ||
      actual.source !== expected.source ||
      new Date(actual.last_verified_at).getTime() !== new Date(expected.last_verified_at).getTime()
    ) {
      throw new Error(`country_sources保存値不一致: ${expected.url}`);
    }
    console.log(`✅ ${actual.country_code.toUpperCase()} [${actual.purpose}]: ${actual.url}`);
  }
  console.log("\n完了");
}
main().catch(e => { console.error(e); process.exit(1); });

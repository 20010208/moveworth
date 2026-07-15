/**
 * visa-guide 生成用の country_sources を登録するシードスクリプト
 * 既に登録済みの (country_code, url) の組み合わせはスキップする
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

interface SourceEntry {
  country_code: string;
  url: string;
  label: string; // ログ用
}

const ENTRIES: SourceEntry[] = [
  // MY: MM2H（パッチ済み正URL）
  {
    country_code: "my",
    url: "https://www.imi.gov.my/index.php/en/main-services/mm2h.html",
    label: "MY: MM2H（マレーシア移民局）",
  },
  // GR: ゴールデンビザ
  {
    country_code: "gr",
    url: "https://migration.gov.gr/en/",
    label: "GR: Greece Migration Ministry",
  },
  // TH: LTR visa
  {
    country_code: "th",
    url: "https://ltr.boi.go.th",
    label: "TH: BOI LTR Visa",
  },
  // AE: UAE Golden Visa
  {
    country_code: "ae",
    url: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/golden-visa",
    label: "AE: UAE Golden Visa (u.ae)",
  },
  // SG: Employment Pass
  {
    country_code: "sg",
    url: "https://www.mom.gov.sg/passes-and-permits/employment-pass",
    label: "SG: MOM Employment Pass",
  },
  // NZ: Skilled Migrant
  {
    country_code: "nz",
    url: "https://www.immigration.govt.nz/new-zealand-visas/visas/visa/skilled-migrant-category-resident-visa",
    label: "NZ: Skilled Migrant Category Resident Visa",
  },
  // CA: Express Entry
  {
    country_code: "ca",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html",
    label: "CA: Express Entry (canada.ca)",
  },
  // CA: 申請費用一覧（CAはエラー文言混入注意のため補強ページとして追加）
  {
    country_code: "ca",
    url: "https://www.ircc.canada.ca/english/information/fees/fees.asp",
    label: "CA: IRCC Fee List",
  },
  // AU: Skilled Independent 189（403 bot blocked だが GHA からは取得できる可能性あり）
  {
    country_code: "au",
    url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189",
    label: "AU: Skilled Independent Visa (Subclass 189)",
  },
];

async function main() {
  let added = 0;
  let skipped = 0;

  for (const entry of ENTRIES) {
    // 既存チェック
    const { data: existing } = await sb
      .from("country_sources")
      .select("id")
      .eq("country_code", entry.country_code)
      .eq("url", entry.url)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log(`⏭ 既存: ${entry.label}`);
      skipped++;
      continue;
    }

    const { error } = await sb.from("country_sources").insert({
      country_code: entry.country_code,
      url: entry.url,
      purpose: "visa",
      status: "alive",
      source: "manual",
    });

    if (error) {
      console.error(`❌ 登録失敗: ${entry.label} — ${error.message}`);
    } else {
      console.log(`✅ 登録: ${entry.label}`);
      added++;
    }
  }

  console.log(`\n完了: 登録 ${added}件, スキップ ${skipped}件`);
}

main().catch(e => { console.error(e); process.exit(1); });

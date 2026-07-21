/**
 * BL-20260721-02 — BG / CY 政府公式 visa sources 登録
 *
 * 対象6件だけをupsertし、再読込で保存値と対象外BG/CYレコード不変を検証する。
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator < 0) continue;
    const key = trimmed.slice(0, separator).trim();
    if (!(key in process.env)) {
      process.env[key] = trimmed.slice(separator + 1).trim();
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY が未設定です");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const verifiedAt = new Date().toISOString();

const sourceSpecs = [
  {
    label: "BG: Visa D（長期滞在査証）",
    country_code: "bg",
    url: "https://iisda.government.bg/adm_services/services/service_provision/38527",
  },
  {
    label: "BG: 非EU市民の継続滞在許可",
    country_code: "bg",
    url: "https://iisda.government.bg/adm_services/services/service_provision/21815",
  },
  {
    label: "CY: Visas",
    country_code: "cy",
    url: "https://www.gov.cy/en/information/visas/",
  },
  {
    label: "CY: Entry・Residence申請手順",
    country_code: "cy",
    url: "https://www.gov.cy/mip-md/en/documents/procedure-for-application-submission-for-entry-and-residence-and-processing-time/",
  },
  {
    label: "CY: Visitors and family members",
    country_code: "cy",
    url: "https://www.gov.cy/mip-md/en/documents/visitors-and-family-members/",
  },
  {
    label: "CY: Immigration Permits",
    country_code: "cy",
    url: "https://www.gov.cy/mip-md/en/documents/companies-investors-permanent-residence-3/immigration-permits/",
  },
] as const;

const targetKeys = new Set(sourceSpecs.map((row) => `${row.country_code}\n${row.url}`));
const toKey = (row: { country_code: string; url: string }) => `${row.country_code}\n${row.url}`;

type SourceRow = {
  id: string;
  country_code: string;
  url: string;
  purpose: string;
  status: string;
  source: string;
  last_verified_at: string | null;
};

function normalize(rows: SourceRow[]) {
  return [...rows].sort((a, b) => toKey(a).localeCompare(toKey(b)));
}

async function readBgCySources(): Promise<SourceRow[]> {
  const { data, error } = await supabase
    .from("country_sources")
    .select("id,country_code,url,purpose,status,source,last_verified_at")
    .in("country_code", ["bg", "cy"]);
  if (error) throw new Error(`country_sources読込失敗: ${error.message}`);
  return normalize((data ?? []) as SourceRow[]);
}

async function main() {
  const before = await readBgCySources();
  const beforeTargets = before.filter((row) => targetKeys.has(toKey(row)));
  const beforeNonTargets = before.filter((row) => !targetKeys.has(toKey(row)));

  console.log(`登録予定: ${sourceSpecs.length}件`);
  console.log(`事前対象件数: ${beforeTargets.length}件`);
  console.log(`事前BG/CY対象外件数: ${beforeNonTargets.length}件`);

  const rows = sourceSpecs.map((row) => ({
    country_code: row.country_code,
    url: row.url,
    purpose: "visa",
    status: "alive",
    source: "manual",
    last_verified_at: verifiedAt,
  }));

  const { error: upsertError } = await supabase
    .from("country_sources")
    .upsert(rows, { onConflict: "country_code,url" });
  if (upsertError) throw new Error(`country_sources upsert失敗: ${upsertError.message}`);

  const after = await readBgCySources();
  const afterTargets = after.filter((row) => targetKeys.has(toKey(row)));
  const afterNonTargets = after.filter((row) => !targetKeys.has(toKey(row)));

  if (afterTargets.length !== sourceSpecs.length) {
    throw new Error(
      `対象件数不一致: expected=${sourceSpecs.length}, actual=${afterTargets.length}`
    );
  }

  for (const expected of sourceSpecs) {
    const actual = afterTargets.find((row) => toKey(row) === toKey(expected));
    if (
      !actual ||
      actual.purpose !== "visa" ||
      actual.status !== "alive" ||
      actual.source !== "manual" ||
      !actual.last_verified_at ||
      new Date(actual.last_verified_at).getTime() !== new Date(verifiedAt).getTime()
    ) {
      throw new Error(`保存値不一致: ${expected.label}`);
    }
    console.log(`✅ ${expected.label}: ${actual.url}`);
  }

  if (JSON.stringify(beforeNonTargets) !== JSON.stringify(afterNonTargets)) {
    throw new Error("BG/CYの対象外country_sourcesに変更を検出しました");
  }

  const expectedAfterCount = before.length + sourceSpecs.length - beforeTargets.length;
  if (after.length !== expectedAfterCount) {
    throw new Error(`BG/CY総件数不一致: expected=${expectedAfterCount}, actual=${after.length}`);
  }

  console.log(`再読込検証: ${afterTargets.length}/${sourceSpecs.length}件一致`);
  console.log(`対象外不変: ${afterNonTargets.length}件`);
  console.log(`BG/CY総件数: ${before.length} -> ${after.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

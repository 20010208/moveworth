/**
 * C-5 Group B（CA/AU/CH）— 公式業種別給与ソース登録
 *
 * CA: it / mediaはNAICS 51+71合算のため同値
 *     （StatsCan表の構造上分離不可）
 * CH: FSO LSE 2024 NOGA section集計非公開・取得不可・現行値据え置き
 *     （infrastructure除く。division 35のみ取得可能）
 * AU生活費: HES成人換算係数非公開・取得不可・現行値据え置き
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const verifiedAt = new Date().toISOString();
const sources = [
  {
    country_code: "ca",
    purpose: "salary",
    url: "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1410006401",
    status: "alive",
    source: "manual",
    last_verified_at: verifiedAt,
  },
  {
    country_code: "au",
    purpose: "salary",
    url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/employee-earnings-and-hours-australia/latest-release",
    status: "alive",
    source: "manual",
    last_verified_at: verifiedAt,
  },
  {
    country_code: "ch",
    purpose: "salary",
    url: "https://www.pxweb.bfs.admin.ch/pxweb/de/px-x-0304010000_206/px-x-0304010000_206/px-x-0304010000_206.px",
    status: "alive",
    source: "manual",
    last_verified_at: verifiedAt,
  },
] as const;

async function main() {
  console.log(`登録予定: ${sources.length}件`);

  const { error: upsertError } = await supabase
    .from("country_sources")
    .upsert([...sources], { onConflict: "country_code,url" });
  if (upsertError) throw new Error(`country_sources upsert失敗: ${upsertError.message}`);

  const { data, error: readError } = await supabase
    .from("country_sources")
    .select("country_code,url,purpose,status,source,last_verified_at")
    .in("country_code", sources.map((row) => row.country_code))
    .in("url", sources.map((row) => row.url))
    .order("country_code");
  if (readError) throw new Error(`country_sources再読込失敗: ${readError.message}`);

  if (data?.length !== sources.length) {
    throw new Error(`country_sources件数不一致: expected=${sources.length}, actual=${data?.length ?? 0}`);
  }

  for (const expected of sources) {
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
      throw new Error(`country_sources保存値不一致: ${expected.country_code}`);
    }
    console.log(`✅ ${actual.country_code.toUpperCase()} [${actual.purpose}] ${actual.url}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

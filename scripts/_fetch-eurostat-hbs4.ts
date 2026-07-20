/**
 * Eurostat HBS2020 生活費（修正版）
 * - HBS_EXP_T135: 総支出 PPS/AE/year, 2020, TOTAL age
 * - HBS_STR_T223: CP04 per mille (PM), 2020 のみ, QU1-QU5 平均
 * - 非住居費 = 総支出 × (1 - CP04_PM/1000) → PPP換算でローカル通貨月額
 */
const COUNTRIES = ["FR", "IT", "SE", "DK", "BE"];
const PPP: Record<string, { factor: number; currency: string }> = {
  FR: { factor: 1.066, currency: "EUR" }, // PLI=106.6, EUR国
  IT: { factor: 0.979, currency: "EUR" }, // PLI=97.9
  SE: { factor: 12.73, currency: "SEK" }, // PLI=121.4, 10.49SEK/EUR→12.73SEK/PPS
  DK: { factor: 10.44, currency: "DKK" }, // PLI=140.1, 7.45DKK/EUR→10.44DKK/PPS
  BE: { factor: 1.090, currency: "EUR" }, // PLI=109.0
};

async function fetchJSON(url: string): Promise<any> {
  const res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function posToCodeMap(dim: any): Record<number, string> {
  const m: Record<number, string> = {};
  for (const [c, p] of Object.entries(dim?.category?.index as Record<string, number> ?? {})) m[p] = c;
  return m;
}

function parseAllRows(json: any): Array<Record<string, string | number>> {
  const id: string[] = json.id;
  const dims = json.dimension as Record<string, any>;
  const values = json.value as Record<string, number>;
  const sizes = id.map((d: string) => Object.keys(dims[d]?.category?.index ?? {}).length);
  const maps = id.map((d: string) => posToCodeMap(dims[d]));

  const rows: Array<Record<string, string | number>> = [];
  for (const [flatKey, val] of Object.entries(values)) {
    if (val == null) continue;
    let rem = parseInt(flatKey);
    const coords: number[] = new Array(sizes.length).fill(0);
    for (let i = sizes.length - 1; i >= 0; i--) {
      coords[i] = rem % sizes[i]; rem = Math.floor(rem / sizes[i]);
    }
    const row: Record<string, string | number> = { _val: val };
    for (let i = 0; i < id.length; i++) row[id[i]] = maps[i][coords[i]] ?? "?";
    rows.push(row);
  }
  return rows;
}

async function main() {
  // Step 1: 総支出 PPS/AE/year 2020
  console.log("=== HBS_EXP_T135 総支出 PPS/AE 2020 ===");
  const j1 = await fetchJSON(
    `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/HBS_EXP_T135` +
    `?format=JSON&lang=en&geo=${COUNTRIES.join(",")}&age=TOTAL&unit=PPS_AE&time=2020`
  );
  const rows1 = parseAllRows(j1);
  const total: Record<string, number> = {};
  for (const r of rows1) {
    if (r["age"] === "TOTAL" && r["unit"] === "PPS_AE" && r["time"] === "2020" && COUNTRIES.includes(r["geo"] as string)) {
      total[r["geo"] as string] = r["_val"] as number;
      console.log(`  ${r["geo"]}: ${(r["_val"] as number).toLocaleString()} PPS/AE/year`);
    }
  }

  // Step 2: CP04 割合 PM (per mille) 2020, 5 quintiles 平均
  console.log("\n=== HBS_STR_T223 CP04 per mille 2020 ===");
  const j2 = await fetchJSON(
    `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/HBS_STR_T223` +
    `?format=JSON&lang=en&geo=${COUNTRIES.join(",")}&coicop=CP04&time=2020`
  );
  const rows2 = parseAllRows(j2);
  console.log("dim order:", j2.id);
  const cp04pm: Record<string, number[]> = {};
  for (const r of rows2) {
    const geo = r["geo"] as string;
    const qi  = r["quant_inc"] as string;
    const ci  = r["coicop"] as string;
    const t   = r["time"] as string;
    if (!COUNTRIES.includes(geo)) continue;
    if (ci !== "CP04") continue;
    if (t !== "2020") continue;
    if (!["QU1","QU2","QU3","QU4","QU5"].includes(qi)) continue;
    if (!cp04pm[geo]) cp04pm[geo] = [];
    cp04pm[geo].push(r["_val"] as number);
  }
  const cp04avg: Record<string, number> = {};
  for (const c of COUNTRIES) {
    const arr = cp04pm[c] ?? [];
    const avg = arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : null;
    cp04avg[c] = avg ?? NaN;
    console.log(`  ${c}: CP04 avg = ${avg?.toFixed(1) ?? "N/A"} PM (from ${arr.length} quintiles: [${arr.map(v=>v.toFixed(1)).join(", ")}])`);
  }

  // Step 3: 非住居費計算
  console.log("\n=== 非住居費 (月額・ローカル通貨) ===");
  const results: Record<string, { monthly: number; currency: string }> = {};
  for (const c of COUNTRIES) {
    const tot = total[c];
    const cp4 = cp04avg[c];
    if (!tot || isNaN(cp4)) { console.log(`  ${c}: データ不足`); continue; }
    const cp04Share = cp4 / 1000; // PM → fraction
    const nonHousingPPS_annual = tot * (1 - cp04Share);
    const nonHousingPPS_monthly = nonHousingPPS_annual / 12;
    const { factor, currency } = PPP[c];
    const monthly = Math.round(nonHousingPPS_monthly * factor / 100) * 100;
    results[c] = { monthly, currency };
    console.log(`  ${c}: total=${tot} PPS/yr, CP04=${(cp04Share*100).toFixed(1)}%, non-housing=${nonHousingPPS_monthly.toFixed(0)} PPS/mo → ${monthly.toLocaleString()} ${currency}/月`);
  }

  // Summary
  console.log("\n=== 推奨 referenceLivingCost 更新値 ===");
  const CURRENT: Record<string, number> = { FR:800, IT:800, SE:9000, DK:8000, BE:800 };
  for (const c of COUNTRIES) {
    const r = results[c];
    if (!r) { console.log(`  ${c}: N/A`); continue; }
    const diff = r.monthly - (CURRENT[c] ?? 0);
    console.log(`  ${c}: ${CURRENT[c]} → ${r.monthly.toLocaleString()} ${r.currency}/月  (${diff > 0 ? "+" : ""}${diff.toLocaleString()})`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });

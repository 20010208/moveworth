/**
 * Batch 4 (EE/EL/HU) — EARN_SES22_20 + HBS 利用可能年確認
 * EL = Greece (Eurostat code)
 */
const COUNTRIES = ["EE", "EL", "HU"];

async function fetchJ(url: string): Promise<any> {
  const r = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${url.slice(0,80)}`);
  return r.json();
}
function posToCodeMap(dim: any): Record<number, string> {
  const m: Record<number, string> = {};
  for (const [c, p] of Object.entries(dim?.category?.index as Record<string,number> ?? {})) m[p] = c;
  return m;
}
function parseRows(json: any): Array<Record<string, string|number>> {
  const id: string[] = json.id;
  const dims = json.dimension as Record<string,any>;
  const vals = json.value as Record<string,number>;
  const sizes = id.map(d => Object.keys(dims[d]?.category?.index ?? {}).length);
  const maps = id.map(d => posToCodeMap(dims[d]));
  const rows: Array<Record<string,string|number>> = [];
  for (const [k, v] of Object.entries(vals ?? {})) {
    if (v == null) continue;
    let rem = parseInt(k);
    const co = new Array(sizes.length).fill(0);
    for (let i = sizes.length-1; i >= 0; i--) { co[i] = rem % sizes[i]; rem = Math.floor(rem / sizes[i]); }
    const row: Record<string,string|number> = { _val: v };
    for (let i = 0; i < id.length; i++) row[id[i]] = maps[i][co[i]] ?? "?";
    rows.push(row);
  }
  return rows;
}

async function main() {
  // Step 1: EARN_SES22_20 — EE/EL/HU 存在確認 (NACE J, TOTAL, ERN, NAC)
  console.log("=== EARN_SES22_20 存在確認（NACE J ERN TOTAL NAC） ===");
  const j1 = await fetchJ(
    "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/EARN_SES22_20" +
    "?format=JSON&lang=en&geo=EE,EL,HU&nace_r2=J"
  );
  const r1 = parseRows(j1);
  for (const r of r1) {
    if (r["sex"]!=="T" || r["indic_se"]!=="ERN" || r["age"]!=="TOTAL" || r["unit"]!=="NAC" || r["nace_r2"]!=="J") continue;
    const annual = Math.round((r["_val"] as number)*12/1000)*1000;
    console.log(` ${r["geo"]}: 月額 ${Number(r["_val"]).toLocaleString()} NAC → 年額 ${annual.toLocaleString()}`);
  }

  // Step 2: HBS_EXP_T135 — 利用可能年
  console.log("\n=== HBS_EXP_T135 利用可能年（PPS/AE TOTAL） ===");
  const j2 = await fetchJ(
    "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/HBS_EXP_T135" +
    "?format=JSON&lang=en&geo=EE,EL,HU&age=TOTAL&unit=PPS_AE"
  );
  const r2 = parseRows(j2);
  const byC2: Record<string, Record<string,number>> = {};
  for (const r of r2) {
    if (r["age"]!=="TOTAL" || r["unit"]!=="PPS_AE") continue;
    const c = r["geo"] as string; const yr = r["time"] as string;
    if (!COUNTRIES.includes(c)) continue;
    if (!byC2[c]) byC2[c] = {};
    byC2[c][yr] = Math.round(r["_val"] as number);
  }
  for (const c of COUNTRIES) {
    const yrs = Object.keys(byC2[c] ?? {}).sort();
    console.log(` ${c}: ${yrs.map(y => `${y}=${byC2[c][y]}`).join(", ")}`);
  }

  // Step 3: HBS_STR_T223 — CP04 QU1-5 利用可能年
  console.log("\n=== HBS_STR_T223 CP04 QU1-5 利用可能年 ===");
  const j3 = await fetchJ(
    "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/HBS_STR_T223" +
    "?format=JSON&lang=en&geo=EE,EL,HU&coicop=CP04"
  );
  const r3 = parseRows(j3);
  const byC3: Record<string, Record<string, number[]>> = {};
  for (const r of r3) {
    if (r["coicop"] !== "CP04") continue;
    if (!["QU1","QU2","QU3","QU4","QU5"].includes(r["quant_inc"] as string)) continue;
    const c = r["geo"] as string; const yr = r["time"] as string;
    if (!COUNTRIES.includes(c)) continue;
    if (!byC3[c]) byC3[c] = {};
    if (!byC3[c][yr]) byC3[c][yr] = [];
    byC3[c][yr].push(r["_val"] as number);
  }
  for (const c of COUNTRIES) {
    const yrs = Object.keys(byC3[c] ?? {}).sort();
    if (yrs.length === 0) { console.log(` ${c}: データなし`); continue; }
    console.log(` ${c}:`);
    for (const yr of yrs) {
      const arr = byC3[c][yr];
      const avg = arr.reduce((a,b) => a+b, 0) / arr.length;
      console.log(`   ${yr} n=${arr.length} avg=${avg.toFixed(1)}PM [${arr.map(v=>v.toFixed(0)).join(",")}]`);
    }
  }

  // Step 4: HBS_STR_T221 — wstatus別 CP04（T223にデータない場合の代替）
  console.log("\n=== HBS_STR_T221 CP04 wstatus 利用可能年（代替候補） ===");
  const j4 = await fetchJ(
    "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/HBS_STR_T221" +
    "?format=JSON&lang=en&geo=EE,EL,HU&coicop=CP04"
  );
  const r4 = parseRows(j4);
  const byC4: Record<string, Record<string, Record<string,number>>> = {};
  for (const r of r4) {
    if (r["coicop"] !== "CP04") continue;
    const c = r["geo"] as string; const yr = r["time"] as string; const ws = r["wstatus"] as string;
    if (!COUNTRIES.includes(c)) continue;
    if (!byC4[c]) byC4[c] = {};
    if (!byC4[c][yr]) byC4[c][yr] = {};
    byC4[c][yr][ws] = r["_val"] as number;
  }
  for (const c of COUNTRIES) {
    const yrs = Object.keys(byC4[c] ?? {}).sort();
    if (yrs.length === 0) { console.log(` ${c}: データなし`); continue; }
    console.log(` ${c}:`);
    for (const yr of yrs) {
      const ws = byC4[c][yr];
      const wsList = Object.entries(ws).map(([k,v]) => `${k}=${v.toFixed(0)}`).join(", ");
      console.log(`   ${yr}: ${wsList}`);
    }
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });

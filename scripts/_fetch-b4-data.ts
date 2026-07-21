/**
 * Batch 4 (EE/EL/HU) — 全9業種 EARN_SES22_20 + HBS 生活費 計算
 * EE・EL は EUR 国、HU は HUF
 * PLI 2020 AIC EU27=100（Eurostat 公刊値）: EE=73.4, EL=80.8, HU=57.3
 * ECB 2020 HUF/EUR 平均: 351.249
 */
const COUNTRIES = ["EE", "EL", "HU"];
const NACE_TARGET = ["C","J","K","I","G","F","H","R","D"] as const;
type NaceKey = typeof NACE_TARGET[number];

const PLI:  Record<string,number> = { EE:73.4, EL:80.8, HU:57.3 };
const EURR: Record<string,number> = { EE:1, EL:1, HU:351.249 };
const CUR:  Record<string,string> = { EE:"EUR", EL:"EUR", HU:"HUF" };
const PPP:  Record<string,number> = {};
for (const c of COUNTRIES) PPP[c] = (PLI[c]/100) * EURR[c];

const HBS_YR: Record<string,string> = { EE:"2020", EL:"2020", HU:"2020" };

// HBS data confirmed from _check-b4-sources.ts
const TOTAL_PPS: Record<string,number> = { EE:11783, EL:13510, HU:14245 };
const CP04_PM:   Record<string,number> = { EE:323.4, EL:336.6, HU:510.6 };
// QU1-5 detail
const CP04_QU: Record<string,number[]> = {
  EE: [296,341,330,310,340],
  EL: [386,368,332,310,287],
  HU: [574,554,506,490,429],
};

const NACE_LABEL: Record<string,string> = {
  C:"manufacturing",J:"it",K:"finance",I:"service",
  G:"retail",F:"construction",H:"logistics",R:"media",D:"infrastructure",
};

async function fetchJ(url: string): Promise<any> {
  const r = await fetch(url, { headers: { Accept:"application/json" }, signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
function posToCodeMap(dim: any): Record<number,string> {
  const m: Record<number,string> = {};
  for (const [c,p] of Object.entries(dim?.category?.index as Record<string,number> ?? {})) m[p]=c;
  return m;
}
function parseRows(json: any): Array<Record<string,string|number>> {
  const id: string[] = json.id;
  const dims = json.dimension as Record<string,any>;
  const vals = json.value as Record<string,number>;
  const sizes = id.map(d => Object.keys(dims[d]?.category?.index ?? {}).length);
  const maps  = id.map(d => posToCodeMap(dims[d]));
  const rows: Array<Record<string,string|number>> = [];
  for (const [k,v] of Object.entries(vals ?? {})) {
    if (v == null) continue;
    let rem = parseInt(k);
    const co = new Array(sizes.length).fill(0);
    for (let i=sizes.length-1;i>=0;i--){co[i]=rem%sizes[i];rem=Math.floor(rem/sizes[i]);}
    const row: Record<string,string|number> = {_val:v};
    for (let i=0;i<id.length;i++) row[id[i]] = maps[i][co[i]] ?? "?";
    rows.push(row);
  }
  return rows;
}

async function main() {
  console.log("=== PPP 確認 ===");
  for (const c of COUNTRIES) console.log(` ${c}: PLI=${PLI[c]}, EUR/rate=${EURR[c]}, 1PPS=${PPP[c].toFixed(4)} ${CUR[c]}`);

  // EARN_SES22_20 — 全9業種
  console.log("\n=== EARN_SES22_20 業種別年収 (月額×12, NAC) ===");
  const jSal = await fetchJ(
    "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/EARN_SES22_20" +
    "?format=JSON&lang=en&geo=EE,EL,HU"
  );
  const salRows = parseRows(jSal);
  const sal: Record<string,Record<string,number>> = {};
  for (const r of salRows) {
    const c = r["geo"] as string;
    if (!COUNTRIES.includes(c)) continue;
    if (r["sex"]!=="T" || r["indic_se"]!=="ERN" || r["age"]!=="TOTAL" || r["unit"]!=="NAC") continue;
    const n = r["nace_r2"] as string;
    if (!NACE_TARGET.includes(n as NaceKey)) continue;
    if (!sal[c]) sal[c] = {};
    sal[c][n] = Math.round((r["_val"] as number)*12/1000)*1000;
  }
  for (const c of COUNTRIES) {
    console.log(`  ${c} (${CUR[c]}):`);
    for (const n of NACE_TARGET) console.log(`    ${NACE_LABEL[n].padEnd(16)} ${(sal[c]?.[n]??0).toLocaleString()}`);
  }

  // 生活費計算
  console.log("\n=== 非住居費 計算 ===");
  const living: Record<string,number> = {};
  for (const c of COUNTRIES) {
    const share = CP04_PM[c]/1000;
    const monthly = Math.round(TOTAL_PPS[c]*(1-share)/12*PPP[c]/100)*100;
    living[c] = monthly;
    console.log(` ${c}(HBS${HBS_YR[c]}): ${TOTAL_PPS[c].toLocaleString()} PPS × (1-${(share*100).toFixed(1)}%) /12 × ${PPP[c].toFixed(4)} = ${monthly.toLocaleString()} ${CUR[c]}/月`);
    console.log(`   CP04 QU1-5: [${CP04_QU[c].join(",")}] avg=${CP04_PM[c]}PM`);
  }

  // 現在値（country-presets.ts の既存値）
  const CURR_LIVING: Record<string,number> = { EE:800, EL:700, HU:80000 };
  const CURR_SAL: Record<string,Record<string,number>> = {
    EE:{manufacturing:26000,it:40000,finance:45000,service:20000,retail:22000,construction:28000,logistics:24000,media:32000,infrastructure:35000},
    EL:{manufacturing:36000,it:50000,finance:56000,service:26000,retail:28000,construction:38000,logistics:32000,media:42000,infrastructure:46000},
    HU:{manufacturing:7500000,it:12000000,finance:15000000,service:6000000,retail:5500000,construction:9000000,logistics:7000000,media:10000000,infrastructure:11000000},
  };

  console.log("\n=== 業種別年収 旧値→新値 ===");
  for (const c of COUNTRIES) {
    console.log(`  ${c} (${CUR[c]}):`);
    for (const n of NACE_TARGET) {
      const cur = CURR_SAL[c]?.[NACE_LABEL[n]] ?? 0;
      const nw  = sal[c]?.[n] ?? 0;
      const d   = nw - cur;
      console.log(`    ${NACE_LABEL[n].padEnd(16)} ${cur.toLocaleString().padStart(12)} → ${nw.toLocaleString().padStart(12)}  (${d>=0?"+":""}${d.toLocaleString()})`);
    }
  }

  console.log("\n=== 生活費 旧値→新値 ===");
  for (const c of COUNTRIES) {
    const cur=CURR_LIVING[c]; const nw=living[c]; const d=nw-cur;
    console.log(` ${c}: ${cur.toLocaleString()} → ${nw.toLocaleString()} ${CUR[c]}/月  (${d>=0?"+":""}${d.toLocaleString()})  [HBS ${HBS_YR[c]}]`);
  }
}

main().catch(e=>{console.error(e);process.exit(1);});

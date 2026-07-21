/**
 * Batch 1〜3 + Batch 1 pilots の CP041+CP042 修正値計算
 * 旧: 総支出 × (1 - CP04/1000) / 12 × PPP
 * 新: 総支出 × (1 - (CP041+CP042)/1000) / 12 × PPP
 *
 * IT のみ HBS_STR_T221 (NMW_IS) を使用（T223 2020 データなし）
 */

// 各国の設定（Eurostat コード / HBS年 / PPP / 通貨）
const CONFIGS: Record<string, {
  eurostatCode: string; hbsYear: string; ppp: number; currency: string; t221?: boolean;
}> = {
  // Batch 1 pilots (DE/AT/ES/NL/FI) — PLI 2020 AIC EU27=100
  DE:  { eurostatCode:"DE", hbsYear:"2020", ppp:1.057, currency:"EUR" },
  AT:  { eurostatCode:"AT", hbsYear:"2020", ppp:1.084, currency:"EUR" },
  ES:  { eurostatCode:"ES", hbsYear:"2020", ppp:0.876, currency:"EUR" },
  NL:  { eurostatCode:"NL", hbsYear:"2020", ppp:1.124, currency:"EUR" },
  FI:  { eurostatCode:"FI", hbsYear:"2020", ppp:1.215, currency:"EUR" },
  // Batch 2 (FR/IT/SE/DK/BE)
  FR:  { eurostatCode:"FR", hbsYear:"2020", ppp:1.066, currency:"EUR" },
  IT:  { eurostatCode:"IT", hbsYear:"2020", ppp:0.979, currency:"EUR", t221:true },
  SE:  { eurostatCode:"SE", hbsYear:"2015", ppp:12.73, currency:"SEK" },
  DK:  { eurostatCode:"DK", hbsYear:"2020", ppp:10.44, currency:"DKK" },
  BE:  { eurostatCode:"BE", hbsYear:"2020", ppp:1.090, currency:"EUR" },
  // Batch 3 (NO/IE/PT/PL/CZ)
  NO:  { eurostatCode:"NO", hbsYear:"2020", ppp:16.654, currency:"NOK" },
  IE:  { eurostatCode:"IE", hbsYear:"2020", ppp:1.164,  currency:"EUR" },
  PT:  { eurostatCode:"PT", hbsYear:"2020", ppp:0.794,  currency:"EUR" },
  PL:  { eurostatCode:"PL", hbsYear:"2020", ppp:2.553,  currency:"PLN" },
  CZ:  { eurostatCode:"CZ", hbsYear:"2015", ppp:17.33,  currency:"CZK" },
};

// 現行 referenceLivingCost（country-presets.ts の現在値）
const CURRENT: Record<string, number> = {
  DE:1631, AT:1631, ES:890, NL:1400, FI:1468,  // Batch 1 (AT/DE は現在同値?)
  FR:1200, IT:1000, SE:13600, DK:11500, BE:1200,
  NO:20900, IE:1200, PT:600, PL:1400, CZ:10500,
};

async function fetchJ(url: string): Promise<any> {
  const r = await fetch(url, { headers:{ Accept:"application/json" }, signal:AbortSignal.timeout(30000) });
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
  const sizes = id.map(d=>Object.keys(dims[d]?.category?.index??{}).length);
  const maps  = id.map(d=>posToCodeMap(dims[d]));
  const rows: Array<Record<string,string|number>> = [];
  for (const [k,v] of Object.entries(vals??{})) {
    if(v==null) continue;
    let rem=parseInt(k); const co=new Array(sizes.length).fill(0);
    for(let i=sizes.length-1;i>=0;i--){co[i]=rem%sizes[i];rem=Math.floor(rem/sizes[i]);}
    const row: Record<string,string|number>={_val:v};
    for(let i=0;i<id.length;i++) row[id[i]]=maps[i][co[i]]??"?";
    rows.push(row);
  }
  return rows;
}

function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : NaN;
}

async function main() {
  const allCodes = Object.values(CONFIGS).map(c=>c.eurostatCode);
  const uniqueCodes = [...new Set(allCodes)];

  // HBS_EXP_T135: 総支出 PPS/AE
  console.log("=== HBS_EXP_T135 総支出 取得中... ===");
  const jExp = await fetchJ(
    `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/HBS_EXP_T135` +
    `?format=JSON&lang=en&geo=${uniqueCodes.join(",")}&age=TOTAL&unit=PPS_AE`
  );
  const expRows = parseRows(jExp);
  const totalPPS: Record<string, number> = {};
  for (const r of expRows) {
    if(r["age"]!=="TOTAL"||r["unit"]!=="PPS_AE") continue;
    const c=r["geo"] as string; const yr=r["time"] as string;
    const appCode = Object.keys(CONFIGS).find(k=>CONFIGS[k].eurostatCode===c);
    if(!appCode) continue;
    if(yr===CONFIGS[appCode].hbsYear) totalPPS[appCode]=r["_val"] as number;
  }

  // HBS_STR_T223: CP04/CP041/CP042 (QU1-5 平均)
  console.log("=== HBS_STR_T223 CP04/CP041/CP042 取得中... ===");
  const jStr = await fetchJ(
    `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/HBS_STR_T223` +
    `?format=JSON&lang=en&geo=${uniqueCodes.join(",")}&coicop=CP04,CP041,CP042`
  );
  const strRows = parseRows(jStr);
  const cp: Record<string, Record<string, number>> = {}; // appCode -> {CP04, CP041, CP042}
  for (const r of strRows) {
    const c=r["geo"] as string; const code=r["coicop"] as string; const yr=r["time"] as string;
    const appCode = Object.keys(CONFIGS).find(k=>CONFIGS[k].eurostatCode===c);
    if(!appCode) continue;
    if(!["CP04","CP041","CP042"].includes(code)) continue;
    if(!["QU1","QU2","QU3","QU4","QU5"].includes(r["quant_inc"] as string)) continue;
    if(yr!==CONFIGS[appCode].hbsYear) continue;
    if(!cp[appCode]) cp[appCode]={};
    if(!(code in cp[appCode])) {
      const sameYrQu = strRows.filter(x=>
        x["geo"]===c && x["coicop"]===code && x["time"]===yr &&
        ["QU1","QU2","QU3","QU4","QU5"].includes(x["quant_inc"] as string)
      );
      cp[appCode][code] = avg(sameYrQu.map(x=>x["_val"] as number));
    }
  }

  // IT: HBS_STR_T221 NMW_IS も取得（CP04/CP041/CP042）
  console.log("=== IT: HBS_STR_T221 NMW_IS 取得中... ===");
  const jT221 = await fetchJ(
    `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/HBS_STR_T221` +
    `?format=JSON&lang=en&geo=IT&coicop=CP04,CP041,CP042`
  );
  const t221Rows = parseRows(jT221);
  for (const code of ["CP04","CP041","CP042"]) {
    const rows = t221Rows.filter(r =>
      r["geo"]==="IT" && r["coicop"]===code &&
      r["time"]==="2020" && r["wstatus"]==="NMW_IS"
    );
    if(rows.length>0) {
      if(!cp["IT"]) cp["IT"]={};
      cp["IT"][`${code}_t221`] = rows[0]["_val"] as number;
    }
  }

  // 結果計算・出力
  console.log("\n=== 修正値計算結果 ===");
  console.log("国    | 通貨 | HBS年 | CP04‰ | CP041‰ | CP042‰ | 旧値(現行) | 新値(修正後) | 差分");
  console.log("------|------|-------|--------|---------|---------|------------|-------------|-----");

  const results: Record<string, {oldVal:number, newVal:number, cp04:number, cp041:number, cp042:number}> = {};

  for (const [appCode, cfg] of Object.entries(CONFIGS)) {
    const tot = totalPPS[appCode];
    const cpData = cp[appCode] ?? {};

    // IT は T221 NMW_IS を使用
    const cp04  = cfg.t221 ? (cpData["CP04_t221"]  ?? cpData["CP04"])  : cpData["CP04"];
    const cp041 = cfg.t221 ? (cpData["CP041_t221"] ?? cpData["CP041"]) : cpData["CP041"];
    const cp042 = cfg.t221 ? (cpData["CP042_t221"] ?? cpData["CP042"]) : cpData["CP042"];

    if(!tot || cp04==null || cp041==null || cp042==null) {
      console.log(`${appCode.padEnd(5)} | ${cfg.currency.padEnd(4)} | ${cfg.hbsYear} | ${cp04?.toFixed(1)??"N/A"} | ${cp041?.toFixed(1)??"N/A"} | ${cp042?.toFixed(1)??"N/A"} | MISSING`);
      continue;
    }

    const oldVal = Math.round(tot*(1-cp04/1000)/12*cfg.ppp/100)*100;
    const newVal = Math.round(tot*(1-(cp041+cp042)/1000)/12*cfg.ppp/100)*100;
    const curVal = CURRENT[appCode] ?? 0;
    const diff   = newVal - curVal;

    results[appCode] = {oldVal, newVal, cp04, cp041, cp042};
    console.log(
      `${appCode.padEnd(5)} | ${cfg.currency.padEnd(4)} | ${cfg.hbsYear} | ` +
      `${cp04.toFixed(1).padStart(6)} | ${cp041.toFixed(1).padStart(7)} | ${cp042.toFixed(1).padStart(7)} | ` +
      `${curVal.toLocaleString().padStart(10)} | ${newVal.toLocaleString().padStart(11)} | ` +
      `${(diff>=0?"+":"")}${diff.toLocaleString()}`
    );
  }

  console.log("\n注: 旧値(現行)はすでに反映済みのCP04全差し引き値");
  console.log("修正後の新値はCP041+CP042のみ差し引いた正計算値");
}

main().catch(e=>{console.error(e);process.exit(1);});

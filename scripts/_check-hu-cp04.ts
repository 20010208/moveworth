/**
 * HU CP04 定義調査
 * COICOP CP04 = Housing, water, electricity, gas and other fuels
 * サブカテゴリ: CP041(家賃) / CP042(帰属家賃) / CP043(維持修繕) / CP044(水道) / CP045(光熱費)
 * → HBS_STR_T223 で 3桁 COICOP が取得できるか確認
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
function parseRows(json: any): Array<Record<string,string|number>> {
  const id: string[] = json.id;
  const dims = json.dimension as Record<string,any>;
  const vals = json.value as Record<string,number>;
  const sizes = id.map(d => Object.keys(dims[d]?.category?.index ?? {}).length);
  const maps  = id.map(d => posToCodeMap(dims[d]));
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
  // Step 1: HBS_STR_T223 の利用可能 COICOP コード一覧を確認
  console.log("=== Step 1: HBS_STR_T223 利用可能 COICOP コード（HU 2020） ===");
  const j1 = await fetchJ(
    "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/HBS_STR_T223" +
    "?format=JSON&lang=en&geo=HU&time=2020"
  );
  const coicopCodes = Object.keys(j1.dimension?.["coicop"]?.category?.index ?? {});
  console.log("利用可能 COICOP コード数:", coicopCodes.length);
  const cp04x = coicopCodes.filter(c => c.startsWith("CP04"));
  console.log("CP04系コード:", cp04x.join(", "));

  // Step 2: CP04 系サブカテゴリの PM 値を取得（HU 2020）
  if (cp04x.length > 1) {
    console.log("\n=== Step 2: HU 2020 CP04 サブカテゴリ PM 値（QU_TOTAL または QU1-5 平均） ===");
    const r1 = parseRows(j1);
    for (const code of cp04x) {
      const rows = r1.filter(r => r["coicop"] === code && r["time"] === "2020" && r["geo"] === "HU");
      if (rows.length === 0) { console.log(` ${code}: データなし`); continue; }
      const qRows = rows.filter(r => ["QU1","QU2","QU3","QU4","QU5"].includes(r["quant_inc"] as string));
      const totRow = rows.find(r => r["quant_inc"] === "QU_TOTAL");
      if (qRows.length > 0) {
        const avg = qRows.reduce((s,r) => s + (r["_val"] as number), 0) / qRows.length;
        console.log(` ${code}: QU1-5 avg=${avg.toFixed(1)}PM [${qRows.map(r=>r["_val"]).join(",")}]`);
      } else if (totRow) {
        console.log(` ${code}: QU_TOTAL=${totRow["_val"]}PM`);
      } else {
        console.log(` ${code}: その他 n=${rows.length}`, rows.slice(0,2).map(r=>`${r["quant_inc"]}=${r["_val"]}`).join(","));
      }
    }
  } else {
    console.log("→ HBS_STR_T223 は 2桁 COICOP のみ（CP041等のサブカテゴリなし）");
  }

  // Step 3: HBS_EXP_T136 (housing sub-categories) を試みる
  console.log("\n=== Step 3: HBS_EXP_T136 (housing detail) 試行 ===");
  try {
    const j3 = await fetchJ(
      "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/HBS_EXP_T136" +
      "?format=JSON&lang=en&geo=EE,EL,HU"
    );
    const r3 = parseRows(j3);
    const coicop3 = [...new Set(r3.map(r => r["coicop"] as string))].sort();
    console.log("HBS_EXP_T136 COICOP:", coicop3.join(", "));
    // HU 2020 の CP041/CP042/CP045 を確認
    for (const code of ["CP041","CP042","CP043","CP044","CP045","CP04"]) {
      const rows2020 = r3.filter(r => r["coicop"]===code && r["time"]==="2020");
      for (const r of rows2020) {
        console.log(` ${r["geo"]} ${code} 2020 unit=${r["unit"]}: ${r["_val"]}`);
      }
    }
  } catch(e: any) {
    console.log("HBS_EXP_T136:", e.message);
  }

  // Step 4: HBS_STR_T231 (詳細 COICOP 構成比) を試みる
  console.log("\n=== Step 4: HBS_STR_T231 試行 ===");
  try {
    const j4 = await fetchJ(
      "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/HBS_STR_T231" +
      "?format=JSON&lang=en&geo=HU"
    );
    const r4 = parseRows(j4);
    const codes4 = [...new Set(r4.map(r => r["coicop"] as string))].filter(c=>c.startsWith("CP04")).sort();
    console.log("HBS_STR_T231 CP04系:", codes4.join(", "));
    for (const code of codes4) {
      const rows2020 = r4.filter(r => r["coicop"]===code && r["time"]==="2020");
      if (rows2020.length > 0) {
        const avg = rows2020.reduce((s,r)=>s+(r["_val"] as number),0)/rows2020.length;
        console.log(` HU ${code} 2020: avg=${avg.toFixed(1)}PM (n=${rows2020.length})`);
      }
    }
  } catch(e: any) {
    console.log("HBS_STR_T231:", e.message);
  }

  // Step 5: EE/EL も同様に CP04 サブカテゴリ確認
  console.log("\n=== Step 5: EE/EL/HU の CP04 サブカテゴリ（T223 or T231） ===");
  // T223 の EE/EL 2020 CP04 系
  const j5 = await fetchJ(
    "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/HBS_STR_T223" +
    "?format=JSON&lang=en&geo=EE,EL,HU&time=2020"
  );
  const r5 = parseRows(j5);
  const allCoicop5 = [...new Set(r5.map(r=>r["coicop"] as string))].filter(c=>c.startsWith("CP04")).sort();
  console.log("T223 CP04系コード:", allCoicop5.join(", "));
  for (const c of COUNTRIES) {
    const qRows = r5.filter(r => r["geo"]===c && r["time"]==="2020" &&
      ["QU1","QU2","QU3","QU4","QU5"].includes(r["quant_inc"] as string));
    const byCode: Record<string,number[]> = {};
    for (const r of qRows) {
      const cd = r["coicop"] as string;
      if (!byCode[cd]) byCode[cd] = [];
      byCode[cd].push(r["_val"] as number);
    }
    console.log(` ${c} 2020:`);
    for (const cd of Object.keys(byCode).sort()) {
      const arr = byCode[cd];
      const avg = arr.reduce((a,b)=>a+b,0)/arr.length;
      console.log(`   ${cd}: avg=${avg.toFixed(1)}PM`);
    }
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });

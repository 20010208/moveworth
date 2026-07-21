/**
 * PT 2020 / CZ 2015 の CP041+CP042 データ調査
 */
async function fetchJ(url: string): Promise<any> {
  const r = await fetch(url, { headers:{ Accept:"application/json" }, signal:AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
function posToCodeMap(dim: any): Record<number,string> {
  const m: Record<number,string> = {};
  for (const [c,p] of Object.entries(dim?.category?.index as Record<string,number>??{})) m[p]=c;
  return m;
}
function parseRows(json: any): Array<Record<string,string|number>> {
  const id: string[]=json.id; const dims=json.dimension as Record<string,any>; const vals=json.value as Record<string,number>;
  const sizes=id.map(d=>Object.keys(dims[d]?.category?.index??{}).length);
  const maps=id.map(d=>posToCodeMap(dims[d]));
  const rows: Array<Record<string,string|number>>=[];
  for(const [k,v] of Object.entries(vals??{})){
    if(v==null) continue;
    let rem=parseInt(k); const co=new Array(sizes.length).fill(0);
    for(let i=sizes.length-1;i>=0;i--){co[i]=rem%sizes[i];rem=Math.floor(rem/sizes[i]);}
    const row: Record<string,string|number>={_val:v};
    for(let i=0;i<id.length;i++) row[id[i]]=maps[i][co[i]]??"?";
    rows.push(row);
  }
  return rows;
}

async function main() {
  // PT: T223 で CP04系コード一覧確認
  console.log("=== PT: HBS_STR_T223 CP04系 利用可能コード ===");
  const jPT = await fetchJ(
    "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/HBS_STR_T223" +
    "?format=JSON&lang=en&geo=PT&time=2020"
  );
  const ptCoicop = Object.keys(jPT.dimension?.["coicop"]?.category?.index??{}).filter(c=>c.startsWith("CP04"));
  console.log("PT CP04系コード:", ptCoicop.join(", "));
  const rPT = parseRows(jPT);
  for (const code of ptCoicop.slice(0,6)) {
    const rows = rPT.filter(r=>r["coicop"]===code&&r["time"]==="2020"&&r["geo"]==="PT"&&
      ["QU1","QU2","QU3","QU4","QU5"].includes(r["quant_inc"] as string));
    if(rows.length>0) {
      const avg=rows.reduce((s,r)=>s+(r["_val"] as number),0)/rows.length;
      console.log(` ${code}: avg=${avg.toFixed(1)}PM n=${rows.length} [${rows.map(r=>r["_val"]).join(",")}]`);
    } else console.log(` ${code}: データなし`);
  }

  // CZ: 2015年の CP041/CP042
  console.log("\n=== CZ: HBS_STR_T223 CP04系 2015年 ===");
  const jCZ = await fetchJ(
    "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/HBS_STR_T223" +
    "?format=JSON&lang=en&geo=CZ&time=2015"
  );
  const czCoicop = Object.keys(jCZ.dimension?.["coicop"]?.category?.index??{}).filter(c=>c.startsWith("CP04"));
  console.log("CZ 2015 CP04系コード:", czCoicop.join(", "));
  const rCZ = parseRows(jCZ);
  for (const code of ["CP04","CP041","CP042","CP043","CP044","CP045"]) {
    const rows = rCZ.filter(r=>r["coicop"]===code&&r["time"]==="2015"&&r["geo"]==="CZ"&&
      ["QU1","QU2","QU3","QU4","QU5"].includes(r["quant_inc"] as string));
    if(rows.length>0) {
      const avg=rows.reduce((s,r)=>s+(r["_val"] as number),0)/rows.length;
      console.log(` ${code}: avg=${avg.toFixed(1)}PM n=${rows.length} [${rows.map(r=>(r["_val"] as number).toFixed(0)).join(",")}]`);
    } else console.log(` ${code}: データなし`);
  }

  // PT: HBS_EXP_T135 2020 確認
  console.log("\n=== PT: HBS_EXP_T135 2020 PPS/AE ===");
  const jPTexp = await fetchJ(
    "https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/HBS_EXP_T135" +
    "?format=JSON&lang=en&geo=PT&age=TOTAL&unit=PPS_AE"
  );
  const rPTexp = parseRows(jPTexp);
  for(const r of rPTexp) {
    if(r["time"]==="2020"&&r["age"]==="TOTAL"&&r["unit"]==="PPS_AE")
      console.log(` PT 2020: ${r["_val"]} PPS/AE/yr`);
  }
}
main().catch(e=>{console.error(e.message);process.exit(1);});

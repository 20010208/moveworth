/**
 * Eurostat EARN_SES22_20 — 5カ国9業種、正確な flat-index 分解
 * フィルタ: geo + nace_r2 のみ。sex/age/indic_se/unit はコード内でフィルタ
 */

const COUNTRIES = ["FR", "IT", "SE", "DK", "BE"];
const NACE_WANTED = ["C","J","K","I","G","F","H","R","D"] as const;
const NACE_MAP: Record<string, string> = {
  C:"manufacturing", J:"it", K:"finance", I:"service",
  G:"retail", F:"construction", H:"logistics", R:"media", D:"infrastructure",
};

async function main() {
  const naceList = NACE_WANTED.join(",");
  const url = `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/EARN_SES22_20`
    + `?format=JSON&lang=en&geo=${COUNTRIES.join(",")}&nace_r2=${naceList}`;
  console.log("Fetching:", url);
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) { console.error("HTTP", res.status, await res.text().then(t=>t.slice(0,200))); process.exit(1); }
  const json = await res.json() as any;

  const id: string[] = json.id;
  const dims = json.dimension as Record<string, { category: { index: Record<string, number>; label: Record<string, string> } }>;
  const values = json.value as Record<string, number>;

  // Print dimension structure
  for (const d of id) {
    const codes = Object.keys(dims[d].category.index);
    console.log(`  ${d} (${codes.length}): [${codes.join(", ")}]`);
  }

  const sizes = id.map(d => Object.keys(dims[d].category.index).length);
  const totalCells = sizes.reduce((a,b)=>a*b, 1);
  console.log(`\nsizes: [${sizes.join(", ")}] → total: ${totalCells}, non-null values: ${Object.keys(values).length}`);

  // Build position→code lookup for each dim
  const posToCode: Record<string, Record<number, string>> = {};
  for (const d of id) {
    posToCode[d] = {};
    for (const [code, pos] of Object.entries(dims[d].category.index)) {
      posToCode[d][pos] = code;
    }
  }

  // Extract: sex=T, indic_se=ERN, age=TOTAL, unit=NAC
  const TARGET = { sex:"T", indic_se:"ERN", age:"TOTAL", unit:"NAC" };
  const result: Record<string, Record<string, number>> = {};

  for (const [flatKey, val] of Object.entries(values)) {
    if (val == null) continue;
    let rem = parseInt(flatKey);
    const coords: number[] = new Array(sizes.length).fill(0);
    for (let i = sizes.length-1; i >= 0; i--) {
      coords[i] = rem % sizes[i];
      rem = Math.floor(rem / sizes[i]);
    }

    // Decode each dimension
    const row: Record<string, string> = {};
    for (let i = 0; i < id.length; i++) {
      row[id[i]] = posToCode[id[i]][coords[i]] ?? "?";
    }

    // Apply filters
    let ok = true;
    for (const [dim, wanted] of Object.entries(TARGET)) {
      if (row[dim] !== wanted) { ok = false; break; }
    }
    if (!ok) continue;

    const geo  = row["geo"];
    const nace = row["nace_r2"];
    if (!COUNTRIES.includes(geo) || !NACE_MAP[nace]) continue;

    if (!result[geo]) result[geo] = {};
    result[geo][NACE_MAP[nace]] = Math.round(val); // monthly (multiply ×12 for annual)
  }

  // Print results
  console.log("\n=== EARN_SES22_20 ERN NAC — monthly gross earnings (×12 = annual) ===");
  console.log("(FR/IT/BE = EUR, SE = SEK, DK = DKK)\n");
  const ORDER = ["manufacturing","it","finance","service","retail","construction","logistics","media","infrastructure"];
  const NACE_REV: Record<string, string> = Object.fromEntries(Object.entries(NACE_MAP).map(([k,v])=>[v,k]));
  for (const country of COUNTRIES) {
    const d = result[country] ?? {};
    console.log(`--- ${country} ---`);
    for (const key of ORDER) {
      const monthly = d[key] ?? null;
      const annual  = monthly != null ? Math.round(monthly * 12 / 1000) * 1000 : null;
      console.log(`  ${key.padEnd(15)} NACE ${NACE_REV[key]}: monthly ${monthly?.toLocaleString().padStart(7) ?? "  N/A  "} → annual ${annual?.toLocaleString() ?? "N/A"}`);
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });

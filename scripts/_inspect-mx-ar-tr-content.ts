import { existsSync, readFileSync } from "fs";
if (existsSync(".env.local")) {
  for (const l of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = l.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(); if (!(k in process.env)) process.env[k] = t.slice(eq + 1).trim();
  }
}
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0 Safari/537.36";

function strip(h: string): string {
  return h
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z0-9#]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15000) });
    if (!r.ok) { console.log(`  → HTTP ${r.status}`); return null; }
    const ct = r.headers.get("content-type") ?? "";
    if (ct.includes("pdf")) { console.log(`  → PDF binary (ct=${ct})`); return null; }
    return strip(await r.text());
  } catch (e: unknown) { console.log(`  → ERROR: ${e instanceof Error ? e.message : e}`); return null; }
}

async function fetchWB(url: string): Promise<{ text: string; wbUrl: string } | null> {
  try {
    const a = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(10000) });
    if (!a.ok) return null;
    const j = await a.json() as { archived_snapshots?: { closest?: { url?: string } } };
    const snap = j.archived_snapshots?.closest?.url;
    if (!snap) { console.log(`  → WB: no snapshot`); return null; }
    const r = await fetch(snap, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15000) });
    if (!r.ok) return null;
    const ct = r.headers.get("content-type") ?? "";
    if (ct.includes("pdf")) { console.log(`  → WB snapshot is PDF: ${snap}`); return null; }
    const text = strip(await r.text());
    console.log(`  → WB: ${snap.slice(20, 90)} len=${text.length}`);
    return { text, wbUrl: snap };
  } catch { return null; }
}

function scanKeywords(text: string, keywords: string[]): void {
  for (const kw of keywords) {
    const idx = text.indexOf(kw);
    if (idx !== -1) {
      console.log(`  kw="${kw}": ...${text.slice(Math.max(0, idx - 60), Math.min(text.length, idx + 200))}...`);
    }
  }
}

async function main() {
  // ===== TR =====
  console.log("\n========== TR: Resmi Gazete 2024-12-31 ==========");
  // Official gazette - should contain 2025 income tax brackets
  const trGazette = await fetchText("https://www.resmigazete.gov.tr/eskiler/2024/12/20241231-12.htm");
  if (trGazette) {
    console.log(`  len=${trGazette.length}`);
    scanKeywords(trGazette, ["%15", "%20", "%27", "%35", "vergi", "gelir", "tarife", "dilim", "kazanç", "110.000", "230.000", "580.000", "3.000.000", "Gelir Vergisi"]);
    // Print first 2000 chars to see structure
    console.log("\n  [first 2000 chars]:", trGazette.slice(0, 2000));
  }

  console.log("\n--- TR: GIB mevzuat page ---");
  const trGib = await fetchText("https://www.gib.gov.tr/gibmevzuat");
  if (trGib) {
    console.log(`  len=${trGib.length}`);
    scanKeywords(trGib, ["%15", "tarife", "vergi", "dilim", "gelir"]);
    console.log("  [first 1000 chars]:", trGib.slice(0, 1000));
  }

  // ===== MX =====
  console.log("\n========== MX: SAT / DOF ==========");
  // Try various MX tax table URLs
  const mxUrls = [
    "https://www.sat.gob.mx/consulta/65528/conoce-las-tarifas-aplicables-del-impuesto-sobre-la-renta",
    "https://www.dof.gob.mx/nota_detalle.php?codigo=5744432&fecha=31/12/2024",
  ];
  for (const u of mxUrls) {
    console.log(`\n--- MX LIVE: ${u.slice(0, 70)} ---`);
    const t = await fetchText(u);
    if (t) {
      console.log(`  len=${t.length}`);
      scanKeywords(t, ["ISR", "tarifa", "límite", "cuota", "impuesto", "10%", "16%", "21%", "23%", "30%", "35%", "salario"]);
      console.log("  [first 1000]:", t.slice(0, 1000));
    }
    console.log(`  → Trying WB...`);
    const wb = await fetchWB(u);
    if (wb) {
      console.log(`  WB len=${wb.text.length}`);
      scanKeywords(wb.text, ["ISR", "tarifa", "límite", "cuota", "10%", "16%", "21%", "23%", "30%", "35%"]);
    }
  }

  // ===== AR =====
  console.log("\n========== AR: ARCA (旧AFIP) ==========");
  const arUrls = [
    "https://www.arca.gob.ar/ganancias/personas-fisicas/",
    "https://www.arca.gob.ar/",
    "https://www.afip.gob.ar/gananciasYBienes/ganancias/empleados/",
    "https://www.argentina.gob.ar/normativa/nacional/ley-20628-15621/actualizacion",
  ];
  for (const u of arUrls) {
    console.log(`\n--- AR: ${u.slice(0, 70)} ---`);
    const t = await fetchText(u);
    if (t) {
      console.log(`  len=${t.length}`);
      scanKeywords(t, ["ganancias", "impuesto", "5%", "9%", "12%", "15%", "19%", "23%", "27%", "31%", "35%", "escala"]);
      console.log("  [first 800]:", t.slice(0, 800));
    } else {
      const wb = await fetchWB(u);
      if (wb) {
        console.log(`  WB len=${wb.text.length}`);
        scanKeywords(wb.text, ["5%", "9%", "12%", "15%", "19%", "23%", "27%", "31%", "35%", "escala"]);
      }
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });

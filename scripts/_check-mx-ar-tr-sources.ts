import { existsSync, readFileSync } from "fs";
if (existsSync(".env.local")) {
  for (const l of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = l.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(); if (!(k in process.env)) process.env[k] = t.slice(eq + 1).trim();
  }
}
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0 Safari/537.36";

async function tryLive(url: string): Promise<{ ok: boolean; ct: string; len: number }> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(12000) });
    const body = await r.text();
    return { ok: r.ok, ct: r.headers.get("content-type") ?? "", len: body.length };
  } catch (e: unknown) { return { ok: false, ct: "", len: 0 }; }
}

async function tryWayback(url: string): Promise<{ found: boolean; wbUrl: string; ct: string; len: number }> {
  try {
    const avail = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(10000) });
    if (!avail.ok) return { found: false, wbUrl: "", ct: "", len: 0 };
    const j = await avail.json() as { archived_snapshots?: { closest?: { url?: string } } };
    const snap = j.archived_snapshots?.closest?.url;
    if (!snap) return { found: false, wbUrl: "", ct: "", len: 0 };
    const r = await fetch(snap, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15000) });
    const body = await r.text();
    return { found: true, wbUrl: snap.slice(0, 80), ct: r.headers.get("content-type") ?? "", len: body.length };
  } catch { return { found: false, wbUrl: "", ct: "", len: 0 }; }
}

async function main() {
  // 1. DB: MX/AR/TR の country_sources
  for (const cc of ["mx", "ar", "tr"]) {
    const { data } = await sb.from("country_sources").select("url,purpose,status").eq("country_code", cc);
    console.log(`\n=== ${cc.toUpperCase()} country_sources ===`);
    console.log(JSON.stringify(data, null, 2));
  }

  // 2. TR: JS描画疑いのページをWayback経由で試す
  const trCandidates = [
    "https://www.gib.gov.tr/yurt-ici-giderler",
    "https://www.gib.gov.tr/sites/default/files/fileadmin-uploads/mevzuat/gmsi/gmsi2025.htm",
    "https://www.gib.gov.tr/gibmevzuat",
    "https://www.resmigazete.gov.tr/eskiler/2024/12/20241231-12.htm",
  ];
  console.log("\n=== TR: Live + Wayback チェック ===");
  for (const u of trCandidates) {
    const live = await tryLive(u);
    process.stdout.write(`LIVE [${u.slice(0, 60)}]: ok=${live.ok} ct=${live.ct.slice(0,20)} len=${live.len}\n`);
    if (!live.ok || live.len < 500) {
      const wb = await tryWayback(u);
      console.log(`  WB: found=${wb.found} ${wb.wbUrl} len=${wb.len}`);
    }
  }

  // 3. MX: DOF PDFページ
  const mxCandidates = [
    "https://www.dof.gob.mx/nota_detalle.php?codigo=5744432&fecha=31/12/2024",
    "https://www.sat.gob.mx/consulta/65528/conoce-las-tarifas-aplicables-del-impuesto-sobre-la-renta",
    "https://www.sat.gob.mx/home",
  ];
  console.log("\n=== MX: Live + Wayback チェック ===");
  for (const u of mxCandidates) {
    const live = await tryLive(u);
    process.stdout.write(`LIVE [${u.slice(0, 65)}]: ok=${live.ok} ct=${live.ct.slice(0,30)} len=${live.len}\n`);
    if (!live.ok || live.len < 500) {
      const wb = await tryWayback(u);
      console.log(`  WB: found=${wb.found} ${wb.wbUrl} len=${wb.len}`);
    }
  }

  // 4. AR: AFIP税率ページ
  const arCandidates = [
    "https://www.afip.gob.ar/gananciasYBienes/ganancias/empleados/documentos/EscalaDeGanancias.pdf",
    "https://www.afip.gob.ar/gananciasYBienes/ganancias/empleados/",
    "https://www.argentina.gob.ar/normativa/nacional/ley-20628-15621/actualizacion",
  ];
  console.log("\n=== AR: Live + Wayback チェック ===");
  for (const u of arCandidates) {
    const live = await tryLive(u);
    process.stdout.write(`LIVE [${u.slice(0, 65)}]: ok=${live.ok} ct=${live.ct.slice(0,30)} len=${live.len}\n`);
    if (!live.ok || live.len < 500) {
      const wb = await tryWayback(u);
      console.log(`  WB: found=${wb.found} ${wb.wbUrl} len=${wb.len}`);
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });

/**
 * TR + MX 税率テキスト抽出
 * TR: GIB CDN PDF (2025 tarife) + Resmi Gazete 20241230-N
 * MX: SAT Anexo8 RMF 2025 PDF
 */
import { existsSync, readFileSync } from "fs";
if (existsSync(".env.local")) {
  for (const l of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = l.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(); if (!(k in process.env)) process.env[k] = t.slice(eq + 1).trim();
  }
}
import { createRequire } from "module";
const _require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const pdfParse: (buf: Buffer) => Promise<{ text: string }> = _require("pdf-parse");

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0 Safari/537.36";

async function fetchBuf(url: string): Promise<{ ok: boolean; buf: Buffer; ct: string }> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA, "Accept": "*/*" }, signal: AbortSignal.timeout(20000) });
    if (!r.ok) { console.log(`  HTTP ${r.status} ${r.statusText}`); return { ok: false, buf: Buffer.alloc(0), ct: "" }; }
    const ct = r.headers.get("content-type") ?? "";
    const arr = await r.arrayBuffer();
    return { ok: true, buf: Buffer.from(arr), ct };
  } catch (e: unknown) { console.log(`  ERROR: ${e instanceof Error ? e.message : e}`); return { ok: false, buf: Buffer.alloc(0), ct: "" }; }
}

async function fetchText(url: string): Promise<string | null> {
  const { ok, buf, ct } = await fetchBuf(url);
  if (!ok) return null;
  return buf.toString("utf-8");
}

function stripHtml(h: string): string {
  return h
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z0-9#]+;/g, " ")
    .replace(/\s+/g, " ").trim();
}

async function parsePdf(buf: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buf);
    return data.text;
  } catch (e: unknown) { return `PDF parse error: ${e instanceof Error ? e.message : e}`; }
}

async function main() {
  // ===== TR =====
  console.log("========== TR ==========\n");

  // 1. GIB CDN PDF — 2025 Gelir Vergisi Tarifesi
  const trPdfUrl = "https://cdn.gib.gov.tr/api/gibportal-file/file/getFileResources?objectKey=arsiv%2Fyardim-kaynaklar%2Fyararli-bilgiler%2Fgelir-vergisi-tarifeleri%2Fgelir-vergisi-tarifesi-2025.pdf";
  console.log("--- TR: GIB CDN PDF ---");
  const trPdf = await fetchBuf(trPdfUrl);
  console.log(`  ct=${trPdf.ct} len=${trPdf.buf.length}`);
  if (trPdf.ok && trPdf.ct.includes("pdf")) {
    const text = await parsePdf(trPdf.buf);
    console.log("  PDF text (first 3000):", text.slice(0, 3000));
    // キーワードで税率を探す
    const pcts = text.match(/%\s*\d+|\d+\s*%/g) ?? [];
    const nums = text.match(/\d{1,3}[.,]\d{3}[.,]?\d*/g) ?? [];
    console.log("  percentages:", [...new Set(pcts)].slice(0, 20));
    console.log("  numbers:", [...new Set(nums)].slice(0, 20));
  } else if (trPdf.ok) {
    // HTML or JSON response
    const text = trPdf.buf.toString("utf-8");
    console.log("  response (first 2000):", text.slice(0, 2000));
  }

  // 2. Resmi Gazete 20241230 — GVK Seri No 329 が掲載のはず（日付確認済み）
  console.log("\n--- TR: Resmi Gazete 20241230 追加スキャン ---");
  for (let n = 4; n <= 15; n++) {
    const url = `https://www.resmigazete.gov.tr/eskiler/2024/12/20241230-${n}.htm`;
    const t = await fetchText(url);
    if (!t || t.length < 50) continue;
    const stripped = stripHtml(t);
    const hasTax = /GVK|103.*madde|Gelir Vergisi.*Tarife|329 Seri|Seri No.*329|% ?15|% ?20|% ?27|% ?35|% ?40/.test(stripped);
    console.log(`  [${hasTax ? "TAX!" : "   "}] 20241230-${n} len=${stripped.length}`);
    if (hasTax) {
      console.log("  *** FOUND ***:", stripped.slice(0, 3000));
    }
  }

  // ===== MX =====
  console.log("\n\n========== MX ==========\n");

  // SAT Anexo 8 RMF 2025 PDF (ISR tarifa annual)
  const mxPdfUrls = [
    "https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2025/rmf/anexos/Anexo8_RMF2025-30122024.pdf",
    "http://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf",
  ];
  for (const url of mxPdfUrls) {
    console.log(`\n--- MX PDF: ${url.slice(30, 90)} ---`);
    const res = await fetchBuf(url);
    console.log(`  ok=${res.ok} ct=${res.ct} len=${res.buf.length}`);
    if (res.ok && res.buf.length > 1000) {
      const isPdf = res.ct.includes("pdf") || (res.buf[0] === 0x25 && res.buf[1] === 0x50); // %P = PDF magic
      console.log(`  isPdf=${isPdf}`);
      if (isPdf) {
        const text = await parsePdf(res.buf);
        console.log("  PDF text (first 3000):", text.slice(0, 3000));
        // 税率キーワード
        const pcts = text.match(/\d+\.?\d*%|\d+\.\d+%/g) ?? [];
        const rates = text.match(/1[0-9]%|2[0-9]%|30%|35%/g) ?? [];
        console.log("  percentages:", [...new Set(pcts)].slice(0, 20));
        console.log("  rates:", [...new Set(rates)]);
        // Límite inferior / cuota fija (ISR table keywords)
        for (const kw of ["Límite inferior", "Cuota fija", "Por ciento", "tarifa", "10.88%", "6.40%", "16.00%", "21.36%", "23.52%", "29.12%", "30%", "32%", "34%", "35%"]) {
          const idx = text.indexOf(kw);
          if (idx !== -1) console.log(`  kw="${kw}": ...${text.slice(Math.max(0, idx-50), idx+400)}...`);
        }
      } else {
        // HTMLかもしれない
        const html = res.buf.toString("utf-8");
        console.log("  HTML (first 1000):", stripHtml(html).slice(0, 1000));
      }
    }
  }
}
// ===== AR =====
async function mainAR() {
  console.log("\n\n========== AR ==========\n");

  const arPdfUrls = [
    // 年間清算用スケール（最も包括的）
    "https://www.afip.gob.ar/gananciasYBienes/ganancias/personas-humanas-sucesiones-indivisas/declaracion-jurada/documentos/Tabla-Art-94-LIG-liquidacion-anual-y-final-2025.pdf",
    // Jul-Dec 2025 スケール
    "https://www.afip.gob.ar/gananciasYBienes/ganancias/personas-humanas-sucesiones-indivisas/declaracion-jurada/documentos/Tabla-Art-94-LIG-periodo-julio-diciembre-2025.pdf",
  ];

  for (const url of arPdfUrls) {
    console.log(`\n--- AR PDF: ${url.slice(90)} ---`);
    const res = await fetchBuf(url);
    console.log(`  ok=${res.ok} ct=${res.ct} len=${res.buf.length}`);
    if (res.ok && res.buf.length > 500) {
      const isPdf = res.ct.includes("pdf") || (res.buf[0] === 0x25 && res.buf[1] === 0x50);
      console.log(`  isPdf=${isPdf}`);
      if (isPdf) {
        const text = await parsePdf(res.buf);
        console.log("  PDF text (first 3000):", text.slice(0, 3000));
        const pcts = text.match(/\d+%|\d+\.\d+%/g) ?? [];
        console.log("  percentages:", [...new Set(pcts)].slice(0, 20));
        for (const kw of ["5%", "9%", "12%", "15%", "19%", "23%", "27%", "31%", "35%", "Ganancia neta", "Límite inferior", "Pagarán"]) {
          const idx = text.indexOf(kw);
          if (idx !== -1) console.log(`  kw="${kw}": ...${text.slice(Math.max(0,idx-60),idx+300)}...`);
        }
      } else {
        console.log("  HTML:", res.buf.toString("utf-8").slice(0, 500));
      }
    }
  }
}

async function run() {
  await main();
  await mainAR();
}
run().catch(e => { console.error(e); process.exit(1); });

/**
 * TR / MX / AR 税率PDF抽出（pdf-parse v2.x API: new PDFParse({url}) → load() → getText()）
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
const { PDFParse } = _require("pdf-parse") as { PDFParse: new (opts: object) => {
  load(): Promise<unknown>;
  getText(): Promise<{ pages: { text: string }[] }>;
} };

async function extractPdfText(url: string): Promise<string | null> {
  try {
    const parser = new PDFParse({ verbosity: 0, url });
    await parser.load();
    const result = await parser.getText();
    return result.pages.map(p => p.text).join("\n");
  } catch (e: unknown) {
    console.error(`  PDF error: ${e instanceof Error ? e.message : e}`);
    return null;
  }
}

function showTaxKeywords(text: string, keywords: string[]): void {
  for (const kw of keywords) {
    const idx = text.indexOf(kw);
    if (idx !== -1) console.log(`  kw="${kw}": ...${text.slice(Math.max(0, idx - 60), Math.min(text.length, idx + 400))}...`);
  }
}

async function main() {
  // ===== TR =====
  console.log("========== TR: GIB CDN PDF (2025 Gelir Vergisi Tarifesi) ==========");
  const trUrl = "https://cdn.gib.gov.tr/api/gibportal-file/file/getFileResources?objectKey=arsiv%2Fyardim-kaynaklar%2Fyararli-bilgiler%2Fgelir-vergisi-tarifeleri%2Fgelir-vergisi-tarifesi-2025.pdf";
  const trText = await extractPdfText(trUrl);
  if (trText) {
    console.log(`  len=${trText.length}`);
    console.log("  full text:", trText.slice(0, 4000));
    const pcts = trText.match(/%\s*\d+|\d+\s*%/g) ?? [];
    console.log("  %:", [...new Set(pcts)].slice(0, 20));
    showTaxKeywords(trText, ["15", "20", "27", "35", "40", "110.000", "230.000", "580.000", "tarife", "dilim", "TL"]);
  }

  // ===== MX =====
  console.log("\n\n========== MX: SAT Anexo8 RMF 2025 PDF ==========");
  const mxUrl = "https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2025/rmf/anexos/Anexo8_RMF2025-30122024.pdf";
  const mxText = await extractPdfText(mxUrl);
  if (mxText) {
    console.log(`  len=${mxText.length}`);
    console.log("  full text:", mxText.slice(0, 4000));
    showTaxKeywords(mxText, ["Límite inferior", "Cuota fija", "Por ciento", "10.88", "6.40", "16.00", "21.36", "23.52", "29.12", "30%", "35%", "ISR"]);
  }

  // ===== AR =====
  console.log("\n\n========== AR: AFIP 年間清算スケール 2025 ==========");
  const arUrl = "https://www.afip.gob.ar/gananciasYBienes/ganancias/personas-humanas-sucesiones-indivisas/declaracion-jurada/documentos/Tabla-Art-94-LIG-liquidacion-anual-y-final-2025.pdf";
  const arText = await extractPdfText(arUrl);
  if (arText) {
    console.log(`  len=${arText.length}`);
    console.log("  full text:", arText.slice(0, 4000));
    showTaxKeywords(arText, ["5", "9%", "12%", "15%", "19%", "23%", "27%", "31%", "35%", "Ganancia", "Pagarán"]);
  }
}
main().catch(e => { console.error(e); process.exit(1); });

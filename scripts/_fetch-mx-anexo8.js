// MX Anexo 8 税率表抽出（omawww PDF, 779 pages）
const { PDFParse } = require("pdf-parse");
const https = require("https");
const http = require("http");

const URL = "http://omawww.sat.gob.mx/normatividad_RMF_RGCE/Paginas/documentos2025/rmf/compiladas/Compilado_Primera_Modificacion_a_la-Resolucion_Miscelanea_Fiscal_para_2025-22012025.pdf";

function fetchBuf(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, { headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/pdf,*/*" }, timeout: 60000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchBuf(res.headers.location));
      }
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, ct: res.headers["content-type"] || "", buf: Buffer.concat(chunks) }));
    });
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
    req.on("error", reject);
  });
}

async function main() {
  console.log("Downloading MX RMF 2025 PDF (9MB)...");
  const { status, ct, buf } = await fetchBuf(URL);
  console.log(`status=${status} ct=${ct} len=${buf.length}`);

  if (buf.length < 1000) { console.log("ERROR: empty response"); return; }

  console.log("Parsing full PDF (779 pages)...");
  const parser = new PDFParse({ verbosity: 0, url: URL });
  await parser.load();
  const r = await parser.getText();
  const fullText = r.pages.map(p => p.text).join("\n");
  console.log(`Full text length: ${fullText.length}`);

  // Anexo 8 セクションを探す
  const keywords = [
    "Anexo 8",
    "ANEXO 8",
    "Límite inferior",
    "Límite superior",
    "Cuota fija",
    "Por ciento para aplicarse",
    "1.92%",
    "6.40%",
    "10.88%",
    "16.00%",
    "17.92%",
    "21.36%",
    "23.52%",
    "30.00%",
    "32.00%",
    "34.00%",
    "35.00%",
    "TARIFA PARA EL CÁLCULO",
    "ISR anual",
    "Artículo 152",
  ];

  for (const kw of keywords) {
    const idx = fullText.indexOf(kw);
    if (idx !== -1) {
      console.log(`\n=== FOUND: "${kw}" at pos ${idx} ===`);
      console.log(fullText.slice(Math.max(0, idx - 100), Math.min(fullText.length, idx + 1500)));
    }
  }

  // 特定ページ範囲を表示（Anexo 8 は通常 Título 3 の後半）
  const anexo8idx = fullText.indexOf("ANEXO 8");
  const anexo8idx2 = fullText.indexOf("Anexo 8");
  console.log(`\nAnexo 8 positions: ANEXO 8=${anexo8idx}, Anexo 8=${anexo8idx2}`);

  // tarifa キーワード周辺
  let pos = 0;
  let count = 0;
  while ((pos = fullText.indexOf("tarifa", pos)) !== -1 && count < 10) {
    console.log(`\ntarifa at ${pos}:`, fullText.slice(Math.max(0, pos - 50), pos + 200));
    pos += 10;
    count++;
  }
}
main().catch(console.error);

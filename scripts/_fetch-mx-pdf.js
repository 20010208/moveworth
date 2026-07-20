// MX ISR PDF 代替URL試行（CJS）
const { PDFParse } = require("pdf-parse");
const https = require("https");
const http = require("http");

const MX_URLS = [
  // diputados.gob.mx LISR（法律テキスト - ISR全文）
  "http://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf",
  // SAT omawww サブドメイン
  "http://omawww.sat.gob.mx/normatividad_RMF_RGCE/Paginas/documentos2025/rmf/compiladas/Compilado_Primera_Modificacion_a_la-Resolucion_Miscelanea_Fiscal_para_2025-22012025.pdf",
];

function fetchBuf(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, { headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/pdf,*/*" }, timeout: 25000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log(`  Redirect → ${res.headers.location}`);
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
  for (const url of MX_URLS) {
    console.log(`\n--- ${url.slice(0, 80)} ---`);
    try {
      const { status, ct, buf } = await fetchBuf(url);
      console.log(`  status=${status} ct=${ct} len=${buf.length}`);
      if (buf.length > 1000 && (ct.includes("pdf") || buf[0] === 0x25)) {
        console.log("  Parsing PDF...");
        const parser = new PDFParse({ verbosity: 0, url });
        await parser.load();
        const r = await parser.getText();
        const text = r.pages.map(p => p.text).join("\n");
        console.log("  text (first 3000):", text.slice(0, 3000));
        // 税率キーワード
        const pcts = text.match(/\d+\.\d+%|\d+%/g) || [];
        console.log("  rates:", [...new Set(pcts)].filter(p => parseFloat(p) > 0).slice(0, 20));
      } else if (buf.length > 100) {
        console.log("  HTML:", buf.toString("utf-8").slice(0, 500));
      }
    } catch(e) {
      console.log(`  ERROR: ${e.message}`);
    }
  }
}
main().catch(console.error);

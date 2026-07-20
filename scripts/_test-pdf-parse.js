// pdf-parse API確認スクリプト（CJS形式）
const { PDFParse } = require("pdf-parse");
const https = require("https");
const http = require("http");

// ARのPDF URL（取得成功確認済み）
const AR_URL = "https://www.afip.gob.ar/gananciasYBienes/ganancias/personas-humanas-sucesiones-indivisas/declaracion-jurada/documentos/Tabla-Art-94-LIG-liquidacion-anual-y-final-2025.pdf";

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    mod.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, ct: res.headers["content-type"] || "", buf: Buffer.concat(chunks) }));
    }).on("error", reject);
  });
}

async function main() {
  // 方法1: URLをコンストラクタで渡す
  console.log("=== 方法1: URL in constructor ===");
  try {
    const p1 = new PDFParse({ verbosity: 0, url: AR_URL });
    await p1.load();
    const text = await p1.getText();
    console.log("getText type:", typeof text, Array.isArray(text));
    if (Array.isArray(text)) {
      console.log("first item:", JSON.stringify(text[0]).slice(0, 500));
      console.log("length:", text.length);
    } else {
      console.log("text:", JSON.stringify(text).slice(0, 1000));
    }
    return;
  } catch (e) {
    console.error("方法1 error:", e.message);
  }

  // 方法2: Bufferをdataとしてコンストラクタへ渡す
  console.log("\n=== 方法2: Buffer as data in constructor ===");
  const { status, ct, buf } = await fetchBuffer(AR_URL);
  console.log(`status=${status} ct=${ct} len=${buf.length}`);
  try {
    const p2 = new PDFParse({ verbosity: 0, data: buf });
    await p2.load();
    const text = await p2.getText();
    console.log("SUCCESS! text (first 3000):", text.slice(0, 3000));
    const pcts = text.match(/\d+%|\d+,\d+%/g) || [];
    console.log("percentages:", [...new Set(pcts)]);
    return;
  } catch (e) {
    console.error("方法2 error:", e.message);
  }

  // 方法3: Uint8Arrayとして渡す
  console.log("\n=== 方法3: Uint8Array as data ===");
  try {
    const uint8 = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
    const p3 = new PDFParse({ verbosity: 0, data: uint8 });
    await p3.load();
    const text = await p3.getText();
    console.log("SUCCESS! text (first 3000):", text.slice(0, 3000));
  } catch (e) {
    console.error("方法3 error:", e.message);
  }
}
main().catch(console.error);

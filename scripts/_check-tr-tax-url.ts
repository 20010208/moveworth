import { existsSync, readFileSync } from "fs";
if (existsSync(".env.local")) {
  for (const l of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = l.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(); if (!(k in process.env)) process.env[k] = t.slice(eq + 1).trim();
  }
}
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0 Safari/537.36";

async function fetchRaw(url: string): Promise<{ ok: boolean; body: string; ct: string }> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(12000) });
    const body = await r.text();
    return { ok: r.ok, body, ct: r.headers.get("content-type") ?? "" };
  } catch (e: unknown) { return { ok: false, body: "", ct: "" }; }
}

function strip(h: string): string {
  return h
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z0-9#]+;/g, " ")
    .replace(/\s+/g, " ").trim();
}

async function tryWB(url: string): Promise<{ snap: string; body: string } | null> {
  try {
    const a = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(10000) });
    if (!a.ok) return null;
    const j = await a.json() as { archived_snapshots?: { closest?: { url?: string } } };
    const snap = j.archived_snapshots?.closest?.url;
    if (!snap) return null;
    const r = await fetch(snap, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15000) });
    if (!r.ok) return null;
    return { snap, body: strip(await r.text()) };
  } catch { return null; }
}

async function main() {
  // GIB — トルコ所得税タリフェページ候補
  const gibUrls = [
    "https://www.gib.gov.tr/gelir-vergisi-tarifesi",
    "https://www.gib.gov.tr/gelir-vergisi",
    "https://www.gib.gov.tr/vergi-rehberi/gelir-vergisi",
    "https://www.gib.gov.tr/pratik-bilgiler",
    "https://www.gib.gov.tr/pratik-bilgiler/gelir-vergisi-tarifeleri",
  ];

  for (const u of gibUrls) {
    const { ok, body, ct } = await fetchRaw(u);
    const text = strip(body);
    const hasRates = /%\d+|tarife|dilim|110\.000|230\.000|2025/.test(text);
    console.log(`[${ok ? "OK" : "NG"}] len=${text.length} rates=${hasRates} ${u.slice(30)}`);
    if (ok && text.length > 200) {
      console.log("  first 500:", text.slice(0, 500));
    } else if (!ok || text.length < 200) {
      // Try Wayback
      const wb = await tryWB(u);
      if (wb) {
        const hasR = /%\d+|tarife|dilim|110\.000/.test(wb.body);
        console.log(`  WB: len=${wb.body.length} rates=${hasR} snap=${wb.snap.slice(30, 90)}`);
        if (hasR) console.log("  WB first 800:", wb.body.slice(0, 800));
      }
    }
  }

  // Resmi Gazete — 2025 Gelir Vergisi Kanunu改正を含む可能性がある号
  // 2025年所得税ブラケットは通常12月末の官報に掲載
  console.log("\n=== Resmi Gazete 候補号 ===");
  const rgUrls = [
    // 2024年12月末の各号 (所得税ブラケット調整のTebliğが入っている可能性)
    "https://www.resmigazete.gov.tr/eskiler/2024/12/20241229-1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/12/20241230-1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/12/20241231-1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/12/20241231-2.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/12/20241228-1.htm",
  ];
  for (const u of rgUrls) {
    const { ok, body, ct } = await fetchRaw(u);
    const text = strip(body);
    // Check for income tax keywords in Turkish (handling possible encoding issues)
    const hasTax = /tarife|dilim|gelir vergisi|GVK|103|madde/i.test(text) || /110|230|580|1\.9|3\.0/.test(text);
    console.log(`[${ok ? "OK" : "NG"}] len=${text.length} tax=${hasTax} ${u.slice(50)}`);
    if (hasTax) {
      console.log("  FOUND tax content:", text.slice(0, 1000));
    }
  }

  // MX: 代替URL を試す
  console.log("\n=== MX: 代替URL ===");
  const mxAlt = [
    "https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf",
    "https://www.sat.gob.mx/portal/public/home",
    "https://cff.sat.gob.mx/",
  ];
  for (const u of mxAlt) {
    const { ok, body, ct } = await fetchRaw(u);
    const isPdf = ct.includes("pdf");
    console.log(`[${ok ? "OK" : "NG"}] isPdf=${isPdf} ct=${ct.slice(0,30)} len=${body.length} ${u.slice(30)}`);
    if (isPdf) console.log("  → PDF binary (parse library needed)");
  }

  // AR: ARCA新URLパターンを探す
  console.log("\n=== AR: ARCA 新URL ===");
  const arAlt = [
    "https://www.arca.gob.ar/",
    "https://arca.gob.ar/ganancias/",
    "https://www.argentina.gob.ar/arca",
    "https://serviciosweb.afip.gov.ar/",
  ];
  for (const u of arAlt) {
    const { ok, body, ct } = await fetchRaw(u);
    const text = strip(body);
    console.log(`[${ok ? "OK" : "NG"}] len=${text.length} ${u}`);
    if (ok && text.length > 100) console.log("  first 400:", text.slice(0, 400));
  }
}
main().catch(e => { console.error(e); process.exit(1); });

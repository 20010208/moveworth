/**
 * 20241231-4（112KB大型号）の内容確認 + GIB Wayback試行
 */
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
    .replace(/\s+/g, " ").trim();
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15000) });
    if (!r.ok) { console.log(`  HTTP ${r.status}`); return null; }
    return strip(await r.text());
  } catch (e: unknown) { console.log(`  ERROR: ${e instanceof Error ? e.message : e}`); return null; }
}

async function tryWB(url: string): Promise<{ text: string; snap: string } | null> {
  try {
    const a = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(10000) });
    if (!a.ok) return null;
    const j = await a.json() as { archived_snapshots?: { closest?: { url?: string } } };
    const snap = j.archived_snapshots?.closest?.url;
    if (!snap) { console.log("  WB: no snapshot"); return null; }
    console.log(`  WB snap: ${snap.slice(30, 90)}`);
    const r = await fetch(snap, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15000) });
    if (!r.ok) return null;
    return { text: strip(await r.text()), snap };
  } catch { return null; }
}

function scan(text: string, label: string): void {
  console.log(`\n[${label}] len=${text.length}`);
  // 数字（トルコ語千区切り: ドット使用）を探す
  const nums = text.match(/\d{1,3}(?:\.\d{3})+/g) ?? [];
  console.log("  numbers found:", [...new Set(nums)].slice(0, 30));

  // パーセンテージを探す
  const pcts = text.match(/%\s*\d+|\d+\s*%/g) ?? [];
  console.log("  percentages:", [...new Set(pcts)].slice(0, 20));

  // 重要キーワード周辺を表示
  for (const kw of ["GVK", "103", "tarife", "% 15", "% 20", "% 27", "% 35", "% 40", "Bütçe", "BÜTÇE", "Gelir Vergisi", "gelir vergisi"]) {
    const idx = text.indexOf(kw);
    if (idx !== -1) {
      console.log(`  kw="${kw}" @${idx}: ...${text.slice(Math.max(0, idx - 80), Math.min(text.length, idx + 300))}...`);
    }
  }

  // 最初の2000文字
  console.log("  [head 2000]:", text.slice(0, 2000));
}

async function main() {
  // 1. 20241231-4: 112KB の大型号
  console.log("=== 20241231-4 (112KB) ===");
  const g4 = await fetchText("https://www.resmigazete.gov.tr/eskiler/2024/12/20241231-4.htm");
  if (g4) scan(g4, "20241231-4");

  // 2. GIB Wayback — 所得税タリフェページ
  console.log("\n\n=== GIB Wayback: 所得税タリフェ候補 ===");
  const gibPaths = [
    "https://www.gib.gov.tr/pratik-bilgiler/gelir-vergisi-tarifeleri",
    "https://www.gib.gov.tr/gelir-vergisi-tarifesi",
    "https://www.gib.gov.tr/pratik-bilgiler",
    "https://www.gib.gov.tr/vergi-rehberi/bireysel/gelir-vergisi",
  ];
  for (const u of gibPaths) {
    console.log(`\n--- WB: ${u.slice(30)} ---`);
    const wb = await tryWB(u);
    if (wb) {
      console.log(`  len=${wb.text.length}`);
      const hasTax = /% ?15|% ?20|% ?27|% ?35|% ?40|tarife|dilim/.test(wb.text);
      console.log(`  hasTax=${hasTax}`);
      if (hasTax) {
        const pcts = wb.text.match(/%\s*\d+|\d+\s*%/g) ?? [];
        console.log("  pcts:", [...new Set(pcts)]);
        console.log("  text:", wb.text.slice(0, 2000));
      } else {
        console.log("  head:", wb.text.slice(0, 300));
      }
    }
  }

  // 3. November/December 2024 の別号を試す（年次Tebliğは11月に出ることも）
  console.log("\n\n=== November 2024 官報を確認 ===");
  const novUrls = [
    "https://www.resmigazete.gov.tr/eskiler/2024/11/20241128-1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/11/20241128-2.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/11/20241129-1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/11/20241130-1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/11/20241126-1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/12/20241221-1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/12/20241227-1.htm",
  ];
  for (const u of novUrls) {
    const t = await fetchText(u);
    if (!t || t.length < 100) { console.log(`[NG] ${u.slice(50)}`); continue; }
    const hasTax = /GVK|103.*madde|Gelir Vergisi.*Tarife|% ?15.*% ?20|158\.000|330\.000/.test(t);
    console.log(`[${hasTax ? "TAX" : "   "}] len=${t.length} ${u.slice(50)}`);
    if (hasTax) {
      console.log("  *** FOUND ***:", t.slice(0, 2000));
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });

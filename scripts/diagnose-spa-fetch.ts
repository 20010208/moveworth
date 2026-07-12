/**
 * SPA判定診断: 指定URLをフェッチして isSourceUseful の各ヒット条件を詳細に出力
 */
import { existsSync, readFileSync } from "fs";

// .env.local 読み込み
if (existsSync(".env.local")) {
  for (const l of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = l.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim();
    if (!(k in process.env)) process.env[k] = t.slice(eq + 1).trim();
  }
}

const MAX_CHARS = 15000;
const TIMEOUT_MS = 20_000;

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function analyzeUseful(text: string): { useful: boolean; hits: number; detail: string[] } {
  if (!text || text.length < 300) return { useful: false, hits: 0, detail: ["text too short (<300 chars)"] };
  const detail: string[] = [];
  let hits = 0;
  // Hit 1: 通貨＋数値
  const m1 = text.match(/(?:NZD|EUR|USD|GBP|AUD|CAD|SGD|CHF|PLN|TND|SEK|NOK)\s?\$?[\d,]+|[\d,]+\s*(?:EUR|PLN|euros?)|[$€£]\s?[\d,]+/i);
  if (m1) { hits++; detail.push(`✅ Hit1(currency): "${m1[0]}"`); } else { detail.push("❌ Hit1(currency): no match"); }
  // Hit 2: パーセント
  const m2 = text.match(/\d+\.?\d*\s*%/);
  if (m2) { hits++; detail.push(`✅ Hit2(percent): "${m2[0]}"`); } else { detail.push("❌ Hit2(percent): no match"); }
  // Hit 3: 期間
  const m3 = text.match(/\d+\s*(days?|weeks?|months?|years?|hours?)/i);
  if (m3) { hits++; detail.push(`✅ Hit3(duration): "${m3[0]}"`); } else { detail.push("❌ Hit3(duration): no match"); }
  // Hit 4: ポイント
  const m4 = text.match(/\d+\s*points?/);
  if (m4) { hits++; detail.push(`✅ Hit4(points): "${m4[0]}"`); } else { detail.push("❌ Hit4(points): no match"); }
  // Hit 5: 要件＋数値
  const m5 = text.match(/(require|eligib|qualif|must have|criteria|condition|permit|residence|visa|employ|work permit|foreign staff|national|labor|labour)[\s\S]{0,100}\d/i);
  if (m5) { hits++; detail.push(`✅ Hit5(requirement+digit): "${m5[0].slice(0, 60)}..."`); } else { detail.push("❌ Hit5(requirement+digit): no match"); }
  return { useful: hits >= 2, hits, detail };
}

async function diagnose(label: string, url: string) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`[${label}] ${url}`);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MoveWorthBot/1.0)" },
    });
    clearTimeout(timer);
    const ct = res.headers.get("content-type") ?? "";
    console.log(`  HTTP ${res.status}  content-type: ${ct}`);
    if (!res.ok) { console.log("  → fetch failed (non-2xx)"); return; }
    const rawHtml = await res.text();
    console.log(`  rawHtml length: ${rawHtml.length} chars`);
    const text = stripHtml(rawHtml).slice(0, MAX_CHARS);
    console.log(`  stripped length: ${text.length} chars`);
    console.log(`  text (first 300 chars): "${text.slice(0, 300)}"`);
    const result = analyzeUseful(text);
    console.log(`\n  isSourceUseful → ${result.useful ? "✅ USEFUL" : "❌ NOT USEFUL"} (hits: ${result.hits}/5, need ≥2)`);
    for (const d of result.detail) console.log(`    ${d}`);
  } catch (e) {
    clearTimeout(timer);
    console.log(`  → exception: ${e instanceof Error ? e.message : String(e)}`);
  }
}

async function main() {
  // TH: Wayback スナップショット本文に17%があるか確認
  console.log("\n### TH: rd.go.th Wayback snapshot の17%確認 ###");
  const wb = "https://web.archive.org/web/2024/https://www.rd.go.th/english/6045.html";
  await diagnose("TH-Wayback(approx)", "https://www.rd.go.th/english/6045.html");

  // SG: IRAS
  await diagnose("SG-IRAS", "https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-residency-and-tax-rates/individual-income-tax-rates");

  // MY: HaSiL tax rates
  await diagnose("MY-HaSiL-rates", "https://www.hasil.gov.my/en/individu/kadar-cukai/");

  // MY: HaSiL intro
  await diagnose("MY-HaSiL-intro", "https://www.hasil.gov.my/en/individu/pengenalan-cukai-pendapatan-individu/");
}

main().catch(console.error);

/**
 * BE / EE / PL / TN の一次情報URL検証 → country_sources 登録 → visa記事再生成
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_CHARS = 3_000;
const FETCH_TIMEOUT = 10_000;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function isSourceUseful(text: string): boolean {
  if (!text || text.length < 300) return false;
  let hits = 0;
  if (/(?:EUR|USD|GBP|PLN|TND|SEK|NOK|\$|€|£)\s?[\d,]+|[\d,]+\s*(?:EUR|PLN|euros?)/i.test(text)) hits++;
  if (/\d+\.?\d*\s*%/.test(text)) hits++;
  if (/\d+\s*(days?|weeks?|months?|years?)/i.test(text)) hits++;
  if (/\d+\s*points?/i.test(text)) hits++;
  if (/(require|eligib|qualif|must have|criteria|condition|permit|residence|visa)[\s\S]{0,80}\d/i.test(text)) hits++;
  return hits >= 2;
}

async function fetchText(url: string): Promise<{ text: string | null; status: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": UA, "Accept": "text/html,*/*;q=0.8", "Accept-Language": "en-US,en;q=0.9" },
    });
    clearTimeout(timer);
    if (!res.ok) return { text: null, status: res.status };
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("html") && !ct.includes("text")) return { text: null, status: res.status };
    const html = await res.text();
    return { text: stripHtml(html).slice(0, MAX_CHARS), status: res.status };
  } catch (e: unknown) {
    clearTimeout(timer);
    const msg = e instanceof Error ? e.message : String(e);
    return { text: null, status: msg.includes("abort") ? 0 : -1 };
  }
}

async function tryWayback(url: string): Promise<string | null> {
  try {
    const apiController = new AbortController();
    const apiTimer = setTimeout(() => apiController.abort(), 6_000);
    const apiRes = await fetch(
      `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`,
      { signal: apiController.signal }
    );
    clearTimeout(apiTimer);
    if (!apiRes.ok) return null;
    type WBResp = { archived_snapshots?: { closest?: { url?: string; available?: boolean } } };
    const data = await apiRes.json() as WBResp;
    const snap = data.archived_snapshots?.closest;
    if (!snap?.available || !snap.url) return null;
    const { text } = await fetchText(snap.url);
    return text;
  } catch {
    return null;
  }
}

interface Candidate { url: string; purpose: "visa" | "study" | "general" }

const CANDIDATES: Record<string, Candidate[]> = {
  be: [
    { url: "https://dofi.ibz.be/en", purpose: "visa" },
    { url: "https://www.belgium.be/en/family/foreigners/coming_to_live_in_belgium", purpose: "visa" },
    { url: "https://economischmigrant.be/en", purpose: "visa" },
  ],
  ee: [
    { url: "https://www.politsei.ee/en/", purpose: "visa" },
    { url: "https://www.workinestonia.com/", purpose: "visa" },
    { url: "https://www.smartsettlers.ee/", purpose: "visa" },
  ],
  pl: [
    { url: "https://www.gov.pl/web/udsc-en", purpose: "visa" },
    { url: "https://www.paih.gov.pl/en", purpose: "visa" },
    { url: "https://www.welcomepoland.pl/", purpose: "visa" },
  ],
  tn: [
    { url: "https://www.investintunisia.tn/en/", purpose: "visa" },
    { url: "https://aneti.tn/en/", purpose: "visa" },
    { url: "https://www.agence-etrangers.tn/", purpose: "visa" },
  ],
};

type VerifyResult = {
  url: string;
  purpose: "visa" | "study" | "general";
  status: "alive" | "unverified" | "dead";
  useful: boolean;
  detail: string;
};

async function verifyCandidate(c: Candidate): Promise<VerifyResult> {
  const { text, status } = await fetchText(c.url);
  if (status === 200 || (status > 200 && status < 400)) {
    const useful = isSourceUseful(text ?? "");
    if (useful) return { ...c, status: "alive", useful: true, detail: `HTTP ${status} ✅ useful` };

    // SPA/low-quality → try Wayback
    const wb = await tryWayback(c.url);
    if (wb && isSourceUseful(wb)) {
      return { ...c, status: "alive", useful: true, detail: `HTTP ${status} → Wayback ✅ useful` };
    }
    return { ...c, status: "alive", useful: false, detail: `HTTP ${status} ⚠️ SPA/low-quality` };
  }
  if (status === 404 || status === 410) {
    return { ...c, status: "dead", useful: false, detail: `HTTP ${status}` };
  }
  if (status === 403 || status === 429 || status === 503 || status === 0) {
    // bot-block or timeout → try Wayback
    const wb = await tryWayback(c.url);
    if (wb && isSourceUseful(wb)) {
      return { ...c, status: "alive", useful: true, detail: `HTTP ${status} → Wayback ✅ useful` };
    }
    return { ...c, status: "unverified", useful: false, detail: `HTTP ${status} bot-block/timeout` };
  }
  return { ...c, status: "unverified", useful: false, detail: `HTTP ${status} unknown` };
}

async function main() {
  console.log("=== BE/EE/PL/TN URL検証 & country_sources 登録 ===\n");

  const toInsert: Array<{ country_code: string; url: string; purpose: string; status: string; useful: boolean; detail: string }> = [];

  for (const [code, candidates] of Object.entries(CANDIDATES)) {
    console.log(`\n--- ${code.toUpperCase()} (${candidates.length}件) ---`);
    for (const c of candidates) {
      process.stdout.write(`  ${c.url} ... `);
      const r = await verifyCandidate(c);
      console.log(r.detail);
      toInsert.push({ country_code: code, url: c.url, purpose: c.purpose, status: r.status, useful: r.useful, detail: r.detail });
    }
  }

  console.log("\n=== country_sources 登録 ===");
  let inserted = 0, skipped = 0, errors = 0;

  for (const row of toInsert) {
    // 既存確認
    const { data: existing } = await supabase
      .from("country_sources")
      .select("id, status")
      .eq("country_code", row.country_code)
      .eq("url", row.url)
      .single();

    if (existing) {
      console.log(`  [${row.country_code}] skip (既存): ${row.url}`);
      skipped++;
      continue;
    }

    const { error } = await supabase.from("country_sources").insert({
      country_code: row.country_code,
      purpose: row.purpose,
      url: row.url,
      status: row.status,
      source: "manual",
      last_verified_at: new Date().toISOString(),
    });

    if (error) {
      console.error(`  [${row.country_code}] ❌ ${row.url}: ${error.message}`);
      errors++;
    } else {
      const icon = row.useful ? "✅" : "⚠️ ";
      console.log(`  [${row.country_code}] ${icon} ${row.status.padEnd(10)} ${row.url}`);
      inserted++;
    }
  }

  console.log(`\n登録完了: ${inserted}件, スキップ: ${skipped}件, エラー: ${errors}件`);

  // 登録後の alive かつ useful なエントリを確認
  console.log("\n=== 登録後の alive URL（useful のもの） ===");
  for (const code of Object.keys(CANDIDATES)) {
    const { data } = await supabase.from("country_sources")
      .select("url, status")
      .eq("country_code", code)
      .eq("status", "alive");
    const usefulRows = toInsert.filter(r => r.country_code === code && r.useful && r.status === "alive").map(r => r.url);
    const alivedUrls = (data ?? []).map(r => r.url);
    const grounded = alivedUrls.some(u => usefulRows.includes(u));
    console.log(`  ${code.toUpperCase()}: alive=${alivedUrls.length}件 grounded=${grounded ? "✅" : "❌（手動確認要）"}`);
    alivedUrls.forEach(u => console.log(`    ${u}`));
  }
}

main().catch(console.error);

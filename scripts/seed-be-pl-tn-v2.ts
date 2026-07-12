/**
 * BE / PL / TN 一次情報URL（手動確認済み）を country_sources に登録
 * 検証: 直接 fetch → SPA なら Wayback フォールバック
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

const FETCH_TIMEOUT = 12_000;
const MAX_CHARS = 3_000;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function isSourceUseful(text: string): boolean {
  if (!text || text.length < 300) return false;
  let hits = 0;
  if (/(?:EUR|USD|GBP|PLN|TND|SEK|NOK|\$|€|£)\s?[\d,]+|[\d,]+\s*(?:EUR|PLN|TND|euros?)/i.test(text)) hits++;
  if (/\d+\.?\d*\s*%/.test(text)) hits++;
  if (/\d+\s*(days?|weeks?|months?|years?)/i.test(text)) hits++;
  if (/\d+\s*points?/i.test(text)) hits++;
  if (/(require|eligib|qualif|must have|criteria|condition|permit|residence|visa|employ|work|staff|worker)/i.test(text) && /\d/.test(text)) hits++;
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

async function tryWayback(url: string): Promise<{ text: string | null; snapUrl: string | null }> {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 8_000);
    const ar = await fetch(
      `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`,
      { signal: ac.signal }
    );
    clearTimeout(t);
    if (!ar.ok) return { text: null, snapUrl: null };
    type WBResp = { archived_snapshots?: { closest?: { url?: string; available?: boolean } } };
    const data = await ar.json() as WBResp;
    const snap = data.archived_snapshots?.closest;
    if (!snap?.available || !snap.url) return { text: null, snapUrl: null };
    const { text } = await fetchText(snap.url);
    return { text, snapUrl: snap.url };
  } catch {
    return { text: null, snapUrl: null };
  }
}

interface Candidate { url: string; purpose: "visa" | "study" | "general"; note?: string }

const CANDIDATES: Record<string, Candidate[]> = {
  be: [
    { url: "https://japan.diplomatie.belgium.be/en/travel-belgium/visa-belgium/types-visa/d-visa-single-permit-approval-holders", purpose: "visa", note: "在日BE大使館・就労Dビザ" },
    { url: "https://employment.belgium.be/en/themes/international/foreign-workers", purpose: "visa", note: "連邦雇用省・外国人労働者制度" },
    { url: "https://japan.diplomatie.belgium.be/en/travel-belgium/visa-belgium/types-visa/d-visa-students-higher-education-minimum-stay-91-days", purpose: "visa", note: "在日BE大使館・学生Dビザ" },
  ],
  pl: [
    { url: "https://www.gov.pl/web/mswia-en/entry-conditions-for-working-purposes", purpose: "visa", note: "内務行政省・就労目的入国条件" },
    { url: "https://www.gov.pl/web/mswia-en/entry-and-residence-conditions-for-foreign-nationals-in-poland", purpose: "visa", note: "内務行政省・滞在制度全般" },
    { url: "https://www.gov.pl/web/diplomacy/increase-in-national-visa-fees", purpose: "visa", note: "外務省・Dビザ料金135EUR (2024-06-01)" },
  ],
  tn: [
    { url: "https://guide.tia.gov.tn/en/tunisian_labor_law", purpose: "visa", note: "TIA・外国人雇用と労働法（断続タイムアウトあり）" },
    { url: "https://guide.tia.gov.tn/en/faq", purpose: "visa", note: "TIA FAQ・外国人幹部30%ルール" },
  ],
};

async function verifyCandidate(code: string, c: Candidate): Promise<{ status: "alive" | "unverified" | "dead"; useful: boolean; detail: string }> {
  const { text, status } = await fetchText(c.url);

  if (status === 404 || status === 410) return { status: "dead", useful: false, detail: `HTTP ${status}` };

  if (status === 200 || (status > 200 && status < 400)) {
    const useful = isSourceUseful(text ?? "");
    if (useful) return { status: "alive", useful: true, detail: `HTTP ${status} ✅ useful` };

    // SPA → Wayback
    const { text: wb, snapUrl } = await tryWayback(c.url);
    if (wb && isSourceUseful(wb)) {
      return { status: "alive", useful: true, detail: `HTTP ${status} → Wayback ✅ ${snapUrl?.slice(0, 60)}` };
    }
    return { status: "alive", useful: false, detail: `HTTP ${status} ⚠️ SPA/low-quality` };
  }

  if ([403, 429, 503, 0, -1].includes(status)) {
    // bot-block or timeout → Wayback (2 retries for TN)
    const maxRetries = code === "tn" ? 2 : 1;
    for (let i = 0; i < maxRetries; i++) {
      const { text: wb, snapUrl } = await tryWayback(c.url);
      if (wb && isSourceUseful(wb)) {
        return { status: "alive", useful: true, detail: `HTTP ${status} → Wayback ✅ ${snapUrl?.slice(0, 60)}` };
      }
      if (i < maxRetries - 1) await new Promise((r) => setTimeout(r, 3000));
    }
    return { status: "unverified", useful: false, detail: `HTTP ${status} bot-block/timeout (Wayback も取得不可)` };
  }

  return { status: "unverified", useful: false, detail: `HTTP ${status} unknown` };
}

async function main() {
  console.log("=== BE/PL/TN URL検証 & country_sources 登録 ===\n");

  for (const [code, candidates] of Object.entries(CANDIDATES)) {
    console.log(`\n--- ${code.toUpperCase()} (${candidates.length}件) ---`);
    for (const c of candidates) {
      process.stdout.write(`  [${c.note}]\n  ${c.url}\n  → `);
      const r = await verifyCandidate(code, c);
      console.log(`${r.status}  useful=${r.useful}  ${r.detail}\n`);

      // DB に既存か確認
      const { data: existing } = await supabase
        .from("country_sources")
        .select("id, status")
        .eq("country_code", code)
        .eq("url", c.url)
        .single();

      if (existing) {
        // status を更新
        const { error } = await supabase
          .from("country_sources")
          .update({ status: r.status, last_verified_at: new Date().toISOString() })
          .eq("id", existing.id);
        console.log(`  [${code}] 既存 → status 更新: ${r.status}${error ? ` ❌ ${error.message}` : " ✓"}`);
      } else {
        const { error } = await supabase.from("country_sources").insert({
          country_code: code,
          purpose: c.purpose,
          url: c.url,
          status: r.status,
          source: "manual",
          last_verified_at: new Date().toISOString(),
        });
        const icon = r.useful ? "✅" : r.status === "alive" ? "⚠️ " : "❌";
        console.log(`  [${code}] ${icon} 登録: ${r.status.padEnd(10)} ${c.url}${error ? `\n  ❌ ${error.message}` : ""}`);
      }
    }
  }

  console.log("\n=== 登録後の alive URL 確認 ===");
  for (const code of Object.keys(CANDIDATES)) {
    const { data } = await supabase.from("country_sources")
      .select("url, status")
      .eq("country_code", code)
      .eq("status", "alive");
    console.log(`  ${code.toUpperCase()}: alive ${(data ?? []).length}件`);
    (data ?? []).forEach((r: { url: string }) => console.log(`    ${r.url}`));
  }

  console.log("\n=== 完了 ===");
}

main().catch(console.error);

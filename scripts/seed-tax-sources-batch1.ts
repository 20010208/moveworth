/**
 * 税務当局 URL バッチ1 を country_sources に登録（purpose: "tax"）
 *
 * 特記事項:
 *   AU (ato.gov.au): bot に 403 を返す → Wayback → それでも取得不可なら unverified (dead にしない)
 *   TH (rd.go.th): ページ本文に 2013-14 年の古い注記あり。ステータス登録は通常通り行う
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

const FETCH_TIMEOUT = 14_000;
const MAX_CHARS = 4_000;
const UA_CHROME = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";
const UA_SAFARI = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15";

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
  if (!text || text.length < 200) return false;
  let hits = 0;
  if (/[\d,]+\s*%/.test(text)) hits++;                                              // 税率
  if (/[\d,]+\s*(?:USD|EUR|AUD|SGD|MYR|THB|GBP|PLN|TND|\$|€|£|฿)/i.test(text)) hits++;  // 金額
  if (/\d+\s*(days?|weeks?|months?|years?)/i.test(text)) hits++;                   // 期間
  if (/(income tax|tax rate|resident|bracket|individual|relief|exempt|personal)[\s\S]{0,120}\d/i.test(text)) hits++;
  return hits >= 2;
}

async function fetchText(url: string, ua = UA_CHROME): Promise<{ text: string | null; status: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(url, {
      signal: controller.signal, redirect: "follow",
      headers: { "User-Agent": ua, "Accept": "text/html,*/*;q=0.8", "Accept-Language": "en-US,en;q=0.9" },
    });
    clearTimeout(timer);
    if (!res.ok) return { text: null, status: res.status };
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("html") && !ct.includes("text")) return { text: null, status: res.status };
    const html = await res.text();
    return { text: stripHtml(html).slice(0, MAX_CHARS), status: res.status };
  } catch (e: unknown) {
    clearTimeout(timer);
    return { text: null, status: (e instanceof Error && e.message.includes("abort")) ? 0 : -1 };
  }
}

async function tryWayback(url: string): Promise<{ text: string | null; snapUrl: string | null }> {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 8_000);
    const ar = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`, { signal: ac.signal });
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

interface Candidate { url: string; note?: string }

const CANDIDATES: Record<string, Candidate[]> = {
  be: [
    { url: "https://fin.belgium.be/en/private-individuals/tax-return/income/tax-rates", note: "ベルギー財務省・個人所得税率" },
    { url: "https://fin.belgium.be/en/private-individuals/tax-return/non-resident/tax-return", note: "ベルギー財務省・非居住者税申告" },
  ],
  pl: [
    { url: "https://www.podatki.gov.pl/en/residents/personal-income-tax-rates/", note: "ポーランド税務局・個人所得税率" },
    { url: "https://www.podatki.gov.pl/en/residents/tax-residence", note: "ポーランド税務局・税務居住" },
  ],
  ee: [
    { url: "https://www.emta.ee/en/private-client/taxes-and-payment/declaration-income/tax-rates", note: "エストニア税務局・税率" },
    { url: "https://www.emta.ee/en/private-client/foreigner-non-resident/non-residents/declaration-and-forms", note: "エストニア税務局・非居住者申告" },
  ],
  sg: [
    { url: "https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-residency-and-tax-rates/individual-income-tax-rates", note: "シンガポールIRAS・個人所得税率" },
  ],
  my: [
    { url: "https://www.hasil.gov.my/en/individu/kadar-cukai/", note: "マレーシアHASiL・税率" },
    { url: "https://www.hasil.gov.my/en/individu/pengenalan-cukai-pendapatan-individu/", note: "マレーシアHASiL・個人所得税概要" },
  ],
  th: [
    { url: "https://www.rd.go.th/english/6045.html", note: "タイ歳入局・個人所得税率（本文に2013-14年の旧注記あり）" },
  ],
  au: [
    { url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", note: "ATO・居住者税率（bot403確認済み）" },
    { url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-foreign-residents", note: "ATO・非居住者税率（bot403確認済み）" },
  ],
  us: [
    { url: "https://www.irs.gov/filing/federal-income-tax-rates-and-brackets", note: "IRS・連邦所得税率・ブラケット" },
    { url: "https://www.irs.gov/individuals/international-taxpayers/taxation-of-nonresident-aliens", note: "IRS・非居住外国人の課税" },
  ],
  gb: [
    { url: "https://www.gov.uk/income-tax-rates", note: "英国政府・所得税率" },
    { url: "https://www.gov.uk/tax-uk-income-live-abroad", note: "英国政府・海外在住の英国所得課税" },
  ],
};

type VerifyResult = "alive" | "unverified" | "dead";

async function verifyUrl(
  code: string,
  url: string
): Promise<{ status: VerifyResult; useful: boolean; detail: string }> {
  // 1回目 UA_CHROME
  const r1 = await fetchText(url, UA_CHROME);

  if (r1.status === 200 || (r1.status > 200 && r1.status < 400)) {
    const useful = isSourceUseful(r1.text ?? "");
    if (useful) return { status: "alive", useful: true, detail: `HTTP ${r1.status} ✅ useful` };

    // SPA → Wayback
    const { text: wb, snapUrl } = await tryWayback(url);
    if (wb && isSourceUseful(wb)) {
      return { status: "alive", useful: true, detail: `HTTP ${r1.status} → Wayback ✅ ${snapUrl?.slice(30, 70)}` };
    }
    return { status: "alive", useful: false, detail: `HTTP ${r1.status} ⚠️ SPA/low-quality` };
  }

  if (r1.status === 404 || r1.status === 410) {
    return { status: "dead", useful: false, detail: `HTTP ${r1.status}` };
  }

  // 403/429/5xx/timeout → UA_SAFARI で再試行
  const r2 = await fetchText(url, UA_SAFARI);
  if (r2.status === 200 || (r2.status > 200 && r2.status < 400)) {
    const useful = isSourceUseful(r2.text ?? "");
    if (useful) return { status: "alive", useful: true, detail: `HTTP ${r2.status} UA_SAFARI ✅` };
    const { text: wb, snapUrl } = await tryWayback(url);
    if (wb && isSourceUseful(wb)) {
      return { status: "alive", useful: true, detail: `HTTP ${r2.status} → Wayback ✅ ${snapUrl?.slice(30, 70)}` };
    }
    return { status: "alive", useful: false, detail: `HTTP ${r2.status} UA_SAFARI ⚠️` };
  }

  // Wayback フォールバック（AU 等の bot 遮断を想定、dead にしない）
  const { text: wb, snapUrl } = await tryWayback(url);
  if (wb && isSourceUseful(wb)) {
    return { status: "alive", useful: true, detail: `HTTP ${r1.status}/${r2.status} → Wayback ✅ ${snapUrl?.slice(30, 70)}` };
  }

  // 404/410 以外で取得不可 → unverified (dead にしない)
  const detail = r2.status ? `HTTP ${r1.status}/${r2.status} bot-block` : `${r1.detail ?? r1.status} timeout`;
  return { status: "unverified", useful: false, detail };
}

async function upsertSource(code: string, url: string, status: VerifyResult): Promise<void> {
  const { data: existing } = await supabase
    .from("country_sources")
    .select("id, status")
    .eq("country_code", code)
    .eq("url", url)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("country_sources")
      .update({ status, last_verified_at: new Date().toISOString() })
      .eq("id", existing.id);
    console.log(`  [${code}] 既存 → status 更新: ${status}${error ? ` ❌ ${error.message}` : " ✓"}`);
  } else {
    const { error } = await supabase.from("country_sources").insert({
      country_code: code,
      purpose: "tax",
      url,
      status,
      source: "manual",
      last_verified_at: new Date().toISOString(),
    });
    const icon = status === "alive" ? "✅" : status === "unverified" ? "⚠️ " : "❌";
    console.log(`  [${code}] ${icon} ${status.padEnd(10)} ${url}${error ? `\n     ❌ ${error.message}` : ""}`);
  }
}

async function main() {
  console.log("=== 税務当局 URL バッチ1 検証・登録 ===\n");

  const summary: Record<string, { alive: number; unverified: number; dead: number; useful: number }> = {};

  for (const [code, candidates] of Object.entries(CANDIDATES)) {
    console.log(`\n--- ${code.toUpperCase()} ---`);
    summary[code] = { alive: 0, unverified: 0, dead: 0, useful: 0 };

    for (const c of candidates) {
      process.stdout.write(`  [${c.note ?? c.url}]\n  → `);
      const r = await verifyUrl(code, c.url);
      console.log(`${r.status}  useful=${r.useful}  ${r.detail}`);

      await upsertSource(code, c.url, r.status);
      summary[code][r.status]++;
      if (r.useful) summary[code].useful++;
    }
  }

  console.log("\n=== 結果サマリー（国別） ===");
  for (const [code, s] of Object.entries(summary)) {
    console.log(`  ${code.toUpperCase().padEnd(4)}: alive=${s.alive}  unverified=${s.unverified}  dead=${s.dead}  useful=${s.useful}`);
  }

  console.log("\n=== 登録後 DB 確認（tax, alive） ===");
  const { data } = await supabase.from("country_sources").select("country_code, url, status").eq("purpose", "tax").in("status", ["alive"]);
  const byCode: Record<string, string[]> = {};
  for (const r of data ?? []) {
    if (!byCode[r.country_code]) byCode[r.country_code] = [];
    byCode[r.country_code].push(r.url);
  }
  for (const [code, urls] of Object.entries(byCode)) {
    console.log(`  ${code.toUpperCase()}: ${urls.length}件`);
    urls.forEach((u: string) => console.log(`    ${u}`));
  }

  console.log("\n=== 完了 ===");
}

main().catch(console.error);

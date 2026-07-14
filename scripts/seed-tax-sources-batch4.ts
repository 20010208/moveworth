/**
 * 税務当局 URL バッチ4（FI/HU/RO/CY）を country_sources に登録（purpose: "tax"）
 *
 * - FI: vero.fi（フィンランド語・Valtion tuloveroasteikko 2026 累進表）
 * - HU: njt.jog.gov.hu（ハンガリー所得税法・15%フラット）
 * - RO: legislatie.just.ro（ルーマニア財政法典・10%フラット）→ SPA疑い・Wayback試行
 * - CY: businessincyprus.gov.cy（キプロス・2026年新税率表 0/20/25/30/35%・€22,000非課税枠）
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
const MAX_CHARS = 8_000;
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

function isTaxSourceUseful(text: string): boolean {
  if (!text || text.length < 300) return false;
  const percentMatches = [...text.matchAll(/(\d+(?:[.,]\d+)?)\s*%/g)];
  const distinct = new Set(percentMatches.map(m => m[1]));
  return distinct.size >= 2;
}

async function fetchText(url: string, ua = UA_CHROME): Promise<{ text: string | null; status: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": ua, "Accept": "text/html,*/*;q=0.8", "Accept-Language": "en-US,en;q=0.9,fi;q=0.8,hu;q=0.7,ro;q=0.6" },
    });
    clearTimeout(timer);
    if (!res.ok) return { text: null, status: res.status };
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("html") && !ct.includes("text")) return { text: null, status: res.status };
    const html = await res.text();
    const stripped = stripHtml(html);
    console.log(`    [fetch] ${url.slice(0, 60)} | len=${stripped.length}`);
    return { text: stripped.slice(0, MAX_CHARS), status: res.status };
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
    console.log(`    [wayback] → ${snap.url.slice(0, 70)}`);
    const { text } = await fetchText(snap.url);
    return { text, snapUrl: snap.url };
  } catch {
    return { text: null, snapUrl: null };
  }
}

type VerifyResult = "alive" | "unverified" | "dead";

async function verifyUrl(code: string, url: string): Promise<{ status: VerifyResult; useful: boolean; detail: string }> {
  const r1 = await fetchText(url, UA_CHROME);

  if (r1.status === 200 || (r1.status > 200 && r1.status < 400)) {
    const useful = isTaxSourceUseful(r1.text ?? "");
    if (useful) return { status: "alive", useful: true, detail: `HTTP ${r1.status} ✅ useful` };

    // SPA疑い → Wayback
    const { text: wb, snapUrl } = await tryWayback(url);
    if (wb && isTaxSourceUseful(wb)) {
      return { status: "alive", useful: true, detail: `HTTP ${r1.status} → Wayback ✅ ${snapUrl?.slice(30, 70)}` };
    }
    return { status: "alive", useful: false, detail: `HTTP ${r1.status} ⚠️ SPA/low-quality (len=${r1.text?.length})` };
  }

  if (r1.status === 404 || r1.status === 410) {
    return { status: "dead", useful: false, detail: `HTTP ${r1.status}` };
  }

  const r2 = await fetchText(url, UA_SAFARI);
  if (r2.status === 200 || (r2.status > 200 && r2.status < 400)) {
    const useful = isTaxSourceUseful(r2.text ?? "");
    if (useful) return { status: "alive", useful: true, detail: `HTTP ${r2.status} UA_SAFARI ✅` };

    const { text: wb, snapUrl } = await tryWayback(url);
    if (wb && isTaxSourceUseful(wb)) {
      return { status: "alive", useful: true, detail: `UA_SAFARI → Wayback ✅ ${snapUrl?.slice(30, 70)}` };
    }
    return { status: "alive", useful: false, detail: `HTTP ${r2.status} UA_SAFARI ⚠️` };
  }

  const { text: wb, snapUrl } = await tryWayback(url);
  if (wb && isTaxSourceUseful(wb)) {
    return { status: "alive", useful: true, detail: `HTTP ${r1.status}/${r2.status} → Wayback ✅ ${snapUrl?.slice(30, 70)}` };
  }

  const detail = r2.status ? `HTTP ${r1.status}/${r2.status} bot-block` : `HTTP ${r1.status} timeout`;
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

const CANDIDATES: Record<string, { url: string; note: string }[]> = {
  fi: [
    { url: "https://www.vero.fi/henkiloasiakkaat/verokortti-ja-veroilmoitus/tulot/ansiotulot/", note: "フィンランド税務局 vero.fi・Valtion tuloveroasteikko 2026 累進表" },
  ],
  hu: [
    { url: "https://njt.jog.gov.hu/jogszabaly/1995-117-00-00", note: "ハンガリー個人所得税法 1995/CXVII（8条：15%フラット）" },
  ],
  ro: [
    { url: "https://legislatie.just.ro/Public/DetaliiDocument/171282", note: "ルーマニア財政法典（Codul Fiscal）・Art.64 10%フラット → SPA疑い・Wayback試行" },
  ],
  cy: [
    { url: "https://www.businessincyprus.gov.cy/doing-business-in-cyprus/start-your-business/registering-for-income-tax-and-value-added-tax/", note: "Cyprus Gov・2026年新税率表 0/20/25/30/35%・€22,000非課税枠" },
  ],
};

async function main() {
  console.log("=== 税務当局 URL バッチ4（FI/HU/RO/CY）検証・登録 ===\n");

  const summary: Record<string, { alive: number; unverified: number; dead: number; useful: number }> = {};

  for (const [code, candidates] of Object.entries(CANDIDATES)) {
    console.log(`\n--- ${code.toUpperCase()} ---`);
    summary[code] = { alive: 0, unverified: 0, dead: 0, useful: 0 };

    for (const c of candidates) {
      console.log(`  [${c.note}]`);
      const r = await verifyUrl(code, c.url);
      console.log(`  → ${r.status}  useful=${r.useful}  ${r.detail}`);
      await upsertSource(code, c.url, r.status);
      summary[code][r.status]++;
      if (r.useful) summary[code].useful++;
    }
  }

  console.log("\n=== 結果サマリー ===");
  for (const [code, s] of Object.entries(summary)) {
    console.log(`  ${code.toUpperCase().padEnd(4)}: alive=${s.alive}  unverified=${s.unverified}  dead=${s.dead}  useful=${s.useful}`);
  }

  console.log("\n=== 登録後 DB 確認（purpose=tax, FI/HU/RO/CY） ===");
  const { data } = await supabase
    .from("country_sources")
    .select("country_code, url, status")
    .eq("purpose", "tax")
    .in("country_code", ["fi", "hu", "ro", "cy"]);
  for (const r of data ?? []) {
    console.log(`  ${r.country_code.toUpperCase()} ${r.status.padEnd(12)} ${r.url}`);
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });

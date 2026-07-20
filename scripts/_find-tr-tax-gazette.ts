/**
 * TR 2025年所得税ブラケット（GVK 103. madde tarife）を含む
 * Resmi Gazete の補足号を特定する
 *
 * resmigazete.gov.tr/eskiler/2024/12/YYYYMMDD-N.htm を順番に試し、
 * 所得税キーワードを含む号を特定する
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

async function fetchRaw(url: string): Promise<{ ok: boolean; body: string; status: number }> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(10000) });
    const body = await r.text();
    return { ok: r.ok, body, status: r.status };
  } catch { return { ok: false, body: "", status: 0 }; }
}

function strip(h: string): string {
  return h
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z0-9#]+;/g, " ")
    .replace(/\s+/g, " ").trim();
}

// GVK 103. madde tarife に関連するキーワード（Windows-1254 Mojibake込み）
// "GVK" "103" "tarife" "dilim" "Gelir Vergisi" "% 15" "% 20" "% 27" "% 35" "% 40"
// トルコ語のMojibake: "İ"→"?" など文字化けするため数字パターンを主に使う
// 2025年ブラケット金額: 158,000 / 330,000 / 800,000 / 4,300,000 TL (概算)
const TAX_PATTERNS = [
  /GVK|103.*madde|tarife|dilim/i,
  /% 15|% ?20|% ?27|% ?35|% ?40/,
  /158\.000|330\.000|800\.000|4\.300\.000/,
  /gelir\s*vergisi\s*tarifes/i,
  /Gelir\s*İdaresi.*tarife/i,
];

function hasTaxContent(text: string): boolean {
  return TAX_PATTERNS.some(p => p.test(text));
}

async function main() {
  console.log("=== TR Resmi Gazete 2025年所得税ブラケット号を探索 ===\n");

  // 12月下旬〜31日の各号を試す
  const dates = [
    "20241228", "20241229", "20241230", "20241231",
    "20250101", "20250102", // 1月発行の可能性も
  ];
  const maxSupp = 20; // 補足号 -1 〜 -20

  const hits: string[] = [];

  for (const date of dates) {
    for (let n = 1; n <= maxSupp; n++) {
      const url = `https://www.resmigazete.gov.tr/eskiler/${date.slice(0,4)}/${date.slice(4,6)}/${date}-${n}.htm`;
      const { ok, body, status } = await fetchRaw(url);
      if (!ok || body.length < 100) {
        if (status === 404 && n === 1) break; // この日付に号なし
        continue;
      }
      const text = strip(body);
      const hasTax = hasTaxContent(text);
      console.log(`[${date}-${n}] len=${text.length} tax=${hasTax} status=${status}`);
      if (hasTax) {
        hits.push(url);
        console.log("  *** TAX CONTENT FOUND! ***");
        // 数字パターンを探す
        const nums = text.match(/[\d]{1,3}\.[\d]{3}\.[\d]{3}|[\d]{2,3}\.[\d]{3}/g);
        if (nums) console.log("  numbers:", [...new Set(nums)].slice(0, 20));
        console.log("  excerpt:", text.slice(0, 1500));
      }
      if (n >= 3 && !hasTax) {
        // 3号まで試してタックスなし → 次の日付へ（多すぎる場合はスキップ）
        // ただし12/31は号数が多い可能性があるので続ける
        if (date !== "20241231") break;
      }
    }
  }

  console.log("\n=== 結果 ===");
  if (hits.length > 0) {
    console.log("所得税ブラケットが含まれる号:");
    for (const h of hits) console.log(" ", h);
  } else {
    console.log("12月下旬〜1月初旬の官報では所得税ブラケットが見つかりませんでした。");
    console.log("→ 別の月（例: 12月中旬 or 11月）に掲載された可能性あり。");
  }
}
main().catch(e => { console.error(e); process.exit(1); });

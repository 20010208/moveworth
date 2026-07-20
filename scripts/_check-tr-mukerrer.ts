/**
 * TR Resmi Gazete Mükerrer号（臨時特別号）と広域スキャン
 * 年末大型政令・予算法はMükerrer号に掲載されることが多い
 */
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0 Safari/537.36";

function strip(h: string): string {
  return h
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z0-9#]+;/g, " ")
    .replace(/\s+/g, " ").trim();
}

async function get(url: string): Promise<{ ok: boolean; text: string; len: number }> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(10000) });
    if (!r.ok) return { ok: false, text: "", len: 0 };
    const t = strip(await r.text());
    return { ok: true, text: t, len: t.length };
  } catch { return { ok: false, text: "", len: 0 }; }
}

function hasTaxRates(t: string): boolean {
  // パーセンテージ（15/20/27/35/40）と金額（数十万〜数百万）の組み合わせ
  const hasPct = /(?:% ?15|% ?20|% ?27|% ?35|% ?40|15 ?%|20 ?%|27 ?%|35 ?%|40 ?%)/.test(t);
  const hasGVK = /GVK|103[.\s]madde|Gelir Vergisi Tarife|gelir vergisi tarifes/i.test(t);
  return hasPct || hasGVK;
}

async function main() {
  // 1. Mükerrer号（年末特別号）
  console.log("=== Mükerrer 号 ===");
  const mukUrls = [
    // 典型的な Mükerrer URL パターン
    "https://www.resmigazete.gov.tr/eskiler/2024/12/20241231-m1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/12/20241231-m2.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/12/20241231-m3.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/12/20241231M1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/12/20241231M2.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/12/20241230-m1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/12/20241230M1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/12/20241229-m1.htm",
    // 号数が多い日：12/31の15〜30号まで試す
    ...Array.from({ length: 20 }, (_, i) => `https://www.resmigazete.gov.tr/eskiler/2024/12/20241231-${i + 13}.htm`),
  ];

  let found = false;
  for (const u of mukUrls) {
    const { ok, text, len } = await get(u);
    if (!ok || len < 50) continue;
    const tax = hasTaxRates(text);
    console.log(`[${tax ? "TAX" : "   "}] len=${len} ${u.slice(55)}`);
    if (tax) {
      found = true;
      const pcts = text.match(/% ?\d+|\d+ ?%/g) ?? [];
      const nums = text.match(/\d{1,3}(?:\.\d{3})+/g) ?? [];
      console.log("  pcts:", [...new Set(pcts)].slice(0, 20));
      console.log("  nums:", [...new Set(nums)].slice(0, 20));
      console.log("  text:", text.slice(0, 3000));
    }
  }

  // 2. VUK Tebliğ（yeniden değerleme oranı）—通常は11月後半発表
  console.log("\n=== VUK yeniden değerleme oranı Tebliği（11月） ===");
  const vukUrls = [
    "https://www.resmigazete.gov.tr/eskiler/2024/11/20241120-1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/11/20241121-1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/11/20241122-1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/11/20241123-1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/11/20241125-1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/11/20241125-2.htm",
    "https://www.resmigazete.gov.tr/eskilers/2024/11/20241125-3.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/11/20241126-1.htm",
    "https://www.resmigazete.gov.tr/eskiler/2024/11/20241127-1.htm",
  ];
  for (const u of vukUrls) {
    const { ok, text, len } = await get(u);
    if (!ok || len < 50) { console.log(`[NG] ${u.slice(55)}`); continue; }
    // 再評価率キーワード
    const hasReval = /yeniden değleme|revalua|43|44|46|%\s*4[0-9]/.test(text);
    const tax = hasTaxRates(text);
    console.log(`[${tax ? "TAX" : hasReval ? "REV" : "   "}] len=${len} ${u.slice(55)}`);
    if (tax || hasReval) {
      console.log("  text:", text.slice(0, 1000));
    }
  }

  if (!found) {
    console.log("\n=== 見つからず — 知識ベース値を使用する場合のまとめ ===");
    console.log("TR 2025 所得税ブラケット（GVK 103. madde, 推定値）:");
    console.log("  0 - 158,000 TL: 15%");
    console.log("  158,001 - 330,000 TL: 20%");
    console.log("  330,001 - 800,000 TL: 27%");
    console.log("  800,001 - 4,300,000 TL: 35%");
    console.log("  4,300,001 TL以上: 40%");
    console.log("  ※ 2024年再評価率（約43.9%）をベースに計算");
    console.log("  ※ 一次情報ソース: GIBサイトはSPA取得不可, 官報でも該当号特定不可");
  }
}
main().catch(e => { console.error(e); process.exit(1); });

/**
 * blog_posts 公開90件の参考資料セクション内 URL ドメイン スキャン
 * .gov / .go.jp / .go.xx / .org / .edu 以外の民間ドメインを検出
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// 政府・国際機関・学術機関として許容するパターン
const SAFE_PATTERNS = [
  /\.gov(\.|\/|$)/i,       // .gov, .gov.au, .gov.uk 等
  /\.go\.[a-z]{2}(\/|$)/i, // .go.jp, .go.kr 等
  /\.go\.jp(\/|$)/i,
  /\.org(\/|$)/i,           // .org (IMF, WHO 等)
  /\.edu(\/|$)/i,           // 学術機関
  /\.int(\/|$)/i,           // 国際機関 (.int)
  /\.europa\.eu(\/|$)/i,    // EU
  /archive\.org/i,          // Wayback Machine
  /moj\.go\.jp/i,           // 日本法務省
  /nhis\.or\.kr/i,          // 韓国国民健康保険（.or.kr は政府外郭団体）
  /eps\.go\.kr/i,
  /hometax\.go\.kr/i,
  /immigration\.go\.kr/i,
  /studyinaustralia\.gov\.au/i,
  /fairwork\.gov\.au/i,
  /studyinthestates\.dhs\.gov/i,
  /eca\.state\.gov/i,
  /study-uk\.britishcouncil\.org/i,
  /ukcisa\.org\.uk/i,
  /britishcouncil\.org/i,
  /jasso\.go\.jp/i,
];

function isSafe(url: string): boolean {
  return SAFE_PATTERNS.some(p => p.test(url));
}

async function main() {
  const { data } = await sb
    .from("blog_posts")
    .select("slug, content, title")
    .eq("is_published", true)
    .order("slug");

  if (!data) { process.exit(1); }

  const URL_RE = /\[.*?\]\((https?:\/\/[^\s)]+)\)/g;
  const REF_SECTION_RE = /### 参考資料[\s\S]*/;

  type Finding = { slug: string; lang: string; url: string; domain: string };
  const findings: Finding[] = [];

  for (const r of data) {
    const c = (r.content ?? {}) as Record<string, string>;
    for (const lang of ["ja", "en", "zh"]) {
      const txt = c[lang] ?? "";
      const refMatch = txt.match(REF_SECTION_RE);
      if (!refMatch) continue;
      const refSection = refMatch[0];
      let m: RegExpExecArray | null;
      URL_RE.lastIndex = 0;
      while ((m = URL_RE.exec(refSection)) !== null) {
        const url = m[1];
        if (!isSafe(url)) {
          try {
            const domain = new URL(url).hostname;
            findings.push({ slug: r.slug, lang, url, domain });
          } catch { /* invalid URL */ }
        }
      }
    }
  }

  if (findings.length === 0) {
    console.log("✅ 民間ドメインURL: 0件（全件政府系/国際機関/.org）");
    return;
  }

  console.log(`⚠️  民間ドメインURL検出: ${findings.length}件\n`);
  // ドメイン別にグループ化
  const byDomain = new Map<string, Finding[]>();
  for (const f of findings) {
    if (!byDomain.has(f.domain)) byDomain.set(f.domain, []);
    byDomain.get(f.domain)!.push(f);
  }
  for (const [domain, items] of byDomain) {
    console.log(`\n[${domain}] ${items.length}件`);
    for (const i of items) {
      const t = ((data.find(r => r.slug === i.slug)?.title ?? {}) as Record<string, string>).ja ?? i.slug;
      console.log(`  ${i.slug} [${i.lang}]: ${i.url}`);
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });

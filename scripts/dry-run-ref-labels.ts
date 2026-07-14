/**
 * 参考資料ラベル改善第2弾 — dry-run プレビュー
 *
 * 公開ビザ記事のソースについて、現ラベル (urlToLabel) と新ラベル (buildRefLabel) を
 * 3言語で対比表示する。
 *
 * 使い方:
 *   npx tsx scripts/dry-run-ref-labels.ts             # デフォルト5記事サンプル
 *   npx tsx scripts/dry-run-ref-labels.ts --all       # 全公開記事
 *   npx tsx scripts/dry-run-ref-labels.ts kr de sg    # 指定国コードのみ
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ===== DOMAIN_LABEL_MAP (generate-country-article.ts と同期) =====
const DOMAIN_LABEL_MAP: Record<string, string> = {
  "immi.homeaffairs.gov.au": "オーストラリア内務省移民局",
  "ato.gov.au": "オーストラリア税務局（ATO）",
  "dofi.ibz.be": "ベルギー外国人局（DVZ/OE）",
  "belgium.be": "ベルギー政府公式サイト",
  "employment.belgium.be": "ベルギー雇用・労働省",
  "fin.belgium.be": "ベルギー財務省",
  "japan.diplomatie.belgium.be": "在日ベルギー大使館",
  "politsei.ee": "エストニア警察・国境警備局",
  "workinestonia.com": "Work in Estonia",
  "emta.ee": "エストニア税務・関税庁（EMTA）",
  "gov.uk": "英国政府（GOV.UK）",
  "britishcouncil.org": "ブリティッシュ・カウンシル",
  "ltr.boi.go.th": "タイ投資委員会（BOI）LTR",
  "ewp.doe.go.th": "タイ雇用局（DOE）就労許可",
  "thaievisa.go.th": "タイ外務省 e-Visa",
  "rd.go.th": "タイ歳入局（Revenue Department）",
  "mom.gov.sg": "シンガポール労働省（MOM）",
  "edb.gov.sg": "シンガポール経済開発庁（EDB）",
  "ica.gov.sg": "シンガポール移民局（ICA）",
  "iras.gov.sg": "シンガポール内国歳入庁（IRAS）",
  "uscis.gov": "米国移民局（USCIS）",
  "my.uscis.gov": "米国移民局（USCIS）myUSCIS",
  "irs.gov": "米国内国歳入庁（IRS）",
  "mm2h.gov.my": "マレーシア観光省 MM2H",
  "esd.imi.gov.my": "マレーシア移民局（IMI）ESD",
  "mdec.my": "マレーシアデジタル経済公社（MDEC）",
  "imi.gov.my": "マレーシア移民局（IMI）",
  "talentcorp.com.my": "TalentCorp Malaysia",
  "hasil.gov.my": "マレーシア内国歳入庁（HASiL）",
  "gov.pl": "ポーランド政府（GOV.PL）",
  "udsc.gov.pl": "ポーランド外国人局（UDSC）",
  "paih.gov.pl": "ポーランド投資・貿易庁（PAIH）",
  "podatki.gov.pl": "ポーランド税務局",
  "belastingdienst.nl": "オランダ税務・関税局（Belastingdienst）",
  "impots.gouv.fr": "フランス財務省税務局（DGFiP）",
  "agenziaentrate.gov.it": "イタリア歳入庁（Agenzia delle Entrate）",
  "agenciatributaria.gob.es": "スペイン国税庁（AEAT）",
  "bmf.gv.at": "オーストリア財務省（BMF）",
  "revenue.ie": "アイルランド歳入庁（Revenue）",
  "ird.govt.nz": "ニュージーランド内国歳入局（IRD）",
  "in.nts.go.kr": "韓国国税庁（NTS）",
  "nts.go.kr": "韓国国税庁（NTS）",
  "skatteverket.se": "スウェーデン税務庁（Skatteverket）",
  "skatteetaten.no": "ノルウェー税務局（Skatteetaten）",
  "skat.dk": "デンマーク税務庁（Skattestyrelsen）",
  "portal.gov.cz": "チェコ政府ポータル（portal.gov.cz）",
  "porezna-uprava.gov.hr": "クロアチア税務局（Porezna uprava）",
  "aade.gr": "ギリシャ独立歳入庁（AADE）",
  "mtca.gov.mt": "マルタ税関歳入庁（MTCA）",
  "u.ae": "UAE政府公式ポータル（u.ae）",
  "bundesfinanzministerium.de": "ドイツ連邦財務省（BMF）",
  "matsne.gov.ge": "ジョージア立法府公式ポータル（matsne.gov.ge）",
  "gov.hk": "香港政府（gov.hk）",
  "ird.gov.hk": "香港税務局（IRD）",
  "incometax.gov.in": "インド所得税局（IT Department）",
  "nta.go.jp": "国税庁（NTA）",
  "elibrary.judiciary.gov.ph": "フィリピン最高裁判所E-Library",
  "etax.nat.gov.tw": "台湾財政部税務ポータル（eTax）",
  "sars.gov.za": "南アフリカ歳入庁（SARS）",
  "nra.bg": "ブルガリア国家歳入庁（NRA）",
  "gov.br": "ブラジル連邦政府（gov.br）",
  "receitafederal.gov.br": "ブラジル連邦歳入局（Receita Federal）",
  "guangdong.chinatax.gov.cn": "中国広東省税務局",
  "micrositios.dian.gov.co": "コロンビア国税庁（DIAN）",
  "pajak.go.id": "インドネシア税務総局（DJP）",
  "gdt.gov.vn": "ベトナム税務総局（GDT）",
};

function urlToLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");
    const path = parsed.pathname;
    if (hostname === "canada.ca") {
      if (/\/revenue-agency|\/cra\b/i.test(path)) return "カナダ歳入庁（CRA）";
      if (/\/immigration|\/refugees|\/ircc/i.test(path)) return "カナダ移民・難民・市民権省（IRCC）";
      return "カナダ政府（canada.ca）";
    }
    return DOMAIN_LABEL_MAP[hostname] ?? DOMAIN_LABEL_MAP[`www.${hostname}`] ?? hostname;
  } catch { return url; }
}

const LANG_TAG: Record<string, Record<string, string>> = {
  ko: { ja: "韓国語", en: "Korean", zh: "韩语" },
  de: { ja: "ドイツ語", en: "German", zh: "德语" },
  fr: { ja: "フランス語", en: "French", zh: "法语" },
  nl: { ja: "オランダ語", en: "Dutch", zh: "荷兰语" },
  pl: { ja: "ポーランド語", en: "Polish", zh: "波兰语" },
  sv: { ja: "スウェーデン語", en: "Swedish", zh: "瑞典语" },
  da: { ja: "デンマーク語", en: "Danish", zh: "丹麦语" },
  no: { ja: "ノルウェー語", en: "Norwegian", zh: "挪威语" },
  fi: { ja: "フィンランド語", en: "Finnish", zh: "芬兰语" },
  pt: { ja: "ポルトガル語", en: "Portuguese", zh: "葡萄牙语" },
  es: { ja: "スペイン語", en: "Spanish", zh: "西班牙语" },
  it: { ja: "イタリア語", en: "Italian", zh: "意大利语" },
  el: { ja: "ギリシャ語", en: "Greek", zh: "希腊语" },
  zh: { ja: "中国語", en: "Chinese", zh: "中文" },
  ja: { ja: "日本語", en: "Japanese", zh: "日语" },
  th: { ja: "タイ語", en: "Thai", zh: "泰语" },
  vi: { ja: "ベトナム語", en: "Vietnamese", zh: "越南语" },
  ar: { ja: "アラビア語", en: "Arabic", zh: "阿拉伯语" },
};

function langTag(sourceLang: string | null | undefined, articleLocale: string): string {
  if (!sourceLang) return "";
  const sl = sourceLang.toLowerCase().slice(0, 3);
  const ARTICLE_LANG: Record<string, string> = { ja: "ja", en: "en", zh: "zh" };
  if (sl === ARTICLE_LANG[articleLocale]) return "";
  if (sl === "en") return "";
  const tag = LANG_TAG[sl];
  if (!tag) return "";
  return articleLocale === "ja" ? `（${tag.ja}）`
    : articleLocale === "zh" ? `（${tag.zh}）`
    : ` (${tag.en})`;
}

type SourceRow = {
  url: string;
  purpose: string;
  page_title_ja?: string | null;
  page_title_en?: string | null;
  page_title_zh?: string | null;
  page_title_original?: string | null;
  page_lang?: string | null;
};

// 同ドメイン複数URLでラベルが衝突した場合の区別用パスサフィックス
function pathSuffix(url: string): string {
  try {
    const u = new URL(url);
    const skip = new Set(["en","ja","de","fr","ko","zh","id","th","vi","ms","pt","es","it","nl",
      "en-us","en-gb","en-au","index","home","top","main","portal","wps","wcm","connect","bldcontentnl"]);
    const parts = u.pathname.split("/").filter(s => s.length > 2 && !skip.has(s.toLowerCase()));
    const seg = parts.at(-2) ?? parts.at(-1) ?? "";
    return seg.replace(/[^a-z0-9]/gi, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "").slice(0, 20);
  } catch { return ""; }
}

function buildRefLabel(source: SourceRow, articleLocale: string = "ja"): string {
  const institution = urlToLabel(source.url);
  const translated = articleLocale === "ja" ? source.page_title_ja
    : articleLocale === "en" ? source.page_title_en
    : source.page_title_zh;
  const titlePart = translated ?? source.page_title_original ?? null;
  if (!titlePart) return institution;
  const tag = langTag(source.page_lang, articleLocale);
  return `${institution} - ${titlePart}${tag}`;
}

const DEFAULT_SAMPLES = ["kr", "de", "sg", "ee", "jp"];

async function main() {
  const args = process.argv.slice(2).filter(a => !a.startsWith("--"));
  const ALL_MODE = process.argv.includes("--all");

  let countryCodes: string[];
  if (ALL_MODE) {
    const { data } = await sb.from("country_sources")
      .select("country_code").eq("status", "alive");
    countryCodes = [...new Set((data ?? []).map((r: { country_code: string }) => r.country_code))].sort();
  } else {
    countryCodes = args.length > 0 ? args.map(a => a.toLowerCase()) : DEFAULT_SAMPLES;
  }

  console.log(`\n=== 参考資料ラベル before/after プレビュー (${countryCodes.join(", ")}) ===\n`);

  let changedCount = 0, totalCount = 0;

  for (const code of countryCodes) {
    const { data: sources } = await sb.from("country_sources")
      .select("url, purpose, page_title_ja, page_title_en, page_title_zh, page_title_original, page_lang")
      .eq("country_code", code)
      .eq("status", "alive")
      .order("purpose");

    if (!sources || sources.length === 0) {
      console.log(`[${code.toUpperCase()}] sources なし\n`);
      continue;
    }

    const hasTitles = (sources as SourceRow[]).some(s => s.page_title_original);
    console.log(`### [${code.toUpperCase()}] — ${sources.length} sources ${hasTitles ? "" : "(タイトル未取得)"}`);
    console.log();

    for (const locale of ["ja", "en", "zh"]) {
      console.log(`  [${locale}]`);

      // ラベルを先に全構築してからdedup
      const items = (sources as SourceRow[]).map(s => ({
        s,
        label: buildRefLabel(s, locale),
      }));
      const labelCount = new Map<string, number>();
      for (const { label } of items) labelCount.set(label, (labelCount.get(label) ?? 0) + 1);
      const deduped = items.map(({ s, label }) => {
        if ((labelCount.get(label) ?? 0) > 1) {
          const ps = pathSuffix(s.url);
          return { s, label: ps ? `${label}（${ps}）` : label };
        }
        return { s, label };
      });

      for (const { s, label } of deduped) {
        const before = urlToLabel(s.url);
        const after  = label;
        totalCount++;
        const changed = before !== after;
        if (changed) changedCount++;
        const marker = changed ? "✨" : "  ";
        console.log(`  ${marker} BEFORE: [${before}](${s.url.slice(0, 60)})`);
        if (changed) {
          console.log(`     AFTER:  [${after}]`);
        }
      }
      console.log();
    }
  }

  console.log(`\n=== サマリー ===`);
  console.log(`総ラベル数: ${totalCount}`);
  console.log(`変更あり: ${changedCount} (${totalCount ? ((changedCount/totalCount*100).toFixed(1)) : 0}%)`);
  console.log(`変更なし: ${totalCount - changedCount}`);

  if (changedCount === 0 && totalCount > 0) {
    console.log("\n⚠️  全ラベルが before と同じです。fetch-page-titles.ts と translate-page-titles.ts を先に実行してください。");
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });

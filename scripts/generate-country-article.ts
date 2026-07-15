import { existsSync, readFileSync, writeFileSync } from "fs";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { sanitizeMoveWorthLinks } from "./utils/sanitize-links";
import { assertBlogPayload } from "./utils/validate-blog-payload";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    const val = t.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- Task 4: source-grounded generation ---

const SOURCE_FETCH_TIMEOUT = 8_000;
const MAX_CHARS_PER_SOURCE = 3_000;     // visa / study ソース（ビザ手続き情報）
const TAX_MAX_CHARS_PER_SOURCE = 40_000; // tax ソース専用（税率表全体を取得するため大きく設定）
const MAX_SOURCES = 5;

/** 切り詰めが発生した場合にログを出力してスライスする（観測可能性確保） */
function sliceWithLog(text: string, url: string, maxChars: number): string {
  if (text.length > maxChars) {
    console.log(`  [truncated] ${url}: ${text.length.toLocaleString()} → ${maxChars.toLocaleString()} chars`);
    return text.slice(0, maxChars);
  }
  return text;
}

function stripHtml(html: string): string {
  // <main> または <article> タグが存在する場合、その内容を優先的に使用する。
  // ナビゲーション・ヘッダー・フッターを自動的に除外し、偽陽性判定を減らす。
  // タグが存在しない場合（HaSiLなど）はHTML全体を使用する（後退安全）。
  const mainMatch = html.match(/<main[\s\S]*?>([\s\S]*?)<\/main>/i);
  const articleMatch = html.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/i);
  const content = mainMatch?.[1] ?? articleMatch?.[1] ?? html;

  return content
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

// SPA・ナビゲーション羅列のような低品質コンテンツを判定する。
// 金額/割合/期間/ポイント数などの具体的情報が 2 種類以上含まれていれば有用とみなす。
function isSourceUseful(text: string): boolean {
  if (!text || text.length < 300) return false;
  let hits = 0;
  if (/(?:NZD|EUR|USD|GBP|AUD|CAD|SGD|CHF|PLN|TND|SEK|NOK)\s?\$?[\d,]+|[\d,]+\s*(?:EUR|PLN|euros?)|[$€£]\s?[\d,]+/i.test(text)) hits++;
  if (/\d+\.?\d*\s*%/.test(text)) hits++;
  if (/\d+\s*(days?|weeks?|months?|years?|hours?)/i.test(text)) hits++;
  if (/\d+\s*points?/i.test(text)) hits++;
  if (/(require|eligib|qualif|must have|criteria|condition|permit|residence|visa|employ|work permit|foreign staff|national|labor|labour)[\s\S]{0,100}\d/i.test(text)) hits++;
  return hits >= 2;
}

// 税制ソース専用の有用性判定。
// 判定対象テキストは fetchPageText が返す切り詰め済みテキストと同一（GPTへの入力と一致）。
// 「切り詰め後のテキストに実際に複数の税率が含まれているか」を確認するため、
// isSourceUseful のような汎用パターンではなく、2 種類以上の異なる % 値の存在を必須とする。
// これにより「ナビゲーション内の 1 つの % でヒットしてUSEFUL判定、しかし税率表はカット済み」
// という乖離を防ぐ。isSourceUseful にはフォールバックしない。
// ATO 等のセント表記（"16c for each $1"）も税率として扱う（% 表記と等価）。
function isTaxSourceUseful(text: string): boolean {
  if (!text || text.length < 300) return false;
  // 個人所得税なし宣言（UAE等）: 政府ページが「所得税なし」を明示 → 有用
  if (/does not levy income tax|no personal income tax|there is no.*income tax|income tax.*is not.*levied/i.test(text)) return true;
  const pcts = [
    // 通常表記（20%）および欧州式小数点表記（12,50% → 正規化して 12.50 として扱う）
    ...text.matchAll(/(\d+[.,]?\d*)\s*%/g),
    ...text.matchAll(/(\d+\.?\d*)c for each \$1/g),     // ATO セント表記対応
    ...text.matchAll(/(\d+[.,]?\d*)\s*procent\b/gi),    // スウェーデン語等 "procent" 表記
    ...text.matchAll(/(\d+[.,]?\d*)\s*prosent\b/gi),    // ノルウェー語 "prosent" 表記
  ].map(m => m[1].replace(",", "."));                   // カンマ小数点を正規化
  const unique = new Set(pcts);
  return unique.size >= 2;
}

// SPA 判定時のフォールバック: Wayback Machine から静的スナップショットを取得
async function tryWaybackMachine(originalUrl: string, maxChars: number = MAX_CHARS_PER_SOURCE): Promise<string | null> {
  try {
    const apiController = new AbortController();
    const apiTimer = setTimeout(() => apiController.abort(), 6_000);
    const apiRes = await fetch(
      `https://archive.org/wayback/available?url=${encodeURIComponent(originalUrl)}`,
      { signal: apiController.signal }
    );
    clearTimeout(apiTimer);
    if (!apiRes.ok) return null;
    type WaybackResp = { archived_snapshots?: { closest?: { url?: string; available?: boolean } } };
    const data = await apiRes.json() as WaybackResp;
    const snapshot = data.archived_snapshots?.closest;
    if (!snapshot?.available || !snapshot.url) return null;

    // スナップショット日付をURLから抽出してログ出力 (形式: /web/20241231120000/...)
    const dateMatch = snapshot.url.match(/\/web\/(\d{4})(\d{2})(\d{2})/);
    if (dateMatch) {
      console.log(`  [wayback] snapshot date: ${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]} (${snapshot.url})`);
    } else {
      console.log(`  [wayback] snapshot URL: ${snapshot.url}`);
    }

    const wbController = new AbortController();
    const wbTimer = setTimeout(() => wbController.abort(), SOURCE_FETCH_TIMEOUT);
    try {
      const wbRes = await fetch(snapshot.url, {
        signal: wbController.signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; MoveWorthBot/1.0)" },
      });
      clearTimeout(wbTimer);
      if (!wbRes.ok) return null;
      const html = await wbRes.text();
      return sliceWithLog(stripHtml(html), originalUrl + " [wayback]", maxChars);
    } catch {
      clearTimeout(wbTimer);
      return null;
    }
  } catch {
    return null;
  }
}

async function fetchPageText(url: string, maxChars: number = MAX_CHARS_PER_SOURCE): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SOURCE_FETCH_TIMEOUT);
  let text: string | null = null;
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MoveWorthBot/1.0)" },
    });
    clearTimeout(timer);
    if (res.ok) {
      const ct = res.headers.get("content-type") ?? "";
      if (ct.includes("html") || ct.includes("text")) {
        text = sliceWithLog(stripHtml(await res.text()), url, maxChars);
      }
    }
  } catch {
    clearTimeout(timer);
  }

  // SPA やナビゲーション羅列を検出した場合は Wayback Machine へフォールバック
  if (!isSourceUseful(text ?? "")) {
    console.log(`  [source] SPA/low-quality detected — trying Wayback Machine for ${url}`);
    const wb = await tryWaybackMachine(url, maxChars);
    if (wb && isSourceUseful(wb)) {
      console.log(`  [source] Wayback Machine snapshot used for ${url}`);
      return wb;
    }
    // Wayback も取得できなければ元のテキストをそのまま返す（null も含む）
  }
  return text;
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

// ドメイン名から日本語の機関名ラベルを生成する（country_sources に label カラムが追加された際はそちらを優先）
const DOMAIN_LABEL_MAP: Record<string, string> = {
  // AU
  "immi.homeaffairs.gov.au": "オーストラリア内務省移民局",
  "ato.gov.au": "オーストラリア税務局（ATO）",
  // BE
  "dofi.ibz.be": "ベルギー外国人局（DVZ/OE）",
  "belgium.be": "ベルギー政府公式サイト",
  "economischmigrant.be": "ベルギー経済移民情報",
  "diplomatice.belgium.be": "在日ベルギー大使館",
  "japan.diplomatie.belgium.be": "在日ベルギー大使館",
  "employment.belgium.be": "ベルギー雇用・労働省",
  "fin.belgium.be": "ベルギー財務省",
  // EE
  "politsei.ee": "エストニア警察・国境警備局",
  "workinestonia.com": "Work in Estonia",
  "smartsettlers.ee": "Smart Settlers Estonia",
  "emta.ee": "エストニア税務・関税庁（EMTA）",
  // GB
  "gov.uk": "英国政府（GOV.UK）",
  "britishcouncil.org": "ブリティッシュ・カウンシル",
  "visitbritain.com": "VisitBritain",
  "universitiesuk.ac.uk": "Universities UK",
  // TH
  "ltr.boi.go.th": "タイ投資委員会（BOI）LTR",
  "ewp.doe.go.th": "タイ雇用局（DOE）就労許可",
  "thaievisa.go.th": "タイ外務省 e-Visa",
  "www.thailandprivilege.co.th": "Thailand Privilege",
  "thailandprivilege.co.th": "Thailand Privilege",
  "rd.go.th": "タイ歳入局（Revenue Department）",
  // SG
  "mom.gov.sg": "シンガポール労働省（MOM）",
  "edb.gov.sg": "シンガポール経済開発庁（EDB）",
  "ica.gov.sg": "シンガポール移民局（ICA）",
  "iras.gov.sg": "シンガポール内国歳入庁（IRAS）",
  // US
  "uscis.gov": "米国移民局（USCIS）",
  "my.uscis.gov": "米国移民局（USCIS）myUSCIS",
  "irs.gov": "米国内国歳入庁（IRS）",
  "dhs.gov": "米国国土安全保障省（DHS）",
  "ed.gov": "米国教育省（ED）",
  "jp.usembassy.gov": "在日米国大使館",
  // MY
  "mm2h.gov.my": "マレーシア観光省 MM2H",
  "esd.imi.gov.my": "マレーシア移民局（IMI）ESD",
  "mdec.my": "マレーシアデジタル経済公社（MDEC）",
  "imigresen-online.imi.gov.my": "マレーシア移民局（IMI）オンライン",
  "imi.gov.my": "マレーシア移民局（IMI）",
  "talentcorp.com.my": "TalentCorp Malaysia",
  "hasil.gov.my": "マレーシア内国歳入庁（HASiL）",
  // PL
  "gov.pl": "ポーランド政府（GOV.PL）",
  "udsc.gov.pl": "ポーランド外国人局（UDSC）",
  "paih.gov.pl": "ポーランド投資・貿易庁（PAIH）",
  "welcomepoland.pl": "Welcome to Poland",
  "podatki.gov.pl": "ポーランド税務局",
  // Batch 2
  "belastingdienst.nl": "オランダ税務・関税局（Belastingdienst）",
  "impots.gouv.fr": "フランス財務省税務局（DGFiP）",
  "agenziaentrate.gov.it": "イタリア歳入庁（Agenzia delle Entrate）",
  "sede.agenciatributaria.gob.es": "スペイン国税庁（AEAT）",
  "agenciatributaria.gob.es": "スペイン国税庁（AEAT）",
  "info.portaldasfinancas.gov.pt": "ポルトガル税務・関税局（AT）",
  "estv.admin.ch": "スイス連邦税務局（ESTV）",
  "bmf.gv.at": "オーストリア財務省（BMF）",
  "revenue.ie": "アイルランド歳入庁（Revenue）",
  // canada.ca は purpose 別に urlToLabel() で分岐（下記）

  "ird.govt.nz": "ニュージーランド内国歳入局（IRD）",
  "in.nts.go.kr": "韓国国税庁（NTS）",
  "nts.go.kr": "韓国国税庁（NTS）",
  // Batch 3
  "skatteverket.se": "スウェーデン税務庁（Skatteverket）",
  "skatteetaten.no": "ノルウェー税務局（Skatteetaten）",
  "skat.dk": "デンマーク税務庁（Skattestyrelsen）",
  "portal.gov.cz": "チェコ政府ポータル（portal.gov.cz）",
  "porezna-uprava.gov.hr": "クロアチア税務局（Porezna uprava）",
  "aade.gr": "ギリシャ独立歳入庁（AADE）",
  "mtca.gov.mt": "マルタ税関歳入庁（MTCA）",
  "u.ae": "UAE政府公式ポータル（u.ae）",
  // Batch 4
  "lsth.bundesfinanzministerium.de": "ドイツ連邦財務省 所得税計算補助（Lohnsteuerhilfeverein）",
  "bundesfinanzministerium.de": "ドイツ連邦財務省（BMF）",
  "bamf.de": "ドイツ連邦移民・難民庁（BAMF）",
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
  "chinatax.gov.cn": "中国国家税務総局",
  "micrositios.dian.gov.co": "コロンビア国税庁（DIAN）",
  "pajak.go.id": "インドネシア税務総局（DJP）",
  "tuyenquang.gdt.gov.vn": "ベトナム税務総局（GDT）地方ポータル",
  "gdt.gov.vn": "ベトナム税務総局（GDT）",
};

function urlToLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");
    const path = parsed.pathname;

    // canada.ca: path で IRCC（移民）/ CRA（税務）を分岐
    if (hostname === "canada.ca") {
      if (/\/revenue-agency|\/cra\b/i.test(path)) return "カナダ歳入庁（CRA）";
      if (/\/immigration|\/refugees|\/ircc/i.test(path)) return "カナダ移民・難民・市民権省（IRCC）";
      return "カナダ政府（canada.ca）";
    }

    return DOMAIN_LABEL_MAP[hostname] ?? DOMAIN_LABEL_MAP[`www.${hostname}`] ?? hostname;
  } catch {
    return url;
  }
}

// 言語コード → 記事言語別の原語タグ文字列
const LANG_TAG: Record<string, Record<string, string>> = {
  ko: { ja: "韓国語", en: "Korean",  zh: "韩语" },
  de: { ja: "ドイツ語", en: "German", zh: "德语" },
  fr: { ja: "フランス語", en: "French", zh: "法语" },
  nl: { ja: "オランダ語", en: "Dutch",  zh: "荷兰语" },
  pl: { ja: "ポーランド語", en: "Polish", zh: "波兰语" },
  cs: { ja: "チェコ語", en: "Czech",  zh: "捷克语" },
  sv: { ja: "スウェーデン語", en: "Swedish", zh: "瑞典语" },
  da: { ja: "デンマーク語", en: "Danish", zh: "丹麦语" },
  no: { ja: "ノルウェー語", en: "Norwegian", zh: "挪威语" },
  fi: { ja: "フィンランド語", en: "Finnish", zh: "芬兰语" },
  pt: { ja: "ポルトガル語", en: "Portuguese", zh: "葡萄牙语" },
  es: { ja: "スペイン語", en: "Spanish", zh: "西班牙语" },
  it: { ja: "イタリア語", en: "Italian", zh: "意大利语" },
  el: { ja: "ギリシャ語", en: "Greek", zh: "希腊语" },
  hr: { ja: "クロアチア語", en: "Croatian", zh: "克罗地亚语" },
  hu: { ja: "ハンガリー語", en: "Hungarian", zh: "匈牙利语" },
  ro: { ja: "ルーマニア語", en: "Romanian", zh: "罗马尼亚语" },
  et: { ja: "エストニア語", en: "Estonian", zh: "爱沙尼亚语" },
  zh: { ja: "中国語", en: "Chinese", zh: "中文" },
  ja: { ja: "日本語", en: "Japanese", zh: "日语" },
  th: { ja: "タイ語", en: "Thai", zh: "泰语" },
  ar: { ja: "アラビア語", en: "Arabic", zh: "阿拉伯语" },
  vi: { ja: "ベトナム語", en: "Vietnamese", zh: "越南语" },
  id: { ja: "インドネシア語", en: "Indonesian", zh: "印尼语" },
  ms: { ja: "マレー語", en: "Malay", zh: "马来语" },
  hi: { ja: "ヒンディー語", en: "Hindi", zh: "印地语" },
  ka: { ja: "ジョージア語", en: "Georgian", zh: "格鲁吉亚语" },
  fil: { ja: "フィリピン語", en: "Filipino", zh: "菲律宾语" },
};

// 記事言語コード（ja/en/zh）とソースの page_lang を比較し、原語タグを返す
function langTag(sourceLang: string | null | undefined, articleLocale: string): string {
  if (!sourceLang) return "";
  const sl = sourceLang.toLowerCase().slice(0, 3);
  // 記事言語と同じなら省略
  const ARTICLE_LANG: Record<string, string> = { ja: "ja", en: "en", zh: "zh" };
  if (sl === ARTICLE_LANG[articleLocale]) return "";
  if (sl === "en") return ""; // 英語ソースはタグ省略（最多なので）
  const tag = LANG_TAG[sl];
  if (!tag) return "";
  return articleLocale === "ja" ? `（${tag.ja}）`
    : articleLocale === "zh" ? `（${tag.zh}）`
    : ` (${tag.en})`;
}

/**
 * ソース行と記事言語からリンクラベルを組み立てる。
 * 形式: 「機関名 - 翻訳済み題名（原語タグ）」
 * フォールバック: 翻訳済み題名 → 原題 → 機関名のみ → パスサフィックス
 */
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

async function getCountrySources(
  countryCode: string,
  purpose: "visa" | "study" | "tax"
): Promise<SourceRow[]> {
  try {
    // page_title 列は SQL マイグレーション後に追加予定（dry-run 承認待ち）
    // 現時点は url, purpose のみ SELECT（列未存在でクエリが 400 になるため）
    const { data, error } = await supabase
      .from("country_sources")
      .select("url, purpose")
      .eq("country_code", countryCode)
      .eq("purpose", purpose)
      .eq("status", "alive")
      .limit(MAX_SOURCES);
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

interface SourceContext {
  text: string;
  refs: string;
  isGrounded: boolean; // true = 有用なコンテンツが 1 件以上取得できた
}

async function buildSourceContext(
  sources: SourceRow[],
  usefulCheck: (text: string) => boolean = isSourceUseful,
  maxChars: number = MAX_CHARS_PER_SOURCE
): Promise<SourceContext> {
  const fetched: { url: string; text: string }[] = [];
  await Promise.all(
    sources.map(async (s) => {
      const text = await fetchPageText(s.url, maxChars);
      // usefulCheck を通過したものだけを文脈に使用
      // 判定対象テキスト = GPT に渡すテキスト（fetchPageText の戻り値 = 切り詰め済み）と同一
      if (text && usefulCheck(text)) fetched.push({ url: s.url, text });
    })
  );

  const refs = sources.map((s) => `- [${urlToLabel(s.url)}](${s.url})`).join("\n");

  if (fetched.length === 0) return { text: "", refs, isGrounded: false };

  const text = fetched
    .map((f, i) => `--- 参考資料 ${i + 1}: ${f.url} ---\n${f.text}`)
    .join("\n\n");

  return { text, refs, isGrounded: true };
}

import { MASTER_COUNTRIES } from "../src/data/master-countries";

// マスター国リスト（PRESET基準・50カ国）。src/data/master-countries.ts を唯一の真実の源とする。
const COUNTRY_QUEUE = [...MASTER_COUNTRIES];

type Lang = "ja" | "en" | "zh";

// CLI 引数:
//   npx tsx generate-country-article.ts [country_code]
//     → 生成して draft 保存（is_published=false）。既存公開記事は上書きしない。
//   npx tsx generate-country-article.ts [country_code] --publish-only
//     → 再生成なし。visa + 対応する study-{code} / study-country-{code} の is_published を true に切り替えるだけ。
//   npx tsx generate-country-article.ts [country_code] --force-regenerate
//     → 公開中記事も再生成する。成功時のみコンテンツ更新（is_published/published_at を保持）。
//     → FALLBACK（ソースなし）時は既存公開コンテンツを保護して保存をスキップ。
//   ※ --publish（再生成して公開）は廃止。レビューした内容と公開内容の同一性を保証するため。
const _args = process.argv.slice(2);
const forceCountryCode = _args.find((a) => !a.startsWith("--")) ?? null;
const publishOnly = _args.includes("--publish-only");
const forceRegen = _args.includes("--force-regenerate");

if (_args.includes("--publish")) {
  console.error("❌ --publish は廃止されました。");
  console.error("   生成: npx tsx generate-country-article.ts [code]");
  console.error("   公開: npx tsx generate-country-article.ts [code] --publish-only");
  process.exit(1);
}

async function getNextCountry(): Promise<{ code: string; name: { ja: string; en: string } }> {
  if (forceCountryCode) {
    const found = COUNTRY_QUEUE.find((c) => c.code === forceCountryCode);
    if (!found) throw new Error(`Country code "${forceCountryCode}" not found in queue.`);
    return found;
  }

  const { data: visaPosts } = await supabase
    .from("blog_posts")
    .select("slug")
    .like("slug", "visa-%");

  const covered = new Set(
    (visaPosts ?? []).map((p: { slug: string }) => p.slug.replace("visa-", ""))
  );

  for (const c of COUNTRY_QUEUE) {
    if (!covered.has(c.code)) return c;
  }
  throw new Error("All countries in queue already covered.");
}

// 国別 税制ソース使用時の追加制約（TH: 古い移行注記の無視等）
const COUNTRY_TAX_EXTRA_CONSTRAINTS: Partial<Record<string, Record<Lang, string>>> = {
  th: {
    ja: "【TH税制制約】税制情報ページには2013-14年実施の旧注記が本文に残っているが、現行の税率表（パーセンテージと所得区分の表）の数値のみを使用すること。旧制度の注記はソース根拠としては使わないこと。また、LTRビザ保有者・BOI優遇対象者向けの17%フラット税率はこの税制ソースには記載されていないため、絶対に記述しないこと。標準の累進税率のみをソース根拠として使用すること。",
    en: "【TH tax constraint】The source page contains historical notes from 2013-14 transition. Use ONLY the current progressive tax rate table (percentages and income brackets) from the source. Ignore transitional/historical notes. Do NOT mention the 17% flat tax rate for LTR visa holders or BOI-promoted companies — that rate is NOT in this source and must not be included.",
    zh: "【TH税制约束】税制信息页面中包含2013-14年旧制度的历史注记。仅使用当前有效的累进税率表（百分比和收入级距），忽略历史过渡说明。严禁提及LTR签证持有者或BOI优惠对象适用的17%固定税率——该税率不在本税制来源中，不得写入文章。",
  },
  au: {
    ja: "【AU税制制約】ATOのページには複数年度の税率（2020年〜現在）が掲載されている。必ず最新年度「Resident tax rates 2025–26」の税率のみを使用すること。2023-24以前の旧年度（19%・32.5%等）は絶対に使用しないこと。",
    en: "【AU tax constraint】The ATO page lists tax rates for multiple years (2020 to present). Use ONLY the rates from 'Resident tax rates 2025–26'. Do NOT use rates from any earlier year (2023-24 or before, which show 19%, 32.5% etc.).",
    zh: "【AU税制约束】ATO页面列出了多个年度（2020年至今）的税率。仅使用「2025–26财年居民税率」的数据。严禁使用任何早期年度（2023-24年度及以前，如19%、32.5%等）的税率。",
  },
  nl: {
    ja: "【NL税制制約】オランダのBox 1税率（ソースに記載の36.97%・49.50%等）は、所得税と国民保険料（AOW・ANW・Wlz等の sociale premies）が合算された税率である。記事中に必ず「この税率には国民保険料が含まれる」旨を明記すること。税率の適用年度（例：2025年所得）も明記すること。Box 2（配当）・Box 3（貯蓄・投資）の税率はソースにあれば簡潔に触れてよい。",
    en: "【NL tax constraint】The Dutch Box 1 tax rates shown in the source (e.g. 36.97%, 49.50%) are combined rates that include income tax AND national insurance premiums (sociale premies: AOW, ANW, Wlz etc.). The article MUST explicitly state that these rates include national insurance premiums. Also state the applicable tax year (e.g. 2025 income). Box 2 (dividends) and Box 3 (savings/investments) rates may be briefly mentioned if in the source.",
    zh: "【NL税制约束】来源中显示的荷兰Box 1税率（如36.97%、49.50%）是所得税与国民保险保费（sociale premies：AOW、ANW、Wlz等）合并后的税率。文章中必须明确注明「该税率包含国民保险保费」。同时须注明适用年度（如2025年所得）。如来源中有Box 2（股息）和Box 3（储蓄/投资）的税率，可简要提及。",
  },
  ca: {
    ja: "【CA税制制約】カナダの所得税は連邦税と州・準州税の二層構造である。ソースには連邦税率（15%・20.5%・26%・29%・33%の5段階）と州別税率が含まれる場合があるが、記事では連邦税率の5段階のみを表形式で記載し、「州・準州税が別途加算されるため実効税率は異なる」旨の注記を必ず添えること。州別税率を全件列挙しないこと。適用年度（例：2026年所得）を明記すること。",
    en: "【CA tax constraint】Canada uses a two-tier system of federal + provincial/territorial taxes. The source may contain both federal rates (5 brackets: 15%, 20.5%, 26%, 29%, 33%) and provincial rates. In the article, show ONLY the federal 5-bracket table and add a mandatory note that 'provincial/territorial taxes are added on top, so the effective rate varies by province'. Do NOT list all provincial rates. State the applicable tax year (e.g. 2026 income).",
    zh: "【CA税制约束】加拿大采用联邦税+省/地区税的双层结构。来源中可能包含联邦税率（5级：15%、20.5%、26%、29%、33%）和各省税率。文章中仅展示联邦税率5级表格，并必须附注「省/地区税另行叠加，实际税率因省份而异」。不得逐一列举所有省份税率。须注明适用年度（如2026年所得）。",
  },
  it: {
    ja: "【IT税制制約】イタリアのIRPEF税率は2025年予算法（Legge n.207/2024）により第2税率が35%から33%に引き下げられた（2025年所得・2026年申告から適用）。ソースページには「ATTENZIONE: la legge ... a seconda aliquota dell'Irpef dal 35 al 33 per cento」という注記がある。この注記は法改正を確認するものであり、メイン表に35%と表示されていても、2025年度以降の適用税率は33%である。記事では2025年所得に適用される税率として23%・33%・43%の3段階を記載し、「2025年度予算法により第2税率は35%から33%に引き下げ（2025年所得・2026年申告から適用）」と明記すること。",
    en: "【IT tax constraint】Italy's 2025 Budget Law (Legge n.207/2024) reduced the IRPEF second bracket rate from 35% to 33%, effective for income year 2025 (filed in 2026). The source page contains an ATTENZIONE note stating the law changed the second bracket 'dal 35 al 33 per cento'. Even if the main table still shows 35%, the legally applicable rate for 2025 income is 33%. Show the 2025 rates as three brackets: 23%, 33%, 43%, and explicitly note 'Under the 2025 Budget Law, the second bracket was reduced from 35% to 33% (applicable from income year 2025, filed in 2026)'.",
    zh: "【IT税制约束】意大利2025年预算法（Legge n.207/2024）将IRPEF第二档税率从35%下调至33%，自2025年所得（2026年申报）起适用。来源页面的ATTENZIONE注记确认该法律更改了第二档税率「dal 35 al 33 per cento」。即使主表仍显示35%，2025年所得的法定税率为33%。文章应按三档（23%、33%、43%）列示2025年税率，并注明「2025年预算法将第二档税率从35%下调至33%（自2025年所得、2026年申报起适用）」。",
  },
  fr: {
    ja: "【FR税制制約】フランスの所得税は前年所得（N-1年）に対して課税される構造である。ソースに5段階税率（0%・11%・30%・41%・45%）が記載されていれば、それをソース根拠として使用すること。「前年所得への課税」の仕組みはソースに記載があれば簡潔に触れてよい。適用年度（例：2024年所得・2025年課税等）を明記すること。",
    en: "【FR tax constraint】France taxes income on a prior-year basis (income of year N-1 is taxed in year N). If the source lists 5 tax brackets (0%, 11%, 30%, 41%, 45%), use those figures as-is. The prior-year taxation structure may be briefly mentioned if it appears in the source. State the applicable income year (e.g. 2024 income, taxed in 2025).",
    zh: "【FR税制约束】法国所得税按上一年度所得（N-1年）计征。若来源列出5级税率（0%、11%、30%、41%、45%），则直接引用该数据。如来源中提及上年度征税机制，可简要说明。须注明适用所得年度（如2024年所得，2025年征税）。",
  },
  se: {
    ja: "【SE税制制約】スウェーデンの所得税は「自治体所得税（kommunal inkomstskatt）」と「国税（statlig inkomstskatt）」の二層構造である。ソースに記載の2026年自治体税平均は約32.38%（自治体により異なる）。課税所得643,000 SEK超の部分には国税20%が別途加算される。「自治体税のみ」または「国税のみ」の記載は不可。必ず両層の構造を説明し、合計税率の概算を記載すること。適用年度（例：2026年所得）を明記すること。ソース原文はスウェーデン語で「X procent」表記を使用しているが、記事では「X%」に変換して記載すること。",
    en: "【SE tax constraint】Sweden uses a two-tier income tax system: municipal tax (kommunal inkomstskatt, approximately 32.38% average in 2026, varies by municipality) plus national tax (statlig inkomstskatt, 20% on income above approximately SEK 643,000). Never describe only one tier in isolation. Always explain both tiers and provide approximate combined rates. State the applicable tax year (e.g. 2026 income). The source uses Swedish 'procent' notation — convert to '%' in the article.",
    zh: "【SE税制约束】瑞典采用「市政所得税（kommunal inkomstskatt，2026年平均约32.38%，因市而异）」加「国家所得税（statlig inkomstskatt，应税所得超643,000 SEK的部分加征20%）」的双层结构。不得仅描述其中一层。须同时说明两层结构并给出综合税率概算。须注明适用年度（如2026年所得）。来源使用瑞典语'procent'，文章中统一换算为'%'。",
  },
  no: {
    ja: "【NO税制制約】ノルウェーの所得税は「一般所得税（alminnelig inntektsskatt、22%）」と「ブラケット税（trinnskatt）」の加算構造である。ソースに記載のブラケット税は所得水準に応じて段階的に加算され（例：1.7%・4.0%・13.7%・16.8%・17.8%等）、一般所得税22%との合算で実効税率が決まる。ブラケット税単独を所得税率として記述することは不可。「一般所得税22%にブラケット税が加算される」という構造を必ず明記し、適用年度を記載すること。",
    en: "【NO tax constraint】Norway uses an additive income tax system: general income tax (alminnelig inntektsskatt, 22%) plus bracket tax (trinnskatt, progressive surcharge with rates such as 1.7%, 4.0%, 13.7%, 16.8%, 17.8% etc. depending on income). Do NOT present bracket tax rates in isolation as if they were the complete income tax rate. Always explain the additive structure (22% + bracket tax), and state the applicable tax year.",
    zh: "【NO税制约束】挪威所得税采用「一般所得税（22%）」加「累进附加税（trinnskatt，按所得水平分阶：1.7%、4.0%、13.7%、16.8%、17.8%等）」的叠加结构。不得单独以累进附加税税率代表所得税率。须明确说明两者叠加关系（22%+累进附加税），并注明适用年度。",
  },
  dk: {
    ja: "【DK税制制約】デンマークの所得税は国税ブラケット（基礎税率12.01%・中間税率7.5%・上位税率7.5%・追加上位税率5%等、ソース記載の数値を使用）と、自治体ごとに異なる地方税の合算で構成される。「地方税が別途加算されるため実効税率は自治体ごとに異なる」旨を必ず明記すること。適用年度（例：2026年所得）を明記すること。",
    en: "【DK tax constraint】Denmark's income tax comprises national tax brackets (e.g. bottom bracket 12.01%, middle 7.5%, top 7.5%, additional top 5% — use the figures in the source) plus local municipal tax which varies by municipality. Always note that 'local tax is added on top, so the effective rate varies by municipality'. State the applicable tax year.",
    zh: "【DK税制约束】丹麦所得税由国家税率阶梯（如基础12.01%、中间7.5%、上位7.5%、附加上位5%——使用来源中的数值）加上因市而异的地方税构成。须注明「地方税另行叠加，实际税率因市而异」。须注明适用年度。",
  },
  hr: {
    ja: "【HR税制制約】クロアチアの所得税率は自治体（市・郡）が設定する。ソースに記載の低税率帯（15〜23%）と高税率帯（25〜33%）の範囲で各自治体が独自に設定し、未設定の自治体には標準税率20%（低所得）および30%（高所得）が適用される。「税率は自治体ごとに異なり、未設定の場合は標準税率20%/30%が適用される」旨を必ず明記すること。適用年度を明記すること。",
    en: "【HR tax constraint】Croatia's income tax rates are set by individual municipalities. Lower bracket rates range from 15–23% and higher bracket rates from 25–33% (use the figures in the source). Municipalities that have not set their own rates default to the standard rates of 20% (lower) and 30% (higher). Always note: 'rates vary by municipality; the default standard rates are 20%/30%'. State the applicable tax year.",
    zh: "【HR税制约束】克罗地亚所得税率由各市政当局自行设定。低税档范围15%~23%，高税档范围25%~33%（使用来源数值）。未自行设定税率的市政当局适用标准税率20%（低税档）/30%（高税档）。须注明「税率因市政当局而异，未设定者适用标准税率20%/30%」。须注明适用年度。",
  },
  ae: {
    ja: "【AE税制制約】UAEは個人所得税を課していない。ソース（UAE政府公式ポータルu.ae）に「The UAE does not levy income tax on individuals」と明記されている。この事実をソース根拠として「個人所得税なし」を簡潔・明確に記載すること。VAT（5%）は消費税であり所得税とは性質が異なる旨を補足してよい。税率表の記載は不要。",
    en: "【AE tax constraint】The UAE does not levy income tax on individuals, as explicitly stated on the UAE government official portal (u.ae). Present this as a source-grounded fact. You may briefly note that VAT of 5% applies to goods and services (it is a consumption tax, not income tax). No income tax bracket table is needed.",
    zh: "【AE税制约束】阿联酋不对个人征收所得税，这一事实已在UAE政府官方门户网站（u.ae）明确载明。请以来源为根据，简洁明确地写明「无个人所得税」。可简要补充增值税（VAT，5%）是消费税而非所得税。无需列示税率表。",
  },
  cz: {
    ja: "【CZ税制制約】チェコの個人所得税はソースに記載の税率（例：15%・23%等）を根拠として使用すること。ソースに記載の控除・免除の仕組みについても触れてよい。適用年度を明記すること。",
    en: "【CZ tax constraint】Use the income tax rates stated in the source (e.g. 15%, 23%). You may also mention deductions or exemptions described in the source. State the applicable tax year.",
    zh: "【CZ税制约束】使用来源中列明的个人所得税率（如15%、23%等）。可提及来源中描述的扣除和豁免机制。须注明适用年度。",
  },
  gr: {
    ja: "【GR税制制約】ギリシャの所得税率はソースに記載の税率表（5段階：9%・22%・28%・36%・44%等）を根拠として使用すること。非居住者向けの特別税率や優遇税制がソースにあれば言及してよい。適用年度を明記すること。",
    en: "【GR tax constraint】Use the income tax rate schedule stated in the source (e.g. 5 brackets: 9%, 22%, 28%, 36%, 44%). Non-resident special rates or incentive regimes may be mentioned if in the source. State the applicable tax year.",
    zh: "【GR税制约束】使用来源中列明的个人所得税率表（如5档：9%、22%、28%、36%、44%）。如来源中有非居民特别税率或优惠税制，可予提及。须注明适用年度。",
  },
  mt: {
    ja: "【MT税制制約】マルタの個人所得税は3〜4段階の累進税率（ソースに記載の0%・15%・25%・35%等）で構成される。独身者・既婚者・父母世帯で適用税率表が異なる場合はその旨を記載。ソースに記載のある税率のみを使用し、適用年度を明記すること。",
    en: "【MT tax constraint】Malta's personal income tax uses 3–4 progressive brackets (e.g. 0%, 15%, 25%, 35% from the source). Different rate schedules apply to single persons, married couples, and parent computation — note this if in the source. Use only figures stated in the source. State the applicable tax year.",
    zh: "【MT税制约束】马耳他个人所得税采用3~4档累进税率（来源中列明的0%、15%、25%、35%等）。单身、已婚和有子女纳税人适用不同税率表——如来源有载明，请予注明。仅使用来源中的数值，并注明适用年度。",
  },
  // バッチ4
  de: {
    ja: "【DE税制制約（知識ベース）】ドイツの所得税（Einkommensteuer）は§32a EStGに基づく計算式による累進課税。税制ソースは計算ツールのため税率値が取得できなかったため知識ベースで補完。2026年適用の主要閾値（暫定）：Grundfreibetrag（基礎控除額）€12,348以下は0%、€12,349〜€69,878は計算式による14%→42%の逓増帯（一次・二次進行帯）、€69,879〜€277,825は42%、€277,826超は45%（Reichsteuer）。2021年以降、大多数の納税者にはSolidaritätszuschlag（連帯付加税5.5%）は課されない。教会税（Kirchensteuer、州により8〜9%）は任意。「2026年暫定値・詳細はBMF（bundesfinanzministerium.de）で確認のこと」と必ず明記すること。",
    en: "【DE tax constraint (knowledge-based)】Germany's income tax (Einkommensteuer) is based on progressive formulas under §32a EStG. Tax source was a calculator tool with no extractable rate values; use knowledge-based figures. 2026 key thresholds (provisional): Grundfreibetrag (basic allowance) up to €12,348 is 0%; €12,349–€69,878 is a formula-based progression from 14%→42% (first and second progression zones); €69,879–€277,825 is 42%; above €277,826 is 45% (Reichsteuer). The Solidaritätszuschlag (solidarity surcharge, 5.5%) was largely abolished since 2021 for most taxpayers. Church tax (Kirchensteuer, 8–9% of income tax depending on state) is optional. Always note: '2026 provisional figures — verify at bundesfinanzministerium.de'.",
    zh: "【DE税制约束（知识库）】德国所得税（Einkommensteuer）依据§32a EStG采用公式化累进计算。税制来源为计算工具，无法提取税率数值，以知识库数据补充。2026年主要门槛（暂定）：Grundfreibetrag（基础免税额）€12,348以下为0%；€12,349〜€69,878为公式递进14%→42%（一档二档递进区间）；€69,879〜€277,825为42%；€277,826以上为45%（Reichsteuer）。2021年起绝大多数纳税人不再缴纳团结税（Solidaritätszuschlag，5.5%）。教会税（Kirchensteuer，按所得税的8~9%）可自愿选择。须注明「2026年暂定值，详情请参阅bundesfinanzministerium.de」。",
  },
  ge: {
    ja: "【GE税制制約】ジョージアの個人所得税は一律20%のフラット税率（労働・事業所得）。配当・利子所得は別途5%の源泉税が適用。ソース（Tax Code of Georgia）は取得できているが税率数値の自動抽出に失敗したため、この20%フラット税率は知識ベースで補完すること。「バーチャルゾーン（IT企業）の個人所得税免除」「小規模事業者優遇（年間売上500万GEL未満は1%〜3%固定税率）」についても触れてよい。ジョージアは低税率・テリトリアル課税（外国源泉所得は原則非課税）の点が移住者に人気の理由の一つであることを説明すること。「2026年適用」と明記すること。",
    en: "【GE tax constraint】Georgia applies a flat 20% income tax rate on employment and business income. A separate 5% withholding tax applies to dividends and interest. The source (Tax Code of Georgia) was retrieved but rate values could not be automatically extracted; use this 20% flat rate from knowledge. You may also mention: Virtual Zone status (IT company founders exempt from personal income tax on foreign-source income), and small business preferential rates (1%–3% fixed for annual turnover under 500,000 GEL). Note that Georgia's low flat rate and territorial taxation (foreign-source income generally exempt for residents) are major reasons for its popularity with digital nomads. State '2026 applicable rates'.",
    zh: "【GE税制约束】格鲁吉亚对劳动和经营所得征收20%统一税率个人所得税。股息和利息适用5%预提税。来源（格鲁吉亚税法典）已获取，但税率数值自动提取失败，以知识库补充20%统一税率。可提及：虚拟区（IT公司创始人的境外所得可免个人所得税）和小企业优惠（年营业额50万GEL以下适用1%~3%固定税率）。说明格鲁吉亚因低税率和属地征税（居民境外所得通常免税）而受移居者青睐。须注明「2026年适用」。",
  },
  hk: {
    ja: "【HK税制制約】香港の給与税（Salaries Tax）は二択構造：①累進税率（課税所得金額に応じて2%・6%・10%・14%・17%の5段階）②標準税率（Standard Rate、2024/25年度は15%）のいずれか低い方で計算。課税基盤は香港源泉所得のみ（域外所得は原則非課税、テリトリアル課税）。個人基本控除（2024/25：HK$132,000）等の控除後の「課税所得」に累進税率が適用される。ソースに記載の80%という数値は所得税率ではない（別文脈の軽減率等）ため使用しないこと。適用課税年度（2024/25）を明記し、累進税率と標準税率の両構造を説明すること。",
    en: "【HK tax constraint】Hong Kong Salaries Tax uses a two-track system: ① Progressive rates (2%, 6%, 10%, 14%, 17% — 5 brackets based on net chargeable income) or ② Standard Rate (15% for 2024/25), whichever is lower. Only Hong Kong-sourced income is taxable (territorial taxation — foreign-sourced income is generally exempt). Progressive rates apply to net chargeable income after the basic personal allowance (HK$132,000 for 2024/25). The 80% figure in the source is NOT an income tax rate (it relates to a different context, e.g. stamp duty relief); do not use it as a tax rate. State the applicable tax year (2024/25) and explain both tracks.",
    zh: "【HK税制约束】香港薪俸税采用双轨制：①累进税率（按应税所得净额分5档：2%、6%、10%、14%、17%）②标准税率（2024/25年度为15%），就两者中较低者征收。仅香港来源所得需纳税（属地征税，境外所得通常免税）。累进税率适用于扣除基本免税额（2024/25年度为HK$132,000）后的应税净收入。来源中的80%不是所得税率（属其他情境，如印花税减免率），不得使用。须注明适用课税年度（2024/25）并说明双轨制结构。",
  },
  in: {
    ja: "【IN税制制約】インドの個人所得税は「新税制（New Tax Regime）」と「旧税制（Old Tax Regime）」の選択制。ソースに記載の新税制（AY 2026-27・FY 2025-26）の税率表（7段階）：₹4,00,000以下0%・₹4,00,001〜₹8,00,000超部分5%・₹8,00,001〜₹12,00,000超部分10%・₹12,00,001〜₹16,00,000超部分15%・₹16,00,001〜₹20,00,000超部分20%・₹20,00,001〜₹24,00,000超部分25%・₹24,00,000超30%を根拠として記載すること。税額には必ず4%の健康・教育セス（Health & Education Cess）が加算される旨を記載すること。ソースに37%・50%・80%等が含まれる場合は高所得者向けサーチャージ（surcharge）であり、標準ブラケットとは区別して説明すること。「AY 2026-27（FY 2025-26）適用」と明記すること。",
    en: "【IN tax constraint】India's personal income tax has two regimes: New Tax Regime and Old Tax Regime (taxpayer's choice). Use the New Tax Regime 7-bracket schedule from the source (AY 2026-27 / FY 2025-26): ₹0–₹4,00,000: 0%; ₹4,00,001–₹8,00,000: 5% on excess; ₹8,00,001–₹12,00,000: 10% on excess; ₹12,00,001–₹16,00,000: 15% on excess; ₹16,00,001–₹20,00,000: 20% on excess; ₹20,00,001–₹24,00,000: 25% on excess; above ₹24,00,000: 30% on excess (7 brackets). Always state that a 4% Health & Education Cess is added to the tax amount. If the source shows 37% or 50%, these are surcharges (applicable to very high incomes) — distinguish them from the standard 7-bracket table. State 'AY 2026-27 (FY 2025-26) applicable rates'.",
    zh: "【IN税制约束】印度个人所得税分「新税制（New Tax Regime）」和「旧税制（Old Tax Regime）」可选。使用来源中新税制（AY 2026-27/FY 2025-26）的7档税率表：₹400,000以下0%；₹400,001~₹800,000超出部分5%；₹800,001~₹1,200,000超出部分10%；₹1,200,001~₹1,600,000超出部分15%；₹1,600,001~₹2,000,000超出部分20%；₹2,000,001~₹2,400,000超出部分25%；₹2,400,000以上30%（共7档）。须注明税额另加4%健康与教育附加税（Health & Education Cess）。如来源出现37%或50%，为针对高所得的附加税（surcharge），须与标准7档表区别说明。须注明「AY 2026-27（FY 2025-26）适用」。",
  },
  jp: {
    ja: "【JP税制制約】登録済みNTA英語ページ（12006.htm相当）は非居住者向け源泉徴収税率に関するものであり、居住者の総合課税累進税率表ではない。記事の主要読者（移住・在住者）に適用される所得税は以下の累進税率（国税庁・所得税法第89条に基づく知識ベース補完）：195万円以下5%・195万円超〜330万円以下10%・330万円超〜695万円以下20%・695万円超〜900万円以下23%・900万円超〜1,800万円以下33%・1,800万円超〜4,000万円以下40%・4,000万円超45%（7段階）。これに加え復興特別所得税（所得税額の2.1%）が課される。住民税（都道府県民税・市区町村民税の合計、通常約10%）も別途加算される。非居住者の源泉徴収税率（15.315%・20.42%等）はソースに記載があれば簡潔に言及可能だが、居住者向け累進税率を優先して記述すること。「2026年所得」と明記すること。",
    en: "【JP tax constraint】The registered NTA English page (12006.htm) covers withholding tax rates for non-residents — it is NOT the progressive resident income tax table. For residents (the main audience for this article), describe the national income tax progressive rates (based on Income Tax Act Article 89): up to ¥1,950,000: 5%; ¥1,950,001–¥3,300,000: 10%; ¥3,300,001–¥6,950,000: 20%; ¥6,950,001–¥9,000,000: 23%; ¥9,000,001–¥18,000,000: 33%; ¥18,000,001–¥40,000,000: 40%; above ¥40,000,000: 45% (7 brackets). Additionally, the Special Income Tax for Reconstruction (復興特別所得税, 2.1% of income tax liability) applies. Inhabitants tax (住民税: prefectural + municipal, combined approximately 10%) is also separately levied. Non-resident withholding rates (15.315%, 20.42%) may be briefly mentioned from the source, but prioritize the resident progressive rate explanation. State '2026 income year'.",
    zh: "【JP税制约束】已注册的NTA英文页面（12006.htm）涉及非居民预提税率，并非居民综合所得累进税率表。居民（本文主要读者）适用的国税所得税累进税率（依据所得税法第89条，知识库补充）：195万日元以下5%；195万~330万日元超出部分10%；330万~695万日元超出部分20%；695万~900万日元超出部分23%；900万~1,800万日元超出部分33%；1,800万~4,000万日元超出部分40%；4,000万日元以上45%（共7档）。另加复兴特别所得税（所得税额的2.1%）。住民税（都道府县税+市区町村税，合计通常约10%）另行征收。非居民预提税率（15.315%、20.42%等）如有来源可简要提及，但优先说明居民累进税率。须注明「2026年所得」。",
  },
  ph: {
    ja: "【PH税制制約】フィリピンの個人所得税はTRAIN法（Tax Reform for Acceleration and Inclusion、共和国法10963号、2018年施行）に基づく累進税率。ソース（最高裁E-Library Wayback・NIRC Sec.24）に記載の税率表：₱250,000以下0%・₱250,001〜₱400,000超部分20%・₱400,001〜₱800,000超部分25%・₱800,001〜₱2,000,000超部分30%・₱2,000,001〜₱8,000,000超部分32%・₱8,000,000超35%（6段階）を根拠として使用すること。ソース内の1%・5%・6%・8%・10%・12%・15%等はVAT・印紙税・その他税目の税率であり、個人所得税率として使用しないこと。「TRAIN法（2018年施行）に基づく税率」であることを明記すること。",
    en: "【PH tax constraint】Philippine personal income tax is based on the TRAIN Law (Tax Reform for Acceleration and Inclusion, Republic Act 10963, enacted 2018). Use the tax rate schedule from the source (SC E-Library Wayback, NIRC Sec.24): ₱0–₱250,000: 0%; ₱250,001–₱400,000: 20% on excess; ₱400,001–₱800,000: 25% on excess; ₱800,001–₱2,000,000: 30% on excess; ₱2,000,001–₱8,000,000: 32% on excess; above ₱8,000,000: 35% (6 brackets). The 1%, 5%, 6%, 8%, 10%, 12%, 15% figures in the source refer to VAT, documentary stamp tax, and other tax categories — do NOT use them as income tax rates. State 'based on the TRAIN Law (enacted 2018)'.",
    zh: "【PH税制约束】菲律宾个人所得税依据TRAIN法（税收改革促进普惠法，共和国第10963号法令，2018年生效）的累进税率。使用来源（最高法院E-Library Wayback，NIRC第24条）中的税率表：₱250,000以下0%；₱250,001~₱400,000超出部分20%；₱400,001~₱800,000超出部分25%；₱800,001~₱2,000,000超出部分30%；₱2,000,001~₱8,000,000超出部分32%；₱8,000,000以上35%（共6档）。来源中1%、5%、6%、8%、10%、12%、15%等数值属增值税、印花税等其他税目，不得作为个人所得税率使用。须注明「依据TRAIN法（2018年施行）」。",
  },
  tw: {
    ja: "【TW税制制約】台湾の綜合所得税（総合課税・外国人含む）の税率（ソース根拠）：NT$590,000以下5%・NT$590,001〜NT$1,330,000超部分12%・NT$1,330,001〜NT$2,660,000超部分20%・NT$2,660,001〜NT$4,980,000超部分30%・NT$4,980,000超部分40%の5段階。ソース2番目URL（etax.nat.gov.tw）に記載の8.5%・6%・21%等は特定の控除率・分離課税税率・外国人の最低課税等の別レートであり、主たる累進税率表（5段階）と混在しないこと。「外国人居住者（在台183日以上）は居住者と同一税率で全世界所得課税」「非居住者（183日未満）は分離源泉課税」の旨も説明すること。適用年度（例：2024年所得）を明記すること。",
    en: "【TW tax constraint】Taiwan's consolidated income tax (for both residents and foreign nationals) brackets from the source: NT$0–NT$590,000: 5%; NT$590,001–NT$1,330,000: 12% on excess; NT$1,330,001–NT$2,660,000: 20% on excess; NT$2,660,001–NT$4,980,000: 30% on excess; above NT$4,980,000: 40% on excess (5 brackets). Figures such as 8.5%, 6%, 21% in the second source URL refer to specific withholding rates, deduction percentages, or alternative minimum tax — do not mix them with the main 5-bracket progressive rate table. Also explain: 'Foreign residents (183+ days in Taiwan) are taxed at the same progressive rates on worldwide income; non-residents (<183 days) are subject to flat withholding at source'. State the applicable income year (e.g. 2024 income).",
    zh: "【TW税制约束】台湾综合所得税（适用于居民及外籍人士）来源中的税率：NT$590,000以下5%；NT$590,001~NT$1,330,000超出部分12%；NT$1,330,001~NT$2,660,000超出部分20%；NT$2,660,001~NT$4,980,000超出部分30%；NT$4,980,000以上超出部分40%（共5档）。来源第二个URL中的8.5%、6%、21%等属扣缴率、扣除率或最低税负等特定税率，不得与主要5档累进税率混用。同时说明：「外籍居民（在台183天以上）与本地居民适用相同累进税率且对全球所得征税；非居民（183天以下）适用分离预提税」。须注明适用年度（如2024年所得）。",
  },
  za: {
    ja: "【ZA税制制約】南アフリカの個人所得税（2025/2026課税年度）のソース根拠税率表（7段階）：R237,100以下18%・R237,101〜R370,500は26%（超過部分）・R370,501〜R512,800は31%・R512,801〜R673,000は36%・R673,001〜R857,900は39%・R857,901〜R1,817,000は41%・R1,817,000超45%。Primary rebate（一次税額控除、2025/26年度はR17,235等）が税額から差し引かれる仕組みも説明すること。ソースに記載の15%は非居住者の配当源泉税・20%は配当分離税等の別レートである可能性があるため文脈に合わせて使用すること。「2025/2026課税年度」と明記すること。",
    en: "【ZA tax constraint】South Africa personal income tax for 2025/2026 tax year — from source (7 brackets): R0–R237,100: 18%; R237,101–R370,500: 26% on excess; R370,501–R512,800: 31% on excess; R512,801–R673,000: 36% on excess; R673,001–R857,900: 39% on excess; R857,901–R1,817,000: 41% on excess; above R1,817,000: 45% on excess. Also explain the rebate system: the Primary Rebate (R17,235 for 2025/26 tax year) is deducted from the calculated tax. The 15% in the source likely refers to non-resident dividend withholding tax and 20% to resident dividends tax — use these figures in the appropriate context. State '2025/2026 tax year'.",
    zh: "【ZA税制约束】南非个人所得税（2025/2026税务年度）来源税率表（7档）：R237,100以下18%；R237,101~R370,500超出部分26%；R370,501~R512,800超出部分31%；R512,801~R673,000超出部分36%；R673,001~R857,900超出部分39%；R857,901~R1,817,000超出部分41%；R1,817,000以上45%。同时说明税额抵免制度：主要抵免额（Primary Rebate，2025/26税年为R17,235）从计算税额中扣除。来源中15%可能指非居民股息预提税，20%指居民股息税，须按各自文脉使用。须注明「2025/2026税务年度」。",
  },
  bg: {
    ja: "【BG税制制約（知識ベース）】ブルガリアの個人所得税は一律10%のフラット税率（ZKPO/ZDDFLに基づく）。EU圏内でも最低水準の税率の一つ。居住者（年間183日超の滞在等の要件）の全世界所得に適用。配当所得は5%の源泉税（居住者）。税制ソースの取得が失敗しているため知識ベースのみで記述し、「2026年適用の標準税率として」と明記すること。最新情報はNRA（国家歳入庁 nra.bg）で確認するよう案内すること。",
    en: "【BG tax constraint (knowledge-based)】Bulgaria applies a flat 10% personal income tax rate (under ZKPO/ZDDFLS), one of the lowest in the EU. This applies to the worldwide income of residents (generally those staying 183+ days per year). A separate 5% withholding tax applies to dividends for residents. Tax sources were unavailable; use knowledge-based figures only. State 'applicable rate for 2026' and direct readers to verify the latest rates at NRA (National Revenue Agency, nra.bg).",
    zh: "【BG税制约束（知识库）】保加利亚个人所得税采用10%统一税率（依据ZKPO/ZDDFLS），是欧盟最低税率之一。适用于居民（通常为年内居留183天以上者）的全球所得。股息所得另征5%预提税（居民）。税制来源获取失败，以知识库补充，须注明「2026年适用税率」，并提示读者在NRA（国家税收局，nra.bg）核实最新信息。",
  },
  br: {
    ja: "【BR税制制約】ブラジルの個人所得税（IRPF）の月次源泉徴収税率（ソース根拠：Receita Federal「Tributação de 2026」ページ）。ソースの表見出し「A partir de janeiro de 2026」および「Tabela de Incidência Mensal」をそのまま年度ラベルとして記事に引用し、「2026年1月以降適用の月次表（Tributação de 2026、Lei nº 15.191/2025）」と明記すること。税率（5段階）：R$2.428,80以下0%（免税）・R$2.428,81〜R$2.826,65は7.5%・R$2.826,66〜R$3.751,05は15.0%・R$3.751,06〜R$4.664,68は22.5%・R$4.664,68超27.5%。ソースに記載の0.005%・1.5%・17.5%・20%・30%等はIOF（金融取引税）・その他税目の税率であり、個人所得税率（IRPF）として使用しないこと。R$5,000/月免税やR$60,000/年免税（2026年改正案）はソース上の記載がなければ書かないこと。",
    en: "【BR tax constraint】Brazil personal income tax (IRPF) monthly withholding brackets from source (Receita Federal 'Tributação de 2026' page). Quote the table heading from the source: 'A partir de janeiro de 2026' / 'Tabela de Incidência Mensal'. State explicitly in the article: 'Monthly table applicable from January 2026 (Tributação de 2026, Lei nº 15.191/2025)'. Brackets (5 tiers): R$2,428.80 or below: 0% (exempt); R$2,428.81–R$2,826.65: 7.5%; R$2,826.66–R$3,751.05: 15.0%; R$3,751.06–R$4,664.68: 22.5%; above R$4,664.68: 27.5%. Values such as 0.005%, 1.5%, 17.5%, 20%, 30% in the source refer to IOF (Financial Operations Tax) and other tax categories — do NOT use them as IRPF rates. Do NOT mention R$5,000/month or R$60,000/year zero-tax thresholds unless they appear explicitly in the source.",
    zh: "【BR税制约束】巴西个人所得税（IRPF）月度预扣税率（来源：Receita Federal「Tributação de 2026」页面）。引用来源表格标题「A partir de janeiro de 2026」/「Tabela de Incidência Mensal」作为年度标签，并在文章中注明「2026年1月起适用月度表（Tributação de 2026，Lei nº 15.191/2025）」。税率（5档）：R$2,428.80以下0%（免税）；R$2,428.81~R$2,826.65为7.5%；R$2,826.66~R$3,751.05为15.0%；R$3,751.06~R$4,664.68为22.5%；R$4,664.68以上27.5%。来源中0.005%、1.5%、17.5%、20%、30%等属IOF（金融交易税）等其他税目税率，不得作为IRPF税率使用。除非来源中明确记载，否则不得提及R$5,000/月或R$60,000/年零税率（2026年改革方案）。",
  },
  cn: {
    ja: "【CN税制制約】中国の居住者個人所得税（総合所得）の年間課税区分（ソース補完 + 知識ベース）：¥36,000以下3%・¥36,001〜¥144,000超部分10%・¥144,001〜¥300,000超部分20%・¥300,001〜¥420,000超部分25%・¥420,001〜¥660,000超部分30%・¥660,001〜¥960,000超部分35%・¥960,000超45%（7段階）。ソース（広東省税務局）に記載の1%・1.5%は個人所得税率ではなく（分類所得・源泉税・地方付加税等の別税目の可能性）、上記7段階の主要税率表には使用しないこと。居住者（1課税年度の中国国内滞在183日以上）は全世界所得課税、非居住者は中国源泉所得のみ課税となる構造も説明すること。「2025年所得基準」と明記すること。",
    en: "【CN tax constraint】China resident personal income tax on comprehensive income uses annual brackets (source + knowledge): ¥0–¥36,000: 3%; ¥36,001–¥144,000: 10% on excess; ¥144,001–¥300,000: 20% on excess; ¥300,001–¥420,000: 25% on excess; ¥420,001–¥660,000: 30% on excess; ¥660,001–¥960,000: 35% on excess; above ¥960,000: 45% on excess (7 brackets). The 1% and 1.5% values in the Guangdong Tax Bureau source are NOT income tax brackets (likely from classified income, withholding, or local surtax items) — do NOT include them in the main 7-bracket table. Also explain: residents (183+ days in China per tax year) are taxed on worldwide income; non-residents are taxed only on China-sourced income. State '2025 income basis'.",
    zh: "【CN税制约束】中国居民个人所得税（综合所得）年度税率区间（来源补充+知识库）：¥36,000以下3%；¥36,001~¥144,000超出部分10%；¥144,001~¥300,000超出部分20%；¥300,001~¥420,000超出部分25%；¥420,001~¥660,000超出部分30%；¥660,001~¥960,000超出部分35%；¥960,000以上45%（共7档）。来源（广东省税务局）中的1%、1.5%并非个人所得税率（可能为分类所得、预提税或地方附加税），不得列入上述7档主要税率表。同时说明：居民纳税人（一个纳税年度在华居留183天以上）就全球所得纳税；非居民仅就中国来源所得纳税。须注明「以2025年所得为基准」。",
  },
  co: {
    ja: "【CO税制制約】コロンビアの自然人個人所得税はUVT（Unidad de Valor Tributario）基準のArt.241税率表（ソース根拠：DIAN 2022年度申告ガイド）：1,090 UVT以下0%・1,090〜1,700 UVT超部分19%・1,700〜4,100 UVT超部分28%・4,100〜8,670 UVT超部分33%・8,670〜18,970 UVT超部分35%・18,970〜31,000 UVT超部分37%・31,000 UVT超39%（7段階）。ソースに記載の25%・30%・40%・50%等は配当課税・adicional（追加税率）・その他の分類所得の可能性があり、主たる累進税率表には混在しないこと。UVTの年次換算額は毎年改定されるため閾値は「X UVT相当」として記載し、具体的なCOP金額は「DIAN（dian.gov.co）で最新UVT額を確認」と案内すること。ソースの基準年（2022年税年度）を明記すること。",
    en: "【CO tax constraint】Colombia personal income tax for natural persons uses UVT (Unidad de Valor Tributario) based brackets per Art.241 (source: DIAN 2022 income tax guide): 0–1,090 UVT: 0%; 1,090–1,700 UVT: 19% on excess; 1,700–4,100 UVT: 28% on excess; 4,100–8,670 UVT: 33% on excess; 8,670–18,970 UVT: 35% on excess; 18,970–31,000 UVT: 37% on excess; above 31,000 UVT: 39% on excess (7 brackets). Values such as 25%, 30%, 40%, 50% in the source likely refer to dividends tax, additional surtax, or classified income — do not mix them into the main progressive rate table. Since the UVT amount is updated annually, express thresholds as 'X UVT equivalent' and direct readers to verify the current UVT rate at DIAN (dian.gov.co). State the source reference year (2022 tax year).",
    zh: "【CO税制约束】哥伦比亚自然人个人所得税依据UVT（价值税收单位）第241条税率表（来源：DIAN 2022年所得申报指南）：0~1,090 UVT：0%；1,090~1,700 UVT超出部分19%；1,700~4,100 UVT超出部分28%；4,100~8,670 UVT超出部分33%；8,670~18,970 UVT超出部分35%；18,970~31,000 UVT超出部分37%；31,000 UVT以上39%（共7档）。来源中25%、30%、40%、50%可能属股息税、附加税或分类所得，不得与主要累进税率表混用。由于UVT金额每年更新，门槛以「X UVT当量」表述，并提示读者在DIAN（dian.gov.co）核实当前UVT金额。须注明来源基准年（2022税务年度）。",
  },
  id: {
    ja: "【ID税制制約】インドネシアの個人所得税（PPh21・HPP法による2022年改正後）のソース根拠税率（5段階）：Rp60,000,000以下5%・Rp60,000,001〜Rp250,000,000超部分15%・Rp250,000,001〜Rp500,000,000超部分25%・Rp500,000,001〜Rp5,000,000,000超部分30%・Rp5,000,000,000超35%。居住者（1課税年度183日以上の滞在等の要件）は全世界所得に課税。ソースに記載の税率（5%・15%・25%・30%・35%）のみを根拠として使用し、他の数値はソース文脈に従って使用すること。適用年度を明記すること。",
    en: "【ID tax constraint】Indonesia personal income tax (PPh21, post-2022 HPP Law reform) brackets from source (5 brackets): Rp0–Rp60,000,000: 5%; Rp60,000,001–Rp250,000,000: 15% on excess; Rp250,000,001–Rp500,000,000: 25% on excess; Rp500,000,001–Rp5,000,000,000: 30% on excess; above Rp5,000,000,000: 35% on excess. Residents (generally 183+ days in Indonesia per tax year) are taxed on worldwide income. Use ONLY the 5 bracket rates (5%, 15%, 25%, 30%, 35%) from the source. State the applicable tax year.",
    zh: "【ID税制约束】印度尼西亚个人所得税（PPh21，2022年HPP法修订后）来源税率（5档）：Rp60,000,000以下5%；Rp60,000,001~Rp250,000,000超出部分15%；Rp250,000,001~Rp500,000,000超出部分25%；Rp500,000,001~Rp5,000,000,000超出部分30%；Rp5,000,000,000以上35%。居民纳税人（通常为一个税务年度在印尼居留183天以上）就全球所得纳税。仅使用来源中的5档税率（5%、15%、25%、30%、35%）。须注明适用年度。",
  },
  vn: {
    ja: "【VN税制制約】ベトナムの個人所得税（TNCN）について、登録済み税制ソース（tuyenquang.gdt.gov.vn）はニュース・お知らせページであり税率表を含まない。税務総局（gdt.gov.vn）の公式ポータルはJavaScript必須SPAのため取得不可。ソースに根拠となる税率表がないため、税制セクションには具体的な税率（%）や所得区分の閾値を一切記載しないこと。代わりに「最新の税率・所得区分は税務総局（gdt.gov.vn）または在住地の税務署でご確認ください」と案内するにとどめること。「知識ベースの推測値」で税率を補うことも禁止。",
    en: "【VN tax constraint】The registered Vietnam tax source (tuyenquang.gdt.gov.vn) is a news/announcement page and does not contain a tax rate table. The official GDT portal (gdt.gov.vn) is a JavaScript-required SPA and cannot be retrieved. Since no source-grounded rate table is available, do NOT include any specific tax rate percentages or income bracket thresholds in the tax section. Instead, only write: 'For the latest income tax rates and brackets, please consult the General Department of Taxation (gdt.gov.vn) or your local tax office.' Do NOT fill in rates from general knowledge as substitutes.",
    zh: "【VN税制约束】已注册的越南税制来源（tuyenquang.gdt.gov.vn）为新闻/公告页面，不含税率表。税务总局（gdt.gov.vn）官方门户为JavaScript必要型SPA，无法获取。由于没有来源支持的税率表，税制章节中不得写入任何具体税率（%）或收入分档门槛。仅写明：「最新税率及收入分档，请咨询税务总局（gdt.gov.vn）或当地税务局」。禁止以知识库推测值补写税率。",
  },
  hu: {
    ja: "【HU税制制約（知識ベース補完：njt.jog.gov.huはハンガリー所得税法全文（690k文字）のためトークン超過・制約ベースで補完）】ハンガリーの個人所得税は15%のフラット税率（1995年CXVII法・第8条第1項：「az adóalap 15 százaléka」）。課税対象は給与所得・事業所得・配当等の全所得。特別社会保険料（TB等）が別途加算されるが税率構造はシンプル。「15%フラット税率（2026年適用）、1995年CXVII法第8条に基づく。社会保険料は別途。最新情報はhun-tax.hu等またはNAV（nav.gov.hu）で確認のこと」と明記すること。ソースはnjt.jog.gov.hu（ハンガリー公式法令DB）に登録済みだが本文が大容量のため制約ベース補完。",
    en: "【HU tax constraint (knowledge-based: njt.jog.gov.hu is the full Hungarian income tax law at 690k chars — too large for context; constraint-based)】Hungary applies a flat 15% personal income tax rate (1995 Act CXVII, Article 8(1): 'az adóalap 15 százaléka' — '15 percent of the tax base'). Applies to employment income, business income, dividends, and other income. Social security contributions are levied in addition (but are separate from the income tax). State: '15% flat income tax rate (2026 applicable), based on 1995 Act CXVII Article 8. Social security contributions are levied separately. Verify current details at NAV (nav.gov.hu)'.",
    zh: "【HU税制约束（知识库补充：njt.jog.gov.hu为匈牙利所得税法全文（690k字符），超出上下文限制，以约束补充）】匈牙利个人所得税采用15%统一税率（1995年第CXVII号法第8条第1款：「az adóalap 15 százaléka」——「税基的15%」）。适用于工资、经营所得、股息及其他所得。社会保险缴费另行征收（与所得税分离）。须注明：「15%统一所得税率（2026年适用），依据1995年第CXVII号法第8条。社会保险缴费另行征收。详情请参阅NAV（nav.gov.hu）」。",
  },
  fi: {
    ja: "【FI税制制約（知識ベース補完：vero.fiはJS描画のため税率表取得不可）】フィンランドの国税所得税（Valtion tuloveroasteikko 2026）は以下の5段階累進表：€22,000以下は12.64%・€22,001〜€32,600の超過部分19.00%・€32,601〜€40,100の超過部分30.25%・€40,101〜€52,100の超過部分33.25%・€52,100超の超過部分37.50%。ただしこれは国税のみ。別途、各自治体が設定する地方税（kunnallisvero、全国平均約20〜24%）が全所得に対して加算されるため、実効税率は国税＋地方税の合算となり、高所得者では50%超になる場合もある。「国税に加え地方税（自治体税）が別途加算される。2026年適用のvero.fi（フィンランド税務局）公式表を参照」と必ず明記すること。",
    en: "【FI tax constraint (knowledge-based: vero.fi is JS-rendered, rate table unavailable)】Finland national income tax (Valtion tuloveroasteikko 2026), 5 progressive brackets: €0–€22,000: 12.64%; €22,001–€32,600: 19.00% on excess; €32,601–€40,100: 30.25% on excess; €40,101–€52,100: 33.25% on excess; above €52,100: 37.50% on excess. IMPORTANT: this is state (national) tax only. Municipal income tax (kunnallisvero), averaging approximately 20–24% nationally (varies by municipality), is levied in addition on all income. Combined effective rates for higher incomes can exceed 50%. Always note: 'Municipal income tax is levied in addition to state income tax. Figures apply to 2026 (source: vero.fi — Finnish Tax Administration)'.",
    zh: "【FI税制约束（知识库补充：vero.fi为JS渲染，税率表不可获取）】芬兰国家所得税（Valtion tuloveroasteikko 2026），5档累进税率：€22,000以下12.64%；€22,001~€32,600超出部分19.00%；€32,601~€40,100超出部分30.25%；€40,101~€52,100超出部分33.25%；€52,100以上超出部分37.50%。注意：以上仅为国家税。另须缴纳地方市政税（kunnallisvero，全国平均约20~24%，因市而异），适用于全部所得，叠加后高收入者实际税率可能超过50%。须注明「国家税基础上另加市政税（地方税），2026年适用（来源：芬兰税务局vero.fi）」。",
  },
  ro: {
    ja: "【RO税制制約（知識ベース補完：legislatie.just.roはSPAで税率表取得不可）】ルーマニアの個人所得税（impozit pe venit）は10%のフラット税率（Codul Fiscal Art.64、2018年以降）。給与所得には社会保険料（CAS：年金25%＋CASS：健康保険10%、合計35%、従業員負担分）が別途源泉徴収される。所得税10%は社会保険料控除後の課税所得に適用されるため、総支給額に対する実効的な税・社会保険料負担は約40〜45%に達する場合がある。「所得税10%フラット（2026年適用）、社会保険料（CAS 25%・CASS 10%）は別途加算」と明記すること。最新の詳細はANAF（anaf.ro）またはCodul Fiscal（legislatie.just.ro）で確認するよう案内すること。",
    en: "【RO tax constraint (knowledge-based: legislatie.just.ro is SPA, rate table unavailable)】Romania applies a flat 10% personal income tax (impozit pe venit, Codul Fiscal Article 64, in force since 2018). For employment income, social contributions are withheld in addition: CAS (pension contribution): 25%, CASS (health insurance): 10% — total 35% employee-side social contributions. Since income tax (10%) applies to income after social contribution deductions, the effective combined burden on gross income can reach approximately 40–45%. State explicitly: 'Flat 10% income tax (2026 applicable), social contributions (CAS 25% + CASS 10%) levied in addition'. Direct readers to ANAF (anaf.ro) or Codul Fiscal (legislatie.just.ro) for the latest details.",
    zh: "【RO税制约束（知识库补充：legislatie.just.ro为SPA，税率表不可获取）】罗马尼亚个人所得税（impozit pe venit）采用10%统一税率（财政法典第64条，2018年起实施）。工资所得另须缴纳社会保险费：CAS（养老保险）25%＋CASS（医疗保险）10%，合计35%（雇员负担部分）。由于10%所得税以扣除社会保险费后的应税所得为基础，实际综合税负（含社会保险）对毛工资而言可达约40~45%。须注明「10%统一所得税（2026年适用）；另加社会保险费（CAS 25%+CASS 10%）」。提示读者参阅ANAF（anaf.ro）或财政法典（legislatie.just.ro）获取最新信息。",
  },
  ar: {
    ja: "【AR税制制約（知識ベース・ソースなし）】アルゼンチンの個人所得税（Impuesto a las Ganancias）は9段階の累進税率：5%・9%・12%・15%・19%・23%・27%・31%・35%。課税閾値（MNI・GANANCIAS NO IMPONIBLES等）はインフレ連動で四半期ごとに改定（Ley 27.430・Ley 27.617等に基づくAjuste por inflación）されるため、ペソ表記の具体的な金額は「改定幅が大きい」と案内し記載しないこと。「税率は5〜35%の9段階、閾値はCPI連動で定期改定」と記述すること。税制ソースは未登録のため知識ベースのみで記述し、最新情報はAFIP（連邦歳入庁 afip.gob.ar）または ARCA（新組織名）で確認するよう案内すること。",
    en: "【AR tax constraint (knowledge-based, no source)】Argentina's personal income tax (Impuesto a las Ganancias) uses 9 progressive brackets: 5%, 9%, 12%, 15%, 19%, 23%, 27%, 31%, 35%. Income thresholds (MNI — Mínimo No Imponible and other deductions) are indexed quarterly to inflation (under Ley 27.430, Ley 27.617 and Ajuste por inflación rules) and change significantly, so do NOT state specific peso amounts — instead note: 'Brackets are adjusted periodically by CPI; verify current thresholds at AFIP/ARCA'. Describe the rate structure as: '9 progressive brackets ranging from 5% to 35%; thresholds are inflation-indexed'. No tax source is registered; use knowledge-based figures only. Direct readers to AFIP (afip.gob.ar) or ARCA (the newly restructured agency).",
    zh: "【AR税制约束（知识库，无来源）】阿根廷个人所得税（Impuesto a las Ganancias）采用9档累进税率：5%、9%、12%、15%、19%、23%、27%、31%、35%。收入门槛（MNI等免税额）依CPI指数每季度调整（依据Ley 27.430、Ley 27.617及通胀调整机制），变动幅度大，不得写明具体比索金额，改为「税率为5~35%的9档累进制，门槛按CPI定期调整」。无税制来源，以知识库补充，并提示读者在AFIP（afip.gob.ar）或ARCA（新重组机构）核实最新信息。",
  },
};

// 国別の追加制約（ソースの性質や構成上の注意点を補足）
const COUNTRY_VISA_EXTRA_CONSTRAINTS: Partial<Record<string, Record<Lang, string>>> = {
  tn: {
    ja: "【TN特別制約】参考資料は「外国人雇用・労働法」に関するもので、ビザ申請手続きの一次情報ではない。" +
        "参考資料に記載のある外国人雇用ルール（30%ルール、ANETIの事前許可等）はソースの数値に従って記述すること。" +
        "ビザ申請手続き・申請費用・学生ビザについては参考資料に一次情報がないため、具体的な金額や日数を書かず、" +
        "「詳細は在日チュニジア大使館または領事館にお問い合わせください」と誘導する構成にすること。" +
        "いかなるURLも捏造・推測で書かないこと（example.com / プレースホルダー禁止）。",
    en: "【TN special constraint】Sources cover foreign employment/labor law, NOT visa application procedures. " +
        "Write employment rules from source (30% rule, ANETI pre-approval etc.) with exact figures. " +
        "For visa procedures, fees, and student visas where no primary source exists: omit specific amounts/timelines " +
        "and instead write 'Please contact the Tunisian Embassy for current details'. " +
        "Never fabricate URLs or use placeholder domains (example.com etc.).",
    zh: "【TN特殊限制】参考资料涉及外国人雇佣/劳动法，而非签证申请手续。" +
        "雇佣规则（30%外籍员工上限、ANETI预先批准等）须按原文数字填写。" +
        "签证申请手续、费用、学生签证因无一手资料，不得填写具体金额或天数，" +
        "改为「请联系突尼斯驻当地大使馆确认最新信息」。禁止捏造URL或使用占位域名（example.com等）。",
  },
};

async function generateVisaContent(
  countryName: { ja: string; en: string },
  lang: Lang,
  sourceCtx?: SourceContext,
  countryCode?: string,
  taxSourceCtx?: SourceContext
): Promise<{ title: string; description: string; content: string }> {
  const hasSource = !!sourceCtx?.text;
  const sourceBlock = hasSource
    ? `\n\n=== 参考資料原文（以下の内容のみを根拠にすること。原文にない数字・手続き・URLは書かないこと）===\n${sourceCtx!.text}\n=== 参考資料原文ここまで ===\n`
    : "";
  // 参考資料セクションはソース有りの場合は自動生成するため GPT には不要
  const refSectionInstruction = hasSource
    ? "参考資料セクション（### 参考資料 / ### References / ### 参考资料）は書かないこと。自動追加される。"
    : "";
  const prebuiltRefs = sourceCtx?.refs ?? "";

  const extraConstraint = countryCode
    ? (COUNTRY_VISA_EXTRA_CONSTRAINTS[countryCode]?.[lang] ?? "")
    : "";

  // 税制ソース
  const hasTaxSource = !!taxSourceCtx?.text;
  const taxBlock = hasTaxSource
    ? `\n\n=== 税制参考資料（所得税率・控除額・税率区分は以下の数値のみを根拠にすること）===\n${taxSourceCtx!.text}\n=== 税制参考資料ここまで ===\n`
    : "";
  // hasTaxSource の有無に関わらず適用（DEやBG等ソースなし国の知識ベース制約のため）
  const taxExtraConstraint = countryCode
    ? (COUNTRY_TAX_EXTRA_CONSTRAINTS[countryCode]?.[lang] ?? "")
    : "";
  // ja/en/zh でそれぞれ税制指示を切り替え
  // cent表記→%換算の補足（"Xc for each $1" → "X%" は機械的単位換算として許可）
  const centToPercentNote = {
    ja: "なお、ソース原文に「Xc for each $1」のようなセント表記がある場合、X%への換算は機械的な単位換算として原文の範囲内とみなし必ず記述すること（例：「16c for each $1 over $18,200」→「16%」、「30c for each $1」→「30%」）。「公式情報でご確認ください」に置き換えることは禁止。丸め・推定・外挿は引き続き禁止。",
    en: "IMPORTANT: if the source uses 'Xc for each $1' notation, you MUST convert it to X% — this is a mechanical unit conversion within the source's scope (e.g., '16c for each $1 over $18,200' → '16%', '30c for each $1' → '30%'). Do NOT replace these with 'please check official information'. Rounding, estimation, or extrapolation remain prohibited.",
    zh: "重要：如来源使用「每1美元Xc」的表述，必须将其换算为X%——这属于机械性单位换算，在原文范围内（例：「每超过18,200美元的每1美元16c」→「16%」，「每1美元30c」→「30%」）。禁止用「请参阅官方信息」代替。四舍五入、估算或外推仍禁止。",
  };
  const taxInstruction: Record<Lang, string> = {
    ja: hasTaxSource
      ? `所得税率・税率閾値は税制参考資料の数値のみを使用すること。税制参考資料にない税項目は「最新の税制は${countryName.ja}の税務当局または公式情報でご確認ください」と誘導すること。${centToPercentNote.ja}${taxExtraConstraint ? `\n${taxExtraConstraint}` : ""}`
      : `ただし所得税率・税率閾値などの税制情報は参考資料に具体的な数字の記載がある場合のみ書くこと。参考資料にない場合は「最新の税制は移住先国の税務当局または公式情報でご確認ください」と案内するにとどめること。${taxExtraConstraint ? `\n${taxExtraConstraint}` : ""}`,
    en: hasTaxSource
      ? `Income tax rates and brackets: use ONLY the figures from the tax reference source. For any tax items not covered in the tax source, write 'For current tax rates, please refer to the official tax authority of ${countryName.en}'. ${centToPercentNote.en}${taxExtraConstraint ? `\n${taxExtraConstraint}` : ""}`
      : `For income tax rates and tax bracket thresholds: only write specific figures if they appear in the reference sources. If not sourced, write 'For current tax rates, please refer to the official tax authority of the destination country' instead of guessing figures.${taxExtraConstraint ? `\n${taxExtraConstraint}` : ""}`,
    zh: hasTaxSource
      ? `所得税率、税率区间：仅使用税制参考资料中的数字。税制参考资料未涉及的税务项目，请引导至「请参阅${countryName.en}税务机关的官方信息」。${centToPercentNote.zh}${taxExtraConstraint ? `\n${taxExtraConstraint}` : ""}`
      : `但所得税率、税率区间等税制信息，只有在参考资料中有明确数字时才可填写；若无来源，请改为「有关当前税率，请参阅目的国税务机关的官方信息」。${taxExtraConstraint ? `\n${taxExtraConstraint}` : ""}`,
  };

  const prompts: Record<Lang, string> = {
    ja: `あなたはMoveWorthというサービスのビザ情報ライターです。MoveWorthは、海外移住を考えている人向けに、税金・生活費・ビザを一括シミュレーションできるサービスです。
${sourceBlock}${taxBlock}
${countryName.ja}のビザ・移住条件に関する記事を日本語で書いてください。${hasSource ? "参考資料原文に記載のあるビザについては、要件・費用・手続きを必ず原文の数値に従って書くこと。参考資料原文に記載のないビザ種別（例：ワーキングホリデー等）は知識で補完してよいが、具体的な申請費用は書かず「公式サイトでご確認ください」と案内すること。" : ""}生活費・家賃の目安は知識で補完してよい。${taxInstruction.ja}${extraConstraint ? `\n${extraConstraint}` : ""}

## タイトル形式（必ず守ること。絵文字・記号は一切使わないこと）
【2026年最新版】${countryName.ja}のビザ・就労許可完全ガイド｜{主要ビザ名1}・{主要ビザ名2}・{主要ビザ名3}

## 本文の構成（見出しは必ず ### を使うこと、## は使わないこと）

[導入段落] ※見出しなし。${countryName.ja}の移住先としての特徴・魅力を2〜3文で書く。

### 主なビザの種類
各ビザを以下の形式で記載：
**{ビザ名}**
説明文（1〜2文）
- 要件：...
- **最低条件や重要数値**
- 有効期間：...
- 申請費用：...

### 生活・税金について
**所得税**：税率を箇条書きで
**{その他の税・保険}**：説明
**住居費**：主要都市の家賃目安

### 費用の目安
| 項目 | 費用 |
|------|------|
（ビザ申請費・各種手数料を表で記載）

### 移住前のチェックポイント
1. **{重要事項}**：説明
（5点程度の番号付きリスト）

締め括りの文（1〜2文）
${refSectionInstruction ? `\n${refSectionInstruction}` : `
---

### 参考資料
本記事の情報は以下の公式資料をもとに作成しています。
- **{ビザ名}**: [{機関名} – {ページ名}]({公式URL})`}

## JSON形式で返答（JSONのみ、コードブロック不要）
{
  "title": "【2026年最新版】${countryName.ja}のビザ・就労許可完全ガイド｜主要ビザ名を含める",
  "description": "主要ビザと最低条件・費用を含むメタディスクリプション（120〜160文字）",
  "content": "上記構成の記事本文（マークダウン、2500〜4000文字）"
}`,

    en: `You are a visa information writer for MoveWorth, a service that helps people considering international relocation simulate taxes, living costs, and visa requirements.
${sourceBlock}${taxBlock}
Write a detailed, factual article about ${countryName.en} visa and immigration requirements in English.${hasSource ? " For visa types covered in the reference texts: use ONLY those sources for requirements, fees, and procedures. For visa types NOT in the references (e.g. Working Holiday, partner visas): supplement from your knowledge but omit specific fee amounts and instead say 'check the official site for current fees'." : ""} General living costs and rent estimates may use your knowledge. ${taxInstruction.en}${extraConstraint ? `\n${extraConstraint}` : ""}

## Title format (strictly follow. No emojis or special symbols):
${countryName.en} Visa & Work Permit Complete Guide 2026 | {Visa1}, {Visa2} & {Visa3}

## Article structure (use ### for all headings, never ##):

[Intro paragraph] — no heading. 2–3 sentences on ${countryName.en} as a relocation destination.

### Main Visa Types
For each visa type:
**{Visa Name}**
Brief description (1–2 sentences)
- Requirements: ...
- **Key threshold or figure**
- Validity: ...
- Application fee: ...

### Tax & Living Notes
**Income tax**: rates in bullet form
**{Other tax/insurance}**: description
**Housing**: rental price estimate for main city

### Cost Summary
| Item | Cost |
|------|------|
(table of visa fees and key costs)

### Pre-Move Checklist
1. **{Key point}**: explanation
(5 numbered items)

Closing sentence.
${refSectionInstruction ? `\n${refSectionInstruction}` : `
---

### References
Data sourced from:
- **{Visa name}**: [{Agency} – {Page}]({official URL})`}

## Return as JSON only (no code block):
{
  "title": "${countryName.en} Visa & Work Permit Complete Guide 2026 | include main visa names",
  "description": "Include key visa types and minimum requirements (120–160 chars)",
  "content": "Full article in the structure above (markdown, 2500–4000 chars)"
}`,

    zh: `您是MoveWorth服务的签证信息撰稿人。MoveWorth帮助考虑海外移居的人模拟税务、生活成本和签证要求。
${sourceBlock}${taxBlock}
请用中文撰写一篇关于${countryName.en}（${countryName.ja}）签证与移居条件的详细文章。${hasSource ? "参考资料中涉及的签证类型，其要求、费用和手续必须严格依照原文数字填写。参考资料未涉及的签证类型（如打工度假签证等）可以用您的知识补充，但不得写具体申请费用，请改为引导至官方网站确认。" : ""}生活费、房租等信息可用知识补充。${taxInstruction.zh}${extraConstraint ? `\n${extraConstraint}` : ""}

## 标题格式（必须遵守。不使用任何表情符号或特殊符号）：
【2026年最新版】{国名中文}签证与工作许可完全指南｜{签证1}·{签证2}·{签证3}

## 文章结构（所有标题必须使用 ###，不使用 ##）：

[导言段落] ※无标题。2～3句介绍${countryName.en}作为移居目的地的特点。

### 主要签证类型
每种签证格式：
**{签证名称}**
简要说明（1～2句）
- 要求：...
- **关键条件或数字**
- 有效期：...
- 申请费用：...

### 税务与生活概况
**所得税**：以列表形式列出税率
**住房费用**：主要城市租金参考

### 费用汇总
| 项目 | 费用 |
|------|------|
（签证申请费及主要费用表格）

### 移居前注意事项
1. **{重要事项}**：说明
（5条编号列表）
${refSectionInstruction ? `\n${refSectionInstruction}` : `
---

### 参考资料
- **{签证名称}**: [{机构} – {页面}]({官方URL})`}

## 仅返回JSON（无代码块）：
{
  "title": "【2026年最新版】${countryName.en}签证与工作许可完全指南｜含主要签证名称",
  "description": "包含主要签证类型和最低要求（120～160字）",
  "content": "按上述结构的完整文章（Markdown格式，2500～4000字）"
}`,
  };

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompts[lang] }],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });
  const parsed1 = JSON.parse(res.choices[0].message.content!);
  parsed1.content = sanitizeMoveWorthLinks(parsed1.content);

  // ソース有りの場合: 参考資料セクションを自動追加
  // GPTが指示を無視して参考資料を書いた場合に備え、既存セクションを除去してから追記する
  if (hasSource && prebuiltRefs) {
    const refHeadings: Record<Lang, string> = {
      ja: "### 参考資料\n本記事の情報は以下の公式資料をもとに作成しています。",
      en: "### References\nData sourced from official government and immigration authority pages.",
      zh: "### 参考资料\n本文信息来源于以下官方资料。",
    };
    const bodyOnly = stripExistingRefSection(parsed1.content);
    parsed1.content = bodyOnly.trimEnd() + `\n\n---\n\n${refHeadings[lang]}\n${prebuiltRefs}`;
  }

  return parsed1;
}

async function factCheckContent(
  content: string,
  countryName: string,
  lang: string,
  sourceText?: string
): Promise<string> {
  // ソース有りの場合: 原文との整合チェック（知識ベース修正ではなく原文根拠チェック）
  const prompt = sourceText
    ? `あなたは${countryName}のビザ情報の校正者です。以下の「記事本文」を「参考資料原文」と照合してください。参考資料原文に記載のあるビザ種別については、そのビザの要件・費用・手続きの数値が原文と異なる場合は修正してください。参考資料原文に記載のないビザ種別の記述（ワーキングホリデー等）は照合対象外のためそのまま保持してください。税率・生活費・家賃などの一般情報も照合対象外として保持してください。

ルール：
- 「確認できない」「インターネットにアクセスできない」などのメタコメントは絶対に書かないでください
- 修正した記事本文のみを返してください。説明・コメント・注記は一切不要です
- 言語: ${lang}

=== 参考資料原文 ===
${sourceText.slice(0, 6000)}
=== 参考資料原文ここまで ===

=== 記事本文 ===
${content}`
    : `あなたは${countryName}の移住・ビザ情報に詳しい専門家です。以下の記事を、あなたの知識で精査してください。

ルール：
- あなたの学習データに基づいて、費用・期間・必要書類などの数字や事実を確認し、明らかに誤っている箇所のみ修正してください
- 【最重要】所得税率・税率閾値の数字（%・金額ともに）は、記事内にすでに記述されている場合はそのまま保持してください。削除・変更・「公式情報でご確認ください」への置き換えは禁止です。「公式情報でご確認ください」という誘導がある場合もそのままにしてください
- 「確認できない」「インターネットにアクセスできない」などのメタコメントは絶対に書かないでください
- 修正した記事本文のみを返してください。説明・コメント・注記は一切不要です
- 言語: ${lang}

${content}`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    max_tokens: 4000,
  });

  const result = res.choices[0].message.content ?? content;
  // フォールバック：メタコメントが混入した場合は元のコンテンツを使用
  const metaCommentPatterns = [
    "インターネットへのアクセス",
    "外部データベース",
    "確認することはできません",
    "I cannot verify",
    "I don't have access",
    "cannot access the internet",
  ];
  if (metaCommentPatterns.some((p) => result.includes(p))) {
    console.warn(`⚠️  Fact-check returned meta-comment for ${countryName} (${lang}), using original`);
    return content;
  }
  return result;
}

async function generateStudyContent(
  countryName: { ja: string; en: string },
  lang: "ja" | "en"
): Promise<{ title: string; description: string; content: string }> {
  const prompts: Record<"ja" | "en", string> = {
    ja: `あなたはMoveWorth.studyというサービスのライターです。海外留学生向けの情報サービスです。

${countryName.ja}への留学に関する記事を日本語で書いてください。

## タイトル形式（必ず守ること）
【${countryName.ja}】留学中のアルバイト・就労ルール完全ガイド

## 本文の構成（見出しは必ず ### を使うこと）

[導入段落] ※見出しなし。${countryName.ja}への留学の概要を1〜2文で書く。

### 学生ビザの概要
**ビザ種別：** （ビザ名）
**申請費用：** （費用）
**処理期間：** （期間）
**主な要件：**
- （箇条書きで3〜4点）

### アルバイト・就労ルール
**学期中：** 週○時間まで
**休暇中：** 週○時間まで（または無制限など）
**条件：** （許可取得の必要性など）

### 注意事項
1. （重要な注意点）
2. （重要な注意点）
3. （重要な注意点）

### 費用の目安
| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約○〜○万円 |
| 生活費（月額） | 約○〜○万円 |
| 住居費（月額） | 約○〜○万円 |
| 学生ビザ申請費 | 約○円 |

MoveWorth.studyのシミュレーターで${countryName.ja}留学の総費用を計算してみましょう。リンクは必ず https://study.moveworthapp.com/simulate を使用してください。

### 参考資料
本記事の情報は以下の公式資料をもとに作成しています。
（${countryName.ja}の入国管理局・労働省・政府公式サイトなど公式機関を3〜5件。実在する正確なURLのみ。捏造不可）
- [機関名](https://official-url.example.com)

## JSON形式で返答（JSONのみ、コードブロック不要）
{
  "title": "【${countryName.ja}】留学中のアルバイト・就労ルール完全ガイド",
  "description": "週の就労時間上限・ビザ費用・生活費を含むメタディスクリプション（120〜150文字）",
  "content": "上記構成の記事本文（マークダウン、1500〜2500文字）"
}`,

    en: `You are a writer for MoveWorth.study, a service providing study abroad information.

Write a detailed article about studying in ${countryName.en} in English.

## Title format (strictly follow):
Study & Work Rules in ${countryName.en} 2026 — Complete Guide

## Article structure (use ### for all headings):

[Intro paragraph] — no heading. 1–2 sentences on studying in ${countryName.en}.

### Student Visa
**Type:** (visa name)
**Fee:** (amount)
**Processing:** (timeframe)
**Main requirements:**
- (3–4 bullet points)

### Work Rules
**During term:** Up to X hrs/week
**During holidays:** Up to X hrs/week (or unrestricted)
**Conditions:** (permit requirements)

### Key Notes
1. (Important note)
2. (Important note)
3. (Important note)

### Cost Estimate
| Item | Cost |
|------|------|
| Language school (monthly) | approx. X–X USD |
| Living expenses (monthly) | approx. X–X USD |
| Accommodation (monthly) | approx. X–X USD |
| Student visa fee | approx. X USD |

Use the MoveWorth.study simulator to calculate total costs for studying in ${countryName.en}. Always use exact URL: https://study.moveworthapp.com/simulate

### References
List 3-5 official sources (immigration authority, labor ministry, government site of ${countryName.en}). Real URLs only — never fabricate.
- [Organization name](https://official-url.example.com)

## Return as JSON only (no code block):
{
  "title": "Study & Work Rules in ${countryName.en} 2026 — Complete Guide",
  "description": "Include weekly work hour limits, visa fees and living costs (120–150 chars)",
  "content": "Full article in the structure above (markdown, 1500–2500 chars)"
}`,
  };

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompts[lang] }],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });
  const parsed2 = JSON.parse(res.choices[0].message.content!);
  parsed2.content = sanitizeMoveWorthLinks(parsed2.content);
  return parsed2;
}

async function generateCountryGuideContent(
  countryName: { ja: string; en: string },
  lang: "ja" | "en"
): Promise<{ title: string; description: string; content: string }> {
  const prompts: Record<"ja" | "en", string> = {
    ja: `あなたはMoveWorth.studyのSEOライターです。「${countryName.ja}留学」を検索する日本人に向けた、検索上位を狙える記事を書いてください。

## タイトル形式（必ず守ること）
【${countryName.ja}留学】費用・語学学校・ビザ・生活を徹底解説【2026年最新版】

## 本文構成（見出しは ### を使うこと）

[導入] ※見出しなし。${countryName.ja}留学の魅力を2〜3文で。

### ${countryName.ja}留学のメリット
（箇条書き4〜5点。具体的な数字・事例を含める）

### 費用の目安【2026年版】
（月額費用の表：語学学校・生活費・住居費）

### おすすめ留学都市
（3〜4都市の特徴・生活費感）

### 語学学校・大学の種類
（選択肢と特徴の概要）

### 学生ビザの基本情報
（申請要件・費用・期間の概要のみ）

### ${countryName.ja}の生活・文化・治安
（日本人コミュニティ・治安・食事・気候）

### よくある質問（FAQ）
Q1: ${countryName.ja}留学の費用はいくらかかりますか？
A: （具体的な数字を含む回答）
Q2: ${countryName.ja}留学に向いているのはどんな人ですか？
A: （特徴・向き不向き）
Q3: ${countryName.ja}留学の準備はいつから始めれば良いですか？
A: （目安期間）

MoveWorth.studyのシミュレーターで${countryName.ja}留学の総費用を計算できます。リンクは必ず https://study.moveworthapp.com/simulate を使用してください。

### 参考資料
本記事の情報は以下の公式資料をもとに作成しています。
（${countryName.ja}の入国管理局・大使館・観光局・教育省など公式機関を3〜5件。実在する正確なURLのみ。捏造不可）
- [機関名](https://official-url.example.com)

## JSON形式で返答（JSONのみ、コードブロック不要）
{
  "title": "【${countryName.ja}留学】費用・語学学校・ビザ・生活を徹底解説【2026年最新版】",
  "description": "キーワード「${countryName.ja}留学 費用」を含む130〜155文字のメタディスクリプション",
  "content": "上記構成の記事本文（マークダウン、1500〜2500文字）"
}`,

    en: `You are an SEO writer for MoveWorth.study. Write a comprehensive, search-optimized article for Japanese students searching to study in ${countryName.en}.

## Title format (strictly follow):
Study in ${countryName.en} 2026 — Complete Guide to Costs, Schools, Visa & Life

## Article structure (use ### for headings):

[Intro] — no heading. 2-3 sentences on why ${countryName.en} is popular for study abroad.

### Why Study in ${countryName.en}?
(4-5 bullet points with specific facts/figures)

### Estimated Costs in 2026
(Monthly cost table: language school tuition, living expenses, housing)

### Top Cities to Study In
(3-4 cities with brief description)

### Types of Schools & Programs
(Language schools, universities, vocational schools)

### Student Visa Basics
(Key requirements, cost, processing time — brief overview)

### Life, Culture & Safety
(Japanese community, safety level, food, climate)

### FAQ
Q1: How much does it cost to study in ${countryName.en}?
A: (specific figures)
Q2: Who is ${countryName.en} best suited for?
A: (profile of ideal student)
Q3: How far in advance should I start preparing?
A: (timeline)

Include mention of MoveWorth.study simulator. Always use exact URL: https://study.moveworthapp.com/simulate

### References
List 3-5 official sources (immigration authority, embassy, tourism board, education ministry of ${countryName.en}). Real URLs only — never fabricate.
- [Organization name](https://official-url.example.com)

## Return as JSON only (no code block):
{
  "title": "Study in ${countryName.en} 2026 — Complete Guide to Costs, Schools, Visa & Life",
  "description": "SEO meta description 130-155 chars including keyword '${countryName.en} study abroad cost'",
  "content": "Full article (markdown, 1200-2000 chars)"
}`,
  };

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompts[lang] }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });
  const parsed3 = JSON.parse(res.choices[0].message.content!);
  parsed3.content = sanitizeMoveWorthLinks(parsed3.content, true);
  return parsed3;
}

async function updateCountryCountText() {
  const { count } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .like("slug", "visa-%");

  if (!count) return;
  const displayCount = Math.floor(count / 10) * 10;

  const FILES_JA = [
    "src/messages/ja.json",
    "src/app/layout.tsx",
    "src/app/simulate/layout.tsx",
    "src/app/study-site/page.tsx",
    "src/app/study-site/[country]/page.tsx",
  ];
  const FILES_EN = ["src/messages/en.json"];
  const FILES_ZH = ["src/messages/zh.json"];

  // Determine the current and new text patterns
  const patterns: Array<{ files: string[]; oldPattern: RegExp; newText: string }> = [
    {
      files: FILES_JA,
      oldPattern: /\d+カ国以上/g,
      newText: `${displayCount}カ国以上`,
    },
    {
      files: FILES_EN,
      oldPattern: /\d+\+\s*Countries/gi,
      newText: `${displayCount}+ Countries`,
    },
    {
      files: FILES_EN,
      oldPattern: /\d+\+\s*countries/g,
      newText: `${displayCount}+ countries`,
    },
    {
      files: FILES_ZH,
      oldPattern: /\d+多个国家/g,
      newText: `${displayCount}多个国家`,
    },
  ];

  let updated = false;
  for (const { files, oldPattern, newText } of patterns) {
    for (const filePath of files) {
      if (!existsSync(filePath)) continue;
      const src = readFileSync(filePath, "utf-8");
      const replaced = src.replace(oldPattern, newText);
      if (replaced !== src) {
        writeFileSync(filePath, replaced, "utf-8");
        console.log(`Updated country count in ${filePath} → ${newText}`);
        updated = true;
      }
    }
  }

  if (!updated) {
    console.log(`Country count text already shows ${displayCount}カ国以上 — no changes.`);
  }
}

async function fetchJpyRate(currency: string): Promise<number | null> {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/JPY`);
    if (!res.ok) return null;
    const data = await res.json();
    const ratePerJpy = data.rates?.[currency];
    if (!ratePerJpy) return null;
    return Math.round((1 / ratePerJpy) * 10000) / 10000;
  } catch {
    return null;
  }
}

// --- Task 2: persona auto-seed ---

async function seedPersonasForCountry(
  countryCode: string,
  preset: { referenceRent: number; referenceLivingCost: number; defaultTaxRate: number; defaultInflation: number; currency: string },
  jpPreset: { referenceRent: number; referenceLivingCost: number; defaultTaxRate: number; defaultInflation: number },
  salaries: Record<string, number>,
  jpSalaries: Record<string, number>,
): Promise<void> {
  const rate = await fetchJpyRate(preset.currency);
  if (!rate) {
    console.warn(`⚠️  [persona-seed] 為替レート取得失敗 (${preset.currency}) — スキップ`);
    return;
  }

  const jpItIncome    = jpSalaries["it"]      ?? 9_500_000;
  const jpFinIncome   = jpSalaries["finance"]  ?? 11_000_000;
  const jpEngIncome   = jpItIncome;
  const jpCoupleIncome = Math.round(jpItIncome * 1.5);
  const jpMgrIncome    = Math.round(jpFinIncome * 1.5);

  const engIncome    = salaries["it"]!;
  const coupleIncome = Math.round(salaries["it"]! * 1.5);
  const mgrIncome    = Math.round(salaries["finance"]! * 1.5);

  function makeInput(jpIncome: number, targetIncome: number, jpSavings: number, rentMult = 1, livingMult = 1) {
    return {
      countryFrom: "JP",
      countryTo: countryCode.toUpperCase(),
      incomeCurrent: jpIncome,
      incomeTarget: targetIncome,
      currencyCurrent: "JPY",
      currencyTarget: preset.currency,
      salaryGrowthRate: 0.02,
      currentSavings: jpSavings,
      savingsCurrency: "JPY",
      rentCurrent: jpPreset.referenceRent,
      livingCostCurrent: jpPreset.referenceLivingCost,
      rentTarget: Math.round(preset.referenceRent * rentMult),
      livingCostTarget: Math.round(preset.referenceLivingCost * livingMult),
      taxRateCurrent: jpPreset.defaultTaxRate,
      taxRateTarget: preset.defaultTaxRate,
      exchangeRate: rate,
      inflationCurrent: jpPreset.defaultInflation,
      inflationTarget: preset.defaultInflation,
      investmentReturn: 0.05,
      simulationYears: 10,
    };
  }

  const personas = [
    {
      country_code: countryCode.toUpperCase(),
      attribute: "30代エンジニア・単身",
      annual_income_jpy: jpEngIncome,
      family_type: "単身",
      goal: "資産形成",
      simulation_input: makeInput(jpEngIncome, engIncome, 3_000_000),
    },
    {
      country_code: countryCode.toUpperCase(),
      attribute: "30代夫婦・共働き",
      annual_income_jpy: jpCoupleIncome,
      family_type: "夫婦",
      goal: "資産形成",
      simulation_input: makeInput(jpCoupleIncome, coupleIncome, 5_000_000, 1.2),
    },
    {
      country_code: countryCode.toUpperCase(),
      attribute: "40代管理職・夫婦",
      annual_income_jpy: jpMgrIncome,
      family_type: "夫婦",
      goal: "FIRE",
      simulation_input: makeInput(jpMgrIncome, mgrIncome, 10_000_000, 1.2, 1.3),
    },
  ];

  // 既存ペルソナを確認し、同国×属性が既にある属性はスキップ
  const { data: existing } = await supabase
    .from("simulator_personas")
    .select("attribute")
    .eq("country_code", countryCode.toUpperCase());

  const existingAttrs = new Set((existing ?? []).map((r: { attribute: string }) => r.attribute));
  const newPersonas = personas.filter(p => !existingAttrs.has(p.attribute));

  if (newPersonas.length === 0) {
    console.log(`⏭️  [persona-seed] ${countryCode.toUpperCase()} — 全属性既存のためスキップ`);
    return;
  }
  if (newPersonas.length < personas.length) {
    const skipped = personas.filter(p => existingAttrs.has(p.attribute)).map(p => p.attribute);
    console.log(`⚠️  [persona-seed] ${countryCode.toUpperCase()} — ${skipped.join(", ")} は既存のためスキップ`);
  }

  const { error } = await supabase
    .from("simulator_personas")
    .insert(newPersonas);

  if (error) {
    console.warn(`⚠️  [persona-seed] insert 失敗: ${error.message}`);
  } else {
    console.log(`✅ [persona-seed] ${countryCode.toUpperCase()} — ${newPersonas.length}件 insert 完了`);
  }
}

async function updateExchangeRate(currency: string, code: string): Promise<void> {
  const SIMULATE_PAGE = "src/app/study-site/simulate/page.tsx";
  if (!existsSync(SIMULATE_PAGE)) return;

  const src = readFileSync(SIMULATE_PAGE, "utf-8");

  // すでに登録済みならスキップ
  if (new RegExp(`\\b${currency}:\\s*[\\d.]+`).test(src)) {
    console.log(`Exchange rate for ${currency} already exists — skipping.`);
    return;
  }

  const rate = await fetchJpyRate(currency);
  if (!rate) {
    console.warn(`⚠️  Could not fetch rate for ${currency}`);
    return;
  }

  // toJPY の最後の行の前に挿入
  const updated = src.replace(
    /(\/\/ 新興国・インフレ国[^\n]*\n)([\s\S]*?)(^};)/m,
    (_, comment, existing, closing) => {
      const newLine = `  ${currency}: ${rate},    // ${code.toUpperCase()} (auto-fetched)\n`;
      return `${comment}${existing}${newLine}${closing}`;
    }
  );

  if (updated === src) {
    // フォールバック：toJPY ブロックの末尾に追記
    const fallback = src.replace(
      /(\bconst toJPY[^{]*\{[\s\S]*?)(^};)/m,
      (_, block, closing) => `${block}  ${currency}: ${rate},\n${closing}`
    );
    writeFileSync(SIMULATE_PAGE, fallback, "utf-8");
  } else {
    writeFileSync(SIMULATE_PAGE, updated, "utf-8");
  }

  console.log(`✅ Added exchange rate: ${currency} = ${rate} JPY`);
}

// 参考資料セクションの先頭（--- セパレータ含む）より前の本文のみを返す。
// "---\n\n### 参考資料" 形式（新フォーマット）と "### 参考資料" 形式（旧フォーマット）の両方に対応。
function stripExistingRefSection(content: string): string {
  const re = /\n(?:---\n\n)?###\s*(?:参考資料|References|参考资料)/;
  const m = content.match(re);
  return m ? content.slice(0, m.index!) : content;
}

// factCheckContent はテキスト全体を返すため参考資料セクションが失われることがある。
// ソース有りの場合は country_sources の refs を factCheck 後に確実に再追加する。
function restoreRefs(content: string, refs: string | undefined, lang: Lang): string {
  if (!refs) return content;
  const stripped = stripExistingRefSection(content);
  const headings: Record<Lang, string> = {
    ja: "### 参考資料\n本記事の情報は以下の公式資料をもとに作成しています。",
    en: "### References\nData sourced from official government and immigration authority pages.",
    zh: "### 参考资料\n本文信息来源于以下官方资料。",
  };
  return stripped.trimEnd() + `\n\n---\n\n${headings[lang]}\n${refs}`;
}

async function run() {
  const country = await getNextCountry();
  const visaSlug = `visa-${country.code}`;

  // --publish-only: 再生成なし、フラグ切り替えのみ
  if (publishOnly) {
    const { data: existing, error: fetchErr } = await supabase
      .from("blog_posts").select("is_published").eq("slug", visaSlug).maybeSingle();
    if (fetchErr) { console.error("DB error:", fetchErr.message); process.exit(1); }
    if (!existing) {
      console.error(`❌ ${visaSlug} が見つかりません。先に generate を実行してください。`);
      process.exit(1);
    }
    if (existing.is_published) {
      console.log(`ℹ️  ${visaSlug} はすでに公開済みです。`);
      return;
    }
    const { error: updateErr } = await supabase
      .from("blog_posts").update({ is_published: true }).eq("slug", visaSlug);
    if (updateErr) { console.error("Update error:", updateErr.message); process.exit(1); }
    console.log(`✅ ${visaSlug} → is_published: true（フラグ切り替えのみ、再生成なし）`);

    // study 記事も同時に公開（study-{code} と study-country-{code}）
    for (const studySlugTmp of [`study-${country.code}`, `study-country-${country.code}`]) {
      const { error: studyPubErr } = await supabase
        .from("study_blog_posts")
        .update({ is_published: true })
        .eq("slug", studySlugTmp);
      if (studyPubErr) {
        console.error(`  ❌ ${studySlugTmp}: ${studyPubErr.message}`);
      } else {
        console.log(`  ✅ ${studySlugTmp} → is_published: true`);
      }
    }
    return;
  }

  // 既存公開記事ガード: 公開中の visa 記事は上書きしない
  // --force-regenerate 時は通過（ただし成功時のみ上書き、FALLBACK は保存スキップ）
  let existingIsPublished = false;
  let existingPublishedAt: string | null = null;
  {
    const { data: existingVisa } = await supabase
      .from("blog_posts").select("is_published,published_at").eq("slug", visaSlug).maybeSingle();
    existingIsPublished = existingVisa?.is_published ?? false;
    existingPublishedAt = existingVisa?.published_at ?? null;
    if (existingVisa?.is_published && !forceRegen) {
      console.warn(`⚠️  ${visaSlug} は現在公開中のためスキップします。`);
      console.warn(`   再生成するには: npx tsx generate-country-article.ts ${country.code} --force-regenerate`);
      console.warn(`   公開のみ切り替える場合: npx tsx generate-country-article.ts ${country.code} --publish-only`);
      process.exit(0);
    }
    if (existingVisa?.is_published && forceRegen) {
      console.log(`ℹ️  [force-regenerate] ${visaSlug} は公開中。生成成功時のみコンテンツを更新し is_published を保持します。`);
    }
  }

  console.log(`Generating articles for: ${country.name.en} (${country.code})`);

  // --- Task 4: source grounding ---
  console.log("Fetching country_sources for source-grounded generation...");
  const visaSources = await getCountrySources(country.code, "visa");
  let visaSourceCtx: SourceContext | undefined;
  // 正のフロー: sources 登録 → 検証 → 記事生成。未登録は異常系（is_published=false）
  let isVisaGrounded = false;

  if (visaSources.length > 0) {
    visaSourceCtx = await buildSourceContext(visaSources);
    if (visaSourceCtx.isGrounded) {
      isVisaGrounded = true;
      console.log(`✅ Source context built from ${visaSources.length} URLs`);
    } else {
      console.log(`⚠️  All ${visaSources.length} source URLs returned SPA/unusable content — fallback mode`);
    }
  } else {
    console.log(`⚠️  No alive sources in country_sources — knowledge-based fallback (should not occur in normal flow)`);
  }

  // --- Tax source grounding ---
  let taxSourceCtx: SourceContext | undefined;
  const taxSources = await getCountrySources(country.code, "tax");
  if (taxSources.length > 0) {
    const ctx = await buildSourceContext(taxSources, isTaxSourceUseful, TAX_MAX_CHARS_PER_SOURCE);
    if (ctx.isGrounded) {
      // "16c for each $1 over $18,200" → "16% (16c for each $1 over $18,200)"
      // ATO のセント表記を事前に%へ変換してから GPT に渡す
      ctx.text = ctx.text.replace(
        /(\d+(?:\.\d+)?)c for each \$1/g,
        (match, n) => `${n}% (${match})`
      );
      // ATO ページは複数年度掲載のため、最新年度（FY2025-26）のセクションのみを抽出
      // "Resident tax rates 2025–26" が存在する場合は次の年度セクション開始前まで切り出す
      const latestYearMatch = ctx.text.match(
        /Resident tax rates 2025[\s\S]*?(?=Resident tax rates 20(?!26)|Non-resident tax rates|\[FY|$)/
      );
      if (latestYearMatch) {
        ctx.text = `[FY2025-26 resident tax rates from ATO source]\n${latestYearMatch[0]}`;
        console.log(`  [tax-preprocess] ATO: extracted FY2025-26 section (${ctx.text.length} chars)`);
      }
      taxSourceCtx = ctx;
      console.log(`✅ Tax source context built from ${taxSources.length} URLs`);
    } else {
      console.log(`⚠️  Tax sources present (${taxSources.length}) but all SPA/unusable — tax section uses fallback instruction`);
    }
  } else {
    console.log(`ℹ️  No tax sources registered for ${country.code} — tax section uses fallback instruction`);
  }

  // --- Visa article (ja/en/zh) ---
  console.log("Generating visa article in 3 languages...");
  const [visaJa, visaEn, visaZh] = await Promise.all([
    generateVisaContent(country.name, "ja", visaSourceCtx, country.code, taxSourceCtx),
    generateVisaContent(country.name, "en", visaSourceCtx, country.code, taxSourceCtx),
    generateVisaContent(country.name, "zh", visaSourceCtx, country.code, taxSourceCtx),
  ]);

  // Fact-check pass 1（ソース有りの場合は原文照合、なしの場合は知識ベース）
  // taxSourceCtx がある場合は tax-grounded データを knowledge-base fact-check で破壊しないよう
  // visaSource と taxSource を結合してソース照合モードで実行する
  const sourceText = visaSourceCtx?.text ?? (taxSourceCtx ? taxSourceCtx.text : undefined);
  console.log("Fact-checking visa article (pass 1)...");
  const [checked1Ja, checked1En, checked1Zh] = await Promise.all([
    factCheckContent(visaJa.content, country.name.ja, "ja", sourceText),
    factCheckContent(visaEn.content, country.name.en, "en", sourceText),
    factCheckContent(visaZh.content, country.name.en, "zh", sourceText),
  ]);

  // Fact-check pass 2:
  // source-grounded 成功時 OR tax-grounded 有り時はスキップ
  // （モデルの旧訓練データが税率等のソース根拠数値を上書きするのを防ぐ）
  let fcJa2: string, fcEn2: string, fcZh2: string;
  if (isVisaGrounded || !!taxSourceCtx) {
    console.log(`Skipping fact-check pass 2 (${isVisaGrounded ? "visa-grounded" : "tax-grounded"} — pass 1 is authoritative)`);
    [fcJa2, fcEn2, fcZh2] = [checked1Ja, checked1En, checked1Zh];
  } else {
    console.log("Fact-checking visa article (pass 2)...");
    [fcJa2, fcEn2, fcZh2] = await Promise.all([
      factCheckContent(checked1Ja, country.name.ja, "ja"),
      factCheckContent(checked1En, country.name.en, "en"),
      factCheckContent(checked1Zh, country.name.en, "zh"),
    ]);
  }

  // factCheck 後に参考文献セクションを復元（factCheck でテキスト全体が返るため削除されることがある）
  const visaRefs = visaSourceCtx?.refs;
  const finalJa = restoreRefs(fcJa2, visaRefs, "ja");
  const finalEn = restoreRefs(fcEn2, visaRefs, "en");
  const finalZh = restoreRefs(fcZh2, visaRefs, "zh");

  const today = new Date().toISOString().split("T")[0];

  // public/images/blog/ に同名画像があれば自動設定
  const thumbExts = [".webp", ".png", ".jpg"];
  const thumbnail = thumbExts
    .map((ext) => `/images/blog/${visaSlug}${ext}`)
    .find((p) => existsSync(`public${p}`)) ?? null;

  // fallback 時の警告
  if (!isVisaGrounded) {
    console.warn(`⚠️  [FALLBACK] ${visaSlug}: source-grounded失敗 → is_published=false で保存`);
    console.log(`::warning file=scripts/generate-country-article.ts::${visaSlug} fallback使用 — source-groundedコンテンツ取得不可。is_published=false で保存。手動確認が必要です。`);
  }

  // プレースホルダー URL チェック（example.com が含まれていれば is_published を強制 false にして警告）
  const hasPlaceholderUrl = [finalJa, finalEn, finalZh].some((c) => c.includes("example.com"));
  if (hasPlaceholderUrl) {
    console.error(`❌ [PLACEHOLDER-URL] ${visaSlug}: "example.com" が生成コンテンツに含まれています — is_published=false に強制`);
    isVisaGrounded = false;
  }

  // 生成は常に draft 保存（is_published=false）。
  // --force-regenerate + 既存公開中 + grounded成功 の場合のみ is_published=true を保持。
  // --force-regenerate + 既存公開中 + FALLBACK の場合は保存スキップ（既存コンテンツ保護）。
  const shouldPublish = forceRegen && existingIsPublished && isVisaGrounded;
  // published_at: force-regen で公開中記事の場合は既存日付を保持（再生成で日付がリセットされない）
  const upsertPublishedAt = (forceRegen && existingIsPublished && existingPublishedAt)
    ? existingPublishedAt
    : today;

  if (isVisaGrounded) {
    console.log(`📝 ${visaSlug}: source-grounded成功 → ${shouldPublish ? "公開状態を維持して" : "draft"} 保存`);
  }

  // force-regen で既存公開中かつ FALLBACK → 既存コンテンツを保護して保存スキップ
  if (forceRegen && existingIsPublished && !isVisaGrounded) {
    console.warn(`⚠️  [force-regenerate SKIP] ${visaSlug}: FALLBACK生成のため既存公開コンテンツを保護します。保存をスキップ。`);
    console.warn(`   ソースURL登録後に再試行してください。`);
  } else {
  assertBlogPayload(
    { title: { ja: visaJa.title, en: visaEn.title, zh: visaZh.title },
      description: { ja: visaJa.description, en: visaEn.description, zh: visaZh.description },
      content: { ja: finalJa, en: finalEn, zh: finalZh } },
    visaSlug
  );

  const { error: visaError } = await supabase.from("blog_posts").upsert({
    slug: visaSlug,
    category: "visa",
    published_at: upsertPublishedAt,
    reading_minutes: 12,
    // thumbnail が null（ローカルファイルなし）の場合はカラムを含めない → 既存 Storage URL を保護
    ...(thumbnail !== null ? { thumbnail } : {}),
    title: { ja: visaJa.title, en: visaEn.title, zh: visaZh.title },
    description: {
      ja: visaJa.description,
      en: visaEn.description,
      zh: visaZh.description,
    },
    content: { ja: finalJa, en: finalEn, zh: finalZh },
    locales: null,
    pinned: false,
    is_published: shouldPublish,
  }, { onConflict: "slug" });

  if (visaError) {
    console.error("Visa article insert failed:", visaError.message);
    process.exit(1);
  }
  console.log(shouldPublish ? `✅ Visa article published: ${visaSlug}` : `📝 Visa article saved as draft: ${visaSlug}`);
  } // end: force-regen FALLBACK skip guard else

  // --- Study article (ja/en) ---
  // study-work-{code} が既に存在する国では study-{code} を生成しない（重複・SEO共食い防止）
  const { data: existingWorkArticle } = await supabase
    .from("study_blog_posts")
    .select("slug")
    .eq("slug", `study-work-${country.code}`)
    .maybeSingle();
  if (existingWorkArticle) {
    console.log(`⏭️  study-${country.code}: study-work-${country.code} が既存のためスキップ（重複防止）`);
    // study-country-{code} は独立コンテンツのため引き続き生成する
  } else {
  console.log("Generating study article...");
  const [studyJa, studyEn] = await Promise.all([
    generateStudyContent(country.name, "ja"),
    generateStudyContent(country.name, "en"),
  ]);

  // Fact-check study article (2 passes)
  console.log("Fact-checking study article (pass 1)...");
  const [studyChecked1Ja, studyChecked1En] = await Promise.all([
    factCheckContent(studyJa.content, country.name.ja, "ja"),
    factCheckContent(studyEn.content, country.name.en, "en"),
  ]);

  console.log("Fact-checking study article (pass 2)...");
  const [studyFinalJa, studyFinalEn] = await Promise.all([
    factCheckContent(studyChecked1Ja, country.name.ja, "ja"),
    factCheckContent(studyChecked1En, country.name.en, "en"),
  ]);

  const studySlug = `study-${country.code}`;

  // example.com プレースホルダー URL チェック（visa 側の L1626-1631 相当）
  // プロンプトテンプレートに "official-url.example.com" の例示があるため GPT が模倣するリスクがある
  const studyHasPlaceholder = [studyFinalJa, studyFinalEn].some((c) => c.includes("example.com"));
  if (studyHasPlaceholder) {
    console.error(`❌ [PLACEHOLDER-URL] ${studySlug}: "example.com" が生成コンテンツに含まれています — is_published=false に強制`);
  }

  assertBlogPayload(
    { title: { ja: studyJa.title, en: studyEn.title },
      description: { ja: studyJa.description, en: studyEn.description },
      content: { ja: studyFinalJa, en: studyFinalEn },
      locales: ["ja", "en"] },
    studySlug
  );

  const { error: studyError } = await supabase.from("study_blog_posts").upsert({
    slug: studySlug,
    category: "work",
    date: today,
    reading_time: 8,
    title: { ja: studyJa.title, en: studyEn.title },
    description: { ja: studyJa.description, en: studyEn.description },
    content: { ja: studyFinalJa, en: studyFinalEn },
    is_published: false, // デフォルト draft。公開は --publish-only で手動承認
  }, { onConflict: "slug" });

  if (studyError) {
    console.error("Study work article insert failed:", studyError.message);
  } else {
    console.log(`📝 Study work article saved as draft: ${studySlug}${studyHasPlaceholder ? " [PLACEHOLDER-URL detected]" : ""}`);
  }
  } // end: study-work-{code} 重複防止ガード else

  // --- Country guide article (study-country-{code}) ---
  console.log("Generating country guide article...");
  const [guideJa, guideEn] = await Promise.all([
    generateCountryGuideContent(country.name, "ja"),
    generateCountryGuideContent(country.name, "en"),
  ]);

  const countryGuideSlug = `study-country-${country.code}`;

  const guideHasPlaceholder = [guideJa.content, guideEn.content].some((c) => c.includes("example.com"));
  if (guideHasPlaceholder) {
    console.error(`❌ [PLACEHOLDER-URL] ${countryGuideSlug}: "example.com" が生成コンテンツに含まれています — is_published=false に強制`);
  }

  assertBlogPayload(
    { title: { ja: guideJa.title, en: guideEn.title },
      description: { ja: guideJa.description, en: guideEn.description },
      content: { ja: guideJa.content, en: guideEn.content },
      locales: ["ja", "en"] },
    countryGuideSlug
  );

  const { error: guideError } = await supabase.from("study_blog_posts").upsert({
    slug: countryGuideSlug,
    category: "country",
    date: today,
    reading_time: 7,
    title: { ja: guideJa.title, en: guideEn.title },
    description: { ja: guideJa.description, en: guideEn.description },
    content: { ja: guideJa.content, en: guideEn.content },
    is_published: false, // デフォルト draft。公開は --publish-only で手動承認
  }, { onConflict: "slug" });

  if (guideError) {
    console.error("Country guide article insert failed:", guideError.message);
  } else {
    console.log(`📝 Country guide article saved as draft: ${countryGuideSlug}${guideHasPlaceholder ? " [PLACEHOLDER-URL detected]" : ""}`);
  }

  // --- Update country count text ---
  await updateCountryCountText();

  // --- Add exchange rate for new country's currency if not in toJPY ---
  const { countryPresets } = await import("../src/data/country-presets.js").catch(
    () => import("../src/data/country-presets")
  );
  const countryPresetsArr = countryPresets as Array<{
    code: string; currency: string;
    referenceRent: number; referenceLivingCost: number;
    defaultTaxRate: number; defaultInflation: number;
  }>;
  const preset = countryPresetsArr.find((p) => p.code.toLowerCase() === country.code.toLowerCase());
  if (preset?.currency) {
    await updateExchangeRate(preset.currency, country.code);
  }

  // --- Task 2: persona auto-seed ---
  const { INDUSTRY_SALARIES } = await import("../src/data/industry-salaries.js").catch(
    () => import("../src/data/industry-salaries")
  );
  const salariesTyped = INDUSTRY_SALARIES as Record<string, Record<string, number>>;
  const countrySalaries = salariesTyped[country.code.toUpperCase()];
  const jpPresetData = countryPresetsArr.find((p) => p.code === "JP");

  if (!countrySalaries) {
    console.warn(`⚠️  [persona-seed] ${country.code.toUpperCase()} が industry-salaries.ts に未登録 — ペルソナ seed をスキップ`);
  } else if (!preset) {
    console.warn(`⚠️  [persona-seed] ${country.code.toUpperCase()} が country-presets.ts に未登録 — ペルソナ seed をスキップ`);
  } else if (!jpPresetData) {
    console.warn(`⚠️  [persona-seed] JP preset が見つからない — ペルソナ seed をスキップ`);
  } else {
    await seedPersonasForCountry(
      country.code,
      preset,
      jpPresetData,
      countrySalaries,
      salariesTyped["JP"] ?? {},
    );
  }
}

run();

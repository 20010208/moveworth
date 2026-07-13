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

type SourceRow = { url: string; purpose: string };

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
  "canada.ca": "カナダ歳入庁（CRA）",
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
};

function urlToLabel(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return DOMAIN_LABEL_MAP[hostname] ?? DOMAIN_LABEL_MAP[`www.${hostname}`] ?? hostname;
  } catch {
    return url;
  }
}

async function getCountrySources(
  countryCode: string,
  purpose: "visa" | "study" | "tax"
): Promise<SourceRow[]> {
  try {
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

// Countries in priority order: fixed first 2, then popular destinations
const COUNTRY_QUEUE = [
  { code: "nz", name: { ja: "ニュージーランド", en: "New Zealand" } },
  { code: "be", name: { ja: "ベルギー", en: "Belgium" } },
  { code: "tn", name: { ja: "チュニジア", en: "Tunisia" } },
  { code: "pl", name: { ja: "ポーランド", en: "Poland" } },
  { code: "ee", name: { ja: "エストニア", en: "Estonia" } },
  { code: "cy", name: { ja: "キプロス", en: "Cyprus" } },
  { code: "hr", name: { ja: "クロアチア", en: "Croatia" } },
  { code: "hu", name: { ja: "ハンガリー", en: "Hungary" } },
  { code: "ro", name: { ja: "ルーマニア", en: "Romania" } },
  { code: "bg", name: { ja: "ブルガリア", en: "Bulgaria" } },
  { code: "rs", name: { ja: "セルビア", en: "Serbia" } },
  { code: "me", name: { ja: "モンテネグロ", en: "Montenegro" } },
  { code: "sk", name: { ja: "スロバキア", en: "Slovakia" } },
  { code: "si", name: { ja: "スロベニア", en: "Slovenia" } },
  { code: "lv", name: { ja: "ラトビア", en: "Latvia" } },
  { code: "lt", name: { ja: "リトアニア", en: "Lithuania" } },
  { code: "ma", name: { ja: "モロッコ", en: "Morocco" } },
  { code: "mu", name: { ja: "モーリシャス", en: "Mauritius" } },
  { code: "ke", name: { ja: "ケニア", en: "Kenya" } },
  { code: "cl", name: { ja: "チリ", en: "Chile" } },
  { code: "pe", name: { ja: "ペルー", en: "Peru" } },
  { code: "uy", name: { ja: "ウルグアイ", en: "Uruguay" } },
  { code: "ec", name: { ja: "エクアドル", en: "Ecuador" } },
  { code: "lk", name: { ja: "スリランカ", en: "Sri Lanka" } },
  { code: "kh", name: { ja: "カンボジア", en: "Cambodia" } },
  { code: "la", name: { ja: "ラオス", en: "Laos" } },
  { code: "np", name: { ja: "ネパール", en: "Nepal" } },
  { code: "jo", name: { ja: "ヨルダン", en: "Jordan" } },
  { code: "gh", name: { ja: "ガーナ", en: "Ghana" } },
  { code: "al", name: { ja: "アルバニア", en: "Albania" } },
  { code: "mk", name: { ja: "北マケドニア", en: "North Macedonia" } },
  { code: "my", name: { ja: "マレーシア", en: "Malaysia" } },
  { code: "th", name: { ja: "タイ", en: "Thailand" } },
  { code: "au", name: { ja: "オーストラリア", en: "Australia" } },
  { code: "us", name: { ja: "アメリカ", en: "United States" } },
  { code: "sg", name: { ja: "シンガポール", en: "Singapore" } },
  { code: "gb", name: { ja: "イギリス", en: "United Kingdom" } },
  // バッチ2
  { code: "nl", name: { ja: "オランダ", en: "Netherlands" } },
  { code: "fr", name: { ja: "フランス", en: "France" } },
  { code: "it", name: { ja: "イタリア", en: "Italy" } },
  { code: "at", name: { ja: "オーストリア", en: "Austria" } },
  { code: "ie", name: { ja: "アイルランド", en: "Ireland" } },
  { code: "ca", name: { ja: "カナダ", en: "Canada" } },
  { code: "kr", name: { ja: "韓国", en: "South Korea" } },
  // バッチ3
  { code: "se", name: { ja: "スウェーデン", en: "Sweden" } },
  { code: "no", name: { ja: "ノルウェー", en: "Norway" } },
  { code: "dk", name: { ja: "デンマーク", en: "Denmark" } },
  { code: "cz", name: { ja: "チェコ", en: "Czech Republic" } },
  { code: "gr", name: { ja: "ギリシャ", en: "Greece" } },
  { code: "mt", name: { ja: "マルタ", en: "Malta" } },
  { code: "ae", name: { ja: "アラブ首長国連邦", en: "United Arab Emirates" } },
];

type Lang = "ja" | "en" | "zh";

// CLI 引数:
//   npx tsx generate-country-article.ts [country_code]
//     → 生成して draft 保存（is_published=false）。既存公開記事は上書きしない。
//   npx tsx generate-country-article.ts [country_code] --publish-only
//     → 再生成なし。既存 draft の is_published を true に切り替えるだけ。
//   ※ --publish（再生成して公開）は廃止。レビューした内容と公開内容の同一性を保証するため。
const _args = process.argv.slice(2);
const forceCountryCode = _args.find((a) => !a.startsWith("--")) ?? null;
const publishOnly = _args.includes("--publish-only");

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
  const taxExtraConstraint = (hasTaxSource && countryCode)
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
      : "ただし所得税率・税率閾値などの税制情報は参考資料に具体的な数字の記載がある場合のみ書くこと。参考資料にない場合は「最新の税制は移住先国の税務当局または公式情報でご確認ください」と案内するにとどめること。",
    en: hasTaxSource
      ? `Income tax rates and brackets: use ONLY the figures from the tax reference source. For any tax items not covered in the tax source, write 'For current tax rates, please refer to the official tax authority of ${countryName.en}'. ${centToPercentNote.en}${taxExtraConstraint ? `\n${taxExtraConstraint}` : ""}`
      : "For income tax rates and tax bracket thresholds: only write specific figures if they appear in the reference sources. If not sourced, write 'For current tax rates, please refer to the official tax authority of the destination country' instead of guessing figures.",
    zh: hasTaxSource
      ? `所得税率、税率区间：仅使用税制参考资料中的数字。税制参考资料未涉及的税务项目，请引导至「请参阅${countryName.en}税务机关的官方信息」。${centToPercentNote.zh}${taxExtraConstraint ? `\n${taxExtraConstraint}` : ""}`
      : "但所得税率、税率区间等税制信息，只有在参考资料中有明确数字时才可填写；若无来源，请改为「有关当前税率，请参阅目的国税务机关的官方信息」。",
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
  if (hasSource && prebuiltRefs) {
    const refHeadings: Record<Lang, string> = {
      ja: "### 参考資料\n本記事の情報は以下の公式資料をもとに作成しています。",
      en: "### References\nData sourced from official government and immigration authority pages.",
      zh: "### 参考资料\n本文信息来源于以下官方资料。",
    };
    parsed1.content = parsed1.content.trimEnd() + `\n\n---\n\n${refHeadings[lang]}\n${prebuiltRefs}`;
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

  const { error } = await supabase
    .from("simulator_personas")
    .insert(personas);

  if (error) {
    console.warn(`⚠️  [persona-seed] insert 失敗: ${error.message}`);
  } else {
    console.log(`✅ [persona-seed] ${countryCode.toUpperCase()} — 3件 insert 完了`);
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

// factCheckContent はテキスト全体を返すため参考資料セクションが失われることがある。
// ソース有りの場合は country_sources の refs を factCheck 後に確実に再追加する。
function restoreRefs(content: string, refs: string | undefined, lang: Lang): string {
  if (!refs) return content;
  const stripped = content.replace(/\n\n---\n\n###\s*(参考資料|References|参考资料)[\s\S]*$/, "");
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
    return;
  }

  // 既存公開記事ガード: 公開中の visa 記事は上書きしない
  {
    const { data: existingVisa } = await supabase
      .from("blog_posts").select("is_published").eq("slug", visaSlug).maybeSingle();
    if (existingVisa?.is_published) {
      console.warn(`⚠️  ${visaSlug} は現在公開中のためスキップします。`);
      console.warn(`   再生成するには、先に Supabase で is_published=false にしてから実行してください。`);
      console.warn(`   公開のみ切り替える場合: npx tsx generate-country-article.ts ${country.code} --publish-only`);
      process.exit(0);
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
  // 公開は --publish-only（フラグ切り替えのみ）で別途実行する。
  const shouldPublish = false;
  if (isVisaGrounded) {
    console.log(`📝 ${visaSlug}: source-grounded成功 → draft 保存`);
  }

  assertBlogPayload(
    { title: { ja: visaJa.title, en: visaEn.title, zh: visaZh.title },
      description: { ja: visaJa.description, en: visaEn.description, zh: visaZh.description },
      content: { ja: finalJa, en: finalEn, zh: finalZh } },
    visaSlug
  );

  const { error: visaError } = await supabase.from("blog_posts").upsert({
    slug: visaSlug,
    category: "visa",
    published_at: today,
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

  // --- Study article (ja/en) ---
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

  const { error: studyError } = await supabase.from("study_blog_posts").upsert({
    slug: studySlug,
    category: "work",
    date: today,
    reading_time: 8,
    title: { ja: studyJa.title, en: studyEn.title },
    description: { ja: studyJa.description, en: studyEn.description },
    content: { ja: studyFinalJa, en: studyFinalEn },
    is_published: true,
  }, { onConflict: "slug" });

  if (studyError) {
    console.error("Study work article insert failed:", studyError.message);
  } else {
    console.log(`✅ Study work article published: ${studySlug}`);
  }

  // --- Country guide article (study-country-{code}) ---
  console.log("Generating country guide article...");
  const [guideJa, guideEn] = await Promise.all([
    generateCountryGuideContent(country.name, "ja"),
    generateCountryGuideContent(country.name, "en"),
  ]);

  const countryGuideSlug = `study-country-${country.code}`;

  const { error: guideError } = await supabase.from("study_blog_posts").upsert({
    slug: countryGuideSlug,
    category: "country",
    date: today,
    reading_time: 7,
    title: { ja: guideJa.title, en: guideEn.title },
    description: { ja: guideJa.description, en: guideEn.description },
    content: { ja: guideJa.content, en: guideEn.content },
    is_published: true,
  }, { onConflict: "slug" });

  if (guideError) {
    console.error("Country guide article insert failed:", guideError.message);
  } else {
    console.log(`✅ Country guide article published: ${countryGuideSlug}`);
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

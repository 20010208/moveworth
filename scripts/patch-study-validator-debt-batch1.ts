/**
 * BL-20260809-02（Published Study validator debt）Batch 1 の安全なcontent target patch。
 *
 * 対象: study_blog_posts.content の参考資料URLのみ。他の全列（id/slug/category/date/
 * reading_time/title/description/is_published/created_at/thumbnail系/scheduled_publish_at）は
 * 一切変更しない。study_blog_postsには updated_at 相当のserver-managed列は存在しない
 * （2026-08-09 実SELECTでcolumn一覧を確認済み: id, slug, category, date, reading_time,
 * title, description, content, is_published, created_at, thumbnail, thumbnail_ja/en/zh,
 * scheduled_publish_at の15列のみ）。CASのUPDATEはcontent列だけをSETするため、
 * それ以外の列はDB側でも物理的に変化しない設計だが、post-update検証では念のため
 * 全列（content以外）のdeep-equalで確認する。
 *
 * 安全設計:
 *   - 宣言的PATCH_PLANに操作を列挙（コード内でad-hocに文字列置換しない）
 *   - occurrence guardは「物理URL token数」で判定する（Setによる重複排除後の件数では
 *     判定しない。同一URLが参考資料section内に物理的に2回存在する場合、重複排除後は
 *     1件に見えてしまい "exactly 1" と誤判定するため、重複を保持したtoken配列を使う）
 *   - 判定は対象languageの参考資料section内のみ（本文中の同一URLは無視する）
 *   - newUrl側は、既存validatorと同じ正規化（normalizeUrl）でnormalized-equivalentな
 *     重複も検出する
 *   - DRY_RUNがデフォルト。実際のDB UPDATEには `--apply` に加え、
 *     環境変数 `ALLOW_PRODUCTION_STUDY_PATCH=1` の両方が必要（二重guard）
 *   - 本番反映は `study_blog_posts_cas_update_content()` RPC（compare-and-swap）経由のみ。
 *     クライアント側read-modify-writeの無条件UPDATEは行わない
 *   - CAS成功後はDB再SELECTし、content の deep-equal・validator PASS・非content列の
 *     不変・言語別planned URL状態（oldUrl消失／newUrl exactly 1／重複なし）を
 *     すべて再確認する（client側simulationだけで完了とみなさない）
 *
 * failure semantics（DRY_RUNとAPPLYで意図的に異なる）:
 *   - DRY_RUN: 14件全体の診断が目的のため、1件の異常があっても残りをcontinueして
 *     診断を続ける（read-onlyで実害がないため）。ただし異常が1件でもあれば
 *     プロセス全体はexit 1とし、「skipしたのでexit 0」にはしない
 *   - APPLY: 公開済み本番記事へのCASを伴うため、いずれかの記事で異常が発生した
 *     時点で即座に処理を停止する（fail-fast）。それ以降のslugは一切処理しない
 *     （not_attempted）。成功済みのCASはrollbackしない。CAS 0行（stale/競合）は
 *     再計算・再試行せずSTOPする
 *   - どちらのモードでも、1記事の処理中に想定外の例外（DB接続エラー等）が発生した
 *     場合はtry/catchで捕捉し、その記事の失敗として扱う（プロセス全体を無警告で
 *     落とさない。summaryが必ず出力される）
 *
 * 使い方:
 *   npx tsx scripts/patch-study-validator-debt-batch1.ts --batch=1a
 *   npx tsx scripts/patch-study-validator-debt-batch1.ts --batch=1b
 *   npx tsx scripts/patch-study-validator-debt-batch1.ts --batch=1a --apply   (要 ALLOW_PRODUCTION_STUDY_PATCH=1)
 */
import { existsSync, readFileSync } from "fs";
import { isDeepStrictEqual } from "node:util";
import { createClient } from "@supabase/supabase-js";
import {
  getApprovedSources,
  validateStudyPublication,
  findRefSection,
  normalizeUrl,
  type Lang,
} from "./utils/study-publication-quality";

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

// ===== CLI引数 =====
const BATCH_ARG = process.argv.find((a) => a.startsWith("--batch="))?.split("=")[1];
const APPLY = process.argv.includes("--apply");

if (BATCH_ARG !== "1a" && BATCH_ARG !== "1b") {
  console.error("使い方: npx tsx scripts/patch-study-validator-debt-batch1.ts --batch=1a|1b [--apply]");
  process.exit(1);
}

if (APPLY && process.env.ALLOW_PRODUCTION_STUDY_PATCH !== "1") {
  console.error("❌ --apply には環境変数 ALLOW_PRODUCTION_STUDY_PATCH=1 が必要です（二重guard）。");
  console.error("   例: ALLOW_PRODUCTION_STUDY_PATCH=1 npx tsx scripts/patch-study-validator-debt-batch1.ts --batch=1a --apply");
  process.exit(1);
}

const DRY_RUN = !APPLY;

// ===== 物理URL token抽出（Setによる重複排除をしない。参考資料section内のみに適用すること） =====
// validator側 extractUrls() と同じ3パターン（markdown link / html link / raw url）を
// 単一の交互(alternation)正規表現にまとめ、1回のexec走査で処理する。
// md-link/html-linkとして一致した範囲はlastIndexが末尾まで進むため、raw-url側の
// 代替パターンが同じ文字列を二重にマッチすることはない（extractUrls()がSetで
// 重複排除に頼っていたのは、素朴に3回別々にスキャンしていたため）。
// start/endを保持することで、置換操作は必ず「該当tokenの実位置」に対して行い、
// 文字列全体に対する indexOf(oldUrl) / replace(oldUrl, newUrl) は使わない
// （oldUrlが別の長いURLのprefixである場合に、誤ってそちらを拾うリスクを排除するため）。
// capture groupの正確な位置は、`d`フラグ（hasIndices）が使えれば最も簡単だが、
// 本repoのtsconfig target=ES2017では`d`フラグが使用不可（TS1501）。
// 代わりに、各代替パターンの構造から算術的に位置を導出する（indexOf(url)による
// 「fullMatch内の再検索」には頼らない。labelテキストが偶然URL文字列を含む場合でも
// 位置がずれない）:
//   - group1 (markdown link `[label](URL)`): fullMatchは必ず `)` で終わり、
//     その直前がURL（m[1]、untrimmed）そのもの
//   - group2 (html link `<a ... href="URL">`): fullMatchは必ずURL直後の閉じ引用符で終わり、
//     その直前がURL（m[2]、untrimmed）そのもの
//   - group3 (raw url): fullMatch自体がURL（m[3]）そのものなので m.index がそのまま開始位置
const URL_TOKEN_RE = /\[[^\]]*\]\((https?:\/\/[^\s)]+)\)|<a\s+[^>]*href=["'](https?:\/\/[^"']+)["']|(https?:\/\/[^\s)"'<>\]]+)/gi;

type UrlToken = { url: string; start: number; end: number };

function extractUrlTokensPhysical(text: string): UrlToken[] {
  if (!text) return [];
  const out: UrlToken[] = [];
  URL_TOKEN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = URL_TOKEN_RE.exec(text)) !== null) {
    const fullMatch = m[0];
    let rawStart: number;
    let raw: string;
    if (m[1] !== undefined) {
      raw = m[1];
      rawStart = m.index + fullMatch.length - 1 - raw.length; // fullMatchは ")" で終わり、その直前がURL
    } else if (m[2] !== undefined) {
      raw = m[2];
      rawStart = m.index + fullMatch.length - 1 - raw.length; // fullMatchは閉じ引用符で終わり、その直前がURL
    } else {
      raw = m[3]!;
      rawStart = m.index; // fullMatch自体がURL
    }
    const trimmed = raw.replace(/[.,;)]+$/, "");
    const start = rawStart;
    const end = start + trimmed.length;
    out.push({ url: trimmed, start, end });
  }
  return out;
}

function countExact(tokens: UrlToken[], target: string): number {
  return tokens.filter((t) => t.url === target).length;
}

function countNormalizedEquivalent(tokens: UrlToken[], target: string): number {
  const nt = normalizeUrl(target);
  return tokens.filter((t) => normalizeUrl(t.url) === nt).length;
}

// ===== 宣言的patch plan（今回は変更しない。BL-20260809-02 Batch1確定plan） =====
type Op =
  | { type: "replace-url"; lang: Lang; oldUrl: string; newUrl: string }
  | { type: "add-line"; lang: Lang; newUrl: string; label: string }
  | { type: "convert-plain-to-link"; lang: Lang; exactLine: string; label: string; newUrl: string };

type ArticlePlan = { slug: string; countryCode: string; ops: Op[] };

const BATCH_1A: ArticlePlan[] = [
  {
    slug: "study-work-me",
    countryCode: "me",
    ops: [{ type: "replace-url", lang: "en", oldUrl: "https://www.gov.me/en/ministry-of-interior", newUrl: "https://www.gov.me/en/mup" }],
  },
  {
    slug: "study-country-gb",
    countryCode: "gb",
    ops: [{ type: "replace-url", lang: "en", oldUrl: "https://www.gov.uk/study-visit-visa", newUrl: "https://www.gov.uk/browse/visas-immigration/student-visas" }],
  },
  {
    slug: "study-country-bg",
    countryCode: "bg",
    ops: [{ type: "replace-url", lang: "en", oldUrl: "https://www.mfa.bg/en/embassies/japan", newUrl: "https://www.mfa.bg/en" }],
  },
  {
    slug: "study-country-de",
    countryCode: "de",
    ops: [{ type: "replace-url", lang: "en", oldUrl: "https://www.auswaertiges-amt.de/en", newUrl: "https://www.auswaertiges-amt.de/en/visa-service" }],
  },
  {
    slug: "study-country-be",
    countryCode: "be",
    ops: [
      { type: "replace-url", lang: "ja", oldUrl: "https://dofi.ibz.be", newUrl: "https://dofi.ibz.be/en" },
      { type: "replace-url", lang: "zh", oldUrl: "https://dofi.ibz.be", newUrl: "https://dofi.ibz.be/en" },
    ],
  },
  {
    slug: "study-country-nl",
    countryCode: "nl",
    ops: [
      { type: "replace-url", lang: "ja", oldUrl: "https://ind.nl", newUrl: "https://ind.nl/en/" },
      { type: "replace-url", lang: "zh", oldUrl: "https://ind.nl", newUrl: "https://ind.nl/en/" },
    ],
  },
  {
    slug: "study-work-nl",
    countryCode: "nl",
    ops: [
      { type: "replace-url", lang: "ja", oldUrl: "https://ind.nl", newUrl: "https://ind.nl/en/" },
      { type: "replace-url", lang: "zh", oldUrl: "https://ind.nl", newUrl: "https://ind.nl/en/" },
    ],
  },
];

const BATCH_1B: ArticlePlan[] = [
  {
    slug: "study-work-co",
    countryCode: "co",
    ops: [
      { type: "convert-plain-to-link", lang: "ja", exactLine: "- コロンビア外務省", label: "コロンビア外務省", newUrl: "https://www.cancilleria.gov.co/" },
      { type: "convert-plain-to-link", lang: "zh", exactLine: "- 哥伦比亚外交部", label: "哥伦比亚外交部", newUrl: "https://www.cancilleria.gov.co/" },
    ],
  },
  {
    slug: "study-work-ph",
    countryCode: "ph",
    ops: [
      { type: "convert-plain-to-link", lang: "ja", exactLine: "- フィリピン移民局 (Bureau of Immigration)", label: "フィリピン移民局 (Bureau of Immigration)", newUrl: "https://immigration.gov.ph/" },
      { type: "convert-plain-to-link", lang: "zh", exactLine: "- 菲律宾移民局 (Bureau of Immigration)", label: "菲律宾移民局 (Bureau of Immigration)", newUrl: "https://immigration.gov.ph/" },
    ],
  },
  {
    slug: "study-country-vn",
    countryCode: "vn",
    ops: (["ja", "en", "zh"] as Lang[]).map((lang) => ({
      type: "replace-url" as const,
      lang,
      oldUrl: "https://xuatnhapcanh.gov.vn",
      newUrl: "https://xuatnhapcanh.gov.vn/en/tin-tuc/procedures-temporary-residence-cards-foreigners-vietnam-immigration-department-ministry",
    })),
  },
  {
    slug: "study-country-at",
    countryCode: "at",
    ops: [
      { type: "replace-url", lang: "en", oldUrl: "https://www.migration.gv.at", newUrl: "https://www.migration.gv.at/en/" },
      { type: "add-line", lang: "ja", newUrl: "https://www.migration.gv.at/en/", label: "オーストリア移民局（公式)" },
      { type: "add-line", lang: "zh", newUrl: "https://www.migration.gv.at/en/", label: "奥地利移民局（官方）" },
    ],
  },
  {
    slug: "study-work-at",
    countryCode: "at",
    ops: [
      { type: "replace-url", lang: "ja", oldUrl: "https://www.migration.gv.at", newUrl: "https://www.migration.gv.at/en/" },
      { type: "replace-url", lang: "zh", oldUrl: "https://www.migration.gv.at", newUrl: "https://www.migration.gv.at/en/" },
      { type: "add-line", lang: "en", newUrl: "https://www.migration.gv.at/en/", label: "Austrian Immigration Authority (official)" },
    ],
  },
  {
    slug: "study-country-dk",
    countryCode: "dk",
    ops: [
      { type: "replace-url", lang: "ja", oldUrl: "https://www.nyidanmark.dk", newUrl: "https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Jobseeking-permit" },
      { type: "replace-url", lang: "en", oldUrl: "https://www.nyidanmark.dk/en-GB", newUrl: "https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Jobseeking-permit" },
      { type: "replace-url", lang: "zh", oldUrl: "https://www.nyidanmark.dk", newUrl: "https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Jobseeking-permit" },
    ],
  },
  {
    slug: "study-work-dk",
    countryCode: "dk",
    ops: [
      { type: "replace-url", lang: "ja", oldUrl: "https://www.nyidanmark.dk", newUrl: "https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Jobseeking-permit" },
      { type: "replace-url", lang: "en", oldUrl: "https://www.nyidanmark.dk/en-GB", newUrl: "https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Jobseeking-permit" },
      { type: "replace-url", lang: "zh", oldUrl: "https://www.nyidanmark.dk", newUrl: "https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Jobseeking-permit" },
    ],
  },
];

const PLAN: Record<"1a" | "1b", ArticlePlan[]> = { "1a": BATCH_1A, "1b": BATCH_1B };

// ===== occurrence-guard付きoperation適用（section内テキストのみを操作、物理token countで判定） =====
type ApplyResult = { ok: true; newSectionText: string } | { ok: false; reason: string };

function applyOp(sectionText: string, op: Op): ApplyResult {
  const tokens = extractUrlTokensPhysical(sectionText);

  if (op.type === "replace-url") {
    const matches = tokens.filter((t) => t.url === op.oldUrl);
    if (matches.length === 0) return { ok: false, reason: `oldUrl "${op.oldUrl}" が参考資料section内に見つかりません（物理count=0）` };
    if (matches.length > 1) return { ok: false, reason: `oldUrl "${op.oldUrl}" が参考資料section内に物理的に${matches.length}件あり曖昧です（想定は1件）` };
    const newDup = countNormalizedEquivalent(tokens, op.newUrl);
    if (newDup > 0) return { ok: false, reason: `newUrl "${op.newUrl}" と正規化後に一致するURLが既にsection内に${newDup}件存在します（duplicate risk）` };
    // indexOf(oldUrl)ではなく、token抽出で確定した実位置[start,end)だけを置換する。
    // oldUrlが別の長いURLのprefixであっても、その長いURLのtoken.url自体はoldUrlと
    // 完全一致しない（extractUrlTokensPhysicalはURL全体を1 tokenとして抽出するため）
    // のでmatchesには含まれず、常に意図したtokenの位置のみが対象になる。
    const { start, end } = matches[0];
    const newSectionText = sectionText.slice(0, start) + op.newUrl + sectionText.slice(end);
    return { ok: true, newSectionText };
  }

  if (op.type === "add-line") {
    const dup = countNormalizedEquivalent(tokens, op.newUrl);
    if (dup > 0) return { ok: false, reason: `newUrl "${op.newUrl}" と正規化後に一致するURLが既にsection内に${dup}件存在します（duplicate risk）` };
    const lines = sectionText.split("\n");
    lines.push(`- [${op.label}](${op.newUrl})`);
    return { ok: true, newSectionText: lines.join("\n") };
  }

  if (op.type === "convert-plain-to-link") {
    const lines = sectionText.split("\n");
    const occurrences = lines.filter((l) => l.trim() === op.exactLine.trim()).length;
    if (occurrences === 0) return { ok: false, reason: `exactLine "${op.exactLine}" が見つかりません（0件）` };
    if (occurrences > 1) return { ok: false, reason: `exactLine "${op.exactLine}" が${occurrences}件あり曖昧です（想定は1件）` };
    const dup = countNormalizedEquivalent(tokens, op.newUrl);
    if (dup > 0) return { ok: false, reason: `newUrl "${op.newUrl}" と正規化後に一致するURLが既にsection内に${dup}件存在します（duplicate risk）` };
    const matchIdx = lines.findIndex((l) => l.trim() === op.exactLine.trim());
    lines[matchIdx] = `- [${op.label}](${op.newUrl})`;
    return { ok: true, newSectionText: lines.join("\n") };
  }

  return { ok: false, reason: "unknown op type" };
}

function applyOpsToContent(content: Record<string, string>, ops: Op[]): { ok: true; content: Record<string, string> } | { ok: false; reason: string } {
  const byLang = new Map<Lang, Op[]>();
  for (const op of ops) {
    if (!byLang.has(op.lang)) byLang.set(op.lang, []);
    byLang.get(op.lang)!.push(op);
  }
  const newContent = { ...content };
  for (const [lang, langOps] of byLang) {
    const text = content[lang] ?? "";
    const section = findRefSection(text, lang);
    if (!section) return { ok: false, reason: `${lang}: 参考資料sectionが見つかりません` };
    let sectionText = section.raw;
    for (const op of langOps) {
      const r = applyOp(sectionText, op);
      if (!r.ok) return { ok: false, reason: `${lang}: ${r.reason}` };
      sectionText = r.newSectionText;
    }
    const lines = text.split("\n");
    const before = lines.slice(0, section.startLine).join("\n");
    const after = lines.slice(section.endLine).join("\n");
    newContent[lang] = after.length > 0 ? `${before}\n${sectionText}\n${after}` : `${before}\n${sectionText}`;
  }
  return { ok: true, content: newContent };
}

function deepEqualUnaffectedLangs(before: Record<string, string>, after: Record<string, string>, affectedLangs: Set<Lang>): boolean {
  for (const lang of ["ja", "en", "zh"] as Lang[]) {
    if (affectedLangs.has(lang)) continue;
    if (before[lang] !== after[lang]) return false;
  }
  return true;
}

// ===== 計画状態の検証（適用前simulationと、適用後DB再SELECTの両方で同一関数を使う） =====
// 対象languageの参考資料sectionを取得し、各opの期待される物理状態を確認する。
function verifyPlannedState(content: Record<string, string>, ops: Op[]): { ok: true } | { ok: false; reason: string } {
  const byLang = new Map<Lang, Op[]>();
  for (const op of ops) {
    if (!byLang.has(op.lang)) byLang.set(op.lang, []);
    byLang.get(op.lang)!.push(op);
  }
  for (const [lang, langOps] of byLang) {
    const text = content[lang] ?? "";
    const section = findRefSection(text, lang);
    if (!section) return { ok: false, reason: `[${lang}] 参考資料sectionが見つかりません（post-state検証）` };
    const tokens = extractUrlTokensPhysical(section.raw);
    for (const op of langOps) {
      if (op.type === "replace-url") {
        const oldCount = countExact(tokens, op.oldUrl);
        if (oldCount !== 0) return { ok: false, reason: `[${lang}] oldUrl "${op.oldUrl}" がpatch後も${oldCount}件残存（disappearance未確認）` };
        const newCount = countExact(tokens, op.newUrl);
        if (newCount !== 1) return { ok: false, reason: `[${lang}] newUrl "${op.newUrl}" の物理countが${newCount}件（期待は1件）` };
      } else if (op.type === "add-line") {
        const newCount = countNormalizedEquivalent(tokens, op.newUrl);
        if (newCount !== 1) return { ok: false, reason: `[${lang}] add-line後のnewUrl "${op.newUrl}" normalized countが${newCount}件（期待は1件、重複または欠落）` };
      } else if (op.type === "convert-plain-to-link") {
        const lines = section.raw.split("\n");
        const plainStill = lines.filter((l) => l.trim() === op.exactLine.trim()).length;
        if (plainStill !== 0) return { ok: false, reason: `[${lang}] plain exactLine "${op.exactLine}" がpatch後も${plainStill}件残存` };
        const newCount = countNormalizedEquivalent(tokens, op.newUrl);
        if (newCount !== 1) return { ok: false, reason: `[${lang}] convert後のnewUrl "${op.newUrl}" normalized countが${newCount}件（期待は1件）` };
      }
    }
  }
  return { ok: true };
}

// content以外で不変であるべき列（study_blog_postsの全15列からcontentのみ除外。
// updated_at相当のserver-managed列は存在しないため、除外理由の明示的allowlist化は不要）。
const INVARIANT_FIELDS = [
  "id", "slug", "category", "date", "reading_time", "title", "description",
  "is_published", "created_at", "thumbnail", "thumbnail_ja", "thumbnail_en", "thumbnail_zh",
  "scheduled_publish_at",
] as const;

function invariantFieldsUnchanged(before: Record<string, unknown>, after: Record<string, unknown>): { ok: boolean; changed: string[] } {
  const changed: string[] = [];
  for (const f of INVARIANT_FIELDS) {
    if (!isDeepStrictEqual(before[f], after[f])) changed.push(f);
  }
  return { ok: changed.length === 0, changed };
}

// JSON.stringifyによる文字列比較はkeyの並び順に依存するため使わない。
// Node標準のisDeepStrictEqualで構造的な等価性を確認する
// （{en,ja,zh}のkey順序が異なっても正しく等価と判定される）。
function deepEqualJson(a: unknown, b: unknown): boolean {
  return isDeepStrictEqual(a, b);
}

type ArticleOutcome = { ok: true; dbUpdated: boolean } | { ok: false; reason: string; dbUpdated: boolean };

/**
 * 1記事分の処理。CAS成功が確定した瞬間に `dbUpdated` をtrueへ切り替え、
 * それ以降どこで例外が発生しても（post-SELECTのネットワークエラー等含め）、
 * 関数全体を包む唯一のtry/catchがその状態を保持したまま失敗として返す。
 * 呼び出し側（main）はこの関数が例外をthrowすることを想定しなくてよい
 * （必ず ArticleOutcome を返す。CAS成功後の例外で dbUpdated=false に
 * 巻き戻ることはない）。
 */
async function processArticle(plan: ArticlePlan, row: any, isApply: boolean): Promise<ArticleOutcome> {
  let dbUpdated = false;
  try {
    if (!row) return { ok: false, reason: "SELECT failure: DBに見つかりません", dbUpdated };
    if (row.slug !== plan.slug) return { ok: false, reason: `slug不一致（internal）: expected=${plan.slug} actual=${row.slug}`, dbUpdated };
    if (!row.id) return { ok: false, reason: "id不在（internal）", dbUpdated };
    if (row.is_published !== true) return { ok: false, reason: `is_published != true (実際=${row.is_published})`, dbUpdated };
    if (row.scheduled_publish_at !== null) return { ok: false, reason: `scheduled_publish_at != NULL (実際=${row.scheduled_publish_at})`, dbUpdated };

    const approved = await getApprovedSources(supabase, plan.countryCode);
    const before = validateStudyPublication({ title: row.title, description: row.description, content: row.content, approvedSources: approved });
    console.log(`  BEFORE: ${before.ok ? "PASS" : "FAIL"} ${before.ok ? "" : JSON.stringify(before.reasons)}`);
    if (before.ok) return { ok: false, reason: "BEFORE validator状態が想定と違う（既にPASSしている＝想定外の事前変化）", dbUpdated };

    const applied = applyOpsToContent(row.content, plan.ops);
    if (!applied.ok) return { ok: false, reason: `occurrence guard違反 — ${applied.reason}`, dbUpdated };

    const affectedLangs = new Set(plan.ops.map((o) => o.lang));
    if (!deepEqualUnaffectedLangs(row.content, applied.content, affectedLangs)) {
      return { ok: false, reason: "対象外言語のcontentが変化しています（internal invariant violation）", dbUpdated };
    }

    const after = validateStudyPublication({ title: row.title, description: row.description, content: applied.content, approvedSources: approved });
    console.log(`  AFTER (in-memory simulation): ${after.ok ? "PASS" : "still FAIL: " + JSON.stringify(after.reasons)}`);
    if (!after.ok) return { ok: false, reason: "AFTER validator != PASS（patch後もFAILのまま）", dbUpdated };

    const plannedPre = verifyPlannedState(applied.content, plan.ops);
    if (!plannedPre.ok) return { ok: false, reason: `planned URL事前確認失敗 — ${plannedPre.reason}`, dbUpdated };

    for (const lang of affectedLangs) console.log(`  [${lang}] 変更あり（section内のみ、他部分は不変）`);

    if (!isApply) {
      console.log("  🟡 [DRY RUN] ここでCAS RPCは呼びません（DB write 0）");
      return { ok: true, dbUpdated };
    }

    // ===== ここから先は --apply 経路。本ラウンドでは到達しない想定（DBアクセス禁止のため） =====
    const { data: rpcData, error: rpcError } = await supabase.rpc("study_blog_posts_cas_update_content", {
      p_id: row.id,
      p_expected_content: row.content,
      p_new_content: applied.content,
    });
    if (rpcError) return { ok: false, reason: `RPC call error: ${rpcError.message}`, dbUpdated };

    const updatedRows = (rpcData as any[]) ?? [];
    if (updatedRows.length === 0) {
      return { ok: false, reason: "CAS 0 rows: stale read / concurrent change / precondition failure（対象記事は未更新。再計算・再試行はしない）", dbUpdated };
    }
    if (updatedRows.length > 1) {
      dbUpdated = true; // 複数行が物理的に書き換わっている（スキーマ不変条件違反だが、書き込み自体は発生した事実として計上する）
      return { ok: false, reason: `CAS >1 rows (${updatedRows.length}件): スキーマ不変条件違反`, dbUpdated };
    }
    if (updatedRows[0].id !== row.id) {
      dbUpdated = true;
      return { ok: false, reason: `returned id mismatch: expected=${row.id} actual=${updatedRows[0].id}`, dbUpdated };
    }

    // ここで初めて「exactly 1 row成功」が確定する。以降どこで例外が起きてもこの値は失われない
    // （関数全体を包むtry/catchがdbUpdatedをそのまま保持してcatch節から返すため）。
    dbUpdated = true;
    console.log(`  ✅ CAS成功 (id=${updatedRows[0].id})`);

    const { data: postRow, error: postErr } = await supabase
      .from("study_blog_posts")
      .select("id, slug, category, date, reading_time, title, description, content, is_published, created_at, thumbnail, thumbnail_ja, thumbnail_en, thumbnail_zh, scheduled_publish_at")
      .eq("id", row.id)
      .single();
    if (postErr || !postRow) return { ok: false, reason: `post-update SELECT failure: ${postErr?.message ?? "no row"}`, dbUpdated };

    if (postRow.id !== row.id) return { ok: false, reason: "post-update id mismatch（internal）", dbUpdated };

    if (!deepEqualJson(postRow.content, applied.content)) {
      return { ok: false, reason: "post-update content mismatch: DB上のcontentがCASへ渡したapplied.contentとdeep-equalではありません", dbUpdated };
    }

    const postValidate = validateStudyPublication({ title: postRow.title, description: postRow.description, content: postRow.content, approvedSources: approved });
    if (!postValidate.ok) return { ok: false, reason: `post-update validator != PASS: ${JSON.stringify(postValidate.reasons)}`, dbUpdated };

    const invariantCheck = invariantFieldsUnchanged(row, postRow);
    if (!invariantCheck.ok) return { ok: false, reason: `content以外のfield変更検知: ${invariantCheck.changed.join(",")}`, dbUpdated };

    const plannedPost = verifyPlannedState(postRow.content, plan.ops);
    if (!plannedPost.ok) return { ok: false, reason: `planned URL事後確認失敗 — ${plannedPost.reason}`, dbUpdated };

    console.log("  ✅ post-update検証PASS（content deep-equal・validator PASS・非content列不変・planned URL状態を確認）");
    return { ok: true, dbUpdated };
  } catch (e) {
    // CAS成功後（dbUpdated=true）に発生した例外でも、dbUpdatedはこのクロージャ変数の
    // 現在値のまま保持される（falseへ巻き戻らない）。
    return { ok: false, reason: `unexpected exception: ${e instanceof Error ? e.message : String(e)}`, dbUpdated };
  }
}

// ===== main =====
async function main() {
  console.log(`=== BL-20260809-02 Batch ${BATCH_ARG} patch (${DRY_RUN ? "DRY_RUN" : "APPLY"}) ===\n`);
  const plans = PLAN[BATCH_ARG as "1a" | "1b"];
  const slugs = plans.map((p) => p.slug);

  const { data: rows, error } = await supabase
    .from("study_blog_posts")
    .select("id, slug, title, description, content, is_published, scheduled_publish_at, category, date, reading_time, created_at, thumbnail, thumbnail_ja, thumbnail_en, thumbnail_zh")
    .in("slug", slugs);
  if (error) {
    console.error("❌ SELECT失敗:", error.message);
    process.exitCode = 1;
    return;
  }

  let success = 0, failed = 0, notAttempted = 0, dbUpdated = 0;
  let stopped = false;
  let anyFailure = false;

  for (const plan of plans) {
    console.log(`\n--- ${plan.slug} ---`);

    if (APPLY && stopped) {
      console.log("  ⏭️  not_attempted（先行する記事でSTOPしたため未処理）");
      notAttempted++;
      continue;
    }

    const row = (rows ?? []).find((r: any) => r.slug === plan.slug);

    // processArticle() は内部で全例外を捕捉しArticleOutcomeへ変換するため、通常はthrowしない。
    // ここのtry/catchは「本当に予期不能な外側failure」に対する最終防衛線であり、
    // processArticle内部のCAS成功後例外を拾う経路ではない（dbUpdatedの巻き戻りは
    // processArticle内部のtry/catchで既に防止済み。ここでcatchされるケースがあるとすれば
    // dbUpdatedの実情報を持たないため、安全側のfalseとして扱う）。
    let outcome: ArticleOutcome;
    try {
      outcome = await processArticle(plan, row, APPLY);
    } catch (e) {
      outcome = { ok: false, reason: `unexpected exception (outside processArticle): ${e instanceof Error ? e.message : String(e)}`, dbUpdated: false };
    }

    if (outcome.dbUpdated) dbUpdated++;

    if (outcome.ok) {
      success++;
    } else {
      failed++;
      anyFailure = true;
      console.log(`  ❌ ${outcome.reason}`);
      if (APPLY) {
        stopped = true;
        console.log("  🛑 APPLY: fail-fast — 以降のslugは処理せずSTOPします（成功済み記事のrollbackはしません）");
      }
      // DRY_RUN: 診断continue（read-onlyのため実害なし）
    }
  }

  console.log(`\n=== Batch ${BATCH_ARG} 結果 (${DRY_RUN ? "DRY_RUN" : "APPLY"}) ===`);
  console.log(`  requested: ${plans.length}`);
  console.log(`  success: ${success}`);
  console.log(`  failed: ${failed}`);
  console.log(`  not_attempted: ${notAttempted}`);
  console.log(`  db_updated: ${dbUpdated}`);

  process.exitCode = anyFailure ? 1 : 0;
}

main().catch((e) => {
  console.error("❌ FATAL:", e instanceof Error ? e.message : e);
  process.exitCode = 1;
});

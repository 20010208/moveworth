/**
 * BL-20260809-02（Published Study validator debt）CZ専用safe patch。
 *
 * Batch1-3はURL/Reference行のみの置換だったが、study-country-czはJA/ZH本文のfact
 * precision correction（fee/validity）とJA/EN/ZH Referenceの候補source差し替えを
 * 同時に必要とするため、Batch1-3のURL-only architectureとは別のCZ専用scriptとする。
 *
 * 対象はhard-coded exactly 1記事・exactly 7箇所のみ（CLIでslug/id/URL/置換文字列を
 * 差し替え不可）:
 *   slug = study-country-cz / id = 8ab84cc3-49c4-4ee6-b340-ffc455e2f313
 *   source id = 2fde05f2-5bcf-46d3-ac0a-df4a2cafed4a（country_sources、既存登録済み。
 *   本scriptはregistry追加を一切行わない）
 *
 * validity（visa有効期間）とprocessing（申請処理期間）は別概念であり、混同しない：
 *   - official source: validity = "maximum 1 year" / processing = "60 days"
 *   - 今回JA/ZHで修正するのは「通常1年→最大1年」というvalidity precision correction。
 *     60 daysへの置換ではない。JA/ZH本文にprocessing claim自体が存在しないため、
 *     60 daysを本文へ新規追加することもしない（scope外）。
 *
 * exact mutation scope（7箇所のみ、これ以外のcontent変更は0）:
 *   1. JA body fee: "申請費用は約1万円。" → "申請費用は2,500 CZKです。"
 *   2. JA body validity: "ビザの有効期間は通常1年です。" → "ビザの有効期間は最大1年です。"
 *   3. ZH body fee: "申请费用约1万日元。" → "申请费用为2,500克朗（CZK）。"
 *   4. ZH body validity: "签证的有效期通常为1年。" → "签证的有效期最长为1年。"
 *   5. JA Reference行: 大使館 → チェコ外国人情報ポータル（内務省・候補source URL）
 *   6. EN Reference行: Ministry of Education → Information Portal for Foreigners
 *   7. ZH Reference行: 大使馆 → 捷克外国人信息门户（内务部・候補source URL）
 *   （EN本文は無変更。各言語の残り2 Reference行も無変更）
 *
 * 安全設計（Batch3のfull-line replacement architectureをbody substring replacementへ拡張）:
 *   - 宣言的操作リストに明示（コード内でad-hocに文字列置換しない）
 *   - body op: exact substring occurrence guard（old=1, new=0を事前確認してから置換）
 *   - reference op: 既存Batch3と同じ物理行exact一致guard（Reference section内のみ）
 *   - 置換後、newContent→(NEW→OLD逆置換)がoriginal contentとdeep-equalになることを
 *     確認する round-trip invariant により、7箇所以外の差分が存在しないことを保証する
 *   - DRY_RUNがデフォルト。実際のDB CASには `--apply` に加え、環境変数
 *     `ALLOW_PRODUCTION_STUDY_PATCH` が厳密に文字列 "1" と一致することが必要
 *   - 本番反映は `study_blog_posts_cas_update_content()` RPC（compare-and-swap）経由のみ。
 *     .update()/.insert()/.upsert()/.delete() によるfallbackは行わない。country_sources
 *     への書き込み（登録追加含む）は一切行わない
 *   - CAS成功後はDB再SELECTし、content の deep-equal・validator PASS・非content列の
 *     不変（study_blog_postsにupdated_at相当の列は存在しないため、Batch3と同一の
 *     INVARIANT_FIELDSで十分）をすべて再確認する
 *
 * 使い方:
 *   npx tsx scripts/patch-study-country-cz-validator.ts            (DRY_RUN)
 *   npx tsx scripts/patch-study-country-cz-validator.ts --apply    (要 ALLOW_PRODUCTION_STUDY_PATCH=1)
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
const APPLY = process.argv.includes("--apply");
if (APPLY && process.env.ALLOW_PRODUCTION_STUDY_PATCH !== "1") {
  console.error("エラー: --apply には環境変数 ALLOW_PRODUCTION_STUDY_PATCH=1 が必要です（exact match '1' のみ許可）。");
  console.error("   例: ALLOW_PRODUCTION_STUDY_PATCH=1 npx tsx scripts/patch-study-country-cz-validator.ts --apply");
  process.exit(1);
}
const DRY_RUN = !APPLY;

// ===== hard-coded target（1件のみ） =====
const TARGET_SLUG = "study-country-cz";
const TARGET_ARTICLE_ID = "8ab84cc3-49c4-4ee6-b340-ffc455e2f313";
const TARGET_COUNTRY = "cz";
const SOURCE_ID = "2fde05f2-5bcf-46d3-ac0a-df4a2cafed4a";
const SOURCE_URL =
  "https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/long-term-visa/long-term-visa-for-the-purpose-of-studies/";

// ===== 宣言的exact operation list（7箇所のみ） =====
type BodyOp = { kind: "body"; lang: Lang; old: string; new: string };
type RefOp = { kind: "ref"; lang: Lang; old: string; new: string };
type Op = BodyOp | RefOp;

const OPS: Op[] = [
  { kind: "body", lang: "ja", old: "申請費用は約1万円。", new: "申請費用は2,500 CZKです。" },
  { kind: "body", lang: "ja", old: "ビザの有効期間は通常1年です。", new: "ビザの有効期間は最大1年です。" },
  { kind: "body", lang: "zh", old: "申请费用约1万日元。", new: "申请费用为2,500克朗（CZK）。" },
  { kind: "body", lang: "zh", old: "签证的有效期通常为1年。", new: "签证的有效期最长为1年。" },
  { kind: "ref", lang: "ja", old: "- [チェコ共和国大使館](https://www.mzv.cz/tokyo/ja/index.html)", new: `- [チェコ外国人情報ポータル（内務省）](${SOURCE_URL})` },
  { kind: "ref", lang: "en", old: "- [Czech Ministry of Education](https://www.msmt.cz)", new: `- [Information Portal for Foreigners (Czech Ministry of the Interior)](${SOURCE_URL})` },
  { kind: "ref", lang: "zh", old: "- [捷克共和国大使馆](https://www.mzv.cz/tokyo/ja/index.html)", new: `- [捷克外国人信息门户（内务部）](${SOURCE_URL})` },
];

// ===== mutation state model（Medium #2） =====
type MutationState = "not_observed" | "confirmed" | "ambiguous";

// ===== summary type =====
type Summary = {
  mode: "DRY_RUN" | "APPLY";
  requested: number;
  success: number;
  failed: number;
  not_attempted: number;

  target_slug: string;
  target_id: string;
  source_id: string;
  source_url: string;

  source_id_row_count: number | null;
  source_registry_exact_count: number | null;
  source_registry_normalized_count: number | null;
  approved_source_match_before: number | null;
  approved_source_match_after: number | null;
  source_precondition_passed: boolean | null;

  article_row_count: number | null;
  article_precondition_passed: boolean | null;
  validator_before: "PASS" | "FAIL" | null;
  validator_before_reason_count: number | null;

  op_occurrence: Record<string, { old_count: number; new_before: number }>;

  candidate_before_ja: number | null;
  candidate_before_en: number | null;
  candidate_before_zh: number | null;

  allowed_mutation_invariant: boolean | null;
  non_target_deep_equal: boolean | null;
  reference_invariant: boolean | null;

  validator_after: "PASS" | "FAIL" | null;
  validator_after_reason_count: number | null;

  cas_attempted: boolean;
  mutation_state: MutationState;
  db_updated: boolean;
  recovery_select_attempted: boolean;
  recovery_select_succeeded: boolean | null;
  recovery_outcome: string | null;

  failure_stage: string | null;
  failure_reason: string | null;
  exit: number;
};

function freshSummary(): Summary {
  return {
    mode: DRY_RUN ? "DRY_RUN" : "APPLY",
    requested: 1,
    success: 0,
    failed: 0,
    not_attempted: 0,
    target_slug: TARGET_SLUG,
    target_id: TARGET_ARTICLE_ID,
    source_id: SOURCE_ID,
    source_url: SOURCE_URL,
    source_id_row_count: null,
    source_registry_exact_count: null,
    source_registry_normalized_count: null,
    approved_source_match_before: null,
    approved_source_match_after: null,
    source_precondition_passed: null,
    article_row_count: null,
    article_precondition_passed: null,
    validator_before: null,
    validator_before_reason_count: null,
    op_occurrence: {},
    candidate_before_ja: null,
    candidate_before_en: null,
    candidate_before_zh: null,
    allowed_mutation_invariant: null,
    non_target_deep_equal: null,
    reference_invariant: null,
    validator_after: null,
    validator_after_reason_count: null,
    cas_attempted: false,
    mutation_state: "not_observed",
    db_updated: false,
    recovery_select_attempted: false,
    recovery_select_succeeded: null,
    recovery_outcome: null,
    failure_stage: null,
    failure_reason: null,
    exit: 0,
  };
}

function fail(s: Summary, stage: string, reason: string): Summary {
  s.failed = 1;
  s.success = 0;
  s.failure_stage = stage;
  s.failure_reason = reason;
  s.exit = 1;
  return s;
}

function finish(s: Summary): Summary {
  console.log("\n=== summary ===");
  console.log(JSON.stringify(s, null, 2));
  process.exitCode = s.exit;
  return s;
}

// ===== count helpers =====
function countSubstring(text: string, needle: string): number {
  let count = 0;
  let idx = 0;
  while (true) {
    const found = text.indexOf(needle, idx);
    if (found === -1) break;
    count++;
    idx = found + 1;
  }
  return count;
}

function extractSectionLines(content: string, lang: Lang) {
  const section = findRefSection(content, lang);
  if (!section) return null;
  const allLines = content.split("\n");
  return { lines: allLines.slice(section.startLine, section.endLine), startLine: section.startLine, endLine: section.endLine };
}

function countUrlNormalizedInLines(lines: string[], targetUrl: string): number {
  const targetNorm = normalizeUrl(targetUrl);
  const urlRe = /(https?:\/\/[^\s)"'<>\]]+)/g;
  let count = 0;
  for (const l of lines) {
    const found = l.match(urlRe) || [];
    for (const u of found) {
      const trimmed = u.replace(/[.,;)]+$/, "");
      if (normalizeUrl(trimmed) === targetNorm) count++;
    }
  }
  return count;
}

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

// ===== official source fetch precondition =====
async function fetchSourcePrecondition(url: string): Promise<{ ok: true; html: string } | { ok: false; reason: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "manual",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "text/html,*/*;q=0.8",
      },
    });
    clearTimeout(timer);
    if (res.status !== 200) return { ok: false, reason: `HTTP ${res.status}（期待200。redirect: "manual"のため3xxもfailure扱い）` };
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("html")) return { ok: false, reason: `想定外のcontent-type: ${ct}` };
    const html = await res.text();
    return { ok: true, html };
  } catch (e) {
    clearTimeout(timer);
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, reason: `source fetch失敗: ${msg}` };
  }
}

function normalizeForMarkerCheck(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

// validity（maximum 1 year）とprocessing（60 days）は別概念として個別に確認する。混同しない。
function validateSourceIdentity(html: string): { ok: true } | { ok: false; reason: string } {
  const norm = normalizeForMarkerCheck(html);

  if (!norm.includes("long-term visa for the purpose of studies")) {
    return { ok: false, reason: "必須identity marker欠落: 'Long-term Visa for the Purpose of Studies'" };
  }
  if (!norm.includes("third country nationals") && !norm.includes("third-country nationals") && !norm.includes("third country") && !norm.includes("third-country")) {
    return { ok: false, reason: "必須identity marker欠落: third-country nationals文脈" };
  }
  if (!norm.includes("maximum of 1 year") && !norm.includes("maximum 1 year")) {
    return { ok: false, reason: "必須material marker欠落: validity（maximum 1 year）" };
  }
  const hasFee = norm.includes("2,500") || norm.includes("2500");
  if (!hasFee) return { ok: false, reason: "必須material marker欠落: fee（2,500 CZK）" };
  if (!norm.includes("60 days")) {
    return { ok: false, reason: "必須material marker欠落: processing（60 days）" };
  }
  const hasEnrolment = norm.includes("confirmation of studies") || norm.includes("confirmation of enrolment") || norm.includes("confirmation of enrollment");
  if (!hasEnrolment) return { ok: false, reason: "必須material marker欠落: confirmation of studies / enrolment" };
  const hasFunds = norm.includes("proof of funds") || norm.includes("financial means");
  if (!hasFunds) return { ok: false, reason: "必須material marker欠落: proof of funds / financial means" };
  if (!norm.includes("medical insurance")) {
    return { ok: false, reason: "必須material marker欠落: medical insurance" };
  }

  return { ok: true };
}

// ===== ambiguous CAS outcome recovery handler（Medium #2） =====
// CAS dispatch後にconfirmed条件（throwなし・error==null・valid array length===1・
// returned id一致）を満たさない全ケース（throw/error/data null/non-array/>1/id不一致）を
// ここへ集約する。mutationがcommit済みの可能性を否定できないため、保守的に
// mutation_state="ambiguous" / db_updated=true とし、read-only recovery SELECTをexactly
// 1回だけ行う。追加retry・fallback SELECT・自動再CASは行わない。
async function handleAmbiguousCasOutcome(
  s: Summary,
  row: any,
  newContent: Record<string, string>
): Promise<Summary> {
  s.mutation_state = "ambiguous";
  s.db_updated = true;
  s.recovery_select_attempted = true;

  try {
    const { data: recRows, error: recErr } = await supabase
      .from("study_blog_posts")
      .select("id, slug, content")
      .eq("id", TARGET_ARTICLE_ID);

    if (recErr) {
      s.recovery_select_succeeded = false;
      s.recovery_outcome = "recovery_query_error";
      return fail(s, "recovery_select", `recovery SELECT error: ${recErr.message}`);
    }
    if (!Array.isArray(recRows) || recRows.length !== 1) {
      s.recovery_select_succeeded = false;
      s.recovery_outcome = "recovery_query_malformed";
      return fail(s, "recovery_select", `recovery SELECTが不正な行数/形状を返しました (rows=${Array.isArray(recRows) ? recRows.length : "non-array"})`);
    }
    const recRow = recRows[0] as unknown;
    if (!recRow || typeof recRow !== "object") {
      s.recovery_select_succeeded = false;
      s.recovery_outcome = "recovery_query_malformed";
      return fail(s, "recovery_select", "recovery SELECT row がvalid objectではありません");
    }
    const rr = recRow as { id?: unknown; slug?: unknown; content?: unknown };

    // returned row identityを必ず再検証する。`.eq("id", TARGET_ARTICLE_ID)`という
    // query filterそのものは信用しない（filterの実装/権限/ビュー経由の想定外挙動で
    // wrong-ID rowが返る可能性を排除できないため）。ID/slugが一致しない限り、
    // contentがoriginalと一致していてもnot_observedへ降格してはならない
    // （Codex Medium finding 2: wrong-ID row + original contentでの誤降格防止）。
    if (rr.id !== TARGET_ARTICLE_ID) {
      s.recovery_select_succeeded = false;
      s.recovery_outcome = "identity_mismatch";
      return fail(s, "recovery_select", `recovery SELECT: returned id不一致 (expected=${TARGET_ARTICLE_ID}, actual=${String(rr.id)})`);
    }
    if (rr.slug !== TARGET_SLUG) {
      s.recovery_select_succeeded = false;
      s.recovery_outcome = "identity_mismatch";
      return fail(s, "recovery_select", `recovery SELECT: returned slug不一致 (expected=${TARGET_SLUG}, actual=${String(rr.slug)})`);
    }
    if (!rr.content || typeof rr.content !== "object") {
      s.recovery_select_succeeded = false;
      s.recovery_outcome = "recovery_query_malformed";
      return fail(s, "recovery_select", "recovery SELECT: contentが欠落/不正です");
    }

    s.recovery_select_succeeded = true;
    const freshContent = rr.content;

    if (isDeepStrictEqual(freshContent, newContent)) {
      // dispatch結果自体はambiguousだったため、observedできても自動でconfirmedへ
      // 昇格しない。mutation_state="ambiguous"を維持したままfailureとしてSTOPする。
      s.recovery_outcome = "expected_content_observed";
      return fail(s, "cas_ambiguous", "CAS dispatch結果はambiguousでしたが、recovery SELECTでexpected content（patch後の内容）が観測されました。安全側でambiguousを維持し、自動的にsuccess扱いにはしません。");
    }
    if (isDeepStrictEqual(freshContent, row.content)) {
      // mutation未観測と確認できた唯一の降格経路（identity一致確認済みのtarget rowでのみ到達）
      s.mutation_state = "not_observed";
      s.db_updated = false;
      s.recovery_outcome = "original_content_observed";
      return fail(s, "cas_ambiguous", "CAS dispatch結果はambiguousでしたが、recovery SELECTでoriginal content（未変更）が観測されました。");
    }
    s.recovery_outcome = "unexpected_content_observed";
    return fail(s, "cas_ambiguous", "recovery SELECTのcontentがoriginal/expectedのいずれとも一致しません（external drift疑い）。");
  } catch (e) {
    s.recovery_select_succeeded = false;
    s.recovery_outcome = "recovery_query_exception";
    const msg = e instanceof Error ? e.message : String(e);
    return fail(s, "recovery_select", `recovery SELECT自体が失敗しました（mutationの可能性を解決できません）: ${msg}`);
  }
}

// ===== main =====
async function main() {
  const s = freshSummary();
  console.log(`=== CZ study-country-cz validator patch (${s.mode}) ===`);
  console.log(`target: ${TARGET_SLUG} / ${TARGET_ARTICLE_ID}\n`);

  try {
    // 1a. SOURCE_ID authoritative row query（このIDのrowがCZ study/visa registryとして正しいことを確認）
    // 正常と扱えるのはexactly以下全条件AND: throwなし・error==null・Array.isArray(data)・
    // data.length===1・data[0]がobject・id/country_code/purpose/status/urlの全identity一致。
    // `.filter()`で複数件から絞り込んで「1件残った」を正常と誤認するfail-open pathを作らない
    // （返却行数自体を先にexactly1へ固定してからfield一致を確認する）。
    const { data: srcIdRows, error: srcIdErr } = await supabase
      .from("country_sources")
      .select("id, country_code, purpose, status, url")
      .eq("id", SOURCE_ID);
    if (srcIdErr) return finish(fail(s, "source_registry", `SOURCE_ID SELECT error: ${srcIdErr.message}`));
    if (!Array.isArray(srcIdRows)) return finish(fail(s, "source_registry", "SOURCE_ID SELECT returned malformed data (data null/undefined/non-array)"));
    s.source_id_row_count = srcIdRows.length;
    if (srcIdRows.length !== 1) {
      return finish(fail(s, "source_registry", `SOURCE_ID authoritative row count=${srcIdRows.length}（期待1）`));
    }
    const srcIdRow = srcIdRows[0] as unknown;
    if (!srcIdRow || typeof srcIdRow !== "object") {
      return finish(fail(s, "source_registry", "SOURCE_ID authoritative row がvalid objectではありません"));
    }
    const r = srcIdRow as { id?: unknown; country_code?: unknown; purpose?: unknown; status?: unknown; url?: unknown };
    if (r.id !== SOURCE_ID) {
      return finish(fail(s, "source_registry", `SOURCE_ID authoritative row: returned id不一致 (expected=${SOURCE_ID}, actual=${String(r.id)})`));
    }
    if (r.country_code !== TARGET_COUNTRY) {
      return finish(fail(s, "source_registry", `SOURCE_ID authoritative row: country_code不一致 (actual=${String(r.country_code)})`));
    }
    if (r.purpose !== "visa") {
      return finish(fail(s, "source_registry", `SOURCE_ID authoritative row: purpose不一致 (actual=${String(r.purpose)})`));
    }
    if (r.status !== "alive") {
      return finish(fail(s, "source_registry", `SOURCE_ID authoritative row: status不一致 (actual=${String(r.status)})`));
    }
    if (r.url !== SOURCE_URL) {
      return finish(fail(s, "source_registry", `SOURCE_ID authoritative row: url不一致 (actual=${String(r.url)})`));
    }

    // 1b. CZ registry-wide duplicate query（Medium #1: SOURCE_ID限定では別IDによる同一URL
    //     重複を検出できないため、country_code=cz の全rowsに対してraw exact / normalized
    //     duplicateを確認する。data ?? [] 等のfail-open fallbackは使わず、error/throw/null/
    //     non-array/malformed row（url非string）はすべてregistry guard failureとして扱う）
    const { data: czRows, error: czErr } = await supabase
      .from("country_sources")
      .select("id, url")
      .eq("country_code", TARGET_COUNTRY);
    if (czErr) return finish(fail(s, "source_registry", `CZ registry SELECT error: ${czErr.message}`));
    if (!Array.isArray(czRows)) return finish(fail(s, "source_registry", "CZ registry SELECT returned malformed data (data null/undefined/non-array)"));
    const malformedRow = czRows.find((r) => typeof r.url !== "string");
    if (malformedRow) {
      return finish(fail(s, "source_registry", `CZ registry内にurlがstring型でないrowがあります (id=${(malformedRow as any).id})`));
    }
    const rawExactCount = czRows.filter((r) => r.url === SOURCE_URL).length;
    s.source_registry_exact_count = rawExactCount;
    if (rawExactCount !== 1) {
      return finish(fail(s, "source_registry", `CZ registry raw exact count=${rawExactCount}（期待1、別IDによる重複の可能性）`));
    }
    const targetNorm = normalizeUrl(SOURCE_URL);
    const normalizedCount = czRows.filter((r) => normalizeUrl(r.url) === targetNorm).length;
    s.source_registry_normalized_count = normalizedCount;
    if (normalizedCount !== 1) {
      return finish(fail(s, "source_registry", `CZ registry normalized count=${normalizedCount}（期待1、別IDによる重複の可能性）`));
    }

    // approved-source check（dedupe済み集合）はregistry duplicate guardの代替にならないため、
    // 1a/1bの生registry確認とは別に必ず併用する
    const approved = await getApprovedSources(supabase, TARGET_COUNTRY);
    const approvedMatchBefore = approved.filter((a) => a.normalized === targetNorm).length;
    s.approved_source_match_before = approvedMatchBefore;
    if (approvedMatchBefore !== 1) {
      return finish(fail(s, "source_registry", `getApprovedSources("cz")一致件数=${approvedMatchBefore}（期待1）`));
    }

    // 2. official source fetch precondition（validity/processingを個別確認、混同しない）
    const fetchResult = await fetchSourcePrecondition(SOURCE_URL);
    if (!fetchResult.ok) {
      s.source_precondition_passed = false;
      return finish(fail(s, "source_fetch", fetchResult.reason));
    }
    const identityResult = validateSourceIdentity(fetchResult.html);
    if (!identityResult.ok) {
      s.source_precondition_passed = false;
      return finish(fail(s, "source_validation", identityResult.reason));
    }
    s.source_precondition_passed = true;
    console.log("  source precondition: PASS（validity=maximum 1 year, processing=60 daysを個別確認）");

    // 3. fresh article SELECT
    const { data: articleRows, error: articleErr } = await supabase
      .from("study_blog_posts")
      .select("id, slug, category, date, reading_time, title, description, content, is_published, created_at, thumbnail, thumbnail_ja, thumbnail_en, thumbnail_zh, scheduled_publish_at")
      .eq("slug", TARGET_SLUG);
    if (articleErr) return finish(fail(s, "article_precondition", `article SELECT error: ${articleErr.message}`));
    if (!Array.isArray(articleRows)) return finish(fail(s, "article_precondition", "article SELECT returned malformed data"));
    s.article_row_count = articleRows.length;
    if (articleRows.length !== 1) {
      return finish(fail(s, "article_precondition", `article row count=${articleRows.length}（期待1）`));
    }
    const row: any = articleRows[0];
    if (row.id !== TARGET_ARTICLE_ID) {
      return finish(fail(s, "article_precondition", `id不一致: expected=${TARGET_ARTICLE_ID} actual=${row.id}`));
    }
    if (row.is_published !== true) {
      return finish(fail(s, "article_precondition", `is_published != true (実際=${row.is_published})`));
    }
    if (row.scheduled_publish_at !== null) {
      return finish(fail(s, "article_precondition", `scheduled_publish_at != null`));
    }
    if (!row.content || typeof row.content !== "object") {
      return finish(fail(s, "article_precondition", "content欠落"));
    }
    s.article_precondition_passed = true;

    // 4. BEFORE validator gate
    const before = validateStudyPublication({ title: row.title, description: row.description, content: row.content, approvedSources: approved });
    s.validator_before = before.ok ? "PASS" : "FAIL";
    s.validator_before_reason_count = before.reasons.length;
    console.log(`  BEFORE validator: ${s.validator_before} (${before.reasons.length} reasons)`);
    if (before.ok) {
      return finish(fail(s, "validator_before", "BEFORE validatorがPASSしています（想定外のdrift、FAILを期待）"));
    }

    // 5. exact occurrence guards（body: substring / reference: 物理行）+ deterministic expected content生成
    const newContent: Record<string, string> = { ...(row.content as Record<string, string>) };
    for (const op of OPS) {
      const key = `${op.kind}_${op.lang}_${OPS.indexOf(op)}`;
      if (op.kind === "body") {
        const text = newContent[op.lang];
        const oldCount = countSubstring(text, op.old);
        const newBefore = countSubstring(text, op.new);
        s.op_occurrence[key] = { old_count: oldCount, new_before: newBefore };
        if (oldCount !== 1) return finish(fail(s, "mutation_guard", `[body ${op.lang}] old occurrence=${oldCount}（期待1）: "${op.old}"`));
        if (newBefore !== 0) return finish(fail(s, "mutation_guard", `[body ${op.lang}] new occurrenceが既に${newBefore}件存在: "${op.new}"`));
        newContent[op.lang] = text.replace(op.old, op.new);
      } else {
        const sec = extractSectionLines(newContent[op.lang], op.lang);
        if (!sec) return finish(fail(s, "mutation_guard", `[ref ${op.lang}] 参考資料sectionが見つかりません`));
        const matches = sec.lines.filter((l) => l === op.old);
        const dupBefore = countUrlNormalizedInLines(sec.lines, SOURCE_URL);
        s.op_occurrence[key] = { old_count: matches.length, new_before: dupBefore };
        if (matches.length !== 1) return finish(fail(s, "mutation_guard", `[ref ${op.lang}] oldLine物理occurrence=${matches.length}（期待1）: "${op.old}"`));
        if (dupBefore !== 0) return finish(fail(s, "mutation_guard", `[ref ${op.lang}] candidate URLが既にsection内に${dupBefore}件存在`));
        const allLines = newContent[op.lang].split("\n");
        const idx = allLines.findIndex((l: string, i: number) => i >= sec.startLine && i < sec.endLine && l === op.old);
        const newAllLines = [...allLines];
        newAllLines[idx] = op.new;
        newContent[op.lang] = newAllLines.join("\n");
      }
    }

    // candidate occurrence before（置換前のoriginal contentから確認、既にop_occurrenceのref newBeforeと同義だが言語別に明示report）
    for (const lang of ["ja", "en", "zh"] as Lang[]) {
      const secOrig = extractSectionLines((row.content as Record<string, string>)[lang], lang);
      const occ = secOrig ? countUrlNormalizedInLines(secOrig.lines, SOURCE_URL) : 0;
      if (lang === "ja") s.candidate_before_ja = occ;
      if (lang === "en") s.candidate_before_en = occ;
      if (lang === "zh") s.candidate_before_zh = occ;
    }

    // 6. allowed-mutation whitelist invariant（round-trip: NEW→OLD逆置換でoriginalとdeep-equal）
    const reversed: Record<string, string> = { ...newContent };
    for (const op of OPS) {
      if (op.kind === "body") {
        reversed[op.lang] = reversed[op.lang].replace(op.new, op.old);
      } else {
        const allLines = reversed[op.lang].split("\n");
        const idx = allLines.findIndex((l: string) => l === op.new);
        if (idx >= 0) allLines[idx] = op.old;
        reversed[op.lang] = allLines.join("\n");
      }
    }
    const roundTripOk = isDeepStrictEqual(reversed, row.content);
    s.allowed_mutation_invariant = roundTripOk;
    if (!roundTripOk) {
      return finish(fail(s, "mutation_guard", "allowed-mutation whitelist invariant違反: round-trip逆置換がoriginal contentと一致しません（7箇所以外の差分の可能性）"));
    }

    // EN bodyは無変更（Reference行のみ変更）の確認
    s.non_target_deep_equal = newContent.en.replace(OPS.find((o) => o.kind === "ref" && o.lang === "en")!.new, "___") ===
      (row.content as Record<string, string>).en.replace(OPS.find((o) => o.kind === "ref" && o.lang === "en")!.old, "___");

    // 7. Reference section invariant（各言語: section位置・行数不変、section内は対象1行以外不変）
    //    section「外」の一致確認は body correction（JA/ZH）がReference section手前に
    //    存在するため、prefix全体一致を要求しない（body opの意図した差分と衝突するため）。
    //    section外を含む全体の「7箇所以外は無差分」保証は6.のround-trip invariantが担う。
    let refInvariantOk = true;
    for (const lang of ["ja", "en", "zh"] as Lang[]) {
      const secBefore = findRefSection((row.content as Record<string, string>)[lang], lang);
      const secAfter = findRefSection(newContent[lang], lang);
      if (!secBefore || !secAfter) { refInvariantOk = false; break; }
      const beforeLineCount = secBefore.endLine - secBefore.startLine;
      const afterLineCount = secAfter.endLine - secAfter.startLine;
      if (beforeLineCount !== afterLineCount) { refInvariantOk = false; break; }
      const beforeSecLines = (row.content as Record<string, string>)[lang].split("\n").slice(secBefore.startLine, secBefore.endLine);
      const afterSecLines = newContent[lang].split("\n").slice(secAfter.startLine, secAfter.endLine);
      let diffCount = 0;
      for (let i = 0; i < beforeSecLines.length; i++) {
        if (beforeSecLines[i] !== afterSecLines[i]) diffCount++;
      }
      const expectedDiff = OPS.filter((o) => o.kind === "ref" && o.lang === lang).length;
      if (diffCount !== expectedDiff) { refInvariantOk = false; break; }
    }
    s.reference_invariant = refInvariantOk;
    if (!refInvariantOk) {
      return finish(fail(s, "mutation_guard", "Reference section invariant違反"));
    }

    // 8. hypothetical AFTER validator（DBへは書かない。in-memory評価のみ）
    const after = validateStudyPublication({ title: row.title, description: row.description, content: newContent, approvedSources: approved });
    s.validator_after = after.ok ? "PASS" : "FAIL";
    s.validator_after_reason_count = after.reasons.length;
    console.log(`  hypothetical AFTER validator: ${s.validator_after} (${after.reasons.length} reasons)`);
    if (!after.ok) {
      return finish(fail(s, "validator_after", `AFTER validator != PASS: ${JSON.stringify(after.reasons)}`));
    }

    if (DRY_RUN) {
      s.success = 1;
      s.exit = 0;
      console.log("  [DRY RUN] 全guard・hypothetical AFTER validatorがPASSしました。CAS RPCは呼びません（DB write 0）。");
      return finish(s);
    }

    // ===== ここから先はAPPLY経路。本ラウンドでは到達しない想定（--apply未指定のため） =====
    // Medium #2: CAS dispatch自体をtry/catchで保護し、throwはambiguousへ集約する。
    s.cas_attempted = true;
    let rpcData: unknown = undefined;
    let rpcError: { message: string } | null = null;
    try {
      const res = await supabase.rpc("study_blog_posts_cas_update_content", {
        p_id: row.id,
        p_expected_content: row.content,
        p_new_content: newContent,
      });
      rpcData = res.data;
      rpcError = res.error;
    } catch (e) {
      // dispatch中の例外（network/client exception）→ ambiguous（mutationの可能性を否定できない）
      return finish(await handleAmbiguousCasOutcome(s, row, newContent));
    }

    if (rpcError) {
      // RPC契約上「errorならmutationなし」を保証できないため、保守的にambiguous扱いする
      return finish(await handleAmbiguousCasOutcome(s, row, newContent));
    }
    if (!Array.isArray(rpcData)) {
      return finish(await handleAmbiguousCasOutcome(s, row, newContent));
    }
    if (rpcData.length === 0) {
      // 正常なCAS conflict/no-op: error===null かつ valid array 0件を明確に確認できた場合のみ、
      // mutation未発生と断定できる（fail-closedな唯一の降格判定経路）
      s.mutation_state = "not_observed";
      s.db_updated = false;
      return finish(fail(s, "cas", "CAS 0 rows: stale read / concurrent change / precondition failure（再試行しない）"));
    }
    if (rpcData.length > 1) {
      return finish(await handleAmbiguousCasOutcome(s, row, newContent));
    }
    const returnedRow = rpcData[0] as any;
    if (!returnedRow?.id || returnedRow.id !== row.id) {
      return finish(await handleAmbiguousCasOutcome(s, row, newContent));
    }

    // ===== confirmed唯一のpath =====
    s.mutation_state = "confirmed";
    s.db_updated = true;
    console.log(`  CAS成功 confirmed (id=${returnedRow.id})`);

    const { data: postRow, error: postErr } = await supabase
      .from("study_blog_posts")
      .select("id, slug, category, date, reading_time, title, description, content, is_published, created_at, thumbnail, thumbnail_ja, thumbnail_en, thumbnail_zh, scheduled_publish_at")
      .eq("id", row.id)
      .single();
    // 以降、post verificationがfailureしてもmutation_state="confirmed" / db_updated=true は
    // 維持する（すでにcommit済みのDB事実を、検証failureを理由にnot_observedへ戻さない）。
    if (postErr || !postRow) return finish(fail(s, "post_cas_reselect", `post-CAS SELECT failure: ${postErr?.message ?? "no row"}`));
    if (!isDeepStrictEqual(postRow.content, newContent)) {
      return finish(fail(s, "post_cas_reselect", "post-CAS content mismatch: DB上のcontentがCASへ渡したnewContentとdeep-equalではありません"));
    }

    // Medium #3: post-CAS validatorはfresh approved source setを再取得する（pre-CASの
    // approved objectを再利用しない）。fresh取得自体の失敗もconfirmed事実は維持したまま
    // post-write verification failureとして扱う（rollbackしない）。
    let approvedAfter;
    try {
      approvedAfter = await getApprovedSources(supabase, TARGET_COUNTRY);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return finish(fail(s, "post_cas_reselect", `post-CAS fresh getApprovedSources失敗: ${msg}`));
    }
    const approvedMatchAfter = approvedAfter.filter((a) => a.normalized === targetNorm).length;
    s.approved_source_match_after = approvedMatchAfter;
    if (approvedMatchAfter !== 1) {
      return finish(fail(s, "post_cas_reselect", `post-CAS approved candidate match=${approvedMatchAfter}（期待1）`));
    }

    const postValidate = validateStudyPublication({ title: postRow.title, description: postRow.description, content: postRow.content, approvedSources: approvedAfter });
    if (!postValidate.ok) return finish(fail(s, "post_cas_reselect", `post-CAS validator != PASS: ${JSON.stringify(postValidate.reasons)}`));
    const invariantCheck = invariantFieldsUnchanged(row, postRow);
    if (!invariantCheck.ok) return finish(fail(s, "post_cas_reselect", `content以外のfield変更検知: ${invariantCheck.changed.join(",")}`));

    console.log("  post-CAS検証PASS（content deep-equal・fresh validator PASS・非content列不変を確認）");
    s.success = 1;
    s.exit = 0;
    return finish(s);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return finish(fail(s, s.failure_stage ?? "preflight", `unexpected top-level exception: ${msg}`));
  }
}

main().catch((e) => {
  console.error("FATAL:", e instanceof Error ? e.message : e);
  process.exitCode = 1;
});

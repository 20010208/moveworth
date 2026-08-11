/**
 * BL-20260809-02（Published Study validator debt）study-work-ie専用safe patch。
 *
 * Option A設計: 新規source registry INSERTは行わず、既存approved root source
 * （`https://www.irishimmigration.ie/`、SOURCE_ID既存登録済み）をEN Referenceへ
 * 再利用する。JA/ZHは既にこのURLを引用しvalidator上approved match済みのため、
 * exact mutation scopeはEN Reference行exactly1箇所のみ（body変更0）。
 *
 * 対象はhard-coded exactly 1記事・exactly 1箇所のみ（CLIでslug/id/URL/置換文字列を
 * 差し替え不可）:
 *   slug = study-work-ie / id = c5056b5e-6176-4218-9101-7f39e47350f7
 *   approved source id = d6e4a7fe-eb76-4f34-af17-9d4c8758c18e（country_sources、
 *   既存登録済み。本scriptはregistry追加を一切行わない）
 *
 * exact mutation scope（1箇所のみ、これ以外のcontent変更は0）:
 *   EN Reference行: "Irish Naturalisation and Immigration Service (INIS)"
 *     （旧名称・inis.gov.ie、現在approved registry非該当） →
 *     "Immigration Service Delivery (Ireland)"（現行公式名称・approved root URL、
 *     Batch3でstudy-country-ieのEN Referenceに対しCodexが承認済みの表現を再利用）
 *   JA body / EN body / ZH body / JA Reference / ZH Reference = 無変更
 *
 * FAQ live factual guard（`.../frequently-asked-questions-for-students/`）:
 *   country_sourcesへは登録しない（Option AでFAQ subpageはsource INSERT対象外）。
 *   本文のStamp 2週20時間/40時間就労ルールclaimがofficial page文言と矛盾しないことを
 *   read-onlyで確認するためだけに使用する。今回body変更は行わないため、このguardは
 *   「body変更0のまま進めてよい」ことを裏付けるsafety前提確認であり、書き込み対象ではない。
 *
 * 安全設計（CZ script `patch-study-country-cz-validator.ts` の最新監査済みpatternを再利用）:
 *   - SOURCE_ID authoritative row query: throwなし・error==null・Array.isArray・
 *     length===1・id/country_code/purpose/status/url全一致をAND guard
 *   - IE registry-wide duplicate query: SOURCE_ID限定ではなくcountry_code=ie全rowsに対し
 *     raw exact/normalized件数を確認（別IDによる重複を検出できるようにする）
 *   - exact substring/物理行occurrence guard（old=1, new=0を事前確認）
 *   - round-trip invariant（NEW→OLD逆置換でoriginal contentとdeep-equal）により
 *     対象1行以外の差分が存在しないことを保証
 *   - DRY_RUNがデフォルト。実際のDB CASには `--apply` に加え、環境変数
 *     `ALLOW_PRODUCTION_STUDY_PATCH` が厳密に文字列 "1" と一致することが必要（CZと同じgate再利用）
 *   - 本番反映は `study_blog_posts_cas_update_content()` RPC（compare-and-swap）経由のみ。
 *     .update()/.insert()/.upsert()/.delete() によるfallbackは行わない。country_sources
 *     への書き込み（登録追加含む）は一切行わない
 *   - CAS dispatch後にconfirmed条件を満たさない全ケース（throw/error/malformed/wrong-ID等）は
 *     ambiguous recovery handlerへ集約し、read-only recovery SELECTをexactly1回だけ行う。
 *     wrong-ID/wrong-slug rowはcontent比較前にidentity_mismatchとして弾く（not_observedへの
 *     誤降格を防止）
 *   - CAS成功後はDB再SELECTし、content deep-equal・fresh approved source再取得によるvalidator
 *     PASS・非content列の不変（INVARIANT_FIELDS）をすべて再確認する
 *
 * 使い方:
 *   npx tsx scripts/patch-study-work-ie-validator.ts            (DRY_RUN)
 *   npx tsx scripts/patch-study-work-ie-validator.ts --apply    (要 ALLOW_PRODUCTION_STUDY_PATCH=1)
 */
import { existsSync, readFileSync } from "fs";
import { createHash } from "node:crypto";
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
  console.error("   例: ALLOW_PRODUCTION_STUDY_PATCH=1 npx tsx scripts/patch-study-work-ie-validator.ts --apply");
  process.exit(1);
}
const DRY_RUN = !APPLY;

// ===== hard-coded target（1件のみ） =====
const TARGET_SLUG = "study-work-ie";
const TARGET_ARTICLE_ID = "c5056b5e-6176-4218-9101-7f39e47350f7";
const TARGET_COUNTRY = "ie";
const APPROVED_SOURCE_ID = "d6e4a7fe-eb76-4f34-af17-9d4c8758c18e";
const APPROVED_SOURCE_URL = "https://www.irishimmigration.ie/";
// FAQ_URLはcountry_sourcesへ登録しない。body claim（Stamp 2週20/40時間ルール）が
// official pageと矛盾しないことをread-onlyで確認するためだけに使うfactual safety guard。
const FAQ_URL = "https://www.irishimmigration.ie/coming-to-study-in-ireland/frequently-asked-questions-for-students/";

// ===== 宣言的exact operation（1箇所のみ） =====
const OLD_LINE = "- [Irish Naturalisation and Immigration Service (INIS)](http://www.inis.gov.ie/)";
const NEW_LINE = `- [Immigration Service Delivery (Ireland)](${APPROVED_SOURCE_URL})`;
// BEFORE validatorが返すべきexactly1件のreason文字列（study-publication-quality.tsの
// validateStudyPublication実装から確認済み）。hard gateとして厳密一致を要求する。
const EXPECTED_BEFORE_REASON = "content.en の参考資料section内URLがapproved source（country_sources）と一致しない";
const TARGET_CATEGORY = "work";

// ===== mutation state model（CZ script precedent） =====
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
  approved_source_id: string;
  approved_source_url: string;

  source_id_row_count: number | null;
  ie_registry_row_count: number | null;
  candidate_registry_raw_exact_count: number | null;
  candidate_registry_normalized_count: number | null;
  approved_source_count: number | null;
  approved_candidate_match: number | null;
  root_source_precondition_passed: boolean | null;
  faq_factual_precondition_passed: boolean | null;

  article_row_count: number | null;
  article_category: string | null;
  article_category_match: boolean | null;
  article_precondition_passed: boolean | null;
  content_sha256: string | null;

  validator_before: "PASS" | "FAIL" | null;
  validator_before_reason_count: number | null;
  validator_before_exact_reason_match: boolean | null;

  old_whole_count: number | null;
  old_reference_count: number | null;
  new_before_whole_count: number | null;
  new_before_reference_count: number | null;
  old_ja_reference_count: number | null;
  old_zh_reference_count: number | null;

  candidate_before_ja: number | null;
  candidate_before_en: number | null;
  candidate_before_zh: number | null;

  allowed_mutation_invariant: boolean | null;
  round_trip_invariant: boolean | null;
  reference_invariant: boolean | null;
  non_target_deep_equal: boolean | null;

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
    approved_source_id: APPROVED_SOURCE_ID,
    approved_source_url: APPROVED_SOURCE_URL,
    source_id_row_count: null,
    ie_registry_row_count: null,
    candidate_registry_raw_exact_count: null,
    candidate_registry_normalized_count: null,
    approved_source_count: null,
    approved_candidate_match: null,
    root_source_precondition_passed: null,
    faq_factual_precondition_passed: null,
    article_row_count: null,
    article_category: null,
    article_category_match: null,
    article_precondition_passed: null,
    content_sha256: null,
    validator_before: null,
    validator_before_reason_count: null,
    validator_before_exact_reason_match: null,
    old_whole_count: null,
    old_reference_count: null,
    new_before_whole_count: null,
    new_before_reference_count: null,
    old_ja_reference_count: null,
    old_zh_reference_count: null,
    candidate_before_ja: null,
    candidate_before_en: null,
    candidate_before_zh: null,
    allowed_mutation_invariant: null,
    round_trip_invariant: null,
    reference_invariant: null,
    non_target_deep_equal: null,
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

function contentSha256(content: unknown): string {
  return createHash("sha256").update(JSON.stringify(content), "utf-8").digest("hex");
}

// ===== root official source fetch precondition（operator identity確認） =====
async function fetchPrecondition(url: string): Promise<{ ok: true; html: string } | { ok: false; reason: string }> {
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
    return { ok: false, reason: `fetch失敗: ${msg}` };
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

// root URLはportalのhomepageのためStamp 2等のmaterial claimは含まれない想定。
// ここではofficial operator identityのみを確認する（third-party/parked/error page除外）。
function validateRootIdentity(html: string): { ok: true } | { ok: false; reason: string } {
  const norm = normalizeForMarkerCheck(html);
  if (!norm.includes("immigration service delivery")) {
    return { ok: false, reason: "必須identity marker欠落: 'Immigration Service Delivery'" };
  }
  if (!norm.includes("department of justice")) {
    return { ok: false, reason: "必須identity marker欠落: 'Department of Justice'" };
  }
  return { ok: true };
}

// FAQ subpageはregistryへ登録しない。body claim（Stamp 2週20/40時間ルール）が
// official pageと矛盾しないことを確認するためのfactual safety guardのみ。
function validateFaqFactual(html: string): { ok: true } | { ok: false; reason: string } {
  const norm = normalizeForMarkerCheck(html);
  if (!norm.includes("immigration service delivery")) {
    return { ok: false, reason: "FAQ page identity marker欠落: 'Immigration Service Delivery'" };
  }
  if (!norm.includes("stamp 2")) {
    return { ok: false, reason: "必須material marker欠落: 'Stamp 2'" };
  }
  if (!norm.includes("non-eea")) {
    return { ok: false, reason: "必須material marker欠落: 'non-EEA'（student context）" };
  }
  if (!norm.includes("20 hours")) {
    return { ok: false, reason: "必須material marker欠落: term-time '20 hours'" };
  }
  if (!norm.includes("40 hours")) {
    return { ok: false, reason: "必須material marker欠落: vacation '40 hours'" };
  }
  if (!norm.includes("without an employment permit")) {
    return { ok: false, reason: "必須material marker欠落: 'without an employment permit'" };
  }
  for (const month of ["june", "july", "august", "september"]) {
    if (!norm.includes(month)) return { ok: false, reason: `必須material marker欠落: vacation month '${month}'` };
  }
  if (!norm.includes("15 december")) {
    return { ok: false, reason: "必須material marker欠落: '15 december'" };
  }
  if (!norm.includes("15 january")) {
    return { ok: false, reason: "必須material marker欠落: '15 january'" };
  }
  return { ok: true };
}

// ===== ambiguous CAS outcome recovery handler（CZ script precedent） =====
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
      s.recovery_outcome = "expected_content_observed";
      return fail(s, "cas_ambiguous", "CAS dispatch結果はambiguousでしたが、recovery SELECTでexpected content（patch後の内容）が観測されました。安全側でambiguousを維持し、自動的にsuccess扱いにはしません。");
    }
    if (isDeepStrictEqual(freshContent, row.content)) {
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
  console.log(`=== study-work-ie validator patch (${s.mode}) ===`);
  console.log(`target: ${TARGET_SLUG} / ${TARGET_ARTICLE_ID}\n`);

  try {
    // 1a. APPROVED_SOURCE_ID authoritative row query
    const { data: srcIdRows, error: srcIdErr } = await supabase
      .from("country_sources")
      .select("id, country_code, purpose, status, url")
      .eq("id", APPROVED_SOURCE_ID);
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
    if (r.id !== APPROVED_SOURCE_ID) {
      return finish(fail(s, "source_registry", `SOURCE_ID authoritative row: returned id不一致 (expected=${APPROVED_SOURCE_ID}, actual=${String(r.id)})`));
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
    if (r.url !== APPROVED_SOURCE_URL) {
      return finish(fail(s, "source_registry", `SOURCE_ID authoritative row: url不一致 (actual=${String(r.url)})`));
    }

    // 1b. IE registry-wide duplicate query（SOURCE_ID限定では別IDによる同一URL重複を検出できない）
    const { data: ieRows, error: ieErr } = await supabase
      .from("country_sources")
      .select("id, url")
      .eq("country_code", TARGET_COUNTRY);
    if (ieErr) return finish(fail(s, "source_registry", `IE registry SELECT error: ${ieErr.message}`));
    if (!Array.isArray(ieRows)) return finish(fail(s, "source_registry", "IE registry SELECT returned malformed data (data null/undefined/non-array)"));
    s.ie_registry_row_count = ieRows.length;
    const malformedRow = ieRows.find((row) => typeof row.url !== "string");
    if (malformedRow) {
      return finish(fail(s, "source_registry", `IE registry内にurlがstring型でないrowがあります (id=${(malformedRow as any).id})`));
    }
    const rawExactCount = ieRows.filter((row) => row.url === APPROVED_SOURCE_URL).length;
    s.candidate_registry_raw_exact_count = rawExactCount;
    if (rawExactCount !== 1) {
      return finish(fail(s, "source_registry", `IE registry raw exact count=${rawExactCount}（期待1、別IDによる重複の可能性）`));
    }
    const targetNorm = normalizeUrl(APPROVED_SOURCE_URL);
    const normalizedCount = ieRows.filter((row) => normalizeUrl(row.url) === targetNorm).length;
    s.candidate_registry_normalized_count = normalizedCount;
    if (normalizedCount !== 1) {
      return finish(fail(s, "source_registry", `IE registry normalized count=${normalizedCount}（期待1、別IDによる重複の可能性）`));
    }

    const approved = await getApprovedSources(supabase, TARGET_COUNTRY);
    s.approved_source_count = approved.length;
    const approvedMatch = approved.filter((a) => a.normalized === targetNorm).length;
    s.approved_candidate_match = approvedMatch;
    if (approvedMatch !== 1) {
      return finish(fail(s, "source_registry", `getApprovedSources("ie")一致件数=${approvedMatch}（期待1）`));
    }

    // 2. root official source fetch precondition（operator identity確認のみ）
    const rootFetch = await fetchPrecondition(APPROVED_SOURCE_URL);
    if (!rootFetch.ok) {
      s.root_source_precondition_passed = false;
      return finish(fail(s, "root_source_fetch", rootFetch.reason));
    }
    const rootIdentity = validateRootIdentity(rootFetch.html);
    if (!rootIdentity.ok) {
      s.root_source_precondition_passed = false;
      return finish(fail(s, "root_source_validation", rootIdentity.reason));
    }
    s.root_source_precondition_passed = true;
    console.log("  root source precondition: PASS（Immigration Service Delivery / Department of Justice identity確認）");

    // 3. FAQ live factual guard（registryへは登録しない。body claim安全性確認のみ）
    const faqFetch = await fetchPrecondition(FAQ_URL);
    if (!faqFetch.ok) {
      s.faq_factual_precondition_passed = false;
      return finish(fail(s, "faq_fetch", faqFetch.reason));
    }
    const faqFactual = validateFaqFactual(faqFetch.html);
    if (!faqFactual.ok) {
      s.faq_factual_precondition_passed = false;
      return finish(fail(s, "faq_validation", faqFactual.reason));
    }
    s.faq_factual_precondition_passed = true;
    console.log("  FAQ factual guard: PASS（Stamp 2週20時間/40時間ルールがofficial pageと整合、body変更0のまま進めてよいことを確認。registry未登録）");

    // 4. fresh article SELECT
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
    if (row.slug !== TARGET_SLUG) {
      return finish(fail(s, "article_precondition", `slug不一致: expected=${TARGET_SLUG} actual=${row.slug}`));
    }
    // Medium #1: category="work"をpre-CAS hard gate化する（diagnostic-onlyにしない）。
    // null/missing/"country"/その他値はすべてfailureとし、mutation/CASへ進ませない。
    s.article_category = row.category ?? null;
    s.article_category_match = row.category === TARGET_CATEGORY;
    if (!s.article_category_match) {
      return finish(fail(s, "article_precondition", `category不一致: expected=${TARGET_CATEGORY} actual=${String(row.category)}`));
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
    s.content_sha256 = contentSha256(row.content);

    // 5. BEFORE validator gate（Medium #2: exact reason hard gate）
    // 単なるFAIL/reason countだけでなく、reasonsがexactly1件かつその1件がEN Reference
    // mismatchというexact文字列と完全一致することまでhard gateする。他reason混入・
    // reasons非配列・順序異常等はすべてfailureとし、mutation/CASへ進ませない。
    const before = validateStudyPublication({ title: row.title, description: row.description, content: row.content, approvedSources: approved });
    s.validator_before = before.ok ? "PASS" : "FAIL";
    s.validator_before_reason_count = Array.isArray(before.reasons) ? before.reasons.length : null;
    console.log(`  BEFORE validator: ${s.validator_before} (${s.validator_before_reason_count} reasons): ${JSON.stringify(before.reasons)}`);
    if (before.ok) {
      return finish(fail(s, "validator_before", "BEFORE validatorがPASSしています（想定外のdrift、FAILを期待）"));
    }
    if (!Array.isArray(before.reasons)) {
      s.validator_before_exact_reason_match = false;
      return finish(fail(s, "validator_before", "BEFORE validator reasonsがarrayではありません（malformed）"));
    }
    s.validator_before_exact_reason_match =
      before.reasons.length === 1 && before.reasons[0] === EXPECTED_BEFORE_REASON;
    if (!s.validator_before_exact_reason_match) {
      return finish(
        fail(
          s,
          "validator_before",
          `BEFORE validator reasonsがexpected exact reasonと一致しません（期待: 1件・"${EXPECTED_BEFORE_REASON}"のみ、実際: ${JSON.stringify(before.reasons)}）`
        )
      );
    }

    // 6. exact occurrence guards（EN Reference行のみ）
    // Medium #3: whole-content countsをdiagnostic-onlyから hard gate 化する。
    // Reference section内だけでなく、EN全文中でもOLDがexactly1件・NEWが0件であることを
    // 要求する（本文中の重複や別箇所への意図しない出現を許容しない）。
    s.old_whole_count = countSubstring(row.content.en, OLD_LINE);
    s.new_before_whole_count = countSubstring(row.content.en, NEW_LINE);
    if (s.old_whole_count !== 1) {
      return finish(fail(s, "mutation_guard", `EN全文中のOLD line occurrence=${s.old_whole_count}（期待1）: "${OLD_LINE}"`));
    }
    if (s.new_before_whole_count !== 0) {
      return finish(fail(s, "mutation_guard", `EN全文中にNEW lineが既に${s.new_before_whole_count}件存在`));
    }

    const enSec = extractSectionLines(row.content.en, "en");
    if (!enSec) return finish(fail(s, "mutation_guard", "EN 参考資料sectionが見つかりません"));
    s.old_reference_count = enSec.lines.filter((l) => l === OLD_LINE).length;
    s.new_before_reference_count = enSec.lines.filter((l) => l === NEW_LINE).length;
    if (s.old_reference_count !== 1) {
      return finish(fail(s, "mutation_guard", `EN Reference内のOLD line occurrence=${s.old_reference_count}（期待1）: "${OLD_LINE}"`));
    }
    if (s.new_before_reference_count !== 0) {
      return finish(fail(s, "mutation_guard", `EN Reference内にNEW lineが既に${s.new_before_reference_count}件存在`));
    }
    const dupBefore = countUrlNormalizedInLines(enSec.lines, APPROVED_SOURCE_URL);
    if (dupBefore !== 0) {
      return finish(fail(s, "mutation_guard", `approved candidate URLが既にEN section内に${dupBefore}件存在`));
    }

    // JA/ZH Referenceの対象行が0であることも確認（JA/ZHは無変更が前提）
    const jaSec = extractSectionLines(row.content.ja, "ja");
    const zhSec = extractSectionLines(row.content.zh, "zh");
    if (!jaSec || !zhSec) return finish(fail(s, "mutation_guard", "JA/ZH 参考資料sectionが見つかりません"));
    s.old_ja_reference_count = jaSec.lines.filter((l) => l === OLD_LINE).length;
    s.old_zh_reference_count = zhSec.lines.filter((l) => l === OLD_LINE).length;
    if (s.old_ja_reference_count !== 0 || s.old_zh_reference_count !== 0) {
      return finish(fail(s, "mutation_guard", "OLD lineがJA/ZH Reference内に存在します（想定外、EN限定のはず）"));
    }

    // candidate occurrence before（Medium #4: diagnostic-onlyからhard scope precondition化）
    // 今回のsafe scopeは「JA/ZHは既にapproved source引用済み・ENだけmissing」という
    // exact stateを前提とする。JA=1/EN=0/ZH=1のいずれかが崩れていたら、EN1行patchだけを
    // 続行する前提が成立しないためfail closedにする。
    s.candidate_before_ja = countUrlNormalizedInLines(jaSec.lines, APPROVED_SOURCE_URL);
    s.candidate_before_en = countUrlNormalizedInLines(enSec.lines, APPROVED_SOURCE_URL);
    s.candidate_before_zh = countUrlNormalizedInLines(zhSec.lines, APPROVED_SOURCE_URL);
    if (s.candidate_before_ja !== 1) {
      return finish(fail(s, "mutation_guard", `candidate URLのJA Reference内occurrence=${s.candidate_before_ja}（期待1）`));
    }
    if (s.candidate_before_en !== 0) {
      return finish(fail(s, "mutation_guard", `candidate URLが既にEN Reference内に${s.candidate_before_en}件存在（期待0）`));
    }
    if (s.candidate_before_zh !== 1) {
      return finish(fail(s, "mutation_guard", `candidate URLのZH Reference内occurrence=${s.candidate_before_zh}（期待1）`));
    }

    // 7. deterministic expected content生成（EN Reference行のみexactly1回置換）
    const newContent: Record<string, string> = { ...(row.content as Record<string, string>) };
    const enAllLines = newContent.en.split("\n");
    const enIdx = enAllLines.findIndex((l: string, i: number) => i >= enSec.startLine && i < enSec.endLine && l === OLD_LINE);
    const newEnLines = [...enAllLines];
    newEnLines[enIdx] = NEW_LINE;
    newContent.en = newEnLines.join("\n");

    // 8. whitelist / round-trip invariant
    s.allowed_mutation_invariant = newContent.ja === row.content.ja && newContent.zh === row.content.zh;
    if (!s.allowed_mutation_invariant) {
      return finish(fail(s, "mutation_guard", "allowed-mutation whitelist invariant違反: JA/ZHが変化しています"));
    }
    const reversedEnLines = [...newEnLines];
    const reversedIdx = reversedEnLines.findIndex((l: string) => l === NEW_LINE);
    reversedEnLines[reversedIdx] = OLD_LINE;
    const reversedEn = reversedEnLines.join("\n");
    s.round_trip_invariant = reversedEn === row.content.en;
    if (!s.round_trip_invariant) {
      return finish(fail(s, "mutation_guard", "round-trip invariant違反: NEW→OLD逆置換がoriginal EN contentと一致しません"));
    }

    // 9. Reference invariant（section位置・行数不変、section内は対象1行以外不変。JA/ZH sectionはdeep-equal）
    const enSecAfter = findRefSection(newContent.en, "en");
    let refInvariantOk = !!enSecAfter;
    if (enSecAfter) {
      const beforeLineCount = enSec.endLine - enSec.startLine;
      const afterLineCount = enSecAfter.endLine - enSecAfter.startLine;
      refInvariantOk = refInvariantOk && beforeLineCount === afterLineCount;
      const afterLines = newContent.en.split("\n").slice(enSecAfter.startLine, enSecAfter.endLine);
      let diffCount = 0;
      for (let i = 0; i < enSec.lines.length; i++) {
        if (enSec.lines[i] !== afterLines[i]) diffCount++;
      }
      refInvariantOk = refInvariantOk && diffCount === 1;
    }
    const jaSecAfter = findRefSection(newContent.ja, "ja");
    const zhSecAfter = findRefSection(newContent.zh, "zh");
    refInvariantOk = refInvariantOk
      && !!jaSecAfter && jaSecAfter.raw === findRefSection(row.content.ja, "ja")!.raw
      && !!zhSecAfter && zhSecAfter.raw === findRefSection(row.content.zh, "zh")!.raw;
    s.reference_invariant = refInvariantOk;
    if (!refInvariantOk) {
      return finish(fail(s, "mutation_guard", "Reference section invariant違反"));
    }

    // 10. non-target deep-equal（EN body: Reference対象1行以外は完全一致）
    const enOutsideBefore = row.content.en.replace(OLD_LINE, "___TARGET___");
    const enOutsideAfter = newContent.en.replace(NEW_LINE, "___TARGET___");
    s.non_target_deep_equal = enOutsideBefore === enOutsideAfter;
    if (!s.non_target_deep_equal) {
      return finish(fail(s, "mutation_guard", "non-target deep-equal違反: EN Reference対象1行以外に差分があります"));
    }

    // 11. hypothetical AFTER validator（DBへは書かない。in-memory評価のみ）
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
      return finish(await handleAmbiguousCasOutcome(s, row, newContent));
    }

    if (rpcError) {
      return finish(await handleAmbiguousCasOutcome(s, row, newContent));
    }
    if (!Array.isArray(rpcData)) {
      return finish(await handleAmbiguousCasOutcome(s, row, newContent));
    }
    if (rpcData.length === 0) {
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
    if (postErr || !postRow) return finish(fail(s, "post_cas_reselect", `post-CAS SELECT failure: ${postErr?.message ?? "no row"}`));
    if (!isDeepStrictEqual(postRow.content, newContent)) {
      return finish(fail(s, "post_cas_reselect", "post-CAS content mismatch: DB上のcontentがCASへ渡したnewContentとdeep-equalではありません"));
    }

    let approvedAfter;
    try {
      approvedAfter = await getApprovedSources(supabase, TARGET_COUNTRY);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return finish(fail(s, "post_cas_reselect", `post-CAS fresh getApprovedSources失敗: ${msg}`));
    }
    const approvedMatchAfter = approvedAfter.filter((a) => a.normalized === targetNorm).length;
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

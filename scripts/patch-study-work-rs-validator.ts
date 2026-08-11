/**
 * BL-20260809-02（Published Study validator debt）study-work-rs専用safe patch。
 *
 * Option A設計: 新規source registry INSERTは行わず、既存approved root source
 * （`https://www.mup.gov.rs`、SOURCE_ID既存登録済み・country_code=rsで唯一のalive行）を
 * EN Referenceへ再利用する。JA/ZHは既にこのURLを引用しvalidator上approved match済みのため、
 * exact mutation scopeはEN Reference行exactly1箇所のみ（body変更0）。
 *
 * 対象はhard-coded exactly 1記事・exactly 1箇所のみ（CLIでslug/id/URL/置換文字列を
 * 差し替え不可）:
 *   slug = study-work-rs / id = 16ea25eb-0780-4bb3-88da-f6834cf88430
 *   approved source id = bbbff58e-ea90-404c-94c9-c1c9f96dd9de（country_sources、
 *   既存登録済み。本scriptはregistry追加を一切行わない）
 *
 * exact mutation scope（1箇所のみ、これ以外のcontent変更は0）:
 *   EN Reference行: "Serbian Ministry of Foreign Affairs"（mfa.gov.rs consular-affairs
 *     subpage、fresh design audit時点でHTTP 404・dead link確認済み） →
 *     "Ministry of Interior of the Republic of Serbia"（現行approved root URL、
 *     JA/ZHが既に「セルビア入国管理局/入境管理局」として引用している組織と同一）
 *   JA body / EN body（対象行以外） / ZH body / JA Reference / ZH Reference = 無変更
 *
 * Citation-quality guard（design audit確認事項をrun-timeでも再検証する）:
 *   - OLD（mfa.gov.rs consular-affairs subpage）は本scriptのroot fetch guard対象外
 *     （dead linkのため事前にfetchしない。design audit時点でHTTP 404を確認済みで、
 *     現在evidence価値がないことがcitation-quality gate PASSの根拠）
 *   - NEW（mup.gov.rs root）は、①official identity（内務省）、②foreigners向け情報への
 *     topical relevance、の2種類のfetch preconditionをrun-timeでも再確認する
 *
 * 安全設計（IE script `patch-study-work-ie-validator.ts` の最新監査済みpatternを再利用。
 * さらに以下2点をIEより安全側へ強化）:
 *   - 未知のCLI引数はsilent ignoreせずnonzero failureとする（IEは`--apply`以外を無視していた）
 *   - BEFORE content SHA-256をhard-coded expected値と厳密一致させるguardを追加
 *     （IEにはcontent SHAの記録はあったがexpected値とのhard gateは無かった）
 *   - SOURCE_ID authoritative row query: throwなし・error==null・Array.isArray・
 *     length===1・id/country_code/purpose/status/url全一致をAND guard
 *   - RS registry-wide duplicate query: SOURCE_ID限定ではなくcountry_code=rs全rowsに対し
 *     raw exact/normalized件数を確認（別IDによる重複を検出できるようにする）
 *   - exact substring/物理行occurrence guard（old=1, new=0を事前確認）
 *   - round-trip invariant（NEW→OLD逆置換でoriginal contentとdeep-equal）により
 *     対象1行以外の差分が存在しないことを保証
 *   - DRY_RUNがデフォルト。実際のDB CASには `--apply` に加え、環境変数
 *     `ALLOW_PRODUCTION_STUDY_PATCH` が厳密に文字列 "1" と一致することが必要（IE/CZと同じgate再利用）
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
 *   npx tsx scripts/patch-study-work-rs-validator.ts            (DRY_RUN)
 *   npx tsx scripts/patch-study-work-rs-validator.ts --apply    (要 ALLOW_PRODUCTION_STUDY_PATCH=1)
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

// ===== CLI引数（未知引数はfail closed。IEはこのguardが無かったため今回追加） =====
const argv = process.argv.slice(2);
const unknownArgs = argv.filter((a) => a !== "--apply");
if (unknownArgs.length > 0) {
  console.error(`エラー: 未知のCLI引数を検出しました: ${JSON.stringify(unknownArgs)}`);
  console.error(`   許可される引数は無し（DRY_RUN）または --apply のみです。`);
  process.exit(1);
}
const APPLY = argv.includes("--apply");
if (APPLY && process.env.ALLOW_PRODUCTION_STUDY_PATCH !== "1") {
  console.error("エラー: --apply には環境変数 ALLOW_PRODUCTION_STUDY_PATCH=1 が必要です（exact match '1' のみ許可）。");
  console.error("   例: ALLOW_PRODUCTION_STUDY_PATCH=1 npx tsx scripts/patch-study-work-rs-validator.ts --apply");
  process.exit(1);
}
const DRY_RUN = !APPLY;

// ===== hard-coded target（1件のみ） =====
const TARGET_SLUG = "study-work-rs";
const TARGET_ARTICLE_ID = "16ea25eb-0780-4bb3-88da-f6834cf88430";
const TARGET_COUNTRY = "rs";
const TARGET_CATEGORY = "work";
const APPROVED_SOURCE_ID = "bbbff58e-ea90-404c-94c9-c1c9f96dd9de";
const APPROVED_SOURCE_URL = "https://www.mup.gov.rs";
// 内務省サイト内の外国人向け情報subpage。country_sourcesへは登録しない（Option Aで
// registry対象はroot URLのみ）。citation-quality design auditで確認したtopical
// relevance（外国人の滞在・登録関連ページの存在）をrun-timeでも再確認するためだけに使う。
const TOPICAL_URL = "https://www.mup.gov.rs/wps/portal/sr/gradjani/Informacije%20za%20strance";

// BEFORE contentのfresh design audit時点のSHA-256。driftしていたらmutationを進めない
// （IEにはこのhard gateが無かったため、RSでは安全側に追加する）。
const EXPECTED_CONTENT_SHA = "ca06a04d450a365c8737e0ec6ca382b59c315c5af341207bde02db393d117764";

// ===== 宣言的exact operation（1箇所のみ） =====
const OLD_LINE = "- [Serbian Ministry of Foreign Affairs](http://www.mfa.gov.rs/en/consular-affairs/entry-serbia/visa-requirements)";
const NEW_LINE = `- [Ministry of Interior of the Republic of Serbia](${APPROVED_SOURCE_URL})`;
// BEFORE validatorが返すべきexactly1件のreason文字列（study-publication-quality.tsの
// validateStudyPublication実装から確認済み）。hard gateとして厳密一致を要求する。
const EXPECTED_BEFORE_REASON = "content.en の参考資料section内URLがapproved source（country_sources）と一致しない";

// ===== mutation state model（IE/CZ script precedent） =====
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
  rs_registry_row_count: number | null;
  rs_total_row_guard_passed: boolean | null;
  candidate_registry_raw_exact_count: number | null;
  candidate_registry_normalized_count: number | null;
  approved_source_count: number | null;
  approved_candidate_match: number | null;
  root_source_precondition_passed: boolean | null;
  topical_source_precondition_passed: boolean | null;

  article_row_count: number | null;
  article_category: string | null;
  article_category_match: boolean | null;
  article_precondition_passed: boolean | null;
  content_sha256: string | null;
  content_sha256_expected_match: boolean | null;

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
  total_mutation_count: number | null;

  validator_after: "PASS" | "FAIL" | null;
  validator_after_reason_count: number | null;
  candidate_after_ja: number | null;
  candidate_after_en: number | null;
  candidate_after_zh: number | null;
  candidate_after_hard_gate_passed: boolean | null;

  cas_attempted: boolean;
  mutation_state: MutationState;
  db_updated: boolean;
  recovery_select_attempted: boolean;
  recovery_select_succeeded: boolean | null;
  recovery_outcome: string | null;

  post_verification_attempted: boolean;
  post_article_row_count: number | null;
  post_article_id_match: boolean | null;
  post_content_match: boolean | null;
  post_old_count: number | null;
  post_new_count: number | null;
  post_candidate_ja: number | null;
  post_candidate_en: number | null;
  post_candidate_zh: number | null;
  post_validator_ok: boolean | null;
  post_validator_reason_count: number | null;
  post_rs_total_row_count: number | null;
  post_source_row_count: number | null;
  post_source_id_match: boolean | null;
  post_source_fields_match: boolean | null;
  post_raw_candidate_count: number | null;
  post_normalized_candidate_count: number | null;
  post_approved_candidate_count: number | null;
  post_invariant_fields_ok: boolean | null;

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
    rs_registry_row_count: null,
    rs_total_row_guard_passed: null,
    candidate_registry_raw_exact_count: null,
    candidate_registry_normalized_count: null,
    approved_source_count: null,
    approved_candidate_match: null,
    root_source_precondition_passed: null,
    topical_source_precondition_passed: null,
    article_row_count: null,
    article_category: null,
    article_category_match: null,
    article_precondition_passed: null,
    content_sha256: null,
    content_sha256_expected_match: null,
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
    total_mutation_count: null,
    validator_after: null,
    validator_after_reason_count: null,
    candidate_after_ja: null,
    candidate_after_en: null,
    candidate_after_zh: null,
    candidate_after_hard_gate_passed: null,
    cas_attempted: false,
    mutation_state: "not_observed",
    db_updated: false,
    recovery_select_attempted: false,
    recovery_select_succeeded: null,
    recovery_outcome: null,
    post_verification_attempted: false,
    post_article_row_count: null,
    post_article_id_match: null,
    post_content_match: null,
    post_old_count: null,
    post_new_count: null,
    post_candidate_ja: null,
    post_candidate_en: null,
    post_candidate_zh: null,
    post_validator_ok: null,
    post_validator_reason_count: null,
    post_rs_total_row_count: null,
    post_source_row_count: null,
    post_source_id_match: null,
    post_source_fields_match: null,
    post_raw_candidate_count: null,
    post_normalized_candidate_count: null,
    post_approved_candidate_count: null,
    post_invariant_fields_ok: null,
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

// ===== official source fetch precondition（operator identity / topical relevance確認） =====
const MAX_BODY_BYTES = 5 * 1024 * 1024; // 5MB程度（IE precedentにはなかった簡易guardを追加）
const EXPECTED_HOST = "www.mup.gov.rs";
const MAX_REDIRECT_HOPS = 5;
const FETCH_TIMEOUT_MS = 15_000; // headers取得からbody streaming完了までを1つのbudgetでcoverする

// Codex M2指摘: initial URL / redirect先URLの双方について、scheme・hostname・
// credentials・portをhard gateする（cross-domain redirectだけでなく、HTTP downgrade・
// 埋め込みcredentials・non-default portも拒否する）。suffix matchは行わずexact
// hostname一致のみ許可する（`evil-mup.gov.rs`等のなりすましを排除）。
function assertSafeOfficialUrl(urlStr: string, expectedHost: string): { ok: true; url: URL } | { ok: false; reason: string } {
  let u: URL;
  try {
    u = new URL(urlStr);
  } catch {
    return { ok: false, reason: `不正なURL: ${urlStr}` };
  }
  if (u.protocol !== "https:") {
    return { ok: false, reason: `unsafe protocol: ${u.protocol}（httpsのみ許可、HTTP downgrade拒否）` };
  }
  if (u.username !== "" || u.password !== "") {
    return { ok: false, reason: "URLにembedded credentials（username/password）が含まれています（禁止）" };
  }
  if (u.hostname.toLowerCase() !== expectedHost) {
    return { ok: false, reason: `hostname不一致: ${u.hostname}（期待=${expectedHost}、exact一致のみ許可・suffix match禁止）` };
  }
  if (u.port !== "") {
    return { ok: false, reason: `non-default portは禁止: ${u.port}` };
  }
  return { ok: true, url: u };
}

// mup.gov.rsのroot URLは同一host内のportal pathへ302 redirectする（design audit時点の
// WebFetchでは自動追従されていたため気づきにくいが、`redirect: "manual"`では露見する）。
// 各hop（initial URL含む）でassertSafeOfficialUrlをfetch前に適用し、safety違反があれば
// fetchそのものを行わない。timeoutはheaders取得からbody streaming完了まで1つのAbortControllerで
// coverし、bodyはstreaming readerで累積byte数を監視して上限超過時点で即座に中断する
// （Content-Lengthヘッダの事前確認だけに依存しない。chunked/no-content-length bodyにも対応）。
async function fetchPrecondition(startUrl: string): Promise<{ ok: true; html: string; finalHost: string } | { ok: false; reason: string }> {
  const initialSafety = assertSafeOfficialUrl(startUrl, EXPECTED_HOST);
  if (!initialSafety.ok) return { ok: false, reason: `initial URL safety違反: ${initialSafety.reason}` };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    let currentUrl = startUrl;
    for (let hop = 0; hop <= MAX_REDIRECT_HOPS; hop++) {
      const hopSafety = assertSafeOfficialUrl(currentUrl, EXPECTED_HOST);
      if (!hopSafety.ok) return { ok: false, reason: `hop ${hop} URL safety違反: ${hopSafety.reason}` };

      let res: Response;
      try {
        res = await fetch(currentUrl, {
          signal: controller.signal,
          redirect: "manual",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            Accept: "text/html,*/*;q=0.8",
          },
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return { ok: false, reason: `fetch失敗 (${currentUrl}): ${msg}` };
      }

      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        if (!location) return { ok: false, reason: `HTTP ${res.status}だがLocationヘッダが欠落 (${currentUrl})` };
        let nextUrl: URL;
        try {
          nextUrl = new URL(location, currentUrl);
        } catch {
          return { ok: false, reason: `redirect先URLが不正: ${location}` };
        }
        const nextSafety = assertSafeOfficialUrl(nextUrl.href, EXPECTED_HOST);
        if (!nextSafety.ok) return { ok: false, reason: `redirect先URL safety違反: ${nextSafety.reason}` };
        currentUrl = nextUrl.href;
        continue;
      }

      if (res.status !== 200) return { ok: false, reason: `HTTP ${res.status} (${currentUrl})（期待200または同一host内redirect）` };
      const ct = res.headers.get("content-type") ?? "";
      if (!ct.includes("html")) return { ok: false, reason: `想定外のcontent-type: ${ct}` };
      const cl = res.headers.get("content-length");
      if (cl && Number(cl) > MAX_BODY_BYTES) {
        return { ok: false, reason: `content-lengthが上限(${MAX_BODY_BYTES}bytes)を超過: ${cl}` };
      }
      if (!res.body) return { ok: false, reason: "response bodyがnullです（HTML evidenceを確認できません）" };

      const reader = res.body.getReader();
      const chunks: Buffer[] = [];
      let totalBytes = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            totalBytes += value.byteLength;
            if (totalBytes > MAX_BODY_BYTES) {
              try {
                await reader.cancel();
              } catch {
                // cancel失敗は無視（既にfailure確定のため）
              }
              return { ok: false, reason: `response bodyが上限(${MAX_BODY_BYTES}bytes)をstreaming中に超過しました（chunked/no-content-length bodyでも有効）` };
            }
            chunks.push(Buffer.from(value));
          }
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return { ok: false, reason: `body streaming失敗: ${msg}` };
      }

      const html = Buffer.concat(chunks).toString("utf-8");
      const finalHost = new URL(currentUrl).hostname.toLowerCase();
      if (finalHost !== EXPECTED_HOST) {
        return { ok: false, reason: `final hostが期待値と不一致: ${finalHost}（期待=${EXPECTED_HOST}）` };
      }
      return { ok: true, html, finalHost };
    }
    return { ok: false, reason: `redirect hop数が上限(${MAX_REDIRECT_HOPS})を超過しました` };
  } finally {
    clearTimeout(timer);
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

// root URLはportalのhomepageのため、official operator identityのみを確認する
// （third-party/parked/error page除外）。「унутрашњих послова」はセルビア語で
// 「内務」を意味し、Ministry of Interior（内務省）を示す固有markerとして使用する。
function validateRootIdentity(html: string): { ok: true } | { ok: false; reason: string } {
  const norm = normalizeForMarkerCheck(html);
  if (!norm.includes("унутрашњих послова")) {
    return { ok: false, reason: "必須identity marker欠落: 'унутрашњих послова'（Ministry of Interior）" };
  }
  return { ok: true };
}

// TOPICAL_URLはcountry_sourcesへ登録しない。design auditで確認したtopical relevance
// （外国人向け情報ページの存在）をrun-timeでも再確認するためだけのfactual safety guard。
// 「странце」はセルビア語で「外国人（複数形）」を意味する。
function validateTopicalRelevance(html: string): { ok: true } | { ok: false; reason: string } {
  const norm = normalizeForMarkerCheck(html);
  if (!norm.includes("странце") && !norm.includes("странци") && !norm.includes("странац")) {
    return { ok: false, reason: "必須topical marker欠落: 'странце'/'странци'/'странац'（foreigners）" };
  }
  if (!norm.includes("боравак")) {
    return { ok: false, reason: "必須topical marker欠落: 'боравак'（stay/residence）" };
  }
  return { ok: true };
}

// ===== ambiguous CAS outcome recovery handler（IE/CZ script precedent） =====
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
  console.log(`=== study-work-rs validator patch (${s.mode}) ===`);
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

    // 1b. RS registry-wide duplicate query（SOURCE_ID限定では別IDによる同一URL重複を検出できない）
    const { data: rsRows, error: rsErr } = await supabase
      .from("country_sources")
      .select("id, url")
      .eq("country_code", TARGET_COUNTRY);
    if (rsErr) return finish(fail(s, "source_registry", `RS registry SELECT error: ${rsErr.message}`));
    if (!Array.isArray(rsRows)) return finish(fail(s, "source_registry", "RS registry SELECT returned malformed data (data null/undefined/non-array)"));
    s.rs_registry_row_count = rsRows.length;
    // Codex M1指摘: SOURCE_ID row1件・raw1件・normalized1件だけでは代用せず、
    // country_code=rsのregistry総行数そのものをexact1でCAS前hard gateする。
    s.rs_total_row_guard_passed = rsRows.length === 1;
    if (!s.rs_total_row_guard_passed) {
      return finish(fail(s, "source_registry", `RS registry total row count=${rsRows.length}（期待exactly1。country_code=rsのregistry総行数そのものをhard gateする）`));
    }
    const malformedRow = rsRows.find((row) => typeof row.url !== "string");
    if (malformedRow) {
      return finish(fail(s, "source_registry", `RS registry内にurlがstring型でないrowがあります (id=${(malformedRow as any).id})`));
    }
    const rawExactCount = rsRows.filter((row) => row.url === APPROVED_SOURCE_URL).length;
    s.candidate_registry_raw_exact_count = rawExactCount;
    if (rawExactCount !== 1) {
      return finish(fail(s, "source_registry", `RS registry raw exact count=${rawExactCount}（期待1、別IDによる重複の可能性）`));
    }
    const targetNorm = normalizeUrl(APPROVED_SOURCE_URL);
    const normalizedCount = rsRows.filter((row) => normalizeUrl(row.url) === targetNorm).length;
    s.candidate_registry_normalized_count = normalizedCount;
    if (normalizedCount !== 1) {
      return finish(fail(s, "source_registry", `RS registry normalized count=${normalizedCount}（期待1、別IDによる重複の可能性）`));
    }

    const approved = await getApprovedSources(supabase, TARGET_COUNTRY);
    s.approved_source_count = approved.length;
    const approvedMatch = approved.filter((a) => a.normalized === targetNorm).length;
    s.approved_candidate_match = approvedMatch;
    if (approvedMatch !== 1) {
      return finish(fail(s, "source_registry", `getApprovedSources("rs")一致件数=${approvedMatch}（期待1）`));
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
    console.log("  root source precondition: PASS（Ministry of Interior identity確認）");

    // 3. topical relevance guard（registryへは登録しない。foreigners向け情報の存在確認のみ）
    const topicalFetch = await fetchPrecondition(TOPICAL_URL);
    if (!topicalFetch.ok) {
      s.topical_source_precondition_passed = false;
      return finish(fail(s, "topical_source_fetch", topicalFetch.reason));
    }
    const topicalRelevance = validateTopicalRelevance(topicalFetch.html);
    if (!topicalRelevance.ok) {
      s.topical_source_precondition_passed = false;
      return finish(fail(s, "topical_source_validation", topicalRelevance.reason));
    }
    s.topical_source_precondition_passed = true;
    console.log("  topical relevance guard: PASS（外国人向け情報ページの存在を確認。registry未登録）");

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

    // 4b. content SHA drift guard（IEには無かったが、RSでは安全側に追加する）
    s.content_sha256_expected_match = s.content_sha256 === EXPECTED_CONTENT_SHA;
    if (!s.content_sha256_expected_match) {
      return finish(fail(s, "content_sha_guard", `content SHA-256がexpected値と不一致（期待=${EXPECTED_CONTENT_SHA}, 実際=${s.content_sha256}）。design audit以降にcontentが変化した可能性があるため中止します。`));
    }

    // 5. BEFORE validator gate（exact reason hard gate）
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

    // candidate occurrence before（JA=1/EN=0/ZH=1というexact stateを前提とする）
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
    let diffCount = 0;
    if (enSecAfter) {
      const beforeLineCount = enSec.endLine - enSec.startLine;
      const afterLineCount = enSecAfter.endLine - enSecAfter.startLine;
      refInvariantOk = refInvariantOk && beforeLineCount === afterLineCount;
      const afterLines = newContent.en.split("\n").slice(enSecAfter.startLine, enSecAfter.endLine);
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
    s.total_mutation_count = diffCount;
    if (s.total_mutation_count !== 1) {
      return finish(fail(s, "mutation_guard", `total mutation count=${s.total_mutation_count}（期待1）`));
    }

    // 10. non-target deep-equal（EN body全体: Reference対象1行以外は完全一致）
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

    const enSecAfterLines = extractSectionLines(newContent.en, "en")!;
    const jaSecAfterLines = extractSectionLines(newContent.ja, "ja")!;
    const zhSecAfterLines = extractSectionLines(newContent.zh, "zh")!;
    s.candidate_after_ja = countUrlNormalizedInLines(jaSecAfterLines.lines, APPROVED_SOURCE_URL);
    s.candidate_after_en = countUrlNormalizedInLines(enSecAfterLines.lines, APPROVED_SOURCE_URL);
    s.candidate_after_zh = countUrlNormalizedInLines(zhSecAfterLines.lines, APPROVED_SOURCE_URL);
    // Codex L3指摘: candidate-after 1/1/1 をsummary表示のみに留めず、CAS前のexplicit hard gateにする。
    s.candidate_after_hard_gate_passed =
      s.candidate_after_ja === 1 && s.candidate_after_en === 1 && s.candidate_after_zh === 1;
    if (!s.candidate_after_hard_gate_passed) {
      return finish(
        fail(
          s,
          "mutation_guard",
          `candidate-after hard gate失敗: JA=${s.candidate_after_ja} EN=${s.candidate_after_en} ZH=${s.candidate_after_zh}（期待all1）`
        )
      );
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
    // Codex L4/L5指摘: post-CAS verificationをcontent/approved candidateだけに限定せず、
    // article/OLD-NEW/candidate/source registry(SOURCE_ID exact row・RS total1・raw1・
    // normalized1・approved1)をすべてfreshに再確認し、structured summaryへ記録する。
    s.post_verification_attempted = true;

    const { data: postRow, error: postErr } = await supabase
      .from("study_blog_posts")
      .select("id, slug, category, date, reading_time, title, description, content, is_published, created_at, thumbnail, thumbnail_ja, thumbnail_en, thumbnail_zh, scheduled_publish_at")
      .eq("id", row.id)
      .single();
    if (postErr || !postRow) return finish(fail(s, "post_cas_reselect", `post-CAS SELECT failure: ${postErr?.message ?? "no row"}`));
    s.post_article_row_count = 1;
    s.post_article_id_match = postRow.id === row.id;
    if (!s.post_article_id_match) {
      return finish(fail(s, "post_cas_reselect", `post-CAS article id不一致 (expected=${row.id}, actual=${postRow.id})`));
    }
    s.post_content_match = isDeepStrictEqual(postRow.content, newContent);
    if (!s.post_content_match) {
      return finish(fail(s, "post_cas_reselect", "post-CAS content mismatch: DB上のcontentがCASへ渡したnewContentとdeep-equalではありません"));
    }

    // post OLD0/NEW1の明示recount
    s.post_old_count = countSubstring(postRow.content.en, OLD_LINE);
    s.post_new_count = countSubstring(postRow.content.en, NEW_LINE);
    if (s.post_old_count !== 0) {
      return finish(fail(s, "post_cas_reselect", `post-CAS OLD whole count=${s.post_old_count}（期待0）`));
    }
    if (s.post_new_count !== 1) {
      return finish(fail(s, "post_cas_reselect", `post-CAS NEW whole count=${s.post_new_count}（期待1）`));
    }

    const postEnSec = extractSectionLines(postRow.content.en, "en");
    const postJaSec = extractSectionLines(postRow.content.ja, "ja");
    const postZhSec = extractSectionLines(postRow.content.zh, "zh");
    if (!postEnSec || !postJaSec || !postZhSec) {
      return finish(fail(s, "post_cas_reselect", "post-CAS Reference sectionが見つかりません"));
    }
    s.post_candidate_ja = countUrlNormalizedInLines(postJaSec.lines, APPROVED_SOURCE_URL);
    s.post_candidate_en = countUrlNormalizedInLines(postEnSec.lines, APPROVED_SOURCE_URL);
    s.post_candidate_zh = countUrlNormalizedInLines(postZhSec.lines, APPROVED_SOURCE_URL);
    if (s.post_candidate_ja !== 1 || s.post_candidate_en !== 1 || s.post_candidate_zh !== 1) {
      return finish(
        fail(
          s,
          "post_cas_reselect",
          `post-CAS candidate recount失敗: JA=${s.post_candidate_ja} EN=${s.post_candidate_en} ZH=${s.post_candidate_zh}（期待all1）`
        )
      );
    }

    // post-CAS fresh SOURCE_ID authoritative row full re-verification（BEFORE取得したrと field-by-field比較）
    const { data: postSrcIdRows, error: postSrcIdErr } = await supabase
      .from("country_sources")
      .select("id, country_code, purpose, status, url")
      .eq("id", APPROVED_SOURCE_ID);
    if (postSrcIdErr) return finish(fail(s, "post_cas_reselect", `post-CAS SOURCE_ID SELECT error: ${postSrcIdErr.message}`));
    if (!Array.isArray(postSrcIdRows) || postSrcIdRows.length !== 1) {
      return finish(
        fail(
          s,
          "post_cas_reselect",
          `post-CAS SOURCE_ID row count=${Array.isArray(postSrcIdRows) ? postSrcIdRows.length : "non-array"}（期待1）`
        )
      );
    }
    s.post_source_row_count = postSrcIdRows.length;
    const postSrcRow = postSrcIdRows[0] as { id?: unknown; country_code?: unknown; purpose?: unknown; status?: unknown; url?: unknown };
    s.post_source_id_match = postSrcRow.id === APPROVED_SOURCE_ID;
    s.post_source_fields_match =
      postSrcRow.id === r.id &&
      postSrcRow.country_code === r.country_code &&
      postSrcRow.purpose === r.purpose &&
      postSrcRow.status === r.status &&
      postSrcRow.url === r.url;
    if (!s.post_source_id_match || !s.post_source_fields_match) {
      return finish(
        fail(
          s,
          "post_cas_reselect",
          `post-CAS SOURCE_ID row driftを検出（id_match=${s.post_source_id_match}, fields_match=${s.post_source_fields_match}）`
        )
      );
    }

    // post-CAS fresh RS registry total / raw / normalized / approved再確認（本scriptはcountry_sourcesを
    // 書かないため、driftがあれば外部要因。driftを検出したらverification failureとして報告する）
    const { data: postRsRows, error: postRsErr } = await supabase
      .from("country_sources")
      .select("id, url")
      .eq("country_code", TARGET_COUNTRY);
    if (postRsErr) return finish(fail(s, "post_cas_reselect", `post-CAS RS registry SELECT error: ${postRsErr.message}`));
    if (!Array.isArray(postRsRows)) return finish(fail(s, "post_cas_reselect", "post-CAS RS registry SELECT returned malformed data"));
    s.post_rs_total_row_count = postRsRows.length;
    if (s.post_rs_total_row_count !== 1) {
      return finish(fail(s, "post_cas_reselect", `post-CAS RS registry total=${s.post_rs_total_row_count}（期待1）`));
    }
    const postRawCount = postRsRows.filter((row2) => row2.url === APPROVED_SOURCE_URL).length;
    s.post_raw_candidate_count = postRawCount;
    if (postRawCount !== 1) {
      return finish(fail(s, "post_cas_reselect", `post-CAS raw candidate count=${postRawCount}（期待1）`));
    }
    const postNormalizedCount = postRsRows.filter((row2) => normalizeUrl(row2.url) === targetNorm).length;
    s.post_normalized_candidate_count = postNormalizedCount;
    if (postNormalizedCount !== 1) {
      return finish(fail(s, "post_cas_reselect", `post-CAS normalized candidate count=${postNormalizedCount}（期待1）`));
    }

    let approvedAfter;
    try {
      approvedAfter = await getApprovedSources(supabase, TARGET_COUNTRY);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return finish(fail(s, "post_cas_reselect", `post-CAS fresh getApprovedSources失敗: ${msg}`));
    }
    const approvedMatchAfter = approvedAfter.filter((a) => a.normalized === targetNorm).length;
    s.post_approved_candidate_count = approvedMatchAfter;
    if (approvedMatchAfter !== 1) {
      return finish(fail(s, "post_cas_reselect", `post-CAS approved candidate match=${approvedMatchAfter}（期待1）`));
    }

    const postValidate = validateStudyPublication({ title: postRow.title, description: postRow.description, content: postRow.content, approvedSources: approvedAfter });
    s.post_validator_ok = postValidate.ok;
    s.post_validator_reason_count = postValidate.reasons.length;
    if (!postValidate.ok) return finish(fail(s, "post_cas_reselect", `post-CAS validator != PASS: ${JSON.stringify(postValidate.reasons)}`));

    const invariantCheck = invariantFieldsUnchanged(row, postRow);
    s.post_invariant_fields_ok = invariantCheck.ok;
    if (!invariantCheck.ok) return finish(fail(s, "post_cas_reselect", `content以外のfield変更検知: ${invariantCheck.changed.join(",")}`));

    console.log("  post-CAS検証PASS（content deep-equal・OLD0/NEW1/candidate1,1,1再確認・fresh source registry(SOURCE_ID/RS total/raw/normalized/approved)再確認・fresh validator PASS・非content列不変を確認）");
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

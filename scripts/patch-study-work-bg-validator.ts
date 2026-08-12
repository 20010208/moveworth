/**
 * BL-20260809-02（Published Study validator debt）study-work-bg専用safe patch。
 *
 * 設計上の重要な前提（IE/RS/AEとの違い）:
 *   IE/RS/AEはいずれも「1言語のみ1 Reference行を置換」パターンだったが、BGは異なる。
 *   ENは既に承認済みsource（`https://www.mfa.bg/en`、Bulgarian Ministry of Foreign
 *   Affairs）を引用しvalidator PASS済み。JA/ZHはいずれも別のURL（`https://www.mvr.bg/en`、
 *   country_sources上ではstatus=unverifiedのため未承認）を引用しておりFAILしている。
 *
 *   fresh design audit（Claude）→ Codex独立design re-auditで確認済みの結論:
 *     - ENが既に使用している承認済みsource（mfa.bg/en）をJA/ZHへも再利用する
 *       （新規source選定は不要、registry insert不要）
 *     - JA/ZHのラベルはregistry記録のpage_title_ja="外務省"/page_title_zh="外交部"に
 *       準拠し、ENの組織identity（Bulgarian Ministry of Foreign Affairs）と一致させる
 *     - ENは変更しない（既にPASS済みのため、blast radius拡大を避ける）
 *
 *   この設計差により、mutation shapeもIE/RS/AEと異なる:
 *     対象は1記事・exactly 2箇所（JA Reference 1行、ZH Reference 1行）。EN=0箇所。
 *     candidate occurrence: BEFORE=JA0/EN1/ZH0 → AFTER=JA1/EN1/ZH1
 *
 * 対象はhard-coded exactly 1記事・exactly 2箇所のみ（CLIでslug/id/URL/置換文字列を
 * 差し替え不可）:
 *   slug = study-work-bg / id = 40eb6a6d-9d25-41d4-9e46-df51e8f4ccb6
 *   approved source id = 633f0216-ac9a-46eb-b6e6-f665e163f6cb（country_sources、
 *   既存登録済み。本scriptはregistry追加を一切行わない）
 *
 * exact mutation scope（2箇所のみ、これ以外のcontent変更は0）:
 *   JA Reference行: "ブルガリア入国管理局"(mvr.bg/en、status=unverifiedのため未承認) →
 *     "ブルガリア外務省"(mfa.bg/en、既にENで承認済み・validator PASS実証済み)
 *   ZH Reference行: "保加利亚入境管理局"(mvr.bg/en) → "保加利亚外交部"(mfa.bg/en)
 *   EN body全体 / JA body（対象行以外） / ZH body（対象行以外） = 無変更
 *
 * BG registry実測値（Codex design re-audit確認済み。Claude旧design報告のalive=6は誤記、
 * 絶対に使わない）:
 *   registry total = 7（study purpose4件+tax purpose1件+visa purpose2件）
 *   alive = 4（mfa.bg/en, bulgariatravel.org/en, iisda...38527, iisda...21815）
 *   unverified = 3（mvr.bg/en, mon.bg/en, nra.bg）
 *   approved（status=alive かつ purpose∈{study,visa}） = 4
 *
 * 安全設計（IE/RS/AE scriptの最新監査済みpatternを再利用）:
 *   - 未知のCLI引数はfail closed
 *   - BEFORE content SHA-256をhard-coded expected値と厳密一致させるguard
 *   - SOURCE_ID authoritative row query: throwなし・error==null・Array.isArray・
 *     length===1・id/country_code/purpose/status/url全一致をAND guard
 *   - BG registry-wide duplicate query: SOURCE_ID限定ではなくcountry_code=bg全rowsに対し
 *     raw exact/normalized件数を確認（別IDによる重複を検出できるようにする）
 *   - exact substring/物理行occurrence guard（JA/ZHそれぞれold=1, new=0を事前確認）
 *   - round-trip invariant（NEW→OLD逆置換でoriginal contentとdeep-equal、JA/ZH両方）
 *   - Codex M2: inverse reconstructed contentのSHAをEXPECTED_CONTENT_SHAと厳密一致させる
 *     hard gate（structural round-tripと併用、どちらか一方では代替しない）
 *   - official evidence guard: RS V2で確立したsafe URL policy（HTTPS限定・exact
 *     hostname一致・credentials拒否・non-default port拒否・same-host redirectのみ
 *     追従・streaming 5MB上限・timeoutがbody read完了までcover）をそのまま再利用
 *   - Codex design re-audit指摘: MFA公式サイトはRadware/WAF error pageを間欠的に返す
 *     ことが確認されているため、HTTP 200だけでofficial evidence PASSにしない。
 *     block/challenge/error page markerを検出したら明示的にfail closedする
 *     （validateOfficialEvidence内でidentity/topical markerの確認に加え、
 *     block-page markerの不在とbody長の最低しきい値を必須条件とする）
 *   - DRY_RUNがデフォルト。実際のDB CASには `--apply` に加え、環境変数
 *     `ALLOW_PRODUCTION_STUDY_PATCH` が厳密に文字列 "1" と一致することが必要
 *   - 本番反映は `study_blog_posts_cas_update_content()` RPC（compare-and-swap）経由のみ。
 *     .update()/.insert()/.upsert()/.delete() によるfallbackは行わない。country_sources
 *     への書き込みは一切行わない
 *   - CAS dispatch後にconfirmed条件を満たさない全ケースはambiguous recovery handler
 *     へ集約し、read-only recovery SELECTをexactly1回だけ行う
 *   - CAS成功後はDB再SELECTし、content deep-equal・fresh approved source再取得による
 *     validator PASS・非content列の不変（INVARIANT_FIELDS）・source registry不変を
 *     すべて再確認する
 *   - Codex M3: successful CAS後にglobal production post-recountを実行し、
 *     removed FAIL slugがexactly study-work-bgのみ・added0であることをhard gateする
 *
 * 使い方:
 *   npx tsx scripts/patch-study-work-bg-validator.ts            (DRY_RUN)
 *   npx tsx scripts/patch-study-work-bg-validator.ts --apply    (要 ALLOW_PRODUCTION_STUDY_PATCH=1)
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

// ===== CLI引数（未知引数はfail closed） =====
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
  console.error("   例: ALLOW_PRODUCTION_STUDY_PATCH=1 npx tsx scripts/patch-study-work-bg-validator.ts --apply");
  process.exit(1);
}
const DRY_RUN = !APPLY;

// ===== hard-coded target（1件のみ） =====
const TARGET_SLUG = "study-work-bg";
const TARGET_ARTICLE_ID = "40eb6a6d-9d25-41d4-9e46-df51e8f4ccb6";
const TARGET_COUNTRY = "bg";
const TARGET_CATEGORY = "work";
const APPROVED_SOURCE_ID = "633f0216-ac9a-46eb-b6e6-f665e163f6cb";
const APPROVED_SOURCE_URL = "https://www.mfa.bg/en";

// BEFORE contentのfresh design audit時点のSHA-256。driftしていたらmutationを進めない。
const EXPECTED_CONTENT_SHA = "0a96e27f4e2c238b240341a15daeb84916774723dad500761bd096a13a11303d";
// design audit時点でin-memory算出済みのexpected AFTER SHA。M1: newContent生成後に
// freshに再計算した値がこれとexact一致しない場合はCAS禁止。
const EXPECTED_AFTER_CONTENT_SHA = "113588396d6833f00c31645b0006a7794547449b883095daee7f353704e1dc2f";

// ===== 宣言的exact operation（2箇所のみ: JA1・ZH1、EN0） =====
const OLD_LINE_JA = "- [ブルガリア入国管理局](https://www.mvr.bg/en)";
const NEW_LINE_JA = "- [ブルガリア外務省](https://www.mfa.bg/en)";
const OLD_LINE_ZH = "- [保加利亚入境管理局](https://www.mvr.bg/en)";
const NEW_LINE_ZH = "- [保加利亚外交部](https://www.mfa.bg/en)";
// EN側の既存承認済みcitation行（変更しない、existence guardのみに使う）
const EN_APPROVED_LINE = "- [Bulgarian Ministry of Foreign Affairs](https://www.mfa.bg/en)";

// BEFORE validatorが返すべきexactly2件のreason文字列。hard gateとして厳密一致を要求する。
// validateStudyPublication内のlangs走査順（ja→en→zh）に合わせ、ja reasonが先、zh reasonが後。
const EXPECTED_BEFORE_REASON_JA = "content.ja の参考資料section内URLがapproved source（country_sources）と一致しない";
const EXPECTED_BEFORE_REASON_ZH = "content.zh の参考資料section内URLがapproved source（country_sources）と一致しない";
const EXPECTED_BEFORE_REASONS: readonly string[] = [EXPECTED_BEFORE_REASON_JA, EXPECTED_BEFORE_REASON_ZH];

// ===== Codex design re-audit確認済みのfresh BG registry期待値（M4/M5） =====
// country_code=bg のregistry総行数（study4+tax1+visa2）。pre-CAS hard gate、driftしたら中止。
// 【重要】alive=6は誤記であり絶対に使わない。実測はalive4・unverified3・total7。
const EXPECTED_BG_TOTAL_SOURCE_ROWS = 7;
// getApprovedSources("bg")が返すapproved candidate総数（study/visa purpose・alive のみ）。
const EXPECTED_BG_APPROVED_SOURCE_COUNT = 4;

// ===== Codex code audit指摘M3相当: successful APPLY後のglobal production post-recount用 =====
// fresh triage / design audit時点で確認済みのBEFORE FAIL26 slug set（固定値）。
// production APPLY成功後、このsetから exactly `study-work-bg` のみが除去され、
// 新規追加が0件であることをhard gateする。
const EXPECTED_BEFORE_FAIL_SLUGS: readonly string[] = [
  "study-country-br", "study-country-es", "study-country-ge", "study-country-no",
  "study-country-se", "study-country-th", "study-country-tn", "study-work-bg",
  "study-work-br", "study-work-cn", "study-work-cy", "study-work-cz", "study-work-es",
  "study-work-gb", "study-work-ge", "study-work-hu", "study-work-it", "study-work-kr",
  "study-work-mt", "study-work-no", "study-work-pt", "study-work-se", "study-work-th",
  "study-work-tn", "study-work-vn", "study-work-za",
];
const EXPECTED_AFTER_FAIL_SLUGS: readonly string[] = EXPECTED_BEFORE_FAIL_SLUGS.filter((sl) => sl !== TARGET_SLUG);
const EXPECTED_GLOBAL_TOTAL = 103;
const EXPECTED_GLOBAL_PASS = 78;
const EXPECTED_GLOBAL_FAIL = 25;
const EXPECTED_GLOBAL_COUNTRY_PASS = 44;
const EXPECTED_GLOBAL_COUNTRY_FAIL = 7;
const EXPECTED_GLOBAL_WORK_PASS = 34;
const EXPECTED_GLOBAL_WORK_FAIL = 18;
const EXPECTED_GLOBAL_COUNTRY_SOURCES = 389;

// ===== mutation state model（IE/RS/AE script precedent） =====
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
  bg_registry_row_count: number | null;
  pre_bg_source_total: number | null;
  pre_bg_source_total_match: boolean | null;
  candidate_registry_raw_exact_count: number | null;
  candidate_registry_normalized_count: number | null;
  approved_source_count: number | null;
  pre_approved_source_count_match: boolean | null;
  approved_candidate_match: number | null;
  official_evidence_precondition_passed: boolean | null;

  article_row_count: number | null;
  article_category: string | null;
  article_category_match: boolean | null;
  article_precondition_passed: boolean | null;
  content_sha256: string | null;
  content_sha256_expected_match: boolean | null;

  validator_before: "PASS" | "FAIL" | null;
  validator_before_reason_count: number | null;
  validator_before_exact_reason_match: boolean | null;

  old_ja_whole_count: number | null;
  new_ja_before_whole_count: number | null;
  old_zh_whole_count: number | null;
  new_zh_before_whole_count: number | null;
  old_ja_reference_count: number | null;
  new_ja_before_reference_count: number | null;
  old_zh_reference_count: number | null;
  new_zh_before_reference_count: number | null;
  cross_language_contamination: boolean | null;
  en_approved_line_count: number | null;

  // BG固有 expected BEFORE: JA0/EN1/ZH0（ENが既にmfa.bg/enを引用、JA/ZHは未引用）
  candidate_before_ja: number | null;
  candidate_before_en: number | null;
  candidate_before_zh: number | null;

  allowed_mutation_invariant: boolean | null;
  round_trip_invariant: boolean | null;
  // Codex M2相当: structural round-tripに加え、inverse reconstructed contentの
  // stable hashをEXPECTED_CONTENT_SHAとexact比較するhard gateを追加。
  inverse_reconstructed_sha: string | null;
  inverse_sha_match: boolean | null;
  reference_invariant: boolean | null;
  non_target_deep_equal: boolean | null;
  total_mutation_count: number | null;

  validator_after: "PASS" | "FAIL" | null;
  validator_after_reason_count: number | null;
  // AFTER expected: JA1/EN1/ZH1
  candidate_after_ja: number | null;
  candidate_after_en: number | null;
  candidate_after_zh: number | null;
  candidate_after_hard_gate_passed: boolean | null;
  // Codex M1相当: candidate AFTER SHAをhard gate化（log-onlyにしない）
  candidate_after_content_sha: string | null;
  candidate_after_content_sha_match: boolean | null;

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
  // Codex M1相当: post-CAS content SHAもhard gate化
  post_content_sha: string | null;
  post_content_sha_match: boolean | null;
  post_old_ja_count: number | null;
  post_new_ja_count: number | null;
  post_old_zh_count: number | null;
  post_new_zh_count: number | null;
  post_en_unchanged: boolean | null;
  post_candidate_ja: number | null;
  post_candidate_en: number | null;
  post_candidate_zh: number | null;
  post_validator_ok: boolean | null;
  post_validator_reason_count: number | null;
  post_bg_total_row_count: number | null;
  post_bg_source_total_match: boolean | null;
  post_source_row_count: number | null;
  post_source_id_match: boolean | null;
  post_source_fields_match: boolean | null;
  post_raw_candidate_count: number | null;
  post_normalized_candidate_count: number | null;
  post_approved_candidate_count: number | null;
  post_invariant_fields_ok: boolean | null;

  // Codex M3相当: successful CAS後のglobal production post-recount
  global_verification_attempted: boolean;
  global_verification_success: boolean | null;
  global_total: number | null;
  global_pass: number | null;
  global_fail: number | null;
  global_country_pass: number | null;
  global_country_fail: number | null;
  global_work_pass: number | null;
  global_work_fail: number | null;
  post_global_country_sources: number | null;
  post_global_country_sources_match: boolean | null;
  global_fail_set_count: number | null;
  global_fail_set_unique: number | null;
  global_fail_set_match: boolean | null;
  removed_fail_slugs: string[] | null;
  added_fail_slugs: string[] | null;
  expected_removed_fail_slug: string;
  unexpected_added_fail_count: number | null;
  validator_global_exception_count: number | null;

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
    bg_registry_row_count: null,
    pre_bg_source_total: null,
    pre_bg_source_total_match: null,
    candidate_registry_raw_exact_count: null,
    candidate_registry_normalized_count: null,
    approved_source_count: null,
    pre_approved_source_count_match: null,
    approved_candidate_match: null,
    official_evidence_precondition_passed: null,
    article_row_count: null,
    article_category: null,
    article_category_match: null,
    article_precondition_passed: null,
    content_sha256: null,
    content_sha256_expected_match: null,
    validator_before: null,
    validator_before_reason_count: null,
    validator_before_exact_reason_match: null,
    old_ja_whole_count: null,
    new_ja_before_whole_count: null,
    old_zh_whole_count: null,
    new_zh_before_whole_count: null,
    old_ja_reference_count: null,
    new_ja_before_reference_count: null,
    old_zh_reference_count: null,
    new_zh_before_reference_count: null,
    cross_language_contamination: null,
    en_approved_line_count: null,
    candidate_before_ja: null,
    candidate_before_en: null,
    candidate_before_zh: null,
    allowed_mutation_invariant: null,
    round_trip_invariant: null,
    inverse_reconstructed_sha: null,
    inverse_sha_match: null,
    reference_invariant: null,
    non_target_deep_equal: null,
    total_mutation_count: null,
    validator_after: null,
    validator_after_reason_count: null,
    candidate_after_ja: null,
    candidate_after_en: null,
    candidate_after_zh: null,
    candidate_after_hard_gate_passed: null,
    candidate_after_content_sha: null,
    candidate_after_content_sha_match: null,
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
    post_content_sha: null,
    post_content_sha_match: null,
    post_old_ja_count: null,
    post_new_ja_count: null,
    post_old_zh_count: null,
    post_new_zh_count: null,
    post_en_unchanged: null,
    post_candidate_ja: null,
    post_candidate_en: null,
    post_candidate_zh: null,
    post_validator_ok: null,
    post_validator_reason_count: null,
    post_bg_total_row_count: null,
    post_bg_source_total_match: null,
    post_source_row_count: null,
    post_source_id_match: null,
    post_source_fields_match: null,
    post_raw_candidate_count: null,
    post_normalized_candidate_count: null,
    post_approved_candidate_count: null,
    post_invariant_fields_ok: null,
    global_verification_attempted: false,
    global_verification_success: null,
    global_total: null,
    global_pass: null,
    global_fail: null,
    global_country_pass: null,
    global_country_fail: null,
    global_work_pass: null,
    global_work_fail: null,
    post_global_country_sources: null,
    post_global_country_sources_match: null,
    global_fail_set_count: null,
    global_fail_set_unique: null,
    global_fail_set_match: null,
    removed_fail_slugs: null,
    added_fail_slugs: null,
    expected_removed_fail_slug: TARGET_SLUG,
    unexpected_added_fail_count: null,
    validator_global_exception_count: null,
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

// ===== official source fetch precondition（Ministry of Foreign Affairs公式identity /
// visa-consular topical relevance確認。Radware/WAF error page対策を含む） =====
// RS V2で確立したsafe URL policy（HTTPS限定・exact hostname一致・credentials拒否・
// non-default port拒否・same-host redirectのみ追従・streaming byte上限・timeoutがbody read
// 完了までcover）をそのまま再利用する。
const MAX_BODY_BYTES = 5 * 1024 * 1024;
const EXPECTED_HOST = "www.mfa.bg";
const MAX_REDIRECT_HOPS = 5;
const FETCH_TIMEOUT_MS = 15_000;
// Codex design re-audit指摘: MFA公式サイトはRadware/WAF error pageを間欠的に返すことが
// 確認済みのため、正常pageの最低body長しきい値を設ける（実測231,395文字に対し十分低い値）。
const MIN_VALID_BODY_LENGTH = 5000;

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

      // Codex design re-audit指摘: Radware/WAFはHTTP 403/429/503等でblock pageを返す
      // ことがある。200以外は即fail closed（retryしない）。
      if (res.status !== 200) return { ok: false, reason: `HTTP ${res.status} (${currentUrl})（期待200または同一host内redirect。Radware/WAF block pageの可能性）` };
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
              return { ok: false, reason: `response bodyが上限(${MAX_BODY_BYTES}bytes)をstreaming中に超過しました` };
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

// Codex design re-audit指摘: Radware/WAF/challenge pageのmarkerを明示的に検出し、
// 検出した場合はidentity/topical markerが偶然一致していてもfail closedする。
const BLOCK_PAGE_MARKERS: readonly string[] = [
  "radware",
  "access denied",
  "web application firewall",
  "are you a human",
  "are you human",
  "please verify you are a human",
  "captcha",
  "unusual traffic",
  "automated access",
  "request blocked",
  "bot detection",
  "security check",
  "challenge platform",
  "checking your browser",
];

// MFA rootページ1回のfetchでMinistry of Foreign Affairs identityとvisa/consular
// topical relevanceの両方を確認する。GDRFA等の代替ソースへのfallbackロジックは
// 一切実装しない。official evidence guardが失敗した場合はそのままfail closedで停止する。
function validateOfficialEvidence(html: string): { ok: true } | { ok: false; reason: string } {
  if (html.length < MIN_VALID_BODY_LENGTH) {
    return { ok: false, reason: `response body長が最低しきい値(${MIN_VALID_BODY_LENGTH}文字)未満: ${html.length}文字（Radware/WAF block pageの可能性）` };
  }
  const norm = normalizeForMarkerCheck(html);
  for (const marker of BLOCK_PAGE_MARKERS) {
    if (norm.includes(marker)) {
      return { ok: false, reason: `block/challenge page markerを検出: "${marker}"（Radware/WAF等によるblockの可能性、fail closed）` };
    }
  }
  if (!norm.includes("ministry")) {
    return { ok: false, reason: "必須identity marker欠落: 'ministry'" };
  }
  if (!norm.includes("foreign affairs")) {
    return { ok: false, reason: "必須identity marker欠落: 'foreign affairs'" };
  }
  if (!norm.includes("bulgaria")) {
    return { ok: false, reason: "必須jurisdiction marker欠落: 'bulgaria'" };
  }
  const hasVisaMarker = norm.includes("visa");
  const hasConsularMarker = norm.includes("consular");
  if (!hasVisaMarker && !hasConsularMarker) {
    return { ok: false, reason: "必須topical marker欠落: 'visa'または'consular'のいずれも見つかりません" };
  }
  return { ok: true };
}

// ===== Codex M3相当: successful CAS後のglobal production post-recount =====
function deriveCountryFromSlug(slug: string): { code: string; cat: "work" | "country" | "other" } {
  if (slug.startsWith("study-work-")) return { code: slug.replace("study-work-", ""), cat: "work" };
  if (slug.startsWith("study-country-")) return { code: slug.replace("study-country-", ""), cat: "country" };
  return { code: "", cat: "other" };
}

// 既存validator logic（validateStudyPublication / getApprovedSources、shared utility）を
// そのまま再利用する。新しい独自validatorは作らない。scopeは既存のcountry/work published
// 103件と同一semanticsで評価する。CAS成功済みの事実（mutation_state/db_updated）は
// このrecountの結果に関わらず維持し、rollback/retry/second CASは一切行わない。
async function performGlobalRecount(s: Summary): Promise<void> {
  s.global_verification_attempted = true;
  try {
    const { data: posts, error: postsErr } = await supabase
      .from("study_blog_posts")
      .select("slug, category, title, description, content, is_published")
      .order("slug", { ascending: true });
    if (postsErr) throw new Error(`global post fetch failed: ${postsErr.message}`);
    if (!Array.isArray(posts)) throw new Error("global post fetch returned malformed data (non-array)");

    const { count: srcCount, error: srcCountErr } = await supabase
      .from("country_sources")
      .select("*", { count: "exact", head: true });
    if (srcCountErr) throw new Error(`country_sources count failed: ${srcCountErr.message}`);
    s.post_global_country_sources = typeof srcCount === "number" ? srcCount : null;
    s.post_global_country_sources_match = s.post_global_country_sources === EXPECTED_GLOBAL_COUNTRY_SOURCES;

    const published = posts.filter((p: any) => p.is_published === true);
    const approvedCache = new Map<string, Awaited<ReturnType<typeof getApprovedSources>>>();
    let exceptionCount = 0;
    const results: { slug: string; cat: "work" | "country"; ok: boolean }[] = [];

    for (const p of published as any[]) {
      const { code, cat } = deriveCountryFromSlug(p.slug);
      if (cat === "other") continue;
      try {
        if (!approvedCache.has(code)) {
          approvedCache.set(code, await getApprovedSources(supabase, code));
        }
        const approved = approvedCache.get(code)!;
        const v = validateStudyPublication({ title: p.title, description: p.description, content: p.content, approvedSources: approved });
        results.push({ slug: p.slug, cat, ok: v.ok });
      } catch (e) {
        exceptionCount++;
        results.push({ slug: p.slug, cat, ok: false });
      }
    }
    s.validator_global_exception_count = exceptionCount;

    const total = results.length;
    const pass = results.filter((r) => r.ok).length;
    const countryResults = results.filter((r) => r.cat === "country");
    const workResults = results.filter((r) => r.cat === "work");
    s.global_total = total;
    s.global_pass = pass;
    s.global_fail = total - pass;
    s.global_country_pass = countryResults.filter((r) => r.ok).length;
    s.global_country_fail = countryResults.length - s.global_country_pass;
    s.global_work_pass = workResults.filter((r) => r.ok).length;
    s.global_work_fail = workResults.length - s.global_work_pass;

    const failSlugs = results.filter((r) => !r.ok).map((r) => r.slug).sort();
    s.global_fail_set_count = failSlugs.length;
    s.global_fail_set_unique = new Set(failSlugs).size;

    const expectedAfterSet = new Set(EXPECTED_AFTER_FAIL_SLUGS);
    const actualSet = new Set(failSlugs);
    const missingFromExpected = EXPECTED_AFTER_FAIL_SLUGS.filter((sl) => !actualSet.has(sl));
    const unexpectedExtra = failSlugs.filter((sl) => !expectedAfterSet.has(sl));
    s.global_fail_set_match = missingFromExpected.length === 0 && unexpectedExtra.length === 0;

    const beforeSet = new Set(EXPECTED_BEFORE_FAIL_SLUGS);
    s.removed_fail_slugs = EXPECTED_BEFORE_FAIL_SLUGS.filter((sl) => !actualSet.has(sl));
    s.added_fail_slugs = failSlugs.filter((sl) => !beforeSet.has(sl));
    s.unexpected_added_fail_count = s.added_fail_slugs.length;

    const removedMatchesExpected =
      s.removed_fail_slugs.length === 1 && s.removed_fail_slugs[0] === TARGET_SLUG;

    s.global_verification_success =
      s.validator_global_exception_count === 0 &&
      s.post_global_country_sources_match === true &&
      s.global_total === EXPECTED_GLOBAL_TOTAL &&
      s.global_pass === EXPECTED_GLOBAL_PASS &&
      s.global_fail === EXPECTED_GLOBAL_FAIL &&
      s.global_country_pass === EXPECTED_GLOBAL_COUNTRY_PASS &&
      s.global_country_fail === EXPECTED_GLOBAL_COUNTRY_FAIL &&
      s.global_work_pass === EXPECTED_GLOBAL_WORK_PASS &&
      s.global_work_fail === EXPECTED_GLOBAL_WORK_FAIL &&
      s.global_fail_set_match === true &&
      removedMatchesExpected &&
      s.unexpected_added_fail_count === 0;
  } catch (e) {
    s.global_verification_success = false;
    const msg = e instanceof Error ? e.message : String(e);
    s.failure_reason = (s.failure_reason ? s.failure_reason + " | " : "") + `global_verification_exception: ${msg}`;
  }
}

// ===== ambiguous CAS outcome recovery handler（IE/RS/AE script precedent） =====
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
  console.log(`=== study-work-bg validator patch (${s.mode}) ===`);
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
    if (r.purpose !== "study") {
      return finish(fail(s, "source_registry", `SOURCE_ID authoritative row: purpose不一致 (actual=${String(r.purpose)})`));
    }
    if (r.status !== "alive") {
      return finish(fail(s, "source_registry", `SOURCE_ID authoritative row: status不一致 (actual=${String(r.status)})`));
    }
    if (r.url !== APPROVED_SOURCE_URL) {
      return finish(fail(s, "source_registry", `SOURCE_ID authoritative row: url不一致 (actual=${String(r.url)})`));
    }

    // 1b. BG registry-wide duplicate query（SOURCE_ID限定では別IDによる同一URL重複を検出できない）
    const { data: bgRows, error: bgErr } = await supabase
      .from("country_sources")
      .select("id, url, purpose, status")
      .eq("country_code", TARGET_COUNTRY);
    if (bgErr) return finish(fail(s, "source_registry", `BG registry SELECT error: ${bgErr.message}`));
    if (!Array.isArray(bgRows)) return finish(fail(s, "source_registry", "BG registry SELECT returned malformed data (data null/undefined/non-array)"));
    s.bg_registry_row_count = bgRows.length;
    s.pre_bg_source_total = bgRows.length;
    // M4: BG registry総行数exact7をCAS前hard gateする（Claude旧design報告のalive=6は誤記、使わない）。
    s.pre_bg_source_total_match = bgRows.length === EXPECTED_BG_TOTAL_SOURCE_ROWS;
    if (!s.pre_bg_source_total_match) {
      return finish(fail(s, "source_registry", `BG registry total row count=${bgRows.length}（期待exactly${EXPECTED_BG_TOTAL_SOURCE_ROWS}）`));
    }
    const malformedRow = bgRows.find((row) => typeof row.url !== "string");
    if (malformedRow) {
      return finish(fail(s, "source_registry", `BG registry内にurlがstring型でないrowがあります (id=${(malformedRow as any).id})`));
    }
    const aliveCount = bgRows.filter((row) => row.status === "alive").length;
    const unverifiedCount = bgRows.filter((row) => row.status === "unverified").length;
    console.log(`  BG registry status distribution: alive=${aliveCount} unverified=${unverifiedCount} other=${bgRows.length - aliveCount - unverifiedCount}`);

    const rawExactCount = bgRows.filter((row) => row.url === APPROVED_SOURCE_URL).length;
    s.candidate_registry_raw_exact_count = rawExactCount;
    if (rawExactCount !== 1) {
      return finish(fail(s, "source_registry", `BG registry raw exact count=${rawExactCount}（期待1、別IDによる重複の可能性）`));
    }
    const targetNorm = normalizeUrl(APPROVED_SOURCE_URL);
    const normalizedCount = bgRows.filter((row) => normalizeUrl(row.url) === targetNorm).length;
    s.candidate_registry_normalized_count = normalizedCount;
    if (normalizedCount !== 1) {
      return finish(fail(s, "source_registry", `BG registry normalized count=${normalizedCount}（期待1、別IDによる重複の可能性）`));
    }

    const approved = await getApprovedSources(supabase, TARGET_COUNTRY);
    s.approved_source_count = approved.length;
    // M5: validatorが実際にapproved candidateとして扱うactual set（getApprovedSourcesの
    // 戻り値、study/visa purpose・alive）の件数exact4をCAS前hard gateする。
    s.pre_approved_source_count_match = approved.length === EXPECTED_BG_APPROVED_SOURCE_COUNT;
    if (!s.pre_approved_source_count_match) {
      return finish(fail(s, "source_registry", `BG approved source count(getApprovedSources)=${approved.length}（期待exactly${EXPECTED_BG_APPROVED_SOURCE_COUNT}）`));
    }
    const approvedMatch = approved.filter((a) => a.normalized === targetNorm).length;
    s.approved_candidate_match = approvedMatch;
    if (approvedMatch !== 1) {
      return finish(fail(s, "source_registry", `getApprovedSources("bg")一致件数=${approvedMatch}（期待1）`));
    }

    // 2. official evidence precondition（Ministry of Foreign Affairs identity + visa/consular
    // topical relevance、単一fetch。Radware/WAF block page検出でfail closed）
    const officialFetch = await fetchPrecondition(APPROVED_SOURCE_URL);
    if (!officialFetch.ok) {
      s.official_evidence_precondition_passed = false;
      return finish(fail(s, "official_source_fetch", officialFetch.reason));
    }
    const officialEvidence = validateOfficialEvidence(officialFetch.html);
    if (!officialEvidence.ok) {
      s.official_evidence_precondition_passed = false;
      return finish(fail(s, "official_source_validation", officialEvidence.reason));
    }
    s.official_evidence_precondition_passed = true;
    console.log("  official evidence precondition: PASS（Ministry of Foreign Affairs / Bulgaria / visa-consular topical relevance確認、block-page marker不在確認）");

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

    // 3b. content SHA drift guard
    s.content_sha256_expected_match = s.content_sha256 === EXPECTED_CONTENT_SHA;
    if (!s.content_sha256_expected_match) {
      return finish(fail(s, "content_sha_guard", `content SHA-256がexpected値と不一致（期待=${EXPECTED_CONTENT_SHA}, 実際=${s.content_sha256}）。design audit以降にcontentが変化した可能性があるため中止します。`));
    }

    // 4. BEFORE validator gate（exact reason set hard gate、順序も含めexact一致）
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
      before.reasons.length === EXPECTED_BEFORE_REASONS.length &&
      before.reasons.every((reason, i) => reason === EXPECTED_BEFORE_REASONS[i]);
    if (!s.validator_before_exact_reason_match) {
      return finish(
        fail(
          s,
          "validator_before",
          `BEFORE validator reasonsがexpected exact reason setと一致しません（期待: ${JSON.stringify(EXPECTED_BEFORE_REASONS)}、実際: ${JSON.stringify(before.reasons)}）`
        )
      );
    }

    // 5. exact occurrence guards（JA/ZH Reference行それぞれ独立に、EN既存承認行の存在確認も含む）
    s.old_ja_whole_count = countSubstring(row.content.ja, OLD_LINE_JA);
    s.new_ja_before_whole_count = countSubstring(row.content.ja, NEW_LINE_JA);
    if (s.old_ja_whole_count !== 1) {
      return finish(fail(s, "mutation_guard", `JA全文中のOLD line occurrence=${s.old_ja_whole_count}（期待1）: "${OLD_LINE_JA}"`));
    }
    if (s.new_ja_before_whole_count !== 0) {
      return finish(fail(s, "mutation_guard", `JA全文中にNEW lineが既に${s.new_ja_before_whole_count}件存在`));
    }
    s.old_zh_whole_count = countSubstring(row.content.zh, OLD_LINE_ZH);
    s.new_zh_before_whole_count = countSubstring(row.content.zh, NEW_LINE_ZH);
    if (s.old_zh_whole_count !== 1) {
      return finish(fail(s, "mutation_guard", `ZH全文中のOLD line occurrence=${s.old_zh_whole_count}（期待1）: "${OLD_LINE_ZH}"`));
    }
    if (s.new_zh_before_whole_count !== 0) {
      return finish(fail(s, "mutation_guard", `ZH全文中にNEW lineが既に${s.new_zh_before_whole_count}件存在`));
    }

    const jaSec = extractSectionLines(row.content.ja, "ja");
    const enSec = extractSectionLines(row.content.en, "en");
    const zhSec = extractSectionLines(row.content.zh, "zh");
    if (!jaSec || !enSec || !zhSec) return finish(fail(s, "mutation_guard", "JA/EN/ZH 参考資料sectionが見つかりません"));

    s.old_ja_reference_count = jaSec.lines.filter((l) => l === OLD_LINE_JA).length;
    s.new_ja_before_reference_count = jaSec.lines.filter((l) => l === NEW_LINE_JA).length;
    if (s.old_ja_reference_count !== 1) {
      return finish(fail(s, "mutation_guard", `JA Reference内のOLD line occurrence=${s.old_ja_reference_count}（期待1）: "${OLD_LINE_JA}"`));
    }
    if (s.new_ja_before_reference_count !== 0) {
      return finish(fail(s, "mutation_guard", `JA Reference内にNEW lineが既に${s.new_ja_before_reference_count}件存在`));
    }
    s.old_zh_reference_count = zhSec.lines.filter((l) => l === OLD_LINE_ZH).length;
    s.new_zh_before_reference_count = zhSec.lines.filter((l) => l === NEW_LINE_ZH).length;
    if (s.old_zh_reference_count !== 1) {
      return finish(fail(s, "mutation_guard", `ZH Reference内のOLD line occurrence=${s.old_zh_reference_count}（期待1）: "${OLD_LINE_ZH}"`));
    }
    if (s.new_zh_before_reference_count !== 0) {
      return finish(fail(s, "mutation_guard", `ZH Reference内にNEW lineが既に${s.new_zh_before_reference_count}件存在`));
    }

    // cross-language contamination guard: OLD_LINE_JAがEN/ZHに、OLD_LINE_ZHがEN/JAに
    // 混入していないことを確認（想定外の重複置換を防ぐ）
    const crossContaminated =
      countSubstring(row.content.en, OLD_LINE_JA) > 0 ||
      countSubstring(row.content.zh, OLD_LINE_JA) > 0 ||
      countSubstring(row.content.en, OLD_LINE_ZH) > 0 ||
      countSubstring(row.content.ja, OLD_LINE_ZH) > 0;
    s.cross_language_contamination = crossContaminated;
    if (crossContaminated) {
      return finish(fail(s, "mutation_guard", "OLD_LINE_JA/OLD_LINE_ZHが想定外の言語contentに混入しています"));
    }

    // EN既存承認済み行のexistence guard（変更対象ではないが、存在しなければdesign前提が崩れる）
    s.en_approved_line_count = countSubstring(row.content.en, EN_APPROVED_LINE);
    if (s.en_approved_line_count !== 1) {
      return finish(fail(s, "mutation_guard", `EN既存承認済み行occurrence=${s.en_approved_line_count}（期待1）: "${EN_APPROVED_LINE}"`));
    }

    // candidate occurrence before（BG固有 expected: JA0/EN1/ZH0）
    s.candidate_before_ja = countUrlNormalizedInLines(jaSec.lines, APPROVED_SOURCE_URL);
    s.candidate_before_en = countUrlNormalizedInLines(enSec.lines, APPROVED_SOURCE_URL);
    s.candidate_before_zh = countUrlNormalizedInLines(zhSec.lines, APPROVED_SOURCE_URL);
    if (s.candidate_before_ja !== 0) {
      return finish(fail(s, "mutation_guard", `candidate URL(mfa.bg/en)のJA Reference内occurrence=${s.candidate_before_ja}（期待0、JAは未引用のはず）`));
    }
    if (s.candidate_before_en !== 1) {
      return finish(fail(s, "mutation_guard", `candidate URL(mfa.bg/en)のEN Reference内occurrence=${s.candidate_before_en}（期待1、既存承認済み行のはず）`));
    }
    if (s.candidate_before_zh !== 0) {
      return finish(fail(s, "mutation_guard", `candidate URL(mfa.bg/en)のZH Reference内occurrence=${s.candidate_before_zh}（期待0、ZHは未引用のはず）`));
    }

    // 6. deterministic expected content生成（JA/ZH Reference行をそれぞれexactly1回置換、ENは無変更）
    const newContent: Record<string, string> = { ...(row.content as Record<string, string>) };

    const jaAllLines = newContent.ja.split("\n");
    const jaIdx = jaAllLines.findIndex((l: string, i: number) => i >= jaSec.startLine && i < jaSec.endLine && l === OLD_LINE_JA);
    const newJaLines = [...jaAllLines];
    newJaLines[jaIdx] = NEW_LINE_JA;
    newContent.ja = newJaLines.join("\n");

    const zhAllLines = newContent.zh.split("\n");
    const zhIdx = zhAllLines.findIndex((l: string, i: number) => i >= zhSec.startLine && i < zhSec.endLine && l === OLD_LINE_ZH);
    const newZhLines = [...zhAllLines];
    newZhLines[zhIdx] = NEW_LINE_ZH;
    newContent.zh = newZhLines.join("\n");

    // 7. whitelist / round-trip invariant（EN側は完全不変であることが前提）
    s.allowed_mutation_invariant = newContent.en === row.content.en;
    if (!s.allowed_mutation_invariant) {
      return finish(fail(s, "mutation_guard", "allowed-mutation whitelist invariant違反: ENが変化しています"));
    }
    const reversedJaLines = [...newJaLines];
    const reversedJaIdx = reversedJaLines.findIndex((l: string) => l === NEW_LINE_JA);
    reversedJaLines[reversedJaIdx] = OLD_LINE_JA;
    const reversedJa = reversedJaLines.join("\n");
    const reversedZhLines = [...newZhLines];
    const reversedZhIdx = reversedZhLines.findIndex((l: string) => l === NEW_LINE_ZH);
    reversedZhLines[reversedZhIdx] = OLD_LINE_ZH;
    const reversedZh = reversedZhLines.join("\n");
    s.round_trip_invariant = reversedJa === row.content.ja && reversedZh === row.content.zh;
    if (!s.round_trip_invariant) {
      return finish(fail(s, "mutation_guard", "round-trip invariant違反: NEW→OLD逆置換がoriginal JA/ZH contentと一致しません"));
    }

    // 7b. M2相当: structural round-trip（上記）だけでなく、inverse reconstructed contentの
    // stable hashをEXPECTED_CONTENT_SHAとexact比較するhard gateを追加する。
    // 片方（structural deep-equalのみ、またはhashのみ）では代替しない。
    const inverseContent: Record<string, string> = { ...newContent, ja: reversedJa, zh: reversedZh };
    s.inverse_reconstructed_sha = contentSha256(inverseContent);
    s.inverse_sha_match = s.inverse_reconstructed_sha === EXPECTED_CONTENT_SHA;
    if (!s.inverse_sha_match) {
      return finish(
        fail(
          s,
          "mutation_guard",
          `inverse SHA hard gate違反: inverse reconstructed content SHAが期待値と不一致（期待=${EXPECTED_CONTENT_SHA}, 実際=${s.inverse_reconstructed_sha}）`
        )
      );
    }
    if (!isDeepStrictEqual(inverseContent, row.content)) {
      return finish(fail(s, "mutation_guard", "inverse reconstructed contentがoriginal contentとdeep-equalではありません"));
    }

    // 8. Reference invariant（section位置・行数不変、section内は対象1行以外不変。EN sectionはdeep-equal）
    const jaSecAfter = findRefSection(newContent.ja, "ja");
    const zhSecAfter = findRefSection(newContent.zh, "zh");
    let refInvariantOk = !!jaSecAfter && !!zhSecAfter;
    let jaDiffCount = 0;
    let zhDiffCount = 0;
    if (jaSecAfter) {
      const beforeLineCount = jaSec.endLine - jaSec.startLine;
      const afterLineCount = jaSecAfter.endLine - jaSecAfter.startLine;
      refInvariantOk = refInvariantOk && beforeLineCount === afterLineCount;
      const afterLines = newContent.ja.split("\n").slice(jaSecAfter.startLine, jaSecAfter.endLine);
      for (let i = 0; i < jaSec.lines.length; i++) {
        if (jaSec.lines[i] !== afterLines[i]) jaDiffCount++;
      }
      refInvariantOk = refInvariantOk && jaDiffCount === 1;
    }
    if (zhSecAfter) {
      const beforeLineCount = zhSec.endLine - zhSec.startLine;
      const afterLineCount = zhSecAfter.endLine - zhSecAfter.startLine;
      refInvariantOk = refInvariantOk && beforeLineCount === afterLineCount;
      const afterLines = newContent.zh.split("\n").slice(zhSecAfter.startLine, zhSecAfter.endLine);
      for (let i = 0; i < zhSec.lines.length; i++) {
        if (zhSec.lines[i] !== afterLines[i]) zhDiffCount++;
      }
      refInvariantOk = refInvariantOk && zhDiffCount === 1;
    }
    const enSecAfter = findRefSection(newContent.en, "en");
    refInvariantOk = refInvariantOk && !!enSecAfter && enSecAfter.raw === findRefSection(row.content.en, "en")!.raw;
    s.reference_invariant = refInvariantOk;
    if (!refInvariantOk) {
      return finish(fail(s, "mutation_guard", "Reference section invariant違反"));
    }
    s.total_mutation_count = jaDiffCount + zhDiffCount;
    if (s.total_mutation_count !== 2) {
      return finish(fail(s, "mutation_guard", `total mutation count=${s.total_mutation_count}（期待2）`));
    }

    // 9. non-target deep-equal（JA/ZH body全体: Reference対象1行以外は完全一致。ENは完全一致）
    const jaOutsideBefore = row.content.ja.replace(OLD_LINE_JA, "___TARGET_JA___");
    const jaOutsideAfter = newContent.ja.replace(NEW_LINE_JA, "___TARGET_JA___");
    const zhOutsideBefore = row.content.zh.replace(OLD_LINE_ZH, "___TARGET_ZH___");
    const zhOutsideAfter = newContent.zh.replace(NEW_LINE_ZH, "___TARGET_ZH___");
    s.non_target_deep_equal =
      jaOutsideBefore === jaOutsideAfter &&
      zhOutsideBefore === zhOutsideAfter &&
      newContent.en === row.content.en;
    if (!s.non_target_deep_equal) {
      return finish(fail(s, "mutation_guard", "non-target deep-equal違反: JA/ZH Reference対象1行以外、またはEN全体に差分があります"));
    }

    // 10. hypothetical AFTER validator（DBへは書かない。in-memory評価のみ）
    const after = validateStudyPublication({ title: row.title, description: row.description, content: newContent, approvedSources: approved });
    s.validator_after = after.ok ? "PASS" : "FAIL";
    s.validator_after_reason_count = after.reasons.length;
    console.log(`  hypothetical AFTER validator: ${s.validator_after} (${after.reasons.length} reasons)`);
    if (!after.ok) {
      return finish(fail(s, "validator_after", `AFTER validator != PASS: ${JSON.stringify(after.reasons)}`));
    }

    const jaSecAfterLines = extractSectionLines(newContent.ja, "ja")!;
    const enSecAfterLines = extractSectionLines(newContent.en, "en")!;
    const zhSecAfterLines = extractSectionLines(newContent.zh, "zh")!;
    s.candidate_after_ja = countUrlNormalizedInLines(jaSecAfterLines.lines, APPROVED_SOURCE_URL);
    s.candidate_after_en = countUrlNormalizedInLines(enSecAfterLines.lines, APPROVED_SOURCE_URL);
    s.candidate_after_zh = countUrlNormalizedInLines(zhSecAfterLines.lines, APPROVED_SOURCE_URL);
    // BG固有 expected: JA1/EN1/ZH1
    s.candidate_after_hard_gate_passed =
      s.candidate_after_ja === 1 && s.candidate_after_en === 1 && s.candidate_after_zh === 1;
    if (!s.candidate_after_hard_gate_passed) {
      return finish(
        fail(
          s,
          "mutation_guard",
          `candidate-after hard gate失敗: JA=${s.candidate_after_ja} EN=${s.candidate_after_en} ZH=${s.candidate_after_zh}（期待JA1/EN1/ZH1）`
        )
      );
    }

    // 11. M1相当: candidate AFTER content SHAをhard gate化（log-onlyにしない）。
    // mismatch時はCASへ到達させない。
    const afterShaComputed = contentSha256(newContent);
    s.candidate_after_content_sha = afterShaComputed;
    s.candidate_after_content_sha_match = afterShaComputed === EXPECTED_AFTER_CONTENT_SHA;
    console.log(`  hypothetical AFTER content SHA-256: ${afterShaComputed}（期待値: ${EXPECTED_AFTER_CONTENT_SHA}, match=${s.candidate_after_content_sha_match}）`);
    if (!s.candidate_after_content_sha_match) {
      return finish(
        fail(
          s,
          "mutation_guard",
          `AFTER SHA hard gate違反: candidate AFTER content SHAが期待値と不一致（期待=${EXPECTED_AFTER_CONTENT_SHA}, 実際=${afterShaComputed}）`
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
    // M1相当: post-CAS content SHAもhard gate化
    s.post_content_sha = contentSha256(postRow.content);
    s.post_content_sha_match = s.post_content_sha === EXPECTED_AFTER_CONTENT_SHA;
    if (!s.post_content_sha_match) {
      return finish(fail(s, "post_cas_reselect", `post-CAS content SHAが期待値と不一致（期待=${EXPECTED_AFTER_CONTENT_SHA}, 実際=${s.post_content_sha}）`));
    }

    s.post_old_ja_count = countSubstring(postRow.content.ja, OLD_LINE_JA);
    s.post_new_ja_count = countSubstring(postRow.content.ja, NEW_LINE_JA);
    s.post_old_zh_count = countSubstring(postRow.content.zh, OLD_LINE_ZH);
    s.post_new_zh_count = countSubstring(postRow.content.zh, NEW_LINE_ZH);
    if (s.post_old_ja_count !== 0) {
      return finish(fail(s, "post_cas_reselect", `post-CAS JA OLD whole count=${s.post_old_ja_count}（期待0）`));
    }
    if (s.post_new_ja_count !== 1) {
      return finish(fail(s, "post_cas_reselect", `post-CAS JA NEW whole count=${s.post_new_ja_count}（期待1）`));
    }
    if (s.post_old_zh_count !== 0) {
      return finish(fail(s, "post_cas_reselect", `post-CAS ZH OLD whole count=${s.post_old_zh_count}（期待0）`));
    }
    if (s.post_new_zh_count !== 1) {
      return finish(fail(s, "post_cas_reselect", `post-CAS ZH NEW whole count=${s.post_new_zh_count}（期待1）`));
    }
    s.post_en_unchanged = postRow.content.en === row.content.en;
    if (!s.post_en_unchanged) {
      return finish(fail(s, "post_cas_reselect", "post-CAS EN contentがBEFOREと不一致（ENは無変更のはず）"));
    }

    const postJaSec = extractSectionLines(postRow.content.ja, "ja");
    const postEnSec = extractSectionLines(postRow.content.en, "en");
    const postZhSec = extractSectionLines(postRow.content.zh, "zh");
    if (!postJaSec || !postEnSec || !postZhSec) {
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
          `post-CAS candidate recount失敗: JA=${s.post_candidate_ja} EN=${s.post_candidate_en} ZH=${s.post_candidate_zh}（期待JA1/EN1/ZH1）`
        )
      );
    }

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

    const { data: postBgRows, error: postBgErr } = await supabase
      .from("country_sources")
      .select("id, url")
      .eq("country_code", TARGET_COUNTRY);
    if (postBgErr) return finish(fail(s, "post_cas_reselect", `post-CAS BG registry SELECT error: ${postBgErr.message}`));
    if (!Array.isArray(postBgRows)) return finish(fail(s, "post_cas_reselect", "post-CAS BG registry SELECT returned malformed data"));
    s.post_bg_total_row_count = postBgRows.length;
    if (s.post_bg_total_row_count !== s.bg_registry_row_count) {
      return finish(fail(s, "post_cas_reselect", `post-CAS BG registry total=${s.post_bg_total_row_count}（期待${s.bg_registry_row_count}、pre-CASと不変であるべき）`));
    }
    // M4の延長: post-CAS側でもBG total row countがexact7であることを明示hard gate
    s.post_bg_source_total_match = s.post_bg_total_row_count === EXPECTED_BG_TOTAL_SOURCE_ROWS;
    if (!s.post_bg_source_total_match) {
      return finish(fail(s, "post_cas_reselect", `post-CAS BG registry total=${s.post_bg_total_row_count}（期待exactly${EXPECTED_BG_TOTAL_SOURCE_ROWS}）`));
    }
    const postRawCount = postBgRows.filter((row2) => row2.url === APPROVED_SOURCE_URL).length;
    s.post_raw_candidate_count = postRawCount;
    if (postRawCount !== 1) {
      return finish(fail(s, "post_cas_reselect", `post-CAS raw candidate count=${postRawCount}（期待1）`));
    }
    const postNormalizedCount = postBgRows.filter((row2) => normalizeUrl(row2.url) === targetNorm).length;
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

    console.log("  post-CAS検証PASS（content deep-equal・SHA一致・JA/ZH OLD0/NEW1・EN不変・candidate(JA1/EN1/ZH1)再確認・fresh source registry(SOURCE_ID/BG total/raw/normalized/approved)再確認・fresh validator PASS・非content列不変を確認）");

    // M3相当: successful CAS後、最終operation successを宣言する前にglobal production
    // post-recountを実行する。CASは既にconfirmed・db_updated=trueであり、global検証が
    // 失敗してもこの事実を巻き戻さない。rollback/retry/second CASは一切行わない。
    await performGlobalRecount(s);
    console.log(
      `  global post-recount: total=${s.global_total} PASS=${s.global_pass} FAIL=${s.global_fail} ` +
      `country=${s.global_country_pass}/${s.global_country_fail} work=${s.global_work_pass}/${s.global_work_fail} ` +
      `sources=${s.post_global_country_sources} removed=${JSON.stringify(s.removed_fail_slugs)} added=${JSON.stringify(s.added_fail_slugs)} ` +
      `success=${s.global_verification_success}`
    );

    if (!s.global_verification_success) {
      // mutation自体はconfirmed/db_updated=trueのまま維持する（rollback/retryしない）。
      // overall operationはfailureとして正直に報告する。
      s.success = 0;
      s.failed = 1;
      s.failure_stage = s.failure_stage ?? "global_post_verification";
      s.failure_reason = s.failure_reason ?? "global production post-recountがexpected値(103/78/25, country44/7, work34/18, sources389, FAIL removed=study-work-bgのみ, added=0)と一致しませんでした";
      s.exit = 1;
      return finish(s);
    }

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

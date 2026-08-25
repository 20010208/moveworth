/**
 * BL-20260809-02（Published Study validator debt）study-country-br専用safe patch。
 *
 * 設計上の重要な前提（ESとの類似点・相違点）:
 *   BRはESと同様、JA/ZHとENで異なるOLD URLを引用している（言語別path/domain）。
 *   fresh production reconfirmation（`STUDY_COUNTRY_BR_FRESH_READONLY_RECON_
 *   REMEDIATION_DESIGN`）で確認済み: JA/ZHはブラジル法務省（Ministério da
 *   Justiça、gov.br/mj/pt-br/assuntos/migracao）の一般移民案内ページを、ENは
 *   ブラジル連邦警察（Polícia Federal、gov.br/pf/pt-br/assuntos/imigracao）の
 *   移民登録ページを引用している。したがって本scriptもOLD_URLを言語別定数
 *   （OLD_URL_BY_LANG）として持つ（ES precedentと同型）。
 *
 * L2 editorial/context review（`STUDY_FAIL23_TOP5_L2_EDITORIAL_CONTEXT_REVIEW`、
 * PM承認済み・Codex independent audit PASS）の結論:
 *   - 承認済みsource `https://www.gov.br/pf/pt-br/assuntos/imigracao/inicio`
 *     （country_sources既存登録、purpose=visa, status=alive、Polícia Federal
 *     「Migrante no Brasil」）を新規に3言語すべてへReference行として引用する
 *     （新規source登録は不要）。Brazil approved source 4件の中で唯一、broad
 *     general immigration/migrant authorityとしてcountry-level記事に適合する
 *     （投資家/デジタルノマド/就労ビザの3件はいずれも特定visa種別ページであり
 *     除外）。
 *   - EN側は既存label「Brazilian Federal Police - Immigration」が既に
 *     Polícia Federal/Immigrationを正しく指しており、URL pathのみ`/inicio`へ
 *     補完する（label rewrite type A）。JA/ZHはMinistério da Justiça表記から
 *     Polícia Federal表記への組織名正規化を行う（label rewrite type B）。
 *     置換文言は tracked precedent `src/data/blog-posts.ts`（`visa-br`記事、
 *     10317/10421/10525行目、同一URLを既に引用済み）の実際のJA/EN/ZH文字列を
 *     fresh確認の上、study記事のReference行慣習（`- [Label](URL)`、bold-prefix
 *     なし）に合わせてそのままground。
 *
 * 本scriptはES専用patch（`scripts/patch-study-country-es-validator.ts`、Codex
 * independent code audit PASS済み。GE専用patchの安全設計をさらに継承）の
 * request bound・timeout・CAS/recovery/postverify shapeをそのまま踏襲する。
 *
 * 対象はhard-coded exactly 1記事・exactly 3箇所のみ（CLIでslug/id/URL/置換文字列を
 * 差し替え不可):
 *   slug = study-country-br / id = 818531d3-56a6-47f5-ae12-dbbb4a973f4d
 *   category = country
 *
 * スキーマ上の重要な注意（`STUDY_COUNTRY_BR_HELPER_PATCH_IMPLEMENTATION`
 * PM authorization記載）:
 *   study_blog_posts テーブルに `country` 列・`published_at` 列は存在しない。
 *   本scriptはこれらの列を一切SELECT/UPDATE/参照しない。countryはslugから導出した
 *   定数（TARGET_COUNTRY）としてのみ扱う。
 *
 * 安全設計（ES/GE precedentを踏襲）:
 *   - 未知のCLI引数はfail closed
 *   - BEFORE content SHA-256をhard-coded expected値（fresh recon/design実測値）と
 *     厳密一致させるguard
 *   - approved source件数（getApprovedSources("br")）はfresh recon実測値exactly4を
 *     pre-write hard gateする
 *   - official website GETは行わない（承認済みsourceは既にcountry_sources登録時に
 *     到達性確認済み。今回のL2 editorial reviewフェーズでも別途fetch確認済み）
 *   - round-trip invariant（NEW→OLD逆置換でoriginal contentとdeep-equal、JA/EN/ZH
 *     すべて）＋ inverse reconstructed contentのSHAをEXPECTED_CONTENT_SHAと厳密一致
 *     させるhard gate
 *   - DRY_RUNがデフォルト。実際のDB CASには `--apply` に加え、環境変数
 *     `ALLOW_PRODUCTION_STUDY_PATCH` が厳密に文字列 "1" と一致することが必要
 *   - 本番反映は `study_blog_posts_cas_update_content()` RPC（compare-and-swap）経由のみ。
 *     .update()/.insert()/.upsert()/.delete() によるfallbackは行わない
 *   - `AUDITED_AFTER_CONTENT_SHA` は今回意図的に `null` のまま（ES/GE precedentと
 *     同一のpre-freeze lifecycle）。APPLYはnull/mismatchいずれでも常にblockされる
 *     （CLI/env経由のoverride経路は存在しない）。dry-run独立監査後に別途freezeする
 *
 * 使い方（このコミット時点では未実行、PM別途承認が必要）:
 *   npx tsx scripts/patch-study-country-br-validator.ts            (DRY_RUN)
 *   npx tsx scripts/patch-study-country-br-validator.ts --apply    (要 ALLOW_PRODUCTION_STUDY_PATCH=1、
 *                                                                    ただしAUDITED_AFTER_CONTENT_SHAが
 *                                                                    null のため今回は常にblockされる)
 */
import { existsSync, readFileSync } from "fs";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getApprovedSources,
  validateStudyPublication,
  findRefSection,
  extractUrls,
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
  console.error("   例: ALLOW_PRODUCTION_STUDY_PATCH=1 npx tsx scripts/patch-study-country-br-validator.ts --apply");
  process.exit(1);
}
const DRY_RUN = !APPLY;

// ===== heartbeat（stderrのみ、secretは出力しない） =====
const START_TIME_MS = Date.now();
function heartbeat(line: string): void {
  process.stderr.write(`[br-patch] ${line}\n`);
}
heartbeat(`RUNTIME_ENTERED mode=${DRY_RUN ? "DRY_RUN" : "APPLY"}`);

// ===== hard global watchdog（networkより前、CLI/env guard直後に登録） =====
const REQUEST_TIMEOUT_MS = 10_000;
const SOFT_GLOBAL_TIMEOUT_MS = 75_000;
const HARD_GLOBAL_TIMEOUT_MS = 90_000;

let hardTimer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
  process.stderr.write("[br-patch] HARD_WATCHDOG_FIRED\n");
  // eslint-disable-next-line no-process-exit
  process.exit(124);
}, HARD_GLOBAL_TIMEOUT_MS);
function clearHardWatchdog(): void {
  if (hardTimer) {
    clearTimeout(hardTimer);
    hardTimer = null;
  }
}
heartbeat("HARD_WATCHDOG_REGISTERED");

let softTimer: ReturnType<typeof setTimeout> | null = null;
function clearSoftWatchdog(): void {
  if (softTimer) {
    clearTimeout(softTimer);
    softTimer = null;
  }
}

// ===== one-way fatal latch =====
const phaseController = new AbortController();
let fatal = false;
let fatalPhase: string | null = null;
let fatalError: { name: string; message: string } | null = null;
let globalTimeoutFlag = false;

function errorInfo(e: unknown): { name: string; message: string } {
  if (e instanceof Error) return { name: e.name, message: e.message.slice(0, 300) };
  return { name: "UnknownError", message: String(e).slice(0, 300) };
}
function setFatal(phase: string, err: unknown): void {
  if (fatal) return; // one-way latch: 最初の失敗原因のみ保持
  fatal = true;
  fatalPhase = phase;
  fatalError = errorInfo(err);
  phaseController.abort();
}

// ===== bounded custom fetch（ES/GE patch scriptと同型のpattern。全Supabase HTTP requestを
// 透過的にtimeout/request-limit保護する） =====
const nativeFetch = globalThis.fetch;
let requestCount = 0;
let requestTimeoutCount = 0;
let requestLimitExceededFlag = false;

const DRY_RUN_REQUEST_MAX = 3;
const APPLY_REQUEST_MAX = 6;
const REQUEST_MAX = DRY_RUN ? DRY_RUN_REQUEST_MAX : APPLY_REQUEST_MAX;

function composeSignals(...signals: Array<AbortSignal | null | undefined>): AbortSignal {
  const present = signals.filter((s): s is AbortSignal => Boolean(s));
  return AbortSignal.any(present);
}

function boundedFetch(): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    // pre-network gate順序: fatal/abort → request-limit → increment → timeout setup → native fetch
    if (fatal || phaseController.signal.aborted) {
      throw new Error(`bounded_fetch_fatal_precheck (phase=${fatalPhase ?? "aborted"})`);
    }
    if (requestCount >= REQUEST_MAX) {
      requestLimitExceededFlag = true;
      setFatal("request_limit_exceeded", new Error(`request limit exceeded: attempted request beyond REQUEST_MAX=${REQUEST_MAX} (mode=${DRY_RUN ? "DRY_RUN" : "APPLY"})`));
      throw new Error("request_limit_exceeded");
    }
    requestCount += 1;
    const timeoutController = new AbortController();
    const queryTimer = setTimeout(() => {
      requestTimeoutCount += 1;
      timeoutController.abort();
    }, REQUEST_TIMEOUT_MS);
    const incomingSignal = typeof input === "object" && input instanceof Request ? input.signal : undefined;
    const composed = composeSignals(phaseController.signal, timeoutController.signal, init?.signal, incomingSignal);
    try {
      return await nativeFetch(input, { ...init, signal: composed });
    } finally {
      clearTimeout(queryTimer);
    }
  };
}

heartbeat("ENV_LOADED");

const supabase: SupabaseClient<any, any, any> = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: boundedFetch() },
  }
);
heartbeat("SUPABASE_CLIENT_READY (bounded fetch)");

// ===== hard-coded target（1件のみ） =====
const TARGET_SLUG = "study-country-br";
const TARGET_ARTICLE_ID = "818531d3-56a6-47f5-ae12-dbbb4a973f4d";
// TARGET_COUNTRYはslugから導出した定数。study_blog_postsに`country`列は存在しないため
// DB行から取得することはない（PM authorization記載のschema制約）。
const TARGET_COUNTRY = "br";
const TARGET_CATEGORY = "country";

// ===== slug-derived country coherence gate（Codex M1是正） =====
// TARGET_COUNTRYを独立したリテラル定数のまま信頼するのではなく、TARGET_SLUGから
// 実際にcountry suffixをderiveし、TARGET_COUNTRYとexact一致することをmodule実行時
// （production request #1より前、synchronousに）hard gateする。
const SLUG_COUNTRY_PREFIX = "study-country-";
function deriveCountryFromSlug(slug: string): string {
  if (!slug.startsWith(SLUG_COUNTRY_PREFIX)) {
    throw new Error(`slug does not start with expected prefix "${SLUG_COUNTRY_PREFIX}": ${JSON.stringify(slug)}`);
  }
  const suffix = slug.slice(SLUG_COUNTRY_PREFIX.length);
  if (!/^[a-z]{2,3}$/.test(suffix)) {
    throw new Error(`slug country suffix is malformed (expected 2-3 lowercase letters): ${JSON.stringify(suffix)}`);
  }
  return suffix;
}
const DERIVED_COUNTRY_FROM_SLUG = deriveCountryFromSlug(TARGET_SLUG);
if (DERIVED_COUNTRY_FROM_SLUG !== TARGET_COUNTRY) {
  throw new Error(
    `slug-derived country coherence gate failed: derived="${DERIVED_COUNTRY_FROM_SLUG}" TARGET_COUNTRY="${TARGET_COUNTRY}"`
  );
}

// L2 editorial/context reviewフェーズで選定した、country-level記事に最も広く適合する
// approved source（broad federal immigration/migrant authority、Polícia Federal）。
const APPROVED_SOURCE_URL = "https://www.gov.br/pf/pt-br/assuntos/imigracao/inicio";
// selected approved sourceのpurposeについてruntime hard gateする際の期待値。
const EXPECTED_SOURCE_PURPOSE = "visa";

// BEFORE contentのfresh production reconfirmation時点のSHA-256
// （`STUDY_COUNTRY_BR_FRESH_READONLY_RECON_REMEDIATION_DESIGN`実測値）。
const EXPECTED_CONTENT_SHA = "a94ed1d3b6f472489bf9411c5a028dd9cffd734fe63fb89a70ef65868c41df03";

// dry-run独立監査後にfreezeするexpected AFTER SHA。今回は意図的にnullのまま
// （design-only候補値 6c1c9714b902560cb323931f524cfbf4514a28cec1fa137254b39675bb8e4da6 は
// recon/designフェーズでは確認済みだが、本phase単独ではsource-freezeしない。ES/GE
// precedentと同一のpre-freeze lifecycle）。CLI/env経由でのoverride経路は存在しない
// （単なるmodule-scope定数）。絶対に推測値・placeholder・all-zero・空文字列を入れない。
const AUDITED_AFTER_CONTENT_SHA: string | null = null;

// 置換対象URL（Reference section内でこのURLを引用する行を各言語exactly1件探す）。
// ESと同様、JA/ZHは同一のURL（Ministério da Justiça一般移民案内ページ）を、ENのみ
// 独自のURL（Polícia Federal移民登録ページ、ただし`/inicio`無しの旧path）を持つ
// （fresh recon実測値）。
const OLD_URL_BY_LANG: Record<"ja" | "en" | "zh", string> = {
  ja: "https://www.gov.br/mj/pt-br/assuntos/migracao",
  en: "https://www.gov.br/pf/pt-br/assuntos/imigracao",
  zh: "https://www.gov.br/mj/pt-br/assuntos/migracao",
};

// `STUDY_COUNTRY_BR_FRESH_READONLY_RECON_REMEDIATION_DESIGN`で取得したaudited exact
// OLD markdown lineをliteral constantとして保持する。runtime discoveryは「候補行の
// 位置特定」のためだけに使い、実際の置換・全ての以降処理ではこのaudited literal
// constant（OLD_LINE_BY_LANG）を使用する（ES M3是正pattern踏襲）。
const JA_OLD_LINE = "- [ブラジル入国管理局](https://www.gov.br/mj/pt-br/assuntos/migracao)";
const EN_OLD_LINE = "- [Brazilian Federal Police - Immigration](https://www.gov.br/pf/pt-br/assuntos/imigracao)";
const ZH_OLD_LINE = "- [巴西入境管理局](https://www.gov.br/mj/pt-br/assuntos/migracao)";
const OLD_LINE_BY_LANG: Record<"ja" | "en" | "zh", string> = {
  ja: JA_OLD_LINE,
  en: EN_OLD_LINE,
  zh: ZH_OLD_LINE,
};

// M3是正（ES/GE precedent）: OLD候補行がMarkdown unordered list itemであることを要求する形状ルール。
const LIST_ITEM_RE = /^\s*-\s+\S/;

// NEW行（tracked `visa-br` precedent: src/data/blog-posts.ts 10317/10421/10525行目の
// 組織名表記をground。study記事のReference行慣習（`- [Label](URL)`、bold-prefixなし）に
// 合わせて採用。ENは既存label「Brazilian Federal Police - Immigration」を完全維持し
// URL pathのみ`/inicio`へ補完する（label rewrite type A）。JA/ZHはMinistério da
// Justiça表記からPolícia Federal表記への組織名正規化（label rewrite type B）。
const NEW_LINE_JA = "- [ブラジル連邦警察（Polícia Federal）](https://www.gov.br/pf/pt-br/assuntos/imigracao/inicio)";
const NEW_LINE_EN = "- [Brazilian Federal Police - Immigration](https://www.gov.br/pf/pt-br/assuntos/imigracao/inicio)";
const NEW_LINE_ZH = "- [巴西联邦警察（Polícia Federal）](https://www.gov.br/pf/pt-br/assuntos/imigracao/inicio)";

// fresh recon/design reconfirmationが返したexactly3件のBEFORE validator reasons。
const EXPECTED_BEFORE_REASONS: readonly string[] = [
  "content.ja の参考資料section内URLがapproved source（country_sources）と一致しない",
  "content.en の参考資料section内URLがapproved source（country_sources）と一致しない",
  "content.zh の参考資料section内URLがapproved source（country_sources）と一致しない",
];

// fresh recon実測値（getApprovedSources("br")の戻り件数）。
const EXPECTED_BR_APPROVED_SOURCE_COUNT = 4;

// ===== mutation state model =====
type MutationState = "not_observed" | "confirmed" | "ambiguous";
type CasOutcome =
  | "NOT_ATTEMPTED"
  | "CONFIRMED"
  | "NOT_APPLIED_ZERO_ROWS"
  | "AMBIGUOUS"
  | "LIKELY_APPLIED_CONFIRMED_VIA_RECOVERY"
  | "NOT_APPLIED"
  | "UNKNOWN_WRITE_OUTCOME";

type LocaleMutation = {
  oldLine: string | null;
  newLine: string;
  oldWholeCount: number | null;
  newWholeBeforeCount: number | null;
  oldReferenceCount: number | null;
  newReferenceBeforeCount: number | null;
  candidateBeforeCount: number | null;
  candidateAfterCount: number | null;
  shapeInvalidReasons: string[] | null;
};

function freshLocaleMutation(newLine: string): LocaleMutation {
  return {
    oldLine: null,
    newLine,
    oldWholeCount: null,
    newWholeBeforeCount: null,
    oldReferenceCount: null,
    newReferenceBeforeCount: null,
    candidateBeforeCount: null,
    candidateAfterCount: null,
    shapeInvalidReasons: null,
  };
}

type Summary = {
  mode: "DRY_RUN" | "APPLY";
  requested: number;
  success: number;
  failed: number;
  not_attempted: number;

  target_slug: string;
  target_id: string;
  approved_source_url: string;

  approved_source_count: number | null;
  pre_approved_source_count_match: boolean | null;
  approved_candidate_match: number | null;
  approved_candidate_purpose: string | null;
  approved_candidate_purpose_match: boolean | null;

  article_row_count: number | null;
  article_category: string | null;
  article_category_match: boolean | null;
  article_precondition_passed: boolean | null;
  content_sha256: string | null;
  content_sha256_expected_match: boolean | null;

  validator_before: "PASS" | "FAIL" | null;
  validator_before_reason_count: number | null;
  validator_before_exact_reason_match: boolean | null;

  ja: LocaleMutation;
  en: LocaleMutation;
  zh: LocaleMutation;

  cross_language_contamination: boolean | null;
  round_trip_invariant: boolean | null;
  inverse_reconstructed_sha: string | null;
  inverse_sha_match: boolean | null;
  reference_invariant: boolean | null;
  non_target_deep_equal: boolean | null;
  total_mutation_count: number | null;

  validator_after: "PASS" | "FAIL" | null;
  validator_after_reason_count: number | null;
  candidate_after_hard_gate_passed: boolean | null;
  candidate_after_content_sha: string | null;

  audited_after_content_sha_configured: boolean;
  audited_after_content_sha_match: boolean | null;

  cas_attempted: boolean;
  cas_outcome: CasOutcome;
  mutation_state: MutationState;
  db_updated: boolean;
  ambiguous_recovery_attempted: boolean;
  recovery_select_attempted: boolean;
  recovery_select_succeeded: boolean | null;

  post_verification_attempted: boolean;
  post_article_row_count: number | null;
  post_article_id_match: boolean | null;
  post_content_match: boolean | null;
  post_content_sha: string | null;
  post_content_sha_match_computed_after: boolean | null;
  post_old_count: { ja: number | null; en: number | null; zh: number | null };
  post_new_count: { ja: number | null; en: number | null; zh: number | null };
  post_selected_source_match_count: number | null;
  post_validator_ok: boolean | null;
  post_validator_reason_count: number | null;
  post_invariant_fields_ok: boolean | null;

  requestCount: number;
  requestTimeoutCount: number;
  requestLimitExceeded: boolean;
  softGlobalTimeout: boolean;
  hardTimeoutConfiguredMs: number;
  elapsedMs: number;

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
    approved_source_url: APPROVED_SOURCE_URL,
    approved_source_count: null,
    pre_approved_source_count_match: null,
    approved_candidate_match: null,
    approved_candidate_purpose: null,
    approved_candidate_purpose_match: null,
    article_row_count: null,
    article_category: null,
    article_category_match: null,
    article_precondition_passed: null,
    content_sha256: null,
    content_sha256_expected_match: null,
    validator_before: null,
    validator_before_reason_count: null,
    validator_before_exact_reason_match: null,
    ja: freshLocaleMutation(NEW_LINE_JA),
    en: freshLocaleMutation(NEW_LINE_EN),
    zh: freshLocaleMutation(NEW_LINE_ZH),
    cross_language_contamination: null,
    round_trip_invariant: null,
    inverse_reconstructed_sha: null,
    inverse_sha_match: null,
    reference_invariant: null,
    non_target_deep_equal: null,
    total_mutation_count: null,
    validator_after: null,
    validator_after_reason_count: null,
    candidate_after_hard_gate_passed: null,
    candidate_after_content_sha: null,
    audited_after_content_sha_configured: AUDITED_AFTER_CONTENT_SHA !== null,
    audited_after_content_sha_match: null,
    cas_attempted: false,
    cas_outcome: "NOT_ATTEMPTED",
    mutation_state: "not_observed",
    db_updated: false,
    ambiguous_recovery_attempted: false,
    recovery_select_attempted: false,
    recovery_select_succeeded: null,
    post_verification_attempted: false,
    post_article_row_count: null,
    post_article_id_match: null,
    post_content_match: null,
    post_content_sha: null,
    post_content_sha_match_computed_after: null,
    post_old_count: { ja: null, en: null, zh: null },
    post_new_count: { ja: null, en: null, zh: null },
    post_selected_source_match_count: null,
    post_validator_ok: null,
    post_validator_reason_count: null,
    post_invariant_fields_ok: null,
    requestCount: 0,
    requestTimeoutCount: 0,
    requestLimitExceeded: false,
    softGlobalTimeout: false,
    hardTimeoutConfiguredMs: HARD_GLOBAL_TIMEOUT_MS,
    elapsedMs: 0,
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

let finalEmitted = false;
// main()内で構築中のactive summaryへの参照。CAS confirmed/recovery candidate-observed後の
// post-verification中にunexpected throwが発生し、main()の呼び出しchainを素通りして
// top-level catchへ抜けても、この参照を通じてcas_outcome/mutation_state/db_updated等の
// 既に記録済みのmutation-state evidenceを保持したままfinalizeできるようにする
// （freshSummary()での握り潰しを防ぐ）。
let activeSummary: Summary | null = null;
function finish(s: Summary): Summary {
  if (finalEmitted) return s;
  finalEmitted = true;
  s.requestCount = requestCount;
  s.requestTimeoutCount = requestTimeoutCount;
  s.requestLimitExceeded = requestLimitExceededFlag;
  s.softGlobalTimeout = globalTimeoutFlag;
  s.elapsedMs = Date.now() - START_TIME_MS;
  heartbeat(`FINAL_RESULT_EMITTED result=${s.success === 1 ? "SUCCESS" : "FAILURE"} requestCount=${s.requestCount}`);
  console.log("\n=== summary ===");
  console.log(JSON.stringify(s, null, 2));
  process.exitCode = s.exit;
  return s;
}

// fatal one-way gate。各phase境界でこれを呼び、fatalなら即座にfail結果を返す。
function activeOrFail(s: Summary, stage: string): Summary | null {
  if (fatal) {
    return fail(s, "phase_abort", `aborted at stage=${stage} due to prior fatal (phase=${fatalPhase}): ${fatalError?.message ?? ""}`);
  }
  return null;
}

// ===== count / section helpers（authoritative extractUrls/normalizeUrl/findRefSectionのみ使用） =====
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
  let count = 0;
  for (const l of lines) {
    for (const u of extractUrls(l)) {
      if (normalizeUrl(u) === targetNorm) count++;
    }
  }
  return count;
}

// OLD候補行を「Reference section内でexactly1件」だけでなく、Markdown list item形状・
// 行内URL総数exactly1・normalized OLD occurrence exactly1まで要求する（ES/GE precedent）。
// 形状不正な候補は「0件見つからず」に丸めず、reasonsを添えて明示的にinvalid扱いする。
type OldLineCandidateResult = {
  rawMatchIndices: number[];
  validIndex: number | null;
  invalidReasons: string[];
};

function findOldLineCandidate(
  allLines: string[],
  startLine: number,
  endLine: number,
  targetUrl: string
): OldLineCandidateResult {
  const targetNorm = normalizeUrl(targetUrl);
  const rawMatchIndices: number[] = [];
  for (let i = startLine; i < endLine; i++) {
    const urls = extractUrls(allLines[i]);
    if (urls.some((u) => normalizeUrl(u) === targetNorm)) rawMatchIndices.push(i);
  }
  if (rawMatchIndices.length !== 1) {
    return {
      rawMatchIndices,
      validIndex: null,
      invalidReasons: [`raw OLD URL-containing line count=${rawMatchIndices.length}（期待1）`],
    };
  }
  const idx = rawMatchIndices[0];
  const line = allLines[idx];
  const invalidReasons: string[] = [];
  if (!LIST_ITEM_RE.test(line)) {
    invalidReasons.push(`line is not a Markdown list item (does not match ${LIST_ITEM_RE.source}): "${line}"`);
  }
  const urls = extractUrls(line);
  if (urls.length !== 1) {
    invalidReasons.push(`line contains ${urls.length} URLs total（期待exactly1）: "${line}"`);
  }
  const normMatchCount = urls.filter((u) => normalizeUrl(u) === targetNorm).length;
  if (normMatchCount !== 1) {
    invalidReasons.push(`line normalized OLD URL occurrence=${normMatchCount}（期待1）`);
  }
  if (invalidReasons.length > 0) {
    return { rawMatchIndices, validIndex: null, invalidReasons };
  }
  return { rawMatchIndices, validIndex: idx, invalidReasons: [] };
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

const ARTICLE_COLUMNS =
  "id, slug, category, date, reading_time, title, description, content, is_published, created_at, thumbnail, thumbnail_ja, thumbnail_en, thumbnail_zh, scheduled_publish_at";

const locales: { lang: Lang; key: "ja" | "en" | "zh" }[] = [
  { lang: "ja", key: "ja" },
  { lang: "en", key: "en" },
  { lang: "zh", key: "zh" },
];

// post-write再検証（confirmed直接pathとambiguous-recovery分類Aの両方から共有）。
// 追加のtarget SELECTを発行しない（呼び出し元がpostRowを渡す）。
async function performPostVerification(
  s: Summary,
  postRow: any,
  originalRow: any,
  newContent: Record<string, string>,
  afterShaComputed: string
): Promise<Summary> {
  s.post_verification_attempted = true;
  s.post_article_row_count = 1;
  s.post_article_id_match = postRow.id === originalRow.id;
  if (!s.post_article_id_match) {
    return fail(s, "post_verification", `post-write article id不一致 (expected=${originalRow.id}, actual=${postRow.id})`);
  }

  s.post_content_match = isDeepStrictEqual(postRow.content, newContent);
  if (!s.post_content_match) {
    return fail(s, "post_verification", "post-write content mismatch: DB上のcontentがcandidate newContentとdeep-equalではありません");
  }

  s.post_content_sha = contentSha256(postRow.content);
  s.post_content_sha_match_computed_after = s.post_content_sha === afterShaComputed;
  if (!s.post_content_sha_match_computed_after) {
    return fail(s, "post_verification", `post-write content SHAがcandidate AFTER SHAと不一致（candidate=${afterShaComputed}, 実際=${s.post_content_sha}）`);
  }

  for (const { key } of locales) {
    s.post_old_count[key] = countSubstring(postRow.content[key], (s as any)[key].oldLine);
    s.post_new_count[key] = countSubstring(postRow.content[key], (s as any)[key].newLine);
    if (s.post_old_count[key] !== 0) {
      return fail(s, "post_verification", `post-write ${key} OLD line occurrence=${s.post_old_count[key]}（期待0）`);
    }
    if (s.post_new_count[key] !== 1) {
      return fail(s, "post_verification", `post-write ${key} NEW line occurrence=${s.post_new_count[key]}（期待1）`);
    }
  }

  const abort1 = activeOrFail(s, "pre_post_source_lookup");
  if (abort1) return abort1;
  const postApproved = await getApprovedSources(supabase, TARGET_COUNTRY);
  const abort2 = activeOrFail(s, "post_post_source_lookup");
  if (abort2) return abort2;

  // post-write時点でselected承認済みURLがexactly1件存在することをhard gate
  const selectedNorm = normalizeUrl(APPROVED_SOURCE_URL);
  const selectedMatchCount = postApproved.filter((a) => a.normalized === selectedNorm).length;
  s.post_selected_source_match_count = selectedMatchCount;
  if (selectedMatchCount !== 1) {
    return fail(s, "post_verification", `post-write selected source normalized match count=${selectedMatchCount}（期待exactly1）`);
  }

  const abort3 = activeOrFail(s, "pre_post_validator");
  if (abort3) return abort3;
  const postValidator = validateStudyPublication({
    title: postRow.title,
    description: postRow.description,
    content: postRow.content,
    approvedSources: postApproved,
  });
  s.post_validator_ok = postValidator.ok;
  s.post_validator_reason_count = postValidator.reasons.length;
  if (!postValidator.ok) {
    return fail(s, "post_verification", `post-write validator != PASS: ${JSON.stringify(postValidator.reasons)}`);
  }

  const invariantCheck = invariantFieldsUnchanged(originalRow, postRow);
  s.post_invariant_fields_ok = invariantCheck.ok;
  if (!invariantCheck.ok) {
    return fail(s, "post_verification", `非content列が変化しています: ${JSON.stringify(invariantCheck.changed)}`);
  }

  const abortFinal = activeOrFail(s, "pre_final_success");
  if (abortFinal) return abortFinal;

  s.success = 1;
  s.exit = 0;
  return s;
}

// CAS request自体がtimeout/network error/malformed responseで失敗した場合のambiguous
// recovery。read-only SELECTをexactly1回のみ、second CASは絶対に行わない。
// 分類A（candidate一致）はperformPostVerificationへ合流し、recovery行をpost行として
// reuseする（追加のtarget SELECTを発行しない）。
async function handleAmbiguousCasOutcome(
  s: Summary,
  originalRow: any,
  newContent: Record<string, string>,
  afterShaComputed: string
): Promise<Summary> {
  s.mutation_state = "ambiguous";

  // soft global timeout等で既にfatalなら、新規requestを試みずUNKNOWN_WRITE_OUTCOME
  if (fatal) {
    s.cas_outcome = "UNKNOWN_WRITE_OUTCOME";
    s.ambiguous_recovery_attempted = false;
    s.db_updated = true; // 不明である以上、書き込まれた可能性を否定しない
    return fail(s, "cas_ambiguous", `phaseは既にfatal(${fatalPhase})のため、recovery SELECTを試みずUNKNOWN_WRITE_OUTCOMEとします`);
  }

  s.ambiguous_recovery_attempted = true;
  s.recovery_select_attempted = true;
  s.db_updated = true; // 不明である以上、書き込まれた可能性を否定しない（後続分類で上書きされ得る）

  let recRow: any;
  try {
    const { data: recRows, error: recErr } = await supabase
      .from("study_blog_posts")
      .select(ARTICLE_COLUMNS)
      .eq("id", TARGET_ARTICLE_ID);
    if (recErr) {
      s.recovery_select_succeeded = false;
      s.cas_outcome = "UNKNOWN_WRITE_OUTCOME";
      return fail(s, "recovery_select", `recovery SELECT error: ${recErr.message}`);
    }
    if (!Array.isArray(recRows) || recRows.length !== 1) {
      s.recovery_select_succeeded = false;
      s.cas_outcome = "UNKNOWN_WRITE_OUTCOME";
      return fail(s, "recovery_select", `recovery SELECTが不正な行数/形状を返しました (rows=${Array.isArray(recRows) ? recRows.length : "non-array"})`);
    }
    recRow = recRows[0];
  } catch (e) {
    s.recovery_select_succeeded = false;
    s.cas_outcome = "UNKNOWN_WRITE_OUTCOME";
    const msg = e instanceof Error ? e.message : String(e);
    return fail(s, "recovery_select", `recovery SELECT exception（timeout等の可能性）: ${msg}`);
  }

  // content classificationより前に、recovery rowのfull identity（id/slug/category/
  // is_published/scheduled_publish_at）をすべてhard verifyする。1つでも不一致なら、
  // content一致の有無に関わらずcandidate/original classificationを一切行わず
  // RECOVERY_IDENTITY_MISMATCHとしてUNKNOWN_WRITE_OUTCOME扱いにする（wrong identity
  // rowをcontentが一致したという理由だけでapplied扱いしない）。
  const identityMismatchReasons: string[] = [];
  if (recRow.id !== TARGET_ARTICLE_ID) {
    identityMismatchReasons.push(`id mismatch: expected=${TARGET_ARTICLE_ID} actual=${String(recRow.id)}`);
  }
  if (recRow.slug !== TARGET_SLUG) {
    identityMismatchReasons.push(`slug mismatch: expected=${TARGET_SLUG} actual=${String(recRow.slug)}`);
  }
  if (recRow.category !== TARGET_CATEGORY) {
    identityMismatchReasons.push(`category mismatch: expected=${TARGET_CATEGORY} actual=${String(recRow.category)}`);
  }
  if (recRow.is_published !== true) {
    identityMismatchReasons.push(`is_published !== true (actual=${JSON.stringify(recRow.is_published)})`);
  }
  if (recRow.scheduled_publish_at !== null) {
    identityMismatchReasons.push(`scheduled_publish_at !== null (actual=${JSON.stringify(recRow.scheduled_publish_at)})`);
  }
  if (identityMismatchReasons.length > 0) {
    s.recovery_select_succeeded = false;
    s.cas_outcome = "UNKNOWN_WRITE_OUTCOME";
    return fail(s, "recovery_identity_mismatch", `RECOVERY_IDENTITY_MISMATCH: ${JSON.stringify(identityMismatchReasons)}`);
  }
  s.recovery_select_succeeded = true;

  const matchesNew = isDeepStrictEqual(recRow.content, newContent);
  const matchesOriginal = isDeepStrictEqual(recRow.content, originalRow.content);

  if (matchesNew) {
    // 分類A: candidateと一致 → 反映済みとみなし、このrowをpost observationとしてreuseする
    s.cas_outcome = "LIKELY_APPLIED_CONFIRMED_VIA_RECOVERY";
    s.mutation_state = "confirmed";
    s.db_updated = true;
    return await performPostVerification(s, recRow, originalRow, newContent, afterShaComputed);
  }
  if (matchesOriginal) {
    // 分類B: originalと一致 → 未反映と判断。second CASしない。
    s.cas_outcome = "NOT_APPLIED";
    s.mutation_state = "not_observed";
    s.db_updated = false;
    return fail(s, "cas_ambiguous", "recovery SELECT: contentはoriginalとdeep-equal。write未反映と判断、second CASしません");
  }
  // 分類C: どちらとも一致しない → UNKNOWN
  s.cas_outcome = "UNKNOWN_WRITE_OUTCOME";
  s.mutation_state = "ambiguous";
  s.db_updated = true;
  return fail(s, "cas_ambiguous", "recovery SELECT: contentがoriginal/candidateいずれとも一致しません（UNKNOWN_WRITE_OUTCOME）");
}

// ===== main =====
async function main(): Promise<Summary> {
  const s = freshSummary();
  activeSummary = s; // main()内で構築中のsを唯一のactive summaryとしてtop-level catchからも参照可能にする
  console.log(`=== BR study-country-br validator patch (${s.mode}) ===`);

  // 1. approved-source lookup
  const abortA1 = activeOrFail(s, "pre_approved_source_lookup");
  if (abortA1) return finish(abortA1);
  const approved = await getApprovedSources(supabase, TARGET_COUNTRY);
  const abortA2 = activeOrFail(s, "post_approved_source_lookup");
  if (abortA2) return finish(abortA2);
  s.approved_source_count = approved.length;
  s.pre_approved_source_count_match = approved.length === EXPECTED_BR_APPROVED_SOURCE_COUNT;
  if (!s.pre_approved_source_count_match) {
    return finish(fail(s, "source_registry", `BR approved source count(getApprovedSources)=${approved.length}（期待exactly${EXPECTED_BR_APPROVED_SOURCE_COUNT}）`));
  }
  const targetNorm = normalizeUrl(APPROVED_SOURCE_URL);
  const approvedMatches = approved.filter((a) => a.normalized === targetNorm);
  s.approved_candidate_match = approvedMatches.length;
  if (approvedMatches.length !== 1) {
    return finish(fail(s, "source_registry", `getApprovedSources("br")一致件数=${approvedMatches.length}（期待1）`));
  }
  // selected approved sourceのpurposeがexact"visa"であることをruntime hard gateする。
  s.approved_candidate_purpose = approvedMatches[0].purpose;
  s.approved_candidate_purpose_match = approvedMatches[0].purpose === EXPECTED_SOURCE_PURPOSE;
  if (!s.approved_candidate_purpose_match) {
    return finish(
      fail(
        s,
        "source_registry_purpose",
        `selected approved source purposeが期待値と不一致（期待="${EXPECTED_SOURCE_PURPOSE}", 実際=${JSON.stringify(approvedMatches[0].purpose)}）`
      )
    );
  }

  // 2. fresh article SELECT（official website GETは行わない）
  const abortT1 = activeOrFail(s, "pre_target_select");
  if (abortT1) return finish(abortT1);
  const { data: articleRows, error: articleErr } = await supabase
    .from("study_blog_posts")
    .select(ARTICLE_COLUMNS)
    .eq("slug", TARGET_SLUG);
  const abortT2 = activeOrFail(s, "post_target_select");
  if (abortT2) return finish(abortT2);
  if (articleErr) return finish(fail(s, "article_precondition", `article SELECT error: ${articleErr.message}`));
  if (!Array.isArray(articleRows)) return finish(fail(s, "article_precondition", "article SELECTが不正な形状を返しました"));
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
    return finish(fail(s, "article_precondition", `scheduled_publish_at != null (実際=${JSON.stringify(row.scheduled_publish_at)})`));
  }
  if (!row.content || typeof row.content !== "object" || Array.isArray(row.content)) {
    return finish(fail(s, "article_precondition", "content欠落または不正な形状"));
  }
  s.article_precondition_passed = true;
  s.content_sha256 = contentSha256(row.content);

  s.content_sha256_expected_match = s.content_sha256 === EXPECTED_CONTENT_SHA;
  if (!s.content_sha256_expected_match) {
    return finish(fail(s, "content_sha_guard", `content SHA-256がexpected値と不一致（期待=${EXPECTED_CONTENT_SHA}, 実際=${s.content_sha256}）。fresh reconfirmation以降にcontentが変化した可能性があるため中止します。`));
  }

  // 3. BEFORE validator gate（exact reason set hard gate、順序も含めexact一致）
  const before = validateStudyPublication({ title: row.title, description: row.description, content: row.content, approvedSources: approved });
  s.validator_before = before.ok ? "PASS" : "FAIL";
  s.validator_before_reason_count = Array.isArray(before.reasons) ? before.reasons.length : null;
  console.log(`  BEFORE validator: ${s.validator_before} (${s.validator_before_reason_count} reasons): ${JSON.stringify(before.reasons)}`);
  if (before.ok) {
    return finish(fail(s, "validator_before", "BEFORE validatorがPASSしています（想定外のdrift、FAILを期待）"));
  }
  if (!Array.isArray(before.reasons)) {
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

  // 4. Reference section取得（JA/EN/ZH）
  const jaSec = extractSectionLines(row.content.ja, "ja");
  const enSec = extractSectionLines(row.content.en, "en");
  const zhSec = extractSectionLines(row.content.zh, "zh");
  if (!jaSec || !enSec || !zhSec) return finish(fail(s, "mutation_guard", "JA/EN/ZH 参考資料sectionが見つかりません"));

  const secMap = { ja: jaSec, en: enSec, zh: zhSec };
  const jaAllLines = (row.content.ja as string).split("\n");
  const enAllLines = (row.content.en as string).split("\n");
  const zhAllLines = (row.content.zh as string).split("\n");
  const allLinesMap: Record<"ja" | "en" | "zh", string[]> = { ja: jaAllLines, en: enAllLines, zh: zhAllLines };

  // 5. OLD候補行を「Reference section内exactly1件 かつ Markdown list item形状 かつ
  //    行内URL総数1 かつ normalized OLD occurrence1」としてhard gateし、実行時に動的特定する。
  //    BRはESと同様OLD_URLが言語別（OLD_URL_BY_LANG）のため、locale別に評価する。
  const oldIdxMap: Record<"ja" | "en" | "zh", number> = { ja: -1, en: -1, zh: -1 };
  for (const { key } of locales) {
    const sec = secMap[key];
    const allLines = allLinesMap[key];
    const candidate = findOldLineCandidate(allLines, sec.startLine, sec.endLine, OLD_URL_BY_LANG[key]);
    if (candidate.validIndex === null) {
      (s as any)[key].shapeInvalidReasons = candidate.invalidReasons;
      return finish(
        fail(
          s,
          "old_line_shape_gate",
          `${key}: OLD_LINE_SHAPE_INVALID — ${JSON.stringify(candidate.invalidReasons)}（raw matches=${candidate.rawMatchIndices.length}）`
        )
      );
    }
    oldIdxMap[key] = candidate.validIndex;
    const discoveredOldLine = allLines[candidate.validIndex];

    // runtimeで発見した候補行は「位置特定」のためだけに使い、audited literal OLD
    // constant（OLD_LINE_BY_LANG）とのliteral equalityをhard gateする。1文字でも
    // 異なる場合はTARGET_DRIFTとしてcandidate buildへ進まずwrite0のままSTOPする。
    const auditedOldLine = OLD_LINE_BY_LANG[key];
    if (discoveredOldLine !== auditedOldLine) {
      return finish(
        fail(
          s,
          "old_line_literal_mismatch",
          `${key}: runtimeで発見したOLD候補行がaudited literal constantと一致しません（TARGET_DRIFT）。discovered="${discoveredOldLine}" audited="${auditedOldLine}"`
        )
      );
    }
    // 以降はaudited literal constant自体を唯一のsource of truthとして使用する
    // （discoveredOldLineとaudited literal constantはこの時点でliteral equalityが
    // 証明済みだが、置換・inverse・invariant計算は明示的にauditedOldLineを使う）。
    const oldLine = auditedOldLine;
    (s as any)[key].oldLine = oldLine;

    const wholeCount = countSubstring(row.content[key], oldLine);
    (s as any)[key].oldWholeCount = wholeCount;
    if (wholeCount !== 1) {
      return finish(fail(s, "mutation_guard", `${key} 全文中のOLD line occurrence=${wholeCount}（期待1）: "${oldLine}"`));
    }
    const newLine = (s as any)[key].newLine as string;
    const newWholeBefore = countSubstring(row.content[key], newLine);
    (s as any)[key].newWholeBeforeCount = newWholeBefore;
    if (newWholeBefore !== 0) {
      return finish(fail(s, "mutation_guard", `${key} 全文中にNEW lineが既に${newWholeBefore}件存在: "${newLine}"`));
    }

    const refOldCount = sec.lines.filter((l) => l === oldLine).length;
    (s as any)[key].oldReferenceCount = refOldCount;
    if (refOldCount !== 1) {
      return finish(fail(s, "mutation_guard", `${key} Reference内のOLD line occurrence=${refOldCount}（期待1）`));
    }
    const refNewBefore = sec.lines.filter((l) => l === newLine).length;
    (s as any)[key].newReferenceBeforeCount = refNewBefore;
    if (refNewBefore !== 0) {
      return finish(fail(s, "mutation_guard", `${key} Reference内にNEW lineが既に${refNewBefore}件存在`));
    }

    const candBefore = countUrlNormalizedInLines(sec.lines, APPROVED_SOURCE_URL);
    (s as any)[key].candidateBeforeCount = candBefore;
    if (candBefore !== 0) {
      return finish(fail(s, "mutation_guard", `${key} Reference内で承認済みURLが既に${candBefore}件引用済み（期待0）`));
    }
  }

  const crossContaminated =
    countSubstring(row.content.en, s.ja.oldLine!) > 0 ||
    countSubstring(row.content.zh, s.ja.oldLine!) > 0 ||
    countSubstring(row.content.ja, s.en.oldLine!) > 0 ||
    countSubstring(row.content.zh, s.en.oldLine!) > 0 ||
    countSubstring(row.content.ja, s.zh.oldLine!) > 0 ||
    countSubstring(row.content.en, s.zh.oldLine!) > 0;
  s.cross_language_contamination = crossContaminated;
  if (crossContaminated) {
    return finish(fail(s, "mutation_guard", "各言語のOLD lineが想定外の別言語contentに混入しています"));
  }

  // 6. deterministic expected content生成
  const newContent: Record<string, string> = { ...(row.content as Record<string, string>) };
  const newAllLinesMap: Record<"ja" | "en" | "zh", string[]> = { ja: [], en: [], zh: [] };
  for (const { key } of locales) {
    const allLines = [...allLinesMap[key]];
    allLines[oldIdxMap[key]] = (s as any)[key].newLine;
    newAllLinesMap[key] = allLines;
    newContent[key] = allLines.join("\n");
  }

  // 7. round-trip invariant
  const reversed: Record<"ja" | "en" | "zh", string> = { ja: "", en: "", zh: "" };
  for (const { key } of locales) {
    const lines = [...newAllLinesMap[key]];
    lines[oldIdxMap[key]] = (s as any)[key].oldLine;
    reversed[key] = lines.join("\n");
  }
  s.round_trip_invariant = reversed.ja === row.content.ja && reversed.en === row.content.en && reversed.zh === row.content.zh;
  if (!s.round_trip_invariant) {
    return finish(fail(s, "mutation_guard", "round-trip invariant違反: NEW→OLD逆置換がoriginal contentと一致しません"));
  }

  const inverseContent: Record<string, string> = { ...newContent, ja: reversed.ja, en: reversed.en, zh: reversed.zh };
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

  // 8. Reference invariant
  let refInvariantOk = true;
  let totalDiff = 0;
  for (const { key } of locales) {
    const sec = secMap[key];
    const secAfter = findRefSection(newContent[key], key);
    if (!secAfter) {
      refInvariantOk = false;
      continue;
    }
    const beforeLineCount = sec.endLine - sec.startLine;
    const afterLineCount = secAfter.endLine - secAfter.startLine;
    refInvariantOk = refInvariantOk && beforeLineCount === afterLineCount;
    const afterLines = newContent[key].split("\n").slice(secAfter.startLine, secAfter.endLine);
    let diffCount = 0;
    for (let i = 0; i < sec.lines.length; i++) {
      if (sec.lines[i] !== afterLines[i]) diffCount++;
    }
    refInvariantOk = refInvariantOk && diffCount === 1;
    totalDiff += diffCount;
  }
  s.reference_invariant = refInvariantOk;
  if (!refInvariantOk) {
    return finish(fail(s, "mutation_guard", "Reference section invariant違反"));
  }
  s.total_mutation_count = totalDiff;
  if (s.total_mutation_count !== 3) {
    return finish(fail(s, "mutation_guard", `total mutation count=${s.total_mutation_count}（期待3）`));
  }

  // 9. non-target deep-equal
  let nonTargetOk = true;
  for (const { key } of locales) {
    const before2 = (row.content[key] as string).replace((s as any)[key].oldLine, `___TARGET_${key.toUpperCase()}___`);
    const after2 = newContent[key].replace((s as any)[key].newLine, `___TARGET_${key.toUpperCase()}___`);
    if (before2 !== after2) nonTargetOk = false;
  }
  s.non_target_deep_equal = nonTargetOk;
  if (!nonTargetOk) {
    return finish(fail(s, "mutation_guard", "non-target deep-equal違反: Reference対象1行以外に差分があります"));
  }

  // 10. hypothetical AFTER validator（literal execution、structural proofではない）
  const after = validateStudyPublication({ title: row.title, description: row.description, content: newContent, approvedSources: approved });
  s.validator_after = after.ok ? "PASS" : "FAIL";
  s.validator_after_reason_count = after.reasons.length;
  console.log(`  hypothetical AFTER validator: ${s.validator_after} (${after.reasons.length} reasons)`);
  if (!after.ok) {
    return finish(fail(s, "validator_after", `AFTER validator != PASS: ${JSON.stringify(after.reasons)}`));
  }

  let candidateAfterOk = true;
  for (const { key } of locales) {
    const secAfterLines = extractSectionLines(newContent[key], key)!;
    const cnt = countUrlNormalizedInLines(secAfterLines.lines, APPROVED_SOURCE_URL);
    (s as any)[key].candidateAfterCount = cnt;
    if (cnt !== 1) candidateAfterOk = false;
  }
  s.candidate_after_hard_gate_passed = candidateAfterOk;
  if (!candidateAfterOk) {
    return finish(
      fail(
        s,
        "mutation_guard",
        `candidate-after hard gate失敗: JA=${s.ja.candidateAfterCount} EN=${s.en.candidateAfterCount} ZH=${s.zh.candidateAfterCount}（期待すべて1）`
      )
    );
  }

  // 11. candidate AFTER content SHA（fresh計算・report。今回hardcode gateなし）
  const afterShaComputed = contentSha256(newContent);
  s.candidate_after_content_sha = afterShaComputed;
  console.log(`  hypothetical AFTER content SHA-256: ${afterShaComputed}（今回はhardcode gateなし、Codex re-audit後にfreeze予定）`);

  if (DRY_RUN) {
    s.success = 1;
    s.exit = 0;
    console.log("  [DRY RUN] 全guard・hypothetical AFTER validatorがPASSしました。CAS RPCは呼びません（DB write 0）。");
    return finish(s);
  }

  // ===== ここから先はAPPLY経路。AUDITED_AFTER_CONTENT_SHA=nullのため今回は到達しない想定 =====

  // audited AFTER SHA hard gate。null/mismatchいずれもAPPLYを常にblockする。
  // CLI引数・環境変数によるoverride経路は存在しない（module-scope定数のみ参照）。
  if (AUDITED_AFTER_CONTENT_SHA === null) {
    s.audited_after_content_sha_configured = false;
    return finish(
      fail(
        s,
        "audited_after_sha_gate",
        "AUDITED_AFTER_CONTENT_SHAが未設定(null)のため、APPLYは常にblockされます。dry-run独立監査後に別途freezeしてください。"
      )
    );
  }
  s.audited_after_content_sha_configured = true;
  const SHA256_HEX_RE = /^[0-9a-f]{64}$/;
  if (!SHA256_HEX_RE.test(AUDITED_AFTER_CONTENT_SHA)) {
    return finish(fail(s, "audited_after_sha_gate", "AUDITED_AFTER_CONTENT_SHAが有効なsha256 hex(64桁小文字)ではありません"));
  }
  s.audited_after_content_sha_match = afterShaComputed === AUDITED_AFTER_CONTENT_SHA;
  if (!s.audited_after_content_sha_match) {
    return finish(
      fail(
        s,
        "audited_after_sha_gate",
        `candidate AFTER SHAがaudited expected値と不一致（期待=${AUDITED_AFTER_CONTENT_SHA}, 実際=${afterShaComputed}）`
      )
    );
  }

  const abortPreCas = activeOrFail(s, "pre_cas");
  if (abortPreCas) return finish(abortPreCas);

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
    // timeout/network error等: outcome不明。second CASはしない、ambiguous recoveryへ。
    return finish(await handleAmbiguousCasOutcome(s, row, newContent, afterShaComputed));
  }

  if (rpcError) {
    return finish(await handleAmbiguousCasOutcome(s, row, newContent, afterShaComputed));
  }
  if (!Array.isArray(rpcData)) {
    return finish(await handleAmbiguousCasOutcome(s, row, newContent, afterShaComputed));
  }
  if (rpcData.length === 0) {
    // 明確な0件応答（stale read/concurrent change）。これはambiguousではない。
    s.cas_outcome = "NOT_APPLIED_ZERO_ROWS";
    s.mutation_state = "not_observed";
    s.db_updated = false;
    return finish(fail(s, "cas", "CAS 0 rows: stale read / concurrent change / precondition failure（再試行しない）"));
  }
  if (rpcData.length > 1) {
    return finish(await handleAmbiguousCasOutcome(s, row, newContent, afterShaComputed));
  }
  const returnedRow = rpcData[0] as any;
  if (!returnedRow?.id || returnedRow.id !== row.id) {
    return finish(await handleAmbiguousCasOutcome(s, row, newContent, afterShaComputed));
  }

  // ===== confirmed唯一のpath =====
  s.mutation_state = "confirmed";
  s.db_updated = true;
  s.cas_outcome = "CONFIRMED";
  console.log(`  CAS成功 confirmed (id=${returnedRow.id})`);

  const abortPostCas = activeOrFail(s, "post_cas");
  if (abortPostCas) return finish(abortPostCas);

  const abortPrePostSelect = activeOrFail(s, "pre_post_target_select");
  if (abortPrePostSelect) return finish(abortPrePostSelect);
  const { data: postRow, error: postErr } = await supabase
    .from("study_blog_posts")
    .select(ARTICLE_COLUMNS)
    .eq("id", row.id)
    .single();
  const abortPostPostSelect = activeOrFail(s, "post_post_target_select");
  if (abortPostPostSelect) return finish(abortPostPostSelect);
  if (postErr || !postRow) return finish(fail(s, "post_cas_reselect", `post-CAS SELECT failure: ${postErr?.message ?? "no row"}`));

  return finish(await performPostVerification(s, postRow, row, newContent, afterShaComputed));
}

// ===== soft global watchdog（75秒） =====
// soft timer自身はfinal JSONをemitしない。fatal state設定 + phase abortのみ行い、
// final emissionはmain()のcentralized handled-failure/catchパスからのみ発生させる。
softTimer = setTimeout(() => {
  heartbeat("GLOBAL_TIMEOUT_SOFT");
  globalTimeoutFlag = true;
  setFatal("soft_timeout", new Error("global soft timeout exceeded"));
  // 意図的にemitFinal/finish()を呼ばない。意図的にclearHardWatchdog()も呼ばない。
}, SOFT_GLOBAL_TIMEOUT_MS);

main()
  .catch((e) => {
    // activeSummary（main()内で構築中の、cas_outcome/mutation_state/db_updatedが既に
    // 記録済みかもしれないsummary）を最優先で再利用する。freshSummary()での握り潰しは、
    // main()がactiveSummaryをまだ設定していない極めて早い段階での例外時のみのfallback。
    const s = activeSummary ?? freshSummary();
    const info = errorInfo(e);
    if (!fatal) setFatal("unexpected_exception", e);
    // 既にfail()等でfailure_stage/failure_reasonが記録済みなら上書きしない
    // （cas_outcome/mutation_state/db_updated同様、最初に記録された事実を保持する）。
    if (s.failure_stage === null) {
      s.failure_stage = fatalPhase;
      s.failure_reason = fatalError?.message ?? info.message;
    }
    s.failed = 1;
    s.success = 0; // 正常完了経路はfinish()へ既に到達しているはずなので、ここに来た時点でsuccessではない
    s.exit = 1;
    finish(s);
  })
  .finally(() => {
    // main()が実際にsettleしたことを確認できた、この一点でのみ両watchdogをclearする。
    clearSoftWatchdog();
    clearHardWatchdog();
  });

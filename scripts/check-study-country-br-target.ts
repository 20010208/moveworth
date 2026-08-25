/**
 * BR Target-Only Fresh Reconfirmation helper（read-only, bounded）。
 *
 * 背景:
 *   BL-20260809-02 study publication validator remediationの正式選定target
 *   `study-country-br` について、production上のfresh evidence（target row /
 *   approved sources / validator result / Reference section）を安全に
 *   再確認するための専用helper。FAIL23全件やbaseline再走査は行わない。
 *
 *   本helperは `scripts/check-study-country-es-target.ts`（ES recon helper、
 *   Codex independent code audit PASS済み。GE recon helperの構造をさらに継承）の
 *   構造・safety patternをそのまま踏襲する。module top-levelの静的importは
 *   bare specifier（@supabase/supabase-js）とNode built-in（fs, crypto）のみに
 *   限定し、authoritative utility（scripts/utils/study-publication-quality.ts）は
 *   hard watchdog登録・env読み込みが完了した**後**に dynamic `import()` で
 *   読み込む。取得したexport（getApprovedSources / validateStudyPublication /
 *   extractUrls / findRefSection / normalizeUrl）はそのまま呼び出すのみで、
 *   ロジックのcopy・再実装は一切行わない。
 *
 * Supabase使用は SELECT のみ（.insert/.update/.upsert/.delete/.rpc は
 * 一切呼ばない）。production write path・CAS・APPLYはこのfileに存在しない。
 *
 * production request上限 = 2（target row SELECT ×1 + getApprovedSources ×1）。
 * getApprovedSources に渡すSupabaseクライアントも、target SELECTと同じ
 * bounded fetch付きクライアントを使う（approved-source requestだけ
 * timeout保護の対象外になることを防ぐため）。
 *
 * スキーマ上の重要な注意（`STUDY_COUNTRY_BR_HELPER_PATCH_IMPLEMENTATION`
 * PM authorization記載）:
 *   study_blog_posts テーブルに `country` 列・`published_at` 列は存在しない。
 *   本helperはこれらの列を一切SELECT/参照しない。countryはslugからのみ導出する
 *   （TARGET_COUNTRY 定数として保持、fresh row由来ではない）。
 *
 * 実行方法（このコミット時点では未実行、PM別途承認が必要）:
 *   npx tsx scripts/check-study-country-br-target.ts
 *
 * 終了コード:
 *   0   = resultValid=true（fresh読み取り・validator評価が構造的に完了し、
 *         target identity（id/slug/category/is_published）がexact一致した。
 *         validator.ok自体は false のままで良い ── BRはまだ未修正のため
 *         FAILのままであることが正常に期待される。resultValid=trueと
 *         validator.ok=falseは両立する）
 *   1   = resultValid=false（fatal / timeout / identity mismatch / 構造不整合）
 *   124 = hard 30秒 wall-clock deadline超過（最終防波堤、通常到達しない想定）
 */
import { existsSync, readFileSync } from "fs";
import { createHash } from "crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ===== 対象は BR only（他slugをCLIで切り替え可能にしない） =====
const TARGET_SLUG = "study-country-br";
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

// PM formal selection時点のfresh production reconfirmation実測ID（読み取り専用hard gate）。
const EXPECTED_TARGET_ID = "818531d3-56a6-47f5-ae12-dbbb4a973f4d";
// carry-forward diagnostic専用（hard gateではない）。fresh registryに存在するかは
// freshCandidatePresentとしてauthoritative normalizeUrlで比較・報告するのみ。
// L2 editorial/context reviewフェーズで選定した、country-level記事に最も広く適合する
// approved source（broad federal immigration/migrant authority、Polícia Federal、
// tracked precedent `src/data/blog-posts.ts` visa-br記事とexact一致）。
const CARRY_FORWARD_SOURCE_URL_DIAGNOSTIC =
  "https://www.gov.br/pf/pt-br/assuntos/imigracao/inicio";

// ===== timeout / request bound定数（ES/GE recon helperと同一値） =====
const QUERY_TIMEOUT_MS = 10_000;
const SOFT_GLOBAL_TIMEOUT_MS = 20_000;
const HARD_GLOBAL_TIMEOUT_MS = 30_000;
// 正常経路の実際のrequest数（target SELECT×1 + approved-source lookup×1）に一致する
// 構造的上限。boundedFetch自身がnative fetch開始前にこの上限をpre-network gateとして強制する。
const MAX_PRODUCTION_REQUESTS = 2;

const START_TIME_MS = Date.now();

// ===== heartbeat（stderrのみ、secretは出力しない） =====
function heartbeat(line: string): void {
  process.stderr.write(`[br-target] ${line}\n`);
}

heartbeat("H0 RUNTIME_ENTERED");

// ===== hard global watchdog（H0直後、env読み込み・dynamic import・networkより前） =====
// unref()は意図的に使用しない。unref()するとhard timerがevent loopを維持しなくなり、
// 他に何もloopを保持するものがない場合processが30秒未満で自然終了し得て
// 「hard 30秒で確実にkillする」という保証そのものを失う。
let hardTimer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
  process.stderr.write("[br-target] HARD_WATCHDOG_FIRED\n");
  // eslint-disable-next-line no-process-exit
  process.exit(124);
}, HARD_GLOBAL_TIMEOUT_MS);

function clearHardWatchdog(): void {
  if (hardTimer) {
    clearTimeout(hardTimer);
    hardTimer = null;
  }
}

heartbeat("H1 HARD_WATCHDOG_REGISTERED");

let softTimer: ReturnType<typeof setTimeout> | null = null;
function clearSoftWatchdog(): void {
  if (softTimer) {
    clearTimeout(softTimer);
    softTimer = null;
  }
}

// ===== env読み込み（既存script群と同一pattern、新規env名は作らない） =====
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

heartbeat("H2 ENV_LOADED");

// ===== final result（stdoutへexactly1回のみ） =====
type ReferenceEvidence = { found: boolean; urlCount: number; urls: string[] } | null;

type FinalResult = {
  resultValid: boolean;
  target: {
    slug: string;
    id: string | null;
    category: string | null;
    isPublished: boolean | null;
    scheduledPublishAt: string | null;
    idMatchesExpected: boolean | null;
  } | null;
  contentSha256: string | null;
  validator: { ok: boolean; reasons: string[] } | null;
  approvedSources: Array<{ url: string; purpose: string; normalized: string }>;
  freshCandidatePresent: boolean | null;
  selectedSourceMatchCount: number | null;
  selectedSourcePurpose: string | null;
  selectedSourcePurposeMatch: boolean | null;
  carryForwardSourceUrlDiagnostic: string;
  referenceEvidence: { ja: ReferenceEvidence; en: ReferenceEvidence; zh: ReferenceEvidence };
  queryCount: number;
  timeoutCount: number;
  softGlobalTimeout: boolean;
  requestLimitExceeded: boolean;
  elapsedMs: number;
  errorPhase: string | null;
  errorName: string | null;
};

function freshResult(): FinalResult {
  return {
    resultValid: false,
    target: null,
    contentSha256: null,
    validator: null,
    approvedSources: [],
    freshCandidatePresent: null,
    selectedSourceMatchCount: null,
    selectedSourcePurpose: null,
    selectedSourcePurposeMatch: null,
    carryForwardSourceUrlDiagnostic: CARRY_FORWARD_SOURCE_URL_DIAGNOSTIC,
    referenceEvidence: { ja: null, en: null, zh: null },
    queryCount: 0,
    timeoutCount: 0,
    softGlobalTimeout: false,
    requestLimitExceeded: false,
    elapsedMs: 0,
    errorPhase: null,
    errorName: null,
  };
}

let finalEmitted = false;
let globalTimeoutFlag = false;
let requestLimitExceededFlag = false;

function errorInfo(e: unknown): { name: string; message: string } {
  if (e instanceof Error) {
    return { name: e.name, message: e.message.slice(0, 300) };
  }
  return { name: "UnknownError", message: String(e).slice(0, 300) };
}

// final JSONをstdoutへexactly1回だけ出す（この行の後にH0〜H11やnetworkが再発生しないことを
// main()側のone-way fatal latchで構造的に保証する）。
function emitFinal(result: FinalResult, exitCode: number): void {
  if (finalEmitted) return;
  finalEmitted = true;
  result.elapsedMs = Date.now() - START_TIME_MS;
  result.queryCount = queryCount;
  result.timeoutCount = timeoutCount;
  result.softGlobalTimeout = globalTimeoutFlag;
  result.requestLimitExceeded = requestLimitExceededFlag;
  console.log(JSON.stringify(result));
  heartbeat(`H12 FINAL_RESULT_EMITTED result=${result.resultValid ? "VALID" : "INVALID"}`);
  process.exitCode = exitCode;
}

// ===== phase controller（fatal / soft timeoutでabortされる共有signal、one-way latch） =====
const phaseController = new AbortController();
let fatal = false;
let fatalPhase: string | null = null;
let fatalError: { name: string; message: string } | null = null;

function setFatal(phase: string, err: unknown): void {
  if (fatal) return; // one-way latch: 最初の失敗原因のみ保持し、以降上書きしない
  fatal = true;
  fatalPhase = phase;
  fatalError = errorInfo(err);
  phaseController.abort();
}

class FatalAbortError extends Error {
  constructor(public readonly stage: string) {
    super(`fatal/abort state at stage: ${stage}`);
    this.name = "FatalAbortError";
  }
}

function assertActive(stage: string): void {
  if (fatal || phaseController.signal.aborted) {
    throw new FatalAbortError(stage);
  }
}

// ===== bounded custom fetch（全HTTPリクエストに透過的にtimeoutを適用） =====
const nativeFetch = globalThis.fetch;
let queryCount = 0;
let timeoutCount = 0;

function composeSignals(...signals: Array<AbortSignal | null | undefined>): AbortSignal {
  const present = signals.filter((s): s is AbortSignal => Boolean(s));
  return AbortSignal.any(present);
}

function boundedFetch(): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    // native fetchを一切呼ぶ前に、fatal/abort/request上限をpre-networkでgateする。
    // 3件目以降のrequestはqueryCountをincrementせずnative fetchも呼ばない。
    if (fatal || phaseController.signal.aborted) {
      throw new FatalAbortError("bounded_fetch_fatal_precheck");
    }
    if (queryCount >= MAX_PRODUCTION_REQUESTS) {
      requestLimitExceededFlag = true;
      setFatal(
        "request_limit_exceeded",
        new Error(`request limit exceeded: attempted request beyond MAX_PRODUCTION_REQUESTS=${MAX_PRODUCTION_REQUESTS}`)
      );
      throw new FatalAbortError("request_limit_exceeded");
    }

    queryCount += 1;
    const timeoutController = new AbortController();
    const queryTimer = setTimeout(() => {
      timeoutCount += 1;
      timeoutController.abort();
    }, QUERY_TIMEOUT_MS);

    const incomingSignal =
      typeof input === "object" && input instanceof Request ? input.signal : undefined;
    const composed = composeSignals(
      phaseController.signal,
      timeoutController.signal,
      init?.signal,
      incomingSignal
    );

    try {
      return await nativeFetch(input, { ...init, signal: composed });
    } finally {
      clearTimeout(queryTimer);
    }
  };
}

function isPlainObjectShape(value: unknown): boolean {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// 失敗時、fatal stateが未設定ならこの呼び出しで初めて設定し（初回原因を記録）、
// 既にfatalならno-op（one-way latchによりORIGINALな原因を保持）。その後は
// 常にfatalPhase/fatalError（global one-way state）をsource of truthとして
// resultへ反映する（ローカルにcatchした例外の情報ではなく）。
function failWith(result: FinalResult, phase: string, err: unknown): void {
  setFatal(phase, err);
  result.errorPhase = fatalPhase;
  result.errorName = fatalError?.name ?? "FatalError";
  emitFinal(result, 1);
}

// ===== main =====
async function main(): Promise<void> {
  const result = freshResult();

  // --- authoritative utilityをdynamic importでload（hard watchdog登録後） ---
  heartbeat("H3 AUTHORITATIVE_MODULE_LOADING");
  let authoritative: typeof import("./utils/study-publication-quality");
  try {
    authoritative = await import("./utils/study-publication-quality");
  } catch (e) {
    failWith(result, "authoritative_module_load", e);
    return;
  }
  // dynamic import完了直後（H4を出す前）にfatal/abort gate。import自体は成功したが、
  // 待機中にsoft timeoutが発火していた場合はここで打ち切る（H4を出さない・clientを
  // 作らない・networkへ進まない）。
  try {
    assertActive("post_import_gate");
  } catch (e) {
    failWith(result, "post_import_gate", e);
    return;
  }
  const { getApprovedSources, validateStudyPublication, findRefSection, extractUrls, normalizeUrl } = authoritative;
  heartbeat("H4 AUTHORITATIVE_MODULE_LOADED");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    result.errorPhase = "env_missing";
    result.errorName = "MissingEnv";
    emitFinal(result, 1);
    return;
  }

  try {
    assertActive("pre_client_init");
  } catch (e) {
    failWith(result, "pre_client_init", e);
    return;
  }
  const supabase: SupabaseClient<any, any, any> = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: boundedFetch(),
    },
  });
  try {
    assertActive("post_client_init");
  } catch (e) {
    failWith(result, "post_client_init", e);
    return;
  }
  heartbeat("H5 SUPABASE_CLIENT_READY");

  // --- 1. target row SELECT（exactly1回）。country/published_at列は存在しないためSELECTしない。 ---
  try {
    assertActive("pre_target_select");
  } catch (e) {
    failWith(result, "pre_target_select", e);
    return;
  }
  heartbeat("H6 TARGET_SELECT_START");
  type PostRow = {
    id: unknown;
    slug: unknown;
    category: unknown;
    is_published: unknown;
    scheduled_publish_at: unknown;
    title: unknown;
    description: unknown;
    content: unknown;
  };
  let row: PostRow;
  try {
    const { data, error } = await supabase
      .from("study_blog_posts")
      .select("id, slug, category, is_published, scheduled_publish_at, title, description, content")
      .eq("slug", TARGET_SLUG)
      .maybeSingle();

    assertActive("post_target_select"); // request await直後のfatal gate（先に判定）

    if (error) {
      failWith(result, "target_select", error);
      return;
    }
    if (!data) {
      failWith(result, "target_select", new Error(`target row not found for slug=${TARGET_SLUG}`));
      return;
    }
    row = data as unknown as PostRow;
  } catch (e) {
    failWith(result, fatal ? fatalPhase! : "target_select", e);
    return;
  }
  heartbeat("H7 TARGET_SELECT_DONE");

  // --- identity / shape gate（in-memory、structural fatal） ---
  // fresh idがEXPECTED_TARGET_IDと不一致、またはis_published !== true の場合は
  // identity driftとしてhard fatal化する（ES/GE recon helperのCodex監査済みpatternを踏襲）。
  if (typeof row.id !== "string" || row.id.trim().length === 0) {
    setFatal("identity_gate", new Error("target row has missing/invalid/whitespace-only id"));
  } else if (row.id !== EXPECTED_TARGET_ID) {
    setFatal(
      "identity_gate_id_mismatch",
      new Error(`target row id mismatch: expected=${EXPECTED_TARGET_ID} actual=${row.id}`)
    );
  } else if (typeof row.slug !== "string" || row.slug !== TARGET_SLUG) {
    setFatal("identity_gate", new Error(`target row slug mismatch: ${String(row.slug)}`));
  } else if (row.category !== TARGET_CATEGORY) {
    setFatal("identity_gate", new Error(`target row category mismatch: ${String(row.category)}`));
  } else if (row.is_published !== true) {
    setFatal(
      "identity_gate_unpublished",
      new Error(`target row not published: is_published=${JSON.stringify(row.is_published)}`)
    );
  } else if (row.scheduled_publish_at !== null) {
    // schedule anomalyをidentity driftとして明示的にhard fatal化する（ES/GE precedent）。
    setFatal(
      "identity_gate_schedule_anomaly",
      new Error(`target row has non-null scheduled_publish_at: ${JSON.stringify(row.scheduled_publish_at)}`)
    );
  } else if (!isPlainObjectShape(row.title) || !isPlainObjectShape(row.description) || !isPlainObjectShape(row.content)) {
    setFatal("identity_gate", new Error("target row title/description/content has unexpected runtime shape"));
  }

  // fatalの有無に関わらず、実際に取得できた値はsafe diagnosticとして保持する
  // （synthetic actualへの置換は行わない。carry-forward値は比較結果のみ反映）。
  result.target = {
    slug: typeof row.slug === "string" ? row.slug : String(row.slug),
    id: typeof row.id === "string" ? row.id : null,
    category: typeof row.category === "string" ? row.category : null,
    isPublished: row.is_published === true,
    scheduledPublishAt: (row.scheduled_publish_at as string | null) ?? null,
    idMatchesExpected: typeof row.id === "string" ? row.id === EXPECTED_TARGET_ID : null,
  };

  if (fatal) {
    result.errorPhase = fatalPhase;
    result.errorName = fatalError?.name ?? "FatalError";
    emitFinal(result, 1);
    return;
  }

  // fresh content SHA-256（既存patch script群と同一method: JSON.stringify(content) の sha256 hex）
  result.contentSha256 = createHash("sha256").update(JSON.stringify(row.content), "utf-8").digest("hex");

  // --- 2. approved source lookup（exactly1回、authoritative getApprovedSourcesのみ使用） ---
  // TARGET_COUNTRYはslug（"study-country-br"）から導出した定数であり、DB `country`列には
  // 依存しない（study_blog_postsにcountry列は存在しない）。
  try {
    assertActive("pre_approved_source_lookup");
  } catch (e) {
    failWith(result, "pre_approved_source_lookup", e);
    return;
  }
  heartbeat("H8 APPROVED_SOURCE_LOOKUP_START");
  let approved: Awaited<ReturnType<typeof getApprovedSources>>;
  try {
    approved = await getApprovedSources(supabase, TARGET_COUNTRY);
    assertActive("post_approved_source_lookup"); // request await直後のfatal gate
  } catch (e) {
    failWith(result, fatal ? fatalPhase! : "approved_source_lookup", e);
    return;
  }
  heartbeat(`H9 APPROVED_SOURCE_LOOKUP_DONE (${approved.length} rows)`);

  result.approvedSources = approved.map((s) => ({ url: s.url, purpose: s.purpose, normalized: s.normalized }));
  // 手動trailing-slash比較ではなく、authoritative normalizeUrlをそのまま使って
  // candidate presenceを判定する（custom normalization count = 0）。
  const candidateNormalized = normalizeUrl(CARRY_FORWARD_SOURCE_URL_DIAGNOSTIC);
  result.freshCandidatePresent = approved.some((s) => s.normalized === candidateNormalized);

  // selected approved sourceの正規化URL一致件数・purposeを明示的なruntime hard gateとして扱う
  // （comment/logging/expected labelだけでは不十分という既存Codex指摘に対応、ES/GE precedent）。
  const EXPECTED_SELECTED_SOURCE_PURPOSE = "visa";
  const selectedSourceMatches = approved.filter((s) => s.normalized === candidateNormalized);
  result.selectedSourceMatchCount = selectedSourceMatches.length;
  result.selectedSourcePurpose = selectedSourceMatches.length === 1 ? selectedSourceMatches[0].purpose : null;
  result.selectedSourcePurposeMatch =
    selectedSourceMatches.length === 1 ? selectedSourceMatches[0].purpose === EXPECTED_SELECTED_SOURCE_PURPOSE : null;
  if (selectedSourceMatches.length !== 1) {
    setFatal(
      "selected_source_gate",
      new Error(`selected approved source normalized match count=${selectedSourceMatches.length}（期待exactly1）`)
    );
  } else if (selectedSourceMatches[0].purpose !== EXPECTED_SELECTED_SOURCE_PURPOSE) {
    setFatal(
      "selected_source_purpose_gate",
      new Error(
        `selected approved source purpose=${JSON.stringify(selectedSourceMatches[0].purpose)}（期待exact"${EXPECTED_SELECTED_SOURCE_PURPOSE}"）`
      )
    );
  }

  // --- 3. Reference section evidence（authoritative findRefSection/extractUrlsのみ使用、本文全文は出さない） ---
  const contentObj = row.content as Partial<Record<"ja" | "en" | "zh", string>>;
  for (const lang of ["ja", "en", "zh"] as const) {
    const text = contentObj[lang] ?? "";
    const section = findRefSection(text, lang);
    const urls = section ? extractUrls(section.raw) : [];
    result.referenceEvidence[lang] = { found: section !== null, urlCount: urls.length, urls };
  }

  // --- 4. validator（authoritative validateStudyPublicationをexactly1回、fresh結果のみ採用） ---
  try {
    assertActive("pre_validator");
  } catch (e) {
    failWith(result, "pre_validator", e);
    return;
  }
  heartbeat("H10 VALIDATOR_START");
  let vr: { ok: boolean; reasons: string[] };
  try {
    vr = validateStudyPublication({
      title: row.title as Partial<Record<"ja" | "en" | "zh", string>>,
      description: row.description as Partial<Record<"ja" | "en" | "zh", string>>,
      content: contentObj,
      approvedSources: approved,
    });
    // validatorはsynchronousなので実行中にtimer callbackは割り込まないが、
    // return直後にfatal gateを置く。
    assertActive("post_validator");
  } catch (e) {
    failWith(result, fatal ? fatalPhase! : "validator", e);
    return;
  }
  heartbeat(`H11 VALIDATOR_DONE ok=${vr.ok}`);
  result.validator = vr;

  // --- final success gate（最終判定直前にもfatal gate） ---
  try {
    assertActive("pre_final_success");
  } catch (e) {
    failWith(result, "pre_final_success", e);
    return;
  }

  // --- structural hard gate（正常成功経路ではqueryCountはexactly2） ---
  // schedule anomaly・selected source match/purposeはsetFatal()経路で既にfatal化されているが、
  // defense-in-depthとしてここでも明示的にcross-checkする（既存のidMatchesExpected/isPublished
  // checkと同じ構造パターン、ES/GE precedent）。
  const structuralOk =
    result.target !== null &&
    result.target.idMatchesExpected === true &&
    result.target.isPublished === true &&
    result.target.scheduledPublishAt === null &&
    result.contentSha256 !== null &&
    result.validator !== null &&
    result.selectedSourceMatchCount === 1 &&
    result.selectedSourcePurposeMatch === true &&
    queryCount === 2 &&
    !requestLimitExceededFlag;

  if (!structuralOk) {
    result.errorPhase = "structural_gate";
    result.errorName = "StructuralInconsistency";
    emitFinal(result, 1);
    return;
  }

  // resultValid=true は「fresh読み取り・評価が構造的に完了し、target identity
  // （id/slug/category/is_published）がexact一致した」ことのみを意味する。
  // validator.ok は false のままで良い（BRはまだ未修正のためFAILが正常に期待される）。
  result.resultValid = true;
  emitFinal(result, 0);
}

// ===== soft global watchdog（20秒） =====
// soft timer callback自身はfinal JSONをemitしない。ここでは (1) fatal stateをone-way
// latch (2) phaseController.abort() (3) softGlobalTimeout=trueの記録 のみを行う。
// final JSON emissionはmain()のcentralized catch/handled-failure pathからのみ発生させる。
softTimer = setTimeout(() => {
  heartbeat("GLOBAL_TIMEOUT_SOFT");
  globalTimeoutFlag = true;
  setFatal("soft_timeout", new Error("global soft timeout exceeded"));
  // 意図的にemitFinal()を呼ばない。意図的にclearHardWatchdog()も呼ばない。
}, SOFT_GLOBAL_TIMEOUT_MS);

main()
  .catch((e) => {
    // main()内のいずれのtry/catchでも処理されなかった例外（bareなassertActive
    // throwを含む）をここで一元的に処理する。fatalが未設定ならここで初めて
    // 設定し、既にfatalならoriginalな原因（例: soft_timeout）を保持する。
    const result = freshResult();
    failWith(result, fatal ? fatalPhase! : "unexpected_exception", e);
  })
  .finally(() => {
    // main()が実際にsettleしたことを確認できた、この一点でのみ両watchdogをclearする。
    clearSoftWatchdog();
    clearHardWatchdog();
  });

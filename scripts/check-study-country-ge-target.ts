/**
 * GE Target-Only Fresh Reconfirmation helper（read-only, bounded）。
 *
 * 背景:
 *   BL-20260809-02 study publication validator remediationの次候補
 *   `study-country-ge` について、production上のfresh evidence（target row /
 *   approved sources / validator result / Reference section）を安全に
 *   再確認するための専用helper。FAIL25全件やbaseline再走査は行わない。
 *
 *   直前のlocal-only design phaseで、`tsx -e` によるauthoritative utilityの
 *   relative import（static import）が、zero-networkのlocal module解決
 *   だけで間欠的に有意な遅延（5回中4回2.2〜3.1秒、1回は10秒timeoutで打ち切り）
 *   を示すことを確認した。static importはmodule evaluation開始前に解決される
 *   ため、それが遅延/停止するとmodule body内のheartbeatやhard watchdog登録
 *   自体がまだ実行されない ── これは前回のGE per-article triageで観測された
 *   「heartbeat 0 かつ 60秒hard watchdog非発火」という症状と構造的に整合する。
 *
 *   本helperはこの経路を構造的に避けるため:
 *     - module top-levelの静的importはbare specifier（@supabase/supabase-js）
 *       とNode built-in（fs, crypto）のみに限定する。
 *     - authoritative utility（scripts/utils/study-publication-quality.ts）は
 *       hard watchdog登録・env読み込みが完了した**後**に dynamic `import()` で
 *       読み込む。これにより、そのimportが仮に遅延/hangしても、hard watchdogは
 *       既に稼働しており30秒で確実にprocessを終了できる
 *       （IMPORT_WATCHDOG_COVERAGE = PASS WITH BOUNDED RESIDUAL。tsx transform /
 *       Node起動 / bare static import自体の解決はH0/watchdog登録前または
 *       preemption不能領域であり、これは完全coverageと誤報しない）。
 *     - 取得したexport（getApprovedSources / validateStudyPublication /
 *       extractUrls / findRefSection / normalizeUrl）はそのまま呼び出すのみで、
 *       ロジックのcopy・再実装は一切行わない。
 *
 * Codex independent code audit（1回目）で指摘された4件（High1/Medium3）を
 * 本ファイルで是正済み:
 *   H1: fresh target IDがcarry-forward期待値と不一致でも resultValid=true に
 *       なり得た → identity gateへexact ID一致をhard gate化。
 *   M1: is_published !== true でも resultValid=true になり得た → identity
 *       gateへ is_published===true を追加。
 *   M2: production request上限=2がpostcheckのみだった → boundedFetch内で
 *       3件目requestをnative fetch開始前にpre-network拒否するgateを追加
 *       （MAX_PRODUCTION_REQUESTS定数）。
 *   M3: soft timeout発火後もdynamic import完了後・各await後にfatal gateが
 *       なく後続phaseへ進めた → `assertActive(stage)` による one-way fatal
 *       latchを全checkpointに追加。soft timer自身はfinal JSONをemitせず
 *       （fatal state設定 + phase abort のみ）、final emissionはmain()の
 *       centralized catch pathからのみ行う（H12後のheartbeat/network/
 *       final JSON再emitを構造的に禁止）。
 *
 * Supabase使用は SELECT のみ（.insert/.update/.upsert/.delete/.rpc は
 * 一切呼ばない）。production write path・CAS・APPLYはこのfileに存在しない。
 *
 * production request上限 = 2（target row SELECT ×1 + getApprovedSources ×1）。
 * getApprovedSources に渡すSupabaseクライアントも、target SELECTと同じ
 * bounded fetch付きクライアントを使う（approved-source requestだけ
 * timeout保護の対象外になることを防ぐため）。
 *
 * 実行方法（このコミット時点では未実行、PM別途承認が必要）:
 *   npx tsx scripts/check-study-country-ge-target.ts
 *
 * 終了コード:
 *   0   = resultValid=true（fresh読み取り・validator評価が構造的に完了し、
 *         target identity（id/slug/category/is_published）がexact一致した。
 *         validator.ok自体は false のままで良い ── GE記事はまだ未修正のため
 *         FAILのままであることが正常に期待される。resultValid=trueと
 *         validator.ok=falseは両立する）
 *   1   = resultValid=false（fatal / timeout / identity mismatch / 構造不整合）
 *   124 = hard 30秒 wall-clock deadline超過（最終防波堤、通常到達しない想定）
 */
import { existsSync, readFileSync } from "fs";
import { createHash } from "crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ===== 対象は GE only（他slugをCLIで切り替え可能にしない） =====
const TARGET_SLUG = "study-country-ge";
const TARGET_COUNTRY = "ge";
const TARGET_CATEGORY = "country";
// Codex H1是正: 以前はcarry-forward diagnosticとしてのみ比較していたが、
// 今回からhard identity gateとして扱う。fresh idがこの値と一致しない場合は
// 同slug別row等のidentity driftとみなし、resultValid=false・source lookup/
// validator実行0・queryCount=1でexit nonzeroにする。
const EXPECTED_TARGET_ID = "ff7c5720-7405-4547-913a-bf622ac65730";
// carry-forward diagnostic専用（hard gateではない）。fresh registryに存在するかは
// freshCandidatePresentとしてauthoritative normalizeUrlで比較・報告するのみ。
const CARRY_FORWARD_SOURCE_URL_DIAGNOSTIC = "https://sda.gov.ge";

// ===== timeout / request bound定数 =====
const QUERY_TIMEOUT_MS = 10_000;
const SOFT_GLOBAL_TIMEOUT_MS = 20_000;
const HARD_GLOBAL_TIMEOUT_MS = 30_000;
// Codex M2是正: 正常経路の実際のrequest数（target SELECT×1 + approved-source
// lookup×1）に一致する構造的上限。boundedFetch自身がnative fetch開始前に
// この上限をpre-network gateとして強制する。
const MAX_PRODUCTION_REQUESTS = 2;

const START_TIME_MS = Date.now();

// ===== heartbeat（stderrのみ、secretは出力しない） =====
function heartbeat(line: string): void {
  process.stderr.write(`[ge-target] ${line}\n`);
}

heartbeat("H0 RUNTIME_ENTERED");

// ===== hard global watchdog（H0直後、env読み込み・dynamic import・networkより前） =====
// Codex確認: unref()は意図的に使用しない。unref()するとhard timerがevent loopを
// 維持しなくなり、他に何もloopを保持するものがない場合processが30秒未満で
// 自然終了し得て「hard 30秒で確実にkillする」という保証そのものを失う。
let hardTimer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
  process.stderr.write("[ge-target] HARD_WATCHDOG_FIRED\n");
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

// H12はfinal JSONをstdoutへemitした時点でのみ出す（この行の後にH0〜H11や
// networkが再発生しないことをmain()側のone-way fatal latchで構造的に保証する）。
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

// Codex M3是正: fatal/aborted状態のone-way gate。呼び出し箇所（各await直後・
// 各phase開始直前）でこれを呼び、fatalなら例外をthrowしてそのstageの処理を
// 打ち切る。soft timerが処理中に発火していた場合、この関数がある限り
// 後続phase（Supabase client作成・target/approved-source request・validator・
// 最終success判定）へは絶対に進めない。過剰なframework化を避けるため
// 単純な関数1つのみとする。
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
    // Codex M2是正: native fetchを一切呼ぶ前に、fatal/abort/request上限を
    // pre-networkでgateする。3件目以降のrequestはqueryCountをincrementせず
    // native fetchも呼ばない。
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
  // Codex M3是正: dynamic import完了直後（H4を出す前）にfatal/abort gate。
  // import自体は成功したが、待機中にsoft timeoutが発火していた場合はここで
  // 打ち切る（H4を出さない・clientを作らない・networkへ進まない）。
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

  // --- 1. target row SELECT（exactly1回） ---
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
  // Codex H1/M1是正: fresh idがEXPECTED_TARGET_IDと不一致、またはis_published
  // !== true の場合もidentity driftとしてhard fatal化する（以前はcarry-forward
  // 比較のみでdiagnostic扱いだった／is_publishedチェックが存在しなかった）。
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

  // fresh content SHA-256（BG/AE等既存patch scriptと同一method: JSON.stringify(content) の sha256 hex）
  result.contentSha256 = createHash("sha256").update(JSON.stringify(row.content), "utf-8").digest("hex");

  // --- 2. approved source lookup（exactly1回、authoritative getApprovedSourcesのみ使用） ---
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
  // Codex Low是正: 手動trailing-slash比較ではなく、authoritative normalizeUrlを
  // そのまま使ってcandidate presenceを判定する（custom normalization count = 0）。
  const candidateNormalized = normalizeUrl(CARRY_FORWARD_SOURCE_URL_DIAGNOSTIC);
  result.freshCandidatePresent = approved.some((s) => s.normalized === candidateNormalized);

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
    // return直後にfatal gateを置く（Codex指摘の「validator前後」の後半）。
    assertActive("post_validator");
  } catch (e) {
    failWith(result, fatal ? fatalPhase! : "validator", e);
    return;
  }
  heartbeat(`H11 VALIDATOR_DONE ok=${vr.ok}`);
  result.validator = vr;

  // --- final success gate（Codex M3是正: 最終判定直前にもfatal gate） ---
  try {
    assertActive("pre_final_success");
  } catch (e) {
    failWith(result, "pre_final_success", e);
    return;
  }

  // --- structural hard gate（正常成功経路ではqueryCountはexactly2） ---
  const structuralOk =
    result.target !== null &&
    result.target.idMatchesExpected === true &&
    result.target.isPublished === true &&
    result.contentSha256 !== null &&
    result.validator !== null &&
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
  // validator.ok は false のままで良い（GEはまだ未修正のためFAILが正常に
  // 期待される）。
  result.resultValid = true;
  emitFinal(result, 0);
}

// ===== soft global watchdog（20秒） =====
// Codex M3是正: soft timer callback自身はfinal JSONをemitしない。
// ここでは (1) fatal stateをone-way latch (2) phaseController.abort()
// (3) softGlobalTimeout=trueの記録 のみを行う。final JSON emissionは
// main()のcentralized catch/handled-failure pathからのみ発生させることで、
// 「H12が出た後に別のheartbeat/final JSONが出る」という状態を構造的に防ぐ。
softTimer = setTimeout(() => {
  heartbeat("GLOBAL_TIMEOUT_SOFT");
  globalTimeoutFlag = true;
  setFatal("soft_timeout", new Error("global soft timeout exceeded"));
  // 意図的にemitFinal()を呼ばない。意図的にclearHardWatchdog()も呼ばない。
  // main()側のassertActive()経路、またはmain().catch()が実際のsettleを
  // 確認してからfinal JSONをemitする。hard30秒の強制終了保証はsoft timeout
  // 後も生かしたままにする。
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

/**
 * Bounded, read-only, authoritative production baseline checker for
 * study_blog_posts（study-country-*, study-work-*）。
 *
 * 背景（BL-20260809-02 study-work-bg PRIMARY preflight中に発生した障害の是正）:
 *   1. 以前のfileless ad-hoc `tsx -e` baseline checkerは、per-query timeout・
 *      global watchdog・progress heartbeatのいずれも実装しておらず、country
 *      lookupの1requestが応答を返さないまま約58分間silentにhangした
 *      （stdout/stderr 0 bytes、process自体は生存し続けた）。
 *   2. 別のad-hoc検証scriptでは、`scripts/utils/study-publication-quality.ts`
 *      の`extractUrls()`（markdown link・HTMLアンカー・生URLの3-regex fallback）
 *      を部分的にしか再実装せず（markdown regexのみ）、`study-work-dk`の
 *      Reference行が採用している「label (https://...)」という素のURL括弧
 *      形式を検出できず、実在しない"production baseline drift"を誤検知した
 *      （INVALID_MEASUREMENT、Codex correction auditで訂正済み）。
 *
 * 本scriptはこの2つの障害クラスを構造的に再発不能にする設計:
 *   - `getApprovedSources()` / `validateStudyPublication()` を
 *     `scripts/utils/study-publication-quality.ts` から無改変でimportし、
 *     URL抽出・参考資料section検出・正規化・承認判定ロジックを一切
 *     再実装しない（authoritative semantics完全再利用）。
 *   - Supabaseクライアント生成時に`global.fetch`をbounded custom fetchで
 *     置き換え、`getApprovedSources()`内部の呼び出しを含む全HTTPリクエストに
 *     透過的に per-request 10秒timeout（実際にnative fetchをabortする）を
 *     適用する。既存のincoming signal（Request.signal / init.signal）は
 *     上書きせず`AbortSignal.any()`で合成する。
 *   - global soft watchdog（55秒）でphase全体をabortし、まだ最終結果を
 *     出力していなければfailure summaryを出す。global hard watchdog
 *     （60秒）でprocessがまだ生存していれば`process.exit(124)`で強制終了する
 *     （前回の"無期限silent hang"を構造的に不可能にする最終防波堤）。
 *   - country lookupはunique country単位でexactly1回・最大5並列の
 *     bounded worker poolで実行し、1件でもtimeout/error/exceptionが
 *     発生したらexactly1回fatal状態にしてphaseをabortし、以降新規lookupを
 *     開始しない（retry禁止）。
 *   - 本scriptはSELECT-onlyであり、`.insert()`/`.update()`/`.upsert()`/
 *     `.delete()`/`.rpc()`のいずれも一切呼ばない。BG patch script等の
 *     child_process起動・importも一切行わない。
 *   - production policy値（総件数103・PASS77・FAIL26・country_sources389・
 *     FAIL26 exact set・DK PASS/BG FAIL期待値）は本script内にhardcodeしない。
 *     本scriptの責務はauthoritative実測値とstructural validityの提供のみ。
 *     current expected値との比較はPM/呼び出し側のorchestration責務とする。
 *
 * 使い方（実行はPM別途承認が必要。本コミット時点では未実行）:
 *   npx tsx scripts/check-study-production-baseline.ts
 *
 * 終了コード:
 *   0   = resultValid=true（構造的に健全な実測が得られた。current productionが
 *         expected policy値と一致するかどうかは呼び出し側が別途判定する）
 *   1   = resultValid=false（fatal/timeout/構造不整合。partial baselineは
 *         正常な結果として扱わない）
 *   124 = hard 60秒 wall-clock deadline超過（最終防波堤、通常到達しない想定）
 */
import { existsSync, readFileSync } from "fs";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getApprovedSources,
  validateStudyPublication,
  type ApprovedSource,
  type Lang,
  type Metadata,
} from "./utils/study-publication-quality";

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

// ===== timeout / concurrency定数（production policy値はここに含めない） =====
const QUERY_TIMEOUT_MS = 10_000;
const SOFT_GLOBAL_TIMEOUT_MS = 55_000;
const HARD_GLOBAL_TIMEOUT_MS = 60_000;
const MAX_CONCURRENCY = 5;
// resource safety cap（policy値ではなく、暴走的なfan-outを防ぐ構造的上限）
const MAX_COUNTRY_LOOKUPS = 103;

const START_TIME_MS = Date.now();

// ===== heartbeat（stderrのみ、secretは出力しない） =====
function heartbeat(line: string): void {
  process.stderr.write(`[baseline] ${line}\n`);
}

// ===== final summary（stdoutへexactly1回のみ） =====
type FinalSummary = {
  resultValid: boolean;
  total: number | null;
  pass: number | null;
  fail: number | null;
  countryPass: number | null;
  countryFail: number | null;
  workPass: number | null;
  workFail: number | null;
  countrySourcesTotal: number | null;
  evaluated: number | null;
  validatorExceptions: number;
  failSlugs: string[];
  failCount: number;
  failUnique: number;
  dkInFail: boolean;
  bgInFail: boolean;
  durationMs: number;
  queryCount: number;
  timeoutCount: number;
  globalTimeout: boolean;
  uniqueCountryCount: number | null;
  errorPhase: string | null;
  errorName: string | null;
};

function freshSummary(): FinalSummary {
  return {
    resultValid: false,
    total: null,
    pass: null,
    fail: null,
    countryPass: null,
    countryFail: null,
    workPass: null,
    workFail: null,
    countrySourcesTotal: null,
    evaluated: null,
    validatorExceptions: 0,
    failSlugs: [],
    failCount: 0,
    failUnique: 0,
    dkInFail: false,
    bgInFail: false,
    durationMs: 0,
    queryCount: 0,
    timeoutCount: 0,
    globalTimeout: false,
    uniqueCountryCount: null,
    errorPhase: null,
    errorName: null,
  };
}

let finalEmitted = false;
let globalTimeoutFlag = false;
let softTimer: ReturnType<typeof setTimeout> | null = null;
let hardTimer: ReturnType<typeof setTimeout> | null = null;

// Codex code audit H1是正: soft/hard watchdogのclear責務を分離する。
// 以前はemitFinal()が無条件に両方clearしていたため、soft55秒のfailure summary
// emit時点でhard60秒の強制終了保証まで消えてしまっていた（in-flight work未settle
// のまま"諦めたつもりがまだ生きているprocess"という前回の障害と同型のリスク）。
// hard timerはmain()が実際にsettle（resolve/rejectいずれか）した後にのみclearする
// （main().finally()から呼ぶ、下記参照）。soft timerはfire済みなら明示clearは
// formalityだが、成功/early-failure時にstaleな発火を防ぐため合わせてclearする。
function clearSoftWatchdog(): void {
  if (softTimer) {
    clearTimeout(softTimer);
    softTimer = null;
  }
}

function clearHardWatchdog(): void {
  if (hardTimer) {
    clearTimeout(hardTimer);
    hardTimer = null;
  }
}

/**
 * stdoutへfinal JSONをexactly1回だけ出す。2回目以降の呼び出しはno-op。
 * Codex code audit M1是正: watchdog lifecycleには一切触れず（H1参照）、
 * queryCount/timeoutCount/globalTimeoutを呼び出し箇所によらず必ずここで
 * actual global stateへ同期する（呼び出し側で個別に同期し忘れる経路を排除）。
 */
function emitFinal(summary: FinalSummary, exitCode: number): void {
  if (finalEmitted) return;
  finalEmitted = true;
  summary.durationMs = Date.now() - START_TIME_MS;
  summary.queryCount = queryCount;
  summary.timeoutCount = timeoutCount;
  summary.globalTimeout = globalTimeoutFlag;
  heartbeat(`END result=${summary.resultValid ? "PASS" : "FAIL"}`);
  console.log(JSON.stringify(summary));
  process.exitCode = exitCode;
}

function errorInfo(e: unknown): { name: string; message: string } {
  if (e instanceof Error) {
    return { name: e.name, message: e.message.slice(0, 300) };
  }
  return { name: "UnknownError", message: String(e).slice(0, 300) };
}

// ===== hard global watchdog（module scopeで即座に起動、最終防波堤） =====
hardTimer = setTimeout(() => {
  process.stderr.write("[baseline] GLOBAL_TIMEOUT_HARD\n");
  // eslint-disable-next-line no-process-exit
  process.exit(124);
}, HARD_GLOBAL_TIMEOUT_MS);

// ===== phase controller（fatal / soft timeoutでabortされる共有signal） =====
const phaseController = new AbortController();
let fatal = false;
let fatalPhase: string | null = null;
let fatalError: { name: string; message: string } | null = null;

function setFatal(phase: string, err: unknown): void {
  if (fatal) return; // exactly1回だけ記録する
  fatal = true;
  fatalPhase = phase;
  fatalError = errorInfo(err);
  phaseController.abort();
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

// ===== Supabaseクライアント（read-only用途、session永続化は無効化） =====
function buildClient(): SupabaseClient<any, any, any> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: boundedFetch(),
    },
  });
}

// ===== country derivation（strict slug regex、独自parseを許可しない） =====
const SLUG_RE = /^study-(country|work)-([a-z]{2})$/;

type PostRow = {
  id: unknown;
  slug: unknown;
  category: unknown;
  title: unknown;
  description: unknown;
  content: unknown;
  is_published: unknown;
};

// Codex code audit M3是正: outer shape（non-null object / non-array）のみを
// 確認するruntime guard。title/description/contentの中身（ja/en/zh各keyの
// string型判定・参考資料section・URL妥当性等）はauthoritative
// `validateStudyPublication()`/`extractUrls()`/`findRefSection()`の責務であり、
// ここで意味的な二重チェックはしない。
function isPlainObjectShape(value: unknown): boolean {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// ===== bounded worker pool（外部依存なし、共有cursorでdeterministic claim） =====
// Codex code audit M2是正: `Promise.all(runners)`は、いずれか1 runnerが
// rejectした瞬間に他のstill-pending runnersの完了を待たずcontrolを返して
// しまう（短絡動作）。これにより「全workerがsettleするまで待つ」という
// 前提が崩れ得た。`Promise.allSettled`へ変更し、さらにworker呼び出し自体も
// runner側でtry/catchすることで、呼び出し元callbackが万一自身のエラーを
// 飲み込み損ねた場合でも黙って握り潰さずfatal化する（defense in depth）。
async function runBoundedPool(
  itemCount: number,
  concurrency: number,
  worker: (index: number) => Promise<void>
): Promise<void> {
  let cursor = 0;
  async function runner(): Promise<void> {
    while (true) {
      if (fatal) return;
      const i = cursor;
      cursor += 1;
      if (i >= itemCount) return;
      try {
        await worker(i);
      } catch (e) {
        setFatal("country_lookups", e);
      }
    }
  }
  const workerCount = Math.min(concurrency, itemCount);
  const runners: Promise<void>[] = [];
  for (let i = 0; i < workerCount; i++) runners.push(runner());
  const settled = await Promise.allSettled(runners);
  const unexpectedRejection = settled.find(
    (r): r is PromiseRejectedResult => r.status === "rejected"
  );
  if (unexpectedRejection) {
    setFatal("country_lookups", unexpectedRejection.reason);
  }
}

// ===== main =====
async function main(): Promise<void> {
  const summary = freshSummary();
  heartbeat("START");

  const supabase = buildClient();
  if (!supabase) {
    summary.errorPhase = "env_missing";
    summary.errorName = "MissingEnv";
    emitFinal(summary, 1);
    return;
  }

  // --- 1. posts query（exactly1回） ---
  heartbeat("posts query start");
  let posts: PostRow[];
  try {
    const { data, error, count } = await supabase
      .from("study_blog_posts")
      .select("id, slug, category, title, description, content, is_published", { count: "exact" })
      .eq("is_published", true)
      .in("category", ["country", "work"])
      .order("slug", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      setFatal("posts_query", error);
      summary.errorPhase = "posts_query";
      summary.errorName = errorInfo(error).name;
      emitFinal(summary, 1);
      return;
    }
    if (!data) {
      setFatal("posts_query", new Error("posts query returned null data"));
      summary.errorPhase = "posts_query";
      summary.errorName = "NullData";
      emitFinal(summary, 1);
      return;
    }
    if (count === null || count === undefined) {
      setFatal("posts_query", new Error("posts query returned null count"));
      summary.errorPhase = "posts_query";
      summary.errorName = "NullCount";
      emitFinal(summary, 1);
      return;
    }
    if (count !== data.length) {
      setFatal("posts_query", new Error(`posts count/data mismatch: count=${count} data.length=${data.length}`));
      summary.errorPhase = "posts_query";
      summary.errorName = "CountDataMismatch";
      emitFinal(summary, 1);
      return;
    }
    posts = data as unknown as PostRow[];
  } catch (e) {
    setFatal("posts_query", e);
    const info = errorInfo(e);
    summary.errorPhase = "posts_query";
    summary.errorName = info.name;
    emitFinal(summary, 1);
    return;
  }
  heartbeat(`posts query complete (${posts.length} rows)`);
  summary.total = posts.length;

  // --- 2. source total count query（exactly1回、承認判定には使わない） ---
  heartbeat("source count query start");
  try {
    const { count, error } = await supabase
      .from("country_sources")
      .select("*", { count: "exact", head: true });
    if (error) {
      setFatal("source_count_query", error);
      summary.errorPhase = "source_count_query";
      summary.errorName = errorInfo(error).name;
      emitFinal(summary, 1);
      return;
    }
    if (count === null || count === undefined) {
      setFatal("source_count_query", new Error("source count query returned null count"));
      summary.errorPhase = "source_count_query";
      summary.errorName = "NullCount";
      emitFinal(summary, 1);
      return;
    }
    summary.countrySourcesTotal = count;
  } catch (e) {
    setFatal("source_count_query", e);
    const info = errorInfo(e);
    summary.errorPhase = "source_count_query";
    summary.errorName = info.name;
    emitFinal(summary, 1);
    return;
  }
  heartbeat(`source count query complete (${summary.countrySourcesTotal} rows)`);

  // --- 3. identity gates + country derivation（in-memory、structural fatal） ---
  const seenSlugs = new Set<string>();
  const seenIds = new Set<string>();
  const derivedCategory: ("country" | "work")[] = [];
  const derivedCountry: string[] = [];

  for (const row of posts) {
    const id = row.id;
    const slug = row.slug;
    const category = row.category;

    if (typeof id !== "string" || id.trim().length === 0) {
      setFatal("identity_gates", new Error("row has missing/invalid/whitespace-only id"));
      break;
    }
    if (typeof slug !== "string" || slug.trim().length === 0) {
      setFatal("identity_gates", new Error("row has missing/invalid/whitespace-only slug"));
      break;
    }
    if (category !== "country" && category !== "work") {
      setFatal("identity_gates", new Error(`row has unknown category: ${String(category)}`));
      break;
    }
    if (row.is_published !== true) {
      setFatal("identity_gates", new Error(`row is_published !== true for slug=${String(slug)}`));
      break;
    }
    if (!isPlainObjectShape(row.title)) {
      setFatal("identity_gates", new Error(`row title has unexpected runtime shape for slug=${String(slug)}`));
      break;
    }
    if (!isPlainObjectShape(row.description)) {
      setFatal("identity_gates", new Error(`row description has unexpected runtime shape for slug=${String(slug)}`));
      break;
    }
    if (!isPlainObjectShape(row.content)) {
      setFatal("identity_gates", new Error(`row content has unexpected runtime shape for slug=${String(slug)}`));
      break;
    }
    if (seenSlugs.has(slug)) {
      setFatal("identity_gates", new Error(`duplicate slug detected: ${slug}`));
      break;
    }
    if (seenIds.has(id)) {
      setFatal("identity_gates", new Error(`duplicate id detected: ${id}`));
      break;
    }
    seenSlugs.add(slug);
    seenIds.add(id);

    const m = SLUG_RE.exec(slug);
    if (!m) {
      setFatal("identity_gates", new Error(`slug does not match authoritative pattern: ${slug}`));
      break;
    }
    const [, slugCategory, countryCode] = m;
    if (slugCategory !== category) {
      setFatal("identity_gates", new Error(`slug/category mismatch: slug=${slug} category=${category}`));
      break;
    }
    derivedCategory.push(category);
    derivedCountry.push(countryCode);
  }

  if (fatal) {
    summary.errorPhase = fatalPhase;
    summary.errorName = fatalError?.name ?? "FatalError";
    emitFinal(summary, 1);
    return;
  }

  const uniqueCountries = [...new Set(derivedCountry)].sort();
  summary.uniqueCountryCount = uniqueCountries.length;

  if (uniqueCountries.length > MAX_COUNTRY_LOOKUPS) {
    summary.errorPhase = "country_cap_gate";
    summary.errorName = "CountryCapExceeded";
    emitFinal(summary, 1);
    return;
  }

  // --- 4. approved source lookups（unique countryごとexactly1回、bounded pool） ---
  heartbeat(`country lookup start (${uniqueCountries.length} countries)`);
  const approvedCache = new Map<string, ApprovedSource[]>();
  let completedLookups = 0;

  await runBoundedPool(uniqueCountries.length, MAX_CONCURRENCY, async (i) => {
    const code = uniqueCountries[i];
    try {
      const result = await getApprovedSources(supabase, code);
      if (fatal) return; // fatal発生後に届いた結果は採用しない
      approvedCache.set(code, result);
      completedLookups += 1;
      if (completedLookups % 5 === 0) {
        heartbeat(`country lookup progress ${completedLookups}/${uniqueCountries.length}`);
      }
    } catch (e) {
      setFatal("country_lookups", e);
      heartbeat(`country lookup FAILED code=${code}`);
    }
  });

  if (fatal) {
    summary.errorPhase = fatalPhase;
    summary.errorName = fatalError?.name ?? "FatalError";
    emitFinal(summary, 1);
    return;
  }
  heartbeat(`country lookup progress ${completedLookups}/${uniqueCountries.length}`);

  if (approvedCache.size !== uniqueCountries.length) {
    summary.errorPhase = "cache_completeness_gate";
    summary.errorName = "IncompleteApprovedCache";
    emitFinal(summary, 1);
    return;
  }

  // --- 5. validation（pure/in-memory、shared authoritative validatorのみ使用） ---
  heartbeat("validation start");
  let pass = 0;
  let fail = 0;
  let countryPass = 0;
  let countryFail = 0;
  let workPass = 0;
  let workFail = 0;
  let evaluated = 0;
  const failSlugs: string[] = [];

  for (let i = 0; i < posts.length; i++) {
    const row = posts[i];
    const category = derivedCategory[i];
    const countryCode = derivedCountry[i];
    const approved = approvedCache.get(countryCode)!;
    try {
      // row.title/description/contentは"3. identity gates"のisPlainObjectShape()
      // gateを既に通過済み（non-null object・non-array）。ja/en/zh各keyの型等の
      // 意味的検証はvalidateStudyPublication自身の責務であり、ここでは
      // outer shapeの妥当性を根拠にした最小限のcastのみ行う。
      const result = validateStudyPublication({
        title: row.title as Metadata,
        description: row.description as Metadata,
        content: row.content as Partial<Record<Lang, string>>,
        approvedSources: approved,
      });
      evaluated += 1;
      if (result.ok) {
        pass += 1;
        if (category === "country") countryPass += 1;
        else workPass += 1;
      } else {
        fail += 1;
        failSlugs.push(row.slug as string);
        if (category === "country") countryFail += 1;
        else workFail += 1;
      }
    } catch (e) {
      summary.validatorExceptions += 1;
      heartbeat(`validation EXCEPTION slug=${String(row.slug)}`);
    }
  }
  heartbeat(`validation complete (${evaluated}/${posts.length})`);

  summary.evaluated = evaluated;
  summary.pass = pass;
  summary.fail = fail;
  summary.countryPass = countryPass;
  summary.countryFail = countryFail;
  summary.workPass = workPass;
  summary.workFail = workFail;
  failSlugs.sort();
  summary.failSlugs = failSlugs;
  summary.failCount = failSlugs.length;
  summary.failUnique = new Set(failSlugs).size;
  summary.dkInFail = failSlugs.includes("study-work-dk");
  summary.bgInFail = failSlugs.includes("study-work-bg");
  // queryCount/timeoutCount/globalTimeoutはemitFinal()内で常にactual global stateへ
  // 同期されるため、ここでの個別代入は不要（M1是正: 同期漏れ経路を構造的に排除）。

  // --- 6. structural hard gates（evaluated一致・exceptions0・算術整合性） ---
  const structuralOk =
    evaluated === posts.length &&
    summary.validatorExceptions === 0 &&
    pass + fail === evaluated &&
    countryPass + countryFail + workPass + workFail === evaluated &&
    pass === countryPass + workPass &&
    fail === countryFail + workFail &&
    summary.failCount === summary.failUnique;

  if (!structuralOk) {
    summary.errorPhase = "arithmetic_gates";
    summary.errorName = "StructuralInconsistency";
    emitFinal(summary, 1);
    return;
  }

  summary.resultValid = true;
  emitFinal(summary, 0);
}

// ===== soft global watchdog（55秒） =====
// Codex code audit H1是正: ここではhard watchdogを一切clearしない。
// abortはphaseController経由でin-flight requestへ伝播するが、実際にmain()の
// 呼び出しchainがsettle（resolve/reject）するまでの間、何らかの理由でsettleが
// 止まった場合に備え、hard60秒の強制終了保証をそのまま生かしておく。
softTimer = setTimeout(() => {
  heartbeat("GLOBAL_TIMEOUT_SOFT");
  globalTimeoutFlag = true;
  setFatal("soft_timeout", new Error("global soft timeout exceeded"));
  const summary = freshSummary();
  summary.errorPhase = fatalPhase ?? "soft_timeout";
  summary.errorName = fatalError?.name ?? "GlobalSoftTimeout";
  emitFinal(summary, 1);
  // 意図的にclearHardWatchdog()を呼ばない。main().finally()が実際のsettleを
  // 確認してから呼ぶ（下記）。
}, SOFT_GLOBAL_TIMEOUT_MS);

main()
  .catch((e) => {
    const summary = freshSummary();
    const info = errorInfo(e);
    summary.errorPhase = fatalPhase ?? "unexpected_exception";
    summary.errorName = info.name;
    emitFinal(summary, 1);
  })
  .finally(() => {
    // main()が（内部でemitFinal済みのresolveであれ、ここまで到達しなかった
    // rejectionのcatchであれ）実際にsettleしたことを確認できた、この一点でのみ
    // 両watchdogをclearする。soft timeout後もこの.finally()が発火するまで
    // hard60秒timerは生き続け、settleが止まった場合はexactly60秒でprocess.exit(124)
    // が発動する。
    clearSoftWatchdog();
    clearHardWatchdog();
  });

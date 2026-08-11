/**
 * BL-20260809-02 / BL-20260809-04: study-country-cz向けCZ single source registry追加。
 * Codex独立監査（Design v3, PASS WITH NOTES）に基づく実装。
 *
 * hard-coded target（1件のみ、汎用化しない。CLI引数でcountry/slug/URL/payloadを差し替え不可）:
 *   slug = study-country-cz / country = cz
 *   url  = https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/long-term-visa/long-term-visa-for-the-purpose-of-studies/
 *
 * mutation state model（Design v3）:
 *   type MutationState = "not_observed" | "confirmed" | "ambiguous"
 *   invariant: confirmed→db_updated=true, ambiguous→db_updated=true, not_observed→db_updated=false
 *
 * insert_attempted: production INSERT呼び出しの「直前」（dispatch boundary）でtrueへ設定する。
 *   INSERT呼び出し中に例外が発生してもpost-dispatchとして保守的にambiguous扱いするため。
 *
 * single ambiguous recovery handler（handleAmbiguousInsertOutcome）:
 *   INSERT dispatch後にconfirmed条件（exactly 1 row + exact identity一致）を満たさない
 *   全ケース（network error, response parse error, PostgREST error, UNIQUE violation,
 *   returned rows=0, returned rows>1, identity mismatch, malformed response）を
 *   単一のhandlerへ集約する。個別caseからdb_updated=falseへ直行するpathは作らない。
 *   recovery SELECT自体が失敗した場合も明示的にhandleし（追加retry・fallback SELECTなし）、
 *   mutation_state="ambiguous"を維持したままSTOPする。
 *
 * write path: country_sources.insert() exactly 1箇所のみ。UPDATE/UPSERT/DELETEは実装しない。
 * study_blog_postsへの書き込みは一切行わない（SELECT-only）。
 *
 * 使い方:
 *   npx tsx scripts/add-study-source-cz-long-term-visa.ts            (DRY_RUN)
 *   npx tsx scripts/add-study-source-cz-long-term-visa.ts --apply    (要 ALLOW_PRODUCTION_COUNTRY_SOURCE_INSERT=1)
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import {
  getApprovedSources,
  validateStudyPublication,
  findRefSection,
  extractUrls,
  normalizeUrl,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = createClient<any, any, any>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ===== hard-coded target（1件のみ） =====
const TARGET_SLUG = "study-country-cz";
const TARGET_COUNTRY = "cz";
const TARGET_URL =
  "https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/long-term-visa/long-term-visa-for-the-purpose-of-studies/";

const APPLY = process.argv.includes("--apply");
if (APPLY && process.env.ALLOW_PRODUCTION_COUNTRY_SOURCE_INSERT !== "1") {
  console.error(
    "エラー: --apply には環境変数 ALLOW_PRODUCTION_COUNTRY_SOURCE_INSERT=1 が必要です（exact match '1' のみ許可）。"
  );
  console.error(
    "   例: ALLOW_PRODUCTION_COUNTRY_SOURCE_INSERT=1 npx tsx scripts/add-study-source-cz-long-term-visa.ts --apply"
  );
  process.exit(1);
}
const DRY_RUN = !APPLY;

// ===== mutation state model =====
type MutationState = "not_observed" | "confirmed" | "ambiguous";

type FailureStage =
  | null
  | "preflight"
  | "duplicate_guard"
  | "source_fetch"
  | "source_validation"
  | "article_precondition"
  | "insert"
  | "recovery_select"
  | "post_insert_reselect"
  | "payload_invariant"
  | "approved_integration"
  | "article_validator";

type Summary = {
  mode: "DRY_RUN" | "APPLY";
  requested: number;
  success: number;
  failed: number;
  not_attempted: number;
  insert_attempted: boolean;
  mutation_state: MutationState;
  db_updated: boolean;
  target_country: string;
  target_slug: string;
  target_url: string;
  exact_duplicate_count: number | null;
  normalized_duplicate_count: number | null;
  source_precondition_passed: boolean | null;
  article_precondition_passed: boolean | null;
  insert_response_received: boolean | null;
  insert_returned_row_count: number | null;
  insert_identity_match: boolean | null;
  recovery_select_attempted: boolean;
  recovery_select_succeeded: boolean | null;
  recovery_row_count: number | null;
  recovery_row_present: boolean | null;
  recovery_payload_match: boolean | null;
  post_row_verification: boolean | null;
  approved_integration: boolean | null;
  country_sources_count_before: number | null;
  country_sources_count_after: number | null;
  country_sources_count_delta: number | null;
  country_sources_count_warning: boolean;
  article_validator_after: string | null;
  failure_stage: FailureStage;
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
    insert_attempted: false,
    mutation_state: "not_observed",
    db_updated: false,
    target_country: TARGET_COUNTRY,
    target_slug: TARGET_SLUG,
    target_url: TARGET_URL,
    exact_duplicate_count: null,
    normalized_duplicate_count: null,
    source_precondition_passed: null,
    article_precondition_passed: null,
    insert_response_received: null,
    insert_returned_row_count: null,
    insert_identity_match: null,
    recovery_select_attempted: false,
    recovery_select_succeeded: null,
    recovery_row_count: null,
    recovery_row_present: null,
    recovery_payload_match: null,
    post_row_verification: null,
    approved_integration: null,
    country_sources_count_before: null,
    country_sources_count_after: null,
    country_sources_count_delta: null,
    country_sources_count_warning: false,
    article_validator_after: null,
    failure_stage: null,
    failure_reason: null,
    exit: 0,
  };
}

function fail(s: Summary, stage: FailureStage, reason: string): Summary {
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

// id/created_at はDB生成値のため比較対象外
const PAYLOAD_FIELDS = [
  "country_code",
  "purpose",
  "url",
  "last_verified_at",
  "status",
  "source",
  "page_title_original",
  "page_title_ja",
  "page_title_en",
  "page_title_zh",
  "page_lang",
  "content_hash",
  "content_hash_at",
] as const;

function payloadsMatch(planned: Record<string, unknown>, actual: Record<string, unknown>): boolean {
  for (const f of PAYLOAD_FIELDS) {
    let a = planned[f];
    let b = actual[f];
    if (f === "last_verified_at") {
      // timestamp DB serialization差を吸収するISO正規化比較
      a = a ? new Date(a as string).toISOString() : a;
      b = b ? new Date(b as string).toISOString() : b;
    }
    if (a !== b) return false;
  }
  return true;
}

// ===== source fetch precondition（Node native fetch、explicit timeout、redirect: manual） =====
async function fetchSourcePrecondition(
  url: string
): Promise<{ ok: true; html: string } | { ok: false; reason: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "manual",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "text/html,*/*;q=0.8",
      },
    });
    clearTimeout(timer);
    if (res.status !== 200) {
      return { ok: false, reason: `HTTP ${res.status}（期待200。redirect: "manual"のため3xxもfailure扱い）` };
    }
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("html")) {
      return { ok: false, reason: `想定外のcontent-type: ${ct}` };
    }
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
    .replace(/ /g, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

// ===== source page identity / material marker guard =====
function validateSourceIdentity(html: string): { ok: true } | { ok: false; reason: string } {
  const norm = normalizeForMarkerCheck(html);

  if (!norm.includes("long-term visa for the purpose of studies")) {
    return { ok: false, reason: "必須identity marker欠落: 'Long-term Visa for the Purpose of Studies'" };
  }
  if (!norm.includes("third-country") && !norm.includes("third country")) {
    return { ok: false, reason: "必須identity marker欠落: third-country nationals文脈" };
  }
  if (!norm.includes("stud")) {
    return { ok: false, reason: "必須identity marker欠落: study/studies文脈" };
  }
  if (!norm.includes("long-term visa")) {
    return { ok: false, reason: "必須identity marker欠落: long-term visa文脈" };
  }

  const hasFee = norm.includes("2,500") || norm.includes("2500");
  const hasProcessing = norm.includes("60 days");
  if (!hasFee) {
    return { ok: false, reason: "material marker欠落: fee（2,500 CZK）" };
  }
  if (!hasProcessing) {
    return { ok: false, reason: "material marker欠落: processing time（60 days）" };
  }

  // study confirmation / enrolment（実source page確認済みの実際の表記: "confirmation of studies
  // or confirmation of enrolment"）
  const hasEnrolment =
    norm.includes("confirmation of studies") ||
    norm.includes("confirmation of enrolment") ||
    norm.includes("confirmation of enrollment") ||
    norm.includes("enrolment") ||
    norm.includes("enrollment");
  if (!hasEnrolment) {
    return { ok: false, reason: "material marker欠落: study confirmation / enrolment" };
  }

  // proof of funds（実source page確認済みの実際の表記: "proof of funds for the residence"）
  const hasFunds =
    norm.includes("proof of funds") || norm.includes("financial means") || norm.includes("funds");
  if (!hasFunds) {
    return { ok: false, reason: "material marker欠落: proof of funds / financial means" };
  }

  return { ok: true };
}

// ===== article claim drift guard（本文全体のfragileなexact matchはしない）=====
// production study-country-cz記事のEN本文（Student Visa Basics節）実表現を基準にguardを設計:
//   "Japanese students need a long-term student visa. Key requirements include proof of
//    acceptance at a recognized institution, financial means, and health insurance.
//    Visa processing can take up to 60 days and costs approximately CZK 2,500."
function checkArticleClaimDrift(content: Record<string, string>): { ok: true } | { ok: false; reason: string } {
  const en = (content.en ?? "").toLowerCase();

  // long-term + student/study visa identity（単なる"visa"だけでは不可）
  const hasLongTerm = en.includes("long-term");
  const hasVisaContext = en.includes("student visa") || en.includes("study visa");
  if (!hasLongTerm || !hasVisaContext) {
    return { ok: false, reason: "article claim drift: long-term student/study visa文脈が本文（en）に見つかりません" };
  }

  if (!en.includes("2,500")) {
    return { ok: false, reason: "article claim drift: CZK 2,500 fee claimが本文（en）に見つかりません" };
  }
  if (!en.includes("60 days")) {
    return { ok: false, reason: "article claim drift: 60日processing time claimが本文（en）に見つかりません" };
  }

  // admission/enrolment（実article表現は"proof of acceptance"）
  const hasAdmission =
    en.includes("admission") || en.includes("acceptance") || en.includes("enrolment") || en.includes("enrollment");
  if (!hasAdmission) {
    return { ok: false, reason: "article claim drift: admission/acceptance/enrolment claimが本文（en）に見つかりません" };
  }

  // funds（実article表現は"financial means"）
  const hasFunds = en.includes("financial means") || en.includes("proof of funds") || en.includes("funds");
  if (!hasFunds) {
    return { ok: false, reason: "article claim drift: financial means/funds claimが本文（en）に見つかりません" };
  }

  // insurance（実article表現は"health insurance"）
  if (!en.includes("insurance")) {
    return { ok: false, reason: "article claim drift: insurance claimが本文（en）に見つかりません" };
  }

  return { ok: true };
}

// ===== country_sources count（完全diagnostic-only。query throwもwarningへ変換する） =====
async function readCountrySourcesCountDiagnostic(): Promise<{ count: number | null; warning: boolean }> {
  try {
    const { count, error } = await supabase.from("country_sources").select("id", { count: "exact", head: true });
    if (error || typeof count !== "number") {
      return { count: null, warning: true };
    }
    return { count, warning: false };
  } catch {
    return { count: null, warning: true };
  }
}

// ===== single ambiguous recovery handler =====
// INSERT dispatch後にconfirmed条件を満たさない全ケースをここへ集約する。
async function handleAmbiguousInsertOutcome(
  s: Summary,
  plannedPayload: Record<string, unknown>
): Promise<Summary> {
  s.insert_attempted = true;
  s.mutation_state = "ambiguous";
  s.db_updated = true;
  s.recovery_select_attempted = true;

  try {
    const { data, error } = await supabase
      .from("country_sources")
      .select(
        "id, country_code, purpose, url, last_verified_at, status, source, created_at, page_title_original, page_title_ja, page_title_en, page_title_zh, page_lang, content_hash, content_hash_at"
      )
      .eq("country_code", TARGET_COUNTRY)
      .eq("url", TARGET_URL);

    // recovery SELECTを「正常成功」と扱えるのは error == null AND Array.isArray(data) === true の場合のみ。
    // data が null/undefined/非array（malformed representation）の場合、`data ?? []` で
    // 空配列へ黙って変換すると「0 rows（正常成功）」と誤認し、ambiguous→not_observedへ
    // 誤降格してしまう（Codex Medium finding 1）。そのためここでは自動変換を行わず、
    // 明示的にArray.isArrayを確認し、失敗した場合はrecovery SELECT failure経路へ送る。
    if (error) {
      s.recovery_select_succeeded = false;
      s.recovery_row_count = null;
      s.recovery_payload_match = null;
      return fail(s, "recovery_select", `recovery SELECT error: ${error.message}`);
    }
    if (!Array.isArray(data)) {
      s.recovery_select_succeeded = false;
      s.recovery_row_count = null;
      s.recovery_payload_match = null;
      return fail(s, "recovery_select", "Recovery SELECT returned malformed or non-array data.");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = data as any[];
    s.recovery_select_succeeded = true;
    s.recovery_row_count = rows.length;

    if (rows.length === 0) {
      // mutation_stateを降格できる唯一の経路
      s.mutation_state = "not_observed";
      s.db_updated = false;
      s.recovery_row_present = false;
      return fail(
        s,
        "insert",
        "INSERT was attempted, but no target mutation was observed by the post-error recovery SELECT."
      );
    }

    if (rows.length === 1) {
      s.recovery_row_present = true;
      s.recovery_payload_match = payloadsMatch(plannedPayload, rows[0] as Record<string, unknown>);
      return fail(
        s,
        "insert",
        "INSERT outcome ambiguous: exactly one matching row was observed by recovery SELECT, but concurrent-writer origin cannot be excluded; not treated as this run's confirmed success."
      );
    }

    // rows.length > 1
    s.recovery_row_present = true;
    return fail(
      s,
      "insert",
      `recovery SELECT invariant violation: ${rows.length} rows found for a UNIQUE(country_code,url) target.`
    );
  } catch (e) {
    // recovery SELECT自体の失敗（Medium finding 1）。追加SELECT・retryは行わない。
    s.recovery_select_succeeded = false;
    s.recovery_row_count = null;
    s.recovery_payload_match = null;
    const msg = e instanceof Error ? e.message : String(e);
    return fail(
      s,
      "recovery_select",
      `recovery SELECT自体が失敗しました（INSERT mutationの可能性を解決できません）: ${msg}`
    );
  }
}

async function main() {
  const s = freshSummary();
  console.log(`=== CZ registry source add (${s.mode}) ===`);
  console.log(`target: ${TARGET_SLUG} / ${TARGET_COUNTRY} / ${TARGET_URL}\n`);

  try {
    // ===== A. pre-dispatch section（insert_attempted は false のまま） =====

    // 1. fresh duplicate guard（exact / normalized、既存normalizeUrl()を再利用）
    // 有効と扱えるのは「query throwなし AND error == null AND Array.isArray(data)」のみ。
    // `data ?? []`等のempty-array fallbackはfail-open（誤って重複0件と判定しINSERTへ進む）
    // につながるため使用しない。error/throw/null/undefined/non-arrayはすべてduplicate_guard
    // failureとして明示的に扱い、INSERTには進まない。
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let existingRows: any;
    let dupErr: { message: string } | null;
    try {
      const res = await supabase.from("country_sources").select("url").eq("country_code", TARGET_COUNTRY);
      existingRows = res.data;
      dupErr = res.error;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return finish(fail(s, "duplicate_guard", `duplicate SELECT自体が失敗しました（query throw）: ${msg}`));
    }
    if (dupErr) return finish(fail(s, "duplicate_guard", `duplicate SELECT error: ${dupErr.message}`));
    if (!Array.isArray(existingRows)) {
      return finish(
        fail(s, "duplicate_guard", "duplicate SELECT returned malformed or non-array data (data null/undefined/non-array).")
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = existingRows as any[];
    const exactDup = rows.filter((r) => r.url === TARGET_URL).length;
    const targetNorm = normalizeUrl(TARGET_URL);
    const normDup = rows.filter((r) => normalizeUrl(r.url) === targetNorm).length;
    s.exact_duplicate_count = exactDup;
    s.normalized_duplicate_count = normDup;
    console.log(`  duplicate guard: exact=${exactDup}, normalized=${normDup}`);
    if (exactDup > 0 || normDup > 0) {
      return finish(
        fail(s, "duplicate_guard", `candidate URLは既にregistryに存在します（exact=${exactDup}, normalized=${normDup}）`)
      );
    }

    // 2. current count（完全diagnostic only。query throwを含め、失敗はwarningへ変換し
    //    処理を継続する。duplicate guard / source precondition / article precondition等の
    //    authoritative preconditionがPASSしていればcountの取得失敗はflowを止めない）
    const preCount = await readCountrySourcesCountDiagnostic();
    s.country_sources_count_before = preCount.count;
    if (preCount.warning) {
      s.country_sources_count_warning = true;
      console.log("  country_sources_count_before: 取得失敗またはmalformed（diagnostic warningのみ、処理は継続）");
    } else {
      console.log(`  country_sources_count_before: ${s.country_sources_count_before}`);
    }

    // 3. source HTTP precondition
    const fetchResult = await fetchSourcePrecondition(TARGET_URL);
    if (!fetchResult.ok) {
      s.source_precondition_passed = false;
      return finish(fail(s, "source_fetch", fetchResult.reason));
    }

    // 4. source identity / material marker validation
    const identityResult = validateSourceIdentity(fetchResult.html);
    if (!identityResult.ok) {
      s.source_precondition_passed = false;
      return finish(fail(s, "source_validation", identityResult.reason));
    }
    s.source_precondition_passed = true;
    console.log("  source precondition: PASS");
    const lastVerifiedAt = new Date().toISOString();

    // 5. fresh study-country-cz article SELECT + precondition
    const { data: articleRow, error: articleErr } = await supabase
      .from("study_blog_posts")
      .select("id, slug, title, description, content, is_published, scheduled_publish_at")
      .eq("slug", TARGET_SLUG)
      .maybeSingle();
    if (articleErr || !articleRow) {
      return finish(fail(s, "article_precondition", `article SELECT失敗: ${articleErr?.message ?? "not found"}`));
    }
    if (articleRow.is_published !== true) {
      return finish(fail(s, "article_precondition", `is_published != true (実際=${articleRow.is_published})`));
    }
    if (articleRow.scheduled_publish_at !== null) {
      return finish(fail(s, "article_precondition", `scheduled_publish_at != null`));
    }

    const approvedCz = await getApprovedSources(supabase, TARGET_COUNTRY);
    const before = validateStudyPublication({
      title: articleRow.title,
      description: articleRow.description,
      content: articleRow.content,
      approvedSources: approvedCz,
    });
    if (before.ok) {
      return finish(fail(s, "article_precondition", "BEFORE validatorがPASSしています（想定外のdrift、FAILを期待）"));
    }

    // candidate URLが既に本文参照済みでないことのguard（全言語のReference section）
    let candidateAlreadyCited = false;
    for (const lang of ["ja", "en", "zh"] as const) {
      const text = (articleRow.content as Record<string, string>)[lang] ?? "";
      const section = findRefSection(text, lang);
      if (!section) continue;
      const urls = extractUrls(section.raw);
      if (urls.some((u) => normalizeUrl(u) === targetNorm)) candidateAlreadyCited = true;
    }
    if (candidateAlreadyCited) {
      return finish(fail(s, "article_precondition", "candidate URLが既にarticle参考資料sectionに引用されています"));
    }

    // article claim drift guard
    const claimDrift = checkArticleClaimDrift(articleRow.content as Record<string, string>);
    if (!claimDrift.ok) {
      return finish(fail(s, "article_precondition", claimDrift.reason));
    }

    s.article_precondition_passed = true;
    console.log("  article precondition: PASS (BEFORE=FAIL, candidate occurrence=0, claim drift=none)");

    // 6. payload construction
    const plannedPayload = {
      country_code: TARGET_COUNTRY,
      purpose: "visa",
      url: TARGET_URL,
      status: "alive",
      source: "manual",
      last_verified_at: lastVerifiedAt,
      page_title_original: null,
      page_title_ja: null,
      page_title_en: null,
      page_title_zh: null,
      page_lang: null,
      content_hash: null,
      content_hash_at: null,
    };

    if (DRY_RUN) {
      s.success = 1;
      s.exit = 0;
      console.log("  [DRY RUN] 全preconditionがPASSしました。INSERTは発行しません（insert_attempted=falseのまま）。");
      return finish(s);
    }

    // ===== B. insert dispatch boundary =====
    s.insert_attempted = true;

    // ===== C. INSERT call =====
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let insertData: any[] | null = null;
    let insertError: { message: string } | null = null;
    try {
      const res = await supabase
        .from("country_sources")
        .insert(plannedPayload)
        .select(
          "id, country_code, purpose, url, last_verified_at, status, source, created_at, page_title_original, page_title_ja, page_title_en, page_title_zh, page_lang, content_hash, content_hash_at"
        );
      insertData = res.data;
      insertError = res.error;
    } catch (e) {
      // dispatch中の例外（network/client exception）→ ambiguous
      return finish(await handleAmbiguousInsertOutcome(s, plannedPayload));
    }

    s.insert_response_received = insertError == null;

    if (insertError) {
      return finish(await handleAmbiguousInsertOutcome(s, plannedPayload));
    }
    if (!Array.isArray(insertData)) {
      return finish(await handleAmbiguousInsertOutcome(s, plannedPayload));
    }

    s.insert_returned_row_count = insertData.length;
    if (insertData.length !== 1) {
      return finish(await handleAmbiguousInsertOutcome(s, plannedPayload));
    }

    const returnedRow = insertData[0];
    const identityOk =
      !!returnedRow?.id && returnedRow.country_code === TARGET_COUNTRY && returnedRow.url === TARGET_URL;
    s.insert_identity_match = identityOk;
    if (!identityOk) {
      return finish(await handleAmbiguousInsertOutcome(s, plannedPayload));
    }

    // ===== D. confirmed（唯一のconfirmed成立path） =====
    s.mutation_state = "confirmed";
    s.db_updated = true;
    console.log(`  CAS的confirmed成功 (id=${returnedRow.id})`);

    // post-insert reSELECT (by id)
    const { data: reRow, error: reErr } = await supabase
      .from("country_sources")
      .select(
        "id, country_code, purpose, url, last_verified_at, status, source, created_at, page_title_original, page_title_ja, page_title_en, page_title_zh, page_lang, content_hash, content_hash_at"
      )
      .eq("id", returnedRow.id)
      .maybeSingle();
    if (reErr || !reRow) {
      return finish(fail(s, "post_insert_reselect", `post-insert reSELECT失敗: ${reErr?.message ?? "no row"}`));
    }
    s.post_row_verification = true;

    // payload invariant
    if (!payloadsMatch(plannedPayload, reRow as Record<string, unknown>)) {
      return finish(fail(s, "payload_invariant", "post-insert rowがplanned payloadと一致しません"));
    }

    // target exact-one verification (country + URL)
    const { data: targetRows, error: targetErr } = await supabase
      .from("country_sources")
      .select("id")
      .eq("country_code", TARGET_COUNTRY)
      .eq("url", TARGET_URL);
    if (targetErr) {
      return finish(fail(s, "payload_invariant", `target row verification error: ${targetErr.message}`));
    }
    if (!targetRows || targetRows.length !== 1 || targetRows[0].id !== returnedRow.id) {
      return finish(
        fail(s, "payload_invariant", `target exact-one verification失敗 (count=${targetRows?.length ?? 0})`)
      );
    }

    // getApprovedSources integration
    const approvedAfter = await getApprovedSources(supabase, TARGET_COUNTRY);
    const matchCount = approvedAfter.filter((a) => a.normalized === targetNorm).length;
    s.approved_integration = matchCount === 1;
    if (matchCount !== 1) {
      return finish(fail(s, "approved_integration", `getApprovedSources("cz")一致件数=${matchCount}（期待1）`));
    }

    // post-registry article validator（diagnostic、PASS維持がexpected=FAILのまま）。
    // SELECTのerror/null/複数行/malformed representationを確認せずにvalidatorをskipして
    // successへ進むことを禁止する（Codex Medium finding 5）。confirmed成立後のこの段階での
    // 異常はいずれもconfirmed post-write failure（mutation_state="confirmed"を維持したまま
    // success=0で停止）として扱う。
    const { data: postArticleRows, error: postArticleErr } = await supabase
      .from("study_blog_posts")
      .select("slug, title, description, content")
      .eq("slug", TARGET_SLUG);
    if (postArticleErr) {
      return finish(
        fail(s, "article_validator", `post-registry article SELECT error: ${postArticleErr.message}`)
      );
    }
    if (!Array.isArray(postArticleRows)) {
      return finish(fail(s, "article_validator", "post-registry article SELECT returned malformed (non-array) data."));
    }
    if (postArticleRows.length !== 1) {
      return finish(
        fail(
          s,
          "article_validator",
          `post-registry article SELECT returned ${postArticleRows.length} rows (expected exactly 1 for slug=${TARGET_SLUG}).`
        )
      );
    }
    const postArticle = postArticleRows[0];
    if (!postArticle.content) {
      return finish(fail(s, "article_validator", "post-registry article row is missing required content field."));
    }

    const after = validateStudyPublication({
      title: postArticle.title,
      description: postArticle.description,
      content: postArticle.content,
      approvedSources: approvedAfter,
    });
    s.article_validator_after = after.ok ? "PASS" : "FAIL";
    if (after.ok) {
      return finish(
        fail(s, "article_validator", "unexpected: registry追加のみでarticle validatorがPASSしました（本文は未変更のはず）")
      );
    }

    // global count（完全diagnostic only、hard gateではない。query throwを含め、取得失敗も
    // success判定を変えない）
    const postCount = await readCountrySourcesCountDiagnostic();
    s.country_sources_count_after = postCount.count;
    if (postCount.warning) {
      s.country_sources_count_warning = true;
      s.country_sources_count_delta = null;
    } else if (s.country_sources_count_before != null) {
      s.country_sources_count_delta = s.country_sources_count_after! - s.country_sources_count_before;
      if (s.country_sources_count_delta !== 1) s.country_sources_count_warning = true;
    } else {
      s.country_sources_count_delta = null;
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

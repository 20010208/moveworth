/**
 * BL-20260809-02（Published Study validator debt）Batch 2 の安全なcontent target patch。
 *
 * 対象は Codex独立監査でQ1/HIGHかつproduction patch候補として承認された3件のみ:
 *   - study-work-ae
 *   - study-work-de
 *   - study-country-za
 * （Codex監査でMedium×9指摘された残り9件・study-work-rs・study-country-es・その他Q2・
 *   S6・X1は今回のscriptには一切含めない）
 *
 * 安全設計は scripts/patch-study-validator-debt-batch1.ts と同一（Batch1本体は変更しない。
 * 本ファイルは独立した新規ファイルとして同じproduction safety architectureを再実装する）:
 *   - 宣言的PATCH_PLANに操作を列挙（コード内でad-hocに文字列置換しない）
 *   - occurrence guardは物理URL token数（Setによる重複排除後の件数では判定しない）
 *   - 判定は対象languageの参考資料section内のみ
 *   - newUrl側はnormalizeUrlでnormalized-equivalentな重複も検出する
 *   - DRY_RUNがデフォルト。実際のDB UPDATEには `--apply` に加え、
 *     環境変数 `ALLOW_PRODUCTION_STUDY_PATCH` が厳密に文字列 "1" と一致することが必要
 *     （"true"/"yes"/"01" 等は拒否。exact match `!== "1"` で判定するため自然に満たされる）
 *   - 本番反映は `study_blog_posts_cas_update_content()` RPC（compare-and-swap）経由のみ。
 *     .update()/.insert()/.upsert()/.delete() によるfallbackは行わない
 *   - CAS成功後はDB再SELECTし、content の deep-equal・validator PASS・非content列の
 *     不変・言語別planned URL状態をすべて再確認する
 *
 * failure semantics（DRY_RUNとAPPLYで意図的に異なる。Batch1と同一方針）:
 *   - DRY_RUN: 3件全体の診断が目的のため、1件の異常があっても残りをcontinueして
 *     診断を続ける（read-onlyで実害がないため）。異常が1件でもあればprocess全体はexit 1
 *   - APPLY: 公開済み本番記事へのCASを伴うため、いずれかの記事で異常が発生した
 *     時点で即座に処理を停止する（fail-fast）。それ以降のslugは一切処理しない
 *     （not_attempted）。成功済みのCASはrollbackしない。CAS 0行は再試行しない
 *   - どちらのモードでも、1記事の処理中に想定外の例外が発生した場合はtry/catchで
 *     捕捉し、その記事の失敗として扱う（プロセス全体を無警告で落とさない）
 *
 * 使い方:
 *   npx tsx scripts/patch-study-validator-debt-batch2.ts            (DRY_RUN)
 *   npx tsx scripts/patch-study-validator-debt-batch2.ts --apply    (要 ALLOW_PRODUCTION_STUDY_PATCH=1)
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
  console.error("❌ --apply には環境変数 ALLOW_PRODUCTION_STUDY_PATCH=1 が必要です（二重guard、exact match '1' のみ許可）。");
  console.error("   例: ALLOW_PRODUCTION_STUDY_PATCH=1 npx tsx scripts/patch-study-validator-debt-batch2.ts --apply");
  process.exit(1);
}

const DRY_RUN = !APPLY;

// ===== 物理URL token抽出（Batch1と同一実装。Setによる重複排除をしない） =====
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
      rawStart = m.index + fullMatch.length - 1 - raw.length;
    } else if (m[2] !== undefined) {
      raw = m[2];
      rawStart = m.index + fullMatch.length - 1 - raw.length;
    } else {
      raw = m[3]!;
      rawStart = m.index;
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

// ===== 宣言的patch plan（Codex監査で承認された3件のみ） =====
type Op = { type: "replace-url"; lang: Lang; oldUrl: string; newUrl: string };
type ArticlePlan = { slug: string; countryCode: string; ops: Op[] };

const BATCH_2: ArticlePlan[] = [
  {
    slug: "study-work-ae",
    countryCode: "ae",
    ops: (["ja", "en", "zh"] as Lang[]).map((lang) => ({
      type: "replace-url" as const,
      lang,
      oldUrl: "https://u.ae/en",
      newUrl: "https://u.ae/en/information-and-services/visa-and-emirates-id",
    })),
  },
  {
    slug: "study-work-de",
    countryCode: "de",
    ops: (["ja", "en", "zh"] as Lang[]).map((lang) => ({
      type: "replace-url" as const,
      lang,
      oldUrl: "https://www.auswaertiges-amt.de/en",
      newUrl: "https://www.auswaertiges-amt.de/en/visa-service",
    })),
  },
  {
    slug: "study-country-za",
    countryCode: "za",
    ops: [
      { type: "replace-url", lang: "ja", oldUrl: "https://www.dha.gov.za/", newUrl: "https://www.dha.gov.za/index.php/immigration-services/types-of-visas" },
      { type: "replace-url", lang: "en", oldUrl: "http://www.dha.gov.za", newUrl: "https://www.dha.gov.za/index.php/immigration-services/types-of-visas" },
      { type: "replace-url", lang: "zh", oldUrl: "https://www.dha.gov.za/", newUrl: "https://www.dha.gov.za/index.php/immigration-services/types-of-visas" },
    ],
  },
];

// ===== occurrence-guard付きoperation適用（Batch1と同一実装） =====
type ApplyResult = { ok: true; newSectionText: string } | { ok: false; reason: string };

function applyOp(sectionText: string, op: Op): ApplyResult {
  const tokens = extractUrlTokensPhysical(sectionText);
  const matches = tokens.filter((t) => t.url === op.oldUrl);
  if (matches.length === 0) return { ok: false, reason: `oldUrl "${op.oldUrl}" が参考資料section内に見つかりません（物理count=0）` };
  if (matches.length > 1) return { ok: false, reason: `oldUrl "${op.oldUrl}" が参考資料section内に物理的に${matches.length}件あり曖昧です（想定は1件）` };
  const newDup = countNormalizedEquivalent(tokens, op.newUrl);
  if (newDup > 0) return { ok: false, reason: `newUrl "${op.newUrl}" と正規化後に一致するURLが既にsection内に${newDup}件存在します（duplicate risk）` };
  const { start, end } = matches[0];
  const newSectionText = sectionText.slice(0, start) + op.newUrl + sectionText.slice(end);
  return { ok: true, newSectionText };
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
      const oldCount = countExact(tokens, op.oldUrl);
      if (oldCount !== 0) return { ok: false, reason: `[${lang}] oldUrl "${op.oldUrl}" がpatch後も${oldCount}件残存（disappearance未確認）` };
      const newCount = countExact(tokens, op.newUrl);
      if (newCount !== 1) return { ok: false, reason: `[${lang}] newUrl "${op.newUrl}" の物理countが${newCount}件（期待は1件）` };
    }
  }
  return { ok: true };
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

function deepEqualJson(a: unknown, b: unknown): boolean {
  return isDeepStrictEqual(a, b);
}

type ArticleOutcome = { ok: true; dbUpdated: boolean } | { ok: false; reason: string; dbUpdated: boolean };

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
      dbUpdated = true;
      return { ok: false, reason: `CAS >1 rows (${updatedRows.length}件): スキーマ不変条件違反`, dbUpdated };
    }
    if (updatedRows[0].id !== row.id) {
      dbUpdated = true;
      return { ok: false, reason: `returned id mismatch: expected=${row.id} actual=${updatedRows[0].id}`, dbUpdated };
    }

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
    return { ok: false, reason: `unexpected exception: ${e instanceof Error ? e.message : String(e)}`, dbUpdated };
  }
}

// ===== main =====
async function main() {
  console.log(`=== BL-20260809-02 Batch 2 patch (${DRY_RUN ? "DRY_RUN" : "APPLY"}) ===\n`);
  const plans = BATCH_2;
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
    }
  }

  console.log(`\n=== Batch 2 結果 (${DRY_RUN ? "DRY_RUN" : "APPLY"}) ===`);
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

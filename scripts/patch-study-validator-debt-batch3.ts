/**
 * BL-20260809-02（Published Study validator debt）Batch 3 の安全なcontent target patch。
 *
 * Batch1/Batch2はURL tokenのみの置換だったが、Batch3はCodex独立監査で承認された
 * exact reference full-line replacement（label + URLを1行単位で同時更新）を用いる。
 * 対象は以下5件のみ（すべてcountry記事、work記事は0件）:
 *   - study-country-ie
 *   - study-country-it
 *   - study-country-pt
 *   - study-country-pl
 *   - study-country-mt
 * （Claude初期案にあった study-country-ae / study-work-ie / study-work-hu /
 *   study-work-gb / study-work-bg / study-work-cn はCodex監査でstrict claim-level fit /
 *   jurisdiction基準を満たさないと判定され除外された。本ファイルには一切含めない）
 *
 * 安全設計（Batch1/Batch2と同じproduction safety architectureを、full-line replacement向けに再実装）:
 *   - 宣言的PATCH_PLANに操作を列挙（コード内でad-hocに文字列置換しない）
 *   - old exact reference line の物理occurrence guard（Reference section内のみ、trailing
 *     spaces・全角spaceを含む実physical lineでexact一致判定。trimして判定しない）
 *   - new URLのnormalized occurrence（重複）guardをReference section内で確認
 *   - 置換はReference section内のexact start/end行位置に対してのみ行う（本文中の同じ
 *     文字列は対象外、意図しないglobal replaceを禁止）
 *   - DRY_RUNがデフォルト。実際のDB UPDATEには `--apply` に加え、環境変数
 *     `ALLOW_PRODUCTION_STUDY_PATCH` が厳密に文字列 "1" と一致することが必要
 *     （"true"/"TRUE"/"yes"/"01"/"on"等は拒否。exact match `!== "1"` で判定するため自然に満たされる）
 *   - 本番反映は `study_blog_posts_cas_update_content()` RPC（compare-and-swap）経由のみ。
 *     .update()/.insert()/.upsert()/.delete() によるfallbackは行わない。country_sources writeもしない
 *   - CAS成功後はDB再SELECTし、content の deep-equal・validator PASS・非content列の
 *     不変・言語別planned line状態（old line消失／new line exactly 1／new URL normalized
 *     exactly 1）をすべて再確認する
 *   - 対象言語についてもReference section以外（prefix/suffix）が完全不変であることを
 *     文字列比較で保証する（exact line replacement以外の変化を許さない）
 *
 * target set はhard-coded exact 5件のみ。production FAIL全件を自動取得してpatch対象化する
 * ような動的discovery は行わない。
 *
 * failure semantics（DRY_RUNとAPPLYで意図的に異なる。Batch1/Batch2と同一方針）:
 *   - DRY_RUN: 5件全体の診断が目的のため、1件の異常があっても残りをcontinueして
 *     診断を続ける（read-onlyで実害がないため）。異常が1件でもあればprocess全体はexit 1
 *   - APPLY: 公開済み本番記事へのCASを伴うため、いずれかの記事で異常が発生した
 *     時点で即座に処理を停止する（fail-fast）。それ以降のslugは一切処理しない
 *     （not_attempted）。成功済みのCASはrollbackしない。CAS 0行は再試行しない
 *   - どちらのモードでも、1記事の処理中に想定外の例外が発生した場合はtry/catchで
 *     捕捉し、その記事の失敗として扱う（プロセス全体を無警告で落とさない）
 *
 * 使い方:
 *   npx tsx scripts/patch-study-validator-debt-batch3.ts            (DRY_RUN)
 *   npx tsx scripts/patch-study-validator-debt-batch3.ts --apply    (要 ALLOW_PRODUCTION_STUDY_PATCH=1)
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
  console.error("エラー: --apply には環境変数 ALLOW_PRODUCTION_STUDY_PATCH=1 が必要です（二重guard、exact match '1' のみ許可）。");
  console.error("   例: ALLOW_PRODUCTION_STUDY_PATCH=1 npx tsx scripts/patch-study-validator-debt-batch3.ts --apply");
  process.exit(1);
}

const DRY_RUN = !APPLY;

// ===== 宣言的full-line patch plan（Codex最終承認案。5件・country記事のみ・計13 operations） =====
type LineOp = { lang: Lang; oldLine: string; newLine: string; newUrl: string };
type ArticlePlan = { slug: string; countryCode: string; ops: LineOp[] };

const BATCH_3: ArticlePlan[] = [
  {
    slug: "study-country-ie",
    countryCode: "ie",
    ops: [
      {
        lang: "en",
        oldLine: "- [Irish Naturalisation and Immigration Service](https://www.inis.gov.ie)",
        newLine: "- [Immigration Service Delivery (Ireland)](https://www.irishimmigration.ie/)",
        newUrl: "https://www.irishimmigration.ie/",
      },
    ],
  },
  {
    slug: "study-country-it",
    countryCode: "it",
    ops: [
      {
        lang: "ja",
        oldLine: "- [イタリア大使館](https://ambtokyo.esteri.it/ambasciata_tokyo/ja/)",
        newLine: "- [イタリアビザ申請ポータル（Visto per l'Italia）](https://vistoperitalia.esteri.it/)",
        newUrl: "https://vistoperitalia.esteri.it/",
      },
      {
        lang: "en",
        oldLine: "- [Italian Embassy in Japan](https://ambtokyo.esteri.it/ambasciata_tokyo/en/)",
        newLine: "- [Italy Visa Portal (Visto per l'Italia)](https://vistoperitalia.esteri.it/)",
        newUrl: "https://vistoperitalia.esteri.it/",
      },
      {
        lang: "zh",
        oldLine: "- [意大利大使馆](https://ambtokyo.esteri.it/ambasciata_tokyo/ja/)",
        newLine: "- [意大利签证门户网站（Visto per l'Italia）](https://vistoperitalia.esteri.it/)",
        newUrl: "https://vistoperitalia.esteri.it/",
      },
    ],
  },
  {
    slug: "study-country-pt",
    countryCode: "pt",
    ops: [
      {
        lang: "ja",
        oldLine: "- [ポルトガル入国管理局](https://www.sef.pt)",
        newLine: "- [ポルトガル外務省ビザポータル](https://vistos.mne.gov.pt/)",
        newUrl: "https://vistos.mne.gov.pt/",
      },
      {
        lang: "en",
        oldLine: "- [Portuguese Immigration and Borders Service](https://www.sef.pt)",
        newLine: "- [Portugal Ministry of Foreign Affairs Visa Portal](https://vistos.mne.gov.pt/)",
        newUrl: "https://vistos.mne.gov.pt/",
      },
      {
        lang: "zh",
        oldLine: "- [葡萄牙入境管理局](https://www.sef.pt)",
        newLine: "- [葡萄牙外交部签证门户](https://vistos.mne.gov.pt/)",
        newUrl: "https://vistos.mne.gov.pt/",
      },
    ],
  },
  {
    slug: "study-country-pl",
    countryCode: "pl",
    ops: [
      {
        lang: "ja",
        oldLine: "- [ポーランド入国管理局](https://udsc.gov.pl)",
        newLine: "- [ポーランド外国人局（UDSC）](https://www.gov.pl/web/udsc-en)",
        newUrl: "https://www.gov.pl/web/udsc-en",
      },
      {
        lang: "en",
        oldLine: "- [Polish Tourism Organization](https://www.poland.travel/en)",
        newLine: "- [Office for Foreigners, Poland (UDSC)](https://www.gov.pl/web/udsc-en)",
        newUrl: "https://www.gov.pl/web/udsc-en",
      },
      {
        lang: "zh",
        oldLine: "- [波兰入境管理局](https://udsc.gov.pl)",
        newLine: "- [波兰外国人事务局（UDSC）](https://www.gov.pl/web/udsc-en)",
        newUrl: "https://www.gov.pl/web/udsc-en",
      },
    ],
  },
  {
    slug: "study-country-mt",
    countryCode: "mt",
    ops: [
      {
        lang: "ja",
        oldLine: "- [マルタ入国管理局](https://identitymalta.com)",
        newLine: "- [Identità](https://identita.gov.mt/)",
        newUrl: "https://identita.gov.mt/",
      },
      {
        lang: "en",
        oldLine: "- [Identity Malta Agency](https://identitymalta.com)",
        newLine: "- [Identità](https://identita.gov.mt/)",
        newUrl: "https://identita.gov.mt/",
      },
      {
        lang: "zh",
        oldLine: "- [马耳他入境管理局](https://identitymalta.com)",
        newLine: "- [Identità](https://identita.gov.mt/)",
        newUrl: "https://identita.gov.mt/",
      },
    ],
  },
];

// ===== full-line occurrence guard・置換（Reference section内のみ、trimしない実physical line一致） =====
type ApplyResult = { ok: true; newText: string } | { ok: false; reason: string };

function extractSectionLines(content: string, lang: Lang): { lines: string[]; startLine: number; endLine: number } | null {
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

function applyLineOp(content: string, op: LineOp): ApplyResult {
  const sec = extractSectionLines(content, op.lang);
  if (!sec) return { ok: false, reason: `[${op.lang}] 参考資料sectionが見つかりません` };

  // exact physical line一致（trimしない。trailing spaces・全角spaceを含む実physical line比較）
  const matches = sec.lines.filter((l) => l === op.oldLine);
  if (matches.length === 0) return { ok: false, reason: `[${op.lang}] oldLineが参考資料section内に見つかりません（物理count=0）: "${op.oldLine}"` };
  if (matches.length > 1) return { ok: false, reason: `[${op.lang}] oldLineが参考資料section内に物理的に${matches.length}件あり曖昧です（想定は1件）: "${op.oldLine}"` };

  const dupBefore = countUrlNormalizedInLines(sec.lines, op.newUrl);
  if (dupBefore !== 0) return { ok: false, reason: `[${op.lang}] newUrl "${op.newUrl}" と正規化後に一致するURLが既にsection内に${dupBefore}件存在します（duplicate risk）` };

  const allLines = content.split("\n");
  const idx = allLines.findIndex((l, i) => i >= sec.startLine && i < sec.endLine && l === op.oldLine);
  const newAllLines = [...allLines];
  newAllLines[idx] = op.newLine;
  return { ok: true, newText: newAllLines.join("\n") };
}

function applyOpsToContent(content: Record<string, string>, ops: LineOp[]): { ok: true; content: Record<string, string> } | { ok: false; reason: string } {
  const byLang = new Map<Lang, LineOp[]>();
  for (const op of ops) {
    if (!byLang.has(op.lang)) byLang.set(op.lang, []);
    byLang.get(op.lang)!.push(op);
  }
  const newContent = { ...content };
  for (const [lang, langOps] of byLang) {
    let text = content[lang] ?? "";
    // 対象言語のReference section外（prefix/suffix）が完全不変であることを保証するため、
    // section開始行・終了行の前後を先に固定しておき、置換後に再結合して比較できるようにする
    for (const op of langOps) {
      const r = applyLineOp(text, op);
      if (!r.ok) return { ok: false, reason: `${lang}: ${r.reason}` };
      text = r.newText;
    }
    newContent[lang] = text;
  }
  return { ok: true, content: newContent };
}

// Reference section「以外」の部分（prefix + suffix）が完全不変であることを検証する
function referenceSectionOutsideUnchanged(before: string, after: string, lang: Lang): boolean {
  const secBefore = findRefSection(before, lang);
  const secAfter = findRefSection(after, lang);
  if (!secBefore || !secAfter) return false;
  if (secBefore.startLine !== secAfter.startLine) return false;
  const beforeLines = before.split("\n");
  const afterLines = after.split("\n");
  const prefixBefore = beforeLines.slice(0, secBefore.startLine).join("\n");
  const prefixAfter = afterLines.slice(0, secAfter.startLine).join("\n");
  if (prefixBefore !== prefixAfter) return false;
  const suffixBefore = beforeLines.slice(secBefore.endLine).join("\n");
  // endLineはsection内の行数変化がない限り同じ（full-line replacementは行数を変えないため）
  const suffixAfter = afterLines.slice(secAfter.endLine).join("\n");
  return suffixBefore === suffixAfter;
}

function deepEqualUnaffectedLangs(before: Record<string, string>, after: Record<string, string>, affectedLangs: Set<Lang>): boolean {
  for (const lang of ["ja", "en", "zh"] as Lang[]) {
    if (affectedLangs.has(lang)) continue;
    if (before[lang] !== after[lang]) return false;
  }
  return true;
}

// ===== 計画状態の検証（適用前simulationと、適用後DB再SELECTの両方で同一関数を使う） =====
function verifyPlannedState(content: Record<string, string>, ops: LineOp[]): { ok: true } | { ok: false; reason: string } {
  const byLang = new Map<Lang, LineOp[]>();
  for (const op of ops) {
    if (!byLang.has(op.lang)) byLang.set(op.lang, []);
    byLang.get(op.lang)!.push(op);
  }
  for (const [lang, langOps] of byLang) {
    const text = content[lang] ?? "";
    const sec = extractSectionLines(text, lang);
    if (!sec) return { ok: false, reason: `[${lang}] 参考資料sectionが見つかりません（post-state検証）` };
    for (const op of langOps) {
      const oldCount = sec.lines.filter((l) => l === op.oldLine).length;
      if (oldCount !== 0) return { ok: false, reason: `[${lang}] oldLineがpatch後も${oldCount}件残存: "${op.oldLine}"` };
      const newCount = sec.lines.filter((l) => l === op.newLine).length;
      if (newCount !== 1) return { ok: false, reason: `[${lang}] newLineの物理countが${newCount}件（期待は1件）: "${op.newLine}"` };
      const newUrlCount = countUrlNormalizedInLines(sec.lines, op.newUrl);
      if (newUrlCount !== 1) return { ok: false, reason: `[${lang}] newUrl "${op.newUrl}" のnormalized countが${newUrlCount}件（期待は1件）` };
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

    // approved source precondition: 各new URLがcurrent approved listに存在すること
    for (const op of plan.ops) {
      const found = approved.some((s) => s.url === op.newUrl);
      if (!found) return { ok: false, reason: `approved source drift: newUrl "${op.newUrl}" がcurrent approved listに存在しません（registry追加fallbackはしない）`, dbUpdated };
    }

    const before = validateStudyPublication({ title: row.title, description: row.description, content: row.content, approvedSources: approved });
    console.log(`  BEFORE: ${before.ok ? "PASS" : "FAIL"} ${before.ok ? "" : JSON.stringify(before.reasons)}`);
    if (before.ok) return { ok: false, reason: "BEFORE validator状態が想定と違う（既にPASSしている＝想定外の事前変化）", dbUpdated };

    const applied = applyOpsToContent(row.content, plan.ops);
    if (!applied.ok) return { ok: false, reason: `full-line occurrence guard違反 — ${applied.reason}`, dbUpdated };

    const affectedLangs = new Set(plan.ops.map((o) => o.lang));
    if (!deepEqualUnaffectedLangs(row.content, applied.content, affectedLangs)) {
      return { ok: false, reason: "対象外言語のcontentが変化しています（internal invariant violation）", dbUpdated };
    }
    for (const lang of affectedLangs) {
      if (!referenceSectionOutsideUnchanged(row.content[lang], applied.content[lang], lang)) {
        return { ok: false, reason: `[${lang}] Reference section外（prefix/suffix）が変化しています（internal invariant violation）`, dbUpdated };
      }
    }

    const after = validateStudyPublication({ title: row.title, description: row.description, content: applied.content, approvedSources: approved });
    console.log(`  AFTER (in-memory simulation): ${after.ok ? "PASS" : "still FAIL: " + JSON.stringify(after.reasons)}`);
    if (!after.ok) return { ok: false, reason: "AFTER validator != PASS（patch後もFAILのまま）", dbUpdated };

    const plannedPre = verifyPlannedState(applied.content, plan.ops);
    if (!plannedPre.ok) return { ok: false, reason: `planned full-line事前確認失敗 — ${plannedPre.reason}`, dbUpdated };

    for (const lang of affectedLangs) console.log(`  [${lang}] full-line置換あり（Reference section内のみ、他部分は不変）`);

    if (!isApply) {
      console.log("  [DRY RUN] ここでCAS RPCは呼びません（DB write 0）");
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
      dbUpdated = true; // 複数行が物理的に書き換わっている可能性があるため、conservativeにtrue扱いする
      return { ok: false, reason: `CAS >1 rows (${updatedRows.length}件): スキーマ不変条件違反`, dbUpdated };
    }
    if (updatedRows[0].id !== row.id) {
      dbUpdated = true;
      return { ok: false, reason: `returned id mismatch: expected=${row.id} actual=${updatedRows[0].id}`, dbUpdated };
    }

    dbUpdated = true;
    console.log(`  CAS成功 (id=${updatedRows[0].id})`);

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
    if (!plannedPost.ok) return { ok: false, reason: `planned full-line事後確認失敗 — ${plannedPost.reason}`, dbUpdated };

    for (const lang of affectedLangs) {
      if (!referenceSectionOutsideUnchanged(row.content[lang], postRow.content[lang], lang)) {
        return { ok: false, reason: `[${lang}] post-update Reference section外が変化しています`, dbUpdated };
      }
    }

    console.log("  post-update検証PASS（content deep-equal・validator PASS・非content列不変・planned full-line状態を確認）");
    return { ok: true, dbUpdated };
  } catch (e) {
    return { ok: false, reason: `unexpected exception: ${e instanceof Error ? e.message : String(e)}`, dbUpdated };
  }
}

// ===== main =====
async function main() {
  console.log(`=== BL-20260809-02 Batch 3 patch (${DRY_RUN ? "DRY_RUN" : "APPLY"}) ===\n`);
  const plans = BATCH_3;
  const slugs = plans.map((p) => p.slug);

  const { data: rows, error } = await supabase
    .from("study_blog_posts")
    .select("id, slug, title, description, content, is_published, scheduled_publish_at, category, date, reading_time, created_at, thumbnail, thumbnail_ja, thumbnail_en, thumbnail_zh")
    .in("slug", slugs);
  if (error) {
    console.error("SELECT失敗:", error.message);
    process.exitCode = 1;
    return;
  }

  let success = 0, failed = 0, notAttempted = 0, dbUpdated = 0;
  let stopped = false;
  let anyFailure = false;

  for (const plan of plans) {
    console.log(`\n--- ${plan.slug} ---`);

    if (APPLY && stopped) {
      console.log("  not_attempted（先行する記事でSTOPしたため未処理）");
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
      console.log(`  FAILURE: ${outcome.reason}`);
      if (APPLY) {
        stopped = true;
        console.log("  APPLY: fail-fast — 以降のslugは処理せずSTOPします（成功済み記事のrollbackはしません）");
      }
    }
  }

  console.log(`\n=== Batch 3 結果 (${DRY_RUN ? "DRY_RUN" : "APPLY"}) ===`);
  console.log(`  requested: ${plans.length}`);
  console.log(`  success: ${success}`);
  console.log(`  failed: ${failed}`);
  console.log(`  not_attempted: ${notAttempted}`);
  console.log(`  db_updated: ${dbUpdated}`);

  process.exitCode = anyFailure ? 1 : 0;
}

main().catch((e) => {
  console.error("FATAL:", e instanceof Error ? e.message : e);
  process.exitCode = 1;
});

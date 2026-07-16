/**
 * 最終整合性チェック（5項目）
 * 1. 重複スラグ（同一カテゴリ×同一国コードの2件以上）
 * 2. マスターリスト外の国コード残存
 * 3. 言語欠落（visa: ja/en/zh、study: ja/en）
 * 4. 参考資料URL重複（末尾スラッシュ差異等）
 * 5. published_at 分布（直近公開記事の日時）
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const MASTER = new Set(["nz","be","tn","pl","ee","cy","hr","hu","ro","fi","bg","my","th","au","us","sg","gb","nl","fr","it","at","ie","ca","kr","se","no","dk","cz","gr","mt","ae","de","ge","hk","in","jp","ph","tw","za","br","cn","co","id","vn","ar","ch","pt","es","mx","tr"]);

// 末尾スラッシュを正規化してURL重複チェック
function normalizeUrl(u: string) { return u.replace(/\/+$/, "").toLowerCase(); }

// 参考資料セクションからURL一覧を抽出
function extractRefUrls(text: string): string[] {
  const refIdx = text.search(/###\s*(?:参考資料|References|参考资料)/);
  if (refIdx < 0) return [];
  const refSection = text.slice(refIdx);
  const urls: string[] = [];
  for (const m of refSection.matchAll(/\]\(https?:\/\/[^\s)]+\)/g)) {
    urls.push(m[0].slice(2, -1)); // strip ]( and )
  }
  for (const m of refSection.matchAll(/^-\s+(https?:\/\/\S+)\s*$/mg)) {
    urls.push(m[1]);
  }
  return [...new Set(urls)];
}

let totalErrors = 0;
function pass(msg: string) { console.log(`  ✅ ${msg}`); }
function fail(msg: string) { console.log(`  ❌ ${msg}`); totalErrors++; }
function warn(msg: string) { console.log(`  ⚠️  ${msg}`); }

async function main() {
  // データ取得
  const [{ data: blogRows, error: e1 }, { data: studyRows, error: e2 }] = await Promise.all([
    sb.from("blog_posts").select("slug,is_published,published_at,created_at,content,locales").order("slug"),
    sb.from("study_blog_posts").select("slug,is_published,date,content").order("slug"),
  ]);
  if (e1 || e2) { console.error("DB取得エラー:", e1?.message ?? e2?.message); process.exit(1); }

  const blog = blogRows ?? [];
  const study = studyRows ?? [];

  // ─────────────────────────────────────────────────────────────
  console.log("\n=== [1] 重複スラグ確認 ===");
  // ─────────────────────────────────────────────────────────────

  // blog_posts: visa-{code} の重複
  const visaCodeCount = new Map<string, number>();
  for (const r of blog) {
    const m = r.slug.match(/^visa-([a-z]+)$/);
    if (m) visaCodeCount.set(m[1], (visaCodeCount.get(m[1]) ?? 0) + 1);
  }
  const dupVisa = [...visaCodeCount.entries()].filter(([, n]) => n > 1);
  if (dupVisa.length === 0) pass("visa-{code} 重複なし");
  else dupVisa.forEach(([c, n]) => fail(`visa-${c} が ${n} 件存在`));

  // study_blog_posts: study-work-{code} / study-country-{code} の重複
  const swCount = new Map<string, number>();
  const scCount = new Map<string, number>();
  const oldStudyCount = new Map<string, number>(); // study-{code} 旧形式が残っていないか
  for (const r of study) {
    const mw = r.slug.match(/^study-work-([a-z]+)$/);
    const mc = r.slug.match(/^study-country-([a-z]+)$/);
    const mo = r.slug.match(/^study-([a-z]+)$/) ; // old form (not work, not country)
    if (mw) swCount.set(mw[1], (swCount.get(mw[1]) ?? 0) + 1);
    if (mc) scCount.set(mc[1], (scCount.get(mc[1]) ?? 0) + 1);
    if (mo) oldStudyCount.set(mo[1], (oldStudyCount.get(mo[1]) ?? 0) + 1);
  }
  const dupSW = [...swCount.entries()].filter(([, n]) => n > 1);
  const dupSC = [...scCount.entries()].filter(([, n]) => n > 1);
  if (dupSW.length === 0) pass("study-work-{code} 重複なし");
  else dupSW.forEach(([c, n]) => fail(`study-work-${c} が ${n} 件存在`));
  if (dupSC.length === 0) pass("study-country-{code} 重複なし");
  else dupSC.forEach(([c, n]) => fail(`study-country-${c} が ${n} 件存在`));
  if (oldStudyCount.size === 0) pass("study-{code}（旧形式）残存なし");
  else [...oldStudyCount.keys()].forEach(c => fail(`study-${c}（旧形式）が残存`));

  // ─────────────────────────────────────────────────────────────
  console.log("\n=== [2] マスターリスト外の国コード確認 ===");
  // ─────────────────────────────────────────────────────────────

  const ghostVisa: string[] = [];
  const ghostSW: string[] = [];
  const ghostSC: string[] = [];

  for (const r of blog) {
    const m = r.slug.match(/^visa-([a-z]+)$/);
    if (m && !MASTER.has(m[1])) ghostVisa.push(r.slug);
  }
  for (const r of study) {
    const mw = r.slug.match(/^study-work-([a-z]+)$/);
    const mc = r.slug.match(/^study-country-([a-z]+)$/);
    if (mw && !MASTER.has(mw[1])) ghostSW.push(`${r.slug}(${r.is_published ? "公開" : "draft"})`);
    if (mc && !MASTER.has(mc[1])) ghostSC.push(`${r.slug}(${r.is_published ? "公開" : "draft"})`);
  }

  if (ghostVisa.length === 0) pass("visa: マスター外コードなし");
  else warn(`visa マスター外: ${ghostVisa.join(", ")}`);
  if (ghostSW.length === 0) pass("study-work: マスター外コードなし");
  else warn(`study-work マスター外: ${ghostSW.join(", ")}`);
  if (ghostSC.length === 0) pass("study-country: マスター外コードなし");
  else warn(`study-country マスター外: ${ghostSC.join(", ")}`);

  // ─────────────────────────────────────────────────────────────
  console.log("\n=== [3] 言語欠落確認 ===");
  // ─────────────────────────────────────────────────────────────

  // visa: ja/en/zh 必須（localesがnullの場合）
  const visaLangMissing: { slug: string; missing: string[] }[] = [];
  for (const r of blog) {
    if (!/^visa-[a-z]+$/.test(r.slug)) continue;
    const c = r.content as Record<string, string> | null;
    const reqLangs = r.locales && r.locales.length > 0 ? r.locales as string[] : ["ja","en","zh"];
    const missing = reqLangs.filter(lang => !c?.[lang] || (c[lang] as string).trim().length < 100);
    if (missing.length > 0) visaLangMissing.push({ slug: r.slug, missing });
  }
  if (visaLangMissing.length === 0) pass(`visa 50件 全言語(ja/en/zh) 充足`);
  else visaLangMissing.forEach(({ slug, missing }) => fail(`${slug}: ${missing.join(",")} 欠落`));

  // study-work / study-country: ja/en 必須
  const studyLangMissing: { slug: string; missing: string[] }[] = [];
  for (const r of study) {
    if (!/^study-(work|country)-[a-z]+$/.test(r.slug)) continue;
    const c = r.content as Record<string, string> | null;
    const missing = ["ja","en"].filter(lang => !c?.[lang] || (c[lang] as string).trim().length < 100);
    if (missing.length > 0) studyLangMissing.push({ slug: r.slug, missing });
  }
  if (studyLangMissing.length === 0) pass(`study 全件 ja/en 充足`);
  else studyLangMissing.forEach(({ slug, missing }) => fail(`${slug}: ${missing.join(",")} 欠落`));

  // ─────────────────────────────────────────────────────────────
  console.log("\n=== [4] 参考資料URL重複確認（TR + 直近visa-guide 8件）===");
  // ─────────────────────────────────────────────────────────────

  const checkSlugs = [
    "study-work-tr", "study-country-tr",
    "visa-my","visa-gr","visa-th","visa-ae","visa-sg","visa-nz","visa-ca","visa-au",
  ];

  for (const slug of checkSlugs) {
    const row = slug.startsWith("visa-")
      ? blog.find(r => r.slug === slug)
      : study.find(r => r.slug === slug);
    if (!row) { warn(`${slug}: レコード見つからず`); continue; }
    const c = row.content as Record<string, string> | null;
    const langs = slug.startsWith("visa-") ? ["ja","en","zh"] : ["ja","en"];
    let slugHasDup = false;
    for (const lang of langs) {
      const text = c?.[lang];
      if (!text) continue;
      const urls = extractRefUrls(text);
      const normalized = urls.map(normalizeUrl);
      const seen = new Set<string>();
      const dups: string[] = [];
      for (const n of normalized) {
        if (seen.has(n)) dups.push(n);
        seen.add(n);
      }
      if (dups.length > 0) {
        fail(`${slug} [${lang}]: 参考資料URL重複 → ${dups.join(", ")}`);
        slugHasDup = true;
      }
    }
    if (!slugHasDup) pass(`${slug}: 参考資料URL重複なし`);
  }

  // ─────────────────────────────────────────────────────────────
  console.log("\n=== [5] published_at 分布（直近30件）===");
  // ─────────────────────────────────────────────────────────────

  // visa + study-work + study-country の公開記事を published_at 降順で30件
  // blog_posts: published_at、study_blog_posts: date カラムを使用
  type PubRow = { slug: string; ts: string };
  const allPublished: PubRow[] = [
    ...blog.filter(r => r.is_published).map(r => ({ slug: r.slug, ts: r.published_at ?? r.created_at ?? "" })),
    ...study.filter(r => r.is_published).map(r => ({ slug: r.slug, ts: (r as {date?: string}).date ?? "" })),
  ];
  allPublished.sort((a, b) => b.ts.localeCompare(a.ts));

  console.log("  直近30件（slug | 日時）:");
  const recent = allPublished.slice(0, 30);
  for (const r of recent) {
    console.log(`    ${r.slug.padEnd(36)} | ${r.ts}`);
  }

  // 同日に公開した件数が多い日を集計
  const dayCount = new Map<string, number>();
  for (const r of allPublished) {
    const day = r.ts.slice(0, 10);
    if (day) dayCount.set(day, (dayCount.get(day) ?? 0) + 1);
  }
  const topDays = [...dayCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  console.log("\n  日別公開数 トップ10:");
  for (const [day, count] of topDays) {
    console.log(`    ${day}: ${count}件`);
  }

  // ─────────────────────────────────────────────────────────────
  console.log("\n=== まとめ ===");
  // ─────────────────────────────────────────────────────────────
  if (totalErrors === 0) {
    console.log("✅ 全5項目 異常なし");
  } else {
    console.log(`❌ エラー ${totalErrors} 件`);
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });

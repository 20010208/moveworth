/**
 * visa-guide 8件の参考資料セクション・本文生URL 一括修正スクリプト
 *
 * 修正内容:
 *   1. 参考資料セクション: 生URL行 → [label](url) 形式に変換
 *   2. URL重複排除（末尾スラッシュ等の表記ゆれ正規化）
 *   3. GR・TH: 参考資料セクション区切り（---）が欠損 → 正規形式に補完
 *   4. 本文中の生URL: マークダウンリンク形式でリンク化
 *      - moveworthapp.com/simulate → ロケール別ラベル
 *      - その他 → ドメインラベル
 *
 * 使い方:
 *   npx tsx scripts/_fix-visaguide-refs.ts          # dry-run（変更内容を表示）
 *   npx tsx scripts/_fix-visaguide-refs.ts --apply  # DB 更新
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(); if (!(k in process.env)) process.env[k] = t.slice(eq + 1).trim();
  }
}

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const APPLY = process.argv.includes("--apply");

const SLUGS = [
  "malaysia-mm2h-visa-complete-guide-2026",
  "greece-residency-visa-cost-2026",
  "thailand-ltr-visa-guide-2026",
  "dubai-uae-golden-visa-guide-2026",
  "singapore-ep-employment-pass-guide-2026",
  "new-zealand-skilled-migrant-visa-guide-2026",
  "canada-express-entry-guide-2026",
  "australia-skilled-independent-visa-189-guide-2026",
];

// ─── ドメインラベルマップ（apply-ref-labels.ts と同期 + visa-guide 用追加）────────

const DOMAIN_LABEL_MAP: Record<string, string> = {
  // マレーシア
  "mm2h.gov.my": "マレーシア観光省 MM2H",
  "imi.gov.my": "マレーシア移民局（IMI）",
  "esd.imi.gov.my": "マレーシア移民局（IMI）ESD",
  "imigresen-online.imi.gov.my": "マレーシア移民局（IMI）オンライン",
  "mdec.my": "マレーシアデジタル経済公社（MDEC）",
  "talentcorp.com.my": "TalentCorp Malaysia",
  "hasil.gov.my": "マレーシア内国歳入庁（HASiL）",
  // ギリシャ（追加）
  "migration.gov.gr": "ギリシャ移民・庇護省",
  "enterprisegreece.gov.gr": "Enterprise Greece（ギリシャ政府系投資促進機関）",
  "newsletters.enterprisegreece.gov.gr": "Enterprise Greece（ギリシャ政府系投資促進機関）",
  "aade.gr": "ギリシャ独立歳入庁（AADE）",
  // タイ
  "ltr.boi.go.th": "タイ投資委員会（BOI）LTR",
  "ewp.doe.go.th": "タイ雇用局（DOE）就労許可",
  "thaievisa.go.th": "タイ外務省 e-Visa",
  "www.thailandprivilege.co.th": "Thailand Privilege",
  "thailandprivilege.co.th": "Thailand Privilege",
  "rd.go.th": "タイ歳入局（Revenue Department）",
  // UAE（追加）
  "u.ae": "UAE政府公式ポータル（u.ae）",
  "icp.gov.ae": "UAE連邦身分証明局（ICP）",
  "gdrfad.gov.ae": "ドバイ居住外国人局（GDRFA）",
  // シンガポール
  "mom.gov.sg": "シンガポール労働省（MOM）",
  "edb.gov.sg": "シンガポール経済開発庁（EDB）",
  "ica.gov.sg": "シンガポール移民局（ICA）",
  "iras.gov.sg": "シンガポール内国歳入庁（IRAS）",
  // ニュージーランド（追加）
  "immigration.govt.nz": "ニュージーランド移民局（Immigration NZ）",
  "ird.govt.nz": "ニュージーランド内国歳入局（IRD）",
  // カナダ（追加）
  "ircc.canada.ca": "カナダ移民・難民・市民権省（IRCC）",
  // オーストラリア
  "immi.homeaffairs.gov.au": "オーストラリア内務省移民局",
  "ato.gov.au": "オーストラリア税務局（ATO）",
  // 英国
  "gov.uk": "英国政府（GOV.UK）",
};

function urlToLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");
    const path = parsed.pathname;
    if (hostname === "canada.ca") {
      if (/\/revenue-agency|\/cra\b/i.test(path)) return "カナダ歳入庁（CRA）";
      if (/\/immigration|\/refugees|\/ircc/i.test(path)) return "カナダ移民・難民・市民権省（IRCC）";
      return "カナダ政府（canada.ca）";
    }
    return DOMAIN_LABEL_MAP[hostname] ?? DOMAIN_LABEL_MAP[`www.${hostname}`] ?? hostname;
  } catch { return url; }
}

const SIM_URL = "https://moveworthapp.com/simulate";
const SIM_LABEL: Record<string, string> = {
  ja: "MoveWorthシミュレーター",
  en: "MoveWorth Simulator",
  zh: "MoveWorth模拟器",
};

// 末尾スラッシュ正規化
function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

// pathSuffix（同一ドメイン複数URLの区別用）
function pathSuffix(url: string): string {
  try {
    const u = new URL(url);
    const skip = new Set(["en","ja","de","fr","ko","zh","id","th","vi","ms","pt","es","it","nl",
      "en-us","en-gb","en-au","index","home","top","main","portal"]);
    const parts = u.pathname.split("/").filter(s => s.length > 2 && !skip.has(s.toLowerCase()));
    const seg = parts.at(-2) ?? parts.at(-1) ?? "";
    return seg.replace(/[^a-z0-9]/gi, "-").replace(/-{2,}/g, "-").replace(/^-|-$/g, "").slice(0, 20);
  } catch { return ""; }
}

// ─── 参考資料セクション修正 ─────────────────────────────────────────────────────

interface RefsFix {
  fixed: string;
  changes: string[];
}

function fixRefsSection(text: string, locale: string): RefsFix | null {
  // 参考資料見出しの位置を検出（形式不問）
  const headingRe = /###\s*(?:参考資料|References|参考资料)[^\n]*/;
  const headingIdx = text.search(headingRe);
  if (headingIdx < 0) return null;

  const preText = text.slice(0, headingIdx);
  const fromHeading = text.slice(headingIdx);

  // 見出し行とその後のテキストを分離
  const nlAfterHeading = fromHeading.indexOf("\n");
  const headingLine = fromHeading.slice(0, nlAfterHeading >= 0 ? nlAfterHeading : undefined);
  const afterHeading = nlAfterHeading >= 0 ? fromHeading.slice(nlAfterHeading + 1) : "";

  // 本文と参考資料区切り（--- がなければ追加）
  const endsWithSep = /\n---\s*\n\s*$/.test(preText);
  const fixedPre = endsWithSep
    ? preText
    : preText.replace(/\s+$/, "") + "\n\n---\n\n";

  // intro行（「本記事の情報は...」のような最初の非リスト行）を保存
  const afterHeadingLines = afterHeading.split("\n");
  let introLine = "";
  let listStartIdx = 0;
  if (afterHeadingLines[0] && !afterHeadingLines[0].trim().startsWith("-")) {
    introLine = afterHeadingLines[0];
    listStartIdx = 1;
  }
  const remainingLines = afterHeadingLines.slice(listStartIdx);

  // リスト行を収集（`- http` または `- [label](http`）
  const refLines = remainingLines.filter(l => l.trim().match(/^-\s+(?:https?:|.+\(https?:)/));

  // URLを抽出・正規化・重複排除
  const seen = new Map<string, string>(); // normalized → original
  const uniqueUrls: string[] = [];
  const changes: string[] = [];

  for (const line of refLines) {
    // 既にリンク形式 [label](url) の場合も URL を抽出
    const linkedMatch = line.match(/\[([^\]]*)\]\((https?:\/\/[^)]+)\)/);
    const plainMatch = line.match(/^-\s+(https?:\/\/\S+)/);
    const url = linkedMatch ? linkedMatch[2] : plainMatch ? plainMatch[1].replace(/['">,]+$/, "") : null;
    if (!url) continue;
    const norm = normalizeUrl(url);
    if (seen.has(norm)) {
      changes.push(`  DUP除去: ${url}`);
    } else {
      seen.set(norm, url);
      uniqueUrls.push(url);
    }
  }

  // ラベル構築（同一ラベル衝突時はパスサフィックスで区別）
  const labelCounts = new Map<string, number>();
  for (const url of uniqueUrls) {
    const lbl = urlToLabel(url);
    labelCounts.set(lbl, (labelCounts.get(lbl) ?? 0) + 1);
  }

  const newRefLines = uniqueUrls.map(url => {
    let lbl = urlToLabel(url);
    if ((labelCounts.get(lbl) ?? 0) > 1) {
      const ps = pathSuffix(url);
      if (ps) lbl = `${lbl}（${ps}）`;
    }
    return `- [${lbl}](${url})`;
  });

  // 変更点を記録（DUP除去後はインデックス不一致のため URL 単位で比較）
  for (let i = 0; i < uniqueUrls.length; i++) {
    const url = uniqueUrls[i];
    const origLine = refLines.find(l => {
      const m = l.match(/https?:\/\/[^\s)\]'">,]+/);
      return m && normalizeUrl(m[0]) === normalizeUrl(url);
    });
    const oldStr = origLine?.trim() ?? `- ${url}`;
    const newStr = newRefLines[i];
    if (oldStr !== newStr) changes.push(`  ${oldStr}\n  → ${newStr}`);
  }

  const introBlock = introLine ? `${introLine}\n` : "";
  const fixedSection = `${headingLine}\n${introBlock}${newRefLines.join("\n")}\n`;
  const fixed = fixedPre + fixedSection;

  return { fixed, changes };
}

// ─── 本文中の生URL修正 ────────────────────────────────────────────────────────

// 参考資料見出しより前のテキストにある生URLをリンク化
function fixBodyUrls(text: string, locale: string): { fixed: string; changes: string[] } {
  const headingIdx = text.search(/###\s*(?:参考資料|References|参考资料)/);
  const bodyPart = headingIdx >= 0 ? text.slice(0, headingIdx) : text;
  const restPart = headingIdx >= 0 ? text.slice(headingIdx) : "";

  const changes: string[] = [];
  // リンク化されていない生URL
  // [\x21-\x7E]+ = ASCII 印字文字のみ（全角文字・CJKでURL終端）
  // (?<![(\[]) = 既存マークダウンリンク [label](url) の URL 部分は対象外
  // ※ 全角括弧 （url） 形式は対象内（中国語文中の生URLを想定）
  const fixedBody = bodyPart.replace(
    /(?<![(\[])https?:\/\/[\x21-\x7E]+/g,
    (matched) => {
      // 末尾の句読点（ASCII・非URL文字）を除去
      const cleanUrl = matched.replace(/[.,;:!?)>\]'"]+$/, "");
      const trailingPunct = matched.slice(cleanUrl.length);
      const normUrl = normalizeUrl(cleanUrl);
      let label: string;
      if (normUrl === SIM_URL || cleanUrl.startsWith(SIM_URL + "?")) {
        label = SIM_LABEL[locale] ?? SIM_LABEL.ja;
      } else {
        label = urlToLabel(cleanUrl);
      }
      changes.push(`  生URL→リンク: ${cleanUrl}`);
      return `[${label}](${cleanUrl})${trailingPunct}`;
    }
  );

  return { fixed: fixedBody + restPart, changes };
}

// ─── メイン ──────────────────────────────────────────────────────────────────

async function main() {
  const { data } = await sb.from("blog_posts").select("slug, is_published, content").in("slug", SLUGS);
  const rows = data ?? [];

  console.log(`対象記事: ${SLUGS.length}件 / 取得済み: ${rows.length}件`);
  console.log(APPLY ? "モード: --apply（DB更新）\n" : "モード: dry-run（変更なし）\n");

  const updates: { slug: string; content: Record<string, string> }[] = [];

  for (const slug of SLUGS) {
    const row = rows.find((r: { slug: string }) => r.slug === slug);
    if (!row) { console.log(`❌ NOT FOUND: ${slug}\n`); continue; }

    const c = row.content as Record<string, string>;
    const newContent: Record<string, string> = { ...c };
    const allChanges: string[] = [];
    let articleChanged = false;

    for (const locale of ["ja", "en", "zh"] as const) {
      const text = c[locale];
      if (!text) continue;

      // 1. 参考資料セクション修正
      const refsResult = fixRefsSection(text, locale);
      const textAfterRefs = refsResult?.fixed ?? text;
      if (refsResult?.changes.length) {
        allChanges.push(`  [${locale}] 参考資料修正:`);
        allChanges.push(...refsResult.changes);
      }

      // 2. 本文生URL修正
      const bodyResult = fixBodyUrls(textAfterRefs, locale);
      if (bodyResult.changes.length) {
        allChanges.push(`  [${locale}] 本文生URL修正:`);
        allChanges.push(...bodyResult.changes);
      }

      if (bodyResult.fixed !== text) {
        newContent[locale] = bodyResult.fixed;
        articleChanged = true;
      }
    }

    console.log(`${articleChanged ? (APPLY ? "✏️ " : "📋 ") : "⏭  "}${slug}`);
    if (allChanges.length) {
      allChanges.forEach(l => console.log(l));
    } else {
      console.log("  変更なし");
    }
    console.log();

    if (articleChanged) updates.push({ slug, content: newContent });
  }

  console.log(`\n変更対象: ${updates.length}件`);

  if (!APPLY) {
    console.log("[DRY RUN] --apply を付けて実行すると DB が更新されます");
    return;
  }

  let ok = 0;
  for (const u of updates) {
    const { error } = await sb.from("blog_posts").update({ content: u.content }).eq("slug", u.slug);
    if (error) { console.error(`  ❌ ${u.slug}: ${error.message}`); }
    else { console.log(`  ✅ ${u.slug}`); ok++; }
  }
  console.log(`\n✅ ${ok}件 更新完了`);
}

main().catch(e => { console.error(e); process.exit(1); });

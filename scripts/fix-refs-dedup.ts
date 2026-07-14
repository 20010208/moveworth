/**
 * fix-refs-dedup.ts
 *
 * 全公開ビザ記事の参考資料セクションを走査し、
 * 1. 完全一致URLの重複を排除
 * 2. 同一ドメインラベルが2件以上の場合、URLパスから機械的にサフィックスを生成
 * して一括修正する。
 *
 * Usage:
 *   npx tsx scripts/fix-refs-dedup.ts          # dry-run（変更内容のみ表示）
 *   npx tsx scripts/fix-refs-dedup.ts --apply  # DB に書き込む
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const APPLY = process.argv.includes("--apply");

// ===== ドメインラベルマップ（generate-country-article.ts と同期） =====
const DOMAIN_LABEL_MAP: Record<string, string> = {
  "xuatnhapcanh.gov.vn": "ベトナム出入国管理局",
  "immigration.gov.vn": "ベトナム出入国管理局",
  "migration.gv.at": "オーストリア移民局（migration.gv.at）",
  "immi.homeaffairs.gov.au": "オーストラリア内務省移民局",
  "homeaffairs.gov.au": "オーストラリア内務省",
  "ato.gov.au": "オーストラリア税務局（ATO）",
  "immigration.go.kr": "韓国出入国外国人政策本部",
  "hikorea.go.kr": "韓国 Hi Korea 出入国サービス",
  "nts.go.kr": "韓国国税庁（NTS）",
  "in.nts.go.kr": "韓国国税庁（NTS）",
  "immigration.go.th": "タイ出入国管理局",
  "doa.go.th": "タイ労働省雇用局（DOA）",
  "ewp.doe.go.th": "タイ雇用局（DOE）就労許可",
  "thaievisa.go.th": "タイ外務省 e-Visa",
  "www.thailandprivilege.co.th": "Thailand Privilege",
  "thailandprivilege.co.th": "Thailand Privilege",
  "rd.go.th": "タイ歳入局（Revenue Department）",
  "mom.gov.sg": "シンガポール労働省（MOM）",
  "edb.gov.sg": "シンガポール経済開発庁（EDB）",
  "ica.gov.sg": "シンガポール移民局（ICA）",
  "iras.gov.sg": "シンガポール内国歳入庁（IRAS）",
  "uscis.gov": "米国移民局（USCIS）",
  "my.uscis.gov": "米国移民局（USCIS）myUSCIS",
  "irs.gov": "米国内国歳入庁（IRS）",
  "dhs.gov": "米国国土安全保障省（DHS）",
  "ed.gov": "米国教育省（ED）",
  "jp.usembassy.gov": "在日米国大使館",
  "mm2h.gov.my": "マレーシア観光省 MM2H",
  "esd.imi.gov.my": "マレーシア移民局（IMI）ESD",
  "mdec.my": "マレーシアデジタル経済公社（MDEC）",
  "imigresen-online.imi.gov.my": "マレーシア移民局（IMI）オンライン",
  "imi.gov.my": "マレーシア移民局（IMI）",
  "talentcorp.com.my": "TalentCorp Malaysia",
  "hasil.gov.my": "マレーシア内国歳入庁（HASiL）",
  "gov.pl": "ポーランド政府（GOV.PL）",
  "udsc.gov.pl": "ポーランド外国人局（UDSC）",
  "paih.gov.pl": "ポーランド投資・貿易庁（PAIH）",
  "welcomepoland.pl": "Welcome to Poland",
  "podatki.gov.pl": "ポーランド税務局",
  "belastingdienst.nl": "オランダ税務・関税局（Belastingdienst）",
  "impots.gouv.fr": "フランス財務省税務局（DGFiP）",
  "agenziaentrate.gov.it": "イタリア歳入庁（Agenzia delle Entrate）",
  "sede.agenciatributaria.gob.es": "スペイン国税庁（AEAT）",
  "agenciatributaria.gob.es": "スペイン国税庁（AEAT）",
  "info.portaldasfinancas.gov.pt": "ポルトガル税務・関税局（AT）",
  "estv.admin.ch": "スイス連邦税務局（ESTV）",
  "bmf.gv.at": "オーストリア財務省（BMF）",
  "revenue.ie": "アイルランド歳入庁（Revenue）",
  // canada.ca は purpose 別に urlToLabel() で分岐（下記）

  "ird.govt.nz": "ニュージーランド内国歳入局（IRD）",
  "skatteverket.se": "スウェーデン税務庁（Skatteverket）",
  "skatteetaten.no": "ノルウェー税務局（Skatteetaten）",
  "skat.dk": "デンマーク税務庁（Skattestyrelsen）",
  "portal.gov.cz": "チェコ政府ポータル（portal.gov.cz）",
  "porezna-uprava.gov.hr": "クロアチア税務局（Porezna uprava）",
  "aade.gr": "ギリシャ独立歳入庁（AADE）",
  "mtca.gov.mt": "マルタ税関歳入庁（MTCA）",
  "u.ae": "UAE政府公式ポータル（u.ae）",
  "lsth.bundesfinanzministerium.de": "ドイツ連邦財務省 所得税計算補助",
  "bundesfinanzministerium.de": "ドイツ連邦財務省（BMF）",
  "matsne.gov.ge": "ジョージア立法府公式ポータル（matsne.gov.ge）",
  "gov.hk": "香港政府（gov.hk）",
  "ird.gov.hk": "香港税務局（IRD）",
  "incometax.gov.in": "インド所得税局（IT Department）",
  "nta.go.jp": "国税庁（NTA）",
  "elibrary.judiciary.gov.ph": "フィリピン最高裁判所E-Library",
  "etax.nat.gov.tw": "台湾財政部税務ポータル（eTax）",
  "sars.gov.za": "南アフリカ歳入庁（SARS）",
  "nra.bg": "ブルガリア国家歳入庁（NRA）",
  "gov.br": "ブラジル連邦政府（gov.br）",
  "receitafederal.gov.br": "ブラジル連邦歳入局（Receita Federal）",
  "guangdong.chinatax.gov.cn": "中国広東省税務局",
  "chinatax.gov.cn": "中国国家税務総局",
  "micrositios.dian.gov.co": "コロンビア国税庁（DIAN）",
  "pajak.go.id": "インドネシア税務総局（DJP）",
  "tuyenquang.gdt.gov.vn": "ベトナム税務総局（GDT）地方ポータル",
  "gdt.gov.vn": "ベトナム税務総局（GDT）",
};

function urlToLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");
    const path = parsed.pathname;

    // canada.ca: path で IRCC（移民）/ CRA（税務）を分岐
    if (hostname === "canada.ca") {
      if (/\/revenue-agency|\/cra\b/i.test(path)) return "カナダ歳入庁（CRA）";
      if (/\/immigration|\/refugees|\/ircc/i.test(path)) return "カナダ移民・難民・市民権省（IRCC）";
      return "カナダ政府（canada.ca）";
    }

    return DOMAIN_LABEL_MAP[hostname] ?? hostname;
  } catch {
    return url;
  }
}

const LOCALE_SEGS = new Set([
  "en", "ja", "zh", "ko", "de", "fr", "pt", "es", "it", "nl",
  "zh-cn", "zh-tw", "th", "vi", "id", "pl", "cs", "hu", "ro", "hr",
]);

const UUID_RE = /^[0-9a-f]{8}([0-9a-f]{4}){3}[0-9a-f]{12}$|^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

function toTitleCase(seg: string): string {
  return seg.replace(/\.(html?|aspx|php)$/i, "")
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** URLのパスから機械的にサフィックスを生成。
 *  - ロケールセグメント・UUID・拡張子 を除外
 *  - 後ろから最大2セグメントを使い衝突を減らす
 */
function pathSuffix(url: string): string {
  try {
    const path = new URL(url).pathname.replace(/\/+$/, "");
    const segs = path.split("/").filter(Boolean)
      .filter(s => !LOCALE_SEGS.has(s.toLowerCase()))
      .filter(s => !UUID_RE.test(s));
    if (segs.length === 0) return "";
    // 後ろから最大2セグメント
    const parts = segs.slice(-2).map(toTitleCase);
    return parts.join(" ");
  } catch {
    return "";
  }
}

/** refs 文字列（`- [label](url)` の連結）を正規化して返す */
function normalizeRefs(rawRefs: string): { result: string; changed: boolean; issues: string[] } {
  const issues: string[] = [];

  // ref 行をパース
  const lines = rawRefs.split("\n").map(l => l.trim()).filter(Boolean);
  const parsed: Array<{ label: string; url: string }> = [];
  for (const line of lines) {
    const m = line.match(/^-\s*\[(.+?)\]\((.+?)\)$/);
    if (m) parsed.push({ label: m[1], url: m[2] });
    else {
      // ref 以外の行（太字テキストなど）はそのまま保持しない（ref セクションには refs のみ想定）
    }
  }

  // 1. 完全一致 URL の重複排除
  const seenUrls = new Set<string>();
  const deduped: typeof parsed = [];
  for (const entry of parsed) {
    if (seenUrls.has(entry.url)) {
      issues.push(`dup_url: ${entry.url}`);
      continue;
    }
    seenUrls.add(entry.url);
    deduped.push(entry);
  }

  // 2. ラベルの再計算（domain label ベース）
  const withNewLabels = deduped.map(e => ({ ...e, newLabel: urlToLabel(e.url) }));

  // 3. 同一ラベルが 2 件以上の場合はパスサフィックスを追加
  const labelCount = new Map<string, number>();
  for (const { newLabel } of withNewLabels) {
    labelCount.set(newLabel, (labelCount.get(newLabel) ?? 0) + 1);
  }

  const result = withNewLabels
    .map(({ url, newLabel }) => {
      if ((labelCount.get(newLabel) ?? 0) > 1) {
        const suffix = pathSuffix(url);
        const fullLabel = suffix ? `${newLabel} - ${suffix}` : newLabel;
        if (fullLabel !== newLabel) issues.push(`disambig: ${newLabel} → ${fullLabel}`);
        return `- [${fullLabel}](${url})`;
      }
      return `- [${newLabel}](${url})`;
    })
    .join("\n");

  const original = parsed.map(({ label, url }) => `- [${label}](${url})`).join("\n");
  return { result, changed: result !== original, issues };
}

/** content 文字列内の参考資料セクションの refs 部分を正規化する */
function patchContent(content: string, lang: "ja" | "en" | "zh"): { patched: string; changed: boolean; issues: string[] } {
  const headings: Record<string, string> = {
    ja: "参考資料",
    en: "References",
    zh: "参考资料",
  };
  const heading = headings[lang];

  // セクション全体をマッチ（末尾まで）
  const sectionRe = new RegExp(
    `(---\\n\\n###\\s*${heading}[^\\n]*\\n[^\\n]*\\n)([\\s\\S]*)$`
  );
  const m = content.match(sectionRe);
  if (!m) return { patched: content, changed: false, issues: [] };

  const header = m[1];
  const rawRefs = m[2];
  const { result, changed, issues } = normalizeRefs(rawRefs);

  if (!changed) return { patched: content, changed: false, issues: [] };

  const patched = content.replace(sectionRe, `${header}${result}`);
  return { patched, changed: true, issues };
}

async function main() {
  console.log(`\n=== fix-refs-dedup.ts (mode: ${APPLY ? "APPLY" : "DRY-RUN"}) ===\n`);

  // 全公開 visa 記事を取得
  const { data: articles, error } = await supabase
    .from("blog_posts")
    .select("id, slug, content, is_published")
    .like("slug", "visa-%")
    .eq("is_published", true)
    .order("slug");

  if (error) { console.error("fetch error:", error.message); process.exit(1); }
  if (!articles?.length) { console.log("No articles found."); return; }

  const toFix: Array<{ slug: string; content: Record<string, string>; issues: string[] }> = [];

  // 走査
  for (const art of articles) {
    const content = art.content as Record<string, string>;
    const allIssues: string[] = [];
    let anyChanged = false;

    for (const lang of ["ja", "en", "zh"] as const) {
      const text = content[lang] ?? "";
      if (!text) continue;
      const { patched, changed, issues } = patchContent(text, lang);
      if (changed) {
        content[lang] = patched;
        allIssues.push(...issues.map(i => `[${lang}] ${i}`));
        anyChanged = true;
      }
    }

    if (anyChanged) {
      toFix.push({ slug: art.slug, content, issues: allIssues });
    }
  }

  if (toFix.length === 0) {
    console.log("✅ 修正が必要な記事はありませんでした。");
    return;
  }

  // レポート
  console.log(`修正対象: ${toFix.length} 記事\n`);
  for (const { slug, issues } of toFix) {
    console.log(`  ${slug}:`);
    for (const issue of issues) {
      console.log(`    - ${issue}`);
    }
  }

  if (!APPLY) {
    console.log(`\n⚠️  dry-run のため DB は更新しません。適用するには --apply を付けて実行してください。`);
    return;
  }

  // DB 更新
  console.log(`\n DB 更新中...`);
  let successCount = 0;
  for (const { slug, content } of toFix) {
    const { error: updateErr } = await supabase
      .from("blog_posts")
      .update({ content })
      .eq("slug", slug);
    if (updateErr) {
      console.error(`  ❌ ${slug}: ${updateErr.message}`);
    } else {
      console.log(`  ✅ ${slug}`);
      successCount++;
    }
  }
  console.log(`\n完了: ${successCount}/${toFix.length} 記事を更新しました。`);
}

main().catch(console.error);

/**
 * 参考資料ラベル改善第2弾 — 参考資料セクション一括適用
 *
 * 本文・税制セクションは一切変更しない。参考資料セクションのリンクラベルのみ更新。
 *
 * 使い方:
 *   npx tsx scripts/apply-ref-labels.ts --dry-run          # 全記事 before/after 表示
 *   npx tsx scripts/apply-ref-labels.ts --dry-run kr de sg # 指定スラグパターンのみ
 *   npx tsx scripts/apply-ref-labels.ts --apply            # DB 更新（承認後のみ）
 *
 * 前提: fetch-page-titles.ts + translate-page-titles.ts 実行済みであること
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const APPLY   = process.argv.includes("--apply");
const DRY_RUN = !APPLY || process.argv.includes("--dry-run");
const filterArgs = process.argv.slice(2).filter(a => !a.startsWith("--"));

// ===== DOMAIN_LABEL_MAP (generate-country-article.ts と同期) =====
const DOMAIN_LABEL_MAP: Record<string, string> = {
  "immi.homeaffairs.gov.au": "オーストラリア内務省移民局",
  "ato.gov.au": "オーストラリア税務局（ATO）",
  "dofi.ibz.be": "ベルギー外国人局（DVZ/OE）",
  "belgium.be": "ベルギー政府公式サイト",
  "economischmigrant.be": "ベルギー経済移民情報",
  "diplomatice.belgium.be": "在日ベルギー大使館",
  "japan.diplomatie.belgium.be": "在日ベルギー大使館",
  "employment.belgium.be": "ベルギー雇用・労働省",
  "fin.belgium.be": "ベルギー財務省",
  "politsei.ee": "エストニア警察・国境警備局",
  "workinestonia.com": "Work in Estonia",
  "smartsettlers.ee": "Smart Settlers Estonia",
  "emta.ee": "エストニア税務・関税庁（EMTA）",
  "gov.uk": "英国政府（GOV.UK）",
  "britishcouncil.org": "ブリティッシュ・カウンシル",
  "visitbritain.com": "VisitBritain",
  "universitiesuk.ac.uk": "Universities UK",
  "ltr.boi.go.th": "タイ投資委員会（BOI）LTR",
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
  "ird.govt.nz": "ニュージーランド内国歳入局（IRD）",
  "in.nts.go.kr": "韓国国税庁（NTS）",
  "nts.go.kr": "韓国国税庁（NTS）",
  "skatteverket.se": "スウェーデン税務庁（Skatteverket）",
  "skatteetaten.no": "ノルウェー税務局（Skatteetaten）",
  "skat.dk": "デンマーク税務庁（Skattestyrelsen）",
  "portal.gov.cz": "チェコ政府ポータル（portal.gov.cz）",
  "porezna-uprava.gov.hr": "クロアチア税務局（Porezna uprava）",
  "aade.gr": "ギリシャ独立歳入庁（AADE）",
  "mtca.gov.mt": "マルタ税関歳入庁（MTCA）",
  "u.ae": "UAE政府公式ポータル（u.ae）",
  "lsth.bundesfinanzministerium.de": "ドイツ連邦財務省 所得税計算補助（Lohnsteuerhilfeverein）",
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
    if (hostname === "canada.ca") {
      if (/\/revenue-agency|\/cra\b/i.test(path)) return "カナダ歳入庁（CRA）";
      if (/\/immigration|\/refugees|\/ircc/i.test(path)) return "カナダ移民・難民・市民権省（IRCC）";
      return "カナダ政府（canada.ca）";
    }
    return DOMAIN_LABEL_MAP[hostname] ?? DOMAIN_LABEL_MAP[`www.${hostname}`] ?? hostname;
  } catch { return url; }
}

const LANG_TAG: Record<string, Record<string, string>> = {
  ko: { ja: "韓国語", en: "Korean", zh: "韩语" },
  de: { ja: "ドイツ語", en: "German", zh: "德语" },
  fr: { ja: "フランス語", en: "French", zh: "法语" },
  nl: { ja: "オランダ語", en: "Dutch", zh: "荷兰语" },
  pl: { ja: "ポーランド語", en: "Polish", zh: "波兰语" },
  cs: { ja: "チェコ語", en: "Czech", zh: "捷克语" },
  sv: { ja: "スウェーデン語", en: "Swedish", zh: "瑞典语" },
  da: { ja: "デンマーク語", en: "Danish", zh: "丹麦语" },
  no: { ja: "ノルウェー語", en: "Norwegian", zh: "挪威语" },
  fi: { ja: "フィンランド語", en: "Finnish", zh: "芬兰语" },
  pt: { ja: "ポルトガル語", en: "Portuguese", zh: "葡萄牙语" },
  es: { ja: "スペイン語", en: "Spanish", zh: "西班牙语" },
  it: { ja: "イタリア語", en: "Italian", zh: "意大利语" },
  el: { ja: "ギリシャ語", en: "Greek", zh: "希腊语" },
  hr: { ja: "クロアチア語", en: "Croatian", zh: "克罗地亚语" },
  hu: { ja: "ハンガリー語", en: "Hungarian", zh: "匈牙利语" },
  ro: { ja: "ルーマニア語", en: "Romanian", zh: "罗马尼亚语" },
  et: { ja: "エストニア語", en: "Estonian", zh: "爱沙尼亚语" },
  zh: { ja: "中国語", en: "Chinese", zh: "中文" },
  ja: { ja: "日本語", en: "Japanese", zh: "日语" },
  th: { ja: "タイ語", en: "Thai", zh: "泰语" },
  ar: { ja: "アラビア語", en: "Arabic", zh: "阿拉伯语" },
  vi: { ja: "ベトナム語", en: "Vietnamese", zh: "越南语" },
  id: { ja: "インドネシア語", en: "Indonesian", zh: "印尼语" },
  ms: { ja: "マレー語", en: "Malay", zh: "马来语" },
  hi: { ja: "ヒンディー語", en: "Hindi", zh: "印地语" },
  ka: { ja: "ジョージア語", en: "Georgian", zh: "格鲁吉亚语" },
  fil: { ja: "フィリピン語", en: "Filipino", zh: "菲律宾语" },
};

function langTag(sourceLang: string | null | undefined, articleLocale: string): string {
  if (!sourceLang) return "";
  const sl = sourceLang.toLowerCase().slice(0, 3);
  const ARTICLE_LANG: Record<string, string> = { ja: "ja", en: "en", zh: "zh" };
  if (sl === ARTICLE_LANG[articleLocale]) return "";
  if (sl === "en") return "";
  const tag = LANG_TAG[sl];
  if (!tag) return "";
  return articleLocale === "ja" ? `（${tag.ja}）`
    : articleLocale === "zh" ? `（${tag.zh}）`
    : ` (${tag.en})`;
}

type SourceMeta = {
  page_title_ja: string | null;
  page_title_en: string | null;
  page_title_zh: string | null;
  page_title_original: string | null;
  page_lang: string | null;
};

function buildRefLabel(url: string, meta: SourceMeta | undefined, articleLocale: string): string {
  const institution = urlToLabel(url);
  if (!meta) return institution;
  const translated = articleLocale === "ja" ? meta.page_title_ja
    : articleLocale === "en" ? meta.page_title_en
    : meta.page_title_zh;
  const titlePart = translated ?? meta.page_title_original ?? null;
  if (!titlePart) return institution;
  const tag = langTag(meta.page_lang, articleLocale);
  return `${institution} - ${titlePart}${tag}`;
}

// 参考資料セクション区切り検出
const REF_SECTION_RE = /(\n---\n\n###\s*(?:参考資料|References|参考资料)[^\n]*\n[^\n]*\n)([\s\S]*)$/;

/**
 * マークダウン本文の参考資料セクションのリンクラベルのみを更新する。
 * セクション区切り（---）・見出し・序文行は保持し、リスト行のみ差し替える。
 * 参考資料セクションがない場合は null を返す（変更なし）。
 */
function patchRefsSection(
  content: string,
  urlMetaMap: Map<string, SourceMeta>,
  locale: string
): { patched: string; changed: boolean; before: string[]; after: string[] } | null {
  const m = content.match(REF_SECTION_RE);
  if (!m) return null;

  const sectionHeader = m[1]; // "---\n\n### 参考資料\n本記事の...\n"
  const sectionBody = m[2];   // リスト部分（"- [label](url)\n..."）

  const originalLines = sectionBody.split("\n");
  const patchedLines: string[] = [];
  const beforeLabels: string[] = [];
  const afterLabels: string[] = [];

  for (const line of originalLines) {
    const linkMatch = line.match(/^(- )\[([^\]]*)\]\((https?:\/\/[^)]+)\)(.*)$/);
    if (!linkMatch) {
      patchedLines.push(line);
      continue;
    }
    const [, prefix, oldLabel, url, suffix] = linkMatch;
    const meta = urlMetaMap.get(url);
    const newLabel = buildRefLabel(url, meta, locale);
    patchedLines.push(`${prefix}[${newLabel}](${url})${suffix}`);
    if (oldLabel !== newLabel) {
      beforeLabels.push(oldLabel);
      afterLabels.push(newLabel);
    }
  }

  const newSectionBody = patchedLines.join("\n");
  const changed = newSectionBody !== sectionBody;
  const prefix = content.slice(0, content.length - m[0].length);
  return {
    patched: prefix + sectionHeader + newSectionBody,
    changed,
    before: beforeLabels,
    after: afterLabels,
  };
}

async function main() {
  // 1. country_sources から URL → meta の辞書を構築
  const { data: srcData, error: srcErr } = await sb
    .from("country_sources")
    .select("url, page_title_ja, page_title_en, page_title_zh, page_title_original, page_lang")
    .not("page_title_original", "is", null);
  if (srcErr) { console.error("country_sources fetch error:", srcErr.message); process.exit(1); }

  const urlMetaMap = new Map<string, SourceMeta>();
  for (const r of srcData ?? []) {
    urlMetaMap.set(r.url, {
      page_title_ja: r.page_title_ja,
      page_title_en: r.page_title_en,
      page_title_zh: r.page_title_zh,
      page_title_original: r.page_title_original,
      page_lang: r.page_lang,
    });
  }
  console.log(`URL→title マッピング: ${urlMetaMap.size} 件\n`);

  if (urlMetaMap.size === 0) {
    console.error("⚠️  page_title_original が null のみです。fetch-page-titles.ts と translate-page-titles.ts を先に実行してください。");
    process.exit(1);
  }

  // 2. 公開記事を取得
  let query = sb.from("blog_posts")
    .select("slug, is_published, content")
    .eq("is_published", true)
    .order("slug");

  const { data: posts, error: postsErr } = await query;
  if (postsErr) { console.error("blog_posts fetch error:", postsErr.message); process.exit(1); }

  const allPosts = posts ?? [];

  // スラグフィルター（CLIで指定した場合）
  const filtered = filterArgs.length > 0
    ? allPosts.filter(p => filterArgs.some(f => p.slug.includes(f)))
    : allPosts;

  console.log(`対象記事: ${filtered.length} 件 / 公開記事 ${allPosts.length} 件\n`);

  const LOCALES: Array<"ja" | "en" | "zh"> = ["ja", "en", "zh"];
  let totalChanged = 0;
  let totalArticlesChanged = 0;

  const updates: { slug: string; content: Record<string, string> }[] = [];

  for (const post of filtered) {
    const content = post.content as Record<string, string> | null;
    if (!content) continue;

    let articleChanged = false;
    const newContent: Record<string, string> = { ...content };
    const logLines: string[] = [];

    for (const locale of LOCALES) {
      const text = content[locale];
      if (!text) continue;

      const result = patchRefsSection(text, urlMetaMap, locale);
      if (!result) continue;
      if (!result.changed) continue;

      newContent[locale] = result.patched;
      articleChanged = true;
      totalChanged += result.before.length;

      logLines.push(`  [${locale}] ${result.before.length}件変更`);
      for (let i = 0; i < result.before.length; i++) {
        logLines.push(`    BEFORE: ${result.before[i]}`);
        logLines.push(`    AFTER:  ${result.after[i]}`);
      }
    }

    if (!articleChanged) continue;
    totalArticlesChanged++;

    console.log(`${APPLY ? "✏️" : "📋"} ${post.slug}`);
    for (const l of logLines) console.log(l);
    console.log();

    updates.push({ slug: post.slug, content: newContent });
  }

  console.log(`\n=== サマリー ===`);
  console.log(`変更記事: ${totalArticlesChanged} 件`);
  console.log(`変更ラベル: ${totalChanged} 件（3言語合計）`);

  if (!APPLY) {
    console.log("\n[DRY RUN] --apply を付けて実行すると DB が更新されます");
    return;
  }

  // 3. DB 更新
  let updated = 0;
  for (const u of updates) {
    const { error: upErr } = await sb
      .from("blog_posts")
      .update({ content: u.content })
      .eq("slug", u.slug)
      .eq("is_published", true);
    if (upErr) {
      console.error(`  ❌ ${u.slug}: ${upErr.message}`);
    } else {
      updated++;
      console.log(`  ✅ ${u.slug}`);
    }
  }
  console.log(`\n✅ ${updated} 件を更新しました`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });

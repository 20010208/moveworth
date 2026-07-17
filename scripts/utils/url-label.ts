/**
 * 共有ユーティリティ: URL → ラベル変換
 * generate-country-article.ts の DOMAIN_LABEL_MAP と urlToLabel を共有するための抽出版。
 * generate-study-blog.ts の injectStudyRefs でも使用する。
 */

export const DOMAIN_LABEL_MAP: Record<string, string> = {
  // AU
  "immi.homeaffairs.gov.au": "オーストラリア内務省移民局",
  "ato.gov.au": "オーストラリア税務局（ATO）",
  // BE
  "dofi.ibz.be": "ベルギー外国人局（DVZ/OE）",
  "belgium.be": "ベルギー政府公式サイト",
  "economischmigrant.be": "ベルギー経済移民情報",
  "diplomatice.belgium.be": "在日ベルギー大使館",
  "japan.diplomatie.belgium.be": "在日ベルギー大使館",
  "employment.belgium.be": "ベルギー雇用・労働省",
  "fin.belgium.be": "ベルギー財務省",
  // EE
  "politsei.ee": "エストニア警察・国境警備局",
  "workinestonia.com": "Work in Estonia",
  "smartsettlers.ee": "Smart Settlers Estonia",
  "emta.ee": "エストニア税務・関税庁（EMTA）",
  // GB
  "gov.uk": "英国政府（GOV.UK）",
  "britishcouncil.org": "ブリティッシュ・カウンシル",
  "visitbritain.com": "VisitBritain",
  "universitiesuk.ac.uk": "Universities UK",
  // TH
  "ltr.boi.go.th": "タイ投資委員会（BOI）LTR",
  "ewp.doe.go.th": "タイ雇用局（DOE）就労許可",
  "thaievisa.go.th": "タイ外務省 e-Visa",
  "www.thailandprivilege.co.th": "Thailand Privilege",
  "thailandprivilege.co.th": "Thailand Privilege",
  "rd.go.th": "タイ歳入局（Revenue Department）",
  // SG
  "mom.gov.sg": "シンガポール労働省（MOM）",
  "edb.gov.sg": "シンガポール経済開発庁（EDB）",
  "ica.gov.sg": "シンガポール移民局（ICA）",
  "iras.gov.sg": "シンガポール内国歳入庁（IRAS）",
  // US
  "uscis.gov": "米国移民局（USCIS）",
  "my.uscis.gov": "米国移民局（USCIS）myUSCIS",
  "irs.gov": "米国内国歳入庁（IRS）",
  "dhs.gov": "米国国土安全保障省（DHS）",
  "ed.gov": "米国教育省（ED）",
  "jp.usembassy.gov": "在日米国大使館",
  // MY
  "mm2h.gov.my": "マレーシア観光省 MM2H",
  "esd.imi.gov.my": "マレーシア移民局（IMI）ESD",
  "mdec.my": "マレーシアデジタル経済公社（MDEC）",
  "imigresen-online.imi.gov.my": "マレーシア移民局（IMI）オンライン",
  "imi.gov.my": "マレーシア移民局（IMI）",
  "talentcorp.com.my": "TalentCorp Malaysia",
  "hasil.gov.my": "マレーシア内国歳入庁（HASiL）",
  // PL
  "gov.pl": "ポーランド政府（GOV.PL）",
  "udsc.gov.pl": "ポーランド外国人局（UDSC）",
  "paih.gov.pl": "ポーランド投資・貿易庁（PAIH）",
  "welcomepoland.pl": "Welcome to Poland",
  "podatki.gov.pl": "ポーランド税務局",
  // Batch 2
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
  // Batch 3
  "skatteverket.se": "スウェーデン税務庁（Skatteverket）",
  "skatteetaten.no": "ノルウェー税務局（Skatteetaten）",
  "skat.dk": "デンマーク税務庁（Skattestyrelsen）",
  "portal.gov.cz": "チェコ政府ポータル（portal.gov.cz）",
  "porezna-uprava.gov.hr": "クロアチア税務局（Porezna uprava）",
  "aade.gr": "ギリシャ独立歳入庁（AADE）",
  "mtca.gov.mt": "マルタ税関歳入庁（MTCA）",
  "u.ae": "UAE政府公式ポータル（u.ae）",
  // Batch 4
  "lsth.bundesfinanzministerium.de": "ドイツ連邦財務省 所得税計算補助（Lohnsteuerhilfeverein）",
  "bundesfinanzministerium.de": "ドイツ連邦財務省（BMF）",
  "bamf.de": "ドイツ連邦移民・難民庁（BAMF）",
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
  // visa-guide 追加ドメイン
  "one.gob.es": "スペイン政府公式ポータル（Plataforma ONE）",
  "extranjeros.inclusion.gob.es": "スペイン包摂・社会保障・移住省（移民局）",
  "inclusion.gob.es": "スペイン包摂・社会保障・移住省",
  "exteriores.gob.es": "スペイン外務省領事局",
  "enterprisegreece.gov.gr": "Enterprise Greece",
  "immigration.gov.gr": "ギリシャ移民局",
  "etias.com": "ETIAS",
  "cic.gc.ca": "カナダ移民・難民・市民権省（IRCC）",
  "canada.ca": "カナダ政府（canada.ca）",
  "immigration.ca": "カナダ移民情報",
  "visaguide.world": "Visa Guide",
  "nzeta.immigration.govt.nz": "ニュージーランド移民局（INZ）",
  "immigration.govt.nz": "ニュージーランド移民局（INZ）",
  "uaevisaonline.ae": "UAE ビザオンライン",
  "icp.gov.ae": "UAE 連邦身元証明・市民権局（ICP）",
  "gdrfad.gov.ae": "ドバイ総合残留外国人局（GDRFA）",
};

/** URL → 機関ラベル（canada.ca はパスで分岐） */
export function urlToLabel(url: string): string {
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
  } catch {
    return url;
  }
}

/**
 * URL リストを参考資料の箇条書き文字列に変換する。
 * 同一ベースラベルを持つ URL が複数ある場合、パスの末尾セグメントを括弧追記して区別する。
 */
export function buildRefsLines(urls: string[]): string {
  // 1. 各 URL のベースラベルを生成
  const entries = urls.map((url) => ({ url, baseLabel: urlToLabel(url) }));

  // 2. 同一ラベルが複数あるか検出
  const labelCount: Record<string, number> = {};
  for (const { baseLabel } of entries) {
    labelCount[baseLabel] = (labelCount[baseLabel] ?? 0) + 1;
  }

  // 3. ラベル確定（重複ありなら末尾パスセグメントを付与）
  return entries
    .map(({ url, baseLabel }) => {
      let label = baseLabel;
      if (labelCount[baseLabel] > 1) {
        try {
          const segments = new URL(url).pathname.split("/").filter(Boolean);
          const suffix = segments[segments.length - 1] ?? "";
          if (suffix) label = `${baseLabel}（${suffix}）`;
        } catch { /* fallback: no suffix */ }
      }
      return `- [${label}](${url})`;
    })
    .join("\n");
}

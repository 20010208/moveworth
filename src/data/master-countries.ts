/**
 * MoveWorth マスター国リスト（PRESET基準・50カ国）
 *
 * このファイルが単一の正式な国リスト。
 * generate-country-article.ts / generate-study-blog.ts の両方がここを参照する。
 *
 * 追加・削除はここだけ変更すれば全スクリプトに反映される。
 * 新しい country は country-presets.ts にも追加が必要。
 */
export const MASTER_COUNTRIES = [
  // 優先度高（直近バッチ）
  { code: "nz", name: { ja: "ニュージーランド", en: "New Zealand" } },
  { code: "be", name: { ja: "ベルギー", en: "Belgium" } },
  { code: "tn", name: { ja: "チュニジア", en: "Tunisia" } },
  { code: "pl", name: { ja: "ポーランド", en: "Poland" } },
  { code: "ee", name: { ja: "エストニア", en: "Estonia" } },
  { code: "cy", name: { ja: "キプロス", en: "Cyprus" } },
  { code: "hr", name: { ja: "クロアチア", en: "Croatia" } },
  { code: "hu", name: { ja: "ハンガリー", en: "Hungary" } },
  { code: "ro", name: { ja: "ルーマニア", en: "Romania" } },
  { code: "fi", name: { ja: "フィンランド", en: "Finland" } },
  { code: "bg", name: { ja: "ブルガリア", en: "Bulgaria" } },
  // アジア人気圏
  { code: "my", name: { ja: "マレーシア", en: "Malaysia" } },
  { code: "th", name: { ja: "タイ", en: "Thailand" } },
  { code: "au", name: { ja: "オーストラリア", en: "Australia" } },
  { code: "us", name: { ja: "アメリカ", en: "the United States" } },
  { code: "sg", name: { ja: "シンガポール", en: "Singapore" } },
  { code: "gb", name: { ja: "イギリス", en: "the United Kingdom" } },
  // バッチ2
  { code: "nl", name: { ja: "オランダ", en: "the Netherlands" } },
  { code: "fr", name: { ja: "フランス", en: "France" } },
  { code: "it", name: { ja: "イタリア", en: "Italy" } },
  { code: "at", name: { ja: "オーストリア", en: "Austria" } },
  { code: "ie", name: { ja: "アイルランド", en: "Ireland" } },
  { code: "ca", name: { ja: "カナダ", en: "Canada" } },
  { code: "kr", name: { ja: "韓国", en: "South Korea" } },
  // バッチ3
  { code: "se", name: { ja: "スウェーデン", en: "Sweden" } },
  { code: "no", name: { ja: "ノルウェー", en: "Norway" } },
  { code: "dk", name: { ja: "デンマーク", en: "Denmark" } },
  { code: "cz", name: { ja: "チェコ", en: "the Czech Republic" } },
  { code: "gr", name: { ja: "ギリシャ", en: "Greece" } },
  { code: "mt", name: { ja: "マルタ", en: "Malta" } },
  { code: "ae", name: { ja: "アラブ首長国連邦", en: "the United Arab Emirates" } },
  // バッチ4
  { code: "de", name: { ja: "ドイツ", en: "Germany" } },
  { code: "ge", name: { ja: "ジョージア", en: "Georgia" } },
  { code: "hk", name: { ja: "香港", en: "Hong Kong" } },
  { code: "in", name: { ja: "インド", en: "India" } },
  { code: "jp", name: { ja: "日本", en: "Japan" } },
  { code: "ph", name: { ja: "フィリピン", en: "the Philippines" } },
  { code: "tw", name: { ja: "台湾", en: "Taiwan" } },
  { code: "za", name: { ja: "南アフリカ", en: "South Africa" } },
  { code: "br", name: { ja: "ブラジル", en: "Brazil" } },
  { code: "cn", name: { ja: "中国", en: "China" } },
  { code: "co", name: { ja: "コロンビア", en: "Colombia" } },
  { code: "id", name: { ja: "インドネシア", en: "Indonesia" } },
  { code: "vn", name: { ja: "ベトナム", en: "Vietnam" } },
  { code: "ar", name: { ja: "アルゼンチン", en: "Argentina" } },
  { code: "ch", name: { ja: "スイス", en: "Switzerland" } },
  { code: "pt", name: { ja: "ポルトガル", en: "Portugal" } },
  { code: "es", name: { ja: "スペイン", en: "Spain" } },
  { code: "mx", name: { ja: "メキシコ", en: "Mexico" } },
  { code: "tr", name: { ja: "トルコ", en: "Turkey" } },
] as const;

export type MasterCountry = (typeof MASTER_COUNTRIES)[number];
export type MasterCountryCode = MasterCountry["code"];

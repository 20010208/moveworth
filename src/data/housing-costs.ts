// 世帯タイプ別・国別の平均月額家賃・生活費データ（2026年2月時点、各国現地通貨・月額ベース）
// 出典: Numbeo・各国統計局・不動産サイト等を参考に作成
// ※ 各国の「外国人が多く住むエリア」を基準とした相場（全国平均ではない）

export const HOUSEHOLD_TYPES = [
  { key: "single", ja: "単身（1人）",    en: "Single",        zh: "单身（1人）" },
  { key: "couple", ja: "2人暮らし",      en: "Couple (2)",    zh: "两人同住"   },
  { key: "family", ja: "4人家族",        en: "Family of 4",   zh: "四口之家"   },
] as const;

export type HouseholdType = typeof HOUSEHOLD_TYPES[number]["key"];

// 月額・現地通貨（rent: 家賃, living: 生活費）
// 各国の外国人居住者が多いエリア基準（例: KL→Mont Kiara/Bangsar、東京→新宿/渋谷/港区、バンコク→スクンビット 等）
export const HOUSING_COSTS: Record<string, Record<HouseholdType, { rent: number; living: number }>> = {
  JP: { // 東京（新宿・渋谷・港区）
    single: { rent:  90000, living: 100000 },
    couple: { rent: 130000, living: 170000 },
    family: { rent: 180000, living: 280000 },
  },
  SG: { // オーチャード・ホランドビレッジ・ブオナビスタ
    single: { rent:  2800, living:  1500 },
    couple: { rent:  4500, living:  2500 },
    family: { rent:  7000, living:  4000 },
  },
  MY: { // クアラルンプール（Mont Kiara・Bangsar）
    single: { rent:  3000, living:  2650 },
    couple: { rent:  5000, living:  4500 },
    family: { rent:  6500, living:  8000 },
  },
  TH: { // バンコク（スクンビット・シーロム・サートーン）
    single: { rent:  18000, living:  15000 },
    couple: { rent:  30000, living:  25000 },
    family: { rent:  45000, living:  42000 },
  },
  KR: { // ソウル（梨泰院・龍山・麻浦）
    single: { rent:  800000, living:   900000 },
    couple: { rent: 1300000, living:  1400000 },
    family: { rent: 2000000, living:  2500000 },
  },
  TW: { // 台北（大安・信義）
    single: { rent:  18000, living:  18000 },
    couple: { rent:  28000, living:  28000 },
    family: { rent:  45000, living:  50000 },
  },
  HK: { // Mid-Levels・湾仔
    single: { rent:  18000, living:  12000 },
    couple: { rent:  28000, living:  18000 },
    family: { rent:  42000, living:  30000 },
  },
  ID: { // ジャカルタ（Kemang・Menteng・スディルマン）
    single: { rent:  6000000, living:  5000000 },
    couple: { rent: 10000000, living:  8000000 },
    family: { rent: 15000000, living: 15000000 },
  },
  PH: { // マニラ（BGC・マカティ）
    single: { rent:  25000, living:  20000 },
    couple: { rent:  40000, living:  32000 },
    family: { rent:  65000, living:  55000 },
  },
  VN: { // ホーチミン（Thao Dien・District 2）
    single: { rent: 12000000, living:  8000000 },
    couple: { rent: 18000000, living: 13000000 },
    family: { rent: 28000000, living: 22000000 },
  },
  US: { // ニューヨーク・ロサンゼルス・サンフランシスコ
    single: { rent:  2800, living:  1800 },
    couple: { rent:  4200, living:  2800 },
    family: { rent:  6000, living:  4500 },
  },
  CA: { // トロント・バンクーバー
    single: { rent:  2500, living:  1500 },
    couple: { rent:  3800, living:  2400 },
    family: { rent:  5500, living:  3800 },
  },
  GB: { // ロンドン（Kensington・Notting Hill・Islington）
    single: { rent:  2000, living:  1200 },
    couple: { rent:  3200, living:  2000 },
    family: { rent:  4800, living:  3200 },
  },
  DE: { // ミュンヘン（Schwabing・Maxvorstadt）
    single: { rent:  1500, living:  1000 },
    couple: { rent:  2200, living:  1600 },
    family: { rent:  3200, living:  2800 },
  },
  FR: { // パリ（Marais・Saint-Germain）
    single: { rent:  1600, living:  1000 },
    couple: { rent:  2500, living:  1600 },
    family: { rent:  3500, living:  2800 },
  },
  NL: { // アムステルダム（Jordaan・Oud-Zuid）
    single: { rent:  1800, living:  1100 },
    couple: { rent:  2800, living:  1800 },
    family: { rent:  4000, living:  2800 },
  },
  CH: { // チューリッヒ・ジュネーブ
    single: { rent:  2500, living:  2000 },
    couple: { rent:  3500, living:  3000 },
    family: { rent:  5000, living:  5000 },
  },
  AU: { // シドニー・メルボルン（CBD・インナーサバーブ）
    single: { rent:  2500, living:  1500 },
    couple: { rent:  3800, living:  2400 },
    family: { rent:  5500, living:  3800 },
  },
  NZ: { // オークランド（Ponsonby・Parnell）
    single: { rent:  2200, living:  1400 },
    couple: { rent:  3200, living:  2200 },
    family: { rent:  4500, living:  3600 },
  },
  AE: { // ドバイ（Marina・Downtown・JBR）
    single: { rent:  7000, living:  4000 },
    couple: { rent: 11000, living:  6500 },
    family: { rent: 16000, living: 10000 },
  },
  PT: { // リスボン（Príncipe Real・Chiado）
    single: { rent:  1300, living:   800 },
    couple: { rent:  1900, living:  1300 },
    family: { rent:  2800, living:  2200 },
  },
  ES: { // マドリード・バルセロナ（Malasaña・Eixample）
    single: { rent:  1300, living:   800 },
    couple: { rent:  2000, living:  1300 },
    family: { rent:  3000, living:  2200 },
  },
  GE: { // トビリシ（Vake・Saburtalo）
    single: { rent:  1500, living:  1000 },
    couple: { rent:  2200, living:  1600 },
    family: { rent:  3200, living:  2800 },
  },
  IE: { // ダブリン（D4・D6）
    single: { rent:  2200, living:  1400 },
    couple: { rent:  3200, living:  2200 },
    family: { rent:  4500, living:  3600 },
  },
  SE: { // ストックホルム（Östermalm・Södermalm）
    single: { rent: 14000, living: 10000 },
    couple: { rent: 20000, living: 16000 },
    family: { rent: 28000, living: 27000 },
  },
  NO: { // オスロ（Frogner・Grünerløkka）
    single: { rent: 17000, living: 13000 },
    couple: { rent: 24000, living: 20000 },
    family: { rent: 35000, living: 35000 },
  },
  DK: { // コペンハーゲン（Frederiksberg・Østerbro）
    single: { rent: 13000, living: 10000 },
    couple: { rent: 18000, living: 15000 },
    family: { rent: 25000, living: 25000 },
  },
  BR: { // サンパウロ（Jardins・Itaim Bibi）
    single: { rent:  3500, living:  2500 },
    couple: { rent:  5500, living:  3800 },
    family: { rent:  8000, living:  6500 },
  },
  CO: { // ボゴタ（Chapinero・Zona Rosa）
    single: { rent: 2000000, living: 1500000 },
    couple: { rent: 3200000, living: 2300000 },
    family: { rent: 5000000, living: 4000000 },
  },
  GR: { // アテネ（Kolonaki・Glyfada）
    single: { rent:   900, living:   700 },
    couple: { rent:  1300, living:  1100 },
    family: { rent:  2000, living:  1900 },
  },
  IT: { // ミラノ（Brera・Navigli）
    single: { rent:  1400, living:  1000 },
    couple: { rent:  2100, living:  1600 },
    family: { rent:  3000, living:  2700 },
  },
  MT: { // スリーマ・セントジュリアンズ
    single: { rent:  1100, living:   800 },
    couple: { rent:  1700, living:  1200 },
    family: { rent:  2500, living:  2100 },
  },
  ZA: { // ケープタウン（Atlantic Seaboard）・サンドトン
    single: { rent: 14000, living:  9000 },
    couple: { rent: 22000, living: 14000 },
    family: { rent: 32000, living: 25000 },
  },
  FI: { // ヘルシンキ（Eira・Ullanlinna）
    single: { rent:  1200, living:   900 },
    couple: { rent:  1800, living:  1400 },
    family: { rent:  2700, living:  2500 },
  },
  AT: { // ウィーン（1区・Leopoldstadt・Neubau）
    single: { rent:  1300, living:  1000 },
    couple: { rent:  1900, living:  1600 },
    family: { rent:  2800, living:  2600 },
  },
  CZ: { // プラハ（Vinohrady・Žižkov）
    single: { rent: 22000, living: 15000 },
    couple: { rent: 34000, living: 23000 },
    family: { rent: 50000, living: 40000 },
  },
  CN: { // 上海・北京（French Concession・三里屯）
    single: { rent:  8000, living:  6500 },
    couple: { rent: 13000, living: 10000 },
    family: { rent: 20000, living: 17000 },
  },
  IN: { // ムンバイ・デリー（Bandra・South Mumbai・GK）
    single: { rent:  50000, living:  30000 },
    couple: { rent:  80000, living:  50000 },
    family: { rent: 120000, living:  85000 },
  },
  MX: { // メキシコシティ（Condesa・Roma・Polanco）
    single: { rent: 18000, living: 12000 },
    couple: { rent: 28000, living: 18000 },
    family: { rent: 42000, living: 28000 },
  },
  AR: { // ブエノスアイレス（Palermo・Recoleta）
    single: { rent: 400000, living: 350000 },
    couple: { rent: 650000, living: 550000 },
    family: { rent: 950000, living: 950000 },
  },
};

// 世帯タイプ別・国別の平均月額家賃・生活費データ（2026年2月時点、各国現地通貨・月額ベース）
// 出典: Numbeo・各国統計局・不動産サイト等を参考に作成

export const HOUSEHOLD_TYPES = [
  { key: "single", ja: "単身（1人）",    en: "Single",        zh: "单身（1人）" },
  { key: "couple", ja: "2人暮らし",      en: "Couple (2)",    zh: "两人同住"   },
  { key: "family", ja: "4人家族",        en: "Family of 4",   zh: "四口之家"   },
] as const;

export type HouseholdType = typeof HOUSEHOLD_TYPES[number]["key"];

// 月額・現地通貨（rent: 家賃, living: 生活費）
export const HOUSING_COSTS: Record<string, Record<HouseholdType, { rent: number; living: number }>> = {
  JP: {
    single: { rent:  70000, living:  80000 },
    couple: { rent: 100000, living: 130000 },
    family: { rent: 130000, living: 220000 },
  },
  SG: {
    single: { rent:  1800, living:  1200 },
    couple: { rent:  2800, living:  2000 },
    family: { rent:  4000, living:  3500 },
  },
  MY: {
    single: { rent:  3000, living:  2650 },
    couple: { rent:  4000, living:  4000 },
    family: { rent:  5000, living:  6500 },
  },
  TH: {
    single: { rent:   8000, living:  12000 },
    couple: { rent:  14000, living:  20000 },
    family: { rent:  22000, living:  35000 },
  },
  KR: {
    single: { rent:  600000, living:   700000 },
    couple: { rent:  900000, living:  1100000 },
    family: { rent: 1400000, living:  1900000 },
  },
  TW: {
    single: { rent:  12000, living:  15000 },
    couple: { rent:  18000, living:  25000 },
    family: { rent:  25000, living:  42000 },
  },
  HK: {
    single: { rent:  10000, living:   8000 },
    couple: { rent:  15000, living:  13000 },
    family: { rent:  22000, living:  22000 },
  },
  ID: {
    single: { rent:  3500000, living:  4000000 },
    couple: { rent:  5500000, living:  6500000 },
    family: { rent:  8000000, living: 12000000 },
  },
  PH: {
    single: { rent:  12000, living:  15000 },
    couple: { rent:  18000, living:  25000 },
    family: { rent:  28000, living:  45000 },
  },
  VN: {
    single: { rent:  5000000, living:  6000000 },
    couple: { rent:  8000000, living: 10000000 },
    family: { rent: 12000000, living: 18000000 },
  },
  US: {
    single: { rent:  1500, living:  1200 },
    couple: { rent:  2200, living:  2000 },
    family: { rent:  3000, living:  3500 },
  },
  CA: {
    single: { rent:  1600, living:  1200 },
    couple: { rent:  2300, living:  2000 },
    family: { rent:  3200, living:  3500 },
  },
  GB: {
    single: { rent:  1200, living:   900 },
    couple: { rent:  1800, living:  1500 },
    family: { rent:  2400, living:  2600 },
  },
  DE: {
    single: { rent:   900, living:   800 },
    couple: { rent:  1400, living:  1300 },
    family: { rent:  1900, living:  2300 },
  },
  FR: {
    single: { rent:   900, living:   800 },
    couple: { rent:  1400, living:  1300 },
    family: { rent:  1900, living:  2200 },
  },
  NL: {
    single: { rent:  1200, living:   900 },
    couple: { rent:  1700, living:  1500 },
    family: { rent:  2300, living:  2500 },
  },
  CH: {
    single: { rent:  1800, living:  1500 },
    couple: { rent:  2600, living:  2400 },
    family: { rent:  3500, living:  4200 },
  },
  AU: {
    single: { rent:  1800, living:  1200 },
    couple: { rent:  2600, living:  2000 },
    family: { rent:  3400, living:  3500 },
  },
  NZ: {
    single: { rent:  1600, living:  1100 },
    couple: { rent:  2300, living:  1800 },
    family: { rent:  3000, living:  3200 },
  },
  AE: {
    single: { rent:  4000, living:  3000 },
    couple: { rent:  6000, living:  5000 },
    family: { rent:  9000, living:  8500 },
  },
};

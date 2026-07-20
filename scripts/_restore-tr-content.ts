/**
 * visa-tr コンテンツ統合復元スクリプト
 * 新ドラフト（2025税率正確）の税率セクション ＋
 * 旧公開版（ベースラインキャプチャ）の詳細セクション を統合する。
 * is_published は変更しない（draft のまま）。
 */
import { existsSync, readFileSync } from "fs";
if (existsSync(".env.local")) {
  for (const l of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = l.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(); if (!(k in process.env)) process.env[k] = t.slice(eq + 1).trim();
  }
}
import { createClient } from "@supabase/supabase-js";
import { assertBlogPayload } from "./utils/validate-blog-payload.js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// =========================================================
// JA: 新税率ブラケット（GIB CDN PDF 2025年度確認済み）
// =========================================================
const TAX_SECTION_JA = `### 税制の詳細

**個人所得税（Gelir Vergisi）累進税率**

| 課税所得（TRY） | 税率 |
|-------------|------|
| 0〜158,000 | 15% |
| 158,001〜330,000 | 20% |
| 330,001〜800,000 | 27% |
| 800,001〜4,300,000 | 35% |
| 4,300,001以上 | **40%** |

- **居住者判定**：暦年内に183日以上トルコに滞在した場合、全世界所得に課税
- **非居住者**：トルコ国内源泉所得のみ課税
- 給与所得控除・最低生活費控除等の所得控除制度あり
- ※給与所得（ücret gelirleri）は27%ブラケットが330,001〜1,200,000 TRY、35%ブラケットが1,200,001〜4,300,000 TRYに拡大適用される
- 2025年所得適用（ソース：GIB 2025 Gelir Vergisi Tarifesi公式PDF）`;

// =========================================================
// 旧公開版ベースラインから回収した詳細セクション（JA）
// =========================================================
const SGK_SECTION_JA = `### 社会保険（SGK：社会保険公団）

| 種別 | 従業員負担 | 雇用主負担 |
|------|---------|---------|
| 年金・障害・遺族保険 | 9% | 11% |
| 健康保険 | 5% | 7.5% |
| 失業保険 | 1% | 2% |
| 合計 | **14%** | **20.5%** |

短期居住許可保有者（就労なし）は就労開始まで民間医療保険が必須。`;

const RENT_SECTION_JA = `### 外国人居住エリアの家賃相場（2026年）

※トルコリラの変動により、外国人向け物件はUSD建て表示が多い。

| エリア | 物件タイプ | 月額賃料（USD） |
|--------|-----------|-------------|
| イスタンブール ニシャンタシュ（ヨーロッパ側高級） | 2BR | USD 500〜900 |
| イスタンブール ベシクタシュ/シシリ | 2BR | USD 400〜750 |
| イスタンブール カドゥキョイ（アジア側・若者） | 2BR | USD 350〜650 |
| アンタルヤ市内（ビーチリゾート） | 2BR | USD 300〜600 |
| イズミル市内（エーゲ海） | 2BR | USD 280〜520 |

イスタンブールのニシャンタシュ・ベシクタシュはヨーロッパ側の高級住宅地で外国人居住者が多い。カドゥキョイはアジア側で物価が安く英語コミュニティも活発。アンタルヤ・イズミルはイスタンブールより生活費が30〜40%安い。`;

const FEES_SECTION_JA = `### 費用一覧

| 項目 | 費用 |
|------|------|
| e-Visa（オンライン取得） | USD 51 |
| 短期居住許可申請費 | 約TRY 1,500〜3,000 |
| 就労許可申請費 | 約TRY 5,000〜8,000 |
| 長期居住許可申請費 | 約TRY 3,000〜5,000 |
| 国籍取得（不動産投資） | USD 400,000以上（不動産代金） |`;

const LIVING_COST_SECTION_JA = `### 月別生活費の目安（イスタンブール）

| 項目 | 月額（USD） |
|------|-----------|
| 家賃（2BR・外国人エリア） | USD 400〜800 |
| 食費（自炊＋外食） | USD 200〜350 |
| 交通費 | USD 30〜60 |
| 光熱費・通信 | USD 50〜100 |
| **合計** | **USD 700〜1,300** |

日本と比べて生活費が約3〜5割安く、特に食費・外食費の安さが際立ちます。`;

const CHECKLIST_SECTION_JA = `### 移住前チェックリスト

1. **居住許可の期限管理**：短期居住許可の失効後も滞在すると罰金・出国禁止・強制退去のリスク。更新は少なくとも1ヶ月前から着手
2. **為替リスクへの対応**：トルコリラは高インフレを背景に継続的に下落する傾向。収入・貯蓄はUSDまたはEURで保管することを強く推奨
3. **民間医療保険の手配**：短期居住許可の申請要件として、トルコ国内で有効な民間医療保険（例：AXA Turkey・Cigna Turkey等）の加入証明が必要。就労許可取得後はSGKに加入可
4. **住民登録（İkametgah）**：居住許可取得後に市役所（Nüfus Müdürlüğü）で住所登録を行うことで、銀行口座開設や税務手続きが円滑に
5. **外国人向け不動産購入の確認**：日本国籍者は原則制限なくトルコの不動産を購入可能。投資国籍を目指す場合は、物件の「適格性証明書（TOKI等認定）」の取得が必要な点に注意`;

const REFS_JA = `---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **在留許可（e-ikamet）オンライン申請**: [トルコ出入国管理局 – e-ikamet ポータル](https://e-ikamet.goc.gov.tr/)
- **トルコ政府公式サービス**: [e-Devlet（トルコ電子政府ポータル）](https://www.turkiye.gov.tr/)
- **国籍取得（市民権投資）**: [トルコ投資局 – 投資による市民権プログラム](https://www.invest.gov.tr/en/)`;

// =========================================================
// EN: 2025税率 ＋ 旧詳細セクション
// =========================================================
const TAX_SECTION_EN = `### Tax System

**Personal Income Tax (Gelir Vergisi) — Progressive Rates**

| Taxable Income (TRY) | Rate |
|---------------------|------|
| 0–158,000 | 15% |
| 158,001–330,000 | 20% |
| 330,001–800,000 | 27% |
| 800,001–4,300,000 | 35% |
| Above 4,300,001 | **40%** |

- **Tax residency**: Those who stay in Turkey for 183+ days in a calendar year are taxed on worldwide income
- **Non-residents**: Taxed only on Turkish-sourced income
- Various deductions available including employment income deduction and basic living allowance
- *Note for salary income (ücret gelirleri)*: The 27% bracket extends to 1,200,000 TRY; the 35% bracket applies from 1,200,001–4,300,000 TRY
- Applicable to 2025 income (Source: GIB 2025 Gelir Vergisi Tarifesi official PDF)`;

const SGK_SECTION_EN = `### Social Security (SGK: Social Security Institution)

| Type | Employee | Employer |
|------|----------|----------|
| Pension / Disability / Survivors | 9% | 11% |
| Health Insurance | 5% | 7.5% |
| Unemployment Insurance | 1% | 2% |
| **Total** | **14%** | **20.5%** |

Short-term residence permit holders (not working) must maintain private health insurance until obtaining a work permit.`;

const RENT_SECTION_EN = `### Rental Market for Foreign Residents (2026)

*Due to Turkish lira volatility, many listings for foreigners are denominated in USD.*

| Area | Type | Monthly Rent (USD) |
|------|------|--------------------|
| Istanbul Nişantaşı (European side, upscale) | 2BR | USD 500–900 |
| Istanbul Beşiktaş / Şişli | 2BR | USD 400–750 |
| Istanbul Kadıköy (Asian side, youth-friendly) | 2BR | USD 350–650 |
| Antalya city center (beach resort) | 2BR | USD 300–600 |
| İzmir city center (Aegean coast) | 2BR | USD 280–520 |

Nişantaşı and Beşiktaş on the European side are upscale residential areas popular with expats. Kadıköy on the Asian side offers lower costs and an active English-speaking community. Antalya and İzmir are 30–40% cheaper than Istanbul.`;

const FEES_SECTION_EN = `### Cost Summary

| Item | Cost |
|------|------|
| e-Visa (online) | USD 51 |
| Short-term residence permit | ~TRY 1,500–3,000 |
| Work permit | ~TRY 5,000–8,000 |
| Long-term residence permit | ~TRY 3,000–5,000 |
| Citizenship (real estate investment) | USD 400,000+ (property price) |`;

const LIVING_COST_SECTION_EN = `### Estimated Monthly Living Costs (Istanbul)

| Item | Monthly (USD) |
|------|--------------|
| Rent (2BR, expat area) | USD 400–800 |
| Food (groceries + dining) | USD 200–350 |
| Transportation | USD 30–60 |
| Utilities & internet | USD 50–100 |
| **Total** | **USD 700–1,300** |

Compared to Japan, living costs are roughly 30–50% lower, especially for food and dining out.`;

const CHECKLIST_SECTION_EN = `### Pre-Move Checklist

1. **Residence permit deadline management**: Overstaying after permit expiry risks fines, exit bans, and deportation. Start renewal at least one month before expiry
2. **Manage currency risk**: The Turkish lira has been declining steadily due to high inflation. Keep income and savings in USD or EUR
3. **Private health insurance**: Required for short-term residence permit applications — must be valid within Turkey (e.g. AXA Turkey, Cigna Turkey). After obtaining a work permit, you can enroll in SGK
4. **Residence registration (İkametgah)**: After getting your permit, register your address at the local civil registry office (Nüfus Müdürlüğü). This simplifies bank account opening and tax procedures
5. **Foreign property ownership**: Japanese nationals can generally purchase Turkish real estate without restriction. For citizenship-by-investment, verify that the property holds an eligibility certificate (TOKI-certified or equivalent)`;

const REFS_EN = `---

### References

This article is based on the following official sources.

- **Residence Permit (e-ikamet) Online Application**: [Turkish Directorate General of Migration Management – e-ikamet Portal](https://e-ikamet.goc.gov.tr/)
- **Turkish Government Official Services**: [e-Devlet (Turkish e-Government Portal)](https://www.turkiye.gov.tr/)
- **Citizenship by Investment**: [Invest in Turkey – Citizenship by Investment Program](https://www.invest.gov.tr/en/)`;

// =========================================================
// ZH: 2025税率 ＋ 旧詳細セクション
// =========================================================
const TAX_SECTION_ZH = `### 税制详解

**个人所得税（Gelir Vergisi）累进税率**

| 应税收入（TRY） | 税率 |
|-------------|------|
| 0〜158,000 | 15% |
| 158,001〜330,000 | 20% |
| 330,001〜800,000 | 27% |
| 800,001〜4,300,000 | 35% |
| 4,300,001以上 | **40%** |

- **税务居民认定**：一个日历年内在土耳其居住183天以上者，就全球所得纳税
- **非居民**：仅就土耳其来源所得纳税
- 可享受就业所得扣除、基本生活费扣除等多种扣除
- ※工资所得（ücret gelirleri）：27%档适用至1,200,000 TRY，35%档适用至1,200,001〜4,300,000 TRY
- 适用于2025年所得（来源：GIB 2025 Gelir Vergisi Tarifesi官方PDF）`;

const SGK_SECTION_ZH = `### 社会保险（SGK：社会保障机构）

| 险种 | 雇员负担 | 雇主负担 |
|------|---------|---------|
| 养老/残障/遗属保险 | 9% | 11% |
| 医疗保险 | 5% | 7.5% |
| 失业保险 | 1% | 2% |
| **合计** | **14%** | **20.5%** |

持短期居留许可（未就业）者在取得工作许可前须购买私人医疗保险。`;

const RENT_SECTION_ZH = `### 外籍人士居住区租金行情（2026年）

※由于土耳其里拉汇率波动，面向外籍人士的房源通常以美元报价。

| 地区 | 户型 | 月租（USD） |
|------|------|-----------|
| 伊斯坦布尔 Nişantaşı（欧洲区高档） | 2居室 | USD 500〜900 |
| 伊斯坦布尔 Beşiktaş / Şişli | 2居室 | USD 400〜750 |
| 伊斯坦布尔 Kadıköy（亚洲区·年轻人聚集） | 2居室 | USD 350〜650 |
| 安塔利亚市区（海滨度假区） | 2居室 | USD 300〜600 |
| 伊兹密尔市区（爱琴海沿岸） | 2居室 | USD 280〜520 |

欧洲区的Nişantaşı和Beşiktaş是外籍人士聚居的高档住宅区；亚洲区的Kadıköy物价较低，英语社群活跃。安塔利亚和伊兹密尔的生活成本比伊斯坦布尔低30〜40%。`;

const FEES_SECTION_ZH = `### 费用一览

| 项目 | 费用 |
|------|------|
| 电子签证（e-Visa，在线申请） | USD 51 |
| 短期居留许可申请费 | 约TRY 1,500〜3,000 |
| 工作许可申请费 | 约TRY 5,000〜8,000 |
| 长期居留许可申请费 | 约TRY 3,000〜5,000 |
| 入籍（房产投资） | USD 40万以上（房产价格） |`;

const LIVING_COST_SECTION_ZH = `### 月生活费参考（伊斯坦布尔）

| 项目 | 月费（USD） |
|------|-----------|
| 房租（2居室·外籍人士区） | USD 400〜800 |
| 餐饮（自炊+外食） | USD 200〜350 |
| 交通 | USD 30〜60 |
| 水电网络 | USD 50〜100 |
| **合计** | **USD 700〜1,300** |

与日本相比，生活成本约低30〜50%，尤其餐饮费用优势明显。`;

const CHECKLIST_SECTION_ZH = `### 移居前核查清单

1. **居留许可到期管理**：逾期居留面临罚款、禁止出境乃至驱逐出境风险。请至少提前一个月启动续签手续
2. **外汇风险应对**：土耳其里拉因高通胀持续贬值，建议将收入和储蓄保存为美元或欧元
3. **私人医疗保险**：申请短期居留许可须提供在土耳其境内有效的私人医疗保险证明（如AXA Turkey、Cigna Turkey等）。取得工作许可后可加入SGK
4. **居民登记（İkametgah）**：取得居留许可后，前往当地户籍办公室（Nüfus Müdürlüğü）进行地址登记，有助于开立银行账户及处理税务事宜
5. **外籍人士购房确认**：日本国籍人士原则上可自由购买土耳其不动产。以投资入籍为目标时，需确认房产持有"资质证明书"（TOKI认证等）`;

const REFS_ZH = `---

### 参考资料

本文信息基于以下官方资料整理。

- **居留许可（e-ikamet）在线申请**: [土耳其移民局 – e-ikamet 门户](https://e-ikamet.goc.gov.tr/)
- **土耳其政府官方服务**: [e-Devlet（土耳其电子政务门户）](https://www.turkiye.gov.tr/)
- **投资入籍**: [投资土耳其 – 投资入籍项目](https://www.invest.gov.tr/en/)`;

// =========================================================
// メイン処理
// =========================================================
async function main() {
  console.log("=== visa-tr コンテンツ統合復元 ===\n");

  // 現在のドラフトを取得
  const { data, error } = await sb
    .from("blog_posts")
    .select("slug, is_published, content, title, description")
    .eq("slug", "visa-tr")
    .single();

  if (error || !data) {
    console.error("取得エラー:", error?.message);
    process.exit(1);
  }

  console.log(`現在の visa-tr: is_published=${data.is_published}`);
  const currentContent = data.content as Record<string, string>;

  // 現在のドラフトのイントロ＋ビザ種類セクションを抽出
  function extractIntroAndVisaTypes(text: string): string {
    // "### 生活・税金について" または "### 税制" の前までを抽出
    const cutMarker = /\n### (生活|税制|Tax|Resumen)/;
    const m = text.match(cutMarker);
    if (m && m.index !== undefined) {
      return text.slice(0, m.index).trim();
    }
    // fallback: 先頭800文字
    return text.slice(0, 800);
  }

  const introJA = extractIntroAndVisaTypes(currentContent.ja || "");
  const introEN = extractIntroAndVisaTypes(currentContent.en || "");
  const introZH = extractIntroAndVisaTypes(currentContent.zh || "");

  console.log(`イントロ部分: ja=${introJA.length}chars, en=${introEN.length}chars, zh=${introZH.length}chars`);

  // 統合コンテンツ構築
  const SIMULATOR_LINK_JA = "\n\nMoveWorthでトルコの生活費・税負担をシミュレーションしてみましょう。";
  const SIMULATOR_LINK_EN = "\n\nSimulate your Turkey living costs and tax burden with MoveWorth.";
  const SIMULATOR_LINK_ZH = "\n\n使用MoveWorth模拟您在土耳其的生活成本与税务负担。";

  const newJA = [
    introJA,
    "",
    TAX_SECTION_JA,
    "",
    SGK_SECTION_JA,
    "",
    RENT_SECTION_JA,
    "",
    FEES_SECTION_JA,
    "",
    LIVING_COST_SECTION_JA,
    "",
    CHECKLIST_SECTION_JA,
    SIMULATOR_LINK_JA,
    "",
    REFS_JA,
  ].join("\n");

  const newEN = [
    introEN,
    "",
    TAX_SECTION_EN,
    "",
    SGK_SECTION_EN,
    "",
    RENT_SECTION_EN,
    "",
    FEES_SECTION_EN,
    "",
    LIVING_COST_SECTION_EN,
    "",
    CHECKLIST_SECTION_EN,
    SIMULATOR_LINK_EN,
    "",
    REFS_EN,
  ].join("\n");

  const newZH = [
    introZH,
    "",
    TAX_SECTION_ZH,
    "",
    SGK_SECTION_ZH,
    "",
    RENT_SECTION_ZH,
    "",
    FEES_SECTION_ZH,
    "",
    LIVING_COST_SECTION_ZH,
    "",
    CHECKLIST_SECTION_ZH,
    SIMULATOR_LINK_ZH,
    "",
    REFS_ZH,
  ].join("\n");

  console.log(`\n統合後: ja=${newJA.length}chars, en=${newEN.length}chars, zh=${newZH.length}chars`);

  // バリデーション
  assertBlogPayload(
    { title: data.title, description: data.description, content: { ja: newJA, en: newEN, zh: newZH }, locales: ["ja", "en", "zh"] },
    "visa-tr"
  );

  // DB 更新（is_published は変更しない）
  const newContent = { ...currentContent, ja: newJA, en: newEN, zh: newZH };
  const { error: updateErr } = await sb
    .from("blog_posts")
    .update({ content: newContent })
    .eq("slug", "visa-tr");

  if (updateErr) {
    console.error("UPDATE エラー:", updateErr.message);
    process.exit(1);
  }

  console.log("\n✅ visa-tr 統合復元完了（is_published=false のまま）");
  console.log("次のステップ: 全文レビュー → 承認 → --publish-only");
}

main().catch(e => { console.error(e); process.exit(1); });

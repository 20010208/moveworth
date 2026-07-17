import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const REF = `### 参考資料
本記事の情報は以下の公式資料をもとに作成しています。
- [ベトナム出入国管理局](https://immigration.gov.vn)
- [ベトナム電子ビザ（e-Visa）ポータル](https://evisa.gov.vn)
- [ベトナム財務省 NIFポータル（個人所得税）](https://nif.mof.gov.vn/hoidapcstc/home/cthoidap/159079)
- [ベトナム出入国管理局（手続き）](https://xuatnhapcanh.gov.vn/en/tin-tuc/procedures-temporary-residence-cards-foreigners-vietnam-immigration-department-ministry)`;

const REF_EN = `### References
Information in this article is based on the following official sources.
- [Vietnam Immigration Department](https://immigration.gov.vn)
- [Vietnam e-Visa Portal](https://evisa.gov.vn)
- [Vietnam Ministry of Finance NIF Portal (Personal Income Tax)](https://nif.mof.gov.vn/hoidapcstc/home/cthoidap/159079)
- [Vietnam Immigration Department – Temporary Residence Procedures](https://xuatnhapcanh.gov.vn/en/tin-tuc/procedures-temporary-residence-cards-foreigners-vietnam-immigration-department-ministry)`;

const REF_ZH = `### 参考资料
本文信息基于以下官方资料。
- [越南出入境管理局](https://immigration.gov.vn)
- [越南电子签证（e-Visa）门户](https://evisa.gov.vn)
- [越南财政部NIFPortal（个人所得税）](https://nif.mof.gov.vn/hoidapcstc/home/cthoidap/159079)
- [越南出入境管理局（临时居留手续）](https://xuatnhapcanh.gov.vn/en/tin-tuc/procedures-temporary-residence-cards-foreigners-vietnam-immigration-department-ministry)`;

const ja = `ベトナムはその美しい自然と急速な経済成長により、多くの外国人にとって魅力的な移住先となっています。電子ビザ（e-Visa）の整備やIT・製造業における外国人材需要の高まりを背景に、長期滞在・就労を目指す日本人も増加しています。

### ベトナム電子ビザ（e-Visa）・長期ビザ・就労許可とは
ベトナムの電子ビザ（e-Visa）は、オンラインで申請できる最長90日間の短期滞在ビザです。観光・商用・知人訪問など多目的に利用でき、2023年以降は滞在期間が延長されました。長期滞在・就労を希望する場合は、就労許可（Work Permit）と一時居住証（Temporary Residence Card / TRC）が主な手段となります。就労許可はベトナム国内の雇用主による申請が原則です。

### 申請資格・取得条件
- **電子ビザ（e-Visa）**
  - 有効なパスポート（残存有効期間6ヶ月以上推奨）
  - ベトナム政府指定の対象国籍（90カ国以上）
- **就労許可（Work Permit）**
  - ベトナム国内の雇用主による申請代行が必要
  - 専門的な技能・資格等（具体的な要件は業種・職種により異なるため、雇用主またはベトナム労働省（DOLISA）にご確認ください）
  - 必要書類（無犯罪証明書・健康診断書等）は窓口で個別確認
- **一時居住証（TRC）**
  - 就労許可取得後に申請可能
  - 最長2年（更新可能）

### 申請費用の内訳
| 項目 | 費用 |
|------|------|
| 電子ビザ（e-Visa）申請料 | 公式サイト（evisa.gov.vn）でご確認ください |
| 一時居住証（1〜2年有効） | US$145 |
| 一時居住証（2〜5年有効） | US$155 |
| 就労許可申請（雇用主負担） | 公式窓口でご確認ください |

### 申請の流れ（ステップ別）
1. **e-Visa申請（入国前）**: evisa.gov.vnで申請、通常3〜5営業日で発行
2. **入国・内定確保**: e-Visaで入国し、現地就職活動または雇用確定
3. **書類準備**: 大学卒業証明・無犯罪証明・健康診断書を公証付き翻訳で用意
4. **雇用主による申請**: ベトナムの雇用主が省・市の労働局（DOLISA）へ就労許可を申請
5. **就労許可取得**: 書類完備の場合、通常15〜20営業日
6. **一時居住証（TRC）申請**: 就労許可取得後、出入国管理局へ申請
7. **TRC発行・長期滞在開始**: 最長2年の一時居住証が交付、更新可能

### ビザ取得後の権利と制限
- **就労**: 就労許可に記載された職種・雇用主のもとで合法的に就労可能
- **不動産購入**: 外国人は区分所有権（コンドミニアム等）を最長50年保有可能
- **家族帯同**: 配偶者・扶養家族の帯同ビザ（DV）申請が可能
- **銀行口座**: TRC保有者は現地銀行口座の開設が可能
- **更新**: 就労許可・TRCともに期限前に同条件で更新可能

### 生活費と税金の目安
主要都市（ホーチミン市・ハノイ）での家賃は月額約500〜1,500米ドル（ワンルーム〜2LDK相当）、食費・交通費を含めた生活費は月額約800〜2,000米ドルが目安です。

**個人所得税（法律109/2025/QH15 第9条 — 5段階累進課税）**

2026年から新しい5段階累進課税が適用されます。月次課税所得（各種所得控除適用後）に対する税率は以下のとおりです。

| 月次課税所得（VND） | 税率 |
|---|---|
| 1,000万以下 | 5% |
| 1,000万超〜3,000万 | 10% |
| 3,000万超〜6,000万 | 20% |
| 6,000万超〜1億 | 30% |
| 1億超 | 35% |

> **施行日の注意**: 法律全体の一般施行日は**2026年7月1日**（第29条第1項）。給与・賃金に対する税率は「2026年課税年度から」（第29条第2項）とされており、**2026年課税年度（1月1日〜）から適用**されます。
> 出典: ベトナム財務省 NIFポータル（法律109/2025/QH15 第9条・第29条確認済み）

### 申請前に確認すべきポイント
1. **e-Visaの対象国籍確認**: evisa.gov.vnで最新の対象国リストを確認すること
2. **書類の公証翻訳**: 就労許可申請書類は越語翻訳+公証が必要なケースがある（雇用主・窓口に確認）
3. **雇用主の関与が必須**: 就労許可は雇用主が申請する制度のため、内定確保が最優先
4. **施行日に注意**: 2026年の新税率は給与所得について**2026年課税年度（1月1日〜）から適用**
5. **最新情報の確認**: 出入国管理局（immigration.gov.vn）で随時最新要件を確認

ベトナムでの生活・就労コストを事前にシミュレーションするには、[MoveWorthシミュレーター](https://moveworthapp.com/simulate)をご活用ください。

---

${REF}`;

const en = `Vietnam has become an increasingly popular destination for expatriates and digital nomads due to its vibrant culture, affordable living costs, and growing demand for international talent in IT and manufacturing. This guide covers the Vietnam e-Visa, Long-Stay Visa, and Work Permit options for 2026.

### What Is the Vietnam e-Visa, Long-Stay Visa & Work Permit?
The Vietnam e-Visa is an online short-stay visa valid for up to 90 days, suitable for tourism, business, and personal visits. Since 2023, the maximum stay has been extended. For long-term residence and employment, the main route is through a Work Permit issued via a Vietnamese employer, together with a Temporary Residence Card (TRC). The employer must initiate the work permit application.

### Eligibility Requirements
- **e-Visa**
  - Valid passport (6+ months remaining validity recommended)
  - Nationality from one of 90+ eligible countries
- **Work Permit**
  - Vietnamese employer must submit the application
  - Specific eligibility requirements vary by industry and role; contact your employer or the local Department of Labour (DOLISA) for details
  - Required documents (e.g. criminal record clearance, medical certificate) should be confirmed with the relevant authority
- **Temporary Residence Card (TRC)**
  - Obtained after work permit approval
  - Valid up to 2 years, renewable

### Application Fees Breakdown
| Item | Cost |
|------|------|
| e-Visa application fee | Please check evisa.gov.vn for current fees |
| Temporary Residence Card (1–2 years) | US$145 |
| Temporary Residence Card (2–5 years) | US$155 |
| Work permit (employer-submitted) | Please check the official office for current fees |

### Step-by-Step Application Process
1. **Apply for e-Visa (before departure)**: Apply at evisa.gov.vn; typically issued in 3–5 business days
2. **Enter Vietnam & secure employment**: Use e-Visa to enter; finalize job offer
3. **Prepare documents**: Gather degree certificate, criminal record clearance, medical cert — all with notarized Vietnamese translation
4. **Employer submits work permit**: Your Vietnamese employer applies to the provincial/municipal Department of Labour (DOLISA)
5. **Work permit issued**: Typically 15–20 business days with complete documentation
6. **Apply for TRC**: After work permit is issued, apply at the Immigration Department
7. **TRC issued**: Up to 2-year residence permit issued; renewable

### Rights & Restrictions After Approval
- **Employment**: May work legally in the role and employer stated in the work permit
- **Property**: Foreign nationals may hold condominium ownership for up to 50 years (renewable)
- **Family**: Spouse and dependants may apply for accompanying visas (DV)
- **Banking**: TRC holders may open local bank accounts
- **Renewal**: Work permit and TRC can be renewed before expiry under same conditions

### Living Costs & Tax Overview
Rent in major cities (Ho Chi Minh City, Hanoi) ranges from approximately USD 500–1,500/month (studio to 2-bedroom). Total living costs including food and transport typically range from USD 800–2,000/month.

**Personal Income Tax (Law 109/2025/QH15, Article 9 — 5-Tier Progressive PIT)**

Vietnam's new 5-tier progressive personal income tax applies from 2026. Rates are based on monthly taxable income after allowable deductions:

| Monthly Taxable Income (VND) | Tax Rate |
|---|---|
| Up to 10 million | 5% |
| 10M–30 million | 10% |
| 30M–60 million | 20% |
| 60M–100 million | 30% |
| Over 100 million | 35% |

> **Effective Date Note**: Law 109/2025/QH15 generally takes effect on **July 1, 2026** (Article 29, Para. 1). For employment income (salaries and wages), the new PIT rates apply **from the 2026 tax year (from January 1, 2026)** (Article 29, Para. 2).
> Source: Vietnam Ministry of Finance NIF Portal — Law 109/2025/QH15, Articles 9 and 29 (verified).

### Pre-Application Checklist
1. **Check e-Visa eligibility**: Verify your nationality is on the eligible country list at evisa.gov.vn
2. **Document requirements**: Required documents for the work permit vary by employer and role — confirm with DOLISA or your employer
3. **Employer sponsorship is mandatory**: The work permit system requires an employer — secure a job offer first
4. **Tax timing**: The new PIT rates apply to employment income **from the 2026 tax year (January 1, 2026)**
5. **Stay current**: Check immigration.gov.vn for the latest requirements before submitting

Estimate your Vietnam tax and living costs with the [MoveWorth Simulator](https://moveworthapp.com/simulate).

---

${REF_EN}`;

const zh = `越南以其丰富的文化、低廉的生活成本以及IT和制造业对国际人才的旺盛需求，已成为越来越受欢迎的移居目的地。本文详细介绍2026年越南电子签证（e-Visa）、长期签证及工作许可的最新申请指南。

### 什么是越南电子签证（e-Visa）、长期签证及工作许可？
越南电子签证（e-Visa）是一种可在线申请的短期签证，最长停留90天，适用于旅游、商务及探亲等多种目的。2023年后，最长停留时间已延长。长期居留和就业的主要途径是通过越南雇主申请工作许可，并配套申请临时居留证（TRC）。

### 申请资格与取得条件
- **电子签证（e-Visa）**
  - 有效护照（建议剩余有效期6个月以上）
  - 属于越南政府认可的90余个对象国国籍
- **工作许可**
  - 需由越南境内雇主代为申请
  - 具体资格要求因行业和职位而异，请向雇主或越南劳动局（DOLISA）确认
  - 所需材料（如无犯罪证明、健康证明等）须向相关主管部门确认
- **临时居留证（TRC）**
  - 取得工作许可后方可申请
  - 有效期最长2年（可续签）

### 申请费用明细
| 项目 | 费用 |
|------|------|
| 电子签证（e-Visa）申请费 | 请访问evisa.gov.vn确认最新费用 |
| 临时居留证（1至2年有效） | US$145 |
| 临时居留证（2至5年有效） | US$155 |
| 工作许可申请（由雇主负担） | 请向官方窗口确认 |

### 申请流程（分步说明）
1. **申请e-Visa（出发前）**: 在evisa.gov.vn申请，通常3至5个工作日内签发
2. **入境越南并确保就业**: 持e-Visa入境，完成求职或确认录用
3. **准备材料**: 学历证明、无犯罪证明、健康证明，均需附越南语公证翻译
4. **雇主提交申请**: 由越南雇主向省/市劳动局（DOLISA）申请工作许可
5. **取得工作许可**: 材料齐全的情况下通常需15至20个工作日
6. **申请临时居留证（TRC）**: 取得工作许可后，向出入境管理局申请
7. **领取TRC，开始长期居留**: 最长2年的居留证签发，可续签

### 获批后的权利与限制
- **就业**: 可在工作许可规定的职位和雇主处合法工作
- **不动产**: 外国人可持有公寓等分时产权，最长50年（可续期）
- **家属随行**: 配偶及被抚养人可申请随行签证（DV）
- **银行开户**: 持TRC者可在当地开设银行账户
- **续签**: 工作许可及TRC均可在到期前按相同条件续签

### 生活费与税务概况
胡志明市、河内等主要城市的租金约为每月500至1,500美元（单间至两居室），包含餐饮和交通的生活总费用约为每月800至2,000美元。

**个人所得税（法律109/2025/QH15 第9条 — 5档累进税率）**

2026年起，越南实施新的5档累进个人所得税制度。税率按月度应税收入（扣除相关免税额后）分档计算：

| 月度应税收入（越南盾） | 税率 |
|---|---|
| 1,000万以下 | 5% |
| 1,000万～3,000万 | 10% |
| 3,000万～6,000万 | 20% |
| 6,000万～1亿 | 30% |
| 1亿以上 | 35% |

> **施行日说明**: 法律总体施行日为**2026年7月1日**（第29条第1款）。工薪所得适用新税率的时间为"2026纳税年度起"（第29条第2款），即**从2026纳税年度（1月1日起）适用**。
> 资料来源：越南财政部NIFPortal — 法律109/2025/QH15 第9条、第29条（已核实）

### 申请前须知
1. **确认e-Visa对象国籍**: 在evisa.gov.vn查看最新对象国列表
2. **申请材料**: 工作许可所需材料因雇主和职位而异，请向DOLISA或雇主确认
3. **雇主配合是前提**: 工作许可需由雇主申请，务必优先确保获得工作录用
4. **注意税率施行日**: 2026年新税率针对工薪所得**从2026纳税年度（1月1日起）适用**
5. **持续关注最新要求**: 请通过immigration.gov.vn获取最新政策

通过[MoveWorth模拟器](https://moveworthapp.com/simulate)，可提前模拟您在越南的税负与生活成本。

---

${REF_ZH}`;

async function main() {
  const { error } = await sb
    .from("blog_posts")
    .update({ content: { ja, en, zh } })
    .eq("slug", "vietnam-visa-guide-2026")
    .eq("is_published", false);

  if (error) { console.error("❌", error.message); process.exit(1); }
  console.log("✅ draft 更新完了");
  console.log(`  JA: ${ja.length}字`);
  console.log(`  EN: ${en.length}字`);
  console.log(`  ZH: ${zh.length}字`);
}
main().catch(e => { console.error(e); process.exit(1); });

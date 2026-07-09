import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const title = {
  ja: "【架空モデルケース】シンガポール移住で資産形成をMoveWorthでシミュレーション",
  en: "[Model Case] Simulating Wealth Building in Singapore with MoveWorth",
  zh: "【虚拟案例】用MoveWorth模拟移居新加坡的资产增长效果",
};

const description = {
  ja: "実在しない架空の30代共働き夫婦をモデルとして、MoveWorthシミュレーターでシンガポール移住後の資産形成を試算。実際にシミュレーターを使いながら確認できるデモ記事です。",
  en: "Using a fictional dual-income couple in their 30s as a model, this article demonstrates how MoveWorth simulates wealth building after relocating to Singapore. A step-by-step walkthrough of the simulator.",
  zh: "以虚构的30多岁共働夫妇为模型，通过MoveWorth模拟器演示移居新加坡后的资产增长效果。本文是MoveWorth的操作示范文章。",
};

const contentJa = `> **⚠️ この記事について**
> このケーススタディは**架空のモデルケース**によるシミュレーションです。登場する人物・数値・事例はすべて架空であり、実在の個人や企業とは一切関係ありません。MoveWorthシミュレーターの使い方と試算結果を体験するためのデモ記事です。

---

## モデルケースの設定

MoveWorthでのシミュレーションを分かりやすく説明するため、次のような架空のケースを想定します。

| 項目 | 設定値 |
|------|--------|
| 想定人物 | 架空の30代日本人共働き夫婦（Aさん・Bさん） |
| 現在地 | 日本（東京） |
| 移住先 | シンガポール |
| 世帯年収（日本） | 約1,200万円（600万円×2） |
| 職種 | ITエンジニア・マーケター |
| 家族構成 | 夫婦2人（子なし） |

---

## MoveWorthでシミュレーションしてみる

### ステップ1：国を選ぶ

MoveWorthのトップページで「移住元：日本」「移住先：シンガポール」を選択します。

シンガポールはアジアの金融ハブとして知られており、**個人所得税の最高税率は24%**（2024年時点）。日本の最高税率55%と比較すると大幅な節税が期待できます。

### ステップ2：収入・生活費を入力

世帯年収をシミュレーターに入力すると、以下のような項目が自動計算されます。

**収入（想定値）**
- AさんSGD 8,000/月 ＋ BさんSGD 6,000/月 ＝ **世帯月収SGD 14,000**（約140万円）

**シンガポールでの主な生活費（目安）**

| 費用項目 | 月額目安（SGD） |
|----------|----------------|
| 家賃（2BR / Orchard周辺） | 3,500〜4,500 |
| 食費 | 800〜1,200 |
| 交通費 | 150〜200 |
| 医療保険 | 200〜400 |
| 通信費 | 50〜80 |
| **合計（概算）** | **4,700〜6,380** |

> **補足**：シンガポールのCPF（中央積立基金）は**シンガポール市民権・永住権（PR）保持者のみ**が対象です。Employment Pass（EP）保持者の外国人駐在員は原則加入できません。このシミュレーションではCPFは計算に含めていません。

### ステップ3：税金の比較

MoveWorthは日本とシンガポールの税負担を並べて比較します。

**日本（東京）での税負担イメージ**
- 所得税＋住民税：世帯で年間約360万円（30%想定）
- 社会保険料：年間約140万円

**シンガポールでの税負担イメージ（EP保持者）**
- 個人所得税：AさんSGD 12,400/年 ＋ BさんSGD 7,800/年 ＝ 合計SGD 20,200/年（約202万円）
- 社会保険（CPF）：外国人EP保持者は**対象外**
- 消費税（GST）：9%（2024年〜）

→ このモデルケースでは、日本に比べて**年間200万円以上の税負担削減**が試算されます（あくまで概算）。

### ステップ4：資産形成の試算

MoveWorthの資産形成シミュレーターでは、貯蓄額と運用利回りをもとに将来資産を予測できます。

| 期間 | 月間貯蓄（想定） | 累積貯蓄（試算） |
|------|-----------------|-----------------|
| 1年後 | SGD 6,000〜7,000 | 約SGD 75,000（約750万円） |
| 3年後 | 同上 | 約SGD 225,000（約2,250万円） |
| 5年後 | 同上 | 約SGD 375,000（約3,750万円） |

> ※為替レートSGD 1 = 100円として計算。実際の税制・生活費・為替変動により数値は大きく異なります。

---

## 実際にシミュレーションしてみよう

上記はあくまで**架空のモデルケースを使った説明**です。あなた自身の収入・職種・家族構成に合わせた試算は、MoveWorthシミュレーターで実際に入力してみてください。

[→ MoveWorthでシンガポール移住をシミュレーション](https://moveworthapp.com/simulate)

シミュレーターでは以下が確認できます：
- 日本 vs シンガポールの所得税・社会保険の比較
- 生活費を入力した後の手取り・貯蓄額の試算
- 移住後の資産形成グラフ（5年・10年・20年）
- 複数国の同時比較

---

## シンガポール移住の基本情報

### Employment Pass（EP）の要件

| 項目 | 内容 |
|------|------|
| 最低月収 | SGD 5,000〜（2025年基準、職種・年齢による） |
| 申請者 | 雇用主が申請 |
| 有効期間 | 最長2年（更新可） |
| COMPASS評価 | 2023年より全申請に義務化 |

### 注意点

- シンガポールの**CPF（中央積立基金）は外国籍EP保持者は対象外**。社会保障の面では日本より薄くなる点に注意。
- 家賃は日本の都市部より高く、**Orchard・CBD周辺の2BRは月SGD 4,000〜6,000**が相場。
- 税金が安い分、医療・年金は自己責任の比重が高い。民間医療保険への加入を推奨。

---

### 参考資料
- [Inland Revenue Authority of Singapore (IRAS)](https://www.iras.gov.sg/)
- [Ministry of Manpower Singapore (MOM)](https://www.mom.gov.sg/)
- [CPF Board – 対象者について](https://www.cpf.gov.sg/employer/employer-obligations/who-to-pay-cpf-contributions-for)
- [Singapore Department of Statistics](https://www.singstat.gov.sg/)
`;

const contentEn = `> **⚠️ About This Article**
> This case study is based on a **fictional model case** for demonstration purposes. All people, figures, and scenarios described are entirely hypothetical and do not represent any real individual or organization. This article is a walkthrough demo of the MoveWorth simulator.

---

## Model Case Setup

To illustrate how MoveWorth works, we use the following fictional scenario:

| Item | Value |
|------|-------|
| Profile | Fictional Japanese dual-income couple in their 30s (Person A & B) |
| Current location | Japan (Tokyo) |
| Destination | Singapore |
| Household income (Japan) | ~JPY 12M/year (JPY 6M × 2) |
| Occupations | IT Engineer & Marketing Manager |
| Household | Couple, no children |

---

## Running the MoveWorth Simulation

### Step 1: Select Countries

On the MoveWorth homepage, select **Origin: Japan** and **Destination: Singapore**.

Singapore is Asia's financial hub. Its **top personal income tax rate is 24%** (as of 2024), compared to Japan's 55% — significant savings potential.

### Step 2: Enter Income & Living Costs

**Assumed income:**
- Person A: SGD 8,000/month + Person B: SGD 6,000/month = **SGD 14,000/month household**

**Estimated monthly living costs in Singapore (SGD):**

| Category | Monthly estimate |
|----------|-----------------|
| Rent (2BR / Orchard area) | 3,500–4,500 |
| Food | 800–1,200 |
| Transportation | 150–200 |
| Medical insurance | 200–400 |
| Utilities & telecom | 50–80 |
| **Total (approx.)** | **4,700–6,380** |

> **Note**: Singapore's CPF (Central Provident Fund) applies **only to Singapore citizens and Permanent Residents**. Foreign nationals on an Employment Pass (EP) are generally **not eligible**. This simulation excludes CPF contributions.

### Step 3: Tax Comparison

**Japan (Tokyo) — estimated tax burden:**
- Income tax + resident tax: ~JPY 3.6M/year (30% effective rate)
- Social insurance: ~JPY 1.4M/year

**Singapore (EP holder) — estimated tax burden:**
- Personal income tax: Person A SGD 12,400 + Person B SGD 7,800 = SGD 20,200/year (~JPY 2.02M)
- CPF: **Not applicable** to foreign EP holders
- GST: 9% (from 2024)

→ This model case suggests an estimated **annual tax saving of JPY 2M+** compared to Japan (approximate only).

### Step 4: Wealth Accumulation Forecast

| Timeline | Monthly savings (est.) | Cumulative savings (est.) |
|----------|----------------------|--------------------------|
| 1 year | SGD 6,000–7,000 | ~SGD 75,000 |
| 3 years | Same | ~SGD 225,000 |
| 5 years | Same | ~SGD 375,000 |

> ※ Figures are illustrative. Actual results depend on tax changes, living costs, and currency fluctuations.

---

## Try It Yourself

The numbers above are based on a **fictional model**. Enter your own income, occupation, and household details in the MoveWorth simulator for a personalized estimate.

[→ Simulate Singapore relocation on MoveWorth](https://moveworthapp.com/simulate)

The simulator lets you:
- Compare income tax & social insurance: Japan vs. Singapore
- Calculate take-home pay and monthly savings after living costs
- See a 5/10/20-year wealth projection chart
- Compare multiple countries simultaneously

---

## Singapore Relocation Basics

### Employment Pass (EP) Requirements

| Item | Details |
|------|---------|
| Min. monthly salary | SGD 5,000+ (2025 standard, varies by age/role) |
| Application | Filed by employer |
| Validity | Up to 2 years (renewable) |
| COMPASS assessment | Mandatory for all applications since 2023 |

### Key Considerations

- **CPF does not apply to foreign EP holders** — social security coverage is thinner than Japan's; private health insurance is strongly recommended.
- Rent in prime areas (Orchard, CBD) can reach **SGD 4,000–6,000/month for a 2BR**.
- Lower taxes mean greater personal responsibility for retirement and healthcare planning.

---

### References
- [IRAS – Singapore Tax Authority](https://www.iras.gov.sg/)
- [Ministry of Manpower Singapore](https://www.mom.gov.sg/)
- [CPF Board – Who needs to pay CPF](https://www.cpf.gov.sg/employer/employer-obligations/who-to-pay-cpf-contributions-for)
- [Singapore Department of Statistics](https://www.singstat.gov.sg/)
`;

const contentZh = `> **⚠️ 关于本文**
> 本案例研究基于**虚构的模型案例**，仅作演示用途。文中所有人物、数据及场景均为虚构，与任何真实个人或组织无关。本文是MoveWorth模拟器的操作演示文章。

---

## 模型案例设定

为说明MoveWorth的使用方式，我们设定以下虚构场景：

| 项目 | 设定值 |
|------|--------|
| 人物 | 虚构的30多岁日本共働夫妇（A与B） |
| 当前所在地 | 日本（东京） |
| 移居目的地 | 新加坡 |
| 家庭年收入（日本） | 约1200万日元（600万×2） |
| 职业 | IT工程师 & 市场营销经理 |
| 家庭构成 | 夫妇二人，无子女 |

---

## 使用MoveWorth进行模拟

### 第1步：选择国家

在MoveWorth首页选择**出发地：日本**，**目的地：新加坡**。

新加坡是亚洲金融中心，**个人所得税最高税率为24%**（2024年），相比日本的55%，节税效果显著。

### 第2步：输入收入与生活费

**假设收入：**
- A：SGD 8,000/月 + B：SGD 6,000/月 = **家庭月收入SGD 14,000**

**新加坡预计每月生活费（SGD）：**

| 类别 | 月均估算 |
|------|---------|
| 房租（2BR / 乌节路周边） | 3,500–4,500 |
| 餐饮 | 800–1,200 |
| 交通 | 150–200 |
| 医疗保险 | 200–400 |
| 通讯费 | 50–80 |
| **合计（约）** | **4,700–6,380** |

> **注意**：新加坡CPF（中央公积金）**仅适用于新加坡公民及永久居民**，持就业准证（EP）的外籍人士原则上**不适用**。本模拟不含CPF。

### 第3步：税负比较

**在日本（东京）的估算税负：**
- 所得税+住民税：约360万日元/年（约30%有效税率）
- 社会保险：约140万日元/年

**在新加坡（EP持有者）的估算税负：**
- 个人所得税：A约SGD 12,400 + B约SGD 7,800 = 合计SGD 20,200/年（约202万日元）
- CPF：**EP持有外籍人士不适用**
- GST：9%（2024年起）

→ 此模型案例估算，与在日本相比，**每年可节税200万日元以上**（仅为概算）。

### 第4步：资产增长预测

| 时间 | 月均储蓄（估算） | 累计储蓄（估算） |
|------|----------------|----------------|
| 1年后 | SGD 6,000–7,000 | 约SGD 75,000 |
| 3年后 | 同上 | 约SGD 225,000 |
| 5年后 | 同上 | 约SGD 375,000 |

> ※ 数字仅供参考。实际结果因税制变化、生活费及汇率波动而有所不同。

---

## 亲自体验模拟

以上数据均基于**虚构模型案例**。请在MoveWorth模拟器中输入您自己的收入、职业及家庭情况，获取个性化估算。

[→ 在MoveWorth模拟新加坡移居](https://moveworthapp.com/simulate)

模拟器功能包括：
- 日本 vs 新加坡所得税与社会保险对比
- 扣除生活费后的净收入与每月储蓄额估算
- 5/10/20年资产增长图表
- 多国同时对比

---

## 新加坡移居基础知识

### 就业准证（EP）申请要求

| 项目 | 内容 |
|------|------|
| 最低月薪 | SGD 5,000以上（2025年标准，因年龄/职位而异） |
| 申请方 | 由雇主申请 |
| 有效期 | 最长2年（可续签） |
| COMPASS评估 | 2023年起所有申请强制执行 |

### 注意事项

- **外籍EP持有者不适用CPF**，社会保障覆盖范围比日本窄，建议购买私人医疗保险。
- 黄金地段（乌节路、CBD）2居室租金约为**SGD 4,000–6,000/月**。
- 税负较低，但医疗与养老需更多自我规划。

---

### 参考资料
- [新加坡税务局（IRAS）](https://www.iras.gov.sg/)
- [新加坡人力部（MOM）](https://www.mom.gov.sg/)
- [CPF委员会 – CPF缴纳对象](https://www.cpf.gov.sg/employer/employer-obligations/who-to-pay-cpf-contributions-for)
- [新加坡统计局](https://www.singstat.gov.sg/)
`;

async function run() {
  const { error } = await sb
    .from("blog_posts")
    .update({
      title,
      description,
      content: { ja: contentJa, en: contentEn, zh: contentZh },
    })
    .eq("slug", "building-wealth-a-case-study-of-a-dual-income-couple-in-2026");

  if (error) {
    console.error("❌", error.message);
  } else {
    console.log("✅ Article updated successfully");
  }
}

run().catch(console.error);

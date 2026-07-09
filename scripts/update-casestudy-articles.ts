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

const DISCLAIMER_JA = `> **⚠️ この記事について**
> このケーススタディは**架空のモデルケース**によるシミュレーションです。登場する人物・数値・事例はすべて架空であり、実在の個人や企業とは一切関係ありません。MoveWorthシミュレーターの活用方法を体験するためのデモ記事です。

---

`;

const DISCLAIMER_EN = `> **⚠️ About This Article**
> This case study is based on a **fictional model case** for demonstration purposes. All people, figures, and scenarios are entirely hypothetical and do not represent any real individual or organization. This article is a walkthrough demo of the MoveWorth simulator.

---

`;

const DISCLAIMER_ZH = `> **⚠️ 关于本文**
> 本案例研究基于**虚构的模型案例**，仅作演示用途。文中所有人物、数据及场景均为虚构，与任何真实个人或组织无关。本文是MoveWorth模拟器的操作演示文章。

---

`;

// ============================================================
// 1. ポルトガル・リスボン（40代夫婦の成功事例 → 架空モデル）
// ============================================================
const lisbonTitle = {
  ja: "【架空モデルケース】ポルトガル・リスボン移住シミュレーション：NHR税制と生活費の試算",
  en: "[Model Case] Portugal Lisbon Relocation Simulation: NHR Tax Benefits & Living Costs",
  zh: "【虚拟案例】葡萄牙里斯本移居模拟：NHR税制与生活费用测算",
};
const lisbonDesc = {
  ja: "架空の40代日本人夫婦をモデルとして、ポルトガルの非居住者税制（NHR）・生活費・D7ビザをMoveWorthでシミュレーション。実在の事例ではありません。",
  en: "Using a fictional Japanese couple in their 40s as a model, this article simulates Portugal's NHR tax regime, living costs, and D7 visa requirements with MoveWorth. Not a real case study.",
  zh: "以虚构的40多岁日本夫妇为模型，用MoveWorth模拟葡萄牙NHR税制、生活费及D7签证要求。非真实案例。",
};
const lisbonJa = DISCLAIMER_JA + `## モデルケースの設定

本記事では、以下の架空のケースを想定してシミュレーションします。

| 項目 | 設定値 |
|------|--------|
| 想定人物 | 架空の40代日本人夫婦（Aさん・Bさん） |
| 現在地 | 日本 |
| 移住先 | ポルトガル・リスボン |
| 主な収入 | 年金・配当所得（定年後移住を想定） |
| 家族構成 | 夫婦2人 |

---

## ポルトガルの非居住者税制（NHR）

ポルトガルには移住者に有利な非居住者税制（NHR: Non-Habitual Resident）があります。2024年からは「IFICI」という名称に改定されましたが、特定の職種・所得区分に対する優遇措置は継続されています。

> **注意**：NHRの適用条件・税率は改定されることがあります。申請前に必ずポルトガルの税務当局または税理士に最新情報を確認してください。

### モデルケースでの税金試算（架空）

| 所得区分 | 通常税率 | NHR旧制度（参考） |
|---------|---------|-----------------|
| 外国源泉年金所得 | 累進課税（最高48%） | 10%（固定） |
| 配当所得 | 最大28% | 軽減適用の場合あり |

このモデルケースでは、日本からの年金所得にNHRが適用される想定で、**税負担を大幅に軽減できる可能性**を試算します。実際の金額は個々の状況により大きく異なります。

---

## 生活費の目安（リスボン）

| 費用項目 | 月額目安 |
|---------|---------|
| 家賃（1BR・郊外エリア） | €800〜€1,200 |
| 家賃（1BR・中心部） | €1,200〜€1,800 |
| 食費（2人・自炊中心） | €300〜€500 |
| 公共交通機関 | €40〜€60（交通パス） |
| 光熱費 | €80〜€120 |
| 医療保険 | €100〜€200 |
| **合計（概算）** | **€1,320〜€2,080** |

リスボンの家賃は近年上昇傾向にあるため、物件選びは早めに進めることが重要です。

---

## D7ビザの要件

D7ビザ（受動的所得ビザ）は、年金・配当・家賃収入など安定した所得を持つ方向けの長期滞在ビザです。

| 項目 | 内容 |
|------|------|
| 最低収入 | 年間€8,460以上（ポルトガルの国民最低賃金の100%） |
| 扶養家族 | 1人あたり50%の追加収入が必要 |
| 必要書類 | パスポート・収入証明・犯罪歴証明書・健康保険証 |
| 申請先 | 日本のポルトガル大使館または領事館 |

---

## MoveWorthでシミュレーションしてみよう

上記はあくまで**架空の設定による概算**です。あなた自身の収入・資産状況に合わせた試算は、MoveWorthシミュレーターで確認してみてください。

[→ MoveWorthでポルトガル移住をシミュレーション](https://moveworthapp.com/simulate)

---

### 参考資料
- [ポルトガル税務局（AT）](https://www.portaldasfinancas.gov.pt/)
- [ポルトガル移民・国境局（AIMA）](https://www.aima.gov.pt/)
- [在ポルトガル日本国大使館](https://www.pt.emb-japan.go.jp/itprtop_ja/index.html)
`;

// ============================================================
// 2. スペイン・バルセロナ（フリーランサーの1年間実録 → 架空シミュレーション）
// ============================================================
const barcelonaTitle = {
  ja: "【架空モデルケース】スペイン・バルセロナでフリーランサーとして生活するシミュレーション",
  en: "[Model Case] Simulating Life as a Freelancer in Barcelona, Spain with MoveWorth",
  zh: "【虚拟案例】模拟在西班牙巴塞罗那作为自由职业者生活的费用与税务",
};
const barcelonaDesc = {
  ja: "架空のフリーランサーをモデルとして、スペイン・バルセロナの生活費・税金・ビザをMoveWorthでシミュレーション。「1年間実録」ではなく架空の試算です。",
  en: "Using a fictional freelancer as a model, this article simulates living costs, taxes, and visa requirements for Barcelona, Spain with MoveWorth. This is a hypothetical simulation, not a real account.",
  zh: "以虚构的自由职业者为模型，用MoveWorth模拟在西班牙巴塞罗那的生活费、税务及签证要求。非真实经历，仅为假设性模拟。",
};
const barcelonaJa = DISCLAIMER_JA + `## モデルケースの設定

本記事では、以下の架空のケースを想定してシミュレーションします。

| 項目 | 設定値 |
|------|--------|
| 想定人物 | 架空の日本人フリーランサー（Aさん） |
| 職種 | デザイナー・Webライター（リモート案件中心） |
| 月収（日本クライアント） | 約50〜60万円 |
| 移住先 | スペイン・バルセロナ |

---

## バルセロナの生活費

バルセロナはスペインの中では生活費が高めですが、他の西欧主要都市と比べると手頃です。

| 費用項目 | 月額目安 |
|---------|---------|
| 家賃（中心部・1BR） | €900〜€1,200 |
| 家賃（郊外・1BR） | €700〜€900 |
| 食費（自炊中心） | €200〜€300 |
| 外食込み | €300〜€450 |
| 交通費（月間パス） | €40 |
| 光熱費・インターネット | €100〜€150 |
| **合計（概算）** | **€1,340〜€2,000** |

---

## フリーランサーとしての税金

スペインでフリーランサーとして活動する場合、以下の税金が課されます。

- **個人所得税（IRPF）**：所得に応じて19%〜47%の累進課税
- **付加価値税（IVA）**：一般的に21%（サービス提供の場合）
- **自営業者社会保障費（autónomo）**：月額約€230〜€500（所得連動制、2023年改定）

税務申告は四半期ごとに行う必要があります。外国人向けの税理士サービスが充実しているため、専門家への相談を推奨します。

> **注意**：日本のクライアントからの収入がある場合、日西租税条約の適用やVATの扱いが複雑になることがあります。税理士への相談を強くお勧めします。

---

## ビザと居住許可

バルセロナでフリーランサーとして活動するための一般的な流れ：

1. **自営業ビザ（Visado de Residencia por Cuenta Propia）の申請**：日本のスペイン大使館・領事館で申請。職業の証明・資金証明が必要。
2. **NIE番号の取得**：スペインでの滞在・納税に必須の識別番号。
3. **autónomo（自営業者）登録**：スペインの社会保障庁（TGSS）への登録が必要。
4. **居住許可の更新**：最初の居住許可は1〜2年。更新ごとに書類が必要。

手続きには数ヶ月かかることがあるため、早めの準備が重要です。

---

## MoveWorthでシミュレーションしてみよう

上記はあくまで**架空のモデルケース**です。あなた自身の収入・状況に合わせた試算は、MoveWorthシミュレーターで確認してみてください。

[→ MoveWorthでスペイン移住をシミュレーション](https://moveworthapp.com/simulate)

---

### 参考資料
- [スペイン税務庁（AEAT）](https://www.agenciatributaria.es/)
- [スペイン社会保障庁（TGSS）](https://www.seg-social.es/)
- [在スペイン日本国大使館](https://www.es.emb-japan.go.jp/itprtop_ja/index.html)
- [バルセロナ市役所](https://www.barcelona.cat/en/)
`;

// ============================================================
// 3. タイ・バンコク（日本人エンジニアが語る → 一人称を全面的に架空に）
// ============================================================
const bangkokTitle = {
  ja: "【架空モデルケース】バンコク移住したITエンジニアの収支をMoveWorthでシミュレーション",
  en: "[Model Case] Simulating an IT Engineer's Finances After Relocating to Bangkok with MoveWorth",
  zh: "【虚拟案例】用MoveWorth模拟IT工程师移居曼谷后的收支情况",
};
const bangkokDesc = {
  ja: "架空の日本人ITエンジニアをモデルとして、タイ・バンコクの生活費・税金・ビザをMoveWorthでシミュレーション。実在の体験談ではありません。",
  en: "Using a fictional Japanese IT engineer as a model, this article simulates living costs, taxes, and visa requirements for Bangkok, Thailand with MoveWorth. Not a real personal account.",
  zh: "以虚构的日本IT工程师为模型，用MoveWorth模拟移居泰国曼谷后的生活费、税务及签证情况。非真实亲身经历。",
};
const bangkokJa = DISCLAIMER_JA + `## モデルケースの設定

本記事では、以下の架空のケースを想定してシミュレーションします。

| 項目 | 設定値 |
|------|--------|
| 想定人物 | 架空の30代日本人ITエンジニア（Aさん） |
| スキル | バックエンド開発・クラウドインフラ |
| 就労形態 | バンコクのIT企業に現地採用 |
| 月収（想定） | 約90,000バーツ（約315,000円） |
| 移住先 | タイ・バンコク |

---

## バンコクの生活費

日本と比べてバンコクの生活費はかなり安く抑えられます。このモデルケースでの試算では以下を想定します。

| 費用項目 | 月額目安 |
|---------|---------|
| 家賃（中心部・1BR） | 約18,000〜25,000バーツ |
| 食費（ローカル中心） | 約5,000〜8,000バーツ |
| 交通費（BTS/MRT月間パス） | 約1,500バーツ |
| 光熱費 | 約1,500〜2,500バーツ |
| 通信費 | 約500〜800バーツ |
| **合計（概算）** | **約26,500〜37,800バーツ（約93,000〜132,000円）** |

ローカルのレストランでの食事は1食あたり約100〜150バーツ（約350〜525円）と安価で、食費を大幅に抑えることができます。

---

## 税金の比較

タイの個人所得税は累進課税で、**年間所得150,000バーツ（約52万円）以下は非課税**です。

| 年間所得（バーツ） | 税率 |
|-----------------|------|
| 〜150,000 | 0% |
| 150,001〜300,000 | 5% |
| 300,001〜500,000 | 10% |
| 500,001〜750,000 | 15% |
| 750,001〜1,000,000 | 20% |
| 1,000,001〜2,000,000 | 25% |
| 2,000,001〜5,000,000 | 30% |
| 5,000,001〜 | 35% |

このモデルケースでは年収約1,080,000バーツ（約378万円）を想定。税率は25%前後が適用される帯となり、**日本での同等収入より税負担が軽くなる可能性**があります（ただし社会保障の範囲は日本より限定的）。

---

## ビザの取得（Non-Immigrant Bビザ）

タイで就労するためには「Non-Immigrant Bビザ」と「労働許可証（Work Permit）」が必要です。

| 項目 | 内容 |
|------|------|
| 取得方法 | 雇用主経由（雇用主が申請サポート） |
| 必要書類 | 雇用契約書・会社の登記書類・パスポート |
| 有効期間 | 通常1年（更新可） |
| 労働許可証 | 入国後に取得（雇用主が申請） |

> **注意**：労働許可証なしでの就労は法律違反です。必ず雇用主と手続きを確認してください。

---

## MoveWorthでシミュレーションしてみよう

上記は**架空のモデルケース**による概算です。あなた自身の収入・職種・家族構成に合わせた試算は、MoveWorthシミュレーターで確認してみてください。

[→ MoveWorthでタイ・バンコク移住をシミュレーション](https://moveworthapp.com/simulate)

---

### 参考資料
- [タイ歳入局（Revenue Department）](https://www.rd.go.th/)
- [タイ労働省](https://www.mol.go.th/)
- [在タイ日本国大使館](https://www.th.emb-japan.go.jp/itprtop_ja/index.html)
- [タイ投資委員会（BOI）](https://www.boi.go.th/)
`;

// ============================================================
// 4. カナダ・バンクーバー（成功体験談 → 架空モデル、AIアーティファクト除去）
// ============================================================
const vancouverTitle = {
  ja: "【架空モデルケース】カナダ・バンクーバー移住のITエンジニア収支シミュレーション",
  en: "[Model Case] Simulating an IT Engineer's Finances After Relocating to Vancouver, Canada",
  zh: "【虚拟案例】模拟IT工程师移居加拿大温哥华后的收支情况",
};
const vancouverDesc = {
  ja: "架空の日本人ITエンジニアをモデルとして、カナダ・バンクーバーの生活費・税金・ビザをMoveWorthでシミュレーション。実在の体験談ではありません。",
  en: "Using a fictional Japanese IT engineer as a model, this article simulates living costs, taxes, and immigration options for Vancouver, Canada with MoveWorth. Not a real personal account.",
  zh: "以虚构的日本IT工程师为模型，用MoveWorth模拟移居加拿大温哥华后的生活费、税务及移民路径。非真实亲身经历。",
};
const vancouverJa = DISCLAIMER_JA + `## モデルケースの設定

本記事では、以下の架空のケースを想定してシミュレーションします。

| 項目 | 設定値 |
|------|--------|
| 想定人物 | 架空の30代日本人ITエンジニア（Aさん） |
| スキル | ソフトウェア開発・クラウドアーキテクチャ |
| 就労形態 | バンクーバーのテック企業に就職 |
| 年収（想定） | CAD 90,000（約990万円） |
| 移住先 | カナダ・バンクーバー |

---

## バンクーバーの生活費

バンクーバーは北米でも生活費が高い都市の一つです。日本の主要都市と比べても高めになることが多いです。

| 費用項目 | 月額目安（CAD） |
|---------|--------------|
| 家賃（1BR・中心部） | 約2,200〜2,800 |
| 食費 | 約600〜900 |
| 交通費（TransLink月間パス） | 約110 |
| 光熱費 | 約100〜150 |
| 通信費 | 約60〜100 |
| 医療保険（MSP） | 無料（BC州居住者） |
| **合計（概算）** | **約3,070〜4,060 CAD（約340〜450万円/年）** |

---

## 税金の概算

カナダの所得税は連邦税＋州税（BC州）の二重構造です。

| 年収（CAD） | 連邦税率（目安） | BC州税率 |
|------------|--------------|---------|
| 〜55,867 | 15% | 5.06% |
| 55,867〜111,733 | 20.5% | 7.70% |
| 111,733〜154,906 | 26% | 10.50% |
| 154,906〜220,000 | 29% | 12.29% |
| 220,000〜 | 33% | 14.70% |

このモデルケース（年収CAD 90,000）では、実効税率は連邦＋州合わせて**約28〜32%**程度が目安になります。

> **注意**：日加租税条約により、日本とカナダ両方に収入がある場合、二重課税を避けるための申告が必要です。

---

## ビザ・移民のルート

カナダへのITエンジニアの主な移民ルート：

| 制度 | 特徴 |
|------|------|
| Express Entry | ポイント制（CRS）の連邦移民プログラム。職歴・学歴・英語力が評価対象 |
| BC PNP Tech Pilot | BC州が特定のNOCコードに対して優先招待するプログラム |
| ワークパーミット | 内定後に就労許可証を取得し、後から永住権申請へ |

2023〜2024年時点でExpress EntryのCRSカットオフは450〜500点前後で推移しています（変動あり）。最新情報はIRCCの公式サイトで確認してください。

---

## MoveWorthでシミュレーションしてみよう

上記は**架空のモデルケース**による概算です。あなた自身の収入・職種・家族構成に合わせた試算は、MoveWorthシミュレーターで確認してみてください。

[→ MoveWorthでカナダ移住をシミュレーション](https://moveworthapp.com/simulate)

---

### 参考資料
- [カナダ移民・難民・市民権省（IRCC）](https://www.canada.ca/en/immigration-refugees-citizenship.html)
- [BC州政府（BC PNP）](https://www2.gov.bc.ca/gov/content/immigration)
- [カナダ国税庁（CRA）](https://www.canada.ca/en/revenue-agency.html)
- [在カナダ日本国大使館](https://www.ca.emb-japan.go.jp/itprtop_ja/index.html)
`;

// ============================================================
// 5. マレーシア・クアラルンプール（移住した家族の実態レポート → 架空モデル）
// ============================================================
const klTitle = {
  ja: "【架空モデルケース】マレーシア・クアラルンプール移住家族の生活費シミュレーション",
  en: "[Model Case] Simulating a Family's Living Costs After Relocating to Kuala Lumpur, Malaysia",
  zh: "【虚拟案例】模拟家庭移居马来西亚吉隆坡后的生活费用",
};
const klDesc = {
  ja: "架空の日本人ファミリーをモデルとして、マレーシア・クアラルンプールの生活費・教育費・医療費をMoveWorthでシミュレーション。実在の事例ではありません。",
  en: "Using a fictional Japanese family as a model, this article simulates living costs, education fees, and healthcare in Kuala Lumpur, Malaysia with MoveWorth. Not a real case study.",
  zh: "以虚构的日本家庭为模型，用MoveWorth模拟移居马来西亚吉隆坡后的生活费、教育费及医疗费。非真实案例。",
};
const klJa = DISCLAIMER_JA + `## モデルケースの設定

本記事では、以下の架空のケースを想定してシミュレーションします。

| 項目 | 設定値 |
|------|--------|
| 想定人物 | 架空の日本人ファミリー（夫婦＋子ども1人） |
| 就労形態 | 夫がKLのIT企業に現地採用、妻は在宅リモート |
| 世帯月収（想定） | 約MYR 15,000（約45万円） |
| 移住先 | マレーシア・クアラルンプール（KL） |

---

## 生活費の内訳

クアラルンプールは東南アジアの中でも比較的生活費が抑えられる都市ですが、住居のグレードや子どもの教育費によって大きく変わります。

### 住居費

| エリア・タイプ | 月額目安（MYR） |
|-------------|--------------|
| 市内中心部コンドミニアム（2BR） | 3,500〜5,000 |
| 郊外の良好環境（2BR） | 2,000〜3,500 |
| ファミリー向け（3BR・郊外） | 2,500〜4,000 |

### 食費

外食と自炊を組み合わせた場合、家族3人で月MYR 1,500〜2,500が目安です。地元のホーカー（屋台）を活用すると1食あたりMYR 8〜15（約240〜450円）程度に抑えられます。

### 交通費

| 手段 | 月額目安（MYR） |
|------|--------------|
| 公共交通（MRT・LRT月間パス） | 約100 |
| 自家用車（ローン・保険・ガソリン含む） | 約800〜1,200 |

### 教育費

子どもの教育費は選択肢によって大きく異なります。

| 学校の種類 | 年間費用目安（MYR） |
|---------|------------------|
| インターナショナルスクール（中堅） | 20,000〜35,000 |
| インターナショナルスクール（上位校） | 35,000〜60,000 |
| ローカル・ナショナルスクール | ほぼ無料〜低額 |

### 医療費

マレーシアの私立病院は水準が高く、費用も比較的手頃です。

| 診察種別 | 1回あたりの目安（MYR） |
|---------|---------------------|
| 一般診察（GP） | 50〜100 |
| 専門医診察 | 150〜300 |
| 入院（1日） | 500〜2,000（病院による） |

外国人はマレーシアの公的医療保険に加入できないため、**民間医療保険への加入が必須**です。

---

## 月間生活費の合計（試算）

| 費用項目 | 月額目安（MYR） |
|---------|--------------|
| 住居費 | 3,000〜4,500 |
| 食費 | 1,500〜2,500 |
| 交通費 | 100〜1,200 |
| 教育費（月換算） | 1,700〜3,000 |
| 医療保険 | 300〜600 |
| その他 | 500〜1,000 |
| **合計（概算）** | **約7,100〜12,800 MYR（約21〜38万円）** |

---

## MoveWorthでシミュレーションしてみよう

上記は**架空のモデルケース**による概算です。あなた自身の家族構成・収入・教育方針に合わせた試算は、MoveWorthシミュレーターで確認してみてください。

[→ MoveWorthでマレーシア移住をシミュレーション](https://moveworthapp.com/simulate)

---

### 参考資料
- [マレーシア移民局（JIM）](https://www.imi.gov.my/)
- [マレーシア国内歳入局（LHDN）](https://www.hasil.gov.my/)
- [Malaysia Healthcare Travel Council](https://www.mhtc.org.my/)
- [在マレーシア日本国大使館](https://www.my.emb-japan.go.jp/itprtop_ja/index.html)
`;

// ============================================================
// 6. マレーシアvsタイ（AIアーティファクト「申し訳ありません」を除去のみ）
// ============================================================
const myvstContentJaClean = `マレーシアとタイは、日本人の海外移住先として常に上位にランクインする人気国です。どちらも温暖な気候、日本人コミュニティの存在、比較的低い生活費が魅力ですが、経済的な面では違いがあります。MoveWorthのシミュレーションで比較してみましょう。

### 基本データ比較（2026年）

| 項目 | マレーシア | タイ |
|------|-----------|------|
| 通貨 | リンギット（MYR） | バーツ（THB） |
| 平均家賃（KL/BKK中心部1LDK） | 約3,500 MYR | 約20,000 THB |
| 日本円換算 | 約11.5万円 | 約8.5万円 |
| 所得税（最高税率） | 30% | 35% |
| インフレ率 | 約2.5% | 約3% |
| 法人税 | 24% | 20% |

### シミュレーション条件

以下の条件でMoveWorthのシミュレーションを実行しました。

> ※ シミュレーション数値はあくまで参考値です。実際の税制・生活費は個別の状況により異なります。

- **現在地**: 日本（東京）
- **年齢**: 30歳
- **年収**: 500万円（日本）/ 各国相当額
- **貯蓄**: 500万円
- **シミュレーション期間**: 10年

### 結果比較

**日本に残った場合:**
10年後の予測資産: 約1,450万円

**マレーシアに移住した場合:**
10年後の予測資産: 約1,850万円（+400万円）
- 家賃はやや高めだが、所得税率が低い
- インフレ率が安定している
- 投資環境が整っている

**タイに移住した場合:**
10年後の予測資産: 約1,750万円（+300万円）
- 家賃が圧倒的に安い
- しかし所得税率がやや高い
- 食費が安く生活費全体で有利

### ポイント解説

**マレーシアの強み:**
- 所得税率が低め（累進課税で中間層に有利）
- 英語が通じやすい（ビジネス環境）
- IT・テック系の求人が豊富
- MM2Hビザで長期滞在可能

**タイの強み:**
- 家賃・食費が非常に安い
- 日本人コミュニティが充実（特にバンコク）
- 医療水準が高い（バンコクの私立病院）
- 日系企業が多く、就職先が見つかりやすい

### どちらを選ぶべきか？

数字だけで見ると、マレーシアがわずかに有利ですが、差は小さいです。最終的には以下の要素で決めるとよいでしょう。

- **英語力に自信がある** → マレーシア
- **生活費を極限まで抑えたい** → タイ
- **IT・金融業界で働きたい** → マレーシア
- **日本食・日本人コミュニティ重視** → タイ

MoveWorthで両国のシミュレーションを実行し、自分の条件に合った比較をしてみてください。

### 参考資料
- [マレーシア国内歳入局（LHDN）](https://www.hasil.gov.my/)
- [タイ歳入局（Revenue Department）](https://www.rd.go.th/)
- [世界銀行](https://www.worldbank.org)
- [国際通貨基金（IMF）](https://www.imf.org)
`;

// ============================================================
// 7. 年収500万円の購買力（AIアーティファクト「申し訳ありません」を除去のみ）
// ============================================================
const pppContentJaClean = `「年収500万円」と聞くと、日本では中間層の標準的な収入というイメージがあります。では、この500万円は海外ではどの程度の価値があるのでしょうか？

### 額面の比較だけでは不十分

単純に為替レートで換算すると：
- 500万円 ≒ 約33,000 USD
- 500万円 ≒ 約152,000 MYR
- 500万円 ≒ 約1,170,000 THB

しかし、これだけでは「豊かさ」は比較できません。同じ33,000ドルでも、ニューヨークと東南アジアでは買えるものが全く異なります。

### 購買力平価（PPP）とは

購買力平価（Purchasing Power Parity）は、各国の物価水準を考慮した実質的な通貨の価値を示す指標です。「同じ商品やサービスを購入するのに必要な金額」で各国の通貨を比較します。

IMFのデータによると（2026年推計）：

| 国 | PPP換算係数 | 日本の500万円相当の購買力 |
|----|-----------|----------------------|
| アメリカ | 0.7 | 約350万円分 |
| マレーシア | 2.1 | 約1,050万円分 |
| タイ | 2.5 | 約1,250万円分 |
| インドネシア | 3.0 | 約1,500万円分 |
| ドイツ | 0.85 | 約425万円分 |
| オーストラリア | 0.75 | 約375万円分 |

つまり、日本での年収500万円と同じ生活水準を維持するのに、マレーシアでは約240万円、タイでは約200万円あれば足りるという計算です。

### シミュレーションへの活用

MoveWorthのシミュレーションでは、移住先の「年収」と「生活費」を個別に入力します。PPPの考え方を活用すれば、より現実的な入力が可能です。

**ステップ1:** 移住先で得られる実際の年収を入力
**ステップ2:** 生活費は、日本の生活費をPPP係数で割った金額を参考に入力
**ステップ3:** シミュレーション結果で、貯蓄ペースが上がるかどうかを確認

### 注意点

PPPはあくまで「平均的な」物価水準の比較です。以下の点に注意してください。

- 都市部と地方では物価が大きく異なる
- 輸入品（日本食、電化製品など）はPPPが反映されにくい
- 住居費は地域差が非常に大きい
- 教育費・医療費は国の制度によって大きく異なる

### まとめ

年収の額面だけでなく、「その国でどれだけの生活ができるか」を考えることが大切です。MoveWorthのシミュレーションで、移住先での実質的な豊かさを数字で確認してみてください。

[→ MoveWorthでシミュレーションを開始](https://moveworthapp.com/simulate)

### 参考資料
- [国際通貨基金（IMF）](https://www.imf.org)
- [世界銀行（World Bank）](https://www.worldbank.org)
- [経済協力開発機構（OECD）](https://www.oecd.org)
- [総務省統計局](https://www.stat.go.jp)
`;

// ============================================================
// バッチ更新
// ============================================================
const updates = [
  {
    slug: "a-40s-couples-guide-to-moving-to-lisbon-costs-taxes-and-2026",
    title: lisbonTitle,
    description: lisbonDesc,
    contentJa: lisbonJa,
  },
  {
    slug: "freelancers-guide-to-moving-to-barcelona-one-year-in-re-2026",
    title: barcelonaTitle,
    description: barcelonaDesc,
    contentJa: barcelonaJa,
  },
  {
    slug: "japanese-engineers-experience-moving-to-bangkok-2026",
    title: bangkokTitle,
    description: bangkokDesc,
    contentJa: bangkokJa,
  },
  {
    slug: "vancouver-relocation-for-it-engineers-a-comprehensive-g-2026",
    title: vancouverTitle,
    description: vancouverDesc,
    contentJa: vancouverJa,
  },
  {
    slug: "moving-to-kuala-lumpur-a-familys-cost-of-living-breakdo-2026",
    title: klTitle,
    description: klDesc,
    contentJa: klJa,
  },
];

const contentOnlyUpdates = [
  {
    slug: "malaysia-vs-thailand-comparison",
    contentJa: myvstContentJaClean,
  },
  {
    slug: "japan-500man-overseas-value",
    contentJa: pppContentJaClean,
  },
];

async function run() {
  // タイトル・説明・コンテンツを更新（5記事）
  for (const u of updates) {
    const { data: current } = await sb
      .from("blog_posts")
      .select("content")
      .eq("slug", u.slug)
      .single();

    const content = {
      ...(current?.content ?? {}),
      ja: u.contentJa,
    };

    const { error } = await sb
      .from("blog_posts")
      .update({ title: u.title, description: u.description, content })
      .eq("slug", u.slug);

    if (error) console.error(`❌ ${u.slug}:`, error.message);
    else console.log(`✅ ${u.slug}`);
  }

  // コンテンツのみ更新（2記事：AIアーティファクト除去）
  for (const u of contentOnlyUpdates) {
    const { data: current } = await sb
      .from("blog_posts")
      .select("content")
      .eq("slug", u.slug)
      .single();

    const content = {
      ...(current?.content ?? {}),
      ja: u.contentJa,
    };

    const { error } = await sb
      .from("blog_posts")
      .update({ content })
      .eq("slug", u.slug);

    if (error) console.error(`❌ ${u.slug}:`, error.message);
    else console.log(`✅ ${u.slug}`);
  }
}

run().catch(console.error);

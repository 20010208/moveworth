/**
 * 特定ビザ・特定テーマに特化した記事を生成するスクリプト
 * 用途: Search Consoleで上位圏にいるクエリを狙い撃ちにした記事
 */
import { existsSync, readFileSync } from "fs";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    const val = t.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Lang = "ja" | "en" | "zh";

interface ArticleSpec {
  slug: string;
  category: string;
  targetKeywords: string[];
  prompts: Record<Lang, string>;
}

const ARTICLES: ArticleSpec[] = [
  // ── MM2H ─────────────────────────────────────────────────────────
  {
    slug: "malaysia-mm2h-visa-complete-guide-2026",
    category: "visa-guide",
    targetKeywords: ["mm2h", "mm2h after 10 years", "mm2h requirements 2026", "malaysia my second home"],
    prompts: {
      ja: `あなたはMoveWorthというサービスのビザ情報ライターです。マレーシアの長期滞在ビザ「MM2H（Malaysia My Second Home）」に特化した記事を日本語で書いてください。

## タイトル形式（必ず守ること。絵文字・記号は一切使わないこと）
【2026年最新版】マレーシアMM2Hビザ完全ガイド｜取得条件・費用・10年後の更新まで徹底解説

## 本文の構成（見出しは必ず ### を使うこと）

[導入段落] ※見出しなし。MM2Hの概要と人気の理由を2〜3文で書く。

### MM2Hビザとは
制度の目的・歴史・特徴を200文字程度で解説。

### 2026年現在の取得条件
**財務要件（50歳未満）**
- 海外収入：月額最低〇〇RM
- 定期預金：〇〇万RM
- 資産証明：〇〇万RM

**財務要件（50歳以上）**
- 海外収入：月額最低〇〇RM
- 定期預金：〇〇万RM

**その他の要件**
- 健康診断
- 犯罪証明書
- 申請代理人（現地代理人）

### 申請費用と内訳
| 項目 | 費用 |
|------|------|
（申請費・代理人費・保険・預金など全項目を表で記載）

### ビザの有効期間と更新
- 初回有効期間
- **10年後の更新条件と更新費用**
- 更新時の注意点

### MM2H保持者の権利と制限
- 就労可否
- 不動産購入
- 車両購入特典
- 同伴家族

### 申請の流れ（ステップ別）
1. **事前準備**：必要書類の収集
2. **代理人選定**：認定代理人への依頼
3. **書類提出**：Immigration Departmentへ
4. **条件付き承認**：受取後の手続き
5. **定期預金開設**：マレーシア国内銀行
6. **ビザ発給**：パスポートへのスタンプ

### 生活費とコスト目安
| 項目 | 月額（RM） |
|------|-----------|
（家賃・生活費・医療保険等）

### MM2H取得後の注意点
1. **年間滞在日数**：最低〇日以上
2. **定期預金の維持**：引き出し条件
3. **税務上の注意**：マレーシアの税制
4. **更新忘れ防止**：更新申請タイミング

締め括りの文。MoveWorthシミュレーターへの誘導を含める。

---

### 参考資料
- **MM2H公式**: [Immigration Department of Malaysia – MM2H](https://www.imi.gov.my/index.php/en/main-services/mm2h.html)

## JSON形式で返答（JSONのみ、コードブロック不要）
{
  "title": "【2026年最新版】マレーシアMM2Hビザ完全ガイド｜取得条件・費用・10年後の更新まで徹底解説",
  "description": "マレーシアMM2Hビザの2026年最新条件（月収・定期預金要件）・申請費用・10年後更新・就労制限を徹底解説。120〜160文字で書く。",
  "content": "上記構成の記事本文（マークダウン、3000〜4500文字）"
}`,

      en: `You are a visa information writer for MoveWorth. Write a detailed, factual article about Malaysia's MM2H (Malaysia My Second Home) long-term visa in English, targeting people searching "mm2h after 10 years", "mm2h requirements 2026", "malaysia my second home".

## Title (strictly follow, no emojis):
Malaysia MM2H Visa 2026 Complete Guide | Requirements, Costs & 10-Year Renewal

## Article structure (### for all headings):

[Intro] — no heading. 2–3 sentences on MM2H as a popular long-stay visa.

### What Is MM2H?
Overview of the program, history, and why it's popular. ~150 words.

### 2026 Eligibility Requirements
**Under 50 years old**
- Offshore income: minimum RM X,XXX/month
- Fixed deposit: RM XXX,XXX
- Liquid assets: RM XXX,XXX

**50 years and above**
- Offshore income: minimum RM X,XXX/month
- Fixed deposit: RM XXX,XXX

**Other requirements**
- Medical examination
- Police clearance
- Licensed MM2H agent (mandatory)

### Application Fees & Cost Breakdown
| Item | Cost |
|------|------|
(all fees: application, agent, insurance, deposit, etc.)

### Validity & 10-Year Renewal
- Initial validity period
- **10-year renewal: conditions and fees**
- Key renewal pitfalls

### Rights & Restrictions for MM2H Holders
- Employment rules
- Property purchase
- Car import privileges
- Dependants

### Step-by-Step Application Process
1. **Preparation**: documents needed
2. **Agent selection**: licensed agents only
3. **Submission**: to Immigration Department
4. **Conditional approval**: next steps
5. **Fixed deposit**: open at Malaysian bank
6. **Visa issuance**: passport endorsement

### Cost of Living Estimate
| Item | Monthly (RM) |
|------|-------------|
(rent, living, medical insurance, etc.)

### Post-Approval Checklist
1. **Minimum stay**: required days per year
2. **Fixed deposit maintenance**: withdrawal rules
3. **Tax considerations**: Malaysian tax rules for MM2H holders
4. **Renewal timing**: when to start renewal process

Closing sentence with link to MoveWorth simulator.

---

### References
- **MM2H Official**: [Immigration Department of Malaysia – MM2H](https://www.imi.gov.my/index.php/en/main-services/mm2h.html)

## Return as JSON only (no code block):
{
  "title": "Malaysia MM2H Visa 2026 Complete Guide | Requirements, Costs & 10-Year Renewal",
  "description": "MM2H 2026 requirements (income, fixed deposit), application costs, 10-year renewal rules and employment restrictions. 120–160 chars.",
  "content": "Full article in the structure above (markdown, 3000–4500 chars)"
}`,

      zh: `您是MoveWorth服务的签证信息撰稿人。请用中文撰写一篇关于马来西亚MM2H（第二家园计划）长期签证的详细文章，目标关键词："mm2h申请条件""马来西亚第二家园""mm2h更新"。

## 标题格式（必须遵守，不使用表情符号）：
【2026年最新】马来西亚MM2H签证完全指南｜申请条件·费用·10年更新详解

## 文章结构（所有标题使用 ###）：

[导言] ※无标题。2～3句介绍MM2H的概况和受欢迎的原因。

### 什么是MM2H？
计划概述、历史及特点（约150字）。

### 2026年申请条件
**50岁以下**
- 海外收入：每月最低RM X,XXX
- 定期存款：RM XXX,XXX
- 流动资产：RM XXX,XXX

**50岁及以上**
- 海外收入：每月最低RM X,XXX
- 定期存款：RM XXX,XXX

**其他要求**
- 体检
- 无犯罪记录证明
- 认可代理人（必须）

### 申请费用明细
| 项目 | 费用 |
|------|------|
（所有费用：申请费、代理费、保险、存款等）

### 有效期与10年更新
- 初始有效期
- **10年更新条件与费用**
- 更新注意事项

### MM2H持有人权利与限制
- 就业规定
- 购房特权
- 进口汽车特权
- 随行家属

### 申请流程
1. **准备阶段**：所需文件
2. **选择代理人**：必须使用认可代理人
3. **提交申请**：移民局
4. **有条件批准**：后续手续
5. **开立定期存款**：马来西亚银行
6. **签证签发**：护照背书

### 生活费用参考
| 项目 | 月费（RM） |
|------|-----------|
（房租、生活费、医疗保险等）

### 获批后注意事项
1. **最低居留天数**：每年最低居留要求
2. **定期存款维护**：提取条件
3. **税务注意**：MM2H持有人的马来西亚税务
4. **更新时机**：何时开始更新申请

结语，引导至MoveWorth模拟器。

---

### 参考资料
- **MM2H官网**: [马来西亚移民局 – MM2H](https://www.imi.gov.my/index.php/en/main-services/mm2h.html)

## 仅返回JSON（无代码块）：
{
  "title": "【2026年最新】马来西亚MM2H签证完全指南｜申请条件·费用·10年更新详解",
  "description": "MM2H2026年申请条件（收入·定期存款要求）·申请费用·10年更新规则·就业限制完全解说。120～160字。",
  "content": "按上述结构的完整文章（Markdown格式，3000～4500字）"
}`,
    },
  },

  // ── Greece Residency Visa ─────────────────────────────────────────
  {
    slug: "greece-residency-visa-cost-2026",
    category: "visa-guide",
    targetKeywords: ["greece residency visa cost", "greece golden visa", "greece digital nomad visa"],
    prompts: {
      ja: `あなたはMoveWorthというサービスのビザ情報ライターです。ギリシャの居住ビザ（ゴールデンビザ・デジタルノマドビザ）の費用・条件に特化した記事を日本語で書いてください。Search Consoleで「greece residency visa cost」という英語クエリで検索されているため、英語圏の読者にも刺さる実践的な内容にしてください。

## タイトル形式（必ず守ること。絵文字・記号は一切使わないこと）
【2026年最新版】ギリシャ居住ビザの費用と条件完全ガイド｜ゴールデンビザ・ノマドビザ・長期滞在ビザ

## 本文の構成（見出しは必ず ### を使うこと）

[導入段落] ※見出しなし。ギリシャが移住先として注目される理由と、主要ビザの種類を2〜3文で紹介。

### ギリシャのビザ種類と費用一覧
| ビザ種類 | 主な対象 | 申請費用 | 最低条件 |
|---------|---------|---------|---------|
（ゴールデンビザ・デジタルノマドビザ・D型長期滞在ビザを表で比較）

### ゴールデンビザ（投資家向け居住許可）
**概要：** 投資による永住権取得ルート
**投資要件（2026年）：**
- 不動産投資：最低〇〇万ユーロ（地域によって異なる）
- 政府債券・ファンド等の代替投資オプション
**申請費用の内訳：**
| 項目 | 費用 |
|------|------|
（申請料・印紙税・代理人費用・不動産登記費等）
**有効期間と更新：** 初回5年、その後更新可能

### デジタルノマドビザ
**概要：** リモートワーカー向け1年間の滞在許可
**取得条件：**
- 月収：最低〇〇ユーロ
- 雇用形態：ギリシャ国外の雇用主またはフリーランス
- 健康保険の加入
**費用：**
| 項目 | 費用 |
|------|------|
**制限：** ギリシャ国内での就労禁止

### D型長期滞在ビザ（退職者・資産家向け）
**概要：** 証明可能な収入があれば取得可能
**収入要件：** 月額〇〇ユーロ以上
**費用：**
| 項目 | 費用 |
|------|------|
**家族同伴：** 追加費用

### 生活費・税金の目安
**所得税：** 累進課税〇〜〇%
**非居住者特例（Non-Dom制度）：** 条件と税メリット
**主要都市の生活費：**
| 都市 | 家賃（1LDK/月） | 生活費（月） |
|------|--------------|------------|
| アテネ | 〇〇〜〇〇ユーロ | 〇〇〜〇〇ユーロ |
| テッサロニキ | 〇〇〜〇〇ユーロ | 〇〇〜〇〇ユーロ |
| クレタ島 | 〇〇〜〇〇ユーロ | 〇〇〜〇〇ユーロ |

### ビザ申請の流れ
1. **ビザ種類の選定**：投資額・収入・目的に合わせて選択
2. **必要書類の準備**：翻訳・公証が必要な書類リスト
3. **ギリシャ大使館への申請**（国外からの場合）
4. **ギリシャ入国後の手続き**：居住許可証の取得
5. **住所登録とAFM（税務番号）取得**

### ゴールデンビザ 不動産選びの注意点
1. **2024年以降の規制強化**：アテネ等都市部の最低投資額引き上げ
2. **地域別投資額の違い**：島嶼部と本土で異なる条件
3. **管理費と固定資産税**：ENFIA（不動産税）の計算方法

締め括りの文。MoveWorthシミュレーターへの誘導。

---

### 参考資料
- **ゴールデンビザ**: [ギリシャ移民局 – 投資家居住許可](https://migration.gov.gr/en/)
- **デジタルノマドビザ**: [Enterprise Greece](https://www.enterprisegreece.gov.gr/)

## JSON形式で返答（JSONのみ、コードブロック不要）
{
  "title": "【2026年最新版】ギリシャ居住ビザの費用と条件完全ガイド｜ゴールデンビザ・ノマドビザ・長期滞在ビザ",
  "description": "ギリシャのゴールデンビザ（不動産投資最低額）・デジタルノマドビザ（月収条件・費用）・D型長期滞在ビザの2026年最新条件と費用を徹底比較。120〜160文字。",
  "content": "上記構成の記事本文（マークダウン、3000〜4500文字）"
}`,

      en: `You are a visa information writer for MoveWorth. Write a comprehensive article about Greece residency visa costs and requirements in 2026, targeting searchers of "greece residency visa cost", "greece golden visa cost", "greece digital nomad visa".

## Title (strictly follow, no emojis):
Greece Residency Visa Cost 2026 | Golden Visa, Digital Nomad & Long-Stay Visa Complete Guide

## Article structure (### for all headings):

[Intro] — no heading. 2–3 sentences on why Greece is attracting international residents and the main visa options.

### Greece Visa Types & Cost Comparison
| Visa Type | Target | Application Cost | Min. Requirement |
|-----------|--------|-----------------|-----------------|
(compare Golden Visa, Digital Nomad Visa, Type D Long-Stay Visa)

### Golden Visa (Investor Residency Permit)
**Overview:** Residency through investment
**Investment Requirements (2026):**
- Real estate: minimum €X,XXX,XXX (varies by region)
- Alternative options: government bonds, funds
**Full Cost Breakdown:**
| Item | Cost |
|------|------|
(application fee, stamp duty, lawyer fees, property registration, etc.)
**Validity & Renewal:** Initial 5 years, renewable

### Digital Nomad Visa
**Overview:** 1-year permit for remote workers
**Eligibility:**
- Monthly income: minimum €X,XXX
- Employment: non-Greek employer or freelance
- Health insurance required
**Costs:**
| Item | Cost |
|------|------|
**Restriction:** No work for Greek entities

### Type D Long-Stay Visa (Retirees & Passive Income)
**Overview:** For those with provable income
**Income requirement:** €X,XXX/month minimum
**Costs:**
| Item | Cost |
|------|------|
**Family members:** additional fee

### Living Costs & Taxes
**Income tax:** Progressive X–X%
**Non-Dom tax regime:** eligibility and flat-tax benefit
**City comparison:**
| City | 1BR Rent/month | Living Cost/month |
|------|---------------|------------------|
| Athens | €XXX–XXX | €XXX–XXX |
| Thessaloniki | €XXX–XXX | €XXX–XXX |
| Crete | €XXX–XXX | €XXX–XXX |

### Application Process
1. **Choose your visa type**: based on investment, income, or purpose
2. **Prepare documents**: translation and notarisation required
3. **Apply at Greek Embassy** (from abroad)
4. **Enter Greece and obtain residence permit**
5. **Register address and obtain AFM** (tax number)

### Golden Visa Real Estate: Key Considerations
1. **2024 investment threshold increase**: higher minimums in Athens & popular areas
2. **Regional differences**: islands vs. mainland minimums
3. **Ongoing costs**: ENFIA (property tax) calculation

Closing sentence with MoveWorth simulator link.

---

### References
- **Golden Visa**: [Greek Migration Ministry](https://migration.gov.gr/en/)
- **Digital Nomad Visa**: [Enterprise Greece](https://www.enterprisegreece.gov.gr/)

## Return as JSON only (no code block):
{
  "title": "Greece Residency Visa Cost 2026 | Golden Visa, Digital Nomad & Long-Stay Visa Complete Guide",
  "description": "Greece Golden Visa minimum investment, Digital Nomad Visa income requirements and full cost breakdown for all 2026 residency options. 120–160 chars.",
  "content": "Full article in the structure above (markdown, 3000–4500 chars)"
}`,

      zh: `您是MoveWorth服务的签证信息撰稿人。请用中文撰写一篇关于希腊居留签证费用与条件的详细文章，目标关键词："希腊黄金签证""希腊数字游牧签证""greece residency visa cost"。

## 标题格式（必须遵守，不使用表情符号）：
【2026年最新】希腊居留签证费用完全指南｜黄金签证·数字游牧签证·长期居留签证对比

## 文章结构（所有标题使用 ###）：

[导言] ※无标题。2～3句介绍希腊吸引移居者的原因及主要签证选项。

### 希腊签证类型与费用对比
| 签证类型 | 目标人群 | 申请费用 | 最低要求 |
|---------|---------|---------|---------|
（对比黄金签证、数字游牧签证、D型长期居留签证）

### 黄金签证（投资居留许可）
**概述：** 通过投资获得居留权
**2026年投资要求：**
- 房地产：最低€X,XXX,XXX（按地区不同）
- 替代投资：政府债券、基金等
**全部费用明细：**
| 项目 | 费用 |
|------|------|
（申请费、印花税、律师费、房产登记费等）
**有效期与更新：** 初始5年，可续签

### 数字游牧签证
**概述：** 远程工作者1年居留许可
**申请条件：**
- 月收入：最低€X,XXX
- 雇用关系：非希腊雇主或自由职业
- 必须购买健康保险
**费用：**
| 项目 | 费用 |
|------|------|
**限制：** 禁止为希腊实体工作

### D型长期居留签证（退休人员及被动收入者）
**概述：** 有可证明收入者可申请
**收入要求：** 每月最低€X,XXX
**费用：**
| 项目 | 费用 |
|------|------|
**家属随行：** 额外费用

### 生活费与税务概况
**所得税：** 累进税率X～X%
**非居民特殊税制（Non-Dom）：** 条件与税务优惠
**主要城市生活费参考：**
| 城市 | 1居室月租 | 月生活费 |
|------|---------|---------|
| 雅典 | €XXX–XXX | €XXX–XXX |
| 塞萨洛尼基 | €XXX–XXX | €XXX–XXX |
| 克里特岛 | €XXX–XXX | €XXX–XXX |

### 申请流程
1. **选择签证类型**：根据投资额、收入或目的选择
2. **准备文件**：需要翻译和公证的文件清单
3. **在希腊大使馆申请**（从境外申请时）
4. **入境希腊后办理居留许可**
5. **登记地址并获取AFM**（税务编号）

### 黄金签证房产购买注意事项
1. **2024年起投资门槛提高**：雅典等热门地区最低投资额上调
2. **地区差异**：岛屿与大陆不同要求
3. **持续费用**：ENFIA（房产税）计算方法

结语，引导至MoveWorth模拟器。

---

### 参考资料
- **黄金签证**: [希腊移民部](https://migration.gov.gr/en/)
- **数字游牧签证**: [Enterprise Greece](https://www.enterprisegreece.gov.gr/)

## 仅返回JSON（无代码块）：
{
  "title": "【2026年最新】希腊居留签证费用完全指南｜黄金签证·数字游牧签证·长期居留签证对比",
  "description": "希腊黄金签证最低投资额、数字游牧签证月收入要求及2026年所有居留签证费用详细对比。120～160字。",
  "content": "按上述结构的完整文章（Markdown格式，3000～4500字）"
}`,
    },
  },
];

async function generateContent(
  spec: ArticleSpec,
  lang: Lang
): Promise<{ title: string; description: string; content: string }> {
  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: spec.prompts[lang] }],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });
  return JSON.parse(res.choices[0].message.content!);
}

async function factCheck(content: string, topic: string, lang: string): Promise<string> {
  const prompt = `あなたは${topic}のビザ・移住情報に詳しい専門家です。以下の記事を精査し、費用・要件・数字の誤りのみを修正してください。

ルール：
- あなたの学習データに基づいて明らかに誤っている数字・事実のみ修正する
- 「確認できない」「インターネットにアクセスできない」などのメタコメントは絶対に書かないこと
- 修正した記事本文のみを返すこと（説明・コメント一切不要）
- 言語: ${lang}

${content}`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    max_tokens: 5000,
  });

  const result = res.choices[0].message.content ?? content;
  const banned = ["インターネットへのアクセス", "外部データベース", "確認することはできません", "I cannot verify", "cannot access the internet"];
  if (banned.some((p) => result.includes(p))) {
    console.warn(`  ⚠️ メタコメント検出 → 元のコンテンツを使用`);
    return content;
  }
  return result;
}

async function run() {
  const today = new Date().toISOString().split("T")[0];

  for (const spec of ARTICLES) {
    console.log(`\n${"=".repeat(50)}`);
    console.log(`🎯 Generating: ${spec.slug}`);
    console.log(`   Keywords: ${spec.targetKeywords.join(", ")}`);

    // Step 1: 生成（3言語並列）
    console.log("  📝 第1次生成（ja/en/zh）...");
    const [ja, en, zh] = await Promise.all([
      generateContent(spec, "ja"),
      generateContent(spec, "en"),
      generateContent(spec, "zh"),
    ]);

    // Step 2: ファクトチェック 1回目
    console.log("  🔍 ファクトチェック（第1回）...");
    const topic = spec.slug.includes("mm2h") ? "マレーシアMM2H" : "ギリシャ居住ビザ";
    const [fc1Ja, fc1En, fc1Zh] = await Promise.all([
      factCheck(ja.content, topic, "ja"),
      factCheck(en.content, topic, "en"),
      factCheck(zh.content, topic, "zh"),
    ]);

    // Step 3: ファクトチェック 2回目
    console.log("  🔍 ファクトチェック（第2回）...");
    const [finalJa, finalEn, finalZh] = await Promise.all([
      factCheck(fc1Ja, topic, "ja"),
      factCheck(fc1En, topic, "en"),
      factCheck(fc1Zh, topic, "zh"),
    ]);

    // Step 4: Supabase upsert
    const { error } = await supabase.from("blog_posts").upsert({
      slug: spec.slug,
      category: spec.category,
      published_at: today,
      reading_minutes: 12,
      thumbnail: null,
      title: { ja: ja.title, en: en.title, zh: zh.title },
      description: { ja: ja.description, en: en.description, zh: zh.description },
      content: { ja: finalJa, en: finalEn, zh: finalZh },
      locales: null,
      pinned: false,
      is_published: true,
    }, { onConflict: "slug" });

    if (error) {
      console.error(`  ❌ Insert failed: ${error.message}`);
    } else {
      console.log(`  ✅ Published: /blog/${spec.slug}`);
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log("✅ 全記事の生成・投稿完了");
}

run().catch(console.error);

export interface BlogPost {
  slug: string;
  category: "money" | "lifeplan" | "casestudy" | "about" | "visa";
  date: string;
  readingTime: number;
  title: { ja: string; en: string; zh?: string };
  description: { ja: string; en: string; zh?: string };
  content: { ja: string; en: string; zh?: string };
}

export const blogCategories = {
  money: { ja: "移住とお金", en: "Money & Relocation", zh: "移居与财务" },
  lifeplan: { ja: "ライフプラン", en: "Life Planning", zh: "生活规划" },
  casestudy: { ja: "国別ケーススタディ", en: "Country Case Studies", zh: "各国案例研究" },
  about: { ja: "MoveWorthについて", en: "About MoveWorth", zh: "关于MoveWorth" },
  visa: { ja: "ビザ・移住条件", en: "Visa & Requirements", zh: "签证与移居条件" },
} as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "moveworth-plan-guide-2026",
    category: "about",
    date: "2026-02-23",
    readingTime: 5,
    title: {
      ja: "Free・Pro・Premium徹底比較｜あなたに合うMoveWorthプランはどれ？",
      en: "Free vs Pro vs Premium: Which MoveWorth Plan Is Right for You?",
      zh: "免费版・专业版・高级版全面对比｜哪个MoveWorth套餐最适合你？",
    },
    description: {
      ja: "MoveWorthの各プランで使える機能を徹底解説。無料から始めて、必要な機能に合わせてアップグレードしましょう。",
      en: "A complete breakdown of every feature across MoveWorth plans. Start free and upgrade when you need more.",
      zh: "全面解析MoveWorth各套餐功能。从免费版开始，按需升级。",
    },
    content: {
      ja: `MoveWorthは**Free・Pro・Premium**の3つのプランを提供しています。この記事では、各プランで使える機能をわかりやすく解説します。

### Freeプラン（$0 / 無料）

まずは無料で試せる基本機能です。登録するだけですぐに使い始められます。

- **基本シミュレーション**: 現在地と移住先の資産推移を最大30年間シミュレーション
- **2カ国比較**: 現在の国と移住先の1カ国を並べて比較
- **資産推移チャート**: 折れ線グラフで将来の資産を視覚化
- **最大3件のシミュレーション保存**: ログイン後、過去の結果を保存・再確認

**こんな人におすすめ**: 「まず移住の財務的なイメージをつかみたい」という方に最適です。

---

### Proプラン（$5 / 月）

より深く分析したい方向けのプランです。Freeの全機能に加えて以下が使えます。

- **モンテカルロシミュレーション**: 1,000回の試行で資産推移の確率分布を算出。リスクを数値で把握できます
- **FIRE達成年齢計算**: 現在地と移住先で、経済的自立（FIRE）を達成できる年齢を比較。4%ルールに基づく目標資産額も自動計算
- **感度分析**: 年収・生活費・インフレ率などのパラメータが資産にどれだけ影響するかをトルネードチャートで表示
- **最大30件のシミュレーション保存**: さまざまなシナリオを保存して比較検討

**こんな人におすすめ**: 「移住のリスクとリターンを数字で理解したい」「FIREを目指している」方に。

---

### Premiumプラン（$15 / 月）

移住を本気で検討している方のための最上位プランです。Proの全機能に加えて以下が使えます。

- **月2回のAIレポート**: シミュレーション結果をAIが分析し、あなたの移住プランに最適化されたパーソナライズドPDFレポートを生成
- **最大4カ国の多国間比較**: 複数の移住候補国を同時に比較できます
- **最大100件の保存**: 長期間にわたる多様なシナリオを管理
- **優先サポート**: 問題が発生した際に優先的に対応

**こんな人におすすめ**: 「複数の候補国を絞り込みたい」「専門的なアドバイスをもとに意思決定したい」方に。

---

### プラン比較表

| 機能 | Free | Pro | Premium |
|------|:----:|:---:|:-------:|
| 基本シミュレーション | ✓ | ✓ | ✓ |
| 2カ国比較 | ✓ | ✓ | ✓ |
| 資産推移チャート | ✓ | ✓ | ✓ |
| シミュレーション保存 | 3件 | 30件 | 100件 |
| モンテカルロシミュレーション | - | ✓ | ✓ |
| FIRE達成年齢計算 | - | ✓ | ✓ |
| 感度分析 | - | ✓ | ✓ |
| 多国間比較（最大4カ国） | - | - | ✓ |
| AIレポート（月2回） | - | - | ✓ |
| 優先サポート | - | - | ✓ |

---

### まずは無料で始めましょう

どのプランが合うかわからない場合は、まずFreeプランで実際にシミュレーションしてみてください。使いながら「もっと詳しく分析したい」と感じたタイミングでアップグレードするのがおすすめです。

[シミュレーションページはこちら](/simulate)`,

      en: `MoveWorth offers three plans: **Free, Pro, and Premium**. Here's a complete breakdown of what you get with each.

### Free Plan ($0 / Forever Free)

Get started instantly — no credit card required.

- **Basic Simulation**: Project asset trajectories up to 30 years for your current and destination country
- **2-Country Comparison**: Compare your current location with one destination side by side
- **Asset Chart**: Visualize your financial future with line charts
- **Save up to 3 simulations**: Revisit and compare your past results after logging in

**Best for**: Anyone who wants to get a financial picture of what relocation might look like.

---

### Pro Plan ($5 / month)

For those who want deeper analysis. Includes everything in Free, plus:

- **Monte Carlo Simulation**: Run 1,000 scenarios to understand the probability distribution of your assets. Know your risk in numbers
- **FIRE Age Calculator**: Compare the age at which you can achieve financial independence (FIRE) in your current country vs. your destination. Based on the 4% rule
- **Sensitivity Analysis**: See how income, living costs, inflation, and other parameters affect your wealth via tornado charts
- **Save up to 30 simulations**: Store and compare multiple scenarios

**Best for**: Those who want to understand relocation risk and return quantitatively, or anyone pursuing FIRE.

---

### Premium Plan ($15 / month)

For serious relocation planning. Includes everything in Pro, plus:

- **AI Reports (2x/month)**: AI analyzes your simulation and generates a personalized PDF report with tailored advice for your relocation plan
- **Multi-country comparison (up to 4)**: Compare multiple destination candidates simultaneously
- **Save up to 100 simulations**: Manage long-term, multi-scenario planning
- **Priority support**: Get faster responses when you need help

**Best for**: Those narrowing down multiple destination countries, or anyone who wants data-driven, expert-level guidance.

---

### Plan Comparison

| Feature | Free | Pro | Premium |
|---------|:----:|:---:|:-------:|
| Basic Simulation | ✓ | ✓ | ✓ |
| 2-Country Comparison | ✓ | ✓ | ✓ |
| Asset Chart | ✓ | ✓ | ✓ |
| Saved Simulations | 3 | 30 | 100 |
| Monte Carlo Simulation | - | ✓ | ✓ |
| FIRE Age Calculator | - | ✓ | ✓ |
| Sensitivity Analysis | - | ✓ | ✓ |
| Multi-country (up to 4) | - | - | ✓ |
| AI Reports (2x/month) | - | - | ✓ |
| Priority Support | - | - | ✓ |

---

### Start Free Today

Not sure which plan is right for you? Start with the Free plan and upgrade when you're ready. There's no risk — you can simulate your financial future right now.

[Try the simulator here](/simulate)`,

      zh: `MoveWorth提供**免费版、专业版和高级版**三个套餐。本文将详细介绍各套餐的功能。

### 免费版（$0 / 永久免费）

无需信用卡，立即开始使用。

- **基础模拟**：预测当前居住地与目标移居国最长30年的资产变化
- **双国对比**：将当前居住地与1个目标国家并排比较
- **资产图表**：用折线图直观呈现财务未来
- **最多保存3个模拟记录**：登录后可随时查看历史结果

**适合人群**：想初步了解移居财务影响的用户。

---

### 专业版（$5 / 月）

适合需要深度分析的用户。包含免费版全部功能，另增加：

- **蒙特卡洛模拟**：通过1,000次模拟计算资产变化的概率分布，用数字量化风险
- **FIRE达成年龄计算**：比较在当前国家与目标国家实现财务自由（FIRE）的年龄。基于4%法则自动计算目标资产额
- **敏感性分析**：通过龙卷风图直观显示收入、生活费、通胀率等参数对资产的影响程度
- **最多保存30个模拟记录**：存储并比较多种情景

**适合人群**：希望量化移居风险与收益、或正在追求FIRE目标的用户。

---

### 高级版（$15 / 月）

为认真规划移居的用户打造。包含专业版全部功能，另增加：

- **AI报告（每月2次）**：AI分析您的模拟结果，生成个性化PDF报告，提供针对您移居计划的专属建议
- **多国对比（最多4国）**：同时比较多个候选国
- **最多保存100个模拟记录**：管理长期多场景规划
- **优先支持**：遇到问题时享受优先响应服务

**适合人群**：正在筛选多个候选国、或希望获得数据驱动专业指导的用户。

---

### 套餐对比表

| 功能 | 免费版 | 专业版 | 高级版 |
|------|:-----:|:-----:|:-----:|
| 基础模拟 | ✓ | ✓ | ✓ |
| 双国对比 | ✓ | ✓ | ✓ |
| 资产图表 | ✓ | ✓ | ✓ |
| 模拟记录保存 | 3个 | 30个 | 100个 |
| 蒙特卡洛模拟 | - | ✓ | ✓ |
| FIRE达成年龄计算 | - | ✓ | ✓ |
| 敏感性分析 | - | ✓ | ✓ |
| 多国对比（最多4国） | - | - | ✓ |
| AI报告（每月2次） | - | - | ✓ |
| 优先支持 | - | - | ✓ |

---

### 立即免费开始

不确定哪个套餐适合您？先从免费版开始，感受够了再升级。现在就可以免费模拟您的财务未来。

[前往模拟页面](/simulate)`,
    },
  },
  {
    slug: "overseas-relocation-failure-money",
    category: "money",
    date: "2026-02-20",
    readingTime: 5,
    title: {
      ja: "海外移住の失敗理由1位は『お金の問題』？失敗しないためのシミュレーションの重要性",
      en: "The #1 Reason for Failed Relocations Is Money — Why Simulation Matters",
      zh: "海外移居失败头号原因是『钱』？——财务模拟的重要性",
    },
    description: {
      ja: "なぜ「なんとなく」の移住が危険なのか。事前の資産シミュレーションで防げる失敗パターンを解説します。",
      en: "Why vague relocation plans are risky and how asset simulation can prevent common failure patterns.",
      zh: "为什么漫无目的的移居计划很危险？事先做好财务模拟，可以避免常见的失败模式。",
    },
    content: {
      ja: `海外移住は人生を大きく変える決断です。新しい文化、新しい環境、新しいキャリア。夢は膨らみますが、現実的な問題として最も多くの人を悩ませるのが「お金」です。

実際に、海外移住経験者を対象としたアンケートでは、移住後に最も困ったこととして「生活費が想定以上だった」「為替変動で貯蓄が目減りした」「税金の仕組みが異なり手取りが減った」といった経済的な問題が上位を占めています。

### なぜ「なんとなく」の移住計画は危険なのか

多くの人が移住を計画する際、「あの国は物価が安いから大丈夫だろう」「日本より税金が低いらしい」といった漠然としたイメージで判断しがちです。しかし、実際の生活コストは住居費、食費、交通費、医療費、教育費など複合的な要因で決まります。

例えば、東南アジアは一般的に物価が安いとされますが、日本人が快適に暮らせる住居やインターナショナルスクールの費用は、日本と同等かそれ以上になることも珍しくありません。

### シミュレーションが解決する3つの問題

**1. 生活コストの「見える化」**
MoveWorthでは、移住先の家賃・生活費・税率を入力することで、5年・10年後の資産推移を具体的な数字で確認できます。「なんとなく安そう」ではなく、データに基づいた判断が可能になります。

**2. 為替リスクの考慮**
円建ての資産が移住先通貨でどの程度の価値を持つのか、為替レートを反映したシミュレーションで確認できます。

**3. 現在の国との比較**
移住した場合と、日本に残った場合の資産推移を並べて比較できるため、「本当に移住すべきか」の判断材料が明確になります。

### まとめ

海外移住の成功と失敗を分ける最大の要因は、事前の経済的な準備です。MoveWorthの無料シミュレーションで、まずはあなたの移住プランを数字で検証してみてください。データに基づく判断が、後悔のない移住への第一歩です。`,
      en: `Moving abroad is a life-changing decision. New culture, new environment, new career opportunities. While dreams are exciting, the most common challenge people face is money.

Surveys of overseas relocators consistently show that financial issues top the list of post-move difficulties: "Living costs were higher than expected," "Currency fluctuations eroded my savings," and "Different tax systems reduced my take-home pay."

### Why Vague Relocation Plans Are Dangerous

Many people plan their move based on vague impressions: "That country is cheap" or "Taxes are lower there." However, actual living costs depend on multiple factors — housing, food, transportation, healthcare, and education.

For example, while Southeast Asia is generally considered affordable, the cost of comfortable housing and international schools for Japanese expatriates can equal or exceed costs in Japan.

### 3 Problems Simulation Solves

**1. Visualizing Living Costs**
MoveWorth lets you input destination rent, living expenses, and tax rates to see concrete asset projections over 5-10 years. Replace "probably cheap" with data-driven decisions.

**2. Currency Risk Assessment**
See how your yen-denominated assets translate to local currency value with exchange rate-adjusted simulations.

**3. Side-by-Side Comparison**
Compare asset trajectories between staying and relocating, giving you clear evidence for your decision.

### Conclusion

The biggest factor separating successful and failed relocations is financial preparation. Try MoveWorth's free simulation to validate your relocation plan with real numbers. Data-driven decisions are the first step to a regret-free move.`,
    },
  },
  {
    slug: "initial-costs-overseas-relocation-2026",
    category: "money",
    date: "2026-02-18",
    readingTime: 6,
    title: {
      ja: "【2026年最新】海外移住にかかる初期費用の目安：ビザ、航空券、住居デポジットまで",
      en: "Overseas Relocation Costs in 2026: Visas, Flights, and Housing Deposits",
      zh: "【2026年最新】海外移居初期费用指南：签证、机票、押金全解析",
    },
    description: {
      ja: "海外移住で実際にかかる初期費用を項目別に解説。シミュレーションの入力値を考える際の参考に。",
      en: "A breakdown of actual initial costs for overseas relocation, useful as reference when inputting simulation values.",
      zh: "按项目详解海外移居的实际初期费用，可作为模拟器输入值的参考。",
    },
    content: {
      ja: `海外移住を決意したら、まず把握すべきなのが「初期費用」です。毎月の生活費とは別に、移住開始時にまとまった出費が発生します。2026年の最新情報をもとに、主な費用項目を整理しました。

### 1. ビザ申請費用

移住先の国とビザの種類によって大きく異なります。

- **就労ビザ（マレーシア）**: 約5〜15万円（雇用主負担の場合も）
- **MM2H（マレーシア長期滞在ビザ）**: 申請費用＋定期預金（約500万円〜）
- **就労ビザ（タイ）**: 約3〜10万円
- **ワーキングホリデー（オーストラリア）**: 約5〜7万円

エージェントを利用する場合は、別途手数料（10〜30万円程度）がかかることもあります。

### 2. 航空券

片道航空券の目安（エコノミー）:
- 東南アジア: 3〜8万円
- ヨーロッパ: 8〜20万円
- 北米: 8〜18万円
- オセアニア: 5〜12万円

家族での移住の場合は人数分が必要です。荷物の超過料金や、ペットの輸送費用も考慮しましょう。

### 3. 住居の初期費用

多くの国では、日本と同様にデポジット（敷金）が必要です。

- **マレーシア**: 家賃2〜3ヶ月分のデポジット＋光熱費デポジット0.5ヶ月分
- **タイ**: 家賃2ヶ月分のデポジット
- **シンガポール**: 家賃1〜2ヶ月分
- **ドイツ**: 家賃3ヶ月分まで（Kaution）

家具付き物件を選べば家具購入費を抑えられますが、家賃は高くなる傾向があります。

### 4. その他の費用

- **海外引越し費用**: 20〜80万円（荷物量・距離による）
- **海外旅行保険 / 現地保険加入**: 年間10〜30万円
- **生活立ち上げ費**: 家具・家電・SIMカード・銀行口座開設など（5〜20万円）
- **日本側の手続き**: 海外転出届、年金・保険の手続き（基本無料だが交通費等）

### MoveWorthでの活用法

MoveWorthのシミュレーターでは「初期貯蓄額」を入力できます。上記の初期費用を差し引いた金額を入力することで、より現実的な資産推移予測が可能です。移住先国を選択すれば、その国のデフォルト生活費データも参考にできます。

初期費用を正確に把握することが、安心な移住計画の第一歩です。`,
      en: `Once you decide to move abroad, the first thing to understand is your initial costs. Beyond monthly living expenses, you'll face significant upfront spending. Here's a 2026 breakdown of major cost categories.

### 1. Visa Application Fees

Costs vary significantly by country and visa type:

- **Work Visa (Malaysia)**: ~$350-1,050 (sometimes employer-paid)
- **MM2H (Malaysia Long-term Visa)**: Application fee + fixed deposit (~$35,000+)
- **Work Visa (Thailand)**: ~$200-700
- **Working Holiday (Australia)**: ~$350-500

Using an immigration agent may cost an additional $700-2,100.

### 2. Flights

One-way economy ticket estimates:
- Southeast Asia: $200-550
- Europe: $550-1,400
- North America: $550-1,250
- Oceania: $350-850

Multiply by family size. Don't forget excess baggage fees and pet transport costs.

### 3. Housing Initial Costs

Most countries require deposits similar to Japan:

- **Malaysia**: 2-3 months rent deposit + 0.5 month utilities deposit
- **Thailand**: 2 months rent deposit
- **Singapore**: 1-2 months rent
- **Germany**: Up to 3 months rent (Kaution)

Furnished properties save on furniture costs but tend to have higher rent.

### 4. Other Costs

- **International moving**: $1,400-5,600 (depends on volume and distance)
- **Health insurance**: $700-2,100/year
- **Setup costs**: Furniture, appliances, SIM card, bank account ($350-1,400)
- **Japan-side procedures**: Moving-out notification, pension/insurance procedures

### Using MoveWorth

MoveWorth's simulator lets you input "initial savings." Subtract the above costs from your actual savings for a more realistic asset projection. Selecting your destination country provides default living cost data as reference.

Accurately understanding initial costs is the first step to a secure relocation plan.`,
    },
  },
  {
    slug: "accurate-living-cost-estimation",
    category: "money",
    date: "2026-02-15",
    readingTime: 5,
    title: {
      ja: "円安・物価高に負けない！海外移住の『生活コスト』を正確に見積もる3つのコツ",
      en: "3 Tips to Accurately Estimate Living Costs for Your Move Abroad",
      zh: "不惧日元贬值！精准估算海外移居生活成本的3个技巧",
    },
    description: {
      ja: "シミュレーションの精度を上げるための、生活コスト見積もりのアドバイス。",
      en: "Practical advice to improve your simulation accuracy with better cost estimates.",
      zh: "提高模拟精度的生活成本估算建议。",
    },
    content: {
      ja: `2026年現在、円安と世界的な物価上昇が続いています。「海外は安い」という従来のイメージが通用しなくなりつつある中、正確な生活コストの見積もりがますます重要になっています。

### コツ1: 現地の「日本人向け」価格を調べる

各国の平均的な物価データだけでは不十分です。日本人が実際に暮らす場合、以下の点で費用が上がる傾向があります。

- **住居**: 安全なエリア、清潔な物件を選ぶと現地平均の1.5〜3倍
- **食費**: 日本食材や日本食レストランは割高
- **教育費**: インターナショナルスクールは現地校の5〜10倍

MoveWorthでは「家賃」と「生活費」を個別に入力できるため、自分の生活スタイルに合った金額を設定しましょう。現地の日本人コミュニティやブログから、リアルな金額を収集することをお勧めします。

### コツ2: インフレ率を甘く見ない

シミュレーションでは「インフレ率」が結果に大きな影響を与えます。特に新興国では年間5〜10%のインフレが珍しくありません。

- **マレーシア**: 約2〜3%
- **タイ**: 約2〜4%
- **トルコ**: 約40〜70%（近年）
- **日本**: 約2〜3%

MoveWorthでは各国のデフォルトインフレ率が設定されていますが、保守的に少し高めの値を入力しておくと、より安全な計画が立てられます。

### コツ3: 為替レートの変動幅を考慮する

為替レートは日々変動します。現在のレートだけでなく、過去5年間の変動幅を確認しましょう。

例えば、マレーシアリンギット対円は：
- 2021年: 1 MYR ≒ 26円
- 2024年: 1 MYR ≒ 34円
- 2026年: 1 MYR ≒ 40円

約55%もの変動があります。MoveWorthではリアルタイム為替レートを自動取得しますが、「もし円安がさらに進んだら」というシナリオも考えておくべきです。

### まとめ

生活コストの見積もりは「楽観的すぎず、悲観的すぎず」がポイントです。MoveWorthのシミュレーターに現実的な数値を入力し、複数のシナリオで比較することで、より確実な移住計画を立てましょう。`,
      en: `In 2026, the weak yen and global inflation continue. The old assumption that "overseas is cheap" is increasingly unreliable, making accurate cost estimation more important than ever.

### Tip 1: Research "Expat-Level" Prices

Average local cost data isn't enough. When Japanese expatriates actually live abroad, costs tend to be higher in several areas:

- **Housing**: Safe areas and clean properties cost 1.5-3x the local average
- **Food**: Japanese groceries and restaurants carry premium prices
- **Education**: International schools cost 5-10x local schools

MoveWorth lets you input rent and living costs separately, so set amounts matching your actual lifestyle. We recommend gathering real figures from local Japanese communities and blogs.

### Tip 2: Don't Underestimate Inflation

Inflation rates significantly impact simulation results. Emerging countries commonly see 5-10% annual inflation.

- **Malaysia**: ~2-3%
- **Thailand**: ~2-4%
- **Turkey**: ~40-70% (recent years)
- **Japan**: ~2-3%

MoveWorth provides default inflation rates per country, but inputting slightly higher values creates a more conservative, safer plan.

### Tip 3: Consider Exchange Rate Volatility

Exchange rates fluctuate daily. Check the 5-year range, not just today's rate.

For example, MYR to JPY:
- 2021: 1 MYR ≒ ¥26
- 2024: 1 MYR ≒ ¥34
- 2026: 1 MYR ≒ ¥40

That's about 55% variation. MoveWorth auto-fetches real-time rates, but consider "what if the yen weakens further" scenarios too.

### Conclusion

The key to cost estimation is being "neither too optimistic nor too pessimistic." Input realistic numbers into MoveWorth's simulator and compare multiple scenarios for a more reliable relocation plan.`,
    },
  },
  {
    slug: "5-year-asset-career-plan",
    category: "lifeplan",
    date: "2026-02-12",
    readingTime: 5,
    title: {
      ja: "5年後の資産はどうなる？シミュレーション結果から考えるキャリアプラン",
      en: "What Will Your Assets Look Like in 5 Years? Career Planning with Simulation",
      zh: "5年后资产会怎样？用模拟结果规划职业生涯",
    },
    description: {
      ja: "シミュレーション期間の活用法と、結果を基にしたキャリアプランの考え方。",
      en: "How to use simulation timeframes and plan your career based on results.",
      zh: "如何设置模拟时间跨度，并根据结果制定职业规划。",
    },
    content: {
      ja: `「5年後、自分の資産はどうなっているだろう？」——この問いに具体的な数字で答えられる人は少ないのではないでしょうか。特に海外移住を検討している場合、不確定要素が多く、先の見通しが立ちにくいものです。

### シミュレーション期間の設定

MoveWorthでは、1年〜30年の期間でシミュレーションを実行できます。キャリアプランを考える際は、以下の期間設定がおすすめです。

- **3年**: 短期的な移住体験、ワーキングホリデーなど
- **5年**: 一般的なキャリアの区切り、最初の評価ポイント
- **10年**: 長期的な資産形成、FIRE計画の中間地点
- **20〜30年**: 定年までの資産推移、リタイアメント計画

### 5年後の資産で見えてくること

シミュレーション結果のグラフで、5年後の資産額を確認しましょう。以下の判断材料が得られます。

**資産が増加している場合:**
- 現在の収入と支出のバランスが良好
- 移住先での生活が経済的に持続可能
- 次のキャリアステップ（転職、独立など）を検討する余裕がある

**資産が横ばいまたは減少している場合:**
- 支出の見直しが必要
- 収入アップの戦略を考えるべき（スキルアップ、副業、転職）
- 移住先の再検討も視野に

### キャリアプランへの活用

シミュレーション結果を「現在の国に残った場合」と比較することで、移住の経済的メリットが明確になります。

例えば：
- 日本で年収500万円の場合 → 5年後の資産: 800万円
- マレーシアで年収600万円相当の場合 → 5年後の資産: 1,200万円

この差額400万円は、新しいキャリアへの投資原資になります。語学学校、資格取得、起業資金など、次のステップに活用できる「余裕」が生まれるかどうかを数字で確認しましょう。

### まとめ

キャリアプランは「やりたいこと」だけでなく、「経済的に可能なこと」の視点も重要です。MoveWorthのシミュレーションで5年後の自分の姿を数字で確認し、データに基づいたキャリア設計を始めてみてください。`,
      en: `"What will my assets look like in 5 years?" — Few people can answer this with concrete numbers. Especially when considering overseas relocation, with many uncertainties, it's hard to see ahead.

### Setting Simulation Periods

MoveWorth supports simulations from 1 to 30 years. For career planning, consider these timeframes:

- **3 years**: Short-term relocation, working holidays
- **5 years**: Typical career milestone, first evaluation point
- **10 years**: Long-term wealth building, FIRE plan midpoint
- **20-30 years**: Pre-retirement asset trajectory

### What 5-Year Results Reveal

Check your 5-year asset figure on the simulation graph. It provides these insights:

**If assets are growing:**
- Your income-expense balance is healthy
- Life abroad is financially sustainable
- You have room to consider next career steps (job change, entrepreneurship)

**If assets are flat or declining:**
- Review your expenses
- Consider income growth strategies (upskilling, side projects, job change)
- Reconsidering your destination may be worthwhile

### Applying to Career Plans

Compare "staying" vs "relocating" results to see the economic benefit clearly.

For example:
- Japan with ¥5M annual income → 5-year assets: ¥8M
- Malaysia with ¥6M equivalent → 5-year assets: ¥12M

That ¥4M difference becomes investment capital for your next career step — language school, certifications, startup funding. Verify with numbers whether you'll have the "margin" for your next move.

### Conclusion

Career planning needs both "what I want to do" and "what's financially possible." Use MoveWorth to see your 5-year future in numbers and start data-driven career design.`,
    },
  },
  {
    slug: "fire-overseas-relocation",
    category: "lifeplan",
    date: "2026-02-10",
    readingTime: 6,
    title: {
      ja: "FIREを目指す海外移住。モンテカルロ分析でわかる『資産リスク』の真実",
      en: "FIRE Through Overseas Relocation: Asset Risk Revealed by Monte Carlo Analysis",
      zh: "以海外移居实现FIRE——蒙特卡洛分析揭示资产风险真相",
    },
    description: {
      ja: "FIRE（経済的自立・早期退職）と海外移住の関係性、モンテカルロ分析の活用法を解説。",
      en: "How FIRE and overseas relocation connect, and how Monte Carlo analysis reveals asset risks.",
      zh: "解析FIRE与海外移居的关系，以及蒙特卡洛分析的应用方法。",
    },
    content: {
      ja: `FIRE（Financial Independence, Retire Early）を目指す人にとって、海外移住は強力な選択肢です。日本より生活費が低い国に移住すれば、FIRE達成に必要な資産額を大幅に引き下げることができます。

### FIRE達成に必要な資産額

FIREの基本的な考え方は「4%ルール」です。年間支出の25倍の資産を築けば、投資リターンだけで生活できるとされています。

- **日本（年間支出300万円の場合）**: 7,500万円
- **マレーシア（年間支出180万円の場合）**: 4,500万円
- **タイ（年間支出150万円の場合）**: 3,750万円

移住先を変えるだけで、必要資産額に数千万円の差が生まれます。

### モンテカルロ分析とは

しかし、「4%ルール」は過去の米国株式市場のデータに基づいた目安であり、将来も同じように機能する保証はありません。ここで活躍するのがモンテカルロ分析です。

モンテカルロ分析では、投資リターンやインフレ率にランダムな変動を加えた1,000回のシミュレーションを実行します。その結果から「最悪のケースでも資産が持つか」「元本割れする確率は何%か」を確認できます。

### シミュレーションで見えるリスク

例えば、以下のようなケースを考えてみましょう。

**35歳、貯蓄2,000万円、マレーシア移住の場合：**
- 中央値（50%確率）: 60歳時点で5,200万円
- 悲観的（10%確率）: 60歳時点で1,800万円
- 元本割れ確率: 8%

この「8%の元本割れ確率」が許容できるかどうかは、個人のリスク許容度によります。もし不安なら、支出を少し抑えるか、パートタイムの収入源を確保するといった対策が考えられます。

### FIRE計画にMoveWorthを活用する

MoveWorthのシミュレーターでは、以下のステップでFIRE計画を検証できます。

1. 現在の貯蓄額と年収を入力
2. 移住先の生活費を入力（家賃・生活費を分けて入力可能）
3. 投資リターン率を設定（保守的な4〜5%がおすすめ）
4. シミュレーション期間を「FIRE目標年齢 - 現在年齢」に設定

結果のグラフで、FIRE目標額に到達するタイミングを確認しましょう。

### まとめ

FIRE×海外移住は非常に魅力的な組み合わせですが、リスクを正しく理解することが重要です。MoveWorthのシミュレーションで、あなたのFIRE計画が現実的かどうかを確認してみてください。`,
      en: `For those pursuing FIRE (Financial Independence, Retire Early), overseas relocation is a powerful option. Moving to a country with lower living costs can dramatically reduce the assets needed for FIRE.

### Assets Needed for FIRE

FIRE's foundation is the "4% rule" — build 25x your annual expenses, and investment returns sustain your lifestyle.

- **Japan (¥3M annual expenses)**: ¥75M needed
- **Malaysia (¥1.8M annual expenses)**: ¥45M needed
- **Thailand (¥1.5M annual expenses)**: ¥37.5M needed

Simply changing your destination creates tens of millions of yen in difference.

### What Is Monte Carlo Analysis?

However, the "4% rule" is based on historical US stock market data with no guarantee of future performance. This is where Monte Carlo analysis helps.

Monte Carlo analysis runs 1,000 simulations with random variations in investment returns and inflation. The results show "will assets survive worst-case scenarios" and "what's the probability of losing principal."

### Risks Revealed by Simulation

Consider this example:

**Age 35, ¥20M savings, relocating to Malaysia:**
- Median (50th percentile): ¥52M at age 60
- Pessimistic (10th percentile): ¥18M at age 60
- Principal loss probability: 8%

Whether that 8% risk is acceptable depends on your personal risk tolerance. If concerned, consider slightly reducing expenses or securing part-time income.

### Using MoveWorth for FIRE Planning

1. Input current savings and income
2. Input destination living costs (rent and expenses separately)
3. Set investment return rate (conservative 4-5% recommended)
4. Set period to "FIRE target age minus current age"

Check the results graph for when you reach your FIRE target amount.

### Conclusion

FIRE combined with overseas relocation is attractive, but understanding risks is crucial. Use MoveWorth's simulation to verify whether your FIRE plan is realistic.`,
    },
  },
  {
    slug: "single-vs-family-simulation",
    category: "lifeplan",
    date: "2026-02-08",
    readingTime: 5,
    title: {
      ja: "独身vs家族。ライフ構成別・海外移住シミュレーションのチェックポイント",
      en: "Single vs. Family: Overseas Relocation Simulation Checkpoints by Life Stage",
      zh: "单身vs家庭——按人生阶段划分的海外移居模拟要点",
    },
    description: {
      ja: "独身と家族帯同では移住シミュレーションの考慮点が大きく異なります。それぞれのポイントを解説。",
      en: "Simulation considerations differ greatly between single and family relocations. Key points for each.",
      zh: "单身移居与携家移居的模拟注意事项大不相同，本文分别解析各自的要点。",
    },
    content: {
      ja: `海外移住のシミュレーションで重要なのは、「誰と移住するか」によって考慮すべきポイントが大きく変わるということです。独身での移住と、家族帯同の移住では、コスト構造も生活の優先事項もまったく異なります。

### 独身の場合のチェックポイント

**住居費の最適化がしやすい**
一人暮らしであれば、ステュディオタイプやシェアハウスなど、コスト効率の良い住居を選べます。家賃を大幅に抑えることが可能です。

**生活費の変動が大きい**
自炊中心なら食費を抑えられますが、外食が多い場合は想定以上に膨らむことがあります。シミュレーションでは、現実的な生活費を入力しましょう。

**キャリアの柔軟性**
転職や帰国の判断を自分だけで行えるため、「まず3年試してみる」という短期シミュレーションも有効です。

**シミュレーションのコツ:**
- 期間: 3〜5年の短期設定
- 生活費: 外食・娯楽費を含めた現実的な金額
- 貯蓄率: 独身の方が高く設定できることが多い

### 家族帯同の場合のチェックポイント

**教育費が最大の変動要因**
子どもの年齢と人数によって、教育費は大きく変わります。

- 現地校: ほぼ無料〜年間数万円
- インターナショナルスクール: 年間100〜300万円/人

MoveWorthの生活費入力に、教育費を含めた金額を設定しましょう。

**医療費・保険の重要性**
家族全員分の医療保険が必要です。国によっては公的医療保険に加入できない場合もあり、民間保険の費用（家族4人で年間40〜100万円）を生活費に含める必要があります。

**配偶者の就労可否**
配偶者がビザの制約で就労できない場合、世帯収入が減少します。シミュレーションの「年収」欄には、実際に得られる収入のみを入力してください。

**シミュレーションのコツ:**
- 期間: 10年以上の長期設定
- 生活費: 教育費・医療保険を必ず含める
- 年収: 配偶者の就労状況を反映した現実的な金額

### 共通のポイント

どちらの場合も、MoveWorthの「現在の国との比較」機能を活用しましょう。移住した場合と残った場合の差額を確認し、その差額が移住に伴うリスク（言語の壁、文化の違い、キャリアの中断）に見合うかを総合的に判断することが大切です。`,
      en: `A crucial aspect of relocation simulation is that considerations change dramatically based on "who you're moving with." Cost structures and life priorities differ completely between single and family relocations.

### Single Relocation Checkpoints

**Easier Housing Cost Optimization**
Living alone means access to studios, shared housing, and other cost-efficient options. You can significantly reduce rent.

**Variable Living Costs**
Cooking at home keeps food costs low, but frequent dining out can exceed expectations. Input realistic living costs in your simulation.

**Career Flexibility**
You can make job change or return decisions independently, making "try 3 years first" short-term simulations viable.

**Simulation Tips:**
- Period: 3-5 year short-term
- Living costs: Include dining out and entertainment realistically
- Savings rate: Often higher for singles

### Family Relocation Checkpoints

**Education Is the Biggest Variable**
Education costs vary dramatically by children's ages and number:

- Local schools: Nearly free to a few hundred dollars/year
- International schools: $7,000-21,000/year per child

Include education costs in MoveWorth's living cost input.

**Healthcare & Insurance Matter**
Medical insurance for the whole family is essential. Some countries don't offer public insurance to foreigners — private insurance (¥400K-1M/year for family of 4) must be factored in.

**Spouse Employment**
If your spouse can't work due to visa restrictions, household income drops. Input only actually obtainable income in the "annual income" field.

**Simulation Tips:**
- Period: 10+ years long-term
- Living costs: Always include education and health insurance
- Income: Reflect spouse's employment status realistically

### Common Points

In both cases, use MoveWorth's comparison feature. Check the difference between staying and relocating, then judge whether that difference justifies relocation risks (language barriers, cultural differences, career interruption).`,
    },
  },
  {
    slug: "malaysia-vs-thailand-comparison",
    category: "casestudy",
    date: "2026-02-05",
    readingTime: 6,
    title: {
      ja: "マレーシアvsタイ！人気アジア移住で資産はどう変わる？（シミュレーション比較付）",
      en: "Malaysia vs Thailand: How Do Assets Change? (With Simulation Comparison)",
      zh: "马来西亚vs泰国！热门亚洲移居地资产对比（附模拟数据）",
    },
    description: {
      ja: "日本人に人気のマレーシアとタイ、シミュレーション結果を比較して違いを解説。",
      en: "Comparing simulation results between Malaysia and Thailand, two popular destinations for Japanese expats.",
      zh: "对比马来西亚与泰国的模拟结果，解析两国移居的财务差异。",
    },
    content: {
      ja: `マレーシアとタイは、日本人の海外移住先として常に上位にランクインする人気国です。どちらも温暖な気候、日本人コミュニティの存在、比較的低い生活費が魅力ですが、経済的な面では違いがあります。MoveWorthのシミュレーションで比較してみましょう。

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

MoveWorthで両国のシミュレーションを実行し、自分の条件に合った比較をしてみてください。`,
      en: `Malaysia and Thailand consistently rank among the top overseas relocation destinations for Japanese expatriates. Both offer warm climates, Japanese communities, and relatively low living costs, but economic differences exist. Let's compare using MoveWorth simulations.

### Basic Data Comparison (2026)

| Item | Malaysia | Thailand |
|------|----------|----------|
| Currency | Ringgit (MYR) | Baht (THB) |
| Average Rent (KL/BKK central 1BR) | ~3,500 MYR | ~20,000 THB |
| In JPY | ~¥115,000 | ~¥85,000 |
| Income Tax (top rate) | 30% | 35% |
| Inflation | ~2.5% | ~3% |
| Corporate Tax | 24% | 20% |

### Simulation Parameters

MoveWorth simulation with these conditions:

- **Current location**: Japan (Tokyo)
- **Age**: 30
- **Income**: ¥5M (Japan) / equivalent abroad
- **Savings**: ¥5M
- **Period**: 10 years

### Results

**Staying in Japan:** ¥14.5M after 10 years

**Malaysia:** ¥18.5M (+¥4M)
- Slightly higher rent but lower income tax
- Stable inflation
- Good investment environment

**Thailand:** ¥17.5M (+¥3M)
- Significantly cheaper rent
- Slightly higher income tax
- Cheap food keeps overall costs low

### Key Insights

**Malaysia's Strengths:** Lower income tax, English-friendly, tech jobs, MM2H visa

**Thailand's Strengths:** Very cheap rent/food, large Japanese community (Bangkok), high medical standards, many Japanese companies

### Which to Choose?

Numbers slightly favor Malaysia, but the gap is small. Decide based on: English confidence → Malaysia; Minimize costs → Thailand; IT/Finance career → Malaysia; Japanese community priority → Thailand.

Try both simulations on MoveWorth with your personal conditions.`,
    },
  },
  {
    slug: "japan-500man-overseas-value",
    category: "casestudy",
    date: "2026-02-03",
    readingTime: 5,
    title: {
      ja: "日本での年収500万円は、海外ではそれだけに相当するのか？『購買力平価』で考える",
      en: "Is ¥5M in Japan Worth the Same Abroad? Thinking in Purchasing Power Parity",
      zh: "日本年收入500万日元，在海外价值几何？用购买力平价来思考",
    },
    description: {
      ja: "年収の額面だけでは判断できない、購買力平価（PPP）の考え方と活用法。",
      en: "Why nominal income isn't enough — understanding and using Purchasing Power Parity (PPP).",
      zh: "不能只看收入数字——购买力平价（PPP）的概念与应用方法。",
    },
    content: {
      ja: `「年収500万円」と聞くと、日本では中間層の標準的な収入というイメージがあります。では、この500万円は海外ではどの程度の価値があるのでしょうか？

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

年収の額面だけでなく、「その国でどれだけの生活ができるか」を考えることが大切です。MoveWorthのシミュレーションで、移住先での実質的な豊かさを数字で確認してみてください。`,
      en: `When you hear "¥5 million annual income," it represents a standard middle-class salary in Japan. But what is this ¥5M actually worth overseas?

### Nominal Comparison Isn't Enough

Simple exchange rate conversion gives:
- ¥5M ≒ ~$33,000 USD
- ¥5M ≒ ~152,000 MYR
- ¥5M ≒ ~1,170,000 THB

But this doesn't compare "richness." The same $33,000 buys very different things in New York vs. Southeast Asia.

### What Is Purchasing Power Parity (PPP)?

PPP indicates a currency's real value accounting for local price levels — comparing "how much it costs to buy the same goods and services" across countries.

IMF estimates (2026):

| Country | PPP Factor | ¥5M Equivalent Purchasing Power |
|---------|-----------|-------------------------------|
| USA | 0.7 | ~¥3.5M equivalent |
| Malaysia | 2.1 | ~¥10.5M equivalent |
| Thailand | 2.5 | ~¥12.5M equivalent |
| Indonesia | 3.0 | ~¥15M equivalent |
| Germany | 0.85 | ~¥4.25M equivalent |
| Australia | 0.75 | ~¥3.75M equivalent |

This means maintaining Japan's ¥5M lifestyle requires only ~¥2.4M in Malaysia or ~¥2M in Thailand.

### Using This in Simulation

MoveWorth lets you input destination "income" and "living costs" separately. Apply PPP thinking for more realistic inputs.

**Step 1:** Input actual obtainable income abroad
**Step 2:** Reference Japan's costs divided by PPP factor for living expenses
**Step 3:** Check if your savings rate improves

### Caveats

PPP represents "average" price levels. Note:
- Urban vs. rural prices differ significantly
- Imported goods (Japanese food, electronics) don't reflect PPP well
- Housing costs vary enormously by area
- Education and healthcare depend heavily on national systems

### Conclusion

Think beyond nominal income — consider "what lifestyle that income provides in each country." Use MoveWorth to verify your real purchasing power abroad with actual numbers.`,
    },
  },
  {
    slug: "what-is-moveworth",
    category: "about",
    date: "2026-02-01",
    readingTime: 4,
    title: {
      ja: "What is MoveWorth？：なぜ私たちが海外移住の資産分析にこだわる理由",
      en: "What Is MoveWorth? Why We're Passionate About Relocation Financial Analysis",
      zh: "什么是MoveWorth？——我们专注于海外移居财务分析的理由",
    },
    description: {
      ja: "MoveWorthが生まれた背景と、資産シミュレーションにこだわる理由を紹介します。",
      en: "The story behind MoveWorth and why we focus on asset simulation for relocation.",
      zh: "介绍MoveWorth的诞生背景，以及我们坚持资产模拟的原因。",
    },
    content: {
      ja: `海外移住を考えたことはありますか？

「いつかは海外で暮らしてみたい」「もっと豊かな生活ができる国があるのでは」——そんな思いを持つ人は少なくありません。しかし、いざ本気で検討し始めると、最初にぶつかる壁が「お金の問題」です。

### MoveWorthが生まれた理由

MoveWorthは、「海外移住したら資産はどうなるのか？」というシンプルな疑問から生まれました。

移住を検討する際、多くの人が様々なウェブサイトで情報を集めます。「〇〇国の生活費」「海外移住の税金」「おすすめの移住先」——断片的な情報は溢れていますが、それらを統合して「自分の場合はどうなるか」を計算するのは非常に手間がかかります。

MoveWorthは、この問題を解決するために作られました。あなたの収入、支出、貯蓄、投資リターンなどの情報を入力するだけで、移住した場合と残った場合の資産推移を一目で比較できます。

### 私たちがこだわる3つのポイント

**1. データに基づく意思決定**
「なんとなく」ではなく、具体的な数字でMovementの価値を判断できるようにします。感情的な判断ではなく、データに基づいた冷静な判断を支援します。

**2. 無料で使えること**
基本的なシミュレーション機能は無料で提供しています。海外移住は人生の大きな決断であり、その判断材料へのアクセスに障壁があってはならないと考えています。

**3. 継続的な改善**
20カ国以上のデータを搭載し、為替レートのリアルタイム取得、感度分析、FIRE計算機など、より正確で有用な機能を追加し続けています。

### MoveWorthの使い方

1. **国を選択**: 現在の国と移住先の国を選びます
2. **データを入力**: 年収、家賃、生活費、投資リターンなどを入力
3. **結果を確認**: グラフで資産推移を視覚的に比較
4. **シナリオ比較**: 条件を変えて複数のシナリオを検討

### これからのMoveWorth

私たちは、MoveWorthを「海外移住を考える人の最初の相談相手」にしたいと考えています。今後もAIを活用したレポート生成、より詳細な国別データ、コミュニティ機能など、新しい機能を追加していく予定です。

まずは無料でシミュレーションを試してみてください。あなたの海外移住の可能性が、数字で見えてきます。`,
      en: `Have you ever thought about living abroad?

"Someday I'd like to live overseas" or "Maybe there's a country where I could live more comfortably" — many people share these thoughts. But when you start seriously considering it, the first wall you hit is money.

### Why MoveWorth Was Born

MoveWorth was born from a simple question: "What happens to my assets if I move abroad?"

When researching relocation, people visit countless websites for fragments of information — living costs, taxes, recommended destinations. But integrating all that into "what happens in MY case" requires enormous effort.

MoveWorth solves this problem. Just input your income, expenses, savings, and investment returns to instantly compare asset trajectories between staying and relocating.

### Our 3 Core Principles

**1. Data-Driven Decisions**
Replace "gut feeling" with concrete numbers. We support calm, data-based judgment rather than emotional decisions.

**2. Free Access**
Basic simulation features are free. Overseas relocation is a major life decision — access to decision-making tools shouldn't have barriers.

**3. Continuous Improvement**
We cover 20+ countries with real-time exchange rates, sensitivity analysis, FIRE calculators, and more — constantly adding accurate, useful features.

### How to Use MoveWorth

1. **Select countries**: Choose your current and target countries
2. **Input data**: Annual income, rent, living costs, investment returns
3. **Review results**: Visually compare asset trajectories on graphs
4. **Compare scenarios**: Adjust parameters and examine multiple scenarios

### MoveWorth's Future

We aim to make MoveWorth "the first advisor for anyone considering overseas relocation." We plan to add AI-powered report generation, more detailed country data, community features, and more.

Try a free simulation today. Your overseas relocation possibilities will become visible in numbers.`,
    },
  },
  {
    slug: "moveworth-roadmap-features",
    category: "about",
    date: "2026-01-28",
    readingTime: 4,
    title: {
      ja: "ロードマップ：FreeからPremiumまで、MoveWorthが提供する新機能のすべて",
      en: "Roadmap: All New Features from Free to Premium",
      zh: "路线图：MoveWorth从免费版到高级版的全部新功能介绍",
    },
    description: {
      ja: "MoveWorthの現在の機能と、今後追加予定の機能をプラン別に紹介します。",
      en: "Current features and planned additions across all MoveWorth plans.",
      zh: "按套餐介绍MoveWorth现有功能及未来计划新增的功能。",
    },
    content: {
      ja: `MoveWorthは現在も進化を続けています。この記事では、現在利用可能な機能と、今後追加予定の新機能をプラン別にご紹介します。

### 現在利用可能な機能

### Freeプラン（無料）
すべてのユーザーが利用できる基本機能です。

- **資産シミュレーション**: 現在の国と移住先の資産推移を最大30年間予測
- **20カ国以上のデータ**: 各国のデフォルト税率・インフレ率を自動入力
- **グラフ表示**: 資産推移を折れ線グラフで視覚化
- **コスト内訳チャート**: 支出の内訳を円グラフで表示
- **リアルタイム為替レート**: 国を選択すると最新の為替レートを自動取得
- **シミュレーション履歴**: ログインユーザーは過去のシミュレーション結果を保存・閲覧可能
- **SNSシェア**: シミュレーション結果をTwitter/Facebookでシェア
- **日英バイリンガル**: 日本語・英語の完全対応

### 今後追加予定の機能

### 高度分析機能（開発中）

- **感度分析**: 各パラメータ（年収、投資リターン、インフレ率、家賃、生活費）が資産にどの程度影響するかを視覚的に表示。トルネードチャートで一目でわかります。

- **FIRE計算機**: 現在の国と移住先で、FIRE（経済的自立・早期退職）を達成できる年齢を比較計算。4%ルールに基づく目標資産額も自動算出します。

- **モンテカルロシミュレーション**: 1,000回の試行で資産推移の確率分布を算出。「最悪のケースでも大丈夫か？」をファンチャートで確認できます。元本割れ確率も表示。

### AI機能（企画中）

- **AI PDFレポート**: シミュレーション結果をAIが分析し、パーソナライズされたアドバイスを含むPDFレポートを生成。移住の判断材料として活用できます。

### コミュニティ機能（検討中）

- **移住体験談**: 実際に移住した人の体験談を国別に閲覧
- **Q&A掲示板**: 移住に関する質問と回答
- **メンター制度**: 経験者に直接相談できる仕組み

### プラン比較

| 機能 | Free | Pro | Premium |
|------|------|-----|---------|
| 基本シミュレーション | ○ | ○ | ○ |
| 感度分析 | - | ○ | ○ |
| FIRE計算機 | - | ○ | ○ |
| モンテカルロ分析 | - | - | ○ |
| AI PDFレポート | - | - | ○ |

### 開発の優先順位

現在、以下の順序で開発を進めています。

1. 高度分析機能（感度分析・FIRE計算機・モンテカルロ）
2. AI PDFレポート
3. ブログ・コンテンツの充実
4. コミュニティ機能

ユーザーの皆様からのフィードバックを基に、優先順位を調整しています。ご要望やアイデアがありましたら、お問い合わせページからお気軽にお寄せください。

MoveWorthは、海外移住を考えるすべての人のためのプラットフォームです。今後の進化にご期待ください。`,
      en: `MoveWorth continues to evolve. This article introduces currently available features and planned additions by plan tier.

### Currently Available Features

### Free Plan
Core features available to all users:

- **Asset Simulation**: Project asset trajectories up to 30 years for current and target countries
- **20+ Country Data**: Auto-populated default tax rates and inflation
- **Graph Display**: Visualize asset trajectories with line charts
- **Cost Breakdown**: View expense breakdown with pie charts
- **Real-time Exchange Rates**: Auto-fetch latest rates when selecting countries
- **Simulation History**: Logged-in users can save and review past results
- **Social Sharing**: Share results on Twitter/Facebook
- **Bilingual**: Full Japanese and English support

### Planned Features

### Advanced Analytics (In Development)

- **Sensitivity Analysis**: Visualize how each parameter (income, returns, inflation, rent, living costs) impacts assets via tornado charts.

- **FIRE Calculator**: Compare FIRE achievement ages between current and target countries. Auto-calculates target amounts based on the 4% rule.

- **Monte Carlo Simulation**: 1,000-trial probability distributions for asset trajectories. Fan charts show "am I safe even in worst cases?" with principal loss probability.

### AI Features (Planning)

- **AI PDF Report**: AI-analyzed simulation results with personalized advice in downloadable PDF format.

### Community Features (Under Consideration)

- **Relocation Stories**: Country-specific experiences from actual relocators
- **Q&A Board**: Questions and answers about relocation
- **Mentorship**: Direct consultation with experienced relocators

### Plan Comparison

| Feature | Free | Pro | Premium |
|---------|------|-----|---------|
| Basic Simulation | Yes | Yes | Yes |
| Sensitivity Analysis | - | Yes | Yes |
| FIRE Calculator | - | Yes | Yes |
| Monte Carlo | - | - | Yes |
| AI PDF Report | - | - | Yes |

### Development Priority

Current development order:
1. Advanced analytics (Sensitivity, FIRE, Monte Carlo)
2. AI PDF Report
3. Blog content expansion
4. Community features

We adjust priorities based on user feedback. Please share your ideas through our contact page.

MoveWorth is a platform for everyone considering overseas relocation. Stay tuned for what's next.`,
    },
  },
  // ===== VISA BLOG POSTS =====
  {
    slug: "visa-sg",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "シンガポールのビザ・就労許可完全ガイド2026年版",
      en: "Singapore Visa & Work Permit Complete Guide 2026",
      zh: "新加坡签证与就业准证完全指南2026年版",
    },
    description: {
      ja: "就労パス（EP）からEntrePassまで、シンガポールの主要ビザの種類・要件・費用を徹底解説。",
      en: "From Employment Pass to EntrePass — a complete breakdown of Singapore's main visa types, requirements, and costs.",
      zh: "从就业准证（EP）到EntrePass，全面解析新加坡主要签证的种类、要求与费用。",
    },
    content: {
      ja: `シンガポールは、アジアのビジネスハブとして多くの外国人労働者や起業家を受け入れています。高い生活水準と低い税率が魅力のシンガポールへの移住を検討している方向けに、主要なビザ・就労許可証を解説します。

### 主な就労ビザの種類

**Employment Pass（EP）**
シンガポールで最も一般的な就労ビザです。専門職・管理職・幹部職向けで、2023年の改定以降、最低月給はSGD 5,000（金融業はSGD 5,500）に引き上げられました。2025年以降はCOMPASS（Complementarity Assessment Framework）によるポイントスコアが必須要件となっています。
- 申請費用：SGD 105（新規）
- 有効期間：最大2年（更新時は最大3年）

**S Pass**
中級技術職向けパス。2023年以降の最低月給はSGD 3,150。雇用主ごとに外国人雇用枠（クォータ）あり。

**EntrePass**
革新的なビジネスを立ち上げる起業家向けパス。事業計画の審査が必要で、VC投資家・政府認定インキュベータからの推薦状があると審査に有利。

**One Pass（EPOL）**
月給SGD 30,000以上のトップ人材向けの5年間有効な特別パス。家族の就労許可も取得しやすい。

### 永住権・市民権

**永住権（PR）**
EP/S Passで数年就労後に申請可能。承認率は非公開で、家族構成・年収・納税額・学歴などが審査される。待機期間は1〜6ヶ月程度。

### 費用の目安

| 項目 | 費用 |
|------|------|
| EP申請費 | SGD 105 |
| S Pass申請費 | SGD 70 |
| Personalised Employment Pass | SGD 200 |

### 移住前のチェックポイント

1. **給与基準の確認**：毎年改定される最低給与基準を事前に確認
2. **COMPASSスコアの把握**：雇用主の外国人比率・学歴・給与等でポイントが変動
3. **住居費の試算**：シンガポールの家賃は高額なため、MoveWorthでのシミュレーションが有効

シンガポールは移住後の生活水準が高い反面、住居費・教育費が高額です。事前に総合的な財務シミュレーションを行うことをお勧めします。`,
      en: `Singapore is Asia's business hub, welcoming skilled foreign professionals and entrepreneurs. Here's a comprehensive breakdown of Singapore's main visa and work permit options.

### Main Work Visa Types

**Employment Pass (EP)**
The most common work visa for professionals, managers, and executives. Since 2023, the minimum monthly salary is SGD 5,000 (SGD 5,500 for financial services). From 2025, the COMPASS (Complementarity Assessment Framework) point-based system is mandatory.
- Application fee: SGD 105 (new application)
- Validity: Up to 2 years (up to 3 years on renewal)

**S Pass**
For mid-level skilled workers. Minimum monthly salary of SGD 3,150 (post-2023). Subject to employer quota limits.

**EntrePass**
For innovative entrepreneurs starting businesses in Singapore. Requires a business plan review; recommendations from VCs or government-recognized incubators strengthen applications.

**One Pass (EPOL)**
A 5-year pass for top talent earning at least SGD 30,000/month. Easier to obtain work permits for family members.

### Permanent Residency & Citizenship

**Permanent Residency (PR)**
Eligible after several years on EP/S Pass. Approval rates are undisclosed; income, taxes paid, education, and family ties are evaluated.

### Cost Summary

| Item | Cost |
|------|------|
| EP application fee | SGD 105 |
| S Pass application fee | SGD 70 |
| Personalised Employment Pass | SGD 200 |

### Pre-Move Checklist

1. **Verify salary thresholds**: Minimum salary requirements are revised annually
2. **Understand COMPASS scoring**: Points vary by employer's foreign workforce ratio, education, salary
3. **Estimate housing costs**: Singapore rents are high — use MoveWorth simulation for accurate projections

Singapore offers a high standard of living but comes with high housing and education costs. We recommend running a comprehensive financial simulation before making your decision.`,
      zh: `新加坡是亚洲商业中心，积极吸纳海外专业人才和创业者。以下是新加坡主要签证与就业准证的详细介绍。

### 主要就业签证种类

**就业准证（EP）**
新加坡最常见的就业签证，面向专业人士、管理人员和高管。2023年修订后，最低月薪为SGD 5,000（金融行业为SGD 5,500）。2025年起，COMPASS积分制度成为强制要求。
- 申请费用：SGD 105（新申请）
- 有效期：最长2年（续签最长3年）

**S准证**
面向中级技术人员。2023年后最低月薪为SGD 3,150。受雇主名额限制。

**EntrePass**
面向在新加坡创办创新型企业的创业者。需提交商业计划书审查，获得风险投资机构或政府认可孵化器推荐有利于审批。

**One Pass（EPOL）**
月薪SGD 30,000以上顶尖人才的5年期特别准证。家属更易获得就业准证。

### 永久居留权与公民身份

**永久居留权（PR）**
在EP/S准证下工作数年后可申请。审批率不公开，收入、纳税额、教育背景和家庭状况均纳入评估。

### 费用参考

| 项目 | 费用 |
|------|------|
| EP申请费 | SGD 105 |
| S准证申请费 | SGD 70 |
| 个人化就业准证 | SGD 200 |

### 移居前注意事项

1. **确认薪资标准**：最低薪资要求每年修订，需提前确认
2. **了解COMPASS积分**：积分因雇主外籍员工比例、学历、薪资而异
3. **估算住房成本**：新加坡租金较高，建议使用MoveWorth进行精准模拟

新加坡生活水平高，但住房和教育费用也相当昂贵。建议移居前进行全面的财务模拟。`,
    },
  },
  {
    slug: "visa-my",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "マレーシアのビザ・移住条件完全ガイド2026年版",
      en: "Malaysia Visa & Relocation Requirements Complete Guide 2026",
      zh: "马来西亚签证与移居条件完全指南2026年版",
    },
    description: {
      ja: "MM2H、DE Rantau、就労ビザまで。マレーシアの主要ビザの種類・要件・費用を徹底解説。",
      en: "From MM2H to DE Rantau and work visas — a complete guide to Malaysia's main visa types, requirements, and costs.",
      zh: "从MM2H到DE Rantau及就业签证，全面解析马来西亚主要签证的种类、要求与费用。",
    },
    content: {
      ja: `マレーシアは、物価の安さ・英語の通じやすさ・豊かな文化などから、日本人に人気の移住先のひとつです。2022年にはMM2Hが大幅改定され、2023年には新しい就労ビザ「DE Rantau」も登場しました。

### 主なビザの種類

**MM2H（Malaysia My Second Home）**
長期滞在を目的とした5年間有効の多次元ビザです。2022年の改定で要件が厳格化されました。
- 最低月収：RM 40,000（海外収入）
- 定期預金：RM 1,000,000
- 流動資産：RM 1,500,000以上
- 申請費用：RM 5,000

**DE Rantau パス**
デジタルノマド・リモートワーカー向けの新しいビザ（2023年導入）。
- 最低月収：USD 24,000/年（技術系）/ USD 60,000/年（非技術系）
- 有効期間：12ヶ月（1回更新可）
- 申請費用：RM 1,000（個人）

**就労ビザ（Employment Pass）**
マレーシア企業に雇用される外国人向け。雇用主が申請を行い、月給RM 5,000以上が目安。

**REP（Residence Pass - Talent）**
10年間の長期就労ビザ。熟練した外国人専門家向けで、高収入・長期就労実績が必要。

### 永住権

マレーシアの永住権（PR）は一般的に取得が難しく、長期就労・結婚・出生など特定の条件が必要です。

### 費用の目安

| 項目 | 費用 |
|------|------|
| MM2H申請費 | RM 5,000 |
| DE Rantauパス | RM 1,000 |
| 就労ビザ申請（雇用主負担の場合も） | RM 500〜2,000 |

### 移住前のチェックポイント

1. **MM2Hの最新要件確認**：改定が多いため、最新情報を公式サイトで確認
2. **住居費の試算**：クアラルンプール都心部の家賃はRM 3,000〜8,000程度
3. **医療保険の加入**：外国人向け民間保険が必要なケースが多い

マレーシアは東南アジアの中でも比較的生活コストが安く、MoveWorthのシミュレーションでも有利な結果が出やすい国です。ただし、MM2Hの要件は流動的なため、最新情報の確認が重要です。`,
      en: `Malaysia is one of the most popular destinations for Japanese expatriates, offering affordable living, English-language accessibility, and rich culture. The MM2H program was significantly revised in 2022, and the new DE Rantau digital nomad visa launched in 2023.

### Main Visa Types

**MM2H (Malaysia My Second Home)**
A 5-year multi-entry long-stay visa. Requirements were tightened significantly in 2022.
- Minimum overseas monthly income: RM 40,000
- Fixed deposit: RM 1,000,000
- Liquid assets: RM 1,500,000+
- Application fee: RM 5,000

**DE Rantau Pass**
New visa for digital nomads and remote workers (launched 2023).
- Minimum annual income: USD 24,000 (tech sector) / USD 60,000 (non-tech)
- Validity: 12 months (renewable once)
- Application fee: RM 1,000 (individual)

**Employment Pass**
For foreigners employed by Malaysian companies. Employer submits the application; minimum salary is typically RM 5,000/month.

**REP (Residence Pass - Talent)**
A 10-year long-term work permit for highly skilled foreign professionals with strong income and employment history.

### Permanent Residency

Malaysian PR is generally difficult to obtain, requiring long-term employment, marriage to a citizen, or other specific conditions.

### Cost Summary

| Item | Cost |
|------|------|
| MM2H application fee | RM 5,000 |
| DE Rantau Pass | RM 1,000 |
| Work visa application | RM 500–2,000 |

### Pre-Move Checklist

1. **Verify current MM2H requirements**: Requirements change frequently — check official sources
2. **Estimate housing costs**: KL city center rents range RM 3,000–8,000/month
3. **Arrange health insurance**: Private insurance is typically required for foreigners

Malaysia offers relatively low living costs in Southeast Asia, often showing favorable simulation results in MoveWorth. However, since MM2H requirements are subject to change, always verify current information.`,
      zh: `马来西亚因生活费低廉、英语普及、文化多元，是日本人移居的热门目的地之一。2022年MM2H大幅修订，2023年又新增了DE Rantau数字游民签证。

### 主要签证种类

**MM2H（马来西亚第二家园计划）**
以长期居留为目的的5年多次入境签证，2022年修订后门槛大幅提高。
- 海外最低月收入：RM 40,000
- 定期存款：RM 1,000,000
- 流动资产：RM 1,500,000以上
- 申请费用：RM 5,000

**DE Rantau准证**
面向数字游民和远程工作者的新签证（2023年推出）。
- 最低年收入：USD 24,000（技术领域）/ USD 60,000（非技术领域）
- 有效期：12个月（可续签一次）
- 申请费用：RM 1,000（个人）

**就业准证（Employment Pass）**
面向受雇于马来西亚企业的外国人，由雇主申请，月薪参考标准为RM 5,000以上。

**REP（居留准证—人才）**
10年长期就业签证，面向具有高收入和长期就业记录的熟练外国专业人士。

### 费用参考

| 项目 | 费用 |
|------|------|
| MM2H申请费 | RM 5,000 |
| DE Rantau准证 | RM 1,000 |
| 就业签证申请费 | RM 500～2,000 |

### 移居前注意事项

1. **确认MM2H最新要求**：政策变动频繁，需查阅官方最新信息
2. **估算住房成本**：吉隆坡市中心租金约RM 3,000～8,000/月
3. **购买医疗保险**：外国人通常需要自费购买私人保险

马来西亚在东南亚中生活成本相对较低，在MoveWorth模拟中往往呈现有利结果。但由于MM2H要求随时可能变动，请务必核实最新信息。`,
    },
  },
  {
    slug: "visa-th",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "タイのビザ・就労許可完全ガイド2026年版",
      en: "Thailand Visa & Work Permit Complete Guide 2026",
      zh: "泰国签证与工作许可完全指南2026年版",
    },
    description: {
      ja: "LTRビザ、タイエリートビザ、就労許可証まで。タイの主要ビザの種類・要件・費用を徹底解説。",
      en: "From LTR Visa to Thai Elite and work permits — a complete breakdown of Thailand's main visa types, requirements, and costs.",
      zh: "从LTR签证到泰国精英签证及工作许可，全面解析泰国主要签证的种类、要求与费用。",
    },
    content: {
      ja: `タイは温暖な気候・豊かな食文化・比較的低い生活コストから、日本人の移住先として人気上位の国です。近年はデジタルノマド向けの新ビザ制度も整備されています。

### 主なビザの種類

**LTR（Long-Term Resident）ビザ**
2022年に導入された富裕層・リタイア者・高度人材向けの10年間有効ビザ。4カテゴリがあります。
- Wealthy Global Citizen：海外収入USD 80,000/年以上 or 資産USD 1,000,000以上
- Wealthy Pensioner：年金収入USD 40,000/年以上（50歳以上）
- Work-from-Thailand Professional：海外からの収入USD 40,000/年以上
- Highly-Skilled Professional：高収入・特定分野の専門家
- 申請費用：THB 50,000（10年）

**Thai Elite ビザ（Thailand Privilege Card）**
富裕層向けの優遇会員制ビザ。5〜20年の滞在権が得られ、空港送迎などの特典付き。
- 5年プラン：THB 600,000〜
- 20年プラン：THB 2,400,000〜

**ノンイミグラント（Non-B）ビザ + 就労許可証**
タイで働く外国人が最も多く取得するビザ。雇用主のサポートが必要。
- ビザ費用：THB 2,000（シングル）
- 就労許可証費用：THB 3,000〜

**リタイアメントビザ（Non-OA）**
50歳以上対象。年金または預金残高THB 800,000以上が必要。

### 費用の目安

| 項目 | 費用 |
|------|------|
| LTRビザ（10年） | THB 50,000 |
| Thai Elite（5年） | THB 600,000〜 |
| 就労許可証 | THB 3,000〜 |

### 移住前のチェックポイント

1. **就労許可証の職種制限**：タイでは外国人が従事できない職種が法律で規定されている
2. **年間90日報告**：一部のビザは四半期ごとに入国管理局への報告義務あり
3. **医療保険**：LTRビザは最低USD 40,000の医療保険加入が必須

タイは東南アジアの中でも日本人コミュニティが充実しており、生活の利便性が高い移住先です。`,
      en: `Thailand is consistently ranked among the top destinations for Japanese expatriates, offering a warm climate, vibrant food culture, and relatively low living costs. Recent years have seen new visa options for digital nomads and high-skilled workers.

### Main Visa Types

**LTR (Long-Term Resident) Visa**
Launched in 2022, this 10-year visa targets wealthy individuals, retirees, and skilled professionals across 4 categories.
- Wealthy Global Citizen: Overseas income USD 80,000/year or assets USD 1,000,000+
- Wealthy Pensioner: Pension income USD 40,000/year (50+ years old)
- Work-from-Thailand Professional: Overseas income USD 40,000/year+
- Highly-Skilled Professional: High income in targeted industries
- Application fee: THB 50,000 (10-year validity)

**Thai Elite Visa (Thailand Privilege Card)**
Premium membership visa for affluent individuals. Offers 5–20 years of residency with airport concierge and other privileges.
- 5-year plan: THB 600,000+
- 20-year plan: THB 2,400,000+

**Non-Immigrant B Visa + Work Permit**
The most common route for working foreigners. Requires employer sponsorship.
- Visa fee: THB 2,000 (single entry)
- Work permit fee: THB 3,000+

**Retirement Visa (Non-OA)**
For those 50+ years old. Requires a pension or bank balance of THB 800,000+.

### Cost Summary

| Item | Cost |
|------|------|
| LTR Visa (10 years) | THB 50,000 |
| Thai Elite (5 years) | THB 600,000+ |
| Work permit | THB 3,000+ |

### Pre-Move Checklist

1. **Job restrictions**: Thai law restricts certain occupations to Thai nationals
2. **90-day reporting**: Some visas require quarterly reports to immigration
3. **Health insurance**: LTR visa requires minimum USD 40,000 medical coverage

Thailand has one of the largest Japanese expatriate communities in Southeast Asia, making it a highly livable destination.`,
      zh: `泰国气候温暖、美食丰富、生活成本相对较低，长期位居日本人移居目的地前列。近年来，针对数字游民和高技能人才的新签证制度也日趋完善。

### 主要签证种类

**LTR（长期居留）签证**
2022年推出的10年期签证，面向富裕人士、退休人员及高技能专业人才，共有4类。
- 富裕全球公民：海外年收入USD 80,000以上或资产USD 1,000,000以上
- 富裕退休人员：年金收入USD 40,000以上（50岁以上）
- 在泰远程工作专业人员：海外年收入USD 40,000以上
- 高技能专业人员：高收入特定领域专家
- 申请费用：THB 50,000（10年有效）

**泰国精英签证（Thailand Privilege Card）**
面向富裕人士的会员制签证，享有5～20年居留权及机场礼宾等特权。
- 5年方案：THB 600,000起
- 20年方案：THB 2,400,000起

**非移民B类签证 + 工作许可证**
外籍劳工最常申请的签证，需雇主支持。
- 签证费用：THB 2,000（单次入境）
- 工作许可证费用：THB 3,000起

**退休签证（Non-OA）**
50岁以上人群适用，需有养老金或银行存款THB 800,000以上。

### 费用参考

| 项目 | 费用 |
|------|------|
| LTR签证（10年） | THB 50,000 |
| 泰国精英签证（5年） | THB 600,000起 |
| 工作许可证 | THB 3,000起 |

### 移居前注意事项

1. **工作限制**：泰国法律规定外国人禁止从事某些职业
2. **90天报到**：部分签证要求每季度向移民局报到
3. **医疗保险**：LTR签证要求最低USD 40,000的医疗保险

泰国是东南亚日本人社区最为活跃的国家之一，宜居性极高。`,
    },
  },
  {
    slug: "visa-kr",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "韓国のビザ・就労許可完全ガイド2026年版",
      en: "South Korea Visa & Work Permit Complete Guide 2026",
      zh: "韩国签证与工作许可完全指南2026年版",
    },
    description: {
      ja: "就労ビザ（E系統）からF-2-7ポイント制まで。韓国の主要ビザの種類・要件・費用を徹底解説。",
      en: "From E-series work visas to the F-2-7 points system — a complete guide to South Korea's main visa types, requirements, and costs.",
      zh: "从E系列就业签证到F-2-7积分制度，全面解析韩国主要签证的种类、要求与费用。",
    },
    content: {
      ja: `韓国は日本から近く、文化的な親近感もあることから、アジア圏での移住先として注目されています。IT・エンタメ・製造業など多様な就労機会があります。

### 主なビザの種類

**E-7（特定活動）ビザ**
専門職・技術職向けの就労ビザ。韓国企業に雇用される場合が多く、雇用主のサポートが必要。学士以上の学位と関連経験が一般的な要件。

**E-1〜E-6（専門技術職）ビザ**
- E-1：大学教授・研究員
- E-2：語学講師（英語・日本語など）
- E-3：研究
- E-4：技術指導
- E-5：専門職（弁護士・会計士等）
- E-6：芸術・興行

**F-2-7（居住ビザ・ポイント制）**
高度人材向けの居住ビザ。年齢・学歴・韓国語能力・収入・資産などのポイントで審査（80点以上で申請可能）。

**D-10（求職ビザ）**
就職活動中の外国人向けビザ。韓国の大学卒業者や特定の資格保持者が対象。

**永住権（F-5）**
5年以上の合法滞在・安定した収入・韓国語能力などが要件。F-2-7からF-5への移行が一般的なルート。

### 費用の目安

| 項目 | 費用 |
|------|------|
| ビザ申請（在日韓国領事館） | ¥6,000〜¥10,000程度 |
| ビザ発給手数料 | KRW 60,000〜 |

### 移住前のチェックポイント

1. **韓国語能力**：F-2-7はTOPIK 3級以上が加点対象
2. **社会保険**：韓国は国民健康保険・国民年金への加入が外国人にも義務付けられる場合がある
3. **住居**：チョンセ（伝貰）制度など独特の賃貸慣行を理解しておく

韓国はIT産業の発展が著しく、グローバル企業への就職機会も増えています。`,
      en: `South Korea is growing in popularity as a relocation destination, particularly for those in IT, entertainment, and manufacturing. Its proximity to Japan and cultural familiarity make it an appealing option.

### Main Visa Types

**E-7 (Specific Activities) Visa**
Work visa for professionals and skilled workers employed by Korean companies. Generally requires a bachelor's degree and relevant experience.

**E-1 to E-6 (Specialized Work) Visas**
- E-1: University professors and researchers
- E-2: Language instructors (English, Japanese, etc.)
- E-3: Research
- E-4: Technology instruction
- E-5: Professionals (lawyers, accountants, etc.)
- E-6: Arts and entertainment

**F-2-7 (Residency Visa – Points System)**
Residency visa for highly skilled workers. Scored on age, education, Korean language ability, income, and assets (80+ points required to apply).

**D-10 (Job Seeker Visa)**
For foreigners seeking employment in Korea. Eligible for Korean university graduates or holders of specific qualifications.

**Permanent Residency (F-5)**
Requires 5+ years of lawful residence, stable income, and Korean language proficiency. F-2-7 → F-5 is the most common path.

### Cost Summary

| Item | Cost |
|------|------|
| Visa application (Korean consulate in Japan) | ¥6,000–¥10,000 |
| Visa issuance fee | KRW 60,000+ |

### Pre-Move Checklist

1. **Korean language ability**: TOPIK Level 3+ earns points for F-2-7
2. **Social insurance**: National Health Insurance and National Pension may be mandatory for foreigners
3. **Housing system**: Understand Korea's unique jeonse (전세) long-term deposit rental system

Korea's tech industry is booming, with growing opportunities at global companies based there.`,
      zh: `韩国与日本距离近，文化亲近感强，IT、娱乐和制造业提供了多样的就业机会，作为亚洲移居目的地备受关注。

### 主要签证种类

**E-7（特定活动）签证**
面向专业技术人员的就业签证，通常受雇于韩国企业。一般要求本科以上学历及相关工作经验。

**E-1至E-6（专业技术）签证**
- E-1：大学教授、研究员
- E-2：语言讲师（英语、日语等）
- E-3：研究
- E-4：技术指导
- E-5：专业人士（律师、会计师等）
- E-6：艺术、演出

**F-2-7（居住签证·积分制）**
高技能人才居住签证，根据年龄、学历、韩语能力、收入、资产等评分（需80分以上方可申请）。

**D-10（求职签证）**
面向在韩求职的外国人，适用于韩国大学毕业生或特定资质持有者。

**永久居留权（F-5）**
需合法居留5年以上、收入稳定、具备韩语能力等条件，通常经F-2-7过渡至F-5。

### 费用参考

| 项目 | 费用 |
|------|------|
| 签证申请费（驻日韩国领事馆） | 约¥6,000～¥10,000 |
| 签证签发手续费 | KRW 60,000起 |

### 移居前注意事项

1. **韩语能力**：TOPIK 3级以上可为F-2-7积分加分
2. **社会保险**：外国人可能须强制参加国民健康保险和国民年金
3. **住房制度**：了解韩国独特的全租房（전세）制度

韩国科技产业蓬勃发展，在全球化企业就职的机会也日益增多。`,
    },
  },
  {
    slug: "visa-tw",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "台湾のビザ・就労許可完全ガイド2026年版",
      en: "Taiwan Visa & Work Permit Complete Guide 2026",
      zh: "台湾签证与工作许可完全指南2026年版",
    },
    description: {
      ja: "エンプロイメントゴールドカードから就労許可まで。台湾の主要ビザの種類・要件・費用を徹底解説。",
      en: "From the Employment Gold Card to standard work permits — a complete guide to Taiwan's main visa types and requirements.",
      zh: "从就业金卡到一般工作许可，全面解析台湾主要签证的种类、要求与费用。",
    },
    content: {
      ja: `台湾は親日感情が強く、食文化・自然環境・生活コストのバランスが良いことから、日本人移住者に人気の国です。近年は半導体産業を中心に外国人労働者への需要も高まっています。

### 主なビザの種類

**Employment Gold Card（エンプロイメントゴールドカード）**
高度人材向けの3年間有効ビザ。就労・居住・再入国が1枚のカードで可能。以下のいずれかに該当する必要があります。
- 月収NTD 160,000以上
- 技術・科学・経済・教育・文化・芸術・スポーツ分野の優秀人材
- 申請費用：NTD 5,380

**就労許可証（Work Permit）+ 居留証（ARC）**
一般的な就労ルート。台湾企業に雇用され、労働部に就労許可申請を行う。
- 対象職種：専門職・技術職・企業内転勤等
- 月給基準：NTD 47,971以上（一般専門職）
- 申請費用：NTD 500〜1,000

**ゴールドカードなしのデジタルノマドビザ**
台湾には現時点で専用のデジタルノマドビザはないが、ビジター（観光）ビザ＋延長で最大6ヶ月滞在可能。

**永住権（Permanent Resident Certificate）**
5年以上の継続居留後に申請可能。台湾語・英語の生活能力証明や税務申告が審査対象。

### 費用の目安

| 項目 | 費用 |
|------|------|
| Gold Card申請費 | NTD 5,380 |
| 就労許可申請費 | NTD 500〜1,000 |
| 居留証（ARC）発行費 | NTD 1,000 |

### 移住前のチェックポイント

1. **Gold Cardの優遇**：所得税の30%控除が最初の3年間適用される優遇税制あり
2. **国民健康保険**：6ヶ月以上居留すれば加入可能（保険料は負担額が少ない）
3. **住居**：台北市中心部の家賃はNTD 20,000〜50,000程度

台湾はGold Cardによる優遇税制が魅力で、IT・半導体分野の人材には特に有利な移住先です。`,
      en: `Taiwan is popular among Japanese expatriates for its pro-Japan sentiment, food culture, natural scenery, and balanced cost of living. Demand for foreign talent is rising, especially in the semiconductor industry.

### Main Visa Types

**Employment Gold Card**
A 3-year combined work/residency visa for high-skilled professionals. Combines work permit, residence permit, and re-entry permit in one card.
Requirements (any of the following):
- Monthly salary of NTD 160,000+
- Outstanding talent in technology, science, economics, education, culture, arts, or sports
- Application fee: NTD 5,380

**Work Permit + ARC (Alien Resident Certificate)**
The standard work route. The employer applies to the Ministry of Labor.
- Target roles: Professionals, skilled workers, intra-company transfers
- Minimum monthly salary: NTD 47,971+ (general professional)
- Application fee: NTD 500–1,000

**No Dedicated Digital Nomad Visa**
Taiwan currently has no specific digital nomad visa, but visitor visas can be extended for stays up to approximately 6 months.

**Permanent Residency**
Available after 5+ years of continuous residence. Requires proof of Chinese/English proficiency and tax compliance.

### Cost Summary

| Item | Cost |
|------|------|
| Gold Card application fee | NTD 5,380 |
| Work permit application | NTD 500–1,000 |
| ARC issuance fee | NTD 1,000 |

### Pre-Move Checklist

1. **Gold Card tax benefit**: 30% income tax deduction for the first 3 years
2. **National Health Insurance**: Eligible to join after 6 months of residency (low premium contributions)
3. **Housing**: Taipei city center rents range NTD 20,000–50,000/month

Taiwan's Gold Card tax incentives are particularly attractive for IT and semiconductor professionals.`,
      zh: `台湾亲日情感浓厚，饮食文化、自然风光与生活成本的平衡备受日本移居者青睐。随着半导体产业蓬勃发展，对外籍人才的需求也持续攀升。

### 主要签证种类

**就业金卡（Employment Gold Card）**
高技能专业人士的3年期综合签证，集工作许可、居留许可和重入境许可于一卡。符合以下任一条件即可申请：
- 月薪NTD 160,000以上
- 在科技、科学、经济、教育、文化、艺术或体育领域的优秀人才
- 申请费用：NTD 5,380

**工作许可 + 居留证（ARC）**
标准就业途径，由雇主向劳动部申请。
- 目标岗位：专业技术人员、企业内部调任等
- 最低月薪：NTD 47,971以上（一般专业人员）
- 申请费用：NTD 500～1,000

**永久居留证**
连续居留5年以上后可申请，需具备中文或英文生活能力证明及纳税记录。

### 费用参考

| 项目 | 费用 |
|------|------|
| 就业金卡申请费 | NTD 5,380 |
| 工作许可申请费 | NTD 500～1,000 |
| 居留证（ARC）签发费 | NTD 1,000 |

### 移居前注意事项

1. **金卡税收优惠**：前3年享有所得税30%扣除优惠
2. **全民健保**：居留满6个月后可加入（保费负担较低）
3. **住房成本**：台北市中心租金约NTD 20,000～50,000/月

台湾的就业金卡税收优惠对IT和半导体领域的专业人士尤为吸引。`,
    },
  },
  {
    slug: "visa-hk",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "香港のビザ・就労許可完全ガイド2026年版",
      en: "Hong Kong Visa & Work Permit Complete Guide 2026",
      zh: "香港签证与工作许可完全指南2026年版",
    },
    description: {
      ja: "Quality Migrant Admission Schemeから就労ビザまで。香港の主要ビザの種類・要件・費用を徹底解説。",
      en: "From Quality Migrant Admission Scheme to employment visas — a complete guide to Hong Kong's main visa types and requirements.",
      zh: "从优秀人才入境计划到就业签证，全面解析香港主要签证的种类、要求与费用。",
    },
    content: {
      ja: `香港はアジアの国際金融センターとして、金融・法律・IT分野の高度人材を積極的に受け入れています。一律15%の低税率が魅力です。

### 主なビザの種類

**就労ビザ（Employment Visa）**
香港企業に雇用される外国人向けの最も一般的なビザ。雇用主が入境事務所に申請。
- 申請費用：HKD 230
- 有効期間：最大2年（更新可）
- 要件：香港で代替が難しいスキル・知識・経験を持つこと

**Quality Migrant Admission Scheme（QMAS）**
雇用なしで香港への移住を希望する高度人材向けのポイントベースの制度。2種類の採点方式。
- General Points Test（年齢・学歴・職歴・語学力などで採点）
- Achievement-Based Points Test（国際的に認められた業績を持つ人材向け）
- クォータ制（年間数千名程度）

**Top Talent Pass Scheme（TTPS）**
2022年に導入された優秀人才通行証計画。以下のいずれかで申請可能。
- 過去1年間の年収HKD 2,500,000以上
- 世界ランキング100位以内の大学の卒業生
- 同大学の卒業から5年以内かつHKD 1,500,000以上の年収

**Investment Visa（Capital Investment Entrant Scheme）**
2023年に再開。HKD 30,000,000以上の資産を香港に投資することで申請可能。

### 費用の目安

| 項目 | 費用 |
|------|------|
| 就労ビザ申請費 | HKD 230 |
| QMAS申請費 | HKD 460 |

### 移住前のチェックポイント

1. **政治情勢の変化**：近年の制度変更により、情報は常に最新のものを確認
2. **高額な住居費**：香港の家賃は世界最高水準。MoveWorthでの慎重なシミュレーションを推奨
3. **MPF（強制積立年金）**：就労者は給与の5%を強制拠出

香港は低税率と金融業の集積が魅力ですが、住居費の高さが最大の課題です。`,
      en: `Hong Kong is Asia's international financial hub, actively attracting top talent in finance, law, and technology. The flat 15% tax rate is a key drawcard.

### Main Visa Types

**Employment Visa**
The most common visa for foreigners employed by Hong Kong companies. Employers apply to the Immigration Department.
- Application fee: HKD 230
- Validity: Up to 2 years (renewable)
- Requirements: Skills, knowledge, or experience not readily available in Hong Kong

**Quality Migrant Admission Scheme (QMAS)**
Points-based scheme for high-skilled individuals wishing to relocate without a job offer. Two scoring tests available.
- General Points Test (age, education, work experience, language ability)
- Achievement-Based Points Test (for internationally recognized achievers)
- Subject to annual quota

**Top Talent Pass Scheme (TTPS)**
Introduced in 2022 to attract top global talent:
- Annual income of HKD 2,500,000+ in the past year, OR
- Graduate of a top-100 world university, OR
- Same, graduated within 5 years with HKD 1,500,000+ annual income

**Capital Investment Entrant Scheme**
Reopened in 2023. Requires HKD 30,000,000+ invested in Hong Kong assets.

### Cost Summary

| Item | Cost |
|------|------|
| Employment visa application | HKD 230 |
| QMAS application fee | HKD 460 |

### Pre-Move Checklist

1. **Changing political landscape**: Always verify the latest regulations
2. **High housing costs**: Hong Kong rents are among the world's highest — careful MoveWorth simulation is essential
3. **MPF (Mandatory Provident Fund)**: Employees must contribute 5% of salary

Hong Kong's low tax rate and financial sector concentration are major attractions, but the extremely high cost of housing is the biggest challenge.`,
      zh: `香港是亚洲国际金融中心，积极吸引金融、法律和科技领域的顶尖人才。15%的统一税率是主要吸引力之一。

### 主要签证种类

**就业签证（Employment Visa）**
外籍人士在港就业最常见的签证，由雇主向入境事务处申请。
- 申请费用：HKD 230
- 有效期：最长2年（可续签）
- 要求：持有香港难以寻觅的技能、知识或经验

**优秀人才入境计划（QMAS）**
面向无需雇主担保即希望移居香港的高技能人士，设两种积分测试：通用积分测试（年龄、学历、工作经验、语言能力等）和成就积分测试（具有国际公认成就者）。设年度配额。

**高端人才通行证计划（TTPS）**
2022年推出，符合以下任一条件可申请：
- 过去一年年收入达HKD 2,500,000以上
- 全球百强大学毕业生
- 同校毕业且5年内年收入达HKD 1,500,000以上

**资本投资者入境计划**
2023年重启，需在香港资产投资HKD 30,000,000以上。

### 费用参考

| 项目 | 费用 |
|------|------|
| 就业签证申请费 | HKD 230 |
| QMAS申请费 | HKD 460 |

### 移居前注意事项

1. **政治形势变化**：制度近年持续变动，需随时确认最新规定
2. **高昂住房成本**：香港租金位居全球最高之列，务必使用MoveWorth仔细模拟
3. **强积金（MPF）**：受雇人员须强制缴纳薪酬的5%

香港的低税率和金融业集聚是其最大优势，但极高的住房成本是最大挑战。`,
    },
  },
  {
    slug: "visa-id",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "インドネシアのビザ・就労許可完全ガイド2026年版",
      en: "Indonesia Visa & Work Permit Complete Guide 2026",
      zh: "印度尼西亚签证与工作许可完全指南2026年版",
    },
    description: {
      ja: "就労ビザ（KITAS）からデジタルノマドビザまで。インドネシアの主要ビザの種類・要件・費用を徹底解説。",
      en: "From KITAS work visas to digital nomad visas — a complete guide to Indonesia's main visa types, requirements, and costs.",
      zh: "从KITAS工作签证到数字游民签证，全面解析印度尼西亚主要签证的种类、要求与费用。",
    },
    content: {
      ja: `インドネシアはASEANの中で最大の経済規模を持つ国で、バリ島を中心にデジタルノマドや移住者に人気が高まっています。

### 主なビザの種類

**KITAS（Limited Stay Permit / Izin Tinggal Terbatas）**
外国人がインドネシアで就労・居住するための主要な許可証。
- 就労KITASはImta（外国人就労許可）とセットで申請
- スポンサー（雇用主またはインドネシア人配偶者など）が必要
- 有効期間：1〜2年（更新可）

**外国人就労許可（RPTKA + Imta）**
外国人を雇用したいインドネシア企業が申請。外国人1名あたりの補償費用（USD 1,200/年）の支払いが必要。

**B211A ビザ（投資・ビジネスビザ）**
60日間のビジネス活動向けビザ。就労不可。

**デジタルノマドビザ（Second Home Visa / Visitor Visa）**
バリ島の人気を受け、インドネシアは2023年頃よりデジタルノマド向けの滞在許可整備を進めています。最新情報は移民局を確認してください。

**Second Home Visa**
資産または定期預金IDR 2,000,000,000以上（約2,000万円）を条件とする5〜10年の長期ビザ。

### 費用の目安

| 項目 | 費用 |
|------|------|
| KITAS申請費（政府手数料） | USD 200〜300 |
| Imta補償費 | USD 1,200/年（外国人1名あたり） |
| Second Home Visa | 要確認（数百USD程度） |

### 移住前のチェックポイント

1. **職種制限**：インドネシアは多くの職種で外国人就労が制限されている
2. **税務**：インドネシア国内源泉所得は原則として課税対象
3. **バリ島の生活費**：観光地のため、ローカル相場と外国人向け相場に大きな差がある

インドネシアはバリ島の魅力から移住先として人気ですが、就労ビザの取得は複雑です。事前に専門のエージェントへの相談を検討してください。`,
      en: `Indonesia has the largest economy in ASEAN and is growing in popularity as a destination for digital nomads and expatriates, especially in Bali.

### Main Visa Types

**KITAS (Limited Stay Permit)**
The primary permit for foreigners living and working in Indonesia.
- Work KITAS is applied together with Imta (Foreign Worker Employment Permit)
- Requires a sponsor (employer or Indonesian spouse)
- Validity: 1–2 years (renewable)

**Foreign Work Permit (RPTKA + Imta)**
Applied by Indonesian companies wishing to employ foreigners. Companies must pay a compensation fee of USD 1,200/year per foreign worker.

**B211A Visa (Investment/Business Visa)**
60-day visa for business activities; does not permit employment.

**Digital Nomad / Visitor Visa**
In response to Bali's popularity, Indonesia has been developing longer-stay options for digital nomads since around 2023. Check with the immigration office for current options.

**Second Home Visa**
Long-term visa (5–10 years) requiring assets or fixed deposits of IDR 2,000,000,000+ (approx. USD 130,000+).

### Cost Summary

| Item | Cost |
|------|------|
| KITAS application (government fee) | USD 200–300 |
| Imta compensation fee | USD 1,200/year per person |
| Second Home Visa | Check current rates (approx. several hundred USD) |

### Pre-Move Checklist

1. **Job restrictions**: Many occupations are restricted to Indonesian nationals
2. **Taxation**: Indonesian-source income is generally subject to local tax
3. **Bali cost of living**: Significant gap between local and expat pricing

Indonesia is popular for its Bali appeal, but obtaining a work visa can be complex. Consider consulting a specialized agent beforehand.`,
      zh: `印度尼西亚是东盟最大经济体，以巴厘岛为中心，在数字游民和移居者中越来越受欢迎。

### 主要签证种类

**KITAS（有限居留许可）**
外国人在印尼生活和工作的主要许可证，就业KITAS需与Imta（外籍劳工就业许可）一同申请，需要担保人（雇主或印尼籍配偶等）。有效期1～2年（可续签）。

**外籍劳工就业许可（RPTKA + Imta）**
希望雇用外国人的印尼企业需申请，每位外籍员工须支付补偿金USD 1,200/年。

**B211A签证（投资/商务签证）**
60天商务活动签证，不允许就业。

**第二家园签证**
资产或定期存款IDR 2,000,000,000以上（约合人民币90万元）可申请的5～10年长期签证。

### 费用参考

| 项目 | 费用 |
|------|------|
| KITAS申请费（政府手续费） | USD 200～300 |
| Imta补偿金 | USD 1,200/年（每位外籍员工） |
| 第二家园签证 | 需确认（约数百美元） |

### 移居前注意事项

1. **职业限制**：印尼许多职业禁止外国人从事
2. **税务**：印尼境内来源收入原则上须纳税
3. **巴厘岛生活成本**：本地居民与外籍人士定价差距较大

印度尼西亚因巴厘岛的魅力而备受移居者青睐，但工作签证的申请流程较为复杂，建议事先咨询专业中介。`,
    },
  },
  {
    slug: "visa-ph",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "フィリピンのビザ・移住条件完全ガイド2026年版",
      en: "Philippines Visa & Relocation Complete Guide 2026",
      zh: "菲律宾签证与移居条件完全指南2026年版",
    },
    description: {
      ja: "SRRV、就労ビザ（9G）から13aまで。フィリピンの主要ビザの種類・要件・費用を徹底解説。",
      en: "From SRRV and 9G work visas to 13a resident visas — a complete guide to the Philippines' main visa types and requirements.",
      zh: "从SRRV、9G就业签证到13a居民签证，全面解析菲律宾主要签证的种类、要求与费用。",
    },
    content: {
      ja: `フィリピンは英語が公用語で、温暖な気候と安い生活コストが魅力です。セブ島や首都マニラを拠点に多くの外国人が生活しています。

### 主なビザの種類

**SRRV（Special Resident Retiree's Visa）**
退職者向けの特別居住ビザ。フィリピン退職庁（PRA）が管轄。
- 50歳以上（年金受給者）：USD 10,000の定期預金
- 50歳未満：USD 20,000の定期預金
- 年金なし・年金有の条件で異なる
- 申請費用：USD 1,400（本人）

**9G ビザ（就労ビザ）**
フィリピン企業に雇用される外国人向けビザ。雇用主がAlien Employment Permitを取得し、移民局に申請。

**13a ビザ（フィリピン人配偶者向け）**
フィリピン国籍者と婚姻した外国人向けの移民ビザ。最初の1年は条件付きPR、その後本PR。

**特別就労居住ビザ（SVEP）**
経済特区内の企業に雇用される場合に取得可能。

**デジタルノマドビザ**
2023年時点でフィリピンはデジタルノマド専用ビザは導入していないが、観光ビザを延長しながら滞在する外国人が多い（最大36ヶ月まで延長可能）。

### 費用の目安

| 項目 | 費用 |
|------|------|
| SRRV申請費 | USD 1,400 |
| 9Gビザ申請費 | PHP 8,620〜 |
| 13aビザ申請費 | PHP 8,620〜 |

### 移住前のチェックポイント

1. **外国人の土地所有制限**：フィリピンでは外国人は土地を所有できないが、コンドミニアムは購入可能（外国人枠40%）
2. **二重課税協定**：日本とフィリピンの間には租税条約があり、二重課税の一部が回避できる
3. **医療水準**：都市部の私立病院は高水準だが、地方は要注意

フィリピンはリタイアメントビザ（SRRV）が整備されており、退職後の移住先として日本人にも人気です。`,
      en: `The Philippines is an English-speaking country with a warm climate and affordable cost of living. Many expatriates base themselves in Cebu or Manila.

### Main Visa Types

**SRRV (Special Resident Retiree's Visa)**
Retirement visa managed by the Philippine Retirement Authority (PRA).
- 50+ years (pension recipient): USD 10,000 fixed deposit
- Under 50: USD 20,000 fixed deposit
- Conditions vary based on pension status
- Application fee: USD 1,400 (primary applicant)

**9G Visa (Work Visa)**
For foreigners employed by Philippine companies. Employers obtain an Alien Employment Permit, then apply to immigration.

**13a Visa (Spouse of Philippine Citizen)**
Immigrant visa for foreign spouses of Philippine nationals. Conditional PR for the first year, then full PR.

**SVEP (Special Visa for Employment Generation)**
Available for foreigners employed within special economic zones.

**Digital Nomad Visa**
As of 2023, the Philippines has no dedicated digital nomad visa. Many foreigners extend tourist visas instead (extendable up to 36 months).

### Cost Summary

| Item | Cost |
|------|------|
| SRRV application fee | USD 1,400 |
| 9G visa application | PHP 8,620+ |
| 13a visa application | PHP 8,620+ |

### Pre-Move Checklist

1. **Land ownership restrictions**: Foreigners cannot own land in the Philippines, but can own condominium units (within the 40% foreign ownership limit)
2. **Tax treaty**: Japan and Philippines have a tax treaty to avoid some double taxation
3. **Healthcare quality**: High-standard private hospitals in cities; quality drops in rural areas

The Philippines' SRRV retirement visa is well-established, making it a popular destination for Japanese retirees.`,
      zh: `菲律宾以英语为官方语言，气候温暖，生活费低廉，许多外籍人士以宿务或马尼拉为据点定居生活。

### 主要签证种类

**SRRV（特别居民退休人员签证）**
退休人员专属居留签证，由菲律宾退休局（PRA）管理。
- 50岁以上（领取养老金者）：USD 10,000定期存款
- 50岁以下：USD 20,000定期存款
- 条件因是否领取养老金而有所不同
- 申请费用：USD 1,400（本人）

**9G签证（就业签证）**
面向受雇于菲律宾企业的外国人，雇主需取得外籍就业许可后向移民局申请。

**13a签证（菲律宾公民配偶）**
外籍配偶专属移民签证，首年为附条件永久居留，之后转为正式永久居留。

**数字游民签证**
截至2023年，菲律宾尚无专门的数字游民签证，许多外籍人士选择延期旅游签证（最长可延至36个月）。

### 费用参考

| 项目 | 费用 |
|------|------|
| SRRV申请费 | USD 1,400 |
| 9G签证申请费 | PHP 8,620起 |
| 13a签证申请费 | PHP 8,620起 |

### 移居前注意事项

1. **外国人土地所有限制**：外国人不得拥有土地，但可购买公寓（外籍持有比例上限40%）
2. **避免双重征税**：日本与菲律宾之间存在租税协定，部分双重征税可规避
3. **医疗水平**：城市私立医院水准较高，农村地区需注意

菲律宾的SRRV退休签证制度完善，是日本退休人员移居的热门目的地。`,
    },
  },
  {
    slug: "visa-vn",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "ベトナムのビザ・就労許可完全ガイド2026年版",
      en: "Vietnam Visa & Work Permit Complete Guide 2026",
      zh: "越南签证与工作许可完全指南2026年版",
    },
    description: {
      ja: "就労許可証から一時居留証まで。ベトナムの主要ビザの種類・要件・費用を徹底解説。",
      en: "From work permits to temporary residence cards — a complete guide to Vietnam's main visa types, requirements, and costs.",
      zh: "从工作许可证到临时居留证，全面解析越南主要签证的种类、要求与费用。",
    },
    content: {
      ja: `ベトナムはホーチミン市・ハノイを中心に急速な経済成長を続けており、製造業・IT・サービス業など多様な就労機会があります。日系企業の進出も多く、日本人移住者が増加しています。

### 主なビザの種類

**就労許可証（Work Permit）**
ベトナムで働くほぼすべての外国人に必要な許可証。雇用主が労働傷病兵社会省（MOLISA）に申請。
- 有効期間：最大2年（更新可）
- 申請費用：VND 600,000〜

就労許可証の取得には以下の書類が一般的に必要：
- 学位証明書（認証・翻訳済み）
- 犯罪経歴証明書
- 健康診断書
- 3年以上の職歴証明

**一時居留証（TRC：Temporary Residence Card）**
就労許可証取得後に申請する居住許可証。毎回の入国ビザが不要になる。
- 有効期間：1〜2年（就労許可証と連動）
- 申請費用：USD 20〜

**電子ビザ（E-Visa）**
90日間（2023年8月から延長）の観光・短期商用向けビザ。就労には使用不可。

**投資家ビザ**
ベトナムに一定額以上の投資を行う外国人向けの長期ビザ。

### 費用の目安

| 項目 | 費用 |
|------|------|
| 就労許可証申請費 | VND 600,000〜 |
| 一時居留証発行費 | USD 20〜 |
| E-Visa費用 | USD 25 |

### 移住前のチェックポイント

1. **就労許可証の免除対象**：外資企業の役員や高度人材など一部は就労許可証が不要
2. **確定申告**：年183日以上の滞在で税務上の居住者とされ、ベトナム内外の所得が課税対象
3. **銀行口座開設**：一時居留証がないと銀行口座の開設が困難な場合がある

ベトナムは若い人口と旺盛な経済成長が魅力で、IT・日本語人材の需要が特に高い国です。`,
      en: `Vietnam is experiencing rapid economic growth centered on Ho Chi Minh City and Hanoi, with diverse job opportunities in manufacturing, IT, and services. Growing Japanese corporate presence has led to increasing numbers of Japanese expatriates.

### Main Visa Types

**Work Permit**
Required for almost all foreigners working in Vietnam. Employers apply to the Ministry of Labour, Invalids and Social Affairs (MOLISA).
- Validity: Up to 2 years (renewable)
- Application fee: VND 600,000+

Common documents required:
- Authenticated and translated degree certificate
- Criminal record certificate
- Medical certificate
- Proof of 3+ years' work experience

**TRC (Temporary Residence Card)**
Applied after obtaining a work permit. Eliminates the need for a visa on each entry.
- Validity: 1–2 years (linked to work permit)
- Application fee: USD 20+

**E-Visa**
90-day electronic visa (extended since August 2023) for tourism and short business trips. Cannot be used for employment.

**Investor Visa**
Long-term visa for foreigners investing a certain amount in Vietnam.

### Cost Summary

| Item | Cost |
|------|------|
| Work permit application fee | VND 600,000+ |
| TRC issuance fee | USD 20+ |
| E-Visa fee | USD 25 |

### Pre-Move Checklist

1. **Work permit exemptions**: Some foreign corporate executives and highly skilled workers are exempt
2. **Tax residency**: 183+ days in Vietnam makes you a tax resident, subject to tax on worldwide income
3. **Bank account**: Opening a bank account without a TRC can be difficult

Vietnam's young population and economic growth create strong demand for IT professionals and Japanese-language speakers.`,
      zh: `越南以胡志明市和河内为中心持续快速发展，制造业、IT和服务业提供了多样的就业机会。日资企业众多，日本移居者数量也在不断增加。

### 主要签证种类

**工作许可证（Work Permit）**
几乎所有在越工作的外国人都需要此许可证，由雇主向劳动荣军社会部（MOLISA）申请。有效期最长2年（可续签）。申请费用：VND 600,000起。

常见所需文件：
- 经认证翻译的学历证明
- 无犯罪记录证明
- 健康证明
- 3年以上工作经历证明

**临时居留证（TRC）**
取得工作许可证后申请的居留许可，持有后无需每次入境申请签证。有效期1～2年（与工作许可证挂钩），申请费用：USD 20起。

**电子签证（E-Visa）**
90天（2023年8月起延长）的旅游及短期商务签证，不可用于就业。费用：USD 25。

### 费用参考

| 项目 | 费用 |
|------|------|
| 工作许可证申请费 | VND 600,000起 |
| 临时居留证签发费 | USD 20起 |
| 电子签证费 | USD 25 |

### 移居前注意事项

1. **工作许可证豁免**：外资企业高管等部分人员可免申请工作许可证
2. **税务居民认定**：在越居留183天以上将被认定为税务居民，境内外所得均须纳税
3. **银行开户**：无临时居留证可能难以开设银行账户

越南年轻的人口结构和旺盛的经济增长，使IT专业人才和日语人才的需求尤为突出。`,
    },
  },
  {
    slug: "visa-us",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "アメリカのビザ・就労許可完全ガイド2026年版",
      en: "United States Visa & Work Authorization Complete Guide 2026",
      zh: "美国签证与工作授权完全指南2026年版",
    },
    description: {
      ja: "H-1Bから就労グリーンカードまで。アメリカの主要ビザの種類・要件・費用を徹底解説。",
      en: "From H-1B to employment-based green cards — a complete guide to U.S. visa types, requirements, and costs.",
      zh: "从H-1B到就业类绿卡，全面解析美国主要签证的种类、要求与费用。",
    },
    content: {
      ja: `アメリカは世界最大の経済大国であり、IT・金融・医療・アカデミアなど多くの分野でトップクラスのキャリア機会があります。ただし、就労ビザの取得競争は激しく、移民プロセスも複雑です。

### 主な就労ビザの種類

**H-1B（専門職ビザ）**
最も一般的なアメリカの就労ビザ。学士以上の学位を必要とする専門職向け。
- 毎年4月に抽選（65,000件＋修士号保持者向け20,000件）
- 有効期間：3年（最大6年、EB取得まで延長可能）
- 申請費：USD 730〜4,730（雇用主負担）

**L-1（企業内転勤ビザ）**
アメリカ企業の海外関連会社から転勤する管理職・専門職向け。
- L-1A（管理職・幹部）：最大7年
- L-1B（専門職）：最大5年

**O-1（卓越した能力を持つ外国人）**
科学・芸術・教育・ビジネス・スポーツの分野で卓越した業績を持つ人向け。抽選なし。

**TN（北米自由貿易協定ビザ）**
カナダ・メキシコ市民向け（日本人は対象外）。

**EB-1/EB-2/EB-3（就労グリーンカード）**
永住権（グリーンカード）の就労カテゴリ。EB-1は優先労働者・多国籍企業管理職、EB-2はNIW（国益免除）が人気。取得まで数年〜十数年かかる場合もある。

**グリーンカード抽選（DV Lottery）**
毎年約5万名に永住権を抽選付与。日本は抽選対象国に含まれていないため、日本国籍者は参加不可。

### 費用の目安

| 項目 | 費用 |
|------|------|
| H-1B申請費（雇用主） | USD 730〜4,730 |
| グリーンカード申請費 | USD 1,225〜 |
| O-1申請費 | USD 460〜 |

### 移住前のチェックポイント

1. **H-1Bの抽選リスク**：毎年倍率3〜5倍以上の競争率。複数年の挑戦が必要なケースも
2. **税金の複雑さ**：連邦税＋州税＋地方税の多層構造。州によって税率が大きく異なる
3. **医療保険**：雇用主提供の保険が一般的だが、失業時は高額な個人保険が必要

アメリカは収入ポテンシャルが高い反面、税負担・医療費・住居費も高く、MoveWorthで慎重なシミュレーションを行うことをお勧めします。`,
      en: `The United States is the world's largest economy, offering top-tier career opportunities in tech, finance, healthcare, and academia. However, work visa competition is fierce and the immigration process is complex.

### Main Work Visa Types

**H-1B (Specialty Occupation Visa)**
The most common U.S. work visa for specialty occupations requiring a bachelor's degree or higher.
- Annual lottery in April (65,000 cap + 20,000 for U.S. master's holders)
- Validity: 3 years (up to 6 years, extendable while pursuing employment-based green card)
- Application fees: USD 730–4,730 (paid by employer)

**L-1 (Intracompany Transferee)**
For managers, executives, and specialized knowledge workers transferring from a foreign affiliate.
- L-1A (managers/executives): Up to 7 years
- L-1B (specialized knowledge): Up to 5 years

**O-1 (Extraordinary Ability)**
For individuals with extraordinary achievement in science, arts, education, business, or athletics. No lottery.

**TN Visa (USMCA)**
For Canadian and Mexican citizens only (not applicable to Japanese nationals).

**EB-1/EB-2/EB-3 (Employment-Based Green Card)**
Permanent residency through employment. EB-2 NIW (National Interest Waiver) is popular with researchers and professionals. Process can take several years to over a decade.

**DV Lottery (Diversity Visa)**
Grants ~50,000 green cards annually by lottery. Japan is not an eligible country, so Japanese nationals cannot apply.

### Cost Summary

| Item | Cost |
|------|------|
| H-1B filing fees (employer) | USD 730–4,730 |
| Green card application fees | USD 1,225+ |
| O-1 filing fee | USD 460+ |

### Pre-Move Checklist

1. **H-1B lottery risk**: Competition ratio is 3–5x+ annually; multiple attempts may be needed
2. **Tax complexity**: Federal + state + local tax structure varies significantly by state
3. **Health insurance**: Employer-provided insurance is standard; individual coverage is expensive if unemployed

The U.S. offers high income potential but also high taxes, healthcare costs, and housing expenses. We recommend thorough simulation in MoveWorth before committing.`,
      zh: `美国是全球最大的经济体，在科技、金融、医疗和学术等众多领域提供顶尖职业发展机会。然而，就业签证竞争激烈，移民流程也较为复杂。

### 主要就业签证种类

**H-1B（专业工作签证）**
美国最常见的就业签证，适用于需要本科以上学历的专业岗位。
- 每年4月抽签（65,000个名额 + 美国硕士持有者20,000个名额）
- 有效期：3年（最长6年，等待就业类绿卡期间可延期）
- 申请费用：USD 730～4,730（由雇主承担）

**L-1（跨国公司内部调任签证）**
面向从美国企业的海外关联公司调任的管理人员和专业技术人员。
- L-1A（管理人员/高管）：最长7年
- L-1B（专业知识人员）：最长5年

**O-1（杰出能力签证）**
面向在科学、艺术、教育、商业或体育领域拥有卓越成就的人士，无需抽签。

**EB-1/EB-2/EB-3（就业类绿卡）**
永久居留权的就业类别。EB-2 NIW（国家利益豁免）在研究人员和专业人士中颇受欢迎，整体流程可能历时数年乃至十余年。

### 费用参考

| 项目 | 费用 |
|------|------|
| H-1B申请费（雇主） | USD 730～4,730 |
| 绿卡申请费 | USD 1,225起 |
| O-1申请费 | USD 460起 |

### 移居前注意事项

1. **H-1B抽签风险**：每年竞争比例高达3～5倍以上，可能需要多次尝试
2. **税务复杂性**：联邦税+州税+地方税多层结构，各州税率差异显著
3. **医疗保险**：通常由雇主提供，失业时个人保险费用高昂

美国收入潜力高，但税负、医疗费和住房成本同样不低，建议在MoveWorth中进行充分模拟后再做决定。`,
    },
  },
  {
    slug: "visa-ca",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "カナダのビザ・移住条件完全ガイド2026年版",
      en: "Canada Visa & Immigration Complete Guide 2026",
      zh: "加拿大签证与移民条件完全指南2026年版",
    },
    description: {
      ja: "エクスプレスエントリーからPNPまで。カナダの主要な移民ビザの種類・要件・費用を徹底解説。",
      en: "From Express Entry to PNP — a complete guide to Canada's main immigration visa types, requirements, and costs.",
      zh: "从快速通道到省提名计划，全面解析加拿大主要移民签证的种类、要求与费用。",
    },
    content: {
      ja: `カナダは積極的な移民受け入れ政策を持つ国で、永住権（PR）取得のしやすさと高い生活水準から世界中からの移民が集まります。

### 主な移住ルート

**エクスプレスエントリー（Express Entry）**
熟練外国人労働者向けの連邦管轄の移民プログラム。3つのプログラムが対象。
- Federal Skilled Worker（FSW）：学歴・就労経験・語学力などでCRS（総合ランキングシステム）スコア算出
- Canadian Experience Class（CEC）：カナダ国内での就労経験が条件
- Federal Skilled Trades：特定の技能職対象
- CRSスコアが高いほど早くPR申請が可能

**州推薦プログラム（PNP：Provincial Nominee Program）**
各州・準州が独自の基準で移民を推薦する制度。エクスプレスエントリーと組み合わせることでCRSスコアに600点追加。

**スタートアップビザ**
カナダの認定インキュベーター・VC・エンジェル投資家の支援を受けた起業家向けの永住権ルート。

**ワーキングホリデー（IEC）**
18〜35歳の日本人向け。年間最大6,500名（2024年度）。1年間就労・滞在可能。
- 申請費用：CAD 161

**就労許可（Work Permit）**
カナダの企業に雇用される場合に取得。LMIAが必要なケースと不要のケース（会社内転勤等）あり。

### 費用の目安

| 項目 | 費用 |
|------|------|
| エクスプレスエントリー（PR）申請費 | CAD 1,365（本人）|
| ワーキングホリデー（IEC）申請費 | CAD 161 |
| 就労許可申請費 | CAD 155 |

### 移住前のチェックポイント

1. **CRSスコアの把握**：英語（IELTS）スコアがCRSに大きく影響
2. **州の選択**：各州によって生活コスト・就職市場が大きく異なる（バンクーバーとプレーリー州等）
3. **税金**：連邦税＋州税の二層構造。ケベック州は独自の税制を持つ

カナダは永住権取得の透明性が高く、定住を前提とした移住を考える方に向いています。`,
      en: `Canada's active immigration policy and high standard of living attract immigrants from around the world. It is known for its relatively accessible permanent residency pathway.

### Main Immigration Routes

**Express Entry**
Federal immigration management system for skilled foreign workers across 3 programs:
- Federal Skilled Worker (FSW): CRS (Comprehensive Ranking System) score based on education, work experience, language ability
- Canadian Experience Class (CEC): Requires Canadian work experience
- Federal Skilled Trades: For specific trades
- Higher CRS scores lead to earlier PR invitations

**Provincial Nominee Program (PNP)**
Each province/territory nominates immigrants based on its own criteria. A provincial nomination adds 600 CRS points in Express Entry.

**Start-Up Visa**
Permanent residency pathway for entrepreneurs supported by Canadian designated incubators, VCs, or angel investors.

**Working Holiday (IEC)**
For Japanese citizens aged 18–35. Up to 6,500 spots (2024). Allows 1 year of work and stay.
- Application fee: CAD 161

**Work Permit**
Required for those employed by Canadian companies. LMIA may or may not be required depending on the situation.

### Cost Summary

| Item | Cost |
|------|------|
| Express Entry (PR) application fee | CAD 1,365 (principal applicant) |
| Working Holiday (IEC) fee | CAD 161 |
| Work permit application fee | CAD 155 |

### Pre-Move Checklist

1. **CRS score**: IELTS English scores heavily impact CRS
2. **Province selection**: Cost of living and job markets differ significantly (Vancouver vs. Prairie provinces)
3. **Taxes**: Federal + provincial two-tier tax system; Quebec has its own tax structure

Canada is known for its transparent immigration system and suits those planning long-term settlement.`,
      zh: `加拿大移民政策积极开放，以相对便捷的永久居留路径和高水平的生活质量吸引全球移民。

### 主要移民途径

**快速通道（Express Entry）**
面向技术型外籍劳工的联邦移民管理系统，涵盖3个项目：
- 联邦技术工人计划（FSW）：根据学历、工作经验、语言能力等计算CRS综合排名分数
- 加拿大经验类（CEC）：须具备加拿大境内工作经验
- 联邦技工类（Federal Skilled Trades）：面向特定技能职业
CRS分数越高，越早收到邀请函

**省提名计划（PNP）**
各省及领地依据自身标准提名移民，与快速通道结合可为CRS额外加600分。

**创业签证（Start-Up Visa）**
面向获得加拿大认可孵化器、风险投资机构或天使投资人支持的创业者，直接获得永久居留权。

**打工度假（IEC）**
面向18～35岁的日本人，年度名额最多6,500人（2024年度），可在加拿大工作并居留1年。申请费用：CAD 161。

**工作许可证**
受雇于加拿大企业时需要，部分情况需LMIA（劳动力市场影响评估），部分情况可豁免。

### 费用参考

| 项目 | 费用 |
|------|------|
| 快速通道（PR）申请费 | CAD 1,365（本人） |
| 打工度假（IEC）申请费 | CAD 161 |
| 工作许可证申请费 | CAD 155 |

### 移居前注意事项

1. **CRS分数**：英语（IELTS）成绩对CRS分数影响重大
2. **省份选择**：各省生活成本和就业市场差异显著（温哥华与草原省份等）
3. **税务**：联邦税+省税两级制度，魁北克省有独立税制

加拿大移民制度透明度高，适合以定居为目标进行长期规划的人士。`,
    },
  },
  {
    slug: "visa-gb",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "イギリスのビザ・就労許可完全ガイド2026年版",
      en: "United Kingdom Visa & Work Permit Complete Guide 2026",
      zh: "英国签证与工作许可完全指南2026年版",
    },
    description: {
      ja: "Skilled Worker Visaからグローバルタレントビザまで。イギリスの主要ビザの種類・要件・費用を徹底解説。",
      en: "From Skilled Worker Visa to Global Talent Visa — a complete guide to the UK's main visa types, requirements, and costs.",
      zh: "从技术工人签证到全球人才签证，全面解析英国主要签证的种类、要求与费用。",
    },
    content: {
      ja: `イギリスはBrexit後の独自移民制度を2021年に導入し、EUを含む全ての外国人に対して統一的なポイントベース制度を適用しています。

### 主なビザの種類

**Skilled Worker Visa**
イギリスの主要な就労ビザ。認定雇用主からの雇用証明書（CoS）が必要。
- 要件：認定雇用主からのスポンサーシップ + 英語能力（B1以上）+ 最低給与（職種別）
- 最低給与：年収GBP 38,700（または職種別最低賃金の高い方）（2024年改定）
- 有効期間：最大5年
- 申請費用：GBP 610〜1,235（居住期間・申請場所による）

**Global Talent Visa**
科学・人文科学・エンジニアリング・芸術・デジタル分野のトップ人材向け。スポンサー不要。
- 認定機関（Royal Academy of Engineering、Tech Nationなど）の推薦が必要

**Youth Mobility Scheme（ワーキングホリデー）**
18〜30歳の日本人向け（2023年に年齢上限が30歳に拡大）。2年間就労・滞在可能。年間6,000名（日本人枠）。
- 申請費用：GBP 259

**UK Innovator Founder Visa**
革新的なビジネスを立ち上げる起業家向けビザ。認定機関による事業計画の承認が必要。GBP 50,000の投資資金が条件。

**永住権（Indefinite Leave to Remain：ILR）**
5年以上の適法滞在後に申請可能。English Life in the UK テストへの合格が必要。

### 費用の目安

| 項目 | 費用 |
|------|------|
| Skilled Worker Visa（海外申請） | GBD 610〜1,235 |
| Youth Mobility Scheme | GBP 259 |
| 医療費負担金（IHS）/年 | GBP 1,035 |

### 移住前のチェックポイント

1. **IHS（Immigration Health Surcharge）**：ビザ申請時に期間分を一括前払い（現在GBP 1,035/年）
2. **生活費の高騰**：ロンドンは世界屈指の高物価都市。住居費は特に注意
3. **英語力の証明**：IELTS Academic/General Training で B1以上が必要

イギリスは欧州での就労拠点として魅力的ですが、物価・住居費の高さとビザコストを総合的に検討する必要があります。`,
      en: `The UK introduced its new points-based immigration system in 2021 post-Brexit, applying a unified framework to all foreign nationals including EU citizens.

### Main Visa Types

**Skilled Worker Visa**
The UK's primary work visa. Requires a Certificate of Sponsorship (CoS) from a licensed employer.
- Requirements: Licensed employer sponsorship + English language ability (B1+) + minimum salary threshold
- Minimum salary: GBP 38,700/year or going rate for the occupation (post-2024 revision)
- Validity: Up to 5 years
- Application fee: GBP 610–1,235 (depending on duration and location)

**Global Talent Visa**
For leading experts in science, humanities, engineering, arts, and digital technology. No sponsor required.
- Requires endorsement from a designated body (e.g., Royal Academy of Engineering, Tech Nation)

**Youth Mobility Scheme (Working Holiday)**
For Japanese nationals aged 18–30 (age limit extended to 30 in 2023). 2 years of work and stay. 6,000 places for Japanese nationals annually.
- Application fee: GBP 259

**UK Innovator Founder Visa**
For entrepreneurs founding innovative businesses. Requires endorsement from an approved body and GBP 50,000 in investment funds.

**Indefinite Leave to Remain (ILR)**
Permanent residency after 5+ years of lawful residence. Requires passing the Life in the UK test.

### Cost Summary

| Item | Cost |
|------|------|
| Skilled Worker Visa (overseas application) | GBP 610–1,235 |
| Youth Mobility Scheme | GBP 259 |
| Immigration Health Surcharge (IHS)/year | GBP 1,035 |

### Pre-Move Checklist

1. **IHS (Immigration Health Surcharge)**: Full amount paid upfront at application (currently GBP 1,035/year)
2. **High cost of living**: London is among the world's most expensive cities, especially for housing
3. **English language proof**: IELTS score of B1 or above required

The UK is an attractive European base, but housing costs, the cost of living, and visa fees must be carefully evaluated together.`,
      zh: `英国在2021年脱欧后推出新的积分制移民制度，对包括欧盟国家在内的所有外籍人士统一适用。

### 主要签证种类

**技术工人签证（Skilled Worker Visa）**
英国主要就业签证，需获得持牌雇主的担保证书（CoS）。
- 要求：持牌雇主担保 + 英语能力（B1级以上）+ 最低薪资门槛
- 最低年薪：GBP 38,700或职业最低工资标准（取较高者，2024年修订）
- 有效期：最长5年
- 申请费用：GBP 610～1,235（因居留期限和申请地点而异）

**全球人才签证（Global Talent Visa）**
面向科学、人文、工程、艺术和数字技术领域的顶尖人才，无需雇主担保，需获得指定机构（如英国皇家工程院）的认可。

**青年交流计划（打工度假）**
面向18～30岁日本人（2023年起上限提高至30岁），可在英国工作并居留2年，日本人年度名额6,000人。申请费用：GBP 259。

**英国创业创新签证**
面向在英创办创新型企业的创业者，需获得认可机构认可并备有GBP 50,000的投资资金。

**无限期居留权（ILR）**
合法居留5年以上后可申请，需通过英国生活测试。

### 费用参考

| 项目 | 费用 |
|------|------|
| 技术工人签证（海外申请） | GBP 610～1,235 |
| 青年交流计划 | GBP 259 |
| 移民医疗附加费（IHS）/年 | GBP 1,035 |

### 移居前注意事项

1. **IHS（移民医疗附加费）**：申请时须一次性预付全部费用（现为GBP 1,035/年）
2. **生活成本高企**：伦敦是全球物价最高的城市之一，住房成本尤需注意
3. **英语能力证明**：需要IELTS B1级以上成绩

英国是进军欧洲市场的理想据点，但住房成本、生活费和签证费用须综合评估。`,
    },
  },
  {
    slug: "visa-de",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "ドイツのビザ・就労許可完全ガイド2026年版",
      en: "Germany Visa & Work Permit Complete Guide 2026",
      zh: "德国签证与工作许可完全指南2026年版",
    },
    description: {
      ja: "EUブルーカードから就労ビザまで。ドイツの主要ビザの種類・要件・費用を徹底解説。",
      en: "From EU Blue Card to work visas — a complete guide to Germany's main visa types, requirements, and costs.",
      zh: "从欧盟蓝卡到就业签证，全面解析德国主要签证的种类、要求与费用。",
    },
    content: {
      ja: `ドイツはEU最大の経済大国で、製造業・IT・エンジニアリングを中心に外国人専門職の需要が高い国です。2023年に移民法が改正され、第三国出身者にも門戸が開かれています。

### 主なビザの種類

**EUブルーカード（EU Blue Card）**
高度人材向けのEU共通就労・居住許可証。ドイツで特に人気。
- 要件：大学学位 + 雇用契約 + 最低年収EUR 43,992（2024年）/ IT分野等は EUR 39,682
- 有効期間：4年（または雇用期間+3ヶ月）
- 2年でPRへの移行可能（ドイツ語B1レベルがあれば21ヶ月）

**専門労働者ビザ（Fachkräftevisum）**
職業訓練・資格職向けビザ（2023年法改正で対象拡大）。職業資格と雇用契約が必要。

**求職者ビザ（Job-Seeker Visa）**
ドイツでの就職活動のための6ヶ月間ビザ。大学学位と生計費証明が必要。

**フリーランスビザ（Freiberufler Visa）**
芸術・言語・科学・技術・医療などの自由業者向け。

**機会カード（Chancenkarte）**
2024年に導入された新制度。ポイント制（学歴・語学・職歴・年齢・ドイツとの関連性）で就職活動目的の滞在許可が取得可能。

### 費用の目安

| 項目 | 費用 |
|------|------|
| ビザ申請費（日本の大使館） | EUR 75 |
| 滞在許可更新費 | EUR 100〜 |

### 移住前のチェックポイント

1. **ドイツ語能力**：就職活動・PR取得においてドイツ語（B1以上）が大きなアドバンテージ
2. **資格認定**：海外取得の学位・資格はアナビン（anabin）データベースで認定状況を確認
3. **社会保険**：健康保険・年金・失業保険・介護保険の合計で給与の約20%が社会保険料

ドイツは2023年の移民法改正で第三国からの移住が以前より容易になっており、特に技術職・エンジニア職でのキャリアを考える方に適した移住先です。`,
      en: `Germany is the EU's largest economy with high demand for skilled foreign professionals in manufacturing, IT, and engineering. The 2023 immigration law reform has opened more pathways for non-EU nationals.

### Main Visa Types

**EU Blue Card**
The EU's unified work and residence permit for highly qualified workers. Especially popular in Germany.
- Requirements: University degree + employment contract + minimum annual salary of EUR 43,992 (2024); EUR 39,682 for IT and shortage occupations
- Validity: 4 years (or duration of contract + 3 months)
- PR eligible after 2 years (21 months with German B1 level)

**Skilled Worker Visa (Fachkräftevisum)**
Visa for trade/vocational qualification holders (scope expanded by 2023 reform). Requires recognized qualifications and employment contract.

**Job-Seeker Visa**
6-month visa for job hunting in Germany. Requires university degree and proof of sufficient funds.

**Freelancer Visa (Freiberufler Visa)**
For self-employed professionals in arts, languages, science, technology, or healthcare.

**Opportunity Card (Chancenkarte)**
New points-based system introduced in 2024 for those wanting to seek work in Germany (scored on education, language, experience, age, and ties to Germany).

### Cost Summary

| Item | Cost |
|------|------|
| Visa application fee (German embassy in Japan) | EUR 75 |
| Residence permit renewal fee | EUR 100+ |

### Pre-Move Checklist

1. **German language ability**: German (B1+) is a major advantage for job hunting and PR
2. **Credential recognition**: Check overseas degrees and qualifications in the anabin database
3. **Social insurance**: Combined health, pension, unemployment, and care insurance is approximately 20% of salary

Germany's 2023 immigration reform has made it easier for non-EU nationals to relocate, making it an ideal destination for those pursuing careers in technical and engineering fields.`,
      zh: `德国是欧盟最大经济体，制造业、IT和工程领域对外籍专业人才的需求旺盛。2023年移民法改革为第三国公民打开了更多渠道。

### 主要签证种类

**欧盟蓝卡（EU Blue Card）**
面向高素质人才的欧盟统一就业居留许可，在德国尤为普及。
- 要求：大学学历 + 雇用合同 + 最低年薪EUR 43,992（2024年）；IT等紧缺职业为EUR 39,682
- 有效期：4年（或合同期限+3个月）
- 持卡2年（具备德语B1水平则21个月）后可申请永久居留权

**技术工人签证（Fachkräftevisum）**
面向职业培训或资质认证人员（2023年法改革扩大适用范围），需有认可资质和雇用合同。

**求职签证（Job-Seeker Visa）**
在德国求职用的6个月签证，需具备大学学历和生活费证明。

**自由职业签证（Freiberufler Visa）**
适用于艺术、语言、科学、技术或医疗领域的自由职业者。

**机会卡（Chancenkarte）**
2024年推出的新积分制度（学历、语言、工作经验、年龄、与德国的关联性评分），可获得以求职为目的的居留许可。

### 费用参考

| 项目 | 费用 |
|------|------|
| 签证申请费（驻日德国大使馆） | EUR 75 |
| 居留许可续签费 | EUR 100起 |

### 移居前注意事项

1. **德语能力**：德语（B1级以上）在求职和申请永久居留方面具有重要优势
2. **资质认定**：海外取得的学历和资质需在anabin数据库确认认定状态
3. **社会保险**：医疗、养老、失业、护理保险合计约占薪资的20%

德国2023年移民法改革使第三国公民移居德国比以往更为便利，尤其适合有意发展技术和工程领域职业的人士。`,
    },
  },
  {
    slug: "visa-fr",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "フランスのビザ・就労許可完全ガイド2026年版",
      en: "France Visa & Work Permit Complete Guide 2026",
      zh: "法国签证与工作许可完全指南2026年版",
    },
    description: {
      ja: "タレントパスポートから就労ビザまで。フランスの主要ビザの種類・要件・費用を徹底解説。",
      en: "From Talent Passport to work visas — a complete guide to France's main visa types, requirements, and costs.",
      zh: "从人才护照到就业签证，全面解析法国主要签证的种类、要求与费用。",
    },
    content: {
      ja: `フランスはファッション・食・芸術だけでなく、スタートアップエコシステム（ステーション F）やIT産業でも外国人人材を積極的に求めています。

### 主なビザの種類

**タレントパスポート（Passeport Talent）**
フランスの高度人材・起業家向けの優遇ビザ。複数のカテゴリがあります。
- 研究者・高度人材：雇用契約 or 研究協定 + 学士以上
- 企業の幹部・専門家：年収EUR 35,000以上
- 起業家：フランスでの経済的・社会的に有用な事業を立ち上げる
- 革新的企業の従業員：La French Tech認定スタートアップ等
- 有効期間：最大4年（家族同伴可）

**就労許可証付きビザ（Visa de long séjour valant titre de séjour）**
一般的な就労ビザ。事前に労働局の承認が必要。雇用主がサポートを行う。

**ワーキングホリデービザ（PVT：Programme Vacances Travail）**
18〜30歳の日本人向け（年齢上限30歳）。1年間の就労・滞在が可能。
- 申請費用：EUR 100程度

**Tech Visa（La French Tech ビザ）**
La French Techのパートナーリストに含まれるスタートアップで働く外国人向けの簡略化された就労ビザ手続き。

### 費用の目安

| 項目 | 費用 |
|------|------|
| 長期ビザ申請費 | EUR 99 |
| ワーキングホリデー（PVT） | EUR 100程度 |

### 移住前のチェックポイント

1. **フランス語能力**：パリ以外の地方では英語が通じにくいケースが多い。日常生活にはフランス語が必要
2. **社会保険料の高さ**：給与の約23%が雇用者負担の社会保険料。手取りが国によっては大幅に変わる
3. **住居問題**：パリは賃貸市場が厳しく、保証人（担保）要件が外国人には厳しい場合も

フランスはスタートアップ・芸術・研究分野でのキャリアを考える方に向いた移住先です。タレントパスポートの対象となるかどうかが鍵となります。`,
      en: `France is not only known for fashion, food, and art, but is also actively seeking foreign talent for its growing startup ecosystem (Station F) and IT industry.

### Main Visa Types

**Talent Passport (Passeport Talent)**
France's preferential visa for highly skilled workers and entrepreneurs, available across several categories:
- Researchers and highly qualified professionals: Employment contract or research agreement + bachelor's degree
- Corporate executives and specialists: Annual salary EUR 35,000+
- Entrepreneurs: Starting an economically/socially beneficial business in France
- Employees of innovative companies: Working at La French Tech recognized startups, etc.
- Validity: Up to 4 years (family members can join)

**Long-Stay Visa with Residence Permit (Visa de long séjour valant titre de séjour)**
Standard work visa. Requires prior approval from the labor authority. Employer provides support.

**Working Holiday Visa (PVT: Programme Vacances Travail)**
For Japanese nationals aged 18–30. 1 year of work and stay permitted.
- Application fee: Approximately EUR 100

**Tech Visa (La French Tech Visa)**
Simplified work visa procedure for foreign nationals employed by startups on the La French Tech partner list.

### Cost Summary

| Item | Cost |
|------|------|
| Long-stay visa application fee | EUR 99 |
| Working Holiday (PVT) | Approx. EUR 100 |

### Pre-Move Checklist

1. **French language ability**: English is less commonly used outside Paris; French is essential for daily life
2. **High social charges**: Approximately 23% of salary goes toward employer-side social insurance — take-home pay varies significantly
3. **Housing challenges**: Paris rental market is competitive; guarantor requirements can be strict for foreigners

France is well-suited for those pursuing careers in startups, arts, or research. Whether you qualify for the Talent Passport is a key consideration.`,
      zh: `法国不仅以时尚、美食和艺术闻名，其蓬勃发展的创业生态（Station F）和IT产业也在积极吸引外籍人才。

### 主要签证种类

**人才护照（Passeport Talent）**
法国面向高技能人才和创业者的优惠签证，设有多个类别：
- 研究人员及高技能专业人士：雇用合同或研究协议 + 本科以上学历
- 企业高管及专业人员：年薪EUR 35,000以上
- 创业者：在法国创办具有经济或社会价值的事业
- 创新型企业员工：受雇于La French Tech认可初创企业等
- 有效期：最长4年（可携带家属）

**长期签证附居留许可（Visa de long séjour valant titre de séjour）**
一般就业签证，需事先取得劳动局批准，由雇主协助申请。

**打工度假签证（PVT）**
面向18～30岁日本人，可在法国工作并居留1年。申请费用：约EUR 100。

**法国科技签证（La French Tech Visa）**
为受雇于La French Tech合作伙伴名单中初创企业的外籍人士提供简化就业签证流程。

### 费用参考

| 项目 | 费用 |
|------|------|
| 长期签证申请费 | EUR 99 |
| 打工度假（PVT） | 约EUR 100 |

### 移居前注意事项

1. **法语能力**：巴黎以外地区英语使用率较低，日常生活需要法语
2. **社会保险费高**：雇主负担的社会保险约占薪资的23%，实际到手收入因国而异
3. **租房难题**：巴黎租房市场竞争激烈，担保人要求对外国人可能较为严苛

法国适合有意在初创企业、艺术或研究领域发展职业的人士，是否符合人才护照申请条件是关键。`,
    },
  },
  {
    slug: "visa-nl",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "オランダのビザ・就労許可完全ガイド2026年版",
      en: "Netherlands Visa & Work Permit Complete Guide 2026",
      zh: "荷兰签证与工作许可完全指南2026年版",
    },
    description: {
      ja: "高度技能移住者ビザから30%ルーリングまで。オランダの主要ビザの種類・要件・費用を徹底解説。",
      en: "From Highly Skilled Migrant Visa to the 30% ruling — a complete guide to the Netherlands' main visa types and benefits.",
      zh: "从高技能移民签证到30%税收优惠，全面解析荷兰主要签证的种类、要求与福利。",
    },
    content: {
      ja: `オランダはアムステルダムを中心に多国籍企業のヨーロッパ本社が集まる国で、英語が広く通じる環境が外国人に人気です。

### 主なビザの種類

**高度技能移住者ビザ（Highly Skilled Migrant Visa：HSM）**
オランダで最も多く使用される就労ビザ。IND（オランダ移民局）認定の雇用主のスポンサーシップが必要。
- 最低月給（2024年）：
  - 30歳以上：EUR 5,331/月
  - 30歳未満：EUR 3,909/月
  - 大学卒業後1年以内：EUR 2,801/月
- 有効期間：最大3年（更新可）

**EUブルーカード（オランダ）**
HSMの代替として取得可能。最低年収EUR 73,071（2024年）。

**スタートアップビザ**
イノベーティブなビジネスを立ち上げる起業家向け。1年間の滞在許可後、自営業ビザへの移行が可能。

**ワーキングホリデー**
オランダは日本との間にワーキングホリデー協定がなく、対象外。

**オリエンテーションビザ（Orientation Year Visa）**
EU・欧州経済域またはオランダの大学卒業生向けの1年間の求職ビザ。

### 30%ルーリング（30% Ruling）

オランダ独自の外国人向け優遇税制。要件を満たす外国人労働者は、給与の30%を非課税手当として受け取れる（最大5年間）。
- 対象：海外から採用された希少スキル保持者
- 最低給与条件（2024年）：EUR 46,107以上

### 費用の目安

| 項目 | 費用 |
|------|------|
| HSMビザ申請費（IND） | EUR 345 |
| スタートアップビザ申請費 | EUR 345 |

### 移住前のチェックポイント

1. **住居難**：アムステルダムは賃貸住宅の需給が逼迫しており、物件確保が困難
2. **30%ルーリングの変更**：制度は毎年見直されるため、最新要件を確認
3. **自転車文化**：通勤・移動は自転車が基本。生活費節約にもつながる

オランダは英語環境で働ける数少ない欧州の国であり、IT・金融・物流分野でのキャリアを考える方に向いています。30%ルーリングによる節税効果も魅力です。`,
      en: `The Netherlands is home to European headquarters of many multinationals, centered on Amsterdam, and is popular with foreigners for its English-friendly environment.

### Main Visa Types

**Highly Skilled Migrant Visa (HSM)**
The most commonly used work visa in the Netherlands. Requires sponsorship from an IND-recognized employer.
- Minimum monthly salary (2024):
  - 30 years or older: EUR 5,331/month
  - Under 30 years: EUR 3,909/month
  - Within 1 year of university graduation: EUR 2,801/month
- Validity: Up to 3 years (renewable)

**EU Blue Card (Netherlands)**
Available as an alternative to HSM. Minimum annual salary of EUR 73,071 (2024).

**Startup Visa**
For entrepreneurs establishing innovative businesses. After 1 year, eligible to transition to a self-employment visa.

**Working Holiday**
The Netherlands does not have a working holiday agreement with Japan; not applicable for Japanese nationals.

**Orientation Year Visa**
1-year job-seeking visa for graduates of EU/EEA or Dutch universities.

### 30% Ruling

A unique Dutch tax incentive for qualifying foreign workers. Up to 30% of salary can be received as a tax-free allowance for up to 5 years.
- Target: Skilled workers recruited from abroad
- Minimum salary (2024): EUR 46,107+

### Cost Summary

| Item | Cost |
|------|------|
| HSM visa application fee (IND) | EUR 345 |
| Startup visa application fee | EUR 345 |

### Pre-Move Checklist

1. **Housing shortage**: Amsterdam's rental market is extremely tight; finding accommodation is challenging
2. **30% Ruling changes**: The scheme is reviewed annually — verify current requirements
3. **Cycling culture**: Bicycles are the primary transport mode, which also helps reduce living costs

The Netherlands is one of the few European countries where you can work primarily in English. It suits those pursuing careers in IT, finance, or logistics. The 30% ruling tax incentive is an additional draw.`,
      zh: `荷兰以阿姆斯特丹为中心，汇聚了众多跨国企业的欧洲总部，英语环境令外国人向往。

### 主要签证类型

**高技能移民签证（Highly Skilled Migrant Visa：HSM）**
荷兰使用最广泛的工作签证，需要获得IND（荷兰移民局）认可的雇主担保。
- 最低月薪要求（2024年）：
  - 30岁及以上：EUR 5,331/月
  - 30岁以下：EUR 3,909/月
  - 大学毕业后1年内：EUR 2,801/月
- 有效期：最长3年（可续签）

**欧盟蓝卡（荷兰版）**
作为HSM的替代方案，2024年最低年薪EUR 73,071。

**创业签证**
面向创立创新型企业的创业者，1年居留许可后可转为自雇签证。

**打工度假**
荷兰与日本没有打工度假协议，日本人不适用。

**定向年签证（Orientation Year Visa）**
面向欧盟/欧洲经济区或荷兰大学毕业生的1年期求职签证。

### 30%税收优惠制度（30% Ruling）

荷兰独特的外籍员工优惠税制：符合条件的外籍劳动者可将薪资的30%作为免税津贴领取（最长5年）。
- 对象：从海外引进的稀缺技能人才
- 最低薪资条件（2024年）：EUR 46,107以上

### 费用概览

| 项目 | 费用 |
|------|------|
| HSM签证申请费（IND） | EUR 345 |
| 创业签证申请费 | EUR 345 |

### 移居前注意事项

1. **住房紧张**：阿姆斯特丹租房市场供需失衡，寻找合适住所颇具挑战
2. **30%税收优惠的变化**：制度每年都会调整，请确认最新要求
3. **自行车文化**：通勤和出行以自行车为主，有助于节省生活费用

荷兰是少数几个可以主要用英语工作的欧洲国家，非常适合希望在IT、金融或物流领域发展职业的人士，30%税收优惠制度带来的节税效果也是一大吸引力。`,
    },
  },
  {
    slug: "visa-ch",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "スイスのビザ・就労許可完全ガイド2026年版",
      en: "Switzerland Visa & Work Permit Complete Guide 2026",
      zh: "瑞士签证与居留许可完全指南2026年版",
    },
    description: {
      ja: "LビザからBビザまで。スイスの主要ビザ・就労許可の種類・要件・費用を徹底解説。",
      en: "From L permit to B permit — a complete guide to Switzerland's main visa types, requirements, and costs.",
      zh: "从L居留许可到B居留许可，全面解析瑞士主要签证与就业许可的种类、要求与费用。",
    },
    content: {
      ja: `スイスは世界最高水準の給与と生活水準を誇る国で、金融・製薬・時計・テクノロジー産業を中心に外国人専門職が活躍しています。

### スイスの就労許可制度

スイスの就労許可はビザではなく「居住許可証（Permit）」として管理されています。EU/EFTA市民と第三国国民（日本人含む）で扱いが大きく異なります。

**L居住許可（短期居住許可）**
1年未満の就労・居住向け。第三国国民には厳しい年間クォータが設けられている。

**B居住許可（居住許可）**
1年以上の就労に適用される許可証。5年間のB許可後にC許可（永住権）を申請可能。

**C居住許可（永住権）**
10年以上（EU市民は5年）の滞在後に申請可能。申請条件にはスイスの言語（独・仏・伊）の習熟が含まれる。

**第三国国民クォータ**
スイスは第三国（日本含む）からの外国人就労者に対して年間クォータを設定。L許可は8,500件、B許可は4,500件（2024年）。ただし、高度人材・専門職は原則的にクォータ内で処理。

### 主な申請要件

- 雇用契約書（スイスの認定雇用主）
- スイスで代替できない高度なスキル・専門知識の証明
- カントン（州）ごとに審査（雇用地のカントンが許可）

### 費用の目安

| 項目 | 費用 |
|------|------|
| B居住許可申請費（カントンによる） | CHF 65〜 |
| 在日スイス大使館ビザ申請費 | CHF 80〜 |

### 移住前のチェックポイント

1. **高い生活コスト**：スイスは世界でも最も生活費が高い国の一つ。給与は高いが、家賃・食費・医療保険も高額
2. **強制医療保険（KVG/LAMal）**：スイスでは居住者全員が強制的に民間医療保険に加入。月額CHF 300〜700程度
3. **言語の問題**：地域によってドイツ語・フランス語・イタリア語が使われており、就労地の言語習得が重要

スイスは高給与が魅力ですが、生活コストも突出して高く、MoveWorthでの詳細なシミュレーションが特に重要な国です。`,
      en: `Switzerland offers some of the world's highest salaries and quality of life, with skilled foreign professionals active in finance, pharmaceuticals, watchmaking, and technology.

### Swiss Work Permit System

Switzerland manages work authorization through "residence permits" rather than traditional visas. The rules differ significantly between EU/EFTA nationals and third-country nationals (including Japanese).

**L Permit (Short-Term Residence Permit)**
For stays and work of less than 1 year. Strict annual quotas apply to third-country nationals.

**B Permit (Residence Permit)**
For stays and work of 1+ years. After 5 years on a B permit, C permit (permanent residence) can be applied for.

**C Permit (Permanent Residence)**
Available after 10+ years of residence (5 years for EU nationals). Requires proficiency in a Swiss language (German, French, or Italian).

**Third-Country National Quotas**
Switzerland sets annual quotas for workers from outside the EU/EFTA: 8,500 L permits and 4,500 B permits for third-country nationals (2024). Highly skilled professionals are generally processed within these quotas.

### Key Requirements

- Employment contract with a Swiss employer
- Proof of specialized skills/expertise not readily available in Switzerland
- Reviewed by the canton (state) where work is based

### Cost Summary

| Item | Cost |
|------|------|
| B permit application fee (varies by canton) | CHF 65+ |
| Swiss embassy visa application fee (Japan) | CHF 80+ |

### Pre-Move Checklist

1. **High cost of living**: Switzerland is one of the world's most expensive countries. High salaries come with high rent, food, and health insurance costs
2. **Mandatory health insurance (KVG/LAMal)**: All residents must enroll in private health insurance (approx. CHF 300–700/month)
3. **Language**: German, French, or Italian depending on region — learning the local language is important

Switzerland's high salaries are attractive, but its cost of living is also exceptionally high. Detailed simulation in MoveWorth is especially important for this destination.`,
      zh: `瑞士拥有世界一流的薪资水平和生活质量，在金融、制药、钟表和科技产业，外籍专业人才大显身手。

### 瑞士就业许可制度

瑞士通过「居留许可证（Permit）」而非传统签证来管理工作资格。欧盟/欧洲自由贸易联盟公民与第三国公民（包括日本人）的待遇差异显著。

**L居留许可（短期居留许可）**
用于1年以内的就业和居住，对第三国公民设有严格的年度配额限制。

**B居留许可（居留许可）**
适用于1年以上的就业。持有B许可5年后可申请C许可（永久居留权）。

**C居留许可（永久居留权）**
居住10年以上（欧盟公民为5年）后可申请。申请条件包括掌握瑞士语言（德语、法语或意大利语）。

**第三国公民配额**
瑞士对来自欧盟/欧洲自由贸易联盟以外国家的就业人员设置年度配额：第三国公民可获L许可8,500个、B许可4,500个（2024年）。高技能专业人才通常在配额内处理。

### 主要申请要求

- 与瑞士雇主签订劳动合同
- 证明具备瑞士国内难以替代的专业技能
- 由就业所在州（Canton）审查批准

### 费用概览

| 项目 | 费用 |
|------|------|
| B居留许可申请费（因州而异） | CHF 65起 |
| 瑞士大使馆签证申请费（在日本） | CHF 80起 |

### 移居前注意事项

1. **高生活成本**：瑞士是全球生活费用最高的国家之一，薪资虽高，但房租、食品和医疗保险费用同样高昂
2. **强制医疗保险（KVG/LAMal）**：瑞士居民必须强制参加私人医疗保险，每月约CHF 300〜700
3. **语言问题**：不同地区使用德语、法语或意大利语，学习当地语言至关重要

瑞士高薪固然诱人，但生活成本同样异常高昂，特别需要在MoveWorth上进行详细的财务模拟。`,
    },
  },
  {
    slug: "visa-au",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "オーストラリアのビザ・移住条件完全ガイド2026年版",
      en: "Australia Visa & Immigration Complete Guide 2026",
      zh: "澳大利亚签证与移民条件完全指南2026年版",
    },
    description: {
      ja: "スキルドビザ（482・189・190）からワーキングホリデーまで。オーストラリアの主要ビザの種類・要件・費用を徹底解説。",
      en: "From 482/189/190 skilled visas to working holiday — a complete guide to Australia's main visa types, requirements, and costs.",
      zh: "从482/189/190技术签证到打工度假签证，全面解析澳大利亚主要签证的种类、要求与费用。",
    },
    content: {
      ja: `オーストラリアはポイントベースの移民制度を採用しており、英語力・職歴・学歴によって永住権（PR）を取得できる国として人気です。

### 主なビザの種類

**482ビザ（Temporary Skill Shortage Visa）**
雇用主スポンサード型の就労ビザ。Medium-TermとShort-Termの2ストリーム。
- Medium-Term Stream（MLTSSL掲載職種）：最大4年、PR申請への道あり
- Short-Term Stream（STSOL掲載職種）：最大2年
- 申請費用：AUD 3,115〜

**189ビザ（Skilled Independent Visa）**
雇用主・州のスポンサー不要の永住ビザ。SkillSelectへの登録とポイントスコア（65点以上）でEOI提出。
- 申請費用：AUD 4,640〜

**190ビザ（Skilled Nominated Visa）**
州・準州政府の推薦が必要な永住ビザ。189より競争率が低い場合もある。
- 申請費用：AUD 4,640〜

**491ビザ（Skilled Work Regional Visa）**
地方地域の就労・居住が条件の5年間有効の暫定ビザ。3年後に191（永住）への移行が可能。

**ワーキングホリデービザ（Subclass 417）**
18〜30歳（一部35歳まで）の日本人向け。1年間の就労・旅行。農業・建設等の地方就労で2回・3回目の延長も可能。
- 申請費用：AUD 635

### ポイントシステム（SkillSelect）

年齢・英語力（IELTS）・学歴・職歴・Naatiポイントなどで算出。招待状（ITA）の取得に必要な最低スコアは申請タイミングにより変動。

### 費用の目安

| 項目 | 費用 |
|------|------|
| 482ビザ申請費 | AUD 3,115〜 |
| 189・190ビザ申請費 | AUD 4,640〜 |
| ワーキングホリデー（417）申請費 | AUD 635 |

### 移住前のチェックポイント

1. **英語力**：IELTSで就労ビザはCompetent（平均6.0）、PR申請は職種によりProficient（平均7.0）が必要
2. **職種のSOL（Skilled Occupation List）**：希望職種がSOLに掲載されているか確認が必須
3. **地方就労の活用**：地方就労でポイント加算・2回目のワーキングホリデー延長が可能

オーストラリアはPRへの道が比較的明確であり、英語圏への移住を希望する方に人気の国です。`,
      en: `Australia uses a points-based immigration system, making it popular for those looking to obtain permanent residency (PR) based on English ability, work experience, and education.

### Main Visa Types

**Subclass 482 (Temporary Skill Shortage Visa)**
Employer-sponsored work visa with two streams:
- Medium-Term Stream (MLTSSL occupations): Up to 4 years, pathway to PR
- Short-Term Stream (STSOL occupations): Up to 2 years
- Application fee: AUD 3,115+

**Subclass 189 (Skilled Independent Visa)**
Permanent visa requiring no employer or state sponsor. Submit EOI through SkillSelect with 65+ points.
- Application fee: AUD 4,640+

**Subclass 190 (Skilled Nominated Visa)**
Permanent visa requiring state/territory government nomination. Competition may be lower than 189.
- Application fee: AUD 4,640+

**Subclass 491 (Skilled Work Regional Visa)**
5-year provisional visa requiring work and residence in regional Australia. Can transition to Subclass 191 (permanent) after 3 years.

**Working Holiday Visa (Subclass 417)**
For Japanese nationals aged 18–30 (up to 35 in some cases). 1 year of work and travel. Regional work (agriculture, construction, etc.) allows 2nd and 3rd-year extensions.
- Application fee: AUD 635

### Points System (SkillSelect)

Points awarded for age, English proficiency (IELTS), education, work experience, Naati credential, and more. The minimum score to receive an invitation (ITA) varies with each round.

### Cost Summary

| Item | Cost |
|------|------|
| Subclass 482 application fee | AUD 3,115+ |
| Subclass 189/190 application fee | AUD 4,640+ |
| Working Holiday (417) application fee | AUD 635 |

### Pre-Move Checklist

1. **English proficiency**: Work visas require Competent level (IELTS average 6.0); PR applications may require Proficient (average 7.0)
2. **Skilled Occupation List (SOL)**: Verify your occupation is listed on the relevant SOL
3. **Regional work advantage**: Regional work can add points and enable Working Holiday extensions

Australia's clear pathway to PR makes it popular with those seeking English-speaking country relocation.`,
      zh: `澳大利亚采用积分制移民体系，凭借英语能力、工作经验和学历可获得永久居留权（PR），是海外移居的热门目的地。

### 主要签证类型

**482签证（临时技术短缺签证）**
雇主担保型工作签证，分两个流向：
- 中期流向（MLTSSL职业）：最长4年，可申请PR
- 短期流向（STSOL职业）：最长2年
- 申请费用：AUD 3,115起

**189签证（独立技术移民签证）**
无需雇主或州担保的永久居留签证，通过SkillSelect提交意向表（EOI），需65分以上。
- 申请费用：AUD 4,640起

**190签证（州提名技术移民签证）**
需要州/准州政府提名的永久居留签证，竞争可能低于189签证。
- 申请费用：AUD 4,640起

**491签证（技术工作地区签证）**
需在地区澳大利亚就业和居住的5年临时签证，3年后可转为191签证（永久居留）。

**打工度假签证（Subclass 417）**
面向18〜30岁（部分至35岁）日本人，可在澳大利亚工作和旅行1年。农业、建设等地区工作可获得第2次、第3次延签。
- 申请费用：AUD 635

### 积分制度（SkillSelect）

根据年龄、英语水平（IELTS）、学历、工作经验、NAATI证书等综合评分，获得邀请函（ITA）所需的最低分数随每轮申请而变化。

### 费用概览

| 项目 | 费用 |
|------|------|
| 482签证申请费 | AUD 3,115起 |
| 189/190签证申请费 | AUD 4,640起 |
| 打工度假（417）申请费 | AUD 635 |

### 移居前注意事项

1. **英语能力**：工作签证需达到胜任级别（IELTS平均6.0），PR申请视职业需达到精通级别（平均7.0）
2. **职业技能清单（SOL）**：必须确认目标职业是否在相关SOL上列出
3. **地区工作的优势**：地区工作可增加积分，并可延长打工度假签证

澳大利亚通往PR的道路相对清晰，是希望移居英语国家人士的热门选择。`,
    },
  },
  {
    slug: "visa-nz",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "ニュージーランドのビザ・移住条件完全ガイド2026年版",
      en: "New Zealand Visa & Immigration Complete Guide 2026",
      zh: "新西兰签证与移民条件完全指南2026年版",
    },
    description: {
      ja: "認定雇用主就労ビザから熟練移住者ビザまで。ニュージーランドの主要ビザの種類・要件・費用を徹底解説。",
      en: "From Accredited Employer Work Visa to Skilled Migrant Visa — a complete guide to New Zealand's main visa types, requirements, and costs.",
      zh: "从认证雇主工作签证到技术移民签证，全面解析新西兰主要签证的种类、要求与费用。",
    },
    content: {
      ja: `ニュージーランドは豊かな自然環境と高い生活水準を持つ国で、オーストラリアと並んでオセアニアへの移住先として人気があります。2022年に移民制度が大幅に改革されました。

### 主なビザの種類

**Accredited Employer Work Visa（AEWV）**
2022年7月に導入されたニュージーランドの主要な就労ビザ。認定雇用主からの雇用証明が必要。
- 要件：認定雇用主（ImmNZ認定）からの雇用オファー + 最低賃金基準の充足
- 有効期間：最大5年
- 申請費用：NZD 750〜

**熟練移住者カテゴリー（Skilled Migrant Category：SMC）**
ポイントベースの永住ビザ。職種・雇用状況・資格・英語力などでポイントを算出。
- 160ポイント以上で申請可能
- 申請費用：NZD 4,190〜

**Green List Visa**
2022年導入の特定の技能不足職種向けビザ。該当職種は即PR申請可能（Tier 1）または2年就労後にPR申請可能（Tier 2）。

**ワーキングホリデービザ**
18〜30歳（一部35歳まで）の日本人向け。1年間就労・滞在可能。
- 申請費用：NZD 315

**Investor Visa**
一定額以上の投資（カテゴリによりNZD 3,000,000〜15,000,000）でPRへの道。

### 費用の目安

| 項目 | 費用 |
|------|------|
| AEWV申請費 | NZD 750〜 |
| SMC申請費 | NZD 4,190〜 |
| ワーキングホリデー申請費 | NZD 315 |

### 移住前のチェックポイント

1. **英語力**：就労ビザ・永住ビザとも英語能力要件あり（IELTS・PTE等）
2. **Green Listの確認**：自身の職種がGreen List（Tier 1 / Tier 2）に該当するか確認
3. **住宅コスト**：オークランドは住宅価格・家賃ともに高騰している

ニュージーランドはオーストラリアに比べて移民数が少なく、Green Listを活用することで比較的スムーズにPRを取得できる職種もあります。`,
      en: `New Zealand offers stunning natural scenery and a high quality of life, making it a popular Oceanic destination alongside Australia. Its immigration system was significantly reformed in 2022.

### Main Visa Types

**Accredited Employer Work Visa (AEWV)**
New Zealand's primary work visa introduced in July 2022. Requires a job offer from an accredited employer.
- Requirements: Job offer from an ImmNZ-accredited employer + meet minimum wage criteria
- Validity: Up to 5 years
- Application fee: NZD 750+

**Skilled Migrant Category (SMC)**
Points-based permanent residency visa. Points awarded for occupation, employment, qualifications, and English proficiency.
- 160+ points required to apply
- Application fee: NZD 4,190+

**Green List Visa**
Introduced in 2022 for specific shortage occupations. Tier 1 occupations can apply directly for PR; Tier 2 can apply after 2 years of work.

**Working Holiday Visa**
For Japanese nationals aged 18–30 (up to 35 in some cases). 1 year of work and stay.
- Application fee: NZD 315

**Investor Visa**
Pathway to PR through investment (NZD 3,000,000–15,000,000 depending on category).

### Cost Summary

| Item | Cost |
|------|------|
| AEWV application fee | NZD 750+ |
| SMC application fee | NZD 4,190+ |
| Working holiday visa fee | NZD 315 |

### Pre-Move Checklist

1. **English proficiency**: Both work and PR visas require English ability (IELTS, PTE, etc.)
2. **Check the Green List**: Verify if your occupation falls under Green List Tier 1 or Tier 2
3. **Housing costs**: Auckland housing prices and rents have surged in recent years

New Zealand has a smaller immigrant population than Australia, and certain Green List occupations offer a relatively smooth path to permanent residency.`,
      zh: `新西兰拥有壮丽的自然风光和高品质的生活，是与澳大利亚并列的热门大洋洲移居目的地。2022年移民制度进行了重大改革。

### 主要签证类型

**认证雇主工作签证（AEWV）**
2022年7月推出的新西兰主要工作签证，需要获得认证雇主的工作邀请。
- 要求：获得ImmNZ认证雇主的录用邀请 + 满足最低工资标准
- 有效期：最长5年
- 申请费用：NZD 750起

**技术移民签证（Skilled Migrant Category：SMC）**
积分制永久居留签证，根据职业、就业状况、资历和英语能力等综合评分。
- 需160分以上方可申请
- 申请费用：NZD 4,190起

**绿色清单签证（Green List Visa）**
2022年推出，面向特定紧缺技能职业。第一层级职业可直接申请PR，第二层级可在工作2年后申请PR。

**打工度假签证**
面向18〜30岁（部分至35岁）日本人，可在新西兰工作和居住1年。
- 申请费用：NZD 315

**投资者签证**
通过一定金额投资（视类别为NZD 3,000,000〜15,000,000）获得永久居留权。

### 费用概览

| 项目 | 费用 |
|------|------|
| AEWV申请费 | NZD 750起 |
| SMC申请费 | NZD 4,190起 |
| 打工度假签证申请费 | NZD 315 |

### 移居前注意事项

1. **英语能力**：工作签证和永久居留签证均有英语能力要求（IELTS、PTE等）
2. **确认绿色清单**：确认自身职业是否属于绿色清单（第一层级/第二层级）
3. **住房成本**：奥克兰的住房价格和租金近年来大幅上涨

与澳大利亚相比，新西兰移民规模较小，某些绿色清单职业可相对顺利地获得永久居留权。`,
    },
  },
  {
    slug: "visa-ae",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "UAE（ドバイ）のビザ・就労許可完全ガイド2026年版",
      en: "UAE (Dubai) Visa & Work Permit Complete Guide 2026",
      zh: "阿联酋（迪拜）签证与工作许可完全指南2026年版",
    },
    description: {
      ja: "ゴールデンビザから就労ビザまで。UAEの主要ビザの種類・要件・費用を徹底解説。",
      en: "From Golden Visa to employment visas — a complete guide to the UAE's main visa types, requirements, and costs.",
      zh: "从黄金签证到就业签证，全面解析阿联酋主要签证的种类、要求与费用。",
    },
    content: {
      ja: `UAEは個人所得税ゼロの国として、金融・IT・ビジネス分野の外国人専門職を惹きつけています。ドバイを中心に世界中の高度人材が集まるグローバルハブです。

### 主なビザの種類

**ゴールデンビザ（10年居住ビザ）**
高度人材・投資家・起業家・優秀な学生向けの長期居住ビザ。
- 投資家：UAE不動産にAED 2,000,000以上投資
- 起業家：イノベーション事業でUAE当局の承認を受けた者
- 高度技能専門家：特定の戦略的職種（医師・エンジニア・IT専門家等）、月給AED 30,000以上
- 傑出した学生・研究者：GPA 3.75以上または学術的優秀性の証明
- 申請費用：AED 2,800〜

**就労ビザ（Employment Visa）**
UAEの企業に雇用される一般的なビザ。雇用主がスポンサーとなり、労働許可とビザをセットで申請。
- 有効期間：2〜3年（更新可）
- 申請費用：AED 1,200〜1,600程度（雇用主負担が一般的）

**フリーランスビザ**
フリーランサー・自営業者向けのビザ。ドバイメディアシティ等の特区（フリーゾーン）が提供。
- 申請費用：AED 7,500〜15,000程度（フリーゾーンによる）

**リタイアメントビザ**
55歳以上で以下のいずれかを満たす場合：
- 月収AED 20,000以上の年金
- UAE内の不動産（AED 2,000,000以上）
- 貯蓄AED 1,000,000以上

**デジタルノマドビザ（Virtual Working Programme）**
ドバイが2021年に導入。月収USD 5,000以上の海外就労者向け。1年間（更新可）。

### 費用の目安

| 項目 | 費用 |
|------|------|
| ゴールデンビザ申請費 | AED 2,800〜 |
| 就労ビザ（雇用主負担の場合も） | AED 1,200〜1,600 |
| デジタルノマドビザ | USD 287〜（手数料） |

### 移住前のチェックポイント

1. **所得税ゼロの恩恵**：個人所得税がないため、高収入の専門職は手取りが大幅に増加。ただし2023年から法人税9%導入
2. **高い生活コスト**：ドバイの家賃・教育費・外食費は高い。節税効果と生活費のバランスをシミュレーションで確認
3. **酒類・生活習慣**：イスラム文化の国であり、公共での飲酒不可等の規制がある

UAEはゼロ税率と高い生活水準が魅力のユニークな移住先です。MoveWorthで節税効果と生活費を計算してみてください。`,
      en: `The UAE attracts foreign professionals in finance, IT, and business with zero personal income tax. Dubai in particular is a global hub for top talent from around the world.

### Main Visa Types

**Golden Visa (10-Year Residence Visa)**
Long-term residency visa for highly skilled professionals, investors, entrepreneurs, and outstanding students.
- Investors: AED 2,000,000+ invested in UAE real estate
- Entrepreneurs: Business approved by UAE authorities for innovation
- Highly skilled professionals: Specific strategic occupations (doctors, engineers, IT specialists), monthly salary AED 30,000+
- Outstanding students/researchers: GPA 3.75+ or proven academic excellence
- Application fee: AED 2,800+

**Employment Visa**
Standard visa for those employed by UAE companies. Employer acts as sponsor and applies for both labor permit and visa.
- Validity: 2–3 years (renewable)
- Application fee: Approximately AED 1,200–1,600 (usually paid by employer)

**Freelance Visa**
For freelancers and self-employed professionals. Offered by free zones such as Dubai Media City.
- Application fee: Approx. AED 7,500–15,000 (varies by free zone)

**Retirement Visa**
For those 55+ meeting any of the following:
- Monthly pension income AED 20,000+
- UAE property valued at AED 2,000,000+
- Savings of AED 1,000,000+

**Digital Nomad Visa (Virtual Working Programme)**
Introduced by Dubai in 2021 for remote workers earning USD 5,000+/month. 1 year validity (renewable).

### Cost Summary

| Item | Cost |
|------|------|
| Golden Visa application fee | AED 2,800+ |
| Employment visa (may be employer-paid) | AED 1,200–1,600 |
| Digital Nomad Visa | USD 287+ (fees) |

### Pre-Move Checklist

1. **Zero income tax benefit**: No personal income tax means significantly higher take-home pay for high earners. Note: 9% corporate tax introduced in 2023
2. **High cost of living**: Dubai rents, education, and dining are expensive — use MoveWorth to balance tax savings against living costs
3. **Cultural norms**: Islamic culture means restrictions such as no public drinking

The UAE offers a unique combination of zero income tax and high living standards. Use MoveWorth to calculate the tax advantage against your cost of living.`,
      zh: `阿联酋以零个人所得税吸引着金融、IT和商业领域的外籍专业人才。以迪拜为中心，汇聚了来自世界各地的顶尖人才，是真正的全球枢纽。

### 主要签证类型

**黄金签证（10年居留签证）**
面向高技能专业人才、投资者、创业者和优秀学生的长期居留签证。
- 投资者：在阿联酋房产投资AED 2,000,000以上
- 创业者：获得阿联酋当局认可的创新型商业项目
- 高技能专业人才：特定战略性职业（医生、工程师、IT专家等），月薪AED 30,000以上
- 优秀学生/研究人员：GPA 3.75以上或证明学术卓越性
- 申请费用：AED 2,800起

**就业签证（Employment Visa）**
受雇于阿联酋企业的标准签证，雇主作为担保人同时申请劳动许可和签证。
- 有效期：2〜3年（可续签）
- 申请费用：约AED 1,200〜1,600（通常由雇主承担）

**自由职业签证（Freelance Visa）**
面向自由职业者和个体经营者，由迪拜媒体城等自由区提供。
- 申请费用：约AED 7,500〜15,000（视自由区而定）

**退休签证**
55岁以上且满足以下任一条件：
- 月养老金收入AED 20,000以上
- 持有价值AED 2,000,000以上的阿联酋房产
- 储蓄AED 1,000,000以上

**数字游民签证（Virtual Working Programme）**
迪拜于2021年推出，面向月收入USD 5,000以上的远程工作者，有效期1年（可续签）。

### 费用概览

| 项目 | 费用 |
|------|------|
| 黄金签证申请费 | AED 2,800起 |
| 就业签证（有时由雇主承担） | AED 1,200〜1,600 |
| 数字游民签证 | USD 287起（手续费） |

### 移居前注意事项

1. **零所得税的优惠**：无个人所得税意味着高收入专业人士的税后收入大幅增加。注意：2023年起征收9%企业所得税
2. **高生活成本**：迪拜的房租、教育和餐饮费用较高——请通过MoveWorth平衡节税效果与生活成本
3. **文化规范**：伊斯兰文化国家，禁止在公共场所饮酒等规定需要注意

阿联酋集零所得税和高生活水准于一体，是独特的移居目的地。请使用MoveWorth计算节税优势与生活成本之间的平衡。`,
    },
  },
  {
    slug: "visa-jp",
    category: "visa",
    date: "2026-02-22",
    readingTime: 6,
    title: {
      ja: "日本のビザ・就労条件完全ガイド2026年版（外国人向け）",
      en: "Japan Visa & Work Authorization Complete Guide 2026 (For Foreign Nationals)",
      zh: "日本签证与就业条件完全指南2026年版（面向外国人）",
    },
    description: {
      ja: "高度専門職ビザから技術・人文知識・国際業務ビザまで。日本の主要就労ビザの種類・要件・費用を徹底解説。",
      en: "From Highly Skilled Professional Visa to Engineer/Specialist in Humanities — a complete guide to Japan's main work visa types for foreign nationals.",
      zh: "从高度专业人才签证到技术·人文知识·国际业务签证，全面解析日本主要就业签证的种类、要求与费用。",
    },
    content: {
      ja: `日本は少子高齢化による人材不足を背景に、外国人の高度人材受け入れを積極的に推進しています。2023年には「特別高度人材制度（J-Skip）」や「未来創造人材制度（J-Find）」も導入されました。

### 主な就労ビザの種類

**高度専門職ビザ（ポイント制）**
日本の高度人材優遇ビザ。年収・学歴・職歴・日本語能力などのポイント制で審査（70点以上で取得可）。
- 高度専門職1号イ（学術研究）
- 高度専門職1号ロ（技術・人文知識）
- 高度専門職1号ハ（経営・管理）
- 5年後に永住権（高度専門職2号）申請可能（70点以上なら3年、80点以上なら1年に短縮）

**技術・人文知識・国際業務（技人国）**
日本で最も多く発給される就労ビザ。大卒以上またはそれに相当する実務経験が必要。IT・外資系・語学講師等が多い。

**経営・管理**
日本で事業を経営・管理する外国人向け。事務所設置・従業員雇用等の要件あり。

**特定技能1号・2号**
人材不足分野（介護・建設・農業等）の外国人労働者向け。技能評価試験の合格が必要。

**J-Skip（特別高度人材制度）**
2023年導入。以下のいずれかで即日・最初から高度専門職ビザを取得可能。
- 年収2,000万円以上
- 世界大学ランキング上位300位の大学卒業 + 年収1,000万円以上

**J-Find（未来創造人材制度）**
2023年導入。世界大学ランキング上位100位の大学卒業生が、卒業後2年以内に就職活動・起業活動目的で最大2年間滞在可能。

### 費用の目安

| 項目 | 費用 |
|------|------|
| 在留資格認定証明書（COE）申請費 | 無料 |
| ビザ申請費（日本大使館） | 国籍・ビザ種別により異なる（¥3,000〜¥6,000程度） |
| 在留カード発行費 | 無料 |

### 移住前のチェックポイント

1. **永住権の要件**：原則10年以上の在留（高度人材はポイントにより短縮）、素行良好、生計維持が可能であること
2. **税負担**：日本は所得税+社会保険料で合計30%前後の負担。MoveWorthのシミュレーションで確認を
3. **日本語能力**：就労ビザには必須ではないが、日常生活・キャリアアップには日本語能力が大きく影響

日本はアジアの中でも高い生活水準と安全性を誇りますが、税負担・高齢化・言語の壁も考慮が必要な移住先です。`,
      en: `Japan is actively promoting the acceptance of highly skilled foreign talent amid its labor shortage caused by an aging population. In 2023, it introduced new programs including J-Skip and J-Find.

### Main Work Visa Types

**Highly Skilled Professional Visa (Points-Based)**
Japan's preferential visa for highly skilled foreign workers. Scored on income, education, work experience, Japanese proficiency, and other factors (70+ points required).
- Category i (Academic research)
- Category ii (Technology/Humanities/International business)
- Category iii (Business management)
- PR eligible after 5 years (shortened to 3 years at 70+ points, 1 year at 80+ points)

**Engineer/Specialist in Humanities/International Services (Gijin-Kokusai)**
Japan's most commonly issued work visa. Requires a university degree or equivalent professional experience. Common for IT, foreign companies, and language instruction roles.

**Business Manager**
For foreigners operating or managing a business in Japan. Requires establishing an office and employing staff.

**Specified Skilled Worker (Tokutei Gino) 1 & 2**
For foreign workers in labor-shortage fields (care, construction, agriculture, etc.). Requires passing a skills evaluation test.

**J-Skip (Special Highly Skilled Professional)**
Introduced in 2023. Immediate Highly Skilled Professional visa available if:
- Annual income of JPY 20,000,000+, OR
- Graduate of a top-300 world-ranked university + annual income of JPY 10,000,000+

**J-Find (Future Creation Talent)**
Introduced in 2023. Graduates of top-100 world-ranked universities can stay in Japan for up to 2 years after graduation to seek employment or start a business.

### Cost Summary

| Item | Cost |
|------|------|
| Certificate of Eligibility (COE) application | Free |
| Visa application fee (Japanese embassy) | Varies by nationality (approx. ¥3,000–¥6,000) |
| Residence Card issuance | Free |

### Pre-Move Checklist

1. **Permanent residency requirements**: Generally 10+ years of residence (shortened for highly skilled); good conduct; financial self-sufficiency
2. **Tax burden**: Japan's income tax + social insurance totals approximately 30% — verify with MoveWorth simulation
3. **Japanese language ability**: Not required for work visas, but significantly impacts daily life and career advancement

Japan offers a high standard of living and safety in Asia, but tax burden, aging population challenges, and language barriers are important factors to consider.`,
      zh: `日本因少子老龄化导致人力短缺，正积极推进接受外籍高技能人才。2023年还推出了「特别高技能人才制度（J-Skip）」和「未来创造人才制度（J-Find）」等新项目。

### 主要就业签证类型

**高度专业人才签证（积分制）**
日本面向高技能外籍人才的优惠签证，综合年收入、学历、工作经验、日语能力等积分评审（需70分以上）。
- 高度专业职业1号甲（学术研究）
- 高度专业职业1号乙（技术·人文知识）
- 高度专业职业1号丙（经营·管理）
- 5年后可申请永久居留权（高度专业职业2号）（70分以上可缩短至3年，80分以上可缩短至1年）

**技术·人文知识·国际业务（技人国）**
日本发放量最多的工作签证，需要大学学历或同等实务经验，常见于IT、外资企业和语言教学等领域。

**经营·管理**
面向在日本经营或管理企业的外国人，需满足设立办公室、雇用员工等要求。

**特定技能1号·2号**
面向从事人力短缺行业（护理、建设、农业等）的外籍劳动者，需通过技能评估考试。

**J-Skip（特别高技能人才制度）**
2023年推出，满足以下任一条件可即时获得高度专业人才签证：
- 年收入2,000万日元以上
- 毕业于世界大学排名前300名的大学 + 年收入1,000万日元以上

**J-Find（未来创造人才制度）**
2023年推出，毕业于世界大学排名前100名的大学生可在毕业后2年内以求职或创业为目的在日本居住最长2年。

### 费用概览

| 项目 | 费用 |
|------|------|
| 在留资格认定证明书（COE）申请费 | 免费 |
| 签证申请费（日本大使馆） | 因国籍和签证种类而异（约¥3,000〜¥6,000） |
| 在留卡发行费 | 免费 |

### 移居前注意事项

1. **永久居留权要求**：原则上需在日居住10年以上（高技能人才可据积分缩短），品行良好，能够自给自足
2. **税负**：日本所得税加社会保险费合计约30%，请通过MoveWorth模拟确认
3. **日语能力**：工作签证不强制要求，但日语能力对日常生活和职业发展影响重大

日本在亚洲拥有较高的生活水准和安全性，但税负、老龄化挑战和语言障碍是移居时需要充分考量的因素。`,
    },
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((p) => p.category === category);
}

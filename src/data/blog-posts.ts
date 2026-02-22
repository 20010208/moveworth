export interface BlogPost {
  slug: string;
  category: "money" | "lifeplan" | "casestudy" | "about" | "visa";
  date: string;
  readingTime: number;
  title: { ja: string; en: string };
  description: { ja: string; en: string };
  content: { ja: string; en: string };
}

export const blogCategories = {
  money: { ja: "移住とお金", en: "Money & Relocation" },
  lifeplan: { ja: "ライフプラン", en: "Life Planning" },
  casestudy: { ja: "国別ケーススタディ", en: "Country Case Studies" },
  about: { ja: "MoveWorthについて", en: "About MoveWorth" },
  visa: { ja: "ビザ・移住条件", en: "Visa & Requirements" },
} as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "overseas-relocation-failure-money",
    category: "money",
    date: "2026-02-20",
    readingTime: 5,
    title: {
      ja: "海外移住の失敗理由1位は『お金の問題』？失敗しないためのシミュレーションの重要性",
      en: "The #1 Reason for Failed Relocations Is Money — Why Simulation Matters",
    },
    description: {
      ja: "なぜ「なんとなく」の移住が危険なのか。事前の資産シミュレーションで防げる失敗パターンを解説します。",
      en: "Why vague relocation plans are risky and how asset simulation can prevent common failure patterns.",
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
    },
    description: {
      ja: "海外移住で実際にかかる初期費用を項目別に解説。シミュレーションの入力値を考える際の参考に。",
      en: "A breakdown of actual initial costs for overseas relocation, useful as reference when inputting simulation values.",
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
    },
    description: {
      ja: "シミュレーションの精度を上げるための、生活コスト見積もりのアドバイス。",
      en: "Practical advice to improve your simulation accuracy with better cost estimates.",
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
    },
    description: {
      ja: "シミュレーション期間の活用法と、結果を基にしたキャリアプランの考え方。",
      en: "How to use simulation timeframes and plan your career based on results.",
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
    },
    description: {
      ja: "FIRE（経済的自立・早期退職）と海外移住の関係性、モンテカルロ分析の活用法を解説。",
      en: "How FIRE and overseas relocation connect, and how Monte Carlo analysis reveals asset risks.",
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
    },
    description: {
      ja: "独身と家族帯同では移住シミュレーションの考慮点が大きく異なります。それぞれのポイントを解説。",
      en: "Simulation considerations differ greatly between single and family relocations. Key points for each.",
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
    },
    description: {
      ja: "日本人に人気のマレーシアとタイ、シミュレーション結果を比較して違いを解説。",
      en: "Comparing simulation results between Malaysia and Thailand, two popular destinations for Japanese expats.",
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
    },
    description: {
      ja: "年収の額面だけでは判断できない、購買力平価（PPP）の考え方と活用法。",
      en: "Why nominal income isn't enough — understanding and using Purchasing Power Parity (PPP).",
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
    },
    description: {
      ja: "MoveWorthが生まれた背景と、資産シミュレーションにこだわる理由を紹介します。",
      en: "The story behind MoveWorth and why we focus on asset simulation for relocation.",
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
    },
    description: {
      ja: "MoveWorthの現在の機能と、今後追加予定の機能をプラン別に紹介します。",
      en: "Current features and planned additions across all MoveWorth plans.",
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
    },
    description: {
      ja: "就労パス（EP）からEntrePassまで、シンガポールの主要ビザの種類・要件・費用を徹底解説。",
      en: "From Employment Pass to EntrePass — a complete breakdown of Singapore's main visa types, requirements, and costs.",
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
    },
    description: {
      ja: "MM2H、DE Rantau、就労ビザまで。マレーシアの主要ビザの種類・要件・費用を徹底解説。",
      en: "From MM2H to DE Rantau and work visas — a complete guide to Malaysia's main visa types, requirements, and costs.",
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
    },
    description: {
      ja: "LTRビザ、タイエリートビザ、就労許可証まで。タイの主要ビザの種類・要件・費用を徹底解説。",
      en: "From LTR Visa to Thai Elite and work permits — a complete breakdown of Thailand's main visa types, requirements, and costs.",
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
    },
    description: {
      ja: "就労ビザ（E系統）からF-2-7ポイント制まで。韓国の主要ビザの種類・要件・費用を徹底解説。",
      en: "From E-series work visas to the F-2-7 points system — a complete guide to South Korea's main visa types, requirements, and costs.",
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
    },
    description: {
      ja: "エンプロイメントゴールドカードから就労許可まで。台湾の主要ビザの種類・要件・費用を徹底解説。",
      en: "From the Employment Gold Card to standard work permits — a complete guide to Taiwan's main visa types and requirements.",
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
    },
    description: {
      ja: "Quality Migrant Admission Schemeから就労ビザまで。香港の主要ビザの種類・要件・費用を徹底解説。",
      en: "From Quality Migrant Admission Scheme to employment visas — a complete guide to Hong Kong's main visa types and requirements.",
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
    },
    description: {
      ja: "就労ビザ（KITAS）からデジタルノマドビザまで。インドネシアの主要ビザの種類・要件・費用を徹底解説。",
      en: "From KITAS work visas to digital nomad visas — a complete guide to Indonesia's main visa types, requirements, and costs.",
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
    },
    description: {
      ja: "SRRV、就労ビザ（9G）から13aまで。フィリピンの主要ビザの種類・要件・費用を徹底解説。",
      en: "From SRRV and 9G work visas to 13a resident visas — a complete guide to the Philippines' main visa types and requirements.",
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
    },
    description: {
      ja: "就労許可証から一時居留証まで。ベトナムの主要ビザの種類・要件・費用を徹底解説。",
      en: "From work permits to temporary residence cards — a complete guide to Vietnam's main visa types, requirements, and costs.",
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
    },
    description: {
      ja: "H-1Bから就労グリーンカードまで。アメリカの主要ビザの種類・要件・費用を徹底解説。",
      en: "From H-1B to employment-based green cards — a complete guide to U.S. visa types, requirements, and costs.",
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
    },
    description: {
      ja: "エクスプレスエントリーからPNPまで。カナダの主要な移民ビザの種類・要件・費用を徹底解説。",
      en: "From Express Entry to PNP — a complete guide to Canada's main immigration visa types, requirements, and costs.",
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
    },
    description: {
      ja: "Skilled Worker Visaからグローバルタレントビザまで。イギリスの主要ビザの種類・要件・費用を徹底解説。",
      en: "From Skilled Worker Visa to Global Talent Visa — a complete guide to the UK's main visa types, requirements, and costs.",
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
    },
    description: {
      ja: "EUブルーカードから就労ビザまで。ドイツの主要ビザの種類・要件・費用を徹底解説。",
      en: "From EU Blue Card to work visas — a complete guide to Germany's main visa types, requirements, and costs.",
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
    },
    description: {
      ja: "タレントパスポートから就労ビザまで。フランスの主要ビザの種類・要件・費用を徹底解説。",
      en: "From Talent Passport to work visas — a complete guide to France's main visa types, requirements, and costs.",
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
    },
    description: {
      ja: "高度技能移住者ビザから30%ルーリングまで。オランダの主要ビザの種類・要件・費用を徹底解説。",
      en: "From Highly Skilled Migrant Visa to the 30% ruling — a complete guide to the Netherlands' main visa types and benefits.",
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
    },
    description: {
      ja: "LビザからBビザまで。スイスの主要ビザ・就労許可の種類・要件・費用を徹底解説。",
      en: "From L permit to B permit — a complete guide to Switzerland's main visa types, requirements, and costs.",
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
    },
    description: {
      ja: "スキルドビザ（482・189・190）からワーキングホリデーまで。オーストラリアの主要ビザの種類・要件・費用を徹底解説。",
      en: "From 482/189/190 skilled visas to working holiday — a complete guide to Australia's main visa types, requirements, and costs.",
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
    },
    description: {
      ja: "認定雇用主就労ビザから熟練移住者ビザまで。ニュージーランドの主要ビザの種類・要件・費用を徹底解説。",
      en: "From Accredited Employer Work Visa to Skilled Migrant Visa — a complete guide to New Zealand's main visa types, requirements, and costs.",
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
    },
    description: {
      ja: "ゴールデンビザから就労ビザまで。UAEの主要ビザの種類・要件・費用を徹底解説。",
      en: "From Golden Visa to employment visas — a complete guide to the UAE's main visa types, requirements, and costs.",
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
    },
    description: {
      ja: "高度専門職ビザから技術・人文知識・国際業務ビザまで。日本の主要就労ビザの種類・要件・費用を徹底解説。",
      en: "From Highly Skilled Professional Visa to Engineer/Specialist in Humanities — a complete guide to Japan's main work visa types for foreign nationals.",
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
    },
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((p) => p.category === category);
}

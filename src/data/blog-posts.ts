export interface BlogPost {
  slug: string;
  category: "money" | "lifeplan" | "casestudy" | "about";
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
- 2026年: 1 MYR ≒ 33円

約30%もの変動があります。MoveWorthではリアルタイム為替レートを自動取得しますが、「もし円安がさらに進んだら」というシナリオも考えておくべきです。

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
- 2026: 1 MYR ≒ ¥33

That's about 30% variation. MoveWorth auto-fetches real-time rates, but consider "what if the yen weakens further" scenarios too.

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

1. **現在の貯蓄額と年収を入力**
2. **移住先の生活費を入力**（家賃・生活費を分けて入力可能）
3. **投資リターン率を設定**（保守的な4〜5%がおすすめ）
4. **シミュレーション期間を「FIRE目標年齢 - 現在年齢」に設定**

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

1. **Input current savings and income**
2. **Input destination living costs** (rent and expenses separately)
3. **Set investment return rate** (conservative 4-5% recommended)
4. **Set period to "FIRE target age minus current age"**

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

#### Freeプラン（無料）
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

#### 高度分析機能（開発中）

- **感度分析**: 各パラメータ（年収、投資リターン、インフレ率、家賃、生活費）が資産にどの程度影響するかを視覚的に表示。トルネードチャートで一目でわかります。

- **FIRE計算機**: 現在の国と移住先で、FIRE（経済的自立・早期退職）を達成できる年齢を比較計算。4%ルールに基づく目標資産額も自動算出します。

- **モンテカルロシミュレーション**: 1,000回の試行で資産推移の確率分布を算出。「最悪のケースでも大丈夫か？」をファンチャートで確認できます。元本割れ確率も表示。

#### AI機能（企画中）

- **AI PDFレポート**: シミュレーション結果をAIが分析し、パーソナライズされたアドバイスを含むPDFレポートを生成。移住の判断材料として活用できます。

#### コミュニティ機能（検討中）

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

#### Free Plan
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

#### Advanced Analytics (In Development)

- **Sensitivity Analysis**: Visualize how each parameter (income, returns, inflation, rent, living costs) impacts assets via tornado charts.

- **FIRE Calculator**: Compare FIRE achievement ages between current and target countries. Auto-calculates target amounts based on the 4% rule.

- **Monte Carlo Simulation**: 1,000-trial probability distributions for asset trajectories. Fan charts show "am I safe even in worst cases?" with principal loss probability.

#### AI Features (Planning)

- **AI PDF Report**: AI-analyzed simulation results with personalized advice in downloadable PDF format.

#### Community Features (Under Consideration)

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
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((p) => p.category === category);
}

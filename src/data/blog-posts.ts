export interface BlogPost {
  slug: string;
  category: "money" | "lifeplan" | "casestudy" | "about" | "visa" | "visa-guide";
  date: string;
  readingTime: number;
  locales?: string[]; // 未指定の場合は全言語に表示
  pinned?: boolean;
  thumbnail?: string;
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
  "visa-guide": { ja: "ビザ詳細ガイド", en: "Detailed Visa Guide", zh: "签证详细指南" },
} as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "nordvpn-overseas-japanese-guide-2026",
    category: "money",
    date: "2026-02-27",
    readingTime: 8,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/NordVPN-pic.webp",
    title: {
      ja: "【PR】海外在住者にNordVPNが必須な理由｜移住者が解説する5つのメリット",
      en: "【PR】Why Expats Need NordVPN | 5 Key Benefits for Overseas Japanese",
      zh: "【PR】海外居住者为何必须使用NordVPN｜移居者解析5大优势",
    },
    description: {
      ja: "海外移住・海外在住者がVPNを使うべき5つの理由と、NordVPNの特徴を詳しく解説。日本コンテンツの視聴から通信セキュリティ・ネットバンキングまで完全カバー。",
      en: "5 reasons overseas Japanese residents need a VPN, with a complete guide to NordVPN features. Covers streaming, security, and online banking.",
      zh: "海外居住日本人需要VPN的5个理由及NordVPN功能详解。涵盖日语内容收看、通信安全和网上银行。",
    },
    content: {
      ja: `【PR】この記事はアフィリエイトリンクを含みます。

海外移住を考えているあなた、または既に海外在住のあなたに一つ質問です。現地のカフェやホテルのWi-Fiを使っているとき、本当に安全だと思いますか？また、日本のNetflixや日本語ニュースが見られなくて不便を感じたことはありませんか？

実は、海外に住む日本人にとってVPN（仮想プライベートネットワーク）は「あると便利」ではなく、**ほぼ必須のツール**になっています。この記事では、海外移住者・海外在住者がVPNを使うべき5つの理由と、特におすすめの**NordVPN**について詳しく解説します。

![カフェでNordVPNを使う様子](/images/nordvpn-cafe.jpg.jpg)

## VPNとは？まず3分で理解しよう

VPN（Virtual Private Network）とは、インターネット通信を暗号化して安全にするツールです。スマホやパソコンにアプリをインストールして接続するだけで、あなたの通信が暗号化されます。また、接続するサーバーの場所を選べるため、マレーシアにいながら「日本のサーバーに接続している」状態を作ることができます。

## 海外移住者にVPNが必要な5つの理由

### 理由1：日本のコンテンツを海外でも楽しめる

NetflixやAmazon Prime Video、TVerなどは、日本限定コンテンツが多数あります。海外からアクセスすると日本向けコンテンツは視聴できませんが、VPNで日本サーバーに接続すれば、**海外にいながら日本のストリーミングをそのまま楽しめます**。マレーシアや他の国に移住しても、日本語コンテンツを楽しみたい人には特に重要です。

### 理由2：公共Wi-Fiでの通信を保護できる

カフェ、空港、ホテルなどの公共Wi-Fiはセキュリティが脆弱なことが多く、パスワードや個人情報が盗まれるリスクがあります。VPNを使うと通信が暗号化されるため、**同じWi-Fiに接続している第三者に通信を盗み見られる心配がなくなります**。海外では無料Wi-Fiを使う場面が多いため、VPNは特に重要です。

### 理由3：ネットバンキングや証券口座を安全に使える

海外から日本の銀行口座にアクセスすると、セキュリティ上の制限で使えなかったり、不審なアクセスと判断されることがあります。VPNで日本のIPアドレスに接続することで、**日本にいるときと同じようにオンラインバンキングや証券取引が可能**になります。資産管理をしながら海外移住を考えている方には特に役立つ機能です。

### 理由4：国によるネット規制を回避できる

マレーシアをはじめ、一部の国ではVoIPサービス（LINE通話・WhatsAppなど）や特定SNSへのアクセスが制限されることがあります。VPNを使うことで、**こうした規制を回避**してインターネットを自由に使えます。移住先によってはVPNなしでは使えないサービスが出てくることもあるため、事前に準備しておくことをおすすめします。

### 理由5：個人情報・プライバシーを守れる

VPNを使うと実際のIPアドレスが隠され、ウェブサイト側からは閲覧者の本当の場所がわかりません。プライバシーを重視する方や、ターゲティング広告を避けたい方にも有効です。

![NordVPN 他社との機能比較](/images/nordvpn-comparison.jpg.png)

## なぜNordVPNがおすすめなのか

数あるVPNサービスの中で、NordVPNが海外在住日本人に特に支持されている理由を解説します。

**世界最大規模のサーバー網**
NordVPNは世界111カ国以上に7,000台以上のサーバーを保有しています。日本のサーバーも多数あり、日本コンテンツへの接続速度が安定しています。

**高速・安定した接続**
独自プロトコル「NordLynx」を採用しており、**速度と安定性のバランスが非常に優れています**。動画視聴やビデオ通話でも接続が途切れにくく快適に使えます。

**強力なセキュリティ機能**
- 256ビット暗号化：軍事レベルの暗号化で通信を保護
- ノーログポリシー：通信履歴を一切記録しない
- Kill Switch機能：VPN接続が切れた瞬間に通信を遮断し個人情報漏洩を防止
- Threat Protection：マルウェアや追跡広告をブロック

**1アカウントで最大10台まで同時使用可能**
スマホ・タブレット・PC・ルーターなど複数のデバイスを同時に保護できます。家族で使う場合にもコスパが良いです。

**30日間返金保証**
試して合わなければ全額返金されるため、**リスクなく試せます**。

## 料金プラン

![NordVPN 料金プラン](/images/nordvpn-pricing.jpg.png)

NordVPNは**2年プランが最もコスパに優れており**、月額3.09ドル〜利用できます（セール価格）。クレジットカード・PayPal・暗号通貨など様々な支払い方法に対応しています。

## まとめ

海外移住・海外在住者にとって、VPNは通信の安全確保・日本コンテンツへのアクセス・プライバシー保護のために欠かせないツールです。数あるVPNの中でもNordVPNは速度・セキュリティ・使いやすさのバランスが優れており、海外在住の日本人に特におすすめできます。30日間の返金保証があるので、まずは試してみてください。

[▶ NordVPNを見てみる（公式サイト）](https://px.a8.net/svt/ejp?a8mat=4AXL4B+23M2LU+3YFI+66OZ6)`,
      en: `【PR】This article contains affiliate links.

If you're living abroad or planning to move overseas, a VPN (Virtual Private Network) is no longer optional — it's essential. Here are 5 key reasons why overseas Japanese residents should use NordVPN.

## 5 Reasons Expats Need a VPN

### 1. Access Japanese Streaming Content

Netflix Japan, Amazon Prime Video Japan, and TVerare geo-restricted outside Japan. With a VPN connected to a Japanese server, you can watch all your favorite Japanese content from anywhere in the world.

### 2. Secure Public Wi-Fi Connections

Public Wi-Fi at cafes, airports, and hotels is often insecure. A VPN encrypts your traffic, protecting your passwords and personal data from potential hackers on the same network.

### 3. Safe Online Banking

Japanese banks may flag overseas logins as suspicious. By connecting through a Japanese VPN server, you can access your accounts just as you would from Japan.

### 4. Bypass Internet Restrictions

Some countries restrict VoIP services and social media. A VPN lets you bypass these restrictions and use the internet freely.

### 5. Protect Your Privacy

A VPN hides your real IP address, keeping your location and browsing activity private.

## Why NordVPN?

- **7,000+ servers in 111+ countries** including Japan
- **NordLynx protocol** for fast, stable connections
- **Military-grade encryption** and no-logs policy
- **Up to 10 devices** simultaneously
- **30-day money-back guarantee**

[▶ Try NordVPN (Official Site)](https://px.a8.net/svt/ejp?a8mat=4AXL4B+23M2LU+3YFI+66OZ6)`,
      zh: `【PR】本文包含联盟营销链接。

对于海外居住的日本人来说，VPN（虚拟私人网络）已经成为必不可少的工具。以下是5个主要原因。

## 海外居住者需要VPN的5个理由

### 1. 在海外也能收看日语内容

Netflix日本版、Amazon Prime Video等平台有大量日本限定内容。通过VPN连接日本服务器，即使在海外也能畅享日语流媒体。

### 2. 保护公共Wi-Fi连接安全

咖啡厅、机场、酒店的公共Wi-Fi安全性较低，存在个人信息泄露风险。VPN对通信进行加密，有效防止窃听。

### 3. 安全使用网上银行

从海外访问日本银行账户可能被视为可疑操作。通过VPN连接日本IP，即可像在日本一样正常使用网银。

### 4. 绕过网络限制

部分国家对LINE通话、WhatsApp等VoIP服务有访问限制。VPN可帮助绕过这些限制。

### 5. 保护个人隐私

VPN隐藏真实IP地址，保护您的位置信息和浏览记录。

## 为什么选择NordVPN？

- 全球111个国家7,000+台服务器，含日本节点
- 独家NordLynx协议，速度快、连接稳定
- 军事级加密，零日志政策
- 最多10台设备同时使用
- 30天退款保证

[▶ 前往NordVPN官网](https://px.a8.net/svt/ejp?a8mat=4AXL4B+23M2LU+3YFI+66OZ6)`,
    },
  },
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

どのプランが合うかわからない場合は、まずFreeプランで実際にシミュレーションしてみてください。使いながら「もっと詳しく分析したい」と感じたタイミングでアップグレードするのがおすすめです。`,

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

Not sure which plan is right for you? Start with the Free plan and upgrade when you're ready. There's no risk — you can simulate your financial future right now.`,

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

不确定哪个套餐适合您？先从免费版开始，感受够了再升级。现在就可以免费模拟您的财务未来。`,
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
    slug: "moveworth-update-march-16-2026",
    category: "about",
    date: "2026-03-16",
    readingTime: 4,
    title: {
      ja: "【アップデート】40カ国対応・留学サポート機能を新規追加しました",
      en: "【Update】40 Countries Supported & New Study Abroad Feature Added",
      zh: "【更新】支持40个国家，全新留学支持功能上线",
    },
    description: {
      ja: "2026年3月、MoveWorthに大型アップデートを実施。移住シミュレーター対応国を40カ国に拡大し、留学生向けのシミュレーター・国別情報ページを新規追加しました。",
      en: "In March 2026, MoveWorth expanded to 40 countries and launched a brand-new study abroad feature including a simulator and country information pages.",
      zh: "2026年3月，MoveWorth进行重大升级：移居模拟器支持国家扩展至40个，并全新推出留学模拟器与各国留学信息页面。",
    },
    content: {
      ja: `2026年3月、MoveWorthにまた大きなアップデートをお届けします。今回は移住シミュレーターの対応国拡大と、まったく新しい「留学サポート」機能の追加という2つの大型アップデートをご紹介します。

### 1. 対応国を40カ国に拡大

前回のアップデート（30カ国）からさらに10カ国を追加し、**合計40カ国**に対応しました。

今回追加された国：
- 🇮🇹 イタリア
- 🇲🇹 マルタ
- 🇿🇦 南アフリカ
- 🇫🇮 フィンランド
- 🇦🇹 オーストリア
- 🇨🇿 チェコ
- 🇨🇳 中国
- 🇮🇳 インド
- 🇲🇽 メキシコ
- 🇦🇷 アルゼンチン

欧州・アフリカ・アジア・中南米と、地域のカバレッジも大きく広がりました。各国の税制・住居費・業種別給与データも同時に追加しています。

### 2. 留学サポート機能を新規追加

MoveWorthにまったく新しい機能「**留学サポート**」が加わりました。これまで移住（長期滞在）に特化していたサービスに、**海外留学**という選択肢が加わります。

**留学シミュレーター**

留学先の国・留学期間・学費を入力するだけで、留学中の生活費・住居費・総費用を自動でシミュレーションできます。

- 対象国：日本を含む主要留学先40カ国
- 学費・住居費・生活費の目安を一覧表示
- 初回は**会員登録不要**でシミュレーション可能
- 2回目以降は無料会員登録でご利用いただけます

**国別留学情報ページ**

各国の留学に関する基本情報をまとめたページを追加しました。

- 学生ビザの種類・要件・費用
- 留学中の就労規定（週の就労上限時間など）
- 留学後の就労ビザへの切り替え方法
- 生活費・住居費の目安

**検索機能の強化**

留学先の国選択では、ひらがな・カタカナ・アルファベット・漢字すべてで検索できます。「にほん」「ニホン」「日本」「Japan」どの入力方法でも正しく絞り込まれます。

---

引き続きMoveWorthをご利用いただき、海外移住・留学の計画にお役立てください。ご意見・ご要望はお問い合わせページからお気軽にお寄せください。`,
      en: `We're excited to share another major update to MoveWorth in March 2026. This update brings two big additions: expanded country support and a brand-new study abroad feature.

### 1. Expanded to 40 Countries

Following our previous update to 30 countries, we've added 10 more — bringing the total to **40 countries** supported.

Newly added countries:
- 🇮🇹 Italy
- 🇲🇹 Malta
- 🇿🇦 South Africa
- 🇫🇮 Finland
- 🇦🇹 Austria
- 🇨🇿 Czech Republic
- 🇨🇳 China
- 🇮🇳 India
- 🇲🇽 Mexico
- 🇦🇷 Argentina

Coverage now spans Europe, Africa, Asia, and Latin America. Tax data, housing costs, and industry salary benchmarks have been added for all new countries.

### 2. New Study Abroad Feature

MoveWorth has launched a brand-new **Study Abroad** section. Alongside our existing long-term relocation simulator, you can now explore **overseas study** as a path.

**Study Abroad Simulator**

Enter your destination country, duration of study, and tuition — and the simulator automatically calculates your estimated living costs, housing costs, and total study expenses.

- Available for 40 major study destinations including Japan
- Displays tuition, housing, and living cost estimates
- **First simulation is free** — no registration required
- 2nd simulation onwards requires a free account

**Country Study Information Pages**

We've added dedicated pages for each country covering:

- Student visa types, requirements, and fees
- Work regulations during study (weekly hour limits, etc.)
- Pathways from student visa to work visa
- Estimated living and housing costs

**Improved Search**

The country search in the study abroad section supports hiragana, katakana, romaji, and kanji — all input methods work correctly.

---

Thank you for using MoveWorth. We'll keep improving the platform to support your overseas plans. Reach out through our contact page with any feedback or suggestions.`,
      zh: `2026年3月，MoveWorth迎来又一次重大更新。本次更新带来两大亮点：支持国家范围进一步扩大，以及全新留学支持功能正式上线。

### 1. 支持国家扩展至40个

在上次更新扩展至30个国家的基础上，我们再次新增10个国家，支持总数达到**40个国家**。

本次新增国家：
- 🇮🇹 意大利
- 🇲🇹 马耳他
- 🇿🇦 南非
- 🇫🇮 芬兰
- 🇦🇹 奥地利
- 🇨🇿 捷克
- 🇨🇳 中国
- 🇮🇳 印度
- 🇲🇽 墨西哥
- 🇦🇷 阿根廷

覆盖范围现已延伸至欧洲、非洲、亚洲和拉丁美洲。所有新增国家均已同步更新税制、住房费用及行业薪资数据。

### 2. 全新留学支持功能上线

MoveWorth全新推出**留学支持**版块。在原有长期移居模拟器的基础上，**海外留学**也成为了一个可探索的选项。

**留学模拟器**

输入目的地国家、留学时长和学费，模拟器即可自动计算留学期间的生活费、住房费及总费用估算。

- 支持含日本在内的39个主要留学目的地
- 展示学费、住房费及生活费参考值
- **首次模拟无需注册**即可使用
- 第二次起需免费注册账号

**各国留学信息页面**

我们为每个国家新增了专属留学信息页面，内容涵盖：

- 学生签证类型、要求及费用
- 留学期间的打工规定（每周工时上限等）
- 学生签证转换为工作签证的途径
- 生活费与住房费参考值

**搜索功能强化**

留学目的地的国家搜索支持平假名、片假名、罗马字及汉字等多种输入方式，无论哪种输入都能准确筛选。

---

感谢您使用MoveWorth。我们将持续改进平台，助力您的海外留学与移居计划。如有任何意见或建议，欢迎通过联系页面告知我们。`,
    },
  },
  {
    slug: "moveworth-march-2026-update-en",
    category: "about",
    date: "2026-03-07",
    readingTime: 4,
    locales: ["en"],
    title: {
      ja: "",
      en: "【Update】Major Update: 30 Countries, Salary Reference, Improved Country Search & More",
    },
    description: {
      ja: "",
      en: "MoveWorth's March 2026 update brings 30+ country support, industry salary & housing cost references, smarter country search with currency lookup, and the official launch of advanced analytics.",
    },
    content: {
      ja: "",
      en: `MoveWorth has received several major updates in March 2026. Here's a full breakdown of what's new.

### 1. Now Supporting 30+ Countries

We've expanded from 20 to **30+ countries**, giving you more destinations to compare when planning your relocation:

**Newly added:**
Portugal, Spain, Georgia, Ireland, Sweden, Norway, Denmark, Brazil, Colombia, Greece

All data is based on **March 2026 figures for foreign professionals** — not local averages — so you get a realistic picture of what expat life actually looks like financially.

### 2. Industry Salary & Housing Cost Reference

The simulator now shows **salary benchmarks by industry** for your destination country. Just select a country and an industry to see the average annual income for expats working there.

**Supported industries:**
Manufacturing, IT & Telecoms, Finance & Insurance, Service Industry, Retail & Wholesale, Construction & Real Estate, Transport & Logistics, Media & Broadcasting, Infrastructure & Energy

We've also added **monthly housing cost estimates** by household type:
- Single
- Couple (2 people)
- Family of 4

These figures help you build a simulation grounded in real-world expat costs from the start.

### 3. Smarter Country Selector

The country dropdown has been fully redesigned:

- **Search by name or currency**: Type "EUR" to find all Eurozone countries, or "SGD" for Singapore — instantly
- **No duplicate selection**: The same country can't be chosen as both origin and destination
- **Alphabetical sorting**: Countries are listed A–Z for quick scanning

### 4. Advanced Analytics Now Live

Three features previously listed as "coming soon" are now officially available:

**Sensitivity Analysis** *(Pro plan+)*
A tornado chart showing which inputs — income, investment return, inflation, rent, or living costs — have the biggest impact on your projected assets. Great for understanding where to focus.

**FIRE Calculator** *(Pro plan+)*
See at what age you could achieve Financial Independence, Retire Early (FIRE) in your current country versus your target destination. Calculated using the 4% rule.

**Monte Carlo Simulation** *(Premium plan)*
Run 1,000 scenarios to see the probability distribution of your asset growth. A fan chart visualizes best-case, median, and worst-case outcomes — so you can plan with confidence.

---

We're continuously improving MoveWorth based on user feedback. If you have suggestions or questions, feel free to reach out through our contact page.`,
    },
  },
  {
    slug: "moveworth-march-2026-update-zh",
    category: "about",
    date: "2026-03-07",
    readingTime: 4,
    locales: ["zh"],
    title: {
      ja: "",
      en: "",
      zh: "【更新】重大升级：支持30个以上国家、薪资参考、货币搜索等新功能正式上线",
    },
    description: {
      ja: "",
      en: "",
      zh: "MoveWorth 2026年3月重大升级，新增30个以上国家支持、行业薪资与住房费用参考、支持货币代码搜索国家、以及高级分析功能正式发布。",
    },
    content: {
      ja: "",
      en: "",
      zh: `2026年3月，MoveWorth迎来多项重大升级。以下是本次更新的完整介绍。

### 1. 现已支持30个以上国家

我们将支持国家数量从20个扩展至**30个以上**，为您提供更多移居目的地选择：

**新增国家：**
葡萄牙、西班牙、格鲁吉亚、爱尔兰、瑞典、挪威、丹麦、巴西、哥伦比亚、希腊

所有数据均基于**2026年3月外籍专业人士**的实际情况，而非当地平均水平，让您对移居后的财务状况有更真实的把握。

### 2. 行业薪资与住房费用参考

模拟器现在可根据目的地国家和所选行业，自动显示**外籍人士的平均年薪参考值**。

**支持的行业：**
制造业、IT・信息通信、金融・保险、服务业、零售・批发、建设・房地产、运输・物流、媒体・传媒、基础设施・能源

同时新增按家庭类型显示的**月均住房费用参考**：
- 单身（1人）
- 两人同住
- 四口之家

这些数据帮助您从一开始就构建更贴近现实的模拟场景。

### 3. 更智能的国家选择器

国家下拉菜单已全面升级：

- **按名称或货币代码搜索**：输入"EUR"即可找到所有欧元区国家，输入"SGD"直接定位新加坡
- **防重复选择**：同一国家不能同时作为出发地和目的地
- **按字母顺序排列**：国家列表从A到Z快速浏览

### 4. 高级分析功能正式上线

三项此前标注为"即将推出"的功能现已正式发布：

**敏感性分析** *(Pro套餐及以上)*
通过龙卷风图展示收入、投资回报率、通胀率、租金、生活费等各参数对未来资产影响的大小排序，帮助您了解重点优化方向。

**FIRE计算器** *(Pro套餐及以上)*
计算您在当前国家与目标移居地实现财务独立、提前退休（FIRE）的年龄，基于4%法则自动计算目标资产额。

**蒙特卡罗模拟** *(Premium套餐)*
通过1,000次情景模拟，计算资产增长的概率分布。扇形图直观呈现最佳、中位和最差情景，让您的规划更有底气。

---

我们将持续根据用户反馈改进MoveWorth。如有任何建议或问题，欢迎通过联系页面告知我们。`,
    },
  },
  {
    slug: "moveworth-march-2026-update",
    category: "about",
    date: "2026-03-07",
    readingTime: 4,
    locales: ["ja"],
    title: {
      ja: "【アップデート】30カ国対応・給与参照・検索改善など大型アップデートを実施しました",
      en: "",
    },
    description: {
      ja: "2026年3月、MoveWorthに複数の大型アップデートを実施しました。対応国の拡大、業種別給与・住居費参照、国選択UIの改善、高度分析機能の正式リリースをご紹介します。",
      en: "In March 2026, MoveWorth received several major updates including 30-country support, salary & housing cost references, improved country selector, and official launch of advanced analytics.",
      zh: "2026年3月，MoveWorth进行了多项重大升级，包括扩展至30个国家、行业薪资与住房费用参考、国家选择界面优化，以及高级分析功能正式上线。",
    },
    content: {
      ja: `2026年3月、MoveWorthに複数の大型アップデートを実施しました。このたびの主な変更点をご紹介します。

### 1. 対応国を30カ国に拡大

これまで20カ国だった対応国を、新たに10カ国追加し**30カ国以上**に拡大しました。

新たに追加された国：
- 🇵🇹 ポルトガル
- 🇪🇸 スペイン
- 🇬🇪 ジョージア
- 🇮🇪 アイルランド
- 🇸🇪 スウェーデン
- 🇳🇴 ノルウェー
- 🇩🇰 デンマーク
- 🇧🇷 ブラジル
- 🇨🇴 コロンビア
- 🇬🇷 ギリシャ

各国のデータは外国人プロフェッショナルの実態に合わせた**2026年3月時点の最新値**を採用しています。

### 2. 業種別給与・住居費の参照機能を追加

シミュレーター入力画面に、国と業種を選ぶだけで**平均年収の目安を自動表示**する機能を追加しました。対象業種は以下の9種類です。

- メーカー（製造業）
- IT・情報通信業
- 金融・保険業
- サービス業
- 流通・小売・卸売業
- 建設・不動産業
- 運輸・物流業
- メディア・マスコミ
- インフラ・インダストリー

また、世帯タイプ（単身・2人暮らし・4人家族）別の**家賃と生活費の目安**も表示されるようになりました。これにより、現地の生活コストを把握しながらシミュレーションを進めることができます。

データはすべて、その国に住む**外国人プロフェッショナルの実績値**を参考に作成しています。

### 3. 国選択UIを大幅改善

これまでスクロールのみだった国選択ドロップダウンを、使いやすく刷新しました。

**主な改善点：**
- **検索機能**: 国名または通貨コード（例：EUR、SGD）で絞り込み可能
- **ひらがな・カタカナ対応**: 「にほん」「ニホン」「日本」すべてで検索できます
- **アルファベット順・あいうえお順ソート**: 言語設定に応じて自動で並び替え
- **重複選択防止**: 同じ国を出発国と移住先の両方に選べないよう制御

### 4. 高度分析機能が正式リリース

以前のロードマップ記事で「開発中」としてご紹介していた高度分析機能が、正式にリリースされました。

**感度分析**（Proプラン以上）
年収・投資リターン・インフレ率・家賃・生活費の各パラメータが、将来の資産にどれほど影響するかをトルネードチャートで視覚化します。

**FIRE計算機**（Proプラン以上）
現在の国と移住先それぞれでFIRE（経済的自立・早期退職）を達成できる年齢を比較。4%ルールに基づく目標資産額も自動算出します。

**モンテカルロシミュレーション**（Premiumプラン）
1,000回の試行で資産推移の確率分布を算出し、最悪のシナリオでも安全かどうかをファンチャートで確認できます。

---

今後もMoveWorthは機能拡充を続けてまいります。ご意見・ご要望はお問い合わせページからお気軽にお寄せください。`,
      en: `In March 2026, MoveWorth received several major updates. Here's a summary of what's new.

### 1. Expanded to 30+ Countries

We've expanded our supported countries from 20 to **30+**, adding 10 new destinations:

- 🇵🇹 Portugal
- 🇪🇸 Spain
- 🇬🇪 Georgia
- 🇮🇪 Ireland
- 🇸🇪 Sweden
- 🇳🇴 Norway
- 🇩🇰 Denmark
- 🇧🇷 Brazil
- 🇨🇴 Colombia
- 🇬🇷 Greece

All data reflects **March 2026 values** based on real-world figures for foreign professionals living in each country.

### 2. Industry Salary & Housing Cost Reference

The simulator now shows **average salary benchmarks** based on the country and industry you select. Supported industries include:

- Manufacturing
- IT & Telecoms
- Finance & Insurance
- Service Industry
- Retail & Wholesale
- Construction & Real Estate
- Transport & Logistics
- Media & Broadcasting
- Infrastructure & Energy

We've also added **rent and living cost estimates** by household type (single, couple, family of 4), so you can build a more realistic simulation from the start.

All data is based on actual figures for **foreign professionals** living in each country.

### 3. Improved Country Selector

The country dropdown has been completely redesigned for ease of use:

- **Search**: Filter by country name or currency code (e.g., EUR, SGD)
- **Hiragana/Katakana support** (Japanese): Search with any script — "にほん", "ニホン", or "日本" all work
- **Alphabetical sorting**: Automatically sorted by language setting
- **Duplicate prevention**: You can't select the same country as both origin and destination

### 4. Advanced Analytics Now Live

Features previously listed as "in development" in our roadmap are now officially released:

**Sensitivity Analysis** (Pro plan+)
A tornado chart showing how each parameter — income, investment return, inflation, rent, living costs — affects your future assets.

**FIRE Calculator** (Pro plan+)
Compare the age at which you can achieve FIRE (Financial Independence, Retire Early) in your current country vs. your destination. Target amounts are auto-calculated using the 4% rule.

**Monte Carlo Simulation** (Premium plan)
Run 1,000 simulations to get a probability distribution of your asset trajectory. A fan chart shows whether you're safe even in the worst-case scenario.

---

We'll continue improving MoveWorth based on your feedback. Feel free to reach out through our contact page with any questions or suggestions.`,
      zh: `2026年3月，MoveWorth进行了多项重大升级。以下是主要更新内容。

### 1. 扩展至30个以上国家

我们将支持国家从20个扩展至**30个以上**，新增了以下10个目的地：

- 🇵🇹 葡萄牙
- 🇪🇸 西班牙
- 🇬🇪 格鲁吉亚
- 🇮🇪 爱尔兰
- 🇸🇪 瑞典
- 🇳🇴 挪威
- 🇩🇰 丹麦
- 🇧🇷 巴西
- 🇨🇴 哥伦比亚
- 🇬🇷 希腊

所有数据均采用**2026年3月的最新数值**，参考了在各国生活的外籍专业人士的实际情况。

### 2. 行业薪资与住房费用参考功能

模拟器现在可根据所选国家和行业，自动显示**平均薪资参考值**。支持的行业包括：

- 制造业
- IT・信息通信
- 金融・保险
- 服务业
- 零售・批发
- 建设・房地产
- 运输・物流
- 媒体・传媒
- 基础设施・能源

同时新增了按家庭类型（单身、两人、四口之家）显示的**租金与生活费参考值**，让您从一开始就能进行更贴近现实的模拟。

### 3. 国家选择界面大幅优化

国家下拉菜单经过全面重新设计：

- **搜索功能**：可按国家名称或货币代码（如EUR、SGD）筛选
- **支持平假名/片假名**（日语界面）：用任意文字均可搜索
- **字母顺序排列**：根据语言设置自动排序
- **防重复选择**：同一国家不能同时作为出发地和目的地

### 4. 高级分析功能正式上线

此前在路线图中标注为"开发中"的高级分析功能现已正式发布：

**敏感性分析**（Pro套餐及以上）
通过龙卷风图直观展示收入、投资回报率、通胀率、租金、生活费等各参数对未来资产的影响程度。

**FIRE计算器**（Pro套餐及以上）
比较在当前国家与目的地实现FIRE（财务独立、提前退休）的年龄。根据4%法则自动计算目标资产额。

**蒙特卡罗模拟**（Premium套餐）
通过1,000次模拟计算资产推移的概率分布，用扇形图直观呈现即便在最坏情况下是否依然安全。

---

我们将持续根据用户反馈改进MoveWorth。如有任何问题或建议，欢迎通过联系页面告知我们。`,
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
    date: "2026-03-25",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-sg.webp",
    title: {
      ja: "シンガポールのビザ・就労許可完全ガイド【2026年最新版】",
      en: "Singapore Visa & Work Permit Complete Guide 2026",
      zh: "新加坡签证与就业准证完全指南【2026年最新版】",
    },
    description: {
      ja: "EP・S Pass・ONE Pass・Tech.Pass・永住権まで。COMPASS義務化・2025年給与基準改定を反映したシンガポール全ビザの種類・要件・費用を徹底解説。",
      en: "From EP to ONE Pass and Tech.Pass — updated for mandatory COMPASS scoring and 2025 salary threshold revisions.",
      zh: "涵盖EP、S准证、ONE Pass及Tech.Pass，全面反映COMPASS强制评分及2025年薪资标准调整。",
    },
    content: {
      ja: `シンガポールはアジアのビジネスハブとして、低税率・優れたインフラ・英語環境から多くの外国人専門家を引き付けています。ただし物価・家賃は東京を上回ることも多く、収入水準に応じたビザ選択が重要です。

### シンガポールの主なビザ一覧

| ビザ種類 | 対象者 | 有効期間 | 最低給与 |
|---|---|---|---|
| Employment Pass（EP） | 専門職・管理職 | 2〜3年 | SGD 5,600/月 |
| S Pass | 中級技術職 | 2〜3年 | SGD 3,300/月 |
| ONE Pass | 超高収入トップ人材 | 5年 | SGD 30,000/月 |
| Tech.Pass | テック起業家・リーダー | 2年 | 条件制 |
| EntrePass | 起業家 | 1年（更新可） | 条件制 |

---

### Employment Pass（EP）

シンガポールで最も一般的な就労ビザです。**2023年9月よりCOMPASSスコアが全申請に義務化**されました。

**給与基準（2025年1月改定）：**
- 一般職：**SGD 5,600/月**以上（2027年1月よりSGD 6,000予定）
- 金融業：**SGD 6,200/月**以上（2027年1月よりSGD 6,600予定）
- 45歳以上：SGD 10,700/月以上が目安

**COMPASSスコア（40点以上が必要）：**
- 給与水準（同職種の中央値との比較）
- 学歴（名門大学ほど高得点）
- 多様性（雇用主の外国人比率が低いほど高得点）
- 地域人材支援（シンガポール人採用実績）

| 項目 | 費用 |
|---|---|
| 申請手数料 | SGD 105 |
| 発給手数料 | SGD 225 |
| 有効期間 | 2年（初回）/ 3年（更新） |

---

### S Pass

中級技術職向けパス。雇用主はS Pass保有者の比率（クォータ）が制限されます。

- 最低月給：**SGD 3,300/月**（年齢により異なる、2025年9月改定）
- 金融業：SGD 3,650/月
- クォータ：全従業員の**15%**まで（製造業は20%）
- 雇用主負担レビー：SGD 650〜900/月

---

### ONE Pass

月給SGD 30,000以上のトップ人材向け特別パス。

- 有効期間：**5年**（更新可）
- **複数雇用主での同時就労が可能**
- 配偶者も別途就労パス不要で就労可
- 申請費：SGD 105 + 発給費 SGD 225

---

### Tech.Pass

テック系起業家・エグゼクティブ向けの特別パス。以下の3条件のうち**2つ以上**を満たす必要があります。

1. 直近の月給 **SGD 20,000以上**
2. 企業価値 **USD 5億以上**のテック企業を5年以上リード
3. **30人以上**のR&Dチームを5年以上リード

- 有効期間：2年（更新時に再評価）
- 起業・役員就任・投資家としての活動がすべて可

---

### EntrePass

シンガポールで革新的なビジネスを立ち上げる起業家向けパス。

- VCからの投資実績 or 政府認定インキュベータへの参加が審査で有利
- 有効期間：1年（実績次第で更新可）
- シンガポール国籍のローカル雇用実績が更新審査に影響

---

### 永住権（PR）

EP/S Passで数年就労後に申請可能です。

- 審査基準：年収・税支払い実績・学歴・家族構成・雇用期間
- 承認率：非公開（推定30〜35%程度）
- 処理期間：6ヶ月〜1年
- 取得後は国民に準じた扱い（HDB住宅購入可など）

---

### 費用まとめ

| ビザ | 申請費 | 発給費 |
|---|---|---|
| EP | SGD 105 | SGD 225 |
| S Pass | SGD 105 | SGD 100 |
| ONE Pass | SGD 105 | SGD 225 |
| Tech.Pass | SGD 105 | SGD 225 |

---

### 移住前のチェックポイント

1. **給与基準の確認**：COMPASSスコア・最低給与は毎年改定されるため、MOMの公式サイトで最新情報を確認
2. **住居費の試算**：シンガポールの外国人エリア（オーチャード・ホランドビレッジ等）の家賃は単身SGD 2,800〜/月と高額
3. **依存パスの条件**：家族を帯同する場合、EP保有者はSGD 6,000/月以上が目安
4. **医療保険**：雇用主が提供するケースが多いが、自己手配が必要な場合もある
5. **MoveWorthでシミュレーション**：高い税率優遇と高い生活費のバランスを数字で確認

シンガポールは法人税・個人所得税ともに日本より低く、資産形成の観点からも注目される移住先です。ただし住居費・教育費が世界トップクラスのため、収入水準を慎重に確認することが重要です。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **Employment Pass（EP）・COMPASS要件**: [MOM – EP 資格要件ページ](https://www.mom.gov.sg/passes-and-permits/employment-pass/eligibility)
- **S Pass**: [MOM – S Pass 資格要件ページ](https://www.mom.gov.sg/passes-and-permits/s-pass/eligibility)
- **ONE Pass**: [MOM – ONE Pass 資格要件ページ](https://www.mom.gov.sg/passes-and-permits/overseas-networks-expertise-pass/eligibility)
- **Tech.Pass**: [EDB – Tech.Pass 公式ページ](https://www.edb.gov.sg/en/incentives-and-programmes/incentives-and-facilitation-programmes/tech-pass.html)
- **EntrePass**: [MOM – EntrePass 資格要件ページ](https://www.mom.gov.sg/passes-and-permits/entrepass/eligibility)
- **永住権（PR）**: [ICA – Permanent Residency](https://www.ica.gov.sg/reside/PR)`,
      en: `Singapore is Asia's premier business hub, known for low taxes, world-class infrastructure, and an English-speaking environment. However, housing costs frequently exceed Tokyo's, making income planning critical.

### Overview of Main Visa Types

| Visa | Target | Validity | Min. Salary |
|---|---|---|---|
| Employment Pass (EP) | Professionals & managers | 2–3 years | SGD 5,600/month |
| S Pass | Mid-level skilled workers | 2–3 years | SGD 3,300/month |
| ONE Pass | Top earners | 5 years | SGD 30,000/month |
| Tech.Pass | Tech entrepreneurs & leaders | 2 years | Criteria-based |
| EntrePass | Entrepreneurs | 1 year (renewable) | Criteria-based |

---

### Employment Pass (EP)

The most common work visa for professionals. **COMPASS scoring became mandatory for all EP applications in September 2023.**

**Salary thresholds (revised January 2025):**
- General: **SGD 5,600/month** (rising to SGD 6,000 from January 2027)
- Financial services: **SGD 6,200/month** (rising to SGD 6,600 from January 2027)
- Age 45 and above: typically SGD 10,700/month+

**COMPASS scoring (40+ points required):**
- Salary benchmark (vs. median for similar roles)
- Qualifications (top-ranked universities score higher)
- Diversity (lower foreign worker ratio at employer = higher score)
- Support for local professionals

| Item | Fee |
|---|---|
| Application fee | SGD 105 |
| Issuance fee | SGD 225 |
| Validity | 2 years (first issuance) / 3 years (renewal) |

---

### S Pass

For mid-level skilled workers. Employers face quota limits on S Pass holders.

- Minimum salary: **SGD 3,300/month** (age-adjusted; revised September 2025)
- Financial services: SGD 3,650/month
- Quota: up to **15%** of workforce (20% for manufacturing)
- Employer levy: SGD 650–900/month per S Pass holder

---

### ONE Pass

For top talent earning SGD 30,000/month or more.

- Validity: **5 years** (renewable)
- **Can work for multiple employers simultaneously**
- Spouse can work in Singapore without a separate work pass
- Application fee: SGD 105 + issuance SGD 225

---

### Tech.Pass

For established tech entrepreneurs and leaders. Must meet **at least 2 of 3** criteria:

1. Last drawn salary **SGD 20,000/month+**
2. Led tech product/service with valuation **USD 500M+** for 5+ years
3. Led R&D team of **30+** in a tech company for 5+ years

- Validity: 2 years (re-evaluated at renewal)
- Can simultaneously run companies, serve as director, and invest

---

### EntrePass

For entrepreneurs starting innovative businesses in Singapore.

- VC investment or acceptance into a government-recognized incubator strengthens the application
- Validity: 1 year (renewable based on business performance)
- Local hiring track record affects renewal outcomes

---

### Permanent Residency (PR)

Eligible after several years on EP/S Pass.

- Assessment: income, taxes paid, education, family ties, employment duration
- Approval rate: undisclosed (estimated ~30–35%)
- Processing time: 6 months to 1 year

---

### Cost Summary

| Visa | Application Fee | Issuance Fee |
|---|---|---|
| EP | SGD 105 | SGD 225 |
| S Pass | SGD 105 | SGD 100 |
| ONE Pass | SGD 105 | SGD 225 |
| Tech.Pass | SGD 105 | SGD 225 |

---

### Pre-Move Checklist

1. **Verify salary and COMPASS thresholds**: Updated regularly — check MOM's official portal
2. **Estimate housing costs**: Expat areas (Orchard, Holland Village) range from SGD 2,800+/month for singles
3. **Dependant's Pass conditions**: To bring family, EP holders typically need SGD 6,000+/month
4. **Health insurance**: Often employer-provided, but verify coverage
5. **Run a MoveWorth simulation**: Balance Singapore's tax advantages against high living costs

Singapore's low corporate and personal tax rates make it attractive for wealth building — but world-class housing and education costs mean careful income planning is essential.

---

### References

This article is based on the following official sources.

- **Employment Pass (EP) & COMPASS**: [MOM – EP Eligibility](https://www.mom.gov.sg/passes-and-permits/employment-pass/eligibility)
- **S Pass**: [MOM – S Pass Eligibility](https://www.mom.gov.sg/passes-and-permits/s-pass/eligibility)
- **ONE Pass**: [MOM – ONE Pass Eligibility](https://www.mom.gov.sg/passes-and-permits/overseas-networks-expertise-pass/eligibility)
- **Tech.Pass**: [EDB – Tech.Pass Official Page](https://www.edb.gov.sg/en/incentives-and-programmes/incentives-and-facilitation-programmes/tech-pass.html)
- **EntrePass**: [MOM – EntrePass Eligibility](https://www.mom.gov.sg/passes-and-permits/entrepass/eligibility)
- **Permanent Residency (PR)**: [ICA – Permanent Residency](https://www.ica.gov.sg/reside/PR)`,
      zh: `新加坡是亚洲首屈一指的商业中心，以低税率、世界级基础设施和英语环境著称。但住房成本往往高于东京，收入规划至关重要。

### 主要签证类型一览

| 签证 | 适用人群 | 有效期 | 最低薪资 |
|---|---|---|---|
| 就业准证（EP） | 专业人士・管理人员 | 2～3年 | SGD 5,600/月 |
| S准证 | 中级技术人员 | 2～3年 | SGD 3,300/月 |
| ONE Pass | 顶尖高收入人才 | 5年 | SGD 30,000/月 |
| Tech.Pass | 科技创业者・领袖 | 2年 | 条件制 |
| EntrePass | 创业者 | 1年（可续签） | 条件制 |

---

### 就业准证（EP）

新加坡最常见的就业签证。**2023年9月起，所有EP申请均须通过COMPASS积分评估。**

**薪资标准（2025年1月修订）：**
- 一般职位：**SGD 5,600/月**以上（2027年1月起升至SGD 6,000）
- 金融行业：**SGD 6,200/月**以上（2027年1月起升至SGD 6,600）
- 45岁以上资深人士：通常需SGD 10,700/月以上

**COMPASS积分要求（需达40分）：**
- 薪资水平（与同岗位中位数比较）
- 学历（知名院校得分更高）
- 多元化（雇主外籍员工比例越低得分越高）
- 支持本地专业人才

| 项目 | 费用 |
|---|---|
| 申请手续费 | SGD 105 |
| 签发手续费 | SGD 225 |
| 有效期 | 2年（首次）/ 3年（续签） |

---

### S准证

面向中级技术人员，雇主须遵守名额限制。

- 最低月薪：**SGD 3,300**（按年龄递增；2025年9月起修订）
- 金融行业：SGD 3,650/月
- 名额限制：员工总数的**15%**（制造业为20%）
- 雇主须缴纳税收：SGD 650～900/月/人

---

### ONE Pass

面向月薪SGD 30,000以上的顶尖人才。

- 有效期：**5年**（可续签）
- **可同时为多家雇主工作**
- 配偶无需单独申请即可在新加坡工作
- 申请费：SGD 105 + 签发费 SGD 225

---

### Tech.Pass

面向科技创业者及高管，须满足以下**3项中的至少2项：**

1. 近期月薪 **SGD 20,000**以上
2. 主导估值**USD 5亿**以上科技企业达5年以上
3. 领导**30人以上**研发团队达5年以上

---

### 永久居留权（PR）

在EP/S准证下工作数年后可申请。

- 评估标准：收入、纳税记录、学历、家庭关系、就业年限
- 审批率：不公开（估计约30～35%）
- 处理时间：6个月至1年

---

### 费用汇总

| 签证 | 申请费 | 签发费 |
|---|---|---|
| EP | SGD 105 | SGD 225 |
| S准证 | SGD 105 | SGD 100 |
| ONE Pass | SGD 105 | SGD 225 |
| Tech.Pass | SGD 105 | SGD 225 |

---

### 移居前核查清单

1. **确认薪资及COMPASS标准**：定期更新，请查阅MOM官方网站
2. **估算住房成本**：外籍人士聚居区（乌节路、荷兰村等）单身月租约SGD 2,800起
3. **家属准证条件**：携家属同行通常需EP持有者月薪达SGD 6,000以上
4. **医疗保险**：通常由雇主提供，但需提前确认覆盖范围
5. **使用MoveWorth模拟**：综合评估新加坡税收优势与高生活成本的平衡

新加坡的企业所得税和个人所得税均低于日本，是财富积累的理想目的地，但住房和教育费用位居全球前列，务必仔细规划收入。

---

### 参考资料

本文信息基于以下官方资料整理。

- **就业准证（EP）及COMPASS评分**: [MOM – EP 资格要求页面](https://www.mom.gov.sg/passes-and-permits/employment-pass/eligibility)
- **S准证**: [MOM – S准证资格要求页面](https://www.mom.gov.sg/passes-and-permits/s-pass/eligibility)
- **ONE Pass**: [MOM – ONE Pass 资格要求页面](https://www.mom.gov.sg/passes-and-permits/overseas-networks-expertise-pass/eligibility)
- **Tech.Pass**: [EDB – Tech.Pass 官方页面](https://www.edb.gov.sg/en/incentives-and-programmes/incentives-and-facilitation-programmes/tech-pass.html)
- **EntrePass**: [MOM – EntrePass 资格要求页面](https://www.mom.gov.sg/passes-and-permits/entrepass/eligibility)
- **永久居留权（PR）**: [ICA – Permanent Residency](https://www.ica.gov.sg/reside/PR)`,
    },
  },
  {
    slug: "visa-my",
    category: "visa",
    date: "2026-03-25",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-my.webp",
    title: {
      ja: "マレーシア ビザ・移住条件完全ガイド【2026年最新版】｜MM2H・DE Rantau・就労ビザ",
      en: "Malaysia Permanent Residency Requirements for Foreigners 2026 | Long-Term Visa Options & MM2H Guide",
      zh: "马来西亚签证与移居条件完全指南【2026年最新版】",
    },
    description: {
      ja: "MM2H・DE Rantau・Employment Pass・PVIPまで。外国人向け長期滞在ビザの種類・要件・費用を2026年最新データで徹底解説。",
      en: "Malaysia permanent residency (PR) requirements for foreigners 2026 — categories, processing time 2–5 years, eligibility. Long term visa options: MM2H, DE Rantau, Employment Pass, PVIP.",
      zh: "涵盖MM2H、DE Rantau、就业准证及PVIP，全面反映2024年改版及2026年6月EP薪资新标准。",
    },
    content: {
      ja: `マレーシアは、物価の安さ・英語の通じやすさ・モダンなインフラから、日本人の移住先トップクラスに位置する国です。クアラルンプール（KL）は都市の利便性を持ちながら、生活費は東京の約半分以下という点が大きな魅力です。外国人向けの長期滞在ビザも複数整備されており、目的や収入水準に合わせて選択できます。

### マレーシアの主なビザ一覧

| ビザ種類 | 対象者 | 有効期間 | 特徴 |
|---|---|---|---|
| MM2H | 高資産者・長期滞在希望者 | 5〜20年 | 不動産購入必須 |
| DE Rantau | デジタルノマド・リモートワーカー | 最大24ヶ月 | 手軽・手頃 |
| Employment Pass | 現地雇用の就労者 | 最大10年（新基準） | 雇用主が申請 |
| PVIP | 超富裕層 | 20年 | 就労・事業可・滞在義務なし |
| REP | 高度人材の長期就労者 | 10年 | EP保有後に申請可 |

---

### MM2H（Malaysia My Second Home）

2024年6月に大幅改定。従来の月収証明が**不要**になった一方、**全ティアで不動産購入が必須**となり、プログラム費も新設されました。

#### Silverティア（5年更新）
- 固定預金：USD 150,000
- 不動産購入：RM 600,000以上（承認後12ヶ月以内にSPA締結）
- プログラム費：RM 40,000
- 申請手数料：RM 5,000（本人）+ RM 2,500（同伴者1名につき）

#### Goldティア（15年更新）
- 固定預金：USD 500,000
- 不動産購入：RM 1,000,000以上
- プログラム費：RM 55,000
- 申請手数料：RM 5,000（本人）+ RM 2,500（同伴者1名につき）

#### Platinumティア（20年更新）
- 固定預金：USD 1,000,000
- 不動産購入：RM 2,000,000以上
- プログラム費：RM 70,000
- 申請手数料：RM 5,000（本人）+ RM 2,500（同伴者1名につき）

**共通事項：**
- 最低滞在義務：90日/年（25〜49歳）
- 固定預金の最大50%は不動産・医療・教育目的で引き出し可能
- 処理期間の目安：3〜5ヶ月（書類準備含む）

---

### DE Rantau パス

デジタルノマド・リモートワーカー向けに2023年導入。2024年6月には対象職種が大幅に拡大されました。

| 項目 | 内容 |
|---|---|
| 最低年収（IT・デジタル系） | USD 24,000（月約USD 2,000） |
| 最低年収（非IT・管理職・専門職） | USD 60,000（月USD 5,000） |
| 有効期間 | 12ヶ月（1回更新可、最大24ヶ月） |
| 申請手数料 | RM 1,000（本人）/ RM 500（同伴者1名） |
| 処理期間 | 6〜8週間 |

**対象職種（2024年6月拡大後）**：エンジニア・デザイナー・マーケター・会計士・弁護士・ライター・起業家（CEO含む）など、海外クライアント・雇用主のためにリモートで働く専門職全般

---

### Employment Pass（雇用パス）

マレーシア企業に雇用される外国人向けの就労ビザ。**2026年6月1日より給与基準が大幅に引き上げられます。**

#### 現行基準（〜2026年5月31日）

| カテゴリ | 月給 | 有効期間 |
|---|---|---|
| Category I | RM 10,000以上 | 最長5年 |
| Category II | RM 5,000〜9,999 | 最長2年 |
| Category III | RM 3,000〜4,999 | 最長12ヶ月 |

#### ⚠️ 新基準（2026年6月1日〜）

| カテゴリ | 月給 | 有効期間 |
|---|---|---|
| Category I | RM 20,000以上 | 最長10年 |
| Category II | RM 10,000〜19,999 | 最長10年（後継者計画必須） |
| Category III | RM 5,000〜9,999 | 最長5年（後継者計画必須） |

給与基準が約2倍に引き上げられます。現地就職を検討している方は新基準を前提に収入計画を立てることが重要です。

---

### PVIP（Malaysia Premium Visa Programme）

MM2Hとは別枠の超富裕層向け長期滞在ビザ。「マレーシア版ゴールデンビザ」とも呼ばれ、就労・事業・就学がすべて可能です。

| 項目 | 内容 |
|---|---|
| 固定預金 | RM 1,000,000（マレーシア認定銀行） |
| 最低月収証明 | RM 40,000/月以上の海外収入 |
| プログラム費 | RM 200,000（本人）/ RM 100,000（同伴者1名につき） |
| 有効期間 | 20年（更新可） |
| 最低滞在義務 | **なし** |
| 就労・事業・就学 | すべて可 |

MM2Hとの最大の違いは、滞在義務がなく就労・事業が自由にできる点です。長期的にマレーシアを拠点にしながらビジネスを行いたい高資産者に向いています。

---

### REP（Residence Pass - Talent）

マレーシアで一定期間就労した高度人材向けの10年間長期ビザです。

**申請要件：**
- EPホルダーとして**3年以上**連続勤務（申請時点）
- 就労経験合計**5年以上**
- 基本給（手当除く）**RM 15,000/月以上**
- マレーシアでの納税実績（直近2年以上）
- 認定大学の学位または専門資格

取得後は雇用主変更が自由にできるため、キャリアの自由度が大幅に上がります。

---

### 永住権（PR）

マレーシアのPR取得は全体的にハードルが高く、実際の処理期間は**2〜5年**が一般的です。

**主な申請カテゴリ：**
- **高資産家**：USD 2,000,000以上を5年間マレーシア国内に預託
- **高度人材・専門職**：高度スキルの専門職として認定
- **マレーシア市民の配偶者**：2025年1月より待機期間が**5年→3年**に短縮
- **ポイント制**：就労年数・学歴・年齢等を総合評価

バハサ・マレーシア語試験（筆記・口述）の合格が原則必要です。

---

### 費用まとめ

| ビザ | 主な費用 |
|---|---|
| MM2H Silver | プログラム費RM 40,000 + 申請料RM 5,000 + 固定預金USD 150,000 + 不動産RM 600,000〜 |
| MM2H Gold | プログラム費RM 55,000 + 申請料RM 5,000 + 固定預金USD 500,000 + 不動産RM 1,000,000〜 |
| MM2H Platinum | プログラム費RM 70,000 + 申請料RM 5,000 + 固定預金USD 1,000,000 + 不動産RM 2,000,000〜 |
| DE Rantau | RM 1,000（本人） |
| Employment Pass | RM 500〜2,000（雇用主負担が多い） |
| PVIP | プログラム費RM 200,000 + 固定預金RM 1,000,000 |

---

### 移住前のチェックポイント

1. **MM2Hの最新要件確認**：2024年以降も改定が続いているため、MOTAC公式サイトで最新情報を確認
2. **EPの2026年6月改定に注意**：新基準（最低RM 5,000〜20,000）への対応を事前に確認
3. **住居費の試算**：クアラルンプールの外国人エリア（モントキアラ・バンサー等）の家賃はRM 3,000〜6,500/月（単身〜家族）
4. **医療保険の加入**：外国人向け民間保険が必要なケースが多い
5. **MoveWorthでシミュレーション**：ビザ費用・生活費・税金を含めた資産推移を無料で確認できます

マレーシアは東南アジアの中でも長期滞在ビザの選択肢が豊富で、目的や資産水準に応じた最適なビザが見つかりやすい国です。制度変更が多いため、常に最新情報の確認が重要です。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **MM2H 要件・申請ガイドライン**: [MM2H 公式ポータル（MOTAC）](https://www.mm2h.gov.my/apply/guidelines)
- **DE Rantau パス**: [DE Rantau 公式ページ（MDEC）](https://www.mdec.my/derantau)
- **Employment Pass（雇用パス）**: [Expatriate Services Division（ESD）](https://esd.imi.gov.my/portal/expatriates/myxpats/key-services/employment-pass/)
- **PVIP 詳細（PDF）**: [Malaysia Premium Visa Programme FAQ（移民局）](https://imigresen-online.imi.gov.my/eservices/doc/FAQ_PVIP.pdf)
- **REP（Residence Pass-Talent）**: [TalentCorp Malaysia – 資格要件](https://rpt.talentcorp.com.my/eligibility/)
- **移民局全般**: [Jabatan Imigresen Malaysia](https://www.imi.gov.my/)`,
      en: `Malaysia consistently ranks among the top relocation destinations for Japanese expats, offering affordable living costs, good English proficiency, modern infrastructure, and multiple long-stay visa options. Kuala Lumpur (KL) combines urban convenience with living costs roughly half of Tokyo's.

### Overview of Main Visa Types

| Visa | Target | Validity | Key Feature |
|---|---|---|---|
| MM2H | High-net-worth individuals | 5–20 years | Property purchase required |
| DE Rantau | Digital nomads & remote workers | Up to 24 months | Accessible & affordable |
| Employment Pass | Foreign employees of Malaysian companies | Up to 10 years (new rules) | Employer-sponsored |
| PVIP | Ultra-high-net-worth individuals | 20 years | Work & business permitted, no minimum stay |
| REP | Long-term skilled professionals | 10 years | Available after 3+ years on EP |

---

### MM2H (Malaysia My Second Home)

Significantly revised in June 2024. Monthly income proof has been removed, but **property purchase is now mandatory for all tiers**, and new program fees have been introduced.

#### Silver (5-year renewable)
- Fixed deposit: USD 150,000
- Property purchase: RM 600,000+ (SPA must be signed within 12 months of approval)
- Program fee: RM 40,000
- Application fee: RM 5,000 (primary) + RM 2,500 per dependent

#### Gold (15-year renewable)
- Fixed deposit: USD 500,000
- Property purchase: RM 1,000,000+
- Program fee: RM 55,000
- Application fee: RM 5,000 (primary) + RM 2,500 per dependent

#### Platinum (20-year renewable)
- Fixed deposit: USD 1,000,000
- Property purchase: RM 2,000,000+
- Program fee: RM 70,000
- Application fee: RM 5,000 (primary) + RM 2,500 per dependent

**Common terms:**
- Minimum stay: 90 days/year (for applicants aged 25–49)
- Up to 50% of the fixed deposit can be withdrawn for property, medical, or education purposes
- Processing time: approximately 3–5 months

---

### DE Rantau Pass

Launched in 2023 for digital nomads and remote workers. Eligibility was significantly expanded in June 2024.

| Item | Details |
|---|---|
| Minimum annual income (tech/digital) | USD 24,000 (approx. USD 2,000/month) |
| Minimum annual income (non-tech/professional) | USD 60,000 (USD 5,000/month) |
| Validity | 12 months (renewable once, max 24 months) |
| Application fee | RM 1,000 (primary applicant) / RM 500 (dependent) |
| Processing time | 6–8 weeks |

**Eligible professions (expanded June 2024):** Engineers, designers, marketers, accountants, lawyers, writers, entrepreneurs (including CEOs), and other professionals working remotely for overseas clients or employers.

---

### Employment Pass (EP)

For foreigners employed by Malaysian companies. **Major salary threshold changes take effect June 1, 2026.**

#### Current thresholds (until May 31, 2026)

| Category | Monthly Salary | Max Validity |
|---|---|---|
| Category I | RM 10,000+ | 5 years |
| Category II | RM 5,000–9,999 | 2 years |
| Category III | RM 3,000–4,999 | 12 months |

#### ⚠️ New thresholds (from June 1, 2026)

| Category | Monthly Salary | Max Validity |
|---|---|---|
| Category I | RM 20,000+ | 10 years |
| Category II | RM 10,000–19,999 | 10 years (succession plan required) |
| Category III | RM 5,000–9,999 | 5 years (succession plan required) |

Salary requirements roughly double under the new rules. Those planning to work in Malaysia should factor this into their income planning.

---

### PVIP (Malaysia Premium Visa Programme)

A separate long-stay program for ultra-high-net-worth individuals, often called Malaysia's "Golden Visa." Work, business, and study are all permitted.

| Item | Details |
|---|---|
| Fixed deposit | RM 1,000,000 (Malaysian licensed bank) |
| Monthly income proof | RM 40,000/month from overseas sources |
| Program fee | RM 200,000 (primary) / RM 100,000 per dependent |
| Validity | 20 years (renewable) |
| Minimum stay | None |
| Work / business / study | All permitted |

Unlike MM2H, PVIP has no minimum stay requirement and allows full work and business rights — ideal for high-net-worth individuals who want Malaysia as a base while running international businesses.

---

### REP (Residence Pass - Talent)

A 10-year long-stay visa for highly skilled professionals with a track record in Malaysia.

**Requirements:**
- Continuous Employment Pass (EP) holder for **3+ years**
- Total work experience of **5+ years**
- Basic salary (excluding allowances): **RM 15,000/month+**
- Malaysian tax filing record for the past **2+ years**
- Recognized university degree or professional qualification

After obtaining REP, you can change employers freely without reapplying for a new EP.

---

### Permanent Residency (PR)

Malaysian PR is generally challenging, with real-world processing times of **2–5 years**.

**Main application categories:**
- **High-net-worth**: Deposit USD 2,000,000+ for 5 years in Malaysia
- **Skilled professionals**: Recognition as a highly skilled professional
- **Spouse of Malaysian citizen**: Waiting period reduced from **5 → 3 years** (January 2025)
- **Points-based**: Evaluated on work history, education, age, etc.

A Bahasa Malaysia language test is generally required.

---

### Cost Summary

| Visa | Main Costs |
|---|---|
| MM2H Silver | Program fee RM 40,000 + application fee RM 5,000 + fixed deposit USD 150,000 + property RM 600,000+ |
| MM2H Gold | Program fee RM 55,000 + application fee RM 5,000 + fixed deposit USD 500,000 + property RM 1,000,000+ |
| MM2H Platinum | Program fee RM 70,000 + application fee RM 5,000 + fixed deposit USD 1,000,000 + property RM 2,000,000+ |
| DE Rantau | RM 1,000 (primary applicant) |
| Employment Pass | RM 500–2,000 (often employer-sponsored) |
| PVIP | Program fee RM 200,000 + fixed deposit RM 1,000,000 |

---

### Pre-Move Checklist

1. **Verify current MM2H requirements**: Requirements have continued to evolve since 2024 — check official MOTAC sources
2. **Note the June 2026 EP salary changes**: New thresholds significantly raise the bar for local employment
3. **Estimate housing costs**: KL expat areas (Mont Kiara, Bangsar) range from RM 3,000–6,500/month
4. **Arrange health insurance**: Private insurance is typically required for foreigners
5. **Run a MoveWorth simulation**: Check projected asset growth factoring in visa costs, living expenses, and taxes

Malaysia offers one of Southeast Asia's most diverse ranges of long-stay visa options. Frequent policy updates mean it's essential to verify current requirements before applying.

---

### References

This article is based on the following official sources.

- **MM2H Requirements & Guidelines**: [MM2H Official Portal (MOTAC)](https://www.mm2h.gov.my/apply/guidelines)
- **DE Rantau Pass**: [DE Rantau Official Page (MDEC)](https://www.mdec.my/derantau)
- **Employment Pass**: [Expatriate Services Division (ESD)](https://esd.imi.gov.my/portal/expatriates/myxpats/key-services/employment-pass/)
- **PVIP Details (PDF)**: [Malaysia Premium Visa Programme FAQ (IMI)](https://imigresen-online.imi.gov.my/eservices/doc/FAQ_PVIP.pdf)
- **REP (Residence Pass-Talent)**: [TalentCorp Malaysia – Eligibility](https://rpt.talentcorp.com.my/eligibility/)
- **General Immigration**: [Jabatan Imigresen Malaysia](https://www.imi.gov.my/)`,
      zh: `马来西亚以生活费低廉、英语普及、基础设施现代化等优势，一直是日本人移居首选目的地之一。吉隆坡（KL）城市配套完善，生活费用约为东京的一半。

### 主要签证类型一览

| 签证 | 适用人群 | 有效期 | 特点 |
|---|---|---|---|
| MM2H | 高净值人士 | 5～20年 | 必须购置房产 |
| DE Rantau | 数字游民・远程工作者 | 最长24个月 | 门槛相对较低 |
| 就业准证（EP） | 受雇于本地企业的外籍人士 | 最长10年（新规） | 雇主申请 |
| PVIP | 超高净值人士 | 20年 | 可就业・经营，无居住要求 |
| REP | 高技能长期就业人才 | 10年 | EP持有3年后可申请 |

---

### MM2H（马来西亚第二家园计划）

2024年6月大幅改版。原月收入证明要求已取消，但**所有级别均须购置房产**，并新增项目费用。

#### Silver（5年）
- 定期存款：USD 150,000
- 购置房产：RM 600,000以上（批准后12个月内须签买卖合同）
- 项目费：RM 40,000
- 申请手续费：RM 5,000（本人）+ RM 2,500（每位随行家属）

#### Gold（15年）
- 定期存款：USD 500,000
- 购置房产：RM 1,000,000以上
- 项目费：RM 55,000
- 申请手续费：RM 5,000（本人）+ RM 2,500（每位随行家属）

#### Platinum（20年）
- 定期存款：USD 1,000,000
- 购置房产：RM 2,000,000以上
- 项目费：RM 70,000
- 申请手续费：RM 5,000（本人）+ RM 2,500（每位随行家属）

**通用条款：**
- 最低居住要求：90天/年（25～49岁适用）
- 定期存款最多可提取50%用于购房、医疗或教育
- 预计处理时间：3～5个月

---

### DE Rantau准证

2023年推出，面向数字游民和远程工作者。2024年6月大幅扩大了适用职业范围。

| 项目 | 内容 |
|---|---|
| 最低年收入（IT・数字类） | USD 24,000（约USD 2,000/月） |
| 最低年收入（非IT・管理・专业职） | USD 60,000（USD 5,000/月） |
| 有效期 | 12个月（可续签一次，最长24个月） |
| 申请费 | RM 1,000（本人）/ RM 500（随行家属） |
| 处理时间 | 6～8周 |

**适用职业（2024年6月扩充后）：** 工程师、设计师、营销人员、会计师、律师、写作者、创业者（含CEO）等受境外雇主雇用的专业人士。

---

### 就业准证（EP）

面向受雇于马来西亚企业的外籍人士。**2026年6月1日起，薪资门槛将大幅提高。**

#### 现行标准（截至2026年5月31日）

| 类别 | 月薪要求 | 最长有效期 |
|---|---|---|
| Category I | RM 10,000以上 | 5年 |
| Category II | RM 5,000～9,999 | 2年 |
| Category III | RM 3,000～4,999 | 12个月 |

#### ⚠️ 新标准（2026年6月1日起）

| 类别 | 月薪要求 | 最长有效期 |
|---|---|---|
| Category I | RM 20,000以上 | 10年 |
| Category II | RM 10,000～19,999 | 10年（须提交接班人计划） |
| Category III | RM 5,000～9,999 | 5年（须提交接班人计划） |

薪资要求约提高一倍。有意在马来西亚就业者应尽早确认新标准的影响并提前规划。

---

### PVIP（马来西亚高端签证计划）

面向超高净值人士的长期居留计划，又称马来西亚"黄金签证"。可自由就业、经营及就学。

| 项目 | 内容 |
|---|---|
| 定期存款 | RM 1,000,000（马来西亚认可银行） |
| 月收入证明 | 境外收入RM 40,000/月以上 |
| 项目费 | RM 200,000（本人）/ RM 100,000（每位随行家属） |
| 有效期 | 20年（可续签） |
| 最低居住要求 | 无 |
| 就业・经营・就学 | 均可 |

与MM2H不同，PVIP无最低居住要求，且允许自由就业和经营，适合以马来西亚为据点开展国际业务的高净值人士。

---

### REP（居留准证—人才）

针对在马来西亚长期就业的高技能专业人士的10年居留签证。

**申请条件：**
- 持有EP连续就业**3年以上**
- 累计工作经验**5年以上**
- 基本工资（不含津贴）**RM 15,000/月以上**
- 马来西亚纳税记录（近2年以上）
- 认可大学学位或专业资格

取得后可自由更换雇主，无需重新申请EP。

---

### 永久居留权（PR）

马来西亚PR申请门槛较高，实际处理时间通常为**2～5年**。

**主要申请类别：**
- **高净值人士**：在马来西亚存入USD 2,000,000以上并保持5年
- **高技能专业人士**：获认定为高技能专业人士
- **马来西亚公民配偶**：2025年1月起等待期由**5年缩短为3年**
- **积分制**：综合评估就业年限、学历、年龄等

原则上须通过马来西亚语（国语）考试。

---

### 费用汇总

| 签证 | 主要费用 |
|---|---|
| MM2H Silver | 项目费RM 40,000 + 手续费RM 5,000 + 定存USD 150,000 + 房产RM 600,000以上 |
| MM2H Gold | 项目费RM 55,000 + 手续费RM 5,000 + 定存USD 500,000 + 房产RM 1,000,000以上 |
| MM2H Platinum | 项目费RM 70,000 + 手续费RM 5,000 + 定存USD 1,000,000 + 房产RM 2,000,000以上 |
| DE Rantau | RM 1,000（本人） |
| 就业准证 | RM 500～2,000（多由雇主负担） |
| PVIP | 项目费RM 200,000 + 定存RM 1,000,000 |

---

### 移居前核查清单

1. **确认MM2H最新要求**：2024年后政策持续调整，请核查MOTAC官方最新信息
2. **注意EP 2026年6月新标准**：薪资门槛大幅提高，有意就业者须提前规划
3. **估算住房成本**：吉隆坡外籍人士聚居区（蒙特基拉、孟沙等）租金约RM 3,000～6,500/月
4. **购置医疗保险**：外籍人士通常须自行购买私人保险
5. **使用MoveWorth进行模拟**：综合考量签证费、生活费和税务的资产变化趋势

马来西亚是东南亚长居签证选项最为丰富的国家之一，但政策更新频繁，申请前务必核实最新规定。

---

### 参考资料

本文信息基于以下官方资料整理。

- **MM2H 要求与申请指南**: [MM2H 官方门户（MOTAC）](https://www.mm2h.gov.my/apply/guidelines)
- **DE Rantau 准证**: [DE Rantau 官方页面（MDEC）](https://www.mdec.my/derantau)
- **就业准证（EP）**: [Expatriate Services Division（ESD）](https://esd.imi.gov.my/portal/expatriates/myxpats/key-services/employment-pass/)
- **PVIP 详情（PDF）**: [Malaysia Premium Visa Programme FAQ（移民局）](https://imigresen-online.imi.gov.my/eservices/doc/FAQ_PVIP.pdf)
- **REP（居留准证-人才）**: [TalentCorp Malaysia – 资格要求](https://rpt.talentcorp.com.my/eligibility/)
- **移民局总览**: [Jabatan Imigresen Malaysia](https://www.imi.gov.my/)`,
    },
  },
  {
    slug: "visa-th",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-th.webp",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】タイのビザ・就労許可完全ガイド｜LTR・Thailand Privilege・2024年税制改正",
      en: "Thailand Visa & Work Permit Complete Guide 2026 | LTR, Thailand Privilege & 2024 Tax Reform",
      zh: "【2026年最新版】泰国签证与工作许可完全指南｜LTR签证·Thailand Privilege·2024年税制改革",
    },
    description: {
      ja: "LTRビザ・Thailand Privilege Card（旧Thai Elite）・就労許可証・2024年税制改正まで。タイの主要ビザの種類・要件・費用を徹底解説。",
      en: "LTR Visa, Thailand Privilege Card, work permits, and the critical 2024 tax reform — a complete breakdown of Thailand's main visa types, requirements, and costs.",
      zh: "LTR签证、Thailand Privilege Card、工作许可证及2024年重要税制改革——全面解析泰国主要签证种类、要求与费用。",
    },
    content: {
      ja: `タイは温暖な気候・豊かな食文化・比較的低い生活コストから、日本人の移住先として人気上位の国です。バンコク・チェンマイを拠点に多くの外国人が生活しており、近年はデジタルノマド向けの新ビザ制度も整備されています。

### あなたに合ったビザは？

| あなたの状況 | おすすめのビザ |
|------------|-------------|
| 資産1,000万USD以上 / 高収入リタイア | LTRビザ（Wealthy Global Citizen / Wealthy Pensioner） |
| 海外企業でリモート勤務・年収USD 80,000以上 | LTRビザ（Work-from-Thailand Professional） |
| 富裕層向けVIPサービスを希望 | Thailand Privilege Card |
| タイ企業に就労 | Non-B ビザ + 就労許可証 |
| 50歳以上でリタイア目的 | Non-OA（リタイアメントビザ） |
| デジタルノマド（海外収入） | LTR（Work-from-Thailand）が現実的な選択肢 |

### 主なビザの種類

**LTR（Long-Term Resident）ビザ**
2022年に導入された富裕層・リタイア者・高度人材向けの10年間有効ビザ。4カテゴリがあります。
- **Wealthy Global Citizen**：純資産USD 1,000,000以上 + タイ国内投資USD 500,000以上（または年収USD 80,000以上 + 投資）
- **Wealthy Pensioner**：年金等収入USD 80,000/年以上（50歳以上）、またはUSD 40,000/年以上 + タイ国内資産USD 250,000以上
- **Work-from-Thailand Professional**：海外企業からの収入USD 80,000/年以上（2年以上の就労経験が必要）
- **Highly-Skilled Professional**：タイ政府指定のターゲット産業（S-カーブ産業等）で就労する高スキル人材
- 申請費用：THB 50,000（10年）
- 全カテゴリで医療保険USD 40,000以上の加入が必須

**Thailand Privilege Card（旧Thai Elite）**
富裕層向けの優遇会員制ビザ。2023年にリニューアルされ、現在の最新プランは以下のとおりです。
- **Privilege Entry（5年）**：THB 900,000
- **Privilege Superiority（10年）**：THB 1,500,000
- **Privilege Excellence（15年）**：THB 2,500,000
- **Elite Ultimate Privilege（20年）**：THB 5,000,000
- 空港VIPレーン・専用車送迎・ゴルフ・スパ施設等の特典付き

**ノンイミグラント（Non-B）ビザ + 就労許可証**
タイで働く外国人が最も多く取得するルート。雇用主のサポートが必要。
- **4:1ルール**：外国人労働者1名につきタイ人従業員4名の雇用が義務
- ビザ費用：THB 2,000（シングル）/ THB 5,000（マルチ）
- 就労許可証費用：THB 3,000〜5,000（職種・期間による）

**リタイアメントビザ（Non-OA）**
50歳以上対象。以下のいずれかが必要。
- タイの銀行口座にTHB 800,000以上の預金残高
- 月収入THB 65,000以上の証明（年金証明書等）
- 医療保険加入義務：外来OPD THB 40,000以上 / 入院IPD THB 440,000以上

### ⚠️ 2024年税制改正（重要）

2024年1月1日より、タイの税制が大きく変わりました。

**改正前**：前年以前に稼得した海外所得をタイ国内に送金する場合は非課税とする解釈が一般的だった
**改正後**：**海外で稼いだ所得をタイ国内に送金した場合、その送金が同じ暦年内であれば課税対象**

- タイ滞在が年間180日以上 → 税務上の居住者と認定
- 居住者が海外所得をタイへ送金した場合、申告・納税義務が発生
- 税率：5〜35%（累進課税）
- LTRビザ保持者には一部例外措置あり（海外源泉所得への課税免除特典）
- 日本-タイ間には租税条約あり（一部の二重課税を回避可能）

### 費用の目安

| 項目 | 費用 |
|------|------|
| LTRビザ（10年） | THB 50,000 |
| Thailand Privilege Entry（5年） | THB 900,000 |
| Thailand Privilege Superiority（10年） | THB 1,500,000 |
| 就労許可証 | THB 3,000〜5,000 |
| Non-OA ビザ（1年） | THB 2,000 |

### 移住前のチェックポイント

1. **就労許可証の職種制限**：タイでは外国人が従事できない職種が法律で規定されている（タイ人優先職種39種類）
2. **4:1ルール**：外国人1名の雇用にタイ人4名が必要。フリーランス・個人事業主としての就労は原則不可
3. **90日報告義務**：Non-B・Non-OA等は四半期ごとに入国管理局への住所報告が義務
4. **2024年税制変更**：タイに長期滞在しながら日本の口座から生活費を送金する場合、課税対象になる可能性があります。移住前に税理士への相談を強く推奨します
5. **銀行口座開設**：就労許可証または長期ビザがないと口座開設が難しいケースがある
6. **デジタルノマド**：専用ビザはなく、LTRのWork-from-Thailand Professionalが最も現実的な選択肢

タイは東南アジアの中でも日本人コミュニティが充実しており、バンコクはもちろんチェンマイや離島など多様な生活スタイルが選べる移住先です。
---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **LTR ビザ（長期滞在ビザ）**: [BOI 公式 LTR ポータル](https://ltr.boi.go.th/)
- **Thailand Privilege Card**: [タイ観光スポーツ省公認公式サイト](https://www.thailandprivilege.co.th/home)
- **就労許可（Work Permit）**: [タイ労働省 e-Work Permit システム](https://ewp.doe.go.th/)
- **電子ビザ申請**: [Thailand e-Visa 公式ポータル](https://thaievisa.go.th/)`,
      en: `Thailand is consistently ranked among the top destinations for Japanese expatriates, offering a warm climate, vibrant food culture, and relatively low living costs. Bangkok and Chiang Mai host large expat communities, and new visa options for digital nomads and high-skilled workers have been introduced in recent years.

### Main Visa Types

**LTR (Long-Term Resident) Visa**
Launched in 2022, this 10-year visa targets wealthy individuals, retirees, and skilled professionals across 4 categories.
- **Wealthy Global Citizen**: Net worth USD 1,000,000+ AND investment in Thailand USD 500,000+ (or annual income USD 80,000+ with investment)
- **Wealthy Pensioner**: Pension/passive income USD 80,000/year (50+), or USD 40,000/year + Thai assets USD 250,000+
- **Work-from-Thailand Professional**: Overseas income USD 80,000/year (minimum 2 years' work experience required)
- **Highly-Skilled Professional**: Works in Thailand's targeted S-Curve industries
- Application fee: THB 50,000 (10-year validity)
- All categories require minimum USD 40,000 health insurance

**Thailand Privilege Card (formerly Thai Elite)**
Premium membership visa for affluent individuals. Revamped in 2023 with new tiers:
- **Privilege Entry (5 years)**: THB 900,000
- **Privilege Superiority (10 years)**: THB 1,500,000
- **Privilege Excellence (15 years)**: THB 2,500,000
- **Elite Ultimate Privilege (20 years)**: THB 5,000,000
- Benefits include VIP airport lane, dedicated car service, golf, and spa privileges

**Non-Immigrant B Visa + Work Permit**
The most common route for working foreigners. Requires employer sponsorship.
- **4:1 Rule**: Employers must hire 4 Thai nationals for every 1 foreign employee
- Visa fee: THB 2,000 (single entry) / THB 5,000 (multiple entry)
- Work permit fee: THB 3,000–5,000 (varies by occupation and duration)

**Retirement Visa (Non-OA)**
For those 50+ years old. One of the following is required:
- THB 800,000 bank deposit in Thailand
- Monthly income proof of THB 65,000+
- Mandatory health insurance: OPD THB 40,000+ / IPD THB 440,000+

### ⚠️ 2024 Tax Reform — Critical for Long-Term Residents

Effective January 1, 2024, Thailand changed how foreign-sourced income is taxed.

**Before**: Remittances of income earned in prior years were generally not taxable in Thailand.
**After**: **Foreign-sourced income remitted to Thailand in the same calendar year it was earned is now taxable**.

Key points:
- 180+ days in Thailand per year = tax resident
- Tax residents must declare and pay Thai tax on foreign income remitted to Thailand
- Tax rates: 5–35% (progressive)
- LTR visa holders retain partial exemption on foreign-sourced income
- Japan–Thailand tax treaty reduces some double taxation risk

### Cost Summary

| Item | Cost |
|------|------|
| LTR Visa (10 years) | THB 50,000 |
| Thailand Privilege Entry (5 years) | THB 900,000 |
| Thailand Privilege Superiority (10 years) | THB 1,500,000 |
| Work permit | THB 3,000–5,000 |
| Non-OA Retirement Visa (1 year) | THB 2,000 |

### Pre-Move Checklist

1. **Job restrictions**: Thai law reserves 39 occupations exclusively for Thai nationals
2. **4:1 rule**: Freelancing and self-employment are generally not permitted for foreigners
3. **90-day reporting**: Non-B and Non-OA visa holders must report to immigration quarterly
4. **2024 tax reform**: Sending living expenses from Japan to Thailand may now trigger Thai tax obligations — consult a tax professional before relocating
5. **Bank account**: Opening a Thai bank account typically requires a work permit or long-term visa
6. **Digital nomads**: No dedicated visa exists; LTR Work-from-Thailand Professional is the most viable option

Thailand offers one of the most established Japanese expat communities in Southeast Asia, with options ranging from Bangkok city life to the lower-cost Chiang Mai lifestyle.

---

### References

This article is based on the following official sources.

- **LTR Visa (Long-Term Resident Visa)**: [BOI Official LTR Portal](https://ltr.boi.go.th/)
- **Thailand Privilege Card**: [Official Thailand Privilege Site (Ministry of Tourism & Sports)](https://www.thailandprivilege.co.th/home)
- **Work Permit**: [Thailand DOE e-Work Permit System](https://ewp.doe.go.th/)
- **Electronic Visa**: [Thailand e-Visa Official Portal](https://thaievisa.go.th/)`,
      zh: `泰国气候温暖、美食丰富、生活成本相对较低，长期位居日本人移居目的地前列。曼谷和清迈都有庞大的外籍人士社区，近年来也推出了面向数字游民和高技能人才的新签证制度。

### 主要签证种类

**LTR（长期居留）签证**
2022年推出的10年期签证，面向富裕人士、退休人员及高技能专业人才，共有4类。
- **富裕全球公民**：净资产USD 1,000,000以上 + 在泰投资USD 500,000以上（或年收入USD 80,000以上 + 投资）
- **富裕退休人员**：年金/被动收入USD 80,000/年以上（50岁以上），或USD 40,000/年以上 + 泰国资产USD 250,000以上
- **在泰远程工作专业人员**：海外公司收入USD 80,000/年以上（需2年以上工作经验）
- **高技能专业人员**：在泰国政府指定目标产业（S-Curve产业）就职的高技能人才
- 申请费用：THB 50,000（10年有效）
- 所有类别均须购买最低USD 40,000的医疗保险

**Thailand Privilege Card（原泰国精英签证）**
面向富裕人士的会员制签证，2023年全面更新，最新方案如下：
- **Privilege Entry（5年）**：THB 900,000
- **Privilege Superiority（10年）**：THB 1,500,000
- **Privilege Excellence（15年）**：THB 2,500,000
- **Elite Ultimate Privilege（20年）**：THB 5,000,000
- 享有机场VIP通道、专车接送、高尔夫及水疗设施等特权

**非移民B类签证 + 工作许可证**
外籍劳工最常申请的路径，需雇主支持。
- **4:1原则**：每雇用1名外籍员工，雇主须同时雇用4名泰国本地员工
- 签证费用：THB 2,000（单次）/ THB 5,000（多次）
- 工作许可证费用：THB 3,000〜5,000（因职种和期限而异）

**退休签证（Non-OA）**
50岁以上人群适用，须满足以下条件之一：
- 在泰国银行存款THB 800,000以上
- 月收入证明THB 65,000以上（养老金证明等）
- 须购买医疗保险：门诊THB 40,000以上 / 住院THB 440,000以上

### ⚠️ 2024年税制改革（重要）

2024年1月1日起，泰国税务规则发生重大变化。

**改革前**：将前年及更早年份的境外所得汇入泰国，通常不需在泰纳税。
**改革后**：**境外所得若在同一纳税年度内汇入泰国，则须申报并缴纳泰国所得税**。

- 每年在泰居留180天以上 → 认定为税务居民
- 税务居民将境外所得汇入泰国须依法申报纳税
- 税率：5%〜35%（累进税率）
- LTR签证持有者对部分境外来源所得享有豁免
- 日本与泰国之间签有税务协定，可避免部分双重征税

### 费用参考

| 项目 | 费用 |
|------|------|
| LTR签证（10年） | THB 50,000 |
| Thailand Privilege Entry（5年） | THB 900,000 |
| Thailand Privilege Superiority（10年） | THB 1,500,000 |
| 工作许可证 | THB 3,000〜5,000 |
| Non-OA退休签证（1年） | THB 2,000 |

### 移居前注意事项

1. **职业限制**：泰国法律规定39类职业仅限泰国公民从事
2. **4:1原则**：个人自由职业和个体经营通常不被允许
3. **90天报到义务**：Non-B和Non-OA签证持有者须每季度向移民局报告住址
4. **2024年税制变化**：在泰长期居留期间从日本账户汇款生活费，可能需缴纳泰国所得税，强烈建议移居前咨询税务专业人士
5. **银行开户**：通常需要工作许可证或长期签证才能在泰国开设银行账户
6. **数字游民**：目前无专属签证，LTR中的在泰远程工作专业人员类别是最现实的选择

泰国拥有东南亚最成熟的日本人社区之一，从曼谷的都市生活到清迈的低成本休闲生活，可供选择的生活方式多元丰富。

---

### 参考资料

本文信息基于以下官方资料整理。

- **LTR签证（长期居留签证）**: [BOI官方LTR门户](https://ltr.boi.go.th/)
- **Thailand Privilege Card**: [泰国旅游体育部认可官方网站](https://www.thailandprivilege.co.th/home)
- **工作许可（Work Permit）**: [泰国劳工部 e-Work Permit 系统](https://ewp.doe.go.th/)
- **电子签证**: [Thailand e-Visa 官方门户](https://thaievisa.go.th/)`,
    },
  },
  {
    slug: "visa-kr",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-kr.webp",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】韓国のビザ・就労許可完全ガイド｜E-7・F-2-7ポイント制・永住権",
      en: "South Korea Visa & Work Permit Complete Guide 2026 | E-7, F-2-7 Points System & PR",
      zh: "【2026年最新版】韩国签证与工作许可完全指南｜E-7·F-2-7积分制·永久居留",
    },
    description: {
      ja: "就労ビザ（E系統）・F-2-7ポイント制・D-10求職ビザ・永住権（F-5）まで。韓国の主要ビザの種類・要件・費用を徹底解説。",
      en: "E-series work visas, F-2-7 points system, D-10 job seeker visa, and F-5 permanent residency — a complete guide to South Korea's main visa types.",
      zh: "E系列就业签证、F-2-7积分制、D-10求职签证及F-5永久居留——全面解析韩国主要签证种类、要求与费用。",
    },
    content: {
      ja: `韓国は日本から近く、文化的な親近感もあることから、アジア圏での移住先として注目されています。IT・半導体・エンタメ・製造業など多様な就労機会があり、ソウル・釜山・済州島を拠点に外国人が増えています。

### あなたに合ったビザは？

| あなたの状況 | おすすめのビザ |
|------------|-------------|
| 韓国企業に専門職として就労 | E-7（特定活動ビザ） |
| 大学・研究機関で語学講師 | E-1〜E-2（専門技術職ビザ） |
| 高度人材ポイント80点以上（就労制限なし希望） | F-2-7（居住ビザ） |
| 韓国で就職活動中 | D-10（求職ビザ） |
| 5年以上の合法滞在後に永住を希望 | F-5（永住権） |
| 韓国国籍者と婚姻 | F-6（婚姻ビザ） |

### 主なビザの種類

**E-7（特定活動）ビザ** ｜ [Hi Korea 公式ページ](https://www.hikorea.go.kr/info/InfoDetailR.pt?lang=en&catSeq=2&wurcdSeq=2798)
専門職・技術職向けの最も一般的な就労ビザ。韓国企業に雇用される場合が多く、雇用主のサポートが必要。
- 学士以上の学位と関連職種での1年以上の実務経験が一般的な要件
- 職種ごとに年間割当（クォータ）があり、競争率が高い職種もある
- 有効期間：1〜3年（更新可）

**E-1〜E-6（専門技術職）ビザ**
- E-1：大学教授・研究員
- E-2：語学講師（英語・日本語など）※英語ネイティブ以外は別途資格審査
- E-3：研究（大学・研究機関所属）
- E-4：技術指導
- E-5：専門職（弁護士・会計士・建築士等）
- E-6：芸術・興行（ダンサー・モデル・音楽家等）

**F-2-7（居住ビザ・ポイント制）** ｜ [Hi Korea 公式ページ](https://www.hikorea.go.kr/info/InfoDetailR.pt?lang=en&catSeq=2&wurcdSeq=2865)
高度人材向けの居住ビザ。年齢・学歴・韓国語能力（TOPIK）・収入・資産などの項目でポイント算出（80点以上で申請可能）。
- 5年間有効（更新可）
- 就労制限なし（一般就労・自営業・フリーランスが可能）
- F-2-7取得後5年でF-5（永住権）申請が可能

**D-10（求職ビザ）** ｜ [Hi Korea 公式ページ](https://www.hikorea.go.kr/info/InfoDetailR.pt?lang=en&catSeq=2&wurcdSeq=2794)
就職活動中の外国人向けビザ。6ヶ月間有効（一定条件下で延長可能）。
- 韓国の正規大学卒業者
- 韓国語能力試験（TOPIK）一定レベル以上
- 世界トップ500大学の学士以上

**永住権（F-5）** ｜ [Hi Korea 公式ページ](https://www.hikorea.go.kr/info/InfoDetailR.pt?lang=en&catSeq=2&wurcdSeq=2869)
韓国で長期的に生活するための永住ビザ。
- 5年以上の合法滞在（継続）
- 直近1年間の平均月収入が前年度GNI平均以上
- TOPIK 3級以上
- 重大犯罪なし
- F-2-7からのルートが最も一般的

**F-6（婚姻）ビザ**
韓国国籍者と婚姻した外国人向けのビザ。安定した生活基盤が証明できれば永住権取得も可能。

### 費用の目安

| 項目 | 費用 |
|------|------|
| ビザ申請（在日韓国領事館） | ¥6,000〜¥10,000程度 |
| ビザ発給手数料（単数） | KRW 60,000 |
| ビザ発給手数料（複数） | KRW 90,000 |
| 外国人登録証発行 | KRW 30,000 |

### 生活・税金について

**所得税**：韓国の所得税は累進課税（6〜45%）。日本との租税条約あり。
**社会保険**：国民健康保険・国民年金・雇用保険・産業災害補償保険への加入が義務付けられる（雇用される場合）。
**チョンセ（전세）制度**：保証金を一括で支払い、賃料なしで居住できる独特の制度。保証金はソウル中心部で数千万ウォン〜数億ウォン規模になる。制度リスクも理解が必要。

### 移住前のチェックポイント

1. **韓国語能力**：F-2-7やD-10はTOPIKスコアが審査に直結。事前の語学準備が重要
2. **E-7クォータ**：職種によっては枠が少なく、採用されても実際の就労開始まで時間がかかる場合がある
3. **社会保険加入義務**：外国人労働者も原則として全加入が必要で、給与天引きが発生する
4. **チョンセ詐欺リスク**：近年チョンセ保証金が戻らないトラブルが増加。契約前の登記確認が必須
5. **済州島の外国人優遇**：済州島は別途投資移民制度があり、不動産投資での永住権取得も可能

韓国はK-POPや半導体産業を背景にグローバル化が進み、日本語を活かした就労機会も豊富です。IT・コンテンツ・製造分野での移住先として今後も注目が続くでしょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **外国人ビザ・在留全般**: [Hi Korea 外国人在留ポータル](https://www.hikorea.go.kr/)
- **ビザ種別ガイド（D-8・F-2・F-5等）**: [韓国法務省出入国外国人政策本部](https://www.immigration.go.kr/)
- **韓国政府外国人サービス**: [gov.kr 外国人向けポータル](https://www.gov.kr/portal/foreigner/en/m010102)
- **雇用許可制（E-9ビザ）**: [韓国雇用労働部 – 雇用許可制（EPS）](https://www.eps.go.kr/)
- **国民健康保険（外国人加入案内）**: [国民健康保険公団（NHIS）](https://www.nhis.or.kr/nhis/english/index.do)
- **国税庁（HOMETAX）**: [国税庁 – 外国人税務申告](https://www.hometax.go.kr/)`,
      en: `South Korea is growing in popularity as a relocation destination, especially in IT, semiconductors, entertainment, and manufacturing. Its proximity to Japan and cultural familiarity make it appealing, and Seoul, Busan, and Jeju Island all have growing expat communities.

### Main Visa Types

**E-7 (Specific Activities) Visa**
The most common work visa for professionals and skilled workers at Korean companies. Employer sponsorship required.
- Generally requires a bachelor's degree and 1+ year of relevant experience
- Annual quotas exist per occupation — some categories are competitive
- Validity: 1–3 years (renewable)

**E-1 to E-6 (Specialized Work) Visas**
- E-1: University professors and researchers
- E-2: Language instructors (English, Japanese, etc.)
- E-3: Research (at universities or research institutions)
- E-4: Technology instruction
- E-5: Licensed professionals (lawyers, CPAs, architects)
- E-6: Arts and entertainment (dancers, models, musicians)

**F-2-7 (Residency Visa – Points System)**
Points-based residency for highly skilled workers. Applicants need 80+ points based on age, education, TOPIK Korean language score, income, and assets.
- Valid for 5 years (renewable)
- No work restrictions — allows employment, self-employment, and freelancing
- After 5 years on F-2-7, eligible to apply for F-5 permanent residency

**D-10 (Job Seeker Visa)**
6-month visa for foreigners actively seeking employment in Korea (extendable under certain conditions). Eligibility:
- Graduates of Korean universities
- Holders of TOPIK at a qualifying level
- Graduates of top 500 global universities (bachelor's degree or higher)

**Permanent Residency (F-5)**
- 5+ years of continuous lawful residence
- Average monthly income ≥ prior year national GNI average
- TOPIK Level 3 or higher
- No serious criminal record
- F-2-7 → F-5 is the most common pathway

**F-6 (Marriage) Visa**
For foreign spouses of Korean nationals. With a demonstrated stable livelihood, permanent residency is achievable.

### Cost Summary

| Item | Cost |
|------|------|
| Visa application at Korean consulate in Japan | ¥6,000–¥10,000 |
| Single-entry visa issuance fee | KRW 60,000 |
| Multiple-entry visa issuance fee | KRW 90,000 |
| Alien Registration Card | KRW 30,000 |

### Tax & Living Notes

**Income tax**: Progressive rates 6–45%. Japan-Korea tax treaty exists.
**Social insurance**: Employees are required to enroll in National Health Insurance, National Pension, Employment Insurance, and Workers' Compensation.
**Jeonse (전세)**: A uniquely Korean rental system where a lump-sum deposit (no monthly rent) is paid upfront. Deposits in central Seoul range from tens of millions to hundreds of millions of KRW. Understand the associated fraud risks before signing.

### Pre-Move Checklist

1. **Korean language**: TOPIK scores directly affect F-2-7 eligibility and points — start studying early
2. **E-7 quotas**: Certain occupations have limited slots; even after hire, actual start may be delayed
3. **Mandatory social insurance**: All employees — including foreigners — must enroll; costs are payroll-deducted
4. **Jeonse fraud risk**: Incidents of deposit non-return have risen in recent years — always check the property registry before signing
5. **Jeju Island incentives**: Jeju has a separate investment immigration scheme allowing permanent residency via real estate investment

South Korea's growing global presence in K-pop, semiconductors, and manufacturing creates strong demand for international talent. It remains an increasingly attractive destination for professionals in IT, content, and industrial sectors.

---

### References

This article is based on the following official sources.

- **Foreign Residency & Visa General**: [Hi Korea Foreign Resident Portal](https://www.hikorea.go.kr/)
- **Visa Category Guide (D-8, F-2, F-5, etc.)**: [Korea Immigration Service (Ministry of Justice)](https://www.immigration.go.kr/)
- **Korea Government Foreign Services**: [gov.kr Foreigner Portal](https://www.gov.kr/portal/foreigner/en/m010102)`,
      zh: `韩国与日本距离近、文化亲近，IT、半导体、娱乐和制造业提供了多样的就业机会，首尔、釜山、济州岛的外籍人士社区也在持续壮大。

### 主要签证种类

**E-7（特定活动）签证**
面向专业技术人员的最常见就业签证，通常受雇于韩国企业，需雇主支持。
- 一般要求本科以上学历及相关职种1年以上工作经验
- 部分职种设有年度配额，竞争较为激烈
- 有效期：1〜3年（可续签）

**E-1至E-6（专业技术）签证**
- E-1：大学教授、研究员
- E-2：语言讲师（英语、日语等）
- E-3：研究（大学或研究机构）
- E-4：技术指导
- E-5：专业人士（律师、会计师、建筑师等）
- E-6：艺术、演出（舞者、模特、音乐家等）

**F-2-7（居住签证·积分制）**
面向高技能人才的居住签证，根据年龄、学历、韩语能力（TOPIK）、收入、资产等评分（需80分以上方可申请）。
- 有效期5年（可续签）
- 无工作限制，可受雇就业、自营业或自由职业
- 持有F-2-7满5年后可申请F-5永久居留权

**D-10（求职签证）**
面向在韩积极求职的外国人，有效期6个月（符合条件可延期）。适用对象：
- 韩国正规大学毕业生
- 具备一定TOPIK韩语能力等级者
- 全球前500名大学本科及以上毕业生

**永久居留权（F-5）**
- 连续合法居留5年以上
- 近1年平均月收入不低于上一年度全国人均GNI
- TOPIK 3级以上
- 无重大犯罪记录
- F-2-7 → F-5是最常见路径

**F-6（婚姻）签证**
韩国国籍者的外籍配偶专属签证，生活基础稳定可申请永久居留权。

### 费用参考

| 项目 | 费用 |
|------|------|
| 签证申请费（驻日韩国领事馆） | 约¥6,000〜¥10,000 |
| 单次入境签证签发费 | KRW 60,000 |
| 多次入境签证签发费 | KRW 90,000 |
| 外国人登录证签发费 | KRW 30,000 |

### 税务与生活须知

**所得税**：累进税率6%〜45%，日本与韩国之间签有税务协定。
**社会保险**：受雇员工须强制参加国民健康保险、国民年金、就业保险和工伤保险。
**全租房（전세）制度**：韩国特有的租赁制度，一次性缴纳高额保证金后可免月租居住，首尔市中心保证金规模从数千万到数亿韩元不等。需充分了解相关风险后再签约。

### 移居前注意事项

1. **韩语能力**：TOPIK成绩直接影响F-2-7资格与积分，建议提前备考
2. **E-7配额限制**：部分职种名额有限，录用后实际入职可能需要等待
3. **强制社会保险**：外籍员工同样须全额参保，费用从工资中代扣
4. **全租房诈骗风险**：近年保证金无法返还的纠纷增多，签约前务必核查产权登记
5. **济州岛优惠政策**：济州岛设有独立的投资移民制度，可通过房地产投资申请永久居留权

韩国在K-Pop、半导体和制造业领域的全球影响力不断提升，对国际人才的需求持续增长，是IT、内容创作和工业领域从业者值得关注的移居目的地。

---

### 参考资料

本文信息基于以下官方资料整理。

- **外国人居留及签证总览**: [Hi Korea 外国人居留门户](https://www.hikorea.go.kr/)
- **签证类别指南（D-8・F-2・F-5等）**: [韩国法务部出入境外国人政策本部](https://www.immigration.go.kr/)
- **韩国政府外国人服务**: [gov.kr 外国人门户](https://www.gov.kr/portal/foreigner/en/m010102)`,
    },
  },
  {
    slug: "visa-tw",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-tw.webp",
    category: "visa",
    date: "2026-03-25",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】台湾のビザ・就労許可完全ガイド｜Gold Card・就労許可・永住権",
      en: "Taiwan Visa & Work Permit Complete Guide 2026 | Gold Card, Work Permit & APRC",
      zh: "【2026年最新版】台湾签证与工作许可完全指南｜就业金卡·工作许可·永久居留",
    },
    description: {
      ja: "Employment Gold Card・就労許可証（ARC）・永住権（APRC）まで。台湾の主要ビザの種類・要件・費用・税制優遇を徹底解説。",
      en: "Employment Gold Card, work permits (ARC), APRC permanent residency, and tax incentives — a complete guide to Taiwan's main visa types and requirements.",
      zh: "就业金卡、工作许可（ARC）、永久居留证（APRC）及税收优惠——全面解析台湾主要签证种类、要求与费用。",
    },
    content: {
      ja: `台湾は親日感情が強く、食文化・自然環境・生活コストのバランスが良いことから、日本人移住者に人気の国です。近年はTSMC（台積電）を中心とした半導体産業の拡大により、外国人エンジニア・専門職への需要も急増しています。

### 主なビザの種類

**Employment Gold Card（エンプロイメントゴールドカード）**
高度人材向けの3年間有効ビザ。就労許可・居留許可・再入国許可が1枚のカードで全て完結する優れた制度です。
申請資格（いずれかを満たすこと）：
- 月収NTD 160,000以上の就労経験
- 技術・科学・経済・教育・文化・芸術・スポーツ分野の卓越した人材（受賞歴・著名プロジェクト等で証明）
- 申請費用：NTD 5,380
- 処理期間：30〜60営業日程度

Gold Cardの大きな魅力は**税制優遇**です。
- 初年度より**5年間**、給与所得のうちNTD 3,000,000を超える部分の**50%が所得税免除**
- 台湾に居留しながら海外からの収入を継続している高収入者に特に有利

**就労許可証（Work Permit）+ 居留証（ARC）**
一般的な就労ルート。台湾の雇用主が労働部（Ministry of Labor）に申請。
- 対象：専門職・技術職・企業内転勤・英語教師等
- 月給最低基準：NTD 47,971以上（一般専門職、2023年改定）
- 申請費用：NTD 500〜1,000
- ARC（外僑居留証）は毎年更新。就労許可と連動

**観光・短期商用での滞在**
日本人はビザなしで台湾に90日滞在可能。ただし就労は一切不可。就職活動目的の滞在は可能。

**APRC（外僑永久居留証）**
台湾での永住権に相当。申請条件：
- 継続5年以上の居留（年183日以上）
- 毎年の収入がミニマム生活基準額以上
- 犯罪記録なし
- 中国語または英語での基本コミュニケーション能力

### 費用の目安

| 項目 | 費用 |
|------|------|
| Gold Card申請費 | NTD 5,380 |
| 就労許可申請費 | NTD 500〜1,000 |
| ARC発行費（初回） | NTD 1,000 |
| ARC更新費 | NTD 1,000 |
| APRC申請費 | NTD 10,000 |

### 生活・税金について

**所得税**：居住者は課税所得に対し5〜40%の累進課税。台湾居住者認定は年183日以上の滞在。
**国民健康保険（NHI）**：居留許可取得から原則2ヶ月後に加入可能。月額保険料はNTD 800程度から（収入比例）。世界最高水準の医療が低コストで受けられる点が大きな魅力。
**住居費**：台北の大安区・信義区等の中心部は月NTD 20,000〜50,000。新北市（板橋等）に移ると割安。

### 移住前のチェックポイント

1. **Gold Cardの税制優遇**：高収入の専門職には**5年間**の税控除が非常に有利。ただし申請時に収入証明が必要
2. **就労許可の更新サイクル**：ARCは毎年更新が基本。雇用終了後60日以内に転職または帰国が必要
3. **半導体産業の求人**：TSMCや関連企業での採用は技術職中心。英語・日本語が使える環境も多い
4. **デジタルノマドビザなし**：台湾には現時点で専用のデジタルノマドビザはない。Gold Cardがその代替として機能
5. **地震・台風**：台湾は自然災害が多い。住居の耐震性や保険の確認を推奨

台湾はGold Cardによる優遇税制・充実した医療保険・日本から近い立地が揃っており、IT・半導体・クリエイティブ分野の人材には非常に魅力的な移住先です。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **Employment Gold Card（就業金卡）**: [ゴールドカード公式ポータル（国家発展委員会）](https://goldcard.nat.gov.tw/en/)
- **Gold Card 資格要件**: [ゴールドカード 資格要件ページ](https://goldcard.nat.gov.tw/en/qualification/)
- **APRC（永久居留証）**: [内政部移民署 – APRC 申請ガイドライン](https://www.immigration.gov.tw/5475/5478/141465/141808/)`,
      en: `Taiwan is popular among Japanese expatriates for its pro-Japan culture, excellent food, natural scenery, and balanced cost of living. With TSMC and the broader semiconductor ecosystem expanding rapidly, demand for foreign engineers and professionals is surging.

### Main Visa Types

**Employment Gold Card**
A 3-year combined work/residency visa for high-skilled professionals — one card covers work permit, residence permit, and re-entry permit.
Eligibility (any of the following):
- Monthly salary of NTD 160,000+ from a relevant position
- Outstanding talent in technology, science, economics, education, culture, arts, or sports (demonstrated via awards, projects, etc.)
- Application fee: NTD 5,380
- Processing time: approximately 30–60 business days

**Gold Card Tax Incentive**: For **5 years** from the start of residence, **50% of salary income exceeding NTD 3,000,000 per year is exempt from income tax** — highly favorable for high earners.

**Work Permit + ARC (Alien Resident Certificate)**
Standard employment route. The Taiwanese employer applies to the Ministry of Labor.
- Target roles: Professionals, skilled workers, intra-company transfers, English teachers
- Minimum monthly salary: NTD 47,971+ (general professional category, revised 2023)
- Application fee: NTD 500–1,000
- ARC renewed annually, linked to work permit

**Visa-Free Short Stay**
Japanese nationals can stay visa-free in Taiwan for up to 90 days. Work is strictly prohibited. Job hunting during a visit is permitted.

**APRC (Alien Permanent Resident Certificate)**
Taiwan's permanent residency equivalent. Requirements:
- 5+ years of continuous residence (183+ days/year)
- Minimum annual income above livelihood threshold
- No criminal record
- Basic communication ability in Chinese or English

### Cost Summary

| Item | Cost |
|------|------|
| Gold Card application fee | NTD 5,380 |
| Work permit application | NTD 500–1,000 |
| ARC issuance (initial) | NTD 1,000 |
| ARC renewal | NTD 1,000 |
| APRC application | NTD 10,000 |

### Tax & Living Notes

**Income tax**: 5–40% progressive rates for residents (183+ days/year). Gold Card holders benefit from a 50% exemption on salary above NTD 3M for the first **5 years**.
**National Health Insurance (NHI)**: Available 2 months after receiving a residence permit. Monthly premiums start around NTD 800 (income-based). Taiwan's NHI is widely regarded as one of the world's best healthcare systems at very low cost.
**Housing**: Central Taipei (Da'an, Xinyi districts) runs NTD 20,000–50,000/month. New Taipei City (Banqiao, etc.) is considerably more affordable.

### Pre-Move Checklist

1. **Gold Card tax benefit**: Significant 3-year income tax exemption for high earners — income documentation required at application
2. **ARC renewal cycle**: Annual renewal is standard; you have 60 days to change employers or depart after job termination
3. **Semiconductor job market**: TSMC and related firms hire primarily technical roles; many positions are English or Japanese-friendly
4. **No digital nomad visa**: Taiwan has no dedicated digital nomad visa — the Gold Card serves as the closest equivalent
5. **Natural disasters**: Taiwan has frequent earthquakes and typhoons — check building earthquake ratings and insurance before signing a lease

Taiwan's combination of Gold Card tax incentives, excellent affordable healthcare, and proximity to Japan makes it an exceptionally attractive destination for IT, semiconductor, and creative professionals.

---

### References

This article is based on the following official sources.

- **Employment Gold Card**: [Gold Card Official Portal (National Development Council)](https://goldcard.nat.gov.tw/en/)
- **Gold Card Eligibility**: [Gold Card Qualification Page](https://goldcard.nat.gov.tw/en/qualification/)
- **APRC (Alien Permanent Resident Certificate)**: [National Immigration Agency – APRC Guidelines](https://www.immigration.gov.tw/5475/5478/141465/141808/)`,
      zh: `台湾亲日情感浓厚，饮食文化、自然风光与生活成本的平衡备受日本移居者青睐。随着台积电（TSMC）为核心的半导体产业迅速扩张，对外籍工程师和专业人才的需求急剧增加。

### 主要签证种类

**就业金卡（Employment Gold Card）**
面向高技能专业人士的3年期综合签证，集工作许可、居留许可和重入境许可于一卡。
申请资格（满足其中之一）：
- 具备月薪NTD 160,000以上的相关工作经历
- 在科技、科学、经济、教育、文化、艺术或体育领域拥有卓越成就（获奖记录、重大项目等证明）
- 申请费用：NTD 5,380
- 办理周期：约30〜60个工作日

**就业金卡税收优惠**：居留起始后**5年内**，**年薪超过NTD 3,000,000的部分可享受50%所得税豁免**，对高收入人士尤为有利。

**工作许可证 + 居留证（ARC）**
标准就业途径，由台湾雇主向劳动部申请。
- 适用岗位：专业技术人员、技能工人、企业内部调任、英语教师等
- 最低月薪基准：NTD 47,971以上（一般专业人员，2023年修订）
- 申请费用：NTD 500〜1,000
- ARC每年续签，与工作许可证挂钩

**免签短期停留**
日本人可无需签证在台湾停留最长90天，但严禁从事任何工作；在台求职洽谈不受限制。

**外侨永久居留证（APRC）**
台湾的永久居留制度。申请条件：
- 连续居留5年以上（每年183天以上）
- 年收入达到最低生活标准以上
- 无犯罪记录
- 具备中文或英文基本沟通能力

### 费用参考

| 项目 | 费用 |
|------|------|
| 就业金卡申请费 | NTD 5,380 |
| 工作许可申请费 | NTD 500〜1,000 |
| ARC签发费（首次） | NTD 1,000 |
| ARC续签费 | NTD 1,000 |
| APRC申请费 | NTD 10,000 |

### 税务与生活须知

**所得税**：居民（每年在台183天以上）适用5%〜40%累进税率。就业金卡持有者前**5年**可享受年薪NTD 300万以上部分的50%所得税豁免。
**全民健保（NHI）**：取得居留许可约2个月后可参加，月保费从约NTD 800起（按收入计算）。台湾全民健保被誉为全球最佳医疗保障体系之一，费用低廉。
**住房**：台北市中心（大安区、信义区等）月租约NTD 20,000〜50,000，新北市（板桥等）则相对经济实惠。

### 移居前注意事项

1. **就业金卡税收优惠**：高收入专业人士可享受显著的3年所得税优惠，申请时需提供收入证明
2. **ARC年度续签**：ARC须每年续签，离职后须在60天内完成转职或离境
3. **半导体产业招聘**：台积电及相关企业以技术岗位为主，许多职位支持英语或日语工作环境
4. **无数字游民签证**：台湾目前无专属数字游民签证，就业金卡是最接近的替代方案
5. **自然灾害**：台湾地震和台风频发，签约前建议确认建筑抗震等级并购买保险

台湾凭借就业金卡税收优惠、优质低价的医疗保障以及与日本的近距离优势，对IT、半导体和创意产业的专业人士极具吸引力。

---

### 参考资料

本文信息基于以下官方资料整理。

- **就业金卡（Employment Gold Card）**: [金卡官方门户（国家发展委员会）](https://goldcard.nat.gov.tw/en/)
- **金卡资格要求**: [金卡资格要求页面](https://goldcard.nat.gov.tw/en/qualification/)
- **永久居留证（APRC）**: [内政部移民署 – APRC 申请指南](https://www.immigration.gov.tw/5475/5478/141465/141808/)`,
    },
  },
  {
    slug: "visa-hk",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-hk.webp",
    category: "visa",
    date: "2026-03-25",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】香港のビザ・就労許可完全ガイド｜TTPS・QMAS・就労ビザ・投資ビザ",
      en: "Hong Kong Visa & Work Permit Complete Guide 2026 | TTPS, QMAS, Employment & Investment Visas",
      zh: "【2026年最新版】香港签证与工作许可完全指南｜TTPS·QMAS·就业签证·资本投资计划",
    },
    description: {
      ja: "Top Talent Pass Scheme（TTPS）・QMAS・就労ビザ・Capital Investment Entrant Schemeまで。香港の主要ビザの種類・要件・費用を徹底解説。",
      en: "Top Talent Pass Scheme (TTPS), QMAS, employment visas, and Capital Investment Entrant Scheme — a complete guide to Hong Kong's main visa types, requirements, and costs.",
      zh: "高端人才通行证计划（TTPS）、QMAS、就业签证及资本投资者入境计划——全面解析香港主要签证种类、要求与费用。",
    },
    content: {
      ja: `香港はアジアの国際金融センターとして、金融・法律・IT・テクノロジー分野の高度人材を積極的に受け入れています。給与所得に対して最大15%という低い税率と、近年導入された優秀人材向け制度が大きな魅力です。

### 主なビザの種類

**就労ビザ（Employment Visa）**
香港企業に雇用される外国人向けの最も一般的なビザ。雇用主が入境事務所に申請。
- 申請費用：HKD 230
- 有効期間：最大2年（更新可）
- 要件：「香港で代替が難しいスキル・知識・経験を持つこと」が基準
- 審査期間：通常4〜6週間

**Top Talent Pass Scheme（TTPS）/ 優秀人才通行証**
2022年10月に導入されたファストトラック制度。雇用なしでも申請可能（ただし2年以内に就労要件を満たす必要）。
- **カテゴリーA**：過去1年間の年収HKD 2,500,000以上
- **カテゴリーB**：世界ランキング100位以内の大学卒業者（3年以上の就労経験あり）
- **カテゴリーC**：カテゴリーBと同じ大学の卒業から5年以内かつ年収HKD 1,500,000以上
- 有効期間：2年間（就労後は通常の就労ビザに切り替え）
- 2023年末時点で累計約6万件超が申請

**Quality Migrant Admission Scheme（QMAS）/ 優秀人才入境計画**
雇用なしで香港への移住を希望する高度人材向けのポイントベース制度。
- **General Points Test**：年齢・学歴・職歴・語学力・家族構成などで採点
- **Achievement-Based Points Test**：国際的に認められた業績（受賞・スポーツ実績等）を持つ人材向け
- 年間クォータあり（過去は年間1,000名前後だったが近年は数千名規模に拡大）
- 申請費用：HKD 600（2025年2月改定）

**Capital Investment Entrant Scheme（CIES）/ 資本投資者入境制度**
2023年3月に再開された投資移民制度。
- HKD 30,000,000以上を香港の特定資産（株式・債券・預金等）に投資
- 不動産投資は対象外（旧制度との大きな違い）
- 申請費用：HKD 10,000（一次審査）

### 税金と生活費

**給与所得税（Salaries Tax）**
- 累進課税：2% / 6% / 10% / 14%（4段階）
- ただし全収入に対して上限15%を適用（いずれか低い方）
- 各種手当・控除を差し引いた「実効税率」は10〜12%程度になることも多い
- 法人税（Profits Tax）：16.5%

**MPF（Mandatory Provident Fund / 強制積立年金）**
- 雇用主と従業員それぞれが給与の5%を拠出（月額上限それぞれHKD 1,500）
- 65歳以降に受取可能

**住居費**：香港の家賃は世界最高水準。中環・上環周辺の1LDKはHKD 20,000〜35,000、九龍（佐敦・旺角）でもHKD 12,000〜20,000。

### 費用の目安

| 項目 | 費用 |
|------|------|
| 就労ビザ申請費 | HKD 230 |
| QMAS申請費 | HKD 600（2025年2月改定） |
| TTPS申請費 | HKD 600（2025年2月改定） |
| CIES申請費（一次審査） | HKD 10,000 |

### 移住前のチェックポイント

1. **政治情勢の変化**：2020年以降、社会状況・法制度が大きく変化。常に最新の政府情報を確認
2. **住居費の高さ**：日本の主要都市の2〜3倍になることも。MoveWorthでのシミュレーションを強く推奨
3. **MPFのロックアップ**：65歳まで引き出せないため、流動性の観点から注意
4. **TTPSの就労要件**：TTPSは入国後2年以内に就労しなければならない。観光・滞在目的のみでは更新不可
5. **永住権（香港居民）**：7年以上の通常居住で申請可能

香港は低税率・アジアのビジネスハブとしての地位・英語の通用性が揃った国際都市ですが、住居費の高さと近年の社会環境の変化を十分考慮した上で移住を検討することをお勧めします。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **QMAS（優秀人才入境計劃）**: [香港入境事務處 – QMAS 公式ページ](https://www.immd.gov.hk/eng/services/visas/quality_migrant_admission_scheme.html)
- **TTPS（トップタレントパス計画）**: [香港入境事務處 – TTPS 公式ページ](https://www.immd.gov.hk/eng/services/visas/TTPS.html)
- **各種人才計劃一覧**: [香港入境事務處 – 全スキーム比較](https://www.immd.gov.hk/eng/useful_information/admission-schemes-talents-professionals-entrepreneurs.html)`,
      en: `Hong Kong is Asia's international financial hub, actively attracting top-tier talent in finance, law, IT, and technology. Its low 15% salary tax cap and newly introduced talent schemes are major drawcards.

### Main Visa Types

**Employment Visa**
The most common visa for foreigners employed by Hong Kong companies. Employers apply to the Immigration Department.
- Application fee: HKD 230
- Validity: Up to 2 years (renewable)
- Requirements: Skills, knowledge, or experience "not readily available in Hong Kong"
- Processing time: typically 4–6 weeks

**Top Talent Pass Scheme (TTPS)**
A fast-track scheme introduced in October 2022. Can be obtained without a job offer (but employment must be secured within 2 years).
- **Category A**: Annual income of HKD 2,500,000+ in the past year
- **Category B**: Graduate of a top-100 world university with 3+ years' work experience
- **Category C**: Graduate of same category university within the past 5 years with annual income HKD 1,500,000+
- Validity: 2 years (converts to standard employment visa after hiring)
- Over 60,000 applications received by end of 2023

**Quality Migrant Admission Scheme (QMAS)**
Points-based scheme for high-skilled individuals without a job offer.
- **General Points Test**: Scored on age, education, work experience, language ability, family background
- **Achievement-Based Points Test**: For internationally recognized achievers (awards, elite sports, etc.)
- Annual quota (expanded in recent years to several thousand)
- Application fee: HKD 600 (revised February 2025)

**Capital Investment Entrant Scheme (CIES)**
Revived investment immigration scheme reopened in March 2023.
- HKD 30,000,000+ invested in eligible Hong Kong assets (stocks, bonds, deposits, etc.)
- Real estate is explicitly excluded (key difference from the old scheme)
- Application fee: HKD 10,000 (initial stage)

### Tax & Living Notes

**Salaries Tax**
- Progressive: 2% / 6% / 10% / 14%
- Standard rate cap: 15% of total income (whichever is lower)
- Effective rate often comes out to 10–12% after allowances and deductions
- Profits Tax (corporate): 16.5%

**MPF (Mandatory Provident Fund)**
- Both employer and employee each contribute 5% of salary (capped at HKD 1,500/month each)
- Withdrawable from age 65

**Housing**: Hong Kong rent is among the world's highest. A 1-bedroom in Central/Sheung Wan runs HKD 20,000–35,000. Even in Kowloon (Jordan, Mong Kok), expect HKD 12,000–20,000+.

### Cost Summary

| Item | Cost |
|------|------|
| Employment visa application | HKD 230 |
| QMAS application fee | HKD 600 (revised Feb 2025) |
| TTPS application fee | HKD 600 (revised Feb 2025) |
| CIES application (initial stage) | HKD 10,000 |

### Pre-Move Checklist

1. **Political and social changes**: Significant shifts since 2020 — always verify current regulations from official sources
2. **High housing costs**: Often 2–3x higher than major Japanese cities — thorough MoveWorth simulation is strongly recommended
3. **MPF lock-up**: Contributions are inaccessible until age 65 — consider liquidity implications
4. **TTPS employment requirement**: Must secure employment within 2 years of entry; extension is not granted for purely residential stays
5. **Permanent residency**: Achievable after 7 years of ordinary residence in Hong Kong

Hong Kong combines a low tax rate, world-class financial infrastructure, and strong English proficiency — but the extremely high housing costs and evolving social environment require careful consideration before committing to a move.

---

### References

This article is based on the following official sources.

- **QMAS (Quality Migrant Admission Scheme)**: [HKID – QMAS Official Page](https://www.immd.gov.hk/eng/services/visas/quality_migrant_admission_scheme.html)
- **TTPS (Top Talent Pass Scheme)**: [HKID – TTPS Official Page](https://www.immd.gov.hk/eng/services/visas/TTPS.html)
- **All Talent Admission Schemes**: [HKID – Schemes Overview](https://www.immd.gov.hk/eng/useful_information/admission-schemes-talents-professionals-entrepreneurs.html)`,
      zh: `香港是亚洲国际金融中心，积极吸引金融、法律、IT和科技领域的顶尖人才。最高15%的薪俸税上限以及近年推出的多项人才引进计划是主要吸引力。

### 主要签证种类

**就业签证（Employment Visa）**
外籍人士在港就业最常见的签证，由雇主向入境事务处申请。
- 申请费用：HKD 230
- 有效期：最长2年（可续签）
- 要求：持有"香港难以寻觅"的技能、知识或经验
- 审批周期：通常4〜6周

**高端人才通行证计划（TTPS）**
2022年10月推出的快速通道计划，无需事先获聘即可申请（但须在入境后2年内受雇）。
- **A类**：过去一年年收入达HKD 2,500,000以上
- **B类**：全球百强大学毕业生且拥有3年以上工作经验
- **C类**：同类百强大学毕业且毕业不超过5年，年收入HKD 1,500,000以上
- 有效期：2年（受雇后转为标准就业签证）
- 截至2023年底累计申请超过6万件

**优秀人才入境计划（QMAS）**
面向无需雇主担保即希望移居香港的高技能人士。
- **通用积分测试**：根据年龄、学历、工作经验、语言能力和家庭背景等评分
- **成就积分测试**：面向拥有国际公认成就的人士（获奖经历、精英体育成绩等）
- 设年度配额（近年已扩大至数千人规模）
- 申请费用：HKD 600（2025年2月修订）

**资本投资者入境计划（CIES）**
2023年3月重启的投资移民计划。
- 在香港特定资产（股票、债券、存款等）投资HKD 30,000,000以上
- 房地产明确排除在外（与旧制度的重要区别）
- 申请费用：HKD 10,000（初步审核阶段）

### 税务与生活须知

**薪俸税**
- 累进税率：2% / 6% / 10% / 14%（四档）
- 标准税率上限：总收入的15%（取两者中较低者）
- 扣除各项免税额后，实际税率通常约为10%〜12%
- 利得税（企业所得税）：16.5%

**强积金（MPF）**
- 雇主和雇员各自缴纳薪酬的5%（每月上限各为HKD 1,500）
- 65岁起可提取

**住房成本**：香港租金位居全球最高之列。中环、上环一带的一居室月租HKD 20,000〜35,000，九龙（佐敦、旺角）也需HKD 12,000〜20,000。

### 费用参考

| 项目 | 费用 |
|------|------|
| 就业签证申请费 | HKD 230 |
| QMAS申请费 | HKD 600（2025年2月修订） |
| TTPS申请费 | HKD 600（2025年2月修订） |
| CIES申请费（初步审核） | HKD 10,000 |

### 移居前注意事项

1. **政治社会变化**：2020年以来社会环境和法律制度发生重大变化，请务必参阅最新官方资讯
2. **高昂住房成本**：常为日本主要城市的2〜3倍，强烈建议使用MoveWorth进行充分模拟
3. **强积金锁定期**：缴款须至65岁方可提取，需从流动性角度充分考量
4. **TTPS就业要求**：入境后须在2年内受雇，纯居住目的无法续签
5. **永久居住权**：在港连续通常居住满7年后可申请

香港集低税率、世界级金融基础设施和广泛的英语使用环境于一体，但极高的住房成本和近年不断变化的社会环境，要求移居者在做出决定前进行充分的调研与规划。

---

### 参考资料

本文信息基于以下官方资料整理。

- **QMAS（优秀人才入境计划）**: [香港入境事务处 – QMAS 官方页面](https://www.immd.gov.hk/eng/services/visas/quality_migrant_admission_scheme.html)
- **TTPS（高端人才通行证计划）**: [香港入境事务处 – TTPS 官方页面](https://www.immd.gov.hk/eng/services/visas/TTPS.html)
- **各类人才计划总览**: [香港入境事务处 – 全计划比较](https://www.immd.gov.hk/eng/useful_information/admission-schemes-talents-professionals-entrepreneurs.html)`,
    },
  },
  {
    slug: "visa-id",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-id.webp",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】インドネシアのビザ・就労許可完全ガイド｜KITAS・Second Home Visa・バリ島",
      en: "Indonesia Visa & Work Permit Complete Guide 2026 | KITAS, Second Home Visa & Bali",
      zh: "【2026年最新版】印度尼西亚签证与工作许可完全指南｜KITAS·第二家园签证·巴厘岛",
    },
    description: {
      ja: "KITAS（就労・居住許可）・Second Home Visa・B211Aビザ・バリ島での生活まで。インドネシアの主要ビザの種類・要件・費用を徹底解説。",
      en: "KITAS, Second Home Visa, B211A business visa, Bali lifestyle — a complete guide to Indonesia's main visa types, requirements, and costs.",
      zh: "KITAS、第二家园签证、B211A商务签证及巴厘岛生活——全面解析印度尼西亚主要签证种类、要求与费用。",
    },
    content: {
      ja: `インドネシアはASEANの中で最大の経済規模を持つ国で、バリ島を中心にデジタルノマドや移住者に人気が高まっています。ジャカルタは東南アジア有数のビジネスハブであり、製造業・IT・資源産業などで多くの日系企業が進出しています。

### あなたに合ったビザは？

| あなたの状況 | おすすめのビザ |
|------------|-------------|
| インドネシア企業に就労 | KITAS（就労許可付き） |
| 富裕層・資産1.5億円以上で長期滞在 | Second Home Visa（5〜10年） |
| 観光・バリ島でのノマド滞在（短期） | 観光ビザ延長（最大120日）またはVOA |
| インドネシア人配偶者あり | 配偶者KITAS |
| 長期在留後に永住を希望 | KITAP（KITAS継続5年後） |
| ビジネス視察・商談 | B211A ビザまたはVOA |

### 主なビザの種類

**KITAS（Limited Stay Permit / Izin Tinggal Terbatas）** ｜ [出入国管理局 e-Visa ポータル](https://evisa.imigrasi.go.id/)
外国人がインドネシアで就労・居住するための主要な許可証。
- 就労KITASはRPTKA（外国人就労計画）+ Imta（外国人就労許可証）とセットで申請
- スポンサー（雇用主またはインドネシア人配偶者等）が必要
- 有効期間：1〜2年（更新可）
- 政府手数料（2024年12月改定）：
  - 短期（1年以下）：IDR 5,250,000 + USD 150
  - 長期（2年）：IDR 7,000,000 + USD 150
- 代理店手数料等を含めると合計USD 500〜1,500程度になることが多い

**外国人就労許可（RPTKA + Imta）** ｜ [インドネシア労働省](https://kemnaker.go.id/)
インドネシア企業が外国人を雇用するために申請。
- 外国人1名あたり補償費用USD 1,200/年（Danajaminカテゴリー）の支払いが必要
- 職種別の就労制限リスト（Daftar Jabatan Terlarang）の確認が必須

**B211A ビザ（投資・ビジネスビザ）**
60日間のビジネス活動向けビザ（会議・視察等）。就労は一切不可。
- 到着時のVOA（Visa on Arrival）でも代替可能（USD 35、最大延長90日）

**Second Home Visa（第二の家ビザ）** ｜ [移民局 公式FAQ](https://evisa.imigrasi.go.id/front/faq/b6469147-09ae-44c0-878e-74e2c4c2c14e)
2022年に導入された長期滞在ビザ。
- 要件：インドネシアの銀行にIDR 2,000,000,000以上（約2,000万円相当）の定期預金または資産証明
- 有効期間：5年または10年（更新可）
- 就労は不可（ただしリモートワークについては現時点では黙認されるケースあり）
- 申請費用：USD 200〜300程度

**配偶者KITASとKITAP（永住許可）**
- インドネシア人配偶者がいる場合はスポンサードKITASが取得しやすい
- KITAS継続5年でKITAP（Izin Tinggal Tetap＝永住許可）の申請が可能

### バリ島でのデジタルノマド事情

インドネシアには現時点で公式のデジタルノマドビザは存在しません。以下の2つが事実上のノマド向け滞在手段です：

1. **ビジターVisa（観光ビザ）の延長**：観光ビザは60日＋最大延長60日で最長120日滞在可能
2. **Second Home Visa**：長期在留には資産要件が高いが、就労なしで最大10年滞在が可能

注意：観光ビザでリモートワークを行うことは法律上グレーゾーンで、正式には認められていません。

### 費用の目安

| 項目 | 費用 |
|------|------|
| KITAS申請費（政府手数料） | 短期：IDR 5,250,000 + USD 150 / 長期：IDR 7,000,000 + USD 150 |
| Imta補償費 | USD 1,200/年（外国人1名あたり） |
| Second Home Visa申請費 | USD 200〜300程度 |
| VOA（観光・ビジネス） | USD 35（60日） |

### 移住前のチェックポイント

1. **職種制限**：インドネシアには外国人が就労できない職種が多数（通訳・翻訳・人事・採用業務等も制限対象）
2. **税務**：183日以上の滞在でインドネシアの税務居住者とみなされ、国内源泉所得に対して5〜35%の課税
3. **バリ島の物価**：クタ・エチェ周辺の外国人向け物件は月USD 1,000〜3,000以上になることも。レートと実態を必ず確認
4. **エージェント利用推奨**：KITASの申請は書類が複雑なため、専門エージェントの利用が一般的（費用USD 200〜500程度）
5. **外国人の土地所有不可**：インドネシアでは外国人は土地・建物の所有権を持てない（借地権Hakpakaiは一部可）

インドネシアはバリ島の魅力から移住先として世界的に人気ですが、就労ビザの取得は複雑です。事前の情報収集と専門エージェントへの相談を強くお勧めします。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **電子ビザ・在留許可（KITAS/KITAP）**: [インドネシア出入国管理局 e-Visa ポータル](https://evisa.imigrasi.go.id/)
- **セカンドホームビザ**: [セカンドホームビザ公式 FAQ（移民局）](https://evisa.imigrasi.go.id/front/faq/b6469147-09ae-44c0-878e-74e2c4c2c14e)
- **外国人就労許可（Izin Bekerja）**: [インドネシア労働省 – 外国人就労許可](https://kemnaker.go.id/)
- **BPJS（社会保険）加入情報**: [BPJS Ketenagakerjaan 公式サイト](https://www.bpjsketenagakerjaan.go.id/)
- **税務登録（DJP Online）**: [インドネシア税務総局](https://www.pajak.go.id/)`,
      en: `Indonesia is ASEAN's largest economy and is growing rapidly as a destination for digital nomads and expatriates, especially in Bali. Jakarta is a major Southeast Asian business hub with a large Japanese corporate presence in manufacturing, IT, and natural resources.

### Main Visa Types

**KITAS (Limited Stay Permit)**
The primary permit for foreigners living and working in Indonesia.
- Work KITAS is applied together with RPTKA (Foreign Worker Utilization Plan) + Imta (Foreign Worker Employment Permit)
- Requires a sponsor (employer or Indonesian spouse)
- Validity: 1–2 years (renewable)
- Government fees (revised December 2024):
  - Short-term (≤1 year): IDR 5,250,000 + USD 150
  - Long-term (2 years): IDR 7,000,000 + USD 150
- Total cost including agent fees typically USD 500–1,500

**Foreign Work Permit (RPTKA + Imta)**
Applied by Indonesian companies wishing to hire foreigners.
- USD 1,200/year compensation fee (Danajamin category) per foreign employee
- Employers must verify that the target role is not on the restricted occupations list

**B211A Visa (Business/Investment Visa)**
60-day visa for business activities (meetings, inspections). Employment strictly prohibited.
- Can also use Visa on Arrival (VOA): USD 35, extendable up to 90 days

**Second Home Visa**
Long-term stay visa introduced in 2022.
- Requirement: IDR 2,000,000,000+ (approx. USD 130,000) in an Indonesian bank or equivalent asset proof
- Validity: 5 or 10 years (renewable)
- Employment not permitted (remote work for overseas clients is a grey area in practice)
- Application fee: approx. USD 200–300

**Spousal KITAS & KITAP (Permanent Stay Permit)**
- Easier path for those married to Indonesian citizens
- After 5 continuous years of KITAS, KITAP (permanent residency equivalent) may be applied for

### Digital Nomad Scene in Bali

Indonesia currently has no official digital nomad visa. The two practical options are:
1. **Tourist visa extension**: Up to 60 + 60 = 120 days
2. **Second Home Visa**: High asset requirements but up to 10-year stay

Note: Working remotely on a tourist visa is technically illegal under Indonesian law — it exists in a grey zone.

### Cost Summary

| Item | Cost |
|------|------|
| KITAS gov. fee | Short: IDR 5,250,000 + USD 150 / Long: IDR 7,000,000 + USD 150 |
| Imta compensation fee | USD 1,200/year per person |
| Second Home Visa | Approx. USD 200–300 |
| VOA (tourism/business) | USD 35 (60 days) |

### Pre-Move Checklist

1. **Occupation restrictions**: Many roles (including HR, recruitment, translation, and interpretation) are restricted to Indonesian nationals
2. **Tax residency**: 183+ days in Indonesia triggers tax residency; Indonesian-source income taxed at 5–35%
3. **Bali rental market**: Expat-oriented properties in Canggu/Seminyak can cost USD 1,000–3,000+/month — always verify current rates
4. **Use an agent**: KITAS applications involve complex paperwork; specialized agents (typically USD 200–500) are standard practice
5. **No foreign land ownership**: Foreigners cannot own land or buildings; limited right-of-use (Hak Pakai) arrangements exist in some cases

Indonesia's Bali lifestyle draws global interest, but work visa processes are complex. Thorough pre-arrival research and consulting a local immigration agent is strongly recommended.

---

### References

This article is based on the following official sources.

- **e-Visa, KITAS & KITAP**: [Indonesia Immigration e-Visa Portal](https://evisa.imigrasi.go.id/)
- **Second Home Visa**: [Second Home Visa Official FAQ (Immigration)](https://evisa.imigrasi.go.id/front/faq/b6469147-09ae-44c0-878e-74e2c4c2c14e)`,
      zh: `印度尼西亚是东盟最大经济体，以巴厘岛为核心在数字游民和移居者中持续升温。雅加达是东南亚重要商业中心，制造业、IT和资源产业中有大量日资企业进驻。

### 主要签证种类

**KITAS（有限居留许可）**
外国人在印尼生活和工作的主要许可证。
- 就业KITAS须与RPTKA（外籍劳工使用计划）+ Imta（外籍劳工就业许可）一同申请
- 需要担保人（雇主或印尼籍配偶等）
- 有效期1〜2年（可续签）
- 政府手续费（2024年12月修订）：
  - 短期（1年及以下）：IDR 5,250,000 + USD 150
  - 长期（2年）：IDR 7,000,000 + USD 150
- 含代理费用，总计通常约USD 500〜1,500

**外籍劳工就业许可（RPTKA + Imta）**
希望雇用外国人的印尼企业申请。
- 每位外籍员工须缴纳USD 1,200/年的补偿金（Danajamin类别）
- 须确认所申请职位是否属于限制外国人就职的职种名单

**B211A签证（投资/商务签证）**
60天商务活动签证（会议、考察等），严禁从事任何工作。
- 也可使用落地签（VOA）代替：USD 35，可延期至最长90天

**第二家园签证**
2022年推出的长期居留签证。
- 要求：在印尼银行存款IDR 2,000,000,000以上（约合人民币约90万元）或同等资产证明
- 有效期：5年或10年（可续签）
- 不允许就业（远程为境外公司工作目前处于灰色地带）
- 申请费用：约USD 200〜300

**配偶KITAS及KITAP（永久居留许可）**
- 与印尼公民结婚者可通过担保KITAS便捷入境
- 持续持有KITAS满5年后可申请KITAP（永久居留许可）

### 巴厘岛数字游民现状

目前印尼尚无官方数字游民签证，实际上可用的长期居留方式有两种：
1. **旅游签证延期**：最长60+60=120天
2. **第二家园签证**：资产门槛较高，但最长可居留10年

注意：持旅游签证进行远程办公在法律上属违规，目前处于灰色地带。

### 费用参考

| 项目 | 费用 |
|------|------|
| KITAS政府手续费 | 短期：IDR 5,250,000 + USD 150 / 长期：IDR 7,000,000 + USD 150 |
| Imta补偿金 | USD 1,200/年（每位外籍员工） |
| 第二家园签证申请费 | 约USD 200〜300 |
| 落地签（旅游/商务） | USD 35（60天） |

### 移居前注意事项

1. **职业限制**：印尼限制外国人从事的职种众多（含人力资源、招聘、翻译、口译等），务必事先核查
2. **税务居民认定**：在印尼居留183天以上即被认定为税务居民，国内来源收入须按5%〜35%缴纳所得税
3. **巴厘岛租金**：坎古/水明漾地区面向外籍人士的房源月租可达USD 1,000〜3,000以上，务必确认最新行情
4. **建议使用中介**：KITAS申请材料繁琐，通常委托专业中介办理（费用约USD 200〜500）
5. **外国人不得拥有土地**：外国人不得持有土地或建筑物产权，部分情况下可通过使用权（Hak Pakai）安排

印度尼西亚因巴厘岛的魅力而在全球移居者中备受追捧，但就业签证流程较为复杂，强烈建议提前做好充分调查并咨询当地移民中介。

---

### 参考资料

本文信息基于以下官方资料整理。

- **电子签证・KITAS/KITAP**: [印度尼西亚移民局 e-Visa 门户](https://evisa.imigrasi.go.id/)
- **第二家园签证**: [第二家园签证官方FAQ（移民局）](https://evisa.imigrasi.go.id/front/faq/b6469147-09ae-44c0-878e-74e2c4c2c14e)`,
    },
  },
  {
    slug: "visa-ph",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-ph.webp",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】フィリピンのビザ・移住条件完全ガイド｜SRRV・9Gビザ・13a・観光延長",
      en: "Philippines Visa & Relocation Complete Guide 2026 | SRRV, 9G Work Visa, 13a & Tourist Extensions",
      zh: "【2026年最新版】菲律宾签证与移居条件完全指南｜SRRV·9G就业签证·13a·旅游签证延期",
    },
    description: {
      ja: "SRRV退職者ビザ・9G就労ビザ・13aビザ・観光ビザ延長（最大36ヶ月）まで。フィリピンの主要ビザの種類・要件・費用を徹底解説。",
      en: "SRRV retirement visa, 9G work visa, 13a spouse visa, and tourist visa extensions (up to 36 months) — a complete guide to the Philippines' main visa options.",
      zh: "SRRV退休签证、9G就业签证、13a配偶签证及旅游签证延期（最长36个月）——全面解析菲律宾主要签证种类、要求与费用。",
    },
    content: {
      ja: `フィリピンは英語が公用語で、温暖な気候・安い生活コスト・日本人コミュニティの充実から、退職者・ファミリー・デジタルノマドを問わず幅広い移住者に人気の国です。マニラ・セブ島・ダバオが主な居住地となっています。

### 主なビザの種類

**SRRV（Special Resident Retiree's Visa）/ 退職者向け特別居住ビザ**
フィリピン退職庁（PRA）が管轄する、退職者に人気のビザです。
- **50歳以上（社会保険年金受給者）**：USD 10,000の定期預金
- **50歳以上（年金なし）**：USD 20,000の定期預金
- **50歳未満**：USD 20,000の定期預金
- 申請費用：USD 1,400（本人）+ 同伴家族1名あたりUSD 300
- 年会費：USD 360
- メリット：就労禁止（就労許可取得なし）・複数回出入国自由・税関免除特典あり
- ※2024年以降、PRAが審査体制を強化。以前より時間がかかるケースが増加

**9G ビザ（就労ビザ）**
フィリピン企業に雇用される外国人向けビザ。
- 雇用主がDOLE（労働雇用省）でAlien Employment Permit（AEP）を取得後、BI（移民局）に申請
- 有効期間：1年（更新可）
- 申請費用：PHP 8,620〜（政府手数料）+ 代理店費用
- AEP取得要件：フィリピン人で代替できない専門職または管理職であること

**13a ビザ（フィリピン市民の外国人配偶者）**
フィリピン国籍者と正式婚姻した外国人向けの移民ビザ。
- 最初の1年は条件付き永住権（ACR I-Card取得）
- 1年後に条件なし永住権へ変更申請
- 申請費用：PHP 8,620〜

**観光ビザ（9a）の延長制度**
フィリピンは世界でも珍しく、観光ビザを最大36ヶ月まで延長できます。
- 初回入国：最大30日（日本人は無料でVOA）
- 移民局での延長：1回あたり1〜2ヶ月ずつ延長可能、最大36ヶ月
- 費用：延長1回あたりPHP 3,000〜4,000程度
- ただし長期の観光ビザ滞在中は就労不可

**SVEP（Special Visa for Employment Generation）**
経済特区（PEZA・BOI認定企業）内で就労する外国人向けの特別ビザ。

**SIRV（Special Investor's Resident Visa）/ 投資家向け永住ビザ**
フィリピンへの投資を条件に取得できる永住権に相当するビザ。
- 最低投資額：USD 75,000以上（フィリピン証券取引委員会認定の企業株式等）
- PEZA・BOI等の認定事業への投資が対象
- 就労許可（AEP）なしでの就労が可能
- 管轄：フィリピン証券取引委員会（SEC）

**PEZA ビザ（経済区就労者）**
フィリピン経済区庁（PEZA）の認定企業・工場に就労する外国人向け特別査証。就労許可取得手続きが簡略化されており、IT・製造業で多く利用されている。

### 生活・税金について

**所得税**：フィリピンで就労すると0〜35%の累進課税。ただしPHREX（海外からの送金収入）の一部は非課税扱いが可能なケースあり。
**Alien Certificate of Registration（ACR I-Card）**：59日以上滞在する外国人全員が取得義務あり（費用PHP 2,000〜）。
**フィリピンの医療**：マニラ・セブの私立病院（Makati Medical Center・St. Luke's Medical Center等）は日本人にも対応しており、比較的高水準。地方に行くほど要注意。
**生活費**：マカティ・BGC（ボニファシオ・グローバル・シティ）周辺の外国人向けコンドミニアムは月PHP 30,000〜80,000程度。

### 費用の目安

| 項目 | 費用 |
|------|------|
| SRRV申請費（本人） | USD 1,400 |
| SRRV年会費 | USD 360/年 |
| 9Gビザ申請費 | PHP 8,620〜 |
| 13aビザ申請費 | PHP 8,620〜 |
| 観光ビザ延長（1回） | PHP 3,000〜4,000 |
| ACR I-Card | PHP 2,000〜 |
| SIRV申請費 | USD 1,000〜 |

### 移住前のチェックポイント

1. **外国人の土地所有制限**：外国人は土地を所有できない。コンドミニアムは外国人枠40%まで購入可能
2. **SRRV預金の引き出し**：定期預金として維持が必要。不動産購入に充当することも一定条件下で可能
3. **二重課税協定**：日本・フィリピン間に租税条約あり（一部の二重課税を回避可能）
4. **治安と地域差**：マカティ・BGC・セブITパーク周辺は安全性が高いが、地方ではセキュリティに注意
5. **デジタルノマド向け**：公式ビザなし。観光ビザ延長が事実上のノマド滞在手段だが就労は不可

フィリピンはSRRVリタイアメントビザが整備されており、退職後の移住先として日本人に特に人気です。英語での生活もしやすく、日本人学校がある都市も複数あります。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **SRRV（特別居住退職者ビザ）**: [フィリピン退職庁（PRA）公式ページ](https://pra.gov.ph/SRRVisa)
- **9(g) 就労ビザ**: [フィリピン入国管理局（BI）– 9(g) ビザ](https://immigration.gov.ph/pre-4-arranged-employment-visa-9g/)
- **入国管理局全般**: [フィリピン入国管理局（Bureau of Immigration）](https://immigration.gov.ph/)`,
      en: `The Philippines is an English-speaking country with a warm climate, affordable cost of living, and well-established Japanese expat communities. Manila, Cebu, and Davao are the most popular bases for foreigners.

### Main Visa Types

**SRRV (Special Resident Retiree's Visa)**
Managed by the Philippine Retirement Authority (PRA). One of the most accessible retirement visas in Asia.
- **50+ with pension**: USD 10,000 fixed deposit
- **50+ without pension**: USD 20,000 fixed deposit
- **Under 50**: USD 20,000 fixed deposit
- Application fee: USD 1,400 (primary applicant) + USD 300 per accompanying dependent
- Annual fee: USD 360
- Benefits: Multiple-entry privileges, customs duty exemptions, no employment authorization needed
- Note: PRA processing has been slower since tightened 2024 reviews

**9G Visa (Work Visa)**
For foreigners employed by Philippine companies.
- Employer must first obtain an Alien Employment Permit (AEP) from DOLE, then apply to the Bureau of Immigration (BI)
- Validity: 1 year (renewable)
- Application fee: PHP 8,620+ (government fees) + agent fees
- AEP requirement: Position must not be fillable by a qualified Filipino national

**13a Visa (Foreign Spouse of a Philippine Citizen)**
Immigrant visa for foreign nationals married to Philippine citizens.
- First year: Conditional permanent resident status (with ACR I-Card)
- After 1 year: Apply for conversion to unconditional permanent residency
- Application fee: PHP 8,620+

**Tourist Visa (9a) Extension System**
The Philippines offers one of the world's most flexible tourist visa extension systems — up to 36 months total.
- Initial visa-free stay: Up to 30 days (Japanese nationals free on arrival)
- Extensions: 1–2 months at a time at the Bureau of Immigration; max 36 months total
- Cost per extension: approx. PHP 3,000–4,000
- Important: No work permitted on tourist/tourist-extension status

**SVEP (Special Visa for Employment Generation)**
For foreigners working within PEZA or BOI-registered economic zone enterprises.

### Tax & Living Notes

**Income tax**: 0–35% progressive for Philippine-source income. Some foreign-earned income remitted via PHREX may qualify for partial exemption.
**ACR I-Card (Alien Certificate of Registration)**: Mandatory for all foreigners staying 59+ days (fee PHP 2,000+).
**Healthcare**: Private hospitals in Manila (Makati Medical Center, St. Luke's) and Cebu are Japan-friendly and relatively high standard. Quality declines in rural areas.
**Living costs**: Expat condominiums in Makati/BGC run PHP 30,000–80,000/month.

### Cost Summary

| Item | Cost |
|------|------|
| SRRV application (principal) | USD 1,400 |
| SRRV annual fee | USD 360/year |
| 9G visa application | PHP 8,620+ |
| 13a visa application | PHP 8,620+ |
| Tourist visa extension (per extension) | PHP 3,000–4,000 |
| ACR I-Card | PHP 2,000+ |

### Pre-Move Checklist

1. **Land ownership restriction**: Foreigners cannot own land; condominium units can be purchased within 40% foreign ownership cap
2. **SRRV deposit requirement**: Funds must remain in a fixed deposit account; can be used toward real estate under certain conditions
3. **Tax treaty**: Japan–Philippines tax treaty reduces some double taxation
4. **Safety and neighborhood choice**: Makati, BGC, and Cebu IT Park are generally safe; exercise caution outside major urban areas
5. **Digital nomads**: No official visa — tourist visa extensions are the de facto option, but work remains prohibited

The Philippines is especially popular among Japanese retirees thanks to the well-structured SRRV program, English as an official language, and the presence of Japanese schools in multiple cities.

---

### References

This article is based on the following official sources.

- **SRRV (Special Resident Retiree's Visa)**: [Philippines Retirement Authority (PRA) Official Page](https://pra.gov.ph/SRRVisa)
- **9(g) Work Visa**: [Bureau of Immigration (BI) – 9(g) Visa](https://immigration.gov.ph/pre-4-arranged-employment-visa-9g/)
- **General Immigration**: [Bureau of Immigration Philippines](https://immigration.gov.ph/)`,
      zh: `菲律宾以英语为官方语言，气候温暖，生活费低廉，日本人社区完善，对退休人员、家庭和数字游民均极具吸引力。马尼拉、宿务和达沃是外籍人士最常选择的居住地。

### 主要签证种类

**SRRV（特别居民退休人员签证）**
由菲律宾退休局（PRA）管辖，是亚洲最易获批的退休签证之一。
- **50岁以上（领取养老金者）**：USD 10,000定期存款
- **50岁以上（无养老金）**：USD 20,000定期存款
- **50岁以下**：USD 20,000定期存款
- 申请费用：USD 1,400（本人）+ 同行家属每人USD 300
- 年费：USD 360
- 特权：多次出入境、海关税收优惠，无需就业许可
- 注意：2024年起PRA审查趋严，办理周期较以往有所延长

**9G签证（就业签证）**
面向受雇于菲律宾企业的外国人。
- 雇主须先向劳动就业部（DOLE）取得外籍就业许可（AEP），再向移民局（BI）申请
- 有效期：1年（可续签）
- 申请费用：PHP 8,620起（政府费用）+ 代理费用
- AEP要求：所申请职位须是菲律宾本地人才无法胜任的专业或管理岗位

**13a签证（菲律宾公民的外籍配偶）**
外籍人士与菲律宾公民正式结婚后可申请的移民签证。
- 首年：附条件永久居留（需持有ACR I-Card）
- 1年后：可申请转为无条件永久居留
- 申请费用：PHP 8,620起

**旅游签证（9a）延期制度**
菲律宾旅游签证延期制度全球少见——最长可延至36个月。
- 初次免签入境：最长30天（日本人免签落地）
- 移民局延期：每次延1〜2个月，总计最长36个月
- 每次延期费用：约PHP 3,000〜4,000
- 重要提示：旅游签证及延期期间严禁从事任何工作

**SVEP（就业促进特别签证）**
在PEZA或BOI认定的经济特区企业就职的外国人可申请。

### 税务与生活须知

**所得税**：菲律宾来源收入适用0%〜35%累进税率，部分通过PHREX渠道汇入的境外所得可享受一定豁免。
**外国人登记证（ACR I-Card）**：在菲停留超过59天的外国人均须办理（费用PHP 2,000起）。
**医疗水平**：马尼拉（Makati Medical Center、St. Luke's等）和宿务的私立医院水准较高，部分可提供日语服务；农村地区医疗条件较差。
**生活费**：马卡提/BGC（博尼法西奥环球城）一带的外籍公寓月租约PHP 30,000〜80,000。

### 费用参考

| 项目 | 费用 |
|------|------|
| SRRV申请费（本人） | USD 1,400 |
| SRRV年费 | USD 360/年 |
| 9G签证申请费 | PHP 8,620起 |
| 13a签证申请费 | PHP 8,620起 |
| 旅游签证延期（每次） | PHP 3,000〜4,000 |
| 外国人登记证（ACR I-Card） | PHP 2,000起 |

### 移居前注意事项

1. **外国人土地所有限制**：外国人不得拥有土地，可购买公寓（外籍持有比例上限40%）
2. **SRRV存款要求**：资金须保留在定期存款账户内，满足条件后可用于购买房产
3. **避免双重征税**：日本与菲律宾之间签有租税协定，可规避部分双重征税
4. **治安与选址**：马卡提、BGC、宿务IT园区附近安全性较高，远郊地区需注意安全
5. **数字游民**：无官方专属签证，旅游签证延期是实际可用的长期居留方式，但严禁从事工作

菲律宾凭借完善的SRRV退休签证制度、官方英语环境以及多个城市设有日本人学校等优势，是日本退休人员移居的热门之选。

---

### 参考资料

本文信息基于以下官方资料整理。

- **SRRV（特别居住退休签证）**: [菲律宾退休局（PRA）官方页面](https://pra.gov.ph/SRRVisa)
- **9(g) 工作签证**: [菲律宾移民局（BI）– 9(g) 签证](https://immigration.gov.ph/pre-4-arranged-employment-visa-9g/)
- **移民局总览**: [菲律宾移民局（Bureau of Immigration）](https://immigration.gov.ph/)`,
    },
  },
  {
    slug: "visa-vn",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-vn.webp",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】ベトナムのビザ・就労許可完全ガイド｜就労許可証・E-Visa・一時居留証",
      en: "Vietnam Visa & Work Permit Complete Guide 2026 | Work Permit, E-Visa & TRC",
      zh: "【2026年最新版】越南签证与工作许可完全指南｜工作许可证·电子签证·临时居留证",
    },
    description: {
      ja: "就労許可証（2025年Decree改定）・E-Visa（90日）・一時居留証（TRC）・税務居住者認定まで。ベトナムの主要ビザの種類・要件・費用を徹底解説。",
      en: "Work permits (2025 Decree update), E-Visa (90 days), Temporary Residence Card (TRC), and tax residency — a complete guide to Vietnam's main visa types.",
      zh: "工作许可证（2025年法令更新）、电子签证（90天）、临时居留证（TRC）及税务居民认定——全面解析越南主要签证种类、要求与费用。",
    },
    content: {
      ja: `ベトナムはホーチミン市・ハノイを中心に急速な経済成長を続けており、製造業・IT・サービス業など多様な就労機会があります。日系企業の進出が多く、日本人移住者が増加。また2023年からの観光ビザ緩和でデジタルノマドにも人気の国になっています。

### 主なビザの種類

**就労許可証（Work Permit / Giấy phép lao động）**
ベトナムで働くほぼすべての外国人に必要な許可証。雇用主が労働傷病兵社会省（MOLISA）に申請。
- 有効期間：最大2年（更新可）
- 申請費用：VND 600,000〜
- 取得に必要な書類（Expertカテゴリーの場合）：
  - 学位証明書（認証・翻訳済み）
  - 犯罪経歴証明書（発行から6ヶ月以内）
  - 健康診断書
  - 2年以上の職歴証明 ※2025年8月施行のDecree 219/2025/ND-CPにより3年から2年に短縮
  - 雇用契約書または内定通知書

**就労許可証の免除対象**
以下に該当する場合は就労許可証が不要：
- 外資企業の法定代表者（Directors）
- 90日以内の短期業務（会議・研修等）
- 特定の外交・政府関係者

**一時居留証（TRC：Temporary Residence Card / Thẻ tạm trú）**
就労許可証取得後に申請する居住許可証。取得すると毎回の入国ビザが不要になります。
- 有効期間：1〜2年（就労許可証の有効期間に連動）
- 申請費用：USD 20〜
- TRCがあれば銀行口座開設・不動産賃貸などがスムーズに進む

**電子ビザ（E-Visa / eVisa）**
2023年8月から90日間・シングル入国の電子ビザ（旧60日から延長）。
- 観光・短期商用向け。就労は一切不可
- 費用：USD 25（政府サイトで申請）
- 日本人は45日間のビザ免除も利用可能（2023年8月より延長）

**投資家向けビザ**
ベトナムに一定額以上の投資を行う外国人向けの長期ビザ（詳細は投資登録後に当局へ確認）。

### 生活・税金について

**所得税（PIT）**
ベトナムに年183日以上滞在すると税務上の居住者となり、ベトナム国内外の所得が課税対象。
- 税率：5〜35%（累進課税）
- 日本とベトナムの間には租税条約あり（二重課税の一部を回避可能）
- 非居住者の場合：ベトナム国内源泉所得に対して20%の一律課税

**社会保険**
外国人労働者は原則として社会保険・医療保険・失業保険への加入が義務（雇用主と折半）。保険料率：従業員負担約10.5%、雇用主負担約21.5%（月額上限あり）。

**住居費**：ホーチミン市の外国人向けコンドミニアム（District 2/Thu Duc・District 7）は月USD 800〜2,000程度。ハノイは同等かやや低め。

### 費用の目安

| 項目 | 費用 |
|------|------|
| 就労許可証申請費 | VND 600,000〜 |
| 一時居留証発行費 | USD 20〜 |
| E-Visa費用 | USD 25 |
| ビザ免除（日本人） | 無料（45日） |

### 移住前のチェックポイント

1. **Decree 219/2025の改定**：Expert カテゴリーの就労経験要件が3年から2年に短縮（2025年8月施行）。より申請しやすくなった
2. **書類の認証**：学位証明・犯罪経歴証明は日本の外務省による公証＋ベトナム大使館での認証が必要
3. **銀行口座の開設**：TRCがあると大幅に手続きがスムーズ。ない場合はパスポートとビザのみで対応してくれる銀行を選ぶ
4. **税務居住者の範囲**：183日以上滞在で国内外所得が課税対象になる点に注意
5. **日本語人材の需要**：日系企業が多いため、日本語能力があれば就職のハードルが大幅に下がる

ベトナムは若い人口・旺盛な経済成長・日系企業の多さが魅力で、IT・製造業・日本語教師などでの就労機会が特に豊富な移住先です。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **出入国管理・在留許可全般**: [ベトナム公安省 出入国管理局](https://immigration.gov.vn/)
- **電子ビザ（e-Visa）**: [ベトナム公式電子ビザ申請ポータル](https://evisa.gov.vn/)
- **一時居住証（TRC）申請手続き**: [出入国管理局 – TRC 手続き詳細](https://xuatnhapcanh.gov.vn/en/tin-tuc/procedures-temporary-residence-cards-foreigners-vietnam-immigration-department-ministry)`,
      en: `Vietnam is experiencing rapid economic growth centered on Ho Chi Minh City (HCMC) and Hanoi, with diverse opportunities in manufacturing, IT, and services. A large Japanese corporate presence and a relaxed 2023 visa policy have made it increasingly popular with both working professionals and digital nomads.

### Main Visa Types

**Work Permit (Giấy phép lao động)**
Required for almost all foreigners working in Vietnam. Employers apply to the Ministry of Labour, Invalids and Social Affairs (MOLISA).
- Validity: Up to 2 years (renewable)
- Application fee: VND 600,000+
- Required documents (Expert category):
  - Authenticated and translated degree certificate
  - Criminal record certificate (issued within 6 months)
  - Medical certificate
  - Proof of 2+ years' work experience *(reduced from 3 years under Decree 219/2025/ND-CP, effective August 2025)*
  - Employment contract or offer letter

**Work Permit Exemptions**
The following are exempt from work permit requirements:
- Legal representatives of foreign-invested enterprises
- Short-term assignments under 90 days (meetings, training, etc.)
- Certain diplomatic/government personnel

**TRC (Temporary Residence Card / Thẻ tạm trú)**
Applied after obtaining a work permit. Eliminates the need for a visa on every entry.
- Validity: 1–2 years (linked to work permit)
- Application fee: USD 20+
- A TRC greatly simplifies bank account opening, lease agreements, and other admin tasks

**E-Visa (eVisa)**
Since August 2023, single-entry E-Visas allow 90-day stays (extended from 60 days).
- Tourism and short-term business use only — no employment
- Fee: USD 25 (via official government portal)
- Japanese nationals also qualify for a 45-day visa-free stay (extended since August 2023)

**Investor Visa**
Long-term visa available for foreigners making qualifying investments in Vietnam (confirm requirements with the Investment Registration Certificate process).

### Tax & Living Notes

**Personal Income Tax (PIT)**
183+ days in Vietnam per year = tax resident, subject to tax on worldwide income.
- Progressive rates: 5–35%
- Japan–Vietnam tax treaty available to reduce some double taxation
- Non-residents: Flat 20% on Vietnamese-source income

**Social Insurance**
Foreign workers are generally required to contribute to social insurance, health insurance, and unemployment insurance. Employee contribution: ~10.5% of salary; employer: ~21.5% (subject to monthly caps).

**Housing**: Expat condominiums in HCMC (District 2/Thu Duc, District 7) run USD 800–2,000/month. Hanoi is similar or slightly lower.

### Cost Summary

| Item | Cost |
|------|------|
| Work permit application | VND 600,000+ |
| TRC issuance fee | USD 20+ |
| E-Visa fee | USD 25 |
| Visa-free stay (Japanese nationals) | Free (45 days) |

### Pre-Move Checklist

1. **Decree 219/2025 update**: Expert category work experience requirement reduced from 3 to 2 years (effective August 2025) — applications now more accessible
2. **Document authentication**: Degree certificates and criminal records require Japanese MOFA apostille + authentication at the Vietnamese embassy
3. **Bank account setup**: A TRC makes opening a bank account much smoother; without one, choose banks that accept passport + visa only
4. **Tax residency**: 183+ days triggers worldwide income taxation — plan your stay timing accordingly
5. **Japanese language demand**: Large Japanese corporate presence means Japanese speakers have significantly better employment prospects

Vietnam's young population, rapid growth, and high demand for Japanese-language professionals in IT, manufacturing, and education make it one of the most practical relocation destinations in Southeast Asia.

---

### References

This article is based on the following official sources.

- **Immigration & Residence General**: [Vietnam Immigration Department (Ministry of Public Security)](https://immigration.gov.vn/)
- **e-Visa**: [Vietnam Official e-Visa Portal](https://evisa.gov.vn/)
- **Temporary Residence Card (TRC)**: [Immigration Dept – TRC Application Procedures](https://xuatnhapcanh.gov.vn/en/tin-tuc/procedures-temporary-residence-cards-foreigners-vietnam-immigration-department-ministry)`,
      zh: `越南以胡志明市和河内为中心持续快速发展，制造业、IT和服务业提供了多样的就业机会。大量日资企业进驻以及2023年签证政策放宽，使其对职场人士和数字游民的吸引力不断提升。

### 主要签证种类

**工作许可证（Giấy phép lao động）**
几乎所有在越工作的外国人均须持有此许可证，由雇主向劳动荣军社会部（MOLISA）申请。
- 有效期：最长2年（可续签）
- 申请费用：VND 600,000起
- 所需文件（专家类别）：
  - 经认证翻译的学历证明
  - 无犯罪记录证明（6个月内出具）
  - 健康证明
  - 2年以上工作经历证明 ※依据2025年8月施行的Decree 219/2025/ND-CP，由3年缩短至2年
  - 劳动合同或录用通知书

**工作许可证豁免情况**
以下情况无需申请工作许可证：
- 外资企业的法定代表人
- 90天以内的短期业务（会议、培训等）
- 特定外交及政府人员

**临时居留证（TRC / Thẻ tạm trú）**
取得工作许可证后申请的居留许可，持有后每次入境无需再申请签证。
- 有效期：1〜2年（与工作许可证有效期挂钩）
- 申请费用：USD 20起
- 持有TRC可大幅简化银行开户、租房等手续

**电子签证（eVisa）**
2023年8月起，电子签证有效期延长至90天（原为60天），单次入境。
- 仅限旅游及短期商务，严禁从事任何工作
- 费用：USD 25（通过官方政府网站申请）
- 日本人还可享受45天免签待遇（2023年8月起延长）

**投资者签证**
面向在越南进行符合条件投资的外国人的长期签证（具体要求请在完成投资登记证书流程后向有关部门确认）。

### 税务与生活须知

**个人所得税（PIT）**
在越居留183天以上即被认定为税务居民，需就全球所得缴纳越南个人所得税。
- 累进税率：5%〜35%
- 日本与越南签有税务协定，可避免部分双重征税
- 非税务居民：越南境内来源所得按20%统一征税

**社会保险**
外籍劳工通常须参加社会保险、医疗保险和失业保险。员工缴纳比例约10.5%，雇主约21.5%（月缴上限以实际规定为准）。

**住房成本**：胡志明市面向外籍人士的公寓（第2区/守德区、第7区等）月租约USD 800〜2,000；河内略低或相当。

### 费用参考

| 项目 | 费用 |
|------|------|
| 工作许可证申请费 | VND 600,000起 |
| 临时居留证签发费 | USD 20起 |
| 电子签证费 | USD 25 |
| 免签入境（日本人） | 免费（45天） |

### 移居前注意事项

1. **Decree 219/2025更新**：专家类别工作经历要求由3年缩短至2年（2025年8月起生效），申请门槛降低
2. **文件认证**：学历证明和无犯罪记录证明须经日本外务省认证，并在越南大使馆办理确认手续
3. **银行开户**：持有TRC可大幅简化开户流程；无TRC时需选择仅凭护照和签证即可开户的银行
4. **税务居民判断**：在越居留超过183天将触发全球收入纳税义务，需合理规划停留时间
5. **日语人才需求旺盛**：日资企业众多，具备日语能力者就业门槛显著降低

越南年轻的人口结构、旺盛的经济活力以及对IT、制造业和日语人才的高度需求，使其成为东南亚最具吸引力的移居目的地之一。

---

### 参考资料

本文信息基于以下官方资料整理。

- **出入境管理及居留证总览**: [越南公安部 出入境管理局](https://immigration.gov.vn/)
- **电子签证（e-Visa）**: [越南官方电子签证申请门户](https://evisa.gov.vn/)
- **临时居留证（TRC）申请手续**: [出入境管理局 – TRC 手续详情](https://xuatnhapcanh.gov.vn/en/tin-tuc/procedures-temporary-residence-cards-foreigners-vietnam-immigration-department-ministry)`,
    },
  },
  {
    slug: "visa-us",
    category: "visa",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-us.webp",
    date: "2026-03-19",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】アメリカのビザ・就労許可完全ガイド｜H-1B・L-1・O-1・グリーンカード",
      en: "United States Visa & Work Authorization Complete Guide 2026 | H-1B, L-1, O-1 & Green Card",
      zh: "【2026年最新版】美国签证与工作授权完全指南｜H-1B·L-1·O-1·绿卡",
    },
    description: {
      ja: "H-1B（抽選・費用）・L-1・O-1・EB-5投資家ビザ・就労グリーンカードまで。アメリカの主要ビザの種類・要件・費用を徹底解説。",
      en: "H-1B lottery and fees, L-1, O-1, EB-5 investor visa, and employment-based green cards — a complete guide to U.S. visa types, requirements, and costs.",
      zh: "H-1B（抽签与费用）、L-1、O-1、EB-5投资者签证及就业类绿卡——全面解析美国主要签证种类、要求与费用。",
    },
    content: {
      ja: `アメリカは世界最大の経済大国であり、IT・金融・医療・アカデミアなど多くの分野でトップクラスのキャリア機会があります。ただし、就労ビザの取得競争は激しく、移民プロセスも複雑です。

### あなたに合ったビザは？

| あなたの状況 | おすすめのビザ |
|------------|-------------|
| アメリカ企業に専門職として就労（抽選あり） | H-1B（専門職ビザ） |
| 日系企業からの転勤（抽選なし） | L-1（企業内転勤ビザ） |
| 科学・芸術・スポーツで国際的な実績あり | O-1（卓越能力ビザ） |
| アメリカでビジネス投資・起業 | E-2（条約投資家ビザ） |
| 研究者・医師・国益になる分野の専門家 | EB-2 NIW（雇用主不要で永住権申請可） |
| 大規模投資で永住権を取得したい | EB-5（投資家グリーンカード） |

### 主な就労ビザの種類

**H-1B（専門職ビザ）** ｜ [USCIS 公式ページ](https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations)
最も一般的なアメリカの就労ビザ。学士以上の学位を必要とする専門職向け。
- 毎年3月に登録受付（抽選）→ 4月以降申請（65,000件 + 修士号保持者向け20,000件）
- 有効期間：3年（最大6年、EB取得を待つ場合は無期限延長可能）
- 申請費（雇用主負担、2024年4月改定後）：
  - I-129基本料：USD 780
  - 詐欺防止料：USD 500
  - ACWIA訓練費：USD 1,500（大企業）/ USD 750（中小企業）
  - 登録料：USD 215
  - プレミアム処理（任意）：USD 2,965（15営業日以内に処理）
  - 合計目安：USD 1,700〜5,800（プレミアム処理含まず）

**L-1（企業内転勤ビザ）** ｜ [USCIS 公式ページ](https://www.uscis.gov/working-in-the-united-states/temporary-workers/l-1a-intracompany-transferee-executive-or-manager)
日本など海外の関連会社からアメリカへ転勤する管理職・専門職向け。抽選なし。
- L-1A（管理職・幹部）：最大7年（継続して管理職の場合、グリーンカード（EB-1C）へのルートあり）
- L-1B（専門的知識を持つ社員）：最大5年

**O-1（卓越した能力を持つ外国人）** ｜ [USCIS 公式ページ](https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement)
科学・芸術・教育・ビジネス・スポーツの分野で国際的に認められた実績を持つ人向け。抽選なし。
- O-1A：科学・教育・ビジネス・スポーツ
- O-1B：芸術・映画・テレビ

**E-2（条約投資家ビザ）** ｜ [USCIS 公式ページ](https://www.uscis.gov/working-in-the-united-states/temporary-workers/e-2-treaty-investors)
日本とアメリカ間の投資条約に基づくビザ。アメリカのビジネスに相当額を投資する起業家・経営者向け。永住権ではないが更新可能。

**EB-5（投資家グリーンカード）** ｜ [USCIS 公式ページ](https://www.uscis.gov/working-in-the-united-states/permanent-workers/eb-5-immigrant-investor-program)
アメリカへの投資により永住権を取得するプログラム。
- TEA（農村地域・高失業率地域）：USD 800,000以上の投資 + 10名以上の雇用創出
- 一般地域：USD 1,050,000以上の投資 + 10名以上の雇用創出

**EB-1/EB-2/EB-3（就労グリーンカード）** ｜ [USCIS – 就労グリーンカード](https://www.uscis.gov/green-card/green-card-eligibility/green-card-through-a-job)
永住権（グリーンカード）の就労カテゴリ。
- **EB-1**：卓越した人材（EB-1A）・優秀な研究者（EB-1B）・多国籍企業管理職（EB-1C）
- **EB-2 NIW（国益免除）**：EB-2のうち、アメリカの国益になる分野の研究者・専門家。雇用主なしで申請可能
- **EB-3**：専門職・熟練労働者・非熟練労働者
- 処理期間は出身国・カテゴリーによって大きく異なる（日本人は比較的早い）

**グリーンカード抽選（DV Lottery）**
毎年約5万名に永住権を抽選付与。日本は抽選対象国に含まれていないため、**日本国籍者は参加不可**。

### 生活・税金について

**所得税**：連邦税（10〜37%）+ 州税（0〜13.3%）+ 地方税の多層構造。
- テキサス・フロリダ・ネバダ等は州所得税なし
- カリフォルニア・ニューヨーク等は合計税率40%以上になることも

**医療保険**：雇用主が提供する場合が多いが、保険料の自己負担分も大きい（月USD 200〜500程度）。失業時は COBRA延長（高額）またはACA市場プランへの切り替えが必要。

**住居費**：サンフランシスコ・ニューヨークは世界最高水準。1LDKで月USD 2,500〜5,000以上も珍しくない。

### 費用の目安

| 項目 | 費用 |
|------|------|
| H-1B申請費（雇用主） | USD 1,700〜5,800（2024年4月改定後） |
| H-1Bプレミアム処理 | USD 2,965（任意） |
| L-1申請費 | USD 1,385〜（政府手数料） |
| O-1申請費 | USD 460〜 |
| グリーンカード申請費 | USD 1,225〜 |
| EB-5投資額（TEA） | USD 800,000以上 |

### 移住前のチェックポイント

1. **H-1Bの抽選リスク**：直近の倍率は2〜3倍程度（近年の登録数減少により）。それでも落選リスクは高い
2. **L-1の有力活用**：日系企業からの転勤であればL-1が現実的な選択肢。H-1Bの抽選リスクを回避できる
3. **EB-2 NIWの人気**：研究者・エンジニア・医師等は雇用主不要のNIW申請が増加中
4. **州選びの重要性**：テキサスやフロリダは州所得税なしで、同じ年収でも手取りが大幅に増える
5. **医療費の高さ**：保険なしの場合、救急外来1回で数十万円になることも。保険の確認は必須

アメリカは収入ポテンシャルが極めて高い反面、税負担・医療費・住居費も世界有数の高さです。MoveWorthで収入・税金・生活費を総合的にシミュレーションしてから検討することを強くお勧めします。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **H-1B 専門職ビザ**: [USCIS – H-1B 公式ページ](https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations)
- **L-1 駐在員ビザ（企業内転勤）**: [USCIS – L-1A/L-1B ビザ](https://www.uscis.gov/working-in-the-united-states/temporary-workers/l-1a-intracompany-transferee-executive-or-manager)
- **O-1 卓越能力ビザ**: [USCIS – O-1 ビザ](https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement)
- **EB-2 NIW（国家利益免除）**: [USCIS – EB-2 第二優先移民ビザ](https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-second-preference-eb-2)
- **EB-5 投資家ビザ**: [USCIS – EB-5 移民投資家プログラム](https://www.uscis.gov/working-in-the-united-states/permanent-workers/eb-5-immigrant-investor-program)
- **グリーンカード（永住権）全般**: [USCIS – グリーンカード申請情報](https://www.uscis.gov/green-card)
- **ビザ申請オンラインポータル**: [USCIS – myUSCIS アカウント](https://my.uscis.gov/)`,
      en: `The United States is the world's largest economy, offering top-tier career opportunities in tech, finance, healthcare, and academia. However, work visa competition is fierce and the immigration process is complex.

### Main Work Visa Types

**H-1B (Specialty Occupation Visa)**
The most common U.S. work visa for specialty occupations requiring a bachelor's degree or higher.
- Annual registration opens in March (lottery draw); filing from April (65,000 cap + 20,000 for U.S. master's holders)
- Validity: 3 years (up to 6 years; unlimited extensions while pursuing green card)
- Application fees (paid by employer, revised April 2024):
  - I-129 base fee: USD 780
  - Fraud prevention fee: USD 500
  - ACWIA training fee: USD 1,500 (large employers) / USD 750 (small employers)
  - Registration fee: USD 215
  - Premium processing (optional): USD 2,965 (15 business days)
  - Estimated total: USD 1,700–5,800 (excluding premium processing)

**L-1 (Intracompany Transferee)**
For managers, executives, and specialized knowledge workers transferring from a foreign affiliate (e.g., Japan). No lottery.
- L-1A (managers/executives): Up to 7 years; direct path to EB-1C green card available
- L-1B (specialized knowledge): Up to 5 years

**O-1 (Extraordinary Ability)**
For individuals with internationally recognized achievements in science, arts, education, business, or athletics. No lottery.
- O-1A: Science, education, business, athletics
- O-1B: Arts, film, television

**E-2 (Treaty Investor Visa)**
Based on the U.S.–Japan investment treaty. For entrepreneurs and business owners investing substantially in a U.S. business. Not a green card, but renewable indefinitely.

**EB-5 (Investor Green Card)**
Permanent residency via investment.
- TEA (rural/high-unemployment areas): USD 800,000+ investment + 10 jobs created
- General areas: USD 1,050,000+ investment + 10 jobs created

**EB-1/EB-2/EB-3 (Employment-Based Green Cards)**
- **EB-1**: Extraordinary ability (EB-1A), outstanding researchers (EB-1B), multinational executives (EB-1C)
- **EB-2 NIW (National Interest Waiver)**: No employer sponsor needed; popular with researchers, engineers, and doctors
- **EB-3**: Professionals, skilled workers, unskilled workers
- Processing times vary widely by country and category (Japanese nationals are typically in a favorable position)

**DV Lottery (Diversity Visa)**
~50,000 green cards via annual lottery. **Japan is not an eligible country — Japanese nationals cannot apply.**

### Tax & Living Notes

**Income tax**: Federal (10–37%) + state (0–13.3%) + local taxes.
- No state income tax: Texas, Florida, Nevada, and a few others
- California and New York: combined effective rates can exceed 40% for high earners

**Health insurance**: Usually employer-provided, but employee premiums run USD 200–500+/month. Unemployment means COBRA (expensive) or ACA marketplace plan.

**Housing**: San Francisco and New York are among the world's most expensive. A 1-bedroom in major tech hubs can run USD 2,500–5,000+/month.

### Cost Summary

| Item | Cost |
|------|------|
| H-1B filing fees (employer) | USD 1,700–5,800 (April 2024 schedule) |
| H-1B premium processing | USD 2,965 (optional) |
| L-1 filing fee | USD 1,385+ |
| O-1 filing fee | USD 460+ |
| Green card application fees | USD 1,225+ |
| EB-5 minimum investment (TEA) | USD 800,000+ |

### Pre-Move Checklist

1. **H-1B lottery odds**: Recent registration counts suggest roughly 2–3x oversubscription; still a meaningful risk each year
2. **L-1 as a strategic alternative**: If transferring from a Japanese company, L-1 avoids the H-1B lottery entirely — a major advantage
3. **EB-2 NIW growing popularity**: Researchers, engineers, and physicians increasingly use the NIW route (no employer required)
4. **State selection matters**: Texas and Florida have no state income tax — the same salary yields significantly higher take-home pay
5. **Healthcare costs**: Without insurance, a single ER visit can cost tens of thousands of dollars — confirm coverage before relocating

The U.S. offers extraordinary income potential, but taxes, healthcare costs, and housing are also among the world's highest. Use MoveWorth to simulate the full financial picture before committing.

---

### References

This article is based on the following official sources.

- **H-1B Specialty Occupation Visa**: [USCIS – H-1B Official Page](https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations)
- **EB-5 Investor Visa**: [USCIS – EB-5 Immigrant Investor Program](https://www.uscis.gov/working-in-the-united-states/permanent-workers/eb-5-immigrant-investor-program)
- **O-1 Extraordinary Ability Visa**: [USCIS – O-1 Visa](https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement)`,
      zh: `美国是全球最大的经济体，在科技、金融、医疗和学术等领域提供顶尖职业机会。然而，就业签证竞争激烈，移民流程复杂。

### 主要就业签证种类

**H-1B（专业工作签证）**
美国最常见的就业签证，适用于需要本科以上学历的专业岗位。
- 每年3月开放注册（抽签），4月起提交申请（65,000个名额 + 美国硕士持有者20,000个名额）
- 有效期：3年（最长6年；等待绿卡期间可无限期延期）
- 申请费用（雇主承担，2024年4月修订后）：
  - I-129基本费：USD 780
  - 反欺诈费：USD 500
  - ACWIA培训费：USD 1,500（大企业）/ USD 750（中小企业）
  - 注册费：USD 215
  - 快速处理（可选）：USD 2,965（15个工作日内处理）
  - 合计约USD 1,700〜5,800（不含快速处理费）

**L-1（跨国公司内部调任签证）**
面向从海外（如日本）关联公司调任至美国的管理人员和专业技术人员，无需抽签。
- L-1A（管理人员/高管）：最长7年；可直接申请EB-1C绿卡
- L-1B（专业知识人员）：最长5年

**O-1（杰出能力签证）**
面向在科学、艺术、教育、商业或体育领域拥有国际公认成就的人士，无需抽签。
- O-1A：科学、教育、商业、体育
- O-1B：艺术、电影、电视

**E-2（条约投资者签证）**
基于美日投资条约，面向在美投资创业的企业主和经营者。非绿卡，但可无限续签。

**EB-5（投资者绿卡）**
通过投资获得永久居留权。
- TEA（农村/高失业率地区）：投资USD 800,000以上 + 创造10个就业岗位
- 一般地区：投资USD 1,050,000以上 + 创造10个就业岗位

**EB-1/EB-2/EB-3（就业类绿卡）**
- **EB-1**：杰出人才（EB-1A）、优秀研究人员（EB-1B）、跨国企业高管（EB-1C）
- **EB-2 NIW（国家利益豁免）**：无需雇主担保，在研究人员、工程师和医生中广受欢迎
- **EB-3**：专业人员、熟练工人、非熟练工人
- 处理时间因出生国和类别差异显著（日本人通常处于相对有利的位置）

**DV抽签（多样性签证）**
每年通过抽签发放约50,000张绿卡。**日本不属于合格国家，日本国籍人士无法参与。**

### 税务与生活须知

**所得税**：联邦税（10%〜37%）+ 州税（0%〜13.3%）+ 地方税多层结构。
- 德克萨斯、佛罗里达、内华达等州无州所得税
- 加利福尼亚和纽约高收入者综合税率可超40%

**医疗保险**：通常由雇主提供，但员工自付保费约USD 200〜500+/月。失业时须转为COBRA（费用高昂）或ACA市场计划。

**住房成本**：旧金山和纽约位居全球最贵之列，主要科技中心城市一居室月租可达USD 2,500〜5,000+。

### 费用参考

| 项目 | 费用 |
|------|------|
| H-1B申请费（雇主） | USD 1,700〜5,800（2024年4月费率） |
| H-1B快速处理费 | USD 2,965（可选） |
| L-1申请费 | USD 1,385起 |
| O-1申请费 | USD 460起 |
| 绿卡申请费 | USD 1,225起 |
| EB-5最低投资额（TEA地区） | USD 800,000以上 |

### 移居前注意事项

1. **H-1B抽签风险**：近年注册数量减少，竞争倍率约2〜3倍，但落选风险依然不可忽视
2. **L-1是战略性替代方案**：从日本公司调任可完全绕开H-1B抽签，是极大的优势
3. **EB-2 NIW日益普及**：研究人员、工程师、医生越来越多地通过NIW途径申请（无需雇主担保）
4. **州份选择至关重要**：德克萨斯和佛罗里达无州所得税，相同薪资下实际到手收入差异显著
5. **医疗费用高昂**：无保险情况下，一次急诊费用可达数万美元，移居前务必确认医保安排

美国收入潜力极高，但税负、医疗费和住房成本同样位居全球前列，强烈建议使用MoveWorth对收入、税金和生活费进行综合模拟后再做决定。

---

### 参考资料

本文信息基于以下官方资料整理。

- **H-1B 专业工作签证**: [USCIS – H-1B 官方页面](https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations)
- **EB-5 投资移民签证**: [USCIS – EB-5 移民投资项目](https://www.uscis.gov/working-in-the-united-states/permanent-workers/eb-5-immigrant-investor-program)
- **O-1 杰出人才签证**: [USCIS – O-1 签证](https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement)`,
    },
  },
  {
    slug: "visa-ca",
    category: "visa",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-ca.webp",
    date: "2026-03-25",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】カナダのビザ・移住条件完全ガイド｜Express Entry・PNP・ワーキングホリデー",
      en: "Canada Visa & Immigration Complete Guide 2026 | Express Entry, PNP & Working Holiday",
      zh: "【2026年最新版】加拿大签证与移民条件完全指南｜快速通道·省提名计划·打工度假",
    },
    description: {
      ja: "Express Entry（CRSスコア）・PNP・スタートアップビザ・ワーキングホリデー（IEC）・就労許可まで。カナダの主要な移民ビザの種類・要件・費用を徹底解説。",
      en: "Express Entry (CRS score), PNP, Start-Up Visa, Working Holiday (IEC), and work permits — a complete guide to Canada's main immigration pathways.",
      zh: "快速通道（CRS分数）、省提名计划、创业签证、打工度假（IEC）及工作许可——全面解析加拿大主要移民途径、要求与费用。",
    },
    content: {
      ja: `カナダは積極的な移民受け入れ政策を持つ国で、永住権（PR）取得のしやすさと高い生活水準から世界中から移民が集まっています。ただし2024〜2025年にかけて移民受け入れ数削減方針が打ち出されており、CRSスコアの動向を常にチェックすることが重要です。

### あなたに合ったルートは？

| あなたの状況 | おすすめのルート |
|------------|--------------|
| 海外から直接PR申請（英語力・職歴あり） | Express Entry（FSWプログラム） |
| カナダで1年以上就労経験あり | Express Entry（CECプログラム） |
| 特定の州に定住・就労したい | 州推薦プログラム（PNP） |
| スタートアップ・起業家 | スタートアップビザ |
| 18〜35歳・まずカナダを体験したい | ワーキングホリデー（IEC） |
| カナダ企業から雇用オファーあり | 就労許可（Work Permit） |

### 主な移住ルート

**エクスプレスエントリー（Express Entry）** ｜ [IRCC 公式ページ](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html)
熟練外国人労働者向けの連邦管轄の移民プログラム。3つのプログラムが対象。
- **Federal Skilled Worker（FSW）**：学歴・就労経験・語学力などでCRS（総合ランキングシステム）スコア算出。カナダでの就労経験不要。
- **Canadian Experience Class（CEC）**：カナダ国内での1年以上の就労経験が条件。
- **Federal Skilled Trades**：特定の技能職（電気工事士・溶接工等）対象。
- CRSスコアが高い順にITA（招待状）が発行される。最低スコアは変動する（近年は400〜500点台が目安）。

2023年以降、特定の職業・学歴・出身校に基づく「カテゴリーベースの選考」も導入。STEM系・ヘルスケア系・フランス語能力者が優遇される傾向あり。

**州推薦プログラム（PNP：Provincial Nominee Program）** ｜ [IRCC – PNP 公式ページ](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html)
各州・準州が独自の基準で移民を推薦する制度。
- エクスプレスエントリーと組み合わせることでCRSスコアに600点追加（事実上のPR確定）
- 各州が独自の優先職種・要件を持つ（例：オンタリオはITと医療系、BC州はテック系が人気）

**スタートアップビザ（Start-Up Visa）** ｜ [IRCC 公式ページ](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html)
カナダの認定インキュベーター・VC・エンジェル投資家の支援を受けた起業家向けの永住権ルート。
- 条件：認定支援者から推薦を受け、ビジネスを一定規模以上で運営すること
- 処理期間：申請積み残しにより2〜4年程度かかるケースも

**ワーキングホリデー（IEC / International Experience Canada）** ｜ [IRCC 公式ページ](https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec.html)
日本人向けのカナダ滞在・就労制度。
- 対象：18〜35歳の日本人
- 年間最大6,500名（2024年度）
- 有効期間：1年間
- 申請費用：CAD 272（要最新確認）
- 抽選制（毎年2〜3月頃に募集開始）

**就労許可（Work Permit）** ｜ [IRCC 公式ページ](https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit/temporary/eligibility.html)
カナダ企業に雇用される場合に取得。
- **LMIA（労働市場影響評価）が必要なケース**：雇用主がカナダ人を採用できなかったことを証明する必要あり
- **LMIA不要のケース**：日本・カナダFTA（CUSMA）に基づく企業内転勤（ICT）・LMIA免除職種等

### 生活・税金について

**所得税**：連邦税（15〜33%）+ 州税（約5〜17%）の二層構造。
- ケベック州は独自の州税申告が必要（他州より手続きが複雑）
- 主な都市の実効税率目安：トロント（オンタリオ州）約40〜48%（高収入帯）、バンクーバー（BC州）も同水準

**社会保険（CPP + EI）**：従業員はカナダ年金（CPP）および雇用保険（EI）に加入義務。
**医療**：州政府の公的医療保険（OHIP等）が充実。ただし待ち時間の長さが課題。
**住居費**：バンクーバーとトロントは世界有数の高水準（1LDKで月CAD 2,000〜3,500程度）。カルガリーやエドモントン等の内陸都市は比較的安い。

### 費用の目安

| 項目 | 費用 |
|------|------|
| Express Entry（PR）申請費 | CAD 1,525（本人）+ CAD 1,525（配偶者）+ CAD 270（子） |
| 右永住権カード（PR Card） | CAD 50 |
| ワーキングホリデー（IEC）申請費 | CAD 272（要最新確認） |
| 就労許可申請費 | CAD 155 |

### 移住前のチェックポイント

1. **CRSスコアの把握と対策**：英語（IELTS）スコアがCRSに大きく影響。CLB 9以上（IELTS 7.5相当）を目指すと有利
2. **2025年の移民削減方針**：カナダ政府は2025〜2026年の移民受け入れ数を削減する方針を発表。永住権取得の難易度が上がる可能性あり
3. **州選びの重要性**：バンクーバーとトロントは住居費が高い。アルバータ州は州所得税なし（2025年現在）でコストパフォーマンスが高い
4. **フランス語の優遇**：カテゴリーベース選考でフランス語能力者が優先されている。ケベック州への移住を視野に入れる場合は特に有利
5. **ワーキングホリデーからのPRルート**：WHVでカナダ就労経験を積みCECに切り替えるルートが最も現実的な永住権取得パスの一つ

カナダは移民制度の透明性が高く、英語力と就労経験があれば永住権取得が比較的現実的な国です。MoveWorthで生活費・税金を詳しくシミュレーションしながら最適な移住タイミングを検討してください。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **Express Entry（永住権申請）**: [IRCC – Express Entry 公式ページ](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html)
- **カテゴリーベース選考ラウンド**: [IRCC – カテゴリー別選考](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html)
- **スタートアップビザ**: [IRCC – Start-up Visa プログラム](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html)
- **一時就労許可**: [IRCC – 就労許可 資格要件](https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit/temporary/eligibility.html)
- **ワーキングホリデー（IEC）**: [IRCC – 国際経験カナダ（IEC）](https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec.html)
- **IRCC オンライン申請ポータル**: [IRCC – アカウントログイン](https://www.canada.ca/en/immigration-refugees-citizenship/services/application/account.html)`,
      en: `Canada's active immigration policy and high standard of living attract immigrants from around the world. However, the government announced reductions in immigration targets for 2025–2026, so monitoring CRS cutoff scores is more important than ever.

### Main Immigration Routes

**Express Entry**
Federal immigration management system for skilled foreign workers, covering 3 programs:
- **Federal Skilled Worker (FSW)**: CRS score based on education, work experience, language ability. Canadian experience not required.
- **Canadian Experience Class (CEC)**: Requires 1+ year of Canadian work experience.
- **Federal Skilled Trades**: For specific trades (electricians, welders, etc.).
- Invitations are issued by CRS score (higher = faster). Recent cutoffs have ranged 400–500+.

Since 2023, **category-based selections** have been introduced — STEM, healthcare, and French-speaking candidates receive priority draws outside the general pool.

**Provincial Nominee Program (PNP)**
Each province/territory nominates immigrants based on its own criteria.
- Combined with Express Entry: Nomination adds 600 CRS points (effectively guarantees an ITA)
- Each province prioritizes different occupations (e.g., Ontario: IT and healthcare; BC: tech sector)

**Start-Up Visa**
Permanent residency route for entrepreneurs supported by designated Canadian incubators, VCs, or angel investors.
- Requires a letter of support from a designated organization
- Processing times: 2–4 years due to application backlog

**Working Holiday (IEC)**
Japanese citizens aged 18–35 can live and work in Canada for 1 year.
- Annual cap: up to 6,500 spots (2024)
- Application fee: CAD 272 (verify latest on IRCC website)
- Applications open via draw (typically February–March each year)

**Work Permit**
Required for those employed by Canadian companies.
- **LMIA required**: Employer must prove no qualified Canadian was available
- **LMIA-exempt**: Intracompany transfers under CUSMA (former NAFTA), certain LMIA-exempt categories

### Tax & Living Notes

**Income tax**: Federal (15–33%) + provincial (approx. 5–17%) two-tier structure.
- Quebec has its own provincial tax return — more complex than other provinces
- Effective rate in major cities (Toronto/Vancouver): typically 40–48% for high earners

**Social insurance (CPP + EI)**: Employees contribute to Canada Pension Plan (CPP) and Employment Insurance (EI).
**Healthcare**: Provincial public health insurance (e.g., OHIP in Ontario) provides broad coverage; long wait times are a noted challenge.
**Housing**: Vancouver and Toronto are among the world's most expensive (1-bedroom approx. CAD 2,000–3,500/month). Calgary and Edmonton are significantly more affordable.

### Cost Summary

| Item | Cost |
|------|------|
| Express Entry (PR) application | CAD 1,525 (principal) + CAD 1,525 (spouse) + CAD 270 (child) |
| PR Card | CAD 50 |
| Working Holiday (IEC) fee | CAD 272 (verify on IRCC) |
| Work permit application | CAD 155 |

### Pre-Move Checklist

1. **CRS score strategy**: IELTS CLB 9+ (equivalent to IELTS 7.5) significantly boosts CRS — English preparation is crucial
2. **2025 immigration reduction policy**: Canada has announced lower targets for 2025–2026; getting PR may become more competitive
3. **Province selection**: Vancouver and Toronto are expensive; Alberta has no provincial income tax (as of 2025), making it cost-effective
4. **French language advantage**: Category-based draws increasingly favor French speakers — worth considering for Quebec-bound applicants
5. **Working Holiday → PR pathway**: Gaining Canadian experience via WHV then switching to CEC is one of the most practical paths to permanent residency

Canada's transparent immigration system rewards English proficiency and work experience. Use MoveWorth to simulate living costs and taxes as you plan your ideal timing.

---

### References

This article is based on the following official sources.

- **Express Entry**: [IRCC – Express Entry Official Page](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html)
- **Category-Based Selection**: [IRCC – Category-Based Rounds](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html)
- **Start-up Visa**: [IRCC – Start-up Visa Program](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html)
- **Work Permit**: [IRCC – Temporary Work Permit Eligibility](https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit/temporary/eligibility.html)`,
      zh: `加拿大移民政策积极开放，以相对便捷的永久居留路径和高水准的生活质量吸引全球移民。但政府已宣布将在2025〜2026年削减移民接收目标，密切关注CRS分数线的动态尤为重要。

### 主要移民途径

**快速通道（Express Entry）**
面向技术型外籍劳工的联邦移民管理系统，涵盖3个项目：
- **联邦技术工人计划（FSW）**：根据学历、工作经验、语言能力等计算CRS综合排名分数，无需具备加拿大工作经验。
- **加拿大经验类（CEC）**：须具备加拿大境内1年以上工作经验。
- **联邦技工类（Federal Skilled Trades）**：面向特定技能职业（电工、焊工等）。
- 按CRS分数由高到低发放邀请函（ITA）；近年最低分数线约在400〜500分以上。

2023年起引入**类别专项抽签**，STEM、医疗保健及法语能力持有者可享受优先选拔。

**省提名计划（PNP）**
各省及领地依据自身标准提名移民。
- 与快速通道结合：省提名为CRS额外加600分（基本等同于确保获得邀请函）
- 各省优先职种不同（例：安大略省：IT和医疗；不列颠哥伦比亚省：科技行业）

**创业签证（Start-Up Visa）**
面向获得加拿大认可孵化器、风险投资机构或天使投资人支持的创业者，可直接获得永久居留权。
- 要求：获得认可支持机构的推荐信
- 办理周期：因积压申请较多，通常需2〜4年

**打工度假（IEC / 国际经历加拿大）**
面向18〜35岁日本人的加拿大工作居留项目。
- 年度名额：最多6,500人（2024年度）
- 有效期：1年
- 申请费用：CAD 272（请在IRCC官网确认最新费率）
- 抽签制（通常每年2〜3月开放申请）

**工作许可证（Work Permit）**
受雇于加拿大企业时须持有。
- **需要LMIA（劳动力市场影响评估）**：雇主须证明无合格加拿大人可胜任该职位
- **无需LMIA**：依据CUSMA（原NAFTA）的公司内部调任、特定豁免类别等

### 税务与生活须知

**所得税**：联邦税（15%〜33%）+ 省税（约5%〜17%）两级结构。
- 魁北克省须单独申报省税，手续比其他省复杂
- 主要城市（多伦多/温哥华）高收入者实际税率通常约40%〜48%

**社会保险（CPP + EI）**：受雇员工须缴纳加拿大养老金（CPP）和就业保险（EI）。
**医疗**：各省公共医疗保险（如安大略省的OHIP）保障范围广，但等待时间较长是普遍问题。
**住房成本**：温哥华和多伦多位居全球最贵之列（一居室月租约CAD 2,000〜3,500）；卡尔加里和埃德蒙顿等内陆城市则相对经济实惠。

### 费用参考

| 项目 | 费用 |
|------|------|
| 快速通道（PR）申请费 | CAD 1,525（本人）+ CAD 1,525（配偶）+ CAD 270（子女） |
| 永久居留卡（PR Card） | CAD 50 |
| 打工度假（IEC）申请费 | CAD 272（请在IRCC官网确认） |
| 工作许可证申请费 | CAD 155 |

### 移居前注意事项

1. **提升CRS分数**：英语（IELTS）CLB 9分以上（相当于雅思7.5分）可显著提高CRS——英语备考至关重要
2. **2025年移民削减政策**：加拿大政府已宣布降低2025〜2026年移民接收目标，获得永久居留权的竞争可能加剧
3. **省份选择的重要性**：温哥华和多伦多生活成本高；阿尔伯塔省无省级所得税（截至2025年），性价比较高
4. **法语优势**：类别专项抽签越来越倾向于法语使用者，计划移居魁北克的申请人尤为有利
5. **打工度假→永久居留路径**：通过打工度假积累加拿大工作经验再转CEC，是最可行的永久居留途径之一

加拿大移民制度透明度高，具备英语能力和工作经验者获得永久居留权的可能性相对较大。请使用MoveWorth详细模拟生活费和税金，规划最佳的移居时机。

---

### 参考资料

本文信息基于以下官方资料整理。

- **Express Entry**: [IRCC – Express Entry 官方页面](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html)
- **类别优先选拔**: [IRCC – 类别优先轮次](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html)
- **创业签证**: [IRCC – Start-up Visa 项目](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html)
- **工作许可**: [IRCC – 临时工作许可资格要求](https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit/temporary/eligibility.html)`,
    },
  },
  {
    slug: "visa-gb",
    category: "visa",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-gb.webp",
    date: "2026-03-25",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】イギリスのビザ・就労許可完全ガイド｜Skilled Worker・Global Talent・Youth Mobility",
      en: "UK Visa & Work Permit Complete Guide 2026 | Skilled Worker, Global Talent & Youth Mobility",
      zh: "【2026年最新版】英国签证与工作许可完全指南｜技术工人签证·全球人才签证·青年交流计划",
    },
    description: {
      ja: "Skilled Worker Visa（最低年収GBP 41,700）・Global Talent・HPI・Youth Mobility・ILR永住権まで。イギリスの主要ビザの種類・要件・費用を徹底解説。",
      en: "Skilled Worker Visa (min GBP 41,700), Global Talent, High Potential Individual (HPI), Youth Mobility, and ILR permanent residency — a complete guide to UK visa types.",
      zh: "技术工人签证（最低年薪GBP 41,700）、全球人才签证、高潜力人才签证（HPI）、青年交流计划及ILR永久居留——全面解析英国主要签证类型与费用。",
    },
    content: {
      ja: `イギリスはBrexit後の独自移民制度を2021年に導入し、EUを含む全ての外国人に対して統一的なポイントベース制度を適用しています。ロンドンを中心に金融・テクノロジー・医療・クリエイティブ産業が集積しており、高度人材の需要が高い国です。

### 主なビザの種類

**Skilled Worker Visa（熟練労働者ビザ）**
イギリスの主要な就労ビザ。認定雇用主からの雇用証明書（Certificate of Sponsorship / CoS）が必要。
- 要件：認定雇用主からのスポンサーシップ + 英語能力（B1以上）+ 最低給与基準の充足
- **最低給与：年収GBP 41,700**（または職種別最低賃金の高い方）（2024年4月改定後）
- 有効期間：最大5年（更新可）
- 申請費用：GBP 719〜1,751（居住期間・申請場所による）
- 5年後にILR（永住権）申請が可能

**Global Talent Visa（グローバルタレントビザ）**
科学・人文科学・エンジニアリング・芸術・デジタル分野のトップ人材向け。雇用主スポンサー不要。
- 認定機関による推薦が必要（分野によって異なる）：
  - デジタル技術：Tech Nation（2023年閉鎖）→ UKRI等が引継
  - エンジニアリング：Royal Academy of Engineering
  - 科学・医学：Royal Society・UKRI
  - 芸術：Arts Council England
- 有効期間：最大5年（更新可）
- 3〜5年でILR申請可能（ルートによる）

**High Potential Individual（HPI）ビザ**
世界大学ランキング上位50位以内の大学卒業者向けの2年間ビザ。雇用主スポンサー不要。
- 学士卒業後2年間（修士・博士は3年間）就労・起業・就職活動が可能
- 対象大学：QS/Times Higher Education/Shanghai Rankings上位50位以内（毎年更新）

**Youth Mobility Scheme（ワーキングホリデー）**
18〜30歳の日本人向け（2023年に年齢上限が30歳に拡大）。2年間就労・滞在可能。
- 年間6,000名（日本人枠、毎年1月頃に申請受付開始）
- 申請費用：GBP 259
- 就労制限なし（ほぼすべての職種で就労可能）

**Innovator Founder Visa（起業家ビザ）**
革新的なビジネスを英国で立ち上げる起業家向けビザ。
- 認定機関（Endorsing Bodies）による事業計画の承認が必要
- GBP 50,000の投資資金の証明
- 有効期間：3年（更新・延長可）

**Graduate Visa（留学生向け卒業後就労ビザ）**
英国の大学卒業生が卒業後に就労・起業活動を行うための2年間ビザ（博士課程は3年）。雇用主スポンサー不要。

**ILR（Indefinite Leave to Remain / 永住権）**
適法滞在5年以上で申請可能。
- Life in the UK テスト合格が必要
- 英語能力証明（B1以上）
- ILR取得の1年後に英国籍申請可能

### 生活・税金について

**所得税**：
- 基本税率20%：GBP 12,571〜50,270
- 高税率40%：GBP 50,271〜125,140
- 追加税率45%：GBP 125,141以上
- 個人控除額（Personal Allowance）：GBP 12,570（年収GBP 100,000超で段階的減額）

**国民保険（NI）**：従業員は基本税率帯の収入に対して8%（GBP 50,271超は2%）を負担。

**NHS（国民健康保険サービス）**：IHSを支払えばNHSを利用可能。ビザ申請時に全期間分を前払い（GBP 1,035/年）。プライベート医療保険に加入する選択肢もあり。

**住居費**：ロンドン（Zone 1-2）の1LDKはGBP 2,000〜3,500/月。マンチェスター・バーミンガムは半額以下。

### 費用の目安

| 項目 | 費用 |
|------|------|
| Skilled Worker Visa（海外申請・3年） | GBP 719 |
| Skilled Worker Visa（海外申請・5年） | GBP 1,420 |
| Youth Mobility Scheme | GBP 259 |
| HPI ビザ | GBP 822 |
| IHS（医療負担金）/年 | GBP 1,035 |
| ILR申請費 | GBP 3,226（2026年4月〜） |
| 英国籍申請費 | GBP 1,709（2026年4月〜） |

### 移住前のチェックポイント

1. **IHSの前払い負担**：5年ビザ申請の場合、IHSだけでGBP 5,175（約100万円）の前払いが必要。総コストに要注意
2. **最低給与の引き上げ**：2024年4月にGBP 26,200→GBP 38,700（一般）に大幅引き上げ。希少職種・医療職等は下限が異なる
3. **HPIビザの活用**：世界トップ50大学の卒業者は雇用主なしで2年間渡航できる。就職活動を英国でするのに最適
4. **ロンドンの生活費**：世界最高水準。MoveWorthで手取り額と生活費を比較検討することを推奨
5. **ワーキングホリデーの抽選**：毎年1月頃に申請受付が始まり、先着または抽選で6,000名が決まる。早めの準備を

イギリスはロンドンを中心に欧州最大の金融・テクノロジーハブとして外国人専門職の就労機会が豊富ですが、ビザコスト・IHS・生活費を含めた総コストの試算が重要です。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **Skilled Worker Visa（熟練労働者ビザ）**: [GOV.UK – Skilled Worker Visa](https://www.gov.uk/skilled-worker-visa)
- **Global Talent Visa（グローバル人材ビザ）**: [GOV.UK – Global Talent Visa](https://www.gov.uk/global-talent)
- **Innovator Founder Visa（起業家ビザ）**: [GOV.UK – Innovator Founder Visa](https://www.gov.uk/innovator-founder-visa)`,
      en: `The UK introduced its post-Brexit points-based immigration system in 2021, applying a unified framework to all foreign nationals including EU citizens. London remains one of the world's top hubs for finance, technology, media, and healthcare careers.

### Main Visa Types

**Skilled Worker Visa**
The UK's primary work visa. Requires a Certificate of Sponsorship (CoS) from a licensed employer.
- Requirements: Licensed employer sponsorship + English (B1+) + minimum salary threshold
- **Minimum salary: GBP 41,700/year** or the going rate for the occupation, whichever is higher (revised April 2024)
- Validity: Up to 5 years (renewable)
- Application fee: GBP 719–1,751 (varies by duration and application location)
- ILR (permanent residency) eligible after 5 years

**Global Talent Visa**
For world-leading talent in science, humanities, engineering, arts, and digital technology. No employer sponsor required.
- Requires endorsement from a designated body:
  - Digital technology: UKRI (formerly Tech Nation)
  - Engineering: Royal Academy of Engineering
  - Science/medicine: Royal Society / UKRI
  - Arts: Arts Council England
- Validity: Up to 5 years; ILR eligible in 3–5 years depending on category

**High Potential Individual (HPI) Visa**
2-year work visa for graduates of top-50 globally ranked universities. No employer sponsor required.
- 2 years for bachelor's/master's graduates; 3 years for PhD graduates
- Eligible universities: Top 50 in QS, Times Higher Education, or Shanghai Rankings (updated annually)

**Youth Mobility Scheme (Working Holiday)**
For Japanese nationals aged 18–30 (age limit extended to 30 in 2023). 2 years of work and stay.
- Annual quota: 6,000 Japanese places (applications typically open in January)
- Application fee: GBP 259
- No work restrictions — almost all occupations permitted

**Innovator Founder Visa**
For entrepreneurs founding innovative businesses in the UK.
- Endorsement from a recognized Endorsing Body required
- GBP 50,000 in investment funds
- Validity: 3 years (renewable)

**Graduate Visa**
2-year (3-year for PhD) post-study work visa for UK university graduates. No employer sponsor required.

**ILR (Indefinite Leave to Remain)**
Permanent residency available after 5+ years of lawful residence.
- Must pass the Life in the UK test
- English language proof required (B1+)
- British citizenship can be applied for 1 year after ILR

### Tax & Living Notes

**Income tax**:
- Basic rate 20%: GBP 12,571–50,270
- Higher rate 40%: GBP 50,271–125,140
- Additional rate 45%: GBP 125,141+
- Personal Allowance: GBP 12,570 (tapers above GBP 100,000)

**National Insurance**: Employees pay 8% on earnings in the basic rate band (2% above GBP 50,270).

**NHS**: IHS payment grants access to the National Health Service. Paid upfront for the full visa duration at GBP 1,035/year.

**Housing**: London Zone 1-2 one-bedroom: GBP 2,000–3,500/month. Manchester and Birmingham are typically half the price.

### Cost Summary

| Item | Cost |
|------|------|
| Skilled Worker Visa (overseas, 3 years) | GBP 719 |
| Skilled Worker Visa (overseas, 5 years) | GBP 1,420 |
| Youth Mobility Scheme | GBP 259 |
| HPI Visa | GBP 822 |
| IHS (health surcharge)/year | GBP 1,035 |
| ILR application fee | GBP 3,226 (from April 2026) |
| British citizenship fee | GBP 1,709 (from April 2026) |

### Pre-Move Checklist

1. **IHS upfront cost**: A 5-year visa requires upfront IHS payment of GBP 5,175 (approx. £5K+) — factor this into total costs
2. **April 2024 salary increase**: Minimum salary jumped from GBP 26,200 to GBP 41,700 — verify the specific threshold for your occupation
3. **HPI visa opportunity**: Top-50 university graduates can come without a job offer — ideal for job hunting in London
4. **London cost of living**: Among the world's highest — use MoveWorth to compare take-home pay against living expenses
5. **Youth Mobility quota**: Applications typically open in January; 6,000 spots fill quickly — prepare early

The UK offers rich career opportunities, especially in London's finance and tech sectors, but the combination of visa fees, IHS, and living costs requires careful upfront financial planning.

---

### References

This article is based on the following official sources.

- **Skilled Worker Visa**: [GOV.UK – Skilled Worker Visa](https://www.gov.uk/skilled-worker-visa)
- **Global Talent Visa**: [GOV.UK – Global Talent Visa](https://www.gov.uk/global-talent)
- **Innovator Founder Visa**: [GOV.UK – Innovator Founder Visa](https://www.gov.uk/innovator-founder-visa)`,
      zh: `英国在2021年脱欧后推出积分制移民新制度，对包括欧盟公民在内的所有外籍人士统一适用。伦敦仍是全球金融、科技、媒体和医疗领域的顶级中心之一。

### 主要签证种类

**技术工人签证（Skilled Worker Visa）**
英国主要就业签证，须获得持牌雇主出具的担保证书（CoS）。
- 要求：持牌雇主担保 + 英语能力（B1级以上）+ 最低薪资标准
- **最低年薪：GBP 41,700**（或职业最低工资标准，取较高者）（2024年4月修订）
- 有效期：最长5年（可续签）
- 申请费用：GBP 719〜1,751（因居留期限和申请地点而异）
- 居留满5年后可申请ILR（无限期居留权）

**全球人才签证（Global Talent Visa）**
面向科学、人文、工程、艺术和数字技术领域的世界顶尖人才，无需雇主担保。
- 须获得指定机构认可：
  - 数字技术：UKRI（原Tech Nation）
  - 工程：英国皇家工程院
  - 科学/医学：英国皇家学会/UKRI
  - 艺术：英格兰艺术委员会
- 有效期：最长5年；3〜5年后可申请ILR（视类别而定）

**高潜力人才签证（HPI Visa）**
全球排名前50的大学毕业生可申请的2年期签证，无需雇主担保。
- 本科/硕士毕业生：2年；博士毕业生：3年
- 适用大学：QS、泰晤士高等教育或软科世界大学排名前50（每年更新）

**青年交流计划（打工度假）**
面向18〜30岁日本人（2023年起上限提高至30岁），可在英国工作并居留2年。
- 年度名额：6,000人（通常每年1月开放申请）
- 申请费用：GBP 259
- 无职业限制，几乎所有职种均可从事

**创新创业签证（Innovator Founder Visa）**
面向在英国创办创新型企业的创业者。
- 须获得认可担保机构认可
- 需持有GBP 50,000投资资金证明
- 有效期：3年（可续签）

**毕业生签证（Graduate Visa）**
英国高校毕业生的2年期（博士3年）就业签证，无需雇主担保。

**ILR（无限期居留权）**
合法居留5年以上后可申请。
- 须通过"英国生活测试"
- 须提供英语能力证明（B1级以上）
- 获得ILR后1年可申请英国国籍

### 税务与生活须知

**所得税**：
- 基本税率20%：GBP 12,571〜50,270
- 较高税率40%：GBP 50,271〜125,140
- 附加税率45%：GBP 125,141以上
- 个人免税额：GBP 12,570（年收入超GBP 100,000逐步减少）

**国民保险（NI）**：员工在基本税率区间缴纳8%（GBP 50,270以上部分缴纳2%）。

**NHS**：支付IHS后即可使用国民健康服务，申请时按全期一次性预付（GBP 1,035/年）。

**住房成本**：伦敦Zone 1-2一居室月租GBP 2,000〜3,500；曼彻斯特、伯明翰通常约为伦敦一半。

### 费用参考

| 项目 | 费用 |
|------|------|
| 技术工人签证（海外申请·3年） | GBP 719 |
| 技术工人签证（海外申请·5年） | GBP 1,420 |
| 青年交流计划 | GBP 259 |
| 高潜力人才签证（HPI） | GBP 822 |
| 移民医疗附加费（IHS）/年 | GBP 1,035 |
| ILR申请费 | GBP 3,226（2026年4月起） |
| 英国国籍申请费 | GBP 1,709（2026年4月起） |

### 移居前注意事项

1. **IHS预付负担**：申请5年签证须一次性预付IHS约GBP 5,175，须纳入总成本核算
2. **最低薪资大幅上调**：2024年4月起由GBP 26,200升至GBP 41,700，请确认所申请职种的具体标准
3. **充分利用HPI签证**：全球前50大学毕业生可无需工作邀约直接入境，是在伦敦求职的理想选择
4. **伦敦生活成本高企**：建议使用MoveWorth对税后收入与生活费进行全面比较
5. **打工度假名额紧张**：通常1月开放申请，6,000个名额很快额满，请提前做好准备

英国特别是伦敦，在金融和科技领域为外籍专业人士提供了丰富的就业机会，但签证费用、IHS及生活成本加总后不容小觑，需提前进行充分的财务规划。

---

### 参考资料

本文信息基于以下官方资料整理。

- **技术工人签证（Skilled Worker Visa）**: [GOV.UK – Skilled Worker Visa](https://www.gov.uk/skilled-worker-visa)
- **全球人才签证（Global Talent Visa）**: [GOV.UK – Global Talent Visa](https://www.gov.uk/global-talent)
- **创始人签证（Innovator Founder Visa）**: [GOV.UK – Innovator Founder Visa](https://www.gov.uk/innovator-founder-visa)`,
    },
  },
  {
    slug: "visa-de",
    category: "visa",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-de.webp",
    date: "2026-03-19",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】ドイツのビザ・就労許可完全ガイド｜EUブルーカード・機会カード・永住権",
      en: "【2026 Updated】Germany Visa & Work Permit Complete Guide｜EU Blue Card, Chancenkarte & Permanent Residence",
      zh: "【2026年最新】德国签证与工作许可完全指南｜欧盟蓝卡・机会卡・永久居留权",
    },
    description: {
      ja: "EUブルーカード・機会カード（Chancenkarte）・求職者ビザまで。2023年移民法改正の要点、税率、社会保険、ベルリン・ミュンヘンの家賃相場を徹底解説。",
      en: "EU Blue Card, Chancenkarte, Job-Seeker Visa and more — covering the 2023 Skilled Worker Act, tax rates, social insurance, and rent in Berlin and Munich.",
      zh: "欧盟蓝卡、机会卡、求职签证全解析，涵盖2023年技术移民法改革要点、税率、社会保险及柏林、慕尼黑租金行情。",
    },
    content: {
      ja: `ドイツはEU最大の経済大国であり、製造業・IT・エンジニアリング・医療を中心に外国人専門職の需要が継続して高い国です。2023年に施行された「専門労働者移民法（Fachkräfteeinwanderungsgesetz）」の改正により、学歴だけでなく実務経験ベースでも就労ビザが取得可能になりました。EU外からのルートがかつてないほど広がっています。

### あなたに合ったビザは？

| あなたの状況 | おすすめのビザ |
|------------|-------------|
| 大学学位あり・年収EUR 45,000以上の職に就く | EUブルーカード |
| 大学学位あり・または5年以上の実務経験 | 専門労働者ビザ（Fachkräftevisum） |
| 先にドイツで就職活動をしたい | 求職者ビザ（6ヶ月） / 機会カード（1年） |
| フリーランス・コンサルタント・芸術家 | フリーランスビザ（Freiberufler） |
| ポイント6以上だが学位なし | 機会カード（Chancenkarte） |

### 主なビザの種類

**EUブルーカード（EU Blue Card）** ｜ [Make it in Germany 公式ページ](https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card)
高度人材向けのEU共通就労・居住許可証で、ドイツが最も多くの発行件数を誇ります。
- 要件：大学学位（4年制以上）+ 雇用契約 + 最低年収 **EUR 50,700**（2026年・一般職）
- IT・医師・エンジニア等の不足職種は **EUR 45,934**（約10%低い基準が適用）
- 有効期間：4年（または雇用期間＋3ヶ月の短い方）
- 定住許可（Niederlassungserlaubnis）への移行：就労2年後（ドイツ語B1があれば21ヶ月）
- EU内の他国への移動・就労にも一定の優遇あり（Blue Card相互認証）

**専門労働者ビザ（Fachkräftevisum）** ｜ [Make it in Germany 公式ページ](https://www.make-it-in-germany.com/en/visa-residence/types/work-visa-skilled-workers)
2023年改正で対象が大幅拡大。職業訓練資格（Berufsausbildung）保有者だけでなく、**5年以上の実務経験**を持つ非学位者にも適用可能に。雇用契約と資格認定（または経験証明）が必要。

**求職者ビザ（Job-Seeker Visa）** ｜ [Make it in Germany 公式ページ](https://www.make-it-in-germany.com/en/visa-residence/types/job-seekers-visa)
ドイツ国内での就職活動専用の6ヶ月ビザ。
- 要件：大学学位または職業資格 + 月EUR 1,027以上の生計費証明（2026年目安）
- 滞在中に内定を取得すれば就労ビザへ切り替え可能

**フリーランスビザ（Freiberufler Visa）** ｜ [Make it in Germany 公式ページ](https://www.make-it-in-germany.com/en/visa-residence/types/freelance-visa)
芸術・言語・科学・技術・医療・コンサルタント等の自由業（Freiberuf）向け。雇用契約は不要だが、ドイツ国内のクライアントとの契約実績・事業計画書の提出が一般的に求められます。

**機会カード（Chancenkarte）** ｜ [Make it in Germany 公式ページ](https://www.make-it-in-germany.com/en/visa-residence/types/opportunity-card)
2024年6月導入の新制度。ポイント制で就職活動目的の1年滞在許可を取得可能。
- 最低取得条件：**6ポイント以上**（または大学学位等の資格+1ポイント）
- 主なポイント項目：大学学位（3pt）/ 職業訓練資格（2pt）/ ドイツ語B2（3pt） / A2（1pt）/ 職歴5年以上（3pt）/ 30〜35歁（1pt）/ ドイツへの過去の滞在歴（1pt）など
- 機会カード滞在中は週20時間以内の試行就労も可能

**定住許可（Niederlassungserlaubnis）** ｜ [BAMF 公式ページ](https://www.bamf.de/EN/Themen/MigrationAufenthalt/ZuwandererDrittstaaten/Migrathek/Niederlassungserlaubnis/niederlassungserlaubnis-node.html)
ドイツの永住権に相当。一般的には5年の合法的在留後に取得可能。EUブルーカードは2年（B1あり21ヶ月）に短縮。配偶者・家族の帯同は原則申請時から可能。

### 税制・社会保険

**所得税（Einkommensteuer）**
- 課税最低限：年収EUR 11,784未満は非課税（2026年）
- 14〜42%の累進課税（年収EUR 66,761超で42%）
- 最高税率45%：年収EUR 277,826超
- **連帯付加税（Solidaritätszuschlag）**：高所得者（年収EUR 18,130超）に課税所得の5.5%が追加課税

**教会税（Kirchensteuer）**
宗教団体に登録している場合、所得税額の8〜9%を追加納付。登録解除（Kirchenaustritt）は役所で手続き可能。

**社会保険料（被用者負担分）**
| 種類 | 被用者負担 |
|------|-----------|
| 健康保険 | 約7.3%（付加保険料含む） |
| 年金保険 | 9.3% |
| 失業保険 | 1.3% |
| 介護保険 | 約1.8%（子なし加算あり） |
| **合計** | **約20%** |

雇用主も同額程度を負担するため、総人件費は額面給与の約140%になります。

### 家賃・生活費の目安

ドイツの家賃は都市によって大きく異なります。外国人駐在員・専門職が多く住むエリアの1LDK（約50〜70㎡）の目安：

| 都市 | 中心部1LDK家賃 |
|------|--------------|
| ミュンヘン（シュヴァービング・マクシミリアン） | EUR 1,500〜2,500/月 |
| ベルリン（ミッテ・プレンツラウアーベルク） | EUR 1,200〜2,000/月 |
| フランクフルト（サウスエンド・サクセンハウゼン） | EUR 1,300〜2,200/月 |
| ハンブルク（アイムスビュッテル・ハルベシュタット） | EUR 1,200〜1,900/月 |

生活費（食費・交通・通信）：月EUR 600〜900程度（ミュンヘンは高め）。

### 費用の目安

| 項目 | 費用 |
|------|------|
| 国内ビザ申請費（在日ドイツ大使館） | EUR 75 |
| 滞在許可申請・更新費 | EUR 100〜 |
| 機会カード申請費 | EUR 100 |
| 定住許可（永住権）申請費 | EUR 113 |
| ドイツ国籍申請費 | EUR 255 |
| 封鎖口座（求職者・学生） | EUR 11,208/年（月934） |

### 移住前のチェックポイント

1. **ドイツ語能力**：B1があればEUブルーカードで定住許可取得が最短21ヶ月に短縮。求職時もB2以上で応募できる求人が格段に増加
2. **資格認定（Anerkennung）**：海外取得の学位・職業資格はanabin（大学）またはBQ-Portal（職業資格）で認定状況を事前確認
3. **住民登録（Anmeldung）**：ドイツ到着後14日以内に居住地の市区役所（Einwohnermeldeamt）で住民登録が義務
4. **社会保険の手続き**：就労開始後、健康保険組合（Krankenkasse）への加入手続きは雇用主経由だが、自分でも組合を選べる
5. **ミュンヘンの住宅難**：募集開始から数日で埋まることが多い。就労ビザ取得前にWG（シェアハウス）で短期入居し、現地で物件を探すのが現実的

### 家族帯同・その他の手続き

**家族帯同（Familiennachzug）**
- 配偶者・18歳未満の子は原則として帯同申請が可能
- 配偶者はビザ取得後に就労許可付きの在留許可を申請できる
- ドイツ語A1以上の証明が配偶者のビザ申請に必要（Blue Cardは例外あり）

**法定健康保険（Gesetzliche Krankenversicherung / GKV）**
- 就労者は原則として法定健保に加入義務（年収EUR 69,300以上は私的保険も選択可）
- 主要保険組合：TK（Techniker Krankenkasse）・AOK・Barmer 等
- 保険料は月給の約14.6%（雇用者・雇用主で折半）

**年金（Deutsche Rentenversicherung）**
- 就労開始から自動加入。保険料は月給の18.6%（折半）
- 日独社会保障協定あり：ドイツで5年以上保険料を払えば日本側に通算される
- 早期帰国する場合は一定条件で保険料の還付申請が可能（Rentenauskunft で確認）

**学歴・資格認定（Anerkennung）**
- 海外取得の大学学位：[anabin データベース](https://anabin.kmk.org/)で認定状況を確認
- 職業訓練資格（看護師・技師等）：[BQ-Portal](https://www.bq-portal.de/) または各州の認定機関へ申請

ドイツは2023年の移民法改正で第三国からの門戸が大きく開かれており、エンジニア・IT・医療職でのキャリアを考える方に特に適した移住先です。言語の壁は高いですが、その分競争は相対的に低く、一度定住すると長期的に安定した生活を築きやすい国です。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **熟練労働者移住ガイド全般**: [Make it in Germany – 公式移住ポータル](https://www.make-it-in-germany.com/)
- **ビザ・在留許可法令（Fachkräfteeinwanderungsgesetz）**: [BAMF – ドイツ連邦移民難民庁](https://www.bamf.de/)
- **ビザ申請・在外公館**: [ドイツ連邦外務省 – ビザ申請ガイド](https://www.auswaertiges-amt.de/en/visa-service)
- **資格認定データベース（大学学位）**: [anabin – 外国学位認定検索](https://anabin.kmk.org/)
- **職業資格認定（BQ-Portal）**: [BQ-Portal – 外国職業資格認定](https://www.bq-portal.de/)
- **ドイツ年金保険**: [Deutsche Rentenversicherung](https://www.deutsche-rentenversicherung.de/)`,
      en: `Germany is the EU's largest economy with sustained demand for skilled foreign professionals in manufacturing, IT, engineering, and healthcare. The 2023 Skilled Worker Immigration Act (Fachkräfteeinwanderungsgesetz) significantly expanded pathways for non-EU nationals — work experience alone can now qualify without a formal degree for certain roles.

### Main Visa Types

**EU Blue Card**
The EU's unified work and residence permit for highly qualified workers. Germany issues more EU Blue Cards than any other EU country.
- Requirements: University degree (4-year+) + employment contract + minimum annual salary of **EUR 50,700** (2026, general roles)
- Shortage occupations (IT, engineering, medicine): **EUR 45,934** minimum salary
- Validity: 4 years (or duration of contract + 3 months, whichever is shorter)
- Permanent residence (Niederlassungserlaubnis) after **2 years** (21 months with German B1)
- Portability across EU countries after 18 months of holding the card

**Skilled Worker Visa (Fachkräftevisum)**
Major expansion under 2023 reform: vocational qualification holders AND those with **5+ years of relevant work experience** (without a formal degree) are now eligible. Requires an employment contract and credential recognition or experience documentation.

**Job-Seeker Visa**
6-month visa specifically for job hunting inside Germany.
- Requirements: University degree or recognized vocational qualifications + proof of funds (approx. EUR 1,027/month)
- Convert to work visa once you have a job offer — no need to leave Germany

**Freelancer Visa (Freiberufler Visa)**
For professionals in arts, languages, science, technology, IT, and consulting. No employment contract required, but you'll typically need to show client contracts, business plan, and sufficient income expectations.

**Opportunity Card (Chancenkarte)**
Introduced June 2024 — a points-based 1-year visa for job seekers.
- Minimum: **6 points** (or a recognized qualification + 1 point)
- Points awarded for: university degree (3), vocational qualification (2), German B2 (3), A2 (1), 5+ years of work experience (3), age 30–35 (1), prior Germany ties (1), and more
- Allows up to 20 hours/week of trial employment (Probearbeit) while searching

**Permanent Residence (Niederlassungserlaubnis)**
Germany's permanent residency. General route: 5 years lawful residence. EU Blue Card holders: 2 years (21 months with B1). Family members can typically join from the start of the application.

### Tax & Social Insurance

**Income Tax (Einkommensteuer)**
- Tax-free allowance: EUR 11,784/year (2026)
- Progressive rates: 14–42% (42% kicks in at EUR 66,761/year)
- Top rate 45%: income above EUR 277,826/year
- **Solidarity surcharge (Solidaritätszuschlag)**: 5.5% of income tax for higher earners (above EUR 18,130 annual income tax)

**Church Tax (Kirchensteuer)**
If registered with a religious community: 8–9% of your income tax bill as an additional levy. You can deregister (Kirchenaustritt) at a local registry office.

**Employee Social Insurance Contributions**
| Type | Employee Share |
|------|---------------|
| Health insurance | ~7.3% (incl. supplemental premium) |
| Pension insurance | 9.3% |
| Unemployment insurance | 1.3% |
| Long-term care insurance | ~1.8% (childless surcharge applies) |
| **Total** | **~20%** |

Employers match approximately the same amount — total employment cost is roughly 140% of gross salary.

### Rent & Cost of Living

Rent for a 1BR apartment (50–70 m²) in expat-heavy central areas:

| City | Central 1BR Rent |
|------|-----------------|
| Munich (Schwabing, Maximilianstraum) | EUR 1,500–2,500/month |
| Berlin (Mitte, Prenzlauer Berg) | EUR 1,200–2,000/month |
| Frankfurt (Sachsenhausen, Nordend) | EUR 1,300–2,200/month |
| Hamburg (Eimsbuettel, Harvestehude) | EUR 1,200–1,900/month |

General living costs (food, transport, utilities): EUR 600–900/month (higher in Munich).

### Cost Summary

| Item | Cost |
|------|------|
| National visa application (German embassy) | EUR 75 |
| Residence permit application/renewal | EUR 100+ |
| Chancenkarte (Opportunity Card) | EUR 100 |
| Permanent residence permit | EUR 113 |
| German citizenship | EUR 255 |
| Blocked account (job seekers/students) | EUR 11,208/year (EUR 934/month) |

### Pre-Move Checklist

1. **German language**: B1 shortens EU Blue Card PR track to 21 months. B2+ dramatically expands job market access — many German employers require it even in tech
2. **Credential recognition**: Check degrees on the anabin database (universities) or BQ-Portal (vocational). Some professions (medicine, law) require state-level recognition
3. **Anmeldung (registration)**: You must register at the local residents' office (Einwohnermeldeamt) within 14 days of arriving at a permanent address
4. **Health insurance selection**: Employer handles enrollment, but you can choose your Krankenkasse — supplemental premiums vary between 0.5–2%
5. **Munich housing crunch**: Apartments in Munich fill within days of listing. Consider a short-term WG (shared apartment) while apartment hunting after arrival

Germany's 2023 immigration reform has made the country significantly more accessible for non-EU nationals. The language barrier is real, but it also means less competition — and once you're settled, Germany's stability, social safety net, and central European location offer a strong long-term base.

---

### References

This article is based on the following official sources.

- **Skilled Immigration General**: [Make it in Germany – Official Immigration Portal](https://www.make-it-in-germany.com/)
- **Skilled Immigration Act (Fachkräfteeinwanderungsgesetz)**: [BAMF – Federal Office for Migration and Refugees](https://www.bamf.de/)
- **Visa Applications & Consulates**: [German Federal Foreign Office – Visa Guide](https://www.auswaertiges-amt.de/en/visa-service)`,
      zh: `德国是欧盟最大经济体，制造业、IT、工程及医疗领域对外籍专业人才的需求持续旺盛。2023年施行的《技术移民法》（Fachkräfteeinwanderungsgesetz）修订版大幅拓宽了第三国公民的移居渠道——即使没有正式学历，仅凭工作经验也可申请就业签证。

### 主要签证种类

**欧盟蓝卡（EU Blue Card）**
面向高素质人才的欧盟统一就业居留许可，德国是全欧发放蓝卡数量最多的国家。
- 要求：大学学历（本科及以上）+ 雇用合同 + 最低年薪 **EUR 50,700**（2026年，一般职业）
- IT、工程、医疗等紧缺职业：最低年薪 **EUR 45,934**
- 有效期：4年（或合同期限+3个月，以较短者为准）
- 持卡**2年后**可申请永久居留（具备德语B1则缩短至21个月）
- 持卡18个月后可在欧盟其他成员国流动就业

**技术工人签证（Fachkräftevisum）**
2023年修法后大幅扩大适用范围：职业培训资质持有者及**具备5年以上相关工作经验**的非学历申请者均可申请。需提供雇用合同及资质认定或工作经验证明文件。

**求职签证（Job-Seeker Visa）**
专为在德国境内求职而设计的6个月签证。
- 要求：大学学历或职业资格 + 生活费证明（约每月EUR 1,027）
- 在德国境内获得录用后可直接转换为工作签证，无需出境

**自由职业签证（Freiberufler Visa）**
适用于艺术、语言、科学、IT、技术及咨询等自由职业者。无需雇用合同，但通常须提交客户合同、商业计划书及预期收入证明。

**机会卡（Chancenkarte）**
2024年6月起实施的新积分制度，可获得以求职为目的的1年居留许可。
- 最低条件：**6分以上**（或持认可资质+1分）
- 积分项目：大学学历（3分）/ 职业资格（2分）/ 德语B2（3分）/ A2（1分）/ 5年以上工作经验（3分）/ 年龄30〜35岁（1分）/ 与德国的既往关联（1分）等
- 持机会卡期间可进行每周最多20小时的试用就业（Probearbeit）

**永久居留权（Niederlassungserlaubnis）**
德国永居许可。一般申请需合法居住满5年；欧盟蓝卡持有者为2年（德语B1则缩短至21个月）。配偶及家庭成员原则上可从申请时起同行。

### 税制与社会保险

**所得税（Einkommensteuer）**
- 免税额：年收入EUR 11,784以下免税（2026年）
- 累进税率14〜42%（年收入超过EUR 66,761适用42%）
- 最高税率45%：年收入超过EUR 277,826
- **团结附加税（Solidaritätszuschlag）**：高收入者（年所得税超EUR 18,130）需额外缴纳所得税额的5.5%

**教会税（Kirchensteuer）**
已在宗教团体登记者须额外缴纳所得税额的8〜9%。可前往户籍登记处（Einwohnermeldeamt）办理退出手续（Kirchenaustritt）。

**社会保险缴费（雇员承担部分）**
| 险种 | 雇员缴费比例 |
|------|------------|
| 医疗保险 | 约7.3%（含附加保险费） |
| 养老保险 | 9.3% |
| 失业保险 | 1.3% |
| 长期护理保险 | 约1.8%（无子女加收附加费） |
| **合计** | **约20%** |

雇主缴纳比例与雇员大致相同，总用工成本约为税前薪资的140%。

### 租金与生活费参考

外籍人士、专业职集中居住的市中心区域1居室（约50〜70㎡）参考租金：

| 城市 | 中心区1居室租金 |
|------|--------------|
| 慕尼黑（施瓦宾、马克西米利安区） | EUR 1,500〜2,500/月 |
| 柏林（米特、普伦茨劳贝格） | EUR 1,200〜2,000/月 |
| 法兰克福（萨克森豪森、北区） | EUR 1,300〜2,200/月 |
| 汉堡（艾姆斯比特尔、哈维斯蒂胡德） | EUR 1,200〜1,900/月 |

一般生活费（饮食、交通、通信）：每月约EUR 600〜900（慕尼黑偏高）。

### 费用参考

| 项目 | 费用 |
|------|------|
| 国家签证申请费（驻华/驻日德国大使馆） | EUR 75 |
| 居留许可申请/续签费 | EUR 100起 |
| 机会卡（Chancenkarte）申请费 | EUR 100 |
| 永久居留许可申请费 | EUR 113 |
| 德国国籍申请费 | EUR 255 |
| 封锁账户（求职/留学用） | EUR 11,208/年（每月EUR 934） |

### 移居前注意事项

1. **德语能力**：B1可将欧盟蓝卡永居申请期缩短至21个月；B2以上可大幅扩大求职范围，许多德国企业（包括IT领域）将B2作为最低要求
2. **资质认定**：学历须在anabin数据库（大学）或BQ-Portal（职业资格）确认认定状态；医学、法律等部分职业需经州级认定
3. **住民登记（Anmeldung）**：到达固定住所后14天内须前往户籍登记处（Einwohnermeldeamt）办理登记，为必须手续
4. **医疗保险选择**：雇主负责办理入保手续，但可自行选择保险组合（Krankenkasse），附加保险费率因组合不同约在0.5〜2%之间浮动
5. **慕尼黑住房紧张**：中心区公寓发布后数天内即告满，建议抵达后先入住合租公寓（WG），在当地实地寻找长期住所

德国2023年移民法改革大幅降低了第三国公民的移居门槛，语言壁垒虽高，但一旦安顿下来，稳定的社会保障、中欧的地理位置及成熟的产业基础可为长期生活提供坚实支撑。

---

### 参考资料

本文信息基于以下官方资料整理。

- **技术移民综合指南**: [Make it in Germany – 官方移居门户](https://www.make-it-in-germany.com/)
- **技术移民法（Fachkräfteeinwanderungsgesetz）**: [BAMF – 德国联邦移民和难民局](https://www.bamf.de/)
- **签证申请及领事馆**: [德国联邦外交部 – 签证申请指南](https://www.auswaertiges-amt.de/en/visa-service)`,
    },
  },
  {
    slug: "visa-fr",
    category: "visa",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-fr.webp",
    date: "2026-03-19",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】フランスのビザ・就労許可完全ガイド｜タレントパスポート・French Tech Visa・永住権",
      en: "【2026 Updated】France Visa & Work Permit Complete Guide｜Talent Passport, French Tech Visa & Carte de Résident",
      zh: "【2026年最新】法国签证与工作许可完全指南｜人才护照・法国科技签证・永久居留权",
    },
    description: {
      ja: "タレントパスポート・French Tech Visa・PVTから永住権まで。フランスの税制、社会保険、パリの家賃相場を徹底解説。",
      en: "Talent Passport, French Tech Visa, PVT and more — covering France's tax system, social charges, and Paris rent in expat areas.",
      zh: "人才护照、法国科技签证、打工度假签证全解析，涵盖法国税制、社会保险及巴黎外籍人士聚居区租金行情。",
    },
    content: {
      ja: `フランスはファッション・食・芸術で知られるだけでなく、パリを拠点とする世界最大級のスタートアップキャンパス「Station F」や、La French TechエコシステムによりIT・テック分野での外国人人材需要も急増しています。EU加盟国の中でも比較的高い給与水準を持ちながら、社会保険制度が充実している点が特徴です。

### ビザ選択早見表

| あなたの状況 | おすすめのビザ |
|------------|-------------|
| 研究者・高収入エンジニア・幹部職 | タレントパスポート（研究者 / 企業幹部カテゴリ） |
| La French Tech認定スタートアップに就労 | La French Tech Visa |
| 自分でスタートアップ・事業を立ち上げる | タレントパスポート（起業家カテゴリ） |
| フランス企業に一般就労 | 就労許可付き長期ビザ（VLS-TS） |
| 18〜30歳・旅行＋就労を体験したい | ワーキングホリデー（PVT） |
| フリーランス・コンサルタント | Auto-entrepreneur + タレントパスポート（起業家） |

### 主なビザの種類

**タレントパスポート（Passeport Talent）**
フランスが最も推進する高度人材向け優遇ビザ。最大4年間の就労・居住が可能で、家族同伴も認められます。主なカテゴリは以下の通りです：
- **研究者・高度人材**：雇用契約または研究協定 + 学士号以上。年収はポジションによって異なるが、幹部職は **年収EUR 46,235以上**（2025年基準、フランスの平均年収の1.5倍相当）が目安
- **企業幹部・専門家**：年収EUR 46,235以上（2025年目安）の幹部・マネージャー
- **起業家・投資家**：フランスで経済的・社会的価値のある事業を立ち上げる、または投資家として資金拠出
- **革新的企業従業員**：La French Tech認定スタートアップまたはBPI France（フランス公共投資銀行）認定企業での就労
- 有効期間：最大4年（更新可）
- 配偶者にも就労許可が付与される

**就労許可証付き長期ビザ（VLS-TS）**
標準的な就労ビザ。雇用主が労働局（DREETS）から採用許可を取得する必要があります。発行後、フランス入国から3ヶ月以内にOFII（フランス移民統合局）への届け出が必要。

**La French Tech Visa（テックビザ）**
La French Techのパートナーリストに含まれるスタートアップ・認定企業で働く外国人向けの簡略化された就労ビザ手続き。通常の労働市場テスト（市場内に代替候補者がいないかの審査）が免除されます。

**ワーキングホリデービザ（PVT：Programme Vacances Travail）**
18〜30歳の日本国籍者向け（2023年から上限が一部緩和、要最新確認）。1年間の就労・滞在が可能で、更新は原則不可。観光・就労・旅行を組み合わせることが目的の制度。

**フリーランサー向け（Auto-entrepreneur）**
フランスでの個人事業登録（Micro-entreprise）制度は外国人でも活用可能。年間売上上限：サービス業EUR 77,700。タレントパスポート（起業家カテゴリ）と組み合わせて利用するケースが多い。

**カルト・ド・レジダン（Carte de résident）**
フランスの永住許可。合法的な在留5年後に申請可能。フランス語B1以上、フランスへの統合証明などが求められます。

### 税制

**所得税（Impôt sur le revenu）**
フランスの所得税は「家族単位（quotient familial）」の仕組みが特徴的で、扶養人数によって税負担が軽減されます。

| 課税所得（単身）| 税率 |
|----------------|------|
| EUR 11,294まで | 0% |
| EUR 11,295〜28,797 | 11% |
| EUR 28,798〜82,341 | 30% |
| EUR 82,342〜177,106 | 41% |
| EUR 177,107超 | 45% |

**社会保険料（Cotisations sociales）**
フランスの社会保険料は雇用主・雇用者ともに負担率が高く、手取りが額面の70〜75%程度になることも珍しくありません。
- 雇用者負担：約22〜23%（健康保険・年金・失業保険等合計）
- 雇用主負担：給与の約40〜45%（日本の約2倍水準）

**CSG（一般社会拠出金）**
雇用者側で9.2%が天引き（うち6.8%は所得税控除対象）。フランス在住全員に適用。

### 家賃・生活費の目安

パリで外国人・専門職が多く住む中心部エリアの1LDK（約40〜60㎡）目安：

| エリア | 1LDK家賃 |
|--------|---------|
| マレ（3・4区）| EUR 1,800〜3,000/月 |
| サン＝ジェルマン（6区）| EUR 2,000〜3,500/月 |
| バスティーユ周辺（11区）| EUR 1,500〜2,500/月 |
| モンマルトル（18区）| EUR 1,300〜2,200/月 |
| ラ・デファンス周辺（郊外）| EUR 1,100〜1,800/月 |

一般生活費（食費・交通・通信）：月EUR 700〜1,000程度。パリの公共交通（Navigo月定期）：約EUR 88/月。

### 費用の目安

| 項目 | 費用 |
|------|------|
| 長期ビザ申請費（大使館） | EUR 99 |
| ワーキングホリデー（PVT） | EUR 100程度 |
| OFII（移民局）手続き税 | EUR 200〜400（ビザ種別による） |
| カルト・ド・レジダン申請費 | EUR 225 |
| フランス国籍取得申請費 | 無料（条件付き） |

### 移住前のチェックポイント

1. **フランス語能力**：パリ以外の都市（リヨン・マルセイユ・ボルドー）では英語が通じないケースが多く、日常生活・行政手続きにフランス語が必要。カルト・ド・レジダン取得にはB1以上が必須
2. **社会保険料の重さ**：額面給与の手取りはおよそ75〜77%程度。日本や東南アジアからの移住者は特に注意が必要
3. **パリの賃貸難**：保証人（garant）がいない外国人は、Visale（政府の保証制度）を活用。物件競争は激しく、申込みから数時間で決まることも
4. **OFII手続き**：フランス入国後、長期ビザ保有者は3ヶ月以内にOFIIへの登録・健康診断を受けることが義務（未了は在留許可更新に影響）
5. **タレントパスポートの年収要件**：カテゴリごとに異なる。フランス語公式サイト（service-public.fr）で最新の閾値を確認することを推奨

フランスは社会保険料の高さと官僚的な手続きの煩雑さで知られますが、一方でセキュリテ・ソシアル（公的医療保険）や育児支援など充実した社会保障が提供されます。スタートアップ・研究・芸術分野でのキャリアを視野に入れている方には、タレントパスポートが最速の移住ルートです。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **フランスビザ申請全般**: [France-Visas 公式ポータル](https://france-visas.gouv.fr/)
- **入国後手続き（OFII）**: [OFII – フランス移民統合局](https://www.ofii.fr/)
- **タレントパスポート・長期在留許可**: [Service-Public.fr – タレントパスポート](https://www.service-public.fr/particuliers/vosdroits/F16922)
- **La French Tech Visa**: [La French Tech – テックビザ公式情報](https://lafrenchtech.com/en/how-france-helps-startups/french-tech-visa/)
- **Station F（スタートアップキャンパス）**: [Station F 公式サイト](https://stationf.co/)`,
      en: `France is far more than fashion and cuisine — Paris hosts Station F, the world's largest startup campus, and the La French Tech ecosystem has made France one of Europe's top destinations for tech talent. With relatively high salaries for skilled professionals and one of Europe's most comprehensive social security systems, France offers strong long-term residency potential.

### Main Visa Types

**Talent Passport (Passeport Talent)**
France's flagship preferential visa for highly skilled workers and entrepreneurs — up to 4 years, with family members eligible for matching residence permits. Key categories:
- **Researchers and highly qualified professionals**: Employment or research agreement + bachelor's degree minimum. Executive/specialist roles target **EUR 46,235+ annual salary** (2025 threshold — 1.5x French average)
- **Corporate executives and specialists**: Annual salary EUR 46,235+ in a senior position
- **Entrepreneurs and investors**: Founding an economically or socially beneficial business in France, or investing in a French company
- **Employees of innovative companies**: Working at a La French Tech recognized startup or BPI France-certified firm
- Validity: Up to 4 years (renewable); spouse receives matching work authorization automatically

**Long-Stay Work Visa (VLS-TS)**
Standard work visa for employed professionals. Employer must obtain prior authorization from the labor authority (DREETS). Upon arrival, registration with OFII (the French immigration office) is required within 3 months.

**La French Tech Visa**
Streamlined work visa for foreign nationals employed at La French Tech partner companies — the usual labor market test (proving no qualified French candidate was available) is waived. Application is handled online through a dedicated portal.

**Working Holiday Visa (PVT: Programme Vacances Travail)**
For Japanese nationals aged 18–30. One year of work and travel in France; non-renewable. Ideal for exploring France before committing to a longer-term work visa.

**Auto-Entrepreneur (Micro-enterprise)**
France's sole trader registration system is accessible to foreigners. Annual revenue cap for services: EUR 77,700. Often combined with the Talent Passport entrepreneur category.

**Carte de Résident (Permanent Residency)**
Permanent residency after 5 years of lawful residence. Requires French B1 level, integration criteria, and stable income.

### Tax

**Income Tax (Impôt sur le revenu)**
France uses a household unit system (quotient familial) — dependents reduce your effective tax rate.

| Taxable Income (single) | Rate |
|------------------------|------|
| Up to EUR 11,294 | 0% |
| EUR 11,295–28,797 | 11% |
| EUR 28,798–82,341 | 30% |
| EUR 82,342–177,106 | 41% |
| EUR 177,107+ | 45% |

**Social Charges (Cotisations Sociales)**
France's social charges are among the highest in the OECD. Net take-home is typically 75–77% of gross salary.
- Employee contributions: ~22–23% of gross (health, pension, unemployment, etc.)
- Employer contributions: ~40–45% of gross salary (roughly double Japan's rate)
- **CSG (General Social Contribution)**: Additional 9.2% deducted from gross (6.8% is income-tax deductible)

### Rent & Cost of Living

1BR apartments (40–60 m²) in central Paris neighborhoods popular with expats and professionals:

| Neighborhood | 1BR Monthly Rent |
|-------------|-----------------|
| Le Marais (3rd/4th) | EUR 1,800–3,000 |
| Saint-Germain (6th) | EUR 2,000–3,500 |
| Bastille area (11th) | EUR 1,500–2,500 |
| Montmartre (18th) | EUR 1,300–2,200 |
| La Défense (suburb) | EUR 1,100–1,800 |

General living costs (food, transport, utilities): EUR 700–1,000/month. Monthly Navigo transit pass (all zones within Paris): ~EUR 88.

### Cost Summary

| Item | Cost |
|------|------|
| Long-stay visa application (embassy) | EUR 99 |
| Working Holiday PVT fee | Approx. EUR 100 |
| OFII registration tax (upon arrival) | EUR 200–400 (varies by visa type) |
| Carte de résident application | EUR 225 |
| French citizenship application | Free (conditions apply) |

### Pre-Move Checklist

1. **French language**: Outside Paris, English is rarely spoken. B1 French is required for the Carte de Résident, and B2+ significantly expands your job market even in tech companies
2. **Social charge reality check**: Take-home is roughly 75% of gross. Model your budget using net salary, not gross
3. **Paris rental market**: Foreign nationals without a French guarantor should use Visale (government guarantee scheme). Good apartments in central Paris are gone within hours of listing
4. **OFII registration**: All long-stay visa holders must register with OFII within 3 months of arrival and attend a medical appointment — failure affects permit renewal
5. **Talent Passport salary thresholds**: Update annually. Always verify current amounts on service-public.fr before applying

France's bureaucracy is real — OFII processes, prefecture appointments, and tax declarations require patience. But the social security coverage (Sécurité Sociale), robust childcare support, and strong EU residence rights make it a compelling long-term destination for those who qualify for the Talent Passport route.

---

### References

This article is based on the following official sources.

- **France Visa Applications**: [France-Visas Official Portal](https://france-visas.gouv.fr/)
- **Post-Arrival Procedures (OFII)**: [OFII – French Office for Immigration and Integration](https://www.ofii.fr/)
- **Talent Passport & Long-Stay Permits**: [Service-Public.fr – Talent Passport](https://www.service-public.fr/particuliers/vosdroits/F16922)`,
      zh: `法国不仅以时尚、美食和艺术闻名——巴黎的Station F是全球最大的创业园区，而La French Tech生态系统也使法国成为欧洲顶尖的科技人才目的地之一。相对较高的薪资水平与欧洲最完善的社会保障体系，使法国成为具有强大长期定居潜力的移居国。

### 主要签证种类

**人才护照（Passeport Talent）**
法国最核心的高技能人才优惠签证，有效期最长4年，家庭成员可同时获得居留许可。主要类别如下：
- **研究人员及高技能专业人士**：雇用合同或研究协议 + 本科及以上学历。高管及专业职位的年薪目标为 **EUR 46,235以上**（2025年标准，约为法国平均工资的1.5倍）
- **企业高管及专业人员**：年薪EUR 46,235以上的高级职位
- **创业者及投资者**：在法国创办具有经济或社会价值的事业，或向法国企业进行投资
- **创新型企业员工**：受雇于La French Tech认可初创企业或BPI France认证企业
- 有效期：最长4年（可续签）；配偶自动获得同等工作许可

**长期居留工作签证（VLS-TS）**
一般就业签证，雇主须事先向劳动局（DREETS）申请录用许可。抵法后须在3个月内向法国移民融合局（OFII）完成登记手续。

**法国科技签证（La French Tech Visa）**
为受雇于La French Tech合作伙伴企业的外籍人士提供简化签证流程——通常的劳动力市场测试（需证明国内无合格候选人）予以豁免，可通过专属线上平台申请。

**打工度假签证（PVT）**
面向18〜30岁日本国籍者，可在法国工作并居留1年，不可续签。适合在长期就业签证前先行体验法国生活。

**自由职业注册（Auto-entrepreneur / Micro-entreprise）**
法国个体经营注册制度对外籍人士开放，服务业年营业额上限为EUR 77,700，常与人才护照（创业类）结合使用。

**永久居留证（Carte de résident）**
合法居住满5年后可申请，需具备法语B1以上能力、融入社会的证明材料及稳定收入来源。

### 税制

**所得税（Impôt sur le revenu）**
法国采用家庭单位（quotient familial）税制，赡养人口可降低实际税率。

| 应税收入（单身）| 税率 |
|----------------|------|
| EUR 11,294以下 | 0% |
| EUR 11,295〜28,797 | 11% |
| EUR 28,798〜82,341 | 30% |
| EUR 82,342〜177,106 | 41% |
| EUR 177,107以上 | 45% |

**社会保险缴费（Cotisations Sociales）**
法国社会保险费率是经合组织中最高的国家之一，税后到手收入通常约为税前薪资的75〜77%。
- 雇员缴费：约22〜23%（医疗、养老、失业保险等合计）
- 雇主缴费：约为税前薪资的40〜45%（约为日本的两倍水平）
- **CSG（一般社会缴款）**：从税前薪资额外扣除9.2%（其中6.8%可用于抵扣所得税）

### 租金与生活费参考

巴黎外籍人士与专业职集中居住的中心区域1居室（约40〜60㎡）参考租金：

| 区域 | 1居室月租 |
|------|---------|
| 玛黑区（3、4区） | EUR 1,800〜3,000 |
| 圣日耳曼（6区） | EUR 2,000〜3,500 |
| 巴士底周边（11区） | EUR 1,500〜2,500 |
| 蒙马特（18区） | EUR 1,300〜2,200 |
| 拉德芳斯（郊区） | EUR 1,100〜1,800 |

一般生活费（饮食、交通、通信）：每月约EUR 700〜1,000。巴黎Navigo月票（市内全线）：约EUR 88/月。

### 费用参考

| 项目 | 费用 |
|------|------|
| 长期签证申请费（大使馆） | EUR 99 |
| 打工度假（PVT）费用 | 约EUR 100 |
| OFII登记税（入境后） | EUR 200〜400（因签证类别而异） |
| 永久居留证申请费 | EUR 225 |
| 法国国籍申请费 | 免费（须符合条件） |

### 移居前注意事项

1. **法语能力**：巴黎以外城市英语几乎不通用，日常生活和行政手续均需法语；申请永久居留证须具备B1以上水平，B2以上可大幅拓展求职机会
2. **社会保险费实际影响**：到手薪资约为税前的75%，制定预算时须以税后净收入为基准
3. **巴黎租房难题**：无法国担保人的外籍人士可申请政府保证制度（Visale）；中心区优质公寓往往几小时内即告满租
4. **OFII登记义务**：所有长期签证持有人须在抵法后3个月内向OFII完成登记及体检，未完成将影响居留许可续签
5. **人才护照年薪门槛**：每年更新，申请前务必在service-public.fr官网确认最新金额

法国的官僚程序繁琐——OFII手续、县政府预约、税务申报均需耐心应对。但其公共医疗保险（Sécurité Sociale）、完善的育儿支援体系及欧盟居留权，使其成为具有强大吸引力的长期定居目的地，尤其适合符合人才护照申请条件的移居者。

---

### 参考资料

本文信息基于以下官方资料整理。

- **法国签证申请总览**: [France-Visas 官方门户](https://france-visas.gouv.fr/)
- **入境后手续（OFII）**: [OFII – 法国移民融合局](https://www.ofii.fr/)
- **人才护照・长期居留许可**: [Service-Public.fr – 人才护照](https://www.service-public.fr/particuliers/vosdroits/F16922)`,
    },
  },
  {
    slug: "visa-nl",
    category: "visa",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-nl.webp",
    date: "2026-03-19",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】オランダのビザ・就労許可完全ガイド｜HSMビザ・30%ルーリング・永住権",
      en: "【2026 Updated】Netherlands Visa & Work Permit Complete Guide｜HSM Visa, 30% Ruling & Permanent Residency",
      zh: "【2026年最新】荷兰签证与工作许可完全指南｜高技能移民签证・30%税收优惠・永久居留权",
    },
    description: {
      ja: "高度技能移住者ビザ（HSM）・30%ルーリング・スタートアップビザから永住権まで。オランダの税率、社会保険、アムステルダムの家賃相場を徹底解説。",
      en: "HSM visa, 30% ruling, Startup Visa and permanent residency — covering Dutch income tax, social insurance, and Amsterdam rent in expat areas.",
      zh: "高技能移民签证、30%税收优惠、创业签证至永久居留权全解析，涵盖荷兰所得税、社会保险及阿姆斯特丹外籍人士聚居区租金行情。",
    },
    content: {
      ja: `オランダはアムステルダムを中心にASML・フィリップス・ユニリーバ・INGなど多国籍企業のヨーロッパ本社が集まる国です。英語が広く通じる環境、**30%ルーリング**という外国人専用の節税制度、そして日本人がワーキングホリデーなしでも就労ビザを取得しやすい制度設計が大きな魅力です。

### 主なビザの種類

**高度技能移住者ビザ（Highly Skilled Migrant Visa：HSM）**
オランダで圧倒的に多く使用される就労ビザ。IND（オランダ移民局）認定を受けた「スポンサー企業」の雇用契約が必要です。
- 最低月給（2026年目安）：
  - 30歳以上：**EUR 5,942/月**（年収 EUR 71,304）
  - 30歳未満：**EUR 4,357/月**（年収 EUR 52,284）
  - 大学卒業後1年以内：**EUR 3,122/月**（年収 EUR 37,464）
- 有効期間：最大3年（更新可）
- 家族（配偶者・18歳未満の子）は就労可能な家族ビザで同伴可
- 5年の合法的在留後に永住権（Permanent Residence）申請可能

**EUブルーカード（オランダ）**
HSMの代替として取得可能。最低年収 **EUR 71,304**（2026年）。EU内の移動優遇があるため、EU他国でもキャリアを考えている方に有利。

**スタートアップビザ**
イノベーティブなビジネスを立ち上げる起業家向け。ビジネス開発を支援する認定ファシリテーター（Facilitator）との協働が条件。1年間の滞在許可後、自営業ビザへの移行が可能。

**オリエンテーション（ゾーケン）ビザ（Orientation Year / Zoekjaar）**
EU/欧州経済域またはオランダの大学卒業生向けの1年間の求職ビザ。申請は卒業後3年以内。

**自営業ビザ（Zelfstandige zonder personeel：ZZP）**
フリーランサー・個人事業主向け。オランダのBSN番号取得、KvK（商工会議所）登録が必要。IT・クリエイター分野で活用されています。

### 30%ルーリング（30% Ruling）

オランダ独自の外国人向け優遇税制として最も重要な制度。海外から採用された専門職が対象で、給与の30%を課税対象外の費用補填手当として受け取ることができます（最大5年間）。

**2026年時点の現行ルール**
- 非課税率：**30%**（5年間、段階的縮小案は撤回）
- **所得上限（2024年〜）**：WNT基準額（**約EUR 78,600/年**）以下の部分のみ30%非課税が適用。これ以上の高額所得には適用されない点に注意（高収入者への実質的な制限）
- **2027年以降**：非課税率が**27%**に引き下げ予定（新規・既存保有者ともに適用）
- 最低給与条件（2026年）：**EUR 48,013以上**（35歳未満の修士号取得者は EUR 36,377以上）

### 税制

**所得税（Inkomstenbelasting）**
オランダの所得税は2段階構造です（2026年）：
- **第1ブラケット**（〜EUR 38,441）：**36.97%**（うち9.65%が所得税、27.65%が社会保険）
- **第2ブラケット**（EUR 38,441超）：**49.50%**

30%ルーリング適用者は課税所得の30%が非課税となるため、実効税率が大幅に下がります（高給与者で実効税率が35〜40%程度になるケースも）。

**社会保険料**（第1ブラケットに含まれる）
- AOW（老齢年金）：17.90%
- ANW（遺族年金）：0.10%
- WLZ（長期介護保険）：9.65%
- 合計：**27.65%**（第1ブラケット内の課税所得に適用）

### 家賃・生活費の目安

アムステルダムは欧州でも有数の家賃高騰都市。外国人・専門職が集まるエリアの1LDK（約50〜70㎡）：

| エリア | 1LDK家賃 |
|--------|---------|
| アムステルダム中心部（运河エリア・ヨルダーン）| EUR 2,000〜3,500/月 |
| アムステルダム南部（デ・ピップ・アムステルダム南）| EUR 1,800〜3,000/月 |
| ハーグ（Den Haag：外交機関集積）| EUR 1,500〜2,500/月 |
| ロッテルダム（港湾・ビジネス）| EUR 1,300〜2,200/月 |
| ユトレヒト（学術都市）| EUR 1,400〜2,200/月 |

一般生活費（食費・交通・通信）：月EUR 600〜900程度。自転車（新車EUR 300〜700）があれば交通費をほぼゼロにできます。

### 費用の目安

| 項目 | 費用 |
|------|------|
| HSMビザ申請費（IND） | EUR 345 |
| スタートアップビザ申請費 | EUR 345 |
| 永住権申請費 | EUR 233 |
| オランダ国籍申請費 | EUR 190 |
| BSN番号取得（住民登録） | 無料 |
| KvK登録（フリーランス）| EUR 51.95 |

### 移住前のチェックポイント

1. **30%ルーリングの最新状況確認**：2024〜2025年にかけて制度改正が続いています。雇用主のHRや税理士と入社前に詳細を詰めることが重要
2. **住居難（特にアムステルダム）**：物件は募集開始から数時間で埋まることも。Funda・Pararius等のサイトで事前リサーチし、現地で直接内見できる体制を作っておく
3. **BSN番号（個人番号）**：オランダ到着後、最寄りの市役所（Gemeente）でBSN登録が必要。銀行口座開設・税務申告・社会保険加入に必須
4. **英語環境**：オランダは英語話者率が世界最高水準（人口の95%以上が英語可）。オランダ語は不要なケースが多いが、日常生活での習得は友人関係の広がりに寄与
5. **冬季の日照不足**：11〜2月は日照時間が非常に短く、メンタルヘルスへの影響を訴える移住者も。電動自転車や室内ライトの準備を推奨

オランダは英語環境・30%ルーリング・多国籍企業へのアクセスと、欧州移住地として非常にバランスが良い国です。アムステルダムの住宅問題が最大のハードルですが、ロッテルダム・ハーグ・ユトレヒトはより手頃でIT・金融の求人も豊富です。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **高度技能外国人ビザ（Highly Skilled Migrant）**: [IND – オランダ移民局](https://ind.nl/en/residence-permits/work/highly-skilled-migrant)
- **30%税制優遇ルーリング**: [オランダ税務局（Belastingdienst）– 30%ルール](https://www.belastingdienst.nl/wps/wcm/connect/bldcontenten/belastingdienst/individuals/living_and_working/working_in_the_netherlands/you_are_coming_to_work_in_the_netherlands/30_facility_for_incoming_employees)
- **オリエンテーションビザ（求職・創業）**: [IND – オリエンテーション年ビザ](https://ind.nl/en/residence-permits/work/orientation-year-for-highly-educated-persons)`,
      en: `The Netherlands is home to European headquarters of ASML, Philips, Unilever, ING, and dozens of other multinationals. A genuinely English-friendly work culture, the unique **30% ruling** tax benefit, and an efficient visa process for skilled workers make the Netherlands one of Europe's top destinations for expat professionals.

### Main Visa Types

**Highly Skilled Migrant Visa (HSM)**
By far the most used work visa in the Netherlands. Requires an employment contract with an IND-recognized "sponsor" company.
- Minimum monthly salary (2026):
  - Age 30+: **EUR 5,942/month** (EUR 71,304/year)
  - Under 30: **EUR 4,357/month** (EUR 52,284/year)
  - Within 1 year of university graduation: **EUR 3,122/month** (EUR 37,464/year)
- Validity: Up to 3 years (renewable)
- Spouse and children (under 18) can join with family visa; spouse also receives work authorization
- Permanent residency eligible after 5 years of lawful residence

**EU Blue Card (Netherlands)**
Alternative to HSM — minimum annual salary of **EUR 71,304** (2026). Offers EU mobility advantages if you plan to work in multiple EU countries.

**Startup Visa**
For entrepreneurs building innovative businesses. Must partner with a recognized Facilitator (government-approved business development organization). After 1 year, you can transition to a self-employment visa.

**Orientation Year Visa (Zoekjaar)**
1-year job-seeking visa for graduates of EU/EEA or Dutch universities. Must apply within 3 years of graduation.

**Freelancer Visa (ZZP — Zelfstandige zonder personeel)**
For independent professionals. Requires Dutch BSN number and Chamber of Commerce (KvK) registration. Popular in IT, design, and creative fields.

### 30% Ruling

The Netherlands' flagship tax incentive for internationally recruited employees. Qualifying workers can receive 30% of their salary as a tax-free expense reimbursement for up to 5 years.

**Current Rules (2026):**
- Rate: **30%** for the full 5-year period (the planned phased reduction was reversed in 2024)
- **Income cap**: The 30% exemption applies only to income up to the WNT norm (**~EUR 78,600/year** in 2026). Income above this cap is not eligible — a significant change affecting high earners
- **From 2027**: Rate drops to **27%** for the entire 5-year period (for both new and existing ruling holders)
- Minimum salary threshold (2026): **EUR 48,013/year** (EUR 36,377 for under-35 with a master's degree)

### Tax

**Income Tax (Inkomstenbelasting)** — 2 brackets in 2026:
- **Bracket 1** (up to EUR 38,441): **36.97%** (9.65% income tax + 27.65% social insurance)
- **Bracket 2** (above EUR 38,441): **49.50%**

With the 30% ruling, 30% of gross salary is excluded from taxable income, significantly lowering effective tax rates. High earners may see effective rates of 35–40% rather than near-50%.

**Social Insurance** (included in Bracket 1 rate):
- AOW (state pension): 17.90%
- ANW (survivor benefit): 0.10%
- WLZ (long-term care): 9.65%
- Total: **27.65%** (applied to Bracket 1 income only)

### Rent & Cost of Living

Amsterdam is one of Europe's most expensive rental markets. 1BR apartments (50–70 m²) in expat-heavy areas:

| Area | 1BR Monthly Rent |
|------|-----------------|
| Amsterdam City Center (Canal Ring, Jordaan) | EUR 2,000–3,500 |
| Amsterdam South (De Pijp, Zuid) | EUR 1,800–3,000 |
| The Hague (Den Haag — diplomatic hub) | EUR 1,500–2,500 |
| Rotterdam (port city, business district) | EUR 1,300–2,200 |
| Utrecht (university city) | EUR 1,400–2,200 |

General living costs (food, transport, utilities): EUR 600–900/month. A good bicycle (EUR 300–700) effectively eliminates most transport costs.

### Cost Summary

| Item | Cost |
|------|------|
| HSM visa application fee (IND) | EUR 345 |
| Startup visa application fee | EUR 345 |
| Permanent residence permit | EUR 233 |
| Dutch citizenship application | EUR 190 |
| BSN registration (free at municipality) | Free |
| KvK Chamber of Commerce registration (freelance) | EUR 51.95 |

### Pre-Move Checklist

1. **30% Ruling — verify current terms**: The rules changed significantly in 2024 and may change again. Confirm the exact terms with HR and a Dutch tax advisor before accepting an offer
2. **Amsterdam housing crisis**: Properties on Funda/Pararius are gone within hours. Research remotely, but plan to view in person — most landlords won't rent sight unseen
3. **BSN number**: Register at your local Gemeente (municipality) on arrival — BSN is required for bank accounts, tax filings, and social insurance enrollment
4. **English-first culture**: Over 95% of Dutch residents speak English. Dutch language isn't required for work in multinationals, but learning it accelerates social integration
5. **Winter light deprivation**: November–February has very limited daylight hours — many expats report mood challenges. A daylight lamp and regular exercise help

The Netherlands strikes an unusually strong balance for European expat life: English-speaking, internationally oriented, and generous with the 30% ruling. Rotterdam and Utrecht offer similar job market access to Amsterdam at significantly lower living costs — worth seriously considering over Amsterdam when housing is a concern.

---

### References

This article is based on the following official sources.

- **Highly Skilled Migrant Visa**: [IND – Immigration and Naturalisation Service](https://ind.nl/en/residence-permits/work/highly-skilled-migrant)
- **30% Tax Ruling**: [Belastingdienst – 30% Facility for Incoming Employees](https://www.belastingdienst.nl/wps/wcm/connect/bldcontenten/belastingdienst/individuals/living_and_working/working_in_the_netherlands/you_are_coming_to_work_in_the_netherlands/30_facility_for_incoming_employees)
- **Orientation Year Visa (Job Search / Startup)**: [IND – Orientation Year for Highly Educated Persons](https://ind.nl/en/residence-permits/work/orientation-year-for-highly-educated-persons)`,
      zh: `荷兰以阿姆斯特丹为中心，汇聚了ASML、飞利浦、联合利华、ING等众多跨国企业的欧洲总部。全面的英语工作环境、独特的**30%税收优惠制度**，以及对技术人才友好的签证体系，使荷兰成为欧洲最受欢迎的外籍专业人士目的地之一。

### 主要签证种类

**高技能移民签证（Highly Skilled Migrant Visa：HSM）**
荷兰使用最广泛的工作签证，需获得IND（荷兰移民局）认可雇主的担保。
- 最低月薪要求（2026年参考）：
  - 30岁及以上：**EUR 5,942/月**（年薪EUR 71,304）
  - 30岁以下：**EUR 4,357/月**（年薪EUR 52,284）
  - 大学毕业后1年内：**EUR 3,122/月**（年薪EUR 37,464）
- 有效期：最长3年（可续签）
- 配偶及18岁以下子女可持家庭签证同行，配偶同时获得工作许可
- 合法居住满5年后可申请永久居留权

**欧盟蓝卡（荷兰版）**
HSM的替代方案，最低年薪 **EUR 71,304**（2026年），具有欧盟内部流动优势，适合有意在多个欧盟国家发展的申请人。

**创业签证**
面向创立创新型企业的创业者，须与政府认可的"辅导机构"（Facilitator）合作。1年居留许可后可转换为自雇签证。

**定向年签证（Zoekjaar）**
面向欧盟/欧洲经济区或荷兰大学毕业生的1年期求职签证，须在毕业后3年内申请。

**自雇签证（ZZP）**
面向自由职业者及个人经营者，需办理荷兰个人编号（BSN）及商工会议所（KvK）登记，在IT、设计及创意领域广泛应用。

### 30%税收优惠制度（30% Ruling）

荷兰面向从海外引进的专业人才设立的核心税收优惠制度——符合条件的外籍员工可将薪资的30%作为免税费用补贴领取，最长享受5年。

**2026年现行规则**
- 免税比例：**30%**，适用全部5年（分阶段缩减方案已撤回）
- **收入上限（2024年起）**：仅对不超过WNT基准金额（**约EUR 78,600/年**）的收入部分适用30%免税；超出部分不适用（对高收入者影响较大）
- **2027年起**：免税比例将下调至**27%**（适用新旧申请者）
- 最低薪资门槛（2026年）：**EUR 48,013/年**（35岁以下硕士学历者为EUR 36,377/年）

### 税制

**所得税（Inkomstenbelasting）**——2026年两档税率：
- **第一档**（至EUR 38,441）：**36.97%**（所得税9.65% + 社会保险27.65%）
- **第二档**（EUR 38,441以上）：**49.50%**

适用30%优惠制度后，30%的税前薪资不计入应税收入，有效税率大幅降低——高收入者实际税率可降至35〜40%，而非接近50%。

**社会保险缴费**（含于第一档税率中）：
- AOW（国家养老金）：17.90%
- ANW（遗属抚恤金）：0.10%
- WLZ（长期护理保险）：9.65%
- 合计：**27.65%**（仅适用于第一档应税收入部分）

### 租金与生活费参考

阿姆斯特丹是欧洲租金最高的城市之一。外籍人士集中居住区域1居室（约50〜70㎡）参考租金：

| 区域 | 1居室月租 |
|------|---------|
| 阿姆斯特丹市中心（运河区、约旦区）| EUR 2,000〜3,500 |
| 阿姆斯特丹南部（德派普、南区）| EUR 1,800〜3,000 |
| 海牙（外交机关集中）| EUR 1,500〜2,500 |
| 鹿特丹（港口与商业中心）| EUR 1,300〜2,200 |
| 乌特勒支（学术城市）| EUR 1,400〜2,200 |

一般生活费（饮食、交通、通信）：每月约EUR 600〜900。拥有一辆自行车（新车约EUR 300〜700）可将交通支出降至几乎为零。

### 费用参考

| 项目 | 费用 |
|------|------|
| HSM签证申请费（IND） | EUR 345 |
| 创业签证申请费 | EUR 345 |
| 永久居留权申请费 | EUR 233 |
| 荷兰国籍申请费 | EUR 190 |
| BSN注册（市政厅免费办理）| 免费 |
| KvK商工会议所登记（自雇）| EUR 51.95 |

### 移居前注意事项

1. **30%优惠制度——务必确认最新条款**：2024〜2025年间已发生重大变化，接受录用前请务必与HR及荷兰税务顾问确认具体适用条件
2. **阿姆斯特丹租房危机**：Funda/Pararius上的房源往往数小时内即告满；建议提前网上调研，抵达后再现场看房，多数房东不接受远程签约
3. **BSN个人编号**：到达荷兰后须前往所在市政厅（Gemeente）登记，BSN是开立银行账户、申报税务及参加社会保险的必要条件
4. **英语优先文化**：荷兰英语普及率全球最高（超过95%的居民具备英语沟通能力），在跨国企业工作无需荷兰语；但学习荷兰语有助于拓展社交圈
5. **冬季日照不足**：11月至次年2月日照时间极短，许多外籍人士反映对情绪有影响；建议准备全光谱灯并保持规律运动

荷兰在欧洲移居目的地中综合竞争力突出：英语环境、国际化氛围、30%税收优惠三者兼备。阿姆斯特丹住房问题是最大障碍，但鹿特丹和乌特勒支在提供相近就业机会的同时，生活成本更为合理，值得认真考量。

---

### 参考资料

本文信息基于以下官方资料整理。

- **高技能移民签证（Highly Skilled Migrant）**: [IND – 荷兰移民归化局](https://ind.nl/en/residence-permits/work/highly-skilled-migrant)
- **30%税收优惠**: [荷兰税务局（Belastingdienst）– 30%规则](https://www.belastingdienst.nl/wps/wcm/connect/bldcontenten/belastingdienst/individuals/living_and_working/working_in_the_netherlands/you_are_coming_to_work_in_the_netherlands/30_facility_for_incoming_employees)
- **定向签证（求职/创业）**: [IND – 高学历人才定向年签证](https://ind.nl/en/residence-permits/work/orientation-year-for-highly-educated-persons)`,
    },
  },
  {
    slug: "visa-ch",
    category: "visa",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-ch.webp",
    date: "2026-03-19",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】スイスのビザ・就労許可完全ガイド｜BパーミットからC許可・永住権まで",
      en: "【2026 Updated】Switzerland Visa & Work Permit Complete Guide｜B Permit, C Permit & Permanent Residency",
      zh: "【2026年最新】瑞士签证与工作许可完全指南｜B居留许可・C永久居留权・税务全解析",
    },
    description: {
      ja: "Bパーミット・Cパーミット（永住権）・クォータ制度から税率まで。スイスの強制医療保険、チューリッヒ・ジュネーブの家賃相場を徹底解説。",
      en: "B Permit, C Permit, quota system and tax rates — covering mandatory health insurance and rent in Zurich and Geneva expat areas.",
      zh: "B居留许可、C永久居留权、配额制度与税率全解析，涵盖强制医疗保险及苏黎世、日内瓦外籍人士聚居区租金行情。",
    },
    content: {
      ja: `スイスは世界最高水準の給与と生活水準を誇る国で、金融（チューリッヒ・ジュネーブ）・製薬（バーゼル）・時計（ジュラ地方）・テクノロジー（ツーク・チューリッヒ）を中心に外国人専門職の需要が継続して高い国です。EU/EFTAの枠外に位置するため、独自の移民制度が適用されます。

### スイスの就労許可制度

スイスの就労許可はビザではなく「居住許可証（Permit）」として管理されています。EU/EFTA市民は原則自由移動が認められますが、第三国国民（日本人含む）は厳格なクォータと要件審査が適用されます。

**L居住許可（Aufenthaltsbewilligung L）**
1年未満の就労・居住向けの短期許可。年度更新可能なケースもありますが、第三国国民には年間**4,000件**のクォータが設定されています。

**B居住許可（Aufenthaltsbewilligung B）**
1年以上の就労に適用される居住許可で、最も一般的な外国人就労者の在留形式。
- 有効期間：通常1年更新（雇用継続中は更新可）
- **5年の合法的在留後にC許可（永住権）の申請が可能**
- 第三国国民向け年間クォータ：**4,500件**（2026年）
- 雇用主によるカントン（州）への申請が基本。カントンが連邦移民庁（SEM）に承認申請

**C居住許可（Niederlassungsbewilligung C）**
スイスの永住権。取得後は更新不要で、スイス国内に居住し続ける限り有効。
- **一般的に10年の合法的在留が必要**（EU市民は5年）
- 条件：スイスの言語（ドイツ語・フランス語・イタリア語のいずれか）での一定水準の習熟、犯罪歴なし、自立した生計
- Cパーミット取得後、スイス国籍申請は通常C取得から3年以上（州によって異なる）

**第三国国民クォータ制**
スイスは非EU/EFTA国民の就労を連邦クォータで管理しています：
- L許可（短期）：年間4,000件
- B許可（長期）：年間4,500件
- 採用時期・職種・カントンによって実際の申請処理速度が大きく変動

**主な申請要件**
- スイスの認定雇用主との雇用契約
- スイス国内で代替できない高度なスキル・専門知識の証明（「優先審査」の原則）
- 雇用地のカントンによる審査・承認

### 税制

スイスの税制は**連邦税・カントン税・市区町村税**の3層構造で、カントンによって実効税率が大きく異なります。

**連邦所得税（Bundessteuer）**
- 累進課税：0〜11.5%（年収CHF 769,700以上で最高税率）
- 単身・既婚で税率表が異なる

**カントン+市区町村税**
カントンによって大きく異なるのが特徴。ツークは欧州最低水準の低税率で知られます。

| カントン | 合計実効税率（中所得・概算）|
|----------|--------------------------|
| ツーク（Zug）| 約22〜26% |
| ニドバルデン | 約22〜25% |
| チューリッヒ | 約28〜33% |
| ジュネーブ | 約35〜40% |
| バーゼル | 約32〜37% |

**源泉税（Quellensteuer）**
B許可保有者でスイス国籍者と婚姻していない場合、雇用主が給与から自動的に源泉徴収。年収CHF 120,000超または資産・副収入がある場合は翌年に確定申告が必要。

**社会保険料**
- AHV（老齢遺族保険）：8.7%（雇用主・雇用者それぞれ）
- IV（障害保険）：0.7%
- ALV（失業保険）：1.1%（CHF 148,200まで）
- BVG（職業年金）：所得・年齢によって月CHF 200〜500程度

### 強制医療保険（KVG/LAMal）

スイスに居住するすべての人は、民間保険会社が提供する法定医療保険への加入が義務づけられています。
- 月額保険料：CHF 300〜700（カントン・年齢・免責額による）
- 低所得者向け補助金（Prämienverbilligung）あり
- 保険会社は毎年10月に乗り換え可能

### 家賃・生活費の目安

外国人・専門職が集まるエリアの1LDK（約50〜70㎡）：

| 都市・エリア | 1LDK家賃 |
|-------------|---------|
| チューリッヒ（クライス1・2・6区）| CHF 3,000〜5,000/月 |
| ジュネーブ（Eaux-Vives・Plainpalais）| CHF 2,800〜4,500/月 |
| バーゼル（Grossbasel・Kleinbasel）| CHF 2,200〜3,500/月 |
| ツーク（市中心部）| CHF 2,500〜4,000/月 |
| ローザンヌ（Ouchy・Pully）| CHF 2,200〜3,500/月 |

食費（Migros/Coop）：2〜3人分週CHF 200〜400程度。外食1回：CHF 30〜60。チューリッヒ市内月定期：CHF 85〜100程度。

### 費用の目安

| 項目 | 費用 |
|------|------|
| B居住許可申請費（カントンによる） | CHF 65〜200 |
| 在日スイス大使館ビザ申請費 | CHF 80〜 |
| C居住許可申請費 | CHF 100〜200（カントンによる）|
| スイス国籍申請費 | CHF 100〜1,000（自治体による）|
| 強制医療保険（月額目安） | CHF 300〜700/月 |

### 移住前のチェックポイント

1. **クォータの競争**：日本人等の第三国国民のB許可は年間4,500件のみ。雇用主が経験豊富なイミグレーション担当者を持っているかを事前確認
2. **カントン選択と税率**：ツーク・ニドバルデン等の低税率カントンに住むだけで、チューリッヒ在住と比べて手取りが10〜15%程度変わるケースも。通勤圏であれば選択の余地あり
3. **強制医療保険の手続き**：スイス到着後3ヶ月以内に保険加入が義務。比較サイト（Comparis）で最適なプランを選ぶ
4. **不動産市場**：スイスの持ち家率は約35〜40%と欧州最低水準。ほとんどの外国人はアパート（賃貸）からスタート。人気物件は数時間で埋まる
5. **生活費シミュレーション**：年収CHF 100,000でも、チューリッヒでは税・保険・家賃を引いた手取りがCHF 5,000〜6,000/月程度になることも。MoveWorthでの詳細シミュレーションが特に重要

スイスは世界最高水準の給与を誇りますが、生活コストも世界トップクラス。ツーク等の低税カントンを選べば手取りを最大化できます。製薬・金融・テクノロジー分野でトップレベルの専門スキルを持つ方にとって、長期的なキャリア形成と資産形成の両方に優れた国です。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **在留許可・ビザ全般（SEM）**: [スイス国家移民庁（SEM）公式サイト](https://www.sem.admin.ch/sem/en/home/themen/aufenthalt.html)
- **EU/EFTA 以外の外国人向け情報**: [SEM – 第三国国民の就労・在留](https://www.sem.admin.ch/sem/en/home/themen/aufenthalt/nicht_eu_efta.html)
- **スイス就労・投資誘致**: [Switzerland Global Enterprise（公式貿易投資促進機関）](https://www.s-ge.com/)`,
      en: `Switzerland consistently ranks among the world's highest-paying countries, with finance (Zurich, Geneva), pharmaceuticals (Basel), watchmaking (Jura), and technology (Zug, Zurich) all offering strong demand for skilled foreign professionals. As a non-EU country, Switzerland operates its own immigration system with strict quotas for non-EU/EFTA nationals.

### Swiss Work Permit System

Switzerland issues "residence permits" rather than traditional work visas. EU/EFTA citizens enjoy freedom of movement, while third-country nationals (including Japanese) face annual quotas and merit-based review.

**L Permit (Short-Term Residence Permit)**
For stays under 1 year. Subject to an annual national quota of **4,000 permits** for third-country nationals (2026).

**B Permit (Residence Permit)**
The standard long-term work permit for stays of 1+ years — the most common permit for foreign workers in Switzerland.
- Validity: Typically renewed annually while employment continues
- **After 5 years on a B permit, you may apply for a C permit (permanent residence)**
- Annual quota for third-country nationals: **4,500 permits** (2026)
- Employer applies to the cantonal migration office, which then applies to the federal migration authority (SEM)

**C Permit (Permanent Residence)**
Switzerland's permanent residence permit — no renewal required while you remain resident.
- Generally requires **10 years of lawful residence** (5 years for EU nationals)
- Conditions: language proficiency in German, French, or Italian; clean criminal record; financial independence
- Swiss citizenship typically requires 3+ additional years after obtaining the C permit (varies by canton)

**Third-Country Quota System**
Switzerland caps non-EU/EFTA worker permits at a federal level:
- L permits (short-term): 4,000/year
- B permits (long-term): 4,500/year
- Processing speed varies significantly by canton, sector, and timing

**Key Application Requirements**
- Employment contract with a Swiss employer
- Proof that the position cannot be filled by a local candidate (priority review principle)
- Approval by the canton (state) where the employer is based

### Tax

Switzerland's tax system has **three layers**: federal, cantonal, and municipal — with the cantonal component varying enormously by location.

**Federal Income Tax (Bundessteuer)**
- Progressive rates: 0–11.5% (top rate applies above CHF 769,700/year)
- Separate tables for single and married filers

**Cantonal + Municipal Tax**
This is where Switzerland's famous tax competition plays out. Zug and Nidwalden are among Europe's lowest-tax jurisdictions.

| Canton | Combined Effective Rate (mid-income, approx.) |
|--------|-----------------------------------------------|
| Zug | ~22–26% |
| Nidwalden | ~22–25% |
| Zurich | ~28–33% |
| Basel | ~32–37% |
| Geneva | ~35–40% |

**Withholding Tax (Quellensteuer)**
B permit holders not married to a Swiss national have income tax withheld at source by the employer. Those earning over CHF 120,000/year or with additional income/assets must file an annual return.

**Social Insurance Contributions**
- AHV (old age/survivor insurance): 8.7% each from employer and employee
- IV (disability insurance): 0.7%
- ALV (unemployment insurance): 1.1% (up to CHF 148,200)
- BVG (occupational pension): varies by salary and age (approx. CHF 200–500/month)

### Mandatory Health Insurance (KVG/LAMal)

All Swiss residents must enroll in a state-regulated basic health insurance plan offered by private insurers.
- Monthly premium: CHF 300–700 (varies by canton, age, and deductible)
- Means-tested premium subsidies (Prämienverbilligung) available
- You can switch insurer annually each October

### Rent & Cost of Living

1BR apartments (50–70 m²) in expat-heavy central neighborhoods:

| City / Area | 1BR Monthly Rent |
|-------------|-----------------|
| Zurich (Kreis 1, 2, 6) | CHF 3,000–5,000 |
| Geneva (Eaux-Vives, Plainpalais) | CHF 2,800–4,500 |
| Basel (Grossbasel, Kleinbasel) | CHF 2,200–3,500 |
| Zug (city center) | CHF 2,500–4,000 |
| Lausanne (Ouchy, Pully) | CHF 2,200–3,500 |

Groceries (Migros/Coop): CHF 200–400/week for 2–3 people. Dining out: CHF 30–60 per meal. Zurich transit monthly pass: ~CHF 85–100.

### Cost Summary

| Item | Cost |
|------|------|
| B permit application fee (varies by canton) | CHF 65–200 |
| Swiss embassy visa fee (from abroad) | CHF 80+ |
| C permit application fee | CHF 100–200 (canton-dependent) |
| Swiss citizenship application fee | CHF 100–1,000 (municipality-dependent) |
| Mandatory health insurance (monthly estimate) | CHF 300–700/month |

### Pre-Move Checklist

1. **Quota competition**: Japan and other non-EU nationals compete for 4,500 B permits/year — confirm your employer has experienced immigration support before accepting an offer
2. **Canton selection for tax savings**: Choosing Zug or Nidwalden over Zurich can increase take-home pay by 10–15% on the same gross salary — if it's within commuting distance, it's worth exploring
3. **Health insurance enrollment**: Must enroll within 3 months of arrival — use comparison tools like Comparis to find the best plan for your needs
4. **Rental market**: Switzerland's homeownership rate (~35%) is the lowest in Europe — almost all expats rent. Desirable apartments in Zurich and Geneva fill within hours of listing
5. **Net pay simulation**: A CHF 100,000 gross salary in Zurich leaves approximately CHF 5,000–6,000/month after taxes, insurance, and rent — run a detailed MoveWorth simulation before making your decision

Switzerland offers world-class salaries in finance, pharma, and tech, but costs match. Choosing a low-tax canton like Zug can make a significant difference in take-home pay. For senior professionals in high-demand fields, it remains one of the strongest long-term career and wealth-building destinations in the world.

---

### References

This article is based on the following official sources.

- **Residence Permits & Visas (SEM)**: [State Secretariat for Migration (SEM)](https://www.sem.admin.ch/sem/en/home/themen/aufenthalt.html)
- **Non-EU/EFTA Nationals**: [SEM – Work & Residence for Third-Country Nationals](https://www.sem.admin.ch/sem/en/home/themen/aufenthalt/nicht_eu_efta.html)
- **Working & Investing in Switzerland**: [Switzerland Global Enterprise (Official Trade & Investment Promotion)](https://www.s-ge.com/)`,
      zh: `瑞士在金融（苏黎世、日内瓦）、制药（巴塞尔）、钟表（侏罗地区）及科技（楚格、苏黎世）等领域持续对外籍专业人才保持高度需求，薪资水平稳居全球前列。作为非欧盟国家，瑞士实行独立的移民制度，对第三国公民设有严格的年度配额管理。

### 瑞士就业许可制度

瑞士通过"居留许可证（Permit）"而非传统签证来管理工作资格。欧盟/欧洲自由贸易联盟公民原则上享有自由移动权，第三国公民（含日本人）则须经年度配额审批。

**L居留许可（短期居留）**
适用于1年以内的就业居住，第三国公民年度配额为**4,000件**（2026年）。

**B居留许可（长期居留）**
1年以上就业的标准居留许可，是大多数外籍就业者的在留形式。
- 有效期：通常每年续签（就业期间可持续更新）
- **持B许可满5年后可申请C许可（永久居留权）**
- 第三国公民年度配额：**4,500件**（2026年）
- 由雇主向所在州（Canton）移民局提出申请，再向联邦移民局（SEM）报批

**C居留许可（永久居留权）**
取得后只要持续居住即无需续签。
- 一般要求**合法居住满10年**（欧盟公民为5年）
- 条件：具备德语/法语/意大利语一定水准、无犯罪记录、经济独立
- 取得C许可后通常需再等3年以上方可申请瑞士国籍（因州而异）

**第三国公民年度配额制**
- L许可（短期）：每年4,000件
- B许可（长期）：每年4,500件
- 实际审批速度因州、行业及申请时期不同而有较大差异

**主要申请条件**
- 与瑞士雇主签订劳动合同
- 证明该职位在瑞士国内无法找到合适候选人（优先审查原则）
- 由就业所在州移民局审批

### 税制

瑞士税制由**联邦税、州税、市镇税**三层构成，各州税率差异显著。

**联邦所得税（Bundessteuer）**
- 累进税率：0〜11.5%（年收入超CHF 769,700适用最高税率）
- 单身与已婚税率表分别计算

**州税+市镇税**（因州不同差异极大）

| 州 | 合计有效税率（中等收入，约估）|
|----|--------------------------|
| 楚格（Zug） | 约22〜26% |
| 尼德瓦尔登 | 约22〜25% |
| 苏黎世 | 约28〜33% |
| 巴塞尔 | 约32〜37% |
| 日内瓦 | 约35〜40% |

**源泉税（Quellensteuer）**
持B许可且未与瑞士公民婚配者，由雇主从薪资中预扣所得税；年薪超CHF 120,000或有副业收入/资产者，须补报年度税务申报。

**社会保险缴费**
- AHV（养老遗属保险）：雇主与雇员各8.7%
- IV（伤残保险）：0.7%
- ALV（失业保险）：1.1%（至CHF 148,200上限）
- BVG（职业年金）：因薪资和年龄而异（约每月CHF 200〜500）

### 强制医疗保险（KVG/LAMal）

所有瑞士居民须向私人保险公司强制购买法定基本医疗保险。
- 月保费：约CHF 300〜700（因州、年龄及免赔额不同）
- 低收入者可申请保费补贴（Prämienverbilligung）
- 可每年10月自由更换保险公司

### 租金与生活费参考

外籍人士集中居住的中心区域1居室（约50〜70㎡）参考租金：

| 城市/区域 | 1居室月租 |
|----------|---------|
| 苏黎世（第1、2、6区）| CHF 3,000〜5,000 |
| 日内瓦（Eaux-Vives、Plainpalais）| CHF 2,800〜4,500 |
| 巴塞尔（大巴塞尔、小巴塞尔）| CHF 2,200〜3,500 |
| 楚格（市中心）| CHF 2,500〜4,000 |
| 洛桑（Ouchy、Pully）| CHF 2,200〜3,500 |

食品杂货（Migros/Coop）：2〜3人每周约CHF 200〜400。外出用餐：每次约CHF 30〜60。苏黎世交通月票：约CHF 85〜100。

### 费用参考

| 项目 | 费用 |
|------|------|
| B居留许可申请费（因州而异）| CHF 65〜200 |
| 瑞士大使馆签证申请费 | CHF 80起 |
| C居留许可申请费 | CHF 100〜200（因州而异）|
| 瑞士国籍申请费 | CHF 100〜1,000（因市镇而异）|
| 强制医疗保险月费（参考）| CHF 300〜700/月 |

### 移居前注意事项

1. **配额竞争**：非欧盟国公民每年仅有4,500个B许可名额——确认雇主是否具备丰富的移民事务支持经验
2. **州的选择与税率差异**：在楚格或尼德瓦尔登居住比苏黎世手取收入可高出10〜15%——若在通勤范围内值得认真考虑
3. **医疗保险办理**：须在抵达后3个月内完成保险登记，建议使用Comparis等比价工具选择最优方案
4. **租房市场**：瑞士自有住房率约35%为欧洲最低，几乎所有外籍人士均以租房为起点，热门房源往往数小时内即被抢租
5. **到手薪资模拟**：苏黎世年薪CHF 100,000，扣除税款、保险和房租后每月到手可能仅剩CHF 5,000〜6,000——强烈建议在MoveWorth上进行详细测算

瑞士的高薪与高成本并存，选择楚格等低税州居住可显著提升到手收入。对于金融、制药、科技领域的资深专业人才，瑞士仍是兼顾职业发展与资产积累的优质目的地。

---

### 参考资料

本文信息基于以下官方资料整理。

- **居留许可及签证总览（SEM）**: [瑞士国家移民局（SEM）官方网站](https://www.sem.admin.ch/sem/en/home/themen/aufenthalt.html)
- **非欧盟/欧洲自由贸易联盟公民**: [SEM – 第三国公民就业与居留](https://www.sem.admin.ch/sem/en/home/themen/aufenthalt/nicht_eu_efta.html)
- **瑞士就业与投资**: [瑞士全球企业（官方贸易与投资促进机构）](https://www.s-ge.com/)`,
    },
  },
  {
    slug: "visa-au",
    category: "visa",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-au.webp",
    date: "2026-03-19",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】オーストラリアのビザ・移住完全ガイド｜482・189・190・ワーキングホリデー",
      en: "【2026 Updated】Australia Visa & Immigration Complete Guide｜482, 189, 190 & Working Holiday",
      zh: "【2026年最新】澳大利亚签证与移民完全指南｜482・189・190・打工度假签证",
    },
    description: {
      ja: "482ビザ・189永住・190州推薦・491地方ビザ・WHVまで。オーストラリアのポイント制度、所得税、シドニー・メルボルンの家賃相場を徹底解説。",
      en: "482, 189, 190, 491 regional and Working Holiday — covering Australia's points system, income tax, and rent in Sydney and Melbourne expat areas.",
      zh: "482就业、189独立移民、190州提名、491地区及打工度假签证全解析，涵盖澳大利亚积分制度、所得税及悉尼、墨尔本外籍人士聚居区租金行情。",
    },
    content: {
      ja: `オーストラリアはポイントベースの移民制度を採用しており、英語力・職歴・学歴によって永住権（PR）を取得できる国として人気です。IT・医療・建設・エンジニアリング分野では継続的に人材不足が報告されており、スポンサービザの取得がしやすい環境が続いています。

### 主なビザの種類

**482ビザ（Temporary Skill Shortage Visa）**
雇用主スポンサード型の就労ビザ。就労しながらPRを目指す「足がかり」として最も多く使われます。
- **Medium-Term Stream**（MLTSSL掲載職種）：最大4年、482から186（永住）への移行可能
- **Short-Term Stream**（STSOL掲載職種）：最大2年（更新または他ビザへ移行）
- 申請費用：**AUD 3,210〜**（2025年7月改定）
- 家族同伴可（配偶者・子に就労・就学許可）

**186ビザ（Employer Nomination Scheme）**
482から移行する永住ビザ（TRT：Temporary Residence Transition Stream）。3年間の482就労後に申請可能。
- 申請費用：AUD 4,770〜

**189ビザ（Skilled Independent Visa）**
雇用主・州政府のスポンサー不要の独立型永住ビザ。SkillSelectにEOIを提出し、ポイントスコアで招待状（ITA）を待つ制度。
- 最低65ポイント必要（実際のITA発行ラインは職種・時期で異なる）
- 2025年度の主要職種ITA閾値：エンジニア・IT系で概ね80〜90点台
- 申請費用：**AUD 4,640〜**

**190ビザ（Skilled Nominated Visa）**
州・準州政府の推薦が必要な永住ビザ。推薦取得で5ポイント加算されるため、189よりITA取得しやすいケースが多い。
- 推薦要件は州ごとに異なる（就労経験・職種・州への貢献度等）
- 申請費用：**AUD 4,640〜**

**491ビザ（Skilled Work Regional Visa）**
地方地域（Regional Australia）での就労・居住が条件の5年間暫定ビザ。
- 州または連邦の推薦機関が必要
- 3年間の地方就労・居住後に**191ビザ（永住）**への移行可能
- ポイント：地方在住で15ポイント加算

**ワーキングホリデービザ（Subclass 417）**
18〜30歳（一部の国は35歳まで）の日本人向け。1年間の就労・旅行が可能。
- 農業・漁業・採掘・建設・林業等の地方就労：**88日（旧制度）→最低3ヶ月間**で2年目ビザへの延長が可能
- さらに6ヶ月の地方就労で3年目ビザも取得可能
- 申請費用：**AUD 635**

### ポイントシステム（SkillSelect）

| 要素 | ポイント（例）|
|------|-------------|
| 年齢 25〜32歳 | 30pt |
| 英語（IELTSスーペリア Superior / 8.0以上）| 20pt |
| 英語（コンピテント Competent / 6.0以上）| 0pt |
| 海外職歴 8〜10年 | 15pt |
| 豪州内職歴 8〜10年 | 20pt |
| 学士号 | 15pt |
| 博士号 | 20pt |
| 州・地方推薦 | 5〜15pt |
| 配偶者が要件を満たす | 10pt |

最低65点での申請は可能ですが、人気職種では**80〜95点**のITAが発行されるラウンドが多い。

### 税制

**所得税（Income Tax）**
| 課税所得 | 税率 |
|---------|------|
| AUD 18,201〜45,000 | 19% |
| AUD 45,001〜120,000 | 32.5% |
| AUD 120,001〜180,000 | 37% |
| AUD 180,001超 | 45% |
- 非居住者（482就労1年目等）：AUD 0から32.5%適用（免税枠なし）
- **Medicare Levy**：2%（一定収入以上の居住者全員）
- HELP（旧HECS）ローンがある場合は別途返済義務あり

### 家賃・生活費の目安

外国人・専門職が多く住む都市中心部の1LDK（約50〜70㎡）：

| 都市・エリア | 1LDK家賃 |
|-------------|---------|
| シドニー（CBD・サリーヒルズ・ノースシドニー）| AUD 3,000〜4,500/月 |
| メルボルン（CBD・フィッツロイ・サウスヤラ）| AUD 2,500〜3,800/月 |
| ブリスベン（CBD・ニューファーム・フォーティチュードバレー）| AUD 2,200〜3,200/月 |
| パース（CBD・スビアコ・コッツスロー）| AUD 2,000〜3,000/月 |

一般生活費（食費・交通・通信）：月AUD 1,200〜1,800程度（シドニーは高め）。

### 費用の目安

| 項目 | 費用 |
|------|------|
| 482ビザ申請費 | AUD 3,210〜 |
| 189・190ビザ申請費 | AUD 4,640〜 |
| 186ビザ（永住：TRTストリーム）申請費 | AUD 4,770〜 |
| ワーキングホリデー（417）申請費 | AUD 635 |
| スキルズアセスメント費用 | AUD 300〜700程度（機関による）|

### 移住前のチェックポイント

1. **英語力（IELTS）**：就労ビザはCompetent（平均6.0）が最低ライン。189/190のITA競争ではSuperior（平均8.0）で+20ptとなり大きく有利。IELTS対策は移住準備の最優先事項
2. **職種リスト確認（ANZSCO）**：SkillSelectの対象職種はANZSCOコードで管理。自分の職種がMLTSSL・STSOL・どのリストにあるかが全戦略の起点
3. **スキルズアセスメント**：EOI提出前に指定機関（Engineers Australia・ACS・ANMAC等）への職業スキル評価が必要。6週間〜3ヶ月かかるため早めに着手
4. **州推薦（190/491）の活用**：特にIT・医療・工学では複数の州で推薦枠が設けられており、189より確実にITAを得られるケースが多い
5. **地方就労のメリット**：WH2年目・3年目の延長だけでなく、491ビザでのPR取得ルートとして地方は有効な選択肢。生活費もシドニー比で30〜40%安い

オーストラリアはPRへの道筋が比較的明確で、英語圏・気候・ライフスタイルを重視する方に人気の移住先です。シドニーの生活費の高さが課題ですが、メルボルン・ブリスベン・パースは同等の就職市場でより手頃な生活コストを実現できます。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **技能移民ビザ全般**: [オーストラリア内務省 – 技能移民ビザ](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189)
- **SkillSelect EOI**: [SkillSelect – 技能ビザ EOI 登録](https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect)
- **職業リスト（MLTSSL/STSOL等）**: [内務省 – 技能職業リスト](https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list)`,
      en: `Australia's points-based immigration system offers relatively clear pathways to permanent residency (PR) based on English ability, work experience, and education. IT, healthcare, construction, and engineering continue to face skill shortages, making sponsored work visas accessible for qualified candidates.

### Main Visa Types

**Subclass 482 (Temporary Skill Shortage Visa)**
The most commonly used employer-sponsored work visa — the primary "stepping stone" route to PR.
- **Medium-Term Stream** (MLTSSL occupations): Up to 4 years; pathway to Subclass 186 PR
- **Short-Term Stream** (STSOL occupations): Up to 2 years (renewable or transition to another visa)
- Application fee: **AUD 3,210+** (revised July 2025)
- Family members can accompany with work and study rights

**Subclass 186 (Employer Nomination Scheme)**
Permanent visa via the Temporary Residence Transition (TRT) stream — requires 3 years of 482 visa employment before applying.
- Application fee: AUD 4,770+

**Subclass 189 (Skilled Independent Visa)**
Points-tested permanent visa with no employer or state sponsor required. Submit an Expression of Interest (EOI) through SkillSelect and wait for an Invitation to Apply (ITA).
- Minimum 65 points required; actual ITA cut-offs vary by occupation and round
- Recent ITA cut-offs for popular IT/engineering occupations: typically 80–95 points
- Application fee: **AUD 4,640+**

**Subclass 190 (Skilled Nominated Visa)**
Permanent visa requiring state or territory nomination. Nomination adds 5 points, making it easier to secure an ITA than the 189 for many occupations.
- State requirements vary (work experience, occupation, ties to the state, etc.)
- Application fee: **AUD 4,640+**

**Subclass 491 (Skilled Work Regional Visa)**
5-year provisional visa requiring work and residence in regional Australia.
- Requires state or territory nomination
- After 3 years of regional work/residence, can transition to **Subclass 191** (permanent)
- Regional residence adds **15 points** to your SkillSelect score

**Working Holiday Visa (Subclass 417)**
For Japanese nationals aged 18–30 (some countries up to 35). 1 year of work and travel.
- Specified regional work (agriculture, fishing, mining, construction, etc.) for **3 months** enables 2nd-year extension
- Further 6 months of regional work enables 3rd-year extension
- Application fee: **AUD 635**

### Points System (SkillSelect)

| Factor | Points (examples) |
|--------|------------------|
| Age 25–32 | 30 pts |
| English — Superior (IELTS 8.0+) | 20 pts |
| English — Proficient (IELTS 7.0+) | 10 pts |
| English — Competent (IELTS 6.0+) | 0 pts |
| Overseas work experience 8–10 years | 15 pts |
| Australian work experience 8–10 years | 20 pts |
| Bachelor's degree | 15 pts |
| PhD | 20 pts |
| State/territory nomination | 5–15 pts |
| Partner meets requirements | 10 pts |

The minimum threshold is 65 points, but popular occupations often require **80–95 points** for an actual ITA.

### Tax

**Income Tax**
| Taxable Income | Rate |
|----------------|------|
| AUD 18,201–45,000 | 19% |
| AUD 45,001–120,000 | 32.5% |
| AUD 120,001–180,000 | 37% |
| AUD 180,001+ | 45% |
- Non-residents (e.g., 482 holders in first year): 32.5% from dollar one — no tax-free threshold
- **Medicare Levy**: 2% for residents earning above the threshold
- HELP (student loan) repayments are separate if applicable

### Rent & Cost of Living

1BR apartments (50–70 m²) in central expat-heavy neighborhoods:

| City / Area | 1BR Monthly Rent |
|-------------|-----------------|
| Sydney (CBD, Surry Hills, North Sydney) | AUD 3,000–4,500 |
| Melbourne (CBD, Fitzroy, South Yarra) | AUD 2,500–3,800 |
| Brisbane (CBD, New Farm, Fortitude Valley) | AUD 2,200–3,200 |
| Perth (CBD, Subiaco, Cottesloe) | AUD 2,000–3,000 |

General living costs (food, transport, utilities): AUD 1,200–1,800/month (Sydney is higher).

### Cost Summary

| Item | Cost |
|------|------|
| Subclass 482 application fee | AUD 3,210+ |
| Subclass 189/190 application fee | AUD 4,640+ |
| Subclass 186 (PR via TRT) application fee | AUD 4,770+ |
| Working Holiday (417) application fee | AUD 635 |
| Skills assessment fee | AUD 300–700+ (varies by authority) |

### Pre-Move Checklist

1. **IELTS score**: Competent (6.0 average) is the floor for most work visas, but Superior (8.0+) adds 20 points to SkillSelect — a game-changing boost that's worth dedicating serious preparation to
2. **ANZSCO occupation code**: Your occupation's ANZSCO code determines which visa streams you qualify for and what the ITA cut-off looks like — confirming this is the starting point for your entire strategy
3. **Skills assessment timeline**: You must have a positive skills assessment before submitting an EOI — allow 6 weeks to 3 months depending on the assessing authority (Engineers Australia, ACS, ANMAC, etc.)
4. **State nomination (190/491)**: Many states actively nominate IT, healthcare, and engineering candidates — often a more reliable path to an ITA than waiting for 189 invitations
5. **Regional advantage**: Beyond Working Holiday extensions, the 491→191 route offers PR for those willing to live regionally — with living costs 30–40% lower than Sydney

Australia offers one of the most transparent PR pathways among major immigration destinations. Sydney's cost of living is steep, but Melbourne, Brisbane, and Perth offer comparable job markets at meaningfully lower costs.

---

### References

This article is based on the following official sources.

- **Skilled Migration Visas**: [Australian Department of Home Affairs – Skilled Independent Visa](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189)
- **SkillSelect EOI**: [SkillSelect – Expression of Interest Registration](https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect)
- **Occupation Lists (MLTSSL/STSOL etc.)**: [Home Affairs – Skilled Occupation List](https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list)`,
      zh: `澳大利亚采用积分制移民体系，凭借英语能力、工作经验和学历可获得永久居留权（PR），移居路径相对清晰。IT、医疗、建筑及工程领域持续面临技能短缺，具备相关资质的申请人较易获得雇主担保工作签证。

### 主要签证种类

**482签证（临时技术短缺签证）**
最常用的雇主担保就业签证，是大多数申请人通向PR的主要"跳板"。
- **中期流向**（MLTSSL职业）：最长4年，可申请186签证（PR）
- **短期流向**（STSOL职业）：最长2年（可续签或转换其他签证）
- 申请费用：**AUD 3,210起**（2025年7月修订）
- 配偶及子女可持家庭签证同行，享有工作及就学权利

**186签证（雇主提名计划）**
通过临时居留转换（TRT）流向申请的永居签证，须持482签证就业满3年。
- 申请费用：AUD 4,770起

**189签证（独立技术移民签证）**
无需雇主或州政府担保的积分制永居签证，通过SkillSelect提交意向表（EOI）后等待邀请函（ITA）。
- 最低65分方可提交，但实际ITA发放分数线因职业和轮次而异
- 近期IT/工程类热门职业ITA分数线：通常在80〜95分区间
- 申请费用：**AUD 4,640起**

**190签证（州提名技术移民签证）**
需要州/准州政府提名的永居签证，州提名可额外获得5分，通常比189签证更易获得ITA。
- 各州要求不同（工作经验、职业类别、与该州的关联度等）
- 申请费用：**AUD 4,640起**

**491签证（技术工作地区签证）**
须在澳大利亚偏远地区（Regional Australia）就业居住的5年期临时签证。
- 须获得州/准州提名机构推荐
- 在偏远地区就业居住满3年后可转为**191签证（永居）**
- 偏远地区居住可额外获得**15分**积分加成

**打工度假签证（Subclass 417）**
面向18〜30岁日本国籍者（部分国家至35岁），可在澳工作旅行1年。
- 完成**3个月**指定偏远地区工作（农业、渔业、采矿、建筑等）可获第2年延签
- 再完成6个月偏远地区工作可获第3年延签
- 申请费用：**AUD 635**

### 积分制度（SkillSelect）

| 要素 | 积分（示例）|
|------|------------|
| 年龄25〜32岁 | 30分 |
| 英语——优秀（IELTS 8.0以上）| 20分 |
| 英语——熟练（IELTS 7.0以上）| 10分 |
| 英语——胜任（IELTS 6.0以上）| 0分 |
| 海外工作经验8〜10年 | 15分 |
| 澳大利亚工作经验8〜10年 | 20分 |
| 本科学历 | 15分 |
| 博士学历 | 20分 |
| 州/准州提名 | 5〜15分 |
| 配偶符合要求 | 10分 |

最低申请门槛为65分，但热门职业实际ITA发放分数线通常在**80〜95分**区间。

### 税制

**所得税（Income Tax）**
| 应税收入 | 税率 |
|---------|------|
| AUD 18,201〜45,000 | 19% |
| AUD 45,001〜120,000 | 32.5% |
| AUD 120,001〜180,000 | 37% |
| AUD 180,001以上 | 45% |
- 非税务居民（如482签证持有人入境初期）：从第一澳元起适用32.5%，无免税额
- **医疗税附加费（Medicare Levy）**：达到收入门槛的居民须缴纳2%
- 持有HELP助学贷款者需另行还款

### 租金与生活费参考

外籍人士及专业人士集中居住的市中心区域1居室（约50〜70㎡）参考租金：

| 城市/区域 | 1居室月租 |
|----------|---------|
| 悉尼（CBD、萨里山、北悉尼）| AUD 3,000〜4,500 |
| 墨尔本（CBD、菲茨罗伊、南雅拉）| AUD 2,500〜3,800 |
| 布里斯班（CBD、新农场、勇气谷）| AUD 2,200〜3,200 |
| 珀斯（CBD、苏比亚科、科茨斯洛）| AUD 2,000〜3,000 |

一般生活费（饮食、交通、通信）：每月约AUD 1,200〜1,800（悉尼偏高）。

### 费用参考

| 项目 | 费用 |
|------|------|
| 482签证申请费 | AUD 3,210起 |
| 189/190签证申请费 | AUD 4,640起 |
| 186签证（PR/TRT流向）申请费 | AUD 4,770起 |
| 打工度假（417）申请费 | AUD 635 |
| 职业技能评估费 | AUD 300〜700起（因评估机构而异）|

### 移居前注意事项

1. **英语成绩（IELTS）**：就业签证的最低门槛为胜任级（平均6.0），但优秀级（8.0以上）可获20分积分加成——这一差距在竞争激烈的189签证中意义重大，值得投入充分的备考时间
2. **ANZSCO职业代码**：目标职业的ANZSCO代码决定可申请签证种类及ITA分数线，是制定整体移民策略的起点
3. **职业技能评估时间**：提交EOI前须完成指定机构（Engineers Australia、ACS、ANMAC等）的职业评估，通常耗时6周至3个月，应尽早启动
4. **州提名的利用**：多个州对IT、医疗、工程等职业设有专属提名名额，往往比等待189签证ITA更为可靠
5. **偏远地区的优势**：除打工度假延签外，491→191路径也为愿意在偏远地区生活的申请人提供了获得PR的机会，且生活成本比悉尼低30〜40%

澳大利亚在主要移居目的地中拥有最为透明的PR申请路径之一。悉尼生活成本较高，但墨尔本、布里斯班及珀斯提供同等就业机会的同时，生活成本明显更为合理。

---

### 参考资料

本文信息基于以下官方资料整理。

- **技术移民签证总览**: [澳大利亚内政部 – 技术独立签证](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189)
- **SkillSelect意向书**: [SkillSelect – 意向书注册](https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect)
- **职业清单（MLTSSL/STSOL等）**: [内政部 – 技术职业清单](https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list)`,
    },
  },
  {
    slug: "visa-nz",
    category: "visa",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-nz.webp",
    date: "2026-03-19",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】ニュージーランドのビザ・移住完全ガイド｜AEWV・Green List・SMC永住権",
      en: "【2026 Updated】New Zealand Visa & Immigration Complete Guide｜AEWV, Green List & Skilled Migrant PR",
      zh: "【2026年最新】新西兰签证与移民完全指南｜AEWV・绿色清单・技术移民永居权",
    },
    description: {
      ja: "AEWV・Green List（Tier 1/2）・SMC永住ビザ・WH。ニュージーランドの所得税、オークランドの家賃相場、2022年改革の要点を徹底解説。",
      en: "AEWV, Green List Tier 1/2, SMC permanent residency and Working Holiday — covering NZ income tax, Auckland rent in expat areas, and 2022 reform highlights.",
      zh: "AEWV、绿色清单Tier 1/2、SMC永居及打工度假签证全解析，涵盖新西兰所得税、奥克兰外籍人士聚居区租金及2022年移民改革要点。",
    },
    content: {
      ja: `ニュージーランドは豊かな自然環境と高い生活水準を持つ国で、オーストラリアと並んでオセアニアへの移住先として人気があります。2022年に移民制度が大幅に改革され、Green List制度の導入により一部職種では永住権（PR）取得が大幅に加速しました。

### 主なビザの種類

**Accredited Employer Work Visa（AEWV）**
2022年7月に導入されたニュージーランドの主要就労ビザ。従来の複数ビザカテゴリを統合した制度です。
- 要件：ImmNZ認定の認定雇用主（Accredited Employer）からの雇用オファー + 最低賃金基準（2026年：NZD 29.66/時以上が目安）
- 有効期間：最大5年（3年更新の場合は2回更新可）
- 申請費用：**NZD 1,540**（2024年10月改定）
- 家族同伴ビザで配偶者は就労可能

**Green List Visa（グリーンリストビザ）**
2022年導入の特定技能不足職種向け優遇制度。ニュージーランド最速のPRルートです。
- **Tier 1（直接PR申請可）**：医師・看護師・外科医・特定エンジニア・建築家・ICT職種等。ジョブオファーとスキル要件を満たせば即PR申請可
- **Tier 2（2年就労後PR申請可）**：Tier 1より広い職種範囲。AEWVで2年間就労後にRV（Resident Visa）申請可能
- Green List対象職種の最新リストはImmigration New Zealand（INZ）公式サイトで確認

**熟練移住者カテゴリー（Skilled Migrant Category：SMC）**
ポイントベースの永住ビザ。職種・雇用状況・学歴・年齢・英語力でポイントを算出し、定期的な抽選ラウンドで招待状が発行されます。
- 最低申請ポイント：160点（2026年）
- 実際の招待スコアは直近のラウンド状況によって変動
- 申請費用：NZD 4,190〜

**ワーキングホリデービザ（Working Holiday Visa）**
18〜30歳の日本人向け。1年間の就労・滞在が可能。
- 申請費用：**NZD 455**（2025年改定）
- 日本との協定により年間枠あり（通常は余裕あり）
- ニュージーランドはオーストラリアと異なり「農業就労での延長」制度はなし

**Investor Plus Visa / Active Investor Plus Visa**
NZD 5,000,000以上の適格投資でPRへの道。Active Investor Plus（旧Investor 2）はNZD 3,000,000以上の直接投資型。

**Partner / Family Visa**
ニュージーランド市民またはPR保有者のパートナー・家族向けの居住ビザ。長期的な関係の証明が必要。

### 所得税

**個人所得税率（2026年）**
| 課税所得 | 税率 |
|---------|------|
| NZD 14,001〜48,000 | 17.5% |
| NZD 48,001〜70,000 | 30% |
| NZD 70,001〜180,000 | 33% |
| NZD 180,001超 | 39% |
（NZD 14,000まで：10.5%）

**ACC（事故補償公社）賦課金**：所得に対して約1.60%（雇用者負担）。職業によって若干異なる。

**KiwiSaver（強制積立年金）**
雇用者・雇用主がそれぞれ最低3%ずつ拠出。加入は初期強制だが選択脱退可能。

### 家賃・生活費の目安

外国人・専門職が多く住む都市中心部の1LDK（約50〜70㎡）：

| 都市・エリア | 1LDK家賃 |
|-------------|---------|
| オークランド（CBD・ポンソンビー・ニューマーケット）| NZD 2,800〜4,200/月 |
| ウェリントン（CBD・テアロ・カートン）| NZD 2,400〜3,500/月 |
| クライストチャーチ（CBD・サムナー・メリバル）| NZD 2,000〜3,000/月 |
| クイーンズタウン（中心部・Frankton）| NZD 2,500〜3,800/月 |

一般生活費（食費・交通・通信）：月NZD 1,200〜1,800程度。

### 費用の目安

| 項目 | 費用 |
|------|------|
| AEWV申請費 | NZD 1,540 |
| SMC（熟練移住者）申請費 | NZD 4,190〜 |
| Green List Resident Visa申請費 | NZD 4,190〜 |
| ワーキングホリデー申請費 | NZD 455 |
| 投資者ビザ（Active Investor Plus）| NZD 4,190〜 |

### 移住前のチェックポイント

1. **Green List職種の確認が最優先**：自分の職種がTier 1なら即PR申請という圧倒的なルートがある。INZ公式サイトのGreen Listを最初に必ず確認
2. **英語力要件**：AEWV・SMCともに英語能力の証明が必要。IELTSはOverall 6.5〜が多くの職種の目安
3. **認定雇用主（Accredited Employer）の確認**：就労ビザ申請には雇用主のAccredited登録が前提。求人応募時に雇用主の認定状況を確認
4. **オークランドの住宅コスト**：ニュージーランドのGDP・人口の3分の1が集中するオークランドは家賃が高い。ウェリントン・クライストチャーチは同等の就職機会でより低コスト
5. **KiwiSaverの活用**：移住後に3%以上で加入すれば雇用主も同額拠出。将来の帰国時は積立資産を一時金で受け取ることも可能（居住者でなくなった場合）

ニュージーランドはオーストラリアと比べて移民規模が小さく競争が少ない分、Green Listを活用した職種はPR取得が非常にスムーズです。自然環境・生活ペース・英語環境のバランスが良く、特に医療・IT・工学・建設分野でのキャリアを考える方に適した移住先です。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [ニュージーランド移民局（Immigration New Zealand）](https://www.immigration.govt.nz/)
- **グリーンリスト職業（即時 PR 対象）**: [INZ – グリーンリスト職業一覧](https://www.immigration.govt.nz/new-zealand-visas/preparing-a-visa-application/working-in-nz/qualifications-and-work-experience/green-list-occupations)
- **技能移民カテゴリ**: [INZ – Skilled Migrant Category](https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/visa-factsheet/skilled-migrant-category-resident-visa)`,
      en: `New Zealand offers stunning natural scenery and a high quality of life alongside Australia as one of Oceania's top immigration destinations. The 2022 immigration reform — including the introduction of the Green List — accelerated PR pathways significantly for shortage occupations.

### Main Visa Types

**Accredited Employer Work Visa (AEWV)**
New Zealand's primary work visa since July 2022, consolidating multiple previous visa categories.
- Requirements: Job offer from an INZ-accredited employer + minimum wage threshold (approx. NZD 29.66/hour in 2026)
- Validity: Up to 5 years (3-year grants with up to 2 renewals)
- Application fee: **NZD 1,540** (revised October 2024)
- Partner can work on a partner visa

**Green List Visa**
New Zealand's fastest PR route, introduced in 2022 for specific shortage occupations.
- **Tier 1 (direct PR)**: Doctors, nurses, surgeons, select engineers, architects, and certain ICT roles. Qualify on skills + job offer → apply directly for Resident Visa
- **Tier 2 (PR after 2 years)**: Broader occupation list. Work 2 years on an AEWV, then apply for Resident Visa
- Check the current Green List on the Immigration New Zealand (INZ) official website

**Skilled Migrant Category (SMC)**
Points-based permanent residency visa. Points awarded for occupation, employment, qualifications, age, and English proficiency — periodic ballots issue invitations.
- Minimum threshold: 160 points (2026)
- Actual invitation cut-off varies by ballot round
- Application fee: NZD 4,190+

**Working Holiday Visa**
For Japanese nationals aged 18–30. 1 year of work and stay.
- Application fee: **NZD 455** (2025 rate)
- Unlike Australia, New Zealand does not offer regional work extensions for a 2nd or 3rd year

**Active Investor Plus Visa**
Pathway to PR via NZD 3,000,000+ in eligible direct investment.

**Partner / Family Visa**
For partners and family of NZ citizens or PR holders. Requires proof of genuine relationship.

### Income Tax

| Taxable Income | Rate |
|----------------|------|
| Up to NZD 14,000 | 10.5% |
| NZD 14,001–48,000 | 17.5% |
| NZD 48,001–70,000 | 30% |
| NZD 70,001–180,000 | 33% |
| NZD 180,001+ | 39% |

**ACC levy**: ~1.60% of income (employee-side); covers work and non-work accident compensation.

**KiwiSaver**: Mandatory enrollment in a retirement savings scheme — minimum 3% from both employee and employer. You can opt out after initial enrollment period.

### Rent & Cost of Living

1BR apartments (50–70 m²) in central expat-friendly neighborhoods:

| City / Area | 1BR Monthly Rent |
|-------------|-----------------|
| Auckland (CBD, Ponsonby, Newmarket) | NZD 2,800–4,200 |
| Wellington (CBD, Te Aro, Karori) | NZD 2,400–3,500 |
| Christchurch (CBD, Sumner, Merivale) | NZD 2,000–3,000 |
| Queenstown (central, Frankton) | NZD 2,500–3,800 |

General living costs (food, transport, utilities): NZD 1,200–1,800/month.

### Cost Summary

| Item | Cost |
|------|------|
| AEWV application fee | NZD 1,540 |
| SMC (Skilled Migrant) application fee | NZD 4,190+ |
| Green List Resident Visa application fee | NZD 4,190+ |
| Working Holiday Visa fee | NZD 455 |
| Active Investor Plus Visa application fee | NZD 4,190+ |

### Pre-Move Checklist

1. **Check the Green List first**: If your occupation is Tier 1, you can apply directly for PR — this is one of the most straightforward PR routes in the developed world. Always start with the INZ Green List before planning anything else
2. **English requirement**: AEWV and SMC both require demonstrated English ability — IELTS Overall 6.5+ is a common benchmark for most occupations
3. **Accredited Employer verification**: Your employer must hold INZ accreditation for the AEWV to be valid — confirm this during the job application process
4. **Auckland vs. other cities**: Auckland concentrates roughly a third of NZ's GDP and population — it's expensive. Wellington and Christchurch offer similar job market access at 20–30% lower rents
5. **KiwiSaver portability**: If you leave NZ permanently, your KiwiSaver balance can be withdrawn as a lump sum — factor this into your financial planning

New Zealand's smaller scale means less competition for skilled migrants compared to Australia. Green List occupations in healthcare, IT, engineering, and construction offer some of the fastest PR pathways anywhere in the developed world.

---

### References

This article is based on the following official sources.

- **Visas & Residence General**: [Immigration New Zealand (INZ)](https://www.immigration.govt.nz/)
- **Green List Occupations (Direct PR Pathway)**: [INZ – Green List Occupation Search](https://www.immigration.govt.nz/new-zealand-visas/preparing-a-visa-application/working-in-nz/qualifications-and-work-experience/green-list-occupations)
- **Skilled Migrant Category**: [INZ – Skilled Migrant Category Resident Visa](https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/visa-factsheet/skilled-migrant-category-resident-visa)`,
      zh: `新西兰拥有壮丽的自然风光和高品质的生活，是与澳大利亚并列的大洋洲热门移居目的地。2022年移民制度改革——尤其是绿色清单制度的引入——大幅加快了紧缺职业申请人获得永居权（PR）的速度。

### 主要签证种类

**认证雇主工作签证（AEWV）**
2022年7月推出的新西兰主要就业签证，整合了此前多个签证类别。
- 要求：获得INZ认证雇主的录用邀请 + 满足最低时薪标准（2026年参考：约NZD 29.66/小时）
- 有效期：最长5年（3年期可续签最多2次）
- 申请费用：**NZD 1,540**（2024年10月修订）
- 配偶可持家庭签证同行并享有工作权利

**绿色清单签证（Green List Visa）**
2022年引入的特定紧缺技能职业优惠制度，是新西兰获得PR速度最快的路径。
- **第一层级（可直接申请PR）**：医生、护士、外科医生、特定工程师、建筑师及部分ICT职业。满足技能要求并持有录用邀请即可直接申请居留签证
- **第二层级（就业2年后可申请PR）**：覆盖更广泛的职业范围。持AEWV工作满2年后可申请居留签证
- 最新绿色清单请在移民局（INZ）官方网站查阅

**技术移民签证（Skilled Migrant Category：SMC）**
积分制永居签证，依据职业、就业状况、学历、年龄及英语能力综合评分，定期举行抽签发放邀请函。
- 最低申请分数：160分（2026年）
- 实际邀请分数线随轮次而变
- 申请费用：NZD 4,190起

**打工度假签证（Working Holiday Visa）**
面向18〜30岁日本国籍者，可在新西兰工作居住1年。
- 申请费用：**NZD 455**（2025年费率）
- 与澳大利亚不同，新西兰不提供通过农业就业延签的第2年/第3年制度

**主动投资者增强签证（Active Investor Plus Visa）**
通过NZD 3,000,000以上的合格直接投资获得永居权。

**配偶/家庭签证**
面向新西兰公民或PR持有者的伴侣及家庭成员，须证明真实稳定的关系。

### 所得税

| 应税收入 | 税率 |
|---------|------|
| 至NZD 14,000 | 10.5% |
| NZD 14,001〜48,000 | 17.5% |
| NZD 48,001〜70,000 | 30% |
| NZD 70,001〜180,000 | 33% |
| NZD 180,001以上 | 39% |

**ACC（事故赔偿公司）缴费**：约占收入的1.60%（雇员承担），覆盖工作及非工作事故赔偿。

**KiwiSaver（强制养老储蓄计划）**：雇员和雇主各最低缴纳3%；初期强制加入，可在加入后选择退出。

### 租金与生活费参考

外籍人士集中居住的市中心区域1居室（约50〜70㎡）参考租金：

| 城市/区域 | 1居室月租 |
|----------|---------|
| 奥克兰（CBD、庞森比、纽马基特）| NZD 2,800〜4,200 |
| 惠灵顿（CBD、特阿罗、卡罗里）| NZD 2,400〜3,500 |
| 基督城（CBD、萨姆纳、梅里韦尔）| NZD 2,000〜3,000 |
| 皇后镇（市中心、弗兰克顿）| NZD 2,500〜3,800 |

一般生活费（饮食、交通、通信）：每月约NZD 1,200〜1,800。

### 费用参考

| 项目 | 费用 |
|------|------|
| AEWV申请费 | NZD 1,540 |
| SMC（技术移民）申请费 | NZD 4,190起 |
| 绿色清单居留签证申请费 | NZD 4,190起 |
| 打工度假签证申请费 | NZD 455 |
| 主动投资者增强签证申请费 | NZD 4,190起 |

### 移居前注意事项

1. **优先查阅绿色清单**：若您的职业属于第一层级，可直接申请PR——这是发达国家中最为直接的永居申请路径之一。制定移居计划前务必先查阅INZ官方绿色清单
2. **英语能力要求**：AEWV和SMC均须证明英语能力，多数职业参考标准为IELTS总分6.5以上
3. **认证雇主确认**：AEWV申请的前提是雇主持有INZ认证，在申请职位时应提前确认雇主的认证状态
4. **奥克兰与其他城市的选择**：奥克兰集中了新西兰约三分之一的GDP和人口，租金较高；惠灵顿和基督城提供相近就业机会，租金低20〜30%
5. **KiwiSaver的灵活性**：永久离开新西兰后，KiwiSaver账户余额可一次性提取——建议将此纳入财务规划

新西兰规模相对较小，技术移民竞争压力低于澳大利亚。医疗、IT、工程及建筑领域的绿色清单职业提供了发达国家中最快捷的PR申请路径之一，非常适合有意在良好自然环境中建立长期职业发展基础的移居者。

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留总览**: [新西兰移民局（Immigration New Zealand）](https://www.immigration.govt.nz/)
- **绿色清单职业（直通PR路径）**: [INZ – 绿色清单职业查询](https://www.immigration.govt.nz/new-zealand-visas/preparing-a-visa-application/working-in-nz/qualifications-and-work-experience/green-list-occupations)
- **技能移民类别**: [INZ – 技能移民类别居民签证](https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/visa-factsheet/skilled-migrant-category-resident-visa)`,
    },
  },
  {
    slug: "visa-ae",
    category: "visa",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-ae.webp",
    date: "2026-03-19",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】UAE（ドバイ）のビザ・就労許可完全ガイド｜ゴールデンビザ・就労ビザ・税制",
      en: "【2026 Updated】UAE (Dubai) Visa & Work Permit Complete Guide｜Golden Visa, Employment Visa & Zero Tax",
      zh: "【2026年最新】阿联酋（迪拜）签证与工作许可完全指南｜黄金签证・就业签证・零税率",
    },
    description: {
      ja: "ゴールデンビザ・就労ビザ・フリーランスビザ・デジタルノマドビザまで。UAEの所得税ゼロの詳細、フリーゾーン制度、ドバイの家賃相場を徹底解説。",
      en: "Golden Visa, Employment Visa, Freelance Visa, Digital Nomad Visa — covering UAE's zero income tax, free zone system, and Dubai rent in expat areas.",
      zh: "黄金签证、就业签证、自由职业签证、数字游民签证全解析，涵盖阿联酋零所得税制度、自由区体系及迪拜外籍人士聚居区租金行情。",
    },
    content: {
      ja: `UAEは個人所得税ゼロの国として、金融・IT・ビジネス・医療分野の外国人専門職を世界中から惹きつけています。ドバイ・アブダビを中心に世界トップクラスのインフラと生活水準を提供しつつ、2023年に導入された法人税（9%）と2025年に拡大されたVAT（5%）が財政基盤を支えています。

### 主なビザの種類

**ゴールデンビザ（Golden Visa）：10年居住ビザ**
2019年に導入されたUAEの長期居住制度。家族同伴・スポンサー不要・雇用主変更自由という破格の条件が特徴です。
- **投資家**：UAE不動産にAED 2,000,000以上投資（ローン不可、全額自己資金）
- **起業家**：UAE政府機関承認のイノベーション事業、または年間売上AED 1,000,000以上のスタートアップ創業者
- **高度技能専門家**：特定の戦略的職種（医師・エンジニア・IT専門家・科学者・弁護士等）で月給**AED 30,000以上**
- **傑出した学生・研究者**：GPA 3.75以上またはUAEの大学での学術的優秀性の証明
- **特別才能（芸術・文化・スポーツ）**：UAE政府認定機関からの推薦
- 申請費用：**AED 2,800〜**（居住地の首長国により異なる）

**就労ビザ（Employment Visa）：2〜3年**
UAE企業に雇用される際の標準ビザ。雇用主がスポンサーとなり、労働許可（Work Permit）と居住ビザをセットで申請します。
- 有効期間：2〜3年（更新可）
- 通常は雇用主が申請費用（AED 1,200〜1,600程度）を負担
- 雇用主変更時は新たなビザ申請が必要（ゴールデンビザとの主な違い）
- エミレーツIDの取得が在留・銀行口座・医療に必須

**フリーランスビザ（Freelance Visa）**
フリーゾーン経由での個人事業者向けビザ。ドバイメディアシティ・TECOM・DMCC等多数のフリーゾーンが独自のフリーランス許可を発行。
- 申請費用：AED 7,500〜15,000程度（フリーゾーンによる）
- フリーゾーン内での事業は法人税免除・完全外国人所有可能（2021年改正で本土での外国100%所有も原則可能に）

**デジタルノマドビザ（Virtual Working Programme）**
ドバイが2021年に導入した遠隔就労者向け1年間ビザ。
- 要件：海外の雇用主・クライアントからの月収**USD 5,000以上**の証明
- 有効期間：1年（更新可）
- UAEの個人所得税ゼロを享受しながら世界中のクライアントと仕事が可能

**リタイアメントビザ（5年）**
55歳以上で以下のいずれかを満たす場合：
- 月収AED 20,000以上の年金収入
- UAE内に評価額AED 2,000,000以上の不動産所有
- 貯蓄AED 1,000,000以上

### 税制

**個人所得税**：**ゼロ**（UAEには個人所得税が存在しない）

**法人税（Corporate Tax）**
- 2023年6月より導入：課税所得AED 375,000超に**9%**
- フリーゾーン事業の適格収益：引き続き0%（条件あり）

**VAT（付加価値税）**：**5%**（2018年導入）

**社会保険**：UAE国民は17.5%（雇用者負担分含む）が義務。**外国人（日本人含む）は社会保険負担なし**。

**実効手取り率**：日本やヨーロッパからUAEへ転職した場合、所得税・社会保険ゼロにより手取りが30〜50%増加するケースが多い。

### 家賃・生活費の目安

ドバイで外国人・専門職が多く住む主要エリアの1LDK（約60〜90㎡）：

| エリア | 1LDK家賃 |
|--------|---------|
| ダウンタウンドバイ（ブルジュハリファ周辺）| AED 12,000〜20,000/月 |
| ドバイマリーナ・JBR | AED 10,000〜17,000/月 |
| ジュメイラレークタワーズ（JLT）| AED 8,000〜13,000/月 |
| ビジネスベイ | AED 9,000〜15,000/月 |
| アブダビ中心部（コーニッシュ・リーム島）| AED 8,000〜15,000/月 |

一般生活費（食費・交通・通信）：月AED 3,000〜5,000程度。ドバイはアルコール（課税あり）・外食が高め。

### 費用の目安

| 項目 | 費用 |
|------|------|
| ゴールデンビザ申請費 | AED 2,800〜 |
| 就労ビザ（雇用主負担が一般的） | AED 1,200〜1,600 |
| フリーランスビザ（フリーゾーン） | AED 7,500〜15,000 |
| デジタルノマドビザ | USD 287〜（手数料）|
| エミレーツID取得費 | AED 370〜 |
| 医療保険（雇用主提供の場合も）| AED 500〜2,000/月 |

### 移住前のチェックポイント

1. **所得税ゼロの計算を正確に**：給与が大幅に増えるのは確かだが、ドバイの家賃・教育費・アルコール・医療保険は高水準。MoveWorthでの日本比較シミュレーションを強く推奨
2. **ゴールデンビザの活用**：高度技能専門家カテゴリは月給AED 30,000（約120万円）以上が要件。該当する場合はスポンサー不要・雇用主変更自由な10年ゴールデンビザが最有力
3. **医療保険**：UAEでは居住者全員への医療保険加入が法律で義務づけられています。雇用主が提供するケースが多いが、フリーランスは自己負担
4. **フリーゾーン vs 本土（Mainland）**：フリーゾーンは法人税免除・外国人完全所有可能だが、直接UAE国内のエンドユーザーへの販売には制限がある場合がある。本土は制限が少ないが設立費用が高め
5. **文化・生活習慣**：イスラム教を国教とする国。ラマダン中の日中の公共での飲食禁止、酒類は指定施設のみ販売等の規制を事前に把握

UAEは所得税ゼロ・世界クラスのインフラ・地政学的な中継点という三拍子が揃った移住先です。特に高収入の専門職にとって、日本や欧州との手取り差は非常に大きく、3〜5年の戦略的移住として選択する方も増えています。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ゴールデンビザ（長期在留ビザ）**: [UAE 連邦身分市民庁（ICP）– ゴールデンビザ](https://icp.gov.ae/en/ResidencyAndCitizenship/GoldenVisa)
- **ドバイ在留ビザ・手続き全般**: [GDRFA ドバイ – 在留手続きポータル](https://www.gdrfad.gov.ae/)
- **UAE 政府公式ポータル**: [UAE 政府公式サービスガイド](https://u.ae/en/information-and-services/visa-and-emirates-id)`,
      en: `The UAE attracts top-tier foreign professionals in finance, IT, business, and healthcare with its zero personal income tax policy. Dubai and Abu Dhabi offer world-class infrastructure and lifestyle, supported by a 9% corporate tax (introduced 2023) and 5% VAT.

### Main Visa Types

**Golden Visa (10-Year Residence)**
UAE's flagship long-term residency scheme introduced in 2019. No employer sponsor required, free to change employers, and family members included.
- **Investors**: AED 2,000,000+ in UAE real estate (full cash, no mortgage)
- **Entrepreneurs**: UAE government-approved innovative business, or startup founder with AED 1,000,000+ annual revenue
- **Highly skilled professionals**: Strategic occupations (doctors, engineers, IT specialists, scientists, lawyers) with monthly salary **AED 30,000+**
- **Outstanding students/researchers**: GPA 3.75+ or academic excellence at a UAE university
- **Special talents**: Artists, cultural figures, sports professionals endorsed by UAE government bodies
- Application fee: **AED 2,800+** (varies by emirate)

**Employment Visa (2–3 Years)**
Standard visa for UAE-employed professionals. Employer sponsors and applies for both the work permit and residence visa.
- Validity: 2–3 years (renewable)
- Employer typically pays application fees (approx. AED 1,200–1,600)
- Changing employers requires a new visa application (key difference from Golden Visa)
- Emirates ID is required for all residence, banking, and healthcare activities

**Freelance Visa**
Individual business visa via a free zone — Dubai Media City, TECOM, DMCC, and dozens of others each issue their own freelance permits.
- Application fee: AED 7,500–15,000 (varies by free zone)
- Free zone businesses: exempt from corporate tax and allow 100% foreign ownership (2021 reform also enabled 100% ownership on mainland in most sectors)

**Digital Nomad Visa (Virtual Working Programme)**
Dubai's 1-year remote worker visa introduced in 2021.
- Requirement: Proof of **USD 5,000+/month** income from overseas employer or clients
- Validity: 1 year (renewable)
- Enjoy UAE's zero income tax while working for global clients

**Retirement Visa (5 Years)**
For those 55+ meeting any one of:
- Pension income AED 20,000+/month
- UAE real estate valued at AED 2,000,000+
- Savings of AED 1,000,000+

### Tax

**Personal Income Tax**: **Zero** — the UAE has no personal income tax at all.

**Corporate Tax**: 9% on taxable income above AED 375,000 (introduced June 2023). Qualifying free zone income remains at 0% (conditions apply).

**VAT**: 5% (introduced 2018)

**Social Insurance**: UAE nationals pay 17.5% (including employer contribution). **Foreign nationals (including Japanese) have no social insurance obligations.**

**Take-home comparison**: Moving to UAE from Japan or Europe typically increases after-tax income by 30–50% on equivalent gross salaries.

### Rent & Cost of Living

1BR apartments (60–90 m²) in popular expat neighborhoods in Dubai:

| Area | 1BR Monthly Rent |
|------|-----------------|
| Downtown Dubai (Burj Khalifa district) | AED 12,000–20,000 |
| Dubai Marina / JBR | AED 10,000–17,000 |
| Jumeirah Lake Towers (JLT) | AED 8,000–13,000 |
| Business Bay | AED 9,000–15,000 |
| Abu Dhabi (Corniche, Reem Island) | AED 8,000–15,000 |

General living costs (food, transport, utilities): AED 3,000–5,000/month. Alcohol (taxed) and dining out are expensive.

### Cost Summary

| Item | Cost |
|------|------|
| Golden Visa application fee | AED 2,800+ |
| Employment visa (typically employer-paid) | AED 1,200–1,600 |
| Freelance visa (via free zone) | AED 7,500–15,000 |
| Digital Nomad Visa | USD 287+ (fees) |
| Emirates ID | AED 370+ |
| Health insurance (may be employer-provided) | AED 500–2,000/month |

### Pre-Move Checklist

1. **Model the actual take-home gain**: Zero income tax is real, but Dubai rents, school fees (for families), alcohol, and health insurance are expensive — run a MoveWorth simulation comparing your Dubai net vs. Japan/home country net before deciding
2. **Golden Visa eligibility check**: The AED 30,000/month (≈USD 8,200) salary threshold for the skilled professional category covers many finance, tech, and medical roles — if you qualify, the 10-year sponsor-free Golden Visa is the obvious choice
3. **Mandatory health insurance**: All UAE residents are legally required to hold health insurance. Most employers provide it, but freelancers must self-fund
4. **Free zone vs. mainland**: Free zones offer corporate tax exemption and full foreign ownership, but may restrict direct sales to UAE-based end customers. Mainland allows broader commercial activity but higher setup costs
5. **Cultural norms**: UAE is an Islamic country — no public consumption of food/drink during Ramadan daylight hours, alcohol only available at licensed venues, dress modestly in public spaces

The UAE offers a compelling combination of zero income tax, world-class infrastructure, and strategic geographic location. For high-earning professionals, the take-home gap vs. Europe or Japan is substantial. Many choose UAE for a strategic 3–5 year stint focused on wealth accumulation.

---

### References

This article is based on the following official sources.

- **Golden Visa (Long-Term Residency)**: [ICP – UAE Golden Visa](https://icp.gov.ae/en/ResidencyAndCitizenship/GoldenVisa)
- **Dubai Residency & Procedures**: [GDRFA Dubai – Residency Portal](https://www.gdrfad.gov.ae/)
- **UAE Government Official Portal**: [UAE Government – Visa and Emirates ID Services](https://u.ae/en/information-and-services/visa-and-emirates-id)`,
      zh: `阿联酋以零个人所得税政策吸引着金融、IT、商业及医疗领域的顶尖外籍专业人才。迪拜和阿布扎比提供世界一流的基础设施与生活水准，财政基础由2023年引入的9%企业所得税及5%增值税共同支撑。

### 主要签证种类

**黄金签证（10年居留签证）**
阿联酋2019年推出的长期居留制度，无需雇主担保、可自由更换雇主、家庭成员同步获益。
- **投资者**：在阿联酋房产全款投资AED 2,000,000以上（不可使用按揭）
- **创业者**：获得阿联酋政府机构认可的创新型商业项目，或年营业额超AED 1,000,000的初创企业创始人
- **高技能专业人才**：战略性职业（医生、工程师、IT专家、科学家、律师等），月薪**AED 30,000以上**
- **优秀学生/研究人员**：GPA 3.75以上或在阿联酋大学取得突出学术成就
- **特殊才能人才**：艺术、文化、体育领域经阿联酋政府认可机构推荐者
- 申请费用：**AED 2,800起**（因酋长国而异）

**就业签证（2〜3年）**
受雇于阿联酋企业的标准签证，雇主担保并同步申请劳动许可与居留签证。
- 有效期：2〜3年（可续签）
- 申请费用通常由雇主承担（约AED 1,200〜1,600）
- 更换雇主须重新申请签证（与黄金签证的主要区别）
- 阿联酋身份证（Emirates ID）是居留、开户、就医的必要证件

**自由职业签证**
通过自由区办理的个人经营签证，迪拜媒体城、TECOM、DMCC等数十个自由区各自发放自由职业许可。
- 申请费用：约AED 7,500〜15,000（因自由区而异）
- 自由区内企业可享受企业税豁免、外资100%所有权（2021年改革后在绝大多数行业大陆注册也可实现外资100%持股）

**数字游民签证（Virtual Working Programme）**
迪拜2021年推出的远程办公者1年期签证。
- 要求：证明来自海外雇主或客户的月收入达**USD 5,000以上**
- 有效期：1年（可续签）
- 可在享受阿联酋零所得税的同时服务全球客户

**退休签证（5年）**
55岁以上且满足以下任一条件：
- 月养老金收入AED 20,000以上
- 持有阿联酋评估价值AED 2,000,000以上的房产
- 储蓄AED 1,000,000以上

### 税制

**个人所得税**：**零**——阿联酋完全没有个人所得税。

**企业所得税**：2023年6月起对超过AED 375,000的应税收入征收**9%**；符合条件的自由区收入继续适用0%税率。

**增值税（VAT）**：**5%**（2018年引入）

**社会保险**：阿联酋公民须缴纳17.5%（含雇主承担部分）；**外籍人士（含日本人）无需缴纳社会保险**。

**实际到手收入对比**：从日本或欧洲跳槽至阿联酋，在同等税前薪资下，到手收入通常增加30〜50%。

### 租金与生活费参考

迪拜外籍人士聚集的主要区域1居室（约60〜90㎡）参考月租：

| 区域 | 1居室月租 |
|------|---------|
| 迪拜市中心（哈利法塔周边）| AED 12,000〜20,000 |
| 迪拜码头/JBR | AED 10,000〜17,000 |
| 朱美拉湖泊塔（JLT）| AED 8,000〜13,000 |
| 商业湾（Business Bay）| AED 9,000〜15,000 |
| 阿布扎比（滨海步道、礁石岛）| AED 8,000〜15,000 |

一般生活费（饮食、交通、通信）：每月约AED 3,000〜5,000。酒精饮料（须缴税）及外出用餐费用较高。

### 费用参考

| 项目 | 费用 |
|------|------|
| 黄金签证申请费 | AED 2,800起 |
| 就业签证（通常由雇主承担）| AED 1,200〜1,600 |
| 自由职业签证（自由区）| AED 7,500〜15,000 |
| 数字游民签证 | USD 287起（手续费）|
| 阿联酋身份证（Emirates ID）| AED 370起 |
| 医疗保险（雇主可能提供）| AED 500〜2,000/月 |

### 移居前注意事项

1. **精确计算实际收益**：零所得税确实可观，但迪拜的房租、子女教育费、酒类消费及医疗保险费用同样不低——强烈建议使用MoveWorth模拟迪拜与日本/本国的税后收入对比后再做决定
2. **黄金签证资格确认**：专业技能人才类别要求月薪AED 30,000（约USD 8,200）以上，覆盖众多金融、科技及医疗职位——符合条件者，10年期无需担保的黄金签证是首选
3. **强制医疗保险**：阿联酋法律要求所有居民持有医疗保险，大多数雇主提供，自由职业者须自行购买
4. **自由区vs大陆注册**：自由区享受企业税豁免及外资100%持股权，但对直接面向阿联酋本地终端用户的业务可能存在限制；大陆注册商业活动限制更少，但设立成本较高
5. **文化与生活规范**：阿联酋以伊斯兰教为国教——斋月白天禁止在公共场所饮食、酒类仅限指定场所购买、公共场合须着装得体，须提前了解相关规定

阿联酋集零所得税、世界级基础设施与战略性地理位置于一体，是独特的移居目的地。对高收入专业人才而言，与欧洲或日本的到手收入差距相当显著，越来越多的人将其作为3〜5年战略性移居、集中积累财富的选择。

---

### 参考资料

本文信息基于以下官方资料整理。

- **黄金签证（长期居留签证）**: [ICP – 阿联酋黄金签证](https://icp.gov.ae/en/ResidencyAndCitizenship/GoldenVisa)
- **迪拜居留手续总览**: [GDRFA迪拜 – 居留手续门户](https://www.gdrfad.gov.ae/)
- **阿联酋政府官方门户**: [阿联酋政府 – 签证与酋长国身份证服务](https://u.ae/en/information-and-services/visa-and-emirates-id)`,
    },
  },
  {
    slug: "visa-jp",
    category: "visa",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-jp.webp",
    date: "2026-03-19",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】日本のビザ・就労条件完全ガイド（外国人向け）｜高度専門職・J-Skip・永住権",
      en: "【2026 Updated】Japan Visa & Work Authorization Guide for Foreign Nationals｜HSP, J-Skip & Permanent Residency",
      zh: "【2026年最新】日本签证与就业条件完全指南（面向外国人）｜高度专业人才・J-Skip・永久居留权",
    },
    description: {
      ja: "高度専門職・J-Skip・J-Find・技人国・特定技能。日本の所得税・社会保険料、東京の家賃相場、永住権への道を徹底解説。",
      en: "Highly Skilled Professional, J-Skip, J-Find, Gijin-Kokusai, Specified Skilled Worker — covering Japan's income tax, social insurance, Tokyo rent, and permanent residency pathways.",
      zh: "高度专业人才、J-Skip、J-Find、技人国、特定技能全解析，涵盖日本所得税、社会保险、东京外籍人士聚居区租金及永久居留权申请路径。",
    },
    content: {
      ja: `日本は少子高齢化による深刻な人材不足を背景に、外国人の高度人材受け入れを積極的に推進しています。2023年には「J-Skip（特別高度人材制度）」「J-Find（未来創造人材制度）」が導入され、特定の条件を満たす外国人の日本移住がより容易になりました。

### 主な就労ビザの種類

**高度専門職ビザ（ポイント制）**
日本の高度人材優遇ビザ。年収・学歴・職歴・日本語能力・研究実績等のポイント制で審査（70点以上で取得可）。
- **高度専門職1号イ**（学術研究活動）
- **高度専門職1号ロ**（技術・人文知識・国際業務）：IT・エンジニア・経営コンサルタント等
- **高度専門職1号ハ**（経営・管理）：代表取締役・取締役等の経営者
- 永住権（高度専門職2号）の申請期間短縮：70点以上は**3年**、80点以上は**1年**で申請可能

**技術・人文知識・国際業務（技人国）**
日本で最も多く発給される就労ビザ。IT・エンジニア・通訳・外資系企業のオフィスワーク等が対象。
- 要件：大卒以上または10年以上の実務経験（専門学校卒は3年）
- 申請は雇用主（法人）が在留資格認定証明書（COE）を申請するのが一般的

**経営・管理**
日本で事業を経営・管理する外国人向け。事務所の確保・従業員雇用または500万円以上の投資が必要。スタートアップ起業家に活用されるビザ。

**特定技能1号・2号**
2019年に導入された人材不足分野への新制度（介護・建設・食品製造・農業等）。
- 1号：最大5年（家族帯同不可）、2号：無期限更新可（家族帯同可）
- 技能評価試験の合格または技能実習2号修了が必要

**J-Skip（特別高度人材制度）**
2023年4月導入。ポイント審査不要で即時に高度専門職ビザを取得できる最速ルート。
- **年収2,000万円（約13万USD）以上**：無条件で申請可能
- **世界大学ランキング上位300位の大学卒業 + 年収1,000万円（約6.5万USD）以上**：同上
- 取得後は永住権申請まで1〜3年（ポイントによる）

**J-Find（未来創造人材制度）**
2023年4月導入。世界大学ランキング上位100位（QS・THE・上海交通大学）の卒業生を対象に、卒業後2年以内に就職活動・起業活動のための2年間の在留を認める制度。日本語不要。

**永住者ビザ（永住権）**
一般：10年以上の合法的在留（うち就労ビザで5年以上）。高度専門職：1〜3年に短縮可能。

### 税制・社会保険

**所得税（国税）**
| 課税所得 | 税率 |
|---------|------|
| 195万円以下 | 5% |
| 195〜330万円 | 10% |
| 330〜695万円 | 20% |
| 695〜900万円 | 23% |
| 900〜1,800万円 | 33% |
| 1,800〜4,000万円 | 40% |
| 4,000万円超 | 45% |

**住民税**：約10%（所得税に加算。翌年課税のため初年度は翌年6月から）

**社会保険料（雇用者負担分）**
| 種類 | 概算率 |
|------|-------|
| 厚生年金 | 9.15% |
| 健康保険 | 4.99〜5.7%（協会けんぽ・東京） |
| 雇用保険 | 0.6% |
| **合計** | **約15%** |
（雇用主も同程度を負担）

**合計負担率**：所得税+住民税+社会保険で、年収500〜700万円の会社員は手取りがおよそ**75〜78%**程度。高収入になるほど率は下がる（年収1,000万円で約65〜68%）。

### 家賃・生活費の目安

外国人・専門職が多く住む東京中心部の1LDK（約40〜60㎡）：

| エリア | 1LDK家賃 |
|--------|---------|
| 港区（六本木・麻布十番・白金）| 20〜35万円/月 |
| 渋谷区（代官山・恵比寿・広尾）| 18〜30万円/月 |
| 新宿区（新宿・四谷・神楽坂）| 15〜25万円/月 |
| 中央区（銀座・日本橋・月島）| 15〜28万円/月 |
| 目黒区（中目黒・学芸大学）| 15〜25万円/月 |

一般生活費（食費・交通・通信）：月8〜12万円程度。東京の交通費は会社負担が一般的。

### 費用の目安

| 項目 | 費用 |
|------|------|
| 在留資格認定証明書（COE）申請費 | 無料 |
| ビザ申請費（日本大使館・外国） | 国籍・種別により3,000〜6,000円相当 |
| 在留カード発行費 | 無料 |
| 永住許可申請費 | 8,000円 |
| 帰化申請費 | 無料 |

### 移住前のチェックポイント

1. **J-Skip・高度専門職のポイント計算**：自分のポイントを出入国在留管理庁の公式ポイント計算シートで事前確認。80点以上なら永住権が最短1年で取得可能
2. **社会保険の加入義務**：正社員として雇用される場合、健康保険・厚生年金への加入は義務。フリーランス・法人代表者は国民健康保険・国民年金への加入が必要（国民年金月額約16,980円/2026年）
3. **住民税の後払い問題**：住民税は前年所得に対して翌年6月から課税。転職・退職・入国初年度は要注意
4. **日本語能力の実際の重要性**：就労ビザに日本語要件はないが、実務・日常生活・社内コミュニケーションで日本語能力の有無が大きく影響。N2以上でポイントも加算
5. **東京以外の選択肢**：大阪・名古屋・福岡・札幌は東京と比較して家賃が30〜50%安く、外国人向けコミュニティも育っています

日本はアジアで最も安全な都市を複数擁し、医療・教育・インフラの水準が高い移住先です。税負担・社会保険・高齢化社会の文脈を踏まえながら、MoveWorthで他の移住先と手取りを比較することをお勧めします。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **在留資格・ビザ全般**: [出入国在留管理庁（入管庁）公式サイト](https://www.moj.go.jp/isa/)
- **高度専門職ポイント制**: [入管庁 – 高度人材ポイント制](https://www.moj.go.jp/isa/applications/resources/newimmiact_3_evaluate_index.html)
- **外国人生活支援ポータル**: [外国人在留支援センター（FRESC）](https://www.moj.go.jp/isa/support/fresc/fresc01.html)`,
      en: `Japan is actively recruiting highly skilled foreign talent to address its severe labor shortage driven by an aging population. 2023 saw the introduction of J-Skip and J-Find — making Japan's immigration system more accessible than ever for top international professionals.

### Main Work Visa Types

**Highly Skilled Professional Visa (Points-Based / HSP)**
Japan's preferential visa for highly skilled foreign workers. Points are awarded for income, education, work experience, Japanese language ability, and research achievements (70+ points required).
- **Category i**: Academic research activities
- **Category ii**: Technology/Humanities/International Business — IT, engineers, consultants
- **Category iii**: Business management — CEOs, directors
- Permanent residency (HSP 2nd Category) available after: **3 years** at 70+ points, **1 year** at 80+ points

**Engineer / Specialist in Humanities / International Services (Gijin-Kokusai)**
Japan's most issued work visa, covering IT, engineering, translation, and office-based roles at foreign companies.
- Requirements: Bachelor's degree or 10+ years of professional experience
- Usually the employer (company) applies for the Certificate of Eligibility (COE)

**Business Manager**
For foreigners who establish or manage a business in Japan. Requires a secured office, employee(s), or investment of JPY 5,000,000+. Used by startup entrepreneurs.

**Specified Skilled Worker (Tokutei Gino) 1 & 2**
2019-introduced system for labor-shortage sectors (care, construction, food manufacturing, agriculture, etc.).
- Type 1: Up to 5 years, no family sponsorship; Type 2: Unlimited renewal, family permitted
- Requires passing a skills evaluation test, or completing Technical Intern Training Level 2

**J-Skip (Special Highly Skilled Professional)**
Introduced April 2023 — bypasses the points calculation entirely for the fastest possible HSP visa access.
- **Annual income JPY 20,000,000+ (≈USD 130,000)**: Eligible unconditionally
- **Top-300 university graduate + income JPY 10,000,000+ (≈USD 65,000)**: Also eligible
- After J-Skip: permanent residency in 1–3 years (based on points)

**J-Find (Future Creation Talent)**
Introduced April 2023 — graduates of top-100 world-ranked universities (QS / THE / ARWU) can stay in Japan for up to 2 years post-graduation for job hunting or entrepreneurship. No Japanese language requirement.

**Permanent Resident Visa**
General route: 10+ years of lawful residence (5+ years on a work visa). HSP route: 1–3 years. Good conduct and financial independence required.

### Tax & Social Insurance

**Income Tax (National)**
| Taxable Income | Rate |
|----------------|------|
| Up to JPY 1.95M | 5% |
| JPY 1.95M–3.3M | 10% |
| JPY 3.3M–6.95M | 20% |
| JPY 6.95M–9M | 23% |
| JPY 9M–18M | 33% |
| JPY 18M–40M | 40% |
| JPY 40M+ | 45% |

**Resident Tax**: ~10% on top of income tax (billed from June of the following year — no tax in year 1 of arrival)

**Social Insurance (Employee Contributions)**
| Type | Approx. Rate |
|------|-------------|
| Kosei Nenkin (pension) | 9.15% |
| Health insurance (Kyokai Kenpo, Tokyo) | ~4.99–5.7% |
| Employment insurance | 0.6% |
| **Total** | **~15%** |

Employers contribute approximately the same amount again. Overall take-home for an employee earning JPY 5–7M is roughly **75–78% of gross**. At JPY 10M, it drops to approximately 65–68%.

### Rent & Cost of Living

1BR apartments (40–60 m²) in central Tokyo neighborhoods popular with foreign professionals:

| Area | 1BR Monthly Rent |
|------|-----------------|
| Minato-ku (Roppongi, Azabu, Shirokanedai) | JPY 200,000–350,000 |
| Shibuya-ku (Daikanyama, Ebisu, Hiroo) | JPY 180,000–300,000 |
| Shinjuku-ku (Shinjuku, Yotsuya, Kagurazaka) | JPY 150,000–250,000 |
| Chuo-ku (Ginza, Nihonbashi) | JPY 150,000–280,000 |
| Meguro-ku (Nakameguro, Gakugeidaigaku) | JPY 150,000–250,000 |

General living costs (food, transport, utilities): JPY 80,000–120,000/month. Commuter rail passes are typically employer-paid.

### Cost Summary

| Item | Cost |
|------|------|
| Certificate of Eligibility (COE) application | Free |
| Visa application fee (overseas embassy) | Approx. JPY 3,000–6,000 equivalent |
| Residence Card issuance | Free |
| Permanent residence application fee | JPY 8,000 |
| Naturalization application fee | Free |

### Pre-Move Checklist

1. **Calculate your HSP points**: Use the official Immigration Services Agency points calculator. Hitting 80 points means PR in as little as 1 year — this is worth optimizing for before arrival
2. **Social insurance enrollment**: Full-time employees must enroll in Kosei Nenkin and Shakai Hoken. Freelancers and company directors use Kokumin Kenko Hoken and Kokumin Nenkin (~JPY 16,980/month in 2026)
3. **Resident tax timing**: Resident tax is levied on prior-year income starting June — plan cash flow around this, especially when changing jobs or arriving mid-year
4. **Japanese language reality**: No language requirement for work visas, but N2+ significantly expands your career options, improves daily life, and adds points to HSP scoring
5. **Cities beyond Tokyo**: Osaka, Nagoya, Fukuoka, and Sapporo offer 30–50% lower rents than central Tokyo, with growing international professional communities

Japan combines Asia's highest safety standards with world-class healthcare, education, and infrastructure. The tax burden is real but comparable to Western Europe — run a MoveWorth simulation to compare your net income against other destinations before deciding.

---

### References

This article is based on the following official sources.

- **Residence Status & Visa General**: [Immigration Services Agency of Japan (ISA)](https://www.isa.go.jp/en/)
- **Highly Skilled Professional Points System**: [ISA – Highly Skilled Foreign Professional Points-Based System](https://www.isa.go.jp/en/publications/materials/newimmiact_3_evaluate_index.html)
- **Foreign Resident Support Portal**: [Foreign Residents Support Center (FRESC)](https://www.isa.go.jp/en/support/fresc/fresc_3.html)`,
      zh: `日本因少子老龄化引发的严峻人才短缺，正积极吸引外籍高技能人才。2023年推出的J-Skip和J-Find制度使日本移居对顶尖国际专业人才而言比以往任何时候都更为便捷。

### 主要就业签证种类

**高度专业人才签证（积分制）**
日本面向高技能外籍人才的优惠签证，依据收入、学历、工作经验、日语能力及研究成果等综合评分（需70分以上）。
- **1号甲**：学术研究活动
- **1号乙**：技术·人文知识·国际业务——IT、工程师、顾问等
- **1号丙**：经营·管理——代表董事、董事等经营管理者
- 永久居留权（高度专业职业2号）申请期限缩短：70分以上**3年**、80分以上**1年**可申请

**技术·人文知识·国际业务（技人国）**
日本发放量最多的就业签证，涵盖IT、工程、翻译及外资企业办公室职位。
- 要求：本科及以上学历或10年以上工作经验
- 通常由雇主（法人）代为申请在留资格认定证明书（COE）

**经营·管理**
面向在日本从事企业经营或管理的外国人，须确保办公场所、雇用员工或投资500万日元以上，常用于初创企业创始人。

**特定技能1号·2号**
2019年引入的人才短缺行业新制度（护理、建设、食品制造、农业等）。
- 1号：最长5年，不可携带家属；2号：可无限续签，可携带家属
- 须通过技能评估考试或完成技能实习2号

**J-Skip（特别高技能人才制度）**
2023年4月引入——无需积分计算，可直接取得最快的高度专业人才签证。
- **年收入2,000万日元以上（约USD 130,000）**：无条件申请
- **毕业于世界大学排名前300名 + 年收入1,000万日元以上（约USD 65,000）**：同上
- 取得后可在1〜3年内申请永久居留权（依据积分）

**J-Find（未来创造人才制度）**
2023年4月引入——毕业于世界大学排名前100名（QS/THE/软科）的应届生，可在毕业后2年内以求职或创业为目的在日居住最长2年，无需日语能力要求。

**永久居留权**
一般路径：合法居住满10年（其中就业签证满5年）；高度专业人才路径：1〜3年。须品行良好且能够自给自足。

### 税制与社会保险

**所得税（国税）**
| 应税收入 | 税率 |
|---------|------|
| 195万日元以下 | 5% |
| 195〜330万日元 | 10% |
| 330〜695万日元 | 20% |
| 695〜900万日元 | 23% |
| 900〜1,800万日元 | 33% |
| 1,800〜4,000万日元 | 40% |
| 4,000万日元以上 | 45% |

**住民税**：约10%（叠加于所得税之上；以前一年收入为基础，从次年6月起征——入境第一年无需缴纳）

**社会保险费（雇员承担部分）**
| 险种 | 概算比率 |
|------|---------|
| 厚生年金 | 9.15% |
| 健康保险（协会健保·东京）| 约4.99〜5.7% |
| 雇用保险 | 0.6% |
| **合计** | **约15%** |

雇主承担比例与雇员大致相同。年收入500〜700万日元的上班族税后到手约为**税前的75〜78%**；年收入1,000万日元时约降至65〜68%。

### 租金与生活费参考

东京市中心外籍专业人士集中居住区域1居室（约40〜60㎡）参考月租：

| 区域 | 1居室月租 |
|------|---------|
| 港区（六本木、麻布、白金）| 20〜35万日元 |
| 涩谷区（代官山、惠比寿、广尾）| 18〜30万日元 |
| 新宿区（新宿、四谷、神乐坂）| 15〜25万日元 |
| 中央区（银座、日本桥）| 15〜28万日元 |
| 目黑区（中目黑、学艺大学）| 15〜25万日元 |

一般生活费（饮食、交通、通信）：每月约8〜12万日元。东京通勤交通费通常由雇主承担。

### 费用参考

| 项目 | 费用 |
|------|------|
| 在留资格认定证明书（COE）申请费 | 免费 |
| 签证申请费（海外大使馆）| 约3,000〜6,000日元等值 |
| 在留卡发行费 | 免费 |
| 永住许可申请费 | 8,000日元 |
| 归化申请费 | 免费 |

### 移居前注意事项

1. **高度专业人才积分预先测算**：使用出入国在留管理厅官方积分计算表进行自测——达到80分以上可在最短1年内申请永居，非常值得提前规划
2. **社会保险加入义务**：正式雇用者须加入厚生年金及社会保险；自由职业者和法人代表须加入国民健康保险及国民年金（2026年国民年金约16,980日元/月）
3. **住民税的滞后缴纳特性**：住民税基于前一年收入，从次年6月起征——在入境初年度、跳槽或离职时须特别注意现金流规划
4. **日语能力的实际重要性**：就业签证无语言要求，但N2以上可大幅扩展职业选择、改善日常生活并为积分加分
5. **东京以外城市的选择**：大阪、名古屋、福冈、札幌的租金比东京市中心低30〜50%，国际化专业人士社区也在不断成长

日本兼具亚洲最高的安全水准与世界一流的医疗、教育及基础设施。税负与西欧相当——建议使用MoveWorth与其他移居目的地进行税后收入对比模拟后再做最终决定。`,
    },
  },
  // ===== NEW 10 COUNTRIES VISA GUIDES =====
  {
    slug: "visa-pt",
    category: "visa",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-pt.webp",
    date: "2026-03-19",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】ポルトガルのビザ・就労許可完全ガイド｜D7・IFICI税制・ゴールデンビザ・永住権",
      en: "【2026 Updated】Portugal Visa & Residency Complete Guide｜D7, IFICI Tax Regime, Golden Visa & Permanent Residency",
      zh: "【2026年最新】葡萄牙签证与居留许可完全指南｜D7签证・IFICI税收优惠・黄金签证・永久居留权",
    },
    description: {
      ja: "D7ビザ・D2・D3・IFICI優遇税制（旧NHR）・ゴールデンビザから永住権まで。ポルトガルの所得税、リスボン・ポルトの家賃相場を徹底解説。",
      en: "D7, D2, D3, IFICI tax regime (ex-NHR), Golden Visa and permanent residency — covering Portugal's income tax and rent in Lisbon and Porto expat areas.",
      zh: "D7、D2、D3、IFICI税收优惠制度（原NHR）、黄金签证至永久居留权全解析，涵盖葡萄牙所得税及里斯本、波尔图外籍人士聚居区租金行情。",
    },
    content: {
      ja: `ポルトガルは温暖な地中海性気候・低い生活費・EU加盟国としての移動の自由・そして外国人向けの優遇税制を背景に、欧州移住先の中でも特に人気が高い国です。2024年の旧NHRからIFICI制度への移行、2023年のゴールデンビザ改正など、制度変更が続いていますので最新情報の確認が重要です。

### 主なビザの種類

**D7ビザ（受動的収入・デジタルノマドビザ）**
年金・配当・賃貸収入・フリーランス収入など、ポルトガル国外からの収入で生活する方向けの長期居住ビザ。最も人気のある移住ルートです。
- 最低月収の目安：ポルトガルの最低賃金以上（**約EUR 870/月**・2026年）
- 配偶者は+50%、子ども1人あたり+30%の追加収入証明が必要
- 有効期間：初回2年、更新後3年
- 5年の居住後に**永住権（AR）または市民権**の申請が可能
- 申請先：最寄りのポルトガル領事館（在日ポルトガル大使館）

**D8ビザ（デジタルノマド・リモートワークビザ）**
2022年10月に導入されたリモートワーカー専用ビザ。ポルトガル国外の雇用主または自分の会社・クライアントに対して働く場合に適用。
- 最低月収：EUR 3,480以上（2026年目安・ポルトガル最低賃金の4倍）
- 有効期間：初回1年、更新後2年

**D2ビザ（フリーランサー・起業家ビザ）**
ポルトガルで独立した事業活動を行う方向けのビザ。事業計画書・収入見込みの提出が必要。
- ポルトガル語での事業計画書または英語+認定翻訳が一般的

**D3ビザ（高度技能者・EUブルーカード）**
ポルトガルまたはEU企業からの雇用オファーがある高度技能者向けビザ。
- 最低年収：EU平均給与の**1.5倍以上**（約EUR 55,000/年・2026年目安）
- 有効期間：雇用契約期間+3ヶ月（最大2年）

**ゴールデンビザ（ARI：居住投資許可）**
投資による居住許可制度。不動産への投資ルートは**2023年10月に廃止**されましたが、以下のルートは継続中：
- **適格ファンドへの投資**：EUR 500,000以上
- **雇用創出**：国内で10名以上の雇用（もしくは低開発地域で8名以上）
- **文化遺産・芸術への寄付**：EUR 250,000以上
- 年間7日間の居住義務（更新年は14日）で、メインの居住地でなくてもよい

**永住権（AR）・市民権**
5年の合法的居住後に永住権（Autorização de Residência Permanente）の申請が可能。ゴールデンビザ保有者も同様（年間最低滞在日数を満たした場合）。市民権は通常5年後に申請可能。ポルトガル語のA2水準が必要。

### IFICI優遇税制（旧NHR）

2024年1月より旧NHR（Non-Habitual Resident）制度に代わり、**IFICI（科学研究・技術革新財税インセンティブ）**が導入されました。

**IFICIの対象職種（主なもの）**
- IT・技術・エンジニアリング・自然科学系の研究者・開発者
- テクノロジー企業・スタートアップの創設者・経営者
- 高等教育機関の研究者・教員
- 金融・管理職（一部条件あり）
- 2024年以前の旧NHR取得者は引き続き旧制度が適用（10年間有効）

**IFICIの税率**
- ポルトガル国内源泉所得：**20%の優遇フラット税率**（通常最大48%）
- 外国源泉所得（海外からの給与・配当・賃貸収入）：原則**免税**（一部例外あり）
- 優遇期間：最長10年間

### 標準所得税（IFICI非適用の場合）

| 課税所得 | 税率 |
|---------|------|
| EUR 7,703以下 | 13.25% |
| EUR 7,704〜11,623 | 18% |
| EUR 11,624〜16,472 | 23% |
| EUR 16,473〜21,321 | 26% |
| EUR 21,322〜27,146 | 32.75% |
| EUR 27,147〜39,791 | 37% |
| EUR 39,792〜51,997 | 43.5% |
| EUR 51,998〜81,199 | 45% |
| EUR 81,200超 | 48% |

**社会保険料（フリーランサー）**：売上の21.4%（月額下限・上限あり）。被用者は11%（雇用主は23.75%）。

### 家賃・生活費の目安

外国人・専門職が多く住む市内中心部の1LDK（約50〜70㎡）：

| 都市・エリア | 1LDK家賃 |
|-------------|---------|
| リスボン（アルファマ・バイシャ・インテンデンテ）| EUR 1,500〜2,800/月 |
| リスボン（パルケ・ダス・ナソンイス・ベレン）| EUR 1,300〜2,200/月 |
| ポルト（ポブラード・フォス・ボアビスタ）| EUR 1,000〜1,800/月 |
| カスカイス（リスボン近郊・海辺）| EUR 1,400〜2,500/月 |
| アルガルベ（ファロ・タビラ）| EUR 900〜1,600/月 |

一般生活費（食費・交通・通信）：月EUR 600〜900程度（欧州の中でも低コスト）。ポルトガルの公共交通は安価（リスボン市内月定期EUR 40程度）。

### 費用の目安

| 項目 | 費用 |
|------|------|
| D7ビザ申請費（領事館）| 約EUR 90 |
| D8（デジタルノマド）ビザ申請費 | 約EUR 90 |
| 居留許可申請費（AIMA）| 約EUR 320 |
| ゴールデンビザ申請費 | EUR 533〜5,332 |
| 永住権申請費 | 約EUR 160 |
| NIF取得費 | 無料（税務署）または代行EUR 200〜400 |

### 移住前のチェックポイント

1. **AIMA（旧SEF）の待ち時間問題**：ポルトガルの居留許可申請機関AIMAは申請から許可まで6ヶ月〜1年以上かかるケースが報告されています。ビザ申請後の入国から3ヶ月以内にAIMA予約（agendamento）を取ることが優先事項
2. **NIF番号の取得**：ポルトガル到着前に在日大使館で代理人を立てた取得も可能。口座開設・賃貸契約・税務申告すべてに必須
3. **IFICIの適用確認**：旧NHRと異なりIFICIは職種制限あり。自分の職種が対象かどうかを事前にポルトガルの税理士（コンタビリスタ）に確認することを強く推奨
4. **リスボンの家賃高騰**：過去5年でリスボンの家賃は2倍近くに上昇。ポルトやセトゥーバル・アルガルベ等への分散が現実的になりつつある
5. **ポルトガル語**：日常生活は英語でも対応できるケースが多い（特に若い世代・リスボン・ポルト）が、移民手続き・行政書類はポルトガル語が多いため、基本的な習得が役立つ

ポルトガルはEU圏の中でも生活コストの低さと気候の良さ、そしてIFICI優遇税制の組み合わせが独自の魅力を生む国です。デジタルノマド・早期リタイア・起業家・リモートワーカーのいずれにも適した移住先として、引き続きヨーロッパ移住の有力候補です。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般（AIMA）**: [AIMA – ポルトガル移民・亡命局](https://aima.gov.pt/)
- **デジタルノマドビザ（D8）**: [ポルトガル外務省 – D8 デジタルノマドビザ](https://vistos.mne.gov.pt/en/national-visas/required-documentation/remote-working-or-digital-nomad)
- **NHR 税制（IFICI）**: [ポルトガル税務関税局（AT）– IFICI](https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/questoes_frequentes/pages/faqs-01018.aspx)`,
      en: `Portugal combines a warm Mediterranean climate, affordable living costs, EU freedom of movement, and one of Europe's most generous tax regimes for foreign residents. 2024 saw the transition from the old NHR to the IFICI regime, and 2023 brought Golden Visa reforms — staying current on these changes is essential for planning.

### Main Visa Types

**D7 Visa (Passive Income / Retirement)**
Portugal's most popular visa for those living on income from outside the country — pensions, dividends, rental income, or freelance revenue.
- Minimum monthly income: approx. **EUR 870/month** (2026 minimum wage baseline)
- +50% for spouse; +30% per dependent child
- Validity: 2 years initially, renewable for 3 years
- After 5 years: eligible for **permanent residency (AR) or citizenship**
- Apply at: Portuguese consulate in your home country

**D8 Visa (Digital Nomad / Remote Worker)**
Introduced October 2022 for remote workers employed by non-Portuguese entities.
- Minimum monthly income: EUR 3,480+ (4x Portugal minimum wage, 2026 estimate)
- Validity: 1 year initially, renewable for 2 years

**D2 Visa (Freelancer / Entrepreneur)**
For those establishing an independent business or freelance practice in Portugal. Requires a business plan and income projections.

**D3 Visa (Highly Qualified / EU Blue Card)**
For skilled professionals with a job offer from a Portuguese or EU-registered employer.
- Minimum annual salary: **1.5x EU average** (approx. EUR 55,000/year in 2026)
- Validity: Duration of contract + 3 months (max 2 years)

**Golden Visa (ARI — Residence by Investment)**
The real estate investment route was **closed in October 2023**, but these routes remain open:
- **Qualifying fund investment**: EUR 500,000+
- **Job creation**: 10+ employees in Portugal (8+ in low-density regions)
- **Cultural heritage / arts donation**: EUR 250,000+
- Only requires 7 days/year physical presence (14 in renewal years) — no need for Portugal to be your primary residence

**Permanent Residency (AR) and Citizenship**
Available after 5 years of lawful residency. Golden Visa holders qualify after meeting minimum stay requirements. Citizenship requires A2-level Portuguese language proficiency.

### IFICI Tax Regime (formerly NHR)

In January 2024, the NHR (Non-Habitual Resident) regime was replaced by **IFICI** (Incentivo Fiscal à Investigação Científica e Inovação).

**Qualifying IFICI professions (main categories)**
- IT, technology, engineering, and natural science researchers and developers
- Founders and executives of technology companies and startups
- Researchers and professors at higher education institutions
- Finance and management roles (with conditions)
- Those who obtained NHR before 2024 continue under the old scheme for their 10-year period

**IFICI tax rates**
- Portuguese-sourced income: **20% flat rate** (vs. standard rate up to 48%)
- Foreign-sourced income (salary, dividends, rental from abroad): generally **exempt** from Portuguese tax
- Duration: up to 10 years

### Standard Income Tax (without IFICI)

| Taxable Income | Rate |
|----------------|------|
| Up to EUR 7,703 | 13.25% |
| EUR 7,704–11,623 | 18% |
| EUR 11,624–16,472 | 23% |
| EUR 16,473–21,321 | 26% |
| EUR 21,322–27,146 | 32.75% |
| EUR 27,147–39,791 | 37% |
| EUR 39,792–51,997 | 43.5% |
| EUR 51,998–81,199 | 45% |
| EUR 81,200+ | 48% |

**Social security contributions (freelancers)**: 21.4% of revenue (with minimum and maximum floors). Employees: 11% (employer: 23.75%).

### Rent & Cost of Living

1BR apartments (50–70 m²) in expat-heavy central neighborhoods:

| City / Area | 1BR Monthly Rent |
|-------------|-----------------|
| Lisbon (Alfama, Baixa, Intendente) | EUR 1,500–2,800 |
| Lisbon (Parque das Nações, Belém) | EUR 1,300–2,200 |
| Porto (Boavista, Foz do Douro) | EUR 1,000–1,800 |
| Cascais (Lisbon suburb, seaside) | EUR 1,400–2,500 |
| Algarve (Faro, Tavira) | EUR 900–1,600 |

General living costs (food, transport, utilities): EUR 600–900/month — one of Western Europe's most affordable. Lisbon's monthly transit pass: ~EUR 40.

### Cost Summary

| Item | Cost |
|------|------|
| D7 / D8 visa fee (consulate) | ~EUR 90 |
| Residence permit (AIMA) | ~EUR 320 |
| Golden Visa application fee | EUR 533–5,332 |
| Permanent residency application fee | ~EUR 160 |
| NIF tax number (in person) | Free |

### Pre-Move Checklist

1. **AIMA appointment delays**: Processing times for the residence permit can run 6 months to over 1 year. Book your AIMA appointment (agendamento) as soon as possible — ideally within days of arriving on your D7/D8 visa
2. **Get your NIF before you arrive**: You can appoint a fiscal representative in Portugal from abroad to obtain a NIF before moving — essential for bank accounts, lease agreements, and tax filings
3. **IFICI eligibility check**: Unlike old NHR (which was broadly available), IFICI is restricted to specific professions. Confirm your occupation qualifies by consulting a Portuguese accountant (contabilista) before moving
4. **Lisbon rental prices have surged**: Lisbon rents nearly doubled over 5 years. Porto, Setúbal, and the Algarve are increasingly popular alternatives at 30–50% lower costs
5. **Portuguese language**: English is widely spoken in Lisbon and Porto, especially among younger generations and in tech/business. However, immigration paperwork and administrative procedures are mostly in Portuguese — basic knowledge speeds things up significantly

Portugal's combination of IFICI tax incentives, EU residence rights, low living costs, and sunshine make it Europe's standout destination for digital nomads, early retirees, entrepreneurs, and remote workers. For the right candidate — especially those with qualifying professional profiles — it's one of the strongest overall value propositions in the developed world.

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits (AIMA)**: [AIMA – Agency for Integration, Migration and Asylum](https://aima.gov.pt/)
- **Digital Nomad Visa (D8)**: [MNE – D8 Remote Working / Digital Nomad Visa](https://vistos.mne.gov.pt/en/national-visas/required-documentation/remote-working-or-digital-nomad)
- **NHR Tax Regime (IFICI)**: [AT – Portuguese Tax and Customs Authority – IFICI](https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/questoes_frequentes/pages/faqs-01018.aspx)`,
      zh: `葡萄牙集温暖的地中海气候、低廉的生活成本、欧盟居留权及欧洲最优厚的外籍居民税收优惠制度于一体，是欧洲最受欢迎的移居目的地之一。2024年旧NHR制度过渡为IFICI，2023年黄金签证改革相继落地——移居前务必确认最新规定。

### 主要签证种类

**D7签证（被动收入/退休移民签证）**
葡萄牙最受欢迎的移居签证，适用于拥有葡萄牙境外稳定收入的申请者（养老金、股息、租金收入或自由职业）。
- 最低月收入要求：约**EUR 870/月**（2026年最低工资基准）
- 配偶需额外增加50%、每名子女需增加30%的收入证明
- 有效期：首次2年，续签3年
- 满5年合法居住后可申请**永久居留权（AR）或葡萄牙国籍**
- 申请地点：所在国葡萄牙领事馆

**D8签证（数字游民/远程办公签证）**
2022年10月推出，专为受雇于非葡萄牙机构的远程工作者设计。
- 最低月收入：EUR 3,480以上（2026年参考：葡萄牙最低工资的4倍）
- 有效期：首次1年，续签2年

**D2签证（自由职业/创业者签证）**
适用于希望在葡萄牙开展独立业务或自由职业的申请者，须提交商业计划书及收入预测。

**D3签证（高技能/欧盟蓝卡）**
适用于持有葡萄牙或欧盟雇主录用邀请的高技能专业人士。
- 最低年薪要求：**欧盟平均工资的1.5倍以上**（2026年参考：约EUR 55,000/年）
- 有效期：合同期限+3个月（最长2年）

**黄金签证（ARI：投资居留许可）**
房产投资路径已于**2023年10月关闭**，但以下路径仍可申请：
- **合格基金投资**：EUR 500,000以上
- **创造就业岗位**：在葡萄牙本土雇用10人以上（低密度地区8人以上）
- **文化遗产/艺术捐赠**：EUR 250,000以上
- 每年仅需在葡萄牙居住7天（续签年为14天），无需以葡萄牙为主要居住地

**永久居留权（AR）与葡萄牙国籍**
合法居住满5年后可申请永久居留权；黄金签证持有者满足最低居住天数要求后同样适用。申请葡萄牙国籍须具备A2级葡萄牙语能力。

### IFICI税收优惠制度（原NHR）

2024年1月起，旧NHR（非惯常居民）制度正式由**IFICI（科学研究与技术创新财税激励）**取代。

**IFICI适用职业（主要类别）**
- IT、科技、工程及自然科学领域研究人员及开发者
- 科技企业及初创公司的创始人和高管
- 高等教育机构研究人员及教师
- 金融及管理职位（附加条件）
- 2024年前已获NHR认定者继续按旧制度享受10年优惠期

**IFICI税率**
- 葡萄牙境内收入：**20%优惠固定税率**（标准最高税率达48%）
- 境外收入（海外薪资、股息、租金等）：原则上**免税**（部分例外情形除外）
- 优惠期限：最长10年

### 标准所得税（不适用IFICI时）

| 应税收入 | 税率 |
|---------|------|
| EUR 7,703以下 | 13.25% |
| EUR 7,704〜11,623 | 18% |
| EUR 11,624〜16,472 | 23% |
| EUR 16,473〜21,321 | 26% |
| EUR 21,322〜27,146 | 32.75% |
| EUR 27,147〜39,791 | 37% |
| EUR 39,792〜51,997 | 43.5% |
| EUR 51,998〜81,199 | 45% |
| EUR 81,200以上 | 48% |

**社会保险缴费（自由职业）**：营业额的21.4%（设有最低/最高限额）；受雇者缴纳11%（雇主缴纳23.75%）。

### 租金与生活费参考

外籍人士集中居住的市中心区域1居室（约50〜70㎡）参考月租：

| 城市/区域 | 1居室月租 |
|----------|---------|
| 里斯本（阿尔法玛、巴沙、因滕登特）| EUR 1,500〜2,800 |
| 里斯本（国家公园区、贝伦）| EUR 1,300〜2,200 |
| 波尔图（博阿维斯塔、福斯）| EUR 1,000〜1,800 |
| 卡斯凯什（里斯本近郊海滨）| EUR 1,400〜2,500 |
| 阿尔加维（法鲁、塔维拉）| EUR 900〜1,600 |

一般生活费（饮食、交通、通信）：每月约EUR 600〜900，是西欧生活成本最低的国家之一。里斯本市内公共交通月票：约EUR 40。

### 费用参考

| 项目 | 费用 |
|------|------|
| D7/D8签证申请费（领事馆）| 约EUR 90 |
| 居留许可申请费（AIMA）| 约EUR 320 |
| 黄金签证申请费 | EUR 533〜5,332 |
| 永久居留权申请费 | 约EUR 160 |
| NIF税务号（本人办理）| 免费 |

### 移居前注意事项

1. **AIMA预约等待时间**：居留许可从申请到获批可能需要6个月至1年以上。抵达后须尽快在AIMA官网预约，建议抵葡数天内即办理
2. **提前申请NIF税务号**：可在出发前委托葡萄牙代理人（fiscal representative）代为申请NIF——这是开立银行账户、签订租约及申报税务的必要前提
3. **确认IFICI适用资格**：与旧NHR不同，IFICI对职业类别有明确限制，强烈建议移居前咨询葡萄牙税务顾问（contabilista）确认自身职业是否符合条件
4. **里斯本租金大幅上涨**：过去五年里斯本房租几乎翻倍，波尔图、塞图巴尔及阿尔加维成为越来越多外籍人士的平价替代选择，租金低30〜50%
5. **葡萄牙语能力**：里斯本和波尔图，尤其是年轻一代及科技/商业圈，英语普及率较高；但移民手续和行政文件多为葡萄牙语，掌握基础葡语可大幅提升效率

葡萄牙凭借IFICI税收优惠、欧盟居留权、低廉的生活成本与充沛的阳光，成为数字游民、提前退休族、创业者及远程工作者首选的欧洲移居目的地。对于符合适用条件的申请者而言，这是发达国家中整体性价比最突出的移居选择之一。

---

### 参考资料

本文信息基于以下官方资料整理。

- **在留资格及签证总览**: [出入境在留管理厅（入管厅）官方网站](https://www.isa.go.jp/zh-cn/)
- **高度专业人才积分制**: [入管厅 – 高度人才积分制](https://www.moj.go.jp/isa/applications/resources/newimmiact_3_system_index.html?hl=zh-CN)
- **外籍居民生活支援门户**: [外国人在留支援中心（FRESC）](https://www.isa.go.jp/zh-cn/support/fresc/fresc01.html)

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览（AIMA）**: [AIMA – 葡萄牙移民与庇护局](https://aima.gov.pt/)
- **数字游民签证（D8）**: [葡萄牙外交部 – D8 远程工作/数字游民签证](https://vistos.mne.gov.pt/en/national-visas/required-documentation/remote-working-or-digital-nomad)
- **NHR税制（IFICI）**: [葡萄牙税务海关局（AT）– IFICI](https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/questoes_frequentes/pages/faqs-01018.aspx)`,
    },
  },
  {
    slug: "visa-es",
    category: "visa",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-es.webp",
    date: "2026-03-19",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】スペインのビザ・就労許可完全ガイド",
      en: "Spain Visa & Work Permit Complete Guide 2026",
      zh: "【2026年最新版】西班牙签证与就业许可完全指南",
    },
    description: {
      ja: "デジタルノマドビザ・ベッカム法・非収益ビザまで、スペイン移住に必要なビザの種類・要件・費用を徹底解説。2026年最新情報対応。",
      en: "From the Digital Nomad Visa to the Beckham Law tax break — a complete 2026 guide to visas, taxes, and living costs in Spain.",
      zh: "从数字游民签证到贝克汉姆法税收优惠，全面解析2026年移居西班牙所需的签证类型、税务与生活成本。",
    },
    content: {
      ja: `スペインは温暖な気候・豊かな食文化・比較的手ごろな生活費で、欧州移住先として人気が高まっています。2023年のスタートアップ法（Ley de Startups）施行により、デジタルノマドや遠隔勤務者にとってもより魅力的な選択肢となりました。

### 主なビザの種類

**非収益ビザ（Non-Lucrative Visa / NLV）**
スペインでの就労を行わず、十分な資産・収入で生活する方向けのビザです。
- 最低月収目安：申請者本人€2,400以上、扶養家族1人追加ごとに約€600追加
- 必要書類：無犯罪証明書、健康保険（スペイン国内完全カバー）、残高証明
- 有効期間：初回1年、更新後2年・さらに2年（計5年で長期居留申請可）
- 注意：就労は原則不可（後でワークパーミット（cuenta propia等）に変更可能）

**デジタルノマドビザ（Ley de Startups / DNV）**
2023年2月導入。海外の企業・クライアントにリモートで働く外国人向け。
- 最低月収：€2,850以上（スペイン最低賃金SMIの200%、2026年基準）
- スペイン国内クライアントからの収入は全体の**20%以内**
- 有効期間：初回1年のビザ→スペイン入国後に3年の居留許可に変換可能（さらに2年更新）
- ベッカム法との組み合わせ：DNV取得者もベッカム法申請可（初年度から24%固定税率）

**EUブルーカード（Tarjeta Azul UE）**
スペインの企業から就労オファーがある高度技能者向け。
- 年収要件：約€37,000〜（職種による）
- 最低雇用契約期間：1年以上

**起業家ビザ（Visado Emprendedor）**
スペインでの事業創業・投資活動を行う起業家向け。事業計画の審査（UGIEの承認）が必要。

**ゴールデンビザ（Visa Dorada）— 廃止決定**
- 不動産投資ルート（€500,000以上）は**2025年4月3日をもってゴールデンビザ全ルート完全廃止**
- 既存保有者の更新は引き続き可能
- ベンチャーキャピタルへの投資（€1M以上）や国債投資（€2M以上）ルートは継続審議中

### ベッカム法（Régimen IRNR / Ley Beckham）

スペインに初めて税務居住者として転入した外国人が申請できる特別税制。
- スペイン源泉所得に対して**24%の一律税率**（通常の最高税率47%と比較して大幅軽減）
- 適用期間：転入年 + 5年間、最大6年
- 申請条件：
  1. 過去10年間のうち5年以上スペインに税務居住していないこと
  2. 雇用契約・取締役就任・または事業活動目的での転入
- 申請期限：スペイン到着後**6ヶ月以内**にモデル149書式を提出
- 注意：海外所得（配当・不動産収入等）にはスペイン源泉税が発生する場合あり

### スペインの所得税（IRPF）標準税率表（2026年）

| 課税所得 | 国税率 |
|---------|--------|
| €0〜€12,450 | 19% |
| €12,451〜€20,200 | 24% |
| €20,201〜€35,200 | 30% |
| €35,201〜€60,000 | 37% |
| €60,001〜€300,000 | 45% |
| €300,001超 | 47% |

※地方税（自治州税）が別途加算（上記は国税分のみ）。実効税率は州により異なる。

### 社会保険料（2026年）

| 負担者 | 保険料率 |
|-------|---------|
| 被用者（従業員）負担 | 約6.35%（老齢4.7% + 失業1.55% + 職業訓練0.1%） |
| 雇用者負担 | 約29.9% |
| 自営業者（RETA） | 収入に応じて月額€200〜€500前後（2023年改定の実収入連動制） |

### 費用の目安

| 項目 | 費用 |
|------|------|
| 非収益ビザ申請費 | 約€80〜160 |
| デジタルノマドビザ申請費 | 約€80〜160（領事館手数料） |
| NIE（外国人識別番号）取得 | 約€10 |
| TIE（外国人身分証）発行 | 約€16 |
| 自動車免許更新（任意） | 約€30 |

### 主要都市の家賃相場（外国人居住エリア）

| エリア | 1LDK（1BR） | 2LDK（2BR） |
|--------|------------|------------|
| マドリード・サラマンカ地区 | €1,500〜2,200 | €2,200〜3,200 |
| マドリード・チャンベリ地区 | €1,400〜2,000 | €2,000〜2,800 |
| バルセロナ・エシャンプレ地区 | €1,400〜2,200 | €2,000〜3,000 |
| バルセロナ・グラシア地区 | €1,300〜1,900 | €1,800〜2,600 |

### 生活費の目安（マドリード・バルセロナ）

- 食費（自炊中心）：€300〜500/月
- 交通費（月額定期）：マドリード約€55、バルセロナ約€80
- 光熱費（電気・ガス・水道）：€80〜150/月
- 公的医療保険：社会保険加入者は無料（非収益ビザ保有者は民間保険が必要）

### 移住前のチェックポイント

1. **NIE取得**：スペインでの生活・契約・納税に必須の外国人識別番号。スペイン領事館またはスペイン到着後に警察署で申請
2. **パドロン登録（Empadronamiento）**：居住地の市役所への住民登録。公共サービス・医療・子女就学に必要
3. **TIE申請**：居留許可取得後30日以内に外国人身分証（TIE）を申請
4. **ベッカム法の申請期限**：スペイン到着後**6ヶ月以内**に申請。期限を過ぎると適用不可
5. **民間健康保険**：非収益ビザ申請時はスペイン全域カバーの民間保険加入が必須
6. **税務申告（Renta）**：スペイン滞在183日超で税務居住者となりIRPF申告義務が発生

スペインは生活コストと生活の質のバランスが取れた移住先です。MoveWorthで事前にシミュレーションして準備を整えましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ申請全般**: [スペイン外務省 – コンスラ・ビザ情報](https://www.exteriores.gob.es/Consulados/londres/en/ServiciosConsulares/Paginas/Consular/Visados-nacionales-Informacion-general.aspx)
- **デジタルノマドビザ（起業家法）**: [スペイン政府 – スタートアップ法・デジタルノマドビザ](https://one.gob.es/en/procedures/application-digital-nomad-visa)
- **非営利居住ビザ（Non-Lucrative）**: [スペイン外務省 – 非営利居住ビザ](https://www.exteriores.gob.es/Consulados/londres/en/ServiciosConsulares/Paginas/Consular/Visado-de-residencia-no-lucrativa.aspx)`,
      en: `Spain's combination of warm weather, rich culture, and relatively affordable living has made it an increasingly popular destination for expats. The 2023 Startups Law (Ley de Startups) made it even more attractive for digital nomads and remote workers.

### Main Visa Types

**Non-Lucrative Visa (NLV)**
For those who can support themselves financially without working in Spain.
- Minimum monthly income: ~€2,400 (applicant); ~€600 additional per dependent
- Required documents: criminal record certificate, private health insurance covering all of Spain, bank statements
- Validity: 1 year initially, renewable for 2+2 years (5 years total → long-term residence eligible)
- Work is not permitted (can later convert to self-employment or work permit)

**Digital Nomad Visa (Ley de Startups / DNV)**
Introduced February 2023 for remote workers employed by non-Spanish companies.
- Minimum monthly income: €2,850 (200% of Spain's SMI minimum wage, 2026 rate)
- Spanish clients must not exceed **20% of total income**
- Validity: 1-year visa → converts to 3-year residence permit after entry (renewable for 2 more years)
- Compatible with Beckham Law: DNV holders can apply for the 24% flat rate from year one

**EU Blue Card (Tarjeta Azul UE)**
For highly skilled professionals with a Spanish job offer.
- Annual salary threshold: approx. €37,000+ (varies by occupation)
- Minimum contract length: 1 year

**Entrepreneur Visa (Visado Emprendedor)**
For founders and investors. Requires business plan approval by UGIE (Unidad de Grandes Empresas).

**Golden Visa (Visa Dorada) — Closed**
- The entire Golden Visa program was **fully abolished as of April 3, 2025** — no new applications accepted for any route
- Existing holders can still renew
- VC investment (€1M+) and government bond routes (€2M+) under continued review

### Beckham Law (Régimen IRNR / Ley Beckham)

A special tax regime for new Spanish tax residents moving for work or business.
- **24% flat tax** on Spanish-sourced income (vs. standard rate up to 47%)
- Duration: year of arrival + 5 subsequent years (up to 6 years total)
- Eligibility requirements:
  1. Must not have been a Spanish tax resident for 5 of the previous 10 years
  2. Must relocate for employment, directorship, or business activity
- Application deadline: **within 6 months of arrival** using Modelo 149 form
- Note: Foreign-sourced income (dividends, overseas property, etc.) may still be subject to Spanish withholding tax

### Spanish Income Tax (IRPF) — Standard Rates 2026

| Taxable Income | National Rate |
|---------------|--------------|
| €0–€12,450 | 19% |
| €12,451–€20,200 | 24% |
| €20,201–€35,200 | 30% |
| €35,201–€60,000 | 37% |
| €60,001–€300,000 | 45% |
| Over €300,001 | 47% |

*Regional (autonomous community) tax applies on top. Effective rates vary by region.*

### Social Security Contributions (2026)

| Party | Rate |
|-------|------|
| Employee | ~6.35% (pension 4.7% + unemployment 1.55% + training 0.1%) |
| Employer | ~29.9% |
| Self-employed (RETA) | €200–€500/month depending on income (reformed 2023 income-linked system) |

### Cost Overview

| Item | Cost |
|------|------|
| Non-Lucrative Visa fee | ~€80–160 |
| Digital Nomad Visa fee | ~€80–160 (consulate fee) |
| NIE (foreign ID number) | ~€10 |
| TIE (residence card) | ~€16 |

### Rent in Expat-Friendly Neighbourhoods

| Area | 1BR | 2BR |
|------|-----|-----|
| Madrid – Salamanca district | €1,500–2,200 | €2,200–3,200 |
| Madrid – Chamberí district | €1,400–2,000 | €2,000–2,800 |
| Barcelona – Eixample | €1,400–2,200 | €2,000–3,000 |
| Barcelona – Gràcia | €1,300–1,900 | €1,800–2,600 |

### Monthly Living Costs (Madrid / Barcelona)

- Groceries (home cooking): €300–500
- Monthly transit pass: Madrid ~€55 / Barcelona ~€80
- Utilities (electricity, gas, water): €80–150
- Healthcare: free via social insurance; private insurance required for NLV holders

### Pre-Move Checklist

1. **Get your NIE**: Spain's foreign ID number — essential for contracts, banking, and taxes. Apply at a Spanish consulate abroad or at a police station in Spain
2. **Empadronamiento**: Register at your local town hall (required for healthcare, schools, public services)
3. **Apply for TIE**: Apply for your residence card within 30 days of receiving your permit
4. **Beckham Law deadline**: Apply **within 6 months of arrival** — no exceptions after the deadline
5. **Private health insurance**: Mandatory for NLV applicants; must cover all of Spain
6. **Tax filing (Renta)**: Staying 183+ days makes you a tax resident — IRPF declaration required

Spain offers an excellent quality of life at a reasonable cost. Use MoveWorth to simulate your financial situation and plan your move with confidence.

---

### References

This article is based on the following official sources.

- **Visa Applications General**: [Spanish Ministry of Foreign Affairs – Consular Visa Info](https://www.exteriores.gob.es/Consulados/londres/en/ServiciosConsulares/Paginas/Consular/Visados-nacionales-Informacion-general.aspx)
- **Digital Nomad Visa (Startup Law)**: [Spanish Government – Startup Act & Digital Nomad Visa](https://one.gob.es/en/procedures/application-digital-nomad-visa)
- **Non-Lucrative Residence Visa**: [Spanish MFA – Non-Lucrative Visa](https://www.exteriores.gob.es/Consulados/londres/en/ServiciosConsulares/Paginas/Consular/Visado-de-residencia-no-lucrativa.aspx)`,
      zh: `西班牙以温暖的气候、丰富的文化和相对实惠的生活成本，成为越来越多外籍人士的移居首选。2023年《创业法》（Ley de Startups）的实施，使其对数字游民更具吸引力。

### 主要签证类型

**非盈利签证（NLV）**
适用于无需在西班牙工作、依靠境外收入或资产生活的申请者。
- 最低月收入：申请人本人约€2,400，每位受抚养家属另加约€600
- 所需材料：无犯罪记录证明、覆盖西班牙全境的私人医疗保险、银行存款证明
- 有效期：首次1年，续签2+2年（满5年可申请长期居留）
- 原则上不得在西班牙工作（后可转换为自雇或工作许可）

**数字游民签证（Ley de Startups / DNV）**
2023年2月推出，适用于为非西班牙公司远程工作的外籍人士。
- 最低月收入：€2,850（2026年标准，西班牙最低工资SMI的200%）
- 西班牙客户收入不得超过总收入的**20%**
- 有效期：1年签证→入境后可转换为3年居留许可（可续签2年）
- 可与贝克汉姆法并用：DNV持有人可从第一年起享受24%固定税率

**EU蓝卡（Tarjeta Azul UE）**
适用于持有西班牙企业工作邀约的高技能专业人士。
- 年薪门槛：约€37,000以上（视职业而定）
- 最短合同期限：1年

**创业者签证（Visado Emprendedor）**
适用于在西班牙创业或投资的人士，需提交商业计划并通过UGIE审批。

**黄金签证（Visa Dorada）——已关闭**
- 黄金签证全部路径（包括房产投资路径）**已于2025年4月3日正式全面废止**，不再受理任何新申请
- 现有持有人可继续续签
- 风险投资（€100万以上）及国债投资（€200万以上）路径仍在审议中

### 贝克汉姆法（Régimen IRNR / Ley Beckham）

适用于因就业或创业目的首次成为西班牙税务居民的特别税收制度。
- 西班牙境内收入适用**24%固定税率**（普通税率最高47%）
- 适用期：转入年份 + 随后5年，最长6年
- 申请条件：
  1. 过去10年中至少5年未为西班牙税务居民
  2. 因受雇、担任董事或开展商业活动而移居
- 申请截止：**抵达西班牙后6个月内**提交Modelo 149表格
- 注意：境外收入（股息、海外房产等）仍可能在西班牙缴纳预扣税

### 西班牙所得税（IRPF）标准税率表（2026年）

| 应税收入 | 国家税率 |
|---------|---------|
| €0〜€12,450 | 19% |
| €12,451〜€20,200 | 24% |
| €20,201〜€35,200 | 30% |
| €35,201〜€60,000 | 37% |
| €60,001〜€300,000 | 45% |
| 超过€300,001 | 47% |

*另需缴纳地方（自治区）税，实际税率因地区而异。*

### 社会保险费（2026年）

| 缴纳方 | 费率 |
|-------|------|
| 雇员负担 | 约6.35%（养老金4.7%+失业1.55%+培训0.1%） |
| 雇主负担 | 约29.9% |
| 自雇人员（RETA） | 月缴约€200〜500（2023年改革后按实际收入计算） |

### 费用参考

| 项目 | 费用 |
|------|------|
| 非盈利签证费 | 约€80〜160 |
| 数字游民签证费 | 约€80〜160（领事馆手续费） |
| NIE外国人识别号 | 约€10 |
| TIE居留证 | 约€16 |

### 主要城市外籍人士聚居区租金

| 区域 | 1居室 | 2居室 |
|------|------|------|
| 马德里·萨拉曼卡区 | €1,500〜2,200 | €2,200〜3,200 |
| 马德里·昌贝里区 | €1,400〜2,000 | €2,000〜2,800 |
| 巴塞罗那·艾克桑普勒区 | €1,400〜2,200 | €2,000〜3,000 |
| 巴塞罗那·格拉西亚区 | €1,300〜1,900 | €1,800〜2,600 |

### 月生活费参考（马德里/巴塞罗那）

- 伙食费（自炊为主）：€300〜500
- 交通月票：马德里约€55 / 巴塞罗那约€80
- 水电煤气费：€80〜150
- 医疗保险：参加社保者免费；NLV持有人须购买私人保险

### 移居前注意事项

1. **申请NIE**：西班牙外国人识别号，签合同、开银行账户、纳税均必需。可在驻外领事馆或入境后在警察局申请
2. **Empadronamiento户籍登记**：在居住地市政厅办理，享受医疗、就学、公共服务的前提
3. **申请TIE居留证**：获得居留许可后30天内提交申请
4. **贝克汉姆法申请期限**：**抵达西班牙后6个月内**申请，逾期不予受理
5. **私人医疗保险**：NLV申请人必须购买覆盖西班牙全境的保险
6. **所得税申报（Renta）**：在西班牙居住超过183天即成为税务居民，须申报IRPF

西班牙生活品质与生活成本之间的平衡极佳。使用MoveWorth提前模拟财务状况，从容规划移居计划。

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证申请总览**: [西班牙外交部 – 领事签证信息](https://www.exteriores.gob.es/Consulados/londres/en/ServiciosConsulares/Paginas/Consular/Visados-nacionales-Informacion-general.aspx)
- **数字游民签证（创业法）**: [西班牙政府 – 创业法与数字游民签证](https://one.gob.es/en/procedures/application-digital-nomad-visa)
- **非营利居留签证**: [西班牙外交部 – 非营利居留签证](https://www.exteriores.gob.es/Consulados/londres/en/ServiciosConsulares/Paginas/Consular/Visado-de-residencia-no-lucrativa.aspx)`,
    },
  },
  {
    slug: "visa-ge",
    category: "visa",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-ge.webp",
    date: "2026-03-19",
    readingTime: 12,
    title: {
      ja: "【2026年最新版】ジョージアのビザ・居留許可完全ガイド",
      en: "Georgia Visa & Residency Complete Guide 2026",
      zh: "【2026年最新版】格鲁吉亚签证与居留许可完全指南",
    },
    description: {
      ja: "ノービザ1年滞在・バーチャルゾーン・小規模ビジネス1%税率まで、ジョージア移住に必要な情報を2026年最新データで徹底解説。",
      en: "Visa-free 1-year stays, Virtual Zone zero tax, and 1% Small Business status — a complete 2026 guide to living and working in Georgia.",
      zh: "免签1年居留、虚拟区零税率、1%小企业税率——2026年最新移居格鲁吉亚完全指南。",
    },
    content: {
      ja: `ジョージア（グルジア）は、コーカサス地方に位置する国で、ビザなし長期滞在・超低税率・低生活費から、デジタルノマドや起業家に人気急上昇中の移住先です。高速インターネット・英語対応の行政手続き・EUへのアクセスの良さも魅力です。

### 入国・滞在制度

**ビザなし滞在（最長1年）**
日本・米国・EU・英国など約100カ国の国籍の方は、ビザなしで最長**365日間**ジョージアに滞在可能です。
- 観光・就業問わず原則として1年間は自由に滞在可能（ジョージア法上の「免税滞在」）
- 連続365日を超える場合は正式に居留許可の取得が必要
- ボーダーラン（一時出国後の再入国）は法的にグレーゾーン。長期的には正規許可を推奨

**居留許可（Residence Permit）**
1年以上継続してジョージアに滞在する場合に取得が必要。以下の活動で申請可能：

| 取得方法 | 主な要件 |
|--------|--------|
| 就労ビザ | ジョージア国内企業との雇用契約 |
| 自営業・事業活動 | 個人事業主登録または法人設立 |
| 不動産購入 | 35,000ラリ（約€12,000）相当以上の不動産取得 |
| ジョージア人との婚姻 | 婚姻証明書 |
| 投資家ビザ | 30万ラリ（約€103,000）以上の投資 |

- 居留許可の有効期間：最大6年（更新可能）
- 申請機関：公共サービス庁（Public Service Hall）

### ビジネス登録・税制

**バーチャルゾーン（Virtual Zone / VZ）**
ジョージア国外のクライアントにITサービスを提供する法人・個人事業主向けの特別税制。
- **法人税（Corporate Tax）：0%**（ジョージア国外売上に限る）
- **VAT：0%**（ジョージア国外売上に限る）
- 配当への課税：0%（2017年エストニア型法人税制導入後）
- 対象業種：ソフトウェア開発・IT、Webデザイン、ゲーム、SaaSなど
- **ジョージア国内クライアントへの売上は対象外**（通常税率15%の法人税が適用）

**小規模ビジネス制度（Small Business Status / 個人事業主）**
年間売上が500,000ラリ（約€170,000 ※レート1 GEL≒€0.34）以下の個人事業主向け。
- 売上**1%**の固定税率（2026年現在）
- 500,000ラリ超〜3,000,000ラリ：3%
- 3,000,000ラリ超：小規模ビジネスステータス喪失（標準所得税20%に移行）
- VATは年間500,000ラリ超で登録義務発生

**個人所得税（Personal Income Tax）**
- 標準税率：**20%**（フラットレート）
- ジョージア国外の雇用主から受け取る給与：非課税（ジョージア源泉の所得ではないため）
  ※ただし2025〜2026年に改正論議あり。最新の税務顧問への確認を推奨

**法人税（Corporate Income Tax）**
- 通常法人（非VZ）：**15%**（分配時課税型、エストニア方式）
- 配当として分配するまで課税なし

### ジョージアの所得税率表（2026年）

| 所得区分 | 税率 |
|---------|-----|
| 全額（フラット） | 20% |
| 配当・利子・ロイヤルティ | 5% |
| 不動産売却益 | 5% |
| 不動産賃料収入 | 5% |

### 費用の目安

| 項目 | 費用（GEL） | 目安（€） |
|------|-----------|--------|
| 居留許可申請費（通常） | 280 GEL | 約€95 |
| 居留許可申請費（速達） | 580 GEL | 約€197 |
| 個人事業主登録 | 無料〜50 GEL | 無料〜€17 |
| バーチャルゾーン登録 | 200 GEL前後 | 約€68 |
| 銀行口座開設 | 無料 | — |

### トビリシの家賃相場（外国人居住エリア）

| エリア | 1LDK | 2LDK |
|-------|------|------|
| ヴァケ地区（高級住宅街） | 1,500〜2,500 GEL（€510〜850） | 2,500〜4,000 GEL（€850〜1,360） |
| サブルタロ地区（外国人人気） | 1,200〜2,000 GEL（€408〜680） | 2,000〜3,000 GEL（€680〜1,020） |
| ナリカラ旧市街（短期） | 1,000〜1,800 GEL（€340〜612） | 1,500〜2,500 GEL（€510〜850） |

### 月々の生活費目安（トビリシ）

- 食費（自炊）：400〜700 GEL（€136〜238）
- 外食（レストラン）：1食200〜600 GEL
- 交通費（バス・地下鉄月額）：約50 GEL（€17）
- 光熱費（電気・ガス・水道）：150〜300 GEL（€51〜102）
- 高速インターネット（光回線）：約30〜50 GEL（€10〜17）

**合計目安：月1,800〜3,500 GEL（約€612〜1,190）**

### 移住前のチェックポイント

1. **個人IDコードの取得**：ジョージア公共サービス庁（PSH）の窓口で即日発行可能。銀行口座開設・登録に必要
2. **銀行口座の開設**：TBC Bank・Bank of Georgiaが主流。パスポートのみで開設可能（VPNなしでオンラインバンク利用可）
3. **バーチャルゾーン登録**：法人設立（LLC/LLC相当）後にジョージア財務省に申請。ITサービス業の方は最優先で検討
4. **小規模ビジネス登録**：PSHで申請。当日登録完了のケースも多い
5. **ビザ滞在日数の管理**：免税1年を超える場合は居留許可を正式取得
6. **医療保険の加入**：公的医療保険は居住者向けに整備されているが、外国人は民間保険が推奨

ジョージアは欧州へのアクセスが良く、インターネット速度も優秀で、コーカサスの豊かな文化を楽しめる移住先です。MoveWorthで生活コスト・税負担のシミュレーションをお試しください。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ジョージア電子ビザ**: [ジョージア外務省 – 電子ビザポータル](https://www.evisa.gov.ge/)
- **税務・起業情報**: [ジョージア国税局（Revenue Service）](https://www.rs.ge/Home-en)
- **在留・移民情報**: [ジョージア法務省 – 市民サービス庁](https://sda.gov.ge/en/products/migration-residence-permits/)`,
      en: `Georgia (the Caucasus country, not the US state) has become one of the world's most popular destinations for digital nomads and entrepreneurs — thanks to a visa-free 1-year stay, low flat-rate taxes, and an impressively affordable cost of living in Tbilisi.

### Entry & Stay Options

**Visa-Free Stay (Up to 365 Days)**
Citizens of Japan, the US, EU, UK, and about 100 other countries can stay in Georgia for up to **365 days** without a visa.
- No registration required for stays under 1 year
- Border runs are legally a grey area — for long-term stability, a formal residence permit is recommended
- The 365-day rule resets upon re-entry after leaving the country

**Residence Permit**
Required for continuous stays beyond 1 year. Can be obtained through:

| Route | Key Requirement |
|-------|----------------|
| Employment | Contract with a Georgian employer |
| Self-employment / Business | Registered as individual entrepreneur or LLC |
| Property purchase | Property worth 35,000 GEL (~€12,000)+ |
| Marriage to a Georgian citizen | Marriage certificate |
| Investor visa | Investment of 300,000 GEL (~€103,000)+ |

- Permit validity: up to 6 years (renewable)
- Applying authority: Public Service Hall (PSH)

### Business Registration & Tax

**Virtual Zone (VZ) Status**
For IT companies providing services to clients **outside** Georgia.
- **Corporate tax: 0%** on non-Georgian revenue
- **VAT: 0%** on non-Georgian revenue
- Dividends: 0% (under Georgia's 2017 Estonian-style tax reform)
- Eligible sectors: software development, IT, web design, gaming, SaaS
- **Revenue from Georgian clients is not exempt** (standard 15% corporate tax applies)

**Small Business Status (Individual Entrepreneur)**
For sole traders with annual turnover under 500,000 GEL (~€170,000 at 1 GEL ≈ €0.34).
- Turnover up to 500,000 GEL: **1% flat tax**
- 500,000 GEL–3,000,000 GEL: 3%
- Above 3,000,000 GEL: Small Business status lost; standard 20% PIT applies
- VAT registration required above 500,000 GEL/year

**Personal Income Tax (PIT)**
- Standard flat rate: **20%**
- Salary from a foreign employer (outside Georgia): typically not subject to Georgian tax, as it is not Georgia-sourced income
  *Note: Tax reform discussions ongoing in 2025–2026; consult a local tax advisor*

**Corporate Income Tax (for LLCs)**
- Non-VZ standard rate: **15%** (distribution-based / Estonian model — no tax until profits are distributed)

### Georgian Tax Summary Table (2026)

| Income Type | Rate |
|------------|------|
| Employment / self-employment income | 20% |
| Dividends, interest, royalties | 5% |
| Property sale gains | 5% |
| Rental income | 5% |

### Cost Overview

| Item | Cost (GEL) | Approx. (€) |
|------|-----------|------------|
| Residence permit (standard) | 280 GEL | ~€95 |
| Residence permit (expedited) | 580 GEL | ~€197 |
| Individual entrepreneur registration | Free–50 GEL | Free–€17 |
| Virtual Zone registration | ~200 GEL | ~€68 |
| Bank account opening | Free | — |

### Rent in Expat-Friendly Tbilisi Neighbourhoods

| Neighbourhood | 1BR | 2BR |
|--------------|-----|-----|
| Vake (upscale, popular with expats) | 1,500–2,500 GEL (€510–850) | 2,500–4,000 GEL (€850–1,360) |
| Saburtalo (central, digital nomad hub) | 1,200–2,000 GEL (€408–680) | 2,000–3,000 GEL (€680–1,020) |
| Old Town / Narikala (charming, touristy) | 1,000–1,800 GEL (€340–612) | 1,500–2,500 GEL (€510–850) |

### Monthly Living Costs (Tbilisi)

- Groceries (home cooking): 400–700 GEL (€136–238)
- Eating out: 200–600 GEL per meal at a mid-range restaurant
- Monthly transit pass (bus + metro): ~50 GEL (€17)
- Utilities (electricity, gas, water): 150–300 GEL (€51–102)
- High-speed fibre internet: 30–50 GEL/month (€10–17)

**Total estimate: 1,800–3,500 GEL/month (~€612–1,190)**

### Pre-Move Checklist

1. **Get a personal ID code**: Available same-day at a Public Service Hall (PSH). Required for bank accounts and business registration
2. **Open a bank account**: TBC Bank and Bank of Georgia are the standard choices. Passport-only opening available; online banking works without a VPN
3. **Register for Virtual Zone**: After incorporating an LLC, apply to the Georgian Ministry of Finance. Top priority for IT service providers
4. **Register as individual entrepreneur**: Same-day registration available at PSH. Choose Small Business status at the time of registration
5. **Track your visa days**: If you plan to stay beyond 365 days, apply for a formal residence permit before the deadline
6. **Health insurance**: Public insurance exists for residents, but private insurance is recommended for foreign nationals

Georgia offers fast internet, a low cost of living, and easy EU connections — all with some of the lowest tax rates in the world. Use MoveWorth to simulate your finances before making the move.

---

### References

This article is based on the following official sources.

- **Georgia e-Visa**: [Georgian Ministry of Foreign Affairs – e-Visa Portal](https://www.evisa.gov.ge/)
- **Tax & Business Registration**: [Georgia Revenue Service](https://www.rs.ge/Home-en)
- **Residence & Migration**: [Georgian Ministry of Justice – Public Service Hall](https://sda.gov.ge/en/products/migration-residence-permits/)`,
      zh: `格鲁吉亚（高加索国家，非美国乔治亚州）以免签1年居留、低税率和低廉的第比利斯生活成本，迅速成为全球数字游民和创业者最热门的移居目的地之一。

### 入境与居留制度

**免签居留（最长365天）**
日本、美国、欧盟、英国等约100个国家的公民可在格鲁吉亚免签居留最长**365天**。
- 1年以内无需登记注册
- 重新入境后365天重新计算
- 长期定居建议申请正式居留许可

**居留许可**
连续居留超过1年须申请，可通过以下方式获得：

| 途径 | 主要条件 |
|------|--------|
| 受雇就业 | 与格鲁吉亚本地企业签订劳动合同 |
| 个体经营/商业活动 | 注册个体工商户或有限责任公司 |
| 购置房产 | 购置价值35,000拉里（约€12,000）以上的房产 |
| 与格鲁吉亚公民结婚 | 提供结婚证明 |
| 投资者签证 | 投资30万拉里（约€103,000）以上 |

- 居留许可有效期：最长6年（可续签）
- 申请机关：公共服务厅（PSH）

### 商业注册与税收制度

**虚拟区制度（Virtual Zone / VZ）**
向格鲁吉亚**境外**客户提供IT服务的法人或个体经营者可享受：
- **企业所得税：0%**（境外收入）
- **增值税：0%**（境外收入）
- 股息分红：0%（2017年采用爱沙尼亚式税制后）
- 适用行业：软件开发、IT、网页设计、游戏、SaaS等
- **境内客户收入不适用**（按标准15%企业税率征收）

**小企业身份（个体工商户）**
年营业额不超过500,000拉里（约€170,000，1拉里≈€0.34）的个体经营者：
- 500,000拉里以内：**营业额1%**固定税率
- 500,000〜3,000,000拉里：3%
- 超过300万拉里：失去小企业身份，按标准20%个人所得税计算
- 年营业额超过500,000拉里须注册增值税

**个人所得税（PIT）**
- 标准税率：**20%**（统一税率）
- 来自境外雇主的薪资：通常不属于格鲁吉亚来源收入，可免征个人所得税
  ※2025〜2026年税改讨论进行中，建议咨询当地税务顾问

**企业所得税（有限责任公司）**
- 非VZ标准税率：**15%**（爱沙尼亚式分配时征税，分配前不征税）

### 格鲁吉亚税率一览（2026年）

| 收入类型 | 税率 |
|--------|-----|
| 工资/个体经营收入 | 20% |
| 股息、利息、版权费 | 5% |
| 房产出售收益 | 5% |
| 租金收入 | 5% |

### 费用参考

| 项目 | 费用（拉里） | 约（€） |
|------|-----------|--------|
| 居留许可（普通） | 280拉里 | 约€95 |
| 居留许可（加急） | 580拉里 | 约€197 |
| 个体工商户注册 | 免费〜50拉里 | 免费〜€17 |
| 虚拟区注册 | 约200拉里 | 约€68 |
| 开设银行账户 | 免费 | — |

### 第比利斯外籍人士聚居区租金

| 区域 | 1居室 | 2居室 |
|------|------|------|
| 瓦克区（高档居住区，外籍人士聚居） | 1,500〜2,500拉里（€510〜850） | 2,500〜4,000拉里（€850〜1,360） |
| 萨布尔塔洛区（市中心，游民聚集地） | 1,200〜2,000拉里（€408〜680） | 2,000〜3,000拉里（€680〜1,020） |
| 纳里卡拉旧城区（有特色，较多游客） | 1,000〜1,800拉里（€340〜612） | 1,500〜2,500拉里（€510〜850） |

### 月生活费参考（第比利斯）

- 伙食费（自炊）：400〜700拉里（€136〜238）
- 餐厅用餐：每餐约200〜600拉里
- 交通月票（公交+地铁）：约50拉里（€17）
- 水电煤气费：150〜300拉里（€51〜102）
- 光纤宽带：30〜50拉里/月（€10〜17）

**月生活费合计：约1,800〜3,500拉里（€612〜1,190）**

### 移居前注意事项

1. **申请个人ID编码**：在公共服务厅（PSH）当天即可领取，银行开户和商业注册必需
2. **开设银行账户**：TBC银行和格鲁吉亚银行是主要选择，仅凭护照即可开户
3. **注册虚拟区**：成立有限责任公司后向财政部申请，IT服务业优先考虑
4. **注册个体工商户**：在PSH可当天完成，注册时选择小企业身份
5. **管理免签居留天数**：超过365天须正式申请居留许可
6. **医疗保险**：建议外籍人士购买私人医疗保险

格鲁吉亚网速快、生活成本低廉、欧洲交通便利，税率更是全球最低之列。使用MoveWorth提前模拟财务状况，从容规划移居计划。

---

### 参考资料

本文信息基于以下官方资料整理。

- **格鲁吉亚电子签证**: [格鲁吉亚外交部 – 电子签证门户](https://www.evisa.gov.ge/)
- **税务及企业注册**: [格鲁吉亚税务总局（Revenue Service）](https://www.rs.ge/Home-en)
- **居留及移民信息**: [格鲁吉亚司法部 – 公共服务大厅](https://sda.gov.ge/en/products/migration-residence-permits/)`,
    },
  },
  {
    slug: "visa-ie",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-ie.webp",
    title: {
      ja: "【2026年最新版】アイルランドのビザ・就労許可完全ガイド",
      en: "Ireland Visa & Work Permit Complete Guide 2026",
      zh: "【2026年最新版】爱尔兰签证与就业许可完全指南",
    },
    description: {
      ja: "クリティカルスキル就労許可・所得税・ダブリン家賃まで、アイルランド移住に必要なビザの種類・要件・費用を2026年最新データで徹底解説。",
      en: "Critical Skills permit, income tax rates, and Dublin rent — a complete 2026 guide to working and living in Ireland.",
      zh: "关键技能就业许可、所得税率、都柏林租金——2026年最新移居爱尔兰完全指南。",
    },
    content: {
      ja: `アイルランドは欧州最大のテックハブのひとつで、Google・Meta・Apple・Microsoft・Metaなど100社以上のグローバル企業が欧州本社を構えています。英語が公用語で、欧州で活躍したい方にとって最有力の移住先のひとつです。

### 主な就労許可の種類

**クリティカルスキル就労許可（CSEP：Critical Skills Employment Permit）**
アイルランドが人材不足と認定した職種（Critical Skills Occupations List収録）向けの最優遇許可。
- 対象職種例：ソフトウェアエンジニア、データサイエンティスト、医師、看護師、金融アナリスト
- 最低年収：**€40,904以上**（2026年3月改定）
- 有効期間：初回**2年間**（更新後は無制限就労許可（UWP）が取得可能）
- 配偶者・パートナーの就労許可（Stamp 1G）も同時申請可能
- 申請費：€1,000（雇用主負担）

**一般就労許可（GEP：General Employment Permit）**
CSEP対象外の職種向けの就労許可。ただし「禁止職種リスト」掲載職種は申請不可。
- 雇用主がアイルランド・EEA国内で採用活動を行ったことの証明（求人公示）が必要
- 最低年収：**€36,605以上**（2026年3月改定）
- 有効期間：2年間（更新可能）
- 申請費：€1,000

**企業内転勤許可（ICT：Intra-Company Transfer）**
多国籍企業の海外オフィスからアイルランド拠点への転勤者向け。
- 有効期間：最長5年（シニアマネージャー・専門家は最長5年、研修生は最長1年）
- 申請費：€500

**スタートアップ起業家プログラム（STEP：Startup Entrepreneur Programme）**
革新的な事業アイデアでアイルランドでの起業を目指す方向け。
- 事業計画・資金計画をEnterprise Irelandに提出・審査を受ける必要あり
- 事業開発に1年間就労可能（延長可）

**EUブルーカード**
年収€60,000以上の高度技能者向けEU共通ビザ。EU域内の他国への転居が比較的容易。

### スタンプ制度（Stamp System）

アイルランドは入国許可の種類をスタンプで管理します。

| スタンプ | 内容 |
|---------|-----|
| Stamp 1 | 就労許可保有者（雇用先に限定） |
| Stamp 1G | 卒業後の就職活動期間（Graduate Scheme）またはCSEP保有者の配偶者 |
| Stamp 2 | 学生（ビザ保有中の学生） |
| Stamp 4 | 合法的な5年以上滞在後に取得可。就労許可不要で自由に就労可能 |
| Stamp 5 | 10年以上滞在後の無制限居留。就労許可不要 |

### アイルランドの所得税・社会保険（2026年）

アイルランドの税負担は「所得税（Income Tax）＋USC（社会扶助税）＋PRSI（社会保険料）」の3層構造です。

**所得税（Income Tax）**

| 課税所得 | 税率 |
|---------|-----|
| 単身：€44,000以下 | 20%（標準税率） |
| 単身：€44,001以上 | 40%（高税率） |
| 夫婦共働き：€88,000以下 | 20% |
| 夫婦共働き：€88,001以上 | 40% |

**USC（Universal Social Charge）**

| 課税所得 | USC税率 |
|---------|---------|
| €0〜€12,012 | 0.5% |
| €12,013〜€25,760 | 2% |
| €25,761〜€70,044 | 4% |
| €70,045超 | 8% |

**PRSI（Pay Related Social Insurance）**
- 被用者：収入の**4%**（週€352超から課税）
- 雇用主：収入の**10.95%**

**手取りシミュレーション例（年収€70,000の場合）**
- 所得税：約€14,800
- USC：約€2,410
- PRSI：約€2,800
- 手取り概算：約€50,000（実効税率約28.6%）

### 費用の目安

| 項目 | 費用 |
|------|------|
| CSEP申請費 | €1,000 |
| GEP申請費 | €1,000 |
| ICT申請費 | €500 |
| IRP（居留登録）カード | €300 |
| Stamp変更申請 | €300 |

### ダブリンの家賃相場（外国人居住エリア）

| エリア | 1LDK | 2LDK |
|-------|------|------|
| ダブリン2区（市中心部・外国人人気） | €2,200〜3,200 | €3,200〜4,500 |
| ダブリン4区（バラスブリッジ・高級住宅街） | €2,500〜3,800 | €3,500〜5,000 |
| ダブリン6区（レイスミーンズ） | €2,000〜2,900 | €2,900〜3,800 |
| ダブリン外縁部（ブレイ・ダン・レアリ） | €1,600〜2,400 | €2,200〜3,200 |

### 月々の生活費目安（ダブリン）

- 食費（自炊）：€400〜600/月
- 交通費（Luas・DART月定期）：約€130〜150
- 光熱費：€120〜200/月
- 公的医療（GMS）：社会保険加入者は原則カバー（GP訪問は一部有料）

### 移住前のチェックポイント

1. **PPS番号の取得**：アイルランドの社会保険番号（Personal Public Service Number）。就労・医療・納税に必須。Department of Social Protectionで申請
2. **IRP（居留登録）カード**：入国後90日以内にGarda National Immigration Bureau（GNIB）またはONIEで登録。€300
3. **銀行口座**：AIB・Bank of Ireland・N26など。PPS番号取得前は開設が制限される場合あり
4. **住宅探し**：ダブリンの住宅不足は2026年も深刻。Daft.ie・MyHomeで事前リサーチ必須
5. **Stamp 4取得計画**：5年就労後に申請。申請後は雇用形態・雇用先を問わず自由に就労可能
6. **税務登録**：就労開始後、Revenue.ieのmyAccountで自身の税務登録を行う

アイルランドはIT・製薬・金融業界への就職・転職を考える方には特に魅力的な移住先です。MoveWorthで税引き後の手取りと生活費を事前にシミュレーションしてみてください。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [アイルランド移民局（Irish Immigration Service）](https://www.irishimmigration.ie/)
- **クリティカルスキル就労許可**: [企業・貿易・雇用省 – Critical Skills Employment Permit](https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/)
- **税務登録（myAccount）**: [アイルランド税務庁（Revenue）– 個人税務登録](https://www.revenue.ie/en/online-services/services/myaccount/index.aspx)`,
      en: `Ireland is one of Europe's premier tech hubs, home to the European headquarters of Google, Meta, Apple, Microsoft, and over 100 other multinationals. As an English-speaking EU country, it's a top destination for professionals who want to build a career in Europe.

### Main Work Permit Types

**Critical Skills Employment Permit (CSEP)**
The most favorable permit for roles on Ireland's Critical Skills Occupations List.
- Eligible roles: software engineers, data scientists, doctors, nurses, financial analysts, and more
- Minimum salary: **€40,904+** (revised March 2026; some roles have different thresholds)
- Validity: **2 years** initially → leads to an Unrestricted Work Permit (UWP) on renewal
- Spouse/partner can receive a Stamp 1G (work authorization) simultaneously
- Application fee: €1,000 (paid by employer)

**General Employment Permit (GEP)**
For roles not on the Critical Skills List. Roles on the Ineligible Occupations List cannot apply.
- Employer must prove the Irish/EEA labor market was tested (job advertisement required)
- Minimum salary: **€36,605+** (revised March 2026)
- Validity: 2 years (renewable)
- Application fee: €1,000

**Intra-Company Transfer (ICT) Permit**
For employees moving from an overseas office to an Irish entity.
- Senior managers/specialists: up to 5 years; trainees: up to 1 year
- Application fee: €500

**Startup Entrepreneur Programme (STEP)**
For innovative entrepreneurs seeking to establish a business in Ireland.
- Must submit a business plan and funding plan for assessment by Enterprise Ireland

**EU Blue Card**
For highly skilled workers earning €60,000+. Enables easier EU mobility.

### The Stamp System

Ireland tracks residence permissions through a stamp system.

| Stamp | Meaning |
|-------|---------|
| Stamp 1 | Work permit holder (tied to specific employer) |
| Stamp 1G | Graduate job seeker or CSEP holder's spouse |
| Stamp 2 | Student visa holder |
| Stamp 4 | After 5+ years of lawful residence — work freely without a permit |
| Stamp 5 | After 10+ years — unlimited residence, no work permit needed |

### Irish Income Tax & Social Insurance (2026)

Ireland's tax burden consists of three layers: Income Tax + USC + PRSI.

**Income Tax**

| Taxable Income | Rate |
|---------------|------|
| Single: up to €44,000 | 20% (standard rate) |
| Single: above €44,000 | 40% (higher rate) |
| Married (dual income): up to €88,000 | 20% |
| Married (dual income): above €88,000 | 40% |

**Universal Social Charge (USC)**

| Income Band | USC Rate |
|------------|---------|
| €0–€12,012 | 0.5% |
| €12,013–€25,760 | 2% |
| €25,761–€70,044 | 4% |
| Above €70,044 | 8% |

**PRSI (Pay Related Social Insurance)**
- Employee: **4%** (on earnings above €352/week)
- Employer: **10.95%**

**Take-home example (€70,000/year)**
- Income tax: ~€14,800
- USC: ~€2,410
- PRSI: ~€2,800
- Approximate net: ~€50,000 (effective rate ~28.6%)

### Cost Overview

| Item | Cost |
|------|------|
| CSEP application fee | €1,000 |
| GEP application fee | €1,000 |
| ICT application fee | €500 |
| IRP (residence) card | €300 |
| Stamp change | €300 |

### Rent in Dublin's Expat Neighbourhoods

| Area | 1BR | 2BR |
|------|-----|-----|
| Dublin 2 (city centre, popular with expats) | €2,200–3,200 | €3,200–4,500 |
| Dublin 4 (Ballsbridge, upscale) | €2,500–3,800 | €3,500–5,000 |
| Dublin 6 (Rathmines) | €2,000–2,900 | €2,900–3,800 |
| Outer Dublin (Bray, Dún Laoghaire) | €1,600–2,400 | €2,200–3,200 |

### Monthly Living Costs (Dublin)

- Groceries (home cooking): €400–600
- Monthly transit pass (Luas, DART): ~€130–150
- Utilities (electricity, gas, broadband): €120–200
- Healthcare: GMS covers most services; GP visits typically €50–80 without a medical card

### Pre-Move Checklist

1. **Get a PPS Number**: Ireland's social insurance number — essential for employment, healthcare, and tax. Apply at the Department of Social Protection
2. **Register for IRP card**: Within 90 days of arrival at GNIB or ONIE. Fee: €300
3. **Open a bank account**: AIB, Bank of Ireland, or N26 are popular. Opening may be restricted before PPS is issued
4. **Housing search**: Dublin's housing shortage remains severe in 2026 — research on Daft.ie and MyHome before you arrive
5. **Plan for Stamp 4**: After 5 years, apply for Stamp 4 to work freely without a permit
6. **Tax registration**: Register at Revenue.ie myAccount once employment starts

Ireland is particularly compelling for IT, pharma, and finance professionals. Use MoveWorth to simulate your take-home pay and living costs before making the move.

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits General**: [Irish Immigration Service](https://www.irishimmigration.ie/)
- **Critical Skills Employment Permit**: [Dept. of Enterprise – Critical Skills Employment Permit](https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/)
- **Tax Registration (myAccount)**: [Revenue Ireland – Personal Tax Registration](https://www.revenue.ie/en/online-services/services/myaccount/index.aspx)`,
      zh: `爱尔兰是欧洲最重要的科技中心之一，谷歌、Meta、苹果、微软等100多家跨国企业在此设立欧洲总部。作为英语国家和欧盟成员，是希望在欧洲发展职业生涯的最佳选择之一。

### 主要就业许可类型

**关键技能就业许可（CSEP）**
针对爱尔兰短缺职业名单（Critical Skills Occupations List）中职位的最优惠许可。
- 适用岗位：软件工程师、数据科学家、医生、护士、金融分析师等
- 最低年薪：**€40,904以上**（2026年3月修订）
- 有效期：初次**2年**→续签可获无限制就业许可（UWP）
- 配偶/伴侣可同时申请Stamp 1G工作授权
- 申请费：€1,000（由雇主支付）

**一般就业许可（GEP）**
适用于不在关键技能名单的职位（不可申请职业清单内职位除外）。
- 雇主须证明已在爱尔兰/欧洲经济区内进行招聘（需发布招聘公告）
- 最低年薪：**€36,605以上**（2026年3月修订）
- 有效期：2年（可续签）
- 申请费：€1,000

**企业内部调动许可（ICT）**
适用于从跨国公司海外机构调至爱尔兰分支的员工。
- 高级管理人员/专业人士：最长5年；受训人员：最长1年
- 申请费：€500

**创业企业家计划（STEP）**
适用于希望在爱尔兰创建创新型企业的创业者，需向爱尔兰企业局提交商业计划审核。

**EU蓝卡**
适用于年薪€60,000以上的高技能人才，便于在欧盟各国间自由流动。

### 盖章制度（Stamp System）

爱尔兰通过盖章管理居留许可类别。

| 盖章 | 含义 |
|-----|-----|
| Stamp 1 | 持就业许可者（限指定雇主） |
| Stamp 1G | 毕业生求职期或CSEP持有人配偶 |
| Stamp 2 | 学生签证持有人 |
| Stamp 4 | 合法居留满5年后获得，无需就业许可可自由就业 |
| Stamp 5 | 居留满10年后，无限期居留，无需就业许可 |

### 爱尔兰所得税与社会保险（2026年）

爱尔兰的税负由所得税（Income Tax）＋USC（普遍社会税）＋PRSI（社会保险）三部分构成。

**所得税（Income Tax）**

| 应税收入 | 税率 |
|---------|-----|
| 单身：€44,000以内 | 20%（标准税率） |
| 单身：€44,000以上 | 40%（高税率） |
| 夫妻双收入：€88,000以内 | 20% |
| 夫妻双收入：€88,000以上 | 40% |

**普遍社会税（USC）**

| 收入区间 | USC税率 |
|---------|--------|
| €0〜€12,012 | 0.5% |
| €12,013〜€25,760 | 2% |
| €25,761〜€70,044 | 4% |
| €70,044以上 | 8% |

**PRSI（社会保险费）**
- 雇员：收入的**4%**（周收入超€352起征）
- 雇主：**10.95%**

**税后收入估算（年薪€70,000）**
- 所得税：约€14,800
- USC：约€2,410
- PRSI：约€2,800
- 税后净收入：约€50,000（实际税率约28.6%）

### 费用参考

| 项目 | 费用 |
|------|------|
| CSEP申请费 | €1,000 |
| GEP申请费 | €1,000 |
| ICT申请费 | €500 |
| IRP居留证 | €300 |
| 更改盖章 | €300 |

### 都柏林外籍人士聚居区租金

| 区域 | 1居室 | 2居室 |
|------|------|------|
| 都柏林2区（市中心，外籍人士聚居） | €2,200〜3,200 | €3,200〜4,500 |
| 都柏林4区（巴拉斯布里奇，高档住宅） | €2,500〜3,800 | €3,500〜5,000 |
| 都柏林6区（拉思明斯） | €2,000〜2,900 | €2,900〜3,800 |
| 都柏林郊区（布雷、敦莱里） | €1,600〜2,400 | €2,200〜3,200 |

### 月生活费参考（都柏林）

- 伙食费（自炊）：€400〜600/月
- 交通月票（Luas、DART）：约€130〜150
- 水电煤气宽带：€120〜200/月
- 医疗：社保缴纳者基本享受GMS保障；GP就诊通常€50〜80（无医疗卡时）

### 移居前注意事项

1. **申请PPS号码**：爱尔兰社会保险号，就业、医疗、纳税必备。向社会保护部申请
2. **办理IRP居留证**：入境后90天内在GNIB或ONIE登记，费用€300
3. **开设银行账户**：AIB、爱尔兰银行、N26均可，PPS号码领取前可能受限
4. **提前寻房**：都柏林2026年住房短缺依旧严峻，建议在Daft.ie和MyHome提前搜索
5. **规划Stamp 4申请**：就业满5年后申请，可自由从事任何工作
6. **税务登记**：就业后在Revenue.ie的myAccount完成个人税务注册

爱尔兰对IT、制药、金融领域的求职者极具吸引力。使用MoveWorth提前模拟税后收入与生活成本，从容规划移居计划。

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [爱尔兰移民局（Irish Immigration Service）](https://www.irishimmigration.ie/)
- **关键技能就业许可**: [企业部 – 关键技能就业许可](https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/)
- **税务注册（myAccount）**: [爱尔兰税务局（Revenue）– 个人税务注册](https://www.revenue.ie/en/online-services/services/myaccount/index.aspx)`,
    },
  },
  {
    slug: "visa-se",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-se.webp",
    title: {
      ja: "【2026年最新版】スウェーデンのビザ・就労許可完全ガイド",
      en: "Sweden Work Permit Requirements 2026 | Visa, Expertskatt & Immigration Guide",
      zh: "【2026年最新版】瑞典签证与就业许可完全指南",
    },
    description: {
      ja: "就労許可・専門家税制・所得税・ストックホルム家賃まで、スウェーデン移住に必要な情報を2026年最新データで徹底解説。",
      en: "Sweden work permit requirements 2026 — eligibility, salary rules, and application steps. Plus Expertskatt tax break, income tax rates, and Stockholm rent guide.",
      zh: "工作许可、专家税收优惠、所得税、斯德哥尔摩租金——2026年最新移居瑞典完全指南。",
    },
    content: {
      ja: `スウェーデンは高水準の社会保障・教育・医療制度を誇る北欧の国です。高税率ではあるものの、生活の質・幸福度の高さで世界トップクラスにランクされ、IKEAやSpotify・Erikssonなど世界的企業を多数輩出したイノベーション大国でもあります。

### 主な就労ビザ・許可の種類

**就労許可（Arbetstillstånd）**
EU/EEA圏外の国籍者がスウェーデンで就労するために必要な許可です。
- 雇用主側がスウェーデン移民庁（Migrationsverket）を通じて申請を主導
- 署名済みの雇用契約が必要（採用決定後に申請開始）
- 最低賃金要件：当該職種の労組合意賃金（kollektivavtal）以上
  ※技術系職種の目安：月収SEK 25,000〜35,000以上
- 有効期間：雇用契約期間連動（最大**2年**）、更新可能
- **4年間の就労後**に永住権（permanent uppehållstillstånd）申請が可能
- 申請費：SEK 2,000（雇用主負担）

**EUブルーカード（EU Blue Card）**
高度技能者向けのEU共通就労許可。2023年改正により要件が変更。
- スウェーデンの対象職種かつ月収**SEK 52,000以上**（年収SEK 624,000以上、2025年7月改定）
- 有効期間：最大4年（EU他国へのモビリティも容易）

**自営業許可（Tillstånd för eget företag）**
スウェーデンで自分の会社を設立・経営する方向けの許可。
- 事業計画・財務計画の提出が必要
- 事業の持続可能性・自立性の証明が求められる

**求職者ビザ（Arbetstillstånd för jobbsökande）**
高度な学歴を持つ人材がスウェーデン国内で直接就職活動をするためのビザ。2022年6月導入。
- 対象：修士号・博士号・高度職業資格（advanced vocational degree）保有者
- 有効期間：最大**9ヶ月**（就労不可、就職活動のみ）
- 滞在中に雇用契約を結んだ場合、**国内から就労許可に切り替え申請が可能**（許可申請後は就労開始可）
- 財政的自立証明が必要（月SEK 13,000〜18,000相当の生活費）
- 申請機関：Migrationsverket ｜ [公式ページ](https://www.migrationsverket.se/en/you-want-to-apply/work/look-for-work/look-for-work-or-start-a-business.html)

**自営業許可（Tillstånd för eget företag）**
スウェーデンで自分の会社を設立・経営する方向けの許可。フリーランス・ノマド層も対象。
- 事業計画書・財務計画書の提出が必須
- 財政要件：本人分**SEK 200,000**＋配偶者SEK 100,000＋子ども1人につきSEK 50,000（2年分の生活費）
- 申請国内での事業実績・業界経験があると有利
- 有効期間：最大**2年**（更新可）
- 申請機関：Migrationsverket ｜ [公式ページ](https://www.migrationsverket.se/en/you-want-to-apply/work/employee-or-self-employed/self-employed-people.html)

**研究者ビザ（Forskarvisering）**
スウェーデンの大学・研究機関との研究受入れ協定があれば申請可能。就労許可不要の場合も。

### 専門家税制（Expertskatt / Expert Tax）

海外から招聘された高度技能者・研究者向けの特別税制。
- 対象：スウェーデン国外から招聘された研究者・専門家・高給与の経営幹部
- 月収が基準額（**SEK 88,200/月以上**、2026年時点。約年収SEK 1,058,400）であること
- 所得の**25%**が課税対象外 → 実効税率が大幅軽減
- 適用期間：スウェーデン到着後最大**7年間**
- 申請機関：スウェーデン研究費財団（Forskarskattenämnden）

### スウェーデンの所得税（2026年）

スウェーデンは国税（statlig skatt）＋地方税（kommunalskatt）の2層構造。

**地方税（Kommunalskatt）：全国平均約32%**（市区町村によって31〜33%前後）

**国税（Statlig inkomstskatt）**

| 課税所得（年収） | 税率 |
|--------------|-----|
| SEK 625,800以下 | 0%（地方税のみ） |
| SEK 625,800超 | +20%（地方税に上乗せ）|

→ 年収SEK 625,800（約€55,000）超から合計税率が約52%になる構造。

**社会保険料（arbetsgivaravgift）**
- 雇用主負担：給与の約**31.42%**
- 被用者負担：原則なし（雇用主が全額負担）

### 費用の目安

| 項目 | 費用 |
|------|------|
| 就労許可申請費 | SEK 2,000（雇用主負担） |
| 永住権申請費 | SEK 1,500 |
| 市民権申請費 | 無料 |
| 個人番号（Personnummer）登録 | 無料 |

### ストックホルムの家賃相場（外国人居住エリア）

| エリア | 1LDK | 2LDK |
|-------|------|------|
| セーデルマルム（Södermalm） | SEK 14,000〜20,000（€1,200〜1,720） | SEK 20,000〜28,000（€1,720〜2,410） |
| エステルマルム（Östermalm・高級） | SEK 18,000〜28,000（€1,550〜2,410） | SEK 28,000〜40,000（€2,410〜3,450） |
| クングスホルメン（Kungsholmen） | SEK 13,000〜19,000（€1,120〜1,635） | SEK 19,000〜26,000（€1,635〜2,240） |
| ヨーテボリ（Göteborg） | SEK 10,000〜15,000（€860〜1,290） | SEK 15,000〜22,000（€1,290〜1,895） |

### 月々の生活費目安（ストックホルム）

- 食費（自炊）：SEK 3,500〜5,000（€301〜430）
- 交通費（SL月定期）：SEK 975（€84）
- 光熱費（電気・暖房・水道）：SEK 1,000〜2,000（€86〜172）
- 公的医療：原則無料（Personnummer取得後。GP訪問はSEK 300〜400の自己負担あり）

### 移住前のチェックポイント

1. **個人番号（Personnummer）の取得**：スウェーデンの住民番号。就労・銀行口座開設・医療・納税すべてに必要。スウェーデン税務庁（Skatteverket）に申請
2. **BankID**：スウェーデンの電子認証システム。行政手続き・銀行・医療のオンラインサービスに必須（Personnummer取得後に申請可能）
3. **住宅探し**：ストックホルムの公営住宅（hyresrätt）は待機リストが10年以上。着任前に民間賃貸（Bostadsförmedlingen・Hemnet等）を手配すること
4. **専門家税制の申請期限**：スウェーデン到着後**3ヶ月以内**に申請が必要
5. **就労許可の更新**：就労4年が経過したら永住権申請を忘れずに
6. **言語**：就労・生活は英語でほぼ問題なし。ただし長期定住を考える場合はSFI（スウェーデン語コース、無料）への参加を推奨

スウェーデンは高い税率の一方で、育児・医療・教育の充実した社会保障が魅力です。MoveWorthで税引き後の生活水準をシミュレーションしてみてください。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **就労許可（Arbetstillstånd）**: [Migrationsverket – 就労許可申請](https://www.migrationsverket.se/en/you-want-to-apply/work/employee-or-self-employed/employees.html)
- **求職者ビザ**: [Migrationsverket – 求職・起業目的の在留許可](https://www.migrationsverket.se/en/you-want-to-apply/work/look-for-work/look-for-work-or-start-a-business.html)
- **自営業許可**: [Migrationsverket – 自営業者向け在留許可](https://www.migrationsverket.se/en/you-want-to-apply/work/employee-or-self-employed/self-employed-people.html)
- **税務登録・番号取得**: [スウェーデン国税庁（Skatteverket）– 移住者向け情報](https://www.skatteverket.se/movingtosweden)`,
      en: `Sweden is a Nordic country renowned for its high-quality social security, healthcare, and education systems. Despite some of Europe's highest income taxes, it consistently ranks among the world's happiest and most livable countries — and has produced global companies like IKEA, Spotify, and Ericsson.

### Main Work Visa / Permit Types

**Work Permit (Arbetstillstånd)**
Required for non-EU/EEA nationals to work in Sweden.
- The employer leads the application through the Swedish Migration Agency (Migrationsverket)
- A signed employment contract is required before applying
- Minimum wage: must meet or exceed the union-agreed (kollektivavtal) rate for the role
  — Tech roles typically: SEK 25,000–35,000/month minimum
- Validity: up to **2 years** (tied to employment contract duration), renewable
- After **4 years of work**, permanent residence (permanent uppehållstillstånd) can be applied for
- Application fee: SEK 2,000 (paid by employer)

**EU Blue Card**
EU-wide permit for highly skilled workers; updated under the 2023 EU Blue Card Directive.
- Target: high-skill roles with a salary of at least **SEK 52,000/month** (SEK 624,000/year; revised July 2025)
- Validity: up to 4 years; enables EU mobility

**Self-Employment Permit (Tillstånd för eget företag)**
For those establishing and running their own company in Sweden.
- Must submit a business plan and financial projections
- Must demonstrate the business is financially self-sufficient

**Job Seeker Permit (Residence Permit to Look for Work)**
Introduced in June 2022, this permit allows highly qualified individuals to enter Sweden specifically to seek employment. Sweden does not offer a dedicated digital nomad visa, but this is the closest equivalent for job seekers.
- Eligible: holders of a master's degree, PhD, or advanced vocational/professional degree
- Validity: up to **9 months** (no working allowed; job searching only)
- If you land a job: you can apply for a work permit **from within Sweden** — and may start working immediately after submitting the work permit application
- Must demonstrate financial self-sufficiency (approx. SEK 13,000–18,000/month)
- Apply via: Migrationsverket ｜ [Official page](https://www.migrationsverket.se/en/you-want-to-apply/work/look-for-work/look-for-work-or-start-a-business.html)

**Self-Employment Permit (Tillstånd för eget företag)**
For those running their own business — including freelancers and location-independent workers.
- A comprehensive business plan and financial projections are **mandatory**
- Financial requirement: **SEK 200,000** for yourself + SEK 100,000 per accompanying spouse + SEK 50,000 per child (covering 2 years of living costs)
- Prior business experience and industry track record significantly strengthen the application
- Validity: up to **2 years** (renewable)
- Apply via: Migrationsverket ｜ [Official page](https://www.migrationsverket.se/en/you-want-to-apply/work/employee-or-self-employed/self-employed-people.html)

**Researcher Visa (Forskarvisering)**
For researchers with a host agreement from a Swedish university or research institute. Work permit may not be required depending on funding structure.

### Expert Tax Scheme (Expertskatt)

A major tax incentive for foreign specialists recruited from abroad.
- Eligible: researchers, experts, and senior executives with a salary of at least **SEK 88,200/month** (2026 threshold; approx. SEK 1,058,400/year)
- **25% of income** is excluded from taxation, significantly lowering the effective rate
- Duration: up to **7 years** from arrival in Sweden
- Application body: Research Tax Board (Forskarskattenämnden)

### Swedish Income Tax (2026)

Sweden taxes income through two layers: local (kommunalskatt) + national (statlig inkomstskatt).

**Local Tax (Kommunalskatt): ~32% national average** (31–33% depending on municipality)

**National Tax (Statlig Inkomstskatt)**

| Annual Income | Additional Rate |
|--------------|----------------|
| Up to SEK 625,800 | 0% (local tax only) |
| Above SEK 625,800 | +20% on top of local tax |

*Combined effective rate reaches ~52% for incomes above SEK 625,800 (~€55,000/year).*

**Social Insurance (Arbetsgivaravgift)**
- Employer: **~31.42%** of gross salary
- Employee: none (employer pays all social insurance contributions)

### Cost Overview

| Item | Cost |
|------|------|
| Work permit fee | SEK 2,000 (employer pays) |
| Permanent residence fee | SEK 1,500 |
| Citizenship application | Free |
| Personnummer registration | Free |

### Rent in Stockholm's Expat-Friendly Neighbourhoods

| Area | 1BR | 2BR |
|------|-----|-----|
| Södermalm (trendy, popular with expats) | SEK 14,000–20,000 (€1,200–1,720) | SEK 20,000–28,000 (€1,720–2,410) |
| Östermalm (upscale) | SEK 18,000–28,000 (€1,550–2,410) | SEK 28,000–40,000 (€2,410–3,450) |
| Kungsholmen (central, quieter) | SEK 13,000–19,000 (€1,120–1,635) | SEK 19,000–26,000 (€1,635–2,240) |
| Gothenburg (Göteborg) | SEK 10,000–15,000 (€860–1,290) | SEK 15,000–22,000 (€1,290–1,895) |

### Monthly Living Costs (Stockholm)

- Groceries (home cooking): SEK 3,500–5,000 (€301–430)
- Monthly transit pass (SL): SEK 975 (€84)
- Utilities (electricity, heating, water): SEK 1,000–2,000 (€86–172)
- Healthcare: largely free after Personnummer registration; GP visits cost SEK 300–400 out of pocket

### Pre-Move Checklist

1. **Register for Personnummer**: Sweden's personal ID number — essential for employment, banking, healthcare, and taxes. Apply at Skatteverket after arrival
2. **Get BankID**: Sweden's digital ID — required for online banking, government services, and healthcare (only available once Personnummer is issued)
3. **Arrange housing before arrival**: Stockholm's public rental (hyresrätt) waitlist is 10+ years. Secure private rental through Bostadsförmedlingen or Hemnet before arriving
4. **Apply for Expertskatt within 3 months**: The expert tax scheme must be applied for **within 3 months of arrival** — no exceptions
5. **Track your 4-year clock**: Apply for permanent residence as soon as you complete 4 years of lawful work
6. **Language**: English is widely spoken — but for long-term residency, consider SFI (free Swedish language courses)

Sweden's high taxes are offset by outstanding social services. Use MoveWorth to simulate your after-tax income and quality of life before making the move.

---

### References

This article is based on the following official sources.

- **Work Permit (Arbetstillstånd)**: [Migrationsverket – Apply for a Work Permit](https://www.migrationsverket.se/en/you-want-to-apply/work/employee-or-self-employed/employees.html)
- **Job Seeker Permit**: [Migrationsverket – Look for Work or Start a Business](https://www.migrationsverket.se/en/you-want-to-apply/work/look-for-work/look-for-work-or-start-a-business.html)
- **Self-Employment Permit**: [Migrationsverket – Run Your Own Business](https://www.migrationsverket.se/en/you-want-to-apply/work/employee-or-self-employed/self-employed-people.html)
- **Tax Registration**: [Swedish Tax Agency (Skatteverket) – Moving to Sweden](https://www.skatteverket.se/movingtosweden)`,
      zh: `瑞典以高水准的社会保障、医疗和教育体系著称，尽管所得税是欧洲最高之列，但始终位居全球最幸福、最宜居国家前列，也是宜家、Spotify、爱立信等全球知名企业的故乡。

### 主要就业许可类型

**工作许可（Arbetstillstånd）**
非欧盟/欧洲经济区公民在瑞典工作的必要许可。
- 由雇主通过瑞典移民局（Migrationsverket）主导申请
- 申请前须签订劳动合同
- 薪资须满足所在岗位工会协议（kollektivavtal）标准
  ※技术类职位参考：月薪SEK 25,000〜35,000以上
- 有效期：最长**2年**（与雇佣合同期挂钩），可续签
- 工作满**4年**后可申请永久居留权
- 申请费：SEK 2,000（由雇主支付）

**EU蓝卡**
适用于高技能专业人士，按2023年欧盟蓝卡指令更新要求。
- 月薪须达到**SEK 52,000以上**（年薪SEK 624,000以上，2025年7月修订）
- 有效期：最长4年，便于欧盟内部流动

**求职居留许可（寻找工作居留许可）**
2022年6月推出，允许高学历人才赴瑞典实地求职。瑞典目前无专属数字游民签证，此为最接近的替代选项。
- 适用对象：拥有硕士学位、博士学位或高级职业/专业资格证书者
- 有效期：最长**9个月**（仅限求职，不可工作）
- 获得雇用后：可在瑞典境内申请工作许可，**提交申请后即可开始工作**（无需等待批准）
- 须证明具备经济自立能力（约每月SEK 13,000〜18,000）
- 申请机构：Migrationsverket ｜ [官方页面](https://www.migrationsverket.se/en/you-want-to-apply/work/look-for-work/look-for-work-or-start-a-business.html)

**自雇许可（Tillstånd för eget företag）**
适用于在瑞典经营自己业务的人士，包括自由职业者和位置独立工作者（数字游民）。
- 须提交详细的**商业计划书及财务预测**
- 财务要求：本人**SEK 200,000**＋配偶SEK 100,000＋每位子女SEK 50,000（覆盖2年生活费）
- 具备业务经验和行业履历者申请成功率更高
- 有效期：最长**2年**（可续签）
- 申请机构：Migrationsverket ｜ [官方页面](https://www.migrationsverket.se/en/you-want-to-apply/work/employee-or-self-employed/self-employed-people.html)

**研究人员签证（Forskarvisering）**
适用于与瑞典大学或研究机构签有接收协议的研究人员，视资金结构可能无需工作许可。

### 专家税收优惠（Expertskatt）

针对从海外引进的高技能人才的重要税收激励政策。
- 适用对象：月薪达**SEK 88,200以上**（2026年标准，约年薪SEK 1,058,400）的研究人员、专家或高管
- **25%的收入免于征税**，大幅降低实际税率
- 适用期：自抵达瑞典起最长**7年**
- 申请机构：研究税务委员会（Forskarskattenämnden）

### 瑞典所得税制（2026年）

瑞典所得税由地方税（kommunalskatt）和国家税（statlig inkomstskatt）两层构成。

**地方税（Kommunalskatt）：全国平均约32%**（各市区约31〜33%）

**国家税（Statlig Inkomstskatt）**

| 年收入 | 附加税率 |
|------|--------|
| SEK 625,800以内 | 0%（仅缴地方税） |
| SEK 625,800以上 | 在地方税基础上加收20% |

*年收入超过SEK 625,800（约€55,000）后，综合税率约达52%。*

**社会保险费（Arbetsgivaravgift）**
- 雇主负担：工资的约**31.42%**
- 雇员负担：无（由雇主全额缴纳）

### 费用参考

| 项目 | 费用 |
|------|------|
| 工作许可申请费 | SEK 2,000（雇主支付） |
| 永久居留申请费 | SEK 1,500 |
| 入籍申请 | 免费 |
| 个人号码（Personnummer）注册 | 免费 |

### 斯德哥尔摩外籍人士聚居区租金

| 区域 | 1居室 | 2居室 |
|------|------|------|
| 瑟德马尔姆区（Södermalm，时尚外籍人士聚居） | SEK 14,000〜20,000（€1,200〜1,720） | SEK 20,000〜28,000（€1,720〜2,410） |
| 东斯德哥尔摩区（Östermalm，高档住宅） | SEK 18,000〜28,000（€1,550〜2,410） | SEK 28,000〜40,000（€2,410〜3,450） |
| 孔斯霍尔门区（Kungsholmen） | SEK 13,000〜19,000（€1,120〜1,635） | SEK 19,000〜26,000（€1,635〜2,240） |
| 哥德堡（Göteborg） | SEK 10,000〜15,000（€860〜1,290） | SEK 15,000〜22,000（€1,290〜1,895） |

### 月生活费参考（斯德哥尔摩）

- 伙食费（自炊）：SEK 3,500〜5,000（€301〜430）
- 交通月票（SL）：SEK 975（€84）
- 水电暖气费：SEK 1,000〜2,000（€86〜172）
- 医疗：获得Personnummer后基本免费；GP就诊通常自付SEK 300〜400

### 移居前注意事项

1. **申请Personnummer**：瑞典居民身份号码，就业、开户、医疗、纳税均必需。抵达后向税务局（Skatteverket）申请
2. **申请BankID**：瑞典电子身份认证，网上银行、政府服务、医疗必备（需先获得Personnummer）
3. **提前落实住房**：斯德哥尔摩公共租赁（hyresrätt）等待名单长达10年以上，须在到达前通过Bostadsförmedlingen或Hemnet找好私人租房
4. **3个月内申请专家税**：Expertskatt须在**抵达后3个月内**提交申请，逾期无效
5. **4年后申请永久居留**：满足4年合法工作要求后及时申请
6. **语言**：工作和日常生活英语基本够用，但长期定居建议参加SFI免费瑞典语课程

瑞典高税率背后是完善的社会保障体系。使用MoveWorth提前模拟税后收入与生活水平，从容规划移居计划。

---

### 参考资料

本文信息基于以下官方资料整理。

- **工作许可（Arbetstillstånd）**: [Migrationsverket – 申请工作许可](https://www.migrationsverket.se/en/you-want-to-apply/work/employee-or-self-employed/employees.html)
- **求职居留许可**: [Migrationsverket – 寻找工作或创业居留许可](https://www.migrationsverket.se/en/you-want-to-apply/work/look-for-work/look-for-work-or-start-a-business.html)
- **自雇许可**: [Migrationsverket – 经营自己业务居留许可](https://www.migrationsverket.se/en/you-want-to-apply/work/employee-or-self-employed/self-employed-people.html)
- **税务注册**: [瑞典税务局（Skatteverket）– 移居瑞典指南](https://www.skatteverket.se/movingtosweden)`,
    },
  },
  {
    slug: "visa-no",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-no.webp",
    title: {
      ja: "【2026年最新版】ノルウェーのビザ・就労許可完全ガイド",
      en: "Norway Visa & Work Permit Complete Guide 2026",
      zh: "【2026年最新版】挪威签证与就业许可完全指南",
    },
    description: {
      ja: "熟練労働者許可・所得税・オスロ家賃まで、ノルウェー移住に必要なビザの種類・要件・費用を2026年最新データで徹底解説。",
      en: "Skilled worker permits, income tax, and Oslo rent — a complete 2026 guide to working and living in Norway.",
      zh: "技能工人许可、所得税率、奥斯陆租金——2026年最新移居挪威完全指南。",
    },
    content: {
      ja: `ノルウェーは世界最高水準の生活の質・高い賃金・充実した社会保障を誇る北欧の国です。世界最大規模の政府系ファンド（政府年金基金グローバル／Oljefondet）を背景とした豊かな経済が特徴で、生活コストは高いものの、その分給与水準も非常に高いです。

### 主な就労ビザ・許可の種類

**EU/EEAおよびスイス市民**
ビザ・就労許可なしに就労可能です。
- 3ヶ月以内：登録不要
- 3ヶ月超：UDI（移民局）への登録が必要（登録費：無料）

**熟練労働者許可（Skilled Worker Permit / dyktig arbeidstaker）** ｜ [UDI 公式ページ](https://www.udi.no/en/want-to-apply/work-immigration/skilled-workers/)
EU/EEA圏外の方がノルウェーで就労するための主要な許可。
- 要件：当該職種における専門的な技能・資格の証明（学歴または3年以上の職業訓練）
- 雇用オファーが必要（申請前に雇用契約が確定していること）
- 最低賃金：当該業種のノルウェー全国標準賃金以上
  ※目安：ITエンジニア NOK 550,000〜700,000/年（約€48,000〜61,000）
- 有効期間：最大**3年**（雇用期間に連動）、更新可能
- **3年の合法滞在後**に永住権申請が可能（就労許可での滞在年数が算入）
- 申請費：NOK 6,300（約€550）

**自営業許可（Selvstendig næringsdrivende）** ｜ [UDI 公式ページ](https://www.udi.no/en/want-to-apply/work-immigration/skilled-workers/)
ノルウェーで独立した事業活動を行う方向けの許可。フリーランス・ノマド層も対象。
- 熟練労働者許可の枠組み内で申請（「自分でビジネスを持つ熟練労働者」として扱われる）
- 事業計画書・財政的自立性の証明が必要
- ノルウェー国内での事業立ち上げ・運営が条件
- 初年度の審査は特に厳格。収入源・クライアント契約の証明が求められる

**就職活動許可（Job Seeker Permit）** ｜ [UDI 公式ページ](https://www.udi.no/en/want-to-apply/work-immigration/job-seekers/)
高度技能職の就職活動を目的として最長**6ヶ月**滞在できる許可。
- 対象：大学学位または職業訓練資格を持つ専門職（EU/EEA外も対象）
- 滞在中は就職活動のみ可能（就労不可）
- 就職が決まった場合、国内から熟練労働者許可への切り替えが可能

### 永住権・市民権

**永住権（Permanent oppholdstillatelse）**
- 要件：**3年以上**の合法滞在 + ノルウェー語テスト合格（Norskprøve A2〜B1レベル）または300時間の語学研修修了
- 財政的自立の証明（生活保護等の受給がないこと）
- 申請費：NOK 5,900

**市民権（Statsborgerskap）**
- 要件：**7年以上**のノルウェー合法滞在（過去10年間で）+ ノルウェー語能力証明（A2以上）
- 原則として二重国籍は認められないが、一部例外あり（母国が離脱を認めない場合等）

### ノルウェーの所得税（2026年）

**住民税（Trinnskatt + kommuneskatt）**

| 課税所得（年収） | 税率 |
|-------------|-----|
| NOK 208,051〜292,850 | 1.7% |
| NOK 292,851〜670,000 | 4.0% |
| NOK 670,001〜937,900 | 13.6% |
| NOK 937,901〜1,350,000 | 16.6% |
| NOK 1,350,001超 | 17.6% |

**一般住民税（Alminnelig inntektsskatt）：22%**（フラットレート、上記の段階課税に加算）

→ 例：年収NOK 700,000（約€61,000）の場合、実効税率約33〜34%

**社会保険料（Trygdeavgift）**
- 給与所得：**7.9%**
- 自営業所得：**11.1%**
- 雇用主負担（Arbeidsgiveravgift）：**14.1%**（地域によって0〜14.1%）

### 費用の目安

| 項目 | 費用 |
|------|------|
| 熟練労働者許可申請費 | NOK 6,300（約€550） |
| 永住権申請費 | NOK 5,900（約€515） |
| 市民権申請費 | 無料 |

### オスロの家賃相場（外国人居住エリア）

| エリア | 1LDK | 2LDK |
|-------|------|------|
| グリュネルロッカ（Grünerløkka・人気エリア） | NOK 16,000〜22,000（€1,395〜1,920） | NOK 22,000〜30,000（€1,920〜2,615） |
| フロネル（Frogner・高級住宅街） | NOK 20,000〜30,000（€1,745〜2,615） | NOK 30,000〜42,000（€2,615〜3,660） |
| マヨルストゥア（Majorstuen） | NOK 17,000〜24,000（€1,482〜2,092） | NOK 24,000〜33,000（€2,092〜2,876） |
| オスロ郊外（Bærum・Asker） | NOK 14,000〜20,000（€1,220〜1,745） | NOK 20,000〜28,000（€1,745〜2,440） |

### 月々の生活費目安（オスロ）

- 食費（自炊）：NOK 4,000〜6,000（€349〜523）
- 外食（レストラン）：1食NOK 180〜350
- 交通費（Ruter月定期）：NOK 820（€71）
- 光熱費（電気・暖房・水道）：NOK 1,500〜3,000（€131〜262）

**合計目安：月NOK 20,000〜35,000（約€1,745〜3,050）**

### 移住前のチェックポイント

1. **D番号（D-nummer）取得**：ノルウェーの税務番号。雇用主を通じて到着後すぐに申請。銀行口座開設・納税に必要
2. **国民識別番号（Fødselsnummer）**：正式な居住登録後（通常3ヶ月以上）に発行される本番の番号。D番号との違いに注意
3. **銀行口座開設**：DNB・Nordea等の大手行が対応。D番号で開設可能（一部行はFødselsnummer要求）
4. **住宅**：オスロの家賃は欧州トップクラス。事前のFinn.no・Hybel.no等でのリサーチ必須
5. **ノルウェー語学習**：就労は英語でほぼ問題なし。ただし永住権・市民権取得にはノルウェー語試験（Norskprøve）が必要
6. **年金登録（Folkeregistrering）**：3ヶ月以上滞在する場合は人口登録（Folkeregistrering）への登録が義務

ノルウェーは世界有数の高給与国ですが、その分生活コストも高額です。MoveWorthでシミュレーションして、移住後の資産形成計画を立ててみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **熟練労働者許可・自営業許可**: [UDI – 熟練労働者許可申請（自営業含む）](https://www.udi.no/en/want-to-apply/work-immigration/skilled-workers/)
- **就職活動許可（Job Seeker）**: [UDI – 求職者向け在留許可](https://www.udi.no/en/want-to-apply/work-immigration/job-seekers/)
- **税務登録・番号取得**: [Altinn – ノルウェー電子行政サービス（税務含む）](https://www.altinn.no/en/)`,
      en: `Norway offers one of the world's highest standards of living, excellent wages, and a comprehensive social security system. Backed by the world's largest sovereign wealth fund (the Government Pension Fund Global / Oljefondet), Norway has a very strong economy — though the cost of living matches its high salaries.

### Main Work Visa / Permit Types

**EU/EEA and Swiss Citizens**
Can work in Norway without a visa or work permit.
- Stays under 3 months: no registration required
- Stays over 3 months: must register with UDI (Norwegian Immigration Directorate) — free of charge

**Skilled Worker Permit (Dyktig arbeidstaker)** ｜ [UDI Official Page](https://www.udi.no/en/want-to-apply/work-immigration/skilled-workers/)
The primary route for non-EU/EEA nationals to work in Norway.
- Requirements: qualifications or trade certificate for the relevant role (degree or 3+ years of vocational training)
- A job offer (signed contract) is required before applying
- Minimum wage: must meet Norway's sector-specific standard wage
  — IT engineers typically earn NOK 550,000–700,000/year (€48,000–61,000)
- Validity: up to **3 years** (tied to employment contract), renewable
- After **3 years of lawful residence**, permanent residency can be applied for
- Application fee: NOK 6,300 (~€550)

**Self-Employment Permit (Selvstendig næringsdrivende)** ｜ [UDI Official Page](https://www.udi.no/en/want-to-apply/work-immigration/skilled-workers/)
For freelancers, consultants, and location-independent workers running their own business in Norway.
- Processed under the Skilled Worker Permit framework ("skilled worker with own business")
- Must submit a business plan and demonstrate financial self-sufficiency
- Business must be established and operated within Norway
- First-year assessment is particularly strict — proof of income sources and client contracts is essential

**Job Seeker Permit** ｜ [UDI Official Page](https://www.udi.no/en/want-to-apply/work-immigration/job-seekers/)
Allows qualified professionals to stay up to **6 months** in Norway specifically to look for work.
- Eligible: degree holders or those with vocational training (including non-EU/EEA nationals)
- No working permitted during the stay — job searching only
- If a job is found, you can switch to a Skilled Worker Permit from within Norway

### Permanent Residency & Citizenship

**Permanent Residency (Permanent oppholdstillatelse)**
- Requirements: **3+ years** of lawful residence + passing Norwegian language test (Norskprøve A2–B1) or 300-hour language course
- Must demonstrate financial independence (no reliance on social welfare)
- Application fee: NOK 5,900

**Citizenship (Statsborgerskap)**
- Requirements: **7+ years** of lawful Norwegian residence (within 10 years) + Norwegian language proficiency (A2+)
- Dual nationality generally not permitted, with some exceptions

### Norwegian Income Tax (2026)

**Progressive Step Tax (Trinnskatt) + Flat Base Tax (22% Alminnelig Inntektsskatt)**

| Annual Income | Step Tax Rate |
|--------------|-------------|
| NOK 208,051–292,850 | 1.7% |
| NOK 292,851–670,000 | 4.0% |
| NOK 670,001–937,900 | 13.6% |
| NOK 937,901–1,350,000 | 16.6% |
| Above NOK 1,350,001 | 17.6% |

*The 22% flat "ordinary income" tax (alminnelig inntektsskatt) applies to all taxable income on top of these step rates.*

→ Example: Annual income NOK 700,000 (~€61,000) → effective total rate approx. 33–34%

**Social Insurance (Trygdeavgift)**
- Employment income: **7.9%** (employee contribution)
- Self-employment income: **11.1%**
- Employer payroll tax (Arbeidsgiveravgift): **14.1%** (0–14.1% depending on region)

### Cost Overview

| Item | Cost |
|------|------|
| Skilled worker permit fee | NOK 6,300 (~€550) |
| Permanent residency fee | NOK 5,900 (~€515) |
| Citizenship application | Free |

### Rent in Oslo's Expat-Friendly Neighbourhoods

| Area | 1BR | 2BR |
|------|-----|-----|
| Grünerløkka (trendy, popular with expats) | NOK 16,000–22,000 (€1,395–1,920) | NOK 22,000–30,000 (€1,920–2,615) |
| Frogner (upscale) | NOK 20,000–30,000 (€1,745–2,615) | NOK 30,000–42,000 (€2,615–3,660) |
| Majorstuen | NOK 17,000–24,000 (€1,482–2,092) | NOK 24,000–33,000 (€2,092–2,876) |
| Outer Oslo (Bærum, Asker) | NOK 14,000–20,000 (€1,220–1,745) | NOK 20,000–28,000 (€1,745–2,440) |

### Monthly Living Costs (Oslo)

- Groceries (home cooking): NOK 4,000–6,000 (€349–523)
- Restaurant meal: NOK 180–350 per person
- Monthly transit pass (Ruter): NOK 820 (€71)
- Utilities (electricity, heating, water): NOK 1,500–3,000 (€131–262)

**Total estimate: NOK 20,000–35,000/month (~€1,745–3,050)**

### Pre-Move Checklist

1. **Get a D-Number (D-nummer)**: Norway's tax identification number — apply through your employer on arrival. Required for banking and taxes
2. **Register for Fødselsnummer**: Issued after formal population registration (usually after 3+ months). Note the difference from D-nummer
3. **Open a bank account**: DNB and Nordea are the major banks; D-nummer is usually sufficient for opening
4. **Housing**: Oslo rents are among Europe's highest. Research on Finn.no and Hybel.no well before arrival
5. **Norwegian language**: English is fine for work. But Norskprøve (Norwegian language test) is required for permanent residency and citizenship
6. **Population registration (Folkeregistrering)**: Mandatory for stays over 3 months

Norway offers exceptional salaries, but the cost of living is equally high. Use MoveWorth to simulate your finances and plan for wealth-building after your move.

---

### References

This article is based on the following official sources.

- **Skilled Worker & Self-Employment Permit**: [UDI – Apply as a Skilled Worker (incl. own business)](https://www.udi.no/en/want-to-apply/work-immigration/skilled-workers/)
- **Job Seeker Permit**: [UDI – Residence Permit for Job Seekers](https://www.udi.no/en/want-to-apply/work-immigration/job-seekers/)
- **Tax Registration**: [Altinn – Norwegian Digital Government Services (including tax)](https://www.altinn.no/en/)`,
      zh: `挪威以世界顶级的生活水准、高薪资和完善的社会保障体系著称，凭借全球最大主权财富基金（政府养老基金全球/Oljefondet）的支撑，经济实力雄厚。生活成本虽高，但薪资水平同样非常高。

### 主要就业许可类型

**欧盟/欧洲经济区及瑞士公民**
无需签证或工作许可即可在挪威工作。
- 3个月以内：无需登记
- 3个月以上：须向移民局（UDI）登记（免费）

**技能工人许可（Dyktig arbeidstaker）** ｜ [UDI 官方页面](https://www.udi.no/en/want-to-apply/work-immigration/skilled-workers/)
非欧盟/欧洲经济区公民在挪威工作的主要途径。
- 要求：具备相关领域的专业资质（学历或3年以上职业培训证书）
- 申请前须持有工作邀约（已签劳动合同）
- 薪资须满足挪威各行业标准工资水平
  ※参考：IT工程师年薪NOK 550,000〜700,000（约€48,000〜61,000）
- 有效期：最长**3年**（与雇佣合同挂钩），可续签
- 合法居留满**3年**后可申请永久居留权
- 申请费：NOK 6,300（约€550）

**自雇许可（Selvstendig næringsdrivende）** ｜ [UDI 官方页面](https://www.udi.no/en/want-to-apply/work-immigration/skilled-workers/)
适用于在挪威独立经营业务的人士，包括自由职业者和数字游民。
- 在技能工人许可框架内申请（视为"拥有自营业务的技能工人"）
- 须提交商业计划书并证明财务可持续性
- 须在挪威境内创立并经营业务
- 首年审查尤为严格，需提供收入来源及客户合同证明

**求职许可（Job Seeker Permit）** ｜ [UDI 官方页面](https://www.udi.no/en/want-to-apply/work-immigration/job-seekers/)
允许符合条件的专业人士在挪威停留最长**6个月**以寻找工作机会。
- 适用对象：持有学位或职业资质证书的专业人士（含非欧盟/欧洲经济区公民）
- 居留期间仅限求职，不可从事工作
- 获得工作邀约后，可在挪威境内转换为技能工人许可

### 永久居留权与入籍

**永久居留权（Permanent oppholdstillatelse）**
- 要求：合法居留**3年以上** + 通过挪威语考试（Norskprøve A2〜B1级）或完成300小时语言课程
- 须证明经济独立（未依赖社会福利）
- 申请费：NOK 5,900

**入籍（Statsborgerskap）**
- 要求：10年内合法居留挪威**7年以上** + 证明挪威语能力（A2以上）
- 原则上不允许双重国籍（部分情况例外）

### 挪威所得税（2026年）

**累进阶梯税（Trinnskatt）+ 统一普通所得税（22%）**

| 年收入 | 阶梯税率 |
|------|--------|
| NOK 208,051〜292,850 | 1.7% |
| NOK 292,851〜670,000 | 4.0% |
| NOK 670,001〜937,900 | 13.6% |
| NOK 937,901〜1,350,000 | 16.6% |
| NOK 1,350,001以上 | 17.6% |

*此外，所有应税收入还须缴纳22%的普通所得税（alminnelig inntektsskatt），与阶梯税叠加征收。*

→ 示例：年收入NOK 700,000（约€61,000）→实际综合税率约33〜34%

**社会保险费（Trygdeavgift）**
- 雇员（工资收入）：**7.9%**
- 自雇收入：**11.1%**
- 雇主税（Arbeidsgiveravgift）：**14.1%**（按地区不同为0〜14.1%）

### 费用参考

| 项目 | 费用 |
|------|------|
| 技能工人许可申请费 | NOK 6,300（约€550） |
| 永久居留申请费 | NOK 5,900（约€515） |
| 入籍申请 | 免费 |

### 奥斯陆外籍人士聚居区租金

| 区域 | 1居室 | 2居室 |
|------|------|------|
| 格吕内尔洛卡区（Grünerløkka，外籍人士聚居） | NOK 16,000〜22,000（€1,395〜1,920） | NOK 22,000〜30,000（€1,920〜2,615） |
| 弗罗格讷区（Frogner，高档住宅） | NOK 20,000〜30,000（€1,745〜2,615） | NOK 30,000〜42,000（€2,615〜3,660） |
| 马约尔斯图阿区（Majorstuen） | NOK 17,000〜24,000（€1,482〜2,092） | NOK 24,000〜33,000（€2,092〜2,876） |
| 奥斯陆郊区（Bærum、Asker） | NOK 14,000〜20,000（€1,220〜1,745） | NOK 20,000〜28,000（€1,745〜2,440） |

### 月生活费参考（奥斯陆）

- 伙食费（自炊）：NOK 4,000〜6,000（€349〜523）
- 外出就餐：每餐NOK 180〜350
- 交通月票（Ruter）：NOK 820（€71）
- 水电暖气费：NOK 1,500〜3,000（€131〜262）

**月生活费合计：约NOK 20,000〜35,000（€1,745〜3,050）**

### 移居前注意事项

1. **申请D号码（D-nummer）**：挪威税务识别号，通过雇主在抵达后申请，开户和纳税必需
2. **注册国民识别号（Fødselsnummer）**：正式居民登记后发放，注意与D号码的区别
3. **开设银行账户**：DNB和北欧银行（Nordea）为主要选择，D号码通常已可开户
4. **提前寻房**：奥斯陆房租是欧洲最贵之列，建议在Finn.no和Hybel.no提前搜索
5. **挪威语学习**：工作英语基本够用，但永久居留和入籍需通过Norskprøve挪威语考试
6. **人口登记（Folkeregistrering）**：居留超过3个月为强制要求

挪威薪资全球领先，生活成本同样不菲。使用MoveWorth模拟财务状况，制定移居后的资产积累计划。

---

### 参考资料

本文信息基于以下官方资料整理。

- **技能工人许可・自雇许可**: [UDI – 申请技能工人许可（含自营业务）](https://www.udi.no/en/want-to-apply/work-immigration/skilled-workers/)
- **求职许可（Job Seeker）**: [UDI – 求职居留许可](https://www.udi.no/en/want-to-apply/work-immigration/job-seekers/)
- **税务注册**: [Altinn – 挪威电子政务服务（含税务）](https://www.altinn.no/en/)`,
    },
  },
  {
    slug: "visa-dk",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-dk.webp",
    title: {
      ja: "【2026年最新版】デンマークのビザ・就労許可完全ガイド",
      en: "Denmark Visa & Work Permit Complete Guide 2026",
      zh: "【2026年最新版】丹麦签证与就业许可完全指南",
    },
    description: {
      ja: "ファストトラック・給与上限制度・研究者27%税率・コペンハーゲン家賃まで、デンマーク移住を2026年最新データで徹底解説。",
      en: "Fast Track, Pay Limit Scheme, 27% researcher tax rate, and Copenhagen rent — a complete 2026 guide to Denmark.",
      zh: "快速通道、薪资上限制度、27%研究者税率、哥本哈根租金——2026年最新移居丹麦完全指南。",
    },
    content: {
      ja: `デンマークは「世界一幸福な国」として長年知られ、高い生活水準・優れた福祉制度・先進的なビジネス環境を提供しています。北欧諸国の中でも特に税率が高いですが、教育・医療・育児支援の充実が魅力です。

### 主な就労ビザ・許可の種類

**EU/EEAおよびノルディック市民**
自由に就労可能（就労許可不要）。3ヶ月超の滞在は登録証明書（registreringsbevis）の取得が必要。

**ファストトラック制度（Fast Track Scheme）**
Businessdanmark（デンマーク企業認定機関）に認定された企業に採用された外国人向けの高速審査制度。
- 審査期間：最短**1ヶ月**（通常の就労許可は2〜3ヶ月）
- 給与上限制度またはポジティブリストとの組み合わせで利用
- 申請受理後に就労開始可能（許可証を待たずに勤務可能なケースあり）

**給与上限制度（Pay Limit Scheme / Beløbsordningen）**
高給与の専門職向けの就労許可制度。
- 最低年収：**DKK 552,000以上**（2026年現在。月換算DKK 46,000）
- 有効期間：最大**4年**（更新可能）
- 職種・学歴の要件なし（給与要件のみ）
- 申請費：DKK 4,165

**ポジティブリスト制度（Positive List）** ｜ [Nyidanmark 公式ページ](https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/The-Positive-Lists)
デンマークが人材不足と認定した職種向けの就労許可。**デンマークの就労ビザで最も重要なルート。**
- 対象職種例：ITエンジニア・ソフトウェア開発者・医師・看護師・建築家・電気工学者等（年2回更新）
- 対応する学歴・職業経験の証明が必要
- 給与は当該業種の標準以上であること
- 申請費：DKK 4,165
- ファストトラック企業と組み合わせると最短1ヶ月で許可取得可能

**給与上限制度（Pay Limit Scheme / Beløbsordningen）** ｜ [Nyidanmark 公式ページ](https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Pay-limit-scheme)
高給与の専門職向けの就労許可制度。
- 最低年収：**DKK 552,000以上**（2026年現在。月換算DKK 46,000）
- 有効期間：最大**4年**（更新可能）
- 職種・学歴の要件なし（給与要件のみ）
- 申請費：DKK 4,165

**求職者許可（Job Seeking Permit）** ｜ [Nyidanmark 公式ページ](https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Jobseeking-permit)
就労許可保有者が失業した場合などに、最長**6ヶ月**デンマーク国内で新しい仕事を探せる許可。
- 対象：給与上限制度・ポジティブリスト・研究者許可・ファストトラックの保有者が失業した場合
- 就労不可（求職活動のみ）。新しい雇用主が決まれば就労許可に切り替え可能

**スタートアップビザ（Start-up Denmark）** ｜ [Nyidanmark 公式ページ](https://www.nyidanmark.dk/en-us/coming_to_dk/work/Start-up-denmark/)
革新的な成長企業を設立・運営したい外国人起業家向け。
- ビジネスアイデアをデンマーク商業庁が任命する専門家パネルが審査・承認
- 初年度の生活費を賄える財政証明が必要（家族同伴の場合は追加証明が必要）
- 有効期間：**2年**（事業継続中であれば更新可能）

**EUブルーカード**
EU域内高度技能者向け就労許可。年収DKK 528,000以上が目安（2026年基準）。

### 研究者・高度技能者向け優遇税制（Forskerordningen）

海外から採用された研究者・高度技能者向けの特別27%税制。
- 対象：国外から招聘された研究者・高度技能者（デンマークに過去10年中3年以上税務居住していないこと）
- 月収要件：**DKK 73,500/月以上**（2026年時点。年収DKK 882,000以上）
- 適用税率：所得の**27%**（通常の最高税率52.07%から大幅軽減）
- 適用期間：デンマーク就労開始後最長**7年間**
- 申請：雇用主が代理で申請

### デンマークの所得税（2026年）

デンマークは世界で最も複雑な課税構造のひとつを持ちます（国税＋地方税＋労働市場拠出金の3層構造）。

**主要税率**

| 税目 | 税率 |
|-----|-----|
| 国家所得税（底部税率） | 12.01% |
| 国家所得税（頂部税率） | +15%（課税所得DKK 588,900超分に加算） |
| 地方税（kommuneskat、全国平均） | 約25.0% |
| 労働市場拠出金（AM-bidrag） | 8.0%（課税前総収入に対して） |

→ 実効税率：DKK 588,900（約€79,000）超の所得で最大**52.07%**に達する構造。

**社会保険・労働市場拠出**
- AM-bidrag（労働市場拠出金）：**8%**（雇用者自身が申告・納付）
- 老齢年金・ATP：被用者月額約DKK 99（雇用主が別途DKK 297負担）

### 費用の目安

| 項目 | 費用 |
|------|------|
| 給与上限制度申請費 | DKK 4,165（約€559） |
| ポジティブリスト申請費 | DKK 4,165（約€559） |
| 居留許可証（biometrics） | DKK 1,405（約€188） |
| 配偶者の就労許可申請費 | DKK 4,165（約€559） |

### コペンハーゲンの家賃相場（外国人居住エリア）

| エリア | 1LDK | 2LDK |
|-------|------|------|
| フレデリクスベア（Frederiksberg・人気外国人エリア） | DKK 14,000〜20,000（€1,880〜2,685） | DKK 20,000〜28,000（€2,685〜3,760） |
| ネアブロ（Nørrebro・若者・多国籍） | DKK 11,000〜17,000（€1,477〜2,283） | DKK 17,000〜24,000（€2,283〜3,224） |
| ヴェストブロ（Vesterbro） | DKK 12,000〜18,000（€1,612〜2,417） | DKK 18,000〜26,000（€2,417〜3,492） |
| オーステルブロ（Østerbro・高級） | DKK 15,000〜22,000（€2,014〜2,954） | DKK 22,000〜32,000（€2,954〜4,297） |

### 月々の生活費目安（コペンハーゲン）

- 食費（自炊）：DKK 3,500〜5,000（€470〜672）
- 外食（レストラン）：1食DKK 150〜300
- 交通費（月定期）：DKK 460〜520（€62〜70）
- 光熱費（電気・暖房・水道）：DKK 1,200〜2,500（€161〜336）

### 移住前のチェックポイント

1. **CPR番号（中央個人登録番号）取得**：デンマークの住民番号。銀行・医療・行政手続きすべてに必須。市区町村（Borgerservice）で申請
2. **MitID（デジタル署名）**：行政・金融のオンラインサービスに必要（CPR取得後に申請可能）
3. **Nemkonto（指定銀行口座）**：デンマーク当局から給付・還付を受けるための指定口座。CPR番号取得後に設定
4. **住宅探し**：コペンハーゲンの住宅需要は非常に高い。Boliga・Lejeboligなどで事前リサーチを
5. **Forskerordningen申請期限**：就労開始後**3ヶ月以内**に雇用主が代理申請が必要
6. **デンマーク語**：就労・生活は英語でほぼ問題なし。長期定住には語学学習推奨（無料語学コースあり）

デンマークは高い税率ながらも、生活の質・仕事と生活のバランス・社会保障の面で世界トップクラスの国です。MoveWorthで資産推移をシミュレーションして、移住後の生活設計を立ててみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ポジティブリスト（就労ビザ・最重要）**: [Nyidanmark – Positive List](https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/The-Positive-Lists)
- **給与上限制度（Pay Limit）**: [Nyidanmark – Pay Limit Scheme](https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Pay-limit-scheme)
- **求職者許可（Job Seeker）**: [Nyidanmark – Job Seeking Permit](https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Jobseeking-permit)
- **スタートアップビザ**: [Nyidanmark – Start-up Denmark](https://www.nyidanmark.dk/en-us/coming_to_dk/work/Start-up-denmark/)
- **税務登録・番号取得**: [SKAT – デンマーク税務庁（個人税務情報）](https://skat.dk/en-us/individuals)`,
      en: `Denmark is consistently ranked among the world's happiest countries, offering a high quality of life, excellent welfare, and an innovative business environment. While taxes are among the world's highest, the social services — free healthcare, education, and generous parental leave — are equally outstanding.

### Main Work Visa / Permit Types

**EU/EEA and Nordic Citizens**
Full right to work — no work permit required. For stays over 3 months, a registration certificate (registreringsbevis) is required.

**Fast Track Scheme**
An accelerated processing scheme for foreign nationals hired by Businessdanmark-certified companies.
- Processing time: as little as **1 month** (vs. 2–3 months for standard applications)
- Combined with Pay Limit or Positive List
- Can start work upon receipt of the application in some cases

**Positive List** ｜ [Nyidanmark Official Page](https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/The-Positive-Lists)
The most important work permit route in Denmark — for shortage occupations officially designated by the government. Updated twice a year (1 January and 1 July).
- Examples: software developers, IT engineers, doctors, nurses, architects, electrical engineers
- Requires proof of relevant qualifications and experience
- Salary must be at or above sector standard
- Application fee: DKK 4,165
- When combined with a Fast Track certified employer: permit issued in as little as 1 month

**Pay Limit Scheme (Beløbsordningen)** ｜ [Nyidanmark Official Page](https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Pay-limit-scheme)
For high-earning professionals — no occupational or educational requirements.
- Minimum annual salary: **DKK 552,000+** (2026; ~DKK 46,000/month)
- Validity: up to **4 years** (renewable)
- Application fee: DKK 4,165

**Job Seeking Permit** ｜ [Nyidanmark Official Page](https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Jobseeking-permit)
Allows permit holders who lose their job to remain in Denmark for up to **6 months** while searching for a new position.
- Available to holders of: Pay Limit, Positive List, Researcher, or Fast Track permits who become unemployed
- No working allowed — job searching only. Switch to a new work permit once employment is secured

**Start-up Denmark** ｜ [Nyidanmark Official Page](https://www.nyidanmark.dk/en-us/coming_to_dk/work/Start-up-denmark/)
For foreign entrepreneurs establishing innovative, high-growth businesses in Denmark.
- Business idea must be approved by a panel of experts appointed by the Danish Business Authority
- Must demonstrate sufficient funds to cover the first year (including dependants if applicable)
- Validity: **2 years** (renewable as long as the business is active)

**EU Blue Card**
For highly skilled workers earning approximately DKK 528,000+/year (2026 threshold).

### Researcher / Specialist Tax Scheme (Forskerordningen)

A flat 27% tax rate for highly paid foreign specialists.
- Eligible: researchers and high earners recruited from outside Denmark (must not have been Danish tax resident for 3+ of the previous 10 years)
- Monthly salary requirement: **DKK 73,500/month+** (2026; ~DKK 882,000/year)
- Tax rate: **27%** flat on gross salary (vs. standard effective rate up to 52.07%)
- Duration: up to **7 years** from start of Danish employment
- Application: submitted by the employer on the employee's behalf

### Danish Income Tax (2026)

Denmark has one of the world's most complex tax structures: national tax + local tax + labor market contribution (AM-bidrag).

**Key Tax Rates**

| Tax | Rate |
|-----|------|
| National income tax (bottom rate) | 12.01% |
| National income tax (top rate supplement) | +15% (on income above DKK 588,900) |
| Local tax (kommuneskat, national average) | ~25.0% |
| Labor market contribution (AM-bidrag) | 8.0% (on gross income before other taxes) |

→ Maximum effective rate reaches **52.07%** for income above ~DKK 588,900 (~€79,000/year).

**Social Insurance / Labor Market**
- AM-bidrag: **8%** (self-declared and paid by employee)
- ATP (supplementary pension): ~DKK 99/month employee contribution (employer pays DKK 297)

### Cost Overview

| Item | Cost |
|------|------|
| Pay Limit / Positive List permit fee | DKK 4,165 (~€559) |
| Residence permit card (biometrics) | DKK 1,405 (~€188) |
| Spouse work permit fee | DKK 4,165 (~€559) |

### Rent in Copenhagen's Expat-Friendly Neighbourhoods

| Area | 1BR | 2BR |
|------|-----|-----|
| Frederiksberg (popular expat suburb) | DKK 14,000–20,000 (€1,880–2,685) | DKK 20,000–28,000 (€2,685–3,760) |
| Nørrebro (diverse, younger crowd) | DKK 11,000–17,000 (€1,477–2,283) | DKK 17,000–24,000 (€2,283–3,224) |
| Vesterbro (trendy) | DKK 12,000–18,000 (€1,612–2,417) | DKK 18,000–26,000 (€2,417–3,492) |
| Østerbro (upscale) | DKK 15,000–22,000 (€2,014–2,954) | DKK 22,000–32,000 (€2,954–4,297) |

### Monthly Living Costs (Copenhagen)

- Groceries (home cooking): DKK 3,500–5,000 (€470–672)
- Restaurant meal: DKK 150–300 per person
- Monthly transit pass: DKK 460–520 (€62–70)
- Utilities (electricity, heating, water): DKK 1,200–2,500 (€161–336)

### Pre-Move Checklist

1. **Get your CPR Number**: Denmark's personal ID — essential for banking, healthcare, and taxes. Apply at Borgerservice (local citizen services office)
2. **Set up MitID**: Denmark's digital signature system — required for all government and banking online services (available after CPR registration)
3. **Set up Nemkonto**: Your designated bank account for receiving government payments and tax refunds — set up after getting CPR
4. **Housing**: Copenhagen housing demand is very high. Research on Boliga and Lejebolig well before arrival
5. **Forskerordningen deadline**: Must be applied for by the employer **within 3 months of employment start**
6. **Danish language**: English works well for work and daily life. Free Danish language courses (danskuddannelse) are available for residents

Denmark's high taxes come with world-class social services, exceptional work-life balance, and a very high quality of life. Use MoveWorth to simulate your after-tax income and long-term financial trajectory.

---

### References

This article is based on the following official sources.

- **Positive List (primary work permit route)**: [Nyidanmark – Positive List](https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/The-Positive-Lists)
- **Pay Limit Scheme**: [Nyidanmark – Pay Limit Scheme](https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Pay-limit-scheme)
- **Job Seeking Permit**: [Nyidanmark – Job Seeking Permit](https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Jobseeking-permit)
- **Start-up Denmark**: [Nyidanmark – Start-up Denmark](https://www.nyidanmark.dk/en-us/coming_to_dk/work/Start-up-denmark/)
- **Tax Registration**: [SKAT – Danish Tax Agency (Individual Tax Information)](https://skat.dk/en-us/individuals)`,
      zh: `丹麦长期被评为全球最幸福的国家之一，提供高质量的生活水准、优秀的福利制度和先进的商业环境。尽管税率是全球最高之一，但免费医疗、教育和慷慨的育儿假等社会保障同样出色。

### 主要就业许可类型

**欧盟/欧洲经济区及北欧国家公民**
可自由工作，无需就业许可。居留超过3个月须申请登记证明（registreringsbevis）。

**快速通道制度（Fast Track Scheme）**
由Businessdanmark认证企业雇用的外籍人士可享受加速审批。
- 审批时间：最短**1个月**（标准申请需2〜3个月）
- 与薪资上限或正面清单制度组合使用
- 部分情况下可在收到申请确认后即开始工作

**正面清单制度（Positive List）** ｜ [Nyidanmark 官方页面](https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/The-Positive-Lists)
丹麦最重要的就业签证途径——适用于政府认定的短缺职业，每年1月1日和7月1日更新。
- 示例：软件开发者、IT工程师、医生、护士、建筑师、电气工程师等
- 需证明相关学历和工作经验
- 薪资须达到行业标准水平
- 申请费：DKK 4,165
- 与快速通道认证企业组合使用时，最快1个月获批

**薪资上限制度（Beløbsordningen）** ｜ [Nyidanmark 官方页面](https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Pay-limit-scheme)
适用于高薪专业人士，无特定学历或职业要求。
- 最低年薪：**DKK 552,000以上**（2026年，月薪约DKK 46,000）
- 有效期：最长**4年**（可续签）
- 申请费：DKK 4,165

**求职许可（Job Seeking Permit）** ｜ [Nyidanmark 官方页面](https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Jobseeking-permit)
就业许可持有人失业后，可在丹麦境内停留最长**6个月**继续求职。
- 适用对象：持有薪资上限、正面清单、研究者或快速通道许可且失业的人士
- 期间不可从事工作，仅限求职活动。找到新雇主后可切换为就业许可

**创业丹麦（Start-up Denmark）** ｜ [Nyidanmark 官方页面](https://www.nyidanmark.dk/en-us/coming_to_dk/work/Start-up-denmark/)
适用于在丹麦创立创新型高成长企业的外籍创业者。
- 商业计划须通过丹麦商业局任命的专家评审委员会审批
- 须证明具备覆盖第一年在丹麦生活的充足资金（带家属需额外证明）
- 有效期：**2年**（业务持续运营可续签）

**EU蓝卡**
适用于年薪约DKK 528,000以上（2026年标准）的高技能专业人士。

### 研究者/专家税收优惠（Forskerordningen）

针对从海外引进的高技能人才提供27%固定税率的特殊政策。
- 适用对象：从境外招募的研究人员和高薪专业人士（过去10年内在丹麦税务居住不超过3年）
- 月薪要求：**DKK 73,500以上**（2026年，约年薪DKK 882,000）
- 税率：**27%**固定税率（相比标准实际税率最高52.07%大幅降低）
- 适用期：自在丹麦就业开始起最长**7年**
- 申请：由雇主代为申请

### 丹麦所得税（2026年）

丹麦税制由国家税+地方税+劳动力市场贡献金（AM-bidrag）三层构成，是全球最复杂的税制之一。

**主要税率**

| 税目 | 税率 |
|-----|-----|
| 国家所得税（基础税率） | 12.01% |
| 国家所得税（顶部税率补充） | +15%（应税收入超DKK 588,900部分） |
| 地方税（kommuneskat，全国平均） | 约25.0% |
| 劳动力市场贡献金（AM-bidrag） | 8.0%（按税前总收入计算） |

*年收入超过约DKK 588,900（约€79,000）时，最高实际税率可达**52.07%**。*

**社会保险/劳动力市场**
- AM-bidrag：**8%**（由雇员自行申报缴纳）
- ATP（补充养老金）：雇员月缴约DKK 99（雇主另缴DKK 297）

### 费用参考

| 项目 | 费用 |
|------|------|
| 薪资上限/正面清单申请费 | DKK 4,165（约€559） |
| 居留许可证（生物特征） | DKK 1,405（约€188） |
| 配偶就业许可申请费 | DKK 4,165（约€559） |

### 哥本哈根外籍人士聚居区租金

| 区域 | 1居室 | 2居室 |
|------|------|------|
| 弗雷德里克斯贝尔（Frederiksberg，外籍人士聚居） | DKK 14,000〜20,000（€1,880〜2,685） | DKK 20,000〜28,000（€2,685〜3,760） |
| 诺勒布罗区（Nørrebro，多元文化） | DKK 11,000〜17,000（€1,477〜2,283） | DKK 17,000〜24,000（€2,283〜3,224） |
| 维斯特布罗区（Vesterbro，时尚潮流） | DKK 12,000〜18,000（€1,612〜2,417） | DKK 18,000〜26,000（€2,417〜3,492） |
| 奥斯特布罗区（Østerbro，高档住宅） | DKK 15,000〜22,000（€2,014〜2,954） | DKK 22,000〜32,000（€2,954〜4,297） |

### 月生活费参考（哥本哈根）

- 伙食费（自炊）：DKK 3,500〜5,000（€470〜672）
- 外出就餐：每餐DKK 150〜300
- 交通月票：DKK 460〜520（€62〜70）
- 水电暖气费：DKK 1,200〜2,500（€161〜336）

### 移居前注意事项

1. **申请CPR号码**：丹麦居民身份号码，银行、医疗、税务必备。在市民服务中心（Borgerservice）申请
2. **设置MitID**：丹麦数字签名，政府和银行在线服务必备（CPR注册后可申请）
3. **设置Nemkonto指定账户**：接收政府付款和退税的专用账户，CPR注册后设置
4. **提前寻房**：哥本哈根住房需求旺盛，建议在Boliga和Lejebolig提前搜索
5. **Forskerordningen申请期限**：须由雇主在**就业开始后3个月内**代为申请
6. **丹麦语**：工作和日常英语基本够用，居民可免费参加丹麦语课程（danskuddannelse）

丹麦高税率背后是卓越的社会服务、极佳的工作生活平衡和高品质生活。使用MoveWorth模拟税后收入和长期财务规划，从容规划移居丹麦。

---

### 参考资料

本文信息基于以下官方资料整理。

- **正面清单（就业签证核心路径）**: [Nyidanmark – 正面清单](https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/The-Positive-Lists)
- **薪资上限制度**: [Nyidanmark – 薪资上限制度](https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Pay-limit-scheme)
- **求职许可**: [Nyidanmark – 求职许可](https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Jobseeking-permit)
- **创业丹麦**: [Nyidanmark – Start-up Denmark](https://www.nyidanmark.dk/en-us/coming_to_dk/work/Start-up-denmark/)
- **税务注册**: [SKAT – 丹麦税务局（个人税务信息）](https://skat.dk/en-us/individuals)`,
    },
  },
  {
    slug: "visa-br",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-br.webp",
    title: {
      ja: "【2026年最新版】ブラジルのビザ・就労許可完全ガイド",
      en: "Brazil Work Visa Requirements & Permanent Residency Guide 2026 | Digital Nomad, Temporary Resident",
      zh: "【2026年最新版】巴西签证与就业许可完全指南",
    },
    description: {
      ja: "デジタルノマドビザ・就労ビザ・所得税・サンパウロ家賃まで、ブラジル移住に必要な情報を2026年最新データで徹底解説。",
      en: "Brazil work visa requirements 2026 — CTPS, digital nomad visa (VITEM XIII), and permanent residency for foreigners. Income tax 7.5–27.5%, São Paulo expat rents, full fee tables.",
      zh: "数字游民签证、工作签证、所得税、圣保罗租金——2026年最新移居巴西完全指南。",
    },
    content: {
      ja: `ブラジルは南米最大の経済大国で、サンパウロのような世界都市と豊かな自然を併せ持つ多様な国です。2022年に導入されたデジタルノマドビザ（VITEM XIII）により、リモートワーカーにとっても移住しやすい環境が整いました。

### 主なビザの種類

**デジタルノマドビザ（VITEM XIV）** ｜ [ブラジル外務省 公式ページ](https://www.gov.br/mre/pt-br/consulado-londres/visa-section/types-of-visa/temporary-visa-vitem/digital-nomads-vitem-xiv-2013-rn-45-2021)
ブラジルの主力ビザ。ブラジル国外の企業・クライアントのためにリモートで働く外国人向け。2022年導入。
- 最低月収：**USD 1,500以上**（または銀行残高USD 18,000以上）
- 有効期間：初回1年間（さらに1年更新可能）
- ブラジル源泉の収入が全体の**30%を超えないこと**
- 申請先：在外ブラジル領事館

**就労ビザ（VITEM V）** ｜ [ブラジル外務省 公式ページ](https://www.gov.br/mre/pt-br/embaixada-helsinque/consular-services/temporary-work-visa-vitem-v)
ブラジルの企業から雇用オファーを受けた外国人向けの就労ビザ。
- 雇用主がCNIg（国家移民評議会）を通じて申請を主導
- 有効期間：最大**2年間**、更新可能
- 一時的就労許可（CTPS：Carteira de Trabalho）の取得が雇用開始前に必要

**退職者ビザ（VITEM XI / Aposentadoria）**
月額**USD 2,000以上**（または相当額）の年金・退職所得を証明できる方向けのビザ。

**投資家ビザ（Investor Visa）** ｜ [ブラジル外務省 公式ページ](https://www.gov.br/mre/pt-br/consulado-amsterda/vistos/visa-investor-vitem)
ブラジルに投資を行う外国人向けの永住権ルート。
- 投資額：**R$500,000以上**（新興・開発地域は**R$150,000以上**）
- 雇用創出の証明が求められる場合あり
- 投資維持中は永住権を維持可能

**配偶者・家族ビザ（VITEM IX）**
ブラジル市民または永住者との婚姻・親族関係による移住ビザ。

### 永住権（Autorização de Residência Permanente）

以下の場合に申請可能：
- ブラジル人との婚姻（婚姻から1年以上経過後）
- ブラジル国籍の子どもを持つ外国人親
- **4年以上**の合法滞在（一時居住権保有者）
- 一定額以上の投資

### ブラジルの所得税（IRPF、2026年）

ブラジルに税務居住者として認定された場合（年間183日以上の滞在が目安）、以下の税率が適用されます。

**所得税率表**

| 課税所得（年額 R$） | 税率 |
|------------------|-----|
| R$28,559.70以下 | 免税 |
| R$28,559.71〜R$42,749.85 | 7.5% |
| R$42,749.86〜R$57,022.05 | 15.0% |
| R$57,022.06〜R$71,686.68 | 22.5% |
| R$71,686.69超 | 27.5% |

※月額換算：免税は月収R$2,380以下

**外国人の課税（税務居住者前）**
- 非居住者としての源泉所得税：一律**25%**

### 費用の目安

| 項目 | 費用 |
|------|------|
| 就労ビザ申請費（領事館） | 約R$500〜1,000 |
| デジタルノマドビザ申請費 | 約USD 140〜200（領事館により異なる） |
| RNM（国家移民登録）カード発行 | 約R$200 |
| CPF取得 | 無料（領事館経由） |

### サンパウロ・リオデジャネイロの家賃相場（外国人居住エリア）

| エリア | 1LDK | 2LDK |
|-------|------|------|
| サンパウロ・イタイン（Itaim Bibi） | R$5,000〜9,000（€900〜1,620） | R$8,000〜15,000（€1,440〜2,700） |
| サンパウロ・モエマ（Moema） | R$4,500〜8,000（€810〜1,440） | R$7,000〜13,000（€1,260〜2,340） |
| リオ・イパネマ（Ipanema） | R$5,500〜10,000（€990〜1,800） | R$9,000〜18,000（€1,620〜3,240） |
| リオ・レブロン（Leblon） | R$6,000〜12,000（€1,080〜2,160） | R$10,000〜20,000（€1,800〜3,600） |

※1 BRL ≒ 0.18 EUR（2026年3月時点目安）

### 月々の生活費目安（サンパウロ）

- 食費（自炊）：R$1,500〜2,500（€270〜450）
- 交通費（Metrô月定期）：R$260（€47）
- 光熱費（電気・水道・ガス）：R$400〜700（€72〜126）
- 民間健康保険：R$600〜1,500/月（プランにより大幅差）

### 移住前のチェックポイント

1. **CPF（納税者番号）の取得**：銀行口座開設・不動産賃貸・各種契約に不可欠。在外ブラジル領事館または渡航後にReceitaFederal（連邦税務局）で申請
2. **RNM（国家移民登録）カード**：居住ビザ・永住権保有者に発行される外国人登録証。取得後に生体情報登録が必要
3. **CTPS（労働手帳）**：雇用前に必要な就労許可証。雇用主を通じて取得
4. **安全対策**：サンパウロ・リオデジャネイロ等の大都市では居住エリアの治安調査を徹底
5. **ポルトガル語**：ブラジルでは英語が通じない場面が多い。基礎語学力は必須
6. **民間健康保険**：公的医療（SUS）は外国人も利用可能だが、待ち時間が長く、民間保険の加入を強く推奨

ブラジルは生活コストが比較的低く、豊かな文化・自然が魅力の移住先です。MoveWorthでシミュレーションして、南米移住の準備を始めましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **デジタルノマドビザ（VITEM XIV）**: [ブラジル外務省 – デジタルノマドビザ](https://www.gov.br/mre/pt-br/consulado-londres/visa-section/types-of-visa/temporary-visa-vitem/digital-nomads-vitem-xiv-2013-rn-45-2021)
- **就労ビザ（VITEM V）**: [ブラジル外務省 – 就労ビザ](https://www.gov.br/mre/pt-br/embaixada-helsinque/consular-services/temporary-work-visa-vitem-v)
- **投資家ビザ**: [ブラジル外務省 – 投資家ビザ](https://www.gov.br/mre/pt-br/consulado-amsterda/vistos/visa-investor-vitem)
- **在留登録・移民手続き**: [ブラジル連邦警察（Polícia Federal）](https://www.gov.br/pf/pt-br/assuntos/imigracao/inicio)`,
      en: `Brazil is South America's largest economy, combining world-class cities like São Paulo with extraordinary natural diversity. The 2022 digital nomad visa (VITEM XIII) has made it significantly more accessible for remote workers worldwide.

### Main Visa Types

**Digital Nomad Visa (VITEM XIV)** ｜ [MRE Official Page](https://www.gov.br/mre/pt-br/consulado-londres/visa-section/types-of-visa/temporary-visa-vitem/digital-nomads-vitem-xiv-2013-rn-45-2021)
Brazil's most popular visa for remote workers — introduced in 2022 for those working for clients or employers outside Brazil.
- Minimum monthly income: **USD 1,500+** (or USD 18,000+ in bank savings)
- Validity: 1 year, renewable for another year
- Brazilian-sourced income must not exceed **30% of total income**
- Apply at a Brazilian consulate abroad

**Work Visa (VITEM V)** ｜ [MRE Official Page](https://www.gov.br/mre/pt-br/embaixada-helsinque/consular-services/temporary-work-visa-vitem-v)
For foreign nationals with a job offer from a Brazilian employer.
- Employer applies through CNIg (National Immigration Council)
- Validity: up to **2 years**, renewable
- A work permit card (CTPS: Carteira de Trabalho) must be issued before employment begins

**Retirement Visa (VITEM XIV / Aposentadoria)**
For those with proven monthly retirement or pension income of **USD 2,000+**.

**Investor Visa** ｜ [MRE Official Page](https://www.gov.br/mre/pt-br/consulado-amsterda/vistos/visa-investor-vitem)
A permanent residency route for those making qualifying investments in Brazil.
- Minimum investment: **R$500,000+** (R$150,000+ in emerging or development regions)
- May require proof of job creation
- Permanent residency maintained as long as investment continues

**Spouse / Family Visa (VITEM IX)**
For spouses and close family members of Brazilian citizens or permanent residents.

### Permanent Residency (Autorização de Residência Permanente)

Can be obtained through:
- Marriage to a Brazilian citizen (after 1+ years of marriage)
- Having a Brazilian child
- **4+ years** of lawful residence (as a temporary visa holder)
- Qualifying investment

### Brazilian Income Tax (IRPF, 2026)

Once considered a tax resident (generally after 183+ days/year in Brazil), the following rates apply:

**Income Tax Table**

| Annual Income (R$) | Rate |
|-------------------|------|
| Up to R$28,559.70 | Exempt |
| R$28,559.71–R$42,749.85 | 7.5% |
| R$42,749.86–R$57,022.05 | 15.0% |
| R$57,022.06–R$71,686.68 | 22.5% |
| Above R$71,686.69 | 27.5% |

*Monthly equivalent: income under R$2,380/month is fully exempt.*

**Pre-residency withholding tax (non-residents)**
- A flat **25% withholding tax** applies to Brazilian-sourced income before becoming a tax resident

### Cost Overview

| Item | Cost |
|------|------|
| Work visa fee (consulate) | ~R$500–1,000 |
| Digital Nomad Visa fee | ~USD 140–200 (varies by consulate) |
| RNM card (national immigration register) | ~R$200 |
| CPF registration | Free (via consulate) |

### Rent in São Paulo & Rio de Janeiro Expat Neighbourhoods

| Area | 1BR | 2BR |
|------|-----|-----|
| São Paulo – Itaim Bibi (financial district expat area) | R$5,000–9,000 (€900–1,620) | R$8,000–15,000 (€1,440–2,700) |
| São Paulo – Moema (family-friendly) | R$4,500–8,000 (€810–1,440) | R$7,000–13,000 (€1,260–2,340) |
| Rio – Ipanema | R$5,500–10,000 (€990–1,800) | R$9,000–18,000 (€1,620–3,240) |
| Rio – Leblon (most upscale) | R$6,000–12,000 (€1,080–2,160) | R$10,000–20,000 (€1,800–3,600) |

*1 BRL ≈ €0.18 (March 2026 estimate)*

### Monthly Living Costs (São Paulo)

- Groceries (home cooking): R$1,500–2,500 (€270–450)
- Monthly metro pass: R$260 (€47)
- Utilities (electricity, water, gas): R$400–700 (€72–126)
- Private health insurance: R$600–1,500/month (varies widely by plan)

### Pre-Move Checklist

1. **Get a CPF (Taxpayer ID)**: Essential for banking, leases, and contracts in Brazil. Apply at a Brazilian consulate abroad or at Receita Federal after arrival
2. **RNM Card**: The national immigration registration card for visa and residency holders — biometric registration required
3. **CTPS (Work Card)**: Required before starting employment; obtained through the employer
4. **Safety research**: Research neighborhood safety carefully in São Paulo and Rio de Janeiro — conditions vary widely by district
5. **Portuguese language**: English is not widely spoken in Brazil — basic Portuguese is essential for daily life
6. **Private health insurance**: Brazil's public system (SUS) is accessible but has long wait times — private insurance is strongly recommended for expats

Brazil offers a relatively low cost of living and a vibrant culture. Use MoveWorth to simulate your finances and start planning your South American adventure.

---

### References

This article is based on the following official sources.

- **Digital Nomad Visa (VITEM XIV)**: [MRE – Digital Nomad Visa](https://www.gov.br/mre/pt-br/consulado-londres/visa-section/types-of-visa/temporary-visa-vitem/digital-nomads-vitem-xiv-2013-rn-45-2021)
- **Work Visa (VITEM V)**: [MRE – Temporary Work Visa](https://www.gov.br/mre/pt-br/embaixada-helsinque/consular-services/temporary-work-visa-vitem-v)
- **Investor Visa**: [MRE – Investor Visa](https://www.gov.br/mre/pt-br/consulado-amsterda/vistos/visa-investor-vitem)
- **Immigration Registration**: [Brazil Federal Police (Polícia Federal)](https://www.gov.br/pf/pt-br/assuntos/imigracao/inicio)`,
      zh: `巴西是南美洲最大的经济体，拥有圣保罗等国际化大都市和丰富的自然资源。2022年推出的数字游民签证（VITEM XIII），使远程工作者移居巴西更加便利。

### 主要签证类型

**数字游民签证（VITEM XIV）** ｜ [巴西外交部 官方页面](https://www.gov.br/mre/pt-br/consulado-londres/visa-section/types-of-visa/temporary-visa-vitem/digital-nomads-vitem-xiv-2013-rn-45-2021)
巴西最受欢迎的签证——适用于为巴西境外企业或客户远程工作的外籍人士，2022年推出。
- 最低月收入：**USD 1,500以上**（或银行存款USD 18,000以上）
- 有效期：1年，可续签1年
- 巴西境内收入不超过总收入的**30%**
- 申请地点：驻外巴西领事馆

**工作签证（VITEM V）** ｜ [巴西外交部 官方页面](https://www.gov.br/mre/pt-br/embaixada-helsinque/consular-services/temporary-work-visa-vitem-v)
适用于持有巴西企业工作邀约的外籍人士。
- 由雇主通过CNIg（国家移民委员会）主导申请
- 有效期：最长**2年**，可续签
- 就业前须领取劳动手册（CTPS）

**退休人员签证（VITEM XIV / Aposentadoria）**
适用于月养老金或退休收入不低于**USD 2,000**的申请者。

**投资者签证** ｜ [巴西外交部 官方页面](https://www.gov.br/mre/pt-br/consulado-amsterda/vistos/visa-investor-vitem)
适用于在巴西进行合格投资的外籍人士，可获得永久居留权。
- 最低投资额：**R$500,000以上**（新兴/开发地区**R$150,000以上**）
- 可能须证明创造就业岗位
- 投资持续期间可维持永久居留权

**配偶/家庭签证（VITEM IX）**
适用于巴西公民或永久居民的配偶及近亲。

### 永久居留权（Autorização de Residência Permanente）

可通过以下方式申请：
- 与巴西公民结婚（婚后满1年以上）
- 拥有巴西国籍子女
- 合法居留**4年以上**（持临时签证者）
- 符合条件的投资

### 巴西所得税（IRPF，2026年）

成为税务居民后（通常以每年居住183天以上为标准），适用以下税率：

**所得税率表**

| 年收入（R$） | 税率 |
|-----------|-----|
| R$28,559.70以下 | 免税 |
| R$28,559.71〜R$42,749.85 | 7.5% |
| R$42,749.86〜R$57,022.05 | 15.0% |
| R$57,022.06〜R$71,686.68 | 22.5% |
| R$71,686.69以上 | 27.5% |

*月收入R$2,380以下全额免税。*

**非税务居民预扣税**
- 在成为税务居民之前，巴西来源收入须缴纳一律**25%**的预扣税

### 费用参考

| 项目 | 费用 |
|------|------|
| 工作签证申请费（领事馆） | 约R$500〜1,000 |
| 数字游民签证费 | 约USD 140〜200（各领事馆不同） |
| RNM国家移民登记卡 | 约R$200 |
| CPF注册 | 免费（领事馆途径） |

### 圣保罗/里约热内卢外籍人士聚居区租金

| 区域 | 1居室 | 2居室 |
|------|------|------|
| 圣保罗·伊泰姆比比（Itaim Bibi，金融区） | R$5,000〜9,000（€900〜1,620） | R$8,000〜15,000（€1,440〜2,700） |
| 圣保罗·莫埃马（Moema，家庭友好） | R$4,500〜8,000（€810〜1,440） | R$7,000〜13,000（€1,260〜2,340） |
| 里约·伊帕内玛（Ipanema） | R$5,500〜10,000（€990〜1,800） | R$9,000〜18,000（€1,620〜3,240） |
| 里约·莱布隆（Leblon，最高档） | R$6,000〜12,000（€1,080〜2,160） | R$10,000〜20,000（€1,800〜3,600） |

*1 BRL ≈ €0.18（2026年3月参考汇率）*

### 月生活费参考（圣保罗）

- 伙食费（自炊）：R$1,500〜2,500（€270〜450）
- 地铁月票：R$260（€47）
- 水电煤气费：R$400〜700（€72〜126）
- 私人医疗保险：R$600〜1,500/月（因方案差异较大）

### 移居前注意事项

1. **申请CPF（纳税人识别号）**：开户、租房、各类合同必备。可在驻外巴西领事馆或抵达后在Receita Federal申请
2. **RNM国家移民登记卡**：持签证和居留权者须办理，需登记生物特征信息
3. **CTPS劳动手册**：就业前必须通过雇主领取
4. **调查居住区安全状况**：圣保罗和里约各区治安差异极大，务必提前研究
5. **葡萄牙语**：英语普及率低，基础葡萄牙语是日常生活必需
6. **私人医疗保险**：公立医疗（SUS）外籍人士可使用，但等待时间长，强烈建议购买私人保险

巴西生活成本相对较低，文化和自然魅力十足。使用MoveWorth模拟财务状况，开始规划南美移居之旅。

---

### 参考资料

本文信息基于以下官方资料整理。

- **数字游民签证（VITEM XIV）**: [巴西外交部 – 数字游民签证](https://www.gov.br/mre/pt-br/consulado-londres/visa-section/types-of-visa/temporary-visa-vitem/digital-nomads-vitem-xiv-2013-rn-45-2021)
- **工作签证（VITEM V）**: [巴西外交部 – 临时工作签证](https://www.gov.br/mre/pt-br/embaixada-helsinque/consular-services/temporary-work-visa-vitem-v)
- **投资者签证**: [巴西外交部 – 投资者签证](https://www.gov.br/mre/pt-br/consulado-amsterda/vistos/visa-investor-vitem)
- **移民登记手续**: [巴西联邦警察（Polícia Federal）](https://www.gov.br/pf/pt-br/assuntos/imigracao/inicio)`,
    },
  },
  {
    slug: "visa-co",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-co.webp",
    title: {
      ja: "【2026年最新版】コロンビアのビザ・就労許可完全ガイド",
      en: "Colombia Visa & Work Permit Complete Guide 2026",
      zh: "【2026年最新版】哥伦比亚签证与就业许可完全指南",
    },
    description: {
      ja: "デジタルノマドビザ・所得税・メデジン家賃まで、コロンビア移住に必要な情報を2026年最新データで徹底解説。",
      en: "Digital nomad visa, income tax, and Medellín rent — a complete 2026 guide to living and working in Colombia.",
      zh: "数字游民签证、所得税、麦德林租金——2026年最新移居哥伦比亚完全指南。",
    },
    content: {
      ja: `コロンビアは、デジタルノマドのハブとして近年急速に注目を集めている南米の国です。特にメデジンは「永遠の春の都市」と呼ばれる気候・充実したインフラ・活発なノマドコミュニティで世界有数のノマド都市として知られています。生活費の低さと高速インターネット環境も魅力です。

### コロンビアのビザ制度

コロンビアのビザは大きく3カテゴリに分かれます：

| カテゴリ | 目的 |
|--------|-----|
| **V（Visitante）ビザ** | 短期滞在・観光・デジタルノマド向け（最大2年） |
| **M（Migrante）ビザ** | 就労・事業・家族等の中長期滞在向け（最大3年） |
| **R（Residente）ビザ** | 永住者に準じる長期居住向け（5年間有効、更新可） |

### 主なビザの種類

**デジタルノマドビザ（V - Nómada Digital）** ｜ [Cancillería 公式ページ](https://www.cancilleria.gov.co/v/nomadadigital)
コロンビアの主力ビザ。海外の企業・クライアントのためにリモートで働く外国人向け。2022年整備。
- 最低月収：**約USD 1,000以上**（所得証明または雇用契約・フリーランス契約）
- 有効期間：最大**2年間**
- 家族の同行可能
- 申請はオンライン（Cancillería ポータル経由）

**就労ビザ（M - Trabajador）** ｜ [Cancillería 公式ページ](https://www.cancilleria.gov.co/v/trabajador)
コロンビアの企業から雇用オファーを受けた外国人向け。
- 雇用契約書・雇用主の法人登記書類の提出が必要
- 有効期間：最大**3年**
- 5年間の保有後、永住ビザ（R）の申請資格を得る

**移民ビザ（M - Migrante）** ｜ [Cancillería 公式ページ](https://www.cancilleria.gov.co/node/26933)
就労・事業・家族等の中長期滞在向けビザカテゴリ全般。Mビザには複数のサブカテゴリがある。
- 退職者（M-11）・投資家（M-1）・家族（M-6）・起業家等を包括
- 有効期間：最大**3年**（サブカテゴリにより異なる）

**退職者ビザ（M-11）**
月額**COP 3,000,000以上**（約USD 700、2026年レート目安）の年金・退職収入を証明できる方向け。

**投資家ビザ（M-1）**
コロンビアへの投資（不動産・事業等）を行う方向け。

### 永住権（R-Visa）

以下の条件を満たすと申請可能：
- **5年間**の合法滞在
- コロンビア人との婚姻（2年間の合法滞在後）
- コロンビア国籍の子どもを持つ外国人親

### コロンビアの所得税（DIAN、2026年）

コロンビアに税務居住者として認定された場合（通常、暦年中183日以上の滞在）、以下の税率が適用されます。

**所得税率表（2026年、UVT単位 ※1 UVT≒COP 49,799）**

| 課税所得（UVT/年） | 税率 |
|-----------------|-----|
| 1,090 UVT以下（約COP 54M） | 0% |
| 1,090〜1,700 UVT | 19% |
| 1,700〜4,100 UVT | 28% |
| 4,100〜8,670 UVT | 33% |
| 8,670〜18,970 UVT | 35% |
| 18,970〜31,000 UVT | 37% |
| 31,000 UVT超 | 39% |

※非居住者のコロンビア源泉所得：一律**20%**の源泉税

**社会保険料**
- 健康保険（EPS）：総収入の約**12.5%**（雇用者：8.5%、被用者：4%）
- 年金（AFP）：総収入の約**16%**（雇用者：12%、被用者：4%）

### 費用の目安

| 項目 | 費用 |
|------|------|
| デジタルノマドビザ申請費（V-TP-7） | 約COP 258,000（約USD 65） |
| Mビザ申請費 | 約COP 258,000〜516,000 |
| Cédula de Extranjería発行費 | 約COP 130,000 |

### メデジン・ボゴタの家賃相場（外国人居住エリア）

| エリア | 1LDK | 2LDK |
|-------|------|------|
| メデジン・エル・ポブラド（El Poblado・外国人人気No.1） | COP 1,500,000〜2,800,000（€340〜636） | COP 2,500,000〜4,500,000（€568〜1,022） |
| メデジン・ラウレレス（Laureles・ファミリー向け） | COP 1,200,000〜2,200,000（€272〜500） | COP 2,000,000〜3,500,000（€454〜795） |
| ボゴタ・チコ（Chicó・高級住宅街） | COP 2,000,000〜3,500,000（€454〜795） | COP 3,500,000〜6,000,000（€795〜1,363） |
| ボゴタ・ウスアキエン（Usaquén・外国人エリア） | COP 1,800,000〜3,000,000（€409〜681） | COP 3,000,000〜5,000,000（€681〜1,136） |

※1 COP ≒ 0.000227 EUR（2026年3月時点目安）

### 月々の生活費目安（メデジン）

- 食費（自炊）：COP 600,000〜1,200,000（€136〜272）
- 外食：1食COP 15,000〜50,000（€3.4〜11.4）
- 交通費（Metro月定期）：約COP 100,000（€22.7）
- 光熱費（電気・水道・インターネット）：COP 200,000〜400,000（€45〜91）
- コワーキングスペース：COP 200,000〜500,000/月（€45〜114）

**合計目安：月COP 1,500,000〜3,500,000（約€341〜795）**

### 移住前のチェックポイント

1. **Cédula de Extranjería（外国人IDカード）の取得**：Mビザ・Rビザ保有者に発行。コロンビアでの生活・契約・銀行口座開設に必要
2. **RUT（税務登録）の取得**：DIAN（国家税務・関税局）への登録。フリーランス・事業活動に必須
3. **安全対策**：地域によって治安の差が大きい。メデジンはエル・ポブラド・ラウレレス・エルミラドール等の安全地区を選ぶ
4. **スペイン語**：外国人ハブ以外では英語がほぼ通じない。基本的なスペイン語が日常生活に必要
5. **医療保険**：Mビザ保有者はEPS（健康保険制度）に加入義務あり。ノマドビザ保有者は民間保険を強く推奨
6. **銀行口座**：Cédula de Extranjeríaまたは在外コロンビア人向け書類で開設可能（Bancolombia等）

コロンビアは低い生活費・温暖な気候・ノマドフレンドリーな環境で、新興の移住先として人気急上昇中です。MoveWorthで資産シミュレーションを行い、南米移住の計画を立ててみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ申請全般**: [コロンビア外務省 – ビザポータル（Cancillería）](https://www.cancilleria.gov.co/tramites_servicios/visa)
- **デジタルノマドビザ（V - Nómada Digital）**: [Cancillería 公式ページ](https://www.cancilleria.gov.co/v/nomadadigital)
- **就労ビザ（M - Trabajador）**: [Cancillería 公式ページ](https://www.cancilleria.gov.co/v/trabajador)
- **移民ビザ（M - Migrante）**: [Cancillería 公式ページ](https://www.cancilleria.gov.co/node/26933)
- **在留外国人管理**: [コロンビア移民局（Migración Colombia）](https://www.migracioncolombia.gov.co/)`,
      en: `Colombia has rapidly emerged as one of the top destinations for digital nomads and expats. Medellín is globally recognized for its spring-like climate ("the City of Eternal Spring"), excellent infrastructure, and vibrant nomad community — with some of the most affordable living costs among major cities.

### Colombia's Visa System

| Category | Purpose |
|---------|---------|
| **V (Visitante)** | Short stays, tourism, digital nomads (max 2 years) |
| **M (Migrante)** | Work, business, family — medium to long-term (max 3 years) |
| **R (Residente)** | Near-permanent residence (5-year permit, renewable) |

### Main Visa Types

**Digital Nomad Visa (V – Nómada Digital)** ｜ [Cancillería Official Page](https://www.cancilleria.gov.co/v/nomadadigital)
Colombia's primary visa for remote workers — formalized in 2022 for those working for foreign companies or clients.
- Minimum monthly income: **~USD 1,000+** (proof of employment contract or freelance income)
- Validity: up to **2 years**
- Family members can be included
- Apply online via the Cancillería portal

**Work Visa (M – Trabajador)** ｜ [Cancillería Official Page](https://www.cancilleria.gov.co/v/trabajador)
For foreign nationals with a job offer from a Colombian employer.
- Requires employment contract and employer's registration documents
- Validity: up to **3 years**
- After 5 years, qualifies for Resident Visa (R)

**Migrant Visa (M – Migrante)** ｜ [Cancillería Official Page](https://www.cancilleria.gov.co/node/26933)
The broader M-visa category covering medium to long-term stays — includes multiple subcategories.
- Subcategories: Retirement (M-11), Investor (M-1), Family (M-6), Entrepreneur, and more
- Validity: up to **3 years** (varies by subcategory)

**Retirement Visa (M-11)**
For those with proven monthly pension or retirement income of **COP 3,000,000+** (~USD 700 at 2026 rates).

**Investor Visa (M-1)**
For those making qualifying investments in Colombia (real estate, companies, etc.).

### Permanent Residency (R-Visa)

Can be applied for after:
- **5 years** of lawful residence
- Marriage to a Colombian citizen (after 2 years of lawful stay)
- Having a Colombian child

### Colombian Income Tax (DIAN, 2026)

Once a tax resident (generally 183+ days in a calendar year), the following rates apply:

**Income Tax Table (2026; UVT = ~COP 49,799)**

| Annual Income (UVT) | Rate |
|--------------------|------|
| Up to 1,090 UVT (~COP 54M) | 0% |
| 1,090–1,700 UVT | 19% |
| 1,700–4,100 UVT | 28% |
| 4,100–8,670 UVT | 33% |
| 8,670–18,970 UVT | 35% |
| 18,970–31,000 UVT | 37% |
| Above 31,000 UVT | 39% |

*Non-residents: flat **20% withholding tax** on Colombian-sourced income*

**Social Insurance**
- Health insurance (EPS): ~**12.5% of income** (employer 8.5%, employee 4%)
- Pension (AFP): ~**16% of income** (employer 12%, employee 4%)

### Cost Overview

| Item | Cost |
|------|------|
| Digital Nomad Visa fee (V-TP-7) | ~COP 258,000 (~USD 65) |
| M Visa fee | ~COP 258,000–516,000 |
| Cédula de Extranjería issuance | ~COP 130,000 |

### Rent in Medellín & Bogotá Expat Neighbourhoods

| Area | 1BR | 2BR |
|------|-----|-----|
| Medellín – El Poblado (top expat area) | COP 1.5M–2.8M (€340–636) | COP 2.5M–4.5M (€568–1,022) |
| Medellín – Laureles (family-friendly) | COP 1.2M–2.2M (€272–500) | COP 2.0M–3.5M (€454–795) |
| Bogotá – Chicó (upscale) | COP 2.0M–3.5M (€454–795) | COP 3.5M–6.0M (€795–1,363) |
| Bogotá – Usaquén (expat area) | COP 1.8M–3.0M (€409–681) | COP 3.0M–5.0M (€681–1,136) |

*1 COP ≈ €0.000227 (March 2026 estimate)*

### Monthly Living Costs (Medellín)

- Groceries (home cooking): COP 600,000–1,200,000 (€136–272)
- Restaurant meal: COP 15,000–50,000 (€3.40–11.40)
- Monthly metro pass: ~COP 100,000 (€22.70)
- Utilities (electricity, water, internet): COP 200,000–400,000 (€45–91)
- Coworking space: COP 200,000–500,000/month (€45–114)

**Total estimate: COP 1.5M–3.5M/month (~€341–795)**

### Pre-Move Checklist

1. **Get your Cédula de Extranjería**: Issued to M and R visa holders — required for banking, contracts, and daily life in Colombia
2. **Register for RUT (tax number)**: Mandatory for freelancers and business activities with DIAN
3. **Safety research**: Security varies significantly by neighbourhood. In Medellín, stick to El Poblado, Laureles, or El Mirador
4. **Spanish language**: English is limited outside expat hubs — basic Spanish is essential
5. **Health insurance**: M visa holders must enroll in EPS; digital nomad visa holders should get private insurance
6. **Banking**: Open an account with Bancolombia or Davivienda using your Cédula or equivalent documents

Colombia's low cost of living, warm climate, and nomad-friendly infrastructure make it one of South America's most exciting emerging destinations. Use MoveWorth to simulate your finances and plan your move.

---

### References

This article is based on the following official sources.

- **Visa Applications General**: [Colombian Ministry of Foreign Affairs – Visa Portal](https://www.cancilleria.gov.co/tramites_servicios/visa)
- **Digital Nomad Visa (V – Nómada Digital)**: [Cancillería Official Page](https://www.cancilleria.gov.co/v/nomadadigital)
- **Work Visa (M – Trabajador)**: [Cancillería Official Page](https://www.cancilleria.gov.co/v/trabajador)
- **Migrant Visa (M – Migrante)**: [Cancillería Official Page](https://www.cancilleria.gov.co/node/26933)
- **Foreign Resident Management**: [Migración Colombia](https://www.migracioncolombia.gov.co/)`,
      zh: `哥伦比亚近年来迅速崛起为数字游民和外籍人士的热门目的地。麦德林以"永恒春天之城"著称，气候宜人、基础设施完善、游民社区活跃，跻身全球最佳数字游民城市之列，生活成本也极具竞争力。

### 哥伦比亚签证体系

| 类别 | 目的 |
|-----|-----|
| **V（访客）签证** | 短期居留、旅游、数字游民（最长2年） |
| **M（移民）签证** | 工作、商务、家庭等中长期居留（最长3年） |
| **R（居民）签证** | 接近永久居留（5年有效，可续签） |

### 主要签证类型

**数字游民签证（V – Nómada Digital）** ｜ [Cancillería 官方页面](https://www.cancilleria.gov.co/v/nomadadigital)
哥伦比亚最主要的签证——适用于为境外企业或客户远程工作的外籍人士，2022年正式完善。
- 最低月收入：约**USD 1,000以上**（需提供雇佣合同或自由职业收入证明）
- 有效期：最长**2年**
- 可携带家庭成员同行
- 通过Cancillería门户在线申请

**工作签证（M – Trabajador）** ｜ [Cancillería 官方页面](https://www.cancilleria.gov.co/v/trabajador)
适用于持有哥伦比亚企业工作邀约的外籍人士。
- 需提交劳动合同及雇主营业执照
- 有效期：最长**3年**
- 持有满5年后可申请居民签证（R）

**移民签证（M – Migrante）** ｜ [Cancillería 官方页面](https://www.cancilleria.gov.co/node/26933)
涵盖中长期居留的M签证类别总览，含多个子类别。
- 子类别：退休人员（M-11）、投资者（M-1）、家庭（M-6）、创业者等
- 有效期：最长**3年**（因子类别而异）

**退休人员签证（M-11）**
适用于月养老金或退休收入不低于**COP 3,000,000**（约USD 700，2026年汇率参考）的申请者。

**投资者签证（M-1）**
适用于在哥伦比亚进行合规投资（房产、企业等）的外籍人士。

### 永久居留权（R签证）

满足以下条件可申请：
- 合法居留**5年**
- 与哥伦比亚公民结婚（合法居留2年后）
- 拥有哥伦比亚国籍子女

### 哥伦比亚所得税（DIAN，2026年）

成为税务居民后（通常以一个日历年内居住183天以上为标准），适用以下税率：

**所得税率表（2026年，1 UVT≒COP 49,799）**

| 年收入（UVT） | 税率 |
|------------|-----|
| 1,090 UVT以下（约COP 5,400万） | 0% |
| 1,090〜1,700 UVT | 19% |
| 1,700〜4,100 UVT | 28% |
| 4,100〜8,670 UVT | 33% |
| 8,670〜18,970 UVT | 35% |
| 18,970〜31,000 UVT | 37% |
| 31,000 UVT以上 | 39% |

*非税务居民：哥伦比亚来源收入一律征收**20%**预扣税*

**社会保险**
- 健康保险（EPS）：收入约**12.5%**（雇主8.5%，雇员4%）
- 养老金（AFP）：收入约**16%**（雇主12%，雇员4%）

### 费用参考

| 项目 | 费用 |
|------|------|
| 数字游民签证费（V-TP-7） | 约COP 258,000（约USD 65） |
| M签证费 | 约COP 258,000〜516,000 |
| 外国人身份证（Cédula） | 约COP 130,000 |

### 麦德林/波哥大外籍人士聚居区租金

| 区域 | 1居室 | 2居室 |
|------|------|------|
| 麦德林·埃尔波夫拉多（El Poblado，外籍人士No.1聚居区） | COP 150〜280万（€340〜636） | COP 250〜450万（€568〜1,022） |
| 麦德林·劳雷莱斯（Laureles，家庭友好） | COP 120〜220万（€272〜500） | COP 200〜350万（€454〜795） |
| 波哥大·奇科区（Chicó，高档住宅） | COP 200〜350万（€454〜795） | COP 350〜600万（€795〜1,363） |
| 波哥大·乌萨肯区（Usaquén，外籍人士聚居） | COP 180〜300万（€409〜681） | COP 300〜500万（€681〜1,136） |

*1 COP ≈ €0.000227（2026年3月参考汇率）*

### 月生活费参考（麦德林）

- 伙食费（自炊）：COP 60〜120万（€136〜272）
- 外出就餐：每餐COP 1.5〜5万（€3.40〜11.40）
- 地铁月票：约COP 10万（€22.70）
- 水电网费：COP 20〜40万（€45〜91）
- 联合办公空间：COP 20〜50万/月（€45〜114）

**月生活费合计：约COP 150〜350万（€341〜795）**

### 移居前注意事项

1. **申领Cédula de Extranjería（外国人身份证）**：M签证和R签证持有者的必备证件，开户、签合同均需
2. **办理RUT（税务登记）**：自由职业者和商业活动向DIAN申请，必不可少
3. **调查居住区安全状况**：各社区治安差异极大，麦德林建议选择埃尔波夫拉多或劳雷莱斯
4. **西班牙语**：外籍人士聚居区以外英语普及率很低，基础西班牙语必不可少
5. **医疗保险**：M签证持有人须加入EPS健康保险；数字游民签证持有人强烈建议购买私人保险
6. **开设银行账户**：持Cédula可在Bancolombia或Davivienda开户

哥伦比亚生活成本低、气候温暖、游民生态完善，是南美洲最具活力的新兴移居目的地之一。使用MoveWorth模拟财务状况，规划您的南美移居计划。

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证申请总览**: [哥伦比亚外交部 – 签证门户（Cancillería）](https://www.cancilleria.gov.co/tramites_servicios/visa)
- **数字游民签证（V – Nómada Digital）**: [Cancillería 官方页面](https://www.cancilleria.gov.co/v/nomadadigital)
- **工作签证（M – Trabajador）**: [Cancillería 官方页面](https://www.cancilleria.gov.co/v/trabajador)
- **移民签证（M – Migrante）**: [Cancillería 官方页面](https://www.cancilleria.gov.co/node/26933)
- **外籍居民管理**: [哥伦比亚移民局（Migración Colombia）](https://www.migracioncolombia.gov.co/)`,
    },
  },
  {
    slug: "visa-gr",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-gr.webp",
    title: {
      ja: "【2026年最新版】ギリシャのビザ・就労許可完全ガイド",
      en: "Greece Visa & Work Permit Complete Guide 2026",
      zh: "【2026年最新版】希腊签证与就业许可完全指南",
    },
    description: {
      ja: "デジタルノマドビザ・ゴールデンビザ・50%所得税控除・アテネ家賃まで、ギリシャ移住を2026年最新データで徹底解説。",
      en: "Digital Nomad Visa, Golden Visa, 50% income tax exemption, and Athens rent — a complete 2026 guide to Greece.",
      zh: "数字游民签证、黄金签证、50%所得税豁免、雅典租金——2026年最新移居希腊完全指南。",
    },
    content: {
      ja: `ギリシャは地中海の温暖な気候・低い生活費・美しい自然景観に加え、近年は外国人向けの充実した優遇税制やデジタルノマドビザを整備し、欧州移住先として急速に人気が高まっています。アテネのフードシーン・テサロニキの活気・エーゲ海の島々と、生活の豊かさが魅力です。

### 主なビザの種類

**デジタルノマドビザ（Digital Nomad Visa）**
2022年導入。ギリシャ国外の企業・クライアントのためにリモートで働く外国人向け。
- 最低月収：**€3,500以上**
- 有効期間：初回**1年間**、さらに1年更新可能（最大2年）
- 配偶者・扶養家族の同行が可能（別途申請）
- 申請先：在外ギリシャ領事館または在日ギリシャ大使館
- 申請費：約€75

**ゴールデンビザ（不動産投資）**
不動産投資によるギリシャ居留許可プログラム（5年ごと更新）。
- アテネ・テサロニキ・ミコノス・サントリーニ・ロドス等主要エリア：**€800,000以上**
- その他地域：**€400,000以上**
- EU域内の移動が可能（シェンゲン圏）
- 原則として就労権なし（事業活動は別途申請が必要）
- 申請費：€2,000（投資家本人）

**EUブルーカード（EU Blue Card）**
ギリシャ企業からの雇用オファーがある高度技能者向け。
- 年収要件：約€30,000以上（職種により異なる）

**一般就労許可（Άδεια Εργασίας）**
ギリシャ企業からの雇用オファーを持つEU/EEA圏外の外国人向け。
- 事前に雇用主がギリシャ労働省に申請

### 優遇税制（2026年）

**新規居住者向け50%所得税控除（Article 5C）**
- 対象：ギリシャに新たに移住して雇用・事業収入を得る外国人（過去5年中少なくとも3年間ギリシャ非居住であること）
- 適用期間：**最初の7年間**
- 控除額：ギリシャ源泉所得の**50%が課税対象外**
- 申請期限：移住年から税務当局に申請

**退職者向け7%一律税率（Article 5B）**
- 対象：外国から年金収入をギリシャに移管して受給する退職者（移住前5年中少なくとも5年間ギリシャ非居住）
- 適用税率：外国源泉所得全体に対して**7%の一律税率**
- 適用期間：最大**15年間**
- 申請費：年間€500

**高額投資家向け定額€100,000課税（Article 5A）**
- 対象：新規ギリシャ居住者で€500,000以上の投資を行う外国人
- 適用：外国源泉所得全体に対して年額**€100,000**の定額課税のみ
- 適用期間：最大**15年間**

### ギリシャの所得税（ENFIA/所得税率表、2026年）

| 課税所得（年額） | 税率 |
|-------------|-----|
| €10,000以下 | 9% |
| €10,001〜€20,000 | 22% |
| €20,001〜€30,000 | 28% |
| €30,001〜€40,000 | 36% |
| €40,001超 | 44% |

**社会保険料（EFKA）**
- 被用者：給与の約**13.87%**
- 雇用主：給与の約**22.29%**
- 自営業者：約**26.95%**（年収に応じて変動）

### 費用の目安

| 項目 | 費用 |
|------|------|
| デジタルノマドビザ申請費 | 約€75 |
| ゴールデンビザ申請費 | €2,000（投資家本人） |
| ゴールデンビザ（家族メンバー各） | €150 |
| 居留許可証発行費（TRP） | €16 |
| 7%退職者税制申請費 | €500/年 |

### アテネの家賃相場（外国人居住エリア）

| エリア | 1LDK | 2LDK |
|-------|------|------|
| コロナキ（Kolonaki・高級住宅街） | €1,200〜2,200 | €1,800〜3,500 |
| エクサルヒア（Exarcheia・アート・文化） | €700〜1,200 | €1,100〜1,800 |
| グリファダ（Glyfada・海辺・外国人人気） | €900〜1,600 | €1,400〜2,500 |
| テサロニキ中心部 | €700〜1,200 | €1,100〜1,800 |

### 月々の生活費目安（アテネ）

- 食費（自炊）：€250〜400
- 外食（タベルナ1食）：€10〜25
- 交通費（地下鉄月定期）：€30
- 光熱費（電気・水道・ガス）：€100〜200
- 民間健康保険（任意）：€80〜200/月

**合計目安：月€1,000〜2,000（都市部・一人暮らし）**

### 移住前のチェックポイント

1. **AFM（税務番号）の取得**：ギリシャ税務署（AADE）で申請。銀行口座開設・不動産取引・各種契約に必須
2. **AMKA（社会保障番号）の取得**：医療・社会保険サービスの利用に必要
3. **優遇税制の申請期限**：50%控除（Art.5C）・退職者7%（Art.5B）ともに、移住年の確定申告時までに申請
4. **住宅探し**：アテネ・テサロニキは家賃が上昇傾向。エーゲ海の島々はシーズンオフが狙い目
5. **居留許可証（TRP）の取得**：デジタルノマドビザ到着後に申請。€16で発行
6. **語学**：観光地は英語対応が充実。日常生活・行政手続きではギリシャ語が必要な場面も

ギリシャは欧州の中でも生活コストが低く、日本人にも人気の高い移住先のひとつです。MoveWorthで税制・生活費のシミュレーションを行い、地中海移住を検討してみてください。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [ギリシャ移民・庇護省 公式サイト](https://migration.gov.gr/en/)
- **ビザ・在留許可申請ポータル**: [ギリシャ移民省 – オンライン申請ポータル](https://applications.migration.gov.gr/en/)
- **ゴールデンビザ（不動産投資）**: [ギリシャ移民・庇護省 – ゴールデンビザ](https://migration.gov.gr/en/golden-visa/)`,
      en: `Greece has rapidly become one of Europe's most attractive destinations for expats, digital nomads, and retirees — offering a warm Mediterranean climate, low cost of living, and some of the most generous tax incentives in the EU.

### Main Visa Types

**Digital Nomad Visa**
Introduced in 2022 for remote workers serving clients or employers outside Greece.
- Minimum monthly income: **€3,500+**
- Validity: **1 year**, renewable for a further year (maximum 2 years)
- Spouse and dependents can accompany (separate application required)
- Apply at a Greek consulate or embassy in your home country
- Application fee: ~€75

**Golden Visa (Real Estate Investment)**
Investor residency program through real estate (renewed every 5 years).
- Athens, Thessaloniki, Mykonos, Santorini, Rhodes, and other major areas: **€800,000+**
- Other regions: **€400,000+**
- Grants Schengen/EU travel rights
- No right to work (business activities require a separate permit)
- Application fee: €2,000 (main applicant); €150 per family member

**EU Blue Card**
For highly skilled professionals with a Greek job offer.
- Annual salary threshold: ~€30,000+ (varies by occupation)

**General Work Permit (Άδεια Εργασίας)**
For non-EU/EEA nationals with a Greek job offer. The employer applies first through the Ministry of Labor.

### Tax Incentives (2026)

**50% Income Tax Exemption for New Residents (Article 5C)**
- For foreigners newly relocating to Greece for employment or business (must not have been Greek tax residents for at least 3 of the previous 5 years)
- Duration: **first 7 years** in Greece
- **50% of Greek-sourced income** is excluded from taxation
- Apply to the tax authority in the year of relocation

**Flat 7% Tax for Retirees (Article 5B)**
- For pensioners transferring their tax residency to Greece (must not have been Greek resident for 5+ of the 6 years prior to relocation)
- A **flat 7% tax rate** on all foreign-sourced pension income
- Duration: up to **15 years**
- Annual fee: €500

**Flat €100,000 Annual Tax for High-Net-Worth Individuals (Article 5A)**
- For new Greek residents who invest €500,000+ in qualifying assets
- A flat **€100,000/year** covers all tax on foreign-sourced income
- Duration: up to **15 years**

### Greek Income Tax (2026)

| Annual Taxable Income | Rate |
|----------------------|------|
| Up to €10,000 | 9% |
| €10,001–€20,000 | 22% |
| €20,001–€30,000 | 28% |
| €30,001–€40,000 | 36% |
| Above €40,000 | 44% |

**Social Insurance (EFKA)**
- Employee: ~**13.87%** of gross salary
- Employer: ~**22.29%** of gross salary
- Self-employed: ~**26.95%** (varies by income)

### Cost Overview

| Item | Cost |
|------|------|
| Digital Nomad Visa fee | ~€75 |
| Golden Visa fee (main applicant) | €2,000 |
| Golden Visa fee (each family member) | €150 |
| Residence permit card (TRP) | €16 |
| Retiree 7% tax regime annual fee | €500/year |

### Rent in Athens' Expat-Friendly Neighbourhoods

| Area | 1BR | 2BR |
|------|-----|-----|
| Kolonaki (upscale, central) | €1,200–2,200 | €1,800–3,500 |
| Exarcheia (arts/culture, more affordable) | €700–1,200 | €1,100–1,800 |
| Glyfada (seaside, popular with expats) | €900–1,600 | €1,400–2,500 |
| Thessaloniki city centre | €700–1,200 | €1,100–1,800 |

### Monthly Living Costs (Athens)

- Groceries (home cooking): €250–400
- Taverna meal (eating out): €10–25 per person
- Monthly metro pass: €30
- Utilities (electricity, water, gas): €100–200
- Private health insurance (optional): €80–200/month

**Total estimate: €1,000–2,000/month (single person, urban)**

### Pre-Move Checklist

1. **Get your AFM (Tax Number)**: Issued by AADE (Greek tax authority) — required for banking, property, and contracts
2. **Get your AMKA (Social Security Number)**: Required for healthcare and social insurance
3. **Apply for tax incentive schemes on time**: Both Art. 5C (50% exemption) and Art. 5B (7% retiree rate) must be applied for in the year of relocation
4. **Housing research**: Athens and Thessaloniki rents are rising. Aegean islands offer good off-season value
5. **Get your TRP residence permit card**: Apply after arriving on your Digital Nomad Visa. Fee: €16
6. **Language**: English is widely spoken in tourist areas; Greek is helpful for bureaucratic processes and daily life

Greece offers one of Europe's lowest costs of living combined with an exceptional quality of life. Use MoveWorth to simulate your tax burden and living costs before making the move to the Mediterranean.

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits General**: [Greek Ministry of Migration and Asylum](https://migration.gov.gr/en/)
- **Visa & Residence Permit Applications**: [Greek Ministry of Migration – Online Application Portal](https://applications.migration.gov.gr/en/)
- **Golden Visa (Real Estate Investment)**: [Greek Ministry of Migration – Golden Visa](https://migration.gov.gr/en/golden-visa/)`,
      zh: `希腊以地中海温暖的气候、低廉的生活成本和日益完善的外籍人士优惠税制，迅速成为欧洲最受欢迎的移居目的地之一，尤其受到数字游民、退休人士和高净值人士青睐。

### 主要签证类型

**数字游民签证**
2022年推出，适用于为希腊境外企业或客户远程工作的外籍人士。
- 最低月收入：**€3,500以上**
- 有效期：初次**1年**，可续签1年（最长2年）
- 配偶及受抚养人可同行（需单独申请）
- 申请地点：驻外希腊领事馆
- 申请费：约€75

**黄金签证（房产投资）**
通过房产投资获得希腊居留许可（每5年续签）。
- 雅典、塞萨洛尼基、米科诺斯、圣托里尼、罗德岛等主要区域：**€800,000以上**
- 其他地区：**€400,000以上**
- 享有申根区/欧盟境内旅行权
- 原则上无工作权（商业活动须另行申请）
- 申请费：€2,000（申请人本人），每位家庭成员€150

**EU蓝卡**
适用于持有希腊企业工作邀约的高技能专业人士。
- 年薪门槛：约€30,000以上（视职业而定）

**一般就业许可（Άδεια Εργασίας）**
适用于持有希腊企业工作邀约的非欧盟/欧洲经济区外籍人士，由雇主向劳工部提交申请。

### 税收优惠制度（2026年）

**新居民所得税50%豁免（第5C条）**
- 适用于新迁居希腊并从事就业或商业活动的外籍人士（过去5年内至少3年非希腊税务居民）
- 适用期：**最初7年**
- **希腊来源收入的50%**免于征税
- 须在迁居当年向税务局申请

**退休人员7%固定税率（第5B条）**
- 适用于将税务居所迁至希腊的退休人员（迁居前6年中至少5年非希腊居民）
- 境外养老金收入适用**7%固定税率**
- 适用期：最长**15年**
- 年费：€500

**高净值人士€10万定额税制（第5A条）**
- 适用于在希腊投资€50万以上的新居民
- 境外来源收入仅缴纳年额**€100,000**固定税款
- 适用期：最长**15年**

### 希腊所得税（2026年）

| 年应税收入 | 税率 |
|---------|-----|
| €10,000以下 | 9% |
| €10,001〜€20,000 | 22% |
| €20,001〜€30,000 | 28% |
| €30,001〜€40,000 | 36% |
| €40,000以上 | 44% |

**社会保险（EFKA）**
- 雇员：工资的约**13.87%**
- 雇主：工资的约**22.29%**
- 自雇人员：约**26.95%**（视收入而定）

### 费用参考

| 项目 | 费用 |
|------|------|
| 数字游民签证费 | 约€75 |
| 黄金签证费（申请人本人） | €2,000 |
| 黄金签证费（每位家庭成员） | €150 |
| 居留许可证（TRP） | €16 |
| 退休人员7%税制年费 | €500/年 |

### 雅典外籍人士聚居区租金

| 区域 | 1居室 | 2居室 |
|------|------|------|
| 科洛纳基区（Kolonaki，高档中心区） | €1,200〜2,200 | €1,800〜3,500 |
| 埃克萨尔基亚区（Exarcheia，文艺氛围） | €700〜1,200 | €1,100〜1,800 |
| 格利法达区（Glyfada，海滨，外籍人士聚居） | €900〜1,600 | €1,400〜2,500 |
| 塞萨洛尼基市中心 | €700〜1,200 | €1,100〜1,800 |

### 月生活费参考（雅典）

- 伙食费（自炊）：€250〜400
- 外出就餐（酒馆）：每人€10〜25
- 地铁月票：€30
- 水电煤气费：€100〜200
- 私人医疗保险（可选）：€80〜200/月

**月生活费合计：约€1,000〜2,000（城市单人）**

### 移居前注意事项

1. **申请AFM（税务号码）**：由AADE（希腊税务局）签发，银行开户、房产交易、各类合同必备
2. **申请AMKA（社会保障号码）**：医疗和社会保险服务必备
3. **及时申请税收优惠**：50%豁免（5C条）和7%退休税率（5B条）均须在迁居当年申请
4. **提前寻房**：雅典和塞萨洛尼基租金上涨；爱琴海岛屿淡季性价比高
5. **领取TRP居留证**：持数字游民签证入境后申请，费用€16
6. **语言**：旅游地区英语通用，行政事务和日常生活建议了解基础希腊语

希腊是欧洲生活成本最低的国家之一，生活品质极高，深受日本人喜爱。使用MoveWorth模拟税负和生活成本，从容规划您的地中海移居计划。

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [希腊移民与庇护部官方网站](https://migration.gov.gr/en/)
- **签证及居留许可在线申请**: [希腊移民部 – 在线申请门户](https://applications.migration.gov.gr/en/)
- **黄金签证（房地产投资）**: [希腊移民与庇护部 – 黄金签证](https://migration.gov.gr/en/golden-visa/)`,
    },
  },
  {
    slug: "visa-it",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-it.webp",
    title: {
      ja: "【2026年最新版】イタリアのビザ・就労許可完全ガイド",
      en: "Italy Visa & Work Permit Complete Guide 2026",
      zh: "【2026年最新版】意大利签证与就业许可完全指南",
    },
    description: {
      ja: "デジタルノマドビザ・インパトリエイト税制50%控除・ミラノ家賃まで、イタリア移住を2026年最新データで徹底解説。",
      en: "Digital Nomad Visa, 50% Impatriates tax exemption, and Milan rent — a complete 2026 guide to living and working in Italy.",
      zh: "数字游民签证、50%移居者税收豁免、米兰租金——2026年最新移居意大利完全指南。",
    },
    content: {
      ja: `イタリアは美食・芸術・歴史的景観で世界的に有名なだけでなく、近年は外国人向けの充実した優遇税制やデジタルノマドビザを整備し、移住先として注目度が急上昇しています。ミラノのファッション・金融・IT産業、ローマの歴史文化、南部の温暖な気候と豊かな食文化が多様な移住者を引きつけています。

### 主なビザの種類

**デジタルノマドビザ（Visto per Lavoro a Distanza）**
2024年正式導入。イタリア国外の企業・クライアントのためにリモートで働く外国人向け。
- 最低年収：**€28,000以上**（約€2,333/月）
- 有効期間：**1年間**、更新可能
- 自由職業者（フリーランサー）、雇用労働者いずれも申請可能
- 申請先：在外イタリア領事館
- 申請費：約€116

**選択的居住ビザ（Elective Residency Visa）**
イタリアで就労せず、年金・不動産収入・投資収益などパッシブインカムで生活する人向け。
- 必要収入：個人**€31,000/年以上**（家族1名追加ごとに約€20,000追加）
- 就労は一切認められない
- イタリア国内の住居の確保が申請条件

**ゴールデンビザ（Visto per Investitori）**
イタリアへの投資を通じて2年間の居住ビザを取得するプログラム。
- 革新的スタートアップへの投資：**€250,000以上**
- イタリア企業への投資：**€500,000以上**
- イタリア国債への投資：**€2,000,000以上**
- 慈善団体・公益機関への寄付：**€1,000,000以上**
- 政府手数料：€20,000

**EUブルーカード（EU Blue Card）**
イタリア企業からの雇用オファーがある高度技能者向け。
- 年収要件：業種別の国内標準賃金の1.5倍以上（目安：約€35,000〜45,000）

**一般就労ビザ（Nulla Osta al Lavoro）**
イタリア企業からの雇用オファーを持つEU/EEA圏外の外国人向け。
- 毎年一定の割当数（**Decreto Flussi**：フロー令）が設けられる。2024年は68,000件
- 枠の消費が早いため、申請開始日（通常1月）に素早く動く必要あり

### 優遇税制（2026年）

**インパトリエイト税制（Regime degli Impatriati）**
イタリアに移住し就労・事業所得を得る外国人向けの大幅減税制度。2024年改正後の要件：
- 就労・事業収入の**50%が課税対象外**（南部イタリア（カラブリア・カンパニア・バジリカータ・プーリア・シチリア・サルデーニャ）では**60%免税**）
- 適用期間：**5年間**（さらに5年の延長条件：イタリアで家を購入するか子どもが生まれた場合）
- 対象要件：過去**3年間**イタリアに税務居住していないこと（2024年改正で要件強化）
- 特定の業種や研究・新規上場企業等では追加インセンティブあり

**高額所得者向け定額税制（Flat Tax Regime / Articolo 24-bis）**
- 外国源泉所得全体に対して年額**€300,000の定額課税**（2026年〜。2025年は€200,000、旧制度は€100,000）
- 通常の累進課税が完全免除
- 適用期間：最大**15年間**
- 対象：新規居住者で過去10年のうち**9年間**イタリア非居住の者
- ※金額が大幅引き上げられており、費用対効果の計算が重要

### イタリアの所得税（IRPEF、2026年）

| 課税所得（年額） | 税率 |
|-------------|-----|
| €28,000以下 | 23% |
| €28,001〜€50,000 | 35% |
| €50,001超 | 43% |

※地方税（Addizionale IRAP）が別途加算（地域によって約1〜3%）。

**社会保険料（INPS）**
- 被用者：給与の約**9.19%**
- 雇用主：給与の約**28.88%**
- 自営業者（フリーランサー）：収入の約**26.23%**（Gestione Separata）

### 費用の目安

| 項目 | 費用 |
|------|------|
| デジタルノマドビザ申請費 | 約€116 |
| ゴールデンビザ政府手数料 | €20,000 |
| 居留許可証（Permesso di Soggiorno） | €30〜€200 |
| Codice Fiscale（税務番号）取得 | 無料 |

### ミラノ・ローマの家賃相場（外国人居住エリア）

| エリア | 1LDK | 2LDK |
|-------|------|------|
| ミラノ・ポルタ・ヌォーヴァ（Porta Nuova・金融・IT中心） | €2,000〜3,200 | €3,000〜4,800 |
| ミラノ・ナヴィリ（Navigli・外国人人気） | €1,600〜2,500 | €2,400〜3,800 |
| ローマ・パリオリ（Parioli・高級住宅街） | €1,500〜2,800 | €2,500〜4,000 |
| ローマ・トラステヴェレ（Trastevere・外国人人気） | €1,200〜2,000 | €1,800〜3,000 |
| フィレンツェ・オルトラルノ（Oltrarno） | €900〜1,500 | €1,400〜2,200 |

### 月々の生活費目安（ミラノ）

- 食費（自炊）：€350〜550/月
- 外食（トラットリア1食）：€12〜25
- 交通費（ATM月定期）：€35
- 光熱費（電気・ガス・水道）：€120〜220
- 民間健康保険（任意）：€100〜250/月

### 移住前のチェックポイント

1. **Codice Fiscale（税務番号）の取得**：イタリアの税務番号。銀行口座開設・不動産契約・医療機関受診に必須。在外イタリア領事館でも取得可能
2. **Permesso di Soggiorno（居留許可証）の申請**：ビザ到着後**8日以内**に管轄の郵便局（Ufficio Postale）または警察（Questura）に申請
3. **Residenza（住民登録）**：居住地の市区町村（Comune）への住民登録。SSN加入・各種公共サービス利用に必要
4. **インパトリエイト税制の申請**：就業開始年の確定申告（730/Redditi）で申告するだけでOK（事前申請不要）
5. **住宅事情**：ミラノ・ローマは家賃が高騰中。フィレンツェ・ナポリ・南部は大幅にコストを抑えられる
6. **Decreto Flussiの動向確認**：一般就労ビザは年間割当があり申請競争が激しい。毎年1月のclick-dayに素早く対応が必要
7. **SSN（公的医療）への加入**：就労ビザ・長期滞在ビザ保有者はSSNへの加入が可能。デジタルノマドビザ・選択的居住ビザ保有者は民間保険が必要

イタリアは欧州の中でも独自の文化・生活環境を持ち、優れた食文化や芸術に囲まれた生活が魅力です。MoveWorthで税制・生活費のシミュレーションを行い、イタリア移住を検討してみてください。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ申請全般**: [イタリア外務省 – ビザ申請ポータル](https://vistoperitalia.esteri.it/)
- **デジタルノマドビザ**: [イタリア外務省 – 自律的・自営業者ビザ（リモートワーク）](https://www.esteri.it/en/sportello_info/domandefrequenti/sezione_visti_entrare_in_italia/)
- **フラットタックス制度（新規居住者向け）**: [イタリア歳入庁（Agenzia delle Entrate）– フラットタックス](https://www.agenziaentrate.gov.it/portale/web/english/nse/invest-in-italy/tax-regime-for-new-residents)`,
      en: `Italy is world-famous for its cuisine, art, and historic landscapes — but in recent years, it has also built a competitive set of visa options and tax incentives, making it one of Europe's most attractive destinations for expats and remote workers.

### Main Visa Types

**Digital Nomad Visa (Visto per Lavoro a Distanza)**
Formally introduced in 2024, for remote workers serving clients or employers outside Italy.
- Minimum annual income: **€28,000+** (~€2,333/month)
- Validity: **1 year**, renewable
- Both employees and freelancers can apply
- Apply at the Italian consulate in your home country
- Application fee: ~€116

**Elective Residency Visa**
For those who wish to live in Italy without working locally, funded by passive income (pension, rental, investment).
- Minimum income: **€31,000/year** for individuals (~€20,000 per additional family member)
- No employment permitted
- Must secure Italian housing before applying

**Golden Visa (Visto per Investitori)**
Investor residency program with a 2-year initial visa.
- Innovative Italian startup investment: **€250,000+**
- Italian company investment: **€500,000+**
- Italian government bond purchase: **€2,000,000+**
- Charitable/public interest donation: **€1,000,000+**
- Government fee: €20,000

**EU Blue Card**
For highly skilled professionals with a job offer from an Italian employer.
- Minimum salary: 1.5x the applicable national benchmark (approx. €35,000–45,000/year)

**General Work Visa (Nulla Osta al Lavoro)**
For non-EU/EEA nationals with a job offer, subject to annual quotas (**Decreto Flussi**).
- 2024 quota: 68,000 slots. Applications open in January — slots fill within hours on "click day"

### Tax Incentives (2026)

**Impatriates Tax Regime (Regime degli Impatriati)**
Major tax relief for foreigners relocating to Italy for work or business (updated 2024 rules):
- **50% of employment/business income is tax-exempt** (60% in southern Italian regions: Calabria, Campania, Basilicata, Puglia, Sicily, Sardinia)
- Duration: **5 years** (extendable for another 5 years if buying an Italian home or having a child)
- Eligibility: must not have been an Italian tax resident for the previous **3 years** (stricter than the old 2-year rule)

**Flat Tax Regime for High-Net-Worth Individuals (Article 24-bis)**
- A flat **€300,000/year** covers all Italian tax on foreign-sourced income (2026 rate; was €200,000 in 2025, €100,000 prior to that)
- Duration: up to **15 years**
- Eligibility: new residents who were non-residents for at least **9 of the prior 10 years**
- Note: the significantly higher fee means this regime now suits only very high-income earners

### Italian Income Tax (IRPEF, 2026)

| Annual Taxable Income | Rate |
|----------------------|------|
| Up to €28,000 | 23% |
| €28,001–€50,000 | 35% |
| Above €50,000 | 43% |

*Regional surtax (Addizionale IRAP) applies additionally (~1–3% depending on region).*

**Social Insurance (INPS)**
- Employee contribution: ~**9.19%** of gross salary
- Employer contribution: ~**28.88%**
- Self-employed freelancers (Gestione Separata): ~**26.23%**

### Cost Overview

| Item | Cost |
|------|------|
| Digital Nomad Visa fee | ~€116 |
| Golden Visa government fee | €20,000 |
| Permesso di Soggiorno (Residence Permit) | €30–€200 |
| Codice Fiscale (tax number) | Free |

### Rent in Milan & Rome Expat Neighbourhoods

| Area | 1BR | 2BR |
|------|-----|-----|
| Milan – Porta Nuova (finance/tech hub) | €2,000–3,200 | €3,000–4,800 |
| Milan – Navigli (expat favourite) | €1,600–2,500 | €2,400–3,800 |
| Rome – Parioli (upscale) | €1,500–2,800 | €2,500–4,000 |
| Rome – Trastevere (expat favourite) | €1,200–2,000 | €1,800–3,000 |
| Florence – Oltrarno | €900–1,500 | €1,400–2,200 |

### Monthly Living Costs (Milan)

- Groceries (home cooking): €350–550
- Restaurant meal (trattoria): €12–25 per person
- Monthly transit pass (ATM): €35
- Utilities (electricity, gas, water): €120–220
- Private health insurance (optional): €100–250/month

### Pre-Move Checklist

1. **Get your Codice Fiscale (Tax Code)**: Italy's tax ID — essential for banking, contracts, and healthcare. Can be obtained at an Italian consulate abroad
2. **Apply for Permesso di Soggiorno**: Must be applied for **within 8 days of arrival** at the post office (Ufficio Postale) or Questura (police headquarters)
3. **Register Residenza (Residency)**: Register at your local Comune — required for SSN enrollment and public services
4. **Apply for Impatriates Regime**: No pre-approval needed — simply claim the exemption in your annual IRPEF return (Modello 730/Redditi)
5. **Housing**: Milan and Rome rents are high and rising. Florence, Naples, and southern Italy offer significantly lower costs
6. **Monitor Decreto Flussi**: General work visa annual quotas fill within hours of opening — respond quickly in January each year
7. **SSN (National Health Service)**: Available to work visa and long-stay permit holders; Digital Nomad Visa and Elective Residency holders need private insurance

Italy offers a unique blend of culture, quality of life, and competitive tax incentives. Use MoveWorth to simulate your tax burden and living costs before making the move.

---

### References

This article is based on the following official sources.

- **Visa Applications General**: [Italian Ministry of Foreign Affairs – Visa Application Portal](https://vistoperitalia.esteri.it/)
- **Digital Nomad / Remote Work Visa**: [MFA Italy – Self-Employment / Autonomous Worker Visa](https://www.esteri.it/en/sportello_info/domandefrequenti/sezione_visti_entrare_in_italia/)
- **Flat Tax Regime (New Residents)**: [Agenzia delle Entrate – Flat Tax for New Residents](https://www.agenziaentrate.gov.it/portale/web/english/nse/invest-in-italy/tax-regime-for-new-residents)`,
      zh: `意大利以美食、艺术和历史景观闻名于世，近年来还为外籍人士建立了一套颇具竞争力的签证体系和税收优惠制度，成为欧洲最受欢迎的移居目的地之一。

### 主要签证类型

**数字游民签证（Visto per Lavoro a Distanza）**
2024年正式推出，适用于为意大利境外企业或客户远程工作的外籍人士。
- 最低年收入：**€28,000以上**（约€2,333/月）
- 有效期：**1年**，可续签
- 雇员和自由职业者均可申请
- 申请地点：驻外意大利领事馆
- 申请费：约€116

**选择性居留签证**
适用于希望在意大利生活、但不在当地工作的人士（依靠养老金、租金、投资等被动收入）。
- 最低年收入：**€31,000以上**（每增加一名家庭成员约加€20,000）
- 不允许在意大利就业
- 申请前须在意大利落实住房

**黄金签证（Visto per Investitori）**
通过投资获得2年居住签证的投资者计划。
- 投资意大利创新型初创企业：**€250,000以上**
- 投资意大利公司：**€500,000以上**
- 购买意大利国债：**€2,000,000以上**
- 向慈善/公益机构捐款：**€1,000,000以上**
- 政府手续费：€20,000

**EU蓝卡**
适用于持有意大利企业工作邀约的高技能专业人士。
- 最低年薪：适用行业基准工资的1.5倍以上（参考：约€35,000〜45,000）

**一般工作签证（Nulla Osta al Lavoro）**
适用于持有意大利企业工作邀约的非欧盟/欧洲经济区外籍人士，受年度配额（**Decreto Flussi**）限制。
- 2024年配额：68,000个，1月"点击日"开放申请，通常数小时内抢完

### 税收优惠制度（2026年）

**移居者税收优惠制度（Regime degli Impatriati）**
为迁居意大利从事工作或经营的外籍人士提供大幅减税（2024年修订规则）：
- **就业/经营收入的50%免税**（意大利南部地区：卡拉布里亚、坎帕尼亚、巴西利卡塔、普利亚、西西里、撒丁岛为**60%免税**）
- 适用期：**5年**（符合条件可延长5年：在意大利购房或生育子女）
- 资格要求：迁居前**3年**内未为意大利税务居民（2024年修订后要求更严）

**高净值人士固定税率制度（第24-bis条）**
- 境外来源收入仅需缴纳年额**€100,000固定税**，无论金额多少
- 适用期：最长**15年**
- 资格要求：新居民，且过去10年中至少**9年**非意大利税务居民

### 意大利所得税（IRPEF，2026年）

| 年应税收入 | 税率 |
|---------|-----|
| €28,000以下 | 23% |
| €28,001〜€50,000 | 35% |
| €50,000以上 | 43% |

*另需缴纳地区附加税（Addizionale IRAP），约1〜3%不等。*

**社会保险（INPS）**
- 雇员：工资约**9.19%**
- 雇主：工资约**28.88%**
- 自雇自由职业者（Gestione Separata）：收入约**26.23%**

### 费用参考

| 项目 | 费用 |
|------|------|
| 数字游民签证费 | 约€116 |
| 黄金签证政府手续费 | €20,000 |
| 居留许可证（Permesso di Soggiorno） | €30〜€200 |
| Codice Fiscale（税务代码）申请 | 免费 |

### 米兰/罗马外籍人士聚居区租金

| 区域 | 1居室 | 2居室 |
|------|------|------|
| 米兰·波尔塔努奥瓦（Porta Nuova，金融科技中心） | €2,000〜3,200 | €3,000〜4,800 |
| 米兰·纳维利区（Navigli，外籍人士聚居） | €1,600〜2,500 | €2,400〜3,800 |
| 罗马·帕里奥利区（Parioli，高档住宅） | €1,500〜2,800 | €2,500〜4,000 |
| 罗马·特拉斯提弗列（Trastevere，外籍人士聚居） | €1,200〜2,000 | €1,800〜3,000 |
| 佛罗伦萨·奥尔特拉诺区（Oltrarno） | €900〜1,500 | €1,400〜2,200 |

### 月生活费参考（米兰）

- 伙食费（自炊）：€350〜550
- 外出就餐（小馆子）：每餐€12〜25
- 交通月票（ATM）：€35
- 水电煤气费：€120〜220
- 私人医疗保险（可选）：€100〜250/月

### 移居前注意事项

1. **申请Codice Fiscale（税务代码）**：开户、签合同、就医必备。可在驻外意大利领事馆申请
2. **申请Permesso di Soggiorno（居留许可证）**：须在**入境后8天内**在邮局或警察局申请
3. **办理Residenza（居民登记）**：在居住地市政厅（Comune）登记，SSN加入和公共服务使用的前提
4. **申报移居者税收优惠**：无需事先审批，在年度所得税申报（Modello 730/Redditi）中直接申请豁免即可
5. **提前落实住房**：米兰和罗马租金高涨；佛罗伦萨、那不勒斯、南部地区成本大幅降低
6. **关注Decreto Flussi动态**：一般工作签证年度配额在1月开放，通常数小时内抢完，须提前准备
7. **SSN公共医疗**：工作签证和长期居留许可持有人可加入；数字游民签证和选择性居留签证持有人须购买私人保险

意大利融合了独特的文化魅力、优质的生活环境与竞争力极强的税收优惠。使用MoveWorth模拟税负和生活成本，从容规划您的意大利移居计划。

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证申请总览**: [意大利外交部 – 签证申请门户](https://vistoperitalia.esteri.it/)
- **数字游民/远程工作签证**: [意大利外交部 – 自雇/自主工作签证](https://www.esteri.it/en/sportello_info/domandefrequenti/sezione_visti_entrare_in_italia/)
- **统一税制（新居民）**: [意大利税务局（Agenzia delle Entrate）– 新居民统一税](https://www.agenziaentrate.gov.it/portale/web/english/nse/invest-in-italy/tax-regime-for-new-residents)`,
    },
  },
  {
    slug: "visa-mt",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-mt.webp",
    title: {
      ja: "【2026年最新版】マルタのビザ・就労許可完全ガイド｜ノマドビザ・MPRP・非居住者税制",
      en: "Malta Visa & Work Permit Complete Guide 2026 | Nomad Permit, MPRP, Non-Dom Tax",
      zh: "【2026年最新】马耳他签证与就业许可完全指南｜游民居留、MPRP、非居民税制",
    },
    description: {
      ja: "ノマド居住許可（月€3,500）・シングルパーミット・MPRP投資移住・Global Residence Programme（15%フラット税）まで、2026年最新データでマルタ移住を完全解説。外国人エリアの家賃相場・社会保険・費用一覧付き。",
      en: "Nomad Residence Permit (€3,500/mo), Single Permit, MPRP investor residency, Global Residence Programme (15% flat tax) — Malta 2026 complete guide with expat-area rents, social insurance, and full fee tables.",
      zh: "游民居留许可（月€3,500）、单一许可证、MPRP投资居留、全球居民计划（15%统一税）——2026年最新马耳他移居完全指南，含外籍人士聚居区租金、社保及费用一览。",
    },
    content: {
      ja: `マルタはEU加盟の地中海の島国で、英語が公用語、温暖な気候、外国人に有利な非居住者税制を持つことから、欧州移住先として高い人気を誇ります。デジタルノマド・高度技能者・投資家の三者すべてに適した制度が揃っており、年間300日以上の晴天と英語が通じる環境から、アジア系移住者にも選ばれています。

### 主なビザ・居住許可の種類

**ノマド・レジデンス・パーミット（デジタルノマドビザ）** ｜ [Residency Malta 公式ページ](https://nomad.residencymalta.gov.mt/)
マルタ国外の企業・クライアントのためにリモートで働く非EU国籍者向け。
- 最低月収：**€3,500以上**（年収€42,000以上）※2024年4月に€2,700から引き上げ
- 有効期間：1年間、更新可能
- 家族の同伴帯同も可能（配偶者・扶養子女）

**シングル・パーミット（就労居住統合許可）** ｜ [Identità 公式ページ](https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/single-permit/)
マルタ企業からの雇用オファーを持つ非EU国籍者向け。
- 雇用主（マルタ法人）がスポンサーとして申請
- 有効期間：最長2年、更新可能
- 申請はJobsPlus（雇用当局）に提出

**キー・エンプロイー・イニシアティブ（KEI）**
金融・ゲーミング・航空・医療・IT等の主要産業に従事する高度技能者向けの優遇ルート。
- 最低年収：€30,000以上
- 通常のシングル・パーミットより処理が迅速

**マルタ永住権プログラム（MPRP）**
投資による永住権取得プログラム。マルタ政府の主要財源の一つ。
- 政府拠出金：€98,000以上（ゴゾ島・南部マルタ：€68,000以上）
- 不動産購入：€300,000以上（賃貸の場合：€10,000/年以上）
- 慈善寄付：€2,000以上（登録NGOへ）
- 申請費（代理人費除く）：€10,000

### 税制の詳細

**個人所得税（累進課税）**

| 課税所得（€） | 税率 |
|------------|------|
| 0〜9,100 | 0% |
| 9,101〜14,500 | 15% |
| 14,501〜19,500 | 25% |
| 19,501〜60,000 | 25% |
| 60,001以上 | 35% |

**ノン・ドム（Non-Domiciled）税制**
- マルタに送金した外国所得にのみ課税
- 未送金の外国所得・キャピタルゲインは非課税
- 最低税額：年€5,000（EU市民は適用外）

**グローバル・レジデンス・プログラム（GRP）**
- マルタに送金した外国源泉所得に対して**15%の優遇フラット税率**
- 最低税額：年€15,000
- 対象：非EU・EEA国籍者で、マルタで主な居住を行う者

### 社会保険（National Insurance）

| 種別 | 料率 |
|------|------|
| 被雇用者 | 週収の10%（上限あり） |
| 雇用主 | 週収の10%（上限あり） |
| 自営業者 | 年収の15%（上限あり） |

ノマド・レジデンス・パーミット保有者はマルタの社会保険非加入のため、民間の国際健康保険への加入が実質必須。

### 外国人居住エリアの家賃相場（2026年）

| エリア | 物件タイプ | 月額賃料 |
|--------|-----------|---------|
| スリーマ（外国人多数） | 2BR | €1,200〜1,800 |
| セント・ジュリアンズ（ナイトライフ中心） | 2BR | €1,300〜2,000 |
| バレッタ旧市街 | 2BR | €1,400〜2,200 |
| ゴゾ島（静かな環境） | 2BR | €600〜1,000 |

スリーマ・セント・ジュリアンズは外国人コミュニティが集中し英語が完全に通じる一方、ゴゾ島は家賃が約半額でテレワーカーに人気。

### 費用一覧

| 項目 | 費用 |
|------|------|
| ノマド・レジデンス・パーミット申請費 | €300 |
| シングル・パーミット申請費 | €280 |
| KEI申請手数料 | €200〜300 |
| MPRP政府申請費 | €10,000 |
| eResidency登録 | 無料 |

### 移住前チェックリスト

1. **Identity Maltaへの登録**：eResidency登録後、在留カード（Residence Card）を取得。銀行・契約・医療機関すべてに必要
2. **銀行口座開設**：BOV（Bank of Valletta）・HSBC Malta・APS Bankが主要行。非居住者の口座開設は提出書類が多めなので事前準備を
3. **健康保険の手配**：ノマドビザ保有者は民間の国際健康保険（最低€30,000補償）が申請要件。EU市民はEHIC活用可
4. **車の必要性**：スリーマ・バレッタは徒歩圏内でこと足りるが、ゴゾ島・内陸部への移動には車が便利
5. **英語環境**：公用語が英語のため、EU内で最も英語が通じる国の一つ。子女の英語教育にも最適

MoveWorthでマルタの生活費・税負担をシミュレーションしてみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ノマド・レジデンス・パーミット**: [Residency Malta – Nomad Residence Permit](https://nomad.residencymalta.gov.mt/)
- **シングル・パーミット（就労）**: [Identità – Single Permit](https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/single-permit/)
- **マルタ永住プログラム（MPRP）**: [Residency Malta Agency 公式サイト](https://residencymalta.gov.mt/)
- **グローバル居住プログラム（GRP）**: [CFR – グローバル居住プログラム](https://cfr.gov.mt/en/Pages/CFR/Global-Residence-Programme.aspx)
- **ビザ・在留許可全般**: [Identità – 在留許可](https://identita.gov.mt/)`,
      en: `Malta is a small EU island nation in the Mediterranean with English as an official language, a warm climate, and a highly tax-friendly non-dom system. With over 300 sunny days a year and full English-language services, it has become one of the most popular relocation destinations in Europe for digital nomads, skilled professionals, and investors alike.

### Main Visa & Permit Types

**Nomad Residence Permit** ｜ [Residency Malta Official Page](https://nomad.residencymalta.gov.mt/)
For remote workers serving clients or employers outside Malta.
- Minimum monthly income: **€3,500+** (€42,000/year) — raised from €2,700 in April 2024
- Validity: 1 year, renewable
- Family members (spouse and dependent children) can be included

**Single Permit** ｜ [Identità Official Page](https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/single-permit/)
Combined work and residence permit for non-EU nationals employed by a Maltese company.
- Employer (Maltese entity) sponsors the application through JobsPlus
- Validity: up to 2 years, renewable

**Key Employee Initiative (KEI)**
Fast-track route for highly skilled professionals in finance, iGaming, aviation, healthcare, or IT.
- Minimum annual salary: €30,000+
- Faster processing than the standard Single Permit

**Malta Permanent Residence Programme (MPRP)**
Residency by investment — one of the EU's most sought-after schemes.
- Government contribution: €98,000+ (South Malta / Gozo: €68,000+)
- Property purchase: €300,000+ (or rental: €10,000/year+)
- Philanthropic donation: €2,000+ to a registered NGO
- Application fee: €10,000

### Tax System in Detail

**Personal Income Tax (Progressive)**

| Taxable Income (€) | Rate |
|--------------------|------|
| 0–9,100 | 0% |
| 9,101–14,500 | 15% |
| 14,501–60,000 | 25% |
| Above 60,000 | 35% |

**Non-Domiciled (Non-Dom) Tax Status**
- Only foreign income remitted to Malta is taxed
- Unremitted foreign income and capital gains are exempt
- Minimum annual tax: €5,000

**Global Residence Programme (GRP)**
- Flat **15% tax rate** on foreign-sourced income remitted to Malta
- Minimum annual tax: €15,000
- For non-EU/EEA nationals who make Malta their primary residence

### Social Insurance (National Insurance)

| Category | Rate |
|----------|------|
| Employee | 10% of weekly earnings (capped) |
| Employer | 10% of weekly earnings (capped) |
| Self-Employed | 15% of annual income (capped) |

Nomad Residence Permit holders are not enrolled in Maltese social insurance — private international health insurance (minimum €30,000 coverage) is required.

### Expat-Area Rents (2026)

| Area | Type | Monthly Rent |
|------|------|-------------|
| Sliema (expat hub) | 2BR | €1,200–1,800 |
| St Julian's (nightlife area) | 2BR | €1,300–2,000 |
| Valletta (historic city centre) | 2BR | €1,400–2,200 |
| Gozo Island (quiet, affordable) | 2BR | €600–1,000 |

Sliema and St Julian's are the main expat hubs with a full English-speaking environment. Gozo offers roughly half the rent and is favoured by remote workers seeking a quieter lifestyle.

### Fee Table

| Item | Cost |
|------|------|
| Nomad Residence Permit | €300 |
| Single Permit | €280 |
| KEI application | €200–300 |
| MPRP application fee | €10,000 |
| eResidency registration | Free |

### Pre-Move Checklist

1. **Identity Malta registration**: Register for eResidency, then obtain your Residence Card — required for banking, contracts, and healthcare
2. **Open a bank account**: Main banks are Bank of Valletta (BOV), HSBC Malta, and APS Bank. Non-residents face document-heavy onboarding — prepare certified copies in advance
3. **Health insurance**: Nomad visa holders must have private international health cover (min €30,000) as part of the application; EU citizens can use the EHIC
4. **Transport**: Sliema and Valletta are walkable, but a car is useful for Gozo and inland areas
5. **English environment**: One of the few EU countries where English is a fully official language — ideal for children's education and daily life

Use MoveWorth to simulate your tax burden and living costs in Malta.

---

### References

This article is based on the following official sources.

- **Nomad Residence Permit**: [Residency Malta – Nomad Residence Permit](https://nomad.residencymalta.gov.mt/)
- **Single Permit (Employment)**: [Identità – Single Permit](https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/single-permit/)
- **Malta Permanent Residence Programme (MPRP)**: [Residency Malta Agency](https://residencymalta.gov.mt/)
- **Global Residence Programme (GRP)**: [CFR – Global Residence Programme](https://cfr.gov.mt/en/Pages/CFR/Global-Residence-Programme.aspx)
- **Visas & Residence Permits General**: [Identità – Residence Permits](https://identita.gov.mt/)`,
      zh: `马耳他是地中海上的欧盟小岛国，英语为官方语言，气候温暖，拥有极为优惠的非居民税制。每年超过300个晴天、全英语服务环境，使其成为欧洲最受数字游民、技术人才和投资者青睐的移居目的地之一。

### 主要签证与居留许可类型

**游民居留许可（数字游民签证）** ｜ [Residency Malta 官方页面](https://nomad.residencymalta.gov.mt/)
适用于为马耳他境外雇主或客户远程工作的非欧盟公民。
- 最低月收入：**€3,500以上**（年收入€42,000）※2024年4月从€2,700上调
- 有效期：1年，可续签
- 可携带配偶及受抚养子女同行

**单一许可（就业居留综合许可）** ｜ [Identità 官方页面](https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/single-permit/)
适用于持有马耳他企业录用通知的非欧盟公民。
- 由马耳他法人雇主通过JobsPlus申请
- 有效期：最长2年，可续签

**关键员工计划（KEI）**
面向金融、游戏、航空、医疗、IT等核心行业高技能人才的快速通道。
- 最低年薪：€30,000以上
- 审批速度快于标准单一许可

**马耳他永久居留计划（MPRP）**
投资移居项目，是欧盟最受欢迎的居留项目之一。
- 政府贡献金：€98,000以上（南部马耳他/戈佐岛：€68,000以上）
- 购置房产：€300,000以上（租赁：€10,000/年以上）
- 慈善捐款：€2,000以上（向注册非政府组织）
- 申请费：€10,000

### 税制详解

**个人所得税（累进税率）**

| 应税收入（€） | 税率 |
|-------------|------|
| 0〜9,100 | 0% |
| 9,101〜14,500 | 15% |
| 14,501〜60,000 | 25% |
| 60,000以上 | 35% |

**非居民（Non-Dom）税制**
- 仅对汇入马耳他的境外收入征税
- 未汇入的境外收入及资本利得免税
- 最低年税额：€5,000

**全球居民计划（GRP）**
- 汇入马耳他的境外收入适用**15%统一优惠税率**
- 最低年税额：€15,000
- 适用于以马耳他为主要居住地的非欧盟/欧洲经济区公民

### 社会保险（国民保险）

| 类别 | 费率 |
|------|------|
| 雇员 | 周收入的10%（有上限） |
| 雇主 | 周收入的10%（有上限） |
| 自雇人士 | 年收入的15%（有上限） |

游民居留许可持有人不参与马耳他社会保险体系，须购买私人国际健康保险（最低保额€30,000）。

### 外籍人士聚居区租金行情（2026年）

| 地区 | 房型 | 月租金 |
|------|------|--------|
| 斯利马（外籍人士聚集地） | 两居室 | €1,200〜1,800 |
| 圣朱利安斯（娱乐中心） | 两居室 | €1,300〜2,000 |
| 瓦莱塔旧城区 | 两居室 | €1,400〜2,200 |
| 戈佐岛（宁静实惠） | 两居室 | €600〜1,000 |

斯利马和圣朱利安斯是外籍人士社区最集中的地区，全英语环境，生活便利；戈佐岛租金约为本岛一半，深受远程工作者青睐。

### 费用一览

| 项目 | 费用 |
|------|------|
| 游民居留许可申请费 | €300 |
| 单一许可申请费 | €280 |
| KEI申请费 | €200〜300 |
| MPRP政府申请费 | €10,000 |
| 电子居民登记 | 免费 |

### 移居前检查清单

1. **Identity Malta登记**：完成电子居民注册后领取居留卡，银行开户、签订合同及医疗机构就诊均需此卡
2. **开立银行账户**：主要银行有马耳他银行（BOV）、汇丰马耳他、APS Bank。非居民开户手续较繁琐，建议提前准备认证文件
3. **医疗保险**：游民签证申请人须持有私人国际健康保险（最低保额€30,000）；欧盟公民可使用欧洲健康保险卡（EHIC）
4. **出行方式**：斯利马和瓦莱塔步行可达，但前往戈佐岛和内陆地区需要驾车
5. **英语环境**：欧盟中少数以英语为完全官方语言的国家，非常适合子女英语教育及日常生活

使用MoveWorth模拟您在马耳他的税负和生活成本。

---

### 参考资料

本文信息基于以下官方资料整理。

- **游民居留许可（数字游民）**: [Residency Malta – Nomad Residence Permit](https://nomad.residencymalta.gov.mt/)
- **单一许可（就业）**: [Identità – Single Permit](https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/employment-related-permits/single-permit/)
- **马耳他永久居留项目（MPRP）**: [Residency Malta Agency 官方网站](https://residencymalta.gov.mt/)
- **全球居住项目（GRP）**: [CFR – 全球居住项目](https://cfr.gov.mt/en/Pages/CFR/Global-Residence-Programme.aspx)
- **签证及居留许可总览**: [Identità – 居留许可](https://identita.gov.mt/)`,
    },
  },
  {
    slug: "visa-za",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-za.webp",
    title: {
      ja: "【2026年最新版】南アフリカのビザ・就労許可完全ガイド｜クリティカルスキル・退職者・税金",
      en: "South Africa Visa & Work Permit Complete Guide 2026 | Critical Skills, Retired Persons, Tax",
      zh: "【2026年最新】南非签证与就业许可完全指南｜关键技能、退休人员签证、税制",
    },
    description: {
      ja: "クリティカルスキルビザ（求人不要）・ポイント制一般就労ビザ（2024年10月改定）・退職者ビザ（ZAR 37,000/月）まで、2026年最新データで南アフリカ移住を完全解説。外国人居住エリアの家賃相場・外国所得免税・費用一覧付き。",
      en: "Critical Skills Work Visa (no job offer needed), points-based General Work Visa (updated Oct 2024), Retired Persons Visa (ZAR 37,000/mo) — South Africa 2026 complete guide with expat-area rents, foreign income exemption, and full fee tables.",
      zh: "关键技能工作签证（无需工作邀约）、积分制普通工作签证（2024年10月更新）、退休人员签证（ZAR 37,000/月）——2026年最新南非移居完全指南，含外籍人士聚居区租金、境外收入免税及费用一览。",
    },
    content: {
      ja: `南アフリカはアフリカ大陸最大の経済圏のひとつで、ケープタウン・ヨハネスブルクなどの国際都市を擁します。英語が広く通じ、豊かな自然環境と比較的安い物価、そして技能者向けに整備されたビザ制度が魅力です。2024年10月の制度改定でポイント制が導入され、申請の透明性が向上しました。

### 主なビザの種類

**クリティカルスキルワークビザ（Critical Skills Work Visa）** ｜ [DHA 公式ページ](https://www.dha.gov.za/index.php/immigration-services/scarce-skills-work-permits)
政府が定める「クリティカルスキルリスト」（IT・エンジニアリング・医療・金融・教育等）に該当する専門家向け。
- **雇用オファーなしでも申請可能**（南アフリカ独自の強み）
- 有効期間：3年、更新可能
- 取得後、5年居住で永住権（Permanent Residence）申請可

**一般就労ビザ（General Work Visa）** ｜ [DHA 公式ページ](https://www.dha.gov.za/index.php/immigration-services/types-of-visas#generalwork-visa)
クリティカルスキルリスト外の職種でも南アフリカ企業から雇用オファーがあれば申請可能。
- 「適切な南アフリカ市民が存在しない」ことの証明が必要（労働市場テスト）
- **2024年10月18日より**：ポイント制審査（100点満点）を正式導入。学歴・職歴・語学・年収等が評価対象
- 有効期間：最長5年

**ビジネスビザ（Business Visa）** ｜ [DHA 公式ページ](https://www.dha.gov.za/index.php/immigration-services/types-of-visas#business-visa)
南アフリカで事業を起こす・投資する外国人向け。
- 最低投資額：**ZAR 5,000,000以上**（一部業種は免除あり）
- 雇用義務：南アフリカ市民を60%以上雇用すること
- 有効期間：最長3年、更新可能
- 取得後、5年居住で永住権申請可

**企業内転勤許可（Intra-Company Transfer Permit）**
多国籍企業の従業員を南アフリカの現地法人に派遣する場合。
- 有効期間：最長4年（更新不可）

**退職者ビザ（Retired Persons Visa）**
- 最低月収：**ZAR 37,000**相当の年金・投資収入の証明が必要
- 就労は一切禁止
- 家族の同伴帯同可能

### 税制の詳細

**個人所得税（累進課税）**

| 課税所得（ZAR） | 税率 |
|--------------|------|
| 0〜237,100 | 18% |
| 237,101〜370,500 | 26% |
| 370,501〜512,800 | 31% |
| 512,801〜673,000 | 36% |
| 673,001〜857,900 | 39% |
| 857,901〜1,817,000 | 41% |
| 1,817,001以上 | 45% |

**外国所得免税（Foreign Employment Income Exemption）**
- 暦年内に183日以上（うち連続60日以上）海外で就労した居住者は、外国源泉の雇用所得**ZAR 1,250,000まで免税**
- 超過分には通常の累進税率が適用される

**UIF（失業保険基金）**
- 被雇用者：月収の1%（上限：月収ZAR 17,712に対する1%）
- 雇用主：同額を追加負担

### 外国人居住エリアの家賃相場（2026年）

| エリア | 物件タイプ | 月額賃料 |
|--------|-----------|---------|
| ケープタウン Waterfront/Sea Point | 2BR | ZAR 25,000〜40,000 |
| ケープタウン Camps Bay | 2BR | ZAR 30,000〜50,000 |
| ヨハネスブルク Sandton | 2BR | ZAR 18,000〜35,000 |
| ヨハネスブルク Rosebank | 2BR | ZAR 15,000〜28,000 |

ケープタウンのSea Point・Camps Bayはセキュリティが整い外国人に人気の高級エリア。ヨハネスブルクはSandtonがビジネス・金融の中心地でセキュリティ施設（コンパウンド・ゲートコミュニティ）が充実。

### 費用一覧

| 項目 | 費用 |
|------|------|
| クリティカルスキルワークビザ | ZAR 1,520 |
| 一般就労ビザ | ZAR 1,520 |
| 企業内転勤許可 | ZAR 1,520 |
| 退職者ビザ | ZAR 425 |
| 永住権申請 | ZAR 2,850 |

### 移住前チェックリスト

1. **無犯罪証明書（警察証明）の取得**：申請の必須書類。日本で取得の場合は法務省経由でアポスティーユ認証が必要（取得に3〜6週間かかる場合あり）
2. **SAQA学歴評価**：南アフリカ資格局（SAQA）による外国学歴・資格の認定。クリティカルスキルビザの場合は特に重要
3. **医療・X線（胸部レントゲン）報告書**：就労ビザ申請時は指定機関での健康診断書が必要
4. **居住エリアの治安確認**：ゲートコミュニティや警備員付きアパートメントを選ぶことを強く推奨。一般的なエリアと高級エリアの治安差が大きい
5. **銀行口座開設**：Standard Bank・FNB・Nedbank等が主要行。外国人はパスポートと居住許可証で開設可能

MoveWorthで南アフリカの生活費・税負担をシミュレーションしてみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **クリティカルスキルワークビザ**: [DHA – Critical Skills Work Visa](https://www.dha.gov.za/index.php/immigration-services/scarce-skills-work-permits)
- **一般就労ビザ・ビジネスビザ（ビザ種別一覧）**: [DHA – Types of Visas](https://www.dha.gov.za/index.php/immigration-services/types-of-visas)
- **ビザ・在留許可全般**: [南アフリカ内務省（DHA）– 移民サービス](https://www.dha.gov.za/index.php/immigration-services)
- **ビザ申請サービス**: [VFS Global – 南アフリカビザ申請センター](https://www.vfsglobal.com/en/individuals/index.html)`,
      en: `South Africa is one of Africa's largest economies, home to world-class cities like Cape Town and Johannesburg. English is widely spoken, the cost of living is relatively affordable, and the country has a well-structured visa system for skilled professionals. The October 2024 points-based reform brought greater transparency to the application process.

### Main Visa Types

**Critical Skills Work Visa** ｜ [DHA Official Page](https://www.dha.gov.za/index.php/immigration-services/scarce-skills-work-permits)
For professionals on South Africa's government-defined Critical Skills List (IT, engineering, healthcare, finance, education, etc.).
- **No job offer required** — a unique advantage versus most countries
- Validity: 3 years, renewable
- Can apply for Permanent Residence after 5 years of continuous residence

**General Work Visa** ｜ [DHA Official Page](https://www.dha.gov.za/index.php/immigration-services/types-of-visas#generalwork-visa)
For those with a confirmed job offer from a South African employer, even outside the Critical Skills List.
- Employer must prove no suitable South African citizen was available (labour market test)
- **From October 18, 2024**: Official points-based adjudication system introduced (100 points required). Education, work experience, language skills, and salary are all scored
- Validity: up to 5 years

**Business Visa** ｜ [DHA Official Page](https://www.dha.gov.za/index.php/immigration-services/types-of-visas#business-visa)
For foreign nationals starting or investing in a South African business.
- Minimum investment: **ZAR 5,000,000+** (some sectors exempt)
- Employment obligation: at least 60% of staff must be South African citizens
- Validity: up to 3 years, renewable
- Can apply for Permanent Residence after 5 years

**Intra-Company Transfer Permit**
For multinational employees relocating to a South African subsidiary.
- Validity: up to 4 years (non-renewable)

**Retired Persons Visa**
- Minimum monthly income: **ZAR 37,000** from pension, annuity, or investment income
- No employment whatsoever permitted
- Family members may accompany

### Tax System in Detail

**Personal Income Tax (Progressive)**

| Taxable Income (ZAR) | Rate |
|----------------------|------|
| 0–237,100 | 18% |
| 237,101–370,500 | 26% |
| 370,501–512,800 | 31% |
| 512,801–673,000 | 36% |
| 673,001–857,900 | 39% |
| 857,901–1,817,000 | 41% |
| Above 1,817,001 | 45% |

**Foreign Employment Income Exemption**
- South African tax residents who work abroad for more than 183 days (including 60 continuous days) in a 12-month period are exempt on the first **ZAR 1,250,000** of foreign employment income
- Amounts above this threshold are taxed at normal progressive rates

**Unemployment Insurance Fund (UIF)**
- Employee: 1% of monthly earnings (capped at earnings of ZAR 17,712/month)
- Employer: contributes an additional 1%

### Expat-Area Rents (2026)

| Area | Type | Monthly Rent |
|------|------|-------------|
| Cape Town – Waterfront / Sea Point | 2BR | ZAR 25,000–40,000 |
| Cape Town – Camps Bay | 2BR | ZAR 30,000–50,000 |
| Johannesburg – Sandton | 2BR | ZAR 18,000–35,000 |
| Johannesburg – Rosebank | 2BR | ZAR 15,000–28,000 |

Cape Town's Sea Point and Camps Bay are upmarket expat-friendly areas with strong security. In Johannesburg, Sandton is the business and financial hub and offers gated communities with 24-hour security — the standard choice for international professionals.

### Fee Table

| Item | Cost |
|------|------|
| Critical Skills Work Visa | ZAR 1,520 |
| General Work Visa | ZAR 1,520 |
| Intra-Company Transfer Permit | ZAR 1,520 |
| Retired Persons Visa | ZAR 425 |
| Permanent Residence application | ZAR 2,850 |

### Pre-Move Checklist

1. **Police Clearance Certificate**: Mandatory for all visa types. In Japan, obtained through the Ministry of Justice — apostille certification required (allow 3–6 weeks)
2. **SAQA Qualification Evaluation**: The South African Qualifications Authority must certify foreign degrees and credentials — especially important for Critical Skills applications
3. **Medical and Radiology (chest X-ray) Reports**: Required at a designated facility for all work visa applications
4. **Choose secured housing**: Gate communities, security estates, or buildings with 24-hour guarding are strongly recommended; security standards vary significantly by area
5. **Open a bank account**: Standard Bank, FNB, or Nedbank are the main options; foreigners can open accounts with a passport and residence permit

Use MoveWorth to simulate your tax burden and living costs in South Africa.

---

### References

This article is based on the following official sources.

- **Critical Skills Work Visa**: [DHA – Critical Skills Work Visa](https://www.dha.gov.za/index.php/immigration-services/scarce-skills-work-permits)
- **General Work Visa & Business Visa (all visa types)**: [DHA – Types of Visas](https://www.dha.gov.za/index.php/immigration-services/types-of-visas)
- **Visas & Permits General**: [South Africa Department of Home Affairs (DHA) – Immigration Services](https://www.dha.gov.za/index.php/immigration-services)
- **Visa Application Services**: [VFS Global – South Africa Visa Application Centre](https://www.vfsglobal.com/en/individuals/index.html)`,
      zh: `南非是非洲最大的经济体之一，拥有开普敦、约翰内斯堡等国际大都市。英语广泛通用，生活成本相对低廉，并拥有面向技能人才的完善签证体系。2024年10月的制度改革引入积分制审核，提升了申请透明度。

### 主要签证类型

**关键技能工作签证** ｜ [DHA 官方页面](https://www.dha.gov.za/index.php/immigration-services/scarce-skills-work-permits)
适用于政府"关键技能清单"（IT、工程、医疗、金融、教育等）所列职业的专业人士。
- **无需工作邀约即可申请**——在全球主要移居目的地中属罕见优势
- 有效期：3年，可续签
- 连续居住5年后可申请永久居留权

**普通工作签证** ｜ [DHA 官方页面](https://www.dha.gov.za/index.php/immigration-services/types-of-visas#generalwork-visa)
持有南非企业录用邀约的非南非公民均可申请，不限于关键技能清单职业。
- 雇主须证明无合适的南非公民可供录用（劳动力市场测试）
- **2024年10月18日起**：正式引入积分制审核（满分100分），学历、工作经历、语言能力、薪资水平等均纳入评分
- 有效期：最长5年

**商业签证（Business Visa）** ｜ [DHA 官方页面](https://www.dha.gov.za/index.php/immigration-services/types-of-visas#business-visa)
适用于在南非创业或投资的外籍人士。
- 最低投资额：**ZAR 5,000,000以上**（部分行业豁免）
- 雇用义务：须雇用至少60%的南非公民
- 有效期：最长3年，可续签
- 居住满5年后可申请永久居留权

**公司内部调任许可**
适用于跨国公司员工调往南非分支机构。
- 有效期：最长4年（不可续签）

**退休人员签证**
- 最低月收入：**ZAR 37,000**的养老金或投资收入证明
- 严禁从事任何形式的就业活动
- 可携带家属同行

### 税制详解

**个人所得税（累进税率）**

| 应税收入（ZAR） | 税率 |
|--------------|------|
| 0〜237,100 | 18% |
| 237,101〜370,500 | 26% |
| 370,501〜512,800 | 31% |
| 512,801〜673,000 | 36% |
| 673,001〜857,900 | 39% |
| 857,901〜1,817,000 | 41% |
| 1,817,001以上 | 45% |

**境外就业收入免税**
- 在12个月内于境外工作超过183天（含连续60天）的南非税务居民，境外就业收入中**ZAR 1,250,000以内部分免税**
- 超出部分按普通累进税率征税

**失业保险基金（UIF）**
- 雇员：月收入的1%（月收入超过ZAR 17,712部分不计入）
- 雇主：同等比例额外承担

### 外籍人士聚居区租金行情（2026年）

| 地区 | 房型 | 月租金 |
|------|------|--------|
| 开普敦 Waterfront/Sea Point | 两居室 | ZAR 25,000〜40,000 |
| 开普敦 Camps Bay | 两居室 | ZAR 30,000〜50,000 |
| 约翰内斯堡 Sandton | 两居室 | ZAR 18,000〜35,000 |
| 约翰内斯堡 Rosebank | 两居室 | ZAR 15,000〜28,000 |

开普敦Sea Point和Camps Bay是安保完善的高端外籍人士聚居区。约翰内斯堡Sandton是商业金融中心，围墙社区（gated community）及全天候安保设施齐全，是国际专业人士的首选区域。

### 费用一览

| 项目 | 费用 |
|------|------|
| 关键技能工作签证 | ZAR 1,520 |
| 普通工作签证 | ZAR 1,520 |
| 公司内部调任许可 | ZAR 1,520 |
| 退休人员签证 | ZAR 425 |
| 永久居留权申请 | ZAR 2,850 |

### 移居前检查清单

1. **无犯罪记录证明**：所有签证申请的必备材料。在日本通过法务省申请，需附加认证（Apostille），申请周期约3〜6周
2. **SAQA学历认定**：南非资格局须对外国学历及资质进行认证——对关键技能签证申请人尤为重要
3. **体检及胸部X光报告**：申请工作签证时须在指定医疗机构完成体检
4. **选择安保完善的住宅**：强烈建议选择围墙社区、安保公寓或配有24小时门卫的楼盘；不同区域的安全水平差异显著
5. **开立银行账户**：标准银行（Standard Bank）、FNB、Nedbank为主要银行；外籍人士凭护照和居留许可可开户

使用MoveWorth模拟您在南非的税负和生活成本。

---

### 参考资料

本文信息基于以下官方资料整理。

- **关键技能工作签证**: [DHA – Critical Skills Work Visa](https://www.dha.gov.za/index.php/immigration-services/scarce-skills-work-permits)
- **普通工作签证及商业签证（签证类别总览）**: [DHA – Types of Visas](https://www.dha.gov.za/index.php/immigration-services/types-of-visas)
- **签证及居留许可总览**: [南非内政部（DHA）– 移民服务](https://www.dha.gov.za/index.php/immigration-services)
- **签证申请服务**: [VFS Global – 南非签证申请中心](https://www.vfsglobal.com/en/individuals/index.html)`,
    },
  },
  {
    slug: "visa-fi",
    category: "visa",
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-fi.webp",
    date: "2026-03-25",
    readingTime: 15,
    title: {
      ja: "フィンランド ビザ・就労許可完全ガイド【2026年最新版】｜スタートアップ許可・EUブルーカード・税制",
      en: "Finland Visa & Work Permit Guide 2026 | Startup Permit, EU Blue Card, Employed Residence Permit",
      zh: "【2026年最新】芬兰签证与就业许可完全指南｜创业许可、欧盟蓝卡、税制",
    },
    description: {
      ja: "フィンランド ビザ・就労許可の取得方法【2026年最新】：就労者居住許可・スタートアップ許可（Business Finland審査）・EUブルーカード（€3,937/月）まで完全解説。ヘルシンキ外国人エリアの家賃相場・社会保険・費用一覧付き。",
      en: "Finland visa and work permit options 2026: Employed Person's Residence Permit, Startup Permit (Business Finland assessed), EU Blue Card (€3,937/mo) — complete guide with Helsinki expat-area rents, social insurance, and full fee tables.",
      zh: "就业居留许可、创业许可（Business Finland评估）、欧盟蓝卡（€3,937/月）——2026年最新芬兰移居完全指南，含赫尔辛基外籍人士聚居区租金、社保及费用一览。",
    },
    content: {
      ja: `フィンランドは世界最高水準の教育・医療・社会福祉を誇る北欧の国です。世界幸福度報告で数年連続世界1位を記録し、ヘルシンキは生活の質が高い都市として国際的な評価を得ています。近年はスタートアップ拠点としても成長著しく、Slushカンファレンスに代表されるエコシステムが外国人起業家・テック人材を惹きつけています。

### あなたに合ったビザは？

| あなたの状況 | おすすめのビザ |
|------------|-------------|
| フィンランド企業から雇用オファーあり | 就労者居住許可（TTOL） |
| 月収€3,937以上の高度人材 | EUブルーカード |
| Business Finland認定スタートアップ創業 | スタートアップ許可 |
| フリーランサー・独立起業家 | 自営業者居住許可 |
| 観光・短期滞在（90日以内） | シェンゲンビザなし入国 |

### 日本人の短期滞在（観光・ビジネス）

**シェンゲン協定によるビザなし入国**

日本国籍者はシェンゲン協定により、フィンランドを含むシェンゲン加盟国へ**ビザなしで最大90日間**（180日のうち）入国できます。観光・親族訪問・短期ビジネス商談が対象ですが、現地での就労・収入活動は不可です。

**⚠️ 2026年後半：ETIAS（事前渡航認証）が導入予定**

EUは2026年後半にETIAS（European Travel Information and Authorisation System）を導入予定です。日本人旅行者もフィンランドへの渡航前にオンラインで申請し、認証（€7）を取得する必要があります（米国のESTAに相当）。90日間のビザなし滞在自体は変わりませんが、事前手続きが必要になる点に注意してください。

### 主なビザ・居住許可の種類

**就労者居住許可（Employed Person's Residence Permit）** ｜ [Migri 公式ページ](https://migri.fi/en/residence-permit-for-an-employed-person)
フィンランド企業から雇用オファーを受けた非EU国籍者向けの最もポピュラーなルート。
- 雇用主がTE-toimisto（雇用・経済開発事務所）に事前通知
- 申請はEnter Finland（オンラインポータル）経由
- 有効期間：最長2年、更新可能（5年継続居住後に永住権申請可）
- 最低月収：**€1,600以上**（税込、2026年）

**スタートアップ許可（Startup-lupa）** ｜ [Business Finland 公式ページ](https://www.businessfinland.fi/en/do-business-with-finland/startup-in-finland/startup-permit)
Business Finlandが成長ポテンシャルを認定したスタートアップ創業者向け。
- 創業チームは**2名以上**（補完的なスキルを持つ共同創業者が必要）
- 各創業者は会社株式の**60%以上**を保持し、フルタイムで従事すること
- 飲食店・コンサルタント・外国企業の子会社・フィンランド国内市場のみ対象のビジネスは不可
- Business Finlandへの事業申請→適格証明書（Eligibility Statement）の取得が前提（審査：約1ヶ月）
- 申請はEnter Finlandで行う（Fast Track：約2週間）
- 有効期間：2年、更新可能

**EUブルーカード（EU Blue Card）** ｜ [Migri 公式ページ](https://migri.fi/en/eu-blue-card)
高度人材向けの優遇就労許可。
- 最低月収：**€3,937以上**（2026年、平均賃金の1.5倍）
- ※社用車・住宅補助などフリンジベネフィットは最低月収に含まれない
- 有効期間：2年、更新可能

**自営業者居住許可（Self-Employment Residence Permit）** ｜ [Migri 公式ページ](https://migri.fi/en/self-employed-person-s-residence-permit)
フリーランサー・独立起業家向け。
- 事業計画・財務計画・資金証明の提出が必要
- 取引先リスト（クライアント）の提示が求められるケースあり
- 有効期間：初回1年、更新可能

### 就労ビザ申請の流れ（ステップ）

就労者居住許可（TTOL）を例に解説します。

1. **雇用主が事前準備**：雇用主がTE-toimistoに採用を通知し、団体協約に準拠した雇用条件を確認する
2. **Enter Finlandでオンライン申請**：申請者がEnterFinland.fiでアカウントを作成し、必要書類をアップロードして申請を提出
3. **雇用主フォームの提出**：申請者の提出後、雇用主も別途オンラインフォームで給与・職種・雇用条件を提出
4. **本人確認（身分証明）**：フィンランド国外の場合はフィンランド大使館・領事館で対面の本人確認を実施（申請から通常2〜4週間以内に予約）
5. **Migriが審査・決定**：本人確認完了後、概ね2〜4週間以内に決定
6. **在留許可証カードの受け取り**：許可後、フィンランド国内のMigri窓口で在留許可証カードを受領

### 必要書類（就労者居住許可）

- 有効なパスポート（写真ページのコピーを含む）
- 雇用契約書または採用内定通知書（雇用主・申請者双方のサイン入り）
- 学位・資格証明書（職種に資格が必要な場合）
- パスポートサイズの写真
- 申請手数料の支払い証明（€750、オンライン申請の場合）

### 処理期間の目安（2026年）

| 許可種別 | 処理期間（本人確認後） |
|---|---|
| 就労者居住許可（TTOL） | 14〜30日（ケースによって延長あり） |
| EUブルーカード | 14〜30日 |
| スタートアップ許可（Fast Track） | 約2週間（Business Finland審査後） |
| 自営業者許可 | 30日〜 |

※オンライン申請は書面申請より大幅に早い。大使館での本人確認の予約待ちが最大のボトルネックになることが多い。

### 税制の詳細（2026年）

**国税（Valtionvero）累進税率**

| 課税所得（€） | 税率（限界税率） |
|------------|------------|
| 0〜21,200 | 12.64% |
| 21,201〜32,600 | 19% |
| 32,601〜40,100 | 30.25% |
| 40,101〜52,100 | 33.25% |
| 52,101以上 | 37.5% |

- 地方税（kunnallisvero）：居住自治体ごとに異なる。**ヘルシンキ5.84%**、全国平均7.57%（範囲：4.70〜10.90%）
- 国税＋地方税＋社会保険料を合算した実効税負担：中所得層で約30〜35%、高所得層で45〜50%超

### 社会保険（Kela / 年金制度）

| 種別 | 料率（2026年） |
|------|------|
| 健康保険（従業員負担） | 約1.53% |
| 年金（TyEL、従業員） | 7.30%（年齢問わず統一） |
| 雇用主負担（年金+その他） | 約17〜20% |
| 失業保険（従業員） | 約1.5% |

※自営業者はYEL（自営業者年金保険）に加入義務あり（**24.4%**、2026年統一料率）。新規開業後48ヶ月は22%割引が適用され実質**約19.03%**。

### 外国人居住エリアの家賃相場（2026年）

| エリア | 物件タイプ | 月額賃料 |
|--------|-----------|---------|
| ヘルシンキ Töölö（高級住宅街） | 2BR | €1,600〜2,400 |
| ヘルシンキ Kallio（若者・外国人多い） | 2BR | €1,200〜1,800 |
| ヘルシンキ Kamppi/中心部 | 2BR | €1,500〜2,200 |
| エスポー Tapiola | 2BR | €1,400〜2,000 |
| タンペレ中心部 | 2BR | €900〜1,400 |

ヘルシンキ都市圏は家賃が高いが、タンペレ・トゥルクは3〜4割安い。英語が通じる国際コミュニティはKallio・Töölö周辺に集中している。

### 費用一覧（2026年1月改定後）

| 項目 | 費用（オンライン申請） |
|------|------|
| 就労者居住許可 | €750 |
| EUブルーカード | €750 |
| スタートアップ許可 | €750 |
| 自営業者居住許可 | €750 |
| 家族帯同（配偶者） | €240 |

※書面申請の場合、就労者許可等は€950。2026年1月1日より全種別の申請料が改定。

### 移住前チェックリスト

1. **DVVへの登録と個人番号（henkilötunnus）取得**：行政・銀行・医療・携帯電話契約など、フィンランドのあらゆるサービスに必要。DVV（デジタル人口登録局）でオンライン事前登録後、1ヶ月以内に窓口で対面登録が必要
2. **フィンランド語・スウェーデン語**：都市部では英語が広く通じるが、長期定住・市役所手続き・現地コミュニティへの参加にはフィンランド語学習を推奨
3. **極夜（Kaamos）への備え**：11月〜2月は日照時間が1〜3時間のみ。ビタミンD補給・人工照明・野外活動が精神的健康の維持に有効
4. **年金保険（YEL）の加入準備**：自営業者・フリーランサーは開業後3ヶ月以内にYELへの加入義務あり（新規開業者は48ヶ月間22%割引）
5. **住宅探し**：人気エリアは空き物件が少ない。Oikotie・Vuokraovi等の賃貸ポータルを早めに活用

MoveWorthでフィンランドの生活費・税負担をシミュレーションしてみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [フィンランド移民局（Migri）公式サイト](https://migri.fi/en/home)
- **オンライン申請（Enter Finland）**: [Enter Finland – オンライン在留許可申請](https://enterfinland.fi/)
- **住民登録・個人番号（DVV）**: [DVV – デジタル人口サービス庁](https://dvv.fi/en/home)
- **社会保険・Kela給付**: [Kela – フィンランド社会保険機構](https://www.kela.fi/web/en)
- **税務登録・納税番号（Vero）**: [Vero – フィンランド税務庁](https://www.vero.fi/en/)`,
      en: `Finland is a Nordic country with world-class education, healthcare, and social welfare. It has topped the World Happiness Report multiple years running, and Helsinki consistently ranks among the best cities for quality of life. The country also has a thriving startup ecosystem — anchored by the Slush conference — that actively welcomes international founders and tech professionals.

### Short-Term Stays (Tourism & Business)

**Visa-Free Entry under the Schengen Agreement**

Japanese nationals can enter Finland and the entire Schengen Area for up to **90 days in any 180-day period** without a visa. This covers tourism, visiting family, and short-term business trips — but not paid employment.

**⚠️ Late 2026: ETIAS Pre-Travel Authorisation Launching**

The EU is set to launch ETIAS (European Travel Information and Authorisation System) in late 2026. Japanese travellers (and other visa-exempt nationals) will need to obtain an ETIAS authorisation online (€7) before travelling — similar to the US ESTA. The 90-day visa-free allowance itself does not change, but pre-registration will become mandatory.

### Main Visa & Permit Types

**Employed Person's Residence Permit**
The most common route for non-EU nationals with a Finnish job offer.
- Employer must notify the Employment and Economic Development Office (TE-toimisto) first
- Application submitted through the Enter Finland online portal
- Validity: up to 2 years, renewable (eligible for Permanent Residence after 5 years)
- Minimum monthly salary: **€1,600+** (gross, 2026)

**Startup Permit (Startup-lupa)**
For startup founders whose business is assessed as having growth potential by Business Finland.
- Founding team must consist of **at least 2 co-founders** with complementary skills, both relocating to Finland
- Each founder must hold at least **60% of company shares** and work full-time in the business
- Ineligible: restaurants, consultancies, foreign subsidiaries, or businesses targeting only the Finnish market
- Must first obtain a positive Eligibility Statement from Business Finland (~1 month review)
- Application via Enter Finland; Fast Track decision: ~2 weeks
- Validity: 2 years, renewable

**EU Blue Card**
For highly qualified professionals.
- Minimum monthly salary: **€3,937+** (2026; 1.5× average wage)
- Fringe benefits (company car, housing allowance) do NOT count toward this threshold
- Validity: 2 years, renewable

**Self-Employment Residence Permit**
For freelancers and independent entrepreneurs.
- Requires a business plan, financial projections, and proof of funding
- Client list may be requested as evidence of work pipeline
- Validity: 1 year initially, renewable

### Application Process (Step by Step)

Using the Employed Person's Residence Permit (TTOL) as an example:

1. **Employer pre-notification**: The employer notifies the TE-toimisto and confirms the offer meets collective agreement standards
2. **Online application via Enter Finland**: Applicant creates an account at EnterFinland.fi and uploads all required documents
3. **Employer form submission**: After the applicant submits, the employer completes a separate online form confirming salary, job title, and employment conditions
4. **Identity verification**: Applicants outside Finland complete in-person identity verification at a Finnish embassy or consulate (typically within 2–4 weeks of submission)
5. **Migri decision**: Usually 14–30 days after identity verification, though timelines vary
6. **Residence permit card**: After approval, collect the permit card in person at a Migri service point in Finland

### Required Documents (Employed Person's Permit)

- Valid passport (including copy of photo page)
- Employment contract or signed job offer (signed by both employer and employee)
- Academic degrees and professional certificates (if relevant to the occupation)
- Passport-sized photographs
- Proof of application fee payment (€750 for online applications)

### Processing Times (2026)

| Permit Type | Processing Time (after identity verification) |
|---|---|
| Employed Person's Permit (TTOL) | 14–30 days (can be longer in complex cases) |
| EU Blue Card | 14–30 days |
| Startup Permit (Fast Track) | ~2 weeks (after Business Finland approval) |
| Self-Employment Permit | 30+ days |

Note: Online applications are processed significantly faster than paper. Scheduling the identity verification appointment at an embassy is often the biggest bottleneck.

### Tax System in Detail (2026)

**National Tax (Valtionvero) — Progressive Brackets**

| Taxable Income (€) | Marginal Rate |
|--------------------|---------------|
| 0–21,200 | 12.64% |
| 21,201–32,600 | 19.00% |
| 32,601–40,100 | 30.25% |
| 40,101–52,100 | 33.25% |
| Above 52,100 | 37.50% |

- Municipal tax (kunnallisvero): **Helsinki 5.84%**, national average 7.57% (range: 4.70–10.90% across municipalities)
- Combined effective tax burden (national + municipal + social contributions): ~30–35% for middle incomes, 45–50%+ for high earners
- In return: free university education, subsidised childcare, world-class public healthcare

### Social Insurance (2026)

| Category | Rate |
|----------|------|
| Health insurance (employee) | ~1.53% |
| Pension (TyEL, employee) | 7.30% (flat rate, all ages) |
| Employer total contributions | ~17–20% |
| Unemployment insurance (employee) | ~1.5% |

Self-employed persons must enroll in YEL (self-employed pension insurance) within 3 months of starting operations. **2026 YEL rate: 24.4%** (unified flat rate). New business owners receive a **22% discount for the first 48 months**, bringing the effective rate to approximately **19.03%**.

### Expat-Area Rents in Helsinki (2026)

| Area | Type | Monthly Rent |
|------|------|-------------|
| Helsinki – Töölö (upmarket) | 2BR | €1,600–2,400 |
| Helsinki – Kallio (young, international) | 2BR | €1,200–1,800 |
| Helsinki – Kamppi / city centre | 2BR | €1,500–2,200 |
| Espoo – Tapiola | 2BR | €1,400–2,000 |
| Tampere – city centre | 2BR | €900–1,400 |

The Helsinki metropolitan area is expensive but Tampere and Turku are 30–40% cheaper. Kallio and Töölö are the main international community hubs with English-speaking expat networks.

### Fee Table (Updated January 2026)

| Item | Cost (online application) |
|------|------|
| Employed Person's Permit | €750 |
| EU Blue Card | €750 |
| Startup Permit | €750 |
| Self-Employment Permit | €750 |
| Spouse / family member | €240 |

All permit fees were revised upward as of 1 January 2026. Paper applications cost €950 for the main permit types.

### Pre-Move Checklist

1. **DVV registration and henkilötunnus**: Finland's personal identity code is required for everything — banking, healthcare, mobile SIM, government services. Submit an online pre-registration at DVV, then complete in-person registration at a DVV service point within 1 month
2. **Finnish / Swedish language**: English is widely spoken in cities, but learning Finnish is strongly recommended for long-term integration, government dealings, and career progression
3. **Polar Night (Kaamos) preparation**: November to February brings only 1–3 hours of daylight. Vitamin D supplementation, light therapy lamps, and outdoor exercise are essential for mental wellbeing
4. **YEL pension insurance**: Self-employed persons must enroll in YEL within 3 months of starting business — new founders benefit from a 22% discount for the first 48 months
5. **Start apartment hunting early**: Good listings in popular areas go fast; use Oikotie and Vuokraovi rental portals as soon as possible

Use MoveWorth to simulate your tax burden and living costs in Finland.

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits General**: [Finnish Immigration Service (Migri)](https://migri.fi/en/home)
- **Online Applications (Enter Finland)**: [Enter Finland – Online Residence Permit Applications](https://enterfinland.fi/)`,
      zh: `芬兰是一个以世界一流教育、医疗和社会福利著称的北欧国家，多次蝉联全球幸福指数榜首，赫尔辛基是公认生活品质最高的城市之一。近年来，芬兰以Slush大会为代表的创业生态系统快速崛起，吸引了大量外籍创业者和科技人才。

### 主要签证与居留许可类型

**就业居留许可**
持有芬兰企业录用通知的非欧盟公民最常用的申请路径。
- 雇主须事先向TE-toimisto（就业与经济发展局）通报
- 通过Enter Finland在线门户申请
- 有效期：最长2年，可续签（连续居住5年后可申请永久居留权）
- 最低月薪：**€1,600以上**（税前，2026年）

**创业许可（Startup-lupa）**
适用于经Business Finland认定具有成长潜力的创业者。
- 创始团队须**至少2名**拥有互补技能的联合创始人，双方均须迁居芬兰
- 每位创始人须持有公司**60%以上**股份，并全职投入
- 须先向Business Finland提交业务申请并获得认定函（审核约1个月）
- 通过Enter Finland申请（Fast Track：约2周）
- 有效期：2年，可续签

**欧盟蓝卡**
面向高素质专业人才。
- 最低月薪：**€3,937以上**（2026年；为平均工资的1.5倍）
- 附加福利（公司车、住房补贴）不计入最低月薪
- 有效期：2年，可续签

**自雇居留许可**
适用于自由职业者和独立创业者。
- 须提交商业计划书、财务预测及资金证明
- 可能需提供客户名单作为业务管道的证明
- 有效期：初次1年，可续签

### 税制详解（2026年）

**国税（累进税率）**

| 应税收入（€） | 边际税率 |
|------------|--------|
| 0〜21,200 | 12.64% |
| 21,201〜32,600 | 19% |
| 32,601〜40,100 | 30.25% |
| 40,101〜52,100 | 33.25% |
| 52,100以上 | 37.5% |

- 地方税（kunnallisvero）：**赫尔辛基5.84%**，全国平均7.57%（各市范围：4.70〜10.90%）
- 国税+地方税+社保综合实际税负：中等收入约30〜35%，高收入可达45〜50%以上
- 高税负的回报：免费大学教育、补贴儿托、一流公共医疗体系

### 社会保险（2026年）

| 类别 | 费率 |
|------|------|
| 健康保险（雇员） | 约1.53% |
| 养老金（TyEL，雇员） | 7.30%（统一费率，不分年龄） |
| 雇主总缴纳额 | 约17〜20% |
| 失业保险（雇员） | 约1.5% |

自雇人士须在开业后3个月内加入YEL（自雇养老保险）。**2026年YEL费率：24.4%**（统一费率）。新创业者可享受**48个月22%折扣**，实际费率约**19.03%**。

### 外籍人士聚居区租金行情（2026年）

| 地区 | 房型 | 月租金 |
|------|------|--------|
| 赫尔辛基 Töölö（高档住宅区） | 两居室 | €1,600〜2,400 |
| 赫尔辛基 Kallio（年轻人/外籍人士聚集） | 两居室 | €1,200〜1,800 |
| 赫尔辛基 Kamppi/市中心 | 两居室 | €1,500〜2,200 |
| 埃斯波 Tapiola | 两居室 | €1,400〜2,000 |
| 坦佩雷市中心 | 两居室 | €900〜1,400 |

赫尔辛基都市圈租金较高，坦佩雷和图尔库便宜约30〜40%。Kallio和Töölö是国际社区最集中的区域，英语社交圈活跃。

### 费用一览（2026年1月改订后）

| 项目 | 费用（在线申请） |
|------|------|
| 就业居留许可 | €750 |
| 欧盟蓝卡 | €750 |
| 创业许可 | €750 |
| 自雇居留许可 | €750 |
| 配偶/家属 | €240 |

※2026年1月1日起所有许可类别申请费用上调。纸质申请主要许可类别为€950。

### 移居前检查清单

1. **DVV登记与个人号码（henkilötunnus）申请**：银行、医疗、手机套餐、政府服务等一切均需此号码。需在DVV在线预登记后，1个月内亲临DVV服务窗口完成登记
2. **芬兰语/瑞典语**：城市英语沟通无碍，但长期融入、办理政府手续及职业发展强烈建议学习芬兰语
3. **极夜（Kaamos）准备**：11月至2月日照仅1〜3小时，建议补充维生素D、使用光疗灯并坚持户外运动以维护心理健康
4. **YEL养老保险**：自雇人士须在开业后3个月内加入（新创业者可享受48个月22%折扣）
5. **提前寻找住房**：热门区域房源稀缺，建议尽早使用Oikotie和Vuokraovi租房平台

使用MoveWorth模拟您在芬兰的税负和生活成本。

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [芬兰移民局（Migri）官方网站](https://migri.fi/en/home)
- **在线申请（Enter Finland）**: [Enter Finland – 居留许可在线申请](https://enterfinland.fi/)`,
    },
  },
  {
    slug: "visa-at",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-at.webp",
    title: {
      ja: "【2026年最新版】オーストリアのビザ・就労許可完全ガイド｜RWRカード・EUブルーカード・税制",
      en: "Austria Visa & Work Permit Complete Guide 2026 | RWR Card, EU Blue Card, Tax",
      zh: "【2026年最新】奥地利签证与就业许可完全指南｜红白红卡、欧盟蓝卡、税制",
    },
    description: {
      ja: "レッド・ホワイト・レッドカード（ポイント制）・EUブルーカード（€4,500/月）・ロングステイまで、2026年最新データでオーストリア移住を完全解説。ウィーン外国人エリアの家賃相場・社会保険・費用一覧付き。",
      en: "Red-White-Red Card (points-based), EU Blue Card (€4,500/mo), Long-Stay Permit — Austria 2026 complete guide with Vienna expat-area rents, social insurance rates, and full fee tables.",
      zh: "红白红卡（积分制）、欧盟蓝卡（€4,500/月）、长期居留许可——2026年最新奥地利移居完全指南，含维也纳外籍人士聚居区租金、社保及费用一览。",
    },
    content: {
      ja: `オーストリアはウィーンを首都とするEU加盟の中欧の国です。高い生活水準・充実した文化・中央ヨーロッパの地理的優位性を持ち、スキルを持つ外国人向けのポイント制就労ビザ「レッド・ホワイト・レッドカード（RWR Card）」は世界的にも評価の高い制度です。ウィーンはEconomist誌の生活の質指数で常にトップ3圏内に位置します。

### 主なビザ・居住許可の種類

**レッド・ホワイト・レッドカード（RWR Card）** ｜ [migration.gv.at 公式ページ](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/)
ポイント制で高度技能を評価する就労・居住統合許可。カテゴリは主に3種類：

*非常に高い資格を持つ労働者（Very Highly Qualified Workers）*
- 学歴・職歴・語学力等の評価で**70点以上**
- 雇用オファーなしでも申請可能（ジョブシーカービザ的側面あり）

*不足職種労働者（Shortage Occupation Workers）*
- オーストリア政府が定める人手不足職種リスト（Mangelberufsliste）に該当する職種
- 雇用オファーが必要

*その他のキーパーソン（Other Key Workers）*
- 最低月収：**€3,465以上**（2026年）
- 雇用主のスポンサーが必要

全カテゴリ共通：有効期間2年、更新可能。2年保有後、居住許可（Niederlassungsbewilligung – unbeschränkt）へ切り替え、5年後に永住権申請可。

**ジョブシーカービザ（Job Seeker Visa）** ｜ [migration.gv.at – Very Highly Qualified Workers](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/very-highly-qualified-workers/)
RWR Card「非常に高い資格を持つ労働者」カテゴリのうち、雇用オファーなしで入国・求職活動ができる枠。
- ポイント審査で**70点以上**を取得した場合に適用
- 入国後、オーストリア国内で就職活動が可能
- 採用確定後にRWR Cardへ切り替え申請

**EUブルーカード（EU Blue Card）**
- 最低月収：**約€4,500以上**（管理職・上位専門職向け）
- 大学以上の学歴または5年以上の実務経験が必要
- 有効期間：2年、更新可能

**自営業者居住許可（Selbständige Erwerbstätigkeit）** ｜ [migration.gv.at – Self-employed Key Workers](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/self-employedkeyworkers/)
フリーランサー・個人事業主・起業家向け。
- 事業計画・財務計画の提出が必要
- 税務登録と商業登録（Gewerbeanmeldung）も並行して実施

**ロングステイ居住許可（Niederlassungsbewilligung）**
就労を伴わない長期居住（投資家・パッシブインカム生活者向け）。
- 生活費を自己負担できることの財務証明が必要

### 税制の詳細

**個人所得税（累進課税）**

| 課税所得（€） | 税率 |
|------------|------|
| 0〜11,693 | 0% |
| 11,694〜18,000 | 20% |
| 18,001〜31,000 | 35% |
| 31,001〜60,000 | 42% |
| 60,001〜90,000 | 48% |
| 90,001〜1,000,000 | 50% |
| 1,000,001以上 | 55% |

### 社会保険（Sozialversicherung）

| 種別 | 被雇用者負担 | 雇用主負担 |
|------|-----------|---------|
| 年金保険（PVA） | 10.25% | 12.55% |
| 健康保険（ÖGK） | 3.87% | 3.78% |
| 失業保険（BMAW） | 3.0% | 3.0% |
| 合計概算 | 約18.12% | 約21.23% |

自営業者はSVS（自営業者社会保険機関）に加入義務あり。保険料は収入の約26%（下限・上限あり）。

### 外国人居住エリアの家賃相場（2026年）

| エリア | 物件タイプ | 月額賃料 |
|--------|-----------|---------|
| ウィーン1区（市内中心・官庁街） | 2BR | €1,800〜2,800 |
| ウィーン3区 Landstraße（日本人多数） | 2BR | €1,400〜2,200 |
| ウィーン9区 Alsergrund（大学周辺） | 2BR | €1,300〜2,000 |
| ウィーン19区 Döbling（高級住宅街） | 2BR | €1,600〜2,500 |
| ウィーン郊外 Klosterneuburg | 2BR | €1,000〜1,600 |

ウィーン3区（Landstraße）は日本大使館・国際機関が集中し、日本人移住者コミュニティが充実。1区は家賃が最高水準だが交通・生活利便性も最高。

### 費用一覧

| 項目 | 費用 |
|------|------|
| RWRカード（各カテゴリ共通） | €160 |
| EUブルーカード | €160 |
| 自営業者居住許可 | €160 |
| ロングステイ居住許可 | €160 |
| 家族帯同 | €160/人 |

### 移住前チェックリスト

1. **住所登録（Meldezettel）**：到着後**3日以内**に地区の市民事務所（Magistratisches Bezirksamt）で登録が義務付けられている。賃貸契約書と本人確認書類が必要
2. **税務番号（Steuernummer）の取得**：就労開始前にFinanzamt（税務署）で申請。オンラインでも可（Finanzonline）
3. **社会保険の登録（ÖGK / SVS）**：雇用開始初日から雇用主が登録義務を負う。自営業者はSVSに自分で申請
4. **ドイツ語の習得**：永住権（Daueraufenthalt）取得要件のひとつはドイツ語B2以上。早期学習を推奨
5. **住宅探し**：ウィーンの賃貸市場は競争が激しい。Willhaben・ImmoScout24等のポータルを利用し、内覧は早めに予約

MoveWorthでオーストリアの生活費・税負担をシミュレーションしてみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [オーストリア移住ポータル（migration.gv.at）](https://www.migration.gv.at/en/)
- **レッド・ホワイト・レッドカード（RWR）**: [migration.gv.at – RWR カード申請ガイド](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/)
- **ジョブシーカービザ（Very Highly Qualified Workers）**: [migration.gv.at – 高資格者ページ](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/very-highly-qualified-workers/)
- **自営業者居住許可**: [migration.gv.at – Self-employed Key Workers](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/self-employedkeyworkers/)`,
      en: `Austria is a Central European EU member state with Vienna as its capital. Known for its exceptional quality of life — Vienna regularly ranks in the global top 3 for livability — and for the points-based Red-White-Red Card that makes it one of Europe's most transparent skilled-worker immigration systems.

### Main Visa & Permit Types

**Red-White-Red Card (RWR Card)** ｜ [migration.gv.at Official Page](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/)
Points-based work and residence permit, with three main categories:

*Very Highly Qualified Workers*
- **70+ points** based on education, work experience, language skills, age
- No job offer required — functions as a job-seeker visa with work rights after arrival

*Shortage Occupation Workers*
- For professions on Austria's official shortage list (Mangelberufsliste)
- Job offer from an Austrian employer required

*Other Key Workers*
- Minimum gross monthly salary: **€3,465+** (2026)
- Employer sponsorship required

All categories: validity 2 years, renewable. After 2 years, upgrade to unrestricted settlement permit; apply for Permanent Residence after 5 years.

**Job Seeker Visa (within RWR Card)** ｜ [migration.gv.at – Very Highly Qualified Workers](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/very-highly-qualified-workers/)
Austria's job-seeker route — available to those who score 70+ points under the Very Highly Qualified Workers category.
- Enter Austria **without a job offer** and search for employment on arrival
- Once employed, convert to the full RWR Card

**EU Blue Card**
- Minimum salary: **~€4,500+/month** for management and senior professional roles
- University degree or 5+ years of professional experience required
- Validity: 2 years, renewable

**Self-Employment Permit (Selbständige Erwerbstätigkeit)** ｜ [migration.gv.at – Self-employed Key Workers](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/self-employedkeyworkers/)
For freelancers, individual contractors, and startup founders.
- Business plan and financial projections required
- Must also register with the trade authority (Gewerbeanmeldung)

**Long-Stay Permit (Niederlassungsbewilligung)**
For non-working long-term residents (investors, passive income earners).
- Financial proof of self-sufficiency required

### Tax System in Detail

**Personal Income Tax (Progressive)**

| Taxable Income (€) | Rate |
|--------------------|------|
| 0–11,693 | 0% |
| 11,694–18,000 | 20% |
| 18,001–31,000 | 35% |
| 31,001–60,000 | 42% |
| 60,001–90,000 | 48% |
| 90,001–1,000,000 | 50% |
| Above 1,000,001 | 55% |

### Social Insurance (Sozialversicherung)

| Category | Employee | Employer |
|----------|----------|----------|
| Pension (PVA) | 10.25% | 12.55% |
| Health (ÖGK) | 3.87% | 3.78% |
| Unemployment (BMAW) | 3.0% | 3.0% |
| **Total (approx.)** | **~18.12%** | **~21.23%** |

Self-employed persons must enroll with SVS (self-employed social insurance body) — rate approximately 26% of income (with floors and ceilings).

### Expat-Area Rents in Vienna (2026)

| Area | Type | Monthly Rent |
|------|------|-------------|
| Vienna 1st district (city centre) | 2BR | €1,800–2,800 |
| Vienna 3rd – Landstraße (Japanese expat hub) | 2BR | €1,400–2,200 |
| Vienna 9th – Alsergrund (university area) | 2BR | €1,300–2,000 |
| Vienna 19th – Döbling (upmarket suburb) | 2BR | €1,600–2,500 |
| Klosterneuburg (outer suburbs) | 2BR | €1,000–1,600 |

The 3rd district (Landstraße) hosts the Japanese Embassy and several international organizations — the strongest Japanese expat community in Vienna. The 1st district commands the highest rents but offers the best access to public transport and amenities.

### Fee Table

| Item | Cost |
|------|------|
| RWR Card (all categories) | €160 |
| EU Blue Card | €160 |
| Self-Employment Permit | €160 |
| Long-Stay Permit | €160 |
| Family member (per person) | €160 |

### Pre-Move Checklist

1. **Address registration (Meldezettel)**: Legally required within **3 days** of moving into a permanent address. Go to your district's Magistratisches Bezirksamt with your rental contract and ID
2. **Tax number (Steuernummer)**: Apply at the Finanzamt (or via Finanzonline) before starting work
3. **Social insurance enrollment**: Employer registers employees from day one; self-employed must apply to SVS independently
4. **German language (B2 target)**: B2 level is a requirement for permanent residency — start early
5. **Housing**: Vienna's rental market is competitive. Use Willhaben and ImmoScout24 and book viewings as soon as possible

Use MoveWorth to simulate your tax burden and living costs in Austria.

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits General**: [Austria Migration Portal (migration.gv.at)](https://www.migration.gv.at/en/)
- **Red-White-Red Card (RWR Card)**: [migration.gv.at – RWR Card Application Guide](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/)
- **Job Seeker Visa (Very Highly Qualified Workers)**: [migration.gv.at – Very Highly Qualified Workers](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/very-highly-qualified-workers/)
- **Self-Employment Permit**: [migration.gv.at – Self-employed Key Workers](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/self-employedkeyworkers/)`,
      zh: `奥地利是一个以维也纳为首都的中欧欧盟成员国，以卓越的生活品质著称——维也纳常年位居全球宜居城市前三，其积分制"红白红卡"体系是欧洲最透明的技能移民制度之一。

### 主要签证与居留许可类型

**红白红卡（RWR Card）** ｜ [migration.gv.at 官方页面](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/)
积分制就业居留综合许可，主要分三个类别：

*高素质技术人才*
- 学历、工作经验、语言能力、年龄综合评分达**70分以上**
- 无需工作邀约，可先入境后求职

*紧缺职业工人*
- 适用于政府官方紧缺职业清单（Mangelberufsliste）所列职业
- 须持有奥地利雇主的录用通知

*其他关键人才*
- 最低月薪：**€3,465以上**（2026年）
- 须有雇主担保

全类别共同条件：有效期2年，可续签。持证2年后可升级为无限制定居许可，5年后可申请永久居留权。

**求职签证（Job Seeker Visa）** ｜ [migration.gv.at – 高素质技术人才](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/very-highly-qualified-workers/)
奥地利的求职入境路径——积分制"高素质技术人才"类别中满70分者可使用。
- **无需工作邀约**即可入境奥地利，入境后在当地求职
- 成功获得工作邀约后转换为正式红白红卡

**欧盟蓝卡**
- 最低月薪：**约€4,500以上**（适用于管理岗位及高级专业职位）
- 需具备大学学历或5年以上工作经验
- 有效期：2年，可续签

**自雇居留许可（Selbständige Erwerbstätigkeit）** ｜ [migration.gv.at – 自雇关键人才](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/self-employedkeyworkers/)
适用于自由职业者、个体经营者和创业者。
- 须提交商业计划书及财务预测
- 同时须向商业登记处（Gewerbeanmeldung）完成注册

**长期居留许可（Niederlassungsbewilligung）**
适用于无就业计划的长期居民（投资者、被动收入人士）。
- 须提供财务自给能力证明

### 税制详解

**个人所得税（累进税率）**

| 应税收入（€） | 税率 |
|------------|------|
| 0〜11,693 | 0% |
| 11,694〜18,000 | 20% |
| 18,001〜31,000 | 35% |
| 31,001〜60,000 | 42% |
| 60,001〜90,000 | 48% |
| 90,001〜1,000,000 | 50% |
| 1,000,001以上 | 55% |

### 社会保险（Sozialversicherung）

| 类别 | 雇员负担 | 雇主负担 |
|------|---------|---------|
| 养老保险（PVA） | 10.25% | 12.55% |
| 健康保险（ÖGK） | 3.87% | 3.78% |
| 失业保险（BMAW） | 3.0% | 3.0% |
| **合计（约）** | **约18.12%** | **约21.23%** |

自雇人士须向SVS（自雇人士社会保险机构）登记，费率约为收入的26%（有下限与上限）。

### 维也纳外籍人士聚居区租金行情（2026年）

| 地区 | 房型 | 月租金 |
|------|------|--------|
| 维也纳1区（市中心/政府机构区） | 两居室 | €1,800〜2,800 |
| 维也纳3区 Landstraße（日籍人士聚集） | 两居室 | €1,400〜2,200 |
| 维也纳9区 Alsergrund（大学区） | 两居室 | €1,300〜2,000 |
| 维也纳19区 Döbling（高档住宅区） | 两居室 | €1,600〜2,500 |
| 克洛斯特新堡（近郊） | 两居室 | €1,000〜1,600 |

维也纳3区（Landstraße）汇聚了日本大使馆及多个国际组织，是维也纳日籍移居者社区最集中的区域。1区租金最高，但交通和生活便利性也最佳。

### 费用一览

| 项目 | 费用 |
|------|------|
| 红白红卡（各类别统一） | €160 |
| 欧盟蓝卡 | €160 |
| 自雇居留许可 | €160 |
| 长期居留许可 | €160 |
| 家属（每人） | €160 |

### 移居前检查清单

1. **地址登记（Meldezettel）**：抵达固定住所后**3天内**须前往所在区的市民事务所（Magistratisches Bezirksamt）完成登记，需携带租房合同和身份证件
2. **税务号码（Steuernummer）申请**：开始工作前向税务局（Finanzamt）申请，也可通过Finanzonline在线办理
3. **社会保险登记**：雇员由雇主从入职第一天起办理登记；自雇人士须自行向SVS申请
4. **德语（目标B2）**：永久居留权要求之一是达到德语B2水平，建议尽早开始学习
5. **住房**：维也纳租房市场竞争激烈，建议使用Willhaben和ImmoScout24，尽早预约看房

使用MoveWorth模拟您在奥地利的税负和生活成本。

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [奥地利移民门户（migration.gv.at）](https://www.migration.gv.at/en/)
- **红白红卡（RWR卡）**: [migration.gv.at – RWR卡申请指南](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/)
- **求职签证（高素质技术人才）**: [migration.gv.at – 高素质技术人才页面](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/very-highly-qualified-workers/)
- **自雇居留许可**: [migration.gv.at – 自雇关键人才](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/self-employedkeyworkers/)`,
    },
  },
  {
    slug: "visa-cz",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-cz.webp",
    title: {
      ja: "チェコ ビザ・就労許可完全ガイド【2026年最新版】｜従業員カード・フリーランス・フラット税率",
      en: "Czech Republic Work Permit & Visa Guide 2026 | Employee Card, EU Blue Card, Freelance Trade License",
      zh: "【2026年最新】捷克签证与就业许可完全指南｜员工卡、自由职业、单一税率",
    },
    description: {
      ja: "従業員カード・EUブルーカード（CZK 77,245/月）・商業許可証（フリーランス・経費60%控除）まで、2026年最新データでチェコ移住を完全解説。プラハ外国人エリアの家賃相場・社会保険・費用一覧付き。",
      en: "Employee Card, EU Blue Card (CZK 77,245/mo), Trade License for freelancers (60% expense deduction) — Czech Republic 2026 complete guide with Prague expat-area rents, social insurance, and full fee tables.",
      zh: "员工卡、欧盟蓝卡（CZK 77,245/月）、营业执照（自由职业60%定额扣除）——2026年最新捷克移居完全指南，含布拉格外籍人士聚居区租金、社保及费用一览。",
    },
    content: {
      ja: `チェコはプラハを首都とするEU加盟の中欧の国です。西欧と比べて物価が安く、フラット税率の所得税制度が特徴的で、特にフリーランサーや外国人IT人材にとって税負担が軽いことで人気を集めています。近年はプラハのIT・スタートアップシーンが急速に発展し、英語が通じる国際コミュニティも形成されています。

### 主なビザ・居住許可の種類

**従業員カード（Zaměstnanecká karta）**
就労と居住を一体化した許可証。非EU国籍の外国人がチェコ企業で働く最も一般的なルート。
- 雇用主のスポンサーが必要（企業がハローワーク相当のÚP ČRに求人登録）
- 申請はチェコ大使館またはオンラインで行う
- 有効期間：最長2年、更新可能（5年継続後に永住権申請可）

**EUブルーカード（EU Blue Card）**
高度技能者向けの優遇就労許可。
- 最低月収：平均賃金の1.5倍（**約CZK 77,245/月**、2026年）
- 大学以上の学歴が必要
- 有効期間：2年、更新可能

**商業許可証（Živnostenský list）＋長期ビザ（D種ビザ）** ｜ [IPC 公式ページ](https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/long-term-visa/long-term-visa-for-the-purpose-of-doing-business/)
フリーランサー・個人事業主に特に人気のルート。
- 商業局（Živnostenský úřad）で許可証を取得（手数料CZK 1,000）
- IT・デザイン・マーケティング等のサービス業で「自由業（Volná živnost）」として申請が多い
- **収入の60%を概算必要経費として控除できる特例**（パウシャール控除）。課税所得を大幅に圧縮できるため、IT系個人事業主に有利

**求職・起業目的の長期居住許可（Job Seeker）** ｜ [IPC 公式ページ](https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/long-term-residence-permits/long-term-residence-permit-for-the-purpose-of-seeking-employment-or-starting-a-business/)
チェコでの就職活動または起業準備のための居住許可。
- 有効期間：最長1年（原則更新不可）
- 就職・創業が決まり次第、従業員カードまたはŽivnostenský listルートへ切り替え
- 財政的自立の証明が必要（銀行残高証明等）

**長期居住許可（Trvalý pobyt / 永住）**
5年間の継続的な合法居住後に申請可能。

### 税制の詳細

**個人所得税（2026年）**

| 課税所得（CZK/年） | 税率 |
|-----------------|------|
| 0〜1,582,812 | **15%（フラット）** |
| 1,582,813以上 | **23%** |

- 基礎控除（slevu na poplatníka）：年CZK 30,840（月CZK 2,570）
- 被雇用者の社会・健康保険負担：合計**11%**（社会保険6.5%＋健康保険4.5%）

**フリーランサーのパウシャール控除（2026年）**
- サービス業（IT等）：収入の**60%**（上限CZK 1,200,000）
- 商業・飲食業：収入の**40%**（上限CZK 800,000）

### 社会保険・健康保険

| 種別 | 従業員 | 雇用主 |
|------|--------|--------|
| 社会保険（důchodové/nemocenské） | 6.5% | 24.8% |
| 健康保険（zdravotní pojištění） | 4.5% | 9.0% |
| **合計** | **11%** | **33.8%** |

自営業者（Živnostník）は社会保険・健康保険を自己負担（最低保険料あり）。

### 外国人居住エリアの家賃相場（2026年）

| エリア | 物件タイプ | 月額賃料 |
|--------|-----------|---------|
| プラハ1区（旧市街・観光中心） | 2BR | CZK 35,000〜55,000 |
| プラハ2区 Vinohrady（外国人人気エリア） | 2BR | CZK 30,000〜45,000 |
| プラハ3区 Žižkov（若者・コスパ良） | 2BR | CZK 22,000〜35,000 |
| プラハ7区 Letná（おしゃれ・家族向け） | 2BR | CZK 28,000〜42,000 |
| ブルノ市内（第2の都市） | 2BR | CZK 18,000〜28,000 |

プラハのVinohrady・Žižkov・Letná周辺は外国人が最も多く住むエリア。英語が通じるレストラン・カフェ・コワーキングスペースが充実。ブルノはプラハより約35〜40%安い。

### 費用一覧

| 項目 | 費用 |
|------|------|
| 従業員カード申請費 | CZK 5,000 |
| EUブルーカード申請費 | CZK 5,000 |
| 商業許可証取得手数料 | CZK 1,000 |
| 長期滞在ビザ（D種） | CZK 2,500 |
| 永住権申請費 | CZK 3,000 |

### 移住前チェックリスト

1. **外国人警察への登録**：入国後**3日以内**にŘeditelství služby cizinecké policie（外国人警察）への登録義務あり。ホテル・ホステル滞在の場合は宿泊施設が代行
2. **公的健康保険の加入**：VZP（最大手）・Zdravotní pojišťovna MVCR等への加入が義務。失業中・自営業者は自分で最低保険料を支払う
3. **口座開設**：Česká spořitelna・Komerční banka・Moneta Money Bankが主要行。フリーランサーはFio bankaが人気（オンライン手続きが簡便）
4. **チェコ語習得の優先度**：プラハは英語が通じる環境が整っているが、永住権の要件にA2チェコ語試験が含まれる。早めに準備を
5. **税理士の活用**：パウシャール控除・社会保険料の最適化など、チェコ語の申告書作成を専門家に依頼すると節税効果が高い

MoveWorthでチェコの生活費・税負担をシミュレーションしてみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [チェコ外国人情報ポータル（IPC）](https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/)
- **従業員カード**: [チェコ内務省 – Employee Card](https://mv.gov.cz/mvcren/article/employee-card.aspx)
- **商業許可証（フリーランス）**: [IPC – 事業目的長期ビザ](https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/long-term-visa/long-term-visa-for-the-purpose-of-doing-business/)
- **求職・起業目的居住許可**: [IPC – Job Seeker / Business Start-up Permit](https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/long-term-residence-permits/long-term-residence-permit-for-the-purpose-of-seeking-employment-or-starting-a-business/)`,
      en: `The Czech Republic is a Central European EU member state with Prague as its capital. Lower living costs than Western Europe, a simple flat-rate income tax, and a growing IT ecosystem have made it particularly attractive to international tech professionals and freelancers. Prague's English-speaking expat community is one of the largest in Central Europe.

### Main Visa & Permit Types

**Employee Card (Zaměstnanecká karta)**
The most common route for non-EU nationals working for a Czech employer.
- Employer must list the position with the Czech Labour Office (ÚP ČR) first
- Apply at a Czech embassy or online via the e-Visa portal
- Validity: up to 2 years, renewable (eligible for Permanent Residence after 5 years)

**EU Blue Card**
For highly qualified professionals.
- Minimum salary: 1.5× average wage (**~CZK 77,245/month**, 2026)
- University degree required
- Validity: 2 years, renewable

**Trade License (Živnostenský list) + Long-Stay Visa (Type D)** ｜ [IPC Official Page](https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/long-term-visa/long-term-visa-for-the-purpose-of-doing-business/)
The most popular route for IT freelancers, designers, and consultants.
- Obtain a Trade License from the živnostenský úřad (Trade Authority) for CZK 1,000
- Most IT/service freelancers apply under the "Free Trade" (Volná živnost) category
- **60% flat-rate expense deduction (paušální výdaje)**: Massively reduces taxable income — a major tax advantage for IT self-employed

**Job Seeker / Business Start-up Permit** ｜ [IPC Official Page](https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/long-term-residence-permits/long-term-residence-permit-for-the-purpose-of-seeking-employment-or-starting-a-business/)
Long-term residence permit for those seeking employment or preparing to start a business in Czech Republic.
- Validity: up to 1 year (generally not renewable)
- Switch to Employee Card or Trade License route once you secure a job or register a business
- Proof of financial self-sufficiency required (bank statements, etc.)

**Permanent Residency (Trvalý pobyt)**
Available after 5 years of continuous legal residence.

### Tax System in Detail

**Personal Income Tax (2026)**

| Annual Taxable Income (CZK) | Rate |
|-----------------------------|------|
| 0–1,582,812 | **15% (flat)** |
| Above 1,582,813 | **23%** |

- Basic tax credit (sleva na poplatníka): CZK 30,840/year (reduces tax directly)
- Employee social and health insurance: combined **11%** (social 6.5% + health 4.5%)

**Freelancer Flat-Rate Expense Deduction (Paušální výdaje)**
- Service businesses (IT, creative): **60%** of revenue (capped at CZK 1,200,000)
- Trading / F&B: **40%** of revenue (capped at CZK 800,000)

### Social and Health Insurance

| Category | Employee | Employer |
|----------|----------|----------|
| Social insurance | 6.5% | 24.8% |
| Health insurance | 4.5% | 9.0% |
| **Total** | **11%** | **33.8%** |

Self-employed (živnostník) pay both social and health insurance personally, with mandatory minimums.

### Expat-Area Rents in Prague (2026)

| Area | Type | Monthly Rent |
|------|------|-------------|
| Prague 1 – Old Town (tourist centre) | 2BR | CZK 35,000–55,000 |
| Prague 2 – Vinohrady (expat favourite) | 2BR | CZK 30,000–45,000 |
| Prague 3 – Žižkov (young, affordable) | 2BR | CZK 22,000–35,000 |
| Prague 7 – Letná (stylish, families) | 2BR | CZK 28,000–42,000 |
| Brno city centre (second city) | 2BR | CZK 18,000–28,000 |

Vinohrady, Žižkov, and Letná are the main expat hubs, with English-speaking cafés, coworking spaces, and international communities. Brno is approximately 35–40% cheaper than Prague.

### Fee Table

| Item | Cost |
|------|------|
| Employee Card | CZK 5,000 |
| EU Blue Card | CZK 5,000 |
| Trade License | CZK 1,000 |
| Long-Stay Visa (Type D) | CZK 2,500 |
| Permanent Residency application | CZK 3,000 |

### Pre-Move Checklist

1. **Foreign Police registration**: Must register within **3 days** of arrival at the Directorate of the Alien Police Service. Hotels handle this automatically for guests
2. **Public health insurance enrollment**: VZP (largest insurer) or Zdravotní pojišťovna MVCR are the main options. Unemployed and self-employed must pay the minimum premium independently
3. **Bank account**: Česká spořitelna, Komerční banka, and Moneta Money Bank are the main banks. Freelancers often prefer Fio banka for its simple online onboarding
4. **Czech language (target A2)**: English is widely spoken in Prague, but Permanent Residency requires passing an A2 Czech exam — start early
5. **Use a Czech accountant**: Optimising paušální výdaje and social insurance contributions is complex — hiring an accountant fluent in Czech tax law pays for itself quickly

Use MoveWorth to simulate your tax burden and living costs in the Czech Republic.

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits General**: [Czech Foreigners Information Portal (IPC)](https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/)
- **Employee Card**: [Czech Ministry of Interior – Employee Card](https://mv.gov.cz/mvcren/article/employee-card.aspx)
- **Trade License (Freelance / Business)**: [IPC – Long-term Visa for the Purpose of Doing Business](https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/long-term-visa/long-term-visa-for-the-purpose-of-doing-business/)
- **Job Seeker / Business Start-up Permit**: [IPC – Long-term Residence Permit for Seeking Employment or Starting a Business](https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/long-term-residence-permits/long-term-residence-permit-for-the-purpose-of-seeking-employment-or-starting-a-business/)`,
      zh: `捷克是一个以布拉格为首都的中欧欧盟成员国，生活成本低于西欧、税制简单（单一税率），加之蓬勃发展的IT生态系统，尤其受到国际科技人才和自由职业者的青睐。布拉格的英语外籍人士社区是中欧最大的之一。

### 主要签证与居留许可类型

**员工卡（Zaměstnanecká karta）**
在捷克企业工作的非欧盟公民最常用的申请路径。
- 雇主须事先在捷克劳动局（ÚP ČR）登记职位
- 可在捷克大使馆或通过电子签证门户在线申请
- 有效期：最长2年，可续签（连续居住5年后可申请永久居留权）

**欧盟蓝卡**
面向高素质专业人才。
- 最低月薪：平均工资的1.5倍（**约CZK 77,245/月**，2026年）
- 须具备大学学历
- 有效期：2年，可续签

**营业执照（Živnostenský list）+长期签证（D类）** ｜ [IPC 官方页面](https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/long-term-visa/long-term-visa-for-the-purpose-of-doing-business/)
IT自由职业者、设计师和顾问最常用的路径。
- 向商业登记处（živnostenský úřad）申领营业执照，手续费CZK 1,000
- IT/服务类通常以"自由职业（Volná živnost）"类别申请
- **收入60%定额扣除（paušální výdaje）**：大幅压缩应税收入，是IT自雇人士的重大税收优势

**求职/创业目的长期居留许可** ｜ [IPC 官方页面](https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/long-term-residence-permits/long-term-residence-permit-for-the-purpose-of-seeking-employment-or-starting-a-business/)
适用于在捷克寻找工作或筹备创业的外籍人士。
- 有效期：最长1年（通常不可续签）
- 找到工作或完成营业执照注册后，切换至员工卡或营业执照路径
- 须提供财务自给能力证明（银行存款证明等）

**永久居留（Trvalý pobyt）**
连续合法居住5年后可申请。

### 税制详解

**个人所得税（2026年）**

| 年应税收入（CZK） | 税率 |
|---------------|------|
| 0〜1,582,812 | **15%（统一税率）** |
| 1,582,813以上 | **23%** |

- 基本税收抵免（sleva na poplatníka）：年CZK 30,840（直接抵减应缴税额）
- 雇员社会保险与健康保险合计：**11%**（社保6.5%＋医保4.5%）

**自由职业者定额扣除（paušální výdaje）**
- 服务业（IT等）：收入的**60%**（上限CZK 1,200,000）
- 贸易/餐饮业：收入的**40%**（上限CZK 800,000）

### 社会保险与健康保险

| 类别 | 雇员 | 雇主 |
|------|------|------|
| 社会保险 | 6.5% | 24.8% |
| 健康保险 | 4.5% | 9.0% |
| **合计** | **11%** | **33.8%** |

自雇人士（živnostník）须自行缴纳社会保险和健康保险，有最低缴费金额要求。

### 布拉格外籍人士聚居区租金行情（2026年）

| 地区 | 房型 | 月租金 |
|------|------|--------|
| 布拉格1区（旧城/旅游中心） | 两居室 | CZK 35,000〜55,000 |
| 布拉格2区 Vinohrady（外籍人士最爱） | 两居室 | CZK 30,000〜45,000 |
| 布拉格3区 Žižkov（年轻/实惠） | 两居室 | CZK 22,000〜35,000 |
| 布拉格7区 Letná（时尚/家庭友好） | 两居室 | CZK 28,000〜42,000 |
| 布尔诺市中心（第二大城市） | 两居室 | CZK 18,000〜28,000 |

Vinohrady、Žižkov和Letná是外籍人士最集中的区域，英语咖啡馆、共享办公空间和国际社群活跃。布尔诺生活成本比布拉格低约35〜40%。

### 费用一览

| 项目 | 费用 |
|------|------|
| 员工卡申请费 | CZK 5,000 |
| 欧盟蓝卡申请费 | CZK 5,000 |
| 营业执照手续费 | CZK 1,000 |
| 长期签证（D类） | CZK 2,500 |
| 永久居留权申请费 | CZK 3,000 |

### 移居前检查清单

1. **外国人警察登记**：入境后**3天内**须向外国人警察局完成登记，入住酒店/旅馆时由住宿方代为登记
2. **公共健康保险加入**：VZP（最大保险商）或Zdravotní pojišťovna MVCR为主要选择；失业或自雇人士须自行支付最低保费
3. **银行开户**：Česká spořitelna、Komerční banka、Moneta Money Bank为主要银行；自由职业者常选Fio banka，因其在线入户流程简便
4. **捷克语（目标A2）**：布拉格英语环境完善，但申请永久居留权须通过A2捷克语考试，建议尽早准备
5. **借助税务顾问**：定额扣除和社保缴费优化较为复杂，聘请熟悉捷克税法的会计师能带来显著的节税效果

使用MoveWorth模拟您在捷克的税负和生活成本。

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [捷克外籍人士信息门户（IPC）](https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/)
- **雇员卡**: [捷克内政部 – 雇员卡](https://mv.gov.cz/mvcren/article/employee-card.aspx)
- **营业执照（自由职业/创业）**: [IPC – 经营目的长期签证](https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/long-term-visa/long-term-visa-for-the-purpose-of-doing-business/)
- **求职/创业目的居留许可**: [IPC – 求职或创业目的长期居留许可](https://ipc.gov.cz/en/visa-and-residence-permit-types/third-country-nationals/long-term-residence-permits/long-term-residence-permit-for-the-purpose-of-seeking-employment-or-starting-a-business/)`,
    },
  },
  {
    slug: "visa-cn",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-cn.webp",
    title: {
      ja: "【2026年最新版】中国のビザ・就労許可完全ガイド｜Zビザ・外国人就労許可・6年ルール",
      en: "China Visa & Work Permit Complete Guide 2026 | Z Visa, FWPRC, 6-Year Tax Rule",
      zh: "【2026年最新】中国签证与就业许可完全指南｜Z签证、外国人工作许可证、六年规则",
    },
    description: {
      ja: "Zビザ・Rビザ（5〜10年マルチ）・外国人就労許可証（カテゴリA/B）・6年税優遇ルールまで、2026年最新データで中国就労・移住を完全解説。上海・北京外国人エリアの家賃相場・社会保険・費用一覧付き。",
      en: "Z Visa, R Visa (5–10yr multi-entry), FWPRC Category A/B, 6-Year foreign income exemption rule — China 2026 complete guide with Shanghai/Beijing expat-area rents, social insurance, and full fee tables.",
      zh: "Z签证、R签证（5〜10年多次）、外国人工作许可证（A/B类）、六年境外收入免税规则——2026年最新中国工作移居完全指南，含上海/北京外籍人士聚居区租金、社保及费用一览。",
    },
    content: {
      ja: `中国は世界第2位の経済規模を持ち、上海・北京・深圳・広州などのビジネス都市は多くの外国人専門家・日系企業駐在員・グローバル企業幹部を受け入れています。就労ビザ制度は厳格ですが、高度人材向けのRビザは最長10年の優遇措置があり、6年ルールによる税務上の優遇も外国人駐在員にとって重要なポイントです。

### 主なビザ・居留許可の種類

**Zビザ（就労ビザ）** ｜ [外交部公式：Zビザの対象者・必要書類](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140718_961555.shtml)
中国企業または外資系企業で就労する外国人向けの標準的な就労ビザ。
- 雇用主（中国法人）からの招聘状（邀请函）と外国人就労許可証（FWPRC）の事前取得が必要
- 入国後、**就労類居留許可（工作类居留许可）**に切り替えが必要（到着後30日以内）
- 有効期間：通常1〜2年、更新可能
- 年齢制限：一般的に男性60歳・女性55歳以下が基準（職種により例外あり）

**Rビザ（高レベル人材ビザ）** ｜ [外交部公式：Rビザの対象者・必要書類](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140718_961502.shtml)
政府が認定する「外国高端人才」向けの最優遇ビザ。
- 有効期間：**5年または10年のマルチエントリー**（通常のZビザを大幅に上回る）
- 対象：著名な研究者・ノーベル賞受賞者・グローバル企業CEO・国家重点プロジェクト人材等
- カテゴリAとしてFWPRCも同時取得

**Mビザ（商用ビザ）** ｜ [外交部公式：Mビザの対象者・必要書類](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140717_961496.shtml)
商業・貿易活動を目的とした短期ビザ。直接の就労・報酬の受け取りには使用不可。

**外国人就労許可証（FWPRC：外国人来华工作许可证）**
ZビザやRビザと併せて取得が必要な許可証（許可証＋居留許可の2点セット）。
- **カテゴリA（外国高端人才）**：千人計画等の対象者。申請簡素化・優遇待遇
- **カテゴリB（専門職外国人）**：一般的な駐在員・専門職。通常の審査プロセス
- **カテゴリC（一般外国人）**：単純労働・季節労働等

### 税制の詳細

**個人所得税（居住者：183日以上）**

| 年課税所得（CNY） | 税率 | 速算控除額 |
|---------------|------|---------|
| 0〜36,000 | 3% | 0 |
| 36,001〜144,000 | 10% | 2,520 |
| 144,001〜300,000 | 20% | 16,920 |
| 300,001〜420,000 | 25% | 31,920 |
| 420,001〜660,000 | 30% | 52,920 |
| 660,001〜960,000 | 35% | 85,920 |
| 960,001以上 | 45% | 181,920 |

**6年ルール（Six-Year Rule）**
- 中国での居住年数が連続6年未満の外国人は、中国国外源泉所得に対して税金が免除される可能性あり
- 6年のカウントは「連続」で行われ、暦年内に31日以上の一時出国、または1回90日以上の連続出国があればリセット
- 実務上、駐在員の場合は雇用主が計画的に出国管理を行うケースが多い

### 社会保険（外国人の加入義務）

中国では外国人（多くの都市で）社会保険への加入が義務付けられています（2011年より）。

| 種別 | 個人負担 | 雇用主負担（参考） |
|------|---------|----------------|
| 年金 | 8% | 16% |
| 健康保険 | 2% | 10% |
| 失業保険 | 0.5% | 0.5〜1% |
| 合計（概算） | **10.5%** | **26.5〜27%** |

※日中社会保障協定（2009年締結）により、一部の項目については日本と中国の両方で保険料を払わないよう調整可能。

### 外国人居住エリアの家賃相場（2026年）

| エリア | 物件タイプ | 月額賃料 |
|--------|-----------|---------|
| 上海 静安区/旧租界 | 2BR | CNY 12,000〜20,000 |
| 上海 徐匯区/古北（日本人多数） | 2BR | CNY 10,000〜18,000 |
| 北京 朝陽区 三里屯・望京 | 2BR | CNY 10,000〜18,000 |
| 北京 朝陽区 国貿・CBD | 2BR | CNY 12,000〜22,000 |
| 深圳 南山区（IT拠点） | 2BR | CNY 8,000〜15,000 |

上海の古北エリアは日本人駐在員が最も多く住む地区で、日本語対応の医療機関・日本食スーパー・日本語学校が充実。北京・朝陽区は外国公館・多国籍企業本社が集中するエリア。

### 費用一覧

| 項目 | 費用 |
|------|------|
| Zビザ申請費（日本での申請） | 約CNY 800〜1,200（相当額） |
| 就労類居留許可証 | 約CNY 400 |
| 外国人就労許可証（FWPRC） | 約CNY 400〜800 |
| 健康診断費（指定機関） | 約CNY 500〜1,500 |

### 移住前チェックリスト

1. **健康診断（体检）の実施**：就労類居留許可の申請時に、政府指定の健康診断機関での受診が必須。日本でも特定の指定機関あり
2. **学歴証明書の公証・認証（アポスティーユ）**：大学卒業証書・成績証明書は外務省のアポスティーユが必要。時間がかかるため事前準備必須
3. **公安局への外国人登録（24時間以内）**：到着後24時間以内に公安局（派出所）で外国人登録。ホテル滞在の場合はホテルが代行
4. **インターネット環境の準備**：中国本土ではGoogle・YouTube・LINE・WhatsApp・Instagram等が利用不可。VPNの事前設定（法的グレーゾーン）または企業が提供する国際回線の利用を検討
5. **6年ルールの戦略的活用**：税務顧問と相談し、出国記録の管理・6年カウントのリセット計画を立てることで節税が可能

MoveWorthで中国の生活費・税負担をシミュレーションしてみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **Zビザ（就労）対象者・必要書類**: [外交部公式ページ](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140718_961555.shtml)
- **Mビザ（商用・出張）対象者・必要書類**: [外交部公式ページ](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140717_961496.shtml)
- **Rビザ（高度人材）対象者・必要書類**: [外交部公式ページ](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140718_961502.shtml)
- **ビザ申請センター**: [中国ビザ申請サービスセンター（CVASC）](https://www.visaforchina.cn/)
- **外国人在留・就労許可**: [国家移民管理局（NIA）](https://www.nia.gov.cn/n741440/index.html)`,
      en: `China is the world's second-largest economy, with business cities like Shanghai, Beijing, Shenzhen, and Guangzhou hosting large numbers of international professionals, Japanese company assignees, and global executives. While the work visa process is strict, the R Visa offers up to 10-year multi-entry privileges for top talent, and the 6-Year Rule provides meaningful tax relief for foreign residents.

### Main Visa & Permit Types

**Z Visa (Work Visa)** ｜ [MFA Official: Z Visa – Who Qualifies & Documents Required](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140718_961555.shtml)
The standard visa for foreigners employed by Chinese or foreign-invested enterprises.
- Requires an Invitation Letter from a Chinese employer and a pre-approved FWPRC
- Must convert to a **Residence Permit for Work** within 30 days of arrival at the local Exit-Entry Administration Bureau
- Validity: typically 1–2 years, renewable
- Age cap: generally 60 (men) / 55 (women), with exceptions for key talent

**R Visa (High-Level Talent Visa)** ｜ [MFA Official: R Visa – Who Qualifies & Documents Required](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140718_961502.shtml)
The premium category for officially recognized "Foreign High-End Talent."
- Validity: **5- or 10-year multi-entry** — far beyond the standard Z Visa
- Targets: Nobel laureates, globally recognised researchers, Fortune 500 CEOs, key national project contributors
- Also issued as Category A FWPRC simultaneously

**M Visa (Business Visa)** ｜ [MFA Official: M Visa – Who Qualifies & Documents Required](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140717_961496.shtml)
For short-term commercial activities — cannot be used for direct employment or receiving salary in China.

**Foreigner's Work Permit (FWPRC)**
Required alongside the Z or R Visa — effectively a two-document system (permit + residence permit).
- **Category A (Foreign High-End Talent)**: Simplified process with preferential treatment
- **Category B (Professional Foreigner)**: Standard route for most expats
- **Category C (General Foreign Worker)**: Unskilled and seasonal labour

### Tax System in Detail

**Individual Income Tax (Residents: 183+ days/year)**

| Annual Taxable Income (CNY) | Rate | Quick Deduction |
|-----------------------------|------|-----------------|
| 0–36,000 | 3% | 0 |
| 36,001–144,000 | 10% | 2,520 |
| 144,001–300,000 | 20% | 16,920 |
| 300,001–420,000 | 25% | 31,920 |
| 420,001–660,000 | 30% | 52,920 |
| 660,001–960,000 | 35% | 85,920 |
| Above 960,001 | 45% | 181,920 |

**Six-Year Rule**
- Foreign residents who have not been in China for **6 consecutive years** may be exempt from tax on foreign-sourced income
- The 6-year clock resets if you leave China for 31+ days in a calendar year, or for 90+ consecutive days
- In practice, many employers actively manage assignee travel to maintain the reset

### Social Insurance (Mandatory for Foreign Nationals)

Since 2011, foreign nationals in China must contribute to social insurance in most cities.

| Category | Individual | Employer (approx.) |
|----------|------------|-------------------|
| Pension | 8% | 16% |
| Healthcare | 2% | 10% |
| Unemployment | 0.5% | 0.5–1% |
| **Total (approx.)** | **~10.5%** | **~26.5–27%** |

Note: The Japan-China Social Security Agreement (2009) may allow partial exemption from double contributions — consult your employer's HR/tax team.

### Expat-Area Rents (2026)

| Area | Type | Monthly Rent |
|------|------|-------------|
| Shanghai – Jing'an / Former French Concession | 2BR | CNY 12,000–20,000 |
| Shanghai – Xuhui / Gubei (Japanese expat hub) | 2BR | CNY 10,000–18,000 |
| Beijing – Chaoyang (Sanlitun / Wangjing) | 2BR | CNY 10,000–18,000 |
| Beijing – Chaoyang CBD / Guomao | 2BR | CNY 12,000–22,000 |
| Shenzhen – Nanshan (tech hub) | 2BR | CNY 8,000–15,000 |

The Gubei area in Shanghai is the largest Japanese expat community in China — with Japanese-speaking clinics, Japanese supermarkets, and Japanese schools. Beijing's Chaoyang district hosts most foreign embassies and multinational headquarters.

### Fee Table

| Item | Cost |
|------|------|
| Z Visa fee (applied in Japan) | ~CNY 800–1,200 equivalent |
| Work Residence Permit | ~CNY 400 |
| Foreigner's Work Permit (FWPRC) | ~CNY 400–800 |
| Medical examination (designated facility) | ~CNY 500–1,500 |

### Pre-Move Checklist

1. **Medical examination (体检)**: Mandatory for the Work Residence Permit. Must be done at a government-designated facility — some in Japan qualify, but verify in advance
2. **Degree certificate authentication (apostille)**: University certificates must be apostilled via the Japanese Ministry of Foreign Affairs — allow several weeks
3. **PSB registration within 24 hours**: Register at the local Public Security Bureau (neighborhood police station) within 24 hours of arrival; hotels handle this automatically for guests
4. **Internet setup**: Google, YouTube, LINE, WhatsApp, and Instagram are blocked on mainland China. Plan your VPN strategy (legal grey area) or ask your employer about international access solutions
5. **Six-Year Rule planning**: Work with a tax advisor to track exit days and plan the 6-year reset strategically — this can significantly reduce your overall tax burden

Use MoveWorth to simulate your tax burden and living costs in China.

---

### References

This article is based on the following official sources.

- **Z Visa (Work) – Eligibility & Required Documents**: [MFA Official Page](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140718_961555.shtml)
- **M Visa (Business/Trade) – Eligibility & Required Documents**: [MFA Official Page](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140717_961496.shtml)
- **R Visa (High-Level Talent) – Eligibility & Required Documents**: [MFA Official Page](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140718_961502.shtml)
- **Visa Application Centre**: [Chinese Visa Application Service Center (CVASC)](https://www.visaforchina.cn/)
- **Foreign Residence & Work Authorization**: [National Immigration Administration (NIA)](https://www.nia.gov.cn/n741440/index.html)`,
      zh: `中国是全球第二大经济体，上海、北京、深圳、广州等商业城市聚集了大量外籍专业人士、日企驻华人员及跨国公司高管。签证制度严格，但面向顶尖人才的R签证最长可享10年多次入境特权，"六年规则"也为外籍居民提供了重要的税务优惠空间。

### 主要签证与居留许可类型

**Z签证（工作签证）** ｜ [外交部官方：Z签证申请对象与所需材料](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140718_961555.shtml)
在华工作外籍人员的标准签证类别。
- 须事先取得中国雇主（境内法人）出具的邀请函及外国人工作许可证（FWPRC）
- 入境后30天内须在当地出入境管理局将Z签证转换为**工作类居留许可**
- 有效期：通常1〜2年，可续签
- 年龄限制：一般男性60岁、女性55岁以下（特殊职类可例外）

**R签证（高端人才签证）** ｜ [外交部官方：R签证申请对象与所需材料](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140718_961502.shtml)
适用于官方认定"外国高端人才"的最优待遇签证类别。
- 有效期：**5年或10年多次入境**——远超标准Z签证
- 面向诺贝尔奖得主、全球知名研究人员、世界500强CEO、国家重点项目人才等
- 同时颁发A类外国人工作许可证

**M签证（商务签证）** ｜ [外交部官方：M签证申请对象与所需材料](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140717_961496.shtml)
适用于短期商业活动，不可用于直接就业或在境内领取薪酬。

**外国人工作许可证（FWPRC）**
须与Z签证或R签证同时持有（许可证+居留许可"两证合一"体系）。
- **A类（外国高端人才）**：简化流程，享受优惠待遇
- **B类（专业技术人员）**：普通驻华外籍人员的标准路径
- **C类（普通外籍人员）**：普通劳工及季节性劳工

### 税制详解

**个人所得税（居民：年居住183天以上）**

| 年应税收入（CNY） | 税率 | 速算扣除数 |
|---------------|------|---------|
| 0〜36,000 | 3% | 0 |
| 36,001〜144,000 | 10% | 2,520 |
| 144,001〜300,000 | 20% | 16,920 |
| 300,001〜420,000 | 25% | 31,920 |
| 420,001〜660,000 | 30% | 52,920 |
| 660,001〜960,000 | 35% | 85,920 |
| 960,001以上 | 45% | 181,920 |

**六年规则**
- 连续居住不足6年的外籍人士，其境外来源收入可能免于征税
- 若在一个纳税年度内离境累计超过31天，或单次连续离境超过90天，则六年计数重置
- 实务中，许多雇主会主动协助员工规划出境记录，以维持重置条件

### 社会保险（外籍人员强制参保）

自2011年起，大多数城市要求外籍员工强制参加中国社会保险。

| 类别 | 个人缴纳 | 单位缴纳（参考） |
|------|---------|--------------|
| 养老保险 | 8% | 16% |
| 医疗保险 | 2% | 10% |
| 失业保险 | 0.5% | 0.5〜1% |
| **合计（约）** | **约10.5%** | **约26.5〜27%** |

注：根据中日社会保障协定（2009年缔结），部分险种可申请免除重复缴费，具体情况建议咨询雇主人力资源部门或税务顾问。

### 外籍人士聚居区租金行情（2026年）

| 地区 | 房型 | 月租金 |
|------|------|--------|
| 上海 静安区/旧法租界 | 两居室 | CNY 12,000〜20,000 |
| 上海 徐汇区/古北（日籍人士聚集） | 两居室 | CNY 10,000〜18,000 |
| 北京 朝阳区 三里屯/望京 | 两居室 | CNY 10,000〜18,000 |
| 北京 朝阳区 国贸/CBD | 两居室 | CNY 12,000〜22,000 |
| 深圳 南山区（科技中心） | 两居室 | CNY 8,000〜15,000 |

上海古北地区是在华日籍人士最集中的社区，日语医疗机构、日系超市及日本学校配套完善。北京朝阳区集聚了各国大使馆及跨国公司总部。

### 费用一览

| 项目 | 费用 |
|------|------|
| Z签证申请费（在日本申请） | 约CNY 800〜1,200（等值） |
| 工作类居留许可 | 约CNY 400 |
| 外国人工作许可证（FWPRC） | 约CNY 400〜800 |
| 体格检查（指定医疗机构） | 约CNY 500〜1,500 |

### 移居前检查清单

1. **体格检查（体检）**：申请工作类居留许可的必备材料，须在政府指定医疗机构完成；部分日本机构亦具备资质，请提前核实
2. **学历证明认证（附加认证/Apostille）**：大学毕业证及成绩单须经日本外务省附加认证，办理周期较长，务必提前准备
3. **公安局外国人登记（24小时内）**：抵达后24小时内须前往辖区派出所完成外国人住宿登记；入住酒店的由酒店代为办理
4. **网络环境准备**：中国大陆屏蔽谷歌、YouTube、LINE、WhatsApp、Instagram等服务。建议提前规划VPN方案（法律层面存在灰色地带）或向雇主咨询是否提供国际网络接入
5. **六年规则的策略性运用**：建议与税务顾问合作，系统管理出境记录、规划六年计数重置方案，可实现显著节税效果

使用MoveWorth模拟您在中国的税负和生活成本。

---

### 参考资料

本文信息基于以下官方资料整理。

- **Z签证（工作）申请对象与所需材料**: [外交部官方页面](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140718_961555.shtml)
- **M签证（经贸/商务）申请对象与所需材料**: [外交部官方页面](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140717_961496.shtml)
- **R签证（高端人才）申请对象与所需材料**: [外交部官方页面](https://cs.mfa.gov.cn/wgrlh/lhqz/cjwdn_660600/201407/t20140718_961502.shtml)
- **签证申请中心**: [中国签证申请服务中心（CVASC）](https://www.visaforchina.cn/)
- **外籍人士居留及工作许可**: [国家移民管理局（NIA）](https://www.nia.gov.cn/n741440/index.html)`,
    },
  },
  {
    slug: "visa-in",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-in.webp",
    title: {
      ja: "【2026年最新版】インドのビザ・就労許可完全ガイド｜就労ビザ・OCIカード・新税制",
      en: "India Work Permit & Employment Visa Guide 2026 | Employment Visa, OCI Card, New Tax Regime",
      zh: "【2026年最新】印度签证与就业许可完全指南｜就业签证、OCI卡、新税制",
    },
    description: {
      ja: "就労ビザ（USD 25,000/年以上）・ビジネスビザ（5年マルチ）・OCIカード・新税制（0〜30%）まで、2026年最新データでインド就労・移住を完全解説。ムンバイ・バンガロール外国人エリアの家賃相場・EPF・費用一覧付き。",
      en: "India work permit and employment visa requirements 2026 — Employment Visa (USD 25,000/yr min), Business Visa (5yr multi), OCI Card, New Tax Regime (0–30%) — complete guide with Mumbai/Bangalore expat-area rents, EPF contributions, and full fee tables.",
      zh: "就业签证（年薪USD 25,000以上）、商务签证（5年多次）、OCI卡、新税制（0〜30%）——2026年最新印度工作移居完全指南，含孟买/班加罗尔外籍人士聚居区租金、EPF及费用一览。",
    },
    content: {
      ja: `インドは世界最大の人口を誇り、IT・金融・製造業の急成長によりムンバイ・バンガロール（ベンガルール）・デリー・ハイデラバードなどの都市に多くの外国人専門家が集まっています。近年はスタートアップ・エコシステムの拡大も著しく、外資系企業の進出も続いています。インドのビザ制度は国籍によって要件が異なる部分があるため、最新情報の確認が重要です。

### 主なビザの種類

**就労ビザ（Employment Visa / E Visa）** ｜ [入管局公式：就労ビザ（E Visa）の要件](https://boi.gov.in/boi/contents/travelling-to-india/foreigners/work-in-india)
インドの雇用主から雇用オファーを受けた外国人向け。
- 最低年収：**USD 25,000以上**（IT・医療・教育等の一部職種は免除あり）
- 有効期間：最初は1年間（最長5年まで更新可能）
- 雇用主のスポンサー（インド法人）が必要

**ビジネスビザ（Business Visa / B Visa）** ｜ [入管局公式：ビジネスビザ（B Visa）の要件](https://boi.gov.in/boi/contents/travelling-to-india/foreigners/business-in-india)
商用・業務渡航向けの多目的ビザ。インド国内での直接就労・報酬の受け取りは不可。
- 有効期間：最長5年（マルチエントリー）
- 商談・会議・展示会参加等に使用可能

**e-Visa（電子ビザ）** ｜ [公式e-Visa申請ポータル（Indian Visa Online）](https://indianvisaonline.gov.in/evisa/tvoa.html)
観光・短期ビジネス・医療・会議参加向けの電子ビザ。171カ国以上の国籍に対応。
- 有効期間：観光は30日・60日・365日の選択制
- インド主要27空港・主要5海港からの入国に対応
- 大使館窓口不要でオンラインのみで申請可能

**企業内転勤（Intra-Company Transfer）**
多国籍企業の従業員をインドのグループ会社に派遣する際に活用。
- 就労ビザの一形態として処理されることが多い

**OCIカード（Overseas Citizen of India）**
インド系外国人（インド国籍を保有していたか、インド国籍者の子・孫・配偶者）向けの準永住権的制度。
- **生涯有効なインドへの複数入国ビザ**
- 就労・就学・不動産取得（農地を除く）がほぼインド市民と同様の条件で可能
- インド政府による継続的なOCI権利拡充が進む

### 税制の詳細

**個人所得税（新税制・FY2025-26）**
インドには「新税制（New Tax Regime）」と「旧税制（Old Tax Regime）」があり、どちらかを選択可能。2024-25年度から新税制がデフォルト。

| 課税所得（INR） | 新税制税率 |
|--------------|---------|
| 0〜300,000 | 0% |
| 300,001〜700,000 | 5% |
| 700,001〜1,000,000 | 10% |
| 1,000,001〜1,200,000 | 15% |
| 1,200,001〜1,500,000 | 20% |
| 1,500,001以上 | 30% |

- 標準控除：INR 75,000（新税制）/ INR 50,000（旧税制）
- 税額還付（Tax Rebate u/s 87A）：年収INR 700,000以下の場合、最大INR 25,000の還付あり（実質ゼロ税）
- 非居住者（RNOR・NR）：インド国内源泉所得のみ課税

### 社会保険・EPF（従業員積立基金）

| 種別 | 従業員 | 雇用主 |
|------|--------|--------|
| EPF（Employees' Provident Fund） | 12% | 12%（一部はEPS・EDLI等へ） |
| ESI（Employees' State Insurance、月収INR 21,000以下） | 0.75% | 3.25% |

外国人駐在員のEPF加入は原則任意（国際労働者として免除申請可能な場合あり）。インド-日本社会保障協定の下での免除申請も確認を。

### 外国人居住エリアの家賃相場（2026年）

| エリア | 物件タイプ | 月額賃料 |
|--------|-----------|---------|
| ムンバイ Bandra West（外国人人気） | 2BR | INR 80,000〜150,000 |
| ムンバイ Powai（IT・住宅街） | 2BR | INR 60,000〜100,000 |
| バンガロール Koramangala（スタートアップ中心） | 2BR | INR 50,000〜90,000 |
| バンガロール Indiranagar | 2BR | INR 45,000〜80,000 |
| グルグラム（デリー近郊、日本人多数） | 2BR | INR 40,000〜80,000 |

ムンバイのBandra Westはセレブ・外国人が集中する高級エリア。バンガロールのKoramangalaはITスタートアップの聖地で外国人コミュニティも充実。デリー近郊のグルグラム（旧グルガオン）は日系企業・日本人学校・日本食レストランが集中している。

### 費用一覧

| 項目 | 費用 |
|------|------|
| 就労ビザ（E Visa） | 約USD 80〜160 |
| ビジネスビザ（B Visa） | 約USD 80〜160 |
| OCIカード申請費 | 約USD 275 |
| FRRO登録（e-FRRO） | 無料（オンライン） |

### 移住前チェックリスト

1. **FRRO登録（e-FRRO）**：就労ビザ取得者はインド到着後**14日以内**にe-FRROオンラインシステムで外国人登録が義務付け。滞在先の変更のたびに更新が必要
2. **PANカード（永久口座番号）の取得**：インドの税務識別番号（Permanent Account Number）。就労・銀行口座開設・不動産取引・株式投資に必須。Form 49AA（外国人用）で申請
3. **AADHARカード**：インドの国民ID番号（12桁）。居住外国人も一定要件を満たせば申請可能（居住6ヶ月以上等）。携帯電話契約・各種サービス利用に便利
4. **民間医療保険の加入**：インドの公的医療保険（Employee State Insurance/CGHS）は一般外国人には適用されないため、国際医療保険への加入が強く推奨される
5. **居住環境の選択**：ゲーテッドコミュニティ（Gated Community）またはサービスアパートメントを選ぶと水道・電気・セキュリティの品質が安定。賃貸は通常10ヶ月〜11ヶ月分の保証金（デポジット）が必要

MoveWorthでインドの生活費・税負担をシミュレーションしてみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **就労ビザ（E Visa）公式情報**: [入国管理局 – 就労ビザ要件](https://boi.gov.in/boi/contents/travelling-to-india/foreigners/work-in-india)
- **ビジネスビザ（B Visa）公式情報**: [入国管理局 – ビジネスビザ要件](https://boi.gov.in/boi/contents/travelling-to-india/foreigners/business-in-india)
- **e-Visa申請**: [Indian Visa Online – e-Visa公式ポータル](https://indianvisaonline.gov.in/evisa/tvoa.html)
- **入国管理局（Bureau of Immigration）**: [インド入国管理局 – 公式ポータル](https://boi.gov.in/boi)`,
      en: `India is the world's most populous country, with a rapidly growing economy in IT, finance, and manufacturing drawing international professionals to Mumbai, Bangalore (Bengaluru), Delhi, and Hyderabad. The startup ecosystem has also expanded dramatically in recent years. Note that visa requirements can vary by nationality — always verify current requirements with the nearest Indian consulate.

### Main Visa Types

**Employment Visa (E Visa)** ｜ [BoI Official: Employment Visa Requirements](https://boi.gov.in/boi/contents/travelling-to-india/foreigners/work-in-india)
For foreign nationals with a confirmed job offer from an Indian employer.
- Minimum annual salary: **USD 25,000+** (some exemptions for IT, healthcare, education roles)
- Validity: 1 year initially, renewable up to 5 years
- An Indian-registered employer (sponsor) is required

**Business Visa (B Visa)** ｜ [BoI Official: Business Visa Requirements](https://boi.gov.in/boi/contents/travelling-to-india/foreigners/business-in-india)
For commercial and business travel — direct employment or receiving salary in India is not permitted.
- Validity: up to 5 years (multi-entry)
- Suitable for meetings, conferences, trade fairs, and consultations

**e-Visa (Electronic Visa)** ｜ [Apply: India e-Visa Official Portal](https://indianvisaonline.gov.in/evisa/tvoa.html)
Electronic visa for tourism, short-term business, medical, and conference purposes — available to nationals of 171+ countries.
- Validity: 30 days, 60 days, or 365 days (tourism)
- Valid at 27 major Indian airports and 5 major seaports
- Fully online application — no consulate visit required

**Intra-Company Transfer**
For multinational employees relocating to an Indian group company — typically processed as an Employment Visa variant.

**OCI Card (Overseas Citizen of India)**
For persons of Indian origin (former Indian nationals, children/grandchildren of Indian citizens, or spouses).
- **Lifelong multiple-entry visa** with no time limit per visit
- Near-equal rights to Indian citizens for work, study, and property ownership (excluding agricultural land)
- OCI rights have been progressively expanded by the Indian government

### Tax System in Detail

**Personal Income Tax — New Tax Regime (FY 2025-26)**
India has two regimes: New (default since FY 2024-25) and Old (with deductions/exemptions). Most expats use the New Regime.

| Taxable Income (INR) | New Regime Rate |
|----------------------|-----------------|
| 0–300,000 | 0% |
| 300,001–700,000 | 5% |
| 700,001–1,000,000 | 10% |
| 1,000,001–1,200,000 | 15% |
| 1,200,001–1,500,000 | 20% |
| Above 1,500,000 | 30% |

- Standard deduction: INR 75,000 (New Regime) / INR 50,000 (Old Regime)
- Tax Rebate (Section 87A): If total income is ≤ INR 700,000, rebate of up to INR 25,000 — effectively zero tax below this threshold
- Non-residents (RNOR/NR): Taxed only on India-sourced income

### Social Insurance & EPF

| Category | Employee | Employer |
|----------|----------|----------|
| EPF (Employees' Provident Fund) | 12% | 12% (split across EPF/EPS/EDLI) |
| ESI (salary ≤ INR 21,000/month) | 0.75% | 3.25% |

Foreign assignees may be exempt from EPF as "International Workers" — check the India-Japan Social Security Agreement for potential double-contribution relief.

### Expat-Area Rents (2026)

| Area | Type | Monthly Rent |
|------|------|-------------|
| Mumbai – Bandra West (expat favourite) | 2BR | INR 80,000–150,000 |
| Mumbai – Powai (IT, residential) | 2BR | INR 60,000–100,000 |
| Bangalore – Koramangala (startup hub) | 2BR | INR 50,000–90,000 |
| Bangalore – Indiranagar | 2BR | INR 45,000–80,000 |
| Gurugram / Gurgaon (Delhi NCR, Japanese hub) | 2BR | INR 40,000–80,000 |

Mumbai's Bandra West is the premium expat area with international dining, serviced apartments, and secure housing. Bangalore's Koramangala is India's startup capital with a large international tech community. Gurugram (Delhi NCR) is the main hub for Japanese companies, Japanese schools, and Japanese restaurants.

### Fee Table

| Item | Cost |
|------|------|
| Employment Visa (E Visa) | ~USD 80–160 |
| Business Visa (B Visa) | ~USD 80–160 |
| OCI Card | ~USD 275 |
| e-FRRO registration | Free (online) |

### Pre-Move Checklist

1. **e-FRRO Registration**: Employment Visa holders must register within **14 days** of arrival via the e-FRRO online portal. Update required every time your address changes
2. **PAN Card**: India's Permanent Account Number — required for employment, banking, property transactions, and investments. Apply using Form 49AA (foreign national version)
3. **AADHAAR Card**: India's 12-digit national ID. Resident foreigners (6+ months of stay) may apply — useful for mobile SIMs and various services
4. **Private health insurance**: ESI and government healthcare are not available to most foreign nationals — international health insurance is strongly recommended
5. **Choose gated community housing**: Gated residential communities or serviced apartments offer stable utilities, security, and maintenance. Security deposits in India are typically 10–11 months of rent

Use MoveWorth to simulate your tax burden and living costs in India.

---

### References

This article is based on the following official sources.

- **Employment Visa (E Visa) — official info**: [Bureau of Immigration – Employment Visa](https://boi.gov.in/boi/contents/travelling-to-india/foreigners/work-in-india)
- **Business Visa (B Visa) — official info**: [Bureau of Immigration – Business Visa](https://boi.gov.in/boi/contents/travelling-to-india/foreigners/business-in-india)
- **e-Visa application**: [Indian Visa Online – e-Visa Official Portal](https://indianvisaonline.gov.in/evisa/tvoa.html)
- **Bureau of Immigration (BoI)**: [India Bureau of Immigration – Official Portal](https://boi.gov.in/boi)`,
      zh: `印度是世界人口最多的国家，IT、金融和制造业快速增长，吸引了大量国际专业人士聚集于孟买、班加罗尔（本加卢鲁）、德里和海德拉巴等城市。近年来创业生态系统也大幅扩张，跨国企业持续布局印度市场。印度签证要求因国籍不同而有所差异，申请前建议向最近的印度领事馆确认最新规定。

### 主要签证类型

**就业签证（E签证）** ｜ [移民局官方：就业签证要求](https://boi.gov.in/boi/contents/travelling-to-india/foreigners/work-in-india)
持有印度雇主录用通知的外籍人员。
- 最低年薪：**USD 25,000以上**（IT、医疗、教育等部分职类可豁免）
- 有效期：最初1年，最长可续签至5年
- 须有印度注册企业担任保荐雇主

**商务签证（B签证）** ｜ [移民局官方：商务签证要求](https://boi.gov.in/boi/contents/travelling-to-india/foreigners/business-in-india)
适用于商业及业务出行，不允许在印度境内直接就业或领取薪酬。
- 有效期：最长5年（多次入境）
- 适用于商务洽谈、参加会议/展览等

**电子签证（e-Visa）** ｜ [官方e-Visa申请门户（Indian Visa Online）](https://indianvisaonline.gov.in/evisa/tvoa.html)
适用于旅游、短期商务、就医及参加会议的电子签证，覆盖171个以上国家国籍。
- 旅游类有效期可选：30天、60天或365天
- 支持印度27个主要国际机场及5个主要港口入境
- 全流程在线申请，无需前往领事馆

**公司内部调任**
适用于跨国公司员工调往印度关联公司，通常作为就业签证的一种形式处理。

**OCI卡（印度海外公民卡）**
适用于印度裔外籍人士（曾持印度国籍者、印度公民的子女/孙辈或配偶）。
- **终身有效的印度多次入境签证**，单次停留无时间限制
- 工作、学习及购置房产（农业用地除外）的权利与印度公民基本相同
- 印度政府持续扩大OCI持有人的相关权利

### 税制详解

**个人所得税——新税制（FY 2025-26）**
印度设有新税制（自FY 2024-25起为默认适用）和旧税制（含各类扣除/豁免）两套体系，可自行选择，多数外籍人士适用新税制。

| 应税收入（INR） | 新税制税率 |
|--------------|---------|
| 0〜300,000 | 0% |
| 300,001〜700,000 | 5% |
| 700,001〜1,000,000 | 10% |
| 1,000,001〜1,200,000 | 15% |
| 1,200,001〜1,500,000 | 20% |
| 1,500,001以上 | 30% |

- 标准扣除：INR 75,000（新税制）/ INR 50,000（旧税制）
- 税收抵免（第87A条）：年收入不超过INR 700,000者可享最高INR 25,000抵免，实际税负为零
- 非居民（RNOR/NR）：仅就印度来源收入征税

### 社会保险与员工公积金（EPF）

| 类别 | 雇员 | 雇主 |
|------|------|------|
| EPF（员工公积金） | 12% | 12%（分配至EPF/EPS/EDLI） |
| ESI（月薪≤INR 21,000） | 0.75% | 3.25% |

外籍驻印人员可作为"国际劳工"申请豁免EPF参保，具体情况建议参照印日社会保障协定，咨询是否可免除双重缴费。

### 外籍人士聚居区租金行情（2026年）

| 地区 | 房型 | 月租金 |
|------|------|--------|
| 孟买 Bandra West（外籍人士首选） | 两居室 | INR 80,000〜150,000 |
| 孟买 Powai（IT/住宅区） | 两居室 | INR 60,000〜100,000 |
| 班加罗尔 Koramangala（创业中心） | 两居室 | INR 50,000〜90,000 |
| 班加罗尔 Indiranagar | 两居室 | INR 45,000〜80,000 |
| 古尔冈/古鲁格拉姆（德里近郊，日籍聚集） | 两居室 | INR 40,000〜80,000 |

孟买Bandra West是顶级外籍人士聚居区，国际餐厅、服务式公寓和安保住宅资源充足。班加罗尔Koramangala是印度创业中心，国际科技社区活跃。古尔冈是日本企业、日本学校和日餐聚集的核心区域。

### 费用一览

| 项目 | 费用 |
|------|------|
| 就业签证（E签证） | 约USD 80〜160 |
| 商务签证（B签证） | 约USD 80〜160 |
| OCI卡 | 约USD 275 |
| e-FRRO登记 | 免费（在线） |

### 移居前检查清单

1. **e-FRRO登记**：持就业签证者须在抵达后**14天内**通过e-FRRO在线系统完成外国人登记，每次更换住址须重新更新
2. **PAN卡（永久账户号码）申请**：就业、银行开户、房产交易及证券投资必备的税务识别号，外籍人士须填写Form 49AA申请
3. **AADHAAR卡**：印度12位国民身份码；在印居住满6个月的外籍居民可申请，对办理手机套餐及各类服务十分便利
4. **购买私人医疗保险**：员工国家保险（ESI）及政府医疗服务一般不对外籍人士开放，强烈建议购买国际医疗保险
5. **选择围墙社区住宅**：围墙社区（Gated Community）或服务式公寓的水电、安保和物业维护质量更有保障；印度租房通常需缴纳相当于10〜11个月租金的押金

使用MoveWorth模拟您在印度的税负和生活成本。

---

### 参考资料

本文信息基于以下官方资料整理。

- **就业签证（E签证）官方信息**: [移民局 – 就业签证要求](https://boi.gov.in/boi/contents/travelling-to-india/foreigners/work-in-india)
- **商务签证（B签证）官方信息**: [移民局 – 商务签证要求](https://boi.gov.in/boi/contents/travelling-to-india/foreigners/business-in-india)
- **电子签证申请**: [印度签证在线 – e-Visa官方门户](https://indianvisaonline.gov.in/evisa/tvoa.html)
- **移民局（Bureau of Immigration）**: [印度移民局 – 官方门户](https://boi.gov.in/boi)`,
    },
  },
  {
    slug: "visa-mx",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-mx.webp",
    title: {
      ja: "メキシコ ビザ・就労許可完全ガイド【2026年最新版】｜一時居住者・デジタルノマド・税制",
      en: "Mexico Visa & Work Permit Guide 2026 | Temporary Resident Visa, Digital Nomad, Rentista",
      zh: "【2026年最新】墨西哥签证与就业许可完全指南｜临时居民、数字游民、税制",
    },
    description: {
      ja: "一時居住者ビザ（MXN 43,000/月）・就労ルート・レンティスタビザ・ISR累進税率（1.92〜35%）まで、2026年最新データでメキシコ移住を完全解説。メキシコシティ外国人エリアの家賃相場・IMSS・費用一覧付き。",
      en: "Temporary Resident Visa (MXN 43,000/mo), Employment Route, Rentista Visa, ISR tax (1.92–35%) — Mexico 2026 complete guide with Mexico City expat-area rents, IMSS contributions, and full fee tables.",
      zh: "临时居民签证（MXN 43,000/月）、就业路径、被动收入签证、ISR累进税（1.92〜35%）——2026年最新墨西哥移居完全指南，含墨西哥城外籍人士聚居区租金、IMSS及费用一览。",
    },
    content: {
      ja: `メキシコは北米最大のスペイン語圏の国で、温暖な気候・豊かな文化・比較的安い物価から、デジタルノマドや海外移住者に急速に人気を集めています。メキシコシティ（CDMX）のコンデサ・ロマノルテ地区は「ラテンアメリカのベルリン」とも呼ばれ、外国人クリエイティブ・ITワーカーのコミュニティが急成長しています。

### 主なビザ・居留許可の種類

**一時居住者ビザ（Residente Temporal）**
1〜4年間メキシコに居住するための最も一般的な許可。

*経済的十分性ルート（Economic Solvency Route）*
- 銀行残高：過去12ヶ月の平均月次残高が**MXN 43,000相当以上**（約USD 2,100）
- または月収：MXN 43,000相当以上の定期収入の証明
- 有効期間：1〜4年、更新可能
- 就労は原則不可（ただし申請して就労許可を追加取得することは可能）

*就労ルート（雇用スポンサー付き）*
- メキシコ企業からの雇用オファーが必要
- 雇用主がINM（国家移民局）に申請
- 就労許可（ビザ内に内包）が自動的に付与される
- 有効期間：雇用期間に応じて1〜4年

**永住者ビザ（Residente Permanente）**
- 4年間の一時居住者ビザ保有後、または
- メキシコ市民との婚姻、または
- 退職者要件（月収MXN 43,000以上の年金）を満たした場合に取得可能
- 更新不要の無期限居住許可

**レンティスタ（Rentista / 不労所得者向け）**
年金・投資収入・不動産賃料等のパッシブインカムを持つ人向け。
- 最低月収：MXN 43,000相当以上のパッシブインカムの証明が必要
- 有効期間：1〜4年

### 税制の詳細

**ISR（所得税）累進税率（居住者：183日以上）**

| 課税所得（MXN/年） | 税率（限界） |
|----------------|----------|
| 0〜8,952 | 1.92% |
| 8,953〜75,984 | 6.4% |
| 75,985〜133,536 | 10.88% |
| 133,537〜155,232 | 16.0% |
| 155,233〜185,852 | 17.92% |
| 185,853〜374,837 | 21.36% |
| 374,838〜590,796 | 23.52% |
| 590,797〜1,127,926 | 30.0% |
| 1,127,927〜1,503,902 | 32.0% |
| 1,503,903〜4,511,704 | 34.0% |
| 4,511,705以上 | **35%** |

**非居住者（183日未満）**：メキシコ国内源泉所得のみ課税（15〜30%）。外国法人からリモートで働くデジタルノマドはメキシコ源泉所得なしとして非居住者扱いになるケースが多い。

### 社会保険（IMSS：メキシコ社会保険公社）

| 種別 | 従業員負担 | 雇用主負担 |
|------|---------|---------|
| 疾病・出産保険 | 0.4% | 約1% |
| 障害・生命保険 | 0.625% | 1.75% |
| 老齢・退職 | 1.125% | 3.15% |
| 住宅基金（INFONAVIT） | - | 5.0% |
| 合計（概算） | **約1.65%** | **約25%** |

フリーランサー・自営業者はIMSSへの任意加入が可能（医療等の福利厚生のために加入を検討する価値あり）。

### 外国人居住エリアの家賃相場（2026年）

| エリア | 物件タイプ | 月額賃料 |
|--------|-----------|---------|
| メキシコシティ Polanco（高級・日本人多数） | 2BR | MXN 25,000〜45,000 |
| メキシコシティ Condesa/Roma Norte（外国人多数） | 2BR | MXN 18,000〜30,000 |
| メキシコシティ Santa Fe（ビジネス街） | 2BR | MXN 20,000〜35,000 |
| グアダラハラ Zapopan | 2BR | MXN 12,000〜22,000 |
| プラヤデルカルメン（ビーチリゾート・ノマド人気） | 2BR | MXN 15,000〜28,000 |

PolancoはLVMH・HSBC等の国際企業が集中し、日本食レストランも多数。CondeSa・Roma Norteは外国人クリエイター・IT系ノマドのコミュニティが最も活発。グアダラハラはメキシコの「シリコンバレー」と呼ばれIT企業が多く、家賃はCDMXより40〜50%安い。

### 費用一覧

| 項目 | 費用 |
|------|------|
| 一時居住者ビザ申請費（メキシコ大使館） | 約MXN 5,000〜6,000相当 |
| 居住者カード（CANJE）発行費 | 約MXN 3,500 |
| 永住者ビザ申請費 | 約MXN 5,000 |
| RFCの登録 | 無料（SATオフィス） |
| CURPの取得 | 無料 |

### 移住前チェックリスト

1. **CANJE（在留カード切替）の手続き**：入国後**30日以内**にINM（国家移民局）でビザを居住者カードに切り替える手続きが必要。これをしないと不法滞在扱いになるリスクがある
2. **RFC（連邦納税者登録）の取得**：メキシコの税務識別番号。SAT（税務局）のオフィスまたはオンラインで取得。就労・銀行口座開設・不動産賃貸契約に必要
3. **CURP（国民登録コード）の取得**：メキシコの個人識別番号（18桁）。行政サービスほぼすべてに必要。RFCと一緒に取得しておくと効率的
4. **医療保険の確認**：IMSSへの加入がない場合、民間医療保険（例：AXA・GNP等）への加入を強く推奨。GNPやAXAはメキシコ国内の幅広いネットワークを持つ
5. **デジタルノマドとしての法的地位の確認**：外国法人向けリモートワーカーの場合、非居住者として扱われることが多いが、183日ルールを越えると居住者課税が適用される。滞在日数の管理と税務アドバイザーへの相談を推奨

MoveWorthでメキシコの生活費・税負担をシミュレーションしてみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [メキシコ国立移民局（INM）公式サイト](https://www.inm.gob.mx/)
- **ビザカテゴリ詳細**: [メキシコ外務省 – ビザ情報ポータル](https://www.gob.mx/sre/documentos/visas-para-mexico)`,
      en: `Mexico is the largest Spanish-speaking country in North America, and its warm climate, rich culture, and affordable cost of living have made it one of the fastest-growing destinations for digital nomads and international residents. Mexico City's Condesa and Roma Norte districts — often called the "Berlin of Latin America" — have become a major hub for foreign creatives and tech workers.

### Main Visa & Permit Types

**Temporary Resident Visa (Residente Temporal)**
The most common permit for stays of 1–4 years.

*Economic Solvency Route*
- Bank balance: monthly average of **MXN 43,000+** (~USD 2,100) over the past 12 months
- Or monthly income of MXN 43,000+, proven with bank statements
- Validity: 1–4 years, renewable
- Work is not automatically included (can be added as a separate endorsement)

*Employment Route*
- Requires a job offer from a Mexican employer
- Employer applies through the INM (Instituto Nacional de Migración)
- Work authorization is automatically included
- Validity: 1–4 years based on employment contract length

**Permanent Resident Visa (Residente Permanente)**
- After 4 years as a Temporary Resident, or
- Marriage to a Mexican national, or
- Retirement (minimum pension income of MXN 43,000/month)
- Indefinite, no renewal required

**Rentista (Passive Income Resident)**
For those with pension, investment, or rental income.
- Minimum monthly passive income: MXN 43,000+
- Validity: 1–4 years

### Tax System in Detail

**ISR (Income Tax) — Progressive Rates (Residents: 183+ days)**

| Annual Taxable Income (MXN) | Marginal Rate |
|-----------------------------|---------------|
| 0–8,952 | 1.92% |
| 8,953–75,984 | 6.4% |
| 75,985–133,536 | 10.88% |
| 133,537–185,852 | 16–17.92% |
| 185,853–590,796 | 21.36–23.52% |
| 590,797–1,127,926 | 30% |
| 1,127,927–4,511,704 | 32–34% |
| Above 4,511,705 | **35%** |

**Non-Residents (under 183 days)**: Taxed only on Mexico-sourced income (15–30%). Digital nomads working remotely for foreign companies often qualify as non-residents with no Mexican-source income.

### Social Insurance (IMSS)

| Category | Employee | Employer |
|----------|----------|----------|
| Illness & Maternity | 0.4% | ~1% |
| Disability & Life | 0.625% | 1.75% |
| Retirement | 1.125% | 3.15% |
| Housing Fund (INFONAVIT) | — | 5.0% |
| **Total (approx.)** | **~1.65%** | **~25%** |

Freelancers and self-employed can voluntarily enroll in IMSS for healthcare access — worth considering for longer stays.

### Expat-Area Rents in Mexico (2026)

| Area | Type | Monthly Rent |
|------|------|-------------|
| Mexico City – Polanco (upmarket, Japanese hub) | 2BR | MXN 25,000–45,000 |
| Mexico City – Condesa / Roma Norte (expat favourite) | 2BR | MXN 18,000–30,000 |
| Mexico City – Santa Fe (business district) | 2BR | MXN 20,000–35,000 |
| Guadalajara – Zapopan | 2BR | MXN 12,000–22,000 |
| Playa del Carmen (beach / nomad hub) | 2BR | MXN 15,000–28,000 |

Polanco hosts international companies (LVMH, HSBC) and multiple Japanese restaurants — the main Japanese expat hub in Mexico. Condesa and Roma Norte are the most vibrant international community areas. Guadalajara is Mexico's IT hub ("Silicon Valley of Mexico") with rents 40–50% below CDMX.

### Fee Table

| Item | Cost |
|------|------|
| Temporary Resident Visa (Mexican embassy) | ~MXN 5,000–6,000 equivalent |
| Resident Card issuance (CANJE) | ~MXN 3,500 |
| Permanent Resident Visa | ~MXN 5,000 |
| RFC registration | Free (SAT office) |
| CURP issuance | Free |

### Pre-Move Checklist

1. **CANJE within 30 days**: After arrival, convert your visa to a Resident Card at the INM within **30 days** — failure to do so creates immigration compliance issues
2. **RFC (Federal Taxpayer Registry)**: Mexico's tax ID number — required for employment, banking, and lease contracts. Register at a SAT office or online
3. **CURP (Population Registry Code)**: Mexico's 18-digit personal ID — needed for nearly all government services. Obtain it alongside your RFC
4. **Health insurance**: Without IMSS coverage, private insurance (AXA, GNP, etc.) is strongly recommended — both have wide networks across Mexico
5. **Digital nomad tax status**: If you work remotely for a foreign company, you likely qualify as a non-resident with zero Mexican tax liability — but exceeding 183 days triggers residency and worldwide income taxation. Track your days and consult a Mexican tax advisor

Use MoveWorth to simulate your tax burden and living costs in Mexico.

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits General**: [Mexico National Immigration Institute (INM)](https://www.inm.gob.mx/)
- **Visa Category Details**: [Mexican Ministry of Foreign Affairs – Visa Information Portal](https://www.gob.mx/sre/documentos/visas-para-mexico)`,
      zh: `墨西哥是北美最大的西班牙语国家，温暖的气候、丰富的文化和低廉的生活成本，使其迅速成为数字游民和外籍居民的热门选择。墨西哥城的Condesa和Roma Norte区——有时被称为"拉丁美洲的柏林"——已成为外籍创意工作者和科技从业者的重要聚集地。

### 主要签证与居留许可类型

**临时居民签证（Residente Temporal）**
适用于1〜4年居留的最常见许可。

*经济偿付能力路径*
- 银行存款：过去12个月月均余额不低于**MXN 43,000**（约USD 2,100）
- 或月收入：不低于MXN 43,000，需提供银行流水证明
- 有效期：1〜4年，可续签
- 默认不含工作权限（可另行申请附加工作授权）

*就业路径*
- 须持有墨西哥雇主的录用通知
- 由雇主通过INM（国家移民局）提交申请
- 自动获得工作授权
- 有效期：根据劳动合同期限确定，最长4年

**永久居民签证（Residente Permanente）**
- 持临时居民签证满4年后，或
- 与墨西哥公民结婚，或
- 符合退休条件（月养老金收入MXN 43,000以上）
- 永久有效，无需续签

**被动收入居留（Rentista）**
适用于持有养老金、投资或租金等被动收入的人士。
- 最低月被动收入：MXN 43,000以上
- 有效期：1〜4年

### 税制详解

**ISR（所得税）累进税率（居民：年居住183天以上）**

| 年应税收入（MXN） | 边际税率 |
|----------------|--------|
| 0〜8,952 | 1.92% |
| 8,953〜75,984 | 6.4% |
| 75,985〜133,536 | 10.88% |
| 133,537〜185,852 | 16〜17.92% |
| 185,853〜590,796 | 21.36〜23.52% |
| 590,797〜1,127,926 | 30% |
| 1,127,927〜4,511,704 | 32〜34% |
| 4,511,705以上 | **35%** |

**非居民（不足183天）**：仅就墨西哥来源收入征税（15〜30%）。为境外法人远程工作的数字游民通常以非居民身份处理，无墨西哥来源收入，税负为零。

### 社会保险（IMSS）

| 类别 | 雇员 | 雇主 |
|------|------|------|
| 疾病及生育保险 | 0.4% | 约1% |
| 伤残及人寿保险 | 0.625% | 1.75% |
| 养老退休 | 1.125% | 3.15% |
| 住房基金（INFONAVIT） | — | 5.0% |
| **合计（约）** | **约1.65%** | **约25%** |

自由职业者和个体经营者可自愿参加IMSS，享有医疗等福利，长期居留者值得考虑。

### 外籍人士聚居区租金行情（2026年）

| 地区 | 房型 | 月租金 |
|------|------|--------|
| 墨西哥城 Polanco（高档/日籍聚集） | 两居室 | MXN 25,000〜45,000 |
| 墨西哥城 Condesa/Roma Norte（外籍人士最爱） | 两居室 | MXN 18,000〜30,000 |
| 墨西哥城 Santa Fe（商业区） | 两居室 | MXN 20,000〜35,000 |
| 瓜达拉哈拉 Zapopan | 两居室 | MXN 12,000〜22,000 |
| 普拉亚德尔卡门（海滩/游民热点） | 两居室 | MXN 15,000〜28,000 |

Polanco聚集了LVMH、汇丰等国际企业及众多日餐，是墨西哥最主要的日籍人士聚居区。Condesa和Roma Norte国际社区最为活跃。瓜达拉哈拉被称为墨西哥"硅谷"，IT企业众多，租金较墨西哥城低40〜50%。

### 费用一览

| 项目 | 费用 |
|------|------|
| 临时居民签证（墨西哥大使馆） | 约MXN 5,000〜6,000（等值） |
| 居民卡发放（CANJE） | 约MXN 3,500 |
| 永久居民签证 | 约MXN 5,000 |
| RFC登记 | 免费（SAT办公室） |
| CURP办理 | 免费 |

### 移居前检查清单

1. **30天内办理CANJE**：抵达后须在**30天内**前往INM将签证转换为居民卡，逾期将面临移民合规问题
2. **RFC（联邦纳税人登记）办理**：墨西哥税务识别号，就业、银行开户和租房合同均需此号，可在SAT办公室或线上申请
3. **CURP（国民登记码）办理**：墨西哥18位个人身份码，几乎所有政府服务均需，建议与RFC同步办理
4. **医疗保险**：未参加IMSS者强烈建议购买私人医疗保险（AXA、GNP等），两家在全国均有完善网络
5. **数字游民税务身份确认**：为境外法人远程工作者通常以非居民身份处理，无需在墨西哥纳税；但若超过183天则触发居民税务义务，须就全球收入申报。建议追踪在境天数并咨询墨西哥税务顾问

使用MoveWorth模拟您在墨西哥的税负和生活成本。

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [墨西哥国家移民局（INM）官方网站](https://www.inm.gob.mx/)
- **签证类别详情**: [墨西哥外交部 – 签证信息门户](https://www.gob.mx/sre/documentos/visas-para-mexico)`,
    },
  },
  {
    slug: "visa-ar",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-ar.webp",
    title: {
      ja: "【2026年最新版】アルゼンチンのビザ・就労許可完全ガイド｜一時居住者・モノトリブート・インフレ対策",
      en: "Argentina Visa & Work Permit Complete Guide 2026 | Temporary Residency, Monotributo, Inflation Tips",
      zh: "【2026年最新】阿根廷签证与就业许可完全指南｜临时居留、简易税制、通胀应对",
    },
    description: {
      ja: "一時居住者ビザ（USD 1,000/月）・就労・退職者・モノトリブート（月額固定）・居住者累進税（5〜35%）まで、2026年最新データでアルゼンチン移住を完全解説。ブエノスアイレス外国人エリアの家賃相場・通貨戦略・費用一覧付き。",
      en: "Temporary Residency (USD 1,000/mo), Work & Retired routes, Monotributo flat monthly tax, Resident progressive tax (5–35%) — Argentina 2026 complete guide with Buenos Aires expat-area rents, currency strategy, and full fee tables.",
      zh: "临时居留（USD 1,000/月）、就业/退休路径、Monotributo月固定税、居民累进税（5〜35%）——2026年最新阿根廷移居完全指南，含布宜诺斯艾利斯外籍人士聚居区租金、货币策略及费用一览。",
    },
    content: {
      ja: `アルゼンチンはラテンアメリカ最南端に位置する広大な国で、ブエノスアイレスをはじめとするヨーロッパ的な文化と景観を持つ都市、豊かな自然、そして外貨建てで見れば非常に安い物価が魅力です。デジタルノマドコミュニティが急成長しており、特にパレルモ・レコレタ地区は国際的な外国人移住者の拠点となっています。ただし慢性的な高インフレと通貨政策の不安定さは重要なリスク要因であり、事前の情報収集が不可欠です。

### 主なビザ・居住許可の種類

**一時居住者（Residencia Temporaria）**
アルゼンチンの中・長期居住の基本となる許可。複数のカテゴリがあります。

*レンティスタ（Rentista：不労所得者）*
- 最低月収：**USD 1,000相当以上**のパッシブインカム（年金・投資収益・不動産賃料等）
- 有効期間：1〜2年、更新可能
- 最も人気のあるデジタルノマド向けルート

*就労（Trabajo）*
- アルゼンチン企業からの雇用オファーが必要
- 有効期間：1〜3年

*退職者（Jubilado/Pensionado）*
- 海外からの年金受給者向け。月額最低年金収入の証明が必要
- 有効期間：1〜2年

**永住者（Residencia Permanente）**
- 一時居住者資格を**2年間**継続して維持した後に申請可能
- 更新不要の無期限居住許可

**MERCOSUR協定による優遇**
ブラジル・チリ・ウルグアイ・パラグアイ・ボリビア・コロンビア・エクアドル・ペルー等のMERCOSUR加盟国・準加盟国の市民は、雇用オファーなしで2年間の一時居住者資格を自動取得可能（MERCOSUR居住協定）。

### 税制の詳細

**個人所得税（居住者：Ganancias）**

| 課税所得（ARS/年） | 税率 |
|----------------|------|
| 〜1,091,403 | 5% |
| 1,091,404〜2,182,806 | 9% |
| 2,182,807〜3,274,209 | 12% |
| 3,274,210〜4,365,612 | 15% |
| 4,365,613〜6,548,418 | 19% |
| 6,548,419〜8,731,224 | 23% |
| 8,731,225〜13,096,836 | 27% |
| 13,096,837〜17,462,448 | 31% |
| 17,462,449以上 | **35%** |

※高インフレのため各ブラケットの金額は頻繁に更新されます。最新数値はAFIP公式サイトで確認を。

**非居住者**：アルゼンチン国内源泉所得のみ課税（12.5〜35%）。

**モノトリブート（Monotributo）**
フリーランサー・小規模個人事業主向けの簡易納税制度。
- 月額固定金額（カテゴリによってARS 20,000〜200,000超）で**所得税・社会保険・健康保険をすべてまとめて納付**
- ITサービス業・コンサルタント・クリエイターに特に人気
- 年間売上上限を超えると「自律者（Autónomo）」制度への移行が必要

### 社会保険（ANSES / SIPA）

| 種別 | 従業員負担 | 雇用主負担 |
|------|---------|---------|
| 年金（SIPA） | 11% | 12.71% |
| 健康保険（Obra Social） | 3% | 6% |
| 失業・家族手当基金 | — | 5.56% |
| 合計（概算） | **14%** | **24.27%** |

モノトリブート加入者は上記の代わりに月額固定額を支払うため、社保の内訳は異なります。

### 外国人居住エリアの家賃相場（2026年）

※アルゼンチンは高インフレのため、賃料はUSD建てで表示するのが実態（特に外国人向け物件）。

| エリア | 物件タイプ | 月額賃料（USD） |
|--------|-----------|-------------|
| ブエノスアイレス Palermo（外国人人気・ノマド拠点） | 2BR | USD 600〜1,200 |
| ブエノスアイレス Recoleta（高級・ヨーロッパ的） | 2BR | USD 700〜1,400 |
| ブエノスアイレス San Telmo（歴史的・アーティスト） | 2BR | USD 400〜800 |
| メンドーサ市内（ワイン・山岳地帯） | 2BR | USD 300〜600 |
| バリローチェ（パタゴニア・自然環境） | 2BR | USD 350〜700 |

パレルモはブエノスアイレスのデジタルノマド・外国人コミュニティの中心地で、コワーキングスペース・英語対応のカフェ・国際食料品店が充実。レコレタはヨーロッパ的な高級住宅街で大使館が集中。

### 費用一覧

※ARS建て費用はインフレにより変動します。申請時に必ず公式サイトで確認してください。

| 項目 | 費用 |
|------|------|
| 一時居住者申請費 | 約ARS 20,000〜（変動） |
| DNI（国民識別証）発行費 | 約ARS 2,000〜（変動） |
| 永住者申請費 | 約ARS 25,000〜（変動） |
| 公証・書類翻訳費 | USD 50〜200相当 |

### 移住前チェックリスト

1. **CUIL/CUITの取得**：就労・銀行口座開設・フリーランス活動・契約に必須のアルゼンチンの税務番号。移住後にAFIP（連邦税務局）または本人確認書類でRENAPER（市民登録局）で申請
2. **DNI（国民識別証）の取得**：一時居住者資格取得後に発行。銀行・携帯電話・賃貸契約・公共サービスのほぼすべてで必要
3. **インフレ・通貨への対応策**：アルゼンチンはInternational Monetary Fundが毎年注視するほどの高インフレ国。ARS建て資産は急速に価値が目減りするため、収入・貯蓄はUSDで受け取り・保管することを強く推奨。「ドル・メップ（MEP Dollar）」等の合法的な外貨両替ルートも調査を
4. **書類の翻訳・公証**：日本での書類（出生証明・無犯罪証明・婚姻証明等）はスペイン語への公証翻訳が必要。アルゼンチン大使館または認定翻訳者を利用
5. **医療保険・Obra Social**：就労者はIMSSに相当するObra Social（職域健康保険）に加入。フリーランサーはモノトリブートで保険カバーを取得するか、民間の国際保険（NRMA・Cigna等）を検討

MoveWorthでアルゼンチンの生活費・税負担をシミュレーションしてみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [アルゼンチン国立移民局（Migraciones）](https://www.argentina.gob.ar/interior/migraciones)
- **オンライン在留申請**: [RadEx – アルゼンチン在留オンライン申請ポータル](https://www.argentina.gob.ar/migraciones/radicacion-electronica)`,
      en: `Argentina is a vast country at the southern tip of Latin America, known for its European-influenced cities like Buenos Aires, stunning natural landscapes, and an exceptionally affordable cost of living when measured in foreign currency. The digital nomad community has grown rapidly, with Palermo and Recoleta becoming major international hubs. However, chronic high inflation and currency policy instability are key risk factors — thorough research before moving is essential.

### Main Visa & Permit Types

**Temporary Residency (Residencia Temporaria)**
The core permit for medium- to long-term residence, available in multiple categories.

*Rentista (Passive Income)*
- Minimum monthly income: **USD 1,000+** from pensions, investments, rental income, or other passive sources
- Validity: 1–2 years, renewable
- The most popular route for digital nomads

*Work (Trabajo)*
- Requires a job offer from an Argentine employer
- Validity: 1–3 years

*Retired Person (Jubilado/Pensionado)*
- For foreign pension recipients — proof of minimum monthly pension income required
- Validity: 1–2 years

**Permanent Residency (Residencia Permanente)**
- Apply after **2 years** of maintained temporary residency
- Indefinite, no renewal required

**MERCOSUR Agreement**
Citizens of Brazil, Chile, Uruguay, Paraguay, Bolivia, Colombia, Ecuador, Peru, and other MERCOSUR/associate members can obtain 2-year temporary residency automatically without a job offer.

### Tax System in Detail

**Personal Income Tax — Ganancias (Residents)**

| Annual Taxable Income (ARS) | Rate |
|-----------------------------|------|
| 0–1,091,403 | 5% |
| 1,091,404–2,182,806 | 9% |
| 2,182,807–3,274,209 | 12% |
| 3,274,210–4,365,612 | 15% |
| 4,365,613–6,548,418 | 19% |
| 6,548,419–8,731,224 | 23% |
| 8,731,225–13,096,836 | 27% |
| 13,096,837–17,462,448 | 31% |
| Above 17,462,449 | **35%** |

*Note: All ARS brackets are updated frequently due to high inflation — always check AFIP's official site for current figures.*

**Non-Residents**: Taxed only on Argentina-sourced income (12.5–35%).

**Monotributo (Simplified Tax Regime)**
A flat monthly payment for freelancers and small sole traders.
- A single monthly amount (category-dependent, ARS 20,000–200,000+) covers **income tax + social insurance + health insurance in one payment**
- Especially popular with IT consultants, designers, and remote workers
- Exceeding annual revenue limits requires switching to the Autónomo (self-employed) system

### Social Insurance (ANSES / SIPA)

| Category | Employee | Employer |
|----------|----------|----------|
| Pension (SIPA) | 11% | 12.71% |
| Health (Obra Social) | 3% | 6% |
| Unemployment / Family Fund | — | 5.56% |
| **Total (approx.)** | **14%** | **~24.27%** |

Monotributo members pay a flat monthly amount instead of the above, which covers social insurance under a simplified formula.

### Expat-Area Rents in Buenos Aires (2026)

*Note: Most foreign-facing leases in Buenos Aires are priced in USD to hedge against inflation.*

| Area | Type | Monthly Rent (USD) |
|------|------|--------------------|
| Palermo (nomad hub, expat favourite) | 2BR | USD 600–1,200 |
| Recoleta (upmarket, European feel) | 2BR | USD 700–1,400 |
| San Telmo (historic, artistic) | 2BR | USD 400–800 |
| Mendoza city centre (wine, mountains) | 2BR | USD 300–600 |
| Bariloche (Patagonia, nature) | 2BR | USD 350–700 |

Palermo is the main hub for Buenos Aires digital nomads and international residents, with coworking spaces, English-friendly cafés, and international grocery stores. Recoleta is an upmarket European-style neighbourhood with most foreign embassies.

### Fee Table

*ARS fees are highly subject to change due to inflation — always verify on the official AFIP/DNM website at time of application.*

| Item | Cost |
|------|------|
| Temporary Residency application | ~ARS 20,000+ (subject to change) |
| DNI issuance | ~ARS 2,000+ (subject to change) |
| Permanent Residency application | ~ARS 25,000+ (subject to change) |
| Document translation / notarization | USD 50–200 equivalent |

### Pre-Move Checklist

1. **CUIL/CUIT (Tax ID)**: Required for employment, banking, freelance activity, and contracts. Apply at AFIP (Federal Tax Authority) after arrival, or at RENAPER with ID documents
2. **DNI (National ID)**: Issued after obtaining temporary residency. Needed for banking, mobile SIM, rental contracts, and almost all daily services
3. **Inflation and currency strategy**: Argentina has one of the world's highest persistent inflation rates. ARS-denominated assets erode rapidly — receive and hold income and savings in USD. Research legal FX options like the "MEP Dollar" (financial dollar) for compliant currency exchange
4. **Document translation and notarization**: Japanese documents (birth certificate, police clearance, marriage certificate, etc.) require certified Spanish translation. Use the Argentine embassy or an accredited translator
5. **Health insurance (Obra Social)**: Employed workers join their sector's Obra Social (workplace health insurance). Freelancers get basic coverage through Monotributo, or can purchase international private insurance (NRMA, Cigna, etc.)

Use MoveWorth to simulate your tax burden and living costs in Argentina.

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits General**: [Argentina National Directorate of Migration (Migraciones)](https://www.argentina.gob.ar/interior/migraciones)
- **Online Residence Applications**: [RadEx – Argentina Online Residency Application Portal](https://www.argentina.gob.ar/migraciones/radicacion-electronica)`,
      zh: `阿根廷是拉丁美洲最南端的广阔国家，以布宜诺斯艾利斯等欧式城市、壮丽自然景观和以外币衡量极为低廉的生活成本著称。数字游民社区快速扩张，Palermo和Recoleta已成为重要的国际移居人士聚集地。然而，长期高通胀和货币政策不稳定是主要风险因素，移居前务必充分了解相关情况。

### 主要签证与居留许可类型

**临时居留（Residencia Temporaria）**
中长期居留的基础许可，设有多个类别。

*被动收入居留（Rentista）*
- 最低月收入：**USD 1,000以上**的被动收入（养老金、投资收益、租金等）
- 有效期：1〜2年，可续签
- 数字游民最常用的申请路径

*就业居留（Trabajo）*
- 须持有阿根廷雇主的录用通知
- 有效期：1〜3年

*退休人员（Jubilado/Pensionado）*
- 面向境外养老金领取者，须提供最低月养老金收入证明
- 有效期：1〜2年

**永久居留（Residencia Permanente）**
- 维持临时居留满**2年**后可申请
- 永久有效，无需续签

**MERCOSUR协议优待**
巴西、智利、乌拉圭、巴拉圭、玻利维亚、哥伦比亚、厄瓜多尔、秘鲁等MERCOSUR成员国及准成员国公民，无需工作邀约即可自动获得2年临时居留资格。

### 税制详解

**个人所得税——Ganancias（居民）**

| 年应税收入（ARS） | 税率 |
|----------------|------|
| 0〜1,091,403 | 5% |
| 1,091,404〜2,182,806 | 9% |
| 2,182,807〜3,274,209 | 12% |
| 3,274,210〜4,365,612 | 15% |
| 4,365,613〜6,548,418 | 19% |
| 6,548,419〜8,731,224 | 23% |
| 8,731,225〜13,096,836 | 27% |
| 13,096,837〜17,462,448 | 31% |
| 17,462,449以上 | **35%** |

*注意：由于高通胀，各税率区间金额频繁调整，请在AFIP官网核实最新数据。*

**非居民**：仅就阿根廷来源收入征税（12.5〜35%）。

**Monotributo（简易税制）**
适用于自由职业者和小型个体经营者的月固定缴费制度。
- 按类别缴纳月固定金额（ARS 20,000〜200,000以上），**一次性涵盖所得税、社保和医保**
- IT顾问、设计师及远程工作者尤其青睐此制度
- 年营业额超过上限后须转为Autónomo（独立自雇）制度

### 社会保险（ANSES / SIPA）

| 类别 | 雇员 | 雇主 |
|------|------|------|
| 养老金（SIPA） | 11% | 12.71% |
| 医疗（Obra Social） | 3% | 6% |
| 失业/家庭基金 | — | 5.56% |
| **合计（约）** | **14%** | **约24.27%** |

Monotributo参保者按月缴纳固定金额，以简化公式涵盖社会保险。

### 布宜诺斯艾利斯外籍人士聚居区租金行情（2026年）

*注意：布宜诺斯艾利斯大多数面向外籍人士的租约以美元计价，以对冲通胀风险。*

| 地区 | 房型 | 月租金（USD） |
|------|------|-------------|
| Palermo（游民中心/外籍人士首选） | 两居室 | USD 600〜1,200 |
| Recoleta（高档/欧式风情） | 两居室 | USD 700〜1,400 |
| San Telmo（历史街区/艺术气息） | 两居室 | USD 400〜800 |
| 门多萨市中心（葡萄酒/山区） | 两居室 | USD 300〜600 |
| 巴里洛切（巴塔哥尼亚/自然环境） | 两居室 | USD 350〜700 |

Palermo是布宜诺斯艾利斯数字游民和国际移居者的核心社区，共享办公空间、英语友好咖啡馆和国际食品店齐全。Recoleta是欧式高档住宅区，多国大使馆集中于此。

### 费用一览

*ARS计价费用因高通胀随时变动，申请时请务必在AFIP/DNM官方网站确认最新金额。*

| 项目 | 费用 |
|------|------|
| 临时居留申请费 | 约ARS 20,000以上（可能变动） |
| DNI发放费 | 约ARS 2,000以上（可能变动） |
| 永久居留申请费 | 约ARS 25,000以上（可能变动） |
| 文件翻译/公证费 | 约USD 50〜200等值 |

### 移居前检查清单

1. **CUIL/CUIT（税务号码）办理**：就业、银行开户、自由职业活动及合同签署必备，抵达后在AFIP（联邦税务局）或携带身份证件前往RENAPER（公民登记局）申请
2. **DNI（国民身份证）办理**：取得临时居留资格后发放，几乎所有日常事务——银行、手机套餐、租房合同、公共服务——均需此证
3. **通胀与货币应对策略**：阿根廷是全球持续高通胀率最高的国家之一，ARS计价资产迅速贬值。强烈建议以美元收取和保存收入，并研究"MEP美元"（金融美元）等合法换汇渠道
4. **文件翻译与公证**：日本证明文件（出生证明、无犯罪记录、结婚证等）须经认证西班牙语翻译，可通过阿根廷大使馆或认证翻译机构办理
5. **医疗保险（Obra Social）**：在职雇员加入所在行业的Obra Social（职域健康保险）；自由职业者可通过Monotributo获得基本医疗保障，也可购买Cigna等国际私人医疗保险

使用MoveWorth模拟您在阿根廷的税负和生活成本。

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [阿根廷国家移民局（Migraciones）](https://www.argentina.gob.ar/interior/migraciones)
- **居留在线申请**: [RadEx – 阿根廷居留在线申请门户](https://www.argentina.gob.ar/migraciones/radicacion-electronica)`,
    },
  },
  {
    slug: "visa-tr",
    category: "visa",
    date: "2026-03-19",
    readingTime: 12,
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/visa-tr.webp",
    title: {
      ja: "【2026年最新版】トルコのビザ・就労許可完全ガイド｜短期居住許可・就労許可・投資国籍",
      en: "Turkey Visa & Work Permit Complete Guide 2026 | Residence Permit, Work Permit, Citizenship by Investment",
      zh: "【2026年最新】土耳其签证与就业许可完全指南｜短期居留许可、工作许可、投资入籍",
    },
    description: {
      ja: "e-Visa（USD 51）・短期居住許可・就労許可・投資国籍（USD 400,000）・所得税15〜40%まで、2026年最新データでトルコ移住を完全解説。イスタンブール外国人エリアの家賃相場・社会保険・費用一覧付き。",
      en: "e-Visa (USD 51), Short-Term Residence Permit, Work Permit, Citizenship by Investment (USD 400,000), income tax 15–40% — Turkey 2026 complete guide with Istanbul expat-area rents, social insurance, and full fee tables.",
      zh: "电子签证（USD 51）、短期居留许可、工作许可、投资入籍（USD 400,000）、所得税15〜40%——2026年最新土耳其移居完全指南，含伊斯坦布尔外籍人士聚居区租金、社保及费用一览。",
    },
    content: {
      ja: `トルコはヨーロッパとアジアの交差点に位置し、イスタンブールをはじめとする歴史的な都市、豊かな文化、そして日本と比べて非常に安い物価が魅力です。近年デジタルノマドや長期移住者の間で急速に人気を集めており、特に不動産投資による国籍取得プログラムは世界的にも注目を集めています。ただしトルコリラの変動リスクと年々上昇するインフレは重要な考慮事項です。

### 主なビザ・居住許可の種類

**短期滞在（e-Visa）**
- 観光・短期ビジネス目的
- 日本国籍：180日以内に**90日間ビザなし滞在**が可能
- e-Visaはオンラインで取得（USD 51）。ビジネス目的はM Visaとして申請

**短期居住許可（Kısa Dönem İkamet İzni）**
長期滞在を希望するデジタルノマド・不動産オーナー・配偶者等に人気のルート。
- 対象：不動産所有者・観光目的の長期滞在・科学的研究・語学教育等
- 有効期間：1〜2年（最長2年）、更新可能
- **民間医療保険の加入証明が申請必須**

**長期居住許可（Uzun Dönem İkamet İzni）**
- 合法居住**8年以上**後に申請可能
- 更新不要の無期限居住許可
- 就労許可を別途取得すれば就労も可能

**就労ビザ・就労許可（Çalışma İzni）**
トルコ企業から雇用オファーを受けた外国人向け。
- 雇用主（トルコ法人）が労働省（Çalışma ve Sosyal Güvenlik Bakanlığı）に申請
- 有効期間：最初1年、更新可能（3年→無期限へ更新可能）
- **外国人雇用比率規制**：従業員5人に対して外国人1人まで（一定条件で緩和可）

**トルコ国籍取得（投資）**
- USD **400,000以上**の不動産購入でトルコ国籍取得可能（3年保有条件あり）
- EU国籍の基礎となる市民権取得ルートとして人気
- ビザフリーで渡航できる国が150か国以上に拡大

### 税制の詳細

**個人所得税（Gelir Vergisi）累進税率**

| 課税所得（TRY） | 税率 |
|-------------|------|
| 0〜110,000 | 15% |
| 110,001〜230,000 | 20% |
| 230,001〜870,000 | 27% |
| 870,001〜3,000,000 | 35% |
| 3,000,001以上 | **40%** |

- **居住者判定**：暦年内に183日以上トルコに滞在した場合、全世界所得に課税
- **非居住者**：トルコ国内源泉所得のみ課税
- 給与所得控除・最低生活費控除等の所得控除制度あり

### 社会保険（SGK：社会保険公団）

| 種別 | 従業員負担 | 雇用主負担 |
|------|---------|---------|
| 年金・障害・遺族保険 | 9% | 11% |
| 健康保険 | 5% | 7.5% |
| 失業保険 | 1% | 2% |
| 合計 | **14%** | **20.5%** |

短期居住許可保有者（就労なし）は就労開始まで民間医療保険が必須。

### 外国人居住エリアの家賃相場（2026年）

※トルコリラの変動により、外国人向け物件はUSD建て表示が多い。

| エリア | 物件タイプ | 月額賃料（USD） |
|--------|-----------|-------------|
| イスタンブール ニシャンタシュ（ヨーロッパ側高級） | 2BR | USD 500〜900 |
| イスタンブール ベシクタシュ/シシリ | 2BR | USD 400〜750 |
| イスタンブール カドゥキョイ（アジア側・若者） | 2BR | USD 350〜650 |
| アンタルヤ市内（ビーチリゾート） | 2BR | USD 300〜600 |
| イズミル市内（エーゲ海） | 2BR | USD 280〜520 |

イスタンブールのニシャンタシュ・ベシクタシュはヨーロッパ側の高級住宅地で外国人居住者が多い。カドゥキョイはアジア側で物価が安く英語コミュニティも活発。アンタルヤ・イズミルはイスタンブールより生活費が30〜40%安い。

### 費用一覧

| 項目 | 費用 |
|------|------|
| e-Visa（オンライン取得） | USD 51 |
| 短期居住許可申請費 | 約TRY 1,500〜3,000 |
| 就労許可申請費 | 約TRY 5,000〜8,000 |
| 長期居住許可申請費 | 約TRY 3,000〜5,000 |
| 国籍取得（不動産投資） | USD 400,000以上（不動産代金） |

### 月別生活費の目安（イスタンブール）

| 項目 | 月額（USD） |
|------|-----------|
| 家賃（2BR・外国人エリア） | USD 400〜800 |
| 食費（自炊＋外食） | USD 200〜350 |
| 交通費 | USD 30〜60 |
| 光熱費・通信 | USD 50〜100 |
| **合計** | **USD 700〜1,300** |

日本と比べて生活費が約3〜5割安く、特に食費・外食費の安さが際立ちます。

### 移住前チェックリスト

1. **居住許可の期限管理**：短期居住許可の失効後も滞在すると罰金・出国禁止・強制退去のリスク。更新は少なくとも1ヶ月前から着手
2. **為替リスクへの対応**：トルコリラは高インフレを背景に継続的に下落する傾向。収入・貯蓄はUSDまたはEURで保管することを強く推奨
3. **民間医療保険の手配**：短期居住許可の申請要件として、トルコ国内で有効な民間医療保険（例：AXA Turkey・Cigna Turkey等）の加入証明が必要。就労許可取得後はSGKに加入可
4. **住民登録（İkametgah）**：居住許可取得後に市役所（Nüfus Müdürlüğü）で住所登録を行うことで、銀行口座開設や税務手続きが円滑に
5. **外国人向け不動産購入の確認**：日本国籍者は原則制限なくトルコの不動産を購入可能。投資国籍を目指す場合は、物件の「適格性証明書（TOKI等認定）」の取得が必要な点に注意

MoveWorthでトルコの生活費・税負担をシミュレーションしてみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **在留許可（e-ikamet）オンライン申請**: [トルコ出入国管理局 – e-ikamet ポータル](https://e-ikamet.goc.gov.tr/)
- **トルコ政府公式サービス**: [e-Devlet（トルコ電子政府ポータル）](https://www.turkiye.gov.tr/)
- **国籍取得（市民権投資）**: [トルコ投資局 – 投資による市民権プログラム](https://www.invest.gov.tr/en/pages/citizenship.aspx)`,
      en: `Turkey sits at the crossroads of Europe and Asia, offering historic cities like Istanbul, a rich culture, and a cost of living significantly lower than Japan. It has become rapidly popular among digital nomads and long-term expats, and its Citizenship by Investment program is one of the most sought-after globally. However, Turkish lira volatility and rising inflation are important risk factors to consider.

### Main Visa & Permit Types

**Short-Stay (e-Visa)**
- For tourism and short business trips
- Japanese passport holders: **90 days visa-free** within any 180-day period
- e-Visa available online (USD 51); business visitors apply for the M-type Visa

**Short-Term Residence Permit (Kısa Dönem İkamet İzni)**
Popular for digital nomads, property owners, and partners.
- Categories: property owners, extended tourism, scientific research, language study
- Validity: 1–2 years, renewable
- **Private health insurance is a mandatory application requirement**

**Long-Term Residence Permit (Uzun Dönem İkamet İzni)**
- Available after **8 years** of continuous legal residence
- Indefinite validity, no renewal required
- Work rights available with a separately obtained work permit

**Work Permit (Çalışma İzni)**
For foreigners with a job offer from a Turkish employer.
- Employer (Turkish entity) applies to the Ministry of Labor (Çalışma Bakanlığı)
- Validity: 1 year initially, renewable (3 years → unlimited)
- **Foreign employee quota**: max 1 foreign worker per 5 local staff (exceptions possible)

**Turkish Citizenship by Investment**
- Purchase real estate worth **USD 400,000+** (3-year holding period required)
- Popular as a pathway to a passport with 150+ visa-free destinations
- Also available via capital investment (USD 500,000+) or job creation

### Tax System in Detail

**Personal Income Tax (Gelir Vergisi) — Progressive**

| Taxable Income (TRY) | Rate |
|----------------------|------|
| 0–110,000 | 15% |
| 110,001–230,000 | 20% |
| 230,001–870,000 | 27% |
| 870,001–3,000,000 | 35% |
| Above 3,000,001 | **40%** |

- **Tax residency**: 183+ days in Turkey = worldwide income taxed as a resident
- **Non-residents**: Only Turkish-source income taxed
- Various deductions available: employment income deduction, minimum living allowance

### Social Insurance (SGK — Social Security Institution)

| Category | Employee | Employer |
|----------|----------|----------|
| Pension / Disability / Survivor | 9% | 11% |
| Health insurance | 5% | 7.5% |
| Unemployment insurance | 1% | 2% |
| **Total** | **14%** | **20.5%** |

Short-Term Residence Permit holders (non-working) must have private health insurance until they obtain a work permit and enroll in SGK.

### Expat-Area Rents in Istanbul (2026)

*Most international-facing leases in Istanbul are quoted in USD due to lira volatility.*

| Area | Type | Monthly Rent (USD) |
|------|------|-------------------|
| Istanbul – Nişantaşı (European side, upmarket) | 2BR | USD 500–900 |
| Istanbul – Beşiktaş / Şişli | 2BR | USD 400–750 |
| Istanbul – Kadıköy (Asian side, young expats) | 2BR | USD 350–650 |
| Antalya city centre (beach resort) | 2BR | USD 300–600 |
| Izmir city centre (Aegean) | 2BR | USD 280–520 |

Nişantaşı and Beşiktaş on the European side are premium expat neighbourhoods. Kadıköy on the Asian side is younger, more affordable, and has an active English-speaking community. Antalya and Izmir are 30–40% cheaper than Istanbul.

### Monthly Living Costs (Istanbul)

| Item | Monthly (USD) |
|------|--------------|
| Rent (2BR, expat area) | USD 400–800 |
| Food (groceries + dining) | USD 200–350 |
| Transport | USD 30–60 |
| Utilities & mobile | USD 50–100 |
| **Total** | **USD 700–1,300** |

Turkey is 30–50% cheaper than Japan overall, with food and dining costs being particularly low.

### Fee Table

| Item | Cost |
|------|------|
| e-Visa (online) | USD 51 |
| Short-term residence permit | TRY 1,500–3,000 |
| Work permit | TRY 5,000–8,000 |
| Long-term residence permit | TRY 3,000–5,000 |
| Citizenship by investment (property) | USD 400,000+ (property cost) |

### Pre-Move Checklist

1. **Track permit renewal deadlines**: Overstaying a Short-Term Residence Permit triggers fines, entry bans, and potential deportation — begin renewal at least 1 month before expiry
2. **Currency risk management**: The Turkish lira has depreciated significantly against USD and EUR due to high inflation — hold savings and income in hard currencies
3. **Private health insurance**: Mandatory for the Short-Term Residence Permit application — obtain a policy from a Turkey-compliant insurer (e.g., AXA Turkey, Cigna Turkey) before applying
4. **Address registration (İkametgah)**: After obtaining a residence permit, register your address at the local Nüfus Müdürlüğü (civil registration office) — required for banking and tax registration
5. **Property purchase eligibility**: Japanese nationals can purchase Turkish real estate without restrictions. For Citizenship by Investment, verify that the specific property carries an "eligibility certificate" (required for the program)

Simulate your cost of living and tax burden in Turkey with MoveWorth.

---

### References

This article is based on the following official sources.

- **Residence Permit (e-ikamet) Online Application**: [Turkish Directorate General of Migration Management – e-ikamet Portal](https://e-ikamet.goc.gov.tr/)
- **Turkish Government Official Services**: [e-Devlet – Turkey's E-Government Portal](https://www.turkiye.gov.tr/)
- **Citizenship by Investment**: [Turkey Investment Office – Citizenship by Investment Program](https://www.invest.gov.tr/en/pages/citizenship.aspx)`,
      zh: `土耳其地处欧亚交界处，拥有伊斯坦布尔等历史名城、丰富的文化底蕴以及远低于日本的生活成本，近年来在数字游民和长期移居者中人气迅速攀升，其投资入籍计划也是全球最受瞩目的项目之一。然而，土耳其里拉的汇率波动和持续上升的通胀是不可忽视的重要风险因素。

### 主要签证与居留许可类型

**短期停留（电子签证）**
- 适用于旅游和短期商务出行
- 日本护照持有人：180天内可**免签停留90天**
- 可在线申请电子签证（USD 51）；商务访客申请M类签证

**短期居留许可（Kısa Dönem İkamet İzni）**
数字游民、房产持有者及配偶群体最常用的路径。
- 适用类别：房产持有者、延长旅游、科学研究、语言学习等
- 有效期：1〜2年，可续签
- **申请时须强制提供私人医疗保险证明**

**长期居留许可（Uzun Dönem İkamet İzni）**
- 合法居留满**8年**后可申请
- 无限期有效，无需续签
- 另行取得工作许可后可合法就业

**工作签证及工作许可（Çalışma İzni）**
持有土耳其雇主录用通知的外籍人员。
- 由土耳其法人雇主向劳工部（Çalışma Bakanlığı）提交申请
- 有效期：首次1年，可续签（3年→无期限）
- **外籍员工配额**：每5名本地员工可雇1名外籍员工（符合条件可申请豁免）

**投资入籍**
- 购置价值**USD 400,000以上**的房产（须持有3年）即可申请土耳其国籍
- 作为免签超150个国家的护照申请路径，广受国际投资者青睐
- 也可通过资本投资（USD 500,000以上）或创造就业机会申请

### 税制详解

**个人所得税（Gelir Vergisi）累进税率**

| 应税收入（TRY） | 税率 |
|-------------|------|
| 0〜110,000 | 15% |
| 110,001〜230,000 | 20% |
| 230,001〜870,000 | 27% |
| 870,001〜3,000,000 | 35% |
| 3,000,001以上 | **40%** |

- **税务居民认定**：一个日历年内在土耳其居住183天以上，则就全球收入征税
- **非居民**：仅就土耳其来源收入征税
- 设有就业收入扣除、最低生活费扣除等多种所得扣除项目

### 社会保险（SGK——社会保险机构）

| 类别 | 雇员 | 雇主 |
|------|------|------|
| 养老/伤残/遗属保险 | 9% | 11% |
| 健康保险 | 5% | 7.5% |
| 失业保险 | 1% | 2% |
| **合计** | **14%** | **20.5%** |

短期居留许可持有人（无就业）在取得工作许可并加入SGK之前，须持有私人医疗保险。

### 伊斯坦布尔外籍人士聚居区租金行情（2026年）

*受里拉波动影响，伊斯坦布尔大多数面向国际人士的租约以美元计价。*

| 地区 | 房型 | 月租金（USD） |
|------|------|-------------|
| 伊斯坦布尔 尼桑塔斯（欧洲区/高档） | 两居室 | USD 500〜900 |
| 伊斯坦布尔 贝西克塔斯/希什利 | 两居室 | USD 400〜750 |
| 伊斯坦布尔 卡德柯伊（亚洲区/年轻外籍人士） | 两居室 | USD 350〜650 |
| 安塔利亚市中心（海滩度假胜地） | 两居室 | USD 300〜600 |
| 伊兹密尔市中心（爱琴海） | 两居室 | USD 280〜520 |

欧洲区的尼桑塔斯和贝西克塔斯是外籍人士高端聚居区；亚洲区的卡德柯伊价格更实惠，英语社交圈活跃。安塔利亚和伊兹密尔的生活成本比伊斯坦布尔低30〜40%。

### 月均生活费参考（伊斯坦布尔）

| 项目 | 月均费用（USD） |
|------|--------------|
| 房租（两居室，外籍聚居区） | USD 400〜800 |
| 餐饮（自炊＋外食） | USD 200〜350 |
| 交通 | USD 30〜60 |
| 水电气及通讯 | USD 50〜100 |
| **合计** | **USD 700〜1,300** |

土耳其总体生活成本比日本低约30〜50%，餐饮和外食费用尤为低廉。

### 费用一览

| 项目 | 费用 |
|------|------|
| 电子签证（在线申请） | USD 51 |
| 短期居留许可申请费 | TRY 1,500〜3,000 |
| 工作许可申请费 | TRY 5,000〜8,000 |
| 长期居留许可申请费 | TRY 3,000〜5,000 |
| 投资入籍（房产） | USD 400,000以上（房产款） |

### 移居前检查清单

1. **居留许可续签期限管理**：短期居留许可到期后继续停留将面临罚款、禁止入境乃至强制遣返，至少提前1个月启动续签手续
2. **汇率风险应对**：受高通胀影响，土耳其里拉长期呈贬值趋势，强烈建议以美元或欧元持有收入和储蓄
3. **私人医疗保险**：申请短期居留许可的必备材料，须购买适用于土耳其境内的私人医疗保险（如AXA Turkey、Cigna Turkey等）；取得工作许可后可加入SGK
4. **住址登记（İkametgah）**：取得居留许可后，前往当地户籍管理局（Nüfus Müdürlüğü）完成住址登记，这是开立银行账户和办理税务手续的前提
5. **外籍人士购房确认**：日本国籍者原则上可无限制购买土耳其房产；申请投资入籍时，须确认所购房产附有"适格证明"（由TOKI等机构认定），否则不符合申请条件

使用MoveWorth模拟您在土耳其的税负和生活成本。

---

### 参考资料

本文信息基于以下官方资料整理。

- **居留许可（e-ikamet）在线申请**: [土耳其移民管理总局 – e-ikamet 门户](https://e-ikamet.goc.gov.tr/)
- **土耳其政府官方服务**: [e-Devlet – 土耳其电子政务门户](https://www.turkiye.gov.tr/)
- **投资入籍**: [土耳其投资局 – 投资入籍项目](https://www.invest.gov.tr/en/pages/citizenship.aspx)`,
    },
  },
  {
    slug: "moveworth-how-to-use",
    category: "about",
    date: "2026-03-29",
    pinned: true,
    readingTime: 10,
    locales: ["ja"],
    thumbnail: "https://gzpiunqlcgskrmukfoke.supabase.co/storage/v1/object/public/blog-images/how-to-use-moveworth.webp",
    title: {
      ja: "MoveWorthの使い方【完全ガイド】5分で海外移住後の資産がわかるシミュレーター",
      en: "How to Use MoveWorth: Complete Guide to the Relocation Financial Simulator",
    },
    description: {
      ja: "国選択から結果グラフの読み方まで、MoveWorthシミュレーターの使い方を画像付きでステップごとに解説します。",
      en: "A step-by-step guide with screenshots on how to use MoveWorth's relocation financial simulator.",
    },
    content: {
      ja: `海外移住を検討しているけれど、「移住後の生活費や資産がどうなるか不安」「複数の国を比べてみたいけど計算が大変」という方に向けて、MoveWorthシミュレーターの使い方を画像付きで解説します。

慣れれば**5分以内**で移住後の資産推移が確認できます。

## MoveWorthでできること

- 現在の国と移住先の**資産推移を最大30年間比較**
- **40カ国以上**に対応
- 単身・2人暮らし・4人家族の**世帯タイプ別**シミュレーション
- 税率・インフレ率・為替レートを反映した精度の高いシミュレーション
- **無料**で使える（一部高度機能はProプラン以上）

---

## Step 1｜現在地と移住先を選ぶ

まずトップページにアクセスし、「現在の国」と「移住先」を選びます。

![国選択の完了画面](/images/blog/moveworth-how-to-use/step1-country-select.png)

▼をクリックするとドロップダウンが開き、**国名・通貨で検索**できます。40カ国以上から選択可能です。

![国選択ドロップダウン](/images/blog/moveworth-how-to-use/step1-country-dropdown.png)

---

## Step 2｜年収・業種を入力する

現在の年収（税引前）を日本円で入力します。

![年収入力画面](/images/blog/moveworth-how-to-use/step2-income-empty.png)

「業種別平均年収を参照して入力...」をクリックすると、移住先での業種別平均年収が表示され、そのまま入力できます。

![業種選択画面](/images/blog/moveworth-how-to-use/step2-income-industry.png)

> **Tips：** 通貨ボタン（例：RM）を押すと、現在の年収を現地通貨に為替換算した金額がそのまま入力されます。移住先での年収水準を参考にしたいときに便利です。

![RMボタンで為替換算](/images/blog/moveworth-how-to-use/step2-income-rm-button.png)

---

## Step 3｜貯蓄・家族構成・家賃を設定する

現在の貯蓄額と家族構成を入力します。

「世帯タイプ別の平均家賃・生活費を参照...」から世帯タイプを選ぶと、移住先の外国人居住エリアの**平均家賃・生活費が自動入力**されます。手動で変更することも可能です。

![家族構成選択と詳細条件入力](/images/blog/moveworth-how-to-use/step3-family-type.png)

---

## Step 4｜税金・経済パラメータを確認する

国を選択すると、税率・為替レート・インフレ率などが**自動で入力**されます。基本的にそのままでOKですが、自分の状況に合わせて変更することも可能です。

![税金・経済パラメータ](/images/blog/moveworth-how-to-use/step4-tax-params.png)

| 項目 | 内容 |
|------|------|
| 税率（現在・移住先） | 所得税の目安 |
| 為替レート | リアルタイムに近い値が自動入力 |
| 昇給率 | 毎年の給与上昇率の想定 |
| インフレ率（現在・移住先） | 物価上昇率の想定 |
| 投資リターン | 資産運用をしている場合に入力 |
| シミュレーション年数 | 1〜30年で設定可能 |

---

## Step 5｜結果グラフを読む

入力が完了すると結果が自動で表示されます。

### 資産推移グラフ

![資産推移予測グラフ](/images/blog/moveworth-how-to-use/step5-result-graph.png)

緑のライン（移住先）と青のライン（現在の国）を比較して、移住による資産の変化を確認できます。グラフの開きが大きいほど、移住による経済的メリットが大きいことを示しています。

### 月次内訳

![月次内訳](/images/blog/moveworth-how-to-use/step5-monthly-breakdown.png)

収入・家賃・生活費・税金・貯蓄をすべてJPY換算で比較できます。「どの項目で差が出ているか」が一目でわかります。

### 年間貯蓄額・資産差額

![資産差額サマリー](/images/blog/moveworth-how-to-use/step5-asset-summary.png)

シミュレーション期間中の**合計資産差額**が表示されます。「海外移住は経済的に有利です」などの総合判定も確認できます。

---

## 応用｜高度分析機能を使う（Proプラン・$8/月）

Proプランでは、さらに詳しい分析が可能です。

### 感度分析

各パラメータ（年収・家賃・生活費など）が最終資産にどの程度影響するかを視覚化します。「何を改善すれば資産が増えるか」がひと目でわかります。

![感度分析](/images/blog/moveworth-how-to-use/advanced-sensitivity.png)

### FIRE計算

4%ルール（年間支出の25倍）に基づき、各国でのFIRE（経済的自立）達成までの年数を比較します。

![FIRE計算](/images/blog/moveworth-how-to-use/advanced-fire.png)

### モンテカルロシミュレーション

収入・投資リターン・インフレ率にランダム変動を加えた**1,000回のシミュレーション**を実行し、資産推移の確率分布を表示します。最悪ケース・最良ケース・元本割れ確率まで確認できます。

![モンテカルロシミュレーション](/images/blog/moveworth-how-to-use/advanced-montecarlo.png)

---

## 応用｜複数国を同時比較する（Premiumプラン・$15/月）

Premiumプランでは、**最大4カ国を同時比較**できます。

### 4カ国の資産推移グラフ

![複数国比較グラフ](/images/blog/moveworth-how-to-use/premium-4country-graph.png)

マレーシア・シンガポール・ベトナム・中国など複数国を1つのグラフで比較できます。移住先の候補が複数ある場合に特に有効です。

### 多国間比較テーブル

![多国間比較テーブル](/images/blog/moveworth-how-to-use/premium-comparison-table.png)

年間貯蓄額・5年後の資産・現在地との資産差額・税率を国別に一覧で確認できます。

### 国別の高度分析

![複数国の感度分析](/images/blog/moveworth-how-to-use/premium-sensitivity.png)

比較した国ごとに感度分析・FIRE計算・モンテカルロを切り替えて確認できます。

---

## プランの選び方

![プラン一覧](/images/blog/moveworth-how-to-use/plan-pricing.png)

| プラン | 料金 | おすすめの人 |
|--------|------|-------------|
| **Free** | $0 | まず試してみたい人・1〜2カ国を比較したい人 |
| **Pro** | $8/月 | FIRE・感度分析など詳しく分析したい人 |
| **Premium** | $15/月 | 複数国を徹底比較したい人 |

ProはFreeの全機能に加えて、モンテカルロシミュレーション・FIRE達成年齢計算・感度分析・最大30件の保存・AIレポート月5回が使えます。**3日間無料体験**があるので、まずFreeで試してから検討するのがおすすめです。

---

## まとめ

MoveWorthのシミュレーターは、**5つのステップ**で移住後の資産推移を確認できます。

1. 現在地と移住先を選ぶ
2. 年収・業種を入力する
3. 貯蓄・家族構成・家賃を設定する
4. 税金・経済パラメータを確認する
5. 結果グラフを読む

「移住したら本当に資産が増えるのか？」という疑問を、データで確認してから判断しましょう。まずは無料で試してみてください。`,
      en: `MoveWorth is a free financial simulator that helps you compare your asset trajectory between your current country and potential relocation destinations. This guide walks you through how to use it step by step.

## Step 1 | Select Countries

Choose your current country and destination from the dropdown. Search by country name or currency across 40+ countries.

## Step 2 | Enter Income

Enter your annual pre-tax income. Use the industry dropdown to auto-fill average salaries for your field in the destination country.

## Step 3 | Set Savings & Household Type

Enter your current savings and select your household type (single, couple, or family of 4). Rent and living costs are auto-filled based on expat area averages.

## Step 4 | Review Economic Parameters

Tax rates, exchange rates, and inflation are auto-filled when you select a country. Adjust if needed.

## Step 5 | Read the Results

- **Asset projection graph**: Compare asset growth over time between countries
- **Monthly breakdown**: Compare income, rent, living costs, tax, and savings in JPY
- **Summary**: See total asset difference over the simulation period

## Advanced Features (Pro Plan – $8/month)

- **Sensitivity analysis**: See which factors impact your final assets most
- **FIRE calculation**: Calculate years to financial independence by country
- **Monte Carlo simulation**: Run 1,000 scenarios to assess risk

## Multi-Country Comparison (Premium Plan – $15/month)

Compare up to 4 countries simultaneously with a combined graph, comparison table, and per-country advanced analysis.

Start with the free plan at moveworthapp.com.`,
    },
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((p) => p.category === category);
}

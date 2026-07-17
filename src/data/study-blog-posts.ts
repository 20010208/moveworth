export type StudyBlogPost = {
  slug: string;
  category: string;
  date: string;
  readingTime: number;
  title: { ja: string; en: string };
  description: { ja: string; en: string };
  content: { ja: string; en: string };
};

export const studyBlogCategories: Record<string, { ja: string; en: string; zh?: string }> = {
  guide:   { ja: "留学ガイド",     en: "Study Guide",    zh: "留学指南" },
  work:    { ja: "アルバイト・就労", en: "Part-time Work", zh: "打工·就业" },
  country: { ja: "国別情報",       en: "Country Info",   zh: "各国信息" },
};

export const studyBlogPosts: StudyBlogPost[] = [
  // 1. 留学準備ガイド - comprehensive guide for studying abroad with zero English
  {
    slug: "study-prep-guide-2026",
    category: "guide",
    date: "2026-03-16",
    readingTime: 8,
    title: {
      ja: "英語力ゼロから始める海外留学完全準備ガイド",
      en: "Complete Study Abroad Preparation Guide 2026 — Starting from Zero English",
    },
    description: {
      ja: "英語に自信がなくても海外留学は実現できます。ビザ取得・学校選び・費用準備・渡航前チェックリストまで、留学準備の全ステップを徹底解説。",
      en: "You don't need perfect English to study abroad. A complete guide covering visa, school selection, budgeting, and pre-departure checklists.",
    },
    content: {
      ja: `「英語が話せないから留学は無理」そう思っていませんか？実は、語学力ゼロ・初心者からでも海外留学を実現した人は世界中にいます。大切なのは準備と計画です。このガイドでは、留学を決意してから出発するまでの全ステップをわかりやすく解説します。

### Step 1：留学の目的を明確にする

まず「なぜ留学したいのか」を整理しましょう。目的によって、行き先・期間・学校の種類が変わってきます。

**よくある留学目的：**
- 英語（または現地語）を習得したい
- 大学・大学院で専門分野を学びたい
- 海外の職歴・資格を取りたい
- 異文化体験・視野を広げたい
- 就職・転職のために英語資格が欲しい

目的が曖昧なままだと、費用と時間を無駄にしてしまうことがあります。「何を得て帰国したいか」を紙に書き出してみましょう。

### Step 2：留学先の国と学校を選ぶ

英語圏の定番はアメリカ・イギリス・オーストラリア・カナダ・ニュージーランドですが、費用や生活スタイルによって最適解は異なります。

**英語力ゼロでも始めやすい国：**
- **マレーシア**：英語が公用語のひとつ。物価が安く、アジア文化に親しみやすい
- **フィリピン**：英語教育が充実した語学学校が多く、費用が格安
- **オーストラリア**：ワーキングホリデーと組み合わせやすく、日本人サポートが充実
- **カナダ**：多文化共生の環境で、英語ゼロから始める留学生が多い

**学校の種類：**
- **語学学校（ESL/EFL）**：英語を学ぶための学校。入学に英語力は不要
- **コミュニティカレッジ**：準学士号を取得できる。費用が大学より安い
- **大学・大学院**：学位取得。一定のTOEFL/IELTSスコアが必要
- **専門学校（ボケーショナルスクール）**：実務的なスキルを習得

### Step 3：留学費用を把握する

留学費用は「学費 ＋ 生活費 ＋ 渡航費 ＋ 諸経費」で構成されます。MoveWorth.studyのシミュレーターを使うと、国・期間・学費を入力するだけで総費用の目安を計算できます。

**費用の目安（語学学校・3ヶ月の場合）：**

| 国 | 学費（3ヶ月） | 生活費（3ヶ月） | 合計目安 |
|---|---|---|---|
| フィリピン | 約15〜25万円 | 約10〜15万円 | 約25〜40万円 |
| マレーシア | 約20〜35万円 | 約15〜20万円 | 約35〜55万円 |
| オーストラリア | 約30〜50万円 | 約35〜50万円 | 約65〜100万円 |
| カナダ | 約35〜55万円 | 約35〜55万円 | 約70〜110万円 |
| イギリス | 約40〜70万円 | 約45〜65万円 | 約85〜135万円 |

### Step 4：学生ビザを取得する

ほとんどの国で、90日以上の留学には学生ビザが必要です。国によって必要書類・費用・取得期間が異なります。

**ビザ申請の一般的な手順：**
1. 学校から入学許可証（Offer Letter / COE）を受け取る
2. 必要書類を準備する（残高証明・健康診断書など）
3. オンラインまたは大使館でビザ申請
4. ビザ発給を待つ（国によって2週間〜3ヶ月）
5. 渡航準備開始

各国の学生ビザの詳細はMoveWorth.studyの[「留学中のアルバイト・就労ルール完全まとめ」](/blog/study-abroad-work-rules-all-countries-2026)をご参照ください。

### Step 5：渡航前チェックリスト

出発前に以下を確認しましょう。

**書類・手続き：**
- パスポート（有効期限が残り1年以上あること）
- 学生ビザ（取得済みか確認）
- 入学許可証・学費領収書のコピー
- 海外旅行保険への加入（学生ビザ要件に含まれる国も多い）
- 航空券・宿泊先の予約確認書
- 現地連絡先リスト（学校・ホームステイ先など）

**お金の準備：**
- 現地通貨の両替（到着直後の生活費として1〜2週間分）
- 海外対応クレジットカード・デビットカード
- 海外送金の方法を確認（Wise・PayPayなど）

**健康・安全：**
- 必要な予防接種の確認
- 常備薬・処方薬の準備（現地で入手困難な場合がある）
- 現地の緊急連絡先（日本大使館・領事館）の確認

### Step 6：英語力ゼロでも生き延びるコツ

**到着後すぐにやること：**
- 学校のオリエンテーションに必ず参加する
- クラスメート・ホストファミリーに積極的に話しかける
- 翻訳アプリ（Google翻訳・DeepL）を活用する
- 日本語コミュニティに頼りすぎない

**英語上達のコツ：**
- 毎日1時間は「英語だけの時間」をつくる
- 現地のテレビ・ラジオ・Podcastを活用する
- 日記や日常会話を英語で書いてみる
- 英語力より「話したい気持ち」が大切

---

留学は人生を変える経験です。英語がゼロでも、計画と準備があれば必ず実現できます。MoveWorth.studyのシミュレーターで費用をシミュレーションして、留学の第一歩を踏み出しましょう。`,
      en: `Think you can't study abroad because your English isn't good enough? People around the world have successfully studied abroad starting from zero. What matters is preparation and planning. This guide walks you through every step from deciding to study abroad to departure.

### Step 1: Define Your Purpose

Start by clarifying why you want to study abroad. Your goals determine your destination, duration, and school type.

**Common study abroad goals:**
- Learn English (or the local language)
- Study a specialized subject at university
- Gain overseas work experience or qualifications
- Experience different cultures and broaden your horizons
- Obtain an English certification for job applications

### Step 2: Choose Your Country and School

English-speaking countries like the US, UK, Australia, Canada, and New Zealand are popular, but the best choice depends on cost and lifestyle.

**Countries easy to start with zero English:**
- **Malaysia**: English is an official language, affordable costs, familiar Asian culture
- **Philippines**: Excellent language schools at low cost
- **Australia**: Easy to combine with a working holiday, strong Japanese support network
- **Canada**: Multicultural environment, many students start with zero English

### Step 3: Understand the Costs

Study abroad costs = tuition + living expenses + flights + miscellaneous fees. Use the MoveWorth.study simulator to estimate total costs by entering your country, duration, and tuition.

### Step 4: Obtain a Student Visa

Most countries require a student visa for stays over 90 days. Requirements, fees, and processing times vary. See the country-specific work rules articles on MoveWorth.study for details.

### Step 5: Pre-Departure Checklist

- Passport (valid for at least 1 year beyond your planned return)
- Student visa obtained
- Admission letter and tuition receipts
- Travel insurance
- Flight and accommodation confirmation
- Local emergency contacts (school, homestay)
- Foreign-compatible credit/debit card

---

Study abroad can change your life. With the right preparation, it's achievable regardless of your current English level. Use MoveWorth.study's simulator to plan your budget and take that first step.`,
    },
  },

  // 2. 40カ国就労ルールまとめ
  {
    slug: "study-abroad-work-rules-all-countries-2026",
    category: "work",
    date: "2026-03-16",
    readingTime: 10,
    title: {
      ja: "留学中のアルバイト・就労ルール完全まとめ",
      en: "【40 Countries】Complete Guide to Part-Time Work Rules While Studying Abroad 2026",
    },
    description: {
      ja: "世界40カ国の留学中アルバイト就労ルールを一覧比較。週の就労可能時間・夏休み中の制限・ビザ条件など、留学前に必ず確認すべき情報を徹底まとめ。",
      en: "Compare part-time work rules for international students across 40 countries. Weekly hour limits, vacation rules, and visa conditions — everything you need to know before departure.",
    },
    content: {
      ja: `海外留学中にアルバイトをすることで、生活費の一部をまかなったり、現地での実践的な語学力・職業経験を得ることができます。しかし国によって就労ルールは大きく異なり、違反すると強制帰国や将来のビザ取得に影響することも。出発前に必ず確認しておきましょう。

### 就労ルールの基本的な考え方

学生ビザで滞在する場合、多くの国では「一定時間以内のアルバイトは認められる」制度を採用しています。ただし以下の点に注意が必要です。

- **就労許可が必要な国もある**：ビザとは別に就労許可証が必要なケースがある
- **学期中と休暇中で異なるルールが適用される**：夏休みや冬休みに時間制限が緩和される国が多い
- **フルタイム就労は原則禁止**：学習が主目的の学生ビザであるため
- **一部の職種は禁止**：学習分野と無関係な職種が制限される場合がある

### 主要国の就労ルール一覧

| 国 | 学期中（週） | 休暇中（週） | 備考 |
|---|---|---|---|
| [🇦🇺 オーストラリア](/blog/study-work-au) | 週48時間（隔週） | 制限なし | 2023年改定で拡大 |
| [🇨🇦 カナダ](/blog/study-work-ca) | 週24時間（キャンパス外）| 制限なし（キャンパス外）| 2024年11月改定 |
| [🇬🇧 イギリス](/blog/study-work-gb) | 週20時間 | 週40時間 | Tier 4（学生ビザ） |
| [🇺🇸 アメリカ](/blog/study-work-us) | キャンパス内週20時間 | キャンパス内週40時間 | キャンパス外は原則不可 |
| [🇳🇿 ニュージーランド](/blog/study-work-nz) | 週25時間 | フルタイム可 | 2025年11月改定 |
| [🇩🇪 ドイツ](/blog/study-work-de) | 年120日（フル）または240日（半日） | 同左 | EU内就労も可能 |
| [🇫🇷 フランス](/blog/study-work-fr) | 年964時間以内 | 同左 | 学生ビザに就労権含む |
| [🇯🇵 日本](/blog/study-work-jp) | 週28時間 | 週40時間（夏冬春休み） | 「資格外活動許可」が必要 |
| [🇰🇷 韓国](/blog/study-work-kr) | D-2学部生：週20時間、大学院生：週35時間 | フルタイム可 | D-4（語学）は6ヶ月後から週20時間 |
| [🇸🇬 シンガポール](/blog/study-work-sg) | 週16時間 | フルタイム | 認可校在籍が条件 |
| [🇲🇾 マレーシア](/blog/study-work-my) | 就労不可 | 週20時間（学期休暇中のみ） | 飲食・サービス業種のみ |
| [🇹🇭 タイ](/blog/study-work-th) | 原則禁止 | 原則禁止 | 就労ビザが別途必要 |
| [🇻🇳 ベトナム](/blog/study-work-vn) | 原則禁止 | 原則禁止 | 語学ボランティアは可の場合も |
| [🇮🇩 インドネシア](/blog/study-work-id) | 原則禁止 | 原則禁止 | 就労ビザが必要 |
| [🇵🇭 フィリピン](/blog/study-work-ph) | 原則禁止（SWP取得で一部就労可） | 原則禁止（SWP取得で一部就労可） | 移民局へのSpecial Work Permit申請が必要 |
| [🇭🇰 香港](/blog/study-work-hk) | 時間制限撤廃（2024年11月〜・大学生）| 制限なし（夏季）| 語学学校等短期留学生は要確認 |
| [🇹🇼 台湾](/blog/study-work-tw) | 週20時間 | 週40時間 | 学士課程以上が対象 |
| [🇳🇱 オランダ](/blog/study-work-nl) | 週16時間 | 週40時間（夏季6〜8月のみ） | 雇用主がTWV取得必要 |
| [🇨🇭 スイス](/blog/study-work-ch) | 週15時間 | フルタイム | 入学後6ヶ月から・語学学校生は対象外の場合も |
| [🇸🇪 スウェーデン](/blog/study-work-se) | 制限なし | 制限なし | EU/EEA圏外は要確認 |
| [🇳🇴 ノルウェー](/blog/study-work-no) | 週20時間 | 週40時間 | 正規課程在籍が条件 |
| [🇩🇰 デンマーク](/blog/study-work-dk) | 週20時間 | 週40時間（夏季6〜8月のみ） | EUブルーカード別途あり |
| [🇫🇮 フィンランド](/blog/study-work-fi) | 週平均30時間まで | フルタイム可 | 年間平均30時間以内で管理 |
| [🇦🇹 オーストリア](/blog/study-work-at) | 週20時間 | 週20時間 | 学習負担の証明が必要 |
| [🇨🇿 チェコ](/blog/study-work-cz) | 週20時間まで | 週20時間まで | 雇用許可（CZK500）が必要 |
| [🇵🇹 ポルトガル](/blog/study-work-pt) | 週20時間 | 週40時間 | 学生ビザに就労権含む |
| [🇪🇸 スペイン](/blog/study-work-es) | 週30時間 | 週40時間 | 2025年より20時間から引き上げ |
| [🇮🇹 イタリア](/blog/study-work-it) | 週20時間 | 週40時間 | Visto per Studio条件 |
| [🇬🇷 ギリシャ](/blog/study-work-gr) | 週20時間 | 週40時間 | EU/EEA学生は自由 |
| [🇮🇪 アイルランド](/blog/study-work-ie) | 週20時間 | 週40時間（6〜9月・12〜1月のみ） | 英語学校生は対象外の場合も |
| 🇧🇪 ベルギー | 制限なし（一部条件あり） | 制限なし | 学生ID提示が必要 |
| [🇦🇪 UAE（ドバイ）](/blog/study-work-ae) | 原則禁止（大学インターンのみ） | 同左 | 一般アルバイト不可 |
| [🇲🇹 マルタ](/blog/study-work-mt) | 週20時間（入学後3ヶ月から） | 週20時間 | 最初の3ヶ月は就労不可 |
| [🇿🇦 南アフリカ](/blog/study-work-za) | 週20時間まで（条件付き） | フルタイム可 | ビザに就労条件の明記が必要 |
| [🇬🇪 ジョージア](/blog/study-work-ge) | 就労許可が必要（2026年3月〜） | 同左 | 2026年3月の新規制で変更 |
| [🇧🇷 ブラジル](/blog/study-work-br) | 原則禁止 | 原則禁止 | インターンシップは可の場合も |
| [🇨🇴 コロンビア](/blog/study-work-co) | 大学院生のみ週20時間まで | 同左 | 学部生・語学学校生は就労不可 |
| [🇲🇽 メキシコ](/blog/study-work-mx) | 原則禁止（一部インターン可） | 同左 | 大学間協定による例外あり |
| [🇦🇷 アルゼンチン](/blog/study-work-ar) | 原則禁止 | 原則禁止 | 就労許可が別途必要 |
| [🇨🇳 中国](/blog/study-work-cn) | X1ビザ：週8〜16時間（PSB許可必要）/ X2：不可 | 同左 | PSBの居留許可への就労注記が必要 |
| [🇮🇳 インド](/blog/study-work-in) | 原則禁止 | 原則禁止 | インターンシップは機関による |

### 就労禁止国で働くとどうなるか

学生ビザで無許可就労が発覚した場合：
1. 即時のビザ取り消し・強制帰国
2. 将来のビザ申請（就労・観光含む）での不利益
3. 当該国への入国禁止（最長10年）
4. 雇用主への罰則（雇用主側も責任を問われる）

就労ルールが厳しい国では、**語学学校のボランティア活動**や**インターンシップ（大学公認のもの）**などを活用して経験を積む方法もあります。

### 各国の詳細情報

各国の就労ルールの詳細（必要書類・申請方法・ペナルティ等）については、各国別の記事をご参照ください。

---

留学中のアルバイトは貴重な経験になりますが、ルール違反は将来に大きな影響を与えます。事前に現地の移民局・学校の留学担当窓口に確認することを強くお勧めします。`,
      en: `Working part-time while studying abroad can help cover living costs and provide valuable language practice and work experience. However, rules vary significantly by country, and violations can result in visa cancellation or affect future visa applications. Always verify before departure.

### How Work Rules Generally Work

Most countries allow students on student visas to work a limited number of hours. Key points:
- Some countries require a separate work permit in addition to the student visa
- Different rules apply during term time vs. school holidays
- Full-time work is generally prohibited on student visas
- Some job types may be restricted

### Key Points by Country

- **Australia**: 48 hrs/fortnight during term, unrestricted during holidays (updated 2023)
- **Canada**: 20 hrs/week during term, 40 hrs/week during holidays
- **UK**: 20 hrs/week during term, 40 hrs/week during holidays
- **USA**: Campus only (20 hrs/week); off-campus generally prohibited
- **Japan**: 28 hrs/week during term (Resource Outside Status required)
- **Sweden/Finland**: Generally unrestricted for degree students

See the individual country articles for full details on each destination.`,
    },
  },

  // --- 国別：留学中の就労ルール（40カ国） ---

  // JP - 日本
  {
    slug: "study-work-jp",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【日本】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Japan 2026 — Complete Guide",
    },
    description: {
      ja: "日本での留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Japan.",
    },
    content: {
      ja: `日本は世界中から留学生が集まる人気の留学先です。語学学校や大学で学びながら、一定の条件のもとでアルバイトをすることが認められています。

### 学生ビザの概要

**ビザ種別：** 留学ビザ（在留資格「留学」）
**申請費用：** 約6,000円
**処理期間：** 1〜3ヶ月
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 在留資格認定証明書（学校が代理申請）

### アルバイト・就労ルール

日本では留学ビザ所持者が働くには「資格外活動許可」を入国管理局で取得する必要があります。

**学期中：** 週28時間まで
**休暇中：** 週40時間まで（夏休み・冬休み・春休み）
**条件：** 資格外活動許可の取得が必須。風俗営業関連の業種は禁止。

### 注意事項

1. 資格外活動許可を取得せずに働くと不法就労となり、強制帰国や将来のビザ取得に影響します
2. 週28時間の制限は全てのアルバイトの合計時間です（掛け持ちも含む）
3. 学校の出席率が低下すると在留資格更新が不許可になることがあります

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約6〜10万円 |
| 生活費（月額） | 約8〜12万円 |
| 住居費（月額） | 約4〜8万円 |
| 学生ビザ申請費 | 約6,000円 |

MoveWorth.studyのシミュレーターで日本留学の総費用を計算してみましょう。`,
      en: `Japan is a popular study destination attracting students from around the world. International students can work part-time under certain conditions while studying at language schools or universities.

### Student Visa

**Type:** Student Visa (Residence Status: "Student")
**Fee:** Approx. ¥6,000
**Processing:** 1–3 months

### Work Rules

Students must obtain a "Permission to Engage in Activity Other Than That Permitted" from immigration. During term time, students can work up to 28 hours per week. During long holidays (summer, winter, spring), the limit increases to 40 hours per week. Employment in the adult entertainment industry is prohibited.

Use the MoveWorth.study simulator to estimate your total costs for studying in Japan.`,
    },
  },

  // SG - シンガポール
  {
    slug: "study-work-sg",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【シンガポール】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Singapore 2026 — Complete Guide",
    },
    description: {
      ja: "シンガポールでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Singapore.",
    },
    content: {
      ja: `シンガポールはアジアの金融・教育ハブとして、質の高い教育環境と多文化な生活環境が魅力の留学先です。

### 学生ビザの概要

**ビザ種別：** Student's Pass（ICA申請）
**申請費用：** 約S$90〜120（申請費S$30＋発行手数料S$60。シンガポール入国にビザが必要な国籍は追加でS$30）
**処理期間：** 2〜8週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- ICA（移民局）への電子申請

### アルバイト・就労ルール

シンガポールでは認可校に在籍する学生のみがアルバイト可能です。

**学期中：** 週16時間まで
**休暇中：** フルタイム就労可能（制限なし）
**条件：** 政府認可校（例：NUS, NTU, SMU等の指定校）在籍が必須。ジョブポータルへの登録が必要。

### 注意事項

1. 認可校以外の語学学校在籍者はアルバイトが認められません
2. 週16時間の制限は厳格に適用され、違反すると学生パスが取り消される可能性があります
3. 就労先の雇用主もMOM（人材省）への届出が必要です

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約S$1,500〜3,000 |
| 生活費（月額） | 約S$1,200〜2,000 |
| 住居費（月額） | 約S$800〜1,800 |
| 学生ビザ申請費 | S$90〜120 |

MoveWorth.studyのシミュレーターでシンガポール留学の総費用を計算してみましょう。`,
      en: `Singapore is a popular study destination known for its high-quality education and multicultural environment as Asia's financial and educational hub.

### Student Visa

**Type:** Student's Pass (ICA)
**Fee:** S$90–120 (S$30 application fee + S$60 issuance fee; additional S$30 if an entry visa is required)
**Processing:** 2–8 weeks

### Work Rules

Only students enrolled at approved institutions can work part-time, up to 16 hours per week during term time. During scheduled school holidays, full-time work is permitted. Registration on a government job portal is required. Students at non-approved language schools are not permitted to work.

Use the MoveWorth.study simulator to estimate your total costs for studying in Singapore.`,
    },
  },

  // MY - マレーシア
  {
    slug: "study-work-my",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【マレーシア】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Malaysia 2026 — Complete Guide",
    },
    description: {
      ja: "マレーシアでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Malaysia.",
    },
    content: {
      ja: `マレーシアは物価の安さと英語環境が両立する東南アジアの人気留学先です。多民族国家ならではの文化体験も魅力です。

### 学生ビザの概要

**ビザ種別：** Student Pass（MMC申請）
**申請費用：** 約RM2,450〜4,200（EMGS手数料・移民局費・健康診断・保険含む初年度合計目安）
**処理期間：** 1〜3ヶ月
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 健康診断書

### アルバイト・就労ルール

マレーシアでは学生パス所持者は限られた業種でのみアルバイトが可能です。

**学期中：** 就労不可（通常の授業週は働けません）
**休暇中（7日以上の学期休暇）：** 週20時間まで
**条件：** 飲食店・ガソリンスタンド・ミニマーケット・ホテルなどのサービス業種のみ。専門職（医師・会計士等）は禁止。移民局からの就労許可（学校経由）が必要。

### 注意事項

1. 学期中（通常の授業週）はアルバイト不可。7日以上の学期休暇中のみ可能です
2. 就労業種が限定されており、専門職は不可
3. 就労開始前に移民局への許可申請が必要（学校経由）

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約RM1,500〜3,000 |
| 生活費（月額） | 約RM1,500〜2,500 |
| 住居費（月額） | 約RM500〜1,500 |
| 学生ビザ申請費 | RM2,450〜4,200（初年度諸費用合計） |

MoveWorth.studyのシミュレーターでマレーシア留学の総費用を計算してみましょう。`,
      en: `Malaysia is a popular Southeast Asian study destination combining affordable living costs with an English-speaking environment and rich multicultural experiences.

### Student Visa

**Type:** Student Pass (MMC)
**Fee:** RM2,450–4,200 (estimated first-year total including EMGS fee, immigration fee, medical exam, and insurance)
**Processing:** 1–3 months

### Work Rules

Students with a Student Pass are NOT permitted to work during regular academic weeks. Part-time work of up to 20 hours per week is only allowed during semester breaks of 7 or more days. Work is limited to specific sectors such as restaurants, petrol kiosks, mini-markets, and hotels. A separate work authorization from the Immigration Department (via the educational institution) is required.

Use the MoveWorth.study simulator to estimate your total costs for studying in Malaysia.`,
    },
  },

  // TH - タイ
  {
    slug: "study-work-th",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【タイ】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Thailand 2026 — Complete Guide",
    },
    description: {
      ja: "タイでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Thailand.",
    },
    content: {
      ja: `タイは物価の安さと温暖な気候、フレンドリーな文化で人気の留学先です。タイ語だけでなく英語を学べる語学学校も増えています。

### 学生ビザの概要

**ビザ種別：** Non-Immigrant ED Visa
**申請費用：** 約THB2,000〜3,000
**処理期間：** 2〜4週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- パスポートの残有効期限が6ヶ月以上

### アルバイト・就労ルール

タイでは学生ビザ（ED Visa）所持者の就労は原則禁止されています。

**学期中：** 就労不可
**休暇中：** 就労不可
**条件：** 就労するには別途Work Permit（労働許可証）の取得が必要ですが、学生ビザでの取得は非常に困難です。

### 注意事項

1. 無許可就労が発覚した場合、罰金・強制帰国・入国禁止処分を受ける可能性があります
2. 語学学校でのボランティア活動や無償のインターンシップも就労とみなされる場合があります
3. 生活費は事前に十分な資金を準備しておく必要があります

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約THB8,000〜20,000 |
| 生活費（月額） | 約THB15,000〜25,000 |
| 住居費（月額） | 約THB5,000〜15,000 |
| 学生ビザ申請費 | THB2,000〜3,000 |

MoveWorth.studyのシミュレーターでタイ留学の総費用を計算してみましょう。`,
      en: `Thailand is a popular study destination known for its affordable cost of living, warm climate, and friendly culture. An increasing number of language schools offer English programs.

### Student Visa

**Type:** Non-Immigrant ED Visa
**Fee:** THB2,000–3,000
**Processing:** 2–4 weeks

### Work Rules

Part-time work is generally prohibited for students on ED Visas in Thailand. A separate Work Permit is required for any employment, but obtaining one on a student visa is extremely difficult. Students should prepare sufficient funds in advance to cover living expenses.

Use the MoveWorth.study simulator to estimate your total costs for studying in Thailand.`,
    },
  },

  // CZ - チェコ
  {
    slug: "study-work-cz",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【チェコ】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Czech Republic 2026 — Complete Guide",
    },
    description: {
      ja: "チェコでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in the Czech Republic.",
    },
    content: {
      ja: `チェコはプラハの美しい街並みと手頃な生活費で知られる中欧の留学先です。公立大学のチェコ語プログラムは学費無料の場合もあります。

### 学生ビザの概要

**ビザ種別：** 長期滞在ビザ（目的：学習）
**申請費用：** 約CZK2,500
**処理期間：** 60〜120日
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 宿泊先の証明

### アルバイト・就労ルール

チェコでは正規課程の学生に就労が認められています。

**学期中：** 週20時間まで
**休暇中：** 週20時間まで
**条件：** 就労許可（雇用許可、申請費CZK500）の取得が必要。学業が主目的であることが前提。

### 注意事項

1. 週20時間の上限を超える場合は外国人局の許可が別途必要です
2. ビザ申請の処理期間が長い（60〜120日）ため、早めの準備が必要です
3. チェコ語力があると仕事の選択肢が大幅に広がります

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約CZK6,000〜15,000 |
| 生活費（月額） | 約CZK12,000〜20,000 |
| 住居費（月額） | 約CZK7,000〜14,000 |
| 学生ビザ申請費 | CZK2,500 |

MoveWorth.studyのシミュレーターでチェコ留学の総費用を計算してみましょう。`,
      en: `The Czech Republic is a Central European study destination known for Prague's stunning architecture and affordable living costs. Czech-taught programs at public universities may be tuition-free.

### Student Visa

**Type:** Long-term Visa (Purpose: Study)
**Fee:** CZK2,500
**Processing:** 60–120 days

### Work Rules

Degree students can work up to 20 hours per week. An employment permit (fee: CZK500) is required. However, studies must remain the primary purpose. Visa processing takes 60–120 days, so early preparation is essential. Czech language skills expand job options.

Use the MoveWorth.study simulator to estimate your total costs for studying in the Czech Republic.`,
    },
  },

  // CN - 中国
  {
    slug: "study-work-cn",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【中国】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in China 2026 — Complete Guide",
    },
    description: {
      ja: "中国での留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in China.",
    },
    content: {
      ja: `中国は世界第2位の経済大国として、中国語（普通話）を学びながらビジネスチャンスに触れられる留学先です。多くの大学で留学生向けプログラムが充実しています。

### 学生ビザの概要

**ビザ種別：** Xビザ（X1：6ヶ月超/X2：6ヶ月以内）
**申請費用：** 約CNY400〜800
**処理期間：** 4〜10営業日
**主な要件：**
- 入学許可証（JW201/JW202フォーム）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 健康診断書

### アルバイト・就労ルール

中国では学生ビザの種類によって就労ルールが異なります。

**X1ビザ（6ヶ月超の長期留学）学期中：** 週8時間まで（キャンパス内）／週16時間まで（キャンパス外インターン）、PSB（公安局）への就労注記申請が必要
**X2ビザ（6ヶ月以内の短期留学）学期中：** 就労不可
**条件：** X1ビザ所持者はPSBが発行する居留許可に「勤工助学（アルバイト許可）」の注記取得が必要。大学の同意書と雇用主の証明書が要求される。

### 注意事項

1. X2ビザでの就労は一切認められません
2. X1ビザでもPSB許可なしの就労は無許可就労となり、罰金・拘留・強制帰国の対象になります
3. 就労ルールは大学・都市によって異なるため、入学前に大学の留学生担当窓口に確認することを推奨します
4. 中国政府奨学金を受給している場合は生活費が支給されることがあります

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約CNY3,000〜8,000 |
| 生活費（月額） | 約CNY3,000〜7,000 |
| 住居費（月額） | 約CNY1,500〜5,000 |
| 学生ビザ申請費 | CNY400〜800 |

MoveWorth.studyのシミュレーターで中国留学の総費用を計算してみましょう。`,
      en: `China, the world's second-largest economy, offers study opportunities to learn Mandarin while gaining exposure to business opportunities. Many universities have well-established programs for international students.

### Student Visa

**Type:** X Visa (X1: over 6 months / X2: under 6 months)
**Fee:** CNY400–800
**Processing:** 4–10 business days

### Work Rules

Work rules in China depend on your visa type. X1 visa holders (study duration over 6 months) may work part-time after obtaining a formal PSB (Public Security Bureau) endorsement on their residence permit — up to 8 hours/week for on-campus jobs and up to 16 hours/week for off-campus internships. X2 visa holders (study duration under 6 months) are not permitted to work. Unauthorized work can result in fines, detention, and deportation. Rules vary by city and university, so confirm with your institution before arrival. Some government scholarship recipients receive living stipends.

Use the MoveWorth.study simulator to estimate your total costs for studying in China.`,
    },
  },

  // IN - インド
  {
    slug: "study-work-in",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【インド】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in India 2026 — Complete Guide",
    },
    description: {
      ja: "インドでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in India.",
    },
    content: {
      ja: `インドはIT大国として急成長する国で、英語やヒンディー語を学びながら多様な文化を体験できる留学先です。生活費が非常に安い点も魅力です。

### 学生ビザの概要

**ビザ種別：** Student Visa（S Visa）
**申請費用：** 約USD80〜160
**処理期間：** 3〜10営業日
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- オンラインでのビザ申請

### アルバイト・就労ルール

インドでは学生ビザ所持者の就労は原則禁止されています。

**学期中：** 就労不可
**休暇中：** 就労不可
**条件：** インターンシップは受入機関の許可が必要。一般的なアルバイトは不可。

### 注意事項

1. 学生ビザでの一般就労は一切認められません
2. インターンシップは受入大学・機関の公式な許可が必要です
3. インドの物価は非常に安いため、事前に資金を準備すれば就労なしで十分生活可能です

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約INR10,000〜30,000 |
| 生活費（月額） | 約INR20,000〜40,000 |
| 住居費（月額） | 約INR5,000〜20,000 |
| 学生ビザ申請費 | USD80〜160 |

MoveWorth.studyのシミュレーターでインド留学の総費用を計算してみましょう。`,
      en: `India is a rapidly growing IT powerhouse where students can learn English or Hindi while experiencing a diverse culture. The very low cost of living is a major advantage.

### Student Visa

**Type:** Student Visa (S Visa)
**Fee:** USD80–160
**Processing:** 3–10 business days

### Work Rules

Part-time work is generally prohibited for students in India. Internships require official permission from the host institution. India's very low cost of living means students can live comfortably without working if they prepare sufficient funds.

Use the MoveWorth.study simulator to estimate your total costs for studying in India.`,
    },
  },

  // MX - メキシコ
  {
    slug: "study-work-mx",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【メキシコ】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Mexico 2026 — Complete Guide",
    },
    description: {
      ja: "メキシコでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Mexico.",
    },
    content: {
      ja: `メキシコは中南米最大のスペイン語圏国で、活気ある文化と豊かな歴史のなかでスペイン語を学べる留学先です。

### 学生ビザの概要

**ビザ種別：** Visa de Estudiante（一時居住者）
**申請費用：** 約MXN5,000〜6,000
**処理期間：** 2〜4週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- INM（国立移民局）での手続き

### アルバイト・就労ルール

メキシコでは学生ビザ所持者の就労は原則禁止されています。

**学期中：** 就労不可
**休暇中：** 就労不可
**条件：** 大学間協定によるインターンシップは認められる場合があります。

### 注意事項

1. 学生ビザでの一般就労は認められません
2. 大学間協定に基づくインターンシップのみ例外的に認められる場合があります
3. メキシコの物価は比較的安いため、事前に資金を準備すれば就労なしで生活可能です

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約MXN5,000〜12,000 |
| 生活費（月額） | 約MXN8,000〜15,000 |
| 住居費（月額） | 約MXN3,000〜8,000 |
| 学生ビザ申請費 | MXN5,000〜6,000 |

MoveWorth.studyのシミュレーターでメキシコ留学の総費用を計算してみましょう。`,
      en: `Mexico is the largest Spanish-speaking country in Latin America, offering a vibrant culture and rich history — ideal for learning Spanish.

### Student Visa

**Type:** Visa de Estudiante (Temporary Resident)
**Fee:** MXN5,000–6,000
**Processing:** 2–4 weeks

### Work Rules

Part-time work is generally prohibited for students in Mexico. Internships under inter-university agreements may be permitted in some cases. Mexico's relatively affordable living costs mean students can manage without working with adequate preparation.

Use the MoveWorth.study simulator to estimate your total costs for studying in Mexico.`,
    },
  },

  // AR - アルゼンチン
  {
    slug: "study-work-ar",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【アルゼンチン】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Argentina 2026 — Complete Guide",
    },
    description: {
      ja: "アルゼンチンでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Argentina.",
    },
    content: {
      ja: `アルゼンチンはタンゴとサッカーの国として知られ、独特のスペイン語（リオプラテンセ）を学べる南米の留学先です。ブエノスアイレスは「南米のパリ」とも呼ばれています。

### 学生ビザの概要

**ビザ種別：** 一時居住者（学生カテゴリ）
**申請費用：** 約ARS20,000〜（インフレにより変動）
**処理期間：** 4〜8週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 犯罪経歴証明書（アポスティーユ付き）

### アルバイト・就労ルール

アルゼンチンでは学生ビザ所持者の就労は原則禁止されています。

**学期中：** 就労不可
**休暇中：** 就労不可
**条件：** 就労するには別途就労許可の取得が必要です。

### 注意事項

1. 学生ビザでの就労は認められず、別途就労許可が必要です
2. アルゼンチンはインフレ率が非常に高いため、費用の目安は大きく変動します
3. 為替レートの変動にも注意が必要です（公式レートと非公式レートの差がある場合があります）

### 費用の目安

※アルゼンチンはインフレ・為替変動が大きいため、以下の金額は2026年3月時点の目安です。実際の費用は大きく変動する場合があります（1USD≒900ARS・2026年3月時点）。

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約ARS400,000〜600,000 |
| 生活費（月額） | 約ARS300,000〜500,000 |
| 住居費（月額） | 約ARS200,000〜400,000 |
| 学生ビザ申請費 | ARS100,000〜（インフレにより変動） |

MoveWorth.studyのシミュレーターでアルゼンチン留学の総費用を計算してみましょう。`,
      en: `Argentina, the land of tango and football, offers a unique South American study experience with its distinctive Spanish dialect (Rioplatense). Buenos Aires is often called the "Paris of South America."

### Student Visa

**Type:** Temporary Resident (Student Category)
**Fee:** ARS100,000+ (subject to inflation; ~USD70 at 2026 rates)
**Processing:** 4–8 weeks

### Work Rules

Part-time work is prohibited for students in Argentina. A separate work permit is required for employment.

### Cost Estimates (March 2026)

*Note: Argentina has significant inflation and currency fluctuation. Figures below are approximate at ~1 USD = 900 ARS (March 2026) and may change rapidly.*

| Item | Cost |
|------|------|
| Language school (monthly) | ARS400,000–600,000 |
| Living costs (monthly) | ARS300,000–500,000 |
| Accommodation (monthly) | ARS200,000–400,000 |
| Student visa fee | ARS100,000+ (varies with inflation) |

Use the MoveWorth.study simulator to estimate your total costs for studying in Argentina.`,
    },
  },

  // GR - ギリシャ
  {
    slug: "study-work-gr",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【ギリシャ】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Greece 2026 — Complete Guide",
    },
    description: {
      ja: "ギリシャでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Greece.",
    },
    content: {
      ja: `ギリシャは西洋文明の発祥地として、歴史と文化に溢れた環境でギリシャ語や英語を学べる留学先です。生活費もヨーロッパの中では比較的安価です。

### 学生ビザの概要

**ビザ種別：** 学生ビザ（Type D）
**申請費用：** 約€90
**処理期間：** 1〜3ヶ月
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 犯罪経歴証明書

### アルバイト・就労ルール

ギリシャでは学生ビザ所持者にアルバイトが認められています。

**学期中：** 週20時間まで
**休暇中：** 週40時間まで
**条件：** EU/EEA学生は就労制限なし。非EU学生は週20時間の制限あり。AFM（税番号）の取得が必要。

### 注意事項

1. EU/EEA国籍の学生と非EU国籍の学生では就労条件が大きく異なります
2. AFM（税番号）と社会保障番号の取得が就労前に必要です
3. 観光シーズン（夏季）はアルバイトが見つかりやすくなります

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約€300〜800 |
| 生活費（月額） | 約€600〜1,200 |
| 住居費（月額） | 約€250〜600 |
| 学生ビザ申請費 | €90 |

MoveWorth.studyのシミュレーターでギリシャ留学の総費用を計算してみましょう。`,
      en: `Greece, the birthplace of Western civilization, offers a culturally rich study environment with relatively affordable living costs for Europe.

### Student Visa

**Type:** Student Visa (Type D)
**Fee:** €90
**Processing:** 1–3 months

### Work Rules

Non-EU students can work up to 20 hours per week during term and 40 hours during holidays. EU/EEA students face no restrictions. An AFM (tax number) and social security number are required. Summer tourist season offers more job opportunities.

Use the MoveWorth.study simulator to estimate your total costs for studying in Greece.`,
    },
  },

  // MT - マルタ
  {
    slug: "study-work-mt",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【マルタ】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Malta 2026 — Complete Guide",
    },
    description: {
      ja: "マルタでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Malta.",
    },
    content: {
      ja: `マルタは地中海に浮かぶ小さな島国で、英語が公用語のひとつであるため、ヨーロッパで英語を学ぶ穴場的な留学先として人気です。

### 学生ビザの概要

**ビザ種別：** Student Residence Permit（Identity Malta）
**申請費用：** 約€300
**処理期間：** 2〜6週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 宿泊先の証明

### アルバイト・就労ルール

マルタでは認定校の学生に限定的な就労が認められています。

**学期中：** 週20時間まで（入学後3ヶ月経過後から）
**休暇中：** 週20時間まで
**条件：** 認定校在籍のみ。Employment Licence（雇用許可）の取得が必要。入学後最初の3ヶ月間は就労不可。

### 注意事項

1. 入学後最初の3ヶ月間は就労が認められません。3ヶ月経過後から週20時間まで可能です
2. Employment Licence（雇用許可）の申請に数週間かかる場合があります
3. マルタは小さな国のため、アルバイトの競争率が高い場合があります

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約€600〜1,500 |
| 生活費（月額） | 約€800〜1,500 |
| 住居費（月額） | 約€400〜900 |
| 学生ビザ申請費 | €300 |

MoveWorth.studyのシミュレーターでマルタ留学の総費用を計算してみましょう。`,
      en: `Malta is a small Mediterranean island nation where English is an official language, making it a popular hidden gem for studying English in Europe.

### Student Visa

**Type:** Student Residence Permit (Identity Malta)
**Fee:** €300
**Processing:** 2–6 weeks

### Work Rules

Students at approved schools can work up to 20 hours per week, but only after the first 3 months of enrollment. An Employment Licence is required. Malta's small size means part-time jobs can be competitive.

Use the MoveWorth.study simulator to estimate your total costs for studying in Malta.`,
    },
  },

  // ZA - 南アフリカ
  {
    slug: "study-work-za",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【南アフリカ】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in South Africa 2026 — Complete Guide",
    },
    description: {
      ja: "南アフリカでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in South Africa.",
    },
    content: {
      ja: `南アフリカは英語圏でありながら手頃な費用で留学できる国です。多様な文化と雄大な自然が魅力で、英語を学ぶ穴場的な留学先です。

### 学生ビザの概要

**ビザ種別：** Study Visa
**申請費用：** 約ZAR900〜1,500
**処理期間：** 4〜8週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 犯罪経歴証明書（無犯罪証明）

### アルバイト・就労ルール

南アフリカでは、ビザにその旨が明記されている場合に限り就労が認められます。

**学期中：** 週20時間まで（ビザに就労条件が明記されていること）
**休暇中：** フルタイム就労可能
**条件：** 就労許可はビザ取得時に申請・取得が必要。すべての学生ビザに自動的に就労権が付与されるわけではありません。

### 注意事項

1. 就労許可はビザ取得時に申請が必要。すべての学生ビザに自動付与されるわけではないため、事前に確認が必要です
2. 無許可就労が発覚するとビザ取消・強制帰国の対象です
3. 治安面での注意が必要です。安全な地域を選んで生活しましょう

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約ZAR5,000〜12,000 |
| 生活費（月額） | 約ZAR7,000〜15,000 |
| 住居費（月額） | 約ZAR5,000〜12,000 |
| 学生ビザ申請費 | ZAR900〜1,500 |

MoveWorth.studyのシミュレーターで南アフリカ留学の総費用を計算してみましょう。`,
      en: `South Africa is an affordable English-speaking study destination with diverse cultures and stunning natural landscapes.

### Student Visa

**Type:** Study Visa
**Fee:** ZAR900–1,500
**Processing:** 4–8 weeks

### Work Rules

Students can work up to 20 hours per week during term time and full-time during holidays, provided the study visa explicitly endorses work rights. Not all student visas automatically include work authorization — students must confirm this at the time of application. Unauthorized work can result in visa cancellation and deportation.

Use the MoveWorth.study simulator to estimate your total costs for studying in South Africa.`,
    },
  },

  // FI - フィンランド
  {
    slug: "study-work-fi",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【フィンランド】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Finland 2026 — Complete Guide",
    },
    description: {
      ja: "フィンランドでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Finland.",
    },
    content: {
      ja: `フィンランドは世界トップクラスの教育制度と美しい自然で知られる北欧の留学先です。英語での大学プログラムも充実しています。

### 学生ビザの概要

**ビザ種別：** 居住許可（opiskelijan oleskelulupa）
**申請費用：** 約€600（2026年1月以降・オンライン申請。紙申請は€750）
**処理期間：** 1〜4ヶ月
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- フィンランド移民局（Migri）への申請

### アルバイト・就労ルール

フィンランドでは正規課程の学生に幅広い就労が認められています。

**学期中・休暇中：** 週平均30時間まで（年間通じた平均で管理）
**休暇中：** フルタイム可能（ただし年間平均30時間以内に収める必要あり）
**条件：** 正規課程（学位取得目的）の学生が対象。学位に含まれるインターンシップ・卒論は就労時間に含まれない。

### 注意事項

1. 就労時間は年間を通じた週平均30時間以内で管理されます（繁忙期にフルタイムで働いても年平均が30時間以内であればOK）
2. 個人番号（henkilötunnus）の取得が就労や行政手続きに必要です
3. フィンランド語力があると就職先の選択肢が大幅に広がります

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約€500〜1,200 |
| 生活費（月額） | 約€700〜1,200 |
| 住居費（月額） | 約€350〜800 |
| 学生ビザ申請費 | €600（2026年1月以降・オンライン申請） |

MoveWorth.studyのシミュレーターでフィンランド留学の総費用を計算してみましょう。`,
      en: `Finland is a Nordic study destination known for its world-class education system and beautiful natural environment, with many English-taught university programs.

### Student Visa

**Type:** Residence Permit (opiskelijan oleskelulupa)
**Fee:** €600 (from January 2026, online application; paper application €750)
**Processing:** 1–4 months

### Work Rules

Degree students can work an average of up to 30 hours per week (measured as an annual average). Full-time work is permitted during holidays as long as the annual average does not exceed 30 hours. Internships and thesis work included in the degree are exempt from this limit. A personal identity code (henkilötunnus) is required for employment. Finnish language skills significantly improve job prospects.

Use the MoveWorth.study simulator to estimate your total costs for studying in Finland.`,
    },
  },

  // AT - オーストリア
  {
    slug: "study-work-at",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【オーストリア】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Austria 2026 — Complete Guide",
    },
    description: {
      ja: "オーストリアでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Austria.",
    },
    content: {
      ja: `オーストリアは音楽と芸術の都ウィーンを中心に、質の高い教育と豊かな文化が魅力の留学先です。ドイツ語を学ぶのに最適な環境です。

### 学生ビザの概要

**ビザ種別：** 学生居住許可（Aufenthaltstitel "Studierender"）
**申請費用：** 約€160
**処理期間：** 2〜4ヶ月
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 宿泊先の証明

### アルバイト・就労ルール

オーストリアでは学生に一定の就労が認められています。

**学期中：** 週20時間まで
**休暇中：** 週20時間まで（学期中と同じ制限）
**条件：** 学習負担の証明が必要。Beschäftigungsbewilligung（雇用許可）を雇用主が取得する必要あり。

### 注意事項

1. 雇用許可（Beschäftigungsbewilligung）の申請は雇用主が行います
2. 学習負担が証明できないと就労許可が下りない場合があります
3. 休暇中も週20時間の制限が維持されます

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約€400〜1,000 |
| 生活費（月額） | 約€700〜1,200 |
| 住居費（月額） | 約€350〜800 |
| 学生ビザ申請費 | €160 |

MoveWorth.studyのシミュレーターでオーストリア留学の総費用を計算してみましょう。`,
      en: `Austria, centered around the cultural capital Vienna, offers high-quality education and a rich cultural heritage — an ideal environment for learning German.

### Student Visa

**Type:** Student Residence Permit (Aufenthaltstitel "Studierender")
**Fee:** €160
**Processing:** 2–4 months

### Work Rules

Students can work up to 20 hours per week during both term and holidays. Proof of study workload is required, and the employer must obtain a Beschäftigungsbewilligung (employment permit). The 20-hour limit applies year-round.

Use the MoveWorth.study simulator to estimate your total costs for studying in Austria.`,
    },
  },

  // NO - ノルウェー
  {
    slug: "study-work-no",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【ノルウェー】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Norway 2026 — Complete Guide",
    },
    description: {
      ja: "ノルウェーでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Norway.",
    },
    content: {
      ja: `ノルウェーは北欧の自然と高水準の教育で知られる留学先です。公立大学の学費が無料（EU/EEA外も含む）である点が大きな魅力です。

### 学生ビザの概要

**ビザ種別：** 学生居住許可
**申請費用：** 約NOK5,300〜6,500（2025年時点）
**処理期間：** 1〜3ヶ月
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- UDI（ノルウェー入国管理局）への申請

### アルバイト・就労ルール

ノルウェーでは学生に一定の就労が認められています。

**学期中：** 週20時間まで
**休暇中：** 週40時間まで
**条件：** 正規課程の学生であること。税番号の取得が必要。

### 注意事項

1. 物価が非常に高いため、アルバイト収入だけでは生活費を賄いきれない場合があります
2. D番号（税番号）の取得が就労に必要です
3. ノルウェー語力があると仕事が見つかりやすくなります

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約NOK5,000〜12,000 |
| 生活費（月額） | 約NOK12,000〜18,000 |
| 住居費（月額） | 約NOK5,000〜12,000 |
| 学生ビザ申請費 | NOK5,300〜6,500 |

MoveWorth.studyのシミュレーターでノルウェー留学の総費用を計算してみましょう。`,
      en: `Norway is a Nordic study destination known for stunning nature and high-quality education. Public universities are tuition-free, even for non-EU/EEA students.

### Student Visa

**Type:** Student Residence Permit
**Fee:** NOK5,300–6,500 (as of 2025)
**Processing:** 1–3 months

### Work Rules

Students can work up to 20 hours per week during term and 40 hours during holidays. A D-number (tax number) is required. Norway's high cost of living means part-time work alone may not cover expenses. Norwegian language skills improve job prospects.

Use the MoveWorth.study simulator to estimate your total costs for studying in Norway.`,
    },
  },

  // DK - デンマーク
  {
    slug: "study-work-dk",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【デンマーク】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Denmark 2026 — Complete Guide",
    },
    description: {
      ja: "デンマークでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Denmark.",
    },
    content: {
      ja: `デンマークは「世界一幸福な国」として知られ、先進的な教育制度とデザイン文化が魅力の留学先です。

### 学生ビザの概要

**ビザ種別：** 居住許可（opholdstilladelse）
**申請費用：** 約DKK1,900
**処理期間：** 1〜3ヶ月
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- SIRI（デンマーク移民局）への申請

### アルバイト・就労ルール

デンマークでは学生に一定の就労が認められています。

**学期中：** 週20時間まで
**休暇中：** 週40時間まで（夏季6〜8月）
**条件：** 居住許可の就労条件に準拠。CPR番号（国民登録番号）の取得が必要。

### 注意事項

1. CPR番号を取得しないと銀行口座の開設や就労ができません
2. 夏季（6〜8月）のみフルタイム就労が認められます
3. デンマーク語力があると就職の幅が広がります

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約DKK5,000〜12,000 |
| 生活費（月額） | 約DKK6,000〜9,000 |
| 住居費（月額） | 約DKK3,000〜8,000 |
| 学生ビザ申請費 | DKK1,900 |

MoveWorth.studyのシミュレーターでデンマーク留学の総費用を計算してみましょう。`,
      en: `Denmark, known as one of the happiest countries in the world, offers a progressive education system and strong design culture.

### Student Visa

**Type:** Residence Permit (opholdstilladelse)
**Fee:** DKK1,900
**Processing:** 1–3 months

### Work Rules

Students can work up to 20 hours per week during term and 40 hours during summer (June–August). A CPR number (civil registration number) is required for employment and banking. Danish language skills can broaden job opportunities.

Use the MoveWorth.study simulator to estimate your total costs for studying in Denmark.`,
    },
  },

  // BR - ブラジル
  {
    slug: "study-work-br",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【ブラジル】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Brazil 2026 — Complete Guide",
    },
    description: {
      ja: "ブラジルでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Brazil.",
    },
    content: {
      ja: `ブラジルはポルトガル語圏最大の国で、活気ある文化と多様な自然が魅力の留学先です。ポルトガル語を学ぶには最適な環境です。

### 学生ビザの概要

**ビザ種別：** VITEM IV（学生ビザ）
**申請費用：** 約USD180（大使館・領事館により異なる）
**処理期間：** 2〜4週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 犯罪経歴証明書

### アルバイト・就労ルール

ブラジルでは学生ビザ所持者の就労は原則禁止されています。

**学期中：** 就労不可
**休暇中：** 就労不可
**条件：** 大学公認のインターンシップ（Estágio）のみ認められる場合があります。

### 注意事項

1. 一般的なアルバイトは学生ビザでは認められません
2. 大学公認のインターンシップは「Estágio」として正式な契約が必要です
3. 無許可就労は罰金・ビザ取消の対象です

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約BRL1,500〜4,000 |
| 生活費（月額） | 約BRL3,000〜6,000 |
| 住居費（月額） | 約BRL1,500〜4,000 |
| 学生ビザ申請費 | 約USD180 |

MoveWorth.studyのシミュレーターでブラジル留学の総費用を計算してみましょう。`,
      en: `Brazil is the largest Portuguese-speaking country, offering a vibrant culture and diverse natural landscapes — an ideal environment for learning Portuguese.

### Student Visa

**Type:** VITEM IV (Student Visa)
**Fee:** Approx. USD180 (may vary by consulate)
**Processing:** 2–4 weeks

### Work Rules

Part-time work is generally prohibited for students in Brazil. Only university-approved internships (Estágio) with formal contracts may be permitted. Unauthorized work can result in fines and visa cancellation.

Use the MoveWorth.study simulator to estimate your total costs for studying in Brazil.`,
    },
  },

  // CO - コロンビア
  {
    slug: "study-work-co",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【コロンビア】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Colombia 2026 — Complete Guide",
    },
    description: {
      ja: "コロンビアでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Colombia.",
    },
    content: {
      ja: `コロンビアは南米のスペイン語圏で、親しみやすい人々と手頃な生活費が魅力の留学先です。スペイン語を学ぶ留学生に人気があります。

### 学生ビザの概要

**ビザ種別：** Visa de Estudiante（M-19）
**申請費用：** 約USD285（2026年・Cancillería基準）
**処理期間：** 2〜4週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- Cédula de Extranjería（外国人証明書）の取得

### アルバイト・就労ルール

コロンビアでは学部生・非学位課程の学生ビザ所持者の就労は原則禁止されています。

**学部生・語学コース学生：** 就労不可
**大学院生（修士・博士課程）：** 週20時間まで就労可能（雇用主がMigración ColombiaおよびMinisterio de Trabajoに申告が必要）
**条件：** 就労するには大学院在籍が要件。

### 注意事項

1. 学部生・語学コース学生はアルバイト不可。大学院生のみ週20時間まで就労可能です
2. 無許可就労が発覚するとビザ取消・罰金の対象です
3. コロンビアの物価は安いため、事前に資金を準備すれば就労なしで生活可能です

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約COP1,500,000〜3,500,000 |
| 生活費（月額） | 約COP1,800,000〜3,500,000 |
| 住居費（月額） | 約COP800,000〜2,000,000 |
| 学生ビザ申請費 | USD285（2026年・Cancillería基準） |

MoveWorth.studyのシミュレーターでコロンビア留学の総費用を計算してみましょう。`,
      en: `Colombia is a Spanish-speaking South American country known for its friendly people and affordable cost of living, popular among students learning Spanish.

### Student Visa

**Type:** Visa de Estudiante (M-19)
**Fee:** USD285 (2026 rate per Cancillería)
**Processing:** 2–4 weeks

### Work Rules

Part-time work is generally prohibited for undergraduate and language course students. Postgraduate students (master's and doctoral programs) may work up to 20 hours per week, provided the employer reports to Migración Colombia and the Ministry of Labor. Colombia's low cost of living means students can manage without working with proper financial preparation.

Use the MoveWorth.study simulator to estimate your total costs for studying in Colombia.`,
    },
  },

  // IT - イタリア
  {
    slug: "study-work-it",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【イタリア】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Italy 2026 — Complete Guide",
    },
    description: {
      ja: "イタリアでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Italy.",
    },
    content: {
      ja: `イタリアは芸術・ファッション・料理の本場として、文化的に豊かな留学体験ができる国です。イタリア語を学びながら世界遺産に囲まれた生活を楽しめます。

### 学生ビザの概要

**ビザ種別：** Visto per Studio（D種）
**申請費用：** 約€116
**処理期間：** 1〜3ヶ月
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 宿泊証明書

### アルバイト・就労ルール

イタリアでは在留許可取得後に就労が認められます。

**学期中：** 週20時間まで
**休暇中：** 週40時間まで
**条件：** Permesso di Soggiorno（在留許可）取得後に就労可能。Codice Fiscale（税番号）の取得が必要。

### 注意事項

1. Permesso di Soggiornoの取得に数ヶ月かかる場合があります
2. Codice Fiscale（税番号）を事前に取得しておきましょう
3. 到着後8日以内に郵便局でPermesso di Soggiornoの申請が必要です

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約€400〜1,000 |
| 生活費（月額） | 約€800〜1,500 |
| 住居費（月額） | 約€400〜900 |
| 学生ビザ申請費 | €116 |

MoveWorth.studyのシミュレーターでイタリア留学の総費用を計算してみましょう。`,
      en: `Italy offers a culturally rich study experience as the home of art, fashion, and cuisine. Students can learn Italian while living among UNESCO World Heritage Sites.

### Student Visa

**Type:** Visto per Studio (Type D)
**Fee:** €116
**Processing:** 1–3 months

### Work Rules

Students can work up to 20 hours per week during term and 40 hours during holidays after obtaining a Permesso di Soggiorno (residence permit). A Codice Fiscale (tax number) is required. The residence permit application must be submitted within 8 days of arrival.

Use the MoveWorth.study simulator to estimate your total costs for studying in Italy.`,
    },
  },

  // PT - ポルトガル
  {
    slug: "study-work-pt",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【ポルトガル】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Portugal 2026 — Complete Guide",
    },
    description: {
      ja: "ポルトガルでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Portugal.",
    },
    content: {
      ja: `ポルトガルはヨーロッパの中でも物価が比較的安く、温暖な気候と美しい街並みが魅力の留学先です。ポルトガル語や英語を学べます。

### 学生ビザの概要

**ビザ種別：** Visto de Residência para Estudante
**申請費用：** 入国ビザ約€90〜110（領事館）＋在ポルトガル在留許可€108〜181（AIMA）合計約€200〜290
**処理期間：** 1〜3ヶ月
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 犯罪経歴証明書

### アルバイト・就労ルール

ポルトガルでは学生ビザ所持者にアルバイトが認められています。

**学期中：** 週20時間まで
**休暇中：** 週40時間まで
**条件：** 学生ビザに就労権が含まれる。社会保障番号（NIF）の取得が必要。

### 注意事項

1. NIF（税番号）とNISS（社会保障番号）の取得が就労前に必要です
2. 就労時間の制限を超えるとビザ更新に影響する場合があります
3. 賃金はEU最低賃金基準に準拠します

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約€400〜900 |
| 生活費（月額） | 約€700〜1,200 |
| 住居費（月額） | 約€400〜900 |
| 学生ビザ申請費 | 入国ビザ€90〜110＋在留許可€108〜181（合計約€200〜290） |

MoveWorth.studyのシミュレーターでポルトガル留学の総費用を計算してみましょう。`,
      en: `Portugal offers an affordable European study experience with warm weather, beautiful cities, and opportunities to learn Portuguese or English.

### Student Visa

**Type:** Visto de Residência para Estudante
**Fee:** Entry visa €90–110 (consulate) + residence permit €108–181 (AIMA in Portugal) = approx. €200–290 total
**Processing:** 1–3 months

### Work Rules

Students can work up to 20 hours per week during term and 40 hours during holidays. The student visa includes work authorization. A NIF (tax number) and NISS (social security number) are required before starting work.

Use the MoveWorth.study simulator to estimate your total costs for studying in Portugal.`,
    },
  },

  // ES - スペイン
  {
    slug: "study-work-es",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【スペイン】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Spain 2026 — Complete Guide",
    },
    description: {
      ja: "スペインでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Spain.",
    },
    content: {
      ja: `スペインは情熱的な文化とスペイン語を学べる人気の留学先です。バルセロナやマドリードなど魅力的な都市が多く、生活費もヨーロッパの中では比較的安価です。

### 学生ビザの概要

**ビザ種別：** Visado de Estudio
**申請費用：** 約€60（国籍により異なる。米国籍€135、カナダ籍€80など）
**処理期間：** 1〜2ヶ月
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 犯罪経歴証明書

### アルバイト・就労ルール

スペインでは学生ビザ所持者にアルバイトが認められています。

**学期中：** 週30時間まで（2025年より20時間から引き上げ）
**休暇中：** 週40時間まで
**条件：** 雇用主が就労許可を申請する必要がある。NIE（外国人識別番号）の取得が必要。

### 注意事項

1. NIE（外国人識別番号）の取得に時間がかかることがあります
2. 就労許可の申請は雇用主が行う必要があり、すべての雇用主が対応するわけではありません
3. 自営業やフリーランスは学生ビザでは認められません

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約€400〜900 |
| 生活費（月額） | 約€700〜1,200 |
| 住居費（月額） | 約€350〜800 |
| 学生ビザ申請費 | €60〜（国籍により異なる） |

MoveWorth.studyのシミュレーターでスペイン留学の総費用を計算してみましょう。`,
      en: `Spain is a popular destination for learning Spanish, with vibrant cities like Barcelona and Madrid and relatively affordable living costs for Europe.

### Student Visa

**Type:** Visado de Estudio
**Fee:** €60+ (varies by nationality; US nationals €135, Canadians €80)
**Processing:** 1–2 months

### Work Rules

Students can work up to 30 hours per week during term (increased from 20 hours in 2025) and 40 hours during holidays. The employer must apply for a work permit, and students need an NIE (foreigner identification number). Self-employment is not permitted on a student visa.

Use the MoveWorth.study simulator to estimate your total costs for studying in Spain.`,
    },
  },

  // GE - ジョージア
  {
    slug: "study-work-ge",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【ジョージア】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Georgia 2026 — Complete Guide",
    },
    description: {
      ja: "ジョージアでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Georgia.",
    },
    content: {
      ja: `ジョージアはコーカサス地方に位置する注目の留学先で、ビザ不要で長期滞在できる国籍が多く、生活費が非常に安いのが特徴です。

### 学生ビザの概要

**ビザ種別：** ビザ不要（180日、多くの国籍）または学生在留許可
**申請費用：** 無料〜約GEL100
**処理期間：** ビザ不要の場合は即日、在留許可は数週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 多くの国籍は180日間ビザなし滞在可能

### アルバイト・就労ルール

ジョージアでは就労に関する制限が比較的少なく、多くの国籍でビザなし滞在中の就労が認められてきました。ただし2026年3月以降、新規制により状況が変わります。

**2026年3月以前：** 制限なし（多くの国籍）
**2026年3月1日以降：** 就労には別途就労許可の取得が必要（新規制施行）
**条件：** 180日超の滞在には在留許可の取得が必要。新規制の詳細は最新情報を確認してください。

### 注意事項

1. 2026年3月1日以降、就労には就労許可が必要となりました（新規制）。渡航前に最新情報を必ず確認してください
2. 180日を超える滞在には在留許可の取得が必要です
3. 税務登録が必要な場合があります

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約GEL300〜800 |
| 生活費（月額） | 約GEL600〜1,200 |
| 住居費（月額） | 約GEL300〜700 |
| 学生ビザ申請費 | 無料〜GEL100 |

MoveWorth.studyのシミュレーターでジョージア留学の総費用を計算してみましょう。`,
      en: `Georgia, located in the Caucasus region, is an emerging study destination offering visa-free stays for many nationalities and very low living costs.

### Student Visa

**Type:** Visa-free (180 days for many nationalities) or Student Residence Permit
**Fee:** Free – GEL100
**Processing:** Immediate (visa-free) or several weeks (residence permit)

### Work Rules

**Before March 2026:** Most nationalities could work freely without a work permit.
**From March 1, 2026 (new regulation):** A separate work permit is now required for employment. Students should confirm the latest requirements before traveling.

For stays over 180 days, a residence permit is also needed.

Use the MoveWorth.study simulator to estimate your total costs for studying in Georgia.`,
    },
  },

  // IE - アイルランド
  {
    slug: "study-work-ie",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【アイルランド】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Ireland 2026 — Complete Guide",
    },
    description: {
      ja: "アイルランドでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Ireland.",
    },
    content: {
      ja: `アイルランドは英語圏で親しみやすい文化と美しい自然が魅力の留学先です。EU加盟国のため、ヨーロッパへのアクセスも便利です。

### 学生ビザの概要

**ビザ種別：** Study Visa（C type）/ Stamp 2
**申請費用：** 約€60
**処理期間：** 4〜8週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 学費の支払い証明

### アルバイト・就労ルール

アイルランドではStamp 2の学生に就労が認められています。

**学期中：** 週20時間まで
**休暇中：** 週40時間まで（6月〜9月と12月〜1月）
**条件：** 週25時間未満の英語学校のみの在籍者は就労不可の場合あり。Stamp 2の許可が必要。

### 注意事項

1. 短期の英語学校（週25時間未満のコース）の学生は就労が認められない場合があります
2. PPS番号（社会保障番号）の取得が就労に必要です
3. 休暇中のフルタイム就労は6〜9月と12月〜1月に限定されます

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約€700〜1,500 |
| 生活費（月額） | 約€1,200〜2,000 |
| 住居費（月額） | 約€700〜1,500 |
| 学生ビザ申請費 | €60 |

MoveWorth.studyのシミュレーターでアイルランド留学の総費用を計算してみましょう。`,
      en: `Ireland is an English-speaking EU country with a friendly culture and beautiful natural landscapes, offering convenient access to the rest of Europe.

### Student Visa

**Type:** Study Visa (C type) / Stamp 2
**Fee:** €60
**Processing:** 4–8 weeks

### Work Rules

Stamp 2 students can work up to 20 hours per week during term and 40 hours during holiday periods (June–September and December–January). Students on short English courses (under 25 hours/week) may not be eligible. A PPS number (social security) is required.

Use the MoveWorth.study simulator to estimate your total costs for studying in Ireland.`,
    },
  },

  // SE - スウェーデン
  {
    slug: "study-work-se",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【スウェーデン】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Sweden 2026 — Complete Guide",
    },
    description: {
      ja: "スウェーデンでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Sweden.",
    },
    content: {
      ja: `スウェーデンは先進的な教育制度と高い生活水準で知られる北欧の留学先です。英語での大学プログラムも豊富です。

### 学生ビザの概要

**ビザ種別：** 居住許可（uppehållstillstånd）
**申請費用：** 約SEK1,500
**処理期間：** 1〜4ヶ月
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- スウェーデン移民庁（Migrationsverket）への申請

### アルバイト・就労ルール

スウェーデンでは正規課程の学生に就労制限がありません。

**学期中：** 制限なし
**休暇中：** 制限なし
**条件：** 正規課程（フルタイム）の大学・大学院に在籍していること。就労時間の上限なし。

### 注意事項

1. 就労制限がないとはいえ、学業に支障が出ないよう注意しましょう
2. 語学学校のみの在籍者は就労条件が異なる場合があります
3. 個人番号（personnummer）の取得が就労や銀行口座開設に必要です

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約SEK5,000〜12,000 |
| 生活費（月額） | 約SEK7,000〜12,000 |
| 住居費（月額） | 約SEK3,000〜8,000 |
| 学生ビザ申請費 | SEK1,500 |

MoveWorth.studyのシミュレーターでスウェーデン留学の総費用を計算してみましょう。`,
      en: `Sweden offers a progressive education system and high standard of living, with many English-taught university programs available.

### Student Visa

**Type:** Residence Permit (uppehållstillstånd)
**Fee:** SEK1,500
**Processing:** 1–4 months

### Work Rules

Full-time degree students in Sweden have no work hour restrictions. There is no cap on weekly hours. Students need a personal number (personnummer) for employment and banking. Language school students may face different conditions.

Use the MoveWorth.study simulator to estimate your total costs for studying in Sweden.`,
    },
  },

  // NL - オランダ
  {
    slug: "study-work-nl",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【オランダ】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in the Netherlands 2026 — Complete Guide",
    },
    description: {
      ja: "オランダでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in the Netherlands.",
    },
    content: {
      ja: `オランダは英語での大学プログラムが豊富で、非英語圏ながら英語力の高さで知られる留学先です。

### 学生ビザの概要

**ビザ種別：** Machtiging tot Voorlopig Verblijf（MVV）+ 居住許可
**申請費用：** €311〜（MVV＋居住許可の政府手数料）
**処理期間：** 2〜8週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 受入教育機関がスポンサーとして申請

### アルバイト・就労ルール

オランダでは学生が一定の条件で就労できます。

**学期中：** 週16時間まで
**休暇中：** 週40時間まで（6〜8月）
**条件：** 雇用主がTWV（労働許可）を取得する必要がある。EU/EEA国籍の学生は制限なし。

### 注意事項

1. TWV（労働許可）の申請は雇用主が行う必要があります
2. フリーランスとして働く場合は別途の許可が必要です
3. 夏季（6〜8月）のみフルタイム就労が認められます

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約€600〜1,500 |
| 生活費（月額） | 約€700〜1,100 |
| 住居費（月額） | 約€500〜1,200 |
| 学生ビザ申請費 | €311〜 |

MoveWorth.studyのシミュレーターでオランダ留学の総費用を計算してみましょう。`,
      en: `The Netherlands is known for its extensive English-taught university programs and high English proficiency, making it an accessible study destination for international students.

### Student Visa

**Type:** MVV + Residence Permit
**Fee:** €311+ (government fee for MVV and residence permit combined)
**Processing:** 2–8 weeks

### Work Rules

Students can work up to 16 hours per week during term time and full-time (40 hours) during summer holidays (June–August). The employer must obtain a TWV (work permit). EU/EEA nationals face no restrictions. Freelance work requires a separate permit.

Use the MoveWorth.study simulator to estimate your total costs for studying in the Netherlands.`,
    },
  },

  // CH - スイス
  {
    slug: "study-work-ch",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【スイス】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Switzerland 2026 — Complete Guide",
    },
    description: {
      ja: "スイスでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Switzerland.",
    },
    content: {
      ja: `スイスはホスピタリティ教育や国際機関が集まる国として、質の高い教育と安全な環境が魅力の留学先です。

### 学生ビザの概要

**ビザ種別：** 学生居住許可（Aufenthaltsbewilligung）
**申請費用：** 約CHF162（居住許可証登録料。州により異なる）
**処理期間：** 2〜8週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 各州（カントン）の移民局への申請

### アルバイト・就労ルール

スイスでは学生が一定条件で就労できますが、語学学校生は制限が厳しい場合があります。

**学期中：** 週15時間まで（入学後6ヶ月経過後から）
**休暇中：** フルタイム就労可能
**条件：** 入学から6ヶ月経過後に就労可能。語学学校のみの在籍者は対象外の場合あり。

### 注意事項

1. 語学学校の学生は就労が認められない場合があります
2. 就労開始は入学後6ヶ月経過してからです
3. スイスの物価は非常に高いため、十分な資金準備が必要です

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約CHF1,500〜3,500 |
| 生活費（月額） | 約CHF1,800〜3,000 |
| 住居費（月額） | 約CHF800〜1,800 |
| 学生ビザ申請費 | CHF162〜（州により異なる） |

MoveWorth.studyのシミュレーターでスイス留学の総費用を計算してみましょう。`,
      en: `Switzerland is renowned for its hospitality education and concentration of international organizations, offering high-quality education in a safe environment.

### Student Visa

**Type:** Student Residence Permit (Aufenthaltsbewilligung)
**Fee:** CHF162+ (residence permit registration fee; varies by canton)
**Processing:** 2–8 weeks

### Work Rules

Students can work up to 15 hours per week after 6 months of enrollment. Full-time work is permitted during semester breaks. Language school students may not be eligible. Switzerland's high cost of living means students should prepare substantial funds.

Use the MoveWorth.study simulator to estimate your total costs for studying in Switzerland.`,
    },
  },

  // AU - オーストラリア
  {
    slug: "study-work-au",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【オーストラリア】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Australia 2026 — Complete Guide",
    },
    description: {
      ja: "オーストラリアでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Australia.",
    },
    content: {
      ja: `オーストラリアは温暖な気候と多文化環境で、英語留学・ワーキングホリデーの人気が高い国です。2023年の制度改正で就労時間が拡大されました。

### 学生ビザの概要

**ビザ種別：** Student Visa（Subclass 500）
**申請費用：** 約AUD2,000（2025年7月以降。それ以前はAUD710）
**処理期間：** 2〜8週間
**主な要件：**
- 入学許可証（CoE: Confirmation of Enrolment）
- 残高証明書（一定額以上の資金証明）
- 海外学生健康保険（OSHC）への加入
- GTE（Genuine Temporary Entrant）要件

### アルバイト・就労ルール

オーストラリアでは2023年の改正で就労時間が拡大されました。

**学期中：** 隔週48時間まで（2週間で48時間）
**休暇中：** 制限なし
**条件：** コース開始後から自動的に就労が認められる。TFN（Tax File Number）の取得が必要。

### 注意事項

1. 隔週48時間の計算方法に注意しましょう（2週間の合計で管理）
2. TFN（Tax File Number）を取得しないと給与から最高税率が適用されます
3. ワーキングホリデービザとの併用はできません

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約AUD1,500〜3,000 |
| 生活費（月額） | 約AUD1,500〜2,500 |
| 住居費（月額） | 約AUD800〜2,000 |
| 学生ビザ申請費 | AUD2,000（2025年7月以降） |

MoveWorth.studyのシミュレーターでオーストラリア留学の総費用を計算してみましょう。`,
      en: `Australia is a top destination for English study and working holidays, known for its warm climate and multicultural environment. The 2023 reform expanded student work hours.

### Student Visa

**Type:** Student Visa (Subclass 500)
**Fee:** AUD2,000 (from July 2025; previously AUD710)
**Processing:** 2–8 weeks

### Work Rules

Students can work up to 48 hours per fortnight (two-week period) during term time, with no limit during holidays. Work is permitted automatically once the course starts. A Tax File Number (TFN) is required to avoid the highest tax rate on earnings.

Use the MoveWorth.study simulator to estimate your total costs for studying in Australia.`,
    },
  },

  // NZ - ニュージーランド
  {
    slug: "study-work-nz",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【ニュージーランド】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in New Zealand 2026 — Complete Guide",
    },
    description: {
      ja: "ニュージーランドでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in New Zealand.",
    },
    content: {
      ja: `ニュージーランドは自然豊かな環境とフレンドリーな国民性で知られる、英語留学に最適な国の一つです。

### 学生ビザの概要

**ビザ種別：** Student Visa
**申請費用：** 約NZD330
**処理期間：** 2〜6週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- NZQA認定校への入学

### アルバイト・就労ルール

ニュージーランドでは認定校の学生に就労が認められています。

**学期中：** 週25時間まで（2025年11月3日以降。それ以前は週20時間）
**休暇中：** フルタイム就労可能
**条件：** NZQA（ニュージーランド資格機構）認定校在籍が必要。14週間以上のフルタイムコースに在籍していること。

### 注意事項

1. 短期コース（14週間未満）の学生は就労が認められない場合があります
2. IRD番号（税番号）の取得が就労に必要です
3. 自営業やフリーランスとしての就労は認められません

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約NZD1,800〜3,500 |
| 生活費（月額） | 約NZD1,500〜2,500 |
| 住居費（月額） | 約NZD800〜1,800 |
| 学生ビザ申請費 | NZD330 |

MoveWorth.studyのシミュレーターでニュージーランド留学の総費用を計算してみましょう。`,
      en: `New Zealand is one of the best countries for English study, known for its stunning natural environment and friendly people.

### Student Visa

**Type:** Student Visa
**Fee:** NZD330
**Processing:** 2–6 weeks

### Work Rules

Students at NZQA-approved schools enrolled in full-time courses of 14 weeks or more can work up to 25 hours per week during term (increased from 20 hours as of November 3, 2025). Full-time work is permitted during holidays. An IRD number (tax number) is required. Self-employment is not permitted.

Use the MoveWorth.study simulator to estimate your total costs for studying in New Zealand.`,
    },
  },

  // AE - UAE（ドバイ）
  {
    slug: "study-work-ae",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【UAE（ドバイ）】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in the UAE (Dubai) 2026 — Complete Guide",
    },
    description: {
      ja: "UAE（ドバイ）での留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in the UAE (Dubai).",
    },
    content: {
      ja: `UAE（ドバイ）は急速に発展する中東の国際都市で、英語やアラビア語を学びながらグローバルなビジネス環境を体験できます。

### 学生ビザの概要

**ビザ種別：** Student Residence Visa
**申請費用：** 約AED2,500〜6,500（短期プログラムは低め、長期・大学は高め）
**処理期間：** 2〜4週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 健康診断書（エミレーツID取得のため）

### アルバイト・就労ルール

UAEでは学生の就労は非常に制限されています。

**学期中：** 週20時間まで（一部大学のインターンのみ）
**休暇中：** 同上
**条件：** 一般のアルバイトは原則不可。大学が提供するインターンシップや研修プログラムのみ認められる場合があります。

### 注意事項

1. 一般的なアルバイトは学生ビザでは認められません
2. 無許可就労はビザ取消・強制帰国・罰金の対象です
3. UAEの物価は高いため、十分な資金を事前に準備する必要があります

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約AED3,000〜6,000 |
| 生活費（月額） | 約AED4,000〜8,000 |
| 住居費（月額） | 約AED2,000〜5,000 |
| 学生ビザ申請費 | AED2,500〜6,500（プログラム期間・機関による） |

MoveWorth.studyのシミュレーターでUAE（ドバイ）留学の総費用を計算してみましょう。`,
      en: `The UAE (Dubai) is a rapidly developing international city in the Middle East where students can learn English or Arabic while experiencing a global business environment.

### Student Visa

**Type:** Student Residence Visa
**Fee:** AED2,500–6,500 (varies by program length and institution)
**Processing:** 2–4 weeks

### Work Rules

Student work is very limited in the UAE. General part-time jobs are not permitted on student visas. Only university-provided internships or training programs may be allowed, typically up to 20 hours per week. Students should prepare sufficient funds in advance.

Use the MoveWorth.study simulator to estimate your total costs for studying in the UAE.`,
    },
  },

  // US - アメリカ
  {
    slug: "study-work-us",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【アメリカ】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in the United States 2026 — Complete Guide",
    },
    description: {
      ja: "アメリカでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in the United States.",
    },
    content: {
      ja: `アメリカは世界最大の留学生受入国であり、多様な大学・語学学校から選べる豊富な選択肢が魅力です。

### 学生ビザの概要

**ビザ種別：** F-1（学生）/ M-1（職業訓練）
**申請費用：** 約USD160（SEVIS手数料USD350別途）
**処理期間：** 2〜8週間
**主な要件：**
- 入学許可証（I-20フォーム）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- SEVIS（留学生管理システム）への登録

### アルバイト・就労ルール

アメリカではF-1ビザ所持者の就労はキャンパス内に限定されています。

**学期中：** キャンパス内のみ週20時間まで
**休暇中：** キャンパス内のみ週40時間まで
**条件：** キャンパス外就労は原則不可。CPT（Curricular Practical Training）やOPT（Optional Practical Training）等の特別許可が必要。

### 注意事項

1. キャンパス外での無許可就労はビザ取消・強制帰国の対象です
2. CPT/OPTは事前に学校のDSO（Designated School Official）に相談が必要です
3. Social Security Number（SSN）の取得が就労に必要です

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約USD1,500〜3,500 |
| 生活費（月額） | 約USD1,500〜3,000 |
| 住居費（月額） | 約USD800〜2,000 |
| 学生ビザ申請費 | USD160（SEVIS別途USD350） |

MoveWorth.studyのシミュレーターでアメリカ留学の総費用を計算してみましょう。`,
      en: `The United States is the world's largest host country for international students, offering a vast range of universities and language schools.

### Student Visa

**Type:** F-1 (Student) / M-1 (Vocational)
**Fee:** USD160 (plus SEVIS fee of USD350)
**Processing:** 2–8 weeks

### Work Rules

F-1 visa holders may only work on campus — up to 20 hours per week during term and 40 hours during holidays. Off-campus employment is generally prohibited unless authorized through CPT (Curricular Practical Training) or OPT (Optional Practical Training). A Social Security Number is required for employment.

Use the MoveWorth.study simulator to estimate your total costs for studying in the United States.`,
    },
  },

  // CA - カナダ
  {
    slug: "study-work-ca",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【カナダ】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Canada 2026 — Complete Guide",
    },
    description: {
      ja: "カナダでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Canada.",
    },
    content: {
      ja: `カナダは多文化共生の環境と高い教育水準で知られる人気の留学先です。英語とフランス語の両方を学べる点も魅力です。

### 学生ビザの概要

**ビザ種別：** Study Permit
**申請費用：** 約CAD150
**処理期間：** 4〜16週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- DLI（指定教育機関）からの入学許可

### アルバイト・就労ルール

カナダではDLI在籍者に幅広い就労が認められています。

**学期中：** 週24時間まで（キャンパス外）※2024年11月以降、週20時間から引き上げ
**休暇中：** 制限なし（キャンパス外）
**条件：** DLI（Designated Learning Institution）在籍が必須。キャンパス内就労は時間制限なし。SIN（Social Insurance Number）の取得が必要。

### 注意事項

1. 語学学校のみの在籍ではキャンパス外就労が認められない場合があります
2. Study Permitに就労条件が記載されているか確認しましょう
3. Co-opプログラムでは就労がカリキュラムの一部として認められます

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約CAD1,800〜3,500 |
| 生活費（月額） | 約CAD1,500〜2,500 |
| 住居費（月額） | 約CAD800〜2,000 |
| 学生ビザ申請費 | CAD150 |

MoveWorth.studyのシミュレーターでカナダ留学の総費用を計算してみましょう。`,
      en: `Canada is a popular study destination known for its multicultural environment and high education standards. Students can learn both English and French.

### Student Visa

**Type:** Study Permit
**Fee:** CAD150
**Processing:** 4–16 weeks

### Work Rules

Students at Designated Learning Institutions (DLIs) can work up to 24 hours per week off-campus during term time (increased from 20 hours as of November 2024), with no hour limit during scheduled breaks. On-campus work has no hour limit. A Social Insurance Number (SIN) is required. Language school-only students may not qualify for off-campus work.

Use the MoveWorth.study simulator to estimate your total costs for studying in Canada.`,
    },
  },

  // GB - イギリス
  {
    slug: "study-work-gb",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【イギリス】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in the United Kingdom 2026 — Complete Guide",
    },
    description: {
      ja: "イギリスでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in the United Kingdom.",
    },
    content: {
      ja: `イギリスは英語発祥の地として、世界トップクラスの大学と歴史ある教育環境を提供する留学先です。

### 学生ビザの概要

**ビザ種別：** Student Visa（旧Tier 4）
**申請費用：** 約£524（IHS別途£776〜/年）
**処理期間：** 3〜8週間
**主な要件：**
- 入学許可証（CAS: Confirmation of Acceptance for Studies）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明（IHS加入で NHS利用可）
- 英語力証明（IELTS等）

### アルバイト・就労ルール

イギリスではポイント制ビザ対象校の学生に就労が認められています。

**学期中：** 週20時間まで
**休暇中：** 週40時間まで
**条件：** ポイント制ビザ対象校（Tier 4 Sponsor）在籍が必要。短期語学留学ビザ（Short-term Study Visa）では就労不可。

### 注意事項

1. Short-term Study Visa（6ヶ月/11ヶ月）では一切の就労が認められません
2. Immigration Health Surcharge（IHS）の支払いが必要です
3. 自営業やフリーランスとしての就労は禁止されています

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約£800〜2,000 |
| 生活費（月額） | 約£1,200〜2,000 |
| 住居費（月額） | 約£700〜1,500 |
| 学生ビザ申請費 | £524（IHS別途£776〜/年） |

MoveWorth.studyのシミュレーターでイギリス留学の総費用を計算してみましょう。`,
      en: `The United Kingdom is the birthplace of the English language and home to world-class universities with a rich educational heritage.

### Student Visa

**Type:** Student Visa (formerly Tier 4)
**Fee:** £524 (plus IHS £776+/year)
**Processing:** 3–8 weeks

### Work Rules

Students at Tier 4 sponsor institutions can work up to 20 hours per week during term and 40 hours during holidays. Short-term Study Visa holders cannot work at all. Self-employment and freelance work are prohibited.

Use the MoveWorth.study simulator to estimate your total costs for studying in the United Kingdom.`,
    },
  },

  // DE - ドイツ
  {
    slug: "study-work-de",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【ドイツ】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Germany 2026 — Complete Guide",
    },
    description: {
      ja: "ドイツでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Germany.",
    },
    content: {
      ja: `ドイツは多くの公立大学で学費が無料または低額であり、コストパフォーマンスに優れた留学先として人気です。

### 学生ビザの概要

**ビザ種別：** Studienvisum（学生ビザ）
**申請費用：** 約€75
**処理期間：** 1〜3ヶ月
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（閉鎖口座に約€11,904以上・2025年時点）
- 海外旅行保険への加入証明
- 語学力証明（ドイツ語または英語）

### アルバイト・就労ルール

ドイツでは年間ベースで就労時間が管理されるユニークな制度です。

**学期中：** 年120日（フルタイム）または年240日（半日）
**休暇中：** 上記の年間制限に含まれる
**条件：** 学期中・休暇中の区別なく年間の総日数で管理。語学準備コースの学生は外国人局の許可が必要。

### 注意事項

1. 年120日/240日の制限を超える場合は外国人局（Ausländerbehörde）の許可が必要です
2. 語学学校のみの在籍者は就労が制限される場合があります
3. ミニジョブ（月€520以下）も就労日数に含まれます

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約€400〜1,200 |
| 生活費（月額） | 約€700〜1,200 |
| 住居費（月額） | 約€350〜800 |
| 学生ビザ申請費 | €75 |

MoveWorth.studyのシミュレーターでドイツ留学の総費用を計算してみましょう。`,
      en: `Germany offers excellent value for international students, with many public universities charging no or low tuition fees.

### Student Visa

**Type:** Studienvisum
**Fee:** €75
**Processing:** 1–3 months

### Work Rules

Germany uses a unique annual system: students can work 120 full days or 240 half days per year, with no distinction between term time and holidays. Language course students may need additional permission from the Foreigners' Office (Ausländerbehörde). Mini-jobs (under €520/month) also count toward the annual limit.

Use the MoveWorth.study simulator to estimate your total costs for studying in Germany.`,
    },
  },

  // FR - フランス
  {
    slug: "study-work-fr",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【フランス】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in France 2026 — Complete Guide",
    },
    description: {
      ja: "フランスでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in France.",
    },
    content: {
      ja: `フランスは芸術・文化・料理の国として、フランス語を学びながら豊かな文化体験ができる留学先です。

### 学生ビザの概要

**ビザ種別：** Visa Étudiant（VLS-TS）
**申請費用：** 約€220（2025年以降。奨学金（エッフェル賞等）受給者は免除の場合あり。VLS-TSの現地検証手数料€50が別途必要）
**処理期間：** 2〜6週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- Campus France（フランス留学機関）への事前登録

### アルバイト・就労ルール

フランスでは学生ビザに就労権が含まれており、別途の就労許可は不要です。

**学期中：** 年964時間以内（週約18〜19時間相当）
**休暇中：** 上記の年間制限に含まれる
**条件：** 学生ビザ（VLS-TS）所持者は自動的に就労が認められる。年間の総時間で管理。

### 注意事項

1. 年964時間の制限は暦年（1月〜12月）で計算されます
2. フルタイムで集中的に働くと年間上限にすぐ達する可能性があります
3. OFII（フランス移民局）への届出を忘れないようにしましょう

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約€600〜1,500 |
| 生活費（月額） | 約€800〜1,500 |
| 住居費（月額） | 約€400〜900 |
| 学生ビザ申請費 | €220（現地検証費€50別途） |

MoveWorth.studyのシミュレーターでフランス留学の総費用を計算してみましょう。`,
      en: `France offers a rich cultural experience with the opportunity to learn French while immersing yourself in the world of art, cuisine, and history.

### Student Visa

**Type:** Visa Étudiant (VLS-TS)
**Fee:** €220 (as of 2025; scholarship recipients may be exempt). A €50 online validation fee is payable in France upon arrival.
**Processing:** 2–6 weeks

### Work Rules

The French student visa includes work authorization — no separate permit is needed. Students can work up to 964 hours per calendar year (approximately 18–19 hours per week). The limit is tracked annually, so working full-time during holidays will consume the allowance faster.

Use the MoveWorth.study simulator to estimate your total costs for studying in France.`,
    },
  },

  // TW - 台湾
  {
    slug: "study-work-tw",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【台湾】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Taiwan 2026 — Complete Guide",
    },
    description: {
      ja: "台湾での留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Taiwan.",
    },
    content: {
      ja: `台湾は親日的な文化と手頃な生活費で、日本人留学生に人気の留学先です。中国語を学ぶための語学センターも充実しています。

### 学生ビザの概要

**ビザ種別：** 学生ビザ（居留証）
**申請費用：** 約TWD1,000〜2,000
**処理期間：** 1〜4週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 健康診断書

### アルバイト・就労ルール

台湾では学士課程以上に在籍する学生がアルバイト可能です。

**学期中：** 週20時間まで
**休暇中：** 週40時間まで（夏休み・冬休み）
**条件：** 学士課程以上の在籍が対象。語学センターのみの在籍者は原則就労不可。Workforce Development Agency（WDA）への就労許可申請が必要。

### 注意事項

1. 語学センターのみの在籍者はアルバイトが認められない場合があります
2. 就労許可の申請には在学証明書と雇用主からの雇用証明が必要です
3. 夜間（22時〜6時）の就労は制限される場合があります

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約TWD15,000〜30,000 |
| 生活費（月額） | 約TWD15,000〜25,000 |
| 住居費（月額） | 約TWD5,000〜15,000 |
| 学生ビザ申請費 | TWD1,000〜2,000 |

MoveWorth.studyのシミュレーターで台湾留学の総費用を計算してみましょう。`,
      en: `Taiwan is a popular study destination for Japanese students, offering a friendly culture and affordable living costs. Language centers for learning Chinese are widely available.

### Student Visa

**Type:** Student Visa (Residence Permit)
**Fee:** TWD1,000–2,000
**Processing:** 1–4 weeks

### Work Rules

Students enrolled in bachelor's degree programs or higher can work up to 20 hours per week during term time and 40 hours per week during summer and winter holidays. Language center-only students are generally not eligible. A work permit application to the Ministry of Labor is required.

Use the MoveWorth.study simulator to estimate your total costs for studying in Taiwan.`,
    },
  },

  // HK - 香港
  {
    slug: "study-work-hk",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【香港】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Hong Kong 2026 — Complete Guide",
    },
    description: {
      ja: "香港での留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Hong Kong.",
    },
    content: {
      ja: `香港は国際的なビジネス環境と東西文化が融合する都市で、英語・広東語・普通話を同時に学べるユニークな留学先です。

### 学生ビザの概要

**ビザ種別：** Student Visa
**申請費用：** 約HKD330（2025年9月改定。大学機関経由の場合は別途事務手数料あり）
**処理期間：** 6〜12週間（ピーク期はさらに延びる場合あり）
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- スポンサー：学校・大学機関経由の申請では機関がスポンサーとなるため個人の保証人は不要な場合が多い。個人申請の場合は香港在住スポンサーが必要。

### アルバイト・就労ルール

香港では認定校に在籍する学生がアルバイト可能です。

**学期中：** 大学フルタイム学生（非居住者）は2024年11月1日以降、時間制限が暫定撤廃。語学学校等の短期留学生は要個別確認。
**夏季休暇中（6〜8月）：** 時間制限なし・場所制限なし
**条件：** 認定校在籍者のみ。入境事務処（Immigration Department）への申請が必要。

### 注意事項

1. 認定校以外の学校在籍者はアルバイトが認められません
2. 学期中の時間制限撤廃は暫定措置であり、今後変更される可能性があります
3. インターンシップは学校の推薦がある場合に限り認められることがあります

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約HKD7,500〜15,000 |
| 生活費（月額） | 約HKD10,000〜17,000 |
| 住居費（月額） | 約HKD5,000〜15,000（寮の場合HKD5,000〜、一般賃貸の場合HKD8,000〜） |
| 学生ビザ申請費 | HKD330（2025年9月改定） |

MoveWorth.studyのシミュレーターで香港留学の総費用を計算してみましょう。`,
      en: `Hong Kong offers a unique study experience where Eastern and Western cultures merge, with opportunities to learn English, Cantonese, and Mandarin simultaneously in an international business environment.

### Student Visa

**Type:** Student Visa
**Fee:** HKD330 (revised September 2025; additional handling fee may apply if applying through a university)
**Processing:** 6–12 weeks (may be longer during peak periods)

### Work Rules

**During term:** Full-time non-resident students at universities have had their part-time work hour limits provisionally lifted since November 1, 2024. Language school students and short-term exchange students should check individually.
**Summer holidays (June–August):** No hour or location restrictions.
An application to the Immigration Department is required. Students at non-approved schools are not eligible for part-time work.

### Estimated Costs

| Item | Cost |
|------|------|
| Language school (monthly) | approx. HKD7,500–15,000 |
| Living expenses (monthly) | approx. HKD10,000–17,000 |
| Accommodation (monthly) | approx. HKD5,000–15,000 (dormitory from HKD5,000; private rental from HKD8,000) |
| Student visa fee | HKD330 (revised September 2025) |

Use the MoveWorth.study simulator to estimate your total costs for studying in Hong Kong.`,
    },
  },

  // ID - インドネシア
  {
    slug: "study-work-id",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【インドネシア】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Indonesia 2026 — Complete Guide",
    },
    description: {
      ja: "インドネシアでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Indonesia.",
    },
    content: {
      ja: `インドネシアは世界第4位の人口を誇る東南アジアの大国で、バリ島をはじめとする豊かな自然環境のなかでインドネシア語や英語を学べます。

### 学生ビザの概要

**ビザ種別：** Social/Cultural Visa（B211）または Student KITAS
**申請費用：** 約USD50
**処理期間：** 2〜4週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- スポンサーレター（受入機関からの保証書）

### アルバイト・就労ルール

インドネシアでは学生ビザ所持者の就労は原則禁止されています。

**学期中：** 就労不可
**休暇中：** 就労不可
**条件：** 就労するには別途KITAS（就労許可付き一時滞在許可）の取得が必要です。

### 注意事項

1. 無許可就労が発覚した場合、罰金・強制帰国・入国禁止の処分を受けます
2. ボランティア活動も就労とみなされる場合があります
3. 生活費は事前に十分な資金を準備しましょう

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約IDR3,000,000〜8,000,000 |
| 生活費（月額） | 約IDR4,000,000〜8,000,000 |
| 住居費（月額） | 約IDR1,500,000〜7,000,000 |
| 学生ビザ申請費 | 約USD50 |

MoveWorth.studyのシミュレーターでインドネシア留学の総費用を計算してみましょう。`,
      en: `Indonesia is Southeast Asia's largest country by population, offering opportunities to learn Indonesian and English in a rich natural environment including Bali.

### Student Visa

**Type:** Social/Cultural Visa (B211) or Student KITAS
**Fee:** Approx. USD50
**Processing:** 2–4 weeks

### Work Rules

Part-time work is generally prohibited for students in Indonesia. A separate KITAS (temporary stay permit with work authorization) is required for any employment. Students should prepare sufficient funds before arrival.

Use the MoveWorth.study simulator to estimate your total costs for studying in Indonesia.`,
    },
  },

  // PH - フィリピン
  {
    slug: "study-work-ph",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【フィリピン】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in the Philippines 2026 — Complete Guide",
    },
    description: {
      ja: "フィリピンでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in the Philippines.",
    },
    content: {
      ja: `フィリピンは格安の英語留学先として日本人に非常に人気があります。マンツーマンレッスンが中心の語学学校が多く、短期間で英語力を伸ばせます。

### 学生ビザの概要

**ビザ種別：** Special Study Permit（SSP）またはStudent Visa
**申請費用：** 約PHP6,000〜12,500（SSP初回発行費。学校が代理申請する場合は学校手数料別途）
**処理期間：** 1〜3週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- SSPは語学学校が代理申請するケースが多い

### アルバイト・就労ルール

フィリピンでは学生ビザ（SSP・9(f)ビザ）の所持者はそのままでは就労できませんが、移民局（Bureau of Immigration）への別途申請により**Special Work Permit（SWP）**を取得することで就労が可能になります。

**学期中：** 原則就労不可（SWP取得者を除く）
**休暇中：** 原則就労不可（SWP取得者を除く）
**条件：** SWPは最長6ヶ月有効（更新可能）。オンキャンパスの仕事、家庭教師、リサーチアシスタントなどのポジションに対して発行されるケースが多い。

### 注意事項

1. SSPのみ保持の場合、就労は一切認められません
2. SWPは移民局への別途申請が必要で、2025年8月以降は申請要件が一部緩和されています
3. 無許可就労は強制帰国・罰金の対象です
4. 語学学校の寮・食事付きプランを選べば生活費を抑えられます

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約PHP20,000〜50,000 |
| 生活費（月額） | 約PHP15,000〜30,000 |
| 住居費（月額） | 約PHP5,000〜15,000 |
| 学生ビザ申請費 | PHP6,000〜12,500（SSP初回発行費） |

MoveWorth.studyのシミュレーターでフィリピン留学の総費用を計算してみましょう。`,
      en: `The Philippines is extremely popular among Japanese students as an affordable English study destination, with many schools offering one-on-one lessons for rapid language improvement.

### Student Visa

**Type:** Special Study Permit (SSP) or Student Visa
**Fee:** PHP6,000–12,500 (initial SSP issuance fee; additional school processing fees may apply)
**Processing:** 1–3 weeks

### Work Rules

Students on an SSP or 9(f) student visa cannot work without additional authorization. However, a Special Work Permit (SWP) can be obtained separately from the Bureau of Immigration, allowing part-time work for up to 6 months (renewable). SWPs are commonly approved for on-campus jobs, tutoring, and research assistantships. Requirements for SWP issuance were eased under new DOLE/BI guidelines effective August 2025. Unauthorized work can result in deportation and fines.

Use the MoveWorth.study simulator to estimate your total costs for studying in the Philippines.`,
    },
  },

  // VN - ベトナム
  {
    slug: "study-work-vn",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【ベトナム】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in Vietnam 2026 — Complete Guide",
    },
    description: {
      ja: "ベトナムでの留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in Vietnam.",
    },
    content: {
      ja: `ベトナムは急速な経済発展を遂げる東南アジアの注目国で、ベトナム語や英語を低コストで学べる留学先として人気が高まっています。

### 学生ビザの概要

**ビザ種別：** DH Visa（学生）
**申請費用：** 約USD25〜135（滞在期間・ビザ種別により異なる）
**処理期間：** 5〜10営業日
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 受入教育機関からの招聘状

### アルバイト・就労ルール

ベトナムでは学生ビザ所持者の就労は原則禁止されています。

**学期中：** 就労不可
**休暇中：** 就労不可
**条件：** 就労するには別途労働許可証の取得が必要ですが、学生ビザでの取得は困難です。

### 注意事項

1. 無許可就労が発覚した場合、罰金・ビザ取消・強制帰国の処分を受けます
2. 語学ボランティアなどが就労とみなされる場合があります
3. ベトナムの物価は安いため、十分な資金を事前に準備すれば就労なしでも生活可能です

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約VND2,000,000〜8,000,000 |
| 生活費（月額） | 約VND6,000,000〜12,000,000 |
| 住居費（月額） | 約VND3,000,000〜8,000,000 |
| 学生ビザ申請費 | USD25〜135 |

MoveWorth.studyのシミュレーターでベトナム留学の総費用を計算してみましょう。`,
      en: `Vietnam is a rapidly developing Southeast Asian country gaining popularity as an affordable study destination for learning Vietnamese and English.

### Student Visa

**Type:** DH Visa (Student)
**Fee:** USD25–135 (varies by duration and visa type)
**Processing:** 5–10 business days

### Work Rules

Part-time work is generally prohibited for students in Vietnam. A separate work permit is required for employment, which is difficult to obtain on a student visa. Vietnam's low cost of living means students can manage without working if they prepare sufficient funds.

Use the MoveWorth.study simulator to estimate your total costs for studying in Vietnam.`,
    },
  },

  // KR - 韓国
  {
    slug: "study-work-kr",
    category: "country",
    date: "2026-03-16",
    readingTime: 5,
    title: {
      ja: "【韓国】留学中のアルバイト・就労ルール完全ガイド",
      en: "Study & Work Rules in South Korea 2026 — Complete Guide",
    },
    description: {
      ja: "韓国での留学中アルバイト・就労ルールを徹底解説。学生ビザの取得方法・週の就労可能時間・注意点まで留学前に確認すべき情報をまとめました。",
      en: "A complete guide to student visa requirements and part-time work rules in South Korea.",
    },
    content: {
      ja: `韓国はK-POPや韓国文化の人気とともに、留学先としても注目を集めています。大学や語学堂で韓国語を学ぶ留学生が増加しています。

### 学生ビザの概要

**ビザ種別：** D-2（大学）/ D-4（語学）ビザ
**申請費用：** 約USD60〜90（国籍・在外公館により異なる）
**処理期間：** 2〜4週間
**主な要件：**
- 入学許可証（学校からのオファーレター）
- 残高証明書（一定額以上の資金証明）
- 海外旅行保険への加入証明
- 学業計画書

### アルバイト・就労ルール

韓国ではビザの種類によって就労ルールが異なります。

**D-2ビザ（学期中）：** 週20時間まで（学部生・大学院生共通）
**D-2ビザ（休暇中）：** フルタイム可能
**D-4ビザ（語学研修）：** 滞在6ヶ月後から週20時間まで就労可能
**条件：** 出入国管理事務所でS-3（就労許可）の申請が必要。D-2ビザは一定のGPAと出席率の維持が必要。

### 注意事項

1. D-4ビザ（語学堂）の学生は滞在6ヶ月後から週20時間まで就労可能です（当初は禁止）
2. D-2ビザでも一定のGPA（成績）を維持しないと就労許可が取り消されます
3. 就労許可（S-3）の申請には在学証明書と成績証明書が必要です

### 費用の目安

| 項目 | 費用 |
|------|------|
| 語学学校（月額） | 約KRW700,000〜1,500,000 |
| 生活費（月額） | 約KRW600,000〜1,200,000 |
| 住居費（月額） | 約KRW300,000〜700,000 |
| 学生ビザ申請費 | USD60〜90（国籍・在外公館により異なる） |

MoveWorth.studyのシミュレーターで韓国留学の総費用を計算してみましょう。`,
      en: `South Korea has become an increasingly popular study destination alongside the global rise of K-pop and Korean culture. More students are enrolling in universities and language institutes to learn Korean.

### Student Visa

**Type:** D-2 (University) / D-4 (Language)
**Fee:** USD60–90 (varies by nationality and consulate)
**Processing:** 2–4 weeks

### Work Rules

Work rules depend on visa type. D-2 visa holders can work up to 20 hours per week during term time (applies to both undergraduate and graduate students; Monday–Friday only) with no restriction during holidays. D-4 visa (language school) holders are initially prohibited from working but may apply for permission after 6 months of stay, up to 20 hours per week. A work permit application at the immigration office is required, and maintaining a minimum GPA is mandatory.

Use the MoveWorth.study simulator to estimate your total costs for studying in South Korea.`,
    },
  },
];

export function getStudyBlogPost(slug: string): StudyBlogPost | undefined {
  return studyBlogPosts.find((p) => p.slug === slug);
}

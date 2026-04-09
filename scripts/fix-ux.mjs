import { readFileSync, writeFileSync } from "fs";

const filePath = "c:/Users/chiji/OneDrive/VScode用/docs/moveworth/src/data/blog-posts.ts";
let content = readFileSync(filePath, "utf8");

function replace(search, replacement, label) {
  if (!content.includes(search)) {
    console.warn(`NOT FOUND: ${label}`);
    return;
  }
  content = content.replace(search, replacement);
  console.log(`✅ ${label}`);
}

// ============================================================
// visa-us: ビザ選択ガイド追加 + 各ビザに公式リンク埋め込み
// ============================================================
replace(
  `アメリカは世界最大の経済大国であり、IT・金融・医療・アカデミアなど多くの分野でトップクラスのキャリア機会があります。ただし、就労ビザの取得競争は激しく、移民プロセスも複雑です。

### 主な就労ビザの種類`,
  `アメリカは世界最大の経済大国であり、IT・金融・医療・アカデミアなど多くの分野でトップクラスのキャリア機会があります。ただし、就労ビザの取得競争は激しく、移民プロセスも複雑です。

### あなたに合ったビザは？

| あなたの状況 | おすすめのビザ |
|------------|-------------|
| アメリカ企業に専門職として就労（抽選あり） | H-1B（専門職ビザ） |
| 日系企業からの転勤（抽選なし） | L-1（企業内転勤ビザ） |
| 科学・芸術・スポーツで国際的な実績あり | O-1（卓越能力ビザ） |
| アメリカでビジネス投資・起業 | E-2（条約投資家ビザ） |
| 研究者・医師・国益になる分野の専門家 | EB-2 NIW（雇用主不要で永住権申請可） |
| 大規模投資で永住権を取得したい | EB-5（投資家グリーンカード） |

### 主な就労ビザの種類`,
  "visa-us: ビザ選択ガイド追加"
);

replace(
  `**H-1B（専門職ビザ）**
最も一般的なアメリカの就労ビザ。学士以上の学位を必要とする専門職向け。`,
  `**H-1B（専門職ビザ）** ｜ [USCIS 公式ページ](https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations)
最も一般的なアメリカの就労ビザ。学士以上の学位を必要とする専門職向け。`,
  "visa-us: H-1Bにリンク追加"
);

replace(
  `**L-1（企業内転勤ビザ）**
日本など海外の関連会社からアメリカへ転勤する管理職・専門職向け。抽選なし。`,
  `**L-1（企業内転勤ビザ）** ｜ [USCIS 公式ページ](https://www.uscis.gov/working-in-the-united-states/temporary-workers/l-1a-intracompany-transferee-executive-or-manager)
日本など海外の関連会社からアメリカへ転勤する管理職・専門職向け。抽選なし。`,
  "visa-us: L-1にリンク追加"
);

replace(
  `**O-1（卓越した能力を持つ外国人）**
科学・芸術・教育・ビジネス・スポーツの分野で国際的に認められた実績を持つ人向け。抽選なし。`,
  `**O-1（卓越した能力を持つ外国人）** ｜ [USCIS 公式ページ](https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement)
科学・芸術・教育・ビジネス・スポーツの分野で国際的に認められた実績を持つ人向け。抽選なし。`,
  "visa-us: O-1にリンク追加"
);

replace(
  `**E-2（条約投資家ビザ）**
日本とアメリカ間の投資条約に基づくビザ。アメリカのビジネスに相当額を投資する起業家・経営者向け。永住権ではないが更新可能。`,
  `**E-2（条約投資家ビザ）** ｜ [USCIS 公式ページ](https://www.uscis.gov/working-in-the-united-states/temporary-workers/e-2-treaty-investors)
日本とアメリカ間の投資条約に基づくビザ。アメリカのビジネスに相当額を投資する起業家・経営者向け。永住権ではないが更新可能。`,
  "visa-us: E-2にリンク追加"
);

replace(
  `**EB-5（投資家グリーンカード）**
アメリカへの投資により永住権を取得するプログラム。`,
  `**EB-5（投資家グリーンカード）** ｜ [USCIS 公式ページ](https://www.uscis.gov/working-in-the-united-states/permanent-workers/eb-5-immigrant-investor-program)
アメリカへの投資により永住権を取得するプログラム。`,
  "visa-us: EB-5にリンク追加"
);

replace(
  `**EB-1/EB-2/EB-3（就労グリーンカード）**
永住権（グリーンカード）の就労カテゴリ。`,
  `**EB-1/EB-2/EB-3（就労グリーンカード）** ｜ [USCIS – 就労グリーンカード](https://www.uscis.gov/green-card/green-card-eligibility/green-card-through-a-job)
永住権（グリーンカード）の就労カテゴリ。`,
  "visa-us: EB-1/2/3にリンク追加"
);

// ============================================================
// visa-ca: ビザ選択ガイド追加 + 各ルートに公式リンク埋め込み
// ============================================================
replace(
  `カナダは積極的な移民受け入れ政策を持つ国で、永住権（PR）取得のしやすさと高い生活水準から世界中から移民が集まっています。ただし2024〜2025年にかけて移民受け入れ数削減方針が打ち出されており、CRSスコアの動向を常にチェックすることが重要です。

### 主な移住ルート`,
  `カナダは積極的な移民受け入れ政策を持つ国で、永住権（PR）取得のしやすさと高い生活水準から世界中から移民が集まっています。ただし2024〜2025年にかけて移民受け入れ数削減方針が打ち出されており、CRSスコアの動向を常にチェックすることが重要です。

### あなたに合ったルートは？

| あなたの状況 | おすすめのルート |
|------------|--------------|
| 海外から直接PR申請（英語力・職歴あり） | Express Entry（FSWプログラム） |
| カナダで1年以上就労経験あり | Express Entry（CECプログラム） |
| 特定の州に定住・就労したい | 州推薦プログラム（PNP） |
| スタートアップ・起業家 | スタートアップビザ |
| 18〜35歳・まずカナダを体験したい | ワーキングホリデー（IEC） |
| カナダ企業から雇用オファーあり | 就労許可（Work Permit） |

### 主な移住ルート`,
  "visa-ca: ビザ選択ガイド追加"
);

replace(
  `**エクスプレスエントリー（Express Entry）**
熟練外国人労働者向けの連邦管轄の移民プログラム。3つのプログラムが対象。`,
  `**エクスプレスエントリー（Express Entry）** ｜ [IRCC 公式ページ](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html)
熟練外国人労働者向けの連邦管轄の移民プログラム。3つのプログラムが対象。`,
  "visa-ca: Express Entryにリンク追加"
);

replace(
  `**州推薦プログラム（PNP：Provincial Nominee Program）**
各州・準州が独自の基準で移民を推薦する制度。`,
  `**州推薦プログラム（PNP：Provincial Nominee Program）** ｜ [IRCC – PNP 公式ページ](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html)
各州・準州が独自の基準で移民を推薦する制度。`,
  "visa-ca: PNPにリンク追加"
);

replace(
  `**スタートアップビザ（Start-Up Visa）**
カナダの認定インキュベーター・VC・エンジェル投資家の支援を受けた起業家向けの永住権ルート。`,
  `**スタートアップビザ（Start-Up Visa）** ｜ [IRCC 公式ページ](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html)
カナダの認定インキュベーター・VC・エンジェル投資家の支援を受けた起業家向けの永住権ルート。`,
  "visa-ca: SUVにリンク追加"
);

replace(
  `**ワーキングホリデー（IEC / International Experience Canada）**
日本人向けのカナダ滞在・就労制度。`,
  `**ワーキングホリデー（IEC / International Experience Canada）** ｜ [IRCC 公式ページ](https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec.html)
日本人向けのカナダ滞在・就労制度。`,
  "visa-ca: IECにリンク追加"
);

replace(
  `**就労許可（Work Permit）**
カナダ企業に雇用される場合に取得。`,
  `**就労許可（Work Permit）** ｜ [IRCC 公式ページ](https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit/temporary/eligibility.html)
カナダ企業に雇用される場合に取得。`,
  "visa-ca: Work Permitにリンク追加"
);

// ============================================================
// visa-fi: ビザ選択ガイド追加 + 各ビザに公式リンク埋め込み
// ============================================================
replace(
  `フィンランドは世界最高水準の教育・医療・社会福祉を誇る北欧の国です。世界幸福度報告で数年連続世界1位を記録し、ヘルシンキは生活の質が高い都市として国際的な評価を得ています。近年はスタートアップ拠点としても成長著しく、Slushカンファレンスに代表されるエコシステムが外国人起業家・テック人材を惹きつけています。

### 日本人の短期滞在（観光・ビジネス）`,
  `フィンランドは世界最高水準の教育・医療・社会福祉を誇る北欧の国です。世界幸福度報告で数年連続世界1位を記録し、ヘルシンキは生活の質が高い都市として国際的な評価を得ています。近年はスタートアップ拠点としても成長著しく、Slushカンファレンスに代表されるエコシステムが外国人起業家・テック人材を惹きつけています。

### あなたに合ったビザは？

| あなたの状況 | おすすめのビザ |
|------------|-------------|
| フィンランド企業から雇用オファーあり | 就労者居住許可（TTOL） |
| 月収€3,937以上の高度人材 | EUブルーカード |
| Business Finland認定スタートアップ創業 | スタートアップ許可 |
| フリーランサー・独立起業家 | 自営業者居住許可 |
| 観光・短期滞在（90日以内） | シェンゲンビザなし入国 |

### 日本人の短期滞在（観光・ビジネス）`,
  "visa-fi: ビザ選択ガイド追加"
);

replace(
  `**就労者居住許可（Employed Person's Residence Permit）**
フィンランド企業から雇用オファーを受けた非EU国籍者向けの最もポピュラーなルート。`,
  `**就労者居住許可（Employed Person's Residence Permit）** ｜ [Migri 公式ページ](https://migri.fi/en/residence-permit-for-an-employed-person)
フィンランド企業から雇用オファーを受けた非EU国籍者向けの最もポピュラーなルート。`,
  "visa-fi: 就労者許可にリンク追加"
);

replace(
  `**スタートアップ許可（Startup-lupa）**
Business Finlandが成長ポテンシャルを認定したスタートアップ創業者向け。`,
  `**スタートアップ許可（Startup-lupa）** ｜ [Business Finland 公式ページ](https://www.businessfinland.fi/en/do-business-with-finland/startup-in-finland/startup-permit)
Business Finlandが成長ポテンシャルを認定したスタートアップ創業者向け。`,
  "visa-fi: スタートアップ許可にリンク追加"
);

replace(
  `**EUブルーカード（EU Blue Card）**
高度人材向けの優遇就労許可。
- 最低月収：**€3,937以上**`,
  `**EUブルーカード（EU Blue Card）** ｜ [Migri 公式ページ](https://migri.fi/en/eu-blue-card)
高度人材向けの優遇就労許可。
- 最低月収：**€3,937以上**`,
  "visa-fi: EUブルーカードにリンク追加"
);

replace(
  `**自営業者居住許可（Self-Employment Residence Permit）**
フリーランサー・独立起業家向け。`,
  `**自営業者居住許可（Self-Employment Residence Permit）** ｜ [Migri 公式ページ](https://migri.fi/en/self-employed-person-s-residence-permit)
フリーランサー・独立起業家向け。`,
  "visa-fi: 自営業者許可にリンク追加"
);

// ============================================================
// visa-kr: ビザ選択ガイド追加 + 各ビザに公式リンク埋め込み
// ============================================================
replace(
  `韓国は日本から近く、文化的な親近感もあることから、アジア圏での移住先として注目されています。IT・半導体・エンタメ・製造業など多様な就労機会があり、ソウル・釜山・済州島を拠点に外国人が増えています。

### 主なビザの種類`,
  `韓国は日本から近く、文化的な親近感もあることから、アジア圏での移住先として注目されています。IT・半導体・エンタメ・製造業など多様な就労機会があり、ソウル・釜山・済州島を拠点に外国人が増えています。

### あなたに合ったビザは？

| あなたの状況 | おすすめのビザ |
|------------|-------------|
| 韓国企業に専門職として就労 | E-7（特定活動ビザ） |
| 大学・研究機関で語学講師 | E-1〜E-2（専門技術職ビザ） |
| 高度人材ポイント80点以上（就労制限なし希望） | F-2-7（居住ビザ） |
| 韓国で就職活動中 | D-10（求職ビザ） |
| 5年以上の合法滞在後に永住を希望 | F-5（永住権） |
| 韓国国籍者と婚姻 | F-6（婚姻ビザ） |

### 主なビザの種類`,
  "visa-kr: ビザ選択ガイド追加"
);

replace(
  `**E-7（特定活動）ビザ**
専門職・技術職向けの最も一般的な就労ビザ。韓国企業に雇用される場合が多く、雇用主のサポートが必要。`,
  `**E-7（特定活動）ビザ** ｜ [Hi Korea 公式ページ](https://www.hikorea.go.kr/info/InfoDetailR.pt?lang=en&catSeq=2&wurcdSeq=2798)
専門職・技術職向けの最も一般的な就労ビザ。韓国企業に雇用される場合が多く、雇用主のサポートが必要。`,
  "visa-kr: E-7にリンク追加"
);

replace(
  `**F-2-7（居住ビザ・ポイント制）**
高度人材向けの居住ビザ。年齢・学歴・韓国語能力（TOPIK）・収入・資産などの項目でポイント算出（80点以上で申請可能）。`,
  `**F-2-7（居住ビザ・ポイント制）** ｜ [Hi Korea 公式ページ](https://www.hikorea.go.kr/info/InfoDetailR.pt?lang=en&catSeq=2&wurcdSeq=2865)
高度人材向けの居住ビザ。年齢・学歴・韓国語能力（TOPIK）・収入・資産などの項目でポイント算出（80点以上で申請可能）。`,
  "visa-kr: F-2-7にリンク追加"
);

replace(
  `**D-10（求職ビザ）**
就職活動中の外国人向けビザ。6ヶ月間有効（一定条件下で延長可能）。`,
  `**D-10（求職ビザ）** ｜ [Hi Korea 公式ページ](https://www.hikorea.go.kr/info/InfoDetailR.pt?lang=en&catSeq=2&wurcdSeq=2794)
就職活動中の外国人向けビザ。6ヶ月間有効（一定条件下で延長可能）。`,
  "visa-kr: D-10にリンク追加"
);

replace(
  `**永住権（F-5）**
韓国で長期的に生活するための永住ビザ。`,
  `**永住権（F-5）** ｜ [Hi Korea 公式ページ](https://www.hikorea.go.kr/info/InfoDetailR.pt?lang=en&catSeq=2&wurcdSeq=2869)
韓国で長期的に生活するための永住ビザ。`,
  "visa-kr: F-5にリンク追加"
);

// ============================================================
// visa-id: ビザ選択ガイド追加 + 各ビザに公式リンク埋め込み
// ============================================================
replace(
  `インドネシアはASEANの中で最大の経済規模を持つ国で、バリ島を中心にデジタルノマドや移住者に人気が高まっています。ジャカルタは東南アジア有数のビジネスハブであり、製造業・IT・資源産業などで多くの日系企業が進出しています。

### 主なビザの種類`,
  `インドネシアはASEANの中で最大の経済規模を持つ国で、バリ島を中心にデジタルノマドや移住者に人気が高まっています。ジャカルタは東南アジア有数のビジネスハブであり、製造業・IT・資源産業などで多くの日系企業が進出しています。

### あなたに合ったビザは？

| あなたの状況 | おすすめのビザ |
|------------|-------------|
| インドネシア企業に就労 | KITAS（就労許可付き） |
| 富裕層・資産1.5億円以上で長期滞在 | Second Home Visa（5〜10年） |
| 観光・バリ島でのノマド滞在（短期） | 観光ビザ延長（最大120日）またはVOA |
| インドネシア人配偶者あり | 配偶者KITAS |
| 長期在留後に永住を希望 | KITAP（KITAS継続5年後） |
| ビジネス視察・商談 | B211A ビザまたはVOA |

### 主なビザの種類`,
  "visa-id: ビザ選択ガイド追加"
);

replace(
  `**KITAS（Limited Stay Permit / Izin Tinggal Terbatas）**
外国人がインドネシアで就労・居住するための主要な許可証。`,
  `**KITAS（Limited Stay Permit / Izin Tinggal Terbatas）** ｜ [出入国管理局 e-Visa ポータル](https://evisa.imigrasi.go.id/)
外国人がインドネシアで就労・居住するための主要な許可証。`,
  "visa-id: KITASにリンク追加"
);

replace(
  `**Second Home Visa（第二の家ビザ）**
2022年に導入された長期滞在ビザ。`,
  `**Second Home Visa（第二の家ビザ）** ｜ [移民局 公式FAQ](https://evisa.imigrasi.go.id/front/faq/b6469147-09ae-44c0-878e-74e2c4c2c14e)
2022年に導入された長期滞在ビザ。`,
  "visa-id: Second Home Visaにリンク追加"
);

replace(
  `**外国人就労許可（RPTKA + Imta）**
インドネシア企業が外国人を雇用するために申請。`,
  `**外国人就労許可（RPTKA + Imta）** ｜ [インドネシア労働省](https://kemnaker.go.id/)
インドネシア企業が外国人を雇用するために申請。`,
  "visa-id: 就労許可にリンク追加"
);

writeFileSync(filePath, content, "utf8");
console.log("\n✅ All done!");

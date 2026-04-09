import { readFileSync, writeFileSync } from "fs";

const filePath = "c:/Users/chiji/OneDrive/VScode用/docs/moveworth/src/data/blog-posts.ts";
let content = readFileSync(filePath, "utf8");

// Helper: replace exact string
function replace(search, replacement, label) {
  if (!content.includes(search)) {
    console.warn(`NOT FOUND: ${label}`);
    return;
  }
  content = content.replace(search, replacement);
  console.log(`✅ ${label}`);
}

// ============================================================
// 1. visa-us ja: 参考資料を追加
// ============================================================
replace(
  `アメリカは収入ポテンシャルが極めて高い反面、税負担・医療費・住居費も世界有数の高さです。MoveWorthで収入・税金・生活費を総合的にシミュレーションしてから検討することを強くお勧めします。\`,`,
  `アメリカは収入ポテンシャルが極めて高い反面、税負担・医療費・住居費も世界有数の高さです。MoveWorthで収入・税金・生活費を総合的にシミュレーションしてから検討することを強くお勧めします。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **H-1B 専門職ビザ**: [USCIS – H-1B 公式ページ](https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations)
- **L-1 駐在員ビザ（企業内転勤）**: [USCIS – L-1A/L-1B ビザ](https://www.uscis.gov/working-in-the-united-states/temporary-workers/l-1a-intracompany-transferee-executive-or-manager)
- **O-1 卓越能力ビザ**: [USCIS – O-1 ビザ](https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement)
- **EB-2 NIW（国家利益免除）**: [USCIS – EB-2 第二優先移民ビザ](https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-second-preference-eb-2)
- **EB-5 投資家ビザ**: [USCIS – EB-5 移民投資家プログラム](https://www.uscis.gov/working-in-the-united-states/permanent-workers/eb-5-immigrant-investor-program)
- **グリーンカード（永住権）全般**: [USCIS – グリーンカード申請情報](https://www.uscis.gov/green-card)
- **ビザ申請オンラインポータル**: [USCIS – myUSCIS アカウント](https://my.uscis.gov/)\`,`,
  "visa-us ja: 参考資料追加"
);

// ============================================================
// 2. visa-ca ja: 参考資料を追加
// ============================================================
replace(
  `カナダは移民制度の透明性が高く、英語力と就労経験があれば永住権取得が比較的現実的な国です。MoveWorthで生活費・税金を詳しくシミュレーションしながら最適な移住タイミングを検討してください。\`,`,
  `カナダは移民制度の透明性が高く、英語力と就労経験があれば永住権取得が比較的現実的な国です。MoveWorthで生活費・税金を詳しくシミュレーションしながら最適な移住タイミングを検討してください。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **Express Entry（永住権申請）**: [IRCC – Express Entry 公式ページ](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html)
- **カテゴリーベース選考ラウンド**: [IRCC – カテゴリー別選考](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html)
- **スタートアップビザ**: [IRCC – Start-up Visa プログラム](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html)
- **一時就労許可**: [IRCC – 就労許可 資格要件](https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit/temporary/eligibility.html)
- **ワーキングホリデー（IEC）**: [IRCC – 国際経験カナダ（IEC）](https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec.html)
- **IRCC オンライン申請ポータル**: [IRCC – アカウントログイン](https://www.canada.ca/en/immigration-refugees-citizenship/services/application/account.html)\`,`,
  "visa-ca ja: 参考資料追加"
);

// ============================================================
// 3. visa-fi ja: 参考リンクを増やす
// ============================================================
replace(
  `- **ビザ・在留許可全般**: [フィンランド移民局（Migri）公式サイト](https://migri.fi/en/home)
- **オンライン申請（Enter Finland）**: [Enter Finland – オンライン在留許可申請](https://enterfinland.fi/)

\`
      en:`,
  `- **ビザ・在留許可全般**: [フィンランド移民局（Migri）公式サイト](https://migri.fi/en/home)
- **オンライン申請（Enter Finland）**: [Enter Finland – オンライン在留許可申請](https://enterfinland.fi/)
- **住民登録・個人番号（DVV）**: [DVV – デジタル人口サービス庁](https://dvv.fi/en/home)
- **社会保険・Kela給付**: [Kela – フィンランド社会保険機構](https://www.kela.fi/web/en)
- **税務登録・納税番号（Vero）**: [Vero – フィンランド税務庁](https://www.vero.fi/en/)

\`
      en:`,
  "visa-fi ja: リンク追加"
);

// ============================================================
// 4. visa-kr ja: 参考リンクを増やす
// ============================================================
replace(
  `- **外国人ビザ・在留全般**: [Hi Korea 外国人在留ポータル](https://www.hikorea.go.kr/)
- **ビザ種別ガイド（D-8・F-2・F-5等）**: [韓国法務省出入国外国人政策本部](https://www.immigration.go.kr/)
- **韓国政府外国人サービス**: [gov.kr 外国人向けポータル](https://www.gov.kr/portal/foreigner/en/m010102)

\`
      en:`,
  `- **外国人ビザ・在留全般**: [Hi Korea 外国人在留ポータル](https://www.hikorea.go.kr/)
- **ビザ種別ガイド（D-8・F-2・F-5等）**: [韓国法務省出入国外国人政策本部](https://www.immigration.go.kr/)
- **韓国政府外国人サービス**: [gov.kr 外国人向けポータル](https://www.gov.kr/portal/foreigner/en/m010102)
- **雇用許可制（E-9ビザ）**: [韓国雇用労働部 – 雇用許可制（EPS）](https://www.eps.go.kr/)
- **国民健康保険（外国人加入案内）**: [国民健康保険公団（NHIS）](https://www.nhis.or.kr/nhis/english/index.do)
- **国税庁（HOMETAX）**: [国税庁 – 外国人税務申告](https://www.hometax.go.kr/)

\`
      en:`,
  "visa-kr ja: リンク追加"
);

// ============================================================
// 5. visa-id ja: 参考リンクを増やす
// ============================================================
replace(
  `- **電子ビザ・在留許可（KITAS/KITAP）**: [インドネシア出入国管理局 e-Visa ポータル](https://evisa.imigrasi.go.id/)
- **セカンドホームビザ**: [セカンドホームビザ公式 FAQ（移民局）](https://evisa.imigrasi.go.id/front/faq/b6469147-09ae-44c0-878e-74e2c4c2c14e)

\`
      en:`,
  `- **電子ビザ・在留許可（KITAS/KITAP）**: [インドネシア出入国管理局 e-Visa ポータル](https://evisa.imigrasi.go.id/)
- **セカンドホームビザ**: [セカンドホームビザ公式 FAQ（移民局）](https://evisa.imigrasi.go.id/front/faq/b6469147-09ae-44c0-878e-74e2c4c2c14e)
- **外国人就労許可（Izin Bekerja）**: [インドネシア労働省 – 外国人就労許可](https://kemnaker.go.id/)
- **BPJS（社会保険）加入情報**: [BPJS Ketenagakerjaan 公式サイト](https://www.bpjsketenagakerjaan.go.id/)
- **税務登録（DJP Online）**: [インドネシア税務総局](https://www.pajak.go.id/)

\`
      en:`,
  "visa-id ja: リンク追加"
);

// ============================================================
// 6. visa-th ja: ビザ選択ガイドを追加（導入部の直後）
// ============================================================
replace(
  `タイは温暖な気候・豊かな食文化・比較的低い生活コストから、日本人の移住先として人気上位の国です。バンコク・チェンマイを拠点に多くの外国人が生活しており、近年はデジタルノマド向けの新ビザ制度も整備されています。

### 主なビザの種類`,
  `タイは温暖な気候・豊かな食文化・比較的低い生活コストから、日本人の移住先として人気上位の国です。バンコク・チェンマイを拠点に多くの外国人が生活しており、近年はデジタルノマド向けの新ビザ制度も整備されています。

### あなたに合ったビザは？

| あなたの状況 | おすすめのビザ |
|------------|-------------|
| 資産1,000万USD以上 / 高収入リタイア | LTRビザ（Wealthy Global Citizen / Wealthy Pensioner） |
| 海外企業でリモート勤務・年収USD 80,000以上 | LTRビザ（Work-from-Thailand Professional） |
| 富裕層向けVIPサービスを希望 | Thailand Privilege Card |
| タイ企業に就労 | Non-B ビザ + 就労許可証 |
| 50歳以上でリタイア目的 | Non-OA（リタイアメントビザ） |
| デジタルノマド（海外収入） | LTR（Work-from-Thailand）が現実的な選択肢 |

### 主なビザの種類`,
  "visa-th ja: ビザ選択ガイド追加"
);

// ============================================================
// 7. visa-ph ja: SIRV（投資家ビザ）を追加
// ============================================================
replace(
  `**SVEP（Special Visa for Employment Generation）**
経済特区（PEZA・BOI認定企業）内で就労する外国人向けの特別ビザ。

### 生活・税金について`,
  `**SVEP（Special Visa for Employment Generation）**
経済特区（PEZA・BOI認定企業）内で就労する外国人向けの特別ビザ。

**SIRV（Special Investor's Resident Visa）/ 投資家向け永住ビザ**
フィリピンへの投資を条件に取得できる永住権に相当するビザ。
- 最低投資額：USD 75,000以上（フィリピン証券取引委員会認定の企業株式等）
- PEZA・BOI等の認定事業への投資が対象
- 就労許可（AEP）なしでの就労が可能
- 管轄：フィリピン証券取引委員会（SEC）

**PEZA ビザ（経済区就労者）**
フィリピン経済区庁（PEZA）の認定企業・工場に就労する外国人向け特別査証。就労許可取得手続きが簡略化されており、IT・製造業で多く利用されている。

### 生活・税金について`,
  "visa-ph ja: SIRV・PEZAビザ追加"
);

// visa-ph の費用テーブルにSIRVを追加
replace(
  `| ACR I-Card | PHP 2,000〜 |

### 移住前のチェックポイント

1. **外国人の土地所有制限`,
  `| ACR I-Card | PHP 2,000〜 |
| SIRV申請費 | USD 1,000〜 |

### 移住前のチェックポイント

1. **外国人の土地所有制限`,
  "visa-ph ja: SIRVを費用テーブルに追加"
);

// ============================================================
// 8. visa-de ja: 「どのビザを選ぶ？」ガイドと不足コンテンツ追加
// ============================================================
replace(
  `ドイツはEU最大の経済大国であり、製造業・IT・エンジニアリング・医療を中心に外国人専門職の需要が継続して高い国です。2023年に施行された「専門労働者移民法（Fachkräfteeinwanderungsgesetz）」の改正により、学歴だけでなく実務経験ベースでも就労ビザが取得可能になりました。EU外からのルートがかつてないほど広がっています。

### 主なビザの種類`,
  `ドイツはEU最大の経済大国であり、製造業・IT・エンジニアリング・医療を中心に外国人専門職の需要が継続して高い国です。2023年に施行された「専門労働者移民法（Fachkräfteeinwanderungsgesetz）」の改正により、学歴だけでなく実務経験ベースでも就労ビザが取得可能になりました。EU外からのルートがかつてないほど広がっています。

### あなたに合ったビザは？

| あなたの状況 | おすすめのビザ |
|------------|-------------|
| 大学学位あり・年収EUR 45,000以上の職に就く | EUブルーカード |
| 大学学位あり・または5年以上の実務経験 | 専門労働者ビザ（Fachkräftevisum） |
| 先にドイツで就職活動をしたい | 求職者ビザ（6ヶ月） / 機会カード（1年） |
| フリーランス・コンサルタント・芸術家 | フリーランスビザ（Freiberufler） |
| ポイント6以上だが学位なし | 機会カード（Chancenkarte） |

### 主なビザの種類`,
  "visa-de ja: ビザ選択ガイド追加"
);

// visa-de ja: 家族帯同・年金・医療の情報を追加（チェックポイントの後）
replace(
  `ドイツは2023年の移民法改正で第三国からの門戸が大きく開かれており、エンジニア・IT・医療職でのキャリアを考える方に特に適した移住先です。言語の壁は高いですが、その分競争は相対的に低く、一度定住すると長期的に安定した生活を築きやすい国です。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **熟練労働者移住ガイド全般**: [Make it in Germany – 公式移住ポータル](https://www.make-it-in-germany.com/)
- **ビザ・在留許可法令（Fachkräfteeinwanderungsgesetz）**: [BAMF – ドイツ連邦移民難民庁](https://www.bamf.de/)
- **ビザ申請・在外公館**: [ドイツ連邦外務省 – ビザ申請ガイド](https://www.auswaertiges-amt.de/en/visa-service)`,
  `### 家族帯同・その他の手続き

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
  "visa-de ja: 家族帯同・年金・医療追加 + リンク強化"
);

// ============================================================
// 9. visa-fr ja: ビザ選択早見表を追加
// ============================================================
replace(
  `フランスはファッション・食・芸術で知られるだけでなく、パリを拠点とする世界最大級のスタートアップキャンパス「Station F」や、La French TechエコシステムによりIT・テック分野での外国人人材需要も急増しています。EU加盟国の中でも比較的高い給与水準を持ちながら、社会保険制度が充実している点が特徴です。

### 主なビザの種類`,
  `フランスはファッション・食・芸術で知られるだけでなく、パリを拠点とする世界最大級のスタートアップキャンパス「Station F」や、La French TechエコシステムによりIT・テック分野での外国人人材需要も急増しています。EU加盟国の中でも比較的高い給与水準を持ちながら、社会保険制度が充実している点が特徴です。

### ビザ選択早見表

| あなたの状況 | おすすめのビザ |
|------------|-------------|
| 研究者・高収入エンジニア・幹部職 | タレントパスポート（研究者 / 企業幹部カテゴリ） |
| La French Tech認定スタートアップに就労 | La French Tech Visa |
| 自分でスタートアップ・事業を立ち上げる | タレントパスポート（起業家カテゴリ） |
| フランス企業に一般就労 | 就労許可付き長期ビザ（VLS-TS） |
| 18〜30歳・旅行＋就労を体験したい | ワーキングホリデー（PVT） |
| フリーランス・コンサルタント | Auto-entrepreneur + タレントパスポート（起業家） |

### 主なビザの種類`,
  "visa-fr ja: ビザ選択早見表追加"
);

// visa-fr の参考リンクにLa French Techを追加
replace(
  `- **フランスビザ申請全般**: [France-Visas 公式ポータル](https://france-visas.gouv.fr/)
- **入国後手続き（OFII）**: [OFII – フランス移民統合局](https://www.ofii.fr/)
- **タレントパスポート・長期在留許可**: [Service-Public.fr – タレントパスポート](https://www.service-public.fr/particuliers/vosdroits/F16922)

\`
      en:`,
  `- **フランスビザ申請全般**: [France-Visas 公式ポータル](https://france-visas.gouv.fr/)
- **入国後手続き（OFII）**: [OFII – フランス移民統合局](https://www.ofii.fr/)
- **タレントパスポート・長期在留許可**: [Service-Public.fr – タレントパスポート](https://www.service-public.fr/particuliers/vosdroits/F16922)
- **La French Tech Visa**: [La French Tech – テックビザ公式情報](https://lafrenchtech.com/en/how-france-helps-startups/french-tech-visa/)
- **Station F（スタートアップキャンパス）**: [Station F 公式サイト](https://stationf.co/)

\`
      en:`,
  "visa-fr ja: リンク追加"
);

writeFileSync(filePath, content, "utf8");
console.log("\n✅ All done!");

import { readFileSync, writeFileSync } from "fs";

const filePath = "c:/Users/chiji/OneDrive/VScode用/docs/moveworth/src/data/blog-posts.ts";
let content = readFileSync(filePath, "utf8");

// Each entry: [searchString, replacement]
const replacements = [
  // visa-th (Thailand)
  [
    `タイは東南アジアの中でも特に日本人移住者・ノマドワーカーに人気の国です。LTRビザやThailand Privilegeカードの活用で長期滞在が可能になりました。MoveWorthでシミュレーションして、タイ移住の費用と資産形成計画を立ててみましょう。\`,`,
    `タイは東南アジアの中でも特に日本人移住者・ノマドワーカーに人気の国です。LTRビザやThailand Privilegeカードの活用で長期滞在が可能になりました。MoveWorthでシミュレーションして、タイ移住の費用と資産形成計画を立ててみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **LTR ビザ（長期滞在ビザ）**: [BOI 公式 LTR ポータル](https://ltr.boi.go.th/)
- **Thailand Privilege Card**: [タイ観光スポーツ省公認公式サイト](https://www.thailandprivilege.co.th/home)
- **就労許可（Work Permit）**: [タイ労働省 e-Work Permit システム](https://ewp.doe.go.th/)
- **電子ビザ申請**: [Thailand e-Visa 公式ポータル](https://thaievisa.go.th/)\`,`,
  ],
  [
    `Thailand is popular with Japanese expats and digital nomads. The LTR Visa and Thailand Privilege Card have made long-term stays significantly more accessible. Use MoveWorth to simulate your finances and plan your Thailand move.`,
    `Thailand is popular with Japanese expats and digital nomads. The LTR Visa and Thailand Privilege Card have made long-term stays significantly more accessible. Use MoveWorth to simulate your finances and plan your Thailand move.

---

### References

This article is based on the following official sources.

- **LTR Visa (Long-Term Resident Visa)**: [BOI Official LTR Portal](https://ltr.boi.go.th/)
- **Thailand Privilege Card**: [Official Thailand Privilege Site (Ministry of Tourism & Sports)](https://www.thailandprivilege.co.th/home)
- **Work Permit**: [Thailand DOE e-Work Permit System](https://ewp.doe.go.th/)
- **Electronic Visa**: [Thailand e-Visa Official Portal](https://thaievisa.go.th/)`,
  ],
  [
    `泰国是东南亚最受日本移居者和数字游民青睐的国家之一。LTR签证和Thailand Privilege Card的推出使长期居留变得更加便捷。使用MoveWorth模拟财务状况，规划您的泰国移居计划。\`,`,
    `泰国是东南亚最受日本移居者和数字游民青睐的国家之一。LTR签证和Thailand Privilege Card的推出使长期居留变得更加便捷。使用MoveWorth模拟财务状况，规划您的泰国移居计划。

---

### 参考资料

本文信息基于以下官方资料整理。

- **LTR签证（长期居留签证）**: [BOI官方LTR门户](https://ltr.boi.go.th/)
- **Thailand Privilege Card**: [泰国旅游体育部认可官方网站](https://www.thailandprivilege.co.th/home)
- **工作许可（Work Permit）**: [泰国劳工部 e-Work Permit 系统](https://ewp.doe.go.th/)
- **电子签证**: [Thailand e-Visa 官方门户](https://thaievisa.go.th/)\`,`,
  ],

  // visa-kr (South Korea)
  [
    `韓国は日本から近く、文化的親和性も高いため、アジア圏での移住先として注目されています。ただし言語ハードルが高く、就労ビザの取得競争も激しいため、事前準備が非常に重要です。MoveWorthでシミュレーションして、韓国移住の資産形成計画を立てましょう。\`,`,
    `韓国は日本から近く、文化的親和性も高いため、アジア圏での移住先として注目されています。ただし言語ハードルが高く、就労ビザの取得競争も激しいため、事前準備が非常に重要です。MoveWorthでシミュレーションして、韓国移住の資産形成計画を立てましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **外国人ビザ・在留全般**: [Hi Korea 外国人在留ポータル](https://www.hikorea.go.kr/)
- **ビザ種別ガイド（D-8・F-2・F-5等）**: [韓国法務省出入国外国人政策本部](https://www.immigration.go.kr/)
- **韓国政府外国人サービス**: [gov.kr 外国人向けポータル](https://www.gov.kr/portal/foreigner/en/m010102)\`,`,
  ],
  [
    `South Korea's proximity to Japan and cultural familiarity make it an attractive regional option. However, language barriers and competitive visa categories require thorough preparation. Use MoveWorth to simulate your finances and plan your Korean move.`,
    `South Korea's proximity to Japan and cultural familiarity make it an attractive regional option. However, language barriers and competitive visa categories require thorough preparation. Use MoveWorth to simulate your finances and plan your Korean move.

---

### References

This article is based on the following official sources.

- **Foreign Residency & Visa General**: [Hi Korea Foreign Resident Portal](https://www.hikorea.go.kr/)
- **Visa Category Guide (D-8, F-2, F-5, etc.)**: [Korea Immigration Service (Ministry of Justice)](https://www.immigration.go.kr/)
- **Korea Government Foreign Services**: [gov.kr Foreigner Portal](https://www.gov.kr/portal/foreigner/en/m010102)`,
  ],
  [
    `韩国距日本近、文化亲缘性强，是亚洲圈内颇受关注的移居目的地。但语言门槛较高，就业签证竞争激烈，充分的事前准备至关重要。使用MoveWorth模拟财务状况，制定韩国移居资产积累计划。\`,`,
    `韩国距日本近、文化亲缘性强，是亚洲圈内颇受关注的移居目的地。但语言门槛较高，就业签证竞争激烈，充分的事前准备至关重要。使用MoveWorth模拟财务状况，制定韩国移居资产积累计划。

---

### 参考资料

本文信息基于以下官方资料整理。

- **外国人居留及签证总览**: [Hi Korea 外国人居留门户](https://www.hikorea.go.kr/)
- **签证类别指南（D-8・F-2・F-5等）**: [韩国法务部出入境外国人政策本部](https://www.immigration.go.kr/)
- **韩国政府外国人服务**: [gov.kr 外国人门户](https://www.gov.kr/portal/foreigner/en/m010102)\`,`,
  ],

  // visa-tw (Taiwan)
  [
    `台湾はアジアの中でも比較的移住しやすい国のひとつです。Gold Cardは特にITや金融のプロフェッショナルに人気があります。MoveWorthで台湾移住後の資産推移をシミュレーションしてみましょう。\`,`,
    `台湾はアジアの中でも比較的移住しやすい国のひとつです。Gold Cardは特にITや金融のプロフェッショナルに人気があります。MoveWorthで台湾移住後の資産推移をシミュレーションしてみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **Employment Gold Card（就業金卡）**: [ゴールドカード公式ポータル（国家発展委員会）](https://goldcard.nat.gov.tw/en/)
- **Gold Card 資格要件**: [ゴールドカード 資格要件ページ](https://goldcard.nat.gov.tw/en/qualification/)
- **APRC（永久居留証）**: [内政部移民署 – APRC 申請ガイドライン](https://www.immigration.gov.tw/5475/5478/141465/141808/)\`,`,
  ],
  [
    `Taiwan is one of Asia's more accessible relocation destinations. The Gold Card is particularly popular among IT and finance professionals. Use MoveWorth to simulate your asset trajectory after moving to Taiwan.`,
    `Taiwan is one of Asia's more accessible relocation destinations. The Gold Card is particularly popular among IT and finance professionals. Use MoveWorth to simulate your asset trajectory after moving to Taiwan.

---

### References

This article is based on the following official sources.

- **Employment Gold Card**: [Gold Card Official Portal (National Development Council)](https://goldcard.nat.gov.tw/en/)
- **Gold Card Eligibility**: [Gold Card Qualification Page](https://goldcard.nat.gov.tw/en/qualification/)
- **APRC (Alien Permanent Resident Certificate)**: [National Immigration Agency – APRC Guidelines](https://www.immigration.gov.tw/5475/5478/141465/141808/)`,
  ],
  [
    `台湾是亚洲移居门槛相对较低的国家之一。就业金卡尤其受IT和金融领域专业人士的青睐。使用MoveWorth模拟移居台湾后的资产变化趋势。\`,`,
    `台湾是亚洲移居门槛相对较低的国家之一。就业金卡尤其受IT和金融领域专业人士的青睐。使用MoveWorth模拟移居台湾后的资产变化趋势。

---

### 参考资料

本文信息基于以下官方资料整理。

- **就业金卡（Employment Gold Card）**: [金卡官方门户（国家发展委员会）](https://goldcard.nat.gov.tw/en/)
- **金卡资格要求**: [金卡资格要求页面](https://goldcard.nat.gov.tw/en/qualification/)
- **永久居留证（APRC）**: [内政部移民署 – APRC 申请指南](https://www.immigration.gov.tw/5475/5478/141465/141808/)\`,`,
  ],

  // visa-hk (Hong Kong)
  [
    `香港はアジアのビジネス・金融ハブとして依然として強い地位を保っています。TTPS・QMASなどの人材誘致スキームを活用し、香港での新たなキャリアを検討してみましょう。MoveWorthで香港移住後の資産推移をシミュレーションしてみましょう。\`,`,
    `香港はアジアのビジネス・金融ハブとして依然として強い地位を保っています。TTPS・QMASなどの人材誘致スキームを活用し、香港での新たなキャリアを検討してみましょう。MoveWorthで香港移住後の資産推移をシミュレーションしてみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **QMAS（優秀人才入境計劃）**: [香港入境事務處 – QMAS 公式ページ](https://www.immd.gov.hk/eng/services/visas/quality_migrant_admission_scheme.html)
- **TTPS（トップタレントパス計画）**: [香港入境事務處 – TTPS 公式ページ](https://www.immd.gov.hk/eng/services/visas/TTPS.html)
- **各種人才計劃一覧**: [香港入境事務處 – 全スキーム比較](https://www.immd.gov.hk/eng/useful_information/admission-schemes-talents-professionals-entrepreneurs.html)\`,`,
  ],
  [
    `Hong Kong remains a powerful Asian business and financial hub. Talent attraction schemes like TTPS and QMAS offer accessible pathways for skilled professionals. Use MoveWorth to simulate your asset trajectory after moving to Hong Kong.`,
    `Hong Kong remains a powerful Asian business and financial hub. Talent attraction schemes like TTPS and QMAS offer accessible pathways for skilled professionals. Use MoveWorth to simulate your asset trajectory after moving to Hong Kong.

---

### References

This article is based on the following official sources.

- **QMAS (Quality Migrant Admission Scheme)**: [HKID – QMAS Official Page](https://www.immd.gov.hk/eng/services/visas/quality_migrant_admission_scheme.html)
- **TTPS (Top Talent Pass Scheme)**: [HKID – TTPS Official Page](https://www.immd.gov.hk/eng/services/visas/TTPS.html)
- **All Talent Admission Schemes**: [HKID – Schemes Overview](https://www.immd.gov.hk/eng/useful_information/admission-schemes-talents-professionals-entrepreneurs.html)`,
  ],
  [
    `香港作为亚洲商业和金融中心的地位依然稳固。TTPS、QMAS等人才引进计划为专业人士提供了便捷的居留途径。使用MoveWorth模拟移居香港后的资产变化趋势。\`,`,
    `香港作为亚洲商业和金融中心的地位依然稳固。TTPS、QMAS等人才引进计划为专业人士提供了便捷的居留途径。使用MoveWorth模拟移居香港后的资产变化趋势。

---

### 参考资料

本文信息基于以下官方资料整理。

- **QMAS（优秀人才入境计划）**: [香港入境事务处 – QMAS 官方页面](https://www.immd.gov.hk/eng/services/visas/quality_migrant_admission_scheme.html)
- **TTPS（高端人才通行证计划）**: [香港入境事务处 – TTPS 官方页面](https://www.immd.gov.hk/eng/services/visas/TTPS.html)
- **各类人才计划总览**: [香港入境事务处 – 全计划比较](https://www.immd.gov.hk/eng/useful_information/admission-schemes-talents-professionals-entrepreneurs.html)\`,`,
  ],

  // visa-id (Indonesia)
  [
    `インドネシアはASEANの中でも最大規模の経済圏を持ち、近年は外国人向けの長期ビザ制度も整備が進んでいます。MoveWorthでインドネシア移住後の生活費・資産推移をシミュレーションしてみましょう。\`,`,
    `インドネシアはASEANの中でも最大規模の経済圏を持ち、近年は外国人向けの長期ビザ制度も整備が進んでいます。MoveWorthでインドネシア移住後の生活費・資産推移をシミュレーションしてみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **電子ビザ・在留許可（KITAS/KITAP）**: [インドネシア出入国管理局 e-Visa ポータル](https://evisa.imigrasi.go.id/)
- **セカンドホームビザ**: [セカンドホームビザ公式 FAQ（移民局）](https://evisa.imigrasi.go.id/front/faq/b6469147-09ae-44c0-878e-74e2c4c2c14e)\`,`,
  ],
  [
    `Indonesia has Southeast Asia's largest economy and has been developing its long-term visa options for foreigners in recent years. Use MoveWorth to simulate living costs and asset trajectories after moving to Indonesia.`,
    `Indonesia has Southeast Asia's largest economy and has been developing its long-term visa options for foreigners in recent years. Use MoveWorth to simulate living costs and asset trajectories after moving to Indonesia.

---

### References

This article is based on the following official sources.

- **e-Visa, KITAS & KITAP**: [Indonesia Immigration e-Visa Portal](https://evisa.imigrasi.go.id/)
- **Second Home Visa**: [Second Home Visa Official FAQ (Immigration)](https://evisa.imigrasi.go.id/front/faq/b6469147-09ae-44c0-878e-74e2c4c2c14e)`,
  ],
  [
    `印度尼西亚拥有东南亚最大规模的经济体，近年来针对外籍人士的长期居留签证制度不断完善。使用MoveWorth模拟移居印尼后的生活成本和资产变化趋势。\`,`,
    `印度尼西亚拥有东南亚最大规模的经济体，近年来针对外籍人士的长期居留签证制度不断完善。使用MoveWorth模拟移居印尼后的生活成本和资产变化趋势。

---

### 参考资料

本文信息基于以下官方资料整理。

- **电子签证・KITAS/KITAP**: [印度尼西亚移民局 e-Visa 门户](https://evisa.imigrasi.go.id/)
- **第二家园签证**: [第二家园签证官方FAQ（移民局）](https://evisa.imigrasi.go.id/front/faq/b6469147-09ae-44c0-878e-74e2c4c2c14e)\`,`,
  ],

  // visa-ph (Philippines)
  [
    `フィリピンは英語が公用語でコストが低く、温暖な気候も魅力です。SRRVはリタイア後の移住先として非常に人気が高い選択肢です。MoveWorthでフィリピン移住後の資産推移をシミュレーションしてみましょう。\`,`,
    `フィリピンは英語が公用語でコストが低く、温暖な気候も魅力です。SRRVはリタイア後の移住先として非常に人気が高い選択肢です。MoveWorthでフィリピン移住後の資産推移をシミュレーションしてみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **SRRV（特別居住退職者ビザ）**: [フィリピン退職庁（PRA）公式ページ](https://pra.gov.ph/SRRVisa)
- **9(g) 就労ビザ**: [フィリピン入国管理局（BI）– 9(g) ビザ](https://immigration.gov.ph/pre-4-arranged-employment-visa-9g/)
- **入国管理局全般**: [フィリピン入国管理局（Bureau of Immigration）](https://immigration.gov.ph/)\`,`,
  ],
  [
    `The Philippines offers English as an official language, low costs, and a warm climate. The SRRV is a very popular choice for retirees. Use MoveWorth to simulate your asset trajectory after moving to the Philippines.`,
    `The Philippines offers English as an official language, low costs, and a warm climate. The SRRV is a very popular choice for retirees. Use MoveWorth to simulate your asset trajectory after moving to the Philippines.

---

### References

This article is based on the following official sources.

- **SRRV (Special Resident Retiree's Visa)**: [Philippines Retirement Authority (PRA) Official Page](https://pra.gov.ph/SRRVisa)
- **9(g) Work Visa**: [Bureau of Immigration (BI) – 9(g) Visa](https://immigration.gov.ph/pre-4-arranged-employment-visa-9g/)
- **General Immigration**: [Bureau of Immigration Philippines](https://immigration.gov.ph/)`,
  ],
  [
    `菲律宾以英语为官方语言、生活成本低廉、气候温暖著称。SRRV是退休移居者的热门选择之一。使用MoveWorth模拟移居菲律宾后的资产变化趋势。\`,`,
    `菲律宾以英语为官方语言、生活成本低廉、气候温暖著称。SRRV是退休移居者的热门选择之一。使用MoveWorth模拟移居菲律宾后的资产变化趋势。

---

### 参考资料

本文信息基于以下官方资料整理。

- **SRRV（特别居住退休签证）**: [菲律宾退休局（PRA）官方页面](https://pra.gov.ph/SRRVisa)
- **9(g) 工作签证**: [菲律宾移民局（BI）– 9(g) 签证](https://immigration.gov.ph/pre-4-arranged-employment-visa-9g/)
- **移民局总览**: [菲律宾移民局（Bureau of Immigration）](https://immigration.gov.ph/)\`,`,
  ],

  // visa-vn (Vietnam)
  [
    `ベトナムはアジアの中でも急成長している経済圏で、生活コストが低く、外国人ノマドや移住者にとって魅力的な国です。MoveWorthでベトナム移住後の資産推移をシミュレーションしてみましょう。\`,`,
    `ベトナムはアジアの中でも急成長している経済圏で、生活コストが低く、外国人ノマドや移住者にとって魅力的な国です。MoveWorthでベトナム移住後の資産推移をシミュレーションしてみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **出入国管理・在留許可全般**: [ベトナム公安省 出入国管理局](https://immigration.gov.vn/)
- **電子ビザ（e-Visa）**: [ベトナム公式電子ビザ申請ポータル](https://evisa.gov.vn/)
- **一時居住証（TRC）申請手続き**: [出入国管理局 – TRC 手続き詳細](https://xuatnhapcanh.gov.vn/en/tin-tuc/procedures-temporary-residence-cards-foreigners-vietnam-immigration-department-ministry)\`,`,
  ],
  [
    `Vietnam is one of Asia's fastest-growing economies, with low living costs that make it attractive for digital nomads and expats. Use MoveWorth to simulate your asset trajectory after moving to Vietnam.`,
    `Vietnam is one of Asia's fastest-growing economies, with low living costs that make it attractive for digital nomads and expats. Use MoveWorth to simulate your asset trajectory after moving to Vietnam.

---

### References

This article is based on the following official sources.

- **Immigration & Residence General**: [Vietnam Immigration Department (Ministry of Public Security)](https://immigration.gov.vn/)
- **e-Visa**: [Vietnam Official e-Visa Portal](https://evisa.gov.vn/)
- **Temporary Residence Card (TRC)**: [Immigration Dept – TRC Application Procedures](https://xuatnhapcanh.gov.vn/en/tin-tuc/procedures-temporary-residence-cards-foreigners-vietnam-immigration-department-ministry)`,
  ],
  [
    `越南是亚洲经济增速最快的国家之一，生活成本低廉，对数字游民和外籍人士极具吸引力。使用MoveWorth模拟移居越南后的资产变化趋势。\`,`,
    `越南是亚洲经济增速最快的国家之一，生活成本低廉，对数字游民和外籍人士极具吸引力。使用MoveWorth模拟移居越南后的资产变化趋势。

---

### 参考资料

本文信息基于以下官方资料整理。

- **出入境管理及居留证总览**: [越南公安部 出入境管理局](https://immigration.gov.vn/)
- **电子签证（e-Visa）**: [越南官方电子签证申请门户](https://evisa.gov.vn/)
- **临时居留证（TRC）申请手续**: [出入境管理局 – TRC 手续详情](https://xuatnhapcanh.gov.vn/en/tin-tuc/procedures-temporary-residence-cards-foreigners-vietnam-immigration-department-ministry)\`,`,
  ],

  // visa-us (USA)
  [
    `The U.S. offers extraordinary income potential, but taxes, healthcare costs, and housing are also among the world's highest. Use MoveWorth to simulate the full financial picture before committing.`,
    `The U.S. offers extraordinary income potential, but taxes, healthcare costs, and housing are also among the world's highest. Use MoveWorth to simulate the full financial picture before committing.

---

### References

This article is based on the following official sources.

- **H-1B Specialty Occupation Visa**: [USCIS – H-1B Official Page](https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations)
- **EB-5 Investor Visa**: [USCIS – EB-5 Immigrant Investor Program](https://www.uscis.gov/working-in-the-united-states/permanent-workers/eb-5-immigrant-investor-program)
- **O-1 Extraordinary Ability Visa**: [USCIS – O-1 Visa](https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement)`,
  ],
  [
    `アメリカは世界最大の経済圏であり、高収入のキャリアチャンスが豊富です。ただし税金・医療費・住居費も世界トップクラスです。MoveWorthでシミュレーションして、収入・税金・生活費を含めた総合的な資産形成計画を立てましょう。\`,`,
    `アメリカは世界最大の経済圏であり、高収入のキャリアチャンスが豊富です。ただし税金・医療費・住居費も世界トップクラスです。MoveWorthでシミュレーションして、収入・税金・生活費を含めた総合的な資産形成計画を立てましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **H-1B 専門職ビザ**: [USCIS – H-1B 公式ページ](https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations)
- **EB-5 投資家ビザ**: [USCIS – EB-5 移民投資家プログラム](https://www.uscis.gov/working-in-the-united-states/permanent-workers/eb-5-immigrant-investor-program)
- **O-1 卓越能力ビザ**: [USCIS – O-1 ビザ](https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement)\`,`,
  ],
  [
    `美国收入潜力极高，但税负、医疗费和住房成本同样位居全球前列，强烈建议使用MoveWorth对收入、税金和生活费进行综合模拟后再做决定。\`,`,
    `美国收入潜力极高，但税负、医疗费和住房成本同样位居全球前列，强烈建议使用MoveWorth对收入、税金和生活费进行综合模拟后再做决定。

---

### 参考资料

本文信息基于以下官方资料整理。

- **H-1B 专业工作签证**: [USCIS – H-1B 官方页面](https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations)
- **EB-5 投资移民签证**: [USCIS – EB-5 移民投资项目](https://www.uscis.gov/working-in-the-united-states/permanent-workers/eb-5-immigrant-investor-program)
- **O-1 杰出人才签证**: [USCIS – O-1 签证](https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement)\`,`,
  ],

  // visa-ca (Canada)
  [
    `Canada's transparent immigration system rewards English proficiency and work experience. Use MoveWorth to simulate living costs and taxes as you plan your ideal timing.`,
    `Canada's transparent immigration system rewards English proficiency and work experience. Use MoveWorth to simulate living costs and taxes as you plan your ideal timing.

---

### References

This article is based on the following official sources.

- **Express Entry**: [IRCC – Express Entry Official Page](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html)
- **Category-Based Selection**: [IRCC – Category-Based Rounds](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html)
- **Start-up Visa**: [IRCC – Start-up Visa Program](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html)
- **Work Permit**: [IRCC – Temporary Work Permit Eligibility](https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit/temporary/eligibility.html)`,
  ],
  [
    `カナダは移民制度の透明性が高く、英語力と職歴が評価される国です。MoveWorthで生活費と税金をシミュレーションして、最適な移住タイミングを計画しましょう。\`,`,
    `カナダは移民制度の透明性が高く、英語力と職歴が評価される国です。MoveWorthで生活費と税金をシミュレーションして、最適な移住タイミングを計画しましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **Express Entry**: [IRCC – Express Entry 公式ページ](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html)
- **カテゴリーベース選考**: [IRCC – カテゴリー別選考ラウンド](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html)
- **スタートアップビザ**: [IRCC – Start-up Visa プログラム](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html)
- **就労許可**: [IRCC – 一時就労許可 資格要件](https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit/temporary/eligibility.html)\`,`,
  ],
  [
    `加拿大移民制度透明度高，具备英语能力和工作经验者获得永久居留权的可能性相对较大。请使用MoveWorth详细模拟生活费和税金，规划最佳的移居时机。\`,`,
    `加拿大移民制度透明度高，具备英语能力和工作经验者获得永久居留权的可能性相对较大。请使用MoveWorth详细模拟生活费和税金，规划最佳的移居时机。

---

### 参考资料

本文信息基于以下官方资料整理。

- **Express Entry**: [IRCC – Express Entry 官方页面](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html)
- **类别优先选拔**: [IRCC – 类别优先轮次](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html)
- **创业签证**: [IRCC – Start-up Visa 项目](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html)
- **工作许可**: [IRCC – 临时工作许可资格要求](https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit/temporary/eligibility.html)\`,`,
  ],

  // visa-gb (UK)
  [
    `The UK offers world-class opportunities in finance, tech, and academia. Use MoveWorth to compare your net income after UK taxes against other destinations.`,
    `The UK offers world-class opportunities in finance, tech, and academia. Use MoveWorth to compare your net income after UK taxes against other destinations.

---

### References

This article is based on the following official sources.

- **Skilled Worker Visa**: [GOV.UK – Skilled Worker Visa](https://www.gov.uk/skilled-worker-visa)
- **Global Talent Visa**: [GOV.UK – Global Talent Visa](https://www.gov.uk/global-talent)
- **Innovator Founder Visa**: [GOV.UK – Innovator Founder Visa](https://www.gov.uk/innovator-founder-visa)`,
  ],
  [
    `英国は金融・テクノロジー・学術分野で世界トップクラスのキャリア機会を提供します。MoveWorthで英国の税負担後の手取り収入を他の移住先と比較してみましょう。\`,`,
    `英国は金融・テクノロジー・学術分野で世界トップクラスのキャリア機会を提供します。MoveWorthで英国の税負担後の手取り収入を他の移住先と比較してみましょう。

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **Skilled Worker Visa（熟練労働者ビザ）**: [GOV.UK – Skilled Worker Visa](https://www.gov.uk/skilled-worker-visa)
- **Global Talent Visa（グローバル人材ビザ）**: [GOV.UK – Global Talent Visa](https://www.gov.uk/global-talent)
- **Innovator Founder Visa（起業家ビザ）**: [GOV.UK – Innovator Founder Visa](https://www.gov.uk/innovator-founder-visa)\`,`,
  ],
  [
    `英国在金融、科技及学术领域提供世界顶尖的职业机会。使用MoveWorth将英国税后收入与其他移居目的地进行对比，做出最优决策。\`,`,
    `英国在金融、科技及学术领域提供世界顶尖的职业机会。使用MoveWorth将英国税后收入与其他移居目的地进行对比，做出最优决策。

---

### 参考资料

本文信息基于以下官方资料整理。

- **技术工人签证（Skilled Worker Visa）**: [GOV.UK – Skilled Worker Visa](https://www.gov.uk/skilled-worker-visa)
- **全球人才签证（Global Talent Visa）**: [GOV.UK – Global Talent Visa](https://www.gov.uk/global-talent)
- **创始人签证（Innovator Founder Visa）**: [GOV.UK – Innovator Founder Visa](https://www.gov.uk/innovator-founder-visa)\`,`,
  ],
];

let count = 0;
for (const [search, replace] of replacements) {
  if (content.includes(search)) {
    content = content.replace(search, replace);
    count++;
  } else {
    console.warn(`NOT FOUND: ${search.slice(0, 80)}...`);
  }
}

writeFileSync(filePath, content, "utf8");
console.log(`Done! Applied ${count}/${replacements.length} replacements.`);

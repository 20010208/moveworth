import { readFileSync, writeFileSync } from "fs";

const filePath = "c:/Users/chiji/OneDrive/VScode用/docs/moveworth/src/data/blog-posts.ts";
let content = readFileSync(filePath, "utf8");

// References data per country
const refsData = {
  "visa-th": {
    ja: `
---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **LTR ビザ（長期滞在ビザ）**: [BOI 公式 LTR ポータル](https://ltr.boi.go.th/)
- **Thailand Privilege Card**: [タイ観光スポーツ省公認公式サイト](https://www.thailandprivilege.co.th/home)
- **就労許可（Work Permit）**: [タイ労働省 e-Work Permit システム](https://ewp.doe.go.th/)
- **電子ビザ申請**: [Thailand e-Visa 公式ポータル](https://thaievisa.go.th/)`,
    en: `

---

### References

This article is based on the following official sources.

- **LTR Visa (Long-Term Resident Visa)**: [BOI Official LTR Portal](https://ltr.boi.go.th/)
- **Thailand Privilege Card**: [Official Thailand Privilege Site (Ministry of Tourism & Sports)](https://www.thailandprivilege.co.th/home)
- **Work Permit**: [Thailand DOE e-Work Permit System](https://ewp.doe.go.th/)
- **Electronic Visa**: [Thailand e-Visa Official Portal](https://thaievisa.go.th/)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **LTR签证（长期居留签证）**: [BOI官方LTR门户](https://ltr.boi.go.th/)
- **Thailand Privilege Card**: [泰国旅游体育部认可官方网站](https://www.thailandprivilege.co.th/home)
- **工作许可（Work Permit）**: [泰国劳工部 e-Work Permit 系统](https://ewp.doe.go.th/)
- **电子签证**: [Thailand e-Visa 官方门户](https://thaievisa.go.th/)`,
  },

  "visa-kr": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **外国人ビザ・在留全般**: [Hi Korea 外国人在留ポータル](https://www.hikorea.go.kr/)
- **ビザ種別ガイド（D-8・F-2・F-5等）**: [韓国法務省出入国外国人政策本部](https://www.immigration.go.kr/)
- **韓国政府外国人サービス**: [gov.kr 外国人向けポータル](https://www.gov.kr/portal/foreigner/en/m010102)`,
    en: `

---

### References

This article is based on the following official sources.

- **Foreign Residency & Visa General**: [Hi Korea Foreign Resident Portal](https://www.hikorea.go.kr/)
- **Visa Category Guide (D-8, F-2, F-5, etc.)**: [Korea Immigration Service (Ministry of Justice)](https://www.immigration.go.kr/)
- **Korea Government Foreign Services**: [gov.kr Foreigner Portal](https://www.gov.kr/portal/foreigner/en/m010102)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **外国人居留及签证总览**: [Hi Korea 外国人居留门户](https://www.hikorea.go.kr/)
- **签证类别指南（D-8・F-2・F-5等）**: [韩国法务部出入境外国人政策本部](https://www.immigration.go.kr/)
- **韩国政府外国人服务**: [gov.kr 外国人门户](https://www.gov.kr/portal/foreigner/en/m010102)`,
  },

  "visa-tw": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **Employment Gold Card（就業金卡）**: [ゴールドカード公式ポータル（国家発展委員会）](https://goldcard.nat.gov.tw/en/)
- **Gold Card 資格要件**: [ゴールドカード 資格要件ページ](https://goldcard.nat.gov.tw/en/qualification/)
- **APRC（永久居留証）**: [内政部移民署 – APRC 申請ガイドライン](https://www.immigration.gov.tw/5475/5478/141465/141808/)`,
    en: `

---

### References

This article is based on the following official sources.

- **Employment Gold Card**: [Gold Card Official Portal (National Development Council)](https://goldcard.nat.gov.tw/en/)
- **Gold Card Eligibility**: [Gold Card Qualification Page](https://goldcard.nat.gov.tw/en/qualification/)
- **APRC (Alien Permanent Resident Certificate)**: [National Immigration Agency – APRC Guidelines](https://www.immigration.gov.tw/5475/5478/141465/141808/)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **就业金卡（Employment Gold Card）**: [金卡官方门户（国家发展委员会）](https://goldcard.nat.gov.tw/en/)
- **金卡资格要求**: [金卡资格要求页面](https://goldcard.nat.gov.tw/en/qualification/)
- **永久居留证（APRC）**: [内政部移民署 – APRC 申请指南](https://www.immigration.gov.tw/5475/5478/141465/141808/)`,
  },

  "visa-hk": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **QMAS（優秀人才入境計劃）**: [香港入境事務處 – QMAS 公式ページ](https://www.immd.gov.hk/eng/services/visas/quality_migrant_admission_scheme.html)
- **TTPS（トップタレントパス計画）**: [香港入境事務處 – TTPS 公式ページ](https://www.immd.gov.hk/eng/services/visas/TTPS.html)
- **各種人才計劃一覧**: [香港入境事務處 – 全スキーム比較](https://www.immd.gov.hk/eng/useful_information/admission-schemes-talents-professionals-entrepreneurs.html)`,
    en: `

---

### References

This article is based on the following official sources.

- **QMAS (Quality Migrant Admission Scheme)**: [HKID – QMAS Official Page](https://www.immd.gov.hk/eng/services/visas/quality_migrant_admission_scheme.html)
- **TTPS (Top Talent Pass Scheme)**: [HKID – TTPS Official Page](https://www.immd.gov.hk/eng/services/visas/TTPS.html)
- **All Talent Admission Schemes**: [HKID – Schemes Overview](https://www.immd.gov.hk/eng/useful_information/admission-schemes-talents-professionals-entrepreneurs.html)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **QMAS（优秀人才入境计划）**: [香港入境事务处 – QMAS 官方页面](https://www.immd.gov.hk/eng/services/visas/quality_migrant_admission_scheme.html)
- **TTPS（高端人才通行证计划）**: [香港入境事务处 – TTPS 官方页面](https://www.immd.gov.hk/eng/services/visas/TTPS.html)
- **各类人才计划总览**: [香港入境事务处 – 全计划比较](https://www.immd.gov.hk/eng/useful_information/admission-schemes-talents-professionals-entrepreneurs.html)`,
  },

  "visa-id": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **電子ビザ・在留許可（KITAS/KITAP）**: [インドネシア出入国管理局 e-Visa ポータル](https://evisa.imigrasi.go.id/)
- **セカンドホームビザ**: [セカンドホームビザ公式 FAQ（移民局）](https://evisa.imigrasi.go.id/front/faq/b6469147-09ae-44c0-878e-74e2c4c2c14e)`,
    en: `

---

### References

This article is based on the following official sources.

- **e-Visa, KITAS & KITAP**: [Indonesia Immigration e-Visa Portal](https://evisa.imigrasi.go.id/)
- **Second Home Visa**: [Second Home Visa Official FAQ (Immigration)](https://evisa.imigrasi.go.id/front/faq/b6469147-09ae-44c0-878e-74e2c4c2c14e)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **电子签证・KITAS/KITAP**: [印度尼西亚移民局 e-Visa 门户](https://evisa.imigrasi.go.id/)
- **第二家园签证**: [第二家园签证官方FAQ（移民局）](https://evisa.imigrasi.go.id/front/faq/b6469147-09ae-44c0-878e-74e2c4c2c14e)`,
  },

  "visa-ph": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **SRRV（特別居住退職者ビザ）**: [フィリピン退職庁（PRA）公式ページ](https://pra.gov.ph/SRRVisa)
- **9(g) 就労ビザ**: [フィリピン入国管理局（BI）– 9(g) ビザ](https://immigration.gov.ph/pre-4-arranged-employment-visa-9g/)
- **入国管理局全般**: [フィリピン入国管理局（Bureau of Immigration）](https://immigration.gov.ph/)`,
    en: `

---

### References

This article is based on the following official sources.

- **SRRV (Special Resident Retiree's Visa)**: [Philippines Retirement Authority (PRA) Official Page](https://pra.gov.ph/SRRVisa)
- **9(g) Work Visa**: [Bureau of Immigration (BI) – 9(g) Visa](https://immigration.gov.ph/pre-4-arranged-employment-visa-9g/)
- **General Immigration**: [Bureau of Immigration Philippines](https://immigration.gov.ph/)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **SRRV（特别居住退休签证）**: [菲律宾退休局（PRA）官方页面](https://pra.gov.ph/SRRVisa)
- **9(g) 工作签证**: [菲律宾移民局（BI）– 9(g) 签证](https://immigration.gov.ph/pre-4-arranged-employment-visa-9g/)
- **移民局总览**: [菲律宾移民局（Bureau of Immigration）](https://immigration.gov.ph/)`,
  },

  "visa-vn": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **出入国管理・在留許可全般**: [ベトナム公安省 出入国管理局](https://immigration.gov.vn/)
- **電子ビザ（e-Visa）**: [ベトナム公式電子ビザ申請ポータル](https://evisa.gov.vn/)
- **一時居住証（TRC）申請手続き**: [出入国管理局 – TRC 手続き詳細](https://xuatnhapcanh.gov.vn/en/tin-tuc/procedures-temporary-residence-cards-foreigners-vietnam-immigration-department-ministry)`,
    en: `

---

### References

This article is based on the following official sources.

- **Immigration & Residence General**: [Vietnam Immigration Department (Ministry of Public Security)](https://immigration.gov.vn/)
- **e-Visa**: [Vietnam Official e-Visa Portal](https://evisa.gov.vn/)
- **Temporary Residence Card (TRC)**: [Immigration Dept – TRC Application Procedures](https://xuatnhapcanh.gov.vn/en/tin-tuc/procedures-temporary-residence-cards-foreigners-vietnam-immigration-department-ministry)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **出入境管理及居留证总览**: [越南公安部 出入境管理局](https://immigration.gov.vn/)
- **电子签证（e-Visa）**: [越南官方电子签证申请门户](https://evisa.gov.vn/)
- **临时居留证（TRC）申请手续**: [出入境管理局 – TRC 手续详情](https://xuatnhapcanh.gov.vn/en/tin-tuc/procedures-temporary-residence-cards-foreigners-vietnam-immigration-department-ministry)`,
  },

  "visa-gb": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **Skilled Worker Visa（熟練労働者ビザ）**: [GOV.UK – Skilled Worker Visa](https://www.gov.uk/skilled-worker-visa)
- **Global Talent Visa（グローバル人材ビザ）**: [GOV.UK – Global Talent Visa](https://www.gov.uk/global-talent)
- **Innovator Founder Visa（起業家ビザ）**: [GOV.UK – Innovator Founder Visa](https://www.gov.uk/innovator-founder-visa)`,
    en: `

---

### References

This article is based on the following official sources.

- **Skilled Worker Visa**: [GOV.UK – Skilled Worker Visa](https://www.gov.uk/skilled-worker-visa)
- **Global Talent Visa**: [GOV.UK – Global Talent Visa](https://www.gov.uk/global-talent)
- **Innovator Founder Visa**: [GOV.UK – Innovator Founder Visa](https://www.gov.uk/innovator-founder-visa)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **技术工人签证（Skilled Worker Visa）**: [GOV.UK – Skilled Worker Visa](https://www.gov.uk/skilled-worker-visa)
- **全球人才签证（Global Talent Visa）**: [GOV.UK – Global Talent Visa](https://www.gov.uk/global-talent)
- **创始人签证（Innovator Founder Visa）**: [GOV.UK – Innovator Founder Visa](https://www.gov.uk/innovator-founder-visa)`,
  },

  "visa-de": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **熟練労働者移住ガイド全般**: [Make it in Germany – 公式移住ポータル](https://www.make-it-in-germany.com/)
- **ビザ・在留許可法令（Fachkräfteeinwanderungsgesetz）**: [BAMF – ドイツ連邦移民難民庁](https://www.bamf.de/)
- **ビザ申請・在外公館**: [ドイツ連邦外務省 – ビザ申請ガイド](https://www.auswaertiges-amt.de/en/visa-service)`,
    en: `

---

### References

This article is based on the following official sources.

- **Skilled Immigration General**: [Make it in Germany – Official Immigration Portal](https://www.make-it-in-germany.com/)
- **Skilled Immigration Act (Fachkräfteeinwanderungsgesetz)**: [BAMF – Federal Office for Migration and Refugees](https://www.bamf.de/)
- **Visa Applications & Consulates**: [German Federal Foreign Office – Visa Guide](https://www.auswaertiges-amt.de/en/visa-service)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **技术移民综合指南**: [Make it in Germany – 官方移居门户](https://www.make-it-in-germany.com/)
- **技术移民法（Fachkräfteeinwanderungsgesetz）**: [BAMF – 德国联邦移民和难民局](https://www.bamf.de/)
- **签证申请及领事馆**: [德国联邦外交部 – 签证申请指南](https://www.auswaertiges-amt.de/en/visa-service)`,
  },

  "visa-fr": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **フランスビザ申請全般**: [France-Visas 公式ポータル](https://france-visas.gouv.fr/)
- **入国後手続き（OFII）**: [OFII – フランス移民統合局](https://www.ofii.fr/)
- **タレントパスポート・長期在留許可**: [Service-Public.fr – タレントパスポート](https://www.service-public.fr/particuliers/vosdroits/F16922)`,
    en: `

---

### References

This article is based on the following official sources.

- **France Visa Applications**: [France-Visas Official Portal](https://france-visas.gouv.fr/)
- **Post-Arrival Procedures (OFII)**: [OFII – French Office for Immigration and Integration](https://www.ofii.fr/)
- **Talent Passport & Long-Stay Permits**: [Service-Public.fr – Talent Passport](https://www.service-public.fr/particuliers/vosdroits/F16922)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **法国签证申请总览**: [France-Visas 官方门户](https://france-visas.gouv.fr/)
- **入境后手续（OFII）**: [OFII – 法国移民融合局](https://www.ofii.fr/)
- **人才护照・长期居留许可**: [Service-Public.fr – 人才护照](https://www.service-public.fr/particuliers/vosdroits/F16922)`,
  },

  "visa-nl": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **高度技能外国人ビザ（Highly Skilled Migrant）**: [IND – オランダ移民局](https://ind.nl/en/residence-permits/work/highly-skilled-migrant)
- **30%税制優遇ルーリング**: [オランダ税務局（Belastingdienst）– 30%ルール](https://www.belastingdienst.nl/wps/wcm/connect/bldcontenten/belastingdienst/individuals/living_and_working/working_in_the_netherlands/you_are_coming_to_work_in_the_netherlands/30_facility_for_incoming_employees)
- **オリエンテーションビザ（求職・創業）**: [IND – オリエンテーション年ビザ](https://ind.nl/en/residence-permits/work/orientation-year-for-highly-educated-persons)`,
    en: `

---

### References

This article is based on the following official sources.

- **Highly Skilled Migrant Visa**: [IND – Immigration and Naturalisation Service](https://ind.nl/en/residence-permits/work/highly-skilled-migrant)
- **30% Tax Ruling**: [Belastingdienst – 30% Facility for Incoming Employees](https://www.belastingdienst.nl/wps/wcm/connect/bldcontenten/belastingdienst/individuals/living_and_working/working_in_the_netherlands/you_are_coming_to_work_in_the_netherlands/30_facility_for_incoming_employees)
- **Orientation Year Visa (Job Search / Startup)**: [IND – Orientation Year for Highly Educated Persons](https://ind.nl/en/residence-permits/work/orientation-year-for-highly-educated-persons)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **高技能移民签证（Highly Skilled Migrant）**: [IND – 荷兰移民归化局](https://ind.nl/en/residence-permits/work/highly-skilled-migrant)
- **30%税收优惠**: [荷兰税务局（Belastingdienst）– 30%规则](https://www.belastingdienst.nl/wps/wcm/connect/bldcontenten/belastingdienst/individuals/living_and_working/working_in_the_netherlands/you_are_coming_to_work_in_the_netherlands/30_facility_for_incoming_employees)
- **定向签证（求职/创业）**: [IND – 高学历人才定向年签证](https://ind.nl/en/residence-permits/work/orientation-year-for-highly-educated-persons)`,
  },

  "visa-ch": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **在留許可・ビザ全般（SEM）**: [スイス国家移民庁（SEM）公式サイト](https://www.sem.admin.ch/sem/en/home/themen/aufenthalt.html)
- **EU/EFTA 以外の外国人向け情報**: [SEM – 第三国国民の就労・在留](https://www.sem.admin.ch/sem/en/home/themen/aufenthalt/nicht_eu_efta.html)
- **スイス就労・投資誘致**: [Switzerland Global Enterprise（公式貿易投資促進機関）](https://www.s-ge.com/)`,
    en: `

---

### References

This article is based on the following official sources.

- **Residence Permits & Visas (SEM)**: [State Secretariat for Migration (SEM)](https://www.sem.admin.ch/sem/en/home/themen/aufenthalt.html)
- **Non-EU/EFTA Nationals**: [SEM – Work & Residence for Third-Country Nationals](https://www.sem.admin.ch/sem/en/home/themen/aufenthalt/nicht_eu_efta.html)
- **Working & Investing in Switzerland**: [Switzerland Global Enterprise (Official Trade & Investment Promotion)](https://www.s-ge.com/)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **居留许可及签证总览（SEM）**: [瑞士国家移民局（SEM）官方网站](https://www.sem.admin.ch/sem/en/home/themen/aufenthalt.html)
- **非欧盟/欧洲自由贸易联盟公民**: [SEM – 第三国公民就业与居留](https://www.sem.admin.ch/sem/en/home/themen/aufenthalt/nicht_eu_efta.html)
- **瑞士就业与投资**: [瑞士全球企业（官方贸易与投资促进机构）](https://www.s-ge.com/)`,
  },

  "visa-au": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **技能移民ビザ全般**: [オーストラリア内務省 – 技能移民ビザ](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189)
- **SkillSelect EOI**: [SkillSelect – 技能ビザ EOI 登録](https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect)
- **職業リスト（MLTSSL/STSOL等）**: [内務省 – 技能職業リスト](https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list)`,
    en: `

---

### References

This article is based on the following official sources.

- **Skilled Migration Visas**: [Australian Department of Home Affairs – Skilled Independent Visa](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189)
- **SkillSelect EOI**: [SkillSelect – Expression of Interest Registration](https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect)
- **Occupation Lists (MLTSSL/STSOL etc.)**: [Home Affairs – Skilled Occupation List](https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **技术移民签证总览**: [澳大利亚内政部 – 技术独立签证](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189)
- **SkillSelect意向书**: [SkillSelect – 意向书注册](https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect)
- **职业清单（MLTSSL/STSOL等）**: [内政部 – 技术职业清单](https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list)`,
  },

  "visa-nz": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [ニュージーランド移民局（Immigration New Zealand）](https://www.immigration.govt.nz/)
- **グリーンリスト職業（即時 PR 対象）**: [INZ – グリーンリスト職業一覧](https://www.immigration.govt.nz/new-zealand-visas/preparing-a-visa-application/working-in-nz/qualifications-and-work-experience/green-list-occupations)
- **技能移民カテゴリ**: [INZ – Skilled Migrant Category](https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/visa-factsheet/skilled-migrant-category-resident-visa)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visas & Residence General**: [Immigration New Zealand (INZ)](https://www.immigration.govt.nz/)
- **Green List Occupations (Direct PR Pathway)**: [INZ – Green List Occupation Search](https://www.immigration.govt.nz/new-zealand-visas/preparing-a-visa-application/working-in-nz/qualifications-and-work-experience/green-list-occupations)
- **Skilled Migrant Category**: [INZ – Skilled Migrant Category Resident Visa](https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/visa-factsheet/skilled-migrant-category-resident-visa)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留总览**: [新西兰移民局（Immigration New Zealand）](https://www.immigration.govt.nz/)
- **绿色清单职业（直通PR路径）**: [INZ – 绿色清单职业查询](https://www.immigration.govt.nz/new-zealand-visas/preparing-a-visa-application/working-in-nz/qualifications-and-work-experience/green-list-occupations)
- **技能移民类别**: [INZ – 技能移民类别居民签证](https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/visa-factsheet/skilled-migrant-category-resident-visa)`,
  },

  "visa-ae": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ゴールデンビザ（長期在留ビザ）**: [UAE 連邦身分市民庁（ICP）– ゴールデンビザ](https://icp.gov.ae/en/ResidencyAndCitizenship/GoldenVisa)
- **ドバイ在留ビザ・手続き全般**: [GDRFA ドバイ – 在留手続きポータル](https://www.gdrfad.gov.ae/)
- **UAE 政府公式ポータル**: [UAE 政府公式サービスガイド](https://u.ae/en/information-and-services/visa-and-emirates-id)`,
    en: `

---

### References

This article is based on the following official sources.

- **Golden Visa (Long-Term Residency)**: [ICP – UAE Golden Visa](https://icp.gov.ae/en/ResidencyAndCitizenship/GoldenVisa)
- **Dubai Residency & Procedures**: [GDRFA Dubai – Residency Portal](https://www.gdrfad.gov.ae/)
- **UAE Government Official Portal**: [UAE Government – Visa and Emirates ID Services](https://u.ae/en/information-and-services/visa-and-emirates-id)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **黄金签证（长期居留签证）**: [ICP – 阿联酋黄金签证](https://icp.gov.ae/en/ResidencyAndCitizenship/GoldenVisa)
- **迪拜居留手续总览**: [GDRFA迪拜 – 居留手续门户](https://www.gdrfad.gov.ae/)
- **阿联酋政府官方门户**: [阿联酋政府 – 签证与酋长国身份证服务](https://u.ae/en/information-and-services/visa-and-emirates-id)`,
  },

  "visa-jp": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **在留資格・ビザ全般**: [出入国在留管理庁（入管庁）公式サイト](https://www.moj.go.jp/isa/)
- **高度専門職ポイント制**: [入管庁 – 高度人材ポイント制](https://www.moj.go.jp/isa/publications/materials/newimmiact_3_point_index.html)
- **外国人生活支援ポータル**: [外国人在留支援センター（FRESC）](https://www.fresc.moj.go.jp/)`,
    en: `

---

### References

This article is based on the following official sources.

- **Residence Status & Visa General**: [Immigration Services Agency of Japan (ISA)](https://www.moj.go.jp/isa/)
- **Highly Skilled Professional Points System**: [ISA – Highly Skilled Foreign Professional Points-Based System](https://www.moj.go.jp/isa/publications/materials/newimmiact_3_point_index.html)
- **Foreign Resident Support Portal**: [Foreign Residents Support Center (FRESC)](https://www.fresc.moj.go.jp/)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **在留资格及签证总览**: [出入境在留管理厅（入管厅）官方网站](https://www.moj.go.jp/isa/)
- **高度专业人才积分制**: [入管厅 – 高度人才积分制](https://www.moj.go.jp/isa/publications/materials/newimmiact_3_point_index.html)
- **外籍居民生活支援门户**: [外国人在留支援中心（FRESC）](https://www.fresc.moj.go.jp/)`,
  },

  "visa-pt": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般（AIMA）**: [AIMA – ポルトガル移民・亡命局](https://aima.gov.pt/)
- **デジタルノマドビザ（D8）**: [ポルトガル外務省 – D8 デジタルノマドビザ](https://vistos.mne.gov.pt/en/national-visas/required-documentation/remote-working-or-digital-nomad)
- **NHR 税制（IFICI）**: [ポルトガル税務関税局（AT）– IFICI](https://info.portaldasfinancas.gov.pt/en/Pages/IFICI.aspx)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits (AIMA)**: [AIMA – Agency for Integration, Migration and Asylum](https://aima.gov.pt/)
- **Digital Nomad Visa (D8)**: [MNE – D8 Remote Working / Digital Nomad Visa](https://vistos.mne.gov.pt/en/national-visas/required-documentation/remote-working-or-digital-nomad)
- **NHR Tax Regime (IFICI)**: [AT – Portuguese Tax and Customs Authority – IFICI](https://info.portaldasfinancas.gov.pt/en/Pages/IFICI.aspx)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览（AIMA）**: [AIMA – 葡萄牙移民与庇护局](https://aima.gov.pt/)
- **数字游民签证（D8）**: [葡萄牙外交部 – D8 远程工作/数字游民签证](https://vistos.mne.gov.pt/en/national-visas/required-documentation/remote-working-or-digital-nomad)
- **NHR税制（IFICI）**: [葡萄牙税务海关局（AT）– IFICI](https://info.portaldasfinancas.gov.pt/en/Pages/IFICI.aspx)`,
  },

  "visa-es": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ申請全般**: [スペイン外務省 – コンスラ・ビザ情報](https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Visados.aspx)
- **デジタルノマドビザ（起業家法）**: [スペイン政府 – スタートアップ法・デジタルノマドビザ](https://www.startups.gob.es/en/)
- **非営利居住ビザ（Non-Lucrative）**: [スペイン外務省 – 非営利居住ビザ](https://www.exteriores.gob.es/Consulados/en/Paginas/ConsularServices.aspx)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visa Applications General**: [Spanish Ministry of Foreign Affairs – Consular Visa Info](https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Visados.aspx)
- **Digital Nomad Visa (Startup Law)**: [Spanish Government – Startup Act & Digital Nomad Visa](https://www.startups.gob.es/en/)
- **Non-Lucrative Residence Visa**: [Spanish MFA – Non-Lucrative Visa](https://www.exteriores.gob.es/Consulados/en/Paginas/ConsularServices.aspx)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证申请总览**: [西班牙外交部 – 领事签证信息](https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Visados.aspx)
- **数字游民签证（创业法）**: [西班牙政府 – 创业法与数字游民签证](https://www.startups.gob.es/en/)
- **非营利居留签证**: [西班牙外交部 – 非营利居留签证](https://www.exteriores.gob.es/Consulados/en/Paginas/ConsularServices.aspx)`,
  },

  "visa-ge": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ジョージア電子ビザ**: [ジョージア外務省 – 電子ビザポータル](https://www.evisa.gov.ge/)
- **税務・起業情報**: [ジョージア国税局（Revenue Service）](https://rs.ge/en)
- **在留・移民情報**: [ジョージア法務省 – 市民サービス庁](https://sda.gov.ge/)`,
    en: `

---

### References

This article is based on the following official sources.

- **Georgia e-Visa**: [Georgian Ministry of Foreign Affairs – e-Visa Portal](https://www.evisa.gov.ge/)
- **Tax & Business Registration**: [Georgia Revenue Service](https://rs.ge/en)
- **Residence & Migration**: [Georgian Ministry of Justice – Public Service Hall](https://sda.gov.ge/)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **格鲁吉亚电子签证**: [格鲁吉亚外交部 – 电子签证门户](https://www.evisa.gov.ge/)
- **税务及企业注册**: [格鲁吉亚税务总局（Revenue Service）](https://rs.ge/en)
- **居留及移民信息**: [格鲁吉亚司法部 – 公共服务大厅](https://sda.gov.ge/)`,
  },

  "visa-ie": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [アイルランド移民局（Irish Immigration Service）](https://www.irishimmigration.ie/)
- **クリティカルスキル就労許可**: [企業・貿易・雇用省 – Critical Skills Employment Permit](https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/)
- **税務登録（myAccount）**: [アイルランド税務庁（Revenue）– 個人税務登録](https://www.revenue.ie/en/online-services/services/common/manage-your-account.aspx)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits General**: [Irish Immigration Service](https://www.irishimmigration.ie/)
- **Critical Skills Employment Permit**: [Dept. of Enterprise – Critical Skills Employment Permit](https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/)
- **Tax Registration (myAccount)**: [Revenue Ireland – Personal Tax Registration](https://www.revenue.ie/en/online-services/services/common/manage-your-account.aspx)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [爱尔兰移民局（Irish Immigration Service）](https://www.irishimmigration.ie/)
- **关键技能就业许可**: [企业部 – 关键技能就业许可](https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/)
- **税务注册（myAccount）**: [爱尔兰税务局（Revenue）– 个人税务注册](https://www.revenue.ie/en/online-services/services/common/manage-your-account.aspx)`,
  },

  "visa-se": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [スウェーデン移民局（Migrationsverket）](https://www.migrationsverket.se/en/Privatpersoners/Arbeta-i-Sverige.html)
- **税務登録・番号取得**: [スウェーデン国税庁（Skatteverket）– 移住者向け情報](https://www.skatteverket.se/servicelankar/otherlanguages/inenglish/individualsandemployees/movingtosweden.4.7be5268414bea064694c3a.html)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits General**: [Swedish Migration Agency (Migrationsverket)](https://www.migrationsverket.se/en/Privatpersoners/Arbeta-i-Sverige.html)
- **Tax Registration**: [Swedish Tax Agency (Skatteverket) – Moving to Sweden](https://www.skatteverket.se/servicelankar/otherlanguages/inenglish/individualsandemployees/movingtosweden.4.7be5268414bea064694c3a.html)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [瑞典移民局（Migrationsverket）](https://www.migrationsverket.se/en/Privatpersoners/Arbeta-i-Sverige.html)
- **税务注册**: [瑞典税务局（Skatteverket）– 移居瑞典指南](https://www.skatteverket.se/servicelankar/otherlanguages/inenglish/individualsandemployees/movingtosweden.4.7be5268414bea064694c3a.html)`,
  },

  "visa-no": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [ノルウェー出入国管理局（UDI）](https://www.udi.no/en/)
- **税務登録・番号取得**: [Altinn – ノルウェー電子行政サービス（税務含む）](https://www.altinn.no/en/)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits General**: [Norwegian Directorate of Immigration (UDI)](https://www.udi.no/en/)
- **Tax Registration**: [Altinn – Norwegian Digital Government Services (including tax)](https://www.altinn.no/en/)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [挪威移民局（UDI）](https://www.udi.no/en/)
- **税务注册**: [Altinn – 挪威电子政务服务（含税务）](https://www.altinn.no/en/)`,
  },

  "visa-dk": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [SIRI – デンマーク国際採用・統合局](https://www.nyidanmark.dk/en-GB)
- **税務登録・番号取得**: [SKAT – デンマーク税務庁（個人税務情報）](https://www.skat.dk/en/individuals)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits General**: [SIRI – Danish Agency for International Recruitment and Integration](https://www.nyidanmark.dk/en-GB)
- **Tax Registration**: [SKAT – Danish Tax Agency (Individual Tax Information)](https://www.skat.dk/en/individuals)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [SIRI – 丹麦国际招聘与融合局](https://www.nyidanmark.dk/en-GB)
- **税务注册**: [SKAT – 丹麦税务局（个人税务信息）](https://www.skat.dk/en/individuals)`,
  },

  "visa-br": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ申請全般**: [ブラジル連邦警察（Polícia Federal）– ビザ・在留情報](https://www.gov.br/pf/en/subjects/foreigners)
- **電子ビザ（e-Visto）**: [ブラジル外務省 – 電子ビザポータル](https://evisa.itamaraty.gov.br/)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visa Applications General**: [Brazil Federal Police (Polícia Federal) – Foreigners](https://www.gov.br/pf/en/subjects/foreigners)
- **e-Visa**: [Brazilian Ministry of Foreign Affairs – e-Visa Portal](https://evisa.itamaraty.gov.br/)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证申请总览**: [巴西联邦警察（Polícia Federal）– 外籍人士信息](https://www.gov.br/pf/en/subjects/foreigners)
- **电子签证（e-Visto）**: [巴西外交部 – 电子签证门户](https://evisa.itamaraty.gov.br/)`,
  },

  "visa-co": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ申請全般**: [コロンビア外務省 – ビザポータル（Cancillería）](https://www.cancilleria.gov.co/tramites_servicios/visas)
- **在留外国人管理**: [コロンビア移民局（Migración Colombia）](https://www.migracioncolombia.gov.co/)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visa Applications General**: [Colombian Ministry of Foreign Affairs – Visa Portal](https://www.cancilleria.gov.co/tramites_servicios/visas)
- **Foreign Resident Management**: [Migración Colombia](https://www.migracioncolombia.gov.co/)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证申请总览**: [哥伦比亚外交部 – 签证门户（Cancillería）](https://www.cancilleria.gov.co/tramites_servicios/visas)
- **外籍居民管理**: [哥伦比亚移民局（Migración Colombia）](https://www.migracioncolombia.gov.co/)`,
  },

  "visa-gr": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [ギリシャ移民・庇護省 公式サイト](https://migration.gov.gr/en/)
- **デジタルノマドビザ**: [ギリシャ政府 – デジタルノマドビザ情報](https://migration.gov.gr/digital-nomads-en/)
- **ゴールデンビザ（不動産投資）**: [Enterprise Greece – ゴールデンビザプログラム](https://www.enterprisegreece.gov.gr/en/invest-in-greece/golden-visa-programme)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits General**: [Greek Ministry of Migration and Asylum](https://migration.gov.gr/en/)
- **Digital Nomad Visa**: [Greek Government – Digital Nomad Visa](https://migration.gov.gr/digital-nomads-en/)
- **Golden Visa (Real Estate Investment)**: [Enterprise Greece – Golden Visa Programme](https://www.enterprisegreece.gov.gr/en/invest-in-greece/golden-visa-programme)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [希腊移民与庇护部官方网站](https://migration.gov.gr/en/)
- **数字游民签证**: [希腊政府 – 数字游民签证信息](https://migration.gov.gr/digital-nomads-en/)
- **黄金签证（房地产投资）**: [Enterprise Greece – 黄金签证项目](https://www.enterprisegreece.gov.gr/en/invest-in-greece/golden-visa-programme)`,
  },

  "visa-it": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ申請全般**: [イタリア外務省 – ビザ申請ポータル](https://vistoperitalia.esteri.it/home/en)
- **デジタルノマドビザ**: [イタリア外務省 – 自律的・自営業者ビザ（リモートワーク）](https://vistoperitalia.esteri.it/home/en#BMresidenzaElettronica)
- **フラットタックス制度（新規居住者向け）**: [イタリア歳入庁（Agenzia delle Entrate）– フラットタックス](https://www.agenziaentrate.gov.it/portale/web/english/nse/individuals/flat-tax-for-new-residents)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visa Applications General**: [Italian Ministry of Foreign Affairs – Visa Application Portal](https://vistoperitalia.esteri.it/home/en)
- **Digital Nomad / Remote Work Visa**: [MFA Italy – Self-Employment / Autonomous Worker Visa](https://vistoperitalia.esteri.it/home/en#BMresidenzaElettronica)
- **Flat Tax Regime (New Residents)**: [Agenzia delle Entrate – Flat Tax for New Residents](https://www.agenziaentrate.gov.it/portale/web/english/nse/individuals/flat-tax-for-new-residents)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证申请总览**: [意大利外交部 – 签证申请门户](https://vistoperitalia.esteri.it/home/en)
- **数字游民/远程工作签证**: [意大利外交部 – 自雇/自主工作签证](https://vistoperitalia.esteri.it/home/en#BMresidenzaElettronica)
- **统一税制（新居民）**: [意大利税务局（Agenzia delle Entrate）– 新居民统一税](https://www.agenziaentrate.gov.it/portale/web/english/nse/individuals/flat-tax-for-new-residents)`,
  },

  "visa-mt": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **マルタ永住プログラム（MPRP）**: [Residency Malta Agency 公式サイト](https://residencymalta.gov.mt/)
- **グローバル居住プログラム（GRP）**: [CFR – グローバル居住プログラム](https://cfr.gov.mt/en/Pages/CFR/Global-Residence-Programme.aspx)
- **ビザ・在留許可全般**: [Identity Malta – 市民権・在留許可](https://identitymalta.com/)`,
    en: `

---

### References

This article is based on the following official sources.

- **Malta Permanent Residence Programme (MPRP)**: [Residency Malta Agency](https://residencymalta.gov.mt/)
- **Global Residence Programme (GRP)**: [CFR – Global Residence Programme](https://cfr.gov.mt/en/Pages/CFR/Global-Residence-Programme.aspx)
- **Visas & Residence Permits General**: [Identity Malta – Citizenship & Residence](https://identitymalta.com/)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **马耳他永久居留项目（MPRP）**: [Residency Malta Agency 官方网站](https://residencymalta.gov.mt/)
- **全球居住项目（GRP）**: [CFR – 全球居住项目](https://cfr.gov.mt/en/Pages/CFR/Global-Residence-Programme.aspx)
- **签证及居留许可总览**: [Identity Malta – 国籍与居留](https://identitymalta.com/)`,
  },

  "visa-za": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [南アフリカ内務省（DHA）– ビザ・許可情報](https://www.dha.gov.za/index.php/immigration-services)
- **ビザ申請サービス**: [VFS Global – 南アフリカビザ申請センター](https://www.vfsglobal.com/en/individuals/index.html)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visas & Permits General**: [South Africa Department of Home Affairs (DHA) – Immigration Services](https://www.dha.gov.za/index.php/immigration-services)
- **Visa Application Services**: [VFS Global – South Africa Visa Application Centre](https://www.vfsglobal.com/en/individuals/index.html)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [南非内政部（DHA）– 移民服务](https://www.dha.gov.za/index.php/immigration-services)
- **签证申请服务**: [VFS Global – 南非签证申请中心](https://www.vfsglobal.com/en/individuals/index.html)`,
  },

  "visa-fi": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [フィンランド移民局（Migri）公式サイト](https://migri.fi/en/home)
- **オンライン申請（Enter Finland）**: [Enter Finland – オンライン在留許可申請](https://enterfinland.fi/)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits General**: [Finnish Immigration Service (Migri)](https://migri.fi/en/home)
- **Online Applications (Enter Finland)**: [Enter Finland – Online Residence Permit Applications](https://enterfinland.fi/)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [芬兰移民局（Migri）官方网站](https://migri.fi/en/home)
- **在线申请（Enter Finland）**: [Enter Finland – 居留许可在线申请](https://enterfinland.fi/)`,
  },

  "visa-at": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [オーストリア移住ポータル（migration.gv.at）](https://www.migration.gv.at/en/)
- **レッド・ホワイト・レッドカード（RWR）**: [migration.gv.at – RWR カード申請ガイド](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/red-white-red-card/)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits General**: [Austria Migration Portal (migration.gv.at)](https://www.migration.gv.at/en/)
- **Red-White-Red Card (RWR Card)**: [migration.gv.at – RWR Card Application Guide](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/red-white-red-card/)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [奥地利移民门户（migration.gv.at）](https://www.migration.gv.at/en/)
- **红-白-红卡（RWR卡）**: [migration.gv.at – RWR卡申请指南](https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/red-white-red-card/)`,
  },

  "visa-cz": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [チェコ内務省（MV ČR）– 外国人在留情報](https://www.mvcr.cz/mvcren/article/immigration.aspx)
- **従業員カード・ブルーカード**: [チェコ内務省 – 雇用・就労ビザ](https://www.mvcr.cz/mvcren/article/long-term-residence.aspx)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits General**: [Czech Ministry of Interior (MV ČR) – Foreign Nationals](https://www.mvcr.cz/mvcren/article/immigration.aspx)
- **Employee Card & EU Blue Card**: [Czech Ministry of Interior – Employment & Work Visas](https://www.mvcr.cz/mvcren/article/long-term-residence.aspx)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [捷克内政部（MV ČR）– 外籍人士居留信息](https://www.mvcr.cz/mvcren/article/immigration.aspx)
- **雇员卡及欧盟蓝卡**: [捷克内政部 – 就业与工作签证](https://www.mvcr.cz/mvcren/article/long-term-residence.aspx)`,
  },

  "visa-cn": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ申請全般**: [中国ビザ申請サービスセンター（CVASC）](https://www.visaforchina.cn/)
- **外国人在留・就労許可**: [国家移民管理局（NIA）](https://www.nia.gov.cn/n741440/index.html)
- **外国人就業許可（Work Permit）**: [中国人力資源社会保障部 – 外国人就業管理](http://www.mohrss.gov.cn/)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visa Applications General**: [Chinese Visa Application Service Center (CVASC)](https://www.visaforchina.cn/)
- **Foreign Residence & Work Authorization**: [National Immigration Administration (NIA)](https://www.nia.gov.cn/n741440/index.html)
- **Work Permit for Foreigners**: [Ministry of Human Resources and Social Security – Foreign Employment](http://www.mohrss.gov.cn/)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证申请总览**: [中国签证申请服务中心（CVASC）](https://www.visaforchina.cn/)
- **外籍人士居留及工作许可**: [国家移民管理局（NIA）](https://www.nia.gov.cn/n741440/index.html)
- **外国人就业许可证**: [人力资源和社会保障部 – 外国人就业管理](http://www.mohrss.gov.cn/)`,
  },

  "visa-in": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **インドビザ申請（e-Visa含む）**: [Indian Visa Online 公式ポータル](https://indianvisaonline.gov.in/)
- **FRRO（外国人地域登録局）オンライン**: [FRRO / FRO – オンライン在留管理サービス](https://indianfrro.gov.in/)`,
    en: `

---

### References

This article is based on the following official sources.

- **India Visa Applications (including e-Visa)**: [Indian Visa Online Official Portal](https://indianvisaonline.gov.in/)
- **FRRO (Foreigners Regional Registration Office) Online**: [FRRO / FRO – Online Residence Management Services](https://indianfrro.gov.in/)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **印度签证申请（含电子签证）**: [印度签证在线官方门户](https://indianvisaonline.gov.in/)
- **外籍人士地区登记处（FRRO）在线服务**: [FRRO / FRO – 居留在线管理服务](https://indianfrro.gov.in/)`,
  },

  "visa-mx": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [メキシコ国立移民局（INM）公式サイト](https://www.inm.gob.mx/)
- **ビザカテゴリ詳細**: [メキシコ外務省 – ビザ情報ポータル](https://www.gob.mx/sre/documentos/visas-para-mexico)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits General**: [Mexico National Immigration Institute (INM)](https://www.inm.gob.mx/)
- **Visa Category Details**: [Mexican Ministry of Foreign Affairs – Visa Information Portal](https://www.gob.mx/sre/documentos/visas-para-mexico)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [墨西哥国家移民局（INM）官方网站](https://www.inm.gob.mx/)
- **签证类别详情**: [墨西哥外交部 – 签证信息门户](https://www.gob.mx/sre/documentos/visas-para-mexico)`,
  },

  "visa-ar": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **ビザ・在留許可全般**: [アルゼンチン国立移民局（Migraciones）](https://www.argentina.gob.ar/interior/migraciones)
- **オンライン在留申請**: [RadEx – アルゼンチン在留オンライン申請ポータル](https://www.argentina.gob.ar/migraciones/radicacion-electronica)`,
    en: `

---

### References

This article is based on the following official sources.

- **Visas & Residence Permits General**: [Argentina National Directorate of Migration (Migraciones)](https://www.argentina.gob.ar/interior/migraciones)
- **Online Residence Applications**: [RadEx – Argentina Online Residency Application Portal](https://www.argentina.gob.ar/migraciones/radicacion-electronica)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **签证及居留许可总览**: [阿根廷国家移民局（Migraciones）](https://www.argentina.gob.ar/interior/migraciones)
- **居留在线申请**: [RadEx – 阿根廷居留在线申请门户](https://www.argentina.gob.ar/migraciones/radicacion-electronica)`,
  },

  "visa-tr": {
    ja: `

---

### 参考資料

本記事の情報は以下の公式資料をもとに作成しています。

- **在留許可（e-ikamet）オンライン申請**: [トルコ出入国管理局 – e-ikamet ポータル](https://e-ikamet.goc.gov.tr/)
- **トルコ政府公式サービス**: [e-Devlet（トルコ電子政府ポータル）](https://www.turkiye.gov.tr/)
- **国籍取得（市民権投資）**: [トルコ投資局 – 投資による市民権プログラム](https://www.invest.gov.tr/en/pages/citizenship.aspx)`,
    en: `

---

### References

This article is based on the following official sources.

- **Residence Permit (e-ikamet) Online Application**: [Turkish Directorate General of Migration Management – e-ikamet Portal](https://e-ikamet.goc.gov.tr/)
- **Turkish Government Official Services**: [e-Devlet – Turkey's E-Government Portal](https://www.turkiye.gov.tr/)
- **Citizenship by Investment**: [Turkey Investment Office – Citizenship by Investment Program](https://www.invest.gov.tr/en/pages/citizenship.aspx)`,
    zh: `

---

### 参考资料

本文信息基于以下官方资料整理。

- **居留许可（e-ikamet）在线申请**: [土耳其移民管理总局 – e-ikamet 门户](https://e-ikamet.goc.gov.tr/)
- **土耳其政府官方服务**: [e-Devlet – 土耳其电子政务门户](https://www.turkiye.gov.tr/)
- **投资入籍**: [土耳其投资局 – 投资入籍项目](https://www.invest.gov.tr/en/pages/citizenship.aspx)`,
  },
};

// Helper to find and replace ending of a language section
function appendToLanguageSection(fileContent, slug, lang, nextLang, refText) {
  const slugIdx = fileContent.indexOf(`slug: "${slug}"`);
  if (slugIdx === -1) {
    console.warn(`Slug not found: ${slug}`);
    return fileContent;
  }

  // Find the section boundary
  const nextSectionIdx = fileContent.indexOf("  },\n  {", slugIdx);
  const sectionEnd = nextSectionIdx > 0 ? nextSectionIdx + 5 : fileContent.length;
  const sectionStart = slugIdx;

  const section = fileContent.slice(sectionStart, sectionEnd);

  let langEndPattern;
  if (nextLang) {
    langEndPattern = `\`,\n      ${nextLang}:`;
  } else {
    // zh is the last language field
    langEndPattern = null;
  }

  let langIdx;
  if (lang === "ja") {
    langIdx = section.indexOf("ja: `");
  } else if (lang === "en") {
    langIdx = section.indexOf("en: `");
  } else {
    langIdx = section.lastIndexOf("zh: `");
  }

  if (langIdx === -1) {
    console.warn(`Language '${lang}' not found in ${slug}`);
    return fileContent;
  }

  const langContentStart = langIdx + 5; // skip 'ja: `' etc
  const langContent = section.slice(langContentStart);

  let endIdx;
  if (langEndPattern) {
    endIdx = langContent.indexOf(langEndPattern);
  } else {
    // zh: find the last backtick-comma pattern
    endIdx = langContent.lastIndexOf("`,");
  }

  if (endIdx === -1) {
    console.warn(`Could not find end of '${lang}' in ${slug}`);
    return fileContent;
  }

  // The actual ending text (before the closing backtick)
  const actualEnding = langContent.slice(endIdx - 80, endIdx);
  const insertionPoint = sectionStart + langContentStart + endIdx;

  // Insert the reference text before the closing backtick
  const newContent =
    fileContent.slice(0, insertionPoint) +
    refText +
    fileContent.slice(insertionPoint);

  console.log(`✅ ${slug} [${lang}]: appended references`);
  return newContent;
}

// Check which slugs already have references
function hasReferences(fileContent, slug) {
  const slugIdx = fileContent.indexOf(`slug: "${slug}"`);
  if (slugIdx === -1) return false;
  const nextSectionIdx = fileContent.indexOf("  },\n  {", slugIdx);
  const sectionEnd = nextSectionIdx > 0 ? nextSectionIdx + 5 : fileContent.length;
  const section = fileContent.slice(slugIdx, sectionEnd);
  return section.includes("### 参考資料") || section.includes("### References");
}

let applied = 0;
let skipped = 0;

for (const [slug, refs] of Object.entries(refsData)) {
  if (hasReferences(content, slug)) {
    console.log(`⏭️  ${slug}: already has references, skipping`);
    skipped++;
    continue;
  }

  content = appendToLanguageSection(content, slug, "ja", "en", refs.ja);
  content = appendToLanguageSection(content, slug, "en", "zh", refs.en);
  content = appendToLanguageSection(content, slug, "zh", null, refs.zh);
  applied++;
}

writeFileSync(filePath, content, "utf8");
console.log(`\nDone! Applied: ${applied}, Skipped (already done): ${skipped}`);

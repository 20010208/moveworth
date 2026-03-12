// 留学情報データ（2026年3月時点）

export interface StudyAbroadData {
  code: string;
  overview: { ja: string; en: string; zh: string };
  studentVisa: {
    name: { ja: string; en: string; zh: string };
    requirements: { ja: string[]; en: string[]; zh: string[] };
    duration: { ja: string; en: string; zh: string };
    cost: { ja: string; en: string; zh: string };
  };
  costs: {
    tuitionMin: number;    // 年間学費・最低（現地通貨）
    tuitionMax: number;    // 年間学費・最高（現地通貨）
    livingMin: number;     // 月額生活費・最低（現地通貨）
    livingMax: number;     // 月額生活費・最高（現地通貨）
    currency: string;
    currencySymbol: string;
  };
  popularCities: { ja: string[]; en: string[]; zh: string[] };
  popularUniversities: { ja: string[]; en: string[]; zh: string[] };
  tips: { ja: string[]; en: string[]; zh: string[] };
  japaneseInfo: { ja: string; en: string; zh: string };
}

export const studyAbroadData: Record<string, StudyAbroadData> = {
  MY: {
    code: "MY",
    overview: {
      ja: "マレーシアは日本から近く、物価が安く、英語環境で学べることから日本人留学生に人気の高い国です。「留学するならマレーシア」という言葉があるほど、コストパフォーマンスに優れた留学先として知られています。多民族・多文化社会のため、英語・中国語・マレー語が日常的に使われており、語学の習得にも適した環境です。",
      en: "Malaysia is one of the most popular study abroad destinations for Japanese students, thanks to its proximity to Japan, low cost of living, and English-language education environment. The country's multicultural society means English, Chinese, and Malay are all widely spoken, making it an ideal place to develop language skills.",
      zh: "马来西亚因距日本近、生活费用低、可以英语学习等优势，深受日本留学生欢迎。多民族、多元文化的社会环境使英语、中文和马来语均广泛使用，是学习语言的理想之地。",
    },
    studentVisa: {
      name: { ja: "学生パス（Student Pass）", en: "Student Pass", zh: "学生签证（Student Pass）" },
      requirements: {
        ja: ["入学許可書（Offer Letter）", "パスポート（有効期限18ヶ月以上）", "健康診断書", "経費証明書（保護者の場合は保護者の収入証明）", "証明写真"],
        en: ["Offer Letter from institution", "Passport (valid for 18+ months)", "Medical certificate", "Proof of financial support", "Passport photos"],
        zh: ["院校录取通知书", "护照（有效期18个月以上）", "健康证明", "经济担保证明", "证件照"],
      },
      duration: { ja: "就学期間中（通常1〜2年）", en: "Duration of study (typically 1–2 years)", zh: "学习期间（通常1至2年）" },
      cost: { ja: "約RM500〜1,500（学校により異なる）", en: "Approx. RM500–1,500 depending on institution", zh: "约RM500至1,500（因学校而异）" },
    },
    costs: {
      tuitionMin: 15000,
      tuitionMax: 60000,
      livingMin: 2000,
      livingMax: 5000,
      currency: "MYR",
      currencySymbol: "RM",
    },
    popularCities: {
      ja: ["クアラルンプール", "ペナン", "ジョホールバル"],
      en: ["Kuala Lumpur", "Penang", "Johor Bahru"],
      zh: ["吉隆坡", "槟城", "新山"],
    },
    popularUniversities: {
      ja: ["マラヤ大学（UM）", "マレーシア国民大学（UKM）", "マレーシア理科大学（USM）", "テイラーズ大学", "モナッシュ大学マレーシア校"],
      en: ["University of Malaya (UM)", "Universiti Kebangsaan Malaysia (UKM)", "Universiti Sains Malaysia (USM)", "Taylor's University", "Monash University Malaysia"],
      zh: ["马来亚大学（UM）", "马来西亚国立大学（UKM）", "马来西亚理科大学（USM）", "泰莱大学", "莫纳什大学马来西亚分校"],
    },
    tips: {
      ja: ["英語語学学校（ESL）からスタートする人が多い", "生活費は東南アジアの中でも安い部類", "ハラール食が多いため食文化に慣れが必要", "交通手段はGrabが便利"],
      en: ["Many students start with an ESL language program", "Cost of living is low even by Southeast Asian standards", "Halal food is dominant — good to adjust to the local food culture", "Grab is the most convenient transport option"],
      zh: ["许多学生从ESL语言课程开始", "生活费即使在东南亚也算低廉", "清真食品为主，需适应当地饮食文化", "Grab是最方便的出行方式"],
    },
    japaneseInfo: {
      ja: "クアラルンプールには多くの日本人コミュニティがあり、日本語学校・日本食レストランも充実。JICAや在マレーシア日本大使館のサポートも受けやすい環境です。",
      en: "Kuala Lumpur has a significant Japanese expat and student community, with Japanese schools, restaurants, and support from the Japanese Embassy and JICA.",
      zh: "吉隆坡拥有众多日本人社区，日语学校和日本料理餐厅齐全，日本大使馆和JICA的支持也较为便利。",
    },
  },

  US: {
    code: "US",
    overview: {
      ja: "アメリカは世界最多の留学生を受け入れる国で、世界ランキング上位の大学が多数あります。多様な地域・文化・学術分野があり、自分に合った留学スタイルを選べます。学費・生活費は高めですが、奨学金制度も充実しています。",
      en: "The United States hosts more international students than any other country, with a vast number of world-ranked universities across diverse regions and disciplines. While costs are high, scholarship opportunities are plentiful.",
      zh: "美国是全球接收留学生最多的国家，拥有众多世界顶尖大学。地域广阔、学科多元，可根据自身需求选择适合的留学方式。学费和生活费较高，但奖学金制度完善。",
    },
    studentVisa: {
      name: { ja: "F-1ビザ（学生ビザ）", en: "F-1 Student Visa", zh: "F-1学生签证" },
      requirements: {
        ja: ["I-20（学校発行の入学許可書）", "SEVIS費用支払い（$350）", "DS-160フォーム記入", "ビザ申請料（$185）", "英語力証明（TOEFL等）", "財政証明書"],
        en: ["I-20 form from your institution", "SEVIS fee payment ($350)", "DS-160 form", "Visa application fee ($185)", "English proficiency proof (TOEFL etc.)", "Financial support documents"],
        zh: ["学校签发的I-20表格", "支付SEVIS费用（$350）", "填写DS-160表格", "签证申请费（$185）", "英语能力证明（托福等）", "经济担保证明"],
      },
      duration: { ja: "就学期間中（プログラム終了後60日間の猶予）", en: "Duration of program + 60-day grace period", zh: "学习期间（项目结束后有60天宽限期）" },
      cost: { ja: "SEVIS料$350 + ビザ申請料$185", en: "SEVIS $350 + Visa fee $185", zh: "SEVIS费$350 + 签证申请费$185" },
    },
    costs: {
      tuitionMin: 20000,
      tuitionMax: 60000,
      livingMin: 800,
      livingMax: 2500,
      currency: "USD",
      currencySymbol: "$",
    },
    popularCities: {
      ja: ["ニューヨーク", "ロサンゼルス", "ボストン", "サンフランシスコ", "シアトル"],
      en: ["New York", "Los Angeles", "Boston", "San Francisco", "Seattle"],
      zh: ["纽约", "洛杉矶", "波士顿", "旧金山", "西雅图"],
    },
    popularUniversities: {
      ja: ["マサチューセッツ工科大学（MIT）", "ハーバード大学", "スタンフォード大学", "カリフォルニア大学（UCLA・UC Berkeley）", "ニューヨーク大学（NYU）"],
      en: ["MIT", "Harvard University", "Stanford University", "University of California (UCLA / UC Berkeley)", "New York University (NYU)"],
      zh: ["麻省理工学院（MIT）", "哈佛大学", "斯坦福大学", "加利福尼亚大学（UCLA / UC伯克利）", "纽约大学（NYU）"],
    },
    tips: {
      ja: ["コミュニティカレッジからスタートして4年制大学に編入する方法もある", "OPT制度で卒業後1年間（STEM専攻は3年）就労可能", "健康保険は必須（学校が提供するプランに加入が一般的）", "チップ文化に慣れておくこと"],
      en: ["Community college to 4-year university transfer is a common and cost-effective path", "OPT allows up to 1 year of work after graduation (3 years for STEM)", "Health insurance is mandatory — most schools offer their own plans", "Tipping culture is standard in the US"],
      zh: ["先就读社区大学再转入四年制大学是常见的低成本途径", "OPT允许毕业后工作1年（STEM专业3年）", "必须购买医疗保险，多数学校提供专属保险方案", "需适应美国的小费文化"],
    },
    japaneseInfo: {
      ja: "在米日本人・日本人留学生は世界最大規模。各地に日本人コミュニティがあり、日本語サポートも充実。ジャパニーズ・スチューデント・アソシエーション（JSA）が多くの大学で活動しています。",
      en: "The Japanese student and expat community in the US is one of the largest in the world. Most universities have a Japanese Student Association (JSA), and Japanese language support is widely available.",
      zh: "在美日本人及日本留学生群体规模庞大，各地均有日本人社区。大多数大学设有日本学生协会（JSA），日语支持服务完善。",
    },
  },

  AU: {
    code: "AU",
    overview: {
      ja: "オーストラリアはアジアに近い英語圏の国として日本人留学生に人気です。多文化主義を掲げており、外国人に対してオープンな社会です。ワーキングホリデービザを活用しながら語学学校・大学に通う方法も一般的です。",
      en: "Australia is a top destination for Japanese students seeking an English-language education close to Asia. Its multicultural society is welcoming to international students, and the Working Holiday Visa is often combined with study plans.",
      zh: "澳大利亚是日本留学生在亚洲附近选择英语教育环境的热门目的地。多元文化社会对留学生友好，打工度假签证与学习计划结合的方式也很常见。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（Subclass 500）", en: "Student Visa (Subclass 500)", zh: "学生签证（Subclass 500）" },
      requirements: {
        ja: ["入学許可書（CoE）", "英語力証明（IELTS等）", "財政証明書", "健康保険（OSHC）への加入", "健康診断（場合により）"],
        en: ["Confirmation of Enrolment (CoE)", "English proficiency proof (IELTS etc.)", "Financial support documents", "Overseas Student Health Cover (OSHC)", "Health examination (if required)"],
        zh: ["入学确认书（CoE）", "英语能力证明（雅思等）", "经济担保证明", "海外学生医疗保险（OSHC）", "体检（如需）"],
      },
      duration: { ja: "就学期間 + 1〜2ヶ月", en: "Duration of course + 1–2 months", zh: "学习期间 + 1至2个月" },
      cost: { ja: "約AUD$710", en: "Approx. AUD$710", zh: "约AUD$710" },
    },
    costs: {
      tuitionMin: 20000,
      tuitionMax: 45000,
      livingMin: 1200,
      livingMax: 2800,
      currency: "AUD",
      currencySymbol: "A$",
    },
    popularCities: {
      ja: ["シドニー", "メルボルン", "ブリスベン", "パース", "アデレード"],
      en: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
      zh: ["悉尼", "墨尔本", "布里斯班", "珀斯", "阿德莱德"],
    },
    popularUniversities: {
      ja: ["メルボルン大学", "シドニー大学", "オーストラリア国立大学（ANU）", "クイーンズランド大学", "モナッシュ大学"],
      en: ["University of Melbourne", "University of Sydney", "Australian National University (ANU)", "University of Queensland", "Monash University"],
      zh: ["墨尔本大学", "悉尼大学", "澳大利亚国立大学（ANU）", "昆士兰大学", "莫纳什大学"],
    },
    tips: {
      ja: ["留学生は週48時間まで就労可能（学期中）", "OPT制度（PSW）で卒業後2〜4年就労可能", "物価は日本と同等か高め", "自然豊かで生活の質が高い"],
      en: ["International students can work up to 48 hours per fortnight during term", "Post-Study Work (PSW) visa allows 2–4 years of work after graduation", "Cost of living is similar to or slightly higher than Japan", "High quality of life with abundant nature"],
      zh: ["留学生学期内每两周最多工作48小时", "毕业后工作签证（PSW）允许工作2至4年", "生活成本与日本相当或略高", "自然环境优美，生活质量高"],
    },
    japaneseInfo: {
      ja: "シドニー・メルボルンには日本人コミュニティが充実。日本語対応の不動産・医療機関も多く、初めての海外留学でも安心です。",
      en: "Sydney and Melbourne have well-established Japanese communities, with Japanese-speaking real estate agents, clinics, and support networks — ideal for first-time students abroad.",
      zh: "悉尼和墨尔本拥有完善的日本人社区，提供日语服务的中介、诊所和支持网络，非常适合首次出国留学的学生。",
    },
  },

  GB: {
    code: "GB",
    overview: {
      ja: "イギリスは世界最古の大学を多数擁し、学術的権威の高さで世界トップクラスです。学部課程3年・修士課程1年と短期集中型のカリキュラムが特徴で、コストを抑えながら高品質な教育を受けられます。",
      en: "The UK is home to some of the world's oldest and most prestigious universities. Its shorter degree programs — 3-year undergraduate and 1-year master's — make it a cost-effective route to a high-quality education.",
      zh: "英国拥有众多世界最古老、最负盛名的大学，学术水准居世界前列。本科3年、硕士1年的短期集中课程，在高质量教育的同时有效控制了成本。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（Student Visa）", en: "Student Visa (formerly Tier 4)", zh: "学生签证（Student Visa）" },
      requirements: {
        ja: ["CAS番号（学校発行）", "英語力証明（IELTS等）", "財政証明書（コース期間 + 9ヶ月分の生活費）", "ビザ申請料（£490）", "IHS料（年£776）"],
        en: ["CAS number from your institution", "English proficiency (IELTS etc.)", "Financial proof (course + 9 months living costs)", "Visa fee (£490)", "Immigration Health Surcharge (IHS) £776/year"],
        zh: ["学校签发的CAS号", "英语能力证明（雅思等）", "经济证明（学费+9个月生活费）", "签证费（£490）", "移民医疗附加费（IHS）每年£776"],
      },
      duration: { ja: "就学期間 + 最大2ヶ月", en: "Duration of course + up to 2 months", zh: "学习期间 + 最多2个月" },
      cost: { ja: "ビザ申請料£490 + IHS（年£776）", en: "Visa fee £490 + IHS £776/year", zh: "签证费£490 + IHS每年£776" },
    },
    costs: {
      tuitionMin: 15000,
      tuitionMax: 38000,
      livingMin: 800,
      livingMax: 2000,
      currency: "GBP",
      currencySymbol: "£",
    },
    popularCities: {
      ja: ["ロンドン", "エディンバラ", "マンチェスター", "バーミンガム", "オックスフォード・ケンブリッジ"],
      en: ["London", "Edinburgh", "Manchester", "Birmingham", "Oxford / Cambridge"],
      zh: ["伦敦", "爱丁堡", "曼彻斯特", "伯明翰", "牛津/剑桥"],
    },
    popularUniversities: {
      ja: ["オックスフォード大学", "ケンブリッジ大学", "インペリアル・カレッジ・ロンドン", "UCL（ユニバーシティ・カレッジ・ロンドン）", "エディンバラ大学"],
      en: ["University of Oxford", "University of Cambridge", "Imperial College London", "University College London (UCL)", "University of Edinburgh"],
      zh: ["牛津大学", "剑桥大学", "帝国理工学院", "伦敦大学学院（UCL）", "爱丁堡大学"],
    },
    tips: {
      ja: ["修士課程は1年で取得可能（日本・米国の2年に比べ短い）", "卒業後2年間就労可能なGSルート（旧PSW）ビザあり", "ロンドンの物価は欧州最高水準", "NHS（国民保険サービス）でIHS加入者は医療無料"],
      en: ["Master's degrees take only 1 year (vs. 2 years in Japan or the US)", "Graduate Route visa allows 2 years of work after graduation", "London is one of the most expensive cities in Europe", "IHS payers get access to the NHS for free healthcare"],
      zh: ["硕士仅需1年（相比日本或美国的2年更短）", "毕业生签证（Graduate Route）允许毕业后工作2年", "伦敦是欧洲生活成本最高的城市之一", "缴纳IHS后可免费使用NHS医疗服务"],
    },
    japaneseInfo: {
      ja: "ロンドンには多くの日本人が居住し、日系企業・日本語サービスも充実。日英協会などのコミュニティも活発です。",
      en: "London has one of the largest Japanese communities in Europe, with Japanese businesses, schools, and cultural organizations widely present.",
      zh: "伦敦拥有欧洲规模最大的日本人社区，日系企业、学校和文化团体遍布各地。",
    },
  },

  CA: {
    code: "CA",
    overview: {
      ja: "カナダは英語・フランス語が公用語の多文化国家で、移民に寛容な政策を取っています。留学後に永住権を取得しやすい国としても知られ、「留学→就労→永住権」というキャリアパスを描く留学生が多いです。",
      en: "Canada is a bilingual, multicultural country known for its welcoming immigration policies. Many students choose Canada with a long-term plan: study → work → permanent residency.",
      zh: "加拿大是英法双语的多元文化国家，以友好的移民政策著称。许多留学生将加拿大作为「留学→工作→永久居留权」的长期发展路径。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（Study Permit）", en: "Study Permit", zh: "学生签证（Study Permit）" },
      requirements: {
        ja: ["入学許可書（LOA）", "財政証明書（学費 + 年間CAD$10,000以上）", "英語力証明（IELTS等）", "パスポート", "申請料CAD$150"],
        en: ["Letter of Acceptance (LOA)", "Financial proof (tuition + CAD$10,000/year)", "English proficiency (IELTS etc.)", "Valid passport", "Application fee CAD$150"],
        zh: ["录取通知书（LOA）", "经济证明（学费+每年CAD$10,000以上）", "英语能力证明（雅思等）", "有效护照", "申请费CAD$150"],
      },
      duration: { ja: "就学期間 + 90日間", en: "Duration of program + 90 days", zh: "学习期间 + 90天" },
      cost: { ja: "申請料CAD$150", en: "Application fee CAD$150", zh: "申请费CAD$150" },
    },
    costs: {
      tuitionMin: 18000,
      tuitionMax: 40000,
      livingMin: 1000,
      livingMax: 2500,
      currency: "CAD",
      currencySymbol: "C$",
    },
    popularCities: {
      ja: ["トロント", "バンクーバー", "モントリオール", "カルガリー", "オタワ"],
      en: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
      zh: ["多伦多", "温哥华", "蒙特利尔", "卡尔加里", "渥太华"],
    },
    popularUniversities: {
      ja: ["トロント大学", "ブリティッシュコロンビア大学（UBC）", "マギル大学", "ウォータールー大学", "アルバータ大学"],
      en: ["University of Toronto", "University of British Columbia (UBC)", "McGill University", "University of Waterloo", "University of Alberta"],
      zh: ["多伦多大学", "不列颠哥伦比亚大学（UBC）", "麦吉尔大学", "滑铁卢大学", "阿尔伯塔大学"],
    },
    tips: {
      ja: ["卒業後最大3年間就労可能なPGWP（Post-Graduation Work Permit）あり", "PGWPから永住権（Express Entry）への道が整備されている", "バンクーバーは特に日本人留学生が多い", "冬は非常に寒いため防寒対策が必要"],
      en: ["Post-Graduation Work Permit (PGWP) allows up to 3 years of work", "Clear pathway from PGWP to permanent residency via Express Entry", "Vancouver has one of the largest Japanese student populations", "Winters are extremely cold in most regions — prepare accordingly"],
      zh: ["毕业后工作许可（PGWP）允许工作最长3年", "PGWP到快速通道（Express Entry）的永居路径清晰", "温哥华日本留学生众多", "大部分地区冬季极寒，需充分准备保暖装备"],
    },
    japaneseInfo: {
      ja: "バンクーバー・トロントには大規模な日本人コミュニティがあります。日系スーパー・日本語学校・日系企業も多く、生活面でのサポートが充実しています。",
      en: "Vancouver and Toronto have large Japanese communities, complete with Japanese supermarkets, schools, and businesses — excellent support for new arrivals.",
      zh: "温哥华和多伦多拥有规模庞大的日本人社区，日系超市、日语学校和日系企业一应俱全，对新来者支持完善。",
    },
  },

  NZ: {
    code: "NZ",
    overview: {
      ja: "ニュージーランドは自然豊かで治安が良く、英語を学ぶ環境として人気です。オーストラリアに比べてコンパクトで、アットホームな留学体験ができます。語学留学・大学進学どちらも充実しています。",
      en: "New Zealand offers a safe, nature-rich environment with high-quality English education. Smaller and more relaxed than Australia, it's known for its friendly atmosphere and strong English language programs.",
      zh: "新西兰自然环境优美、治安良好，是学习英语的热门之地。与澳大利亚相比规模较小，留学体验更为亲切温馨，语言学习和大学进修均有完善配套。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（Fee Paying Student Visa）", en: "Fee Paying Student Visa", zh: "自费学生签证" },
      requirements: {
        ja: ["入学許可書", "財政証明書", "英語力証明", "健康保険加入証明", "申請料NZD$375"],
        en: ["Offer of place from institution", "Financial proof", "English proficiency proof", "Health insurance", "Application fee NZD$375"],
        zh: ["院校录取通知书", "经济证明", "英语能力证明", "医疗保险证明", "申请费NZD$375"],
      },
      duration: { ja: "就学期間中", en: "Duration of study", zh: "学习期间" },
      cost: { ja: "申請料NZD$375", en: "Application fee NZD$375", zh: "申请费NZD$375" },
    },
    costs: {
      tuitionMin: 18000,
      tuitionMax: 35000,
      livingMin: 1000,
      livingMax: 2200,
      currency: "NZD",
      currencySymbol: "NZ$",
    },
    popularCities: {
      ja: ["オークランド", "ウェリントン", "クライストチャーチ", "ダニーデン"],
      en: ["Auckland", "Wellington", "Christchurch", "Dunedin"],
      zh: ["奥克兰", "惠灵顿", "基督城", "但尼丁"],
    },
    popularUniversities: {
      ja: ["オークランド大学", "オタゴ大学", "ヴィクトリア大学ウェリントン", "カンタベリー大学", "マッセー大学"],
      en: ["University of Auckland", "University of Otago", "Victoria University of Wellington", "University of Canterbury", "Massey University"],
      zh: ["奥克兰大学", "奥塔哥大学", "维多利亚大学惠灵顿", "坎特伯雷大学", "梅西大学"],
    },
    tips: {
      ja: ["卒業後最大3年間就労可能なPGWビザあり", "オーストラリアへの移動が比較的容易", "自然体験（ハイキング・バンジー等）が豊富", "物価はオーストラリアよりやや安め"],
      en: ["Post-Study Work Visa allows up to 3 years after graduation", "Easy access to Australia for travel or work", "Abundant nature activities (hiking, bungee jumping, etc.)", "Slightly more affordable than Australia"],
      zh: ["毕业后工作签证允许最长3年", "前往澳大利亚旅行或工作较为便利", "自然活动丰富（徒步、蹦极等）", "生活费用略低于澳大利亚"],
    },
    japaneseInfo: {
      ja: "オークランドに日本人コミュニティが集中しています。語学学校には日本人スタッフがいることも多く、初めての留学でも安心です。",
      en: "Auckland has the largest Japanese community in New Zealand. Many language schools have Japanese-speaking staff, making it comfortable for first-time students.",
      zh: "奥克兰集中了新西兰最大的日本人社区，许多语言学校配有日语工作人员，首次留学也能放心就读。",
    },
  },

  SG: {
    code: "SG",
    overview: {
      ja: "シンガポールは小さな都市国家ながら、世界レベルの大学・ビジネス環境・多言語社会を誇ります。英語・中国語・マレー語が公用語で、アジアのビジネスハブとして就職にも有利です。アジア圏トップの教育水準を誇ります。",
      en: "Singapore is a world-class city-state with top-ranked universities, a thriving business environment, and a multilingual society. As Asia's business hub, graduates enjoy strong employment prospects across the region.",
      zh: "新加坡是一个世界级的城市国家，拥有顶尖大学、繁荣的商业环境和多语言社会。作为亚洲商业中心，毕业生就业前景优越。",
    },
    studentVisa: {
      name: { ja: "学生パス（Student's Pass）", en: "Student's Pass", zh: "学生准证（Student's Pass）" },
      requirements: {
        ja: ["ICA申請（e-Form16経由）", "入学許可書", "パスポート", "財政証明書", "申請料SGD$30"],
        en: ["ICA application via e-Form16", "Acceptance letter", "Valid passport", "Financial proof", "Application fee SGD$30"],
        zh: ["通过e-Form16向ICA申请", "录取通知书", "有效护照", "经济证明", "申请费SGD$30"],
      },
      duration: { ja: "就学期間中（最長2年）", en: "Duration of study (max 2 years per pass)", zh: "学习期间（每次最长2年）" },
      cost: { ja: "申請料SGD$30 + 発行料SGD$60", en: "Application SGD$30 + Issuance SGD$60", zh: "申请费SGD$30 + 签发费SGD$60" },
    },
    costs: {
      tuitionMin: 25000,
      tuitionMax: 55000,
      livingMin: 1500,
      livingMax: 3500,
      currency: "SGD",
      currencySymbol: "S$",
    },
    popularCities: {
      ja: ["シンガポール（全土）"],
      en: ["Singapore (citywide)"],
      zh: ["新加坡（全境）"],
    },
    popularUniversities: {
      ja: ["シンガポール国立大学（NUS）", "南洋理工大学（NTU）", "シンガポール経営大学（SMU）", "シンガポール工科デザイン大学（SUTD）"],
      en: ["National University of Singapore (NUS)", "Nanyang Technological University (NTU)", "Singapore Management University (SMU)", "Singapore University of Technology and Design (SUTD)"],
      zh: ["新加坡国立大学（NUS）", "南洋理工大学（NTU）", "新加坡管理大学（SMU）", "新加坡科技设计大学（SUTD）"],
    },
    tips: {
      ja: ["学費は高いが、NUS・NTUは世界ランキング上位", "就労はパートタイム（週16時間まで）可能", "シンガポールドルは強く、物価は日本より高め", "治安は非常に良く女性一人でも安全"],
      en: ["Tuition is high, but NUS and NTU are consistently world top-ranked", "Part-time work up to 16 hours/week is allowed", "SGD is strong and cost of living is higher than Japan", "Extremely safe — one of the safest cities in the world"],
      zh: ["学费较高，但NUS和NTU始终位居全球前列", "允许每周最多兼职工作16小时", "新加坡元强势，生活成本高于日本", "治安极佳，是全球最安全的城市之一"],
    },
    japaneseInfo: {
      ja: "シンガポールには多くの日系企業が進出しており、日本語を活かした就職も可能。日本人学校・日本人会も充実しています。",
      en: "Singapore hosts many Japanese companies, offering career opportunities for Japanese-speaking graduates. Japanese schools and community associations are well-established.",
      zh: "新加坡聚集了众多日系企业，为会日语的毕业生提供了丰富的就业机会。日本人学校和日本人会组织也十分完善。",
    },
  },

  KR: {
    code: "KR",
    overview: {
      ja: "韓国は日本から最も近い留学先のひとつで、K-POP・韓国語・韓国文化に興味を持つ日本人に人気です。大学の授業料は他の先進国に比べて安く、奨学金制度も充実しています。韓国語習得と同時にアジアビジネスの拠点としてのキャリアも築けます。",
      en: "South Korea is one of the closest study abroad destinations for Japanese students, and is especially popular among those interested in K-pop, Korean language, and culture. Tuition fees are relatively low compared to other developed countries.",
      zh: "韩国是日本留学生最近的留学目的地之一，深受对K-pop、韩语及韩国文化感兴趣的日本人欢迎。与其他发达国家相比，学费相对较低，奖学金制度也较为完善。",
    },
    studentVisa: {
      name: { ja: "D-2ビザ（留学ビザ）", en: "D-2 Student Visa", zh: "D-2留学签证" },
      requirements: {
        ja: ["入学許可書", "財政証明書（USD$10,000以上相当）", "パスポート", "証明写真", "申請料（在日韓国領事館で確認）"],
        en: ["Admission letter", "Financial proof (equiv. USD$10,000+)", "Valid passport", "Passport photo", "Application fee (check at Korean consulate)"],
        zh: ["录取通知书", "经济证明（相当于USD$10,000以上）", "有效护照", "证件照", "申请费（请查询韩国领事馆）"],
      },
      duration: { ja: "就学期間中（最長2年、更新可）", en: "Duration of study (max 2 years, renewable)", zh: "学习期间（最长2年，可续签）" },
      cost: { ja: "約¥4,000〜¥6,000（在日韓国領事館）", en: "Approx. ¥4,000–¥6,000 at Korean consulate in Japan", zh: "约¥4,000至¥6,000（在日韩国领事馆）" },
    },
    costs: {
      tuitionMin: 5000000,
      tuitionMax: 12000000,
      livingMin: 600000,
      livingMax: 1500000,
      currency: "KRW",
      currencySymbol: "₩",
    },
    popularCities: {
      ja: ["ソウル", "釜山", "大邱", "仁川"],
      en: ["Seoul", "Busan", "Daegu", "Incheon"],
      zh: ["首尔", "釜山", "大邱", "仁川"],
    },
    popularUniversities: {
      ja: ["ソウル大学校", "延世大学校", "高麗大学校", "成均館大学校", "韓国外国語大学校"],
      en: ["Seoul National University", "Yonsei University", "Korea University", "Sungkyunkwan University", "Hankuk University of Foreign Studies"],
      zh: ["首尔大学", "延世大学", "高丽大学", "成均馆大学", "韩国外国语大学"],
    },
    tips: {
      ja: ["韓国語を事前に基礎レベルまで学んでおくとスムーズ", "Government of Korea（GKS）奨学金など充実した奨学金あり", "日韓間の物価差があり、日本より全体的に安め", "KTX等の交通インフラが発達"],
      en: ["Learning basic Korean before arrival makes the transition smoother", "GKS (Korean Government Scholarship) and other programs are available", "Overall cost of living is lower than Japan", "Excellent public transport including KTX high-speed rail"],
      zh: ["出发前学习基础韩语有助于顺利融入", "韩国政府奖学金（GKS）等奖学金机会丰富", "整体生活费低于日本", "KTX高速铁路等交通基础设施发达"],
    },
    japaneseInfo: {
      ja: "日韓の歴史的背景から、相互理解を深めたい日本人学生も多いです。ソウル大学・延世大学には日本人留学生向けのサポートプログラムがあります。",
      en: "Many Japanese students choose Korea to deepen cross-cultural understanding. Major universities like SNU and Yonsei have dedicated support programs for Japanese students.",
      zh: "许多日本学生选择韩国以深化跨文化理解。首尔大学、延世大学等主要院校为日本留学生提供专项支持项目。",
    },
  },

  IE: {
    code: "IE",
    overview: {
      ja: "アイルランドはEU加盟国の中で唯一の英語母国語国家で、Google・Meta・Appleなど世界的テック企業の欧州本社が集中しています。英語を学びながら欧州でのキャリアを目指す留学生に最適です。",
      en: "Ireland is the only native English-speaking country in the EU, and hosts the European headquarters of Google, Meta, Apple, and many other tech giants — making it an ideal destination for those seeking English education and a European tech career.",
      zh: "爱尔兰是欧盟中唯一以英语为母语的国家，聚集了谷歌、Meta、苹果等全球科技巨头的欧洲总部，非常适合希望学习英语并在欧洲发展科技职业的留学生。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（Study Visa / Stamp 2）", en: "Study Visa (Stamp 2)", zh: "学生签证（Stamp 2）" },
      requirements: {
        ja: ["入学許可書", "財政証明書（€3,000以上）", "英語力証明", "医療保険加入証明", "ビザ申請料€60"],
        en: ["Letter of acceptance", "Financial proof (€3,000+)", "English proficiency proof", "Medical insurance", "Visa fee €60"],
        zh: ["录取通知书", "经济证明（€3,000以上）", "英语能力证明", "医疗保险证明", "签证费€60"],
      },
      duration: { ja: "就学期間中（1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "ビザ申請料€60", en: "Visa fee €60", zh: "签证费€60" },
    },
    costs: {
      tuitionMin: 10000,
      tuitionMax: 25000,
      livingMin: 1200,
      livingMax: 2500,
      currency: "EUR",
      currencySymbol: "€",
    },
    popularCities: {
      ja: ["ダブリン", "コーク", "ゴールウェイ", "リムリック"],
      en: ["Dublin", "Cork", "Galway", "Limerick"],
      zh: ["都柏林", "科克", "戈尔韦", "利默里克"],
    },
    popularUniversities: {
      ja: ["トリニティ・カレッジ・ダブリン（TCD）", "ユニバーシティ・カレッジ・ダブリン（UCD）", "ダブリン・シティ大学（DCU）", "コーク大学（UCC）", "ゴールウェイ大学（NUIG）"],
      en: ["Trinity College Dublin (TCD)", "University College Dublin (UCD)", "Dublin City University (DCU)", "University College Cork (UCC)", "University of Galway (NUIG)"],
      zh: ["都柏林三一学院（TCD）", "都柏林大学（UCD）", "都柏林城市大学（DCU）", "科克大学（UCC）", "戈尔韦大学（NUIG）"],
    },
    tips: {
      ja: ["卒業後2年間（修士は2年）就労可能なThird Level Graduate Scheme", "欧州全域への移動が容易（シェンゲン圏に隣接）", "テック系企業でのインターン・就職チャンスが豊富", "アイリッシュパブ文化が盛んで交流しやすい"],
      en: ["Third Level Graduate Scheme allows 2 years work after graduation", "Easy access to Schengen Area Europe", "Excellent internship/job opportunities at tech companies", "Pub culture makes it easy to socialize and meet locals"],
      zh: ["第三级毕业生计划允许毕业后工作2年", "可便捷前往申根区欧洲国家", "科技公司实习和就业机会丰富", "爱尔兰酒吧文化盛行，便于社交与认识当地人"],
    },
    japaneseInfo: {
      ja: "ダブリンには日本人コミュニティがあり、日系企業も進出しています。欧州ワーキングホリデービザとの組み合わせも可能（年齢制限あり）。",
      en: "Dublin has an active Japanese community and Japanese businesses. Combining study with a Working Holiday Visa is also possible for eligible applicants.",
      zh: "都柏林拥有活跃的日本人社区和日系企业。符合条件者还可将留学与打工度假签证结合使用。",
    },
  },

  DE: {
    code: "DE",
    overview: {
      ja: "ドイツは多くの州立大学で学費が無料または非常に安く、質の高い教育を受けられます。工学・理工系・医療系の分野が特に強く、ヨーロッパ最大の経済大国でのキャリア形成にも有利です。",
      en: "Germany offers tuition-free or very low-cost education at most public universities, with particularly strong programs in engineering, science, and medicine. As Europe's largest economy, it offers excellent post-graduation career opportunities.",
      zh: "德国大多数公立大学学费全免或极低，提供高质量教育。工程、理工及医疗领域尤为突出。作为欧洲最大经济体，毕业后的职业发展前景优越。",
    },
    studentVisa: {
      name: { ja: "学生ビザ / 留学ビザ（Nationales Visum）", en: "National Student Visa (Nationales Visum)", zh: "国家学生签证（Nationales Visum）" },
      requirements: {
        ja: ["大学入学許可書または語学学校登録証明", "ドイツ語力証明（B2以上が目安、英語コースはIELTS等）", "財政証明書（年€11,208のブロックト口座または奨学金証明）", "健康保険加入証明", "ビザ申請料€75"],
        en: ["University admission or language school enrollment", "German language proof (B2+) or English proficiency (IELTS for English programs)", "Financial proof (€11,208/year blocked account or scholarship)", "Health insurance", "Visa fee €75"],
        zh: ["大学录取通知或语言学校注册证明", "德语能力证明（B2以上）或英语能力证明（英语课程需雅思等）", "经济证明（每年€11,208冻结账户或奖学金证明）", "医疗保险证明", "签证费€75"],
      },
      duration: { ja: "就学期間中（最長2年、更新可）", en: "Duration of study (max 2 years, renewable)", zh: "学习期间（最长2年，可续签）" },
      cost: { ja: "ビザ申請料€75", en: "Visa fee €75", zh: "签证费€75" },
    },
    costs: {
      tuitionMin: 0,
      tuitionMax: 20000,
      livingMin: 700,
      livingMax: 1600,
      currency: "EUR",
      currencySymbol: "€",
    },
    popularCities: {
      ja: ["ベルリン", "ミュンヘン", "ハンブルク", "フランクフルト", "ケルン"],
      en: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
      zh: ["柏林", "慕尼黑", "汉堡", "法兰克福", "科隆"],
    },
    popularUniversities: {
      ja: ["ミュンヘン工科大学（TUM）", "ルートヴィヒ・マクシミリアン大学ミュンヘン（LMU）", "ハイデルベルク大学", "ベルリン自由大学", "ベルリン工科大学（TU Berlin）"],
      en: ["Technical University of Munich (TUM)", "Ludwig Maximilian University Munich (LMU)", "Heidelberg University", "Freie Universität Berlin", "Technical University of Berlin (TU Berlin)"],
      zh: ["慕尼黑工业大学（TUM）", "慕尼黑路德维希-马克西米利安大学（LMU）", "海德堡大学", "柏林自由大学", "柏林工业大学（TU Berlin）"],
    },
    tips: {
      ja: ["州立大学は多くが無料（セメスター費用€150〜350程度のみ）", "ドイツ語を最低B2レベルまで習得することを推奨", "卒業後18ヶ月間の就職活動ビザあり", "DAAD（ドイツ学術交流会）の奨学金が充実"],
      en: ["Public university tuition is free (only semester fees of €150–350)", "German B2 level is strongly recommended before enrollment", "18-month job-seeker visa available after graduation", "DAAD scholarships are widely available for international students"],
      zh: ["公立大学学费全免（仅需缴纳约€150至350的学期费用）", "强烈建议在入学前达到德语B2水平", "毕业后可申请18个月求职签证", "DAAD（德国学术交流中心）提供丰富的奖学金机会"],
    },
    japaneseInfo: {
      ja: "ベルリン・ミュンヘンには日系企業が多く、日本人コミュニティも存在します。ドイツ日本研究所（DIJ）など日独交流機関も活発に活動しています。",
      en: "Berlin and Munich have Japanese business communities and cultural exchange organizations like the German Institute for Japanese Studies (DIJ).",
      zh: "柏林和慕尼黑拥有日系企业社区，德国日本研究所（DIJ）等日德交流机构也十分活跃。",
    },
  },

  TH: {
    code: "TH",
    overview: {
      ja: "タイは東南アジアで最も人気のある語学留学先のひとつで、特に英語語学学校のコストパフォーマンスが高いです。バンコクやチェンマイには多くの日本人コミュニティがあり、物価も安く生活しやすい環境です。タイ語・英語・中国語の学習拠点としても注目されています。",
      en: "Thailand is one of Southeast Asia's most popular study abroad destinations, especially for affordable English language schools. Bangkok and Chiang Mai have large Japanese communities, low living costs, and a welcoming atmosphere for international students.",
      zh: "泰国是东南亚最受欢迎的留学目的地之一，尤其以英语语言学校性价比高而著称。曼谷和清迈拥有大量日本人社区，生活费用低廉，环境友好。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（ED ビザ）", en: "Education Visa (ED Visa)", zh: "教育签证（ED签证）" },
      requirements: {
        ja: ["学校の入学許可書", "パスポート（有効期限18ヶ月以上）", "証明写真", "申請料（在日タイ大使館）", "財政証明書"],
        en: ["Enrollment letter from school", "Passport valid 18+ months", "Passport photos", "Application fee at Thai Embassy", "Financial support proof"],
        zh: ["学校录取通知书", "护照（有效期18个月以上）", "证件照", "申请费（泰国大使馆）", "经济担保证明"],
      },
      duration: { ja: "90日（現地で1年ごとに更新可）", en: "90 days (extendable annually in Thailand)", zh: "90天（可在泰国境内每年续签）" },
      cost: { ja: "約¥3,000〜¥5,000（在日タイ大使館）", en: "Approx. ¥3,000–¥5,000 at Thai Embassy in Japan", zh: "约¥3,000至¥5,000（驻日泰国大使馆）" },
    },
    costs: {
      tuitionMin: 30000,
      tuitionMax: 200000,
      livingMin: 25000,
      livingMax: 60000,
      currency: "THB",
      currencySymbol: "฿",
    },
    popularCities: {
      ja: ["バンコク", "チェンマイ", "パタヤ", "プーケット"],
      en: ["Bangkok", "Chiang Mai", "Pattaya", "Phuket"],
      zh: ["曼谷", "清迈", "芭提雅", "普吉岛"],
    },
    popularUniversities: {
      ja: ["チュラロンコン大学", "タマサート大学", "マヒドン大学", "カセサート大学", "AUAランゲージセンター"],
      en: ["Chulalongkorn University", "Thammasat University", "Mahidol University", "Kasetsart University", "AUA Language Center"],
      zh: ["朱拉隆功大学", "泰玛萨特大学", "玛希敦大学", "农业大学", "AUA语言中心"],
    },
    tips: {
      ja: ["語学学校（英語・タイ語）は費用が非常に安い", "EDビザは現地のイミグレーションオフィスで更新可能", "バンコクは交通インフラが充実（BTSスカイトレイン・MRT）", "年間を通じて温暖な気候で過ごしやすい"],
      en: ["Language schools (English/Thai) are very affordable", "ED visa can be renewed at local immigration offices", "Bangkok has excellent public transport (BTS / MRT)", "Warm climate year-round makes daily life comfortable"],
      zh: ["语言学校（英语/泰语）费用非常低廉", "ED签证可在当地移民局续签", "曼谷公共交通发达（BTS空铁/地铁）", "全年气候温暖，生活舒适"],
    },
    japaneseInfo: {
      ja: "バンコクのスクンビット周辺には多くの日本人が在住。日本語対応の病院・学校・飲食店が充実しており、初めての海外生活でも安心です。日本人向け語学学校も多数あります。",
      en: "Bangkok's Sukhumvit area has a large Japanese expat community with Japanese-speaking hospitals, schools, and restaurants — ideal for first-time abroad students.",
      zh: "曼谷素坤逸一带聚集了大量日本人，日语医院、学校和餐厅一应俱全，非常适合首次海外生活的学生。",
    },
  },

  FR: {
    code: "FR",
    overview: {
      ja: "フランスはアート・ファッション・料理・語学など多彩な分野で留学先として世界的に人気です。パリをはじめとする都市には多数の名門大学・グランゼコールがあり、EU圏での就職にも有利な環境です。フランス語が公用語ですが、英語コースも増えています。",
      en: "France is a world-renowned study destination for art, fashion, culinary arts, and language learning. Home to prestigious universities and Grandes Écoles, France offers excellent career prospects within the EU.",
      zh: "法国是艺术、时尚、烹饪和语言学习领域享誉全球的留学目的地。拥有众多名校和大学校（Grandes Écoles），在欧盟就业前景优越。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（VLS-TS Étudiant）", en: "Long-Stay Student Visa (VLS-TS Étudiant)", zh: "长期学生签证（VLS-TS Étudiant）" },
      requirements: {
        ja: ["キャンパスフランスでの事前手続き", "大学・語学学校の入学許可書", "財政証明書（月額€615以上）", "滞在先証明", "健康保険加入証明", "ビザ申請料€99"],
        en: ["Campus France pre-registration", "Acceptance letter from institution", "Financial proof (€615+/month)", "Proof of accommodation", "Health insurance", "Visa fee €99"],
        zh: ["Campus France预注册", "院校录取通知书", "经济证明（每月€615以上）", "住宿证明", "医疗保险证明", "签证费€99"],
      },
      duration: { ja: "就学期間（1年更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "ビザ申請料€99", en: "Visa fee €99", zh: "签证费€99" },
    },
    costs: {
      tuitionMin: 170,
      tuitionMax: 15000,
      livingMin: 800,
      livingMax: 1800,
      currency: "EUR",
      currencySymbol: "€",
    },
    popularCities: {
      ja: ["パリ", "リヨン", "ボルドー", "トゥールーズ", "マルセイユ"],
      en: ["Paris", "Lyon", "Bordeaux", "Toulouse", "Marseille"],
      zh: ["巴黎", "里昂", "波尔多", "图卢兹", "马赛"],
    },
    popularUniversities: {
      ja: ["パリ大学（ソルボンヌ）", "エコール・ポリテクニーク", "HECパリ", "リヨン大学", "フランス語研修（アリアンス・フランセーズ）"],
      en: ["University of Paris (Sorbonne)", "École Polytechnique", "HEC Paris", "University of Lyon", "Alliance Française (French language)"],
      zh: ["巴黎大学（索邦）", "巴黎综合理工学院", "巴黎高等商学院（HEC）", "里昂大学", "法语联盟（法语培训）"],
    },
    tips: {
      ja: ["公立大学の学費は年間約€170〜と非常に安い", "CAF（住宅補助金）申請で家賃補助が受けられる", "フランス語は事前にB1〜B2レベルを目指すと良い", "グランゼコールはエリートコースで就職に非常に有利"],
      en: ["Public university tuition is remarkably low (~€170/year)", "CAF housing allowance can reduce rent costs", "Aim for B1–B2 French level before enrollment", "Grandes Écoles offer elite education with outstanding career outcomes"],
      zh: ["公立大学学费极低（约每年€170）", "可申请CAF住房补贴降低租金支出", "入学前建议法语达到B1至B2水平", "大学校提供精英教育，就业前景卓越"],
    },
    japaneseInfo: {
      ja: "パリには多くの日本人が居住し、日本食レストラン・日本人コミュニティが充実。ルーブル美術館周辺の日本人観光客・留学生も多く、パリ日本文化会館も活発に活動しています。",
      en: "Paris has a well-established Japanese community with Japanese restaurants and cultural organizations. The Japan Cultural Institute in Paris (Maison de la culture du Japon) is a great resource for Japanese students.",
      zh: "巴黎拥有完善的日本人社区，日本料理店和文化团体齐全。驻法国日本文化会馆是日本留学生的重要资源。",
    },
  },

  TW: {
    code: "TW",
    overview: {
      ja: "台湾は日本から近く、親日的な文化・安全な治安・安い物価が魅力の留学先です。中国語（繁体字）を学ぶ環境として最適で、アジアビジネスのキャリアを目指す方にも人気です。台湾の大学は国際的な評価も高まっており、英語コースも増えています。",
      en: "Taiwan is a popular study destination for Japanese students, offering a safe environment, affordable cost of living, and a pro-Japan culture. It's an ideal place to learn Traditional Chinese, and universities are gaining international recognition.",
      zh: "台湾对日本留学生来说是热门目的地，亲日文化、安全治安和低廉物价是其魅力所在。是学习繁体中文的最佳环境，也是追求亚洲商业职业的理想选择。",
    },
    studentVisa: {
      name: { ja: "居留ビザ（学生居留証）", en: "Resident Visa (Student ARC)", zh: "居留签证（学生居留证）" },
      requirements: {
        ja: ["大学の入学許可書", "パスポート", "財政証明書（TWD$200,000以上相当）", "在学証明書", "証明写真", "申請料（在日台北経済文化代表処）"],
        en: ["University acceptance letter", "Valid passport", "Financial proof (TWD$200,000+)", "Enrollment certificate", "Passport photos", "Application fee at TECRO office"],
        zh: ["大学录取通知书", "有效护照", "经济证明（TWD$200,000以上）", "在学证明", "证件照", "申请费（台北经济文化代表处）"],
      },
      duration: { ja: "就学期間（1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "申請料約¥3,000〜¥6,000", en: "Application fee approx. ¥3,000–¥6,000", zh: "申请费约¥3,000至¥6,000" },
    },
    costs: {
      tuitionMin: 50000,
      tuitionMax: 200000,
      livingMin: 18000,
      livingMax: 35000,
      currency: "TWD",
      currencySymbol: "NT$",
    },
    popularCities: {
      ja: ["台北", "台中", "高雄", "台南"],
      en: ["Taipei", "Taichung", "Kaohsiung", "Tainan"],
      zh: ["台北", "台中", "高雄", "台南"],
    },
    popularUniversities: {
      ja: ["国立台湾大学（NTU）", "国立政治大学", "国立成功大学", "台湾師範大学（中国語研修）", "輔仁大学"],
      en: ["National Taiwan University (NTU)", "National Chengchi University", "National Cheng Kung University", "NTNU (Mandarin Training Center)", "Fu Jen Catholic University"],
      zh: ["台湾大学（NTU）", "政治大学", "成功大学", "台湾师范大学（华语中心）", "辅仁大学"],
    },
    tips: {
      ja: ["台湾師範大学の華語教学中心は中国語研修で有名", "物価は日本より安く、生活費を抑えやすい", "日本語が通じる場面も多く初めての海外でも安心", "奨学金制度（台湾政府奨学金）も充実"],
      en: ["NTNU's Mandarin Training Center is world-famous for Chinese language study", "Cost of living is lower than Japan", "Japanese is widely understood — great for first-time students abroad", "Taiwan Ministry of Education scholarships are available"],
      zh: ["台师大华语教学中心以中文培训闻名世界", "生活成本低于日本", "日语在许多场合通用，非常适合首次出国留学的学生", "台湾教育部奖学金资源丰富"],
    },
    japaneseInfo: {
      ja: "台湾は親日国として知られ、日本語が通じる場面も多いです。台北の中山・信義エリアには日本人コミュニティがあります。日台間の文化交流も活発です。",
      en: "Taiwan is known for its pro-Japan sentiment, and Japanese is widely understood in many contexts. Taipei's Zhongshan and Xinyi districts have active Japanese communities.",
      zh: "台湾以亲日著称，日语在许多场合通用。台北中山和信义区拥有活跃的日本人社区，日台文化交流频繁。",
    },
  },

  PH: {
    code: "PH",
    overview: {
      ja: "フィリピンは英語を公用語とする国で、日本人に最も人気のある格安英語留学先です。セブ島・マニラを中心に多くの語学学校があり、マンツーマン授業が受けられる点が大きな特徴です。費用はアメリカ・オーストラリアの数分の一で、短期〜長期まで柔軟に対応できます。",
      en: "The Philippines is one of the most popular English study destinations for Japanese students, offering affordable tuition and one-on-one lessons. With English as an official language, it provides an immersive environment at a fraction of the cost of the US or Australia.",
      zh: "菲律宾是日本留学生最受欢迎的英语学习目的地之一，学费低廉且提供一对一课程。英语为官方语言，学习环境沉浸式，费用仅为美国或澳大利亚的几分之一。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（Special Study Permit）", en: "Special Study Permit (SSP)", zh: "特别学习许可证（SSP）" },
      requirements: {
        ja: ["語学学校の入学許可書", "パスポート", "財政証明書", "入国時に観光ビザで入国後SSPを現地で取得が一般的"],
        en: ["Enrollment letter from language school", "Valid passport", "Financial proof", "Most students enter on tourist visa and obtain SSP locally"],
        zh: ["语言学校录取通知书", "有效护照", "经济证明", "大多数学生以旅游签证入境后在当地申请SSP"],
      },
      duration: { ja: "就学期間中（最長1年）", en: "Duration of study (up to 1 year)", zh: "学习期间（最长1年）" },
      cost: { ja: "SSP申請料約PHP10,000〜", en: "SSP fee approx. PHP10,000+", zh: "SSP申请费约PHP10,000以上" },
    },
    costs: {
      tuitionMin: 80000,
      tuitionMax: 300000,
      livingMin: 25000,
      livingMax: 60000,
      currency: "PHP",
      currencySymbol: "₱",
    },
    popularCities: {
      ja: ["セブ市", "マニラ（パサイ・BGC）", "バコロド", "ダバオ"],
      en: ["Cebu City", "Manila (Pasay / BGC)", "Bacolod", "Davao"],
      zh: ["宿雾市", "马尼拉（帕赛/BGC）", "巴科洛德", "达沃"],
    },
    popularUniversities: {
      ja: ["CI（クリフォード・インターナショナル）", "PINES語学学校", "OEG語学学校", "フィリピン大学（UP Diliman）", "デ・ラ・サール大学"],
      en: ["Clifford International (CI)", "PINES Language School", "OEG Language School", "University of the Philippines (UP Diliman)", "De La Salle University"],
      zh: ["克利福德国际语言学校（CI）", "PINES语言学校", "OEG语言学校", "菲律宾大学（UP Diliman）", "德拉萨大学"],
    },
    tips: {
      ja: ["1日8〜10コマのマンツーマン授業が受けられる", "費用はアメリカの約5分の1以下", "日本人学生が多いため英語環境の徹底が重要", "セブ島はリゾート地でもあり生活の質が高い"],
      en: ["8–10 one-on-one lessons per day is standard", "Costs are roughly 1/5 or less of studying in the US", "Many Japanese students — self-discipline for English immersion is important", "Cebu is a resort destination with excellent quality of life"],
      zh: ["每天可上8至10节一对一课程", "费用约为在美国留学的五分之一以下", "日本学生众多，保持英语沉浸环境需要自律", "宿雾是度假胜地，生活质量高"],
    },
    japaneseInfo: {
      ja: "セブ島の語学学校は日本人向けに特化したプログラムが多く、日本語スタッフも常駐しています。日本からの直行便もあり、アクセスも良好です。",
      en: "Many language schools in Cebu specialize in Japanese students, with Japanese-speaking staff and Japan-friendly programs. Direct flights from Japan make access easy.",
      zh: "宿雾的许多语言学校专门面向日本学生，配有日语工作人员并提供针对性课程。日本直飞航班交通便利。",
    },
  },

  NL: {
    code: "NL",
    overview: {
      ja: "オランダはEU圏の中でも英語力が非常に高く、多くの大学が英語で授業を提供しています。アムステルダムをはじめとする都市はビジネス・テクノロジー・デザインのハブとして知られ、外国人に開かれたオープンな社会です。「30%ルーリング」という外国人向け税制優遇もあります。",
      en: "The Netherlands has one of the highest English proficiency rates in Europe, with many universities offering full English-taught programs. As a hub for business, tech, and design, Dutch cities offer excellent international career opportunities.",
      zh: "荷兰英语普及率居欧洲前列，众多大学提供全英语授课课程。阿姆斯特丹等城市是商业、科技和设计的中心，拥有优越的国际职业发展机会。",
    },
    studentVisa: {
      name: { ja: "学生居住許可（MVV + 居住許可）", en: "Student Residence Permit (MVV + Residence)", zh: "学生居留许可（MVV + 居留许可）" },
      requirements: {
        ja: ["大学の入学許可書（日本はMVV免除の場合あり）", "財政証明書（月€1,000以上）", "健康保険", "住宅確保証明", "申請は大学経由が一般的"],
        en: ["University acceptance letter (Japanese may be MVV-exempt)", "Financial proof (€1,000+/month)", "Health insurance", "Proof of accommodation", "Application often via the university"],
        zh: ["大学录取通知书（日本人可能免除MVV）", "经济证明（每月€1,000以上）", "医疗保险", "住宿证明", "通常通过大学申请"],
      },
      duration: { ja: "就学期間（1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "居住許可申請料€225", en: "Residence permit fee €225", zh: "居留许可申请费€225" },
    },
    costs: {
      tuitionMin: 8000,
      tuitionMax: 20000,
      livingMin: 900,
      livingMax: 2000,
      currency: "EUR",
      currencySymbol: "€",
    },
    popularCities: {
      ja: ["アムステルダム", "デルフト", "アイントホーフェン", "ロッテルダム", "ユトレヒト"],
      en: ["Amsterdam", "Delft", "Eindhoven", "Rotterdam", "Utrecht"],
      zh: ["阿姆斯特丹", "代尔夫特", "埃因霍温", "鹿特丹", "乌得勒支"],
    },
    popularUniversities: {
      ja: ["デルフト工科大学（TU Delft）", "アムステルダム大学", "エラスムス大学ロッテルダム", "アイントホーフェン工科大学", "ワーヘニンゲン大学"],
      en: ["Delft University of Technology (TU Delft)", "University of Amsterdam", "Erasmus University Rotterdam", "Eindhoven University of Technology", "Wageningen University"],
      zh: ["代尔夫特理工大学（TU Delft）", "阿姆斯特丹大学", "鹿特丹伊拉斯姆斯大学", "埃因霍温理工大学", "瓦赫宁根大学"],
    },
    tips: {
      ja: ["ほぼすべての国民が英語を話すため、生活に困らない", "自転車文化が根付いており移動手段として便利", "30%ルーリング（外国人向け税制）で就職後の税負担を軽減できる可能性あり", "学費は英語圏に比べて安め"],
      en: ["Almost everyone speaks excellent English — no language barrier in daily life", "Cycling is the primary mode of transport", "30% ruling may reduce your tax burden when working after graduation", "Tuition is lower than in English-speaking countries"],
      zh: ["几乎所有人都会说流利英语，日常生活无语言障碍", "自行车是主要交通工具", "30%裁定制度可能减轻毕业后工作的税务负担", "学费低于英语国家"],
    },
    japaneseInfo: {
      ja: "アムステルダムには日本人コミュニティがあり、日系企業も進出しています。オランダは日本との経済的つながりが強く、就職後も活躍しやすい環境です。",
      en: "Amsterdam has a Japanese community and a number of Japanese companies. The Netherlands has strong economic ties with Japan, making it a good base for careers in international business.",
      zh: "阿姆斯特丹拥有日本人社区，日系企业也在此落户。荷兰与日本经济联系紧密，毕业后在国际商业领域发展的机会较多。",
    },
  },

  CH: {
    code: "CH",
    overview: {
      ja: "スイスはETH チューリッヒ・EPFLなど世界トップクラスの大学を有し、工学・自然科学・経営学分野で特に高い評価を受けています。4つの公用語（ドイツ語・フランス語・イタリア語・ロマンシュ語）の環境で多言語スキルを磨けます。生活費は高いですが、給与水準も非常に高い国です。",
      en: "Switzerland is home to ETH Zurich and EPFL — two of the world's top universities — with exceptional programs in engineering, natural sciences, and business. Its multilingual environment (German, French, Italian, Romansh) is a unique asset for language learners.",
      zh: "瑞士拥有苏黎世联邦理工学院（ETH）和洛桑联邦理工学院（EPFL）等世界顶尖大学，在工程、自然科学和商科领域评价极高。四种官方语言的环境（德语、法语、意大利语、罗曼什语）是语言学习者的独特优势。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（Visum D / 居住許可）", en: "Student Visa (Visum D / Residence Permit)", zh: "学生签证（Visum D / 居留许可）" },
      requirements: {
        ja: ["大学の入学許可書", "財政証明書（年CHF21,000以上）", "健康保険加入証明", "住宅確保証明", "語学力証明（ドイツ語C1またはフランス語B2等）"],
        en: ["University acceptance letter", "Financial proof (CHF21,000+/year)", "Health insurance", "Proof of accommodation", "Language proof (German C1 or French B2 etc.)"],
        zh: ["大学录取通知书", "经济证明（每年CHF21,000以上）", "医疗保险证明", "住宿证明", "语言能力证明（德语C1或法语B2等）"],
      },
      duration: { ja: "就学期間（年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "申請料CHF80〜200程度", en: "Application fee approx. CHF80–200", zh: "申请费约CHF80至200" },
    },
    costs: {
      tuitionMin: 730,
      tuitionMax: 35000,
      livingMin: 1500,
      livingMax: 3500,
      currency: "CHF",
      currencySymbol: "CHF",
    },
    popularCities: {
      ja: ["チューリッヒ", "ジュネーブ", "ローザンヌ", "バーゼル", "ベルン"],
      en: ["Zurich", "Geneva", "Lausanne", "Basel", "Bern"],
      zh: ["苏黎世", "日内瓦", "洛桑", "巴塞尔", "伯尔尼"],
    },
    popularUniversities: {
      ja: ["ETHチューリッヒ（世界トップ工科大学）", "EPFL（ローザンヌ工科大学）", "チューリッヒ大学", "ジュネーブ大学", "IMD（ビジネススクール）"],
      en: ["ETH Zurich (top global tech university)", "EPFL (Lausanne)", "University of Zurich", "University of Geneva", "IMD Business School"],
      zh: ["苏黎世联邦理工学院（ETH，全球顶尖理工大学）", "洛桑联邦理工学院（EPFL）", "苏黎世大学", "日内瓦大学", "IMD商学院"],
    },
    tips: {
      ja: ["ETH・EPFLの公立大学は学費が年間CHF730程度と安い", "生活費はヨーロッパ最高水準のため資金計画が重要", "卒業後は高水準の給与が期待できる（製薬・金融・テックなど）", "スキーやハイキングなど自然アクティビティが豊富"],
      en: ["ETH and EPFL public university tuition is only ~CHF730/year", "Cost of living is the highest in Europe — budget planning is essential", "Graduates can expect high salaries in pharma, finance, and tech", "Excellent outdoor activities: skiing, hiking, and more"],
      zh: ["ETH和EPFL公立大学学费每年仅约CHF730", "生活成本是欧洲最高，财务规划至关重要", "毕业后可在制药、金融和科技领域期待高薪", "户外活动丰富：滑雪、徒步等"],
    },
    japaneseInfo: {
      ja: "スイスには在スイス日本大使館のサポートがあります。チューリッヒ・ジュネーブには日本人コミュニティが存在し、日系企業も多数進出しています。",
      en: "Switzerland has a Japanese embassy and consulates providing support for students. Both Zurich and Geneva have Japanese communities and Japanese companies.",
      zh: "瑞士驻日本大使馆为学生提供支持。苏黎世和日内瓦均拥有日本人社区，日系企业也大量进驻。",
    },
  },

  ES: {
    code: "ES",
    overview: {
      ja: "スペインはアート・建築・フラメンコ・スペイン語学習など多彩な分野で留学先として人気です。スペイン語は世界で約5億人が話す言語で、習得すると中南米でのキャリアにも直結します。物価はヨーロッパの中でも安く、温暖な気候と活気ある文化が魅力です。",
      en: "Spain is a popular study destination for art, architecture, flamenco, and Spanish language learning. Spanish is spoken by ~500 million people worldwide, making it a valuable career asset for Latin American markets. Affordable cost of living and warm climate add to its appeal.",
      zh: "西班牙在艺术、建筑、弗拉门戈和西班牙语学习等领域深受留学生欢迎。西班牙语拥有约5亿使用者，掌握它将直接提升在拉丁美洲的职业竞争力。生活成本在欧洲较为低廉，温暖气候和活力文化更增添吸引力。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（Visado de Estudios）", en: "Student Visa (Visado de Estudios)", zh: "学生签证（Visado de Estudios）" },
      requirements: {
        ja: ["入学許可書", "財政証明書（月€700以上）", "健康保険加入証明", "犯罪歴証明書", "ビザ申請料€60〜80"],
        en: ["Enrollment letter", "Financial proof (€700+/month)", "Health insurance", "Criminal background check", "Visa fee €60–80"],
        zh: ["录取通知书", "经济证明（每月€700以上）", "医疗保险证明", "无犯罪记录证明", "签证费€60至80"],
      },
      duration: { ja: "就学期間（1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "ビザ申請料€60〜80", en: "Visa fee €60–80", zh: "签证费€60至80" },
    },
    costs: {
      tuitionMin: 1000,
      tuitionMax: 20000,
      livingMin: 700,
      livingMax: 1500,
      currency: "EUR",
      currencySymbol: "€",
    },
    popularCities: {
      ja: ["マドリード", "バルセロナ", "バレンシア", "セビリア", "グラナダ"],
      en: ["Madrid", "Barcelona", "Valencia", "Seville", "Granada"],
      zh: ["马德里", "巴塞罗那", "瓦伦西亚", "塞维利亚", "格拉纳达"],
    },
    popularUniversities: {
      ja: ["マドリード・コンプルテンセ大学", "バルセロナ大学", "ポンペウ・ファブラ大学", "IEビジネススクール", "セルバンテス文化センター（スペイン語）"],
      en: ["Complutense University of Madrid", "University of Barcelona", "Pompeu Fabra University", "IE Business School", "Instituto Cervantes (Spanish language)"],
      zh: ["马德里康普顿斯大学", "巴塞罗那大学", "庞培法布拉大学", "IE商学院", "塞万提斯学院（西班牙语）"],
    },
    tips: {
      ja: ["公立大学の学費はEU圏の中でも安め（年間€1,000〜）", "シエスタ文化など日本と異なる生活リズムに慣れることが必要", "スペイン語は習得後に南米でも活用できる", "バルセロナはアートとデザインの都市としても有名"],
      en: ["Public university tuition is affordable (~€1,000+/year)", "Be ready to adapt to local rhythms — siesta culture and late evenings are the norm", "Spanish skills open doors across Latin America", "Barcelona is world-famous for art, architecture, and design"],
      zh: ["公立大学学费在欧洲较为低廉（每年约€1,000以上）", "需适应当地生活节奏——午睡文化和晚间活动是常态", "掌握西班牙语可在整个拉丁美洲拓展机会", "巴塞罗那以艺术、建筑和设计闻名于世"],
    },
    japaneseInfo: {
      ja: "マドリード・バルセロナには日本人コミュニティがあります。スペインは日本との文化交流も活発で、スペイン語と日本語を活かした仕事も多くあります。",
      en: "Madrid and Barcelona have active Japanese communities. Spain has strong cultural ties with Japan, and bilingual Japanese-Spanish professionals are in demand.",
      zh: "马德里和巴塞罗那拥有活跃的日本人社区。西班牙与日本文化交流频繁，日西双语专业人才需求旺盛。",
    },
  },

  PT: {
    code: "PT",
    overview: {
      ja: "ポルトガルは温暖な気候・低い物価・美しい自然で近年急速に人気が高まっている留学先です。デジタルノマドビザや NHR（非居住者税制）など外国人に優しい制度があります。英語教育も充実しており、ヨーロッパ留学の穴場として注目されています。",
      en: "Portugal has rapidly gained popularity as a study destination thanks to its warm climate, affordable living, and expat-friendly policies like the Digital Nomad Visa and NHR tax regime. English-taught programs are growing at Portuguese universities.",
      zh: "葡萄牙以温暖气候、低廉物价和优美自然风光迅速成为热门留学目的地。数字游民签证和NHR税制等对外国人友好的政策更增添了吸引力。葡萄牙大学的英语授课课程也在不断增加。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（Visto de Estudo）", en: "Student Visa (Visto de Estudo)", zh: "学生签证（Visto de Estudo）" },
      requirements: {
        ja: ["入学許可書", "財政証明書（月€760以上）", "健康保険加入証明", "滞在先証明", "ビザ申請料€90"],
        en: ["Enrollment letter", "Financial proof (€760+/month)", "Health insurance", "Proof of accommodation", "Visa fee €90"],
        zh: ["录取通知书", "经济证明（每月€760以上）", "医疗保险证明", "住宿证明", "签证费€90"],
      },
      duration: { ja: "就学期間（1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "ビザ申請料€90", en: "Visa fee €90", zh: "签证费€90" },
    },
    costs: {
      tuitionMin: 1000,
      tuitionMax: 7000,
      livingMin: 600,
      livingMax: 1400,
      currency: "EUR",
      currencySymbol: "€",
    },
    popularCities: {
      ja: ["リスボン", "ポルト", "コインブラ", "ブラガ"],
      en: ["Lisbon", "Porto", "Coimbra", "Braga"],
      zh: ["里斯本", "波尔图", "科英布拉", "布拉加"],
    },
    popularUniversities: {
      ja: ["リスボン大学", "ポルト大学", "コインブラ大学（欧州最古の大学のひとつ）", "Nova SBE（ビジネス）", "テクニコ・リスボア（工学）"],
      en: ["University of Lisbon", "University of Porto", "University of Coimbra (one of Europe's oldest)", "Nova SBE (Business)", "Técnico Lisboa (Engineering)"],
      zh: ["里斯本大学", "波尔图大学", "科英布拉大学（欧洲最古老大学之一）", "Nova SBE（商科）", "里斯本理工学院（工程）"],
    },
    tips: {
      ja: ["学費はヨーロッパ最安水準（年€1,000〜）", "英語話者が多くポルトガル語が話せなくても生活できる", "NHR制度（税制優遇）や D8デジタルノマドビザも選択肢のひとつ", "リスボン・ポルトはテックスタートアップのハブとして急成長中"],
      en: ["Tuition is among the lowest in Europe (~€1,000/year)", "Many Portuguese speak English well — manageable without Portuguese", "NHR tax regime and D8 Digital Nomad Visa offer attractive options for graduates", "Lisbon and Porto are booming tech and startup hubs"],
      zh: ["学费是欧洲最低水平之一（每年约€1,000）", "许多葡萄牙人英语流利，不会葡语也能正常生活", "NHR税制和D8数字游民签证为毕业生提供了有吸引力的选择", "里斯本和波尔图是快速成长的科技创业中心"],
    },
    japaneseInfo: {
      ja: "リスボンには日本人コミュニティがあり、日本食レストランも増えています。ポルトガルは治安が良く、日本人留学生にとって安心して生活できる国として人気が高まっています。",
      en: "Lisbon has a growing Japanese community with Japanese restaurants and expat networks. Portugal's excellent safety record makes it a comfortable choice for Japanese students.",
      zh: "里斯本的日本人社区不断壮大，日本料理餐厅也在增加。葡萄牙治安良好，越来越受到日本留学生的青睐。",
    },
  },

  SE: {
    code: "SE",
    overview: {
      ja: "スウェーデンはイノベーション・デザイン・サステナビリティ分野で世界をリードする国で、多くの大学が英語で授業を提供しています。EU圏外からの留学生には学費がかかりますが、奨学金制度が充実しており、高福祉・高品質な生活環境が整っています。",
      en: "Sweden is a world leader in innovation, design, and sustainability, with many universities offering English-taught programs. While tuition fees apply for non-EU students, scholarships are available, and the quality of life is exceptionally high.",
      zh: "瑞典在创新、设计和可持续发展领域引领全球，众多大学提供英语授课课程。虽然非欧盟留学生需缴纳学费，但奖学金机会丰富，生活质量极高。",
    },
    studentVisa: {
      name: { ja: "学生居住許可（Uppehållstillstånd）", en: "Student Residence Permit (Uppehållstillstånd)", zh: "学生居留许可（Uppehållstillstånd）" },
      requirements: {
        ja: ["大学の入学許可書", "財政証明書（月SEK8,514以上）", "健康保険", "申請料SEK1,000"],
        en: ["University acceptance letter", "Financial proof (SEK8,514+/month)", "Health insurance", "Application fee SEK1,000"],
        zh: ["大学录取通知书", "经济证明（每月SEK8,514以上）", "医疗保险", "申请费SEK1,000"],
      },
      duration: { ja: "就学期間（1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "申請料SEK1,000（約¥14,000）", en: "Application fee SEK1,000 (approx. ¥14,000)", zh: "申请费SEK1,000（约¥14,000）" },
    },
    costs: {
      tuitionMin: 80000,
      tuitionMax: 200000,
      livingMin: 8000,
      livingMax: 18000,
      currency: "SEK",
      currencySymbol: "kr",
    },
    popularCities: {
      ja: ["ストックホルム", "ヨーテボリ", "マルメ", "ルンド", "ウプサラ"],
      en: ["Stockholm", "Gothenburg", "Malmö", "Lund", "Uppsala"],
      zh: ["斯德哥尔摩", "哥德堡", "马尔默", "隆德", "乌普萨拉"],
    },
    popularUniversities: {
      ja: ["ストックホルム大学", "王立工科大学（KTH）", "カロリンスカ研究所（医学）", "ルンド大学", "チャルマース工科大学"],
      en: ["Stockholm University", "KTH Royal Institute of Technology", "Karolinska Institutet (Medicine)", "Lund University", "Chalmers University of Technology"],
      zh: ["斯德哥尔摩大学", "皇家理工学院（KTH）", "卡罗林斯卡研究所（医学）", "隆德大学", "查尔姆斯理工大学"],
    },
    tips: {
      ja: ["スウェーデン政府奨学金（SI奨学金）が日本人にも開放されている", "冬は非常に寒く日照時間が短いため精神的な準備が必要", "SpotifyやIKEAなどの発祥地でありスタートアップ文化が盛ん", "自転車・公共交通が発達しており生活しやすい"],
      en: ["Swedish Institute (SI) scholarships are available for Japanese students", "Winters are very cold and dark — mental preparation helps", "Birthplace of Spotify, IKEA, and a thriving startup culture", "Excellent public transport and cycling infrastructure"],
      zh: ["瑞典学院（SI）奖学金向日本学生开放", "冬季极寒且日照时间短，需做好心理准备", "Spotify和IKEA的发源地，创业文化蓬勃发展", "公共交通和自行车基础设施完善，生活便利"],
    },
    japaneseInfo: {
      ja: "ストックホルムには日本人コミュニティがあり、在スウェーデン日本大使館のサポートも受けられます。スウェーデンの企業文化はフラットで働きやすく、日本人エンジニア・デザイナーにも人気があります。",
      en: "Stockholm has a Japanese community and support from the Japanese Embassy in Sweden. Swedish flat corporate culture is popular with Japanese engineers and designers.",
      zh: "斯德哥尔摩拥有日本人社区，可获得日本驻瑞典大使馆的支持。瑞典扁平化的企业文化深受日本工程师和设计师的青睐。",
    },
  },

  HK: {
    code: "HK",
    overview: {
      ja: "香港はアジアの国際金融センターとして、ビジネス・金融・法律などの分野で世界的に評価の高い大学が集まっています。英語と中国語（広東語・北京語）が日常的に使われており、アジアビジネスのキャリアを目指す留学生に最適です。",
      en: "Hong Kong is a world-class international financial center with globally ranked universities in business, finance, and law. English and Chinese (Cantonese/Mandarin) are used daily, making it ideal for students targeting careers in Asian business.",
      zh: "香港是国际金融中心，拥有多所在商科、金融和法律领域享有全球声誉的大学。英语和中文（粤语/普通话）日常并用，非常适合以亚洲商业职业为目标的留学生。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（入境許可証）", en: "Student Entry Permit", zh: "学生入境许可证" },
      requirements: {
        ja: ["大学の入学許可書", "パスポート", "財政証明書", "入学する大学が代理で申請するケースが多い", "申請料HKD$230"],
        en: ["University acceptance letter", "Valid passport", "Financial proof", "Usually applied through the university", "Application fee HKD$230"],
        zh: ["大学录取通知书", "有效护照", "经济证明", "通常由大学代为申请", "申请费HKD$230"],
      },
      duration: { ja: "就学期間中", en: "Duration of study", zh: "学习期间" },
      cost: { ja: "申請料HKD$230（約¥4,500）", en: "Application fee HKD$230 (approx. ¥4,500)", zh: "申请费HKD$230（约¥4,500）" },
    },
    costs: {
      tuitionMin: 120000,
      tuitionMax: 200000,
      livingMin: 8000,
      livingMax: 20000,
      currency: "HKD",
      currencySymbol: "HK$",
    },
    popularCities: {
      ja: ["香港島", "九龍", "新界"],
      en: ["Hong Kong Island", "Kowloon", "New Territories"],
      zh: ["香港岛", "九龙", "新界"],
    },
    popularUniversities: {
      ja: ["香港大学（HKU）", "香港科技大学（HKUST）", "香港中文大学（CUHK）", "香港城市大学（CityU）", "香港理工大学（PolyU）"],
      en: ["University of Hong Kong (HKU)", "HKUST", "Chinese University of Hong Kong (CUHK)", "City University of Hong Kong (CityU)", "Hong Kong Polytechnic University (PolyU)"],
      zh: ["香港大学（HKU）", "香港科技大学（HKUST）", "香港中文大学（CUHK）", "香港城市大学（CityU）", "香港理工大学（PolyU）"],
    },
    tips: {
      ja: ["HKU・HKUSTは世界大学ランキングで常に上位にランクイン", "英語・広東語・北京語の3言語環境でマルチリンガルになれる", "香港は法人税・所得税が低く、ビジネスに有利な環境", "物価・家賃は非常に高い（世界最高水準）"],
      en: ["HKU and HKUST consistently rank among the world's top universities", "Trilingual environment (English, Cantonese, Mandarin) is a unique advantage", "Low corporate and income taxes make Hong Kong business-friendly", "Cost of living and rent are among the highest in the world"],
      zh: ["港大和科大始终位居全球顶尖大学之列", "英语、粤语、普通话三语环境是独特优势", "低企业税和所得税，营商环境极具竞争力", "生活成本和租金居全球最高水准之列"],
    },
    japaneseInfo: {
      ja: "香港には大規模な日本人コミュニティがあり、日系企業も多数進出しています。日本総領事館のサポートも充実しており、日本食・日本語対応サービスも豊富です。",
      en: "Hong Kong has a large and well-established Japanese expat community, with many Japanese companies, Japanese restaurants, and support from the Japanese Consulate-General.",
      zh: "香港拥有规模庞大且成熟的日本人社区，日系企业众多，日本料理丰富，日本总领事馆支持完善。",
    },
  },

  JP: {
    code: "JP",
    overview: {
      ja: "日本は海外からの留学先として人気が急上昇しています。アニメ・マンガ・武道・茶道など日本文化を学びたい外国人に特に人気ですが、日本語を母語とする方が他国の大学に入学するための日本国内大学での英語プログラムも充実しています。アジアビジネスの拠点として東京・大阪は国際的な教育環境を提供しています。",
      en: "Japan is a rapidly growing study destination, especially popular among those interested in Japanese culture, language, anime, martial arts, and tea ceremony. English-taught programs at Japanese universities are also expanding, making Japan an option for study within Asia.",
      zh: "日本作为留学目的地人气迅速上升，尤其受对日本文化、语言、动漫、武道和茶道感兴趣的学生欢迎。日本大学的英语授课课程也在不断扩大，使其成为亚洲内部留学的选择之一。",
    },
    studentVisa: {
      name: { ja: "留学ビザ（在留資格・留学）", en: "Student Visa (Zairyu Shikaku - Study)", zh: "留学签证（在留资格·留学）" },
      requirements: {
        ja: ["日本の大学・日本語学校からの入学許可書", "在留資格認定証明書（学校が申請代行）", "パスポート", "財政証明書", "ビザ申請は在外日本大使館・領事館で"],
        en: ["Acceptance letter from Japanese institution", "Certificate of Eligibility (applied by school)", "Valid passport", "Financial proof", "Visa application at Japanese Embassy/Consulate"],
        zh: ["日本院校录取通知书", "在留资格认定证明书（学校代为申请）", "有效护照", "经济证明", "在当地日本大使馆/领事馆申请签证"],
      },
      duration: { ja: "就学期間（最長4年3ヶ月、更新可）", en: "Duration of study (up to 4 years 3 months, renewable)", zh: "学习期间（最长4年3个月，可续签）" },
      cost: { ja: "短期無料・長期約¥3,000", en: "Short-stay free; long-stay approx. ¥3,000", zh: "短期免费；长期约¥3,000" },
    },
    costs: { tuitionMin: 500000, tuitionMax: 1500000, livingMin: 80000, livingMax: 180000, currency: "JPY", currencySymbol: "¥" },
    popularCities: { ja: ["東京", "大阪", "京都", "福岡", "名古屋"], en: ["Tokyo", "Osaka", "Kyoto", "Fukuoka", "Nagoya"], zh: ["东京", "大阪", "京都", "福冈", "名古屋"] },
    popularUniversities: { ja: ["東京大学", "京都大学", "早稲田大学", "慶應義塾大学", "東京工業大学"], en: ["University of Tokyo", "Kyoto University", "Waseda University", "Keio University", "Tokyo Institute of Technology"], zh: ["东京大学", "京都大学", "早稻田大学", "庆应义塾大学", "东京工业大学"] },
    tips: { ja: ["文科省の国費奨学金など充実した奨学金あり", "アルバイトは週28時間まで許可", "JLPT N2以上取得で就職に有利", "東京・大阪は生活費が高め、地方は安い"], en: ["MEXT scholarships are generous for international students", "Part-time work up to 28 hours/week permitted", "JLPT N2+ improves job prospects significantly", "Tokyo/Osaka are expensive; regional cities are affordable"], zh: ["文部科学省国费奖学金资源丰富", "每周最多允许打工28小时", "JLPT N2以上有助于在日就业", "东京大阪生活成本高，地方城市相对便宜"] },
    japaneseInfo: { ja: "日本への留学は日本語・文化・ビジネス慣習を深く理解する最良の機会です。留学後に日本企業でキャリアを築く外国人も増えています。", en: "Studying in Japan offers deep understanding of language, culture, and business etiquette. An increasing number of international graduates pursue careers at Japanese companies.", zh: "赴日留学是深入了解日语、文化和商业礼仪的最佳机会，越来越多的国际毕业生在日本企业发展职业。" },
  },

  ID: {
    code: "ID",
    overview: {
      ja: "インドネシアは東南アジア最大の経済大国で急成長中。バリ島を中心にデジタルノマドや語学学習者に人気が高まっており、物価が非常に安く長期滞在のコストを抑えられます。",
      en: "Indonesia is Southeast Asia's largest and fastest-growing economy. Bali has become a hub for digital nomads and language learners, with very low living costs ideal for long-term stays.",
      zh: "印度尼西亚是东南亚最大且增长最快的经济体。巴厘岛已成为数字游民和语言学习者的聚集地，极低的生活成本非常适合长期居留。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（Visa Pelajar）", en: "Student Visa (Visa Pelajar)", zh: "学生签证（Visa Pelajar）" },
      requirements: {
        ja: ["入学許可書", "パスポート（有効期限18ヶ月以上）", "財政証明書", "健康診断書", "申請料USD$50〜"],
        en: ["Acceptance letter", "Passport valid 18+ months", "Financial proof", "Health certificate", "Visa fee USD$50+"],
        zh: ["录取通知书", "护照（有效期18个月以上）", "经济证明", "健康证明", "签证费USD$50以上"],
      },
      duration: { ja: "就学期間（1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "申請料USD$50〜", en: "Application fee USD$50+", zh: "申请费USD$50以上" },
    },
    costs: { tuitionMin: 10000000, tuitionMax: 50000000, livingMin: 3000000, livingMax: 10000000, currency: "IDR", currencySymbol: "Rp" },
    popularCities: { ja: ["バリ（ウブド・チャングー）", "ジャカルタ", "スラバヤ", "ジョグジャカルタ"], en: ["Bali (Ubud / Canggu)", "Jakarta", "Surabaya", "Yogyakarta"], zh: ["巴厘岛（乌布/水明漾）", "雅加达", "泗水", "日惹"] },
    popularUniversities: { ja: ["インドネシア大学（UI）", "バンドン工科大学（ITB）", "ガジャマダ大学", "バリ語学学校（多数）", "RMIT大学インドネシア校"], en: ["University of Indonesia (UI)", "Bandung Institute of Technology (ITB)", "Gadjah Mada University", "Bali language schools (many)", "RMIT University Indonesia"], zh: ["印度尼西亚大学（UI）", "万隆理工学院（ITB）", "加贾马达大学", "巴厘岛语言学校（众多）", "RMIT大学印尼校区"] },
    tips: { ja: ["バリ島は世界有数のデジタルノマドハブ", "生活費は東南アジアでも最安水準", "インドネシア語は文法が比較的シンプル", "熱帯性気候で年間温暖"], en: ["Bali is one of the world's top digital nomad hubs", "Cost of living is very low even by Southeast Asian standards", "Bahasa Indonesia has relatively simple grammar", "Tropical climate is warm year-round"], zh: ["巴厘岛是全球顶级数字游民中心之一", "即使在东南亚，生活成本也属极低水平", "印度尼西亚语语法相对简单", "热带气候全年温暖"] },
    japaneseInfo: { ja: "バリ島・ジャカルタには日本人コミュニティがあります。日系企業の進出も多く、製造業・IT・観光での就職機会も豊富です。", en: "Bali and Jakarta have Japanese communities. Many Japanese companies operate here, offering opportunities in manufacturing, IT, and tourism.", zh: "巴厘岛和雅加达拥有日本人社区，日系企业众多，在制造业、IT和旅游业提供丰富机会。" },
  },

  VN: {
    code: "VN",
    overview: {
      ja: "ベトナムは急成長するASEAN諸国のひとつで、ホーチミン・ハノイを中心にビジネス・語学留学の拠点として人気が高まっています。物価が非常に安く、日系企業の進出も多く、留学後のキャリアパスも描きやすい国です。",
      en: "Vietnam is one of ASEAN's fastest-growing economies. Ho Chi Minh City and Hanoi are growing hubs for business and language study, with very low living costs and strong Japanese corporate presence offering clear post-graduation career paths.",
      zh: "越南是东盟增长最快的经济体之一。胡志明市和河内是商业和语言学习的新兴中心，生活成本极低，日系企业众多，毕业后职业发展路径清晰。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（DH ビザ）", en: "Student Visa (DH Visa)", zh: "学生签证（DH签证）" },
      requirements: {
        ja: ["入学許可書", "パスポート", "財政証明書", "健康診断書", "申請料USD$25〜"],
        en: ["Acceptance letter", "Valid passport", "Financial proof", "Health certificate", "Application fee USD$25+"],
        zh: ["录取通知书", "有效护照", "经济证明", "健康证明", "申请费USD$25以上"],
      },
      duration: { ja: "就学期間（1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "申請料USD$25〜", en: "Application fee USD$25+", zh: "申请费USD$25以上" },
    },
    costs: { tuitionMin: 20000000, tuitionMax: 80000000, livingMin: 5000000, livingMax: 15000000, currency: "VND", currencySymbol: "₫" },
    popularCities: { ja: ["ホーチミン市", "ハノイ", "ダナン", "ホイアン"], en: ["Ho Chi Minh City", "Hanoi", "Da Nang", "Hoi An"], zh: ["胡志明市", "河内", "岘港", "会安"] },
    popularUniversities: { ja: ["ベトナム国家大学ハノイ", "ベトナム国家大学ホーチミン", "ハノイ外国語大学", "ベトナム語学校（多数）", "RMIT大学ベトナム校"], en: ["Vietnam National University Hanoi", "Vietnam National University HCMC", "Hanoi University", "Vietnamese language schools (many)", "RMIT University Vietnam"], zh: ["越南国家大学河内", "越南国家大学胡志明", "河内外国语大学", "越南语语言学校（众多）", "RMIT大学越南校区"] },
    tips: { ja: ["ベトナム語は声調言語で習得に時間がかかるが日系企業での需要が高い", "生活費は東南アジア最安水準", "グラブ（Grab）が交通手段として便利", "ホーチミンはビジネス、ハノイは文化・歴史が豊か"], en: ["Vietnamese is tonal but highly valued at Japanese companies", "Living costs are among the lowest in Southeast Asia", "Grab is the most convenient transport", "Ho Chi Minh City is a business hub; Hanoi is rich in culture"], zh: ["越南语是声调语言，但在日系企业中需求旺盛", "生活成本是东南亚最低水准之一", "Grab是最方便的出行方式", "胡志明市是商业中心，河内文化历史底蕴深厚"] },
    japaneseInfo: { ja: "ホーチミン市・ハノイには多くの日系企業が進出し、日本人コミュニティも充実。日本語を活かした就職・インターン機会が豊富です。", en: "Many Japanese companies operate in Ho Chi Minh City and Hanoi with established Japanese communities. Japanese-language career and internship opportunities are growing.", zh: "胡志明市和河内聚集众多日系企业，日本人社区完善，以日语为优势的就业和实习机会快速增长。" },
  },

  AE: {
    code: "AE",
    overview: {
      ja: "UAE（ドバイ・アブダビ）は所得税ゼロの国際ビジネスハブで、世界中のビジネス・金融・テクノロジー人材が集まります。多くの世界トップ大学のキャンパスが進出しており、砂漠の都市でグローバルな教育環境を体験できます。",
      en: "The UAE (Dubai / Abu Dhabi) is a zero-income-tax international business hub attracting global talent. Many top universities have branch campuses here, offering a world-class education in a dynamic desert metropolis.",
      zh: "阿联酋（迪拜/阿布扎比）是零所得税的国际商业中心，吸引全球精英。众多世界顶尖大学在此设有分校，可在充满活力的沙漠大都市体验世界级教育。",
    },
    studentVisa: {
      name: { ja: "UAE 学生ビザ", en: "UAE Student Visa", zh: "阿联酋学生签证" },
      requirements: {
        ja: ["UAE教育機関の入学許可書", "パスポート（有効期限6ヶ月以上）", "健康診断・医療検査", "財政証明書", "ビザは通常大学経由で申請"],
        en: ["Acceptance from UAE institution", "Passport valid 6+ months", "Medical examination", "Financial proof", "Usually applied through the university"],
        zh: ["阿联酋院校录取通知书", "护照（有效期6个月以上）", "体检报告", "经济证明", "通常通过大学申请"],
      },
      duration: { ja: "就学期間（1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "約AED2,000〜3,000（大学経由）", en: "Approx. AED2,000–3,000 (via university)", zh: "约AED2,000至3,000（通过大学）" },
    },
    costs: { tuitionMin: 40000, tuitionMax: 90000, livingMin: 4000, livingMax: 10000, currency: "AED", currencySymbol: "AED" },
    popularCities: { ja: ["ドバイ", "アブダビ", "シャルジャ"], en: ["Dubai", "Abu Dhabi", "Sharjah"], zh: ["迪拜", "阿布扎比", "沙迦"] },
    popularUniversities: { ja: ["NYUアブダビ", "ソルボンヌ大学アブダビ校", "ヘリオット・ワット大学ドバイ校", "アメリカン大学ドバイ（AUD）", "ドバイ大学"], en: ["NYU Abu Dhabi", "Sorbonne University Abu Dhabi", "Heriot-Watt University Dubai", "American University in Dubai (AUD)", "University of Dubai"], zh: ["纽约大学阿布扎比分校", "索邦大学阿布扎比分校", "赫瑞瓦特大学迪拜分校", "迪拜美国大学（AUD）", "迪拜大学"] },
    tips: { ja: ["所得税ゼロで卒業後の手取りが非常に高い", "ドバイはビジネス・テクノロジーの国際的ハブ", "砂漠気候で夏（5〜9月）は40℃超えの高温", "多国籍社会で英語が通じやすい環境"], en: ["Zero income tax means high take-home pay after graduation", "Dubai is a global hub for business and technology", "Desert climate — summers (May–Sep) exceed 40°C", "Highly international society with English widely spoken"], zh: ["零所得税意味着毕业后到手收入极高", "迪拜是商业和科技的全球中心", "沙漠气候，夏季（5至9月）超过40°C", "国际化程度高，英语广泛通用"] },
    japaneseInfo: { ja: "ドバイには日本人コミュニティがあり、日系企業も進出。日本食レストランや日本語対応サービスも増えています。", en: "Dubai has a Japanese community and Japanese companies. Japanese restaurants and Japanese-language services are growing.", zh: "迪拜拥有日本人社区，日系企业已进驻，日本料理餐厅和日语服务不断增加。" },
  },

  GE: {
    code: "GE",
    overview: {
      ja: "ジョージア（グルジア）はコーカサス地方に位置するヨーロッパとアジアの交差点で、近年デジタルノマドや長期滞在者に非常に人気の国です。日本人はビザなしで1年間滞在可能で、物価が非常に安く語学留学・自己研修に最適です。",
      en: "Georgia (Caucasus) sits at the crossroads of Europe and Asia and has become very popular with digital nomads and long-term visitors. Japanese nationals can stay visa-free for 1 year, with very low costs ideal for language study and self-development.",
      zh: "格鲁吉亚位于欧亚交汇处，近年来深受数字游民和长期居留者的青睐。日本人可免签居留1年，生活成本极低，是语言学习和自我提升的理想之地。",
    },
    studentVisa: {
      name: { ja: "日本人はビザ不要（1年間）", en: "Visa-free for Japanese (1 year)", zh: "日本人免签（1年）" },
      requirements: {
        ja: ["日本人はビザなしで最大1年間滞在可能", "長期居住証明が必要な場合は移民局へ届け出", "パスポート有効期限の確認"],
        en: ["Japanese nationals can stay up to 1 year without a visa", "Register at immigration for long-term stay documents if needed", "Verify passport expiry"],
        zh: ["日本人无需签证可停留最长1年", "如需长期居留证明，向移民局登记", "确认护照有效期"],
      },
      duration: { ja: "最大1年間（ビザなし）", en: "Up to 1 year (visa-free)", zh: "最长1年（免签）" },
      cost: { ja: "無料（ビザ不要）", en: "Free (no visa required)", zh: "免费（无需签证）" },
    },
    costs: { tuitionMin: 3000, tuitionMax: 15000, livingMin: 400, livingMax: 1000, currency: "GEL", currencySymbol: "₾" },
    popularCities: { ja: ["トビリシ", "バトゥミ", "クタイシ"], en: ["Tbilisi", "Batumi", "Kutaisi"], zh: ["第比利斯", "巴统", "库塔伊西"] },
    popularUniversities: { ja: ["トビリシ国立大学", "ジョージア工科大学", "コーカサス大学", "トビリシ語学学校（多数）"], en: ["Tbilisi State University", "Georgian Technical University", "Caucasus University", "Tbilisi language schools (many)"], zh: ["第比利斯国立大学", "格鲁吉亚理工大学", "高加索大学", "第比利斯语言学校（众多）"] },
    tips: { ja: ["日本人はビザなしで1年間滞在できる（世界的にも珍しい優遇）", "生活費はヨーロッパ最安水準（月6〜8万円程度）", "ワインの発祥地とも言われる食文化が豊か", "ジョージア語は独自の文字を持つ特殊な言語"], en: ["Japanese can stay visa-free for 1 year — a rare global privilege", "Living costs among Europe's lowest (~¥60–80k/month)", "Georgia is believed to be the birthplace of wine", "Georgian language uses a unique script"], zh: ["日本人免签居留1年——全球罕见的优惠待遇", "生活成本是欧洲最低水准之一（每月约6至8万日元）", "格鲁吉亚被认为是葡萄酒的发源地", "格鲁吉亚语使用独特文字"] },
    japaneseInfo: { ja: "近年トビリシには日本人ノマドや長期滞在者が増加中。日本人コミュニティのSNSグループも活発で情報交換しやすい環境です。", en: "Tbilisi is seeing a growing number of Japanese nomads and long-term residents, with active Japanese community SNS groups.", zh: "近年来第比利斯的日本游民和长期居留者增加，日语社区社交媒体群组活跃。" },
  },

  NO: {
    code: "NO",
    overview: {
      ja: "ノルウェーは公立大学の授業料が無料（英語コース含む）で、世界最高レベルの福祉制度のもとで高水準の教育を受けられます。石油産業・海洋技術・再生可能エネルギー分野が特に強く、オーロラやフィヨルドなど圧倒的な自然環境も魅力です。",
      en: "Norway offers tuition-free education at public universities including English programs. With a world-class welfare system, strong industries in oil, marine tech, and renewables, plus spectacular Northern Lights and fjords, Norway is a truly unique study destination.",
      zh: "挪威公立大学（包括英语课程）免除学费，在世界一流福利制度下接受高水平教育。石油、海洋技术和可再生能源领域尤为突出，壮观的极光和峡湾是独特的自然魅力。",
    },
    studentVisa: {
      name: { ja: "学生居住許可（Studietillatelse）", en: "Student Residence Permit", zh: "学生居留许可" },
      requirements: {
        ja: ["大学の入学許可書", "財政証明書（年NOK116,239以上）", "住宅確保証明", "英語力証明（B2以上）", "申請料NOK5,900"],
        en: ["University acceptance letter", "Financial proof (NOK116,239+/year)", "Proof of accommodation", "English proficiency (B2+)", "Application fee NOK5,900"],
        zh: ["大学录取通知书", "经济证明（每年NOK116,239以上）", "住宿证明", "英语能力证明（B2以上）", "申请费NOK5,900"],
      },
      duration: { ja: "就学期間（1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "申請料NOK5,900（約¥80,000）", en: "Application fee NOK5,900 (approx. ¥80,000)", zh: "申请费NOK5,900（约¥80,000）" },
    },
    costs: { tuitionMin: 0, tuitionMax: 15000, livingMin: 10000, livingMax: 22000, currency: "NOK", currencySymbol: "kr" },
    popularCities: { ja: ["オスロ", "ベルゲン", "トロンハイム", "トロムソ（オーロラ）"], en: ["Oslo", "Bergen", "Trondheim", "Tromsø (Northern Lights)"], zh: ["奥斯陆", "卑尔根", "特隆赫姆", "特罗姆瑟（极光）"] },
    popularUniversities: { ja: ["オスロ大学", "ノルウェー科学技術大学（NTNU）", "ベルゲン大学", "BIノルウェービジネススクール", "アークティック大学（UiT）"], en: ["University of Oslo", "Norwegian University of Science and Technology (NTNU)", "University of Bergen", "BI Norwegian Business School", "UiT The Arctic University"], zh: ["奥斯陆大学", "挪威科技大学（NTNU）", "卑尔根大学", "BI挪威商学院", "北极大学（UiT）"] },
    tips: { ja: ["公立大学は学費無料だが生活費は非常に高い", "英語が堪能なノルウェー人が多く英語だけで生活可能", "オーロラ・フィヨルドなど世界的な自然体験が可能", "卒業後1年間の求職ビザが取得可能"], en: ["Public university tuition is free but living costs are very high", "Most Norwegians speak excellent English", "Northern Lights and fjords offer world-class nature experiences", "1-year job seeker permit available after graduation"], zh: ["公立大学免学费，但生活成本极高", "大多数挪威人英语流利", "极光和峡湾提供世界级自然体验", "毕业后可获得1年求职许可"] },
    japaneseInfo: { ja: "オスロには日本大使館があり、日本人コミュニティも存在。水産・エネルギー分野での日挪交流も活発です。", en: "Oslo has a Japanese Embassy and community. Norway and Japan have strong exchange in fisheries and energy sectors.", zh: "奥斯陆设有日本大使馆，拥有日本人社区。挪威与日本在水产和能源领域的交流十分活跃。" },
  },

  DK: {
    code: "DK",
    overview: {
      ja: "デンマークは世界幸福度ランキングで常にトップクラスに位置し、デザイン・建築・持続可能性・ノルディック料理などの分野で世界的に有名です。英語コースが充実しており、ワークライフバランスの国際的モデルとして学べます。",
      en: "Denmark consistently tops global happiness indexes and is world-renowned for design, architecture, sustainability, and Nordic cuisine. English-taught programs are widely available, making Denmark a model for work-life balance to study and experience firsthand.",
      zh: "丹麦在全球幸福指数中始终名列前茅，在设计、建筑、可持续发展和北欧美食领域享誉全球。英语授课课程广泛，可亲身体验工作与生活平衡的世界典范。",
    },
    studentVisa: {
      name: { ja: "学生居住許可（Opholdstilladelse）", en: "Student Residence Permit", zh: "学生居留许可" },
      requirements: {
        ja: ["大学の入学許可書", "財政証明書（月DKK6,243以上）", "健康保険", "住宅確保証明", "申請料DKK3,980"],
        en: ["University acceptance letter", "Financial proof (DKK6,243+/month)", "Health insurance", "Proof of accommodation", "Application fee DKK3,980"],
        zh: ["大学录取通知书", "经济证明（每月DKK6,243以上）", "医疗保险", "住宿证明", "申请费DKK3,980"],
      },
      duration: { ja: "就学期間（1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "申請料DKK3,980（約¥85,000）", en: "Application fee DKK3,980 (approx. ¥85,000)", zh: "申请费DKK3,980（约¥85,000）" },
    },
    costs: { tuitionMin: 45000, tuitionMax: 160000, livingMin: 7000, livingMax: 15000, currency: "DKK", currencySymbol: "kr" },
    popularCities: { ja: ["コペンハーゲン", "オーフス", "オーデンセ", "アールボー"], en: ["Copenhagen", "Aarhus", "Odense", "Aalborg"], zh: ["哥本哈根", "奥胡斯", "欧登塞", "奥尔堡"] },
    popularUniversities: { ja: ["コペンハーゲン大学", "デンマーク工科大学（DTU）", "オーフス大学", "コペンハーゲンビジネススクール（CBS）", "デザインスクール・コペンハーゲン"], en: ["University of Copenhagen", "Technical University of Denmark (DTU)", "Aarhus University", "Copenhagen Business School (CBS)", "The Royal Danish Academy"], zh: ["哥本哈根大学", "丹麦技术大学（DTU）", "奥胡斯大学", "哥本哈根商学院（CBS）", "丹麦皇家美术学院"] },
    tips: { ja: ["デンマーク語は難しいがほぼ全員が英語を流暢に話す", "ワークライフバランス文化（Hygge）を体感できる", "デザイン・建築・フードテックで世界トップの教育", "コペンハーゲンは自転車都市で環境に優しい生活"], en: ["Danish is hard but almost everyone speaks fluent English", "Experience Danish work-life balance culture (Hygge) firsthand", "World-leading education in design, architecture, and food tech", "Copenhagen is a cycling city with a sustainable lifestyle"], zh: ["丹麦语较难，但几乎所有人都会说流利英语", "亲身体验丹麦工作与生活平衡文化（Hygge）", "设计、建筑和食品科技领域全球顶尖教育", "哥本哈根是自行车城市，生活方式环保健康"] },
    japaneseInfo: { ja: "コペンハーゲンには日本人コミュニティがあります。レゴやノボ ノルディスクなどデンマーク企業への就職を目指す日本人も多く、北欧と日本のデザイン文化には親和性があります。", en: "Copenhagen has a Japanese community. Many Japanese professionals target careers at Danish companies like LEGO and Novo Nordisk, reflecting shared design culture between Nordic and Japanese traditions.", zh: "哥本哈根拥有日本人社区。许多日本专业人士以乐高和诺和诺德等丹麦企业为目标，北欧与日本设计文化有着显著共通之处。" },
  },

  BR: {
    code: "BR",
    overview: {
      ja: "ブラジルはポルトガル語圏最大の国で、南米最大の経済大国です。サッカー・音楽・カーニバルで世界的に知られ、ポルトガル語習得とともに南米ビジネスのキャリアを目指す留学生に人気です。世界最大の日系人コミュニティ（約150万人）も存在します。",
      en: "Brazil is the largest Portuguese-speaking country and South America's biggest economy. Known for football, music, and Carnival, it's popular with students learning Portuguese while targeting Latin American business careers. Home to the world's largest Japanese diaspora (~1.5 million).",
      zh: "巴西是最大的葡语国家和南美最大的经济体。以足球、音乐和狂欢节闻名，深受学习葡语并以拉丁美洲商业职业为目标的留学生欢迎。拥有全球最大的日裔社区（约150万人）。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（VITEM IV）", en: "Student Visa (VITEM IV)", zh: "学生签证（VITEM IV）" },
      requirements: {
        ja: ["入学許可書", "パスポート（有効期限6ヶ月以上）", "財政証明書", "健康診断・ワクチン接種証明", "申請料USD$20〜"],
        en: ["Acceptance letter", "Passport valid 6+ months", "Financial proof", "Health certificate / vaccination record", "Visa fee USD$20+"],
        zh: ["录取通知书", "护照（有效期6个月以上）", "经济证明", "健康证明/接种记录", "签证费USD$20以上"],
      },
      duration: { ja: "就学期間（1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "申請料USD$20〜", en: "Application fee USD$20+", zh: "申请费USD$20以上" },
    },
    costs: { tuitionMin: 15000, tuitionMax: 50000, livingMin: 2000, livingMax: 5000, currency: "BRL", currencySymbol: "R$" },
    popularCities: { ja: ["サンパウロ", "リオデジャネイロ", "ブラジリア", "フロリアノポリス"], en: ["São Paulo", "Rio de Janeiro", "Brasília", "Florianópolis"], zh: ["圣保罗", "里约热内卢", "巴西利亚", "弗洛里亚诺波利斯"] },
    popularUniversities: { ja: ["サンパウロ大学（USP）", "カンピーナス州立大学（UNICAMP）", "ブラジリア大学（UnB）", "リオ連邦大学（UFRJ）", "ポルトガル語語学学校（多数）"], en: ["University of São Paulo (USP)", "UNICAMP", "University of Brasília (UnB)", "Federal University of Rio de Janeiro (UFRJ)", "Portuguese language schools (many)"], zh: ["圣保罗大学（USP）", "坎皮纳斯州立大学（UNICAMP）", "巴西利亚大学（UnB）", "里约热内卢联邦大学（UFRJ）", "葡语语言学校（众多）"] },
    tips: { ja: ["ポルトガル語（ブラジル方言）は南米ビジネスで非常に有用", "公立大学は学費無料だが競争が激しい", "治安の差があるため住む地域の選択が重要", "音楽・ダンス（サンバ・ボサノバ）文化の体験も醍醐味"], en: ["Brazilian Portuguese is highly valuable for South American business", "Public university tuition is free but highly competitive", "Safety varies widely by area — neighborhood choice is crucial", "Music and dance culture (samba, bossa nova) is a unique experience"], zh: ["巴西葡语对南美商业职业极具价值", "公立大学免学费，但竞争激烈", "各地区治安差异较大，选择居住区域至关重要", "桑巴和波萨诺瓦等音乐舞蹈文化是独特体验"] },
    japaneseInfo: { ja: "ブラジルには世界最大の日系人コミュニティ（約150万人）があります。サンパウロのリベルダーデ地区は日本人街として有名で、日本文化・日本食が生活に溶け込んでいます。", en: "Brazil has the world's largest Japanese diaspora (~1.5 million). São Paulo's Liberdade district is a famous Japanese town with Japanese culture and food deeply embedded in daily life.", zh: "巴西拥有全球最大的日裔社区（约150万人）。圣保罗自由区以日本人街著称，日本文化和料理深深融入日常生活。" },
  },

  CO: {
    code: "CO",
    overview: {
      ja: "コロンビアは南米の中でも特にデジタルノマドや語学留学者に人気が高まっている国です。メデジンはかつての負のイメージを覆し、世界的なテック・イノベーションハブとして変貌を遂げました。スペイン語留学の拠点として物価が安く、コーヒー文化も豊かです。",
      en: "Colombia — especially Medellín — has transformed from its troubled past into a thriving tech and innovation hub. A growing destination for digital nomads and Spanish language students, with very low living costs and world-famous coffee culture.",
      zh: "哥伦比亚，尤其是麦德林，已从昔日的负面形象转变为蓬勃发展的科技创新中心。作为数字游民和西班牙语学习者的热门目的地，生活成本极低，咖啡文化享誉全球。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（Visa V - Estudiante）", en: "Student Visa (Visa V - Estudiante)", zh: "学生签证（V类学生签证）" },
      requirements: {
        ja: ["入学許可書", "パスポート（有効期限6ヶ月以上）", "財政証明書（最低賃金の3倍以上）", "健康保険", "申請料USD$52〜"],
        en: ["Acceptance letter", "Passport valid 6+ months", "Financial proof (3x minimum wage)", "Health insurance", "Application fee USD$52+"],
        zh: ["录取通知书", "护照（有效期6个月以上）", "经济证明（最低工资的3倍以上）", "医疗保险", "申请费USD$52以上"],
      },
      duration: { ja: "就学期間（1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "申請料USD$52〜", en: "Application fee USD$52+", zh: "申请费USD$52以上" },
    },
    costs: { tuitionMin: 3000000, tuitionMax: 20000000, livingMin: 800000, livingMax: 2500000, currency: "COP", currencySymbol: "COL$" },
    popularCities: { ja: ["メデジン", "ボゴタ", "カルタヘナ", "カリ"], en: ["Medellín", "Bogotá", "Cartagena", "Cali"], zh: ["麦德林", "波哥大", "卡塔赫纳", "卡利"] },
    popularUniversities: { ja: ["ロス・アンデス大学", "コロンビア国立大学", "アンティオキア大学", "スペイン語語学学校（多数）", "Nueva Lengua語学学校"], en: ["Universidad de Los Andes", "National University of Colombia", "University of Antioquia", "Spanish language schools (throughout Colombia)", "Nueva Lengua Language School"], zh: ["安第斯大学", "哥伦比亚国立大学", "安蒂奥基亚大学", "西班牙语语言学校（遍布哥伦比亚）", "Nueva Lengua语言学校"] },
    tips: { ja: ["メデジンはかつて「最もイノベーティブな都市」に選ばれたこともある", "生活費は南米の中でも非常に安い", "コロンビアのスペイン語は発音がクリアで学びやすい", "コーヒー農園訪問などユニークな文化体験も可能"], en: ["Medellín was once named the World's Most Innovative City", "Living costs are very low even for South America", "Colombian Spanish has clear pronunciation — great for learners", "Unique cultural experiences include coffee farm visits"], zh: ["麦德林曾被评为全球最具创新力城市", "即使在南美，生活成本也属于极低水平", "哥伦比亚西班牙语发音清晰，非常适合学习", "可体验参观咖啡农场等独特文化活动"] },
    japaneseInfo: { ja: "コロンビアの日本人コミュニティはまだ小規模ですが、メデジン・ボゴタには日本人ノマドや留学生が増えています。在コロンビア日本大使館のサポートを受けることができます。", en: "The Japanese community in Colombia is small but growing — particularly in Medellín and Bogotá. The Japanese Embassy in Colombia provides consular support.", zh: "哥伦比亚的日本人社区规模尚小，但麦德林和波哥大的日本游民和留学生正在增加，日本驻哥伦比亚大使馆提供领事支持。" },
  },

  IT: {
    code: "IT",
    overview: {
      ja: "イタリアはアート・建築・ファッション・料理・音楽など、あらゆるクリエイティブ分野で世界のトップに立つ国です。ローマ・ミラノ・フィレンツェには世界遺産が点在し、その環境で学ぶこと自体が類稀な体験です。イタリア語留学の目的地としても世界的に人気があります。",
      en: "Italy leads the world in art, architecture, fashion, cuisine, and music. Rome, Milan, and Florence are filled with UNESCO World Heritage Sites, making study here an unparalleled experience. Italy is also a top global destination for learning Italian.",
      zh: "意大利在艺术、建筑、时尚、美食和音乐等所有创意领域引领世界。罗马、米兰和佛罗伦萨遍布世界遗产，在这样的环境中学习本身就是无与伦比的体验，也是学习意大利语的全球热门目的地。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（Visto per Studio）", en: "Student Visa (Visto per Studio)", zh: "学生签证（Visto per Studio）" },
      requirements: {
        ja: ["入学許可書", "財政証明書（月€461以上）", "滞在先証明", "健康保険加入証明", "ビザ申請料€116"],
        en: ["Acceptance from university or language school", "Financial proof (€461+/month)", "Proof of accommodation", "Health insurance", "Visa fee €116"],
        zh: ["院校录取通知书", "经济证明（每月€461以上）", "住宿证明", "医疗保险证明", "签证费€116"],
      },
      duration: { ja: "就学期間（1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "ビザ申請料€116", en: "Visa fee €116", zh: "签证费€116" },
    },
    costs: { tuitionMin: 1000, tuitionMax: 20000, livingMin: 700, livingMax: 1600, currency: "EUR", currencySymbol: "€" },
    popularCities: { ja: ["ローマ", "ミラノ", "フィレンツェ", "ボローニャ", "ベネチア"], en: ["Rome", "Milan", "Florence", "Bologna", "Venice"], zh: ["罗马", "米兰", "佛罗伦萨", "博洛尼亚", "威尼斯"] },
    popularUniversities: { ja: ["ボローニャ大学（欧州最古）", "ラ・サピエンツァ大学（ローマ）", "ポリテクニコ・ディ・ミラノ（工学・デザイン）", "ボッコーニ大学（ビジネス）", "美術アカデミー（美術）"], en: ["University of Bologna (oldest in Europe)", "Sapienza University of Rome", "Politecnico di Milano (Engineering & Design)", "Bocconi University (Business)", "Accademia di Belle Arti (Fine Arts)"], zh: ["博洛尼亚大学（欧洲最古老）", "罗马第一大学（萨皮恩扎）", "米兰理工大学（工程与设计）", "博科尼大学（商科）", "国立美术学院（美术）"] },
    tips: { ja: ["公立大学は学費が年€1,000〜と安く所得に応じた減額制度あり", "イタリア語は音楽・料理・ファッション・ビジネスで世界的需要がある", "食・ワイン・アートを日常的に楽しめる豊かな文化環境", "ヨーロッパ内の移動が便利（フライト・鉄道）"], en: ["Public university tuition starts at ~€1,000/year with income-based reductions", "Italian has global demand in music, cuisine, fashion, and business", "Rich daily culture: food, wine, and art as a way of life", "Easy travel across Europe by flight and train"], zh: ["公立大学学费每年约€1,000起，并有基于收入的减免制度", "意大利语在音乐、美食、时尚和商业领域有全球需求", "丰富的日常文化：美食、葡萄酒和艺术融入生活", "欧洲内部交通便利（航班和铁路）"] },
    japaneseInfo: { ja: "イタリアには日本人コミュニティがあり、ローマ・ミラノには日本大使館・総領事館があります。ファッション・デザイン・料理を志す日本人留学生が多く、日伊の文化的親和性も高いです。", en: "Italy has Japanese communities in Rome and Milan with embassies and consulates. Many Japanese students pursue fashion, design, and culinary arts, reflecting the strong cultural affinity between Italy and Japan.", zh: "意大利罗马和米兰拥有日本人社区，设有大使馆和总领事馆。许多日本留学生从事时尚、设计和烹饪艺术，体现了意大利与日本深厚的文化亲和力。" },
  },

  GR: {
    code: "GR",
    overview: {
      ja: "ギリシャは西洋文明の発祥地として哲学・歴史・考古学分野で留学先として独自の魅力を持ちます。近年はデジタルノマドビザの導入や所得税優遇制度などで外国人居住者が増加しています。地中海性気候と美しい島々が魅力的な生活環境を提供します。",
      en: "Greece, the cradle of Western civilization, offers a unique study experience in philosophy, history, and archaeology. Recent initiatives including a Digital Nomad Visa and 50% income tax reduction for new residents have attracted growing numbers of international students.",
      zh: "希腊作为西方文明的发源地，在哲学、历史和考古学领域提供独特的留学体验。数字游民签证和新居民所得税减免50%等新政策吸引了越来越多的国际学生。地中海气候和美丽的岛屿提供了迷人的生活环境。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（Visa Type D）", en: "Student Visa (Type D)", zh: "学生签证（D类签证）" },
      requirements: {
        ja: ["入学許可書", "財政証明書（月€430以上）", "健康保険加入証明", "住宅確保証明", "ビザ申請料€150"],
        en: ["Acceptance from Greek institution", "Financial proof (€430+/month)", "Health insurance", "Proof of accommodation", "Visa fee €150"],
        zh: ["希腊院校录取通知书", "经济证明（每月€430以上）", "医疗保险证明", "住宿证明", "签证费€150"],
      },
      duration: { ja: "就学期間（1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "ビザ申請料€150", en: "Visa fee €150", zh: "签证费€150" },
    },
    costs: { tuitionMin: 1500, tuitionMax: 12000, livingMin: 600, livingMax: 1400, currency: "EUR", currencySymbol: "€" },
    popularCities: { ja: ["アテネ", "テッサロニキ", "パトラ", "イラクリオン（クレタ島）"], en: ["Athens", "Thessaloniki", "Patras", "Heraklion (Crete)"], zh: ["雅典", "塞萨洛尼基", "帕特雷", "伊拉克利翁（克里特岛）"] },
    popularUniversities: { ja: ["アテネ大学（NKUA）", "アテネ工科大学（NTUA）", "テッサロニキ大学（AUTH）", "ギリシャ語語学学校（多数）", "アメリカンカレッジ・ギリシャ"], en: ["University of Athens (NKUA)", "National Technical University of Athens (NTUA)", "Aristotle University of Thessaloniki (AUTH)", "Greek language schools (many)", "American College of Greece"], zh: ["雅典大学（NKUA）", "雅典国立技术大学（NTUA）", "塞萨洛尼基亚里士多德大学（AUTH）", "希腊语语言学校（众多）", "希腊美国学院"] },
    tips: { ja: ["デジタルノマドビザで最大1年間就労しながら滞在可能", "生活費はヨーロッパ最安水準のひとつ（月8〜10万円程度）", "外国人転入者向けの所得税50%減税（最初の7年間）制度あり", "世界遺産・遺跡を日常的に楽しめる歴史的環境"], en: ["Digital Nomad Visa allows up to 1 year of stay while working remotely", "Living costs among Europe's lowest (~¥80–100k/month)", "50% income tax reduction for foreign residents for the first 7 years", "Daily access to UNESCO World Heritage Sites and ancient ruins"], zh: ["数字游民签证允许边远程工作边居留最长1年", "生活成本是欧洲最低水准之一（每月约8至10万日元）", "外国迁入者前7年可享受所得税减免50%的优惠", "日常可游览联合国教科文组织世界遗产和古代遗迹"] },
    japaneseInfo: { ja: "アテネには在ギリシャ日本大使館があり、日本人コミュニティも存在します。古代ギリシャ哲学・歴史を学ぶ場として独自の魅力があり、ギリシャ料理・文化に魅了された日本人留学生も多いです。", en: "Athens has a Japanese Embassy and a small but active Japanese community. Many Japanese students are drawn by Greek cuisine, culture, and the unique opportunity to study ancient philosophy and history firsthand.", zh: "雅典设有日本大使馆，拥有规模虽小但活跃的日本人社区。许多日本留学生被希腊美食、文化以及亲身研究古希腊哲学和历史的独特机会所吸引。" },
  },

  MT: {
    code: "MT",
    overview: {
      ja: "マルタはEU加盟の英語公用語国で、地中海性気候と温暖な気候が魅力です。語学留学先として人気が高く、短期コースから大学留学まで対応しています。物価は西欧より安く、EU内での就労・移動の自由も魅力です。",
      en: "Malta is an English-speaking EU member state in the Mediterranean, popular for language courses and affordable degree programs. Its warm climate, low cost compared to Western Europe, and EU membership make it an attractive study destination.",
      zh: "马耳他是以英语为官方语言的欧盟成员国，地中海气候温暖宜人，深受语言留学生欢迎。与西欧相比物价较低，欧盟成员资格也带来就业和出行便利。",
    },
    studentVisa: {
      name: { ja: "長期滞在ビザ（National Visa）", en: "National Visa / Student Residence Permit", zh: "国家签证/学生居留许可" },
      requirements: {
        ja: ["入学許可書", "財政証明書（月€800以上）", "健康保険加入証明", "住宅確保証明", "ビザ申請料€80"],
        en: ["Acceptance letter from institution", "Financial proof (€800+/month)", "Health insurance", "Proof of accommodation", "Visa fee €80"],
        zh: ["院校录取通知书", "经济证明（每月€800以上）", "医疗保险证明", "住宿证明", "签证费€80"],
      },
      duration: { ja: "就学期間（最大1年、更新可能）", en: "Duration of study (up to 1 year, renewable)", zh: "学习期间（最长1年，可续签）" },
      cost: { ja: "ビザ申請料€80〜", en: "Visa fee €80+", zh: "签证费€80起" },
    },
    costs: { tuitionMin: 5000, tuitionMax: 20000, livingMin: 800, livingMax: 1500, currency: "EUR", currencySymbol: "€" },
    popularCities: {
      ja: ["バレッタ", "セント・ジュリアンズ", "スリーマ", "ムシーダ"],
      en: ["Valletta", "St. Julian's", "Sliema", "Msida"],
      zh: ["瓦莱塔", "圣朱利安斯", "斯利马", "姆西达"],
    },
    popularUniversities: {
      ja: ["マルタ大学（UoM）", "MCAST（マルタ芸術・科学・技術カレッジ）", "IH Malta（語学）", "EC Malta（語学）", "Inlingua Malta（語学）"],
      en: ["University of Malta (UoM)", "MCAST", "IH Malta", "EC Malta", "Inlingua Malta"],
      zh: ["马耳他大学（UoM）", "MCAST", "IH Malta（语言）", "EC Malta（语言）", "Inlingua Malta（语言）"],
    },
    tips: {
      ja: ["短期語学コースは4〜12週間が一般的で費用も手頃", "EU加盟国のため欧州全域への移動が容易", "小さな島国なので交通は車・バスが中心", "夏は観光シーズンで物価が若干上昇する"],
      en: ["Short language courses (4–12 weeks) are popular and affordable", "EU membership allows easy travel throughout Europe", "Small island — bus and car are the main transport", "Prices rise slightly in summer tourist season"],
      zh: ["短期语言课程（4至12周）广受欢迎且价格实惠", "欧盟成员国，出行欧洲各地便捷", "小岛国家，主要交通方式为公共汽车和汽车", "夏季旅游旺季物价略有上涨"],
    },
    japaneseInfo: {
      ja: "マルタへの日本人留学生は増加傾向にあります。在マルタ日本大使館はイタリア兼轄のため、緊急時はローマ大使館が対応します。語学留学の拠点として人気が高まっています。",
      en: "The number of Japanese students in Malta is growing. The Japanese Embassy in Rome covers Malta. Malta is gaining popularity as an affordable English immersion destination for Japanese learners.",
      zh: "前往马耳他的日本留学生数量呈增长趋势。马耳他由驻罗马日本大使馆管辖。马耳他作为实惠的英语沉浸式学习目的地，越来越受日本学生欢迎。",
    },
  },

  ZA: {
    code: "ZA",
    overview: {
      ja: "南アフリカは英語圏の国で、アフリカ大陸の中で最も高い教育水準を誇ります。ケープタウン大学（UCT）は世界ランキングにも入る名門大学で、留学費用は欧米の半分以下が目安です。雄大な自然と多文化社会が魅力的な留学環境を提供します。",
      en: "South Africa is an English-speaking nation with Africa's highest standard of education. The University of Cape Town (UCT) is globally ranked, and study costs are roughly half those of Europe or North America. Stunning nature and multicultural society make it a unique study destination.",
      zh: "南非是英语国家，拥有非洲最高的教育水平。开普敦大学（UCT）跻身全球大学排名，留学费用约为欧美的一半。壮阔的自然风光和多元文化社会提供了独特的留学环境。",
    },
    studentVisa: {
      name: { ja: "学習ビザ（Study Visa）", en: "Study Visa", zh: "学习签证" },
      requirements: {
        ja: ["入学許可書", "財政証明書（年R15,000以上）", "無犯罪証明書", "健康保険加入証明", "黄熱病予防接種証明（一部地域）"],
        en: ["Acceptance letter", "Financial proof (R15,000+/year)", "Police clearance", "Medical insurance", "Yellow fever vaccination (some regions)"],
        zh: ["录取通知书", "经济证明（每年R15,000以上）", "无犯罪证明", "医疗保险证明", "黄热病疫苗接种证明（部分地区）"],
      },
      duration: { ja: "就学期間（最大5年）", en: "Duration of study (up to 5 years)", zh: "学习期间（最长5年）" },
      cost: { ja: "ビザ申請料 約R1,520", en: "Visa fee approx. R1,520", zh: "签证费约R1,520" },
    },
    costs: { tuitionMin: 30000, tuitionMax: 120000, livingMin: 8000, livingMax: 20000, currency: "ZAR", currencySymbol: "R" },
    popularCities: {
      ja: ["ケープタウン", "ヨハネスブルグ", "プレトリア", "ダーバン", "ステレンボッシュ"],
      en: ["Cape Town", "Johannesburg", "Pretoria", "Durban", "Stellenbosch"],
      zh: ["开普敦", "约翰内斯堡", "比勒陀利亚", "德班", "斯泰伦博斯"],
    },
    popularUniversities: {
      ja: ["ケープタウン大学（UCT）", "ウィットウォーターズランド大学", "ステレンボッシュ大学", "プレトリア大学", "ダーバン工科大学"],
      en: ["University of Cape Town (UCT)", "University of the Witwatersrand", "Stellenbosch University", "University of Pretoria", "Durban University of Technology"],
      zh: ["开普敦大学（UCT）", "金山大学", "斯泰伦博斯大学", "比勒陀利亚大学", "德班理工大学"],
    },
    tips: {
      ja: ["ケープタウンは世界で最も美しい都市のひとつとして知られる", "治安には注意が必要（夜間の一人歩きは避けること）", "ランドの為替レートにより日本からの留学費用は変動する", "南半球のため学期は1月〜11月（日本と逆）"],
      en: ["Cape Town is consistently ranked among the world's most beautiful cities", "Be aware of safety — avoid walking alone at night", "ZAR exchange rate means costs fluctuate for Japanese students", "Southern hemisphere: academic year runs January–November"],
      zh: ["开普敦被公认为世界最美城市之一", "注意安全，避免夜间独自外出", "南非兰特汇率波动影响日本学生的留学费用", "南半球，学年为1月至11月"],
    },
    japaneseInfo: {
      ja: "在南アフリカ日本大使館はプレトリアにあります。南アフリカへの日本人留学生はまだ少なく、英語圏で費用を抑えたい人には穴場の留学先です。UCTには少数ながら日本人留学生が在籍しています。",
      en: "The Japanese Embassy in South Africa is in Pretoria. Japanese student numbers are still small, making South Africa a hidden gem for budget-conscious English-language learners. UCT has a small but established Japanese student community.",
      zh: "日本驻南非大使馆位于比勒陀利亚。目前前往南非的日本留学生较少，对于希望以较低费用学习英语的学生来说是个隐藏的好去处。开普敦大学有少量日本留学生。",
    },
  },

  FI: {
    code: "FI",
    overview: {
      ja: "フィンランドは世界最高水準の教育で知られ、PISAランキングで常に上位を誇ります。英語で学べる学位プログラムが多数あり、テクノロジー・デザイン・環境分野で特に評価が高いです。非EU学生には学費がかかりますが、奨学金制度が充実しています。",
      en: "Finland is world-renowned for its exceptional education system, consistently ranking at the top of PISA assessments. With many English-taught degree programs and a focus on technology, design, and sustainability, it's a compelling choice for international students.",
      zh: "芬兰以世界顶尖的教育体系闻名，在PISA排名中始终名列前茅。拥有众多英语授课学位项目，在技术、设计和可持续发展领域尤为突出，是留学生的理想选择。",
    },
    studentVisa: {
      name: { ja: "フィンランド在留許可（学習目的）", en: "Finnish Residence Permit for Studies", zh: "芬兰学习居留许可" },
      requirements: {
        ja: ["入学許可書", "財政証明書（月€560以上）", "健康保険加入証明", "住宅確保証明", "申請料€350"],
        en: ["Acceptance letter", "Financial proof (€560+/month)", "Health insurance", "Proof of accommodation", "Application fee €350"],
        zh: ["录取通知书", "经济证明（每月€560以上）", "医疗保险证明", "住宿证明", "申请费€350"],
      },
      duration: { ja: "就学期間（通常1〜2年ごとに更新）", en: "Duration of study (typically renewed every 1–2 years)", zh: "学习期间（通常每1至2年续签）" },
      cost: { ja: "申請料€350", en: "Application fee €350", zh: "申请费€350" },
    },
    costs: { tuitionMin: 6000, tuitionMax: 18000, livingMin: 800, livingMax: 1600, currency: "EUR", currencySymbol: "€" },
    popularCities: {
      ja: ["ヘルシンキ", "タンペレ", "トゥルク", "オウル", "エスポー"],
      en: ["Helsinki", "Tampere", "Turku", "Oulu", "Espoo"],
      zh: ["赫尔辛基", "坦佩雷", "图尔库", "奥卢", "埃斯波"],
    },
    popularUniversities: {
      ja: ["ヘルシンキ大学", "アアルト大学（デザイン・工学）", "タンペレ大学", "トゥルク大学", "オウル大学"],
      en: ["University of Helsinki", "Aalto University (Design & Engineering)", "Tampere University", "University of Turku", "University of Oulu"],
      zh: ["赫尔辛基大学", "阿尔托大学（设计与工程）", "坦佩雷大学", "图尔库大学", "奥卢大学"],
    },
    tips: {
      ja: ["冬は非常に寒く（-20℃以下）、夏は白夜が続く極端な気候に慣れること", "フィンランド人は静かで内向的だが一度打ち解けると友好的", "サウナ文化は社交の場として重要", "EU/EEA圏外の学生は年間€6,000〜18,000の学費が必要"],
      en: ["Winters are extreme (below -20°C) while summers bring the midnight sun", "Finns are reserved but friendly once familiar", "Sauna culture is an important social tradition", "Non-EU/EEA students pay tuition fees of €6,000–18,000/year"],
      zh: ["冬季极寒（低于-20°C），夏季迎来极昼，需适应极端气候", "芬兰人内敛但熟悉后非常友好", "桑拿文化是重要的社交场合", "非欧盟/欧洲经济区学生需缴纳每年€6,000至18,000的学费"],
    },
    japaneseInfo: {
      ja: "在フィンランド日本大使館はヘルシンキにあります。フィンランドはノキア・スーパーセル等テック企業の本拠地でIT留学にも人気。日本人コミュニティは小さいですが、日本語話者は各都市に存在します。",
      en: "The Japanese Embassy is in Helsinki. Finland is home to Nokia, Supercell, and a thriving tech startup scene, making it popular for IT-focused study. The Japanese community is small but present in major cities.",
      zh: "日本大使馆位于赫尔辛基。芬兰是诺基亚、Supercell等科技企业的发源地，深受IT方向留学生欢迎。日本人社区规模较小，但在主要城市均有分布。",
    },
  },

  AT: {
    code: "AT",
    overview: {
      ja: "オーストリアはヨーロッパの文化・芸術の中心地であり、首都ウィーンは「音楽の都」として世界的に知られています。公立大学の学費は少額で、音楽・美術・建築・人文科学分野を志す留学生に人気です。高い生活水準と充実した公共交通機関が魅力です。",
      en: "Austria is the heart of European culture and arts, with Vienna known globally as the 'City of Music.' Public universities charge minimal fees, making it popular for students of music, fine arts, architecture, and humanities. High quality of life and excellent public transport.",
      zh: "奥地利是欧洲文化与艺术的中心，首都维也纳以'音乐之都'享誉全球。公立大学学费极低，深受音乐、美术、建筑和人文学科留学生青睐。生活水平高，公共交通完善。",
    },
    studentVisa: {
      name: { ja: "学生在留許可（Aufenthaltstitel Studierender）", en: "Residence Permit for Students", zh: "学生居留许可" },
      requirements: {
        ja: ["入学許可書", "財政証明書（月€1,000以上）", "健康保険加入証明", "住宅確保証明", "申請料€160"],
        en: ["Acceptance letter", "Financial proof (€1,000+/month)", "Health insurance", "Proof of accommodation", "Application fee €160"],
        zh: ["录取通知书", "经济证明（每月€1,000以上）", "医疗保险证明", "住宿证明", "申请费€160"],
      },
      duration: { ja: "1年間（更新可能）", en: "1 year (renewable)", zh: "1年（可续签）" },
      cost: { ja: "申請料€160 + 学期手数料€363（公立大学）", en: "Application fee €160 + semester fee €363 (public unis)", zh: "申请费€160 + 公立大学学期费€363" },
    },
    costs: { tuitionMin: 1000, tuitionMax: 20000, livingMin: 900, livingMax: 1800, currency: "EUR", currencySymbol: "€" },
    popularCities: {
      ja: ["ウィーン", "グラーツ", "ザルツブルク", "インスブルック", "リンツ"],
      en: ["Vienna", "Graz", "Salzburg", "Innsbruck", "Linz"],
      zh: ["维也纳", "格拉茨", "萨尔茨堡", "因斯布鲁克", "林茨"],
    },
    popularUniversities: {
      ja: ["ウィーン大学（欧州最大級）", "ウィーン工科大学（TU Wien）", "ウィーン音楽演劇大学（MDW）", "グラーツ大学", "ザルツブルク大学"],
      en: ["University of Vienna (one of Europe's largest)", "TU Wien", "University of Music and Performing Arts Vienna (MDW)", "University of Graz", "University of Salzburg"],
      zh: ["维也纳大学（欧洲最大之一）", "维也纳工业大学（TU Wien）", "维也纳音乐与表演艺术大学（MDW）", "格拉茨大学", "萨尔茨堡大学"],
    },
    tips: {
      ja: ["ドイツ語能力が必要（英語プログラムも増加中）", "ウィーンフィル・オペラ等クラシック音楽の本場", "公立大学はEU圏外学生でも学期手数料のみで学べる", "ユーレイルパス等でヨーロッパ旅行も充実"],
      en: ["German language skills are generally required (English programs growing)", "Home of the Vienna Philharmonic, State Opera, and world-class classical music", "Public universities accessible for non-EU students at just the semester fee", "Excellent base for European travel"],
      zh: ["通常需要德语能力（英语项目日益增多）", "维也纳爱乐乐团、国家歌剧院等古典音乐圣地", "非欧盟学生也可以只缴纳学期费就读公立大学", "是游览欧洲各地的绝佳据点"],
    },
    japaneseInfo: {
      ja: "在オーストリア日本大使館はウィーンにあります。音楽・美術を志す日本人留学生が多く、ウィーン音楽演劇大学には毎年数十名の日本人学生が在籍しています。ウィーンには日本食レストランも充実しています。",
      en: "The Japanese Embassy is in Vienna. Austria attracts many Japanese students pursuing music and fine arts — dozens attend MDW annually. Vienna has a solid selection of Japanese restaurants and a small but active Japanese community.",
      zh: "日本大使馆位于维也纳。奥地利吸引了众多追求音乐和美术的日本留学生，每年有数十名日本学生就读维也纳音乐与表演艺术大学。维也纳日本料理餐厅种类丰富，日本人社区活跃。",
    },
  },

  CZ: {
    code: "CZ",
    overview: {
      ja: "チェコはヨーロッパの中心に位置し、プラハはその美しさで世界有数の観光都市です。公立大学のチェコ語プログラムは無料で、英語プログラムも欧州平均より安価です。カレル大学（1348年設立）はヨーロッパ最古の大学のひとつとして知られています。",
      en: "The Czech Republic sits at the heart of Europe, with Prague being one of the world's most beautiful cities. Czech-taught public university programs are free, and English-taught programs are more affordable than EU averages. Charles University (est. 1348) is one of Europe's oldest.",
      zh: "捷克位于欧洲中心，布拉格是全球最美丽的城市之一。公立大学捷克语课程免费，英语授课项目费用也低于欧盟平均水平。查理大学（创建于1348年）是欧洲最古老的大学之一。",
    },
    studentVisa: {
      name: { ja: "長期学習ビザ（Type D）", en: "Long-Stay Study Visa (Type D)", zh: "长期学习签证（D类）" },
      requirements: {
        ja: ["入学許可書", "財政証明書（月Kč15,000以上）", "健康保険加入証明", "住宅確保証明", "申請料Kč2,500"],
        en: ["Acceptance letter", "Financial proof (Kč15,000+/month)", "Health insurance", "Proof of accommodation", "Application fee Kč2,500"],
        zh: ["录取通知书", "经济证明（每月Kč15,000以上）", "医疗保险证明", "住宿证明", "申请费Kč2,500"],
      },
      duration: { ja: "就学期間（1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "申請料Kč2,500（約1.5万円）", en: "Application fee Kč2,500 (~€100)", zh: "申请费Kč2,500（约€100）" },
    },
    costs: { tuitionMin: 3000, tuitionMax: 20000, livingMin: 15000, livingMax: 35000, currency: "CZK", currencySymbol: "Kč" },
    popularCities: {
      ja: ["プラハ", "ブルノ", "オロモウツ", "オストラバ", "プルゼニ"],
      en: ["Prague", "Brno", "Olomouc", "Ostrava", "Pilsen"],
      zh: ["布拉格", "布尔诺", "奥洛穆茨", "俄斯特拉发", "比尔森"],
    },
    popularUniversities: {
      ja: ["カレル大学（欧州最古の一つ）", "プラハ工科大学（CTU）", "マサリク大学（ブルノ）", "プラハ経済大学（VŠE）", "チェコ工科大学"],
      en: ["Charles University (one of Europe's oldest)", "Czech Technical University in Prague (CTU)", "Masaryk University (Brno)", "Prague University of Economics (VŠE)", "Brno University of Technology"],
      zh: ["查理大学（欧洲最古老之一）", "布拉格捷克技术大学（CTU）", "马萨里克大学（布尔诺）", "布拉格经济大学（VŠE）", "布尔诺理工大学"],
    },
    tips: {
      ja: ["英語プログラムは年€3,000〜20,000が目安でコスパが高い", "プラハはヨーロッパの地理的中心で旅行に便利", "チェコビールは世界的に有名で物価も安い", "チェコ語を少し学ぶと地元の人に喜ばれる"],
      en: ["English-taught programs cost €3,000–20,000/year — excellent value in Europe", "Prague is geographically central in Europe, ideal for travel", "Czech beer is world-famous and extremely affordable", "Learning some Czech impresses locals and enhances daily life"],
      zh: ["英语授课项目每年€3,000至20,000，在欧洲性价比极高", "布拉格地处欧洲地理中心，出行便利", "捷克啤酒享誉世界且价格实惠", "学一些捷克语会给当地人留下好印象"],
    },
    japaneseInfo: {
      ja: "在チェコ日本大使館はプラハにあります。チェコへの日本人留学生は増加傾向にあり、プラハの美しい街並みと欧州留学のコスパの良さが人気の理由です。日本人コミュニティはプラハを中心に形成されています。",
      en: "The Japanese Embassy is in Prague. The number of Japanese students in the Czech Republic is growing, attracted by Prague's beauty and the exceptional value of European education. The Japanese community is centered in Prague.",
      zh: "日本大使馆位于布拉格。赴捷克的日本留学生数量持续增加，布拉格的美丽风光和欧洲留学的高性价比是吸引因素。日本人社区以布拉格为中心形成。",
    },
  },

  CN: {
    code: "CN",
    overview: {
      ja: "中国は世界最多の人口と急成長する経済を背景に、留学先としての魅力を高めています。政府奨学金（CSC）が充実しており、無料または割引学費で学べる機会も多いです。中国語（普通話）を学ぶ目的の留学生のほか、ビジネス・IT・医学分野でも人気があります。",
      en: "China has grown into a major study abroad destination, backed by its massive economy and government scholarship programs (CSC). Many international students come to study Mandarin, while business, technology, and medicine programs are also popular.",
      zh: "中国凭借庞大的经济体量和完善的政府奖学金制度（CSC），已成为重要的留学目的地。许多留学生来此学习普通话，商科、技术和医学专业同样备受欢迎。",
    },
    studentVisa: {
      name: { ja: "X1ビザ（6ヶ月超）/ X2ビザ（6ヶ月以内）", en: "X1 Visa (6+ months) / X2 Visa (under 6 months)", zh: "X1签证（6个月以上）/ X2签证（6个月以内）" },
      requirements: {
        ja: ["入学許可書（JW202フォーム）", "健康診断書（外国人体格検査記録）", "財政証明書", "パスポート（6ヶ月以上有効）", "ビザ申請料 約¥6,000"],
        en: ["Acceptance letter (JW202 form)", "Medical examination record", "Financial proof", "Passport (valid 6+ months)", "Visa fee approx. ¥6,000"],
        zh: ["录取通知书（JW202表格）", "外国人体格检查记录", "经济担保证明", "护照（有效期6个月以上）", "签证费约¥6,000"],
      },
      duration: { ja: "就学期間（通常1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（通常每年续签）" },
      cost: { ja: "ビザ申請料 約¥6,000〜", en: "Visa fee approx. ¥6,000+", zh: "签证费约¥6,000起" },
    },
    costs: { tuitionMin: 15000, tuitionMax: 60000, livingMin: 3000, livingMax: 8000, currency: "CNY", currencySymbol: "¥" },
    popularCities: {
      ja: ["北京", "上海", "成都", "広州", "西安"],
      en: ["Beijing", "Shanghai", "Chengdu", "Guangzhou", "Xi'an"],
      zh: ["北京", "上海", "成都", "广州", "西安"],
    },
    popularUniversities: {
      ja: ["北京大学（PKU）", "清華大学", "復旦大学（上海）", "浙江大学", "上海交通大学"],
      en: ["Peking University (PKU)", "Tsinghua University", "Fudan University (Shanghai)", "Zhejiang University", "Shanghai Jiao Tong University"],
      zh: ["北京大学（PKU）", "清华大学", "复旦大学（上海）", "浙江大学", "上海交通大学"],
    },
    tips: {
      ja: ["CSC奨学金（中国政府奨学金）は学費・寮費・月額手当が支給される", "VPNなしではGoogle・YouTube・LINEが使用不可", "中国語の習得に最適な環境で、1年で大幅な上達が期待できる", "食文化が豊かで地域ごとに大きく異なる"],
      en: ["CSC Scholarship covers tuition, dormitory, and monthly allowance", "Google, YouTube, and LINE are blocked — VPN required", "Ideal environment for learning Mandarin; rapid progress expected within a year", "Rich food culture varies dramatically by region"],
      zh: ["中国政府奖学金（CSC）涵盖学费、宿舍费和月生活费", "谷歌、YouTube和LINE受限，需使用VPN", "是学习普通话的理想环境，一年内可取得显著进步", "饮食文化丰富，各地差异显著"],
    },
    japaneseInfo: {
      ja: "在中国日本大使館は北京にあり、上海・広州・瀋陽・重慶に総領事館があります。中国には多くの日本人留学生が在籍しており、特に中国語習得・ビジネス・観光業を目指す学生が多いです。",
      en: "The Japanese Embassy is in Beijing, with consulates in Shanghai, Guangzhou, Shenyang, and Chongqing. China hosts a large number of Japanese students, particularly those studying Mandarin, business, and tourism management.",
      zh: "日本大使馆位于北京，在上海、广州、沈阳和重庆设有总领事馆。中国拥有大量日本留学生，尤其是学习普通话、商科和旅游管理的学生。",
    },
  },

  IN: {
    code: "IN",
    overview: {
      ja: "インドは世界最大の民主主義国家で、英語が公用語のひとつとして使われています。IIT（インド工科大学）はMIT・スタンフォードと並ぶ世界トップクラスの工学教育機関として知られています。留学費用は欧米の10分の1以下で、IT・工学・ビジネス分野に強みがあります。",
      en: "India is the world's largest democracy with English as a co-official language. The Indian Institutes of Technology (IITs) are globally ranked alongside MIT and Stanford for engineering education. Study costs are a fraction of Western countries, with strengths in IT, engineering, and business.",
      zh: "印度是世界最大的民主国家，英语为官方语言之一。印度理工学院（IIT）在工程教育领域与麻省理工学院、斯坦福大学齐名，享誉全球。留学费用不足欧美的十分之一，在IT、工程和商科领域实力突出。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（Student Visa / e-Student Visa）", en: "Student Visa (e-Student Visa available)", zh: "学生签证（可申请电子学生签证）" },
      requirements: {
        ja: ["入学許可書", "財政証明書", "パスポート写真", "ビザ申請フォーム記入", "申請料 約$80"],
        en: ["Acceptance letter", "Financial proof", "Passport photos", "Visa application form", "Application fee approx. $80"],
        zh: ["录取通知书", "经济担保证明", "护照照片", "填写签证申请表", "申请费约$80"],
      },
      duration: { ja: "就学期間（通常5年まで）", en: "Duration of study (up to 5 years typically)", zh: "学习期间（通常最长5年）" },
      cost: { ja: "申請料 約$80（eビザは$25〜）", en: "Approx. $80 (e-Visa from $25)", zh: "约$80（电子签证$25起）" },
    },
    costs: { tuitionMin: 100000, tuitionMax: 800000, livingMin: 15000, livingMax: 40000, currency: "INR", currencySymbol: "₹" },
    popularCities: {
      ja: ["バンガロール", "デリー", "ムンバイ", "チェンナイ", "ハイデラバード", "プネ"],
      en: ["Bangalore", "Delhi", "Mumbai", "Chennai", "Hyderabad", "Pune"],
      zh: ["班加罗尔", "德里", "孟买", "金奈", "海得拉巴", "浦那"],
    },
    popularUniversities: {
      ja: ["IIT（インド工科大学）全国23校", "IIM（インド経営大学院）", "デリー大学", "ムンバイ大学", "インド科学研究所（IISc）"],
      en: ["IIT (Indian Institutes of Technology) — 23 campuses nationwide", "IIM (Indian Institutes of Management)", "University of Delhi", "University of Mumbai", "Indian Institute of Science (IISc)"],
      zh: ["IIT（印度理工学院）全国23所", "IIM（印度管理学院）", "德里大学", "孟买大学", "印度科学研究所（IISc）"],
    },
    tips: {
      ja: ["IITは世界最難関校のひとつ、入試は非常に競争が激しい", "バンガロールはインドのシリコンバレーでITキャリアに有利", "ベジタリアン食・スパイス料理が中心の食文化に慣れること", "衛生面・水事情に注意し、飲料水はボトルウォーターを使用"],
      en: ["IIT entrance is among the most competitive in the world", "Bangalore is India's Silicon Valley — great for IT careers", "Vegetarian and spiced cuisine is dominant — be prepared to adapt", "Take care with sanitation and use bottled water"],
      zh: ["IIT入学竞争极为激烈，是世界最难考的大学之一", "班加罗尔是印度的硅谷，对IT职业发展大有裨益", "素食和香料料理为主，需做好适应准备", "注意卫生和饮水安全，请使用瓶装水"],
    },
    japaneseInfo: {
      ja: "在インド日本大使館はデリーにあり、ムンバイ・チェンナイ・コルカタ・バンガロールに総領事館があります。インドへの日本人留学生は増加傾向にあり、IT・ヨガ・アーユルヴェーダを目的とした留学も人気です。",
      en: "The Japanese Embassy is in Delhi, with consulates in Mumbai, Chennai, Kolkata, and Bangalore. Japanese student numbers are growing, with IT, yoga, and Ayurveda attracting unique interest alongside academic study.",
      zh: "日本大使馆位于德里，在孟买、金奈、加尔各答和班加罗尔设有总领事馆。赴印度的日本留学生数量持续增长，IT、瑜伽和阿育吠陀也吸引了独特的留学兴趣。",
    },
  },

  MX: {
    code: "MX",
    overview: {
      ja: "メキシコはスペイン語習得とラテンアメリカ文化を体験できる人気の留学先です。UNAM（メキシコ国立自治大学）は中南米最大規模の大学で、外国人留学生にも開かれています。物価が安く、遺跡・自然・食文化など体験できることが多い魅力的な国です。",
      en: "Mexico is a top destination for Spanish language immersion and experiencing Latin American culture. UNAM is one of the largest universities in Latin America and is open to international students. Low cost of living, ancient ruins, and vibrant culture make it very appealing.",
      zh: "墨西哥是学习西班牙语和体验拉丁美洲文化的热门目的地。墨西哥国立自治大学（UNAM）是拉丁美洲规模最大的大学之一，向国际学生开放。物价低廉，古代遗迹、自然风光和饮食文化丰富多彩。",
    },
    studentVisa: {
      name: { ja: "一時居住ビザ（学生カテゴリー）", en: "Temporary Resident Visa (Student Category)", zh: "临时居民签证（学生类别）" },
      requirements: {
        ja: ["入学許可書", "財政証明書（月MX$17,000以上）", "パスポート写真", "ビザ申請フォーム記入", "申請料 約$36"],
        en: ["Acceptance letter", "Financial proof (MX$17,000+/month)", "Passport photos", "Application form", "Application fee approx. $36"],
        zh: ["录取通知书", "经济证明（每月MX$17,000以上）", "护照照片", "申请表格", "申请费约$36"],
      },
      duration: { ja: "就学期間（最大4年）", en: "Duration of study (up to 4 years)", zh: "学习期间（最长4年）" },
      cost: { ja: "申請料 約$36", en: "Approx. $36", zh: "约$36" },
    },
    costs: { tuitionMin: 20000, tuitionMax: 150000, livingMin: 8000, livingMax: 20000, currency: "MXN", currencySymbol: "MX$" },
    popularCities: {
      ja: ["メキシコシティ", "グアダラハラ", "モンテレイ", "プエブラ", "オアハカ"],
      en: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Oaxaca"],
      zh: ["墨西哥城", "瓜达拉哈拉", "蒙特雷", "普埃布拉", "瓦哈卡"],
    },
    popularUniversities: {
      ja: ["UNAM（メキシコ国立自治大学）", "モンテレイ工科大学（Tec de Monterrey）", "グアダラハラ大学（UDG）", "IPN（国立工科大学）", "ITAM（メキシコ自治工科大学院）"],
      en: ["UNAM (National Autonomous University of Mexico)", "Tecnológico de Monterrey (Tec)", "Universidad de Guadalajara (UDG)", "IPN (National Polytechnic Institute)", "ITAM"],
      zh: ["UNAM（墨西哥国立自治大学）", "蒙特雷科技大学（Tec）", "瓜达拉哈拉大学（UDG）", "IPN（国立理工大学）", "ITAM（墨西哥自治技术学院）"],
    },
    tips: {
      ja: ["スペイン語はメキシコ訛りがラテンアメリカで標準的とされる", "UNAMは外国人向けのスペイン語コースが充実", "治安は地域差が大きいため、渡航前に最新情報を確認すること", "メキシコ料理はユネスコ無形文化遺産に登録されている"],
      en: ["Mexican Spanish is considered a standard Latin American accent", "UNAM offers excellent Spanish programs for foreigners", "Safety varies widely by region — check current advisories before traveling", "Mexican cuisine is a UNESCO Intangible Cultural Heritage"],
      zh: ["墨西哥西班牙语被认为是拉丁美洲的标准口音", "UNAM为外国人提供完善的西班牙语课程", "各地区安全状况差异较大，出发前请查阅最新旅行建议", "墨西哥美食已被列入联合国教科文组织非物质文化遗产"],
    },
    japaneseInfo: {
      ja: "在メキシコ日本大使館はメキシコシティにあります。メキシコには自動車・製造業の日系企業が多く、スペイン語留学後にビジネス就職を目指す日本人も増えています。日本人コミュニティはメキシコシティを中心に存在します。",
      en: "The Japanese Embassy is in Mexico City. Many Japanese auto and manufacturing companies operate in Mexico, making it a strategic destination for those aiming to work in Spanish-speaking business environments after study.",
      zh: "日本大使馆位于墨西哥城。许多日本汽车和制造业企业在墨西哥运营，使其成为留学后希望进入西班牙语商业环境工作的日本人的战略目的地。",
    },
  },

  AR: {
    code: "AR",
    overview: {
      ja: "アルゼンチンはブエノスアイレスを中心に、「南米のパリ」と呼ばれる洗練された都市文化を持ちます。UBA（ブエノスアイレス大学）は外国人留学生を含む全ての学生に無料で開放されており、世界でも珍しい留学スタイルです。タンゴ・グルメ・サッカーなど文化的体験も豊富です。ただし高インフレのため、費用は変動が大きい点に注意が必要です。",
      en: "Argentina, centered on Buenos Aires — the 'Paris of South America' — offers a sophisticated urban culture. The University of Buenos Aires (UBA) is free for all students including foreigners, a rare opportunity worldwide. Tango, cuisine, and football add to a rich cultural experience. Note: high inflation causes cost fluctuations.",
      zh: "阿根廷以布宜诺斯艾利斯为中心，拥有'南美巴黎'之称的精致都市文化。布宜诺斯艾利斯大学（UBA）对包括外国留学生在内的所有学生免费开放，这在全球属于罕见机会。探戈、美食和足球提供了丰富的文化体验。注意：高通胀导致费用波动较大。",
    },
    studentVisa: {
      name: { ja: "学生ビザ（Visa de Estudiante）", en: "Student Visa (Visa de Estudiante)", zh: "学生签证（Visa de Estudiante）" },
      requirements: {
        ja: ["入学許可書", "財政証明書", "無犯罪証明書（公証済み）", "健康保険加入証明", "申請料 約$90"],
        en: ["Acceptance letter", "Financial proof", "Police clearance (notarized)", "Health insurance", "Application fee approx. $90"],
        zh: ["录取通知书", "经济担保证明", "无犯罪证明（公证）", "医疗保险证明", "申请费约$90"],
      },
      duration: { ja: "就学期間（1年ごとに更新）", en: "Duration of study (renewed annually)", zh: "学习期间（每年续签）" },
      cost: { ja: "申請料 約$90", en: "Approx. $90", zh: "约$90" },
    },
    costs: { tuitionMin: 0, tuitionMax: 500000, livingMin: 200000, livingMax: 500000, currency: "ARS", currencySymbol: "AR$" },
    popularCities: {
      ja: ["ブエノスアイレス", "コルドバ", "ロサリオ", "メンドーサ", "ラプラタ"],
      en: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata"],
      zh: ["布宜诺斯艾利斯", "科尔多瓦", "罗萨里奥", "门多萨", "拉普拉塔"],
    },
    popularUniversities: {
      ja: ["UBA（ブエノスアイレス大学・無料）", "コルドバ国立大学（UNC）", "ロサリオ国立大学（UNR）", "トルクアート・ディ・テッラ大学（私立）", "アルゼンチン・カトリック大学（UCA）"],
      en: ["UBA (University of Buenos Aires — free)", "National University of Córdoba (UNC)", "National University of Rosario (UNR)", "Torcuato Di Tella University (private)", "Catholic University of Argentina (UCA)"],
      zh: ["UBA（布宜诺斯艾利斯大学·免费）", "科尔多瓦国立大学（UNC）", "罗萨里奥国立大学（UNR）", "托尔夸托·迪·泰拉大学（私立）", "阿根廷天主教大学（UCA）"],
    },
    tips: {
      ja: ["UBAの学費は外国人留学生も完全無料（要スペイン語能力）", "高インフレのため現地の費用は急激に変動する（ドルで管理推奨）", "タンゴ・ワイン・ステーキ文化が日常的に楽しめる", "スペイン語の「リョ音（Rioplatense）」は独特のアクセント"],
      en: ["UBA tuition is completely free including for foreign students (Spanish required)", "High inflation means costs change rapidly — manage finances in USD", "Tango, wine, and steak culture are part of everyday life", "Argentine Spanish (Rioplatense) has a unique accent"],
      zh: ["UBA学费对外国留学生也完全免费（需具备西班牙语能力）", "高通胀导致当地费用急剧波动（建议以美元管理资金）", "探戈、葡萄酒和牛排文化融入日常生活", "阿根廷西班牙语（河床方言）有独特口音"],
    },
    japaneseInfo: {
      ja: "在アルゼンチン日本大使館はブエノスアイレスにあります。南米の日系人コミュニティはブラジルに次いでアルゼンチンが多く、日系社会が根付いています。スペイン語習得と南米文化体験を目的とした日本人留学生が増えています。",
      en: "The Japanese Embassy is in Buenos Aires. Argentina has one of Latin America's largest Japanese communities (second only to Brazil). The country is growing in popularity among Japanese students seeking Spanish skills and South American cultural immersion.",
      zh: "日本大使馆位于布宜诺斯艾利斯。阿根廷拥有拉丁美洲规模第二大的日本人社区（仅次于巴西）。越来越多希望学习西班牙语并体验南美文化的日本留学生选择来此就读。",
    },
  },
};

export function getStudyAbroadData(code: string): StudyAbroadData | undefined {
  return studyAbroadData[code.toUpperCase()];
}

export const studyAbroadCountries = Object.keys(studyAbroadData);

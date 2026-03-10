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
    livingMonthly: number; // 月額生活費（現地通貨）
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
      livingMonthly: 3000,
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
      livingMonthly: 1500,
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
      livingMonthly: 1800,
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
      livingMonthly: 1200,
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
      livingMonthly: 1500,
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
      livingMonthly: 1400,
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
      livingMonthly: 2000,
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
      livingMonthly: 800000,
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
      livingMonthly: 1500,
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
      livingMonthly: 900,
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
};

export function getStudyAbroadData(code: string): StudyAbroadData | undefined {
  return studyAbroadData[code.toUpperCase()];
}

export const studyAbroadCountries = Object.keys(studyAbroadData);

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

// EUブルーカード
replace(
  `**EUブルーカード（EU Blue Card）**
高度人材向けのEU共通就労・居住許可証で、ドイツが最も多くの発行件数を誇ります。`,
  `**EUブルーカード（EU Blue Card）** ｜ [Make it in Germany 公式ページ](https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card)
高度人材向けのEU共通就労・居住許可証で、ドイツが最も多くの発行件数を誇ります。`,
  "visa-de: EUブルーカードにリンク追加"
);

// 専門労働者ビザ
replace(
  `**専門労働者ビザ（Fachkräftevisum）**
2023年改正で対象が大幅拡大。職業訓練資格（Berufsausbildung）保有者だけでなく、**5年以上の実務経験**を持つ非学位者にも適用可能に。雇用契約と資格認定（または経験証明）が必要。`,
  `**専門労働者ビザ（Fachkräftevisum）** ｜ [Make it in Germany 公式ページ](https://www.make-it-in-germany.com/en/visa-residence/types/work-visa-skilled-workers)
2023年改正で対象が大幅拡大。職業訓練資格（Berufsausbildung）保有者だけでなく、**5年以上の実務経験**を持つ非学位者にも適用可能に。雇用契約と資格認定（または経験証明）が必要。`,
  "visa-de: 専門労働者ビザにリンク追加"
);

// 求職者ビザ
replace(
  `**求職者ビザ（Job-Seeker Visa）**
ドイツ国内での就職活動専用の6ヶ月ビザ。`,
  `**求職者ビザ（Job-Seeker Visa）** ｜ [Make it in Germany 公式ページ](https://www.make-it-in-germany.com/en/visa-residence/types/job-seekers-visa)
ドイツ国内での就職活動専用の6ヶ月ビザ。`,
  "visa-de: 求職者ビザにリンク追加"
);

// フリーランスビザ
replace(
  `**フリーランスビザ（Freiberufler Visa）**
芸術・言語・科学・技術・医療・コンサルタント等の自由業（Freiberuf）向け。雇用契約は不要だが、ドイツ国内のクライアントとの契約実績・事業計画書の提出が一般的に求められます。`,
  `**フリーランスビザ（Freiberufler Visa）** ｜ [Make it in Germany 公式ページ](https://www.make-it-in-germany.com/en/visa-residence/types/freelance-visa)
芸術・言語・科学・技術・医療・コンサルタント等の自由業（Freiberuf）向け。雇用契約は不要だが、ドイツ国内のクライアントとの契約実績・事業計画書の提出が一般的に求められます。`,
  "visa-de: フリーランスビザにリンク追加"
);

// 機会カード
replace(
  `**機会カード（Chancenkarte）**
2024年6月導入の新制度。ポイント制で就職活動目的の1年滞在許可を取得可能。`,
  `**機会カード（Chancenkarte）** ｜ [Make it in Germany 公式ページ](https://www.make-it-in-germany.com/en/visa-residence/types/opportunity-card)
2024年6月導入の新制度。ポイント制で就職活動目的の1年滞在許可を取得可能。`,
  "visa-de: 機会カードにリンク追加"
);

// 定住許可
replace(
  `**定住許可（Niederlassungserlaubnis）**
ドイツの永住権に相当。一般的には5年の合法的在留後に取得可能。EUブルーカードは2年（B1あり21ヶ月）に短縮。配偶者・家族の帯同は原則申請時から可能。`,
  `**定住許可（Niederlassungserlaubnis）** ｜ [BAMF 公式ページ](https://www.bamf.de/EN/Themen/MigrationAufenthalt/ZuwandererDrittstaaten/Migrathek/Niederlassungserlaubnis/niederlassungserlaubnis-node.html)
ドイツの永住権に相当。一般的には5年の合法的在留後に取得可能。EUブルーカードは2年（B1あり21ヶ月）に短縮。配偶者・家族の帯同は原則申請時から可能。`,
  "visa-de: 定住許可にリンク追加"
);

writeFileSync(filePath, content, "utf8");
console.log("\n✅ All done!");

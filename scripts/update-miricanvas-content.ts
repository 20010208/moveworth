/**
 * miricanvas-ai-presentation-guide-2026 のタイトル変更＋
 * 「活用シーン別の使い方」「よくある質問(FAQ)」セクション追加
 * - blog_posts / study_blog_posts 両テーブルのtitle・contentのみターゲットパッチ
 * - is_published・アフィリエイトリンクは変更しない
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { assertBlogPayload } from "./utils/validate-blog-payload";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const SLUG = "miricanvas-ai-presentation-guide-2026";
const AFFILIATE_HREF = "https://abr.ge/0xaw24";

const NEW_TITLE = {
  ja: "【PR】AIプレゼン資料を3分で作る方法！MiriCanvas完全ガイド【2026年最新版】",
  en: "【PR】How to Create an AI Presentation in 3 Minutes — Complete MiriCanvas Guide (2026)",
  zh: "【PR】3分钟用AI制作演示文稿！MiriCanvas完全指南【2026最新版】",
};

const INSERT_JA = `## 活用シーン別の使い方

**営業・提案資料（会社員向け）**
商材名や提案テーマを入力するだけで、要点を押さえた構成案とデザインをAIが自動生成。叩き台をベースに自社の実績データや事例を追加するだけで、提案資料が短時間で完成します。

**学術発表・ゼミ資料（学生向け）**
研究テーマやキーワードを入力すれば、発表の流れに沿ったスライド構成が自動で組み上がります。図表やグラフ部分だけ自分のデータに差し替えれば、見やすい発表資料に仕上がります。

**採用説明会・会社紹介資料**
会社概要や採用メッセージを入力するだけで、統一感のあるデザインの会社紹介スライドを短時間で作成できます。テンプレートも豊富なため、採用ブランディングにも活用しやすくなっています。

**フリーランスの提案・ポートフォリオ**
自己紹介や実績をベースに、クライアント向けの提案書やポートフォリオを作成可能。デザインスキルがなくても、見栄えの良い資料をスピーディーに用意できます。

## よくある質問（FAQ）

**Q: 無料で使えますか？**
A: 無料プランがあります。無料・Pro・Enterpriseの3プランから選べます。無料プランは個人のほか、企業・学校・自治体も利用可能です。詳細な機能の違いは公式サイトの料金ページでご確認ください。

**Q: スマートフォンやタブレットでも使えますか？**
A: AIプレゼンテーション生成機能はPC環境のみ対応しています。その他のデザイン編集機能はモバイルからも利用可能です。

**Q: PowerPointファイルとして保存できますか？**
A: PPTX形式でのエクスポートに対応しています。ただし、無料プランはPPTXダウンロードが1日3回までの制限があります。制限なく使いたい場合はProプランをご検討ください。

**Q: チームで共同編集できますか？**
A: 共有ドライブ機能でリアルタイム共同編集が可能です。

`;

const INSERT_EN = `## How to use it by scenario

**Sales and proposal materials (for office workers)**
Just enter your product name or proposal theme, and the AI automatically generates a structured outline and design that covers the key points. Add your own performance data or case studies to the draft, and your proposal is ready in no time.

**Academic presentations and seminar materials (for students)**
Enter your research topic or keywords, and the AI builds a slide structure that follows the flow of your presentation. Swap in your own charts and data, and you have a clear, presentation-ready deck.

**Recruitment briefings and company introduction materials**
Enter your company overview and recruiting message to quickly create a consistently designed company introduction deck. With its wide range of templates, it's also useful for recruitment branding.

**Freelance proposals and portfolios**
Build client-facing proposals or portfolios based on your self-introduction and track record. Even without design skills, you can put together polished materials quickly.

## Frequently Asked Questions (FAQ)

**Q: Is it free to use?**
A: Yes, there's a free plan. You can choose from three plans: Free, Pro, and Enterprise. The free plan can be used by individuals as well as companies, schools, and local governments. Check the official pricing page for detailed feature differences.

**Q: Can I use it on a smartphone or tablet?**
A: The AI presentation generation feature is only available on PC. Other design editing features can be used from mobile devices.

**Q: Can I save it as a PowerPoint file?**
A: Yes, PPTX export is supported. However, the free plan limits PPTX downloads to 3 per day. If you want unlimited downloads, consider the Pro plan.

**Q: Can my team collaborate on the same file?**
A: Yes, real-time collaborative editing is available through the shared drive feature.

`;

const INSERT_ZH = `## 按场景划分的使用方法

**销售·提案资料（适合公司职员）**
只需输入产品名称或提案主题，AI就会自动生成把握要点的结构方案和设计。在初稿基础上加入自己公司的业绩数据或案例，短时间内即可完成提案资料。

**学术发表·研讨会资料（适合学生）**
输入研究主题或关键词，AI会自动生成符合发表流程的幻灯片结构。只需将图表部分替换为自己的数据，即可完成清晰易懂的发表资料。

**招聘说明会·公司介绍资料**
只需输入公司简介和招聘信息，即可快速制作风格统一的公司介绍幻灯片。模板丰富，也便于用于招聘品牌建设。

**自由职业者的提案·作品集**
可以基于自我介绍和业绩制作面向客户的提案书或作品集。即使没有设计技能，也能快速准备美观的资料。

## 常见问题（FAQ）

**Q: 可以免费使用吗？**
A: 提供免费方案。可从免费、Pro、Enterprise三种方案中选择。免费方案除个人外，企业、学校、地方政府等也可使用。详细的功能差异请在官方网站的价格页面确认。

**Q: 可以在智能手机或平板电脑上使用吗？**
A: AI演示文稿生成功能仅支持电脑环境。其他设计编辑功能也可通过移动设备使用。

**Q: 可以保存为PowerPoint文件吗？**
A: 支持导出为PPTX格式。不过，免费方案的PPTX下载每天限制3次。如果想不受限制地使用，建议考虑Pro方案。

**Q: 可以团队共同编辑吗？**
A: 通过共享云端硬盘功能，可以进行实时协作编辑。

`;

const SUMMARY_HEADING: Record<"ja" | "en" | "zh", string> = {
  ja: "## まとめ",
  en: "## Summary",
  zh: "## 总结",
};
const INSERTS: Record<"ja" | "en" | "zh", string> = { ja: INSERT_JA, en: INSERT_EN, zh: INSERT_ZH };

function insertBeforeSummary(text: string, lang: "ja" | "en" | "zh"): string {
  const heading = SUMMARY_HEADING[lang];
  if (!text.includes(heading)) {
    throw new Error(`「${heading}」見出しが見つかりません (lang=${lang})`);
  }
  return text.replace(heading, `${INSERTS[lang]}${heading}`);
}

const FORBIDDEN: { pattern: RegExp; label: string }[] = [
  { pattern: /example\.com/i, label: "example.com混入" },
  { pattern: /I'm sorry,?\s+but\s+I\s+can'?t\s+assist/i, label: "GPT拒否(EN)" },
  { pattern: /申し訳ありませんが/, label: "GPT拒否(JA)" },
  { pattern: /我无法(提供|访问|获取|生成)/, label: "GPT拒否(ZH)" },
];
// 他社サービス名の混入チェック（比較禁止の担保）
const COMPETITOR_NAMES = ["Canva", "Gamma", "Beautiful.ai", "PowerPoint Designer", "Google Slides", "Keynote", "Prezi"];

function validateText(label: string, text: string) {
  for (const { pattern, label: reason } of FORBIDDEN) {
    if (pattern.test(text)) throw new Error(`[${label}] 禁止パターン検出: ${reason}`);
  }
  for (const name of COMPETITOR_NAMES) {
    // 単語境界で判定（"MiriCanvas"内の"Canva"部分文字列を誤検知しないように）
    const re = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    if (re.test(text)) throw new Error(`[${label}] 他社サービス名混入: ${name}`);
  }
  if (!text.includes(AFFILIATE_HREF)) throw new Error(`[${label}] アフィリエイトhrefが見つかりません`);
}

async function updateTable(table: "blog_posts" | "study_blog_posts") {
  const { data: before, error: beforeErr } = await sb
    .from(table)
    .select("slug, is_published, title, description, content")
    .eq("slug", SLUG)
    .single();
  if (beforeErr || !before) throw new Error(`${table} 取得失敗: ${beforeErr?.message}`);

  const beforeContent = before.content as Record<string, string>;
  const beforeHrefCounts = (["ja", "en", "zh"] as const).map(
    (l) => (beforeContent[l].match(new RegExp(AFFILIATE_HREF.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length
  );

  const newContent: Record<string, string> = {};
  for (const lang of ["ja", "en", "zh"] as const) {
    const updated = insertBeforeSummary(beforeContent[lang], lang);
    validateText(`${table}/${lang}`, updated);
    newContent[lang] = updated;
  }

  const newPayload = { title: NEW_TITLE, description: before.description, content: newContent };
  assertBlogPayload({ ...newPayload, locales: ["ja", "en", "zh"] }, `${SLUG} (${table})`);

  const { error: updateErr } = await sb
    .from(table)
    .update({ title: NEW_TITLE, content: newContent })
    .eq("slug", SLUG);
  if (updateErr) throw new Error(`${table} 更新失敗: ${updateErr.message}`);

  const { data: after, error: afterErr } = await sb
    .from(table)
    .select("slug, is_published, title, description, content")
    .eq("slug", SLUG)
    .single();
  if (afterErr || !after) throw new Error(`${table} 更新後取得失敗: ${afterErr?.message}`);

  if (after.is_published !== before.is_published) {
    throw new Error(`${table}: is_publishedが変化しています (${before.is_published} → ${after.is_published})`);
  }
  if (JSON.stringify(after.description) !== JSON.stringify(before.description)) {
    throw new Error(`${table}: descriptionが意図せず変化しています`);
  }

  const afterContent = after.content as Record<string, string>;
  for (let i = 0; i < 3; i++) {
    const lang = (["ja", "en", "zh"] as const)[i];
    const afterCount = (afterContent[lang].match(new RegExp(AFFILIATE_HREF.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length;
    if (afterCount !== beforeHrefCounts[i]) {
      throw new Error(`${table}/${lang}: アフィリエイトhref出現回数が変化 (${beforeHrefCounts[i]} → ${afterCount})`);
    }
  }

  console.log(`\n✅ ${table} 更新完了 (is_published: ${after.is_published} 不変)`);
  for (const lang of ["ja", "en", "zh"] as const) {
    console.log(`   ${lang}: ${beforeContent[lang].length}字 → ${afterContent[lang].length}字`);
  }
}

async function main() {
  await updateTable("blog_posts");
  await updateTable("study_blog_posts");
  console.log("\n✅ 両テーブル更新完了");
}

main().catch((e) => {
  console.error("❌", e.message ?? e);
  process.exit(1);
});

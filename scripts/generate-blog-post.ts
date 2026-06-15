import { existsSync, readFileSync } from "fs";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// Load .env.local for local execution
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    const val = t.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Lang = "ja" | "en" | "zh";

const CATEGORIES: Record<string, { ja: string; en: string; zh: string }> = {
  money: {
    ja: "移住とお金",
    en: "Moving and Money",
    zh: "移居与金钱",
  },
  lifestyle: {
    ja: "ライフプラン",
    en: "Life Plan",
    zh: "生活规划",
  },
  casestudy: {
    ja: "国別ケーススタディ",
    en: "Country Case Study",
    zh: "各国案例研究",
  },
};

const TOPICS = [
  { category: "money", keyword: "海外移住後の日本の確定申告と住民票抜きのポイント" },
  { category: "money", keyword: "海外移住で節税できる仕組みと注意点" },
  { category: "money", keyword: "海外在住者の日本の銀行口座・証券口座の維持方法" },
  { category: "money", keyword: "海外移住の初期費用を徹底計算" },
  { category: "lifestyle", keyword: "30代で海外移住を決断した理由と準備ステップ" },
  { category: "lifestyle", keyword: "海外移住後の子育て・教育環境の選び方" },
  { category: "lifestyle", keyword: "フリーランスが海外移住する際の注意点" },
  { category: "lifestyle", keyword: "海外移住と日本の年金・社会保険の関係" },
  { category: "casestudy", keyword: "タイ・バンコクに移住した日本人エンジニアの実体験" },
  { category: "casestudy", keyword: "ポルトガル・リスボンに移住した40代夫婦のケーススタディ" },
  { category: "casestudy", keyword: "ドバイに移住した起業家の節税と生活コストの実態" },
  { category: "casestudy", keyword: "カナダ・バンクーバーに移住したITエンジニアの体験談" },
];

async function generateContent(keyword: string, category: string, lang: Lang): Promise<{
  title: string;
  description: string;
  content: string;
}> {
  const catLabel = CATEGORIES[category]?.[lang] ?? category;
  const langInstructions = {
    ja: "日本語で書いてください。",
    en: "Write in English.",
    zh: "请用中文写。",
  };

  const prompt = `あなたはMoveWorthというサービスのブログライターです。MoveWorthは、海外移住を考えている人向けに、税金・生活費・ビザを一括シミュレーションできるサービスです。

カテゴリ: ${catLabel}
トピック: ${keyword}

${langInstructions[lang]}

以下のJSON形式で回答してください：
{
  "title": "SEOに最適化された記事タイトル（60文字以内）",
  "description": "メタディスクリプション（120〜160文字）",
  "content": "記事本文（マークダウン形式、1500〜2500文字）"
}

記事の要件：
- ## や ### でセクション分け
- 具体的な数字・データを含める
- 読者が次のアクションを取れるよう実践的な内容
- 最後にMoveWorthのシミュレーション機能への誘導を含める
- JSONのみを返してください（コードブロック不要）`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const result = JSON.parse(response.choices[0].message.content!);
  return {
    title: result.title,
    description: result.description,
    content: result.content,
  };
}

function generateSlug(enTitle: string): string {
  const year = new Date().getFullYear();
  const base = enTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .slice(0, 55)
    .replace(/-+$/, "");
  return `${base}-${year}`;
}

async function run() {
  // Pick a topic: rotate based on day of week, or pick randomly
  const dayIndex = new Date().getDay();
  const topic = TOPICS[dayIndex % TOPICS.length];

  console.log(`Generating: [${topic.category}] ${topic.keyword}`);

  const [ja, en, zh] = await Promise.all([
    generateContent(topic.keyword, topic.category, "ja"),
    generateContent(topic.keyword, topic.category, "en"),
    generateContent(topic.keyword, topic.category, "zh"),
  ]);

  const slug = generateSlug(en.title);
  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase.from("blog_posts").insert({
    slug,
    category: topic.category,
    published_at: today,
    reading_minutes: 8,
    thumbnail: null,
    title: { ja: ja.title, en: en.title, zh: zh.title },
    description: { ja: ja.description, en: en.description, zh: zh.description },
    content: { ja: ja.content, en: en.content, zh: zh.content },
    locales: null,
    pinned: false,
    is_published: true,
  });

  if (error) {
    console.error("Insert failed:", error.message);
    process.exit(1);
  }

  console.log(`✅ Published: ${slug}`);
}

run();

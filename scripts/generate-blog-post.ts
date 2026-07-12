import { existsSync, readFileSync } from "fs";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { sanitizeMoveWorthLinks } from "./utils/sanitize-links";
import { assertBlogPayload } from "./utils/validate-blog-payload";

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
  lifeplan: {
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

// 投稿順序：DISABLE_CASESTUDY=true のとき週2本（money/lifeplan）に絞る
const DISABLE_CASESTUDY = process.env.DISABLE_CASESTUDY === "true";
const ROTATION: string[] = DISABLE_CASESTUDY
  ? ["money", "lifeplan"]
  : ["money", "lifeplan", "casestudy", "casestudy"];

const TOPIC_POOL: Record<string, string[]> = {
  money: [
    "海外移住後の日本の確定申告と住民票抜きのポイント",
    "海外移住で節税できる仕組みと注意点",
    "海外在住者の日本の銀行口座・証券口座の維持方法",
    "海外移住の初期費用を徹底計算",
    "海外移住後の資産運用：NISAや投資信託はどうなる？",
    "海外移住者の日本円・外貨の両替と送金コスト比較",
  ],
  lifeplan: [
    "30代で海外移住を決断した理由と準備ステップ",
    "海外移住後の子育て・教育環境の選び方",
    "フリーランスが海外移住する際の注意点",
    "海外移住と日本の年金・社会保険の関係",
    "定年後に海外移住するメリット・デメリット完全ガイド",
    "海外移住前に必ず確認すべき保険の見直しポイント",
  ],
  casestudy: [
    "タイ・バンコクに移住した日本人エンジニアの実体験",
    "ポルトガル・リスボンに移住した40代夫婦のケーススタディ",
    "ドバイに移住した起業家の節税と生活コストの実態",
    "カナダ・バンクーバーに移住したITエンジニアの体験談",
    "マレーシア・クアラルンプールに移住した家族の生活費レポート",
    "ドイツ・ベルリンに移住したデザイナーのビザ取得体験談",
    "シンガポールに移住した30代共働き夫婦の資産形成事例",
    "スペイン・バルセロナに移住したフリーランサーの1年間",
  ],
};

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
- 最後にMoveWorthのシミュレーション機能への誘導を含める（リンクは必ず https://moveworthapp.com/simulate を使用すること）
- 記事末尾に「### 参考資料」セクションを追加し、トピックに関連する政府・公式機関・国際機関のURLを3〜5件リスト（実在する正確なURLのみ使用。ルートドメインまたは安定したURLを優先。URLの捏造は絶対不可）
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
    content: sanitizeMoveWorthLinks(result.content),
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

async function getNextCategory(): Promise<string> {
  // 既存の非visaブログ記事数から次のカテゴリを決定
  const { count } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .not("category", "in", '("visa")');

  const index = ((count ?? 0) % ROTATION.length);
  return ROTATION[index];
}

async function run() {
  const category = await getNextCategory();
  const pool = TOPIC_POOL[category];

  // 既存記事のタイトル（ja）とスラグを取得し、使用済みトピックを除外
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("slug, title")
    .eq("category", category);
  const existingJaTitles = (existing ?? []).map((p) => (p.title?.ja ?? "") as string);
  const existingSlugs = (existing ?? []).map((p) => (p.slug ?? "") as string).join(" ");

  // キーワードから固有名詞（地名・職種など）を抽出して重複判定
  function extractCoreWords(kw: string): string[] {
    // 日本語キーワードから意味のある部分を抽出（3文字以上の固有名詞候補）
    const segments = kw.split(/[・\s、。「」（）]/).filter((s) => s.length >= 3);
    return segments;
  }

  const unused = pool.filter((kw) => {
    const cores = extractCoreWords(kw);
    const matchesTitle = existingJaTitles.some((t) =>
      cores.some((c) => t.includes(c))
    );
    const matchesSlug = cores.some((c) => {
      // 日本語の固有名詞をローマ字に変換せず、スラグに英単語が含まれるか別途チェック
      return existingSlugs.includes(c.toLowerCase());
    });
    return !matchesTitle && !matchesSlug;
  });
  const candidates = unused.length > 0 ? unused : pool;
  const keyword = candidates[Math.floor(Math.random() * candidates.length)];

  console.log(`Generating: [${category}] ${keyword}`);

  const [ja, en, zh] = await Promise.all([
    generateContent(keyword, category, "ja"),
    generateContent(keyword, category, "en"),
    generateContent(keyword, category, "zh"),
  ]);

  const slug = generateSlug(en.title);
  const today = new Date().toISOString().split("T")[0];

  assertBlogPayload(
    { title: { ja: ja.title, en: en.title, zh: zh.title },
      description: { ja: ja.description, en: en.description, zh: zh.description },
      content: { ja: ja.content, en: en.content, zh: zh.content } },
    slug
  );

  const { error } = await supabase.from("blog_posts").insert({
    slug,
    category,
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

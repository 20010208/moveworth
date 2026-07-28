/**
 * study-country-me の content.zh のみを生成する（対象限定版）
 * ロジック・プロンプト・品質基準は scripts/backfill-study-zh.ts と同一。
 * backfill-study-zh.ts はzh未生成の全記事を一括処理するため、
 * study-country-me 1件だけを対象にしたい場合はこちらを使う。
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

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
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const SLUG = "study-country-me";

const REFUSAL_PATTERNS = [
  "申し訳ありません", "I cannot", "I'm sorry", "As an AI", "I'm unable",
  "cannot access the internet", "インターネットへのアクセス", "我无法", "对不起", "很抱歉",
];

function cleanJaForTranslation(ja: string): string {
  return ja.split("\n").filter((line) => !line.includes("example.com")).join("\n");
}

function cleanZhOutput(zh: string): string {
  return zh
    .replace(/^[\s\S]*?##\s*(?:中文翻译|文章内容|翻译内容)\s*\n/, "")
    .replace(/^##\s*文章标题[^\n]*\n[^\n]*\n\n?/, "")
    .trim();
}

async function generateZh(ja: string, jaTitle: string): Promise<string> {
  const jaClean = cleanJaForTranslation(ja);
  const prompt = `以下は日本語の留学情報記事です。同じ構成・見出し順序を維持しながら、中国語（简体字）に翻訳してください。

## 翻訳ルール
- 見出し（###）は構造を維持し日本語→中国語に翻訳すること
- 数値・費用・固有名詞はそのまま（日本語名称は中国語の一般的な表記に変換可）
- URLは変更しない（https://study.moveworthapp.com/simulate 等）
- 「MoveWorth.study」は「MoveWorth.study」のまま維持
- 文体は丁寧体（正式な情報記事として）
- 参考資料セクションがある場合はそのまま維持
- 創作や追加情報は一切加えないこと

## 記事タイトル
${jaTitle}

## 日本語原文
${jaClean.slice(0, 6000)}

中国語本文のみ返すこと（タイトル・説明文・メタ情報不要）。見出し（###）から始めること。`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 3000,
  });
  return cleanZhOutput(res.choices[0].message.content ?? "");
}

interface QcResult {
  pass: boolean;
  issues: string[];
}

function qualityCheck(zh: string, ja: string): QcResult {
  const issues: string[] = [];
  if (zh.length < 300) issues.push(`短すぎ: ${zh.length}字`);
  if (zh.length < ja.length * 0.3) issues.push(`JA比率低: zh=${zh.length} ja=${ja.length}`);
  if (zh.includes("example.com")) issues.push("example.com 混入");
  for (const p of REFUSAL_PATTERNS) {
    if (zh.includes(p)) issues.push(`拒否パターン: "${p}"`);
  }
  const jaH = (ja.match(/^###\s/gm) ?? []).length;
  const zhH = (zh.match(/^###\s/gm) ?? []).length;
  if (jaH > 0 && Math.abs(jaH - zhH) > 2) issues.push(`見出し数差大: ja=${jaH} zh=${zhH}`);
  return { pass: issues.length === 0, issues };
}

async function main() {
  const { data: before, error: beforeErr } = await sb
    .from("study_blog_posts")
    .select("slug, title, description, content, is_published")
    .eq("slug", SLUG)
    .single();
  if (beforeErr || !before) throw new Error(`取得失敗: ${beforeErr?.message}`);

  const content = before.content as Record<string, string>;
  if (content.zh && content.zh.trim() !== "") {
    console.log(`ℹ️  ${SLUG} は既にcontent.zhが設定済みです（${content.zh.length}字）。スキップします。`);
    return;
  }

  const ja = content.ja ?? "";
  const jaTitle = (before.title as Record<string, string>).ja ?? SLUG;

  console.log("ZH生成中...");
  const zh = await generateZh(ja, jaTitle);
  const { pass, issues } = qualityCheck(zh, ja);

  console.log(`ZH生成結果: ${zh.length}字`);
  if (!pass) {
    console.error("❌ 品質チェック失敗:", issues.join(", "));
    console.error("DB更新は行いません。");
    process.exit(1);
  }
  console.log("✅ 品質チェック通過:", zh.length, "字（要件: 300字以上、拒否パターン・example.com混入なし）");

  const newContent = { ...content, zh };
  const { error: updateErr } = await sb.from("study_blog_posts").update({ content: newContent }).eq("slug", SLUG);
  if (updateErr) throw new Error(`更新失敗: ${updateErr.message}`);

  const { data: after, error: afterErr } = await sb
    .from("study_blog_posts")
    .select("slug, title, description, content, is_published")
    .eq("slug", SLUG)
    .single();
  if (afterErr || !after) throw new Error(`更新後取得失敗: ${afterErr?.message}`);

  if (after.is_published !== before.is_published) throw new Error("is_publishedが変化しています");
  if (JSON.stringify(after.title) !== JSON.stringify(before.title)) throw new Error("titleが変化しています");
  if (JSON.stringify(after.description) !== JSON.stringify(before.description)) throw new Error("descriptionが変化しています");
  if (after.content.ja !== before.content.ja || after.content.en !== before.content.en) {
    throw new Error("ja/enが変化しています");
  }

  console.log("\n✅ content.zh 更新完了、is_published/title/description/ja/en 不変を確認");
  console.log(`最終文字数: ja=${after.content.ja.length} / en=${after.content.en.length} / zh=${after.content.zh.length}`);
}

main().catch((e) => {
  console.error("❌", e.message ?? e);
  process.exit(1);
});

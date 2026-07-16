/**
 * study-work-hk / study-work-in の拒否テキスト削除
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const SLUGS = ["study-work-hk", "study-work-in"];

// パターン1: ### 参考資料 の前にある前置き文
const REFUSAL_BEFORE_REF = /申し訳ありませんが[\s\S]*?\n\n(?=### 参考資料)/g;
// パターン2: 記事末尾に拒否文 + 参考資料なし（拒否文以降を丸ごと削除）
const REFUSAL_TAIL = /\n\n申し訳ありませんが[\s\S]*$/g;
// パターン3: 「実際のURLを提供することはできません」の行のみ削除
const REFUSAL_LINE = /^.*実際のURL.*提供.*できません.*\n?/gm;
// 重複空行の正規化
const DOUBLE_BLANK = /\n{3,}/g;

async function main() {
  const { data } = await sb.from("study_blog_posts").select("slug, content").in("slug", SLUGS);
  if (!data) { process.exit(1); }

  for (const row of data) {
    const slug = row.slug as string;
    const content = row.content as Record<string, string>;

    // まず現在の内容を表示
    const ja = content.ja ?? "";
    const refusalIdx = ja.indexOf("申し訳ありません");
    if (refusalIdx >= 0) {
      console.log(`\n[${slug}] 拒否テキスト位置: ${refusalIdx}字目`);
      console.log(`  前後50字: "...${ja.slice(Math.max(0, refusalIdx - 30), refusalIdx + 80)}..."`);
    }

    let patchedJa = ja
      .replace(REFUSAL_BEFORE_REF, "")
      .replace(REFUSAL_TAIL, "")
      .replace(REFUSAL_LINE, "")
      .replace(DOUBLE_BLANK, "\n\n")
      .trim();

    // 拒否パターン残存確認
    const REFUSAL_CHECK = /申し訳ありませんが|実際のURLを提供/;
    if (REFUSAL_CHECK.test(patchedJa)) {
      console.error(`❌ ${slug}: パッチ後も拒否パターン残存`);
      console.log("残存箇所:", patchedJa.match(REFUSAL_CHECK));
      continue;
    }

    const deletedChars = ja.length - patchedJa.length;
    console.log(`\n${slug}: -${deletedChars}字`);

    const { error } = await sb.from("study_blog_posts")
      .update({ content: { ...content, ja: patchedJa } })
      .eq("slug", slug);

    if (error) {
      console.error(`❌ ${slug}: DB更新失敗 - ${error.message}`);
    } else {
      console.log(`✅ ${slug}: 完了`);
    }
  }
}
main().catch(e => { console.error(e); process.exit(1); });

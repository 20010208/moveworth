import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** example.com リンクを削除し、重複参考資料セクションをまとめる */
function cleanTnContent(text: string): string {
  const lines = text.split("\n");
  const cleaned: string[] = [];
  let refSectionCount = 0;
  let skip = false;

  for (const line of lines) {
    // 参考資料セクション検出
    if (/^#{1,3}\s*(参考資料|References|参考資料|参考文献|参考资料)/.test(line)) {
      refSectionCount++;
      if (refSectionCount === 1) {
        // 最初の参考資料セクションはスキップ（後で1件にまとめる）
        skip = true;
        continue;
      } else {
        // 2番目の参考資料セクションは保持
        skip = false;
        cleaned.push(line);
        continue;
      }
    }

    if (skip) {
      // 最初の参考資料セクション内の行はスキップ（example.com 含む行も除去）
      continue;
    }

    // example.com を含む行は除去
    if (line.includes("example.com")) continue;

    cleaned.push(line);
  }

  return cleaned.join("\n");
}

async function main() {
  const { data, error } = await sb
    .from("blog_posts")
    .select("id,content")
    .eq("slug", "visa-tn")
    .single();

  if (error || !data) {
    console.error("visa-tn 取得失敗:", error?.message);
    return;
  }

  const content = data.content as Record<string, string>;
  const newContent: Record<string, string> = { ...content };
  const langs = ["ja", "en", "zh"] as const;

  for (const lang of langs) {
    const original = content[lang];
    if (!original) continue;

    if (!original.includes("example.com")) {
      console.log(`[${lang}] example.com なし — スキップ`);
      continue;
    }

    const fixed = cleanTnContent(original);
    newContent[lang] = fixed;
    const removed = (original.match(/example\.com/g) ?? []).length;
    console.log(`[${lang}] example.com × ${removed} 件除去 ✓`);
  }

  const { error: updateErr } = await sb
    .from("blog_posts")
    .update({ content: newContent })
    .eq("id", data.id);

  if (updateErr) {
    console.error("更新エラー:", updateErr.message);
  } else {
    console.log("✅ visa-tn 更新完了");
  }
}

main().catch(console.error);

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
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const SLUG = "retirement-abroad-a-comprehensive-guide-to-pros-and-con-2026";

async function main() {
  const { data } = await sb.from("blog_posts").select("slug, is_published, thumbnail").eq("slug", SLUG).single();
  if (!data) { console.error("レコードが見つかりません"); process.exit(1); }

  console.log(`[pub=${data.is_published}] ${data.slug}`);
  console.log(`thumbnail: ${data.thumbnail ?? "(null)"}`);

  // ユーザー承認済みの明示削除のため is_published チェックをスキップ

  // サムネイルの他参照チェック
  if (data.thumbnail) {
    const { data: others } = await sb.from("blog_posts").select("slug").eq("thumbnail", data.thumbnail).neq("slug", SLUG);
    if ((others ?? []).length > 0) {
      console.error(`サムネイルが他記事から参照中: ${others!.map(r => r.slug).join(", ")} → Storage削除スキップ`);
    } else {
      const filePath = data.thumbnail.split("blog-images/")[1];
      const { error } = await sb.storage.from("blog-images").remove([filePath]);
      if (error) console.error(`Storage削除エラー: ${error.message}`);
      else console.log(`✅ Storage削除: ${filePath}`);
    }
  }

  const { error } = await sb.from("blog_posts").delete().eq("slug", SLUG);
  if (error) { console.error(`DB削除エラー: ${error.message}`); process.exit(1); }
  console.log(`✅ DB削除完了: ${SLUG}`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });

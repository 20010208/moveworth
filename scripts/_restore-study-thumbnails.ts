/**
 * サムネイル復元: study-country-{code} の thumbnail を -en.png から plain .png に差し戻す
 * Storageの -en.png は削除しない（将来の言語別カラム実装時に活用予定）
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
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
const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/`;

async function main() {
  // Get all study-country-{code} with -en.png thumbnails
  const { data: posts } = await sb.from("study_blog_posts")
    .select("slug,thumbnail")
    .like("slug","study-country-%")
    .not("slug","like","study-country-%-en")
    .not("slug","like","study-country-%-zh")
    .like("thumbnail","%-en.png");

  if (!posts?.length) { console.log("復元対象なし（すでに復元済み）"); return; }
  console.log("復元対象:", posts.length, "件");

  let ok = 0, err = 0;
  for (const p of posts) {
    // study-country-ae → plain .png
    const code = p.slug.replace("study-country-","");
    const plainUrl = `${BASE}study-country-${code}.png`;
    const { error } = await sb.from("study_blog_posts")
      .update({ thumbnail: plainUrl })
      .eq("slug", p.slug);
    if (error) {
      console.error(`  ❌ ${p.slug}: ${error.message}`);
      err++;
    } else {
      console.log(`  ✅ ${p.slug}: -en.png → ${code}.png`);
      ok++;
    }
  }
  console.log(`\n復元完了: ✅ ${ok}件 / ❌ ${err}件`);
  console.log("※ -en.png ファイルは Storage に残存（将来の言語別カラム実装時に活用）");
}
main().catch(e => { console.error(e); process.exit(1); });

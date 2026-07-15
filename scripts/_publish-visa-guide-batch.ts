/**
 * visa-guide 記事を is_published: true に切り替える（再生成なし）
 * 引数: --slugs=slug1,slug2,...
 */
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

const slugsArg = process.argv.find((a) => a.startsWith("--slugs="));
if (!slugsArg) { console.error("--slugs=slug1,slug2,... が必要"); process.exit(1); }
const SLUGS = slugsArg.split("=")[1].split(",").map((s) => s.trim()).filter(Boolean);

async function main() {
  for (const slug of SLUGS) {
    const { data, error } = await sb
      .from("blog_posts")
      .select("slug, is_published, title")
      .eq("slug", slug)
      .single();

    if (error || !data) { console.error(`❌ 取得失敗: ${slug}`); continue; }
    if (data.is_published) { console.log(`⏭  既公開: ${slug}`); continue; }

    const { error: upErr } = await sb
      .from("blog_posts")
      .update({ is_published: true })
      .eq("slug", slug);

    if (upErr) { console.error(`❌ 公開失敗: ${slug} — ${upErr.message}`); continue; }
    console.log(`✅ 公開: ${slug}`);
    console.log(`   title: ${(data.title as Record<string,string>).ja}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });

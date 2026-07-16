/**
 * study_blog_posts の zh コンテンツ存在確認
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

async function main() {
  const { data } = await sb
    .from("study_blog_posts")
    .select("slug, content, title")
    .eq("is_published", true)
    .order("slug");

  if (!data) { console.error("fetch failed"); process.exit(1); }

  let zhExists = 0, zhEmpty = 0;
  console.log("slug | title.zh | content.zh長");
  for (const r of data) {
    const c = (r.content ?? {}) as Record<string, string>;
    const t = (r.title ?? {}) as Record<string, string>;
    const zhLen = (c.zh ?? "").trim().length;
    const titleZh = (t.zh ?? "").trim();
    if (zhLen > 0) {
      zhExists++;
      console.log(`✅ ${r.slug} | title.zh="${titleZh}" | content.zh=${zhLen}字`);
    } else {
      zhEmpty++;
      console.log(`⬜ ${r.slug} | title.zh="${titleZh}" | content.zh=なし`);
    }
  }
  console.log(`\n合計${data.length}件: zh有=${zhExists} zh無=${zhEmpty}`);
}
main().catch(e => { console.error(e); process.exit(1); });

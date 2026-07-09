import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

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

async function run() {
  // blog_postsテーブルで確認
  const slugs = ["study-country-ro", "study-country-nz", "study-ro", "study-abroad-phone-sim-guide-2026"];
  const { data, error } = await sb.from("blog_posts").select("slug, thumbnail").in("slug", slugs);
  console.log("=== blog_posts ===");
  console.log(data, error?.message);

  // study_blog_postsなど別テーブルの可能性を確認
  const { data: d2, error: e2 } = await sb.from("study_blog_posts").select("slug, thumbnail").in("slug", slugs);
  console.log("\n=== study_blog_posts ===");
  console.log(d2, e2?.message);
}

run().catch(console.error);

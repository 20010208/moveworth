/** 指定 slug を is_published: false にする（再生成前の一時 draft 化） */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const l of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = l.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim();
    if (!(k in process.env)) process.env[k] = t.slice(eq + 1).trim();
  }
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const slug = process.argv[2];
  if (!slug) { console.error("Usage: npx tsx unpublish-slug.ts <slug>"); process.exit(1); }
  const { error } = await sb.from("blog_posts").update({ is_published: false }).eq("slug", slug);
  if (error) { console.error("Error:", error.message); process.exit(1); }
  console.log(`📝 ${slug} → is_published: false`);
}

main().catch(console.error);

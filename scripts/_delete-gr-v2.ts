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

const SLUG = "greece-residency-visa-cost-2026-v2";

async function main() {
  const { data } = await sb.from("blog_posts").select("slug, is_published").eq("slug", SLUG).single();
  if (!data) { console.log("対象なし（既に削除済み）"); return; }
  if (data.is_published) { console.error("❌ is_published=true のため削除中止"); process.exit(1); }

  const { error } = await sb.from("blog_posts").delete().eq("slug", SLUG);
  if (error) { console.error("削除失敗:", error.message); process.exit(1); }
  console.log(`✅ 削除: ${SLUG}`);
}

main().catch(e => { console.error(e); process.exit(1); });

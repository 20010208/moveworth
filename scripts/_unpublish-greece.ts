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

const SLUG = "greece-residency-visa-cost-2026";

async function main() {
  const { data, error: fetchErr } = await sb
    .from("blog_posts")
    .select("slug, is_published")
    .eq("slug", SLUG)
    .single();

  if (fetchErr || !data) {
    console.error(`取得失敗: ${fetchErr?.message}`);
    process.exit(1);
  }

  console.log(`現状: ${SLUG} is_published=${data.is_published}`);

  if (!data.is_published) {
    console.log("既に非公開のためスキップ");
    process.exit(0);
  }

  const { error } = await sb
    .from("blog_posts")
    .update({ is_published: false })
    .eq("slug", SLUG);

  if (error) {
    console.error(`更新失敗: ${error.message}`);
    process.exit(1);
  }

  console.log(`✅ is_published → false に変更完了`);
}

main().catch(e => { console.error(e); process.exit(1); });

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

const slugs = ["visa-au","visa-be","visa-ee","visa-gb","visa-my","visa-pl","visa-sg","visa-th","visa-us"];

async function main() {
  const { data } = await sb
    .from("blog_posts")
    .select("slug,content,is_published")
    .in("slug", slugs)
    .order("slug");

  for (const r of data ?? []) {
    const c = r.content as { ja?: string };
    const ja = c?.ja ?? "";
    const patterns = ["## 税金", "### 税金", "## 所得税", "### 所得税", "## 税制", "### 税制", "## 税"];
    let sectionStart = -1;
    for (const p of patterns) {
      const idx = ja.indexOf(p);
      if (idx >= 0 && (sectionStart < 0 || idx < sectionStart)) sectionStart = idx;
    }
    if (sectionStart < 0) sectionStart = ja.indexOf("税");
    const section = sectionStart >= 0 ? ja.slice(sectionStart, sectionStart + 600) : "(税セクションなし)";
    console.log(`=== ${r.slug} [published:${r.is_published}] ===`);
    console.log(section.slice(0, 600));
    console.log();
  }
}

main().catch(console.error);

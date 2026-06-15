import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    const val = t.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// slug → thumbnail path のマッピング
const updates: Record<string, string> = {
  "visa-be": "/images/blog/visa-be.png",
};

async function run() {
  for (const [slug, thumbnail] of Object.entries(updates)) {
    const { error } = await supabase
      .from("blog_posts")
      .update({ thumbnail })
      .eq("slug", slug);
    if (error) console.error(`❌ ${slug}: ${error.message}`);
    else console.log(`✅ ${slug} → ${thumbnail}`);
  }
}

run();

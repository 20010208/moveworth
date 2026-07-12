import { existsSync, readFileSync, writeFileSync } from "fs";
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
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const slugs = ["visa-be", "visa-ee", "visa-pl", "visa-tn"];
  const out: string[] = [];

  for (const slug of slugs) {
    const { data, error } = await sb
      .from("blog_posts")
      .select("slug,is_published,content")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      out.push(`NOT FOUND: ${slug} (${error?.message})`);
      continue;
    }

    const ja = (data.content as Record<string, string>).ja;
    out.push(`===== ${slug}  published=${data.is_published} =====`);
    out.push(ja ?? "(no ja)");
    out.push(`--- total: ${ja?.length ?? 0} chars ---`);
    out.push("");
  }

  const outPath = "C:/Users/chiji/AppData/Local/Temp/ja-drafts.txt";
  writeFileSync(outPath, out.join("\n"), "utf-8");
  console.log("Saved to: " + outPath);
}

main().catch(console.error);

import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { runSimulation } from "../src/lib/simulation/basic-calculator";

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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  // SLUG 環境変数で指定、なければ最新のsimulator記事（is_published=falseのdraftを優先）
  const slug = process.env.SLUG ?? "simulator-sg-couple-2026";

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, title, content, is_published")
    .eq("slug", slug)
    .limit(1);

  if (!posts?.length) {
    console.error(`slug=${slug} が見つかりません`);
    process.exit(1);
  }

  const post = posts[0];
  console.log("### ARTICLE CONTENT (raw) ###");
  console.log(post.content.ja);

  const { data: personas } = await supabase
    .from("simulator_personas")
    .select("*")
    .eq("blog_post_slug", post.slug)
    .limit(1);

  if (!personas?.length) {
    console.error("対応するペルソナが見つかりません");
    process.exit(1);
  }

  const p = personas[0];
  const { simulation_input, ...rest } = p;

  console.log("\n\n### PERSONA JSON ###");
  console.log(JSON.stringify(rest, null, 2));

  console.log("\n\n### SIMULATION_INPUT ###");
  console.log(JSON.stringify(simulation_input, null, 2));

  console.log("\n\n### SIMULATION_RESULT (full) ###");
  const result = runSimulation(simulation_input);
  console.log(JSON.stringify(result, null, 2));
}

main();

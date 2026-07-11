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
  // 最新のdraft記事を取得
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, title, description, content, category, is_published, published_at")
    .eq("category", "simulator")
    .order("published_at", { ascending: false })
    .limit(1);

  if (!posts?.length) {
    console.error("simulator記事が見つかりません");
    process.exit(1);
  }

  const post = posts[0];
  console.log("=".repeat(60));
  console.log(`SLUG: ${post.slug}`);
  console.log(`PUBLISHED: ${post.is_published}`);
  console.log(`DATE: ${post.published_at}`);
  console.log("=".repeat(60));
  console.log(`TITLE: ${post.title.ja}`);
  console.log(`DESC: ${post.description.ja}`);
  console.log("=".repeat(60));
  console.log("CONTENT:");
  console.log(post.content.ja);
  console.log("=".repeat(60));

  // 対応するペルソナを取得
  const { data: persona } = await supabase
    .from("simulator_personas")
    .select("*")
    .eq("blog_post_slug", post.slug)
    .limit(1);

  if (persona?.length) {
    const p = persona[0];
    console.log("\nPERSONA JSON:");
    const { simulation_input, ...rest } = p;
    console.log(JSON.stringify(rest, null, 2));

    console.log("\nSIMULATION_INPUT:");
    console.log(JSON.stringify(simulation_input, null, 2));

    console.log("\nSIMULATION_RESULT (key fields):");
    const result = runSimulation(simulation_input);
    console.log(JSON.stringify({
      annualSavingsCurrent: result.annualSavingsCurrent,
      annualSavingsTarget: result.annualSavingsTarget,
      assetDifference: result.assetDifference,
      monthlyBreakdown: result.monthlyBreakdown,
      yr5: result.yearlyResults[5],
      yr10: result.yearlyResults[10],
    }, null, 2));
  }
}

main();

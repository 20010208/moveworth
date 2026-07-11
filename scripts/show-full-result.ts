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
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, title, content, is_published")
    .eq("category", "simulator")
    .order("published_at", { ascending: false })
    .limit(1);

  const post = posts![0];
  console.log("### ARTICLE CONTENT (raw) ###");
  console.log(post.content.ja);

  const { data: personas } = await supabase
    .from("simulator_personas")
    .select("simulation_input")
    .eq("blog_post_slug", post.slug)
    .limit(1);

  const simInput = personas![0].simulation_input;
  const result = runSimulation(simInput);

  console.log("\n\n### SIMULATION_INPUT ###");
  console.log(JSON.stringify(simInput, null, 2));

  console.log("\n\n### SIMULATION_RESULT (full) ###");
  console.log(JSON.stringify(result, null, 2));
}

main();

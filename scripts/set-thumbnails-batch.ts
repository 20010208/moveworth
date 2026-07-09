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
const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/`;

const blogEntries = [
  { slug: "freelancers-key-considerations-for-moving-abroad-2026", file: "freelancers-key-considerations-for-moving-abroad-2026.png" },
  { slug: "visa-ro",                                               file: "visa-ro.png" },
  { slug: "building-wealth-a-case-study-of-a-dual-income-couple-in-2026", file: "building-wealth-a-case-study-of-a-dual-income-couple-in-2026.png" },
];

const studyEntries = [
  { slug: "study-country-ro",                 file: "study-country-ro.png" },
  { slug: "study-country-nz",                 file: "study-country-nz.png" },
  { slug: "study-ro",                         file: "study-ro.png" },
  { slug: "study-abroad-phone-sim-guide-2026", file: "study-abroad-phone-sim-guide-2026.png" },
];

async function run() {
  console.log("=== blog_posts ===");
  for (const { slug, file } of blogEntries) {
    const { error } = await sb.from("blog_posts").update({ thumbnail: `${BASE}${file}` }).eq("slug", slug);
    if (error) console.error(`❌ ${slug}:`, error.message);
    else console.log(`✅ ${slug}`);
  }

  console.log("\n=== study_blog_posts ===");
  for (const { slug, file } of studyEntries) {
    const { error } = await sb.from("study_blog_posts").update({ thumbnail: `${BASE}${file}` }).eq("slug", slug);
    if (error) console.error(`❌ ${slug}:`, error.message);
    else console.log(`✅ ${slug}`);
  }
}

run().catch(console.error);

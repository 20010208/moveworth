import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { blogPosts } from "../src/data/blog-posts";

// Load .env.local for local execution
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

async function migrate() {
  console.log(`Migrating ${blogPosts.length} posts...`);
  let success = 0;
  let failed = 0;

  for (const post of blogPosts) {
    const { error } = await supabase.from("blog_posts").upsert({
      slug: post.slug,
      category: post.category,
      published_at: post.date,
      reading_minutes: post.readingTime,
      thumbnail: post.thumbnail ?? null,
      title: post.title,
      description: post.description,
      content: post.content,
      locales: post.locales ?? null,
      pinned: post.pinned ?? false,
      is_published: true,
    });

    if (error) {
      console.error(`❌ ${post.slug}: ${error.message}`);
      failed++;
    } else {
      console.log(`✅ ${post.slug}`);
      success++;
    }
  }

  console.log(`\nDone: ${success} succeeded, ${failed} failed`);
}

migrate();

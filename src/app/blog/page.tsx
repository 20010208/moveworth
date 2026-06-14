import { createServerClient } from "@/lib/supabase-server";
import { BlogListClient } from "@/components/blog/blog-list-client";
import type { BlogPost } from "@/types/blog";

export const revalidate = 3600;

export default async function BlogPage() {
  const supabase = createServerClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, category, published_at, reading_minutes, thumbnail, title, description, locales, pinned")
    .eq("is_published", true)
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false });

  return <BlogListClient posts={(posts ?? []) as BlogPost[]} />;
}

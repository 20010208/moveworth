import { createServerClient } from "@/lib/supabase-server";
import { StudyBlogListClient } from "@/components/study-blog/study-blog-list-client";
import type { StudyBlogPost } from "@/types/study-blog";

export const revalidate = 3600;

export default async function StudyBlogPage() {
  const supabase = createServerClient();
  const { data: posts } = await supabase
    .from("study_blog_posts")
    .select("slug, category, date, reading_time, title, description, thumbnail")
    .eq("is_published", true)
    .order("date", { ascending: false });

  return <StudyBlogListClient posts={(posts ?? []) as StudyBlogPost[]} />;
}

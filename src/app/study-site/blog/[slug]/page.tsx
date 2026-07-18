import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { StudyBlogPostContent } from "@/components/study-blog/study-blog-post-content";
import type { StudyBlogPost } from "@/types/study-blog";

const BASE_URL = "https://study.moveworthapp.com";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

export async function generateStaticParams() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("study_blog_posts")
    .select("slug")
    .eq("is_published", true);
  return (data ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("study_blog_posts")
    .select("slug, title, description, date, thumbnail, thumbnail_ja, thumbnail_en, thumbnail_zh")
    .eq("slug", slug)
    .single();
  if (!data) return {};
  const post = data as StudyBlogPost;
  return {
    title: post.title.ja,
    description: post.description.ja,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title.ja,
      description: post.description.ja,
      url: `${BASE_URL}/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      siteName: "MoveWorth.study",
      ...((post.thumbnail_ja ?? post.thumbnail) && {
        images: [{ url: (post.thumbnail_ja ?? post.thumbnail)!, width: 1200, height: 630, alt: post.title.ja }],
      }),
    },
    twitter: {
      card: (post.thumbnail_ja ?? post.thumbnail) ? "summary_large_image" : "summary",
      title: post.title.ja,
      description: post.description.ja,
      ...((post.thumbnail_ja ?? post.thumbnail) && { images: [(post.thumbnail_ja ?? post.thumbnail)!] }),
    },
  };
}

export default async function StudyBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("study_blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!data) notFound();

  const post = data as StudyBlogPost;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title.ja,
    description: post.description.ja,
    datePublished: post.date,
    author: { "@type": "Organization", name: "MoveWorth", url: BASE_URL },
    publisher: { "@type": "Organization", name: "MoveWorth", url: BASE_URL },
    url: `${BASE_URL}/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <StudyBlogPostContent post={post} />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { BlogPostContent } from "@/components/blog/blog-post-content";
import type { BlogPost } from "@/types/blog";

const BASE_URL = "https://www.moveworthapp.com";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);
  return (data ?? []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, description, thumbnail, published_at")
    .eq("slug", slug)
    .single();

  if (!post) return {};

  const title = post.title.ja ?? post.title.en;
  const description = post.description.ja ?? post.description.en;
  const url = `${BASE_URL}/blog/${slug}`;
  const ogImage = post.thumbnail
    ? post.thumbnail.startsWith("http") ? post.thumbnail : `${BASE_URL}${post.thumbnail}`
    : `${BASE_URL}/og-image.png`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.published_at,
      siteName: "MoveWorth",
      locale: "ja_JP",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: (post as BlogPost).title.ja ?? (post as BlogPost).title.en,
    description: (post as BlogPost).description.ja ?? (post as BlogPost).description.en,
    datePublished: post.published_at,
    dateModified: post.published_at,
    author: { "@type": "Organization", name: "MoveWorth", url: BASE_URL },
    publisher: { "@type": "Organization", name: "MoveWorth", url: BASE_URL },
    url: `${BASE_URL}/blog/${slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogPostContent post={post as BlogPost} />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost, blogPosts } from "@/data/blog-posts";
import { BlogPostContent } from "@/components/blog/blog-post-content";

const BASE_URL = "https://moveworth-alpha.vercel.app";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) return {};

  const title = post.title.ja;
  const description = post.description.ja;
  const url = `${BASE_URL}/blog/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.date,
      siteName: "MoveWorth",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title.ja,
    description: post.description.ja,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "MoveWorth",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "MoveWorth",
      url: BASE_URL,
    },
    url: `${BASE_URL}/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogPostContent slug={slug} />
    </>
  );
}

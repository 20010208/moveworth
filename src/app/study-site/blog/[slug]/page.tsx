import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStudyBlogPost, studyBlogPosts } from "@/data/study-blog-posts";
import { StudyBlogPostContent } from "@/components/study-blog/study-blog-post-content";

const BASE_URL = "https://study.moveworthapp.com";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return studyBlogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getStudyBlogPost(slug);
  if (!post) return {};
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
    },
  };
}

export default async function StudyBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getStudyBlogPost(slug);
  if (!post) notFound();

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
      <StudyBlogPostContent slug={slug} />
    </>
  );
}

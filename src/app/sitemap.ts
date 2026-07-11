import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog-posts";
import { studyBlogPosts } from "@/data/study-blog-posts";
import { createServerClient } from "@/lib/supabase-server";

export const revalidate = 3600;

const BASE_URL = "https://www.moveworthapp.com";
const STUDY_URL = "https://study.moveworthapp.com";

const studyCountryCodes = [
  "JP","KR","TW","HK","SG","MY","TH","PH","ID","VN",
  "AU","NZ","US","CA","GB","IE","DE","FR","NL","CH",
  "ES","PT","SE","NO","DK","GR","IT","MT","FI","AT","CZ",
  "CN","IN","ZA","AE","GE","BR","CO","MX","AR",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/simulate`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/subscribe`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // 静的配列（旧記事）
  const staticBlogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Supabase動的記事（is_published=true かつ静的配列に未登録のもの）
  const staticSlugs = new Set(blogPosts.map((p) => p.slug));
  let supabaseBlogPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, published_at")
      .eq("is_published", true);
    supabaseBlogPages = (data ?? [])
      .filter((p) => !staticSlugs.has(p.slug))
      .map((p) => ({
        url: `${BASE_URL}/blog/${p.slug}`,
        lastModified: new Date(p.published_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
  } catch {
    // Supabase接続エラー時は静的記事のみで継続
  }

  // 留学サイト
  const studyStaticPages: MetadataRoute.Sitemap = [
    {
      url: STUDY_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${STUDY_URL}/simulate`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${STUDY_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const studyCountryPages: MetadataRoute.Sitemap = studyCountryCodes.map((code) => ({
    url: `${STUDY_URL}/${code.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const studyBlogPages: MetadataRoute.Sitemap = studyBlogPosts.map((post) => ({
    url: `${STUDY_URL}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...staticBlogPages,
    ...supabaseBlogPages,
    ...studyStaticPages,
    ...studyCountryPages,
    ...studyBlogPages,
  ];
}

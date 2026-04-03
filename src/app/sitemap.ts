import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog-posts";
import { studyBlogPosts } from "@/data/study-blog-posts";

const BASE_URL = "https://www.moveworthapp.com";
const STUDY_URL = "https://study.moveworthapp.com";

const studyCountryCodes = [
  "JP","KR","TW","HK","SG","MY","TH","PH","ID","VN",
  "AU","NZ","US","CA","GB","IE","DE","FR","NL","CH",
  "ES","PT","SE","NO","DK","GR","IT","MT","FI","AT","CZ",
  "CN","IN","ZA","AE","GE","BR","CO","MX","AR",
];

export default function sitemap(): MetadataRoute.Sitemap {
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

  const blogPostPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

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
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const studyBlogPages: MetadataRoute.Sitemap = studyBlogPosts.map((post) => ({
    url: `${STUDY_URL}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...blogPostPages, ...studyStaticPages, ...studyCountryPages, ...studyBlogPages];
}

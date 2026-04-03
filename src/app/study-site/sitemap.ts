import type { MetadataRoute } from "next";
import { studyBlogPosts } from "@/data/study-blog-posts";

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
      url: STUDY_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
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

  const countryPages: MetadataRoute.Sitemap = studyCountryCodes.map((code) => ({
    url: `${STUDY_URL}/${code.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = studyBlogPosts.map((post) => ({
    url: `${STUDY_URL}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...countryPages, ...blogPages];
}

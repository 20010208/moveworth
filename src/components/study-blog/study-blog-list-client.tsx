"use client";

import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { studyBlogCategories } from "@/data/study-blog-posts";
import { useState } from "react";
import type { StudyBlogPost } from "@/types/study-blog";
import { useTranslation } from "@/lib/i18n";

export function StudyBlogListClient({ posts }: { posts: StudyBlogPost[] }) {
  const { locale } = useTranslation();
  const lang: "ja" | "en" | "zh" = locale === "ja" ? "ja" : locale === "zh" ? "zh" : "en";
  const resolveThumbnail = (post: StudyBlogPost): string | null | undefined => {
    if (lang === "ja") return post.thumbnail_ja ?? post.thumbnail;
    if (lang === "zh") return post.thumbnail_zh ?? post.thumbnail_en ?? post.thumbnail_ja ?? post.thumbnail;
    return post.thumbnail_en ?? post.thumbnail_ja ?? post.thumbnail;
  };
  const L = <T extends { ja: string; en: string; zh?: string }>(obj: T): string => {
    if (lang === "zh") return obj.zh || obj.en || obj.ja;
    if (lang === "en") return obj.en || obj.ja;
    return obj.ja;
  };

  const ui = {
    heading:  lang === "ja" ? "留学ブログ" : "Study Abroad Blog",
    subhead:  lang === "ja"
      ? "海外留学の準備・費用・現地生活・アルバイトルールなど、留学に役立つ情報を発信しています。"
      : "Helpful information about studying abroad — preparation, costs, local life, and part-time work rules.",
    all:      lang === "ja" ? "すべて" : "All",
    minRead:  lang === "ja" ? "分で読める" : "min read",
    readMore: lang === "ja" ? "続きを読む" : "Read more",
  };

  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredPosts =
    activeCategory === "all"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            {ui.heading}
          </h1>
          <p className="text-muted text-sm max-w-2xl mx-auto">
            {ui.subhead}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === "all"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-white border border-border/60 text-muted hover:text-foreground hover:border-primary/30"
            }`}
          >
            {ui.all}
          </button>
          {Object.entries(studyBlogCategories).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === key
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white border border-border/60 text-muted hover:text-foreground hover:border-primary/30"
              }`}
            >
              {val[lang]}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`${resolveThumbnail(post) ? "flex flex-col sm:flex-row" : "flex"} bg-white border border-border/60 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all group overflow-hidden`}
            >
              {resolveThumbnail(post) && (
                <div className="w-full overflow-hidden flex-shrink-0 sm:w-[374px]">
                  <img
                    src={resolveThumbnail(post)!}
                    alt={L(post.title)}
                    className="w-full h-auto object-cover object-center"
                  />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                      <Tag className="h-3 w-3" />
                      {studyBlogCategories[post.category]?.[lang] ?? post.category}
                    </span>
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.reading_time} {ui.minRead}
                    </span>
                    <span className="text-xs text-muted">{post.date}</span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    {L(post.title)}
                  </h2>
                  <p className="text-sm text-muted line-clamp-3 mb-3">
                    {L(post.description)}
                  </p>
                </div>
                <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                  {ui.readMore}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Tag, Search } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { blogCategories } from "@/data/blog-posts";
import { useState } from "react";
import type { BlogPost, MultiLang } from "@/types/blog";

export function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const { t, locale } = useTranslation();
  const lang = locale as "en" | "ja" | "zh";
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getLabel = (obj: MultiLang) =>
    (obj[lang as keyof typeof obj] as string | undefined) ?? obj.en;

  const filteredPosts = posts
    .filter((p) => !p.locales || p.locales.includes(lang))
    .filter((p) => {
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        getLabel(p.title).toLowerCase().includes(q) ||
        getLabel(p.description).toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            {t("blog.title")}
          </h1>
          <p className="text-muted text-sm max-w-2xl mx-auto">
            {t("blog.description")}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("blog.searchPlaceholder")}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-border/60 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === "all"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-white border border-border/60 text-muted hover:text-foreground hover:border-primary/30"
            }`}
          >
            {t("blog.all")}
          </button>
          {Object.entries(blogCategories).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === key
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white border border-border/60 text-muted hover:text-foreground hover:border-primary/30"
              }`}
            >
              {getLabel(val)}
            </button>
          ))}
        </div>

        {/* Blog Post List */}
        <div className="space-y-5">
          {filteredPosts.length === 0 && (
            <p className="text-center text-muted py-12">{t("blog.noResults")}</p>
          )}
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex bg-white border border-border/60 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all group overflow-hidden"
            >
              {post.thumbnail && (
                <div className="w-[140px] h-[90px] sm:w-[374px] sm:h-auto flex-shrink-0 overflow-hidden">
                  <Image
                    src={post.thumbnail}
                    alt={getLabel(post.title)}
                    width={374}
                    height={280}
                    className={`w-full h-full sm:h-auto ${post.slug === "saily-esim-review-overseas-travel-guide-2026" ? "object-contain" : "object-cover object-center"}`}
                    sizes="(max-width: 640px) 140px, 374px"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                      <Tag className="h-3 w-3" />
                      {blogCategories[post.category as keyof typeof blogCategories]
                        ? getLabel(blogCategories[post.category as keyof typeof blogCategories])
                        : post.category}
                    </span>
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.reading_minutes} {t("blog.minRead")}
                    </span>
                    <span className="text-xs text-muted">{post.published_at}</span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {getLabel(post.title)}
                  </h2>
                  <p className="text-sm text-muted line-clamp-2 mb-3">
                    {getLabel(post.description)}
                  </p>
                </div>
                <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                  {t("blog.readMore")}
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

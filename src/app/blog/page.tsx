"use client";

import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { blogPosts, blogCategories } from "@/data/blog-posts";
import { useState } from "react";

export default function BlogPage() {
  const { t, locale } = useTranslation();
  const lang = locale as "en" | "ja";
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredPosts =
    activeCategory === "all"
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            {t("blog.title")}
          </h1>
          <p className="text-muted text-sm max-w-2xl mx-auto">
            {t("blog.description")}
          </p>
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
              {val[lang]}
            </button>
          ))}
        </div>

        {/* Blog Post List */}
        <div className="space-y-5">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                  <Tag className="h-3 w-3" />
                  {blogCategories[post.category][lang]}
                </span>
                <span className="text-xs text-muted flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readingTime} {t("blog.minRead")}
                </span>
                <span className="text-xs text-muted">{post.date}</span>
              </div>
              <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                {post.title[lang]}
              </h2>
              <p className="text-sm text-muted line-clamp-2 mb-3">
                {post.description[lang]}
              </p>
              <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                {t("blog.readMore")}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { studyBlogCategories } from "@/data/study-blog-posts";
import { useState } from "react";
import type { StudyBlogPost } from "@/types/study-blog";

export function StudyBlogListClient({ posts }: { posts: StudyBlogPost[] }) {
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
            留学ブログ
          </h1>
          <p className="text-muted text-sm max-w-2xl mx-auto">
            海外留学の準備・費用・現地生活・アルバイトルールなど、留学に役立つ情報を発信しています。
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
            すべて
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
              {val.ja}
            </button>
          ))}
        </div>

        <div className="space-y-5">
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
                      alt={post.title.ja}
                      width={374}
                      height={280}
                      className="w-full h-full object-cover object-center sm:h-auto"
                      sizes="(max-width: 640px) 140px, 374px"
                    />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                        <Tag className="h-3 w-3" />
                        {studyBlogCategories[post.category]?.ja ?? post.category}
                      </span>
                      <span className="text-xs text-muted flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.reading_time} 分で読める
                      </span>
                      <span className="text-xs text-muted">{post.date}</span>
                    </div>
                    <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                      {post.title.ja}
                    </h2>
                    <p className="text-sm text-muted line-clamp-3 mb-3">
                      {post.description.ja}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    続きを読む
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

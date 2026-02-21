"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Tag, Share2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { getBlogPost, blogCategories } from "@/data/blog-posts";

export function BlogPostContent({ slug }: { slug: string }) {
  const { t, locale } = useTranslation();
  const lang = locale as "en" | "ja";
  const post = getBlogPost(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t("blog.notFound")}
          </h1>
          <Link
            href="/blog"
            className="text-primary hover:underline flex items-center gap-1 justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("blog.backToList")}
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    const title = post.title[lang];
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const renderContent = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = () => {
      if (tableRows.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="overflow-x-auto my-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {tableRows[0].map((cell, j) => (
                    <th
                      key={j}
                      className="border border-border/60 bg-surface px-3 py-2 text-left font-semibold text-foreground"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(2).map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="border border-border/60 px-3 py-2 text-muted"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("|")) {
        inTable = true;
        const cells = line
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        tableRows.push(cells);
        continue;
      } else if (inTable) {
        inTable = false;
        flushTable();
      }

      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="text-lg font-bold text-foreground mt-8 mb-3">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="text-xl font-bold text-foreground mt-10 mb-4">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith("**") && line.endsWith("**")) {
        elements.push(
          <p key={i} className="font-semibold text-foreground mt-4 mb-1">
            {line.slice(2, -2)}
          </p>
        );
      } else if (line.startsWith("- **")) {
        const match = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)$/);
        if (match) {
          elements.push(
            <li key={i} className="ml-4 text-sm text-muted mb-1 list-disc">
              <span className="font-semibold text-foreground">{match[1]}</span>
              {match[2] ? `: ${match[2]}` : ""}
            </li>
          );
        } else {
          elements.push(
            <li key={i} className="ml-4 text-sm text-muted mb-1 list-disc">
              {line.slice(2)}
            </li>
          );
        }
      } else if (line.startsWith("- ")) {
        elements.push(
          <li key={i} className="ml-4 text-sm text-muted mb-1 list-disc">
            {line.slice(2)}
          </li>
        );
      } else if (line.trim() === "") {
        elements.push(<div key={i} className="h-2" />);
      } else {
        elements.push(
          <p key={i} className="text-sm text-muted leading-relaxed">
            {line}
          </p>
        );
      }
    }

    if (tableRows.length > 0) {
      flushTable();
    }

    return elements;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("blog.backToList")}
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-4">
            {post.title[lang]}
          </h1>
          <p className="text-muted text-sm">{post.description[lang]}</p>
        </header>

        <div className="bg-white border border-border/60 rounded-2xl p-6 sm:p-8 shadow-sm">
          {renderContent(post.content[lang])}
        </div>

        <footer className="mt-8 flex items-center justify-between">
          <Link
            href="/blog"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("blog.backToList")}
          </Link>
          <button
            onClick={handleShare}
            className="text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <Share2 className="h-4 w-4" />
            {t("blog.share")}
          </button>
        </footer>

        <div className="mt-10 bg-gradient-to-r from-primary/5 to-indigo-500/5 border border-primary/20 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-bold text-foreground mb-2">
            {t("blog.ctaTitle")}
          </h3>
          <p className="text-sm text-muted mb-4">
            {t("blog.ctaDescription")}
          </p>
          <Link
            href="/simulate"
            className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
          >
            {t("blog.ctaButton")}
          </Link>
        </div>
      </article>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Tag, Share2 } from "lucide-react";
import { studyBlogCategories } from "@/data/study-blog-posts";
import type { StudyBlogPost } from "@/types/study-blog";
import { useTranslation } from "@/lib/i18n";

export function StudyBlogPostContent({ post }: { post: StudyBlogPost }) {
  const { locale } = useTranslation();
  // zh 選択時は content.zh を優先。未生成の場合は en → ja の順でフォールバック
  const lang: "ja" | "en" | "zh" = locale === "ja" ? "ja" : locale === "zh" ? "zh" : "en";
  const L = <T extends { ja: string; en: string; zh?: string }>(obj: T): string => {
    if (lang === "zh") return obj.zh || obj.en || obj.ja;
    if (lang === "en") return obj.en || obj.ja;
    return obj.ja;
  };

  const ui = {
    backToList: lang === "ja" ? "ブログ一覧に戻る" : lang === "zh" ? "返回博客列表" : "Back to Blog",
    minRead:    lang === "ja" ? "分で読める" : lang === "zh" ? "分钟阅读" : "min read",
    share:      lang === "ja" ? "シェアする" : lang === "zh" ? "分享" : "Share",
    ctaTitle:   lang === "ja" ? "MoveWorth.studyで留学費用をシミュレーション"
              : lang === "zh" ? "使用MoveWorth.study模拟留学费用"
              : "Simulate Your Study Abroad Costs with MoveWorth.study",
    ctaDesc:    lang === "ja"
      ? "国・期間・学費を入力するだけで、留学にかかる総費用の目安を無料で計算できます。"
      : lang === "zh"
      ? "只需输入目的地、时长和学费，即可免费计算留学总费用的参考金额。"
      : "Enter your destination, duration, and tuition to get a free estimate of your total study abroad budget.",
    ctaButton:  lang === "ja" ? "費用をシミュレーションする" : lang === "zh" ? "开始模拟" : "Start Simulation",
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = L(post.title);
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

  const renderInline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
    if (parts.length === 1) return text;
    return (
      <>
        {parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={i} className="font-semibold text-foreground">
                {part.slice(2, -2)}
              </strong>
            );
          }
          const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (linkMatch) {
            const href = linkMatch[2];
            const isExternal = href.startsWith("http");
            return (
              <a
                key={i}
                href={href}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-primary underline hover:opacity-80"
              >
                {linkMatch[1]}
              </a>
            );
          }
          return part;
        })}
      </>
    );
  };

  const renderContent = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    type ListType = "ul" | "ol" | null;
    let currentListType: ListType = null;
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (listItems.length === 0) return;
      if (currentListType === "ol") {
        elements.push(
          <ol
            key={`ol-${elements.length}`}
            className="list-decimal ml-5 space-y-1 my-2 text-sm text-muted"
          >
            {listItems}
          </ol>
        );
      } else {
        elements.push(
          <ul
            key={`ul-${elements.length}`}
            className="list-disc ml-5 space-y-1 my-2 text-sm text-muted"
          >
            {listItems}
          </ul>
        );
      }
      listItems = [];
      currentListType = null;
    };

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
                      {renderInline(cell)}
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
                        {renderInline(cell)}
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
        flushList();
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

      if (line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)) {
        flushList();
        const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imgMatch) {
          elements.push(
            <img
              key={i}
              src={imgMatch[2]}
              alt={imgMatch[1]}
              className="w-full rounded-xl my-4 border border-border/40"
            />
          );
        }
      } else if (line.startsWith("### ")) {
        flushList();
        elements.push(
          <h3 key={i} className="text-lg font-bold text-foreground mt-8 mb-3">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={i} className="text-xl font-bold text-foreground mt-10 mb-4">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith("**") && line.endsWith("**")) {
        flushList();
        elements.push(
          <p key={i} className="font-semibold text-foreground mt-4 mb-1">
            {line.slice(2, -2)}
          </p>
        );
      } else if (line.match(/^  - /)) {
        if (currentListType !== "ul") { flushList(); currentListType = "ul"; }
        listItems.push(
          <li key={listItems.length} className="ml-4 list-disc">
            {renderInline(line.slice(4))}
          </li>
        );
      } else if (line.startsWith("- ")) {
        if (currentListType !== "ul") { flushList(); currentListType = "ul"; }
        const match = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)$/);
        if (match) {
          listItems.push(
            <li key={listItems.length}>
              <span className="font-semibold text-foreground">{match[1]}</span>
              {match[2] ? <>{": "}{renderInline(match[2])}</> : ""}
            </li>
          );
        } else {
          listItems.push(
            <li key={listItems.length}>{renderInline(line.slice(2))}</li>
          );
        }
      } else if (line.match(/^\d+\. /)) {
        if (currentListType !== "ol") { flushList(); currentListType = "ol"; }
        listItems.push(
          <li key={listItems.length}>
            {renderInline(line.replace(/^\d+\. /, ""))}
          </li>
        );
      } else if (line.trim() === "") {
        flushList();
        elements.push(<div key={i} className="h-2" />);
      } else {
        flushList();
        elements.push(
          <p key={i} className="text-sm text-muted leading-relaxed">
            {renderInline(line)}
          </p>
        );
      }
    }

    flushList();
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
          {ui.backToList}
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-4">
            {L(post.title)}
          </h1>
          <p className="text-muted text-sm">{L(post.description)}</p>
        </header>

        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt={L(post.title)}
            className="w-full rounded-2xl mb-6 border border-border/40 shadow-sm h-52 object-cover md:h-auto"
          />
        )}

        <div className="bg-white border border-border/60 rounded-2xl p-6 sm:p-8 shadow-sm">
          {renderContent(L(post.content))}
        </div>

        <footer className="mt-8 flex items-center justify-between">
          <Link
            href="/blog"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            {ui.backToList}
          </Link>
          <button
            onClick={handleShare}
            className="text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <Share2 className="h-4 w-4" />
            {ui.share}
          </button>
        </footer>

        <div className="mt-10 bg-gradient-to-r from-primary/5 to-indigo-500/5 border border-primary/20 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-bold text-foreground mb-2">
            {ui.ctaTitle}
          </h3>
          <p className="text-sm text-muted mb-4">
            {ui.ctaDesc}
          </p>
          <Link
            href="/simulate"
            className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            {ui.ctaButton}
          </Link>
        </div>
      </article>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ブログ - 海外移住の最新情報・資産シミュレーションガイド",
  description:
    "海外移住に関する最新情報、資産シミュレーションのコツ、国別ケーススタディ、FIREプランニングなど。データに基づいた移住の意思決定を支援する記事を配信。",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "ブログ | MoveWorth",
    description:
      "海外移住の資産シミュレーション、国別比較、FIREプランなど最新記事を公開中。",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

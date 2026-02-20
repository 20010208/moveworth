import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "料金プラン - Pro・Premium機能",
  description:
    "MoveWorthのPro・Premiumプランで、モンテカルロシミュレーション、FIRE計算機、AI PDFレポートなどの高度な機能を利用。海外移住の意思決定をさらに強力に。",
  alternates: {
    canonical: "/subscribe",
  },
  openGraph: {
    title: "料金プラン | MoveWorth",
    description: "MoveWorthのPro・Premiumプランで高度な移住シミュレーション機能を。",
  },
};

export default function SubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

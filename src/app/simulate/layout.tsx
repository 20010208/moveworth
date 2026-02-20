import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "海外移住シミュレーター - 資産推移を無料で計算",
  description:
    "現在の国と移住先を選び、収入・支出・税金を入力するだけで資産推移を比較。20カ国以上対応の無料シミュレーションツール。海外移住・海外転職の資産計画に。",
  keywords: [
    "海外移住 シミュレーション", "移住 資産計算", "海外転職 年収比較",
    "生活費 比較 ツール", "海外移住 資産シミュレーター",
  ],
  alternates: {
    canonical: "/simulate",
  },
  openGraph: {
    title: "海外移住シミュレーター | MoveWorth",
    description: "収入・税金・生活費を入力して、移住後の資産推移を無料シミュレーション。",
  },
};

export default function SimulateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ - Contact Us",
  description:
    "MoveWorthへのご質問・フィードバック・お問い合わせはこちらから。海外移住シミュレーターに関するご意見をお待ちしています。",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "お問い合わせ | MoveWorth",
    description: "MoveWorthへのご質問・フィードバックをお送りください。",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

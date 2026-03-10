import type { Metadata } from "next";
import { StudyHeader } from "@/components/layout/study-header";

export const metadata: Metadata = {
  title: {
    default: "MoveWorth.study - 海外留学情報 | ビザ・費用・大学を比較",
    template: "%s | MoveWorth.study",
  },
  description:
    "海外留学を検討中の方へ。10カ国以上の学生ビザ・学費・生活費・おすすめ大学情報を無料で比較。マレーシア・アメリカ・オーストラリア・イギリスなど人気の留学先を詳しく解説。",
  metadataBase: new URL("https://study.moveworthapp.com"),
  openGraph: {
    siteName: "MoveWorth.study",
    type: "website",
    locale: "ja_JP",
  },
};

export default function StudySiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StudyHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/50 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm">
                <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                  MoveWorth
                </span>
                <span className="text-muted font-normal">.study</span>
              </span>
            </div>
            <p className="text-xs text-muted">
              &copy; {new Date().getFullYear()} MoveWorth. All rights reserved.
            </p>
            <a
              href="https://www.moveworthapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-primary transition-colors"
            >
              MoveWorth - 海外移住シミュレーター →
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

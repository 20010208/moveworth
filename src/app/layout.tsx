import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LanguageProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { RegisterModal } from "@/components/auth/register-modal";
import { LoginModal } from "@/components/auth/login-modal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "MoveWorth - 海外移住 資産シミュレーター | 移住後の資産を無料で計算",
    template: "%s | MoveWorth",
  },
  description:
    "海外移住したら資産はどうなる？20カ国以上の国を対象に、収入・支出・税金・インフレを考慮した資産シミュレーションを無料で実行。移住先の生活費比較や資産推移予測で、データに基づいた移住の意思決定を支援します。",
  keywords: [
    "海外移住", "移住 シミュレーション", "資産 シミュレーター", "海外移住 費用",
    "生活費 比較", "海外 資産運用", "移住 資産計算", "expat finance",
    "海外転職 年収", "FIRE 海外", "移住先 生活費", "海外移住 税金",
    "cost of living comparison", "migration simulator", "international relocation",
  ],
  metadataBase: new URL("https://moveworth-alpha.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MoveWorth - 海外移住したら資産はどうなる？",
    description:
      "20カ国以上の移住先を比較。収入・税金・生活費を入力するだけで、移住後の資産推移を無料シミュレーション。",
    type: "website",
    siteName: "MoveWorth",
    locale: "ja_JP",
    url: "https://moveworth-alpha.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "MoveWorth - 海外移住 資産シミュレーター",
    description: "海外移住したら資産はどうなる？20カ国以上を無料で比較シミュレーション。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "MoveWorth",
              url: "https://moveworth-alpha.vercel.app",
              description: "海外移住したら資産はどうなる？20カ国以上の移住先の資産推移を無料シミュレーション。",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              inLanguage: ["ja", "en"],
            }),
          }}
        />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-XXXXXXXXXXXXXXXX"}`}
          crossOrigin="anonymous"
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-GZ0JC5F97D"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GZ0JC5F97D');
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col font-sans`}>
        <LanguageProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <RegisterModal />
            <LoginModal />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

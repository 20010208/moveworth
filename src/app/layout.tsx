import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LanguageProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { RegisterModal } from "@/components/auth/register-modal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MoveWorth - International Migration Financial Simulator",
  description:
    "Simulate your financial future if you move abroad. Compare assets, calculate savings, and plan your international relocation with data-driven insights.",
  keywords: [
    "migration simulator",
    "expat finance",
    "cost of living comparison",
    "international relocation",
    "FIRE calculator",
    "asset projection",
  ],
  openGraph: {
    title: "MoveWorth - What happens to your wealth if you move abroad?",
    description:
      "Compare your financial future across 20+ countries. Free simulation tool for expats, digital nomads, and anyone considering international relocation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

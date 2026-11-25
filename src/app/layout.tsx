import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { InstallPWA } from "@/components/InstallPWA";

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "西医体サイトの公開サンプル",
  description: "大会運営サイトの引継ぎ用サンプル。競技データ、記事、配布資料は架空の例です。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Navbar />
        {children}
        <Footer />
        <InstallPWA />
      </body>
    </html>
  );
}

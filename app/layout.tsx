import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "@/lib/language-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TypeGen - 智能文本风格转换工具",
  description: "拖拽即转换，风格由你选。28种专业风格滤镜，AI驱动的文本风格转换工具。",
  icons: {
    icon: '/favicon-white.ico',
    shortcut: '/favicon-white.ico',
    apple: '/apple-touch-icon-white.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <div className="background-wrapper">
            {children}
          </div>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}

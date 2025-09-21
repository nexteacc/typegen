import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "@/lib/language-context";
import ClientMetadataUpdater from "@/components/client-metadata-updater";
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
  title: "TypeGenAI - Intelligent Text Style Transformation Tool",
  description: "Drag and drop to transform, style at your fingertips. 28 professional style filters, AI-powered text style transformation tool.",
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
          <ClientMetadataUpdater />
          <div className="background-wrapper">
            {children}
          </div>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
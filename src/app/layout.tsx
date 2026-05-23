import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OmniSearch AI — محرك البحث الذكي",
  description: "ابحث في الإنترنت كله واحصل على إجابات شاملة مع تحليل ذكي ومصادر موثقة. مدعوم بالذكاء الاصطناعي.",
  keywords: ["OmniSearch", "AI Search", "بحث ذكي", "تحليل", "مصادر", "ذكاء اصطناعي"],
  authors: [{ name: "OmniSearch AI" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "OmniSearch AI — محرك البحث الذكي",
    description: "ابحث في الإنترنت كله واحصل على إجابات شاملة مع تحليل ذكي ومصادر موثقة.",
    url: "https://chat.z.ai",
    siteName: "OmniSearch AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniSearch AI — محرك البحث الذكي",
    description: "ابحث في الإنترنت كله واحصل على إجابات شاملة",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

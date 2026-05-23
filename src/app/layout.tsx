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
  title: "DeepSearch AI — محرك البحث الذكي",
  description: "ابحث في الإنترنت كله واحصل على إجابات شاملة مع تحليل عميق ومصادر موثقة. مدعوم بالذكاء الاصطناعي.",
  keywords: ["DeepSearch", "AI Search", "بحث ذكي", "تحليل عميق", "مصادر", "ذكاء اصطناعي", "Cross-Verification"],
  authors: [{ name: "DeepSearch AI" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "DeepSearch AI — محرك البحث الذكي",
    description: "ابحث في الإنترنت كله واحصل على إجابات شاملة مع تحليل عميق ومصادر موثقة.",
    url: "https://chat.z.ai",
    siteName: "DeepSearch AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DeepSearch AI — محرك البحث الذكي",
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

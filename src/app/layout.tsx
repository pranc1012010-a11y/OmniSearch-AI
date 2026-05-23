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
  title: "GrokSearch — محرك بحث Grok الذكي",
  description: "ابحث في الإنترنت كله مع Grok — تحليل عميق، شخصية خشنة، ومصادر موثقة. Powered by xAI.",
  keywords: ["Grok", "xAI", "AI Search", "بحث ذكي", "Grok Search", "ذكاء اصطناعي", "Cross-Verification"],
  authors: [{ name: "GrokSearch by xAI" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "GrokSearch — محرك بحث Grok الذكي",
    description: "ابحث في الإنترنت كله مع Grok — تحليل عميق، شخصية خشنة، ومصادر موثقة.",
    url: "https://chat.z.ai",
    siteName: "GrokSearch by xAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrokSearch — محرك بحث Grok الذكي",
    description: "ابحث في الإنترنت كله مع Grok — تحليل عميق ومصادر موثقة",
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

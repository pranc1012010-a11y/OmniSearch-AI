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
  title: "Aikimi — محرك البحث الذكي المجاني",
  description: "ابحث في الإنترنت كله مع Aikimi — تحليل عميق، مصادر موثقة، مجاني للأبد بدون حدود.",
  keywords: ["Aikimi", "AI Search", "بحث ذكي مجاني", "Aikimi AI", "ذكاء اصطناعي", "Cross-Verification", "free AI"],
  authors: [{ name: "Aikimi" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Aikimi — محرك البحث الذكي المجاني",
    description: "ابحث في الإنترنت كله مع Aikimi — تحليل عميق ومصادر موثقة، مجاني للأبد.",
    url: "https://chat.z.ai",
    siteName: "Aikimi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aikimi — محرك البحث الذكي المجاني",
    description: "ابحث في الإنترنت كله مع Aikimi — مجاني للأبد بدون حدود",
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

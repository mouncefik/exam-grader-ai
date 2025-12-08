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
  title: "MarkScanner - AI-Powered Exam Grading",
  description: "Automated exam grading and analysis system with AI-powered correction and detailed reporting.",
  keywords: ["MarkScanner", "AI", "Exam Grading", "Education", "OCR", "Automated Correction"],
  authors: [{ name: "MarkScanner Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "MarkScanner - AI-Powered Exam Grading",
    description: "Automated exam grading and analysis system with AI-powered correction",
    url: "https://chat.z.ai",
    siteName: "MarkScanner",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MarkScanner - AI-Powered Exam Grading",
    description: "Automated exam grading and analysis system with AI-powered correction",
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

import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "AI QA Engineer - Generate Tests with Gemini",
  description: "Generate intelligent unit tests, integration tests, and edge-case scenarios using Gemini API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full dark`}>
      <body className="font-sans antialiased text-zinc-200 bg-zinc-950 min-h-full flex flex-col selection:bg-violet-500/30 selection:text-violet-200">
        {children}
      </body>
    </html>
  );
}

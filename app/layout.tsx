import type { Metadata } from "next";
import { Inter_Tight, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bodyFont = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Resume Roaster | Brutally Honest CV Feedback",
  description:
    "Upload your resume and get a sharp, readable roast report that feels more like a polished product than a demo page.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} bg-[var(--bg-base)] text-[var(--ink)] antialiased selection:bg-[var(--accent-lime)] selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}

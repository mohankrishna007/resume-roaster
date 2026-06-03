import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
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
        className={`${bodyFont.variable} ${displayFont.variable} bg-[var(--bg-base)] text-[var(--text-primary)] antialiased selection:bg-[var(--accent)] selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}

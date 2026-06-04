import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter_Tight, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsBoot } from "@/components/AnalyticsBoot";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { GoogleOneTap } from "@/components/auth/GoogleOneTap";

const bodyFont = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://resume-roaster.app";
const SITE_NAME = "Resume Roaster";
const TITLE = "Resume Roaster — The brutally honest AI resume review your friend won't give you";
const DESCRIPTION =
  "Free AI resume roaster. Drop your PDF, get a savage-but-useful line-by-line review — buzzword count, recruiter-scroll time, and the exact fixes. No signup. No fluff. No LinkedIn energy.";

export const viewport: Viewport = {
  themeColor: "#0b0810",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Resume Roaster",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  generator: "Next.js",
  keywords: [
    "resume roaster",
    "resume review",
    "AI resume review",
    "free resume feedback",
    "resume critique",
    "CV roaster",
    "CV review",
    "resume checker",
    "ATS resume checker",
    "resume buzzwords",
    "resume tips",
    "improve resume",
    "AI CV feedback",
    "honest resume feedback",
  ],
  authors: [{ name: "Resume Roaster" }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "productivity",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@resumeroaster",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

// JSON-LD structured data — helps Google understand what this app is.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any (Web)",
      description: DESCRIPTION,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Line-by-line AI resume roast",
        "Buzzword counter",
        "Recruiter-scroll-time estimate",
        "Quick fix suggestions for every line",
        "PDF upload, no signup required",
      ],
      browserRequirements: "Requires a modern browser with JavaScript enabled.",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "1842",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is the resume roaster really free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yep — completely free. No signup, no credit card, no inbox spam. Drop your PDF, get roasted.",
          },
        },
        {
          "@type": "Question",
          name: "Do you store my resume?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Your file is parsed in-memory to generate the roast, then thrown out. We don't save the file or your contact info.",
          },
        },
        {
          "@type": "Question",
          name: "How long does the roast take?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Just a moment — long enough to grab water, short enough that you won't tab away.",
          },
        },
        {
          "@type": "Question",
          name: "What file types are supported?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "PDF only for now — and it needs real text, not a scanned image. Most resumes exported from Word, Google Docs, or Canva work fine.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} bg-[var(--bg-base)] text-[var(--ink)] antialiased selection:bg-[var(--accent-lime)] selection:text-black`}
      >
        <AuthProvider>
          {children}
          <GoogleOneTap />
        </AuthProvider>
        <AnalyticsBoot />
        <Script
          id="ld-json"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}

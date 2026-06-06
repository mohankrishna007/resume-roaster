import type { Metadata, Viewport } from "next";
import { Inter_Tight, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsBoot } from "@/components/AnalyticsBoot";
import { AuthProvider } from "@/components/auth/AuthProvider";

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
    "AI resume review",
    "resume critique",
    "resume feedback",
    "free resume review",
    "CV roaster",
    "CV review",
    "resume checker",
    "ATS resume checker",
    "resume buzzwords",
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
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

// JSON-LD structured data — helps Google understand what this app is.
// Note: an `aggregateRating` block was deliberately removed. Google's
// Structured Data policy prohibits fabricated/unverifiable review counts
// and can issue a manual action that removes the site from search
// results. Re-add only when ratings come from a real on-site review
// system the user can interact with.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}#app`,
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
      browserRequirements:
        "Requires a modern browser with JavaScript enabled.",
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#org`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DESCRIPTION,
      publisher: { "@id": `${SITE_URL}#org` },
      inLanguage: "en-US",
    },
    {
      "@type": "HowTo",
      name: "How to roast your resume",
      description:
        "Get an honest, line-by-line AI critique of your resume in under a minute.",
      totalTime: "PT1M",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Upload your resume PDF",
          text: "Drop a PDF resume onto the upload zone. Text-based PDFs from Word, Google Docs, or Canva work best.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Wait for the AI roast",
          text: "The AI scans every line, counts buzzwords, estimates recruiter-scroll time, and writes the roast.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Read the verdict and fixes",
          text: "Review the line-by-line burns plus concrete suggestions you can paste straight into your next draft.",
        },
      ],
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
        </AuthProvider>
        <AnalyticsBoot />
        {/*
          Render JSON-LD inline in the initial HTML so search crawlers
          always see it. Using next/script with afterInteractive can
          inject the tag too late for some crawlers.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}

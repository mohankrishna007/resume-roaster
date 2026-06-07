import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoast } from "@/lib/roast/store";
import { AnimatedBackground, RoastResultView } from "@/components";

export const runtime = "nodejs";
// Stored roasts are immutable, so let Next cache the rendered page per id.
// Each unique share id is its own dynamic param key; revalidate keeps the
// cache fresh enough to pick up the rare data fix.
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const stored = await getRoast(id);
  if (!stored) {
    return {
      title: "Roast not found",
      description: "This roast doesn't exist or has expired.",
      robots: { index: false, follow: false },
    };
  }

  const name = stored.result.candidate.name || "Anonymous";
  const quote = stored.result.verdict.share_quote;
  const title = `${name}'s resume got roasted`;
  const description = quote.slice(0, 180);
  const url = `/r/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    // Shared roasts are great for social sharing but make poor search
    // results — thousands of near-duplicate pages per user. Keep them out
    // of the index while preserving OG/Twitter previews.
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      type: "article",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SharedRoastPage({ params }: PageProps) {
  const { id } = await params;
  const stored = await getRoast(id);
  if (!stored) notFound();

  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://roastume.app";
  const pageUrl = `${SITE_URL}/r/${id}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${stored.result.candidate.name || "Anonymous"}'s resume got roasted`,
    description: stored.result.verdict.share_quote.slice(0, 200),
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    datePublished: new Date(stored.meta.created_at_ms).toISOString(),
    image: `${pageUrl}/opengraph-image`,
    author: { "@type": "Organization", name: "Resume Roaster" },
    publisher: {
      "@type": "Organization",
      name: "Resume Roaster",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
    },
  };

  return (
    <div className="relative min-h-screen text-[var(--ink)]">
      <AnimatedBackground />
      <RoastResultView roastResult={stored.result} shareId={stored.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </div>
  );
}

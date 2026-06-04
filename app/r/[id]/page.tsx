import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoast } from "@/lib/roast-store";
import { AnimatedBackground, RoastResultView } from "@/components";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
      title: "Roast not found · Resume Roaster",
      description: "This roast doesn't exist or has expired.",
    };
  }

  const name = stored.result.candidate.name || "Anonymous";
  const quote = stored.result.verdict.share_quote;
  const title = `${name}'s resume got roasted · Resume Roaster`;
  const description = quote.slice(0, 180);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `/r/${id}`,
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

  return (
    <div className="relative min-h-screen text-[var(--ink)]">
      <AnimatedBackground />
      <RoastResultView roastResult={stored.result} shareId={stored.id} />
    </div>
  );
}

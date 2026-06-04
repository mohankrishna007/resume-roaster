import type { RoastResult } from "@/types/roast";

export interface ShareContent {
  title: string;
  /** The body text (no URL — pass `url` separately to native share). */
  text: string;
  url: string;
  /** Single string with URL appended — for clipboard / fallback. */
  full: string;
}

/**
 * Build the copy used by the Share buttons. Kept in one place so the topbar
 * and verdict share stay consistent, and so tweaks land everywhere at once.
 *
 * Format aims for: a hook + the headline score + the screenshot-worthy quote
 * + a one-line pitch + the link. Short enough for SMS, fits in a tweet.
 */
export function buildShareContent(
  result: RoastResult,
  shareUrl: string,
): ShareContent {
  const firstName = (result.candidate.name?.split(" ")[0] || "this resume").trim();
  const score = result.scores.overall;
  const quote = result.verdict.share_quote.trim().replace(/^["“”]|["“”]$/g, "");

  const title = `${firstName}'s resume just got roasted 🔥`;

  // Two short lines + the quote + a pitch. Keep it tight — long share text
  // gets truncated by most apps.
  const text =
    `${firstName}'s resume scored ${score}/10 on Resume Roaster 🔥\n\n` +
    `"${quote}"\n\n` +
    `Brutally honest AI resume review — drop your PDF, get the truth in 30 seconds.`;

  return {
    title,
    text,
    url: shareUrl,
    full: `${text}\n${shareUrl}`,
  };
}

/** Just the quote, for the "copy quote" affordance. */
export function buildQuoteOnly(result: RoastResult): string {
  const quote = result.verdict.share_quote.trim().replace(/^["“”]|["“”]$/g, "");
  return `"${quote}"\n— Resume Roaster`;
}

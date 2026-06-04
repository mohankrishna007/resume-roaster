/**
 * Shared constants used across the application.
 * Extracted to reduce module parsing overhead and enable code sharing.
 */

export const TICKER_LINES = [
  "i didn’t know a webpage could call me out like that",
  "it found the metric i made up at 1am",
  "“synergy” got removed from my vocabulary forever",
  "first tool that didn’t try to sell me a course",
  "my friend opened it and went quiet for 4 minutes",
  "“led cross-functional initiatives” → straight to jail",
  "i was warned. i still wasn’t ready.",
  "fixed two bullets, got a callback the same week",
  "less LinkedIn coach, more older sibling energy",
  "i was today years old when i learned my resume was mid",
] as const;

export const TESTIMONIALS = [
  {
    seed: "Priya",
    name: "Priya, SDE-2",
    handle: "Bengaluru",
    quote:
      "made me delete three bullets before i could close the tab. genuinely the most useful 5 minutes i’ve spent on my resume in months.",
  },
  {
    seed: "Eswar",
    name: "Eswar, Principle Engineer",
    handle: "Hyderabad",
    quote:
      "expected a meme, got an actual diagnosis. the line it flagged was the exact one my manager kept squinting at in 1:1s.",
  },
  {
    seed: "Nandhini",
    name: "Nandhini, Frontend",
    handle: "Bengaluru",
    quote:
      "i laughed, then i screenshotted, then i actually fixed the lines.",
  },
] as const;

export const TRUST_COMPANIES = [
  "Microsoft",
  "TCS",
  "Flipkart",
  "Google",
  "Infosys",
  "Amazon",
  "Accenture",
] as const;

export const CONTAINER_TRANSITION = { duration: 0.4 } as const;

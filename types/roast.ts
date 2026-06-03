export type Severity = "mild" | "medium" | "savage" | "actually_good";

export interface RoastResult {
  /** Persona / diagnosis — sets the tone of the whole report. */
  archetype: {
    title: string;     // e.g. "Corporate Survival Resume"
    tagline: string;   // one-line theme
    opener: string;    // the hook line — designed for the hero quote
  };

  /** Parsed from the PDF — mostly extraction, low token cost. */
  candidate: {
    name: string;
    experience_level: string;       // "Mid-level engineer"
    experience_years: string;       // "3.5+"
    location: string[];
    education?: { degree: string; college: string };
    domain_focus: string[];
  };

  /** Headline numbers. The two extras are cheap (single ints) and screenshot-worthy. */
  scores: {
    overall: number;                // 0-10, LLM-judged (not averaged)
    resume_quality: number;         // 0-10
    experience_strength: number;    // 0-10
    buzzword_count: number;         // concrete count, viral stat
    recruiter_scroll_seconds: number; // "would scroll past in N seconds"
  };

  /** The roast feed — the bulk of the experience. Free tier: cap at 4. */
  roasts: Roast[];

  /** Wins. Flat strings instead of {point, category} to save tokens. */
  wins: string[];

  /** The unlock moment — one sharp insight, no bullet list. */
  biggest_truth: {
    headline: string;       // the insight, designed to be highlighted
    explanation: string;    // 1-2 sentences
    one_liner: string;      // the quotable line
  };

  /** The closing — built around the shareable quote. */
  verdict: {
    headline: string;       // a verdict in plain language
    share_quote: string;    // THE screenshot line
  };
}

export interface Roast {
  resume_line: string;     // the exact line from the resume
  reaction: string;        // "BRO 😭" / "WAIT 😭" — short emote
  roast: string;           // the joke / critique
  severity: Severity;      // drives visual treatment
  fix: string;             // short rewrite hint — the return-value
}

export interface UploadedResume {
  file: File;
  text: string;
  filename: string;
}

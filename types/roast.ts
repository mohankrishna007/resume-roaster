export type Severity = "mild" | "medium" | "savage";

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

  scores: {
    overall: number;                // 0-10, LLM-judged (not averaged)
    resume_quality: number;         // 0-10
    experience_strength: number;    // 0-10
    buzzword_count: number;         // concrete count, viral stat
    attention_score: number;        // attention retention score 0-10
  };
  section_scores: SectionScores;

  /** The roast feed — the bulk of the experience. Free tier: cap at 4. */
  roasts: Roast[];

  /** Wins. Structured so the UI can show line + reaction + callout instead of a flat string. */
  wins: Win[];

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

export type Confidence = "high" | "medium" | "low";

export interface SectionScores {
  summary: number;     // 0-10
  experience: number;  // 0-10
  skills: number;      // 0-10
  projects: number;    // 0-10
}

export type IssueType =
  | "missing_metric"
  | "vague_verb"
  | "skill_not_used"
  | "weak_summary"
  | "grammar"
  | "keyword_gap"
  | "project_quality"
  | "responsibility_not_achievement"
  | "domain_confusion"
  | "missing_dates"
  | "weak_project"
  | "overstuffed_skills";

export interface Roast {
  resume_line: string;     // the exact line from the resume
  reaction: string;        // "BRO 😭" / "WAIT 😭" — short emote
  roast: string;           // the joke / critique
  severity: Severity;      // drives visual treatment
  fix: string;             // short rewrite hint — the return-value
  issue_type: IssueType;   // stable category for analytics
  confidence: Confidence;  // model confidence
  rewrite_candidate: boolean; // whether this is a good candidate for premium bullet rewrites
  missing_fields: string[]; // fields that are missing (e.g. ["impact", "metric"])
}

export interface Win {
  resume_line: string;     // the exact line from the resume that actually works
  reaction: string;        // short “okay this is real work” style reaction
  callout: string;         // specific reason it lands — not generic praise
}

export interface UploadedResume {
  file: File;
  text: string;
  filename: string;
}

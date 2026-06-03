import type { RoastResult, Severity } from "@/types/roast";

const SEVERITIES: Severity[] = ["mild", "medium", "savage", "actually_good"];

const SEVERITY_ALIASES: Record<string, Severity> = {
  mild: "mild",
  light: "mild",
  gentle: "mild",
  soft: "mild",
  medium: "medium",
  moderate: "medium",
  spicy: "medium",
  warm: "medium",
  savage: "savage",
  harsh: "savage",
  brutal: "savage",
  hot: "savage",
  scorching: "savage",
  ruthless: "savage",
  actually_good: "actually_good",
  good: "actually_good",
  positive: "actually_good",
  praise: "actually_good",
  compliment: "actually_good",
};

function coerceSeverity(v: unknown): Severity {
  if (typeof v !== "string") return "medium";
  const key = v.toLowerCase().trim().replace(/[\s-]+/g, "_");
  if (SEVERITIES.includes(key as Severity)) return key as Severity;
  return SEVERITY_ALIASES[key] ?? "medium";
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function fail(path: string): never {
  throw new Error(`Roast response missing or invalid field: ${path}`);
}

function str(v: unknown, path: string): string {
  if (typeof v !== "string" || v.trim() === "") fail(path);
  return v;
}

function num(v: unknown, path: string): number {
  if (typeof v !== "number" || Number.isNaN(v)) fail(path);
  return v;
}

function strArray(v: unknown, path: string): string[] {
  if (!Array.isArray(v)) fail(path);
  return v.map((item, i) => str(item, `${path}[${i}]`));
}

export function validateRoastResult(input: unknown): RoastResult {
  if (!isObject(input)) fail("(root)");

  const archetype = isObject(input.archetype) ? input.archetype : fail("archetype");
  const candidate = isObject(input.candidate) ? input.candidate : fail("candidate");
  const scores = isObject(input.scores) ? input.scores : fail("scores");
  const biggest_truth = isObject(input.biggest_truth) ? input.biggest_truth : fail("biggest_truth");
  const verdict = isObject(input.verdict) ? input.verdict : fail("verdict");

  if (!Array.isArray(input.roasts) || input.roasts.length === 0) fail("roasts");

  const roasts = input.roasts.map((r, i) => {
    if (!isObject(r)) fail(`roasts[${i}]`);
    return {
      resume_line: str(r.resume_line, `roasts[${i}].resume_line`),
      reaction: str(r.reaction, `roasts[${i}].reaction`),
      roast: str(r.roast, `roasts[${i}].roast`),
      severity: coerceSeverity(r.severity),
      fix: str(r.fix, `roasts[${i}].fix`),
    };
  });

  const education = isObject(candidate.education)
    ? {
        degree: str(candidate.education.degree, "candidate.education.degree"),
        college: str(candidate.education.college, "candidate.education.college"),
      }
    : undefined;

  return {
    archetype: {
      title: str(archetype.title, "archetype.title"),
      tagline: str(archetype.tagline, "archetype.tagline"),
      opener: str(archetype.opener, "archetype.opener"),
    },
    candidate: {
      name: str(candidate.name, "candidate.name"),
      experience_level: str(candidate.experience_level, "candidate.experience_level"),
      experience_years: str(candidate.experience_years, "candidate.experience_years"),
      location: strArray(candidate.location, "candidate.location"),
      education,
      domain_focus: strArray(candidate.domain_focus, "candidate.domain_focus"),
    },
    scores: {
      overall: num(scores.overall, "scores.overall"),
      resume_quality: num(scores.resume_quality, "scores.resume_quality"),
      experience_strength: num(scores.experience_strength, "scores.experience_strength"),
      buzzword_count: num(scores.buzzword_count, "scores.buzzword_count"),
      recruiter_scroll_seconds: num(scores.recruiter_scroll_seconds, "scores.recruiter_scroll_seconds"),
    },
    roasts,
    wins: Array.isArray(input.wins) ? strArray(input.wins, "wins") : [],
    biggest_truth: {
      headline: str(biggest_truth.headline, "biggest_truth.headline"),
      explanation: str(biggest_truth.explanation, "biggest_truth.explanation"),
      one_liner: str(biggest_truth.one_liner, "biggest_truth.one_liner"),
    },
    verdict: {
      headline: str(verdict.headline, "verdict.headline"),
      share_quote: str(verdict.share_quote, "verdict.share_quote"),
    },
  };
}

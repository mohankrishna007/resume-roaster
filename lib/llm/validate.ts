import type { RoastResult, Severity, Win, IssueType, Confidence, Roast } from "@/types/roast";

const SEVERITIES: Severity[] = ["mild", "medium", "savage"];

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
  actually_good: "mild",
  good: "mild",
  positive: "mild",
  praise: "mild",
  compliment: "mild",
};

const ISSUE_TYPES: IssueType[] = [
  "missing_metric",
  "vague_verb",
  "skill_not_used",
  "weak_summary",
  "grammar",
  "keyword_gap",
  "project_quality",
  "responsibility_not_achievement",
  "domain_confusion",
  "missing_dates",
  "weak_project",
  "overstuffed_skills",
];

const CONFIDENCES: Confidence[] = ["high", "medium", "low"];

function coerceSeverity(v: unknown): Severity {
  if (typeof v !== "string") return "medium";
  const key = v.toLowerCase().trim().replace(/[\s-]+/g, "_");
  if (SEVERITIES.includes(key as Severity)) return key as Severity;
  return SEVERITY_ALIASES[key] ?? "medium";
}

function coerceIssueType(v: unknown): IssueType {
  if (typeof v !== "string") return "project_quality";
  const normalized = v.toLowerCase().trim().replace(/[\s-]+/g, "_");
  if (ISSUE_TYPES.includes(normalized as IssueType)) return normalized as IssueType;
  return "project_quality";
}

function coerceConfidence(v: unknown): Confidence {
  if (typeof v !== "string") return "medium";
  const normalized = v.toLowerCase().trim();
  if (CONFIDENCES.includes(normalized as Confidence)) return normalized as Confidence;
  return "medium";
}

function parseMissingFields(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  v.forEach((item) => {
    if (typeof item === "string" && item.trim()) {
      out.push(item.trim());
    }
  });
  return out;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function fail(path: string): never {
  throw new Error(`Roast response missing or invalid field: ${path}`);
}

function coerceString(v: unknown, fallback: string): string {
  if (typeof v === "string" && v.trim() !== "") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return fallback;
}

function coerceNum(v: unknown, fallback = 0): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") {
    const parsed = Number.parseFloat(v);
    if (!Number.isNaN(parsed)) return Math.round(parsed);
  }
  return fallback;
}

function parseStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  v.forEach((item) => {
    if (typeof item === "string" && item.trim()) {
      out.push(item.trim());
    } else if (typeof item === "number" || typeof item === "boolean") {
      out.push(String(item));
    }
  });
  return out;
}

function parseWins(v: unknown): Win[] {
  if (!Array.isArray(v)) return [];
  const out: Win[] = [];
  v.forEach((item) => {
    if (typeof item === "string" && item.trim()) {
      out.push({ resume_line: "", reaction: "", callout: item.trim() });
      return;
    }
    if (!isObject(item)) return;
    const resume_line = typeof item.resume_line === "string" ? item.resume_line.trim() : "";
    const reaction = typeof item.reaction === "string" ? item.reaction.trim() : "";
    const callout =
      typeof item.callout === "string"
        ? item.callout.trim()
        : typeof item.note === "string"
          ? item.note.trim()
          : "";
    if (!resume_line && !reaction && !callout) return;
    out.push({ resume_line, reaction, callout });
  });
  return out;
}

export function validateRoastResult(input: unknown): RoastResult {
  if (!isObject(input)) fail("(root)");

  const archetype = isObject(input.archetype) ? input.archetype : {};
  const candidate = isObject(input.candidate) ? input.candidate : {};
  const scores = isObject(input.scores) ? input.scores : {};
  const section_scores = isObject(input.section_scores) ? input.section_scores : {};
  const biggest_truth = isObject(input.biggest_truth) ? input.biggest_truth : {};
  const verdict = isObject(input.verdict) ? input.verdict : {};

  const roasts: Roast[] = [];
  if (Array.isArray(input.roasts)) {
    input.roasts.forEach((r) => {
      if (!isObject(r)) return;
      const resume_line = coerceString(r.resume_line, "").trim();
      const roast = coerceString(r.roast, "").trim();
      
      // Filter out invalid items where mandatory textual fields are empty
      if (!resume_line || !roast) return;

      roasts.push({
        resume_line,
        reaction: coerceString(r.reaction, "bro"),
        roast,
        severity: coerceSeverity(r.severity),
        fix: coerceString(r.fix, "Rewrite this section to focus on metrics and impact."),
        issue_type: coerceIssueType(r.issue_type),
        confidence: coerceConfidence(r.confidence),
        rewrite_candidate: typeof r.rewrite_candidate === "boolean" ? r.rewrite_candidate : false,
        missing_fields: parseMissingFields(r.missing_fields),
      });
    });
  }

  let education: { degree: string; college: string } | undefined;
  if (isObject(candidate.education)) {
    const degree = typeof candidate.education.degree === "string" ? candidate.education.degree.trim() : "";
    const college = typeof candidate.education.college === "string" ? candidate.education.college.trim() : "";
    education = degree || college ? { degree, college } : undefined;
  }

  return {
    archetype: {
      title: coerceString(archetype.title, "Resume Review"),
      tagline: coerceString(archetype.tagline, "Needs a friend's advice"),
      opener: coerceString(archetype.opener, "Let me take a look at this..."),
    },
    candidate: {
      name: coerceString(candidate.name, "Anonymous"),
      experience_level: coerceString(candidate.experience_level, "junior"),
      experience_years: coerceString(candidate.experience_years, "0"),
      location: parseStringArray(candidate.location),
      education,
      domain_focus: parseStringArray(candidate.domain_focus),
    },
    scores: {
      overall: coerceNum(scores.overall, 5),
      resume_quality: coerceNum(scores.resume_quality, 5),
      experience_strength: coerceNum(scores.experience_strength, 5),
      buzzword_count: coerceNum(scores.buzzword_count, 0),
      attention_score: coerceNum(scores.attention_score, 5),
    },
    section_scores: {
      summary: coerceNum(section_scores.summary, 5),
      experience: coerceNum(section_scores.experience, 5),
      skills: coerceNum(section_scores.skills, 5),
      projects: coerceNum(section_scores.projects, 5),
    },
    roasts,
    wins: parseWins(input.wins),
    biggest_truth: {
      headline: coerceString(biggest_truth.headline, "First Impression"),
      explanation: coerceString(biggest_truth.explanation, "Your resume has some structural opportunities."),
      one_liner: coerceString(biggest_truth.one_liner, "Let's fix this up."),
    },
    verdict: {
      headline: coerceString(verdict.headline, "In Progress"),
      share_quote: coerceString(verdict.share_quote, "My friend looked at my resume and it was an experience."),
    },
  };
}

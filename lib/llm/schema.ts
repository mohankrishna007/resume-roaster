/**
 * JSON Schema for OpenAI Structured Outputs (response_format: json_schema).
 * Mirrors types/roast.ts. Every field is required and additionalProperties=false,
 * which is what OpenAI requires for strict mode.
 */
export const ROAST_JSON_SCHEMA = {
  name: "roast_result",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "archetype",
      "candidate",
      "scores",
      "roasts",
      "wins",
      "biggest_truth",
      "verdict",
    ],
    properties: {
      archetype: {
        type: "object",
        additionalProperties: false,
        required: ["title", "tagline", "opener"],
        properties: {
          title: { type: "string" },
          tagline: { type: "string" },
          opener: { type: "string" },
        },
      },
      candidate: {
        type: "object",
        additionalProperties: false,
        required: [
          "name",
          "experience_level",
          "experience_years",
          "location",
          "education",
          "domain_focus",
        ],
        properties: {
          name: { type: "string" },
          experience_level: { type: "string" },
          experience_years: { type: "string" },
          location: { type: "array", items: { type: "string" } },
          // education is required by strict mode; use empty strings if absent.
          education: {
            type: "object",
            additionalProperties: false,
            required: ["degree", "college"],
            properties: {
              degree: { type: "string" },
              college: { type: "string" },
            },
          },
          domain_focus: { type: "array", items: { type: "string" } },
        },
      },
      scores: {
        type: "object",
        additionalProperties: false,
        required: [
          "overall",
          "resume_quality",
          "experience_strength",
          "buzzword_count",
          "recruiter_scroll_seconds",
        ],
        properties: {
          overall: { type: "integer", minimum: 0, maximum: 10 },
          resume_quality: { type: "integer", minimum: 0, maximum: 10 },
          experience_strength: { type: "integer", minimum: 0, maximum: 10 },
          buzzword_count: { type: "integer", minimum: 0 },
          recruiter_scroll_seconds: { type: "integer", minimum: 1, maximum: 60 },
        },
      },
      roasts: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["resume_line", "reaction", "roast", "severity", "fix"],
          properties: {
            resume_line: { type: "string" },
            reaction: { type: "string" },
            roast: { type: "string" },
            severity: {
              type: "string",
              enum: ["mild", "medium", "savage", "actually_good"],
            },
            fix: { type: "string" },
          },
        },
      },
      wins: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["resume_line", "reaction", "callout"],
          properties: {
            resume_line: { type: "string" },
            reaction: { type: "string" },
            callout: { type: "string" },
          },
        },
      },
      biggest_truth: {
        type: "object",
        additionalProperties: false,
        required: ["headline", "explanation", "one_liner"],
        properties: {
          headline: { type: "string" },
          explanation: { type: "string" },
          one_liner: { type: "string" },
        },
      },
      verdict: {
        type: "object",
        additionalProperties: false,
        required: ["headline", "share_quote"],
        properties: {
          headline: { type: "string" },
          share_quote: { type: "string" },
        },
      },
    },
  },
} as const;

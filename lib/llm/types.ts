import type { RoastResult } from "@/types/roast";

export interface LLMProvider {
  /** Stable identifier — useful for logging and selecting providers. */
  readonly name: string;
  /** Generate a roast from the extracted resume text. */
  generateRoast(resumeText: string): Promise<RoastResult>;
}

export interface LLMConfig {
  apiKey?: string;
  model?: string;
  baseURL?: string;
}

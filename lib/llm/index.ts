import type { LLMProvider } from "./types";
import { OpenAIProvider } from "./openai";
import { GrokProvider } from "./grok";

export type ProviderName = "openai" | "grok";

/**
 * Resolve the configured LLM provider from env.
 * Add new providers here (e.g. anthropic) — call sites stay unchanged.
 */
export function getProvider(): LLMProvider | null {
  const providerName = (process.env.LLM_PROVIDER ?? "openai") as ProviderName;

  switch (providerName) {
    case "openai": {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) return null;
      return new OpenAIProvider({
        apiKey,
        model: process.env.OPENAI_MODEL,
      });
    }
    case "grok": {
      const apiKey = process.env.GROK_API_KEY ?? process.env.XAI_API_KEY;
      if (!apiKey) return null;
      return new GrokProvider({
        apiKey,
        model: process.env.GROK_MODEL,
        baseURL: process.env.GROK_BASE_URL,
      });
    }
    default:
      return null;
  }
}

export type { LLMProvider } from "./types";

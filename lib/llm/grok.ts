import type { LLMConfig } from "./types";
import { OpenAIProvider } from "./openai";

/**
 * xAI's Grok exposes an OpenAI-compatible chat completions API,
 * so we reuse the OpenAI SDK with a different baseURL.
 * Docs: https://docs.x.ai/api
 */
export class GrokProvider extends OpenAIProvider {
  readonly name = "grok";
  protected useStructuredOutput = false;

  constructor(config: LLMConfig) {
    super({
      apiKey: config.apiKey,
      model: config.model ?? "grok-4.3",
      baseURL: config.baseURL ?? "https://api.x.ai/v1",
    });
  }
}

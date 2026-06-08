import OpenAI from "openai";
import * as Sentry from "@sentry/nextjs";
import type { RoastResult } from "@/types/roast";
import type { LLMConfig, LLMProvider } from "./types";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";
import { validateRoastResult } from "./validate";
import { ROAST_JSON_SCHEMA } from "./schema";

export class OpenAIProvider implements LLMProvider {
  readonly name: string = "openai";
  protected client: OpenAI;
  protected model: string;
  /** Override in subclasses (e.g. Grok) where strict json_schema isn't supported. */
  protected useStructuredOutput: boolean = true;

  constructor(config: LLMConfig) {
    if (!config.apiKey) {
      throw new Error(`${this.constructor.name}: apiKey is required`);
    }
    const rawClient = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    });
    this.client = Sentry.instrumentOpenAiClient(rawClient, {
      recordInputs: true,
      recordOutputs: true,
    });
    this.model = config.model ?? "gpt-5.4-mini";
  }

  async generateRoast(resumeText: string): Promise<RoastResult> {
    const responseFormat = this.useStructuredOutput
      ? ({ type: "json_schema", json_schema: ROAST_JSON_SCHEMA } as const)
      : ({ type: "json_object" } as const);

    const completion = await this.client.chat.completions.create({
      model: this.model,
      temperature: 1.05,
      top_p: 0.95,
      presence_penalty: 0.4,
      frequency_penalty: 0.3,
      max_completion_tokens: 10000,
      reasoning_effort: "none",
      response_format: responseFormat,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(resumeText) },
      ],
    });

    const choice = completion.choices[0];
    const raw = choice?.message?.content;
    const finishReason = choice?.finish_reason;

    if (!raw) {
      throw new Error(`${this.name} returned an empty response (finish=${finishReason})`);
    }

    if (finishReason === "length") {
      throw new Error(`${this.name} output was truncated — increase max_completion_tokens or shrink schema`);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error(`${this.name} returned non-JSON content`);
    }
    return validateRoastResult(parsed);
  }
}

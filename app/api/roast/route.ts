import { NextResponse } from "next/server";
import { extractPdfText } from "@/lib/pdf-parser";
import { getProvider } from "@/lib/llm";
import { saveRoast } from "@/lib/roast-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_RESUME_CHARS = 18_000;    // hard cap on tokens we send to the LLM

interface ProviderError {
  status?: number;
  code?: string;
}

function classifyProviderError(err: unknown): { status: number; message: string } {
  const e = err as ProviderError;
  const status = typeof e?.status === "number" ? e.status : 0;

  if (status === 401 || status === 403) {
    return { status: 503, message: "Roast service is misconfigured. Try again later." };
  }
  if (status === 429) {
    return { status: 429, message: "Too many roasts right now. Give it a minute and try again." };
  }
  if (status === 408 || status >= 500) {
    return { status: 502, message: "Our roast engine is having a moment. Try again." };
  }
  if (status === 400 || status === 422) {
    return { status: 422, message: "Couldn't make sense of this resume. Try a cleaner PDF?" };
  }
  return { status: 500, message: "Something went wrong on our end. Try again." };
}

export async function POST(request: Request) {
  let stage: "parse" | "llm" = "parse";
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file attached. Pick a PDF and try again." }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files work for now." }, { status: 415 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "That file is too big. Max 5 MB." }, { status: 413 });
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const rawText = await extractPdfText(buffer);

    if (!rawText || rawText.length < 80) {
      return NextResponse.json(
        { error: "We couldn't read any text from this PDF. If it's a scanned image, try exporting a text-based PDF." },
        { status: 422 },
      );
    }

    const resumeText = rawText.slice(0, MAX_RESUME_CHARS);
    const provider = getProvider();

    if (!provider) {
      return NextResponse.json(
        { error: "Roast service isn't available right now. Try again later." },
        { status: 503 },
      );
    }

    stage = "llm";
    const result = await provider.generateRoast(resumeText);

    // Best-effort persistence for shareable links. Never blocks the response
    // shape — if Firestore isn't configured we just return without a shareId.
    const shareId = await saveRoast(result, {
      filename: file.name,
      file_size_bytes: file.size,
      resume_chars: resumeText.length,
      provider: process.env.LLM_PROVIDER ?? "openai",
      user_agent: request.headers.get("user-agent") ?? undefined,
      referer: request.headers.get("referer") ?? undefined,
    });

    return NextResponse.json({ ...result, shareId });
  } catch (err) {
    // Log the real reason server-side, return a clean message to the user.
    console.error(`[roast] failed at ${stage}:`, err);

    if (stage === "parse") {
      return NextResponse.json(
        { error: "We couldn't open this PDF. Make sure it's not password-protected and try again." },
        { status: 422 },
      );
    }

    const { status, message } = classifyProviderError(err);
    return NextResponse.json({ error: message }, { status });
  }
}

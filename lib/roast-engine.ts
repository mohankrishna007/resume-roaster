import type { RoastResult } from "@/types/roast";

/**
 * Client-side: send the file to the roast API.
 * The server handles PDF extraction and the LLM call.
 */
export async function roastResume(file: File): Promise<RoastResult> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/roast", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    let message = "Failed to roast resume";
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return (await res.json()) as RoastResult;
}

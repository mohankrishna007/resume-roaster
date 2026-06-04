import { extractText, getDocumentProxy } from "unpdf";

/**
 * Extract plain text from a PDF buffer. Server-only.
 *
 * Uses `unpdf` — a pdfjs fork bundled with the DOM polyfills serverless
 * runtimes (Vercel, Cloudflare Workers) don't provide natively.
 */
export async function extractPdfText(data: Uint8Array): Promise<string> {
  const pdf = await getDocumentProxy(data);
  const { text } = await extractText(pdf, { mergePages: true });
  return (Array.isArray(text) ? text.join("\n") : text).trim();
}

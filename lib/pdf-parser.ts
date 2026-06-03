import { PDFParse } from "pdf-parse";

/**
 * Extract plain text from a PDF buffer. Server-only — pdf-parse needs Node.
 */
export async function extractPdfText(data: Uint8Array): Promise<string> {
  const parser = new PDFParse({ data });
  try {
    const result = await parser.getText();
    return (result.text ?? "").trim();
  } finally {
    await parser.destroy().catch(() => undefined);
  }
}

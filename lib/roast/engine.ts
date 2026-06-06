import type { RoastResult } from "@/types/roast";
import { getAuth } from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebase/client";

export interface RoastResponse {
  result: RoastResult;
  shareId: string | null;
}

async function getIdTokenIfSignedIn(): Promise<string | null> {
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  } catch {
    return null;
  }
}

/**
 * Client-side: send the file to the roast API.
 * The server handles PDF extraction and the LLM call.
 */
export async function roastResume(file: File): Promise<RoastResponse> {
  const form = new FormData();
  form.append("file", file);

  const headers: HeadersInit = {};
  const idToken = await getIdTokenIfSignedIn();
  if (idToken) headers["Authorization"] = `Bearer ${idToken}`;

  console.debug("[roast] sending resume to /api/roast", {
    fileName: file.name,
    fileSize: file.size,
    authHeader: Boolean(headers["Authorization"]),
  });
  const res = await fetch("/api/roast", {
    method: "POST",
    body: form,
    headers,
  });
  console.debug("[roast] /api/roast response", {
    status: res.status,
    statusText: res.statusText,
    redirected: res.redirected,
    url: res.url,
  });

  if (!res.ok) {
    let message = "Failed to roast resume";
    let reason: string | undefined;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
      if (body?.reason) reason = body.reason;
    } catch {
      // ignore
    }
    const err = new Error(message) as Error & { status?: number; reason?: string };
    err.status = res.status;
    err.reason = reason;
    throw err;
  }

  const body = (await res.json()) as RoastResult & { shareId?: string | null };
  const { shareId = null, ...result } = body;
  return { result: result as RoastResult, shareId };
}

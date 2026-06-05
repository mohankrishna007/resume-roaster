import "server-only";
import { randomBytes } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import type { RoastResult } from "@/types/roast";
import { getDb } from "@/lib/firebase/firestore-admin";

const COLLECTION = "roasts";

export interface RoastMeta {
  filename: string;
  file_size_bytes: number;
  resume_chars: number;
  provider: string;
  user_agent?: string;
  referer?: string;
  uid?: string;
  email?: string;
}

export interface StoredRoast {
  id: string;
  result: RoastResult;
  meta: RoastMeta & { created_at_ms: number };
}

// 10-char base32-ish id — short, URL-safe, ~50 bits of entropy
function makeShareId(): string {
  return randomBytes(7).toString("base64url").slice(0, 10);
}

/**
 * Persist a roast and return the share id. Fail-safe: if Firestore isn't
 * configured or the write fails, returns null and the caller continues without
 * a share link.
 */
export async function saveRoast(
  result: RoastResult,
  meta: RoastMeta,
): Promise<string | null> {
  const db = getDb();
  if (!db) return null;

  const id = makeShareId();
  try {
    await db.collection(COLLECTION).doc(id).set({
      result,
      meta,
      created_at: FieldValue.serverTimestamp(),
      // Denormalized for cheap list queries / dashboards. Top-level `uid`
      // lets us run `where('uid', '==', x)` to list every roast a user has
      // produced without nested-field queries.
      candidate_name: result.candidate.name ?? "Anonymous",
      overall_score: result.scores.overall,
      roast_count: result.roasts.length,
      uid: meta.uid ?? null,
      email: meta.email ?? null,
    });
    return id;
  } catch (err) {
    console.error("[roast-store] save failed:", err);
    return null;
  }
}

export async function getRoast(id: string): Promise<StoredRoast | null> {
  // Reject obviously malformed ids before hitting Firestore. Doc ids generated
  // by makeShareId() are always 10 url-safe base64 chars.
  if (!/^[A-Za-z0-9_-]{6,32}$/.test(id)) return null;

  const db = getDb();
  if (!db) return null;

  try {
    const snap = await db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) return null;
    const data = snap.data();
    if (!data?.result) return null;

    const createdAt = data.created_at?.toMillis?.() ?? Date.now();
    return {
      id,
      result: data.result as RoastResult,
      meta: { ...(data.meta as RoastMeta), created_at_ms: createdAt },
    };
  } catch (err) {
    console.error("[roast-store] fetch failed:", err);
    return null;
  }
}

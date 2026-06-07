import "server-only";
import { createHash } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase/firestore-admin";

/**
 * Server-side hard cap on roasts.
 *
 * - Guests (no Firebase ID token): 1 roast ever per IP. Keyed by sha256(ip+salt).
 * - Signed-in users: USER_LIMIT_PER_DAY per UID per UTC day.
 *
 * Backed by Firestore. If Firestore isn't configured, the limiter fails open
 * (returns allowed=true) — the app would otherwise be unusable in local dev.
 */

const COLLECTION = "rate_limits";

export const GUEST_LIMIT_TOTAL = 1;
export const USER_LIMIT_PER_DAY = 3;

export interface LimitResult {
  allowed: boolean;
  remaining: number;
  reason?: "guest_limit" | "user_daily_limit";
}

function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return (
    headers.get("x-real-ip") ??
    headers.get("cf-connecting-ip") ??
    headers.get("x-vercel-forwarded-for") ??
    "0.0.0.0"
  );
}

function hashKey(input: string): string {
  const salt = process.env.RATE_LIMIT_SALT ?? "rr-rate-limit-v1";
  return createHash("sha256").update(`${salt}:${input}`).digest("hex").slice(0, 32);
}

function utcDayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

/**
 * Atomically check and increment the appropriate counter. Returns whether the
 * request is allowed. When allowed, the counter has already been incremented
 * — callers should not double-count.
 */
export async function checkAndConsumeRoastQuota(opts: {
  uid: string | null;
  headers: Headers;
}): Promise<LimitResult> {
  const db = getDb();
  if (!db) return { allowed: true, remaining: -1 };

  if (opts.uid) {
    const day = utcDayKey();
    const docId = `user_${opts.uid}_${day}`;
    return runTxn(db, docId, USER_LIMIT_PER_DAY, "user_daily_limit");
  }

  const ip = clientIp(opts.headers);
  const docId = `guest_${hashKey(ip)}`;
  return runTxn(db, docId, GUEST_LIMIT_TOTAL, "guest_limit");
}

async function runTxn(
  db: FirebaseFirestore.Firestore,
  docId: string,
  limit: number,
  reason: "guest_limit" | "user_daily_limit",
): Promise<LimitResult> {
  const ref = db.collection(COLLECTION).doc(docId);
  try {
    return await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const current = (snap.exists ? (snap.data()?.count as number | undefined) : 0) ?? 0;
      if (current >= limit) {
        return { allowed: false, remaining: 0, reason };
      }
      tx.set(
        ref,
        {
          count: FieldValue.increment(1),
          updated_at: FieldValue.serverTimestamp(),
          limit,
        },
        { merge: true },
      );
      return { allowed: true, remaining: Math.max(0, limit - current - 1) };
    });
  } catch {
    return { allowed: true, remaining: -1 };
  }
}

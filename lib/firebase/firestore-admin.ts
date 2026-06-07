import "server-only";
import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Lazy Firebase Admin init. Returns null if env is missing so the rest of the
 * app keeps working without Firestore (e.g. local dev without creds).
 *
 * Required env:
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY    (raw PEM; \n is auto-unescaped)
 */
let cached: Firestore | null | undefined;

export function getDb(): Firestore | null {
  if (cached !== undefined) return cached;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    cached = null;
    return null;
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  try {
    const app: App = getApps().length
      ? getApp()
      : initializeApp({
          credential: cert({ projectId, clientEmail, privateKey }),
        });
    cached = getFirestore(app);
    return cached;
  } catch {
    cached = null;
    return null;
  }
}

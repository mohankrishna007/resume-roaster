import "server-only";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getApp, getApps, initializeApp, cert, type App } from "firebase-admin/app";

let cachedAuth: Auth | null | undefined;

function ensureApp(): App | null {
  if (getApps().length) return getApp();
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKeyRaw) return null;
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
  try {
    return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  } catch (err) {
    console.error("[auth-admin] init failed:", err);
    return null;
  }
}

function getAuthInstance(): Auth | null {
  if (cachedAuth !== undefined) return cachedAuth;
  const app = ensureApp();
  if (!app) {
    cachedAuth = null;
    return null;
  }
  try {
    cachedAuth = getAuth(app);
    return cachedAuth;
  } catch (err) {
    console.error("[auth-admin] getAuth failed:", err);
    cachedAuth = null;
    return null;
  }
}

export interface VerifiedUser {
  uid: string;
  email?: string;
}

/**
 * Verify a Firebase ID token from an Authorization: Bearer <token> header.
 * Returns null for missing, malformed, or invalid tokens. Never throws.
 */
export async function verifyBearerToken(authHeader: string | null): Promise<VerifiedUser | null> {
  if (!authHeader) return null;
  const match = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
  if (!match) return null;
  const auth = getAuthInstance();
  if (!auth) return null;
  try {
    const decoded = await auth.verifyIdToken(match[1], true);
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}

"use client";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signInWithCredential,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getFirebaseApp } from "./client";
import { authLog } from "@/lib/auth-log-client";

let cachedAuth: Auth | null = null;

function isMobileBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod|Mobile|Silk/i.test(navigator.userAgent || "");
}

function getAuthInstance(): Auth | null {
  if (cachedAuth) return cachedAuth;
  const app = getFirebaseApp();
  if (!app) return null;

  try {
    cachedAuth = getAuth(app);
    return cachedAuth;
  } catch {
    return null;
  }
}

export { getAuthInstance };

export function subscribeToAuth(cb: (user: User | null) => void): () => void {
  const auth = getAuthInstance();
  if (!auth) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(auth, cb);
}

async function ensurePersistence(auth: Auth): Promise<void> {
  try {
    await setPersistence(auth, browserLocalPersistence);
    authLog("debug", "[auth] persistence set", { persistence: "local" });
    return;
  } catch (err) {
    authLog("debug", "[auth] local persistence failed, falling back to session", { error: String(err) });
  }

  try {
    await setPersistence(auth, browserSessionPersistence);
    authLog("debug", "[auth] persistence set", { persistence: "session" });
  } catch (err) {
    // Some mobile/private browsers restrict all web storage.
    // Firebase can still proceed with in-memory auth for this tab.
    authLog("warn", "[auth] session persistence failed, continuing without explicit persistence", { error: String(err) });
  }
}

export async function signInWithGoogle(): Promise<User | null> {
  const auth = getAuthInstance();
  const isMobile = isMobileBrowser();
  authLog("debug", "[auth] signInWithGoogle start", { authConfigured: !!auth, isMobile });
  if (!auth) throw new Error("Google auth is not available");

  await ensurePersistence(auth);

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    authLog("debug", "[auth] signInWithPopup attempt", { isMobile });
    const result = await signInWithPopup(auth, provider);
    authLog("debug", "[auth] signInWithPopup success", { uid: result.user?.uid });
    return result.user;
  } catch (err) {
    authLog("error", "[auth] signInWithPopup failed", { error: String(err) });
    const code = err instanceof FirebaseError ? err.code : "";
    if (
      code === "auth/popup-blocked" ||
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request" ||
      code === "auth/operation-not-supported-in-this-environment" ||
      code === "auth/web-storage-unsupported" ||
      code === "auth/internal-error"
    ) {
      authLog("debug", "[auth] signInWithPopup fallback to redirect");
      try {
        await signInWithRedirect(auth, provider);
        authLog("debug", "[auth] signInWithRedirect initiated successfully");
        return null;
      } catch (redirectErr) {
        const redirectCode = redirectErr instanceof FirebaseError ? redirectErr.code : "unknown";
        const redirectMessage = redirectErr instanceof Error ? redirectErr.message : String(redirectErr);
        authLog("error", "[auth] signInWithRedirect failed", { code: redirectCode, message: redirectMessage });
        throw redirectErr;
      }
    }
    throw err;
  }
}

export async function consumeRedirectResult(): Promise<User | null> {
  const auth = getAuthInstance();
  if (!auth) {
    authLog("error", "[auth] consumeRedirectResult: auth instance unavailable");
    return null;
  }

  authLog("debug", "[auth] consumeRedirectResult start");

  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      authLog("debug", "[auth] consumeRedirectResult success", { uid: result.user.uid });
      return result.user;
    }
    authLog("debug", "[auth] consumeRedirectResult: no result (not returning from OAuth flow)");
    return null;
  } catch (err) {
    const code = err instanceof FirebaseError ? err.code : "unknown";
    const message = err instanceof Error ? err.message : String(err);
    authLog("error", "[auth] consumeRedirectResult failed", { code, message });
    return null;
  }
}

export async function signInWithGoogleIdToken(idToken: string): Promise<User | null> {
  authLog("debug", "[auth] signInWithGoogleIdToken start", { hasToken: Boolean(idToken) });
  const auth = getAuthInstance();
  if (!auth) {
    authLog("error", "[auth] signInWithGoogleIdToken failed: auth unavailable");
    return null;
  }

  await ensurePersistence(auth);

  const credential = GoogleAuthProvider.credential(idToken);
  try {
    const result = await signInWithCredential(auth, credential);
    authLog("debug", "[auth] signInWithCredential success", { uid: result.user?.uid });
    return result.user;
  } catch (err) {
    authLog("error", "[auth] signInWithCredential failed", { error: String(err) });
    throw err;
  }
}

export async function signOutUser(): Promise<void> {
  const auth = getAuthInstance();
  if (!auth) return;
  await firebaseSignOut(auth);
}

export type { User };
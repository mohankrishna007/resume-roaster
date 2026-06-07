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

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          disableAutoSelect?: () => void;
          revoke?: (hint: string, callback?: () => void) => void;
        };
      };
    };
  }
}

let cachedAuth: Auth | null = null;

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
    return;
  } catch {
    // Fallback to session persistence below.
  }

  try {
    await setPersistence(auth, browserSessionPersistence);
  } catch {
    // Some mobile/private browsers restrict all web storage.
    // Firebase can still proceed with in-memory auth for this tab.
  }
}

export async function signInWithGoogle(): Promise<User | null> {
  const auth = getAuthInstance();
  if (!auth) throw new Error("Google auth is not available");

  await ensurePersistence(auth);

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    const code = err instanceof FirebaseError ? err.code : "";
    if (
      code === "auth/popup-blocked" ||
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request" ||
      code === "auth/operation-not-supported-in-this-environment" ||
      code === "auth/web-storage-unsupported" ||
      code === "auth/internal-error"
    ) {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw err;
  }
}

export async function consumeRedirectResult(): Promise<User | null> {
  const auth = getAuthInstance();
  if (!auth) return null;

  try {
    const result = await getRedirectResult(auth);
    return result?.user ?? null;
  } catch {
    return null;
  }
}

export async function signInWithGoogleIdToken(idToken: string): Promise<User | null> {
  const auth = getAuthInstance();
  if (!auth) return null;

  await ensurePersistence(auth);

  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  const auth = getAuthInstance();
  const emailHint = auth?.currentUser?.email ?? null;

  try {
    window.google?.accounts?.id?.disableAutoSelect?.();
    if (emailHint) {
      window.google?.accounts?.id?.revoke?.(emailHint, () => {});
    }
  } catch {
    // Best-effort cleanup for Google Identity session context.
  }

  if (!auth) return;
  await firebaseSignOut(auth);
}

export type { User };
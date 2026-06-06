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
    console.debug("[auth] persistence set", { persistence: "local" });
  } catch (err) {
    console.debug("[auth] local persistence failed, falling back to session", { error: err });
    await setPersistence(auth, browserSessionPersistence);
  }
}

export async function signInWithGoogle(): Promise<User | null> {
  const auth = getAuthInstance();
  console.debug("[auth] signInWithGoogle start", { authConfigured: !!auth });
  if (!auth) throw new Error("Google auth is not available");

  await ensurePersistence(auth);

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  if (isMobileBrowser()) {
    console.debug("[auth] mobile browser detected, using redirect");
    await signInWithRedirect(auth, provider);
    return null;
  }

  try {
    const result = await signInWithPopup(auth, provider);
    console.debug("[auth] signInWithPopup success", { uid: result.user?.uid });
    return result.user;
  } catch (err) {
    console.error("[auth] signInWithPopup failed", err);
    const code = err instanceof FirebaseError ? err.code : "";
    if (
      code === "auth/popup-blocked" ||
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request" ||
      code === "auth/operation-not-supported-in-this-environment" ||
      code === "auth/web-storage-unsupported" ||
      code === "auth/internal-error"
    ) {
      console.debug("[auth] signInWithPopup fallback to redirect");
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw err;
  }
}

export async function consumeRedirectResult(): Promise<User | null> {
  const auth = getAuthInstance();
  if (!auth) return null;
  console.debug("[auth] consumeRedirectResult start");

  try {
    const result = await getRedirectResult(auth);
    console.debug("[auth] consumeRedirectResult result", { uid: result?.user?.uid });
    return result?.user ?? null;
  } catch (err) {
    console.error("[auth] consumeRedirectResult failed", err);
    return null;
  }
}

export async function signInWithGoogleIdToken(idToken: string): Promise<User | null> {
  console.debug("[auth] signInWithGoogleIdToken start", { hasToken: Boolean(idToken) });
  const auth = getAuthInstance();
  if (!auth) {
    console.error("[auth] signInWithGoogleIdToken failed: auth unavailable");
    return null;
  }

  await ensurePersistence(auth);

  const credential = GoogleAuthProvider.credential(idToken);
  try {
    const result = await signInWithCredential(auth, credential);
    console.debug("[auth] signInWithCredential success", { uid: result.user?.uid });
    return result.user;
  } catch (err) {
    console.error("[auth] signInWithCredential failed", err);
    throw err;
  }
}

export async function signOutUser(): Promise<void> {
  const auth = getAuthInstance();
  if (!auth) return;
  await firebaseSignOut(auth);
}

export type { User };
"use client";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signInWithCredential,
  getRedirectResult,
  browserPopupRedirectResolver,
  signOut as fbSignOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getFirebaseApp } from "./client";

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

export function subscribeToAuth(cb: (user: User | null) => void): () => void {
  const auth = getAuthInstance();
  if (!auth) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(auth, cb);
}

/**
 * In Codespaces / iframe-style preview origins, hosted Vercel previews, and
 * any browser that blocks 3rd-party cookies, `signInWithPopup` opens the
 * Google tab, completes OAuth, then closes without ever delivering the
 * credential back — the postMessage from the popup to the opener is
 * severed by COOP or by cookie partitioning. Full-page redirect avoids
 * that whole class of bug, so we use it whenever the host doesn't look
 * like a normal first-party origin (localhost or your production domain).
 */
function shouldUseRedirect(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return false;
  // Heuristic: previews / containerized dev URLs need redirect.
  return /\.(github\.dev|gitpod\.io|app\.github\.dev|vercel\.app|ngrok-free\.app|ngrok\.io|trycloudflare\.com|webcontainer\.io)$/i.test(host);
}

export async function signInWithGoogle(): Promise<User | null> {
  const auth = getAuthInstance();
  if (!auth) throw new Error("Sign-in isn't configured. Try again later.");
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  if (shouldUseRedirect()) {
    await signInWithRedirect(auth, provider, browserPopupRedirectResolver);
    return null; // user resolved by consumeRedirectResult after the round trip
  }

  try {
    const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
    return result.user;
  } catch (err) {
    const code = err instanceof FirebaseError ? err.code : "";
    // Any popup failure -> fall back to redirect.
    if (
      code === "auth/popup-blocked" ||
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request" ||
      code === "auth/operation-not-supported-in-this-environment" ||
      code === "auth/web-storage-unsupported" ||
      code === "auth/internal-error"
    ) {
      await signInWithRedirect(auth, provider, browserPopupRedirectResolver);
      return null;
    }
    throw err;
  }
}

/** Resolve any pending redirect-based sign-in. Safe to call once on app load. */
export async function consumeRedirectResult(): Promise<User | null> {
  const auth = getAuthInstance();
  if (!auth) return null;
  try {
    const result = await getRedirectResult(auth, browserPopupRedirectResolver);
    return result?.user ?? null;
  } catch (err) {
    // Bubble up useful diagnostics for unauthorized-domain / config issues.
    if (err instanceof FirebaseError) {
      console.error("[auth] redirect sign-in failed:", err.code, err.message);
    } else {
      console.error("[auth] redirect sign-in failed:", err);
    }
    return null;
  }
}

/** Sign in to Firebase using a Google ID token (from Google One Tap / GIS). */
export async function signInWithGoogleIdToken(idToken: string): Promise<User | null> {
  const auth = getAuthInstance();
  if (!auth) return null;
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  const auth = getAuthInstance();
  if (!auth) return;
  await fbSignOut(auth);
}

export type { User };

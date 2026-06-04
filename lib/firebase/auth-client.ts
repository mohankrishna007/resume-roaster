"use client";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  signOut as fbSignOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from "firebase/auth";
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

export async function signInWithGoogle(): Promise<User | null> {
  const auth = getAuthInstance();
  if (!auth) throw new Error("Sign-in isn't configured. Try again later.");
  const provider = new GoogleAuthProvider();
  // Force account selection popup to appear, ensuring sign-in flow works correctly.
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  return result.user;
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

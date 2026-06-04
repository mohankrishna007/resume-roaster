"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  measurementId?: string;
}

function readConfig(): FirebaseConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  // Auth + analytics both need these four. Without them we no-op everywhere.
  if (!apiKey || !authDomain || !projectId || !appId) return null;
  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

/**
 * Browser-only shared Firebase app instance. Returns null when env is missing
 * or when called server-side. Safe to call repeatedly — Firebase de-dupes init.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  const cfg = readConfig();
  if (!cfg) return null;
  try {
    return getApps().length ? getApp() : initializeApp(cfg);
  } catch {
    return null;
  }
}

export function hasFirebaseConfig(): boolean {
  return readConfig() !== null;
}

/**
 * Firebase Analytics — client-only, lazy-initialised, fail-silent.
 *
 * Why this shape:
 * - Firebase Web SDK only works in the browser (uses window/IndexedDB).
 * - Loading it eagerly hurts LCP — we lazy-import on first `track()` call.
 * - Missing/incomplete env vars => analytics simply no-ops; the app keeps working.
 *
 * Env vars (all NEXT_PUBLIC_ since they ship to the client by design):
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 *   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID  (required for GA4 events)
 */

import type { Analytics } from "firebase/analytics";

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

let analyticsPromise: Promise<Analytics | null> | null = null;

function readConfig() {
  const cfg = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
  // GA4 needs measurementId; without apiKey + projectId Firebase won't initialise.
  if (!cfg.apiKey || !cfg.projectId || !cfg.appId || !cfg.measurementId) {
    return null;
  }
  return cfg;
}

async function getAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (analyticsPromise) return analyticsPromise;

  analyticsPromise = (async () => {
    const cfg = readConfig();
    if (!cfg) return null;
    try {
      const [{ initializeApp, getApps, getApp }, analyticsMod] = await Promise.all([
        import("firebase/app"),
        import("firebase/analytics"),
      ]);
      const supported = await analyticsMod.isSupported();
      if (!supported) return null;
      const app = getApps().length ? getApp() : initializeApp(cfg);
      return analyticsMod.getAnalytics(app);
    } catch {
      // analytics is best-effort — never let it break the UI
      return null;
    }
  })();

  return analyticsPromise;
}

/**
 * Fire a named analytics event. No-op if Firebase isn't configured or supported
 * (private browsing, blockers, SSR). Safe to call from anywhere.
 */
export function track(event: string, params?: AnalyticsParams): void {
  void (async () => {
    const analytics = await getAnalytics();
    if (!analytics) return;
    try {
      const { logEvent } = await import("firebase/analytics");
      logEvent(analytics, event, params);
    } catch {
      // swallow — analytics must never throw into the app
    }
  })();
}

/** Eagerly warm the SDK so the first user action records faster. */
export function initAnalytics(): void {
  void getAnalytics();
}

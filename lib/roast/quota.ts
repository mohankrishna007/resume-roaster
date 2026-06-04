"use client";

/**
 * Per-device guest roast quota. Guests get one free roast; from the second
 * roast onward they must sign in. Stored in localStorage (per browser
 * profile) — not a security boundary, just gentle friction. Signed-in users
 * bypass this entirely (enforced at the call site).
 */

const KEY = "rr.guest.roast_count.v1";
export const GUEST_ROAST_LIMIT = 1;

function safeStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getGuestRoastCount(): number {
  const store = safeStorage();
  if (!store) return 0;
  const raw = store.getItem(KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function incrementGuestRoastCount(): number {
  const store = safeStorage();
  if (!store) return 0;
  const next = getGuestRoastCount() + 1;
  try {
    store.setItem(KEY, String(next));
  } catch {
    // ignore quota / privacy-mode errors
  }
  return next;
}

export function hasReachedGuestLimit(): boolean {
  return getGuestRoastCount() >= GUEST_ROAST_LIMIT;
}

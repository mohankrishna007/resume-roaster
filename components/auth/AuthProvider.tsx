"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { signInWithGoogle, signOutUser, subscribeToAuth, consumeRedirectResult, type User } from "@/lib/firebase/auth-client";
import { track } from "@/lib/analytics";

interface AuthState {
  user: User | null;
  /** True until we know the initial auth state — avoids gating flicker. */
  ready: boolean;
  signingIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const unsub = subscribeToAuth((u) => {
      setUser(u);
      setReady(true);
    });
    // Resolve a pending redirect-based Google sign-in (popup fallback path).
    void consumeRedirectResult().then((u) => {
      if (u) {
        track("sign_in_succeeded", { provider: "google_redirect", uid: u.uid });
      }
    });
    return () => unsub();
  }, []);

  const signIn = useCallback(async () => {
    if (signingIn) return;
    setSigningIn(true);
    track("sign_in_started", { provider: "google" });
    try {
      const u = await signInWithGoogle();
      if (u) {
        track("sign_in_succeeded", {
          provider: "google",
          uid: u.uid,
        });
      }
      // If u is null, a full-page redirect was kicked off — the page is
      // about to unload, so keep `signingIn` true to avoid a UI flash.
    } catch (err) {
      console.error("[auth] sign-in failed:", err);
      track("sign_in_failed", {
        provider: "google",
        message: (err as Error)?.message?.slice(0, 120) ?? "unknown",
      });
      setSigningIn(false);
      return;
    }
    setSigningIn(false);
  }, [signingIn]);

  const signOut = useCallback(async () => {
    await signOutUser();
    track("sign_out");
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, ready, signingIn, signIn, signOut }),
    [user, ready, signingIn, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Fallback so components don't crash if mounted outside provider (e.g. tests).
    return {
      user: null,
      ready: true,
      signingIn: false,
      signIn: async () => {},
      signOut: async () => {},
    };
  }
  return ctx;
}

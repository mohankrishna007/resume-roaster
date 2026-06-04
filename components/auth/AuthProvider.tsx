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
import { signInWithGoogle, signOutUser, subscribeToAuth, type User } from "@/lib/firebase/auth-client";
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
    } catch (err) {
      track("sign_in_failed", {
        provider: "google",
        message: (err as Error)?.message?.slice(0, 120) ?? "unknown",
      });
    } finally {
      setSigningIn(false);
    }
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

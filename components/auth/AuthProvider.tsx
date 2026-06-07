"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { signInWithGoogle, signOutUser, subscribeToAuth, consumeRedirectResult, type User } from "@/lib/firebase/auth-client";

interface AuthState {
  user: User | null;
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
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let active = true;
    let unsubscribe: () => void = () => {};

    void (async () => {
      try {
        const resultUser = await consumeRedirectResult();
        if (active && resultUser) {
          setUser(resultUser);
        }
      } catch {
        // Ignore redirect result errors and continue with listener subscription.
      }

      if (!active) return;

      // Subscribe only after redirect processing to avoid redirect-result races.
      unsubscribe = subscribeToAuth((u) => {
        setUser(u);
        setReady(true);
      });
    })();

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signIn = useCallback(async () => {
    if (signingIn) return;
    setSigningIn(true);

    try {
      await signInWithGoogle();
    } catch {
      // Only reset signingIn on actual error (not redirect)
      // If sign-in failed and user stayed on page, they can retry
      setSigningIn(false);
    }
    // No finally block — intentional. On mobile redirect, signingIn stays true
    // until page navigates away. On success, auth listener updates state.
  }, [signingIn]);

  const signOut = useCallback(async () => {
    try {
      await signOutUser();
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch {
      // Ignore sign-out errors.
    }
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

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
import { authLog } from "@/lib/auth-log-client";

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
          authLog("debug", "[auth] consumeRedirectResult succeeded", { uid: resultUser.uid });
          setUser(resultUser);
        }
      } catch (err) {
        authLog("error", "[auth] consumeRedirectResult threw", { error: String(err) });
      }

      if (!active) return;

      // Subscribe only after redirect processing to avoid redirect-result races.
      unsubscribe = subscribeToAuth((u) => {
        authLog("debug", "[auth] onAuthStateChanged", { user: u?.uid });
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
      const signedInUser = await signInWithGoogle();
      // On mobile, signInWithRedirect navigates away — we never reach here
      // On desktop, we resolve immediately with a user or null
      if (signedInUser) {
        authLog("debug", "[auth] signIn succeeded", { uid: signedInUser.uid });
      }
    } catch (err) {
      // Only reset signingIn on actual error (not redirect)
      // If sign-in failed and user stayed on page, they can retry
      authLog("error", "[auth] sign-in failed", { error: String(err) });
      setSigningIn(false);
    }
    // No finally block — intentional. On mobile redirect, signingIn stays true
    // until page navigates away. On success, auth listener updates state.
  }, [signingIn]);

  const signOut = useCallback(async () => {
    try {
      await signOutUser();
      authLog("debug", "[auth] signOut succeeded");
    } catch (err) {
      authLog("error", "[auth] sign-out failed", { error: String(err) });
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

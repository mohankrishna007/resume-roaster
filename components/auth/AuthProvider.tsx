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
  const redirectResultConsumed = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((u) => {
      console.debug("[auth] onAuthStateChanged", { user: u?.uid });
      setUser(u);
      setReady(true);
    });

    if (!redirectResultConsumed.current) {
      redirectResultConsumed.current = true;
      void (async () => {
        try {
          const resultUser = await consumeRedirectResult();
          if (resultUser) {
            setUser(resultUser);
            console.debug("[auth] consumeRedirectResult succeeded", { uid: resultUser.uid });
          }
        } catch (err) {
          console.error("[auth] consumeRedirectResult threw", err);
        }
      })();
    }

    return unsubscribe;
  }, []);

  const signIn = useCallback(async () => {
    if (signingIn) return;
    setSigningIn(true);

    try {
      const signedInUser = await signInWithGoogle();
      if (signedInUser) {
        console.debug("[auth] signIn succeeded", { uid: signedInUser.uid });
      }
    } catch (err) {
      console.error("[auth] sign-in failed:", err);
    } finally {
      setSigningIn(false);
    }
  }, [signingIn]);

  const signOut = useCallback(async () => {
    try {
      await signOutUser();
      console.debug("[auth] signOut succeeded");
    } catch (err) {
      console.error("[auth] sign-out failed", err);
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

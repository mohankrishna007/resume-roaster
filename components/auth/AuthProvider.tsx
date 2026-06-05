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
import { cleanupGoogleIdentityServices } from "./GoogleOneTap";
import { SignOutConfirmDialog } from "./SignOutConfirmDialog";

interface AuthState {
  user: User | null;
  /** True until we know the initial auth state — avoids gating flicker. */
  ready: boolean;
  signingIn: boolean;
  /** Opens the sign-out confirmation modal. Does not sign out directly. */
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

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

  // Surface the confirmation modal instead of signing out immediately.
  const signOut = useCallback(async () => {
    if (!user || signingOut) return;
    setSignOutOpen(true);
  }, [user, signingOut]);

  const cancelSignOut = useCallback(() => {
    if (signingOut) return;
    setSignOutOpen(false);
  }, [signingOut]);

  const confirmSignOut = useCallback(async () => {
    if (signingOut) return;
    setSigningOut(true);
    track("sign_out");
    try {
      // Tear down Google Identity Services state so the next session is
      // truly fresh: disable silent auto-select and cancel any pending
      // FedCM request.
      cleanupGoogleIdentityServices();
      await signOutUser();
    } catch (err) {
      console.error("[auth] sign-out failed:", err);
      track("sign_out_failed", {
        message: (err as Error)?.message?.slice(0, 120) ?? "unknown",
      });
      setSigningOut(false);
      setSignOutOpen(false);
      return;
    }
    // Hard reload to flush any in-memory caches (GIS module flags,
    // component-local state, etc.) and land on a clean signed-out page.
    if (typeof window !== "undefined") {
      window.location.reload();
    } else {
      setSigningOut(false);
      setSignOutOpen(false);
    }
  }, [signingOut]);

  const value = useMemo<AuthState>(
    () => ({ user, ready, signingIn, signIn, signOut }),
    [user, ready, signingIn, signIn, signOut],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SignOutConfirmDialog
        open={signOutOpen}
        busy={signingOut}
        onConfirm={confirmSignOut}
        onCancel={cancelSignOut}
      />
    </AuthContext.Provider>
  );
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

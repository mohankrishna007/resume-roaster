"use client";

import { useEffect } from "react";
import Script from "next/script";
import { signInWithGoogleIdToken } from "@/lib/firebase/auth-client";
import { track } from "@/lib/analytics";
import { useAuth } from "./AuthProvider";

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    use_fedcm_for_prompt?: boolean;
    itp_support?: boolean;
  }) => void;
  prompt: () => void;
  cancel: () => void;
  disableAutoSelect: () => void;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleAccountsId;
      };
    };
  }
}

const GIS_SRC = "https://accounts.google.com/gsi/client";

/**
 * Google One Tap floating prompt. Auto-displays when the user already has an
 * active Google session in this browser, so signing in is a single click —
 * no popup, no account chooser. Falls back silently if the GIS script is
 * blocked or no client id is configured.
 *
 * Requires NEXT_PUBLIC_GOOGLE_CLIENT_ID — the Web client id from
 * Google Cloud Console (or auto-created by Firebase, found under
 * Firebase Console -> Authentication -> Sign-in method -> Google ->
 * Web SDK configuration).
 */
export function GoogleOneTap() {
  const { user, ready } = useAuth();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!ready || user || !clientId) return;
    if (typeof window === "undefined") return;

    let cancelled = false;
    const tryInit = () => {
      const gid = window.google?.accounts?.id;
      if (!gid) return false;
      try {
        gid.initialize({
          client_id: clientId,
          auto_select: true,
          cancel_on_tap_outside: false,
          use_fedcm_for_prompt: true,
          itp_support: true,
          callback: async (response) => {
            if (cancelled || !response.credential) return;
            track("one_tap_credential_received");
            try {
              const u = await signInWithGoogleIdToken(response.credential);
              if (u) {
                track("sign_in_succeeded", {
                  provider: "google_one_tap",
                  uid: u.uid,
                });
              }
            } catch (err) {
              track("sign_in_failed", {
                provider: "google_one_tap",
                message: (err as Error)?.message?.slice(0, 120) ?? "unknown",
              });
            }
          },
        });
        gid.prompt();
        return true;
      } catch {
        return false;
      }
    };

    // GIS may load after this effect runs; poll briefly until it's ready.
    if (!tryInit()) {
      const interval = window.setInterval(() => {
        if (tryInit() || cancelled) window.clearInterval(interval);
      }, 300);
      window.setTimeout(() => window.clearInterval(interval), 5000);
    }

    return () => {
      cancelled = true;
      try {
        window.google?.accounts?.id?.cancel();
      } catch {
        // ignore
      }
    };
  }, [user, ready, clientId]);

  if (!clientId || user) return null;
  return <Script src={GIS_SRC} strategy="afterInteractive" />;
}

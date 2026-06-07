"use client";

import { useEffect } from "react";
import { signInWithGoogleIdToken } from "@/lib/firebase/auth-client";
import { authLog } from "@/lib/auth-log-client";
import { useAuth } from "./AuthProvider";

const GIS_SRC = "https://accounts.google.com/gsi/client";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            auto_select?: boolean;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

function loadGoogleIdentityScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SRC}"]`);
    if (existing) {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Google One Tap script failed to load")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google One Tap script failed to load"));
    document.body.appendChild(script);
  });
}

function isMobileBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod|Mobile|Silk/i.test(navigator.userAgent || "");
}

export function GoogleOneTap() {
  const { user, ready } = useAuth();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!ready || user || !clientId) return;
    if (typeof window === "undefined") return;
    // Google One Tap doesn't work reliably on mobile; skip initialization
    if (isMobileBrowser()) {
      authLog("debug", "[auth] GoogleOneTap skipped on mobile browser");
      return;
    }

    let active = true;

    const initOneTap = async () => {
      try {
        await loadGoogleIdentityScript();
      } catch (err) {
        authLog("error", "[auth] GoogleOneTap script load failed", { error: String(err) });
        return;
      }

      if (!active) return;
      const gid = window.google?.accounts?.id;
      if (!gid) {
        authLog("error", "[auth] GoogleOneTap initialization failed: google.accounts.id unavailable");
        return;
      }

      try {
        const supportsFedCM =
          "FederatedCredential" in window ||
          (navigator.credentials && "preventSilentAccess" in navigator.credentials);

        gid.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (!response?.credential) return;
            try {
              await signInWithGoogleIdToken(response.credential);
            } catch (err) {
              authLog("error", "[auth] GoogleOneTap credential exchange failed", { error: String(err) });
            }
          },
          auto_select: true,
          use_fedcm_for_prompt: supportsFedCM,
        });
        gid.prompt();
      } catch (err) {
        authLog("error", "[auth] GoogleOneTap prompt failed", { error: String(err) });
      }
    };

    void initOneTap();

    return () => {
      active = false;
    };
  }, [ready, user, clientId]);

  if (!clientId || user) return null;
  return null;
}

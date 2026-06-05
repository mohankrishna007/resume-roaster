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
  prompt: (
    listener?: (notification: PromptMomentNotification) => void
  ) => void;
  cancel: () => void;
  disableAutoSelect: () => void;
}

interface PromptMomentNotification {
  // Only dismissed-moment APIs remain supported once FedCM is mandatory.
  // The display_moment / skipped_moment status methods are deprecated and
  // GSI logs a migration warning if they're called. See
  // https://developers.google.com/identity/gsi/web/guides/fedcm-migration
  isDismissedMoment: () => boolean;
  getDismissedReason: () => string;
  getMomentType: () => string;
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

// Module-level guard: google.accounts.id is global page state, so initialize()
// must be called at most once per page load. Calling it again — even after
// sign-out — triggers GIS's "initialize() is called multiple times" warning.
// To re-show the prompt later (e.g. after sign-out) call prompt() again; do
// not re-initialize.
let gisInitiated = false;
// Separate guard for prompt(). FedCM only allows one outstanding
// navigator.credentials.get() at a time, so a second prompt() call while
// the first is still pending throws NotAllowedError. We must wait for the
// prompt to resolve (dismiss / credential / error) before calling it again.
let gisPromptInFlight = false;

/**
 * Tear down the in-memory state of the Google Identity Services library on
 * sign-out. Disables silent auto-select (so the next prompt requires an
 * explicit user gesture) and cancels any pending FedCM request. Safe to
 * call when GIS isn't loaded. Intended to be paired with a full page
 * reload, which gives us a truly fresh state.
 */
export function cleanupGoogleIdentityServices(): void {
  if (typeof window === "undefined") return;
  const gid = window.google?.accounts?.id;
  if (!gid) return;
  try {
    gid.disableAutoSelect();
  } catch {
    // ignore
  }
  try {
    gid.cancel();
  } catch {
    // ignore
  }
}

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
    let intervalId: number | undefined;
    let timeoutId: number | undefined;

    const showPrompt = (gid: GoogleAccountsId) => {
      // FedCM permits only one navigator.credentials.get() at a time. Bail
      // if a prior prompt() hasn't resolved yet — otherwise GSI logs
      // "NotAllowedError: Only one navigator.credentials.get request may be
      // outstanding at one time".
      if (gisPromptInFlight) return;
      gisPromptInFlight = true;
      gid.prompt((notification) => {
        // The notification listener fires for terminal moments (dismissed,
        // credential issued, error), so the in-flight FedCM request is done
        // by the time we get here.
        gisPromptInFlight = false;
        // Only dismissed-moment status APIs remain supported once FedCM is
        // mandatory; the older display/skipped APIs trigger a migration
        // warning from GSI.
        try {
          if (notification.isDismissedMoment()) {
            track("one_tap_dismissed", {
              reason: notification.getDismissedReason(),
            });
          }
        } catch {
          // notification API surface varies between GIS versions
        }
      });
    };

    const tryInit = () => {
      const gid = window.google?.accounts?.id;
      if (!gid) return false;
      try {
        if (!gisInitiated) {
          gid.initialize({
            client_id: clientId,
            auto_select: true,
            cancel_on_tap_outside: false,
            // FedCM is now required by Chrome for One Tap; opting out is
            // deprecated and triggers spurious abort warnings.
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
          gisInitiated = true;
        }
        showPrompt(gid);
        return true;
      } catch {
        return false;
      }
    };

    // GIS may load after this effect runs; poll briefly until it's ready.
    if (!tryInit()) {
      intervalId = window.setInterval(() => {
        if (cancelled || tryInit()) {
          if (intervalId !== undefined) window.clearInterval(intervalId);
        }
      }, 300);
      timeoutId = window.setTimeout(() => {
        if (intervalId !== undefined) window.clearInterval(intervalId);
      }, 5000);
    }

    return () => {
      cancelled = true;
      if (intervalId !== undefined) window.clearInterval(intervalId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      // Intentionally do NOT call google.accounts.id.cancel() here. Cancelling
      // an in-flight FedCM request is what produces the AbortError log, and
      // the prompt cleans itself up when the user dismisses it or signs in.
    };
  }, [user, ready, clientId]);

  if (!clientId || user) return null;
  return <Script src={GIS_SRC} strategy="afterInteractive" />;
}

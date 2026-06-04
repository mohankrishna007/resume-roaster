"use client";

import { Lock, Flame } from "lucide-react";
import { useAuth } from "./AuthProvider";

/**
 * Banner shown in place of locked roasts. CTA triggers Google sign-in via the
 * AuthProvider context. Renders nothing if the user is already signed in.
 */
export function SignInGate() {
  const { user, signingIn, signIn } = useAuth();
  if (user) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-[var(--accent)] bg-gradient-to-br from-[#1a0f08] via-[#160a14] to-[#0b0810] p-5 sm:p-7 md:p-10">
      {/* soft glow blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[var(--accent)]/30 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-[var(--accent-pink)]/25 blur-[110px]"
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 md:gap-7">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)]/15 ring-1 ring-[var(--accent)]/30 sm:h-14 sm:w-14">
          <Lock className="h-5 w-5 text-[var(--accent)] sm:h-6 sm:w-6" />
        </div>

        <div className="flex-1">
          <p className="kicker">the spicy bits are locked</p>
          <h3 className="font-display mt-2 text-xl font-bold leading-tight sm:text-2xl md:text-3xl">
            Sign in to see what your resume{" "}
            <span className="marker-pink marker">really</span> said.
          </h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-[var(--ink-soft)]">
            Free. One click. We just need to know you&apos;re a human — not a
            scraper farming roasts for tweets.
          </p>
        </div>

        <button
          onClick={signIn}
          disabled={signingIn}
          className="btn-hot relative shrink-0 disabled:cursor-wait disabled:opacity-70"
        >
          {signingIn ? (
            <>
              <Flame className="h-4 w-4 animate-pulse" />
              Opening…
            </>
          ) : (
            <>
              <GoogleMark />
              Continue with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 18 18"
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.71-1.57 2.68-3.88 2.68-6.61z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}

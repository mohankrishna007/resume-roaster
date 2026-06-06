"use client";

import { useEffect, useRef } from "react";
import { LogOut, X } from "lucide-react";

interface SignOutConfirmDialogProps {
  open: boolean;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation modal shown before signing the user out. Matches the
 * sticky-bar button language (btn-bar / btn-bar-primary / btn-bar-ghost)
 * so it feels native to the rest of the UI.
 */
export function SignOutConfirmDialog({
  open,
  busy,
  onConfirm,
  onCancel,
}: SignOutConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);
    // Move focus to the destructive action so Enter confirms.
    const t = window.setTimeout(() => confirmRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signout-title"
      aria-describedby="signout-desc"
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
    >
      <button
        type="button"
        aria-label="Cancel"
        onClick={busy ? undefined : onCancel}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
        tabIndex={-1}
      />
      <div
        className="relative w-full max-w-md rounded-2xl border border-[var(--line-strong)] bg-[var(--bg-warm)] p-6 shadow-[6px_6px_0_0_rgba(0,0,0,0.55)]"
      >
        <button
          type="button"
          onClick={busy ? undefined : onCancel}
          className="absolute right-3 top-3 rounded-full p-1.5 text-[var(--ink-mute)] transition hover:text-[var(--ink)]"
          aria-label="Close"
          disabled={busy}
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
            <LogOut className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2
              id="signout-title"
              className="font-[var(--font-display)] text-lg font-extrabold tracking-tight text-[var(--ink)]"
            >
              Sign out of Resume Roaster?
            </h2>
            <p
              id="signout-desc"
              className="mt-1.5 text-sm text-[var(--ink-soft)]"
            >
              You&apos;ll need to sign back in to roast another resume. The page
              will reload once you sign out.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn-bar btn-bar-ghost"
            disabled={busy}
          >
            Stay signed in
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className="btn-bar btn-bar-primary"
            disabled={busy}
          >
            <LogOut className="h-3.5 w-3.5" />
            {busy ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}

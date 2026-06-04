"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";
import { useAuth } from "./AuthProvider";

/**
 * Compact signed-in indicator for the landing masthead.
 * Renders nothing while auth state is loading or when signed-out.
 */
export function AuthBadge() {
  const { user, ready, signOut } = useAuth();
  if (!ready || !user) return null;

  const name = user.displayName?.split(" ")[0] ?? user.email ?? "you";
  const initial = (user.displayName ?? user.email ?? "?").trim().charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/[0.04] py-1 pl-1 pr-3">
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 rounded-full"
            unoptimized
          />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[0.7rem] font-bold text-[var(--accent)]">
            {initial}
          </span>
        )}
        <span className="max-w-[10ch] truncate text-xs font-semibold text-[var(--ink-soft)] sm:max-w-[18ch]">
          {name}
        </span>
      </div>
      <button
        onClick={signOut}
        className="rounded-full border border-[var(--line)] bg-white/[0.04] p-1.5 text-[var(--ink-mute)] transition hover:text-[var(--ink)]"
        title={user.email ?? "Sign out"}
        aria-label="Sign out"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

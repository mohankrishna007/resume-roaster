"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";
import { SignOutConfirmDialog } from "./SignOutConfirmDialog";

/**
 * Compact signed-in indicator for the landing masthead.
 * Renders avatar-only button that opens a dropdown menu on click.
 * Renders nothing while auth state is loading or when signed-out.
 */
export function AuthBadge() {
  const { user, ready, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const timeout = window.setTimeout(() => {
      setConfirmOpen(false);
      setBusy(false);
    }, 0);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [user]);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleSignOutClick = useCallback(() => {
    setConfirmOpen(true);
    setMenuOpen(false);
  }, []);

  const closeConfirm = useCallback(() => {
    if (!busy) setConfirmOpen(false);
  }, [busy]);

  const handleConfirm = useCallback(async () => {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
      setConfirmOpen(false);
    }
  }, [signOut]);

  if (!ready || !user) return null;

  const initial = (user.displayName ?? user.email ?? "?").trim().charAt(0).toUpperCase();

  return (
    <>
      <div ref={menuRef} className="relative">
        {/* Avatar button */}
        <button
          type="button"
          onClick={toggleMenu}
          className="rounded-full border border-[var(--line)] bg-white/[0.04] p-1.5 transition hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          title={user.email ?? "Profile"}
          aria-label="Open profile menu"
          aria-expanded={menuOpen}
        >
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
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[0.65rem] font-bold text-[var(--accent)]">
              {initial}
            </span>
          )}
        </button>

        {/* Dropdown menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-2 w-72 rounded-lg border border-[var(--line)] bg-white/[0.05] backdrop-blur-md shadow-lg z-50"
            >
              {/* User profile section */}
              <div className="border-b border-[var(--line)] px-4 py-4">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full"
                      unoptimized
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/20 text-sm font-bold text-[var(--accent)]">
                      {initial}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[var(--ink)] truncate">
                      {user.displayName ?? "User"}
                    </p>
                    <p className="text-xs text-[var(--ink-mute)] truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sign out button */}
              <button
                type="button"
                onClick={handleSignOutClick}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[var(--accent-lime)] hover:text-[var(--accent-lime)] hover:bg-[var(--accent-lime)]/10 transition rounded-b-lg font-semibold"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SignOutConfirmDialog
        open={confirmOpen}
        busy={busy}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
    </>
  );
}

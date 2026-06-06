import type { Metadata } from "next";
import Link from "next/link";
import { Flame, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Down for a tune-up · Resume Roaster",
  description: "We're polishing the roaster. Back in a bit.",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#0b0810] px-6 py-16 text-[var(--ink)]">
      {/* soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 55%), radial-gradient(circle at 70% 80%, color-mix(in oklab, var(--accent-pink) 14%, transparent), transparent 55%)",
        }}
      />

      <div className="relative z-10 max-w-xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">
          <Wrench className="h-3.5 w-3.5 text-[var(--accent-lime)]" />
          quick tune-up
        </div>

        <h1 className="font-display mt-7 text-[2rem] font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          The roaster is{" "}
          <span className="marker-pink marker">cooling down</span>.
        </h1>

        <p className="mt-6 text-base leading-7 text-[var(--ink-soft)] sm:text-lg">
          We&apos;re tightening a few bolts so the next roast lands harder.
          Back in a few minutes — your resume can wait one more day.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-black transition hover:brightness-110"
          >
            <Flame className="h-4 w-4" />
            Try again
          </Link>
          <Link
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-[var(--ink-mute)] transition hover:text-[var(--ink)]"
          >
            updates →
          </Link>
        </div>

        <p className="mt-10 text-xs text-[var(--ink-mute)]">
          if this sticks around, the LLM is probably crying. give it a sec.
        </p>
      </div>
    </main>
  );
}

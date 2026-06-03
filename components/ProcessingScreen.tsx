"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  "opening the pdf…",
  "counting the buzzwords…",
  "side-eyeing every metric…",
  "checking if 'passionate' shows up… yep.",
  "reading between the bullet points…",
  "deciding how honest to be…",
  "okay — writing it.",
];

export function ProcessingScreen({ filename }: { filename?: string }) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setMsgIdx((p) => Math.min(p + 1, STEPS.length - 1)),
      1100
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl items-center px-5 sm:px-8">
      <div className="w-full">
        <p className="kicker">reading {filename ?? "your resume"}</p>

        <h2 className="font-display mt-5 text-4xl font-bold leading-[1.15] sm:text-6xl">
          One sec —
          <br />
          <span className="marker">forming an opinion.</span>
        </h2>

        {/* a quiet, conversational checklist instead of a progress bar card */}
        <div className="mt-12 space-y-3.5">
          {STEPS.slice(0, msgIdx + 1).map((step, i) => (
            <AnimatePresence key={i}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                <p
                  className={`text-lg ${
                    i === msgIdx
                      ? "text-[var(--ink)]"
                      : "text-[var(--ink-mute)] line-through decoration-[var(--ink-mute)]/40"
                  }`}
                >
                  {step}
                  {i === msgIdx && <span className="ml-1 animate-pulse">▍</span>}
                </p>
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import type { Win } from "@/types/roast";

interface PositivePointsProps {
  wins: Win[];
}

export function PositivePoints({ wins }: PositivePointsProps) {
  if (!wins || wins.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <p className="kicker">but real talk — these are good</p>
      <h2 className="font-display mt-3 text-[1.85rem] font-bold leading-[1.12] sm:text-5xl sm:leading-[1.05]">
        Stuff you actually{" "}
        <span className="marker-green marker">got right.</span>
      </h2>
      <p className="mt-3 max-w-xl text-[var(--ink-soft)]">
        {wins.length} {wins.length === 1 ? "line" : "lines"} the recruiter actually slows down for.
      </p>

      <div className="mt-10 space-y-10 sm:space-y-12">
        {wins.map((win, idx) => {
          const lineNum = String(idx + 1).padStart(2, "0");
          // legacy/string-shaped wins may only have the callout — render a
          // compact card instead of an empty resume-line block.
          const onlyCallout = !win.resume_line && !win.reaction && !!win.callout;

          if (onlyCallout) {
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: Math.min(idx * 0.06, 0.3), duration: 0.4 }}
                className="annotation sev-good"
              >
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--ink-mute)]">
                  W{lineNum} · actual praise
                </p>
                <p className="font-display mt-2 text-xl leading-[1.3] font-semibold sm:text-[1.4rem]">
                  {win.callout}
                </p>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                delay: Math.min(idx * 0.06, 0.3),
                duration: 0.4,
                ease: "easeOut",
              }}
              className="grid gap-5 md:grid-cols-[1fr_1.15fr] md:gap-6 md:items-start"
            >
              {win.resume_line ? (
                <div className="doc-line sev-good">
                  <div className="sev-stamp sev-good">
                    <Sparkles className="h-3 w-3" />
                    actually good
                  </div>
                  <div className="doc-meta">
                    <span className="doc-num">W{lineNum}</span>
                    <span>your resume said</span>
                  </div>
                  <p className="doc-text">
                    <span className="doc-text-highlight">
                      &ldquo;{win.resume_line}&rdquo;
                    </span>
                    <span className="annot-caret md:hidden" aria-hidden>
                      ↘
                    </span>
                  </p>
                </div>
              ) : (
                <div />
              )}

              <div className="annotation sev-good">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--ink-mute)]">
                  <Heart className="mr-1 inline h-3 w-3 -translate-y-px text-[var(--accent-lime)]" />
                  actual praise
                </p>
                {win.reaction && (
                  <p className="mt-2 text-sm font-semibold text-[var(--ink-soft)]">
                    {win.reaction}
                  </p>
                )}
                {win.callout && (
                  <p className="font-display mt-2 text-xl leading-[1.3] font-semibold sm:text-[1.4rem]">
                    {win.callout}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

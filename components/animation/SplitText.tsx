"use client";

import { motion, type Variants } from "framer-motion";
import { useMemo, type ReactNode } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

/**
 * Word-level reveal — splits a string into words, animates each in with a soft
 * lift + blur. Per-word (not per-letter) keeps it readable and avoids layout
 * shift on small screens.
 */
export function SplitText({ text, className, delay = 0, stagger = 0.04 }: SplitTextProps) {
  const words = useMemo(() => text.split(/(\s+)/), [text]);

  const container: Variants = {
    hidden: {},
    show: {
      transition: { delayChildren: delay, staggerChildren: stagger },
    },
  };
  const word: Variants = {
    hidden: { opacity: 0, y: "0.6em", filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
      style={{ display: "inline" }}
    >
      {words.map((w, i) =>
        /^\s+$/.test(w) ? (
          <span key={i}>{w}</span>
        ) : (
          <span key={i} style={{ display: "inline-block", overflow: "hidden" }}>
            <motion.span variants={word} style={{ display: "inline-block" }}>
              {w as ReactNode}
            </motion.span>
          </span>
        )
      )}
    </motion.span>
  );
}

"use client";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Win } from "@/types/roast";
import { FADE_UP_VIEWPORT } from "@/lib/motion";
import { SectionKicker } from "../ui/SectionKicker";
import { ResumeLineCard } from "./ResumeLineCard";

interface PositivePointsProps {
  wins: Win[];
  /** When set, render only the first N wins. Used by the sign-in gate. */
  maxWins?: number;
}

export function PositivePoints({ wins, maxWins }: PositivePointsProps) {
  if (!wins || wins.length === 0) return null;

  const visibleWins =
    typeof maxWins === "number" && maxWins < wins.length
      ? wins.slice(0, maxWins)
      : wins;
  const hiddenCount = wins.length - visibleWins.length;

  return (
    <motion.section {...FADE_UP_VIEWPORT}>
      <SectionKicker>but real talk — these are good</SectionKicker>
      <h2 className="font-display mt-3 text-[1.5rem] font-bold leading-[1.12] sm:text-3xl md:text-4xl lg:text-5xl lg:leading-[1.05]">
        Stuff you actually <span className="marker-green marker">got right.</span>
      </h2>
      <p className="mt-3 max-w-xl text-[var(--ink-soft)]">
        {hiddenCount > 0
          ? "A few of the lines that actually land — sign in to see the rest."
          : `${wins.length} ${wins.length === 1 ? "line" : "lines"} the recruiter actually slows down for.`}
      </p>

      <div className="mt-10 space-y-8 sm:space-y-10 lg:space-y-12">
        {visibleWins.map((win, idx) => (
          <ResumeLineCard
            key={idx}
            severity="actually_good"
            index={idx}
            numberPrefix="W"
            resumeLine={win.resume_line || undefined}
            annotationLabel={
              <>
                <Heart className="mr-1 inline h-3 w-3 -translate-y-px text-[var(--accent-lime)]" />
                actual praise
              </>
            }
            reaction={win.reaction}
            body={win.callout}
          />
        ))}
      </div>
    </motion.section>
  );
}
